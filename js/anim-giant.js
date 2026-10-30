'use strict';
// "How giant covalent structures form": a step-by-step story with rotating 3D lattices
// (drag to rotate). Diamond and silicon(IV) oxide use the real diamond lattice; graphite uses stacked hexagonal layers.

// ---------- tiny 3D helpers ----------
function diamondLattice(n) {
  const basis = [[0, 0, 0], [0, 0.5, 0.5], [0.5, 0, 0.5], [0.5, 0.5, 0]];
  const pts = [];
  const seen = new Set();
  for (let i = -1; i <= n; i++) for (let j = -1; j <= n; j++) for (let k = -1; k <= n; k++) {
    for (const [bx, by, bz] of basis) for (const off of [0, 0.25]) {
      const p = [i + bx + off, j + by + off, k + bz + off];
      if (p.some((v) => v < -0.01 || v > n + 0.01)) continue;
      const key = p.map((v) => v.toFixed(2)).join(',');
      if (!seen.has(key)) { seen.add(key); pts.push(p); }
    }
  }
  const c = n / 2;
  const atoms = pts.map(([x, y, z]) => ({ x: x - c, y: y - c, z: z - c }));
  const bonds = [];
  const d0 = Math.sqrt(3) / 4;
  for (let a = 0; a < atoms.length; a++) for (let b = a + 1; b < atoms.length; b++) {
    const d = Math.hypot(atoms[a].x - atoms[b].x, atoms[a].y - atoms[b].y, atoms[a].z - atoms[b].z);
    if (Math.abs(d - d0) < 0.02) bonds.push([a, b]);
  }
  return { atoms, bonds };
}

function graphiteLayers(rings, layers) {
  const atoms = [], bonds = [];
  const b = 0.42, gap = 0.95;
  for (let L = 0; L < layers; L++) {
    const start = atoms.length;
    const shift = L % 2 ? b : 0; // ABAB stacking
    for (let q = -rings; q <= rings; q++) for (let r = -rings; r <= rings; r++) {
      // hexagonal lattice with a two-atom basis (honeycomb)
      const x0 = (q + r / 2) * b * Math.sqrt(3), z0 = r * b * 1.5;
      for (const [dx, dz] of [[0, 0], [0, b]]) {
        const x = x0 + dx + shift * Math.sqrt(3) / 2, z = z0 + dz;
        if (Math.hypot(x, z) > rings * b * 1.55) continue;
        atoms.push({ x, y: (L - (layers - 1) / 2) * gap, z, layer: L });
      }
    }
    for (let a = start; a < atoms.length; a++) for (let c = a + 1; c < atoms.length; c++) {
      if (Math.abs(Math.hypot(atoms[a].x - atoms[c].x, atoms[a].z - atoms[c].z) - b) < 0.02) bonds.push([a, c]);
    }
  }
  return { atoms, bonds };
}

function silicaLattice(n) {
  const d = diamondLattice(n);
  const atoms = d.atoms.map((p) => ({ ...p, el: 'Si' }));
  const bonds = [];
  for (const [a, b] of d.bonds) {
    const A = atoms[a], B = atoms[b];
    atoms.push({ x: (A.x + B.x) / 2, y: (A.y + B.y) / 2, z: (A.z + B.z) / 2, el: 'O' });
    const o = atoms.length - 1;
    bonds.push([a, o], [o, b]);
  }
  return { atoms, bonds };
}

Anims.giant3d = function (host) {
  const W = 780, H = 420;
  const { c, ctx } = UI.canvas(host, W, H);
  const bar = UI.bar(host), info = UI.info(host);
  const STEPS = [
    ['A carbon atom needs 4 more electrons', 'Carbon is <b>2,4</b>: it has <b>4 outer electrons</b> and needs <b>4 more</b> to fill its outer shell. Non-metals get electrons by <b>sharing</b> (covalent bonds), so each carbon atom wants to form <b>4 covalent bonds</b>.'],
    ['Carbon + hydrogen → a small molecule', 'Each hydrogen atom can only form <b>1 bond</b>. Four H atoms fill carbon’s 4 spaces and then <b>nothing else can join</b> — every atom is full. The result is a <b>small, separate molecule</b> (methane, CH₄) = a <b>simple molecular</b> substance. Weak forces between the molecules → low melting point.'],
    ['Carbon + carbon → it never stops!', 'Now carbon bonds to <b>other carbon atoms</b>. Each new carbon atom ALSO needs 4 bonds, so it bonds to more carbon atoms… which need more bonds too. <span style="color:#f87171">Red stubs</span> show bonds that still need a partner. The bonding <b>keeps going in every direction</b> until there are billions of atoms joined together.'],
    ['Diamond: a giant covalent structure', 'In <b>diamond</b> every carbon atom is joined to <b>4 others</b> by strong covalent bonds, in a 3D (tetrahedral) network. There are <b>no separate molecules</b> — the whole crystal is one giant structure. <b>Drag to rotate.</b> The highlighted atom shows its 4 bonds.'],
    ['Graphite: giant layers', 'In <b>graphite</b> each carbon forms only <b>3 bonds</b>, making flat <b>hexagonal layers</b> (each layer is a giant structure). The <b>4th outer electron is delocalised</b> (yellow dots) and moves along the layer → <b>conducts electricity</b>. Only <b>weak forces</b> hold the layers together → they <b>slide</b> → soft, slippery.'],
    ['Silicon(IV) oxide, SiO₂', '<span class="ext">Extended</span> Like diamond, but with <b>silicon</b> atoms (purple) joined through <b>oxygen</b> atoms (red). Each <b>Si forms 4 bonds</b> to O; each <b>O forms 2 bonds</b> to Si. So there are <b>twice as many O as Si</b> → formula <b>SiO₂</b> (a ratio, not a molecule). Sand and quartz.'],
    ['Why giant covalent substances are so strong', 'To melt a giant covalent substance you must <b>break many strong covalent bonds</b> (not weak forces between molecules) → <b>very high melting point</b>. Diamond and SiO₂ are <b>very hard</b> and <b>do not conduct</b> (no free electrons or ions). Graphite is the exception: it conducts because of its delocalised electrons.'],
  ];
  let s = 0, p = 0, ay = 0.6, ax = -0.35, auto = true, drag = null, grow = 0;
  const dia = diamondLattice(2), gra = graphiteLayers(3, 3), sil = silicaLattice(2);
  // order diamond atoms by distance from the centre for the "growing" step
  const order = dia.atoms.map((a, i) => i).sort((i, j) => Math.hypot(dia.atoms[i].x, dia.atoms[i].y, dia.atoms[i].z) - Math.hypot(dia.atoms[j].x, dia.atoms[j].y, dia.atoms[j].z));
  const rank = new Map(order.map((idx, r) => [idx, r]));
  const centre = order[0];
  const neighbours = (lat, i) => lat.bonds.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a));
  const siCentre = sil.atoms.map((a, i) => i).filter((i) => sil.atoms[i].el === 'Si').sort((i, j) => Math.hypot(sil.atoms[i].x, sil.atoms[i].y, sil.atoms[i].z) - Math.hypot(sil.atoms[j].x, sil.atoms[j].y, sil.atoms[j].z))[0];
  const electrons = Array.from({ length: 26 }, (_, i) => ({ layer: i % 3, x: UI.rand(-1.4, 1.4), z: UI.rand(-1.4, 1.4), vx: UI.rand(-1, 1), vz: UI.rand(-1, 1) }));

  const prev = UI.button(bar, '◀ Back', () => go(s - 1), 'btn ghost');
  const next = UI.button(bar, 'Next ▶', () => go(s + 1));
  UI.button(bar, '↻ Replay step', () => { p = 0; grow = 0; }, 'btn ghost');
  const spin = UI.check(bar, 'Auto-rotate', (v) => (auto = v)); spin.checked = true;
  const dots = UI.el('span', { class: 'dots' }); bar.append(dots);
  function go(n) { s = UI.clamp(n, 0, STEPS.length - 1); p = 0; grow = 0; upd(); }
  function upd() {
    info.innerHTML = `<b>Step ${s + 1} of ${STEPS.length}: ${STEPS[s][0]}</b><br>${STEPS[s][1]}`;
    dots.innerHTML = STEPS.map((_, i) => `<i class="${i === s ? 'on' : ''}"></i>`).join('');
    prev.disabled = s === 0; next.disabled = s === STEPS.length - 1;
  }
  upd();

  // drag to rotate (mouse and touch)
  c.style.touchAction = 'none';
  c.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, ay, ax }; c.setPointerCapture(e.pointerId); });
  c.addEventListener('pointermove', (e) => { if (!drag) return; ay = drag.ay + (e.clientX - drag.x) * 0.01; ax = UI.clamp(drag.ax + (e.clientY - drag.y) * 0.01, -1.4, 1.4); });
  c.addEventListener('pointerup', () => (drag = null));
  c.addEventListener('pointercancel', () => (drag = null));

  function project(pt, scale, cx, cy) {
    const cosy = Math.cos(ay), siny = Math.sin(ay), cosx = Math.cos(ax), sinx = Math.sin(ax);
    const x1 = pt.x * cosy + pt.z * siny, z1 = -pt.x * siny + pt.z * cosy;
    const y2 = pt.y * cosx - z1 * sinx, z2 = pt.y * sinx + z1 * cosx;
    const f = 4 / (4 + z2);
    return { x: cx + x1 * scale * f, y: cy + y2 * scale * f, z: z2, f };
  }

  // draw a lattice; style(i) returns {col, r, show}; bondStyle(a, b) returns colour or null
  function drawLattice(lat, scale, cx, cy, style, bondStyle) {
    const P = lat.atoms.map((a) => project(a, scale, cx, cy));
    const items = [];
    for (const [a, b] of lat.bonds) {
      const col = bondStyle ? bondStyle(a, b) : '#94a3b8';
      if (col) items.push({ z: (P[a].z + P[b].z) / 2 + 0.001, draw: () => UI.line(ctx, P[a].x, P[a].y, P[b].x, P[b].y, col, 3 * ((P[a].f + P[b].f) / 2)) });
    }
    lat.atoms.forEach((a, i) => {
      const st = style(i);
      if (!st.show) return;
      items.push({ z: P[i].z, draw: () => {
        const r = st.r * P[i].f;
        const g = ctx.createRadialGradient(P[i].x - r / 3, P[i].y - r / 3, r / 6, P[i].x, P[i].y, r);
        g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, st.col); g.addColorStop(1, '#0b1220');
        ctx.globalAlpha = UI.clamp(0.55 + (1 - P[i].z) * 0.25, 0.35, 1);
        UI.circle(ctx, P[i].x, P[i].y, r, g);
        ctx.globalAlpha = 1;
        if (st.label) UI.text(ctx, st.label, P[i].x, P[i].y, { size: 10 * P[i].f, color: '#0b1220' });
      } });
    });
    items.sort((u, v) => v.z - u.z).forEach((it) => it.draw());
    return P;
  }

  // 2D carbon atom with outer shell only
  function carbon2D(x, y, r, extra = 0) {
    UI.circle(ctx, x, y, r, '#33415533', '#64748b', 2);
    UI.circle(ctx, x, y, 22, '#1f2937', '#94a3b8', 1.5); UI.text(ctx, 'C', x, y, { size: 18 });
    for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 - Math.PI / 4 - 0.12; UI.circle(ctx, x + r * Math.cos(a), y + r * Math.sin(a), 6, UI.C.dot); }
    if (extra) for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2 - Math.PI / 4 + 0.25; ctx.globalAlpha = extra; UI.cross(ctx, x + r * Math.cos(a), y + r * Math.sin(a), 5, UI.C.cross, 2.2); ctx.globalAlpha = 1; }
  }

  return UI.loop((dt, t) => {
    p = Math.min(1, p + dt / 1.5);
    if (auto && !drag) ay += dt * 0.35;
    UI.clear(ctx, W, H);
    const e = UI.ease(p);

    if (s === 0) {
      carbon2D(260, 210, 90);
      for (let k = 0; k < 4; k++) {
        const a = k * Math.PI / 2 - Math.PI / 4 + 0.32, x = 260 + 90 * Math.cos(a), y = 210 + 90 * Math.sin(a);
        ctx.globalAlpha = 0.4 + 0.4 * Math.sin(t * 4 + k);
        UI.circle(ctx, x, y, 7, null, '#f87171', 2);
        ctx.globalAlpha = 1;
      }
      UI.text(ctx, 'carbon: 2,4', 260, 345, { size: 16 });
      UI.text(ctx, '● = 4 outer electrons', 470, 170, { size: 14, color: UI.C.dot, align: 'left' });
      UI.text(ctx, '○ = 4 empty spaces to fill', 470, 200, { size: 14, color: '#f87171', align: 'left' });
      UI.text(ctx, '→ wants 4 covalent bonds', 470, 240, { size: 16, align: 'left' });
    } else if (s === 1) {
      const cx = 300, cy = 210, R = 70, d = 105;
      UI.circle(ctx, cx, cy, R, '#33415533', '#64748b', 2);
      [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([dx, dy], k) => {
        const hx = cx + dx * UI.lerp(d + 120, d, e), hy = cy + dy * UI.lerp(d + 120, d, e);
        UI.circle(ctx, hx, hy, 46, '#0e749033', '#22d3ee', 2); UI.text(ctx, 'H', hx, hy, { size: 18 });
        const px = cx + dx * 72, py = cy + dy * 72;
        UI.circle(ctx, px - dy * 7, py + dx * 7, 5.5, UI.C.dot);
        if (e > 0.6) UI.cross(ctx, px + dy * 7, py - dx * 7, 5, UI.C.cross, 2.2);
      });
      UI.circle(ctx, cx, cy, 22, '#1f2937', '#94a3b8', 1.5); UI.text(ctx, 'C', cx, cy, { size: 18 });
      if (p >= 1) {
        UI.text(ctx, 'CH₄ — every atom is full', 600, 160, { size: 18 });
        UI.text(ctx, 'H can only make 1 bond', 600, 195, { size: 14, color: UI.C.dim });
        UI.text(ctx, 'nothing else can join', 600, 220, { size: 14, color: UI.C.dim });
        UI.text(ctx, '= small separate molecule', 600, 255, { size: 15, color: UI.C.green });
      }
    } else if (s === 2) {
      grow = Math.min(dia.atoms.length, grow + dt * 9);
      const shown = (i) => rank.get(i) < grow;
      const P = drawLattice(dia, 150, 330, 215,
        (i) => ({ show: shown(i), col: i === centre ? '#fbbf24' : '#cbd5e1', r: 11 }),
        (a, b) => (shown(a) && shown(b) ? '#94a3b8' : null));
      // red stubs: bonds an atom still needs
      dia.atoms.forEach((a, i) => {
        if (!shown(i)) return;
        for (const j of neighbours(dia, i)) if (!shown(j)) {
          const q = project({ x: a.x + (dia.atoms[j].x - a.x) * 0.45, y: a.y + (dia.atoms[j].y - a.y) * 0.45, z: a.z + (dia.atoms[j].z - a.z) * 0.45 }, 150, 330, 215);
          UI.line(ctx, P[i].x, P[i].y, q.x, q.y, '#f87171', 3);
        }
      });
      UI.text(ctx, `atoms joined: ${Math.floor(grow)}`, 640, 120, { size: 18 });
      UI.text(ctx, grow >= dia.atoms.length ? '…and it keeps going' : 'each new C needs more bonds', 640, 150, { size: 13, color: UI.C.dim });
      UI.text(ctx, grow >= dia.atoms.length ? 'for billions of atoms!' : '', 640, 172, { size: 13, color: UI.C.dim });
      UI.line(ctx, 590, 220, 620, 220, '#f87171', 3); UI.text(ctx, 'bond still needed', 628, 220, { size: 12, align: 'left', color: '#f87171' });
      UI.line(ctx, 590, 250, 620, 250, '#94a3b8', 3); UI.text(ctx, 'covalent bond', 628, 250, { size: 12, align: 'left', color: UI.C.dim });
    } else if (s === 3) {
      const nb = new Set(neighbours(dia, centre));
      drawLattice(dia, 150 * UI.lerp(0.7, 1, e), 330, 215,
        (i) => ({ show: true, col: i === centre ? '#fbbf24' : nb.has(i) ? '#fde68a' : '#cbd5e1', r: 11 }),
        (a, b) => ((a === centre || b === centre) ? '#fbbf24' : '#94a3b8'));
      UI.text(ctx, 'DIAMOND', 640, 110, { size: 20, color: '#e2e8f0' });
      UI.text(ctx, 'each C → 4 bonds', 640, 145, { size: 14, color: UI.C.dot });
      UI.text(ctx, 'strong covalent bonds', 640, 170, { size: 14, color: UI.C.dim });
      UI.text(ctx, 'in every direction', 640, 192, { size: 14, color: UI.C.dim });
      UI.text(ctx, 'no separate molecules', 640, 225, { size: 14, color: UI.C.green });
      UI.text(ctx, 'drag to rotate ↻', 640, 380, { size: 12, color: UI.C.dim });
    } else if (s === 4) {
      drawLattice(gra, 92, 330, 225, (i) => ({ show: true, col: '#cbd5e1', r: 8 }), () => '#94a3b8');
      // weak forces between layers
      for (let L = 0; L < 2; L++) {
        for (let k = -2; k <= 2; k++) {
          const a = project({ x: k * 0.6, y: (L - 1) * 0.95, z: 0 }, 92, 330, 225), b = project({ x: k * 0.6, y: L * 0.95, z: 0 }, 92, 330, 225);
          UI.line(ctx, a.x, a.y, b.x, b.y, '#a78bfa88', 1.5, [4, 5]);
        }
      }
      for (const el of electrons) {
        el.x += el.vx * dt * 0.8; el.z += el.vz * dt * 0.8;
        if (Math.hypot(el.x, el.z) > 1.5) { el.vx *= -1; el.vz *= -1; }
        const q = project({ x: el.x, y: (el.layer - 1) * 0.95, z: el.z }, 92, 330, 225);
        UI.circle(ctx, q.x, q.y, 3.5 * q.f, UI.C.dot);
      }
      UI.text(ctx, 'GRAPHITE', 640, 110, { size: 20 });
      UI.text(ctx, 'each C → 3 bonds (hexagons)', 640, 145, { size: 13, color: UI.C.dim });
      UI.text(ctx, '● delocalised electrons', 640, 175, { size: 13, color: UI.C.dot });
      UI.text(ctx, '→ conducts electricity', 640, 197, { size: 13, color: UI.C.dot });
      UI.text(ctx, '┆ weak forces between layers', 640, 230, { size: 13, color: '#a78bfa' });
      UI.text(ctx, '→ layers slide (lubricant)', 640, 252, { size: 13, color: '#a78bfa' });
    } else if (s === 5) {
      const nb = new Set(neighbours(sil, siCentre));
      drawLattice(sil, 150, 330, 215,
        (i) => ({ show: true, col: sil.atoms[i].el === 'Si' ? (i === siCentre ? '#fbbf24' : '#a78bfa') : (nb.has(i) ? '#fca5a5' : '#ef4444'), r: sil.atoms[i].el === 'Si' ? 10 : 6.5, label: '' }),
        (a, b) => (a === siCentre || b === siCentre ? '#fbbf24' : '#94a3b8'));
      UI.text(ctx, 'SILICON(IV) OXIDE', 640, 110, { size: 18 });
      UI.text(ctx, '● Si → 4 bonds to O', 640, 145, { size: 14, color: '#a78bfa' });
      UI.text(ctx, '● O → 2 bonds to Si', 640, 170, { size: 14, color: '#ef4444' });
      UI.text(ctx, 'ratio Si : O = 1 : 2', 640, 205, { size: 15 });
      UI.text(ctx, '→ SiO₂', 640, 232, { size: 20, color: UI.C.green });
    } else {
      // comparison: simple molecules vs giant structure
      const boxes = [[40, 'SIMPLE MOLECULES (e.g. CH₄, H₂O)', false], [410, 'GIANT COVALENT (e.g. diamond, SiO₂)', true]];
      for (const [x0, title, giant] of boxes) {
        UI.roundRect(ctx, x0, 40, 330, 250, 10, '#0f1a30', UI.C.line);
        UI.text(ctx, title, x0 + 165, 62, { size: 13, color: giant ? UI.C.dot : UI.C.cross });
        if (!giant) {
          for (let k = 0; k < 6; k++) {
            const mx = x0 + 60 + (k % 3) * 105 + Math.sin(t * 2 + k) * 8 * e, my = 130 + Math.floor(k / 3) * 95 + Math.cos(t * 2.3 + k) * 8 * e;
            UI.circle(ctx, mx, my, 13, '#cbd5e1'); for (let h = 0; h < 4; h++) { const a = h * Math.PI / 2 + 0.4; UI.line(ctx, mx, my, mx + 24 * Math.cos(a), my + 24 * Math.sin(a), '#94a3b8', 2); UI.circle(ctx, mx + 24 * Math.cos(a), my + 24 * Math.sin(a), 6, '#22d3ee'); }
          }
          UI.text(ctx, 'weak forces between molecules', x0 + 165, 275, { size: 12, color: UI.C.dim });
        } else {
          for (let r = 0; r < 5; r++) for (let k = 0; k < 7; k++) {
            const gx = x0 + 45 + k * 40, gy = 100 + r * 38;
            if (k < 6) UI.line(ctx, gx, gy, gx + 40, gy, '#94a3b8', 2.5);
            if (r < 4) UI.line(ctx, gx, gy, gx, gy + 38, '#94a3b8', 2.5);
            UI.circle(ctx, gx, gy, 8, '#cbd5e1');
          }
          UI.text(ctx, 'strong covalent bonds everywhere', x0 + 165, 285, { size: 12, color: UI.C.dim });
        }
      }
      UI.text(ctx, 'To melt: overcome WEAK forces → low m.p.', 205, 320, { size: 13, color: UI.C.cross });
      UI.text(ctx, 'To melt: break STRONG covalent bonds → very high m.p.', 575, 320, { size: 13, color: UI.C.dot });
      UI.text(ctx, 'CH₄ melts at −182 °C', 205, 345, { size: 13, color: UI.C.dim });
      UI.text(ctx, 'diamond: about 3550 °C;  SiO₂: about 1710 °C', 575, 345, { size: 13, color: UI.C.dim });
    }
  });
};
