import React, { useState } from 'react';
import { GenericModal } from '../../common/GenericModal';
import { GenericButton } from '../../common/GenericButton';
import { DroneSurveyRecord } from '../../models/surveyModels';
import { Camera, ExternalLink, Layers, Eye, Upload } from 'lucide-react';

interface DronePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: DroneSurveyRecord | null;
  onViewNSV: (roadCode: string) => void;
}

export const DronePhotoModal: React.FC<DronePhotoModalProps> = ({
  isOpen,
  onClose,
  record,
  onViewNSV,
}) => {
  const [activePhotoTab, setActivePhotoTab] = useState<'photo1' | 'photo2'>('photo1');

  if (!record) return null;

  const isUploaded =
    (record.roadCode === 'MAR-1111' || record.roadCode.includes('1111')) && localStorage.getItem('nsv_uploaded_MAR-1111') !== 'false'
      ? true
      : localStorage.getItem(`nsv_uploaded_${record.roadCode}`) === 'true';

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-blue-600" />
          <span>Drone Surveillance Imagery: {record.roadCode}</span>
        </div>
      }
      subtitle={`${record.roadName} • ${record.location} • Chainage: ${record.chainage}`}
      maxWidth="xl"
      footer={
        <>
          <GenericButton variant="secondary" size="sm" onClick={onClose}>
            Close
          </GenericButton>
          {!isUploaded ? (
            <GenericButton
              variant="secondary"
              size="sm"
              onClick={() => {
                onClose();
                onViewNSV(record.roadCode);
              }}
              leftIcon={<Upload className="w-3.5 h-3.5 text-amber-600" />}
            >
              Upload NSV Report
            </GenericButton>
          ) : (
            <GenericButton
              variant="primary"
              size="sm"
              onClick={() => {
                onClose();
                onViewNSV(record.roadCode);
              }}
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
            >
              View NSV Details
            </GenericButton>
          )}
        </>
      }
    >
    <div className="space-y-4">
      {/* Photo Selection Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActivePhotoTab('photo1')}
            className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${activePhotoTab === 'photo1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Photo 1: Aerial Top-Down AI Defect Scan</span>
          </button>

      <button
        onClick={() => setActivePhotoTab('photo2')}
        className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 ${activePhotoTab === 'photo2'
            ? 'bg-blue-600 text-white shadow-xs'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
      >
        <Layers className="w-3.5 h-3.5" />
        <span>Photo 2: Oblique 3D LiDAR & Rut Depth Scan</span>
      </button>
    </div>

    <span className="text-xs text-slate-500 font-mono">
      {activePhotoTab === 'photo1' ? 'RGB Photogrammetry (GSD 0.8cm)' : 'LiDAR 3D Point Mesh'}
    </span>
  </div>

{/* Frame Preview */ }
<div className="relative w-full aspect-[16/10] bg-slate-950 rounded-lg overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center">
  <img
    src={activePhotoTab === 'photo1' ? record.dronePhoto : record.dronePhoto2}
    alt={`${record.roadCode} - ${activePhotoTab}`}
    className="w-full h-full object-contain"
  />
</div>

{/* Details Summary */ }
<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
    <div className="text-slate-500">Depth of Rut</div>
    <div className="text-base font-bold text-red-600">{record.depthOfRut} mm</div>
  </div>
  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
    <div className="text-slate-500">Area of Badness</div>
    <div className="text-base font-bold text-slate-800">{record.areaOfBadness} m²</div>
  </div>
  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
    <div className="text-slate-500">Goodness Score</div>
    <div className="text-base font-bold text-blue-600">{record.goodnessScore} / 100</div>
  </div>
  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
    <div className="text-slate-500">Rough Repair Cost (₹)</div>
    <div className="text-base font-bold text-emerald-700">₹{record.roughCostINR.toLocaleString('en-IN')}</div>
  </div>
</div>
      </div >
    </GenericModal >
  );
};
