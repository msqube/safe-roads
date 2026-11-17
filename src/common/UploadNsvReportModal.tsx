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
  const [isExtractingData, setIsExtractingData] = useState<boolean>(false);
  const [extractionComplete, setExtractionComplete] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const isUploaded = localStorage.getItem(`nsv_uploaded_${roadCode}`) === 'true';
      const savedName = localStorage.getItem(`nsv_pdf_name_${roadCode}`);
      if (isUploaded && savedName) {
        setUploadedPdfName(savedName);
        setExtractionComplete(true);
      } else if (isMar1111) {
        setUploadedPdfName('NSV_Report_NKDA_Road_MAR_1111_Reference_Style.pdf');
        setExtractionComplete(true);
      } else {
        setUploadedPdfName('');
        setExtractionComplete(false);
      }
      setUploadError(null);
      setIsExtractingData(false);
    }
  }, [isOpen, roadCode, isMar1111]);

  if (!isOpen) return null;

  const handleSimulateExtraction = (filename: string) => {
    setIsExtractingData(true);
    setExtractionComplete(false);
    setTimeout(() => {
      setIsExtractingData(false);
      setExtractionComplete(true);
      localStorage.setItem(`nsv_uploaded_${roadCode}`, 'true');
      localStorage.setItem(`nsv_pdf_name_${roadCode}`, filename);
      window.dispatchEvent(
        new CustomEvent('nsv-uploaded', { detail: { roadCode, filename } })
      );
      if (onUploadSuccess) {
        onUploadSuccess(filename);
      }
    }, 700);
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
      handleSimulateExtraction(file.name);
    }
  };

  const handleUseMar1111Pdf = () => {
    setUploadError(null);
    const fname = 'NSV_Report_NKDA_Road_MAR_1111_Reference_Style.pdf';
    setUploadedPdfName(fname);
    handleSimulateExtraction(fname);
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
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-300 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
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
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold rounded-lg transition cursor-pointer text-xs inline-flex items-center gap-1.5 shadow-2xs"
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

          {/* Extraction Progress Animation */}
          {isExtractingData && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-center">
              <div className="inline-block w-5 h-5 border-2 border-[#1a73e8] border-t-transparent rounded-full animate-spin"></div>
              <p className="font-bold text-blue-900 text-xs">Extracting NSV Sensors &amp; Pavement Telemetry...</p>
              <p className="text-[10px] text-blue-600 font-mono">
                Parsing Laser Profilometer readings • IRI 5.20 • 20mm Rutting
              </p>
            </div>
          )}

          {/* Extracted Parameter Cards */}
          {extractionComplete && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  Extracted Sensor Telemetry &amp; BoQ Specifications:
                </span>
                <span className="text-[10px] font-mono text-emerald-700 font-bold">
                  100% Client-Side Parsed
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
                  <span className="text-[10px] text-amber-700 block">Cold milling required</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">Verified Surface Potholes</span>
                  <span className="text-sm font-black font-mono text-red-600">4 Nos.</span>
                  <span className="text-[10px] text-slate-500 block">1.86 m² (20 sq ft) • 0.0372 m³</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-semibold">DPR Segment Sanction</span>
                  <span className="text-sm font-black font-mono text-emerald-700">₹28.20 Lakhs</span>
                  <span className="text-[10px] text-slate-500 block">120m Resurfacing + Patching</span>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-[11px] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Report verified! Pavement data is synced with NSV Details and DPR BoQ engine.</span>
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
              disabled={!extractionComplete}
              onClick={handleSaveAndClose}
              className={`px-3 py-2 border text-xs font-bold rounded-lg transition ${
                extractionComplete
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              }`}
            >
              Save &amp; Keep on Page
            </button>

            <button
              type="button"
              disabled={!extractionComplete}
              onClick={handleViewNsvDetails}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-xs ${
                extractionComplete
                  ? 'bg-[#1a73e8] hover:bg-[#1557b0] text-white cursor-pointer'
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
