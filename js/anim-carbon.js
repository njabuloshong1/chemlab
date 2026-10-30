'use strict';
// Diamond vs graphite: why graphite conducts, labelled structure figures, and how diamond is made from carbon.

// ---------- static labelled figures (SVG, prints well) ----------
// Projects a lattice from anim-giant.js at a fixed angle and returns an SVG string.
function svgLatticeFigure(lat, { w = 340, h = 280, scale = 95, ay = 0.55, ax = -0.4, r = 7, hi = -1, hiCol = '#f59e0b', col = '#94a3b8', bond = '#64748b' } = {}) {
  const P = lat.atoms.map((p) => {
    const x1 = p.x * Math.cos(ay) + p.z * Math.sin(ay), z1 = -p.x * Math.sin(ay) + p.z * Math.cos(ay);
    const y2 = p.y * Math.cos(ax) - z1 * Math.sin(ax), z2 = p.y * Math.sin(ax) + z1 * Math.cos(ax);
    const f = 4 / (4 + z2);
    return { x: w / 2 + x1 * scale * f, y: h / 2 + y2 * scale * f, z: z2, f };
  });
  const hiN = new Set(hi >= 0 ? lat.bonds.filter(([a, b]) => a === hi || b === hi).flat() : []);
  const items = [];
  for (const [a, b] of lat.bonds) {
    const isHi = a === hi || b === hi;
    items.push([(P[a].z + P[b].z) / 2 + 0.001, `<line x1="${P[a].x.toFixed(1)}" y1="${P[a].y.toFixed(1)}" x2="${P[b].x.toFixed(1)}" y2="${P[b].y.toFixed(1)}" stroke="${isHi ? hiCol : bond}" stroke-width="${(isHi ? 3.4 : 2.2) * (P[a].f + P[b].f) / 2}" stroke-linecap="round"/>`]);
  }
  lat.atoms.forEach((a, i) => {
    const c = i === hi ? hiCol : hiN.has(i) ? '#fcd34d' : col;
    items.push([P[i].z, `<circle cx="${P[i].x.toFixed(1)}" cy="${P[i].y.toFixed(1)}" r="${(r * P[i].f).toFixed(1)}" fill="${c}" stroke="#0b1220" stroke-width="1"/>`]);
  });
  items.sort((u, v) => v[0] - u[0]);
  return items.map((x) => x[1]).join('');
}

// Graphite as three tilted hexagonal sheets (textbook style), with weak forces between them.
function graphiteSheetsSvg() {
  const b = 16, pts = [];
  for (let r = -4; r <= 4; r++) for (let q = -6; q <= 6; q++) {
    const x0 = (q + r / 2) * b * Math.sqrt(3), z0 = r * b * 1.5;
    for (const dz of [0, b]) { const x = x0, z = z0 + dz; if (Math.abs(x) < 105 && Math.abs(z) < 42) pts.push([x, z]); }
  }
  const bonds = [];
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (Math.abs(Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) - b) < 0.5) bonds.push([i, j]);
  const proj = ([x, z], y0) => [165 + x + z * 0.45, y0 + z * 0.62];
  const centre = pts.reduce((best, p, i) => (Math.hypot(p[0], p[1]) < Math.hypot(pts[best][0], pts[best][1]) ? i : best), 0);
  let svg = '';
  const layers = [228, 156, 84]; // bottom to top, so the top sheet is drawn last
  layers.forEach((y0, L) => {
    const top = L === layers.length - 1;
    for (const [i, j] of bonds) {
      const [x1, y1] = proj(pts[i], y0), [x2, y2] = proj(pts[j], y0);
      const hi = top && (i === centre || j === centre);
      svg += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${hi ? '#f59e0b' : '#64748b'}" stroke-width="${hi ? 3 : 1.6}"/>`;
    }
    pts.forEach((p, i) => { const [x, y] = proj(p, y0); svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${top && i === centre ? 5 : 3.2}" fill="${top && i === centre ? '#f59e0b' : '#cbd5e1'}"/>`; });
    if (L > 0) for (const x of [-70, 0, 70]) {
      const [xa, ya] = proj([x, 0], layers[L - 1]), [xb, yb] = proj([x, 0], y0);
      svg += `<line x1="${xa}" y1="${ya - 6}" x2="${xb}" y2="${yb + 6}" stroke="#a78bfa" stroke-width="1.2" stroke-dasharray="3 4"/>`;
    }
  });
  const [ex, ey] = proj(pts[centre], 84);
  svg += `<circle cx="${ex + 10}" cy="${ey - 12}" r="4.5" fill="#fde047"/><text x="${ex + 18}" y="${ey - 22}" fill="#fde047" font-size="11.5" font-family="Segoe UI, sans-serif">delocalised electron</text>`;
  svg += `<text x="330" y="${(156 + 228) / 2 + 4}" fill="#c4b5fd" font-size="11.5" font-family="Segoe UI, sans-serif" text-anchor="end">weak forces</text><text x="330" y="${(156 + 228) / 2 + 18}" fill="#c4b5fd" font-size="11.5" font-family="Segoe UI, sans-serif" text-anchor="end">between layers</text>`;
  return svg;
}

function carbonFigures() {
  const dia = diamondLattice(2), gra = graphiteLayers(3, 3);
  const centre = dia.atoms.map((a, i) => i).sort((i, j) => Math.hypot(dia.atoms[i].x, dia.atoms[i].y, dia.atoms[i].z) - Math.hypot(dia.atoms[j].x, dia.atoms[j].y, dia.atoms[j].z))[0];
  const gc = gra.atoms.map((a, i) => i).filter((i) => gra.atoms[i].layer === 2).sort((i, j) => Math.hypot(gra.atoms[i].x, gra.atoms[i].z) - Math.hypot(gra.atoms[j].x, gra.atoms[j].z))[0];
  const label = (x, y, t, anchor = 'start', c = '#e2e8f0') => `<text x="${x}" y="${y}" fill="${c}" font-size="12.5" font-family="Segoe UI, sans-serif" text-anchor="${anchor}">${t}</text>`;
  const fig = (svg, title, notes) => `<figure class="carbon-fig"><svg viewBox="0 0 340 300" role="img" aria-label="${title}">${svg}</svg><figcaption><b>${title}</b><br>${notes}</figcaption></figure>`;
  const diamondSvg = `<rect width="340" height="300" rx="10" fill="#0b1220"/>${svgLatticeFigure(dia, { hi: centre, h: 270 })}
    ${label(12, 22, 'DIAMOND', 'start', '#fcd34d')}${label(12, 288, 'Highlighted atom: 4 bonds — all 4 outer electrons used', 'start', '#cbd5e1')}`;
  void gc;
  const graphiteSvg = `<rect width="340" height="300" rx="10" fill="#0b1220"/>${graphiteSheetsSvg()}
    ${label(12, 22, 'GRAPHITE', 'start', '#fcd34d')}
    ${label(12, 288, 'Highlighted atom: 3 bonds + 1 delocalised electron', 'start', '#cbd5e1')}`;
  return `<div class="carbon-figs">${fig(diamondSvg, 'Figure 1 — Diamond', 'Each carbon atom is covalently bonded to <b>4</b> others in a 3D (tetrahedral) network. No free electrons.')}
    ${fig(graphiteSvg, 'Figure 2 — Graphite', 'Each carbon atom is bonded to <b>3</b> others in flat hexagonal layers. The 4th outer electron is <b>delocalised</b>. Layers are held by weak forces.')}</div>`;
}

// ---------- animation: why graphite conducts and diamond does not ----------
Anims.conduct = function (host) {
  const W = 780, H = 420;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const STEPS = [
    ['Every carbon atom has 4 outer electrons', 'Carbon is <b>2,4</b>. Both diamond and graphite are made of carbon atoms, and each carbon atom brings <b>4 outer electrons</b>. The difference is <b>what happens to those 4 electrons</b>.'],
    ['Diamond: all 4 electrons are used in bonds', 'In diamond each carbon is bonded to <b>4</b> other carbon atoms. Each bond is a <b>shared pair</b> — one electron from each atom. All <b>4</b> outer electrons are <b>locked in bonds</b>, held between two atoms. <b>None are left over to move.</b>'],
    ['Graphite: 3 electrons in bonds, 1 spare', 'In graphite each carbon is bonded to only <b>3</b> other carbon atoms. Three electrons are used in bonds, but the <b>4th electron is not in a bond</b>. It becomes <b>delocalised</b>: free to move along the layer.'],
    ['Billions of spare electrons → a “sea” of moving electrons', 'Every carbon atom in a graphite layer gives one delocalised electron, so each layer has a <b>sea of delocalised electrons</b> that can move <b>anywhere along the layer</b> — a bit like the electrons in a metal.'],
    ['Connect a battery', 'Electricity is a flow of charge. In graphite the delocalised electrons <b>move through the structure</b> towards the positive terminal → current flows → <b>the bulb lights</b>. In diamond every electron is held in a bond → <b>no charged particles can move</b> → no current → <b>the bulb stays off</b>.'],
    ['The exam answer', '<b>Graphite conducts:</b> each carbon atom forms only 3 covalent bonds, so one outer electron per atom is <b>delocalised</b>; these electrons <b>can move</b> through the structure and carry charge.<br><b>Diamond does not conduct:</b> each carbon atom forms 4 covalent bonds, so <b>all</b> outer electrons are used in bonding; there are <b>no delocalised electrons (and no ions)</b> to carry charge.'],
  ];
  let s = 0, p = 0;
  const prev = UI.button(bar, '◀ Back', () => go(s - 1), 'btn ghost');
  const next = UI.button(bar, 'Next ▶', () => go(s + 1));
  UI.button(bar, '↻ Replay step', () => (p = 0), 'btn ghost');
  const dots = UI.el('span', { class: 'dots' }); bar.append(dots);
  function go(n) { s = UI.clamp(n, 0, STEPS.length - 1); p = 0; upd(); }
  function upd() {
    info.innerHTML = `<b>Step ${s + 1} of ${STEPS.length}: ${STEPS[s][0]}</b><br>${STEPS[s][1]}`;
    dots.innerHTML = STEPS.map((_, i) => `<i class="${i === s ? 'on' : ''}"></i>`).join('');
    prev.disabled = s === 0; next.disabled = s === STEPS.length - 1;
  }
  upd();

  const atom = (x, y, r, col = '#cbd5e1', lab = 'C') => { UI.circle(ctx, x, y, r, col, '#0b1220', 1.5); if (lab) UI.text(ctx, lab, x, y, { size: r * 0.9, color: '#0b1220' }); };
  const eDot = (x, y, col = UI.C.dot) => UI.circle(ctx, x, y, 5, col, '#0b1220', 1);
  const eCross = (x, y) => UI.cross(ctx, x, y, 4.5, UI.C.cross, 2.2);
  // central atom with n bonds; shared pair drawn on each bond (dot from centre, cross from neighbour)
  function bondedAtom(cx, cy, n, e, angles) {
    const L = 105;
    angles.slice(0, n).forEach((a) => {
      const x = cx + Math.cos(a) * L * e, y = cy + Math.sin(a) * L * e;
      UI.line(ctx, cx, cy, x, y, '#64748b', 4);
      atom(x, y, 20, '#94a3b8');
      const mx = cx + Math.cos(a) * L * 0.5, my = cy + Math.sin(a) * L * 0.5, px = -Math.sin(a) * 7, py = Math.cos(a) * 7;
      if (e > 0.6) { eDot(mx + px, my + py); eCross(mx - px, my - py); }
    });
    atom(cx, cy, 26, '#fbbf24');
  }
  const tetra = [-2.2, -0.9, 0.55, 2.3];
  const tri = [-Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6];
  // graphite layer electrons
  const sea = Array.from({ length: 40 }, () => ({ x: UI.rand(430, 740), y: UI.rand(150, 290), vx: UI.rand(-40, 40), vy: UI.rand(-40, 40) }));

  function hexLayer(x0, y0, cols, rows, b) {
    const pts = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = x0 + c * b * Math.sqrt(3) + (r % 2) * b * Math.sqrt(3) / 2;
      pts.push([x, y0 + r * b * 1.5 - b / 2], [x, y0 + r * b * 1.5 + b / 2]);
    }
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      if (Math.abs(Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) - b) < 1) UI.line(ctx, pts[i][0], pts[i][1], pts[j][0], pts[j][1], '#64748b', 2.5);
    }
    for (const [x, y] of pts) UI.circle(ctx, x, y, 6, '#cbd5e1');
    return pts;
  }
  function squareNet(x0, y0, cols, rows, sp) {
    const pts = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = x0 + c * sp, y = y0 + r * sp;
      if (c < cols - 1) UI.line(ctx, x, y, x + sp, y, '#64748b', 2.5);
      if (r < rows - 1) UI.line(ctx, x, y, x, y + sp, '#64748b', 2.5);
      pts.push([x, y]);
    }
    for (const [x, y] of pts) UI.circle(ctx, x, y, 6, '#cbd5e1');
    return pts;
  }
  function circuit(x0, x1, yTop, yBot, on, t) {
    UI.line(ctx, x0, yTop, x0, yBot, '#475569', 3); UI.line(ctx, x1, yTop, x1, yBot, '#475569', 3);
    UI.line(ctx, x0, yBot, x1, yBot, '#475569', 3);
    const bx = (x0 + x1) / 2, by = yBot;
    // battery
    ctx.fillStyle = '#0b1220'; ctx.fillRect(bx - 40, by - 14, 80, 28);
    UI.line(ctx, bx - 6, by - 14, bx - 6, by + 14, '#e2e8f0', 3); UI.line(ctx, bx + 6, by - 8, bx + 6, by + 8, '#e2e8f0', 5);
    UI.text(ctx, '+', bx - 18, by - 22, { size: 14 }); UI.text(ctx, '−', bx + 18, by - 22, { size: 14 });
    // bulb on the left wire
    const gy = (yTop + yBot) / 2 + 30;
    if (on) { const gl = ctx.createRadialGradient(x0, gy, 4, x0, gy, 46); gl.addColorStop(0, 'rgba(253,224,71,0.95)'); gl.addColorStop(1, 'rgba(253,224,71,0)'); ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(x0, gy, 46, 0, Math.PI * 2); ctx.fill(); }
    UI.circle(ctx, x0, gy, 16, on ? '#fde047' : '#1f2937', '#e2e8f0', 2);
    UI.text(ctx, on ? 'ON' : 'off', x0, gy, { size: 10, color: '#0b1220' });
    if (on) for (let k = 0; k < 8; k++) {
      const path = (t * 60 + k * 70) % 560; // electrons in the wire
      let x, y;
      if (path < 140) { x = x1; y = yTop + path; } else if (path < 140 + (x1 - x0)) { x = x1 - (path - 140); y = yBot; } else { x = x0; y = yBot - (path - 140 - (x1 - x0)); }
      if (y >= yTop) UI.circle(ctx, x, y, 3.5, UI.C.dot);
    }
  }

  return UI.loop((dt, t) => {
    p = Math.min(1, p + dt / 1.4);
    const e = UI.ease(p);
    UI.clear(ctx, W, H);
    UI.line(ctx, W / 2, 20, W / 2, H - 20, '#1e293b', 2);
    UI.text(ctx, 'DIAMOND', W / 4, 26, { size: 16, color: '#fcd34d' });
    UI.text(ctx, 'GRAPHITE', (3 * W) / 4, 26, { size: 16, color: '#fcd34d' });

    if (s === 0) {
      for (const cx of [W / 4, (3 * W) / 4]) {
        UI.circle(ctx, cx, 210, 80, '#33415522', '#64748b', 2);
        for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 - Math.PI / 4; eDot(cx + 80 * Math.cos(a), 210 + 80 * Math.sin(a)); }
        atom(cx, 210, 26, '#fbbf24');
        UI.text(ctx, 'C: 2,4 → 4 outer electrons ●', cx, 330, { size: 14, color: UI.C.dot });
      }
    } else if (s === 1 || s === 2) {
      // diamond side (always shown from step 2 on)
      bondedAtom(W / 4, 215, 4, s === 1 ? e : 1, tetra);
      UI.text(ctx, '4 bonds = 4 shared pairs', W / 4, 352, { size: 14 });
      UI.text(ctx, 'all 4 outer electrons used ✓', W / 4, 375, { size: 14, color: UI.C.green });
      UI.text(ctx, '● = electron from the yellow atom   × = from its neighbour', W / 4, 398, { size: 11, color: UI.C.dim });
      if (s === 2) {
        const cx = (3 * W) / 4, cy = 215;
        bondedAtom(cx, cy, 3, e, tri);
        // the spare 4th electron floats off
        const fx = cx + Math.sin(t * 3) * 6, fy = cy + 40 + e * 45;
        eDot(fx, fy, '#fde047');
        UI.circle(ctx, fx, fy, 11, null, '#fde047', 1.5);
        UI.text(ctx, '4th electron: NOT in a bond', cx, 352, { size: 14, color: '#fde047' });
        UI.text(ctx, '→ delocalised (free to move)', cx, 375, { size: 14, color: '#fde047' });
      } else {
        UI.text(ctx, '(graphite next…)', (3 * W) / 4, 215, { size: 14, color: UI.C.dim });
      }
    } else if (s === 3) {
      squareNet(70, 130, 7, 5, 40);
      UI.text(ctx, 'every electron held in a bond', W / 4, 352, { size: 14, color: UI.C.dim });
      UI.text(ctx, 'no free electrons', W / 4, 375, { size: 14, color: '#f87171' });
      hexLayer(420, 150, 9, 4, 22);
      for (const el of sea) {
        el.x += el.vx * dt; el.y += el.vy * dt;
        if (el.x < 425 || el.x > 745) el.vx *= -1;
        if (el.y < 142 || el.y > 255) el.vy *= -1; el.y = UI.clamp(el.y, 142, 255);
        ctx.globalAlpha = UI.clamp(e * 1.4, 0, 1); eDot(el.x, el.y, '#fde047'); ctx.globalAlpha = 1;
      }
      UI.text(ctx, 'sea of delocalised electrons ●', (3 * W) / 4, 352, { size: 14, color: '#fde047' });
      UI.text(ctx, 'free to move along the layer', (3 * W) / 4, 375, { size: 14, color: '#fde047' });
    } else if (s === 4) {
      // diamond circuit: off
      squareNet(95, 110, 6, 4, 40);
      circuit(60, 330, 110, 330, false, t);
      UI.text(ctx, 'no moving charge → bulb OFF', W / 4, 380, { size: 14, color: '#f87171' });
      // graphite circuit: on, electrons drift towards + (left)
      hexLayer(455, 128, 7, 3, 22);
      for (const el of sea) {
        el.x -= 70 * dt; if (el.x < 440) el.x = 740;
        el.y += el.vy * dt * 0.3; if (el.y < 118 || el.y > 200) el.vy *= -1;
        eDot(el.x, UI.clamp(el.y, 118, 200), '#fde047');
      }
      circuit(430, 750, 110, 330, true, t);
      UI.arrow(ctx, 680, 290, 520, 290, '#fde047', 2.5);
      UI.text(ctx, 'electrons flow', 600, 305, { size: 12, color: '#fde047' });
      UI.text(ctx, 'current flows → bulb ON', (3 * W) / 4, 380, { size: 14, color: UI.C.green });
    } else {
      const rows = [['', 'Diamond', 'Graphite'], ['Bonds per C atom', '4', '3'], ['Outer electrons in bonds', 'all 4', '3'], ['Spare electron per atom', 'none', '1 (delocalised)'], ['Charged particles free to move?', 'NO', 'YES'], ['Conducts electricity?', '✗ no', '✓ yes']];
      rows.forEach((r, i) => r.forEach((cell, j) => {
        const x = [60, 400, 600][j], y = 70 + i * 50;
        if (i === 0 || j === 0) UI.text(ctx, cell, x, y, { size: 15, align: j === 0 ? 'left' : 'center', color: i === 0 ? '#fcd34d' : UI.C.text });
        else UI.text(ctx, cell, x, y, { size: 16, color: cell.startsWith('✓') || cell === 'YES' ? UI.C.green : cell.startsWith('✗') || cell === 'NO' || cell === 'none' ? '#f87171' : UI.C.text });
        if (j === 0 && i > 0) UI.line(ctx, 50, y - 25, 730, y - 25, '#1e293b', 1);
      }));
    }
  });
};

// ---------- animation: making diamond from carbon ----------
Anims.makediamond = function (host) {
  const W = 780, H = 420;
  const { ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const STEPS = [
    ['Start with carbon (graphite)', 'Diamond is made of carbon, so we start with carbon — usually <b>graphite</b>. Side view: flat layers of carbon atoms. Each atom has <b>3 bonds</b> and <b>1 delocalised electron</b> (yellow). Graphite <b>conducts</b>.'],
    ['Squeeze and heat it — enormously', 'Deep in the Earth (about <b>150 km down</b>) carbon is under huge <b>pressure</b> (about <b>50 000 times</b> atmospheric pressure) and <b>temperature</b> (about <b>1200 °C</b>). The layers are forced <b>much closer together</b>.'],
    ['New bonds form between the layers', 'The layers pucker, and each carbon atom forms a <b>4th covalent bond</b> to an atom in the next layer. The <b>delocalised electron is used to make that bond</b>, so the yellow electrons disappear. Now every atom has <b>4 bonds</b>.'],
    ['Diamond!', 'Every carbon is now bonded to <b>4</b> others in a 3D network: <b>diamond</b>. No delocalised electrons → <b>does not conduct</b>. It is the <b>same element</b> (carbon) — only the bonding has changed. Volcanic eruptions bring natural diamonds up towards the surface.'],
    ['Diamonds made in factories', 'Synthetic diamonds are made in two main ways: <b>(1) high pressure, high temperature</b> — graphite is squeezed in a huge press at about 1500 °C, often with a metal catalyst; <b>(2) chemical vapour deposition</b> — a carbon-containing gas such as methane is broken up, and carbon atoms are deposited one layer at a time onto a small diamond “seed”. Most diamonds in cutting tools are made this way. <span class="dim">(For interest — beyond the IGCSE syllabus.)</span>'],
  ];
  let s = 0, p = 0;
  const prev = UI.button(bar, '◀ Back', () => go(s - 1), 'btn ghost');
  const next = UI.button(bar, 'Next ▶', () => go(s + 1));
  UI.button(bar, '↻ Replay step', () => (p = 0), 'btn ghost');
  const dots = UI.el('span', { class: 'dots' }); bar.append(dots);
  function go(n) { s = UI.clamp(n, 0, STEPS.length - 1); p = 0; upd(); }
  function upd() {
    info.innerHTML = `<b>Step ${s + 1} of ${STEPS.length}: ${STEPS[s][0]}</b><br>${STEPS[s][1]}`;
    dots.innerHTML = STEPS.map((_, i) => `<i class="${i === s ? 'on' : ''}"></i>`).join('');
    prev.disabled = s === 0; next.disabled = s === STEPS.length - 1;
  }
  upd();
  const COLS = 12, LAYERS = 4, SP = 38, X0 = 120;

  // squeeze: 0 = graphite spacing, 1 = squeezed; pucker: 0 flat, 1 zigzag; bondsIn: 0..1 inter-layer bonds
  function scene(squeeze, pucker, bondsIn, t) {
    const gap = UI.lerp(78, 44, squeeze), top = 210 - gap * (LAYERS - 1) / 2;
    const pos = (L, c) => [X0 + c * SP, top + L * gap + (c % 2 ? 1 : -1) * pucker * 9 * (L % 2 ? -1 : 1)];
    // inter-layer bonds: atoms that pucker towards each other bond
    for (let L = 0; L < LAYERS - 1; L++) for (let c = 0; c < COLS; c++) {
      const towards = (c % 2 ? 1 : -1) * (L % 2 ? -1 : 1) > 0; // atom in layer L moving down
      if (!towards) continue;
      const [x1, y1] = pos(L, c), [x2, y2] = pos(L + 1, c);
      if (bondsIn > 0) { ctx.globalAlpha = bondsIn; UI.line(ctx, x1, y1, x2, y2, '#f59e0b', 3); ctx.globalAlpha = 1; }
      else if (squeeze < 0.2) { UI.line(ctx, x1, y1 + 8, x2, y2 - 8, '#a78bfa66', 1.3, [4, 5]); }
    }
    for (let L = 0; L < LAYERS; L++) {
      for (let c = 0; c < COLS - 1; c++) { const [x1, y1] = pos(L, c), [x2, y2] = pos(L, c + 1); UI.line(ctx, x1, y1, x2, y2, '#94a3b8', 3); }
      for (let c = 0; c < COLS; c++) {
        const [x, y] = pos(L, c);
        UI.circle(ctx, x, y, 9, '#cbd5e1', '#0b1220', 1);
        if (bondsIn < 1) { ctx.globalAlpha = 1 - bondsIn; UI.circle(ctx, x + Math.sin(t * 3 + c + L) * 10, y - 16, 3.5, '#fde047'); ctx.globalAlpha = 1; }
      }
    }
    const bonds = bondsIn >= 1 ? 4 : 3;
    UI.roundRect(ctx, 600, 70, 160, 120, 10, '#111a2e', UI.C.line);
    UI.text(ctx, `bonds per C: ${bonds}`, 680, 98, { size: 15, color: bonds === 4 ? '#f59e0b' : UI.C.text });
    UI.text(ctx, bonds === 4 ? 'no free electrons' : '1 delocalised e⁻', 680, 126, { size: 13, color: bonds === 4 ? '#f87171' : '#fde047' });
    UI.text(ctx, bonds === 4 ? 'does NOT conduct' : 'conducts', 680, 154, { size: 14, color: bonds === 4 ? '#f87171' : UI.C.green });
    UI.text(ctx, bonds === 4 ? 'DIAMOND' : 'GRAPHITE', 680, 178, { size: 12, color: UI.C.dim });
  }
  function gauges(level) {
    UI.text(ctx, 'pressure', 680, 230, { size: 12, color: UI.C.dim });
    UI.roundRect(ctx, 610, 240, 140, 14, 7, '#1e293b'); UI.roundRect(ctx, 610, 240, 140 * level, 14, 7, '#f87171');
    UI.text(ctx, `${Math.round(level * 50000).toLocaleString()} atm`, 680, 268, { size: 12 });
    UI.text(ctx, 'temperature', 680, 296, { size: 12, color: UI.C.dim });
    UI.roundRect(ctx, 610, 306, 140, 14, 7, '#1e293b'); UI.roundRect(ctx, 610, 306, 140 * level, 14, 7, '#fb923c');
    UI.text(ctx, `${Math.round(20 + level * 1180)} °C`, 680, 334, { size: 12 });
  }
  function press(level) {
    const off = level * 26;
    ctx.fillStyle = '#334155'; ctx.fillRect(90, 40 + off, 480, 22); ctx.fillRect(90, 358 - off, 480, 22);
    UI.arrow(ctx, 330, 8 + off, 330, 38 + off, '#f87171', 3); UI.arrow(ctx, 330, 412 - off, 330, 382 - off, '#f87171', 3);
  }

  return UI.loop((dt, t) => {
    p = Math.min(1, p + dt / 2.2);
    const e = UI.ease(p);
    UI.clear(ctx, W, H);
    if (s === 0) { scene(0, 0, 0, t); UI.text(ctx, 'side view of graphite layers', 330, 395, { size: 12, color: UI.C.dim }); UI.text(ctx, 'weak forces between layers', 330, 30, { size: 12, color: '#a78bfa' }); }
    else if (s === 1) { press(e); scene(e, 0, 0, t); gauges(e); }
    else if (s === 2) { press(1); scene(1, e, UI.clamp((e - 0.4) / 0.6, 0, 1), t); gauges(1); }
    else if (s === 3) {
      // show the real 3D diamond lattice
      const dia = diamondLattice(2);
      const ay = t * 0.4, ax = -0.35;
      const P = dia.atoms.map((p2) => {
        const x1 = p2.x * Math.cos(ay) + p2.z * Math.sin(ay), z1 = -p2.x * Math.sin(ay) + p2.z * Math.cos(ay);
        const y2 = p2.y * Math.cos(ax) - z1 * Math.sin(ax), z2 = p2.y * Math.sin(ax) + z1 * Math.cos(ax);
        const f = 4 / (4 + z2);
        return { x: 330 + x1 * 140 * f * e, y: 215 + y2 * 140 * f * e, z: z2, f };
      });
      const items = dia.bonds.map(([a, b]) => [(P[a].z + P[b].z) / 2, () => UI.line(ctx, P[a].x, P[a].y, P[b].x, P[b].y, '#94a3b8', 3 * P[a].f)])
        .concat(P.map((q) => [q.z - 0.001, () => UI.circle(ctx, q.x, q.y, 10 * q.f, '#e0f2fe', '#0b1220', 1)]));
      items.sort((u, v) => v[0] - u[0]).forEach((it) => it[1]());
      UI.text(ctx, '💎 DIAMOND', 680, 110, { size: 20 });
      UI.text(ctx, 'same element: carbon', 680, 145, { size: 13, color: UI.C.dim });
      UI.text(ctx, 'each C → 4 bonds', 680, 170, { size: 13, color: '#f59e0b' });
      UI.text(ctx, 'graphite → diamond', 680, 205, { size: 13, color: UI.C.dim });
    } else {
      // factory methods
      UI.roundRect(ctx, 30, 50, 350, 300, 12, '#0f1a30', UI.C.line);
      UI.text(ctx, '1. High pressure, high temperature', 205, 78, { size: 14, color: '#fcd34d' });
      const sq = 0.5 + 0.5 * Math.sin(t * 2);
      ctx.fillStyle = '#475569'; ctx.fillRect(110, 110 + sq * 14, 190, 26); ctx.fillRect(110, 274 - sq * 14, 190, 26);
      UI.arrow(ctx, 205, 92 + sq * 14, 205, 108 + sq * 14, '#f87171', 3); UI.arrow(ctx, 205, 318 - sq * 14, 205, 302 - sq * 14, '#f87171', 3);
      ctx.fillStyle = '#1f2937'; ctx.fillRect(140, 140, 130, 130);
      UI.text(ctx, 'graphite + metal', 205, 190, { size: 12 }); UI.text(ctx, 'catalyst → diamond', 205, 210, { size: 12 });
      UI.text(ctx, '≈ 1500 °C, ≈ 60 000 atm', 205, 330, { size: 12, color: UI.C.dim });
      UI.roundRect(ctx, 400, 50, 350, 300, 12, '#0f1a30', UI.C.line);
      UI.text(ctx, '2. Chemical vapour deposition', 575, 78, { size: 14, color: '#fcd34d' });
      ctx.fillStyle = '#334155'; ctx.fillRect(460, 290, 230, 18);
      const layers = Math.floor((t * 1.5) % 6);
      for (let L = 0; L < layers; L++) for (let k = 0; k < 10; k++) UI.circle(ctx, 478 + k * 22, 280 - L * 16, 6, '#e0f2fe');
      for (let k = 0; k < 10; k++) { const y = 110 + ((t * 70 + k * 37) % 150); UI.circle(ctx, 470 + ((k * 53) % 210), y, 4, '#cbd5e1'); }
      UI.text(ctx, 'methane gas → carbon atoms', 575, 100, { size: 12, color: UI.C.dim });
      UI.text(ctx, 'diamond grows layer by layer', 575, 330, { size: 12, color: UI.C.dim });
    }
  });
};
