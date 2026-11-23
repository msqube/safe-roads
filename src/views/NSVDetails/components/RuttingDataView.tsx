import React from 'react';
import {
  TrendingDown,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Compass,
  FileCheck,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { NSVRoadDetails } from '../../../models/nsvModels';

interface RuttingDataViewProps {
  details: NSVRoadDetails;
}

export const RuttingDataView: React.FC<RuttingDataViewProps> = ({ details }) => {
  const ruttingSheet = [
    { startCh: '0+000', endCh: '0+020', leftRut: '20 mm', rightRut: '20 mm', avgRut: '20 mm', maxRut: '20 mm', remarks: 'Outer wheelpath severe rutting deformation' },
    { startCh: '0+020', endCh: '0+040', leftRut: '20 mm', rightRut: '20 mm', avgRut: '20 mm', maxRut: '20 mm', remarks: 'Sub-surface layer compaction fatigue' },
    { startCh: '0+040', endCh: '0+060', leftRut: '20 mm', rightRut: '20 mm', avgRut: '20 mm', maxRut: '20 mm', remarks: 'Wheelpath depression under heavy commercial vehicles' },
    { startCh: '0+060', endCh: '0+080', leftRut: '20 mm', rightRut: '20 mm', avgRut: '20 mm', maxRut: '20 mm', remarks: 'Requires 40mm continuous cold milling' },
    { startCh: '0+080', endCh: '0+100', leftRut: '20 mm', rightRut: '20 mm', avgRut: '20 mm', maxRut: '20 mm', remarks: 'Permanent pavement shear deformation' },
    { startCh: '0+100', endCh: '0+120', leftRut: '20 mm', rightRut: '20 mm', avgRut: '20 mm', maxRut: '20 mm', remarks: 'End of 120m priority resurfacing segment' },
  ];

  const inventorySummary = [
    { param: 'Road name / asset ID', value: 'NKDA Road MAR 1111 (Biswa Bangla Sarani)', status: 'Verified' },
    { param: 'Road functional classification', value: 'Urban road (Divided 6-Lane Major Arterial)', status: 'Approved' },
    { param: 'Carriageway configuration / lane count', value: 'Dual carriageway, 3 lanes per direction (6 lanes total)', status: 'Documented' },
    { param: 'Carriageway width', value: '10.5 meters (3 × 3.5m lanes per carriageway)', status: 'Standard Spec' },
    { param: 'Pavement type', value: 'Flexible bituminous pavement (40mm BC + 50mm DBM + 250mm WMM + 200mm GSB)', status: 'Certified' },
    { param: 'Median / shoulder', value: '2.0m raised central median with concrete crash curbs', status: 'In Place' },
    { param: 'Drainage arrangement', value: 'Sub-surface reinforced concrete box drains along shoulders', status: 'Operational' },
    { param: 'Horizontal / vertical alignment', value: 'Straight tangent section with 0.5% longitudinal grade', status: 'Surveyed' },
    { param: 'Road marking / signage / lighting', value: 'Retro-reflective thermoplastic markings & smart LED poles', status: 'Documented' },
  ];

  const checklistItems = [
    { id: 1, req: 'Confirm road name, limits, start/end chainage and direction', status: 'Completed', details: 'NKDA Road MAR 1111, Ch: 0+000 to 0+120 (Lane 1)' },
    { id: 2, req: 'Record carriageway width, lane configuration and pavement type', status: 'Completed', details: '10.5m dual carriageway, flexible bituminous crust' },
    { id: 3, req: 'Capture four pothole locations, dimensions, depths and geotagged photographs', status: 'Completed', details: 'PH-01 to PH-04 (20mm depth, 20 sq ft, 0.0372 m³ void)' },
    { id: 4, req: 'Conduct calibrated NSV laser profiling and obtain actual IRI', status: 'Completed', details: 'Mean IRI 5.20 m/km (ASTM E950 Class-1 certified)' },
    { id: 5, req: 'Measure rut depth and map other pavement distresses', status: 'Completed', details: 'Transverse rut depth: Avg 20 mm along outer wheelpath' },
    { id: 6, req: 'Inventory drainage, shoulders, road furniture, utilities and structures', status: 'Verified', details: '120m corridor drainage continuity checked' },
    { id: 7, req: 'Confirm GPS datum, survey date, speed, equipment and calibration', status: 'Completed', details: 'WGS-84, 16 Nov 2026, 40 km/h calibration run' },
    { id: 8, req: 'Obtain engineer approval of resurfacing treatment and limits', status: 'Approved', details: 'Executive Engineer (NKDA) certified for DPR Release' },
  ];

  return (
    <div className="space-y-4 text-xs text-slate-800">
      {/* Header Banner - Standard Padding p-4 */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white p-4 rounded-xl border border-amber-800/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-200 border border-amber-400/40 tabular-nums">
              TRANSVERSE RUTTING ANALYSIS
            </span>
            <span className="text-xs font-mono text-slate-300">
              SECTION – 5: RUTTING DATA
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Transverse Rutting Data, Field Sheets &amp; Road Inventory
          </h3>
          <p className="text-xs text-slate-300">
            Wheelpath transverse depression profiles, cross-slope deviations and inventory records for <strong>NKDA Road MAR 1111</strong>.
          </p>
        </div>

        <div className="p-3 bg-amber-950/80 rounded-xl border border-amber-500/40 text-right text-xs">
          <span className="text-[10px] text-amber-300 block uppercase font-medium">AVG RUT DEPTH</span>
          <span className="text-2xl font-bold tabular-nums text-amber-400">20 <span className="text-sm font-normal text-amber-300">mm</span></span>
          <span className="text-[10px] text-amber-300 block font-semibold mt-0.5">Cold Milling Required</span>
        </div>
      </div>

      {/* 5.1 Rutting Assessment */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            5.1 Transverse Rutting Assessment &amp; Profiling
          </h4>
        </div>
        <p className="text-slate-700 leading-relaxed">
          Rutting is a longitudinal depression within wheel paths caused by permanent deformation of pavement layers. The reference NSV report describes transverse laser profiling as the measurement approach. The assessed average rut depth along the outer commercial vehicle wheelpath is <strong>20 mm</strong>, requiring mechanized cold milling prior to resurfacing.
        </p>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="table-fixed w-full text-left border-collapse text-xs">
            <tbody className="divide-y divide-slate-100 text-xs">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="w-1/3 px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Average rut depth</td>
                <td className="w-2/3 px-4 py-3 align-middle font-bold tabular-nums text-amber-700">20 mm (outer wheelpath along Lane 1)</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Maximum rut depth</td>
                <td className="px-4 py-3 align-middle font-bold tabular-nums text-red-600">20 mm (localized at PH-01 to PH-04 depressions)</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Measurement interval</td>
                <td className="px-4 py-3 align-middle tabular-nums text-slate-900">Recommended chainage-wise at 20 m intervals</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Classification</td>
                <td className="px-4 py-3 align-middle text-red-700 font-bold">Critical rutting requiring 40mm cold milling</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-middle font-semibold text-slate-700 bg-slate-50/70">Engineering use</td>
                <td className="px-4 py-3 align-middle text-slate-700">Assess water ponding, deformation and need for leveling / strengthening</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5.2 Field Data Sheet – Sample Layout */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1a73e8]" />
            <h4 className="text-sm font-bold text-slate-900">
              5.2 Transverse Rut Depth Schedule (20m Intervals)
            </h4>
          </div>
          <span className="text-xs text-slate-500">6 Intervals (0+000 to 0+120)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-fixed w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="w-[11%] px-4 py-3 align-middle">Start Ch.</th>
                <th className="w-[11%] px-4 py-3 align-middle">End Ch.</th>
                <th className="w-[12%] px-4 py-3 align-middle">Left Rut</th>
                <th className="w-[12%] px-4 py-3 align-middle">Right Rut</th>
                <th className="w-[14%] px-4 py-3 align-middle">Avg Rut (mm)</th>
                <th className="w-[14%] px-4 py-3 align-middle">Max Rut (mm)</th>
                <th className="w-[26%] px-4 py-3 align-middle">Remarks &amp; Engineering Field Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {ruttingSheet.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-middle font-bold text-slate-900 tabular-nums">{r.startCh}</td>
                  <td className="px-4 py-3 align-middle font-bold text-slate-900 tabular-nums">{r.endCh}</td>
                  <td className="px-4 py-3 align-middle text-slate-700 tabular-nums">{r.leftRut}</td>
                  <td className="px-4 py-3 align-middle text-slate-700 tabular-nums">{r.rightRut}</td>
                  <td className="px-4 py-3 align-middle text-amber-700 font-bold tabular-nums">{r.avgRut}</td>
                  <td className="px-4 py-3 align-middle text-red-600 font-bold tabular-nums">{r.maxRut}</td>
                  <td className="px-4 py-3 align-middle text-slate-600">{r.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 6: ROAD INVENTORY & GEOMETRY */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Section 6: Road Inventory &amp; Geometry Record
            </h4>
          </div>
          <span className="text-xs text-purple-700 font-semibold">NKDA Road MAR 1111</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-fixed w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="w-1/3 px-4 py-3 align-middle">Inventory Parameter</th>
                <th className="w-1/2 px-4 py-3 align-middle">Current Specification &amp; Dimension</th>
                <th className="w-[17%] px-4 py-3 align-middle">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {inventorySummary.map((inv, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-middle font-bold text-slate-800">{inv.param}</td>
                  <td className="px-4 py-3 align-middle text-slate-900 font-medium">{inv.value}</td>
                  <td className="px-4 py-3 align-middle">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Annexure 3: Pre-Issue Field Verification Checklist */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Section 7: Statutory Field Verification &amp; Quality Checklist
            </h4>
          </div>
          <span className="text-xs text-emerald-700 font-semibold">8 Mandatory Checks</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-fixed w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="w-12 px-4 py-3 align-middle text-center">#</th>
                <th className="w-2/5 px-4 py-3 align-middle">Verification Requirement</th>
                <th className="px-4 py-3 align-middle">Technical Details / Compliance Output</th>
                <th className="w-28 px-4 py-3 align-middle text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {checklistItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-middle font-bold text-slate-600 text-center tabular-nums">{item.id}</td>
                  <td className="px-4 py-3 align-middle font-semibold text-slate-900">{item.req}</td>
                  <td className="px-4 py-3 align-middle text-slate-700">{item.details}</td>
                  <td className="px-4 py-3 align-middle text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{item.status}</span>
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
