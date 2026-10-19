'use strict';
// Shared helpers for DOM building, canvas set-up, animation loops and drawing.
window.Anims = {};

const UI = (() => {
  const C = {
    bg: '#0b1220', panel: '#111a2e', line: '#334155', grid: '#1e293b',
    text: '#e2e8f0', dim: '#94a3b8', accent: '#38bdf8',
    dot: '#fbbf24', cross: '#22d3ee', red: '#f87171', blue: '#60a5fa',
    green: '#4ade80', purple: '#c084fc', orange: '#fb923c', pink: '#f472b6',
  };

  function el(tag, attrs = {}, ...children) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v == null) continue;
      if (k === 'class') e.className = v;
      else if (k === 'html') e.innerHTML = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    for (const c of children) {
      if (c == null) continue;
      e.append(c.nodeType ? c : document.createTextNode(c));
    }
    return e;
  }

  function canvas(host, w, h) {
    const c = el('canvas', { class: 'anim-canvas' });
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr; c.height = h * dpr;
    c.style.aspectRatio = `${w} / ${h}`;
    const ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    host.append(c);
    return { c, ctx, w, h };
  }

  // Runs fn(dt, timeSeconds) every frame; returns a stop function.
  function loop(fn) {
    let running = true, last = performance.now(), id;
    const frame = (t) => {
      if (!running) return;
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      fn(dt, t / 1000);
      id = requestAnimationFrame(frame);
    };
    id = requestAnimationFrame(frame);
    return () => { running = false; cancelAnimationFrame(id); };
  }

  const bar = (host) => host.appendChild(el('div', { class: 'anim-controls' }));
  const info = (host) => host.appendChild(el('div', { class: 'anim-info' }));

  function button(parent, label, onClick, cls = 'btn') {
    const b = el('button', { class: cls, onclick: onClick }, label);
    parent.append(b);
    return b;
  }

  function slider(parent, label, min, max, value, step, onInput, fmt) {
    const out = el('span', { class: 'val' });
    const input = el('input', { type: 'range', min, max, step, value });
    const show = () => { out.textContent = fmt ? fmt(+input.value) : input.value; };
    input.addEventListener('input', () => { show(); onInput(+input.value); });
    show();
    parent.append(el('label', { class: 'ctl' }, label + ' ', input, out));
    return input;
  }

  function select(parent, label, options, onChange) {
    const s = el('select');
    options.forEach(([v, t]) => s.append(el('option', { value: v }, t)));
    s.addEventListener('change', () => onChange(s.value));
    parent.append(el('label', { class: 'ctl' }, label + ' ', s));
    return s;
  }

  function check(parent, label, onChange) {
    const i = el('input', { type: 'checkbox' });
    i.addEventListener('change', () => onChange(i.checked));
    parent.append(el('label', { class: 'ctl' }, i, ' ' + label));
    return i;
  }

  // ---- drawing ----
  function circle(ctx, x, y, r, fill, stroke, lw = 1.5) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  }

  function text(ctx, s, x, y, o = {}) {
    const { size = 14, color = C.text, align = 'center', base = 'middle', weight = 600 } = o;
    ctx.font = `${weight} ${size}px "Segoe UI", system-ui, sans-serif`;
    ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = base;
    ctx.fillText(s, x, y);
  }

  function cross(ctx, x, y, s, color, lw = 2) {
    ctx.strokeStyle = color; ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s);
    ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s);
    ctx.stroke();
  }

  function line(ctx, x1, y1, x2, y2, color, lw = 2, dash) {
    ctx.strokeStyle = color; ctx.lineWidth = lw;
    ctx.setLineDash(dash || []);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.setLineDash([]);
  }

  function arrow(ctx, x1, y1, x2, y2, color, lw = 2) {
    line(ctx, x1, y1, x2, y2, color, lw);
    const a = Math.atan2(y2 - y1, x2 - x1), h = 8;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45));
    ctx.lineTo(x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45));
    ctx.closePath(); ctx.fill();
  }

  function roundRect(ctx, x, y, w, h, r, fill, stroke, lw = 1.5) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  }

  function clear(ctx, w, h) { ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h); }

  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const ease = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  const rand = (a, b) => a + Math.random() * (b - a);

  // Mix two hex colours.
  function mix(c1, c2, t) {
    const p = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
    const a = p(c1), b = p(c2);
    return '#' + a.map((v, i) => Math.round(lerp(v, b[i], clamp(t, 0, 1))).toString(16).padStart(2, '0')).join('');
  }

  // Electron shell configuration for Z = 1..20 (2, 8, 8, 2 filling).
  function shells(z) {
    const caps = [2, 8, 8, 8], out = [];
    for (const cap of caps) { if (z <= 0) break; out.push(Math.min(cap, z)); z -= cap; }
    return out;
  }

  // Formula with digits as subscripts (HTML).
  const fmtFormula = (f) => f.replace(/(\d+)/g, '<sub>$1</sub>');

  return { C, el, canvas, loop, bar, info, button, slider, select, check, circle, text, cross, line, arrow, roundRect, clear, lerp, clamp, ease, rand, mix, shells, fmtFormula };
})();
