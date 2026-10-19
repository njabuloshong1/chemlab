'use strict';
// Topic 1 & 2.2/2.3: states of matter, diffusion, atomic structure, isotopes.

Anims.states = function (host) {
  const W = 680, H = 340;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const box = { x: 30, y: 30, w: 420, h: 280 };
  const R = 9, N = 56, COLS = 8;
  let temp = -20, prevState = null, msg = '', msgT = 0;

  const ps = [];
  for (let i = 0; i < N; i++) {
    const c = i % COLS, r = Math.floor(i / COLS);
    const lx = box.x + box.w / 2 - (COLS - 1) * 10.5 + c * 21;
    const ly = box.y + box.h - R - 2 - r * 21;
    ps.push({ x: lx, y: ly, vx: 0, vy: 0, lx, ly });
  }

  const state = () => (temp < 0 ? 'solid' : temp < 100 ? 'liquid' : 'gas');
  const DESC = {
    solid: '<b>Solid</b> — particles are <b>close together</b> in a <b>regular arrangement</b> and only <b>vibrate</b> about fixed positions. Fixed shape and volume; cannot be compressed.',
    liquid: '<b>Liquid</b> — particles are <b>close together</b> but <b>randomly arranged</b> and <b>move around each other</b>. Fixed volume, takes the shape of its container.',
    gas: '<b>Gas</b> — particles are <b>far apart</b>, <b>randomly arranged</b> and move <b>quickly in all directions</b>. Fills its container; easily compressed.',
  };
  const CHANGE = { 'solid>liquid': 'Melting', 'liquid>gas': 'Boiling', 'gas>liquid': 'Condensing', 'liquid>solid': 'Freezing', 'solid>gas': 'Sublimation', 'gas>solid': 'Deposition' };

  UI.slider(bar, 'Temperature', -40, 160, temp, 1, (v) => (temp = v), (v) => v + ' °C');
  UI.button(bar, 'Freeze', () => (bar.querySelector('input').value = temp = -30, bar.querySelector('input').dispatchEvent(new Event('input'))));
  UI.button(bar, 'Boil', () => (bar.querySelector('input').value = temp = 130, bar.querySelector('input').dispatchEvent(new Event('input'))));

  function step(dt) {
    const st = state();
    if (st !== prevState) {
      if (prevState) { msg = CHANGE[prevState + '>' + st] || ''; msgT = 2; }
      prevState = st;
      info.innerHTML = DESC[st] + '<br><span class="dim">Substance: water. Melting point 0 °C, boiling point 100 °C. Higher temperature → particles have more kinetic energy.</span>';
    }
    const floor = box.y + box.h - R, left = box.x + R, right = box.x + box.w - R, top = box.y + R;
    for (const p of ps) {
      if (st === 'solid') {
        const amp = 0.6 + (temp + 40) / 40 * 1.6;
        p.x += (p.lx + UI.rand(-amp, amp) - p.x) * Math.min(1, dt * 10);
        p.y += (p.ly + UI.rand(-amp, amp) - p.y) * Math.min(1, dt * 10);
        p.vx = UI.rand(-20, 20); p.vy = UI.rand(-20, 20);
        continue;
      }
      const sp = st === 'liquid' ? 35 + temp * 0.8 : 140 + (temp - 100) * 2.5;
      p.vx += UI.rand(-1, 1) * sp * dt * 4;
      p.vy += UI.rand(-1, 1) * sp * dt * 4;
      if (st === 'liquid') p.vy += 500 * dt;
      const cur = Math.hypot(p.vx, p.vy) || 1;
      const k = 1 + (sp / cur - 1) * Math.min(1, dt * 3);
      p.vx *= k; p.vy *= k;
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < left) { p.x = left; p.vx = Math.abs(p.vx); }
      if (p.x > right) { p.x = right; p.vx = -Math.abs(p.vx); }
      if (p.y < top) { p.y = top; p.vy = Math.abs(p.vy); }
      if (p.y > floor) { p.y = floor; p.vy = -Math.abs(p.vy) * 0.6; }
    }
    if (st !== 'solid') {
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const a = ps[i], b = ps[j];
        const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < 4 * R * R && d2 > 0.01) {
          const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, ov = (2 * R - d) / 2;
          a.x += nx * ov; a.y += ny * ov; b.x -= nx * ov; b.y -= ny * ov;
          const rv = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
          if (rv < 0) { a.vx -= rv * nx; a.vy -= rv * ny; b.vx += rv * nx; b.vy += rv * ny; }
        }
      }
    }
  }

  function draw() {
    UI.clear(ctx, W, H);
    UI.roundRect(ctx, box.x, box.y, box.w, box.h, 6, '#0f1a30', UI.C.line, 2);
    const col = { solid: '#60a5fa', liquid: '#38bdf8', gas: '#a5f3fc' }[state()];
    for (const p of ps) UI.circle(ctx, p.x, p.y, R, col, '#0b1220', 1);
    UI.text(ctx, state().toUpperCase(), box.x + 12, box.y + 18, { align: 'left', size: 15, color: UI.C.accent });
    if (msgT > 0) UI.text(ctx, msg + '!', box.x + box.w / 2, box.y + 40, { size: 22, color: `rgba(251,191,36,${Math.min(1, msgT)})` });

    // thermometer
    const tx = 560, ty0 = 40, ty1 = 280;
    const yOf = (t) => UI.lerp(ty1, ty0, (t + 40) / 200);
    UI.roundRect(ctx, tx - 9, ty0 - 8, 18, ty1 - ty0 + 16, 9, '#1e293b', UI.C.line);
    UI.circle(ctx, tx, ty1 + 18, 16, '#ef4444', UI.C.line);
    ctx.fillStyle = '#ef4444'; ctx.fillRect(tx - 5, yOf(temp), 10, ty1 + 10 - yOf(temp));
    for (const [t, lab] of [[0, 'melting point 0 °C'], [100, 'boiling point 100 °C']]) {
      UI.line(ctx, tx - 16, yOf(t), tx + 16, yOf(t), UI.C.dot, 2);
      UI.text(ctx, lab, tx + 22, yOf(t), { align: 'left', size: 11, color: UI.C.dot });
    }
    UI.text(ctx, temp + ' °C', tx, 18, { size: 15 });
  }

  return UI.loop((dt) => { msgT -= dt; step(dt); draw(); });
};

Anims.diffusion = function (host) {
  const W = 680, H = 230;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const tube = { x: 60, y: 90, w: 560, h: 44 };
  let parts = [], ring = [], running = false, t = 0;
  info.innerHTML = 'Ammonia (M<sub>r</sub> = 17) and hydrogen chloride (M<sub>r</sub> = 36.5) diffuse towards each other. Where they meet, a <b>white ring of ammonium chloride</b> forms: NH<sub>3</sub>(g) + HCl(g) → NH<sub>4</sub>Cl(s). The ring forms <b>nearer the HCl end</b> because NH<sub>3</sub> has a <b>lower M<sub>r</sub></b>, so its particles move faster and diffuse faster.';

  function reset() { parts = []; ring = []; t = 0; running = false; }
  UI.button(bar, '▶ Start', () => { reset(); running = true; });
  UI.button(bar, 'Reset', reset, 'btn ghost');

  function spawn(type) {
    const left = type === 'NH3';
    parts.push({ type, x: left ? tube.x + 14 : tube.x + tube.w - 14, y: UI.rand(tube.y + 6, tube.y + tube.h - 6) });
  }

  return UI.loop((dt) => {
    if (running) {
      t += dt;
      if (Math.random() < dt * 20) spawn('NH3');
      if (Math.random() < dt * 20) spawn('HCl');
      for (const p of parts) {
        // random walk; diffusion speed proportional to 1/sqrt(Mr)
        const s = p.type === 'NH3' ? 1 / Math.sqrt(17) : 1 / Math.sqrt(36.5);
        const step = 380 * s * Math.sqrt(dt);
        p.x += UI.rand(-1, 1) * step * 1.7 + (p.type === 'NH3' ? 1 : -1) * 40 * s * dt * 10;
        p.y += UI.rand(-1, 1) * step;
        p.x = UI.clamp(p.x, tube.x + 4, tube.x + tube.w - 4);
        p.y = UI.clamp(p.y, tube.y + 4, tube.y + tube.h - 4);
      }
      for (const a of parts) if (a.type === 'NH3' && !a.dead) for (const b of parts) {
        if (b.type !== 'HCl' || b.dead) continue;
        if (Math.abs(a.x - b.x) < 6 && Math.abs(a.y - b.y) < 10) {
          a.dead = b.dead = true;
          ring.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
          break;
        }
      }
      parts = parts.filter((p) => !p.dead);
      if (parts.length > 400) parts.splice(0, 20);
    }
    UI.clear(ctx, W, H);
    UI.roundRect(ctx, tube.x, tube.y, tube.w, tube.h, 20, '#0f1a30', UI.C.line, 2);
    ctx.fillStyle = '#e5e7eb'; ctx.fillRect(tube.x - 14, tube.y + 4, 16, tube.h - 8);
    ctx.fillRect(tube.x + tube.w - 2, tube.y + 4, 16, tube.h - 8);
    UI.text(ctx, 'cotton wool soaked in', tube.x + 10, 40, { size: 12, color: UI.C.dim, align: 'left' });
    UI.text(ctx, 'conc. ammonia (NH₃)', tube.x + 10, 58, { size: 14, color: UI.C.blue, align: 'left' });
    UI.text(ctx, 'cotton wool soaked in', tube.x + tube.w - 10, 40, { size: 12, color: UI.C.dim, align: 'right' });
    UI.text(ctx, 'conc. hydrochloric acid (HCl)', tube.x + tube.w - 10, 58, { size: 14, color: UI.C.red, align: 'right' });
    for (const r of ring) UI.circle(ctx, r.x, r.y, 3, '#f8fafc');
    for (const p of parts) UI.circle(ctx, p.x, p.y, 3, p.type === 'NH3' ? UI.C.blue : UI.C.red);
    if (ring.length > 8) {
      const avg = ring.reduce((s, r) => s + r.x, 0) / ring.length;
      UI.arrow(ctx, avg, 190, avg, 142, '#f8fafc');
      UI.text(ctx, 'white ring of NH₄Cl', avg, 205, { size: 13 });
    }
    UI.text(ctx, `t = ${t.toFixed(1)} s`, W - 20, H - 12, { size: 12, color: UI.C.dim, align: 'right' });
  });
};

const ELEMENTS20 = [
  ['H', 'Hydrogen', 1], ['He', 'Helium', 4], ['Li', 'Lithium', 7], ['Be', 'Beryllium', 9], ['B', 'Boron', 11],
  ['C', 'Carbon', 12], ['N', 'Nitrogen', 14], ['O', 'Oxygen', 16], ['F', 'Fluorine', 19], ['Ne', 'Neon', 20],
  ['Na', 'Sodium', 23], ['Mg', 'Magnesium', 24], ['Al', 'Aluminium', 27], ['Si', 'Silicon', 28], ['P', 'Phosphorus', 31],
  ['S', 'Sulfur', 32], ['Cl', 'Chlorine', 35], ['Ar', 'Argon', 40], ['K', 'Potassium', 39], ['Ca', 'Calcium', 40],
];

// Ion an element usually forms (change in electrons), or null.
function ionChange(z) {
  const sh = UI.shells(z), outer = sh[sh.length - 1];
  if (z === 1) return -1;
  if ([2, 10, 18].includes(z) || [6, 14].includes(z) || z === 5) return null;
  if (outer <= 3) return -outer;
  return 8 - outer;
}

Anims.atom = function (host) {
  const W = 680, H = 380;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let z = 11, extraN = 0, ion = false;

  const sel = UI.select(bar, 'Element', ELEMENTS20.map((e, i) => [i + 1, `${i + 1} ${e[1]}`]), (v) => { z = +v; extraN = 0; ion = false; ionBox.checked = false; update(); });
  sel.value = z;
  UI.button(bar, '− neutron', () => { extraN = Math.max(-2, extraN - 1); update(); }, 'btn ghost');
  UI.button(bar, '+ neutron', () => { extraN = Math.min(3, extraN + 1); update(); }, 'btn ghost');
  const ionBox = UI.check(bar, 'Show ion', (v) => { ion = v; update(); });

  function data() {
    const [sym, name, A0] = ELEMENTS20[z - 1];
    const A = A0 + extraN, n = A - z;
    const ch = ion ? ionChange(z) : 0;
    const e = z + (ch || 0);
    return { sym, name, A, n, e, ch: ch || 0, sh: UI.shells(e) };
  }

  function update() {
    const d = data(), atomSh = UI.shells(z);
    const charge = -d.ch;
    const chargeStr = charge === 0 ? '' : (Math.abs(charge) > 1 ? Math.abs(charge) : '') + (charge > 0 ? '+' : '−');
    let html = `<div class="nuclide"><span class="sup">${d.A}</span><span class="sub">${z}</span><span class="sym">${d.sym}</span><span class="chg">${chargeStr}</span></div>
      <b>${d.name}${ion && d.ch ? ' ion' : ''}</b><br>
      Protons: <b>${z}</b> &nbsp; Neutrons: <b>${d.n}</b> (= ${d.A} − ${z}) &nbsp; Electrons: <b>${d.e}</b><br>
      Electronic configuration: <b>${d.sh.join(',') || '0'}</b><br>
      Group ${groupOf(z)} &nbsp;•&nbsp; Period ${atomSh.length} <span class="dim">(outer electrons = group number; shells = period number)</span>`;
    if (extraN !== 0) html += `<br><span class="hl">Isotope!</span> Same number of protons (${z}) but a different number of neutrons. Same electrons → <b>same chemical properties</b>.`;
    if (ion && d.ch === 0) html += '<br><span class="dim">This element does not usually form a simple ion.</span>';
    else if (ion) html += `<br>${d.ch < 0 ? 'Lost' : 'Gained'} <b>${Math.abs(d.ch)}</b> electron${Math.abs(d.ch) > 1 ? 's' : ''} → full outer shell like a noble gas. ${d.ch < 0 ? 'Positive ion (cation).' : 'Negative ion (anion).'}`;
    info.innerHTML = html;
  }

  function groupOf(z) {
    if ([2, 10, 18].includes(z)) return 'VIII (0)';
    const sh = UI.shells(z), o = sh[sh.length - 1];
    return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'][o - 1];
  }

  // sunflower packing of nucleons
  function nucleus(cx, cy, p, n) {
    const tot = p + n, pts = [];
    // spread the p protons evenly among the nucleons
    const types = Array.from({ length: tot }, (_, i) => (Math.floor((i + 1) * p / tot) > Math.floor(i * p / tot) ? 1 : 0));
    const r = 5;
    for (let i = 0; i < tot; i++) {
      const a = i * 2.39996, d = 2.6 * r * 0.55 * Math.sqrt(i + 0.5);
      pts.push([cx + d * Math.cos(a), cy + d * Math.sin(a), types[i]]);
    }
    for (let i = pts.length - 1; i >= 0; i--) { const [x, y, t] = pts[i]; UI.circle(ctx, x, y, r, t ? '#ef4444' : '#9ca3af', '#0b1220', 1); }
  }

  update();
  return UI.loop((dt, t) => {
    const d = data(), cx = 220, cy = 190;
    UI.clear(ctx, W, H);
    const radii = [55, 90, 125, 160];
    d.sh.forEach((cnt, i) => {
      UI.circle(ctx, cx, cy, radii[i], null, '#334155', 1.5);
      for (let k = 0; k < cnt; k++) {
        const a = t * (0.6 / (i + 1)) + (k / cnt) * Math.PI * 2;
        UI.circle(ctx, cx + radii[i] * Math.cos(a), cy + radii[i] * Math.sin(a), 6, UI.C.dot, '#0b1220', 1);
      }
    });
    nucleus(cx, cy, z, d.n);
    if (ion && d.ch) {
      ctx.strokeStyle = UI.C.text; ctx.lineWidth = 2;
      const r = radii[d.sh.length - 1] + 14;
      ctx.beginPath(); ctx.moveTo(cx - r + 10, cy - r); ctx.lineTo(cx - r, cy - r); ctx.lineTo(cx - r, cy + r); ctx.lineTo(cx - r + 10, cy + r); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx + r - 10, cy - r); ctx.lineTo(cx + r, cy - r); ctx.lineTo(cx + r, cy + r); ctx.lineTo(cx + r - 10, cy + r); ctx.stroke();
      const c = -d.ch;
      UI.text(ctx, (Math.abs(c) > 1 ? Math.abs(c) : '') + (c > 0 ? '+' : '−'), cx + r + 14, cy - r + 4, { size: 18 });
    }
    // key
    const kx = 440;
    UI.circle(ctx, kx, 50, 6, '#ef4444'); UI.text(ctx, 'proton  (charge +1, mass 1)', kx + 14, 50, { align: 'left', size: 13 });
    UI.circle(ctx, kx, 76, 6, '#9ca3af'); UI.text(ctx, 'neutron (charge 0, mass 1)', kx + 14, 76, { align: 'left', size: 13 });
    UI.circle(ctx, kx, 102, 6, UI.C.dot); UI.text(ctx, 'electron (charge −1, mass 1/1836)', kx + 14, 102, { align: 'left', size: 13 });
    UI.text(ctx, d.sym, kx + 90, 210, { size: 64, color: '#1e3a5f', weight: 800 });
    UI.text(ctx, 'nucleus = protons + neutrons', cx, 360, { size: 12, color: UI.C.dim });
  });
};

// Relative atomic mass from isotope abundances.
Anims.ram = function (host) {
  const box = UI.el('div', { class: 'calc' });
  host.append(box);
  const presets = {
    Cl: [['Cl-35', 35, 75], ['Cl-37', 37, 25]],
    B: [['B-10', 10, 20], ['B-11', 11, 80]],
    Cu: [['Cu-63', 63, 69], ['Cu-65', 65, 31]],
    Mg: [['Mg-24', 24, 79], ['Mg-25', 25, 10], ['Mg-26', 26, 11]],
  };
  let rows = presets.Cl.map((r) => r.slice());
  const bar = UI.bar(box);
  UI.select(bar, 'Example', Object.keys(presets).map((k) => [k, k]), (v) => { rows = presets[v].map((r) => r.slice()); render(); });
  const table = UI.el('div'), out = UI.el('div', { class: 'anim-info' });
  box.append(table, out);

  function render() {
    table.innerHTML = '';
    const t = UI.el('table', { class: 'tbl' });
    t.innerHTML = '<tr><th>Isotope</th><th>Mass</th><th>Abundance (%)</th></tr>';
    rows.forEach((r, i) => {
      const tr = UI.el('tr');
      tr.append(UI.el('td', {}, r[0]));
      for (const j of [1, 2]) {
        const inp = UI.el('input', { type: 'number', value: r[j], step: 'any', class: 'num' });
        inp.addEventListener('input', () => { r[j] = parseFloat(inp.value) || 0; calc(); });
        tr.append(UI.el('td', {}, inp));
      }
      t.append(tr);
    });
    table.append(t);
    calc();
  }
  function calc() {
    const total = rows.reduce((s, r) => s + r[2], 0);
    const top = rows.reduce((s, r) => s + r[1] * r[2], 0);
    const ar = total ? top / total : 0;
    out.innerHTML = `A<sub>r</sub> = (${rows.map((r) => `${r[1]} × ${r[2]}`).join(' + ')}) ÷ ${total}<br>
      = ${top.toFixed(1)} ÷ ${total} = <b class="big">${ar.toFixed(2)}</b>
      ${Math.abs(total - 100) > 0.01 ? '<br><span class="warn">Abundances should add up to 100%.</span>' : ''}
      <br><span class="dim">A<sub>r</sub> is the average mass of the isotopes compared with 1/12 of the mass of a carbon-12 atom.</span>`;
  }
  render();
  return () => {};
};
