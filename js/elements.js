'use strict';
// All 118 elements: symbol, name, relative atomic mass (as on the IGCSE data sheet where given).

const EL_DATA = `H Hydrogen 1|He Helium 4|Li Lithium 7|Be Beryllium 9|B Boron 11|C Carbon 12|N Nitrogen 14|O Oxygen 16|F Fluorine 19|Ne Neon 20|
Na Sodium 23|Mg Magnesium 24|Al Aluminium 27|Si Silicon 28|P Phosphorus 31|S Sulfur 32|Cl Chlorine 35.5|Ar Argon 40|K Potassium 39|Ca Calcium 40|
Sc Scandium 45|Ti Titanium 48|V Vanadium 51|Cr Chromium 52|Mn Manganese 55|Fe Iron 56|Co Cobalt 59|Ni Nickel 59|Cu Copper 64|Zn Zinc 65|
Ga Gallium 70|Ge Germanium 73|As Arsenic 75|Se Selenium 79|Br Bromine 80|Kr Krypton 84|Rb Rubidium 85|Sr Strontium 88|Y Yttrium 89|Zr Zirconium 91|
Nb Niobium 93|Mo Molybdenum 96|Tc Technetium -|Ru Ruthenium 101|Rh Rhodium 103|Pd Palladium 106|Ag Silver 108|Cd Cadmium 112|In Indium 115|Sn Tin 119|
Sb Antimony 122|Te Tellurium 128|I Iodine 127|Xe Xenon 131|Cs Caesium 133|Ba Barium 137|La Lanthanum 139|Ce Cerium 140|Pr Praseodymium 141|Nd Neodymium 144|
Pm Promethium -|Sm Samarium 150|Eu Europium 152|Gd Gadolinium 157|Tb Terbium 159|Dy Dysprosium 163|Ho Holmium 165|Er Erbium 167|Tm Thulium 169|Yb Ytterbium 173|
Lu Lutetium 175|Hf Hafnium 178|Ta Tantalum 181|W Tungsten 184|Re Rhenium 186|Os Osmium 190|Ir Iridium 192|Pt Platinum 195|Au Gold 197|Hg Mercury 201|
Tl Thallium 204|Pb Lead 207|Bi Bismuth 209|Po Polonium -|At Astatine -|Rn Radon -|Fr Francium -|Ra Radium -|Ac Actinium -|Th Thorium 232|
Pa Protactinium 231|U Uranium 238|Np Neptunium -|Pu Plutonium -|Am Americium -|Cm Curium -|Bk Berkelium -|Cf Californium -|Es Einsteinium -|Fm Fermium -|
Md Mendelevium -|No Nobelium -|Lr Lawrencium -|Rf Rutherfordium -|Db Dubnium -|Sg Seaborgium -|Bh Bohrium -|Hs Hassium -|Mt Meitnerium -|Ds Darmstadtium -|
Rg Roentgenium -|Cn Copernicium -|Nh Nihonium -|Fl Flerovium -|Mc Moscovium -|Lv Livermorium -|Ts Tennessine -|Og Oganesson -`;

const ELEMENTS = (() => {
  const list = EL_DATA.split('|').map((s) => s.trim().split(' '));
  const set = (str) => new Set(str.split(' '));
  const alkali = set('Li Na K Rb Cs Fr'), alkaline = set('Be Mg Ca Sr Ba Ra');
  const halogen = set('F Cl Br I At'), noble = set('He Ne Ar Kr Xe Rn Og');
  const metalloid = set('B Si Ge As Sb Te');
  const nonmetal = set('H C N O P S Se');
  const post = set('Al Ga In Sn Tl Pb Bi Po Nh Fl Mc Lv Ts');
  const gases = set('H He N O F Ne Cl Ar Kr Xe Rn'), liquids = set('Br Hg');
  return list.map(([sym, name, mass], i) => {
    const z = i + 1;
    let group, period, frow = 0;
    if (z <= 2) { period = 1; group = z === 1 ? 1 : 18; }
    else if (z <= 18) { period = z <= 10 ? 2 : 3; const k = z - (period === 2 ? 3 : 11); group = k < 2 ? k + 1 : k + 11; }
    else if (z <= 54) { period = z <= 36 ? 4 : 5; group = z - (period === 4 ? 18 : 36); }
    else { period = z <= 86 ? 6 : 7; const k = z - (period === 6 ? 55 : 87); if (k < 2) group = k + 1; else if (k <= 16) { group = 0; frow = k - 1; } else group = k - 13; }
    let cat = 'transition';
    if (alkali.has(sym)) cat = 'alkali'; else if (alkaline.has(sym)) cat = 'alkaline'; else if (halogen.has(sym)) cat = 'halogen';
    else if (noble.has(sym)) cat = 'noble'; else if (metalloid.has(sym)) cat = 'metalloid'; else if (nonmetal.has(sym)) cat = 'nonmetal';
    else if (post.has(sym)) cat = 'post'; else if (frow) cat = period === 6 ? 'lanthanide' : 'actinide';
    const state = gases.has(sym) ? 'gas' : liquids.has(sym) ? 'liquid' : 'solid';
    return { z, sym, name, mass: mass === '-' ? null : +mass, group, period, frow, cat, state };
  });
})();
const EL = Object.fromEntries(ELEMENTS.map((e) => [e.sym, e]));

const EL_CATS = {
  alkali: ['Group I alkali metals', '#f97316'], alkaline: ['Group II metals', '#f59e0b'], transition: ['Transition elements', '#eab308'],
  post: ['Other metals', '#84cc16'], metalloid: ['Metalloids', '#14b8a6'], nonmetal: ['Non-metals', '#3b82f6'],
  halogen: ['Group VII halogens', '#8b5cf6'], noble: ['Group VIII noble gases', '#ec4899'], lanthanide: ['Lanthanides', '#a16207'], actinide: ['Actinides', '#9f1239'],
};
const ROMAN_G = { 1: 'I', 2: 'II', 13: 'III', 14: 'IV', 15: 'V', 16: 'VI', 17: 'VII', 18: 'VIII' };
const isMetal = (e) => ['alkali', 'alkaline', 'transition', 'post', 'lanthanide', 'actinide'].includes(e.cat);

// Electron shells. IGCSE model (2,8,8,2) for Z ≤ 20; beyond that, totals per shell from orbital filling (simplified).
function elementShells(z) {
  if (z <= 20) return UI.shells(z);
  // elements whose real configuration breaks the simple filling order
  const EXC = { 24: [2, 8, 13, 1], 29: [2, 8, 18, 1], 41: [2, 8, 18, 12, 1], 42: [2, 8, 18, 13, 1], 44: [2, 8, 18, 15, 1], 45: [2, 8, 18, 16, 1], 46: [2, 8, 18, 18], 47: [2, 8, 18, 18, 1], 78: [2, 8, 18, 32, 17, 1], 79: [2, 8, 18, 32, 18, 1] };
  if (EXC[z]) return EXC[z].slice();
  const order = [[1, 2], [2, 2], [2, 6], [3, 2], [3, 6], [4, 2], [3, 10], [4, 6], [5, 2], [4, 10], [5, 6], [6, 2], [4, 14], [5, 10], [6, 6], [7, 2], [5, 14], [6, 10], [7, 6]];
  const sh = [];
  let left = z;
  for (const [n, cap] of order) { if (left <= 0) break; const k = Math.min(cap, left); sh[n - 1] = (sh[n - 1] || 0) + k; left -= k; }
  return sh.map((v) => v || 0);
}

// Outer-shell (valence) electrons for main-group elements, or null.
function valenceOf(e) {
  if (e.group === 1 || e.group === 2) return e.group;
  if (e.group >= 13 && e.group <= 18) return e.sym === 'He' ? 2 : e.group - 10;
  return null;
}

// Common ion charges students meet.
const ION_CHARGE = { Fe: [3, 2], Cu: [2, 1], Zn: [2], Ag: [1], Pb: [2], Sn: [2], Cr: [3], Mn: [2], Ni: [2], Co: [2], Ti: [4], Au: [3], Hg: [2], Pt: [2] };

// Short facts for elements students meet at IGCSE.
const EL_FACTS = {
  H: 'Lightest element. Colourless gas, H₂. Burns with a squeaky pop. Used in fuel cells and the Haber process.',
  He: 'Noble gas — unreactive, monatomic. Low density: used in balloons.',
  Li: 'Group I. Soft metal, reacts steadily with water (red flame). Used in rechargeable batteries.',
  C: 'Non-metal. Exists as diamond (cutting tools) and graphite (lubricant, electrodes). Basis of organic chemistry. Coke reduces iron ore.',
  N: 'Makes up 78% of air. Very unreactive N₂ (triple bond). Used to make ammonia (Haber process) and fertilisers.',
  O: '21% of air. Relights a glowing splint. Needed for combustion, respiration and rusting.',
  F: 'Most reactive halogen. Pale yellow gas, F₂.',
  Ne: 'Noble gas used in advertising signs (glows red-orange).',
  Na: 'Group I. Soft metal stored in oil; reacts vigorously with water (yellow flame).',
  Mg: 'Group II. Burns with a bright white flame to form MgO. Reacts with steam and dilute acids.',
  Al: 'Low density, resists corrosion (oxide layer). Aircraft, overhead cables, food containers. Extracted from bauxite by electrolysis.',
  Si: 'Metalloid. SiO₂ (sand) has a giant covalent structure. Used in computer chips.',
  P: 'Non-metal. Phosphates are used in NPK fertilisers.',
  S: 'Yellow non-metal. Burns to give SO₂, which causes acid rain. Used to make sulfuric acid (Contact process).',
  Cl: 'Pale yellow-green toxic gas, Cl₂. Bleaches damp litmus. Used to kill microbes in water.',
  Ar: 'Noble gas, about 0.9% of air. Used in light bulbs and welding (unreactive).',
  K: 'Group I. Reacts very vigorously with water (lilac flame). K is the “K” in NPK fertilisers.',
  Ca: 'Group II. Reacts with cold water. CaCO₃ = limestone; CaO used in the blast furnace and flue gas desulfurisation. Orange-red flame.',
  Cr: 'Transition metal in stainless steel. Cr³⁺ gives a green precipitate with NaOH.',
  Fe: 'Transition metal. Extracted in the blast furnace. Rusts (needs water + oxygen). Catalyst in the Haber process. Fe²⁺ (green) and Fe³⁺ (red-brown) precipitates.',
  Cu: 'Transition metal. Electrical wiring (good conductor, ductile). Below hydrogen — no reaction with dilute acids. Cu²⁺ is blue; blue-green flame.',
  Zn: 'Used for galvanising iron (sacrificial protection) and in brass (Cu + Zn). Zn²⁺ white precipitate dissolves in excess NaOH and NH₃.',
  Br: 'Red-brown liquid, Br₂. Bromine water is used to test for alkenes (orange → colourless).',
  Kr: 'Noble gas. Unreactive.',
  Ag: 'Unreactive precious metal. Silver nitrate is used to test for halide ions.',
  Sn: 'Used to coat steel cans (tin plating).',
  I: 'Grey-black solid, I₂. Least reactive of Cl, Br, I.',
  Ba: 'Group II. Barium nitrate tests for sulfate ions (white precipitate). Light green flame.',
  Pt: 'Unreactive metal. Used for inert electrodes and catalytic converters.',
  Au: 'Very unreactive — found native. Jewellery and electronics.',
  Hg: 'The only metal that is a liquid at room temperature.',
  Pb: 'Dense metal. Lead(II) bromide is the classic molten electrolysis example.',
  U: 'Radioactive metal used as nuclear fuel.',
};
