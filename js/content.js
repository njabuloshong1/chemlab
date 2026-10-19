'use strict';
// Lesson notes and quizzes, organised to follow Cambridge IGCSE Chemistry 0620 (2026–2028).
// <div data-anim="name"> placeholders are replaced by the matching interactive in Anims.

const EXT = '<span class="ext">Extended</span>';
const anim = (name, title) => `<div class="anim-slot" data-anim="${name}" data-title="${title}"></div>`;

const TOPICS = [
// ------------------------------------------------------------------
{
  id: 'states', num: '1', title: 'States of Matter', icon: '🧊', syl: 'Syllabus 1.1–1.2',
  intro: 'Everything is made of tiny particles. How they are arranged and how they move decides whether a substance is a solid, liquid or gas.',
  sections: [
    { h: 'Solids, liquids and gases', html: `
      ${anim('states', 'Particle model — drag the temperature slider')}
      <table class="tbl"><tr><th></th><th>Solid</th><th>Liquid</th><th>Gas</th></tr>
      <tr><td>Separation</td><td>very close</td><td>close</td><td>far apart</td></tr>
      <tr><td>Arrangement</td><td>regular</td><td>random</td><td>random</td></tr>
      <tr><td>Motion</td><td>vibrate about fixed positions</td><td>move around each other</td><td>move quickly in all directions</td></tr>
      <tr><td>Shape / volume</td><td>fixed shape, fixed volume</td><td>takes shape of container, fixed volume</td><td>fills the container</td></tr></table>` },
    { h: 'Changes of state', html: `
      <p><b>Melting</b> (solid → liquid), <b>boiling</b> (liquid → gas at the boiling point), <b>evaporating</b> (liquid → gas at the surface, below the boiling point), <b>condensing</b> (gas → liquid), <b>freezing</b> (liquid → solid).</p>
      <div class="key">Heating gives particles more <b>kinetic energy</b>. During melting and boiling the temperature <b>stays constant</b> — the energy is used to overcome the forces of attraction between particles, not to raise the temperature. This gives the flat parts of a <b>heating / cooling curve</b>. ${EXT}</div>` },
    { h: 'Gases: temperature and pressure', html: `
      <p>Heating a gas makes the particles move faster; at constant pressure the gas <b>expands</b> (volume increases). Increasing the pressure pushes the particles closer together, so the volume <b>decreases</b>.</p>
      <p class="dim">${EXT} Explain with particles: faster particles hit the walls harder and more often, so to keep the pressure the same the gas must take up more space.</p>` },
    { h: 'Diffusion', html: `
      ${anim('diffusion', 'NH₃ and HCl diffusion tube')}
      <p><b>Diffusion</b> is the net movement of particles from a region of <b>higher concentration</b> to <b>lower concentration</b>, caused by their random motion.</p>
      <div class="tip">${EXT} Gases with a <b>lower M<sub>r</sub></b> diffuse <b>faster</b>. NH<sub>3</sub> (17) is lighter than HCl (36.5), so the white ring forms closer to the HCl end.</div>` },
  ],
  quiz: [
    { q: 'Which describes the particles in a liquid?', o: ['Close together, regular arrangement, vibrate only', 'Close together, random arrangement, move around each other', 'Far apart, random arrangement, move quickly', 'Far apart, regular arrangement, vibrate only'], a: 1, e: 'Liquid particles are still touching (close together) but are not in a fixed pattern and can slide past each other.' },
    { q: 'What is the name of the change from gas to liquid?', o: ['Freezing', 'Evaporating', 'Condensing', 'Melting'], a: 2, e: 'Condensing is gas → liquid, e.g. steam turning to water on a cold window.' },
    { q: 'Why does the temperature stay constant while ice is melting?', o: ['The particles stop moving', 'Energy is used to overcome forces between particles', 'Heat is lost to the surroundings', 'The ice is impure'], a: 1, e: 'The energy supplied breaks the attractions holding the particles in the lattice, rather than increasing their kinetic energy.' },
    { q: 'A balloon is placed in a freezer. What happens to its volume and why?', o: ['Increases — particles move faster', 'Decreases — particles move slower', 'Stays the same — gases cannot change volume', 'Decreases — particles get smaller'], a: 1, e: 'Cooling lowers the kinetic energy of the gas particles; they move slower and hit the walls less, so the gas contracts. Particles themselves never change size.' },
    { q: 'Which gas diffuses fastest?', o: ['Chlorine, Cl₂ (Mᵣ 71)', 'Carbon dioxide, CO₂ (Mᵣ 44)', 'Methane, CH₄ (Mᵣ 16)', 'Oxygen, O₂ (Mᵣ 32)'], a: 2, e: 'The lower the relative molecular mass, the faster the particles move at the same temperature, so methane diffuses fastest.' },
    { q: 'Purple potassium manganate(VII) crystals are put in water. Slowly all the water turns purple. This is because…', o: ['the water particles are purple', 'particles move randomly from high to low concentration', 'the crystal reacts with water', 'convection currents stir the water'], a: 1, e: 'This is diffusion — the random motion of particles spreads them out until they are evenly mixed.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'atoms', num: '2', title: 'Atomic Structure & Isotopes', icon: '⚛️', syl: 'Syllabus 2.1–2.3',
  intro: 'Protons, neutrons and electrons — how atoms are built, how electrons are arranged in shells, and why isotopes exist.',
  sections: [
    { h: 'Elements, compounds and mixtures', html: `
      <ul><li><b>Element</b> — made of only one type of atom (e.g. Fe, O<sub>2</sub>).</li>
      <li><b>Compound</b> — two or more elements <b>chemically combined</b> in a fixed ratio (e.g. H<sub>2</sub>O, NaCl). Properties are different from the elements.</li>
      <li><b>Mixture</b> — two or more substances <b>not</b> chemically combined; can be separated by physical methods (e.g. air, sea water).</li></ul>` },
    { h: 'Inside the atom', html: `
      ${anim('atom', 'Atom builder — pick an element, add neutrons, make an ion')}
      <table class="tbl"><tr><th>Particle</th><th>Relative charge</th><th>Relative mass</th><th>Where</th></tr>
      <tr><td>Proton</td><td>+1</td><td>1</td><td>nucleus</td></tr>
      <tr><td>Neutron</td><td>0</td><td>1</td><td>nucleus</td></tr>
      <tr><td>Electron</td><td>−1</td><td>1/1836 (almost 0)</td><td>shells around the nucleus</td></tr></table>
      <div class="key"><b>Proton (atomic) number</b> = number of protons. <b>Mass (nucleon) number</b> = protons + neutrons. In a neutral atom, electrons = protons.<br>
      So: <b>neutrons = mass number − proton number</b>.</div>
      <p>Symbol notation: <span class="nuc"><sup>23</sup><sub>11</sub>Na</span> → 11 protons, 11 electrons, 23 − 11 = 12 neutrons.</p>` },
    { h: 'Electron shells (the golden rules)', html: `
      <p>Electrons fill shells from the inside out: first shell holds <b>2</b>, the next shells hold <b>8</b> (for elements 1–20). E.g. Al (13) = <b>2,8,3</b>; Ca (20) = <b>2,8,8,2</b>.</p>
      <ul><li>Number of <b>outer-shell electrons = group number</b> (Groups I–VII).</li>
      <li>Number of <b>occupied shells = period number</b>.</li>
      <li>Group VIII noble gases have a <b>full outer shell</b> → unreactive.</li></ul>` },
    { h: 'Isotopes and relative atomic mass', html: `
      <p><b>Isotopes</b> are atoms of the same element with the <b>same number of protons</b> but <b>different numbers of neutrons</b>. E.g. <span class="nuc"><sup>35</sup><sub>17</sub>Cl</span> and <span class="nuc"><sup>37</sup><sub>17</sub>Cl</span>.</p>
      <p>${EXT} Isotopes have the <b>same chemical properties</b> because they have the same number of electrons, so the same electronic configuration.</p>
      ${anim('ram', 'Relative atomic mass calculator')}
      <div class="tip">A<sub>r</sub> = (mass₁ × %₁ + mass₂ × %₂) ÷ 100. For chlorine: (35 × 75 + 37 × 25) ÷ 100 = <b>35.5</b>.</div>` },
  ],
  quiz: [
    { q: 'An atom has 17 protons and 18 neutrons. What is its mass number?', o: ['17', '18', '35', '1'], a: 2, e: 'Mass number = protons + neutrons = 17 + 18 = 35. (This is chlorine-35.)' },
    { q: 'What is the electronic configuration of magnesium (proton number 12)?', o: ['2,8,2', '2,10', '8,4', '2,2,8'], a: 0, e: '12 electrons: 2 in the first shell, 8 in the second, 2 in the third → 2,8,2. Group II, Period 3.' },
    { q: 'Which particle has a relative charge of 0 and relative mass of 1?', o: ['Proton', 'Electron', 'Neutron', 'Ion'], a: 2, e: 'The neutron is neutral (0) and has the same relative mass as a proton (1).' },
    { q: '¹²C and ¹⁴C are isotopes. How are they different?', o: ['Different number of protons', 'Different number of electrons', 'Different number of neutrons', 'Different chemical properties'], a: 2, e: 'Isotopes have the same protons (6) and electrons (6) but different neutrons (6 and 8). Same electrons → same chemical properties.' },
    { q: 'An element is in Group VI and Period 3. Which element is it?', o: ['Oxygen', 'Sulfur', 'Selenium', 'Phosphorus'], a: 1, e: 'Period 3 → 3 shells; Group VI → 6 outer electrons → 2,8,6 = 16 electrons = sulfur.' },
    { q: 'Boron has two isotopes: ¹⁰B (20%) and ¹¹B (80%). What is its relative atomic mass?', o: ['10.2', '10.5', '10.8', '11.0'], a: 2, e: '(10 × 20 + 11 × 80) ÷ 100 = (200 + 880) ÷ 100 = 10.8.' },
    { q: 'How many electrons are in a ²⁷₁₃Al³⁺ ion?', o: ['13', '10', '16', '27'], a: 1, e: 'The atom has 13 electrons. A 3+ charge means it has lost 3 electrons → 13 − 3 = 10 (configuration 2,8).' },
    { q: 'Air is best described as…', o: ['an element', 'a compound', 'a mixture', 'an ion'], a: 2, e: 'Air contains N₂, O₂, Ar, CO₂ etc. that are not chemically combined — it is a mixture.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'ionic', num: '3', title: 'Ions & Ionic Bonding', icon: '⚡', syl: 'Syllabus 2.4',
  intro: 'Metals give electrons away, non-metals take them. Watch electrons jump from atom to atom and see how ions form a giant lattice.',
  sections: [
    { h: 'What is an ion?', html: `
      <p>An <b>ion</b> is an atom (or group of atoms) with a <b>charge</b>, because it has lost or gained electrons. <b>Protons never change</b> — only electrons move.</p>
      <ul><li><b>Cation</b> — positive ion, formed when an atom <b>loses</b> electrons. Metals form cations (e.g. Na<sup>+</sup>, Mg<sup>2+</sup>, Al<sup>3+</sup>).</li>
      <li><b>Anion</b> — negative ion, formed when an atom <b>gains</b> electrons. Non-metals form anions (e.g. Cl<sup>−</sup>, O<sup>2−</sup>, N<sup>3−</sup>).</li></ul>
      <table class="tbl"><tr><th>Group</th><th>I</th><th>II</th><th>III</th><th>V</th><th>VI</th><th>VII</th></tr>
      <tr><td>Ion charge</td><td>1+</td><td>2+</td><td>3+</td><td>3−</td><td>2−</td><td>1−</td></tr></table>
      <div class="tip">Try the “Show ion” box in the Atom builder in Topic 2 to see this.</div>` },
    { h: 'Forming an ionic bond', html: `
      ${anim('ionic', 'Electron transfer — dot-and-cross')}
      <div class="key">An <b>ionic bond</b> is a <b>strong electrostatic attraction between oppositely charged ions</b>. It forms between a <b>metal</b> and a <b>non-metal</b> when electrons are <b>transferred</b> from the metal to the non-metal.</div>
      <p>In dot-and-cross diagrams draw the ions in square brackets with the charge at the top right, e.g. [Na]<sup>+</sup> [Cl]<sup>−</sup>, and show the electrons of each atom with a different symbol.</p>
      <p>Working out formulae from charges ${EXT}: the total charge must be zero. Mg<sup>2+</sup> and Cl<sup>−</sup> → MgCl<sub>2</sub>; Al<sup>3+</sup> and O<sup>2−</sup> → Al<sub>2</sub>O<sub>3</sub>.</p>
      <p class="dim">Useful compound ions: OH<sup>−</sup> hydroxide, NO<sub>3</sub><sup>−</sup> nitrate, SO<sub>4</sub><sup>2−</sup> sulfate, CO<sub>3</sub><sup>2−</sup> carbonate, NH<sub>4</sub><sup>+</sup> ammonium.</p>` },
    { h: 'Properties of ionic compounds', html: `
      <ul><li><b>High melting and boiling points</b> — giant lattice with many strong electrostatic attractions that need lots of energy to overcome.</li>
      <li><b>Conduct electricity when molten or in aqueous solution</b> — ions are free to move.</li>
      <li><b>Do not conduct when solid</b> — ions are held in fixed positions.</li></ul>
      <p>${EXT} The structure is a <b>giant lattice</b>: a regular arrangement of alternating positive and negative ions (press “Show lattice” above).</p>` },
  ],
  quiz: [
    { q: 'What happens when sodium reacts with chlorine?', o: ['Sodium shares an electron with chlorine', 'Sodium transfers one electron to chlorine', 'Chlorine transfers one electron to sodium', 'Both atoms lose an electron'], a: 1, e: 'Na (2,8,1) loses its one outer electron to Cl (2,8,7). Na⁺ (2,8) and Cl⁻ (2,8,8) both have full outer shells.' },
    { q: 'What is the charge on an oxide ion?', o: ['2+', '1−', '2−', '6−'], a: 2, e: 'Oxygen (2,6) is in Group VI and gains 2 electrons → O²⁻ (2,8).' },
    { q: 'What is the formula of calcium chloride?', o: ['CaCl', 'Ca₂Cl', 'CaCl₂', 'Ca₂Cl₃'], a: 2, e: 'Ca²⁺ needs two Cl⁻ ions to balance the charge: (+2) + 2 × (−1) = 0 → CaCl₂.' },
    { q: 'Why does solid sodium chloride NOT conduct electricity?', o: ['It has no ions', 'Its electrons are fixed', 'Its ions cannot move', 'It is a covalent compound'], a: 2, e: 'In the solid the ions are fixed in the lattice. When molten or dissolved the ions can move and carry the current.' },
    { q: 'Which pair of elements forms an ionic compound?', o: ['Carbon and oxygen', 'Hydrogen and chlorine', 'Potassium and bromine', 'Nitrogen and hydrogen'], a: 2, e: 'Ionic bonding is between a metal (potassium) and a non-metal (bromine). The other pairs are both non-metals → covalent.' },
    { q: 'An ion has 12 protons and 10 electrons. What is it?', o: ['Ne', 'Mg²⁺', 'O²⁻', 'Na⁺'], a: 1, e: '12 protons → magnesium. Two fewer electrons than protons → charge 2+. So Mg²⁺.' },
    { q: 'Why does magnesium oxide have a very high melting point?', o: ['Weak forces between molecules', 'Strong electrostatic attraction between many ions in a giant lattice', 'It contains covalent bonds', 'It has delocalised electrons'], a: 1, e: 'MgO is a giant ionic lattice; lots of energy is needed to overcome the strong attraction between Mg²⁺ and O²⁻ ions (which have double charges).' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'covalent', num: '4', title: 'Covalent Bonding & Giant Structures', icon: '🔗', syl: 'Syllabus 2.5–2.6',
  intro: 'Non-metal atoms share pairs of electrons. See dot-and-cross diagrams build themselves, and compare diamond with graphite.',
  sections: [
    { h: 'Covalent bonds', html: `
      ${anim('covalent', 'Covalent bonding — atoms share electrons')}
      <div class="key">A <b>covalent bond</b> forms when a <b>pair of electrons is shared</b> between two atoms, so that each atom gets a noble-gas electronic configuration. Covalent bonds form between <b>non-metals</b>.</div>
      <p>Core molecules to learn: H<sub>2</sub>, Cl<sub>2</sub>, H<sub>2</sub>O, CH<sub>4</sub>, NH<sub>3</sub>, HCl. ${EXT} Also CH<sub>3</sub>OH, C<sub>2</sub>H<sub>4</sub>, O<sub>2</sub>, CO<sub>2</sub>, N<sub>2</sub> (double and triple bonds).</p>
      <div class="tip">In dot-and-cross diagrams: draw overlapping circles for outer shells, put the shared pairs in the overlap, and don't forget the <b>lone pairs</b> (e.g. the two on O in water).</div>` },
    { h: 'Simple molecular substances', html: `
      <ul><li><b>Low melting and boiling points</b> — ${EXT} only weak <b>intermolecular forces</b> between molecules need to be overcome (the covalent bonds inside the molecules do <b>not</b> break).</li>
      <li><b>Poor electrical conductivity</b> — no ions or free electrons.</li></ul>` },
    { h: 'Giant covalent structures', html: `
      ${anim('giant', 'Diamond, graphite and silicon(IV) oxide')}
      <table class="tbl"><tr><th></th><th>Diamond</th><th>Graphite</th></tr>
      <tr><td>Bonds per C</td><td>4</td><td>3, in layers</td></tr>
      <tr><td>Hardness</td><td>very hard</td><td>soft, slippery (layers slide)</td></tr>
      <tr><td>Conducts?</td><td>no</td><td>yes — delocalised electrons</td></tr>
      <tr><td>Use</td><td>cutting tools</td><td>lubricant, electrodes</td></tr></table>
      <p>${EXT} <b>Silicon(IV) oxide (SiO<sub>2</sub>)</b> has a structure like diamond, so it is also hard with a very high melting point and does not conduct.</p>` },
  ],
  quiz: [
    { q: 'How many shared pairs of electrons are in a molecule of methane, CH₄?', o: ['1', '2', '4', '8'], a: 2, e: 'Carbon (4 outer electrons) shares one pair with each of 4 hydrogen atoms → 4 single covalent bonds.' },
    { q: 'How many lone (non-bonding) pairs are on the oxygen atom in water?', o: ['0', '1', '2', '4'], a: 2, e: 'O has 6 outer electrons; 2 are used in bonds with H, leaving 4 electrons = 2 lone pairs.' },
    { q: 'Why does water have a low boiling point compared with sodium chloride?', o: ['Covalent bonds are weak', 'Only weak forces between molecules must be overcome', 'Water has ions', 'Water is a mixture'], a: 1, e: 'Boiling water separates molecules from each other — only weak intermolecular forces break, not the strong O–H covalent bonds.' },
    { q: 'Why is graphite used as a lubricant?', o: ['It has a high melting point', 'It conducts electricity', 'Its layers can slide over each other', 'Each carbon forms 4 bonds'], a: 2, e: 'The forces between graphite layers are weak, so the layers slide easily.' },
    { q: 'Why does graphite conduct electricity but diamond does not?', o: ['Graphite has ions', 'Graphite has delocalised electrons', 'Diamond has weak bonds', 'Diamond is a metal'], a: 1, e: 'Each C in graphite uses only 3 electrons in bonding; the 4th is delocalised and can move. In diamond all 4 are in bonds.' },
    { q: 'How many electrons are shared in the bond between the two atoms in N₂?', o: ['2', '3', '4', '6'], a: 3, e: 'N₂ has a triple bond = 3 shared pairs = 6 electrons. Each N then has a full outer shell of 8.' },
    { q: 'Which substance has a giant covalent structure?', o: ['Carbon dioxide', 'Silicon(IV) oxide', 'Methane', 'Sodium chloride'], a: 1, e: 'SiO₂ is a giant covalent lattice (like diamond). CO₂ and CH₄ are simple molecules; NaCl is ionic.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'metallic', num: '5', title: 'Metallic Bonding & Alloys', icon: '🔩', syl: 'Syllabus 2.7, 9.1–9.3',
  intro: 'Positive ions in a sea of electrons explain why metals conduct and bend. Alloys explain why steel is stronger than iron.',
  sections: [
    { h: 'Metallic bonding', html: `
      ${anim('metallic', 'Metallic lattice — connect a battery, use the hammer, make an alloy')}
      <div class="key">${EXT} <b>Metallic bonding</b> is the <b>electrostatic attraction between positive metal ions</b> in a giant lattice and a <b>“sea” of delocalised electrons</b>.</div>
      <ul><li><b>Good electrical conductivity</b> — delocalised electrons move through the structure.</li>
      <li><b>Malleable (hammered into shape) and ductile (drawn into wires)</b> — layers of ions slide over each other.</li></ul>` },
    { h: 'Physical properties and uses', html: `
      <table class="tbl"><tr><th>Property</th><th>Metals</th><th>Non-metals</th></tr>
      <tr><td>Thermal / electrical conductivity</td><td>good</td><td>poor (except graphite)</td></tr>
      <tr><td>Malleable / ductile</td><td>yes</td><td>no — brittle</td></tr>
      <tr><td>Melting / boiling points</td><td>usually high</td><td>usually low</td></tr></table>
      <ul><li>Aluminium — aircraft (<b>low density</b>); overhead cables (low density + good conductivity); food containers (<b>resists corrosion</b>).</li>
      <li>Copper — electrical wiring (<b>good conductivity and ductile</b>).</li></ul>` },
    { h: 'Alloys', html: `
      <p>An <b>alloy</b> is a <b>mixture of a metal with other elements</b>. E.g. <b>brass</b> = copper + zinc; <b>stainless steel</b> = iron + chromium, nickel and carbon (used for cutlery — hard and resists rusting).</p>
      <p>Alloys are often <b>harder and stronger</b> than pure metals. ${EXT} The <b>different-sized atoms</b> disrupt the layers so they <b>can no longer slide</b> over each other easily.</p>` },
  ],
  quiz: [
    { q: 'What is metallic bonding?', o: ['Sharing of electron pairs', 'Attraction between positive ions and delocalised electrons', 'Attraction between positive and negative ions', 'Weak forces between molecules'], a: 1, e: 'Metal atoms lose their outer electrons into a shared “sea”; the positive ions are attracted to these delocalised electrons.' },
    { q: 'Why can metals be hammered into shape?', o: ['They have weak bonds', 'Layers of ions can slide over each other', 'Electrons are fixed in place', 'They have low melting points'], a: 1, e: 'The layers slide but the delocalised electrons keep holding the ions together, so the metal bends instead of shattering.' },
    { q: 'Why is aluminium used for aircraft bodies?', o: ['High density', 'Low density', 'It is magnetic', 'It is very reactive'], a: 1, e: 'Aluminium has a low density (light) and is strong when alloyed.' },
    { q: 'Brass is an alloy of…', o: ['iron and carbon', 'copper and tin', 'copper and zinc', 'aluminium and magnesium'], a: 2, e: 'Brass = copper + zinc.' },
    { q: 'Why are alloys harder than pure metals?', o: ['They contain more electrons', 'Different-sized atoms stop layers sliding', 'They are compounds', 'They have ionic bonds'], a: 1, e: 'The atoms of the added element are a different size and distort the regular layers, so they cannot slide easily.' },
    { q: 'Why is copper used for electrical wiring?', o: ['Good conductor and ductile', 'Low density', 'High melting point only', 'Reacts with water'], a: 0, e: 'Copper conducts electricity very well and is ductile (can be drawn into wires).' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'stoich', num: '6', title: 'Formulae, Equations & Moles', icon: '⚖️', syl: 'Syllabus 3',
  intro: 'Write and balance equations, then use the mole to work out how much of everything reacts and is made.',
  sections: [
    { h: 'Balancing equations', html: `
      ${anim('balance', 'Equation balancer — count the atoms')}
      <p>Word equation → symbol equation → balance. Add <b>state symbols</b>: (s) solid, (l) liquid, (g) gas, (aq) aqueous (dissolved in water).</p>
      <p>${EXT} <b>Ionic equations</b> show only the ions that change, e.g. neutralisation: H<sup>+</sup>(aq) + OH<sup>−</sup>(aq) → H<sub>2</sub>O(l).</p>` },
    { h: 'Relative masses', html: `
      <p><b>A<sub>r</sub></b> (relative atomic mass) — average mass of the isotopes of an element compared with 1/12 of the mass of a carbon-12 atom.</p>
      <p><b>M<sub>r</sub></b> (relative molecular / formula mass) — the sum of the A<sub>r</sub> values. E.g. M<sub>r</sub>(H<sub>2</sub>O) = 2 × 1 + 16 = 18.</p>
      <p><b>Molecular formula</b> — the number and type of atoms in one molecule. ${EXT} <b>Empirical formula</b> — simplest whole-number ratio (e.g. C<sub>2</sub>H<sub>6</sub> → CH<sub>3</sub>).</p>` },
    { h: `The mole ${EXT}`, html: `
      ${anim('moles', 'Mole calculator — type any formula')}
      <div class="key"><b>1 mole</b> contains <b>6.02 × 10<sup>23</sup></b> particles (the Avogadro constant).<br>
      <b>moles = mass (g) ÷ molar mass (g/mol)</b><br>
      <b>gas volume (dm³) = moles × 24</b> at r.t.p.<br>
      <b>concentration (mol/dm³) = moles ÷ volume (dm³)</b> — remember 1 dm³ = 1000 cm³.</div>
      <p><b>Reacting masses:</b> (1) moles of the known substance, (2) use the equation ratio, (3) convert to mass/volume.</p>
      <p class="dim">Example: what mass of CO<sub>2</sub> forms from 25 g CaCO<sub>3</sub>? CaCO<sub>3</sub> → CaO + CO<sub>2</sub>. Moles CaCO<sub>3</sub> = 25 ÷ 100 = 0.25 → 0.25 mol CO<sub>2</sub> → 0.25 × 44 = <b>11 g</b>.</p>
      <p><b>Percentage yield</b> = actual ÷ theoretical × 100. <b>Percentage purity</b> = mass of pure product ÷ mass of sample × 100.</p>` },
  ],
  quiz: [
    { q: 'What is the Mᵣ of calcium carbonate, CaCO₃? (Ca = 40, C = 12, O = 16)', o: ['68', '84', '100', '116'], a: 2, e: '40 + 12 + 3 × 16 = 40 + 12 + 48 = 100.' },
    { q: 'Which equation is balanced?', o: ['H₂ + O₂ → H₂O', '2H₂ + O₂ → 2H₂O', 'H₂ + 2O₂ → 2H₂O', '2H₂ + 2O₂ → 2H₂O'], a: 1, e: 'Left: 4 H, 2 O. Right: 2 × H₂O = 4 H, 2 O. Balanced.' },
    { q: 'How many moles are in 9 g of water? (Mᵣ = 18)', o: ['0.5', '2', '9', '162'], a: 0, e: 'moles = mass ÷ Mᵣ = 9 ÷ 18 = 0.5 mol.' },
    { q: 'What volume does 0.5 mol of any gas occupy at r.t.p.?', o: ['6 dm³', '12 dm³', '24 dm³', '48 dm³'], a: 1, e: 'volume = moles × 24 = 0.5 × 24 = 12 dm³.' },
    { q: '25.0 cm³ of NaOH contains 0.0025 mol. What is its concentration?', o: ['0.0001 mol/dm³', '0.1 mol/dm³', '0.0625 mol/dm³', '10 mol/dm³'], a: 1, e: 'Convert volume: 25.0 cm³ = 0.0250 dm³. Concentration = 0.0025 ÷ 0.0250 = 0.1 mol/dm³.' },
    { q: 'What is the empirical formula of a compound with molecular formula C₆H₁₂O₆?', o: ['C₆H₁₂O₆', 'CH₂O', 'C₂H₄O₂', 'CHO'], a: 1, e: 'Divide by the highest common factor (6): C₁H₂O₁ = CH₂O.' },
    { q: 'What does the state symbol (aq) mean?', o: ['A liquid', 'Dissolved in water', 'A gas', 'An acid'], a: 1, e: '(aq) = aqueous, i.e. dissolved in water. A pure liquid is (l).' },
    { q: 'A reaction should make 20 g of product but only 15 g is obtained. What is the percentage yield?', o: ['15%', '25%', '75%', '133%'], a: 2, e: '% yield = 15 ÷ 20 × 100 = 75%.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'electro', num: '7', title: 'Electrolysis & Fuel Cells', icon: '🔋', syl: 'Syllabus 4',
  intro: 'Use electricity to break down ionic compounds. Watch ions move to the electrodes and see what forms there.',
  sections: [
    { h: 'What is electrolysis?', html: `
      ${anim('electrolysis', 'Electrolysis cell — choose an electrolyte and switch on')}
      <div class="key"><b>Electrolysis</b> is the decomposition of an ionic compound, when <b>molten</b> or in <b>aqueous solution</b>, by the passage of an electric current.<br>
      <b>Anode</b> = positive electrode. <b>Cathode</b> = negative electrode. <b>Electrolyte</b> = the molten or aqueous substance that is broken down.</div>
      <p>Positive ions (metals, H<sup>+</sup>) move to the <b>cathode</b>; negative ions (non-metals) move to the <b>anode</b>. Metals or hydrogen form at the cathode; non-metals (other than hydrogen) form at the anode.</p>` },
    { h: 'Products to learn', html: `
      <table class="tbl"><tr><th>Electrolyte (inert electrodes)</th><th>Cathode (−)</th><th>Anode (+)</th></tr>
      <tr><td>Molten lead(II) bromide</td><td>lead (grey metal)</td><td>bromine (red-brown vapour)</td></tr>
      <tr><td>Concentrated aqueous sodium chloride</td><td>hydrogen</td><td>chlorine</td></tr>
      <tr><td>Dilute sulfuric acid</td><td>hydrogen</td><td>oxygen</td></tr>
      <tr><td>${EXT} Aqueous copper(II) sulfate (carbon)</td><td>copper</td><td>oxygen; blue colour fades</td></tr>
      <tr><td>${EXT} Aqueous copper(II) sulfate (copper electrodes)</td><td>copper</td><td>copper anode dissolves; colour stays</td></tr></table>
      <div class="tip">${EXT} In aqueous solutions: at the cathode, <b>hydrogen</b> forms unless the metal is <b>less reactive than hydrogen</b> (e.g. copper). At the anode, a <b>halogen</b> forms from a concentrated halide; otherwise <b>oxygen</b> forms.</div>` },
    { h: `Half-equations ${EXT}`, html: `
      <p>Cathode — <b>reduction</b> (gain of electrons): Cu<sup>2+</sup> + 2e<sup>−</sup> → Cu; 2H<sup>+</sup> + 2e<sup>−</sup> → H<sub>2</sub></p>
      <p>Anode — <b>oxidation</b> (loss of electrons): 2Cl<sup>−</sup> → Cl<sub>2</sub> + 2e<sup>−</sup>; 4OH<sup>−</sup> → O<sub>2</sub> + 2H<sub>2</sub>O + 4e<sup>−</sup></p>
      <p>Charge transfer: electrons move through the <b>external circuit</b> (wires), ions move through the <b>electrolyte</b>, and electrons are lost or gained at the electrodes.</p>` },
    { h: 'Electroplating and fuel cells', html: `
      <p><b>Electroplating</b> coats a metal object to improve its <b>appearance</b> and <b>resistance to corrosion</b>. The object is the <b>cathode</b>, the plating metal is the <b>anode</b>, and the electrolyte contains ions of the plating metal.</p>
      <p>A <b>hydrogen–oxygen fuel cell</b> uses hydrogen and oxygen to produce electricity, with <b>water as the only chemical product</b>.</p>
      <p class="dim">${EXT} Advantages vs petrol engines: no CO<sub>2</sub>, only water; more efficient. Disadvantages: hydrogen is hard to store (flammable gas, high pressure), few filling stations, hydrogen is often made using fossil fuels.</p>` },
  ],
  quiz: [
    { q: 'In electrolysis, which electrode is the cathode?', o: ['The positive electrode', 'The negative electrode', 'Whichever is larger', 'The one in the middle'], a: 1, e: 'PANIC — Positive Anode, Negative Is Cathode.' },
    { q: 'What forms at the anode when molten lead(II) bromide is electrolysed?', o: ['Lead', 'Bromine', 'Hydrogen', 'Oxygen'], a: 1, e: 'Negative bromide ions are attracted to the positive anode, where they lose electrons and form bromine (red-brown vapour).' },
    { q: 'Why must lead(II) bromide be molten to be electrolysed?', o: ['So it can dissolve', 'So the ions can move', 'So the electrons can move', 'To make it react with the electrodes'], a: 1, e: 'In a solid the ions are fixed. Melting frees the ions to move to the electrodes.' },
    { q: 'Concentrated aqueous sodium chloride is electrolysed. What forms at the cathode?', o: ['Sodium', 'Chlorine', 'Hydrogen', 'Oxygen'], a: 2, e: 'Sodium is more reactive than hydrogen, so H⁺ ions are discharged instead → hydrogen gas.' },
    { q: 'Which half-equation shows what happens at the cathode during electrolysis of copper(II) sulfate?', o: ['Cu → Cu²⁺ + 2e⁻', 'Cu²⁺ + 2e⁻ → Cu', '4OH⁻ → O₂ + 2H₂O + 4e⁻', '2H⁺ → H₂ + 2e⁻'], a: 1, e: 'Cations gain electrons (reduction) at the cathode: Cu²⁺ + 2e⁻ → Cu.' },
    { q: 'To electroplate a spoon with silver, the spoon should be…', o: ['the anode', 'the cathode', 'the electrolyte', 'not connected'], a: 1, e: 'Ag⁺ ions are attracted to the negative cathode and deposit as silver on the spoon.' },
    { q: 'What is the only chemical product of a hydrogen–oxygen fuel cell?', o: ['Carbon dioxide', 'Water', 'Hydrogen peroxide', 'Nitrogen'], a: 1, e: '2H₂ + O₂ → 2H₂O. Only water is made.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'energy', num: '8', title: 'Energy Changes', icon: '🔥', syl: 'Syllabus 5',
  intro: 'Some reactions give out heat, some take it in. Reaction pathway diagrams show why.',
  sections: [
    { h: 'Exothermic and endothermic', html: `
      ${anim('energetics', 'Reaction pathway diagram')}
      <ul><li><b>Exothermic</b> — transfers thermal energy <b>to</b> the surroundings → surroundings get <b>hotter</b>. ${EXT} ΔH is <b>negative</b>.</li>
      <li><b>Endothermic</b> — takes in thermal energy <b>from</b> the surroundings → surroundings get <b>colder</b>. ${EXT} ΔH is <b>positive</b>.</li></ul>
      <p>${EXT} <b>Activation energy (E<sub>a</sub>)</b> is the minimum energy that colliding particles must have to react.</p>` },
    { h: `Bond energies ${EXT}`, html: `
      <div class="key"><b>Bond breaking is endothermic</b>; <b>bond making is exothermic</b>.<br>ΔH = (energy needed to break bonds) − (energy released when bonds form)</div>
      <p class="dim">Example: H<sub>2</sub> + Cl<sub>2</sub> → 2HCl. Bond energies (kJ/mol): H–H 436, Cl–Cl 242, H–Cl 431.<br>
      Break: 436 + 242 = 678. Make: 2 × 431 = 862. ΔH = 678 − 862 = <b>−184 kJ/mol</b> (exothermic, more energy released than taken in).</p>` },
  ],
  quiz: [
    { q: 'During a reaction the temperature of the solution rises. The reaction is…', o: ['endothermic', 'exothermic', 'reversible', 'electrolysis'], a: 1, e: 'Energy is transferred to the surroundings (the solution/thermometer), so it is exothermic.' },
    { q: 'For an endothermic reaction, ΔH is…', o: ['negative', 'positive', 'zero', 'always −100 kJ/mol'], a: 1, e: 'The products have more energy than the reactants, so ΔH is positive.' },
    { q: 'What is activation energy?', o: ['The energy given out by a reaction', 'The minimum energy colliding particles need to react', 'The energy of the products', 'The energy stored in a catalyst'], a: 1, e: 'Eₐ is the minimum energy needed for a collision to lead to reaction — the “hill” on the pathway diagram.' },
    { q: 'What effect does a catalyst have on the reaction pathway diagram?', o: ['Lowers ΔH', 'Raises the product energy', 'Lowers the activation energy', 'Makes the reaction endothermic'], a: 2, e: 'A catalyst provides an alternative route with a lower Eₐ. ΔH stays the same.' },
    { q: 'Breaking bonds is…', o: ['exothermic', 'endothermic', 'neither', 'only possible with a catalyst'], a: 1, e: 'Energy must be supplied to break bonds (endothermic). Energy is released when bonds form.' },
    { q: 'Energy to break bonds = 2000 kJ/mol; energy released making bonds = 2500 kJ/mol. What is ΔH?', o: ['+500 kJ/mol', '−500 kJ/mol', '+4500 kJ/mol', '−4500 kJ/mol'], a: 1, e: 'ΔH = 2000 − 2500 = −500 kJ/mol. Negative → exothermic.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'rates', num: '9', title: 'Rates, Equilibrium & Redox', icon: '⏱️', syl: 'Syllabus 6',
  intro: 'What makes reactions faster? A live particle simulation with a graph. Plus reversible reactions and redox.',
  sections: [
    { h: 'Physical and chemical changes', html: `<p>A <b>physical change</b> (e.g. melting, dissolving) makes no new substance and is usually easy to reverse. A <b>chemical change</b> makes a <b>new substance</b> and is usually hard to reverse (e.g. burning).</p>` },
    { h: 'Rate of reaction', html: `
      ${anim('rates', 'Collision theory simulator')}
      <table class="tbl"><tr><th>Change</th><th>Effect on rate</th><th>${EXT} Why (collision theory)</th></tr>
      <tr><td>↑ concentration (or ↑ pressure for gases)</td><td>faster</td><td>more particles per unit volume → more frequent collisions</td></tr>
      <tr><td>↑ surface area (smaller pieces)</td><td>faster</td><td>more particles exposed → more frequent collisions</td></tr>
      <tr><td>↑ temperature</td><td>faster</td><td>more kinetic energy → more frequent collisions AND more collisions with energy ≥ E<sub>a</sub></td></tr>
      <tr><td>add a catalyst / enzyme</td><td>faster</td><td>lowers E<sub>a</sub>, so more collisions are successful</td></tr></table>
      <p>A <b>catalyst</b> increases the rate and is <b>unchanged</b> at the end. <b>Enzymes</b> are biological catalysts.</p>
      <p><b>Measuring rate</b>: collect gas in a <b>gas syringe</b> (volume vs time) or measure <b>loss of mass</b> on a balance as gas escapes. The graph is steepest at the start and levels off when a reactant is used up.</p>` },
    { h: 'Reversible reactions', html: `
      <p>Some reactions are reversible: <b>⇌</b>. Heating blue <b>hydrated copper(II) sulfate</b> gives white anhydrous copper(II) sulfate + water; adding water turns it blue again. Cobalt(II) chloride: pink (hydrated) ⇌ blue (anhydrous).</p>
      <div class="key">${EXT} In a <b>closed system</b> at <b>equilibrium</b>: rate of forward reaction = rate of reverse reaction, and concentrations no longer change.<br>
      <b>Position of equilibrium</b>: ↑ temperature favours the endothermic direction; ↑ pressure favours the side with fewer gas molecules; adding a reactant shifts to the right; a catalyst does <b>not</b> move the equilibrium (it just gets there faster).</div>
      <p>${EXT} <b>Haber process</b>: N<sub>2</sub>(g) + 3H<sub>2</sub>(g) ⇌ 2NH<sub>3</sub>(g). N<sub>2</sub> from air, H<sub>2</sub> from methane. 450 °C, 200 atm, iron catalyst.<br>
      <b>Contact process</b>: 2SO<sub>2</sub>(g) + O<sub>2</sub>(g) ⇌ 2SO<sub>3</sub>(g). SO<sub>2</sub> from burning sulfur or roasting sulfide ores. 450 °C, 2 atm, vanadium(V) oxide catalyst.<br>
      <span class="dim">450 °C is a compromise: higher temperature is faster but gives a lower yield (forward reaction is exothermic). High pressure gives a higher yield but is expensive and dangerous.</span></p>` },
    { h: 'Redox', html: `
      <p><b>Oxidation</b> = gain of oxygen; <b>reduction</b> = loss of oxygen. A <b>redox</b> reaction has both happening at once. E.g. CuO + H<sub>2</sub> → Cu + H<sub>2</sub>O (CuO reduced, H<sub>2</sub> oxidised).</p>
      <div class="key">${EXT} <b>OIL RIG</b>: Oxidation Is Loss (of electrons), Reduction Is Gain. Oxidation also = increase in oxidation number; reduction = decrease.<br>
      Oxidising agent: oxidises another substance and is itself reduced. Reducing agent: reduces another substance and is itself oxidised.</div>
      <p>Roman numerals show oxidation number: iron(II) = Fe<sup>2+</sup>, iron(III) = Fe<sup>3+</sup>. ${EXT} Tests: acidified potassium manganate(VII) turns <b>purple → colourless</b> with a reducing agent; potassium iodide turns <b>colourless → brown</b> with an oxidising agent.</p>` },
  ],
  quiz: [
    { q: 'Marble chips react with acid. Which change makes the reaction faster?', o: ['Using larger chips', 'Using powdered marble', 'Using more dilute acid', 'Cooling the acid'], a: 1, e: 'Powder has a larger surface area, so collisions with acid particles are more frequent.' },
    { q: 'Why does increasing temperature increase the rate? (choose the best answer)', o: ['Particles get bigger', 'Activation energy decreases', 'Particles move faster and more collisions have energy ≥ Eₐ', 'More particles are made'], a: 2, e: 'Higher temperature: more frequent collisions AND a greater proportion of collisions have enough energy to react.' },
    { q: 'A catalyst…', o: ['is used up in the reaction', 'increases the activation energy', 'increases the rate and is unchanged at the end', 'changes the products'], a: 2, e: 'Catalysts speed up reactions by lowering Eₐ and are not used up.' },
    { q: 'Which apparatus measures the volume of gas produced?', o: ['Burette', 'Gas syringe', 'Thermometer', 'Balance'], a: 1, e: 'A gas syringe collects and measures gas volume. (A balance can also be used to measure mass lost.)' },
    { q: 'Water is added to white anhydrous copper(II) sulfate. What colour does it turn?', o: ['Pink', 'Blue', 'Green', 'Colourless'], a: 1, e: 'Anhydrous CuSO₄ (white) + water → hydrated CuSO₄·5H₂O (blue). This is also a test for water.' },
    { q: 'In the Haber process, what is the catalyst?', o: ['Vanadium(V) oxide', 'Nickel', 'Iron', 'Platinum'], a: 2, e: 'Iron is the catalyst for the Haber process. Vanadium(V) oxide is used in the Contact process.' },
    { q: 'In 2Mg + O₂ → 2MgO, magnesium is…', o: ['reduced', 'oxidised', 'neutralised', 'a catalyst'], a: 1, e: 'Magnesium gains oxygen (and loses electrons to form Mg²⁺) → oxidised.' },
    { q: 'At equilibrium in a closed system…', o: ['the reaction has stopped', 'forward and reverse rates are equal', 'there are only products', 'concentrations keep changing'], a: 1, e: 'Both reactions continue at the same rate (dynamic equilibrium), so concentrations stay constant.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'acids', num: '10', title: 'Acids, Bases & Salts', icon: '🧪', syl: 'Syllabus 7',
  intro: 'pH, indicators, neutralisation and how to make salts. Add alkali drop by drop and watch the H⁺ ions disappear.',
  sections: [
    { h: 'Acids and alkalis', html: `
      ${anim('titration', 'Neutralisation and indicators')}
      <ul><li>Acids contain <b>H<sup>+</sup>(aq)</b> ions; pH less than 7. Alkalis contain <b>OH<sup>−</sup>(aq)</b> ions; pH more than 7.</li>
      <li><b>Bases</b> are oxides or hydroxides of metals. <b>Alkalis</b> are <b>soluble bases</b>.</li>
      <li>Universal indicator: red (strongly acidic) → green (pH 7, neutral) → purple (strongly alkaline).</li></ul>
      <p>${EXT} Acids are <b>proton (H<sup>+</sup>) donors</b>; bases are <b>proton acceptors</b>. A <b>strong acid</b> is completely dissociated (HCl → H<sup>+</sup> + Cl<sup>−</sup>); a <b>weak acid</b> is partially dissociated (CH<sub>3</sub>COOH ⇌ H<sup>+</sup> + CH<sub>3</sub>COO<sup>−</sup>).</p>` },
    { h: 'Reactions of acids', html: `
      <div class="key">acid + metal → salt + hydrogen<br>acid + base → salt + water<br>acid + carbonate → salt + water + carbon dioxide<br>base + ammonium salt → salt + water + ammonia</div>
      <p>Hydrochloric acid → <b>chlorides</b>; sulfuric acid → <b>sulfates</b>; nitric acid → <b>nitrates</b>.</p>` },
    { h: 'Oxides', html: `<p><b>Acidic oxides</b> are non-metal oxides (e.g. SO<sub>2</sub>, CO<sub>2</sub>). <b>Basic oxides</b> are metal oxides (e.g. CuO, CaO). ${EXT} <b>Amphoteric oxides</b> react with both acids and bases to make a salt and water: Al<sub>2</sub>O<sub>3</sub> and ZnO.</p>` },
    { h: 'Making salts', html: `
      <p><b>Soluble salts</b>: add <b>excess</b> insoluble metal / base / carbonate to warm acid → <b>filter</b> off the excess → heat the filtrate to <b>crystallisation point</b> → cool → filter and dry the crystals. With an alkali, use a <b>titration</b> (no excess possible) and repeat without indicator.</p>
      <p>${EXT} <b>Insoluble salts</b>: <b>precipitation</b> — mix two solutions, filter, wash, dry. E.g. AgNO<sub>3</sub>(aq) + NaCl(aq) → AgCl(s) + NaNO<sub>3</sub>(aq).</p>
      <table class="tbl"><tr><th>Soluble</th><th>Insoluble</th></tr>
      <tr><td>all sodium, potassium, ammonium salts; all nitrates</td><td></td></tr>
      <tr><td>chlorides</td><td>except silver and lead chloride</td></tr>
      <tr><td>sulfates</td><td>except barium, calcium and lead sulfate</td></tr>
      <tr><td>carbonates of Na, K, NH<sub>4</sub> only</td><td>all other carbonates</td></tr>
      <tr><td>hydroxides of Na, K, NH<sub>4</sub> (Ca partially)</td><td>all other hydroxides</td></tr></table>
      <p><b>Hydrated</b> substances contain chemically combined water; <b>anhydrous</b> substances contain no water. ${EXT} <b>Water of crystallisation</b>: e.g. CuSO<sub>4</sub>·5H<sub>2</sub>O, CoCl<sub>2</sub>·6H<sub>2</sub>O.</p>` },
  ],
  quiz: [
    { q: 'What is the pH of a neutral solution?', o: ['0', '1', '7', '14'], a: 2, e: 'pH 7 is neutral (green in universal indicator).' },
    { q: 'Which ion is present in all acidic solutions?', o: ['OH⁻', 'H⁺', 'Cl⁻', 'Na⁺'], a: 1, e: 'Acids release H⁺(aq) ions in water.' },
    { q: 'Zinc reacts with hydrochloric acid. What are the products?', o: ['Zinc chloride + water', 'Zinc chloride + hydrogen', 'Zinc oxide + hydrogen', 'Zinc chloride + carbon dioxide'], a: 1, e: 'Metal + acid → salt + hydrogen. Zn + 2HCl → ZnCl₂ + H₂.' },
    { q: 'What colour is methyl orange in an alkali?', o: ['Red', 'Yellow', 'Blue', 'Colourless'], a: 1, e: 'Methyl orange is red in acid and yellow in alkali.' },
    { q: 'Which salt is insoluble in water?', o: ['Sodium chloride', 'Copper(II) sulfate', 'Barium sulfate', 'Potassium nitrate'], a: 2, e: 'Barium sulfate is insoluble (sulfates are soluble except Ba, Ca, Pb).' },
    { q: 'Why is excess copper(II) oxide added when making copper(II) sulfate from sulfuric acid?', o: ['To speed it up', 'To make sure all the acid reacts', 'To make the salt insoluble', 'To act as a catalyst'], a: 1, e: 'Excess base ensures all the acid is neutralised; the unreacted solid is then removed by filtration.' },
    { q: 'Ethanoic acid is a weak acid. This means it is…', o: ['very dilute', 'partially dissociated in water', 'completely dissociated in water', 'an alkali'], a: 1, e: 'Strong/weak describes how much the acid dissociates into ions — weak acids only partially dissociate.' },
    { q: 'Which oxide is amphoteric?', o: ['CaO', 'SO₂', 'ZnO', 'CO₂'], a: 2, e: 'ZnO (and Al₂O₃) react with both acids and bases.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'periodic', num: '11', title: 'The Periodic Table', icon: '🗂️', syl: 'Syllabus 8',
  intro: 'Groups, periods and trends. Click any element to explore it, and drop alkali metals into water.',
  sections: [
    { h: 'Arrangement', html: `
      ${anim('ptable', 'Interactive Periodic Table — click an element')}
      <p>Elements are arranged in order of increasing <b>proton number</b>. Vertical columns = <b>groups</b>; horizontal rows = <b>periods</b>. Across a period, elements change from <b>metals</b> to <b>non-metals</b>.</p>
      <p>Elements in the same group have the <b>same number of outer electrons</b>, so they have <b>similar chemical properties</b>. Group number tells you the ion charge (I → 1+, II → 2+, VI → 2−, VII → 1−).</p>` },
    { h: 'Group I — alkali metals', html: `
      ${anim('group1', 'Alkali metals in water')}
      <p>Lithium, sodium, potassium are <b>soft metals</b>. Down the group: <b>melting point decreases</b>, <b>density increases</b>, <b>reactivity increases</b>.</p>` },
    { h: 'Group VII — halogens', html: `
      <p>Chlorine, bromine, iodine are <b>diatomic</b> non-metals (Cl<sub>2</sub>, Br<sub>2</sub>, I<sub>2</sub>). Down the group: <b>density increases</b>, <b>reactivity decreases</b>.</p>
      <p>At r.t.p.: chlorine — <b>pale yellow-green gas</b>; bromine — <b>red-brown liquid</b>; iodine — <b>grey-black solid</b>.</p>
      <div class="key"><b>Displacement</b>: a more reactive halogen displaces a less reactive one from its halide. Cl<sub>2</sub> + 2KBr → 2KCl + Br<sub>2</sub> (solution turns orange). Iodine cannot displace chlorine.</div>` },
    { h: 'Transition elements and noble gases', html: `
      <p><b>Transition elements</b>: metals with high densities, high melting points, form <b>coloured compounds</b>, and often act as <b>catalysts</b>. ${EXT} Their ions have variable oxidation numbers, e.g. iron(II) and iron(III).</p>
      <p><b>Group VIII noble gases</b>: <b>unreactive, monatomic</b> gases because they have a <b>full outer shell</b>.</p>` },
  ],
  quiz: [
    { q: 'Elements in the same group have the same…', o: ['number of shells', 'number of outer electrons', 'mass number', 'number of neutrons'], a: 1, e: 'Same outer electrons → similar chemical properties.' },
    { q: 'Which Group I metal reacts most vigorously with water?', o: ['Lithium', 'Sodium', 'Potassium', 'They react the same'], a: 2, e: 'Reactivity increases down Group I: Li < Na < K.' },
    { q: 'What is bromine like at room temperature?', o: ['Pale yellow-green gas', 'Red-brown liquid', 'Grey-black solid', 'Colourless gas'], a: 1, e: 'Bromine is a red-brown liquid.' },
    { q: 'Chlorine water is added to potassium iodide solution. What happens?', o: ['No reaction', 'Iodine is displaced — solution turns brown', 'Chlorine is displaced', 'A white precipitate forms'], a: 1, e: 'Chlorine is more reactive than iodine, so Cl₂ + 2I⁻ → 2Cl⁻ + I₂ (brown).' },
    { q: 'Why are noble gases unreactive?', o: ['They are metals', 'They have a full outer shell', 'They are very dense', 'They form ions easily'], a: 1, e: 'With a full outer shell they do not need to lose, gain or share electrons.' },
    { q: 'Which is a property of transition elements?', o: ['Low density', 'Form white compounds only', 'Often act as catalysts', 'Low melting points'], a: 2, e: 'Transition metals (e.g. iron, nickel) are often catalysts, and form coloured compounds.' },
    { q: 'Rubidium is below potassium in Group I. Predict its melting point compared with potassium.', o: ['Higher', 'Lower', 'The same', 'It is a gas'], a: 1, e: 'Melting point decreases down Group I, so rubidium is lower than potassium.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'metals', num: '12', title: 'Metals: Reactivity, Extraction & Rusting', icon: '⛏️', syl: 'Syllabus 9.1, 9.4–9.6',
  intro: 'Which metal wins? Put metal strips into solutions and predict displacement. Then see how iron and aluminium are extracted.',
  sections: [
    { h: 'Reactivity series', html: `
      ${anim('displacement', 'Displacement reactions')}
      <div class="key"><b>K Na Ca Mg Al (C) Zn Fe (H) Cu Ag Au</b><br><span class="dim">“Please Send Cats, Monkeys And Cute Zebras Into Hot Countries Signed Gordon”</span></div>
      <ul><li>K, Na, Ca react with <b>cold water</b> (metal hydroxide + hydrogen).</li>
      <li>Mg reacts with <b>steam</b> (magnesium oxide + hydrogen).</li>
      <li>Mg, Zn, Fe react with <b>dilute hydrochloric acid</b> (salt + hydrogen); Cu, Ag, Au do <b>not</b> (below hydrogen).</li></ul>
      <p>${EXT} Reactivity = tendency to form <b>positive ions</b>. A more reactive metal displaces a less reactive one from its aqueous ions. ${EXT} Aluminium seems unreactive because of a protective <b>oxide layer</b>.</p>` },
    { h: 'Corrosion', html: `
      <p>Iron and steel <b>rust</b> when in contact with both <b>water and oxygen</b>, forming hydrated iron(III) oxide.</p>
      <p><b>Barrier methods</b> (painting, greasing, coating with plastic) keep out oxygen and water. ${EXT} <b>Galvanising</b> = coating with zinc. It is a barrier and also <b>sacrificial protection</b>: zinc is more reactive, so it loses electrons (is oxidised) in preference to iron.</p>` },
    { h: 'Extraction of metals', html: `
      <p>The more reactive the metal, the harder it is to extract. Metals below carbon can be extracted by <b>heating with carbon</b>; metals above carbon need <b>electrolysis</b>.</p>
      <p><b>Blast furnace</b> (iron from hematite, Fe<sub>2</sub>O<sub>3</sub>):</p>
      <ol><li>Coke burns to give heat: C + O<sub>2</sub> → CO<sub>2</sub></li>
      <li>CO<sub>2</sub> is reduced to carbon monoxide: C + CO<sub>2</sub> → 2CO</li>
      <li>CO reduces iron(III) oxide: Fe<sub>2</sub>O<sub>3</sub> + 3CO → 2Fe + 3CO<sub>2</sub></li>
      <li>Limestone decomposes: CaCO<sub>3</sub> → CaO + CO<sub>2</sub></li>
      <li>Slag forms: CaO + SiO<sub>2</sub> → CaSiO<sub>3</sub> (removes impurities)</li></ol>
      <p class="dim">Core candidates need the steps in words; ${EXT} candidates also need the symbol equations.</p>
      <p><b>Aluminium</b>: main ore is <b>bauxite</b>; extracted by <b>electrolysis</b>. ${EXT} Aluminium oxide is dissolved in molten <b>cryolite</b> (lowers the melting point → saves energy). Cathode: Al<sup>3+</sup> + 3e<sup>−</sup> → Al. Anode: 2O<sup>2−</sup> → O<sub>2</sub> + 4e<sup>−</sup>. The carbon anodes react with oxygen to form CO<sub>2</sub>, so they <b>burn away</b> and must be replaced.</p>` },
  ],
  quiz: [
    { q: 'Which metal does NOT react with dilute hydrochloric acid?', o: ['Magnesium', 'Zinc', 'Iron', 'Copper'], a: 3, e: 'Copper is below hydrogen in the reactivity series.' },
    { q: 'Zinc is placed in copper(II) sulfate solution. What is seen?', o: ['No change', 'Brown copper forms and the blue colour fades', 'Zinc turns blue', 'Bubbles of oxygen'], a: 1, e: 'Zinc is more reactive, so it displaces copper: Zn + Cu²⁺ → Zn²⁺ + Cu.' },
    { q: 'What two substances are needed for iron to rust?', o: ['Oxygen and carbon dioxide', 'Water and oxygen', 'Water and salt only', 'Nitrogen and water'], a: 1, e: 'Both water and oxygen are needed (salt speeds it up but is not required).' },
    { q: 'Why does galvanising protect iron even if the zinc coating is scratched?', o: ['Zinc is less reactive', 'Zinc is more reactive and corrodes instead of iron', 'Zinc is a non-metal', 'Zinc reflects water'], a: 1, e: 'Sacrificial protection: zinc loses electrons more readily than iron, so it is oxidised first.' },
    { q: 'In the blast furnace, which substance reduces iron(III) oxide?', o: ['Oxygen', 'Carbon monoxide', 'Calcium oxide', 'Slag'], a: 1, e: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂. CO removes oxygen from the iron oxide.' },
    { q: 'Why is aluminium extracted by electrolysis rather than with carbon?', o: ['Aluminium is more reactive than carbon', 'Aluminium is less reactive than carbon', 'Carbon is too expensive', 'Aluminium has no ore'], a: 0, e: 'Carbon cannot remove oxygen from a metal that is more reactive than carbon.' },
    { q: 'Why is cryolite used in aluminium extraction?', o: ['It is the ore', 'It lowers the melting point of the electrolyte', 'It is a catalyst', 'It makes the anodes last longer'], a: 1, e: 'Dissolving Al₂O₃ in molten cryolite lowers the operating temperature, saving energy.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'environment', num: '13', title: 'Chemistry of the Environment', icon: '🌍', syl: 'Syllabus 10',
  intro: 'Water treatment, fertilisers, air pollution and climate change.',
  sections: [
    { h: 'Water', html: `
      <p>Test for <b>water</b>: anhydrous <b>cobalt(II) chloride</b> turns <b>blue → pink</b>; anhydrous <b>copper(II) sulfate</b> turns <b>white → blue</b>. Test for <b>pure</b> water: it melts at exactly 0 °C and boils at exactly 100 °C.</p>
      <p>Distilled water is used in practical chemistry because it contains fewer impurities.</p>
      <p>Natural water may contain: dissolved oxygen (good for aquatic life), metal compounds (some are essential minerals, some toxic), plastics (harm aquatic life), sewage (harmful microbes), nitrates and phosphates from fertilisers/detergents (cause deoxygenation of water).</p>
      <div class="key">Domestic water treatment: <b>sedimentation and filtration</b> remove solids → <b>carbon</b> removes tastes and odours → <b>chlorination</b> kills microbes.</div>` },
    { h: 'Fertilisers', html: `<p>Ammonium salts and nitrates are used as fertilisers. <b>NPK fertilisers</b> provide <b>nitrogen, phosphorus and potassium</b> for improved plant growth.</p>` },
    { h: 'Air quality and climate', html: `
      ${anim('greenhouse', 'The greenhouse effect')}
      <p>Clean dry air: about <b>78% nitrogen</b>, <b>21% oxygen</b>, the rest is noble gases (mainly argon) and carbon dioxide.</p>
      <table class="tbl"><tr><th>Pollutant</th><th>Source</th><th>Effect</th></tr>
      <tr><td>Carbon dioxide</td><td>complete combustion of carbon fuels</td><td>global warming → climate change</td></tr>
      <tr><td>Carbon monoxide</td><td>incomplete combustion</td><td>toxic gas</td></tr>
      <tr><td>Particulates</td><td>incomplete combustion</td><td>respiratory problems, cancer</td></tr>
      <tr><td>Methane</td><td>decomposing vegetation, digestion in animals</td><td>global warming</td></tr>
      <tr><td>Oxides of nitrogen</td><td>car engines</td><td>acid rain, photochemical smog, respiratory problems</td></tr>
      <tr><td>Sulfur dioxide</td><td>burning fossil fuels containing sulfur</td><td>acid rain</td></tr></table>
      <p>Reducing acid rain: <b>catalytic converters</b>, low-sulfur fuels, <b>flue gas desulfurisation</b> with calcium oxide. ${EXT} In catalytic converters: 2CO + 2NO → 2CO<sub>2</sub> + N<sub>2</sub>. NO forms when N<sub>2</sub> and O<sub>2</sub> from air react at the high temperature in engines.</p>
      <p><b>Photosynthesis</b>: carbon dioxide + water → glucose + oxygen (needs chlorophyll and light). ${EXT} 6CO<sub>2</sub> + 6H<sub>2</sub>O → C<sub>6</sub>H<sub>12</sub>O<sub>6</sub> + 6O<sub>2</sub>.</p>` },
  ],
  quiz: [
    { q: 'Anhydrous cobalt(II) chloride is used to test for water. What colour change is seen?', o: ['White to blue', 'Blue to pink', 'Pink to blue', 'Orange to green'], a: 1, e: 'Cobalt(II) chloride turns from blue (anhydrous) to pink when water is added.' },
    { q: 'Which stage of water treatment kills microbes?', o: ['Filtration', 'Sedimentation', 'Carbon', 'Chlorination'], a: 3, e: 'Chlorine kills harmful microbes.' },
    { q: 'What percentage of clean dry air is nitrogen?', o: ['21%', '50%', '78%', '1%'], a: 2, e: 'About 78% N₂, 21% O₂.' },
    { q: 'Which pollutant is produced by incomplete combustion and is toxic?', o: ['Carbon dioxide', 'Carbon monoxide', 'Sulfur dioxide', 'Methane'], a: 1, e: 'Carbon monoxide forms when there is not enough oxygen; it is toxic.' },
    { q: 'Which gas is a major cause of acid rain?', o: ['Methane', 'Sulfur dioxide', 'Nitrogen', 'Argon'], a: 1, e: 'Sulfur dioxide (and oxides of nitrogen) dissolve in rain to make it acidic.' },
    { q: 'What do NPK fertilisers provide?', o: ['Nitrogen, phosphorus, potassium', 'Nitrogen, potassium, krypton', 'Neon, phosphorus, potassium', 'Nitrates, phosphates, carbonates'], a: 0, e: 'N = nitrogen, P = phosphorus, K = potassium.' },
    { q: 'How do greenhouse gases cause global warming?', o: ['They make holes in the ozone layer', 'They absorb thermal energy and reduce its loss to space', 'They reflect sunlight away', 'They react with oxygen'], a: 1, e: 'CO₂ and CH₄ absorb and re-emit infrared energy from the Earth, reducing the thermal energy lost to space.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'organic', num: '14', title: 'Organic Chemistry', icon: '🛢️', syl: 'Syllabus 11',
  intro: 'Alkanes, alkenes, alcohols, acids and polymers. Build molecules carbon by carbon.',
  sections: [
    { h: 'Homologous series and naming', html: `
      ${anim('organic', 'Molecule builder — displayed formulae')}
      <p>Prefixes: <b>meth</b> (1 C), <b>eth</b> (2), <b>prop</b> (3), <b>but</b> (4). Endings: <b>-ane</b> alkane, <b>-ene</b> alkene, <b>-ol</b> alcohol, <b>-oic acid</b> carboxylic acid.</p>
      <p>A <b>functional group</b> is an atom or group of atoms that determines the chemical properties of a homologous series. <b>Saturated</b>: all C–C bonds single. <b>Unsaturated</b>: at least one C=C.</p>
      <p>${EXT} <b>Structural isomers</b>: same molecular formula, different structural formula, e.g. C<sub>4</sub>H<sub>10</sub>: CH<sub>3</sub>CH<sub>2</sub>CH<sub>2</sub>CH<sub>3</sub> and CH<sub>3</sub>CH(CH<sub>3</sub>)CH<sub>3</sub>; C<sub>4</sub>H<sub>8</sub>: but-1-ene and but-2-ene.</p>` },
    { h: 'Fuels', html: `
      <p>Fossil fuels: <b>coal, natural gas</b> (mainly <b>methane</b>) and <b>petroleum</b>. <b>Hydrocarbons</b> contain hydrogen and carbon only. Petroleum is a mixture of hydrocarbons, separated by <b>fractional distillation</b>.</p>
      <p>Going <b>up</b> the column: shorter chains, more volatile, lower boiling points, lower viscosity.</p>
      <table class="tbl"><tr><th>Fraction (top → bottom)</th><th>Use</th></tr>
      <tr><td>refinery gas</td><td>heating and cooking</td></tr><tr><td>gasoline / petrol</td><td>fuel for cars</td></tr>
      <tr><td>naphtha</td><td>chemical feedstock</td></tr><tr><td>kerosene / paraffin</td><td>jet fuel</td></tr>
      <tr><td>diesel oil / gas oil</td><td>diesel engines</td></tr><tr><td>fuel oil</td><td>ships, home heating</td></tr>
      <tr><td>lubricating oil</td><td>lubricants, waxes, polishes</td></tr><tr><td>bitumen</td><td>making roads</td></tr></table>` },
    { h: 'Alkanes and alkenes', html: `
      ${anim('bromine', 'Bromine water test')}
      <p><b>Alkanes</b>: single bonds, saturated, generally unreactive except <b>combustion</b> and <b>substitution</b> with chlorine. ${EXT} Substitution needs <b>UV light</b>: CH<sub>4</sub> + Cl<sub>2</sub> → CH<sub>3</sub>Cl + HCl.</p>
      <p><b>Alkenes</b>: contain C=C, unsaturated. Made by <b>cracking</b> large alkanes (high temperature + catalyst) → smaller alkanes, alkenes and hydrogen. Cracking is done because there is more demand for short chains (petrol) and alkenes (to make polymers).</p>
      <p>${EXT} <b>Addition reactions</b> (only one product): with bromine → dibromoalkane; with hydrogen (nickel catalyst) → alkane; with steam (acid catalyst) → alcohol.</p>` },
    { h: 'Alcohols and carboxylic acids', html: `
      <p><b>Ethanol</b> is made by: <b>fermentation</b> of glucose (yeast, 25–35 °C, no oxygen) or <b>addition of steam to ethene</b> (300 °C, 60 atm, acid catalyst). Ethanol burns: C<sub>2</sub>H<sub>5</sub>OH + 3O<sub>2</sub> → 2CO<sub>2</sub> + 3H<sub>2</sub>O. Uses: <b>solvent</b> and <b>fuel</b>.</p>
      <p class="dim">${EXT} Fermentation: renewable, low energy, but slow, batch process and impure product. From ethene: fast, continuous, pure, but uses non-renewable crude oil and high energy.</p>
      <p><b>Ethanoic acid</b> reacts like other acids: with metals (→ ethanoate + hydrogen), bases, carbonates. ${EXT} Made by oxidising ethanol with acidified potassium manganate(VII) or by bacteria (vinegar). Acid + alcohol (acid catalyst) → <b>ester</b> + water, e.g. ethanoic acid + ethanol → ethyl ethanoate.</p>` },
    { h: 'Polymers', html: `
      <p><b>Polymers</b> are large molecules built up from many small molecules called <b>monomers</b>. <b>Addition polymerisation</b>: ethene → <b>poly(ethene)</b>. Plastics are made from polymers.</p>
      <p>Problems with plastics: <b>landfill</b> (non-biodegradable), <b>accumulation in oceans</b>, <b>toxic gases</b> when burned.</p>
      <p class="dim">${EXT} Condensation polymers also produce a small molecule (water): <b>nylon</b> (polyamide: dicarboxylic acid + diamine) and <b>PET</b> (polyester: dicarboxylic acid + diol). PET can be converted back into monomers and re-polymerised. <b>Proteins</b> are natural polyamides made from amino acids.</p>` },
  ],
  quiz: [
    { q: 'What is the general formula of the alkanes?', o: ['CₙH₂ₙ', 'CₙH₂ₙ₊₂', 'CₙH₂ₙ₊₁OH', 'CₙH₂ₙ₋₂'], a: 1, e: 'Alkanes: CₙH₂ₙ₊₂ (e.g. methane CH₄, ethane C₂H₆).' },
    { q: 'Which compound decolourises bromine water?', o: ['Ethane', 'Ethene', 'Ethanol', 'Methane'], a: 1, e: 'Ethene has a C=C double bond; bromine adds across it so the orange colour disappears.' },
    { q: 'What is the name of CH₃CH₂OH?', o: ['Methanol', 'Ethanol', 'Ethanoic acid', 'Ethene'], a: 1, e: '2 carbons (eth-) and an –OH group (-ol) → ethanol.' },
    { q: 'Which fraction from petroleum is used to make roads?', o: ['Naphtha', 'Kerosene', 'Fuel oil', 'Bitumen'], a: 3, e: 'Bitumen is the heaviest, most viscous fraction — used for roads.' },
    { q: 'Cracking breaks large alkane molecules into…', o: ['only methane', 'smaller alkanes, alkenes and hydrogen', 'alcohols', 'polymers'], a: 1, e: 'Cracking uses heat and a catalyst to make smaller, more useful molecules including alkenes.' },
    { q: 'What conditions are used for fermentation?', o: ['300 °C and acid catalyst', 'Yeast, 25–35 °C, no oxygen', 'UV light', 'Nickel catalyst'], a: 1, e: 'Yeast enzymes work best at 25–35 °C; no oxygen prevents the ethanol being oxidised.' },
    { q: 'What is the monomer of poly(ethene)?', o: ['Ethane', 'Ethene', 'Ethanol', 'Methane'], a: 1, e: 'Many ethene molecules join together by addition polymerisation.' },
    { q: 'Which functional group is in all carboxylic acids?', o: ['–OH', 'C=C', '–COOH', '–NH₂'], a: 2, e: 'Carboxylic acids contain the –COOH (carboxyl) group.' },
  ],
},
// ------------------------------------------------------------------
{
  id: 'analysis', num: '15', title: 'Experimental Techniques & Analysis', icon: '🔬', syl: 'Syllabus 12',
  intro: 'Apparatus, separation, chromatography, titration and identifying ions and gases — the practical paper skills.',
  sections: [
    { h: 'Apparatus and key words', html: `
      <p>Measure <b>time</b> with a stop-watch, <b>temperature</b> with a thermometer, <b>mass</b> with a balance, and <b>volume</b> with a burette, volumetric pipette, measuring cylinder or gas syringe.</p>
      <ul><li><b>Solvent</b> — dissolves a solute. <b>Solute</b> — is dissolved. <b>Solution</b> — solute(s) dissolved in a solvent.</li>
      <li><b>Saturated solution</b> — contains the maximum concentration of solute at a given temperature.</li>
      <li><b>Residue</b> — stays behind after filtration/evaporation. <b>Filtrate</b> — liquid that passes through a filter.</li></ul>` },
    { h: 'Separation and purification', html: `
      <table class="tbl"><tr><th>Method</th><th>Use it to separate…</th></tr>
      <tr><td>Filtration</td><td>an insoluble solid from a liquid</td></tr>
      <tr><td>Crystallisation</td><td>a dissolved solid from its solution (heat to crystallisation point, cool)</td></tr>
      <tr><td>Simple distillation</td><td>a solvent from a solution (e.g. pure water from salt water)</td></tr>
      <tr><td>Fractional distillation</td><td>miscible liquids with different boiling points (e.g. ethanol and water, crude oil)</td></tr>
      <tr><td>Using a suitable solvent</td><td>a soluble substance from an insoluble one (e.g. salt from sand)</td></tr>
      <tr><td>Chromatography</td><td>coloured (or colourless) substances in a mixture</td></tr></table>
      <p>A <b>pure</b> substance has a <b>sharp</b> melting and boiling point. Impurities <b>lower</b> the melting point and <b>raise</b> the boiling point, and make them melt over a range.</p>` },
    { h: 'Chromatography', html: `
      ${anim('chromatography', 'Paper chromatography')}
      <p>${EXT} <b>R<sub>f</sub> = distance moved by substance ÷ distance moved by solvent</b>. Colourless substances can be seen using a <b>locating agent</b>.</p>` },
    { h: 'Titration', html: `<p>Use a <b>volumetric pipette</b> to measure exactly 25.0 cm³ of alkali into a conical flask, add a few drops of <b>indicator</b>, add acid from a <b>burette</b> until the indicator just changes colour (the <b>end-point</b>). Repeat until concordant results (within 0.10 cm³). See the titration simulation in Topic 10.</p>` },
    { h: 'Identifying ions and gases', html: `
      ${anim('iontests', 'Virtual qualitative analysis lab')}
      <div class="tip">These tests appear in almost every Paper 5/6. Learn the colours: Cu²⁺ light blue, Fe²⁺ green, Fe³⁺ red-brown; Al³⁺ and Zn²⁺ both white but only Zn²⁺ dissolves in excess ammonia.</div>` },
  ],
  quiz: [
    { q: 'Which method separates sand from salt water?', o: ['Distillation', 'Filtration', 'Chromatography', 'Crystallisation'], a: 1, e: 'Sand is insoluble — it stays on the filter paper as the residue.' },
    { q: 'How would you obtain pure water from sea water?', o: ['Filtration', 'Simple distillation', 'Chromatography', 'Crystallisation'], a: 1, e: 'Water boils off, then condenses and is collected; the salt stays behind.' },
    { q: 'A spot moves 3.0 cm and the solvent moves 6.0 cm. What is the Rf?', o: ['0.5', '2.0', '3.0', '9.0'], a: 0, e: 'Rf = 3.0 ÷ 6.0 = 0.5.' },
    { q: 'Why is the baseline in chromatography drawn in pencil?', o: ['It is easier to see', 'Pencil does not dissolve in the solvent', 'Ink would react with the paper', 'It is cheaper'], a: 1, e: 'Graphite is insoluble, so the line will not run up the paper with the solvent.' },
    { q: 'Aqueous NaOH is added to a solution and a red-brown precipitate forms. Which ion is present?', o: ['Cu²⁺', 'Fe²⁺', 'Fe³⁺', 'Zn²⁺'], a: 2, e: 'Iron(III) gives a red-brown precipitate of iron(III) hydroxide.' },
    { q: 'Which gas relights a glowing splint?', o: ['Hydrogen', 'Oxygen', 'Carbon dioxide', 'Chlorine'], a: 1, e: 'Oxygen relights a glowing splint. Hydrogen gives a squeaky pop with a lighted splint.' },
    { q: 'A compound gives a lilac flame. Which ion does it contain?', o: ['Na⁺', 'Li⁺', 'K⁺', 'Cu²⁺'], a: 2, e: 'Potassium — lilac. Sodium yellow, lithium red, copper(II) blue-green.' },
    { q: 'Acidified silver nitrate gives a yellow precipitate. Which ion is present?', o: ['Chloride', 'Bromide', 'Iodide', 'Sulfate'], a: 2, e: 'Iodide → yellow AgI. Chloride → white, bromide → cream.' },
  ],
},
];
