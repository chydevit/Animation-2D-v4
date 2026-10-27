# Animation-2D-v4

**Getaway Car**: a 90-second comedy cartoon with Khmer dialogue, drawn completely in code, plus the
**comedy-cartoon-2d** skill that lets [Claude Code](https://claude.com/claude-code) make new cartoons from a short
description: slapstick comedies like this one, and story videos where characters talk, with lip-sync and a narrator.
The skill includes two finished examples with their videos: *Getaway Car* (comedy) and *Bong Smei, Bong Nimith &
Devit* (a 2.5-minute Khmer story about a Phnom Penh tech team).

| path | what |
|---|---|
| `Getaway Car.mp4` | the finished film (1920×1080, 24 fps, Khmer voices, Khmer + English subtitles you can turn on) |
| `Getaway Car.km.srt`, `Getaway Car.en.srt` | the subtitles as separate files |
| `getaway-car/` | the film's source code, voices and dialogue |
| `skills/comedy-cartoon-2d/` | the Claude Code skill |

---

## 1. Watch the film
Download `Getaway Car.mp4` and open it in any video player. To see subtitles, choose **Subtitles → ខ្មែរ** or
**English** in your player (in QuickTime: *View → Subtitles*; VLC also works). You can also load the `.srt` files.

---

## 2. Make your own cartoon with the skill

### What you need
- A **Mac** (Apple Silicon M1/M2/M3/M4 recommended; voices are much slower on Intel)
- **Claude Code** installed and signed in: https://claude.com/claude-code
- **Node.js 18+** and **ffmpeg**
- About **8 GB free disk** for the voice model, if you want spoken dialogue

### Step 1: install the tools
```sh
brew install node ffmpeg
```
(No Homebrew? Get it at https://brew.sh.)

### Step 2: install the skill
```sh
git clone https://github.com/chydevit/Animation-2D-v4.git
cp -R Animation-2D-v4/skills/comedy-cartoon-2d ~/.claude/skills/
```
Restart Claude Code so it picks up the skill.

### Step 3: install the voice engine (VoxCPM2) for dialogue
Skip this step if your cartoon has no talking. Run it once:
```sh
python3.12 -m venv ~/voxcpm-env
~/voxcpm-env/bin/pip install voxcpm soundfile
echo 'export VOX_PY=$HOME/voxcpm-env/bin/python' >> ~/.zshrc
source ~/.zshrc
```
The first time voices are made, the model (about 5 GB) downloads automatically. It runs on your own Mac, with no
account or internet needed after that.
(If you already have the `khmer-2d-animation` skill installed, its voice setup is used automatically and you can
skip this step.)

### Step 4: ask Claude for a cartoon
Open Claude Code in an empty folder and type `/` to call the skill directly, then describe your cartoon after it:
```
/comedy-cartoon-2d a hungry cat tries to steal a fish from a market seller on a scooter, 60 seconds, Khmer voices
```
Typing `/` shows a menu of your skills; start typing `comedy` and press **Tab** or **Enter** to pick it.

You can also just describe your cartoon without the `/` and Claude will pick the skill by itself. Examples:

- *"Make a funny 60-second cartoon: a hungry cat tries to steal a fish from a market seller on a scooter. Khmer voices."*
- *"Make a new Getaway Car episode: Benny and Marge try to rob an ice-cream truck, and the bike cop is the ice-cream man."*
- *"Make a 2-minute Khmer story: a grandmother teaches her grandson to cook amok. Narrator plus two voices."*
- Paste a full build prompt (characters, story beats with times, camera, sound, colours), like
  [the Getaway Car prompt](skills/comedy-cartoon-2d/examples/getaway-car/prompt.md) or
  [the team story prompt](skills/comedy-cartoon-2d/examples/team-story/prompt.md).
- Add *"use the Getaway Car look"* for thick black outlines and bright colours, or *"soft pastel"* for a gentler style.

Claude will then:
1. write a **shot list** (every shot, with times and gags) and show it to you
2. design the **characters** and show you a character sheet
3. build the backgrounds and animate shot by shot, checking pictures as it goes
4. write the **dialogue** (Khmer by default if you ask for Khmer, or English) and make the voices
5. add the **music** (jazzy chase score) and **cartoon sound effects** (boing, honk, skid, slide whistle…)
6. build the final video with subtitles

You get `film/<title>.mp4` (with its cover embedded as the thumbnail), the cover images `film/cover.png` and
`film/cover_1280.jpg`, the subtitle `.srt` files, and check images in `film/qc/`. Claude also checks every Khmer
voice line with Khmer Whisper and re-records unclear ones.

**How long?** The drawing and rendering take minutes. Voices are the slow part: about 2 minutes to load the model,
then 10–60 seconds per line. A 90-second cartoon with ~15 lines takes roughly **30–60 minutes** in total.

### Step 5: change things
Just tell Claude what to change, for example:
- *"Make the duck scene longer and add one more duckling."*
- *"Marge's voice should be deeper."*
- *"Change the dialogue to English."*
- *"The ending needs a bigger laugh."*

Claude knows the project structure and rebuilds only what's needed.

---

## 3. Use the engine yourself (without Claude)
The skill is also a normal Node project you can edit by hand:
```sh
~/.claude/skills/comedy-cartoon-2d/scripts/new_project.sh my-cartoon                         # 9 s starter film
~/.claude/skills/comedy-cartoon-2d/scripts/new_project.sh my-cartoon --example getaway-car   # the comedy example
~/.claude/skills/comedy-cartoon-2d/scripts/new_project.sh my-cartoon --example team-story    # the story example
cd my-cartoon
```
| command | what it does |
|---|---|
| `npm run stills -- 1.5 4 8` | render pictures at those seconds (fast check) → `build/stills/` |
| `npm run sheet` | character model sheet |
| `npm run voices` | make missing voice clips with VoxCPM2 |
| `npm run asr` | check every Khmer voice line with Khmer Whisper |
| `npm run cover` | make the cover / thumbnail |
| `npm run build` | render video + music/SFX/voices + subtitles + cover → `film/` |

Where things live:
- `src/shots.mjs`: the film (every shot, camera and sound cue)
- `src/chars.mjs`: the characters
- `src/bg.mjs`: the places
- `voices/lines.json`: voices and dialogue

The guides are in `skills/comedy-cartoon-2d/references/`.

---

## 4. Rebuild Getaway Car from source
```sh
cd getaway-car
npm install
npm run build
```
The Khmer voice clips are included, so this works without the voice engine (about 1 minute).

---

## Troubleshooting
| problem | fix |
|---|---|
| `VoxCPM2 python not found` | do Step 3, then open a new terminal (or set `VOX_PY` to a Python that has `voxcpm` installed) |
| `missing build/vox/....wav` | run `npm run voices` |
| Claude doesn't use the skill | start your message with `/comedy-cartoon-2d`; if it's not in the `/` menu, check `~/.claude/skills/comedy-cartoon-2d/SKILL.md` exists and restart Claude Code |
| a voice says a word wrong | ask Claude to re-roll that line, or change its spelling a little |
| `ffmpeg: command not found` | `brew install ffmpeg` |

## Notes
- Voices are AI (VoxCPM2) and can mispronounce Khmer words. Have a native speaker check the Khmer before you
  publish.
- All music and sound effects are generated by code, so there's no copyright music.
- Make your own characters. The skill is for original cartoons, not copies of existing cartoon characters.
- The Khmer font **Koulen** is included under the SIL Open Font License (`skills/comedy-cartoon-2d/template/assets/fonts/OFL.txt`).
