# Dialogue and voices (VoxCPM2, Khmer or English)

## lines.json
```json
{
  "lang": "km", "translation": "en",
  "voices": {
    "benny":   { "seed": 2101, "design": "A nervous, jittery Cambodian man in his thirties, ... speaks fast and anxiously",
                 "sample": "ខ្ញុំ... ខ្ញុំខ្លាចណាស់បង។ ប៉ូលិសមកហើយ! យើងត្រូវរត់ឥឡូវនេះ!", "gain": 0.95, "pan": 0 },
    "speaker": { "seed": 2303, "design": "A bored young Cambodian fast-food worker talking through a drive-thru intercom...",
                 "sample": "...", "fx": "intercom", "gain": 0.75, "pan": 0.35 }
  },
  "lines": { "v_benny_yelp": ["benny", "ម៉ែអើយ!", "Oh, mother!"] },
  "seeds": { "v_benny_yelp": 11 }
}
```
- `lang` is the spoken language (subtitle track 1); `translation` is the second subtitle track (third field of each line).
- `fx`: `intercom` (drive-thru speaker), `radio`, `phone`. `gain`/`pan` per voice.
- `seeds.<line>` re-rolls a single line that came out garbled.
- English film: `"lang": "en"`, write English lines, drop `translation` (or translate to `km`). VoxCPM2 speaks English
  too. For quick drafts without VoxCPM a voice may carry `"say": {"voice": "Samantha", "rate": 175, "pitch": 0.93}`
  (macOS TTS, English only, robotic); it is used only when the VoxCPM clip is missing.

## Making the clips
`npm run voices` → `voices/run.sh`: writes `build/vox/jobs.json`, then runs the VoxCPM2 worker (`voices/tts_vox.py`) with
the first Python found among `$VOX_PY`, the khmer-2d-animation skill's `.venv-vox`, and `~/voxcpm-env`. If none
exists, install it once: `python3.12 -m venv ~/voxcpm-env && ~/voxcpm-env/bin/pip install voxcpm soundfile`
(the ~5 GB model downloads on first use). The worker:
1. **Locks one voice per character**: designs `voices/<who>.wav` from `(design)sample` once.
2. **Clones every line** from that clip into `build/vox/<id>.wav` so a character never changes voice.
Existing files are skipped. Delete a line's wav to regenerate it; delete `voices/<who>.wav` **and** that character's
lines to redesign a voice (only when the user asks: voices are part of the character).

Timing on Apple Silicon: model load 1–2.5 min, voice design 30–100 s, each line 10–60 s. **Run in the background**
(`run_in_background`) and tell the user the ETA; it is the slowest step of the whole build.

## Writing Khmer dialogue
- Natural spoken Khmer, short punchy lines (cartoon timing): `បើកទៅ។` beats a full sentence. Interjections work well:
  `ម៉ែអើយ!`, `អូយម៉ែ!`, `អឺ... អឺ...`, `ហ៊ូរ៉េ!`, `យេ៎!`.
- Names and loanwords in Khmer script (បេននី, ប៊ឺហ្គឺបាន); numbers as words. Register: friends/crew use ឯង/ខ្ញុំ, bong (បង) to
  strangers; elders, monks and royalty need the proper forms (see khmer-2d-animation's guidance).
- On-screen lettering that echoes a line should be Khmer too (`fx.sfxText('បើកទៅចុះ!', ...)`: Koulen is automatic).
  Pure sound words (BAM!, CRASH!) can stay as English onomatopoeia unless the user wants Khmer.
- Always tell the user the Khmer needs a native speaker's check and that VoxCPM can mispronounce words.

## Fitting lines to the picture
VoxCPM leaves long pauses at `!`/`។`/`...`; the mixer automatically shrinks pauses >0.22 s to 0.15 s and drops a stray
breath after the last word. Khmer lines usually run **longer than English**. After `npm run audio`, read the printed
timeline: if a line overlaps the next one or runs past its gag, move the next cue later, speed the exchange, or lengthen
the shot with `setShift()` and trim time elsewhere (see craft.md). Match mouth/reaction timing in the shot (e.g. a
speaker's talk light on for the line's real length).
