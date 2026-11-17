import React, { useState } from 'react';
import { GenericModal } from '../../common/GenericModal';
import { SnapTakingMap } from '../../common/SnapTakingMap';
import { DroneSurveyRecord } from '../../models/surveyModels';
import { MapPin, Eye, Video, Upload, CheckCircle2, FileUp, X, Sparkles, FileText, ArrowRight, Map as MapIcon } from 'lucide-react';
import { GenericButton } from '../../common/GenericButton';
import { DroneVideoPlayer } from '../Dashboard/components/DroneVideoPlayer';
import { getCorridorPotholes } from '../../services/newTownGisData';

interface Gps360ModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DroneSurveyRecord | null;
  onViewNSV: (roadCode: string) => void;
  onViewDPR?: (roadCode: string) => void;
}

export const Gps360Modal: React.FC<Gps360ModalProps> = ({
  isOpen,
  onClose,
  record,
  onViewNSV,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'video' | 'map'>('video');
  const [isNsvUploaded, setIsNsvUploaded] = useState<boolean>(() => {
    if (!record) return false;
    return localStorage.getItem(`nsv_uploaded_${record.roadCode}`) === 'true';
  });
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('NSV_Report_NKDA_Road_MAR_1111_Reference_Style.pdf');
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Sync upload state when record changes
  React.useEffect(() => {
    if (record) {
      setIsNsvUploaded(localStorage.getItem(`nsv_uploaded_${record.roadCode}`) === 'true');
      setUploadSuccess(false);
    }
  }, [record]);

  if (!record) return null;

  const handleProcessUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      localStorage.setItem(`nsv_uploaded_${record.roadCode}`, 'true');
      localStorage.setItem(`nsv_pdf_name_${record.roadCode}`, uploadedFileName);
      setIsNsvUploaded(true);
      setIsUploading(false);
      setUploadSuccess(true);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(false);
      }, 900);
    }, 800);
  };

  const isMar1111 = record.roadCode === 'MAR-1111' || record.roadCode.includes('1111');
  const gpsLat = isMar1111 ? 22.58210 : record.gpsLatitude;
  const gpsLng = isMar1111 ? 88.47305 : record.gpsLongitude;
  const rutDepth = isMar1111 ? 20 : record.depthOfRut;
  const potholeCount = isMar1111 ? 4 : record.potholeCount;
  const roughCost = isMar1111 ? 2820000 : record.roughCostINR;

  // Mock snap points around the clicked GPS coordinate
  const snapPoints = [
    {
      id: 'SNP-01',
      snapNumber: 1,
      chainage: isMar1111 ? 'Km 0+018 (Lane 1)' : record.chainage,
      gps: { lat: gpsLat, lng: gpsLng },
      timestamp: '09:45:12',
      droneAltitudeMeters: 32.4,
      droneSpeedKmh: 14.2,
      cameraPitchDegrees: -90,
      thumbnailUrl: record.dronePhotoThumb,
      defectsDetected: potholeCount,
      surfaceCondition: record.condition,
    },
    {
      id: 'SNP-02',
      snapNumber: 2,
      chainage: isMar1111 ? 'Km 0+082 (Lane 1)' : `${record.chainage} + 150m`,
      gps: { lat: gpsLat + 0.0003, lng: gpsLng + 0.0002 },
      timestamp: '09:45:38',
      droneAltitudeMeters: 32.1,
      droneSpeedKmh: 14.5,
      cameraPitchDegrees: -45,
      thumbnailUrl: record.dronePhoto2Thumb,
      defectsDetected: 1,
      surfaceCondition: 'Fair',
    },
  ];

  const hotspots = [
    {
      id: 'H-GPS-1',
      pitch: -18,
      yaw: 12,
      label: `Pothole: ${rutDepth}mm Depth`,
      type: 'pothole' as const,
      severity: 'critical' as const,
      description: `GPS: ${gpsLat.toFixed(5)}°N, ${gpsLng.toFixed(5)}°E | Area: ${isMar1111 ? '1.86' : record.areaOfBadness}m²`,
    },
    {
      id: 'H-GPS-2',
      pitch: -26,
      yaw: -28,
      label: 'Alligator Cracking Web',
      type: 'crack' as const,
      severity: 'warning' as const,
      description: 'Bitumen surface fatigue cracking near wheelpath.',
    },
  ];

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={`Drone Inspection & Flight Telemetry: ${record.roadCode}`}
      subtitle={`${record.roadName} • ${record.location}`}
      maxWidth="4xl"
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {gpsLat.toFixed(5)}° N, {gpsLng.toFixed(5)}° E
            </span>
            <span className="text-slate-300">•</span>
            <span>{record.actionArea}</span>
          </div>

          <div className="flex items-center gap-2">
            {!isNsvUploaded ? (
              <GenericButton
                variant="primary"
                size="sm"
                leftIcon={<Upload className="w-3.5 h-3.5" />}
                onClick={() => setShowUploadModal(true)}
              >
                Upload NSV Report
              </GenericButton>
            ) : (
              <GenericButton
                variant="primary"
                size="sm"
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => onViewNSV(record.roadCode)}
              >
                View NSV Details
              </GenericButton>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Header telemetry pill banner */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-500">Condition:</span>
              <span
                className={`ml-1.5 font-semibold px-2 py-0.5 rounded text-[11px] ${
                  record.condition === 'Critical'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : record.condition === 'Poor'
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {record.condition} ({record.goodnessScore}/100)
              </span>
            </div>

            <div>
              <span className="text-slate-500">Rut Depth:</span>
              <span className="ml-1.5 font-bold text-slate-900">{rutDepth} mm</span>
            </div>

            <div>
              <span className="text-slate-500">Potholes:</span>
              <span className="ml-1.5 font-bold text-red-600">{potholeCount} Detected</span>
            </div>

            <div>
              <span className="text-slate-500">Est. Repair Cost:</span>
              <span className="ml-1.5 font-bold text-emerald-700">₹{roughCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center bg-white p-0.5 rounded border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveSubTab('video')}
              className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                activeSubTab === 'video'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Drone Video Feed</span>
            </button>
            <button
              onClick={() => setActiveSubTab('map')}
              className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${
                activeSubTab === 'map'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Flight Snap Map</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeSubTab === 'video' && (
          <div className="space-y-2">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Aerial Drone Photogrammetry Survey Recording:</span>
              <span className="text-[11px] font-mono text-slate-500">
                Corridor: {record.roadCode} • 4 Verified Potholes (20mm depth)
              </span>
            </div>
            <DroneVideoPlayer
              roadCode={record.roadCode}
              roadName={record.roadName}
              potholeCount={potholeCount}
              potholes={getCorridorPotholes(record.roadCode)}
              roadType={record.roadType}
              gpsLat={gpsLat}
              gpsLng={gpsLng}
            />
          </div>
        )}

        {activeSubTab === 'map' && (
          <div>
            <div className="text-xs text-slate-500 mb-1.5">
              Drone Flight Snap-Taking Route Map across {record.location}:
            </div>
            <SnapTakingMap
              roadCode={record.roadCode}
              roadName={record.roadName}
              centerGps={{ lat: gpsLat, lng: gpsLng }}
              snapPoints={snapPoints}
            />
          </div>
        )}

        {/* Embedded Upload NSV Report Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <FileUp className="w-5 h-5 text-[#1a73e8]" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Upload Certified NSV Report for {record.roadCode}
                  </h3>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Upload the official Network Survey Vehicle (NSV) survey document (PDF or Word format). The system will automatically parse the Laser Profilometer telemetry, IRI roughness, 4 verified potholes, and MoRTH repair calculations.
              </p>

              {/* Upload Drop Zone */}
              <div
                onClick={handleProcessUpload}
                className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center bg-slate-50 space-y-2 hover:bg-slate-100 hover:border-blue-400 transition cursor-pointer"
              >
                <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                <div className="text-xs font-semibold text-slate-700">
                  Drag and drop NSV PDF report or data logs here, or click to browse
                </div>
                <div className="text-[11px] text-slate-400">
                  Supports: Official NSV PDF Report (14 Pages), Word DOCX, ROMDAS Telemetry Log
                </div>
              </div>

              {/* Fast 1-Click Load Reference MAR-1111 Report */}
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-900 flex items-center justify-between gap-3">
                <div>
                  <span className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Reference NSV Report Ready:
                  </span>
                  <p className="text-[11px] text-blue-800">
                    Load certified 14-Page NSV Survey Report for {record.roadCode} (120m Resurfacing, 4 Potholes, IRI 5.20).
                  </p>
                </div>
                <button
                  disabled={isUploading}
                  onClick={handleProcessUpload}
                  className="px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-lg text-xs transition cursor-pointer flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                >
                  {isUploading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5" />
                      <span>Ingest Report</span>
                    </>
                  )}
                </button>
              </div>

              {/* Success Feedback */}
              {uploadSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>NSV Report parsed successfully! Unlocking full NSV details...</span>
                </div>
              )}

              {/* Footer */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GenericModal>
  );
};
