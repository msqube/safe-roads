import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  Calendar,
  Layers,
  DollarSign,
  Clock,
  Sparkles,
  Edit3,
  Save,
  X,
  RotateCcw,
  Plus,
  Trash2,
} from 'lucide-react';
import { DPRRecord } from '../../../models/dprModels';

export interface DprMar1111Data {
  executiveSummary: {
    introText: string;
    part1Potholes: number;
    part1AvgDepthMm: number;
    part1AreaSqFt: number;
    part1RateFormula: string;
    part2LengthM: number;
    part2AvgDepthMm: number;
    part2RateFormula: string;
    totalAmountText: string;
    keyParameters: string;
  };
  backgroundNeed: {
    authorityText: string;
    surveyFindings: string;
  };
  projectObjectives: string[];
  scopeOfWork: {
    part1Text: string;
    part2Text: string;
    contractorItems: string[];
  };
  projectLocation: {
    location: string;
    gpsCoords: string;
    executingOffice: string;
    roadAndLength: string;
  };
  technicalApproach: {
    intro: string;
    surfacePrep: string;
    tackCoat: string;
    bituminousConcrete: string;
    qualityControl: string;
  };
  costEstimate: {
    estimatedCostTotal: string;
    part1Quantity: string;
    part2Quantity: string;
    securityDeposit: string;
    labourCess: string;
    costBasis: string;
  };
  implementationPlan: {
    contractPeriodText: string;
    stages: Array<{ stage: string; timeline: string }>;
  };
  paymentQaEhs: {
    paymentTerms: string;
    qualityAssurance: string;
    environmentSafety: string;
  };
  riskAssessment: Array<{ risk: string; likelihood: string; mitigation: string }>;
  conclusion: {
    summaryText: string;
  };
}

const DEFAULT_MAR1111_DATA: DprMar1111Data = {
  executiveSummary: {
    introText:
      'NKDA proposes to repair and resurface Road NKDA MAR 1111, New Town, Kolkata, using Bituminous Concrete (BC) surfacing. The work has two parts: (1) filling of potholes and (2) resurfacing with BC.',
    part1Potholes: 4,
    part1AvgDepthMm: 20,
    part1AreaSqFt: 20,
    part1RateFormula: '=potholes × avg depth × avg area × 10,000 RS',
    part2LengthM: 120,
    part2AvgDepthMm: 10,
    part2RateFormula: '=Length × avg depth of surfacing × width of road × 30,000 RS',
    totalAmountText: 'Rs. 28,20,000 (₹28.20 Lakhs)',
    keyParameters:
      'completion period 30 days, defect liability period 1 year from completion, security deposit 10% of each running bill, no mobilisation advance, no price escalation.',
  },
  backgroundNeed: {
    authorityText:
      'NKDA is a statutory authority under the Government of West Bengal responsible for development and maintenance of New Town, Kolkata. The road covered here is Road NKDA MAR 1111, which has four potholes with a total area of 20 sq ft that need filling before resurfacing. Resurfacing with strengthening is proposed to restore riding quality, structural capacity and drainage-shedding profile of the carriageway, and to extend pavement life.',
    surveyFindings:
      'Network Survey Vehicle (NSV) profilometry verified 4 potholes (PH-01 to PH-04) with void depth of 20mm and segment-average IRI of 5.20 m/km (classified in Very Poor band > 5.0 m/km), causing ride degradation and justifying immediate resurfacing before the monsoon.',
  },
  projectObjectives: [
    'Restore a smooth, durable wearing course on Road NKDA MAR 1111.',
    'Strengthen the pavement through an overlay (strengthening layer plus BC surfacing) so that it carries the design traffic for the design period.',
    'Improve road safety and ride comfort for residents, commuters and service vehicles.',
    'Reduce recurring maintenance cost through a one-year defect liability backed by security deposit.',
  ],
  scopeOfWork: {
    part1Text:
      'filling of 4 potholes on Road NKDA MAR 1111, with a total area of 20 sq ft (about 1.86 sq m) and an average depth of 20 mm, about 0.037 cu m of patching material in all.',
    part2Text:
      'resurfacing of Road NKDA MAR 1111 by strengthening with BC surfacing, length 120.00 meters (average depth 10 mm).',
    contractorItems: [
      'Site inspection and acquaintance with local conditions before bidding.',
      'Supply of all materials, labour, plant and machinery, and hot-mix production from an own running Batch Mix Plant within 10 km of the site.',
      'Laying, rolling and finishing of BC with temperature control of bitumen, aggregate and mix.',
      'Dust control, covered transport of materials and compliance with Construction & Demolition Waste Rules.',
      'Photographic record before, during and after execution, submitted with bills.',
      'Rectification of defects during the defect liability period at the contractor’s cost.',
      'The Authority may modify scope within the sanctioned amount (Clause 6.25).',
    ],
  },
  projectLocation: {
    location: 'New Town, Kolkata, West Bengal (Action Area I / ID)',
    gpsCoords: 'GPS: 22.58150°N, 88.47280°E to 22.58270°N, 88.47328°E',
    executingOffice: 'Plot DG/13, Premises 04-3333, Action Area ID, New Town, Kolkata – 700156',
    roadAndLength: 'Road NKDA MAR 1111 (Length: 120.00 m)',
  },
  technicalApproach: {
    intro:
      'Standard practice for flexible bituminous urban arterial pavement restoration under MoRTH Specifications for Road and Bridge Works, relevant IRC codes (IRC:37-2018, IRC:82), and MORD/SP 20/SP 72:',
    surfacePrep:
      'Patch repair of potholes and failed areas, removal of loose material, cleaning and drying of the surface.',
    tackCoat:
      'Uniform application of SS-1 bitumen emulsion on the prepared surface before the BC layer.',
    bituminousConcrete:
      'Hot-mix produced at an own running Batch Mix Plant within 10 km, transported covered, laid with sensor paver and compacted with tandem/pneumatic rollers.',
    qualityControl:
      'Tests on aggregates, bitumen, mix design (Marshall properties), field density, laboratory setup, and a site supervisor (Diploma with 3 yrs exp or Graduate with 1 yr exp).',
  },
  costEstimate: {
    estimatedCostTotal: 'Rs. 28,20,000 (₹28.20 Lakhs)',
    part1Quantity: '4 potholes, 20 sq ft, 20 mm avg depth',
    part2Quantity: 'Length 120.00 meters (Chainage 0+000 to 0+120)',
    securityDeposit: '10% deducted from all running bills',
    labourCess: '1% BOCW welfare cess deducted',
    costBasis:
      'rates are inclusive of all taxes including GST, duties, royalties, insurance, freight and other charges. No escalation is admissible. In case of ambiguity, the latest PWD Schedule of Rates governs.',
  },
  implementationPlan: {
    contractPeriodText:
      'Contract period: 30 days from work order. Work must start at site within 7 days of the work order (Clause 6.12), failing which the work order is cancelled.',
    stages: [
      {
        stage: 'Letter of Intent, formal agreement (WBF 2911(ii))',
        timeline: 'Within 15 days of LOI per 6.8; within 7 days of work order per 6.30',
      },
      {
        stage: 'Mobilisation, site office, work programme and bar chart',
        timeline: 'Immediately after work order; start within 7 days',
      },
      {
        stage: 'Surface preparation and patching (4 potholes)',
        timeline: 'Days 1–8 (indicative)',
      },
      {
        stage: 'Tack coat and BC laying, rolling (120m segment)',
        timeline: 'Days 8–26 (indicative)',
      },
      {
        stage: 'Finishing, markings, cleaning, photographs',
        timeline: 'Days 26–30',
      },
      {
        stage: 'Defect liability period',
        timeline: '1 year from completion',
      },
    ],
  },
  paymentQaEhs: {
    paymentTerms:
      'Running account (RA) bills after satisfactory completion. No mobilisation advance. 10% Security Deposit deducted from each bill. 1% labour cess. Firm price, no escalation.',
    qualityAssurance:
      'MoRTH/IRC specifications. Substandard work redone at contractor’s cost. Pre-, during- and post-work photographic documentation. 1-year Defect Liability Period.',
    environmentSafety:
      'Covered transport, dust suppression, C&D Waste Rules compliance, PPE for hot-mix handling, traffic diversions, signages, and night-time barricading.',
  },
  riskAssessment: [
    {
      risk: 'Rain or cold-weather interruption in laying',
      likelihood: 'Medium',
      mitigation: 'Dry-season scheduling; weather watch; stage work by section',
    },
    {
      risk: 'Insufficient plant or paving capacity for 30-day period',
      likelihood: 'Medium',
      mitigation: 'Confirm plant capacity, require work programme, two gangs',
    },
    {
      risk: 'Hot-mix transport time from plant exceeds temperature limit',
      likelihood: 'Low–Medium',
      mitigation: '10 km plant radius, insulated covered trucks, temperature checks',
    },
    {
      risk: 'Poor workmanship',
      likelihood: 'Medium',
      mitigation: 'Strict testing and supervision, security deposit',
    },
    {
      risk: 'Utility or drain/manhole level conflicts',
      likelihood: 'Medium',
      mitigation: 'Joint survey before start; adjust covers within scope',
    },
    {
      risk: 'Traffic and resident disruption',
      likelihood: 'Medium',
      mitigation: 'Phased closures, diversion plan, public notice',
    },
    {
      risk: 'Scope or quantity changes',
      likelihood: 'Low',
      mitigation: 'Revise estimate; scope change within sanctioned amount',
    },
    {
      risk: 'Defects after completion',
      likelihood: 'Medium',
      mitigation: '1-year DLP; 10% security deposit',
    },
  ],
  conclusion: {
    summaryText:
      'The project is a routine but time-critical package of pothole filling and BC resurfacing for Road NKDA MAR 1111 with an estimated cost of Rs. 28,20,000 (₹28.20 Lakhs), to be completed in 30 days. It is technically straightforward, with a 10% security deposit and a one-year defect liability as safeguards. The missing technical and survey details have been integrated from the certified NSV report (120m segment, 4 potholes, 20 sq ft / 1.86 sq m area, 20mm depth, 5.20 IRI). This DPR formally supports immediate release of Official Tender Document.',
  },
};

interface Mar1111DprDocumentViewProps {
  dpr: DPRRecord;
  onProceedToTender: () => void;
}

export const Mar1111DprDocumentView: React.FC<Mar1111DprDocumentViewProps> = ({
  dpr,
  onProceedToTender,
}) => {
  const storageKey = `dpr_data_${dpr.roadCode}`;

  const [data, setData] = useState<DprMar1111Data>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse saved DPR data:', e);
    }
    return DEFAULT_MAR1111_DATA;
  });

  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempData, setTempData] = useState<DprMar1111Data>(data);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setTempData(parsed);
      } else {
        setData(DEFAULT_MAR1111_DATA);
        setTempData(DEFAULT_MAR1111_DATA);
      }
    } catch (e) {
      setData(DEFAULT_MAR1111_DATA);
      setTempData(DEFAULT_MAR1111_DATA);
    }
  }, [dpr.roadCode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartEdit = (sectionId: string) => {
    setTempData(JSON.parse(JSON.stringify(data)));
    setEditingSection(sectionId);
  };

  const handleCancelEdit = () => {
    setTempData(data);
    setEditingSection(null);
  };

  const handleSaveSection = (sectionName: string) => {
    setData(tempData);
    localStorage.setItem(storageKey, JSON.stringify(tempData));
    setEditingSection(null);
    showToast(`"${sectionName}" updated and saved successfully.`);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all DPR sections to official MoRTH standard values?')) {
      setData(DEFAULT_MAR1111_DATA);
      setTempData(DEFAULT_MAR1111_DATA);
      localStorage.removeItem(storageKey);
      setEditingSection(null);
      showToast('All DPR sections reset to official standard values.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-[99999] px-4 py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Flow Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-xl shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
              STEP 1 OF 2: DETAILED PROJECT REPORT (DPR)
            </span>
            <span className="text-xs text-slate-300 font-mono">Road NKDA MAR 1111</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">
            Detailed Project Report: Pothole Filling &amp; Resurfacing with Bituminous Concrete
          </h2>
          <p className="text-xs text-slate-300">
            Generated from Official NSV Survey • 4 Potholes (1.86 m², 20mm depth) + 120m Resurfacing Segment • 30 Days Execution
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetToDefault}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
            title="Reset any customizations back to original MoRTH template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Template</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print DPR</span>
          </button>

          {/* Standardized Button Name: Proceed to Step 2: Tender Document */}
          <button
            onClick={onProceedToTender}
            className="px-4 py-2 bg-[#34a853] hover:bg-[#2d9247] text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer flex items-center gap-2 active:scale-98"
          >
            <span>Proceed to Step 2: Tender Document</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main DPR Document Body */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden text-xs text-slate-800 leading-relaxed">
        {/* Document Header Band */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 text-center space-y-2">
          <div className="text-xs uppercase tracking-widest font-bold text-slate-500">
            Government of West Bengal • Urban Development &amp; Municipal Affairs
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            DETAILED PROJECT REPORT (DPR)
          </h1>
          <div className="text-sm font-bold text-slate-800 max-w-2xl mx-auto">
            Pothole Filling and Resurfacing with Bituminous Concrete of Road NKDA MAR 1111, New Town, Kolkata
          </div>
          <div className="text-xs text-slate-600 font-medium">
            Executing Agency: <strong>New Town Kolkata Development Authority (NKDA)</strong>, Executive Engineer (Roads &amp; Building)
          </div>
          <div className="inline-block px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-md text-emerald-900 font-bold text-xs mt-1">
            Status: Approved DPR — Ready for Release of Official Tender Document
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* 1. EXECUTIVE SUMMARY */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1a73e8]" />
                <span>1. Executive Summary</span>
              </h3>
              {editingSection === 'sec1' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSaveSection('Executive Summary')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Section</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit('sec1')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit3 className="w-3 h-3 text-[#1a73e8]" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            {editingSection === 'sec1' ? (
              <div className="space-y-3 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Executive Summary Text:
                  </label>
                  <textarea
                    rows={2}
                    value={tempData.executiveSummary.introText}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        executiveSummary: {
                          ...tempData.executiveSummary,
                          introText: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">
                      Part 1 Potholes (Nos):
                    </label>
                    <input
                      type="number"
                      value={tempData.executiveSummary.part1Potholes}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          executiveSummary: {
                            ...tempData.executiveSummary,
                            part1Potholes: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">
                      Part 1 Avg Depth (mm):
                    </label>
                    <input
                      type="number"
                      value={tempData.executiveSummary.part1AvgDepthMm}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          executiveSummary: {
                            ...tempData.executiveSummary,
                            part1AvgDepthMm: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">
                      Part 2 Length (meters):
                    </label>
                    <input
                      type="number"
                      value={tempData.executiveSummary.part2LengthM}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          executiveSummary: {
                            ...tempData.executiveSummary,
                            part2LengthM: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600">
                      Total Package Cost:
                    </label>
                    <input
                      type="text"
                      value={tempData.executiveSummary.totalAmountText}
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          executiveSummary: {
                            ...tempData.executiveSummary,
                            totalAmountText: e.target.value,
                          },
                        })
                      }
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">
                    Key Parameters &amp; Clauses:
                  </label>
                  <input
                    type="text"
                    value={tempData.executiveSummary.keyParameters}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        executiveSummary: {
                          ...tempData.executiveSummary,
                          keyParameters: e.target.value,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            ) : (
              <>
                <p>{data.executiveSummary.introText}</p>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-[#1a73e8] text-white font-bold">
                      <tr>
                        <th className="p-2.5">Part</th>
                        <th className="p-2.5">Work</th>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Potholes (N)</th>
                        <th className="p-2.5">Length (m)</th>
                        <th className="p-2.5">Avg Depth (mm)</th>
                        <th className="p-2.5">Details</th>
                        <th className="p-2.5">Estimated Cost (Rs.)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">1</td>
                        <td className="p-2.5 font-semibold text-slate-800">Filling of potholes</td>
                        <td className="p-2.5">Filling</td>
                        <td className="p-2.5 font-bold text-red-600">
                          {data.executiveSummary.part1Potholes}
                        </td>
                        <td className="p-2.5 font-mono">0</td>
                        <td className="p-2.5 font-mono">{data.executiveSummary.part1AvgDepthMm}</td>
                        <td className="p-2.5 text-slate-700">
                          {data.executiveSummary.part1Potholes} potholes,{' '}
                          {data.executiveSummary.part1AreaSqFt} sq ft (about 1.86 sq m) in total,{' '}
                          {data.executiveSummary.part1AvgDepthMm} mm average depth
                        </td>
                        <td className="p-2.5 font-mono font-bold text-slate-900">
                          {data.executiveSummary.part1RateFormula}
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">2</td>
                        <td className="p-2.5 font-semibold text-slate-800">
                          Resurfacing with Bituminous Concrete
                        </td>
                        <td className="p-2.5">Surfacing</td>
                        <td className="p-2.5 font-mono">0</td>
                        <td className="p-2.5 font-bold font-mono text-[#1a73e8]">
                          {data.executiveSummary.part2LengthM} meters
                        </td>
                        <td className="p-2.5 font-mono">{data.executiveSummary.part2AvgDepthMm}</td>
                        <td className="p-2.5 text-slate-700">
                          Road length {data.executiveSummary.part2LengthM} meters (Chainage 0+000 to
                          0+120)
                        </td>
                        <td className="p-2.5 font-mono font-bold text-slate-900">
                          {data.executiveSummary.part2RateFormula}
                        </td>
                      </tr>
                      <tr className="bg-slate-100 font-bold text-slate-900">
                        <td className="p-2.5" colSpan={7}>
                          Total Combined Package (Indicative Estimated Amount Put to Tender)
                        </td>
                        <td className="p-2.5 font-mono text-[#137333] text-sm">
                          {data.executiveSummary.totalAmountText}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-950 font-medium">
                  <strong>Key parameters:</strong> {data.executiveSummary.keyParameters}
                </div>
              </>
            )}
          </div>

          {/* 2. BACKGROUND AND NEED */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Background and Need
              </h3>
              {editingSection === 'sec2' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSaveSection('Background and Need')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Section</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit('sec2')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit3 className="w-3 h-3 text-[#1a73e8]" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            {editingSection === 'sec2' ? (
              <div className="space-y-2 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Authority Background &amp; Need:
                  </label>
                  <textarea
                    rows={3}
                    value={tempData.backgroundNeed.authorityText}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        backgroundNeed: {
                          ...tempData.backgroundNeed,
                          authorityText: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    NSV Profilometry Survey Findings:
                  </label>
                  <textarea
                    rows={2}
                    value={tempData.backgroundNeed.surveyFindings}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        backgroundNeed: {
                          ...tempData.backgroundNeed,
                          surveyFindings: e.target.value,
                        },
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            ) : (
              <>
                <p>{data.backgroundNeed.authorityText}</p>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px]">
                  <strong>Survey Findings:</strong> {data.backgroundNeed.surveyFindings}
                </p>
              </>
            )}
          </div>

          {/* 3. PROJECT OBJECTIVES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Project Objectives
              </h3>
              {editingSection === 'sec3' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSaveSection('Project Objectives')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Section</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit('sec3')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit3 className="w-3 h-3 text-[#1a73e8]" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            {editingSection === 'sec3' ? (
              <div className="space-y-2 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                {tempData.projectObjectives.map((obj, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={obj}
                      onChange={(e) => {
                        const updated = [...tempData.projectObjectives];
                        updated[idx] = e.target.value;
                        setTempData({ ...tempData, projectObjectives: updated });
                      }}
                      className="flex-1 p-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                    <button
                      onClick={() => {
                        const updated = tempData.projectObjectives.filter((_, i) => i !== idx);
                        setTempData({ ...tempData, projectObjectives: updated });
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setTempData({
                      ...tempData,
                      projectObjectives: [...tempData.projectObjectives, 'New Project Objective'],
                    })
                  }
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-600 border border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Objective</span>
                </button>
              </div>
            ) : (
              <ul className="list-disc list-inside space-y-1 pl-1 text-slate-700">
                {data.projectObjectives.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>

          {/* 4. SCOPE OF WORK */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                4. Scope of Work
              </h3>
              {editingSection === 'sec4' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSaveSection('Scope of Work')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Section</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit('sec4')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit3 className="w-3 h-3 text-[#1a73e8]" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            {editingSection === 'sec4' ? (
              <div className="space-y-2 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">
                    Part 1 (Filling of potholes):
                  </label>
                  <input
                    type="text"
                    value={tempData.scopeOfWork.part1Text}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        scopeOfWork: { ...tempData.scopeOfWork, part1Text: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">
                    Part 2 (Resurfacing with BC):
                  </label>
                  <input
                    type="text"
                    value={tempData.scopeOfWork.part2Text}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        scopeOfWork: { ...tempData.scopeOfWork, part2Text: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            ) : (
              <>
                <p>
                  <strong>Part 1 – Filling of potholes:</strong> {data.scopeOfWork.part1Text}
                </p>
                <p>
                  <strong>Part 2 – Resurfacing with Bituminous Concrete:</strong>{' '}
                  {data.scopeOfWork.part2Text}
                </p>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-900 block">The contractor’s scope includes:</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                    {data.scopeOfWork.contractorItems.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>

          {/* 5. PROJECT LOCATION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                5. Project Location
              </h3>
              {editingSection === 'sec5' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSaveSection('Project Location')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Section</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit('sec5')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit3 className="w-3 h-3 text-[#1a73e8]" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            {editingSection === 'sec5' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Location:</label>
                  <input
                    type="text"
                    value={tempData.projectLocation.location}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        projectLocation: { ...tempData.projectLocation, location: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">GPS Coordinates:</label>
                  <input
                    type="text"
                    value={tempData.projectLocation.gpsCoords}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        projectLocation: { ...tempData.projectLocation, gpsCoords: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Executing Office:</label>
                  <input
                    type="text"
                    value={tempData.projectLocation.executingOffice}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        projectLocation: {
                          ...tempData.projectLocation,
                          executingOffice: e.target.value,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Road &amp; Length:</label>
                  <input
                    type="text"
                    value={tempData.projectLocation.roadAndLength}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        projectLocation: {
                          ...tempData.projectLocation,
                          roadAndLength: e.target.value,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 block">Location:</span>
                  <div>{data.projectLocation.location}</div>
                  <div className="text-slate-500 font-mono text-[10px]">
                    {data.projectLocation.gpsCoords}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-700 block">Executing Office:</span>
                  <div>{data.projectLocation.executingOffice}</div>
                  <div className="text-slate-500 text-[10px]">
                    {data.projectLocation.roadAndLength}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. TECHNICAL APPROACH */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                6. Technical Approach (Indicative)
              </h3>
              {editingSection === 'sec6' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSaveSection('Technical Approach')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Section</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit('sec6')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit3 className="w-3 h-3 text-[#1a73e8]" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            {editingSection === 'sec6' ? (
              <div className="space-y-2 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Surface Prep:</label>
                  <input
                    type="text"
                    value={tempData.technicalApproach.surfacePrep}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        technicalApproach: {
                          ...tempData.technicalApproach,
                          surfacePrep: e.target.value,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Tack Coat:</label>
                  <input
                    type="text"
                    value={tempData.technicalApproach.tackCoat}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        technicalApproach: {
                          ...tempData.technicalApproach,
                          tackCoat: e.target.value,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Bituminous Concrete:</label>
                  <input
                    type="text"
                    value={tempData.technicalApproach.bituminousConcrete}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        technicalApproach: {
                          ...tempData.technicalApproach,
                          bituminousConcrete: e.target.value,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            ) : (
              <>
                <p>{data.technicalApproach.intro}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <strong>Surface Preparation:</strong> {data.technicalApproach.surfacePrep}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <strong>Tack Coat:</strong> {data.technicalApproach.tackCoat}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <strong>Bituminous Concrete:</strong>{' '}
                    {data.technicalApproach.bituminousConcrete}
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <strong>Quality Control &amp; Site Resources:</strong>{' '}
                    {data.technicalApproach.qualityControl}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 7. COST ESTIMATE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>7. Cost Estimate &amp; Statutory Deductions</span>
              </h3>
              {editingSection === 'sec7' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSaveSection('Cost Estimate')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Section</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit('sec7')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit3 className="w-3 h-3 text-[#1a73e8]" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            {editingSection === 'sec7' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Total Sanction Cost:</label>
                  <input
                    type="text"
                    value={tempData.costEstimate.estimatedCostTotal}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        costEstimate: { ...tempData.costEstimate, estimatedCostTotal: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Security Deposit:</label>
                  <input
                    type="text"
                    value={tempData.costEstimate.securityDeposit}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        costEstimate: { ...tempData.costEstimate, securityDeposit: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Labour Welfare Cess:</label>
                  <input
                    type="text"
                    value={tempData.costEstimate.labourCess}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        costEstimate: { ...tempData.costEstimate, labourCess: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">Cost Basis Rules:</label>
                  <input
                    type="text"
                    value={tempData.costEstimate.costBasis}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        costEstimate: { ...tempData.costEstimate, costBasis: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-slate-800 text-white font-bold">
                      <tr>
                        <th className="p-2.5">Parameter</th>
                        <th className="p-2.5">Part 1: Pothole filling</th>
                        <th className="p-2.5">Part 2: BC resurfacing</th>
                        <th className="p-2.5">Combined Package</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Estimated Cost (Rs.)</td>
                        <td className="p-2.5 font-mono text-slate-800">Formula based</td>
                        <td className="p-2.5 font-mono text-slate-800">Formula based</td>
                        <td className="p-2.5 font-mono font-bold text-emerald-700">
                          {data.costEstimate.estimatedCostTotal}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">Quantity</td>
                        <td className="p-2.5 font-semibold text-red-600">
                          {data.costEstimate.part1Quantity}
                        </td>
                        <td className="p-2.5 font-semibold text-blue-700">
                          {data.costEstimate.part2Quantity}
                        </td>
                        <td className="p-2.5 text-slate-700">Entire 120m Corridor Package</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">
                          Security deposit (10% of each RA bill)
                        </td>
                        <td className="p-2.5 text-slate-600">as billed</td>
                        <td className="p-2.5 text-slate-600">as billed</td>
                        <td className="p-2.5 font-semibold text-slate-900">
                          {data.costEstimate.securityDeposit}
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-slate-900">
                          Labour cess (1% of contract amount)
                        </td>
                        <td className="p-2.5 text-slate-600">deducted</td>
                        <td className="p-2.5 text-slate-600">deducted</td>
                        <td className="p-2.5 font-semibold text-slate-900">
                          {data.costEstimate.labourCess}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-slate-600">
                  <strong>Cost basis:</strong> {data.costEstimate.costBasis}
                </p>
              </>
            )}
          </div>

          {/* 8. IMPLEMENTATION PLAN */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#1a73e8]" />
                <span>8. Implementation Plan (30 Days Completion)</span>
              </h3>
              {editingSection === 'sec8' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSaveSection('Implementation Plan')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Section</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit('sec8')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit3 className="w-3 h-3 text-[#1a73e8]" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            {editingSection === 'sec8' ? (
              <div className="space-y-2 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600">
                    Contract Period Header:
                  </label>
                  <input
                    type="text"
                    value={tempData.implementationPlan.contractPeriodText}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        implementationPlan: {
                          ...tempData.implementationPlan,
                          contractPeriodText: e.target.value,
                        },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div className="space-y-1.5 pt-1">
                  <label className="block text-[10px] font-semibold text-slate-600">Milestone Stages:</label>
                  {tempData.implementationPlan.stages.map((stg, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={stg.stage}
                        onChange={(e) => {
                          const updated = [...tempData.implementationPlan.stages];
                          updated[i].stage = e.target.value;
                          setTempData({
                            ...tempData,
                            implementationPlan: { ...tempData.implementationPlan, stages: updated },
                          });
                        }}
                        className="flex-1 p-1 border border-slate-300 rounded bg-white text-xs"
                      />
                      <input
                        type="text"
                        value={stg.timeline}
                        onChange={(e) => {
                          const updated = [...tempData.implementationPlan.stages];
                          updated[i].timeline = e.target.value;
                          setTempData({
                            ...tempData,
                            implementationPlan: { ...tempData.implementationPlan, stages: updated },
                          });
                        }}
                        className="w-1/3 p-1 border border-slate-300 rounded bg-white text-xs font-semibold text-blue-700"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <p>{data.implementationPlan.contractPeriodText}</p>
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead className="bg-[#1a73e8] text-white font-bold">
                      <tr>
                        <th className="p-2.5">Stage</th>
                        <th className="p-2.5">Timeline</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {data.implementationPlan.stages.map((stg, i) => (
                        <tr key={i} className={i === data.implementationPlan.stages.length - 1 ? 'bg-emerald-50 font-bold text-emerald-900' : ''}>
                          <td className="p-2.5 font-bold text-slate-900">{stg.stage}</td>
                          <td className="p-2.5 font-semibold text-blue-700">{stg.timeline}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* 9, 10, 11: PAYMENT, QA & EHS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                9, 10, 11. Payment, Quality Assurance &amp; Safety
              </h3>
              {editingSection === 'sec9' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSaveSection('Payment, QA & EHS')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Section</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit('sec9')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit3 className="w-3 h-3 text-[#1a73e8]" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            {editingSection === 'sec9' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">9. Payment Terms:</label>
                  <textarea
                    rows={3}
                    value={tempData.paymentQaEhs.paymentTerms}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        paymentQaEhs: { ...tempData.paymentQaEhs, paymentTerms: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">10. Quality Assurance:</label>
                  <textarea
                    rows={3}
                    value={tempData.paymentQaEhs.qualityAssurance}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        paymentQaEhs: { ...tempData.paymentQaEhs, qualityAssurance: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1">11. Environment &amp; Safety:</label>
                  <textarea
                    rows={3}
                    value={tempData.paymentQaEhs.environmentSafety}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        paymentQaEhs: { ...tempData.paymentQaEhs, environmentSafety: e.target.value },
                      })
                    }
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 uppercase">9. Payment &amp; Terms</h4>
                  <p className="text-slate-600">{data.paymentQaEhs.paymentTerms}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 uppercase">10. Quality Assurance</h4>
                  <p className="text-slate-600">{data.paymentQaEhs.qualityAssurance}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 uppercase">11. Environment &amp; Safety</h4>
                  <p className="text-slate-600">{data.paymentQaEhs.environmentSafety}</p>
                </div>
              </div>
            )}
          </div>

          {/* 12. RISK ASSESSMENT TABLE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                12. Risk Assessment
              </h3>
              {editingSection === 'sec12' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSaveSection('Risk Assessment')}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Section</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleStartEdit('sec12')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-300 hover:border-blue-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit3 className="w-3 h-3 text-[#1a73e8]" />
                  <span>Edit Section</span>
                </button>
              )}
            </div>

            {editingSection === 'sec12' ? (
              <div className="space-y-2 p-3 bg-blue-50/50 border border-blue-200 rounded-lg">
                {tempData.riskAssessment.map((r, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <input
                      type="text"
                      value={r.risk}
                      onChange={(e) => {
                        const updated = [...tempData.riskAssessment];
                        updated[i].risk = e.target.value;
                        setTempData({ ...tempData, riskAssessment: updated });
                      }}
                      className="col-span-5 p-1 border border-slate-300 rounded bg-white text-xs"
                      placeholder="Risk Description"
                    />
                    <select
                      value={r.likelihood}
                      onChange={(e) => {
                        const updated = [...tempData.riskAssessment];
                        updated[i].likelihood = e.target.value;
                        setTempData({ ...tempData, riskAssessment: updated });
                      }}
                      className="col-span-2 p-1 border border-slate-300 rounded bg-white text-xs"
                    >
                      <option value="Low">Low</option>
                      <option value="Low–Medium">Low–Medium</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <input
                      type="text"
                      value={r.mitigation}
                      onChange={(e) => {
                        const updated = [...tempData.riskAssessment];
                        updated[i].mitigation = e.target.value;
                        setTempData({ ...tempData, riskAssessment: updated });
                      }}
                      className="col-span-5 p-1 border border-slate-300 rounded bg-white text-xs"
                      placeholder="Mitigation Measure"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead className="bg-slate-800 text-white font-bold">
                    <tr>
                      <th className="p-2">Risk</th>
                      <th className="p-2">Likelihood</th>
                      <th className="p-2">Mitigation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {data.riskAssessment.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2 font-medium">{r.risk}</td>
                        <td
                          className={`p-2 font-semibold ${
                            r.likelihood === 'High'
                              ? 'text-red-600'
                              : r.likelihood === 'Medium'
                              ? 'text-amber-600'
                              : 'text-blue-600'
                          }`}
                        >
                          {r.likelihood}
                        </td>
                        <td className="p-2 text-slate-600">{r.mitigation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 15. CONCLUSION & SANCTION */}
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-xl space-y-2">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-1.5">
                <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#34a853]" />
                  <span>15. Conclusion &amp; Sanction for Tender Document Release</span>
                </h3>
                {editingSection === 'sec15' ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleSaveSection('Conclusion & Sanction')}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Section</span>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit('sec15')}
                    className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition"
                  >
                    <Edit3 className="w-3 h-3 text-emerald-700" />
                    <span>Edit Section</span>
                  </button>
                )}
              </div>

              {editingSection === 'sec15' ? (
                <div className="p-2 bg-white rounded border border-emerald-300">
                  <textarea
                    rows={4}
                    value={tempData.conclusion.summaryText}
                    onChange={(e) =>
                      setTempData({
                        ...tempData,
                        conclusion: { summaryText: e.target.value },
                      })
                    }
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              ) : (
                <p className="text-emerald-900 leading-relaxed">{data.conclusion.summaryText}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Action to Step 2: Tender Document */}
        <div className="p-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-bold text-slate-900 text-xs">
              Step 1 Complete: DPR Verified &amp; Sanctioned
            </div>
            <div className="text-[11px] text-slate-500">
              Proceed to review and release the official Tender Document for e-procurement publication.
            </div>
          </div>

          <button
            onClick={onProceedToTender}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#34a853] hover:bg-[#2d9247] text-white text-xs font-bold rounded-lg shadow-md transition cursor-pointer flex items-center justify-center gap-2 active:scale-98 whitespace-nowrap"
          >
            <span>Proceed to Step 2: Tender Document</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
