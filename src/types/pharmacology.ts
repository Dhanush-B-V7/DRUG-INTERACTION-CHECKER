export type InteractionSeverity = 'major' | 'moderate' | 'safe' | 'ai_predicted';

export type EvidenceProvenance = 'clinical_verified' | 'gnn_predicted';

export type ExplanationMode = 'patient' | 'clinical';

export type EnzymeRole = 'substrate' | 'inhibitor' | 'inducer';

export interface DrugEnzymeLink {
  enzymeId: string;
  role: EnzymeRole;
  strength: 'strong' | 'moderate' | 'weak';
}

export interface DrugDefinition {
  id: string;
  name: string;
  genericClass: string;
  defaultDosage: string;
  availableDosages: string[];
  route: string;
  indication: string;
  patientSummary: string;
  clinicalPharmacology: string;
  enzymes: DrugEnzymeLink[];
  targets: string[];
}

export interface ActiveMedication {
  drugId: string;
  dosage: string;
}

export interface EnzymeDefinition {
  id: string;
  name: string;
  patientName: string;
  fullName: string;
  family: string;
  patientDescription: string;
  clinicalNotes: string;
}

export interface TargetProteinDefinition {
  id: string;
  name: string;
  patientName: string;
  fullName: string;
  pathway: string;
  patientDescription: string;
  clinicalNotes: string;
}

export interface GnnAttributionHop {
  fromLabel: string;
  relation: string;
  toLabel: string;
  weight: number;
}

export interface GnnAttributionPath {
  id: string;
  title: string;
  importanceScore: number;
  hops: GnnAttributionHop[];
  rationale: string;
}

export interface InteractionRecord {
  id: string;
  drugA: string;
  drugB: string;
  severity: InteractionSeverity;
  provenance: EvidenceProvenance;
  title: string;
  clinicalSource: string;
  confidenceScore: number; // 0 to 1
  sharedMechanisms: string[];
  patientMode: {
    headline: string;
    plainSummary: string;
    symptomsToWatch: string[];
    actionableNextSteps: string[];
  };
  clinicalMode: {
    pkMechanism: string;
    pdMechanism: string;
    clinicalManagement: string;
    evidenceLevel: string;
    gnnExplainerPaths: GnnAttributionPath[];
  };
}

export type GraphNodeKind = 'drug' | 'enzyme' | 'target';

export interface GraphNode {
  id: string;
  kind: GraphNodeKind;
  label: string;
  patientLabel: string;
  subLabel: string;
  x: number;
  y: number;
  riskTier: InteractionSeverity | 'neutral';
  drugId?: string;
  enzymeId?: string;
  targetId?: string;
}

export interface BiologicalEdge {
  id: string;
  source: string;
  target: string;
  relationLabel: string;
  patientRelationLabel: string;
  role: EnzymeRole | 'target_binding';
}

export interface InteractionEdge {
  id: string;
  source: string;
  target: string;
  interaction: InteractionRecord;
}

export interface InteractionSummary {
  totalPairs: number;
  majorCount: number;
  moderateCount: number;
  safeCount: number;
  aiPredictedCount: number;
  highestRisk: InteractionSeverity | 'none';
}

export interface KnowledgeGraphData {
  nodes: GraphNode[];
  interactionEdges: InteractionEdge[];
  biologicalEdges: BiologicalEdge[];
  summary: InteractionSummary;
}

export interface ClinicalPreset {
  id: string;
  label: string;
  shortTitle: string;
  description: string;
  medications: ActiveMedication[];
}

export type CanvasSelection =
  | { type: 'overview' }
  | { type: 'interaction'; interactionId: string }
  | { type: 'node'; nodeId: string };

export type EdgeFilterMode = 'all' | 'clinical_only' | 'ai_only' | 'alerts_only';
