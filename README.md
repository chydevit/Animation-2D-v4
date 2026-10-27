# Animation-2D-v4

**Getaway Car**: a 90-second comedic 2D cartoon with Khmer dialogue, drawn entirely in code.

| path | what |
|---|---|
| `Getaway Car.mp4` | the finished film (1920×1080, 24 fps; Khmer + English soft subtitles) |
| `Getaway Car.km.srt`, `Getaway Car.en.srt` | subtitles |
| `getaway-car/` | the film's source: Node + canvas drawing, synthesized jazz score and cartoon SFX, VoxCPM2 Khmer voices |
| `skills/comedy-cartoon-2d/` | Claude Code skill that builds new cartoons like this one from a brief |

## Rebuild the film
```sh
cd getaway-car && npm install && npm run build
```
Needs macOS, Node 18+ and ffmpeg.

## Install the skill
```sh
cp -R skills/comedy-cartoon-2d ~/.claude/skills/
```
Then ask Claude Code for a cartoon, e.g. paste a build prompt or say "make a funny 60-second chase cartoon with Khmer
voices". Dialogue uses VoxCPM2 through the `khmer-2d-animation` skill's Python environment (see
`skills/comedy-cartoon-2d/references/voices.md`).
