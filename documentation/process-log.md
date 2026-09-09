# Process Log

Working notes on UX, UI and build decisions, kept during development.
Entries are dated as originally written.

Process Miro board - https://miro.com/app/board/uXjVH3uvt9k=/

---

## Cyberdeck Plans

**The stack.** A Raspberry Pi 4, because it is what I have.

**Screen.** Is 20 inch too small? Is a bigger screen necessary for a clear gallery
display as an interactive artefact? LCD or e-paper? Otherwise, if I am pursuing a
cyberdeck still despite the constraint, do I incorporate it in a different way? An
artefact for the vitrine? Maybe host the TD swarm sketch in it, a cyberdeck in the
shape of microscope slides. Or to host the interactive fiction game? Or simply as a
failed artefact display? What would the secondary display be?

It's funny, as I am reading this, I am wondering if this is a feasible task to
pursue. And if I am making an artefact, should it be a smaller, non-interactive one?

**The casing.** I am trying to rethink the alternative if I don't go for a custom
computer. Could go find an older computer for the aesthetic of it. Or go for creating
a casing for the Dell monitor the school can provide (27 inches).

**Power.** Another deterrent when taking all into account.

---

## UX and UI: aspects to fix

Lock fullscreen mode.

Since this is a continuous version, maybe a pop up screen of the opener (the one
you'd see first when you open the webpage). More?

Is the read through time a liability? I found in recent exhibitions I've attended
that long experiences, 20+ minutes, deter me from engaging with a piece. I think that
my work is straightforward enough for the user, and instructions will be available.

UI: would be nice to make the image curation slightly more intentional in the window
and overall website interface. Was thinking of old video game aesthetics, might fit
Minecraft or those MMORPG inventory aesthetics, like grids or boxes of a stone gray
hue with tiny left-right arrows.

The visuals? Could use some placeholders for a start. Adopt a daily sketch routine
and get some watercolours and ink back to add as website texture and whatnot.

Using alternative icons to the Easter eggs might help avoid some cognitive overload
on the user's part. The folder icon on the main three logs would signal where the
meat is.

Playtest playtest playtest.

UX considerations: the core narrative at this point will stay the same. It's strong,
takes one through a lifetime in its way, through pest control.

---

## 29.7.2026

I spoke to a professor about the UX. Nesting all interviews in an envelope came up. I
like the idea of sorting out all my materials that way. The title card in the local
continuous version popping up would be good.

Same for creating a progression within each window, e.g. NLP window as research paper
prep windows that sort of map the researcher's mental decline. The first one being
the NLP captioned 'pulling patient demographics for parasitosis', patients do XYZ (or
is it better to leave patient behaviour in a different window?), then there must be a
window with a content warning and an image, captioned 'I've been scratching myself a
bit'.

Should the website structure mirror how my own website is mapped? For instance, logs
in one place, folder for audios and images separately, in which case bugImg and the
house instead of the actual images? A different minimal background for the interview
window? And if so, do I implement a restart function? Any pop ups or bugs?

"A moth, Grace Hopper's original bug!" I wanted to caption in the corner of the
window, like one of those structuralist type aesthetics that we've seen. Or a go home
button instead?

---

## 30.7.2026

UX considerations, the sequel. Wondering when it would be tiresome to nest folders in
folders for the user, and how might I go about the story structure now. A clean home
screen, just the README on top, the interviews folder and maybe the analysis.exe
present. In which case the floral print of the background won't strike as busy as it
is for me currently. Then testing plain noisy beige and stuff as the background of
other windows.

**Tidying up and narrative approach.** Interviews: the three logs as text files, and
if so, current structure is log + image + audio in each. Would it be tedious for the
users if I were to spread images, logs and audio to separate folders, so you'd get
only one type of medium in each? No, right? I should be playful with the multimedia
aspect of the storytelling. Jeremy told me that I have so many materials that I
should use. Current structure of INTERVIEWS folder: the three logs and an IMAGES
folder, that contains the bugImg and house folders. I want the September folder to be
more of an Easter egg and pop up by some trigger. I think I should try to make a
'notes' folder and nest in it the facts.txt and the Hortus S (perhaps the Morgellons
folder as well).

Then there's the matter of hyperlinks and whatnot. It would make sense to hyperlink
'Acknowledgements' through the README and to numbered image captions of the Wikimedia
Commons ones throughout the website rather than leave it on the interface. Then it
raises the question of whether I should hyperlink different folders in the website,
e.g. the part of analysis.exe where I define DP in more detail, as both a hyperlink
in the README mention and through clicking the analysis.exe icon.

The structure for analysis.exe I envisage would be a carousel of windows inside the
window (should I implement the carousel arrows since they're already in place?) that
take you through the following story progression: a seemingly removed introduction of
DP. Then the line about the infuriating quote. Then the Biopython PubMed pull
explained more colloquially, an introduction of the gendered aspect. Then a content
warning, an image, captioned 'I've been scratching myself'. Could implement the
Morgellons folder, maybe even break it down and rethink how it might contribute to
the progression of this story.

**General notes on story structure and README shenanigans.** Implementing 'bugs'. I
think that the README should include very subtle bugs, or maybe it's not a must (omg
I made a new word by amalgamating two words).

The windows in general should map in some form mental decline. Also using the bed bug
images (if they wind up not in use in the img folder) as embellishments for the more
text heavy files could be great.

Funny that I am creating a simulacrum of my desktop. If it is, it's currently a stage
two simulacrum.

---

## 31.07.2026

UX de triquel.

Set a Boolean for a trigger to make the September folder manifest? After playing with
filters, I think that applying grayscale would make sense. For buggy visuals and stuff
maybe play with invert and such.

Boring yet important (I like the autocorrect 'boring yet impossible'; think that a
boring yet X ad lib exercise would be fun) things to do: yet to merge with the local
version, yet to incorporate a full screen mode in code. For local version, one with a
slightly more complicated exit mode key to prevent audience members from leaving the
interface.

Regarding current UI: getting tired of the floral print background, still haven't
decided if I need it emptier or if I'm wasting time looking for different visual
variations of it. I've desaturated the interface slightly, think it does wonders.

It's too reminiscent of a toy to me at this point. I know that this type of aesthetic
in some game horror media is meant to disarm the audience and amplify the effects of
more explicit content in contrast to its bright UI. Wonder if current interface
serves me in the same way.

Also noting that after a continuous run of the code, windows start lagging when
dragging as their shadow (reflection?) gets grouped together in an odd effect.

In the logs, would be neat if bugs would show up upon hovering the 'black spot people'
part of Brighton. What other locations can I seed bugs in? I also considered setting
a Boolean to completely separate the resting and hallucinatory modes, in the same
logic that's present in games like Fran Bow (which is more of a puzzle game as well).
I just think that it would be boring if the change would be controlled, such as
taking the pill in FB, rather than erratic. Computer bugs aren't controlled.

Slightly torn about the UI. I think that logically the NLP window icon would be
situated within the INTERVIEWS/NOTES folders. It also creates a trio of files in
there that feel slightly fuller. However, without it in the main desktop UI, the
interface looks a bit empty and somehow the composition of the INTERVIEWS and README
stacked on top of each other (in either iteration) doesn't work well for me visually.
Which might be a shallow consideration.

Timing note: I want to be in a position to playtest by next week. Wonder if that's
possible. Would having everything filled with placeholder visuals rather than
planning notes be better for clarity?

---

## 1.8.2026

UX the quadriquel?

I think that some sound effects of typing might add a lot to the UX. For instance,
when one opens the NLP window and comes across the first slider of the DP definition
and all that, it could also reflect the sanity slippage of the story slides
progression, as in the typing becoming more aggressive and frantic, or with buzzing
sounds being introduced.

Would make sense with the current audios in the code being limited, and audiences
potentially winding up confused wearing the audio and hearing nothing initially.

About the reset: should there be a button in place for users? Should there be an
automatic pop up after a certain period of stagnation? Maybe with a countdown, though
it might be annoying for users who take the time to read. Introductory card will
include the attention grabber and general content warnings.

I kind of dislike how much it looks like a game now but it is what it is.

---

## 2.8.2026

Ok, what of a Fran Bow-esque Boolean mechanism where the NLP analysis story slide
does have shifting modes (honestly might be still upon hovering), so in addition to
the text change upon hovering, the background turns inverted and those disgusting
larvae type crawlers squirm over the floral tapestry?

It does raise questions regarding my previous story progression plans within the
analysis.exe window though. It's meant to reflect a mental decline still, and I do
like the 'lately I've been scratching myself' slide. Should I nest it? Make it a
conditional as well? If so what should I unpack? I fear this is becoming a full on
game, which is well outside my field of expertise and the time frame.

Sound effects to find: scratching, buzzing (of various intensities), typing (of
various intensities as well?).

Also, through INTERVIEWS/NOTES, specifically analysis.exe, should there be the effect
of typing in real time as you open the window?

Qualms regarding nesting and the September window's place in the UI. I like the idea
of it popping up by some trigger still. I think that it does look good on the main
desktop interface. I'm slightly stressed about the setTimeout concerns it popping up
would raise, though it might be the tidiest way to go about this.

I wonder if it should appear on the main UI with a flourish when it does, or in its
own window. And if so, for how long?

B&W filter trigger should be slightly more precise.

---

## 3.8.2026

Happy accident of sorts. I've tried isolating the background image as a component to
apply a filter onto rather than the entire screen frame. Inputting it in the
September b&w conditional makes the entire screen frame turn to grayscale, then upon
pressing an icon, it changes to the icons being in colour. A single press on anything
but the Sept icon returns colour completely to the frame.

Alright, I've undone it for now but noting it to potentially reintroduce later. I
think that a gradual transition or an animation (for instance, the hover interaction
will start an animation playing rather than a filter, setting up in After Effects the
floral background, inverted, with larvae squirming on the flowers) would be ideal,
though it might mess up the dimensions of the original image file, especially across
devices.

Getting pressed for time. Waking up panicking every day now.

I will attempt now to map my new narrative structure and see if any new resolve comes
up. README needs to contain a few hyperlinks. I think it could be more concise, only
naming DP and hyperlinking to get people started. In general for all txt files,
paragraphs should be tidier, and maybe adding in some visuals and planting in the
README a bug.

Magic circle stuff? Should the user expect to follow hyperlink trails? Should the
planted bugs be expected? Should I limit certain ones in terms of appearance?

Had a diabolic UX thought: what if I implemented a bug of never-ending (or just a lot
of) pop up windows? I've decided before to cap the nested files in folder situation
to no more than two. Some windows involve content warnings at the top of the window
contents. I was advised in the pop up to make it more conspicuous for the degree
show. I will use physical signage, but was wondering if a pop up ('CONTENT WARNING,
BE WARNED, YADA YADA') would be better for this purpose. Thinking of an occasional
additional pop up with just a bug image, maybe with 'pat the bug' and a nasty output
to it. I dunno? Wonder which components would make more sense to vibe code and which
would be better to do myself. CSS squigglification seems like a decent low effort
spice to my visual bug implementation, maybe adding as an additional output to the
hovering and all that, maybe over the icon texts, and attempting at animating my bug
images.

Secondary note: I could apply my p5.js ripple keyboard to map different frequencies
to the different NLP labels for some variation with the bugs. Something doesn't work
currently with the visuals but one step at a time. The question still stands of
whether I should add variation to which bug appears where, or if a pattern,
allocating one bug output to one component, would be best. I think that given the
gallery setting with less perceived time to explore, the latter would be best. Anyway
homework: create two or three variations of the bugs. Wondering still if the TD
sketch is applicable here or not. Realised it's not possible to export interactive
elements from TD to JS/HTML and so on, rather as an animation loop or a static
element.

On a different note, I should start working on my audio files, now-ish.

Slowing down now.

---

## 4.8.2026

Happy news: tried squigglification on the hover interaction on the NLP rows and it
delivered. The personal iterations of the text now squirm like bugs. I think that
developing it further, the bars and numbers can behave oddly as well. Bar could in
neon green overflow. If an exodus of insects would swarm outside the bar and pile at
the bottom of the window it would be cool, though it might enhance the toyish vibe
I'm currently cheesed about with the prototype. Numbers could just spell something in
code or rapidly shift. I think squigglifying the background as well and testing out
the crawling maggots would add a lot of crunch to it. We'll see. That's fast
prototyping anyway.

Making the box shadow thicker added an element to this desktop simulacrum, makes it
pop with this semi-sort-of-3D element. I wonder if the background of all window
content should be uniformly gray or if it's alright to keep variation. Saw a monitor
I like better than the Dell ones from computing. I wonder if I'll be allowed to use
it. Need to email the tech office person. I am falling asleep unfortunately. Still
thinking on where to hide the September folder. Forgot about the Morgellons window (I
think the plan was to integrate it into the story carousel?). I wish the structure
felt more dynamic than what it currently is.

Should map out current structure on a piece of paper.

It might be interesting to sit down and define what the magic circle rules are that
are established in my piece. I think the early prototype was fairly easy to use. Also
is three a magic number?

---

## 7.8.2026

UX UI, the wherever we are in the franchise. I need a nicer framing to the images
inside the interview logs. It should be contained in some way, the manner it spreads
(like a man lol) is too careless at the moment. Just had a thought about the field
logs autoplaying (not a new thought), or presenting as a pop up window with a tiny
audio recorder icon (yes, very quirky). Could be as a secondary feature, as a
clickable icon of the interview split into audio snippets. Or will it drive users
crazy? How would it fit in the hierarchy?

---

## 8.8

True that, but do you remember the thread: what is it about women decaying alive that
pulls at me so strong?

It is not a new sentiment. Councils, systems, leave people for dead in their way.

I wish it touched a man as much as an actual corpse would. That one? It might be nice
to incorporate as a bug. I think typing in real time, if you know what I mean, can be
incorporated to convey a researcher's thought process. NLP story slide three, type in
real time effect, or if my handwriting isn't that shit: "I'm looking at bugs. I think
they are, at least. I'm searching for them in my mattress. I feel a pinprick and, as
I am reading Hinkle's article, I can't help but scratch." With the image.

Now for the bug idea, could be grouped with a bug as the finisher to the FLUID log,
or the audio, in the appropriate place. Say when one plays the audio of Warren
talking about the deceased: a pop up window, the real time thing, the 'I wish it
touched a man as much as a corpse would'. Basically processing parts of my logs into
hidden micro poems. I mean I have the text. It needs editing. It might work.

---

## Messy notes on narrative structure, 8.8.2026

I sent myself a picture of yesterday's map but it doesn't go through, which is fine,
probably won't be entirely readable. Pretty similar, it just didn't tidy things in my
head and I am not sure if my plans translate to what I envisaged in terms of the UX,
and it's hard to get to playtesting when I don't have a ready MVP version. I'll go
over side by side, my skeleton and yours (could be a nice title, storing for later).

**'Root' hierarchy.** README, hyperlinked to analysis.exe, which will stay in the
root UI I've decided, as BODYMIND would replace it (if not too much information /
attempt at content). Reasoning is (nothing is absolute) interview 'notes' are related
to the interviews, when my look into DP is a background check that, though it can
apply, in real life it was removed from my interview prep and processing (even though
it is undeniably related). The roles I've allocated to this file were sanity slippage
and first bug.

**Then there's the 'meat', INTERVIEWS folder** (specimen folder that's hyperlinked
from analysis.exe won't be possible to trace back to the umbrella of folders it falls
under, which could mean nothing, it's just two alternative manners of finding them.
Just noting, also since I'm mentioning this file already, might need to revise its
contents). Under interviews, three acts:

1. Knowledge (needs audio, missing completely, but everything needs audio revision.
   Also some of the last interview can definitely be folded into the log here, noting
   editing for all texts is needed).
2. Fluff. It's a good one. I've mentioned hyperlinking specimen to just fluff (wonder
   if it works better and if it would be confusing to hyperlink the same window twice
   in the code for users?).
3. Fluid. Has three images of different sizes. Yes, I should definitely fold the last
   interview there.

Genderal notes (yes, I've amalgamated gender and general, very cool, AI will never
replace me said the hypocrite) of the formatting of the audios, images and content
warnings in the windows. Content warnings will definitely be pop up windows (could
actually plant a bug there to be triggered with a modulo only some of the times, of
many windows opening. Would make sense to plant it in the heaviest log, which is this
one, rather than in the last story slide of analysis.exe, which would be too tedious
to have two varieties of bugs in a row across two story slides rather than be spread
out in the code). So that's content warnings.

I think images need a frame to normalise their size in the format and have their
integration in the log a bit nicer. Their layout at the moment isn't precise. I think
that even though it's nice to have the users have an audio player to control, it
might be nice to have the audio be a pop up window, maybe with an image, maybe
hyperlinked to the relevant part of a log. Or if it's not exploratory enough, could
be scattered, playing as a backdrop when opening a folder, hyperlinked (though I am
still contemplating just one dump of a super cut of each interview), then a
designated audio folder with the excerpts listed by title (added an example of my own
file explorer audio). Wow that was a good dump.

Under that, Easter eggs: images, notes, potentially audio? (Thought to add under
notes, which could work, but would clutter with BODYMIND, which I could scrap
honestly but let's think it through.)

Drew a link between FLUID and house. However I am not sure if the current square
censorship with captions draws a clear enough connection (I've attached some of the
sequence splayed out on the Miro to not break bank with screenshots, wondering if I
should note the ethics process in here for context or if that's too tedious). The
alternative would've been the minimal childish (as a design choice) drawings instead.

Then we have bugImg (now titled 'specimen'), as discussed. I am wondering if there
should be a Boolean (maybe if BIN folder is open, maybe have some content unavailable
under this condition or something) in place for the carousel contents to change from
fluff to actual bugs, or if that's redundant. Yesterday I did some ImageMagick stuff
on the Wikimedia Commons images and I thought to splice bugs and fluff together
throughout the carousel, and apply grayscale and noise/dithering to all to create a
series (attaching a test from yesterday).

**NOTES.** Hortus S: should do something about the current icon, might apply to house
and other files as well. Content idea is pretty sound in the blurb, need to
incorporate it into the actual code, edit and add the audio, find a thoughtful way to
incorporate the Wikimedia Commons images of the Hortus Sanitatis page (already in
place; I think that handwriting as captions would be a nice touch too), but this can
be a short one. Does raise the question of how much content I should or can dump into
the main logs.

BED BUG FACTS: this one is actually fluff but I wonder if it has a place here? Then
BODYMIND? As a maybe.

Bottom of the hierarchy: BIN, then September. Also can be a short one, wonder if I
have a recording of me talking about the bed bugs with Matthew, would be a nice one.
Need to put the content in place. Think that if I import my interactive bed bug
fiction into this window it would fill the space nicely (spiritually at least, in
terms of content). I wonder if my fixation on bed bugs is evident enough in the
narrative for this tidbit to round the story rather than read as redundant. Then it
alongside the acknowledgements.

Notes on important subjects in the narrative and their integration into the current
structure: is the subject of exploitation present? Through the censorship of the
house perhaps? Through bureaucracy hell issues, which is another subject I wonder if
is present enough in my narrative. Then gender, there are threads. Body horror?
Present?

---

## The narrative

Rather than the old interactive fiction, do I move the archive logs to Twine to
examine rebuilding? Louise advised against it being too cluttered.

---

## Polish list

**The old one** (I may not be able to use the footage due to the ethics process):

- **September folder** — "what happened in September" — mattress screenshot, bite photos
- **Morgellons folder** — anthropologist log, Watching the Pain of Others link, John Wilson link
- **Bug images folder** — Wikimedia Commons illustrations, scattered/collage style with draggable interaction
- **The House** — clutter photos, Warren or Matthew audio about clutter
- **Treatment/Extermination folder** — paraffin/Russia audio, vintage pesticide images, Hortus Sanitatis illustration
- **Anthropologist meeting log** — separate window
- **Instructions** — for those who missed the physical copy

**The new:**

Redesign the website. 98.css structure should stay intact. The background might
change. Rethink the visuals: does the footage need to be replaced? Censored? Do I go
completely minimalist?

Additional field work? Haven't landed the interviews from the outreach on Tuesday. I
think it was crucial to write to these people I admire, for my sake rather than the
project. I however am hellbent on landing an entomology lab visit and will therefore
send a follow up Monday, and find a second option to outreach.

Tidy up the narrative. Lace in the Easter eggs. Refine secondary interactions.

What stumps me is how might I add computational complexity at the end of the day to
this project to make a strong case.

---

## Curation

I want to enhance the researcher / detective framing of the UX I envisaged before,
through multimedia story. I need to make all materials readily available for the
users, so that they can explore.

**The vitrine.** 3D objects, stuff I found on my bed. I am trying, in the context of
my research, to work out what types of artefacts would make sense, intrigue, and
create the faux lab nook in the degree show. E-paper screen for artefact captions
would be sweet, in a similar format to museum artefact maps, the digital ones.

Stacking books would also be kind of cool (I could write notes inside to leave hints,
links to the story I am trying to convey). I could be more lax now with the tech
artefacts I incorporate in there. I need to factor in fast prototyping.

I think I should focus some of my time into illustrations and some scrapbooking. I
want to extract from it a base for 3D prints for the vitrine, visuals for the
website, and the sustained proof of effort.

Louise offered I use her office, though she characterised it as 'nepotistic'. She
made a good point regarding the University of Reading outreach: I could try PhD
students rather than the professors to gain lab access.

Thinking about the UI for the audio snippets. Might help to clean that up, keep the
size of window with image and audio player fixed, maybe horizontal rather than a
classic window. Thought to use a Zoom recorder image as the casing. I really hate how
all aesthetics across the screen point to my project being a toy.

---

## Additional sources

- Micrarium, UCL Grant Museum of Zoology — <https://blogs.ucl.ac.uk/museums/tag/micrarium/>
- Markdown Dingus (Gruber) — <https://daringfireball.net/projects/markdown/dingus>, used to preview and test Markdown formatting
- CSS-Tricks, "Let's Create a Custom Audio Player" — <https://css-tricks.com/lets-create-a-custom-audio-player/>
- Fully Kiosk — <https://www.fully-kiosk.com/>, for locking screen in place

**Artists:** Jamila Prowse, Lizzy Rose

I want to test out squigglifying all text on screen. It would make the personal mode
through the hover interaction more subtle, and the uncanniness of bugs more.

Also if the p5.js canvas vibe coding plan doesn't go through, applying keyframes for
more gradual transitions of filter, as it's currently unpleasantly stark, not to the
effect I was hoping for.

