'use strict';
// Original exam-style practice papers (written for this app in the style of Cambridge IGCSE 0620).
// Structured parts list the marking points; students tick the points they got to self-mark.

const PAPERS = [
{
  id: 'mcq1', title: 'Practice Paper A — Multiple Choice', type: 'mcq', time: 25, style: 'Paper 1/2 style',
  desc: '20 four-option questions across the whole syllabus. Each answer comes with a full explanation.',
  questions: [
    { q: 'Which statement about the particles in a gas is correct?', o: ['They are close together and vibrate', 'They are far apart and move randomly', 'They are in a regular arrangement', 'They do not move'], a: 1, e: 'Gas particles are far apart, randomly arranged and move quickly in all directions.' },
    { q: 'An atom of element X has the electronic configuration 2,8,7. In which group of the Periodic Table is X?', o: ['II', 'III', 'VII', 'VIII'], a: 2, e: '7 outer electrons → Group VII (it is chlorine, 17 electrons).' },
    { q: 'Which pair of particles has the same number of electrons?', o: ['Na⁺ and Ne', 'Na and Ne', 'Cl⁻ and Ne', 'Mg²⁺ and Ar'], a: 0, e: 'Na⁺ has 11 − 1 = 10 electrons; Ne has 10 electrons. Cl⁻ has 18, Mg²⁺ has 10 but Ar has 18.' },
    { q: 'Element Q forms an ion Q³⁺. Element R forms an ion R²⁻. What is the formula of the compound of Q and R?', o: ['QR', 'Q₂R₃', 'Q₃R₂', 'QR₃'], a: 1, e: 'Total positive charge must equal total negative: 2 × (+3) = +6 and 3 × (−2) = −6 → Q₂R₃ (like Al₂O₃).' },
    { q: 'Which substance has a giant covalent structure?', o: ['Diamond', 'Magnesium', 'Sodium chloride', 'Water'], a: 0, e: 'Diamond is a giant covalent lattice of carbon atoms. Mg is metallic, NaCl ionic, water simple molecular.' },
    { q: 'What is the relative formula mass, Mᵣ, of magnesium nitrate, Mg(NO₃)₂? (Mg = 24, N = 14, O = 16)', o: ['86', '110', '148', '172'], a: 2, e: '24 + 2 × (14 + 3 × 16) = 24 + 2 × 62 = 24 + 124 = 148.' },
    { q: 'How many moles of oxygen molecules are in 8.0 g of O₂? (O = 16)', o: ['0.25', '0.50', '2.0', '4.0'], a: 0, e: 'Mᵣ(O₂) = 32. moles = 8.0 ÷ 32 = 0.25 mol.' },
    { q: 'Molten zinc chloride is electrolysed. What forms at each electrode?', o: ['Cathode: chlorine; anode: zinc', 'Cathode: zinc; anode: chlorine', 'Cathode: hydrogen; anode: oxygen', 'Cathode: zinc; anode: oxygen'], a: 1, e: 'Molten binary compound: metal (Zn²⁺) at the cathode, non-metal (Cl⁻ → Cl₂) at the anode.' },
    { q: 'Which change is endothermic?', o: ['Burning methane', 'Neutralising an acid', 'Thermal decomposition of calcium carbonate', 'Respiration'], a: 2, e: 'Thermal decomposition needs a continuous supply of heat — it is endothermic.' },
    { q: 'Which change would NOT increase the rate of reaction between magnesium and hydrochloric acid?', o: ['Using magnesium powder instead of ribbon', 'Heating the acid', 'Using more concentrated acid', 'Using a larger volume of the same acid'], a: 3, e: 'More volume at the same concentration does not change the number of particles per unit volume, so the collision frequency is the same.' },
    { q: 'What is seen when water is added to anhydrous copper(II) sulfate?', o: ['Blue to white', 'White to blue', 'Blue to pink', 'Pink to blue'], a: 1, e: 'White anhydrous copper(II) sulfate becomes blue hydrated copper(II) sulfate.' },
    { q: 'A solution has pH 13. Which statement is correct?', o: ['It is strongly acidic', 'It is weakly acidic', 'It is neutral', 'It contains more OH⁻ than H⁺ ions'], a: 3, e: 'pH 13 is strongly alkaline — OH⁻ ions are in excess.' },
    { q: 'Which method is used to make the insoluble salt lead(II) iodide?', o: ['Excess metal + acid', 'Titration', 'Precipitation', 'Excess carbonate + acid'], a: 2, e: 'Insoluble salts are made by mixing two solutions (e.g. lead(II) nitrate + potassium iodide) — precipitation.' },
    { q: 'Which statement about Group I metals is correct going down the group?', o: ['Melting point increases', 'Reactivity decreases', 'Density increases', 'They become harder'], a: 2, e: 'Down Group I: melting point decreases, density increases, reactivity increases.' },
    { q: 'Aqueous chlorine is added to aqueous potassium bromide. What is the colour of the solution afterwards?', o: ['Colourless', 'Orange', 'Purple', 'Green'], a: 1, e: 'Chlorine displaces bromine (Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂); bromine solution is orange.' },
    { q: 'Metal M does not react with dilute hydrochloric acid but it displaces silver from silver nitrate solution. What is M?', o: ['Magnesium', 'Zinc', 'Copper', 'Gold'], a: 2, e: 'M is below hydrogen (no reaction with acid) but above silver → copper.' },
    { q: 'Which gas makes up about 21% of clean, dry air?', o: ['Nitrogen', 'Oxygen', 'Argon', 'Carbon dioxide'], a: 1, e: 'Air is about 78% nitrogen and 21% oxygen.' },
    { q: 'What is the molecular formula of propene?', o: ['C₃H₈', 'C₃H₆', 'C₃H₇OH', 'C₂H₄'], a: 1, e: 'Alkenes are CₙH₂ₙ. n = 3 → C₃H₆.' },
    { q: 'Which reaction produces ethanol?', o: ['Ethene + steam with an acid catalyst', 'Ethane + chlorine in UV light', 'Cracking of decane', 'Ethanoic acid + magnesium'], a: 0, e: 'C₂H₄ + H₂O → C₂H₅OH (300 °C, 60 atm, acid catalyst). Fermentation of glucose also makes ethanol.' },
    { q: 'A solution gives a white precipitate with aqueous sodium hydroxide that dissolves in excess. With aqueous ammonia, the white precipitate does NOT dissolve in excess. Which ion is present?', o: ['Ca²⁺', 'Zn²⁺', 'Al³⁺', 'Cu²⁺'], a: 2, e: 'Al³⁺: white ppt soluble in excess NaOH, insoluble in excess NH₃. Zn²⁺ would dissolve in excess of both.' },
  ],
},
{
  id: 'theory1', title: 'Practice Paper B — Theory', type: 'structured', time: 60, style: 'Paper 3/4 style',
  desc: 'Structured questions. Write your answer, then reveal the model answer and tick the marking points you earned.',
  questions: [
    {
      n: 1, stem: 'This question is about atoms and ions. The table gives information about four particles, A to D.<table class="tbl"><tr><th>Particle</th><th>Protons</th><th>Neutrons</th><th>Electrons</th></tr><tr><td>A</td><td>9</td><td>10</td><td>10</td></tr><tr><td>B</td><td>11</td><td>12</td><td>11</td></tr><tr><td>C</td><td>17</td><td>18</td><td>17</td></tr><tr><td>D</td><td>17</td><td>20</td><td>17</td></tr></table>',
      parts: [
        { p: '(a)', q: 'Which particle is a negative ion? Explain your answer.', marks: 2, answer: '<b>A</b> — it has more electrons (10) than protons (9).', points: ['A', 'more electrons than protons'] },
        { p: '(b)', q: 'Which two particles are isotopes of the same element? Give a reason.', marks: 2, answer: '<b>C and D</b> — same number of protons (17) but different numbers of neutrons (18 and 20).', points: ['C and D', 'same protons, different neutrons'] },
        { p: '(c)', q: 'What is the mass number of particle B?', marks: 1, answer: '11 + 12 = <b>23</b>', points: ['23'] },
        { p: '(d)', q: 'Write the electronic configuration of particle B.', marks: 1, answer: '<b>2,8,1</b> (it is a sodium atom)', points: ['2,8,1'] },
        { p: '(e)', q: 'Explain why C and D have the same chemical properties.', marks: 2, answer: 'They have the <b>same number of electrons</b> / same electronic configuration (2,8,7), and chemical properties depend on electrons (especially outer electrons).', points: ['same number of (outer) electrons', 'chemical reactions involve electrons / same configuration'] },
      ],
    },
    {
      n: 2, stem: 'Magnesium reacts with oxygen to form magnesium oxide, MgO.',
      parts: [
        { p: '(a)', q: 'Describe, in terms of electrons, how magnesium oxide is formed from magnesium and oxygen atoms. You may draw a dot-and-cross diagram.', marks: 3, answer: 'Each Mg atom (2,8,2) <b>loses two electrons</b> → Mg<sup>2+</sup>. Each O atom (2,6) <b>gains two electrons</b> → O<sup>2−</sup>. Electrons are <b>transferred</b> from Mg to O; both ions have a full outer shell (2,8). The oppositely charged ions attract.', points: ['Mg loses 2 electrons', 'O gains 2 electrons', 'ions Mg²⁺ and O²⁻ with full outer shells / transfer from Mg to O'] },
        { p: '(b)', q: 'Name the type of bonding in magnesium oxide and describe it.', marks: 2, answer: '<b>Ionic</b> bonding — a <b>strong electrostatic attraction between oppositely charged ions</b>.', points: ['ionic', 'electrostatic attraction between oppositely charged ions'] },
        { p: '(c)', q: 'Magnesium oxide has a melting point of 2852 °C. Explain why it is so high.', marks: 2, answer: 'Giant ionic <b>lattice</b>; there are many <b>strong</b> electrostatic attractions between ions that need <b>a lot of energy</b> to overcome.', points: ['giant lattice / many ions', 'strong forces need lots of energy to overcome'] },
        { p: '(d)', q: 'State the conditions under which magnesium oxide conducts electricity. Explain why.', marks: 2, answer: 'When <b>molten</b> (MgO is insoluble, so not aqueous); the <b>ions are free to move</b>.', points: ['molten', 'ions can move'] },
        { p: '(e)', q: '6.0 g of magnesium is burned. 2Mg + O₂ → 2MgO. Calculate the mass of magnesium oxide formed. (Mg = 24, O = 16)', marks: 3, answer: 'moles Mg = 6.0 ÷ 24 = <b>0.25 mol</b>; ratio Mg : MgO = 2 : 2 = 1 : 1 → 0.25 mol MgO; M<sub>r</sub>(MgO) = 40 → mass = 0.25 × 40 = <b>10 g</b>.', points: ['moles Mg = 0.25', 'moles MgO = 0.25 (1:1 ratio)', 'mass = 10 g'] },
      ],
    },
    {
      n: 3, stem: 'Concentrated aqueous sodium chloride is electrolysed using inert carbon electrodes.',
      parts: [
        { p: '(a)', q: 'Name the product at (i) the cathode and (ii) the anode.', marks: 2, answer: '(i) <b>hydrogen</b>; (ii) <b>chlorine</b>', points: ['cathode: hydrogen', 'anode: chlorine'] },
        { p: '(b)', q: 'Describe a test for the gas formed at the anode, including the result.', marks: 2, answer: 'Hold <b>damp litmus paper</b> in the gas; it is <b>bleached</b> (turns white).', points: ['damp litmus paper', 'bleached'] },
        { p: '(c)', q: 'Explain why sodium is not formed at the cathode.', marks: 1, answer: 'Sodium is <b>more reactive than hydrogen</b>, so hydrogen ions are discharged instead.', points: ['Na more reactive than H'] },
        { p: '(d)', q: 'Write the ionic half-equation for the reaction at the anode. Is this oxidation or reduction?', marks: 2, answer: '<b>2Cl<sup>−</sup> → Cl<sub>2</sub> + 2e<sup>−</sup></b>; <b>oxidation</b> (loss of electrons).', points: ['2Cl⁻ → Cl₂ + 2e⁻', 'oxidation'] },
        { p: '(e)', q: 'Name the solution left at the end of the electrolysis.', marks: 1, answer: '<b>Sodium hydroxide</b> (solution).', points: ['sodium hydroxide'] },
      ],
    },
    {
      n: 4, stem: 'A student investigates the reaction between calcium carbonate chips and dilute hydrochloric acid by measuring the volume of carbon dioxide given off.<br>CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)',
      parts: [
        { p: '(a)', q: 'Name a piece of apparatus that could be used to measure the volume of gas.', marks: 1, answer: '<b>Gas syringe</b> (or upturned measuring cylinder / burette over water).', points: ['gas syringe'] },
        { p: '(b)', q: 'The experiment is repeated with the same mass of calcium carbonate powder. State and explain the effect on the rate.', marks: 3, answer: 'Rate <b>increases</b>. Powder has a <b>larger surface area</b>, so there are <b>more frequent collisions</b> between acid particles and calcium carbonate.', points: ['faster', 'larger surface area', 'more frequent collisions'] },
        { p: '(c)', q: 'Explain, using collision theory, why increasing the temperature increases the rate.', marks: 3, answer: 'Particles have <b>more kinetic energy</b> and move faster → <b>more frequent collisions</b>; a <b>greater proportion of collisions have energy ≥ activation energy</b>, so more are successful.', points: ['more kinetic energy / move faster', 'more frequent collisions', 'more collisions have energy ≥ Eₐ'] },
        { p: '(d)', q: 'Describe the test for carbon dioxide and its result.', marks: 2, answer: 'Bubble through <b>limewater</b> → turns <b>milky / cloudy</b>.', points: ['limewater', 'milky'] },
        { p: '(e)', q: 'Calculate the maximum volume of CO₂ at r.t.p. from 5.0 g of calcium carbonate. (Mᵣ CaCO₃ = 100; 1 mol gas = 24 dm³)', marks: 2, answer: 'moles = 5.0 ÷ 100 = <b>0.050 mol</b> → 0.050 mol CO₂ → 0.050 × 24 = <b>1.2 dm³</b> (1200 cm³).', points: ['0.050 mol', '1.2 dm³'] },
      ],
    },
    {
      n: 5, stem: 'This question is about organic compounds. Ethene, C₂H₄, is made by cracking.',
      parts: [
        { p: '(a)', q: 'State the conditions needed for cracking.', marks: 2, answer: '<b>High temperature</b> and a <b>catalyst</b>.', points: ['high temperature', 'catalyst'] },
        { p: '(b)', q: 'Describe a test to show that ethene is unsaturated. Give the result.', marks: 2, answer: 'Add <b>aqueous bromine</b> (bromine water); it turns from <b>orange to colourless</b>.', points: ['bromine water', 'orange → colourless'] },
        { p: '(c)', q: 'Draw the displayed formula of ethene.', marks: 1, answer: 'H₂C=CH₂ with all bonds shown: two C atoms joined by a <b>double bond</b>, each with two H atoms attached by single bonds.<pre class="df">H       H\n \\     /\n  C = C\n /     \\\nH       H</pre>', points: ['C=C with 4 H, all bonds shown'] },
        { p: '(d)', q: 'Ethene forms the polymer poly(ethene). Name this type of polymerisation.', marks: 1, answer: '<b>Addition</b> polymerisation.', points: ['addition'] },
        { p: '(e)', q: 'Give two environmental problems caused by the disposal of plastics.', marks: 2, answer: 'Any two: <b>landfill</b> sites fill up (non-biodegradable); <b>accumulation in oceans</b> harms aquatic life; <b>toxic gases</b> when burned.', points: ['problem 1', 'problem 2'] },
        { p: '(f)', q: 'Ethanol can be made by fermentation. Give one advantage and one disadvantage of fermentation compared with making ethanol from ethene.', marks: 2, answer: 'Advantage: uses <b>renewable</b> raw materials (sugar) / low temperature (less energy). Disadvantage: <b>slow</b> / batch process / product is <b>impure</b> and needs distilling.', points: ['advantage', 'disadvantage'] },
      ],
    },
  ],
},
{
  id: 'practical1', title: 'Practice Paper C — Practical Skills', type: 'structured', time: 30, style: 'Paper 5/6 style',
  desc: 'Practical and analysis questions: titration, tests for ions, chromatography and planning.',
  questions: [
    {
      n: 1, stem: 'A student titrates 25.0 cm³ of sodium hydroxide solution with dilute hydrochloric acid using methyl orange.<table class="tbl"><tr><th></th><th>Rough</th><th>1</th><th>2</th><th>3</th></tr><tr><td>Final reading / cm³</td><td>23.4</td><td>45.10</td><td>22.50</td><td>44.95</td></tr><tr><td>Initial reading / cm³</td><td>0.0</td><td>22.50</td><td>0.00</td><td>22.50</td></tr><tr><td>Volume used / cm³</td><td>23.4</td><td>?</td><td>?</td><td>?</td></tr></table>',
      parts: [
        { p: '(a)', q: 'Name the piece of apparatus used to measure 25.0 cm³ of sodium hydroxide accurately.', marks: 1, answer: '<b>Volumetric pipette</b>.', points: ['volumetric pipette'] },
        { p: '(b)', q: 'Complete the table and calculate the average of the concordant titres.', marks: 3, answer: 'Titres: 1 = <b>22.60</b>, 2 = <b>22.50</b>, 3 = <b>22.45</b>. Concordant results are within 0.10 cm³ of each other: <b>22.50 and 22.45</b> (22.60 differs from 22.45 by 0.15, so leave it out). Average = (22.50 + 22.45) ÷ 2 = <b>22.48 cm³</b>.', points: ['correct titres 22.60, 22.50, 22.45', 'choose 22.50 and 22.45 as concordant', 'average = 22.48 cm³'] },
        { p: '(c)', q: 'State the colour change at the end-point.', marks: 1, answer: '<b>Yellow → orange/red</b> (acid being added to alkali).', points: ['yellow to orange/red'] },
        { p: '(d)', q: 'Suggest why the rough titre is not used in the average.', marks: 1, answer: 'It was done <b>quickly</b> to find the approximate end-point, so it is <b>less accurate</b> (overshoots).', points: ['less accurate / approximate'] },
      ],
    },
    {
      n: 2, stem: 'Solid S is a salt. A student does the following tests on a solution of S.',
      parts: [
        { p: '(a)', q: 'Aqueous sodium hydroxide is added. A green precipitate forms which is insoluble in excess. Identify the cation.', marks: 1, answer: '<b>Iron(II), Fe<sup>2+</sup></b>.', points: ['Fe²⁺'] },
        { p: '(b)', q: 'Dilute nitric acid then aqueous barium nitrate are added. A white precipitate forms. Identify the anion.', marks: 1, answer: '<b>Sulfate, SO<sub>4</sub><sup>2−</sup></b>.', points: ['sulfate'] },
        { p: '(c)', q: 'Name salt S.', marks: 1, answer: '<b>Iron(II) sulfate</b>, FeSO<sub>4</sub>.', points: ['iron(II) sulfate'] },
        { p: '(d)', q: 'Describe how to carry out a flame test on a solid.', marks: 2, answer: 'Dip a <b>clean nichrome/platinum wire</b> (moistened with acid) into the solid; hold it in a <b>blue / roaring Bunsen flame</b> and observe the colour.', points: ['clean wire dipped in solid', 'hold in (blue) Bunsen flame, observe colour'] },
      ],
    },
    {
      n: 3, stem: 'A food colouring is analysed by paper chromatography.',
      parts: [
        { p: '(a)', q: 'Why must the baseline be above the level of the solvent?', marks: 1, answer: 'Otherwise the dyes would <b>dissolve into the solvent</b> in the beaker instead of moving up the paper.', points: ['spots would dissolve in solvent'] },
        { p: '(b)', q: 'One dye moves 4.2 cm; the solvent front moves 8.4 cm. Calculate the Rf value.', marks: 1, answer: 'R<sub>f</sub> = 4.2 ÷ 8.4 = <b>0.50</b>', points: ['0.50'] },
        { p: '(c)', q: 'How does the chromatogram show that the food colouring is a mixture?', marks: 1, answer: 'It gives <b>more than one spot</b>.', points: ['more than one spot'] },
        { p: '(d)', q: 'Plan an experiment to find out how temperature affects the rate of reaction between magnesium ribbon and hydrochloric acid. Include variables to control.', marks: 4, answer: 'Use the <b>same length/mass of Mg</b> and the <b>same volume and concentration of acid</b>. Heat the acid to different <b>temperatures</b> (e.g. 20, 30, 40, 50 °C) measured with a thermometer. Add the Mg, start a <b>stop-watch</b>, and measure the <b>time</b> for the Mg to disappear (or the volume of gas in a gas syringe in a fixed time). <b>Repeat</b> and compare: shorter time = faster rate.', points: ['same mass Mg and same volume/concentration of acid', 'vary temperature, measure with thermometer', 'measure time (stop-watch) or gas volume', 'repeat / compare results'] },
      ],
    },
  ],
},
];
