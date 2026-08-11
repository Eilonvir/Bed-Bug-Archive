// ---- bug presence: tune how sparse/dense the sightings feel ----
const BASE_CONCURRENT_BUGS = 2;     // resting bug count — keep low, this is a glimpse not a swarm
const PEAK_CONCURRENT_BUGS = 20;    // bug count while a hover-invert transition is boosting the swarm
const SWARM_EASE = 0.02;            // per-frame lerp toward the target count — bigger = snappier ramp
const BUG_LIFETIME_MIN_FRAMES = 60;  // ~2s at 30fps — how long a spawned bug stays before vanishing
const BUG_LIFETIME_MAX_FRAMES = 150; // ~5s
const BUG_GAP_MIN_FRAMES = 60;       // ~2s of nothing before a slot can spawn again
const BUG_GAP_MAX_FRAMES = 300;      // ~10s
const BUG_FADE_FRAMES = 8;           // quick fade in/out at spawn/despawn so it's not a hard pop

// ---- procedural bug shape: tune size/erratic movement ----
const BUG_MIN_SIZE = 12;         // px
const BUG_MAX_SIZE = 18;         // px
const BUG_MOVE_DIST = 26;        // max px covered per erratic jump
const BUG_HOLD_MIN_FRAMES = 3;   // frames a bug stays put between jumps
const BUG_HOLD_MAX_FRAMES = 16;
const BUG_TELEPORT_CHANCE = 0.015; // odds a jump is a full glitch-relocation instead of a step

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

// ---- static resting texture: a light dither grain that sits on the screen
// at all times (the "old screen / textile" idle state), independent of the
// bugs. Rendered once (not per frame) so it reads as a fixed print pattern
// rather than flickering static. Keep ALPHA/DENSITY low so it stays behind
// the icon labels instead of competing with them.
const STATIC_DITHER_CELL = 2;       // px per dither cell
const STATIC_DITHER_ALPHA = 45;        // 0-255 ink opacity — low keeps labels legible
const STATIC_DITHER_DENSITY = 0.2;   // 0-1 ink coverage ceiling — lower = sparser
const STATIC_DITHER_NOISE_SCALE = 0.05; // perlin sample scale — lower = larger textile-like blobs
const STATIC_DITHER_GRAIN = 0.05;

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

function bugSwarmSketch(p) {
  let slots = [];         // fixed-size pool of spawn/lifetime/gap timers, one per concurrent bug
  let shapeBuf;            // shared offscreen buffer a procedural bug silhouette is drawn into before dithering
  let imageBuf;             // shared offscreen buffer a photo bug is drawn into before dithering
  let staticTextureBuf;     // resting dither texture, rendered once and blitted each frame
  let loadedBugImages = []; // successfully loaded p5.Image objects from IMAGE_BUG_FILES
  let activeBugTarget = BASE_CONCURRENT_BUGS; // how many slots should be live — set from outside via p.setSwarmBoost
  let activeBugCount = BASE_CONCURRENT_BUGS;  // eased toward activeBugTarget each frame

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
    staticTextureBuf.clear();
    const brightnessFn = (i, j) =>
      p.noise(i * STATIC_DITHER_NOISE_SCALE, j * STATIC_DITHER_NOISE_SCALE) * STATIC_DITHER_DENSITY;
    ditherField(
      staticTextureBuf,
      0, 0,
      staticTextureBuf.width, staticTextureBuf.height,
      STATIC_DITHER_CELL,
      brightnessFn,
      { fg: [20, 18, 15], alpha: STATIC_DITHER_ALPHA, grain: STATIC_DITHER_GRAIN }
    );
  }

  function spawnBug() {
    const useImage = loadedBugImages.length > 0 && p.random() < IMAGE_BUG_CHANCE;
    const sizeMin = useImage ? IMAGE_BUG_MIN_SIZE : BUG_MIN_SIZE;
    const sizeMax = useImage ? IMAGE_BUG_MAX_SIZE : BUG_MAX_SIZE;
    return {
      type: useImage ? 'image' : 'procedural',
      img: useImage ? p.random(loadedBugImages) : null,
      x: p.random(p.width),
      y: p.random(p.height),
      size: p.random(sizeMin, sizeMax),
      rot: p.random(p.TWO_PI),
      legPhase: p.random(100),
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
    b.rot = p.random(p.TWO_PI);
    b.legPhase += p.random(2, 6);
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
    staticTextureBuf = p.createGraphics(p.width, p.height);
    staticTextureBuf.pixelDensity(1);
    renderStaticTexture();
    // pool sized to the peak; only the eased-in slice at the front is live at any moment
    for (let i = 0; i < PEAK_CONCURRENT_BUGS; i++) {
      slots.push({ bug: null, timer: p.floor(p.random(BUG_GAP_MIN_FRAMES, BUG_GAP_MAX_FRAMES)) });
    }
  };

  p.windowResized = function () {
    const holder = document.getElementById('bug-canvas-holder');
    p.resizeCanvas(holder.clientWidth, holder.clientHeight);
    staticTextureBuf = p.createGraphics(p.width, p.height);
    staticTextureBuf.pixelDensity(1);
    renderStaticTexture();
  };

  // called from outside (e.g. the invert-filter hover) to ramp the swarm up or back down
  p.setSwarmBoost = function (boosted) {
    activeBugTarget = boosted ? PEAK_CONCURRENT_BUGS : BASE_CONCURRENT_BUGS;
  };

  function drawProceduralBug(b, alpha) {
    drawBugSilhouette(shapeBuf, b.size, b.rot, b.legPhase);
    shapeBuf.loadPixels();
    const bw = shapeBuf.width, bh = shapeBuf.height, pix = shapeBuf.pixels;
    const brightnessFn = (i, j) => {
      const ix = i | 0, iy = j | 0;
      return pix[(iy * bw + ix) * 4 + 3] / 255;
    };
    ditherField(
      p,
      b.x - bw / 2,
      b.y - bh / 2,
      bw, bh,
      DITHER_CELL,
      brightnessFn,
      { fg: [25, 22, 18], alpha: 235 * alpha, grain: DITHER_GRAIN }
    );
  }

  function drawImageBug(b, alpha) {
    drawImageBugBuffer(imageBuf, b.img, b.size, b.rot);
    imageBuf.loadPixels();
    const bw = imageBuf.width, bh = imageBuf.height, pix = imageBuf.pixels;
    const cx = bw / 2, cy = bh / 2;
    const maxR = Math.min(bw, bh) / 2 * 0.92; // soft round falloff so photos don't read as a hard rectangle
    const brightnessFn = (i, j) => {
      const ix = i | 0, iy = j | 0;
      const idx = (iy * bw + ix) * 4;
      const a = pix[idx + 3];
      if (a <= 0) return 0;
      const luminance = (pix[idx] * 0.299 + pix[idx + 1] * 0.587 + pix[idx + 2] * 0.114) / 255;
      const ink = 1 - luminance; // dark pixels of the photo become dense dot clusters
      const dx = ix - cx, dy = iy - cy;
      const r = Math.sqrt(dx * dx + dy * dy);
      const mask = r <= maxR ? 1 : Math.max(0, 1 - (r - maxR) / (maxR * 0.2));
      return ink * mask;
    };
    ditherField(
      p,
      b.x - bw / 2,
      b.y - bh / 2,
      bw, bh,
      DITHER_CELL,
      brightnessFn,
      { fg: [25, 22, 18], alpha: 235 * alpha, grain: DITHER_GRAIN }
    );
  }

  p.draw = function () {
    p.clear();
    p.image(staticTextureBuf, 0, 0);

    activeBugCount += (activeBugTarget - activeBugCount) * SWARM_EASE;
    const liveCount = Math.round(activeBugCount);

    slots.slice(0, liveCount).forEach(slot => {
      updateSlot(slot);
      const b = slot.bug;
      if (!b) return;
      const alpha = bugFadeAlpha(b, slot);
      if (b.type === 'image') drawImageBug(b, alpha);
      else drawProceduralBug(b, alpha);
    });
  };
}

const bugSwarmInstance = new p5(bugSwarmSketch);
window.setBugSwarmBoost = boosted => bugSwarmInstance.setSwarmBoost(boosted);
