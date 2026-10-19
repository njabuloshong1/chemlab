'use strict';
// Topics 4–7: electrolysis, energetics, rates, acids & titration.

const ELYTES = {
  pbbr2: {
    name: 'Molten lead(II) bromide, PbBr₂', liquid: '#3a2a1e', fade: null,
    ions: [['Pb²⁺', 2, '#94a3b8', 9], ['Br⁻', -1, '#c2410c', 18]],
    cathode: { ion: 'Pb²⁺', kind: 'deposit', color: '#cbd5e1', eq: 'Pb²⁺ + 2e⁻ → Pb', obs: 'grey/silver lead metal forms (collects at the bottom)' },
    anode: { ion: 'Br⁻', kind: 'gas', color: '#c2410c', eq: '2Br⁻ → Br₂ + 2e⁻', obs: 'red-brown bromine vapour' },
    note: 'A molten binary compound: the metal forms at the cathode, the non-metal at the anode.',
  },
  nacl: {
    name: 'Molten sodium chloride, NaCl', liquid: '#3b3420',
    ions: [['Na⁺', 1, '#a78bfa', 14], ['Cl⁻', -1, '#a3e635', 14]],
    cathode: { ion: 'Na⁺', kind: 'deposit', color: '#e5e7eb', eq: 'Na⁺ + e⁻ → Na', obs: 'silvery sodium metal forms' },
    anode: { ion: 'Cl⁻', kind: 'gas', color: '#bef264', eq: '2Cl⁻ → Cl₂ + 2e⁻', obs: 'pale yellow-green chlorine gas' },
    note: 'Molten: only Na⁺ and Cl⁻ ions are present.',
  },
  brine: {
    name: 'Concentrated aqueous sodium chloride (brine)', liquid: '#14304a',
    ions: [['Na⁺', 1, '#a78bfa', 9], ['H⁺', 1, '#f87171', 6], ['Cl⁻', -1, '#a3e635', 11], ['OH⁻', -1, '#60a5fa', 4]],
    cathode: { ion: 'H⁺', kind: 'gas', color: '#e2e8f0', eq: '2H⁺ + 2e⁻ → H₂', obs: 'bubbles of colourless hydrogen gas (squeaky pop)' },
    anode: { ion: 'Cl⁻', kind: 'gas', color: '#bef264', eq: '2Cl⁻ → Cl₂ + 2e⁻', obs: 'bubbles of pale yellow-green chlorine (bleaches damp litmus)' },
    note: 'Sodium is more reactive than hydrogen, so H⁺ is discharged, not Na⁺. Cl⁻ is concentrated, so Cl₂ forms. Na⁺ and OH⁻ are left: sodium hydroxide solution.',
  },
  h2so4: {
    name: 'Dilute sulfuric acid', liquid: '#13324a',
    ions: [['H⁺', 1, '#f87171', 14], ['SO₄²⁻', -2, '#fde047', 5], ['OH⁻', -1, '#60a5fa', 4]],
    cathode: { ion: 'H⁺', kind: 'gas', color: '#e2e8f0', eq: '2H⁺ + 2e⁻ → H₂', obs: 'colourless hydrogen gas' },
    anode: { ion: 'OH⁻', kind: 'gas', color: '#e2e8f0', eq: '4OH⁻ → O₂ + 2H₂O + 4e⁻', obs: 'colourless oxygen gas (relights a glowing splint)' },
    note: 'Twice the volume of hydrogen is produced compared with oxygen — water is being electrolysed.',
  },
  cuso4: {
    name: 'Aqueous copper(II) sulfate, carbon electrodes (Extended)', liquid: '#1d5fa8', fade: '#14304a',
    ions: [['Cu²⁺', 2, '#38bdf8', 10], ['H⁺', 1, '#f87171', 4], ['SO₄²⁻', -2, '#fde047', 10], ['OH⁻', -1, '#60a5fa', 5]],
    cathode: { ion: 'Cu²⁺', kind: 'deposit', color: '#c2703d', eq: 'Cu²⁺ + 2e⁻ → Cu', obs: 'pink-brown copper coats the cathode' },
    anode: { ion: 'OH⁻', kind: 'gas', color: '#e2e8f0', eq: '4OH⁻ → O₂ + 2H₂O + 4e⁻', obs: 'bubbles of oxygen' },
    note: 'Copper is less reactive than hydrogen, so Cu²⁺ is discharged. The blue colour fades as Cu²⁺ ions are used up. (With copper electrodes, the copper anode dissolves instead and the colour stays the same — used to purify copper / electroplate.)',
  },
};

Anims.electrolysis = function (host) {
  const W = 760, H = 400;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const bk = { x: 150, y: 140, w: 460, h: 220 };
  const cat = { x: 260, w: 26, top: 80, bot: 310 }, an = { x: 500, w: 26, top: 80, bot: 310 };
  let key = 'pbbr2', on = false, ions, bubbles, deposit, vapour, used, wireT = 0;

  UI.select(bar, 'Electrolyte', Object.entries(ELYTES).map(([k, v]) => [k, v.name]), (v) => { key = v; reset(); });
  const sw = UI.button(bar, '⚡ Switch ON', () => { on = !on; sw.textContent = on ? '⏸ Switch OFF' : '⚡ Switch ON'; });
  UI.button(bar, 'Reset', () => reset(), 'btn ghost');

  function spawnIon(def) {
    let x, y;
    do { x = UI.rand(bk.x + 15, bk.x + bk.w - 15); y = UI.rand(bk.y + 25, bk.y + bk.h - 15); }
    while (Math.abs(x - cat.x) < 30 || Math.abs(x - an.x) < 30);
    return { t: def[0], q: def[1], col: def[2], x, y };
  }
  function reset() {
    const E = ELYTES[key];
    ions = []; bubbles = []; deposit = 0; vapour = 0; used = 0;
    for (const d of E.ions) for (let i = 0; i < d[3]; i++) ions.push(spawnIon(d));
    info.innerHTML = `<b>${E.name}</b><br>
      <span class="tag neg">Cathode (−)</span> ${E.cathode.ion} ions gain electrons (<b>reduction</b>): <b>${E.cathode.eq}</b> — ${E.cathode.obs}.<br>
      <span class="tag pos">Anode (+)</span> ${E.anode.ion} ions lose electrons (<b>oxidation</b>): <b>${E.anode.eq}</b> — ${E.anode.obs}.<br>
      <span class="dim">${E.note}</span><br><span class="dim">Remember <b>PANIC</b>: Positive Anode, Negative Is Cathode. Electrons flow through the wires; ions move through the electrolyte.</span>`;
  }

  function electrodeFace(e) { return e === cat ? cat.x + cat.w / 2 : an.x - an.w / 2; }

  reset();
  return UI.loop((dt, time) => {
    const E = ELYTES[key];
    for (const io of ions) {
      io.x += UI.rand(-1, 1) * 40 * dt; io.y += UI.rand(-1, 1) * 40 * dt;
      if (on) {
        const target = io.q > 0 ? cat : an;
        const dir = Math.sign(target.x - io.x);
        io.x += dir * (22 + 8 * Math.abs(io.q)) * dt;
        const dist = Math.abs(target.x - io.x) - target.w / 2;
        if (dist < 12 && io.y < target.bot) {
          const disc = target === cat ? E.cathode : E.anode;
          if (io.t === disc.ion && Math.random() < dt * 3) {
            io.dead = true; used++;
            if (disc.kind === 'gas') bubbles.push({ x: target.x + (target === cat ? 1 : -1) * (target.w / 2 + 4), y: io.y, side: target === cat ? 'c' : 'a', col: disc.color });
            else deposit = Math.min(deposit + 0.6, 14);
          }
          io.x = target.x - dir * (target.w / 2 + 12);
        }
      }
      io.x = UI.clamp(io.x, bk.x + 12, bk.x + bk.w - 12);
      io.y = UI.clamp(io.y, bk.y + 22, bk.y + bk.h - 12);
      // stay out of electrodes
      for (const e of [cat, an]) if (Math.abs(io.x - e.x) < e.w / 2 + 9 && io.y < e.bot + 9) io.x = e.x + Math.sign(io.x - e.x || 1) * (e.w / 2 + 9);
    }
    // respawn discharged ions (more electrolyte keeps the demonstration running)
    for (const io of ions.filter((i) => i.dead)) Object.assign(io, spawnIon(E.ions.find((d) => d[0] === io.t)), { dead: false });
    for (const b of bubbles) { b.y -= 60 * dt; b.x += Math.sin(time * 8 + b.y) * 0.4; }
    for (const b of bubbles) if (b.y < bk.y + 18) { b.done = true; if (b.col !== '#e2e8f0' && b.side === 'a') vapour = Math.min(1, vapour + 0.02); }
    bubbles = bubbles.filter((b) => !b.done);

    UI.clear(ctx, W, H);
    // liquid
    const liq = E.fade ? UI.mix(E.liquid, E.fade, used / 120) : E.liquid;
    ctx.fillStyle = liq; ctx.fillRect(bk.x, bk.y + 15, bk.w, bk.h - 15);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(bk.x, bk.y - 20); ctx.lineTo(bk.x, bk.y + bk.h); ctx.lineTo(bk.x + bk.w, bk.y + bk.h); ctx.lineTo(bk.x + bk.w, bk.y - 20); ctx.stroke();
    if (vapour > 0) {
      ctx.fillStyle = `rgba(${key === 'pbbr2' ? '194,65,12' : '190,242,100'},${vapour * 0.45})`;
      ctx.beginPath(); ctx.ellipse(an.x, bk.y - 10, 70, 40, 0, 0, Math.PI * 2); ctx.fill();
    }
    // wires and battery
    const by = 34;
    UI.line(ctx, cat.x, cat.top, cat.x, by, '#64748b', 3); UI.line(ctx, an.x, an.top, an.x, by, '#64748b', 3);
    UI.line(ctx, cat.x, by, 365, by, '#64748b', 3); UI.line(ctx, 395, by, an.x, by, '#64748b', 3);
    // cell symbol: short thick plate (−) wired to the cathode, long thin plate (+) wired to the anode
    UI.line(ctx, 372, by - 9, 372, by + 9, UI.C.text, 5); UI.line(ctx, 388, by - 16, 388, by + 16, UI.C.text, 3);
    UI.text(ctx, '−', 368, by - 24, { size: 13 }); UI.text(ctx, '+', 392, by - 24, { size: 13 });
    if (on) {
      wireT += dt * 80;
      // electrons leave the anode, travel through the wire to the cathode
      const path = [[an.x, an.top], [an.x, by], [cat.x, by], [cat.x, cat.top]];
      const segs = []; let L = 0;
      for (let i = 0; i < 3; i++) { const l = Math.hypot(path[i + 1][0] - path[i][0], path[i + 1][1] - path[i][1]); segs.push(l); L += l; }
      for (let k = 0; k < 12; k++) {
        let d = (wireT + k * L / 12) % L, i = 0;
        while (d > segs[i]) { d -= segs[i]; i++; }
        const f = d / segs[i];
        UI.circle(ctx, UI.lerp(path[i][0], path[i + 1][0], f), UI.lerp(path[i][1], path[i + 1][1], f), 3.5, UI.C.dot);
      }
      UI.text(ctx, 'e⁻ flow →', 450, 18, { size: 11, color: UI.C.dot });
    }
    // electrodes
    for (const [e, lab, col] of [[cat, 'Cathode (−)', UI.C.blue], [an, 'Anode (+)', UI.C.red]]) {
      ctx.fillStyle = '#1f2937'; ctx.fillRect(e.x - e.w / 2, e.top, e.w, e.bot - e.top);
      UI.text(ctx, lab, e.x, e.bot + 70, { size: 14, color: col });
    }
    if (deposit > 0) {
      ctx.fillStyle = E.cathode.color;
      ctx.fillRect(cat.x - cat.w / 2 - deposit / 2, bk.y + 20, deposit / 2, cat.bot - bk.y - 20);
      ctx.fillRect(cat.x + cat.w / 2, bk.y + 20, deposit / 2, cat.bot - bk.y - 20);
      ctx.fillRect(cat.x - cat.w / 2 - deposit / 2, cat.bot, cat.w + deposit, deposit / 2);
    }
    for (const b of bubbles) UI.circle(ctx, b.x, b.y, 4, null, b.col, 1.5);
    for (const io of ions) {
      UI.circle(ctx, io.x, io.y, 11, io.col + '33', io.col, 1.5);
      UI.text(ctx, io.t, io.x, io.y, { size: 9, color: UI.C.text });
    }
    UI.text(ctx, '− terminal → cathode   |   + terminal → anode', W / 2, H - 8, { size: 11, color: UI.C.dim });
  });
};

// ---------- Energy profile ----------
Anims.energetics = function (host) {
  const W = 760, H = 380;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let exo = true, cat = false, ball = -1;
  UI.select(bar, 'Reaction', [['exo', 'Exothermic (e.g. combustion of methane)'], ['endo', 'Endothermic (e.g. thermal decomposition)']], (v) => { exo = v === 'exo'; upd(); });
  UI.check(bar, 'Add catalyst', (v) => { cat = v; upd(); });
  UI.button(bar, '▶ Run reaction', () => (ball = 0));
  const x0 = 90, x1 = 690, yOf = (E) => 320 - E * 2.3;
  function energy(x, peak) {
    const R = exo ? 70 : 30, P = exo ? 25 : 80;
    const a = 210, m = 360, b = 510;
    if (x <= a) return R;
    if (x >= b) return P;
    if (x <= m) return R + (peak - R) * (1 - Math.cos(Math.PI * (x - a) / (m - a))) / 2;
    return peak + (P - peak) * (1 - Math.cos(Math.PI * (x - m) / (b - m))) / 2;
  }
  function upd() {
    info.innerHTML = exo
      ? '<b>Exothermic</b>: thermal energy is <b>given out</b> to the surroundings → temperature of surroundings <b>rises</b>. Products have <b>less</b> energy than reactants, so <b>ΔH is negative</b>. Examples: combustion, neutralisation, respiration.'
      : '<b>Endothermic</b>: thermal energy is <b>taken in</b> from the surroundings → temperature of surroundings <b>falls</b>. Products have <b>more</b> energy than reactants, so <b>ΔH is positive</b>. Examples: thermal decomposition, photosynthesis, dissolving ammonium nitrate.';
    info.innerHTML += '<br><b>Activation energy, E<sub>a</sub></b> = the minimum energy colliding particles need to react. ' + (cat ? '<span class="hl">A catalyst provides a route with a lower E<sub>a</sub>; ΔH is unchanged.</span>' : '') +
      '<br><span class="dim">Bond breaking is endothermic; bond making is exothermic. ΔH = energy to break bonds − energy released making bonds.</span>';
  }
  upd();
  return UI.loop((dt) => {
    UI.clear(ctx, W, H);
    UI.arrow(ctx, x0 - 30, 340, x0 - 30, 30, UI.C.dim); UI.arrow(ctx, x0 - 30, 340, x1 + 20, 340, UI.C.dim);
    UI.text(ctx, 'Energy', x0 - 50, 180, { size: 13, color: UI.C.dim });
    UI.text(ctx, 'Progress of reaction', (x0 + x1) / 2, 360, { size: 13, color: UI.C.dim });
    const drawCurve = (peak, col, dash) => {
      ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.setLineDash(dash || []);
      ctx.beginPath();
      for (let x = x0; x <= x1; x += 3) { const y = yOf(energy(x, peak)); x === x0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
      ctx.stroke(); ctx.setLineDash([]);
    };
    const peak = 125, peakC = 95;
    drawCurve(peak, UI.C.accent);
    if (cat) drawCurve(peakC, UI.C.green, [8, 6]);
    const R = energy(x0, peak), P = energy(x1, peak);
    UI.text(ctx, exo ? 'CH₄ + 2O₂' : 'CaCO₃', 140, yOf(R) - 16, { size: 14 });
    UI.text(ctx, 'reactants', 140, yOf(R) + 16, { size: 11, color: UI.C.dim });
    UI.text(ctx, exo ? 'CO₂ + 2H₂O' : 'CaO + CO₂', 620, yOf(P) - 16, { size: 14 });
    UI.text(ctx, 'products', 620, yOf(P) + 16, { size: 11, color: UI.C.dim });
    // Ea arrow
    UI.line(ctx, 200, yOf(R), 360, yOf(R), '#475569', 1, [4, 4]);
    UI.arrow(ctx, 300, yOf(R), 300, yOf(peak) + 2, UI.C.orange);
    UI.text(ctx, 'Eₐ', 288, (yOf(R) + yOf(peak)) / 2, { size: 15, color: UI.C.orange, align: 'right' });
    if (cat) { UI.arrow(ctx, 330, yOf(R), 330, yOf(peakC) + 2, UI.C.green); UI.text(ctx, 'Eₐ (catalyst)', 338, (yOf(R) + yOf(peakC)) / 2 + 30, { size: 12, color: UI.C.green, align: 'left' }); }
    // ΔH arrow
    UI.line(ctx, 510, yOf(R), 600, yOf(R), '#475569', 1, [4, 4]);
    UI.arrow(ctx, 560, yOf(R), 560, yOf(P), UI.C.pink);
    UI.text(ctx, exo ? 'ΔH (negative)' : 'ΔH (positive)', 572, (yOf(R) + yOf(P)) / 2, { size: 13, color: UI.C.pink, align: 'left' });
    if (ball >= 0) {
      ball += dt * 0.35;
      const x = UI.lerp(x0, x1, UI.clamp(ball, 0, 1));
      UI.circle(ctx, x, yOf(energy(x, cat ? peakC : peak)) - 9, 8, UI.C.dot);
      if (ball > 1.3) ball = -1;
    }
  });
};

// ---------- Rate of reaction ----------
Anims.rates = function (host) {
  const W = 780, H = 360;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const box = { x: 20, y: 20, w: 420, h: 320 };
  let temp = 30, conc = 20, catalyst = false, ps = [], t = 0, made = 0, collisions = 0, success = 0, curve = [], prev = null;
  const R = 6;
  UI.slider(bar, 'Temperature', 10, 80, temp, 1, (v) => (temp = v), (v) => v + ' °C');
  UI.slider(bar, 'Concentration', 8, 40, conc, 1, (v) => (conc = v), (v) => v + ' particles');
  UI.check(bar, 'Catalyst', (v) => (catalyst = v));
  UI.button(bar, '↻ Restart', () => reset());
  info.innerHTML = '<b>Collision theory</b>: particles must <b>collide</b> with energy ≥ <b>activation energy</b> to react.<br>' +
    '• Higher <b>concentration</b> / <b>pressure</b> → more particles per unit volume → <b>more frequent collisions</b>.<br>' +
    '• Higher <b>temperature</b> → particles have more <b>kinetic energy</b> → more frequent collisions <b>and</b> a greater proportion have energy ≥ E<sub>a</sub>.<br>' +
    '• <b>Catalyst</b> → lowers E<sub>a</sub>, so more collisions are successful. • Larger <b>surface area</b> (powder) → more frequent collisions.<br>' +
    '<span class="dim">Change a setting and press Restart — the previous run stays on the graph in grey for comparison.</span>';

  const speedBase = () => 40 + temp * 2.2;
  function rayleigh(s) { return s * Math.sqrt(-2 * Math.log(1 - Math.random() * 0.999)); }
  function reset() {
    if (curve.length > 4) prev = curve;
    ps = []; curve = []; t = 0; made = 0; collisions = 0; success = 0;
    for (let i = 0; i < conc * 2; i++) {
      const s = rayleigh(speedBase() * 0.8), a = UI.rand(0, Math.PI * 2);
      ps.push({ type: i % 2 ? 'B' : 'A', x: UI.rand(box.x + R, box.x + box.w - R), y: UI.rand(box.y + R, box.y + box.h - R), vx: s * Math.cos(a), vy: s * Math.sin(a) });
    }
  }
  reset();
  let lastBase = speedBase();
  return UI.loop((dt) => {
    t += dt;
    const base = speedBase();
    if (Math.abs(base - lastBase) > 0.5) { const k = base / lastBase; for (const p of ps) { p.vx *= k; p.vy *= k; } lastBase = base; }
    const Ea = catalyst ? 100 : 160;
    for (const p of ps) {
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < box.x + R || p.x > box.x + box.w - R) { p.vx *= -1; p.x = UI.clamp(p.x, box.x + R, box.x + box.w - R); }
      if (p.y < box.y + R || p.y > box.y + box.h - R) { p.vy *= -1; p.y = UI.clamp(p.y, box.y + R, box.y + box.h - R); }
    }
    for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
      const a = ps[i], b = ps[j];
      if (a.dead || b.dead) continue;
      const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
      if (d2 >= 4 * R * R || d2 === 0) continue;
      const d = Math.sqrt(d2), nx = dx / d, ny = dy / d;
      const rv = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
      if (rv >= 0) continue;
      if (a.type !== 'C' && b.type !== 'C' && a.type !== b.type) {
        collisions++;
        if (-rv >= Ea) {
          success++; made++;
          a.type = 'C'; a.vx = (a.vx + b.vx) / 2; a.vy = (a.vy + b.vy) / 2; a.flash = 0.4;
          b.dead = true; continue;
        }
      }
      a.vx -= rv * nx; a.vy -= rv * ny; b.vx += rv * nx; b.vy += rv * ny;
    }
    ps = ps.filter((p) => !p.dead);
    if (curve.length === 0 || t - curve[curve.length - 1][0] > 0.25) if (t < 40) curve.push([t, made]);

    UI.clear(ctx, W, H);
    UI.roundRect(ctx, box.x, box.y, box.w, box.h, 6, '#0f1a30', UI.C.line, 2);
    for (const p of ps) {
      const col = p.type === 'A' ? UI.C.red : p.type === 'B' ? UI.C.blue : UI.C.purple;
      UI.circle(ctx, p.x, p.y, p.type === 'C' ? R + 2 : R, col);
      if (p.flash > 0) { p.flash -= dt; UI.circle(ctx, p.x, p.y, 16, null, UI.C.dot, 2); }
    }
    // graph
    const g = { x: 500, y: 30, w: 250, h: 230 };
    UI.arrow(ctx, g.x, g.y + g.h, g.x, g.y - 5, UI.C.dim); UI.arrow(ctx, g.x, g.y + g.h, g.x + g.w + 10, g.y + g.h, UI.C.dim);
    UI.text(ctx, 'product formed', g.x - 8, g.y + g.h / 2, { size: 11, color: UI.C.dim, align: 'right' });
    UI.text(ctx, 'time / s', g.x + g.w / 2, g.y + g.h + 16, { size: 11, color: UI.C.dim });
    const maxP = 40, maxT = 40;
    const plot = (c, col) => {
      ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath();
      c.forEach(([tt, m], i) => { const x = g.x + tt / maxT * g.w, y = g.y + g.h - Math.min(m, maxP) / maxP * g.h; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.stroke();
    };
    if (prev) plot(prev, '#64748b');
    plot(curve, UI.C.purple);
    [['reactant A', UI.C.red], ['reactant B', UI.C.blue], ['product', UI.C.purple]].forEach(([lab, col], i) => {
      UI.circle(ctx, g.x + i * 88, 285, 6, col);
      UI.text(ctx, lab, g.x + 10 + i * 88, 285, { size: 12, align: 'left' });
    });
    UI.text(ctx, `collisions A–B: ${collisions}   successful: ${success}`, g.x + g.w / 2, 310, { size: 12, color: UI.C.dim });
    UI.text(ctx, `${collisions ? Math.round(100 * success / collisions) : 0}% of collisions have energy ≥ Eₐ`, g.x + g.w / 2, 332, { size: 12, color: UI.C.dot });
  });
};

// ---------- Titration / pH ----------
function indicatorColour(ind, pH) {
  if (ind === 'universal') {
    const stops = [[1, '#dc2626'], [3, '#f97316'], [5, '#facc15'], [7, '#22c55e'], [9, '#0ea5e9'], [11, '#2563eb'], [13, '#7c3aed']];
    if (pH <= 1) return stops[0][1];
    for (let i = 0; i < stops.length - 1; i++) if (pH <= stops[i + 1][0]) return UI.mix(stops[i][1], stops[i + 1][1], (pH - stops[i][0]) / (stops[i + 1][0] - stops[i][0]));
    return stops.at(-1)[1];
  }
  if (ind === 'thymol') return pH < 8.5 ? '#dbeafe' : pH < 9.5 ? UI.mix('#dbeafe', '#2563eb', pH - 8.5) : '#2563eb';
  if (ind === 'methyl') return pH < 3.1 ? '#dc2626' : pH < 4.4 ? '#f97316' : '#facc15';
  if (ind === 'litmus') return pH < 5 ? '#dc2626' : pH < 8 ? '#a855f7' : '#2563eb';
  return '#dbeafe';
}

Anims.titration = function (host) {
  const W = 760, H = 400;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let ind = 'universal', ions, drops, added;
  const N0 = 12;
  UI.select(bar, 'Indicator', [['universal', 'Universal indicator'], ['methyl', 'Methyl orange'], ['thymol', 'Thymolphthalein'], ['litmus', 'Litmus']], (v) => (ind = v));
  UI.button(bar, '💧 Add 1 drop NaOH', () => drops.push({ y: 92 }));
  UI.button(bar, '💧×5', () => { for (let i = 0; i < 5; i++) drops.push({ y: 92 - i * 22 }); }, 'btn ghost');
  UI.button(bar, 'Reset', () => reset(), 'btn ghost');
  const fl = { cx: 380, top: 200, bot: 360, neckW: 34, baseW: 220 };
  function inside() { const y = UI.rand(fl.top + 70, fl.bot - 12); const half = UI.lerp(fl.neckW / 2, fl.baseW / 2, (y - fl.top) / (fl.bot - fl.top)) - 14; return [fl.cx + UI.rand(-half, half), y]; }
  function reset() {
    ions = []; drops = []; added = 0;
    for (let i = 0; i < N0; i++) { let [x, y] = inside(); ions.push({ t: 'H⁺', x, y }); [x, y] = inside(); ions.push({ t: 'Cl⁻', x, y }); }
  }
  function pH() {
    const h = ions.filter((i) => i.t === 'H⁺').length, oh = ions.filter((i) => i.t === 'OH⁻').length;
    if (h > 0) return 1 + Math.log10(N0 / h);
    if (oh > 0) return 13 - Math.log10(N0 / oh);
    return 7;
  }
  reset();
  info.innerHTML = `<b>Neutralisation</b>: acid + alkali → salt + water. Each OH⁻ from the alkali reacts with an H⁺ from the acid to make water. At the <b>end-point</b> the indicator changes colour.<br>
    Methyl orange: <b style="color:#f87171">red</b> in acid, <b style="color:#facc15">yellow</b> in alkali. Thymolphthalein: <b>colourless</b> in acid, <b style="color:#60a5fa">blue</b> in alkali. Litmus: <b style="color:#f87171">red</b> in acid, <b style="color:#60a5fa">blue</b> in alkali.`;
  return UI.loop((dt) => {
    for (const d of drops) {
      d.y += 220 * dt;
      if (d.y > fl.top + 70 && !d.done) {
        d.done = true; added++;
        let [x, y] = inside(); ions.push({ t: 'OH⁻', x, y, seek: true });
        [x, y] = inside(); ions.push({ t: 'Na⁺', x, y });
      }
    }
    drops = drops.filter((d) => !d.done);
    for (const io of ions) {
      if (io.t === 'H₂O') { io.life -= dt; continue; }
      io.x += UI.rand(-1, 1) * 30 * dt; io.y += UI.rand(-1, 1) * 30 * dt;
      if (io.t === 'OH⁻') {
        const h = ions.filter((i) => i.t === 'H⁺').sort((a, b) => Math.hypot(a.x - io.x, a.y - io.y) - Math.hypot(b.x - io.x, b.y - io.y))[0];
        if (h) {
          const dx = h.x - io.x, dy = h.y - io.y, d = Math.hypot(dx, dy);
          if (d < 14) { h.t = 'gone'; io.t = 'H₂O'; io.life = 2.5; io.x = (io.x + h.x) / 2; io.y = (io.y + h.y) / 2; }
          else { io.x += dx / d * 70 * dt; io.y += dy / d * 70 * dt; }
        }
      }
      const half = UI.lerp(fl.neckW / 2, fl.baseW / 2, (io.y - fl.top) / (fl.bot - fl.top)) - 10;
      io.y = UI.clamp(io.y, fl.top + 65, fl.bot - 10);
      io.x = UI.clamp(io.x, fl.cx - half, fl.cx + half);
    }
    ions = ions.filter((i) => i.t !== 'gone' && !(i.t === 'H₂O' && i.life <= 0));
    const p = pH();

    UI.clear(ctx, W, H);
    // burette
    ctx.fillStyle = '#1e293b'; ctx.fillRect(fl.cx - 10, 10, 20, 70);
    ctx.fillStyle = '#93c5fd55'; ctx.fillRect(fl.cx - 8, 12 + Math.min(added, 40), 16, 66 - Math.min(added, 40));
    ctx.fillStyle = '#64748b'; ctx.fillRect(fl.cx - 3, 80, 6, 14);
    UI.text(ctx, 'burette: NaOH(aq)', fl.cx + 20, 30, { size: 12, color: UI.C.dim, align: 'left' });
    UI.text(ctx, `volume added: ${(added * 0.5).toFixed(1)} cm³`, fl.cx + 20, 50, { size: 12, color: UI.C.dim, align: 'left' });
    for (const d of drops) UI.circle(ctx, fl.cx, d.y, 4, '#93c5fd');
    // flask
    const col = indicatorColour(ind, p);
    ctx.beginPath();
    ctx.moveTo(fl.cx - fl.neckW / 2, fl.top); ctx.lineTo(fl.cx - fl.neckW / 2, fl.top + 50);
    ctx.lineTo(fl.cx - fl.baseW / 2, fl.bot); ctx.lineTo(fl.cx + fl.baseW / 2, fl.bot);
    ctx.lineTo(fl.cx + fl.neckW / 2, fl.top + 50); ctx.lineTo(fl.cx + fl.neckW / 2, fl.top);
    ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 3; ctx.stroke();
    ctx.save(); ctx.clip();
    ctx.fillStyle = col + 'aa'; ctx.fillRect(0, fl.top + 60, W, fl.bot);
    ctx.restore();
    for (const io of ions) {
      const c = { 'H⁺': '#fecaca', 'Cl⁻': '#d9f99d', 'OH⁻': '#bfdbfe', 'Na⁺': '#e9d5ff', 'H₂O': '#ffffff' }[io.t];
      ctx.globalAlpha = io.t === 'H₂O' ? Math.min(1, io.life) : 1;
      UI.circle(ctx, io.x, io.y, io.t === 'H₂O' ? 11 : 9, '#0b1220cc', c, 1.5);
      UI.text(ctx, io.t, io.x, io.y, { size: 8, color: c });
      ctx.globalAlpha = 1;
    }
    UI.text(ctx, 'HCl(aq) + indicator', fl.cx, fl.bot + 18, { size: 12, color: UI.C.dim });
    // pH scale
    const sx = 40, sy = 120, sw = 22, sh = 250;
    for (let i = 0; i <= 140; i++) { ctx.fillStyle = indicatorColour('universal', i / 10); ctx.fillRect(sx, sy + sh - (i / 140) * sh, sw, sh / 140 + 1); }
    for (const v of [0, 7, 14]) UI.text(ctx, String(v), sx + sw + 10, sy + sh - (v / 14) * sh, { size: 11, align: 'left' });
    const my = sy + sh - (p / 14) * sh;
    UI.arrow(ctx, sx - 18, my, sx - 2, my, UI.C.text);
    UI.text(ctx, 'pH', sx + sw / 2, sy - 14, { size: 12 });
    // meter
    UI.roundRect(ctx, 580, 140, 150, 90, 10, '#111a2e', UI.C.line);
    UI.text(ctx, 'pH ' + p.toFixed(1), 655, 175, { size: 26, color: col });
    UI.text(ctx, p < 6.5 ? 'acidic (H⁺ in excess)' : p > 7.5 ? 'alkaline (OH⁻ in excess)' : 'neutral — end-point!', 655, 210, { size: 12, color: UI.C.dim });
    UI.text(ctx, 'H⁺(aq) + OH⁻(aq) → H₂O(l)', 655, 270, { size: 14, color: UI.C.green });
    UI.text(ctx, 'Na⁺ and Cl⁻ stay in solution', 655, 292, { size: 11, color: UI.C.dim });
    UI.text(ctx, '(spectator ions → NaCl salt)', 655, 308, { size: 11, color: UI.C.dim });
  });
};
