// ---- bug presence: tune how sparse/dense the sightings feel ----
const BASE_CONCURRENT_BUGS = 1;     // resting bug count — keep low, this is a glimpse not a swarm
const PEAK_CONCURRENT_BUGS = 200;    // bug count while a hover-invert transition is boosting the swarm
const SWARM_EASE = 0.02;            // per-frame lerp toward the target count — bigger = snappier ramp
const BUG_LIFETIME_MIN_FRAMES = 60;  // ~2s at 30fps — how long a spawned bug stays before vanishing
const BUG_LIFETIME_MAX_FRAMES = 150; // ~5s
const BUG_GAP_MIN_FRAMES = 50;       // ~2s of nothing before a slot can spawn again
const BUG_GAP_MAX_FRAMES = 120;      // ~10s
const BUG_FADE_FRAMES = 8;           // quick fade in/out at spawn/despawn so it's not a hard pop

// ---- procedural bug shape: tune size/erratic movement ----
const BUG_MIN_SIZE = 12;         // px
const BUG_MAX_SIZE = 18;         // px
const BUG_MOVE_DIST = 26;        // max px covered per erratic jump
const BUG_HOLD_MIN_FRAMES = 3;   // frames a bug stays put between jumps
const BUG_HOLD_MAX_FRAMES = 16;
const BUG_TELEPORT_CHANCE = 0.015; // odds a jump is a full glitch-relocation instead of a step

// ---- sprite atlas: how much variety gets baked at startup ----
// Every bug silhouette is dithered once during setup and then blitted, so the
// draw loop never touches pixels. A bug picks one size bucket for its whole
// life and a random pose each time it jumps, which is what used to be a fresh
// rot/legPhase per jump. More steps = more variety for a little more startup
// time and memory (each sprite is a ~54px square canvas).
const SPRITE_SIZE_STEPS = 4;  // distinct bug sizes baked
const SPRITE_POSE_STEPS = 10; // rotations/leg positions baked per size

// ---- image-based bugs: mixed in alongside the procedural shapes ----
// Drop TD stills / Wikimedia bug photos into images/td-bugs/ and list the
// filenames below. Leave the list empty to keep bugs purely procedural —
// nothing else needs to change, spawning just falls back automatically.
const IMAGE_BUG_FOLDER = 'images/td-bugs/';
const IMAGE_BUG_FILES = [
  // 'example-still.jpg',
];
const IMAGE_BUG_CHANCE = 0.5;    // odds a spawn uses a photo instead of a procedural shape (if any loaded)
const IMAGE_BUG_MIN_SIZE = 20;   // px — photos get dithered small too, but need a bit more size to read
const IMAGE_BUG_MAX_SIZE = 34;   // px

// ---- dither/halftone treatment: tune to change grain/dot look ----
const DITHER_CELL = 2;  // px per ordered-dither sample cell (bigger = chunkier dots)
const DITHER_GRAIN = 0.08; // 0-1 random threshold jitter layered on the ordered pattern
const BUG_INK = [25, 22, 18];
const BUG_INK_ALPHA = 235; // baked into the sprite; the spawn/despawn fade is applied at blit time

// ---- static resting texture: a halftone dot screen that sits on the screen
// at all times (the "old screen / textile" idle state), independent of the
// bugs. Rendered once (not per frame) so it reads as a fixed print pattern
// rather than flickering static.
//
// ALPHA and DENSITY pull in opposite directions, which is the thing to
// understand before touching them. DENSITY sets how much ink the noise asks
// for, and the Bayer matrix only stamps a cell when that ink clears the
// cell's threshold (0/16 .. 15/16). Keep DENSITY low enough that only the
// 0/16 cell clears and you get one dot per 4x4 block — a regular lattice at
// CELL*4 px spacing, which is what reads as a halftone screen. Raise it and
// more thresholds clear, the lattice fills in, and it degrades into a dense
// crosshatch. ALPHA is then free to go high to make each dot read as a dot.
// Dense + faint is grain; sparse + dark is a screen.
const STATIC_DITHER_CELL = 1;       // px per dither cell — dot spacing is CELL*4
const STATIC_DITHER_ALPHA = 100;        // 0-255 ink opacity — high so each dot reads
const STATIC_DITHER_DENSITY = 0.09;   // 0-1 ink coverage ceiling — low keeps the lattice open
const STATIC_DITHER_NOISE_SCALE = 0.05; // perlin sample scale — lower = larger textile-like blobs
const STATIC_DITHER_GRAIN = 0;      // threshold jitter — 0 keeps the lattice regular
// A full-screen rebuild is expensive, and macOS fires a burst of resize
// events while a fullscreen transition animates. Coalesce them so the
// texture is rebuilt once the size has settled, not once per event.
const STATIC_REBUILD_DEBOUNCE_MS = 250;

// classic 4x4 ordered (Bayer) dither matrix, same family as ImageMagick's h4x4o
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

// Reusable halftone/dither renderer — not bug-specific. Stamps ink where
// brightnessFn(i, j) (0..1, sampled every `cellSize` px over a w x h box)
// exceeds the Bayer threshold at that cell, giving the same ordered-dither
// look as the h4x4o-style static images elsewhere in the project. `renderer`
// is anything with p5's noStroke/fill/rect API — the main canvas or an
// offscreen p5.Graphics buffer both work, so this same function drives the
// bug silhouettes, the static resting texture below, and could drive any
// future dithered element on the page.
function ditherField(renderer, x, y, w, h, cellSize, brightnessFn, opts = {}) {
  const fg = opts.fg || [25, 22, 18];
  const alpha = opts.alpha != null ? opts.alpha : 255;
  const grain = opts.grain || 0;
  renderer.noStroke();
  renderer.fill(fg[0], fg[1], fg[2], alpha);
  for (let j = 0; j < h; j += cellSize) {
    const by = (j / cellSize | 0) % 4;
    for (let i = 0; i < w; i += cellSize) {
      const ink = brightnessFn(i, j);
      if (ink <= 0) continue;
      const bx = (i / cellSize | 0) % 4;
      let t = BAYER_4X4[by][bx] / 16;
      if (grain) t += (Math.random() * 2 - 1) * grain;
      if (ink > t) renderer.rect(x + i, y + j, cellSize, cellSize);
    }
  }
}

// Same ordered-dither maths as ditherField, but writing straight into an
// ImageData instead of issuing a fillRect per cell. The output is identical:
// cells are grid-aligned and never overlap, so there is nothing for
// source-over compositing to do differently. Worth the duplication only at
// full-screen scale — a 27" display is ~850k cells, i.e. ~850k draw calls,
// which stalls the main thread for seconds. Requires pixelDensity(1) on the
// renderer so logical and backing-store pixels line up.
function ditherFieldToPixels(renderer, cellSize, brightnessFn, opts = {}) {
  const fg = opts.fg || [25, 22, 18];
  const alpha = opts.alpha != null ? opts.alpha : 255;
  const grain = opts.grain || 0;
  const w = renderer.width, h = renderer.height;
  const ctx = renderer.drawingContext;
  const img = ctx.createImageData(w, h);
  const data = img.data;
  for (let j = 0; j < h; j += cellSize) {
    const by = (j / cellSize | 0) % 4;
    const rowEnd = Math.min(j + cellSize, h);
    for (let i = 0; i < w; i += cellSize) {
      const ink = brightnessFn(i, j);
      if (ink <= 0) continue;
      const bx = (i / cellSize | 0) % 4;
      let t = BAYER_4X4[by][bx] / 16;
      if (grain) t += (Math.random() * 2 - 1) * grain;
      if (ink <= t) continue;
      const colEnd = Math.min(i + cellSize, w);
      for (let yy = j; yy < rowEnd; yy++) {
        let idx = (yy * w + i) * 4;
        for (let xx = i; xx < colEnd; xx++) {
          data[idx] = fg[0];
          data[idx + 1] = fg[1];
          data[idx + 2] = fg[2];
          data[idx + 3] = alpha;
          idx += 4;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

function bugSwarmSketch(p) {
  let slots = [];         // fixed-size pool of spawn/lifetime/gap timers, one per concurrent bug
  let shapeBuf;            // scratch buffer a procedural silhouette is drawn into while baking sprites
  let imageBuf;             // scratch buffer a photo is drawn into while baking sprites
  let staticTextureBuf;     // resting dither texture, rendered once and blitted each frame
  let loadedBugImages = []; // successfully loaded p5.Image objects from IMAGE_BUG_FILES
  // Baked sprite sets. Each entry is { size, frames: [p5.Graphics, ...] } —
  // one size bucket with a pose per frame. Kept in two lists so the
  // procedural/photo mix can still honour IMAGE_BUG_CHANCE.
  let proceduralSets = [];
  let photoSets = [];
  let activeBugTarget = BASE_CONCURRENT_BUGS; // how many slots should be live — set from outside via p.setSwarmBoost
  let activeBugCount = BASE_CONCURRENT_BUGS;  // eased toward activeBugTarget each frame
  let staticRebuildTimer = null;

  p.preload = function () {
    IMAGE_BUG_FILES.forEach(name => {
      p.loadImage(
        IMAGE_BUG_FOLDER + name,
        img => loadedBugImages.push(img),
        () => console.warn('bug image failed to load, skipping:', IMAGE_BUG_FOLDER + name)
      );
    });
  };

  function renderStaticTexture() {
    const brightnessFn = (i, j) =>
      p.noise(i * STATIC_DITHER_NOISE_SCALE, j * STATIC_DITHER_NOISE_SCALE) * STATIC_DITHER_DENSITY;
    const opts = { fg: [20, 18, 15], alpha: STATIC_DITHER_ALPHA, grain: STATIC_DITHER_GRAIN };

    ditherFieldToPixels(staticTextureBuf, STATIC_DITHER_CELL, brightnessFn, opts);

    // The ImageData path above is the fast one, but it is the only thing in
    // this sketch that writes pixels directly rather than going through p5's
    // drawing API, and it has been observed producing an empty buffer on at
    // least one machine while the identical maths via rect() renders fine.
    // Rather than ship a texture that silently isn't there, check the result
    // and redo it the slow way if nothing landed. The slow path is what the
    // bug sprites already use, so if sprites render, this will too.
    if (!bufferHasInk(staticTextureBuf)) {
      ditherField(
        staticTextureBuf, 0, 0,
        staticTextureBuf.width, staticTextureBuf.height,
        STATIC_DITHER_CELL, brightnessFn, opts
      );
    }
  }

  // Spot-checks a few small patches rather than reading the whole buffer. The
  // texture is a near-uniform lattice, so any one patch that covers several
  // dot cells is enough to tell "rendered" from "didn't", and a full-canvas
  // readback at 27" is exactly the cost this is meant to avoid.
  function bufferHasInk(buf) {
    const ctx = buf.drawingContext;
    const probe = 32;
    const spots = [[0.5, 0.5], [0.2, 0.3], [0.8, 0.7]];
    for (const [fx, fy] of spots) {
      const x = Math.min(Math.floor(buf.width * fx), Math.max(0, buf.width - probe));
      const y = Math.min(Math.floor(buf.height * fy), Math.max(0, buf.height - probe));
      const w = Math.min(probe, buf.width - x);
      const h = Math.min(probe, buf.height - y);
      if (w <= 0 || h <= 0) continue;
      const d = ctx.getImageData(x, y, w, h).data;
      for (let k = 3; k < d.length; k += 4) if (d[k] > 0) return true;
    }
    return false;
  }

  function rebuildStaticTexture() {
    if (staticTextureBuf
      && staticTextureBuf.width === p.width
      && staticTextureBuf.height === p.height) return;
    // remove() the old buffer or every resize leaks a canvas and its context
    if (staticTextureBuf) staticTextureBuf.remove();
    staticTextureBuf = p.createGraphics(p.width, p.height);
    staticTextureBuf.pixelDensity(1);
    renderStaticTexture();
  }

  // ---- sprite baking -------------------------------------------------
  // Reads the alpha channel of a silhouette drawn in white on transparent.
  function alphaBrightness(src) {
    const w = src.width, pix = src.pixels;
    return (i, j) => pix[((j | 0) * w + (i | 0)) * 4 + 3] / 255;
  }

  // Dark pixels of a photo become dense dot clusters, with a soft round
  // falloff so a still doesn't read as a hard rectangle.
  function photoBrightness(src) {
    const w = src.width, h = src.height, pix = src.pixels;
    const cx = w / 2, cy = h / 2;
    const maxR = Math.min(w, h) / 2 * 0.92;
    return (i, j) => {
      const ix = i | 0, iy = j | 0;
      const idx = (iy * w + ix) * 4;
      if (pix[idx + 3] <= 0) return 0;
      const luminance = (pix[idx] * 0.299 + pix[idx + 1] * 0.587 + pix[idx + 2] * 0.114) / 255;
      const dx = ix - cx, dy = iy - cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      const mask = r <= maxR ? 1 : Math.max(0, 1 - (r - maxR) / (maxR * 0.2));
      return (1 - luminance) * mask;
    };
  }

  // Draws into the scratch buffer, reads it back once, and returns a fresh
  // buffer holding the dithered result. The one loadPixels() per sprite here
  // replaces one per bug per frame in the old draw loop.
  function bakeSprite(scratch, drawSource, brightnessFor) {
    drawSource(scratch);
    scratch.loadPixels();
    const sprite = p.createGraphics(scratch.width, scratch.height);
    sprite.pixelDensity(1);
    ditherField(
      sprite, 0, 0, scratch.width, scratch.height, DITHER_CELL,
      brightnessFor(scratch),
      { fg: BUG_INK, alpha: BUG_INK_ALPHA, grain: DITHER_GRAIN }
    );
    return sprite;
  }

  function bakeSpriteSet(minSize, maxSize, step, drawFrame, brightnessFor, scratch) {
    const size = minSize + (maxSize - minSize) * step;
    const frames = [];
    for (let f = 0; f < SPRITE_POSE_STEPS; f++) {
      const rot = p.TWO_PI * f / SPRITE_POSE_STEPS;
      const legPhase = p.random(100);
      frames.push(bakeSprite(scratch, g => drawFrame(g, size, rot, legPhase), brightnessFor));
    }
    return { size, frames };
  }

  function bakeSpriteSets() {
    const denom = Math.max(1, SPRITE_SIZE_STEPS - 1);
    for (let s = 0; s < SPRITE_SIZE_STEPS; s++) {
      proceduralSets.push(bakeSpriteSet(
        BUG_MIN_SIZE, BUG_MAX_SIZE, s / denom,
        drawBugSilhouette, alphaBrightness, shapeBuf
      ));
    }
    loadedBugImages.forEach(img => {
      for (let s = 0; s < SPRITE_SIZE_STEPS; s++) {
        photoSets.push(bakeSpriteSet(
          IMAGE_BUG_MIN_SIZE, IMAGE_BUG_MAX_SIZE, s / denom,
          (g, size, rot) => drawImageBugBuffer(g, img, size, rot),
          photoBrightness, imageBuf
        ));
      }
    });
  }

  function spawnBug() {
    const usePhoto = photoSets.length > 0 && p.random() < IMAGE_BUG_CHANCE;
    const set = p.random(usePhoto ? photoSets : proceduralSets);
    return {
      set,
      frame: p.floor(p.random(set.frames.length)),
      x: p.random(p.width),
      y: p.random(p.height),
      size: set.size,
      age: 0,
      nextMove: p.frameCount + p.floor(p.random(BUG_HOLD_MIN_FRAMES, BUG_HOLD_MAX_FRAMES))
    };
  }

  function jitterBug(b) {
    if (p.frameCount < b.nextMove) return;
    b.nextMove = p.frameCount + p.floor(p.random(BUG_HOLD_MIN_FRAMES, BUG_HOLD_MAX_FRAMES));

    if (p.random() < BUG_TELEPORT_CHANCE) {
      b.x = p.random(p.width);
      b.y = p.random(p.height);
    } else {
      const a = p.random(p.TWO_PI);
      const d = p.random(BUG_MOVE_DIST * 0.2, BUG_MOVE_DIST);
      b.x = p.constrain(b.x + Math.cos(a) * d, -b.size, p.width + b.size);
      b.y = p.constrain(b.y + Math.sin(a) * d, -b.size, p.height + b.size);
    }
    // a new pose stands in for the old fresh rot + legPhase
    b.frame = p.floor(p.random(b.set.frames.length));
  }

  function updateSlot(slot) {
    slot.timer--;
    if (slot.timer > 0) {
      if (slot.bug) {
        jitterBug(slot.bug);
        slot.bug.age++;
      }
      return;
    }
    if (slot.bug) {
      // bug's lifetime just ran out — clear it and start a fresh gap of nothing
      slot.bug = null;
      slot.timer = p.floor(p.random(BUG_GAP_MIN_FRAMES, BUG_GAP_MAX_FRAMES));
    } else {
      // gap just ran out — spawn a bug and start its lifetime countdown
      slot.bug = spawnBug();
      slot.timer = p.floor(p.random(BUG_LIFETIME_MIN_FRAMES, BUG_LIFETIME_MAX_FRAMES));
    }
  }

  // fades a bug in at spawn and out before despawn so it's a glimpse, not a hard pop
  function bugFadeAlpha(bug, slot) {
    const fadeIn = p.constrain(bug.age / BUG_FADE_FRAMES, 0, 1);
    const fadeOut = p.constrain(slot.timer / BUG_FADE_FRAMES, 0, 1);
    return Math.min(fadeIn, fadeOut);
  }

  function drawBugSilhouette(gfx, size, rot, legPhase) {
    gfx.clear();
    gfx.push();
    gfx.translate(gfx.width / 2, gfx.height / 2);
    gfx.rotate(rot);
    gfx.noStroke();
    gfx.fill(255);
    gfx.ellipse(0, 0, size * 0.9, size * 1.5);
    gfx.ellipse(0, -size * 0.85, size * 0.5, size * 0.5);
    gfx.strokeWeight(Math.max(1, size * 0.09));
    gfx.stroke(255);
    for (let s = -1; s <= 1; s += 2) {
      for (let k = -1; k <= 1; k++) {
        const legY = k * size * 0.4;
        const wob = Math.sin(legPhase + k * 1.7) * size * 0.15;
        gfx.line(s * size * 0.3, legY, s * (size * 0.9 + wob), legY + size * 0.15 * s);
      }
    }
    gfx.pop();
  }

  function drawImageBugBuffer(gfx, img, size, rot) {
    gfx.clear();
    gfx.push();
    gfx.translate(gfx.width / 2, gfx.height / 2);
    gfx.rotate(rot);
    gfx.imageMode('center');
    gfx.image(img, 0, 0, size, size);
    gfx.pop();
  }

  p.setup = function () {
    const holder = document.getElementById('bug-canvas-holder');
    const cnv = p.createCanvas(holder.clientWidth, holder.clientHeight);
    cnv.parent(holder);
    p.pixelDensity(1);
    p.frameRate(30);
    shapeBuf = p.createGraphics(BUG_MAX_SIZE * 3, BUG_MAX_SIZE * 3);
    shapeBuf.pixelDensity(1);
    imageBuf = p.createGraphics(IMAGE_BUG_MAX_SIZE * 3, IMAGE_BUG_MAX_SIZE * 3);
    imageBuf.pixelDensity(1);
    bakeSpriteSets();
    rebuildStaticTexture();
    // pool sized to the peak; only the eased-in slice at the front is live at any moment
    for (let i = 0; i < PEAK_CONCURRENT_BUGS; i++) {
      slots.push({ bug: null, timer: p.floor(p.random(BUG_GAP_MIN_FRAMES, BUG_GAP_MAX_FRAMES)) });
    }
  };

  p.windowResized = function () {
    const holder = document.getElementById('bug-canvas-holder');
    p.resizeCanvas(holder.clientWidth, holder.clientHeight);
    if (staticRebuildTimer) clearTimeout(staticRebuildTimer);
    staticRebuildTimer = setTimeout(rebuildStaticTexture, STATIC_REBUILD_DEBOUNCE_MS);
  };

  // called from outside (e.g. the invert-filter hover) to ramp the swarm up or back down
  p.setSwarmBoost = function (boosted) {
    activeBugTarget = boosted ? PEAK_CONCURRENT_BUGS : BASE_CONCURRENT_BUGS;
  };

  p.draw = function () {
    p.clear();
    if (staticTextureBuf) p.image(staticTextureBuf, 0, 0);

    activeBugCount += (activeBugTarget - activeBugCount) * SWARM_EASE;
    const liveCount = Math.min(slots.length, Math.round(activeBugCount));

    // Blit the baked sprites through the 2D context directly: globalAlpha is
    // free, whereas p5's tint() re-reads and re-tints the sprite for every
    // distinct alpha value, which is exactly the per-frame pixel work this
    // cache exists to remove.
    const ctx = p.drawingContext;
    for (let i = 0; i < liveCount; i++) {
      const slot = slots[i];
      updateSlot(slot);
      const b = slot.bug;
      if (!b) continue;
      const alpha = bugFadeAlpha(b, slot);
      if (alpha <= 0) continue;
      const sprite = b.set.frames[b.frame];
      ctx.globalAlpha = alpha;
      ctx.drawImage(sprite.canvas, b.x - sprite.width / 2, b.y - sprite.height / 2);
    }
    ctx.globalAlpha = 1;
  };
}

const bugSwarmInstance = new p5(bugSwarmSketch);
window.setBugSwarmBoost = boosted => bugSwarmInstance.setSwarmBoost(boosted);
