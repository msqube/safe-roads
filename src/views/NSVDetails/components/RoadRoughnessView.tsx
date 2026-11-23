import React from 'react';
import {
  Gauge,
  Activity,
  AlertTriangle,
  TrendingUp,
  Table,
  CheckCircle2,
  Sliders,
  FileCheck,
  BarChart3,
} from 'lucide-react';
import { NSVRoadDetails } from '../../../models/nsvModels';

interface RoadRoughnessViewProps {
  details: NSVRoadDetails;
}

export const RoadRoughnessView: React.FC<RoadRoughnessViewProps> = ({ details }) => {
  const iriIntervals = [
    { startCh: '0+000', endCh: '0+020', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor' },
    { startCh: '0+020', endCh: '0+040', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor' },
    { startCh: '0+040', endCh: '0+060', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor' },
    { startCh: '0+060', endCh: '0+080', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor' },
    { startCh: '0+080', endCh: '0+100', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor' },
    { startCh: '0+100', endCh: '0+120', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor' },
  ];

  const iriClassification = [
    { range: 'Less than 2.0', condition: 'Excellent', rideQuality: 'Very smooth', color: 'bg-emerald-50 text-emerald-800 border-emerald-300', badge: 'bg-emerald-100 text-emerald-700' },
    { range: '2.0 – 3.0', condition: 'Good', rideQuality: 'Smooth', color: 'bg-blue-50 text-blue-800 border-blue-300', badge: 'bg-blue-100 text-blue-700' },
    { range: '3.0 – 4.0', condition: 'Fair', rideQuality: 'Acceptable', color: 'bg-amber-50 text-amber-900 border-amber-300', badge: 'bg-amber-100 text-amber-800' },
    { range: '4.0 – 5.0', condition: 'Poor', rideQuality: 'Rough', color: 'bg-orange-50 text-orange-900 border-orange-300', badge: 'bg-orange-100 text-orange-800' },
    { range: 'Greater than 5.0', condition: 'Very Poor', rideQuality: 'Very rough', color: 'bg-red-50 text-red-950 border-red-300 ring-2 ring-red-400', badge: 'bg-red-600 text-white font-black' },
  ];

  return (
    <div className="space-y-4 text-xs text-slate-800">
      {/* Header Banner - Standard Padding p-4 */}
      <div className="bg-gradient-to-r from-red-900 via-slate-900 to-slate-900 text-white p-4 rounded-xl border border-red-800/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/30 text-red-200 border border-red-400/40 tabular-nums">
              LASER PROFILOMETER TELEMETRY
            </span>
            <span className="text-xs font-mono text-slate-300">
              SECTION – 4: ROAD ROUGHNESS DATA
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            International Roughness Index (IRI) &amp; Riding Quality Assessment
          </h3>
          <p className="text-xs text-slate-300">
            Chainage-wise laser profilometer roughness distribution for <strong>NKDA Road MAR 1111 (0+000 to 0+120)</strong>.
          </p>
        </div>

        <div className="p-3 bg-red-950/80 rounded-xl border border-red-500/40 text-right text-xs">
          <span className="text-[10px] text-red-300 block uppercase font-medium">MEAN SEGMENT IRI</span>
          <span className="text-2xl font-bold tabular-nums text-white">5.20 <span className="text-sm font-normal text-red-300">m/km</span></span>
          <span className="text-[10px] text-red-300 block font-semibold mt-0.5">Very Poor Band (&gt;5.0)</span>
        </div>
      </div>

      {/* 4.1 Roughness Measurements */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#1a73e8]" />
          <span>4.1 Longitudinal Roughness (IRI) Principles</span>
        </h4>
        <p className="text-slate-700 leading-relaxed">
          Road roughness is represented by the <strong>International Roughness Index (IRI)</strong>, expressed in metres per kilometre (m/km). A higher IRI indicates a rougher ride. The attached reference report classifies IRI greater than <strong>5.0 m/km</strong> as <strong>Very Poor / Very Rough</strong> and recommends reconstruction or strengthening as a typical action band. For this sample, the 120 m segment is assigned an average IRI of <strong>5.20 m/km</strong>.
        </p>
      </div>

      {/* 4.2 Sample IRI Result Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-[#1a73e8]" />
            <h4 className="text-sm font-bold text-slate-900">
              4.2 Longitudinal Roughness (IRI) Survey Results
            </h4>
          </div>
          <span className="text-xs text-slate-500">120m Priority Resurfacing Segment</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-fixed w-full text-left border-collapse text-xs">
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="w-1/3 px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Road</td>
                <td className="w-2/3 px-4 py-3 align-middle font-bold text-slate-900">NKDA Road MAR 1111</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Provisional segment chainage</td>
                <td className="px-4 py-3 align-middle tabular-nums text-slate-900">0+000 to 0+120</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Segment length</td>
                <td className="px-4 py-3 align-middle tabular-nums text-slate-900">120 m</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Left wheel path IRI (sample mean)</td>
                <td className="px-4 py-3 align-middle font-bold tabular-nums text-blue-700">5.10 m/km</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Right wheel path IRI (sample mean)</td>
                <td className="px-4 py-3 align-middle font-bold tabular-nums text-red-600">5.30 m/km</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors bg-red-50/50">
                <td className="px-4 py-3 align-middle font-bold text-red-950 bg-red-100/50">Average segment IRI</td>
                <td className="px-4 py-3 align-middle font-bold tabular-nums text-red-600 text-sm">5.20 m/km</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">IRI classification</td>
                <td className="px-4 py-3 align-middle font-bold text-red-700">Very Poor / Very Rough (&gt;5.0 m/km)</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors bg-emerald-50/40">
                <td className="px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Recommended action</td>
                <td className="px-4 py-3 align-middle font-semibold text-emerald-800">
                  Prioritize detailed pavement investigation and resurfacing / strengthening design (₹28.20 Lakhs)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4.3 Chainage-wise Interpretation & Visual IRI Profile Graph */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">
              4.3 Chainage-wise Interpretation &amp; Differential Wheelpath Graph
            </h4>
          </div>
          <span className="text-xs text-slate-500">Six 20m Sample Intervals</span>
        </div>

        <p className="text-slate-700 leading-relaxed">
          The 120 m section is represented by six consecutive 20 m sample intervals. Each interval has a left wheel path IRI of <strong>5.10 m/km</strong> and a right wheel path IRI of <strong>5.30 m/km</strong>, giving an average lane IRI of <strong>5.20 m/km</strong>. This simplified profile is deliberately consistent across the segment and is not intended to mimic measured variability.
        </p>

        {/* Visual Graph Representation matching diagram */}
        <div className="p-4 bg-slate-900 rounded-xl text-white space-y-4 border border-slate-700">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">Illustrative IRI Profile – 120 m Segment</span>
            <div className="flex items-center gap-4 text-[11px] tabular-nums">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-blue-400 rounded-full" />
                <span className="text-blue-300">Blue: Left Wheel Path 5.10 m/km</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-1 bg-red-400 rounded-full" />
                <span className="text-red-300">Red: Right Wheel Path 5.30 m/km</span>
              </div>
            </div>
          </div>

          {/* SVG Profile Chart */}
          <div className="relative h-44 w-full">
            <svg className="w-full h-full" viewBox="0 0 600 160" preserveAspectRatio="none">
              {/* Horizontal Gridlines */}
              <line x1="50" y1="20" x2="570" y2="20" stroke="#334155" strokeDasharray="3 3" />
              <line x1="50" y1="50" x2="570" y2="50" stroke="#334155" strokeDasharray="3 3" />
              <line x1="50" y1="80" x2="570" y2="80" stroke="#334155" strokeDasharray="3 3" />
              <line x1="50" y1="110" x2="570" y2="110" stroke="#334155" strokeDasharray="3 3" />
              <line x1="50" y1="140" x2="570" y2="140" stroke="#475569" strokeWidth="1.5" />

              {/* Y-Axis Labels */}
              <text x="25" y="24" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">5.4</text>
              <text x="25" y="54" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">5.2</text>
              <text x="25" y="84" fill="#f87171" fontSize="10" fontFamily="sans-serif" fontWeight="bold">5.0*</text>
              <text x="25" y="114" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">4.8</text>
              <text x="25" y="144" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">4.6</text>

              {/* Critical Threshold 5.0 Line */}
              <line x1="50" y1="80" x2="570" y2="80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
              <text x="460" y="74" fill="#fca5a5" fontSize="9" fontFamily="sans-serif">Threshold (&gt;5.0 Very Poor)</text>

              {/* Red Line: Right Wheel Path 5.30 m/km (y = 35) */}
              <line x1="50" y1="35" x2="570" y2="35" stroke="#ef4444" strokeWidth="3" />
              <circle cx="50" cy="35" r="4" fill="#ef4444" />
              <circle cx="154" cy="35" r="4" fill="#ef4444" />
              <circle cx="258" cy="35" r="4" fill="#ef4444" />
              <circle cx="362" cy="35" r="4" fill="#ef4444" />
              <circle cx="466" cy="35" r="4" fill="#ef4444" />
              <circle cx="570" cy="35" r="4" fill="#ef4444" />

              {/* Blue Line: Left Wheel Path 5.10 m/km (y = 65) */}
              <line x1="50" y1="65" x2="570" y2="65" stroke="#3b82f6" strokeWidth="3" />
              <circle cx="50" cy="65" r="4" fill="#3b82f6" />
              <circle cx="154" cy="65" r="4" fill="#3b82f6" />
              <circle cx="258" cy="65" r="4" fill="#3b82f6" />
              <circle cx="362" cy="65" r="4" fill="#3b82f6" />
              <circle cx="466" cy="65" r="4" fill="#3b82f6" />
              <circle cx="570" cy="65" r="4" fill="#3b82f6" />

              {/* X-Axis Ticks & Labels */}
              <text x="48" y="155" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">0m</text>
              <text x="145" y="155" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">20m</text>
              <text x="250" y="155" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">40m</text>
              <text x="354" y="155" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">60m</text>
              <text x="458" y="155" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">80m</text>
              <text x="555" y="155" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">120m</text>
            </svg>
          </div>
        </div>
      </div>

      {/* 4.4 IRI Classification Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-bold text-slate-900">
              4.4 Standard IRI Classification Matrix
            </h4>
          </div>
          <span className="text-xs text-slate-500">Reference: MoRTH / IRC:SP:16-2019</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-fixed w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="w-[20%] px-4 py-3 align-middle">IRI Band (m/km)</th>
                <th className="w-[22%] px-4 py-3 align-middle">Condition Classification</th>
                <th className="w-[26%] px-4 py-3 align-middle">Ride Quality Experience</th>
                <th className="w-[32%] px-4 py-3 align-middle">Corridor Application Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {iriClassification.map((c, i) => {
                const isCurrent = c.range === 'Greater than 5.0';
                return (
                  <tr key={i} className={isCurrent ? 'bg-red-50/80 font-bold' : 'hover:bg-slate-50 transition-colors'}>
                    <td className="px-4 py-3 align-middle tabular-nums font-bold text-slate-900">{c.range}</td>
                    <td className="px-4 py-3 align-middle">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${c.badge}`}>
                        {c.condition}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle font-medium text-slate-800">{c.rideQuality}</td>
                    <td className="px-4 py-3 align-middle">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow-sm animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          <span>ACTIVE: NKDA Road MAR 1111 (5.20 m/km)</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Chainage-Wise Roughness Schedule */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Chainage-wise 20m Interval Roughness Schedule
            </h4>
          </div>
          <span className="text-xs text-slate-500">6 Consecutive Intervals (Km 0+000 to Km 0+120)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-fixed w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="w-[10%] px-4 py-3 align-middle">Section</th>
                <th className="w-[11%] px-4 py-3 align-middle">Start Ch.</th>
                <th className="w-[11%] px-4 py-3 align-middle">End Ch.</th>
                <th className="w-[13%] px-4 py-3 align-middle">Dir. / Lane</th>
                <th className="w-[11%] px-4 py-3 align-middle">Left IRI</th>
                <th className="w-[11%] px-4 py-3 align-middle">Right IRI</th>
                <th className="w-[13%] px-4 py-3 align-middle">Avg IRI (m/km)</th>
                <th className="w-[9%] px-4 py-3 align-middle">Speed</th>
                <th className="w-[11%] px-4 py-3 align-middle">Band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {iriIntervals.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-middle text-slate-700 font-semibold">NKDA-01</td>
                  <td className="px-4 py-3 align-middle text-slate-900 font-bold tabular-nums">{row.startCh}</td>
                  <td className="px-4 py-3 align-middle text-slate-900 font-bold tabular-nums">{row.endCh}</td>
                  <td className="px-4 py-3 align-middle text-slate-600">{row.dir} / L{row.lane}</td>
                  <td className="px-4 py-3 align-middle text-blue-700 font-semibold tabular-nums">{row.leftIri}</td>
                  <td className="px-4 py-3 align-middle text-red-600 font-semibold tabular-nums">{row.rightIri}</td>
                  <td className="px-4 py-3 align-middle text-red-700 font-bold tabular-nums">{row.avgIri}</td>
                  <td className="px-4 py-3 align-middle text-slate-500 tabular-nums">{row.speed}</td>
                  <td className="px-4 py-3 align-middle">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold text-[11px]">
                      {row.band}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
