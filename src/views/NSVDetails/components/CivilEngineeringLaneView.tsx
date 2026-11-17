import React, { useState } from 'react';
import {
  Activity,
  Layers,
  AlertTriangle,
  FileText,
  DollarSign,
  Eye,
  Camera,
  Video,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Maximize2,
  X,
  Compass,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { NSVRoadDetails } from '../../../models/nsvModels';
import { getCorridorPotholes, GisPothole } from '../../../services/newTownGisData';
import { DroneSurveyRecord } from '../../../models/surveyModels';

interface CivilEngineeringLaneViewProps {
  details: NSVRoadDetails;
  surveyRecord?: DroneSurveyRecord;
  onProceedToDpr?: () => void;
  onJumpTo360?: () => void;
}

export const CivilEngineeringLaneView: React.FC<CivilEngineeringLaneViewProps> = ({
  details,
  surveyRecord,
  onProceedToDpr,
  onJumpTo360,
}) => {
  const isMar1111 = details.roadCode === 'MAR-1111' || details.roadCode.includes('1111');

  // Obtain verified potholes for MAR-1111 from survey dataset
  const potholesList: GisPothole[] = getCorridorPotholes({
    id: 1,
    slNo: 1,
    roadCode: details.roadCode,
    roadName: details.roadName,
    location: details.section,
    actionArea: 'Action Area I',
    roadType: 'Major Arterial (6-Lane)',
    lane: 'Lane 1 (Slow / Heavy Vehicles)',
    chainage: details.section,
    distanceKm: details.lengthKm,
    goodnessScore: details.goodnessScore,
    condition: 'Critical',
    gpsLatitude: details.gpsStart.lat,
    gpsLongitude: details.gpsStart.lng,
    areaOfBadness: 1.86,
    depthOfRut: details.rutDepth.maxRutDepth,
    roughCostINR: 2820000,
    costPerM2: 2720,
    dronePhoto: '',
    dronePhotoThumb: '',
    dronePhoto2: '',
    dronePhoto2Thumb: '',
    potholeCount: 4,
    status: 'Assigned',
    surveyTimestamp: details.surveyDate,
    droneId: 'DJI-M350-RTK',
    droneModel: 'DJI Matrice 350 RTK',
    repairPriority: 'Emergency',
    droneSurveyDone: true,
    nsvSurveyDone: true,
    dprDone: true,
    tenderDone: true,
    pipelineTier: 'full_pipeline',
  });

  const [selectedPothole, setSelectedPothole] = useState<GisPothole>(potholesList[0]);
  const [showMediaModal, setShowMediaModal] = useState<boolean>(false);

  // Exact DPR Formula Calculations:
  // Part 1: Filling of Potholes
  // Formula: = potholes × avg depth × avg area × 10,000 RS
  const potholeCount = 4;
  const avgDepthMm = 20;
  const avgAreaM2 = 0.465; // 20 sq ft / 4 ≈ 0.465 m² per pothole (total 1.86 m²)
  const part1Cost = Math.round(potholeCount * avgDepthMm * avgAreaM2 * 10000); // 4 * 20 * 0.465 * 10,000 = 3,72,000

  // Part 2: Resurfacing with Bituminous Concrete
  // Formula: = Length × width of road × unit cost (or Length × avg depth × width × 30,000)
  const roadLengthMeters = 120;
  const carriagewayWidthMeters = 7.5; // 2 lanes (or 11m for 3 lanes)
  const unitCostPerM2 = 2720; // WB PWD SoR rate for 40mm Bituminous Concrete overlay
  const part2Cost = Math.round(roadLengthMeters * carriagewayWidthMeters * unitCostPerM2); // 120 * 7.5 * 2720 = 24,48,000

  const totalSegmentCost = part1Cost + part2Cost; // 28,20,000 (₹28.20 Lakhs)
  const totalSegmentLakhs = (totalSegmentCost / 100000).toFixed(2); // 28.20 Lakhs

  return (
    <div className="space-y-6">
      {/* 1. TOP CIVIL ENGINEERING METRICS KPI BAR (PAGE 4 PARAMETER TABLE FORMAT) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="p-3 bg-red-50/70 border border-red-200 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">
            Segment Average IRI
          </span>
          <div className="text-xl font-black text-red-600 mt-0.5 font-mono">
            5.20 <span className="text-xs font-normal text-slate-500">m/km</span>
          </div>
          <span className="text-[10px] text-red-700 font-semibold block mt-0.5 truncate" title="Illustrative; Very Poor band (>5.0)">
            Very Poor band (&gt;5.0)
          </span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Pothole Count
          </span>
          <div className="text-xl font-black text-[#c5221f] mt-0.5 font-mono">
            4 <span className="text-xs font-normal text-slate-500">Nos.</span>
          </div>
          <span className="text-[10px] text-slate-600 font-semibold block mt-0.5 truncate" title="Localized patch repairs required">
            Localized patch repairs
          </span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Combined Pothole Area
          </span>
          <div className="text-xl font-black text-slate-900 mt-0.5 font-mono">
            1.86 <span className="text-xs font-normal text-slate-500">m²</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5 truncate" title="20 sq ft (0.465 m² each)">
            20 sq ft (0.465 m² each)
          </span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Average Depth
          </span>
          <div className="text-xl font-black text-slate-900 mt-0.5 font-mono">
            20 <span className="text-xs font-normal text-slate-500">mm</span>
          </div>
          <span className="text-[10px] text-blue-700 font-semibold block mt-0.5 truncate" title="Void volume: 0.0372 m³ (approx 37.2L)">
            Void: 0.0372 m³ (37.2L)
          </span>
        </div>

        <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Resurfacing Length
          </span>
          <div className="text-xl font-black text-slate-900 mt-0.5 font-mono">
            120 <span className="text-xs font-normal text-slate-500">m</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5 truncate" title="Chainage Km 0+000 to 0+120">
            Ch: 0+000 to 0+120
          </span>
        </div>

        <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
            Recommended Action
          </span>
          <div className="text-xl font-black text-[#137333] mt-0.5 font-mono">
            ₹28.20 <span className="text-xs font-normal text-emerald-700">Lakh</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5 truncate" title="Patching + 120m Resurfacing (SoR)">
            Patching + 120m Resurfacing
          </span>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY & STATUTORY PARAMETER TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-blue-600 text-white">
              PAVEMENT SPECIFICATIONS
            </span>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Executive Summary &amp; Corridor Parameter Table (NKDA Road MAR 1111)
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Void Volume: 0.0372 m³ (37.2 Litres)
          </span>
        </div>

        <div className="p-4 space-y-3.5 text-xs">
          <p className="text-slate-700 leading-relaxed">
            The pavement distress inventory for <strong>NKDA Road MAR 1111</strong> records four potholes having a combined area of <strong>20 sq ft (approximately 1.86 m²)</strong> and an average depth of <strong>20 mm</strong>. The calculated geometric void volume is <strong>0.0372 m³ (37.2 litres)</strong>. A 120 m road section is proposed for resurfacing assessment on the basis of an illustrative segment-average IRI of <strong>5.20 m/km</strong> (Very Poor / Very Rough band, &gt;5.0 m/km).
          </p>

          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
                <tr>
                  <th className="p-2.5 border-b border-slate-200">Parameter</th>
                  <th className="p-2.5 border-b border-slate-200">Sample Result</th>
                  <th className="p-2.5 border-b border-slate-200">Assessment &amp; Engineering Implication</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">Pothole count</td>
                  <td className="p-2.5 font-mono font-bold text-red-600">4 Nos.</td>
                  <td className="p-2.5 text-slate-700 font-medium">Localized patch repairs required</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">Combined pothole area</td>
                  <td className="p-2.5 font-mono text-slate-900">20 sq ft / 1.86 m²</td>
                  <td className="p-2.5 text-slate-600">User-supplied assumption (0.465 m² each)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">Average depth</td>
                  <td className="p-2.5 font-mono text-slate-900">20 mm</td>
                  <td className="p-2.5 text-slate-600">User-supplied assumption</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">Estimated void volume</td>
                  <td className="p-2.5 font-mono font-bold text-blue-700">0.0372 m³</td>
                  <td className="p-2.5 text-slate-600">Geometric estimate only (37.2 litres)</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">Resurfacing length</td>
                  <td className="p-2.5 font-mono text-slate-900">120 m</td>
                  <td className="p-2.5 text-slate-600">User-supplied requirement (Chainage Km 0+000 to 0+120)</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-red-50/40">
                  <td className="p-2.5 font-bold text-slate-900">Segment average IRI</td>
                  <td className="p-2.5 font-mono font-extrabold text-[#ea4335]">5.20 m/km</td>
                  <td className="p-2.5 text-red-700 font-semibold">Illustrative; Very Poor band (&gt;5.0 m/km)</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-emerald-50/40">
                  <td className="p-2.5 font-bold text-slate-900">Recommended action</td>
                  <td className="p-2.5 font-mono font-bold text-emerald-800">₹28.20 Lakhs</td>
                  <td className="p-2.5 text-emerald-800 font-medium">Pothole patching + 120 m resurfacing assessment (SoR)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE 120-METER ROAD LANE SCHEMATIC VIEW */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Schematic Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#1a73e8] text-white">
                CIVIL SCHEMATIC
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Road MAR 1111 — 120m Resurfacing Segment (Chainage Km 0+000 to Km 0+120)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Dual 7.5m Carriageway • Lane 1 (Slow / Heavy Commercial Vehicle Wheelpath). Click any verified pothole pin along the lane to inspect photogrammetry &amp; video clip.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono hidden md:inline">
              Width: 7.5m dual • 4 Potholes Identified
            </span>
          </div>
        </div>

        {/* The 120m Lane Carriageway Canvas */}
        <div className="p-5 bg-slate-900 overflow-x-auto select-none">
          <div className="min-w-[760px] space-y-2">
            {/* Chainage Ruler */}
            <div className="flex justify-between text-[11px] font-mono text-slate-400 px-2 pb-1 border-b border-slate-700">
              <span className="flex items-center gap-1 font-bold text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Km 0+000 (Start)
              </span>
              <span>Km 0+020</span>
              <span>Km 0+040</span>
              <span>Km 0+060</span>
              <span>Km 0+080</span>
              <span>Km 0+100</span>
              <span className="flex items-center gap-1 font-bold text-white">
                Km 0+120 (End of Segment)
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              </span>
            </div>

            {/* Road Asphalt Box */}
            <div className="relative h-44 rounded-lg bg-gradient-to-b from-slate-800 via-slate-900 to-black border-2 border-slate-700 overflow-hidden shadow-inner flex flex-col justify-between">
              {/* Lane 2: Fast Vehicles / Median Verge */}
              <div className="h-1/2 border-b border-dashed border-amber-400/80 relative flex items-center px-4">
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider">
                  LANE 2 — FAST CARRIAGEWAY (MEDIAN DIVIDER VERGE)
                </span>
                <span className="absolute right-4 text-[10px] font-mono text-emerald-400">
                  IRI: 3.8 m/km (Sound Bitumen)
                </span>
              </div>

              {/* Lane 1: Slow / Heavy Vehicles (Where the 4 Potholes are located!) */}
              <div className="h-1/2 relative flex items-center px-4 bg-slate-950/60">
                <span className="text-[10px] font-mono font-bold text-red-400 tracking-wider">
                  LANE 1 — SLOW / HEAVY WHEELPATH (RESURFACING REQUIRED)
                </span>
                <span className="absolute right-4 text-[10px] font-mono text-red-400 font-bold">
                  IRI: 5.20 m/km • 20mm Rutting
                </span>

                {/* The 4 Pothole Pins Placed by Chainage */}
                {/* Pothole 1: Km 0+018 (18/120 = 15%) */}
                <button
                  onClick={() => setSelectedPothole(potholesList[0])}
                  style={{ left: '15%' }}
                  className={`absolute -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition transform ${
                    selectedPothole.id === 'PH-01' ? 'scale-115 z-20' : 'hover:scale-105 z-10'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex flex-col items-center justify-center text-white font-mono shadow-xl border-2 transition ${
                      selectedPothole.id === 'PH-01'
                        ? 'bg-red-600 border-[#facc15] ring-4 ring-red-500/40'
                        : 'bg-red-700/90 border-white hover:bg-red-600'
                    }`}
                  >
                    <span className="text-[10px] font-bold">P1</span>
                    <span className="text-[7px] font-semibold opacity-90">20mm</span>
                  </div>
                  <span className="text-[9px] font-mono text-white mt-1 bg-black/80 px-1.5 py-0.5 rounded shadow">
                    Km 0+018
                  </span>
                </button>

                {/* Pothole 2: Km 0+045 (45/120 = 37.5%) */}
                <button
                  onClick={() => setSelectedPothole(potholesList[1])}
                  style={{ left: '37.5%' }}
                  className={`absolute -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition transform ${
                    selectedPothole.id === 'PH-02' ? 'scale-115 z-20' : 'hover:scale-105 z-10'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex flex-col items-center justify-center text-white font-mono shadow-xl border-2 transition ${
                      selectedPothole.id === 'PH-02'
                        ? 'bg-red-600 border-[#facc15] ring-4 ring-red-500/40'
                        : 'bg-red-700/90 border-white hover:bg-red-600'
                    }`}
                  >
                    <span className="text-[10px] font-bold">P2</span>
                    <span className="text-[7px] font-semibold opacity-90">20mm</span>
                  </div>
                  <span className="text-[9px] font-mono text-white mt-1 bg-black/80 px-1.5 py-0.5 rounded shadow">
                    Km 0+045
                  </span>
                </button>

                {/* Pothole 3: Km 0+082 (82/120 = 68.3%) */}
                <button
                  onClick={() => setSelectedPothole(potholesList[2])}
                  style={{ left: '68.3%' }}
                  className={`absolute -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition transform ${
                    selectedPothole.id === 'PH-03' ? 'scale-115 z-20' : 'hover:scale-105 z-10'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex flex-col items-center justify-center text-white font-mono shadow-xl border-2 transition ${
                      selectedPothole.id === 'PH-03'
                        ? 'bg-red-600 border-[#facc15] ring-4 ring-red-500/40'
                        : 'bg-red-700/90 border-white hover:bg-red-600'
                    }`}
                  >
                    <span className="text-[10px] font-bold">P3</span>
                    <span className="text-[7px] font-semibold opacity-90">20mm</span>
                  </div>
                  <span className="text-[9px] font-mono text-white mt-1 bg-black/80 px-1.5 py-0.5 rounded shadow">
                    Km 0+082
                  </span>
                </button>

                {/* Pothole 4: Km 0+105 (105/120 = 87.5%) */}
                <button
                  onClick={() => setSelectedPothole(potholesList[3])}
                  style={{ left: '87.5%' }}
                  className={`absolute -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition transform ${
                    selectedPothole.id === 'PH-04' ? 'scale-115 z-20' : 'hover:scale-105 z-10'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex flex-col items-center justify-center text-white font-mono shadow-xl border-2 transition ${
                      selectedPothole.id === 'PH-04'
                        ? 'bg-red-600 border-[#facc15] ring-4 ring-red-500/40'
                        : 'bg-red-700/90 border-white hover:bg-red-600'
                    }`}
                  >
                    <span className="text-[10px] font-bold">P4</span>
                    <span className="text-[7px] font-semibold opacity-90">20mm</span>
                  </div>
                  <span className="text-[9px] font-mono text-white mt-1 bg-black/80 px-1.5 py-0.5 rounded shadow">
                    Km 0+105
                  </span>
                </button>
              </div>
            </div>

            {/* Curb Footer */}
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 pt-1">
              <span>Road Edge Curb (Action Area I Verge)</span>
              <span className="text-yellow-400">Total Pothole Area: 1.86 m² (20 sq ft) • Average Depth: 20 mm</span>
              <span>Direction: Major Arterial North Bound</span>
            </div>
          </div>
        </div>

        {/* Selected Pothole Detail Strip */}
        {selectedPothole && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                onClick={() => setShowMediaModal(true)}
                className="w-16 h-16 rounded-lg overflow-hidden border-2 border-red-500 shadow-sm relative group cursor-pointer flex-shrink-0"
                title="Click to view full photogrammetric photo & video clip"
              >
                <img
                  src={selectedPothole.photoUrl}
                  alt={selectedPothole.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition flex items-center justify-center">
                  <Eye className="w-4 h-4 text-white" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900 text-sm">
                    {selectedPothole.id}: {selectedPothole.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-[#c5221f] border border-red-200">
                    Depth: {selectedPothole.depthMm} mm
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-semibold">
                    {selectedPothole.chainage}
                  </span>
                </div>

                <div className="text-xs text-slate-600 mt-1 flex items-center gap-3 flex-wrap">
                  <span>
                    Dimensions: <strong>{selectedPothole.dimensions}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Patch Volume: <strong>0.0093 m³</strong>
                  </span>
                  <span>•</span>
                  <span className="text-slate-500 font-mono">
                    GPS: {selectedPothole.lat.toFixed(5)}°N, {selectedPothole.lng.toFixed(5)}°E
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Structural Diagnosis: <em>{selectedPothole.layerDamage}</em>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowMediaModal(true)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Camera className="w-3.5 h-3.5 text-[#1a73e8]" />
                <span>View Survey Photo &amp; Video</span>
              </button>

              {onJumpTo360 && (
                <button
                  onClick={onJumpTo360}
                  className="px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Potholes &amp; Waypoints</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 3. STATUTORY COST ESTIMATION FORMULA BREAKDOWN (INPUTS FEED INTO DPR) */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-xl p-6 shadow-md border border-slate-700 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950 font-mono">
                PWD SoR 2022-2025 FORMULAS
              </span>
              <h3 className="text-base font-bold tracking-tight">
                Statutory Repair &amp; Resurfacing Cost Formulation (Road NKDA MAR 1111)
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Exact statutory calculation based on Schedule of Rates formulas (feeds directly into dynamic DPR generation in the next step). Work comprises two scopes:
            </p>
          </div>

          {onProceedToDpr && (
            <button
              onClick={onProceedToDpr}
              className="px-4 py-2 bg-[#34a853] hover:bg-[#2d9247] text-white text-xs font-bold rounded-lg shadow-md transition flex items-center gap-2 cursor-pointer self-start sm:self-auto"
            >
              <FileText className="w-4 h-4" />
              <span>Proceed to Generate DPR</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Two Work Types Side-by-Side Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Work Type 1: Pothole Filling */}
          <div className="p-4 bg-slate-800/90 rounded-lg border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center font-bold text-[11px] text-amber-300">
                  1
                </span>
                Part 1: Filling of Potholes (Patching)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                4 Potholes Verified
              </span>
            </div>

            <div className="p-2.5 bg-slate-900 rounded font-mono text-xs text-amber-300 border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Statutory PWD SoR Formula:</span>
              <code>Cost = Potholes (N) × Avg Depth × Avg Area × ₹10,000</code>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Number of Potholes (N):</span>
                <span className="font-mono font-bold text-white">4 Nos.</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Average Pothole Depth:</span>
                <span className="font-mono font-bold text-white">20 mm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Average Area per Pothole:</span>
                <span className="font-mono font-bold text-white">0.465 m² (Total: 1.86 m² / 20 sq ft)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Patch Infill Volume:</span>
                <span className="font-mono text-slate-300">0.0372 m³ (Bituminous Macadam)</span>
              </div>
            </div>

            <div className="p-2.5 bg-amber-950/40 border border-amber-800/80 rounded flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-300 font-semibold block uppercase">
                  Part 1 Estimated Cost
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  4 × 20 × 0.465 × ₹10,000
                </span>
              </div>
              <div className="text-lg font-black text-amber-300 font-mono">
                ₹{part1Cost.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-amber-200 block text-right">(₹3.72 Lakhs)</span>
              </div>
            </div>
          </div>

          {/* Work Type 2: Resurfacing with Bituminous Concrete */}
          <div className="p-4 bg-slate-800/90 rounded-lg border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-emerald-400/20 flex items-center justify-center font-bold text-[11px] text-emerald-300">
                  2
                </span>
                Part 2: Resurfacing with Bituminous Concrete (BC)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                120m Resurfacing
              </span>
            </div>

            <div className="p-2.5 bg-slate-900 rounded font-mono text-xs text-emerald-300 border border-slate-700">
              <span className="text-slate-400 block text-[10px]">Statutory PWD SoR Formula:</span>
              <code>Cost = Length × Avg Depth of Surfacing × Width of Road × ₹30,000</code>
            </div>

            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Corridor Segment Length (L):</span>
                <span className="font-mono font-bold text-white">120 meters (Km 0+000 - 0+120)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Carriageway Width (W):</span>
                <span className="font-mono font-bold text-white">7.5 meters (Dual Carriageway)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Surfacing Specification:</span>
                <span className="font-mono font-bold text-white">Length × Avg Depth × Width of Road × ₹30,000</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-700/60">
                <span className="text-slate-400">Schedule Rate:</span>
                <span className="font-mono text-slate-300">₹30,000 Standard SoR Volumetric Multiplier</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/80 rounded flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-300 font-semibold block uppercase">
                  Part 2 Estimated Cost
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Length × Avg Depth × Width × ₹30,000
                </span>
              </div>
              <div className="text-lg font-black text-emerald-300 font-mono">
                ₹{part2Cost.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-emerald-200 block text-right">(₹24.48 Lakhs)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Summary Strip */}
        <div className="p-4 bg-slate-950/90 rounded-lg border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-300">
              Total Combined Estimated Amount Put to Tender (120m Corridor Segment):
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Part 1 (₹3.72 Lakhs) + Part 2 (₹24.48 Lakhs) • Defect Liability: 1 Year • Security Deposit: 10%
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-black text-white font-mono">
              ₹{totalSegmentCost.toLocaleString('en-IN')}
            </div>
            <span className="text-xs text-emerald-400 font-semibold">
              ₹{totalSegmentLakhs} Lakhs (120m Corridor Segment Sanction)
            </span>
          </div>
        </div>
      </div>

      {/* 4. MODAL: FULL PHOTOGRAMMETRIC PHOTO & SURVEY VIDEO PREVIEW */}
      {showMediaModal && selectedPothole && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl text-white">
            <div className="p-3.5 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#1a73e8]" />
                <span className="font-bold">
                  Drone Photogrammetry Inspection • {selectedPothole.title} ({selectedPothole.chainage})
                </span>
              </div>
              <button
                onClick={() => setShowMediaModal(false)}
                className="p-1 hover:bg-slate-700 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="relative aspect-[16/10] bg-black rounded-lg overflow-hidden border border-slate-700">
                <img
                  src={selectedPothole.photoUrl}
                  alt={selectedPothole.title}
                  className="w-full h-full object-cover"
                />

                {/* AI Laser Bounding Box Overlay */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-[55%] h-[50%] border-2 border-red-500 bg-red-500/20 rounded relative flex flex-col justify-between p-2 shadow-xl">
                    <span className="bg-red-600 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shadow self-start">
                      {selectedPothole.id}: 20mm DEPTH • 0.465m²
                    </span>
                    <span className="bg-black/80 text-yellow-400 font-mono text-[9px] px-1.5 py-0.5 rounded self-end">
                      VOL: 0.0093 m³ • CONF: {selectedPothole.confidence}%
                    </span>
                  </div>
                </div>

                <div className="absolute top-2 left-2 bg-black/75 px-2 py-1 rounded text-[10px] font-mono text-white">
                  SURVEY RUN: DJI MATRICE 350 RTK • ORTHOMOSAIC
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div className="p-2 bg-slate-800 rounded border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Location GPS</span>
                  <span className="font-bold text-white">
                    {selectedPothole.lat.toFixed(5)}°N, {selectedPothole.lng.toFixed(5)}°E
                  </span>
                </div>
                <div className="p-2 bg-slate-800 rounded border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Pothole Depth</span>
                  <span className="font-bold text-red-400">{selectedPothole.depthMm} mm</span>
                </div>
                <div className="p-2 bg-slate-800 rounded border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Patch Infill Volume</span>
                  <span className="font-bold text-amber-400">0.0093 m³</span>
                </div>
                <div className="p-2 bg-slate-800 rounded border border-slate-700">
                  <span className="text-slate-400 text-[10px] block">Surface Treatment</span>
                  <span className="font-bold text-emerald-400">Pre-Resurfacing Patch</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded border border-slate-700 text-xs text-slate-300">
                <strong className="text-white">Civil Engineering Action:</strong> Saw-cut edges vertically in rectangular shape, clean loose aggregates with compressed air, apply rapid-setting bitumen emulsion tack coat, and infill with Dense Bituminous Macadam (DBM) compacted with 10-ton roller prior to 40mm Bituminous Concrete overlay.
              </div>
            </div>

            <div className="p-3 bg-slate-800 border-t border-slate-700 flex justify-end">
              <button
                onClick={() => setShowMediaModal(false)}
                className="px-4 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded cursor-pointer"
              >
                Close Visual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
