'use strict';
// Extra detail and worked examples for every syllabus point, added to the topics in content.js.

const ex = (title, q, work) => `<div class="example"><b>Example — ${title}</b><div>${q}</div>${work ? `<div class="work">${work}</div>` : ''}</div>`;
const link = (hash, txt) => `<a class="btn ghost" href="#${hash}">${txt}</a>`;

// ---------- extra interactives ----------
Anims.heatingcurve = function (host) {
  const W = 780, H = 360;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  let cooling = false, p = 0, playing = true;
  UI.select(bar, 'Curve', [['heat', 'Heating curve (ice → steam)'], ['cool', 'Cooling curve (steam → ice)']], (v) => { cooling = v === 'cool'; p = 0; });
  UI.button(bar, '↻ Replay', () => { p = 0; playing = true; });
  // time fractions and temperatures for the heating curve
  const PTS = [[0, -30], [0.12, 0], [0.32, 0], [0.5, 100], [0.85, 100], [1, 130]];
  const LAB = [['solid heats up', 'solid'], ['MELTING: solid + liquid, temperature constant', 'melting'], ['liquid heats up', 'liquid'], ['BOILING: liquid + gas, temperature constant', 'boiling'], ['gas heats up', 'gas']];
  const g = { x: 70, y: 30, w: 460, h: 280 };
  const X = (f) => g.x + f * g.w, Y = (T) => g.y + g.h - ((T + 40) / 180) * g.h;
  function seg(f) { for (let i = 0; i < PTS.length - 1; i++) if (f <= PTS[i + 1][0]) return i; return PTS.length - 2; }
  function tempAt(f) { const i = seg(f), [f0, T0] = PTS[i], [f1, T1] = PTS[i + 1]; return T0 + (T1 - T0) * ((f - f0) / (f1 - f0 || 1)); }
  const parts = Array.from({ length: 30 }, (_, i) => ({ lx: (i % 6), ly: Math.floor(i / 6), x: 0, y: 0, vx: UI.rand(-1, 1), vy: UI.rand(-1, 1) }));
  return UI.loop((dt, t) => {
    if (playing) p = Math.min(1, p + dt / 10);
    const f = cooling ? 1 - p : p, T = tempAt(f), si = seg(f);
    UI.clear(ctx, W, H);
    UI.arrow(ctx, g.x, g.y + g.h, g.x, g.y - 10, UI.C.dim); UI.arrow(ctx, g.x, g.y + g.h, g.x + g.w + 10, g.y + g.h, UI.C.dim);
    UI.text(ctx, 'temperature / °C', g.x - 8, g.y - 16, { size: 11, color: UI.C.dim, align: 'left' });
    UI.text(ctx, 'time (heat supplied at a steady rate)', g.x + g.w / 2, g.y + g.h + 18, { size: 11, color: UI.C.dim });
    for (const T0 of [0, 100]) { UI.line(ctx, g.x - 4, Y(T0), g.x + g.w, Y(T0), '#334155', 1, [4, 4]); UI.text(ctx, String(T0), g.x - 10, Y(T0), { size: 11, align: 'right' }); }
    ctx.strokeStyle = UI.C.accent; ctx.lineWidth = 3; ctx.beginPath();
    PTS.forEach(([fx, T0], i) => { const x = X(cooling ? 1 - fx : fx); i ? ctx.lineTo(x, Y(T0)) : ctx.moveTo(x, Y(T0)); });
    ctx.stroke();
    UI.circle(ctx, X(cooling ? 1 - f : f), Y(T), 7, UI.C.dot);
    // labels on flat parts
    UI.text(ctx, cooling ? 'freezing' : 'melting', X(cooling ? 1 - 0.22 : 0.22), Y(0) - 14, { size: 12, color: UI.C.dot });
    UI.text(ctx, cooling ? 'condensing' : 'boiling', X(cooling ? 1 - 0.675 : 0.675), Y(100) - 14, { size: 12, color: UI.C.dot });
    // particle box
    const bx = 580, by = 60, bw = 170, bh = 170;
    UI.roundRect(ctx, bx, by, bw, bh, 8, '#0f1a30', UI.C.line, 2);
    const state = si === 0 ? 'solid' : si === 2 ? 'liquid' : si === 4 ? 'gas' : si === 1 ? 'sl' : 'lg';
    parts.forEach((q, i) => {
      let tx, ty;
      const isLiquid = state === 'liquid' || (state === 'sl' && i % 2) || (state === 'lg' && i % 3);
      const isGas = state === 'gas' || (state === 'lg' && !(i % 3));
      if (isGas) { q.x += q.vx * 90 * dt; q.y += q.vy * 90 * dt; if (q.x < 8 || q.x > bw - 8) q.vx *= -1; if (q.y < 8 || q.y > bh - 8) q.vy *= -1; q.x = UI.clamp(q.x, 8, bw - 8); q.y = UI.clamp(q.y, 8, bh - 8); }
      else if (isLiquid) { tx = 18 + (i % 7) * 21 + Math.sin(t * 2 + i) * 6; ty = bh - 12 - Math.floor(i / 7) * 18 + Math.cos(t * 2.3 + i) * 4; q.x += (tx - q.x) * 0.1; q.y += (ty - q.y) * 0.1; }
      else { tx = 30 + q.lx * 22 + UI.rand(-1, 1); ty = bh - 14 - q.ly * 22 + UI.rand(-1, 1); q.x += (tx - q.x) * 0.2; q.y += (ty - q.y) * 0.2; }
      UI.circle(ctx, bx + q.x, by + q.y, 7, '#60a5fa');
    });
    UI.text(ctx, `${T.toFixed(0)} °C`, bx + bw / 2, by - 16, { size: 16 });
    const L = LAB[si];
    UI.text(ctx, cooling ? L[0].replace('heats up', 'cools down').replace('MELTING: solid + liquid', 'FREEZING: liquid + solid').replace('BOILING: liquid + gas', 'CONDENSING: gas + liquid') : L[0], bx + bw / 2, by + bh + 22, { size: 11.5, color: UI.C.text });
    info.innerHTML = cooling
      ? 'On a <b>cooling curve</b> the temperature falls, then stays <b>constant while the substance condenses</b> (gas → liquid) and again <b>while it freezes</b> (liquid → solid). Energy is given out as forces of attraction form between particles.'
      : 'On a <b>heating curve</b> the sloping parts are where one state is heating up (particles gain <b>kinetic energy</b>). The <b>flat parts</b> are changes of state: the energy supplied is used to <b>overcome the forces of attraction</b> between particles, so the temperature stays constant. Flat at 0 °C = <b>melting point</b>; flat at 100 °C = <b>boiling point</b>.';
  });
};

// Replace the small table with the full 118-element Periodic Table.
Anims.ptable = function (host) {
  let sel = EL.Na;
  const wrap = UI.el('div', { class: 'ptable-wrap' });
  host.append(wrap);
  const pt = PeriodicTable(wrap, { compact: true, onPick: (e) => { sel = e; pt.refresh(); show(); }, mark: (e) => (e === sel ? 'sel' : '') });
  const leg = UI.el('div', { class: 'legend' });
  for (const [lab, col] of Object.values(EL_CATS)) leg.append(UI.el('span', { style: `--c:${col}` }, lab));
  const d = UI.el('div', { class: 'anim-info' });
  host.append(leg, d);
  function show() {
    const e = sel;
    d.innerHTML = `<b class="big">${e.sym}</b> <b>${e.name}</b> — proton number ${e.z}${e.mass ? ', A<sub>r</sub> ' + e.mass : ''} • ${e.frow ? (e.period === 6 ? 'lanthanide' : 'actinide') : 'Group ' + (ROMAN_G[e.group] || e.group)}, period ${e.period} • ${EL_CATS[e.cat][0]} • ${e.state} at r.t.p. • shells ${elementShells(e.z).join(',')}<br>${EL_FACTS[e.sym] || ''} <a href="#ptable">Open the full Periodic Table page →</a>`;
  }
  show();
  return () => {};
};

// ---------- extra sections per topic ----------
const EXTRA = {
  states: {
    after: [
      [1, { h: 'Heating and cooling curves', html: `${anim('heatingcurve', 'Heating and cooling curve of water')}
        <p>${EXT} When a pure substance is heated at a steady rate, the temperature rises, then <b>stays constant</b> during melting and boiling. Read the <b>melting point</b> and <b>boiling point</b> from the flat sections.</p>
        <div class="key"><b>Evaporation vs boiling:</b> evaporation happens at <b>any temperature</b>, only at the <b>surface</b> — the most energetic particles escape. Boiling happens at <b>the boiling point</b>, <b>throughout</b> the liquid (bubbles form inside).</div>` }],
    ],
    end: [
      { h: 'Worked examples', html: `
        ${ex('Predict the state', 'Substance X melts at −7 °C and boils at 59 °C. What is its state at 25 °C (room temperature)?', '25 °C is <b>above</b> the melting point but <b>below</b> the boiling point → it is a <b>liquid</b>. (X is bromine.)')}
        <table class="tbl"><tr><th>Substance</th><th>Melting point / °C</th><th>Boiling point / °C</th><th>State at 25 °C</th><th>Why</th></tr>
        <tr><td>oxygen</td><td>−218</td><td>−183</td><td>gas</td><td>25 is above the boiling point</td></tr>
        <tr><td>ethanol</td><td>−114</td><td>78</td><td>liquid</td><td>between m.p. and b.p.</td></tr>
        <tr><td>sodium chloride</td><td>801</td><td>1413</td><td>solid</td><td>25 is below the melting point</td></tr>
        <tr><td>mercury</td><td>−39</td><td>357</td><td>liquid</td><td>between m.p. and b.p.</td></tr>
        <tr><td>iodine</td><td>114</td><td>184</td><td>solid</td><td>below the melting point</td></tr></table>
        ${ex('Gas volume', 'A sealed syringe of gas is placed in hot water. What happens to the plunger? Explain.', 'The plunger moves <b>out</b>. The particles gain kinetic energy, move <b>faster</b> and hit the walls <b>harder and more often</b>, so the gas <b>expands</b> to keep the pressure the same.')}
        ${ex('Pressure', 'The plunger of a sealed syringe of air is pushed in. What happens to the pressure?', 'The volume decreases, particles are <b>closer together</b> and hit the walls <b>more often</b>, so the <b>pressure increases</b>.')}
        ${ex('Diffusion rate', 'Which diffuses faster, carbon dioxide (Mᵣ 44) or nitrogen (Mᵣ 28)?', '<b>Nitrogen</b> — lower Mᵣ, so at the same temperature its molecules move faster.')}
        ${ex('Diffusion in liquids', 'A drop of ink in still water spreads out slowly; in hot water it spreads faster. Why?', 'Particles in hot water have more kinetic energy and move faster, so diffusion is faster. Diffusion in gases is faster than in liquids because gas particles move faster and are further apart.')}` },
    ],
    quiz: [
      { q: 'Which statement describes evaporation but NOT boiling?', o: ['Happens throughout the liquid', 'Happens only at a fixed temperature', 'Happens at the surface at any temperature', 'Produces bubbles inside the liquid'], a: 2, e: 'Evaporation: surface only, any temperature. Boiling: throughout the liquid, at the boiling point.' },
      { q: 'On a heating curve, what is happening during a flat section?', o: ['The substance is cooling', 'A change of state — energy overcomes forces between particles', 'Particles are speeding up', 'The heater is switched off'], a: 1, e: 'The temperature stays constant while energy is used to overcome the forces of attraction between particles.' },
      { q: 'A substance has m.p. 44 °C and b.p. 280 °C. Its state at 25 °C is…', o: ['solid', 'liquid', 'gas', 'cannot tell'], a: 0, e: '25 °C is below the melting point (44 °C), so it is a solid. (This is phosphorus.)' },
    ],
  },
  atoms: {
    start: [{ h: 'Start here: journey into an atom', html: `${anim('journey', 'Zoom into a copper atom and take it apart')}` }],
    end: [
      { h: 'Electronic configurations of elements 1–20', html: `<table class="tbl"><tr><th>Z</th><th>Element</th><th>Config.</th><th>Z</th><th>Element</th><th>Config.</th></tr>
        ${Array.from({ length: 10 }, (_, i) => { const a = ELEMENTS[i], b = ELEMENTS[i + 10]; return `<tr><td>${a.z}</td><td>${a.name} (${a.sym})</td><td><b>${UI.shells(a.z).join(',')}</b></td><td>${b.z}</td><td>${b.name} (${b.sym})</td><td><b>${UI.shells(b.z).join(',')}</b></td></tr>`; }).join('')}</table>
        <p class="dim">Ions: add electrons for negative ions, remove for positive ions. Na<sup>+</sup> = 2,8; Cl<sup>−</sup> = 2,8,8; O<sup>2−</sup> = 2,8; Ca<sup>2+</sup> = 2,8,8; Al<sup>3+</sup> = 2,8.</p>` },
      { h: 'Worked examples', html: `
        <table class="tbl"><tr><th>Symbol</th><th>Protons</th><th>Neutrons</th><th>Electrons</th><th>Working</th></tr>
        <tr><td><sup>12</sup><sub>6</sub>C</td><td>6</td><td>6</td><td>6</td><td>12 − 6 = 6</td></tr>
        <tr><td><sup>35</sup><sub>17</sub>Cl</td><td>17</td><td>18</td><td>17</td><td>35 − 17 = 18</td></tr>
        <tr><td><sup>37</sup><sub>17</sub>Cl</td><td>17</td><td>20</td><td>17</td><td>an isotope of chlorine-35</td></tr>
        <tr><td><sup>35</sup><sub>17</sub>Cl<sup>−</sup></td><td>17</td><td>18</td><td>18</td><td>gained 1 electron</td></tr>
        <tr><td><sup>24</sup><sub>12</sub>Mg<sup>2+</sup></td><td>12</td><td>12</td><td>10</td><td>lost 2 electrons</td></tr>
        <tr><td><sup>27</sup><sub>13</sub>Al<sup>3+</sup></td><td>13</td><td>14</td><td>10</td><td>lost 3 electrons</td></tr>
        <tr><td><sup>16</sup><sub>8</sub>O<sup>2−</sup></td><td>8</td><td>8</td><td>10</td><td>gained 2 electrons</td></tr>
        <tr><td><sup>39</sup><sub>19</sub>K<sup>+</sup></td><td>19</td><td>20</td><td>18</td><td>lost 1 electron</td></tr></table>
        ${ex('Identify the particle', 'A particle has 20 protons, 20 neutrons and 18 electrons. Identify it.', '20 protons → calcium. Two fewer electrons than protons → charge 2+. Mass number 20 + 20 = 40 → <b><sup>40</sup><sub>20</sub>Ca<sup>2+</sup></b>.')}
        ${ex('Relative atomic mass', 'Copper is 69% copper-63 and 31% copper-65. Calculate Aᵣ.', '(63 × 69 + 65 × 31) ÷ 100 = (4347 + 2015) ÷ 100 = <b>63.6</b>')}
        ${ex('Abundance from Aᵣ', 'Element X has isotopes ⁶⁹X and ⁷¹X and Aᵣ = 69.8. Find the % of ⁶⁹X.', 'Let ⁶⁹X = x%. 69x + 71(100 − x) = 6980 → 7100 − 2x = 6980 → x = <b>60%</b> (and 40% ⁷¹X).')}
        ${ex('Element, compound or mixture?', 'Classify: (a) copper, (b) sea water, (c) carbon dioxide, (d) air, (e) neon.', '(a) element (b) mixture (c) compound (d) mixture (e) element')}` },
    ],
    quiz: [
      { q: 'How many neutrons are in ⁴⁰₁₈Ar?', o: ['18', '22', '40', '58'], a: 1, e: '40 − 18 = 22 neutrons.' },
      { q: 'Which ion has the configuration 2,8,8?', o: ['Na⁺', 'Mg²⁺', 'Cl⁻', 'F⁻'], a: 2, e: 'Cl (2,8,7) gains 1 electron → Cl⁻ 2,8,8. Na⁺, Mg²⁺ and F⁻ are all 2,8.' },
      { q: 'Why do isotopes of chlorine react in the same way?', o: ['Same mass', 'Same number of neutrons', 'Same number of electrons in the outer shell', 'Same density'], a: 2, e: 'Chemical properties depend on electrons; isotopes have the same electronic configuration.' },
      { q: 'Which particle is found outside the nucleus?', o: ['proton', 'neutron', 'electron', 'none'], a: 2, e: 'Electrons are in shells around the nucleus.' },
    ],
  },
  ionic: {
    after: [[1, { h: 'Bond any two elements yourself', html: `<p>Use the <b>Bond Lab</b> to click any metal and non-metal on the Periodic Table and watch the ionic bond form, with the formula, name and balanced equation worked out step by step.</p>${link('bondlab/Na', '⚛ Open the Bond Lab')} ${link('ions', '🧩 Compound ions: sulfate, nitrate, ammonium…')}` }]],
    end: [
      { h: 'How to draw a dot-and-cross diagram for an ionic compound', html: `<ol><li>Write the electronic configuration of each atom.</li><li>Decide how many electrons the metal loses and the non-metal gains.</li><li>Draw each <b>ion</b> with its shells (often only the outer shell), using <b>dots</b> for one atom's electrons and <b>crosses</b> for the other's.</li><li>Put each ion in <b>square brackets</b> with the <b>charge at the top right</b>.</li><li>Draw the right <b>number</b> of each ion so the charges cancel (e.g. two Cl<sup>−</sup> for one Mg<sup>2+</sup>).</li></ol>` },
      { h: 'Worked examples — 12 ionic compounds', html: `<table class="tbl"><tr><th>Metal</th><th>Non-metal</th><th>Electrons transferred</th><th>Ions</th><th>Formula</th><th>Name</th></tr>
        <tr><td>Na 2,8,1</td><td>Cl 2,8,7</td><td>1 from Na</td><td>Na⁺, Cl⁻</td><td>NaCl</td><td>sodium chloride</td></tr>
        <tr><td>K 2,8,8,1</td><td>Br</td><td>1 from K</td><td>K⁺, Br⁻</td><td>KBr</td><td>potassium bromide</td></tr>
        <tr><td>Li 2,1</td><td>F 2,7</td><td>1 from Li</td><td>Li⁺, F⁻</td><td>LiF</td><td>lithium fluoride</td></tr>
        <tr><td>Mg 2,8,2</td><td>O 2,6</td><td>2 from Mg</td><td>Mg²⁺, O²⁻</td><td>MgO</td><td>magnesium oxide</td></tr>
        <tr><td>Ca 2,8,8,2</td><td>S 2,8,6</td><td>2 from Ca</td><td>Ca²⁺, S²⁻</td><td>CaS</td><td>calcium sulfide</td></tr>
        <tr><td>Mg 2,8,2</td><td>Cl 2,8,7</td><td>1 to each of 2 Cl</td><td>Mg²⁺, 2Cl⁻</td><td>MgCl₂</td><td>magnesium chloride</td></tr>
        <tr><td>Ca</td><td>F</td><td>1 to each of 2 F</td><td>Ca²⁺, 2F⁻</td><td>CaF₂</td><td>calcium fluoride</td></tr>
        <tr><td>Na 2,8,1</td><td>O 2,6</td><td>1 from each of 2 Na</td><td>2Na⁺, O²⁻</td><td>Na₂O</td><td>sodium oxide</td></tr>
        <tr><td>K</td><td>S</td><td>1 from each of 2 K</td><td>2K⁺, S²⁻</td><td>K₂S</td><td>potassium sulfide</td></tr>
        <tr><td>Al 2,8,3</td><td>F 2,7</td><td>1 to each of 3 F</td><td>Al³⁺, 3F⁻</td><td>AlF₃</td><td>aluminium fluoride</td></tr>
        <tr><td>Al 2,8,3</td><td>O 2,6</td><td>2 Al give 6 to 3 O</td><td>2Al³⁺, 3O²⁻</td><td>Al₂O₃</td><td>aluminium oxide</td></tr>
        <tr><td>Mg 2,8,2</td><td>N 2,5</td><td>3 Mg give 6 to 2 N</td><td>3Mg²⁺, 2N³⁻</td><td>Mg₃N₂</td><td>magnesium nitride</td></tr></table>
        ${ex('Formula from charges', 'What is the formula of the compound of Al³⁺ and SO₄²⁻?', 'Swap and drop: Al₂(SO₄)₃. Check: 2 × (+3) = +6 and 3 × (−2) = −6 ✔. Brackets go round the sulfate because there is more than one.')}
        ${ex('Formula from a lattice diagram', 'A diagram of a lattice shows 8 black spheres (X) and 16 white spheres (Y). What is the formula?', 'Ratio X : Y = 8 : 16 = 1 : 2 → <b>XY₂</b>.')}
        ${ex('Explain a property', 'Explain why potassium chloride conducts electricity when dissolved in water but not as a solid.', 'Solid: the ions are held in fixed positions in the lattice and cannot move. Dissolved: the ions are <b>free to move</b> and carry the charge through the solution.')}` },
    ],
    quiz: [
      { q: 'What is the formula of aluminium oxide?', o: ['AlO', 'Al₂O', 'AlO₃', 'Al₂O₃'], a: 3, e: 'Al³⁺ and O²⁻: 2 × (+3) + 3 × (−2) = 0 → Al₂O₃.' },
      { q: 'What is the formula of ammonium sulfate?', o: ['NH₄SO₄', '(NH₄)₂SO₄', 'NH₄(SO₄)₂', '(NH₄)₃SO₄'], a: 1, e: 'NH₄⁺ and SO₄²⁻: two ammonium ions balance one sulfate → (NH₄)₂SO₄.' },
      { q: 'How many electrons does each nitrogen atom gain when Li₃N forms?', o: ['1', '2', '3', '5'], a: 2, e: 'N (2,5) gains 3 electrons → N³⁻ (2,8).' },
      { q: 'Why are ionic compounds brittle?', o: ['Weak bonds', 'A blow lines up ions of the same charge, which repel', 'Electrons are delocalised', 'They contain molecules'], a: 1, e: 'When the layers shift, like charges come next to each other and repel, so the crystal splits.' },
    ],
  },
  covalent: {
    after: [[0, { h: 'Bond any two non-metals yourself', html: `<p>Pick any two non-metals in the <b>Bond Lab</b> — e.g. C + O, N + H, P + Cl — and watch the shared pairs form.</p>${link('bondlab/C', '⚛ Open the Bond Lab')}` }]],
    end: [
      { h: 'How to draw a dot-and-cross diagram for a molecule', html: `<ol><li>Work out how many electrons each atom needs: H needs 1; others need 8 − (outer electrons).</li><li>Put the atom that needs the most electrons in the middle.</li><li>Draw overlapping circles (outer shells only) — each overlap contains the <b>shared pair(s)</b>: one dot + one cross per bond.</li><li>Add the remaining outer electrons as <b>lone pairs</b>.</li><li>Check: H has 2 electrons, every other atom has 8.</li></ol>` },
      { h: 'Worked examples — every molecule you need', html: `<table class="tbl"><tr><th>Molecule</th><th>Bonds</th><th>Shared pairs</th><th>Lone pairs</th><th>Displayed formula</th></tr>
        <tr><td>H₂ hydrogen</td><td>1 single</td><td>1</td><td>0</td><td>H–H</td></tr>
        <tr><td>Cl₂ chlorine</td><td>1 single</td><td>1</td><td>3 on each Cl</td><td>Cl–Cl</td></tr>
        <tr><td>HCl hydrogen chloride</td><td>1 single</td><td>1</td><td>3 on Cl</td><td>H–Cl</td></tr>
        <tr><td>H₂O water</td><td>2 single</td><td>2</td><td>2 on O</td><td>H–O–H</td></tr>
        <tr><td>NH₃ ammonia</td><td>3 single</td><td>3</td><td>1 on N</td><td>N with 3 H</td></tr>
        <tr><td>CH₄ methane</td><td>4 single</td><td>4</td><td>0</td><td>C with 4 H</td></tr>
        <tr><td>${EXT} O₂ oxygen</td><td>1 double</td><td>2</td><td>2 on each O</td><td>O=O</td></tr>
        <tr><td>${EXT} N₂ nitrogen</td><td>1 triple</td><td>3</td><td>1 on each N</td><td>N≡N</td></tr>
        <tr><td>${EXT} CO₂ carbon dioxide</td><td>2 double</td><td>4</td><td>2 on each O</td><td>O=C=O</td></tr>
        <tr><td>${EXT} C₂H₄ ethene</td><td>1 double + 4 single</td><td>6</td><td>0</td><td>H₂C=CH₂</td></tr>
        <tr><td>${EXT} CH₃OH methanol</td><td>5 single</td><td>5</td><td>2 on O</td><td>H₃C–O–H</td></tr></table>
        <p>More examples (same rules): CCl₄ (4 single), PCl₃ (3 single + 1 lone pair on P), H₂S (like water), SiH₄ (like methane), C₂H₆ ethane (7 single bonds).</p>
        ${ex('Explain', 'Methane has a boiling point of −162 °C. Explain why it is so low.', 'Methane is a simple molecular substance. Only <b>weak forces between molecules</b> must be overcome to boil it — the strong C–H covalent bonds do <b>not</b> break.')}
        ${ex('Compare', 'Why is diamond used in drill tips but graphite used in pencils and as a lubricant?', 'Diamond: every C forms 4 strong covalent bonds in a rigid 3D network → extremely hard. Graphite: layers held by weak forces slide over each other → soft and slippery.')}
        ${ex('Electrodes', 'Why is graphite used for electrodes?', 'Each C has one <b>delocalised electron</b> that can move along the layers, so graphite conducts electricity; it also has a very high melting point and is unreactive.')}` },
    ],
    quiz: [
      { q: 'How many lone pairs are on the nitrogen atom in ammonia?', o: ['0', '1', '2', '3'], a: 1, e: 'N has 5 outer electrons; 3 are used in N–H bonds, leaving 2 electrons = 1 lone pair.' },
      { q: 'How many electrons in total are shared in a molecule of CO₂?', o: ['2', '4', '6', '8'], a: 3, e: 'Two double bonds = 4 shared pairs = 8 electrons.' },
      { q: 'Which is NOT a property of silicon(IV) oxide?', o: ['Very high melting point', 'Hard', 'Conducts electricity', 'Giant covalent structure'], a: 2, e: 'SiO₂, like diamond, has no free electrons or ions, so it does not conduct.' },
    ],
  },
  metallic: {
    end: [{ h: 'Worked examples', html: `
      ${ex('Explain conductivity', 'Explain why copper conducts electricity.', 'Copper has a giant lattice of positive ions in a sea of <b>delocalised electrons</b>. The delocalised electrons can <b>move through the structure</b> and carry the current.')}
      ${ex('Explain malleability', 'Explain why gold can be beaten into thin sheets.', 'The <b>layers of positive ions can slide</b> over each other; the delocalised electrons still hold the ions together, so the metal changes shape without breaking.')}
      ${ex('Identify an alloy from a diagram', 'Diagram A shows identical circles in regular rows; diagram B shows the same rows with a few larger circles mixed in. Which is the alloy?', '<b>B</b> — the larger atoms of a different element distort the layers.')}
      ${ex('Choose a metal', 'Suggest why aluminium, not iron, is used for overhead power cables.', 'Aluminium has a <b>low density</b> (lighter, so fewer pylons) and is a <b>good electrical conductor</b>; it also <b>resists corrosion</b>.')}
      <table class="tbl"><tr><th>Alloy</th><th>Made of</th><th>Useful property</th><th>Use</th></tr>
      <tr><td>Brass</td><td>copper + zinc</td><td>harder than copper, does not corrode</td><td>musical instruments, door handles, electrical plugs</td></tr>
      <tr><td>Stainless steel</td><td>iron + chromium, nickel, carbon</td><td>hard, resists rusting</td><td>cutlery, sinks, surgical tools</td></tr></table>`,
    }],
  },
  stoich: {
    end: [
      { h: 'Word, symbol and ionic equations', html: `
        ${ex('Word → symbol equation', 'Magnesium reacts with hydrochloric acid to make magnesium chloride and hydrogen.', 'magnesium + hydrochloric acid → magnesium chloride + hydrogen<br><b>Mg(s) + 2HCl(aq) → MgCl₂(aq) + H₂(g)</b>')}
        ${ex('Combustion', 'Write the balanced equation for propane burning completely.', '<b>C₃H₈(g) + 5O₂(g) → 3CO₂(g) + 4H₂O(l)</b>')}
        ${ex('Thermal decomposition', 'Copper(II) carbonate decomposes on heating.', '<b>CuCO₃(s) → CuO(s) + CO₂(g)</b> (green solid → black solid)')}
        ${ex(`Ionic equation ${EXT}`, 'Aqueous silver nitrate is added to sodium chloride solution.', 'Full: AgNO₃(aq) + NaCl(aq) → AgCl(s) + NaNO₃(aq).<br>Na⁺ and NO₃⁻ are <b>spectator ions</b> (unchanged), so the ionic equation is <b>Ag⁺(aq) + Cl⁻(aq) → AgCl(s)</b>.')}
        ${ex(`Ionic equation ${EXT}`, 'Zinc is added to copper(II) sulfate solution.', '<b>Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s)</b> — sulfate is a spectator ion.')}
        ${ex(`Deduce an equation ${EXT}`, 'Calcium reacts with water to form calcium hydroxide and hydrogen.', '<b>Ca(s) + 2H₂O(l) → Ca(OH)₂(aq) + H₂(g)</b>')}` },
      { h: 'Reacting masses in simple proportion (Core)', html: `
        ${ex('Scale up', '12 g of carbon burns to make 44 g of carbon dioxide. What mass of CO₂ is made from 3 g of carbon?', '3 g is 12 ÷ 4, so CO₂ = 44 ÷ 4 = <b>11 g</b>.')}
        ${ex('Using Mᵣ', 'In 2Mg + O₂ → 2MgO, what mass of MgO is made from 48 g of Mg? (Mg = 24, O = 16)', '2 × 24 = 48 g Mg makes 2 × 40 = 80 g MgO → <b>80 g</b>.')}` },
      { h: `Mole calculations ${EXT}`, html: `
        ${ex('Mass → moles', 'How many moles in 11 g of CO₂?', 'Mᵣ = 12 + 2 × 16 = 44. n = 11 ÷ 44 = <b>0.25 mol</b>')}
        ${ex('Moles → mass', 'What is the mass of 0.2 mol of NaOH?', 'Mᵣ = 23 + 16 + 1 = 40. m = 0.2 × 40 = <b>8.0 g</b>')}
        ${ex('Number of particles', 'How many molecules are in 0.5 mol of water?', '0.5 × 6.02 × 10²³ = <b>3.01 × 10²³</b> molecules')}
        ${ex('Gas volume', 'What volume of hydrogen at r.t.p. is made when 0.6 g of Mg reacts with excess acid? Mg + 2HCl → MgCl₂ + H₂', 'n(Mg) = 0.6 ÷ 24 = 0.025 mol → 0.025 mol H₂ → 0.025 × 24 = <b>0.6 dm³</b> (600 cm³)')}
        ${ex('Reacting masses', 'What mass of iron is made from 320 g of Fe₂O₃? Fe₂O₃ + 3CO → 2Fe + 3CO₂', 'Mᵣ Fe₂O₃ = 160 → n = 2 mol → 2 × 2 = 4 mol Fe → 4 × 56 = <b>224 g</b>')}
        ${ex('Limiting reactant', '4.8 g of Mg reacts with 0.10 mol of HCl. Which is in excess? Mg + 2HCl → MgCl₂ + H₂', 'n(Mg) = 4.8 ÷ 24 = 0.20 mol. 0.20 mol Mg would need 0.40 mol HCl but only 0.10 mol is present → <b>HCl is limiting</b>, Mg is in excess. H₂ made = 0.10 ÷ 2 = 0.05 mol.')}
        ${ex('Concentration', '4.0 g of NaOH is dissolved to make 250 cm³ of solution. Find the concentration in mol/dm³ and g/dm³.', 'n = 4.0 ÷ 40 = 0.10 mol; V = 0.250 dm³ → <b>0.40 mol/dm³</b>. In g/dm³: 4.0 ÷ 0.250 = <b>16 g/dm³</b>.')}
        ${ex('Titration', '25.0 cm³ of NaOH is neutralised by 20.0 cm³ of 0.100 mol/dm³ HCl. Find the concentration of NaOH. NaOH + HCl → NaCl + H₂O', 'n(HCl) = 0.100 × 0.0200 = 0.00200 mol → 1 : 1 → 0.00200 mol NaOH → c = 0.00200 ÷ 0.0250 = <b>0.0800 mol/dm³</b>')}
        ${ex('Titration with 1 : 2 ratio', '25.0 cm³ of 0.100 mol/dm³ Na₂CO₃ reacts with 20.0 cm³ of HCl. Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂. Find [HCl].', 'n(Na₂CO₃) = 0.00250 mol → n(HCl) = 0.00500 mol → c = 0.00500 ÷ 0.0200 = <b>0.250 mol/dm³</b>')}
        ${ex('Empirical formula', 'A compound contains 2.4 g C and 0.6 g H. Find its empirical formula. Its Mᵣ is 30 — find the molecular formula.', 'C: 2.4 ÷ 12 = 0.2; H: 0.6 ÷ 1 = 0.6 → ratio 1 : 3 → <b>CH₃</b>. Mᵣ(CH₃) = 15; 30 ÷ 15 = 2 → <b>C₂H₆</b>.')}
        ${ex('Empirical formula from %', 'An oxide of iron is 70% Fe by mass. Find its formula.', 'Fe: 70 ÷ 56 = 1.25; O: 30 ÷ 16 = 1.875 → ÷1.25 → 1 : 1.5 = 2 : 3 → <b>Fe₂O₃</b>')}
        ${ex('% composition', 'What is the percentage by mass of nitrogen in NH₄NO₃?', 'Mᵣ = 80; N = 2 × 14 = 28 → 28 ÷ 80 × 100 = <b>35%</b>')}
        ${ex('% yield', 'Theoretical yield of a salt = 12.0 g; actual = 9.6 g.', '9.6 ÷ 12.0 × 100 = <b>80%</b>')}
        ${ex('% purity', 'A 5.0 g sample of impure limestone contains 4.5 g CaCO₃.', '4.5 ÷ 5.0 × 100 = <b>90%</b> pure')}` },
    ],
    quiz: [
      { q: 'What volume of CO₂ at r.t.p. is produced from 0.5 mol of CaCO₃? (CaCO₃ → CaO + CO₂)', o: ['6 dm³', '12 dm³', '24 dm³', '48 dm³'], a: 1, e: '1 : 1 ratio → 0.5 mol CO₂ × 24 = 12 dm³.' },
      { q: 'What is the ionic equation for neutralisation?', o: ['Na⁺ + Cl⁻ → NaCl', 'H⁺ + OH⁻ → H₂O', 'H₂ + O₂ → H₂O', 'Na + Cl → NaCl'], a: 1, e: 'H⁺(aq) + OH⁻(aq) → H₂O(l). The other ions are spectators.' },
      { q: 'How many atoms are in one formula unit of Ca(OH)₂?', o: ['3', '4', '5', '6'], a: 2, e: '1 Ca + 2 O + 2 H = 5 atoms.' },
      { q: '200 cm³ of solution contains 0.10 mol of solute. What is the concentration?', o: ['0.02 mol/dm³', '0.5 mol/dm³', '2 mol/dm³', '20 mol/dm³'], a: 1, e: '200 cm³ = 0.200 dm³; 0.10 ÷ 0.200 = 0.50 mol/dm³.' },
    ],
  },
  electro: {
    end: [{ h: 'Worked examples — predict the products', html: `
      <table class="tbl"><tr><th>Electrolyte</th><th>Cathode (−)</th><th>Anode (+)</th><th>Reason</th></tr>
      <tr><td>molten potassium bromide, KBr</td><td>potassium</td><td>bromine</td><td>molten binary compound: metal at −, non-metal at +</td></tr>
      <tr><td>molten zinc chloride, ZnCl₂</td><td>zinc</td><td>chlorine</td><td>molten binary compound</td></tr>
      <tr><td>molten sodium iodide, NaI</td><td>sodium</td><td>iodine</td><td>molten binary compound</td></tr>
      <tr><td>molten aluminium oxide (in cryolite)</td><td>aluminium</td><td>oxygen (carbon anodes burn → CO₂)</td><td>extraction of aluminium</td></tr>
      <tr><td>${EXT} concentrated aqueous KCl</td><td>hydrogen</td><td>chlorine</td><td>K more reactive than H; Cl⁻ concentrated</td></tr>
      <tr><td>${EXT} dilute aqueous NaCl</td><td>hydrogen</td><td>oxygen</td><td>halide is dilute, so OH⁻ is discharged</td></tr>
      <tr><td>${EXT} aqueous copper(II) chloride</td><td>copper</td><td>chlorine</td><td>Cu less reactive than H</td></tr>
      <tr><td>${EXT} aqueous potassium iodide</td><td>hydrogen</td><td>iodine</td><td>iodide discharged at the anode</td></tr>
      <tr><td>${EXT} aqueous silver nitrate</td><td>silver</td><td>oxygen</td><td>Ag less reactive than H; nitrate never discharged</td></tr></table>
      ${ex(`Half-equations ${EXT}`, 'Write the half-equations for the electrolysis of molten aluminium oxide.', 'Cathode: <b>Al³⁺ + 3e⁻ → Al</b> (reduction). Anode: <b>2O²⁻ → O₂ + 4e⁻</b> (oxidation).')}
      ${ex('Electroplating', 'Describe how to copper-plate an iron key.', 'Make the <b>key the cathode</b>, a <b>copper anode</b>, and use <b>copper(II) sulfate solution</b> as the electrolyte. Cu²⁺ ions are attracted to the key and gain electrons: Cu²⁺ + 2e⁻ → Cu. The copper anode dissolves: Cu → Cu²⁺ + 2e⁻.')}
      ${ex('Observations', 'What would you see during the electrolysis of molten lead(II) bromide?', 'Red-brown fumes/vapour (bromine) at the anode; a silvery bead of lead forms at the bottom near the cathode. The solid must be melted first — it does not conduct until molten.')}
      ${ex(`Fuel cell ${EXT}`, 'Give two advantages and two disadvantages of fuel cells compared with petrol engines.', 'Advantages: only water is produced (no CO₂, CO or NOₓ); more efficient. Disadvantages: hydrogen is a flammable gas that is difficult to store (high pressure); few refuelling stations; hydrogen is often made from fossil fuels.')}` }],
    quiz: [
      { q: 'What is formed at the anode when dilute aqueous sodium chloride is electrolysed?', o: ['Chlorine', 'Oxygen', 'Sodium', 'Hydrogen'], a: 1, e: 'With a dilute halide, OH⁻ ions are discharged → oxygen.' },
      { q: 'Which ion is never discharged at the anode in aqueous solution?', o: ['Cl⁻', 'OH⁻', 'SO₄²⁻', 'Br⁻'], a: 2, e: 'Sulfate (and nitrate) are not discharged; oxygen forms from OH⁻ instead.' },
      { q: 'Why do the carbon anodes in aluminium extraction need replacing?', o: ['They dissolve in cryolite', 'They react with oxygen to form CO₂', 'They melt', 'Aluminium coats them'], a: 1, e: 'Oxygen formed at the hot anodes reacts with carbon: C + O₂ → CO₂, so they burn away.' },
    ],
  },
  energy: {
    end: [{ h: 'Worked examples', html: `
      <table class="tbl"><tr><th>Exothermic (temperature rises)</th><th>Endothermic (temperature falls)</th></tr>
      <tr><td>combustion of fuels</td><td>thermal decomposition (e.g. CaCO₃ → CaO + CO₂)</td></tr>
      <tr><td>neutralisation (acid + alkali)</td><td>photosynthesis</td></tr>
      <tr><td>metal + acid, metal + water</td><td>dissolving ammonium nitrate in water</td></tr>
      <tr><td>respiration</td><td>citric acid + sodium hydrogencarbonate</td></tr></table>
      ${ex('From temperature data', 'The temperature of a solution changes from 21 °C to 15 °C during a reaction. Exothermic or endothermic?', 'The temperature <b>falls</b> → energy is taken in from the surroundings → <b>endothermic</b>, ΔH positive.')}
      ${ex(`Bond energies ${EXT}`, 'Calculate ΔH for CH₄ + 2O₂ → CO₂ + 2H₂O. (C–H 413, O=O 498, C=O 805, O–H 464 kJ/mol)', 'Break: 4 × 413 + 2 × 498 = 1652 + 996 = 2648. Make: 2 × 805 + 4 × 464 = 1610 + 1856 = 3466. ΔH = 2648 − 3466 = <b>−818 kJ/mol</b> (exothermic).')}
      ${ex(`Bond energies ${EXT}`, 'Calculate ΔH for 2H₂ + O₂ → 2H₂O. (H–H 436, O=O 498, O–H 464)', 'Break: 2 × 436 + 498 = 1370. Make: 4 × 464 = 1856. ΔH = 1370 − 1856 = <b>−486 kJ/mol</b>.')}
      ${ex(`Draw a pathway diagram ${EXT}`, 'Draw a reaction pathway diagram for an endothermic reaction.', 'Products line <b>higher</b> than reactants. A curve rises from reactants to a peak then down to products. Label <b>E<sub>a</sub></b> as the arrow from reactants up to the peak, and <b>ΔH</b> as the arrow from reactants up to products (positive).')}` }],
    quiz: [
      { q: 'Which process is endothermic?', o: ['Burning ethanol', 'Photosynthesis', 'Neutralisation', 'Respiration'], a: 1, e: 'Photosynthesis takes in energy from light.' },
      { q: 'On a pathway diagram for an exothermic reaction, the products are…', o: ['higher than the reactants', 'lower than the reactants', 'at the same level', 'above the activation energy peak'], a: 1, e: 'Energy is released, so products have less energy than reactants.' },
    ],
  },
  rates: {
    end: [{ h: 'Worked examples', html: `
      ${ex('Interpret a graph', 'Two experiments react the same mass of marble with acid. Curve A is steeper at the start than curve B, but both level off at the same volume of CO₂. Explain.', 'A is <b>faster</b> (steeper gradient = higher rate) — e.g. smaller marble pieces or hotter acid. The same final volume means the <b>same amount of limiting reactant</b> was used.')}
      ${ex('Rate from a graph', '60 cm³ of gas is collected in the first 30 s. Find the average rate.', '60 ÷ 30 = <b>2 cm³/s</b>')}
      ${ex('Why the curve levels off', 'Why does a gas-volume graph become horizontal?', 'One of the reactants has been <b>used up</b> — the reaction has stopped.')}
      ${ex(`Equilibrium ${EXT}`, 'N₂ + 3H₂ ⇌ 2NH₃ (forward reaction exothermic). Predict the effect on the yield of NH₃ of (a) raising the pressure, (b) raising the temperature, (c) adding a catalyst.', '(a) increases — equilibrium shifts to the side with <b>fewer gas molecules</b> (4 → 2). (b) decreases — equilibrium shifts in the <b>endothermic</b> (backward) direction. (c) no change — a catalyst only makes equilibrium reached <b>faster</b>.')}
      ${ex(`Why these conditions? ${EXT}`, 'Explain the conditions in the Haber process (450 °C, 200 atm, iron).', '<b>Temperature</b>: a lower temperature gives a higher yield but is too <b>slow</b>; 450 °C is a compromise between rate and yield. <b>Pressure</b>: higher pressure gives a higher yield and faster rate, but very high pressures are <b>expensive and dangerous</b>; 200 atm is a compromise. <b>Iron catalyst</b> increases the rate. Unreacted N₂ and H₂ are recycled.')}
      ${ex(`Contact process ${EXT}`, 'Why is only 2 atm used in the Contact process?', 'The equilibrium already gives a very high yield of SO₃ at low pressure, so the extra cost and danger of high pressure is not worth it. 450 °C and a vanadium(V) oxide catalyst give a good rate.')}
      ${ex(`Oxidation numbers ${EXT}`, 'Find the oxidation number of: (a) S in SO₄²⁻ (b) Fe in Fe₂O₃ (c) Mn in MnO₄⁻.', '(a) S + 4(−2) = −2 → S = <b>+6</b>. (b) 2Fe + 3(−2) = 0 → Fe = <b>+3</b> (iron(III)). (c) Mn + 4(−2) = −1 → Mn = <b>+7</b> (manganate(VII)).')}
      ${ex(`Redox ${EXT}`, 'In Fe₂O₃ + 3CO → 2Fe + 3CO₂, identify the oxidising agent and reducing agent.', 'Fe₂O₃ loses oxygen (Fe +3 → 0, reduced) → it is the <b>oxidising agent</b>. CO gains oxygen (C +2 → +4, oxidised) → it is the <b>reducing agent</b>.')}
      ${ex(`Redox in electrons ${EXT}`, 'Cl₂ + 2KI → 2KCl + I₂. Which species is oxidised?', 'I⁻ loses electrons (2I⁻ → I₂ + 2e⁻) → iodide is <b>oxidised</b>; Cl₂ gains electrons → reduced. Cl₂ is the oxidising agent.')}` }],
    quiz: [
      { q: 'What is the oxidation number of nitrogen in NO₃⁻?', o: ['+3', '+5', '−1', '+6'], a: 1, e: 'N + 3(−2) = −1 → N = +5.' },
      { q: 'In the reaction CuO + H₂ → Cu + H₂O, the reducing agent is…', o: ['CuO', 'H₂', 'Cu', 'H₂O'], a: 1, e: 'H₂ removes oxygen from CuO (it is oxidised), so it is the reducing agent.' },
      { q: 'Increasing the pressure in 2SO₂ + O₂ ⇌ 2SO₃ moves the equilibrium…', o: ['left', 'right', 'no change', 'it stops'], a: 1, e: '3 gas molecules → 2: higher pressure favours fewer gas molecules (the right).' },
      { q: 'What colour change shows a reducing agent with acidified potassium manganate(VII)?', o: ['colourless → purple', 'purple → colourless', 'orange → green', 'colourless → brown'], a: 1, e: 'Manganate(VII) is reduced: purple → colourless.' },
    ],
  },
  acids: {
    end: [
      { h: 'Indicators', html: `<table class="tbl"><tr><th>Indicator</th><th>In acid</th><th>In alkali</th></tr>
        <tr><td>litmus</td><td>red</td><td>blue</td></tr><tr><td>methyl orange</td><td>red</td><td>yellow</td></tr>
        <tr><td>thymolphthalein</td><td>colourless</td><td>blue</td></tr><tr><td>universal indicator</td><td>red/orange/yellow (pH 1–6)</td><td>blue/purple (pH 8–14); green at pH 7</td></tr></table>` },
      { h: 'Worked examples — reactions of acids', html: `
        ${ex('Acid + metal', 'Magnesium + sulfuric acid', 'Mg(s) + H₂SO₄(aq) → <b>MgSO₄</b>(aq) + H₂(g) — fizzing, the magnesium disappears.')}
        ${ex('Acid + base', 'Copper(II) oxide + hydrochloric acid', 'CuO(s) + 2HCl(aq) → <b>CuCl₂</b>(aq) + H₂O(l) — black solid dissolves, blue-green solution.')}
        ${ex('Acid + alkali', 'Potassium hydroxide + nitric acid', 'KOH(aq) + HNO₃(aq) → <b>KNO₃</b>(aq) + H₂O(l)')}
        ${ex('Acid + carbonate', 'Calcium carbonate + hydrochloric acid', 'CaCO₃(s) + 2HCl(aq) → <b>CaCl₂</b>(aq) + H₂O(l) + CO₂(g) — effervescence; gas turns limewater milky.')}
        ${ex('Base + ammonium salt', 'Calcium hydroxide + ammonium chloride (warm)', 'Ca(OH)₂ + 2NH₄Cl → CaCl₂ + 2H₂O + <b>2NH₃</b> — ammonia turns damp red litmus blue.')}` },
      { h: 'Worked examples — choosing how to make a salt', html: `
        <table class="tbl"><tr><th>Salt wanted</th><th>Soluble?</th><th>Method</th><th>Reactants</th></tr>
        <tr><td>copper(II) sulfate</td><td>yes</td><td>excess insoluble base</td><td>CuO + H₂SO₄</td></tr>
        <tr><td>zinc chloride</td><td>yes</td><td>excess metal</td><td>Zn + HCl</td></tr>
        <tr><td>magnesium nitrate</td><td>yes</td><td>excess insoluble carbonate</td><td>MgCO₃ + HNO₃</td></tr>
        <tr><td>sodium chloride</td><td>yes</td><td>titration (both reactants soluble)</td><td>NaOH + HCl</td></tr>
        <tr><td>potassium sulfate</td><td>yes</td><td>titration</td><td>KOH + H₂SO₄</td></tr>
        <tr><td>${EXT} barium sulfate</td><td>no</td><td>precipitation</td><td>BaCl₂(aq) + Na₂SO₄(aq)</td></tr>
        <tr><td>${EXT} silver chloride</td><td>no</td><td>precipitation</td><td>AgNO₃(aq) + NaCl(aq)</td></tr>
        <tr><td>${EXT} lead(II) iodide</td><td>no</td><td>precipitation</td><td>Pb(NO₃)₂(aq) + KI(aq)</td></tr></table>
        <p><b>Excess-solid method in full:</b> warm the acid → add the solid a little at a time until <b>no more dissolves</b> (excess) → <b>filter</b> to remove the excess → <b>heat the filtrate</b> to the crystallisation point (crystals form on a cold glass rod) → leave to <b>cool and crystallise</b> → filter, wash with a little cold water, <b>dry</b> between filter papers.</p>
        <p><b>Titration method:</b> find the exact volumes using an indicator, then repeat <b>without the indicator</b> and crystallise the solution.</p>
        <p>${EXT} <b>Precipitation:</b> mix the two solutions → filter → wash the precipitate with distilled water → dry.</p>
        ${link('ions', '🧩 Try the formula builder')}` },
    ],
    quiz: [
      { q: 'What colour is thymolphthalein in an acid?', o: ['Blue', 'Colourless', 'Red', 'Yellow'], a: 1, e: 'Thymolphthalein is colourless in acid and blue in alkali.' },
      { q: 'Which method would you use to make lead(II) iodide?', o: ['Excess metal', 'Titration', 'Precipitation', 'Excess carbonate'], a: 2, e: 'Lead(II) iodide is insoluble, so mix lead(II) nitrate and potassium iodide solutions.' },
      { q: 'What is the salt formed when nitric acid reacts with calcium carbonate?', o: ['Calcium nitrate', 'Calcium chloride', 'Calcium sulfate', 'Calcium nitrite'], a: 0, e: 'Nitric acid → nitrates: CaCO₃ + 2HNO₃ → Ca(NO₃)₂ + H₂O + CO₂.' },
      { q: 'Why can you NOT use excess solid to make sodium chloride from sodium hydroxide?', o: ['NaOH is insoluble', 'NaOH is soluble, so excess cannot be filtered off', 'NaCl is insoluble', 'It would explode'], a: 1, e: 'Both reactants are soluble, so a titration is needed to add exactly the right amount.' },
    ],
  },
  periodic: {
    end: [{ h: 'Worked examples — predicting and explaining', html: `
      ${ex('Predict (Group I)', 'Caesium is below potassium. Predict how it reacts with water.', 'Even more vigorously (explosively) than potassium, forming caesium hydroxide and hydrogen. Reactivity increases down the group because the outer electron is <b>further from the nucleus</b> and lost more easily.')}
      ${ex('Predict (Group VII)', 'Astatine is below iodine. Predict its state and reactivity.', 'A dark <b>solid</b> (melting points increase down the group) and <b>less reactive</b> than iodine.')}
      ${ex('Use data', 'Group I melting points: Li 181 °C, Na 98 °C, K 63 °C. Predict the melting point of rubidium.', 'The melting point decreases down the group, so about <b>40 °C</b> (actual 39 °C).')}
      <table class="tbl"><tr><th>Halogen added →<br>Halide solution ↓</th><th>chlorine</th><th>bromine</th><th>iodine</th></tr>
      <tr><td>potassium chloride</td><td>—</td><td>no reaction</td><td>no reaction</td></tr>
      <tr><td>potassium bromide</td><td>orange (Br₂ formed)</td><td>—</td><td>no reaction</td></tr>
      <tr><td>potassium iodide</td><td>brown (I₂ formed)</td><td>brown (I₂ formed)</td><td>—</td></tr></table>
      ${ex('Displacement equation', 'Bromine water is added to potassium iodide.', 'Br₂ + 2KI → 2KBr + I₂ (ionic: Br₂ + 2I⁻ → 2Br⁻ + I₂). Bromine is more reactive than iodine.')}
      ${ex('Similar properties', 'Explain why lithium and sodium have similar reactions.', 'Both are in Group I and have <b>one outer electron</b> (Li 2,1; Na 2,8,1), which they lose to form 1+ ions.')}
      ${ex('Metallic character across a period', 'Describe how the elements change across Period 3.', 'Na, Mg, Al are <b>metals</b>; Si is a metalloid; P, S, Cl, Ar are <b>non-metals</b>. Metallic character decreases from left to right.')}` }],
    quiz: [
      { q: 'Which halogen is a grey-black solid at room temperature?', o: ['Fluorine', 'Chlorine', 'Bromine', 'Iodine'], a: 3, e: 'Iodine is a grey-black solid.' },
      { q: 'Which element is in Period 3 and Group II?', o: ['Be', 'Mg', 'Ca', 'Al'], a: 1, e: 'Mg: 2,8,2 — 3 shells, 2 outer electrons.' },
      { q: 'What charge does an ion of a Group VI element usually have?', o: ['6+', '2+', '2−', '6−'], a: 2, e: 'Group VI atoms gain 2 electrons → 2− ions.' },
    ],
  },
  metals: {
    end: [{ h: 'Worked examples', html: `
      <table class="tbl"><tr><th>Metal</th><th>Cold water</th><th>Steam</th><th>Dilute HCl</th></tr>
      <tr><td>potassium</td><td>very vigorous: 2K + 2H₂O → 2KOH + H₂</td><td>(dangerous)</td><td>explosive</td></tr>
      <tr><td>sodium</td><td>vigorous: 2Na + 2H₂O → 2NaOH + H₂</td><td>(dangerous)</td><td>explosive</td></tr>
      <tr><td>calcium</td><td>steady fizzing: Ca + 2H₂O → Ca(OH)₂ + H₂</td><td>—</td><td>vigorous</td></tr>
      <tr><td>magnesium</td><td>very slow</td><td>Mg + H₂O → MgO + H₂</td><td>Mg + 2HCl → MgCl₂ + H₂ (fast)</td></tr>
      <tr><td>zinc</td><td>none</td><td>reacts when hot</td><td>Zn + 2HCl → ZnCl₂ + H₂ (moderate)</td></tr>
      <tr><td>iron</td><td>none (rusts slowly)</td><td>reacts when hot</td><td>Fe + 2HCl → FeCl₂ + H₂ (slow)</td></tr>
      <tr><td>copper, silver, gold</td><td>none</td><td>none</td><td>none — below hydrogen</td></tr></table>
      ${ex('Deduce an order from results', 'Metal P displaces Q from Q sulfate. R does not react with P sulfate or Q sulfate. Put P, Q, R in order of reactivity.', 'P > Q (P displaces Q). R is below both. Order: <b>P > Q > R</b>.')}
      ${ex('Rusting experiment', 'Three iron nails: A in tap water open to air, B in boiled water with an oil layer, C in dry air with calcium chloride. Which rusts?', 'Only <b>A</b> — it has both water and oxygen. B has no oxygen (boiling removes it, oil stops it dissolving back in); C has no water.')}
      ${ex(`Sacrificial protection ${EXT}`, 'Why are blocks of magnesium attached to steel ship hulls?', 'Magnesium is <b>more reactive</b> than iron, so it loses electrons (is oxidised) instead of the iron: Mg → Mg²⁺ + 2e⁻. The magnesium corrodes and the steel is protected.')}
      ${ex('Extraction method', 'Which method extracts (a) zinc, (b) potassium?', '(a) Zinc is below carbon → heat its oxide with <b>carbon</b>: ZnO + C → Zn + CO. (b) Potassium is above carbon → <b>electrolysis</b> of the molten compound.')}
      ${ex(`Aluminium's oxide layer ${EXT}`, 'Aluminium is high in the reactivity series but does not react with water. Why?', 'A thin, tough layer of <b>aluminium oxide</b> forms on the surface and stops water and air reaching the metal underneath.')}` }],
    quiz: [
      { q: 'Which metal reacts with steam but only very slowly with cold water?', o: ['Sodium', 'Magnesium', 'Copper', 'Potassium'], a: 1, e: 'Magnesium + steam → magnesium oxide + hydrogen.' },
      { q: 'Which metal can be extracted by heating its oxide with carbon?', o: ['Aluminium', 'Sodium', 'Iron', 'Calcium'], a: 2, e: 'Iron is below carbon, so carbon can reduce iron oxide.' },
      { q: 'In the blast furnace, what is the purpose of limestone?', o: ['To provide heat', 'To reduce iron oxide', 'To remove impurities as slag', 'To act as a catalyst'], a: 2, e: 'CaCO₃ → CaO + CO₂; CaO + SiO₂ → CaSiO₃ (slag), removing sandy impurities.' },
    ],
  },
  environment: {
    end: [{ h: 'Worked examples', html: `
      ${ex('Water treatment', 'Put the stages in order and give the purpose of each.', '1. <b>Sedimentation</b> — large particles settle. 2. <b>Filtration</b> — removes smaller insoluble solids. 3. <b>Carbon</b> — removes tastes and odours. 4. <b>Chlorination</b> — kills microbes.')}
      ${ex('Test water purity', 'How would you show a sample of water is pure?', 'Measure its boiling point (<b>exactly 100 °C</b>) and melting point (<b>exactly 0 °C</b>). Impurities raise the boiling point and lower the melting point.')}
      ${ex('Fertiliser', 'Which elements does (NH₄)₃PO₄ supply to plants?', 'Nitrogen (N) and phosphorus (P) — but not potassium (K).')}
      ${ex('Catalytic converter', 'Explain how a catalytic converter reduces pollution.', 'Toxic CO and NO from the engine react on the catalyst surface: <b>2CO + 2NO → 2CO₂ + N₂</b>. (NO forms when nitrogen and oxygen from the air react at the high temperature in the engine.)')}
      ${ex('Flue gas desulfurisation', 'How is SO₂ removed from power station waste gases?', 'The gases are passed through <b>calcium oxide</b> (or calcium carbonate), which reacts with the acidic SO₂ (CaO + SO₂ → CaSO₃).')}` }],
    quiz: [
      { q: 'Which substance is used in water treatment to remove tastes and odours?', o: ['Chlorine', 'Carbon', 'Calcium oxide', 'Sand'], a: 1, e: 'Activated carbon removes tastes and odours.' },
      { q: 'Which gas is produced by digestion in animals and contributes to global warming?', o: ['Carbon monoxide', 'Methane', 'Sulfur dioxide', 'Nitrogen'], a: 1, e: 'Methane comes from decomposing vegetation and digestion in animals.' },
    ],
  },
  organic: {
    end: [
      { h: 'Naming and structural formulae', html: `<table class="tbl"><tr><th>C atoms</th><th>Alkane</th><th>Alkene</th><th>Alcohol</th><th>Carboxylic acid</th></tr>
        <tr><td>1</td><td>methane CH₄</td><td>—</td><td>methanol CH₃OH</td><td>methanoic acid HCOOH</td></tr>
        <tr><td>2</td><td>ethane CH₃CH₃</td><td>ethene CH₂=CH₂</td><td>ethanol CH₃CH₂OH</td><td>ethanoic acid CH₃COOH</td></tr>
        <tr><td>3</td><td>propane CH₃CH₂CH₃</td><td>propene CH₂=CHCH₃</td><td>${EXT} propan-1-ol CH₃CH₂CH₂OH / propan-2-ol CH₃CH(OH)CH₃</td><td>propanoic acid CH₃CH₂COOH</td></tr>
        <tr><td>4</td><td>butane CH₃CH₂CH₂CH₃</td><td>${EXT} but-1-ene CH₂=CHCH₂CH₃ / but-2-ene CH₃CH=CHCH₃</td><td>${EXT} butan-1-ol / butan-2-ol</td><td>butanoic acid CH₃CH₂CH₂COOH</td></tr></table>
        <p>${EXT} <b>Esters</b> (acid + alcohol, acid catalyst). Name = alcohol part + “-yl”, then acid part + “-oate”:</p>
        <table class="tbl"><tr><th>Alcohol + acid</th><th>Ester</th><th>Structural formula</th></tr>
        <tr><td>methanol + ethanoic acid</td><td>methyl ethanoate</td><td>CH₃COOCH₃</td></tr>
        <tr><td>ethanol + ethanoic acid</td><td>ethyl ethanoate</td><td>CH₃COOCH₂CH₃</td></tr>
        <tr><td>ethanol + methanoic acid</td><td>ethyl methanoate</td><td>HCOOCH₂CH₃</td></tr>
        <tr><td>propan-1-ol + ethanoic acid</td><td>propyl ethanoate</td><td>CH₃COOCH₂CH₂CH₃</td></tr>
        <tr><td>methanol + propanoic acid</td><td>methyl propanoate</td><td>CH₃CH₂COOCH₃</td></tr>
        <tr><td>butan-1-ol + methanoic acid</td><td>butyl methanoate</td><td>HCOOCH₂CH₂CH₂CH₃</td></tr></table>` },
      { h: 'Worked examples — reactions', html: `
        ${ex('Complete combustion', 'Ethane burns in plenty of oxygen.', '2C₂H₆ + 7O₂ → 4CO₂ + 6H₂O')}
        ${ex('Incomplete combustion', 'Methane burns in limited oxygen.', '2CH₄ + 3O₂ → 2CO + 4H₂O — carbon monoxide is toxic.')}
        ${ex(`Substitution ${EXT}`, 'Methane + chlorine in UV light.', 'CH₄ + Cl₂ → <b>CH₃Cl</b> (chloromethane) + HCl. One H atom is replaced by Cl. UV light provides the activation energy.')}
        ${ex('Cracking', 'Decane is cracked into octane and ethene.', 'C₁₀H₂₂ → C₈H₁₈ + C₂H₄ (high temperature, catalyst).')}
        ${ex(`Addition ${EXT}`, 'Ethene reacts with (a) bromine, (b) hydrogen, (c) steam.', '(a) C₂H₄ + Br₂ → C₂H₄Br₂ (1,2-dibromoethane, colourless). (b) C₂H₄ + H₂ → C₂H₆ (nickel catalyst). (c) C₂H₄ + H₂O → C₂H₅OH (acid catalyst, 300 °C, 60 atm).')}
        ${ex('Fermentation', 'Write the equation for fermentation of glucose.', 'C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂ (yeast, 25–35 °C, no oxygen).')}
        ${ex('Ethanoic acid reactions', 'Ethanoic acid with magnesium, sodium hydroxide and sodium carbonate.', '2CH₃COOH + Mg → (CH₃COO)₂Mg + H₂ (magnesium ethanoate)<br>CH₃COOH + NaOH → CH₃COONa + H₂O (sodium ethanoate)<br>2CH₃COOH + Na₂CO₃ → 2CH₃COONa + H₂O + CO₂')}
        ${ex(`Esterification ${EXT}`, 'Ethanoic acid + ethanol.', 'CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (ethyl ethanoate; acid catalyst).')}
        ${ex(`Polymers ${EXT}`, 'Draw the repeat unit of poly(propene) from propene, CH₂=CHCH₃.', 'Open the double bond: –[CH₂–CH(CH₃)]– with the bonds extending out of the brackets. Monomer chloroethene CH₂=CHCl gives poly(chloroethene), –[CH₂–CHCl]–.')}
        ${ex(`Condensation polymers ${EXT}`, 'How do addition and condensation polymerisation differ?', 'Addition: alkene monomers join, the polymer is the <b>only product</b>. Condensation: two different monomers (each with two functional groups) join and a <b>small molecule (water)</b> is also made, e.g. nylon (amide links) and PET (ester links).')}` },
    ],
    quiz: [
      { q: 'What is the name of the ester made from methanol and ethanoic acid?', o: ['ethyl methanoate', 'methyl ethanoate', 'methyl methanoate', 'ethyl ethanoate'], a: 1, e: 'Alcohol part (methyl) first, then acid part (ethanoate).' },
      { q: 'What is the product when ethene reacts with hydrogen?', o: ['Ethanol', 'Ethane', 'Methane', 'Ethanoic acid'], a: 1, e: 'Addition of H₂ (nickel catalyst) saturates the double bond → ethane.' },
      { q: 'Which are structural isomers?', o: ['ethane and ethene', 'butane and methylpropane', 'methanol and ethanol', 'propene and propane'], a: 1, e: 'Both are C₄H₁₀ but with different structures.' },
      { q: 'What type of reaction is CH₄ + Cl₂ → CH₃Cl + HCl?', o: ['Addition', 'Substitution', 'Combustion', 'Cracking'], a: 1, e: 'A hydrogen atom is replaced (substituted) by a chlorine atom.' },
    ],
  },
  analysis: {
    end: [
      { h: 'All the ion and gas tests in one place', html: `
        <table class="tbl"><tr><th>Cation</th><th>NaOH(aq)</th><th>NH₃(aq)</th></tr>
        <tr><td>Al³⁺</td><td>white ppt, soluble in excess → colourless</td><td>white ppt, insoluble in excess</td></tr>
        <tr><td>NH₄⁺</td><td>ammonia produced on warming</td><td>—</td></tr>
        <tr><td>Ca²⁺</td><td>white ppt, insoluble in excess</td><td>no ppt or very slight white ppt</td></tr>
        <tr><td>Cr³⁺</td><td>green ppt, soluble in excess</td><td>grey-green ppt, insoluble in excess</td></tr>
        <tr><td>Cu²⁺</td><td>light blue ppt, insoluble in excess</td><td>light blue ppt, soluble in excess → dark blue solution</td></tr>
        <tr><td>Fe²⁺</td><td>green ppt, insoluble in excess</td><td>green ppt, insoluble in excess</td></tr>
        <tr><td>Fe³⁺</td><td>red-brown ppt, insoluble in excess</td><td>red-brown ppt, insoluble in excess</td></tr>
        <tr><td>Zn²⁺</td><td>white ppt, soluble in excess → colourless</td><td>white ppt, soluble in excess → colourless</td></tr></table>
        <table class="tbl"><tr><th>Anion</th><th>Test</th><th>Result</th></tr>
        <tr><td>CO₃²⁻</td><td>add dilute acid</td><td>effervescence; CO₂ turns limewater milky</td></tr>
        <tr><td>Cl⁻ / Br⁻ / I⁻</td><td>acidify with dilute HNO₃, add AgNO₃(aq)</td><td>white / cream / yellow ppt</td></tr>
        <tr><td>NO₃⁻</td><td>add NaOH(aq) then aluminium foil; warm</td><td>ammonia produced</td></tr>
        <tr><td>SO₄²⁻</td><td>acidify with dilute HNO₃, add Ba(NO₃)₂(aq)</td><td>white ppt</td></tr>
        <tr><td>SO₃²⁻</td><td>add acidified KMnO₄(aq)</td><td>purple → colourless</td></tr></table>
        <table class="tbl"><tr><th>Gas</th><th>Test and result</th></tr>
        <tr><td>NH₃</td><td>damp red litmus → blue</td></tr><tr><td>CO₂</td><td>limewater → milky</td></tr><tr><td>Cl₂</td><td>bleaches damp litmus</td></tr>
        <tr><td>H₂</td><td>“pops” with a lighted splint</td></tr><tr><td>O₂</td><td>relights a glowing splint</td></tr><tr><td>SO₂</td><td>acidified KMnO₄ purple → colourless</td></tr></table>
        <table class="tbl"><tr><th>Flame test</th><th>Li⁺</th><th>Na⁺</th><th>K⁺</th><th>Ca²⁺</th><th>Ba²⁺</th><th>Cu²⁺</th></tr><tr><td>colour</td><td>red</td><td>yellow</td><td>lilac</td><td>orange-red</td><td>light green</td><td>blue-green</td></tr></table>` },
      { h: 'Worked examples', html: `
        ${ex('Choose a separation method', '(a) salt from salt water (b) ethanol from water (c) chalk from water (d) dyes in ink (e) pure water from ink', '(a) evaporation / crystallisation (b) fractional distillation (c) filtration (d) chromatography (e) simple distillation')}
        ${ex('Purity from melting point', 'A sample of aspirin melts between 128 and 133 °C. Pure aspirin melts at 136 °C. Is it pure?', '<b>No</b> — it melts <b>below</b> the true melting point and over a <b>range</b>; impurities lower and broaden the melting point.')}
        ${ex('Identify a salt', 'A green solution gives a green ppt with NaOH that does not dissolve in excess. With acidified AgNO₃ it gives a white ppt. Name the salt.', 'Green ppt → Fe²⁺; white ppt with AgNO₃ → Cl⁻. Salt = <b>iron(II) chloride, FeCl₂</b>.')}
        ${ex('Identify a salt', 'A white solid gives a lilac flame. With dilute acid it fizzes and the gas turns limewater milky.', 'Lilac → K⁺; CO₂ → CO₃²⁻ → <b>potassium carbonate, K₂CO₃</b>.')}
        ${ex('Rf', 'Spot X travels 2.4 cm, the solvent front 8.0 cm. Find Rf. Does X match a dye with Rf 0.30?', 'Rf = 2.4 ÷ 8.0 = <b>0.30</b> — yes, it could be the same dye (same solvent).')}
        ${ex('Apparatus choice', 'Which apparatus measures 25.0 cm³ of solution most accurately: beaker, measuring cylinder or volumetric pipette?', '<b>Volumetric pipette</b> (most accurate for a fixed volume); a burette is used for variable volumes.')}` },
    ],
    quiz: [
      { q: 'Which ion gives a white precipitate with NaOH that dissolves in excess, AND a white precipitate with NH₃ that dissolves in excess?', o: ['Al³⁺', 'Ca²⁺', 'Zn²⁺', 'Cu²⁺'], a: 2, e: 'Zinc hydroxide dissolves in excess of both reagents. Aluminium dissolves only in excess NaOH.' },
      { q: 'Which gas bleaches damp litmus paper?', o: ['Ammonia', 'Chlorine', 'Oxygen', 'Hydrogen'], a: 1, e: 'Chlorine bleaches damp litmus.' },
      { q: 'How do impurities affect the boiling point of water?', o: ['Lower it', 'Raise it', 'No effect', 'Make it exactly 100 °C'], a: 1, e: 'Impurities raise the boiling point (and lower the melting point).' },
    ],
  },
};

// apply
for (const t of TOPICS) {
  const x = EXTRA[t.id];
  if (!x) continue;
  if (x.after) for (const [i, s] of x.after.slice().sort((a, b) => b[0] - a[0])) t.sections.splice(i + 1, 0, s);
  if (x.start) t.sections.unshift(...x.start);
  if (x.end) t.sections.push(...x.end);
  if (x.quiz) t.quiz.push(...x.quiz);
}
