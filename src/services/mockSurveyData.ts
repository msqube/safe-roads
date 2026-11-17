import { DroneSurveyRecord, PavementCondition, SurveyStatus, SurveyPipelineTier } from '../models/surveyModels';
import { NSVRoadDetails } from '../models/nsvModels';
import { DPRRecord, BOQItem, ReviewStage, TenderNotice } from '../models/dprModels';
import { LaneScheduleItem } from '../models/schedulerModels';

  // Real-world New Town Kolkata (NKDA / WBHIDCO) corridors
  interface NewTownCorridor {
    codePrefix: string;
    name: string;
    location: string;
    actionArea: 'Action Area I' | 'Action Area II' | 'Action Area III' | 'CBD';
    roadType: string;
    baseLat: number;
    baseLng: number;
    lengthKm: number;
  }

const NEW_TOWN_CORRIDORS: NewTownCorridor[] = [
  {
    codePrefix: 'MAR-1111',
    name: 'Biswa Bangla Sarani (Major Arterial MAR-1111)',
    location: 'Action Area I, New Town',
    actionArea: 'Action Area I',
    roadType: 'Major Arterial Road (6-Lane)',
    baseLat: 22.58210,
    baseLng: 88.47305,
    lengthKm: 4.8,
  },
  {
    codePrefix: 'NKDA-AA1-ST112',
    name: 'Street No. 0112 (Novotel - Coal India Bhawan Corridor)',
    location: 'Action Area I, New Town',
    actionArea: 'Action Area I',
    roadType: 'Secondary Arterial (4-Lane)',
    baseLat: 22.5832,
    baseLng: 88.4674,
    lengthKm: 2.1,
  },
  {
    codePrefix: 'NKDA-AA1-ST048',
    name: 'Street No. 0048 (Axis Mall to HomeTown Spine)',
    location: 'Action Area I, Near Axis Mall',
    actionArea: 'Action Area I',
    roadType: 'Sectoral Distributor Road',
    baseLat: 22.5810,
    baseLng: 88.4601,
    lengthKm: 1.6,
  },
  {
    codePrefix: 'NKDA-AA1-NZR',
    name: 'Nazrul Tirtha Cultural Connector Boulevard',
    location: 'Action Area I, Nazrul Tirtha Link',
    actionArea: 'Action Area I',
    roadType: 'Sub-Arterial Boulevard',
    baseLat: 22.5788,
    baseLng: 88.4642,
    lengthKm: 1.4,
  },
  {
    codePrefix: 'NKDA-AA1-CLK',
    name: 'New Town Clock Tower Roundabout Arterial',
    location: 'Action Area I, Clock Tower Junction',
    actionArea: 'Action Area I',
    roadType: 'Major Arterial Road (6-Lane)',
    baseLat: 22.5841,
    baseLng: 88.4595,
    lengthKm: 2.8,
  },
  {
    codePrefix: 'NKDA-AA2-ECO',
    name: 'Eco Park Perimeter Ring Road (Gate 1 - Gate 4)',
    location: 'Action Area II, Eco Park Frontage',
    actionArea: 'Action Area II',
    roadType: 'Secondary Arterial (4-Lane)',
    baseLat: 22.6015,
    baseLng: 88.4682,
    lengthKm: 5.6,
  },
  {
    codePrefix: 'NKDA-AA2-MAR',
    name: 'Major Arterial Road North (Eco Park to Chinar Park Link)',
    location: 'Action Area II, Towards Chinar Park',
    actionArea: 'Action Area II',
    roadType: 'Major Arterial Road (6-Lane)',
    baseLat: 22.6102,
    baseLng: 88.4715,
    lengthKm: 3.9,
  },
  {
    codePrefix: 'NKDA-AA2-CC2',
    name: 'Street No. 0620 (City Centre 2 Commercial Link)',
    location: 'Action Area II, City Centre 2',
    actionArea: 'Action Area II',
    roadType: 'Sectoral Distributor Road',
    baseLat: 22.6185,
    baseLng: 88.4640,
    lengthKm: 2.3,
  },
  {
    codePrefix: 'NKDA-AA2-FHB',
    name: 'Financial Hub Boulevard (Action Area IIB)',
    location: 'Action Area IIB, Financial Hub',
    actionArea: 'Action Area II',
    roadType: 'Sub-Arterial Boulevard',
    baseLat: 22.5975,
    baseLng: 88.4760,
    lengthKm: 3.1,
  },
  {
    codePrefix: 'NKDA-AA2-AKN',
    name: 'Akankha More Junction Feeder & Arterial',
    location: 'Action Area IIC, Akankha More',
    actionArea: 'Action Area II',
    roadType: 'Secondary Arterial (4-Lane)',
    baseLat: 22.6120,
    baseLng: 88.4795,
    lengthKm: 2.7,
  },
  {
    codePrefix: 'NKDA-AA3-SLV',
    name: 'Silicon Valley IT Expressway (Action Area III)',
    location: 'Action Area III, Silicon Valley Hub',
    actionArea: 'Action Area III',
    roadType: 'Major Arterial Road (6-Lane)',
    baseLat: 22.5690,
    baseLng: 88.4910,
    lengthKm: 4.5,
  },
  {
    codePrefix: 'NKDA-AA3-SKH',
    name: 'Sukhobristi Housing Arterial (Shapoorji Complex)',
    location: 'Action Area III, Sukhobristi',
    actionArea: 'Action Area III',
    roadType: 'Secondary Arterial (4-Lane)',
    baseLat: 22.5620,
    baseLng: 88.4985,
    lengthKm: 3.4,
  },
  {
    codePrefix: 'NKDA-AA3-TMC',
    name: 'Street No. 0780 (Tata Medical Center Corridor)',
    location: 'Action Area III, Near TMC Hospital',
    actionArea: 'Action Area III',
    roadType: 'Sectoral Distributor Road',
    baseLat: 22.5745,
    baseLng: 88.4870,
    lengthKm: 2.5,
  },
  {
    codePrefix: 'NKDA-AA3-SXU',
    name: 'St. Xavier\'s University Boulevard (Action Area IIIA)',
    location: 'Action Area IIIA, St. Xavier\'s Campus',
    actionArea: 'Action Area III',
    roadType: 'Sub-Arterial Boulevard',
    baseLat: 22.5685,
    baseLng: 88.5020,
    lengthKm: 2.9,
  },
  {
    codePrefix: 'NKDA-AA3-CND',
    name: 'Street No. 0890 (Candor TechSpace - TCS Gitanjali Link)',
    location: 'Action Area III, Candor Tech Park',
    actionArea: 'Action Area III',
    roadType: 'Collector Street',
    baseLat: 22.5710,
    baseLng: 88.4820,
    lengthKm: 1.8,
  },
  {
    codePrefix: 'NKDA-CBD-SEC5',
    name: 'CBD Sector V - New Town Elevated Link Road',
    location: 'CBD, Salt Lake - New Town Border',
    actionArea: 'CBD',
    roadType: 'Major Arterial Road (6-Lane)',
    baseLat: 22.5790,
    baseLng: 88.4480,
    lengthKm: 3.6,
  },
];

const LANES = [
  'Lane 1 (Slow / Heavy Vehicles)',
  'Lane 2 (Fast / Median)',
  'Lane 3 (Overtaking)',
  'Service Road (Eastbound)',
  'Service Road (Westbound)',
  'Northbound Carriageway',
  'Southbound Carriageway',
];

const DRONES = [
  { id: 'DRN-SKY-X4', model: 'DJI Matrice 350 RTK - RoadEye L1' },
  { id: 'DRN-AERO-09', model: 'WingtraOne GEN II VTOL' },
  { id: 'DRN-SURV-302', model: 'SenseFly eBee X GeoSurvey' },
  { id: 'DRN-HEXA-88', model: 'Yuneec H520E Civil Inspector' },
  { id: 'DRN-RAPTOR-12', model: 'Skydio X2D AI Autonomous' },
];

// Real photographic road and pothole imagery
export const REAL_ROAD_PHOTOS = {
  potholeAerial1: '/images/pothole_4.jpg',
  potholePavement1: '/images/pothole_1.jpg',
  potholeDeep1: '/images/pothole_2.jpg',
  potholeRepair1: '/images/pothole_3.jpg',
  tarmacCracked1: '/images/pothole_4.jpg',
  road360Panorama: '/images/pothole_2.jpg',
};

// Rich Photographic Gallery for Diverse Corridors in New Town Kolkata (Strictly Real Road Potholes)
export const CORRIDOR_ORTHOPHOTOS: Record<
  string,
  { topDown: string; oblique: string; description: string }
> = {
  'MAR-1111': {
    topDown: '/images/pothole_1.jpg',
    oblique: '/images/pothole_2.jpg',
    description:
      'Biswa Bangla Sarani (6-Lane Arterial): Autonomous aerial inspection reveals 4 critical potholes along Lane 1 slow wheelpath. Maximum rutting reaches 20mm with localized pavement distress.',
  },
  'NKDA-AA1-ST112': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Potholes_in_road.jpg/800px-Potholes_in_road.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Pothole_Big.jpg',
    description:
      'Street No. 0112 (Novotel Corridor): Drone photogrammetry identifies longitudinal shear cracks and severe edge raveling across 3 distress hotspots near Coal India Bhawan junction.',
  },
  'NKDA-AA1-ST048': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Large_pothole.jpg/800px-Large_pothole.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Pothole_repair.jpg',
    description:
      'Street No. 0048 (Axis Mall Spine): Heavy commercial delivery vehicle traffic has produced 4 severe wheel craters with rut depth up to 68mm requiring prompt cold milling.',
  },
  'NKDA-AA1-NZR': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Pothole_near_Brampton.jpg/800px-Pothole_near_Brampton.jpg',
    description:
      'Nazrul Tirtha Cultural Connector Boulevard: Pavement surface wear and fatigue cracking detected along the approach lane to the cultural complex roundabout.',
  },
  'NKDA-AA1-CLK': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Pothole_Big.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Potholes_in_road.jpg/800px-Potholes_in_road.jpg',
    description:
      'New Town Clock Tower Roundabout Arterial: High turning shear stresses at roundabout ingress have caused surface raveling and 48mm wheelpath depressions.',
  },
  'NKDA-AA2-ECO': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Large_pothole.jpg/800px-Large_pothole.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Pothole_near_Brampton.jpg/800px-Pothole_near_Brampton.jpg',
    description:
      'Eco Park Perimeter Ring Road: 5 severe potholes detected along Gate 2 & Gate 3 curve. Water runoff pooling has loosened aggregate binder along the median verge.',
  },
  'NKDA-AA2-MAR': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Pothole_repair.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Pothole_Big.jpg',
    description:
      'Major Arterial Road North (Eco Park to Chinar Park): Heavy multi-axle freight traffic towards VIP Road has created deep rutting exceeding 62mm in outer slow lane.',
  },
  'NKDA-AA2-CC2': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Potholes_in_road.jpg/800px-Potholes_in_road.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Pothole_repair.jpg',
    description:
      'Street No. 0620 (City Centre 2 Commercial Link): Bus bay and shopping ingress roadway shows 3 distinct potholes and longitudinal crack branches.',
  },
  'NKDA-AA2-FHB': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Pothole_near_Brampton.jpg/800px-Pothole_near_Brampton.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg',
    description:
      'Financial Hub Boulevard (Action Area IIB): Commercial banking corridor pavement exhibits surface aggregate stripping and 45mm rutting.',
  },
  'NKDA-AA2-AKN': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Pothole_Big.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Large_pothole.jpg/800px-Large_pothole.jpg',
    description:
      'Akankha More Junction Feeder & Arterial: High brake wear near traffic signal has caused localized asphalt shoving and 52mm deep pothole breach.',
  },
  'NKDA-AA3-SLV': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Large_pothole.jpg/800px-Large_pothole.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Potholes_in_road.jpg/800px-Potholes_in_road.jpg',
    description:
      'Silicon Valley IT Expressway: High-speed corridor scan detected 4 sharp impact potholes and surface wear along the fast lane. DBM infill and polymer-modified overlay advised.',
  },
  'NKDA-AA3-SKH': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Pothole_near_Brampton.jpg/800px-Pothole_near_Brampton.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Pothole_Big.jpg',
    description:
      'Sukhobristi Housing Arterial: High-density township bus routes have generated fatigue alligator cracking and 56mm pothole clusters.',
  },
  'NKDA-AA3-TMC': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Pothole_repair.jpg',
    description:
      'Street No. 0780 (Tata Medical Center Corridor): Critical ambulance access route exhibiting multiple potholes and ride quality degradation (IRI > 4.2).',
  },
  'NKDA-AA3-SXU': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Pothole_Big.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg',
    description:
      'St. Xavier\'s University Boulevard: Sub-arterial university corridor showing outer lane unraveling and surface water ponding defects.',
  },
  'NKDA-AA3-CND': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Potholes_in_road.jpg/800px-Potholes_in_road.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Large_pothole.jpg/800px-Large_pothole.jpg',
    description:
      'Candor TechSpace Corridor: 3 distinct potholes with 59mm rut depth identified near TCS Gitanjali link road with binder loss from heavy construction tippers.',
  },
  'NKDA-CBD-SEC5': {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Pothole_near_Brampton.jpg/800px-Pothole_near_Brampton.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Potholes_in_road.jpg/800px-Potholes_in_road.jpg',
    description:
      'CBD Sector V - New Town Elevated Link: Heavy peak-hour commuter traffic corridor exhibiting bridge approach joint cracks and 44mm rutting.',
  },
};

// Get road-specific orthophotos
export function getCorridorOrthophotos(roadCode: string) {
  if (CORRIDOR_ORTHOPHOTOS[roadCode]) {
    return CORRIDOR_ORTHOPHOTOS[roadCode];
  }

  for (const prefix of Object.keys(CORRIDOR_ORTHOPHOTOS)) {
    if (roadCode.startsWith(prefix)) {
      return CORRIDOR_ORTHOPHOTOS[prefix];
    }
  }

  return {
    topDown: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg',
    oblique: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Potholes_in_road.jpg/800px-Potholes_in_road.jpg',
    description: `Autonomous drone aerial surveillance on ${roadCode} reveals verified surface potholes and asphalt rutting. Preventative bituminous wearing coat recommended under NKDA standards.`,
  };
}

// Helper to generate Drone Photo 1 (Top-down AI Pothole Detection Scan)
export function generateDroneThumbnail(seed: number, severity: string, depth: number): string {
  const isCritical = severity === 'Critical';
  const isPoor = severity === 'Poor';
  const isFair = severity === 'Fair';
  const defectColor = isCritical ? '#ea4335' : isPoor ? '#f97316' : isFair ? '#fbbc04' : '#34a853';
  const badgeText = isCritical ? 'CRITICAL POTHOLE' : isPoor ? 'RUT DISTRESS' : isFair ? 'SURFACE WEAR' : 'NOMINAL';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="240" viewBox="0 0 360 240">
    <defs>
      <linearGradient id="asphalt_${seed}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#2d3748"/>
        <stop offset="100%" stop-color="#1a202c"/>
      </linearGradient>
      <pattern id="grain_${seed}" width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#2d3748"/>
        <circle cx="2" cy="2" r="0.8" fill="#4a5568" opacity="0.6"/>
        <circle cx="6" cy="5" r="0.9" fill="#1a202c" opacity="0.8"/>
      </pattern>
    </defs>
    <rect width="360" height="240" fill="url(#asphalt_${seed})"/>
    <rect width="360" height="240" fill="url(#grain_${seed})" opacity="0.7"/>
    
    <!-- Road Lane Markings -->
    <line x1="0" y1="120" x2="360" y2="120" stroke="#fbbc04" stroke-width="4" stroke-dasharray="24,16" opacity="0.85"/>
    <line x1="0" y1="20" x2="360" y2="20" stroke="#ffffff" stroke-width="3" opacity="0.5"/>
    <line x1="0" y1="220" x2="360" y2="220" stroke="#ffffff" stroke-width="3" opacity="0.5"/>
    
    <!-- Pothole / Defect Graphic -->
    <g transform="translate(${90 + (seed % 90)}, ${50 + (seed % 50)})">
      <!-- Shadow Pothole -->
      <ellipse cx="45" cy="35" rx="${24 + (seed % 14)}" ry="${16 + (seed % 9)}" fill="#0f172a" opacity="0.95"/>
      <ellipse cx="43" cy="33" rx="${19 + (seed % 11)}" ry="${12 + (seed % 7)}" fill="#1e293b"/>
      <!-- Crack lines around pothole -->
      <path d="M15,35 Q3,25 0,15 M65,30 Q85,25 98,35 M50,52 Q60,72 68,76 M35,50 Q18,65 10,70" stroke="${defectColor}" stroke-width="2" fill="none" opacity="0.9"/>
      
      <!-- AI Bounding Box -->
      <rect x="-12" y="-10" width="${115 + (seed % 20)}" height="${90 + (seed % 15)}" fill="none" stroke="${defectColor}" stroke-width="2" stroke-dasharray="6,4"/>
      
      <!-- AI Tag Pin -->
      <rect x="-12" y="-28" width="105" height="18" rx="3" fill="${defectColor}"/>
      <text x="-7" y="-15" fill="#ffffff" font-family="sans-serif" font-size="9" font-weight="bold">AI-POTHOLE #${seed}</text>
      <text x="-7" y="10" fill="${defectColor}" font-family="monospace" font-size="10" font-weight="bold">${depth}mm DEPTH</text>
    </g>

    <!-- Drone Telemetry HUD -->
    <rect x="10" y="10" width="145" height="42" rx="4" fill="rgba(32,33,36,0.9)" stroke="#dadce0" stroke-width="1"/>
    <text x="18" y="24" fill="#1a73e8" font-family="monospace" font-size="9" font-weight="bold">NKDA DRONE #AERIAL-1</text>
    <text x="18" y="35" fill="#9aa0a6" font-family="monospace" font-size="8">ALT: 32m | GSD: 0.8cm/px</text>
    <text x="18" y="46" fill="${defectColor}" font-family="monospace" font-size="8" font-weight="bold">${badgeText}</text>
    
    <!-- Crosshair Target -->
    <circle cx="180" cy="120" r="14" fill="none" stroke="#1a73e8" stroke-width="1.2" opacity="0.7"/>
    <line x1="180" y1="100" x2="180" y2="140" stroke="#1a73e8" stroke-width="1.2" opacity="0.7"/>
    <line x1="160" y1="120" x2="200" y2="120" stroke="#1a73e8" stroke-width="1.2" opacity="0.7"/>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

  // Helper to generate Drone Photo 2 (Angled 3D LiDAR & Rutting Profile Scan)
  export function generateDroneThumbnail2(seed: number, severity: string, depth: number): string {
    const isCritical = severity === 'Critical';
    const defectColor = isCritical ? '#ea4335' : '#1a73e8';

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="240" viewBox="0 0 360 240">
    <defs>
      <linearGradient id="lidar_grad_${seed}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
    </defs>
    <rect width="360" height="240" fill="url(#lidar_grad_${seed})"/>
    
    <!-- 3D Perspective Grid -->
    <path d="M0,180 L360,180 M0,200 L360,200 M0,220 L360,220" stroke="#334155" stroke-width="1" opacity="0.4"/>
    <path d="M40,240 L120,160 M120,240 L160,160 M200,240 L200,160 M280,240 L240,160 M340,240 L280,160" stroke="#334155" stroke-width="1" opacity="0.3"/>
    
    <!-- Laser Rut Elevation Contour Map -->
    <g transform="translate(60, 60)">
      <!-- Rut Profile Waveform -->
      <path d="M0,70 Q40,${70 + (depth * 0.5)} 80,${70 + (depth * 0.9)} T140,${70 + (depth * 0.7)} T200,70" fill="none" stroke="${defectColor}" stroke-width="3"/>
      <!-- Fill under contour -->
      <path d="M0,70 Q40,${70 + (depth * 0.5)} 80,${70 + (depth * 0.9)} T140,${70 + (depth * 0.7)} T200,70 L200,120 L0,120 Z" fill="${defectColor}" opacity="0.18"/>
      
      <!-- Depth Scale Indicator -->
      <line x1="80" y1="50" x2="80" y2="${70 + (depth * 0.9)}" stroke="#fbbc04" stroke-width="1.5" stroke-dasharray="3,3"/>
      <rect x="90" y="65" width="75" height="18" rx="3" fill="#202124"/>
      <text x="95" y="78" fill="#fbbc04" font-family="monospace" font-size="9" font-weight="bold">RUT: ${depth}mm</text>
    </g>
    
    <!-- LiDAR Sensor Header -->
    <rect x="10" y="10" width="160" height="42" rx="4" fill="rgba(32,33,36,0.9)" stroke="#dadce0" stroke-width="1"/>
    <text x="18" y="24" fill="#34a853" font-family="monospace" font-size="9" font-weight="bold">LiDAR 3D SURFACE SCAN</text>
    <text x="18" y="35" fill="#9aa0a6" font-family="monospace" font-size="8">OBLIQUE 45° PHOTOGRAMMETRY</text>
    <text x="18" y="46" fill="#1a73e8" font-family="monospace" font-size="8" font-weight="bold">PTS: 2,400,000 / sec</text>
  </svg>`;

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Generate road roughness laser wave profile image (SVG)
  export function generateRoughnessProfileSvg(roadCode: string, iriAverage: number): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="220" viewBox="0 0 600 220">
    <rect width="600" height="220" fill="#ffffff" stroke="#dadce0" rx="6"/>
    <!-- Grid -->
    <line x1="60" y1="30" x2="570" y2="30" stroke="#f1f3f4" stroke-width="1"/>
    <line x1="60" y1="70" x2="570" y2="70" stroke="#f1f3f4" stroke-width="1"/>
    <line x1="60" y1="110" x2="570" y2="110" stroke="#f1f3f4" stroke-width="1"/>
    <line x1="60" y1="150" x2="570" y2="150" stroke="#f1f3f4" stroke-width="1"/>
    <line x1="60" y1="190" x2="570" y2="190" stroke="#dadce0" stroke-width="1"/>
    <line x1="60" y1="20" x2="60" y2="190" stroke="#dadce0" stroke-width="1"/>

    <!-- Y Axis Labels -->
    <text x="20" y="35" fill="#5f6368" font-family="sans-serif" font-size="10">6.0 m/km</text>
    <text x="20" y="75" fill="#5f6368" font-family="sans-serif" font-size="10">4.5 m/km</text>
    <text x="20" y="115" fill="#5f6368" font-family="sans-serif" font-size="10">3.0 m/km</text>
    <text x="20" y="155" fill="#5f6368" font-family="sans-serif" font-size="10">1.5 m/km</text>
    <text x="35" y="195" fill="#5f6368" font-family="sans-serif" font-size="10">0.0</text>

    <!-- IRI Threshold Lines -->
    <line x1="60" y1="95" x2="570" y2="95" stroke="#ea4335" stroke-width="1.5" stroke-dasharray="4,4"/>
    <text x="470" y="90" fill="#ea4335" font-family="sans-serif" font-size="9" font-weight="bold">Critical &gt; 3.5 m/km</text>

    <line x1="60" y1="140" x2="570" y2="140" stroke="#34a853" stroke-width="1.5" stroke-dasharray="4,4"/>
    <text x="480" y="135" fill="#34a853" font-family="sans-serif" font-size="9" font-weight="bold">Good &lt; 2.2 m/km</text>

    <!-- IRI Elevation Profile Curve -->
    <path d="M60,140 Q100,150 140,110 T220,135 T300,75 T380,120 T460,${Math.max(40, 190 - (iriAverage * 28))} T540,130 L570,145" fill="none" stroke="#1a73e8" stroke-width="2.5"/>
    
    <!-- Fill below -->
    <path d="M60,140 Q100,150 140,110 T220,135 T300,75 T380,120 T460,${Math.max(40, 190 - (iriAverage * 28))} T540,130 L570,145 L570,190 L60,190 Z" fill="#1a73e8" opacity="0.08"/>

    <!-- Peak Annotation -->
    <circle cx="300" cy="75" r="4" fill="#ea4335"/>
    <text x="310" y="72" fill="#ea4335" font-family="sans-serif" font-size="10" font-weight="bold">Peak IRI: 4.8 m/km</text>

    <!-- Header title -->
    <text x="65" y="22" fill="#202124" font-family="sans-serif" font-size="11" font-weight="bold">Laser Profilometer Surface Waveform — ${roadCode} (Average IRI: ${iriAverage} m/km)</text>
  </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  // Generate the 65 rich survey records representing New Town Kolkata
  export function generateInitialSurveys(): DroneSurveyRecord[] {
    const records: DroneSurveyRecord[] = [];
    const now = new Date('2026-11-13T10:30:00Z');

    for (let i = 1; i <= 65; i++) {
      const corridor = NEW_TOWN_CORRIDORS[(i - 1) % NEW_TOWN_CORRIDORS.length];
      const roadCode = i === 1 ? 'MAR-1111' : `${corridor.codePrefix}-${String(i).padStart(4, '0')}`;
      const lane = LANES[(i - 1) % LANES.length];
      const drone = DRONES[(i - 1) % DRONES.length];

      const chainageKm = ((i * 0.18) % corridor.lengthKm).toFixed(2);
      const chainage = i === 1 ? 'Km 0+000 - 0+120 (120m Resurfacing Segment)' : `Km ${chainageKm} - ${((parseFloat(chainageKm) + 0.35) % corridor.lengthKm).toFixed(2)}`;

      // Realistic New Town Kolkata GPS (close to actual corridor coords)
      const latOffset = ((i * 17) % 50 - 25) * 0.0007;
      const lngOffset = ((i * 23) % 50 - 25) * 0.0007;
      const gpsLatitude = i === 1 ? 22.58210 : parseFloat((corridor.baseLat + latOffset).toFixed(5));
      const gpsLongitude = i === 1 ? 88.47305 : parseFloat((corridor.baseLng + lngOffset).toFixed(5));
      const distanceKm = i === 1 ? 0.12 : parseFloat((0.8 + ((i * 1.3) % 4.2)).toFixed(1));
      const surveyTime = new Date(now.getTime() - i * 3600 * 1000 * 3.5).toISOString();

      // Tiered Survey Progression:
      // TIER 1 (i === 1): Road MAR 1111 - Full Pipeline Complete (Drone + NSV 14P + DPR + Tender)
      // TIER 2 (i === 2): Road 2 (NKDA-AA1-ST112-0002) - Drone Survey Performed ONLY. No NSV Survey, DPR/Tender Blocked.
      // TIER 3 (i >= 3): All remaining roads - NO Drone Survey Performed Yet.
      let pipelineTier: SurveyPipelineTier;
      let droneSurveyDone: boolean;
      let nsvSurveyDone: boolean;
      let dprDone: boolean;
      let tenderDone: boolean;

      let goodnessScore: number;
      let condition: PavementCondition;
      let depthOfRut: number;
      let areaOfBadness: number;
      let roughCostINR: number;
      let costPerM2: number;
      let potholeCount: number;
      let photo1: string;
      let photo2: string;
      let status: SurveyStatus = 'Pending Review';
      let assignedTeam: string | undefined;
      let targetRepairDate: string | undefined;
      let actionNotes: string | undefined;

      if (i === 1) {
        // TIER 1: MAR-1111 (Biswa Bangla Sarani) - Full Pipeline Complete
        pipelineTier = 'full_pipeline';
        droneSurveyDone = true;
        nsvSurveyDone = true;
        dprDone = true;
        tenderDone = true;

        goodnessScore = 24;
        condition = 'Critical';
        depthOfRut = 20; // 20 mm average depth from 14-page NSV Report
        areaOfBadness = 1.86; // 20 sq ft ≈ 1.86 m² from 14-page NSV Report
        potholeCount = 4;
        roughCostINR = 2820000; // ₹28.20 Lakhs (Part 1: ₹3,72,000 + Part 2: ₹24,48,000) from DPR formula!
        costPerM2 = 2720; // WB PWD SoR 2022-2025 unit cost per m²
        photo1 = '/images/pothole_1.jpg';
        photo2 = '/images/pothole_2.jpg';
        status = 'Assigned';
        assignedTeam = 'NKDA Quick-Action Bitumen Crew #1';
        targetRepairDate = '2026-11-18';
        actionNotes = '4 verified potholes (20mm depth, 1.86 m²) on Road MAR 1111. Approved for Pothole Patching (₹3.72L) and Bituminous Concrete Resurfacing (₹24.48L) under DPR & e-NIT Tender No. 01.';
      } else if (i === 2) {
        // TIER 2: Road 2 (Street No. 0112: Novotel - Coal India Bhawan Corridor)
        pipelineTier = 'drone_only';
        droneSurveyDone = true;
        nsvSurveyDone = false;
        dprDone = false;
        tenderDone = false;

        goodnessScore = 32;
        condition = 'Critical';
        depthOfRut = 52;
        areaOfBadness = 2.4;
        potholeCount = 5;
        roughCostINR = 142000;
        costPerM2 = Math.round(roughCostINR / areaOfBadness);
        photo1 = REAL_ROAD_PHOTOS.potholeDeep1;
        photo2 = REAL_ROAD_PHOTOS.potholePavement1;
        status = 'Pending Review';
        actionNotes = 'Drone aerial AI surveillance completed with 5 severe potholes detected. Awaiting NSV Profilometer run.';
      } else {
        // Diverse Township Distribution: 12 Critical, 18 Poor, 22 Fair, 13 Good
        const isCriticalRoad = i <= 12; // 12 Critical (roads 1 to 12)
        const isPoorRoad = i > 12 && i <= 30; // 18 Poor (roads 13 to 30)
        const isFairRoad = i > 30 && i <= 52; // 22 Fair (roads 31 to 52)
        // roads 53 to 65: 13 Good

        droneSurveyDone = true;
        nsvSurveyDone = i % 5 === 0;
        dprDone = i % 6 === 0;
        tenderDone = false;
        pipelineTier = nsvSurveyDone ? 'full_pipeline' : 'drone_only';

        if (isCriticalRoad) {
          condition = 'Critical';
          goodnessScore = 22 + (i % 16);
          depthOfRut = 46 + (i % 16);
          areaOfBadness = parseFloat((1.4 + ((i * 0.4) % 3.6)).toFixed(1));
          potholeCount = 3 + (i % 4);
          roughCostINR = Math.round(areaOfBadness * 32000);
          costPerM2 = 2720;
          status = i % 3 === 0 ? 'Assigned' : 'Pending Review';
          assignedTeam = i % 3 === 0 ? 'NKDA Rapid Pothole Response Team' : undefined;
          targetRepairDate = i % 3 === 0 ? '2026-11-22' : undefined;
          actionNotes = `Critical rutting (${depthOfRut}mm) and ${potholeCount} severe potholes detected under drone AI surveillance.`;
        } else if (isPoorRoad) {
          condition = 'Poor';
          goodnessScore = 48 + (i % 14);
          depthOfRut = 26 + (i % 18);
          areaOfBadness = parseFloat((0.8 + ((i * 0.25) % 2.2)).toFixed(1));
          potholeCount = 1 + (i % 3);
          roughCostINR = Math.round(areaOfBadness * 24000);
          costPerM2 = 2400;
          status = i % 4 === 0 ? 'Assigned' : 'Pending Review';
          actionNotes = `Moderate surface distress, fatigue cracking, and ${depthOfRut}mm rutting requiring scheduled maintenance.`;
        } else if (isFairRoad) {
          condition = 'Fair';
          goodnessScore = 65 + (i % 14);
          depthOfRut = 10 + (i % 12);
          areaOfBadness = parseFloat((0.2 + ((i * 0.1) % 1.0)).toFixed(1));
          potholeCount = i % 2 === 0 ? 1 : 0;
          roughCostINR = Math.round(areaOfBadness * 18000);
          costPerM2 = 2100;
          status = 'Pending Review';
          actionNotes = 'Minor surface hairline cracking; riding quality within acceptable limits.';
        } else {
          // Good
          condition = 'Good';
          goodnessScore = 82 + (i % 16);
          depthOfRut = 0;
          areaOfBadness = 0;
          potholeCount = 0;
          roughCostINR = 0;
          costPerM2 = 0;
          status = 'Repaired';
          actionNotes = 'Pavement surface in sound condition. Routine autonomous patrol logged.';
        }

        const ortho = getCorridorOrthophotos(corridor.codePrefix);
        photo1 = ortho.topDown || REAL_ROAD_PHOTOS.potholeAerial1;
        photo2 = ortho.oblique || REAL_ROAD_PHOTOS.potholePavement1;
      }

      records.push({
        id: i,
        slNo: i,
        roadCode,
        roadName: corridor.name,
        location: corridor.location,
        actionArea: corridor.actionArea,
        roadType: corridor.roadType,
        lane,
        chainage,
        distanceKm,
        goodnessScore,
        condition,
        gpsLatitude,
        gpsLongitude,
        areaOfBadness,
        depthOfRut,
        roughCostINR,
        costPerM2,
        dronePhoto: photo1,
        dronePhotoThumb: photo1,
        dronePhoto2: photo2,
        dronePhoto2Thumb: photo2,
        potholeCount,
        status,
        surveyTimestamp: surveyTime,
        droneId: drone.id,
        droneModel: drone.model,
        repairPriority: condition === 'Critical' ? 'Emergency' : 'Medium',
        assignedTeam,
        targetRepairDate,
        actionNotes,
        droneSurveyDone,
        nsvSurveyDone,
        dprDone,
        tenderDone,
        pipelineTier,
      });
    }

    return records;
  }

    // Generate Detailed NSV Road Data for a given road code
    export function generateNSVDetailsForRoad(roadCode: string): NSVRoadDetails {
      const defaultSurveys = generateInitialSurveys();
      const matched = defaultSurveys.find((s) => s.roadCode === roadCode) || defaultSurveys[0];
      const isMar1111 = matched.roadCode === 'MAR-1111';

      // 14-Page Official NSV Report Specification for MAR-1111:
      // Segment: Chainage 0+000 to 0+120 (120m)
      // IRI: Left 5.10, Right 5.30, Average 5.20 m/km (Very Poor band > 5.0 m/km)
      // Potholes: 4 Nos., combined area 20 sq ft (1.86 m²), average depth 20 mm, volume 0.0372 m³
      const iriAverage = isMar1111 ? 5.20 : matched.condition === 'Critical' ? 4.8 : matched.condition === 'Poor' ? 3.6 : 2.1;
      const iriLeft = isMar1111 ? 5.10 : parseFloat((iriAverage + 0.3).toFixed(1));
      const iriRight = isMar1111 ? 5.30 : parseFloat((iriAverage - 0.2).toFixed(1));

      const hasNsvSurvey = isMar1111;
      const hasDroneSurvey = isMar1111 || matched.pipelineTier === 'drone_only';

      return {
        roadCode: matched.roadCode,
        roadName: isMar1111 ? 'NKDA Road MAR 1111' : matched.roadName,
        section: isMar1111 ? 'Chainage 0+000 to 0+120 (120m Resurfacing Segment)' : `${matched.chainage} (${matched.lane})`,
        surveyDate: isMar1111 ? '16 Nov 2026, 11:30 AM IST (Certified NSV Run)' : '12 Nov 2026, 09:45 AM IST',
        nsvVehicleId: isMar1111 ? 'WB-02-NKDA-7712 (ROMDAS NSV Laser Profilometer Mark-IV)' : 'WB-02-NKDA-7712 (ROMDAS NSV Mark-IV)',
        nsvDriver: isMar1111 ? 'SkyScan Geospatial Technologies / WB PWD Authorized Vendor' : 'SkyScan Geospatial Technologies Pvt. Ltd.', // Vendor
        dronePilot: isMar1111 ? 'Er. Rahul Baruah (DGCA Certified Telemetry Pilot #WB-482)' : 'Debojyoti Mukherjee (DGCA Certified Pilot #WB-482)',
        goodnessScore: matched.goodnessScore,
        conditionStatus: matched.condition,
        gpsStart: isMar1111 ? { lat: 22.58150, lng: 88.47280 } : { lat: matched.gpsLatitude, lng: matched.gpsLongitude },
        gpsEnd: isMar1111 ? { lat: 22.58270, lng: 88.47328 } : { lat: matched.gpsLatitude + 0.0035, lng: matched.gpsLongitude + 0.0042 },
        lengthKm: isMar1111 ? 0.12 : matched.distanceKm,
        lanesCount: matched.roadType.includes('6-Lane') ? 6 : matched.roadType.includes('4-Lane') ? 4 : 2,
        surfaceType: 'Dense Bituminous Concrete (BC Grade-1 with Polymer Modified Bitumen)',
        hasNsvSurvey,
        hasDroneSurvey,

        // Key NSV Parameter groups (Exact 14-page NSV Report Specifications for Road MAR 1111)
        roughness: {
          iriLeft: isMar1111 ? 5.1 : iriLeft,
          iriRight: isMar1111 ? 5.3 : iriRight,
          iriAverage: isMar1111 ? 5.2 : iriAverage,
          rideQualityIndex: isMar1111 ? 1.4 : matched.condition === 'Critical' ? 1.8 : matched.condition === 'Poor' ? 2.6 : 4.4,
          bumpIntegrator: isMar1111 ? 4120 : matched.condition === 'Critical' ? 3850 : 2100,
          comfortClass: isMar1111 ? 'Severe' : matched.condition === 'Critical' ? 'Severe' : matched.condition === 'Poor' ? 'Rough' : 'Smooth',
        },
        rutDepth: {
          leftWheelpathRut: isMar1111 ? 20 : matched.depthOfRut,
          rightWheelpathRut: isMar1111 ? 20 : Math.max(8, matched.depthOfRut - 15),
          maxRutDepth: isMar1111 ? 20 : matched.depthOfRut,
          rutWidth: isMar1111 ? 40 : 42,
          rutSeverity: isMar1111 ? 'Critical (>50mm)' : matched.depthOfRut >= 50 ? 'Critical (>50mm)' : matched.depthOfRut >= 25 ? 'High (25-50mm)' : 'Medium (10-25mm)',
          crossProfileDeviation: 18.4,
        },
        cracking: {
          totalCrackedAreaPercent: isMar1111 ? 34.5 : matched.condition === 'Critical' ? 34.5 : matched.condition === 'Poor' ? 18.2 : 4.1,
          alligatorCrackingArea: isMar1111 ? 1.86 : matched.areaOfBadness,
          longitudinalCrackLength: isMar1111 ? 48.5 : 48.5,
          transverseCrackCount: isMar1111 ? 12 : 12,
          averageCrackWidth: isMar1111 ? 8.5 : 8.5,
          severityIndex: isMar1111 ? 'Severe' : matched.condition === 'Critical' ? 'Severe' : 'Moderate',
        },
        potholes: {
          totalCount: isMar1111 ? 4 : matched.potholeCount,
          totalVolume: isMar1111 ? 0.0372 : parseFloat((matched.areaOfBadness * (matched.depthOfRut / 1000)).toFixed(3)),
          averageDepth: isMar1111 ? 20 : matched.depthOfRut,
          maxDepth: isMar1111 ? 20 : matched.depthOfRut + 12,
          criticalCount: isMar1111 ? 4 : matched.condition === 'Critical' ? matched.potholeCount : 0,
          moderateCount: 0,
          surfaceDamageDensity: isMar1111 ? 33.3 : parseFloat((matched.potholeCount / matched.distanceKm).toFixed(1)),
        },
        texture: {
          meanProfileDepthMPD: 0.72,
          meanTextureDepthMTD: 0.88,
          skidResistanceNumber: isMar1111 ? 42 : matched.condition === 'Critical' ? 42 : 68,
          hydroplaningRisk: isMar1111 ? 'High' : matched.condition === 'Critical' ? 'High' : 'Low',
        },
        geometry: {
          crossSlopePercent: 2.5,
          longitudinalGradient: 0.8,
          horizontalCurvatureRadius: 450,
          superelevationPercent: 4.0,
          verticalProfileVariance: 6.2,
        },
        inventory: [
          {
            id: 'INV-01',
            category: 'Signage',
            name: 'Speed Limit 50 km/h (NKDA Retroreflective Sign)',
            condition: 'Good',
            chainageLocation: 'Km 0.350 (LHS)',
            details: 'Type-IV microprismatic retroreflective sheeting intact.',
          },
          {
            id: 'INV-02',
            category: 'Markings',
            name: 'Thermoplastic White Centerline & Edge Markings',
            condition: matched.condition === 'Critical' ? 'Damaged' : 'Fair',
            chainageLocation: 'Km 0.000 - 1.200',
            details: 'Faded retro-reflectivity below 100 mcd/m²/lux near defect zone.',
          },
          {
            id: 'INV-03',
            category: 'Drainage',
            name: 'Reinforced Concrete Kerb & Gutter Inlet',
            condition: matched.condition === 'Critical' ? 'Damaged' : 'Good',
            chainageLocation: 'Km 0.720 (RHS)',
            details: 'Silt accumulation blocking 30% of stormwater grate opening.',
          },
          {
            id: 'INV-04',
            category: 'Lighting',
            name: 'NKDA Smart LED Streetlight Pole #AA-78',
            condition: 'Good',
            chainageLocation: 'Km 0.850 (Median)',
            details: 'Dual 150W LED luminaire with photocell controller operational.',
          },
          {
            id: 'INV-05',
            category: 'Guardrail',
            name: 'W-Beam Metal Crash Barrier',
            condition: 'Good',
            chainageLocation: 'Km 1.100 - 1.500',
            details: 'Galvanized steel barrier installed as per MoRTH specifications.',
          },
        ],

        panoramas: [
          {
            id: 'PANO-01',
            title: 'NSV 360° Panoramic Scan at Pothole Distress Zone',
            chainage: matched.chainage,
            imageUrl: getCorridorOrthophotos(matched.roadCode).oblique,
            hotspots: [
              {
                id: 'H1',
                pitch: -18,
                yaw: 15,
                label: `Critical Pothole (${matched.depthOfRut}mm Depth)`,
                type: 'pothole',
                severity: 'critical',
                description: `Wheelpath fatigue pothole with ${matched.areaOfBadness}m² shattered bitumen edges.`,
              },
              {
                id: 'H2',
                pitch: -24,
                yaw: -35,
                label: 'Alligator Cracking Web',
                type: 'crack',
                severity: 'warning',
                description: 'Interconnected fatigue cracks propagating longitudinally.',
              },
              {
                id: 'H3',
                pitch: 2,
                yaw: 85,
                label: 'NKDA Road Signage Km 0+450',
                type: 'sign',
                severity: 'info',
                description: 'Road standard signage verified by NSV LiDAR cameras.',
              },
            ],
          },
        ],

        potholeInspections: isMar1111
          ? [
              {
                id: 'DEF-01',
                name: 'Pothole Defect PH-01 (Chainage 0+018)',
                chainage: 'Km 0+018',
                potholeId: 'PH-01',
                photoUrl: REAL_ROAD_PHOTOS.potholePavement1,
                dimensions: {
                  lengthCm: 68,
                  widthCm: 68,
                  depthMm: 20,
                  estimatedVolumeLiters: 9.3,
                },
                severity: 'Critical',
                aiConfidence: 98.4,
                detectedAt: '16 Nov 2026, 11:32 IST',
                gpsCoordinates: { lat: 22.58168, lng: 88.47288 },
                boundingBox: { x: 30, y: 35, width: 40, height: 35 },
                pavementType: 'Flexible Bituminous Pavement',
              },
              {
                id: 'DEF-02',
                name: 'Pothole Defect PH-02 (Chainage 0+045)',
                chainage: 'Km 0+045',
                potholeId: 'PH-02',
                photoUrl: REAL_ROAD_PHOTOS.potholeDeep1,
                dimensions: {
                  lengthCm: 68,
                  widthCm: 68,
                  depthMm: 20,
                  estimatedVolumeLiters: 9.3,
                },
                severity: 'Critical',
                aiConfidence: 97.2,
                detectedAt: '16 Nov 2026, 11:33 IST',
                gpsCoordinates: { lat: 22.58195, lng: 88.47298 },
                boundingBox: { x: 42, y: 38, width: 38, height: 32 },
                pavementType: 'Flexible Bituminous Pavement',
              },
              {
                id: 'DEF-03',
                name: 'Pothole Defect PH-03 (Chainage 0+078)',
                chainage: 'Km 0+078',
                potholeId: 'PH-03',
                photoUrl: REAL_ROAD_PHOTOS.potholeRepair1,
                dimensions: {
                  lengthCm: 68,
                  widthCm: 68,
                  depthMm: 20,
                  estimatedVolumeLiters: 9.3,
                },
                severity: 'Critical',
                aiConfidence: 99.1,
                detectedAt: '16 Nov 2026, 11:34 IST',
                gpsCoordinates: { lat: 22.58232, lng: 88.47312 },
                boundingBox: { x: 34, y: 32, width: 42, height: 38 },
                pavementType: 'Flexible Bituminous Pavement',
              },
              {
                id: 'DEF-04',
                name: 'Pothole Defect PH-04 (Chainage 0+105)',
                chainage: 'Km 0+105',
                potholeId: 'PH-04',
                photoUrl: REAL_ROAD_PHOTOS.potholeAerial1,
                dimensions: {
                  lengthCm: 68,
                  widthCm: 68,
                  depthMm: 20,
                  estimatedVolumeLiters: 9.3,
                },
                severity: 'Critical',
                aiConfidence: 96.8,
                detectedAt: '16 Nov 2026, 11:35 IST',
                gpsCoordinates: { lat: 22.58255, lng: 88.47320 },
                boundingBox: { x: 28, y: 40, width: 44, height: 34 },
                pavementType: 'Flexible Bituminous Pavement',
              },
            ]
          : [
              {
                id: 'DEF-01',
                name: 'Primary Wheelpath Pothole (Pothole #1)',
                chainage: matched.chainage,
                potholeId: `PTH-${matched.roadCode}-01`,
                photoUrl: getCorridorOrthophotos(matched.roadCode).topDown,
                dimensions: {
                  lengthCm: 145,
                  widthCm: 90,
                  depthMm: matched.depthOfRut,
                  estimatedVolumeLiters: Math.round(matched.areaOfBadness * matched.depthOfRut * 0.7),
                },
                severity: matched.condition === 'Critical' ? 'Critical' : 'Moderate',
                aiConfidence: 97.4,
                detectedAt: matched.surveyTimestamp,
                gpsCoordinates: { lat: matched.gpsLatitude, lng: matched.gpsLongitude },
                boundingBox: { x: 28, y: 35, width: 44, height: 38 },
                pavementType: 'Bituminous Concrete (BC)',
              },
              {
                id: 'DEF-02',
                name: 'Secondary Rut Pothole (Near Median)',
                chainage: matched.chainage,
                potholeId: `PTH-${matched.roadCode}-02`,
                photoUrl: getCorridorOrthophotos(matched.roadCode).oblique,
                dimensions: {
                  lengthCm: 85,
                  widthCm: 60,
                  depthMm: Math.round(matched.depthOfRut * 0.7),
                  estimatedVolumeLiters: Math.round(matched.areaOfBadness * matched.depthOfRut * 0.3),
                },
                severity: 'Moderate',
                aiConfidence: 92.1,
                detectedAt: matched.surveyTimestamp,
                gpsCoordinates: { lat: matched.gpsLatitude + 0.0004, lng: matched.gpsLongitude + 0.0003 },
                boundingBox: { x: 48, y: 40, width: 32, height: 28 },
                pavementType: 'Dense Bituminous Macadam (DBM)',
              },
              {
                id: 'DEF-03',
                name: 'Longitudinal Shear Edge Pothole (Outer Lane)',
                chainage: 'Km 14+710',
                potholeId: `PTH-${matched.roadCode}-03`,
                photoUrl: REAL_ROAD_PHOTOS.potholePavement1,
                dimensions: {
                  lengthCm: 170,
                  widthCm: 110,
                  depthMm: Math.min(85, Math.round(matched.depthOfRut * 1.15)),
                  estimatedVolumeLiters: 122,
                },
                severity: 'Critical',
                aiConfidence: 99.1,
                detectedAt: matched.surveyTimestamp,
                gpsCoordinates: { lat: matched.gpsLatitude + 0.0026, lng: matched.gpsLongitude + 0.0022 },
                boundingBox: { x: 35, y: 30, width: 48, height: 42 },
                pavementType: 'Bituminous Concrete (BC Grade-1)',
              },
              {
                id: 'DEF-04',
                name: 'Sub-Base Aggregate Exposure Pothole',
                chainage: 'Km 15+150',
                potholeId: `PTH-${matched.roadCode}-04`,
                photoUrl: REAL_ROAD_PHOTOS.potholeDeep1,
                dimensions: {
                  lengthCm: 120,
                  widthCm: 80,
                  depthMm: Math.round(matched.depthOfRut * 0.88),
                  estimatedVolumeLiters: 64,
                },
                severity: 'Critical',
                aiConfidence: 95.8,
                detectedAt: matched.surveyTimestamp,
                gpsCoordinates: { lat: matched.gpsLatitude + 0.0041, lng: matched.gpsLongitude + 0.0037 },
                boundingBox: { x: 22, y: 44, width: 38, height: 35 },
                pavementType: 'Dense Bituminous Macadam (DBM)',
              },
            ],

        snapPoints: isMar1111
          ? [
              {
                id: 'SNP-01',
                snapNumber: 1,
                chainage: 'Km 0+018',
                gps: { lat: 22.58168, lng: 88.47288 },
                timestamp: '11:32:10',
                droneAltitudeMeters: 30.5,
                droneSpeedKmh: 12.0,
                cameraPitchDegrees: -90,
                thumbnailUrl: REAL_ROAD_PHOTOS.potholePavement1,
                defectsDetected: 1,
                surfaceCondition: 'Critical',
              },
              {
                id: 'SNP-02',
                snapNumber: 2,
                chainage: 'Km 0+045',
                gps: { lat: 22.58195, lng: 88.47298 },
                timestamp: '11:33:25',
                droneAltitudeMeters: 30.2,
                droneSpeedKmh: 12.5,
                cameraPitchDegrees: -45,
                thumbnailUrl: REAL_ROAD_PHOTOS.potholeDeep1,
                defectsDetected: 1,
                surfaceCondition: 'Critical',
              },
              {
                id: 'SNP-03',
                snapNumber: 3,
                chainage: 'Km 0+078',
                gps: { lat: 22.58232, lng: 88.47312 },
                timestamp: '11:34:40',
                droneAltitudeMeters: 31.0,
                droneSpeedKmh: 11.8,
                cameraPitchDegrees: -90,
                thumbnailUrl: REAL_ROAD_PHOTOS.potholeRepair1,
                defectsDetected: 1,
                surfaceCondition: 'Critical',
              },
              {
                id: 'SNP-04',
                snapNumber: 4,
                chainage: 'Km 0+105',
                gps: { lat: 22.58255, lng: 88.47320 },
                timestamp: '11:35:55',
                droneAltitudeMeters: 30.8,
                droneSpeedKmh: 12.2,
                cameraPitchDegrees: -45,
                thumbnailUrl: REAL_ROAD_PHOTOS.potholeAerial1,
                defectsDetected: 1,
                surfaceCondition: 'Critical',
              },
            ]
          : [
          {
            id: 'SNP-01',
            snapNumber: 1,
            chainage: 'Km 0+100',
            gps: { lat: matched.gpsLatitude, lng: matched.gpsLongitude },
            timestamp: '09:45:12',
            droneAltitudeMeters: 32.4,
            droneSpeedKmh: 14.2,
            cameraPitchDegrees: -90,
            thumbnailUrl: getCorridorOrthophotos(matched.roadCode).topDown,
            defectsDetected: matched.potholeCount,
            surfaceCondition: matched.condition,
          },
          {
            id: 'SNP-02',
            snapNumber: 2,
            chainage: 'Km 0+250',
            gps: { lat: parseFloat((matched.gpsLatitude + 0.0008).toFixed(5)), lng: parseFloat((matched.gpsLongitude + 0.0009).toFixed(5)) },
            timestamp: '09:45:34',
            droneAltitudeMeters: 32.1,
            droneSpeedKmh: 14.5,
            cameraPitchDegrees: -45,
            thumbnailUrl: getCorridorOrthophotos(matched.roadCode).oblique,
            defectsDetected: 1,
            surfaceCondition: matched.condition === 'Critical' ? 'Critical' : 'Fair',
          },
          {
            id: 'SNP-03',
            snapNumber: 3,
            chainage: 'Km 0+400',
            gps: { lat: parseFloat((matched.gpsLatitude + 0.0016).toFixed(5)), lng: parseFloat((matched.gpsLongitude + 0.0018).toFixed(5)) },
            timestamp: '09:45:58',
            droneAltitudeMeters: 32.8,
            droneSpeedKmh: 14.0,
            cameraPitchDegrees: -90,
            thumbnailUrl: REAL_ROAD_PHOTOS.potholePavement1,
            defectsDetected: matched.condition === 'Critical' ? 2 : 0,
            surfaceCondition: matched.condition === 'Critical' ? 'Poor' : 'Good',
          },
          {
            id: 'SNP-04',
            snapNumber: 4,
            chainage: 'Km 0+550',
            gps: { lat: parseFloat((matched.gpsLatitude + 0.0024).toFixed(5)), lng: parseFloat((matched.gpsLongitude + 0.0027).toFixed(5)) },
            timestamp: '09:46:20',
            droneAltitudeMeters: 31.9,
            droneSpeedKmh: 14.8,
            cameraPitchDegrees: -45,
            thumbnailUrl: REAL_ROAD_PHOTOS.potholeRepair1,
            defectsDetected: 1,
            surfaceCondition: 'Fair',
          },
        ],
      };
    }

    // Generate Standard Detailed Project Report (DPR)
    export function generateDPRForRoad(roadCode: string): DPRRecord {
      const surveys = generateInitialSurveys();
      const matched = surveys.find((s) => s.roadCode === roadCode) || surveys[0];
      const isMar1111 = matched.roadCode === 'MAR-1111';

      const dprNumber = `DPR/NKDA-WBHIDCO/2026/${matched.roadCode.replace(/[^a-zA-Z0-9]/g, '')}`;
      const totalSurveyedArea = Math.round((isMar1111 ? 0.12 : matched.distanceKm) * 1000 * 7.0); // Length * Carriageway width
      const distressArea = isMar1111 ? 1.86 : matched.areaOfBadness;

      // Bill of Quantities based on West Bengal PWD Schedule of Rates (Roads & Bridges 2022-2025)
      const boqItems: BOQItem[] = isMar1111
        ? [
            {
              id: 'BOQ-01',
              itemNo: '1.01',
              description: 'Localized cutting, squaring, and clearing of 4 critical potholes (PH-01 to PH-04) down to sound bituminous base course as per MoRTH Section 501 / IRC:82 guidelines.',
              unit: 'm²',
              quantity: 1.86,
              rateINR: 220,
              amountINR: 409,
              specCode: 'WB PWD SoR Item 4.02 / MoRTH 501',
            },
            {
              id: 'BOQ-02',
              itemNo: '1.02',
              description: 'Application of Slow Setting Bitumen Emulsion (SS-1) Tack Coat @ 0.25 kg/m² over prepared pothole bed and 120m corridor resurfacing carriageway (120m × 7.0m = 840 m²).',
              unit: 'm²',
              quantity: 841.86,
              rateINR: 38,
              amountINR: 31991,
              specCode: 'WB PWD SoR Item 4.12 / MoRTH 503',
            },
            {
              id: 'BOQ-03',
              itemNo: '1.03',
              description: 'Dense Bituminous Macadam (DBM Grade-II) infill for 4 potholes (geometric void volume 0.0372 m³) + leveling course compaction (12.5 m³) with tandem vibratory roller.',
              unit: 'm³',
              quantity: 12.5,
              rateINR: 5850,
              amountINR: 73125,
              specCode: 'WB PWD SoR Item 4.15 / MoRTH 507',
            },
            {
              id: 'BOQ-04',
              itemNo: '1.04',
              description: 'Mechanized cold milling (40mm depth) of 120m priority resurfacing segment (Chainage 0+000 to 0+120) with laser profile grade control to restore IRI below 2.2 m/km.',
              unit: 'm²',
              quantity: 840,
              rateINR: 145,
              amountINR: 121800,
              specCode: 'WB PWD SoR Item 4.08 / MoRTH 501',
            },
            {
              id: 'BOQ-05',
              itemNo: '1.05',
              description: 'Providing and laying 40mm wearing coat of Bituminous Concrete (BC Grade-1) with Polymer Modified Bitumen (PMB-40) including sensor paver compaction.',
              unit: 'm²',
              quantity: 840,
              rateINR: 620,
              amountINR: 520800,
              specCode: 'WB PWD SoR Item 4.18 / MoRTH 509',
            },
            {
              id: 'BOQ-06',
              itemNo: '1.06',
              description: 'Hot applied thermoplastic road markings (centerline and edge lines for 120m segment) with retroreflective glass beads type-II as per IRC:35.',
              unit: 'm²',
              quantity: 42,
              rateINR: 480,
              amountINR: 20160,
              specCode: 'WB PWD SoR Item 5.02 / IRC:35',
            },
            {
              id: 'BOQ-07',
              itemNo: '1.07',
              description: 'Temporary traffic management, retroreflective barricading, solar blinking lights, and nighttime safety illumination during New Town arterial resurfacing.',
              unit: 'LS',
              quantity: 1,
              rateINR: 25000,
              amountINR: 25000,
              specCode: 'NKDA Urban Safety Norms Section 12',
            },
          ]
        : [
            {
              id: 'BOQ-01',
              itemNo: '1.01',
              description: 'Cold Milling of damaged bituminous surface course (50mm depth) using mechanized cold planer with vacuum dust collector, disposal of reclaimed asphalt within 5km.',
              unit: 'm²',
              quantity: Math.max(45, Math.round(distressArea * 2.5)),
              rateINR: 145,
              amountINR: Math.max(45, Math.round(distressArea * 2.5)) * 145,
              specCode: 'WB PWD SoR Item 4.08 / MoRTH 501',
            },
            {
              id: 'BOQ-02',
              itemNo: '1.02',
              description: 'Application of Slow Setting Bitumen Emulsion (SS-1) Tack Coat @ 0.25 kg/m² over prepared and cleaned bituminous base course including power broom cleaning.',
              unit: 'm²',
              quantity: Math.max(45, Math.round(distressArea * 2.5)),
              rateINR: 38,
              amountINR: Math.max(45, Math.round(distressArea * 2.5)) * 38,
              specCode: 'WB PWD SoR Item 4.12 / MoRTH 503',
            },
            {
              id: 'BOQ-03',
              itemNo: '1.03',
              description: 'Providing and laying Dense Bituminous Macadam (DBM Grade-II) with 60/70 bitumen for rut and pothole infill, compacted to 98% density with 10-ton tandem vibratory roller.',
              unit: 'm³',
              quantity: parseFloat((Math.max(2.5, distressArea * (matched.depthOfRut / 1000) * 1.5)).toFixed(2)),
              rateINR: 5850,
              amountINR: Math.round(parseFloat((Math.max(2.5, distressArea * (matched.depthOfRut / 1000) * 1.5)).toFixed(2)) * 5850),
              specCode: 'WB PWD SoR Item 4.15 / MoRTH 507',
            },
            {
              id: 'BOQ-04',
              itemNo: '1.04',
              description: 'Providing and laying 40mm wearing coat of Bituminous Concrete (BC Grade-1) with Polymer Modified Bitumen (PMB-40) including sensor paver finishing and joint sealing.',
              unit: 'm²',
              quantity: Math.max(45, Math.round(distressArea * 2.5)),
              rateINR: 620,
              amountINR: Math.max(45, Math.round(distressArea * 2.5)) * 620,
              specCode: 'WB PWD SoR Item 4.18 / MoRTH 509',
            },
            {
              id: 'BOQ-05',
              itemNo: '1.05',
              description: 'Hot applied thermoplastic road marking paint (2.5mm thickness) with retroreflective glass beads type-II as per IRC:35 specifications.',
              unit: 'm²',
              quantity: 18,
              rateINR: 480,
              amountINR: 18 * 480,
              specCode: 'WB PWD SoR Item 5.02 / IRC:35',
            },
            {
              id: 'BOQ-06',
              itemNo: '1.06',
              description: 'Traffic management, safety retroreflective barricading, solar blinking lights, and warning signages during night-time repair works in New Town.',
              unit: 'm²',
              quantity: 1,
              rateINR: 12500,
              amountINR: 12500,
              specCode: 'NKDA Urban Safety Norms Section 12',
            },
          ];

      const subTotal = boqItems.reduce((acc, item) => acc + item.amountINR, 0);
      const gst18 = Math.round(subTotal * 0.18);
      const contingency3 = Math.round(subTotal * 0.03);
      const totalCost = subTotal + gst18 + contingency3;

      // 3-Stage Sequential Review Process
      const reviews: ReviewStage[] = [
        {
          stageId: 1,
          stageName: 'Stage 1: Technical Scrutiny & Field Verification',
          authorityRole: 'Executive Engineer (Roads & Quality Control)',
          authorityName: 'Er. Subhashis Sen, WBHIDCO / WB PWD',
          authorityEmail: 'ee.roads.hidco@wb.gov.in',
          status: isMar1111 ? 'Approved' : 'Pending',
          reviewedAt: isMar1111 ? '16 Nov 2026, 11:45 IST' : undefined,
          remarks: isMar1111 ? 'Laser profilometer (IRI 5.20 m/km) and 4 potholes (1.86 m², 20mm depth) verified on-site. Resurfacing of 120m segment approved under IRC:37-2018.' : undefined,
        },
        {
          stageId: 2,
          stageName: 'Stage 2: Financial Vetting & Budget Sanction',
          authorityRole: 'Financial Controller & Chief Accounts Officer',
          authorityName: 'Shri Partha Mukherjee, WBCS (Exe)',
          authorityEmail: 'finance.controller@nkda.gov.in',
          status: isMar1111 ? 'Approved' : 'Pending',
          reviewedAt: isMar1111 ? '16 Nov 2026, 12:15 IST' : undefined,
          remarks: isMar1111 ? 'Budget head 4059-Road Infrastructure Capital Works vetted. Estimate of ₹9,59,875 sanctioned for 120m segment.' : undefined,
        },
        {
          stageId: 3,
          stageName: 'Stage 3: Administrative Sanction & Tender Approval',
          authorityRole: 'Chief Executive Officer (CEO)',
          authorityName: 'Dr. Debashis Sen, IAS (Retd) / CEO NKDA',
          authorityEmail: 'ceo.nkda@wb.gov.in',
          status: isMar1111 ? 'Approved' : 'Pending',
          reviewedAt: isMar1111 ? '16 Nov 2026, 13:00 IST' : undefined,
          remarks: isMar1111 ? 'Administrative approval granted. Competent authority authorizes immediate publication of e-NIT on wbtenders.gov.in.' : undefined,
        },
      ];

      const tender: TenderNotice | undefined = isMar1111 ? {
        nitNumber: 'NIT-NKDA/WBHIDCO/ROADS/2026/001',
        workName: 'Urgent Restoration, 4 Pothole Patching & 120m Bituminous Resurfacing of NKDA Road MAR 1111 (Chainage 0+000 to 0+120), Action Area I, New Town Kolkata.',
        executingAgency: 'New Town Kolkata Development Authority (NKDA) & WBHIDCO',
        estimatedCostINR: totalCost,
        earnestMoneyINR: Math.round(totalCost * 0.02),
        completionPeriodDays: 30,
        bidSubmissionDeadline: '2026-12-07 17:00 IST',
        technicalBidOpenDate: '2026-12-09 11:30 IST',
        financialBidOpenDate: '2026-12-14 15:00 IST',
        portalUrl: 'https://wbtenders.gov.in',
        eligibilityCriteria: [
          'Registered Class-I / Class-II Road Contractors under WB PWD / WBHIDCO / NKDA / KMDA.',
          'Credential: At least 1 completed road bituminous surfacing work of minimum 40% tender value in the last 3 financial years.',
          'Valid GSTIN, PAN card, Professional Tax (PT) clearance, and EPF/ESI registration in West Bengal.',
          'Proof of ownership or assured lease agreement of Central Hot Mix Plant (min 100 TPH) within 40 km of New Town.',
          'Average annual turnover of minimum 50% tender value over the last 3 audited financial years.',
        ],
        mandatoryDocuments: [
          'Form-1 (Technical Bid Submission Application)',
          'Affidavit affirming non-blacklisting in any Govt/Semi-Govt organization',
          'Valid Trade License and Partnership Deed / Company Incorporation Certificate',
          'PAN, GST Registration & latest GSTR-3B filing acknowledgement',
          'Machinery Deployment Schedule & Plant Calibration Certificate',
        ],
        releasedAt: 'Pending Release',
        tenderStatus: 'Draft',
      } : undefined;

      const hasNsvSurvey = isMar1111;
      const hasDroneSurvey = isMar1111 || matched.pipelineTier === 'drone_only';
      const isBlocked = !isMar1111;
      const blockReason = !hasDroneSurvey
        ? 'No Drone Survey has been performed yet for this road. Autonomous aerial defect patrol required.'
        : !hasNsvSurvey
        ? 'No NSV Survey has been performed yet. Certified laser profilometer roughness (IRI) and rut depth survey required under IRC:SP:19-2020 prior to DPR formulation and tender release.'
        : undefined;

      return {
        dprNumber,
        roadCode: matched.roadCode,
        roadName: isMar1111 ? 'NKDA Road MAR 1111' : matched.roadName,
        location: matched.location,
        actionArea: matched.actionArea,
        roadType: matched.roadType,
        chainage: isMar1111 ? 'Km 0+000 - 0+120 (120m Resurfacing Segment)' : matched.chainage,
        roadLengthKm: isMar1111 ? 0.12 : matched.distanceKm,
        carriagewayWidthMeters: 7.0,
        distressAreaM2: distressArea,
        maxRutDepthMm: isMar1111 ? 20 : matched.depthOfRut,
        avgIRI: isMar1111 ? 5.20 : matched.condition === 'Critical' ? 4.8 : 2.4,
        goodnessScore: matched.goodnessScore,
        condition: matched.condition,
        pavementClassification: 'Flexible Bituminous Pavement (High-Volume Urban Corridor)',
        proposedTreatment: isMar1111
          ? 'Localized cut-and-fill permanent patching of 4 potholes (1.86 m² total, 20mm depth, 0.0372 m³ volume) + Mechanized Cold Milling (40mm depth) and Bituminous Concrete (BC Grade-1 with PMB-40) resurfacing of 120m segment (Chainage 0+000 to 0+120).'
          : 'Mechanized Cold Milling (50mm depth), SS-1 Tack Coat application, DBM Infill & Bituminous Concrete (BC Grade-1 with PMB-40) resurfacing with hot-pour joint crack sealing.',
        projectDurationDays: 30,
        estimatedCostINR: totalCost,
        contractorClassRequired: 'Class-I Registered Road Contractor (WB PWD / WBHIDCO / NKDA)',
        executiveSummary: isMar1111
          ? 'Detailed Project Report (DPR) prepared in accordance with the official Network Survey Vehicle (NSV) Road Condition Assessment for NKDA Road MAR 1111 (Biswa Bangla Sarani), Action Area I, New Town Kolkata. NSV survey identified 4 critical potholes with combined plan area of 20 sq ft (1.86 m²) and 20mm average depth (geometric void volume 0.0372 m³), with segment-average IRI of 5.20 m/km (Very Poor band > 5.0 m/km) across the 120m corridor segment (Chainage 0+000 to 0+120). Priority cold milling, tack coat, DBM infill, and bituminous resurfacing authorized for tender release.'
          : `Detailed Project Report for the rehabilitation and preventive maintenance of ${matched.roadName} (${matched.roadCode}) in ${matched.location}. Autonomous Drone AI survey identified ${matched.potholeCount} severe pothole defect(s) with rut depth up to ${matched.depthOfRut}mm over an affected area of ${matched.areaOfBadness}m². Work is recommended under New Town Urban Roads Annual Maintenance Schedule 2026-27 to prevent base course ingress and traffic hazard.`,
        boqItems,
        reviews,
        tender,
        lastUpdated: isMar1111 ? '16 Nov 2026, 13:00 IST' : '13 Nov 2026, 17:30 IST',
        hasNsvSurvey,
        hasDroneSurvey,
        isBlocked,
        blockReason,
      };
    }

    // Initial exports for service compatibility
    export const INITIAL_65_SURVEY_RECORDS = generateInitialSurveys();
    export const getMockNSVDetails = generateNSVDetailsForRoad;

    export function generateInitialSchedules(): LaneScheduleItem[] {
      return [
        {
          id: 'SCH-01',
          scheduleCode: 'SCH-NKDA-01',
          roadCode: 'NKDA-AA1-MAR-0001',
          roadName: 'Biswa Bangla Sarani (Major Arterial MAR-1111)',
          lane: 'Lane 1 (Slow / Heavy Vehicles)',
          sector: 'Action Area I',
          droneId: 'DRN-SKY-X4',
          pilotName: 'Debojyoti Mukherjee',
          scheduledDate: '2026-11-16',
          timeSlot: '05:30 - 08:30 (Morning Low Traffic)',
          flightAltitudeM: 35,
          expectedDurationMin: 45,
          surveyType: 'Routine AI Patrol',
          priority: 'High',
          status: 'Scheduled',
          assignedAt: '2026-11-13 14:00',
          notes: 'Focus on outer bus lane rutting near Nazrul Tirtha junction.',
        },
        {
          id: 'SCH-02',
          scheduleCode: 'SCH-NKDA-02',
          roadCode: 'NKDA-AA2-ECO-0006',
          roadName: 'Eco Park Perimeter Ring Road (Gate 1 - Gate 4)',
          lane: 'Lane 2 (Fast / Median)',
          sector: 'Action Area II',
          droneId: 'DRN-AERO-09',
          pilotName: 'Ananya Bose',
          scheduledDate: '2026-11-17',
          timeSlot: '06:00 - 09:00',
          flightAltitudeM: 40,
          expectedDurationMin: 50,
          surveyType: 'High-Speed NSV Sync',
          priority: 'Medium',
          status: 'In Flight',
          assignedAt: '2026-11-13 15:30',
          notes: 'Surveying longitudinal cracks along median curb line.',
        },
        {
          id: 'SCH-03',
          scheduleCode: 'SCH-NKDA-03',
          roadCode: 'NKDA-AA3-SLV-0011',
          roadName: 'Silicon Valley IT Expressway (Action Area III)',
          lane: 'Northbound Carriageway',
          sector: 'Action Area III',
          droneId: 'DRN-SURV-302',
          pilotName: 'Subir Karmakar',
          scheduledDate: '2026-11-19',
          timeSlot: '14:00 - 17:00',
          flightAltitudeM: 32,
          expectedDurationMin: 60,
          surveyType: 'Routine AI Patrol',
          priority: 'High',
          status: 'Scheduled',
          assignedAt: '2026-11-13 16:15',
          notes: 'Heavy IT transit route; coordinate with NKDA Traffic Police.',
        },
      ];
    }

    export const MOCK_LANE_SCHEDULES = generateInitialSchedules();
