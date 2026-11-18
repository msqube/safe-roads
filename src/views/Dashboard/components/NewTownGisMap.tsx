import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import {
  Layers,
  MapPin,
  Crosshair,
  ExternalLink,
  Flame,
  AlertTriangle,
  Navigation,
  RotateCcw,
  Video,
  FileSpreadsheet,
} from 'lucide-react';
import { DroneSurveyRecord } from '../../../models/surveyModels';
import {
  getCorridorCoordinates,
  getCorridorPotholes,
  GisPothole,
} from '../../../services/newTownGisData';

interface NewTownGisMapProps {
  surveys: DroneSurveyRecord[];
  selectedRoadCode: string | null;
  onSelectRoad: (roadCode: string) => void;
  onClearSelection?: () => void;
  selectedPotholeId?: string;
  onSelectPothole?: (potholeId: string) => void;
}

export const NewTownGisMap: React.FC<NewTownGisMapProps> = ({
  surveys,
  selectedRoadCode,
  onSelectRoad,
  onClearSelection,
  selectedPotholeId,
  onSelectPothole,
}) => {
  const navigate = useNavigate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const corridorsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const potholesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.LayerGroup | L.TileLayer | null>(null);

  const [mapType, setMapType] = useState<'satellite' | 'streets'>('streets');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'critical' | 'poor'>('all');
  const [isDetailCardClosed, setIsDetailCardClosed] = useState<boolean>(false);

  // New Town Center Overview (Biswa Bangla Sarani Corridor Focus)
  const initialCenter: [number, number] = [22.58210, 88.47305];
  const potholeMarkersRef = useRef<Record<string, L.Marker>>({});

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13.5,
      zoomControl: false,
      scrollWheelZoom: true,
      wheelDebounceTime: 40,
      wheelPxPerZoomLevel: 120,
      zoomAnimation: true,
      zoomAnimationThreshold: 4,
      fadeAnimation: true,
      markerZoomAnimation: true,
      inertia: true,
      inertiaDeceleration: 3400,
      easeLinearity: 0.15,
      preferCanvas: true,
    });

    mapInstanceRef.current = map;

    // Real High-Resolution Satellite Hybrid
    const satelliteTiles = L.layerGroup([
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
          attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics',
          keepBuffer: 3,
        }
      ),
      L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, keepBuffer: 2 }
      ),
      L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19, keepBuffer: 2 }
      ),
    ]);

    const streetTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors | SafeRoads NKDA',
      keepBuffer: 6,
    });

    const activeTileLayer = mapType === 'satellite' ? satelliteTiles : streetTiles;
    activeTileLayer.addTo(map);
    tileLayerRef.current = activeTileLayer;

    // Layer groups for corridors and pothole markers
    const corridorsGroup = L.layerGroup().addTo(map);
    const potholesGroup = L.layerGroup().addTo(map);
    corridorsLayerGroupRef.current = corridorsGroup;
    potholesLayerGroupRef.current = potholesGroup;

    // Setup ResizeObserver to guarantee the map re-calculates tiles whenever its container resizes
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ pan: false });
      }
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
      if (mapContainerRef.current.parentElement) {
        resizeObserver.observe(mapContainerRef.current.parentElement);
      }
    }

    const handleWindowResize = () => {
      mapInstanceRef.current?.invalidateSize({ pan: false });
    };
    window.addEventListener('resize', handleWindowResize);

    // Multi-stage size invalidation so tiles aggressively fill the container as DOM layout settles
    const timers = [
      setTimeout(() => map.invalidateSize({ pan: false }), 50),
      setTimeout(() => map.invalidateSize({ pan: false }), 150),
      setTimeout(() => map.invalidateSize({ pan: false }), 350),
      setTimeout(() => map.invalidateSize({ pan: false }), 700),
    ];

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Layer Switching (Satellite vs Street Map)
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current as any);
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
              { maxZoom: 19 }
            ),
            L.tileLayer(
              'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
              { maxZoom: 19 }
            ),
          ])
        : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors | SafeRoads NKDA',
            keepBuffer: 6,
          });

    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
    setTimeout(() => map.invalidateSize({ pan: false }), 50);
  }, [mapType]);

  // Render Corridors and Potholes
  // Clean Map Rule: ALL critical roads are highlighted, but individual potholes ONLY appear for the SELECTED road!
  useEffect(() => {
    if (!mapInstanceRef.current || !corridorsLayerGroupRef.current || !potholesLayerGroupRef.current) return;
    const map = mapInstanceRef.current;
    const corridorsGroup = corridorsLayerGroupRef.current;
    const potholesGroup = potholesLayerGroupRef.current;

    corridorsGroup.clearLayers();
    potholesGroup.clearLayers();

    // 1. Draw All Corridors across New Town Kolkata
    surveys.forEach((survey) => {
      const isCritical = survey.condition === 'Critical';
      const isPoor = survey.condition === 'Poor';
      const isSelected = selectedRoadCode === survey.roadCode;
      const isPendingDrone = survey.pipelineTier === 'pending_drone';
      const isDroneOnly = survey.pipelineTier === 'drone_only';
      const isFullPipeline = survey.pipelineTier === 'full_pipeline';

      if (filterSeverity === 'critical' && !isCritical) return;
      if (filterSeverity === 'poor' && !isCritical && !isPoor) return;

      const corridorCoords = getCorridorCoordinates(
        survey.roadCode,
        survey.gpsLatitude,
        survey.gpsLongitude
      );

      // Color scheme based on road severity & drone survey status (MAR-1111 is strictly RED)
      const strokeColor = (survey.roadCode === 'MAR-1111' || isCritical)
        ? (isSelected ? '#b91c1c' : '#ef4444')
        : isSelected
        ? '#1a73e8'
        : isPendingDrone
        ? '#94a3b8'
        : isPoor
        ? '#f59e0b'
        : '#10b981';

      const strokeWeight = isSelected ? 8 : isPendingDrone ? 3.5 : isCritical ? 6 : 4;
      const strokeOpacity = isSelected ? 1.0 : isPendingDrone ? 0.75 : isCritical ? 0.95 : 0.65;
      const dashArray = isPendingDrone ? '6, 8' : undefined;

      // Glow underlay for critical or selected roads that have survey data
      if ((isCritical || isSelected) && !isPendingDrone) {
        L.polyline(corridorCoords, {
          color: (survey.roadCode === 'MAR-1111' || isCritical) ? '#ea4335' : (isSelected ? '#3b82f6' : '#ea4335'),
          weight: strokeWeight + 6,
          opacity: isSelected ? 0.6 : 0.35,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(corridorsGroup);
      }

      // Main polyline
      const polyline = L.polyline(corridorCoords, {
        color: strokeColor,
        weight: strokeWeight,
        opacity: strokeOpacity,
        dashArray,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(corridorsGroup);

      // Tooltip on hover
      const statusLabel = (survey.roadCode === 'MAR-1111' || isCritical)
        ? `<span style="color:#dc2626; font-weight: bold;">🚨 CRITICAL CORRIDOR • 4 Potholes (20mm Depth • NSV Verified)</span>`
        : isPendingDrone
        ? `<span style="color:#d97706; font-weight: bold;">NO Drone Survey Performed Yet (Patrol Pending)</span>`
        : isDroneOnly
        ? `<span style="color:#dc2626; font-weight: bold;">Drone Scanned • 5 Potholes (NO NSV Survey)</span>`
        : `<span style="color:#10b981; font-weight: bold;">Routine Surveillance</span>`;

      polyline.bindTooltip(
        `<div style="font-family: -apple-system, sans-serif; font-size: 11px; padding: 2px;">
          <strong>${survey.roadCode}</strong>: ${survey.roadName}<br/>
          <span style="color:#64748b;">Lane: ${survey.lane}</span><br/>
          ${statusLabel}
        </div>`,
        { sticky: true }
      );

      // On Click of Corridor Polyline: Select road smoothly without colliding camera animations
      polyline.on('click', () => {
        onSelectRoad(survey.roadCode);
      });

      // Corridor Label Waypoint Pin for Selected or Drone-Surveyed Corridors
      if ((isCritical || isSelected) && !isPendingDrone) {
        const isMar1111 = survey.roadCode === 'MAR-1111' || survey.roadCode.includes('1111');
        const pinBg = (isMar1111 || isCritical)
          ? (isSelected ? '#b91c1c' : '#dc2626')
          : isSelected
          ? '#1a73e8'
          : '#d97706';

        // Clean, readable label text that fits comfortably
        const displayCode = survey.roadCode === 'MAR-1111'
          ? 'MAR-1111'
          : survey.roadCode.replace(/^NKDA-(AA[123]|CBD)-/, '');

        const labelText = isMar1111
          ? `MAR-1111 • Critical (4 Potholes)`
          : isCritical
          ? `${displayCode} • Critical (${survey.potholeCount} Potholes)`
          : isDroneOnly
          ? `${displayCode} • Drone Scanned (${survey.potholeCount} Potholes)`
          : `${displayCode} • ${survey.potholeCount} Potholes`;

        const startIcon = L.divIcon({
          className: 'corridor-start-pin',
          html: `
            <div style="
              background: ${pinBg};
              color: #ffffff;
              padding: 4px 10px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              border: 2px solid #ffffff;
              box-shadow: 0 4px 12px rgba(0,0,0,0.45);
              white-space: nowrap;
              width: max-content;
              display: inline-flex;
              align-items: center;
              gap: 6px;
              cursor: pointer;
              transform: translate(-50%, -50%);
              pointer-events: auto;
              z-index: ${isMar1111 ? 2000 : 1000};
            ">
              <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#ffffff; ${
                isCritical ? 'animation: pulse 1.5s infinite;' : ''
              }"></span>
              <span style="letter-spacing: 0.2px;">${labelText}</span>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        // Dedicated spaced positions to prevent overlapping:
        let pinPos: [number, number];
        if (isMar1111) {
          pinPos = [22.58150, 88.47280]; // Km 0+000 Start
        } else if (survey.roadCode.includes('ST112')) {
          pinPos = [22.5855, 88.4700]; // Shifted north-west along ST112 so it doesn't overlap MAR-1111
        } else {
          pinPos = corridorCoords[Math.floor(corridorCoords.length / 2)] || [
            survey.gpsLatitude,
            survey.gpsLongitude,
          ];
        }

        L.marker(pinPos, { icon: startIcon, zIndexOffset: isMar1111 ? 5000 : 1000 })
          .addTo(corridorsGroup)
          .on('click', () => {
            onSelectRoad(survey.roadCode);
          });
      }

      // 2. ONLY drop individual pothole markers for the SELECTED road!
      if (isSelected) {
        potholeMarkersRef.current = {};
        const roadPotholes = getCorridorPotholes(survey);
        const isMar1111 = survey.roadCode === 'MAR-1111' || survey.roadCode.includes('1111');

        // If Road MAR-1111: Render the certified 120m Carriageway Resurfacing Zone & Terminal Flags
        if (isMar1111) {
          const resurfaceTrack: [number, number][] = [
            [22.58150, 88.47280], // Km 0+000 Start
            [22.58168, 88.47288], // PH-01
            [22.58195, 88.47298], // PH-02
            [22.58232, 88.47312], // PH-03
            [22.58255, 88.47320], // PH-04
            [22.58270, 88.47328], // Km 0+120 End
          ];

          // 120m Resurfacing Zone Outer Pulsing Glow
          L.polyline(resurfaceTrack, {
            color: '#dc2626',
            weight: 16,
            opacity: 0.35,
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(potholesGroup);

          // 120m Resurfacing Core Carriageway Strip
          L.polyline(resurfaceTrack, {
            color: '#ef4444',
            weight: 8,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round',
          }).addTo(potholesGroup);

          // Km 0+000 Start Marker Flag (Red Critical Zone Flag)
          const startPin = L.divIcon({
            className: 'start-resurface-flag',
            html: `
              <div style="
                background: #b91c1c;
                color: #ffffff;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 800;
                font-family: monospace;
                border: 2px solid #ffffff;
                box-shadow: 0 3px 8px rgba(0,0,0,0.55);
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
              ">
                <span style="font-size: 12px;">🔴</span>
                <span>Km 0+000 START (120m Critical Resurfacing Zone)</span>
              </div>
            `,
            iconSize: [240, 24],
            iconAnchor: [120, 26],
          });
          L.marker([22.58150, 88.47280], { icon: startPin }).addTo(potholesGroup);

          // Km 0+120 End Marker Flag
          const endPin = L.divIcon({
            className: 'end-resurface-flag',
            html: `
              <div style="
                background: #dc2626;
                color: #ffffff;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 10px;
                font-weight: 800;
                font-family: monospace;
                border: 2px solid #ffffff;
                box-shadow: 0 3px 8px rgba(0,0,0,0.55);
                white-space: nowrap;
                display: flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
              ">
                <span style="font-size: 12px;">🏁</span>
                <span>Km 0+120 END (Biswa Bangla Convention Centre)</span>
              </div>
            `,
            iconSize: [270, 24],
            iconAnchor: [135, -4],
          });
          L.marker([22.58270, 88.47328], { icon: endPin }).addTo(potholesGroup);
        }

        roadPotholes.forEach((pth) => {
          const isPotholeActive = selectedPotholeId === pth.id;

          // High-Visibility Engineering Distress Beacon (Stable, No Shivering)
          const pthIcon = L.divIcon({
            className: 'pothole-distress-beacon',
            html: `
              <div style="
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transform: translate(-50%, -100%);
              ">
                <!-- Outer Static Halo (No ping animation to prevent shivering) -->
                <div style="
                  position: absolute;
                  top: 4px;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  width: 28px;
                  height: 28px;
                  border-radius: 50%;
                  background: rgba(220, 38, 38, 0.2);
                  border: 1.5px solid rgba(239, 68, 68, 0.5);
                  pointer-events: none;
                "></div>

                <!-- Main Distress Pill Badge -->
                <div style="
                  background: ${isPotholeActive ? '#991b1b' : '#dc2626'};
                  color: #ffffff;
                  padding: 4px 10px;
                  border-radius: 16px;
                  border: ${isPotholeActive ? '2.5px solid #facc15' : '2px solid #ffffff'};
                  box-shadow: 0 4px 12px rgba(0,0,0,0.6);
                  display: flex;
                  align-items: center;
                  gap: 5px;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace;
                  font-weight: 800;
                  font-size: 11px;
                  white-space: nowrap;
                  z-index: 20;
                ">
                  <span style="font-size: 12px;">⚠️</span>
                  <span>P${pth.potholeNumber}</span>
                  <span style="opacity: 0.6;">•</span>
                  <span style="color: #fef08a;">${pth.depthMm}mm</span>
                </div>

                <!-- Arrow Needle pointing precisely to the asphalt crater -->
                <div style="
                  width: 0;
                  height: 0;
                  border-left: 6px solid transparent;
                  border-right: 6px solid transparent;
                  border-top: 8px solid ${isPotholeActive ? '#991b1b' : '#dc2626'};
                  margin-top: -1px;
                  filter: drop-shadow(0 2px 2px rgba(0,0,0,0.35));
                  z-index: 19;
                "></div>

                <!-- Ground Touch Point -->
                <div style="
                  width: 7px;
                  height: 7px;
                  border-radius: 50%;
                  background: #ffffff;
                  border: 2px solid #dc2626;
                  margin-top: -3px;
                  z-index: 18;
                "></div>

                <!-- Permanent Chainage & Lane Indicator Tag -->
                <div style="
                  background: rgba(15, 23, 42, 0.95);
                  color: #f1f5f9;
                  padding: 1px 7px;
                  border-radius: 6px;
                  font-size: 9px;
                  font-family: monospace;
                  font-weight: 700;
                  margin-top: 3px;
                  border: 1px solid rgba(255, 255, 255, 0.3);
                  white-space: nowrap;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
                  z-index: 21;
                ">
                  ${pth.chainage} • Lane 1
                </div>
              </div>
            `,
            iconSize: [0, 0],
            iconAnchor: [0, 0],
          });

          const isPthActive = activePothole?.id === pth.id;
          const pthMarker = L.marker([pth.lat, pth.lng], {
            icon: pthIcon,
            zIndexOffset: isPthActive ? 9000 : 3000,
          }).addTo(potholesGroup);
          potholeMarkersRef.current[pth.id] = pthMarker;

          // Stable on-click without map shivering or jerky panTo
          pthMarker.on('click', () => {
            setIsDetailCardClosed(false);
            if (onSelectPothole) onSelectPothole(pth.id);
          });
        });
      }
    });
  }, [surveys, selectedRoadCode, filterSeverity, mapType]);

  // Fit All Critical Corridors
  const handleFitAllCritical = () => {
    if (!mapInstanceRef.current) return;
    const criticalSurveys = surveys.filter((s) => s.condition === 'Critical');
    if (criticalSurveys.length === 0) return;

    const bounds = L.latLngBounds(
      criticalSurveys.map((s) => [s.gpsLatitude, s.gpsLongitude] as [number, number])
    );
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 1.0 });
  };

  // Reset to Clean City Overview
  const handleResetOverview = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo(initialCenter, 13.5, { animate: true, duration: 0.8 });
    if (onClearSelection) onClearSelection();
  };

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${initialCenter[0]},${initialCenter[1]}`,
      '_blank'
    );
  };

  const criticalCount = surveys.filter((s) => s.condition === 'Critical').length;
  const selectedSurvey = surveys.find((s) => s.roadCode === selectedRoadCode);
  const selectedRoadPotholes = selectedSurvey ? getCorridorPotholes(selectedSurvey) : [];

  // Active pothole: defaults to selectedPotholeId or first pothole on corridor
  const activePothole: GisPothole | null =
    selectedRoadPotholes.find((p) => p.id === selectedPotholeId) ||
    (selectedRoadPotholes.length > 0 ? selectedRoadPotholes[0] : null);

  useEffect(() => {
    setIsDetailCardClosed(false);
  }, [selectedRoadCode]);

  // Smooth auto-focus camera on corridor selection (Single graceful transition, zero shaking)
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedRoadCode) return;
    const s = surveys.find((survey) => survey.roadCode === selectedRoadCode);
    if (!s) return;

    if (selectedRoadCode === 'MAR-1111' || selectedRoadCode.includes('1111')) {
      mapInstanceRef.current.flyTo([22.58210, 88.47305], 17.5, { animate: true, duration: 0.6 });
    } else {
      mapInstanceRef.current.flyTo([s.gpsLatitude, s.gpsLongitude], 15.5, {
        animate: true,
        duration: 0.6,
      });
    }

    const t = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize({ pan: false });
    }, 700);
    return () => clearTimeout(t);
  }, [selectedRoadCode, surveys]);

  return (
    <div className="w-full h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col relative min-h-[500px]">
      {/* Map Top Header Overlay */}
      <div className="px-4 py-3 bg-white/95 backdrop-blur-xs border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 z-10">
        <div>
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#1a73e8]" />
            <h3 className="text-sm font-bold text-slate-900">
              New Town Kolkata (NKDA) Road Network GIS Map
            </h3>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-[#ea4335] border border-red-200 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ea4335] animate-ping" />
              <span>{criticalCount} Critical Roads Identified</span>
            </span>
            {selectedRoadCode && (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-[#1a73e8] border border-blue-200">
                Active: {selectedRoadCode}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {selectedRoadCode
              ? `Inspecting potholes along ${selectedRoadCode}. Click any Pothole pin (P1–P4) for depth & telemetry.`
              : 'All critical road corridors are highlighted in red. Click any corridor to reveal its lane potholes and drone video feed.'}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Reset Overview / Clear Selection */}
          {selectedRoadCode ? (
            <button
              onClick={handleResetOverview}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded border border-slate-300 transition cursor-pointer flex items-center gap-1 shadow-xs"
              title="Clear selection and view full New Town map overview"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Overview</span>
            </button>
          ) : (
            <button
              onClick={handleFitAllCritical}
              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-[#ea4335] font-semibold text-xs rounded border border-red-200 transition cursor-pointer flex items-center gap-1 shadow-xs"
              title="Fit viewport to all critical road corridors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Fit Critical ({criticalCount})</span>
            </button>
          )}

          {/* Severity Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setFilterSeverity('all')}
              className={`px-2 py-1 rounded transition font-medium cursor-pointer ${
                filterSeverity === 'all'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterSeverity('critical')}
              className={`px-2 py-1 rounded transition font-medium cursor-pointer flex items-center gap-1 ${
                filterSeverity === 'critical'
                  ? 'bg-red-50 text-[#ea4335] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-[#ea4335]" />
              <span>Critical Only</span>
            </button>
          </div>

          {/* Map Layer Switcher: Street Map (Default) vs Satellite View */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setMapType('streets')}
              className={`px-3 py-1 rounded transition font-medium cursor-pointer flex items-center gap-1.5 ${
                mapType === 'streets'
                  ? 'bg-white text-[#1a73e8] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Standard street map view"
            >
              <MapPin className="w-3 h-3 text-[#1a73e8]" />
              <span>Street Map</span>
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-3 py-1 rounded transition font-medium cursor-pointer flex items-center gap-1.5 ${
                mapType === 'satellite'
                  ? 'bg-white text-[#1a73e8] font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Real high-resolution satellite hybrid imagery"
            >
              <Layers className="w-3 h-3 text-[#1a73e8]" />
              <span>Real Satellite</span>
            </button>
          </div>

          {/* External Google Maps Link */}
          <button
            onClick={openGoogleMaps}
            className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-300 transition cursor-pointer"
            title="Open in Google Maps"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          </button>
        </div>
      </div>

      {/* Leaflet Canvas */}
      <div className="relative flex-1 w-full min-h-[460px] h-full bg-[#f2efe9] overflow-hidden">
        <div ref={mapContainerRef} className="absolute inset-0 w-full h-full z-0" style={{ isolation: 'isolate' }} />

        {/* Legend Overlay Bottom-Left: Hidden when a road is selected so it never overlaps with pothole cards */}
        {!selectedRoadCode && (
          <div className="absolute bottom-4 left-4 z-[20] bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-slate-200 shadow-md text-xs space-y-1.5 font-sans">
            <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
              NKDA Corridor Health
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 rounded-full bg-[#ea4335]" />
              <span className="text-slate-700 font-medium">Critical Roads ({criticalCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 rounded-full bg-[#f59e0b]" />
              <span className="text-slate-600">Poor (&gt;25mm Rut)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-slate-600">Fair / Nominal</span>
            </div>
          </div>
        )}

        {/* Unified Pothole Telemetry & Quick Inspector HUD (Docked firmly in bottom-left, never overlapping the road or pothole pins) */}
        {selectedSurvey && selectedRoadPotholes.length > 0 && (
          isDetailCardClosed ? (
            <button
              onClick={() => setIsDetailCardClosed(false)}
              className="absolute bottom-4 left-4 z-[25] bg-white/95 backdrop-blur-md border border-slate-300 rounded-lg shadow-lg px-3 py-2 font-bold text-xs text-slate-800 flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <span>📍 {selectedSurvey.roadCode} Potholes ({selectedRoadPotholes.length})</span>
            </button>
          ) : activePothole && (
            <div className="absolute bottom-4 left-4 z-[25] bg-white/95 backdrop-blur-md border border-slate-300 rounded-xl shadow-2xl p-3 w-[295px] max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar space-y-2 font-sans">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600" />
                  <span className="font-extrabold text-xs text-slate-900">{selectedSurvey.roadCode}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-red-50 text-red-600 border border-red-200 rounded px-1.5 py-0.5 font-bold text-[10px]">
                    {selectedSurvey.condition} (20mm Depth)
                  </span>
                  <button
                    onClick={() => setIsDetailCardClosed(true)}
                    className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition leading-none text-xs font-bold"
                    title="Minimize inspector"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Integrated 4-Pothole Quick Selector Bar */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {selectedRoadPotholes.map((pth) => {
                  const isPthActive = activePothole.id === pth.id;
                  return (
                    <button
                      key={pth.id}
                      onClick={() => {
                        if (onSelectPothole) onSelectPothole(pth.id);
                      }}
                      className={`flex-1 py-1 px-1 rounded text-center transition cursor-pointer text-[10px] font-bold ${
                        isPthActive
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                      title={`Select Pothole #${pth.potholeNumber}`}
                    >
                      P{pth.potholeNumber} ({pth.depthMm}mm)
                    </button>
                  );
                })}
              </div>

              {/* Pothole Photo Thumbnail */}
              <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 relative">
                <img
                  src={activePothole.photoUrl || '/images/pothole_4.jpg'}
                  alt={`Pothole #${activePothole.potholeNumber}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/pothole_4.jpg';
                  }}
                />
                <span className="absolute top-1 left-1 bg-black/75 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                  P{activePothole.potholeNumber} • {activePothole.depthMm}mm Depth
                </span>
              </div>

              {/* Title & Location */}
              <div>
                <div className="font-bold text-xs text-slate-900 leading-tight">
                  Pothole #{activePothole.potholeNumber}: {activePothole.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  <strong className="text-slate-700">Location:</strong> {activePothole.chainage} • Lane 1
                </div>
              </div>

              {/* Telemetry Metrics Grid */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[11px] space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px]">Measured Depth:</span>
                  <span className="font-bold text-red-600 font-mono text-[11px]">{activePothole.depthMm} mm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px]">Distress Area:</span>
                  <span className="font-bold text-slate-900 font-mono text-[11px]">{activePothole.dimensions || '68cm × 68cm (0.465 m²)'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px]">Calculated Void Volume:</span>
                  <span className="font-bold text-slate-900 font-mono text-[11px]">{((activePothole.volumeLiters || 9.3) / 1000).toFixed(4)} m³</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-[10px]">Photogrammetry:</span>
                  <span className="font-bold text-emerald-600 font-mono text-[11px]">{activePothole.confidence || 98.4}% Precision</span>
                </div>
              </div>

              {/* Actions & Resurfacing Segment Link */}
              <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[10px]">
                <button
                  onClick={() => {
                    if (mapInstanceRef.current && selectedRoadPotholes.length > 0) {
                      const bounds = L.latLngBounds(selectedRoadPotholes.map((p) => [p.lat, p.lng]));
                      mapInstanceRef.current.fitBounds(bounds.pad(0.35), {
                        animate: true,
                        duration: 0.5,
                      });
                    }
                  }}
                  className="font-bold text-[#1a73e8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>🔍 Focus 120m Resurfacing Segment</span>
                </button>
                <span className="font-mono text-slate-500">Ch: 0+000 to 0+120</span>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
