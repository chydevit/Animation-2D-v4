// "Bong Smei, Bong Nimith & Devit" — 8 scenes. Shot lengths come from the real dialogue clips
// (beats()/lineDur), so the film re-times itself when voices change.
import { W, H, INK, TAU, paint, circle, oval, rrect, poly, text, clamp, lerp, seg, ease, onTwos, hash, wobble } from './core.mjs';
import { take, clock, beats, talk, cam, toScreen, shk, duration } from './kit.mjs';
import { lineDur } from './vox.mjs';
import { person, chair, chairBack, CAST, notebook, icedCoffee } from './people.mjs';
import * as st from './sets.mjs';
import * as fx from './fx.mjs';

const D = lineDur;
// person with lip-sync from the voice track
const pp = (ctx, who, t, o = {}) => person(ctx, who, { t, mouth: typeof who === 'string' ? talk(who, t) : 0, ...o });
const warmLight = (ctx, a = 0.18) => { ctx.save(); const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, `rgba(255,214,150,${a})`); g.addColorStop(1, 'rgba(255,214,150,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); };
const bubble = (ctx, x, y, words, k, { col = '#ffffff', size = 56, tail = -1 } = {}) => {
  if (k <= 0) return;
  const s = ease.back(clamp(k * 3)) * (k > 0.85 ? 1 - (k - 0.85) / 0.15 : 1);
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.font = `${size}px "Koulen"`; const w = ctx.measureText(words).width / 2 + 40;
  rrect(ctx, -w, -size * 0.9, w * 2, size * 1.8, size * 0.8); paint(ctx, col, 5);
  poly(ctx, [[tail * 20, size * 0.85], [tail * 60, size * 1.6], [tail * 50, size * 0.85]]); paint(ctx, col, 0);
  ctx.beginPath(); ctx.moveTo(tail * 20, size * 0.9); ctx.lineTo(tail * 60, size * 1.6); ctx.lineTo(tail * 50, size * 0.9); paint(ctx, null, 5);
  text(ctx, words, 0, 4, { size, fill: '#ff8c6b', lw: 0 });
  ctx.restore();
};
function titleKh(ctx, lt, inAt, outAt, kh, en, y = 300) {
  const k = ease.back(seg(lt, inAt, inAt + 0.6)) * (1 - ease.in(seg(lt, outAt, outAt + 0.4)));
  if (k <= 0) return;
  ctx.save(); ctx.translate(960, y); ctx.scale(k, k);
  rrect(ctx, -600, -130, 1200, 250, 70); paint(ctx, 'rgba(255,248,240,0.94)', 6);
  text(ctx, kh, 0, -30, { size: 100, fill: '#ff8c6b', lw: 0 });
  text(ctx, en, 0, 66, { size: 40, font: 'Arial Black', fill: '#6a5a7a', lw: 0 });
  ctx.restore();
}
const scene = (lens) => lens.reduce((a, b) => a + b, 0);

// ============================================================ SCENE 1 — Introduction
{
  const b = beats([4.6, 'n1']), len = b.end + 2.4;
  take(len, (ctx, lt, t) => {
    const k = ease.inOut(seg(lt, 2.4, len));
    const w0 = st.TEAM_WIN, tx = w0.x + w0.w / 2, ty = w0.y + w0.h / 2;
    const z = Math.exp(lerp(0, Math.log(6.4), k * k));
    ctx.save(); cam(ctx, lerp(960, tx, Math.min(1, k * 1.2)), lerp(540, ty, Math.min(1, k * 1.2)), z);
    st.sunsetSky(ctx, { t }); st.skyline(ctx, t); st.officeTower(ctx, t);
    ctx.restore();
    titleKh(ctx, lt, 0.5, 3.9, 'បងស្មី បងនិមិត្ត និង ដេវីត', 'Bong Smei, Bong Nimith & Devit');
    fx.wash(ctx, '#fff6ea', seg(lt, len - 0.35, len) * 0.8);
  }, [[0, 'music', { id: 'w1', style: 'warm', gain: 0.85 }], [0, 'city_amb', { dur: len }], [0.55, 'sparkle'], ...b.cues, [len - 1.4, 'whoosh', { f0: 250, f1: 1400, dur: 1.4, gain: 0.3 }]]);
}

// ============================================================ SCENE 2 — Meet Devit
{
  const SP = 1.9; // typing, then the swivel
  const b = beats([SP + 1.2, 'd1', 0.3, 'd2']), len = b.end + 1.5;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 930, 650, 1.5);
    st.office(ctx, t, {});
    const spin = seg(lt, SP, SP + 0.5);
    let facing = 0.7, back = false, pose = 'type', expr = 'grin', look = [1, 0];
    if (spin > 0) { pose = 'sitTalk'; look = [0, 0]; }
    if (spin > 0 && spin < 1) { back = spin > 0.2 && spin < 0.65; facing = spin < 0.2 ? 0.7 : -0.6 + spin * 0.6; }
    if (spin >= 1) facing = 0.12;
    if (lt > SP + 0.5 && lt < b.at.d1 + D('d1') * 0.8) pose = 'thumbs';
    const bounce = spin >= 1 ? wobble(lt - SP - 0.5, 3, 6) * 0.06 : 0;
    chairBack(ctx, 760, 1180, 1.45, '#8fa6c9');
    pp(ctx, 'devit', t, { x: 760, y: 1180, s: 1.45, facing, back, pose, sit: true, expr, look, sq: bounce });
    if (spin > 0.05 && spin < 0.9) { ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 8; ctx.lineCap = 'round'; for (const r of [230, 270]) { ctx.beginPath(); ctx.ellipse(760, 760, r, r * 0.35, 0, Math.PI * (0.1 + spin), Math.PI * (0.8 + spin)); ctx.stroke(); } ctx.restore(); }
    st.desk(ctx, 980, 1010, 1600, { monitorX: 330, t, codeSpeed: 3 });
    icedCoffee(ctx, 520, 975, 1.1);
    if (lt < SP + 0.2) st.flyingCode(ctx, 1290, 760, t, 16, 1);
    ctx.restore();
    warmLight(ctx, 0.12);
  }, [[0, 'music_end', { id: 'w1', how: 'fade', dur: 0.6 }], [0, 'music', { id: 'u1', style: 'upbeat', gain: 0.6 }], [0, 'room_tone', { dur: len }], [0, 'typing', { dur: SP, rate: 16 }], [SP, 'swivel'], [SP + 0.55, 'sparkle'], ...b.cues, [b.end + 0.4, 'blink']]);
}

// ============================================================ SCENE 3 — Meet Bong Nimith
const NIM = { x: 1330, y: 1060, s: 1.35 };
const toLocal = (wx, wy, o) => [(wx - o.x) / o.s, (wy - o.y) / o.s];
function bgDevit(ctx, t, { wave = 0, look = [1, 0] } = {}) {
  chairBack(ctx, 640, 905, 0.8, '#8fa6c9');
  pp(ctx, 'devit', t, { x: 640, y: 905, s: 0.8, facing: wave ? 0.6 : 0.8, pose: wave ? 'wave' : 'type', sit: true, expr: 'grin', look });
  ctx.save(); ctx.translate(700, 860); ctx.scale(0.5, 0.5); st.desk(ctx, 0, 0, 700, { monitorX: 160, t, mug: false }); ctx.restore();
}
{
  const DRAW = 2.6, b = beats([3.7, 'm1', 0.3, 'm2']), len = b.end + 1.0;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1180, 560, 1.38);
    st.office(ctx, t, { board: seg(lt, 0.2, DRAW) });
    bgDevit(ctx, t, { wave: lt > 3.2 && lt < 5.0 ? 1 : 0 });
    const turned = lt > DRAW + 0.15;
    if (!turned) {
      const a = lt * 5, [hx, hy] = toLocal(1400 + Math.cos(a) * 90, 330 + Math.sin(a * 1.3) * 60, NIM);
      pp(ctx, 'nimith', t, { ...NIM, back: true, pose: 'reach', reach: [hx, hy], hold: [null, 'marker'] });
    } else {
      const pose = lt < 3.6 ? 'glasses' : 'hold';
      pp(ctx, 'nimith', t, { ...NIM, facing: 0.25, pose, hold: [null, 'marker'], expr: lt < 3.6 ? 'calm' : 'smile', sq: wobble(lt - DRAW - 0.15, 3, 7) * 0.05 });
      if (lt > 3.0 && lt < 3.5) { const [gx, gy] = [NIM.x + 30, NIM.y - 515]; fx.puff(ctx, gx, gy, 10 * (1 - seg(lt, 3.0, 3.5)), '#ffffff', 1); }
    }
    ctx.restore();
    warmLight(ctx, 0.1);
  }, [[0, 'music_end', { id: 'u1', how: 'fade', dur: 0.5 }], [0, 'music', { id: 'w2', style: 'warm', gain: 0.6, melody: false }], [0, 'room_tone', { dur: len }], [0.2, 'marker', { dur: DRAW - 0.3 }], [DRAW + 0.15, 'whoosh', { f0: 600, f1: 2000, dur: 0.25, gain: 0.35 }], [3.05, 'sparkle'], ...b.cues]);
}
{
  const b = beats([0.6, 'n2']), len = b.end + 1.3, sayAt = b.at.n2 + D('n2') * 0.55;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1000, 600, 1.12);
    st.office(ctx, t, { board: 1 });
    bgDevit(ctx, t, { wave: 1 });
    pp(ctx, 'nimith', t, { ...NIM, facing: -0.55, pose: 'hold', hold: [null, 'marker'], expr: lt > sayAt ? 'grin' : 'smile', look: [-1, 0] });
    bubble(ctx, 640, 360, 'បងនិមិត្ត!', seg(lt, sayAt - 0.2, len), { tail: -1 });
    ctx.restore();
    warmLight(ctx, 0.1);
  }, [[0, 'room_tone', { dur: len }], ...b.cues, [sayAt - 0.15, 'sparkle']]);
}

// ============================================================ SCENE 4 — Meet Bong Smei
const SMEI_IN = 3.8;
{
  take(SMEI_IN, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1000, 600, 1.08);
    st.office(ctx, t, { board: 1, light: 'gold', doorOpen: ease.out(seg(lt, 0, 0.6)) });
    bgDevit(ctx, t, { look: lt > 1.4 ? [1, 0] : [0.5, 0] });
    const wk = seg(lt, 0.5, 3.2), x = lerp(1830, 1520, ease.out(wk));
    const nodD = lt > 2.3 && lt < 2.8 ? Math.sin(seg(lt, 2.3, 2.8) * Math.PI) : 0, nodN = lt > 3.0 && lt < 3.5 ? Math.sin(seg(lt, 3.0, 3.5) * Math.PI) : 0;
    pp(ctx, 'nimith', t, { ...NIM, x: 1240, facing: 0.6, pose: 'hold', hold: [null, 'marker'], expr: 'smile', nod: nodN * 0.6 });
    pp(ctx, 'smei', t, { x, y: 1040, s: 1.3, facing: lt < 2.6 ? -0.5 : -0.2, pose: wk < 1 ? 'walk' : 'stand', ph: lt * 1.5, hold: [null, 'tea'], expr: 'smile', nod: nodD + nodN });
    ctx.restore();
    warmLight(ctx, 0.28);
  }, [[0, 'room_tone', { dur: SMEI_IN }], [0.05, 'creak'], [0.6, 'footsteps', { n: 5, gap: 0.5 }]]);
}
{
  const b = beats([0.6, 's1', 0.35, 's2']), len = b.end + 1.7;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1150, 580, 1.75);
    st.office(ctx, t, { board: 1, light: 'gold' });
    const sip = lt > b.end + 0.3 && lt < b.end + 1.3;
    pp(ctx, 'smei', t, { x: 1150, y: 1060, s: 1.35, facing: 0.15, pose: sip ? 'sip' : 'hold', hold: [null, 'tea'], expr: sip ? 'proud' : 'smile' });
    ctx.restore();
    warmLight(ctx, 0.3);
    // golden light beams
    ctx.save(); ctx.globalAlpha = 0.12; ctx.fillStyle = '#fff1c4'; for (let i = 0; i < 3; i++) { poly(ctx, [[-100 + i * 260, -50], [80 + i * 260, -50], [700 + i * 300, H + 50], [400 + i * 300, H + 50]]); ctx.fill(); } ctx.restore();
  }, [[0, 'room_tone', { dur: len }], ...b.cues, [b.end + 0.45, 'sip']]);
}

// ============================================================ SCENE 5 — The Big Project
const MEET = { smei: { x: 1180, y: 1040, s: 1.2 }, devit: { x: 1470, y: 1120, s: 1.15 }, nimith: { x: 1760, y: 1120, s: 1.12 } };
function meeting(ctx, t, { devit = {}, nimith = {}, smei = {} } = {}) {
  st.meetingRoom(ctx, t);
  pp(ctx, 'smei', t, { ...MEET.smei, facing: -0.35, pose: 'presentL', hold: [null, 'tea'], expr: 'smile', ...smei });
  chairBack(ctx, MEET.devit.x, MEET.devit.y, 1.0, '#ffb38a');
  chairBack(ctx, MEET.nimith.x, MEET.nimith.y, 1.0, '#a8cdee');
  pp(ctx, 'devit', t, { ...MEET.devit, facing: -0.4, pose: 'sitTalk', sit: true, expr: 'grin', ...devit });
  pp(ctx, 'nimith', t, { ...MEET.nimith, facing: -0.45, pose: 'sitTalk', sit: true, expr: 'calm', ...nimith });
  st.meetingTable(ctx, 1500, 960, 760);
}
{
  const b = beats([0.7, 's3', 0.3, 's4']), len = b.end + 0.9;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1080, 600, 1.2);
    meeting(ctx, t, { devit: { look: [-1, 0] }, nimith: { look: [-1, 0] } });
    ctx.restore();
  }, [[0, 'music_end', { id: 'w2', how: 'fade', dur: 0.6 }], [0, 'music', { id: 'w3', style: 'warm', gain: 0.45, melody: false, bpm: 92 }], [0, 'room_tone', { dur: len }], ...b.cues]);
}
{
  const b = beats([0.45, 'd3']), len = b.end + 0.7;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1470, 640, 1.75);
    const wind = seg(lt, 0, 0.22), up = seg(lt, 0.22, 0.5);
    const hop = up > 0 ? ease.out(up) * 150 + Math.sin(lt * 9) * 6 * (up >= 1 ? 1 : 0) : 0;
    meeting(ctx, t, { devit: up > 0 ? { pose: 'jump', sit: false, hop, y: MEET.devit.y - 60, facing: 0.1, expr: 'laugh', sq: up < 1 ? -0.08 : wobble(lt - 0.5, 3, 6) * 0.05 } : { sq: 0.1 * wind }, nimith: { look: [-1, -0.5] } });
    if (up > 0) fx.dust(ctx, 1470, 860, seg(lt, 0.25, 0.9), { n: 5, spread: 120, r: 24, col: '#ffffff', seed: 4 });
    ctx.restore();
  }, [[0, 'room_tone', { dur: len }], [0.22, 'boing', { pitch: 1.2 }], [0.25, 'sting_idea'], ...b.cues]);
}
{
  const b = beats([0.55, 'm3', 0.3, 'm4']), len = b.end + 0.8;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1700, 640, 1.75);
    const raised = lt > 0.2 && lt < b.at.m4 + 0.4;
    meeting(ctx, t, { nimith: { pose: raised ? 'raise' : 'sitTalk', facing: -0.2, expr: lt > b.at.m4 ? 'thinking' : 'calm' }, devit: { look: [1, 0], expr: lt > b.at.m4 + 1.0 ? 'worried' : 'smile' } });
    ctx.restore();
  }, [[0, 'room_tone', { dur: len }], [0.2, 'whoosh', { f0: 800, f1: 2200, dur: 0.2, gain: 0.25 }], ...b.cues]);
}
{
  const b = beats([0.4, 's5']), len = b.end + 1.4;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1400, 600, 1.8);
    const nod = lt > b.end && lt < b.end + 0.6 ? Math.sin(seg(lt, b.end, b.end + 0.6) * Math.PI) : 0;
    meeting(ctx, t, { smei: { pose: 'hold', facing: 0.25, expr: lt > b.end ? 'proud' : 'smile', nod } });
    ctx.restore();
    warmLight(ctx, 0.15);
  }, [[0, 'room_tone', { dur: len }], ...b.cues, [b.end + 0.1, 'sting_tiny']]);
}

// ============================================================ SCENE 6 — Launch Day Crash
{
  const b = beats([0.9, 'n3']), len = b.end + 0.6;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1100, 650, 1.3);
    st.office(ctx, t, { board: 1 });
    st.banner(ctx, 1110, 250, 1000, 'LAUNCH DAY!');
    pp(ctx, 'smei', t, { x: 1480, y: 1050, s: 1.2, facing: -0.3, pose: 'hold', hold: [null, 'tea'], expr: 'proud' });
    pp(ctx, 'devit', t, { x: 740, y: 1080, s: 1.25, facing: 0.3, pose: 'cheer', expr: 'laugh', hop: 0, y: 1080 - Math.abs(Math.sin(lt * 7)) * 20 });
    pp(ctx, 'nimith', t, { x: 1110, y: 1070, s: 1.2, facing: -0.1, pose: 'clap', expr: 'grin' });
    ctx.restore();
    st.confetti(ctx, t, { n: 110, area: [0, -200, W, H + 200] });
  }, [[0, 'music_end', { id: 'w3', how: 'fade', dur: 0.4 }], [0, 'music', { id: 'tr1', style: 'triumph', gain: 0.6 }], [0.15, 'party_pop'], [0.45, 'party_horn'], ...b.cues]);
}
let ERR_AT = 0;
{
  const b = beats([0.3, 'n4']), len = b.end + 0.9, err = b.at.n4 + D('n4') * 0.66;
  const pings = []; for (let tt = 0.15, g = 0.42; tt < err - 0.05; tt += g, g = Math.max(0.07, g * 0.8)) pings.push([tt, 'ping', { n: 1, gain: 0.8 }]);
  take(len, (ctx, lt, t) => {
    const e = seg(lt, err, err + 0.12);
    ctx.fillStyle = e > 0 ? '#3b2a3a' : '#ffe2d4'; ctx.fillRect(0, 0, W, H);
    if (e <= 0) st.confetti(ctx, t, { n: 50 });
    const [sx, sy] = shk(t, e > 0 && lt < err + 0.5 ? 12 : 0);
    const orders = 1 + Math.pow(lt / Math.max(0.1, err), 1.7) * 22;
    st.phoneScreen(ctx, 960 + sx, 560 + sy, 1.08, t, { orders, error: e });
    if (e > 0) st.redWash(ctx, t, 1);
  }, [...pings, ...b.cues, [err, 'music_end', { id: 'tr1', how: 'tapestop', dur: 0.8 }], [err, 'error_buzz'], [err + 0.1, 'alarm_beep', { n: 4 }]]);
}
{
  const len = 1.6;
  take(len, (ctx, lt, t) => {
    const [sx, sy] = shk(t, 6);
    ctx.save(); ctx.translate(sx, sy);
    ctx.fillStyle = '#3b3550'; ctx.fillRect(0, 0, W, H);
    st.serverRack(ctx, 620, 1020, 1.5, t, { smoke: 1, n: 3 });
    fx.sfxText(ctx, 'ERROR 500', 1500, 300, seg(lt, 0.1, 1.6), { size: 110, fill: '#ff6b6b', rot: 0.06, wob: 3 });
    ctx.restore();
    st.redWash(ctx, t, 1);
  }, [[0, 'music', { id: 'tn', style: 'tension', gain: 0.8 }], [0, 'steam_hiss'], [0.2, 'server_hum', { dur: 1.4 }], [0.5, 'alarm_beep', { n: 3 }]]);
}
{
  const b = beats([0.3, 'd4', 0.25, 'd5']), len = b.end + 0.5;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 960, 560, 1.9);
    st.office(ctx, t, { board: 1 });
    pp(ctx, 'devit', t, { x: 960, y: 1080, s: 1.3, facing: 0.05, pose: 'panic', expr: 'panic', sq: Math.sin(t * 30) * 0.008 });
    ctx.restore();
    st.redWash(ctx, t, 1);
  }, [...b.cues, [0.35, 'heartbeat', { n: 2 }]]);
}
{
  const b = beats([0.9, 's6', 0.45, 's7']), len = b.end + 1.0;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1080, 580, 1.45);
    st.office(ctx, t, { board: 1 });
    const DV = { x: 900, y: 1080, s: 1.3 }, SM = { x: 1150, y: 1060, s: 1.3 };
    const reach = ease.inOut(seg(lt, 0.2, 0.8));
    // Devit's right shoulder in world space -> Smei's local space
    const shW = [DV.x + 40 * DV.s, DV.y - 0.74 * CAST.devit.H * DV.s + 14];
    const tgt = [(shW[0] - SM.x) / SM.s, (shW[1] - SM.y) / SM.s];
    const calm = seg(lt, b.at.s6, b.at.s7 + 0.5);
    pp(ctx, 'devit', t, { ...DV, facing: 0.35, pose: calm < 0.6 ? 'panic' : 'stand', expr: calm < 0.4 ? 'panic' : calm < 1 ? 'worried' : 'smile', look: [1, -0.3] });
    pp(ctx, 'smei', t, { ...SM, facing: -0.45, pose: 'reachL', reach: [lerp(-60, tgt[0], reach), lerp(-190, tgt[1], reach)], hold: [null, 'tea'], expr: 'calm' });
    ctx.restore();
    st.redWash(ctx, t, 1 - calm);
    warmLight(ctx, 0.2 * calm);
  }, [...b.cues, [0, 'music_end', { id: 'tn', how: 'fade', dur: 0.1 }], [0.2, 'music', { id: 'tn2', style: 'tension', gain: 0.5 }], [0.9, 'music_end', { id: 'tn2', how: 'fade', dur: 1.2 }], [b.at.s7 + 0.4, 'sting_tiny']]);
}

// ============================================================ SCENE 7 — Teamwork
const plan = ctx => { ctx.save(); ctx.translate(30, -6); st.archDiagram(ctx, 0, 0, 0.22, 1, '#e07a5f'); ctx.restore(); text(ctx, 'Plan B', -30, -26, { size: 16, font: 'Arial Black', fill: '#4f86c6', lw: 0 }); };
{
  const b = beats([0.9, 'm5']), len = b.end + 0.6;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1000, 560, 2.0);
    st.office(ctx, t, { board: 1 });
    const N = { x: 1000, y: 1080, s: 1.3 };
    pp(ctx, 'nimith', t, { ...N, facing: 0.05, pose: 'notebook', expr: 'calm', look: [0, 0.4] });
    notebook(ctx, N.x, N.y + (-0.44 * CAST.nimith.H - 40) * N.s, 2.3, ease.out(seg(lt, 0.25, 0.7)), plan);
    ctx.restore();
    warmLight(ctx, 0.12);
  }, [[0, 'music', { id: 'bd', style: 'build', gain: 0.55 }], [0, 'room_tone', { dur: len }], [0.3, 'page_flip'], ...b.cues]);
}
{
  const b = beats([0.4, 'm6', 0.3, 'd6']), len = b.end + 1.1;
  take(len, (ctx, lt, t) => {
    const LB = b.at.m6 + 0.6;
    // left panel: Nimith scales the system
    ctx.save(); poly(ctx, [[0, 0], [W / 2 + 70, 0], [W / 2 - 70, H], [0, H]]); ctx.clip();
    ctx.fillStyle = '#f8e6d6'; ctx.fillRect(0, 0, W, H);
    st.dashboard(ctx, 70, 120, 860, 620, t, { servers: 1 + 4 * ease.inOut(seg(lt, LB, len - 0.4)), lb: seg(lt, LB - 0.3, LB + 0.2), bars: seg(lt, LB, len) });
    pp(ctx, 'nimith', t, { x: 300, y: 1420, s: 1.55, facing: 0.5, pose: 'reach', reach: [150, -430], expr: 'calm' });
    ctx.restore();
    // right panel: Devit makes the code faster
    ctx.save(); poly(ctx, [[W / 2 + 70, 0], [W, 0], [W, H], [W / 2 - 70, H]]); ctx.clip();
    ctx.fillStyle = '#2c3247'; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate(1060, 90); ctx.scale(2.2, 2.2); st.codeLines(ctx, 0, 0, t * 5, 20); ctx.restore();
    ctx.fillStyle = 'rgba(44,50,71,0.45)'; ctx.fillRect(960, 0, 960, H);
    pp(ctx, 'devit', t, { x: 1480, y: 1330, s: 1.75, facing: 0.15, pose: 'type', sit: true, expr: 'determined' });
    text(ctx, 'speed ++', 1700, 160, { size: 46, font: 'Arial Black', fill: '#8fe3c4', lw: 0 });
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(W / 2 + 70, 0); ctx.lineTo(W / 2 - 70, H); paint(ctx, null, 14, '#fff6ea'); ctx.beginPath(); ctx.moveTo(W / 2 + 70, 0); ctx.lineTo(W / 2 - 70, H); paint(ctx, null, 5);
  }, [[0, 'whoosh', { f0: 400, f1: 2500, dur: 0.3, gain: 0.4 }], [0, 'typing', { dur: len, rate: 18, gain: 0.7, pan: 0.6 }], ...b.cues, [b.at.m6 + 0.6, 'sparkle'], [b.at.m6 + 1.2, 'ping', { n: 3, gap: 0.3, gain: 0.6 }]]);
}
{
  const len = 3.8;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1000, 560, 1.12);
    st.office(ctx, t, { board: 1 });
    st.clockFace(ctx, 820, 300, 64, lt * 9);
    st.dashboard(ctx, 1170, 210, 420, 300, t, { servers: 5, lb: 1, bars: 0.4 + 0.6 * seg(lt, 0, len) });
    const nod = Math.max(0, Math.sin(lt * 4)) * 0.8;
    pp(ctx, 'smei', t, { x: 1000, y: 930, s: 1.0, facing: 0.05, pose: 'hold', hold: [null, 'tea'], expr: 'proud', nod });
    pp(ctx, 'devit', t, { x: 720, y: 1100, s: 1.15, facing: 0.15, pose: 'type', sit: true, expr: 'determined' });
    pp(ctx, 'nimith', t, { x: 1290, y: 1100, s: 1.12, facing: -0.15, pose: 'type', sit: true, expr: 'calm' });
    // shared desk + laptop lids (backs toward us)
    poly(ctx, [[300, 960], [1700, 960], [1760, 1010], [240, 1010]]); paint(ctx, st.S.desk, 5); rrect(ctx, 240, 1010, 1520, 200, 6); paint(ctx, st.S.deskD, 5);
    for (const lx of [720, 1290]) { poly(ctx, [[lx - 110, 965], [lx + 110, 965], [lx + 98, 885], [lx - 98, 885]]); paint(ctx, '#d9dde8', 5); st.nhamLogo(ctx, lx, 925, 0.22); }
    ctx.restore();
    warmLight(ctx, 0.12);
  }, [[0, 'clock_fast', { dur: 3.4 }], [0, 'typing', { dur: 3.4, gain: 0.5 }], [0.6, 'nod'], [1.4, 'nod']]);
}

// ============================================================ SCENE 8 — Success and Lesson
{
  const b = beats([0.7, 'n5']), len = b.end + 0.4;
  take(len, (ctx, lt, t) => {
    ctx.fillStyle = '#f8e6d6'; ctx.fillRect(0, 0, W, H);
    const ok = ease.out(seg(lt, 0.2, 0.6));
    st.dashboard(ctx, 230, 120 + (1 - ok) * 40, 1460, 840, t, { servers: 5, lb: 1, bars: 1, status: ok });
    if (lt > 0.25) st.confetti(ctx, t, { n: 40, seed: 3 });
  }, [[0, 'music_end', { id: 'bd', how: 'cut' }], [0.2, 'chime_success'], [0.25, 'music', { id: 'tr2', style: 'triumph', gain: 0.55 }], ...b.cues]);
}
{
  const n6 = beats([0.2, 'n6']), split = n6.at.n6 + D('n6') * 0.5;
  const len1 = split + 0.1, len2 = n6.end - split + 1.4;
  take(len1, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 960, 560, 1);
    st.sunsetSky(ctx, { horizon: 900, t, sunY: 420 });
    st.shophouses(ctx, t * 260);
    st.rider(ctx, lerp(-200, 1500, lt / len1), 1010, 1.25, t);
    ctx.restore();
  }, [...n6.cues, [0, 'motorbike', { dur: len1, gain: 0.35 }], [0, 'city_amb', { dur: len1 + len2 }]]);
  const cust = { ...CAST.nimith, shirt: '#ffb3c1', shirtD: '#f39aab', collar: '#ffd0da', glasses: false, hairStyle: 'ponytail', tie: '#9fe3c9', H: 360, sw: 38, ww: 32, eyeSize: 1.05 };
  const kid = { ...CAST.devit, shirt: '#9fe3c9', shirtD: '#7fcfb2', collar: '#c4f3e1', headphones: false, H: 250, style: 'shirt' };
  take(len2, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 960, 600, 1.2);
    st.sunsetSky(ctx, { horizon: 900, t, sunY: 420 });
    st.shophouses(ctx, 410);
    st.rider(ctx, 620, 1010, 1.15, 0, {});
    const give = seg(lt, 0.3, 0.9);
    pp(ctx, cust, t, { x: 1120, y: 960, s: 1.0, facing: -0.4, pose: give < 1 ? 'reach' : 'thumbs', reach: [-90, -250], expr: 'grin' });
    pp(ctx, kid, t, { x: 1300, y: 960, s: 1.0, facing: -0.2, pose: 'cheer', expr: 'laugh' });
    // the delivery bag
    const bx = lerp(820, 1040, ease.inOut(give)), by = lerp(800, 760, give);
    rrect(ctx, bx - 40, by - 50, 80, 70, 10); paint(ctx, '#fff6ea', 4); st.nhamLogo(ctx, bx, by - 14, 0.24);
    ctx.restore();
    if (give >= 1) st.confetti(ctx, t, { n: 20, seed: 9, area: [900, -100, 600, 900] });
  }, [[0.85, 'sparkle'], [0.9, 'ping', { n: 2, gap: 0.2, gain: 0.6 }]]);
}
{
  const len = 2.8;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 1000, 600, 1.4);
    st.office(ctx, t, { board: 1 });
    pp(ctx, 'smei', t, { x: 1400, y: 950, s: 0.95, facing: -0.3, pose: 'hold', hold: [null, 'tea'], expr: 'proud' });
    const hf = lt > 0.55;
    pp(ctx, 'devit', t, { x: 860, y: 1090, s: 1.3, facing: 0.7, pose: 'highfive', hold: ['coffee', null], expr: hf ? 'laugh' : 'grin', sq: hf ? wobble(lt - 0.55, 3, 6) * 0.04 : 0 });
    pp(ctx, 'nimith', t, { x: 1123, y: 1080, s: 1.28, facing: 0.7, pose: 'highfive', expr: hf ? 'laugh' : 'grin', mirror: true });
    if (hf) fx.impact(ctx, 995, 575, 80, seg(lt, 0.55, 1.4), { col: '#ffd98a' });
    ctx.restore();
    st.confetti(ctx, t, { n: 50, seed: 5 });
  }, [[0.55, 'highfive'], [0.6, 'sparkle']]);
}
// rooftop at night
const roofBack = (ctx, t, z = 1, cy = 560) => {
  ctx.save(); cam(ctx, 960, cy, z);
  st.nightSky(ctx, t); st.skyline(ctx, t, { night: 1 }); st.rooftop(ctx, t);
  pp(ctx, 'devit', t, { x: 760, y: 960, s: 1.0, back: true, pose: 'sitBack' });
  pp(ctx, 'smei', t, { x: 960, y: 960, s: 1.05, back: true, pose: 'sitBack' });
  pp(ctx, 'nimith', t, { x: 1160, y: 960, s: 1.0, back: true, pose: 'sitBack' });
  ctx.restore();
};
{
  const len = 3.6;
  take(len, (ctx, lt, t) => roofBack(ctx, t, lerp(1.15, 1.0, ease.inOut(lt / len)), 600),
    [[0, 'music_end', { id: 'tr2', how: 'fade', dur: 0.8 }], [0, 'music', { id: 'td', style: 'tender', gain: 0.7 }], [0, 'night_amb', { dur: len }]]);
}
function roofFront(ctx, t, o = {}) {
  st.nightSky(ctx, t, { horizon: 900 });
  ctx.save(); ctx.translate(960, 900); ctx.scale(0.62, 0.62); ctx.translate(-1100, -880); ctx.globalAlpha = 0.9; st.skyline(ctx, t, { night: 1 }); ctx.restore();
  rrect(ctx, -400, 880, 2800, 400, 4); paint(ctx, '#7c7398', 0);
  pp(ctx, 'devit', t, { x: 620, y: 1150, s: 1.15, sit: true, pose: 'sitTalk', hold: ['coffee', null], facing: 0.5, expr: 'smile', ...o.devit });
  pp(ctx, 'smei', t, { x: 960, y: 1150, s: 1.2, sit: true, pose: 'sitTalk', hold: [null, 'tea'], facing: 0, expr: 'calm', ...o.smei });
  pp(ctx, 'nimith', t, { x: 1300, y: 1150, s: 1.12, sit: true, pose: 'sitTalk', facing: -0.5, expr: 'smile', ...o.nimith });
  rrect(ctx, -400, 960, 2800, 300, 6); paint(ctx, '#968cb2', 5);
  for (let x = -400; x < 2400; x += 120) { ctx.beginPath(); ctx.moveTo(x, 960); ctx.lineTo(x, 1260); paint(ctx, null, 3, '#857ba3'); }
}
{
  const b = beats([0.6, 'd7', 0.3, 'd8', 0.5, 'm7']), len = b.end + 0.9;
  take(len, (ctx, lt, t) => {
    const onN = lt > b.at.m7 - 0.2;
    ctx.save(); cam(ctx, onN ? 1080 : 840, 720, 1.7);
    roofFront(ctx, t, { devit: { facing: 0.7, look: [1, 0], expr: lt > b.at.d8 + D('d8') ? 'grin' : 'smile' }, nimith: { look: [-1, 0], expr: onN ? 'smile' : 'calm' }, smei: { look: [onN ? 1 : -1, 0], expr: 'smile' } });
    ctx.restore();
  }, [...b.cues, [0, 'night_amb', { dur: len }]]);
}
{
  const b = beats([0.5, 's8', 0.35, 's9', 0.3, 's10']), len = b.end + 0.4;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 960, 690, 2.1);
    roofFront(ctx, t, { devit: { look: [1, -0.2] }, nimith: { look: [-1, -0.2] } });
    ctx.restore();
  }, [...b.cues, [0, 'night_amb', { dur: len }]]);
}
{
  const b = beats([0.3, 's11']), len = b.end + 2.0;
  take(len, (ctx, lt, t) => {
    ctx.save(); cam(ctx, 960, 740, lerp(1.45, 1.25, ease.inOut(lt / len)));
    roofFront(ctx, t, { devit: { expr: lt > b.end ? 'laugh' : 'smile', look: [1, 0] }, nimith: { expr: lt > b.end ? 'laugh' : 'smile', look: [-1, 0] }, smei: { expr: lt > b.end ? 'proud' : 'calm' } });
    ctx.restore();
  }, [...b.cues, [b.end + 0.2, 'sting_tiny'], [0, 'night_amb', { dur: len }]]);
}
{
  const len = 6.0;
  take(len, (ctx, lt, t) => {
    const k = ease.inOut(seg(lt, 0, 4.5));
    roofBack(ctx, t, lerp(1.0, 0.55, k), lerp(600, -500, k));
    titleKh(ctx, lt, 2.6, 5.4, 'ចប់', 'The End  •  Bong Smei, Bong Nimith & Devit', 420);
    fx.wash(ctx, '#1b1a33', seg(lt, len - 0.6, len));
  }, [[0.3, 'whoosh', { f0: 200, f1: 900, dur: 3, gain: 0.25 }], [2.6, 'chime_success'], [len - 0.1, 'music_end', { id: 'td', how: 'fade', dur: 2.4 }], [0, 'night_amb', { dur: len }]]);
}

export { drawFrame, allCues } from './kit.mjs';
export const DURATION = duration();
