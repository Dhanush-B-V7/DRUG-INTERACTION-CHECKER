import type {
  ClinicalPreset,
  DrugDefinition,
  EnzymeDefinition,
  InteractionRecord,
  TargetProteinDefinition,
} from '../types/pharmacology';

export const ENZYME_CATALOG: Record<string, EnzymeDefinition> = {
  CYP2C9: {
    id: 'CYP2C9',
    name: 'CYP2C9',
    patientName: 'Liver: CYP2C9',
    fullName: 'Cytochrome P450 2C9',
    family: 'Hepatic Phase I Monooxygenase',
    patientDescription:
      'A primary liver enzyme responsible for breaking down blood thinners like warfarin and many anti-inflammatory pain relievers.',
    clinicalNotes:
      'Polymorphic hepatic enzyme (CYP2C9*2/*3 alleles significantly reduce clearance). Catalyzes S-warfarin 7-hydroxylation, the more potent enantiomer.',
  },
  CYP3A4: {
    id: 'CYP3A4',
    name: 'CYP3A4',
    patientName: 'Liver: CYP3A4',
    fullName: 'Cytochrome P450 3A4',
    family: 'Hepatic & Intestinal Phase I Monooxygenase',
    patientDescription:
      'The busiest drug-processing enzyme in the liver and gut, clearing roughly half of all prescription medications including statins.',
    clinicalNotes:
      'Accounts for ~30% of hepatic CYP content and major intestinal first-pass metabolism. Inhibition rapidly elevates AUC of narrow-index substrates.',
  },
  CYP2C19: {
    id: 'CYP2C19',
    name: 'CYP2C19',
    patientName: 'Liver: CYP2C19',
    fullName: 'Cytochrome P450 2C19',
    family: 'Hepatic Phase I Monooxygenase',
    patientDescription:
      'A liver enzyme that activates certain blood-thinning medications and helps clear stomach acid reducers and antidepressants.',
    clinicalNotes:
      'Essential for bioactivation of prodrugs such as clopidogrel to its active thiol metabolite, and R-warfarin/PPI oxidative clearance.',
  },
  CYP2D6: {
    id: 'CYP2D6',
    name: 'CYP2D6',
    patientName: 'Liver: CYP2D6',
    fullName: 'Cytochrome P450 2D6',
    family: 'Hepatic Phase I Monooxygenase',
    patientDescription:
      'A specialized liver enzyme that processes many heart rate medications, antidepressants, and pain treatments.',
    clinicalNotes:
      'Non-inducible enzyme subject to strong competitive inhibition by SSRIs (e.g., fluoxetine), causing phenoconversion to poor-metabolizer status.',
  },
  PGP: {
    id: 'PGP',
    name: 'P-gp / OATP1B1',
    patientName: 'Cell Gatekeeper',
    fullName: 'P-glycoprotein & OATP1B1 Transporters',
    family: 'Membrane Efflux & Hepatic Uptake Transporters',
    patientDescription:
      'Cellular gatekeeper proteins that control how much medication is absorbed from the intestine or pulled into liver cells.',
    clinicalNotes:
      'Biliary/intestinal ABCB1 efflux and SLCO1B1 hepatic uptake transporters govern intracellular statin, digoxin, and anticoagulant exposure.',
  },
};

export const TARGET_CATALOG: Record<string, TargetProteinDefinition> = {
  VKORC1: {
    id: 'VKORC1',
    name: 'VKORC1',
    patientName: 'Clotting Switch',
    fullName: 'Vitamin K Epoxide Reductase Complex 1',
    pathway: 'Coagulation Cascade (Factors II, VII, IX, X)',
    patientDescription:
      'The clotting control switch in the liver that warfarin dials down to prevent dangerous blood clots.',
    clinicalNotes:
      'Rate-limiting enzyme of the vitamin K cycle; inhibition prevents gamma-carboxylation of vitamin K-dependent clotting factors.',
  },
  COX1: {
    id: 'COX1',
    name: 'COX-1 / TXA2',
    patientName: 'Platelet & Stomach',
    fullName: 'Cyclooxygenase-1 & Thromboxane A2',
    pathway: 'Platelet Aggregation & Gastric Mucosal Protection',
    patientDescription:
      'A protein that makes platelets sticky to form clots and helps protect the stomach lining from acid.',
    clinicalNotes:
      'Irreversible acetylation of Ser530 in platelet COX-1 halts thromboxane A2 synthesis while reducing cytoprotective gastric prostaglandins (PGE2/PGI2).',
  },
  HMGCR: {
    id: 'HMGCR',
    name: 'HMGCR',
    patientName: 'Cholesterol Maker',
    fullName: 'HMG-CoA Reductase',
    pathway: 'Hepatic Mevalonate / Cholesterol Biosynthesis',
    patientDescription:
      'The liver enzyme that manufactures cholesterol; statins block this step to lower LDL ("bad") cholesterol.',
    clinicalNotes:
      'Competitive inhibition upregulates hepatic LDL receptors; systemic overexposure risks skeletal myocyte mevalonate depletion and myopathy.',
  },
  ACE: {
    id: 'ACE',
    name: 'ACE / Renal PG',
    patientName: 'Blood Vessel Tone',
    fullName: 'Angiotensin-Converting Enzyme',
    pathway: 'Renin-Angiotensin-Aldosterone System (RAAS)',
    patientDescription:
      'An enzyme that narrows blood vessels; blocking it relaxes vessels and lowers blood pressure.',
    clinicalNotes:
      'Inhibits conversion of Angiotensin I to II and slows bradykinin degradation; efferent arteriolar dilation relies on intact afferent prostaglandins.',
  },
  ATPASE: {
    id: 'ATPASE',
    name: 'H+/K+-ATPase',
    patientName: 'Stomach Acid Pump',
    fullName: 'Gastric Proton Pump',
    pathway: 'Parietal Cell Acid Secretion',
    patientDescription:
      'Tiny acid pumps in the stomach lining that proton pump inhibitors turn off to relieve reflux and protect against ulcers.',
    clinicalNotes:
      'Covalent disulfide binding to parietal canalicular H+/K+-ATPase suppresses basal and stimulated gastric acid secretion.',
  },
  P2Y12: {
    id: 'P2Y12',
    name: 'P2Y12 Receptor',
    patientName: 'Platelet Clump Lock',
    fullName: 'Platelet ADP P2Y12 Receptor',
    pathway: 'ADP-Mediated Platelet Activation',
    patientDescription:
      'A docking station on blood platelets that tells them to clump together after an injury or stent placement.',
    clinicalNotes:
      'Irreversible antagonism by clopidogrel active metabolite inhibits Gi-coupled ADP signaling and GPIIb/IIIa complex activation.',
  },
  ADRB1: {
    id: 'ADRB1',
    name: 'Beta-1 Adrenergic',
    patientName: 'Heart Rate Sensor',
    fullName: 'Cardiac Beta-1 Adrenergic Receptor',
    pathway: 'Sympathetic Chronotropy & Inotropy',
    patientDescription:
      'Sensors on the heart muscle that speed up heartbeat and blood pressure during stress.',
    clinicalNotes:
      'Cardioselective beta-1 blockade reduces SA node automaticity, AV conduction velocity, and myocardial oxygen demand.',
  },
  SERT: {
    id: 'SERT',
    name: 'SERT',
    patientName: 'Serotonin Carrier',
    fullName: 'Serotonin Transporter (SLC6A4)',
    pathway: 'Central Serotonergic & Platelet Uptake',
    patientDescription:
      'A protein that recycles serotonin in the brain for mood balance—and also stores serotonin inside blood platelets.',
    clinicalNotes:
      'Blocks neuronal and platelet serotonin reuptake; platelet serotonin depletion impairs secondary hemostatic aggregation.',
  },
  NA_K_ATPASE: {
    id: 'NA_K_ATPASE',
    name: 'Na+/K+-ATPase',
    patientName: 'Heart Muscle Pump',
    fullName: 'Cardiac Sodium-Potassium Pump',
    pathway: 'Myocardial Calcium Handling',
    patientDescription:
      'A pump in heart muscle cells that strengthens heart contractions when carefully regulated.',
    clinicalNotes:
      'Inhibition increases intracellular Na+, reducing NCX Ca2+ extrusion and boosting sarcoplasmic reticulum contractility with narrow therapeutic index.',
  },
};

export const DRUG_CATALOG: DrugDefinition[] = [
  {
    id: 'warfarin',
    name: 'Warfarin',
    genericClass: 'Vitamin K Antagonist Anticoagulant',
    defaultDosage: '5 mg daily',
    availableDosages: ['2 mg daily', '5 mg daily', '7.5 mg daily', '10 mg daily'],
    route: 'Oral',
    indication: 'Atrial fibrillation / DVT / PE prophylaxis',
    patientSummary:
      'A blood thinner that prevents harmful clots. Even small changes in how fast your body clears it can shift clotting time (INR).',
    clinicalPharmacology:
      'Racemic mixture: S-warfarin (3–5x potency) cleared via CYP2C9; R-warfarin cleared via CYP1A2, CYP2C19, and CYP3A4. Highly albumin-bound (~99%).',
    enzymes: [
      { enzymeId: 'CYP2C9', role: 'substrate', strength: 'strong' },
      { enzymeId: 'CYP2C19', role: 'substrate', strength: 'moderate' },
      { enzymeId: 'CYP3A4', role: 'substrate', strength: 'weak' },
    ],
    targets: ['VKORC1'],
  },
  {
    id: 'aspirin',
    name: 'Aspirin',
    genericClass: 'Antiplatelet / NSAID Salicylate',
    defaultDosage: '81 mg daily',
    availableDosages: ['81 mg daily', '325 mg daily'],
    route: 'Oral',
    indication: 'Secondary cardiovascular prevention',
    patientSummary:
      'Low-dose aspirin keeps blood platelets from sticking together, while higher doses also reduce pain and protective stomach mucus.',
    clinicalPharmacology:
      'Irreversibly acetylates platelet COX-1 for the 7–10 day platelet lifespan; reduces renal vasodilatory prostaglandins at higher or combined doses.',
    enzymes: [{ enzymeId: 'CYP2C9', role: 'substrate', strength: 'weak' }],
    targets: ['COX1'],
  },
  {
    id: 'simvastatin',
    name: 'Simvastatin',
    genericClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    defaultDosage: '40 mg nightly',
    availableDosages: ['10 mg nightly', '20 mg nightly', '40 mg nightly'],
    route: 'Oral',
    indication: 'Hyperlipidemia & ASCVD risk reduction',
    patientSummary:
      'Lowers LDL cholesterol made by your liver to protect arteries over time.',
    clinicalPharmacology:
      'Lactone prodrug hydrolyzed to active beta-hydroxyacid; extensive first-pass CYP3A4 metabolism and OATP1B1 hepatic uptake.',
    enzymes: [
      { enzymeId: 'CYP3A4', role: 'substrate', strength: 'strong' },
      { enzymeId: 'PGP', role: 'substrate', strength: 'moderate' },
    ],
    targets: ['HMGCR'],
  },
  {
    id: 'lisinopril',
    name: 'Lisinopril',
    genericClass: 'ACE Inhibitor',
    defaultDosage: '10 mg daily',
    availableDosages: ['5 mg daily', '10 mg daily', '20 mg daily', '40 mg daily'],
    route: 'Oral',
    indication: 'Hypertension & heart failure with reduced EF',
    patientSummary:
      'Relaxes blood vessels to lower blood pressure and ease workload on the heart and kidneys.',
    clinicalPharmacology:
      'Active diacid ACE inhibitor eliminated unchanged by renal excretion; not metabolized by CYP450 enzymes.',
    enzymes: [],
    targets: ['ACE'],
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole',
    genericClass: 'Proton Pump Inhibitor (PPI)',
    defaultDosage: '20 mg daily',
    availableDosages: ['20 mg daily', '40 mg daily'],
    route: 'Oral',
    indication: 'GERD & gastroprotection against GI bleeding',
    patientSummary:
      'Reduces stomach acid to treat heartburn and help shield the stomach lining from irritation.',
    clinicalPharmacology:
      'Metabolized by CYP2C19 and CYP3A4; clinically relevant time-dependent inhibitor of CYP2C19.',
    enzymes: [
      { enzymeId: 'CYP2C19', role: 'inhibitor', strength: 'strong' },
      { enzymeId: 'CYP3A4', role: 'substrate', strength: 'moderate' },
    ],
    targets: ['ATPASE'],
  },
  {
    id: 'clopidogrel',
    name: 'Clopidogrel',
    genericClass: 'P2Y12 Platelet Inhibitor',
    defaultDosage: '75 mg daily',
    availableDosages: ['75 mg daily', '300 mg loading'],
    route: 'Oral',
    indication: 'Acute coronary syndrome / coronary stent protection',
    patientSummary:
      'Prevents platelets from clumping inside blood vessels or heart stents. Needs liver activation to work properly.',
    clinicalPharmacology:
      'Thienopyridine prodrug requiring two-step CYP2C19-mediated bioactivation to inhibit platelet P2Y12 receptors.',
    enzymes: [
      { enzymeId: 'CYP2C19', role: 'substrate', strength: 'strong' },
      { enzymeId: 'CYP3A4', role: 'substrate', strength: 'moderate' },
    ],
    targets: ['P2Y12'],
  },
  {
    id: 'amiodarone',
    name: 'Amiodarone',
    genericClass: 'Class III Antiarrhythmic',
    defaultDosage: '200 mg daily',
    availableDosages: ['100 mg daily', '200 mg daily', '400 mg daily'],
    route: 'Oral',
    indication: 'Ventricular arrhythmia & atrial fibrillation rhythm control',
    patientSummary:
      'Stabilizes irregular heart rhythms. It stays in the body for weeks and slows down how the liver clears several other drugs.',
    clinicalPharmacology:
      'Broad-spectrum inhibitor of CYP2C9, CYP3A4, CYP2D6, and P-glycoprotein with a prolonged terminal half-life (25–100 days).',
    enzymes: [
      { enzymeId: 'CYP2C9', role: 'inhibitor', strength: 'strong' },
      { enzymeId: 'CYP3A4', role: 'inhibitor', strength: 'strong' },
      { enzymeId: 'CYP2D6', role: 'inhibitor', strength: 'moderate' },
      { enzymeId: 'PGP', role: 'inhibitor', strength: 'strong' },
    ],
    targets: ['ADRB1'],
  },
  {
    id: 'metoprolol',
    name: 'Metoprolol',
    genericClass: 'Beta-1 Selective Blocker',
    defaultDosage: '50 mg daily',
    availableDosages: ['25 mg daily', '50 mg daily', '100 mg daily'],
    route: 'Oral',
    indication: 'Hypertension, angina & rate control',
    patientSummary:
      'Slows a fast heart rate and reduces blood pressure so the heart pumps more efficiently.',
    clinicalPharmacology:
      'Cleared primarily (~70–80%) by CYP2D6 alpha-hydroxylation and O-demethylation; minimal renal unchanged clearance.',
    enzymes: [{ enzymeId: 'CYP2D6', role: 'substrate', strength: 'strong' }],
    targets: ['ADRB1'],
  },
  {
    id: 'fluoxetine',
    name: 'Fluoxetine',
    genericClass: 'SSRI Antidepressant',
    defaultDosage: '20 mg daily',
    availableDosages: ['10 mg daily', '20 mg daily', '40 mg daily'],
    route: 'Oral',
    indication: 'Major depressive disorder & anxiety',
    patientSummary:
      'Balances serotonin in the brain to support mood, and also affects how platelets clot and how the liver clears other drugs.',
    clinicalPharmacology:
      'Potent CYP2D6 inhibitor and moderate CYP2C19/CYP2C9 inhibitor via norfluoxetine; depletes platelet dense-granule serotonin.',
    enzymes: [
      { enzymeId: 'CYP2D6', role: 'inhibitor', strength: 'strong' },
      { enzymeId: 'CYP2C19', role: 'inhibitor', strength: 'moderate' },
      { enzymeId: 'CYP2C9', role: 'inhibitor', strength: 'moderate' },
    ],
    targets: ['SERT'],
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    genericClass: 'Non-Selective NSAID',
    defaultDosage: '400 mg PRN',
    availableDosages: ['200 mg PRN', '400 mg PRN', '600 mg TID'],
    route: 'Oral',
    indication: 'Acute musculoskeletal pain & inflammation',
    patientSummary:
      'Relieves aches and swelling, but can irritate the stomach lining and strain kidneys when combined with certain heart or blood-thinning drugs.',
    clinicalPharmacology:
      'Reversible COX-1/COX-2 inhibitor metabolized by CYP2C9; reduces renal afferent arteriolar prostaglandin vasodilation.',
    enzymes: [{ enzymeId: 'CYP2C9', role: 'substrate', strength: 'moderate' }],
    targets: ['COX1'],
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin',
    genericClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    defaultDosage: '40 mg daily',
    availableDosages: ['10 mg daily', '20 mg daily', '40 mg daily', '80 mg daily'],
    route: 'Oral',
    indication: 'High-intensity lipid lowering',
    patientSummary:
      'Reduces cholesterol production in the liver and lowers long-term heart attack and stroke risk.',
    clinicalPharmacology:
      'Active acid statin cleared by CYP3A4 and OATP1B1; lower CYP3A4 sensitivity than simvastatin.',
    enzymes: [
      { enzymeId: 'CYP3A4', role: 'substrate', strength: 'moderate' },
      { enzymeId: 'PGP', role: 'substrate', strength: 'moderate' },
    ],
    targets: ['HMGCR'],
  },
  {
    id: 'amlodipine',
    name: 'Amlodipine',
    genericClass: 'Dihydropyridine Calcium Channel Blocker',
    defaultDosage: '5 mg daily',
    availableDosages: ['2.5 mg daily', '5 mg daily', '10 mg daily'],
    route: 'Oral',
    indication: 'Hypertension & chronic stable angina',
    patientSummary:
      'Relaxes smooth muscle in artery walls to gently lower blood pressure.',
    clinicalPharmacology:
      'Extensively metabolized by CYP3A4 with weak CYP3A4 competitive affinity at higher exposures.',
    enzymes: [{ enzymeId: 'CYP3A4', role: 'substrate', strength: 'moderate' }],
    targets: ['ACE'],
  },
  {
    id: 'digoxin',
    name: 'Digoxin',
    genericClass: 'Cardiac Glycoside',
    defaultDosage: '0.125 mg daily',
    availableDosages: ['0.125 mg daily', '0.25 mg daily'],
    route: 'Oral',
    indication: 'Atrial fibrillation rate control & HFrEF',
    patientSummary:
      'Helps the heart beat stronger and steadier. Has a tight safety window between helpful and toxic levels.',
    clinicalPharmacology:
      'Minimal hepatic CYP metabolism; eliminated largely unchanged via renal glomerular filtration and P-glycoprotein secretion.',
    enzymes: [{ enzymeId: 'PGP', role: 'substrate', strength: 'strong' }],
    targets: ['NA_K_ATPASE'],
  },
  {
    id: 'metformin',
    name: 'Metformin',
    genericClass: 'Biguanide Antihyperglycemic',
    defaultDosage: '500 mg BID',
    availableDosages: ['500 mg daily', '500 mg BID', '1000 mg BID'],
    route: 'Oral',
    indication: 'Type 2 diabetes mellitus',
    patientSummary:
      'Helps the body use insulin better and lowers sugar output from the liver without causing low blood sugar on its own.',
    clinicalPharmacology:
      'Not metabolized by CYP450 enzymes; excreted unchanged via renal OCT2/MATE transporters.',
    enzymes: [],
    targets: [],
  },
];

export const INTERACTION_RECORDS: InteractionRecord[] = [
  {
    id: 'warfarin-aspirin',
    drugA: 'warfarin',
    drugB: 'aspirin',
    severity: 'major',
    provenance: 'clinical_verified',
    title: 'Dual Antithrombotic & GI Hemorrhage Risk',
    clinicalSource: 'FDA Boxed Warning / Lexicomp Clinical DDI Database',
    confidenceScore: 0.98,
    sharedMechanisms: ['Coagulation + Platelet Cascade', 'Gastric Mucosal Prostaglandin Depletion'],
    patientMode: {
      headline: 'High bleeding risk when combined without close monitoring',
      plainSummary:
        'Warfarin slows clotting proteins while aspirin stops blood platelets from sticking together and thins the stomach’s protective mucus layer. Together, they multiply the chance of serious stomach or internal bleeding.',
      symptomsToWatch: [
        'Black, tarry stools or bright red blood in stool',
        'Unexplained dark bruises, nosebleeds, or bleeding gums',
        'Pink, red, or dark brown urine',
        'Dizziness, unusual weakness, or coughing up blood',
      ],
      actionableNextSteps: [
        'Do not stop either medication abruptly if prescribed together for a heart condition or valve.',
        'Ask your doctor or pharmacist whether low-dose (81 mg) aspirin is strictly needed alongside warfarin.',
        'Confirm if a stomach protector (like a PPI) should remain part of your plan and keep all INR lab checks.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'High-dose salicylates (>1.5–3 g/day) displace warfarin from plasma albumin binding sites and competitively engage CYP2C9, transiently elevating free S-warfarin.',
      pdMechanism:
        'Synergistic pharmacodynamic antagonism of primary hemostasis (irreversible platelet COX-1 acetylation) and secondary hemostasis (VKORC1 inhibition), compounded by impaired gastric cytoprotective PGE2/PGI2 synthesis.',
      clinicalManagement:
        'Avoid routine combination unless clear indication (e.g., mechanical valve, recent ACS/PCI). Use lowest effective aspirin dose (75–81 mg/day), add gastroprotection if risk factors exist, and monitor INR closely.',
      evidenceLevel: 'Level A · Well-established clinical contraindication / major precaution',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'omeprazole-warfarin',
    drugA: 'omeprazole',
    drugB: 'warfarin',
    severity: 'moderate',
    provenance: 'clinical_verified',
    title: 'CYP2C19 Inhibition Reducing R-Warfarin Clearance',
    clinicalSource: 'DailyMed Prescribing Info / CPIC Pharmacology Reference',
    confidenceScore: 0.91,
    sharedMechanisms: ['CYP2C19 Competitive Inhibition'],
    patientMode: {
      headline: 'May mildly boost warfarin blood-thinning levels',
      plainSummary:
        'Omeprazole slows down one of the liver enzymes (CYP2C19) that helps clear part of warfarin from your body. This can nudge your INR clotting test higher over time.',
      symptomsToWatch: [
        'Easier bruising than usual',
        'Longer bleeding from minor shaving or kitchen cuts',
        'Unexpected shifts in your routine INR lab result',
      ],
      actionableNextSteps: [
        'Keep taking both as directed if omeprazole was prescribed to protect your stomach.',
        'Let your anticoagulation clinic know whenever you start or stop omeprazole (including over-the-counter).',
        'Ask your pharmacist if pantoprazole is an option if INR fluctuations occur.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Omeprazole is a potent mechanism-based and competitive inhibitor of CYP2C19, decreasing oxidative metabolism of R-warfarin (and modestly influencing S-warfarin disposition in CYP2C9*2/*3 variants).',
      pdMechanism:
        'Indirect elevation of net anticoagulant effect (prolonged PT/INR), typically modest (+10–25% INR drift) but clinically meaningful in narrow-therapeutic-index therapy.',
      clinicalManagement:
        'Monitor INR 5–7 days after initiating, changing dose, or discontinuing omeprazole. Consider pantoprazole or rabeprazole for lower CYP2C19 inhibition liability.',
      evidenceLevel: 'Level B · Moderate clinical pharmacokinetic interaction',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'lisinopril-aspirin',
    drugA: 'lisinopril',
    drugB: 'aspirin',
    severity: 'moderate',
    provenance: 'clinical_verified',
    title: 'Prostaglandin Attenuation of Antihypertensive & Renal Effect',
    clinicalSource: 'AHA/ACC Hypertension Guidelines & Renal Pharmacology',
    confidenceScore: 0.87,
    sharedMechanisms: ['Renal Prostaglandin / RAAS Hemodynamics'],
    patientMode: {
      headline: 'High-dose aspirin can blunt blood pressure control',
      plainSummary:
        'Lisinopril relaxes blood vessels partly with the help of natural kidney signals called prostaglandins. Higher doses of aspirin block those signals, making lisinopril slightly less effective and adding stress to the kidneys.',
      symptomsToWatch: [
        'Blood pressure readings creeping higher than your target',
        'Swelling in ankles or feet, or noticeably reduced urination',
        'Lightheadedness when dehydrated',
      ],
      actionableNextSteps: [
        'Low-dose aspirin (81 mg) rarely causes major issues, so check your exact dose.',
        'Avoid taking extra over-the-counter pain NSAIDs while on lisinopril without checking first.',
        'Stay hydrated and track home blood pressure readings.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'No direct CYP450 pharmacokinetic overlap; lisinopril undergoes pure renal elimination without hepatic biotransformation.',
      pdMechanism:
        'Salicylate-mediated COX inhibition lowers vasodilatory renal prostaglandins (PGE2/PGI2) and blunts bradykinin-mediated vasodilation from ACE inhibition, attenuating antihypertensive efficacy and risking efferent/afferent GFR drop.',
      clinicalManagement:
        'Dose-dependent: 81 mg/day aspirin shows minimal attenuation in most patients; >=325 mg/day requires BP monitoring and baseline/periodic serum creatinine & potassium checks.',
      evidenceLevel: 'Level B · Dose-dependent pharmacodynamic interaction',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'lisinopril-simvastatin',
    drugA: 'lisinopril',
    drugB: 'simvastatin',
    severity: 'safe',
    provenance: 'clinical_verified',
    title: 'Compatible Cardiometabolic Co-Therapy',
    clinicalSource: 'Verified Clinical Pharmacology Pathway Audit',
    confidenceScore: 0.96,
    sharedMechanisms: ['Orthogonal Clearance (Renal vs. Hepatic CYP3A4)'],
    patientMode: {
      headline: 'Safe to take together — no known harmful conflict',
      plainSummary:
        'Lisinopril leaves your body through the kidneys while simvastatin works in the liver. They use completely separate pathways and are commonly paired safely for heart protection.',
      symptomsToWatch: [
        'No combined side effects expected from taking these two together',
      ],
      actionableNextSteps: [
        'Continue taking both medications as prescribed by your care team.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Orthogonal elimination: lisinopril is excreted unchanged renally without CYP interaction; simvastatin undergoes hepatic CYP3A4 and esterase metabolism.',
      pdMechanism:
        'Complementary cardioprotective pharmacodynamics (RAAS blood pressure lowering + HMGCR LDL reduction) with no additive toxicity.',
      clinicalManagement:
        'No dose adjustment or special interaction monitoring required beyond standard individual drug labs.',
      evidenceLevel: 'Verified No Significant Interaction',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'simvastatin-warfarin',
    drugA: 'simvastatin',
    drugB: 'warfarin',
    severity: 'ai_predicted',
    provenance: 'gnn_predicted',
    title: 'GNN-Predicted Hepatic CYP3A4 / Protein-Binding Cascade',
    clinicalSource: 'Heterogeneous Biomedical GNN Link Predictor (BioKG-GNN)',
    confidenceScore: 0.86,
    sharedMechanisms: ['CYP3A4 Competitive Overlap', 'OATP1B1 / Albumin Displacement'],
    patientMode: {
      headline: 'AI-flagged possible interaction — monitor for muscle aches or bruising',
      plainSummary:
        'Our graph model noticed both medications share overlapping liver processing steps. While many people take them together safely, this combination may occasionally raise warfarin’s blood-thinning effect or simvastatin levels.',
      symptomsToWatch: [
        'Unexplained muscle soreness, tenderness, or weakness (simvastatin)',
        'New bruising or bleeding gums (warfarin)',
      ],
      actionableNextSteps: [
        'Note that this link is an AI prediction rather than a confirmed drug warning.',
        'Do not stop your cholesterol or blood thinner medication on your own.',
        'Mention muscle soreness or unexpected INR shifts at your next routine visit.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'GNN predicts sub-clinical competitive inhibition at CYP3A4 (R-warfarin + simvastatin lactone) coupled with high plasma albumin displacement (>95% bound for both active acid and warfarin), potentially yielding minor INR elevation (+8–15%) in polypharmacy.',
      pdMechanism:
        'No direct coagulation/mevalonate target overlap, though elevated free exposure in elderly patients with reduced hepatic reserve can unmask bleeding or myopathy signals.',
      clinicalManagement:
        'ALGORITHMIC PREDICTION (Not an FDA contraindication): Consider checking INR 1–2 weeks after initiating or escalating simvastatin (>=40 mg) in high-risk polypharmacy patients.',
      evidenceLevel: 'GNN Prediction (AUROC 0.91 benchmark) · Requires clinical correlation',
      gnnExplainerPaths: [
        {
          id: 'path-1',
          title: '2-Hop Shared CYP3A4 Clearance Competition',
          importanceScore: 0.54,
          hops: [
            { fromLabel: 'Simvastatin', relation: 'strong substrate', toLabel: 'CYP3A4', weight: 0.48 },
            { fromLabel: 'CYP3A4', relation: 'clears R-enantiomer', toLabel: 'Warfarin', weight: 0.34 },
          ],
          rationale:
            'High first-pass CYP3A4 occupancy by simvastatin 40 mg reduces auxiliary R-warfarin oxidative clearance.',
        },
        {
          id: 'path-2',
          title: '3-Hop Polypharmacy Metabolic Bottleneck (via Omeprazole)',
          importanceScore: 0.32,
          hops: [
            { fromLabel: 'Omeprazole', relation: 'inhibits', toLabel: 'CYP2C19', weight: 0.42 },
            { fromLabel: 'CYP2C19', relation: 'primary R-warfarin route', toLabel: 'Warfarin', weight: 0.36 },
            { fromLabel: 'Simvastatin', relation: 'competes at CYP3A4 backup', toLabel: 'CYP3A4', weight: 0.29 },
          ],
          rationale:
            'When CYP2C19 is blocked by omeprazole, warfarin relies more heavily on CYP3A4, amplifying competition with simvastatin.',
        },
      ],
    },
  },
  {
    id: 'omeprazole-aspirin',
    drugA: 'omeprazole',
    drugB: 'aspirin',
    severity: 'safe',
    provenance: 'clinical_verified',
    title: 'Intended Gastroprotective Co-Prescribing',
    clinicalSource: 'ACC/AHA Antiplatelet GI Protection Consensus',
    confidenceScore: 0.95,
    sharedMechanisms: ['Gastric pH Elevation Counteracts COX-1 Mucosal Injury'],
    patientMode: {
      headline: 'Safe and often paired intentionally to protect your stomach',
      plainSummary:
        'Aspirin can irritate the stomach lining, and omeprazole lowers stomach acid to help prevent ulcers and stomach bleeding.',
      symptomsToWatch: ['No harmful drug conflict expected'],
      actionableNextSteps: [
        'Take omeprazole 30–60 minutes before breakfast for best stomach protection.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Gastric pH elevation may minimally alter enteric-coated aspirin dissolution kinetics, without impairing cumulative platelet COX-1 acetylation.',
      pdMechanism:
        'Beneficial pharmacodynamic mitigation: H+/K+-ATPase suppression reduces ulcerogenic risk of chronic antiplatelet therapy.',
      clinicalManagement:
        'Clinically recommended combination in patients on dual antithrombotic therapy or prior GI ulcer history.',
      evidenceLevel: 'Verified Beneficial / Safe Pairing',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'clopidogrel-omeprazole',
    drugA: 'clopidogrel',
    drugB: 'omeprazole',
    severity: 'major',
    provenance: 'clinical_verified',
    title: 'CYP2C19 Bioactivation Blockade of Clopidogrel',
    clinicalSource: 'FDA Boxed Precaution / CPIC CYP2C19 Guideline',
    confidenceScore: 0.97,
    sharedMechanisms: ['CYP2C19 Prodrug Activation Blockade'],
    patientMode: {
      headline: 'Omeprazole can stop clopidogrel from protecting your arteries',
      plainSummary:
        'Clopidogrel needs a specific liver enzyme (CYP2C19) to switch "on" and prevent blood clots. Omeprazole blocks that switch, which can leave you less protected against heart clots or stent blockage.',
      symptomsToWatch: [
        'Chest pain, tightness, or shortness of breath (seek emergency care)',
        'Sudden numbness or trouble speaking',
      ],
      actionableNextSteps: [
        'Ask your cardiologist or pharmacist about switching omeprazole to pantoprazole or famotidine.',
        'Do not stop clopidogrel without speaking to your heart specialist.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Omeprazole strongly inhibits CYP2C19, blocking two-step oxidative conversion of clopidogrel prodrug into its active thiol metabolite (reducing active AUC by ~40–45%).',
      pdMechanism:
        'Markedly attenuated P2Y12 receptor blockade and higher on-treatment platelet reactivity (HTPR), increasing MACE / stent thrombosis risk.',
      clinicalManagement:
        'Avoid concomitant omeprazole/esomeprazole. Substitute with pantoprazole (minimal CYP2C19 inhibition) or an H2RA (famotidine).',
      evidenceLevel: 'Level A · FDA Drug Safety Communication',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'warfarin-amiodarone',
    drugA: 'warfarin',
    drugB: 'amiodarone',
    severity: 'major',
    provenance: 'clinical_verified',
    title: 'Potent Multi-CYP Inhibition Causing Supratherapeutic INR',
    clinicalSource: 'FDA Labeling / ACC Anticoagulation Guidance',
    confidenceScore: 0.99,
    sharedMechanisms: ['CYP2C9 & CYP3A4 Potent Inhibition'],
    patientMode: {
      headline: 'Dramatically increases warfarin strength — high bleeding danger',
      plainSummary:
        'Amiodarone strongly slows down the liver enzymes that clear warfarin. Without lowering the warfarin dose, blood-thinning levels can rise sharply over several weeks.',
      symptomsToWatch: [
        'Severe bruising, prolonged nosebleeds, or bleeding gums',
        'Dark red/black stools or pink urine',
      ],
      actionableNextSteps: [
        'Confirm your doctor has pre-emptively adjusted your warfarin dose (often reduced by 25–50%).',
        'Schedule weekly INR checks during the first 1–2 months of starting amiodarone.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Amiodarone and desethylamiodarone potently inhibit both CYP2C9 (S-warfarin clearance) and CYP3A4/CYP1A2 (R-warfarin), increasing warfarin plasma concentration by 35–100%.',
      pdMechanism:
        'Delayed onset (1–4 weeks) and prolonged offset (months) due to amiodarone tissue accumulation (t1/2 ~50 days).',
      clinicalManagement:
        'Empirically reduce warfarin dose by 30–50% upon starting amiodarone and monitor INR weekly until steady state.',
      evidenceLevel: 'Level A · Contraindicated without preemptive dose reduction',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'amiodarone-simvastatin',
    drugA: 'amiodarone',
    drugB: 'simvastatin',
    severity: 'major',
    provenance: 'clinical_verified',
    title: 'CYP3A4 Inhibition Risking Rhabdomyolysis (>20 mg Dose Limit)',
    clinicalSource: 'FDA Simvastatin Dose Restriction Warning',
    confidenceScore: 0.97,
    sharedMechanisms: ['CYP3A4 & P-gp / OATP1B1 Inhibition'],
    patientMode: {
      headline: 'Increases risk of severe muscle breakdown with higher simvastatin doses',
      plainSummary:
        'Amiodarone slows down the enzyme that clears simvastatin. When simvastatin builds up in the bloodstream, it can cause painful muscle damage.',
      symptomsToWatch: [
        'Deep muscle pain, tenderness, or weakness in thighs, calves, or shoulders',
        'Dark, tea-colored urine',
      ],
      actionableNextSteps: [
        'Check your simvastatin dose: FDA guidance caps simvastatin at 20 mg daily with amiodarone.',
        'Ask your doctor about switching to pravastatin or rosuvastatin, which avoid this enzyme pathway.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Strong CYP3A4 and OATP1B1 inhibition by amiodarone elevates simvastatin acid AUC ~1.75-fold.',
      pdMechanism:
        'Excess skeletal myocyte HMGCR blockade impairs ubiquinone/isoprenoid synthesis, precipitating statin-induced myopathy or rhabdomyolysis.',
      clinicalManagement:
        'Do not exceed simvastatin 20 mg/day when co-administered with amiodarone, or switch to a non-CYP3A4 statin (rosuvastatin, pravastatin).',
      evidenceLevel: 'Level A · FDA Quantitative Dose Cap',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'amiodarone-digoxin',
    drugA: 'amiodarone',
    drugB: 'digoxin',
    severity: 'major',
    provenance: 'clinical_verified',
    title: 'P-gp Efflux Inhibition Elevating Digoxin Toxicity Risk',
    clinicalSource: 'FDA Digoxin Labeling / Heart Rhythm Society',
    confidenceScore: 0.96,
    sharedMechanisms: ['P-glycoprotein Renal & Intestinal Efflux Inhibition'],
    patientMode: {
      headline: 'Can double digoxin levels and cause heart rhythm or vision symptoms',
      plainSummary:
        'Amiodarone blocks the transporter pump that clears digoxin out through your kidneys and gut, causing digoxin to build up.',
      symptomsToWatch: [
        'Nausea, loss of appetite, or upset stomach',
        'Yellow-green halos around lights or blurred vision',
        'Very slow or fluttering heartbeat',
      ],
      actionableNextSteps: [
        'Ask your prescriber if your digoxin dose needs to be cut in half.',
        'Have a blood digoxin level checked within 1–2 weeks of combining these drugs.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Amiodarone inhibits renal tubular and intestinal P-glycoprotein (ABCB1) efflux, reducing digoxin clearance by ~50% and doubling serum concentration.',
      pdMechanism:
        'Additive AV nodal conduction slowing (antiarrhythmic + vagotonic Na+/K+-ATPase effects) increases risk of bradyarrhythmia and digitalis toxicity.',
      clinicalManagement:
        'Reduce digoxin dose by 50% empirically when initiating amiodarone and monitor serum digoxin levels (target 0.5–0.9 ng/mL in HF).',
      evidenceLevel: 'Level A · Mandatory Dose Reduction',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'fluoxetine-metoprolol',
    drugA: 'fluoxetine',
    drugB: 'metoprolol',
    severity: 'moderate',
    provenance: 'clinical_verified',
    title: 'CYP2D6 Phenoconversion Elevating Beta-Blocker Exposure',
    clinicalSource: 'CPIC CYP2D6 Beta-Blocker Pharmacogenomics',
    confidenceScore: 0.92,
    sharedMechanisms: ['CYP2D6 Strong Competitive Inhibition'],
    patientMode: {
      headline: 'May make metoprolol feel stronger, slowing heart rate or causing fatigue',
      plainSummary:
        'Fluoxetine shuts down the CYP2D6 liver enzyme that clears metoprolol. That means metoprolol stays in your system longer and can lower your pulse or blood pressure more than expected.',
      symptomsToWatch: [
        'Unusually slow pulse, dizziness when standing up, or heavy tiredness',
        'Cold hands/feet or shortness of breath during light activity',
      ],
      actionableNextSteps: [
        'Check your heart rate if you feel dizzy or extra fatigued.',
        'Ask your pharmacist or doctor if your metoprolol dose should be adjusted or switched to bisoprolol/carvedilol.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Fluoxetine and norfluoxetine are potent CYP2D6 inhibitors, increasing metoprolol AUC 3- to 4-fold by converting normal metabolizers into functional poor metabolizers.',
      pdMechanism:
        'Excess beta-1 adrenergic blockade leading to symptomatic bradycardia, hypotension, or fatigue.',
      clinicalManagement:
        'Monitor heart rate and blood pressure; reduce metoprolol dose or switch SSRI (e.g., sertraline/citalopram) or beta-blocker (bisoprolol).',
      evidenceLevel: 'Level B · Clinically Significant PK Phenoconversion',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'fluoxetine-warfarin',
    drugA: 'fluoxetine',
    drugB: 'warfarin',
    severity: 'moderate',
    provenance: 'clinical_verified',
    title: 'CYP2C9/2C19 Inhibition + Platelet Serotonin Depletion',
    clinicalSource: 'Clinical Pharmacology / Anticoagulation Consensus',
    confidenceScore: 0.89,
    sharedMechanisms: ['CYP2C9/2C19 Inhibition', 'Platelet SERT Depletion'],
    patientMode: {
      headline: 'Combined blood-thinning effect increases bruising and bleeding risk',
      plainSummary:
        'Fluoxetine slows warfarin breakdown slightly and also lowers serotonin in blood platelets, which platelets need to form plugs.',
      symptomsToWatch: [
        'Easy bruising, nosebleeds, or dark stools',
        'Changes in INR lab results after starting fluoxetine',
      ],
      actionableNextSteps: [
        'Notify your anticoagulation clinic when starting or changing antidepressant doses.',
        'Watch for signs of stomach irritation if you also take pain relievers.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Norfluoxetine moderately inhibits CYP2C9 and CYP2C19, slowing clearance of both S- and R-warfarin.',
      pdMechanism:
        'Platelet SERT blockade depletes intraplatelet serotonin stores, impairing secondary hemostasis synergistically with VKORC1 inhibition.',
      clinicalManagement:
        'Monitor INR closely for 2–4 weeks after starting/stopping fluoxetine; consider sertraline for lower CYP2C9 impact.',
      evidenceLevel: 'Level B · Dual PK/PD Bleeding Precaution',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'fluoxetine-ibuprofen',
    drugA: 'fluoxetine',
    drugB: 'ibuprofen',
    severity: 'moderate',
    provenance: 'clinical_verified',
    title: 'Synergistic Upper GI Bleeding Risk (SSRI + NSAID)',
    clinicalSource: 'Gastroenterology & Psychiatry Safety Guidelines',
    confidenceScore: 0.90,
    sharedMechanisms: ['Platelet SERT Depletion + COX-1 Mucosal Erosion'],
    patientMode: {
      headline: 'Taking ibuprofen regularly with fluoxetine raises stomach bleeding risk',
      plainSummary:
        'Ibuprofen wears down the stomach’s protective barrier while fluoxetine makes platelets less effective at sealing tiny stomach scrapes.',
      symptomsToWatch: [
        'Burning stomach pain or heartburn that worsens',
        'Dark, tarry stools or feeling unusually faint',
      ],
      actionableNextSteps: [
        'Use acetaminophen for routine aches if approved by your doctor.',
        'If ibuprofen is needed short-term, take with food and ask about stomach protection.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Minor CYP2C9 competition; primary interaction is pharmacodynamic rather than metabolic.',
      pdMechanism:
        'Multiplicative risk of upper GI hemorrhage (OR ~4–9x vs baseline) due to impaired platelet serotonin-mediated hemostasis combined with COX-1 mucosal prostaglandin depletion.',
      clinicalManagement:
        'Avoid chronic NSAID co-administration with SSRIs; substitute acetaminophen or add PPI gastroprotection when NSAID therapy is unavoidable.',
      evidenceLevel: 'Level B · Established Epidemiologic & PD Risk',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'warfarin-ibuprofen',
    drugA: 'warfarin',
    drugB: 'ibuprofen',
    severity: 'major',
    provenance: 'clinical_verified',
    title: 'Severe GI & Systemic Bleeding + CYP2C9 Competition',
    clinicalSource: 'FDA NSAID + Anticoagulant Warning',
    confidenceScore: 0.98,
    sharedMechanisms: ['COX-1 + VKORC1 Hemorrhage Synergy', 'CYP2C9 Competitive Overlap'],
    patientMode: {
      headline: 'Avoid ibuprofen while taking warfarin unless directed by your doctor',
      plainSummary:
        'Ibuprofen irritates the stomach lining and blocks platelets, while warfarin prevents clots from sealing any bleeding. Together they sharply raise the danger of serious stomach bleeding.',
      symptomsToWatch: [
        'Stomach pain, black stools, or vomiting blood/coffee-ground material',
        'Heavy bruising or unexplained bleeding',
      ],
      actionableNextSteps: [
        'Do not take over-the-counter ibuprofen (Advil/Motrin) or naproxen with warfarin.',
        'Ask your pharmacist about safer pain options such as acetaminophen.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Both S-warfarin and ibuprofen are CYP2C9 substrates and >99% albumin bound, creating competitive clearance delay and transient free warfarin spikes.',
      pdMechanism:
        'COX-1 mucosal injury and platelet inhibition paired with anticoagulation yields a ~3- to 6-fold increase in major GI bleeding.',
      clinicalManagement:
        'Avoid concomitant systemic NSAIDs. Use acetaminophen (monitor INR if >2 g/day chronically) or topical therapies.',
      evidenceLevel: 'Level A · Avoid Combination',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'atorvastatin-amlodipine',
    drugA: 'atorvastatin',
    drugB: 'amlodipine',
    severity: 'safe',
    provenance: 'clinical_verified',
    title: 'Co-Formulated Cardiovascular Standard Pairing',
    clinicalSource: 'FDA Approved Fixed-Dose Combination (Caduet)',
    confidenceScore: 0.97,
    sharedMechanisms: ['Minimal CYP3A4 Competition (<18% AUC shift)'],
    patientMode: {
      headline: 'Safe to take together for blood pressure and cholesterol',
      plainSummary:
        'Amlodipine and atorvastatin are routinely prescribed together—and even combined into a single pill—to protect blood vessels.',
      symptomsToWatch: ['No clinically harmful interaction expected'],
      actionableNextSteps: ['Continue taking both as scheduled.'],
    },
    clinicalMode: {
      pkMechanism:
        'Although both undergo CYP3A4 metabolism, amlodipine produces only a minor (~15–18%) non-significant increase in atorvastatin AUC.',
      pdMechanism:
        'Additive endothelial and ASCVD risk-reduction benefits without cumulative adverse effects.',
      clinicalManagement: 'No dose restriction required (unlike simvastatin >20 mg with amlodipine).',
      evidenceLevel: 'Verified Safe / Fixed-Dose Combination Available',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'simvastatin-amlodipine',
    drugA: 'simvastatin',
    drugB: 'amlodipine',
    severity: 'moderate',
    provenance: 'clinical_verified',
    title: 'CYP3A4 Competition Requiring Simvastatin 20 mg Cap',
    clinicalSource: 'FDA Drug Safety Communication (Simvastatin + Amlodipine)',
    confidenceScore: 0.95,
    sharedMechanisms: ['CYP3A4 Shared Substrate Competition'],
    patientMode: {
      headline: 'Limit simvastatin to 20 mg daily when paired with amlodipine',
      plainSummary:
        'Both medications share the CYP3A4 liver pathway. Higher doses of simvastatin (40 mg or more) can build up and cause muscle soreness.',
      symptomsToWatch: ['New or unusual muscle aches, cramps, or weakness'],
      actionableNextSteps: [
        'Check if your simvastatin dose is above 20 mg daily; ask your prescriber about lowering it or switching statins.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'Amlodipine competitively inhibits intestinal/hepatic CYP3A4, increasing simvastatin acid AUC by ~1.5- to 1.8-fold.',
      pdMechanism:
        'Dose-dependent skeletal myopathy and rhabdomyolysis risk at simvastatin doses >=40 mg.',
      clinicalManagement:
        'FDA limits simvastatin to 20 mg/day with amlodipine, or switch to atorvastatin/rosuvastatin.',
      evidenceLevel: 'Level A · FDA Dose Limitation',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'metformin-lisinopril',
    drugA: 'metformin',
    drugB: 'lisinopril',
    severity: 'safe',
    provenance: 'clinical_verified',
    title: 'Renally Complementary Diabetes + Hypertension Therapy',
    clinicalSource: 'ADA Standards of Care in Diabetes',
    confidenceScore: 0.97,
    sharedMechanisms: ['Independent Renal Clearance Pathways'],
    patientMode: {
      headline: 'Safe and commonly paired to protect kidneys and blood sugar',
      plainSummary:
        'Metformin and lisinopril do not interfere with each other and are often prescribed together in diabetes care.',
      symptomsToWatch: ['No interaction expected'],
      actionableNextSteps: ['Keep up with routine annual kidney function blood work as advised.'],
    },
    clinicalMode: {
      pkMechanism:
        'No CYP or shared transporter conflict (metformin uses OCT2/MATE; lisinopril undergoes passive glomerular filtration).',
      pdMechanism:
        'Complementary microvascular protection; monitor eGFR periodically as standard of care.',
      clinicalManagement: 'Safe to co-administer.',
      evidenceLevel: 'Verified Safe',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'clopidogrel-atorvastatin',
    drugA: 'clopidogrel',
    drugB: 'atorvastatin',
    severity: 'ai_predicted',
    provenance: 'gnn_predicted',
    title: 'GNN-Predicted CYP3A4 / Esterase Bioactivation Attenuation Signal',
    clinicalSource: 'Heterogeneous Biomedical GNN Link Predictor (BioKG-GNN)',
    confidenceScore: 0.78,
    sharedMechanisms: ['CYP3A4 Shared Oxidative Step', 'Carboxylesterase Competition'],
    patientMode: {
      headline: 'Low-to-moderate AI signal — commonly used together safely in clinics',
      plainSummary:
        'Our graph model highlighted a shared liver processing enzyme (CYP3A4), though large clinical trials show doctors routinely prescribe atorvastatin and clopidogrel together safely.',
      symptomsToWatch: ['Follow standard heart precautions; no special extra symptoms expected'],
      actionableNextSteps: [
        'Continue both medications as prescribed by your cardiologist.',
      ],
    },
    clinicalMode: {
      pkMechanism:
        'GNN detects structural overlap at CYP3A4 (secondary clopidogrel activation pathway alongside primary CYP2C19). Early ex-vivo platelet assays suggested competitive interference, though randomized trials (CREDO/CHARISMA) showed neutral clinical outcomes.',
      pdMechanism:
        'Minor theoretical attenuation only relevant in CYP2C19 intermediate metabolizers where CYP3A4 carries greater compensatory activation burden.',
      clinicalManagement:
        'ALGORITHMIC PREDICTION: Clinically acceptable combination; avoid unnecessary statin discontinuation. Note interaction only if patient has known CYP2C19 loss-of-function alleles.',
      evidenceLevel: 'GNN Prediction (Theoretical PK Overlap; Neutral RCT Evidence)',
      gnnExplainerPaths: [
        {
          id: 'clop-ator-1',
          title: '2-Hop CYP3A4 Secondary Activation Competition',
          importanceScore: 0.61,
          hops: [
            { fromLabel: 'Atorvastatin', relation: 'substrate', toLabel: 'CYP3A4', weight: 0.52 },
            { fromLabel: 'CYP3A4', relation: 'secondary oxidation', toLabel: 'Clopidogrel', weight: 0.41 },
          ],
          rationale:
            'High-dose atorvastatin (40–80 mg) shares CYP3A4 catalytic binding with clopidogrel’s auxiliary oxidative step.',
        },
      ],
    },
  },
  {
    id: 'metoprolol-omeprazole',
    drugA: 'metoprolol',
    drugB: 'omeprazole',
    severity: 'safe',
    provenance: 'clinical_verified',
    title: 'Minimal Clinical Overlap (CYP2D6 vs. CYP2C19)',
    clinicalSource: 'Verified Clinical Pharmacology Pathway Audit',
    confidenceScore: 0.94,
    sharedMechanisms: ['Distinct Primary CYP Isoforms'],
    patientMode: {
      headline: 'Safe to take together',
      plainSummary:
        'Metoprolol and omeprazole are cleared by different liver enzymes and do not meaningfully interfere with each other.',
      symptomsToWatch: ['No combined side effects expected'],
      actionableNextSteps: ['Take each medication on its normal daily schedule.'],
    },
    clinicalMode: {
      pkMechanism:
        'Metoprolol relies predominantly on CYP2D6; omeprazole inhibits CYP2C19 with negligible affinity for CYP2D6.',
      pdMechanism: 'No hemodynamic or gastric antagonism.',
      clinicalManagement: 'No dose adjustment needed.',
      evidenceLevel: 'Verified Safe',
      gnnExplainerPaths: [],
    },
  },
  {
    id: 'ibuprofen-metoprolol',
    drugA: 'ibuprofen',
    drugB: 'metoprolol',
    severity: 'ai_predicted',
    provenance: 'gnn_predicted',
    title: 'GNN-Predicted Prostaglandin Antagonism of Beta-Blocker BP Effect',
    clinicalSource: 'Heterogeneous Biomedical GNN Link Predictor (BioKG-GNN)',
    confidenceScore: 0.81,
    sharedMechanisms: ['Renal Prostaglandin Vasodilation Blockade', 'Sodium/Water Retention'],
    patientMode: {
      headline: 'AI-predicted blood pressure bump if ibuprofen is taken daily',
      plainSummary:
        'Frequent ibuprofen can cause your body to hold onto salt and water, slightly pushing blood pressure up and working against metoprolol.',
      symptomsToWatch: ['Mildly higher home blood pressure readings during multi-day ibuprofen use'],
      actionableNextSteps: [
        'Short-term single doses are usually fine; check blood pressure if using ibuprofen for more than a few days.',
      ],
    },
    clinicalMode: {
      pkMechanism: 'No CYP450 overlap (ibuprofen: CYP2C9; metoprolol: CYP2D6).',
      pdMechanism:
        'GNN infers indirect hemodynamic antagonism via COX-1/COX-2 inhibition reducing renal vasodilatory prostaglandins and increasing systemic vascular resistance.',
      clinicalManagement:
        'ALGORITHMIC PREDICTION: Monitor blood pressure during chronic (>5–7 days) NSAID use.',
      evidenceLevel: 'GNN Prediction (Physiologic Network Inference)',
      gnnExplainerPaths: [
        {
          id: 'ibu-met-1',
          title: '2-Hop COX-1 Hemodynamic Counter-Regulation',
          importanceScore: 0.58,
          hops: [
            { fromLabel: 'Ibuprofen', relation: 'inhibits renal', toLabel: 'COX-1 / TXA2', weight: 0.49 },
            { fromLabel: 'COX-1 / TXA2', relation: 'opposes BP lowering', toLabel: 'Metoprolol', weight: 0.37 },
          ],
          rationale:
            'Renal prostaglandin inhibition promotes sodium retention, blunting antihypertensive response to beta-1 blockade.',
        },
      ],
    },
  },
  {
    id: 'warfarin-metformin',
    drugA: 'warfarin',
    drugB: 'metformin',
    severity: 'safe',
    provenance: 'clinical_verified',
    title: 'No Significant Pharmacokinetic Overlap',
    clinicalSource: 'Verified Clinical Pharmacology Pathway Audit',
    confidenceScore: 0.95,
    sharedMechanisms: ['Separate Hepatic vs. Renal Elimination'],
    patientMode: {
      headline: 'Safe to take together',
      plainSummary:
        'Metformin does not go through the liver enzymes that process warfarin, so they generally work smoothly side by side.',
      symptomsToWatch: ['No special interaction symptoms expected'],
      actionableNextSteps: ['Continue routine blood sugar and INR monitoring.'],
    },
    clinicalMode: {
      pkMechanism: 'Metformin lacks CYP450 metabolism and plasma protein binding (<5%).',
      pdMechanism: 'No hemostatic interference.',
      clinicalManagement: 'Routine care.',
      evidenceLevel: 'Verified Safe',
      gnnExplainerPaths: [],
    },
  },
];

export const CLINICAL_PRESETS: ClinicalPreset[] = [
  {
    id: 'cardio-polypharmacy',
    label: 'Cardiovascular Polypharmacy',
    shortTitle: 'Cardiovascular Case',
    description:
      '5-drug cardiometabolic regimen illustrating Major GI/bleeding risk, CYP2C19 competition, Safe orthogonal co-therapy, and a GNN-predicted CYP3A4 cascade.',
    medications: [
      { drugId: 'warfarin', dosage: '5 mg daily' },
      { drugId: 'aspirin', dosage: '81 mg daily' },
      { drugId: 'simvastatin', dosage: '40 mg nightly' },
      { drugId: 'lisinopril', dosage: '10 mg daily' },
      { drugId: 'omeprazole', dosage: '20 mg daily' },
    ],
  },
  {
    id: 'antiplatelet-ppi',
    label: 'Coronary Stent & Reflux',
    shortTitle: 'Stent & PPI Case',
    description:
      'Demonstrates FDA CYP2C19 bioactivation blockade between clopidogrel and omeprazole alongside a GNN-predicted atorvastatin signal.',
    medications: [
      { drugId: 'clopidogrel', dosage: '75 mg daily' },
      { drugId: 'omeprazole', dosage: '20 mg daily' },
      { drugId: 'atorvastatin', dosage: '40 mg daily' },
      { drugId: 'metoprolol', dosage: '50 mg daily' },
    ],
  },
  {
    id: 'mood-pain-cascade',
    label: 'SSRI, Pain & Anticoagulant',
    shortTitle: 'SSRI & Pain Case',
    description:
      'Highlights CYP2D6 phenoconversion (fluoxetine + metoprolol), platelet serotonin depletion bleeding synergy, and GNN hemodynamic inference.',
    medications: [
      { drugId: 'fluoxetine', dosage: '20 mg daily' },
      { drugId: 'metoprolol', dosage: '50 mg daily' },
      { drugId: 'ibuprofen', dosage: '400 mg PRN' },
      { drugId: 'warfarin', dosage: '5 mg daily' },
    ],
  },
];
