export interface AdditiveDossier {
  ins: string;
  name: string;
  chemicalName: string;
  formula: string;
  cas: string;
  einecs: string;
  functionalClass: string;
  safetyScore: number;
  riskLevel: string;
  riskTitle: string;
  riskSubtitle: string;
  alertHeadline: string;
  alertBadge: string;
  alertDescription: string;
  adi: {
    range: string;
    unit: string;
    fillPercent: number;
    note: string;
  };
  carcinogenicity: {
    hazard: string;
    tag: string;
    fillPercent: number;
    note: string;
  };
  maxIngoing: {
    value: string;
    unit: string;
    fillPercent: number;
    note: string;
  };
  pediatricRisk: {
    value: string;
    sub: string;
    fillPercent: number;
    note: string;
  };
  dietary: {
    halal: { certified: boolean; note: string; badge: string };
    kosher: { certified: boolean; note: string; badge: string };
    vegan: { certified: boolean; note: string; badge: string };
    glutenFree: { certified: boolean; note: string; badge: string };
    traceability: string;
  };
  israeliMohLabels: {
    sodium: { triggered: boolean; value: number; unit: string; limit: number; labelHe: string; labelEn: string };
    saturatedFat: { triggered: boolean; value: number; unit: string; limit: number; labelHe: string; labelEn: string };
    sugar: { triggered: boolean; value: number; unit: string; limit: number; labelHe: string; labelEn: string };
    complianceAssessment: string;
  };
  pesticideResidues: Array<{
    compound: string;
    cas: string;
    group: string;
    detected: string;
    detectedNum: number;
    euMrl: string;
    usEpa: string;
    israelMrl: string;
    verdict: string;
    isViolation: boolean;
  }>;
  pesticideGauge: {
    compound: string;
    detected: number;
    euLimit: number;
    usLimit: number;
    maxScale: number;
    alert: string;
    notice: string;
  };
  regulatoryDossier: Array<{
    agency: string;
    reg: string;
    status: string;
    statusColor: string;
    adi: string;
    description: string;
  }>;
}

export interface IngredientScanResult {
  risk: string;
  score: number;
  matchedAdditives: AdditiveDossier[];
  synergies: Array<{
    compound1: string;
    compound2: string;
    mechanism: string;
    severity: string;
    description: string;
  }>;
  bannedNotes: string[];
  allergenWarnings: string[];
  dietaryCompatibility: {
    halal: boolean;
    kosher: boolean;
    vegan: boolean;
    glutenFree: boolean;
  };
  summary: string;
}

export interface NutritionProfile {
  code: string;
  nameHe: string;
  nameEn: string;
  category: string;
  servingSize: string;
  calories: number;
  protein: number;
  totalFat: number;
  saturatedFat: number;
  carbohydrates: number;
  sugars: number;
  fiber: number;
  sodium: number;
  calcium: number;
  iron: number;
  potassium: number;
  cholesterol: number;
  isSolid: boolean;
  labels: {
    sodium: { triggered: boolean; value: number; threshold: number; labelHe: string; labelEn: string };
    saturatedFat: { triggered: boolean; value: number; threshold: number; labelHe: string; labelEn: string };
    sugar: { triggered: boolean; value: number; threshold: number; labelHe: string; labelEn: string };
  };
  dietary: {
    vegan: boolean;
    kosher: string;
    halal: boolean;
    glutenFree: boolean;
  };
  description: string;
}

export interface PesticideMrlItem {
  compound: string;
  cas: string;
  group: string;
  crops: string[];
  detectedResidue: string;
  detectedNum: number;
  euMrl: string;
  usEpa: string;
  israelMrl: string;
  status: string;
  updated: string;
  verdict: string;
  isViolation: boolean;
  neurodevelopmentalAlert: boolean;
  divergenceNotice: string;
}
