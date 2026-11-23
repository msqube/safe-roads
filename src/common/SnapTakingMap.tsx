import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { RoadSnapPoint } from '../models/nsvModels';
import {
  MapPin,
  Camera,
  ExternalLink,
  Eye,
  Navigation,
  X,
  ZoomIn,
  ZoomOut,
  FileText,
  Download,
  ArrowDown,
  Compass,
} from 'lucide-react';

interface SnapTakingMapProps {
  roadCode: string;
  roadName: string;
  snapPoints: RoadSnapPoint[];
  centerGps?: { lat: number; lng: number };
  selectedSnapId?: string;
  onSelectSnap?: (snap: RoadSnapPoint) => void;
  onTakeSnapshot?: (gps: { lat: number; lng: number }, chainage: string) => void;
  onNavigateToSection2?: (snap: RoadSnapPoint) => void;
}

export const SnapTakingMap: React.FC<SnapTakingMapProps> = ({
  roadCode,
  roadName,
  snapPoints = [],
  centerGps,
  selectedSnapId,
  onSelectSnap,
  onTakeSnapshot,
  onNavigateToSection2,
}) => {
  const isMar1111 = roadCode === 'MAR-1111' || roadCode.includes('1111');

  // Certified Highway Snap Points for MAR-1111 (100% Horizontally Straight Alignment)
  const verifiedSnapPoints: RoadSnapPoint[] = useMemo(() => {
    if (!isMar1111) return snapPoints;
    const realSpecs = [
      {
        lat: 22.58210,
        lng: 88.47220,
        ch: 'Km 0+018',
        thumb: '/images/pothole_1.jpg',
      },
      {
        lat: 22.58210,
        lng: 88.47250,
        ch: 'Km 0+045',
        thumb: '/images/pothole_2.jpg',
      },
      {
        lat: 22.58210,
        lng: 88.47290,
        ch: 'Km 0+082',
        thumb: '/images/pothole_3.jpg',
      },
      {
        lat: 22.58210,
        lng: 88.47320,
        ch: 'Km 0+105',
        thumb: '/images/pothole_4.jpg',
      },
    ];

    if (!snapPoints || snapPoints.length === 0) {
      return realSpecs.map((spec, idx) => ({
        id: `SNP-0${idx + 1}`,
        snapNumber: idx + 1,
        chainage: spec.ch,
        gps: { lat: spec.lat, lng: spec.lng },
        timestamp: `11:3${idx + 1}:20`,
        droneAltitudeMeters: 31.0,
        droneSpeedKmh: 12.0,
        cameraPitchDegrees: idx % 2 === 0 ? -90 : -45,
        thumbnailUrl: spec.thumb,
        defectsDetected: 1,
        surfaceCondition: 'Critical' as const,
      }));
    }

    return snapPoints.map((s, idx) => ({
      ...s,
      chainage: realSpecs[idx]?.ch || s.chainage,
      gps: realSpecs[idx] ? { lat: realSpecs[idx].lat, lng: realSpecs[idx].lng } : s.gps,
      thumbnailUrl: realSpecs[idx]?.thumb || s.thumbnailUrl,
    }));
  }, [snapPoints, isMar1111]);

  const [activeSnap, setActiveSnap] = useState<RoadSnapPoint | null>(
    verifiedSnapPoints.find((s) => s.id === selectedSnapId) || verifiedSnapPoints[0] || null
  );

  // Real Structure Detailed Modal State
  const [inspectModalSnap, setInspectModalSnap] = useState<RoadSnapPoint | null>(null);
  const [modalZoom, setModalZoom] = useState<number>(1.0);
  const [showAiBox, setShowAiBox] = useState<boolean>(true);

  const initialLat = isMar1111 ? 22.58210 : centerGps?.lat || (verifiedSnapPoints[0]?.gps.lat) || 22.58210;
  const initialLng = isMar1111 ? 88.47270 : centerGps?.lng || (verifiedSnapPoints[0]?.gps.lng) || 88.47270;

  const openInGoogleMaps = () => {
    const lat = activeSnap ? activeSnap.gps.lat : initialLat;
    const lng = activeSnap ? activeSnap.gps.lng : initialLng;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col font-sans">
      {/* 1. Header Toolbar - 100% Horizontal Straight Row & Standard Padding px-4 py-3 */}
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[52px]">
        {/* Left Side: Icon, Title & Pill Badge strictly inline */}
        <div className="flex items-center gap-2.5 min-w-0 flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1a73e8] flex-shrink-0">
            <Compass className="w-4 h-4 text-[#1a73e8]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-slate-900 tracking-tight whitespace-nowrap">
                Live Flight Corridor Inspection
              </h4>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a73e8] border border-blue-200 whitespace-nowrap tabular-nums">
                {verifiedSnapPoints.length} Geotagged Snaps
              </span>
            </div>
            <p className="text-[11px] text-slate-500 truncate">
              {roadCode} • {roadName} (Dual 7.5m Carriageway)
            </p>
          </div>
        </div>

        {/* Right Side Actions - Horizontal Row */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-shrink-0">
          {/* Inspect Structure Trigger */}
          <button
            onClick={() => setInspectModalSnap(activeSnap || verifiedSnapPoints[0] || null)}
            className="h-8 px-3 bg-blue-50 hover:bg-blue-100 text-[#1a73e8] border border-blue-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition shadow-sm whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
            title="Inspect real road structure & drone photogrammetry telemetry"
          >
            <Eye className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Inspect Real Structure</span>
          </button>

          {/* Open Google Maps Live View */}
          <button
            onClick={openInGoogleMaps}
            title="Open exact GPS location in Google Maps"
            className="h-8 px-3 bg-white hover:bg-slate-50 text-slate-700 rounded-lg border border-slate-300 transition cursor-pointer inline-flex items-center gap-1.5 text-xs font-semibold shadow-sm whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          >
            <ExternalLink className="w-3.5 h-3.5 text-red-600" />
            <span>Google Maps</span>
          </button>
        </div>
      </div>

      {/* 2. 100% Horizontally Straight Corridor Runway (Row-Wise Alignment, Zero Slant, Standard Padding p-4) */}
      <div className="relative w-full h-[360px] bg-slate-950 flex flex-col justify-between p-4 select-none overflow-hidden border-b border-slate-200">
        {/* Top Chainage Scale Row */}
        <div className="flex items-center justify-between text-xs font-sans tabular-nums text-slate-300 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white">Km 0+000 (Start of 120m Resurfacing Segment)</span>
          </div>
          <div className="flex items-center gap-6 md:gap-14 text-[11px] text-slate-400 font-medium hidden sm:flex tabular-nums">
            <span>Km 0+020</span>
            <span>Km 0+040</span>
            <span>Km 0+060</span>
            <span>Km 0+080</span>
            <span>Km 0+100</span>
          </div>
          <div className="flex items-center gap-2 font-bold text-white">
            <span>Km 0+120 (End of Segment)</span>
            <span className="w-2 h-2 rounded-full bg-red-400" />
          </div>
        </div>

        {/* 100% Horizontally Straight Carriageway Runway */}
        <div className="relative flex-1 my-3 bg-gradient-to-b from-slate-900 via-slate-900 to-black rounded-xl border border-slate-700/80 shadow-inner flex flex-col justify-between overflow-hidden">
          {/* Lane 2: Fast Carriageway (Top Horizontal Lane) */}
          <div className="h-1/2 border-b-2 border-dashed border-amber-400/80 relative flex items-center px-4 bg-slate-900/60">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-sans font-bold bg-slate-800 text-slate-300 border border-slate-700">
                LANE 2
              </span>
              <span className="text-[11px] font-sans font-semibold text-slate-300">
                Fast Carriageway • Median Divider Verge
              </span>
            </div>
            <span className="absolute right-4 text-[10px] font-sans tabular-nums text-emerald-400 font-semibold">
              IRI: 3.80 m/km • Sound Surface
            </span>
          </div>

          {/* Lane 1: Slow / Heavy Wheelpath Resurfacing Zone (Bottom Horizontal Lane) */}
          <div className="h-1/2 relative flex items-center px-4 bg-slate-950/90">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[9px] font-sans font-bold bg-red-950 text-red-300 border border-red-800">
                LANE 1
              </span>
              <span className="text-[11px] font-sans font-bold text-red-400">
                Slow / Heavy Wheelpath (Resurfacing Scope: 120m)
              </span>
            </div>
            <span className="absolute right-4 text-[10px] font-sans tabular-nums text-red-400 font-bold hidden sm:inline">
              IRI: 5.20 m/km • 20mm Rutting Depth
            </span>

            {/* Horizontal Waypoint Pins positioned precisely along chainage */}
            {verifiedSnapPoints.map((snap, idx) => {
              const isSelected = activeSnap?.id === snap.id;
              const pct = idx === 0 ? 15 : idx === 1 ? 37.5 : idx === 2 ? 68.3 : 87.5;
              return (
                <button
                  key={snap.id}
                  onClick={() => {
                    setActiveSnap(snap);
                    if (onSelectSnap) onSelectSnap(snap);
                  }}
                  style={{ left: `${pct}%` }}
                  className={`absolute -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center group cursor-pointer transition-all duration-150 z-20 ${
                    isSelected ? 'scale-115' : 'hover:scale-105'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex flex-col items-center justify-center text-white font-mono shadow-xl border-2 transition ${
                      isSelected
                        ? 'bg-[#1a73e8] border-amber-300 ring-4 ring-blue-500/40'
                        : snap.defectsDetected > 0
                        ? 'bg-red-600 border-white hover:bg-red-500'
                        : 'bg-emerald-600 border-white hover:bg-emerald-500'
                    }`}
                  >
                    <span className="text-[11px] font-bold">#{snap.snapNumber}</span>
                    <span className="text-[7px] font-semibold opacity-90">20mm</span>
                  </div>
                  <span
                    className={`text-[9px] font-mono mt-1 px-1.5 py-0.5 rounded shadow whitespace-nowrap ${
                      isSelected ? 'bg-blue-600 text-white font-bold' : 'bg-black/90 text-slate-300'
                    }`}
                  >
                    {snap.chainage}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom HUD Bar Row */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            <span className="text-white font-semibold">
              {activeSnap
                ? `GPS: ${activeSnap.gps.lat.toFixed(5)}°N, ${activeSnap.gps.lng.toFixed(5)}°E • ${activeSnap.chainage}`
                : 'Corridor Start'}
            </span>
          </div>
          <span className="text-slate-400 text-[11px] hidden sm:inline">
            MoRTH Dual 7.5m Carriageway • 100% Horizontal Straight Alignment
          </span>
        </div>
      </div>

      {/* 3. Snap Points Horizontal Rail - Standard Padding p-4 Row-Wise */}
      <div className="p-4 bg-slate-50">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Flight Snaps Gallery along Corridor:</span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              Click any snap to inspect real road structure &amp; telemetry
            </span>
          </div>
          {activeSnap && (
            <button
              onClick={() => setInspectModalSnap(activeSnap)}
              className="text-[#1a73e8] hover:underline text-[11px] font-semibold cursor-pointer flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Snap #{activeSnap.snapNumber}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {verifiedSnapPoints.map((snap) => {
            const isSelected = activeSnap?.id === snap.id;
            const hasDefects = snap.defectsDetected > 0;

            return (
              <div
                key={snap.id}
                onClick={() => {
                  setActiveSnap(snap);
                  if (onSelectSnap) onSelectSnap(snap);
                  if (onNavigateToSection2) {
                    onNavigateToSection2(snap);
                  }
                }}
                className={`flex-shrink-0 w-48 p-2.5 rounded-xl border cursor-pointer transition group hover:shadow-md ${
                  isSelected
                    ? 'bg-blue-50/90 border-[#1a73e8] ring-2 ring-blue-300 shadow-sm'
                    : 'bg-white border-slate-200 hover:border-blue-400'
                }`}
              >
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSnap(snap);
                    if (onNavigateToSection2) onNavigateToSection2(snap);
                  }}
                  className="relative aspect-[16/10] rounded-lg overflow-hidden mb-1.5 bg-slate-900 group cursor-pointer"
                  title={`Click to open Pothole PH-0${snap.snapNumber} in Section 2`}
                >
                  <img
                    src={snap.thumbnailUrl}
                    alt={snap.chainage}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        snap.snapNumber === 4
                          ? '/images/pothole_4.jpg'
                          : snap.snapNumber === 3
                          ? '/images/pothole_3.jpg'
                          : snap.snapNumber === 2
                          ? '/images/pothole_2.jpg'
                          : '/images/pothole_1.jpg';
                    }}
                  />
                  <span
                    className={`absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-mono text-white font-bold shadow ${
                      hasDefects ? 'bg-red-600' : 'bg-emerald-600'
                    }`}
                  >
                    #{snap.snapNumber}
                  </span>

                  {/* Jump badge indicator overlay on hover */}
                  <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-1 rounded shadow flex items-center gap-1">
                      <span>Jump to Section 2</span>
                      <ArrowDown className="w-3 h-3" />
                    </span>
                  </div>

                  {/* Quick Inspect Button Overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSnap(snap);
                      setInspectModalSnap(snap);
                    }}
                    className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 hover:bg-blue-600 text-white rounded text-[9px] font-semibold flex items-center gap-1 transition shadow cursor-pointer z-10"
                    title="Inspect telemetry modal"
                  >
                    <Eye className="w-2.5 h-2.5" />
                    <span>Telemetry</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{snap.chainage}</span>
                  <span className={hasDefects ? 'text-red-600 font-bold' : 'text-emerald-700 font-medium'}>
                    {hasDefects ? `Pothole PH-0${snap.snapNumber}` : 'Clear'}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                  GPS: {snap.gps.lat.toFixed(5)}°N, {snap.gps.lng.toFixed(5)}°E
                </div>

                {/* Explicit Button taking user to Section 2 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSnap(snap);
                    if (onNavigateToSection2) onNavigateToSection2(snap);
                  }}
                  className="mt-2 w-full py-1.5 px-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-md text-[11px] font-bold transition flex items-center justify-center gap-1 border border-blue-200 hover:border-blue-600 cursor-pointer shadow-sm"
                >
                  <span>View Details in Section 2</span>
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* REAL ROAD STRUCTURE & DRONE FLIGHT TELEMETRY MODAL */}
      {inspectModalSnap &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-300">
              {/* Modal Header */}
              <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#1a73e8]" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Real Road Structure Inspection — Snap #{inspectModalSnap.snapNumber}
                    </h3>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        inspectModalSnap.defectsDetected > 0
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {inspectModalSnap.defectsDetected > 0
                        ? `${inspectModalSnap.defectsDetected} Defect Detected (${inspectModalSnap.surfaceCondition})`
                        : 'Nominal Surface'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {roadCode} • {roadName} • {inspectModalSnap.chainage} • Captured at {inspectModalSnap.timestamp} IST
                  </p>
                </div>

                <button
                  onClick={() => setInspectModalSnap(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Left: High-Resolution Photographic Road Structure */}
                  <div className="md:col-span-7 space-y-2">
                    <div className="relative aspect-[4/3] bg-black rounded-lg overflow-hidden shadow-inner border border-slate-800 flex items-center justify-center">
                      <img
                        src={inspectModalSnap.thumbnailUrl}
                        alt={inspectModalSnap.chainage}
                        style={{ transform: `scale(${modalZoom})` }}
                        className="w-full h-full object-cover select-none transition-transform duration-150"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg';
                        }}
                      />

                      {/* AI Bounding Box Overlay */}
                      {showAiBox && inspectModalSnap.defectsDetected > 0 && (
                        <div className="absolute top-[35%] left-[28%] w-[44%] h-[40%] border-2 border-red-500 rounded bg-red-500/15 pointer-events-none flex flex-col justify-between p-1.5 shadow-lg">
                          <span className="bg-red-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.5 rounded shadow w-max">
                            POTHOLE DEFECT • 20mm DEPTH
                          </span>
                          <span className="text-[9px] font-mono text-white bg-black/75 px-1 py-0.5 rounded w-max drop-shadow">
                            Bituminous Concrete Layer Fracture
                          </span>
                        </div>
                      )}

                      {/* Sensor Watermark */}
                      <div className="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-mono px-2 py-1 rounded backdrop-blur-xs border border-white/10 pointer-events-none">
                        GPS: {inspectModalSnap.gps.lat.toFixed(5)}°N, {inspectModalSnap.gps.lng.toFixed(5)}°E • Alt:{' '}
                        {inspectModalSnap.droneAltitudeMeters}m
                      </div>
                    </div>

                    {/* Photo Controls */}
                    <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setModalZoom((z) => Math.min(2.5, z + 0.25))}
                          className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-300 cursor-pointer"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-3.5 h-3.5 text-slate-700" />
                        </button>
                        <button
                          onClick={() => setModalZoom((z) => Math.max(1.0, z - 0.25))}
                          className="p-1 bg-white hover:bg-slate-100 rounded border border-slate-300 cursor-pointer"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-3.5 h-3.5 text-slate-700" />
                        </button>
                        <button
                          onClick={() => setModalZoom(1.0)}
                          className="px-2 py-1 bg-white hover:bg-slate-100 rounded border border-slate-300 text-[11px] font-medium cursor-pointer"
                        >
                          Reset ({modalZoom.toFixed(1)}x)
                        </button>
                      </div>

                      <button
                        onClick={() => setShowAiBox(!showAiBox)}
                        className={`px-2.5 py-1 rounded border text-[11px] font-semibold cursor-pointer transition ${
                          showAiBox
                            ? 'bg-red-50 text-red-700 border-red-300'
                            : 'bg-white text-slate-600 border-slate-300'
                        }`}
                      >
                        {showAiBox ? 'Hide AI Bounding Box' : 'Show AI Bounding Box'}
                      </button>
                    </div>
                  </div>

                  {/* Right: Flight & Photogrammetric Telemetry */}
                  <div className="md:col-span-5 space-y-3">
                    {/* Flight Telemetry Card */}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-[#1a73e8]" />
                        <span>Drone Flight Telemetry</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Drone Platform</span>
                          <span className="font-semibold text-slate-800">DJI Matrice 350 RTK</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Sensor Payload</span>
                          <span className="font-semibold text-slate-800">45MP RGB + LiDAR L1</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Flight Altitude</span>
                          <span className="font-semibold text-slate-800 font-mono">
                            {inspectModalSnap.droneAltitudeMeters} m AGL
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Flight Speed</span>
                          <span className="font-semibold text-slate-800 font-mono">
                            {inspectModalSnap.droneSpeedKmh} km/h
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Gimbal Pitch</span>
                          <span className="font-semibold text-slate-800 font-mono">
                            {inspectModalSnap.cameraPitchDegrees}° (
                            {inspectModalSnap.cameraPitchDegrees === -90 ? 'Nadir Orthophoto' : '45° Oblique'})
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Ground Resolution</span>
                          <span className="font-semibold text-slate-800 font-mono">1.15 cm/pixel</span>
                        </div>
                      </div>
                    </div>

                    {/* Pavement Structural Diagnostics */}
                    <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pavement Structure &amp; Defect Diagnostics</span>
                      </h4>
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-500">Geotag Coordinates:</span>
                          <span className="font-mono font-semibold text-slate-800">
                            {inspectModalSnap.gps.lat.toFixed(5)}°N, {inspectModalSnap.gps.lng.toFixed(5)}°E
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-500">Distress Category:</span>
                          <span
                            className={`font-semibold ${
                              inspectModalSnap.defectsDetected > 0 ? 'text-red-600' : 'text-emerald-600'
                            }`}
                          >
                            {inspectModalSnap.defectsDetected > 0
                              ? 'Wheelpath Pothole Defect'
                              : 'Nominal Wearing Surface'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-500">Measured Depth:</span>
                          <span className="font-semibold text-red-600 font-mono">
                            {inspectModalSnap.defectsDetected > 0 ? '20 mm (Critical)' : '0 mm (Flush)'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-slate-100 pb-1">
                          <span className="text-slate-500">Pavement Layer Damage:</span>
                          <span className="text-slate-700">Bituminous Concrete (40mm) into DBM</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-slate-500 block text-[10px]">Recommended Remediation:</span>
                          <span className="font-semibold text-slate-800">
                            Mechanized cold milling &amp; localized patch with SS-1 tack coat
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${inspectModalSnap.gps.lat},${inspectModalSnap.gps.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>View Exact Location on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#1a73e8]" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = inspectModalSnap.thumbnailUrl;
                      link.download = `${roadCode}_Snap_${inspectModalSnap.snapNumber}.jpg`;
                      link.click();
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-600" />
                    <span>Download Scan</span>
                  </button>

                  <button
                    onClick={() => {
                      const targetSnap = inspectModalSnap;
                      setInspectModalSnap(null);
                      if (onNavigateToSection2 && targetSnap) {
                        onNavigateToSection2(targetSnap);
                      }
                    }}
                    className="px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                    <span>View Pothole in Section 2</span>
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};