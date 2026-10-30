'use strict';
// Test-prep papers for the remaining topics (part 2). Uses mcq() and part() from testprep2.js.

const TESTPREP3 = [
// ---------------- Acids, bases & salts ----------------
{ id: 'tp-acids-mcq', group: 'Test prep: Acids, bases & salts', title: 'Acids, Bases & Salts — Multiple Choice', type: 'mcq', time: 20, style: 'Paper 1/2 style',
  desc: 'pH, indicators, reactions of acids, oxides, strong/weak acids and making salts.',
  questions: [
    mcq('What colour is methyl orange in an acid?', ['red', 'yellow', 'blue', 'colourless'], 0, 'Methyl orange: red in acid, yellow in alkali.'),
    mcq('What colour is thymolphthalein in an alkali?', ['colourless', 'red', 'blue', 'yellow'], 2, 'Thymolphthalein: colourless in acid, blue in alkali.'),
    mcq('Which ion is present in all alkaline solutions?', ['H⁺', 'OH⁻', 'Na⁺', 'Cl⁻'], 1, 'Alkalis contain hydroxide ions, OH⁻(aq).'),
    mcq('What are the products when zinc reacts with sulfuric acid?', ['zinc sulfate and water', 'zinc sulfate and hydrogen', 'zinc oxide and hydrogen', 'zinc sulfate and carbon dioxide'], 1, 'Metal + acid → salt + hydrogen.'),
    mcq('What are the products when copper(II) carbonate reacts with hydrochloric acid?', ['copper(II) chloride, water and carbon dioxide', 'copper(II) chloride and hydrogen', 'copper(II) oxide and carbon dioxide', 'copper and carbon dioxide'], 0, 'Acid + carbonate → salt + water + carbon dioxide.'),
    mcq('Which oxide is acidic?', ['calcium oxide', 'copper(II) oxide', 'sulfur dioxide', 'sodium oxide'], 2, 'Non-metal oxides (SO₂, CO₂) are acidic; metal oxides are basic.'),
    mcq('Extended: Which oxide is amphoteric?', ['MgO', 'Al₂O₃', 'CO₂', 'Na₂O'], 1, 'Aluminium oxide and zinc oxide react with both acids and bases.'),
    mcq('Extended: What is a weak acid?', ['a dilute acid', 'an acid that is partially dissociated in water', 'an acid that is fully dissociated in water', 'an acid with pH 7'], 1, 'Weak acids, e.g. ethanoic acid, only partially dissociate into ions.'),
    mcq('Which salt is insoluble in water?', ['sodium carbonate', 'lead(II) chloride', 'potassium nitrate', 'magnesium sulfate'], 1, 'Chlorides are soluble except silver and lead chloride.'),
    mcq('Which method is used to make copper(II) sulfate from copper(II) oxide?', ['titration', 'precipitation', 'add excess copper(II) oxide to warm acid, then filter', 'electrolysis'], 2, 'CuO is an insoluble base: add excess, filter off the excess, then crystallise.'),
    mcq('Extended: Which is the ionic equation for neutralisation?', ['Na⁺ + Cl⁻ → NaCl', 'H⁺ + OH⁻ → H₂O', '2H⁺ + O²⁻ → H₂O', 'H₂ + O₂ → H₂O'], 1, 'H⁺(aq) + OH⁻(aq) → H₂O(l).'),
    mcq('Ammonium chloride is warmed with sodium hydroxide. Which gas forms?', ['chlorine', 'hydrogen', 'ammonia', 'nitrogen'], 2, 'Base + ammonium salt → salt + water + ammonia.'),
    mcq('Extended: Which acid is a proton donor?', ['all acids', 'only strong acids', 'only weak acids', 'no acids'], 0, 'All acids are proton (H⁺) donors; bases are proton acceptors.'),
    mcq('What is the formula of hydrated copper(II) sulfate?', ['CuSO₄', 'CuSO₄·5H₂O', 'CuSO₄·6H₂O', 'Cu(SO₄)₂'], 1, 'Blue crystals: CuSO₄·5H₂O. (Hydrated cobalt(II) chloride is CoCl₂·6H₂O.)'),
  ] },
{ id: 'tp-acids-theory', group: 'Test prep: Acids, bases & salts', title: 'Acids, Bases & Salts — Structured', type: 'structured', time: 25, style: 'Paper 3/4 style',
  desc: 'Salt preparation methods, equations and solubility.',
  questions: [
    { n: 1, stem: 'A student makes crystals of magnesium sulfate from magnesium carbonate and dilute sulfuric acid.',
      parts: [
        part('(a)', 'Write a balanced equation with state symbols.', 2, '<b>MgCO₃(s) + H₂SO₄(aq) → MgSO₄(aq) + H₂O(l) + CO₂(g)</b>', ['correct formulae', 'balanced with state symbols']),
        part('(b)', 'Describe how the student makes pure, dry crystals.', 4, 'Add magnesium carbonate to warm acid <b>until it is in excess</b> (no more fizzing). <b>Filter</b> to remove excess solid. <b>Heat the filtrate</b> to the crystallisation point, then <b>leave to cool</b> and crystallise. <b>Filter and dry</b> the crystals (between filter papers).', ['excess solid', 'filter', 'heat to crystallisation point and cool', 'filter and dry crystals']),
        part('(c)', 'State how the student knows when the carbonate is in excess.', 1, 'Solid remains / <b>no more effervescence</b>.', ['no more fizzing / solid left over']),
      ] },
    { n: 2, stem: 'Extended: Barium sulfate is an insoluble salt.',
      parts: [
        part('(a)', 'Name two solutions that could be mixed to make barium sulfate.', 2, 'E.g. <b>barium chloride</b> (or barium nitrate) and <b>sodium sulfate</b> (or sulfuric acid).', ['soluble barium salt', 'soluble sulfate']),
        part('(b)', 'Write the ionic equation with state symbols.', 2, '<b>Ba²⁺(aq) + SO₄²⁻(aq) → BaSO₄(s)</b>', ['correct ions', 'state symbols']),
        part('(c)', 'Describe how to obtain a pure, dry sample of barium sulfate.', 2, '<b>Filter</b>; <b>wash</b> the residue with distilled water; <b>dry</b> it.', ['filter', 'wash and dry']),
      ] },
  ] },
// ---------------- Periodic Table ----------------
{ id: 'tp-periodic-mcq', group: 'Test prep: The Periodic Table', title: 'The Periodic Table — Multiple Choice', type: 'mcq', time: 15, style: 'Paper 1/2 style',
  desc: 'Groups, periods, trends in Groups I and VII, transition elements and noble gases.',
  questions: [
    mcq('Elements in the Periodic Table are arranged in order of increasing…', ['mass number', 'proton number', 'number of neutrons', 'reactivity'], 1, 'Elements are arranged by proton (atomic) number.'),
    mcq('How does metallic character change across a period from left to right?', ['increases', 'decreases', 'stays the same', 'increases then decreases'], 1, 'Metals are on the left, non-metals on the right.'),
    mcq('Which Group I metal reacts most vigorously with water?', ['lithium', 'sodium', 'potassium', 'they react equally'], 2, 'Reactivity increases down Group I.'),
    mcq('How does the melting point change down Group I?', ['increases', 'decreases', 'stays the same', 'no pattern'], 1, 'Melting point decreases down Group I (density increases).'),
    mcq('What is the appearance of chlorine at room temperature?', ['red-brown liquid', 'grey-black solid', 'pale yellow-green gas', 'colourless gas'], 2, 'Chlorine: pale yellow-green gas; bromine: red-brown liquid; iodine: grey-black solid.'),
    mcq('Which reaction happens?', ['iodine + potassium bromide', 'bromine + potassium chloride', 'chlorine + potassium iodide', 'iodine + potassium chloride'], 2, 'A more reactive halogen displaces a less reactive one: Cl₂ + 2KI → 2KCl + I₂.'),
    mcq('Which is a property of transition elements?', ['low density', 'form white compounds only', 'often act as catalysts', 'low melting points'], 2, 'Transition elements have high densities and melting points, form coloured compounds and are often catalysts.'),
    mcq('Why are noble gases monatomic?', ['They have full outer shells, so atoms do not bond.', 'They are metals.', 'They have no electrons.', 'They are very reactive.'], 0, 'With a full outer shell, noble gas atoms do not bond to each other.'),
    mcq('What charge is on the ion formed by a Group II element?', ['1+', '2+', '2−', '6+'], 1, 'Group II atoms lose 2 outer electrons → 2+ ions.'),
    mcq('Rubidium is below potassium in Group I. Which prediction is correct?', ['It is less reactive than potassium.', 'It has a higher melting point than potassium.', 'It reacts with water to form an alkaline solution and hydrogen.', 'It is a gas at room temperature.'], 2, 'All Group I metals react with water to give a hydroxide (alkaline) and hydrogen; rubidium is more reactive with a lower melting point.'),
    mcq('Extended: Iron forms ions with variable oxidation numbers. Which pair is correct?', ['Fe⁺ and Fe²⁺', 'Fe²⁺ and Fe³⁺', 'Fe³⁺ and Fe⁴⁺', 'Fe⁻ and Fe²⁺'], 1, 'Iron(II) = Fe²⁺ and iron(III) = Fe³⁺.'),
    mcq('Why do lithium, sodium and potassium have similar chemical properties?', ['same number of shells', 'same number of outer-shell electrons', 'same mass', 'same number of neutrons'], 1, 'All have 1 outer electron.'),
  ] },
{ id: 'tp-periodic-theory', group: 'Test prep: The Periodic Table', title: 'The Periodic Table — Structured', type: 'structured', time: 20, style: 'Paper 3/4 style',
  desc: 'Group trends, displacement and predicting properties.',
  questions: [
    { n: 1, stem: 'Sodium reacts with cold water.',
      parts: [
        part('(a)', 'Describe two observations.', 2, 'Any two: <b>floats</b>; <b>fizzes</b> (bubbles); <b>melts into a ball</b>; <b>moves around</b>; gets smaller / disappears.', ['observation 1', 'observation 2']),
        part('(b)', 'Write a balanced equation.', 2, '<b>2Na + 2H₂O → 2NaOH + H₂</b>', ['correct formulae', 'balanced']),
        part('(c)', 'Universal indicator is added to the water afterwards. State and explain the colour.', 2, '<b>Purple / blue</b> — sodium hydroxide is formed, which is an <b>alkali</b>.', ['purple / blue', 'alkaline (NaOH)']),
        part('(d)', 'Predict how potassium reacts compared with sodium.', 1, '<b>More vigorously</b> (and with a lilac flame).', ['more vigorously']),
      ] },
    { n: 2, stem: 'Chlorine water is added to aqueous potassium bromide.',
      parts: [
        part('(a)', 'State the colour change.', 1, 'Colourless → <b>orange</b> (bromine forms).', ['orange']),
        part('(b)', 'Write the equation and explain why the reaction happens.', 3, '<b>Cl₂ + 2KBr → 2KCl + Br₂</b>. Chlorine is <b>more reactive</b> than bromine (higher in Group VII), so it <b>displaces</b> bromine.', ['equation', 'chlorine more reactive', 'displaces bromine']),
        part('(c)', 'Explain why there is no reaction when iodine is added to potassium chloride.', 1, 'Iodine is <b>less reactive</b> than chlorine.', ['iodine less reactive']),
      ] },
  ] },
// ---------------- Metals ----------------
{ id: 'tp-metals-mcq', group: 'Test prep: Metals', title: 'Metals — Multiple Choice', type: 'mcq', time: 15, style: 'Paper 1/2 style',
  desc: 'Properties and uses, reactivity series, displacement, rusting and extraction.',
  questions: [
    mcq('Which metal does NOT react with dilute hydrochloric acid?', ['magnesium', 'iron', 'zinc', 'copper'], 3, 'Copper is below hydrogen in the reactivity series.'),
    mcq('Which metal reacts with steam but only very slowly with cold water?', ['potassium', 'magnesium', 'copper', 'sodium'], 1, 'Mg + H₂O(g) → MgO + H₂.'),
    mcq('What is seen when an iron nail is placed in copper(II) sulfate solution?', ['no change', 'a brown coating forms on the nail and the blue colour fades', 'the nail turns silver', 'bubbles of oxygen'], 1, 'Iron is more reactive and displaces copper.'),
    mcq('What is needed for iron to rust?', ['oxygen only', 'water only', 'oxygen and water', 'carbon dioxide and water'], 2, 'Rusting needs both water and oxygen.'),
    mcq('Extended: Why does zinc protect iron even when the zinc coating is scratched?', ['zinc is less reactive', 'zinc is more reactive and loses electrons in preference to iron', 'zinc is a non-metal', 'zinc keeps out water only'], 1, 'Sacrificial protection: zinc is oxidised instead of iron.'),
    mcq('Why is aluminium used for aircraft?', ['high density', 'low density', 'it is magnetic', 'it reacts with water'], 1, 'Aluminium has a low density and is strong when alloyed.'),
    mcq('Why is copper used for electrical wiring?', ['low density', 'good electrical conductor and ductile', 'resists corrosion only', 'it is cheap'], 1, 'Copper conducts well and can be drawn into wires.'),
    mcq('In the blast furnace, what reduces iron(III) oxide?', ['oxygen', 'carbon monoxide', 'calcium oxide', 'carbon dioxide'], 1, 'Fe₂O₃ + 3CO → 2Fe + 3CO₂.'),
    mcq('What is the purpose of limestone in the blast furnace?', ['to provide heat', 'to remove impurities (silicon dioxide) as slag', 'to reduce the iron ore', 'to act as a catalyst'], 1, 'CaCO₃ → CaO + CO₂; CaO + SiO₂ → CaSiO₃ (slag).'),
    mcq('Why is aluminium extracted by electrolysis?', ['It is less reactive than carbon.', 'It is more reactive than carbon.', 'Its ore is a liquid.', 'Electrolysis is cheaper.'], 1, 'Carbon cannot reduce oxides of metals more reactive than carbon.'),
    mcq('Extended: Why does aluminium appear unreactive?', ['It is below hydrogen.', 'It has a protective oxide layer.', 'It is a noble metal.', 'It has no outer electrons.'], 1, 'A thin layer of aluminium oxide protects the metal.'),
    mcq('Metal X displaces Y from Y nitrate. Metal Z does not react with X nitrate or Y nitrate. What is the order of reactivity?', ['X > Y > Z', 'Z > X > Y', 'Y > X > Z', 'X > Z > Y'], 0, 'X is above Y; Z is below both.'),
  ] },
{ id: 'tp-metals-theory', group: 'Test prep: Metals', title: 'Metals — Structured', type: 'structured', time: 20, style: 'Paper 3/4 style',
  desc: 'Blast furnace, aluminium extraction and rust prevention.',
  questions: [
    { n: 1, stem: 'Iron is extracted from hematite in a blast furnace.',
      parts: [
        part('(a)', 'Name three raw materials added at the top of the blast furnace.', 3, '<b>Hematite</b> (iron ore), <b>coke</b> (carbon), <b>limestone</b>.', ['hematite', 'coke', 'limestone']),
        part('(b)', 'Describe how the high temperature and carbon monoxide are produced.', 2, 'Coke <b>burns</b> in hot air: C + O₂ → CO₂ (exothermic). CO₂ reacts with more coke: <b>C + CO₂ → 2CO</b>.', ['coke burns in air', 'CO₂ + C → 2CO']),
        part('(c)', 'Extended: Write the equation for the reduction of iron(III) oxide.', 2, '<b>Fe₂O₃ + 3CO → 2Fe + 3CO₂</b>', ['correct formulae', 'balanced']),
      ] },
    { n: 2, stem: 'Iron rusts. Methods are used to prevent rusting.',
      parts: [
        part('(a)', 'Name the substance formed when iron rusts.', 1, '<b>Hydrated iron(III) oxide</b>.', ['hydrated iron(III) oxide']),
        part('(b)', 'Explain how painting prevents rusting.', 1, 'It is a <b>barrier</b> that keeps out <b>oxygen and water</b>.', ['barrier excludes oxygen/water']),
        part('(c)', 'Extended: Explain, in terms of electrons, how galvanising protects iron.', 3, 'Zinc is <b>more reactive</b> than iron, so zinc <b>loses electrons</b> (is oxidised) <b>instead of iron</b> — sacrificial protection. Zn → Zn²⁺ + 2e⁻.', ['zinc more reactive', 'zinc loses electrons / oxidised', 'instead of iron']),
      ] },
  ] },
// ---------------- Environment: water & fertilisers ----------------
{ id: 'tp-water-mcq', group: 'Test prep: Water & fertilisers', title: 'Water & Fertilisers — Multiple Choice', type: 'mcq', time: 12, style: 'Paper 1/2 style',
  desc: 'Testing for water and purity, water treatment, pollutants in water and NPK fertilisers.',
  questions: [
    mcq('Which test shows that a liquid contains water?', ['It turns limewater milky.', 'It turns anhydrous copper(II) sulfate blue.', 'It relights a glowing splint.', 'It turns red litmus blue.'], 1, 'Anhydrous copper(II) sulfate turns from white to blue (cobalt(II) chloride: blue to pink).'),
    mcq('How can you show a sample of water is pure?', ['It is colourless.', 'It boils at exactly 100 °C.', 'It turns cobalt(II) chloride pink.', 'It has pH 7.'], 1, 'Pure water melts at 0 °C and boils at 100 °C exactly.'),
    mcq('Which stage of water treatment kills microbes?', ['sedimentation', 'filtration', 'carbon', 'chlorination'], 3, 'Chlorine kills harmful microbes.'),
    mcq('What is the purpose of carbon in water treatment?', ['to kill microbes', 'to remove tastes and odours', 'to remove large solids', 'to add minerals'], 1, 'Activated carbon removes tastes and odours.'),
    mcq('Which substance in river water is beneficial to aquatic life?', ['dissolved oxygen', 'sewage', 'plastics', 'nitrates from fertilisers'], 0, 'Fish need dissolved oxygen. Nitrates and phosphates lead to deoxygenation.'),
    mcq('Why is distilled water used in practical chemistry rather than tap water?', ['it is cheaper', 'it contains fewer chemical impurities', 'it contains chlorine', 'it is warmer'], 1, 'Distilled water has fewer impurities that could interfere with results.'),
    mcq('Which elements do NPK fertilisers provide?', ['nitrogen, phosphorus, potassium', 'nitrogen, potassium, krypton', 'neon, phosphorus, potassium', 'nitrogen, phosphorus, carbon'], 0, 'N, P and K are needed for plant growth.'),
    mcq('Which compound supplies both nitrogen and potassium?', ['ammonium nitrate', 'potassium nitrate', 'ammonium phosphate', 'potassium chloride'], 1, 'KNO₃ contains K and N.'),
    mcq('Which is harmful in water because it contains microbes that cause disease?', ['dissolved oxygen', 'sewage', 'metal compounds that provide minerals', 'distilled water'], 1, 'Sewage contains harmful microbes.'),
    mcq('Which pair causes deoxygenation of water and damage to aquatic life?', ['nitrates and phosphates', 'oxygen and nitrogen', 'chlorine and carbon', 'sodium and potassium'], 0, 'Nitrates and phosphates from fertilisers and detergents lead to deoxygenation.'),
  ] },
// ---------------- Organic chemistry ----------------
{ id: 'tp-organic-mcq', group: 'Test prep: Organic chemistry', title: 'Organic Chemistry — Multiple Choice', type: 'mcq', time: 20, style: 'Paper 1/2 style',
  desc: 'Homologous series, naming, fuels, alkanes, alkenes, alcohols, acids, esters and polymers.',
  questions: [
    mcq('What is the general formula of the alkenes?', ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₊₁OH', 'CₙH₂ₙ₊₁COOH'], 1, 'Alkenes: CₙH₂ₙ (e.g. C₂H₄).'),
    mcq('What is the main constituent of natural gas?', ['ethane', 'methane', 'propane', 'butane'], 1, 'Natural gas is mainly methane.'),
    mcq('Going up a fractionating column, the fractions have…', ['longer chains and higher boiling points', 'shorter chains and lower boiling points', 'higher viscosity', 'lower volatility'], 1, 'Top fractions: short chains, low boiling points, more volatile, less viscous.'),
    mcq('Which fraction is used as jet fuel?', ['naphtha', 'kerosene / paraffin', 'bitumen', 'refinery gas'], 1, 'Kerosene (paraffin) = jet fuel.'),
    mcq('What is seen when ethene is bubbled through aqueous bromine?', ['colourless to orange', 'orange to colourless', 'no change', 'orange to green'], 1, 'Alkenes decolourise bromine water (addition across C=C).'),
    mcq('Why are alkenes made by cracking?', ['There is more demand for long chains.', 'Short chains and alkenes are more useful and in greater demand.', 'Cracking makes polymers directly.', 'Alkenes are found in large amounts in petroleum.'], 1, 'Cracking turns long, less useful alkanes into petrol-range alkanes and alkenes (for polymers).'),
    mcq('What are the conditions for fermentation?', ['300 °C, 60 atm, acid catalyst', 'yeast, 25–35 °C, no oxygen', 'UV light', 'nickel catalyst'], 1, 'Yeast enzymes work best at 25–35 °C without oxygen.'),
    mcq('Which compound is a carboxylic acid?', ['CH₃OH', 'CH₃COOH', 'C₂H₄', 'CH₃COOCH₃'], 1, 'Carboxylic acids contain –COOH.'),
    mcq('Ethanoic acid reacts with magnesium. What are the products?', ['magnesium ethanoate and water', 'magnesium ethanoate and hydrogen', 'magnesium oxide and ethanol', 'magnesium ethanoate and carbon dioxide'], 1, 'Acid + metal → salt + hydrogen.'),
    mcq('Extended: What is the name of the ester made from ethanol and methanoic acid?', ['methyl ethanoate', 'ethyl methanoate', 'ethyl ethanoate', 'methyl methanoate'], 1, 'Alcohol part first (ethyl), then acid part (methanoate).'),
    mcq('Extended: What type of reaction is CH₄ + Cl₂ → CH₃Cl + HCl?', ['addition', 'substitution', 'cracking', 'polymerisation'], 1, 'One H atom is replaced by Cl (needs UV light).'),
    mcq('What is the monomer of poly(ethene)?', ['ethane', 'ethene', 'ethanol', 'propene'], 1, 'Many ethene molecules join by addition polymerisation.'),
    mcq('Extended: Which are structural isomers?', ['butane and methylpropane', 'ethane and ethene', 'methanol and ethanol', 'propane and propene'], 0, 'Both are C₄H₁₀ with different structures.'),
    mcq('Which is an environmental problem caused by plastics?', ['They dissolve in the sea.', 'They form toxic gases when burned.', 'They are biodegradable.', 'They react with acids.'], 1, 'Burning plastics releases toxic gases; they also persist in landfill and oceans.'),
  ] },
{ id: 'tp-organic-theory', group: 'Test prep: Organic chemistry', title: 'Organic Chemistry — Structured', type: 'structured', time: 25, style: 'Paper 3/4 style',
  desc: 'Cracking, alkenes, ethanol manufacture, acids and esters, polymers.',
  questions: [
    { n: 1, stem: 'Decane, C₁₀H₂₂, is cracked.',
      parts: [
        part('(a)', 'State the conditions needed for cracking.', 2, '<b>High temperature</b> and a <b>catalyst</b>.', ['high temperature', 'catalyst']),
        part('(b)', 'Complete the equation: C₁₀H₂₂ → C₈H₁₈ + .....', 1, '<b>C₂H₄</b> (ethene)', ['C₂H₄']),
        part('(c)', 'Describe a test to show that one product is unsaturated.', 2, 'Add <b>aqueous bromine</b>: it turns from <b>orange to colourless</b>.', ['bromine water', 'orange to colourless']),
        part('(d)', 'Extended: Ethene reacts with steam. Name the product and give the conditions.', 3, '<b>Ethanol</b>; <b>300 °C</b>, <b>60 atm (6000 kPa)</b>, <b>acid catalyst</b>.', ['ethanol', '300 °C and 60 atm', 'acid catalyst']),
      ] },
    { n: 2, stem: 'Ethanol can also be made by fermentation.',
      parts: [
        part('(a)', 'Write the equation for fermentation of glucose.', 2, '<b>C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂</b>', ['correct formulae', 'balanced']),
        part('(b)', 'Extended: Give one advantage and one disadvantage of fermentation compared with making ethanol from ethene.', 2, 'Advantage: <b>renewable</b> raw material / low energy. Disadvantage: <b>slow</b> / batch process / <b>impure</b> product.', ['advantage', 'disadvantage']),
        part('(c)', 'Write the equation for the complete combustion of ethanol.', 2, '<b>C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O</b>', ['correct formulae', 'balanced']),
      ] },
    { n: 3, stem: 'Extended: Polymers.',
      parts: [
        part('(a)', 'Draw the repeat unit of poly(chloroethene) made from CH₂=CHCl.', 2, '–[CH₂–CHCl]– : two carbons joined by a <b>single bond</b>, one carrying Cl, with <b>bonds extending through the brackets</b>.', ['single C–C with Cl', 'continuation bonds / brackets']),
        part('(b)', 'State two differences between addition and condensation polymerisation.', 2, 'Addition: monomers are <b>alkenes</b> and the polymer is the <b>only product</b>. Condensation: monomers have <b>two functional groups</b> and a <b>small molecule (water)</b> is also formed.', ['monomer type', 'only product vs water also formed']),
      ] },
  ] },
// ---------------- Experimental techniques ----------------
{ id: 'tp-analysis-mcq', group: 'Test prep: Experimental techniques & analysis', title: 'Experimental Techniques & Analysis — Multiple Choice', type: 'mcq', time: 15, style: 'Paper 1/2/6 style',
  desc: 'Apparatus, separation, chromatography, titration and tests for ions and gases.',
  questions: [
    mcq('Which apparatus measures exactly 25.0 cm³ of solution?', ['beaker', 'measuring cylinder', 'volumetric pipette', 'conical flask'], 2, 'A volumetric pipette delivers a fixed volume accurately.'),
    mcq('Which method separates sand from water?', ['distillation', 'filtration', 'chromatography', 'crystallisation'], 1, 'Sand is insoluble — it stays on the filter paper (residue).'),
    mcq('Which method separates ethanol from water?', ['filtration', 'simple distillation', 'fractional distillation', 'chromatography'], 2, 'Miscible liquids with different boiling points: fractional distillation.'),
    mcq('A spot moves 3.6 cm and the solvent front 9.0 cm. What is the Rf?', ['0.25', '0.40', '2.5', '5.4'], 1, 'Rf = 3.6 ÷ 9.0 = 0.40.'),
    mcq('Why is the chromatography baseline drawn in pencil?', ['pencil is insoluble in the solvent', 'pencil is easier to see', 'ink is too expensive', 'pencil reacts with the dyes'], 0, 'Ink would dissolve and run with the solvent.'),
    mcq('Aqueous NaOH gives a light blue precipitate, insoluble in excess. Which ion is present?', ['Fe²⁺', 'Fe³⁺', 'Cu²⁺', 'Zn²⁺'], 2, 'Copper(II) hydroxide is light blue.'),
    mcq('A white precipitate forms with aqueous ammonia and dissolves in excess. Which ion is present?', ['Al³⁺', 'Ca²⁺', 'Zn²⁺', 'Cu²⁺'], 2, 'Zinc hydroxide dissolves in excess ammonia; aluminium hydroxide does not.'),
    mcq('Acidified silver nitrate gives a cream precipitate. Which ion is present?', ['chloride', 'bromide', 'iodide', 'sulfate'], 1, 'Cl⁻ white, Br⁻ cream, I⁻ yellow.'),
    mcq('Which test identifies sulfate ions?', ['add dilute acid, test gas with limewater', 'acidify with dilute nitric acid, add aqueous barium nitrate', 'add NaOH and aluminium foil, warm', 'flame test'], 1, 'A white precipitate of barium sulfate forms.'),
    mcq('Which gas bleaches damp litmus paper?', ['ammonia', 'chlorine', 'oxygen', 'hydrogen'], 1, 'Chlorine bleaches damp litmus.'),
    mcq('What colour flame does a calcium compound give?', ['lilac', 'yellow', 'orange-red', 'blue-green'], 2, 'Ca²⁺: orange-red. K⁺ lilac, Na⁺ yellow, Cu²⁺ blue-green.'),
    mcq('How do impurities affect the melting point of a solid?', ['raise it', 'lower it and make it melt over a range', 'no effect', 'make it exactly 0 °C'], 1, 'Impurities lower the melting point and broaden the range.'),
  ] },
{ id: 'tp-analysis-theory', group: 'Test prep: Experimental techniques & analysis', title: 'Experimental Techniques & Analysis — Structured', type: 'structured', time: 25, style: 'Paper 5/6 style',
  desc: 'Identifying unknown salts, chromatography and titration technique.',
  questions: [
    { n: 1, stem: 'Solid Y is a salt. Tests are carried out on a solution of Y.',
      parts: [
        part('(a)', 'Aqueous NaOH gives a red-brown precipitate, insoluble in excess. Identify the cation.', 1, '<b>Fe³⁺</b> (iron(III)).', ['Fe³⁺']),
        part('(b)', 'Dilute nitric acid and aqueous silver nitrate give a white precipitate. Identify the anion.', 1, '<b>Cl⁻</b> (chloride).', ['chloride']),
        part('(c)', 'Name salt Y.', 1, '<b>Iron(III) chloride</b>, FeCl₃.', ['iron(III) chloride']),
        part('(d)', 'Describe how to test for ammonium ions and give the result.', 2, 'Warm with <b>aqueous sodium hydroxide</b>; <b>ammonia</b> is given off, which turns <b>damp red litmus blue</b>.', ['warm with NaOH', 'ammonia turns damp red litmus blue']),
      ] },
    { n: 2, stem: 'A student does a titration to find the concentration of hydrochloric acid using sodium hydroxide solution.',
      parts: [
        part('(a)', 'Name the apparatus used to add the acid gradually.', 1, '<b>Burette</b>.', ['burette']),
        part('(b)', 'Suggest a suitable indicator and the colour change at the end-point (acid added to alkali).', 2, 'E.g. <b>methyl orange</b>: <b>yellow → orange/red</b>. (Or thymolphthalein: blue → colourless.)', ['suitable indicator', 'correct colour change']),
        part('(c)', 'Explain why the titration is repeated until concordant results are obtained.', 2, 'To make the result <b>reliable / accurate</b>; concordant results are <b>within 0.10 cm³</b>, so anomalies can be identified and an average taken.', ['reliability / accuracy', 'within 0.10 cm³ / average']),
      ] },
  ] },
];

// Spread correct answers across A–D for both new sets (numeric options keep their order).
(function balance(sets) {
  for (const p of sets.filter((x) => x.type === 'mcq')) {
    p.questions.forEach((q, i) => {
      if (q.o.every((o) => /^[\d.\s+−\-]+(cm³|dm³|%|g|kJ\/mol| mol\/dm³)?$/.test(o))) return;
      const target = [2, 0, 3, 1][(i + p.id.length) % 4];
      if (q.a === target) return;
      [q.o[q.a], q.o[target]] = [q.o[target], q.o[q.a]];
      q.a = target;
    });
  }
})(TESTPREP2.concat(TESTPREP3));

PAPERS.push(...TESTPREP3);
