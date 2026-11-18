import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormPageHeader } from '../../common/FormPageHeader';
import { GenericTable, type Column } from '../../common/GenericTable';
import { GenericButton } from '../../common/GenericButton';
import { StatusBadge } from '../../common/StatusBadge';
import { ScoreMeter } from '../../common/ScoreMeter';
import { AssignRepairModal } from './AssignRepairModal';
import { DronePhotoModal } from './DronePhotoModal';
import { Gps360Modal } from './Gps360Modal';
import { UploadNsvReportModal } from '../../common/UploadNsvReportModal';
import type { DroneSurveyRecord, RepairPriority } from '../../models/surveyModels';
import { surveyService } from '../../services/surveyService';
import {
  ExternalLink,
  Eye,
  Wrench,
  Clock,
  RotateCcw,
  MapPin,
  CheckCircle,
  AlertTriangle,
  FileText,
  Activity,
  Lock,
  TrendingUp,
  Video,
  Play,
  Upload,
} from 'lucide-react';

export const DroneSurveyListing: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const roadCodeParam = searchParams.get('roadCode');
  const initialCondition = searchParams.get('condition') || 'ALL';

  const [data, setData] = useState<DroneSurveyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadModalRecord, setUploadModalRecord] = useState<{ roadCode: string; roadName?: string } | null>(null);

  // Filters
  const [actionAreaFilter, setActionAreaFilter] = useState('ALL');
  const [conditionFilter, setConditionFilter] = useState(initialCondition);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [roadTypeFilter, setRoadTypeFilter] = useState('ALL');

  useEffect(() => {
    const cond = searchParams.get('condition');
    if (cond) {
      setConditionFilter(cond);
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setActionAreaFilter('ALL');
    setConditionFilter('ALL');
    setStatusFilter('ALL');
    setRoadTypeFilter('ALL');
    setSearchParams({});
  };

  const isAnyFilterActive =
    actionAreaFilter !== 'ALL' ||
    conditionFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    roadTypeFilter !== 'ALL';

  // Modals
  const [assignModalRecord, setAssignModalRecord] = useState<DroneSurveyRecord | null>(null);
  const [photoModalRecord, setPhotoModalRecord] = useState<DroneSurveyRecord | null>(null);
  const [gpsModalRecord, setGpsModalRecord] = useState<DroneSurveyRecord | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadSurveys = async () => {
    setIsLoading(true);
    try {
      const records = await surveyService.getSurveys();
      setData(records);
      if (roadCodeParam) {
        const found = records.find((r) => r.roadCode === roadCodeParam);
        if (found) {
          setGpsModalRecord(found);
        }
      }
    } catch (err) {
      console.error('Failed to load surveys:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSurveys();
  }, []);

  const filteredData = useMemo(() => {
    const filtered = data.filter((row) => {
      if (actionAreaFilter !== 'ALL' && row.actionArea !== actionAreaFilter) return false;
      if (conditionFilter !== 'ALL' && row.condition !== conditionFilter) return false;
      if (statusFilter !== 'ALL' && row.status !== statusFilter) return false;
      if (roadTypeFilter !== 'ALL' && !row.roadType.toLowerCase().includes(roadTypeFilter.toLowerCase())) return false;
      return true;
    });

    // Ensure Critical Priority corridors are sorted first, with flagship MAR-1111 as Row #1
    const conditionRank: Record<string, number> = {
      Critical: 1,
      Poor: 2,
      Fair: 3,
      Good: 4,
    };

    return [...filtered].sort((a, b) => {
      if (a.roadCode === 'MAR-1111') return -1;
      if (b.roadCode === 'MAR-1111') return 1;

      const rankA = conditionRank[a.condition] || 99;
      const rankB = conditionRank[b.condition] || 99;
      if (rankA !== rankB) {
        return rankA - rankB; // Critical first, then Poor, Fair, Good
      }

      if (b.depthOfRut !== a.depthOfRut) {
        return b.depthOfRut - a.depthOfRut;
      }
      return b.potholeCount - a.potholeCount;
    });
  }, [data, actionAreaFilter, conditionFilter, statusFilter, roadTypeFilter]);

// Summary Metrics calculated over loaded dataset
const metrics = useMemo(() => {
  const total = data.length;
  const criticalCount = data.filter((r) => r.condition === 'Critical').length;
  const poorCount = data.filter((r) => r.condition === 'Poor').length;
  const fairGoodCount = data.filter((r) => r.condition === 'Fair' || r.condition === 'Good').length;
  const avgScore = total > 0 ? Math.round(data.reduce((acc, r) => acc + r.goodnessScore, 0) / total) : 0;
  const totalBadArea = data.reduce((acc, r) => acc + r.areaOfBadness, 0).toFixed(1);
  const totalCost = data.reduce((acc, r) => acc + r.roughCostINR, 0);
  return { total, criticalCount, poorCount, fairGoodCount, avgScore, totalBadArea, totalCost };
}, [data]);

const handleViewNSVDetails = (roadCode: string) => {
  window.open(`/nsv/${roadCode}`, '_blank');
};

const handleViewDPR = (roadCode: string) => {
  navigate(`/dpr/${roadCode}`);
};

const handleIgnoreCheckLater = async (row: DroneSurveyRecord) => {
    try {
      const newStatus = row.status === 'Ignored' ? 'Pending Review' : 'Ignored';
      await surveyService.updateStatus(
        row.id,
        newStatus,
        newStatus === 'Ignored' ? 'Flagged for Check Later' : 'Active'
      );
      setData((prev) =>
        prev.map((item) => (item.id === row.id ? { ...item, status: newStatus } : item))
      );
      showToast(
        newStatus === 'Ignored'
          ? `Road ${row.roadCode} marked as "Check Later".`
          : `Road ${row.roadCode} restored to review.`
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssignRepairConfirm = async (
    id: number,
    assignment: { team: string; targetDate: string; priority: RepairPriority; notes?: string }
  ) => {
    try {
      const updated = await surveyService.assignRepair(id, assignment);
      setData((prev) => prev.map((item) => (item.id === id ? updated : item)));
      showToast(`Repair assigned to ${assignment.team} for road ${updated.roadCode}!`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Reset table data to default 65 New Town Kolkata records?')) {
      const reset = await surveyService.resetToDefault();
      setData(reset);
      showToast('Data reset to default 65 records.');
    }
  };

  const columns: Column<DroneSurveyRecord>[] = [
        {
          key: 'slNo',
          title: 'SL No.',
          field: 'slNo',
          width: '65px',
          align: 'center',
          isSortable: true,
          render: (row) => (
            <span className="font-mono text-slate-500 font-medium text-xs">
              {row.slNo}
            </span>
          ),
        },
                {
                  key: 'roadCode',
                title: 'Road Code',
                field: 'roadCode',
                width: '200px',
                isSortable: true,
      render: (row) => (
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-900 text-xs hover:text-blue-600 transition">
                      {row.roadCode}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium truncate max-w-[190px]" title={row.roadName}>
                    {row.roadName}
                  </p>
                <div className="text-[10px] text-slate-400">
                  {row.roadType}
                </div>
            </div>
          ),
    },
              {
                key: 'location',
              title: 'Location',
              field: 'location',
              width: '160px',
              isSortable: true,
      render: (row) => (
              <div>
                <div className="text-xs font-semibold text-slate-800">{row.location}</div>
                <div className="text-[10px] text-slate-500">{row.actionArea} • {row.chainage}</div>
              </div>
              ),
    },
              {
                key: 'distanceKm',
              title: 'Distance (km)',
              field: 'distanceKm',
              width: '95px',
              align: 'right',
              isSortable: true,
      render: (row) => (
              <div className="text-right">
                <span className="font-mono font-semibold text-slate-900 text-xs">
                  {row.distanceKm} km
                </span>
                <div className="text-[10px] text-slate-500 font-medium">
                  {row.roadCode === 'MAR-1111' ? '120m Priority Segment' : row.lane.split(' ')[0]}
                </div>
              </div>
              ),
    },
              {
                key: 'goodnessScore',
              title: 'Goodness Score',
              field: 'goodnessScore',
              width: '135px',
              isSortable: true,
      render: (row) => (
              <div className="space-y-1">
                <StatusBadge condition={row.condition} size="sm" />
              <ScoreMeter score={row.goodnessScore} label="PCI" size="sm" showBar={true} />
            </div>
          ),
    },
                {
                  key: 'gpsCoordinates',
                title: 'GPS (Lat & Long)',
                width: '130px',
      render: (row) => (
                <button
                  onClick={() => setGpsModalRecord(row)}
                  title="Click to inspect drone video & flight map at this GPS location"
                  className="group text-left p-1.5 -m-1 rounded hover:bg-blue-50 border border-transparent hover:border-blue-200 transition cursor-pointer flex items-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#1a73e8] group-hover:scale-110 transition flex-shrink-0" />
                  <div className="font-mono text-[11px] leading-tight">
                    <div className="text-slate-800 group-hover:text-blue-700 font-medium">
                      {row.gpsLatitude.toFixed(4)}° N
                    </div>
                    <div className="text-slate-500 group-hover:text-blue-600">
                      {row.gpsLongitude.toFixed(4)}° E
                    </div>
                  </div>
            </button>
          ),
    },
        {
          key: 'areaOfBadness',
          title: 'Area of Badness',
          field: 'areaOfBadness',
          width: '110px',
          align: 'right',
          isSortable: true,
          render: (row) => (
            <div className="text-right">
              <span className="font-mono font-semibold text-slate-900 text-xs">
                {row.areaOfBadness} m²
              </span>
              <div className="text-[10px] text-slate-500 font-medium">
                {row.roadCode === 'MAR-1111' ? '4 Potholes (0.0372 m³ void)' : `${row.potholeCount} potholes`}
              </div>
            </div>
          ),
    },
        {
          key: 'depthOfRut',
          title: 'Avg Rut Depth',
          field: 'depthOfRut',
          width: '115px',
          align: 'right',
          isSortable: true,
          render: (row) => (
            <div className="text-right">
              <span
                className={`font-mono font-semibold text-xs px-1.5 py-0.5 rounded ${row.depthOfRut >= 45
                    ? 'text-[#c5221f] bg-[#fce8e6] border border-[#ea4335]/30'
                    : row.depthOfRut >= 20
                      ? 'text-[#c5221f] bg-red-50 border border-red-200'
                      : row.depthOfRut >= 15
                        ? 'text-[#b06000] bg-[#fef7e0] border border-[#fbbc04]/40'
                        : 'text-slate-800 bg-slate-50'
                  }`}
              >
                {row.depthOfRut} mm
              </span>
            </div>
          ),
    },
        {
          key: 'roughCostINR',
          title: 'Rough Cost Estimation',
          field: 'roughCostINR',
          width: '150px',
          align: 'right',
          isSortable: true,
          render: (row) => (
            <div className="text-right">
              <div className="font-mono font-bold text-slate-900 text-xs">
                ₹{row.roughCostINR.toLocaleString('en-IN')}
              </div>
              <div
                className="text-[10px] text-slate-500 font-medium"
                title={
                  row.roadCode === 'MAR-1111'
                    ? 'Part 1 (4 Potholes Patching): ₹3.72L + Part 2 (120m Resurfacing): ₹24.48L'
                    : 'Based on West Bengal PWD SoR & NKDA urban norms'
                }
              >
                {row.roadCode === 'MAR-1111' ? '₹28.20 Lakh (SoR DPR Sanction)' : `₹${row.costPerM2}/m² (WB PWD)`}
              </div>
            </div>
          ),
    },
        {
          key: 'dronePhoto',
          title: 'Drone Media & Photos',
          width: '210px',
          align: 'center',
          render: (row) => {
            if (!row.droneSurveyDone) {
              return (
                <div className="flex items-center justify-center">
                  <span
                    className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-mono rounded border border-dashed border-slate-300"
                    title="Drone aerial patrol pending for this corridor"
                  >
                    Pending Flight
                  </span>
                </div>
              );
            }

            const isMar1111 = row.roadCode === 'MAR-1111' || row.roadCode.includes('1111');
            const fallbackAerial = 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_pothole.jpg';
            const fallbackOblique = 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg';

            if (isMar1111) {
              const marPotholeMedia = [
                {
                  id: 'P1',
                  ch: 'Km 0+018',
                  depth: '20mm',
                  img: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg',
                  label: 'PH-01 (Slow Vehicle Lane)',
                },
                {
                  id: 'P2',
                  ch: 'Km 0+045',
                  depth: '20mm',
                  img: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Pothole_Big.jpg',
                  label: 'PH-02 (Near Wheelpath)',
                },
                {
                  id: 'P3',
                  ch: 'Km 0+082',
                  depth: '20mm',
                  img: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Pothole_repair.jpg',
                  label: 'PH-03 (Outer Wheelpath)',
                },
                {
                  id: 'P4',
                  ch: 'Km 0+105',
                  depth: '20mm',
                  img: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_pothole.jpg',
                  label: 'PH-04 (Terminal Resurfacing)',
                },
              ];

              return (
                <div className="flex items-center justify-center gap-1">
                  {/* Aerial Video Recording Pill */}
                  <button
                    onClick={() => setGpsModalRecord(row)}
                    className="w-8 h-7 rounded overflow-hidden border border-blue-400 bg-slate-900 text-white flex flex-col items-center justify-center hover:bg-blue-950 transition cursor-pointer relative group/vid"
                    title="Click to view Drone Aerial Photogrammetry Video Pass"
                  >
                    <Video className="w-3 h-3 text-red-500" />
                    <span className="text-[6px] font-black uppercase text-blue-300">Video</span>
                  </button>

                  {/* 4 Distinct Pothole Photos */}
                  {marPotholeMedia.map((m) => (
                    <div key={m.id} className="relative group cursor-pointer">
                      <div
                        onClick={() => setPhotoModalRecord(row)}
                        className="w-8 h-7 rounded overflow-hidden border border-slate-200 bg-slate-100 hover:border-red-500 transition relative"
                        title={`${m.id}: ${m.ch} (${m.depth})`}
                      >
                        <img src={m.img} alt={m.id} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/80 text-white text-[7px] font-mono text-center font-bold">
                          {m.id}
                        </span>
                      </div>

                      {/* Hover Zoom Card */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none transition-all duration-200 animate-in fade-in">
                        <div className="w-56 p-2 bg-white rounded-lg shadow-xl border border-slate-300 pointer-events-auto">
                          <div className="relative aspect-[16/10] bg-slate-900 rounded overflow-hidden mb-1">
                            <img src={m.img} alt={m.label} className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-red-600 text-white text-[9px] font-mono px-1 rounded font-bold">
                              {m.id} • {m.depth}
                            </span>
                          </div>
                          <div className="text-[10px] font-semibold text-slate-800 leading-tight">
                            {m.label}
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                            Location: {m.ch} • Road MAR-1111
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }

            return (
              <div className="flex items-center justify-center gap-1.5">
                {/* Photo 1: Top Aerial Scan with hover modal zoom */}
                <div className="relative group cursor-pointer">
                  <div
                    onClick={() => setPhotoModalRecord(row)}
                    className="w-10 h-7 rounded overflow-hidden border border-slate-200 bg-slate-100 hover:border-blue-500 hover:shadow-sm transition"
                    title="Photo 1: Aerial Top Scan (Hover to zoom)"
                  >
                    <img
                      src={row.dronePhotoThumb || fallbackAerial}
                      alt="Aerial"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackAerial;
                      }}
                    />
                  </div>

                  {/* Hover Modal Zoom Card */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none transition-all duration-200 animate-in fade-in">
                    <div className="w-64 p-2 bg-white rounded-lg shadow-xl border border-slate-300 pointer-events-auto">
                      <div className="relative aspect-[16/10] bg-slate-900 rounded overflow-hidden mb-1.5">
                        <img
                          src={row.dronePhoto || fallbackAerial}
                          alt="Aerial Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackAerial;
                          }}
                        />
                        <span className="absolute top-1 left-1 bg-black/75 text-white text-[9px] font-mono px-1 rounded">
                          Top Scan
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-semibold text-slate-800">{row.roadCode}</span>
                        <span className="text-red-600 font-bold">{row.depthOfRut}mm Rut</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Photo 2: Oblique 3D LiDAR Scan with hover modal zoom */}
                <div className="relative group cursor-pointer">
                  <div
                    onClick={() => setPhotoModalRecord(row)}
                    className="w-10 h-7 rounded overflow-hidden border border-slate-200 bg-slate-100 hover:border-blue-500 hover:shadow-sm transition"
                    title="Photo 2: 3D LiDAR Scan (Hover to zoom)"
                  >
                    <img
                      src={row.dronePhoto2Thumb || fallbackOblique}
                      alt="3D LiDAR"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = fallbackOblique;
                      }}
                    />
                  </div>

                  {/* Hover Modal Zoom Card */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none transition-all duration-200 animate-in fade-in">
                    <div className="w-64 p-2 bg-white rounded-lg shadow-xl border border-slate-300 pointer-events-auto">
                      <div className="relative aspect-[16/10] bg-slate-900 rounded overflow-hidden mb-1.5">
                        <img
                          src={row.dronePhoto2 || fallbackOblique}
                          alt="LiDAR Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = fallbackOblique;
                          }}
                        />
                        <span className="absolute top-1 left-1 bg-[#1a73e8] text-white text-[9px] font-mono px-1 rounded">
                          3D LiDAR Mesh
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="font-semibold text-slate-800">{row.location}</span>
                        <span className="text-emerald-700 font-bold">{row.areaOfBadness}m²</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          },
        },
        {
          key: 'actions',
          title: 'Actions',
          width: '280px',
          align: 'center',
          render: (row) => {
            const isUploaded =
              row.roadCode === 'MAR-1111' ||
              row.roadCode.includes('1111') ||
              localStorage.getItem(`nsv_uploaded_${row.roadCode}`) === 'true';

            if (row.pipelineTier === 'pending_drone') {
              return (
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-500 rounded border border-slate-200">
                    Drone Pending
                  </span>
                </div>
              );
            }

            if (!isUploaded) {
              return (
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setUploadModalRecord({ roadCode: row.roadCode, roadName: row.roadName })}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded transition cursor-pointer flex items-center gap-1 shadow-xs active:scale-98"
                    title="Upload certified NSV report PDF to extract road telemetry"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload NSV</span>
                  </button>
                  <button
                    onClick={() => setAssignModalRecord(row)}
                    className="px-2 py-1 text-xs font-semibold rounded border bg-[#ea4335] hover:bg-[#c5221f] text-white border-[#ea4335] shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>Assign</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {/* View NSV details button - ONLY visible when NSV report is uploaded! */}
                <button
                  onClick={() => handleViewNSVDetails(row.roadCode)}
                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition cursor-pointer flex items-center gap-1 shadow-xs"
                  title="Open extracted NSV telemetry & parameters"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View NSV Details</span>
                  <ExternalLink className="w-3 h-3 opacity-80" />
                </button>

                {/* Ignore / Check later button */}
                <button
                  onClick={() => handleIgnoreCheckLater(row)}
                  className={`px-2 py-1 text-xs font-medium rounded border transition cursor-pointer flex items-center gap-1 ${
                    row.status === 'Ignored'
                      ? 'bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>{row.status === 'Ignored' ? 'Ignored' : 'Check Later'}</span>
                </button>

                {/* Assign / Repair button */}
                <button
                  onClick={() => setAssignModalRecord(row)}
                  className={`px-2 py-1 text-xs font-semibold rounded border transition cursor-pointer flex items-center gap-1 ${
                    row.status === 'Assigned'
                      ? 'bg-emerald-50 text-[#137333] border-emerald-300'
                      : 'bg-[#ea4335] hover:bg-[#c5221f] text-white border-[#ea4335] shadow-xs'
                  }`}
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>{row.status === 'Assigned' ? 'Assigned' : 'Assign'}</span>
                </button>
              </div>
            );
          },
        },
              ];

              return (
              <div className="space-y-2.5">
                {/* Compact Page Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <span>Drone Survey Report Directory</span>
                    </h1>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
                      {data.length} Corridors
                    </span>
                  </div>
                </div>

                {/* Compact Triage & Micro-KPI Bar */}
                <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs flex flex-wrap items-center justify-between gap-2.5">
                  {/* Category Triage Pills */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Triage:</span>

                    {/* Critical Pill */}
                    <button
                      onClick={() => {
                        setConditionFilter(conditionFilter === 'Critical' ? 'ALL' : 'Critical');
                        setSearchParams(conditionFilter === 'Critical' ? {} : { condition: 'Critical' });
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                        conditionFilter === 'Critical'
                          ? 'bg-red-600 text-white border-red-700 shadow-xs ring-2 ring-red-200'
                          : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                      }`}
                      title="Critical lanes requiring immediate MoRTH resurfacing (Includes MAR 1111)"
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      <span>Critical Priority ({metrics.criticalCount})</span>
                    </button>

                    {/* Poor Pill */}
                    <button
                      onClick={() => {
                        setConditionFilter(conditionFilter === 'Poor' ? 'ALL' : 'Poor');
                        setSearchParams(conditionFilter === 'Poor' ? {} : { condition: 'Poor' });
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                        conditionFilter === 'Poor'
                          ? 'bg-amber-600 text-white border-amber-700 shadow-xs ring-2 ring-amber-200'
                          : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                      }`}
                      title="Moderate distress & rutting requiring scheduled maintenance"
                    >
                      <span>Poor Condition ({metrics.poorCount})</span>
                    </button>

                    {/* Fair / Good Pill */}
                    <button
                      onClick={() => {
                        setConditionFilter(conditionFilter === 'Fair' ? 'ALL' : 'Fair');
                        setSearchParams(conditionFilter === 'Fair' ? {} : { condition: 'Fair' });
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                        conditionFilter === 'Fair'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                      }`}
                      title="Stable asphalt riding surface under nominal surveillance"
                    >
                      <span>Fair / Good ({metrics.fairGoodCount})</span>
                    </button>

                    {/* All Corridors Pill */}
                    <button
                      onClick={() => {
                        setConditionFilter('ALL');
                        setSearchParams({});
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border ${
                        conditionFilter === 'ALL'
                          ? 'bg-[#1a73e8] text-white border-[#1557b0] shadow-xs ring-2 ring-blue-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span>All Corridors ({metrics.total})</span>
                    </button>
                  </div>

                  {/* Right Side Inline Micro-KPIs */}
                  <div className="flex items-center gap-3.5 text-xs text-slate-600 font-mono ml-auto">
                    <div className="flex items-center gap-1.5" title="Network Pavement Condition Index">
                      <span className="text-[10px] text-slate-400 font-sans uppercase font-medium">Avg PCI:</span>
                      <span className="font-bold text-slate-900">{metrics.avgScore}/100</span>
                    </div>
                    <div className="h-3.5 w-px bg-slate-200" />
                    <div className="flex items-center gap-1.5" title="Cumulative Badness Area across surveyed corridors">
                      <span className="text-[10px] text-slate-400 font-sans uppercase font-medium">Distress:</span>
                      <span className="font-bold text-red-600">{metrics.totalBadArea} m²</span>
                    </div>
                    <div className="h-3.5 w-px bg-slate-200" />
                    <div className="flex items-center gap-1.5" title="Estimated repair budget under Schedule of Rates">
                      <span className="text-[10px] text-slate-400 font-sans uppercase font-medium">Est. Budget:</span>
                      <span className="font-bold text-[#137333]">₹{(metrics.totalCost / 100000).toFixed(2)} Lakh</span>
                    </div>
                  </div>
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                  <div className="fixed bottom-5 right-5 z-50 p-3 bg-white border border-slate-300 rounded-lg shadow-lg text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#34a853]" />
                    <span>{toastMessage}</span>
                  </div>
                )}

                {/* Generic Table with Survey Records */}
                <GenericTable<DroneSurveyRecord>
                  columns={columns}
                  data={filteredData}
                  rowKey="id"
                  title={
                    conditionFilter === 'Critical'
                      ? `🚨 Critical Priority Corridors (${filteredData.length})`
                      : conditionFilter === 'Poor'
                      ? `⚠️ Poor Condition Corridors (${filteredData.length})`
                      : conditionFilter === 'Fair'
                      ? `✅ Fair / Good Condition Corridors (${filteredData.length})`
                      : `New Town Kolkata Surveyed Corridors Directory (${filteredData.length})`
                  }
                  subtitle="Critical corridors sorted first (Flagship: Road MAR 1111). Click GPS coordinates to view flight map or hover on photos to zoom."
                                  isLoading={isLoading}
                                  searchPlaceholder="Search Road Code, name, or location..."
                                  searchFields={['roadCode', 'roadName', 'location', 'actionArea']}
                                  initialPageSize={15}
                                  pageSizeOptions={[10, 15, 25, 65]}
                                  exportFileName="newtown_drone_survey_report"
                                  filterComponent={
                                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1 border-t border-slate-200">
                                      {/* Action Area Filter */}
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-slate-600 font-semibold">Area:</span>
                                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
                                          {['ALL', 'Action Area I', 'Action Area II', 'Action Area III', 'CBD'].map((area) => {
                                            const isSelected = actionAreaFilter === area;
                                            return (
                                              <button
                                                key={area}
                                                onClick={() => setActionAreaFilter(area)}
                                                className={`px-2 py-0.5 rounded text-xs transition cursor-pointer font-medium ${isSelected
                                                    ? 'bg-white text-[#1a73e8] font-bold shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                                  }`}
                                              >
                                                {area === 'ALL' ? 'All Areas' : area.replace('Action Area ', 'AA-')}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Condition Filter */}
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-slate-600 font-semibold">Condition:</span>
                                        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
                                          {['ALL', 'Critical', 'Poor', 'Fair', 'Good'].map((cond) => {
                                            const isSelected = conditionFilter === cond;
                                            return (
                                              <button
                                                key={cond}
                                                onClick={() => setConditionFilter(cond)}
                                                className={`px-2 py-0.5 rounded text-xs transition cursor-pointer font-medium ${isSelected
                                                    ? 'bg-white text-[#1a73e8] font-bold shadow-xs'
                                                    : 'text-slate-600 hover:text-slate-900'
                                                  }`}
                                              >
                                                {cond}
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>

                                      {/* Road Type Filter */}
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-slate-600 font-semibold">Type:</span>
                                        <select
                                          value={roadTypeFilter}
                                          onChange={(e) => setRoadTypeFilter(e.target.value)}
                                          className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-700 text-xs focus:outline-none focus:border-blue-500 font-medium"
                                        >
                                          <option value="ALL">All Road Types</option>
                                          <option value="Major Arterial">Major Arterial (6-Lane)</option>
                                          <option value="4-Lane">4-Lane Arterial</option>
                                          <option value="Street">Street / Sector Road</option>
                                          <option value="Collector">Collector Street</option>
                                          <option value="Link">Connector / Link Road</option>
                                        </select>
                                      </div>

                                      {/* Status Filter */}
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-slate-600 font-semibold">Status:</span>
                                        <select
                                          value={statusFilter}
                                          onChange={(e) => setStatusFilter(e.target.value)}
                                          className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-700 text-xs focus:outline-none focus:border-blue-500 font-medium"
                                        >
                                          <option value="ALL">All Statuses</option>
                                          <option value="Pending Review">Pending Review</option>
                                          <option value="Assigned">Assigned</option>
                                                                                    <option value="Ignored">Ignored / Check later</option>
                                          <option value="Repaired">Repaired</option>
                                        </select>
                                      </div>

                                      {/* Reset Filter Button */}
                                      {isAnyFilterActive && (
                                        <button
                                          onClick={handleResetFilters}
                                          className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition cursor-pointer flex items-center gap-1 ml-auto"
                                        >
                                          <RotateCcw className="w-3 h-3" />
                                          <span>Reset All Filters</span>
                                        </button>
                                      )}
                                    </div>
                                  }
                                />

                                {/* Assign / Repair Modal */}
                                <AssignRepairModal
                                  isOpen={Boolean(assignModalRecord)}
                                  onClose={() => setAssignModalRecord(null)}
                                  surveyRecord={assignModalRecord}
                                  onAssignConfirm={handleAssignRepairConfirm}
                                />

                                {/* Drone Photo Modal (supports both photos) */}
                                <DronePhotoModal
                                  isOpen={Boolean(photoModalRecord)}
                                  onClose={() => setPhotoModalRecord(null)}
                                  record={photoModalRecord}
                                  onViewNSV={handleViewNSVDetails}
                                />

                                {/* GPS Coordinate 360-Degree Modal */}
                                <Gps360Modal
                                  isOpen={Boolean(gpsModalRecord)}
                                  onClose={() => setGpsModalRecord(null)}
                                  record={gpsModalRecord}
                                  onViewNSV={handleViewNSVDetails}
                                  onViewDPR={handleViewDPR}
                                />

                                {/* Upload NSV Report Modal */}
                                {uploadModalRecord && (
                                  <UploadNsvReportModal
                                    isOpen={Boolean(uploadModalRecord)}
                                    onClose={() => setUploadModalRecord(null)}
                                    roadCode={uploadModalRecord.roadCode}
                                    roadName={uploadModalRecord.roadName}
                                    onUploadSuccess={() => {
                                      setUploadModalRecord(null);
                                      setData((prev) => [...prev]);
                                    }}
                                  />
                                )}
                              </div>
                          );
};
