export type PavementCondition = 'Good' | 'Fair' | 'Poor' | 'Critical';
export type SurveyStatus = 'Pending Review' | 'Ignored' | 'Assigned' | 'Repaired';
export type RepairPriority = 'Low' | 'Medium' | 'High' | 'Emergency';
export type SurveyPipelineTier = 'full_pipeline' | 'drone_only' | 'pending_drone';

export interface DroneSurveyRecord {
  id: number;
  slNo: number;
  roadCode: string;
  roadName: string;
  location: string; // e.g. "Action Area I, New Town", "Action Area IIB, New Town"
  actionArea: 'Action Area I' | 'Action Area II' | 'Action Area III' | 'CBD';
  roadType: string; // e.g. "Major Arterial Road (6-Lane)", "Secondary Arterial (4-Lane)", "Sectoral Distributor"
  lane: string;
  chainage: string;
  distanceKm: number; // Length in km of that road (replaces old totalArea column)
  goodnessScore: number; // 0 - 100
  condition: PavementCondition;
  gpsLatitude: number;
  gpsLongitude: number;
  areaOfBadness: number; // m² (Area of distress / defect patch)
  depthOfRut: number; // mm
  roughCostINR: number; // Rough cost estimation per volume/area as per New Town, West Bengal urban norms (₹)
  costPerM2: number; // Unit rate ₹/m²
  dronePhoto: string; // Photo 1: Top Aerial AI Pothole Scan
  dronePhotoThumb: string;
  dronePhoto2: string; // Photo 2: Angled 3D LiDAR / Surface Distress View
  dronePhoto2Thumb: string;
  potholeCount: number;
  status: SurveyStatus;
  surveyTimestamp: string;
  droneId: string;
  droneModel: string;
  repairPriority?: RepairPriority;
  assignedTo?: string;
  assignedTeam?: string;
  targetRepairDate?: string;
  actionNotes?: string;
  // Multi-tier survey progression
  droneSurveyDone: boolean;
  nsvSurveyDone: boolean;
  dprDone: boolean;
  tenderDone: boolean;
  pipelineTier: SurveyPipelineTier;
}

export interface SurveyFilterOptions {
  search: string;
  roadCode: string;
  actionArea?: string;
  condition: string;
  status: string;
  minScore: number;
  maxScore: number;
  minDepth: number;
  sortBy: keyof DroneSurveyRecord;
  sortOrder: 'asc' | 'desc';
}

export interface SurveySummaryStats {
  totalSurveys: number;
  totalPotholes: number;
  criticalRoads: number;
  averageGoodnessScore: number;
  pendingRepairs: number;
  totalBadnessArea: number;
  totalEstimatedCostINR: number;
}
