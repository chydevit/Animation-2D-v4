# Story films: dialogue-driven scenes, people, lip-sync

Use this for character stories where people talk: introductions, office/school/family life, lessons, explainers
with a cast, or any brief that's mostly dialogue and narration rather than slapstick. The worked example is
`examples/team-story/` (*Bong Smei, Bong Nimith & Devit*: 8 scenes, ~3 min, Khmer dialogue + narrator).

## Contents
1. The timeline comes from the voices
2. People (`people.mjs`)
3. Lip-sync
4. Staging dialogue scenes
5. Style: pastel vs bold
6. Music and ambience for stories
7. Changing the brief midway

## 1. The timeline comes from the voices
In a talky film, shot lengths are set by the lines, so don't hard-code times. Use the running clock:
```js
import { take, beats, talk } from './kit.mjs';
const b = beats([0.6, 's1', 0.35, 's2']);          // numbers = gaps (s), strings = line ids
take(b.end + 1.2, (ctx, lt, t) => { /* draw */ }, [...b.cues, [0, 'room_tone', { dur: b.end + 1.2 }]]);
```
- `beats()` returns `{ cues, end, at: {id: startTime} }`, so you can key actions to lines (`lt > b.at.s2`).
- `lineDur(id)` (vox.mjs) gives the real clip length after pause-tightening, or an estimate (~11 Khmer chars/s)
  until the clip exists. You can stage everything before the voices finish; when they arrive, the whole film
  re-times itself.
- Narration can run across a cut: put the cue in the first shot and size the shots from `lineDur`
  (see the delivery montage in the example).
- Write `docs/shotlist.md` with target lengths per scene, then compare with the printed timeline after
  `npm run audio`. Trim gaps or tails if the film runs long; don't speed up voices.

## 2. People (`people.mjs`)
`person(ctx, who, o)` is a natural-proportion cartoon person (big friendly head, IK arms and legs, clean lines).
`who` is a key in `CAST` or a look object (spread a CAST entry and change colours for extras). A look has
`H` (height px), `sw`/`ww` (shoulder and waist half-width), skin, hair, `hairStyle` (short | neat | messy |
ponytail), `beard`, `glasses`, `headphones`, clothes `style` (polo | shirt | hoodie) and colours, `eyeSize`.

Options: `x, y, s, facing` (-1..1: 3/4 left to front to 3/4 right), `back` (seen from behind), `mirror` (flip
the figure to use the other hand), `pose`, `t`, `expr`, `mouth` (lip-sync 0..1), `look:[x,y]`, `hold:[left,
right]` (tea | coffee | marker | phone), `nod`, `tilt`, `sq`, `sit`.
- **Poses:** stand, walk (`ph`), sitTalk, type, thumbs, wave, draw, glasses, present, presentL, sip, jump (`hop`),
  raise, cheer, clap, panic, reach / reachL (`reach:[x,y]` in local px), notebook, highfive, hold, sitBack.
- **Expressions:** smile, calm, grin, laugh, proud (eyes closed), surprised, worried, panic, thinking,
  determined. Blinks are automatic.
- **Props and furniture:** `chair`, `chairBack`, `teaCup`, `icedCoffee`, `marker`, `notebook(open, drawFn)`, `phone`.
- **Elbows:** the IK always picks the outward/downward elbow, so raised hands don't cross the face.

Render a model sheet (`npm run sheet`) of every pose you plan to use before animating. Check age reads
(beard and gray temples for older, rounder face and bigger eyes for younger), that each character has a
silhouette hook, and gender and clothing exactly as the brief says.

## 3. Lip-sync
`talk(who, t)` returns mouth openness from the speaking clip's loudness (held on twos); pass it as
`mouth` (the example's `pp()` wrapper does this for every character). Mouths only move during that character's
own line cues. Narrator lines move no mouth. Small head bob comes with it. Before clips exist it flaps
procedurally, so early stills still show who's talking.

## 4. Staging dialogue scenes
- Shot pattern per scene: establishing wide → medium single on the speaker (cam zoom 1.5–2.1) → reaction or
  two-shot → back to wide for the button. "Cut between all three" = a single on each speaker.
- Give each speaker an action: turn to camera, adjust glasses, sip tea, thumbs up. Put it in the gap
  before or after the line, not on top of it.
- Background characters keep doing something (typing, waving).
- Hand contact (hand on shoulder, high five): compute the target from the other character's position in world
  space and convert to local (`(wx - o.x) / o.s`). Stand them close enough that the arm doesn't stretch
  rubber-style.
- Insert shots carry story beats without dialogue: phone screen with orders and an error, server rack smoking,
  dashboard going green, notebook with the plan, wall clock spinning (time passes).
- Split screen: two `clip()` polygons with a slanted divider, each with its own staging.
- Ending: a back view of the cast looking at the city, then the camera pulls back to the sky and a title card.

## 5. Style: pastel vs bold
`core.mjs` reads `film.json` `"style"`: `"bold"` (default: ink `#1d1520`, 7 px, saturated TV-cartoon colours) or
`"pastel"` (ink `#3b2d3b`, 5 px, softer). The team-story example started pastel and was switched to bold at the
user's request ("make it look like Getaway Car"). That took one `film.json` flag plus a bolder colour set in
`sets.mjs` `S` and `people.mjs` `CAST`. For pastel, use lighter, less saturated tokens (soft peach, mint,
lavender, baby blue). Both styles use a warm light wash over interiors (`warmLight`).

## 6. Music and ambience for stories
Music sections `warm` (e-piano + roneat-style xylophone), `upbeat` (marimba), `build` (driving ostinato for
work montages), `triumph` (brass celebration), `tender` (pads + piano for heartfelt endings), and `tension` for
problems. Set `film.json` `"mix": {"music": 0.95, "duck": 0.4}`: music plays full between lines and ducks under
dialogue automatically. Use `npm run qc` levels to confirm no window sits more than ~10 dB below the dialogue
windows unless it's meant to be quiet. Ambience per shot: `room_tone`, `city_amb`, `night_amb`
(each `{dur}`). SFX for offices: `typing`, `ping`, `error_buzz`, `alarm_beep`, `server_hum`, `party_pop`,
`party_horn`, `chime_success`, `highfive`, `swivel`, `marker`, `footsteps`, `sip`, `page_flip`, `clock_fast`,
`motorbike`, `sparkle`, `nod`, `whoosh {f0, f1, dur}`.

## 7. Changing the brief midway
Users revise briefs, for example changing a character's gender or a line. Stop the voice job if it's running.
Then change only what the revision touches:
- the look in `CAST`
- that character's voice: delete `voices/<who>.wav` and the clips
- the edited lines: delete just those clips

Re-run `npm run voices`. Everything else, including other characters' finished clips, is kept.
