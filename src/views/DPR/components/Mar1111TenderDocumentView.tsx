import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FileText,
  Printer,
  ArrowLeft,
  CheckCircle2,
  Building,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Send,
  FileCheck,
  Layers,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { DPRRecord } from '../../../models/dprModels';
import { WorkflowPipelineTrail } from '../../../common/WorkflowPipelineTrail';

interface Mar1111TenderDocumentViewProps {
  dpr: DPRRecord;
  onBackToDpr: () => void;
  onPublishSuccess?: () => void;
}

export const Mar1111TenderDocumentView: React.FC<Mar1111TenderDocumentViewProps> = ({
  dpr,
  onBackToDpr,
  onPublishSuccess,
}) => {
  const [isPublished, setIsPublished] = useState(dpr.tender?.tenderStatus === 'Published');
  const [publishTimestamp, setPublishTimestamp] = useState<string>(
    dpr.tender?.releasedAt && dpr.tender.releasedAt !== 'Pending Release'
      ? dpr.tender.releasedAt
      : '16 Nov 2026, 14:15 IST'
  );

  // Carousel & Document Viewer State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [docViewMode, setDocViewMode] = useState<'carousel' | 'all'>('carousel');
  const totalPages = 4;

  // Dynamic 3-step tender formulation & publishing loader state
  const [isPublishingTender, setIsPublishingTender] = useState<boolean>(false);
  const [tenderStep, setTenderStep] = useState<number>(1);
  const [tenderSuccessToast, setTenderSuccessToast] = useState<string | null>(null);

  const handlePublish = () => {
    setIsPublishingTender(true);
    setTenderStep(1);
    setTimeout(() => setTenderStep(2), 550);
    setTimeout(() => setTenderStep(3), 1100);
    setTimeout(() => {
      setIsPublishingTender(false);
      setIsPublished(true);
      const ts = new Date().toLocaleString('en-IN') + ' IST';
      setPublishTimestamp(ts);
      localStorage.setItem(`tender_published_${dpr.roadCode}`, 'true');
      setTenderSuccessToast('Notice Inviting Tender (e-NIT) successfully generated and published live to wbtenders.gov.in!');
      setTimeout(() => setTenderSuccessToast(null), 5000);
      if (onPublishSuccess) {
        onPublishSuccess();
      }
    }, 1650);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {tenderSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 p-3 bg-emerald-50 border border-emerald-300 rounded-lg shadow-xl text-xs font-semibold text-emerald-950 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#34a853] flex-shrink-0" />
          <span>{tenderSuccessToast}</span>
        </div>
      )}

      {/* Modern Workflow Pipeline Trail: Step 4 Active */}
      <WorkflowPipelineTrail
        currentStep={4}
        roadCode={dpr.roadCode}
        roadName={dpr.roadName}
      />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              STEP 2 OF 2: OFFICIAL TENDER DOCUMENT
            </span>
            <span className="text-xs text-slate-300 font-mono">Tender Document No. 01/EE(R&amp;B)/NKDA/2026-27</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            Official Tender Document: Road NKDA MAR 1111
          </h2>
          <p className="text-xs text-slate-300">
            Two-Bid System • Part 1 (4 Potholes) &amp; Part 2 (120m Resurfacing with BC) • wbtenders.gov.in
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onBackToDpr}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to DPR (Step 1)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Document</span>
          </button>

          {!isPublished ? (
            <button
              onClick={handlePublish}
              className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer flex items-center gap-2 active:scale-98 animate-pulse"
            >
              <Send className="w-4 h-4" />
              <span>Release &amp; Publish to wbtenders.gov.in</span>
            </button>
          ) : (
            <div className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Published &amp; Live on wbtenders.gov.in</span>
            </div>
          )}
        </div>
      </div>

      {/* Published Status Banner */}
      {isPublished && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs no-print">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#34a853] flex-shrink-0" />
            <div>
              <span className="font-extrabold text-emerald-900 block text-sm">
                e-Tender Officially Released to West Bengal e-Procurement Portal
              </span>
              <span className="text-[11px] text-emerald-800">
                Notice Inviting e-Tender No. 01/EE(R&amp;B)/NKDA/2026-27 (SL No. 01 &amp; 02) is published. Bidders can download tender documents and submit bids.
              </span>
            </div>
          </div>
          <a
            href="https://wbtenders.gov.in"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-[#34a853] hover:bg-[#2d9247] text-white font-bold rounded-lg text-xs flex items-center gap-1.5 whitespace-nowrap shadow-xs transition"
          >
            <span>View on wbtenders.gov.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* PDF Page Navigation & Carousel Toolbar */}
      <div className="bg-white p-3.5 border border-slate-200 rounded-xl shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 no-print">
        {/* Left: Prev / Current Page / Next */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
              currentPage === 1
                ? 'text-slate-300 border-slate-200 cursor-not-allowed'
                : 'text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer'
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev Page</span>
          </button>

          <div className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-800">
            Page {currentPage} of {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition ${
              currentPage === totalPages
                ? 'text-slate-300 border-slate-200 cursor-not-allowed'
                : 'text-slate-700 border-slate-300 hover:bg-slate-100 cursor-pointer'
            }`}
            title="Next Page"
          >
            <span className="hidden sm:inline">Next Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Quick Page Jump Pills */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0">
          {[
            { num: 1, label: 'Page 1: e-NIT Notice' },
            { num: 2, label: 'Page 2: Scope & Credentials' },
            { num: 3, label: 'Page 3: ITB Clauses' },
            { num: 4, label: 'Page 4: Annexures & Seal' },
          ].map((tab) => (
            <button
              key={tab.num}
              onClick={() => {
                setCurrentPage(tab.num);
                if (docViewMode === 'all') setDocViewMode('carousel');
              }}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer whitespace-nowrap ${
                currentPage === tab.num && docViewMode === 'carousel'
                  ? 'bg-[#34a853] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right: View Mode Toggle & Print */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center text-xs">
            <button
              onClick={() => setDocViewMode('carousel')}
              className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer ${
                docViewMode === 'carousel'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Page View
            </button>
            <button
              onClick={() => setDocViewMode('all')}
              className={`px-2 py-1 rounded-md font-semibold transition cursor-pointer ${
                docViewMode === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Pages
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title="Print all pages sequentially as official PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print (PDF)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 1: OFFICIAL NOTICE INVITING e-TENDER (e-NIT) & CRITICAL DATES         */}
      {/* ========================================================================= */}
      <div
        className={`${
          docViewMode === 'all' || currentPage === 1 ? 'block' : 'hidden print:block'
        } pdf-page-sheet bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden text-xs text-slate-800 leading-relaxed font-sans mb-6`}
      >
        {/* NKDA Official Header Band */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 text-center space-y-1.5">
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-900 font-black text-sm mb-1">
            NKDA
          </div>
          <h1 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
            NEW TOWN KOLKATA DEVELOPMENT AUTHORITY
          </h1>
          <div className="text-xs text-slate-600 font-semibold">
            (A Statutory Authority under Government of West Bengal)
          </div>
          <div className="text-xs text-slate-600">
            Plot No. DG/13, Premises No. 04-3333, Action Area – ID, New Town, Kolkata – 700156
          </div>
          <div className="flex items-center justify-between text-xs font-mono text-slate-700 pt-3 border-t border-slate-200">
            <div><strong>Memo No.:</strong> 104/NKDA/Engg/EE(R&amp;B)/001/2026</div>
            <div><strong>Date:</strong> 16/11/2026</div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* NOTICE INVITING e-TENDER TITLE */}
          <div className="text-center space-y-1 border-b border-slate-200 pb-3">
            <h2 className="text-base font-black text-slate-900 tracking-wider underline">
              NOTICE INVITING e-TENDER
            </h2>
            <div className="text-xs font-bold text-slate-800">
              Notice Inviting e-Tender No. 01/EE(R&amp;B)/NKDA/2026-27 (SL No. 01 &amp; 02)
            </div>
          </div>

          {/* PREAMBLE */}
          <p className="leading-relaxed">
            Executive Engineer (Roads &amp; Building), New Town Kolkata Development Authority invites percentage rate e-Tender in <strong>TWO BID SYSTEM</strong> on behalf of Superintending Engineer, NKDA from resourceful, reliable, bona-fide and experienced agencies / companies / firms / individual contractors working under KMDA, NKDA, WB HIDCO, KMC and other Govt. Departments having experience in similar nature of Road Work and requisite financial capability and sufficient technical credential on execution of similar nature of work. The details are given below:
          </p>

          {/* NAME OF WORK */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900">1. Name of work (Part 1):-</span>
              <span className="font-medium text-slate-800">
                Filling of 4 potholes (total area 20 sq. ft. / approx. 1.86 sq. m., average depth 20 mm) on Road NKDA MAR 1111, New Town, Kolkata under NKDA.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900">2. Name of work (Part 2):-</span>
              <span className="font-medium text-slate-800">
                Resurfacing of Road NKDA MAR 1111 by strengthening with Bituminous Concrete (BC) surfacing of length 120.00 mtr. (average depth 10 mm) at New Town, Kolkata under NKDA.
              </span>
            </div>
          </div>

          {/* 1. SCHEDULE OF DATES & KEY PARTICULARS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1a73e8]" />
              <span>1. Schedule of Dates &amp; Key Particulars:</span>
            </h3>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead className="bg-[#1a73e8] text-white font-bold">
                  <tr>
                    <th className="p-2.5 w-1/2">PARTICULAR</th>
                    <th className="p-2.5 w-1/2">DATE &amp; TIME / DETAILS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="p-2 font-medium">Date of Issue of NIT</td>
                    <td className="p-2 font-mono font-bold text-slate-900">16.11.2026</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Document download start date</td>
                    <td className="p-2 font-mono">17.11.2026 from 10.00 A.M.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Document download end date &amp; time</td>
                    <td className="p-2 font-mono">07.12.2026 upto 1.00 P.M.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Bid submission start date</td>
                    <td className="p-2 font-mono">17.11.2026 from 10.00 A.M.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Pre-Bid Meeting Date &amp; Venue</td>
                    <td className="p-2">
                      <span className="font-mono font-bold">24.11.2026 at 12.00 P.M.</span> (3rd Floor Conference Room, NKDA)
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Last date of Online submission of Technical Bid &amp; Financial Bid</td>
                    <td className="p-2 font-mono font-bold text-[#c5221f]">07.12.2026 upto 1.00 P.M.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">
                      Opening of Technical Bid at Office of Executive Engineer (R&amp;B), Plot No. DG/13, Action Area-ID
                    </td>
                    <td className="p-2 font-mono font-bold text-[#1a73e8]">09.12.2026 at 1.00 P.M.</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Opening of Financial Bid of technically qualified bidders</td>
                    <td className="p-2">Will be intimated via email / portal in due course</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Validity of bid</td>
                    <td className="p-2 font-bold">120 days w.e.f. the date of opening of Financial Bid</td>
                  </tr>
                  <tr className="bg-blue-50/40">
                    <td className="p-2 font-bold text-slate-900">Completion Period of the work</td>
                    <td className="p-2 font-bold font-mono text-blue-900">30 Days from date of issue of Work Order</td>
                  </tr>
                  <tr className="bg-emerald-50/40">
                    <td className="p-2 font-bold text-slate-900">Defect Liability Period</td>
                    <td className="p-2 font-bold font-mono text-emerald-900">01 Year from Date of Completion of the work</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">Detailed Tender Document portals</td>
                    <td className="p-2 font-mono text-blue-700 font-bold">www.nkdamar.org &amp; www.wbtenders.gov.in</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-700 space-y-1">
              <div><strong>Online EMD Submission:</strong> Online Earnest Money Deposit (EMD) through:</div>
              <div>(i) Net Banking (any bank listed in ICICI Bank Payment Gateway)</div>
              <div>(ii) RTGS / NEFT by generating challan from e-tender portal in favour of <em>"New Town Kolkata Development Authority"</em> payable at Kolkata at least 3 working days before bid closing date.</div>
            </div>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono no-print">
          <div>Notice No. 01/EE(R&amp;B)/NKDA/2026-27 • Page 1 of 4</div>
          <button
            onClick={() => setCurrentPage(2)}
            className="px-3.5 py-1.5 bg-[#34a853] hover:bg-[#2d9247] text-white font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <span>Page 2: Scope &amp; Credentials</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2: PROJECT & ELIGIBILITY DETAILS (TECHNICAL & FINANCIAL CRITERIA)     */}
      {/* ========================================================================= */}
      <div
        className={`${
          docViewMode === 'all' || currentPage === 2 ? 'block' : 'hidden print:block'
        } pdf-page-sheet bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden text-xs text-slate-800 leading-relaxed font-sans mb-6`}
      >
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="font-bold text-slate-800">
            OFFICIAL TENDER DOCUMENT • e-NIT No. 01/EE(R&amp;B)/NKDA/2026-27
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Road NKDA MAR 1111</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PAGE 2 OF 4</span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* 2. PROJECT & ELIGIBILITY DETAILS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              2. Project &amp; Eligibility Details:
            </h3>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-left border-collapse text-[11px]">
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50 w-1/3">Location of Work</td>
                    <td className="p-2.5 text-slate-900 font-semibold">Road NKDA MAR 1111, New Town, Kolkata, West Bengal</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Estimated Cost of Work</td>
                    <td className="p-2.5 font-mono text-slate-900">
                      <div>Part 1 (Pothole Filling): Formula: Potholes × Avg Depth × Avg Area × Rs. 10,000 = ₹3,72,000</div>
                      <div>Part 2 (BC Resurfacing): Formula: Length × Avg Depth × Road Width × Rs. 30,000 = ₹24,48,000</div>
                      <div className="font-bold text-emerald-700 text-xs mt-0.5">Combined Indicative Estimate: Rs. 28,20,000 (₹28.20 Lakhs)</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Earnest Money (2% of Estimated Cost)</td>
                    <td className="p-2.5 font-mono text-red-600 font-bold">Rs. 56,400 (2% of ₹28,20,000) via online gateway</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Tender Inviting Authority</td>
                    <td className="p-2.5 text-slate-900 font-semibold">Executive Engineer (Roads &amp; Building), NKDA</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Eligibility Criteria (Technical Credentials)</td>
                    <td className="p-2.5 text-slate-700 space-y-1">
                      <div>1. Credentials of similar nature Bituminous Road work of minimum <strong>40% of estimated amount (₹11.28L)</strong> in a single contract; OR</div>
                      <div>2. Credentials of 2 similar Bituminous Road works of minimum <strong>30% each (₹8.46L)</strong>; OR</div>
                      <div>3. Credentials of one single running work completed to <strong>80% or more</strong> and value not less than <strong>40%</strong>.</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Financial Capability &amp; Turnover</td>
                    <td className="p-2.5 text-slate-700 space-y-1">
                      <div>• Average Annual Turnover for past 3 Financial Years: &ge; <strong>50% of estimated amount (₹14.10L)</strong>.</div>
                      <div>• Available Liquid Assets: &ge; <strong>10% of estimated cost (₹2.82L)</strong>.</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Plant, Machinery &amp; Technical Manpower</td>
                    <td className="p-2.5 text-slate-700 space-y-1">
                      <div>• <strong>Batch Mix Plant:</strong> Agency must own a running Batch Mix Plant (Light Duty) within <strong>10 KM</strong> from work site to ensure viscosity compliance.</div>
                      <div>• <strong>Site Lab &amp; Supervisor:</strong> Dedicated site testing lab + Diploma Civil Engineer (3 yrs exp) or Graduate Civil Engineer (1 yr exp).</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Statutory &amp; Mandatory Documents (Clause 3.1.1)</td>
                    <td className="p-2.5 text-slate-700">
                      Registration documents, ESI &amp; EPF certificates with current challans, Trade License, P. Tax challan, PAN, GST Registration, Audited Balance Sheets for last 3 years, Form-I Completion Certificates, Form-II Turnover, Notarized Affidavit (Annexure-I), and Bidder Details (Form-III).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono no-print">
          <div>Notice No. 01/EE(R&amp;B)/NKDA/2026-27 • Page 2 of 4</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Page 1</span>
            </button>
            <button
              onClick={() => setCurrentPage(3)}
              className="px-3.5 py-1.5 bg-[#34a853] hover:bg-[#2d9247] text-white font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>Page 3: ITB Clauses</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 3: INFORMATION TO BIDDERS (ITB) & GENERAL TERMS                      */}
      {/* ========================================================================= */}
      <div
        className={`${
          docViewMode === 'all' || currentPage === 3 ? 'block' : 'hidden print:block'
        } pdf-page-sheet bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden text-xs text-slate-800 leading-relaxed font-sans mb-6`}
      >
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="font-bold text-slate-800">
            OFFICIAL TENDER DOCUMENT • e-NIT No. 01/EE(R&amp;B)/NKDA/2026-27
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Road NKDA MAR 1111</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PAGE 3 OF 4</span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* 3. ITB & GENERAL TERMS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              3. Information to Bidders (ITB) &amp; General Terms:
            </h3>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2.5 text-[11px] text-slate-700">
              <div><strong>1. Two-Bid Online Submission:</strong> Register on https://etender.wb.nic.in / www.wbtenders.gov.in with Class-II/III DSC. Technical bid PDF and Financial bid BOQ uploaded concurrently.</div>
              <div><strong>2. Firm Price &amp; 1% Cess:</strong> Inclusive of all taxes, GST, royalties, and 1% BOCW Welfare Cess deducted from bills. No price escalation will be entertained.</div>
              <div><strong>3. Security Deposit:</strong> 10% deducted from each Running Account bill, released after final settlement and completion of 1-year Defect Liability Period (DLP).</div>
              <div><strong>4. Agreement &amp; Commencement:</strong> Execute West Bengal Form No. 2911(ii) within 7 days of Work Order and commence work within 7 days.</div>
              <div><strong>5. Quality Control:</strong> Strict compliance with MoRTH Section 500 / IRC specifications; batch mix plant must be within 10 km to maintain required laying temperatures (140°C - 160°C).</div>
              <div><strong>6. Photographic Documentation:</strong> Site photos before, during, and after execution along with profilometer telemetry submitted with running bills.</div>
              <div><strong>7. Dispute Resolution:</strong> Governed by Govt. of West Bengal Finance Department Memorandum No. 8182-F(Y) dated 26.09.2012.</div>
            </div>

            <div className="pt-4 text-right">
              <div className="font-bold text-slate-900 text-xs">Executive Engineer (Roads &amp; Building)</div>
              <div className="text-slate-600 text-[11px]">New Town Kolkata Development Authority</div>
            </div>
          </div>

          {/* COPY FORWARDED */}
          <div className="p-3.5 bg-slate-50 rounded border border-slate-200 space-y-1.5 text-[10px] text-slate-600">
            <span className="font-bold text-slate-800 block">Copy forwarded for information to:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5">
              <div>1. Chief Executive Officer, NKDA</div>
              <div>2. Chief Engineer, NKDA</div>
              <div>3. Superintending Engineer, NKDA</div>
              <div>4. Finance Office, NKDA</div>
              <div>5. Assistant Engineer (R&amp;B), NKDA</div>
              <div>6. Sr. Accountant / Cashier, NKDA</div>
              <div>7. P.A. to Hon'ble Chairman, NKDA</div>
              <div>8. Office Notice Board</div>
              <div>9. Official Website of NKDA &amp; Govt of W.B.</div>
            </div>
          </div>
        </div>

        {/* Page 3 Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-mono no-print">
          <div>Notice No. 01/EE(R&amp;B)/NKDA/2026-27 • Page 3 of 4</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(2)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg border border-slate-300 transition cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Page 2</span>
            </button>
            <button
              onClick={() => setCurrentPage(4)}
              className="px-3.5 py-1.5 bg-[#34a853] hover:bg-[#2d9247] text-white font-bold rounded-lg transition cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <span>Page 4: Annexures &amp; Seal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 4: MANDATORY SUBMISSION ANNEXURES & OFFICIAL SEALS                   */}
      {/* ========================================================================= */}
      <div
        className={`${
          docViewMode === 'all' || currentPage === 4 ? 'block' : 'hidden print:block'
        } pdf-page-sheet bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden text-xs text-slate-800 leading-relaxed font-sans mb-6`}
      >
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="font-bold text-slate-800">
            OFFICIAL TENDER DOCUMENT • e-NIT No. 01/EE(R&amp;B)/NKDA/2026-27
          </div>
          <div className="flex items-center gap-3 text-slate-500">
            <span>Road NKDA MAR 1111</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">PAGE 4 OF 4</span>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* ANNEXURE-I: SAMPLE FORMAT FOR AFFIDAVIT */}
          <div className="space-y-3">
            <div className="text-center space-y-0.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                ANNEXURE-I: SAMPLE FORMAT FOR AFFIDAVIT
              </h4>
              <div className="text-[10px] text-slate-500">
                (To be executed on Rs. 10.00 Non-Judicial Stamp Paper before Notary Public)
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-700 space-y-2 leading-relaxed">
              <p>
                I, Sri ...................................................., S/o Sri ...................................................., aged ...... Years, Residing at ........................................................................, Proprietor/Partner/Director of ........................................................................, do hereby solemnly affirm and declare in connection with <strong>"Pothole Filling and Resurfacing with Bituminous Concrete of Road NKDA MAR 1111, New Town, Kolkata"</strong> vide NIeT No. 01/EE(R&amp;B)/NKDA/2026-27 as follows:
              </p>
              <ul className="list-decimal list-inside space-y-1 pl-1 text-[10px]">
                <li>All information furnished and statements made in the bid documents are true and correct.</li>
                <li>Deployment at site of all necessary T&amp;P, equipment and Laboratory immediately on receipt of work order.</li>
                <li>Deployment of at least one site supervisor (Diploma Civil with 3 yrs exp or Graduate with 1 yr exp).</li>
                <li>Execution of all quality control tests per MORD/MoRTH/SP-20/SP-72 frequencies.</li>
                <li>Authority's decision will be final and binding regarding rectification of any defects.</li>
                <li>Certification that the agency has not been blacklisted by any Govt/Semi-Govt department in the last 3 years.</li>
              </ul>
              <div className="flex justify-between items-end pt-3 text-[10px]">
                <div>Place: Kolkata<br />Date: [Date of Submission]</div>
                <div className="text-right font-bold">Signature of the Contractor with Seal</div>
              </div>
            </div>
          </div>

          {/* FORM-III: DETAILS OF THE BIDDER */}
          <div className="space-y-3 pt-2">
            <div className="text-center space-y-0.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                FORM-III: DETAILS OF THE BIDDER
              </h4>
            </div>

            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="w-full text-left border-collapse text-[10px]">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-1.5 w-12">Sl. No.</th>
                    <th className="p-1.5 w-1/3">Particulars</th>
                    <th className="p-1.5">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="p-1.5 font-bold">1</td>
                    <td className="p-1.5">Name of Tendering Company / Firm / Agency</td>
                    <td className="p-1.5 text-slate-500 font-mono">[Bidder to fill]</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold">2</td>
                    <td className="p-1.5">Name of Proprietor / Director</td>
                    <td className="p-1.5 text-slate-500 font-mono">[Bidder to fill]</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold">3</td>
                    <td className="p-1.5">Full Address of Registered Office &amp; Contact</td>
                    <td className="p-1.5 text-slate-500 font-mono">[Bidder to fill]</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold">4</td>
                    <td className="p-1.5">Banker of Company / Firm with full address</td>
                    <td className="p-1.5 text-slate-500 font-mono">[Bidder to fill]</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold">5</td>
                    <td className="p-1.5">PAN No. &amp; GST Registration No.</td>
                    <td className="p-1.5 text-slate-500 font-mono">[Attach self-attested copies]</td>
                  </tr>
                  <tr>
                    <td className="p-1.5 font-bold">6</td>
                    <td className="p-1.5">E.P.F. &amp; E.S.I. Registration No.</td>
                    <td className="p-1.5 text-slate-500 font-mono">[Attach current challans]</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-right text-[10px] font-bold text-slate-700 pt-1">
              (Signature of the Bidder with Date and Seal)
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full Pipeline Flow Complete: NSV &rarr; DPR &rarr; Official Tender Document Release</span>
            </div>
            <div className="text-[11px] text-slate-500">
              The entire process from NSV profilometry to DPR and e-procurement publication on wbtenders.gov.in is fully demonstrated for Road NKDA MAR 1111.
            </div>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={onBackToDpr}
              className="px-3.5 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer"
            >
              Review DPR (Step 1)
            </button>

            {!isPublished ? (
              <button
                onClick={handlePublish}
                className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer flex items-center gap-2 active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Publish Tender Document</span>
              </button>
            ) : (
              <button
                onClick={() => window.open('https://wbtenders.gov.in', '_blank')}
                className="px-5 py-2 bg-[#34a853] hover:bg-[#2d9247] text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer flex items-center gap-2 active:scale-98"
              >
                <span>Live on wbtenders.gov.in</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic 3-Step Tender Formulation & Publication Loader Modal (Light Theme) */}
      {isPublishingTender &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
            <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                    <Send className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Publishing Notice Inviting Tender (e-NIT)
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Corridor: {dpr.roadCode} ({dpr.roadName})
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                  Step {tenderStep} of 3
                </span>
              </div>

              {/* Step indicator description */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-900">
                    {tenderStep === 1 && 'Validating Technical Sanctions & Two-Bid Eligibility Package...'}
                    {tenderStep === 2 && 'Formulating Official Notice Inviting Tender (e-NIT)...'}
                    {tenderStep === 3 && 'Transmitting Live to West Bengal e-Tender Portal (wbtenders.gov.in)...'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                  {tenderStep === 1 &&
                    'Verifying statutory ₹28,20,000 project sanction, 2% Earnest Money Deposit (₹56,400), and Class-I/II WB PWD contractor credential checks.'}
                  {tenderStep === 2 &&
                    'Generating statutory Tender Document No. 01/EE(R&B)/NKDA/2026-27, 21-day bid timeline, technical criteria, and mandatory affidavit forms.'}
                  {tenderStep === 3 &&
                    'Transmitting cryptographically signed tender package to wbtenders.gov.in state e-Procurement repository with Chief Engineer token approval.'}
                </p>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>Publication Progress</span>
                  <span className="text-emerald-600 font-bold">
                    {tenderStep === 1 ? '33%' : tenderStep === 2 ? '66%' : '100%'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-full transition-all duration-500 rounded-full shadow-2xs"
                    style={{ width: `${(tenderStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
