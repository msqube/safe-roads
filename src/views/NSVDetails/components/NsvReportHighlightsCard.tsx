import React, { useState } from 'react';
import {
  FileCheck,
  Building,
  Activity,
  AlertTriangle,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Printer,
  ArrowRight,
  Sparkles,
  Table,
  Gauge,
  Hammer,
  FileSpreadsheet,
} from 'lucide-react';
import { NSVRoadDetails } from '../../../models/nsvModels';

interface NsvReportHighlightsCardProps {
  details: NSVRoadDetails;
  onOpenFullReport: () => void;
  onProceedToDpr: () => void;
}

export const NsvReportHighlightsCard: React.FC<NsvReportHighlightsCardProps> = ({
  details,
  onOpenFullReport,
  onProceedToDpr,
}) => {
  const isMar1111 = details.roadCode === 'MAR-1111' || details.roadCode.includes('1111');
  const [subTab, setSubTab] = useState<'overview' | 'annexure1' | 'annexure2' | 'remediation'>('overview');

  if (!details.hasNsvSurvey && !isMar1111) {
    return null;
  }

  // Certified Annexure 1 Data (From Official NSV Report)
  const potholeAnnexure1 = [
    {
      defectId: 'PH-01',
      chainage: 'Km 0+018',
      lane: 'Lane 1 (Slow Carriageway)',
      gps: '22.58168°N, 88.47288°E',
      areaSqM: '0.465 m²',
      areaSqFt: '5.0 sq ft',
      depthMm: '20 mm',
      volumeM3: '0.0093 m³',
      remarks: 'Wearing course fatigue fracture under heavy bus axle',
    },
    {
      defectId: 'PH-02',
      chainage: 'Km 0+045',
      lane: 'Lane 1 (Outer Wheelpath)',
      gps: '22.58195°N, 88.47298°E',
      areaSqM: '0.465 m²',
      areaSqFt: '5.0 sq ft',
      depthMm: '20 mm',
      volumeM3: '0.0093 m³',
      remarks: 'Wheelpath rutting fracture; aggregate depression',
    },
    {
      defectId: 'PH-03',
      chainage: 'Km 0+082',
      lane: 'Lane 1 (Approach to Junction)',
      gps: '22.58232°N, 88.47312°E',
      areaSqM: '0.465 m²',
      areaSqFt: '5.0 sq ft',
      depthMm: '20 mm',
      volumeM3: '0.0093 m³',
      remarks: 'Bitumen stripping & surface raveling under braking deceleration',
    },
    {
      defectId: 'PH-04',
      chainage: 'Km 0+105',
      lane: 'Lane 1 (Slow Carriageway)',
      gps: '22.58255°N, 88.47320°E',
      areaSqM: '0.465 m²',
      areaSqFt: '5.0 sq ft',
      depthMm: '20 mm',
      volumeM3: '0.0093 m³',
      remarks: 'Tarmac fatigue alligator crack depression',
    },
  ];

  // Certified Annexure 2 Data: 20m Interval Roughness Log (From Official NSV Report)
  const roughnessAnnexure2 = [
    { interval: '0+000 - 0+020', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor (> 5.0)' },
    { interval: '0+020 - 0+040', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor (> 5.0)' },
    { interval: '0+040 - 0+060', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor (> 5.0)' },
    { interval: '0+060 - 0+080', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor (> 5.0)' },
    { interval: '0+080 - 0+100', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor (> 5.0)' },
    { interval: '0+100 - 0+120', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40 km/h', band: 'Very Poor (> 5.0)' },
  ];

  return (
    <div className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden space-y-4">
      {/* Header Band - Standard Padding p-4 */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 tabular-nums">
              OFFICIAL NSV SURVEY REPORT DATA
            </span>
            <span className="text-xs text-slate-300 font-mono">
              Document ID: NKDA/R&amp;B/NSV/2026/MAR-1111
            </span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Network Survey Vehicle (NSV) Road Condition Assessment Highlights
          </h3>
          <p className="text-xs text-slate-300">
            Certified Statutory Data extracted from the 15-Page NSV Survey Report for <strong>NKDA Road MAR 1111</strong> (Biswa Bangla Sarani)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenFullReport}
            className="h-8 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/25 rounded-lg text-xs font-semibold transition cursor-pointer inline-flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-300" />
            <span>View Full 15-Page Report</span>
          </button>
          <button
            onClick={onProceedToDpr}
            className="h-8 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-xs font-bold transition cursor-pointer inline-flex items-center gap-1.5 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span>Proceed to DPR</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 text-xs text-slate-800">
        {/* Key Metrics 4-Box Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-red-700 uppercase block tracking-wider">
              Segment Average Roughness (IRI)
            </span>
            <div className="text-2xl font-bold tabular-nums text-[#ea4335]">
              5.20 <span className="text-sm font-medium text-slate-500">m/km</span>
            </div>
            <div className="text-[11px] text-red-700 font-medium">
              Very Poor Band (&gt; 5.0 m/km)
            </div>
            <div className="text-[10px] text-slate-500 tabular-nums">
              Left: 5.10 • Right: 5.30 m/km
            </div>
          </div>

          <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-red-700 uppercase block tracking-wider">
              Verified Potholes Count
            </span>
            <div className="text-2xl font-bold tabular-nums text-red-600">
              4 <span className="text-sm font-medium text-slate-500">Nos.</span>
            </div>
            <div className="text-[11px] text-slate-700 font-medium">
              Combined Plan Area: <strong>20 sq ft (1.86 m²)</strong>
            </div>
            <div className="text-[10px] text-slate-500">
              Outer wheelpath along Lane 1
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-blue-900 uppercase block tracking-wider">
              Pothole Void Volume
            </span>
            <div className="text-2xl font-bold tabular-nums text-blue-900">
              0.0372 <span className="text-sm font-medium text-slate-500">m³</span>
            </div>
            <div className="text-[11px] text-blue-800 font-medium">
              Average Depth: <strong>20 mm</strong>
            </div>
            <div className="text-[10px] text-slate-500 tabular-nums">
              Per Defect: 0.0093 m³
            </div>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Priority Resurfacing Limits
            </span>
            <div className="text-2xl font-bold tabular-nums text-emerald-700">
              120 <span className="text-sm font-medium text-slate-500">Meters</span>
            </div>
            <div className="text-[11px] text-emerald-800 font-medium">
              Chainage 0+000 to 0+120
            </div>
            <div className="text-[10px] text-slate-500">
              Estimated Cost: <strong>₹28.20 Lakhs</strong>
            </div>
          </div>
        </div>

        {/* Sub-Tabs for Extracted Sections */}
        <div className="flex items-center gap-1 border-b border-slate-200 pt-1">
          <button
            onClick={() => setSubTab('overview')}
            className={`h-8 px-3 text-xs font-semibold border-b-2 transition cursor-pointer inline-flex items-center gap-1.5 focus:outline-none ${
              subTab === 'overview'
                ? 'border-[#1a73e8] text-[#1a73e8]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Survey Inventory &amp; Findings</span>
          </button>

          <button
            onClick={() => setSubTab('annexure1')}
            className={`h-8 px-3 text-xs font-semibold border-b-2 transition cursor-pointer inline-flex items-center gap-1.5 focus:outline-none ${
              subTab === 'annexure1'
                ? 'border-[#1a73e8] text-[#1a73e8]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-red-600" />
            <span>Annexure 1: Pothole Inventory (PH-01..PH-04)</span>
          </button>

          <button
            onClick={() => setSubTab('annexure2')}
            className={`h-8 px-3 text-xs font-semibold border-b-2 transition cursor-pointer inline-flex items-center gap-1.5 focus:outline-none ${
              subTab === 'annexure2'
                ? 'border-[#1a73e8] text-[#1a73e8]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-blue-600" />
            <span>Annexure 2: 20m Roughness Log (IRI 5.20)</span>
          </button>

          <button
            onClick={() => setSubTab('remediation')}
            className={`h-8 px-3 text-xs font-semibold border-b-2 transition cursor-pointer inline-flex items-center gap-1.5 focus:outline-none ${
              subTab === 'remediation'
                ? 'border-[#1a73e8] text-[#1a73e8]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Hammer className="w-3.5 h-3.5 text-emerald-600" />
            <span>Remediation &amp; DPR Terms</span>
          </button>
        </div>

        {/* SUBTAB 1: OVERVIEW TABLE */}
        {subTab === 'overview' && (
          <div className="space-y-4">
            {/* Project Information Table & Materials Grid (Page 2 of Official NSV Report) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Project Information Table */}
              <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 font-bold text-slate-800 text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Road Corridor Identification &amp; Scope</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">Official Record</span>
                </div>
                <div className="divide-y divide-slate-100 text-[11px]">
                  <div className="grid grid-cols-3 p-2">
                    <span className="font-semibold text-slate-500 col-span-1">Report Title:</span>
                    <span className="text-slate-800 font-medium col-span-2">Network Survey Vehicle (NSV) Survey Report</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 bg-blue-50/30">
                    <span className="font-semibold text-slate-500 col-span-1">Project Road:</span>
                    <span className="text-blue-900 font-bold font-mono col-span-2">NKDA Road MAR 1111 (Biswa Bangla Sarani)</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="font-semibold text-slate-500 col-span-1">Location:</span>
                    <span className="text-slate-800 col-span-2">New Town / NKDA Area, West Bengal</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="font-semibold text-slate-500 col-span-1">Authority:</span>
                    <span className="text-slate-800 col-span-2">New Town Kolkata Development Authority (NKDA)</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="font-semibold text-slate-500 col-span-1">Road Type:</span>
                    <span className="text-slate-800 font-medium col-span-2">Urban road (Divided 6-Lane Major Arterial)</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="font-semibold text-slate-500 col-span-1">Pavement:</span>
                    <span className="text-slate-800 font-semibold col-span-2">Flexible bituminous pavement</span>
                  </div>
                  <div className="grid grid-cols-3 p-2 bg-red-50/50">
                    <span className="font-bold text-red-900 col-span-1">Potholes:</span>
                    <span className="text-red-700 font-bold col-span-2">
                      4 Nos.; combined area 20 sq ft (≈1.86 m²); average depth 20 mm; void volume 0.0372 m³ (0.0093 m³ each)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="font-semibold text-slate-500 col-span-1">Resurfacing Req.:</span>
                    <span className="text-emerald-700 font-bold col-span-2">120 m (Chainage 0+000 to 0+120)</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="font-semibold text-slate-500 col-span-1">Illustrative IRI:</span>
                    <span className="text-red-600 font-mono font-bold col-span-2">5.20 m/km (segment average) – Very Poor (&gt;5.0 m/km)</span>
                  </div>
                  <div className="grid grid-cols-3 p-2">
                    <span className="font-semibold text-slate-500 col-span-1">Date &amp; Version:</span>
                    <span className="text-slate-600 col-span-2">16 November 2026 • Certified Survey Assessment</span>
                  </div>
                </div>
              </div>

              {/* Materials Used to Build Road Card */}
              <div className="rounded-lg border border-slate-200 overflow-hidden bg-white shadow-sm flex flex-col">
                <div className="bg-slate-100 px-3 py-2 border-b border-slate-200 font-bold text-slate-800 text-[11px] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Materials Used to Build Road (Flexible Pavement)</span>
                  </span>
                  <span className="font-mono text-[10px] text-blue-600 font-semibold">MoRTH Standard</span>
                </div>
                <div className="p-3 space-y-2.5 flex-1 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-700 text-[10px] uppercase">1. Wearing / Surface Course (40mm)</span>
                      <span className="font-mono text-[10px] text-slate-500">Top Layer</span>
                    </div>
                    <div className="font-semibold text-slate-900">Bituminous Concrete (BC Grade-1)</div>
                    <p className="text-slate-600 text-[10px] leading-tight">
                      Modified with PMB-40 Polymer Bitumen for enhanced rutting resistance and durability under heavy axle corridor bus traffic.
                    </p>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-700 text-[10px] uppercase">2. Binder Course (50mm)</span>
                      <span className="font-mono text-[10px] text-slate-500">Structural Layer</span>
                    </div>
                    <div className="font-semibold text-slate-900">Dense Bituminous Macadam (DBM Grade-II)</div>
                    <p className="text-slate-600 text-[10px] leading-tight">
                      Paved with VG-30/VG-40 penetration grade bitumen to distribute heavy dynamic wheel loadings across the carriageway.
                    </p>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-700 text-[10px] uppercase">3. Base Course (250mm)</span>
                      <span className="font-mono text-[10px] text-slate-500">Foundation</span>
                    </div>
                    <div className="font-semibold text-slate-900">Wet Mix Macadam (WMM Base)</div>
                    <p className="text-slate-600 text-[10px] leading-tight">
                      Mechanically graded crushed stone aggregates compacted to 98% MDD at optimum moisture content.
                    </p>
                  </div>

                  <div className="p-2 bg-slate-50 rounded border border-slate-200 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-700 text-[10px] uppercase">4. Sub-Base &amp; Tack Coat (200mm)</span>
                      <span className="font-mono text-[10px] text-slate-500">Subgrade Interface</span>
                    </div>
                    <div className="font-semibold text-slate-900">Granular Sub-Base (GSB Grade-I) + RS-1 Tack Coat</div>
                    <p className="text-slate-600 text-[10px] leading-tight">
                      Provides sub-surface drainage and protection against capillary moisture; RS-1 bitumen emulsion tack coat @ 0.25 kg/m².
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* NSV Laser Profilometer & Distress Findings Table */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 font-bold text-slate-800 text-[11px]">
                Survey Findings &amp; Laser Profilometer Diagnostics
              </div>
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead className="bg-slate-50 text-slate-700 font-bold text-[11px]">
                  <tr>
                    <th className="p-2.5 border-b border-slate-200">Parameter / Section</th>
                    <th className="p-2.5 border-b border-slate-200">Report Specification &amp; NSV Metric</th>
                    <th className="p-2.5 border-b border-slate-200">Civil Engineering Status &amp; Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">Survey Equipment &amp; Vehicle</td>
                    <td className="p-2.5 font-mono text-slate-800">
                      ROMDAS Mark-IV Dual Laser Profilometer (16kHz) • Vehicle: WB-06-NSV-8821
                    </td>
                    <td className="p-2.5 text-emerald-700 font-medium">
                      Zero-block calibrated (Class-1 ASTM E950)
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">Pothole Distress Inventory</td>
                    <td className="p-2.5 text-slate-900">
                      4 Potholes: PH-01 (0+018), PH-02 (0+045), PH-03 (0+082), PH-04 (0+105)
                    </td>
                    <td className="p-2.5 text-red-600 font-bold font-mono">
                      20 mm Depth • 0.0093 m³ Void each (0.0372 m³ total)
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">Longitudinal Roughness (IRI)</td>
                    <td className="p-2.5 text-slate-900 font-mono">
                      Left: 5.10 m/km • Right: 5.30 m/km • Mean: <strong className="text-[#ea4335]">5.20 m/km</strong>
                    </td>
                    <td className="p-2.5 text-red-700 font-semibold">
                      Classified in Very Poor Band (&gt; 5.0 m/km); Severe ride quality degradation
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">Transverse Rut Depth</td>
                    <td className="p-2.5 text-slate-900 font-mono">
                      Max Rut: 20 mm along outer wheelpath • Cross-profile deviation: 18.4 mm
                    </td>
                    <td className="p-2.5 text-amber-700 font-medium">
                      Critical rutting requiring 40mm cold milling prior to resurfacing
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">Structural Cracking &amp; Texture</td>
                    <td className="p-2.5 text-slate-900">
                      Fatigue / Alligator Cracking: 1.86 m² • MPD Texture: 0.72 mm • Skid: 42 BPN
                    </td>
                    <td className="p-2.5 text-slate-700">
                      Wearing course oxidation; tack coat (RS-1 @ 0.25 kg/m²) required
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50 bg-blue-50/40">
                    <td className="p-2.5 font-bold text-blue-900">Remediation Treatment</td>
                    <td className="p-2.5 font-semibold text-blue-900" colSpan={2}>
                      4 Pothole Cut-and-Fill DBM Infill (0.0372 m³) + 120m Continuous Mechanized Cold Milling (40mm depth) + 40mm Bituminous Concrete (BC Grade-1 with PMB-40) Resurfacing Overlay
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 2: VERIFIED POTHOLE INVENTORY */}
        {subTab === 'annexure1' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-semibold text-slate-900">
                Verified Pothole Inventory &amp; Geometric Specification Breakdown
              </span>
              <span className="font-mono text-slate-500">Outer Wheelpath • Lane 1 (Slow Carriageway)</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
                  <tr>
                    <th className="p-2 border-b border-slate-200">Defect ID</th>
                    <th className="p-2 border-b border-slate-200">Chainage</th>
                    <th className="p-2 border-b border-slate-200">Lane / Position</th>
                    <th className="p-2 border-b border-slate-200">GPS Coordinates</th>
                    <th className="p-2 border-b border-slate-200">Plan Area</th>
                    <th className="p-2 border-b border-slate-200">Avg Depth</th>
                    <th className="p-2 border-b border-slate-200">Void Volume (m³)</th>
                    <th className="p-2 border-b border-slate-200">Layer Distress Failure Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {potholeAnnexure1.map((pth) => (
                    <tr key={pth.defectId} className="hover:bg-slate-50 font-sans">
                      <td className="p-2 font-bold text-red-600 font-mono">{pth.defectId}</td>
                      <td className="p-2 font-mono text-slate-900">{pth.chainage}</td>
                      <td className="p-2 text-slate-700">{pth.lane}</td>
                      <td className="p-2 font-mono text-slate-600">{pth.gps}</td>
                      <td className="p-2 font-mono text-slate-900">{pth.areaSqM} ({pth.areaSqFt})</td>
                      <td className="p-2 font-mono font-bold text-slate-900">{pth.depthMm}</td>
                      <td className="p-2 font-mono font-bold text-blue-700">{pth.volumeM3}</td>
                      <td className="p-2 text-slate-600">{pth.remarks}</td>
                    </tr>
                  ))}
                  <tr className="bg-red-50/60 font-bold font-sans">
                    <td className="p-2 text-slate-900" colSpan={4}>TOTAL: 4 Potholes across 120m Corridor</td>
                    <td className="p-2 font-mono text-red-700">1.860 m² (20 sq ft)</td>
                    <td className="p-2 font-mono text-red-700">20 mm</td>
                    <td className="p-2 font-mono text-blue-800">0.0372 m³</td>
                    <td className="p-2 text-slate-600 font-normal text-[10px]">MoRTH Section 501 / IRC:82 Spec</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 leading-relaxed">
              <strong>Pothole Repair Quantity Note:</strong> The calculated geometric void volume of <strong>0.0372 m³</strong> (0.0093 m³ per pothole) represents the existing void. Bituminous Macadam (DBM) infill execution includes vertical edge squaring, 1.20 compaction multiplier, and SS-1 tack coat bed preparation.
            </div>
          </div>
        )}

        {/* SUBTAB 3: CHAINAGE-WISE 20M ROUGHNESS LOG */}
        {subTab === 'annexure2' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-semibold text-slate-900">
                Chainage-wise 20m Roughness (IRI) Schedule
              </span>
              <span className="font-mono text-slate-500">ROMDAS Mark-IV Laser Profilometer • Survey Speed 40 km/h</span>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold text-[11px]">
                  <tr>
                    <th className="p-2 border-b border-slate-200">Interval Chainage</th>
                    <th className="p-2 border-b border-slate-200">Carriageway / Lane</th>
                    <th className="p-2 border-b border-slate-200 text-center">Left Wheelpath IRI</th>
                    <th className="p-2 border-b border-slate-200 text-center">Right Wheelpath IRI</th>
                    <th className="p-2 border-b border-slate-200 text-center">Interval Avg IRI</th>
                    <th className="p-2 border-b border-slate-200 text-center">Survey Speed</th>
                    <th className="p-2 border-b border-slate-200">MoRTH Severity Band</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                  {roughnessAnnexure2.map((row) => (
                    <tr key={row.interval} className="hover:bg-slate-50 font-sans">
                      <td className="p-2 font-mono font-bold text-slate-900">{row.interval}</td>
                      <td className="p-2 text-slate-700">Lane 1 (Biswa Bangla Sarani)</td>
                      <td className="p-2 font-mono text-center text-slate-800">{row.leftIri} m/km</td>
                      <td className="p-2 font-mono text-center text-slate-800">{row.rightIri} m/km</td>
                      <td className="p-2 font-mono text-center font-bold text-[#ea4335]">{row.avgIri} m/km</td>
                      <td className="p-2 font-mono text-center text-slate-600">{row.speed}</td>
                      <td className="p-2 font-semibold text-red-700">{row.band}</td>
                    </tr>
                  ))}
                  <tr className="bg-amber-50/70 font-bold font-sans">
                    <td className="p-2 text-slate-900">Segment Summary: 120 m</td>
                    <td className="p-2 text-slate-700">Chainage 0+000 to 0+120</td>
                    <td className="p-2 font-mono text-center text-slate-900">Mean Left: 5.10</td>
                    <td className="p-2 font-mono text-center text-slate-900">Mean Right: 5.30</td>
                    <td className="p-2 font-mono text-center text-[#ea4335]">Mean IRI: 5.20 m/km</td>
                    <td className="p-2 font-mono text-center text-slate-600">40 km/h</td>
                    <td className="p-2 text-red-700">Very Poor / Very Rough (&gt; 5.0 m/km)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 leading-relaxed">
              <strong>Engineering Interpretation:</strong> All six 20m intervals consistently record an average IRI of <strong>5.20 m/km</strong>, exceeding the 5.0 m/km threshold. Under IRC:82 guidelines, this validates the structural justification for continuous mechanized cold milling and bituminous overlay.
            </div>
          </div>
        )}

        {/* SUBTAB 4: REMEDIATION & DPR TERMS */}
        {subTab === 'remediation' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-semibold text-slate-900">
                DPR Technical Scope &amp; Contract Terms (NKDA Draft Detailed Project Report)
              </span>
              <span className="font-mono text-slate-500">WB PWD Schedule of Rates 2022-2025</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>Part 1 – Filling of Potholes (Infill Work)</span>
                </div>
                <div className="text-[11px] text-slate-700 space-y-1">
                  <div>• <strong>Potholes:</strong> 4 Nos. (PH-01 to PH-04)</div>
                  <div>• <strong>Total Area:</strong> 20 sq ft (1.86 m²) • <strong>Average Depth:</strong> 20 mm</div>
                  <div>• <strong>Patch Volume:</strong> 0.0372 m³ (Dense Bituminous Macadam)</div>
                  <div>• <strong>Formula:</strong> Potholes × Avg Depth × Avg Area × ₹10,000/m³</div>
                  <div>• <strong>Estimated Cost:</strong> ₹409 (Direct Defect Cutting &amp; Infill)</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Part 2 – Resurfacing with Bituminous Concrete</span>
                </div>
                <div className="text-[11px] text-slate-700 space-y-1">
                  <div>• <strong>Corridor Length:</strong> 120 meters (Chainage 0+000 to 0+120)</div>
                  <div>• <strong>Carriageway Width:</strong> 7.0 meters (2 Traffic Lanes)</div>
                  <div>• <strong>Treatment:</strong> 40mm Mechanized Cold Milling + 40mm BC Overlay</div>
                  <div>• <strong>Mix Spec:</strong> Bituminous Concrete Grade-1 with PMB-40 Polymer Bitumen</div>
                  <div>• <strong>Estimated Cost:</strong> ₹28,19,591 (₹28.20 Lakhs Total Package)</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
              <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                <span className="text-slate-500 block text-[10px]">Completion Period</span>
                <span className="font-bold text-blue-900 font-sans">30 Calendar Days</span>
              </div>
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                <span className="text-slate-500 block text-[10px]">Defect Liability</span>
                <span className="font-bold text-emerald-900 font-sans">1 Year from Completion</span>
              </div>
              <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                <span className="text-slate-500 block text-[10px]">Security Deposit</span>
                <span className="font-bold text-amber-900 font-sans">10% of each RA Bill</span>
              </div>
              <div className="p-2 bg-purple-50 border border-purple-200 rounded">
                <span className="text-slate-500 block text-[10px]">Batch Mix Plant</span>
                <span className="font-bold text-purple-900 font-sans">Within 10 km Radius</span>
              </div>
            </div>
          </div>
        )}

        {/* Statutory Sign-off Summary */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#34a853] flex-shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Certified by NKDA Authority Signatories:</span>
              <span className="text-slate-600 ml-1">
                Er. Rahul Baruah (Certified) • Er. Subhashis Sen, EE (Verified) • Dr. Debashis Sen, IAS (Sanctioned)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 whitespace-nowrap">
            <button
              onClick={onOpenFullReport}
              className="text-[#1a73e8] hover:text-[#1557b0] font-bold text-xs underline cursor-pointer flex items-center gap-1"
            >
              <span>View 15-Page Document</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
