import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  Eye,
  FileText,
  MapPin,
  ExternalLink,
  AlertTriangle,
  Camera,
  Video,
  ChevronRight,
  Sparkles,
  Layers,
  ZoomIn,
  CheckCircle2,
  Calendar,
  DollarSign,
  Maximize2,
  X,
  Activity,
  Compass,
  ArrowLeft,
  Lock,
  Navigation,
  Upload,
  FileUp,
  FileCheck,
} from 'lucide-react';
import { UploadNsvReportModal } from '../../../common/UploadNsvReportModal';
import { DroneSurveyRecord } from '../../../models/surveyModels';
import { DroneVideoPlayer } from './DroneVideoPlayer';
import {
  getCorridorPotholes,
  getCorridorOrthophotos,
  GisPothole,
} from '../../../services/newTownGisData';

interface RoadInspectionSidePanelProps {
  survey: DroneSurveyRecord;
  onClose?: () => void;
  selectedPotholeId?: string;
  onSelectPothole?: (potholeId: string) => void;
}

export const RoadInspectionSidePanel: React.FC<RoadInspectionSidePanelProps> = ({
  survey,
  onClose,
  selectedPotholeId,
  onSelectPothole,
}) => {
  const navigate = useNavigate();
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'photos' | 'potholes' | 'project_info'>('video');
  const [zoomPhotoUrl, setZoomPhotoUrl] = useState<string | null>(null);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  // Helper functions for initial NSV status per road
  const getInitialNsvUploaded = (code: string) => {
    const isMar = code === 'MAR-1111' || code.includes('1111');
    const saved = localStorage.getItem(`nsv_uploaded_${code}`);
    if (saved !== null) return saved === 'true';
    return isMar;
  };

  const getInitialPdfName = (code: string) => {
    const isMar = code === 'MAR-1111' || code.includes('1111');
    const saved = localStorage.getItem(`nsv_pdf_name_${code}`);
    if (saved) return saved;
    return isMar ? 'NSV_Report_NKDA_Road_MAR_1111_Reference_Style.pdf' : '';
  };

  // NSV Report Upload & Extraction State
  const [showUploadNsvModal, setShowUploadNsvModal] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isNsvUploaded, setIsNsvUploaded] = useState<boolean>(() => getInitialNsvUploaded(survey.roadCode));
  const [uploadedPdfName, setUploadedPdfName] = useState<string>(() => getInitialPdfName(survey.roadCode));
  const [isExtractingData, setIsExtractingData] = useState<boolean>(false);
  const [extractionComplete, setExtractionComplete] = useState<boolean>(() => getInitialNsvUploaded(survey.roadCode));

  // Sync state whenever survey road changes
  useEffect(() => {
    const uploaded = getInitialNsvUploaded(survey.roadCode);
    setIsNsvUploaded(uploaded);
    setExtractionComplete(uploaded);
    setUploadedPdfName(getInitialPdfName(survey.roadCode));
    setUploadError(null);

    const handleNsvUploaded = (e: any) => {
      if (e.detail?.roadCode === survey.roadCode) {
        setIsNsvUploaded(true);
        setExtractionComplete(true);
        if (e.detail?.filename) setUploadedPdfName(e.detail.filename);
      }
    };
    window.addEventListener('nsv-uploaded', handleNsvUploaded);
    return () => window.removeEventListener('nsv-uploaded', handleNsvUploaded);
  }, [survey.roadCode]);

  const handleSimulateExtraction = (filename: string) => {
    setIsExtractingData(true);
    setExtractionComplete(false);
    setTimeout(() => {
      setIsExtractingData(false);
      setExtractionComplete(true);
      setIsNsvUploaded(true);
      localStorage.setItem(`nsv_uploaded_${survey.roadCode}`, 'true');
      localStorage.setItem(`nsv_pdf_name_${survey.roadCode}`, filename);
    }, 700);
  };

  const isMar1111 = survey.roadCode === 'MAR-1111' || survey.roadCode.includes('1111');
  const isFullPipeline = survey.pipelineTier === 'full_pipeline';
  const isDroneOnly = survey.pipelineTier === 'drone_only';
  const isPendingDrone = survey.pipelineTier === 'pending_drone';

  // Dynamically obtain verified potholes for this specific corridor
  const potholesList: GisPothole[] = getCorridorPotholes(survey);

  // Get distinct orthophotos for this corridor
  const orthophotos = getCorridorOrthophotos(survey.roadCode);

  const handleDispatchDroneFlight = () => {
    setDispatchToast(`Drone patrol mission dispatched for ${survey.roadCode}! DJI Matrice 350 RTK taking off.`);
    setTimeout(() => setDispatchToast(null), 4000);
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-full">
      {/* Toast */}
      {dispatchToast && (
        <div className="fixed bottom-5 right-5 z-50 p-3 bg-white border border-blue-400 rounded-lg shadow-xl text-xs font-semibold text-slate-800 flex items-center gap-2 animate-in fade-in">
          <Navigation className="w-4 h-4 text-[#1a73e8] animate-spin" />
          <span>{dispatchToast}</span>
        </div>
      )}

      {/* Photo Zoom Modal */}
      {zoomPhotoUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-3 bg-slate-800 text-white flex items-center justify-between text-xs font-bold">
              <span>High-Resolution Drone Visual • {survey.roadCode}</span>
              <button
                onClick={() => setZoomPhotoUrl(null)}
                className="p-1 hover:bg-slate-700 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={zoomPhotoUrl} alt="Inspection Visual" className="w-full max-h-[70vh] object-cover" />
          </div>
        </div>
      )}

      {/* Header Info Card */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition cursor-pointer"
                  title="Back to All Corridors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <span className="text-base font-extrabold text-slate-900">{survey.roadCode}</span>

              {isFullPipeline && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase bg-red-100 text-[#c5221f] border border-red-300">
                  Critical Priority • 4 Potholes
                </span>
              )}

              {isDroneOnly && (
                <>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase bg-blue-100 text-[#1a73e8] border border-blue-200">
                    Drone Done
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-[#b06000] border border-amber-200">
                    No NSV Survey
                  </span>
                </>
              )}

              {isPendingDrone && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-[#b06000] border border-amber-300">
                  No Drone Survey Performed Yet
                </span>
              )}

              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-blue-50 text-[#1a73e8] border border-blue-200">
                {survey.actionArea}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-800 mt-1">{survey.roadName}</h4>
            <div className="text-xs text-slate-500 mt-0.5">{survey.location}</div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Health Score</span>
            <span
              className={`text-xl font-extrabold ${
                isPendingDrone
                  ? 'text-slate-500'
                  : survey.goodnessScore <= 35
                  ? 'text-[#ea4335]'
                  : survey.goodnessScore <= 60
                  ? 'text-[#fbbc04]'
                  : 'text-[#34a853]'
              }`}
            >
              {isPendingDrone ? 'Pending' : survey.goodnessScore}
              {!isPendingDrone && <span className="text-xs text-slate-400 font-normal">/100</span>}
            </span>
          </div>
        </div>

        {/* Status Callout Banner */}
        {isPendingDrone && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>NO DRONE SURVEY HAS BEEN PERFORMED YET</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Autonomous aerial patrol mission is queued for this corridor. No drone flight footage, thermography scans, or AI pothole telemetry have been recorded yet.
            </p>
          </div>
        )}

        {isDroneOnly && (
          <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Drone Survey Completed • 5 Potholes Verified</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                NSV Pending
              </span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              High-resolution drone video &amp; orthophoto scans are available below. <strong>No NSV Survey has been performed yet</strong> on this corridor (Laser profilometer &amp; DPR pending).
            </p>
          </div>
        )}

        {/* GPS Coordinates & Lane Row */}
        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
          <div className="p-2 bg-white rounded border border-slate-200">
            <span className="text-slate-400 text-[10px] block">Location GPS</span>
            <span className="font-mono font-semibold text-slate-900 text-[11px]">
              {survey.gpsLatitude.toFixed(5)}°N, {survey.gpsLongitude.toFixed(5)}°E
            </span>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200">
            <span className="text-slate-400 text-[10px] block">Lane & Chainage</span>
            <span className="font-semibold text-slate-800 text-[11px] truncate block" title={survey.lane}>
              {survey.lane} ({survey.chainage})
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="p-2 bg-white rounded border border-slate-200 text-center">
            <span className="text-slate-400 text-[10px] block">Lane Potholes</span>
            <span className={`text-sm font-bold ${isPendingDrone ? 'text-slate-500' : 'text-red-600'}`}>
              {isPendingDrone ? 'Awaiting Flight' : `${potholesList.length} Potholes`}
            </span>
          </div>
          <div className="p-2 bg-white rounded border border-slate-200 text-center">
            <span className="text-slate-400 text-[10px] block">Avg Rut Depth</span>
            <span className={`text-sm font-bold ${isPendingDrone ? 'text-slate-500' : isDroneOnly ? 'text-amber-600' : 'text-red-600'}`}>
              {isPendingDrone ? 'Awaiting Flight' : `${survey.depthOfRut} mm`}
            </span>
          </div>
          <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-center">
            <span className="text-emerald-700 text-[10px] block">Estimated Repair Cost</span>
            <span className="text-sm font-bold text-[#137333]">
              {isPendingDrone ? 'Pending Survey' : isFullPipeline ? '₹28.20 Lakh' : `₹${survey.roughCostINR.toLocaleString('en-IN')}`}
            </span>
          </div>
        </div>

        {/* Civil Engineering Formula Breakdown for Road MAR 1111 */}
        {isFullPipeline && (
          <div className="p-2.5 bg-slate-900 rounded-lg text-white text-[11px] font-mono space-y-1 border border-slate-700 shadow-xs">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
              Schedule of Rates Cost Calculation (SoR):
            </div>
            <div className="flex justify-between text-amber-300">
              <span>Part 1 (4 Potholes):</span>
              <span>₹3,72,000 (4 × 20mm × 0.465m² × ₹10k)</span>
            </div>
            <div className="flex justify-between text-emerald-300">
              <span>Part 2 (120m Resurfacing):</span>
              <span>₹24,48,000 (Length × avg depth of surfacing × width of road × ₹30,000)</span>
            </div>
            <div className="pt-0.5 border-t border-slate-700 flex justify-between font-bold text-white">
              <span>Total Estimated Cost (120m):</span>
              <span>₹28,20,000 (₹28.20 Lakhs)</span>
            </div>
          </div>
        )}

        {/* Corridor Specifications & Pavement Structure Summary */}
        {isFullPipeline && (
          <div className="p-2.5 bg-slate-50 rounded-lg text-slate-800 text-[11px] border border-slate-200 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-900 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#1a73e8]" />
                Road Specifications &amp; Defect Summary
              </span>
              <button
                onClick={() => setActiveMediaTab('project_info')}
                className="text-[10px] text-[#1a73e8] hover:underline font-bold cursor-pointer"
              >
                View Full Specs →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <div className="bg-white p-1.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[9px]">Road Classification</span>
                <span className="font-semibold text-slate-800">Divided 6-Lane Major Arterial</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[9px]">Authority</span>
                <span className="font-semibold text-slate-800">NKDA (West Bengal)</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[9px]">Verified Potholes</span>
                <span className="font-bold text-red-600">4 Nos. (20 sq ft / 1.86 m²)</span>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200">
                <span className="text-slate-400 block text-[9px]">Avg Rut Depth &amp; Void</span>
                <span className="font-bold text-slate-800">20 mm (0.0372 m³ total)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media View Mode Selector Tabs: Drone Specifications First, Road Specs Last */}
      <div className="flex items-center border-b border-slate-200 bg-white px-3 text-xs overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveMediaTab('video')}
          className={`px-2.5 py-2.5 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeMediaTab === 'video'
              ? 'border-[#1a73e8] text-[#1a73e8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Drone Survey Video</span>
        </button>

        <button
          onClick={() => setActiveMediaTab('photos')}
          className={`px-2.5 py-2.5 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeMediaTab === 'photos'
              ? 'border-[#1a73e8] text-[#1a73e8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Drone Orthophotos</span>
        </button>

        <button
          onClick={() => setActiveMediaTab('potholes')}
          className={`px-2.5 py-2.5 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeMediaTab === 'potholes'
              ? 'border-[#1a73e8] text-[#1a73e8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-[#ea4335]" />
          <span>Potholes ({potholesList.length})</span>
        </button>

        <button
          onClick={() => setActiveMediaTab('project_info')}
          className={`px-2.5 py-2.5 border-b-2 font-semibold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeMediaTab === 'project_info'
              ? 'border-[#1a73e8] text-[#1a73e8]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-blue-600" />
          <span>Road Specifications</span>
        </button>
      </div>

      {/* Media View Tab Content */}
      <div className="p-3.5 flex-1 overflow-y-auto space-y-3">
        {/* 0. ROAD SPECIFICATIONS & PAVEMENT STRUCTURE (CLEAN NATIVE UI) */}
        {activeMediaTab === 'project_info' && (
          <div className="space-y-3 text-xs">
            {/* Header Banner */}
            <div className="p-3.5 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-xl shadow-xs space-y-2">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  CORRIDOR PROFILE
                </span>
                <span className="text-[10px] text-slate-300 font-mono">NKDA Asset: MAR-1111</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Road Specifications &amp; Pavement Structure</h4>
                <p className="text-[11px] text-blue-200 mt-0.5">
                  Biswa Bangla Sarani (Major Arterial MAR-1111) • Action Area I, New Town
                </p>
              </div>
            </div>

            {/* 4 Primary Metric Cards */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Road Hierarchy</span>
                <div className="font-bold text-slate-900 leading-tight">Divided 6-Lane</div>
                <span className="text-[10px] text-slate-500">Major Arterial (NKDA)</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Verified Defects</span>
                <div className="font-black text-red-600 font-mono text-sm leading-tight">4 Potholes</div>
                <span className="text-[10px] text-slate-500">Area: 1.86 m² (20 sq ft)</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Surface Rut Depth</span>
                <div className="font-black text-amber-600 font-mono text-sm leading-tight">20 mm Avg</div>
                <span className="text-[10px] text-slate-500">Void: 0.0372 m³ (37.2 L)</span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Required Scope</span>
                <div className="font-bold text-emerald-700 leading-tight">120m Resurfacing</div>
                <span className="text-[10px] text-slate-500">Ch: 0+000 to 0+120</span>
              </div>
            </div>

            {/* Corridor Identification & Physical Dimensions */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 text-[11px] flex items-center justify-between">
                <span>Corridor Identification &amp; Technical Attributes</span>
                <span className="text-[10px] font-mono text-slate-500 font-normal">Standard Engineering Profile</span>
              </div>
              <div className="divide-y divide-slate-100 text-[11px]">
                <div className="grid grid-cols-3 p-2 hover:bg-slate-50">
                  <span className="font-semibold text-slate-500 col-span-1">Corridor Asset</span>
                  <span className="text-slate-900 font-bold col-span-2">Biswa Bangla Sarani (NKDA Road MAR 1111)</span>
                </div>
                <div className="grid grid-cols-3 p-2 hover:bg-slate-50">
                  <span className="font-semibold text-slate-500 col-span-1">Jurisdiction</span>
                  <span className="text-slate-900 col-span-2">New Town Kolkata Development Authority (NKDA)</span>
                </div>
                <div className="grid grid-cols-3 p-2 hover:bg-slate-50">
                  <span className="font-semibold text-slate-500 col-span-1">Carriageway Design</span>
                  <span className="text-slate-900 col-span-2">Dual Carriageway • 3 × 3.5m Lanes per direction (10.5m)</span>
                </div>
                <div className="grid grid-cols-3 p-2 hover:bg-slate-50">
                  <span className="font-semibold text-slate-500 col-span-1">Pavement Type</span>
                  <span className="text-slate-900 font-semibold col-span-2">Flexible bituminous multi-layer pavement</span>
                </div>
                <div className="grid grid-cols-3 p-2 hover:bg-slate-50 bg-red-50/50">
                  <span className="font-bold text-red-900 col-span-1">Surface Distress</span>
                  <span className="font-bold text-red-700 col-span-2">
                    4 Potholes (20 sq ft / 1.86 m²) • 20 mm avg depth • 0.0372 m³ void
                  </span>
                </div>
                <div className="grid grid-cols-3 p-2 hover:bg-slate-50">
                  <span className="font-semibold text-slate-500 col-span-1">Intervention Limit</span>
                  <span className="font-bold text-emerald-700 col-span-2">120 m Segment (Chainage 0+000 to 0+120)</span>
                </div>
                <div className="grid grid-cols-3 p-2 hover:bg-slate-50">
                  <span className="font-semibold text-slate-500 col-span-1">Ride Quality (IRI)</span>
                  <span className="font-bold font-mono text-[#ea4335] col-span-2">5.20 m/km – Severe Roughness (&gt;5.0 m/km)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 1. DRONE AI VIDEO FEED */}
        {activeMediaTab === 'video' && (
          <div className="space-y-2">
            {isPendingDrone ? (
              /* Drone Aerial Patrol Standby Card */
              <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-mono text-xs text-amber-300 font-bold uppercase tracking-wider">
                      AERIAL PATROL STANDBY
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                    DJI Matrice 350 RTK
                  </span>
                </div>

                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-slate-100">
                    No Drone Flight Video Recorded Yet for {survey.roadCode}
                  </h5>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Corridor: {survey.roadName} ({survey.lane}). Drone patrol mission is in queue at New Town Autonomous Flight Dock #02.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <div>Mission Mode: <span className="text-blue-400">Autonomous Waypoint</span></div>
                  <div>Flight Altitude: <span className="text-emerald-400">45m AGL</span></div>
                  <div>Planned Waypoints: <span className="text-amber-400">8 GPS Points</span></div>
                  <div>Sensor Payload: <span className="text-slate-300">45MP RGB + Thermal</span></div>
                </div>

                <button
                  onClick={handleDispatchDroneFlight}
                  className="w-full py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Dispatch Autonomous Drone Flight Now</span>
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Aerial Drone Photogrammetry Survey Inspection:</span>
                  <span className="text-[11px] font-mono text-slate-500">120m Corridor Pass</span>
                </div>
                <DroneVideoPlayer
                  roadCode={survey.roadCode}
                  roadName={survey.roadName}
                  potholeCount={potholesList.length}
                  potholes={potholesList}
                  roadType={survey.roadType}
                  gpsLat={survey.gpsLatitude}
                  gpsLng={survey.gpsLongitude}
                  onPotholeDetected={(idx) => {
                    const targetPth = potholesList[idx - 1];
                    if (targetPth && onSelectPothole) onSelectPothole(targetPth.id);
                  }}
                />
                <p className="text-[11px] text-slate-500 italic">
                  Photogrammetry survey recording mapping verified surface distress and moisture pooling on {survey.roadCode}.
                </p>
              </>
            )}
          </div>
        )}

        {/* 2. DRONE ORTHOPHOTOS */}
        {activeMediaTab === 'photos' && (
          <div className="space-y-3">
            {isPendingDrone ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                <Camera className="w-8 h-8 text-slate-400 mx-auto" />
                <h5 className="text-xs font-bold text-slate-700">No Orthophoto Scans Captured Yet</h5>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  High-resolution aerial orthomosaics will be automatically processed once the drone aerial patrol flight is executed.
                </p>
              </div>
            ) : (
              <>
                <div className="text-xs font-semibold text-slate-700">
                  High-Resolution Orthomosaic Aerial Scans (2 Views):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Photo 1: Top Orthogonal View */}
                  <div className="relative group rounded-lg overflow-hidden border border-slate-300 bg-slate-900 aspect-[4/3]">
                    <img
                      src={orthophotos.topDown}
                      alt="Top Down Aerial"
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      TOP-DOWN AERIAL SCAN
                    </div>
                    <button
                      onClick={() => setZoomPhotoUrl(orthophotos.topDown)}
                      className="absolute bottom-2 right-2 p-1.5 bg-black/75 hover:bg-black text-white rounded text-xs transition cursor-pointer"
                      title="Expand Photo"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Photo 2: 3D Oblique Photogrammetry */}
                  <div className="relative group rounded-lg overflow-hidden border border-slate-300 bg-slate-900 aspect-[4/3]">
                    <img
                      src={orthophotos.oblique}
                      alt="3D Oblique Surface Distress"
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 bg-blue-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                      OBLIQUE 45° SURFACE POTHOLE
                    </div>
                    <button
                      onClick={() => setZoomPhotoUrl(orthophotos.oblique)}
                      className="absolute bottom-2 right-2 p-1.5 bg-black/75 hover:bg-black text-white rounded text-xs transition cursor-pointer"
                      title="Expand Photo"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-blue-50/60 rounded border border-blue-200 text-xs text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
                    <span>Laser Photogrammetry Analysis</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-normal">
                    {orthophotos.description}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* 3. POTHOLE DEFECT INVENTORY */}
        {activeMediaTab === 'potholes' && (
          <div className="space-y-2.5">
            {isPendingDrone ? (
              <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-2">
                <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto" />
                <h5 className="text-xs font-bold text-slate-700">0 Verified Potholes</h5>
                <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                  No surface defects detected on {survey.roadCode}. Corridor is awaiting initial drone aerial patrol.
                </p>
              </div>
            ) : (
              <>
                <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Specific Potholes on {survey.roadCode}:</span>
                  <span className="text-[11px] font-mono text-red-600 font-bold">{potholesList.length} Critical Potholes</span>
                </div>

                {potholesList.map((p) => {
                  const isSelected = selectedPotholeId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectPothole && onSelectPothole(p.id)}
                      className={`p-2.5 rounded-lg border transition cursor-pointer flex gap-3 ${
                        isSelected
                          ? 'bg-red-50/80 border-[#ea4335] ring-2 ring-red-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {/* Photo Thumbnail */}
                      <div className="relative w-20 h-16 rounded overflow-hidden flex-shrink-0 bg-slate-900">
                        <img
                          src={p.photoUrl}
                          alt={p.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_pothole.jpg';
                          }}
                        />
                        <span className="absolute top-1 left-1 bg-red-600 text-white text-[8px] font-mono font-bold px-1 rounded">
                          #{p.potholeNumber}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="flex-1 text-xs space-y-0.5">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-slate-900">{p.title}</h5>
                          <span className="font-mono text-red-600 font-extrabold text-[11px]">{p.depthMm}mm</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {p.chainage} • {p.lat.toFixed(4)}°N, {p.lng.toFixed(4)}°E
                        </div>
                        <div className="text-[10px] text-slate-600 flex items-center gap-2">
                          <span>Dim: {p.dimensions}</span>
                          <span>•</span>
                          <span>Vol: {((p.volumeLiters || 9.3) / 1000).toFixed(4)} m³</span>
                          <span>•</span>
                          <span className="text-emerald-700 font-semibold">{p.confidence}% Precision</span>
                        </div>
                        <div className="text-[10px] text-red-700 font-medium truncate">{p.layerDamage}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
        {/* Tier-Specific Primary Route Button */}
        {isPendingDrone ? (
          <button
            onClick={handleDispatchDroneFlight}
            className="w-full py-2 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <Navigation className="w-4 h-4" />
            <span>Dispatch Drone Aerial Patrol</span>
          </button>
        ) : (
          <button
            onClick={() => navigate(`/survey?roadCode=${survey.roadCode}`)}
            className="w-full py-2 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center justify-center gap-2 active:scale-98"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>View in Drone Survey Report (Corridor Details & Video)</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Secondary Action Grid: NSV Details & DPR */}
        <div className="grid grid-cols-2 gap-2">
          {/* Left Secondary Button: NSV Upload / View */}
          {isPendingDrone ? (
            <button
              disabled
              className="py-1.5 px-2 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed opacity-75"
              title="Cannot perform NSV survey until drone aerial reconnaissance is complete"
            >
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>NSV Unavailable (No Drone)</span>
            </button>
          ) : !isNsvUploaded ? (
            <button
              onClick={() => setShowUploadNsvModal(true)}
              className="py-1.5 px-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
              title="Upload certified NSV report PDF to extract road telemetry"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload NSV Report</span>
            </button>
          ) : (
            <button
              onClick={() => navigate(`/nsv/${survey.roadCode}`)}
              className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-[#1a73e8] border border-blue-200 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs group active:scale-98"
              title="View extracted NSV report parameters and sensor analytics"
            >
              <Eye className="w-3.5 h-3.5 text-blue-600 group-hover:scale-110 transition" />
              <span>View NSV Details →</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" title="NSV Data Extracted"></span>
            </button>
          )}

          {/* Right Secondary Button: DPR (Strictly Locked until NSV is Uploaded) */}
          {isPendingDrone ? (
            <button
              disabled
              className="py-1.5 px-2 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed opacity-75"
              title="DPR formulation requires initial drone survey and NSV survey"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>DPR Blocked (No Drone)</span>
            </button>
          ) : !isNsvUploaded ? (
            <button
              disabled
              className="py-1.5 px-2 bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-not-allowed opacity-60"
              title="DPR formulation requires certified NSV survey data"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>DPR Locked (NSV Required)</span>
            </button>
          ) : (
            <button
              onClick={() => navigate(`/dpr/${survey.roadCode}`)}
              className="py-1.5 px-2 bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 shadow-xs active:scale-98"
              title="Generate MoRTH Detailed Project Report & Release Tender"
            >
              <FileText className="w-3.5 h-3.5 text-red-600" />
              <span>Generate DPR &amp; Tender</span>
            </button>
          )}
        </div>
      </div>

      {/* Unified Single-Point Upload NSV Report Modal */}
      <UploadNsvReportModal
        isOpen={showUploadNsvModal}
        onClose={() => setShowUploadNsvModal(false)}
        roadCode={survey.roadCode}
        roadName={survey.roadName}
        onUploadSuccess={(filename) => {
          setIsNsvUploaded(true);
          setUploadedPdfName(filename);
          setExtractionComplete(true);
        }}
      />
    </div>
  );
};
