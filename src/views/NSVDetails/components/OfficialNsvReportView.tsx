import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Printer,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  Calendar,
  Layers,
  Activity,
  FileCheck,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  Sparkles,
  Sliders,
  ListOrdered,
  Gauge,
  Compass,
} from 'lucide-react';
import { NSVRoadDetails } from '../../../models/nsvModels';

interface OfficialNsvReportViewProps {
  details: NSVRoadDetails;
  initialPage?: number | 'all';
}

export const OfficialNsvReportView: React.FC<OfficialNsvReportViewProps> = ({
  details,
  initialPage = 'all',
}) => {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState<number | 'all'>(initialPage);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{
    id: string;
    title: string;
    chainage: string;
    gps: string;
    imgUrl: string;
  } | null>(null);

  const isMar1111 = details.roadCode === 'MAR-1111' || details.roadCode.includes('1111');

  // Photo register data matching Annexure 1 (Strictly in m³, never Litres)
  const photoRegister = [
    {
      photoId: 'IMG-01',
      defectId: 'PH-01',
      chainage: 'Km 0+018',
      direction: 'Carriageway / Lane 1 (Slow Lane)',
      gps: '22.58168°N, 88.47288°E',
      dimensions: '68cm × 68cm (0.465 m²)',
      depth: '20 mm',
      volume: '0.0093 m³',
      remarks: 'Pre-repair overview; wearing course fatigue fracture under heavy bus axle',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg',
    },
    {
      photoId: 'IMG-02',
      defectId: 'PH-02',
      chainage: 'Km 0+045',
      direction: 'Carriageway / Lane 1 (Slow Lane)',
      gps: '22.58195°N, 88.47298°E',
      dimensions: '68cm × 68cm (0.465 m²)',
      depth: '20 mm',
      volume: '0.0093 m³',
      remarks: 'Pre-repair overview; localized aggregate loss & binder raveling',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Pothole_Big.jpg',
    },
    {
      photoId: 'IMG-03',
      defectId: 'PH-03',
      chainage: 'Km 0+082',
      direction: 'Carriageway / Lane 1 (Slow Lane)',
      gps: '22.58232°N, 88.47312°E',
      dimensions: '68cm × 68cm (0.465 m²)',
      depth: '20 mm',
      volume: '0.0093 m³',
      remarks: 'Pre-repair overview; bitumen raveling and void breach along 20m interval #4',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Pothole_repair.jpg',
    },
    {
      photoId: 'IMG-04',
      defectId: 'PH-04',
      chainage: 'Km 0+105',
      direction: 'Carriageway / Lane 1 (Slow Lane)',
      gps: '22.58255°N, 88.47320°E',
      dimensions: '68cm × 68cm (0.465 m²)',
      depth: '20 mm',
      volume: '0.0093 m³',
      remarks: 'Pre-repair overview; edge depression near 120m segment terminal (Km 0+120)',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_pothole.jpg',
    },
  ];

  // Annexure 2: IRI 20m schedule
  const iriSchedule = [
    { startCh: '0+000', endCh: '0+020', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**', band: 'Very Poor' },
    { startCh: '0+020', endCh: '0+040', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**', band: 'Very Poor' },
    { startCh: '0+040', endCh: '0+060', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**', band: 'Very Poor' },
    { startCh: '0+060', endCh: '0+080', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**', band: 'Very Poor' },
    { startCh: '0+080', endCh: '0+100', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**', band: 'Very Poor' },
    { startCh: '0+100', endCh: '0+120', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**', band: 'Very Poor' },
  ];

  const pageList = [
    { num: 1, title: 'Title Sheet', label: 'Cover & Document Title' },
    { num: 2, title: 'Corridor Specs', label: 'Document Control & Geography' },
    { num: 3, title: 'Table of Contents', label: 'Report Structure & Chapters' },
    { num: 4, title: 'Executive Summary', label: 'Executive Findings & Takeaways' },
    { num: 5, title: 'Section 1: Intro', label: 'Introduction & Survey Scope' },
    { num: 6, title: 'Section 2: NSV Specs', label: 'Equipment & Profilometer Specs' },
    { num: 7, title: 'Section 3: Potholes', label: 'Pavement Defects (0.0093 m³)' },
    { num: 8, title: 'Section 4: Roughness (IRI)', label: 'Roughness Profile & Waveform' },
    { num: 9, title: 'Section 5: Rut Depth', label: 'Transverse Rutting & Cross-Slope' },
    { num: 10, title: 'Section 6: Distress', label: 'Cracking & Surface Texture' },
    { num: 11, title: 'Section 7: Remediation', label: 'Engineering Treatment & Strategy' },
    { num: 12, title: 'Annexure 1: Photos', label: 'Photo Register (IMG-01 to 04)' },
    { num: 13, title: 'Annexure 2: IRI Table', label: 'Chainage-Wise 20m Schedule' },
    { num: 14, title: 'Annexure 3: Sign-Offs', label: 'Authority Verification Seals' },
  ];

  const shouldShow = (pageNum: number) => activePage === 'all' || activePage === pageNum;

  const goToPrev = () => {
    if (activePage === 'all') setActivePage(14);
    else if (activePage > 1) setActivePage((activePage - 1) as number);
    else setActivePage('all');
  };

  const goToNext = () => {
    if (activePage === 'all') setActivePage(1);
    else if (activePage < 14) setActivePage((activePage + 1) as number);
    else setActivePage('all');
  };

  return (
    <div className="space-y-4">
      {/* High-Resolution Photo Zoom Modal */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="p-3 bg-slate-800 text-white flex items-center justify-between text-xs font-bold">
              <span>{selectedPhotoModal.title} • {selectedPhotoModal.chainage} ({selectedPhotoModal.gps})</span>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="p-1 hover:bg-slate-700 rounded transition cursor-pointer text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            <img src={selectedPhotoModal.imgUrl} alt={selectedPhotoModal.title} className="w-full max-h-[70vh] object-cover" />
          </div>
        </div>
      )}

      {/* Top Banner: Ingested Report Header & Quick Actions */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              OFFICIAL 14-PAGE STATUTORY REPORT
            </span>
            <span className="text-xs text-slate-300 font-mono">NKDA Road MAR 1111 (Biswa Bangla Sarani)</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            Network Survey Vehicle (NSV) Road Condition Assessment Report
          </h2>
          <p className="text-xs text-slate-300">
            Chainage 0+000 to 0+120 (120m Resurfacing Segment) • 4 Potholes (1.86 m², 20mm depth, 0.0372 m³ void) • Segment IRI 5.20 m/km
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={() => navigate(`/dpr/${details.roadCode}`)}
            className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer flex items-center gap-2 active:scale-98"
          >
            <span>Proceed to DPR &amp; Tender Release</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 14-PAGE DOCUMENT NAVIGATOR BAR */}
      <div className="bg-white border border-slate-300 rounded-xl p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1a73e8]" />
            <span className="text-xs font-bold text-slate-900">
              Page-by-Page Document Explorer (Official 14 Pages):
            </span>
            <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {activePage === 'all' ? 'Displaying: Complete 14-Page Dossier' : `Displaying: Page ${activePage} of 14`}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={goToPrev}
              className="px-2.5 py-1 text-xs border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium transition cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev Page</span>
            </button>
            <button
              onClick={goToNext}
              className="px-2.5 py-1 text-xs border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium transition cursor-pointer flex items-center gap-1"
            >
              <span>Next Page</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Page Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
          <button
            onClick={() => setActivePage('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer whitespace-nowrap border ${
              activePage === 'all'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            All 14 Pages (Full Dossier)
          </button>

          {pageList.map((p) => (
            <button
              key={p.num}
              onClick={() => setActivePage(p.num)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition cursor-pointer whitespace-nowrap border flex items-center gap-1.5 ${
                activePage === p.num
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs font-bold'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title={p.label}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
                activePage === p.num ? 'bg-white text-blue-700' : 'bg-slate-200 text-slate-700'
              }`}>
                {p.num}
              </span>
              <span>{p.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 14-PAGE DOSSIER CONTENT CONTAINER */}
      {/* ========================================================================= */}
      <div className="space-y-6">

        {/* ===================================================================== */}
        {/* PAGE 1: TITLE & COVER SHEET */}
        {/* ===================================================================== */}
        {shouldShow(1) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 1 OF 14
            </div>

            <div className="p-8 text-center space-y-4 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
              <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 border-2 border-blue-300 flex items-center justify-center text-blue-700 shadow-xs">
                <Building className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="text-xs uppercase tracking-widest font-extrabold text-slate-500">
                  New Town Kolkata Development Authority (NKDA) • Government of West Bengal
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                  NETWORK SURVEY VEHICLE (NSV) SURVEY REPORT
                </h1>
                <div className="text-sm font-bold text-slate-700 tracking-wider">
                  ROAD CONDITION ASSESSMENT &amp; MAINTENANCE RECOMMENDATION
                </div>
              </div>

              <div className="inline-block px-4 py-1.5 bg-blue-100 border border-blue-300 rounded-lg text-blue-900 font-black text-base font-mono">
                NKDA ROAD – MAR 1111 (Biswa Bangla Sarani, Action Area I)
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 uppercase text-[11px] block border-b border-slate-200 pb-1">
                    Survey Authority &amp; Client Details
                  </span>
                  <div className="space-y-1 text-slate-700">
                    <div><strong>Client:</strong> New Town Kolkata Development Authority (NKDA)</div>
                    <div><strong>Directorate:</strong> Urban Road &amp; Infrastructure Engineering Directorate</div>
                    <div><strong>Executing Field Agency:</strong> SkyScan Geospatial Infrastructure Pvt. Ltd.</div>
                    <div><strong>Vehicle Deployment ID:</strong> WB-06-NSV-8821 (ROMDAS Mark-IV)</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 uppercase text-[11px] block border-b border-slate-200 pb-1">
                    Corridor &amp; Schedule Metadata
                  </span>
                  <div className="space-y-1 text-slate-700">
                    <div><strong>Corridor Name:</strong> Biswa Bangla Sarani (Major Arterial Road MAR 1111)</div>
                    <div><strong>Section:</strong> Chainage 0+000 to 0+120 (120m Priority Resurfacing Segment)</div>
                    <div><strong>Survey Date:</strong> 16 November 2026</div>
                    <div><strong>Report Status:</strong> Certified Official Statutory Dossier (Approved)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 2: PROJECT INFORMATION & CORRIDOR TECHNICAL SPECIFICATIONS */}
        {/* ===================================================================== */}
        {shouldShow(2) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 2 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#1a73e8]" />
                <span>Project Information &amp; Technical Specifications (Page 2)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-6 text-xs leading-relaxed">
              {/* Statutory Project Information Table */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>1. Statutory Project Information</span>
                </h4>
                <div className="overflow-x-auto rounded-lg border border-slate-300">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700 w-1/3">Report Title</td>
                        <td className="p-2.5 font-medium text-slate-900">Network Survey Vehicle (NSV) Survey Report</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700">Project Road</td>
                        <td className="p-2.5 font-bold font-mono text-blue-700">NKDA Road MAR 1111</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700">Location</td>
                        <td className="p-2.5 text-slate-900">New Town / NKDA Area, West Bengal</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700">Authority</td>
                        <td className="p-2.5 text-slate-900">New Town Kolkata Development Authority (NKDA) – sample designation</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700">Road Type</td>
                        <td className="p-2.5 text-slate-900">Urban road (Divided 6-Lane Major Arterial)</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700">Pavement</td>
                        <td className="p-2.5 text-slate-900 font-semibold">Flexible bituminous pavement</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700">Survey Method</td>
                        <td className="p-2.5 text-slate-900">NSV-style condition assessment format</td>
                      </tr>
                      <tr className="border-b border-slate-200 bg-red-50/40">
                        <td className="p-2.5 bg-red-100/60 font-bold text-red-900">Potholes (Verified)</td>
                        <td className="p-2.5 font-bold text-red-700">
                          4 Nos.; combined area 20 sq ft (≈1.86 m²); average depth 20 mm; void volume 0.0372 m³ (0.0093 m³ each)
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700">Resurfacing Requirement</td>
                        <td className="p-2.5 font-bold text-emerald-700">120 m (Chainage 0+000 to 0+120)</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700">Illustrative IRI</td>
                        <td className="p-2.5 font-bold font-mono text-[#ea4335]">
                          5.20 m/km (segment average) – Very Poor (&gt;5.0 m/km)
                        </td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700">Report Version</td>
                        <td className="p-2.5 text-slate-700">Sample Report – Draft for review</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 bg-slate-100 font-bold text-slate-700">Date</td>
                        <td className="p-2.5 font-medium text-slate-900">16 November 2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Materials Used to Build Road Breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>2. Materials Used to Build Road (Flexible Bituminous Pavement)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-red-700 text-[11px] block uppercase">1. Wearing Course / Surface (40mm)</span>
                    <p className="font-semibold text-slate-900">Bituminous Concrete (BC Grade-1)</p>
                    <p className="text-slate-600 text-[11px]">
                      Laid with PMB-40 Polymer Modified Bitumen for high shear resistance under heavy bus axle traffic.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-amber-700 text-[11px] block uppercase">2. Binder Course (50mm)</span>
                    <p className="font-semibold text-slate-900">Dense Bituminous Macadam (DBM Grade-II)</p>
                    <p className="text-slate-600 text-[11px]">
                      With VG-30/VG-40 penetration grade bitumen for structural load distribution.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-blue-700 text-[11px] block uppercase">3. Base Course (250mm)</span>
                    <p className="font-semibold text-slate-900">Wet Mix Macadam (WMM Base)</p>
                    <p className="text-slate-600 text-[11px]">
                      Mechanically crushed graded aggregate compacted at OMC.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="font-bold text-emerald-700 text-[11px] block uppercase">4. Sub-Base &amp; Tack Coat (200mm)</span>
                    <p className="font-semibold text-slate-900">Granular Sub-Base (GSB Grade-I) + RS-1 Emulsion</p>
                    <p className="text-slate-600 text-[11px]">
                      Drainage layer over compacted subgrade; RS-1 bitumen emulsion tack coat @ 0.25 kg/m².
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 3: TABLE OF CONTENTS & REPORT STRUCTURE */}
        {/* ===================================================================== */}
        {shouldShow(3) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 3 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-[#1a73e8]" />
                <span>Table of Contents &amp; Report Structure (Page 3)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs">
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {[
                  { page: 'Page 1 & 2', title: 'Project Information & Corridor Technical Specifications', desc: 'Administrative ownership, corridor geometry, and survey metadata.' },
                  { page: 'Page 3', title: 'Table of Contents & Assessment Structure', desc: 'Statutory chapter index and cross-referencing.' },
                  { page: 'Page 4', title: 'Executive Summary & Key Findings', desc: 'Critical defects, 120m corridor limits, 4 potholes (0.0372 m³ void), and 5.20 m/km IRI.' },
                  { page: 'Page 5', title: 'Section 1: Introduction, Road Geography & Scope', desc: 'Geospatial alignment along Biswa Bangla Sarani and arterial connectivity.' },
                  { page: 'Page 6', title: 'Section 2: NSV Equipment & Calibration Protocol', desc: 'ROMDAS Mark-IV dual laser profilometer, 4K camera rig, and RTK GPS telemetry.' },
                  { page: 'Page 7', title: 'Section 3: Pavement Distress & Pothole Assessment', desc: 'Defect schedule (PH-01 to PH-04), 20mm depth, 0.0093 m³ per unit, and 0.0372 m³ cumulative.' },
                  { page: 'Page 8', title: 'Section 4: Road Roughness (IRI) & Laser Waveform Profile', desc: 'Continuous 20m interval roughness waveforms, threshold benchmarks, and IRC rating.' },
                  { page: 'Page 9', title: 'Section 5: Rut Depth Analysis & Transverse Profilometry', desc: 'Outer wheelpath 24.2mm rutting, mean 18.2mm depression, and cross-slope distortion.' },
                  { page: 'Page 10', title: 'Section 6: Structural Cracking & Surface Texture Evaluation', desc: 'Fatigue cracking extent (14.5%), longitudinal joints, and 0.65mm sand patch MPD.' },
                  { page: 'Page 11', title: 'Section 7: Conclusions & Remediation Strategy', desc: 'Engineering repair protocol: cold milling, DBM patch, and PMB-40 overlay.' },
                  { page: 'Page 12', title: 'Annexure 1: Pavement Condition & Drone Photo Register', desc: 'Certified photographic record (IMG-01 through IMG-04) with GPS coordinates.' },
                  { page: 'Page 13', title: 'Annexure 2: Chainage-Wise Roughness (IRI) Schedule', desc: 'Six 20m interval survey rows showing Left, Right, and Average IRI at 40 km/h.' },
                  { page: 'Page 14', title: 'Annexure 3: Statutory Authority Verification & Sign-Offs', desc: 'Formal certifications by Geospatial Highway Specialist, EE (NKDA), and CEO (NKDA).' },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActivePage(idx === 0 ? 1 : idx + 1)}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span className="text-[#1a73e8]">{row.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500">{row.desc}</div>
                    </div>
                    <span className="font-mono text-slate-600 font-bold bg-slate-100 px-2 py-0.5 rounded text-[11px] whitespace-nowrap ml-4">
                      {row.page}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 4: EXECUTIVE SUMMARY */}
        {/* ===================================================================== */}
        {shouldShow(4) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 4 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#ea4335]" />
                <span>Executive Summary &amp; Key Findings (Page 4)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
              <p>
                This Network Survey Vehicle (NSV) report has been finalized for <strong>NKDA Road MAR 1111</strong> using the defect quantities and resurfacing length verified on site. The pavement distress inventory records <strong>four critical potholes</strong> having a combined plan area of <strong>20 sq ft (approximately 1.86 m²)</strong> and an average depth of <strong>20 mm</strong>. The calculated geometric void volume is <strong>0.0372 m³</strong>.
              </p>

              <p>
                A <strong>120 m road section</strong> (Chainage 0+000 to 0+120) is proposed for priority resurfacing assessment on the basis of a segment-average IRI of <strong>5.20 m/km</strong>. In the standard IRC classification, IRI greater than 5.0 m/km falls in the <strong>Very Poor / Very Rough band</strong>. The measured value provides a clear engineering rationale for prioritizing the 120 m segment for immediate cold milling, DBM leveling, and wearing course resurfacing.
              </p>

              {/* Executive Summary Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                    <tr>
                      <th className="p-2.5">Parameter</th>
                      <th className="p-2.5">Survey Result</th>
                      <th className="p-2.5">Engineering Assessment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Pothole Count</td>
                      <td className="p-2.5 font-semibold text-red-600">4 Nos.</td>
                      <td className="p-2.5 text-slate-700">Localized permanent cut-and-fill patch repairs required</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Combined Pothole Area</td>
                      <td className="p-2.5 font-mono font-bold">20 sq ft / 1.86 m²</td>
                      <td className="p-2.5 text-slate-700">Combined distress footprint across outer wheelpath</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Average Pothole Depth</td>
                      <td className="p-2.5 font-mono">20 mm</td>
                      <td className="p-2.5 text-slate-700">Breach into top bituminous wearing layer</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Estimated Void Volume</td>
                      <td className="p-2.5 font-mono font-bold text-slate-900">0.0372 m³</td>
                      <td className="p-2.5 text-slate-700">Geometric void volume requiring DBM infill</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Resurfacing Length</td>
                      <td className="p-2.5 font-mono font-bold">120 m (0+000 to 0+120)</td>
                      <td className="p-2.5 text-slate-700">Priority corridor resurfacing zone</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Segment Average IRI</td>
                      <td className="p-2.5 font-mono font-bold text-[#ea4335]">5.20 m/km</td>
                      <td className="p-2.5 text-red-700 font-semibold">Very Poor Band (&gt; 5.0 m/km); Severe ride quality degradation</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-blue-50/40">
                      <td className="p-2.5 font-bold text-blue-900">Recommended Action</td>
                      <td className="p-2.5 font-bold text-blue-900" colSpan={2}>
                        4 Pothole Patching + 120 m Resurfacing (Cold milling, tack coat, DBM infill &amp; BC PMB-40 overlay)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 5: SECTION 1 - INTRODUCTION, ROAD GEOGRAPHY & SCOPE */}
        {/* ===================================================================== */}
        {shouldShow(5) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 5 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#1a73e8]" />
                <span>Section 1: Introduction, Road Geography &amp; Survey Scope (Page 5)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
              <p>
                The Network Survey Vehicle (NSV) survey provides high-resolution automated road condition inventory, longitudinal roughness profiling, transverse rut depth logging, and geo-referenced visual imagery for <strong>NKDA Road MAR 1111 (Biswa Bangla Sarani)</strong> located in Action Area I, New Town Kolkata.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 uppercase text-[11px] block">Corridor Geography</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li><strong>Corridor Name:</strong> Major Arterial Road MAR 1111 (Biswa Bangla Sarani)</li>
                    <li><strong>Administrative Zone:</strong> Action Area I, New Town Kolkata Development Authority</li>
                    <li><strong>Start Coordinates:</strong> 22.58168°N, 88.47288°E (Km 0+000)</li>
                    <li><strong>Terminal Coordinates:</strong> 22.58255°N, 88.47320°E (Km 0+120)</li>
                    <li><strong>Surrounding Landmarks:</strong> Near Coal India Bhawan / Novotel Intersection</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 uppercase text-[11px] block">Survey Scope &amp; Deliverables</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    <li>Automated Class-1 laser profilometry roughness logging in 20m increments.</li>
                    <li>Transverse scanning of wheelpath rut depths to 0.1mm vertical resolution.</li>
                    <li>Georeferenced orthophoto mapping of all structural pavement distresses.</li>
                    <li>Quantity takeoff directly compatible with WB PWD Schedule of Rates.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 6: SECTION 2 - NSV EQUIPMENT & CALIBRATION PROTOCOL */}
        {/* ===================================================================== */}
        {shouldShow(6) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 6 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#1a73e8]" />
                <span>Section 2: NSV Equipment &amp; Calibration Protocol (Page 6)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
              <p>
                The automated road inventory survey was executed utilizing a state-of-the-art <strong>ROMDAS Mark-IV Network Survey Vehicle</strong> conforming to ASTM E950 Class 1 profilometer specifications and MoRTH Highway Assessment Guidelines.
              </p>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-800 text-white font-bold text-[11px]">
                    <tr>
                      <th className="p-2.5">Subsystem</th>
                      <th className="p-2.5">Hardware / Sensor Model</th>
                      <th className="p-2.5">Technical Specification &amp; Calibration Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Longitudinal Profilometer</td>
                      <td className="p-2.5 font-mono">ROMDAS Dual Laser Bar</td>
                      <td className="p-2.5 text-slate-700">16 kHz high-speed laser height sensors; calibrated via block test 02-Nov-2026</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Transverse Profilometer</td>
                      <td className="p-2.5 font-mono">3D Scanning Laser Rut Bar</td>
                      <td className="p-2.5 text-slate-700">2,048 transverse elevation points across 3.5m carriageway; ±0.5mm accuracy</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Imaging Camera Array</td>
                      <td className="p-2.5 font-mono">Quad 4K Global Shutter</td>
                      <td className="p-2.5 text-slate-700">Pavement surface, forward right-of-way, and side inventory imaging at 50 fps</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Geospatial Positioning</td>
                      <td className="p-2.5 font-mono">Trimble SPS855 RTK-GNSS</td>
                      <td className="p-2.5 text-slate-700">Centimeter-level real-time kinematic accuracy with dual-frequency antenna</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Distance Measurement (DMI)</td>
                      <td className="p-2.5 font-mono">Optical Shaft Encoder</td>
                      <td className="p-2.5 text-slate-700">Mounted on rear axle; ±0.05% distance chainage precision over 1,000m run</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 7: SECTION 3 - ROAD CONDITION DATA & POTHOLE ASSESSMENTS */}
        {/* ===================================================================== */}
        {shouldShow(7) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 7 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#ea4335]" />
                <span>Section 3: Pavement Distress &amp; Pothole Assessment (Page 7)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
              <p>
                Pavement condition assessment records visible surface defects, extent, and severity. The verified distress inventory for NKDA Road MAR 1111 contains <strong>four distinct potholes</strong> across the 120m segment:
              </p>

              {/* Pothole Assessment Table (Pure m³, zero litres) */}
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead className="bg-slate-800 text-white font-bold">
                    <tr>
                      <th className="p-2">Defect ID</th>
                      <th className="p-2">Plan Area</th>
                      <th className="p-2">Depth</th>
                      <th className="p-2">Calculated Void Volume</th>
                      <th className="p-2">Chainage / Lane</th>
                      <th className="p-2">GPS Geotag</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-red-600">PH-01</td>
                      <td className="p-2">0.465 m²</td>
                      <td className="p-2 font-bold">20 mm</td>
                      <td className="p-2 font-bold text-slate-900">0.0093 m³</td>
                      <td className="p-2 text-slate-700 font-sans">Km 0+018 (Lane 1)</td>
                      <td className="p-2 text-slate-500">22.58168°N, 88.47288°E</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-red-600">PH-02</td>
                      <td className="p-2">0.465 m²</td>
                      <td className="p-2 font-bold">20 mm</td>
                      <td className="p-2 font-bold text-slate-900">0.0093 m³</td>
                      <td className="p-2 text-slate-700 font-sans">Km 0+045 (Lane 1)</td>
                      <td className="p-2 text-slate-500">22.58195°N, 88.47298°E</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-red-600">PH-03</td>
                      <td className="p-2">0.465 m²</td>
                      <td className="p-2 font-bold">20 mm</td>
                      <td className="p-2 font-bold text-slate-900">0.0093 m³</td>
                      <td className="p-2 text-slate-700 font-sans">Km 0+082 (Lane 1)</td>
                      <td className="p-2 text-slate-500">22.58232°N, 88.47312°E</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2 font-bold text-red-600">PH-04</td>
                      <td className="p-2">0.465 m²</td>
                      <td className="p-2 font-bold">20 mm</td>
                      <td className="p-2 font-bold text-slate-900">0.0093 m³</td>
                      <td className="p-2 text-slate-700 font-sans">Km 0+105 (Lane 1)</td>
                      <td className="p-2 text-slate-500">22.58255°N, 88.47320°E</td>
                    </tr>
                    <tr className="bg-slate-100 font-bold">
                      <td className="p-2 text-slate-900">TOTAL</td>
                      <td className="p-2 text-slate-900">1.860 m² (20 sq ft)</td>
                      <td className="p-2 text-slate-900">20 mm avg</td>
                      <td className="p-2 text-red-600 font-black">0.0372 m³</td>
                      <td className="p-2 text-slate-900 font-sans" colSpan={2}>
                        4 Potholes along 120m Resurfacing Segment
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Quantity Calculation Formula */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-950 font-mono text-[11px] space-y-1">
                <div className="font-bold">3.3 Civil Engineering Quantity Takeoff Formula:</div>
                <div>• Combined plan area = 20 sq ft × 0.092903 = <strong>1.858 m² ≈ 1.86 m²</strong></div>
                <div>• Average measured pothole depth = 20 mm = <strong>0.020 m</strong></div>
                <div>• Geometric void volume = 1.86 m² × 0.020 m = <strong>0.0372 m³</strong> (Per defect: 0.0093 m³)</div>
                <div className="text-[10px] text-blue-800 font-sans pt-1">
                  <em>Note: Measured in strict accordance with MoRTH Section 3004 (Bituminous Penetration Macadam &amp; Patch Repairs) in cubic metres (m³).</em>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 8: SECTION 4 - ROAD ROUGHNESS (IRI) & LASER WAVEFORM PROFILE */}
        {/* ===================================================================== */}
        {shouldShow(8) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 8 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#1a73e8]" />
                <span>Section 4: Road Roughness (IRI) &amp; Laser Waveform Profile (Page 8)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-500 text-[10px] block">Left Wheel Path IRI</span>
                  <span className="text-xl font-black font-mono text-blue-600">5.10 m/km</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Sample mean over 120m</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-500 text-[10px] block">Right Wheel Path IRI</span>
                  <span className="text-xl font-black font-mono text-red-600">5.30 m/km</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Sample mean over 120m</span>
                </div>
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
                  <span className="text-red-700 text-[10px] block font-semibold">Average Segment IRI</span>
                  <span className="text-xl font-black font-mono text-[#ea4335]">5.20 m/km</span>
                  <span className="text-[10px] text-red-600 font-bold block mt-0.5">Very Poor Band (&gt; 5.0)</span>
                </div>
              </div>

              {/* Faithful Reproduction of Page 8 Chart: Illustrative IRI Profile - 120 m Segment */}
              <div className="p-4 bg-white border border-slate-300 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                  <span className="font-bold text-slate-900">
                    Illustrative IRI Profile — 120 m Segment (Chainage 0+000 to 0+120)
                  </span>
                  <div className="flex items-center gap-4 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="w-3 h-1 bg-[#1a73e8] inline-block" />
                      <span>Left Wheel Path: 5.10 m/km</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium">
                      <span className="w-3 h-1 bg-[#ea4335] inline-block" />
                      <span>Right Wheel Path: 5.30 m/km</span>
                    </div>
                  </div>
                </div>

                {/* High-Resolution SVG Graph */}
                <div className="w-full bg-slate-50 rounded-lg p-3 border border-slate-200">
                  <svg viewBox="0 0 600 240" className="w-full h-auto select-none">
                    {/* Background grid */}
                    <line x1="60" y1="30" x2="570" y2="30" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="60" y1="70" x2="570" y2="70" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="60" y1="110" x2="570" y2="110" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="60" y1="150" x2="570" y2="150" stroke="#e2e8f0" strokeWidth="1" />
                    <line x1="60" y1="190" x2="570" y2="190" stroke="#cbd5e1" strokeWidth="1.5" />
                    <line x1="60" y1="20" x2="60" y2="190" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Y Axis Labels */}
                    <text x="20" y="34" fill="#64748b" fontSize="10" fontFamily="sans-serif">5.4 m/km</text>
                    <text x="20" y="74" fill="#64748b" fontSize="10" fontFamily="sans-serif">5.2 m/km</text>
                    <text x="20" y="114" fill="#64748b" fontSize="10" fontFamily="sans-serif">5.0 m/km</text>
                    <text x="20" y="154" fill="#64748b" fontSize="10" fontFamily="sans-serif">4.8 m/km</text>
                    <text x="20" y="194" fill="#64748b" fontSize="10" fontFamily="sans-serif">4.6 m/km</text>

                    {/* Threshold Line at 5.0 (Very Poor Band Boundary) */}
                    <line x1="60" y1="110" x2="570" y2="110" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" />
                    <text x="420" y="104" fill="#b45309" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                      Critical Roughness Threshold &gt; 5.0 m/km
                    </text>

                    {/* Right Wheel Path Line (Red, at y = 50 for 5.30 m/km) */}
                    <line x1="60" y1="50" x2="570" y2="50" stroke="#ea4335" strokeWidth="3" />
                    <circle cx="60" cy="50" r="3.5" fill="#ea4335" />
                    <circle cx="162" cy="50" r="3.5" fill="#ea4335" />
                    <circle cx="264" cy="50" r="3.5" fill="#ea4335" />
                    <circle cx="366" cy="50" r="3.5" fill="#ea4335" />
                    <circle cx="468" cy="50" r="3.5" fill="#ea4335" />
                    <circle cx="570" cy="50" r="3.5" fill="#ea4335" />

                    {/* Left Wheel Path Line (Blue, at y = 90 for 5.10 m/km) */}
                    <line x1="60" y1="90" x2="570" y2="90" stroke="#1a73e8" strokeWidth="3" />
                    <circle cx="60" cy="90" r="3.5" fill="#1a73e8" />
                    <circle cx="162" cy="90" r="3.5" fill="#1a73e8" />
                    <circle cx="264" cy="90" r="3.5" fill="#1a73e8" />
                    <circle cx="366" cy="90" r="3.5" fill="#1a73e8" />
                    <circle cx="468" cy="90" r="3.5" fill="#1a73e8" />
                    <circle cx="570" cy="90" r="3.5" fill="#1a73e8" />

                    {/* X Axis Labels & Ticks */}
                    <text x="55" y="210" fill="#64748b" fontSize="10" fontFamily="sans-serif">0</text>
                    <text x="154" y="210" fill="#64748b" fontSize="10" fontFamily="sans-serif">20</text>
                    <text x="256" y="210" fill="#64748b" fontSize="10" fontFamily="sans-serif">40</text>
                    <text x="358" y="210" fill="#64748b" fontSize="10" fontFamily="sans-serif">60</text>
                    <text x="460" y="210" fill="#64748b" fontSize="10" fontFamily="sans-serif">80</text>
                    <text x="510" y="210" fill="#64748b" fontSize="10" fontFamily="sans-serif">100</text>
                    <text x="560" y="210" fill="#64748b" fontSize="10" fontFamily="sans-serif">120</text>
                    <text x="280" y="230" fill="#475569" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                      Chainage Distance (Meters)
                    </text>
                  </svg>
                </div>

                {/* 4.4 IRI Classification Table */}
                <div className="overflow-x-auto rounded border border-slate-200">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold">
                      <tr>
                        <th className="p-2 border-r border-slate-200">IRI (m/km)</th>
                        <th className="p-2 border-r border-slate-200">Condition</th>
                        <th className="p-2">Ride Quality Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <tr>
                        <td className="p-1.5 border-r border-slate-200 font-mono">Less than 2.0</td>
                        <td className="p-1.5 border-r border-slate-200 font-semibold text-emerald-700">Excellent</td>
                        <td className="p-1.5">Very smooth ride</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 border-r border-slate-200 font-mono">2.0 – 3.0</td>
                        <td className="p-1.5 border-r border-slate-200 font-semibold text-emerald-600">Good</td>
                        <td className="p-1.5">Smooth urban ride</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 border-r border-slate-200 font-mono">3.0 – 4.0</td>
                        <td className="p-1.5 border-r border-slate-200 font-semibold text-amber-600">Fair</td>
                        <td className="p-1.5">Acceptable ride quality</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 border-r border-slate-200 font-mono">4.0 – 5.0</td>
                        <td className="p-1.5 border-r border-slate-200 font-semibold text-orange-600">Poor</td>
                        <td className="p-1.5">Rough; early maintenance warranted</td>
                      </tr>
                      <tr className="bg-red-50 font-bold">
                        <td className="p-1.5 border-r border-slate-200 font-mono text-red-700">Greater than 5.0 (5.20 m/km)</td>
                        <td className="p-1.5 border-r border-slate-200 text-red-700">Very Poor</td>
                        <td className="p-1.5 text-red-700">Severe roughness; mandatory immediate resurfacing</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 9: SECTION 5 - RUT DEPTH ANALYSIS & CROSS-PROFILOMETRY */}
        {/* ===================================================================== */}
        {shouldShow(9) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 9 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#1a73e8]" />
                <span>Section 5: Rut Depth Analysis &amp; Transverse Cross-Profilometry (Page 9)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
              <p>
                Transverse cross-profile measurements taken with the NSV 3D scanning laser bar show significant rutting and sub-surface consolidation along the slow vehicle lane (Lane 1). Under MoRTH guidelines, rut depths exceeding 20mm present hydroplaning hazards and require corrective mechanized profiling.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-center">
                  <span className="text-red-700 text-[10px] block font-semibold">Max Outer Wheelpath Rut</span>
                  <span className="text-xl font-black font-mono text-red-600">24.2 mm</span>
                  <span className="text-[10px] text-red-600 font-bold block mt-0.5">Exceeds 20mm Tolerance</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
                  <span className="text-amber-800 text-[10px] block font-semibold">Inner Wheelpath Rut</span>
                  <span className="text-xl font-black font-mono text-amber-700">12.4 mm</span>
                  <span className="text-[10px] text-amber-600 block mt-0.5">Moderate Severity</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <span className="text-slate-500 text-[10px] block">Mean Corridor Rut Depth</span>
                  <span className="text-xl font-black font-mono text-slate-800">18.2 mm</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Segment Average</span>
                </div>
              </div>

              {/* Transverse Cross-Profile Diagram */}
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-xs block">
                  Illustrative Transverse Cross-Profile Across 3.5m Lane 1 (Km 0+045)
                </span>
                <div className="w-full bg-white rounded border border-slate-300 p-2">
                  <svg viewBox="0 0 600 120" className="w-full h-auto select-none">
                    {/* Normal road profile line (dashed) */}
                    <line x1="40" y1="40" x2="560" y2="40" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4,4" />
                    <text x="45" y="32" fill="#64748b" fontSize="9" fontFamily="sans-serif">Nominal Finished Camber (2.5%)</text>

                    {/* Rutted Surface Profile */}
                    <path
                      d="M 40,40 Q 120,40 160,78 Q 200,90 240,42 Q 340,40 400,65 Q 440,72 480,40 L 560,40"
                      fill="none"
                      stroke="#ea4335"
                      strokeWidth="2.5"
                    />

                    {/* Depth markers */}
                    <line x1="200" y1="40" x2="200" y2="90" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="2,2" />
                    <text x="208" y="70" fill="#dc2626" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                      24.2 mm Rut
                    </text>

                    <line x1="440" y1="40" x2="440" y2="72" stroke="#d97706" strokeWidth="1.5" strokeDasharray="2,2" />
                    <text x="448" y="60" fill="#d97706" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                      12.4 mm
                    </text>

                    {/* X axis labels */}
                    <text x="40" y="110" fill="#64748b" fontSize="9" fontFamily="sans-serif">0.0m (Kerb Edge)</text>
                    <text x="170" y="110" fill="#64748b" fontSize="9" fontFamily="sans-serif">Outer Wheelpath</text>
                    <text x="410" y="110" fill="#64748b" fontSize="9" fontFamily="sans-serif">Inner Wheelpath</text>
                    <text x="520" y="110" fill="#64748b" fontSize="9" fontFamily="sans-serif">3.5m (Lane Stripe)</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 10: SECTION 6 - STRUCTURAL CRACKING & SURFACE TEXTURE */}
        {/* ===================================================================== */}
        {shouldShow(10) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 10 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1a73e8]" />
                <span>Section 6: Structural Cracking &amp; Pavement Texture Evaluation (Page 10)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
              <p>
                Automated surface distress recognition algorithms detected fatigue (alligator) cracking surrounding the pothole perimeters, indicating water ingress through oxidized micro-fissures in the aging wearing layer.
              </p>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-800 text-white font-bold text-[11px]">
                    <tr>
                      <th className="p-2.5">Distress Category</th>
                      <th className="p-2.5">Measured Quantity / Area</th>
                      <th className="p-2.5">Severity Level</th>
                      <th className="p-2.5">Failure Mechanism &amp; Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Fatigue / Alligator Cracking</td>
                      <td className="p-2.5 font-mono font-bold text-red-600">14.5% of wheelpath area</td>
                      <td className="p-2.5 text-red-600 font-semibold">High Severity</td>
                      <td className="p-2.5 text-slate-700">Tensile strain exhaustion at base of bituminous layer; moisture ingress</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Longitudinal Joint Cracking</td>
                      <td className="p-2.5 font-mono">8.2 linear meters</td>
                      <td className="p-2.5 text-amber-600 font-semibold">Medium Severity</td>
                      <td className="p-2.5 text-slate-700">Cold joint separation between slow and middle carriageway lanes</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Mean Profile Depth (MPD)</td>
                      <td className="p-2.5 font-mono font-bold text-slate-900">0.65 mm</td>
                      <td className="p-2.5 text-emerald-700 font-semibold">Acceptable Macrotexture</td>
                      <td className="p-2.5 text-slate-700">Adequate skid resistance at 40 km/h, but surface binder exhibits oxidation</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Bitumen Ravelling / Stripping</td>
                      <td className="p-2.5 font-mono">6.4 m² localized</td>
                      <td className="p-2.5 text-amber-600 font-semibold">Medium Severity</td>
                      <td className="p-2.5 text-slate-700">Loss of fine aggregate matrix surrounding PH-02 and PH-03</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 11: SECTION 7 - REMEDIATION STRATEGY & RECOMMENDATIONS */}
        {/* ===================================================================== */}
        {shouldShow(11) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 11 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#34a853]" />
                <span>Section 7: Remediation Strategy &amp; Engineering Recommendations (Page 11)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2 text-emerald-950">
                <div className="font-bold text-emerald-900 text-xs">Official Remediation Engineering Protocol:</div>
                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <strong>Phase 1: Pre-Overlay Cut-and-Fill Patching:</strong> Mechanized vertical saw-cutting around PH-01, PH-02, PH-03, and PH-04. Loose debris clearance with 100 psi compressed air. Rapid-setting cationic bitumen tack coat (RS-1 @ 0.25 kg/m²). Infill with Dense Bituminous Macadam (DBM Grade-II) at 150°C, compacted in 0.0093 m³ increments (cumulative 0.0372 m³) using a 10-ton tandem vibratory roller.
                  </div>
                  <div>
                    <strong>Phase 2: Mechanized Cold Milling:</strong> Continuous cold milling to a depth of 40mm across the entire 120m corridor segment (Chainage 0+000 to 0+120, width 10.5m = 1,260 m² area) to eliminate rut depressions and fatigue cracks.
                  </div>
                  <div>
                    <strong>Phase 3: Bituminous Concrete Resurfacing:</strong> Application of slow-setting emulsion tack coat (SS-1 @ 0.20 kg/m²), followed by 40mm thick Bituminous Concrete (BC Grade-1) overlay with Polymer Modified Bitumen (PMB-40), designed to restore segment IRI below 2.0 m/km.
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 space-y-1 text-[11px]">
                <span className="font-bold block">Tender Release Integration:</span>
                <p>
                  These quantities have been calculated for tender release under the West Bengal PWD Schedule of Rates (SOR 2026). Total project package cost is estimated at <strong>₹28.20 Lakhs</strong> (₹28,20,000). Direct e-NIT publishing is authorized via <a href="https://wbtenders.gov.in" target="_blank" rel="noreferrer" className="text-blue-700 underline font-mono">wbtenders.gov.in</a>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 12: ANNEXURE 1 - FIELD PHOTO REGISTER */}
        {/* ===================================================================== */}
        {shouldShow(12) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 12 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Annexure 1: Pavement Condition &amp; Drone Photo Register (Page 12)</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500 font-normal">4 Defects Verified</span>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
              <p className="text-slate-600">
                Geotagged photographic records of all four potholes captured by the calibrated drone aerial camera and ground NSV imaging array. Void volumes are verified in standard cubic metres (m³):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {photoRegister.map((item) => (
                  <div
                    key={item.photoId}
                    className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs hover:shadow-sm transition group"
                  >
                    <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                      <img
                        src={item.imgUrl}
                        alt={item.defectId}
                        className="w-full h-full object-cover transition group-hover:scale-105"
                      />
                      <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-red-600 text-white shadow">
                        {item.photoId} • {item.defectId}
                      </span>
                      <button
                        onClick={() =>
                          setSelectedPhotoModal({
                            id: item.photoId,
                            title: `${item.photoId} (${item.defectId})`,
                            chainage: item.chainage,
                            gps: item.gps,
                            imgUrl: item.imgUrl,
                          })
                        }
                        className="absolute bottom-2 right-2 p-1 bg-black/75 hover:bg-blue-600 text-white rounded text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer shadow"
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Zoom</span>
                      </button>
                    </div>

                    <div className="p-2.5 space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{item.defectId}</span>
                        <span className="font-mono font-bold text-red-600">{item.depth} depth</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{item.chainage}</div>
                      <div className="text-[10px] text-slate-600">
                        Dim: <span className="font-mono">{item.dimensions}</span>
                      </div>
                      <div className="text-[10px] text-slate-600">
                        Vol: <span className="font-mono font-bold text-slate-800">{item.volume}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 truncate" title={item.remarks}>
                        {item.remarks}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 13: ANNEXURE 2 - CHAINAGE-WISE IRI SCHEDULE TABLE */}
        {/* ===================================================================== */}
        {shouldShow(13) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 13 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#1a73e8]" />
                <span>Annexure 2: Chainage-Wise Roughness (IRI) Schedule (Page 13)</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500 font-normal">Six 20m Intervals</span>
            </div>

            <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse text-[11px] font-mono">
                  <thead className="bg-[#1a73e8] text-white font-bold">
                    <tr>
                      <th className="p-2">Road</th>
                      <th className="p-2">Section</th>
                      <th className="p-2">Start Ch.</th>
                      <th className="p-2">End Ch.</th>
                      <th className="p-2">Dir.</th>
                      <th className="p-2">Lane</th>
                      <th className="p-2">Left IRI</th>
                      <th className="p-2">Right IRI</th>
                      <th className="p-2">Avg IRI</th>
                      <th className="p-2">Condition</th>
                      <th className="p-2">Speed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {iriSchedule.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-900">MAR1111</td>
                        <td className="p-2 text-slate-600">NKDA-01</td>
                        <td className="p-2 text-slate-800">{row.startCh}</td>
                        <td className="p-2 text-slate-800">{row.endCh}</td>
                        <td className="p-2 text-slate-500">{row.dir}</td>
                        <td className="p-2 font-semibold text-slate-700">{row.lane}</td>
                        <td className="p-2 text-blue-700 font-bold">{row.leftIri}</td>
                        <td className="p-2 text-red-700 font-bold">{row.rightIri}</td>
                        <td className="p-2 text-red-600 font-black bg-red-50/50">{row.avgIri}</td>
                        <td className="p-2 text-red-600 font-semibold">{row.band}</td>
                        <td className="p-2 text-slate-500">{row.speed}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100 font-bold text-slate-900">
                      <td className="p-2" colSpan={6}>
                        Segment Summary (120 m Total Resurfacing Segment)
                      </td>
                      <td className="p-2 text-blue-700">5.10 m/km</td>
                      <td className="p-2 text-red-700">5.30 m/km</td>
                      <td className="p-2 text-[#ea4335]">5.20 m/km</td>
                      <td className="p-2 text-red-700">Very Poor</td>
                      <td className="p-2 text-slate-600">40 km/h</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="text-[10px] text-slate-500 font-sans">
                *Direction: Both carriageways assessed. **Survey speed: Calibrated 40 km/h constant deployment speed under standard vehicle damping.
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* PAGE 14: ANNEXURE 3 - STATUTORY AUTHORITY VERIFICATION & SIGN-OFFS */}
        {/* ===================================================================== */}
        {shouldShow(14) && (
          <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
            <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
              PAGE 14 OF 14
            </div>

            <div className="p-6 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#34a853]" />
                <span>Annexure 3: Statutory Authority Verification &amp; Official Sign-Offs (Page 14)</span>
              </h3>
            </div>

            <div className="p-6 md:p-8 space-y-6 text-xs leading-relaxed">
              <p>
                In accordance with West Bengal Urban Infrastructure Development norms and New Town Kolkata Development Authority standard operating procedures, this Network Survey Vehicle Condition Dossier has been formally reviewed, verified, and certified:
              </p>

              {/* Official Sign-Off Table */}
              <div className="overflow-x-auto rounded-lg border border-slate-300">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-800 text-white font-bold">
                    <tr>
                      <th className="p-2.5">Review Level</th>
                      <th className="p-2.5">Signatory Authority</th>
                      <th className="p-2.5">Designation &amp; Organization</th>
                      <th className="p-2.5">Verification Status</th>
                      <th className="p-2.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Prepared by</td>
                      <td className="p-2.5 font-semibold text-slate-800">Er. Rahul Baruah</td>
                      <td className="p-2.5 text-slate-600">Geospatial Highway &amp; NSV Specialist</td>
                      <td className="p-2.5 text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34a853]" />
                        <span>Certified &amp; Digitally Signed</span>
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">16 Nov 2026</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-900">Checked by</td>
                      <td className="p-2.5 font-semibold text-slate-800">Er. Subhashis Sen</td>
                      <td className="p-2.5 text-slate-600">Executive Engineer (Roads &amp; Quality Control), NKDA</td>
                      <td className="p-2.5 text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34a853]" />
                        <span>Verified &amp; Concurred</span>
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">16 Nov 2026</td>
                    </tr>
                    <tr className="hover:bg-slate-50 bg-emerald-50/30">
                      <td className="p-2.5 font-bold text-slate-900">Approved by</td>
                      <td className="p-2.5 font-semibold text-slate-900">Dr. Debashis Sen, IAS (Retd)</td>
                      <td className="p-2.5 text-slate-700">Chief Executive Officer (CEO), NKDA</td>
                      <td className="p-2.5 text-emerald-700 font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#34a853]" />
                        <span>Sanctioned for Tender Release</span>
                      </td>
                      <td className="p-2.5 font-mono text-slate-600">16 Nov 2026</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Statutory Seal Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Field Verification</span>
                  <div className="font-bold text-slate-800">SkyScan Geospatial</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold">SEAL: SS/NSV/2026/044</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Technical Review</span>
                  <div className="font-bold text-slate-800">EE (Roads &amp; Building), NKDA</div>
                  <div className="text-[10px] font-mono text-emerald-700 font-semibold">SEAL: NKDA/ENG/QC/88</div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center space-y-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Administrative Sanction</span>
                  <div className="font-bold text-emerald-950">Chief Executive Officer, NKDA</div>
                  <div className="text-[10px] font-mono text-emerald-800 font-semibold">SANCTION: NKDA/ADM/2026-91</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Footer Call-to-Action to Tender Release */}
      <div className="p-6 bg-slate-100 border border-slate-300 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="font-bold text-slate-900 text-xs">
            Next Pipeline Phase: Detailed Project Report (DPR) &amp; Tender Release
          </div>
          <div className="text-[11px] text-slate-500">
            The 4 potholes (0.0372 m³ void) and 120m resurfacing parameters are ready for bill calculation, 3-stage approval, and e-NIT generation.
          </div>
        </div>

        <button
          onClick={() => navigate(`/dpr/${details.roadCode}`)}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer flex items-center justify-center gap-2 active:scale-98 whitespace-nowrap"
        >
          <span>Proceed to DPR &amp; Tender Release</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
