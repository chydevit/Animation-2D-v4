---
name: comedy-cartoon-2d
description: >-
  Comedy 2D cartoon short builder: turns a cartoon brief, build prompt, beat sheet or gag idea into a finished
  60–120 s MP4 in a bold modern TV-cartoon style. It uses thick black outlines, flat bright colours with one-tone
  shading, squash-and-stretch, smears, holds before gags and characters animated on twos, all drawn in code
  (Node + canvas, 1920×1080, 24 fps). It ships with a synthesized frantic jazz chase score (walking bass, swing
  drums, brass stabs, stings, tape-stops) and 80+ cartoon sound effects (boings, honks, skids, slide whistles,
  sirens, bike bells, quacks, sad trombone). Dialogue can be in Khmer (default when the user writes Khmer or asks
  for it) or English, spoken by locked VoxCPM2 voices, with Khmer lettering in Koulen and soft Khmer/English
  subtitles. Use it whenever the user wants a funny animated short, slapstick, chase or heist cartoon, a gag
  cartoon "like a TV cartoon short", a 2D animation build prompt with characters, beats and timings, a new episode
  or sequel with Benny, Marge, the bike cop or the getaway car, or a cartoon re-voiced in Khmer, even if they
  don't name the skill. Prefer khmer-2d-animation for chibi Khmer folk tales, kids-cartoon-video for 3D kids
  learning videos and flat-explainer-doc for narrated explainers.
---

# Comedy Cartoon 2D

Build an original comedic cartoon short from a brief, entirely in code: characters, sets, animation, camera,
music, sound effects, dialogue, subtitles. The engine is the one that made **Getaway Car** (a 90 s heist chase,
`examples/getaway-car/`). Read that example's `shots.mjs` before writing a new film: it is the most useful
reference for how gags, camera moves and cues are written.

`SK` = this skill's folder (`~/.claude/skills/comedy-cartoon-2d`).

## Requirements
macOS (Apple Silicon is best), Node 18+, ffmpeg. Dialogue uses VoxCPM2, run through the venv that the
khmer-2d-animation skill installs (`~/.claude/skills/khmer-2d-animation/.venv-vox`, override with `VOX_PY`). The
Koulen Khmer font is bundled. Characters must be **original designs**; never recreate existing cartoon characters,
even renamed.

## Workflow

Show the user the plan and early stills before the expensive steps. Voices take minutes and you can't listen to
audio, so catch problems in pictures and timelines.

### 1. Understand the brief → shot list
Read the whole brief. Pull out the characters (look, personality, silhouette hook), the beats with their target times,
each gag, the camera language, the audio wishes and the length. Write `docs/shotlist.md` in the project: a table
of shot id, start–end, framing (wide/medium/CU/insert/low angle/top-down), action, the gag and the cues. Hit the
brief's beat timings. Comedy needs room: 1.5–4 s for a gag or reaction, 0.8–2.5 s cuts in chases, and holds before
punchlines. See `references/craft.md` for timing patterns and staging.

If the brief is thin, invent gags in its spirit (rule of three, contrast, deadpan to camera, the reveal pan, a
one-sound button) rather than asking many questions. Ask only about real forks, such as the dialogue language
when it's unclear.

### 2. Scaffold
```
SK/scripts/new_project.sh <project-dir>                         # starter film (3 shots) to replace
SK/scripts/new_project.sh <project-dir> --example getaway-car   # the full example (builds offline)
```
The project gets `src/` (engine plus your film), `voices/`, `film.json` (title), `package.json` scripts and
`node_modules`. The starter `src/shots.mjs` shows every pattern in about 70 lines. `npm run build` on it should work
straight away; use that as a smoke test.

### 3. Cast → model sheet
Put the characters in `src/chars.mjs`. The example cast (round nervous guy, tall lanky boss, bored cop on a bike,
a car with a bumper face, ducks, loot) is a set of rig templates: reuse them when they fit, or copy the closest rig
and change it. Every rig takes `x, y, s, flip, rot, sq` (squash/stretch), `t`, `pose`, `expr` and `look`
(`references/engine.md` lists them all). Edit `src/sheet.mjs` and run `npm run sheet`, then **look at**
`build/stills/sheet.png`. Check that silhouettes differ, faces read at small size, and limbs read against dark
shapes (add socks, cuffs or highlights). Fix problems now; they get expensive later.

### 4. Sets
Build locations in `src/bg.mjs` from the existing pieces (sky, parallax city rows, shop row, street, speed-line
loop, bank, drive-through, bridge, police station, top-down city) or new ones in the same flat style. Fill every
region the camera can see, since zoomed-out shots expose holes.

### 5. Shots: animate, then look
Write `src/shots.mjs` shot by shot: `shot(start, end, (ctx, lt, t) => {...}, cues)`. Use `cam()` for framing,
`onTwos(lt)` for character cycles, anticipation → smear (ghost copies plus streaks) → squash → `wobble` settle for
actions, and `fx.sfxText` for sound words. After every few shots run
`npm run stills -- <times>` and **Read the contact sheet**. Look for the problems in `references/craft.md`
"QC checklist": hidden or overlapped characters, clipped text, wrong window clipping, effects drawing too early,
background holes. Fix them before moving on. Rendering is cheap (about 25 s for 90 s), so iterate.

### 6. Dialogue (VoxCPM2)
Write `voices/lines.json`: one voice per character (English *design* description, sample sentence, seed) and
short punchy lines with a translation (`references/voices.md`). For Khmer, write natural colloquial Khmer, names
in Khmer script, and Khmer lettering for any on-screen words that echo a line. Then:
```
npm run voices      # run_in_background: ~1–2.5 min model load + 10–60 s per line
```
Tell the user the ETA. It locks `voices/<who>.wav` once and clones every line from it, so voices stay consistent.
Add each line's id as a cue at the moment it should be spoken.

### 7. Sound
Add cues to every shot: SFX on contact frames, a whoosh under every smear, stings on reactions, music sections as
`music`/`music_end` pairs (chase, sneak, muzak, tension, vamp; `cut`/`fade`/`tapestop` endings), and silence
before reveals. The full catalogue is in `references/audio.md`. Then run `npm run audio`. It prints the real
dialogue timeline and warns about **overlapping lines** and **unknown cues**. Khmer lines often run longer than
planned; fix that by moving cues or growing the shot with `setShift()` and trimming elsewhere (craft.md
"Retiming").

### 8. Build and QC
```
npm run build       # video + audio + mux (soft subtitles) + qc
```
This writes `film/<title>.mp4`, `film/<title>.<lang>.srt`, and in `film/qc/` a contact sheet, a spectrogram and
levels. Read the contact sheet and spectrogram, check levels (no dead or clipped windows), and extract 3–6
full-res frames of key gags with ffmpeg and look at them. You can't hear the result: say that you verified
timing, levels and spectrogram, and ask the user to listen.

### 9. Deliver
Copy or point to the MP4 and SRTs, and give the runtime, the beats/shots summary, the cast and voices, and any
caveats:
- VoxCPM may mispronounce words.
- Khmer should get a native speaker's review.
- Which sound words stayed English.

Offer specific next tweaks.

## Making changes later
- Retime a beat: edit its shot's end, `setShift()`, then rebuild. Cues follow automatically.
- Change a line: edit `voices/lines.json`, delete `build/vox/<id>.wav`, run `npm run voices`, then
  `npm run audio && npm run mux`.
- Redesign a voice only when asked: delete `voices/<who>.wav` and that character's clips.
- Visual-only edits: run `npm run video && npm run mux`.

## Files
| path | purpose |
|---|---|
| `scripts/new_project.sh` | scaffold a project (starter or example) |
| `template/src/core.mjs` | palette, easing, `paint/cel/hose/smooth/text` primitives, `onTwos`, `wobble`, Khmer font switch |
| `template/src/kit.mjs` | `shot/setShift`, `cam/shk/toScreen`, `titleCard`, `perspStreet`, `radialLines`, `drawFrame/allCues` |
| `template/src/chars.mjs` | example cast rigs (templates for new characters) |
| `template/src/bg.mjs`, `fx.mjs` | sets and props; effects (dust, impact, lettering, siren wash, iris, smear streaks) |
| `template/src/render.mjs` | `stills` contact sheets and parallel `video` render |
| `template/src/audio.mjs` | cue-driven score, SFX synths, VoxCPM dialogue, mix, subtitles, warnings |
| `template/src/build.mjs` | `mux` (MP4 + soft subtitle tracks) and `qc` |
| `template/voices/` | `lines.json`, `make_jobs.py`, `run.sh`, `tts_vox.py` (VoxCPM2 worker) |
| `examples/getaway-car/` | full 90 s film: `shots.mjs`, `prompt.md` (brief + staging table), voices, clips, contact sheet |
| `references/engine.md` | every drawing/rig/set/fx API |
| `references/audio.md` | cue catalogue, music sections, mix, checking audio without ears |
| `references/voices.md` | lines.json, VoxCPM2 flow, writing Khmer, fitting lines to picture |
| `references/craft.md` | style bible, comedy timing, staging, retiming, QC checklist |
