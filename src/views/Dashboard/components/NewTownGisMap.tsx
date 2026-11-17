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
  const [isQuickLocatorMinimized, setIsQuickLocatorMinimized] = useState<boolean>(false);
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
      keepBuffer: 3,
      updateWhenZooming: false,
    });

    const activeTileLayer = mapType === 'satellite' ? satelliteTiles : streetTiles;
    activeTileLayer.addTo(map);
    tileLayerRef.current = activeTileLayer;

    // Layer groups for corridors and pothole markers
    const corridorsGroup = L.layerGroup().addTo(map);
    const potholesGroup = L.layerGroup().addTo(map);
    corridorsLayerGroupRef.current = corridorsGroup;
    potholesLayerGroupRef.current = potholesGroup;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
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
          });

    newLayer.addTo(map);
    tileLayerRef.current = newLayer;
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

      // On Click of Corridor Polyline: Select road, zoom in, and drop its potholes
      polyline.on('click', () => {
        onSelectRoad(survey.roadCode);
        map.flyTo([survey.gpsLatitude, survey.gpsLongitude], 15, { animate: true, duration: 0.8 });
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
            map.flyTo(pinPos, 15, { animate: true, duration: 0.8 });
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

  // Track the container pixel coordinate of the active clicked pothole pin
  const [potholePixel, setPotholePixel] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    let rafId: number | null = null;

    const updatePixel = () => {
      if (!mapInstanceRef.current || !activePothole) {
        setPotholePixel(null);
        return;
      }
      try {
        const pt = mapInstanceRef.current.latLngToContainerPoint([activePothole.lat, activePothole.lng]);
        setPotholePixel({ x: pt.x, y: pt.y });
      } catch (e) {
        setPotholePixel(null);
      }
    };

    const scheduleUpdate = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updatePixel();
        rafId = null;
      });
    };

    updatePixel();

    const map = mapInstanceRef.current;
    if (map) {
      map.on('move', scheduleUpdate);
      map.on('zoom', scheduleUpdate);
      map.on('zoomend', updatePixel);
      map.on('moveend', updatePixel);
      map.on('resize', updatePixel);
      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        map.off('move', scheduleUpdate);
        map.off('zoom', scheduleUpdate);
        map.off('zoomend', updatePixel);
        map.off('moveend', updatePixel);
        map.off('resize', updatePixel);
      };
    }
  }, [activePothole?.id, selectedRoadCode]);

  // Compute clean side-by-side positioning beside the clicked pothole number without ever obscuring the pin
  const getCardsPositionStyle = (): React.CSSProperties => {
    if (!potholePixel || !mapContainerRef.current) {
      return { bottom: '16px', right: '16px', position: 'absolute', zIndex: 30 };
    }

    const mapWidth = mapContainerRef.current.clientWidth || 800;
    const mapHeight = mapContainerRef.current.clientHeight || 600;
    const cardsWidth = isQuickLocatorMinimized ? 300 : 585;
    const cardsHeight = 350;

    let left: number;
    let top: number;

    // 1. Can we place cleanly to the RIGHT of the clicked pin?
    if (potholePixel.x + 35 + cardsWidth <= mapWidth - 16) {
      left = potholePixel.x + 35;
      top = Math.max(65, Math.min(potholePixel.y - 110, mapHeight - cardsHeight - 16));
    }
    // 2. Can we place cleanly to the LEFT of the clicked pin?
    else if (potholePixel.x - 35 - cardsWidth >= 16) {
      left = potholePixel.x - 35 - cardsWidth;
      top = Math.max(65, Math.min(potholePixel.y - 110, mapHeight - cardsHeight - 16));
    }
    // 3. If side-by-side doesn't fit horizontally, place ABOVE the pin so the pin is 100% visible
    else if (potholePixel.y - 35 - cardsHeight >= 65) {
      top = potholePixel.y - 35 - cardsHeight;
      left = Math.max(16, Math.min(potholePixel.x - cardsWidth / 2, mapWidth - cardsWidth - 16));
    }
    // 4. Otherwise place BELOW the pin
    else {
      top = potholePixel.y + 35;
      left = Math.max(16, Math.min(potholePixel.x - cardsWidth / 2, mapWidth - cardsWidth - 16));
    }

    return {
      position: 'absolute',
      left: `${left}px`,
      top: `${top}px`,
      zIndex: 30,
    };
  };

  useEffect(() => {
    setIsDetailCardClosed(false);
  }, [selectedRoadCode]);

  // Auto-focus camera on corridor selection
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedRoadCode) return;
    const s = surveys.find((survey) => survey.roadCode === selectedRoadCode);
    if (!s) return;

    if (selectedRoadCode === 'MAR-1111' || selectedRoadCode.includes('1111')) {
      mapInstanceRef.current.flyTo([22.58210, 88.47305], 17.5, { animate: true, duration: 0.8 });
    } else {
      mapInstanceRef.current.flyTo([s.gpsLatitude, s.gpsLongitude], 15.5, {
        animate: true,
        duration: 0.8,
      });
    }
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
      <div className="relative flex-1 w-full min-h-[460px]">
        <div ref={mapContainerRef} className="w-full h-full z-0" style={{ isolation: 'isolate' }} />

        {/* Legend Overlay Bottom-Left */}
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-slate-200 shadow-md text-xs space-y-1.5 font-sans">
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
          {selectedRoadCode && (
            <div className="flex items-center gap-2 pt-1 border-t border-slate-200 text-[10px] text-slate-700 font-semibold">
              <span className="w-3.5 h-3.5 rounded-full bg-[#ea4335] text-white flex items-center justify-center font-bold font-mono text-[8px]">
                P1
              </span>
              <span>Potholes on Selected Road</span>
            </div>
          )}
        </div>

        {/* Side-by-Side Floating HUD: Positioned cleanly beside the clicked pothole pin */}
        {selectedSurvey && selectedRoadPotholes.length > 0 && (
          <div
            style={getCardsPositionStyle()}
            className="flex flex-row items-start gap-3 pointer-events-none will-change-[left,top]"
          >
            {/* CARD 2: Selected Pothole Detail Card (Image 2) */}
            {activePothole && !isDetailCardClosed && (
              <div className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-xl shadow-2xl p-3 w-[285px] space-y-2 font-sans pointer-events-auto">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-extrabold text-xs text-slate-900">{selectedSurvey.roadCode}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-red-50 text-red-600 border border-red-200 rounded px-1.5 py-0.5 font-bold text-[10px]">
                      {selectedSurvey.condition} (20mm Depth)
                    </span>
                    <button
                      onClick={() => {
                        setIsDetailCardClosed(true);
                        if (onSelectPothole) onSelectPothole(undefined as any);
                      }}
                      className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer transition leading-none text-xs font-bold"
                      title="Close details"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Pothole Photo Thumbnail */}
                <div className="w-full h-24 rounded-lg overflow-hidden border border-slate-200 bg-slate-900 relative">
                  <img
                    src={activePothole.photoUrl || 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_pothole.jpg'}
                    alt={`Pothole #${activePothole.potholeNumber}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_pothole.jpg';
                    }}
                  />
                  <span className="absolute top-1 left-1 bg-black/75 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                    P{activePothole.potholeNumber} • 20mm
                  </span>
                </div>

                {/* Title & Location */}
                <div>
                  <div className="font-bold text-xs text-slate-900 leading-tight">
                    Pothole #{activePothole.potholeNumber}: {activePothole.title}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    <strong className="text-slate-700">Location:</strong> {activePothole.chainage} • Lane 1 (Slow / Heavy Vehicles)
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

                <div className="text-[9px] font-mono text-slate-500">
                  GPS: {activePothole.lat.toFixed(5)}°N, {activePothole.lng.toFixed(5)}°E
                </div>
              </div>
            )}

            {/* CARD 1: Quick Locator (Image 1) */}
            {isQuickLocatorMinimized ? (
              <button
                onClick={() => setIsQuickLocatorMinimized(false)}
                className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-lg shadow-lg px-3 py-1.5 font-bold text-xs text-slate-800 flex items-center gap-2 hover:bg-slate-50 transition cursor-pointer pointer-events-auto"
              >
                <span className="w-2 h-2 rounded-full bg-red-600" />
                <span>📍 {selectedSurvey.roadCode} Quick Locator ({selectedRoadPotholes.length})</span>
              </button>
            ) : (
              <div className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-xl shadow-2xl p-3 w-[285px] space-y-2 font-sans pointer-events-auto">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                    <span className="font-bold text-xs text-slate-900">
                      {selectedSurvey.roadCode} Quick Locator
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">
                      {selectedRoadPotholes.length} Potholes
                    </span>
                    <button
                      onClick={() => setIsQuickLocatorMinimized(true)}
                      className="text-slate-400 hover:text-slate-700 px-1 rounded text-xs font-bold leading-none cursor-pointer"
                      title="Minimize Quick Locator"
                    >
                      −
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 leading-tight">
                  Click any verified pothole to view on asphalt carriageway:
                </p>

                <div className="grid grid-cols-2 gap-1.5">
                  {selectedRoadPotholes.map((pth) => {
                    const isSelected = activePothole?.id === pth.id && !isDetailCardClosed;
                    return (
                      <button
                        key={pth.id}
                        onClick={() => {
                          setIsDetailCardClosed(false);
                          if (onSelectPothole) onSelectPothole(pth.id);
                        }}
                        className={`p-1.5 border rounded text-left transition cursor-pointer flex flex-col ${
                          isSelected
                            ? 'bg-red-50 border-red-500 ring-2 ring-red-400'
                            : 'bg-slate-50 hover:bg-red-50/70 border-slate-200 hover:border-red-300'
                        }`}
                      >
                        <span className="font-bold text-xs text-red-600 flex items-center justify-between">
                          <span>⚠️ P{pth.potholeNumber}</span>
                          <span className="text-[10px] text-slate-500 font-mono font-normal">
                            {pth.depthMm}mm
                          </span>
                        </span>
                        <span className="text-[9px] font-mono text-slate-600 truncate">{pth.chainage}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1.5 border-t border-slate-200 flex items-center justify-between text-[10px]">
                  <button
                    onClick={() => {
                      if (mapInstanceRef.current) {
                        if (selectedRoadPotholes.length > 0) {
                          const bounds = L.latLngBounds(selectedRoadPotholes.map((p) => [p.lat, p.lng]));
                          mapInstanceRef.current.fitBounds(bounds.pad(0.35), {
                            animate: true,
                            duration: 0.6,
                          });
                        } else {
                          mapInstanceRef.current.setView([22.58210, 88.47305], 18, { animate: true });
                        }
                      }
                    }}
                    className="font-bold text-[#1a73e8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>🔍 Zoom 120m Resurfacing Segment</span>
                  </button>
                  <span className="font-mono text-slate-500">Ch: 0+000 to 0+120</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
