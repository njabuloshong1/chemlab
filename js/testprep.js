'use strict';
// Test preparation: "Gases and the atmosphere" and "Bonding".
// Original exam-style questions written for this app, plus an answer guide to the
// June 2024 Cambridge papers (question numbers and worked answers only — no question text).

const TESTPREP = [
// ======================================================================
{
  id: 'gas-mcq', group: 'Test prep: Gases & the atmosphere', title: 'Gases & the Atmosphere — Multiple Choice', type: 'mcq', time: 25, style: 'Paper 1/2 style',
  desc: '20 questions on gas particles, diffusion, air, pollutants, climate change, acid rain and gas tests — each with a full explanation.',
  questions: [
    { q: 'A sealed gas syringe is placed in hot water. The plunger moves outwards. Which statement explains this?', o: ['The gas particles get bigger.', 'The gas particles move faster and hit the walls harder and more often.', 'The number of gas particles increases.', 'The gas particles move more slowly and spread out.'], a: 1, e: 'Heating gives the particles more kinetic energy. They move faster and collide with the walls harder and more often, so the gas expands (pushes the plunger out) to keep the pressure constant. Particles never change size and their number does not change.' },
    { q: 'The volume of a fixed mass of gas is halved at constant temperature. What happens to the pressure, and why?', o: ['It decreases — the particles slow down.', 'It increases — the particles collide with the walls more often.', 'It stays the same — the temperature has not changed.', 'It increases — the particles become heavier.'], a: 1, e: 'In a smaller volume the particles are closer together and hit the walls more frequently, so the pressure increases.' },
    { q: 'Which gas diffuses most slowly at room temperature?', o: ['ammonia, NH₃ (Mᵣ 17)', 'methane, CH₄ (Mᵣ 16)', 'chlorine, Cl₂ (Mᵣ 71)', 'oxygen, O₂ (Mᵣ 32)'], a: 2, e: 'At the same temperature, heavier molecules (higher Mᵣ) move more slowly, so they diffuse more slowly. Chlorine has the highest Mᵣ.' },
    { q: 'Cotton wool soaked in ammonia solution is put at one end of a tube and cotton wool soaked in hydrochloric acid at the other. A white ring forms. Where does it form and why?', o: ['In the middle — both gases diffuse at the same rate.', 'Nearer the HCl end — ammonia has a lower Mᵣ so diffuses faster.', 'Nearer the NH₃ end — ammonia has a lower Mᵣ so diffuses faster.', 'Nearer the HCl end — HCl has a lower Mᵣ.'], a: 1, e: 'NH₃ (17) is lighter than HCl (36.5), so ammonia molecules move faster and travel further before meeting HCl. The white solid is ammonium chloride: NH₃ + HCl → NH₄Cl.' },
    { q: 'What is the approximate composition of clean, dry air?', o: ['78% oxygen, 21% nitrogen, 1% other gases', '78% nitrogen, 21% oxygen, 1% other gases', '50% nitrogen, 50% oxygen', '78% nitrogen, 21% carbon dioxide, 1% other gases'], a: 1, e: 'Clean, dry air is about 78% nitrogen and 21% oxygen. The remaining ~1% is mainly argon (a noble gas) plus a small amount of carbon dioxide (~0.04%).' },
    { q: '100 cm³ of air is passed backwards and forwards over heated copper until the volume stops changing. The gas is cooled to room temperature. What is the final volume?', o: ['21 cm³', '79 cm³', '99 cm³', '100 cm³'], a: 1, e: 'The copper reacts with the oxygen (2Cu + O₂ → 2CuO). Air is about 21% oxygen, so about 21 cm³ is removed, leaving about 79 cm³ (mainly nitrogen).' },
    { q: 'Which gas is produced by the complete combustion of carbon-containing fuels and leads to climate change?', o: ['carbon monoxide', 'carbon dioxide', 'sulfur dioxide', 'nitrogen'], a: 1, e: 'Complete combustion gives carbon dioxide (and water). Higher levels of CO₂ increase global warming, which leads to climate change.' },
    { q: 'Which statement about carbon monoxide is correct?', o: ['It is produced by complete combustion and causes acid rain.', 'It is produced by incomplete combustion and is toxic.', 'It is produced by decomposing vegetation and is a greenhouse gas.', 'It is produced in car engines from nitrogen and oxygen.'], a: 1, e: 'Carbon monoxide forms when carbon-containing fuels burn in too little oxygen (incomplete combustion). It is a toxic gas.' },
    { q: 'What are the main sources of methane in the atmosphere?', o: ['Car engines and power stations', 'Decomposition of vegetation and waste gases from digestion in animals', 'Burning sulfur and roasting ores', 'Photosynthesis and respiration'], a: 1, e: 'Methane comes from decomposing vegetation and from digestion in animals (e.g. cattle). Higher levels of methane increase global warming.' },
    { q: 'Where do oxides of nitrogen in the air mainly come from?', o: ['Burning coal that contains nitrogen compounds', 'Car engines, where nitrogen and oxygen from the air react at high temperature', 'Fertilisers evaporating from fields', 'The decomposition of vegetation'], a: 1, e: 'Inside a car engine the temperature is very high, so nitrogen and oxygen from the air react to form oxides of nitrogen (e.g. NO, NO₂).' },
    { q: 'Which pair of effects is caused by oxides of nitrogen?', o: ['Acid rain and photochemical smog', 'Global warming and cancer', 'Toxic poisoning and deoxygenation of water', 'Ozone depletion and rusting'], a: 0, e: 'Oxides of nitrogen cause acid rain, photochemical smog and respiratory problems.' },
    { q: 'What are two adverse effects of particulates in the air?', o: ['acid rain and global warming', 'increased risk of respiratory problems and cancer', 'photochemical smog and acid rain', 'toxic gas and climate change'], a: 1, e: 'Particulates (tiny solid particles from incomplete combustion) increase the risk of respiratory problems and cancer.' },
    { q: 'How do greenhouse gases such as carbon dioxide and methane cause global warming?', o: ['They make holes in the ozone layer.', 'They absorb thermal energy emitted by the Earth and re-emit it, reducing thermal energy loss to space.', 'They reflect sunlight back into space.', 'They react with oxygen to release heat.'], a: 1, e: 'The Earth emits thermal (infrared) energy. Greenhouse gases absorb it and re-emit it in all directions, including back towards the Earth, so less thermal energy is lost to space.' },
    { q: 'Which of these would NOT help to reduce climate change?', o: ['planting trees', 'reducing livestock farming', 'using more coal-fired power stations', 'using wind and solar energy'], a: 2, e: 'Burning more coal releases more carbon dioxide. Planting trees (photosynthesis removes CO₂), less livestock farming (less methane) and renewable energy all reduce climate change.' },
    { q: 'Which method removes sulfur dioxide from the waste gases of a power station?', o: ['Passing the gases through a catalytic converter', 'Flue gas desulfurisation using calcium oxide', 'Bubbling the gases through limewater and releasing them', 'Passing the gases over anhydrous copper(II) sulfate'], a: 1, e: 'In flue gas desulfurisation, calcium oxide (a base) reacts with the acidic sulfur dioxide. Low-sulfur fuels also reduce SO₂ emissions.' },
    { q: 'In a catalytic converter: 2CO + 2NO → 2CO₂ + N₂. Which statement is correct?', o: ['NO is oxidised and CO is reduced.', 'NO is reduced and CO is oxidised.', 'Both gases are oxidised.', 'Neither gas is oxidised or reduced.'], a: 1, e: 'NO loses oxygen (reduced) to form N₂. CO gains oxygen (oxidised) to form CO₂. It is a redox reaction that turns two toxic gases into harmless ones.' },
    { q: 'Which is the word equation for photosynthesis?', o: ['glucose + oxygen → carbon dioxide + water', 'carbon dioxide + water → glucose + oxygen', 'carbon dioxide + oxygen → glucose + water', 'water + oxygen → glucose + carbon dioxide'], a: 1, e: 'Photosynthesis: carbon dioxide + water → glucose + oxygen, in the presence of chlorophyll and using energy from light. (Extended: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.)' },
    { q: 'Which gas relights a glowing splint?', o: ['carbon dioxide', 'hydrogen', 'oxygen', 'nitrogen'], a: 2, e: 'Oxygen relights a glowing splint. Hydrogen “pops” with a lighted splint; carbon dioxide turns limewater milky.' },
    { q: 'Why is argon used to fill light bulbs?', o: ['It is very reactive.', 'It is unreactive because it has a full outer shell of electrons.', 'It is a good conductor of electricity.', 'It is diatomic.'], a: 1, e: 'Argon is a noble gas: monatomic and unreactive because its outer shell is full (2,8,8). It stops the hot filament reacting.' },
    { q: 'Extended: 6.0 g of carbon burns completely in oxygen. What volume of carbon dioxide is formed at r.t.p.? (C = 12; 1 mol of gas = 24 dm³)', o: ['6.0 dm³', '12 dm³', '24 dm³', '44 dm³'], a: 1, e: 'C + O₂ → CO₂. Moles of C = 6.0 ÷ 12 = 0.50 mol → 0.50 mol CO₂ → 0.50 × 24 = 12 dm³.' },
  ],
},
// ======================================================================
{
  id: 'gas-theory', group: 'Test prep: Gases & the atmosphere', title: 'Gases & the Atmosphere — Structured Questions', type: 'structured', time: 50, style: 'Paper 3/4 style',
  desc: 'Exam-style structured questions with model answers and mark schemes. Write your answer, then reveal and self-mark.',
  questions: [
    {
      n: 1, stem: 'A student measures the percentage of oxygen in air. 100 cm³ of air is pushed backwards and forwards between two gas syringes over a tube of heated copper. The copper turns black. When the volume stops changing, the apparatus is cooled and the volume of gas is 79 cm³.',
      parts: [
        { p: '(a)', q: 'Name the black solid formed and write a balanced equation for its formation.', marks: 2, answer: '<b>Copper(II) oxide</b>. <b>2Cu + O₂ → 2CuO</b>', points: ['copper(II) oxide', '2Cu + O₂ → 2CuO'] },
        { p: '(b)', q: 'Calculate the percentage of oxygen in this sample of air.', marks: 2, answer: 'Oxygen used = 100 − 79 = 21 cm³. Percentage = 21 ÷ 100 × 100 = <b>21%</b>.', points: ['21 cm³ used', '21%'] },
        { p: '(c)', q: 'Explain why the gas is cooled to room temperature before the final volume is measured.', marks: 1, answer: 'Hot gas has expanded (particles move faster), so measuring it hot would give a <b>larger, inaccurate</b> volume. Volumes must be compared at the same temperature.', points: ['gas expands when hot / compare at same temperature'] },
        { p: '(d)', q: 'Name the main gas remaining in the syringe.', marks: 1, answer: '<b>Nitrogen</b>.', points: ['nitrogen'] },
        { p: '(e)', q: 'The remaining gas also contains about 1% argon. Explain why argon does not react with the hot copper.', marks: 2, answer: 'Argon is a <b>noble gas</b> with a <b>full outer shell</b> of electrons (2,8,8), so it does not need to lose, gain or share electrons — it is <b>unreactive</b>.', points: ['noble gas / unreactive', 'full outer shell'] },
      ],
    },
    {
      n: 2, stem: 'Air pollutants are produced by human activities.',
      parts: [
        { p: '(a)', q: 'For each pollutant, give one source and one adverse effect: (i) carbon monoxide (ii) sulfur dioxide (iii) oxides of nitrogen (iv) particulates.', marks: 8, answer: '(i) CO — <b>incomplete combustion</b> of carbon-containing fuels; <b>toxic</b>.<br>(ii) SO₂ — <b>combustion of fossil fuels containing sulfur</b>; <b>acid rain</b>.<br>(iii) NOₓ — <b>car engines</b>; <b>acid rain / photochemical smog / respiratory problems</b>.<br>(iv) particulates — <b>incomplete combustion</b>; <b>respiratory problems / cancer</b>.', points: ['CO source', 'CO effect (toxic)', 'SO₂ source', 'SO₂ effect (acid rain)', 'NOₓ source (car engines)', 'NOₓ effect', 'particulates source', 'particulates effect'] },
        { p: '(b)', q: 'Methane burns in a limited supply of air to form carbon monoxide and water. Write a balanced equation.', marks: 2, answer: '<b>2CH₄ + 3O₂ → 2CO + 4H₂O</b>', points: ['correct formulae', 'balanced'] },
        { p: '(c)', q: 'Explain how oxides of nitrogen are formed in a car engine.', marks: 2, answer: 'The <b>high temperature</b> inside the engine makes <b>nitrogen and oxygen from the air</b> react together.', points: ['high temperature', 'nitrogen and oxygen (from air) react'] },
      ],
    },
    {
      n: 3, stem: 'Carbon dioxide and methane are greenhouse gases.',
      parts: [
        { p: '(a)', q: 'Describe how greenhouse gases cause global warming.', marks: 3, answer: 'The Earth <b>emits thermal (infrared) energy</b>. Greenhouse gases <b>absorb</b> this energy and <b>re-emit</b> it in all directions, including back to Earth, so <b>less thermal energy is lost to space</b>.', points: ['thermal energy from Earth', 'absorbed and re-emitted by the gases', 'less energy lost to space'] },
        { p: '(b)', q: 'State two strategies that reduce the effects of climate change.', marks: 2, answer: 'Any two: <b>planting trees</b>; <b>reducing livestock farming</b>; <b>using less fossil fuel</b>; using <b>hydrogen</b> or <b>renewable energy</b> (wind, solar).', points: ['strategy 1', 'strategy 2'] },
        { p: '(c)', q: 'Photosynthesis removes carbon dioxide from the air. Write the balanced symbol equation for photosynthesis and state two conditions needed.', marks: 3, answer: '<b>6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂</b>. Needs <b>chlorophyll</b> and <b>light</b> (energy from light).', points: ['correct formulae', 'balanced', 'chlorophyll and light'] },
      ],
    },
    {
      n: 4, stem: 'Acid rain damages buildings, lakes and forests.',
      parts: [
        { p: '(a)', q: 'Catalytic converters remove oxides of nitrogen. Complete: 2CO + 2NO → ..... + .....', marks: 2, answer: '2CO + 2NO → <b>2CO₂ + N₂</b>', points: ['2CO₂', 'N₂'] },
        { p: '(b)', q: 'Explain why this is a redox reaction.', marks: 2, answer: 'NO <b>loses oxygen</b> → <b>reduced</b>. CO <b>gains oxygen</b> → <b>oxidised</b>. Oxidation and reduction happen at the same time.', points: ['NO reduced (loses O)', 'CO oxidised (gains O)'] },
        { p: '(c)', q: 'Power stations remove sulfur dioxide from waste gases using calcium oxide. Explain why calcium oxide reacts with sulfur dioxide. Name this process.', marks: 3, answer: 'Calcium oxide is a <b>basic</b> oxide; sulfur dioxide is an <b>acidic</b> oxide, so they react (neutralisation). The process is <b>flue gas desulfurisation</b>.', points: ['CaO basic', 'SO₂ acidic / neutralisation', 'flue gas desulfurisation'] },
        { p: '(d)', q: 'State one other way to reduce sulfur dioxide emissions.', marks: 1, answer: 'Use <b>low-sulfur fuels</b>.', points: ['low-sulfur fuels'] },
      ],
    },
    {
      n: 5, stem: 'This question is about gases and their particles.',
      parts: [
        { p: '(a)', q: 'A sealed container of gas is heated. Explain, in terms of particles, why the pressure increases.', marks: 3, answer: 'Particles gain <b>kinetic energy</b> and <b>move faster</b>; they hit the walls <b>more often</b> and <b>harder</b>, so the pressure increases.', points: ['more kinetic energy / move faster', 'more frequent collisions with walls', 'harder collisions'] },
        { p: '(b)', q: 'Describe tests for: (i) oxygen (ii) carbon dioxide (iii) hydrogen. Give the result of each.', marks: 3, answer: '(i) <b>glowing splint relights</b>. (ii) bubble into <b>limewater → turns milky</b>. (iii) <b>lighted splint → squeaky pop</b>.', points: ['oxygen test', 'carbon dioxide test', 'hydrogen test'] },
        { p: '(c)', q: 'Describe a test for sulfur dioxide and give the result.', marks: 2, answer: 'Add (or pass the gas through) <b>acidified aqueous potassium manganate(VII)</b>: colour changes from <b>purple to colourless</b>.', points: ['acidified potassium manganate(VII)', 'purple to colourless'] },
        { p: '(d)', q: 'Extended: Calculate the volume of carbon dioxide at r.t.p. made when 10.0 g of calcium carbonate is heated. CaCO₃ → CaO + CO₂ (Mᵣ CaCO₃ = 100)', marks: 2, answer: 'Moles CaCO₃ = 10.0 ÷ 100 = <b>0.100 mol</b> → 0.100 mol CO₂ → 0.100 × 24 = <b>2.4 dm³</b>.', points: ['0.100 mol', '2.4 dm³'] },
      ],
    },
  ],
},
// ======================================================================
{
  id: 'bond-mcq', group: 'Test prep: Bonding', title: 'Bonding — Multiple Choice', type: 'mcq', time: 25, style: 'Paper 1/2 style',
  desc: '20 questions on ions, ionic, covalent and metallic bonding, giant structures and properties — each with a full explanation.',
  questions: [
    { q: 'What is an ionic bond?', o: ['A shared pair of electrons between two atoms', 'A strong electrostatic attraction between oppositely charged ions', 'A weak force between molecules', 'The attraction between positive ions and delocalised electrons'], a: 1, e: 'An ionic bond is a strong electrostatic attraction between oppositely charged ions. (A shared pair = covalent; ions + delocalised electrons = metallic.)' },
    { q: 'What happens when a sodium atom forms a sodium ion?', o: ['It gains one electron and becomes Na⁻.', 'It loses one electron and becomes Na⁺.', 'It loses one proton and becomes Na⁺.', 'It gains one proton and becomes Na⁺.'], a: 1, e: 'Na (2,8,1) loses its one outer electron to form Na⁺ (2,8). Protons never change in chemical reactions.' },
    { q: 'Which ion has the electronic configuration 2,8?', o: ['Cl⁻', 'K⁺', 'Mg²⁺', 'S²⁻'], a: 2, e: 'Mg (2,8,2) loses 2 electrons → Mg²⁺ (2,8). Cl⁻, K⁺ and S²⁻ all have 2,8,8.' },
    { q: 'What is the formula of aluminium sulfide?', o: ['AlS', 'Al₂S', 'AlS₃', 'Al₂S₃'], a: 3, e: 'Al³⁺ and S²⁻: 2 × (+3) = +6 and 3 × (−2) = −6 → Al₂S₃.' },
    { q: 'Which substance is ionic?', o: ['hydrogen chloride, HCl', 'methane, CH₄', 'potassium chloride, KCl', 'carbon dioxide, CO₂'], a: 2, e: 'Ionic bonding is between a metal and a non-metal: potassium + chlorine. The others contain only non-metals, so they are covalent.' },
    { q: 'Why does molten sodium chloride conduct electricity?', o: ['Its electrons are free to move.', 'Its ions are free to move.', 'It contains molecules.', 'Its atoms are free to move.'], a: 1, e: 'When molten (or dissolved), the Na⁺ and Cl⁻ ions are free to move and carry the charge. In the solid they are fixed in the lattice.' },
    { q: 'What is a covalent bond?', o: ['A pair of electrons shared between two atoms', 'An electron transferred from one atom to another', 'An attraction between ions', 'A sea of delocalised electrons'], a: 0, e: 'A covalent bond is a shared pair of electrons between two (non-metal) atoms, giving each a noble-gas configuration.' },
    { q: 'How many lone pairs of electrons are on the oxygen atom in a water molecule?', o: ['0', '1', '2', '4'], a: 2, e: 'O has 6 outer electrons. Two are used in the O–H bonds, leaving 4 electrons = 2 lone pairs.' },
    { q: 'How many electrons are shared in one molecule of carbon dioxide?', o: ['2', '4', '6', '8'], a: 3, e: 'CO₂ has two C=O double bonds. Each double bond = 2 shared pairs = 4 electrons → 8 electrons in total.' },
    { q: 'Which molecule contains a triple covalent bond?', o: ['O₂', 'N₂', 'Cl₂', 'H₂'], a: 1, e: 'Each N atom needs 3 electrons, so N₂ has a triple bond (3 shared pairs, 6 electrons). O₂ has a double bond; Cl₂ and H₂ have single bonds.' },
    { q: 'What is the total number of electrons in one molecule of methane, CH₄?', o: ['4', '8', '10', '16'], a: 2, e: 'C has 6 electrons and each H has 1: 6 + 4 × 1 = 10. (Careful: “total electrons” is different from “shared electrons”, which is 8.)' },
    { q: 'Why does methane have a low boiling point?', o: ['The C–H covalent bonds are weak.', 'The forces between methane molecules are weak.', 'Methane contains ions.', 'Methane has a giant structure.'], a: 1, e: 'Boiling only separates molecules from each other. The intermolecular forces are weak, so little energy is needed. The C–H covalent bonds do not break.' },
    { q: 'Why is diamond very hard?', o: ['It has delocalised electrons.', 'Each carbon atom forms four strong covalent bonds in a giant structure.', 'It has weak forces between layers.', 'It is made of ions.'], a: 1, e: 'In diamond every carbon atom is covalently bonded to four others in a rigid giant lattice, so it is very hard (used in cutting tools).' },
    { q: 'Why does graphite conduct electricity?', o: ['It contains ions that move.', 'Each carbon atom has one delocalised electron that can move.', 'Its layers slide.', 'It has a high melting point.'], a: 1, e: 'Each C in graphite forms only 3 covalent bonds; the fourth outer electron is delocalised and can move along the layers.' },
    { q: 'Which property do diamond and silicon(IV) oxide share?', o: ['Both conduct electricity', 'Both have low melting points', 'Both are hard with very high melting points', 'Both are made of small molecules'], a: 2, e: 'Both are giant covalent structures with many strong covalent bonds, so both are hard with very high melting points. Neither conducts.' },
    { q: 'What is metallic bonding?', o: ['Attraction between positive and negative ions', 'Attraction between positive metal ions and a sea of delocalised electrons', 'Shared pairs of electrons between metal atoms', 'Weak forces between metal atoms'], a: 1, e: 'Metallic bonding = electrostatic attraction between the positive ions in a giant metallic lattice and the “sea” of delocalised electrons.' },
    { q: 'Why can metals be hammered into shape (malleable)?', o: ['The electrons are fixed.', 'The layers of positive ions can slide over each other.', 'The metallic bonds break easily.', 'Metals have low melting points.'], a: 1, e: 'The layers of ions slide over each other while the delocalised electrons keep holding them together, so the metal changes shape without breaking.' },
    { q: 'Why is an alloy harder than the pure metal?', o: ['Alloys contain ionic bonds.', 'The different-sized atoms stop the layers sliding easily.', 'Alloys have no delocalised electrons.', 'Alloys are compounds.'], a: 1, e: 'Atoms of a different size disrupt the regular layers, so the layers cannot slide over each other as easily. Alloys are mixtures, not compounds.' },
    { q: 'Substance Q has a melting point of 1710 °C, does not conduct electricity when solid or molten, and is insoluble in water. What is the structure of Q?', o: ['simple molecular', 'giant ionic', 'giant covalent', 'metallic'], a: 2, e: 'Very high melting point but no conduction even when molten → no ions and no delocalised electrons → giant covalent (e.g. silicon(IV) oxide).' },
    { q: 'Which pair of particles has the same electronic configuration?', o: ['Na⁺ and Cl⁻', 'Na⁺ and F⁻', 'K⁺ and Ne', 'Mg²⁺ and Ar'], a: 1, e: 'Na⁺ = 2,8 and F⁻ = 2,8 (both like neon). Cl⁻ and K⁺ are 2,8,8 (like argon).' },
  ],
},
// ======================================================================
{
  id: 'bond-theory', group: 'Test prep: Bonding', title: 'Bonding — Structured Questions', type: 'structured', time: 50, style: 'Paper 3/4 style',
  desc: 'Exam-style structured questions on ionic, covalent, giant covalent and metallic bonding, with model answers and mark schemes.',
  questions: [
    {
      n: 1, stem: 'Magnesium reacts with chlorine to form magnesium chloride.',
      parts: [
        { p: '(a)', q: 'Give the electronic configurations of a magnesium atom and a chlorine atom.', marks: 2, answer: 'Mg: <b>2,8,2</b>. Cl: <b>2,8,7</b>.', points: ['Mg 2,8,2', 'Cl 2,8,7'] },
        { p: '(b)', q: 'Describe, in terms of electrons, how magnesium chloride is formed. You may describe a dot-and-cross diagram.', marks: 4, answer: 'Each magnesium atom <b>loses 2 electrons</b> to form <b>Mg²⁺</b> (2,8). Each chlorine atom <b>gains 1 electron</b> to form <b>Cl⁻</b> (2,8,8). One Mg gives one electron to <b>each of two Cl atoms</b> (electrons are transferred). Dot-and-cross: [Mg]²⁺ with an empty/complete shell, and two [Cl]⁻ ions each with 8 outer electrons (7 crosses + 1 dot), all in square brackets with charges.', points: ['Mg loses 2 electrons → Mg²⁺', 'Cl gains 1 electron → Cl⁻', 'two Cl for each Mg / electrons transferred', 'full outer shells (noble gas configurations)'] },
        { p: '(c)', q: 'Explain why the formula of magnesium chloride is MgCl₂.', marks: 1, answer: 'The charges must cancel: one Mg²⁺ (+2) needs <b>two Cl⁻</b> (2 × −1).', points: ['charges cancel: +2 and 2 × −1'] },
        { p: '(d)', q: 'Magnesium chloride has a high melting point. Explain why, in terms of structure and bonding.', marks: 3, answer: 'It has a <b>giant ionic lattice</b>. There are <b>strong electrostatic attractions</b> between the <b>oppositely charged ions</b>, which need <b>a lot of energy</b> to overcome.', points: ['giant ionic lattice', 'strong electrostatic attraction between oppositely charged ions', 'lots of energy needed'] },
        { p: '(e)', q: 'State and explain when magnesium chloride conducts electricity.', marks: 2, answer: 'When <b>molten or dissolved in water</b>, because the <b>ions are free to move</b> (they are fixed in the solid).', points: ['molten or aqueous', 'ions free to move'] },
      ],
    },
    {
      n: 2, stem: 'Covalent molecules include ammonia, NH₃, water, H₂O, and nitrogen, N₂.',
      parts: [
        { p: '(a)', q: 'State what is meant by a covalent bond.', marks: 1, answer: 'A <b>pair of electrons shared</b> between two atoms.', points: ['shared pair of electrons'] },
        { p: '(b)', q: 'Describe the dot-and-cross diagram of ammonia, showing outer electrons only.', marks: 3, answer: 'N in the centre with <b>three overlapping H circles</b>. Each overlap has <b>one dot and one cross</b> (3 shared pairs). N also has <b>one lone pair</b> (2 non-bonding electrons). N has 8 outer electrons; each H has 2.', points: ['3 shared pairs (one dot + one cross each)', 'one lone pair on N', 'N has 8 and H has 2 electrons'] },
        { p: '(c)', q: 'Extended: How many electrons are shared in one molecule of N₂? Explain.', marks: 2, answer: '<b>6</b> electrons. Each N atom (2,5) needs 3 more electrons, so the atoms share <b>3 pairs</b> — a <b>triple bond</b>.', points: ['6 electrons', 'triple bond / 3 shared pairs'] },
        { p: '(d)', q: 'Water has a boiling point of 100 °C; sodium chloride boils at 1413 °C. Explain the difference.', marks: 4, answer: 'Water is a <b>simple molecular</b> substance: only <b>weak intermolecular forces</b> are overcome when it boils, needing little energy. Sodium chloride is a <b>giant ionic lattice</b> with many <b>strong electrostatic attractions</b> between ions, needing much more energy.', points: ['water simple molecules', 'weak forces between molecules', 'NaCl giant ionic lattice', 'strong attraction between ions / more energy'] },
        { p: '(e)', q: 'Explain why water does not conduct electricity well.', marks: 1, answer: 'Water molecules have <b>no overall charge</b> — there are <b>no free ions or electrons</b> to carry a current.', points: ['no ions or delocalised electrons'] },
      ],
    },
    {
      n: 3, stem: 'Diamond and graphite are two forms of carbon. Both have giant covalent structures.',
      parts: [
        { p: '(a)', q: 'Describe the structure of diamond.', marks: 2, answer: 'Each carbon atom is covalently bonded to <b>four</b> other carbon atoms in a <b>giant (tetrahedral) lattice</b>.', points: ['each C bonded to 4 others', 'giant structure'] },
        { p: '(b)', q: 'Explain why diamond is used in cutting tools.', marks: 2, answer: 'It is <b>very hard</b> because <b>many strong covalent bonds</b> must be broken to scratch it.', points: ['very hard', 'many strong covalent bonds'] },
        { p: '(c)', q: 'Explain why graphite is used as a lubricant and as an electrode.', marks: 4, answer: 'Lubricant: graphite has <b>layers</b> with <b>weak forces between them</b>, so the layers <b>slide</b>. Electrode: each C forms only 3 bonds so has <b>one delocalised electron</b>; these electrons <b>move</b> and carry the current (graphite also has a high melting point).', points: ['layers', 'weak forces between layers — slide', 'delocalised electrons', 'electrons move to conduct'] },
        { p: '(d)', q: 'Extended: Silicon(IV) oxide has a similar structure to diamond. Describe its structure and give one property it shares with diamond.', marks: 3, answer: 'Each <b>Si bonds to 4 O</b> and each <b>O bonds to 2 Si</b> in a giant covalent lattice. Shared property: <b>very high melting point</b> / <b>hard</b> / <b>does not conduct</b>.', points: ['Si bonded to 4 O', 'O bonded to 2 Si / giant', 'shared property'] },
      ],
    },
    {
      n: 4, stem: 'Metals and alloys.',
      parts: [
        { p: '(a)', q: 'Extended: Describe metallic bonding.', marks: 2, answer: 'Electrostatic <b>attraction</b> between a giant lattice of <b>positive metal ions</b> and a <b>sea of delocalised electrons</b>.', points: ['positive ions in a lattice', 'attraction to delocalised electrons'] },
        { p: '(b)', q: 'Explain why copper is a good conductor of electricity and is ductile.', marks: 3, answer: 'Conductor: <b>delocalised electrons move</b> through the structure. Ductile: <b>layers of ions slide</b> over each other without the bonding breaking, so it can be drawn into wires.', points: ['delocalised electrons move', 'layers slide', 'bonding still holds / does not break'] },
        { p: '(c)', q: 'Brass is an alloy. Name the two metals in brass and explain why brass is harder than copper.', marks: 3, answer: 'Brass = <b>copper and zinc</b>. The <b>different-sized</b> zinc atoms <b>disrupt the layers</b> so they <b>cannot slide</b> easily.', points: ['copper and zinc', 'different-sized atoms', 'layers cannot slide'] },
      ],
    },
    {
      n: 5, stem: 'The table gives properties of four substances, P, Q, R and S.<table class="tbl"><tr><th></th><th>melting point / °C</th><th>conducts when solid?</th><th>conducts when molten?</th></tr><tr><td>P</td><td>−95</td><td>no</td><td>no</td></tr><tr><td>Q</td><td>1083</td><td>yes</td><td>yes</td></tr><tr><td>R</td><td>772</td><td>no</td><td>yes</td></tr><tr><td>S</td><td>3550</td><td>no</td><td>no</td></tr></table>',
      parts: [
        { p: '(a)', q: 'Identify the structure of each substance: simple molecular, giant ionic, giant covalent or metallic.', marks: 4, answer: 'P <b>simple molecular</b> (low m.p., no conduction). Q <b>metallic</b> (conducts as a solid). R <b>giant ionic</b> (conducts only when molten). S <b>giant covalent</b> (very high m.p., never conducts).', points: ['P simple molecular', 'Q metallic', 'R giant ionic', 'S giant covalent'] },
        { p: '(b)', q: 'Explain why R conducts when molten but not when solid.', marks: 2, answer: 'In the solid the ions are <b>fixed in the lattice</b>; when molten the <b>ions are free to move</b> and carry charge.', points: ['ions fixed in solid', 'ions move when molten'] },
      ],
    },
  ],
},
// ======================================================================
{
  id: 'june2024-guide', group: 'Real past papers', title: 'June 2024 Papers — Answer Guide (Gases, Atmosphere & Bonding)', type: 'guide', time: 0, style: 'Use with the real papers',
  desc: 'Every question on these two topics in the June 2024 papers (0620/11, 21, 31, 41) and the 2023 specimen Paper 1 — with the answer and a worked explanation. Open the real paper alongside.',
  sections: [
    { h: 'Paper 1 (Core multiple choice) — 0620/11, June 2024', items: [
      ['Q1', 'Gases', 'D', 'Above the boiling point sodium is still a gas while it cools from 950 °C to 900 °C: the atoms slow down, and no bonds form (it has not condensed yet).'],
      ['Q2', 'Gases', 'A', 'Collisions are most frequent at high pressure (particles closer) and high temperature (particles faster).'],
      ['Q3', 'Atoms', 'B', 'Electrons are outside the nucleus, have a relative mass of less than 1 (1/1836) and a charge of 1− → the region in all three circles.'],
      ['Q4', 'Bonding', 'C', 'Ionic compounds have high melting points and conduct only when molten: W and Z. Y conducts as a solid → metal; X has a low m.p. → simple molecular.'],
      ['Q5', 'Bonding', 'C', 'Gaining 3 electrons gives a negative ion (anion) with a 3− charge. Losing electrons gives a cation with a positive charge.'],
      ['Q6', 'Bonding', 'C', 'Four shared pairs = four single bonds = methane, CH₄ (NH₃ has 3, HCl 1, H₂O 2).'],
      ['Q7', 'Bonding', 'D', 'Diamond is giant covalent (NaCl ionic, Na metallic, ethane simple molecular).'],
      ['Q19', 'Bonding / oxides', 'B', 'Nitrogen dioxide is an acidic (non-metal) oxide. Sodium oxide is ionic with a high m.p.; NO₂ is a gas.'],
      ['Q24', 'Noble gases', 'D', 'Noble gases are unreactive and monatomic, with a complete outer shell.'],
      ['Q25', 'Metallic bonding', 'C', 'Shiny and conducts as a solid → metallic bonding: a metal element or an alloy.'],
      ['Q26', 'Alloys', 'A', 'Alloys are metals mixed with other elements: Mg + Al, Fe + C (steel), Cu + Zn (brass). N₂ + O₂ are non-metals.'],
      ['Q28', 'Atmosphere', 'D', 'Thermal decomposition of CaCO₃ gives CO₂ (CaCO₃ → CaO + CO₂). Photosynthesis uses CO₂.'],
      ['Q29', 'Air', 'A', 'Clean air: 78% nitrogen, 21% oxygen; argon ≈ 0.9%; CO₂ (turns limewater milky) is the smallest part.'],
      ['Q30', 'Fertilisers', 'C', 'Potassium nitrate supplies K and N — two of the three NPK elements.'],
      ['Q31', 'Atmosphere', 'A', 'Burning sulfur gives sulfur dioxide, which causes acid rain.'],
      ['Q32', 'Atmosphere', 'D', 'Particulates increase the risk of respiratory problems and cancer.'],
    ] },
    { h: 'Paper 2 (Extended multiple choice) — 0620/21, June 2024', items: [
      ['Q1', 'Gases', 'B', 'Heated at constant pressure: particles move faster and the gas expands, so they become further apart.'],
      ['Q2', 'States', 'D', 'While ice melts the temperature stays the same: the energy is used to overcome the attractive forces between particles.'],
      ['Q3', 'Gases / diffusion', 'D', 'SO₂ (Mᵣ 64) is heavier than HCl (36.5) so it diffuses more slowly (takes longer than 38 s → 51 s). SO₂ is acidic, so the indicator turns red.'],
      ['Q7', 'Bonding', 'D', 'Potassium chloride is a giant ionic lattice (3) and soluble in water (4). It does NOT conduct when solid, and its high m.p. is due to ionic bonds, not intermolecular forces.'],
      ['Q8', 'Bonding', 'C', 'N₂ has a triple bond = 6 shared electrons. Ethene: C=C (4 electrons) + four C–H (8 electrons) = 12.'],
      ['Q9', 'Bonding', 'C', 'Total electrons in NH₃ = 7 (N) + 3 × 1 (H) = 10.'],
      ['Q33', 'Atmosphere / water', 'A', 'Nitrates and phosphates from fertilisers cause deoxygenation of water.'],
      ['Q34', 'Water', 'D', 'Pure water boils at exactly 100 °C (the other tests show water is present, not that it is pure).'],
      ['Q35', 'Atmosphere', 'D', 'In a catalytic converter oxides of nitrogen are reduced by carbon monoxide: 2CO + 2NO → 2CO₂ + N₂.'],
    ] },
    { h: 'Paper 3 (Core theory) — 0620/31, June 2024', items: [
      ['Q1(a)(i)', 'Bonding', 'G', 'An alloy is a mixture of metals with different-sized atoms (Cu with Zn).'],
      ['Q1(a)(ii)', 'Bonding', 'A', 'Ionic (Na⁺Br⁻ lattice) conducts only when molten or in aqueous solution.'],
      ['Q1(a)(iii)', 'Bonding', 'D', 'The 3D network of carbon atoms is diamond — giant covalent.'],
      ['Q1(a)(iv)', 'Fuel cells', 'C', 'Water (H₂O) is the only product of a hydrogen–oxygen fuel cell.'],
      ['Q1(a)(v)', 'Bonding', 'A', 'The ionic compound has a high melting point (D is an element, not a compound).'],
      ['Q1(a)(vi)', 'Atmosphere', 'B', 'Methane (CH₄) is a greenhouse gas.'],
      ['Q1(b)', 'Bonding', 'dot-and-cross', 'Water: each O–H overlap holds one dot and one cross (2 shared pairs); O also has 2 lone pairs (4 more electrons) → 8 around O, 2 around each H.'],
      ['Q5(b)(i)', 'Atmosphere', '2C + O₂ → 2CO', 'Incomplete combustion of carbon.'],
      ['Q5(b)(ii)', 'Atmosphere', 'toxic', 'Carbon monoxide is a toxic gas.'],
      ['Q6(e)(i)', 'Atmosphere', 'acid rain', 'Sulfur dioxide causes acid rain.'],
      ['Q6(e)(ii)', 'Atmosphere', 'flue gas desulfurisation', 'React the SO₂ with calcium oxide (flue gas desulfurisation).'],
    ] },
    { h: 'Paper 4 (Extended theory) — 0620/41, June 2024', items: [
      ['Q3(a)', 'Bonding', '2Na + F₂ → 2NaF', 'Fluorine is diatomic, so 2 sodium atoms are needed.'],
      ['Q3(b)(i)', 'Bonding', 'delocalised electrons', 'Sodium is a metal: its delocalised electrons can move through the structure.'],
      ['Q3(b)(ii)', 'Bonding', 'dot-and-cross', 'F₂: one shared pair (one dot + one cross) in the overlap, and three lone pairs on each F atom (8 outer electrons each).'],
      ['Q3(b)(iii)', 'Gases', 'liquid', '−200 °C is above the melting point (−220 °C) but below the boiling point (−188 °C).'],
      ['Q3(b)(iv)', 'Bonding', '3 marks', 'NaF: giant ionic lattice with strong electrostatic attraction between oppositely charged ions. F₂: simple molecules with weak intermolecular forces. Much more energy is needed to overcome the ionic bonds.'],
      ['Q5(b)', 'Gas tests', 'acidified KMnO₄', 'Sulfur dioxide turns acidified aqueous potassium manganate(VII) from purple to colourless.'],
    ] },
    { h: 'Specimen Paper 1 (2023)', items: [
      ['Q1', 'States', 'B', 'A liquid has a fixed volume; gas particles are far apart (fewer per cm³), liquids are hard to compress and their particles move.'],
      ['Q2', 'Gases / diffusion', 'C', 'Ammonia gas diffuses along the tube and turns damp red litmus blue.'],
      ['Q4', 'Bonding', 'B', 'Ionic bonding = a strong force of attraction between oppositely charged ions.'],
      ['Q5', 'Bonding', 'D', 'Four shared electrons = 2 shared pairs = water, H₂O (careful: four shared PAIRS would be methane).'],
      ['Q30', 'Water', 'A', 'Dissolved oxygen is beneficial to aquatic life.'],
      ['Q31', 'Air', 'A', 'Earth: ~0.04% CO₂, 78% N₂, 21% O₂. The planet has 4% CO₂ and 24% O₂ (higher), but 72% N₂ (lower).'],
      ['Q32', 'Atmosphere', 'D', 'Decomposition of vegetation increases atmospheric methane. (CO comes from incomplete combustion; burning natural gas increases CO₂.)'],
      ['Q33', 'Atmosphere', 'B', 'Both SO₂ and HCl are acidic gases, so damp calcium oxide (a base) removes them.'],
    ] },
  ],
},
];

// Spread the correct answers evenly over A–D (so printed papers can't be guessed).
// Options that are all numbers stay in ascending order, as in real papers.
(function balanceAnswers() {
  for (const p of TESTPREP.filter((x) => x.type === 'mcq')) {
    p.questions.forEach((q, i) => {
      const numeric = q.o.every((o) => /^[\d.\s]+(cm³|dm³|%)?$/.test(o));
      if (numeric) return;
      const target = [1, 3, 0, 2][i % 4];
      if (q.a === target) return;
      [q.o[q.a], q.o[target]] = [q.o[target], q.o[q.a]];
      q.a = target;
    });
  }
})();

PAPERS.push(...TESTPREP);
