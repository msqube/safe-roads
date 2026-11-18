import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { FormPageHeader } from '../../common/FormPageHeader';
import { ScoreMeter } from '../../common/ScoreMeter';
import { StatusBadge } from '../../common/StatusBadge';
import { GenericButton } from '../../common/GenericButton';
import { SnapTakingMap } from '../../common/SnapTakingMap';
import { PotholeInspectionViewer } from '../../common/PotholeInspectionViewer';
import { ParameterCards } from './components/ParameterCards';
import { OfficialNsvReportView } from './components/OfficialNsvReportView';
import { CivilEngineeringLaneView } from './components/CivilEngineeringLaneView';
import { NsvReportHighlightsCard } from './components/NsvReportHighlightsCard';
import { NsvEquipmentView } from './components/NsvEquipmentView';
import { RoadConditionView } from './components/RoadConditionView';
import { RoadRoughnessView } from './components/RoadRoughnessView';
import { RuttingDataView } from './components/RuttingDataView';
import { AssignRepairModal } from '../DroneSurvey/AssignRepairModal';
import { NSVRoadDetails, RoadSnapPoint } from '../../models/nsvModels';
import { DroneSurveyRecord, RepairPriority } from '../../models/surveyModels';
import { surveyService } from '../../services/surveyService';
import { UploadNsvReportModal } from '../../common/UploadNsvReportModal';
import { WorkflowPipelineTrail } from '../../common/WorkflowPipelineTrail';
import {
  ArrowLeft,
  Printer,
  CheckCircle,
  Eye,
  ListFilter,
  FileText,
  Building2,
  Calendar,
  MapPin,
  Upload,
  FileUp,
  Sparkles,
  CheckCircle2,
  X,
  FileCheck,
  ArrowRight,
  AlertTriangle,
  Lock,
  Clock,
  Layers,
  Cpu,
  Activity,
  TrendingDown,
} from 'lucide-react';

export const NSVDetailsPage: React.FC = () => {
  const { roadCode = 'MAR-1111' } = useParams<{ roadCode: string }>();
  const navigate = useNavigate();

  const [details, setDetails] = useState<NSVRoadDetails | null>(null);
  const [surveyRecord, setSurveyRecord] = useState<DroneSurveyRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // NSV Report Upload & PDF Modal State
  const [isNsvUploaded, setIsNsvUploaded] = useState<boolean>(() => {
    return localStorage.getItem(`nsv_uploaded_${roadCode}`) === 'true';
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showPavementModal, setShowPavementModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessBanner, setUploadSuccessBanner] = useState<string | null>(null);

  // Transient simulation loader when arriving just after NSV parsing
  const [isAnalyzingParsedNsv, setIsAnalyzingParsedNsv] = useState<boolean>(() => {
    return sessionStorage.getItem('just_extracted_nsv') === 'true';
  });

  useEffect(() => {
    if (isAnalyzingParsedNsv) {
      sessionStorage.removeItem('just_extracted_nsv');
      const timer = setTimeout(() => {
        setIsAnalyzingParsedNsv(false);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [isAnalyzingParsedNsv]);

  // Tabs representing the official NSV Report sections (Drone Snap Map & Gallery as Tab 1 by default as requested)
  const [activeTab, setActiveTab] = useState<
    'visuals' | 'parameters' | 'equipment' | 'condition' | 'roughness' | 'rutting'
  >('visuals');
  const [highlightedDefect, setHighlightedDefect] = useState<'cracking' | 'potholes' | null>(null);

  // Section 2 Defect Selection & Highlight Navigation State
  const [selectedDefectId, setSelectedDefectId] = useState<string>('DEF-01');
  const [isSection2Highlighted, setIsSection2Highlighted] = useState<boolean>(false);

  const isMar1111 = roadCode === 'MAR-1111' || roadCode.includes('1111');

  // Dynamic DPR Generation 3-Step Animated Modal State
  const [isGeneratingDpr, setIsGeneratingDpr] = useState<boolean>(false);
  const [dprGenStep, setDprGenStep] = useState<number>(1);

  const handleStartGenerateDpr = () => {
    setIsGeneratingDpr(true);
    setDprGenStep(1);
    setTimeout(() => setDprGenStep(2), 550);
    setTimeout(() => setDprGenStep(3), 1100);
    setTimeout(() => {
      setIsGeneratingDpr(false);
      localStorage.setItem(`nsv_uploaded_${details?.roadCode || roadCode}`, 'true');
      localStorage.setItem(`dpr_approved_${details?.roadCode || roadCode}`, 'true');
      localStorage.setItem(`dpr_status_${details?.roadCode || roadCode}`, 'approved');
      sessionStorage.setItem('dpr_just_generated', 'true');
      showToast(`Detailed Project Report (DPR) successfully formulated and certified for ${details?.roadCode || roadCode}!`);
      setTimeout(() => {
        navigate(`/dpr/${details?.roadCode || roadCode}`);
      }, 700);
    }, 1650);
  };

  const handleNavigateToSection2 = (snap: RoadSnapPoint) => {
    const targetDefect = details?.potholeInspections.find(
      (d, idx) => d.potholeId === `PH-0${snap.snapNumber}` || idx === snap.snapNumber - 1
    );
    if (targetDefect) {
      setSelectedDefectId(targetDefect.id);
    } else {
      setSelectedDefectId(`DEF-0${snap.snapNumber}`);
    }

    setIsSection2Highlighted(true);
    setTimeout(() => setIsSection2Highlighted(false), 3000);

    setTimeout(() => {
      const section2Element = document.getElementById('section-2-pothole-gallery');
      if (section2Element) {
        section2Element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 60);
  };

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const handleNsvUploaded = (e: any) => {
      if (e.detail?.roadCode === roadCode) {
        setIsNsvUploaded(true);
        setUploadSuccessBanner(
          `Certified NSV Survey Report for ${roadCode} successfully verified and ingested.`
        );
      }
    };
    window.addEventListener('nsv-uploaded', handleNsvUploaded);
    return () => window.removeEventListener('nsv-uploaded', handleNsvUploaded);
  }, [roadCode]);

  useEffect(() => {
    const fetchNSV = async () => {
      setIsLoading(true);
      try {
        const [nsvData, record] = await Promise.all([
          surveyService.getNSVDetails(roadCode),
          surveyService.getSurveyByRoadCode(roadCode),
        ]);
        setDetails(nsvData);
        if (record) {
          setSurveyRecord(record);
        }
      } catch (err) {
        console.error('Error fetching NSV details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNSV();
  }, [roadCode]);

  const handleProcessNsvUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      localStorage.setItem(`nsv_uploaded_${roadCode}`, 'true');
      setIsNsvUploaded(true);
      if (details) {
        setDetails({
          ...details,
          roadName: 'NKDA Road MAR 1111',
          section: 'Chainage 0+000 to 0+120 (120m Resurfacing Segment)',
          surveyDate: '16 Nov 2026, 11:30 AM IST (Certified NSV Run)',
          nsvVehicleId: 'WB-02-NKDA-7712 (ROMDAS NSV Laser Profilometer Mark-IV)',
          nsvDriver: 'SkyScan Geospatial Technologies / WB PWD Authorized Vendor',
          dronePilot: 'Er. Rahul Baruah (DGCA Certified Telemetry Pilot #WB-482)',
          gpsStart: { lat: 22.58150, lng: 88.47280 },
          gpsEnd: { lat: 22.58270, lng: 88.47328 },
          lengthKm: 0.12,
          roughness: {
            ...details.roughness,
            iriAverage: 5.20,
            iriLeft: 5.10,
            iriRight: 5.30,
            bumpIntegrator: 4120,
            comfortClass: 'Severe',
          },
          rutDepth: {
            ...details.rutDepth,
            maxRutDepth: 20,
            leftWheelpathRut: 20,
            rightWheelpathRut: 20,
            rutSeverity: 'Critical (>50mm)',
          },
          potholes: {
            totalCount: 4,
            totalVolume: 0.0372,
            averageDepth: 20,
            maxDepth: 20,
            criticalCount: 4,
            moderateCount: 0,
            surfaceDamageDensity: 33.3,
          },
        });
      }
      setIsUploading(false);
      setShowUploadModal(false);
      setActiveTab('parameters');
      setShowPdfModal(true);
      setUploadSuccessBanner(
        `Official 14-Page NSV Survey Report for NKDA Road MAR 1111 successfully ingested. All sections (Executive Summary, 4 Potholes PH-01..PH-04, Segment IRI 5.20 m/km, 120m segment, Annexures 1-3, and Sign-offs) rendered faithfully.`
      );
      showToast('14-Page NSV Report ingested & representation generated!');
    }, 900);
  };

  const handleAssignConfirm = async (
    id: number,
    assignment: { team: string; targetDate: string; priority: RepairPriority; notes?: string }
  ) => {
    try {
      await surveyService.assignRepair(id, assignment);
      showToast(`Repair assigned to ${assignment.team}!`);
    } catch (e) {
      console.error(e);
    }
  };

  // Called when user clicks Cracking or Potholes card from Schematic view
  const handleJumpToDefect = (defectType: 'cracking' | 'potholes') => {
    setHighlightedDefect(defectType);
    setActiveTab('visuals');
    showToast(`Switched to inspection gallery focused on ${defectType.toUpperCase()}!`);
  };

  if (isLoading || !details) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs">Loading NSV Details for {roadCode}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-3 bg-white border border-slate-300 rounded-lg shadow-lg text-xs font-semibold text-slate-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-[#34a853]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modern Workflow Pipeline Trail (Step 2 Active) - Compact Sleek Ribbon */}
      <WorkflowPipelineTrail
        currentStep={2}
        roadCode={details.roadCode}
        roadName={details.roadName}
        compact={true}
      />

      {/* Analyzing Telemetry Transient Banner after PDF Upload */}
      {isAnalyzingParsedNsv && (
        <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl shadow-lg border border-blue-400/30 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
            <div>
              <div className="font-bold text-xs flex items-center gap-2">
                <span>Analyzing Extracted Results from Certified NSV PDF...</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  Telemetry Engine Sync
                </span>
              </div>
              <p className="text-[11px] text-blue-200 mt-0.5">
                Laser Profilometer IRI roughness curve (5.20 m/km), 20mm rutting depth, and 4 verified pothole voids extracted into Section 1 &amp; Section 2 tables.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 font-bold hidden sm:inline whitespace-nowrap">
            100% Parsed
          </span>
        </div>
      )}

      {/* Equal-Padding Header Bar with Title & Corridor Subtitle & Actions */}
      <div className="w-full bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
        {/* Left Side: Line 1 (Survey Report > NSV > NSV Details: CODE [Badge]), Line 2 (Road Name & Section) */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline whitespace-nowrap">
              Survey Report &rsaquo; NSV &rsaquo;
            </span>
            <h1 className="text-sm font-extrabold text-slate-900 tracking-tight whitespace-nowrap">
              NSV Details: <span className="font-mono text-blue-600">{details.roadCode}</span>
            </h1>

            {isNsvUploaded ? (
              <StatusBadge condition={details.conditionStatus} size="sm" />
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-2xs whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>NSV Report Pending</span>
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 font-medium">
            <strong className="text-slate-700">{details.roadName}</strong>{' '}
            <span className="text-slate-400 font-mono">({details.section})</span>
          </p>
        </div>

        {/* Right Side: Back Button & Actions neatly in a single horizontal row */}
        <div className="flex items-center gap-1.5 flex-wrap self-start sm:self-center sm:ml-auto">
          <button
            onClick={() => navigate('/')}
            className="h-7 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 transition cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Back to GIS Dashboard"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
            <span>Back</span>
          </button>

          {!isNsvUploaded ? (
            <button
              onClick={() => setShowUploadModal(true)}
              className="h-7 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap active:scale-98"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload NSV Report</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowUploadModal(true)}
                className="h-7 px-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Upload or replace certified report"
              >
                <Upload className="w-3.5 h-3.5 text-[#1a73e8]" />
                <span className="hidden sm:inline">Upload / Replace Report</span>
                <span className="sm:hidden">Replace</span>
              </button>

              {details.hasNsvSurvey && (
                <button
                  onClick={() => setShowPdfModal(true)}
                  className="h-7 px-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg border border-slate-300 transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  title="View official certified 14-page report"
                >
                  <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden md:inline">Official Report (14 Pages)</span>
                  <span className="md:hidden">Report (14p)</span>
                </button>
              )}

              <button
                onClick={handleStartGenerateDpr}
                className="h-7 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold text-xs rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap active:scale-98"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Generate DPR &amp; Release Tender</span>
              </button>

              <button
                onClick={() => window.print()}
                className="h-7 w-7 flex items-center justify-center bg-white hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-lg border border-slate-300 transition cursor-pointer shadow-2xs"
                title="Print report"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem(`nsv_uploaded_${details.roadCode}`);
                  localStorage.removeItem(`nsv_estimation_generated_${details.roadCode}`);
                  localStorage.removeItem(`dpr_approved_${details.roadCode}`);
                  localStorage.removeItem(`dpr_status_${details.roadCode}`);
                  setIsNsvUploaded(false);
                  showToast('Reset to pending NSV report upload state.');
                }}
                className="h-7 px-2 text-[11px] text-slate-400 hover:text-red-600 transition cursor-pointer underline flex items-center"
                title="Test the upload gate again"
              >
                Reset Gate
              </button>
            </>
          )}
        </div>
      </div>

      {/* NSV Ingestion Success Banner - Equal Padding p-3.5 */}
      {uploadSuccessBanner && (
        <div className="w-full bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 shadow-2xs text-xs text-emerald-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden min-w-0">
            <CheckCircle2 className="w-4 h-4 text-[#34a853] flex-shrink-0" />
            <span className="font-semibold truncate">{uploadSuccessBanner}</span>
          </div>
          <button
            onClick={() => setUploadSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Unified Single-Point Upload NSV Report Modal */}
      <UploadNsvReportModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        roadCode={details.roadCode}
        roadName={details.roadName}
        onUploadSuccess={() => {
          setIsNsvUploaded(true);
          setShowUploadModal(false);
          setUploadSuccessBanner(
            `Certified NSV Survey Report for ${details.roadCode} successfully verified and ingested.`
          );
        }}
      />

      {/* Horizontally Straight Full-Width Navigation Tabs Toolbar - Equal Padding p-2.5 */}
      <div className="w-full bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs flex items-center gap-1.5 font-sans overflow-x-auto no-scrollbar">
        {/* TAB 1: DRONE SNAP MAP & GALLERY (FIRST TAB AS REQUESTED) */}
        <button
          onClick={() => setActiveTab('visuals')}
          className={`flex-1 min-w-fit px-3 h-7.5 text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'visuals'
              ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          <Eye className={`w-3.5 h-3.5 ${activeTab === 'visuals' ? 'text-white' : 'text-blue-600'}`} />
          <span>Drone Photogrammetry</span>
          {highlightedDefect && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-700 font-semibold">
              Focus
            </span>
          )}
        </button>

        {/* TAB 2: ROAD PARAMETERS & SCHEMATIC */}
        <button
          onClick={() => setActiveTab('parameters')}
          className={`flex-1 min-w-fit px-3 h-7.5 text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'parameters'
              ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Road Parameters</span>
          <span
            className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'parameters'
                ? 'bg-white/20 text-white'
                : isNsvUploaded
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isNsvUploaded ? '₹28.20L' : 'Pending'}
          </span>
        </button>

        {/* TAB 3: NSV EQUIPMENT & SENSORS */}
        <button
          onClick={() => setActiveTab('equipment')}
          className={`flex-1 min-w-fit px-3 h-7.5 text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'equipment'
              ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          <Cpu className={`w-3.5 h-3.5 ${activeTab === 'equipment' ? 'text-white' : 'text-blue-600'}`} />
          <span>NSV Sensors</span>
          {!isNsvUploaded && (
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-medium ${
                activeTab === 'equipment' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              Locked
            </span>
          )}
        </button>

        {/* TAB 4: PAVEMENT DISTRESS & POTHOLES */}
        <button
          onClick={() => setActiveTab('condition')}
          className={`flex-1 min-w-fit px-3 h-7.5 text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'condition'
              ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          <AlertTriangle className={`w-3.5 h-3.5 ${activeTab === 'condition' ? 'text-white' : 'text-red-600'}`} />
          <span>Distress &amp; Potholes</span>
          <span
            className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'condition' ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
            }`}
          >
            4 Nos.
          </span>
        </button>

        {/* TAB 5: ROUGHNESS & IRI ANALYTICS */}
        <button
          onClick={() => setActiveTab('roughness')}
          className={`flex-1 min-w-fit px-3 h-7.5 text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'roughness'
              ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          <Activity className={`w-3.5 h-3.5 ${activeTab === 'roughness' ? 'text-white' : 'text-[#ea4335]'}`} />
          <span>Roughness (IRI)</span>
          <span
            className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
              activeTab === 'roughness'
                ? 'bg-white/20 text-white'
                : isNsvUploaded
                ? 'bg-red-100 text-red-700'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isNsvUploaded ? '5.20' : 'Pending'}
          </span>
        </button>

        {/* TAB 6: RUTTING DATA & FIELD SHEET */}
        <button
          onClick={() => setActiveTab('rutting')}
          className={`flex-1 min-w-fit px-3 h-7.5 text-xs rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
            activeTab === 'rutting'
              ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium'
          }`}
        >
          <TrendingDown className={`w-3.5 h-3.5 ${activeTab === 'rutting' ? 'text-white' : 'text-amber-600'}`} />
          <span>Rutting Data</span>
          <span
            className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono ${
              activeTab === 'rutting'
                ? 'bg-white/20 text-white'
                : isNsvUploaded
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {isNsvUploaded ? '20mm' : 'Pending'}
          </span>
        </button>
      </div>

      {/* LOCKED STATE GATE FOR NSV-DEPENDENT TABS WHEN NSV IS PENDING */}
      {activeTab !== 'visuals' && !isNsvUploaded ? (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-8 text-center space-y-4 max-w-lg mx-auto my-8 font-sans animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-2xs">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Certified NSV Report Pending for {details.roadCode}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Network Survey Vehicle (NSV) survey has not yet been processed for <strong>{details.roadName}</strong>. Laser profilometer roughness (IRI), transverse rut depth, and PWD SoR cost formulation will be unlocked once the certified NSV report is uploaded.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Certified NSV Report</span>
            </button>
            <button
              onClick={() => setActiveTab('visuals')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 cursor-pointer active:scale-98"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Drone Aerial Survey</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* TAB 1 CONTENT: DRONE SNAP MAP TOPMOST & LANE NUMBERED POTHOLES */}
          {activeTab === 'visuals' && (
            <div className="space-y-6">
              {/* Executive At-a-Glance Telemetry Strip (Kept inside Drone Snap Map & Gallery when NSV is uploaded) */}
              {isNsvUploaded ? (
                <div className="p-3.5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl shadow-md border border-slate-700/60 font-sans space-y-3 animate-in fade-in">
                  {/* Metric Strip: 6 Primary Telemetry KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
                      <span className="text-[9px] text-blue-200 block uppercase font-mono">Condition / Score</span>
                      <div className="text-xs font-bold text-red-400 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span>24 / 100</span>
                      </div>
                      <span className="text-[10px] text-slate-300">Critical Priority</span>
                    </div>

                    <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
                      <span className="text-[9px] text-blue-200 block uppercase font-mono">Roughness (IRI)</span>
                      <div className="text-xs font-bold text-red-400 font-mono mt-0.5">5.20 m/km</div>
                      <span className="text-[10px] text-slate-300">IRC:SP:16 Limit: 4.0</span>
                    </div>

                    <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
                      <span className="text-[9px] text-blue-200 block uppercase font-mono">Laser Rut Depth</span>
                      <div className="text-xs font-bold text-amber-300 font-mono mt-0.5">20 mm</div>
                      <span className="text-[10px] text-slate-300">Lane 1 Wheelpath</span>
                    </div>

                    <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
                      <span className="text-[9px] text-blue-200 block uppercase font-mono">Verified Potholes</span>
                      <div className="text-xs font-bold text-red-400 font-mono mt-0.5">4 Nos.</div>
                      <span className="text-[10px] text-slate-300">1.86 m² • 0.037 m³</span>
                    </div>

                    <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
                      <span className="text-[9px] text-blue-200 block uppercase font-mono">Resurfacing Scope</span>
                      <div className="text-xs font-bold text-cyan-300 font-mono mt-0.5">120 Meters</div>
                      <span className="text-[10px] text-slate-300">Ch: 0+000 to 0+120</span>
                    </div>

                    <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
                      <span className="text-[9px] text-blue-200 block uppercase font-mono">Estimated Repair Cost</span>
                      <div className="text-xs font-bold text-emerald-400 font-mono mt-0.5">₹28.20 Lakh</div>
                      <span className="text-[10px] text-slate-300">MoRTH Schedule of Rates</span>
                    </div>
                  </div>

                  {/* Sub-Strip: Corridor Coordinates & Authority Meta */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-[10px] text-blue-200">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-blue-400" />
                        <strong className="text-white">Authority:</strong> NKDA / WB HIDCO
                      </span>
                      <span className="text-white/20">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" />
                        <strong className="text-white">GPS:</strong> {(isMar1111 ? 22.5821 : details.gpsStart.lat).toFixed(4)}°N, {(isMar1111 ? 88.4731 : details.gpsStart.lng).toFixed(4)}°E
                      </span>
                      <span className="text-white/20">•</span>
                      <span>
                        <strong className="text-white">Length:</strong> {details.lengthKm} km ({details.lanesCount} Lanes)
                      </span>
                      <span className="text-white/20">•</span>
                      <span>
                        <strong className="text-white">Vendor:</strong> {details.nsvDriver || 'SkyScan Geospatial Infrastructure'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setShowPavementModal(true)}
                        className="px-2 py-0.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded text-[10px] font-bold transition cursor-pointer flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3 text-cyan-300" />
                        <span>View Flexible Pavement Materials (4 Layers)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-3.5 shadow-2xs text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900">
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                    <span className="font-semibold whitespace-nowrap">Drone Photogrammetry Active</span>
                    <span className="text-amber-400 hidden sm:inline">•</span>
                    <span className="text-amber-800 truncate text-[11px] hidden sm:inline">
                      Certified Network Survey Vehicle (NSV) telemetry is currently pending. Upload NSV report PDF to extract Laser Profilometer IRI &amp; rutting data.
                    </span>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="h-7 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-lg transition text-xs flex items-center gap-1.5 cursor-pointer flex-shrink-0 shadow-xs active:scale-98"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload NSV</span>
                  </button>
                </div>
              )}

              {/* 1. Snap-Taking Flight Map & Waypoints (Section 1) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    1. Drone Snap-Taking Flight Map &amp; Waypoints
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Corridor: {details.roadCode} ({details.section})
                  </span>
                </div>
                <SnapTakingMap
                  roadCode={details.roadCode}
                  roadName={details.roadName}
                  centerGps={details.gpsStart}
                  snapPoints={details.snapPoints}
                  onNavigateToSection2={handleNavigateToSection2}
                />
              </div>

              {/* 2. Lane Numbered Potholes & Defect Inspection Gallery (Section 2 directly after Section 1) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    2. Lane Numbered Potholes &amp; Inspection Gallery
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    {details.potholeInspections.length} Verified Potholes • 20mm Max Depth
                  </span>
                </div>
                <PotholeInspectionViewer
                  defects={details.potholeInspections}
                  onAssignRepair={() => setShowAssignModal(true)}
                  selectedDefectId={selectedDefectId}
                  onSelectDefect={setSelectedDefectId}
                  isHighlighted={isSection2Highlighted}
                />
              </div>
            </div>
          )}

          {/* TAB 2 CONTENT: ROAD PARAMETERS, CIVIL LANE SCHEMATIC & EXTRACTED REPORT HIGHLIGHTS */}
          {activeTab === 'parameters' && (
            <div className="space-y-6">
              {/* Civil Engineering 120m Lane Schematic & Official DPR Formula Breakdown */}
              {details.hasNsvSurvey && (
                <CivilEngineeringLaneView
                  details={details}
                  surveyRecord={surveyRecord || undefined}
                  onProceedToDpr={handleStartGenerateDpr}
                  onJumpTo360={() => setActiveTab('visuals')}
                />
              )}

              {/* Official NSV Report Highlights Card: Extracted statutory data from certified 14-page PDF report */}
              <NsvReportHighlightsCard
                details={details}
                onOpenFullReport={() => setShowPdfModal(true)}
                onProceedToDpr={handleStartGenerateDpr}
              />

              {/* Detailed NSV Laser Profilometer Analytics (Original Parameter Cards) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">
                    NSV Laser Profilometer Details &amp; Surface Distress Analytics
                  </h3>
                  <span className="text-xs text-slate-500">
                    Click on Cracking or Pothole cards to inspect in high-resolution defect gallery
                  </span>
                </div>
                <ParameterCards details={details} onJumpToDefect={handleJumpToDefect} />
              </div>
            </div>
          )}

          {/* TAB 3 CONTENT: NSV EQUIPMENT & METHODOLOGY (PAGE 6 OF REPORT) */}
          {activeTab === 'equipment' && (
            <div className="space-y-6">
              <NsvEquipmentView details={details} />
            </div>
          )}

          {/* TAB 4 CONTENT: ROAD CONDITION DATA & POTHOLE ASSESSMENT (PAGE 7 OF REPORT) */}
          {activeTab === 'condition' && (
            <div className="space-y-6">
              <RoadConditionView details={details} />
            </div>
          )}

          {/* TAB 5 CONTENT: ROAD ROUGHNESS DATA & IRI ASSESSMENT (PAGE 8 OF REPORT) */}
          {activeTab === 'roughness' && (
            <div className="space-y-6">
              <RoadRoughnessView details={details} />
            </div>
          )}

          {/* TAB 6 CONTENT: RUTTING DATA, INVENTORY & FIELD CHECKLIST (PAGE 9 & ANNEXURE 3) */}
          {activeTab === 'rutting' && (
            <div className="space-y-6">
              <RuttingDataView details={details} />
            </div>
          )}
        </>
      )}

      {/* Assign Repair Modal */}
      {surveyRecord && (
        <AssignRepairModal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          surveyRecord={surveyRecord}
          onAssignConfirm={handleAssignConfirm}
        />
      )}

      {/* 14-PAGE OFFICIAL NSV PDF REPORT MODAL */}
      {showPdfModal &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in" style={{ isolation: 'isolate' }}>
            <div className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-300 my-8 flex flex-col max-h-[90vh]">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-400" />
                  <div>
                    <span className="font-bold text-sm block">
                      Certified Network Survey Vehicle (NSV) Report • {details.roadName} ({details.roadCode})
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Official 14-Page Statutory Document • West Bengal PWD &amp; NKDA Format
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report</span>
                  </button>
                  <button
                    onClick={() => setShowPdfModal(false)}
                    className="p-1.5 hover:bg-slate-800 rounded transition cursor-pointer text-slate-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 md:p-6 overflow-y-auto flex-1 bg-slate-100">
                <OfficialNsvReportView details={details} />
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* FLEXIBLE PAVEMENT MATERIALS MODAL */}
      {showPavementModal &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-300 shadow-2xl overflow-hidden font-sans">
              <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-300" />
                  <div>
                    <h3 className="font-bold text-sm">
                      Materials Used to Build Road (Flexible Bituminous Pavement)
                    </h3>
                    <p className="text-[11px] text-blue-200">
                      Corridor: {details.roadCode} ({details.roadName}) • MoRTH Section 500 / IRC:37
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPavementModal(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-3 text-xs">
                <p className="text-slate-600 text-xs">
                  Certified pavement cross-section composition specified under West Bengal PWD Road Schedule and MoRTH Specifications for Road &amp; Bridge Works:
                </p>

                <div className="space-y-2.5">
                  <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-red-900 text-xs uppercase">
                        1. Wearing Course / Surfacing (40mm)
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 text-red-800 font-bold">
                        Top Layer
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900">Bituminous Concrete (BC Grade-1)</div>
                    <p className="text-[11px] text-slate-600">
                      Laid with PMB-40 Polymer Modified Bitumen for high shear resistance under heavy bus axle traffic along Biswa Bangla Sarani outer wheelpaths.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-amber-900 text-xs uppercase">
                        2. Binder Course (50mm)
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        Structural Binder
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900">Dense Bituminous Macadam (DBM-II)</div>
                    <p className="text-[11px] text-slate-600">
                      Formulated with VG-30/VG-40 penetration grade bitumen for heavy axle load distribution across wheelpaths.
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-blue-900 text-xs uppercase">
                        3. Base Course (250mm)
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold">
                        Load Distribution
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900">Wet Mix Macadam (WMM Base)</div>
                    <p className="text-[11px] text-slate-600">
                      Mechanically crushed graded aggregate compacted at Optimum Moisture Content (OMC) to achieve 98% relative compaction.
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-emerald-900 text-xs uppercase">
                        4. Sub-Base &amp; Tack Coat (200mm)
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        Subgrade Cushion
                      </span>
                    </div>
                    <div className="font-semibold text-slate-900">Granular Sub-Base (GSB Grade-I) + RS-1 Tack Coat</div>
                    <p className="text-[11px] text-slate-600">
                      Interlayer drainage over prepared subgrade (CBR &gt; 8%); Rapid Setting RS-1 bitumen emulsion tack coat @ 0.25 kg/m².
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPavementModal(false)}
                  className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Dynamic DPR Generation 3-Step Animated Modal (Light Theme) */}
      {isGeneratingDpr &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
            <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs">
                    <FileText className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Generating Detailed Project Report (DPR)
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Corridor: {details.roadCode} ({details.roadName})
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                  Step {dprGenStep} of 3
                </span>
              </div>

              {/* Step indicator description */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-900">
                    {dprGenStep === 1 && 'Synthesizing NSV Survey Telemetry & Distress Inventory...'}
                    {dprGenStep === 2 && 'Formulating Statutory BoQ & Schedule of Rates (₹28.20 Lakhs)...'}
                    {dprGenStep === 3 && 'Assembling Official DPR Document with Technical Sanction Seals...'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                  {dprGenStep === 1 &&
                    'Extracting Laser Profilometer IRI curve (5.20 m/km), 20mm rutting depth, and 4 verified pothole locations (1.86 m² void) from New Town Action Area I.'}
                  {dprGenStep === 2 &&
                    'Formulating statutory items: Part 1 Localized Repairs (₹3,72,000) and Part 2 Resurfacing with Bituminous Concrete (₹24,48,000) under WB PWD SoR 2022-2025.'}
                  {dprGenStep === 3 &&
                    'Generating MoRTH-compliant Detailed Project Report with Executive Engineer digital stamps, technical sanctions, and 15-day tender timeline.'}
                </p>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>Formulation Progress</span>
                  <span className="text-blue-600 font-bold">
                    {dprGenStep === 1 ? '33%' : dprGenStep === 2 ? '66%' : '100%'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="bg-[#1a73e8] h-full transition-all duration-500 rounded-full shadow-2xs"
                    style={{ width: `${(dprGenStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
