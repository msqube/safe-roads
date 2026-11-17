import React, { useState } from 'react';
import { Layers, AlertTriangle, Wrench, CheckCircle2, MapPin, Sparkles, Navigation } from 'lucide-react';
import { PotholeInspectionDefect } from '../models/nsvModels';

interface PotholeInspectionViewerProps {
  defects: PotholeInspectionDefect[];
  initialDefectId?: string;
  selectedDefectId?: string;
  onSelectDefect?: (defectId: string) => void;
  onAssignRepair?: (defect: PotholeInspectionDefect) => void;
  isHighlighted?: boolean;
}

export const PotholeInspectionViewer: React.FC<PotholeInspectionViewerProps> = ({
  defects = [],
  initialDefectId,
  selectedDefectId,
  onSelectDefect,
  onAssignRepair,
  isHighlighted = false,
}) => {
  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    initialDefectId || (defects[0]?.id ?? '')
  );
  const [showBoundingBox, setShowBoundingBox] = useState<boolean>(true);

  const effectiveSelectedId = selectedDefectId !== undefined ? selectedDefectId : internalSelectedId;
  const activeDefect = defects.find((d) => d.id === effectiveSelectedId) || defects[0];

  const handleSelectDefect = (id: string) => {
    setInternalSelectedId(id);
    if (onSelectDefect) onSelectDefect(id);
  };

  if (!activeDefect) {
    return (
      <div className="p-6 bg-white border border-slate-200 rounded-lg text-center text-slate-500 text-xs">
        No defect inspection data recorded for this section.
      </div>
    );
  }

  const isCritical = activeDefect.severity === 'Critical' || activeDefect.severity === 'Severe';

  return (
    <div
      id="section-2-pothole-gallery"
      className={`w-full bg-white border rounded-xl overflow-hidden shadow-sm flex flex-col transition-all duration-500 ${
        isHighlighted
          ? 'border-[#1a73e8] ring-4 ring-blue-400/50 shadow-xl'
          : 'border-slate-200'
      }`}
    >
      {/* Dynamic Highlight Notification when navigated from Section 1 */}
      {isHighlighted && (
        <div className="px-4 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white text-xs font-bold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>
              Navigated from Drone Flight Snap: Focused on {activeDefect.potholeId} ({activeDefect.name})
            </span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">
            {activeDefect.chainage} • Lane 1
          </span>
        </div>
      )}

      {/* Top Header */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>2. Lane Numbered Potholes &amp; Defect Inspection Gallery</span>
            <span className="text-xs px-2.5 py-0.5 rounded font-mono bg-red-100 text-red-800 border border-red-300 font-bold">
              {activeDefect.potholeId}
            </span>
          </h4>
          <p className="text-xs text-slate-500">
            Chainage {activeDefect.chainage} • 20mm Depth • Part of 120m Corridor Package
          </p>
        </div>

        {/* Defect Switcher & Box toggle */}
        <div className="flex items-center gap-2">
          {defects.length > 1 && (
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-1">
              {defects.map((d, idx) => (
                <button
                  key={d.id}
                  onClick={() => handleSelectDefect(d.id)}
                  className={`px-2.5 py-1 text-xs rounded font-medium cursor-pointer transition ${
                    activeDefect.id === d.id
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pothole #{idx + 1} ({d.potholeId})
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowBoundingBox(!showBoundingBox)}
            className={`px-2.5 py-1 text-xs rounded border cursor-pointer font-medium transition ${
              showBoundingBox
                ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
          >
            {showBoundingBox ? 'Hide AI Box' : 'Show AI Box'}
          </button>
        </div>
      </div>

      {/* Main Inspection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
        {/* Left Image View */}
        <div className="md:col-span-7 bg-slate-950 min-h-[340px] flex items-center justify-center p-4 relative border-b md:border-b-0 md:border-r border-slate-200">
          <div className="relative w-full max-w-lg aspect-[4/3] rounded-lg overflow-hidden shadow-lg border border-slate-800">
            <img
              src={activeDefect.photoUrl}
              alt={activeDefect.name}
              className="w-full h-full object-cover select-none"
            />

            {showBoundingBox && (
              <div
                style={{
                  left: `${activeDefect.boundingBox.x}%`,
                  top: `${activeDefect.boundingBox.y}%`,
                  width: `${activeDefect.boundingBox.width}%`,
                  height: `${activeDefect.boundingBox.height}%`,
                }}
                className="absolute border-2 border-red-500 rounded pointer-events-none"
              >
                <div className="absolute -top-5 left-0 px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded shadow-sm">
                  {activeDefect.potholeId}: {activeDefect.dimensions.depthMm}mm Depth
                </div>
              </div>
            )}

            <div className="absolute bottom-2 left-2 bg-black/85 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] font-mono text-slate-200 border border-slate-700">
              {activeDefect.chainage} • {activeDefect.dimensions.lengthCm}×{activeDefect.dimensions.widthCm}cm • 0.0093 m³
            </div>
          </div>
        </div>

        {/* Right Details Card */}
        <div className="md:col-span-5 p-5 bg-white flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">Defect Classification</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded border ${
                    isCritical
                      ? 'bg-red-50 text-red-700 border-red-200 font-bold'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  {activeDefect.severity} (20mm Depth)
                </span>
              </div>
              <h5 className="text-sm font-bold text-slate-900 mt-1">{activeDefect.name}</h5>
              <p className="text-xs text-slate-500">{activeDefect.pavementType}</p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px]">Measured Depth</span>
                <div className="text-base font-black text-red-600">
                  {activeDefect.dimensions.depthMm} mm
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px]">Distress Area</span>
                <div className="text-sm font-bold text-slate-800">
                  {activeDefect.dimensions.lengthCm} × {activeDefect.dimensions.widthCm} cm
                </div>
                <div className="text-[10px] text-slate-500">0.465 m² (20 sq ft / 4)</div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px]">Calculated Void Volume</span>
                <div className="text-base font-bold text-slate-800">
                  0.0093 m³
                </div>
                <div className="text-[10px] text-slate-500">MoRTH Standard Spec (m³)</div>
              </div>

              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-slate-500 text-[11px]">Geotag GPS</span>
                <div className="text-xs font-mono font-bold text-slate-800 pt-0.5">
                  {activeDefect.gpsCoordinates.lat.toFixed(5)}°N
                </div>
                <div className="text-[10px] font-mono text-slate-600">
                  {activeDefect.gpsCoordinates.lng.toFixed(5)}°E
                </div>
              </div>
            </div>

            {/* Engineering Failure & Treatment Analysis */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-xs">
              <div className="text-slate-500 font-semibold text-[11px]">MoRTH Failure Diagnosis:</div>
              <div className="text-slate-700 font-medium">
                Wearing course fatigue fracture &amp; aggregate binder loss under heavy axle loading.
              </div>
              <div className="text-slate-500 font-semibold text-[11px] pt-1">Prescribed Repair:</div>
              <div className="text-emerald-700 font-bold">
                Mechanized Cold Milling (40mm) &amp; DBM infill with SS-1 tack coat.
              </div>
            </div>
          </div>

          {onAssignRepair && (
            <button
              onClick={() => onAssignRepair(activeDefect)}
              className="w-full py-2.5 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white font-bold rounded-lg text-xs transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
            >
              <Wrench className="w-4 h-4" />
              <span>Assign Whole Road Corridor Resurfacing Package (120m)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
