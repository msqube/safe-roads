import React, { useState } from 'react';
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
} from 'lucide-react';
import { DPRRecord } from '../../../models/dprModels';

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

  const handlePublish = () => {
    setIsPublished(true);
    setPublishTimestamp(new Date().toLocaleString('en-IN') + ' IST');
    if (onPublishSuccess) {
      onPublishSuccess();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-5 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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
            <span>Print Tender Document</span>
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
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
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

      {/* Main Official 7-Page e-NIT Document Body */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden text-xs text-slate-800 leading-relaxed font-sans">
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
                      Opening of Technical Bid at Office of Executive Engineer (R&amp;B), Plot No. DG/13, Premises No. 04-3333, Action Area-ID, New Town
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
                      <div>Part 1 (Pothole Filling): Formula: Potholes × Avg Depth × Avg Area × Rs. 10,000</div>
                      <div>Part 2 (BC Resurfacing): Formula: Length × Avg Depth × Road Width × Rs. 30,000</div>
                      <div className="font-bold text-emerald-700 text-xs mt-0.5">Combined Indicative Estimate: Rs. 28,20,000 (₹28.20 Lakhs)</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Earnest Money (2% of Estimated Cost)</td>
                    <td className="p-2.5 font-mono text-red-600 font-bold">2% of Estimated Tender Amount via online gateway</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Tender Inviting Authority</td>
                    <td className="p-2.5 text-slate-900 font-semibold">Executive Engineer (Roads &amp; Building), NKDA</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Eligibility Criteria (Technical Credentials)</td>
                    <td className="p-2.5 text-slate-700 space-y-1">
                      <div>1. Credentials of similar nature Bituminous Road work of minimum <strong>40% of estimated amount</strong> in a single contract; OR</div>
                      <div>2. Credentials of 2 similar Bituminous Road works of minimum <strong>30% each</strong>; OR</div>
                      <div>3. Credentials of one single running work completed to <strong>80% or more</strong> and value not less than <strong>40%</strong>.</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Financial Capability &amp; Turnover</td>
                    <td className="p-2.5 text-slate-700 space-y-1">
                      <div>• Average Annual Turnover for past 3 Financial Years: &ge; <strong>50% of estimated amount</strong>.</div>
                      <div>• Available Liquid Assets: &ge; <strong>10% of estimated cost</strong>.</div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-slate-800 bg-slate-50">Plant, Machinery &amp; Technical Manpower</td>
                    <td className="p-2.5 text-slate-700 space-y-1">
                      <div>• <strong>Batch Mix Plant:</strong> Agency must own a running Batch Mix Plant (Light Duty) within <strong>10 KM</strong> from work site.</div>
                      <div>• <strong>Site Lab &amp; Supervisor:</strong> Site testing lab + Diploma Civil Engineer (3 yrs exp) or Graduate Civil Engineer (1 yr exp).</div>
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

          {/* 3. ITB & GENERAL TERMS */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              3. Information to Bidders (ITB) &amp; General Terms:
            </h3>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2 text-[11px] text-slate-700">
              <div><strong>1. Two-Bid Online Submission:</strong> Register on https://etender.wb.nic.in / www.wbtenders.gov.in with Class-II/III DSC. Technical bid PDF and Financial bid BOQ uploaded concurrently.</div>
              <div><strong>2. Firm Price &amp; 1% Cess:</strong> Inclusive of all taxes, GST, royalties, and 1% BOCW Welfare Cess deducted from bills. No price escalation.</div>
              <div><strong>3. Security Deposit:</strong> 10% deducted from each Running Account bill, released after final settlement and 1-year DLP.</div>
              <div><strong>4. Agreement &amp; Commencement:</strong> Execute WBF 2911(ii) within 7 days of Work Order and commence work within 7 days.</div>
              <div><strong>5. Quality Control:</strong> MoRTH/IRC specifications; batch mix plant within 10 km to maintain viscosity temperature.</div>
              <div><strong>6. Photographic Documentation:</strong> Site photos before, during, and after execution submitted with bills.</div>
              <div><strong>7. Dispute Resolution:</strong> Governed by Govt. of West Bengal Finance Department Memorandum No. 8182-F(Y) dated 26.09.2012.</div>
            </div>

            <div className="pt-4 text-right">
              <div className="font-bold text-slate-900 text-xs">Executive Engineer (Roads &amp; Building)</div>
              <div className="text-slate-600 text-[11px]">New Town Kolkata Development Authority</div>
            </div>
          </div>

          {/* COPY FORWARDED */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1 text-[10px] text-slate-600">
            <span className="font-bold text-slate-800 block">Copy forwarded for information to:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
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

          {/* ANNEXURE-I: SAMPLE FORMAT FOR AFFIDAVIT */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
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

          <div className="flex items-center gap-2">
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
    </div>
  );
};
