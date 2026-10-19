'use strict';
// Topics 3, 8, 9, 10, 11, 12: moles, balancing, periodic table, metals, environment, organic, analysis.

const AR = { H: 1, He: 4, Li: 7, Be: 9, B: 11, C: 12, N: 14, O: 16, F: 19, Ne: 20, Na: 23, Mg: 24, Al: 27, Si: 28, P: 31, S: 32, Cl: 35.5, Ar: 40, K: 39, Ca: 40, Cr: 52, Mn: 55, Fe: 56, Cu: 64, Zn: 65, Br: 80, Ag: 108, I: 127, Ba: 137, Pb: 207 };

// Parse a formula such as Ca(OH)2 or CuSO4.5H2O into element counts.
function parseFormula(f) {
  f = f.replace(/\s/g, '').replace(/[·•]/g, '.');
  const total = {};
  for (const part of f.split('.')) {
    let i = 0;
    const m = part.match(/^(\d+)/);
    const mult = m ? parseInt(m[1]) : 1;
    i = m ? m[1].length : 0;
    const num = () => { let s = ''; while (i < part.length && /\d/.test(part[i])) s += part[i++]; return s ? parseInt(s) : 1; };
    const group = () => {
      const c = {};
      while (i < part.length && part[i] !== ')') {
        if (part[i] === '(') {
          i++; const g = group();
          if (part[i] !== ')') throw new Error('Missing )');
          i++; const n = num();
          for (const k in g) c[k] = (c[k] || 0) + g[k] * n;
        } else if (/[A-Z]/.test(part[i])) {
          let s = part[i++];
          while (i < part.length && /[a-z]/.test(part[i])) s += part[i++];
          if (!(s in AR)) throw new Error('Unknown element ' + s);
          const n = num(); c[s] = (c[s] || 0) + n;
        } else throw new Error('Unexpected “' + part[i] + '”');
      }
      return c;
    };
    const g = group();
    if (i < part.length) throw new Error('Unexpected )');
    for (const k in g) total[k] = (total[k] || 0) + g[k] * mult;
  }
  return total;
}
const mrOf = (counts) => Object.entries(counts).reduce((s, [e, n]) => s + AR[e] * n, 0);

Anims.moles = function (host) {
  const box = UI.el('div', { class: 'calc' });
  host.append(box);
  box.innerHTML = `
    <div class="calc-grid">
      <div>
        <label class="ctl">Formula <input id="mf" value="CaCO3" class="txt"></label>
        <label class="ctl">Mass (g) <input id="mm" type="number" value="25" class="num"></label>
        <div id="mo" class="anim-info"></div>
      </div>
      <svg viewBox="0 0 220 190" class="triangle">
        <polygon points="110,10 210,180 10,180" fill="#111a2e" stroke="#38bdf8" stroke-width="2"/>
        <line x1="60" y1="95" x2="160" y2="95" stroke="#38bdf8" stroke-width="2"/>
        <line x1="110" y1="95" x2="110" y2="180" stroke="#38bdf8" stroke-width="2"/>
        <text x="110" y="72" text-anchor="middle" class="tri" data-k="m">mass</text>
        <text x="72" y="145" text-anchor="middle" class="tri" data-k="n">moles</text>
        <text x="148" y="145" text-anchor="middle" class="tri" data-k="M">Mᵣ</text>
      </svg>
    </div>
    <div class="dim" id="tri-out">Click a word in the triangle to see its formula.</div>`;
  const $ = (s) => box.querySelector(s);
  const TRI = { m: 'mass (g) = moles × M<sub>r</sub>', n: 'moles = mass (g) ÷ M<sub>r</sub>', M: 'M<sub>r</sub> = mass (g) ÷ moles' };
  box.querySelectorAll('.tri').forEach((t) => t.addEventListener('click', () => { $('#tri-out').innerHTML = '<b>' + TRI[t.dataset.k] + '</b>'; }));
  function calc() {
    try {
      const c = parseFormula($('#mf').value);
      const mr = mrOf(c), mass = parseFloat($('#mm').value) || 0, n = mass / mr;
      const parts = Object.entries(c).map(([e, k]) => `${e} ${k > 1 ? k + ' × ' : ''}${AR[e]}`).join(' + ');
      $('#mo').innerHTML = `M<sub>r</sub> of ${UI.fmtFormula($('#mf').value)} = ${parts} = <b>${+mr.toFixed(2)}</b><br>
        moles = ${mass} ÷ ${+mr.toFixed(2)} = <b class="big">${+n.toFixed(4)} mol</b><br>
        particles = ${+n.toFixed(4)} × 6.02 × 10<sup>23</sup> = <b>${(n * 6.02).toFixed(3)} × 10<sup>23</sup></b><br>
        if it were a gas at r.t.p.: volume = ${+n.toFixed(4)} × 24 = <b>${+(n * 24).toFixed(3)} dm³</b><br>
        <span class="dim">% by mass: ${Object.entries(c).map(([e, k]) => `${e} ${(100 * AR[e] * k / mr).toFixed(1)}%`).join(', ')}</span>`;
    } catch (e) { $('#mo').innerHTML = '<span class="warn">' + e.message + '</span>'; }
  }
  $('#mf').addEventListener('input', calc); $('#mm').addEventListener('input', calc);
  calc();
  return () => {};
};

const EQUATIONS = [
  ['H2 + O2 → H2O', [2, 1, 2]],
  ['Mg + O2 → MgO', [2, 1, 2]],
  ['Na + Cl2 → NaCl', [2, 1, 2]],
  ['N2 + H2 → NH3', [1, 3, 2]],
  ['CH4 + O2 → CO2 + H2O', [1, 2, 1, 2]],
  ['Al + O2 → Al2O3', [4, 3, 2]],
  ['CaCO3 + HCl → CaCl2 + H2O + CO2', [1, 2, 1, 1, 1]],
  ['Fe2O3 + CO → Fe + CO2', [1, 3, 2, 3]],
  ['C3H8 + O2 → CO2 + H2O', [1, 5, 3, 4]],
  ['Na + H2O → NaOH + H2', [2, 2, 2, 1]],
];
const ELCOL = { H: '#e2e8f0', O: '#ef4444', C: '#64748b', N: '#3b82f6', Na: '#a855f7', Cl: '#84cc16', Mg: '#f59e0b', Al: '#94a3b8', Ca: '#f97316', Fe: '#b45309' };

Anims.balance = function (host) {
  const box = UI.el('div', { class: 'calc' });
  host.append(box);
  let idx = 0, coef;
  const bar = UI.bar(box);
  UI.select(bar, 'Equation', EQUATIONS.map((e, i) => [i, e[0].replace(/(\d)/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[d])]), (v) => { idx = +v; start(); });
  UI.button(bar, 'Show answer', () => { coef = EQUATIONS[idx][1].slice(); render(); }, 'btn ghost');
  const eqEl = UI.el('div', { class: 'equation' }), tally = UI.el('div', { class: 'tally' }), msg = UI.el('div', { class: 'anim-info' });
  box.append(eqEl, tally, msg);
  function species() { const [l, r] = EQUATIONS[idx][0].split('→'); return [l.split('+').map((s) => s.trim()), r.split('+').map((s) => s.trim())]; }
  function start() { coef = EQUATIONS[idx][1].map(() => 1); render(); }
  function count(side, offset) {
    const c = {};
    side.forEach((f, i) => { const p = parseFormula(f); for (const e in p) c[e] = (c[e] || 0) + p[e] * coef[offset + i]; });
    return c;
  }
  function render() {
    const [L, R] = species();
    eqEl.innerHTML = '';
    const all = L.concat(R);
    all.forEach((f, i) => {
      if (i === L.length) eqEl.append(UI.el('span', { class: 'arrow' }, '→'));
      else if (i > 0) eqEl.append(UI.el('span', { class: 'plus' }, '+'));
      const w = UI.el('span', { class: 'species' });
      w.append(UI.el('button', { class: 'mini', onclick: () => { coef[i] = Math.max(1, coef[i] - 1); render(); } }, '−'));
      w.append(UI.el('span', { class: 'coef' }, coef[i] > 1 ? String(coef[i]) : ''));
      w.append(UI.el('span', { html: UI.fmtFormula(f) }));
      w.append(UI.el('button', { class: 'mini', onclick: () => { coef[i] = Math.min(9, coef[i] + 1); render(); } }, '+'));
      eqEl.append(w);
    });
    const cl = count(L, 0), cr = count(R, L.length);
    const els = [...new Set(Object.keys(cl).concat(Object.keys(cr)))];
    tally.innerHTML = '';
    let ok = true;
    for (const e of els) {
      const a = cl[e] || 0, b = cr[e] || 0; if (a !== b) ok = false;
      const row = UI.el('div', { class: 'trow' + (a === b ? ' ok' : '') });
      const dots = (n) => '<span class="atoms">' + Array.from({ length: n }, () => `<i style="background:${ELCOL[e] || '#facc15'}"></i>`).join('') + '</span>';
      row.innerHTML = `<b>${e}</b> ${dots(a)} <span class="n">${a}</span> <span class="vs">${a === b ? '=' : '≠'}</span> <span class="n">${b}</span> ${dots(b)}`;
      tally.append(row);
    }
    msg.innerHTML = ok ? '<span class="good">✔ Balanced!</span> The same number of each type of atom on both sides — atoms are not created or destroyed.' : 'Change the big numbers (coefficients) in front of formulae with − / +. <b>Never change the small numbers</b> — that would make a different substance.';
  }
  start();
  return () => {};
};

// ---------- Periodic table ----------
const PT = [
  // Z, symbol, name, Ar, group(1-18), period, category
  [1, 'H', 'Hydrogen', 1, 1, 1, 'nonmetal'], [2, 'He', 'Helium', 4, 18, 1, 'noble'],
  [3, 'Li', 'Lithium', 7, 1, 2, 'alkali'], [4, 'Be', 'Beryllium', 9, 2, 2, 'alkaline'], [5, 'B', 'Boron', 11, 13, 2, 'metalloid'], [6, 'C', 'Carbon', 12, 14, 2, 'nonmetal'], [7, 'N', 'Nitrogen', 14, 15, 2, 'nonmetal'], [8, 'O', 'Oxygen', 16, 16, 2, 'nonmetal'], [9, 'F', 'Fluorine', 19, 17, 2, 'halogen'], [10, 'Ne', 'Neon', 20, 18, 2, 'noble'],
  [11, 'Na', 'Sodium', 23, 1, 3, 'alkali'], [12, 'Mg', 'Magnesium', 24, 2, 3, 'alkaline'], [13, 'Al', 'Aluminium', 27, 13, 3, 'post'], [14, 'Si', 'Silicon', 28, 14, 3, 'metalloid'], [15, 'P', 'Phosphorus', 31, 15, 3, 'nonmetal'], [16, 'S', 'Sulfur', 32, 16, 3, 'nonmetal'], [17, 'Cl', 'Chlorine', 35.5, 17, 3, 'halogen'], [18, 'Ar', 'Argon', 40, 18, 3, 'noble'],
  [19, 'K', 'Potassium', 39, 1, 4, 'alkali'], [20, 'Ca', 'Calcium', 40, 2, 4, 'alkaline'], [21, 'Sc', 'Scandium', 45, 3, 4, 'transition'], [22, 'Ti', 'Titanium', 48, 4, 4, 'transition'], [23, 'V', 'Vanadium', 51, 5, 4, 'transition'], [24, 'Cr', 'Chromium', 52, 6, 4, 'transition'], [25, 'Mn', 'Manganese', 55, 7, 4, 'transition'], [26, 'Fe', 'Iron', 56, 8, 4, 'transition'], [27, 'Co', 'Cobalt', 59, 9, 4, 'transition'], [28, 'Ni', 'Nickel', 59, 10, 4, 'transition'], [29, 'Cu', 'Copper', 64, 11, 4, 'transition'], [30, 'Zn', 'Zinc', 65, 12, 4, 'transition'], [31, 'Ga', 'Gallium', 70, 13, 4, 'post'], [32, 'Ge', 'Germanium', 73, 14, 4, 'metalloid'], [33, 'As', 'Arsenic', 75, 15, 4, 'metalloid'], [34, 'Se', 'Selenium', 79, 16, 4, 'nonmetal'], [35, 'Br', 'Bromine', 80, 17, 4, 'halogen'], [36, 'Kr', 'Krypton', 84, 18, 4, 'noble'],
  [37, 'Rb', 'Rubidium', 85, 1, 5, 'alkali'], [38, 'Sr', 'Strontium', 88, 2, 5, 'alkaline'], [47, 'Ag', 'Silver', 108, 11, 5, 'transition'], [50, 'Sn', 'Tin', 119, 14, 5, 'post'], [53, 'I', 'Iodine', 127, 17, 5, 'halogen'], [54, 'Xe', 'Xenon', 131, 18, 5, 'noble'],
  [55, 'Cs', 'Caesium', 133, 1, 6, 'alkali'], [56, 'Ba', 'Barium', 137, 2, 6, 'alkaline'], [79, 'Au', 'Gold', 197, 11, 6, 'transition'], [82, 'Pb', 'Lead', 207, 14, 6, 'post'],
];
const CAT = { alkali: ['Group I alkali metals', '#f97316'], alkaline: ['Group II metals', '#f59e0b'], transition: ['Transition elements', '#eab308'], post: ['Other metals', '#84cc16'], metalloid: ['Metalloids', '#14b8a6'], nonmetal: ['Non-metals', '#3b82f6'], halogen: ['Group VII halogens', '#8b5cf6'], noble: ['Group VIII noble gases', '#ec4899'] };
const ROMAN = { 1: 'I', 2: 'II', 13: 'III', 14: 'IV', 15: 'V', 16: 'VI', 17: 'VII', 18: 'VIII' };

Anims.ptable = function (host) {
  const wrap = UI.el('div', { class: 'ptable-wrap' });
  host.append(wrap);
  const grid = UI.el('div', { class: 'ptable' }), detail = UI.el('div', { class: 'anim-info' }), legend = UI.el('div', { class: 'legend' });
  for (let g = 1; g <= 18; g++) grid.append(UI.el('div', { class: 'gh', style: `grid-column:${g};grid-row:1` }, ROMAN[g] || ''));
  for (const [z, s, name, ar, g, p, cat] of PT) {
    const cell = UI.el('button', { class: 'pt', style: `grid-column:${g};grid-row:${p + 1};--c:${CAT[cat][1]}`, title: name },
      UI.el('small', {}, String(z)), UI.el('b', {}, s));
    cell.addEventListener('click', () => show(z));
    grid.append(cell);
  }
  for (const [k, [lab, col]] of Object.entries(CAT)) legend.append(UI.el('span', { style: `--c:${col}` }, lab));
  wrap.append(grid, legend, detail);
  function show(z) {
    const [, s, name, ar, g, p, cat] = PT.find((e) => e[0] === z);
    const conf = z <= 20 ? UI.shells(z).join(',') : '—';
    const metal = ['alkali', 'alkaline', 'transition', 'post'].includes(cat);
    let extra = '';
    if (cat === 'alkali') extra = 'Soft metal; reacts with cold water to make an alkaline hydroxide + hydrogen. Forms 1+ ions. Reactivity <b>increases</b> down the group (outer electron further from nucleus, lost more easily).';
    if (cat === 'halogen') extra = 'Diatomic non-metal (X₂). Forms 1− ions. Reactivity <b>decreases</b> down the group. A more reactive halogen displaces a less reactive one from its halide.';
    if (cat === 'noble') extra = 'Unreactive, monatomic gas — full outer shell, so it does not need to gain, lose or share electrons.';
    if (cat === 'transition') extra = 'High density, high melting point, forms coloured compounds, often a catalyst. Ions with variable oxidation numbers (e.g. Fe²⁺ / Fe³⁺).';
    detail.innerHTML = `<b class="big">${s}</b> &nbsp; <b>${name}</b> — proton number ${z}, A<sub>r</sub> ${ar}<br>
      Group ${ROMAN[g] || '(transition)'} • Period ${p} • ${metal ? 'metal' : 'non-metal'} ${z <= 20 ? '• configuration ' + conf : ''}<br>${extra}`;
  }
  show(11);
  return () => {};
};

Anims.group1 = function (host) {
  const W = 760, H = 300;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const M = {
    Li: { sp: 30, fizz: 0.4, flame: null, shrink: 0.03, txt: '<b>Lithium</b>: floats, fizzes steadily, slowly gets smaller.' },
    Na: { sp: 110, fizz: 1, flame: null, shrink: 0.08, txt: '<b>Sodium</b>: floats, melts into a ball, fizzes rapidly and moves around quickly.' },
    K: { sp: 220, fizz: 1.8, flame: '#c084fc', shrink: 0.14, txt: '<b>Potassium</b>: melts, fizzes violently, moves very fast and burns with a <span style="color:#c084fc">lilac flame</span>.' },
  };
  let key = 'Na', x, vx, size, bubbles = [];
  UI.select(bar, 'Metal', [['Li', 'Lithium'], ['Na', 'Sodium'], ['K', 'Potassium']], (v) => { key = v; drop(); });
  UI.button(bar, 'Drop in water', () => drop());
  function drop() { x = 380; vx = M[key].sp * (Math.random() < 0.5 ? -1 : 1); size = 14; bubbles = []; info.innerHTML = M[key].txt + '<br><b>2' + key + '(s) + 2H₂O(l) → 2' + key + 'OH(aq) + H₂(g)</b> — the solution becomes alkaline (turns universal indicator purple). Reactivity: Li &lt; Na &lt; K.'; }
  drop();
  return UI.loop((dt, t) => {
    const m = M[key], surf = 150;
    if (size > 0) {
      x += vx * dt; vx += UI.rand(-1, 1) * m.sp * 4 * dt;
      if (Math.abs(vx) < m.sp * 0.5) vx = Math.sign(vx || 1) * m.sp * 0.5;
      if (x < 100 || x > 660) { vx *= -1; x = UI.clamp(x, 100, 660); }
      size -= m.shrink * dt * 10;
      if (Math.random() < m.fizz * dt * 30) bubbles.push({ x: x + UI.rand(-size, size), y: surf - 2, r: UI.rand(2, 4), life: 1 });
    }
    UI.clear(ctx, W, H);
    ctx.fillStyle = '#1e3a5f'; ctx.fillRect(80, surf, 600, 120);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.strokeRect(80, 110, 600, 160);
    if (size > 0) {
      UI.circle(ctx, x, surf - size * 0.4, Math.max(size, 0), '#d1d5db');
      if (m.flame) for (let i = 0; i < 6; i++) UI.circle(ctx, x + UI.rand(-6, 6), surf - size - 8 - Math.random() * 22, UI.rand(4, 9), m.flame + '88');
    } else UI.text(ctx, 'all reacted', 380, 90, { size: 13, color: UI.C.dim });
    for (const b of bubbles) { b.y -= 30 * dt; b.life -= dt * 1.5; ctx.globalAlpha = Math.max(0, b.life); UI.circle(ctx, b.x, b.y, b.r, null, '#e2e8f0'); ctx.globalAlpha = 1; }
    bubbles = bubbles.filter((b) => b.life > 0);
    UI.text(ctx, 'H₂ bubbles', 380, 40, { size: 12, color: UI.C.dim });
    void t;
  });
};

// ---------- Displacement ----------
const REACTIVITY = ['K', 'Na', 'Ca', 'Mg', 'Al', 'C', 'Zn', 'Fe', 'H', 'Cu', 'Ag', 'Au'];
const METAL_NAMES = { K: 'potassium', Na: 'sodium', Ca: 'calcium', Mg: 'magnesium', Al: 'aluminium', C: 'carbon', Zn: 'zinc', Fe: 'iron', H: 'hydrogen', Cu: 'copper', Ag: 'silver', Au: 'gold' };
const SOLNS = {
  Cu: { name: 'copper(II) sulfate', col: '#2563eb', metal: '#c2703d', ion: 'Cu²⁺', q: 2 },
  Fe: { name: 'iron(II) sulfate', col: '#86efac', metal: '#57534e', ion: 'Fe²⁺', q: 2 },
  Zn: { name: 'zinc sulfate', col: '#e2e8f0', metal: '#9ca3af', ion: 'Zn²⁺', q: 2 },
  Mg: { name: 'magnesium sulfate', col: '#e2e8f0', metal: '#d1d5db', ion: 'Mg²⁺', q: 2 },
  Ag: { name: 'silver nitrate', col: '#e2e8f0', metal: '#e5e7eb', ion: 'Ag⁺', q: 1 },
};
const STRIP = { Mg: ['#d1d5db', 2], Zn: ['#9ca3af', 2], Fe: ['#57534e', 2], Cu: ['#c2703d', 2], Ag: ['#e5e7eb', 1] };
const AFTER = { Mg: '#e2e8f0', Zn: '#e2e8f0', Fe: '#86efac', Cu: '#2563eb', Ag: '#e2e8f0' };

Anims.displacement = function (host) {
  const W = 760, H = 340;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let strip = 'Zn', soln = 'Cu', p = 0, running = false;
  UI.select(bar, 'Metal strip', Object.keys(STRIP).map((k) => [k, METAL_NAMES[k]]), (v) => { strip = v; p = 0; running = false; upd(); }).value = strip;
  const s2 = UI.select(bar, 'Solution', Object.entries(SOLNS).map(([k, v]) => [k, v.name]), (v) => { soln = v; p = 0; running = false; upd(); });
  s2.value = soln;
  UI.button(bar, '▶ Put strip in', () => { p = 0; running = true; });
  const reacts = () => REACTIVITY.indexOf(strip) < REACTIVITY.indexOf(soln);
  function upd() {
    const S = SOLNS[soln];
    if (strip === soln) { info.innerHTML = 'Same metal — no reaction.'; return; }
    if (reacts()) {
      // electrons lost by the strip = electrons gained by the ions: ns × a = ni × b
      const a = STRIP[strip][1], b = S.q, g = a === b ? a : 1;
      const ns = b / g, ni = a / g;
      info.innerHTML = `<span class="good">Reaction!</span> ${METAL_NAMES[strip]} is <b>more reactive</b> than ${METAL_NAMES[soln]}, so it <b>displaces</b> it from solution. ${METAL_NAMES[soln]} metal coats the strip.<br>
        Ionic equation: <b>${ns > 1 ? ns : ''}${strip} + ${ni > 1 ? ni : ''}${S.ion} → ${ns > 1 ? ns : ''}${strip}${a === 2 ? '²⁺' : '⁺'} + ${ni > 1 ? ni : ''}${soln}</b><br>
        ${strip} <b>loses</b> electrons (oxidised); ${S.ion} <b>gains</b> electrons (reduced) — a <b>redox</b> reaction.${soln === 'Cu' ? ' The blue colour fades.' : ''}`;
    } else info.innerHTML = `<span class="warn">No reaction.</span> ${METAL_NAMES[strip]} is <b>less reactive</b> than ${METAL_NAMES[soln]}, so it cannot displace it.`;
  }
  upd();
  return UI.loop((dt) => {
    if (running) p = Math.min(1, p + dt / 5);
    const S = SOLNS[soln], go = reacts() && strip !== soln;
    UI.clear(ctx, W, H);
    // reactivity ladder
    REACTIVITY.forEach((m, i) => {
      const y = 22 + i * 25, on = m === strip || m === soln;
      UI.roundRect(ctx, 20, y - 10, 110, 21, 5, on ? (m === strip ? '#7c2d12' : '#1e3a8a') : '#111a2e', UI.C.line);
      UI.text(ctx, METAL_NAMES[m], 75, y, { size: 12, color: on ? '#fff' : UI.C.dim });
    });
    UI.text(ctx, 'most reactive ↑', 75, 325, { size: 11, color: UI.C.dim });
    // beaker
    const bx = 330, by = 90, bw = 260, bh = 220;
    const liq = go ? UI.mix(S.col, AFTER[strip], p) : S.col;
    ctx.fillStyle = liq + '99'; ctx.fillRect(bx, by + 40, bw, bh - 40);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, by + bh); ctx.lineTo(bx + bw, by + bh); ctx.lineTo(bx + bw, by); ctx.stroke();
    const sy = running || p > 0 ? by + 20 : 20;
    ctx.fillStyle = STRIP[strip][0]; ctx.fillRect(bx + bw / 2 - 15, sy, 30, 170);
    if (go && p > 0) {
      ctx.fillStyle = S.metal; ctx.globalAlpha = p;
      for (let i = 0; i < 40; i++) {
        const yy = by + 45 + ((i * 37) % 120), side = i % 2 ? 1 : -1;
        ctx.beginPath(); ctx.arc(bx + bw / 2 + side * 15, yy, 3 + p * 4 * ((i % 3) / 2 + 0.5), 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    UI.text(ctx, S.name, bx + bw / 2, by + bh + 18, { size: 13, color: UI.C.dim });
    UI.text(ctx, METAL_NAMES[strip] + ' strip', bx + bw + 60, sy + 20, { size: 13 });
  });
};

// ---------- Greenhouse effect ----------
Anims.greenhouse = function (host) {
  const W = 760, H = 320;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let co2 = 3, rays = [], temp = 15;
  UI.slider(bar, 'CO₂ / CH₄ level', 0, 10, co2, 1, (v) => (co2 = v));
  info.innerHTML = 'Sunlight (short wavelength) passes through the atmosphere and warms the Earth. The Earth emits <b>thermal (infrared) energy</b>. Greenhouse gases (<b>CO<sub>2</sub>, CH<sub>4</sub></b>) <b>absorb</b> this thermal energy and <b>re-emit</b> it in all directions, including back to Earth → <b>less thermal energy is lost to space</b> → global warming → climate change.<br><span class="dim">Reduce by: planting trees, less livestock farming, burning less fossil fuel, using hydrogen and renewable energy (wind, solar).</span>';
  return UI.loop((dt, t) => {
    if (Math.random() < dt * 6) rays.push({ x: UI.rand(80, 680), y: 0, vy: 160, vx: 30, kind: 'sun' });
    for (const r of rays) {
      r.x += r.vx * dt; r.y += r.vy * dt;
      if (r.kind === 'sun' && r.y > 250) { r.kind = 'ir'; r.vy = -110; r.vx = UI.rand(-40, 40); r.y = 250; }
      if (r.kind === 'ir' && r.y < 110 && r.y > 100 && !r.tested) {
        r.tested = true;
        if (Math.random() < co2 / 12) { r.vy = 110; r.vx = UI.rand(-60, 60); r.kind = 'back'; }
      }
      if (r.kind === 'back' && r.y > 250) { r.dead = true; temp += 0.02; }
      if (r.y < -10) r.dead = true;
    }
    rays = rays.filter((r) => !r.dead);
    temp += (14 + co2 * 0.5 - temp) * dt * 0.3;
    UI.clear(ctx, W, H);
    ctx.fillStyle = '#14532d'; ctx.fillRect(0, 250, W, 70);
    ctx.fillStyle = `rgba(148,163,184,${0.08 + co2 * 0.03})`; ctx.fillRect(0, 80, W, 50);
    UI.text(ctx, 'atmosphere with greenhouse gases', 120, 72, { size: 12, color: UI.C.dim });
    for (let i = 0; i < co2 * 4; i++) { const x = (i * 97 + t * 10) % W, y = 90 + (i * 13) % 30; UI.circle(ctx, x, y, 3, '#64748b'); UI.circle(ctx, x - 5, y, 2, '#ef4444'); UI.circle(ctx, x + 5, y, 2, '#ef4444'); }
    for (const r of rays) UI.circle(ctx, r.x, r.y, 3, r.kind === 'sun' ? '#fde047' : '#f87171');
    UI.circle(ctx, 40, 20, 26, '#fde047');
    UI.text(ctx, `Earth ≈ ${temp.toFixed(1)} °C`, W - 90, 285, { size: 16, color: temp > 17 ? UI.C.red : UI.C.text });
    UI.text(ctx, '● sunlight   ● infrared (thermal)', W - 150, 20, { size: 12, color: UI.C.dim });
  });
};

// ---------- Organic: homologous series ----------
const PREFIX = ['meth', 'eth', 'prop', 'but', 'pent', 'hex'];
Anims.organic = function (host) {
  const W = 780, H = 300;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let series = 'alkane', n = 2;
  UI.select(bar, 'Series', [['alkane', 'Alkanes'], ['alkene', 'Alkenes'], ['alcohol', 'Alcohols'], ['acid', 'Carboxylic acids']], (v) => { series = v; if (series === 'alkene' && n < 2) n = 2; slider.value = n; draw(); });
  const slider = UI.slider(bar, 'Carbon atoms', 1, 6, n, 1, (v) => { n = v; if (series === 'alkene' && n < 2) n = 2; draw(); });
  const GEN = { alkane: 'C<sub>n</sub>H<sub>2n+2</sub>', alkene: 'C<sub>n</sub>H<sub>2n</sub>', alcohol: 'C<sub>n</sub>H<sub>2n+1</sub>OH', acid: 'C<sub>n</sub>H<sub>2n+1</sub>COOH' };
  const FG = { alkane: 'none (only C–C single bonds: <b>saturated</b>)', alkene: '<b>C=C</b> double bond (<b>unsaturated</b>)', alcohol: '<b>–OH</b> (hydroxyl)', acid: '<b>–COOH</b> (carboxyl)' };
  function name() {
    const p = PREFIX[n - 1];
    if (series === 'alkane') return p + 'ane';
    if (series === 'alkene') return n >= 4 ? p + '-1-ene' : p + 'ene';
    if (series === 'alcohol') return n >= 3 ? p + 'an-1-ol' : p + 'anol';
    return p + 'anoic acid';
  }
  function formula() {
    const sub = (k) => (k > 1 ? `<sub>${k}</sub>` : '');
    if (series === 'alkane') return `C${sub(n)}H${sub(2 * n + 2)}`;
    if (series === 'alkene') return `C${sub(n)}H${sub(2 * n)}`;
    if (series === 'alcohol') return `C${sub(n)}H${sub(2 * n + 1)}OH`;
    return n === 1 ? 'HCOOH' : `C${sub(n - 1)}H${sub(2 * (n - 1) + 1)}COOH`;
  }
  function atom(x, y, s, hl) { UI.circle(ctx, x, y, 14, hl ? '#7c2d12' : s === 'C' ? '#1f2937' : s === 'O' ? '#7f1d1d' : '#111a2e', hl ? UI.C.orange : '#475569'); UI.text(ctx, s, x, y, { size: 15 }); }
  function bond(x1, y1, x2, y2, order = 1, hl) {
    const a = Math.atan2(y2 - y1, x2 - x1), px = -Math.sin(a), py = Math.cos(a);
    for (let i = 0; i < order; i++) { const o = (i - (order - 1) / 2) * 6; UI.line(ctx, x1 + px * o + Math.cos(a) * 15, y1 + py * o + Math.sin(a) * 15, x2 + px * o - Math.cos(a) * 15, y2 + py * o - Math.sin(a) * 15, hl ? UI.C.orange : UI.C.text, 2.5); }
  }
  function draw() {
    UI.clear(ctx, W, H);
    const d = 70, extra = series === 'alcohol' || series === 'acid' ? 2 : 0;
    const x0 = W / 2 - ((n - 1 + extra) * d) / 2 - (series === 'alkane' || series === 'alkene' ? 0 : 0), y = 150;
    const C = Array.from({ length: n }, (_, i) => [x0 + i * d, y]);
    for (let i = 0; i < n - 1; i++) bond(C[i][0], y, C[i + 1][0], y, series === 'alkene' && i === 0 ? 2 : 1, series === 'alkene' && i === 0);
    C.forEach(([x], i) => {
      const last = i === n - 1;
      let cBonds = (i > 0 ? 1 : 0) + (i < n - 1 ? 1 : 0);
      if (series === 'alkene' && i <= 1) cBonds += 1;
      const pos = [];
      if (series === 'acid' && last) {
        bond(x, y, x, y - d, 2, true); atom(x, y - d, 'O', true);
        bond(x, y, x + d, y, 1, true); atom(x + d, y, 'O', true); bond(x + d, y, x + 2 * d, y, 1, true); atom(x + 2 * d, y, 'H', true);
        if (n === 1) { bond(x - d, y, x, y); atom(x - d, y, 'H'); }
        atom(x, y, 'C', true);
        return;
      }
      if (series === 'alcohol' && last) { bond(x, y, x + d, y, 1, true); atom(x + d, y, 'O', true); bond(x + d, y, x + 2 * d, y, 1, true); atom(x + 2 * d, y, 'H', true); cBonds++; }
      const free = ['up', 'down'];
      if (i === 0) free.push('left');
      if (last && series !== 'alcohol') free.push('right');
      for (const f of free) if (cBonds + pos.length < 4) pos.push(f);
      for (const f of pos) {
        const [hx, hy] = f === 'up' ? [x, y - d] : f === 'down' ? [x, y + d] : f === 'left' ? [x - d, y] : [x + d, y];
        bond(x, y, hx, hy); atom(hx, hy, 'H');
      }
      atom(x, y, 'C', series === 'alkene' && i <= 1);
    });
    info.innerHTML = `<b class="big">${name()}</b> &nbsp; molecular formula <b>${formula()}</b><br>
      Homologous series: <b>${series === 'acid' ? 'carboxylic acids' : series + 's'}</b> • general formula ${GEN[series]} • functional group: ${FG[series]}<br>
      <span class="dim">A homologous series has the same functional group and general formula, similar chemical properties, and each member differs by –CH<sub>2</sub>–. Physical properties (e.g. boiling point) show a trend.</span>`;
  }
  draw();
  return () => {};
};

Anims.bromine = function (host) {
  const W = 760, H = 260;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let p = 0, running = false;
  UI.button(bar, '▶ Add bromine water to both', () => { p = 0; running = true; });
  info.innerHTML = '<b>Test for unsaturation</b>: add aqueous bromine (orange). <b>Alkene</b> → turns <b>colourless</b> (bromine adds across the C=C — an <b>addition</b> reaction: C<sub>2</sub>H<sub>4</sub> + Br<sub>2</sub> → C<sub>2</sub>H<sub>4</sub>Br<sub>2</sub>). <b>Alkane</b> → stays <b>orange</b> (no C=C).';
  return UI.loop((dt) => {
    if (running) p = Math.min(1, p + dt / 3);
    UI.clear(ctx, W, H);
    for (const [x, lab, alk] of [[250, 'ethane (alkane)', false], [510, 'ethene (alkene)', true]]) {
      const col = p === 0 ? '#1f2937' : alk ? UI.mix('#ea580c', '#cbd5e1', UI.ease((p - 0.3) / 0.7)) : '#ea580c';
      ctx.fillStyle = col + (p ? 'cc' : '55'); ctx.fillRect(x - 25, 120, 50, 100);
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x - 25, 30); ctx.lineTo(x - 25, 205); ctx.arc(x, 205, 25, Math.PI, 0, true); ctx.lineTo(x + 25, 30); ctx.stroke();
      UI.text(ctx, lab, x, 250, { size: 13 });
      if (p >= 1) UI.text(ctx, alk ? 'decolourised' : 'stays orange', x, 12, { size: 13, color: alk ? UI.C.green : UI.C.orange });
    }
  });
};

// ---------- Chromatography ----------
Anims.chromatography = function (host) {
  const W = 760, H = 380;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const paper = { x: 180, y: 20, w: 400, h: 330 }, base = 300, solvent0 = 330, maxFront = 50;
  const DYES = { red: ['#ef4444', 0.72], blue: ['#3b82f6', 0.35], yellow: ['#facc15', 0.55], green: ['#22c55e', 0.15] };
  const SAMPLES = [['A', ['red', 'blue']], ['B', ['yellow']], ['C', ['blue']], ['X (unknown)', ['red', 'yellow']], ['Y', ['green', 'yellow', 'red']]];
  let p = 0, running = false;
  UI.button(bar, '▶ Run chromatogram', () => { p = 0; running = true; });
  UI.button(bar, 'Reset', () => { p = 0; running = false; }, 'btn ghost');
  info.innerHTML = '<b>Paper chromatography</b>: spots on a <b>pencil</b> baseline (ink would run) above the solvent level. The solvent moves up the paper; more soluble dyes travel further.<br>' +
    '<b>R<sub>f</sub> = distance moved by substance ÷ distance moved by solvent</b>. A <b>pure</b> substance gives <b>one spot</b>. X contains the same dyes as… compare the spots with A and B!';
  return UI.loop((dt) => {
    if (running) p = Math.min(1, p + dt / 8);
    const front = UI.lerp(solvent0 - 5, maxFront, p);
    UI.clear(ctx, W, H);
    ctx.fillStyle = '#f8fafc'; ctx.fillRect(paper.x, paper.y, paper.w, paper.h);
    ctx.fillStyle = '#bae6fd'; ctx.fillRect(paper.x, front, paper.w, paper.y + paper.h - front);
    ctx.fillStyle = '#0ea5e9aa'; ctx.fillRect(paper.x - 30, solvent0, paper.w + 60, 30);
    UI.line(ctx, paper.x, base, paper.x + paper.w, base, '#475569', 1.5);
    UI.text(ctx, 'pencil baseline', paper.x - 10, base, { size: 11, align: 'right', color: UI.C.dim });
    UI.text(ctx, 'solvent', paper.x - 40, solvent0 + 15, { size: 11, align: 'right', color: UI.C.dim });
    if (p > 0) { UI.line(ctx, paper.x, front, paper.x + paper.w, front, '#0369a1', 1.5, [5, 4]); UI.text(ctx, 'solvent front', paper.x + paper.w + 8, front, { size: 11, align: 'left', color: UI.C.accent }); }
    SAMPLES.forEach(([lab, dyes], i) => {
      const x = paper.x + 45 + i * 78;
      for (const d of dyes) {
        const [col, rf] = DYES[d];
        const y = base - (base - front) * rf * (p > 0 ? 1 : 0);
        ctx.globalAlpha = 0.85; UI.circle(ctx, x, y, 7, col); ctx.globalAlpha = 1;
      }
      UI.text(ctx, lab, x, base + 14, { size: 11, color: '#334155' });
    });
    if (p >= 1) {
      const ds = base - front;
      UI.arrow(ctx, paper.x + paper.w + 40, base, paper.x + paper.w + 40, front, UI.C.accent);
      UI.text(ctx, `solvent: ${(ds / 25).toFixed(1)} cm`, paper.x + paper.w + 50, (base + front) / 2, { size: 11, align: 'left', color: UI.C.accent });
      UI.text(ctx, `red Rf = ${DYES.red[1]}, yellow = ${DYES.yellow[1]}, blue = ${DYES.blue[1]}, green = ${DYES.green[1]}`, W / 2, H - 10, { size: 12, color: UI.C.dim });
    }
  });
};

// ---------- Ion tests virtual lab ----------
const CATIONS = {
  'Al³⁺': { naoh: ['white precipitate', '#f1f5f9', 'dissolves in excess → colourless solution'], nh3: ['white precipitate', '#f1f5f9', 'insoluble in excess'] },
  'NH₄⁺': { naoh: ['no precipitate; on warming, ammonia gas is given off (turns damp red litmus blue)', null, ''], nh3: ['— (not used)', null, ''] },
  'Ca²⁺': { naoh: ['white precipitate', '#f1f5f9', 'insoluble in excess'], nh3: ['no precipitate, or very slight white precipitate', null, ''] },
  'Cr³⁺': { naoh: ['green precipitate', '#4d7c0f', 'dissolves in excess'], nh3: ['grey-green precipitate', '#65a30d', 'insoluble in excess'] },
  'Cu²⁺': { naoh: ['light blue precipitate', '#60a5fa', 'insoluble in excess'], nh3: ['light blue precipitate', '#60a5fa', 'dissolves in excess → dark blue solution'] },
  'Fe²⁺': { naoh: ['green precipitate', '#4d7c0f', 'insoluble in excess'], nh3: ['green precipitate', '#4d7c0f', 'insoluble in excess'] },
  'Fe³⁺': { naoh: ['red-brown precipitate', '#9a3412', 'insoluble in excess'], nh3: ['red-brown precipitate', '#9a3412', 'insoluble in excess'] },
  'Zn²⁺': { naoh: ['white precipitate', '#f1f5f9', 'dissolves in excess → colourless solution'], nh3: ['white precipitate', '#f1f5f9', 'dissolves in excess → colourless solution'] },
};
const FLAMES = { 'Li⁺': ['red', '#dc2626'], 'Na⁺': ['yellow', '#facc15'], 'K⁺': ['lilac', '#c084fc'], 'Ca²⁺': ['orange-red', '#f97316'], 'Ba²⁺': ['light green', '#86efac'], 'Cu²⁺': ['blue-green', '#2dd4bf'] };
const ANIONS = {
  'CO₃²⁻': 'Add dilute acid → <b>effervescence</b>; the gas (CO₂) turns <b>limewater milky</b>.',
  'Cl⁻': 'Acidify with dilute nitric acid, add aqueous silver nitrate → <b>white precipitate</b> (AgCl).',
  'Br⁻': 'Acidify with dilute nitric acid, add aqueous silver nitrate → <b>cream precipitate</b> (AgBr).',
  'I⁻': 'Acidify with dilute nitric acid, add aqueous silver nitrate → <b>yellow precipitate</b> (AgI).',
  'NO₃⁻': 'Add aqueous sodium hydroxide then aluminium foil, warm → <b>ammonia</b> given off (damp red litmus → blue).',
  'SO₄²⁻': 'Acidify with dilute nitric acid, add aqueous barium nitrate → <b>white precipitate</b> (BaSO₄).',
  'SO₃²⁻': 'Add acidified aqueous potassium manganate(VII) → colour changes from <b>purple to colourless</b>.',
};
const GASES = {
  'NH₃': 'turns <b>damp red litmus</b> paper <b>blue</b>', 'CO₂': 'turns <b>limewater milky</b>', 'Cl₂': '<b>bleaches</b> damp litmus paper',
  'H₂': '<b>“squeaky pop”</b> with a lighted splint', 'O₂': '<b>relights</b> a glowing splint', 'SO₂': 'turns acidified aqueous potassium manganate(VII) from <b>purple to colourless</b>',
};

Anims.iontests = function (host) {
  const W = 760, H = 300;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let mode = 'cation', ion = 'Cu²⁺', reagent = 'naoh', drops = 0, flame = 0;
  const modeSel = UI.select(bar, 'Test', [['cation', 'Cations: NaOH / NH₃'], ['flame', 'Flame tests'], ['anion', 'Anions'], ['gas', 'Gases']], (v) => { mode = v; build(); });
  const ctl = UI.el('span'); bar.append(ctl);
  void modeSel;
  function build() {
    ctl.innerHTML = ''; drops = 0; flame = 0;
    if (mode === 'cation') {
      UI.select(ctl, 'Unknown ion', Object.keys(CATIONS).map((k) => [k, k]), (v) => { ion = v; drops = 0; text(); }).value = ion in CATIONS ? ion : (ion = 'Cu²⁺');
      UI.select(ctl, 'Reagent', [['naoh', 'aqueous NaOH'], ['nh3', 'aqueous NH₃']], (v) => { reagent = v; drops = 0; text(); });
      UI.button(ctl, 'Add a few drops', () => { drops = 1; text(); });
      UI.button(ctl, 'Add excess', () => { drops = 2; text(); }, 'btn ghost');
    } else if (mode === 'flame') {
      UI.select(ctl, 'Ion', Object.keys(FLAMES).map((k) => [k, k]), (v) => { ion = v; flame = 0; text(); }).value = ion in FLAMES ? ion : (ion = 'Na⁺');
      UI.button(ctl, '🔥 Hold wire in flame', () => { flame = 1; text(); });
    } else if (mode === 'anion') {
      UI.select(ctl, 'Ion', Object.keys(ANIONS).map((k) => [k, k]), (v) => { ion = v; text(); }).value = ion in ANIONS ? ion : (ion = 'Cl⁻');
    } else {
      UI.select(ctl, 'Gas', Object.keys(GASES).map((k) => [k, k]), (v) => { ion = v; text(); }).value = ion in GASES ? ion : (ion = 'H₂');
    }
    text();
  }
  function text() {
    if (mode === 'cation') {
      const r = CATIONS[ion][reagent];
      info.innerHTML = `<b>${ion}</b> + ${reagent === 'naoh' ? 'aqueous sodium hydroxide' : 'aqueous ammonia'}:<br>` + (drops === 0 ? '<span class="dim">Add the reagent…</span>' : drops === 1 ? `A few drops: <b>${r[0]}</b>` : `A few drops: <b>${r[0]}</b><br>In excess: <b>${r[2] || 'no further change'}</b>`);
    } else if (mode === 'flame') info.innerHTML = flame ? `<b>${ion}</b> gives a <b style="color:${FLAMES[ion][1]}">${FLAMES[ion][0]}</b> flame.` : 'Dip a clean wire in the sample and hold it in a blue Bunsen flame.';
    else if (mode === 'anion') info.innerHTML = `<b>Test for ${ion}</b>: ${ANIONS[ion]}`;
    else info.innerHTML = `<b>Test for ${ion}</b>: ${GASES[ion]}.`;
  }
  build();
  return UI.loop((dt, t) => {
    UI.clear(ctx, W, H);
    if (mode === 'cation') {
      const r = CATIONS[ion][reagent], x = 380;
      let liquid = ion === 'Cu²⁺' ? '#3b82f6' : ion === 'Fe²⁺' ? '#86efac' : ion === 'Fe³⁺' ? '#fdba74' : ion === 'Cr³⁺' ? '#4d7c0f' : '#cbd5e1';
      if (drops === 2 && ion === 'Cu²⁺' && reagent === 'nh3') liquid = '#1e3a8a';
      ctx.fillStyle = liquid + '88'; ctx.fillRect(x - 30, 120, 60, 120);
      if (drops >= 1 && r[1] && !(drops === 2 && /dissolves/.test(r[2]))) {
        ctx.fillStyle = r[1];
        for (let i = 0; i < 60; i++) { const px = x - 24 + ((i * 29) % 48), py = 150 + ((i * 53) % 100) + Math.sin(t * 2 + i) * 2; ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill(); }
      }
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x - 30, 40); ctx.lineTo(x - 30, 240); ctx.arc(x, 240, 30, Math.PI, 0, true); ctx.lineTo(x + 30, 40); ctx.stroke();
    } else if (mode === 'flame') {
      const x = 380;
      ctx.fillStyle = '#475569'; ctx.fillRect(x - 15, 220, 30, 70);
      const col = flame ? FLAMES[ion][1] : '#3b82f6';
      for (let i = 0; i < 14; i++) UI.circle(ctx, x + Math.sin(t * 9 + i) * 6, 210 - i * 9, 22 - i * 1.3, col + '55');
      UI.line(ctx, x + 140, 120, x + 10, 150, '#9ca3af', 3);
    } else {
      UI.text(ctx, mode === 'anion' ? ion : ion, 380, 140, { size: 72, color: '#1e3a5f', weight: 800 });
    }
  });
};
