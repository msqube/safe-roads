import React, { useState } from 'react';
import { GenericModal } from '../../common/GenericModal';
import { SnapTakingMap } from '../../common/SnapTakingMap';
import { DroneSurveyRecord } from '../../models/surveyModels';
import { MapPin, Eye, Video, Upload, CheckCircle2, FileUp, X, Sparkles, FileText, ArrowRight, Map as MapIcon } from 'lucide-react';
import { GenericButton } from '../../common/GenericButton';
import { DroneVideoPlayer } from '../Dashboard/components/DroneVideoPlayer';
import { getCorridorPotholes } from '../../services/newTownGisData';
import { UploadNsvReportModal } from '../../common/UploadNsvReportModal';

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

  // Sync upload state when record changes
  React.useEffect(() => {
    if (record) {
      setIsNsvUploaded(localStorage.getItem(`nsv_uploaded_${record.roadCode}`) === 'true');
    }
  }, [record]);

  if (!record) return null;

  const isMar1111 = record.roadCode === 'MAR-1111' || record.roadCode.includes('1111');
  const gpsLat = isMar1111 ? 22.58210 : record.gpsLatitude;
  const gpsLng = isMar1111 ? 88.47305 : record.gpsLongitude;
  const rutDepth = isMar1111 ? 20 : record.depthOfRut;
  const potholeCount = isMar1111 ? 4 : record.potholeCount;
  const roughCost = isMar1111 ? 2820000 : record.roughCostINR;

  // Snap points across the corridor (all 4 verified potholes for MAR-1111)
  const snapPoints = isMar1111
    ? [
        {
          id: 'SNP-01',
          snapNumber: 1,
          chainage: 'Km 0+018 (Lane 1)',
          gps: { lat: 22.58168, lng: 88.47288 },
          timestamp: '09:45:12',
          droneAltitudeMeters: 32.4,
          droneSpeedKmh: 14.2,
          cameraPitchDegrees: -90,
          thumbnailUrl: '/images/pothole_1.jpg',
          defectsDetected: 1,
          surfaceCondition: 'Critical' as const,
        },
        {
          id: 'SNP-02',
          snapNumber: 2,
          chainage: 'Km 0+045 (Lane 1)',
          gps: { lat: 22.58195, lng: 88.47298 },
          timestamp: '09:45:25',
          droneAltitudeMeters: 31.8,
          droneSpeedKmh: 13.9,
          cameraPitchDegrees: -45,
          thumbnailUrl: '/images/pothole_2.jpg',
          defectsDetected: 1,
          surfaceCondition: 'Critical' as const,
        },
        {
          id: 'SNP-03',
          snapNumber: 3,
          chainage: 'Km 0+082 (Lane 1)',
          gps: { lat: 22.58232, lng: 88.47312 },
          timestamp: '09:45:38',
          droneAltitudeMeters: 32.1,
          droneSpeedKmh: 14.5,
          cameraPitchDegrees: -45,
          thumbnailUrl: '/images/pothole_3.jpg',
          defectsDetected: 1,
          surfaceCondition: 'Critical' as const,
        },
        {
          id: 'SNP-04',
          snapNumber: 4,
          chainage: 'Km 0+105 (Lane 1)',
          gps: { lat: 22.58255, lng: 88.47320 },
          timestamp: '09:45:50',
          droneAltitudeMeters: 30.5,
          droneSpeedKmh: 12.8,
          cameraPitchDegrees: -90,
          thumbnailUrl: '/images/pothole_4.jpg',
          defectsDetected: 1,
          surfaceCondition: 'Critical' as const,
        },
      ]
    : [
        {
          id: 'SNP-01',
          snapNumber: 1,
          chainage: record.chainage,
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
          chainage: `${record.chainage} + 150m`,
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
        <UploadNsvReportModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          roadCode={record.roadCode}
          roadName={record.roadName}
          onUploadSuccess={() => {
            setIsNsvUploaded(true);
            setShowUploadModal(false);
          }}
        />
      </div>
    </GenericModal>
  );
};
