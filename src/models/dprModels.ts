export interface BOQItem {
  id: string;
  itemNo: string;
  description: string;
  unit: string;
  quantity: number;
  rateINR: number;
  amountINR: number;
  specCode: string; // e.g. "WB PWD Sor-2022 Item 4.02", "MoRTH Section 500"
}

export type ReviewStatus = 'Pending' | 'In Review' | 'Approved' | 'Rejected';

export interface ReviewStage {
  stageId: 1 | 2 | 3;
  stageName: string; // "Technical Scrutiny", "Financial Vetting & Sanction", "Administrative Sanction"
  authorityRole: string;
  authorityName: string;
  authorityEmail: string;
  status: ReviewStatus;
  reviewedAt?: string;
  remarks?: string;
  signatureStamp?: string;
}

export interface TenderNotice {
  nitNumber: string; // e.g. "NIT-NKDA/WBHIDCO/ROADS/2026/089"
  workName: string;
  executingAgency: string; // "New Town Kolkata Development Authority (NKDA) & WBHIDCO"
  estimatedCostINR: number;
  earnestMoneyINR: number; // 2% of estimated cost
  completionPeriodDays: number;
  bidSubmissionDeadline: string;
  technicalBidOpenDate: string;
  financialBidOpenDate: string;
  portalUrl: string; // "https://wbtenders.gov.in"
  eligibilityCriteria: string[];
  mandatoryDocuments: string[];
  releasedAt: string;
  tenderStatus: 'Draft' | 'Published';
}

export interface DPRRecord {
  dprNumber: string;
  roadCode: string;
  roadName: string;
  location: string;
  actionArea: string;
  roadType: string;
  chainage: string;
  roadLengthKm: number;
  carriagewayWidthMeters: number;
  distressAreaM2: number;
  maxRutDepthMm: number;
  avgIRI: number;
  goodnessScore: number;
  condition: string;
  pavementClassification: string; // e.g. "Flexible Bituminous Pavement (High Traffic)"
  proposedTreatment: string; // e.g. "Cold Milling (50mm), Tack Coat, DBM Infill & Bituminous Concrete Resurfacing"
  projectDurationDays: number;
  estimatedCostINR: number;
  executiveSummary: string;
  contractorClassRequired: string; // "Class-I Road Contractor (WB PWD / WBHIDCO)"
  boqItems: BOQItem[];
  reviews: ReviewStage[];
  tender?: TenderNotice;
  lastUpdated: string;
  emailDispatchedTo?: string;
  emailDispatchedAt?: string;
  hasNsvSurvey?: boolean;
  hasDroneSurvey?: boolean;
  isBlocked?: boolean;
  blockReason?: string;
}

