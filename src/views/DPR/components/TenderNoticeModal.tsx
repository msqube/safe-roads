import React from 'react';
import { DPRRecord, TenderNotice } from '../../../models/dprModels';
import { X, CheckCircle2, Calendar, FileText, ExternalLink, Printer, Building2, ShieldAlert } from 'lucide-react';

interface TenderNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dpr: DPRRecord;
}

export const TenderNoticeModal: React.FC<TenderNoticeModalProps> = ({
  isOpen,
  onClose,
  dpr,
}) => {
  if (!isOpen || !dpr.tender) return null;

  const tender: TenderNotice = dpr.tender;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#34a853] flex items-center justify-center text-white font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Official e-Procurement Notice</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs text-slate-300 font-mono">{tender.nitNumber}</span>
              </div>
              <h2 className="text-base font-bold text-white">Notice Inviting e-Tender (e-NIT)</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-lg transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
          {/* Official Seal Banner */}
          <div className="text-center border-b border-slate-200 pb-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Government of West Bengal — Urban Development & Municipal Affairs
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              New Town Kolkata Development Authority (NKDA) & WBHIDCO
            </h3>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Major Arterial Road Infrastructure Division • 03 MAR, Action Area I, New Town, Kolkata 700156
            </p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-[#137333] border border-emerald-300 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
              <span>Published & Live on West Bengal e-Procurement Portal (wbtenders.gov.in)</span>
            </div>
          </div>

          {/* Key Tender Parameters Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">NIT Reference Number:</span>
              <div className="font-mono font-bold text-sm text-[#1a73e8]">{tender.nitNumber}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Estimated Tender Value:</span>
              <div className="font-mono font-bold text-sm text-[#137333]">
                ₹{tender.estimatedCostINR.toLocaleString('en-IN')} (Inclusive of 18% GST & 3% Contingency)
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Earnest Money Deposit (EMD 2%):</span>
              <div className="font-mono font-bold text-sm text-[#c5221f]">
                ₹{tender.earnestMoneyINR.toLocaleString('en-IN')} (Online payment via ICICI Portal)
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">Time of Completion:</span>
              <div className="font-bold text-sm text-slate-900">{tender.completionPeriodDays} Calendar Days</div>
            </div>
          </div>

          {/* Work Description */}
          <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-lg space-y-1">
            <span className="text-[11px] font-bold text-[#1a73e8] uppercase tracking-wider">Name of Work & Location:</span>
            <div className="font-semibold text-slate-900 leading-relaxed">{tender.workName}</div>
          </div>

          {/* Critical Dates */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-3.5 py-2 bg-slate-100 border-b border-slate-200 font-bold text-slate-800 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#1a73e8]" />
              <span>Crucial e-Procurement Schedule:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-center p-3 bg-white">
              <div className="p-2">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Bid Submission Closes</div>
                <div className="font-mono font-bold text-slate-900 mt-1">{tender.bidSubmissionDeadline}</div>
              </div>
              <div className="p-2">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Technical Bid Opening</div>
                <div className="font-mono font-bold text-[#1a73e8] mt-1">{tender.technicalBidOpenDate}</div>
              </div>
              <div className="p-2">
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Financial Bid Opening</div>
                <div className="font-mono font-bold text-[#137333] mt-1">{tender.financialBidOpenDate}</div>
              </div>
            </div>
          </div>

          {/* Eligibility Criteria */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-[#1a73e8]" />
              <span>Contractor Eligibility & Technical Qualification:</span>
            </h4>
            <ul className="space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200 list-disc pl-5">
              {tender.eligibilityCriteria.map((crit, idx) => (
                <li key={idx} className="leading-relaxed">
                  {crit}
                </li>
              ))}
            </ul>
          </div>

          {/* Mandatory Documents */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
              <span>Statutory Documents Required with Technical Bid:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tender.mandatoryDocuments.map((doc, idx) => (
                <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34a853]" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span>Published at:</span>
            <span className="font-semibold text-slate-700">{tender.releasedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print NIT</span>
            </button>
            <a
              href={tender.portalUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#1a73e8] hover:bg-[#1557b0] rounded flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Visit wbtenders.gov.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
