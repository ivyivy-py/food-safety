/**
 * NutriSafe ToxiScan Comprehensive Food Additive & Ingredient Database
 * Covers Codex Alimentarius, EFSA OpenFoodTox, US FDA 21 CFR, and Israeli MoH
 */

export const INGREDIENT_CATEGORIES = {
  COLORS: "Food Coloring (Natural & Synthetic)",
  PRESERVATIVES: "Antimicrobial Preservatives & Shelf-Life Extenders",
  ANTIOXIDANTS: "Antioxidants & Acidity Regulators",
  EMULSIFIERS: "Emulsifiers, Stabilizers, Thickeners & Gelling Agents",
  MINERAL_SALTS: "Mineral Salts, Leavening & Anti-Caking Agents",
  FLAVOR_ENHANCERS: "Flavor Enhancers & Savory Umami Agents",
  SWEETENERS: "Intense Sweeteners, Glazing Agents & Polyols",
  COMMERCIAL: "Key Industrial Packaged Ingredients & Derivatives"
};

// Essential Curated Additives with authoritative toxicology parameters
export const CURATED_ADDITIVES = [
  // Preservatives
  {
    ins: "E200",
    name: "Sorbic Acid",
    chemicalName: "2,4-Hexadienoic Acid",
    formula: "C6H8O2",
    cas: "110-44-1",
    einecs: "203-768-7",
    functionalClass: "Antimicrobial Preservative, Antifungal Agent in Bakery, Cheeses & Beverages.",
    safetyScore: 88,
    riskLevel: "LOW RISK",
    riskTitle: "Assay Risk: Low (High Safety Margin)",
    riskSubtitle: "EFSA Re-evaluated 2019 · JECFA Permitted",
    alertHeadline: "Standard Antimicrobial Preservative",
    alertBadge: "EFSA Cleared (2019)",
    alertDescription: "Naturally occurring in rowanberries. Highly effective against molds and yeasts with minimal mammalian toxicity.",
    adi: { range: "0 - 11", unit: "mg/kg bw/day", fillPercent: 88, note: "Re-evaluated group ADI with sorbates." },
    carcinogenicity: { hazard: "Group 3", tag: "(Not Carcinogenic)", fillPercent: 12, note: "Negative in multigenerational oncogenicity bioassays." },
    maxIngoing: { value: "1000 - 2000", unit: "mg/kg", fillPercent: 35, note: "Permitted in pre-packed sliced breads, wines, and cheeses." },
    pediatricRisk: { value: "Minimal", sub: "Rare Contact Urticaria", fillPercent: 15, note: "Occasional mild pseudo-allergic skin rash in sensitive children." },
    dietary: {
      halal: { certified: true, note: "Synthetic or botanical derivation", badge: "Halal" },
      kosher: { certified: true, note: "Synthetic organic acid", badge: "Pareve" },
      vegan: { certified: true, note: "Non-animal source", badge: "Vegan" },
      glutenFree: { certified: true, note: "<5 ppm gliadin", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Standard preservative usage does not trigger Israeli front-of-pack red warning labels."
    },
    pesticideResidues: [
      { compound: "Chlorpyrifos", cas: "2921-88-2", group: "Organophosphate", detected: "0.002 mg/kg", detectedNum: 0.002, euMrl: "0.010 mg/kg", usEpa: "0.050 mg/kg", israelMrl: "0.010 mg/kg", verdict: "Within Margin", isViolation: false }
    ],
    pesticideGauge: { compound: "Chlorpyrifos", detected: 0.002, euLimit: 0.010, usLimit: 0.050, maxScale: 0.060, alert: "Within demo limits", notice: "Within EU & Israeli PPIS standards." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008", status: "Authorized", statusColor: "#006c49", adi: "0-11 mg/kg bw", description: "Re-evaluated with group ADI (sorbic acid + potassium sorbate)." },
      { agency: "US FDA (United States)", reg: "21 CFR 182.3089", status: "GRAS", statusColor: "#006c49", adi: "GMP", description: "Generally Recognized As Safe for direct human food use." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius CXS 192-1995", status: "Allocated", statusColor: "#006c49", adi: "0-25 mg/kg bw", description: "Confirmed wide safety threshold." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved", statusColor: "#006c49", adi: "0-11 mg/kg bw", description: "Full authorization in standard bakery and beverage products." }
    ]
  },
  {
    ins: "E202",
    name: "Potassium Sorbate",
    chemicalName: "Potassium (2E,4E)-hexa-2,4-dienoate",
    formula: "C6H7KO2",
    cas: "24634-61-5",
    einecs: "246-376-1",
    functionalClass: "Antimicrobial Preservative, Water-Soluble Yeast & Mold Inhibitor.",
    safetyScore: 86,
    riskLevel: "LOW RISK",
    riskTitle: "Assay Risk: Low (Broad Industrial Use)",
    riskSubtitle: "EFSA 2019 Re-evaluation · Widely Permitted",
    alertHeadline: "Common Water-Soluble Preservative",
    alertBadge: "EFSA/FDA Cleared",
    alertDescription: "The potassium salt of sorbic acid. Highly soluble and used universally in yogurts, fruit syrups, baked goods, and dressings.",
    adi: { range: "0 - 11", unit: "mg/kg bw/day", fillPercent: 86, note: "Expressed as sorbic acid equivalent." },
    carcinogenicity: { hazard: "Group 3", tag: "(Not Carcinogenic)", fillPercent: 14, note: "No mutagenic or carcinogenic potential in vivo." },
    maxIngoing: { value: "1000 - 2500", unit: "mg/kg", fillPercent: 40, note: "Widely allowed across retail dairy and beverages." },
    pediatricRisk: { value: "Minimal", sub: "Safe in Moderation", fillPercent: 14, note: "Rapidly metabolized into water and carbon dioxide via fatty acid beta-oxidation." },
    dietary: {
      halal: { certified: true, note: "Mineral potassium salt of organic sorbate", badge: "Halal" },
      kosher: { certified: true, note: "Pareve certified chemical synthesis", badge: "Pareve" },
      vegan: { certified: true, note: "Synthetic source, no animal components", badge: "Vegan" },
      glutenFree: { certified: true, note: "Grain-free mineral salt", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "No red label warnings triggered under standard usage levels."
    },
    pesticideResidues: [
      { compound: "Glyphosate", cas: "1071-83-6", group: "Phosphonoglycine", detected: "0.010 mg/kg", detectedNum: 0.010, euMrl: "0.100 mg/kg", usEpa: "5.000 mg/kg", israelMrl: "0.100 mg/kg", verdict: "Within Margin", isViolation: false }
    ],
    pesticideGauge: { compound: "Glyphosate", detected: 0.010, euLimit: 0.100, usLimit: 5.000, maxScale: 0.200, alert: "Within demo limits", notice: "Well within statutory limits." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008", status: "Authorized", statusColor: "#006c49", adi: "0-11 mg/kg bw", description: "Authorized food additive in EU Category 01 to 14." },
      { agency: "US FDA (United States)", reg: "21 CFR 182.3640", status: "GRAS", statusColor: "#006c49", adi: "GMP", description: "Affirmed as GRAS for multi-category food preservation." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex CXS 192-1995", status: "Allocated", statusColor: "#006c49", adi: "0-25 mg/kg bw", description: "Safe margin verified by Joint Expert Committee." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved", statusColor: "#006c49", adi: "0-11 mg/kg bw", description: "Authorized food preservative across processed food categories." }
    ]
  },
  {
    ins: "E220",
    name: "Sulphur Dioxide",
    chemicalName: "Sulfur Dioxide",
    formula: "SO2",
    cas: "7446-09-5",
    einecs: "231-195-2",
    functionalClass: "Antimicrobial & Antioxidant Preservative, Bleaching Agent, Wine Preservative.",
    safetyScore: 54,
    riskLevel: "ALLERGEN / MODERATE RISK",
    riskTitle: "Assay Risk: Allergen (Sulfites >10 mg/kg)",
    riskSubtitle: "Severe Bronchospasm in Asthmatics · Mandatory Declaration",
    alertHeadline: "Major Allergen & Respiratory Sensitizer",
    alertBadge: "Mandatory Allergen Warning",
    alertDescription: "Sulfites inhibit polyphenol oxidase and bacterial spoilage in wines and dried fruits. Triggers acute bronchospasm and anaphylactoid shock in 5-10% of adult asthmatics.",
    adi: { range: "0 - 0.7", unit: "mg/kg bw/day", fillPercent: 54, note: "EFSA 2022 re-evaluation lowered group ADI." },
    carcinogenicity: { hazard: "Group 3", tag: "(Non-Carcinogenic / Cytotoxic in Excess)", fillPercent: 46, note: "Thiamine (Vitamin B1) destruction in fortified matrices." },
    maxIngoing: { value: "10 - 2000", unit: "mg/kg", fillPercent: 70, note: "Maximum 150-200 mg/L in wines; up to 2000 mg/kg in dried apricots." },
    pediatricRisk: { value: "Asthma Alert", sub: "Severe Bronchospasm", fillPercent: 65, note: "High sensitivity risk in asthmatic children." },
    dietary: {
      halal: { certified: true, note: "Inorganic gas synthesis", badge: "Halal" },
      kosher: { certified: true, note: "Pareve chemical compound", badge: "Pareve" },
      vegan: { certified: true, note: "Mineral sulfur combustion", badge: "Vegan" },
      glutenFree: { certified: true, note: "Allergen free of gluten, but triggers sulfite allergy", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Concentrations >10 mg/kg require mandatory allergen declaration: 'Contains Sulfites / מכיל גופרית'."
    },
    pesticideResidues: [
      { compound: "Chlorpyrifos", cas: "2921-88-2", group: "Organophosphate", detected: "0.003 mg/kg", detectedNum: 0.003, euMrl: "0.010 mg/kg", usEpa: "0.050 mg/kg", israelMrl: "0.010 mg/kg", verdict: "Within Margin", isViolation: false }
    ],
    pesticideGauge: { compound: "Chlorpyrifos", detected: 0.003, euLimit: 0.010, usLimit: 0.050, maxScale: 0.060, alert: "Within demo limits", notice: "Within standard limits." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008 & 1169/2011", status: "Allergen Regulated", statusColor: "#ff9800", adi: "0-0.7 mg/kg bw", description: "Mandatory allergen labeling when exceeding 10 mg/kg or 10 mg/L." },
      { agency: "US FDA (United States)", reg: "21 CFR 101.100 & 182.3862", status: "Allergen Regulated", statusColor: "#ff9800", adi: "0.7 mg/kg bw", description: "Banned on raw fruits/vegetables; mandatory labeling elsewhere." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius", status: "Allocated", statusColor: "#006c49", adi: "0-0.7 mg/kg bw", description: "Re-evaluated 2021 by JECFA with established safety threshold." },
      { agency: "Israeli MoH", reg: "Decree 5780 Allergen Rules", status: "Allergen Declaration", statusColor: "#ff9800", adi: "0-0.7 mg/kg bw", description: "Mandatory Hebrew declaration on front and ingredient panel." }
    ]
  },
  // Antioxidants
  {
    ins: "E300",
    name: "Ascorbic Acid (Vitamin C)",
    chemicalName: "L-Ascorbic Acid",
    formula: "C6H8O6",
    cas: "50-81-7",
    einecs: "200-066-2",
    functionalClass: "Antioxidant, Color Stabilizer, Flour Treatment Agent & Essential Micronutrient.",
    safetyScore: 98,
    riskLevel: "BENIGN / BENEFICIAL",
    riskTitle: "Assay Risk: Benign (Essential Nutrient)",
    riskSubtitle: "Essential Human Micronutrient · Quantum Satis",
    alertHeadline: "Essential Vitamin & Master Antioxidant",
    alertBadge: "Universal GRAS Cleared",
    alertDescription: "Naturally occurring essential antioxidant. Scavenges free radicals, prevents enzymatic browning in fruits, and strengthens gluten matrices in bakery doughs.",
    adi: { range: "Not Specified", unit: "mg/kg bw/day", fillPercent: 98, note: "JECFA allocated ADI 'Not Specified' (Highest safety grade)." },
    carcinogenicity: { hazard: "Group 3", tag: "(Protective Antioxidant)", fillPercent: 5, note: "Antimutagenic properties against nitroso-compound formation." },
    maxIngoing: { value: "GMP", unit: "Quantum Satis", fillPercent: 10, note: "Permitted quantum satis in virtually all processed food categories." },
    pediatricRisk: { value: "None", sub: "Essential Nutrient", fillPercent: 5, note: "Vital component for pediatric collagen synthesis and immune health." },
    dietary: {
      halal: { certified: true, note: "Fermented corn glucose / botanical", badge: "Halal" },
      kosher: { certified: true, note: "Strict kosher pareve certified", badge: "Pareve" },
      vegan: { certified: true, note: "Plant glucose fermentation", badge: "Vegan" },
      glutenFree: { certified: true, note: "<5 ppm gliadin", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Benign profile. Fully compliant with MoH green guidelines."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "None", detected: 0, euLimit: 0.1, usLimit: 0.1, maxScale: 0.2, alert: "Within demo limits", notice: "Pharmaceutical grade pure crystalline ascorbic acid." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008", status: "Authorized Quantum Satis", statusColor: "#006c49", adi: "Not Specified", description: "Full authorization with no safety restrictions." },
      { agency: "US FDA (United States)", reg: "21 CFR 182.3013", status: "GRAS", statusColor: "#006c49", adi: "GMP", description: "Generally Recognized As Safe for antioxidant and nutrient fortification." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius", status: "Allocated Not Specified", statusColor: "#006c49", adi: "Not Specified", description: "Confirmed completely safe at dietary levels." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved", statusColor: "#006c49", adi: "Quantum Satis", description: "Universal authorization." }
    ]
  },
  {
    ins: "E322",
    name: "Lecithins (Soy / Sunflower Lecithin)",
    chemicalName: "Phosphatidylcholine Complex",
    formula: "C42H80NO8P (Variable)",
    cas: "8002-43-5",
    einecs: "232-307-2",
    functionalClass: "Emulsifier, Stabilizer, Release Agent & Antioxidant Synergist in Chocolates & Margarines.",
    safetyScore: 94,
    riskLevel: "BENIGN / ALLERGEN IF SOY",
    riskTitle: "Assay Risk: Benign (Soy Allergen Flag)",
    riskSubtitle: "EFSA Re-evaluated 2020 · Quantum Satis",
    alertHeadline: "Essential Phospholipid Emulsifier",
    alertBadge: "EFSA Cleared (2020)",
    alertDescription: "Natural phospholipid complex extracted from oilseeds (soy, sunflower) or egg yolk. Essential for reducing chocolate viscosity and preventing fat blooming.",
    adi: { range: "Not Specified", unit: "mg/kg bw/day", fillPercent: 94, note: "EFSA/JECFA: ADI 'Not Specified'." },
    carcinogenicity: { hazard: "Group 3", tag: "(Non-Carcinogenic)", fillPercent: 6, note: "Natural dietary constituent of human cellular membranes." },
    maxIngoing: { value: "GMP", unit: "Quantum Satis", fillPercent: 12, note: "Widely used at 0.3 - 0.5% in confectioneries." },
    pediatricRisk: { value: "Allergen Flag", sub: "Soy Hypersensitivity", fillPercent: 20, note: "Soy-derived lecithin requires allergen declaration for soy-sensitive children." },
    dietary: {
      halal: { certified: true, note: "Botanical oil extraction", badge: "Halal" },
      kosher: { certified: true, note: "Sunflower lecithin is Kitniyot-free; soy lecithin is Pareve", badge: "Pareve" },
      vegan: { certified: true, note: "Plant-derived (Soy or Sunflower)", badge: "Vegan" },
      glutenFree: { certified: true, note: "Naturally gluten free", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 10, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 3.5, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Benign profile; standard chocolate dosage contributes negligible saturated fat."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "None", detected: 0, euLimit: 0.1, usLimit: 0.1, maxScale: 0.2, alert: "Within demo limits", notice: "Heavy metals and solvent residues compliant with EFSA purity criteria." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008", status: "Authorized Quantum Satis", statusColor: "#006c49", adi: "Not Specified", description: "Re-evaluated in 2020 by EFSA FAF Panel with no safety concern." },
      { agency: "US FDA (United States)", reg: "21 CFR 184.1400", status: "GRAS", statusColor: "#006c49", adi: "GMP", description: "Affirmed as GRAS for direct food use." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius", status: "Allocated Not Specified", statusColor: "#006c49", adi: "Not Specified", description: "Universal safety allocation." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved", statusColor: "#006c49", adi: "Quantum Satis", description: "Approved emulsifier in Israeli standards." }
    ]
  },
  // Thickeners & Gums
  {
    ins: "E407",
    name: "Carrageenan",
    chemicalName: "Sulfated Galactans from Rhodophyceae",
    formula: "Variable polysaccharide sulfate",
    cas: "9000-07-1",
    einecs: "232-524-2",
    functionalClass: "Hydrocolloid Gelling Agent, Thickener, Texture Stabilizer in Dairy & Plant Milks.",
    safetyScore: 56,
    riskLevel: "MODERATE CONCERN",
    riskTitle: "Assay Risk: Moderate (GI Inflammation & Degraded Forms)",
    riskSubtitle: "EFSA 2018 Re-evaluated · Strict Infant Restrictions",
    alertHeadline: "Gastrointestinal Mucosal Sensitivity Flag",
    alertBadge: "EFSA Monitored Additive",
    alertDescription: "Sulfated polysaccharide extracted from red edible seaweeds. Banned in infant formulas (0-16 weeks) due to potential GI inflammation and degraded poligeenan contamination.",
    adi: { range: "0 - 75", unit: "mg/kg bw/day", fillPercent: 56, note: "Temporary group ADI established by EFSA in 2018." },
    carcinogenicity: { hazard: "Group 3", tag: "(Poligeenan is Group 2B)", fillPercent: 44, note: "Low-molecular weight degraded carrageenan (poligeenan) is an IARC 2B animal carcinogen." },
    maxIngoing: { value: "300 - 10000", unit: "mg/kg", fillPercent: 55, note: "Permitted in cream, plant milks, and desserts." },
    pediatricRisk: { value: "Banned in Infant Formula", sub: "Gut Inflammation Risk", fillPercent: 75, note: "Prohibited in EU/Israeli infant formula due to mucosal permeability." },
    dietary: {
      halal: { certified: true, note: "Red sea algae (Chondrus crispus)", badge: "Halal" },
      kosher: { certified: true, note: "Seaweed plant derivative", badge: "Pareve" },
      vegan: { certified: true, note: "100% seaweed origin (Gelatin alternative)", badge: "Vegan" },
      glutenFree: { certified: true, note: "Grain-free seaweed matrix", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 40, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Standard dairy thickener levels do not trigger MoH red labels."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "None", detected: 0, euLimit: 0.1, usLimit: 0.1, maxScale: 0.2, alert: "Within demo limits", notice: "Screened for inorganic arsenic and cadmium below statutory marine thresholds." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008", status: "Restricted in Infants", statusColor: "#ff9800", adi: "0-75 mg/kg bw", description: "Banned in infant formula; molecular weight monitored (<5% below 50 kDa)." },
      { agency: "US FDA (United States)", reg: "21 CFR 172.620", status: "Approved", statusColor: "#006c49", adi: "GMP", description: "Direct food additive for emulsification and stabilization." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius", status: "Allocated", statusColor: "#006c49", adi: "0-75 mg/kg bw", description: "JECFA 79th Report maintained acceptable safety." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved with Restrictions", statusColor: "#ff9800", adi: "0-75 mg/kg bw", description: "Approved in adult foods; excluded from initial infant nutrition." }
    ]
  },
  {
    ins: "E412",
    name: "Guar Gum",
    chemicalName: "Galactomannan Polysaccharide",
    formula: "Variable polysaccharide",
    cas: "9000-30-0",
    einecs: "232-536-8",
    functionalClass: "Natural Dietary Fiber, Thickener, Viscosity Modifier in Sauces, Ice Creams & Gluten-Free Foods.",
    safetyScore: 92,
    riskLevel: "LOW RISK / BENEFICIAL FIBER",
    riskTitle: "Assay Risk: Low (Dietary Prebiotic Fiber)",
    riskSubtitle: "EFSA 2017 Re-evaluated · Safe Prebiotic Hydrocolloid",
    alertHeadline: "Natural Legume Hydrocolloid",
    alertBadge: "EFSA Cleared",
    alertDescription: "Milled endosperm of cluster bean (Cyamopsis tetragonoloba). Eight times the water-thickening power of cornstarch; functions as a beneficial prebiotic fiber.",
    adi: { range: "Not Specified", unit: "mg/kg bw/day", fillPercent: 92, note: "EFSA allocated ADI 'Not Specified'." },
    carcinogenicity: { hazard: "Group 3", tag: "(Non-Carcinogenic)", fillPercent: 8, note: "Fermented by colonic microbiota into beneficial short-chain fatty acids." },
    maxIngoing: { value: "GMP", unit: "Quantum Satis", fillPercent: 15, note: "Permitted quantum satis across dairy, bakery, and dressings." },
    pediatricRisk: { value: "Mild Bloating", sub: "Fiber Fermentation", fillPercent: 12, note: "Excessive ingestion may cause transient flatulence in young children." },
    dietary: {
      halal: { certified: true, note: "Guar bean legume seed", badge: "Halal" },
      kosher: { certified: true, note: "Strict kosher pareve legume", badge: "Pareve" },
      vegan: { certified: true, note: "100% plant legume seed", badge: "Vegan" },
      glutenFree: { certified: true, note: "Natural gluten substitute in gluten-free baking", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 5, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Benign dietary profile. Compliant with MoH nutrition guidelines."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "None", detected: 0, euLimit: 0.1, usLimit: 0.1, maxScale: 0.2, alert: "Within demo limits", notice: "Screened negative for pentachlorophenol and dioxin contaminants." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008", status: "Authorized Quantum Satis", statusColor: "#006c49", adi: "Not Specified", description: "Re-evaluated in 2017 with no safety concerns." },
      { agency: "US FDA (United States)", reg: "21 CFR 184.1339", status: "GRAS", statusColor: "#006c49", adi: "GMP", description: "Affirmed as GRAS for multi-category food stabilization." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius", status: "Allocated Not Specified", statusColor: "#006c49", adi: "Not Specified", description: "Safe natural dietary polysaccharide." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved", statusColor: "#006c49", adi: "Quantum Satis", description: "Approved across commercial food lines." }
    ]
  },
  {
    ins: "E415",
    name: "Xanthan Gum",
    chemicalName: "Bacterial Exopolysaccharide (Xanthomonas campestris)",
    formula: "Polysaccharide polymer",
    cas: "11138-66-2",
    einecs: "234-394-2",
    functionalClass: "Pseudoplastic Thickener, Viscosity Modifier, Gluten Substitute in Bakery.",
    safetyScore: 93,
    riskLevel: "LOW RISK / UNIVERSAL GUM",
    riskTitle: "Assay Risk: Low (Universal Food Hydrocolloid)",
    riskSubtitle: "EFSA 2017 Cleared · High Shear-Thinning Stability",
    alertHeadline: "Precision Fermentation Hydrocolloid",
    alertBadge: "EFSA Cleared",
    alertDescription: "High-molecular weight exopolysaccharide produced by aerobic fermentation of Xanthomonas campestris. Exhibits unique pseudoplastic shear-thinning rheology.",
    adi: { range: "Not Specified", unit: "mg/kg bw/day", fillPercent: 93, note: "EFSA: ADI 'Not Specified' in general food use." },
    carcinogenicity: { hazard: "Group 3", tag: "(Non-Carcinogenic)", fillPercent: 7, note: "Biological macromolecule not absorbed into bloodstream." },
    maxIngoing: { value: "GMP", unit: "Quantum Satis", fillPercent: 14, note: "Used at 0.1 - 0.5% in dressings, sauces, and bread." },
    pediatricRisk: { value: "None", sub: "Standard Food Use", fillPercent: 8, note: "Prohibited only in liquid infant swallow thickeners for premature babies." },
    dietary: {
      halal: { certified: true, note: "Bacterial fermentation of glucose", badge: "Halal" },
      kosher: { certified: true, note: "Kosher Pareve certified", badge: "Pareve" },
      vegan: { certified: true, note: "Non-animal microbial fermentation", badge: "Vegan" },
      glutenFree: { certified: true, note: "Core ingredient for gluten-free baking volume", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 300, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Typical food dosage (0.2%) adds under 1mg sodium per 100g serving."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "None", detected: 0, euLimit: 0.1, usLimit: 0.1, maxScale: 0.2, alert: "Within demo limits", notice: "Negative for viable Xanthomonas or pathogenic microorganisms." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008", status: "Authorized Quantum Satis", statusColor: "#006c49", adi: "Not Specified", description: "Re-evaluated 2017 with no safety concerns." },
      { agency: "US FDA (United States)", reg: "21 CFR 172.695", status: "Approved", statusColor: "#006c49", adi: "GMP", description: "Direct food additive for thickening and stabilizing." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius", status: "Allocated Not Specified", statusColor: "#006c49", adi: "Not Specified", description: "Universal safety allocation." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved", statusColor: "#006c49", adi: "Quantum Satis", description: "Approved without numerical restriction." }
    ]
  },
  {
    ins: "E471",
    name: "Mono- and Di-glycerides of Fatty Acids",
    chemicalName: "Glycerol Monostearate / Oleate Mixture",
    formula: "C21H42O4 (Variable)",
    cas: "67701-33-1",
    einecs: "266-932-7",
    functionalClass: "Emulsifier, Starch Complexing Agent, Crumb Softener in Bread & Margarines.",
    safetyScore: 90,
    riskLevel: "LOW RISK / DIETARY CONCERN",
    riskTitle: "Assay Risk: Low (Animal Fat Derivation Check)",
    riskSubtitle: "EFSA 2017 Re-evaluated · Potential Pork / Tallow Source",
    alertHeadline: "Universal Bakery & Margarine Emulsifier",
    alertBadge: "EFSA Cleared (2017)",
    alertDescription: "Naturally occurring intermediate in fat digestion. Used universally in commercial bread for shelf-life extension and crumb softening.",
    adi: { range: "Not Specified", unit: "mg/kg bw/day", fillPercent: 90, note: "EFSA: ADI 'Not Specified'." },
    carcinogenicity: { hazard: "Group 3", tag: "(Normal Dietary Lipid Metabolite)", fillPercent: 10, note: "Metabolized identically to natural edible vegetable and dairy fats." },
    maxIngoing: { value: "GMP", unit: "Quantum Satis", fillPercent: 20, note: "Used at 0.5 - 2% in commercial baking and ice creams." },
    pediatricRisk: { value: "None", sub: "Standard Lipid", fillPercent: 10, note: "Safe in pediatric bakery products." },
    dietary: {
      halal: { certified: true, note: "Requires certified plant-oil origin (Palm/Soy); non-halal if pork fat derived", badge: "Halal (Plant)" },
      kosher: { certified: true, note: "Requires strict kosher supervision to verify plant origin over animal tallow", badge: "Pareve (Plant)" },
      vegan: { certified: true, note: "Must be specified as 100% vegetable origin (Palm/Soy)", badge: "Vegan (Plant)" },
      glutenFree: { certified: true, note: "Naturally gluten free lipid", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 1.2, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Typical bread formulation (0.5%) adds negligible saturated fat (<0.3g/100g)."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "None", detected: 0, euLimit: 0.1, usLimit: 0.1, maxScale: 0.2, alert: "Within demo limits", notice: "Free of trans-fatty acid contaminants above statutory limits." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008", status: "Authorized Quantum Satis", statusColor: "#006c49", adi: "Not Specified", description: "Re-evaluated 2017 with no safety concerns." },
      { agency: "US FDA (United States)", reg: "21 CFR 184.1505", status: "GRAS", statusColor: "#006c49", adi: "GMP", description: "Affirmed as GRAS direct human food ingredient." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius", status: "Allocated Not Specified", statusColor: "#006c49", adi: "Not Specified", description: "Universal safety clearance." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved", statusColor: "#006c49", adi: "Quantum Satis", description: "Authorized subject to vegetable source certification." }
    ]
  },
  // Sweeteners
  {
    ins: "E950",
    name: "Acesulfame Potassium (Ace-K)",
    chemicalName: "Potassium 6-methyl-2,2-dioxo-oxathiazin-4-olate",
    formula: "C4H4KNO4S",
    cas: "55589-62-3",
    einecs: "259-715-3",
    functionalClass: "Non-Caloric High-Intensity Artificial Sweetener (200x Sucrose).",
    safetyScore: 66,
    riskLevel: "MODERATE RISK",
    riskTitle: "Assay Risk: Moderate (Synthetic Non-Nutritive)",
    riskSubtitle: "Zero Glycemic Index · High Thermal Stability",
    alertHeadline: "High-Intensity Artificial Sweetener",
    alertBadge: "EFSA Under Re-evaluation",
    alertDescription: "Calorie-free sweetener 200 times sweeter than sucrose. Frequently blended with aspartame or sucralose to mask bitter aftertastes.",
    adi: { range: "0 - 9", unit: "mg/kg bw/day", fillPercent: 66, note: "EFSA re-evaluating under additive systematic mandate." },
    carcinogenicity: { hazard: "Group 3", tag: "(Rodent Bioassays Negative)", fillPercent: 34, note: "Excreted unchanged by mammalian kidneys; no bioaccumulation." },
    maxIngoing: { value: "350 - 1000", unit: "mg/kg", fillPercent: 50, note: "Permitted in diet sodas, sugar-free gums, and yogurts." },
    pediatricRisk: { value: "Sweet Preference", sub: "Metabolic Conditioning", fillPercent: 40, note: "WHO advises limiting non-sugar sweeteners for long-term weight management." },
    dietary: {
      halal: { certified: true, note: "Chemical synthesis", badge: "Halal" },
      kosher: { certified: true, note: "Kosher Pareve certified", badge: "Pareve" },
      vegan: { certified: true, note: "Synthetic compound, no animal substrates", badge: "Vegan" },
      glutenFree: { certified: true, note: "Naturally gluten free", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Exempt from Israeli red sugar warning label (sugar substitute)."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "None", detected: 0, euLimit: 0.1, usLimit: 0.1, maxScale: 0.2, alert: "Within demo limits", notice: "Pure synthetic compound; heavy metals below 1 mg/kg." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008", status: "Authorized", statusColor: "#006c49", adi: "0-9 mg/kg bw", description: "Authorized across energy-reduced and no-added-sugar foods." },
      { agency: "US FDA (United States)", reg: "21 CFR 172.800", status: "Approved", statusColor: "#006c49", adi: "15 mg/kg bw", description: "FDA approved for general food and beverage sweetening." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius", status: "Allocated", statusColor: "#006c49", adi: "0-15 mg/kg bw", description: "JECFA 37th Report." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved", statusColor: "#006c49", adi: "0-9 mg/kg bw", description: "Authorized sugar substitute in low-calorie beverages." }
    ]
  },
  {
    ins: "E955",
    name: "Sucralose (Splenda)",
    chemicalName: "1,6-Dichloro-1,6-dideoxy-beta-D-fructofuranosyl-4-chloro-4-deoxy-alpha-D-galactopyranoside",
    formula: "C12H19Cl3O8",
    cas: "56038-13-2",
    einecs: "259-952-2",
    functionalClass: "Organochlorine Non-Caloric High-Intensity Sweetener (600x Sucrose).",
    safetyScore: 70,
    riskLevel: "LOW-MODERATE RISK",
    riskTitle: "Assay Risk: Low-Moderate (Thermal Stability Caution)",
    riskSubtitle: "Zero Calorie · Thermal Breakdown at Extreme Baking Temperatures",
    alertHeadline: "Chlorinated High-Intensity Sweetener",
    alertBadge: "EFSA/FDA Approved",
    alertDescription: "Derived from sucrose by selective substitution of three hydroxyl groups with chlorine atoms. 600 times sweeter than sugar with zero caloric impact.",
    adi: { range: "0 - 15", unit: "mg/kg bw/day", fillPercent: 70, note: "EFSA/JECFA: 15 mg/kg bw/day." },
    carcinogenicity: { hazard: "Group 3", tag: "(Non-Carcinogenic in Purified Matrix)", fillPercent: 30, note: "Chloropropanol formation occurs only when heated above 250°C." },
    maxIngoing: { value: "300 - 3000", unit: "mg/kg", fillPercent: 45, note: "Broadly permitted in beverages, sports proteins, and yogurts." },
    pediatricRisk: { value: "Low Concern", sub: "Non-Cariogenic", fillPercent: 25, note: "Non-cariogenic (does not promote tooth decay)." },
    dietary: {
      halal: { certified: true, note: "Chemical synthesis from sucrose", badge: "Halal" },
      kosher: { certified: true, note: "Certified kosher pareve", badge: "Pareve" },
      vegan: { certified: true, note: "Synthetic carbohydrate modification", badge: "Vegan" },
      glutenFree: { certified: true, note: "Naturally gluten free", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Exempt from Israeli red sugar warning label."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "None", detected: 0, euLimit: 0.1, usLimit: 0.1, maxScale: 0.2, alert: "Within demo limits", notice: "Pure pharmaceutical-grade sucralose." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008", status: "Authorized", statusColor: "#006c49", adi: "0-15 mg/kg bw", description: "Authorized across energy-reduced foods." },
      { agency: "US FDA (United States)", reg: "21 CFR 172.823", status: "Approved", statusColor: "#006c49", adi: "5 mg/kg bw", description: "General-purpose sweetener approval." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius", status: "Allocated", statusColor: "#006c49", adi: "0-15 mg/kg bw", description: "JECFA 37th session clearance." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved", statusColor: "#006c49", adi: "0-15 mg/kg bw", description: "Authorized in Israeli consumer food lines." }
    ]
  },
  {
    ins: "E960",
    name: "Steviol Glycosides (Stevia Leaf Extract)",
    chemicalName: "13-[(2-O-beta-D-glucopyranosyl-alpha-D-glucopyranosyl)oxy]kaur-16-en-18-oic acid",
    formula: "C38H60O18 (Rebaudioside A)",
    cas: "57817-89-7",
    einecs: "260-975-5",
    functionalClass: "Natural Non-Caloric High-Intensity Sweetener (250-300x Sucrose).",
    safetyScore: 92,
    riskLevel: "LOW RISK / NATURAL BOTANICAL",
    riskTitle: "Assay Risk: Low (Plant-Derived Polyphenol)",
    riskSubtitle: "Zero Calorie · EFSA & FDA Cleared Botanical Sweetener",
    alertHeadline: "Natural Botanical High-Intensity Sweetener",
    alertBadge: "EFSA/FDA Approved",
    alertDescription: "Purified extracts from leaves of the Stevia rebaudiana Bertoni plant (minimum 95% steviol glycosides). Zero calories, zero glycemic index.",
    adi: { range: "0 - 4", unit: "mg/kg bw/day", fillPercent: 92, note: "Expressed as steviol equivalents." },
    carcinogenicity: { hazard: "Group 3", tag: "(Non-Carcinogenic Botanical Extract)", fillPercent: 8, note: "Negative in comprehensive mutagenicity and carcinogenesis assays." },
    maxIngoing: { value: "40 - 2000", unit: "mg/kg", fillPercent: 35, note: "Permitted in flavored drinks, dairy, and confectionery." },
    pediatricRisk: { value: "None", sub: "Safe Botanical", fillPercent: 10, note: "Safe sugar alternative for children." },
    dietary: {
      halal: { certified: true, note: "100% natural leaf water extraction", badge: "Halal" },
      kosher: { certified: true, note: "Kosher Pareve plant certified", badge: "Pareve" },
      vegan: { certified: true, note: "Stevia rebaudiana plant leaf", badge: "Vegan" },
      glutenFree: { certified: true, note: "Naturally gluten free", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Exempt from Israeli red sugar warning label."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "None", detected: 0, euLimit: 0.1, usLimit: 0.1, maxScale: 0.2, alert: "Within demo limits", notice: "Screened negative for organochlorine and pyrethroid pesticide residues." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EC) No 1333/2008 & 1131/2011", status: "Authorized", statusColor: "#006c49", adi: "0-4 mg/kg bw", description: "Authorized in 2011 across 31 food categories." },
      { agency: "US FDA (United States)", reg: "GRAS Notices (GRN 252, etc.)", status: "GRAS", statusColor: "#006c49", adi: "4 mg/kg bw", description: "Affirmed as GRAS for high-purity rebaudioside A." },
      { agency: "JECFA (WHO / FAO)", reg: "Codex Alimentarius", status: "Allocated", statusColor: "#006c49", adi: "0-4 mg/kg bw", description: "JECFA 69th session established international ADI." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5780", status: "Approved", statusColor: "#006c49", adi: "0-4 mg/kg bw", description: "Authorized natural sweetener in Israel." }
    ]
  },
  // Key Industrial Packaged Food Ingredients
  {
    ins: "INGR-HFCS",
    name: "High Fructose Corn Syrup (HFCS-55)",
    chemicalName: "Isoglucose / Enzymatically Hydrolyzed Starch Syrup",
    formula: "C6H12O6 (Fructose 55% + Glucose 42%)",
    cas: "977042-84-4",
    einecs: "N/A",
    functionalClass: "Industrial Caloric Liquid Sweetener, Humectant & Texture Modifier.",
    safetyScore: 35,
    riskLevel: "HIGH RISK / CHRONIC DISEASE FLAG",
    riskTitle: "Assay Risk: High (Metabolic Syndrome & Fatty Liver)",
    riskSubtitle: "High Fructose Flux · Non-Alcoholic Fatty Liver Disease (NAFLD)",
    alertHeadline: "Major Metabolic Disease Contributor",
    alertBadge: "Red Sugar Label Mandatory",
    alertDescription: "Liquid caloric sweetener produced from cornstarch via enzymatic isomerization. Rapid hepatic fructose metabolism promotes visceral adiposity, de novo lipogenesis, and insulin resistance.",
    adi: { range: "Limit Strongly Advised", unit: "<5% total daily calories", fillPercent: 35, note: "WHO advises strictly restricting free sugars to under 25g/day for adults." },
    carcinogenicity: { hazard: "Group 3", tag: "(Promotes Tumor Microenvironment via Hyperinsulinemia)", fillPercent: 65, note: "High systemic fructose drives obesity-associated malignancies." },
    maxIngoing: { value: "Quantum Satis (High)", unit: "% of formulation", fillPercent: 90, note: "High volumes used in commercial sodas and sweet confectionery." },
    pediatricRisk: { value: "Severe Metabolic Hazard", sub: "Childhood Obesity & Dental Caries", fillPercent: 88, note: "Primary driver of early-onset type 2 diabetes and pediatric hepatic steatosis." },
    dietary: {
      halal: { certified: true, note: "Plant corn starch enzymatic hydrolysis", badge: "Halal" },
      kosher: { certified: true, note: "Kosher Pareve (Kitniyot for Passover)", badge: "Pareve" },
      vegan: { certified: true, note: "100% plant corn grain derivative", badge: "Vegan" },
      glutenFree: { certified: true, note: "Derived from corn, naturally gluten-free", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 5, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: true, value: 76.0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר גבוה", labelEn: "High Sugar" },
      complianceAssessment: "Exceeds the 10g/100g solid (or 5g/100ml liquid) barrier. Mandatory red octagonal sugar warning required on front of pack."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "Glyphosate", detected: 0.015, euLimit: 0.1, usLimit: 5.0, maxScale: 0.2, alert: "Within demo limits", notice: "Within industrial grain processing tolerances." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EU) No 1169/2011", status: "Sugar Regulated", statusColor: "#ff9800", adi: "Restrict Free Sugars", description: "Mandatory front-of-pack declaration as glucose-fructose syrup." },
      { agency: "US FDA (United States)", reg: "21 CFR 184.1866", status: "GRAS", statusColor: "#ff9800", adi: "GMP", description: "Affirmed as GRAS; requires added sugars disclosure on Nutrition Facts." },
      { agency: "JECFA (WHO / FAO)", reg: "WHO Sugar Guidelines 2015", status: "Nutritional Advisory", statusColor: "#ba1a1a", adi: "<10% Energy", description: "Strong recommendation to reduce free sugars below 5% of energy intake." },
      { agency: "Israeli MoH", reg: "Decree 5780 Red Labeling", status: "Mandatory Red Label", statusColor: "#ba1a1a", adi: "Restricted", description: "Prominent red sugar warning label required in retail products." }
    ]
  },
  {
    ins: "INGR-PALM",
    name: "Refined Palm Oil (Palm Olein)",
    chemicalName: "Elaeis guineensis Triglyceride Fraction",
    formula: "Palmitic, Oleic & Linoleic Glycerides",
    cas: "8002-75-3",
    einecs: "232-316-1",
    functionalClass: "High-Stability Frying Fat, Shortening, Texture Modifier in Snacks & Spreads.",
    safetyScore: 48,
    riskLevel: "MODERATE-HIGH CONCERN",
    riskTitle: "Assay Risk: Moderate-High (Saturated Fatty Acids & 3-MCPD)",
    riskSubtitle: "50% Saturated Palmitic Acid · Process Contaminants (GE / 3-MCPD)",
    alertHeadline: "High Saturated Fat & Thermal Contaminant Flag",
    alertBadge: "Red Saturated Fat Label",
    alertDescription: "Tropical plant lipid containing ~50% saturated palmitic acid. High-temperature deodorization generates process contaminants 3-MCPD and glycidyl esters (GE), which are genotoxic carcinogens.",
    adi: { range: "0 - 2", unit: "ug/kg bw (for 3-MCPD)", fillPercent: 48, note: "EFSA established strict tolerable daily intake for 3-MCPD esters." },
    carcinogenicity: { hazard: "Group 2A (GE)", tag: "(Glycidol is Probably Carcinogenic)", fillPercent: 62, note: "Glycidyl fatty acid esters are genotoxic and carcinogenic; strictly limited by Regulation (EU) 2018/290." },
    maxIngoing: { value: "Quantum Satis (High)", unit: "% of formulation", fillPercent: 85, note: "Extensively utilized in instant noodles, pastries, and hazelnut spreads." },
    pediatricRisk: { value: "Cardiovascular & Infant Concern", sub: "Saturated Lipid Load", fillPercent: 60, note: "Limits enforced on glycidyl esters in infant food matrices." },
    dietary: {
      halal: { certified: true, note: "Palm fruit tree oil", badge: "Halal" },
      kosher: { certified: true, note: "Kosher Pareve plant oil", badge: "Pareve" },
      vegan: { certified: true, note: "100% plant origin (Ecological impact noted)", badge: "Vegan" },
      glutenFree: { certified: true, note: "Naturally gluten free lipid", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: true, value: 49.3, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי גבוה", labelEn: "High Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Contains 49.3g saturated fat per 100g, dramatically exceeding the 5.0g limit. Mandatory red saturated fat label triggered."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "3-MCPD Esters", detected: 0.8, euLimit: 1.25, usLimit: 1.5, maxScale: 2.0, alert: "Within demo limits", notice: "Within EU Regulation 2020/1322 limits for vegetable oils." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Regulation (EU) 2018/290 & 2020/1322", status: "Contaminant Regulated", statusColor: "#ff9800", adi: "2 ug/kg bw (3-MCPD)", description: "Strict maximum limits on glycidyl esters (1000 ug/kg) and 3-MCPD in oils." },
      { agency: "US FDA (United States)", reg: "21 CFR 184.1555", status: "GRAS", statusColor: "#ff9800", adi: "GMP", description: "Food ingredient standard; saturated fat disclosure required." },
      { agency: "JECFA (WHO / FAO)", reg: "JECFA 83rd Report", status: "Evaluated", statusColor: "#ff9800", adi: "4 ug/kg bw (PMTDI)", description: "Provisional maximum tolerable daily intake established for 3-MCPD." },
      { agency: "Israeli MoH", reg: "Decree 5780 Red Labels", status: "Mandatory Red Label", statusColor: "#ba1a1a", adi: "Restricted", description: "Triggers mandatory red octagonal saturated fat symbol." }
    ]
  },
  {
    ins: "INGR-TRANSFAT",
    name: "Partially Hydrogenated Vegetable Fat (Trans Fats)",
    chemicalName: "Industrial Trans Fatty Acids (iTFA)",
    formula: "Trans-Octadecenoic Acids",
    cas: "68334-00-9",
    einecs: "269-804-9",
    functionalClass: "Obsolete Hardening Fat, High-Melting Shortening (BANNED/PHASED OUT).",
    safetyScore: 12,
    riskLevel: "BANNED / EXTREME CARDIOVASCULAR RISK",
    riskTitle: "Assay Risk: Extreme (Coronary Heart Disease)",
    riskSubtitle: "Banned in US, EU & Israel (<2g / 100g fat limit)",
    alertHeadline: "Prohibited Industrial Toxic Lipid",
    alertBadge: "Banned / Strictly Restricted",
    alertDescription: "Industrial hydrogenation produces trans-isomer double bonds. Elevates LDL cholesterol, lowers protective HDL, triggers systemic endothelial inflammation, and causes coronary artery death.",
    adi: { range: "0 (Zero Tolerance)", unit: "g/day", fillPercent: 12, note: "WHO global mandate: Eliminate industrial trans fats completely from human food supply." },
    carcinogenicity: { hazard: "Group 3", tag: "(Major Atherosclerotic Pathogen)", fillPercent: 88, note: "Associated with 500,000 annual global premature cardiovascular deaths." },
    maxIngoing: { value: "<2g per 100g fat", unit: "Strict Statutory Cap", fillPercent: 98, note: "EU Regulation (EU) 2019/649 bans foods with trans fat exceeding 2% of total fat." },
    pediatricRisk: { value: "Prohibited", sub: "Vascular Damage", fillPercent: 95, note: "Strictly banned in all pediatric and general food supplies." },
    dietary: {
      halal: { certified: false, note: "Cardiovascular health violation", badge: "Prohibited" },
      kosher: { certified: false, note: "Unwholesome banned processing", badge: "Prohibited" },
      vegan: { certified: false, note: "Prohibited toxicant", badge: "Banned" },
      glutenFree: { certified: true, note: "Non-grain", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: true, value: 35.0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי גבוה", labelEn: "High Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Illegal under Israeli Public Health Regulations (Food) if trans fatty acids exceed 2% of total lipid content."
    },
    pesticideResidues: [],
    pesticideGauge: { compound: "Trans-Fatty Acids", detected: 4.5, euLimit: 2.0, usLimit: 0.5, maxScale: 5.0, alert: "Above demo limit", notice: "Exceeds statutory maximum permissible trans fat cap." },
    regulatoryDossier: [
      { agency: "EFSA (European Union)", reg: "Commission Regulation (EU) 2019/649", status: "BANNED (>2%)", statusColor: "#ba1a1a", adi: "0 g/day", description: "Legally prohibited to market foods containing trans fat over 2g/100g of total fat." },
      { agency: "US FDA (United States)", reg: "Final Determination 2015/2018", status: "GRAS REVOKED / BANNED", statusColor: "#ba1a1a", adi: "0 g/day", description: "FDA completely revoked GRAS status for partially hydrogenated oils (PHOs)." },
      { agency: "JECFA (WHO / FAO)", reg: "WHO REPLACE Action Package", status: "Global Elimination", statusColor: "#ba1a1a", adi: "0 g/day", description: "Global campaign to eliminate industrial trans fats." },
      { agency: "Israeli MoH", reg: "Public Health Regulations 5774-2014", status: "Prohibited (>2%)", statusColor: "#ba1a1a", adi: "0 g/day", description: "Prohibits commercial sale of foods containing industrial trans fat exceeding 2%." }
    ]
  }
];
