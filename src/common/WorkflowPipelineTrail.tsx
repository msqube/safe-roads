import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Video,
  FileText,
  FileSpreadsheet,
  Award,
  CheckCircle2,
  Lock,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface WorkflowPipelineTrailProps {
  currentStep: 1 | 2 | 3 | 4;
  roadCode?: string;
  roadName?: string;
  className?: string;
  compact?: boolean;
}

export const WorkflowPipelineTrail: React.FC<WorkflowPipelineTrailProps> = ({
  currentStep,
  roadCode = 'MAR-1111',
  roadName = 'Biswa Bangla Sarani',
  className = '',
  compact = false,
}) => {
  const navigate = useNavigate();

  const isNsvUploaded =
    localStorage.getItem(`nsv_uploaded_${roadCode}`) === 'true' ||
    roadCode === 'MAR-1111' ||
    roadCode.includes('1111');

  const steps = [
    {
      stepNumber: 1,
      title: 'Drone Aerial Survey',
      shortTitle: 'Drone Survey',
      desc: 'Photogrammetry & Potholes',
      statusLabel: currentStep > 1 ? 'Completed' : 'Current Step',
      icon: Video,
      route: `/?roadCode=${roadCode}`,
      isCompleted: currentStep > 1,
      isActive: currentStep === 1,
      isLocked: false,
    },
    {
      stepNumber: 2,
      title: 'NSV Report Extraction',
      shortTitle: 'NSV Report',
      desc: 'Laser Profilometer & IRI',
      statusLabel:
        currentStep > 2
          ? 'Completed'
          : currentStep === 2
            ? 'Current Step'
            : isNsvUploaded
              ? 'Ready'
              : 'Pending Upload',
      icon: FileText,
      route: `/nsv/${roadCode}`,
      isCompleted: currentStep > 2,
      isActive: currentStep === 2,
      isLocked: false,
    },
    {
      stepNumber: 3,
      title: 'DPR Document Generation',
      shortTitle: 'DPR Document',
      desc: 'MoRTH BoQ & Sections',
      statusLabel:
        currentStep > 3
          ? 'Completed'
          : currentStep === 3
            ? 'Current Step'
            : isNsvUploaded
              ? 'Next Step'
              : 'Locked (Requires NSV)',
      icon: FileSpreadsheet,
      route: `/dpr/${roadCode}`,
      isCompleted: currentStep > 3,
      isActive: currentStep === 3,
      isLocked: !isNsvUploaded,
    },
    {
      stepNumber: 4,
      title: 'Official Tender Release',
      shortTitle: 'Tender Document',
      desc: 'Tender Document & Sanction',
      statusLabel:
        currentStep === 4
          ? 'Current Step'
          : isNsvUploaded
            ? 'Final Stage'
            : 'Locked (Requires DPR)',
      icon: Award,
      route: `/dpr/${roadCode}?tab=tender`,
      isCompleted: false,
      isActive: currentStep === 4,
      isLocked: !isNsvUploaded,
    },
  ];

  // Dynamic Stepper Step Transition Loader State
  const [transitioningStep, setTransitioningStep] = useState<(typeof steps)[0] | null>(null);
  const [transitionStage, setTransitionStage] = useState<number>(1);

  const handleStepClick = (s: (typeof steps)[0]) => {
    if (s.isLocked || s.isActive) return;
    setTransitioningStep(s);
    setTransitionStage(1);
    setTimeout(() => setTransitionStage(2), 350);
    setTimeout(() => setTransitionStage(3), 750);
    setTimeout(() => {
      navigate(s.route);
      setTransitioningStep(null);
    }, 1150);
  };

  const currentStepObj = steps.find((s) => s.stepNumber === currentStep) || steps[0];

  const renderTransitionModal = () => {
    if (!transitioningStep) return null;
    return createPortal(
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
        <div className="bg-white text-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Opening Pipeline Stage: Step {transitioningStep.stepNumber}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Corridor: {roadCode} ({roadName})
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
              Phase {transitionStage} of 3
            </span>
          </div>

          {/* Dynamic Animated Status Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="text-xs font-bold text-slate-900">
                {transitioningStep.stepNumber === 1 && (
                  transitionStage === 1 ? 'Calibrating RTK Drone Flight Telemetry & Waypoints...' :
                    transitionStage === 2 ? 'Stitching 4K Aerial Photogrammetry Orthophoto Mosaic...' :
                      'Opening Real-World GIS Aerial Survey View...'
                )}
                {transitioningStep.stepNumber === 2 && (
                  transitionStage === 1 ? 'Verifying Certified NSV ROMDAS Mark-IV Vehicle Ingestion...' :
                    transitionStage === 2 ? 'Extracting Laser Profilometer IRI (5.20 m/km) & 20mm Rut Depth...' :
                      'Synchronizing Pavement Schematic & Defect Inventory...'
                )}
                {transitioningStep.stepNumber === 3 && (
                  transitionStage === 1 ? 'Executing MoRTH Section 501 Schedule of Rates Formulations...' :
                    transitionStage === 2 ? 'Calculating Statutory BoQ: Patching (₹3.72L) + Resurfacing (₹24.48L)...' :
                      'Compiling Certified 15-Section Detailed Project Report (DPR)...'
                )}
                {transitioningStep.stepNumber === 4 && (
                  transitionStage === 1 ? 'Verifying Administrative Sanctions & 2% Earnest Money Deposit...' :
                    transitionStage === 2 ? 'Formulating Two-Bid e-NIT Tender Notice Package...' :
                      'Transmitting Official Package for wbtenders.gov.in e-Procurement Portal...'
                )}
              </span>
            </div>
            <p className="text-xs text-slate-600 pl-7 leading-relaxed">
              {transitioningStep.desc} • West Bengal PWD &amp; NKDA Urban Infrastructure Standards.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-slate-500">
              <span>Pipeline Stage Transition</span>
              <span className="text-blue-600 font-bold">
                {transitionStage === 1 ? '33%' : transitionStage === 2 ? '66%' : '100%'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
              <div
                className="bg-[#1a73e8] h-full transition-all duration-300 rounded-full shadow-sm"
                style={{ width: `${(transitionStage / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>,
      document.body
    );
  };

  if (compact) {
    return (
      <div
        className={`w-full max-w-full min-w-0 bg-white border border-slate-200 rounded-xl p-4 shadow-sm font-sans flex items-center justify-between gap-3 text-xs no-scrollbar ${className}`}
      >
        {/* Left Side: Step Badge & Title */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1a73e8] text-[11px] font-bold tabular-nums">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8] animate-pulse" />
            <span>STEP {currentStep}/4</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="font-bold text-slate-800 text-xs hidden sm:inline">
            {currentStepObj.title}
          </span>
        </div>

        {/* Right Side: 4 Compact Stepper Pills + Corridor Info pushed towards the right */}
        <div className="flex items-center gap-2.5 ml-auto min-w-0">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar min-w-0">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const canClick = !s.isLocked && !s.isActive;
              const isLast = idx === steps.length - 1;

              return (
                <React.Fragment key={s.stepNumber}>
                  <button
                    type="button"
                    onClick={() => handleStepClick(s)}
                    disabled={s.isLocked || s.isActive}
                    className={`h-8 px-3 rounded-lg transition inline-flex items-center gap-1.5 text-xs whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${s.isActive
                      ? 'bg-[#1a73e8] text-white font-bold shadow-sm'
                      : s.isCompleted
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer font-medium'
                        : s.isLocked
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 cursor-pointer'
                      }`}
                    title={s.isLocked ? s.statusLabel : `Jump to ${s.title}`}
                  >
                    {s.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    ) : s.isLocked ? (
                      <Lock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    ) : (
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                    <span>
                      {s.stepNumber}. {s.shortTitle}
                    </span>
                  </button>
                  {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>

          <span className="text-xs font-mono text-slate-500 hidden md:inline border-l border-slate-200 pl-2.5">
            Corridor: <strong className="text-slate-800">{roadCode}</strong>
          </span>
        </div>
        {renderTransitionModal()}
      </div>
    );
  }

  return (
    <div
      className={`w-full max-w-full min-w-0 bg-white border border-slate-200 rounded-xl p-4 shadow-sm font-sans space-y-4 ${className}`}
    >
      {/* Header Info Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#1a73e8] text-[11px] font-bold tabular-nums">
            <span className="w-2 h-2 rounded-full bg-[#1a73e8] animate-pulse" />
            <span>WORKFLOW PIPELINE TRAIL</span>
          </div>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-semibold text-slate-700">
            Current Stage:{' '}
            <strong className="text-slate-900 font-bold">
              Step {currentStep}: {currentStepObj.title}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 text-xs">Asset Corridor:</span>
          <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-100 text-slate-800 border border-slate-200">
            {roadCode}
          </span>
          <span className="text-slate-400 text-xs hidden sm:inline">({roadName})</span>
        </div>
      </div>

      {/* 4-Step Interactive Breadcrumb Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isLast = idx === steps.length - 1;
          const canClick = !s.isLocked && !s.isActive;

          return (
            <div
              key={s.stepNumber}
              onClick={() => canClick && handleStepClick(s)}
              className={`p-4 rounded-xl border transition relative flex items-start gap-3 ${s.isActive
                ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-100 shadow-sm'
                : s.isCompleted
                  ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 cursor-pointer shadow-sm'
                  : s.isLocked
                    ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                    : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer hover:shadow-sm'
                }`}
            >
              {/* Step Icon Badge */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition ${s.isActive
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : s.isCompleted
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : s.isLocked
                      ? 'bg-slate-200 text-slate-400'
                      : 'bg-slate-100 text-slate-600'
                  }`}
              >
                {s.isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : s.isLocked ? (
                  <Lock className="w-4 h-4 text-slate-400" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Step Text Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider ${s.isActive
                      ? 'text-blue-700'
                      : s.isCompleted
                        ? 'text-emerald-700'
                        : 'text-slate-400'
                      }`}
                  >
                    Step {s.stepNumber}
                  </span>
                  {s.isActive && (
                    <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[9px] font-bold uppercase tracking-tight animate-pulse">
                      Active
                    </span>
                  )}
                  {s.isCompleted && (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      ✓ Done
                    </span>
                  )}
                </div>

                <div
                  className={`text-xs font-bold truncate leading-snug mt-0.5 ${s.isActive
                    ? 'text-blue-900'
                    : s.isCompleted
                      ? 'text-slate-900'
                      : s.isLocked
                        ? 'text-slate-400'
                        : 'text-slate-700'
                    }`}
                >
                  {s.title}
                </div>

                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {s.desc}
                </div>
              </div>

              {/* Connector Chevron between steps (desktop) */}
              {!isLast && (
                <div className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none">
                  <ChevronRight className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {renderTransitionModal()}
    </div>
  );
};
