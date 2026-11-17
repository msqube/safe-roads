export interface RoughnessParameters {
  iriLeft: number; // m/km
  iriRight: number; // m/km
  iriAverage: number; // m/km
  rideQualityIndex: number; // 0 - 5 (Good is > 3.5)
  bumpIntegrator: number; // mm/km
  comfortClass: 'Smooth' | 'Fair' | 'Rough' | 'Severe';
}

export interface RutDepthParameters {
  leftWheelpathRut: number; // mm
  rightWheelpathRut: number; // mm
  maxRutDepth: number; // mm
  rutWidth: number; // cm
  rutSeverity: 'Low (<10mm)' | 'Medium (10-25mm)' | 'High (25-50mm)' | 'Critical (>50mm)';
  crossProfileDeviation: number; // mm
}

export interface CrackingParameters {
  totalCrackedAreaPercent: number; // %
  alligatorCrackingArea: number; // m²
  longitudinalCrackLength: number; // m
  transverseCrackCount: number;
  averageCrackWidth: number; // mm
  severityIndex: 'Minor' | 'Moderate' | 'Severe';
}

export interface PotholeParameters {
  totalCount: number;
  totalVolume: number; // m³
  averageDepth: number; // mm
  maxDepth: number; // mm
  criticalCount: number;
  moderateCount: number;
  surfaceDamageDensity: number; // potholes per 100m
}

export interface TextureParameters {
  meanProfileDepthMPD: number; // mm (Macrotexture)
  meanTextureDepthMTD: number; // mm
  skidResistanceNumber: number; // BPN (British Pendulum Number)
  hydroplaningRisk: 'Low' | 'Medium' | 'High';
}

export interface GeometryParameters {
  crossSlopePercent: number; // %
  longitudinalGradient: number; // %
  horizontalCurvatureRadius: number; // meters
  superelevationPercent: number; // %
  verticalProfileVariance: number; // mm
}

export interface InventoryItem {
  id: string;
  category: 'Signage' | 'Markings' | 'Guardrail' | 'Lighting' | 'Drainage' | 'Shoulder';
  name: string;
  condition: 'Good' | 'Fair' | 'Damaged' | 'Missing';
  chainageLocation: string;
  details: string;
}

export interface Road360Hotspot {
  id: string;
  pitch: number;
  yaw: number;
  label: string;
  type: 'pothole' | 'crack' | 'sign' | 'nsv_point';
  severity?: 'critical' | 'warning' | 'info';
  description: string;
}

export interface PotholeInspectionDefect {
  id: string;
  name: string;
  chainage: string;
  potholeId: string;
  photoUrl: string;
  dimensions: {
    lengthCm: number;
    widthCm: number;
    depthMm: number;
    estimatedVolumeLiters: number;
  };
  severity: 'Critical' | 'Severe' | 'Moderate' | 'Minor';
  aiConfidence: number; // 0 - 100 %
  detectedAt: string;
  gpsCoordinates: { lat: number; lng: number };
  boundingBox: { x: number; y: number; width: number; height: number }; // percentages 0-100
  pavementType: string;
}

export interface RoadSnapPoint {
  id: string;
  snapNumber: number;
  chainage: string;
  gps: { lat: number; lng: number };
  timestamp: string;
  droneAltitudeMeters: number;
  droneSpeedKmh: number;
  cameraPitchDegrees: number;
  thumbnailUrl: string;
  defectsDetected: number;
  surfaceCondition: string;
}

export interface NSVRoadDetails {
  roadCode: string;
  roadName: string;
  section: string;
  surveyDate: string;
  nsvVehicleId: string;
  nsvDriver: string;
  dronePilot: string;
  goodnessScore: number;
  conditionStatus: 'Good' | 'Fair' | 'Poor' | 'Critical';
  gpsStart: { lat: number; lng: number };
  gpsEnd: { lat: number; lng: number };
  lengthKm: number;
  lanesCount: number;
  surfaceType: string;

  // Key NSV Parameter groups
  roughness: RoughnessParameters;
  rutDepth: RutDepthParameters;
  cracking: CrackingParameters;
  potholes: PotholeParameters;
  texture: TextureParameters;
  geometry: GeometryParameters;
  inventory: InventoryItem[];

  // Visual Inspection Assets
  panoramas: {
    id: string;
    title: string;
    chainage: string;
    imageUrl: string;
    hotspots: Road360Hotspot[];
  }[];
  potholeInspections: PotholeInspectionDefect[];
  snapPoints: RoadSnapPoint[];
  hasNsvSurvey?: boolean;
  hasDroneSurvey?: boolean;
}

