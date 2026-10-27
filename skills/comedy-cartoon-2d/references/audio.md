# Audio reference: cues, music, mix

Everything you hear is placed by **cues** inside shots: `[lt, 'name', {opts}]` (lt = seconds into the shot).
`npm run audio` synthesises it all (no samples, no copyright issues), mixes, normalises to -16 LUFS and prints
the dialogue timeline plus warnings for **overlapping lines** and **unknown cue names** (which would be silent).

## Music sections (cue pairs)
```js
[0.0, 'music', { id: 'chase1', style: 'chase', melody: true, bpm: 176, gain: 1 }]   // in one shot
[0.6, 'music_end', { id: 'chase1', how: 'cut' }]                                    // in a later shot
```
| style | sound | opts |
|---|---|---|
| `chase` | frantic swing: walking bass, ride/snare/kick, brass stabs, crash every 4 bars | `melody: true` (trumpet theme) or `'shout'` (theme + low octave), `bpm` 176, `vel`, `key` (semitones from D minor), `bars0` (start later in the 8-bar loop), `stabs:false` |
| `sneak` | heist pizzicato bass + snaps | `bpm`, `key` |
| `muzak` | quiet bossa e-piano (lobbies, drive-throughs, waiting) | `bpm` 112 |
| `tension` | low pulses that accelerate + tremolo cluster crescendo | `key` |
| `vamp` | happy major vamp (celebration) | `bpm` |

`how`: `'cut'` (40 ms), `'fade'` + `dur`, `'tapestop'` + `dur` (the record slows to a halt; great for running out of
gas / a plan collapsing). Every section has `gain`. Cut the music for deadpan holds and big reveals: **silence is a gag**.

## Stings (one-shot music hits)
`sting_title` (brass chord + crash), `sting_det` (determined chord + tom), `sting_shock` (brass fall + crash),
`sting_tiny` / `ta_da_small` (xylophone 3 notes), `sting_idea` (xylophone run up: lightbulb), `sting_panic`
(trill + clash), `ta_da` (big major chord landing, opts `key`), `heave_hit` `{i, lead: 0.4}` (rising brass per
effort/push; i = step), `sad_trombone` (wah-wah-wah-waaah), `end_button` (jazzy "bum-BUM!").

## Sound effects
| group | cues (opts) |
|---|---|
| whistles and springs | `boing {pitch}`, `zip_up`, `zip_down`, `slide_up`, `slide_up_fast`, `slide_down_short`, `stretch`, `squish`, `squeak_rubber {pitch}`, `car_bounce` |
| whooshes | `title_whoosh`, `whoosh_by`, `whoosh_rev`, `look_whip`, `pan_up_whoosh`, `wind {dur}` |
| impacts | `door_bam`, `thud`, `land_thud`, `stomp`, `crash`, `trash_clatter`, `flop`, `facepalm_slap`, `clunk` |
| vehicles | `engine_rev {dur}`, `rev_short`, `zoom_off`, `skid`, `skid_short`, `putt` (engine cough), `honk` (meep-meep), `meep`, `blinker {dur}`, `roll_stop`, `steam_hiss`, `car_groan`, `creak {i}`, `creak_long` |
| bikes / bells | `bike_squeak {n, gap}`, `brake_squeak`, `bell` (bike bell ding), `register_ding` |
| alarms | `siren {dur}` (wail), `siren_slow {dur}`, `alarm {dur}` (bank bell) |
| body / voice FX | `gulp`, `heartbeat {n}`, `grunt {f0: 150 man / 225 woman / 320 kid, i, gain, pan}`, `yawn`, `munch {n}`, `scramble {dur}` (running feet), `drum_fingers {dur}` |
| nature / misc | `quack {n, gap}` (mama + ducklings), `quack_small`, `gull {n}`, `cricket {dur}` (awkward silence), `flutter {dur}` (paper/money), `snatch`, `zip_rope`, `lid_wobble`, `needle_drop`, `record_scratch`, `drumroll {dur}`, `blink`, `iris_snap` |

Sync SFX to the frame of contact (the impact frame, not the anticipation). Put a `whoosh`/`zip` under every smear.

## Dialogue
Any cue whose name is a line id in `voices/lines.json` plays that line (see voices.md). Place it where the mouth/reaction
happens; `npm run audio` reports each line's real start and length, so adjust cues (or the shot) until there are no
overlaps.

## Mix
Buses: music ×0.5, sfx ×0.75, voice ×1.1, small reverb on music/sfx, tanh soft-clip, loudnorm -16 LUFS / -1.5 dBTP.
Long continuous SFX (siren, alarm) are kept low (0.24–0.38) because they fatigue. To add a new sound, write a synth in
`SFX` (or reuse `SFX.voiceSynth`, `SFX.slide`, `SFX.clang`, `SFX.whoosh`) and a `case` in `playCue`.

## Checking without ears
You cannot listen, so verify with `npm run qc`: `film/qc/spectrogram.png` (sections, silences, stings should sit where
the shot list says) and `film/qc/levels.txt` (no dead or clipped windows; quiet beats ~5 dB lower is intended). Tell the
user you checked levels/spectrogram, not by ear.
