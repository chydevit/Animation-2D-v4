# Getaway Car

An 89.6-second 2D cartoon built entirely in code: 1920×1080 at 24fps, with characters animated on twos.
The finished film is `../Getaway Car.mp4`.

## Rebuild

```sh
npm install
npm run build                 # renders video in parallel + synthesizes audio + muxes ../Getaway Car.mp4
npm run stills -- 9.5 46.6    # renders frames at these times to build/stills/ (+ a contact sheet)
```

The build needs macOS (system fonts plus the Koulen Khmer font), Node 18+, and ffmpeg.

## Khmer voices (VoxCPM2)

The dialogue is in Khmer, spoken by VoxCPM2 (https://voxcpm.com/en/) running locally through the
khmer-2d-animation skill's worker. `voices/khmer_lines.json` holds each character's voice design and every
line (Khmer + English). `voices/benny.wav`, `voices/marge.wav` and `voices/speaker.wav` are the locked
reference voices, and each line is cloned from its character's clip, so the voices never drift.

To change a line, edit `voices/khmer_lines.json`, delete `build/vox_km/<line>.wav`, rebuild the job file
and run the worker (only missing clips are synthesised):

```sh
SK=~/.claude/skills/khmer-2d-animation
python3 voices/make_jobs.py
$SK/.venv-vox/bin/python $SK/scripts/tts_vox.py build/vox_km/jobs.json
npm run audio    # remix; also writes build/subtitles_km.srt + build/subtitles_en.srt
```

To redesign a voice, delete `voices/<who>.wav` and every clip of that character, then run the worker again.

## Files

| file | what |
|---|---|
| `src/core.mjs` | palette, easing, ink/fill/cel-shade helpers, rubber-hose limbs, IK |
| `src/chars.mjs` | Benny, Marge, the Cop + bike, the Car (side and front views, bumper face), ducks, loot |
| `src/bg.mjs` | city parallax rows, street, bank, drive-thru, bridge, police station, top-down city |
| `src/fx.mjs` | dust, smoke, impact stars, SFX lettering, siren wash, iris |
| `src/shots.mjs` | **the film**: every shot's timing, staging and camera, plus the audio cue markers |
| `src/render.mjs` | frame renderer (parallel segments → ffmpeg) |
| `src/audio.mjs` | jazz chase score, SFX synths, voice lines and the mix |

To change timing, edit a shot's `shot(start, end, ...)` in `shots.mjs`. The audio cues for that shot are
listed next to it and stay in sync automatically.
