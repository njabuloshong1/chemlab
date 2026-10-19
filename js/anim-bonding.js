'use strict';
// Topic 2.4–2.7: ionic, covalent, giant covalent and metallic bonding.

const DEG = Math.PI / 180;
const shellR = (i) => 26 + 19 * i;

// 8 slot angles in 4 pairs (top/right/bottom/left), or 2 for the first shell.
function slotAngles(cap) {
  if (cap === 2) return [-90 * DEG, 90 * DEG];
  const out = [];
  for (const base of [0, 90, 180, 270]) out.push((base - 13) * DEG, (base + 13) * DEG);
  return out;
}

const angDist = (a, b) => { let d = Math.abs(a - b) % (2 * Math.PI); return d > Math.PI ? 2 * Math.PI - d : d; };

function chargeLabel(q) {
  if (q === 0) return '';
  const n = Math.abs(q) > 1 ? Math.abs(q) : '';
  return n + (q > 0 ? '+' : '−');
}

// Charge as Unicode superscript, e.g. 2+ → ²⁺ (for canvas text).
const supCharge = (q) => chargeLabel(q).replace(/[0-9+−]/g, (c) => ({ '+': '⁺', '−': '⁻' }[c] || '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]));

const IONIC = {
  NaCl: { name: 'Sodium chloride', layout: [['Na', [2, 8, 1], 'm'], ['Cl', [2, 8, 7], 'n']] },
  LiF: { name: 'Lithium fluoride', layout: [['Li', [2, 1], 'm'], ['F', [2, 7], 'n']] },
  KCl: { name: 'Potassium chloride', layout: [['K', [2, 8, 8, 1], 'm'], ['Cl', [2, 8, 7], 'n']] },
  MgO: { name: 'Magnesium oxide', layout: [['Mg', [2, 8, 2], 'm'], ['O', [2, 6], 'n']] },
  MgCl2: { name: 'Magnesium chloride', layout: [['Cl', [2, 8, 7], 'n'], ['Mg', [2, 8, 2], 'm'], ['Cl', [2, 8, 7], 'n']] },
  Na2O: { name: 'Sodium oxide', layout: [['Na', [2, 8, 1], 'm'], ['O', [2, 6], 'n'], ['Na', [2, 8, 1], 'm']] },
  CaO: { name: 'Calcium oxide', layout: [['Ca', [2, 8, 8, 2], 'm'], ['O', [2, 6], 'n']] },
};

// Ionic bonding engine. opts.layout = [[symbol, shells, 'm'|'n'], ...] lets other pages (Bond Lab) animate any pair.
Anims.ionic = function (host, opts = {}) {
  const W = 780, H = 380;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let key = 'NaCl', t = 0, speed = 1, view = 'transfer', atoms, moving, tEnd, scale = 1, oy = 0;
  const custom = !!opts.layout;

  if (!custom) {
    const sel = UI.select(bar, 'Compound', Object.entries(IONIC).map(([k, v]) => [k, `${v.name} (${k.replace(/(\d)/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[d])})`]), (v) => { key = v; build(); });
    sel.value = key;
  }
  UI.button(bar, '↻ Replay', () => { t = 0; view = 'transfer'; });
  UI.slider(bar, 'Speed', 0.25, 2, 1, 0.25, (v) => (speed = v), (v) => v + '×');
  UI.button(bar, 'Show lattice', () => { view = view === 'lattice' ? 'transfer' : 'lattice'; }, 'btn ghost');

  const outerCap = (a) => (a.sh.length === 1 ? 2 : 8);
  const needOf = (a) => outerCap(a) - a.sh.at(-1);
  const formula = () => opts.formula || key;

  // Place atoms: a central atom with up to 4 partners around it, or an alternating row.
  function place(L) {
    const ms = L.filter((x) => x[2] === 'm'), ns = L.filter((x) => x[2] === 'n');
    const rOf = (sh) => shellR(sh.length - 1);
    const gap = 46;
    let out = [];
    const star = (ms.length === 1 && ns.length >= 3) || (ns.length === 1 && ms.length >= 3);
    if (star) {
      const [c, others] = ms.length === 1 ? [ms[0], ns] : [ns[0], ms];
      out.push({ d: c, x: 0, y: 0 });
      const angs = [180, 0, -90, 90];
      others.forEach((o, i) => {
        const d = rOf(c[1]) + rOf(o[1]) + gap, a = angs[i] * DEG;
        out.push({ d: o, x: Math.cos(a) * d, y: Math.sin(a) * d });
      });
    } else {
      // alternate, starting with the more numerous kind
      const [A, B] = ms.length >= ns.length ? [ms.slice(), ns.slice()] : [ns.slice(), ms.slice()];
      const seq = [];
      while (A.length || B.length) { if (A.length) seq.push(A.shift()); if (B.length) seq.push(B.shift()); }
      let x = 0;
      seq.forEach((d, i) => {
        if (i > 0) x += rOf(seq[i - 1][1]) + rOf(d[1]) + gap;
        out.push({ d, x, y: 0 });
      });
      const mid = x / 2;
      out.forEach((p) => (p.x -= mid));
    }
    // fit to canvas
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of out) { const r = rOf(p.d[1]) + 26; x0 = Math.min(x0, p.x - r); x1 = Math.max(x1, p.x + r); y0 = Math.min(y0, p.y - r); y1 = Math.max(y1, p.y + r + 24); }
    scale = Math.min(1, (W - 30) / (x1 - x0), (H - 70) / (y1 - y0));
    oy = 40 + (H - 40) / 2 - ((y0 + y1) / 2) * scale;
    return out.map((p) => ({ s: p.d[0], sh: p.d[1].slice(), kind: p.d[2], x: p.x - (x0 + x1) / 2, y: p.y }));
  }

  function build() {
    t = 0; view = 'transfer';
    atoms = place(custom ? opts.layout : IONIC[key].layout);
    moving = [];
    const need = new Map(atoms.filter((a) => a.kind === 'n').map((a) => [a, needOf(a)]));
    for (const m of atoms.filter((a) => a.kind === 'm')) {
      for (let i = 0; i < m.sh.at(-1); i++) {
        const target = [...need.keys()].filter((n) => need.get(n) > 0).sort((p, q) => Math.hypot(p.x - m.x, p.y - m.y) - Math.hypot(q.x - m.x, q.y - m.y))[0];
        if (!target) break;
        need.set(target, need.get(target) - 1);
        moving.push({ from: m, to: target });
      }
    }
    const used = new Map();
    for (const mv of moving) {
      const dir = Math.atan2(mv.to.y - mv.from.y, mv.to.x - mv.from.x);
      const ro = shellR(mv.from.sh.length - 1);
      const mine = moving.filter((o) => o.from === mv.from);
      const k = mine.indexOf(mv);
      const off = (k - (mine.length - 1) / 2) * 16 * DEG;
      mv.sx = mv.from.x + ro * Math.cos(dir + off); mv.sy = mv.from.y + ro * Math.sin(dir + off);
      const slots = slotAngles(outerCap(mv.to)), taken = used.get(mv.to) || [];
      const back = dir + Math.PI;
      const free = slots.map((a, i) => i).filter((i) => !taken.includes(i)).sort((i, j) => angDist(slots[i], back) - angDist(slots[j], back));
      mv.slot = free[0];
      taken.push(mv.slot); used.set(mv.to, taken);
      const rn = shellR(mv.to.sh.length - 1);
      mv.ex = mv.to.x + rn * Math.cos(slots[mv.slot]); mv.ey = mv.to.y + rn * Math.sin(slots[mv.slot]);
    }
    for (const a of atoms) a.incomingSlots = used.get(a) || [];
    moving.forEach((mv, i) => { mv.t0 = 1.6 + i * 0.6; mv.dur = 1.3; mv.lift = (i % 2 ? 1 : -1) * 55; });
    tEnd = moving.length ? moving.at(-1).t0 + moving.at(-1).dur : 1.6;
  }

  function cfg(a, after) {
    if (!after) return a.sh.join(',');
    const s = a.sh.slice();
    if (a.kind === 'm') s.pop(); else s[s.length - 1] = outerCap(a);
    return s.join(',') || '0';
  }
  const chargeOf = (a) => (a.kind === 'm' ? a.sh.at(-1) : -needOf(a));

  function narrate() {
    const m = atoms.find((a) => a.kind === 'm'), n = atoms.find((a) => a.kind === 'n');
    const nm = atoms.filter((a) => a.kind === 'm').length, nn = atoms.filter((a) => a.kind === 'n').length;
    const k = m.sh.at(-1), need = needOf(n);
    const qm = k, qn = -need;
    const steps = [
      `<b>1.</b> ${m.s} atom (${cfg(m)}) has <b>${k}</b> outer electron${k > 1 ? 's' : ''}. ${n.s} atom (${cfg(n)}) needs <b>${need}</b> more for a full outer shell.`,
      `<b>2.</b> ${nm > 1 ? 'Each ' : ''}${m.s} atom <b>transfers</b> ${k} electron${k > 1 ? 's' : ''} ${nn > 1 ? 'to the ' + n.s + ' atoms' : 'to ' + n.s}. <span class="dim">(● = ${m.s} electron, × = ${n.s} electron)</span>`,
      `<b>3.</b> ${m.s} becomes <b>${m.s}<sup>${chargeLabel(qm)}</sup></b> (${cfg(m, true)}) — a positive ion (cation). ${n.s} becomes <b>${n.s}<sup>${chargeLabel(qn)}</sup></b> (${cfg(n, true)}) — a negative ion (anion). Both now have a noble-gas configuration.`,
      `<b>4.</b> The oppositely charged ions are held together by <b>strong electrostatic attraction</b> — the <b>ionic bond</b>. Formula: <b>${UI.fmtFormula(formula())}</b> (charges cancel: ${nm} × (+${qm}) + ${nn} × (−${need}) = 0).`,
    ];
    const stage = t < 1.6 ? 0 : t < tEnd ? 1 : t < tEnd + 1.2 ? 2 : 3;
    info.innerHTML = steps.map((s, i) => `<div class="step ${i === stage ? 'on' : i < stage ? 'done' : ''}">${s}</div>`).join('');
  }

  function electron(x, y, mark) {
    if (mark === 'dot') UI.circle(ctx, x, y, 5, UI.C.dot);
    else UI.cross(ctx, x, y, 4.5, UI.C.cross, 2.2);
  }

  function drawAtom(a) {
    const done = t > tEnd;
    const fade = a.kind === 'm' ? 1 - UI.ease((t - tEnd) / 0.8) : 1;
    const mark = a.kind === 'm' ? 'dot' : 'cross';
    a.sh.forEach((cnt, i) => {
      const outer = i === a.sh.length - 1;
      const r = shellR(i);
      ctx.globalAlpha = outer && a.kind === 'm' ? fade : 1;
      UI.circle(ctx, a.x, a.y, r, null, '#475569', 1.5);
      if (outer && a.kind === 'm') { ctx.globalAlpha = 1; return; }
      const slots = slotAngles(i === 0 ? 2 : 8);
      const order = outer ? slots.map((_, j) => j).filter((j) => !a.incomingSlots.includes(j)) : slots.map((_, j) => j);
      for (let k = 0; k < cnt; k++) {
        const ang = slots[order[k]];
        electron(a.x + r * Math.cos(ang), a.y + r * Math.sin(ang), mark);
      }
      ctx.globalAlpha = 1;
    });
    UI.circle(ctx, a.x, a.y, 17, a.kind === 'm' ? '#7c2d12' : '#164e63', null);
    UI.text(ctx, a.s, a.x, a.y, { size: 15 });
    const shellsLeft = a.kind === 'm' && done ? a.sh.length - 1 : a.sh.length;
    const r = shellsLeft > 0 ? shellR(shellsLeft - 1) + 14 : 26;
    if (done) {
      ctx.globalAlpha = UI.ease((t - tEnd - 0.3) / 0.6);
      ctx.strokeStyle = UI.C.text; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(a.x - r + 9, a.y - r); ctx.lineTo(a.x - r, a.y - r); ctx.lineTo(a.x - r, a.y + r); ctx.lineTo(a.x - r + 9, a.y + r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(a.x + r - 9, a.y - r); ctx.lineTo(a.x + r, a.y - r); ctx.lineTo(a.x + r, a.y + r); ctx.lineTo(a.x + r - 9, a.y + r); ctx.stroke();
      const q = chargeOf(a);
      UI.text(ctx, chargeLabel(q), a.x + r + 12, a.y - r + 2, { size: 18, color: q > 0 ? UI.C.orange : UI.C.cross });
      ctx.globalAlpha = 1;
    }
    const lab = done ? `${a.s}${supCharge(chargeOf(a))}  ${cfg(a, true)}` : `${a.s}  ${cfg(a)}`;
    UI.text(ctx, lab, a.x, a.y + shellR(a.sh.length - 1) + 24, { size: 14, color: UI.C.dim });
  }

  function drawTransfer() {
    ctx.save();
    ctx.translate(W / 2, oy); ctx.scale(scale, scale);
    for (const a of atoms) drawAtom(a);
    for (const mv of moving) {
      const p = UI.ease((t - mv.t0) / mv.dur);
      const dx = mv.ex - mv.sx, dy = mv.ey - mv.sy, len = Math.hypot(dx, dy) || 1;
      const mx = (mv.sx + mv.ex) / 2 - (dy / len) * mv.lift, my = (mv.sy + mv.ey) / 2 + (dx / len) * mv.lift;
      const x = (1 - p) * (1 - p) * mv.sx + 2 * (1 - p) * p * mx + p * p * mv.ex;
      const y = (1 - p) * (1 - p) * mv.sy + 2 * (1 - p) * p * my + p * p * mv.ey;
      if (p > 0 && p < 1) {
        ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(251,191,36,0.35)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(mv.sx, mv.sy); ctx.quadraticCurveTo(mx, my, mv.ex, mv.ey); ctx.stroke(); ctx.setLineDash([]);
      }
      electron(x, y, 'dot');
    }
    if (t > tEnd + 1.2) {
      ctx.globalAlpha = 0.6 + 0.4 * Math.sin(t * 4);
      const seen = new Set();
      for (const mv of moving) {
        const k = atoms.indexOf(mv.from) + '-' + atoms.indexOf(mv.to);
        if (seen.has(k)) continue; seen.add(k);
        const a = mv.from, b = mv.to, ang = Math.atan2(b.y - a.y, b.x - a.x);
        const ra = shellR(Math.max(0, a.sh.length - 2)) + 18, rb = shellR(b.sh.length - 1) + 18;
        const x1 = a.x + Math.cos(ang) * ra, y1 = a.y + Math.sin(ang) * ra, x2 = b.x - Math.cos(ang) * rb, y2 = b.y - Math.sin(ang) * rb;
        const xm = (x1 + x2) / 2, ym = (y1 + y2) / 2;
        UI.arrow(ctx, xm, ym, x1, y1, UI.C.pink, 2.5); UI.arrow(ctx, xm, ym, x2, y2, UI.C.pink, 2.5);
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    if (t > tEnd + 1.2) UI.text(ctx, '⟷ strong electrostatic attraction between oppositely charged ions', W / 2, 22, { size: 14, color: UI.C.pink });
  }

  function drawLattice(time) {
    const m = atoms.find((a) => a.kind === 'm'), n = atoms.find((a) => a.kind === 'n');
    const qm = chargeLabel(chargeOf(m)), qn = chargeLabel(chargeOf(n));
    const cols = 11, rows = 6, sp = 54, ox = (W - (cols - 1) * sp) / 2, oy2 = 45;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const pos = (r + c) % 2 === 0;
      const x = ox + c * sp + Math.sin(time * 6 + r * 3 + c) * 1.5, y = oy2 + r * sp + Math.cos(time * 5 + c * 2 + r) * 1.5;
      if (c < cols - 1) UI.line(ctx, ox + c * sp, oy2 + r * sp, ox + (c + 1) * sp, oy2 + r * sp, '#1e293b', 1);
      if (r < rows - 1) UI.line(ctx, ox + c * sp, oy2 + r * sp, ox + c * sp, oy2 + (r + 1) * sp, '#1e293b', 1);
      UI.circle(ctx, x, y, pos ? 15 : 20, pos ? '#9a3412' : '#155e75', pos ? UI.C.orange : UI.C.cross, 1.5);
      UI.text(ctx, pos ? m.s + qm : n.s + qn, x, y, { size: 11 });
    }
    UI.text(ctx, 'Giant ionic lattice: a regular arrangement of alternating positive and negative ions', W / 2, 365, { size: 13, color: UI.C.dim });
    const oneToOne = chargeOf(m) === -chargeOf(n);
    info.innerHTML = '<b>Giant ionic lattice.</b> Every ion is surrounded by ions of the opposite charge, held by strong electrostatic forces in <b>all directions</b>. ' +
      '<ul><li><b>High melting and boiling points</b> — lots of energy is needed to overcome the many strong attractions.</li>' +
      '<li><b>Do not conduct when solid</b> — ions are fixed in place.</li>' +
      '<li><b>Conduct when molten or dissolved in water</b> — the ions are free to move and carry charge.</li>' +
      '<li>Often <b>soluble in water</b>; hard but <b>brittle</b> (a blow lines up like charges, which repel, and the crystal shatters).</li></ul>' +
      (oneToOne ? '' : '<span class="dim">(Simplified 1:1 picture shown; in the real lattice the ratio of ions follows the formula.)</span>');
  }

  build();
  return UI.loop((dt, time) => {
    UI.clear(ctx, W, H);
    if (view === 'lattice') { drawLattice(time); return; }
    t += dt * speed;
    drawTransfer();
    narrate();
  });
};

// ---------- Covalent ----------
// atoms: [symbol, valence electrons, shell radius, x, y]; bonds: [a, b, order]
const RH = 30, RX = 44;
const COVALENT = {
  H2: { name: 'Hydrogen', atoms: [['H', 1, RH, -20, 0], ['H', 1, RH, 20, 0]], bonds: [[0, 1, 1]] },
  Cl2: { name: 'Chlorine', atoms: [['Cl', 7, RX, -32, 0], ['Cl', 7, RX, 32, 0]], bonds: [[0, 1, 1]] },
  HCl: { name: 'Hydrogen chloride', atoms: [['H', 1, RH, -27, 0], ['Cl', 7, RX, 27, 0]], bonds: [[0, 1, 1]] },
  H2O: { name: 'Water', atoms: [['O', 6, RX, 0, -15], ['H', 1, RH, -38, 23], ['H', 1, RH, 38, 23]], bonds: [[0, 1, 1], [0, 2, 1]] },
  NH3: { name: 'Ammonia', atoms: [['N', 5, RX, 0, -5], ['H', 1, RH, -54, -5], ['H', 1, RH, 54, -5], ['H', 1, RH, 0, 49]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1]] },
  CH4: { name: 'Methane', atoms: [['C', 4, RX, 0, 0], ['H', 1, RH, -54, 0], ['H', 1, RH, 54, 0], ['H', 1, RH, 0, -54], ['H', 1, RH, 0, 54]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]] },
  O2: { name: 'Oxygen', atoms: [['O', 6, RX, -32, 0], ['O', 6, RX, 32, 0]], bonds: [[0, 1, 2]] },
  N2: { name: 'Nitrogen', atoms: [['N', 5, RX, -32, 0], ['N', 5, RX, 32, 0]], bonds: [[0, 1, 3]] },
  CO2: { name: 'Carbon dioxide', atoms: [['O', 6, RX, -64, 0], ['C', 4, RX, 0, 0], ['O', 6, RX, 64, 0]], bonds: [[1, 0, 2], [1, 2, 2]] },
  C2H4: { name: 'Ethene', atoms: [['C', 4, RX, -32, 0], ['C', 4, RX, 32, 0], ['H', 1, RH, -70, -40], ['H', 1, RH, -70, 40], ['H', 1, RH, 70, -40], ['H', 1, RH, 70, 40]], bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]] },
  CH3OH: { name: 'Methanol', atoms: [['C', 4, RX, -32, 0], ['O', 6, RX, 32, 0], ['H', 1, RH, -86, 0], ['H', 1, RH, -32, -54], ['H', 1, RH, -32, 54], ['H', 1, RH, 32, 54]], bonds: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1], [1, 5, 1]] },
};
const EXTENDED_MOLS = ['O2', 'N2', 'CO2', 'C2H4', 'CH3OH'];

Anims.covalent = function (host, opts = {}) {
  const W = 780, H = 360, S = 1.55;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let key = 'H2O', t = 0, els, atoms, mol;
  const colors = ['#fbbf24', '#22d3ee', '#f472b6', '#a3e635', '#c084fc', '#fb923c'];

  const custom = !!opts.mol;
  const molSel = custom ? null : UI.select(bar, 'Molecule', Object.entries(COVALENT).map(([k, v]) => [k, `${v.name} ${k.replace(/(\d)/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[d])}${EXTENDED_MOLS.includes(k) ? '  (Extended)' : ''}`]), (v) => { key = v; build(); });
  if (molSel) molSel.value = key; else key = opts.formula;
  UI.button(bar, '↻ Replay', () => (t = 0));

  function build() {
    t = 0;
    mol = custom ? opts.mol : COVALENT[key];
    const cx = W / 2 - 60, cy = 180;
    atoms = mol.atoms.map(([s, v, r, x, y], i) => ({ s, v, r: r * S / 1.25, fx: cx + x * S, fy: cy + y * S, i, color: colors[i % colors.length] }));
    // start positions: pushed out from the centre
    for (const a of atoms) {
      const dx = a.fx - cx, dy = a.fy - cy, d = Math.hypot(dx, dy) || 1;
      a.sx = a.fx + (dx / d) * 70; a.sy = a.fy + (dy / d) * 70;
    }
    els = [];
    const bondCount = atoms.map(() => 0);
    const bondDirs = atoms.map(() => []);
    for (const [ia, ib, order] of mol.bonds) {
      const A = atoms[ia], B = atoms[ib];
      bondCount[ia] += order; bondCount[ib] += order;
      const ang = Math.atan2(B.fy - A.fy, B.fx - A.fx);
      bondDirs[ia].push(ang); bondDirs[ib].push(ang + Math.PI);
      // overlap point between the shells
      const d = Math.hypot(B.fx - A.fx, B.fy - A.fy);
      const mid = (A.r + (d - B.r)) / 2;
      const mx = A.fx + Math.cos(ang) * mid, my = A.fy + Math.sin(ang) * mid;
      const px = -Math.sin(ang), py = Math.cos(ang);
      for (let k = 0; k < order; k++) {
        const off = (k - (order - 1) / 2) * 15;
        for (const [owner, side] of [[A, -1], [B, 1]]) {
          const ex = mx + px * off + Math.cos(ang) * 5 * side, ey = my + py * off + Math.sin(ang) * 5 * side;
          const toward = owner === A ? ang : ang + Math.PI;
          els.push({ owner, bond: true, rel0: [Math.cos(toward + off / 60) * owner.r, Math.sin(toward + off / 60) * owner.r], fin: [ex, ey] });
        }
      }
    }
    // lone pairs: pick directions far from bonds
    atoms.forEach((a, i) => {
      const lone = a.v - bondCount[i];
      const cands = [0, 45, 90, 135, 180, 225, 270, 315].map((d) => d * DEG);
      const chosen = [];
      for (let p = 0; p < Math.floor(lone / 2); p++) {
        let best = null, bestScore = -1;
        for (const c of cands) {
          const all = bondDirs[i].concat(chosen);
          const score = all.length ? Math.min(...all.map((b) => angDist(b, c))) : 1;
          if (score > bestScore + 1e-6) { bestScore = score; best = c; }
        }
        chosen.push(best);
        for (const s of [-1, 1]) {
          const ang = best + s * 11 * DEG;
          els.push({ owner: a, bond: false, rel0: [Math.cos(ang) * a.r, Math.sin(ang) * a.r] });
        }
      }
    });
    updateInfo();
  }

  function updateInfo() {
    const pairs = mol.bonds.reduce((s, b) => s + b[2], 0);
    const kinds = mol.bonds.map((b) => b[2]);
    const desc = kinds.includes(3) ? 'a <b>triple</b> covalent bond (3 shared pairs)' : kinds.includes(2) ? `${kinds.filter((k) => k === 2).length > 1 ? 'two <b>double</b> bonds' : 'a <b>double</b> bond'} (2 shared pairs each)` : `${pairs} single covalent bond${pairs > 1 ? 's' : ''}`;
    const shellsTxt = atoms.map((a) => a.s).filter((s, i, arr) => arr.indexOf(s) === i).map((s) => `${s}: ${s === 'H' ? '2 (like He)' : '8'}`).join(', ');
    info.innerHTML = `<b>${mol.name}, ${UI.fmtFormula(key)}</b> — ${desc}.<br>
      A <b>covalent bond</b> is a <b>shared pair of electrons</b> between two non-metal atoms. Each atom now has a full outer shell (${shellsTxt}).<br>
      <span class="dim">Only outer shells are shown. Each colour/mark shows which atom an electron came from (dot-and-cross).</span><br>
      Simple molecular substance → <b>low melting & boiling points</b> (weak forces <i>between</i> molecules) and <b>does not conduct electricity</b> (no ions or free electrons).`;
  }

  function drawElectron(x, y, owner) {
    const idx = owner.i;
    if (idx % 2 === 0) UI.circle(ctx, x, y, 5, owner.color);
    else UI.cross(ctx, x, y, 4.5, owner.color, 2.2);
  }

  build();
  return UI.loop((dt) => {
    t += dt;
    UI.clear(ctx, W, H);
    const pa = UI.ease((t - 0.8) / 1.6), pe = UI.ease((t - 2.0) / 1.2);
    for (const a of atoms) { a.x = UI.lerp(a.sx, a.fx, pa); a.y = UI.lerp(a.sy, a.fy, pa); }
    for (const a of atoms) {
      ctx.fillStyle = a.color + '14';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      UI.circle(ctx, a.x, a.y, a.r, null, a.color + 'aa', 1.6);
      UI.text(ctx, a.s, a.x, a.y, { size: 18 });
    }
    for (const e of els) {
      const bx = e.owner.x + e.rel0[0], by = e.owner.y + e.rel0[1];
      if (e.bond) drawElectron(UI.lerp(bx, e.fin[0], pe), UI.lerp(by, e.fin[1], pe), e.owner);
      else drawElectron(bx, by, e.owner);
    }
    // displayed formula on the right
    const ox = W - 150, oy = 180, k = 0.9;
    UI.text(ctx, 'displayed formula', ox, 60, { size: 12, color: UI.C.dim });
    const cx = W / 2 - 60;
    for (const [ia, ib, order] of mol.bonds) {
      const A = atoms[ia], B = atoms[ib];
      const ax = ox + (A.fx - cx) * k * 0.62, ay = oy + (A.fy - 180) * k * 0.62, bx = ox + (B.fx - cx) * k * 0.62, by = oy + (B.fy - 180) * k * 0.62;
      const ang = Math.atan2(by - ay, bx - ax), px = -Math.sin(ang), py = Math.cos(ang);
      for (let i = 0; i < order; i++) {
        const off = (i - (order - 1) / 2) * 6;
        UI.line(ctx, ax + px * off + Math.cos(ang) * 11, ay + py * off + Math.sin(ang) * 11, bx + px * off - Math.cos(ang) * 11, by + py * off - Math.sin(ang) * 11, UI.C.text, 2);
      }
    }
    for (const a of atoms) UI.text(ctx, a.s, ox + (a.fx - cx) * k * 0.62, oy + (a.fy - 180) * k * 0.62, { size: 16 });
    if (pe >= 1) UI.text(ctx, 'shared pairs of electrons in the overlap = covalent bonds', W / 2 - 60, 335, { size: 13, color: UI.C.green });
  });
};

// ---------- Giant covalent ----------
Anims.giant = function (host, opts = {}) {
  const W = 780, H = 340;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let mode = 'diamond', slide = 0, sliding = false;
  const TXT = {
    diamond: '<b>Diamond</b>: each carbon atom forms <b>4 strong covalent bonds</b> in a giant tetrahedral network. Very hard, very high melting point, does not conduct (no free electrons). Use: <b>cutting tools</b>.',
    graphite: '<b>Graphite</b>: each carbon forms <b>3 covalent bonds</b> in flat hexagonal <b>layers</b>. The 4th electron is <b>delocalised</b> → conducts electricity (use: <b>electrodes</b>). Weak forces between layers let them <b>slide</b> → soft, slippery (use: <b>lubricant</b>). Press “Slide layers”.',
    sio2: '<b>Silicon(IV) oxide, SiO<sub>2</sub></b> (Extended): each Si bonds to 4 O, each O bonds to 2 Si — a giant covalent structure like diamond. Hard, very high melting point, does not conduct.',
  };
  const gsel = UI.select(bar, 'Structure', [['diamond', 'Diamond'], ['graphite', 'Graphite'], ['sio2', 'Silicon(IV) oxide (Extended)']], (v) => { mode = v; slide = 0; info.innerHTML = TXT[v]; });
  if (opts.mode) { mode = opts.mode; gsel.value = mode; }
  UI.button(bar, 'Slide layers', () => { sliding = !sliding; }, 'btn ghost');
  info.innerHTML = TXT[mode];

  function hexLayer(y0, shift, rot) {
    const r = 20, pts = [];
    for (let row = 0; row < 3; row++) for (let i = 0; i < 17; i++) {
      const x = 70 + i * r * Math.sqrt(3) + (row % 2) * r * Math.sqrt(3) / 2 + shift;
      const y = y0 + row * 18;
      pts.push([x, y]);
    }
    for (let a = 0; a < pts.length; a++) for (let b = a + 1; b < pts.length; b++) {
      const d = Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]);
      if (d < 36) UI.line(ctx, pts[a][0], pts[a][1], pts[b][0], pts[b][1], '#64748b', 2);
    }
    for (const [x, y] of pts) UI.circle(ctx, x, y, 5, '#cbd5e1');
    return pts;
  }

  return UI.loop((dt, time) => {
    UI.clear(ctx, W, H);
    if (mode === 'graphite') {
      if (sliding) slide = Math.sin(time * 1.5) * 40;
      for (let L = 0; L < 3; L++) {
        hexLayer(50 + L * 100, L === 1 ? slide : 0);
        if (L < 2) {
          ctx.setLineDash([3, 6]);
          UI.line(ctx, 60, 120 + L * 100, 660, 120 + L * 100, '#475569', 1);
          ctx.setLineDash([]);
          UI.text(ctx, 'weak forces', 668, 114 + L * 100, { size: 11, color: UI.C.dim, align: 'left' });
          UI.text(ctx, 'between layers', 668, 128 + L * 100, { size: 11, color: UI.C.dim, align: 'left' });
        }
      }
      for (let i = 0; i < 12; i++) UI.circle(ctx, 70 + ((time * 60 + i * 47) % 580) + (i % 3 === 1 ? slide : 0), 68 + (i % 3) * 100, 3, UI.C.dot);
      UI.text(ctx, '● delocalised electrons move along the layers', 400, 325, { size: 12, color: UI.C.dot });
    } else {
      // 2D picture of a network where every atom is covalently bonded to its neighbours

      // square grid: every grid atom has 4 bonds (C or Si); in SiO2 an O sits on each bond (2 bonds each)
      const gx = (i) => 140 + i * 64 + Math.sin(time * 0.8) * 3, gy = (j) => 45 + j * 60;
      for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) {
        if (i < 8) UI.line(ctx, gx(i), gy(j), gx(i + 1), gy(j), '#64748b', 2);
        if (j < 4) UI.line(ctx, gx(i), gy(j), gx(i), gy(j + 1), '#64748b', 2);
      }
      for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) {
        if (mode === 'sio2') {
          if (i < 8) { UI.circle(ctx, gx(i) + 32, gy(j), 8, '#ef4444'); UI.text(ctx, 'O', gx(i) + 32, gy(j), { size: 9 }); }
          if (j < 4) { UI.circle(ctx, gx(i), gy(j) + 30, 8, '#ef4444'); UI.text(ctx, 'O', gx(i), gy(j) + 30, { size: 9 }); }
          UI.circle(ctx, gx(i), gy(j), 11, '#7c3aed'); UI.text(ctx, 'Si', gx(i), gy(j), { size: 10 });
        } else UI.circle(ctx, gx(i), gy(j), 8, '#cbd5e1');
      }
      UI.text(ctx, mode === 'sio2' ? 'every bond is a strong covalent bond — giant structure' : 'each C: 4 strong covalent bonds — no free electrons', 400, 325, { size: 12, color: UI.C.dim });
    }
  });
};

// ---------- Metallic ----------
Anims.metallic = function (host, opts = {}) {
  const W = 780, H = 370;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const cols = 10, rows = 5, sp = 58, ox = 130, oy = 55;
  let voltage = false, shiftTarget = 0, shift = 0, alloy = false;
  const ions = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) ions.push({ r, c, big: false });
  const els = Array.from({ length: 55 }, () => ({ x: UI.rand(ox - 20, ox + (cols - 1) * sp + 20), y: UI.rand(oy - 20, oy + (rows - 1) * sp + 20), vx: UI.rand(-80, 80), vy: UI.rand(-80, 80) }));
  UI.check(bar, 'Connect to battery', (v) => (voltage = v));
  UI.button(bar, 'Hit with hammer', () => { shiftTarget = shiftTarget ? 0 : (alloy ? 10 : sp); }, 'btn ghost');
  const alloyBox = UI.check(bar, 'Make an alloy', (v) => { alloy = v; shiftTarget = 0; ions.forEach((io, i) => (io.big = v && [7, 13, 22, 26, 34, 41].includes(i))); upd(); });
  function upd() {
    info.innerHTML = alloy
      ? '<b>Alloy</b> (e.g. brass = copper + zinc; stainless steel = iron + chromium, nickel, carbon). The <b>different-sized atoms</b> disrupt the regular layers, so the layers <b>can no longer slide</b> easily → alloys are <b>harder and stronger</b> than pure metals. Try the hammer!'
      : '<b>Metallic bonding</b> (Extended): <b>electrostatic attraction</b> between a giant lattice of <b>positive metal ions</b> and a <b>“sea” of delocalised electrons</b>.<br>• <b>Conducts electricity</b>: delocalised electrons move through the metal (tick “Connect to battery”).<br>• <b>Malleable & ductile</b>: layers of ions can <b>slide</b> over each other without breaking the metallic bond (press the hammer).';
  }
  upd();
  if (opts.alloy) alloyBox.click();
  return UI.loop((dt, time) => {
    shift += (shiftTarget - shift) * Math.min(1, dt * 4);
    UI.clear(ctx, W, H);
    UI.roundRect(ctx, ox - 40, oy - 40, (cols - 1) * sp + 80, (rows - 1) * sp + 80, 10, '#0f1a30', '#334155');
    for (const io of ions) {
      const s = io.r < 2 ? shift : 0;
      const x = ox + io.c * sp + s + Math.sin(time * 7 + io.c + io.r * 2) * 1.2, y = oy + io.r * sp;
      UI.circle(ctx, x, y, io.big ? 26 : 19, io.big ? '#4c1d95' : '#9a3412', io.big ? UI.C.purple : UI.C.orange);
      UI.text(ctx, '+', x, y, { size: 18 });
    }
    for (const e of els) {
      e.vx += UI.rand(-1, 1) * 400 * dt; e.vy += UI.rand(-1, 1) * 400 * dt;
      const sp2 = Math.hypot(e.vx, e.vy); if (sp2 > 120) { e.vx *= 120 / sp2; e.vy *= 120 / sp2; }
      e.x += (e.vx + (voltage ? 90 : 0)) * dt; e.y += e.vy * dt;
      const x0 = ox - 30, x1 = ox + (cols - 1) * sp + 30, y0 = oy - 30, y1 = oy + (rows - 1) * sp + 30;
      if (voltage) { if (e.x > x1) e.x = x0; }
      else { if (e.x < x0 || e.x > x1) e.vx *= -1; }
      if (e.y < y0 || e.y > y1) e.vy *= -1;
      e.x = UI.clamp(e.x, x0, x1); e.y = UI.clamp(e.y, y0, y1);
      UI.circle(ctx, e.x, e.y, 3.5, UI.C.cross);
    }
    if (voltage) {
      UI.text(ctx, '−', ox - 70, 170, { size: 30, color: UI.C.blue });
      UI.text(ctx, '+', ox + (cols - 1) * sp + 70, 170, { size: 30, color: UI.C.red });
      UI.arrow(ctx, 330, 352, 470, 352, UI.C.cross);
      UI.text(ctx, 'electron flow', 400, 338, { size: 12, color: UI.C.cross });
    }
    if (Math.abs(shift) > 2 && !alloy) UI.text(ctx, 'layers slide — the metal changes shape but does not break', 400, 20, { size: 13, color: UI.C.dot });
    if (alloy && shiftTarget) UI.text(ctx, 'larger atoms block the layers — hard to slide!', 400, 20, { size: 13, color: UI.C.purple });
  });
};
