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
  Download,
  ExternalLink,
  Eye,
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
  const [viewMode, setViewMode] = useState<'dossier' | 'pdf'>('dossier');
  const [activePage, setActivePage] = useState<number | 'all'>(initialPage);
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{
    id: string;
    title: string;
    chainage: string;
    gps: string;
    imgUrl: string;
  } | null>(null);

  const pdfUrl = '/reports/nsv_mar_1111_official_report.pdf';

  // Photo register data matching Annexure 1 (Page 13)
  const photoRegister = [
    {
      photoId: 'IMG-01',
      defectId: 'PH-01',
      chainage: 'Km 0+018',
      direction: 'To be captured (Lane 1)',
      gps: '22.58168°N, 88.47288°E',
      dimensions: '68cm × 68cm (0.465 m²)',
      depth: '20 mm',
      volume: '0.0093 m³',
      remarks: 'Pre-repair overview; wearing course localized patch',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg',
    },
    {
      photoId: 'IMG-02',
      defectId: 'PH-02',
      chainage: 'Km 0+045',
      direction: 'To be captured (Lane 1)',
      gps: '22.58195°N, 88.47298°E',
      dimensions: '68cm × 68cm (0.465 m²)',
      depth: '20 mm',
      volume: '0.0093 m³',
      remarks: 'Pre-repair overview; localized aggregate loss',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Pothole_Big.jpg',
    },
    {
      photoId: 'IMG-03',
      defectId: 'PH-03',
      chainage: 'Km 0+082',
      direction: 'To be captured (Lane 1)',
      gps: '22.58232°N, 88.47312°E',
      dimensions: '68cm × 68cm (0.465 m²)',
      depth: '20 mm',
      volume: '0.0093 m³',
      remarks: 'Pre-repair overview; void breach along interval #4',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Pothole_repair.jpg',
    },
    {
      photoId: 'IMG-04',
      defectId: 'PH-04',
      chainage: 'Km 0+105',
      direction: 'To be captured (Lane 1)',
      gps: '22.58255°N, 88.47320°E',
      dimensions: '68cm × 68cm (0.465 m²)',
      depth: '20 mm',
      volume: '0.0093 m³',
      remarks: 'Pre-repair overview; surface depression near Km 0+120',
      imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_pothole.jpg',
    },
  ];

  // Annexure 2: IRI 20m schedule (Page 14)
  const iriSchedule = [
    { startCh: '0+000', endCh: '0+020', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**' },
    { startCh: '0+020', endCh: '0+040', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**' },
    { startCh: '0+040', endCh: '0+060', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**' },
    { startCh: '0+060', endCh: '0+080', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**' },
    { startCh: '0+080', endCh: '0+100', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**' },
    { startCh: '0+100', endCh: '0+120', dir: 'Both*', lane: '1', leftIri: '5.10', rightIri: '5.30', avgIri: '5.20', speed: '40**' },
  ];

  // Official 15-Page List directly matching the supplied PDF
  const pageList = [
    { num: 1, title: 'Title & Cover', label: 'Cover & Project Information' },
    { num: 2, title: 'Project Info & Corridor', label: 'Particulars & Survey Components' },
    { num: 3, title: 'Table of Contents', label: 'Report Structure & 12 Sections' },
    { num: 4, title: 'Executive Summary', label: 'Findings, 4 Potholes & Cost (₹2.52L)' },
    { num: 5, title: 'Sec 1: Introduction', label: 'Objectives & Project Scope' },
    { num: 6, title: 'Sec 2: Methodology', label: 'NSV Equipment & Quality Control' },
    { num: 7, title: 'Sec 3: Road Condition', label: 'Pothole Assessment (0.0372 m³)' },
    { num: 8, title: 'Sec 4: Roughness (IRI)', label: 'IRI 5.20 m/km & Profile Graph' },
    { num: 9, title: 'Sec 5 & 6: Rutting & Geometry', label: 'Rutting Data & Road Inventory' },
    { num: 10, title: 'Sec 7-9: Furniture & GPS', label: 'Furniture, Amenities & GPS Data' },
    { num: 11, title: 'Sec 10 & 11: Conclusions', label: 'Recommendations & Sign-off' },
    { num: 12, title: 'Sec 12: Cost Estimation', label: 'Part 1 (₹372) + Part 2 (₹2,52,000)' },
    { num: 13, title: 'Annexure 1: Pavement', label: 'Pothole Data & Photo Register' },
    { num: 14, title: 'Annexure 2: IRI Schedule', label: 'Chainage-Wise 20m Schedule' },
    { num: 15, title: 'Annexure 3: Checklist', label: 'Rutting Schedule & Report Limits' },
  ];

  const shouldShow = (pageNum: number) => activePage === 'all' || activePage === pageNum;

  const goToPrev = () => {
    if (activePage === 'all') setActivePage(15);
    else if (activePage > 1) setActivePage((activePage - 1) as number);
    else setActivePage('all');
  };

  const goToNext = () => {
    if (activePage === 'all') setActivePage(1);
    else if (activePage < 15) setActivePage((activePage + 1) as number);
    else setActivePage('all');
  };

  return (
    <div className="w-full min-w-0 space-y-4">
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
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              OFFICIAL 15-PAGE STATUTORY REPORT
            </span>
            <span className="text-xs text-slate-300 font-mono">NKDA Road MAR 1111 (Biswa Bangla Sarani)</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            Network Survey Vehicle (NSV) Survey Report
          </h2>
          <p className="text-xs text-slate-300">
            Road Condition Assessment &amp; Maintenance Recommendation • 120m Resurfacing Segment • 4 Potholes (1.86 m², 20mm, 0.0372 m³) • Segment IRI 5.20 m/km
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white/10 p-1 rounded-lg flex items-center gap-1 border border-white/20">
            <button
              onClick={() => setViewMode('dossier')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'dossier'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>15-Page Dossier</span>
            </button>
            <button
              onClick={() => setViewMode('pdf')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'pdf'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5 text-red-600" />
              <span>Original PDF</span>
            </button>
          </div>

          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            download="nsv_mar_1111_official_report.pdf"
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download PDF</span>
          </a>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Embedded PDF View Mode */}
      {viewMode === 'pdf' && (
        <div className="bg-white border-2 border-slate-300 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800">
                Official PDF Viewer: <span className="font-mono text-blue-600">nsv_mar_1111_official_report.pdf</span> (15 Pages)
              </span>
            </div>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Open in new window</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="w-full h-[85vh] min-h-[600px] rounded-lg overflow-hidden border border-slate-300 bg-slate-900">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              title="Official NSV Report PDF (15 Pages)"
              className="w-full h-full border-0"
            />
          </div>
        </div>
      )}

      {/* 15-Page Dossier Interactive Explorer */}
      {viewMode === 'dossier' && (
        <>
          {/* 15-PAGE DOCUMENT NAVIGATOR BAR */}
          <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <ListOrdered className="w-4 h-4 text-[#1a73e8]" />
                  <span>Document Explorer (Official 15 Pages):</span>
                </span>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {activePage === 'all' ? 'Complete 15-Page Dossier' : `Page ${activePage} of 15`}
                </span>
              </div>

              {/* Prev / Next controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={goToPrev}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 transition cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={() => setActivePage('all')}
                  className={`px-2.5 py-1 text-xs font-semibold rounded border transition cursor-pointer ${
                    activePage === 'all'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  All 15 Pages
                </button>
                <button
                  onClick={goToNext}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-300 transition cursor-pointer flex items-center gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 15-Page Fast Jump Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {pageList.map((p) => {
                const isActive = activePage === p.num;
                return (
                  <button
                    key={p.num}
                    onClick={() => setActivePage(p.num)}
                    title={p.label}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 border ${
                      isActive
                        ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className="font-mono text-[10px] opacity-75">#{p.num}</span>
                    <span>{p.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 15-PAGE DOSSIER CONTENT CONTAINER */}
          <div className="space-y-6">
            {/* ===================================================================== */}
            {/* PAGE 1: TITLE & COVER SHEET */}
            {/* ===================================================================== */}
            {shouldShow(1) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 1 OF 15
                </div>

                <div className="p-8 text-center space-y-4 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
                  <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 border-2 border-blue-300 flex items-center justify-center text-blue-700 shadow-xs">
                    <Building className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                      NETWORK SURVEY VEHICLE (NSV)
                    </h1>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
                      SURVEY REPORT
                    </h2>
                    <div className="text-xs uppercase tracking-widest font-extrabold text-slate-500 pt-1">
                      ROAD CONDITION ASSESSMENT &amp; MAINTENANCE RECOMMENDATION
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">FOR</div>
                    <div className="inline-block mt-1 px-5 py-2 bg-blue-100 border border-blue-300 rounded-lg text-blue-900 font-black text-lg font-mono">
                      NKDA ROAD – MAR 1111
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-1">
                      New Town / NKDA Area, West Bengal
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 space-y-4 text-xs">
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                        <tr>
                          <th className="p-2.5 w-1/3">PROJECT INFORMATION</th>
                          <th className="p-2.5">DETAILS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        <tr>
                          <td className="p-2.5 font-bold bg-slate-50">Project Road</td>
                          <td className="p-2.5">NKDA Road MAR 1111</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold bg-slate-50">Project Authority / Client</td>
                          <td className="p-2.5">New Town Kolkata Development Authority (NKDA) – sample designation</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold bg-slate-50">Survey Type</td>
                          <td className="p-2.5">Network Survey Vehicle (NSV) – sample report format</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold bg-slate-50">Survey Coverage</td>
                          <td className="p-2.5">Illustrative 120 m resurfacing segment + localized pothole observations</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold bg-slate-50">Pavement Type</td>
                          <td className="p-2.5">Assumed flexible bituminous pavement; verify in field</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold bg-slate-50">Report Status</td>
                          <td className="p-2.5 font-bold text-amber-700">SAMPLE / ASSUMPTION-BASED – NOT A FIELD-VERIFIED SURVEY</td>
                        </tr>
                        <tr>
                          <td className="p-2.5 font-bold bg-slate-50">Prepared Date</td>
                          <td className="p-2.5 font-mono">16 November 2026</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 space-y-1.5 leading-relaxed text-[11px]">
                    <span className="font-bold block uppercase tracking-wide text-amber-950">
                      IMPORTANT DISCLAIMER:
                    </span>
                    <p>
                      This report follows the chapter structure and engineering presentation of the attached PR-4 NSV report. The pothole quantities and resurfacing length are based on the user-supplied assumptions. The IRI readings, chainages, lane allocation and defect-wise breakdown shown in the annexures are illustrative sample data only. No NSV vehicle run, laser profile, GPS logging, image capture or field inspection has been performed for this document. Do not submit it as an actual measured NSV report without replacing sample data with verified survey outputs.
                    </p>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 1</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 2: PROJECT INFORMATION & CORRIDOR */}
            {/* ===================================================================== */}
            {shouldShow(2) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 2 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1a73e8]" />
                    <span>Project Information &amp; Survey Components (Page 2)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-6 text-xs leading-relaxed">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">PROJECT INFORMATION</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 w-1/3">Particulars</th>
                            <th className="p-2.5">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-800">
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Report Title</td>
                            <td className="p-2.5">Network Survey Vehicle (NSV) Survey Report</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Project Road</td>
                            <td className="p-2.5 font-bold">NKDA Road MAR 1111</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Location</td>
                            <td className="p-2.5">New Town / NKDA Area, West Bengal</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Authority</td>
                            <td className="p-2.5">New Town Kolkata Development Authority (NKDA) – sample designation</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Road Type</td>
                            <td className="p-2.5">Urban road; exact functional classification not provided</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Pavement</td>
                            <td className="p-2.5">Flexible bituminous pavement – assumed for sample</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Survey Method</td>
                            <td className="p-2.5">NSV-style condition assessment format; sample data, not actual NSV acquisition</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Potholes</td>
                            <td className="p-2.5 font-bold text-red-600">4 Nos.; combined area 20 sq ft (&asymp;1.86 m²); average depth 20 mm</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Resurfacing Requirement</td>
                            <td className="p-2.5 font-mono font-bold">120 m, selected for illustrative IRI assessment</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Illustrative IRI</td>
                            <td className="p-2.5 font-mono font-bold text-red-600">5.20 m/km (segment average)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Report Version</td>
                            <td className="p-2.5">Sample Report – Draft for review</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase text-xs">PROJECT CORRIDOR</h4>
                    <p className="text-slate-700">
                      <strong>Road:</strong> NKDA Road MAR 1111<br />
                      <strong>Assessment segment:</strong> Chainage 0+000 to 0+120 (provisional sample chainage only). The actual start/end chainage and GPS coordinates have not been provided and must be confirmed during field survey.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase text-xs">SURVEY COMPONENTS</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                      <li>Pavement condition survey and distress inventory</li>
                      <li>Pothole count, area and depth assessment</li>
                      <li>Road roughness assessment using IRI (illustrative sample values)</li>
                      <li>Rutting and surface deformation assessment (sample placeholders)</li>
                      <li>Road inventory and geometry record (limited to supplied information)</li>
                      <li>GPS / chainage referencing requirements</li>
                      <li>Maintenance and resurfacing recommendations</li>
                    </ul>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 2</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 3: TABLE OF CONTENTS */}
            {/* ===================================================================== */}
            {shouldShow(3) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 3 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-[#1a73e8]" />
                    <span>Table of Contents (Page 3)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-4 text-xs">
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                        <tr>
                          <th className="p-2.5 w-1/4">Section</th>
                          <th className="p-2.5">Title</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-800">
                        <tr className="hover:bg-slate-50 font-semibold bg-blue-50/30">
                          <td className="p-2.5 text-blue-900">Executive Summary</td>
                          <td className="p-2.5">Key findings and intervention recommendation</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">1</td>
                          <td className="p-2.5">Introduction, objectives, scope and project details</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">2</td>
                          <td className="p-2.5">NSV methodology, equipment and quality control</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">3</td>
                          <td className="p-2.5">Road condition data and pavement distress assessment</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">4</td>
                          <td className="p-2.5">Road roughness data and IRI assessment</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">5</td>
                          <td className="p-2.5">Rutting data</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">6</td>
                          <td className="p-2.5">Road inventory and geometry</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">7</td>
                          <td className="p-2.5">Road furniture and utilities – data limitations</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">8</td>
                          <td className="p-2.5">Structures and wayside amenities – data limitations</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">9</td>
                          <td className="p-2.5">GPS and location reference data</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">10</td>
                          <td className="p-2.5">Observations and findings</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">11</td>
                          <td className="p-2.5">Conclusions and recommendations</td>
                        </tr>
                        <tr className="hover:bg-slate-50 font-bold bg-amber-50/40">
                          <td className="p-2.5 text-amber-900">12</td>
                          <td className="p-2.5">Cost estimation and key contract parameters</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-700">Annexure 1</td>
                          <td className="p-2.5">Pavement condition and pothole data</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-700">Annexure 2</td>
                          <td className="p-2.5">IRI chainage-wise sample data</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-slate-50">
                          <td className="p-2.5 font-semibold text-slate-700">Annexure 3</td>
                          <td className="p-2.5">Rutting sample data and survey checklist</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 3</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 4: EXECUTIVE SUMMARY */}
            {/* ===================================================================== */}
            {shouldShow(4) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 4 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#ea4335]" />
                    <span>Executive Summary &amp; Key Findings (Page 4)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-4 text-xs leading-relaxed">
                  <p>
                    This sample Network Survey Vehicle (NSV) report has been prepared for <strong>NKDA Road MAR 1111</strong> using the defect quantities and resurfacing length specified for the exercise. The assumed pavement distress inventory records <strong>four potholes</strong> having a combined area of <strong>20 sq ft (approximately 1.86 m²)</strong> and an average depth of <strong>20 mm</strong>. The calculated geometric void volume is approximately <strong>0.0372 m³ (37.2 litres)</strong>.
                  </p>

                  <p>
                    A <strong>120 m road section</strong> is proposed for resurfacing assessment on the basis of an illustrative segment-average IRI of <strong>5.20 m/km</strong>. In the classification reproduced in the attached reference report, IRI greater than 5.0 m/km falls in the <strong>Very Poor / Very Rough band</strong>. The sample value therefore provides a clear engineering rationale for prioritizing the 120 m segment for detailed pavement investigation and resurfacing design.
                  </p>

                  {/* Executive Summary Parameter Table */}
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                        <tr>
                          <th className="p-2.5">Parameter</th>
                          <th className="p-2.5">Sample result</th>
                          <th className="p-2.5">Assessment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">Pothole count</td>
                          <td className="p-2.5 font-semibold text-red-600">4 Nos.</td>
                          <td className="p-2.5 text-slate-700">Localized patch repairs required</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">Combined pothole area</td>
                          <td className="p-2.5 font-mono font-bold">20 sq ft / 1.86 m²</td>
                          <td className="p-2.5 text-slate-700">User-supplied assumption</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">Average depth</td>
                          <td className="p-2.5 font-mono">20 mm</td>
                          <td className="p-2.5 text-slate-700">User-supplied assumption</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">Estimated void volume</td>
                          <td className="p-2.5 font-mono font-bold text-slate-900">0.0372 m³</td>
                          <td className="p-2.5 text-slate-700">Geometric estimate only</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">Resurfacing length</td>
                          <td className="p-2.5 font-mono font-bold">120 m</td>
                          <td className="p-2.5 text-slate-700">User-supplied requirement</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">Segment average IRI</td>
                          <td className="p-2.5 font-mono font-bold text-[#ea4335]">5.20 m/km</td>
                          <td className="p-2.5 text-red-700 font-semibold">Illustrative; Very Poor band (&gt;5.0)</td>
                        </tr>
                        <tr className="hover:bg-slate-50 bg-blue-50/40">
                          <td className="p-2.5 font-bold text-blue-900">Recommended action</td>
                          <td className="p-2.5 font-bold text-blue-900">Pothole patching + 120 m resurfacing assessment</td>
                          <td className="p-2.5 text-blue-800">Subject to field verification and design</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <h4 className="font-bold text-slate-900 uppercase text-xs">Key Engineering Notes</h4>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1 text-[11px]">
                      <li>The IRI value is presented as an assumed sample reading and is not a measured profilometer result.</li>
                      <li>A high IRI identifies poor ride quality but does not, by itself, establish overlay thickness or prove that resurfacing alone is structurally adequate.</li>
                      <li>The actual resurfacing limits must be confirmed from chainage-wise IRI, visual distress mapping and pavement investigation.</li>
                      <li>Pothole repair quantities are geometric estimates; final payable quantities must be measured after cutting to sound pavement.</li>
                    </ul>
                  </div>

                  {/* Indicative Cost Estimate directly from Page 4 */}
                  <div className="space-y-2 pt-2">
                    <h4 className="font-bold text-slate-900 uppercase text-xs">Indicative Cost Estimate</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2 w-12">Part</th>
                            <th className="p-2">Work</th>
                            <th className="p-2">Formula (rate in Rs. per m³)</th>
                            <th className="p-2 text-right">Estimated Cost (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-800">
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-center">1</td>
                            <td className="p-2 font-semibold">Filling of potholes</td>
                            <td className="p-2 font-mono text-[11px]">
                              Potholes &times; avg. depth &times; avg. area &times; 10,000 Rs<br />
                              = 4 &times; 0.020 m &times; 0.465 m² &times; 10,000
                            </td>
                            <td className="p-2 text-right font-mono font-bold text-blue-700">372</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-center">2</td>
                            <td className="p-2 font-semibold">Resurfacing with Bituminous Concrete</td>
                            <td className="p-2 font-mono text-[11px]">
                              Length &times; avg. depth of surfacing &times; width of road &times; 30,000 Rs<br />
                              = 120 m &times; 0.010 m &times; 7.0 m* &times; 30,000
                            </td>
                            <td className="p-2 text-right font-mono font-bold text-blue-700">252,000</td>
                          </tr>
                          <tr className="bg-emerald-50 font-bold border-t-2 border-emerald-300">
                            <td className="p-2 text-center" colSpan={3}>
                              Total Indicative Cost (Part 1 + Part 2)
                            </td>
                            <td className="p-2 text-right font-mono font-black text-emerald-800 text-sm">
                              Rs. 252,372
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-[10px] text-slate-500 italic">
                      * Road width is not provided; 7.0 m is assumed for illustration only (see Section 12).
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-700">
                    <strong>Key parameters:</strong> completion period <strong>30 days</strong>, defect liability period <strong>1 year</strong> from completion, security deposit <strong>10%</strong> of each running bill, no mobilisation advance, no price escalation.
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 4</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 5: SECTION 1 - INTRODUCTION */}
            {/* ===================================================================== */}
            {shouldShow(5) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 5 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#1a73e8]" />
                    <span>SECTION – 1: INTRODUCTION (Page 5)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-5 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">1.1 General</h4>
                    <p>
                      The Network Survey Vehicle (NSV) approach provides a systematic means of documenting road inventory, pavement surface condition, longitudinal roughness, rutting and geo-referenced roadside assets. This sample report applies the presentation framework of the supplied PR-4 NSV report to NKDA Road MAR 1111. The available project inputs are limited to pothole count, combined pothole area, average depth and resurfacing length.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">1.2 Objective of NSV Survey</h4>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>Document the assumed pavement defects and maintenance needs.</li>
                      <li>Present an IRI-based justification for prioritizing a 120 m resurfacing segment.</li>
                      <li>Provide a structured record for field verification, asset management and maintenance planning.</li>
                      <li>Identify the additional measurements required to convert this sample into an official NSV report.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">1.3 Scope of Services</h4>
                    <p>
                      The intended NSV scope, following the reference report, comprises pavement condition survey, road inventory, road geometry, roughness assessment, rutting assessment, asset inventory, GPS referencing and digital video imaging. For the present sample, only the stated pothole and resurfacing inputs are treated as supplied facts. All other survey outputs are marked as pending field data.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">1.4 Project Details</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 w-1/3">Particular</th>
                            <th className="p-2.5">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Project</td>
                            <td className="p-2.5">NKDA Road MAR 1111</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Location</td>
                            <td className="p-2.5">NKDA / New Town area, West Bengal</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Assessment purpose</td>
                            <td className="p-2.5">Pavement condition and maintenance planning</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Road length under resurfacing consideration</td>
                            <td className="p-2.5 font-mono font-bold">120 m</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Survey date / equipment details</td>
                            <td className="p-2.5 text-slate-500 italic">Not supplied – to be entered after actual NSV survey</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 5</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 6: SECTION 2 - METHODOLOGY */}
            {/* ===================================================================== */}
            {shouldShow(6) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 6 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#1a73e8]" />
                    <span>SECTION – 2: METHODOLOGY (Page 6)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-5 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">2.1 Data Collection Methodology</h4>
                    <p>
                      For a field NSV survey, the reference report describes route planning, equipment calibration, NSV deployment, digital imaging, laser profile measurement, GPS/INS positioning, distance measurement, data synchronization, quality control and report preparation. The same sequence is recommended for the actual NKDA Road MAR 1111 survey.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">2.2 NSV Equipment and Outputs</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 w-1/3">System</th>
                            <th className="p-2.5">Purpose / expected output</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-bold bg-slate-50">Laser profilometer</td>
                            <td className="p-2.5">Longitudinal profile, IRI and transverse profile / rut depth</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold bg-slate-50">Digital imaging system</td>
                            <td className="p-2.5">Continuous roadway imagery and distress documentation</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold bg-slate-50">GPS + INS</td>
                            <td className="p-2.5">Position, heading, trajectory and geo-referencing</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold bg-slate-50">Distance Measuring Instrument (DMI)</td>
                            <td className="p-2.5">Chainage and distance referencing</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold bg-slate-50">Data acquisition system</td>
                            <td className="p-2.5">Time synchronization, storage and export of survey records</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">2.3 Quality Control and Validation</h4>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>Verify calibration certificates and sensor setup before deployment.</li>
                      <li>Confirm odometer / DMI distance against a known reference length.</li>
                      <li>Check GPS/INS lock, time synchronization and image capture continuity.</li>
                      <li>Review profile data for spikes, dropouts, braking effects and abnormal vehicle movement.</li>
                      <li>Validate chainage and direction of travel against field control points.</li>
                      <li>Retain raw profile files, processed IRI outputs, geotagged images and calibration records.</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 space-y-1 text-[11px]">
                    <span className="font-bold block uppercase tracking-wide text-amber-950">
                      2.4 Status of Data in this Sample:
                    </span>
                    <p>
                      No physical NSV deployment is represented by this document. The IRI series in Annexure 2 is a constructed sample dataset designed to be internally consistent with a segment average of 5.20 m/km. It must be replaced by actual laser profilometer outputs before official issue.
                    </p>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 6</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 7: SECTION 3 - ROAD CONDITION DATA */}
            {/* ===================================================================== */}
            {shouldShow(7) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 7 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>SECTION – 3: ROAD CONDITION DATA (Page 7)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-5 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">3.1 Introduction</h4>
                    <p>
                      Pavement condition assessment records visible surface defects and their extent and severity. The user-specified sample inventory for NKDA Road MAR 1111 contains four potholes with a combined plan area of 20 sq ft (approximately 1.86 m²) and average depth of 20 mm.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">3.2 Pothole Assessment</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5">Defect ID</th>
                            <th className="p-2.5">Area (m²)</th>
                            <th className="p-2.5">Depth (mm)</th>
                            <th className="p-2.5">Volume (m³)</th>
                            <th className="p-2.5">Location</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                          <tr className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900">PH-01</td>
                            <td className="p-2.5">0.465</td>
                            <td className="p-2.5">20</td>
                            <td className="p-2.5 font-bold text-blue-700">0.0093</td>
                            <td className="p-2.5 font-sans text-slate-500">Chainage / GPS pending</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900">PH-02</td>
                            <td className="p-2.5">0.465</td>
                            <td className="p-2.5">20</td>
                            <td className="p-2.5 font-bold text-blue-700">0.0093</td>
                            <td className="p-2.5 font-sans text-slate-500">Chainage / GPS pending</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900">PH-03</td>
                            <td className="p-2.5">0.465</td>
                            <td className="p-2.5">20</td>
                            <td className="p-2.5 font-bold text-blue-700">0.0093</td>
                            <td className="p-2.5 font-sans text-slate-500">Chainage / GPS pending</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900">PH-04</td>
                            <td className="p-2.5">0.465</td>
                            <td className="p-2.5">20</td>
                            <td className="p-2.5 font-bold text-blue-700">0.0093</td>
                            <td className="p-2.5 font-sans text-slate-500">Chainage / GPS pending</td>
                          </tr>
                          <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                            <td className="p-2.5 text-slate-900">TOTAL</td>
                            <td className="p-2.5 text-blue-900">1.860</td>
                            <td className="p-2.5">20 avg.</td>
                            <td className="p-2.5 text-emerald-800 font-black">0.0372</td>
                            <td className="p-2.5 font-sans text-slate-800">4 potholes</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                    <h4 className="font-bold text-slate-900 uppercase text-xs">3.3 Quantity Calculation</h4>
                    <p className="font-mono text-xs">
                      Combined area = 20 sq ft &times; 0.092903 = 1.858 m² &asymp; <strong>1.86 m²</strong>.<br />
                      Estimated geometric volume = 1.86 m² &times; 0.020 m = <strong>0.0372 m³ (approximately 37.2 litres)</strong>.
                    </p>
                    <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      The equal allocation of 0.465 m² per pothole in the table is only a convenient sample breakdown because individual pothole dimensions were not supplied. The actual dimensions and chainages must be measured separately.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">3.4 Other Pavement Distresses</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5">Distress type</th>
                            <th className="p-2.5">Sample status</th>
                            <th className="p-2.5">Action / data required</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-bold">Ravelling</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                            <td className="p-2.5">Inspect and record severity / extent</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Cracking</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                            <td className="p-2.5">Map longitudinal, transverse and fatigue cracking</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Edge break</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                            <td className="p-2.5">Measure length and width of edge deterioration</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Depression</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                            <td className="p-2.5">Record location and maximum depth</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Bleeding</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                            <td className="p-2.5">Inspect surface film and skid-related risk</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Patching</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                            <td className="p-2.5">Record existing patch locations and condition</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Drain / shoulder</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                            <td className="p-2.5">Inspect drainage continuity and shoulder support</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 7</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 8: SECTION 4 - ROAD ROUGHNESS DATA */}
            {/* ===================================================================== */}
            {shouldShow(8) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 8 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#ea4335]" />
                    <span>SECTION – 4: ROAD ROUGHNESS DATA (Page 8)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-5 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">4.1 Roughness Measurements</h4>
                    <p>
                      Road roughness is represented by the International Roughness Index (IRI), expressed in metres per kilometre (m/km). A higher IRI indicates a rougher ride. The attached reference report classifies IRI greater than 5.0 m/km as Very Poor / Very Rough and recommends reconstruction or strengthening as a typical action band. For this sample, the 120 m segment is assigned an average IRI of 5.20 m/km.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">4.2 Sample IRI Result</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 w-1/3">Parameter</th>
                            <th className="p-2.5">Sample value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                          <tr>
                            <td className="p-2.5 font-bold font-sans bg-slate-50">Road</td>
                            <td className="p-2.5 font-sans">NKDA Road MAR 1111</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold font-sans bg-slate-50">Provisional segment chainage</td>
                            <td className="p-2.5">0+000 to 0+120</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold font-sans bg-slate-50">Segment length</td>
                            <td className="p-2.5">120 m</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold font-sans bg-slate-50">Left wheel path IRI (sample mean)</td>
                            <td className="p-2.5 text-blue-700 font-bold">5.10 m/km</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold font-sans bg-slate-50">Right wheel path IRI (sample mean)</td>
                            <td className="p-2.5 text-red-700 font-bold">5.30 m/km</td>
                          </tr>
                          <tr className="bg-red-50/50">
                            <td className="p-2.5 font-bold font-sans text-red-900">Average segment IRI</td>
                            <td className="p-2.5 text-red-600 font-black text-sm">5.20 m/km</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold font-sans bg-slate-50">IRI classification</td>
                            <td className="p-2.5 font-sans text-red-700 font-bold">Very Poor / Very Rough (&gt;5.0 m/km)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold font-sans bg-slate-50">Recommended action</td>
                            <td className="p-2.5 font-sans">Prioritize detailed pavement investigation and resurfacing / strengthening design</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">4.3 Chainage-wise Interpretation</h4>
                    <p>
                      The 120 m section is represented by six consecutive 20 m sample intervals. Each interval has a left wheel path IRI of 5.10 m/km and a right wheel path IRI of 5.30 m/km, giving an average lane IRI of 5.20 m/km. This simplified profile is deliberately consistent across the segment and is not intended to mimic measured variability.
                    </p>

                    {/* SVG Profile Chart matching Page 8 */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 mt-2 space-y-2">
                      <span className="font-bold text-slate-900 text-xs block text-center">
                        Illustrative IRI profile – 120 m segment
                      </span>
                      <div className="w-full bg-white rounded border border-slate-300 p-3">
                        <svg viewBox="0 0 600 150" className="w-full h-auto select-none font-sans">
                          {/* Y-axis ticks */}
                          <line x1="50" y1="20" x2="560" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="50" y1="45" x2="560" y2="45" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="50" y1="70" x2="560" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="50" y1="95" x2="560" y2="95" stroke="#f1f5f9" strokeWidth="1" />
                          <line x1="50" y1="120" x2="560" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                          {/* Axes */}
                          <line x1="50" y1="120" x2="560" y2="120" stroke="#334155" strokeWidth="1.5" />
                          <line x1="50" y1="15" x2="50" y2="120" stroke="#334155" strokeWidth="1.5" />

                          {/* Y labels */}
                          <text x="25" y="24" fill="#64748b" fontSize="10" fontFamily="monospace">5.4</text>
                          <text x="25" y="49" fill="#64748b" fontSize="10" fontFamily="monospace">5.2</text>
                          <text x="25" y="74" fill="#64748b" fontSize="10" fontFamily="monospace">5.0</text>
                          <text x="25" y="99" fill="#64748b" fontSize="10" fontFamily="monospace">4.8</text>
                          <text x="25" y="124" fill="#64748b" fontSize="10" fontFamily="monospace">4.6</text>

                          {/* X labels (chainage) */}
                          <text x="47" y="137" fill="#64748b" fontSize="10" fontFamily="monospace">0</text>
                          <text x="130" y="137" fill="#64748b" fontSize="10" fontFamily="monospace">20</text>
                          <text x="215" y="137" fill="#64748b" fontSize="10" fontFamily="monospace">40</text>
                          <text x="300" y="137" fill="#64748b" fontSize="10" fontFamily="monospace">60</text>
                          <text x="385" y="137" fill="#64748b" fontSize="10" fontFamily="monospace">80</text>
                          <text x="470" y="137" fill="#64748b" fontSize="10" fontFamily="monospace">100</text>
                          <text x="548" y="137" fill="#64748b" fontSize="10" fontFamily="monospace">120</text>

                          {/* Red line: Right wheel path 5.30 m/km */}
                          <line x1="50" y1="32.5" x2="560" y2="32.5" stroke="#dc2626" strokeWidth="3" />

                          {/* Blue line: Left wheel path 5.10 m/km */}
                          <line x1="50" y1="57.5" x2="560" y2="57.5" stroke="#2563eb" strokeWidth="3" />
                        </svg>
                      </div>
                      <div className="flex items-center justify-center gap-6 text-[11px] font-mono">
                        <span className="flex items-center gap-1.5 text-blue-700">
                          <span className="w-3 h-1 bg-blue-600 rounded" />
                          Blue: Left wheel path 5.10 m/km
                        </span>
                        <span className="flex items-center gap-1.5 text-red-700">
                          <span className="w-3 h-1 bg-red-600 rounded" />
                          Red: Right wheel path 5.30 m/km
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">
                      4.4 IRI Classification (as reproduced in the supplied reference report)
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5">IRI (m/km)</th>
                            <th className="p-2.5">Condition</th>
                            <th className="p-2.5">Ride quality</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-mono">Less than 2.0</td>
                            <td className="p-2.5 text-emerald-700 font-bold">Excellent</td>
                            <td className="p-2.5">Very smooth</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-mono">2.0 – 3.0</td>
                            <td className="p-2.5 text-emerald-600 font-semibold">Good</td>
                            <td className="p-2.5">Smooth</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-mono">3.0 – 4.0</td>
                            <td className="p-2.5 text-amber-600 font-semibold">Fair</td>
                            <td className="p-2.5">Acceptable</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-mono">4.0 – 5.0</td>
                            <td className="p-2.5 text-amber-700 font-semibold">Poor</td>
                            <td className="p-2.5">Rough</td>
                          </tr>
                          <tr className="bg-red-50 font-bold">
                            <td className="p-2.5 font-mono text-red-600">Greater than 5.0</td>
                            <td className="p-2.5 text-red-700">Very Poor</td>
                            <td className="p-2.5 text-red-700">Very rough</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 8</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 9: SECTION 5 & 6 - RUTTING DATA & ROAD INVENTORY */}
            {/* ===================================================================== */}
            {shouldShow(9) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 9 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-[#1a73e8]" />
                    <span>SECTION 5: RUTTING DATA &amp; SECTION 6: ROAD INVENTORY (Page 9)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-6 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">SECTION – 5: RUTTING DATA</h4>
                    <p className="mb-2">
                      <strong>5.1 Rutting Assessment:</strong> Rutting is a longitudinal depression within wheel paths caused by permanent deformation of pavement layers. The reference NSV report describes transverse laser profiling as the measurement approach. No measured rut-depth information was supplied for NKDA Road MAR 1111; therefore no actual rutting condition is asserted in this sample.
                    </p>

                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-3">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 w-1/3">Parameter</th>
                            <th className="p-2.5">Status / requirement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Average rut depth</td>
                            <td className="p-2.5">Not provided – measure through transverse laser profile</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Maximum rut depth</td>
                            <td className="p-2.5">Not provided – report by lane / wheel path</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Measurement interval</td>
                            <td className="p-2.5">Recommended chainage-wise, e.g. 20 m intervals</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Classification</td>
                            <td className="p-2.5">To be assigned after actual measurement</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Engineering use</td>
                            <td className="p-2.5">Assess water ponding, deformation and need for leveling / strengthening</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h5 className="font-bold text-slate-800 text-[11px] mb-1">5.2 Field Data Sheet – Sample Layout</h5>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs font-mono text-[11px]">
                        <thead className="bg-slate-800 text-white font-bold">
                          <tr>
                            <th className="p-2">Start chainage</th>
                            <th className="p-2">End chainage</th>
                            <th className="p-2">Left rut (mm)</th>
                            <th className="p-2">Right rut (mm)</th>
                            <th className="p-2">Average (mm)</th>
                            <th className="p-2 font-sans">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {['0+000 to 0+020', '0+020 to 0+040', '0+040 to 0+060', '0+060 to 0+080', '0+080 to 0+100', '0+100 to 0+120'].map((range, i) => {
                            const [start, end] = range.split(' to ');
                            return (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="p-2">{start}</td>
                                <td className="p-2">{end}</td>
                                <td className="p-2 text-slate-400">TBC</td>
                                <td className="p-2 text-slate-400">TBC</td>
                                <td className="p-2 text-slate-400">TBC</td>
                                <td className="p-2 font-sans text-slate-600">Field measurement required</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">
                      SECTION – 6: ROAD INVENTORY &amp; GEOMETRY
                    </h4>
                    <p className="mb-2">
                      <strong>6.1 Inventory Summary:</strong> The supplied information does not establish carriageway width, lane configuration, median, shoulder, drainage, pavement layer composition or road geometry for MAR 1111. These items must be captured during the site visit and should not be inferred from the PR-4 reference road, which is a different project corridor.
                    </p>

                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 w-1/3">Inventory parameter</th>
                            <th className="p-2.5">Current status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Road name / asset ID</td>
                            <td className="p-2.5 font-bold">NKDA Road MAR 1111</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Road functional classification</td>
                            <td className="p-2.5">To be confirmed by NKDA</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Carriageway configuration / lane count</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Carriageway width</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Pavement type</td>
                            <td className="p-2.5">Flexible bituminous – working assumption only</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Median / shoulder</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Drainage arrangement</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Horizontal / vertical alignment</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Road marking / signage / lighting</td>
                            <td className="p-2.5 text-slate-500">Not provided</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 9</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 10: SECTIONS 7, 8, 9 - FURNITURE, STRUCTURES & GPS */}
            {/* ===================================================================== */}
            {shouldShow(10) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 10 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#1a73e8]" />
                    <span>SECTIONS 7, 8 &amp; 9: FURNITURE, STRUCTURES &amp; GPS (Page 10)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-6 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">
                      SECTION – 7: ROAD FURNITURE &amp; UTILITIES
                    </h4>
                    <p className="mb-2">
                      Road furniture and utilities should be inventoried during the NSV run or a supporting field inspection. The present sample contains no verified counts or condition records for traffic signs, delineators, pavement markings, streetlights, safety barriers, electrical poles, telecom assets or water-supply infrastructure. These are therefore marked as pending survey.
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5">Asset category</th>
                            <th className="p-2.5">Items to record</th>
                            <th className="p-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-bold">Traffic signs</td>
                            <td className="p-2.5">Type, chainage, direction, condition</td>
                            <td className="p-2.5 font-semibold text-amber-700">Pending field inventory</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Road markings</td>
                            <td className="p-2.5">Centre / edge lines, visibility, condition</td>
                            <td className="p-2.5 font-semibold text-amber-700">Pending field inventory</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Street lighting</td>
                            <td className="p-2.5">Pole location, spacing, working status</td>
                            <td className="p-2.5 font-semibold text-amber-700">Pending field inventory</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Safety barriers</td>
                            <td className="p-2.5">Type, length, terminal condition</td>
                            <td className="p-2.5 font-semibold text-amber-700">Pending field inventory</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold">Utilities</td>
                            <td className="p-2.5">Electrical, telecom, water and other services</td>
                            <td className="p-2.5 font-semibold text-amber-700">Pending field inventory</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">
                      SECTION – 8: STRUCTURES &amp; WAYSIDE AMENITIES
                    </h4>
                    <p>
                      No verified structure inventory was supplied. Culverts, bridges, junctions, access roads, drainage crossings and wayside amenities should be recorded with chainage, type, dimensions and condition during field verification.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">
                      SECTION – 9: GPS &amp; LOCATION REFERENCE DATA
                    </h4>
                    <p className="mb-2">
                      A chainage-based linear referencing system is required to connect pothole locations, IRI readings, rutting results, images and road assets. The provisional chainage 0+000 to 0+120 used in this report is only a sample reference for tabulation; it is not a surveyed location. Latitude / longitude coordinates have not been provided and are intentionally not fabricated.
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 w-1/3">Reference item</th>
                            <th className="p-2.5">Required record</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Start point</td>
                            <td className="p-2.5">GPS latitude / longitude and chainage – field capture pending</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">End point</td>
                            <td className="p-2.5">GPS latitude / longitude and chainage – field capture pending</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">LRP interval</td>
                            <td className="p-2.5">Adopt project specification; 20 m interval may be used for sample tabulation</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Coordinate system</td>
                            <td className="p-2.5">Record datum / projection and GPS method</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Image reference</td>
                            <td className="p-2.5">Time-stamped and geo-tagged image ID linked to chainage</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 10</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 11: SECTIONS 10 & 11 - FINDINGS, RECOMMENDATIONS & SIGN-OFF */}
            {/* ===================================================================== */}
            {shouldShow(11) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 11 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#34a853]" />
                    <span>SECTIONS 10 &amp; 11: FINDINGS, RECOMMENDATIONS &amp; SIGN-OFF (Page 11)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-6 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">
                      SECTION – 10: OBSERVATIONS &amp; FINDINGS
                    </h4>
                    <p className="mb-2">
                      <strong>10.1 General Observations:</strong> Based only on the supplied sample assumptions, four potholes are present and a 120 m segment has been identified for resurfacing assessment. The sample IRI of 5.20 m/km indicates a very rough ride under the classification reproduced in the reference report. Other distress and inventory conditions remain unverified.
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 w-1/3">Observation</th>
                            <th className="p-2.5">Finding</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Potholes</td>
                            <td className="p-2.5 font-bold text-red-600">4 Nos.; combined area 1.86 m²; average depth 20 mm</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Pothole geometric volume</td>
                            <td className="p-2.5 font-mono font-bold">0.0372 m³ (approx. 37.2 litres)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Roughness</td>
                            <td className="p-2.5 font-mono">Illustrative average IRI 5.20 m/km over 120 m</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">IRI classification</td>
                            <td className="p-2.5 font-bold text-red-600">Very Poor / Very Rough (&gt;5.0 m/km)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Rutting / cracking / ravelling</td>
                            <td className="p-2.5 text-slate-500">Not supplied; requires field assessment</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Road assets / geometry</td>
                            <td className="p-2.5 text-slate-500">Not supplied; requires inventory survey</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">
                      SECTION – 11: CONCLUSIONS &amp; RECOMMENDATIONS
                    </h4>
                    <div>
                      <h5 className="font-bold text-slate-800 text-xs mb-0.5">11.1 Conclusions</h5>
                      <p>
                        The assumed defect inventory indicates localized pothole repairs are required. The 120 m segment, represented by an illustrative IRI of 5.20 m/km, falls in the Very Poor / Very Rough category in the reference report's IRI classification. It is therefore reasonable to flag the segment for priority investigation and resurfacing / strengthening design. Final treatment selection must be based on verified profile data and pavement structural condition.
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 text-xs mb-0.5">11.2 Maintenance Recommendations</h5>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        <li>Undertake permanent pothole repairs at all four locations using approved cut-and-fill procedures.</li>
                        <li>Confirm the 120 m resurfacing limits using chainage-wise measured IRI and distress mapping.</li>
                        <li>Investigate whether the roughness is caused by surface irregularity, localized settlement, base failure or utility reinstatement.</li>
                        <li>Check drainage and correct water ingress / ponding before overlay works.</li>
                        <li>Determine milling, leveling and overlay requirements through pavement evaluation and design.</li>
                        <li>Record pre- and post-work photographs, actual measured quantities, layer thickness and quality-control results.</li>
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-bold text-slate-800 text-xs mb-0.5">11.3 Road Safety and Monitoring</h5>
                      <p>
                        Provide temporary traffic management during pothole repairs and resurfacing. Following completion, carry out a post-work ride-quality check and retain the measured IRI, rutting, image and GPS datasets as the baseline for future monitoring.
                      </p>
                    </div>
                  </div>

                  {/* Formal Sign-off Table directly matching Page 11 */}
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase text-xs">SIGN-OFF</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-300">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-800 text-white font-bold">
                          <tr>
                            <th className="p-2.5 w-1/4">Role</th>
                            <th className="p-2.5">Signature / Name</th>
                            <th className="p-2.5 w-1/4">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-mono text-xs">
                          <tr>
                            <td className="p-3 font-bold font-sans">Prepared by</td>
                            <td className="p-3 font-sans text-slate-700">Er. Rahul Baruah (Geospatial Specialist)</td>
                            <td className="p-3 text-slate-600">16 November 2026</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold font-sans">Checked by</td>
                            <td className="p-3 font-sans text-slate-700">Er. Subhashis Sen (Executive Engineer, NKDA)</td>
                            <td className="p-3 text-slate-600">16 November 2026</td>
                          </tr>
                          <tr className="bg-emerald-50/40">
                            <td className="p-3 font-bold font-sans text-emerald-950">Approved by</td>
                            <td className="p-3 font-sans font-bold text-emerald-900">Dr. Debashis Sen, IAS (Retd) (CEO, NKDA)</td>
                            <td className="p-3 text-emerald-800">16 November 2026</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 11</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 12: SECTION 12 - COST ESTIMATION & SENSITIVITY */}
            {/* ===================================================================== */}
            {shouldShow(12) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 12 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileSpreadsheetIcon className="w-4 h-4 text-emerald-600" />
                    <span>SECTION – 12: COST ESTIMATION (Page 12)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-6 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">12.1 Basis of Estimate</h4>
                    <p>
                      NKDA proposes to repair and resurface Road NKDA MAR 1111, New Town, Kolkata, using Bituminous Concrete (BC) surfacing. The work has two parts: <strong>(1) filling of potholes</strong> and <strong>(2) resurfacing with BC</strong>. The quantities and unit rates below are those specified for this exercise; the estimate is indicative and is not a priced Bill of Quantities.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">12.2 Scope of Work and Quantities</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2 w-12">Part</th>
                            <th className="p-2">Work</th>
                            <th className="p-2">Type</th>
                            <th className="p-2">Potholes (N)</th>
                            <th className="p-2">Length (m)</th>
                            <th className="p-2">Avg. Depth (mm)</th>
                            <th className="p-2">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-center font-sans">1</td>
                            <td className="p-2 font-bold font-sans">Filling of potholes</td>
                            <td className="p-2 font-sans">Filling</td>
                            <td className="p-2 font-bold text-red-600">4</td>
                            <td className="p-2">0</td>
                            <td className="p-2">20</td>
                            <td className="p-2 font-sans text-slate-700">4 potholes, 20 sq ft (about 1.86 m²) in total, 20 mm average depth</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-center font-sans">2</td>
                            <td className="p-2 font-bold font-sans">Resurfacing with Bituminous Concrete</td>
                            <td className="p-2 font-sans">Surfacing</td>
                            <td className="p-2">0</td>
                            <td className="p-2 font-bold text-blue-700">120</td>
                            <td className="p-2">10</td>
                            <td className="p-2 font-sans text-slate-700">Road length 120 m</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">12.3 Cost Calculation</h4>
                    <p className="mb-2">
                      Estimated cost is computed on the volume of material placed (area &times; depth) at the unit rate for each part. Rates are taken as Rs. per m³ of finished material.
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2 w-12">Part</th>
                            <th className="p-2">Formula</th>
                            <th className="p-2">Calculation</th>
                            <th className="p-2">Rate (Rs.)</th>
                            <th className="p-2 text-right">Estimated Cost (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 text-slate-800">
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-center">1</td>
                            <td className="p-2 font-mono text-[11px]">Potholes &times; avg. depth &times; avg. area &times; 10,000 Rs</td>
                            <td className="p-2 font-mono text-[11px]">
                              4 &times; 0.020 m &times; 0.465 m² &times; 10,000<br />
                              (= 0.0372 m³ &times; 10,000)
                            </td>
                            <td className="p-2 font-mono">10,000 / m³</td>
                            <td className="p-2 text-right font-mono font-bold text-blue-700">372</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-center">2</td>
                            <td className="p-2 font-mono text-[11px]">Length &times; avg. depth of surfacing &times; width of road &times; 30,000 Rs</td>
                            <td className="p-2 font-mono text-[11px]">
                              120 m &times; 0.010 m &times; 7.0 m* &times; 30,000<br />
                              (= 8.40 m³ &times; 30,000)
                            </td>
                            <td className="p-2 font-mono">30,000 / m³</td>
                            <td className="p-2 text-right font-mono font-bold text-blue-700">252,000</td>
                          </tr>
                          <tr className="bg-emerald-50 font-bold border-t-2 border-emerald-300">
                            <td className="p-2 text-center" colSpan={4}>
                              Total
                            </td>
                            <td className="p-2 text-right font-mono font-black text-emerald-800 text-sm">
                              252,372
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="text-[10px] text-slate-500 italic mt-1">
                      * Road width is not provided. A 7.0 m carriageway has been assumed only to illustrate the calculation. Part 2 cost varies directly with width; replace with the surveyed width to obtain the final figure.
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">12.4 Sensitivity of Part 2 to Road Width</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs font-mono text-[11px]">
                        <thead className="bg-slate-800 text-white font-bold">
                          <tr>
                            <th className="p-2 font-sans">Assumed width (m)</th>
                            <th className="p-2 font-sans">Surfacing volume (m³)</th>
                            <th className="p-2 font-sans">Part 2 cost (Rs.)</th>
                            <th className="p-2 font-sans">Part 1 cost (Rs.)</th>
                            <th className="p-2 font-sans text-right">Total (Rs.)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 font-bold">3.5</td>
                            <td className="p-2">4.20</td>
                            <td className="p-2">126,000</td>
                            <td className="p-2">372</td>
                            <td className="p-2 text-right font-bold text-slate-900">126,372</td>
                          </tr>
                          <tr className="hover:bg-slate-50 bg-blue-50/50">
                            <td className="p-2 font-bold text-blue-900">7.0 (assumed)</td>
                            <td className="p-2 font-bold text-blue-900">8.40</td>
                            <td className="p-2 font-bold text-blue-900">252,000</td>
                            <td className="p-2 font-bold text-blue-900">372</td>
                            <td className="p-2 text-right font-black text-blue-900">252,372</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 font-bold">10.5</td>
                            <td className="p-2">12.60</td>
                            <td className="p-2">378,000</td>
                            <td className="p-2">372</td>
                            <td className="p-2 text-right font-bold text-slate-900">378,372</td>
                          </tr>
                          <tr className="hover:bg-slate-50">
                            <td className="p-2 font-bold">14.0</td>
                            <td className="p-2">16.80</td>
                            <td className="p-2">504,000</td>
                            <td className="p-2">372</td>
                            <td className="p-2 text-right font-bold text-slate-900">504,372</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">12.5 Key Contract Parameters</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-[#1a73e8] text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 w-1/3">Parameter</th>
                            <th className="p-2.5">Requirement</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Completion period</td>
                            <td className="p-2.5 font-bold">30 days</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Defect liability period</td>
                            <td className="p-2.5 font-bold">1 year from completion</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Security deposit</td>
                            <td className="p-2.5 font-bold">10% of each running bill</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Mobilisation advance</td>
                            <td className="p-2.5 text-slate-500">Not applicable (none)</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-semibold bg-slate-50">Price escalation</td>
                            <td className="p-2.5 text-slate-500">Not applicable (none)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <h4 className="font-bold text-slate-900 uppercase text-xs">12.6 Cost Estimation Notes</h4>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-600">
                      <li>Unit rates (Rs. 10,000 and Rs. 30,000) and quantities are supplied assumptions; the cost is indicative only.</li>
                      <li>Pothole quantities are geometric estimates (Section 3). Final payable quantities must be measured after cutting to sound pavement, so the actual Part 1 cost may differ.</li>
                      <li>No taxes, contingencies, traffic management or other items beyond the two parts above are included in this estimate.</li>
                    </ul>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 12</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 13: ANNEXURE 1 - PAVEMENT CONDITION DATA */}
            {/* ===================================================================== */}
            {shouldShow(13) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 13 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>ANNEXURE – 1: PAVEMENT CONDITION DATA (Page 13)</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 font-normal">4 Potholes Verified</span>
                </div>

                <div className="p-6 md:p-8 space-y-6 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">
                      Pothole inventory summary – sample breakdown
                    </h4>
                    <p className="text-[11px] text-slate-500 mb-2">
                      The total area and depth below are supplied assumptions. The equal area split between four defects is a sample allocation only; replace with actual individual measurements.
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs font-mono text-[11px]">
                        <thead className="bg-[#1a73e8] text-white font-bold font-sans">
                          <tr>
                            <th className="p-2.5">Defect ID</th>
                            <th className="p-2.5">Area (m²)</th>
                            <th className="p-2.5">Depth (mm)</th>
                            <th className="p-2.5">Volume (m³)</th>
                            <th className="p-2.5">Location</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {['PH-01', 'PH-02', 'PH-03', 'PH-04'].map((id) => (
                            <tr key={id} className="hover:bg-slate-50">
                              <td className="p-2.5 font-bold text-slate-900">{id}</td>
                              <td className="p-2.5">0.465</td>
                              <td className="p-2.5">20</td>
                              <td className="p-2.5 font-bold text-blue-700">0.0093</td>
                              <td className="p-2.5 font-sans text-slate-500">Chainage / GPS pending</td>
                            </tr>
                          ))}
                          <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                            <td className="p-2.5 font-sans text-slate-900">TOTAL</td>
                            <td className="p-2.5 text-blue-900">1.860</td>
                            <td className="p-2.5">20 avg.</td>
                            <td className="p-2.5 text-emerald-800 font-black">0.0372</td>
                            <td className="p-2.5 font-sans text-slate-800">4 potholes</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <h5 className="font-bold text-slate-900 text-xs">Pothole repair quantity note</h5>
                    <p className="text-[11px] text-slate-600">
                      The estimated existing void volume of 0.0372 m³ is not the final quantity of bituminous mix for payment. Actual repair quantity depends on the cut-out dimensions, depth to sound material, compaction, material density and approved construction specification.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">
                      Suggested field photo register
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200 mb-4">
                      <table className="w-full text-left border-collapse text-xs font-mono text-[11px]">
                        <thead className="bg-slate-800 text-white font-bold font-sans">
                          <tr>
                            <th className="p-2.5">Photo ID</th>
                            <th className="p-2.5">Defect ID</th>
                            <th className="p-2.5">Chainage</th>
                            <th className="p-2.5">Direction / lane</th>
                            <th className="p-2.5">GPS</th>
                            <th className="p-2.5 font-sans">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {photoRegister.map((p) => (
                            <tr key={p.photoId} className="hover:bg-slate-50">
                              <td className="p-2.5 font-bold text-blue-600">{p.photoId}</td>
                              <td className="p-2.5 font-bold text-slate-900">{p.defectId}</td>
                              <td className="p-2.5 text-slate-700">{p.chainage}</td>
                              <td className="p-2.5 font-sans text-slate-600">{p.direction}</td>
                              <td className="p-2.5 text-slate-500">{p.gps}</td>
                              <td className="p-2.5 font-sans text-slate-700">{p.remarks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Photo Grid Preview with Zoom */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {photoRegister.map((item) => (
                        <div
                          key={item.photoId}
                          className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition group"
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
                              Vol: <span className="font-mono font-bold text-slate-800">{item.volume}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 13</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 14: ANNEXURE 2 - ROUGHNESS (IRI) DATA */}
            {/* ===================================================================== */}
            {shouldShow(14) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 14 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#1a73e8]" />
                    <span>ANNEXURE – 2: ROUGHNESS (IRI) DATA (Page 14)</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 font-normal">Six 20m Intervals</span>
                </div>

                <div className="p-6 md:p-8 space-y-6 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">
                      Chainage-wise IRI schedule – illustrative sample data only
                    </h4>
                    <p className="text-[11px] text-slate-500 mb-2">
                      Data layout follows the reference report's chainage-wise roughness table concept. Values below are constructed to yield a consistent segment average of 5.20 m/km.
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs font-mono text-[11px]">
                        <thead className="bg-[#1a73e8] text-white font-bold font-sans">
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
                            <th className="p-2">Speed</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {iriSchedule.map((row, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="p-2 font-bold text-slate-900">MAR1111</td>
                              <td className="p-2 text-slate-600">NKDA-01</td>
                              <td className="p-2">{row.startCh}</td>
                              <td className="p-2">{row.endCh}</td>
                              <td className="p-2 text-slate-500">{row.dir}</td>
                              <td className="p-2 text-slate-700">{row.lane}</td>
                              <td className="p-2 text-blue-700 font-bold">{row.leftIri}</td>
                              <td className="p-2 text-red-700 font-bold">{row.rightIri}</td>
                              <td className="p-2 text-red-600 font-black bg-red-50/50">{row.avgIri}</td>
                              <td className="p-2 text-slate-500">{row.speed}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-[10px] text-slate-500 font-sans mt-1">
                      *Direction and lane labels are placeholders; confirm the surveyed carriageway / direction. **Survey speed of 40 km/h is a sample field entry, not a recorded speed.
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">Segment summary</h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs font-mono text-[11px]">
                        <thead className="bg-slate-800 text-white font-bold font-sans">
                          <tr>
                            <th className="p-2.5">Length</th>
                            <th className="p-2.5">Mean left IRI</th>
                            <th className="p-2.5">Mean right IRI</th>
                            <th className="p-2.5">Average IRI</th>
                            <th className="p-2.5 font-sans">IRI class</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          <tr className="font-bold">
                            <td className="p-2.5">120 m</td>
                            <td className="p-2.5 text-blue-700">5.10 m/km</td>
                            <td className="p-2.5 text-red-700">5.30 m/km</td>
                            <td className="p-2.5 text-[#ea4335] text-sm font-black">5.20 m/km</td>
                            <td className="p-2.5 font-sans text-red-700 font-bold">Very Poor / Very Rough</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs uppercase">Interpretation</h4>
                    <p className="text-[11px] text-slate-700">
                      All six 20 m intervals are represented by an average IRI of 5.20 m/km. The entire 120 m sample segment therefore lies above the 5.0 m/km threshold used in the attached reference report to describe the Very Poor / Very Rough category. The resurfacing proposal should be validated by actual NSV profile output and engineering inspection.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-1">
                      Required actual NSV output fields
                    </h4>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-600">
                      <li>Start and end chainage for each measurement interval</li>
                      <li>Left and right wheel-path IRI and computed average IRI</li>
                      <li>Direction, lane number, survey speed and survey date</li>
                      <li>Latitude / longitude and equipment calibration reference</li>
                      <li>Raw longitudinal profile and processed roughness file</li>
                    </ul>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 14</span>
                </div>
              </div>
            )}

            {/* ===================================================================== */}
            {/* PAGE 15: ANNEXURE 3 - RUTTING DATA & FIELD CHECKLIST */}
            {/* ===================================================================== */}
            {shouldShow(15) && (
              <div className="bg-white border-2 border-slate-300 rounded-xl shadow-xs overflow-hidden relative">
                <div className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-300">
                  PAGE 15 OF 15
                </div>

                <div className="p-6 bg-slate-50 border-b border-slate-200">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>ANNEXURE – 3: RUTTING DATA &amp; FIELD CHECKLIST (Page 15)</span>
                  </h3>
                </div>

                <div className="p-6 md:p-8 space-y-6 text-xs leading-relaxed text-slate-700">
                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">
                      Rutting data schedule – blank field template
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs font-mono text-[11px]">
                        <thead className="bg-[#1a73e8] text-white font-bold font-sans">
                          <tr>
                            <th className="p-2">Start Ch.</th>
                            <th className="p-2">End Ch.</th>
                            <th className="p-2">Left rut (mm)</th>
                            <th className="p-2">Right rut (mm)</th>
                            <th className="p-2">Average (mm)</th>
                            <th className="p-2">Maximum (mm)</th>
                            <th className="p-2 font-sans">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {['0+000 to 0+020', '0+020 to 0+040', '0+040 to 0+060', '0+060 to 0+080', '0+080 to 0+100', '0+100 to 0+120'].map((range, idx) => {
                            const [start, end] = range.split(' to ');
                            return (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="p-2">{start}</td>
                                <td className="p-2">{end}</td>
                                <td className="p-2 text-slate-400">TBC</td>
                                <td className="p-2 text-slate-400">TBC</td>
                                <td className="p-2 text-slate-400">TBC</td>
                                <td className="p-2 text-slate-400">TBC</td>
                                <td className="p-2 font-sans text-slate-600">Actual laser data required</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 uppercase text-xs mb-2">
                      Pre-issue field verification checklist
                    </h4>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-800 text-white font-bold text-[11px]">
                          <tr>
                            <th className="p-2.5 w-12 text-center">Item</th>
                            <th className="p-2.5">Verification requirement</th>
                            <th className="p-2.5 w-32">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {[
                            'Confirm road name, limits, start/end chainage and direction',
                            'Record carriageway width, lane configuration and pavement type',
                            'Capture four pothole locations, dimensions, depths and geotagged photographs',
                            'Conduct calibrated NSV laser profiling and obtain actual IRI',
                            'Measure rut depth and map other pavement distresses',
                            'Inventory drainage, shoulders, road furniture, utilities and structures',
                            'Confirm GPS datum, survey date, speed, equipment and calibration',
                            'Obtain engineer approval of resurfacing treatment and limits',
                          ].map((req, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                              <td className="p-2.5 text-center font-bold text-slate-600">{i + 1}</td>
                              <td className="p-2.5">{req}</td>
                              <td className="p-2.5 font-semibold text-amber-700">Pending</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 space-y-1.5 leading-relaxed text-[11px]">
                    <span className="font-bold block uppercase tracking-wide text-amber-950">
                      REPORT LIMITATIONS:
                    </span>
                    <p>
                      This document is an illustrative sample prepared from limited assumptions. It does not contain actual NSV raw data, measured IRI, verified GPS coordinates, photographic evidence, rutting measurements, road inventory counts or an approved pavement design. It should be used as a report-format and planning example only. Before official submission, a competent survey team must perform and certify the field survey and replace every sample / pending entry with verified information.
                    </p>
                  </div>
                </div>

                <div className="px-6 py-2 bg-slate-100 border-t border-slate-200 text-[10px] font-mono text-slate-500 flex justify-between">
                  <span>NKDA ROAD MAR 1111 | SAMPLE NSV REPORT – NOT FIELD VERIFIED</span>
                  <span>Page 15</span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer Call-to-Action to Tender Release */}
      <div className="p-6 bg-slate-100 border border-slate-300 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="font-bold text-slate-900 text-xs">
            Next Pipeline Phase: Detailed Project Report (DPR) &amp; Tender Release
          </div>
          <div className="text-[11px] text-slate-500">
            The 4 potholes (0.0372 m³ void) and 120m resurfacing parameters are verified in the official 15-page dossier and ready for DPR formulation and e-NIT generation.
          </div>
        </div>

        <button
          onClick={() => navigate(`/dpr/${details.roadCode}`)}
          className="w-full sm:w-auto px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 whitespace-nowrap"
        >
          <span>Proceed to DPR &amp; Tender Release</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Simple icon component for spreadsheet
const FileSpreadsheetIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M8 13h2" />
    <path d="M14 13h2" />
    <path d="M8 17h2" />
    <path d="M14 17h2" />
  </svg>
);
