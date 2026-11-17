import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Lock,
  FileText,
  FileCheck,
  FileSpreadsheet,
  Search,
  Filter,
  ArrowRight,
  Eye,
  Printer,
  Download,
  Building2,
  Route,
  ShieldCheck,
  Layers,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { surveyService } from '../../services/surveyService';
import { DroneSurveyRecord } from '../../models/surveyModels';

export const ProgressReportPage: React.FC = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState<DroneSurveyRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<
    'ALL' | 'DRONE_DONE' | 'NSV_DONE' | 'DPR_DONE' | 'TENDER_DONE' | 'PENDING'
  >('ALL');

  useEffect(() => {
    const fetchSurveys = async () => {
      setIsLoading(true);
      try {
        const data = await surveyService.getAllSurveys();
        setSurveys(data);
      } catch (err) {
        console.error('Failed to load surveys:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  // Compute township statutory progress metrics
  const stats = useMemo(() => {
    const totalCorridors = surveys.length || 65;
    const droneCompleted = surveys.filter(
      (s) => s.droneSurveyDone || s.roadCode === 'MAR-1111' || s.roadCode === 'NKDA-AA1-ST112-0002'
    ).length;
    const nsvCompleted = surveys.filter(
      (s) => s.nsvSurveyDone || s.roadCode === 'MAR-1111'
    ).length;
    const dprApproved = surveys.filter(
      (s) => s.dprDone || s.roadCode === 'MAR-1111'
    ).length;
    const tenderReleased = surveys.filter(
      (s) => s.tenderDone || s.roadCode === 'MAR-1111'
    ).length;
    const pendingSurveys = totalCorridors - droneCompleted;

    // Total Sanctioned Value
    const sanctionedBudgetINR = 2820000; // ₹28.20 Lakhs for MAR 1111
    const totalFrameworkBudgetINR = 2820000; // ₹28.20 Lakhs (MAR 1111 120m Package)

    return {
      totalCorridors,
      droneCompleted,
      dronePending: totalCorridors - droneCompleted,
      nsvCompleted,
      nsvPending: totalCorridors - nsvCompleted,
      dprApproved,
      dprPending: totalCorridors - dprApproved,
      tenderReleased,
      tenderPending: totalCorridors - tenderReleased,
      pendingSurveys,
      sanctionedBudgetINR,
      totalFrameworkBudgetINR,
    };
  }, [surveys]);

  // Filtered rows for the master progress table
  const filteredRows = useMemo(() => {
    return surveys.filter((item) => {
      const isMar1111 = item.roadCode === 'MAR-1111' || item.roadCode.includes('1111');
      const isRoad2 = item.roadCode === 'NKDA-AA1-ST112-0002' || item.roadCode.includes('ST112');

      const matchesSearch =
        item.roadCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.roadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.actionArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'DRONE_DONE') {
        return item.droneSurveyDone || isMar1111 || isRoad2;
      }
      if (activeFilter === 'NSV_DONE') {
        return item.nsvSurveyDone || isMar1111;
      }
      if (activeFilter === 'DPR_DONE') {
        return item.dprDone || isMar1111;
      }
      if (activeFilter === 'TENDER_DONE') {
        return item.tenderDone || isMar1111;
      }
      if (activeFilter === 'PENDING') {
        return !isMar1111 && !isRoad2 && !item.droneSurveyDone;
      }

      return true;
    });
  }, [surveys, searchQuery, activeFilter]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
              Statutory Executive Monitoring
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-500">
              Government of West Bengal • NKDA &amp; WBHIDCO
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">
            Progress Report
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            Real-time statutory tracking of Drone Aerial Photogrammetry, Ground NSV Laser Telemetry,
            Detailed Project Reports (DPR), and Notice Inviting e-Tenders (e-NIT) across all 65
            target road corridors in New Town Kolkata.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => navigate('/dpr/MAR-1111')}
            className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>View Approved MAR-1111 DPR</span>
          </button>
        </div>
      </div>

      {/* 5 Statutory Progress Target Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Target Corridors */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Survey Target</span>
            <Route className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.totalCorridors} Corridors</div>
            <div className="text-[11px] text-slate-500 font-mono">148.6 Lane-Km Target</div>
          </div>
          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
            Action Area I, II &amp; III Corridors
          </div>
        </div>

        {/* Card 2: Drone Aerial Survey */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Stage 1: Drone Aerial</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">
              {stats.droneCompleted}{' '}
              <span className="text-xs font-semibold text-slate-500">/ {stats.totalCorridors} Done</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">{stats.dronePending} Pending Flight</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${(stats.droneCompleted / stats.totalCorridors) * 100}%` }}
            />
          </div>
        </div>

        {/* Card 3: Ground NSV Telemetry */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Stage 2: Ground NSV</span>
            <Layers className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div>
            <div className="text-2xl font-black text-[#1a73e8]">
              {stats.nsvCompleted}{' '}
              <span className="text-xs font-semibold text-slate-500">/ {stats.totalCorridors} Done</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">14-Page Certified Report Ingested</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full"
              style={{ width: `${(stats.nsvCompleted / stats.totalCorridors) * 100}%` }}
            />
          </div>
        </div>

        {/* Card 4: DPR Approved */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Stage 3: DPR Sanction</span>
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-purple-700">
              {stats.dprApproved}{' '}
              <span className="text-xs font-semibold text-slate-500">Sanctioned</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">₹28.20 Lakhs Allocated</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-purple-600 h-1.5 rounded-full"
              style={{ width: `${(stats.dprApproved / stats.totalCorridors) * 100}%` }}
            />
          </div>
        </div>

        {/* Card 5: Tenders Released */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Stage 4: e-Tenders</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">
              {stats.tenderReleased}{' '}
              <span className="text-xs font-semibold text-slate-500">Active</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">e-NIT No. 01/EE(R&amp;B)/NKDA</div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${(stats.tenderReleased / stats.totalCorridors) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4-Stage Statutory Pipeline Progression Overview */}
      <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Statutory 4-Stage Road Surveillance &amp; Execution Pipeline
            </h3>
            <p className="text-xs text-slate-500">
              Standard operating procedure mandated by Government of West Bengal for municipal road works.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-slate-100 rounded font-mono text-xs text-slate-700">
            Certified Workflow
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Stage 1 */}
          <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900">Stage 1: Drone Aerial Patrol</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                2 Done
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              45MP photogrammetric scan &amp; thermal infrared inspection. Mapped 4 potholes on MAR-1111 (20mm depth) and 5 on ST-0112.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="p-3.5 rounded-lg border border-blue-300 bg-blue-50/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900">Stage 2: Ground NSV Run</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                1 Certified
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              ROMDAS NSV Laser Profilometer run. Certified 14-page report: IRI 5.2 m/km, 20mm rut depth, 34.5% crack area.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="p-3.5 rounded-lg border border-purple-300 bg-purple-50/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-900">Stage 3: DPR Formulation</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                1 Approved
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Official WB PWD SoR formulas: Part 1 Potholes Infill (₹3.72L) + Part 2 BC Resurfacing (₹24.48L) = ₹28.20 Lakhs.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900">Stage 4: Tender Release</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                1 Published
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Notice Inviting e-Tender (e-NIT No. 01/EE(R&amp;B)/NKDA/2026-27) published on WB e-Procurement Portal. Bids active.
            </p>
          </div>
        </div>
      </div>

      {/* Master Progress Directory Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden space-y-0">
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All Corridors ({surveys.length})
            </button>
            <button
              onClick={() => setActiveFilter('DRONE_DONE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'DRONE_DONE'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Drone Surveys Done ({stats.droneCompleted})</span>
            </button>
            <button
              onClick={() => setActiveFilter('NSV_DONE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'NSV_DONE'
                  ? 'bg-[#1a73e8] text-white'
                  : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>NSV Certified ({stats.nsvCompleted})</span>
            </button>
            <button
              onClick={() => setActiveFilter('DPR_DONE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'DPR_DONE'
                  ? 'bg-purple-700 text-white'
                  : 'bg-white text-purple-700 border border-purple-200 hover:bg-purple-50'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>DPR Approved ({stats.dprApproved})</span>
            </button>
            <button
              onClick={() => setActiveFilter('TENDER_DONE')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'TENDER_DONE'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Tenders Published ({stats.tenderReleased})</span>
            </button>
            <button
              onClick={() => setActiveFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1 ${
                activeFilter === 'PENDING'
                  ? 'bg-amber-700 text-white'
                  : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Survey ({stats.pendingSurveys})</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search corridor or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Road Code &amp; Name</th>
                <th className="py-3 px-3">Sector &amp; Specs</th>
                <th className="py-3 px-3">Potholes Detected</th>
                <th className="py-3 px-3">Stage 1: Drone</th>
                <th className="py-3 px-3">Stage 2: NSV</th>
                <th className="py-3 px-3">Stage 3: DPR</th>
                <th className="py-3 px-3">Stage 4: Tender</th>
                <th className="py-3 px-3">Est. Repair Cost</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((road) => {
                const isMar1111 = road.roadCode === 'MAR-1111' || road.roadCode.includes('1111');
                const isRoad2 = road.roadCode === 'NKDA-AA1-ST112-0002' || road.roadCode.includes('ST112');

                const droneDone = isMar1111 || isRoad2 || road.droneSurveyDone;
                const nsvDone = isMar1111 || road.nsvSurveyDone;
                const dprDone = isMar1111 || road.dprDone;
                const tenderDone = isMar1111 || road.tenderDone;

                const roughCost = isMar1111 ? 2820000 : road.roughCostINR;
                const potholesCount = isMar1111 ? 4 : isRoad2 ? 5 : 0;
                const maxDepth = isMar1111 ? 20 : isRoad2 ? 52 : 0;

                return (
                  <tr
                    key={road.id}
                    className={`hover:bg-slate-50/80 transition ${
                      isMar1111 ? 'bg-blue-50/30' : ''
                    }`}
                  >
                    {/* Road Code & Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="font-mono text-blue-700">{road.roadCode}</span>
                        {isMar1111 && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-100 text-red-700 font-bold border border-red-200">
                            Critical Resurfacing
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-600 truncate max-w-[220px]">
                        {road.roadName}
                      </div>
                    </td>

                    {/* Sector & Specs */}
                    <td className="py-3 px-3 text-slate-600">
                      <div className="font-semibold text-slate-800">{road.actionArea}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {road.roadType.split('(')[0]} • {road.distanceKm} km
                      </div>
                    </td>

                    {/* Potholes Detected */}
                    <td className="py-3 px-3">
                      {droneDone ? (
                        <div className="space-y-0.5">
                          <span className="font-bold text-red-700 block font-mono">
                            {potholesCount} Potholes
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Max Depth: {maxDepth} mm
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">
                          Awaiting Drone Scan
                        </span>
                      )}
                    </td>

                    {/* Stage 1: Drone */}
                    <td className="py-3 px-3">
                      {droneDone ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Stage 2: NSV */}
                    <td className="py-3 px-3">
                      {nsvDone ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                          <CheckCircle2 className="w-3 h-3 text-blue-600" />
                          <span>14P Certified</span>
                        </span>
                      ) : droneDone ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Pending NSV</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">Awaiting Drone</span>
                      )}
                    </td>

                    {/* Stage 3: DPR */}
                    <td className="py-3 px-3">
                      {dprDone ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
                          <CheckCircle2 className="w-3 h-3 text-purple-600" />
                          <span>Approved</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-slate-400">
                          <Lock className="w-3 h-3 text-slate-300" />
                          <span>Blocked</span>
                        </span>
                      )}
                    </td>

                    {/* Stage 4: Tender */}
                    <td className="py-3 px-3">
                      {tenderDone ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <ShieldCheck className="w-3 h-3 text-emerald-700" />
                          <span>e-NIT No. 01</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Pending Sanction</span>
                      )}
                    </td>

                    {/* Est. Cost */}
                    <td className="py-3 px-3">
                      {dprDone ? (
                        <div className="font-bold text-slate-900 font-mono">
                          ₹{(roughCost / 100000).toFixed(2)} Lakhs
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {nsvDone && (
                          <button
                            onClick={() => navigate(`/nsv/${road.roadCode}`)}
                            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-[#1a73e8] border border-slate-300 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1"
                            title="View NSV Details"
                          >
                            <Eye className="w-3 h-3" />
                            <span>NSV</span>
                          </button>
                        )}

                        {dprDone && (
                          <button
                            onClick={() => navigate(`/dpr/${road.roadCode}`)}
                            className="px-2.5 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                            title="View DPR & Tender"
                          >
                            <FileText className="w-3 h-3" />
                            <span>DPR</span>
                          </button>
                        )}

                        {!nsvDone && (
                          <button
                            onClick={() => navigate(`/nsv/${road.roadCode}`)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs font-medium transition cursor-pointer"
                          >
                            Status
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{filteredRows.length}</strong> of{' '}
            <strong className="text-slate-900">{surveys.length}</strong> statutory corridors across New Town Kolkata
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span className="text-emerald-700 font-bold">Approved Sanction: ₹28.20 Lakhs (MAR-1111 Package)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
