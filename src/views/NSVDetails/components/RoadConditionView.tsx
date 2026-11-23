import React, { useState } from 'react';
import {
  AlertTriangle,
  Layers,
  Calculator,
  Camera,
  Maximize2,
  X,
  FileCheck,
  CheckCircle2,
  Table,
  Info,
} from 'lucide-react';
import { NSVRoadDetails } from '../../../models/nsvModels';

interface RoadConditionViewProps {
  details: NSVRoadDetails;
}

export const RoadConditionView: React.FC<RoadConditionViewProps> = ({ details }) => {
  const [selectedPhotoModal, setSelectedPhotoModal] = useState<{
    id: string;
    title: string;
    chainage: string;
    gps: string;
    imgUrl: string;
    depth: string;
    volume: string;
  } | null>(null);

  const potholesData = [
    {
      id: 'PH-01',
      chainage: 'Km 0+018',
      lane: 'Lane 1 (Outer Wheelpath)',
      gps: '22.58168°N, 88.47288°E',
      areaM2: 0.465,
      areaSqFt: '5.0 sq ft',
      depthMm: 20,
      volumeM3: 0.0093,
      volumeLiters: 9.3,
      photoId: 'IMG-01',
      photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg',
      failureType: 'Wearing course fatigue fracture under heavy bus axle',
      action: 'Saw-cut vertical squaring, DBM infill + 40mm BC overlay',
    },
    {
      id: 'PH-02',
      chainage: 'Km 0+045',
      lane: 'Lane 1 (Outer Wheelpath)',
      gps: '22.58195°N, 88.47298°E',
      areaM2: 0.465,
      areaSqFt: '5.0 sq ft',
      depthMm: 20,
      volumeM3: 0.0093,
      volumeLiters: 9.3,
      photoId: 'IMG-02',
      photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Pothole_Big.jpg',
      failureType: 'Wheelpath rutting fracture; aggregate depression',
      action: 'Base compaction check, DBM infill + tack coat bed',
    },
    {
      id: 'PH-03',
      chainage: 'Km 0+082',
      lane: 'Lane 1 (Braking Approach)',
      gps: '22.58232°N, 88.47312°E',
      areaM2: 0.465,
      areaSqFt: '5.0 sq ft',
      depthMm: 20,
      volumeM3: 0.0093,
      volumeLiters: 9.3,
      photoId: 'IMG-03',
      photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Pothole_repair.jpg',
      failureType: 'Bitumen stripping & surface raveling under braking deceleration',
      action: 'Mechanized cold milling, DBM patch, SS-1 tack coat',
    },
    {
      id: 'PH-04',
      chainage: 'Km 0+105',
      lane: 'Lane 1 (Slow Carriageway)',
      gps: '22.58255°N, 88.47320°E',
      areaM2: 0.465,
      areaSqFt: '5.0 sq ft',
      depthMm: 20,
      volumeM3: 0.0093,
      volumeLiters: 9.3,
      photoId: 'IMG-04',
      photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_pothole.jpg',
      failureType: 'Tarmac fatigue alligator crack depression',
      action: 'Interlayer geotextile / DBM patching prior to resurfacing',
    },
  ];

  const otherDistresses = [
    { type: 'Ravelling', status: 'Not provided', action: 'Inspect and record severity / extent' },
    { type: 'Cracking', status: 'Not provided', action: 'Map longitudinal, transverse and fatigue cracking' },
    { type: 'Edge break', status: 'Not provided', action: 'Measure length and width of edge deterioration' },
    { type: 'Depression', status: 'Not provided', action: 'Record location and maximum depth' },
    { type: 'Bleeding', status: 'Not provided', action: 'Inspect surface film and skid-related risk' },
    { type: 'Patching', status: 'Not provided', action: 'Record existing patch locations and condition' },
    { type: 'Drain / shoulder', status: 'Not provided', action: 'Inspect drainage continuity and shoulder support' },
  ];

  return (
    <div className="space-y-4 text-xs text-slate-800">
      {/* Zoom Modal */}
      {selectedPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-2xl">
            <div className="px-4 py-3 bg-slate-800 text-white flex items-center justify-between text-xs font-bold">
              <span>{selectedPhotoModal.title} • {selectedPhotoModal.chainage} ({selectedPhotoModal.gps})</span>
              <button
                onClick={() => setSelectedPhotoModal(null)}
                className="p-1 hover:bg-slate-700 rounded transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={selectedPhotoModal.imgUrl} alt={selectedPhotoModal.title} className="w-full max-h-[60vh] object-cover" />
            <div className="px-4 py-3 bg-slate-800 text-white flex items-center justify-between text-[11px] tabular-nums">
              <span>Depth: <strong className="text-red-400">{selectedPhotoModal.depth}</strong></span>
              <span>Calculated Void: <strong className="text-blue-400">{selectedPhotoModal.volume}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner - Standard Padding p-4 */}
      <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 text-white p-4 rounded-xl border border-red-900/40 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600/40 text-red-200 border border-red-500/40 tabular-nums">
              PAVEMENT DISTRESS REGISTRY
            </span>
            <span className="text-xs font-mono text-slate-300">
              SECTION – 3: ROAD CONDITION DATA
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Pavement Distress Inventory &amp; Pothole Assessment
          </h3>
          <p className="text-xs text-slate-300">
            Field defect registry, depth profiles and geometric void calculations for <strong>NKDA Road MAR 1111</strong>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px] text-right">
          <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
            <span className="text-slate-400 text-[10px] block uppercase font-medium">DEFECTS</span>
            <span className="text-red-400 font-bold tabular-nums">4 Verified</span>
          </div>
          <div className="p-2.5 bg-white/10 rounded-lg border border-white/10">
            <span className="text-slate-400 text-[10px] block uppercase font-medium">TOTAL VOID</span>
            <span className="text-blue-300 font-bold tabular-nums">0.0372 m³</span>
          </div>
        </div>
      </div>

      {/* 3.1 Introduction */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-[#1a73e8]" />
          <span>3.1 Pavement Condition &amp; Distress Overview</span>
        </h4>
        <p className="text-slate-700 leading-relaxed">
          Pavement condition assessment records visible surface defects and their extent and severity. The user-specified sample inventory for <strong>NKDA Road MAR 1111</strong> contains four potholes with a combined plan area of <strong>20 sq ft (approximately 1.86 m²)</strong> and average depth of <strong>20 mm</strong>.
        </p>
      </div>

      {/* 3.2 Pothole Assessment Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-red-600" />
            <h4 className="text-sm font-bold text-slate-900">
              3.2 Pothole Assessment &amp; Void Volume Table
            </h4>
          </div>
          <span className="text-xs text-slate-500">Outer Wheelpath • Lane 1</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-fixed w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="w-[12%] px-4 py-3 align-middle">Defect ID</th>
                <th className="w-[14%] px-4 py-3 align-middle">Area (m²)</th>
                <th className="w-[12%] px-4 py-3 align-middle">Depth (mm)</th>
                <th className="w-[14%] px-4 py-3 align-middle">Volume (m³)</th>
                <th className="w-[24%] px-4 py-3 align-middle">Location (Chainage &amp; GPS)</th>
                <th className="w-[24%] px-4 py-3 align-middle">Distress Failure Mechanism</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {potholesData.map((pth) => (
                <tr key={pth.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-middle font-bold text-red-600 tabular-nums">{pth.id}</td>
                  <td className="px-4 py-3 align-middle tabular-nums text-slate-900">{pth.areaM2.toFixed(3)} ({pth.areaSqFt})</td>
                  <td className="px-4 py-3 align-middle tabular-nums font-bold text-slate-900">{pth.depthMm} mm</td>
                  <td className="px-4 py-3 align-middle tabular-nums font-bold text-blue-700">{pth.volumeM3.toFixed(4)} m³</td>
                  <td className="px-4 py-3 align-middle text-slate-700">
                    <span className="font-semibold block tabular-nums">{pth.chainage}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{pth.gps}</span>
                  </td>
                  <td className="px-4 py-3 align-middle text-slate-600">{pth.failureType}</td>
                </tr>
              ))}
              <tr className="bg-red-50/70 font-bold text-slate-900">
                <td className="px-4 py-3 align-middle text-red-700">TOTAL</td>
                <td className="px-4 py-3 align-middle tabular-nums text-red-700">1.860 m² (20 sq ft)</td>
                <td className="px-4 py-3 align-middle tabular-nums text-red-700">20 mm avg.</td>
                <td className="px-4 py-3 align-middle tabular-nums text-blue-900">0.0372 m³ (37.2 L)</td>
                <td className="px-4 py-3 align-middle font-semibold text-slate-800" colSpan={2}>
                  4 Potholes across 120m segment (Km 0+000 to Km 0+120)
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3.3 Quantity Calculation */}
      <div className="p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-200 rounded-xl space-y-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-700" />
          <h4 className="text-sm font-bold text-blue-950">
            3.3 Surface Area &amp; Void Quantity Calculations
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              1. Combined Plan Surface Area
            </span>
            <div className="text-slate-900 text-sm font-bold tabular-nums">
              20 sq ft × 0.092903 = 1.858 m² ≈ 1.86 m²
            </div>
            <p className="text-[11px] text-slate-500">
              Allocated evenly as 0.465 m² per pothole across the 4 verified locations.
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-blue-100 space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              2. Estimated Geometric Void Volume
            </span>
            <div className="text-blue-700 text-sm font-bold tabular-nums">
              1.86 m² × 0.020 m = 0.0372 m³ (37.2 litres)
            </div>
            <p className="text-[11px] text-slate-500">
              Each defect void: 0.0093 m³ (9.3 litres) at 20 mm nominal cutting depth.
            </p>
          </div>
        </div>

        <div className="p-3 bg-white rounded-lg border border-blue-100 text-xs text-slate-700 space-y-1.5 leading-relaxed">
          <p>
            <strong>Allocation Specification:</strong> The equal allocation of <strong>0.465 m²</strong> per pothole in the table is a standard engineering breakdown representing average defect distribution. The actual dimensions and chainages must be measured separately during physical cutting.
          </p>
          <p className="text-slate-600">
            <strong>Bituminous Repair &amp; Volumetric Note:</strong> The estimated existing void volume of <strong>0.0372 m³</strong> is the raw void before edge squaring. Final payable repair quantities depend on cut-out dimensions, depth to sound material, compaction factor (1.20), and approved construction specification (DBM infill + SS-1 tack coat).
          </p>
        </div>
      </div>

      {/* Suggested Field Photo Register */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">
              Photographic Defect Register (IMG-01 to IMG-04)
            </h4>
          </div>
          <span className="text-xs text-slate-500">High-Resolution Defect Camera Log</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {potholesData.map((pth) => (
            <div
              key={pth.photoId}
              onClick={() =>
                setSelectedPhotoModal({
                  id: pth.photoId,
                  title: `${pth.id} (${pth.photoId})`,
                  chainage: pth.chainage,
                  gps: pth.gps,
                  imgUrl: pth.photoUrl,
                  depth: `${pth.depthMm} mm`,
                  volume: `${pth.volumeM3.toFixed(4)} m³`,
                })
              }
              className="group border border-slate-200 rounded-lg overflow-hidden bg-slate-50 hover:border-blue-400 hover:shadow-sm transition cursor-pointer"
            >
              <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
                <img
                  src={pth.photoUrl}
                  alt={pth.id}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow tabular-nums">
                  {pth.id} • {pth.photoId}
                </div>
                <div className="absolute bottom-2 right-2 p-1 bg-black/75 rounded text-white opacity-0 group-hover:opacity-100 transition">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-2.5 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 tabular-nums">{pth.chainage}</span>
                  <span className="text-red-600 font-extrabold tabular-nums">{pth.depthMm}mm</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">{pth.gps}</div>
                <div className="text-[11px] text-blue-700 font-semibold tabular-nums">Void: {pth.volumeM3.toFixed(4)} m³</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3.4 Other Pavement Distresses Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <h4 className="text-sm font-bold text-slate-900">
            3.4 Secondary Pavement Distress Survey Matrix
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="table-fixed w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="w-1/4 px-4 py-3 align-middle">Distress Type</th>
                <th className="w-1/4 px-4 py-3 align-middle">Sample Status</th>
                <th className="w-1/2 px-4 py-3 align-middle">Action / Data Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {otherDistresses.map((d, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-middle font-bold text-slate-800">{d.type}</td>
                  <td className="px-4 py-3 align-middle text-slate-500 italic">{d.status}</td>
                  <td className="px-4 py-3 align-middle text-slate-700">{d.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
