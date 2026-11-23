import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { FormPageHeader } from '../../common/FormPageHeader';
import { GenericButton } from '../../common/GenericButton';
import { StatusBadge } from '../../common/StatusBadge';
import { DPRRecord, BOQItem, ReviewStage, TenderNotice } from '../../models/dprModels';
import { dprService } from '../../services/dprService';
import { DPRDirectoryTable } from './components/DPRDirectoryTable';
import { TenderNoticeModal } from './components/TenderNoticeModal';
import { Mar1111DprDocumentView } from './components/Mar1111DprDocumentView';
import { Mar1111TenderDocumentView } from './components/Mar1111TenderDocumentView';
import { PageContainer } from '../../common/PageContainer';
import {
  FileText,
  FileSpreadsheet,
  ArrowLeft,
  Printer,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Send,
  Building,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Download,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  ExternalLink,
  Info,
  List,
  Lock,
  AlertTriangle,
  Eye,
} from 'lucide-react';

export const DPRPage: React.FC = () => {
  const { roadCode: urlRoadCode } = useParams<{ roadCode: string }>();
  const navigate = useNavigate();

  // Active Road Code (defaults to MAR-1111)
  const [selectedRoadCode, setSelectedRoadCode] = useState<string>(urlRoadCode || 'MAR-1111');

  // Mode: Directory Table View vs Official Document View
  const [viewMode, setViewMode] = useState<'table' | 'document'>(urlRoadCode ? 'document' : 'table');

  // All DPR records for directory table
  const [dprList, setDprList] = useState<DPRRecord[]>([]);

  // Active DPR record for document view
  const [dpr, setDpr] = useState<DPRRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Modal for viewing published Tender Notice (e-NIT)
  const [tenderModalRecord, setTenderModalRecord] = useState<DPRRecord | null>(null);

  // MAR 1111 Pipeline Step (Step 1: DPR Document, Step 2: e-NIT Tender)
  const [mar1111Step, setMar1111Step] = useState<'dpr' | 'tender'>('dpr');

  // Deep clone of DPR for full section editing
  const [editDpr, setEditDpr] = useState<DPRRecord | null>(null);

  // Email release workflow state
  const [selectedAuthorityEmail, setSelectedAuthorityEmail] = useState('ee.roads.hidco@wb.gov.in');
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamic 3-step tender publishing loader state for table releases
  const [isPublishingTenderModal, setIsPublishingTenderModal] = useState<boolean>(false);
  const [publishingTenderStep, setPublishingTenderStep] = useState<number>(1);
  const [publishingTargetCode, setPublishingTargetCode] = useState<string>('');

  // Dynamic 3-step tender formulation loader state (when switching to Step 2: Tender Document)
  const [isFormulatingTenderModal, setIsFormulatingTenderModal] = useState<boolean>(false);
  const [formulatingTenderStep, setFormulatingTenderStep] = useState<number>(1);

  const handleSwitchToTender = () => {
    if (mar1111Step === 'tender') return;
    setIsFormulatingTenderModal(true);
    setFormulatingTenderStep(1);
    setTimeout(() => setFormulatingTenderStep(2), 500);
    setTimeout(() => setFormulatingTenderStep(3), 1000);
    setTimeout(() => {
      setIsFormulatingTenderModal(false);
      setMar1111Step('tender');
      showToast(`Statutory Tender Document (e-NIT) formulated for ${activeRecord?.roadCode || selectedRoadCode}!`);
    }, 1500);
  };

  // Synchronize roadCode from URL & check for fresh DPR arrival notification
  useEffect(() => {
    if (urlRoadCode) {
      setSelectedRoadCode(urlRoadCode);
      setViewMode('document');
    }
    if (sessionStorage.getItem('dpr_just_generated') === 'true') {
      sessionStorage.removeItem('dpr_just_generated');
      showToast(`Detailed Project Report (DPR) successfully formulated and certified for ${urlRoadCode || 'MAR-1111'}!`);
    }
  }, [urlRoadCode]);

  // Load all DPRs and the active DPR
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allRecords, singleRecord] = await Promise.all([
        dprService.getAllDPRs(),
        dprService.getDPR(selectedRoadCode),
      ]);
      setDprList(allRecords);
      setDpr(singleRecord);
    } catch (e) {
      console.error('Failed to load DPR data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedRoadCode]);

  // Start editing mode: clone current DPR state
  const handleStartEdit = () => {
    if (!dpr) return;
    setEditDpr(JSON.parse(JSON.stringify(dpr)));
    setIsEditing(true);
  };

  // Cancel editing: revert to saved DPR state
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditDpr(null);
  };

  // Save all edited sections
  const handleSaveEdits = async () => {
    if (!editDpr) return;
    try {
      // Recompute BOQ totals
      const subTotal = editDpr.boqItems.reduce(
        (acc, i) => acc + (Number(i.quantity) || 0) * (Number(i.rateINR) || 0),
        0
      );
      const gst = Math.round(subTotal * 0.18);
      const contingency = Math.round(subTotal * 0.03);
      const grandTotal = subTotal + gst + contingency;

      const finalRecord: DPRRecord = {
        ...editDpr,
        estimatedCostINR: grandTotal,
        tender: editDpr.tender
          ? {
              ...editDpr.tender,
              estimatedCostINR: grandTotal,
              earnestMoneyINR: Math.round(grandTotal * 0.02),
              completionPeriodDays: editDpr.projectDurationDays,
            }
          : undefined,
      };

      const saved = await dprService.updateDPR(finalRecord);
      setDpr(saved);
      setDprList((prev) => prev.map((item) => (item.roadCode === saved.roadCode ? saved : item)));
      setEditDpr(null);
      setIsEditing(false);
      showToast('All DPR sections have been updated and saved successfully.');
    } catch (e) {
      console.error('Failed to save DPR edits:', e);
    }
  };

  // Edit Handlers for Section 1 (Corridor Attributes & Summary)
  const updateGeneralField = (field: keyof DPRRecord, value: any) => {
    if (!editDpr) return;
    setEditDpr({
      ...editDpr,
      [field]: value,
    });
  };

  // Edit Handlers for Section 2 (BOQ Items)
  const updateBoqItem = (index: number, field: keyof BOQItem, value: any) => {
    if (!editDpr) return;
    const updatedItems = [...editDpr.boqItems];
    const currentItem = { ...updatedItems[index], [field]: value };

    if (field === 'quantity' || field === 'rateINR') {
      const q = field === 'quantity' ? Number(value) || 0 : Number(currentItem.quantity) || 0;
      const r = field === 'rateINR' ? Number(value) || 0 : Number(currentItem.rateINR) || 0;
      currentItem.amountINR = Math.round(q * r);
    }

    updatedItems[index] = currentItem;

    const subTotal = updatedItems.reduce((acc, i) => acc + i.amountINR, 0);
    const grandTotal = subTotal + Math.round(subTotal * 0.18) + Math.round(subTotal * 0.03);

    setEditDpr({
      ...editDpr,
      boqItems: updatedItems,
      estimatedCostINR: grandTotal,
    });
  };

  const addBoqItem = () => {
    if (!editDpr) return;
    const nextIdx = editDpr.boqItems.length + 1;
    const itemNo = nextIdx < 10 ? `1.0${nextIdx}` : `1.${nextIdx}`;
    const newItem: BOQItem = {
      id: `BOQ-${Date.now().toString().slice(-4)}`,
      itemNo,
      description: 'Pothole patch repair, asphalt cold milling and tack coat application.',
      specCode: 'WB PWD SoR Item 4.12 / MoRTH 503',
      unit: 'm²',
      quantity: 50,
      rateINR: 420,
      amountINR: 21000,
    };
    const updatedItems = [...editDpr.boqItems, newItem];
    const subTotal = updatedItems.reduce((acc, i) => acc + i.amountINR, 0);
    const grandTotal = subTotal + Math.round(subTotal * 0.18) + Math.round(subTotal * 0.03);

    setEditDpr({
      ...editDpr,
      boqItems: updatedItems,
      estimatedCostINR: grandTotal,
    });
  };

  const removeBoqItem = (index: number) => {
    if (!editDpr) return;
    const updatedItems = editDpr.boqItems.filter((_, idx) => idx !== index);
    const subTotal = updatedItems.reduce((acc, i) => acc + i.amountINR, 0);
    const grandTotal = subTotal + Math.round(subTotal * 0.18) + Math.round(subTotal * 0.03);

    setEditDpr({
      ...editDpr,
      boqItems: updatedItems,
      estimatedCostINR: grandTotal,
    });
  };

  // Edit Handlers for Section 4 (Review Stages)
  const updateReviewStage = (index: number, field: keyof ReviewStage, value: any) => {
    if (!editDpr) return;
    const updatedReviews = [...editDpr.reviews];
    updatedReviews[index] = {
      ...updatedReviews[index],
      [field]: value,
    };
    setEditDpr({
      ...editDpr,
      reviews: updatedReviews,
    });
  };

  // Edit Handlers for Section 5 (Tender Notice)
  const ensureTenderExists = () => {
    if (!editDpr) return;
    if (editDpr.tender) return;

    const today = new Date();
    const bidDeadline = new Date(today.getTime() + 21 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const techBidOpen = new Date(today.getTime() + 23 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const finBidOpen = new Date(today.getTime() + 28 * 24 * 3600 * 1000).toISOString().split('T')[0];

    const initialTender: TenderNotice = {
      nitNumber: `NIT-NKDA/WBHIDCO/ROADS/2026/${editDpr.roadCode.replace(/[^0-9]/g, '').slice(-3) || '104'}`,
      workName: `Urgent Restoration, Cold Milling & Bituminous Resurfacing of ${editDpr.roadName} (${editDpr.roadCode}), ${editDpr.location}, New Town Kolkata.`,
      executingAgency: 'New Town Kolkata Development Authority (NKDA) & WBHIDCO',
      estimatedCostINR: editDpr.estimatedCostINR,
      earnestMoneyINR: Math.round(editDpr.estimatedCostINR * 0.02),
      completionPeriodDays: editDpr.projectDurationDays,
      bidSubmissionDeadline: `${bidDeadline} 17:00 IST`,
      technicalBidOpenDate: `${techBidOpen} 11:30 IST`,
      financialBidOpenDate: `${finBidOpen} 15:00 IST`,
      portalUrl: 'https://wbtenders.gov.in',
      eligibilityCriteria: [
        'Registered Class-I / Class-II Road Contractors under WB PWD / WBHIDCO / NKDA / KMDA.',
        'Credential: At least 1 completed road bituminous surfacing work of minimum 40% tender value in the last 3 financial years.',
        'Valid GSTIN, PAN card, Professional Tax (PT) clearance, and EPF/ESI registration in West Bengal.',
        'Proof of ownership or assured lease agreement of Central Hot Mix Plant (min 100 TPH) within 40 km of New Town.',
      ],
      mandatoryDocuments: [
        'Form-1 (Technical Bid Submission Application)',
        'Affidavit affirming non-blacklisting in any Govt/Semi-Govt organization',
        'Valid Trade License and Partnership Deed / Company Incorporation Certificate',
        'PAN, GST Registration & latest GSTR-3B filing acknowledgement',
      ],
      releasedAt: new Date().toLocaleString('en-IN') + ' IST',
      tenderStatus: 'Draft',
    };

    setEditDpr({
      ...editDpr,
      tender: initialTender,
    });
  };

  const updateTenderField = (field: keyof TenderNotice, value: any) => {
    if (!editDpr?.tender) return;
    setEditDpr({
      ...editDpr,
      tender: {
        ...editDpr.tender,
        [field]: value,
      },
    });
  };

  const updateEligibilityCriterion = (index: number, val: string) => {
    if (!editDpr?.tender) return;
    const updated = [...editDpr.tender.eligibilityCriteria];
    updated[index] = val;
    updateTenderField('eligibilityCriteria', updated);
  };

  const addEligibilityCriterion = () => {
    if (!editDpr?.tender) return;
    updateTenderField('eligibilityCriteria', [
      ...editDpr.tender.eligibilityCriteria,
      'Valid contractor registration and statutory labor welfare compliance certificate in West Bengal.',
    ]);
  };

  const removeEligibilityCriterion = (index: number) => {
    if (!editDpr?.tender) return;
    const updated = editDpr.tender.eligibilityCriteria.filter((_, i) => i !== index);
    updateTenderField('eligibilityCriteria', updated);
  };

  const updateMandatoryDoc = (index: number, val: string) => {
    if (!editDpr?.tender) return;
    const updated = [...editDpr.tender.mandatoryDocuments];
    updated[index] = val;
    updateTenderField('mandatoryDocuments', updated);
  };

  const addMandatoryDoc = () => {
    if (!editDpr?.tender) return;
    updateTenderField('mandatoryDocuments', [
      ...editDpr.tender.mandatoryDocuments,
      'Machinery Deployment Schedule & Plant Calibration Certificate',
    ]);
  };

  const removeMandatoryDoc = (index: number) => {
    if (!editDpr?.tender) return;
    const updated = editDpr.tender.mandatoryDocuments.filter((_, i) => i !== index);
    updateTenderField('mandatoryDocuments', updated);
  };

  // Workflow Handlers for View Mode
  const handleDispatchEmail = async () => {
    if (!dpr) return;
    setIsSendingEmail(true);
    try {
      const updated = await dprService.releaseEmail(dpr.roadCode, selectedAuthorityEmail);
      setDpr(updated);
      setDprList((prev) => prev.map((item) => (item.roadCode === updated.roadCode ? updated : item)));
      showToast(`DPR dispatched via official email to ${selectedAuthorityEmail} for administrative review!`);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleApproveStage = async (stageId: 1 | 2 | 3) => {
    if (!dpr) return;
    try {
      const updated = await dprService.approveReviewStage(dpr.roadCode, stageId);
      setDpr(updated);
      setDprList((prev) => prev.map((item) => (item.roadCode === updated.roadCode ? updated : item)));
      showToast(`Review Stage ${stageId} approved and digitally stamped!`);
    } catch (e) {
      console.error(e);
    }
  };

  // Release Tender Handler (called from table or document view)
  const handleReleaseTender = async (targetRoadCode?: string) => {
    const code = targetRoadCode || dpr?.roadCode;
    if (!code) return;
    setPublishingTargetCode(code);
    setIsPublishingTenderModal(true);
    setPublishingTenderStep(1);

    setTimeout(() => setPublishingTenderStep(2), 550);
    setTimeout(() => setPublishingTenderStep(3), 1100);

    setTimeout(async () => {
      try {
        const updated = await dprService.releaseTender(code);
        if (dpr && dpr.roadCode === code) {
          setDpr(updated);
        }
        setDprList((prev) => prev.map((item) => (item.roadCode === code ? updated : item)));
        setIsPublishingTenderModal(false);
        setTenderModalRecord(updated);
        showToast(`Notice Inviting Tender (${updated.tender?.nitNumber}) published live to wbtenders.gov.in!`);
      } catch (e) {
        console.error(e);
        setIsPublishingTenderModal(false);
      }
    }, 1650);
  };

  // Select Road to view Document
  const handleSelectRoad = (code: string) => {
    setSelectedRoadCode(code);
    setViewMode('document');
    navigate(`/dpr/${code}`);
  };

  // Back to Table
  const handleBackToTable = () => {
    setViewMode('table');
    navigate('/dpr');
  };

  if (isLoading && !dpr) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 text-xs">Loading Detailed Project Reports & Tender Directory...</p>
        </div>
      </div>
    );
  }

  // Active data record: either edit draft or saved state
  const activeRecord = isEditing && editDpr ? editDpr : dpr;
  const allReviewsApproved = activeRecord ? activeRecord.reviews.every((r) => r.status === 'Approved') : false;
  const subTotalBOQ = activeRecord
    ? activeRecord.boqItems.reduce((acc, i) => acc + (Number(i.amountINR) || 0), 0)
    : 0;
  const gstAmount = Math.round(subTotalBOQ * 0.18);
  const contingencyAmount = Math.round(subTotalBOQ * 0.03);

  return (
    <PageContainer className="pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-3 bg-white border border-slate-300 rounded-lg shadow-lg text-xs font-semibold text-slate-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dynamic 3-Step Tender Formulation Modal (Light Theme) */}
      {isFormulatingTenderModal &&
        createPortal(
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
            <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-2xs">
                    <ShieldCheck className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      Generating Statutory Tender Document (e-NIT)
                    </h3>
                    <p className="text-xs text-slate-500 font-mono">
                      Corridor: {activeRecord?.roadCode || selectedRoadCode} ({activeRecord?.roadName || 'Road Corridor'})
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                  Step {formulatingTenderStep} of 3
                </span>
              </div>

              {/* Step indicator description */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-900">
                    {formulatingTenderStep === 1 && 'Extracting DPR Technical Sanctions & Cost Formulation (₹28.20L)...'}
                    {formulatingTenderStep === 2 && 'Formulating Official Notice Inviting Tender (e-NIT) & ITB Criteria...'}
                    {formulatingTenderStep === 3 && 'Generating 4-Page Statutory Bidding Package & Affidavit Forms...'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                  {formulatingTenderStep === 1 &&
                    'Synchronizing Part 1 Pothole Repairs (₹3,72,000) and Part 2 BC Resurfacing (₹24,48,000) with 2% EMD (₹56,400).'}
                  {formulatingTenderStep === 2 &&
                    'Drafting WB PWD e-NIT No. 01/EE(R&B)/NKDA/2026-27 with 21-day bidding timeline and Class-I/II credential requirements.'}
                  {formulatingTenderStep === 3 &&
                    'Assembling official two-bid submission package, Form-III bidder declarations, and sample affidavit annexures.'}
                </p>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>Formulation Progress</span>
                  <span className="text-emerald-600 font-bold">
                    {formulatingTenderStep === 1 ? '33%' : formulatingTenderStep === 2 ? '66%' : '100%'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="bg-[#34a853] h-full transition-all duration-500 rounded-full shadow-2xs"
                    style={{ width: `${(formulatingTenderStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Tender Publication 3-Step Animated Modal (Light Theme) */}
      {isPublishingTenderModal &&
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
                      Corridor: {publishingTargetCode || selectedRoadCode}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                  Step {publishingTenderStep} of 3
                </span>
              </div>

              {/* Step indicator description */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-900">
                    {publishingTenderStep === 1 && 'Validating Technical Sanctions & Two-Bid Eligibility Package...'}
                    {publishingTenderStep === 2 && 'Formulating Official Notice Inviting Tender (e-NIT)...'}
                    {publishingTenderStep === 3 && 'Transmitting Live to West Bengal e-Tender Portal (wbtenders.gov.in)...'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-7 leading-relaxed">
                  {publishingTenderStep === 1 &&
                    'Verifying statutory project sanction, 2% Earnest Money Deposit, and Class-I/II WB PWD contractor credential checks.'}
                  {publishingTenderStep === 2 &&
                    'Generating statutory Tender Document, 21-day bid timeline, technical criteria, and mandatory affidavit forms.'}
                  {publishingTenderStep === 3 &&
                    'Transmitting cryptographically signed tender package to wbtenders.gov.in state e-Procurement repository.'}
                </p>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>Publication Progress</span>
                  <span className="text-emerald-600 font-bold">
                    {publishingTenderStep === 1 ? '33%' : publishingTenderStep === 2 ? '66%' : '100%'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div
                    className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 h-full transition-all duration-500 rounded-full shadow-2xs"
                    style={{ width: `${(publishingTenderStep / 3) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Tender Notice Modal */}
      {tenderModalRecord && (
        <TenderNoticeModal
          isOpen={!!tenderModalRecord}
          onClose={() => setTenderModalRecord(null)}
          dpr={tenderModalRecord}
        />
      )}

      {/* Mode Switcher Tab Bar - Equal Padding p-3.5 */}
      <div className="bg-white p-3.5 border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBackToTable}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-[#1a73e8] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <List className="w-4 h-4" />
            <span>DPR Master Register (Table View)</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                viewMode === 'table' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {dprList.length}
            </span>
          </button>

          <button
            onClick={() => {
              setViewMode('document');
              if (activeRecord) {
                navigate(`/dpr/${activeRecord.roadCode}`);
              }
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              viewMode === 'document'
                ? 'bg-[#1a73e8] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Official DPR Document: {activeRecord?.roadCode || 'MAR-1111'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 hidden sm:inline">West Bengal PWD / NKDA Urban Norms</span>
          {activeRecord?.tender?.tenderStatus === 'Published' && (
            <button
              onClick={() => setTenderModalRecord(activeRecord)}
              className="px-2.5 py-1 bg-emerald-50 text-[#137333] border border-emerald-300 rounded-md font-bold flex items-center gap-1 hover:bg-emerald-100 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#34a853]" />
              <span>NIT Live</span>
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: DPR Master Directory Table */}
      {viewMode === 'table' && (
        <DPRDirectoryTable
          dprList={dprList}
          onSelectRoad={handleSelectRoad}
          onReleaseTender={handleReleaseTender}
          onViewTender={(rec) => setTenderModalRecord(rec)}
        />
      )}

      {/* VIEW MODE 2: Official DPR Document (WB PWD Format) */}
      {viewMode === 'document' && activeRecord && (
        <div className="space-y-6">
          {(activeRecord.roadCode === 'MAR-1111' ||
            localStorage.getItem(`nsv_uploaded_${activeRecord.roadCode}`) === 'true' ||
            localStorage.getItem(`dpr_approved_${activeRecord.roadCode}`) === 'true' ||
            localStorage.getItem(`nsv_uploaded_${selectedRoadCode}`) === 'true' ||
            localStorage.getItem(`dpr_approved_${selectedRoadCode}`) === 'true' ||
            activeRecord.hasNsvSurvey ||
            activeRecord.roadCode.includes('1111')) ? (
            <div className="space-y-4">
              {/* Step Navigation Bar for Active Road - Equal Padding p-3.5 */}
              <div className="bg-white p-3.5 border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMar1111Step('dpr')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      mar1111Step === 'dpr'
                        ? 'bg-[#1a73e8] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Step 1: Detailed Project Report (DPR)</span>
                  </button>

                  <button
                    onClick={handleSwitchToTender}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                      mar1111Step === 'tender'
                        ? 'bg-[#34a853] text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Step 2: Tender Document</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => navigate(`/nsv/${activeRecord.roadCode}`)}
                    className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded text-xs font-semibold cursor-pointer"
                  >
                    &larr; Back to NSV Details
                  </button>
                </div>
              </div>

              {/* Step 1 or Step 2 */}
              {mar1111Step === 'dpr' ? (
                <Mar1111DprDocumentView
                  dpr={activeRecord}
                  onProceedToTender={handleSwitchToTender}
                />
              ) : (
                <Mar1111TenderDocumentView
                  dpr={activeRecord}
                  onBackToDpr={() => setMar1111Step('dpr')}
                  onPublishSuccess={() => {
                    handleReleaseTender(activeRecord.roadCode);
                    showToast(`Notice Inviting Tender published to wbtenders.gov.in for ${activeRecord.roadCode}!`);
                  }}
                />
              )}
            </div>
          ) : activeRecord.isBlocked ? (
            <div className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-amber-50 via-orange-50/40 to-slate-50 border-2 border-amber-300 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                      <span className="text-xs font-bold uppercase tracking-wider text-red-700">
                        DPR &amp; Tender Pre-Requisite Blocker
                      </span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      DPR Formulation &amp; Tender Release Blocked for {activeRecord.roadName} ({activeRecord.roadCode})
                    </h3>
                    <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">
                      {activeRecord.blockReason ||
                        'Under West Bengal PWD and IRC:SP:19-2020 guidelines, Detailed Project Reports (DPR) and Notice Inviting e-Tenders (e-NIT) cannot be drafted or released without certified laser profilometer roughness (IRI) and rut depth data.'}
                    </p>
                  </div>

                  <span className="px-3 py-1 bg-red-100 border border-red-300 text-red-800 rounded-full font-bold text-xs whitespace-nowrap">
                    DPR &amp; Tender Blocked
                  </span>
                </div>

                {/* Pipeline Progression Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 block">Stage 1: Drone Aerial Survey</span>
                    <span className={`text-xs font-semibold flex items-center gap-1.5 ${activeRecord.hasDroneSurvey ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {activeRecord.hasDroneSurvey ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Completed &amp; Verified</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span>NO Drone Survey Performed Yet</span>
                        </>
                      )}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-amber-200 space-y-1">
                    <span className="text-[11px] font-bold text-amber-900 block">Stage 2: Ground NSV Survey</span>
                    <span className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>NO NSV Survey Performed Yet</span>
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-red-200 space-y-1">
                    <span className="text-[11px] font-bold text-red-900 block">Stage 3: DPR &amp; Tender</span>
                    <span className="text-xs font-semibold text-red-700 flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-red-600" />
                      <span>Blocked (Awaiting NSV Survey)</span>
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200">
                  <button
                    onClick={() => navigate(`/nsv/${activeRecord.roadCode}`)}
                    className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View NSV Details &amp; Deploy Vehicle</span>
                  </button>

                  <button
                    onClick={() => navigate('/dpr/MAR-1111')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>View Approved Reference DPR &amp; Tender (Road MAR 1111)</span>
                  </button>

                  <button
                    onClick={handleBackToTable}
                    className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <List className="w-4 h-4 text-slate-600" />
                    <span>Back to Register Table</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Editing Mode Alert Banner */}
          {isEditing && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-[#1a73e8] flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#1a73e8] flex-shrink-0" />
                <span className="font-semibold">
                  Edit Mode Active: Every section below is fully editable (General Profile, BOQ items, Authority Reviews, and Tender). Click 'Save Changes' to apply.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdits}
                  className="px-3 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded shadow-xs cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          )}

          {/* Page Header */}
          <FormPageHeader
            breadcrumbs={[
              { label: 'GIS Dashboard', onClick: () => navigate('/') },
              { label: 'DPR Directory Table', onClick: handleBackToTable },
              { label: `NSV Details (${activeRecord.roadCode})`, onClick: () => navigate(`/nsv/${activeRecord.roadCode}`) },
              { label: 'Detailed Project Report (DPR)' },
            ]}
            title={`Detailed Project Report (DPR): ${activeRecord.roadCode}`}
            subtitle={`${activeRecord.roadName} • ${activeRecord.location} (West Bengal PWD / NKDA Urban Norms)`}
            badge={
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#e8f0fe] text-[#1a73e8] border border-[#d2e3fc]">
                {activeRecord.dprNumber}
              </span>
            }
            actions={
              <div className="flex items-center gap-2">
                <GenericButton
                  variant="secondary"
                  size="sm"
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  onClick={handleBackToTable}
                >
                  Back to DPR Register Table
                </GenericButton>

                {!isEditing ? (
                  <GenericButton
                    variant="secondary"
                    size="sm"
                    leftIcon={<Edit3 className="w-3.5 h-3.5 text-blue-600" />}
                    onClick={handleStartEdit}
                  >
                    Edit DPR
                  </GenericButton>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <GenericButton
                      variant="primary"
                      size="sm"
                      leftIcon={<Save className="w-3.5 h-3.5" />}
                      onClick={handleSaveEdits}
                    >
                      Save Changes
                    </GenericButton>
                    <GenericButton
                      variant="secondary"
                      size="sm"
                      leftIcon={<X className="w-3.5 h-3.5" />}
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </GenericButton>
                  </div>
                )}

                <GenericButton
                  variant="secondary"
                  size="sm"
                  leftIcon={<Printer className="w-3.5 h-3.5 text-slate-500" />}
                  onClick={() => window.print()}
                >
                  Print DPR
                </GenericButton>
              </div>
            }
          />

          {/* 1. SECTION 1: DPR Executive Summary & General Corridor Profile */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Government of West Bengal</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs font-semibold text-[#1a73e8]">New Town Kolkata Development Authority (NKDA)</span>
                  {isEditing && (
                    <span className="text-[10px] bg-blue-100 text-[#1a73e8] px-2 py-0.5 rounded font-mono font-bold">
                      Editable Section 1
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  Section 1: General Corridor Profile & Executive Scope
                </h2>
              </div>

              <div className="text-right text-xs">
                <div className="text-slate-500">Last Revised / Vetted:</div>
                <div className="font-semibold text-slate-800">{activeRecord.lastUpdated}</div>
              </div>
            </div>

            {/* Technical Attributes Grid: View Mode vs Edit Mode */}
            {!isEditing ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-500">Road Length</span>
                  <div className="text-sm font-bold text-slate-900">{activeRecord.roadLengthKm} km</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-500">Carriageway</span>
                  <div className="text-sm font-bold text-slate-900">{activeRecord.carriagewayWidthMeters} m (Dual)</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-500">Distress Area</span>
                  <div className="text-sm font-bold text-[#c5221f]">{activeRecord.distressAreaM2} m²</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-500">Avg Rut Depth</span>
                  <div className="text-sm font-bold text-[#c5221f]">{activeRecord.maxRutDepthMm} mm</div>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <span className="text-slate-500">Average IRI</span>
                  <div className="text-sm font-bold text-slate-900">{activeRecord.avgIRI} m/km</div>
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded">
                  <span className="text-emerald-700 font-semibold">Total Estimated Cost</span>
                  <div className="text-sm font-bold text-[#137333]">₹{activeRecord.estimatedCostINR.toLocaleString('en-IN')}</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs bg-blue-50/30 p-3 rounded-lg border border-blue-200">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Road Length (km):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editDpr?.roadLengthKm || 0}
                    onChange={(e) => updateGeneralField('roadLengthKm', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded font-bold bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Carriageway (m):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={editDpr?.carriagewayWidthMeters || 0}
                    onChange={(e) => updateGeneralField('carriagewayWidthMeters', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded font-bold bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Distress Area (m²):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editDpr?.distressAreaM2 || 0}
                    onChange={(e) => updateGeneralField('distressAreaM2', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-red-300 text-red-700 rounded font-bold bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Avg Rut Depth (mm):</label>
                  <input
                    type="number"
                    value={editDpr?.maxRutDepthMm || 0}
                    onChange={(e) => updateGeneralField('maxRutDepthMm', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-red-300 text-red-700 rounded font-bold bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Average IRI (m/km):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editDpr?.avgIRI || 0}
                    onChange={(e) => updateGeneralField('avgIRI', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded font-bold bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Condition Score (/100):</label>
                  <input
                    type="number"
                    value={editDpr?.goodnessScore || 0}
                    onChange={(e) => updateGeneralField('goodnessScore', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-slate-300 rounded font-bold bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Narrative / Editable Summary */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Executive Scope & Technical Justification:</span>
                {isEditing && <span className="text-[#1a73e8] font-semibold text-[11px]">(Editable narrative)</span>}
              </label>
              {!isEditing ? (
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                  {activeRecord.executiveSummary}
                </p>
              ) : (
                <textarea
                  rows={3}
                  value={editDpr?.executiveSummary || ''}
                  onChange={(e) => updateGeneralField('executiveSummary', e.target.value)}
                  className="w-full text-xs p-2.5 border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                />
              )}
            </div>

            {/* Treatment & Duration & Contractor Class */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="md:col-span-1 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Proposed Engineering Treatment:</label>
                {!isEditing ? (
                  <div className="text-xs text-slate-800 p-2.5 bg-blue-50/50 border border-blue-100 rounded font-medium">
                    {activeRecord.proposedTreatment}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editDpr?.proposedTreatment || ''}
                    onChange={(e) => updateGeneralField('proposedTreatment', e.target.value)}
                    className="w-full text-xs p-2 border border-blue-400 rounded focus:outline-none bg-white font-medium"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Completion Duration (Days):</label>
                {!isEditing ? (
                  <div className="text-xs text-slate-800 p-2.5 bg-slate-50 border border-slate-200 rounded font-bold">
                    {activeRecord.projectDurationDays} Calendar Days
                  </div>
                ) : (
                  <input
                    type="number"
                    value={editDpr?.projectDurationDays || 30}
                    onChange={(e) => updateGeneralField('projectDurationDays', parseInt(e.target.value) || 30)}
                    className="w-full text-xs p-2 border border-blue-400 rounded focus:outline-none bg-white font-bold"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contractor Class Required:</label>
                {!isEditing ? (
                  <div className="text-xs text-slate-800 p-2.5 bg-slate-50 border border-slate-200 rounded font-medium">
                    {activeRecord.contractorClassRequired}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={editDpr?.contractorClassRequired || ''}
                    onChange={(e) => updateGeneralField('contractorClassRequired', e.target.value)}
                    className="w-full text-xs p-2 border border-blue-400 rounded focus:outline-none bg-white font-medium"
                  />
                )}
              </div>
            </div>
          </div>

          {/* 2. SECTION 2: Bill of Quantities (BOQ) Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#34a853]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Section 2: Bill of Quantities (BOQ) — WB PWD Schedule of Rates 2022-2025
                  </h3>
                  {isEditing && (
                    <span className="text-[10px] bg-green-100 text-[#137333] px-2 py-0.5 rounded font-mono font-bold">
                      Editable Section 2
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">Itemized cost estimate adhering to West Bengal Urban Road Standards</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded border border-slate-200">
                  {activeRecord.boqItems.length} Measured Items
                </span>
                {isEditing && (
                  <button
                    onClick={addBoqItem}
                    className="px-2.5 py-1 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                    <th className="p-3 w-14 text-center">Item</th>
                    <th className="p-3">Description of Work & Specifications</th>
                    <th className="p-3 w-40">SoR / MoRTH Spec</th>
                    <th className="p-3 w-24 text-center">Unit</th>
                    <th className="p-3 w-28 text-right">Quantity</th>
                    <th className="p-3 w-28 text-right">Rate (₹)</th>
                    <th className="p-3 w-32 text-right">Amount (₹)</th>
                    {isEditing && <th className="p-3 w-12 text-center">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeRecord.boqItems.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/80 transition">
                      {/* Item No */}
                      <td className="p-2 text-center font-mono font-semibold text-slate-500">
                        {!isEditing ? (
                          item.itemNo
                        ) : (
                          <input
                            type="text"
                            value={item.itemNo}
                            onChange={(e) => updateBoqItem(idx, 'itemNo', e.target.value)}
                            className="w-12 text-center p-1 border border-slate-300 rounded font-mono text-xs bg-white"
                          />
                        )}
                      </td>

                      {/* Description */}
                      <td className="p-2 font-medium text-slate-900">
                        {!isEditing ? (
                          item.description
                        ) : (
                          <textarea
                            rows={2}
                            value={item.description}
                            onChange={(e) => updateBoqItem(idx, 'description', e.target.value)}
                            className="w-full p-1.5 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        )}
                      </td>

                      {/* Spec Code */}
                      <td className="p-2 text-slate-500 font-mono text-[11px]">
                        {!isEditing ? (
                          item.specCode
                        ) : (
                          <input
                            type="text"
                            value={item.specCode}
                            onChange={(e) => updateBoqItem(idx, 'specCode', e.target.value)}
                            className="w-full p-1 border border-slate-300 rounded text-xs font-mono bg-white"
                          />
                        )}
                      </td>

                      {/* Unit */}
                      <td className="p-2 text-center text-slate-600">
                        {!isEditing ? (
                          item.unit
                        ) : (
                          <select
                            value={item.unit}
                            onChange={(e) => updateBoqItem(idx, 'unit', e.target.value)}
                            className="p-1 border border-slate-300 rounded text-xs bg-white"
                          >
                            <option value="m²">m²</option>
                            <option value="m³">m³</option>
                            <option value="MT">MT</option>
                            <option value="Running Meter">Running Meter</option>
                            <option value="Lump Sum">Lump Sum</option>
                            <option value="No.">No.</option>
                          </select>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="p-2 text-right font-mono font-semibold text-slate-800">
                        {!isEditing ? (
                          item.quantity.toLocaleString('en-IN')
                        ) : (
                          <input
                            type="number"
                            step="any"
                            value={item.quantity}
                            onChange={(e) => updateBoqItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-20 text-right p-1 border border-slate-300 rounded font-mono text-xs bg-white"
                          />
                        )}
                      </td>

                      {/* Rate (INR) */}
                      <td className="p-2 text-right font-mono text-slate-700">
                        {!isEditing ? (
                          `₹${item.rateINR.toLocaleString('en-IN')}`
                        ) : (
                          <input
                            type="number"
                            value={item.rateINR}
                            onChange={(e) => updateBoqItem(idx, 'rateINR', parseFloat(e.target.value) || 0)}
                            className="w-20 text-right p-1 border border-slate-300 rounded font-mono text-xs bg-white"
                          />
                        )}
                      </td>

                      {/* Amount (INR) */}
                      <td className="p-2 text-right font-mono font-bold text-slate-900">
                        ₹{item.amountINR.toLocaleString('en-IN')}
                      </td>

                      {/* Delete Action (Edit Mode) */}
                      {isEditing && (
                        <td className="p-2 text-center">
                          <button
                            onClick={() => removeBoqItem(idx)}
                            title="Delete this BOQ line item"
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-semibold text-xs">
                  <tr>
                    <td colSpan={isEditing ? 6 : 6} className="p-2.5 text-right text-slate-600">Sub-Total (Basic Works Cost):</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">₹{subTotalBOQ.toLocaleString('en-IN')}</td>
                    {isEditing && <td />}
                  </tr>
                  <tr>
                    <td colSpan={isEditing ? 6 : 6} className="p-2 text-right text-slate-600">Add GST @ 18%:</td>
                    <td className="p-2 text-right font-mono text-slate-800">₹{gstAmount.toLocaleString('en-IN')}</td>
                    {isEditing && <td />}
                  </tr>
                  <tr>
                    <td colSpan={isEditing ? 6 : 6} className="p-2 text-right text-slate-600">Add Physical & Quality Contingency @ 3%:</td>
                    <td className="p-2 text-right font-mono text-slate-800">₹{contingencyAmount.toLocaleString('en-IN')}</td>
                    {isEditing && <td />}
                  </tr>
                  <tr className="bg-emerald-50 text-emerald-900 text-sm border-t border-emerald-200">
                    <td colSpan={isEditing ? 6 : 6} className="p-3 text-right font-bold">Grand Total Estimated Project Cost (INR):</td>
                    <td className="p-3 text-right font-mono font-extrabold text-[#137333]">₹{activeRecord.estimatedCostINR.toLocaleString('en-IN')}</td>
                    {isEditing && <td />}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* 3. SECTION 3: Email Release for Authority Review */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#1a73e8]" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">
                      Section 3: Email Release for Authority Review & Sanction
                    </h3>
                    {isEditing && (
                      <span className="text-[10px] bg-blue-100 text-[#1a73e8] px-2 py-0.5 rounded font-mono font-bold">
                        Editable Section 3
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">Dispatch this Detailed Project Report to competent authorities for scrutiny</p>
                </div>
              </div>
              {activeRecord.emailDispatchedAt && (
                <span className="text-xs text-[#137333] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Dispatched on: {activeRecord.emailDispatchedAt}</span>
                </span>
              )}
            </div>

            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Select Authority / Competent Signatory:</label>
                  <select
                    value={selectedAuthorityEmail}
                    onChange={(e) => setSelectedAuthorityEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded font-medium text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="ee.roads.hidco@wb.gov.in">
                      Er. Subhashis Sen — Executive Engineer (Roads), WBHIDCO / PWD WB (ee.roads.hidco@wb.gov.in)
                    </option>
                    <option value="finance.controller@nkda.gov.in">
                      Shri Partha Mukherjee — Financial Controller, NKDA (finance.controller@nkda.gov.in)
                    </option>
                    <option value="ceo.nkda@wb.gov.in">
                      Dr. Debashis Sen — Chief Executive Officer (CEO), NKDA Board (ceo.nkda@wb.gov.in)
                    </option>
                  </select>
                </div>

                <div className="pt-5">
                  <GenericButton
                    variant="primary"
                    size="md"
                    leftIcon={<Send className="w-4 h-4" />}
                    isLoading={isSendingEmail}
                    onClick={handleDispatchEmail}
                  >
                    Release Email for Approval
                  </GenericButton>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-50/30 p-3.5 rounded-lg border border-blue-200 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Official Recipient Authority Email:</label>
                  <input
                    type="email"
                    value={editDpr?.emailDispatchedTo || 'ee.roads.hidco@wb.gov.in'}
                    onChange={(e) => updateGeneralField('emailDispatchedTo', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Dispatch Timestamp Record:</label>
                  <input
                    type="text"
                    value={editDpr?.emailDispatchedAt || ''}
                    placeholder="e.g. 15 Nov 2026, 11:30 IST (or leave blank if pending)"
                    onChange={(e) => updateGeneralField('emailDispatchedAt', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* 4. SECTION 4: Three-Stage Sequential Review & Approval Process */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#1a73e8]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Section 4: 3-Stage Statutory Review & Sanction Workflow
                  </h3>
                  {isEditing && (
                    <span className="text-[10px] bg-blue-100 text-[#1a73e8] px-2 py-0.5 rounded font-mono font-bold">
                      Editable Section 4
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Technical, Financial, and Administrative sanctions prior to releasing the tender
                </p>
              </div>

              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  allReviewsApproved
                    ? 'bg-emerald-50 text-[#137333] border-emerald-200'
                    : 'bg-amber-50 text-[#b06000] border-[#fbbc04]/40'
                }`}
              >
                {allReviewsApproved ? 'Fully Approved (3 of 3)' : 'Pending Approval'}
              </span>
            </div>

            {/* 3 Review Stages Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeRecord.reviews.map((rev, idx) => {
                const isApproved = rev.status === 'Approved';
                const isInReview = rev.status === 'In Review';

                return (
                  <div
                    key={rev.stageId}
                    className={`p-4 rounded-lg border transition ${
                      isApproved
                        ? 'bg-emerald-50/40 border-emerald-300'
                        : isInReview
                        ? 'bg-blue-50/40 border-blue-300 ring-2 ring-blue-100'
                        : 'bg-slate-50/60 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Stage {rev.stageId}
                      </span>
                      {!isEditing ? (
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                            isApproved
                              ? 'bg-emerald-100 text-[#137333]'
                              : isInReview
                              ? 'bg-blue-100 text-[#1a73e8]'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {rev.status}
                        </span>
                      ) : (
                        <select
                          value={rev.status}
                          onChange={(e) => updateReviewStage(idx, 'status', e.target.value)}
                          className="text-xs p-1 rounded border border-slate-300 bg-white font-semibold"
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Review">In Review</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      )}
                    </div>

                    {!isEditing ? (
                      <>
                        <h4 className="text-xs font-bold text-slate-900 mb-1">{rev.stageName}</h4>
                        <div className="text-[11px] text-slate-600 font-medium">{rev.authorityName}</div>
                        <div className="text-[10px] text-slate-400 font-mono mb-2">{rev.authorityRole}</div>

                        {isApproved && (
                          <div className="mt-2 pt-2 border-t border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                            <div className="flex items-center gap-1 font-semibold text-[#137333]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approved: {rev.reviewedAt || 'Recorded'}</span>
                            </div>
                            <p className="text-[10px] italic text-slate-600 bg-white/80 p-1.5 rounded border border-emerald-100">
                              "{rev.remarks}"
                            </p>
                          </div>
                        )}

                        {/* Approve Simulation Button for view mode */}
                        {!isApproved && (
                          <div className="mt-3 pt-2 border-t border-slate-200">
                            <button
                              onClick={() => handleApproveStage(rev.stageId)}
                              className={`w-full py-1.5 px-2 rounded text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1 shadow-xs ${
                                isInReview
                                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white'
                                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Approve Stage {rev.stageId}</span>
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Stage Title:</label>
                          <input
                            type="text"
                            value={rev.stageName}
                            onChange={(e) => updateReviewStage(idx, 'stageName', e.target.value)}
                            className="w-full p-1 border border-slate-300 rounded font-semibold text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Authority Name:</label>
                          <input
                            type="text"
                            value={rev.authorityName}
                            onChange={(e) => updateReviewStage(idx, 'authorityName', e.target.value)}
                            className="w-full p-1 border border-slate-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Designation / Role:</label>
                          <input
                            type="text"
                            value={rev.authorityRole}
                            onChange={(e) => updateReviewStage(idx, 'authorityRole', e.target.value)}
                            className="w-full p-1 border border-slate-300 rounded text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Official Email:</label>
                          <input
                            type="email"
                            value={rev.authorityEmail}
                            onChange={(e) => updateReviewStage(idx, 'authorityEmail', e.target.value)}
                            className="w-full p-1 border border-slate-300 rounded text-xs bg-white font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-semibold block">Review Remarks / Notes:</label>
                          <textarea
                            rows={2}
                            value={rev.remarks || ''}
                            onChange={(e) => updateReviewStage(idx, 'remarks', e.target.value)}
                            className="w-full p-1 border border-slate-300 rounded text-xs bg-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. SECTION 5: Public Procurement & Tender Notice (NIT) */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#34a853]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Section 5: Public Procurement & Tender Release (NIT)
                  </h3>
                  {isEditing && (
                    <span className="text-[10px] bg-blue-100 text-[#1a73e8] px-2 py-0.5 rounded font-mono font-bold">
                      Editable Section 5
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Notice Inviting Tender (NIT) for publishing on West Bengal e-Procurement Portal (wbtenders.gov.in)
                </p>
              </div>

              {/* Release Tender Button or Init in Edit Mode */}
              <div className="flex items-center gap-2">
                {isEditing && !editDpr?.tender ? (
                  <button
                    onClick={ensureTenderExists}
                    className="px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Configure Tender Specification</span>
                  </button>
                ) : activeRecord.tender?.tenderStatus === 'Published' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#137333] bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
                      <span>Tender Published on wbtenders.gov.in</span>
                    </span>
                    <button
                      onClick={() => setTenderModalRecord(activeRecord)}
                      className="px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Tender Document</span>
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={!allReviewsApproved}
                    onClick={() => handleReleaseTender(activeRecord.roadCode)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-2 shadow-sm cursor-pointer ${
                      allReviewsApproved
                        ? 'bg-[#34a853] hover:bg-[#2d9247] text-white'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                    }`}
                    title={
                      !allReviewsApproved
                        ? 'Requires all 3 statutory review stages to be approved before release'
                        : 'Click to release and publish official NIT tender'
                    }
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Release Tender</span>
                  </button>
                )}
              </div>
            </div>

            {!allReviewsApproved && !activeRecord.tender && !isEditing && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Tender Release Gate:</span>
                  <p className="mt-0.5 text-amber-800">
                    The "Release Tender" button will unlock as soon as Technical, Financial, and Administrative sanctions
                    are completed above. You can also click "Edit DPR" to customize tender terms in advance.
                  </p>
                </div>
              </div>
            )}

            {/* Official Notice Inviting Tender (NIT) Document: View vs Edit Mode */}
            {activeRecord.tender && (
              <div className="border border-slate-300 rounded-lg p-5 bg-slate-50 space-y-4">
                <div className="text-center border-b border-slate-300 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Notice Inviting Tender (e-Tender)
                  </span>
                  <h2 className="text-base font-extrabold text-slate-900 mt-1">
                    New Town Kolkata Development Authority (NKDA) & WBHIDCO
                  </h2>
                  <div className="text-xs font-mono font-bold text-[#1a73e8] mt-0.5">
                    {!isEditing ? (
                      activeRecord.tender.nitNumber
                    ) : (
                      <input
                        type="text"
                        value={activeRecord.tender.nitNumber}
                        onChange={(e) => updateTenderField('nitNumber', e.target.value)}
                        className="p-1 border border-blue-400 rounded text-center text-xs font-mono bg-white"
                      />
                    )}
                  </div>
                </div>

                {/* Key Tender Parameters Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <div className="p-2.5 bg-white border border-slate-200 rounded">
                      <span className="text-slate-500 font-medium">Name of Work:</span>
                      {!isEditing ? (
                        <div className="font-semibold text-slate-900 mt-0.5">{activeRecord.tender.workName}</div>
                      ) : (
                        <input
                          type="text"
                          value={activeRecord.tender.workName}
                          onChange={(e) => updateTenderField('workName', e.target.value)}
                          className="w-full p-1.5 border border-slate-300 rounded text-xs font-semibold bg-white mt-1"
                        />
                      )}
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded flex justify-between items-center">
                      <span className="text-slate-500">Estimated Tender Value:</span>
                      <span className="font-bold font-mono text-slate-900">
                        ₹{activeRecord.tender.estimatedCostINR.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded flex justify-between items-center">
                      <span className="text-slate-500">Earnest Money Deposit (EMD 2%):</span>
                      <span className="font-bold font-mono text-[#c5221f]">
                        ₹{activeRecord.tender.earnestMoneyINR.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded flex justify-between items-center">
                      <span className="text-slate-500">Completion Period:</span>
                      {!isEditing ? (
                        <span className="font-bold text-slate-900">{activeRecord.tender.completionPeriodDays} Days</span>
                      ) : (
                        <input
                          type="number"
                          value={activeRecord.tender.completionPeriodDays}
                          onChange={(e) => updateTenderField('completionPeriodDays', parseInt(e.target.value) || 30)}
                          className="w-24 text-right p-1 border border-slate-300 rounded text-xs font-bold bg-white"
                        />
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="p-2.5 bg-white border border-slate-200 rounded flex justify-between items-center">
                      <span className="text-slate-500">Bid Submission Deadline:</span>
                      {!isEditing ? (
                        <span className="font-bold text-slate-800">{activeRecord.tender.bidSubmissionDeadline}</span>
                      ) : (
                        <input
                          type="text"
                          value={activeRecord.tender.bidSubmissionDeadline}
                          onChange={(e) => updateTenderField('bidSubmissionDeadline', e.target.value)}
                          className="w-48 p-1 border border-slate-300 rounded text-xs bg-white text-right"
                        />
                      )}
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded flex justify-between items-center">
                      <span className="text-slate-500">Technical Bid Opening:</span>
                      {!isEditing ? (
                        <span className="font-bold text-slate-800">{activeRecord.tender.technicalBidOpenDate}</span>
                      ) : (
                        <input
                          type="text"
                          value={activeRecord.tender.technicalBidOpenDate}
                          onChange={(e) => updateTenderField('technicalBidOpenDate', e.target.value)}
                          className="w-48 p-1 border border-slate-300 rounded text-xs bg-white text-right"
                        />
                      )}
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded flex justify-between items-center">
                      <span className="text-slate-500">Financial Bid Opening:</span>
                      {!isEditing ? (
                        <span className="font-bold text-slate-800">{activeRecord.tender.financialBidOpenDate}</span>
                      ) : (
                        <input
                          type="text"
                          value={activeRecord.tender.financialBidOpenDate}
                          onChange={(e) => updateTenderField('financialBidOpenDate', e.target.value)}
                          className="w-48 p-1 border border-slate-300 rounded text-xs bg-white text-right"
                        />
                      )}
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded flex justify-between items-center">
                      <span className="text-slate-500">e-Procurement Portal:</span>
                      {!isEditing ? (
                        <a
                          href={activeRecord.tender.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#1a73e8] hover:underline flex items-center gap-1"
                        >
                          <span>wbtenders.gov.in</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <input
                          type="text"
                          value={activeRecord.tender.portalUrl}
                          onChange={(e) => updateTenderField('portalUrl', e.target.value)}
                          className="w-48 p-1 border border-slate-300 rounded text-xs bg-white text-right font-mono"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Contractor Eligibility Criteria */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Contractor Eligibility & Qualification Criteria:
                    </h4>
                    {isEditing && (
                      <button
                        onClick={addEligibilityCriterion}
                        className="text-xs text-[#1a73e8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Criterion</span>
                      </button>
                    )}
                  </div>

                  {!isEditing ? (
                    <ul className="space-y-1.5 text-xs text-slate-700 bg-white p-3.5 rounded border border-slate-200 list-disc pl-5">
                      {activeRecord.tender.eligibilityCriteria.map((crit, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {crit}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="space-y-2 bg-white p-3.5 rounded border border-slate-200">
                      {activeRecord.tender.eligibilityCriteria.map((crit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={crit}
                            onChange={(e) => updateEligibilityCriterion(idx, e.target.value)}
                            className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white"
                          />
                          <button
                            onClick={() => removeEligibilityCriterion(idx)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            title="Delete criterion"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mandatory Documents Checklist */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Mandatory Bid Submission Documents:
                    </h4>
                    {isEditing && (
                      <button
                        onClick={addMandatoryDoc}
                        className="text-xs text-[#1a73e8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Document</span>
                      </button>
                    )}
                  </div>

                  {!isEditing ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {activeRecord.tender.mandatoryDocuments.map((doc, idx) => (
                        <div key={idx} className="p-2 bg-white rounded border border-slate-200 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#34a853] flex-shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2 bg-white p-3.5 rounded border border-slate-200">
                      {activeRecord.tender.mandatoryDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={doc}
                            onChange={(e) => updateMandatoryDoc(idx, e.target.value)}
                            className="flex-1 text-xs p-1.5 border border-slate-300 rounded bg-white"
                          />
                          <button
                            onClick={() => removeMandatoryDoc(idx)}
                            className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                            title="Delete document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          </>
          )}
        </div>
      )}
    </PageContainer>
  );
};
