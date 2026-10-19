'use strict';
// Bond Lab logic: given two elements, work out the bonding, formula, name, equation and an explanation.

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const lcm = (a, b) => (a / gcd(a, b)) * b;
const DIATOMIC = new Set(['H', 'N', 'O', 'F', 'Cl', 'Br', 'I']);
const EN = { H: 2.2, B: 2.04, C: 2.55, N: 3.04, O: 3.44, F: 3.98, Si: 1.9, P: 2.19, S: 2.58, Cl: 3.16, Se: 2.55, Br: 2.96, I: 2.66, As: 2.18, Te: 2.1, Ge: 2.01, Sb: 2.05, At: 2.2 };
const ANION_NAME = { H: 'hydride', N: 'nitride', O: 'oxide', F: 'fluoride', P: 'phosphide', S: 'sulfide', Cl: 'chloride', Se: 'selenide', Br: 'bromide', I: 'iodide', C: 'carbide', Si: 'silicide', B: 'boride', Te: 'telluride', As: 'arsenide' };
const PREFIX_N = ['', 'mono', 'di', 'tri', 'tetra', 'penta', 'hexa'];
const NUMERAL_METALS = new Set(['Fe', 'Cu', 'Pb', 'Sn', 'Mn', 'Cr', 'Ni', 'Co', 'Ti', 'Hg', 'Au', 'Pt']);
const ROMAN_N = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const SPECIAL_NAMES = { H2O: 'water', NH3: 'ammonia', CH4: 'methane', H2S: 'hydrogen sulfide', PH3: 'phosphine', SiH4: 'silane', HCl: 'hydrogen chloride', HF: 'hydrogen fluoride', HBr: 'hydrogen bromide', HI: 'hydrogen iodide', CCl4: 'tetrachloromethane (carbon tetrachloride)' };
const COV_STATE = { H2O: 'l', NH3: 'g', CH4: 'g', HCl: 'g', HF: 'g', HBr: 'g', HI: 'g', CO2: 'g', H2S: 'g', SO2: 'g', CCl4: 'l', PCl3: 'l', CS2: 'l', NCl3: 'l', SiCl4: 'l', BF3: 'g', OF2: 'g', SiH4: 'g', PH3: 'g', SCl2: 'l', SiO2: 's', ICl: 's', BrCl: 'g' };
const elState = (s) => ({ Br: 'l', Hg: 'l' }[s] || (['H', 'N', 'O', 'F', 'Cl'].includes(s) ? 'g' : 's'));

const COMPOUND_FACTS = {
  NaCl: 'Common salt. Found in sea water; electrolysis of its concentrated solution (brine) makes chlorine, hydrogen and sodium hydroxide.',
  KCl: 'Used in fertilisers (provides potassium).', MgO: 'White solid with a very high melting point (2852 °C) — used to line furnaces. Formed when magnesium burns with a bright white flame.',
  CaO: 'Quicklime. Made by heating limestone (CaCO₃ → CaO + CO₂). Used in the blast furnace and to remove SO₂ from flue gases.',
  Al2O3: 'Main compound in bauxite. Aluminium is extracted from it by electrolysis (dissolved in molten cryolite). An amphoteric oxide.',
  Fe2O3: 'Hematite — iron ore reduced in the blast furnace. Rust is hydrated iron(III) oxide.', CuO: 'Black solid. A basic oxide: reacts with acids to make copper(II) salts.',
  ZnO: 'An amphoteric oxide (reacts with acids and bases).', H2O: 'Water. Simple molecule with 2 lone pairs on O. Test: turns anhydrous copper(II) sulfate blue / cobalt(II) chloride pink.',
  CO2: 'Greenhouse gas from complete combustion. Turns limewater milky. Acidic oxide.', NH3: 'Made in the Haber process. Alkaline gas — turns damp red litmus blue. Used for fertilisers.',
  CH4: 'Main gas in natural gas. Greenhouse gas. Simplest alkane.', HCl: 'A gas that dissolves in water to form hydrochloric acid, a strong acid.',
  SO2: 'Causes acid rain. Made by burning sulfur-containing fuels. Turns acidified potassium manganate(VII) colourless.', SiO2: 'Sand / quartz. Giant covalent structure — hard, very high melting point.',
  LiF: 'Ionic compound of Li⁺ and F⁻.', MgCl2: 'Formed when magnesium reacts with chlorine or hydrochloric acid.', CaCl2: 'Formed when calcium carbonate reacts with hydrochloric acid.',
  PbBr2: 'Classic electrolysis example — molten PbBr₂ gives lead at the cathode and bromine at the anode.', FeCl3: 'Iron(III) chloride — iron burns in chlorine to form it.',
  H2S: 'Poisonous gas that smells of rotten eggs.', CCl4: 'Formed by substitution of methane with chlorine (UV light).', Na2O: 'Basic oxide; dissolves in water to give sodium hydroxide.',
  AgCl: 'White precipitate — the positive test for chloride ions.', AgBr: 'Cream precipitate — test for bromide ions.', AgI: 'Yellow precipitate — test for iodide ions.',
  Mg3N2: 'Formed when magnesium burns in air (it reacts with some of the nitrogen).', KBr: 'Potassium bromide — used in halogen displacement experiments.',
};

const sub = (n) => (n > 1 ? n : '');
const formulaHtml = (f) => UI.fmtFormula(f);
const coefHtml = (n, f) => (n > 1 ? n : '') + formulaHtml(f);
const elementFormula = (s) => (DIATOMIC.has(s) ? s + '2' : s);

// Balance A + B → AxBy where A and B are elements.
function balanceElements(A, B, x, y) {
  const pa = DIATOMIC.has(A) ? 2 : 1, pb = DIATOMIC.has(B) ? 2 : 1;
  let c = lcm(pa / gcd(pa, x), pb / gcd(pb, y));
  let a = (c * x) / pa, b = (c * y) / pb;
  const g = gcd(gcd(a, b), c);
  return [a / g, b / g, c / g];
}

function equationHtml(A, B, x, y, product, productState) {
  const [a, b, c] = balanceElements(A, B, x, y);
  const st = (s) => `<span class="st">(${s})</span>`;
  return `${coefHtml(a, elementFormula(A))}${st(elState(A))} + ${coefHtml(b, elementFormula(B))}${st(elState(B))} → ${coefHtml(c, product)}${productState ? st(productState) : ''}`;
}

const elLink = (e) => `<b>${e.name}</b> (${e.sym}, Z = ${e.z})`;
const shellStr = (e) => elementShells(e.z).join(',');
const groupStr = (e) => (ROMAN_G[e.group] ? 'Group ' + ROMAN_G[e.group] : e.group ? 'transition element (group ' + e.group + ')' : e.cat);

// Charge a metal ion usually has, or list of options.
function metalCharges(e) {
  if (e.group === 1 || e.group === 2) return [e.group];
  if (e.sym === 'Al' || e.sym === 'Ga' || e.sym === 'In') return [3];
  return ION_CHARGE[e.sym] || null;
}

// Anion charge for a non-metal (needs electrons to fill its outer shell).
function anionCharge(e) {
  if (e.sym === 'H') return 1;
  if (e.group >= 15 && e.group <= 17) return 18 - e.group;
  return null;
}

function covalentCap(e) {
  if (e.sym === 'H') return 1;
  if (e.group === 13) return 3; // boron shares all 3 outer electrons
  const v = valenceOf(e);
  return v == null ? null : 8 - v;
}

function analyseBond(A, B) {
  const res = { a: A, b: B, steps: [], anim: null, also: [] };
  const mA = isMetal(A), mB = isMetal(B);

  // noble gases
  if (A.cat === 'noble' || B.cat === 'noble') {
    const ng = A.cat === 'noble' ? A : B;
    res.type = 'none'; res.title = 'No bond forms';
    res.steps = [
      `${elLink(ng)} is a <b>noble gas</b> (Group VIII). Its electronic configuration is <b>${shellStr(ng)}</b> — a <b>full outer shell</b>.`,
      'Atoms bond to get a full outer shell. A noble gas already has one, so it does <b>not</b> need to lose, gain or share electrons.',
      'That is why noble gases are <b>unreactive</b> and exist as single atoms (<b>monatomic</b>) — e.g. argon is used in light bulbs and helium in balloons.',
      ng === A && B.cat === 'noble' ? 'Both atoms are noble gases, so nothing happens at all.' : `${(ng === A ? B : A).name} would need a partner that can take, give or share electrons — try another element.`,
    ];
    res.anim = { kind: 'atoms', list: [A, B] };
    return res;
  }

  // metal + metal
  if (mA && mB) {
    if (A === B) {
      res.type = 'metallic'; res.title = 'Metallic bonding';
      res.steps = [
        `${elLink(A)} is a <b>metal</b>. Metal atoms bond to each other by <b>metallic bonding</b>.`,
        `Each atom loses its outer electron${(valenceOf(A) || 2) > 1 ? 's' : ''} into a shared “<b>sea</b>” of <b>delocalised electrons</b>, leaving <b>positive ions</b> (${A.sym}${valenceOf(A) ? '<sup>' + chargeLabel(valenceOf(A)) + '</sup>' : '<sup>+</sup>'}) arranged in a <b>giant lattice</b>.`,
        '<b>Metallic bond</b> = the electrostatic attraction between the positive ions and the delocalised electrons. It acts in all directions, so it is strong.',
        'Properties: <b>conducts electricity and heat</b> (delocalised electrons move), <b>malleable and ductile</b> (layers of ions slide), usually <b>high melting point</b>, shiny.',
        EL_FACTS[A.sym] ? 'About ' + A.name + ': ' + EL_FACTS[A.sym] : '',
      ].filter(Boolean);
      res.anim = { kind: 'metallic' };
    } else {
      res.type = 'alloy'; res.title = 'No compound — but they can form an alloy';
      res.steps = [
        `${elLink(A)} and ${elLink(B)} are both <b>metals</b>. Both want to <b>lose</b> electrons, so neither can take electrons from the other — <b>no ionic or covalent bond</b> forms.`,
        'If they are melted together and mixed, they form an <b>alloy</b> — a <b>mixture</b> of a metal with other elements (held by metallic bonding).',
        'Alloys are usually <b>harder and stronger</b> than the pure metals: the <b>different-sized atoms</b> disrupt the regular layers so they <b>cannot slide</b> over each other as easily.',
        (['Cu', 'Zn'].includes(A.sym) && ['Cu', 'Zn'].includes(B.sym)) ? '<span class="hl">Copper + zinc = brass</span> — harder than copper, used for musical instruments and door handles.'
          : (['Fe', 'Cr', 'Ni'].includes(A.sym) && ['Fe', 'Cr', 'Ni'].includes(B.sym)) ? '<span class="hl">Iron + chromium + nickel (+ carbon) = stainless steel</span> — hard and resists rusting, used for cutlery.'
            : 'Examples you must know: <b>brass</b> (copper + zinc) and <b>stainless steel</b> (iron + chromium, nickel and carbon).',
      ];
      res.anim = { kind: 'alloy' };
    }
    return res;
  }

  // metal + non-metal → ionic
  if (mA !== mB) {
    const M = mA ? A : B, X = mA ? B : A;
    const qx = anionCharge(X);
    const qms = metalCharges(M);
    if (qx == null || !qms) {
      res.type = 'other'; res.title = 'Not a simple IGCSE compound';
      res.steps = [
        `${elLink(M)} is a metal and ${elLink(X)} is ${X.cat === 'metalloid' ? 'a metalloid' : 'a non-metal'}.`,
        qx == null ? `${X.name} (${groupStr(X)}) does not usually form a simple negative ion, so there is no simple ionic compound to draw at IGCSE.` : `${M.name} forms ions with charges that are not covered at IGCSE.`,
        'Try a non-metal from Group V, VI or VII (e.g. N, O, S, Cl, Br, I) with a metal from Group I, II or aluminium.',
      ];
      return res;
    }
    res.type = 'ionic'; res.title = 'Ionic bonding';
    const variants = qms.map((qm) => {
      const g = gcd(qm, qx), x = qx / g, y = qm / g;
      const f = M.sym + sub(x) + X.sym + sub(y);
      const nm = M.name.toLowerCase() + (qms.length > 1 || NUMERAL_METALS.has(M.sym) ? '(' + ROMAN_N[qm] + ')' : '') + ' ' + ANION_NAME[X.sym];
      return { qm, x, y, f, name: nm };
    });
    const v = variants[0];
    res.formula = v.f; res.name = v.name;
    const vm = valenceOf(M);
    res.steps = [
      `<b>Step 1 — Metal or non-metal?</b> ${elLink(M)} is a <b>metal</b> (${groupStr(M)}). ${elLink(X)} is a <b>non-metal</b> (${groupStr(X)}). Metal + non-metal → <b>ionic bonding</b> (electrons are <b>transferred</b>).`,
      `<b>Step 2 — Electrons.</b> ${M.sym}: <b>${shellStr(M)}</b>${vm ? ` — ${vm} outer electron${vm > 1 ? 's' : ''}, easier to <b>lose</b> ${vm} than gain ${8 - vm}` : ''}. ${X.sym}: <b>${shellStr(X)}</b> — needs <b>${qx}</b> more electron${qx > 1 ? 's' : ''} to fill its outer shell.`,
      `<b>Step 3 — Ions.</b> ${M.sym} loses ${v.qm} electron${v.qm > 1 ? 's' : ''} → <b>${M.sym}<sup>${chargeLabel(v.qm)}</sup></b> (cation). ${X.sym} gains ${qx} → <b>${X.sym}<sup>${chargeLabel(-qx)}</sup></b> (anion, name ends in <b>-ide</b>: ${ANION_NAME[X.sym]}).`,
      `<b>Step 4 — Formula (charges must cancel).</b> ${v.x} × (+${v.qm}) + ${v.y} × (−${qx}) = 0 → <b>${formulaHtml(v.f)}</b>. <span class="dim">Shortcut — “swap and drop”: the charge of each ion becomes the number of the other ion, then simplify.</span>`,
      `<b>Step 5 — Name:</b> <b>${v.name}</b>. Word equation: ${M.name.toLowerCase()} + ${X.name.toLowerCase()} → ${v.name}.`,
      `<b>Step 6 — Balanced equation:</b> ${equationHtml(M.sym, X.sym, v.x, v.y, v.f, 's')} <span class="dim">(${DIATOMIC.has(X.sym) ? X.name + ' exists as ' + X.sym + '₂ molecules, so it is written ' + X.sym + '₂' : X.name + ' is written as a single atom'}).</span>`,
      `<b>Step 7 — The bond:</b> the ${M.sym}<sup>${chargeLabel(v.qm)}</sup> and ${X.sym}<sup>${chargeLabel(-qx)}</sup> ions are held by <b>strong electrostatic attraction</b> in a <b>giant ionic lattice</b>. So ${v.f.replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[d])} has a <b>high melting point</b>, conducts when <b>molten or dissolved</b> but <b>not when solid</b>.`,
    ];
    if (variants.length > 1) res.also = variants.slice(1).map((w) => `${M.name} also forms <b>${M.sym}<sup>${chargeLabel(w.qm)}</sup></b> ions → <b>${w.name}</b>, ${formulaHtml(w.f)}. The Roman numeral in the name tells you the charge on the metal ion.`);
    if (COMPOUND_FACTS[v.f]) res.also.push('<b>Real life:</b> ' + COMPOUND_FACTS[v.f]);
    const drawable = M.z <= 20 && X.z <= 20 && vm && vm === v.qm && v.x + v.y <= 5;
    if (drawable) {
      const layout = [];
      for (let i = 0; i < v.x; i++) layout.push([M.sym, elementShells(M.z), 'm']);
      for (let i = 0; i < v.y; i++) layout.push([X.sym, elementShells(X.z), 'n']);
      res.anim = { kind: 'ionic', layout, formula: v.f };
    } else res.note = `The dot-and-cross animation is drawn for elements with proton number 1–20 (the IGCSE requirement). ${M.name} and ${X.name} still bond in the same way.`;
    return res;
  }

  // non-metal + non-metal → covalent
  return analyseCovalent(A, B, res);
}

function analyseCovalent(A, B, res) {
  res.type = 'covalent'; res.title = 'Covalent bonding';
  const intro = `<b>Step 1 — Metal or non-metal?</b> ${elLink(A)} and ${elLink(B)} are both <b>non-metals</b>${[A, B].some((e) => e.cat === 'metalloid') ? ' / metalloids' : ''}. Both want to <b>gain</b> electrons, so neither gives electrons away — instead they <b>share pairs of electrons</b>: <b>covalent bonding</b>.`;
  const elec = `<b>Step 2 — Electrons.</b> ${A.sym}: <b>${shellStr(A)}</b> (needs ${covalentCap(A)} more)${A !== B ? `; ${B.sym}: <b>${shellStr(B)}</b> (needs ${covalentCap(B)} more)` : ''}. Each shared pair counts towards the outer shell of <b>both</b> atoms.`;
  const pair = [A.sym, B.sym].sort().join('+');

  // giant structures and special cases
  const giant = {
    'C+C': ['Carbon bonds to itself in giant covalent structures', 'Carbon atoms bond to <b>each other</b> to make <b>giant covalent structures</b>: <b>diamond</b> (each C forms 4 bonds — very hard, cutting tools) and <b>graphite</b> (each C forms 3 bonds in layers with delocalised electrons — conducts, slippery, used as a lubricant and electrodes).', 'diamond'],
    'Si+Si': ['Silicon forms a giant covalent structure', 'Each Si atom forms <b>4 covalent bonds</b> to other Si atoms — a giant structure like diamond with a very high melting point.', 'diamond'],
    'O+Si': ['Silicon(IV) oxide, SiO₂ — giant covalent', 'Each Si forms <b>4</b> covalent bonds to O atoms, and each O bonds to <b>2</b> Si atoms. There are no separate molecules — it is a <b>giant covalent lattice</b> (sand, quartz). Like diamond: <b>hard, very high melting point, does not conduct</b>. Formula <b>SiO₂</b> (ratio Si : O = 1 : 2).', 'sio2'],
  };
  if (giant[pair]) {
    const [title, text, mode] = giant[pair];
    res.title = title;
    res.steps = [intro, elec, `<b>Step 3 — Structure.</b> ${text}`, '<b>Why so strong?</b> To melt it, <b>many strong covalent bonds</b> must be broken (not weak intermolecular forces), which needs a lot of energy.'];
    if (pair === 'O+Si') { res.formula = 'SiO2'; res.name = 'silicon(IV) oxide (silicon dioxide)'; res.steps.push(`<b>Equation:</b> Si(s) + O₂(g) → SiO₂(s)`); }
    res.anim = { kind: 'giant', mode };
    return res;
  }
  const textOnly = {
    'N+O': 'Nitrogen and oxygen form several oxides (NO, NO₂). They react only at very high temperatures — e.g. inside <b>car engines</b>. These <b>oxides of nitrogen</b> cause <b>acid rain</b> and <b>photochemical smog</b>; catalytic converters remove them: 2CO + 2NO → 2CO₂ + N₂.',
    'O+P': 'Phosphorus burns in oxygen to form phosphorus oxides (e.g. P₄O₁₀) — an <b>acidic oxide</b> of a non-metal. The structure is beyond IGCSE.',
    'S+S': 'Sulfur atoms bond covalently to each other in rings of 8 atoms (S₈ molecules). Sulfur is a yellow simple molecular solid with a low melting point.',
    'P+P': 'Phosphorus atoms bond covalently in P₄ molecules (simple molecular solid).',
    'B+B': 'Boron forms a giant covalent structure — very hard with a high melting point.',
    'C+N': 'Carbon and nitrogen do not form a simple IGCSE compound (they appear together in amino acids and proteins).',
    'C+Si': 'Silicon carbide, SiC, is a giant covalent structure (like diamond) used as an abrasive. Not required for IGCSE.',
  };
  if (textOnly[pair]) {
    res.title = 'Covalent — but not a simple IGCSE molecule';
    res.steps = [intro, elec, textOnly[pair]];
    return res;
  }

  const ca = covalentCap(A), cb = covalentCap(B);
  if (ca == null || cb == null || ca === 0 || cb === 0) {
    res.type = 'other'; res.title = 'No simple compound';
    res.steps = [intro, `These elements do not form a simple compound covered at IGCSE.`];
    return res;
  }
  // same element → diatomic molecule
  let central, lig, n, order;
  if (A === B) { central = A; lig = B; n = 1; order = ca; }
  else {
    [central, lig] = ca >= cb ? [A, B] : [B, A];
    if (covalentCap(central) === covalentCap(lig)) { n = 1; order = covalentCap(lig); }
    else {
      order = covalentCap(lig);
      n = covalentCap(central) / order;
    }
  }
  if (!Number.isInteger(n) || n > 4) {
    res.type = 'other'; res.title = 'No simple molecule';
    res.steps = [intro, elec, `The numbers of electrons needed (${ca} and ${cb}) do not give a simple molecule where every atom has a full outer shell. These elements do not form a common IGCSE compound.`];
    return res;
  }
  // S + O: SO2 needs S to expand its outer shell; draw it with a note
  const special = pair === 'O+S';
  if (special) { central = A.sym === 'S' ? A : B; lig = central === A ? B : A; n = 2; order = 2; }

  // formula order: H last with C, N, Si, P (CH4, NH3); otherwise less electronegative element first
  let f;
  const cnt = { [central.sym]: 1, [lig.sym]: (A === B ? 2 : n) };
  if (A === B) f = A.sym + '2';
  else {
    const hLast = lig.sym === 'H' && [14, 15].includes(central.group);
    const first = hLast ? central : (EN[central.sym] <= EN[lig.sym] ? central : lig);
    const second = first === central ? lig : central;
    f = first.sym + sub(cnt[first.sym]) + second.sym + sub(cnt[second.sym]);
    res.firstEl = first; res.secondEl = second;
  }
  res.formula = f;
  if (A === B) res.name = A.name.toLowerCase() + ' (' + f.replace('2', '₂') + ' molecule)';
  else if (SPECIAL_NAMES[f]) res.name = SPECIAL_NAMES[f];
  else {
    const c1 = cnt[res.firstEl.sym], c2 = cnt[res.secondEl.sym];
    res.name = (c1 > 1 ? PREFIX_N[c1] : '') + res.firstEl.name.toLowerCase() + ' ' + (c2 > 1 || c1 > 1 ? PREFIX_N[c2] : '') + ANION_NAME[res.secondEl.sym];
    res.name = res.name.replace('monooxide', 'monoxide').replace('aoxide', 'oxide');
  }
  const lone = (valenceOf(central) - n * order) / 2;
  const bondWord = order === 1 ? 'single' : order === 2 ? 'double' : 'triple';
  res.steps = [
    intro, elec,
    A === B
      ? `<b>Step 3 — Sharing.</b> Each ${A.sym} atom needs ${ca} electron${ca > 1 ? 's' : ''}, so the two atoms share <b>${ca} pair${ca > 1 ? 's' : ''}</b> of electrons → a <b>${bondWord} covalent bond</b> (${A.sym}${order === 1 ? '–' : order === 2 ? '=' : '≡'}${A.sym}). The element exists as <b>diatomic</b> ${f.replace('2', '₂')} molecules.`
      : `<b>Step 3 — Sharing.</b> ${central.sym} needs ${covalentCap(central)} electron${covalentCap(central) > 1 ? 's' : ''}; each ${lig.sym} needs ${order}. So <b>${n}</b> ${lig.sym} atom${n > 1 ? 's' : ''} each share${n > 1 ? '' : 's'} <b>${order} pair${order > 1 ? 's' : ''}</b> with one ${central.sym} → <b>${n} ${bondWord} bond${n > 1 ? 's' : ''}</b>.${lone > 0 ? ` ${central.sym} also keeps <b>${lone} lone pair${lone > 1 ? 's' : ''}</b> (non-bonding pairs).` : ''}`,
    `<b>Step 4 — Check:</b> every atom now has a full outer shell — ${[...new Set([central, lig])].map((e) => `${e.sym}: ${e.sym === 'H' ? '2 (like helium)' : '8 (like a noble gas)'}`).join(', ')}.${special ? ' <span class="warn">(In SO₂ the sulfur actually has 10 electrons around it — sulfur can expand its outer shell. You only need the displayed formula O=S=O at IGCSE.)</span>' : ''}${central.sym === 'B' ? ' <span class="warn">(Boron is an exception: it only has 6 outer electrons in BX₃.)</span>' : ''}`,
    `<b>Step 5 — Formula and name:</b> <b>${formulaHtml(f)}</b> — <b>${res.name}</b>. <span class="dim">For covalent compounds the name uses prefixes: mono = 1, di = 2, tri = 3, tetra = 4.</span>`,
    A === B ? '' : `<b>Step 6 — Balanced equation:</b> ${equationHtml(res.firstEl.sym, res.secondEl.sym, cnt[res.firstEl.sym], cnt[res.secondEl.sym], f, COV_STATE[f])}`,
    `<b>Step 7 — Properties:</b> ${formulaHtml(f)} is a <b>simple molecular</b> substance. The covalent bonds <i>inside</i> each molecule are strong, but the <b>forces between molecules are weak</b> → <b>low melting and boiling points</b>${COV_STATE[f] === 'g' || DIATOMIC.has(A.sym) && A === B && A.sym !== 'Br' && A.sym !== 'I' ? ' (a gas at room temperature)' : ''}. It does <b>not conduct electricity</b> (no ions or free electrons).`,
  ].filter(Boolean);
  if (pair === 'C+O') res.also.push('With too little oxygen, carbon forms <b>carbon monoxide, CO</b> — a <b>toxic</b> gas from incomplete combustion.');
  if (pair === 'H+O') res.also.push('Hydrogen burns in oxygen with a squeaky pop. This reaction is also used in the <b>hydrogen–oxygen fuel cell</b>, where water is the only product.');
  if (pair === 'Cl+P') res.also.push('With excess chlorine, PCl₅ can also form (phosphorus expands its outer shell — beyond IGCSE).');
  if (COMPOUND_FACTS[f]) res.also.push('<b>Real life:</b> ' + COMPOUND_FACTS[f]);
  res.anim = { kind: 'covalent', mol: covalentDef(central, lig, n, order, A === B, special, res.name), formula: f };
  return res;
}

// Build a molecule definition for Anims.covalent: central atom + n ligands, all with the same bond order.
function covalentDef(central, lig, n, order, same, special, name) {
  const R = (e) => (e.sym === 'H' ? RH : RX);
  const d = central.sym === 'H' || lig.sym === 'H' ? 54 : 64;
  const vC = central.sym === 'H' ? 1 : valenceOf(central), vL = lig.sym === 'H' ? 1 : valenceOf(lig);
  if (n === 1) return { name, atoms: [[central.sym, vC, R(central), -d / 2, 0], [lig.sym, vL, R(lig), d / 2, 0]], bonds: [[0, 1, order]] };
  const lone = (vC - n * order) / 2;
  let angs;
  if (n === 2) angs = lone > 0 || special ? [145, 35] : [180, 0];
  else if (n === 3) angs = lone > 0 ? [180, 0, 90] : [-90, 150, 30];
  else angs = [180, 0, -90, 90];
  const atoms = [[central.sym, vC, R(central), 0, 0]];
  const bonds = [];
  angs.forEach((a, i) => {
    atoms.push([lig.sym, vL, R(lig), Math.cos(a * DEG) * d, Math.sin(a * DEG) * d]);
    bonds.push([0, i + 1, order]);
  });
  // centre vertically
  const ys = atoms.map((x) => x[4]), mid = (Math.min(...ys) + Math.max(...ys)) / 2;
  atoms.forEach((x) => (x[4] -= mid));
  return { name, atoms, bonds };
}
