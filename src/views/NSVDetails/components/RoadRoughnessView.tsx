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
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-900 via-slate-900 to-slate-900 text-white p-5 rounded-xl border border-red-800/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/30 text-red-200 border border-red-400/40">
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

        <div className="p-3 bg-red-950/80 rounded-lg border border-red-500/40 text-right font-mono text-xs">
          <span className="text-[10px] text-red-300 block uppercase">MEAN SEGMENT IRI</span>
          <span className="text-2xl font-black text-white">5.20 <span className="text-xs font-normal text-red-300">m/km</span></span>
          <span className="text-[10px] text-red-300 block font-semibold mt-0.5">Very Poor Band (&gt;5.0)</span>
        </div>
      </div>

      {/* 4.1 Roughness Measurements */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-1.5">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#1a73e8]" />
          <span>4.1 Longitudinal Roughness (IRI) Principles</span>
        </h4>
        <p className="text-slate-700 leading-relaxed">
          Road roughness is represented by the <strong>International Roughness Index (IRI)</strong>, expressed in metres per kilometre (m/km). A higher IRI indicates a rougher ride. The attached reference report classifies IRI greater than <strong>5.0 m/km</strong> as <strong>Very Poor / Very Rough</strong> and recommends reconstruction or strengthening as a typical action band. For this sample, the 120 m segment is assigned an average IRI of <strong>5.20 m/km</strong>.
        </p>
      </div>

      {/* 4.2 Sample IRI Result Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-[#1a73e8]" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4.2 Longitudinal Roughness (IRI) Survey Results
            </h4>
          </div>
          <span className="text-[11px] font-mono text-slate-500">120m Priority Resurfacing Segment</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <tbody className="divide-y divide-slate-100 text-[11px]">
              <tr className="hover:bg-slate-50">
                <td className="p-2.5 font-bold text-slate-700 bg-slate-50 w-1/3">Road</td>
                <td className="p-2.5 font-mono font-bold text-slate-900">NKDA Road MAR 1111</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Provisional segment chainage</td>
                <td className="p-2.5 font-mono text-slate-900">0+000 to 0+120</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Segment length</td>
                <td className="p-2.5 font-mono text-slate-900">120 m</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Left wheel path IRI (sample mean)</td>
                <td className="p-2.5 font-mono font-bold text-blue-700">5.10 m/km</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Right wheel path IRI (sample mean)</td>
                <td className="p-2.5 font-mono font-bold text-red-600">5.30 m/km</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-red-50/50">
                <td className="p-2.5 font-bold text-red-950 bg-red-100/50">Average segment IRI</td>
                <td className="p-2.5 font-mono font-black text-red-600 text-sm">5.20 m/km</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="p-2.5 font-bold text-slate-700 bg-slate-50">IRI classification</td>
                <td className="p-2.5 font-bold text-red-700">Very Poor / Very Rough (&gt;5.0 m/km)</td>
              </tr>
              <tr className="hover:bg-slate-50 bg-emerald-50/40">
                <td className="p-2.5 font-bold text-slate-700 bg-slate-50">Recommended action</td>
                <td className="p-2.5 font-semibold text-emerald-800">
                  Prioritize detailed pavement investigation and resurfacing / strengthening design (₹28.20 Lakhs)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4.3 Chainage-wise Interpretation & Visual IRI Profile Graph */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4.3 Chainage-wise Interpretation &amp; Differential Wheelpath Graph
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Six 20m Sample Intervals</span>
        </div>

        <p className="text-slate-700 leading-relaxed">
          The 120 m section is represented by six consecutive 20 m sample intervals. Each interval has a left wheel path IRI of <strong>5.10 m/km</strong> and a right wheel path IRI of <strong>5.30 m/km</strong>, giving an average lane IRI of <strong>5.20 m/km</strong>. This simplified profile is deliberately consistent across the segment and is not intended to mimic measured variability.
        </p>

        {/* Visual Graph Representation matching diagram */}
        <div className="p-5 bg-slate-900 rounded-xl text-white space-y-4 border border-slate-700">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">Illustrative IRI Profile – 120 m Segment</span>
            <div className="flex items-center gap-4 text-[11px] font-mono">
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
              <text x="25" y="24" fill="#94a3b8" fontSize="10" fontFamily="monospace">5.4</text>
              <text x="25" y="54" fill="#94a3b8" fontSize="10" fontFamily="monospace">5.2</text>
              <text x="25" y="84" fill="#f87171" fontSize="10" fontFamily="monospace" fontWeight="bold">5.0*</text>
              <text x="25" y="114" fill="#94a3b8" fontSize="10" fontFamily="monospace">4.8</text>
              <text x="25" y="144" fill="#94a3b8" fontSize="10" fontFamily="monospace">4.6</text>

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
              <text x="48" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">0m</text>
              <text x="145" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">20m</text>
              <text x="250" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">40m</text>
              <text x="354" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">60m</text>
              <text x="458" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">80m</text>
              <text x="555" y="155" fill="#94a3b8" fontSize="10" fontFamily="monospace">120m</text>
            </svg>
          </div>
        </div>
      </div>

      {/* 4.4 IRI Classification Matrix */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              4.4 Standard IRI Classification Matrix
            </h4>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Reference: MoRTH / IRC:SP:16-2019</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
              <tr>
                <th className="p-3 border-b border-slate-200">IRI Band (m/km)</th>
                <th className="p-3 border-b border-slate-200">Condition Classification</th>
                <th className="p-3 border-b border-slate-200">Ride Quality Experience</th>
                <th className="p-3 border-b border-slate-200">Corridor Application Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {iriClassification.map((c, i) => {
                const isCurrent = c.range === 'Greater than 5.0';
                return (
                  <tr key={i} className={isCurrent ? 'bg-red-50/80 font-bold' : 'hover:bg-slate-50'}>
                    <td className="p-3 font-mono font-bold text-slate-900">{c.range}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${c.badge}`}>
                        {c.condition}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-slate-800">{c.rideQuality}</td>
                    <td className="p-3">
                      {isCurrent ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 text-white font-mono text-[10px] font-black shadow-xs animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          <span>ACTIVE: NKDA Road MAR 1111 (5.20 m/km)</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px] font-mono">—</span>
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
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-blue-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Chainage-wise 20m Interval Roughness Schedule
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-500">6 Consecutive Intervals (Km 0+000 to Km 0+120)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
              <tr>
                <th className="p-2.5 border-b border-slate-200">Section</th>
                <th className="p-2.5 border-b border-slate-200">Start Ch.</th>
                <th className="p-2.5 border-b border-slate-200">End Ch.</th>
                <th className="p-2.5 border-b border-slate-200">Dir. / Lane</th>
                <th className="p-2.5 border-b border-slate-200">Left IRI</th>
                <th className="p-2.5 border-b border-slate-200">Right IRI</th>
                <th className="p-2.5 border-b border-slate-200">Avg IRI (m/km)</th>
                <th className="p-2.5 border-b border-slate-200">Speed</th>
                <th className="p-2.5 border-b border-slate-200">Band</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {iriIntervals.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-2.5 text-slate-700 font-sans font-semibold">NKDA-01</td>
                  <td className="p-2.5 text-slate-900 font-bold">{row.startCh}</td>
                  <td className="p-2.5 text-slate-900 font-bold">{row.endCh}</td>
                  <td className="p-2.5 text-slate-600 font-sans">{row.dir} / L{row.lane}</td>
                  <td className="p-2.5 text-blue-700 font-semibold">{row.leftIri}</td>
                  <td className="p-2.5 text-red-600 font-semibold">{row.rightIri}</td>
                  <td className="p-2.5 text-red-700 font-black">{row.avgIri}</td>
                  <td className="p-2.5 text-slate-500">{row.speed}</td>
                  <td className="p-2.5 font-sans">
                    <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold text-[10px]">
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
