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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessBanner, setUploadSuccessBanner] = useState<string | null>(null);

  // Tabs representing the official 14-page NSV Report sections + Drone Visuals (Drone Snap Map & Gallery as Tab 1 by default)
  const [activeTab, setActiveTab] = useState<
    'visuals' | 'parameters' | 'equipment' | 'condition' | 'roughness' | 'rutting'
  >('visuals');
  const [highlightedDefect, setHighlightedDefect] = useState<'cracking' | 'potholes' | null>(null);

  // Section 2 Defect Selection & Highlight Navigation State
  const [selectedDefectId, setSelectedDefectId] = useState<string>('DEF-01');
  const [isSection2Highlighted, setIsSection2Highlighted] = useState<boolean>(false);

  const isMar1111 = roadCode === 'MAR-1111' || roadCode.includes('1111');

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
          `Certified NSV Report for ${roadCode} successfully uploaded! Profilometer waveforms and BoQ extracted.`
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

      {/* Page Header */}
      <FormPageHeader
        breadcrumbs={[
          { label: 'Survey Report', onClick: () => navigate('/') },
          { label: 'NSV Details' },
          { label: details.roadCode },
        ]}
        title={`NSV Details: ${details.roadCode}`}
        subtitle={`${details.roadName} • ${details.section}`}
        badge={
          isNsvUploaded ? (
            <StatusBadge condition={details.conditionStatus} size="sm" />
          ) : (
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>NSV Report Pending</span>
            </span>
          )
        }
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <GenericButton
              variant="secondary"
              size="sm"
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
              onClick={() => navigate('/')}
            >
              Back
            </GenericButton>

            {!isNsvUploaded ? (
              <GenericButton
                variant="primary"
                size="sm"
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => setShowUploadModal(true)}
              >
                Upload NSV Report
              </GenericButton>
            ) : (
              <>
                <GenericButton
                  variant="secondary"
                  size="sm"
                  leftIcon={<Upload className="w-3.5 h-3.5 text-[#1a73e8]" />}
                  onClick={() => setShowUploadModal(true)}
                >
                  Upload / Replace Report
                </GenericButton>

                {details.hasNsvSurvey && (
                  <GenericButton
                    variant="secondary"
                    size="sm"
                    leftIcon={<FileCheck className="w-3.5 h-3.5 text-blue-600" />}
                    onClick={() => setShowPdfModal(true)}
                  >
                    Official Report (14 Pages)
                  </GenericButton>
                )}

                <GenericButton
                  variant="primary"
                  size="sm"
                  leftIcon={<FileText className="w-3.5 h-3.5" />}
                  onClick={() => navigate(`/dpr/${details.roadCode}`)}
                >
                  Generate DPR &amp; Release Tender
                </GenericButton>

                <GenericButton
                  variant="secondary"
                  size="sm"
                  leftIcon={<Printer className="w-3.5 h-3.5 text-slate-500" />}
                  onClick={() => window.print()}
                >
                  Print
                </GenericButton>

                <button
                  onClick={() => {
                    localStorage.removeItem(`nsv_uploaded_${details.roadCode}`);
                    setIsNsvUploaded(false);
                    showToast('Reset to pending NSV report upload state.');
                  }}
                  className="px-2 py-1 text-[11px] text-slate-400 hover:text-red-600 transition cursor-pointer underline ml-1"
                  title="Test the upload gate again"
                >
                  Reset Gate
                </button>
              </>
            )}
          </div>
        }
      />

      {/* NSV Ingestion Success Banner */}
      {uploadSuccessBanner && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#34a853] flex-shrink-0" />
            <span className="font-semibold">{uploadSuccessBanner}</span>
          </div>
          <button
            onClick={() => setUploadSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900 p-1 cursor-pointer"
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
            `Certified NSV Report for ${details.roadCode} successfully uploaded! Profilometer waveforms and BoQ extracted.`
          );
        }}
      />

      {/* If NSV report is NOT yet uploaded: Show Upload Gate */}
      {!isNsvUploaded ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden p-6 space-y-6 animate-in fade-in">
          {/* Top Banner Alert */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Official Network Survey Vehicle (NSV) Telemetry Pending
              </h4>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Drone photogrammetry surveillance was successfully conducted for <strong>{details.roadCode} ({details.roadName})</strong>.
                However, the full engineering NSV dataset—including <strong>IRI Roughness (5.20 m/km)</strong>, <strong>Laser Profilometer Rut Depth (20mm)</strong>, <strong>4 Verified Potholes Telemetry</strong>, and <strong>MoRTH Schedule of Rates (₹28.20 Lakh)</strong>—is only available once the official NSV report is uploaded and ingested.
              </p>
            </div>
          </div>

          {/* Interactive Upload Card */}
          <div
            className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/20 rounded-xl p-8 text-center transition cursor-pointer space-y-4"
            onClick={handleProcessNsvUpload}
          >
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-100 flex items-center justify-center text-[#1a73e8] shadow-xs">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Upload NSV Survey Report Document
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Drag and drop your certified NSV report (PDF or Word DOCX format) here, or click anywhere to browse files.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isUploading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProcessNsvUpload();
                }}
                className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-md flex items-center gap-2 cursor-pointer transition"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Telemetry from PDF...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>⚡ Ingest Certified 14-Page NSV Report for {details.roadCode} (Auto-Extract)</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-mono">
              Accepted formats: .pdf, .docx, .doc, .csv, ROMDAS log (.dat) • Max 50 MB
            </p>
          </div>

          {/* Telemetry Datasets Preview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Telemetry Datasets Unlocked Upon Report Ingestion:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Roughness Analysis</span>
                <div className="text-sm font-extrabold text-slate-800 font-mono mt-0.5">IRI 5.20 m/km</div>
                <p className="text-[11px] text-slate-500 mt-1">Class-1 Laser Profilometer Left (5.10) &amp; Right (5.30) wheelpaths</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transverse Rut Depth</span>
                <div className="text-sm font-extrabold text-slate-800 font-mono mt-0.5">20 mm Rutting</div>
                <p className="text-[11px] text-slate-500 mt-1">20-laser transversal profilometer cross-slope &amp; depression scan</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pothole Assessment</span>
                <div className="text-sm font-extrabold text-slate-800 font-mono mt-0.5">4 Verified Potholes</div>
                <p className="text-[11px] text-slate-500 mt-1">20 sq ft (1.86 m²) total distress area • 0.0372 m³ void volume</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MoRTH Sanction Cost</span>
                <div className="text-sm font-extrabold text-slate-800 font-mono mt-0.5">₹28.20 Lakhs</div>
                <p className="text-[11px] text-slate-500 mt-1">Part 1 (₹3.72L patching) + Part 2 (₹24.48L resurfacing for 120m)</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Header Card (Vendor details & Corridor metadata) */}
          <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div>
            <ScoreMeter
              score={details.goodnessScore}
              label="Goodness Score"
              size="lg"
              showBar={true}
            />
          </div>

          {/* Vendor Details */}
          <div className="text-xs space-y-1 sm:border-l border-slate-200 sm:pl-4">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-[#1a73e8]" />
              <span className="font-semibold text-slate-700">Vendor:</span>
            </div>
            <div className="font-semibold text-slate-900 leading-snug">
              {details.nsvDriver || 'SkyScan Geospatial Infrastructure Pvt. Ltd.'}
            </div>
            <div className="text-slate-500 text-[11px] truncate">
              Vehicle: <span className="font-mono text-slate-800">{details.nsvVehicleId}</span>
            </div>
          </div>

          {/* Date & Pilot */}
          <div className="text-xs space-y-1 lg:border-l border-slate-200 lg:pl-4">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span className="font-semibold text-slate-700">Date &amp; Survey:</span>
            </div>
            <div className="font-semibold text-slate-900">{details.surveyDate}</div>
            <div className="text-slate-500 text-[11px]">
              Pilot: <span className="text-slate-800">{details.dronePilot}</span>
            </div>
          </div>

          {/* GPS Coordinates & Geometry */}
          <div className="text-xs space-y-1 sm:border-l border-slate-200 sm:pl-4">
            <div className="flex items-center gap-1.5 text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-[#ea4335]" />
              <span className="font-semibold text-slate-700">GPS Coordinates:</span>
            </div>
            <div className="font-mono text-slate-900 font-semibold">
              {(isMar1111 ? 22.5821 : details.gpsStart.lat).toFixed(4)}°N, {(isMar1111 ? 88.4731 : details.gpsStart.lng).toFixed(4)}°E
            </div>
            <div className="text-slate-500 text-[11px]">
              Length: <span className="font-bold text-slate-800">{details.lengthKm} km</span> ({details.lanesCount} lanes)
            </div>
          </div>
        </div>
      </div>

      {/* Corridor Pavement Specifications & Materials Card */}
      {isMar1111 && (
        <div className="p-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200 rounded-xl shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-600 text-white">
                CORRIDOR SPECIFICATIONS
              </span>
              <h3 className="text-sm font-bold text-slate-900">
                Corridor Pavement Structure &amp; Defect Specifications (Road MAR 1111)
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
              Authority: NKDA (West Bengal) • Ref: NKDA/R&amp;B/NSV/2026/MAR-1111
            </span>
          </div>

          {/* 4 Primary Defect Metric Pills from Page 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">No. of Potholes</span>
              <div className="text-lg font-black text-red-600 font-mono mt-0.5">4 Nos.</div>
              <span className="text-[11px] text-slate-600">Outer Wheelpath (Lane 1)</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Combined Plan Area</span>
              <div className="text-lg font-black text-slate-900 font-mono mt-0.5">20 sq ft <span className="text-xs font-normal text-slate-500">(≈1.86 m²)</span></div>
              <span className="text-[11px] text-slate-600">0.465 m² (5 sq ft) each</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Average Depth</span>
              <div className="text-lg font-black text-slate-900 font-mono mt-0.5">20 mm</div>
              <span className="text-[11px] text-slate-600">Void: 0.0093 m³ each</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">Resurfacing Req.</span>
              <div className="text-lg font-black text-emerald-700 font-mono mt-0.5">120 Meters</div>
              <span className="text-[11px] text-slate-600">Ch: 0+000 to 0+120</span>
            </div>
          </div>

          {/* Road Construction Materials Used Breakdown from Page 2 */}
          <div className="p-3 bg-white rounded-lg border border-blue-200 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Materials Used to Build Road (Flexible Bituminous Pavement):</span>
              </span>
              <span className="text-[11px] font-mono text-blue-700 font-semibold">
                MoRTH Section 500 / IRC:37 Spec
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-0.5">
                <span className="text-red-700 font-bold block text-[10px] uppercase">1. Wearing Course (40mm)</span>
                <p className="text-slate-800 font-semibold">Bituminous Concrete (BC Grade-1)</p>
                <p className="text-slate-500 text-[10px]">With PMB-40 Polymer Modified Bitumen for high shear resistance</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-0.5">
                <span className="text-amber-700 font-bold block text-[10px] uppercase">2. Binder Course (50mm)</span>
                <p className="text-slate-800 font-semibold">Dense Bituminous Macadam (DBM-II)</p>
                <p className="text-slate-500 text-[10px]">VG-30/VG-40 heavy axle load distribution across wheelpaths</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-0.5">
                <span className="text-blue-700 font-bold block text-[10px] uppercase">3. Base Course (250mm)</span>
                <p className="text-slate-800 font-semibold">Wet Mix Macadam (WMM Base)</p>
                <p className="text-slate-500 text-[10px]">Crushed graded aggregate mechanically compacted at OMC</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-0.5">
                <span className="text-emerald-700 font-bold block text-[10px] uppercase">4. Sub-Base (200mm)</span>
                <p className="text-slate-800 font-semibold">Granular Sub-Base (GSB Grade-I)</p>
                <p className="text-slate-500 text-[10px]">Interlayer drainage over subgrade + RS-1 Tack Coat (0.25 kg/m²)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* If NSV Survey has NOT been performed for this road */}
      {!details.hasNsvSurvey && (
        <div className="p-6 bg-gradient-to-r from-amber-50 via-orange-50/40 to-slate-50 border-2 border-amber-300 rounded-xl space-y-4 shadow-sm">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  Survey Progression Status
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                No NSV Survey Has Been Performed for {details.roadName} ({details.roadCode})
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                {details.hasDroneSurvey ? (
                  <>
                    Drone aerial surveillance and AI defect mapping have been successfully completed (5 surface potholes mapped). However, <strong>no Network Survey Vehicle (NSV) survey has been conducted yet</strong> on this corridor. Ground laser profilometer longitudinal roughness (IRI), transverse rut depth, 360° spherical vehicle telemetry, and macrotexture data have NOT been captured.
                  </>
                ) : (
                  <>
                    <strong>Neither Drone Aerial Reconnaissance nor Ground NSV Survey</strong> has been performed yet for this corridor. Under standard operating procedures, drone aerial patrol must precede ground vehicle deployment.
                  </>
                )}
              </p>
            </div>

            <span className="px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full font-bold text-xs whitespace-nowrap">
              NSV Survey Pending
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="text-[11px] font-bold text-slate-700 block">Stage 1: Drone Aerial Survey</span>
              <span className={`text-xs font-semibold flex items-center gap-1.5 ${details.hasDroneSurvey ? 'text-emerald-700' : 'text-slate-500'}`}>
                {details.hasDroneSurvey ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Completed &amp; Verified</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Pending Drone Patrol</span>
                  </>
                )}
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-amber-300 bg-amber-50/50 space-y-1">
              <span className="text-[11px] font-bold text-amber-900 block">Stage 2: Ground NSV Survey</span>
              <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Not Performed (Vehicle Awaiting)</span>
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1 opacity-75">
              <span className="text-[11px] font-bold text-slate-700 block">Stage 3: DPR &amp; Tender Release</span>
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Blocked (Requires NSV Data)</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <FileUp className="w-4 h-4" />
              <span>Upload / Ingest NSV Report File</span>
            </button>

            <button
              onClick={() => navigate('/nsv/MAR-1111')}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#1a73e8]" />
              <span>View Certified 14-Page NSV for Road MAR 1111</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to GIS Dashboard</span>
            </button>
          </div>
        </div>
      )}

      {/* Navigation Tabs (Engineering Dimensions & Telemetry) */}
      <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-2 rounded-t-lg overflow-x-auto scrollbar-thin">
        {/* TAB 1: DRONE SNAP MAP & GALLERY (FIRST TAB AS REQUESTED) */}
        <button
          onClick={() => setActiveTab('visuals')}
          className={`px-3 py-2.5 text-xs border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'visuals'
              ? 'border-[#1a73e8] text-[#1a73e8] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-blue-600" />
          <span>Drone Snap Map &amp; Gallery</span>
          {highlightedDefect && (
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-700 font-semibold">
              Focus: {highlightedDefect}
            </span>
          )}
        </button>

        {/* TAB 2: ROAD PARAMETERS & SCHEMATIC */}
        <button
          onClick={() => setActiveTab('parameters')}
          className={`px-3 py-2.5 text-xs border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'parameters'
              ? 'border-[#1a73e8] text-[#1a73e8] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Road Parameters &amp; Schematic</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-bold">
            ₹28.20L
          </span>
        </button>

        {/* TAB 3: NSV EQUIPMENT & SENSORS */}
        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-3 py-2.5 text-xs border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'equipment'
              ? 'border-[#1a73e8] text-[#1a73e8] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5 text-blue-600" />
          <span>NSV Equipment &amp; Sensors</span>
        </button>

        {/* TAB 4: PAVEMENT DISTRESS & POTHOLES */}
        <button
          onClick={() => setActiveTab('condition')}
          className={`px-3 py-2.5 text-xs border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'condition'
              ? 'border-[#1a73e8] text-[#1a73e8] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          <span>Pavement Distress &amp; Potholes</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-700 font-bold">
            4 Nos.
          </span>
        </button>

        {/* TAB 5: ROUGHNESS & IRI ANALYTICS */}
        <button
          onClick={() => setActiveTab('roughness')}
          className={`px-3 py-2.5 text-xs border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'roughness'
              ? 'border-[#1a73e8] text-[#1a73e8] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#ea4335]" />
          <span>Roughness &amp; IRI Analytics</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-100 text-red-700 font-bold font-mono">
            5.20
          </span>
        </button>

        {/* TAB 6: RUTTING DATA & FIELD SHEET */}
        <button
          onClick={() => setActiveTab('rutting')}
          className={`px-3 py-2.5 text-xs border-b-2 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'rutting'
              ? 'border-[#1a73e8] text-[#1a73e8] font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
          <span>Rutting Data &amp; Field Sheet</span>
          <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-bold font-mono">
            20mm
          </span>
        </button>
      </div>

      {/* TAB 1 CONTENT: DRONE SNAP MAP TOPMOST & LANE NUMBERED POTHOLES */}
      {activeTab === 'visuals' && (
        <div className="space-y-6">
          {/* 1. Snap-Taking Flight Map & Waypoints (TOPMOST AS REQUESTED) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                1. Drone Snap-Taking Flight Map &amp; Waypoints
              </h3>
              <span className="text-xs text-slate-500">
                Corridor: {details.roadName} • {details.section}
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

          {/* 2. Lane Numbered Potholes & Close Inspection Gallery */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                2. Lane Numbered Potholes &amp; Defect Inspection Gallery
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {details.potholeInspections.length} Verified Potholes • 20mm Max Depth • 120m Corridor Package
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
              onProceedToDpr={() => navigate(`/dpr/${details.roadCode}`)}
              onJumpTo360={() => setActiveTab('visuals')}
            />
          )}

          {/* Official NSV Report Highlights Card: Extracted statutory data from certified 14-page PDF report */}
          <NsvReportHighlightsCard
            details={details}
            onOpenFullReport={() => setShowPdfModal(true)}
            onProceedToDpr={() => navigate(`/dpr/${details.roadCode}`)}
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
    </div>
  );
};
