import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileUp,
  FileCheck,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
  Eye,
} from 'lucide-react';

interface UploadNsvReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadCode: string;
  roadName?: string;
  onUploadSuccess?: (filename: string) => void;
}

export const UploadNsvReportModal: React.FC<UploadNsvReportModalProps> = ({
  isOpen,
  onClose,
  roadCode,
  roadName,
  onUploadSuccess,
}) => {
  const navigate = useNavigate();
  const isMar1111 = roadCode === 'MAR-1111' || roadCode.includes('1111');

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedPdfName, setUploadedPdfName] = useState<string>('');
  const [detectedPageCount, setDetectedPageCount] = useState<number>(15);
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'analyzing' | 'complete'>('idle');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [analyzingStep, setAnalyzingStep] = useState<number>(0);
  const [extractionComplete, setExtractionComplete] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const isUploaded = localStorage.getItem(`nsv_uploaded_${roadCode}`) === 'true';
      const savedName = localStorage.getItem(`nsv_pdf_name_${roadCode}`);
      const savedPages = Number(localStorage.getItem(`nsv_pdf_pages_${roadCode}`)) || 15;
      setDetectedPageCount(savedPages);
      if (isUploaded && savedName) {
        setUploadedPdfName(savedName);
        setExtractionComplete(true);
        setUploadStage('complete');
      } else if (isMar1111) {
        setUploadedPdfName('nsv_mar_1111_official_report.pdf');
        setExtractionComplete(true);
        setUploadStage('complete');
      } else {
        setUploadedPdfName('');
        setExtractionComplete(false);
        setUploadStage('idle');
      }
      setUploadError(null);
      setUploadProgress(0);
      setAnalyzingStep(0);
    }
  }, [isOpen, roadCode, isMar1111]);

  if (!isOpen) return null;

  const handleSimulateExtraction = (filename: string, pageCount: number = 15) => {
    setDetectedPageCount(pageCount);
    setExtractionComplete(false);
    setUploadStage('uploading');
    setUploadProgress(15);
    setAnalyzingStep(0);

    // Stage 1: Uploading progress
    const t1 = setTimeout(() => setUploadProgress(48), 280);
    const t2 = setTimeout(() => setUploadProgress(82), 600);
    const t3 = setTimeout(() => setUploadProgress(100), 900);

    // Stage 2: Analyzing Extracted Results
    const t4 = setTimeout(() => {
      setUploadStage('analyzing');
      setAnalyzingStep(1);
    }, 1100);

    const t5 = setTimeout(() => setAnalyzingStep(2), 1550);
    const t6 = setTimeout(() => setAnalyzingStep(3), 1950);
    const t7 = setTimeout(() => setAnalyzingStep(4), 2400);

    // Stage 3: Complete & verified
    const t8 = setTimeout(() => {
      setUploadStage('complete');
      setExtractionComplete(true);
      localStorage.setItem(`nsv_uploaded_${roadCode}`, 'true');
      localStorage.setItem(`nsv_pdf_name_${roadCode}`, filename);
      localStorage.setItem(`nsv_pdf_pages_${roadCode}`, String(pageCount));
      window.dispatchEvent(
        new CustomEvent('nsv-uploaded', { detail: { roadCode, filename, pageCount } })
      );
      if (onUploadSuccess) {
        onUploadSuccess(filename);
      }
    }, 2800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
      clearTimeout(t8);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError(
          `File "${file.name}" exceeds the 2 MB limit (${(
            file.size /
            (1024 * 1024)
          ).toFixed(1)} MB). Please select a file under 2 MB.`
        );
        return;
      }
      setUploadError(null);
      setUploadedPdfName(file.name);
      // Estimate dynamic page count from file size (e.g. 8-18 pages) or detect from content
      const estimatedPages = Math.max(6, Math.min(24, Math.round(file.size / 75000) || 12));
      handleSimulateExtraction(file.name, estimatedPages);
    }
  };

  const handleUseMar1111Pdf = () => {
    setUploadError(null);
    const fname = 'nsv_mar_1111_official_report.pdf';
    setUploadedPdfName(fname);
    handleSimulateExtraction(fname, 15);
  };

  const handleSaveAndClose = () => {
    localStorage.setItem(`nsv_uploaded_${roadCode}`, 'true');
    localStorage.setItem(`nsv_pdf_name_${roadCode}`, uploadedPdfName);
    window.dispatchEvent(
      new CustomEvent('nsv-uploaded', { detail: { roadCode, filename: uploadedPdfName } })
    );
    if (onUploadSuccess) onUploadSuccess(uploadedPdfName);
    onClose();
  };

  const handleViewNsvDetails = () => {
    handleSaveAndClose();
    navigate(`/nsv/${roadCode}`);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-300 shadow-2xl overflow-hidden transition-all duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
              <Upload className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Upload Network Survey Vehicle (NSV) Report</h4>
              <p className="text-[11px] text-blue-200">
                Corridor: <span className="font-mono font-bold text-white">{roadCode}</span>{' '}
                {roadName ? `(${roadName})` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* File Upload Zone */}
          <div className="border-2 border-dashed border-blue-200 rounded-xl p-5 text-center bg-blue-50/40 hover:bg-blue-50/70 transition space-y-2.5">
            <FileUp className="w-9 h-9 text-[#1a73e8] mx-auto" />
            <div>
              <p className="font-bold text-slate-900 text-xs">
                Choose NSV Survey Report (.pdf or .docx)
              </p>
              <p className="text-[11px] text-slate-500">
                Accepted formats: PDF or DOCX (Max 2 MB)
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              <label className="px-3.5 py-2 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-lg transition cursor-pointer text-xs inline-flex items-center gap-1.5 shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Browse Files</span>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {isMar1111 && (
                <button
                  type="button"
                  onClick={handleUseMar1111Pdf}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-lg transition cursor-pointer text-xs inline-flex items-center gap-1.5 shadow-sm"
                >
                  <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Use MAR-1111 Report PDF</span>
                </button>
              )}
            </div>

            {uploadError && (
              <div className="p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Selected / Current File Status */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <FileText className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <span className="font-mono text-slate-800 font-semibold truncate text-[11px]">
                {uploadedPdfName || 'No NSV report uploaded yet'}
              </span>
            </div>
            {extractionComplete && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Extracted</span>
              </span>
            )}
          </div>

          {/* Stage 1: Uploading Report Progress Bar */}
          {uploadStage === 'uploading' && (
            <div className="p-4 bg-blue-50/90 border border-blue-200 rounded-xl space-y-2.5 transition-all duration-200 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin" />
                  <span className="font-bold text-blue-950 text-xs">
                    Uploading Report Document ({uploadedPdfName})...
                  </span>
                </div>
                <span className="font-mono font-bold text-xs text-[#1a73e8]">
                  {uploadProgress}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-[#1a73e8] transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <div className="text-[10px] text-blue-700 flex items-center justify-between font-mono">
                <span>Validating checksum &amp; PDF MIME headers...</span>
                <span>Transferring to Laser Profilometer parser</span>
              </div>
            </div>
          )}

          {/* Stage 2: Analyzing Extracted Results from PDF */}
          {uploadStage === 'analyzing' && (
            <div className="p-4 bg-gradient-to-br from-indigo-50/90 to-blue-50/90 border border-indigo-200 rounded-xl space-y-3 transition-all duration-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
                  <span className="font-bold text-indigo-950 text-xs">
                    Analyzing Results &amp; Parsing Telemetry...
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-bold">
                  Telemetry Engine Active
                </span>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="flex items-center gap-2 transition-all">
                  {analyzingStep >= 1 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  )}
                  <span className={analyzingStep >= 1 ? 'text-slate-800 font-medium' : 'text-indigo-950 font-bold'}>
                    1. Reading {detectedPageCount}-page PDF document tables &amp; corridor metadata...
                  </span>
                </div>

                <div className="flex items-center gap-2 transition-all">
                  {analyzingStep >= 2 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : analyzingStep === 1 ? (
                    <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" />
                  )}
                  <span className={analyzingStep >= 2 ? 'text-slate-800 font-medium' : analyzingStep === 1 ? 'text-indigo-950 font-bold' : 'text-slate-400'}>
                    2. Parsing Laser Profilometer readings • Computing IRI (5.20 m/km)...
                  </span>
                </div>

                <div className="flex items-center gap-2 transition-all">
                  {analyzingStep >= 3 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : analyzingStep === 2 ? (
                    <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" />
                  )}
                  <span className={analyzingStep >= 3 ? 'text-slate-800 font-medium' : analyzingStep === 2 ? 'text-indigo-950 font-bold' : 'text-slate-400'}>
                    3. Cross-referencing 4 verified potholes &amp; 0.0372 m³ void volume...
                  </span>
                </div>

                <div className="flex items-center gap-2 transition-all">
                  {analyzingStep >= 4 ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  ) : analyzingStep === 3 ? (
                    <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0" />
                  )}
                  <span className={analyzingStep >= 4 ? 'text-slate-800 font-medium' : analyzingStep === 3 ? 'text-indigo-950 font-bold' : 'text-slate-400'}>
                    4. Synthesizing MoRTH pavement layer structure &amp; defect inventory...
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Extracted Parameter Cards */}
          {extractionComplete && uploadStage !== 'uploading' && uploadStage !== 'analyzing' && (
            <div className="space-y-3 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Extracted Sensor Telemetry &amp; Pavement Baseline:
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Parsed from {uploadedPdfName}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">Roughness Index (IRI)</span>
                  <span className="text-sm font-black font-mono text-red-600">5.20 m/km</span>
                  <span className="text-[10px] text-red-700 block">Severe / Very Poor band</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">Transverse Rut Depth</span>
                  <span className="text-sm font-black font-mono text-amber-600">20 mm</span>
                  <span className="text-[10px] text-amber-700 block">Outer Wheelpath (Lane 1)</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">Verified Surface Potholes</span>
                  <span className="text-sm font-black font-mono text-red-600">4 Nos.</span>
                  <span className="text-[10px] text-slate-500 block">1.86 m² (20 sq ft) • 0.0372 m³</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">Identified Resurfacing Scope</span>
                  <span className="text-sm font-black font-mono text-blue-700">120 Meters</span>
                  <span className="text-[10px] text-slate-500 block">Km 0+000 to 0+120 Segment</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Report parsed &amp; verified! Pavement baseline ready for engineering inspection.</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-700 font-bold whitespace-nowrap">
                  Ready to View
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!extractionComplete || uploadStage === 'uploading' || uploadStage === 'analyzing'}
              onClick={handleSaveAndClose}
              className={`px-3 py-2 border text-xs font-bold rounded-lg transition ${
                extractionComplete && uploadStage !== 'uploading' && uploadStage !== 'analyzing'
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
            >
              Save &amp; Keep on Page
            </button>

            <button
              type="button"
              disabled={!extractionComplete || uploadStage === 'uploading' || uploadStage === 'analyzing'}
              onClick={handleViewNsvDetails}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md ${
                extractionComplete && uploadStage !== 'uploading' && uploadStage !== 'analyzing'
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white ring-4 ring-blue-300 shadow-xl shadow-blue-500/40 cursor-pointer animate-pulse'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>View NSV Details →</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
