/**
 * NutriSafe ToxiScan Bio-Informatics Engine
 * Comprehensive database & fallback handler for:
 * 1. check_additive
 * 2. check_ingredient_list
 * 3. search_additives
 * 4. check_nutrition (Israeli MoH Food DB - bundled demo foods)
 * 5. check_pesticide_mrl (Israeli MoH/PPIS MRLs harmonized with EU & US EPA)
 */

import { CURATED_ADDITIVES } from './ingredients-data.js';

const BASE_ADDITIVES = [
  {
    ins: "E250",
    name: "Sodium Nitrite (NaNO₂)",
    chemicalName: "Sodium Nitrite",
    formula: "NaNO2",
    cas: "7632-00-0",
    einecs: "231-555-9",
    functionalClass: "Antimicrobial Preservative, Color Retention Fixative in Processed Meat Matrices.",
    safetyScore: 62,
    riskLevel: "MODERATE-HIGH",
    riskTitle: "Assay Risk: Moderate-High",
    riskSubtitle: "ADI Threshold Restricted · EFSA ANS Panel Re-evaluated",
    alertHeadline: "High-Risk Additive Classification",
    alertBadge: "EFSA Mandate 2023 Regulated",
    alertDescription: "Endogenous nitrosation yields volatile N-nitrosamines (NDMA) upon reaction with secondary amines under thermal curing conditions. European Food Safety Authority (EFSA Contam Panel 2023) confirmed excess exposure exceeds the Margin of Exposure (MoE < 10,000) for genotoxic carcinogenicity. Strictly bound to controlled maximum ingoing formulations.",
    adi: {
      range: "0 - 0.07",
      unit: "mg/kg bw/day",
      fillPercent: 60,
      note: "Re-evaluated by EFSA & JECFA. Adult benchmark intake: ~4.9 mg/day for 70kg mass."
    },
    carcinogenicity: {
      hazard: "Group 2A",
      tag: "(IARC Cured Matrix)",
      fillPercent: 80,
      note: "Nitrosamine formation precursor. Strong link to colorectal neoplasia in animal trials."
    },
    maxIngoing: {
      value: "150",
      unit: "mg/kg (residual <50)",
      fillPercent: 75,
      note: "EU Regulation (EU) 2023/2108 reduces limits to 80-100 mg/kg effective Oct 2025."
    },
    pediatricRisk: {
      value: "MetHb",
      sub: "Elevation Risk",
      fillPercent: 67,
      note: "Infant contraindication: high affinity to fetal hemoglobin causing blue baby syndrome."
    },
    dietary: {
      halal: { certified: true, note: "Pure synthetic mineral salt (Inorganic nitrogen synthesis)", badge: "Halal" },
      kosher: { certified: true, note: "Chemical compound free of dairy or non-kosher animal enzymes", badge: "Pareve" },
      vegan: { certified: true, note: "No animal bone char, marrow, or gelatin substrate utilized", badge: "Vegan" },
      glutenFree: { certified: true, note: "<5 ppm gliadin threshold / Grain-free derivation", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: true, value: 840, unit: "mg / 100g", limit: 500, labelHe: "נתרן גבוה", labelEn: "High Sodium" },
      saturatedFat: { triggered: false, value: 2.1, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0.4, unit: "g / 100g", limit: 10.0, labelHe: "סוכר גבוה", labelEn: "Total Sugar" },
      complianceAssessment: "Due to the combination of table salt and sodium nitrite in curing preparations, this sample exceeds the 500mg/100g sodium regulatory barrier and strictly requires prominent display of the red octagonal sodium graphic symbol on the front facing quadrant of retail packaging sold in Israel."
    },
    pesticideResidues: [
      {
        compound: "Chlorpyrifos",
        cas: "2921-88-2",
        group: "Organophosphate",
        detected: "0.038 mg/kg",
        detectedNum: 0.038,
        euMrl: "0.010 mg/kg (LOD / Banned)",
        usEpa: "0.050 mg/kg",
        israelMrl: "0.010 mg/kg (Aligned EU)",
        verdict: "EU/IL Violation (+280%)",
        isViolation: true
      },
      {
        compound: "Glyphosate",
        cas: "1071-83-6",
        group: "Phosphonoglycine",
        detected: "0.042 mg/kg",
        detectedNum: 0.042,
        euMrl: "0.100 mg/kg",
        usEpa: "5.000 mg/kg",
        israelMrl: "0.100 mg/kg",
        verdict: "Within MRL Limits",
        isViolation: false
      },
      {
        compound: "Deltamethrin",
        cas: "52918-63-5",
        group: "Synthetic Pyrethroid",
        detected: "0.015 mg/kg",
        detectedNum: 0.015,
        euMrl: "0.500 mg/kg",
        usEpa: "1.000 mg/kg",
        israelMrl: "0.500 mg/kg",
        verdict: "Safe Residue Margin",
        isViolation: false
      }
    ],
    pesticideGauge: {
      compound: "Chlorpyrifos",
      detected: 0.038,
      euLimit: 0.010,
      usLimit: 0.050,
      maxScale: 0.080,
      alert: "Above demo limit",
      notice: "Regulatory Divergence Notice: While conforming under US EPA 40 CFR food tolerances, this sample breaches EU Standing Committee on Plants, Animals, Food and Feed (SCoPAFF) strict ban. Commercial export into EU-27 single market or Israel will result in border rejection and RASFF alert notification."
    },
    regulatoryDossier: [
      {
        agency: "EFSA (European Union)",
        reg: "Regulation (EC) 1333/2008",
        status: "Tightening Restrictions",
        statusColor: "error",
        adi: "0.07 mg/kg bw",
        description: "Re-evaluated 2023. Directive (EU) 2023/2108 mandates dropping limit from 150 mg/kg down to 80-100 mg/kg by October 2025."
      },
      {
        agency: "US FDA / FSIS",
        reg: "21 CFR §172.175 & 9 CFR §424",
        status: "Active Review 2025",
        statusColor: "amber",
        adi: "0 - 0.1 mg/kg bw",
        description: "Permitted up to 200 ppm ingoing with sodium ascorbate / erythorbate accelerator mandatory to suppress nitrosamine development."
      },
      {
        agency: "JECFA (WHO / FAO)",
        reg: "Codex Stan CXS 192-1995",
        status: "Harmonized Benchmark",
        statusColor: "secondary",
        adi: "0 - 0.07 mg/kg bw",
        description: "Reaffirmed acceptable margin of 0-0.07 mg/kg bw. Highlights botulism inhibition efficacy as paramount risk-benefit tradeoff."
      },
      {
        agency: "Israeli MoH (משרד הבריאות)",
        reg: "Public Health Food Reg 5780",
        status: "Enforced Red Label",
        statusColor: "error",
        adi: "Aligned with EFSA",
        description: "Aligned with EU maximums (150 mg/kg ingoing, 50 mg/kg residual). Strict mandatory sodium front-of-package red graphic seal on all cured formulations."
      }
    ]
  },
  {
    ins: "E171",
    name: "Titanium Dioxide (TiO₂)",
    chemicalName: "Titanium Dioxide",
    formula: "TiO2",
    cas: "13463-67-7",
    einecs: "236-675-5",
    functionalClass: "White Mineral Colorant, Opacifying Agent in Confectionery and Sauces.",
    safetyScore: 28,
    riskLevel: "HIGH CONCERN",
    riskTitle: "Assay Risk: High Concern (EU Banned)",
    riskSubtitle: "Genotoxicity Risk · Nanoparticle Bioaccumulation",
    alertHeadline: "Banned Food Contact Substance in EU",
    alertBadge: "Commission Regulation (EU) 2022/63",
    alertDescription: "Titanium dioxide can no longer be considered safe when used as a food additive. Following a comprehensive review of all available scientific evidence, EFSA concluded that genotoxicity concerns (DNA damage) could not be ruled out after oral ingestion due to nanoparticle bioaccumulation in organs.",
    adi: {
      range: "Not Established",
      unit: "EFSA withdrawal",
      fillPercent: 10,
      note: "EFSA withdrew previous ADI in 2021 citing inability to establish safe exposure threshold."
    },
    carcinogenicity: {
      hazard: "Group 2B",
      tag: "(IARC / Inhalation & Oral)",
      fillPercent: 85,
      note: "IARC classified as possibly carcinogenic; genotoxic reactivity observed in vitro and in vivo."
    },
    maxIngoing: {
      value: "Banned EU / 1%",
      unit: "US permitted ≤1%",
      fillPercent: 30,
      note: "Banned entirely in EU food products. US FDA permits up to 1% by weight without labeling requirement."
    },
    pediatricRisk: {
      value: "Nano",
      sub: "Bioaccumulation",
      fillPercent: 75,
      note: "Elevated systemic absorption in children due to intestinal barrier immaturity and candy consumption."
    },
    dietary: {
      halal: { certified: true, note: "Mineral origin; inert synthesized titanium mineral", badge: "Halal" },
      kosher: { certified: true, note: "Mineral substance, pareve certified across codices", badge: "Pareve" },
      vegan: { certified: true, note: "Mined and refined inorganic mineral, zero animal input", badge: "Vegan" },
      glutenFree: { certified: true, note: "Free of cereal grains and gluten proteins", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 5, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Israeli Ministry of Health advisory committee issued recommendations to harmonize with EU Regulation 2022/63, discouraging titanium dioxide use in local manufacturing."
    },
    pesticideResidues: [
      {
        compound: "Glyphosate",
        cas: "1071-83-6",
        group: "Phosphonoglycine",
        detected: "0.012 mg/kg",
        detectedNum: 0.012,
        euMrl: "0.100 mg/kg",
        usEpa: "5.000 mg/kg",
        israelMrl: "0.100 mg/kg",
        verdict: "Within MRL Limits",
        isViolation: false
      }
    ],
    pesticideGauge: {
      compound: "Glyphosate",
      detected: 0.012,
      euLimit: 0.100,
      usLimit: 5.000,
      maxScale: 0.200,
      alert: "Within demo limits",
      notice: "Zero divergence detected on raw mineral excipient."
    },
    regulatoryDossier: [
      {
        agency: "EFSA (European Union)",
        reg: "Regulation (EU) 2022/63",
        status: "BANNED",
        statusColor: "error",
        adi: "Withdrawn",
        description: "Complete prohibition of E171 in all foodstuffs across EU-27 single market since August 2022."
      },
      {
        agency: "US FDA / FSIS",
        reg: "21 CFR §73.575",
        status: "Permitted ≤1%",
        statusColor: "amber",
        adi: "Not specified",
        description: "Permitted up to 1.0% by weight of food without certification; under consumer safety NGO petition."
      },
      {
        agency: "JECFA (WHO / FAO)",
        reg: "Codex Alimentarius",
        status: "Under Re-evaluation",
        statusColor: "amber",
        adi: "Pending 2025 review",
        description: "JECFA 2023 meeting noted lack of conclusive systemic genotoxicity under current tests, pending further data."
      },
      {
        agency: "Israeli MoH (משרד הבריאות)",
        reg: "Public Health Standards",
        status: "Voluntary Phaseout",
        statusColor: "error",
        adi: "Withdrawn",
        description: "Advised Israeli food processors to eliminate E171 from confectioneries and dairy replacements."
      }
    ]
  },
  {
    ins: "E102",
    name: "Tartrazine",
    chemicalName: "Tartrazine (FD&C Yellow 5)",
    formula: "C16H9N4Na3O9S2",
    cas: "1934-21-0",
    einecs: "217-699-5",
    functionalClass: "Synthetic Lemon Yellow Monoazo Food Colorant.",
    safetyScore: 45,
    riskLevel: "MODERATE CONCERN",
    riskTitle: "Assay Risk: Moderate (Southampton Six)",
    riskSubtitle: "Pediatric Hyperactivity · Histamine Liberator",
    alertHeadline: "Mandatory Child Warning Mandate",
    alertBadge: "EU Regulation 1333/2008 Annex V",
    alertDescription: "Tartrazine is one of the 'Southampton Six' azo dyes linked to hyperactivity (ADHD-like behaviors) and shortened attention span in children. Foods containing E102 in the EU must state: 'May have an adverse effect on activity and attention in children.' Cross-reacts with aspirin in sensitive individuals.",
    adi: {
      range: "0 - 7.5",
      unit: "mg/kg bw/day",
      fillPercent: 50,
      note: "EFSA revised ADI from 0-10 to 0-7.5 mg/kg bw based on immunological and behavioral bio-assays."
    },
    carcinogenicity: {
      hazard: "Group 3",
      tag: "(Not Classifiable as Carcinogen)",
      fillPercent: 35,
      note: "Non-genotoxic directly; concerns center on aromatic amine metabolites (sulfanilic acid)."
    },
    maxIngoing: {
      value: "50 - 500",
      unit: "mg/kg by category",
      fillPercent: 55,
      note: "Strictly limited in beverages (max 100 mg/L) and confections across Europe and Israel."
    },
    pediatricRisk: {
      value: "High",
      sub: "Hyperactivity Flag",
      fillPercent: 85,
      note: "Asthma and urticaria provocation in 10-15% of aspirin-intolerant pediatric subjects."
    },
    dietary: {
      halal: { certified: true, note: "Pure synthetic petroleum-derived azo synthesis", badge: "Halal" },
      kosher: { certified: true, note: "Synthetic chemical compound, certified pareve", badge: "Pareve" },
      vegan: { certified: true, note: "100% synthetic coal-tar derivative, no animal catalysts", badge: "Vegan" },
      glutenFree: { certified: true, note: "Free from wheat, rye, barley, or oat components", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 120, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Israel MoH requires explicit naming of Tartrazine on the primary packaging label rather than general 'food coloring' classification to safeguard asthmatic and sensitive individuals."
    },
    pesticideResidues: [],
    pesticideGauge: {
      compound: "Tartrazine Synthetic Matrix",
      detected: 0,
      euLimit: 0,
      usLimit: 0,
      maxScale: 0.1,
      alert: "Within demo limits",
      notice: "Zero agricultural pesticide cross-contamination in batch chromatography."
    },
    regulatoryDossier: [
      {
        agency: "EFSA (European Union)",
        reg: "Regulation (EC) 1333/2008",
        status: "Warning Label Mandatory",
        statusColor: "amber",
        adi: "7.5 mg/kg bw",
        description: "Mandatory front/back label warning on pediatric behavioral alterations."
      },
      {
        agency: "US FDA / FSIS",
        reg: "21 CFR §74.705",
        status: "Certified FD&C Yellow 5",
        statusColor: "secondary",
        adi: "5.0 mg/kg bw",
        description: "Batch certification mandatory. Requires explicit ingredient disclosure due to allergic reaction prevalence."
      },
      {
        agency: "JECFA (WHO / FAO)",
        reg: "Codex Stan CXS 192",
        status: "Harmonized Limit",
        statusColor: "secondary",
        adi: "0 - 10 mg/kg bw",
        description: "Permitted across broad categories within specified maximum use levels."
      },
      {
        agency: "Israeli MoH (משרד הבריאות)",
        reg: "Public Health Food Regs",
        status: "Explicit Name Required",
        statusColor: "amber",
        adi: "7.5 mg/kg bw",
        description: "Prohibits concealing Tartrazine under generic 'food colors' in bakery and beverages."
      }
    ]
  },
  {
    ins: "E951",
    name: "Aspartame",
    chemicalName: "N-L-α-Aspartyl-L-phenylalanine 1-methyl ester",
    formula: "C14H18N2O5",
    cas: "22839-47-0",
    einecs: "245-261-3",
    functionalClass: "High-Intensity Non-Nutritive Artificial Sweetener (~200x sucrose sweetness).",
    safetyScore: 52,
    riskLevel: "MODERATE CONCERN",
    riskTitle: "Assay Risk: Moderate (IARC Group 2B)",
    riskSubtitle: "Metabolized to Methanol & Phenylalanine · PKU Contraindicated",
    alertHeadline: "IARC 2023 Carcinogenicity Classification",
    alertBadge: "IARC Monograph 134",
    alertDescription: "In July 2023, the International Agency for Research on Cancer (IARC) classified aspartame as 'possibly carcinogenic to humans' (Group 2B), based on limited evidence for hepatocellular carcinoma in humans. JECFA concurrently reaffirmed the ADI of 0-40 mg/kg bw, stating dietary exposure within this limit remains acceptable.",
    adi: {
      range: "0 - 40",
      unit: "mg/kg bw/day",
      fillPercent: 55,
      note: "Equivalent to 9-14 cans of diet soda daily for a 60kg adult without exceeding ADI."
    },
    carcinogenicity: {
      hazard: "Group 2B",
      tag: "(IARC Monograph 134)",
      fillPercent: 65,
      note: "Possibly carcinogenic based on animal models and hepatocellular carcinoma trends."
    },
    maxIngoing: {
      value: "600 - 2000",
      unit: "mg/kg by food category",
      fillPercent: 60,
      note: "Approved in diet sodas, sugar-free desserts, yogurts, and pharmaceuticals."
    },
    pediatricRisk: {
      value: "PKU",
      sub: "Mandatory Warning",
      fillPercent: 95,
      note: "Phenylketonuria warning required worldwide: produces phenylalanine upon metabolic hydrolysis."
    },
    dietary: {
      halal: { certified: true, note: "Amino acid dipeptide synthesis without animal enzymes", badge: "Halal" },
      kosher: { certified: true, note: "Chemical synthesis; Pareve certified", badge: "Pareve" },
      vegan: { certified: true, note: "Produced via synthetic peptide coupling or bacterial fermentation", badge: "Vegan" },
      glutenFree: { certified: true, note: "Gluten-free amino acid derivative", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Mandatory prominent warning on all retail packaging: 'Contains phenylalanine - Not for use by phenylketonurics' (מכיל פנילאלנין - אסור לחולי פנילקטונוריה)."
    },
    pesticideResidues: [],
    pesticideGauge: {
      compound: "Aspartame Hydrolysis Assay",
      detected: 0,
      euLimit: 0,
      usLimit: 0,
      maxScale: 0.1,
      alert: "Within demo limits",
      notice: "Zero agrochemical residues detected."
    },
    regulatoryDossier: [
      {
        agency: "EFSA (European Union)",
        reg: "Regulation (EC) 1333/2008",
        status: "ADI Confirmed (40 mg/kg)",
        statusColor: "secondary",
        adi: "40 mg/kg bw",
        description: "Maintains 40 mg/kg bw ADI; notes conservative safety factor against methanol generation."
      },
      {
        agency: "US FDA / FSIS",
        reg: "21 CFR §172.804",
        status: "Approved General Sweetener",
        statusColor: "secondary",
        adi: "50 mg/kg bw",
        description: "FDA ADI set at 50 mg/kg bw; disagrees with IARC 2B hazard rating without exposure context."
      },
      {
        agency: "JECFA (WHO / FAO)",
        reg: "Joint Expert Committee 2023",
        status: "Harmonized Benchmark",
        statusColor: "secondary",
        adi: "0 - 40 mg/kg bw",
        description: "Reaffirmed ADI of 0-40 mg/kg bw following dual evaluation with IARC."
      },
      {
        agency: "Israeli MoH (משרד הבריאות)",
        reg: "Food Control Service 5780",
        status: "PKU Warning Enforced",
        statusColor: "amber",
        adi: "40 mg/kg bw",
        description: "Strict enforcement of Hebrew PKU caution text across all beverage and table sweeteners."
      }
    ]
  },
  {
    ins: "E330",
    name: "Citric Acid",
    chemicalName: "2-hydroxypropane-1,2,3-tricarboxylic acid",
    formula: "C6H8O7",
    cas: "77-92-9",
    einecs: "201-069-1",
    functionalClass: "Natural Organic Acidulant, Chelation Agent, Antioxidant Synergist.",
    safetyScore: 98,
    riskLevel: "VERY LOW RISK",
    riskTitle: "Assay Risk: GRAS / Benign",
    riskSubtitle: "Endogenous Krebs Cycle Intermediate · Codex Quantum Satis",
    alertHeadline: "Generally Recognized As Safe (GRAS)",
    alertBadge: "Codex Alimentarius Quantum Satis",
    alertDescription: "Citric acid is an omnipresent biological metabolite in human carbohydrate cellular respiration (Krebs cycle). Non-toxic, non-accumulative, and excreted naturally. Used ubiquitously to regulate pH, inhibit bacterial proliferation, and potentiate fruit aromas.",
    adi: {
      range: "Not Limited",
      unit: "Quantum Satis",
      fillPercent: 100,
      note: "JECFA and EFSA have assigned 'ADI not specified', indicating no toxicological ceiling."
    },
    carcinogenicity: {
      hazard: "Group None",
      tag: "(Zero Carcinogenic Potential)",
      fillPercent: 0,
      note: "Natural cellular component; zero mutational or neoplastic activity in all trials."
    },
    maxIngoing: {
      value: "Quantum Satis",
      unit: "GMP governed",
      fillPercent: 100,
      note: "Permitted in virtually all food and beverage matrices at level needed for intended technical effect."
    },
    pediatricRisk: {
      value: "Minimal",
      sub: "Dental Erosion at High Acidity",
      fillPercent: 15,
      note: "Safe internally; frequent exposure to high-concentration sour candy can accelerate enamel demineralization."
    },
    dietary: {
      halal: { certified: true, note: "Fermented from non-alcoholic carbohydrate substrates", badge: "Halal" },
      kosher: { certified: true, note: "Passover certified non-kitniyot grades available", badge: "Pareve" },
      vegan: { certified: true, note: "Aspergillus niger mycelial fermentation from beet/corn sugars", badge: "Vegan" },
      glutenFree: { certified: true, note: "Purified crystalline organic acid, <1 ppm gliadin", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Citric acid does not trigger Israeli MoH red front-of-package warning labels. Frequently used in clean-label formulations."
    },
    pesticideResidues: [],
    pesticideGauge: {
      compound: "Fermentation Substrate Screen",
      detected: 0,
      euLimit: 0,
      usLimit: 0,
      maxScale: 0.1,
      alert: "Within demo limits",
      notice: "Substrates meet pharmaceutical excipient specifications."
    },
    regulatoryDossier: [
      {
        agency: "EFSA (European Union)",
        reg: "Regulation (EC) 1333/2008",
        status: "Quantum Satis (Authorized)",
        statusColor: "secondary",
        adi: "Not Specified",
        description: "Re-evaluated with confirmation of zero safety concerns at current dietary intakes."
      },
      {
        agency: "US FDA / FSIS",
        reg: "21 CFR §184.1033",
        status: "Direct Food Substance GRAS",
        statusColor: "secondary",
        adi: "Not Limited",
        description: "Affirmed as Generally Recognized as Safe with Good Manufacturing Practice limitations."
      },
      {
        agency: "JECFA (WHO / FAO)",
        reg: "Codex Stan CXS 192",
        status: "Table 3 Listed",
        statusColor: "secondary",
        adi: "Not Specified",
        description: "Table 3 additive permitted in all foods in accordance with GMP."
      },
      {
        agency: "Israeli MoH (משרד הבריאות)",
        reg: "Public Health Food Regs",
        status: "Fully Approved",
        statusColor: "secondary",
        adi: "Quantum Satis",
        description: "Unrestricted acidulant across standard food categories."
      }
    ]
  },
  {
    ins: "E211",
    name: "Sodium Benzoate",
    chemicalName: "Sodium Benzoate",
    formula: "C7H5NaO2",
    cas: "532-32-1",
    einecs: "208-534-8",
    functionalClass: "Antimicrobial & Antifungal Preservative in acidic foods (pH < 4.5).",
    safetyScore: 50,
    riskLevel: "MODERATE CONCERN",
    riskTitle: "Assay Risk: Moderate (Benzene Synergy)",
    riskSubtitle: "Decarboxylation with Vitamin C · Mitochondrial DNA Stress",
    alertHeadline: "Chemical Precursor to Benzene (Group 1 Carcinogen)",
    alertBadge: "FDA & EFSA Advisory",
    alertDescription: "When sodium benzoate is formulated alongside Ascorbic Acid (Vitamin C / E300) in the presence of transition metal catalysts (Fe, Cu) and heat/UV light, chemical decarboxylation can produce trace Benzene, an established human leukemogen.",
    adi: {
      range: "0 - 5.0",
      unit: "mg/kg bw/day",
      fillPercent: 50,
      note: "Established by JECFA/EFSA based on hepatotoxicity endpoints in 4-generation animal studies."
    },
    carcinogenicity: {
      hazard: "Group 3 (Non-carcinogenic alone)",
      tag: "Precursor risk with Ascorbic Acid",
      fillPercent: 50,
      note: "Sodium benzoate itself is non-carcinogenic; toxicity stems from benzene formation synergy."
    },
    maxIngoing: {
      value: "150 - 500",
      unit: "mg/kg",
      fillPercent: 50,
      note: "Permitted in carbonated beverages, pickled vegetables, and fruit preparations."
    },
    pediatricRisk: {
      value: "Moderate",
      sub: "Hyperactivity Cocktail Flag",
      fillPercent: 65,
      note: "Associated with increased hyperactivity in preschool children when consumed with food dyes."
    },
    dietary: {
      halal: { certified: true, note: "Pure chemical synthesis from toluene oxidation", badge: "Halal" },
      kosher: { certified: true, note: "Synthetic Pareve compound", badge: "Pareve" },
      vegan: { certified: true, note: "No animal-derived starting materials", badge: "Vegan" },
      glutenFree: { certified: true, note: "Gluten-free chemical salt", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 160, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Requires strict adherence to maximum concentration thresholds in ready-to-drink soft beverages."
    },
    pesticideResidues: [],
    pesticideGauge: {
      compound: "Benzene Derivative Screen",
      detected: 0,
      euLimit: 0.001,
      usLimit: 0.005,
      maxScale: 0.01,
      alert: "Within demo limits",
      notice: "Residual benzene in raw compound < 1 ppb."
    },
    regulatoryDossier: [
      {
        agency: "EFSA (European Union)",
        reg: "Regulation (EC) 1333/2008",
        status: "Regulated Preservative",
        statusColor: "amber",
        adi: "5.0 mg/kg bw",
        description: "Re-evaluated 2016. Maintained ADI of 5.0 mg/kg bw expressed as benzoic acid."
      },
      {
        agency: "US FDA / FSIS",
        reg: "21 CFR §184.1733",
        status: "GRAS up to 0.1%",
        statusColor: "secondary",
        adi: "5.0 mg/kg bw",
        description: "Permitted up to 0.1% by weight. Periodic testing of soft drinks for benzene traces."
      },
      {
        agency: "JECFA (WHO / FAO)",
        reg: "Codex Stan CXS 192",
        status: "Harmonized Benchmark",
        statusColor: "secondary",
        adi: "0 - 5.0 mg/kg bw",
        description: "Limits harmonized across non-alcoholic beverages and condiments."
      },
      {
        agency: "Israeli MoH (משרד הבריאות)",
        reg: "Public Health Food Regs",
        status: "Enforced Limits",
        statusColor: "secondary",
        adi: "5.0 mg/kg bw",
        description: "Mandatory declaration on beverage labels; capped at 150 mg/L in soft drinks."
      }
    ]
  },
  {
    ins: "E621",
    name: "Monosodium Glutamate (MSG)",
    chemicalName: "Monosodium L-glutamate",
    formula: "C5H8NO4Na",
    cas: "142-47-2",
    einecs: "205-538-1",
    functionalClass: "Umami Flavor Enhancer, Excitatory Neurotransmitter Amino Acid Salt.",
    safetyScore: 78,
    riskLevel: "GENERALLY SAFE",
    riskTitle: "Assay Risk: Generally Safe (Sensitivity Thresholds)",
    riskSubtitle: "Naturally Present in Tomatoes & Cheese · EFSA 2017 ADI Set",
    alertHeadline: "EFSA Establishes Group ADI of 30 mg/kg bw",
    alertBadge: "EFSA ANS Panel 2017",
    alertDescription: "EFSA established an ADI of 30 mg/kg bw for glutamates in 2017 after concluding that exposure in high consumers may exceed levels associated with adverse effects (headaches, elevated blood pressure, insulin spikes). The scientific consensus rejects systemic neurotoxicity at culinary doses.",
    adi: {
      range: "30",
      unit: "mg/kg bw/day",
      fillPercent: 75,
      note: "Equivalent to 2.1g/day for a 70kg adult from all dietary sources."
    },
    carcinogenicity: {
      hazard: "Non-Carcinogenic",
      tag: "IARC Not Listed",
      fillPercent: 0,
      note: "Endogenous amino acid building block of proteins; zero carcinogenic potential."
    },
    maxIngoing: {
      value: "10,000",
      unit: "mg/kg (10 g/kg)",
      fillPercent: 70,
      note: "Permitted up to 10 g/kg individually or in combination with other glutamic acid salts."
    },
    pediatricRisk: {
      value: "Low",
      sub: "Excitotoxicity Myth Refuted",
      fillPercent: 20,
      note: "Blood-brain barrier prevents systemic glutamate influx in healthy individuals."
    },
    dietary: {
      halal: { certified: true, note: "Bacterial fermentation from sugar cane / corn glucose", badge: "Halal" },
      kosher: { certified: true, note: "Fermented Pareve certified", badge: "Pareve" },
      vegan: { certified: true, note: "Corynebacterium glutamicum microbial fermentation", badge: "Vegan" },
      glutenFree: { certified: true, note: "Crystalline sodium salt, gluten free", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 300, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Contains 12% sodium by mass compared to 39% in table salt; often used as a partial sodium substitute in savory items."
    },
    pesticideResidues: [],
    pesticideGauge: {
      compound: "Fermentation Assay",
      detected: 0,
      euLimit: 0,
      usLimit: 0,
      maxScale: 0.1,
      alert: "Within demo limits",
      notice: "Batch meets FCC 12 specifications."
    },
    regulatoryDossier: [
      {
        agency: "EFSA (European Union)",
        reg: "Regulation (EC) 1333/2008",
        status: "Group ADI 30 mg/kg",
        statusColor: "amber",
        adi: "30 mg/kg bw",
        description: "Re-evaluation 2017 established explicit group ADI for glutamic acid and salts."
      },
      {
        agency: "US FDA / FSIS",
        reg: "21 CFR §182.1",
        status: "GRAS (Affirmed)",
        statusColor: "secondary",
        adi: "Not Limited",
        description: "Affirmed as GRAS; requires labeling by common name (monosodium glutamate)."
      },
      {
        agency: "JECFA (WHO / FAO)",
        reg: "Codex Stan CXS 192",
        status: "ADI Not Specified",
        statusColor: "secondary",
        adi: "Not Specified",
        description: "Classified as safe food ingredient without explicit quantitative intake ceiling."
      },
      {
        agency: "Israeli MoH (משרד הבריאות)",
        reg: "Food Standard 1145",
        status: "Approved Enhancer",
        statusColor: "secondary",
        adi: "Aligned with EFSA",
        description: "Requires explicit declaration in ingredient list; widespread use in savory snacks and bouillon."
      }
    ]
  },
  {
    ins: "E150d",
    name: "Caramel IV (Sulphite Ammonia Caramel)",
    chemicalName: "Caramel Colour Class IV",
    formula: "Complex polymeric carbohydrate mixture",
    cas: "8028-89-5",
    einecs: "232-435-9",
    functionalClass: "Dark Brown Acid-Stable Colorant in Colas, Beers, and Gravies.",
    safetyScore: 55,
    riskLevel: "MODERATE RISK",
    riskTitle: "Assay Risk: Moderate (4-MEI Presence)",
    riskSubtitle: "Reaction By-product 4-Methylimidazole · Prop 65 Listed",
    alertHeadline: "4-Methylimidazole (4-MEI) Toxicological Threshold",
    alertBadge: "IARC Group 2B By-product",
    alertDescription: "Manufactured by heating carbohydrates with ammonium and sulphite compounds. This reaction produces trace 4-Methylimidazole (4-MEI), classified by IARC as Group 2B (possibly carcinogenic). California Prop 65 established a No Significant Risk Level (NSRL) of 29 µg/day.",
    adi: {
      range: "0 - 300",
      unit: "mg/kg bw/day",
      fillPercent: 60,
      note: "EFSA established an ADI of 300 mg/kg bw for Caramel IV, with a specific limit of 250 mg/kg for 4-MEI."
    },
    carcinogenicity: {
      hazard: "Group 2B By-product",
      tag: "(4-MEI contaminant)",
      fillPercent: 60,
      note: "Caramel itself is non-mutagenic; regulatory control focuses strictly on 4-MEI reduction."
    },
    maxIngoing: {
      value: "Quantum Satis / Category Caps",
      unit: "Cola drinks ~1500 mg/L",
      fillPercent: 65,
      note: "Major beverage manufacturers updated synthesis pathways to achieve <30 ppm 4-MEI levels."
    },
    pediatricRisk: {
      value: "Moderate",
      sub: "High Intake via Colas",
      fillPercent: 55,
      note: "Pediatric exposure driven almost entirely by soft drink and confectionery consumption."
    },
    dietary: {
      halal: { certified: true, note: "Carbohydrate thermal synthesis without ethyl alcohol", badge: "Halal" },
      kosher: { certified: true, note: "Pareve certified sugar breakdown product", badge: "Pareve" },
      vegan: { certified: true, note: "Plant-derived starches (corn, wheat, or cane)", badge: "Vegan" },
      glutenFree: { certified: true, note: "Wheat-derived syrups undergo complete starch hydrolysis (<20 ppm gluten)", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 30, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 5.0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "In carbonated soft beverages, E150d is frequently paired with high total sugar triggering the Israeli MoH red sugar warning label."
    },
    pesticideResidues: [],
    pesticideGauge: {
      compound: "Thermal Synthesis Assay",
      detected: 0,
      euLimit: 0,
      usLimit: 0,
      maxScale: 0.1,
      alert: "Within demo limits",
      notice: "4-MEI residual < 15 ppm (conforms to EU limit of 250 mg/kg solid basis)."
    },
    regulatoryDossier: [
      {
        agency: "EFSA (European Union)",
        reg: "Regulation (EU) 231/2012",
        status: "ADI 300 mg/kg bw",
        statusColor: "secondary",
        adi: "300 mg/kg bw",
        description: "Re-evaluation 2011 confirmed safety under strict purity limits for 4-MEI and THI."
      },
      {
        agency: "US FDA / FSIS",
        reg: "21 CFR §73.85",
        status: "Exempt from Certification",
        statusColor: "secondary",
        adi: "Not Limited",
        description: "FDA reviewed 4-MEI risk data and determined current consumer exposures do not pose danger."
      },
      {
        agency: "JECFA (WHO / FAO)",
        reg: "Codex Stan CXS 192",
        status: "Harmonized ADI",
        statusColor: "secondary",
        adi: "0 - 200 mg/kg bw",
        description: "Endorses Caramel IV safety with max 4-MEI specification of 200 mg/kg."
      },
      {
        agency: "Israeli MoH (משרד הבריאות)",
        reg: "Public Health Food Regs",
        status: "Harmonized with EU",
        statusColor: "secondary",
        adi: "300 mg/kg bw",
        description: "Conforms with EU specifications on 4-MEI limits across soft drinks and vinegars."
      }
    ]
  },
  {
    ins: "E320",
    name: "BHA (Butylated Hydroxyanisole)",
    chemicalName: "2-tert-butyl-4-methoxyphenol & 3-tert-butyl-4-methoxyphenol",
    formula: "C11H16O2",
    cas: "25013-16-5",
    einecs: "246-563-8",
    functionalClass: "Synthetic Phenolic Antioxidant Preservative in edible fats and oils.",
    safetyScore: 35,
    riskLevel: "HIGH CONCERN",
    riskTitle: "Assay Risk: High Concern (Endocrine Disruption)",
    riskSubtitle: "IARC Group 2B · Forestomach Carcinogenicity in Rodents",
    alertHeadline: "Endocrine Disruption & Carcinogenicity Hazard",
    alertBadge: "IARC Group 2B / EU Watchlist",
    alertDescription: "BHA induces forestomach papillomas and carcinomas in rodents. While humans lack a forestomach, concerns regarding endocrine disruption (estrogenic activity) and potential liver toxicity prompted international safety agencies to severely lower permitted usage levels.",
    adi: {
      range: "0 - 1.0",
      unit: "mg/kg bw/day",
      fillPercent: 25,
      note: "EFSA reduced the ADI in 2011 to 1.0 mg/kg bw based on growth retardation and endocrine endpoints."
    },
    carcinogenicity: {
      hazard: "Group 2B",
      tag: "(IARC Carcinogen Registry)",
      fillPercent: 75,
      note: "Possibly carcinogenic to humans; classified on California Prop 65 list of chemical carcinogens."
    },
    maxIngoing: {
      value: "50 - 200",
      unit: "mg/kg in fat phase",
      fillPercent: 35,
      note: "Restricted strictly to fats, oils, dry soup bases, and essential oils. Banned in baby foods."
    },
    pediatricRisk: {
      value: "High",
      sub: "Endocrine Susceptibility",
      fillPercent: 80,
      note: "Strictly banned in all infant formulas and weaning foods in the EU and Israel."
    },
    dietary: {
      halal: { certified: true, note: "Synthetic petrochemical derivative", badge: "Halal" },
      kosher: { certified: true, note: "Chemical Pareve synthesis", badge: "Pareve" },
      vegan: { certified: true, note: "Zero animal components used in synthesis", badge: "Vegan" },
      glutenFree: { certified: true, note: "Completely gluten free", badge: "Gluten Free" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Industrial food manufacturers in Israel are actively transitioning to rosemary extract (E392) or mixed tocopherols (E306) to replace BHA."
    },
    pesticideResidues: [],
    pesticideGauge: {
      compound: "Phenolic Residue Analysis",
      detected: 0,
      euLimit: 0,
      usLimit: 0,
      maxScale: 0.1,
      alert: "Within demo limits",
      notice: "Zero organophosphate cross-contamination."
    },
    regulatoryDossier: [
      {
        agency: "EFSA (European Union)",
        reg: "Regulation (EC) 1333/2008",
        status: "Strictly Restricted",
        statusColor: "error",
        adi: "1.0 mg/kg bw",
        description: "Re-evaluation 2011 reduced ADI; currently on priority watchlist for potential endocrine disruption."
      },
      {
        agency: "US FDA / FSIS",
        reg: "21 CFR §182.3169",
        status: "GRAS ≤0.02% of fat",
        statusColor: "amber",
        adi: "0.5 mg/kg bw",
        description: "Permitted up to 0.02% (200 ppm) of total fat content in food products."
      },
      {
        agency: "JECFA (WHO / FAO)",
        reg: "Codex Stan CXS 192",
        status: "Harmonized ADI",
        statusColor: "amber",
        adi: "0 - 0.5 mg/kg bw",
        description: "Temporary ADI allocated, emphasizing need for further non-rodent endocrine data."
      },
      {
        agency: "Israeli MoH (משרד הבריאות)",
        reg: "Public Health Food Regs",
        status: "Under Watchlist Review",
        statusColor: "error",
        adi: "1.0 mg/kg bw",
        description: "Aligned with EU restricted use matrix; prohibited in foods intended for infants."
      }
    ]
  },
  {
    ins: "E924a",
    name: "Potassium Bromate",
    chemicalName: "Potassium Bromate",
    formula: "KBrO3",
    cas: "7758-01-2",
    einecs: "231-829-8",
    functionalClass: "Flour Maturing and Oxidizing Agent in industrial baking.",
    safetyScore: 10,
    riskLevel: "CRITICAL HAZARD",
    riskTitle: "Assay Risk: Critical (BANNED MULTI-JURISDICTION)",
    riskSubtitle: "Renal & Thyroid Carcinogen · IARC Group 2B (Genotoxic)",
    alertHeadline: "Banned In EU, UK, Canada, Brazil & Israel",
    alertBadge: "Global Ban Enforced",
    alertDescription: "Potassium bromate causes renal cell tumors, thyroid follicular cell tumors, and peritoneal mesotheliomas in laboratory bioassays. Recognized as a genotoxic carcinogen that directly induces oxidative DNA damage. Banned completely across the civilized world with the exception of the United States (where it carries a California Prop 65 cancer warning).",
    adi: {
      range: "BANNED (0)",
      unit: "Zero Tolerance",
      fillPercent: 0,
      note: "JECFA determined potassium bromate is unacceptable as a flour treatment agent due to genotoxicity."
    },
    carcinogenicity: {
      hazard: "Group 2B (Genotoxic Carcinogen)",
      tag: "Direct DNA Strand Cleavage",
      fillPercent: 100,
      note: "Strong epidemiological and experimental proof of renal and thyroid tumor induction."
    },
    maxIngoing: {
      value: "0.0 mg/kg (Prohibited)",
      unit: "EU/IL Limit = 0",
      fillPercent: 0,
      note: "Zero ingoing residue permitted in Israel, Europe, UK, Japan, and Canada."
    },
    pediatricRisk: {
      value: "Critical",
      sub: "Severe Neoplasm Risk",
      fillPercent: 100,
      note: "Strict prohibition in pediatric products globally."
    },
    dietary: {
      halal: { certified: false, note: "Hazardous poison banned under Islamic dietary food purity laws", badge: "Non-Halal" },
      kosher: { certified: false, note: "Pikuach nefesh / dangerous substance prohibition", badge: "Prohibited" },
      vegan: { certified: false, note: "Toxicity profile precludes food grade use", badge: "Unsafe" },
      glutenFree: { certified: false, note: "Historically used strictly in wheat baking", badge: "Toxic" },
      traceability: "Demo record: no batch or certification data"
    },
    israeliMohLabels: {
      sodium: { triggered: false, value: 0, unit: "mg / 100g", limit: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 0, unit: "g / 100g", limit: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0, unit: "g / 100g", limit: 10.0, labelHe: "סוכר", labelEn: "Sugar" },
      complianceAssessment: "Illegal for import, distribution, or manufacturing in the State of Israel. Consignments containing E924a are subject to mandatory seizure and destruction at border control."
    },
    pesticideResidues: [],
    pesticideGauge: {
      compound: "Oxidizing Bromate Hazard",
      detected: 0.05,
      euLimit: 0.0,
      usLimit: 0.02,
      maxScale: 0.05,
      alert: "Above demo limit",
      notice: "Detection in commercial bakery results in immediate criminal regulatory sanction."
    },
    regulatoryDossier: [
      {
        agency: "EFSA (European Union)",
        reg: "Directive 90/496/EEC",
        status: "BANNED",
        statusColor: "error",
        adi: "Withdrawn / 0",
        description: "Prohibited in European Union since 1990 due to demonstrated in vivo genotoxicity."
      },
      {
        agency: "US FDA / FSIS",
        reg: "21 CFR §137.155",
        status: "Permitted (Voluntary Reduction)",
        statusColor: "error",
        adi: "Under Review",
        description: "Still permitted up to 50 ppm in flour despite California Prop 65 warning mandates."
      },
      {
        agency: "JECFA (WHO / FAO)",
        reg: "Codex Alimentarius",
        status: "Unacceptable as Additive",
        statusColor: "error",
        adi: "Withdrawn",
        description: "Formally concluded that use of potassium bromate as a flour improver is not acceptable."
      },
      {
        agency: "Israeli MoH (משרד הבריאות)",
        reg: "Public Health Regulations (Food)",
        status: "BANNED",
        statusColor: "error",
        adi: "Zero Tolerance",
        description: "Strict national prohibition; banned in all industrial bread production across Israel."
      }
    ]
  }
];

export const ADDITIVES_DATABASE = [...BASE_ADDITIVES, ...CURATED_ADDITIVES];

export const NUTRITION_DATABASE = [
  {
    code: "#IL-8841",
    nameHe: "חומוס מוכן למריחה",
    nameEn: "Commercial Hummus Spread",
    category: "Legumes & Dips",
    servingSize: "100g",
    calories: 166,
    protein: 8.0,
    totalFat: 9.6,
    saturatedFat: 1.4,
    carbohydrates: 14.3,
    sugars: 0.5,
    fiber: 6.0,
    sodium: 420,
    calcium: 45,
    iron: 2.1,
    potassium: 290,
    cholesterol: 0,
    isSolid: true,
    labels: {
      sodium: { triggered: false, value: 420, threshold: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 1.4, threshold: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 0.5, threshold: 10.0, labelHe: "סוכר", labelEn: "Sugar" }
    },
    dietary: { vegan: true, kosher: "Pareve", halal: true, glutenFree: true },
    description: "Standard Israeli retail packaged chickpea spread prepared with tahini, lemon juice, and cumin. High dietary fiber."
  },
  {
    code: "#IL-3012",
    nameHe: "טחינה גולמית משומשום מלא",
    nameEn: "Raw Whole Sesame Tahini",
    category: "Seeds & Pastes",
    servingSize: "100g",
    calories: 630,
    protein: 25.0,
    totalFat: 57.0,
    saturatedFat: 8.5,
    carbohydrates: 6.0,
    sugars: 0.8,
    fiber: 8.0,
    sodium: 15,
    calcium: 420,
    iron: 7.5,
    potassium: 410,
    cholesterol: 0,
    isSolid: true,
    labels: {
      sodium: { triggered: false, value: 15, threshold: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: true, value: 8.5, threshold: 5.0, labelHe: "שומן רווי גבוה", labelEn: "High Sat. Fat" },
      sugar: { triggered: false, value: 0.8, threshold: 10.0, labelHe: "סוכר", labelEn: "Sugar" }
    },
    dietary: { vegan: true, kosher: "Pareve", halal: true, glutenFree: true },
    description: "100% whole ground Ethiopian sesame paste. Rich in natural phytosterols, calcium, and plant protein. Triggers red saturated fat label."
  },
  {
    code: "#IL-5120",
    nameHe: "פלאפל מטוגן בשמן עמוק",
    nameEn: "Traditional Deep Fried Falafel Balls",
    category: "Fried Snacks & Street Food",
    servingSize: "100g",
    calories: 285,
    protein: 13.0,
    totalFat: 17.5,
    saturatedFat: 2.2,
    carbohydrates: 31.0,
    sugars: 1.8,
    fiber: 7.2,
    sodium: 540,
    calcium: 80,
    iron: 3.4,
    potassium: 450,
    cholesterol: 0,
    isSolid: true,
    labels: {
      sodium: { triggered: true, value: 540, threshold: 500, labelHe: "נתרן גבוה", labelEn: "High Sodium" },
      saturatedFat: { triggered: false, value: 2.2, threshold: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 1.8, threshold: 10.0, labelHe: "סוכר", labelEn: "Sugar" }
    },
    dietary: { vegan: true, kosher: "Pareve", halal: true, glutenFree: false },
    description: "Traditional chickpea balls seasoned with parsley, coriander, and garlic. Triggers red sodium symbol (>500 mg)."
  },
  {
    code: "#IL-4290",
    nameHe: "שקשוקה מסורתית ברוטב עגבניות",
    nameEn: "Traditional Shakshuka in Rich Tomato Sauce",
    category: "Prepared Dishes",
    servingSize: "100g",
    calories: 115,
    protein: 6.2,
    totalFat: 7.5,
    saturatedFat: 1.8,
    carbohydrates: 5.8,
    sugars: 3.5,
    fiber: 1.9,
    sodium: 380,
    calcium: 35,
    iron: 1.5,
    potassium: 320,
    cholesterol: 160,
    isSolid: true,
    labels: {
      sodium: { triggered: false, value: 380, threshold: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 1.8, threshold: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 3.5, threshold: 10.0, labelHe: "סוכר", labelEn: "Sugar" }
    },
    dietary: { vegan: false, kosher: "Pareve", halal: true, glutenFree: true },
    description: "Poached eggs in simmered tomatoes, sweet bell peppers, onions, and olive oil. Free of red warning labels."
  },
  {
    code: "#IL-1045",
    nameHe: "גבינה צהובה 28% שומן",
    nameEn: "Yellow Cheese (Emmental / Gouda Style) 28%",
    category: "Dairy",
    servingSize: "100g",
    calories: 350,
    protein: 25.0,
    totalFat: 28.0,
    saturatedFat: 17.8,
    carbohydrates: 0.1,
    sugars: 0.1,
    fiber: 0,
    sodium: 650,
    calcium: 850,
    iron: 0.3,
    potassium: 95,
    cholesterol: 90,
    isSolid: true,
    labels: {
      sodium: { triggered: true, value: 650, threshold: 500, labelHe: "נתרן גבוה", labelEn: "High Sodium" },
      saturatedFat: { triggered: true, value: 17.8, threshold: 5.0, labelHe: "שומן רווי גבוה", labelEn: "High Sat. Fat" },
      sugar: { triggered: false, value: 0.1, threshold: 10.0, labelHe: "סוכר", labelEn: "Sugar" }
    },
    dietary: { vegan: false, kosher: "Dairy (Chalav Yisrael)", halal: true, glutenFree: true },
    description: "Aged semi-hard cow milk cheese. Triggers TWO red warning labels: High Sodium and High Saturated Fat."
  },
  {
    code: "#IL-1011",
    nameHe: "גבינת קוטג' 5% שומן",
    nameEn: "Cottage Cheese 5% Fat",
    category: "Dairy",
    servingSize: "100g",
    calories: 92,
    protein: 11.0,
    totalFat: 5.0,
    saturatedFat: 3.1,
    carbohydrates: 1.5,
    sugars: 1.2,
    fiber: 0,
    sodium: 360,
    calcium: 110,
    iron: 0.1,
    potassium: 120,
    cholesterol: 18,
    isSolid: true,
    labels: {
      sodium: { triggered: false, value: 360, threshold: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: false, value: 3.1, threshold: 5.0, labelHe: "שומן רווי", labelEn: "Sat. Fat" },
      sugar: { triggered: false, value: 1.2, threshold: 10.0, labelHe: "סוכר", labelEn: "Sugar" }
    },
    dietary: { vegan: false, kosher: "Dairy", halal: true, glutenFree: true },
    description: "Classic Israeli fresh curd cottage cheese. Below all red warning label thresholds."
  },
  {
    code: "#IL-7721",
    nameHe: "במבה חטיף בוטנים קלאסי",
    nameEn: "Bamba Peanut Puff Snack",
    category: "Extruded Snacks",
    servingSize: "100g",
    calories: 535,
    protein: 17.5,
    totalFat: 34.0,
    saturatedFat: 5.8,
    carbohydrates: 40.0,
    sugars: 3.5,
    fiber: 5.2,
    sodium: 390,
    calcium: 70,
    iron: 4.8,
    potassium: 480,
    cholesterol: 0,
    isSolid: true,
    labels: {
      sodium: { triggered: false, value: 390, threshold: 500, labelHe: "נתרן", labelEn: "Sodium" },
      saturatedFat: { triggered: true, value: 5.8, threshold: 5.0, labelHe: "שומן רווי גבוה", labelEn: "High Sat. Fat" },
      sugar: { triggered: false, value: 3.5, threshold: 10.0, labelHe: "סוכר", labelEn: "Sugar" }
    },
    dietary: { vegan: true, kosher: "Pareve", halal: true, glutenFree: true },
    description: "Baked corn and peanut butter puffs fortified with B-vitamins and iron. Triggers red saturated fat label (5.8g > 5.0g)."
  },
  {
    code: "#IL-7734",
    nameHe: "ביסלי גריל חטיף חיטה",
    nameEn: "Bisli Grill Wheat Snack",
    category: "Extruded Snacks",
    servingSize: "100g",
    calories: 480,
    protein: 10.0,
    totalFat: 22.0,
    saturatedFat: 9.8,
    carbohydrates: 60.0,
    sugars: 2.5,
    fiber: 3.5,
    sodium: 890,
    calcium: 25,
    iron: 1.8,
    potassium: 190,
    cholesterol: 0,
    isSolid: true,
    labels: {
      sodium: { triggered: true, value: 890, threshold: 500, labelHe: "נתרן גבוה", labelEn: "High Sodium" },
      saturatedFat: { triggered: true, value: 9.8, threshold: 5.0, labelHe: "שומן רווי גבוה", labelEn: "High Sat. Fat" },
      sugar: { triggered: false, value: 2.5, threshold: 10.0, labelHe: "סוכר", labelEn: "Sugar" }
    },
    dietary: { vegan: true, kosher: "Pareve", halal: true, glutenFree: false },
    description: "Fried seasoned wheat pasta snack. Triggers BOTH Red Sodium (890 mg) and Red Saturated Fat (9.8g)."
  }
];

export const PESTICIDES_DATABASE = [
  {
    compound: "Chlorpyrifos",
    cas: "2921-88-2",
    group: "Organophosphate",
    crops: ["Wheat", "Apples", "Citrus", "Cured Meats"],
    detectedResidue: "0.038 mg/kg",
    detectedNum: 0.038,
    euMrl: "0.010 mg/kg (LOD / Banned)",
    usEpa: "0.050 mg/kg",
    israelMrl: "0.010 mg/kg (Aligned EU)",
    status: "BANNED / Strict Restriction",
    updated: "2023",
    verdict: "EU/IL Violation (+280%)",
    isViolation: true,
    neurodevelopmentalAlert: true,
    divergenceNotice: "Regulatory Divergence Notice: While conforming under US EPA 40 CFR food tolerances, this sample breaches EU SCoPAFF ban. Commercial export into EU-27 single market or Israel will result in border rejection and RASFF alert notification."
  },
  {
    compound: "Glyphosate",
    cas: "1071-83-6",
    group: "Phosphonoglycine",
    crops: ["Wheat", "Soy", "Barley", "Corn"],
    detectedResidue: "0.042 mg/kg",
    detectedNum: 0.042,
    euMrl: "0.100 mg/kg",
    usEpa: "5.000 mg/kg",
    israelMrl: "0.100 mg/kg",
    status: "Active (Re-approved to 2033)",
    updated: "2023",
    verdict: "Within MRL Limits",
    isViolation: false,
    neurodevelopmentalAlert: false,
    divergenceNotice: "Compliant across Israel MoH, EFSA, and US EPA benchmarks for processed grain matrices."
  },
  {
    compound: "Deltamethrin",
    cas: "52918-63-5",
    group: "Synthetic Pyrethroid",
    crops: ["Tomato", "Citrus", "Olives", "Wheat"],
    detectedResidue: "0.015 mg/kg",
    detectedNum: 0.015,
    euMrl: "0.500 mg/kg",
    usEpa: "1.000 mg/kg",
    israelMrl: "0.500 mg/kg",
    status: "Active / Permitted",
    updated: "2024",
    verdict: "Safe Residue Margin",
    isViolation: false,
    neurodevelopmentalAlert: false,
    divergenceNotice: "Residue levels well within safety margins established by Codex Alimentarius and Israeli Ministry of Agriculture PPIS."
  },
  {
    compound: "Imidacloprid",
    cas: "138261-41-3",
    group: "Neonicotinoid",
    crops: ["Apples", "Grapes", "Potatoes", "Cucumber"],
    detectedResidue: "0.025 mg/kg",
    detectedNum: 0.025,
    euMrl: "0.010 mg/kg (Banned Outdoor)",
    usEpa: "0.500 mg/kg",
    israelMrl: "0.010 mg/kg (Aligned EU)",
    status: "Restricted / Pollinator Hazard",
    updated: "2023",
    verdict: "EU/IL Violation (+150%)",
    isViolation: true,
    neurodevelopmentalAlert: false,
    divergenceNotice: "Banned for outdoor crop usage in the EU due to acute bee colony collapse disorder. Breaches aligned Israeli MRL limit."
  },
  {
    compound: "Boscalid",
    cas: "188425-85-6",
    group: "Pyridine-carboxamide",
    crops: ["Strawberries", "Grapes", "Tomatoes", "Bell Peppers"],
    detectedResidue: "0.850 mg/kg",
    detectedNum: 0.850,
    euMrl: "3.000 mg/kg",
    usEpa: "4.500 mg/kg",
    israelMrl: "3.000 mg/kg",
    status: "Active Fungicide",
    updated: "2023",
    verdict: "Safe Residue Margin",
    isViolation: false,
    neurodevelopmentalAlert: false,
    divergenceNotice: "Fungicide residue detected within acceptable commercial MRL thresholds for soft fruit commodities."
  }
];

// --- Utility Helpers ---
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function normalizeENumbers(str) {
  if (!str) return '';
  return str.replace(/\b[Ee][\s\-](\d{3,4}[a-zA-Z]?)\b/g, (match, p1) => 'E' + p1.toUpperCase());
}

export function matchesWholeWord(text, phrase) {
  if (!text || !phrase) return false;
  const escaped = escapeRegExp(phrase);
  const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
  return regex.test(text);
}

export function getAdditiveNames(item) {
  const names = new Set();

  function addClean(str) {
    if (!str) return;
    const s = str.trim().toLowerCase();
    if (s.length >= 3) {
      names.add(s);
      if (s.length >= 6 && s.endsWith('s')) {
        names.add(s.slice(0, -1));
      }
    }
  }

  function processNameField(field) {
    if (!field) return;
    addClean(field);
    const withoutParens = field.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
    if (withoutParens && withoutParens !== field) {
      addClean(withoutParens);
    }
    const bracketMatches = field.match(/\(([^)]+)\)/g);
    if (bracketMatches) {
      for (const bm of bracketMatches) {
        addClean(bm.slice(1, -1).trim());
      }
    }
  }

  processNameField(item.name);
  processNameField(item.chemicalName);

  if (item.ins === 'INGR-PALM') {
    addClean('palm oil');
    addClean('palm fat');
  }
  if (item.ins === 'INGR-TRANSFAT') {
    addClean('partially hydrogenated');
    addClean('hydrogenated vegetable oil');
    addClean('hydrogenated soybean oil');
    addClean('trans fat');
  }
  if (item.ins === 'E471') {
    addClean('mono- and diglycerides');
    addClean('mono and diglycerides');
    addClean('monoglycerides');
  }
  if (item.ins === 'E150d') {
    addClean('caramel color');
    addClean('caramel colour');
  }
  if (item.ins === 'E322') {
    addClean('lecithin');
    addClean('soy lecithin');
    addClean('sunflower lecithin');
  }
  if (item.ins === 'INGR-HFCS') {
    addClean('hfcs');
    addClean('glucose-fructose syrup');
  }

  return Array.from(names);
}

/**
 * Scan an ingredient string for additives, synergies, allergen risks, and dietary flags
 */
export function scanIngredientList(ingredientsText) {
  if (!ingredientsText || typeof ingredientsText !== 'string' || !ingredientsText.trim()) {
    return {
      risk: "UNKNOWN",
      score: 100,
      matchedAdditives: [],
      synergies: [],
      bannedNotes: [],
      allergenWarnings: [],
      dietaryCompatibility: { halal: true, kosher: true, vegan: true, glutenFree: true },
      summary: "No ingredient text provided."
    };
  }

  const textNorm = normalizeENumbers(ingredientsText);
  const textLower = textNorm.toLowerCase();
  const matched = [];
  const synergies = [];
  const bannedNotes = [];
  const allergenWarnings = [];

  // Match additives: only when a whole-word E-number (normalised) or one of its names appears in the list
  for (const item of ADDITIVES_DATABASE) {
    const insMatch = matchesWholeWord(textNorm, item.ins);
    const names = getAdditiveNames(item);
    const nameMatch = names.some(n => matchesWholeWord(textLower, n));
    if (insMatch || nameMatch) {
      matched.push(item);
    }
  }

  // Check critical chemical synergies
  const hasBenzoate = matchesWholeWord(textLower, "e211") || matchesWholeWord(textLower, "benzoate") || matchesWholeWord(textLower, "benzoates") || matchesWholeWord(textLower, "sodium benzoate");
  const hasAscorbic = matchesWholeWord(textLower, "e300") || matchesWholeWord(textLower, "ascorbic") || matchesWholeWord(textLower, "ascorbic acid") || matchesWholeWord(textLower, "vitamin c");
  if (hasBenzoate && hasAscorbic) {
    synergies.push({
      compound1: "Sodium Benzoate (E211)",
      compound2: "Ascorbic Acid (Vitamin C / E300)",
      mechanism: "Benzene Carcinogenesis",
      severity: "HIGH",
      description: "Reaction of sodium benzoate with ascorbic acid in liquid food under ambient heat and light yields benzene, an IARC Group 1 human leukemogen."
    });
  }

  const hasNitrite = matchesWholeWord(textLower, "e250") || matchesWholeWord(textLower, "nitrite") || matchesWholeWord(textLower, "nitrites") || matchesWholeWord(textLower, "sodium nitrite");
  const hasMeatOrAmine = matchesWholeWord(textLower, "meat") || matchesWholeWord(textLower, "pork") || matchesWholeWord(textLower, "beef") || matchesWholeWord(textLower, "poultry") || matchesWholeWord(textLower, "cured") || matchesWholeWord(textLower, "protein");
  if (hasNitrite && hasMeatOrAmine) {
    synergies.push({
      compound1: "Sodium Nitrite (E250)",
      compound2: "Secondary Protein Amines",
      mechanism: "N-Nitrosamine Formation",
      severity: "HIGH",
      description: "Endogenous nitrosation yields volatile NDMA nitrosamines under thermal curing conditions. Exceeds EFSA Margin of Exposure threshold."
    });
  }

  const hasCaramel4 = matchesWholeWord(textLower, "e150d") || matchesWholeWord(textLower, "caramel iv") || matchesWholeWord(textLower, "sulphite ammonia") || matchesWholeWord(textLower, "sulfite ammonia");
  if (hasCaramel4) {
    synergies.push({
      compound1: "Caramel IV (E150d)",
      compound2: "Thermal Reaction Intermediates",
      mechanism: "4-Methylimidazole (4-MEI) Threshold",
      severity: "MODERATE",
      description: "Contains 4-MEI by-product regulated by California Prop 65 and EFSA maximum specifications."
    });
  }

  // Southampton Six Artificial Colors Hyperactivity Check
  const hasSouthampton = [
    "e102", "tartrazine", "e110", "sunset yellow", "e122", "carmoisine", "azorubine",
    "e124", "ponceau", "e129", "allura red", "e104", "quinoline yellow"
  ].some(term => matchesWholeWord(textLower, term));
  if (hasSouthampton) {
    synergies.push({
      compound1: "Southampton Six Synthetic Azo Dyes",
      compound2: "Pediatric Central Nervous System",
      mechanism: "Neuro-Behavioral Excitation",
      severity: "MODERATE",
      description: "Mandatory EU Warning: 'May have an adverse effect on activity and attention in children.'"
    });
  }

  // Allergen checks (strictly whole-word: "eggplant" never raises an egg warning)
  if (/\b(peanuts?|בוטנים)\b/i.test(textNorm)) allergenWarnings.push("Peanuts / בוטנים");
  if (/\b(milk|dairy|casein|whey|חלב)\b/i.test(textNorm)) allergenWarnings.push("Milk / Dairy / חלב");
  if (/\b(wheat|gluten|חיטה|גלוטן)\b/i.test(textNorm)) allergenWarnings.push("Wheat / Gluten / חיטה");
  if (/\b(soy|soya|סויה)\b/i.test(textNorm)) allergenWarnings.push("Soy / סויה");
  if (/\b(sesame|tahini|טחינה|שומשום)\b/i.test(textNorm)) allergenWarnings.push("Sesame / שומשום");
  if (/\b(eggs?|ביצים)\b/i.test(textNorm)) allergenWarnings.push("Eggs / ביצים");
  if (/\b(e220|sulphites?|sulfites?|גופרית)\b/i.test(textNorm)) allergenWarnings.push("Sulfites / E220 (>10 mg/kg)");

  // Banned additives & critical ingredient checks (whole-word)
  if (/\b(e171|titanium dioxide)\b/i.test(textNorm)) {
    bannedNotes.push("E171 (Titanium Dioxide) is banned in the European Union (Regulation 2022/63) and under phaseout in Israel.");
  }
  if (/\b(e924a|potassium bromate)\b/i.test(textNorm)) {
    bannedNotes.push("E924a (Potassium Bromate) is strictly BANNED in the EU, UK, Israel, and Canada due to renal carcinogenicity.");
  }
  if (/\b(e320|bha|butylated hydroxyanisole)\b/i.test(textNorm)) {
    bannedNotes.push("E320 (BHA) is subject to strict restrictions due to endocrine disruption and IARC 2B carcinogenicity.");
  }
  if (/\b(partially hydrogenated|hydrogenated vegetable oil|hydrogenated soybean oil|trans fats?)\b/i.test(textNorm)) {
    bannedNotes.push("Industrial Trans Fatty Acids (PHO) are legally banned in the US and restricted to <2% in the EU and Israel.");
  }

  // Calculate overall risk
  let risk = "LOW";
  let minScore = 95;
  if (bannedNotes.length > 0) {
    risk = "HIGH / BANNED INGREDIENTS DETECTED";
    minScore = 25;
  } else if (synergies.some(s => s.severity === "HIGH") || matched.some(m => m.safetyScore < 60)) {
    risk = "MODERATE - HIGH RISK PROFILE";
    minScore = 58;
  } else if (synergies.length > 0 || matched.length > 0) {
    risk = "MODERATE RISK";
    minScore = 65;
  }

  return {
    risk,
    score: minScore,
    matchedAdditives: matched,
    synergies,
    bannedNotes,
    allergenWarnings,
    dietaryCompatibility: {
      halal: !/\b(pork|gelatin|alcohol|חזיר|אלכוהול)\b/i.test(textNorm),
      kosher: !/\b(pork|shellfish|חזיר|שרצים)\b/i.test(textNorm),
      vegan: !/\b(milk|dairy|meat|pork|beef|poultry|eggs?|honey|gelatin|חלב|בשר|ביצים|דבש)\b/i.test(textNorm),
      glutenFree: !/\b(wheat|barley|rye|gluten|חיטה|שעורה|שיפון|גלוטן)\b/i.test(textNorm)
    },
    summary: `Risk: ${risk} — ${matched.length} monitored additives detected. ${synergies.length} synergistic chemical interactions flagged.`
  };
}

function normalizeSpelling(str) {
  return (str || '')
    .toLowerCase()
    .replace(/colour/g, 'color')
    .replace(/flavour/g, 'flavor')
    .replace(/sulphite/g, 'sulfite')
    .replace(/sulphur/g, 'sulfur');
}

/**
 * Search additives by query keyword, category, or concern
 */
export function searchAdditives(query = "", category = "") {
  const qNorm = normalizeSpelling(query.trim());
  const catNorm = normalizeSpelling(category.trim());

  return ADDITIVES_DATABASE.filter(item => {
    let matchesCat = true;
    if (catNorm) {
      if (catNorm.includes("banned")) {
        matchesCat = item.ins === "E171" || item.ins === "E924a" || (item.riskLevel && item.riskLevel.toUpperCase().includes("BANNED"));
      } else {
        matchesCat = normalizeSpelling(item.functionalClass).includes(catNorm);
      }
    }

    let matchesQ = true;
    if (qNorm) {
      const isBannedQ = qNorm.includes("banned") && (item.ins === "E171" || item.ins === "E924a" || (item.riskLevel && item.riskLevel.toUpperCase().includes("BANNED")));
      matchesQ = isBannedQ ||
        item.ins.toLowerCase().includes(qNorm) ||
        normalizeSpelling(item.name).includes(qNorm) ||
        normalizeSpelling(item.chemicalName).includes(qNorm) ||
        (item.cas && item.cas.toLowerCase().includes(qNorm)) ||
        normalizeSpelling(item.functionalClass).includes(qNorm) ||
        normalizeSpelling(item.riskTitle).includes(qNorm) ||
        normalizeSpelling(item.riskLevel).includes(qNorm);
    }

    return matchesQ && matchesCat;
  });
}

/**
 * Check additive by E-number, name, or CAS across the demo database.
 * Returns null unless exactly one record fits.
 */
export function checkAdditive(query = "E250") {
  if (!query || typeof query !== 'string') return null;
  const qTrim = query.trim();
  if (!qTrim) return null;
  const qNorm = normalizeENumbers(qTrim);

  // 1. E-number typed alone or found as a whole word
  const matchedByIns = [];
  for (const item of ADDITIVES_DATABASE) {
    const insNorm = item.ins.toUpperCase();
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${escapeRegExp(insNorm)}([^a-zA-Z0-9]|$)`, 'i');
    if (regex.test(qNorm)) {
      matchedByIns.push(item);
    }
  }
  if (matchedByIns.length > 1) return null;
  if (matchedByIns.length === 1) {
    for (const other of ADDITIVES_DATABASE) {
      if (other.ins !== matchedByIns[0].ins) {
        const names = getAdditiveNames(other);
        if (names.some(n => matchesWholeWord(qNorm, n))) {
          return null; // names two different additives
        }
      }
    }
    return matchedByIns[0];
  }

  // 2. Exact CAS number
  const matchedByCas = ADDITIVES_DATABASE.filter(a => a.cas && a.cas.toLowerCase() === qTrim.toLowerCase());
  if (matchedByCas.length === 1) return matchedByCas[0];
  if (matchedByCas.length > 1) return null;

  // 3. Exact name
  const qLower = qTrim.toLowerCase();
  const matchedByExactName = ADDITIVES_DATABASE.filter(item => getAdditiveNames(item).includes(qLower));
  if (matchedByExactName.length === 1) return matchedByExactName[0];
  if (matchedByExactName.length > 1) return null;

  // 4. Longest name found in query as whole words
  const matchedNames = [];
  for (const item of ADDITIVES_DATABASE) {
    const names = getAdditiveNames(item);
    for (const n of names) {
      if (matchesWholeWord(qNorm, n)) {
        matchedNames.push({ item, name: n, length: n.length });
      }
    }
  }
  if (matchedNames.length > 0) {
    const uniqueAdditives = new Set(matchedNames.map(m => m.item.ins));
    if (uniqueAdditives.size > 1) return null; // names two different additives

    const maxLength = Math.max(...matchedNames.map(m => m.length));
    const longest = matchedNames.filter(m => m.length === maxLength);
    const longestAdditives = new Set(longest.map(m => m.item.ins));
    if (longestAdditives.size === 1) {
      return longest[0].item;
    }
    return null;
  }

  // 5. Part of a name of four letters or more that fits exactly one additive
  if (qLower.length >= 4) {
    const matchedBySub = ADDITIVES_DATABASE.filter(item =>
      getAdditiveNames(item).some(n => n.includes(qLower))
    );
    if (matchedBySub.length === 1) return matchedBySub[0];
    return null;
  }

  return null;
}

/**
 * Look up nutrition data for a food item (Hebrew or English).
 * Returns null unless exactly one record fits.
 */
export function checkNutrition(query = "חומוס") {
  if (!query || typeof query !== 'string') return null;
  const qTrim = query.trim();
  if (!qTrim) return null;
  const qLower = qTrim.toLowerCase();

  // 1. Exact English or Hebrew name
  const exactMatches = NUTRITION_DATABASE.filter(item =>
    item.nameEn.toLowerCase() === qLower ||
    item.nameHe.trim() === qTrim
  );
  if (exactMatches.length === 1) return exactMatches[0];
  if (exactMatches.length > 1) return null;

  // 2. Query that contains a full name
  const containsMatches = NUTRITION_DATABASE.filter(item =>
    qLower.includes(item.nameEn.toLowerCase()) ||
    qTrim.includes(item.nameHe.trim())
  );
  if (containsMatches.length === 1) return containsMatches[0];
  if (containsMatches.length > 1) return null;

  // 3. Start-of-word part of three letters or more that fits one food only
  if (qTrim.length >= 3) {
    const wordMatches = NUTRITION_DATABASE.filter(item => {
      const wordsEn = item.nameEn.toLowerCase().split(/[\s,()\/]+/).filter(w => w.length > 0);
      const wordsHe = item.nameHe.split(/[\s,()\/]+/).filter(w => w.length > 0);
      return wordsEn.some(w => w.startsWith(qLower)) || wordsHe.some(w => w.startsWith(qTrim));
    });
    if (wordMatches.length === 1) return wordMatches[0];
  }

  return null;
}

function toSingular(word) {
  const w = (word || '').trim().toLowerCase();
  if (w.endsWith('ies') && w.length > 4) return w.slice(0, -3) + 'y';
  if ((w.endsWith('oes') || w.endsWith('ses')) && w.length > 4) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) return w.slice(0, -1);
  return w;
}

/**
 * Check pesticide MRL limits by query or substance/crop.
 * Returns null unless exactly one record fits.
 */
export function checkPesticideMrl(query = "glyphosate wheat") {
  if (!query || typeof query !== 'string') return null;
  const qTrim = query.trim();
  if (!qTrim) return null;

  // 1. A pesticide named as a whole word, or its exact CAS number, wins over a crop
  const matchedByPesticide = [];
  for (const p of PESTICIDES_DATABASE) {
    const isCas = p.cas && p.cas.toLowerCase() === qTrim.toLowerCase();
    const isNamed = matchesWholeWord(qTrim, p.compound);
    if (isCas || isNamed) {
      matchedByPesticide.push(p);
    }
  }
  if (matchedByPesticide.length === 1) return matchedByPesticide[0];
  if (matchedByPesticide.length > 1) return null;

  // 2. Compare crops in singular form on both sides
  const allKnownCrops = new Set();
  for (const p of PESTICIDES_DATABASE) {
    for (const c of p.crops) {
      allKnownCrops.add(toSingular(c));
      for (const part of c.split(/\s+/)) {
        allKnownCrops.add(toSingular(part));
      }
    }
  }

  // Tokenize query words
  const queryTokens = qTrim.toLowerCase().split(/[\s,&]+/).filter(Boolean).map(toSingular);
  if (queryTokens.length === 0) return null;

  // A crop answers only when the query names nothing but crops and exactly one pesticide lists that crop
  const allAreCrops = queryTokens.every(tok => allKnownCrops.has(tok));
  if (!allAreCrops) return null;

  const matchingPesticides = PESTICIDES_DATABASE.filter(p => {
    const pCropsSingular = p.crops.map(toSingular);
    const pCropParts = p.crops.flatMap(c => c.split(/\s+/).map(toSingular));
    return queryTokens.every(tok => pCropsSingular.includes(tok) || pCropParts.includes(tok));
  });

  if (matchingPesticides.length === 1) return matchingPesticides[0];
  return null;
}

export const checkIngredientList = scanIngredientList;


