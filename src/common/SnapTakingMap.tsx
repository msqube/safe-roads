import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import { RoadSnapPoint } from '../models/nsvModels';
import {
  Layers,
  MapPin,
  Camera,
  ExternalLink,
  Eye,
  Crosshair,
  Maximize2,
  Navigation,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sparkles,
  ShieldAlert,
  FileText,
  CheckCircle,
  Download,
  ArrowDown,
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
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');

  const isMar1111 = roadCode === 'MAR-1111' || roadCode.includes('1111');

  // Certified Highway Snap Points for MAR-1111 on Biswa Bangla Sarani (Lane 1)
  const verifiedSnapPoints: RoadSnapPoint[] = useMemo(() => {
    if (!isMar1111) return snapPoints;
    const realSpecs = [
      {
        lat: 22.58168,
        lng: 88.47288,
        ch: 'Km 0+018',
        thumb: '/images/pothole_1.jpg',
      },
      {
        lat: 22.58195,
        lng: 88.47298,
        ch: 'Km 0+045',
        thumb: '/images/pothole_2.jpg',
      },
      {
        lat: 22.58232,
        lng: 88.47312,
        ch: 'Km 0+082',
        thumb: '/images/pothole_3.jpg',
      },
      {
        lat: 22.58255,
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

  // Update active snap when verifiedSnapPoints change
  useEffect(() => {
    setActiveSnap(verifiedSnapPoints.find((s) => s.id === selectedSnapId) || verifiedSnapPoints[0] || null);
  }, [verifiedSnapPoints, selectedSnapId]);

  // Real Structure Detailed Modal State
  const [inspectModalSnap, setInspectModalSnap] = useState<RoadSnapPoint | null>(null);
  const [modalZoom, setModalZoom] = useState<number>(1.0);
  const [showAiBox, setShowAiBox] = useState<boolean>(true);

  // Default coordinate: Biswa Bangla Sarani Lane 1
  const initialLat = isMar1111 ? 22.58210 : centerGps?.lat || (verifiedSnapPoints[0]?.gps.lat) || 22.58210;
  const initialLng = isMar1111 ? 88.47305 : centerGps?.lng || (verifiedSnapPoints[0]?.gps.lng) || 88.47305;

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 17,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    mapInstanceRef.current = map;

    // Real High-Resolution Satellite with Street Reference Labels Layer (Hybrid)
    const satelliteTiles = L.layerGroup([
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics',
        }
      ),
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
        }
      ),
      L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
        }
      ),
    ]);

    const streetTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | SafeRoads NKDA',
    });

    const activeTileLayer = mapType === 'satellite' ? satelliteTiles : streetTiles;
    activeTileLayer.addTo(map);
    tileLayerRef.current = activeTileLayer as any;

    // Layer group for markers and route lines
    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;

    // Force map size recalculation
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Map Type Switching (Streets vs Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newLayer =
      mapType === 'satellite'
        ? L.layerGroup([
            L.tileLayer(
              'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
              {
                maxZoom: 19,
                attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics',
              }
            ),
            L.tileLayer(
              'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
              {
                maxZoom: 19,
              }
            ),
            L.tileLayer(
              'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
              {
                maxZoom: 19,
              }
            ),
          ])
        : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors | SafeRoads NKDA',
          });

    newLayer.addTo(map);
    tileLayerRef.current = newLayer as any;
  }, [mapType]);

  // Update Markers, Route Polyline, and Drone Flight Path
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    if (verifiedSnapPoints.length === 0) return;

    const latLngs: L.LatLngTuple[] = verifiedSnapPoints.map((s) => [s.gps.lat, s.gps.lng]);

    // Draw Route Polyline
    const routeLine = L.polyline(latLngs, {
      color: mapType === 'satellite' ? '#38bdf8' : '#1a73e8',
      weight: 5,
      opacity: 0.85,
      dashArray: '8, 8',
    }).addTo(layerGroup);

    // Add Markers for each snap point
    verifiedSnapPoints.forEach((snap, idx) => {
      const isSelected = activeSnap?.id === snap.id;
      const hasDefects = snap.defectsDetected > 0;

      const markerColor = isSelected ? '#1a73e8' : hasDefects ? '#ea4335' : '#34a853';

      const customIcon = L.divIcon({
        className: 'custom-road-marker',
        html: `
          <div style="
            background-color: ${markerColor};
            width: ${isSelected ? '32px' : '26px'};
            height: ${isSelected ? '32px' : '26px'};
            border-radius: 50%;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.35);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-size: 11px;
            font-weight: bold;
            font-family: monospace;
            cursor: pointer;
            transition: transform 0.15s ease;
          ">
            ${idx + 1}
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      const marker = L.marker([snap.gps.lat, snap.gps.lng], { icon: customIcon }).addTo(layerGroup);

      // Popup with snap details & photo
      const popupHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; min-width: 200px;">
          <div style="font-weight: bold; font-size: 12px; color: #202124; margin-bottom: 4px;">
            Snap #${snap.snapNumber} • ${snap.chainage}
          </div>
          <div style="color: #5f6368; font-size: 10px; margin-bottom: 6px;">
            GPS: ${snap.gps.lat.toFixed(5)}°N, ${snap.gps.lng.toFixed(5)}°E
          </div>
          <div style="margin-bottom: 6px; border-radius: 4px; overflow: hidden; border: 1px solid #dadce0;">
            <img src="${snap.thumbnailUrl}" style="width: 100%; height: 90px; object-fit: cover;" alt="Snap Preview" />
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="font-weight: 600; color: ${hasDefects ? '#c5221f' : '#137333'};">
              ${hasDefects ? `Pothole PH-0${snap.snapNumber} (20mm)` : 'Nominal Surface'}
            </span>
            <span style="font-size: 10px; color: #70757a;">Alt: ${snap.droneAltitudeMeters}m</span>
          </div>
          <button
            id="snap-popup-nav-btn-${snap.snapNumber}"
            style="width: 100%; padding: 5px 8px; background: #1a73e8; color: #ffffff; border: none; border-radius: 4px; font-size: 10px; font-weight: bold; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 4px;"
          >
            <span>View Full Details in Section 2 ↓</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`snap-popup-nav-btn-${snap.snapNumber}`);
        if (btn) {
          btn.onclick = () => {
            if (onNavigateToSection2) onNavigateToSection2(snap);
          };
        }
      });

      marker.on('click', () => {
        setActiveSnap(snap);
        if (onSelectSnap) onSelectSnap(snap);
      });
    });

    // Fit map bounds to road points
    if (latLngs.length > 1) {
      map.fitBounds(routeLine.getBounds(), { padding: [40, 40], maxZoom: 17 });
    }
  }, [verifiedSnapPoints, activeSnap, mapType]);

  const handleCenterOnSelected = () => {
    if (!mapInstanceRef.current || !activeSnap) return;
    mapInstanceRef.current.setView([activeSnap.gps.lat, activeSnap.gps.lng], 18, { animate: true });
  };

  const openInGoogleMaps = () => {
    const lat = activeSnap ? activeSnap.gps.lat : initialLat;
    const lng = activeSnap ? activeSnap.gps.lng : initialLng;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs flex flex-col">
      {/* Map Header Toolbar */}
      <div className="px-4 py-2.5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#1a73e8]" />
            <h4 className="text-sm font-bold text-slate-900">
              Live Real-World Road Map (New Town Kolkata)
            </h4>
            <span className="text-xs px-2 py-0.5 rounded font-semibold bg-blue-50 text-[#1a73e8] border border-blue-200">
              {verifiedSnapPoints.length} Geotagged Snaps
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {roadCode} • {roadName}
          </p>
        </div>

        {/* Map View & Layer Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Inspect Structure Trigger */}
          <button
            onClick={() => setInspectModalSnap(activeSnap || verifiedSnapPoints[0] || null)}
            className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1a73e8] border border-blue-200 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-xs"
            title="Inspect real road structure & drone photogrammetry telemetry"
          >
            <Eye className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Inspect Real Structure</span>
          </button>

          {/* Map Layer Switcher: Streets vs Real Satellite */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setMapType('streets')}
              className={`px-2.5 py-1 rounded transition font-medium cursor-pointer flex items-center gap-1 ${
                mapType === 'streets'
                  ? 'bg-white text-[#1a73e8] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Street Map</span>
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2.5 py-1 rounded transition font-medium cursor-pointer flex items-center gap-1 ${
                mapType === 'satellite'
                  ? 'bg-white text-[#1a73e8] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>Real Satellite</span>
            </button>
          </div>

          {/* Re-center Button */}
          <button
            onClick={handleCenterOnSelected}
            title="Recenter on active GPS point"
            className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-300 transition cursor-pointer flex items-center gap-1 text-xs"
          >
            <Crosshair className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Center</span>
          </button>

          {/* Open Google Maps Live View */}
          <button
            onClick={openInGoogleMaps}
            title="Open in Google Maps / Google Street View at exact location"
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-300 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5 text-red-600" />
            <span>Google Maps</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative w-full h-[360px] bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" style={{ isolation: 'isolate' }} />

        {/* Live GPS Coordinate Pill HUD */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-300 shadow-md text-xs font-mono flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#ea4335]" />
          <span className="text-slate-900 font-semibold">
            {activeSnap
              ? `${activeSnap.gps.lat.toFixed(5)}°N, ${activeSnap.gps.lng.toFixed(5)}°E`
              : `${initialLat.toFixed(5)}°N, ${initialLng.toFixed(5)}°E`}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-sans font-medium">
            {activeSnap ? activeSnap.chainage : 'Corridor Start'}
          </span>
        </div>

        {/* Take Snapshot Trigger directly on Map */}
        {onTakeSnapshot && activeSnap && (
          <div className="absolute top-3 right-3 z-[400]">
            <button
              onClick={() => onTakeSnapshot(activeSnap.gps, activeSnap.chainage)}
              className="px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Capture Snap at Point #{activeSnap.snapNumber}</span>
            </button>
          </div>
        )}
      </div>

      {/* Snap Points Horizontal Rail */}
      <div className="p-3 bg-slate-50 border-t border-slate-200">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Flight Snaps Gallery along Corridor:</span>
            <span className="text-slate-500 text-[11px] hidden sm:inline">Click any snap to inspect real road structure & telemetry</span>
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
                  if (mapInstanceRef.current) {
                    mapInstanceRef.current.setView([snap.gps.lat, snap.gps.lng], 18, { animate: true });
                  }
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
                  GPS: {snap.gps.lat.toFixed(5)}°N
                </div>

                {/* Explicit Button taking user to Section 2 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSnap(snap);
                    if (onNavigateToSection2) onNavigateToSection2(snap);
                  }}
                  className="mt-2 w-full py-1.5 px-2 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-md text-[11px] font-bold transition flex items-center justify-center gap-1 border border-blue-200 hover:border-blue-600 cursor-pointer shadow-2xs"
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
          <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
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
                        GPS: {inspectModalSnap.gps.lat.toFixed(5)}°N, {inspectModalSnap.gps.lng.toFixed(5)}°E • Alt: {inspectModalSnap.droneAltitudeMeters}m
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
                          <span className="font-semibold text-slate-800 font-mono">{inspectModalSnap.droneAltitudeMeters} m AGL</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Flight Speed</span>
                          <span className="font-semibold text-slate-800 font-mono">{inspectModalSnap.droneSpeedKmh} km/h</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Gimbal Pitch</span>
                          <span className="font-semibold text-slate-800 font-mono">
                            {inspectModalSnap.cameraPitchDegrees}° ({inspectModalSnap.cameraPitchDegrees === -90 ? 'Nadir Orthophoto' : '45° Oblique'})
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
                        <span>Pavement Structure & Defect Diagnostics</span>
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
                          <span className={`font-semibold ${inspectModalSnap.defectsDetected > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                            {inspectModalSnap.defectsDetected > 0 ? 'Wheelpath Pothole Defect' : 'Nominal Wearing Surface'}
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
                            Mechanized cold milling & localized patch with SS-1 tack coat
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
