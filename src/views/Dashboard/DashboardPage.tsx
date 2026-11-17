import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileSpreadsheet,
  AlertTriangle,
  Flame,
  Activity,
  DollarSign,
  Navigation,
  Compass,
  Layers,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  ChevronRight,
  MapPin,
  Eye,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { DroneSurveyRecord } from '../../models/surveyModels';
import { surveyService } from '../../services/surveyService';
import { NewTownGisMap } from './components/NewTownGisMap';
import { RoadInspectionSidePanel } from './components/RoadInspectionSidePanel';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<DroneSurveyRecord[]>([]);

  // Initially NULL so no single road is selected by default
  const [selectedRoadCode, setSelectedRoadCode] = useState<string | null>(null);
  const [selectedPotholeId, setSelectedPotholeId] = useState<string | undefined>(undefined);
  const [selectedActionArea, setSelectedActionArea] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSurveys = async () => {
      setIsLoading(true);
      try {
        const data = await surveyService.getSurveys();
        setSurveys(data);
      } catch (e) {
        console.error('Failed to load surveys:', e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSurveys();
  }, []);

  // Selected survey or null
  const selectedSurvey = selectedRoadCode
    ? surveys.find((s) => s.roadCode === selectedRoadCode) || null
    : null;

  // Filtered surveys for map
  const filteredSurveys = surveys.filter((s) => {
    if (selectedActionArea === 'All') return true;
    return s.actionArea === selectedActionArea;
  });

  const criticalSurveys = surveys.filter((s) => s.condition === 'Critical');
  const criticalCount = criticalSurveys.length;
  const totalBadArea = surveys.reduce((acc, s) => acc + s.areaOfBadness, 0).toFixed(1);
  const totalCostLakhs = (surveys.reduce((acc, s) => acc + s.roughCostINR, 0) / 100000).toFixed(2);

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs">Loading New Town Kolkata GIS Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8">
      {/* Top Banner: GIS Command Center */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Government of West Bengal • New Town Kolkata Development Authority (NKDA)
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-mono font-bold text-[#1a73e8] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              SURVEY REPORT PLATFORM
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 mt-1">
            New Town Kolkata Road Distress Surveillance &amp; Pothole GIS Dashboard
          </h2>
        </div>

        {/* Quick Category Routes */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/survey?condition=Critical')}
            className="px-3.5 py-2 bg-[#ea4335] hover:bg-[#c5221f] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-98 animate-pulse hover:animate-none"
            title="Inspect only critical distress corridors requiring immediate resurfacing"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Critical Lanes ({criticalCount})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => navigate('/survey')}
            className="px-3 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer flex items-center gap-1.5 active:scale-98"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>All Corridors ({surveys.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards - Direct Category Jumps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        {/* Card 1: Monitored Corridors */}
        <div
          onClick={() => navigate('/survey')}
          className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1 hover:border-blue-400 hover:shadow-md cursor-pointer transition group"
          title="Click to view all surveyed corridors directory"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Monitored Corridors</span>
            <Navigation className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{surveys.length}</div>
          <div className="text-[11px] text-blue-600 font-semibold group-hover:underline flex items-center gap-1">
            <span>Browse all 65 corridors</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 2: Critical Corridors */}
        <div
          onClick={() => navigate('/survey?condition=Critical')}
          className="p-3.5 bg-red-50/70 border border-red-300 rounded-xl shadow-xs space-y-1 hover:border-red-500 hover:ring-2 hover:ring-red-200 hover:shadow-md cursor-pointer transition group"
          title="Click to filter Drone Survey Directory to Critical Lanes only"
        >
          <div className="flex items-center justify-between text-red-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Critical Corridors</span>
            <AlertTriangle className="w-4 h-4 text-[#ea4335] animate-bounce" />
          </div>
          <div className="text-2xl font-black text-[#c5221f]">{criticalCount}</div>
          <div className="text-[11px] text-red-700 font-bold group-hover:underline flex items-center gap-1">
            <span>🚨 View {criticalCount} Critical Lanes</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Total Badness Area */}
        <div
          onClick={() => navigate('/survey?condition=Critical')}
          className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1 hover:border-amber-400 hover:shadow-md cursor-pointer transition group"
          title="Click to view corridors with severe pothole area breaches"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Cumulative Potholes Area</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {totalBadArea} <span className="text-xs font-normal text-slate-400">m²</span>
          </div>
          <div className="text-[11px] text-amber-700 font-semibold group-hover:underline flex items-center gap-1">
            <span>Inspect Distress Hotspots</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 4: Estimated Repair Cost (SoR Formulation) */}
        <div
          onClick={() => navigate('/progress')}
          className="p-3.5 bg-emerald-50/70 border border-emerald-300 rounded-xl shadow-xs space-y-1 hover:border-emerald-500 hover:shadow-md cursor-pointer transition group"
          title="Click to view execution progress & sanction breakdown"
        >
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-[11px] font-bold uppercase tracking-wider">Estimated Repair Cost</span>
            <DollarSign className="w-4 h-4 text-[#34a853]" />
          </div>
          <div className="text-2xl font-black text-[#137333]">
            ₹{totalCostLakhs} <span className="text-xs font-normal text-emerald-600">Lakh</span>
          </div>
          <div className="text-[11px] text-emerald-800 font-semibold group-hover:underline flex items-center gap-1">
            <span>Open Progress &amp; DPRs</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Action Area Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-4 py-2.5 rounded-lg border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-slate-500 font-semibold mr-1">Filter Corridor Zone:</span>
          {['All', 'Action Area I', 'Action Area II', 'Action Area III', 'CBD'].map((zone) => (
            <button
              key={zone}
              onClick={() => setSelectedActionArea(zone)}
              className={`px-3 py-1 rounded-md transition font-medium cursor-pointer ${
                selectedActionArea === zone
                  ? 'bg-[#1a73e8] text-white font-bold shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/progress')}
            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Progress Report</span>
          </button>
          <div className="text-slate-500 text-[11px] font-mono hidden sm:inline">
            Showing {filteredSurveys.length} of {surveys.length} Corridors
          </div>
        </div>
      </div>

      {/* Main Split Grid: Left Map (60%) vs Right Inspection Side Panel (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[580px] lg:h-[720px]">
        {/* Left Column: GIS Map (7 cols) */}
        <div className="lg:col-span-7 flex flex-col h-full min-h-[500px]">
          <NewTownGisMap
            surveys={filteredSurveys}
            selectedRoadCode={selectedRoadCode}
            onSelectRoad={(code) => {
              setSelectedRoadCode(code);
              setSelectedPotholeId(undefined);
            }}
            onClearSelection={() => {
              setSelectedRoadCode(null);
              setSelectedPotholeId(undefined);
            }}
            selectedPotholeId={selectedPotholeId}
            onSelectPothole={(pthId) => setSelectedPotholeId(pthId)}
          />
        </div>

        {/* Right Column: Inspection Side Panel or Overview Hub (5 cols) */}
        <div className="lg:col-span-5 flex flex-col h-full min-h-[500px] overflow-hidden">
          {selectedSurvey ? (
            <RoadInspectionSidePanel
              survey={selectedSurvey}
              onClose={() => {
                setSelectedRoadCode(null);
                setSelectedPotholeId(undefined);
              }}
              selectedPotholeId={selectedPotholeId}
              onSelectPothole={(pthId) => setSelectedPotholeId(pthId)}
            />
          ) : (
            /* Clean Overview State when no road is selected */
            <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-full p-4 space-y-4">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Road Distress &amp; Inspection Data Hub
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  Corridor Survey &amp; Distress Overview
                </h3>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Select any corridor from the GIS map or directory below to inspect its post-flight drone photogrammetry imagery, verified potholes, and certified NSV field data.
                </p>
              </div>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
                  <span className="text-red-700 font-semibold block text-[11px]">Critical Roads</span>
                  <span className="text-xl font-black text-[#c5221f]">{criticalCount} Corridors</span>
                  <span className="text-[10px] text-red-600 block mt-0.5">Rut depth &gt; 45mm</span>
                </div>
                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
                  <span className="text-blue-700 font-semibold block text-[11px]">Active Surveillance</span>
                  <span className="text-xl font-black text-[#1a73e8]">{surveys.length} Roads</span>
                  <span className="text-[10px] text-blue-600 block mt-0.5">Drone RTK Fixed</span>
                </div>
              </div>

              {/* Quick Focus: Road MAR 1111 (Flagship Critical Corridor) */}
              <div className="p-3 bg-red-50/70 border-2 border-red-300 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    <span>NKDA Road MAR 1111</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
                    🚨 Critical Priority • 4 Potholes
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Biswa Bangla Sarani (120m Resurfacing Segment) • 4 Verified Potholes (1.86 m², 20mm depth) • NSV IRI 5.20 m/km
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    onClick={() => {
                      setSelectedRoadCode('MAR-1111');
                      setSelectedPotholeId(undefined);
                    }}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Inspect On Map</span>
                  </button>
                  <button
                    onClick={() => navigate('/nsv/MAR-1111')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-red-700 border border-red-200 text-[11px] font-semibold rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3 text-red-600" />
                    <span>NSV Details</span>
                  </button>
                  <button
                    onClick={() => navigate('/dpr/MAR-1111')}
                    className="px-2.5 py-1 bg-[#ea4335] hover:bg-[#c5221f] text-white text-[11px] font-bold rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>DPR &amp; Tender</span>
                  </button>
                </div>
              </div>

              {/* Corridor 2: Street No. 0112 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900 text-xs">NKDA-AA1-ST112-0002</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Drone Done • NSV Pending
                  </span>
                </div>
                <div className="text-[11px] text-slate-600">
                  Street No. 0112 (Novotel - Coal India Bhawan Corridor) • 5 Potholes Verified • <strong>NO NSV Survey Performed</strong>
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    onClick={() => {
                      setSelectedRoadCode('NKDA-AA1-ST112-0002');
                      setSelectedPotholeId(undefined);
                    }}
                    className="px-2.5 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-[11px] font-bold rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3" />
                    <span>Inspect On Map</span>
                  </button>
                  <button
                    onClick={() => navigate('/nsv/NKDA-AA1-ST112-0002')}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>NSV Pending</span>
                  </button>
                </div>
              </div>

              {/* Corridors List with Tier Badges */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[340px]">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                  <span>Township Corridors (Survey Status):</span>
                  <span className="text-[11px] text-slate-500 font-mono font-bold">
                    {surveys.filter((s) => s.droneSurveyDone).length} Done / {surveys.length} Total
                  </span>
                </div>

                {surveys.slice(0, 15).map((survey) => {
                  const isFull = survey.pipelineTier === 'full_pipeline';
                  const isDrone = survey.pipelineTier === 'drone_only';
                  const isPending = survey.pipelineTier === 'pending_drone';

                  return (
                    <div
                      key={survey.roadCode}
                      onClick={() => {
                        setSelectedRoadCode(survey.roadCode);
                        setSelectedPotholeId(undefined);
                      }}
                      className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition cursor-pointer flex items-center justify-between gap-2 shadow-2xs group"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono font-bold text-xs text-slate-900 group-hover:text-blue-600">
                            {survey.roadCode}
                          </span>
                          {isFull && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800 border border-red-300">
                              🚨 Critical • 4 Potholes (Verified)
                            </span>
                          )}
                          {isDrone && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-[#1a73e8] border border-blue-200">
                              Drone Done • NSV Pending (5 Potholes)
                            </span>
                          )}
                          {isPending && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200">
                              NO Drone Survey Performed Yet
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-slate-700 truncate max-w-[200px]" title={survey.roadName}>
                          {survey.roadName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {survey.actionArea} • {isPending ? 'Pending Flight' : `Rut: ${survey.depthOfRut}mm`}
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRoadCode(survey.roadCode);
                          setSelectedPotholeId(undefined);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-[#1a73e8] hover:text-white border border-slate-300 text-slate-700 text-xs font-semibold rounded transition shadow-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
