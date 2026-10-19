'use strict';
// App shell: navigation, lesson pages, quiz engine, practice papers and progress.

const { el } = UI;
const main = document.getElementById('main');
const nav = document.getElementById('nav');
let cleanups = [];

// ---------- progress (local to this computer) ----------
const Progress = {
  load() { try { return JSON.parse(localStorage.getItem('chemlab-progress')) || { quiz: {}, papers: {} }; } catch { return { quiz: {}, papers: {} }; } },
  save(p) { try { localStorage.setItem('chemlab-progress', JSON.stringify(p)); } catch { /* storage unavailable */ } },
  setBest(kind, id, pct) { const p = this.load(); p[kind][id] = Math.max(p[kind][id] || 0, pct); this.save(p); },
};

function teardown() { cleanups.forEach((f) => { try { f(); } catch { /* ignore */ } }); cleanups = []; }

function go(hash) { location.hash = hash; }

// Small screens (iPad portrait, phones): the sidebar slides in from the menu button.
const setMenu = (open) => document.body.classList.toggle('menu-open', open);
document.getElementById('menuBtn').addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
document.getElementById('scrim').addEventListener('click', () => setMenu(false));

// Offline support and "Add to Home Screen" when served from a website (not inside the desktop app).
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
}
window.addEventListener('hashchange', route);

function route() {
  teardown();
  setMenu(false);
  main.scrollTop = 0;
  const [view, id, tab] = (location.hash.slice(1) || 'home').split('/');
  renderNav(view, id);
  if (view === 'topic') return renderTopic(TOPICS.find((t) => t.id === id) || TOPICS[0], tab || 'learn');
  if (view === 'papers') return renderPapers();
  if (view === 'paper') return renderPaper(PAPERS.find((p) => p.id === id));
  if (view === 'review') return renderReview();
  if (view === 'bondlab') return renderBondLab(id);
  if (view === 'ptable') return renderPeriodicPage();
  if (view === 'ions') return renderIonsPage();
  if (view === 'journey') return renderJourney();
  renderHome();
}

function renderNav(view, id) {
  const prog = Progress.load();
  nav.innerHTML = '';
  const link = (hash, label, active, extra) => {
    const a = el('a', { href: '#' + hash, class: active ? 'active' : '' }, label);
    if (extra) a.append(extra);
    nav.append(a);
  };
  link('home', '🏠  Home', view === 'home');
  link('papers', '📝  Exam Practice', view === 'papers' || view === 'paper');
  link('review', '🎯  Quick Revision Quiz', view === 'review');
  nav.append(el('div', { class: 'nav-h' }, 'Interactive tools'));
  link('journey', '🔭  Journey into the Atom', view === 'journey');
  link('ptable', '🗂️  Periodic Table', view === 'ptable');
  link('bondlab', '⚛  Bond Lab', view === 'bondlab');
  link('ions', '🧩  Ions & Formulae', view === 'ions');
  nav.append(el('div', { class: 'nav-h' }, 'Topics'));
  for (const t of TOPICS) {
    const best = prog.quiz[t.id];
    link('topic/' + t.id, `${t.icon}  ${t.num}. ${t.title}`, view === 'topic' && id === t.id, best != null ? el('span', { class: 'pill ' + (best >= 80 ? 'good' : best >= 50 ? 'mid' : 'low') }, best + '%') : null);
  }
}

// ---------- home ----------
function renderHome() {
  const prog = Progress.load();
  const done = TOPICS.filter((t) => prog.quiz[t.id] != null).length;
  const avg = done ? Math.round(TOPICS.reduce((s, t) => s + (prog.quiz[t.id] || 0), 0) / done) : 0;
  main.innerHTML = '';
  const hero = el('section', { class: 'hero' });
  hero.innerHTML = `<h1>Learn IGCSE Chemistry by <span>seeing it happen</span></h1>
    <p>Animated lessons for every topic in the Cambridge IGCSE Chemistry 0620 syllabus (2026–2028), with a quiz for each topic and exam-style practice papers with worked answers.</p>
    <div class="stats"><div><b>${TOPICS.length}</b><small>topics</small></div><div><b>${done}</b><small>quizzes done</small></div><div><b>${avg}%</b><small>average score</small></div><div><b>${PAPERS.length}</b><small>practice papers</small></div></div>
    <div class="how"><span><b>1</b> Read & play with the animations</span><span><b>2</b> Take the topic quiz</span><span><b>3</b> Try an exam paper</span></div>
    <p class="dim small">Sections marked <span class="ext">Extended</span> are Supplement content (Papers 2 & 4). Core students can skip them.</p>`;
  // On the website (not inside the Windows app), offer the Windows download.
  if (!navigator.userAgent.includes('Electron')) {
    hero.append(el('div', { class: 'get-app', html: `<a class="btn" href="https://github.com/njabuloshong1/chemlab/releases/latest/download/ChemLab-IGCSE-Setup.exe">⬇ Download for Windows</a>
      <span class="dim small">iPad / Chromebook / phone: use <b>Share → Add to Home Screen</b> or the <b>install icon</b> in the address bar.</span>` }));
  }
  main.append(hero);
  const tools = el('div', { class: 'cards tools' });
  for (const [h, ic, title, txt] of [['journey', '🔭', 'Journey into the Atom', 'Start here: zoom from a copper wire into a single atom and take it apart.'], ['bondlab', '⚛', 'Bond Lab', 'Click any two elements and watch how they bond — formula, name and equation.'], ['ptable', '🗂️', 'Periodic Table', 'All 118 elements with atoms, electrons, ions and trends.'], ['ions', '🧩', 'Ions & Formulae', 'Sulfate, nitrate, ammonium… what they are, tests, and a formula builder.']]) {
    const c = el('a', { class: 'card tool', href: '#' + h });
    c.innerHTML = `<div class="ic">${ic}</div><h3>${title}</h3><p>${txt}</p>`;
    tools.append(c);
  }
  main.append(el('h2', { class: 'sect' }, 'Interactive tools'), tools, el('h2', { class: 'sect' }, 'Topics'));
  const grid = el('div', { class: 'cards' });
  for (const t of TOPICS) {
    const best = prog.quiz[t.id];
    const card = el('a', { class: 'card', href: '#topic/' + t.id });
    card.innerHTML = `<div class="ic">${t.icon}</div><div class="meta">Topic ${t.num} · ${t.syl}</div><h3>${t.title}</h3><p>${t.intro}</p>
      <div class="bar"><i style="width:${best || 0}%"></i></div><small>${best != null ? 'Best quiz score ' + best + '%' : 'Quiz not tried yet'}</small>`;
    grid.append(card);
  }
  main.append(grid);
}

function renderJourney() {
  main.innerHTML = '';
  const head = el('header', { class: 'topic-head' });
  head.innerHTML = '<h1>🔭 Journey into the Atom</h1><p>Start here! Zoom from a copper wire down to the particles inside one atom.</p>';
  main.append(head);
  const body = el('div', { class: 'topic-body' });
  body.innerHTML = `${anim('journey', 'Journey into a copper atom')}`;
  main.append(body);
  mountAnims(body);
  body.append(el('div', { class: 'next' }, el('a', { class: 'btn big', href: '#topic/atoms' }, 'Next: Atomic Structure & Isotopes →'), el('a', { class: 'btn ghost', href: '#ptable' }, 'Explore the Periodic Table')));
}

// ---------- topic ----------
function renderTopic(t, tab) {
  main.innerHTML = '';
  const idx = TOPICS.indexOf(t);
  const head = el('header', { class: 'topic-head' });
  head.innerHTML = `<div class="crumb">Topic ${t.num} · ${t.syl}</div><h1>${t.icon} ${t.title}</h1><p>${t.intro}</p>`;
  const tabs = el('div', { class: 'tabs' });
  for (const [k, lab] of [['learn', '📖 Learn'], ['quiz', `✅ Quiz (${t.quiz.length} questions)`]]) {
    tabs.append(el('a', { href: `#topic/${t.id}/${k}`, class: tab === k ? 'on' : '' }, lab));
  }
  head.append(tabs);
  main.append(head);
  const body = el('div', { class: 'topic-body' });
  main.append(body);

  if (tab === 'quiz') {
    runQuiz(body, t.quiz, (pct) => { Progress.setBest('quiz', t.id, pct); renderNav('topic', t.id); });
  } else {
    // contents chips
    const toc = el('div', { class: 'toc' });
    t.sections.forEach((s, i) => toc.append(el('button', { onclick: () => document.getElementById('sec' + i).scrollIntoView({ behavior: 'smooth' }) }, s.h.replace(/<[^>]+>/g, ''))));
    body.append(toc);
    t.sections.forEach((s, i) => {
      const sec = el('section', { class: 'lesson', id: 'sec' + i });
      sec.innerHTML = `<h2>${s.h}</h2>${s.html}`;
      body.append(sec);
    });
    mountAnims(body);
    const foot = el('div', { class: 'next' });
    foot.append(el('a', { class: 'btn big', href: `#topic/${t.id}/quiz` }, `Test yourself: ${t.title} quiz →`));
    if (TOPICS[idx + 1]) foot.append(el('a', { class: 'btn ghost', href: `#topic/${TOPICS[idx + 1].id}` }, `Next topic: ${TOPICS[idx + 1].title}`));
    body.append(foot);
  }
}

// Mount each interactive only when it scrolls into view, and pause it when it scrolls away.
function mountAnims(root) {
  const slots = [...root.querySelectorAll('.anim-slot')];
  const obs = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const slot = e.target;
      if (e.isIntersecting && !slot._stop) {
        const fn = Anims[slot.dataset.anim];
        if (!fn) continue;
        const inner = slot.querySelector('.anim-inner');
        inner.innerHTML = '';
        slot._stop = fn(inner) || (() => {});
        slot.classList.add('mounted');
      } else if (!e.isIntersecting && slot._stop) {
        slot._stop(); slot._stop = null;
      }
    }
  }, { rootMargin: '150px' });
  for (const s of slots) {
    s.append(el('div', { class: 'anim-title' }, '▶ Interactive: ' + s.dataset.title), el('div', { class: 'anim-inner' }));
    obs.observe(s);
  }
  cleanups.push(() => { obs.disconnect(); slots.forEach((s) => s._stop && s._stop()); });
}

// ---------- quiz engine ----------
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

function runQuiz(host, questions, onDone, opts = {}) {
  let i = 0, score = 0;
  const answers = [];
  const qs = opts.shuffleQuestions ? shuffle(questions) : questions;
  const box = el('div', { class: 'quiz' });
  host.append(box);
  function show() {
    const q = qs[i];
    const order = shuffle(q.o.map((_, k) => k));
    box.innerHTML = `<div class="qprog"><span>Question ${i + 1} of ${qs.length}</span><span>Score ${score}</span></div>
      <div class="qbar"><i style="width:${(i / qs.length) * 100}%"></i></div><h3 class="qtext">${q.q}</h3>`;
    const opts = el('div', { class: 'opts' });
    order.forEach((k, n) => {
      const b = el('button', { class: 'opt', 'data-k': k }, el('span', { class: 'letter' }, 'ABCD'[n]), el('span', { html: q.o[k] }));
      b.addEventListener('click', () => pick(k, b, opts));
      opts.append(b);
    });
    box.append(opts);
  }
  function pick(k, btn, opts) {
    const q = qs[i], right = k === q.a;
    if (right) score++;
    answers.push({ q, k, right });
    [...opts.children].forEach((b) => (b.disabled = true));
    btn.classList.add(right ? 'right' : 'wrong');
    if (!right) [...opts.children].find((b) => +b.dataset.k === q.a)?.classList.add('right');
    const ex = el('div', { class: 'explain ' + (right ? 'ok' : 'no') });
    ex.innerHTML = `<b>${right ? '✔ Correct!' : '✘ Not quite.'}</b> ${q.e}`;
    box.append(ex);
    const next = el('button', { class: 'btn big' }, i + 1 < qs.length ? 'Next question →' : 'See results');
    next.addEventListener('click', () => { i++; i < qs.length ? show() : finish(); });
    box.append(next);
    next.focus();
  }
  function finish() {
    const pct = Math.round((score / qs.length) * 100);
    onDone && onDone(pct);
    const msg = pct >= 80 ? '🌟 Excellent work!' : pct >= 50 ? '👍 Good effort — review the ones you missed.' : '📖 Re-read the Learn tab and try again.';
    box.innerHTML = `<div class="result"><div class="ring" style="--p:${pct}"><b>${pct}%</b></div><h2>${score} / ${qs.length}</h2><p>${msg}</p></div>`;
    const rev = el('div', { class: 'review' });
    answers.forEach(({ q, k, right }, n) => {
      const d = el('details', { class: right ? 'ok' : 'no' });
      d.innerHTML = `<summary>${right ? '✔' : '✘'} ${n + 1}. ${q.q}</summary><p>Your answer: <b>${q.o[k]}</b>${right ? '' : `<br>Correct answer: <b>${q.o[q.a]}</b>`}</p><p class="dim">${q.e}</p>`;
      if (!right) d.open = true;
      rev.append(d);
    });
    box.append(rev);
    const again = el('button', { class: 'btn big' }, '↻ Try again');
    again.addEventListener('click', () => { i = 0; score = 0; answers.length = 0; show(); });
    box.append(again);
  }
  show();
}

// Mixed questions from every topic.
function renderReview() {
  main.innerHTML = '';
  const head = el('header', { class: 'topic-head' });
  head.innerHTML = '<h1>🎯 Quick Revision Quiz</h1><p>15 random questions from all topics — a different mix every time.</p>';
  main.append(head);
  const all = TOPICS.flatMap((t) => t.quiz);
  const body = el('div', { class: 'topic-body' });
  main.append(body);
  runQuiz(body, shuffle(all).slice(0, 15), null);
}

// ---------- papers ----------
function renderPapers() {
  const prog = Progress.load();
  main.innerHTML = '';
  const head = el('header', { class: 'topic-head' });
  head.innerHTML = `<h1>📝 Exam Practice</h1><p>Exam-style papers written for this app in the style of Cambridge IGCSE 0620, with model answers and mark schemes. Do them under timed conditions, then mark yourself.</p>
    <div class="note">Real Cambridge past papers and mark schemes are copyright Cambridge University Press &amp; Assessment, so they are not copied here. Your school (via the School Support Hub) or the Cambridge website is the place to get them — use them alongside these practice papers.</div>`;
  main.append(head);
  const grid = el('div', { class: 'cards' });
  for (const p of PAPERS) {
    const marks = p.type === 'mcq' ? p.questions.length : p.questions.reduce((s, q) => s + q.parts.reduce((a, b) => a + b.marks, 0), 0);
    const best = prog.papers[p.id];
    const c = el('a', { class: 'card', href: '#paper/' + p.id });
    c.innerHTML = `<div class="ic">${p.type === 'mcq' ? '🔘' : '✍️'}</div><div class="meta">${p.style} · ${p.time} min · ${marks} marks</div><h3>${p.title}</h3><p>${p.desc}</p>
      <div class="bar"><i style="width:${best || 0}%"></i></div><small>${best != null ? 'Best ' + best + '%' : 'Not attempted'}</small>`;
    grid.append(c);
  }
  main.append(grid);
}

function renderPaper(p) {
  main.innerHTML = '';
  const head = el('header', { class: 'topic-head' });
  head.innerHTML = `<div class="crumb"><a href="#papers">← Exam Practice</a></div><h1>${p.title}</h1><p>${p.desc}</p>`;
  const timer = el('div', { class: 'timer' });
  head.append(timer);
  main.append(head);
  // countdown timer
  let left = p.time * 60;
  const tick = () => { const m = Math.floor(left / 60), s = left % 60; timer.textContent = `⏱ ${m}:${String(s).padStart(2, '0')} remaining`; timer.classList.toggle('low', left < 300); if (left > 0) left--; };
  tick();
  const id = setInterval(tick, 1000);
  cleanups.push(() => clearInterval(id));

  const body = el('div', { class: 'topic-body' });
  main.append(body);
  if (p.type === 'mcq') { runQuiz(body, p.questions, (pct) => Progress.setBest('papers', p.id, pct)); return; }

  const total = p.questions.reduce((s, q) => s + q.parts.reduce((a, b) => a + b.marks, 0), 0);
  const scoreBar = el('div', { class: 'scorebar' });
  const parts = [];
  const update = () => {
    const got = parts.reduce((s, x) => s + Math.min(x.marks, x.box.querySelectorAll('input:checked').length), 0);
    const revealed = parts.filter((x) => x.shown).length;
    scoreBar.innerHTML = `Self-marked: <b>${got} / ${total}</b> &nbsp;·&nbsp; answers revealed ${revealed}/${parts.length}`;
    if (revealed === parts.length) Progress.setBest('papers', p.id, Math.round((got / total) * 100));
  };
  body.append(scoreBar);
  for (const q of p.questions) {
    const qs = el('section', { class: 'lesson question' });
    qs.innerHTML = `<h2>Question ${q.n}</h2><div class="stem">${q.stem}</div>`;
    for (const part of q.parts) {
      const box = el('div', { class: 'part' });
      box.innerHTML = `<div class="pq"><b>${part.p}</b> ${part.q} <span class="marks">[${part.marks}]</span></div>`;
      const ta = el('textarea', { placeholder: 'Write your answer here…', rows: 2 });
      const btn = el('button', { class: 'btn ghost' }, 'Show model answer');
      const ans = el('div', { class: 'answer hidden' });
      ans.innerHTML = `<div class="model"><b>Model answer:</b> ${part.answer}</div><div class="ms"><b>Mark scheme</b> — tick the points you got (max ${part.marks}):</div>`;
      part.points.forEach((pt) => {
        const cb = el('input', { type: 'checkbox' });
        cb.addEventListener('change', update);
        ans.append(el('label', { class: 'point' }, cb, ' ' + pt));
      });
      const rec = { marks: part.marks, box: ans, shown: false };
      parts.push(rec);
      btn.addEventListener('click', () => { ans.classList.remove('hidden'); btn.remove(); rec.shown = true; update(); });
      box.append(ta, btn, ans);
      qs.append(box);
    }
    body.append(qs);
  }
  update();
}

route();
