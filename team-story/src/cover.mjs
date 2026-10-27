// Cover / thumbnail: `node src/cover.mjs` -> film/cover.png (1920x1080) + film/cover_1280.jpg (YouTube size)
import { createCanvas } from '@napi-rs/canvas';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { W, H, INK, rrect, paint, poly, text } from './core.mjs';
import { person } from './people.mjs';
import * as st from './sets.mjs';

const film = JSON.parse(fs.readFileSync('film.json', 'utf8'));
const cv = createCanvas(W, H), ctx = cv.getContext('2d');
const t = 1.3;

// background: sunset Phnom Penh, pushed in a little so the monument sits behind the group
ctx.save(); ctx.translate(W / 2, H / 2); ctx.scale(1.25, 1.25); ctx.translate(-1000, -560);
st.sunsetSky(ctx, { t, sunY: 520 }); st.skyline(ctx, t);
ctx.restore();
// soft light burst behind the group
ctx.save(); const g = ctx.createRadialGradient(960, 760, 60, 960, 760, 900); g.addColorStop(0, 'rgba(255,240,190,0.75)'); g.addColorStop(1, 'rgba(255,240,190,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = '#ffffff';
for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; poly(ctx, [[960, 760], [960 + Math.cos(a) * 1600, 760 + Math.sin(a) * 1600], [960 + Math.cos(a + 0.12) * 1600, 760 + Math.sin(a + 0.12) * 1600]]); ctx.fill(); }
ctx.restore();

// the cast, big: Devit (thumbs up) – Smei (tea, proud) – Nimith (notebook / glasses)
person(ctx, 'nimith', { x: 1470, y: 1500, s: 1.95, facing: -0.35, pose: 'glasses', expr: 'smile', t, look: [-0.2, 0.1] });
person(ctx, 'devit', { x: 450, y: 1520, s: 2.0, facing: 0.35, pose: 'thumbs', hold: ['coffee', null], expr: 'grin', t, look: [0.2, 0.1] });
person(ctx, 'smei', { x: 960, y: 1560, s: 2.15, facing: 0.05, pose: 'hold', hold: [null, 'tea'], expr: 'grin', t });

// title banner
ctx.save(); ctx.translate(960, 190); ctx.rotate(-0.025);
rrect(ctx, -720, -120, 1440, 250, 60); paint(ctx, '#fff6e6', 10);
text(ctx, 'បងស្មី បងនិមិត្ត និង ដេវីត', 0, -18, { size: 130, fill: '#f2823a', lw: 14 });
text(ctx, 'Bong Smei, Bong Nimith & Devit', 0, 82, { size: 44, font: 'Arial Black', fill: '#2d3a6b', lw: 0 });
ctx.restore();
// small tags
const tag = (x, y, words, col, rot) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.font = '40px "Arial Black"'; const w = ctx.measureText(words).width / 2 + 34; rrect(ctx, -w, -36, w * 2, 72, 36); paint(ctx, col, 7); text(ctx, words, 0, 2, { size: 38, font: 'Arial Black', fill: '#ffffff', lw: 0 }); ctx.restore(); };
tag(450, 545, 'DEVELOPER', '#f2823a', -0.07);
tag(960, 470, 'MENTOR', '#2e8a57', 0);
tag(1470, 545, 'ENGINEER', '#3f8bd0', 0.07);

fs.mkdirSync('film', { recursive: true });
fs.writeFileSync('film/cover.png', cv.toBuffer('image/png'));
execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', 'film/cover.png', '-vf', 'scale=1280:720', '-q:v', '2', 'film/cover_1280.jpg']);
console.log(`-> film/cover.png, film/cover_1280.jpg (${film.title})`);
