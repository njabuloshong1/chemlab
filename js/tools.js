'use strict';
// Whole-app tools: interactive Periodic Table, Bond Lab, Ions & Formulae explorer, and the "journey into the atom".

// ---------- shared drawing: Bohr atom for any element ----------
function drawBohr(ctx, x, y, z, opts = {}) {
  const { t = 0, scale = 1, electrons = null, label = null, ion = 0, maxR = 150 } = opts;
  const sh = electrons || elementShells(z);
  const n = sh.length;
  const step = Math.min(30, (maxR - 22) / Math.max(n, 1)) * scale;
  const r0 = 22 * scale;
  sh.forEach((cnt, i) => {
    const r = r0 + step * (i + 1);
    UI.circle(ctx, x, y, r, null, '#334155', 1.2);
    for (let k = 0; k < cnt; k++) {
      const a = t * (0.5 / (i + 1)) + (k / cnt) * Math.PI * 2;
      UI.circle(ctx, x + r * Math.cos(a), y + r * Math.sin(a), Math.max(2.5, 4.5 * scale), UI.C.dot);
    }
  });
  UI.circle(ctx, x, y, r0, '#7f1d1d', '#ef4444', 1.5);
  UI.text(ctx, label || ELEMENTS[z - 1].sym, x, y, { size: 14 * Math.max(scale, 0.8) });
  if (ion) {
    const R = r0 + step * n + 10;
    ctx.strokeStyle = UI.C.text; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x - R + 8, y - R); ctx.lineTo(x - R, y - R); ctx.lineTo(x - R, y + R); ctx.lineTo(x - R + 8, y + R); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + R - 8, y - R); ctx.lineTo(x + R, y - R); ctx.lineTo(x + R, y + R); ctx.lineTo(x + R - 8, y + R); ctx.stroke();
    UI.text(ctx, chargeLabel(ion), x + R + 12, y - R + 4, { size: 16, color: ion > 0 ? UI.C.orange : UI.C.cross });
  }
}

// ---------- periodic table component ----------
function PeriodicTable(host, { onPick, colorOf, mark, compact = false } = {}) {
  const grid = UI.el('div', { class: 'ptable2' + (compact ? ' compact' : '') });
  const cells = new Map();
  for (let g = 1; g <= 18; g++) grid.append(UI.el('div', { class: 'gh', style: `grid-column:${g};grid-row:1` }, ROMAN_G[g] || String(g)));
  for (const e of ELEMENTS) {
    const col = e.frow ? e.frow + 3 : e.group, row = e.frow ? e.period + 3 : e.period + 1;
    const cell = UI.el('button', { class: 'pt2', style: `grid-column:${col};grid-row:${row}`, title: `${e.name} (${e.z})` },
      UI.el('small', {}, String(e.z)), UI.el('b', {}, e.sym), compact ? null : UI.el('i', {}, e.mass != null ? String(e.mass) : '–'));
    cell.addEventListener('click', () => onPick && onPick(e));
    grid.append(cell);
    cells.set(e.sym, cell);
  }
  grid.append(UI.el('div', { class: 'ph', style: 'grid-column:3;grid-row:7' }, '57–71'));
  grid.append(UI.el('div', { class: 'ph', style: 'grid-column:3;grid-row:8' }, '89–103'));
  grid.append(UI.el('div', { class: 'gap', style: 'grid-column:1/19;grid-row:9' }));
  host.append(grid);
  function refresh() {
    for (const e of ELEMENTS) {
      const c = cells.get(e.sym);
      c.style.setProperty('--c', colorOf ? colorOf(e) : EL_CATS[e.cat][1]);
      c.className = 'pt2 ' + (mark ? mark(e) || '' : '');
    }
  }
  refresh();
  return { refresh, grid };
}

// ---------- Periodic Table page ----------
function renderPeriodicPage() {
  main.innerHTML = '';
  const head = UI.el('header', { class: 'topic-head' });
  head.innerHTML = '<h1>🗂️ The Periodic Table</h1><p>All 118 elements. Click any element to see its atom, electrons and key facts. Change the view to see patterns across periods and down groups.</p>';
  main.append(head);
  let sel = EL.Na, view = 'type';
  const bar = UI.bar(main);
  const VIEWS = {
    type: ['Element type', (e) => EL_CATS[e.cat][1]],
    metal: ['Metal / non-metal', (e) => (isMetal(e) ? '#f59e0b' : e.cat === 'metalloid' ? '#14b8a6' : e.cat === 'noble' ? '#ec4899' : '#3b82f6')],
    state: ['State at room temperature', (e) => (e.state === 'gas' ? '#38bdf8' : e.state === 'liquid' ? '#a78bfa' : '#64748b')],
    outer: ['Outer-shell electrons', (e) => { const v = valenceOf(e); return v == null ? '#334155' : ['#334155', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'][v]; }],
    ion: ['Charge on ion formed', (e) => { const m = metalCharges(e), x = anionCharge(e); if (e.cat === 'noble') return '#334155'; if (isMetal(e) && m) return ['', '#fb923c', '#f97316', '#c2410c', '#9a3412'][m[0]] || '#7c2d12'; if (!isMetal(e) && x && e.sym !== 'H') return ['', '#22d3ee', '#0ea5e9', '#2563eb'][x]; return '#334155'; }],
  };
  const LEGEND = {
    type: Object.values(EL_CATS),
    metal: [['Metals', '#f59e0b'], ['Metalloids', '#14b8a6'], ['Non-metals', '#3b82f6'], ['Noble gases', '#ec4899']],
    state: [['Solid', '#64748b'], ['Liquid', '#a78bfa'], ['Gas', '#38bdf8']],
    outer: [1, 2, 3, 4, 5, 6, 7, 8].map((v) => [v + ' outer electron' + (v > 1 ? 's' : ''), ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'][v]]),
    ion: [['1+', '#fb923c'], ['2+', '#f97316'], ['3+', '#c2410c'], ['1−', '#22d3ee'], ['2−', '#0ea5e9'], ['3−', '#2563eb'], ['no simple ion', '#334155']],
  };
  UI.select(bar, 'View', Object.entries(VIEWS).map(([k, v]) => [k, v[0]]), (v) => { view = v; pt.refresh(); legend(); });
  const wrap = UI.el('div', { class: 'ptable-wrap' });
  main.append(wrap);
  const pt = PeriodicTable(wrap, { onPick: (e) => { sel = e; pt.refresh(); show(); }, colorOf: (e) => VIEWS[view][1](e), mark: (e) => (e === sel ? 'sel' : '') });
  const leg = UI.el('div', { class: 'legend' });
  main.append(leg);
  function legend() { leg.innerHTML = ''; for (const [lab, col] of LEGEND[view]) leg.append(UI.el('span', { style: `--c:${col}` }, lab)); }
  legend();
  const detail = UI.el('div', { class: 'el-detail' });
  main.append(detail);
  const cv = UI.canvas(UI.el('div'), 340, 340);
  let stop = null;
  function show() {
    const e = sel, sh = elementShells(e.z), v = valenceOf(e);
    const m = metalCharges(e), x = anionCharge(e);
    let ion = '—';
    if (e.cat === 'noble') ion = 'none — full outer shell';
    else if (isMetal(e) && m) ion = m.map((q) => e.sym + '<sup>' + chargeLabel(q) + '</sup>').join(' or ') + ' (loses electrons)';
    else if (!isMetal(e) && x) ion = e.sym + '<sup>' + chargeLabel(-x) + '</sup> (gains electrons)' + (e.sym === 'H' ? ' — hydrogen usually forms H<sup>+</sup> in acids' : '');
    detail.innerHTML = `<div class="el-card"><div class="el-big" style="--c:${EL_CATS[e.cat][1]}"><small>${e.z}</small><b>${e.sym}</b><span>${e.name}</span><i>${e.mass ?? '–'}</i></div>
      <div class="el-info"><h2>${e.name}</h2>
      <table class="tbl"><tr><td>Proton (atomic) number</td><td><b>${e.z}</b> → ${e.z} protons, ${e.z} electrons</td></tr>
      <tr><td>Relative atomic mass, A<sub>r</sub></td><td>${e.mass ?? 'not given (radioactive)'}${e.mass ? ` → about ${Math.round(e.mass) - e.z} neutrons in the most common isotope` : ''}</td></tr>
      <tr><td>Position</td><td>${e.frow ? (e.period === 6 ? 'Lanthanide' : 'Actinide') + ' series, period ' + e.period : `Group ${ROMAN_G[e.group] || e.group}, period ${e.period}`}</td></tr>
      <tr><td>Type</td><td>${EL_CATS[e.cat][0]} • ${isMetal(e) ? 'metal' : e.cat === 'metalloid' ? 'metalloid' : 'non-metal'} • ${e.state} at r.t.p.</td></tr>
      <tr><td>Electron shells</td><td><b>${sh.join(',')}</b>${e.z > 20 ? ' <span class="dim">(beyond IGCSE — shown for interest)</span>' : ''}</td></tr>
      ${v != null ? `<tr><td>Outer-shell electrons</td><td>${v}${e.group <= 2 || e.group >= 13 ? ' = group number' : ''}</td></tr>` : ''}
      <tr><td>Ion formed</td><td>${ion}</td></tr></table>
      ${EL_FACTS[e.sym] ? `<div class="key">${EL_FACTS[e.sym]}</div>` : ''}
      <a class="btn" href="#bondlab/${e.sym}">⚛ Bond ${e.name} with another element →</a></div></div>`;
    const card = detail.querySelector('.el-card');
    card.prepend(cv.c);
    if (stop) stop();
    stop = UI.loop((dt, t) => { UI.clear(cv.ctx, 340, 340); drawBohr(cv.ctx, 170, 170, e.z, { t, maxR: 160 }); });
  }
  show();
  cleanups.push(() => stop && stop());
}

// ---------- Bond Lab page ----------
function renderBondLab(startSym) {
  main.innerHTML = '';
  const head = UI.el('header', { class: 'topic-head' });
  head.innerHTML = `<h1>⚛ Bond Lab</h1><p>Click <b>two elements</b> on the Periodic Table. Bond Lab works out the type of bonding, then shows the bond forming step by step, with the formula, the name and a balanced equation.</p>`;
  main.append(head);
  let A = startSym && EL[startSym] ? EL[startSym] : null, B = null, stop = null;
  const picks = UI.el('div', { class: 'picks' });
  const examples = UI.el('div', { class: 'toc' });
  const EXAMPLES = ['Na Cl', 'Mg O', 'Al O', 'Ca Cl', 'Li O', 'K F', 'Mg N', 'Al Cl', 'H O', 'C O', 'N H', 'C H', 'H Cl', 'Cl Cl', 'O O', 'N N', 'C Cl', 'S O', 'Si O', 'C C', 'Fe Cl', 'Cu O', 'Cu Zn', 'Na Na', 'Ne Na'];
  examples.append(UI.el('span', { class: 'dim' }, 'Try: '));
  for (const ex of EXAMPLES) {
    const [a, b] = ex.split(' ');
    examples.append(UI.el('button', { onclick: () => { A = EL[a]; B = EL[b]; update(); } }, `${a} + ${b}`));
  }
  main.append(picks, examples);
  const wrap = UI.el('div', { class: 'ptable-wrap' });
  main.append(wrap);
  const pt = PeriodicTable(wrap, {
    compact: true,
    onPick: (e) => { if (!A || (A && B)) { A = e; B = null; } else B = e; update(); },
    mark: (e) => (e === A && e === B ? 'sel selb' : e === A ? 'sel' : e === B ? 'selb' : ''),
  });
  const out = UI.el('div', { class: 'bond-out' });
  main.append(out);

  function update() {
    pt.refresh();
    picks.innerHTML = '';
    const slot = (e, n) => UI.el('div', { class: 'pick ' + (e ? 'on' : '') }, e ? UI.el('span', { html: `<b>${e.sym}</b> ${e.name}<small>${isMetal(e) ? 'metal' : e.cat === 'noble' ? 'noble gas' : e.cat === 'metalloid' ? 'metalloid' : 'non-metal'}</small>` }) : `Element ${n}: click the table`);
    picks.append(slot(A, 1), UI.el('span', { class: 'plusbig' }, '+'), slot(B, 2));
    if (A || B) picks.append(UI.el('button', { class: 'btn ghost', onclick: () => { A = B = null; update(); } }, 'Clear'));
    if (A && !B) picks.append(UI.el('button', { class: 'btn ghost', onclick: () => { B = A; update(); } }, `${A.sym} + ${A.sym} (same element)`));
    if (stop) { stop(); stop = null; }
    out.innerHTML = '';
    if (!A || !B) { out.innerHTML = '<div class="anim-info">Pick two elements. Tip: start with a metal from the left and a non-metal from the right — or two non-metals.</div>'; return; }
    const r = analyseBond(A, B);
    const badge = { ionic: 'Ionic', covalent: 'Covalent', metallic: 'Metallic', alloy: 'Alloy (mixture)', none: 'No bond', other: 'No simple compound' }[r.type];
    const card = UI.el('section', { class: 'lesson' });
    card.innerHTML = `<div class="bond-head"><span class="badge b-${r.type}">${badge}</span><h2>${A.name} + ${B.name}${A === B ? ' (same element)' : ''}: ${r.title}</h2>
      ${r.formula ? `<div class="bigformula">${UI.fmtFormula(r.formula)} <span>${r.name}</span></div>` : ''}</div>
      <div class="anim-slot mounted"><div class="anim-title">▶ Animation</div><div class="anim-inner"></div></div>
      <ol class="bond-steps">${r.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      ${r.also.length ? `<div class="key">${r.also.join('<br>')}</div>` : ''}
      ${r.note ? `<p class="dim">${r.note}</p>` : ''}`;
    out.append(card);
    requestAnimationFrame(() => card.scrollIntoView({ block: 'start' }));
    const inner = card.querySelector('.anim-inner');
    const a = r.anim;
    if (!a) card.querySelector('.anim-slot').remove();
    else if (a.kind === 'ionic') stop = Anims.ionic(inner, { layout: a.layout, formula: a.formula });
    else if (a.kind === 'covalent') stop = Anims.covalent(inner, { mol: a.mol, formula: a.formula });
    else if (a.kind === 'giant') stop = Anims.giant(inner, { mode: a.mode });
    else if (a.kind === 'metallic') stop = Anims.metallic(inner, {});
    else if (a.kind === 'alloy') stop = Anims.metallic(inner, { alloy: true });
    else if (a.kind === 'atoms') {
      const cv = UI.canvas(inner, 780, 320);
      stop = UI.loop((dt, t) => {
        UI.clear(cv.ctx, 780, 320);
        drawBohr(cv.ctx, 230, 160, a.list[0].z, { t, maxR: 140 });
        drawBohr(cv.ctx, 550, 160, a.list[1].z, { t, maxR: 140 });
        UI.text(cv.ctx, 'full outer shell — nothing to gain, lose or share', 390, 305, { size: 13, color: UI.C.dim });
      });
    }
  }
  update();
  cleanups.push(() => stop && stop());
}

// ---------- Ions & formulae ----------
const IONS = [
  // cations
  { id: 'H', f: 'H⁺', name: 'hydrogen', q: 1, el: 'H', note: 'Present in all <b>acids</b> (in water). A hydrogen atom that has lost its only electron — just a proton.', eg: 'HCl (hydrochloric acid), H₂SO₄ (sulfuric acid), HNO₃ (nitric acid)' },
  { id: 'Li', f: 'Li⁺', name: 'lithium', q: 1, el: 'Li', test: 'Flame test: <b>red</b>.' },
  { id: 'Na', f: 'Na⁺', name: 'sodium', q: 1, el: 'Na', test: 'Flame test: <b>yellow</b>.', eg: 'NaCl (common salt), NaOH (an alkali), Na₂CO₃' },
  { id: 'K', f: 'K⁺', name: 'potassium', q: 1, el: 'K', test: 'Flame test: <b>lilac</b>.', eg: 'KCl, KNO₃ (fertiliser), KOH' },
  { id: 'NH4', f: 'NH₄⁺', name: 'ammonium', q: 1, poly: { c: 'N', lig: [['H', 1], ['H', 1], ['H', 1], ['H', 1]], cq: '+' }, comp: '1 nitrogen + 4 hydrogen atoms', note: 'Formed when ammonia (NH₃) accepts an H⁺ ion. The only common positive <b>compound ion</b> — it contains no metal!', test: 'Warm with aqueous sodium hydroxide → <b>ammonia gas</b> given off, which turns <b>damp red litmus blue</b>.', eg: 'NH₄Cl, (NH₄)₂SO₄ and NH₄NO₃ — used as fertilisers' },
  { id: 'Ag', f: 'Ag⁺', name: 'silver', q: 1, el: 'Ag', eg: 'AgNO₃ (used to test for halides), AgCl (white precipitate)' },
  { id: 'Mg', f: 'Mg²⁺', name: 'magnesium', q: 2, el: 'Mg', eg: 'MgO, MgCl₂, MgSO₄' },
  { id: 'Ca', f: 'Ca²⁺', name: 'calcium', q: 2, el: 'Ca', test: 'Flame test: <b>orange-red</b>. NaOH: white precipitate, insoluble in excess. NH₃: no or very slight white precipitate.', eg: 'CaCO₃ (limestone), CaO (quicklime), Ca(OH)₂ (limewater)' },
  { id: 'Ba', f: 'Ba²⁺', name: 'barium', q: 2, el: 'Ba', test: 'Flame test: <b>light green</b>.', eg: 'BaSO₄ (insoluble white), Ba(NO₃)₂ (tests for sulfate)' },
  { id: 'Cu', f: 'Cu²⁺', name: 'copper(II)', q: 2, el: 'Cu', test: 'Blue solution. NaOH: <b>light blue</b> precipitate, insoluble in excess. NH₃: light blue precipitate, dissolves in excess → <b>dark blue</b> solution. Flame: <b>blue-green</b>.', eg: 'CuSO₄ (blue crystals), CuO (black), CuCO₃ (green)' },
  { id: 'Fe2', f: 'Fe²⁺', name: 'iron(II)', q: 2, el: 'Fe', test: 'Pale green solution. NaOH or NH₃: <b>green</b> precipitate, insoluble in excess.', eg: 'FeSO₄, FeCl₂' },
  { id: 'Zn', f: 'Zn²⁺', name: 'zinc', q: 2, el: 'Zn', test: 'NaOH: white precipitate, <b>dissolves in excess</b>. NH₃: white precipitate, <b>dissolves in excess</b>.', eg: 'ZnO (amphoteric), ZnSO₄, ZnCl₂' },
  { id: 'Pb', f: 'Pb²⁺', name: 'lead(II)', q: 2, el: 'Pb', eg: 'PbBr₂ (electrolysis), PbI₂ (yellow precipitate), Pb(NO₃)₂' },
  { id: 'Al', f: 'Al³⁺', name: 'aluminium', q: 3, el: 'Al', test: 'NaOH: white precipitate, <b>dissolves in excess</b>. NH₃: white precipitate, <b>insoluble</b> in excess.', eg: 'Al₂O₃ (bauxite, amphoteric), AlCl₃' },
  { id: 'Fe3', f: 'Fe³⁺', name: 'iron(III)', q: 3, el: 'Fe', test: 'Yellow-brown solution. NaOH or NH₃: <b>red-brown</b> precipitate, insoluble in excess.', eg: 'Fe₂O₃ (rust/hematite), FeCl₃' },
  { id: 'Cr', f: 'Cr³⁺', name: 'chromium(III)', q: 3, el: 'Cr', test: 'NaOH: <b>green</b> precipitate, dissolves in excess. NH₃: <b>grey-green</b> precipitate, insoluble in excess.', eg: 'Cr₂O₃' },
  // anions
  { id: 'F', f: 'F⁻', name: 'fluoride', q: -1, el: 'F', eg: 'NaF (in toothpaste), CaF₂' },
  { id: 'Cl', f: 'Cl⁻', name: 'chloride', q: -1, el: 'Cl', test: 'Acidify with dilute nitric acid, add aqueous silver nitrate → <b>white</b> precipitate (AgCl).', from: 'hydrochloric acid, HCl', eg: 'NaCl, MgCl₂, CuCl₂, NH₄Cl' },
  { id: 'Br', f: 'Br⁻', name: 'bromide', q: -1, el: 'Br', test: 'Acidify with dilute nitric acid, add aqueous silver nitrate → <b>cream</b> precipitate (AgBr).', eg: 'KBr, NaBr, PbBr₂' },
  { id: 'I', f: 'I⁻', name: 'iodide', q: -1, el: 'I', test: 'Acidify with dilute nitric acid, add aqueous silver nitrate → <b>yellow</b> precipitate (AgI).', eg: 'KI (turns brown with oxidising agents), PbI₂' },
  { id: 'OH', f: 'OH⁻', name: 'hydroxide', q: -1, poly: { c: 'O', lig: [['H', 1]], cq: '−' }, comp: '1 oxygen + 1 hydrogen atom', note: 'Present in all <b>alkalis</b> in water. H⁺ + OH⁻ → H₂O is the neutralisation reaction.', eg: 'NaOH, KOH, Ca(OH)₂ (limewater), Cu(OH)₂ (blue precipitate)' },
  { id: 'NO3', f: 'NO₃⁻', name: 'nitrate', q: -1, poly: { c: 'N', lig: [['O', 2], ['O', 1, '−'], ['O', 1, '−']], cq: '+' }, comp: '1 nitrogen + 3 oxygen atoms', from: 'nitric acid, HNO₃', test: 'Add aqueous NaOH and aluminium foil, warm → <b>ammonia</b> given off (damp red litmus → blue).', sol: 'All nitrates are soluble.', eg: 'KNO₃ and NH₄NO₃ (fertilisers), AgNO₃, Cu(NO₃)₂' },
  { id: 'CH3COO', f: 'CH₃COO⁻', name: 'ethanoate', q: -1, poly: { chain: true }, comp: '2 carbon + 3 hydrogen + 2 oxygen atoms', from: 'ethanoic acid (vinegar), CH₃COOH — a weak acid', eg: 'CH₃COONa (sodium ethanoate), (CH₃COO)₂Mg, (CH₃COO)₂Ca' },
  { id: 'O', f: 'O²⁻', name: 'oxide', q: -2, el: 'O', note: 'Metal oxides are <b>bases</b> (e.g. CuO, CaO). Al₂O₃ and ZnO are amphoteric.', eg: 'MgO, CaO, CuO, Fe₂O₃, Al₂O₃' },
  { id: 'S', f: 'S²⁻', name: 'sulfide', q: -2, el: 'S', eg: 'ZnS, PbS, Na₂S (sulfide ores are roasted to make SO₂)' },
  { id: 'SO4', f: 'SO₄²⁻', name: 'sulfate', q: -2, poly: { c: 'S', lig: [['O', 2], ['O', 2], ['O', 1, '−'], ['O', 1, '−']] }, comp: '1 sulfur + 4 oxygen atoms', from: 'sulfuric acid, H₂SO₄', test: 'Acidify with dilute nitric acid, add aqueous <b>barium nitrate</b> → <b>white</b> precipitate (BaSO₄).', sol: 'Sulfates are soluble <b>except barium, calcium and lead</b> sulfate.', eg: 'CuSO₄·5H₂O (blue crystals), MgSO₄, (NH₄)₂SO₄ (fertiliser), BaSO₄ (insoluble)' },
  { id: 'SO3', f: 'SO₃²⁻', name: 'sulfite', q: -2, poly: { c: 'S', lig: [['O', 2], ['O', 1, '−'], ['O', 1, '−']], lone: true }, comp: '1 sulfur + 3 oxygen atoms (one fewer O than sulfate)', test: 'Add acidified aqueous potassium manganate(VII) → colour changes <b>purple → colourless</b>.', eg: 'Na₂SO₃' },
  { id: 'CO3', f: 'CO₃²⁻', name: 'carbonate', q: -2, poly: { c: 'C', lig: [['O', 2], ['O', 1, '−'], ['O', 1, '−']] }, comp: '1 carbon + 3 oxygen atoms', test: 'Add dilute acid → <b>effervescence</b>; the CO₂ gas turns <b>limewater milky</b>.', sol: 'Carbonates are insoluble <b>except sodium, potassium and ammonium</b> carbonate.', eg: 'CaCO₃ (limestone, marble), Na₂CO₃, CuCO₃ (green)' },
  { id: 'N', f: 'N³⁻', name: 'nitride', q: -3, el: 'N', eg: 'Mg₃N₂, Li₃N' },
  { id: 'PO4', f: 'PO₄³⁻', name: 'phosphate', q: -3, poly: { c: 'P', lig: [['O', 2], ['O', 1, '−'], ['O', 1, '−'], ['O', 1, '−']] }, comp: '1 phosphorus + 4 oxygen atoms', note: 'Phosphates are used in <b>NPK fertilisers</b> and detergents. Too much in rivers damages aquatic life.', eg: 'Ca₃(PO₄)₂, (NH₄)₃PO₄' },
];
const ION = Object.fromEntries(IONS.map((i) => [i.id, i]));
const ionFormulaText = { NH4: 'NH4', OH: 'OH', NO3: 'NO3', CH3COO: 'CH3COO', SO4: 'SO4', SO3: 'SO3', CO3: 'CO3', PO4: 'PO4' };
const ACID_NAMES = { Cl: 'hydrochloric acid', Br: 'hydrobromic acid', I: 'hydroiodic acid', F: 'hydrofluoric acid', NO3: 'nitric acid', SO4: 'sulfuric acid', SO3: 'sulfurous acid', CO3: 'carbonic acid', PO4: 'phosphoric acid', CH3COO: 'ethanoic acid', OH: 'water!', O: 'water!', S: 'hydrogen sulfide', N: '—' };

function ionSymbol(i) { return i.poly ? ionFormulaText[i.id] : (ELEMENTS.find((e) => e.sym === i.el) || {}).sym; }

function solubility(c, a) {
  if (c.id === 'H') return a.id === 'OH' || a.id === 'O' ? '' : `This is an <b>acid</b>: ${ACID_NAMES[a.id] || 'an acid'}.`;
  if (['Na', 'K', 'NH4', 'Li'].includes(c.id)) return '<span class="good">Soluble</span> — all sodium, potassium and ammonium salts are soluble.';
  if (a.id === 'NO3' || a.id === 'CH3COO') return '<span class="good">Soluble</span> — all nitrates (and ethanoates) are soluble.';
  if (['Cl', 'Br', 'I'].includes(a.id)) return ['Ag', 'Pb'].includes(c.id) ? '<span class="warn">Insoluble</span> — silver and lead halides are insoluble (made by precipitation).' : '<span class="good">Soluble</span> — chlorides (bromides, iodides) are soluble except silver and lead.';
  if (a.id === 'SO4') return ['Ba', 'Ca', 'Pb'].includes(c.id) ? '<span class="warn">Insoluble</span> — barium, calcium and lead sulfates are insoluble.' : '<span class="good">Soluble</span> — most sulfates are soluble.';
  if (a.id === 'CO3') return '<span class="warn">Insoluble</span> — carbonates are insoluble except sodium, potassium and ammonium.';
  if (a.id === 'OH') return c.id === 'Ca' ? '<span class="hl">Slightly soluble</span> — calcium hydroxide is partially soluble (limewater).' : '<span class="warn">Insoluble</span> — hydroxides are insoluble except sodium, potassium, ammonium (and calcium, partially). This is why NaOH gives coloured precipitates in ion tests!';
  if (a.id === 'O') return 'Most metal oxides are <b>insoluble</b> bases.';
  return '';
}

function buildFormula(c, a) {
  const g = gcd(c.q, -a.q), nc = -a.q / g, na = c.q / g;
  const part = (i, n) => { const s = ionSymbol(i); if (n === 1) return UI.fmtFormula(s); return i.poly ? `(${UI.fmtFormula(s)})<sub>${n}</sub>` : `${UI.fmtFormula(s)}<sub>${n}</sub>`; };
  // ethanoates are written with the ethanoate first, e.g. CH3COONa
  const html = a.id === 'CH3COO' ? part(a, na) + part(c, nc) : part(c, nc) + part(a, na);
  return { nc, na, html };
}

function drawIonStructure(ctx, W, H, ion, t) {
  UI.clear(ctx, W, H);
  const cx = W / 2, cy = H / 2;
  if (!ion.poly) {
    const e = EL[ion.el];
    if (e.z <= 20) {
      const sh = UI.shells(e.z - ion.q);
      drawBohr(ctx, cx, cy, e.z, { t, electrons: sh.length ? sh : [], ion: ion.q, maxR: 110 });
    } else {
      UI.circle(ctx, cx, cy, 50, ion.q > 0 ? '#7c2d12' : '#164e63', ion.q > 0 ? UI.C.orange : UI.C.cross, 2);
      UI.text(ctx, e.sym, cx, cy, { size: 26 });
      UI.text(ctx, chargeLabel(ion.q), cx + 62, cy - 42, { size: 20, color: ion.q > 0 ? UI.C.orange : UI.C.cross });
    }
    return;
  }
  const p = ion.poly;
  const col = { S: '#ca8a04', O: '#dc2626', N: '#2563eb', C: '#475569', H: '#e2e8f0', P: '#ea580c' };
  const atom = (x, y, s, q) => { UI.circle(ctx, x, y, s === 'H' ? 14 : 19, col[s] + 'cc', col[s], 2); UI.text(ctx, s, x, y, { size: 15, color: s === 'H' ? '#0b1220' : '#fff' }); if (q) UI.text(ctx, q, x + 18, y - 17, { size: 15, color: UI.C.dot }); };
  const bond = (x1, y1, x2, y2, order) => {
    const a = Math.atan2(y2 - y1, x2 - x1), px = -Math.sin(a), py = Math.cos(a);
    for (let i = 0; i < order; i++) { const o = (i - (order - 1) / 2) * 6; UI.line(ctx, x1 + px * o, y1 + py * o, x2 + px * o, y2 + py * o, UI.C.text, 2.5); }
  };
  let box;
  const wob = Math.sin(t * 2) * 2;
  if (p.chain) {
    const xs = [cx - 110, cx - 20, cx + 60];
    for (const [dx, dy] of [[-60, 0], [0, -55], [0, 55]]) { bond(xs[0], cy, xs[0] + dx, cy + dy, 1); atom(xs[0] + dx, cy + dy, 'H'); }
    bond(xs[0], cy, xs[1], cy, 1); bond(xs[1], cy, xs[1], cy - 70, 2); bond(xs[1], cy, xs[2], cy, 1);
    atom(xs[0], cy, 'C'); atom(xs[1], cy, 'C'); atom(xs[1], cy - 70, 'O'); atom(xs[2], cy + wob, 'O', '−');
    box = [cx - 200, cy - 100, cx + 110, cy + 85];
  } else {
    const n = p.lig.length, d = 78;
    const angs = n === 1 ? [0] : n === 3 ? [-90, 150, 30] : [-90, 90, 180, 0];
    p.lig.forEach(([s, order, q], i) => {
      const a = angs[i] * DEG, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d + (q ? wob : 0);
      bond(cx, cy, x, y, order);
      atom(x, y, s, q);
    });
    atom(cx, cy, p.c, p.cq === '+' && ion.id === 'NO3' ? '+' : '');
    if (p.lone) { UI.circle(ctx, cx + 22, cy + 22, 3, UI.C.dot); UI.circle(ctx, cx + 28, cy + 16, 3, UI.C.dot); }
    box = [cx - d - 34, cy - d - 30, cx + d + 34, cy + d + 30];
  }
  ctx.strokeStyle = UI.C.text; ctx.lineWidth = 2;
  const [x0, y0, x1, y1] = box;
  ctx.beginPath(); ctx.moveTo(x0 + 12, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y1); ctx.lineTo(x0 + 12, y1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x1 - 12, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1 - 12, y1); ctx.stroke();
  UI.text(ctx, chargeLabel(ion.q), x1 + 16, y0 + 6, { size: 20, color: ion.q > 0 ? UI.C.orange : UI.C.cross });
  UI.text(ctx, 'the whole group of atoms carries the charge', W / 2, H - 12, { size: 12, color: UI.C.dim });
}

function renderIonsPage() {
  main.innerHTML = '';
  const head = UI.el('header', { class: 'topic-head' });
  head.innerHTML = `<h1>🧩 Ions & Formulae</h1><p>Every ion you need for IGCSE — what it is made of, its charge, where you meet it and how to test for it. Then build the formula of any ionic compound.</p>`;
  main.append(head);
  const rules = UI.el('section', { class: 'lesson' });
  rules.innerHTML = `<h2>How ions are named</h2>
    <ul><li><b>Positive ions</b> (cations) keep the metal's name: Na<sup>+</sup> sodium, Mg<sup>2+</sup> magnesium. If a metal can form more than one ion, a <b>Roman numeral</b> gives the charge: Fe<sup>2+</sup> iron(II), Fe<sup>3+</sup> iron(III), Cu<sup>2+</sup> copper(II).</li>
    <li><b>-ide</b> = a single non-metal atom that has gained electrons: Cl<sup>−</sup> chlor<b>ide</b>, O<sup>2−</sup> ox<b>ide</b>, S<sup>2−</sup> sulf<b>ide</b>, N<sup>3−</sup> nitr<b>ide</b>.</li>
    <li><b>-ate</b> = a <b>compound ion containing oxygen</b>: SO<sub>4</sub><sup>2−</sup> sulf<b>ate</b>, NO<sub>3</sub><sup>−</sup> nitr<b>ate</b>, CO<sub>3</sub><sup>2−</sup> carbon<b>ate</b>, PO<sub>4</sub><sup>3−</sup> phosph<b>ate</b>.</li>
    <li><b>-ite</b> = one <b>less</b> oxygen than the -ate: SO<sub>3</sub><sup>2−</sup> sulf<b>ite</b>.</li>
    <li>Exceptions to learn: <b>hydroxide</b> OH<sup>−</sup> and <b>ammonium</b> NH<sub>4</sub><sup>+</sup>.</li></ul>
    <div class="key">A <b>compound ion</b> (polyatomic ion) is a group of atoms joined by <b>covalent bonds</b> that carries an overall charge. It stays together as one unit in reactions and in formulae — use <b>brackets</b> when you need more than one, e.g. Ca(OH)<sub>2</sub>, (NH<sub>4</sub>)<sub>2</sub>SO<sub>4</sub>.</div>`;
  main.append(rules);

  const explorer = UI.el('section', { class: 'lesson' });
  explorer.innerHTML = '<h2>Ion explorer — click an ion</h2>';
  const chips = UI.el('div', { class: 'ion-chips' });
  const groups = [['Positive ions (cations)', (i) => i.q > 0], ['Negative ions (anions)', (i) => i.q < 0]];
  let cur = ION.SO4, stop = null;
  for (const [lab, fn] of groups) {
    chips.append(UI.el('div', { class: 'nav-h' }, lab));
    const row = UI.el('div', { class: 'toc' });
    for (const i of IONS.filter(fn)) row.append(UI.el('button', { class: 'ionchip ' + (i.q > 0 ? 'pos' : 'neg'), 'data-id': i.id, onclick: () => { cur = i; showIon(); } }, i.f));
    chips.append(row);
  }
  const panel = UI.el('div', { class: 'ion-panel' });
  const cv = UI.canvas(UI.el('div'), 380, 300);
  const txt = UI.el('div', { class: 'anim-info' });
  panel.append(cv.c, txt);
  explorer.append(chips, panel);
  main.append(explorer);
  function showIon() {
    chips.querySelectorAll('.ionchip').forEach((b) => b.classList.toggle('on', b.dataset.id === cur.id));
    const i = cur, e = i.el && EL[i.el];
    let how = '';
    if (!i.poly && e) {
      const v = valenceOf(e);
      how = e.z <= 20 && v != null
        ? (i.q > 0 ? `${e.name} atom (${UI.shells(e.z).join(',')}) <b>loses ${i.q} electron${i.q > 1 ? 's' : ''}</b> → ${i.f} (${UI.shells(e.z - i.q).join(',') || '0 electrons'}).` : `${e.name} atom (${UI.shells(e.z).join(',')}) <b>gains ${-i.q} electron${i.q < -1 ? 's' : ''}</b> → ${i.f} (${UI.shells(e.z - i.q).join(',')}) — a full outer shell.`)
        : `${e.name} atom ${i.q > 0 ? 'loses' : 'gains'} ${Math.abs(i.q)} electron${Math.abs(i.q) > 1 ? 's' : ''}.`;
    }
    txt.innerHTML = `<div class="ion-title"><b class="big">${i.f}</b> <b>${i.name}</b> ion — charge <b>${chargeLabel(i.q)}</b> (${i.q > 0 ? 'cation' : 'anion'}${i.poly ? ', compound ion' : ''})</div>
      ${i.comp ? `<p><b>Made of:</b> ${i.comp}, covalently bonded, with an overall charge of ${chargeLabel(i.q)}.</p>` : ''}
      ${how ? `<p><b>How it forms:</b> ${how}</p>` : ''}
      ${i.note ? `<p>${i.note}</p>` : ''}
      ${i.from ? `<p><b>Comes from:</b> ${i.from}${i.q < 0 ? ' — so its salts are made from this acid' : ''}.</p>` : ''}
      ${i.sol ? `<p><b>Solubility:</b> ${i.sol}</p>` : ''}
      ${i.test ? `<p><b>Test:</b> ${i.test}</p>` : ''}
      ${i.eg ? `<p><b>Examples:</b> ${i.eg}</p>` : ''}`;
    if (stop) stop();
    stop = UI.loop((dt, t) => drawIonStructure(cv.ctx, 380, 300, i, t));
  }
  showIon();

  // formula builder
  const fb = UI.el('section', { class: 'lesson' });
  fb.innerHTML = '<h2>Formula builder — make any ionic compound</h2><p>Choose a positive ion and a negative ion. The charges must add up to <b>zero</b>, so add ions until the + and − blocks balance.</p>';
  const bar = UI.bar(fb);
  let C = ION.Ca, Aion = ION.OH;
  const cs = UI.select(bar, 'Positive ion', IONS.filter((i) => i.q > 0).map((i) => [i.id, `${i.f} ${i.name}`]), (v) => { C = ION[v]; build(); });
  const as = UI.select(bar, 'Negative ion', IONS.filter((i) => i.q < 0).map((i) => [i.id, `${i.f} ${i.name}`]), (v) => { Aion = ION[v]; build(); });
  cs.value = 'Ca'; as.value = 'OH';
  const tiles = UI.el('div', { class: 'tiles' }), res = UI.el('div', { class: 'anim-info' });
  fb.append(tiles, res);
  main.append(fb);
  function build() {
    const { nc, na, html } = buildFormula(C, Aion);
    tiles.innerHTML = '';
    const row = (ion, n, sign) => {
      const r = UI.el('div', { class: 'tile-row' });
      for (let k = 0; k < n; k++) {
        const tile = UI.el('div', { class: 'tile ' + (sign > 0 ? 'pos' : 'neg') });
        tile.innerHTML = `<b>${ion.f}</b><span>${Array.from({ length: Math.abs(ion.q) }, () => `<i>${sign > 0 ? '+' : '−'}</i>`).join('')}</span>`;
        r.append(tile);
      }
      r.append(UI.el('span', { class: 'tile-sum' }, `${n} × (${sign > 0 ? '+' : '−'}${Math.abs(ion.q)}) = ${sign > 0 ? '+' : '−'}${n * Math.abs(ion.q)}`));
      return r;
    };
    tiles.append(row(C, nc, 1), row(Aion, na, -1));
    const name = C.id === 'H' ? (ACID_NAMES[Aion.id] || '') : `${C.name} ${Aion.name}`;
    const cname = C.name.replace(/\(.*\)/, '');
    res.innerHTML = `<div class="bigformula">${html} <span>${name}</span></div>
      Total charge: (+${nc * C.q}) + (−${na * -Aion.q}) = <b>0</b> ✔<br>
      <b>Swap and drop:</b> ${C.f} has charge ${C.q}, ${Aion.f} has charge ${-Aion.q} → ${Math.abs(Aion.q)} ${cname} : ${C.q} ${Aion.name}${gcd(C.q, -Aion.q) > 1 ? ', then simplify (divide by ' + gcd(C.q, -Aion.q) + ')' : ''} → ${nc} : ${na}.
      ${(C.poly && nc > 1) || (Aion.poly && na > 1) ? '<br><b>Brackets</b> go round a compound ion when there is more than one of it.' : ''}
      <br>${solubility(C, Aion)}`;
  }
  build();
  cleanups.push(() => stop && stop());
}

// ---------- Journey into the atom ----------
Anims.journey = function (host) {
  const W = 780, H = 400;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const STAGES = [
    ['A piece of copper wire', 'Everything around you is made of <b>atoms</b>. Let’s zoom into a copper wire and take one atom apart. Press <b>Next ▶</b>.'],
    ['Zoom in ×10 000 000', 'Copper is made of <b>copper atoms</b> packed closely in a regular arrangement. A 1 cm length of wire has about <b>40 million atoms</b> side by side!'],
    ['One copper atom', 'Each atom has a tiny, dense <b>nucleus</b> in the centre, surrounded by <b>electrons</b> moving in <b>shells</b> (energy levels). The atom is about 0.0000000003 m across and is <b>mostly empty space</b>.'],
    ['Take the electrons away', 'Copper has <b>29 electrons</b>. Each electron has a charge of <b>−1</b> and almost no mass (<b>1/1836</b> of a proton). Electrons are involved in all chemical reactions and bonding.'],
    ['Zoom into the nucleus', 'The nucleus is about <b>100 000 times smaller</b> than the atom but holds almost all of its mass. It contains <b>protons</b> (charge <b>+1</b>, mass 1) and <b>neutrons</b> (charge <b>0</b>, mass 1).'],
    ['Count the particles', 'Copper: <b>29 protons</b> → proton (atomic) number = <b>29</b>. <b>35 neutrons</b> → mass (nucleon) number = 29 + 35 = <b>64</b>. Symbol: <sup>64</sup><sub>29</sub>Cu. (Copper-65, with 36 neutrons, is an <b>isotope</b>.)'],
    ['Put it back together', '29 protons (+29) and 29 electrons (−29) → the atom is <b>neutral</b>. If an atom loses or gains electrons it becomes an <b>ion</b> — e.g. copper loses 2 to form <b>Cu<sup>2+</sup></b>.'],
  ];
  let s = 0, p = 0, auto = false, autoT = 0;
  const prev = UI.button(bar, '◀ Back', () => go(s - 1), 'btn ghost');
  const next = UI.button(bar, 'Next ▶', () => go(s + 1));
  const autoBtn = UI.button(bar, '▶ Auto-play', () => { auto = !auto; autoBtn.textContent = auto ? '⏸ Pause' : '▶ Auto-play'; if (auto && s === STAGES.length - 1) go(0); }, 'btn ghost');
  const dots = UI.el('span', { class: 'dots' }); bar.append(dots);
  function go(n) { s = UI.clamp(n, 0, STAGES.length - 1); p = 0; autoT = 0; upd(); }
  function upd() {
    info.innerHTML = `<b>Step ${s + 1} of ${STAGES.length}: ${STAGES[s][0]}</b><br>${STAGES[s][1]}`;
    dots.innerHTML = STAGES.map((_, i) => `<i class="${i === s ? 'on' : ''}"></i>`).join('');
    prev.disabled = s === 0; next.disabled = s === STAGES.length - 1;
  }
  upd();
  const SH = [2, 8, 18, 1];
  const shellRad = (i, k) => (46 + i * 34) * k;
  const nucleons = Array.from({ length: 64 }, (_, i) => ({ p: Math.floor((i + 1) * 29 / 64) > Math.floor(i * 29 / 64), a: i * 2.39996, d: Math.sqrt(i + 0.5) }));
  const elecPos = [];
  SH.forEach((cnt, i) => { for (let k = 0; k < cnt; k++) elecPos.push({ shell: i, k, cnt }); });

  function drawAtom(cx, cy, k, t, out, nucZoom, sep) {
    // out: 0 = electrons in shells, 1 = pulled out into a column at the right
    if (out < 1) SH.forEach((_, i) => { ctx.globalAlpha = 1 - out; UI.circle(ctx, cx, cy, shellRad(i, k), null, '#334155', 1.2); ctx.globalAlpha = 1; });
    elecPos.forEach((e, idx) => {
      const a = t * (0.6 / (e.shell + 1)) + (e.k / e.cnt) * Math.PI * 2;
      const x0 = cx + shellRad(e.shell, k) * Math.cos(a), y0 = cy + shellRad(e.shell, k) * Math.sin(a);
      const x1 = 640 + (idx % 3) * 20, y1 = 70 + Math.floor(idx / 3) * 26;
      const q = UI.ease(out);
      UI.circle(ctx, UI.lerp(x0, x1, q), UI.lerp(y0, y1, q), 5, UI.C.dot);
    });
    // nucleus
    const nr = UI.lerp(16 * k, 120, nucZoom) / 9;
    nucleons.forEach((n, i) => {
      let x = cx + Math.cos(n.a) * n.d * nr * 1.1, y = cy + Math.sin(n.a) * n.d * nr * 1.1;
      if (sep > 0) {
        const pi = nucleons.slice(0, i).filter((m) => m.p === n.p).length;
        const tx = (n.p ? 120 : 390) + (pi % 6) * 26, ty = 110 + Math.floor(pi / 6) * 26;
        x = UI.lerp(x, tx, UI.ease(sep)); y = UI.lerp(y, ty, UI.ease(sep));
      }
      UI.circle(ctx, x, y, Math.max(2, nr * 0.95), n.p ? '#ef4444' : '#9ca3af', '#0b1220', 1);
    });
  }

  return UI.loop((dt, t) => {
    p = Math.min(1, p + dt / 1.4);
    if (auto) { autoT += dt; if (autoT > 6) { if (s < STAGES.length - 1) go(s + 1); else { auto = false; autoBtn.textContent = '▶ Auto-play'; } } }
    UI.clear(ctx, W, H);
    const e = UI.ease(p);
    if (s === 0) {
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#b45309'; ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(120, 260); ctx.bezierCurveTo(300, 120, 450, 330, 660, 170); ctx.stroke();
      ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(120, 254); ctx.bezierCurveTo(300, 114, 450, 324, 660, 164); ctx.stroke();
      ctx.lineCap = 'butt';
      UI.roundRect(ctx, 380, 200, 50, 50, 4, null, '#fff', 2);
      UI.text(ctx, 'copper wire', 390, 340, { size: 16, color: UI.C.dim });
    } else if (s === 1) {
      const r = UI.lerp(4, 22, e);
      for (let row = -6; row <= 6; row++) for (let col = -12; col <= 12; col++) {
        const x = W / 2 + col * r * 2 + (row % 2 ? r : 0) + Math.sin(t * 5 + row + col) * 0.8, y = H / 2 + row * r * 1.75;
        if (x < -r || x > W + r || y < -r || y > H + r) continue;
        UI.circle(ctx, x, y, r * 0.95, '#c2703d', '#f59e0b', 1);
      }
      if (p >= 1) UI.text(ctx, 'each ball = one copper atom', W / 2, H - 16, { size: 14, color: '#fff' });
    } else if (s === 2) {
      drawAtom(W / 2 - 60, H / 2, UI.lerp(0.2, 1.3, e) / 1.3 * 1.25, t, 0, 0, 0);
      if (p >= 1) {
        UI.arrow(ctx, 610, 80, 470, 118, UI.C.dim); UI.text(ctx, 'electron shells', 620, 70, { size: 13, align: 'left' });
        UI.arrow(ctx, 610, 300, W / 2 - 50, H / 2 + 8, UI.C.dim); UI.text(ctx, 'nucleus', 620, 305, { size: 13, align: 'left' });
      }
    } else if (s === 3) {
      drawAtom(W / 2 - 120, H / 2, 1.25 * (1 - 0.3 * e), t, e, 0, 0);
      UI.text(ctx, '29 electrons', 660, 40, { size: 15, color: UI.C.dot });
      UI.text(ctx, 'charge −1 each, mass ≈ 0', 660, 360, { size: 12, color: UI.C.dim });
    } else if (s === 4 || s === 5) {
      const z = s === 4 ? e : 1, sep = s === 5 ? e : 0;
      drawAtom(W / 2 - 120 + 40 * z, H / 2, 0.875, t, 1, z, sep);
      if (s === 5 && p >= 1) {
        UI.text(ctx, '29 protons  (+1, mass 1)', 185, 70, { size: 15, color: '#f87171' });
        UI.text(ctx, '35 neutrons  (0, mass 1)', 455, 70, { size: 15, color: '#cbd5e1' });
        UI.text(ctx, '29 electrons', 680, 40, { size: 13, color: UI.C.dot });
      }
    } else {
      const back = e;
      drawAtom(W / 2 - 60, H / 2, 1.25, t, 1 - back, 1 - back, 1 - back);
      if (p >= 1) {
        UI.text(ctx, '+29', 120, 60, { size: 26, color: '#f87171' }); UI.text(ctx, '−29', 120, 100, { size: 26, color: UI.C.dot });
        UI.text(ctx, '= 0 (neutral)', 120, 140, { size: 18 });
      }
    }
  });
};
