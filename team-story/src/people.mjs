// The cast: Bong Smei (mentor), Bong Nimith (software engineer), Devit (junior developer): three men.
// One person rig, natural cartoon proportions, soft pastel palette, clean line art.
// Origin = feet centre. facing: 1 = 3/4 turned to screen-right, 0 = front, -1 = 3/4 left. back: true = seen from behind.
import { INK, LW, TAU, paint, circle, oval, rrect, poly, smooth, hose, cel, clamp, lerp, ik, hash } from './core.mjs';

const LWP = LW, HEAD = 1.32; // head scale: big heads read better and look friendlier
// two-segment limb with a real elbow/knee (rounded joins)
function limb(ctx, pts, w, col) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const path = () => { ctx.beginPath(); ctx.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) ctx.lineTo(...pts[i]); };
  path(); ctx.strokeStyle = INK; ctx.lineWidth = w + LWP * 2; ctx.stroke();
  path(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke();
}
export const P = {
  skin: '#e2ad85', skinD: '#c98f68', blush: 'rgba(232,80,80,0.32)', white: '#fffdf8', eye: '#3a2a22', mouth: '#7a3640', tongue: '#e0767a',
  tea: '#f7f2ea', teaIn: '#b5793c', coffee: '#7b4a2c', ice: '#e9f6f7', cupLid: '#ffffff', marker: '#4f86c6', notebook: '#fff6dc',
};
export const CAST = {
  smei: {
    H: 420, sw: 50, ww: 44, skin: '#c98b5e', skinD: '#a86e46', hair: '#2a2426', gray: '#b9b4b4', beard: true,
    shirt: '#2e8a57', shirtD: '#1f6b42', collar: '#45a56f', pants: '#c9a46a', pantsD: '#a8834d', shoe: '#5a3a28', style: 'polo', hairStyle: 'short', eyeSize: 0.9,
  },
  nimith: {
    H: 410, sw: 46, ww: 40, skin: '#e0a378', skinD: '#c4865c', hair: '#1f1a22', glasses: true,
    shirt: '#5aa8ec', shirtD: '#3f8bd0', collar: '#8cc6f7', pants: '#2d3a6b', pantsD: '#1e2750', shoe: '#2a2633', style: 'shirt', hairStyle: 'neat', eyeSize: 0.95,
  },
  devit: {
    H: 402, sw: 44, ww: 40, skin: '#d4955f', skinD: '#b5773f', hair: '#1f1c22', headphones: true,
    shirt: '#f2823a', shirtD: '#d0632a', collar: '#ffb070', pants: '#3f6fbf', pantsD: '#2f569a', shoe: '#ffffff', style: 'hoodie', hairStyle: 'messy', eyeSize: 1.15,
  },
};

// ---------------------------------------------------------------- props
export function teaCup(ctx, x, y, s = 1, t = 0, steam = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (steam) { ctx.strokeStyle = 'rgba(255,255,255,0.75)'; ctx.lineWidth = 4; ctx.lineCap = 'round'; for (let k = 0; k < 2; k++) { ctx.beginPath(); const o = Math.sin(t * 3 + k) * 4; ctx.moveTo(-6 + k * 12, -30); ctx.bezierCurveTo(-12 + k * 12 + o, -42, 0 + k * 12 - o, -50, -6 + k * 12, -62); ctx.stroke(); } }
  ctx.beginPath(); ctx.moveTo(-16, -26); ctx.lineTo(16, -26); ctx.lineTo(12, 2); ctx.quadraticCurveTo(0, 8, -12, 2); ctx.closePath(); paint(ctx, P.tea, LWP * 0.8);
  ctx.beginPath(); ctx.ellipse(0, -26, 16, 4, 0, 0, TAU); paint(ctx, P.teaIn, 3);
  ctx.beginPath(); ctx.arc(18, -14, 7, -1.2, 1.2); paint(ctx, null, 4);
  ctx.restore();
}
export function icedCoffee(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(4, -44); ctx.lineTo(12, -66); paint(ctx, null, 5, '#3fa76b');
  ctx.beginPath(); ctx.moveTo(-15, -40); ctx.lineTo(15, -40); ctx.lineTo(11, 4); ctx.lineTo(-11, 4); ctx.closePath(); paint(ctx, 'rgba(235,248,250,0.9)', LWP * 0.8);
  ctx.save(); ctx.beginPath(); ctx.moveTo(-15, -40); ctx.lineTo(15, -40); ctx.lineTo(11, 4); ctx.lineTo(-11, 4); ctx.closePath(); ctx.clip();
  ctx.fillStyle = P.coffee; ctx.fillRect(-20, -26, 40, 34); ctx.fillStyle = '#f2e6d6'; ctx.fillRect(-20, -30, 40, 6);
  ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(-9, -22, 8, 8); ctx.fillRect(3, -16, 7, 7); ctx.restore();
  rrect(ctx, -17, -46, 34, 7, 3); paint(ctx, P.cupLid, 3.5);
  ctx.restore();
}
export function marker(ctx, x, y, s = 1, rot = -0.6) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); rrect(ctx, -5, -30, 10, 34, 3); paint(ctx, '#fdfdfd', 3.5); rrect(ctx, -5, -32, 10, 10, 3); paint(ctx, P.marker, 3); ctx.restore(); }
export function notebook(ctx, x, y, s = 1, open = 1, drawFn = null) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const w = 60 * open;
  rrect(ctx, -w - 4, -44, w * 2 + 8, 70, 6); paint(ctx, '#e07a5f', 4);
  rrect(ctx, -w, -40, w, 62, 3); paint(ctx, P.notebook, 3); rrect(ctx, 0, -40, w, 62, 3); paint(ctx, P.notebook, 3);
  if (drawFn && open > 0.9) drawFn(ctx);
  ctx.restore();
}
export function phone(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rrect(ctx, -14, -26, 28, 52, 6); paint(ctx, '#2c2a33', 3.5); rrect(ctx, -11, -22, 22, 42, 3); paint(ctx, '#9fd6e8', 0); ctx.restore(); }

// ---------------------------------------------------------------- hands
function handShape(ctx, x, y, side, kind = 'open', rot = 0, skin = P.skin) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(side, 1);
  if (kind === 'thumb') {
    rrect(ctx, -11, -8, 22, 20, 7); paint(ctx, skin, LWP * 0.8);
    rrect(ctx, -6, -26, 9, 22, 4.5); paint(ctx, skin, LWP * 0.8);
  } else if (kind === 'fist') { circle(ctx, 0, 0, 11); paint(ctx, skin, LWP * 0.8); }
  else {
    oval(ctx, 0, 0, 11, 12); paint(ctx, skin, LWP * 0.8);
    ctx.beginPath(); ctx.ellipse(-9, -2, 4, 7, -0.6, 0, TAU); paint(ctx, skin, LWP * 0.7);
  }
  ctx.restore();
}

// ---------------------------------------------------------------- pose rig
// returns skeleton targets in local space (y up = negative)
function rig(c, o) {
  const H = c.H, f = o.facing ?? 0.4, ph = (o.ph || 0) * TAU;
  const R = { hipY: -0.44 * H, shY: -0.74 * H, lean: 0, bodyY: 0, sit: false }; R.headY = R.shY - 58;
  const sh = [[-c.sw, R.shY + 6], [c.sw, R.shY + 6]];
  let hands = [[-c.sw - 6, R.hipY + 4], [c.sw + 6, R.hipY + 4]], feet = [[-18, 0], [18, 0]], handKind = ['open', 'open'], handRot = [0, 0];
  const p = o.pose || 'stand';
  const arm = (side, x, y) => { hands[side] = [x, y]; };
  if (p === 'walk') {
    feet = [[-14 + Math.cos(ph) * 26, -Math.max(0, Math.sin(ph)) * 16], [14 - Math.cos(ph) * 26, -Math.max(0, -Math.sin(ph)) * 16]];
    hands = [[-c.sw - 4 - Math.cos(ph) * 14, R.hipY + 8], [c.sw + 4 + Math.cos(ph) * 14, R.hipY + 8]];
    R.bodyY = -Math.abs(Math.sin(ph)) * 5;
  }
  if (o.sit || p === 'type' || p === 'sitBack' || p === 'sitTalk') {
    R.sit = true; R.bodyY = 0.2 * H;
    feet = [[-20 + f * 18, 0], [20 + f * 18, 0]];
  }
  if (p === 'type') { const b = Math.sin((o.t || 0) * 30); arm(0, -26 + f * 40, R.hipY + 18 - Math.max(0, b) * 8); arm(1, 26 + f * 40, R.hipY + 18 - Math.max(0, -b) * 8); handKind = ['fist', 'fist']; }
  if (p === 'thumbs') { arm(1, c.sw + 24, R.shY - 20); handKind[1] = 'thumb'; }
  if (p === 'wave') { arm(1, c.sw + 34, R.shY - 70); handRot[1] = Math.sin((o.t || 0) * 12) * 0.35; }
  if (p === 'draw') { arm(1, c.sw + 70 + (o.drawX || 0), R.shY - 40 + (o.drawY || 0)); handKind[1] = 'fist'; }
  if (p === 'glasses') { arm(1, 46 + f * 16, R.headY - 10); handKind[1] = 'fist'; }
  if (p === 'present') { arm(1, c.sw + 90, R.shY + 24); handRot[1] = -0.3; }
  if (p === 'presentL') { arm(0, -c.sw - 90, R.shY + 24); handRot[0] = 0.3; }
  if (p === 'sip') { arm(1, 22 + f * 20, R.headY + 52); }
  if (p === 'clap') { const k = Math.abs(Math.sin((o.t || 0) * 9)); arm(0, -10 - k * 22, R.shY + 40); arm(1, 10 + k * 22, R.shY + 40); }
  if (p === 'hold') { arm(1, c.sw - 6, R.shY + 70); }
  if (p === 'jump') { arm(0, -c.sw - 40, R.shY - 90); arm(1, c.sw + 40, R.shY - 90); feet = [[-26, -10], [26, -14]]; R.bodyY = -(o.hop || 0); }
  if (p === 'raise') { arm(1, c.sw + 6, R.shY - 110); }
  if (p === 'panic') { arm(0, -66, R.headY - 20); arm(1, 66, R.headY - 20); handKind = ['open', 'open']; }
  if (p === 'reach') { arm(1, o.reach[0], o.reach[1]); }
  if (p === 'reachL') { arm(0, o.reach[0], o.reach[1]); }
  if (p === 'notebook') { arm(0, -40, R.hipY - 30); arm(1, 40, R.hipY - 30); }
  if (p === 'highfive') { arm(1, c.sw + 60, R.shY - 90); }
  if (p === 'sitBack') { arm(0, -c.sw - 10, R.hipY + 10); arm(1, c.sw + 10, R.hipY + 10); }
  if (p === 'cheer') { arm(0, -c.sw - 30, R.shY - 100); arm(1, c.sw + 30, R.shY - 100); }
  // props in a hand keep the arm bent at the chest unless a pose says otherwise
  for (const side of [0, 1]) {
    const prop = o.hold?.[side];
    if (prop && ['stand', 'walk', 'sitTalk'].includes(p)) arm(side, (side ? 1 : -1) * (c.sw - 4), R.shY + 70);
  }
  return { ...R, sh, hands, feet, handKind, handRot, f };
}

// ---------------------------------------------------------------- the person
// o: { x, y, s, facing, back, pose, ph, t, expr, mouth (0..1 lip-sync), look:[x,y], hold:[leftProp, rightProp], tilt, nod, hop, sq, alpha }
export function person(ctx, who, o = {}) {
  const c = typeof who === 'string' ? CAST[who] : who, s = o.s ?? 1, t = o.t || 0; // a CAST key or a one-off look (extras)
  const R = rig(c, o);
  ctx.save(); ctx.translate(o.x || 0, o.y || 0); ctx.scale(s * (1 + (o.sq || 0)) * (o.mirror ? -1 : 1), s / (1 + (o.sq || 0))); // mirror: flip the whole figure (use the opposite hand)
  if (o.rot) ctx.rotate(o.rot);
  const by = R.bodyY;
  // legs
  const hips = [[-c.ww * 0.45, R.hipY + by + 8], [c.ww * 0.45, R.hipY + by + 8]];
  for (let i = 0; i < 2; i++) {
    const hp = hips[i], ft = R.feet[i];
    if (R.sit && !o.back) { const kn = [hp[0] * 1.2 + R.f * 26, hp[1] + 34]; hose(ctx, [hp, kn], 26, c.pants, LWP); hose(ctx, [kn, [ft[0], ft[1] - 10]], 24, c.pantsD, LWP); }
    else if (R.sit && o.back) { hose(ctx, [hp, [hp[0] * 1.4, hp[1] + 30]], 26, c.pants, LWP); }
    else { const L = (-R.hipY - 8 - 8) / 2 * 1.015, kn = ik(hp[0], hp[1], ft[0], ft[1] - 8, L, L, i ? 1 : -1); limb(ctx, [hp, kn, [ft[0], ft[1] - 8]], 26, i ? c.pants : c.pantsD); }
    if (!(R.sit && o.back)) { ctx.beginPath(); ctx.ellipse(ft[0] + R.f * 6, ft[1] - 6, 17, 9, 0, 0, TAU); paint(ctx, c.shoe, LWP * 0.8); }
  }
  ctx.translate(0, by);
  // arms behind the body (back view)
  if (o.back) for (let i = 0; i < 2; i++) drawArm(ctx, c, R, i, o, t);
  // torso
  const torso = () => smooth(ctx, [[-c.sw, R.shY + 4], [-c.sw * 0.55, R.shY - 6], [c.sw * 0.55, R.shY - 6], [c.sw, R.shY + 4], [c.ww + 4, R.hipY - 20], [c.ww, R.hipY + 14], [-c.ww, R.hipY + 14], [-c.ww - 4, R.hipY - 20]]);
  cel(ctx, torso, c.shirt, c.shirtD, -R.f * 8 - 4, -4, LWP);
  if (!o.back) shirtDetails(ctx, c, R);
  else if (c.style === 'hoodie') { smooth(ctx, [[-30, R.shY - 4], [0, R.shY - 18], [30, R.shY - 4], [24, R.shY + 30], [0, R.shY + 40], [-24, R.shY + 30]]); paint(ctx, c.shirtD, LWP * 0.8); }
  // neck + head
  const nod = o.nod || 0, talkBob = (o.mouth || 0) * 2.5;
  rrect(ctx, -11, R.shY - 26, 22, 30, 8); paint(ctx, c.skinD, 0);
  ctx.save(); ctx.translate(0, R.headY + nod * 6 - talkBob * 0.5); ctx.rotate((o.tilt || 0) + nod * 0.05); ctx.scale(HEAD, HEAD);
  if (o.back) headBack(ctx, c, R); else head(ctx, c, R, o, t);
  ctx.restore();
  if (c.headphones && !o.back) headphones(ctx, R);
  if (!o.back) for (let i = 0; i < 2; i++) drawArm(ctx, c, R, i, o, t);
  ctx.restore();
}
function drawArm(ctx, c, R, i, o, t) {
  const shp = R.sh[i], hd = R.hands[i], side = i ? 1 : -1;
  // elbow: of the two IK solutions take the one that points outward and down (never across the face)
  const e1 = ik(shp[0], shp[1], hd[0], hd[1], 70, 68, 1), e2 = ik(shp[0], shp[1], hd[0], hd[1], 70, 68, -1);
  const score = e => e[0] * side + e[1] * 0.35, el = score(e1) >= score(e2) ? e1 : e2;
  limb(ctx, [shp, el, hd], 20, i ? c.shirt : c.shirtD);
  if (c.style === 'hoodie') { const a = Math.atan2(hd[1] - el[1], hd[0] - el[0]); circle(ctx, hd[0] - Math.cos(a) * 13, hd[1] - Math.sin(a) * 13, 10); paint(ctx, c.collar, LWP * 0.8); }
  const prop = o.hold?.[i];
  if (prop === 'tea') teaCup(ctx, hd[0] + side * 4, hd[1] + 6, 1, t, o.steam !== false);
  if (prop === 'coffee') icedCoffee(ctx, hd[0], hd[1] + 18, 1);
  if (prop === 'notebook') {}
  handShape(ctx, hd[0], hd[1], side, R.handKind[i], R.handRot[i], c.skin);
  if (prop === 'marker') marker(ctx, hd[0] + side * 6, hd[1] - 4, 1, side * -0.5);
  if (prop === 'phone') phone(ctx, hd[0] + side * 4, hd[1] - 14, 1);
}
function shirtDetails(ctx, c, R) {
  const y = R.shY;
  if (c.style === 'polo') {
    poly(ctx, [[-22, y - 6], [0, y + 18], [-6, y + 26], [-28, y + 6]]); paint(ctx, c.collar, LWP * 0.8);
    poly(ctx, [[22, y - 6], [0, y + 18], [6, y + 26], [28, y + 6]]); paint(ctx, c.collar, LWP * 0.8);
    ctx.beginPath(); ctx.moveTo(0, y + 18); ctx.lineTo(0, y + 54); paint(ctx, null, 3.5);
    for (const yy of [y + 30, y + 44]) { circle(ctx, 3, yy, 2.6); paint(ctx, '#e8e4da', 0); }
  } else if (c.style === 'shirt') {
    poly(ctx, [[-20, y - 6], [-2, y + 16], [-10, y + 24], [-26, y + 4]]); paint(ctx, c.collar, LWP * 0.8);
    poly(ctx, [[20, y - 6], [2, y + 16], [10, y + 24], [26, y + 4]]); paint(ctx, c.collar, LWP * 0.8);
    ctx.beginPath(); ctx.moveTo(0, y + 16); ctx.lineTo(0, R.hipY + 10); paint(ctx, null, 3);
    for (let yy = y + 32; yy < R.hipY; yy += 24) { circle(ctx, 4, yy, 2.4); paint(ctx, '#ffffff', 0); }
  } else if (c.style === 'hoodie') {
    smooth(ctx, [[-30, y - 2], [0, y + 14], [30, y - 2], [22, y - 14], [0, y - 4], [-22, y - 14]]); paint(ctx, c.shirtD, LWP * 0.8);
    for (const k of [-1, 1]) { ctx.beginPath(); ctx.moveTo(k * 8, y + 10); ctx.lineTo(k * 10, y + 46); paint(ctx, null, 3, '#fff3e6'); circle(ctx, k * 10, y + 48, 3); paint(ctx, '#fff3e6', 2); }
    rrect(ctx, -28, R.hipY - 36, 56, 30, 10); paint(ctx, c.shirtD, LWP * 0.8);
  }
}
function headphones(ctx, R) {
  const y = R.shY - 4;
  ctx.beginPath(); ctx.arc(0, y - 6, 34, 0.15 * Math.PI, 0.85 * Math.PI); paint(ctx, null, 7, '#5b6b7a');
  for (const k of [-1, 1]) { rrect(ctx, k * 34 - 11, y - 6, 22, 26, 8); paint(ctx, '#6fc3b8', LWP * 0.8); }
}
function headBack(ctx, c) {
  oval(ctx, 0, 0, 39, 46); paint(ctx, c.hair, LWP);
  if (c.hairStyle === 'short') { for (const k of [-1, 1]) { oval(ctx, k * 30, 8, 9, 18); paint(ctx, c.gray, 0); } }
  if (c.hairStyle === 'ponytail') { smooth(ctx, [[-10, -10], [10, -10], [14, 40], [6, 76], [-6, 76], [-14, 40]]); paint(ctx, c.hair, LWP); rrect(ctx, -10, -14, 20, 10, 4); paint(ctx, c.tie, 3); }
  if (c.hairStyle === 'neat') { ctx.beginPath(); ctx.moveTo(-30, 30); ctx.quadraticCurveTo(0, 40, 30, 30); paint(ctx, null, 3, '#3a3340'); }
  if (c.hairStyle === 'messy') { for (let k = -2; k <= 2; k++) { poly(ctx, [[k * 14 - 9, -36], [k * 14 + 4, -60 + Math.abs(k) * 6], [k * 14 + 10, -34]]); paint(ctx, c.hair, LWP * 0.7); } }
  for (const k of [-1, 1]) { oval(ctx, k * 40, 6, 7, 12); paint(ctx, c.skin, LWP * 0.8); }
}
function head(ctx, c, R, o, t) {
  const f = R.f, fx = f * 10, E = c.eyeSize || 1, expr = o.expr || 'smile';
  // ponytail behind
  if (c.hairStyle === 'ponytail') { const sw = Math.sin(t * 2.2) * 0.1; ctx.save(); ctx.translate(-f * 40 - (f >= 0 ? 6 : -6), -30); ctx.rotate(sw + (f >= 0 ? 0.55 : -0.55) * Math.min(1, Math.abs(f) * 2 + 0.3)); smooth(ctx, [[-11, -4], [11, -4], [17, 34], [9, 70], [-3, 76], [-15, 36]]); paint(ctx, c.hair, LWP); rrect(ctx, -11, -6, 22, 10, 4); paint(ctx, c.tie, 3); ctx.restore(); }
  // ears
  for (const k of [-1, 1]) { if (k * f < -0.5) continue; oval(ctx, k * 38 - f * 8, 6, 8, 12); paint(ctx, c.skin, LWP * 0.8); }
  // face
  const face = () => smooth(ctx, [[-36, -18], [-30, -40], [0, -48], [30, -40], [36, -18], [34, 14], [20, 38], [0, 46], [-20, 38], [-34, 14]]);
  cel(ctx, face, c.skin, c.skinD, -f * 6 - 3, -2, LWP);
  // hair (front)
  if (c.hairStyle === 'short') {
    smooth(ctx, [[-38, 2], [-38, -30], [-20, -50], [10, -54], [34, -42], [40, -12], [32, -24], [10, -34], [-14, -32], [-30, -16]]); paint(ctx, c.hair, LWP);
    for (const k of [-1, 1]) { oval(ctx, k * 35, -6, 5, 12); paint(ctx, c.gray, 0); }
  } else if (c.hairStyle === 'ponytail') {
    smooth(ctx, [[-38, 4], [-36, -30], [-12, -52], [18, -52], [38, -32], [38, 0], [30, -26], [8, -38], [-4, -30], [-26, -26]]); paint(ctx, c.hair, LWP);
  } else if (c.hairStyle === 'neat') { // short, side-parted
    smooth(ctx, [[-38, 4], [-39, -26], [-26, -48], [0, -55], [26, -50], [40, -30], [40, -2], [34, -22], [22, -34], [4, -40], [-12, -38], [-26, -26], [-32, -10]]); paint(ctx, c.hair, LWP);
    ctx.beginPath(); ctx.moveTo(-16, -52); ctx.quadraticCurveTo(-12, -44, -8, -36); paint(ctx, null, 3, '#3a3340');
    ctx.beginPath(); ctx.moveTo(-6, -40); ctx.quadraticCurveTo(14, -46, 32, -30); paint(ctx, null, 3, '#3a3340');
  } else if (c.hairStyle === 'messy') {
    for (let k = -3; k <= 3; k++) { const a = k * 0.42, r0 = 40; poly(ctx, [[Math.sin(a - 0.25) * r0, -Math.cos(a - 0.25) * r0 - 4], [Math.sin(a) * (r0 + 22 + (k % 2) * 8), -Math.cos(a) * (r0 + 18 + (k % 2) * 8)], [Math.sin(a + 0.25) * r0, -Math.cos(a + 0.25) * r0 - 4]]); paint(ctx, c.hair, LWP * 0.8); }
    smooth(ctx, [[-38, 0], [-36, -32], [-10, -50], [20, -50], [38, -30], [38, 0], [26, -20], [14, -28], [2, -18], [-12, -28], [-26, -18]]); paint(ctx, c.hair, LWP);
  }
  // blink (auto) + eyes
  const seed = c.H * 0.37, cyc = (t + hash(seed) * 3) % 3.6;
  const closed = expr === 'proud' || expr === 'laugh' || (cyc > 3.45 && expr !== 'panic' && expr !== 'surprised');
  const lx = (o.look?.[0] ?? f * 0.6) * 4, ly = (o.look?.[1] ?? 0) * 3;
  const ey = -6, eyes = [-15 + fx, 15 + fx];
  for (const [i, ex] of eyes.entries()) {
    const shrink = (i === 0 && f > 0.4) || (i === 1 && f < -0.4) ? 0.85 : 1;
    if (closed) { ctx.beginPath(); ctx.arc(ex, ey + 2, 8 * E, Math.PI * 1.1, Math.PI * 1.9); paint(ctx, null, 4); continue; }
    const big = expr === 'surprised' || expr === 'panic' ? 1.2 : 1;
    oval(ctx, ex, ey, 7.5 * E * shrink * big, 9 * E * big); paint(ctx, P.white, 3.5);
    circle(ctx, ex + lx, ey + 1 + ly, 5 * E * shrink); paint(ctx, P.eye, 0);
    circle(ctx, ex + lx - 1.8, ey - 1.5 + ly, 1.8); paint(ctx, '#ffffff', 0);
  }
  // brows
  const bA = { worried: 0.3, panic: 0.45, surprised: -0.1, thinking: 0, determined: -0.25, proud: -0.05 }[expr] ?? -0.08;
  for (const [i, ex] of eyes.entries()) { const k = i ? 1 : -1; ctx.save(); ctx.translate(ex, ey - 15 - (expr === 'surprised' ? 4 : 0) - (expr === 'thinking' && i ? 5 : 0)); ctx.rotate(-k * bA); ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(8, 0); paint(ctx, null, 5, c.hair === '#2f2a2b' ? '#3a3333' : c.hair); ctx.restore(); }
  // glasses
  if (c.glasses) { for (const ex of eyes) { circle(ctx, ex, ey, 12); paint(ctx, 'rgba(255,255,255,0.18)', 3); } ctx.beginPath(); ctx.moveTo(eyes[0] + 12, ey); ctx.lineTo(eyes[1] - 12, ey); paint(ctx, null, 3); }
  // nose + blush
  ctx.beginPath(); ctx.moveTo(fx + f * 6 + 2, 2); ctx.quadraticCurveTo(fx + f * 10 + 6, 12, fx + f * 4, 14); paint(ctx, null, 3.5, c.skinD);
  for (const ex of eyes) { oval(ctx, ex + (ex < fx ? -4 : 4), 12, 8, 4.5); ctx.fillStyle = P.blush; ctx.fill(); }
  // beard (Smei)
  if (c.beard) {
    smooth(ctx, [[-34, 8], [-30, 30], [-14, 46], [0, 52], [14, 46], [30, 30], [34, 8], [24, 22], [10, 30], [0, 32], [-10, 30], [-24, 22]]); paint(ctx, '#4b4545', LWP * 0.8);
    for (const [px, py] of [[-20, 30], [16, 34], [0, 44], [-8, 38], [24, 22]]) { circle(ctx, px, py, 1.6); paint(ctx, c.gray, 0); }
    smooth(ctx, [[fx - 15, 20], [fx - 7, 15], [fx, 17], [fx + 7, 15], [fx + 15, 20], [fx + 8, 22], [fx, 20], [fx - 8, 22]]); paint(ctx, '#3e3838', 3); // neat mustache (filled, not an arch: an arch reads as a frown)
  }
  // mouth: lip-sync overrides the resting shape
  const m = o.mouth || 0, mx = fx + f * 3, my = c.beard ? 30 : 27;
  if (m > 0.06) {
    const h = 4 + 14 * m, w = 11 + 4 * m;
    oval(ctx, mx, my + h * 0.3, w, h * 0.6 + 2); paint(ctx, P.mouth, 3.5);
    ctx.save(); oval(ctx, mx, my + h * 0.3, w, h * 0.6 + 2); ctx.clip(); oval(ctx, mx, my + h * 0.9, w * 0.7, h * 0.35); paint(ctx, P.tongue, 0); ctx.fillStyle = '#fff'; ctx.fillRect(mx - w, my + h * 0.3 - h * 0.6 - 2, w * 2, 4); ctx.restore();
  } else if (expr === 'grin' || expr === 'laugh') {
    ctx.beginPath(); ctx.moveTo(mx - 14, my - 2); ctx.quadraticCurveTo(mx, my + 20, mx + 14, my - 2); ctx.closePath(); paint(ctx, P.mouth, 3.5);
    ctx.save(); ctx.beginPath(); ctx.moveTo(mx - 14, my - 2); ctx.quadraticCurveTo(mx, my + 20, mx + 14, my - 2); ctx.closePath(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(mx - 15, my - 4, 30, 6); ctx.restore();
  } else if (expr === 'surprised' || expr === 'panic') { oval(ctx, mx, my + 4, 7, 9); paint(ctx, P.mouth, 3.5); }
  else if (expr === 'worried') { ctx.beginPath(); ctx.moveTo(mx - 9, my + 4); ctx.quadraticCurveTo(mx, my - 2, mx + 9, my + 4); paint(ctx, null, 3.5); }
  else if (expr === 'thinking') { ctx.beginPath(); ctx.moveTo(mx - 7, my + 2); ctx.lineTo(mx + 7, my - 1); paint(ctx, null, 3.5); }
  else { ctx.beginPath(); ctx.moveTo(mx - 10, my); ctx.quadraticCurveTo(mx, my + (expr === 'calm' ? 6 : 9), mx + 10, my); paint(ctx, null, 3.5); }
}

// ---------------------------------------------------------------- office chair (3/4 view)
export function chair(ctx, x, y, s = 1, rot = 0, col = '#6c7a96') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const a of [-1, -0.35, 0.35, 1]) { ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(a * 52, -4); paint(ctx, null, 6); circle(ctx, a * 52, -4, 6); paint(ctx, '#3b3b44', 3); }
  rrect(ctx, -5, -110, 10, 92, 4); paint(ctx, '#9aa3b5', 4);
  ctx.save(); ctx.rotate(rot * 0.15);
  rrect(ctx, -60, -128, 120, 26, 12); paint(ctx, col, LWP);
  ctx.restore();
  ctx.restore();
}
export function chairBack(ctx, x, y, s = 1, col = '#6c7a96') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rrect(ctx, -54, -290, 108, 170, 26); paint(ctx, col, LWP); rrect(ctx, -6, -122, 12, 20, 4); paint(ctx, '#9aa3b5', 4); ctx.restore(); }
