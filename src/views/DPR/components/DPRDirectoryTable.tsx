import React, { useState } from 'react';
import { DPRRecord } from '../../../models/dprModels';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  Building,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Send,
  Lock,
} from 'lucide-react';

interface DPRDirectoryTableProps {
  dprList: DPRRecord[];
  onSelectRoad: (roadCode: string) => void;
  onReleaseTender: (roadCode: string) => void;
  onViewTender: (dpr: DPRRecord) => void;
}

export const DPRDirectoryTable: React.FC<DPRDirectoryTableProps> = ({
  dprList,
  onSelectRoad,
  onReleaseTender,
  onViewTender,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'critical' | 'approved' | 'tender'>('all');

  // Find premier road MAR-1111
  const mar1111 = dprList.find((d) => d.roadCode === 'MAR-1111') || dprList[0];

  // Filtering
  const filteredList = dprList.filter((item) => {
    const matchesSearch =
      item.roadCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.roadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dprNumber.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'critical') {
      return item.condition === 'Critical';
    }
    if (filterTab === 'approved') {
      return item.reviews.every((r) => r.status === 'Approved');
    }
    if (filterTab === 'tender') {
      return item.tender && item.tender.tenderStatus === 'Published';
    }

    return true;
  });

  // Summary Metrics
  const totalApproved = dprList.filter((d) => d.reviews.every((r) => r.status === 'Approved')).length;
  const totalTenders = dprList.filter((d) => d.tender && d.tender.tenderStatus === 'Published').length;
  const totalBudget = dprList.reduce((acc, d) => acc + d.estimatedCostINR, 0);

  return (
    <div className="space-y-6">
      {/* Top Statistical KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Registered DPRs</span>
            <FileText className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">{dprList.length} Corridors</div>
          <span className="text-[11px] text-slate-500">NKDA Action Areas I, II, III</span>
        </div>

        <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Approved Sanctions</span>
            <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
          </div>
          <div className="text-xl font-extrabold text-[#137333] mt-1">{totalApproved} Approved</div>
          <span className="text-[11px] text-emerald-700">3-Stage statutory vetted</span>
        </div>

        <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-800">Tenders Published</span>
            <Sparkles className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div className="text-xl font-extrabold text-[#1a73e8] mt-1">{totalTenders} Live NIT</div>
          <span className="text-[11px] text-blue-700">On wbtenders.gov.in</span>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-lg shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Sanctioned Value</span>
            <TrendingUp className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1">₹{(totalBudget / 100000).toFixed(1)} Lakhs</div>
          <span className="text-[11px] text-slate-500">SoR 2022-2025 rates</span>
        </div>
      </div>

      {/* Premier Corridor Feature Card: MAR-1111 */}
      {mar1111 && (
        <div className="p-5 bg-gradient-to-r from-blue-900 via-slate-900 to-slate-800 text-white rounded-xl shadow-md border border-slate-700 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-700/80 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ea4335] text-white flex items-center gap-1 shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Premier Critical Corridor</span>
              </span>
              <span className="text-xs text-slate-300 font-mono font-bold">{mar1111.roadCode}</span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-emerald-400 font-semibold">{mar1111.dprNumber}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Statutory Status: Approved (3 of 3 Reviews Complete)</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
            {/* Left 2 Cols: Details */}
            <div className="lg:col-span-2 space-y-3">
              <div>
                <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>{mar1111.roadName}</span>
                </h3>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ea4335]" />
                  <span>{mar1111.location} • Chainage {mar1111.chainage} • Length: {mar1111.roadLengthKm} km</span>
                </p>
              </div>

              {/* Verified Potholes & Distress Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-slate-800/80 border border-slate-700 rounded-lg">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Identified Potholes</div>
                  <div className="text-sm font-bold text-[#ea4335] mt-0.5">4 Verified Defects</div>
                </div>
                <div className="p-2 bg-slate-800/80 border border-slate-700 rounded-lg">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Avg Rut Depth</div>
                  <div className="text-sm font-bold text-[#ea4335] mt-0.5">{mar1111.maxRutDepthMm} mm (Severe)</div>
                </div>
                <div className="p-2 bg-slate-800/80 border border-slate-700 rounded-lg">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Affected Distress Area</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">{mar1111.distressAreaM2} m²</div>
                </div>
                <div className="p-2 bg-slate-800/80 border border-slate-700 rounded-lg">
                  <div className="text-[10px] uppercase text-slate-400 font-semibold">Estimated DPR Cost</div>
                  <div className="text-sm font-bold text-emerald-400 mt-0.5">₹{mar1111.estimatedCostINR.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Review Signatories Pill Bar */}
              <div className="p-2.5 bg-slate-800/50 border border-slate-700 rounded-lg space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Approved Competent Signatories:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-[11px] text-slate-300">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Tech: Er. Subhashis Sen (WBHIDCO)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Fin: Shri Partha Mukherjee (NKDA)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Admin: Dr. Debashis Sen (CEO)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Tender Actions */}
            <div className="lg:col-span-1 bg-slate-800/90 border border-slate-700 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">e-Procurement Status</span>
                  {mar1111.tender?.tenderStatus === 'Published' ? (
                    <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-600/50 px-2 py-0.5 rounded">
                      NIT LIVE
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-blue-300 bg-blue-950/80 border border-blue-600/50 px-2 py-0.5 rounded">
                      TENDER READY
                    </span>
                  )}
                </div>

                <div className="mt-2 text-xs text-slate-300">
                  {mar1111.tender?.tenderStatus === 'Published' ? (
                    <div className="space-y-1">
                      <div className="font-mono font-bold text-emerald-400">{mar1111.tender.nitNumber}</div>
                      <div className="text-[11px] text-slate-400">Published: {mar1111.tender.releasedAt}</div>
                      <div className="text-[11px] text-slate-400">Portal: wbtenders.gov.in</div>
                    </div>
                  ) : (
                    <p className="leading-relaxed">
                      All 3 statutory approvals received. The official Notice Inviting Tender is ready for public release on the West Bengal e-Procurement Portal.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                {mar1111.tender?.tenderStatus !== 'Published' ? (
                  <button
                    onClick={() => onReleaseTender(mar1111.roadCode)}
                    className="w-full py-2 px-3 bg-[#34a853] hover:bg-[#2d9247] text-white text-xs font-bold rounded-lg shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Release Official Tender Document</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewTender(mar1111)}
                      className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-slate-600 transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Published NIT</span>
                    </button>
                    <button
                      onClick={() => onReleaseTender(mar1111.roadCode)}
                      title="Re-publish / sync tender notice"
                      className="py-2 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => onSelectRoad(mar1111.roadCode)}
                  className="w-full py-2 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Open Official DPR Document (WB PWD Format)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Directory Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#1a73e8]" />
              <span>DPR Master Register: New Town Kolkata Road Corridors</span>
            </h3>
            <p className="text-xs text-slate-500">
              Autonomous AI Survey & NSV-backed Detailed Project Reports for Municipal Sanction & Procurement
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setFilterTab('all')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${filterTab === 'all' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'hover:text-slate-900'}`}
              >
                All ({dprList.length})
              </button>
              <button
                onClick={() => setFilterTab('critical')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${filterTab === 'critical' ? 'bg-white text-red-700 font-bold shadow-xs' : 'hover:text-slate-900'}`}
              >
                Critical
              </button>
              <button
                onClick={() => setFilterTab('approved')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${filterTab === 'approved' ? 'bg-white text-emerald-700 font-bold shadow-xs' : 'hover:text-slate-900'}`}
              >
                Approved ({totalApproved})
              </button>
              <button
                onClick={() => setFilterTab('tender')}
                className={`px-2.5 py-1 rounded-md transition cursor-pointer ${filterTab === 'tender' ? 'bg-white text-blue-700 font-bold shadow-xs' : 'hover:text-slate-900'}`}
              >
                Tender Released ({totalTenders})
              </button>
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search road code, DPR, name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* The Master Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="p-3">Corridor & DPR No.</th>
                <th className="p-3">Location & Chainage</th>
                <th className="p-3">Distress & Potholes</th>
                <th className="p-3 text-right">Estimated Cost (INR)</th>
                <th className="p-3 text-center">Review Sanction</th>
                <th className="p-3 text-center">Tender Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredList.map((row) => {
                const isCritical = row.condition === 'Critical';
                const isApproved = row.reviews.every((r) => r.status === 'Approved');
                const isPublished = row.tender?.tenderStatus === 'Published';
                const isHighlight = row.roadCode === 'MAR-1111';

                return (
                  <tr
                    key={row.roadCode}
                    className={`transition hover:bg-slate-50/80 ${isHighlight ? 'bg-blue-50/40 font-medium' : ''}`}
                  >
                    {/* Corridor & DPR No. */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {isHighlight && (
                          <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" title="Focus Corridor" />
                        )}
                        <span className="font-mono font-bold text-slate-900">{row.roadCode}</span>
                        {isCritical && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-[#c5221f]">
                            Critical
                          </span>
                        )}
                      </div>
                      <div className="font-semibold text-slate-800 text-[11px] mt-0.5 line-clamp-1">{row.roadName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{row.dprNumber}</div>
                    </td>

                    {/* Location & Chainage */}
                    <td className="p-3">
                      <div className="text-slate-800 font-medium">{row.location}</div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{row.chainage}</div>
                      <div className="text-[10px] text-slate-400">{row.roadLengthKm} km • {row.carriagewayWidthMeters}m dual</div>
                    </td>

                    {/* Distress & Potholes */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${isCritical ? 'text-[#c5221f]' : 'text-slate-800'}`}>
                          {row.maxRutDepthMm} mm Rut
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-slate-600">{row.distressAreaM2} m² area</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        IRI: {row.avgIRI} m/km • Score: {row.goodnessScore}/100
                      </div>
                    </td>

                    {/* Estimated Cost */}
                    <td className="p-3 text-right">
                      <div className="font-mono font-bold text-sm text-[#137333]">
                        ₹{row.estimatedCostINR.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{row.contractorClassRequired.split(' ')[0]}</div>
                    </td>

                    {/* Review Status */}
                    <td className="p-3 text-center">
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#137333] border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34a853]" />
                          <span>Approved (3/3)</span>
                        </span>
                      ) : row.hasDroneSurvey && !row.hasNsvSurvey ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-[#b06000] border border-amber-200" title="Drone survey done, but NSV roughness survey has not been performed yet">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>NSV Survey Pending</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200" title="No drone survey performed yet">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>Drone Survey Pending</span>
                        </span>
                      )}
                    </td>

                    {/* Tender Status */}
                    <td className="p-3 text-center">
                      {isPublished ? (
                        <button
                          onClick={() => onViewTender(row)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1a73e8] border border-blue-200 hover:bg-blue-100 transition cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
                          <span>NIT Published</span>
                        </button>
                      ) : row.hasDroneSurvey && !row.hasNsvSurvey ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200" title="Tender blocked: Requires NSV laser roughness survey">
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Tender Blocked (No NSV)</span>
                        </span>
                      ) : isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50/80 text-emerald-800 border border-emerald-200">
                          <span>Tender Ready</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500" title="Tender blocked: Requires initial drone survey">
                          <Lock className="w-3 h-3 text-slate-400" />
                          <span>Tender Blocked (No Drone)</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Release Tender Button if Approved & not published */}
                        {isApproved && !isPublished && (
                          <button
                            onClick={() => onReleaseTender(row.roadCode)}
                            title="Release and publish official Notice Inviting Tender to wbtenders.gov.in"
                            className="px-2.5 py-1 bg-[#34a853] hover:bg-[#2d9247] text-white text-xs font-bold rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Release Tender</span>
                          </button>
                        )}

                        {/* View Official DPR Document or Status */}
                        {row.isBlocked ? (
                          <button
                            onClick={() => onSelectRoad(row.roadCode)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
                            title="View prerequisite status checklist"
                          >
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                            <span>Check Status</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onSelectRoad(row.roadCode)}
                            className="px-2.5 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded shadow-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>View DPR</span>
                          </button>
                        )}

                        {/* Quick View NSV Details */}
                        <button
                          onClick={() => navigate(`/nsv/${row.roadCode}`)}
                          title="Open NSV Details for this road"
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
