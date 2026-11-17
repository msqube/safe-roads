import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Flame,
  Camera,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  Video,
} from 'lucide-react';
import { GisPothole, getCorridorPotholes } from '../../../services/newTownGisData';
import { REAL_ROAD_PHOTOS, getCorridorOrthophotos } from '../../../services/mockSurveyData';

interface DroneVideoPlayerProps {
  roadCode: string;
  roadName: string;
  potholeCount?: number;
  potholes?: GisPothole[];
  roadType?: string;
  gpsLat?: number;
  gpsLng?: number;
  onPotholeDetected?: (potholeIndex: number) => void;
}

export const DroneVideoPlayer: React.FC<DroneVideoPlayerProps> = ({
  roadCode,
  roadName,
  potholeCount,
  potholes: propPotholes,
  roadType = 'Major Arterial Road (6-Lane)',
  gpsLat = 22.58210,
  gpsLng = 88.47305,
  onPotholeDetected,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState<'video' | 'orthophoto' | 'thermal'>('video');
  const [currentFrame, setCurrentFrame] = useState(0);
  const [activeDefectIndex, setActiveDefectIndex] = useState<number>(0);
  const [detectedPothole, setDetectedPothole] = useState<string | null>(null);

  // Guarantee verified potholes for the road
  const activePotholesList: GisPothole[] = useMemo(() => {
    if (propPotholes && propPotholes.length > 0) return propPotholes;
    const defaults = getCorridorPotholes(roadCode);
    return defaults.length > 0 ? defaults : [];
  }, [propPotholes, roadCode]);

  const orthophotos = getCorridorOrthophotos(roadCode);
  const isMar1111 = roadCode === 'MAR-1111' || roadCode.includes('1111');

  // Effective GPS coordinates (guarantee Biswa Bangla Sarani for MAR-1111)
  const effectiveGpsLat = isMar1111 ? 22.58210 : gpsLat;
  const effectiveGpsLng = isMar1111 ? 88.47305 : gpsLng;

  // Mapped potholes for animation
  const mappedPotholes = useMemo(() => {
    return activePotholesList.map((p, idx) => {
      const potholeDepth = isMar1111 ? 20 : p.depthMm;
      return {
        id: p.potholeNumber || idx + 1,
        depth: potholeDepth,
        yOffset: 90 + idx * 135,
        xRatio: 0.35 + ((idx * 0.18 + (potholeDepth % 5) * 0.04) % 0.38),
        width: Math.min(48, Math.max(32, Math.round(potholeDepth * 1.8))),
        height: Math.min(36, Math.max(24, Math.round(potholeDepth * 1.3))),
        label: `PH-0${p.potholeNumber || idx + 1} (${potholeDepth}mm)`,
        chainage: p.chainage,
        title: p.title,
        photoUrl: p.photoUrl || REAL_ROAD_PHOTOS.potholePavement1,
        dimensions: p.dimensions || `${potholeDepth}mm depth`,
        volumeLiters: p.volumeLiters || 9.3,
        layerDamage: p.layerDamage || 'Bituminous wearing course depression',
      };
    });
  }, [activePotholesList, isMar1111]);

  // Current chainage calculation based on frame (0 to 600 frames = Km 0+000 to Km 0+120)
  const currentChainageMeters = Math.round((currentFrame / 600) * 120);
  const currentChainageFormatted = `Km 0+${String(currentChainageMeters).padStart(3, '0')}`;

  // High-fidelity asphalt canvas rendering loop
  useEffect(() => {
    if (viewMode !== 'video' && viewMode !== 'thermal') return;

    let animId: number;
    let frame = currentFrame;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const is6Lane = roadType.includes('6-Lane') || isMar1111;

    const render = () => {
      if (isPlaying) {
        frame = (frame + 1) % 600;
        setCurrentFrame(frame);
      }

      const w = canvas.width;
      const h = canvas.height;

      // Realistic asphalt road rendering
      const isThermalMode = viewMode === 'thermal';

      if (!isThermalMode) {
        // 1. Realistic Weathered Asphalt Base
        const bgGrad = ctx.createLinearGradient(0, 0, w, 0);
        bgGrad.addColorStop(0, '#1e2124');
        bgGrad.addColorStop(0.12, '#282a2e');
        bgGrad.addColorStop(0.48, '#2d3035');
        bgGrad.addColorStop(0.88, '#282a2e');
        bgGrad.addColorStop(1, '#1e2124');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Asphalt aggregate texture grain simulation
        ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
        for (let gy = 0; gy < h; gy += 16) {
          ctx.fillRect(35, gy, w - 70, 8);
        }

        // Wheelpath tire wear tracks (subtle darker sheen where vehicles travel)
        ctx.fillStyle = 'rgba(15, 17, 20, 0.35)';
        ctx.fillRect(w * 0.22, 0, 48, h);
        ctx.fillRect(w * 0.44, 0, 48, h);
        ctx.fillRect(w * 0.68, 0, 48, h);

        // Concrete Kerb & Drainage Gutters (Sides)
        ctx.fillStyle = '#475569';
        ctx.fillRect(0, 0, 28, h);
        ctx.fillRect(w - 28, 0, 28, h);

        // Kerb bevel edge
        ctx.fillStyle = '#64748b';
        ctx.fillRect(28, 0, 4, h);
        ctx.fillRect(w - 32, 0, 4, h);

        // Stormwater Grates along edge
        ctx.fillStyle = '#1e293b';
        const grateY = (frame * 3.5) % 180;
        for (let gy = -180; gy < h + 180; gy += 180) {
          ctx.fillRect(6, gy + grateY, 16, 28);
          ctx.fillRect(w - 22, gy + grateY, 16, 28);
        }

        // Solid White Outer Carriageway Edge Markings
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.moveTo(38, 0);
        ctx.lineTo(38, h);
        ctx.moveTo(w - 38, 0);
        ctx.lineTo(w - 38, h);
        ctx.stroke();

        // White Lane Dashed Markings
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 3.5;
        ctx.setLineDash([26, 22]);
        ctx.lineDashOffset = -frame * 3.5;
        ctx.beginPath();

        if (is6Lane) {
          ctx.moveTo(w * 0.27, 0);
          ctx.lineTo(w * 0.27, h);
          ctx.moveTo(w * 0.45, 0);
          ctx.lineTo(w * 0.45, h);
          ctx.moveTo(w * 0.73, 0);
          ctx.lineTo(w * 0.73, h);
        } else {
          ctx.moveTo(w * 0.5, 0);
          ctx.lineTo(w * 0.5, h);
        }
        ctx.stroke();

        // Yellow Solid Center Median / Divider
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 5;
        ctx.setLineDash([]);
        ctx.beginPath();
        const medianX = is6Lane ? w * 0.58 : w * 0.5;
        ctx.moveTo(medianX, 0);
        ctx.lineTo(medianX, h);
        ctx.stroke();
      } else {
        // FLIR Radiometric False-Color Thermal Mode
        const thermalGrad = ctx.createLinearGradient(0, 0, w, 0);
        thermalGrad.addColorStop(0, '#10002b');
        thermalGrad.addColorStop(0.3, '#3c096c');
        thermalGrad.addColorStop(0.5, '#5a189a');
        thermalGrad.addColorStop(0.7, '#7b2cbf');
        thermalGrad.addColorStop(1, '#10002b');
        ctx.fillStyle = thermalGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Draw Potholes that move along the carriageway with authentic geometry
      mappedPotholes.forEach((p, idx) => {
        const potholeY = ((p.yOffset + frame * 3.5) % (h + 120)) - 60;
        const potholeX = w * p.xRatio;

        if (potholeY > -50 && potholeY < h + 50) {
          ctx.save();
          ctx.translate(potholeX, potholeY);

          if (!isThermalMode) {
            // Realistic Asphalt Pothole:
            // 1. Spalled cracked outer fracture rim
            ctx.fillStyle = 'rgba(20, 22, 25, 0.7)';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.width + 6, p.height + 4, 0.1, 0, Math.PI * 2);
            ctx.fill();

            // 2. Deep pothole crater base (20mm depth)
            ctx.fillStyle = '#0a0c0e';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.width, p.height, 0.05, 0, Math.PI * 2);
            ctx.fill();

            // 3. Exposed crushed aggregate stones inside void
            ctx.fillStyle = '#4a5059';
            ctx.beginPath();
            ctx.arc(-8, -4, 4, 0, Math.PI * 2);
            ctx.arc(6, 3, 5, 0, Math.PI * 2);
            ctx.arc(-2, 6, 3.5, 0, Math.PI * 2);
            ctx.arc(10, -5, 3, 0, Math.PI * 2);
            ctx.fill();

            // 4. Highlight on sunny upper edge of pothole
            ctx.strokeStyle = 'rgba(200, 210, 220, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(0, 0, p.width, Math.PI * 1.1, Math.PI * 1.9);
            ctx.stroke();

            // 5. Radiating fatigue crack lines
            ctx.strokeStyle = 'rgba(10, 12, 14, 0.8)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.width, 0);
            ctx.lineTo(p.width + 12, 4);
            ctx.moveTo(-p.width, 0);
            ctx.lineTo(-p.width - 14, -6);
            ctx.stroke();
          } else {
            // Thermal mode: Water moisture cool spot in depression
            ctx.fillStyle = '#00f5d4';
            ctx.beginPath();
            ctx.ellipse(0, 0, p.width, p.height, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ff007f';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Engineering AI Bounding Box & HUD tracking (when in camera focus area)
          const distToCenter = Math.abs(potholeY - h * 0.5);
          if (distToCenter < 140) {
            // High-precision bounding box
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 4]);
            ctx.strokeRect(-p.width - 10, -p.height - 10, (p.width + 10) * 2, (p.height + 10) * 2);
            ctx.setLineDash([]);

            // Corner crosshairs on bounding box
            const bX = -p.width - 10;
            const bY = -p.height - 10;
            const bW = (p.width + 10) * 2;
            const bH = (p.height + 10) * 2;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            // TL
            ctx.moveTo(bX, bY + 8);
            ctx.lineTo(bX, bY);
            ctx.lineTo(bX + 8, bY);
            // TR
            ctx.moveTo(bX + bW - 8, bY);
            ctx.lineTo(bX + bW, bY);
            ctx.lineTo(bX + bW, bY + 8);
            // BL
            ctx.moveTo(bX, bY + bH - 8);
            ctx.lineTo(bX, bY + bH);
            ctx.lineTo(bX + 8, bY + bH);
            // BR
            ctx.moveTo(bX + bW - 8, bY + bH);
            ctx.lineTo(bX + bW, bY + bH);
            ctx.lineTo(bX + bW, bY + bH - 8);
            ctx.stroke();

            // Engineering Tag Box
            ctx.fillStyle = 'rgba(234, 67, 53, 0.95)';
            ctx.fillRect(bX, bY - 22, 160, 20);
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px "Roboto Mono", monospace';
            ctx.fillText(`${p.label} • ${p.chainage}`, bX + 6, bY - 8);

            if (distToCenter < 40) {
              setDetectedPothole(
                `${p.title}: ${p.depth}mm Depth • Area 0.465 m² • ${p.chainage}`
              );
              setActiveDefectIndex(idx);
            }
          }

          ctx.restore();
        }
      });

      // Drone Camera Reticle & Optical Centering Crosshair
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, 48, 0, Math.PI * 2);
      ctx.moveTo(w * 0.5 - 70, h * 0.5);
      ctx.lineTo(w * 0.5 + 70, h * 0.5);
      ctx.moveTo(w * 0.5, h * 0.5 - 70);
      ctx.lineTo(w * 0.5, h * 0.5 + 70);
      ctx.stroke();
      ctx.setLineDash([]);

      // Flight Survey Frame Border Brackets
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      const bLen = 22;
      const m = 18;
      ctx.beginPath();
      // TL
      ctx.moveTo(m, m + bLen);
      ctx.lineTo(m, m);
      ctx.lineTo(m + bLen, m);
      // TR
      ctx.moveTo(w - m - bLen, m);
      ctx.lineTo(w - m, m);
      ctx.lineTo(w - m, m + bLen);
      // BL
      ctx.moveTo(m, h - m - bLen);
      ctx.lineTo(m, h - m);
      ctx.lineTo(m + bLen, h - m);
      // BR
      ctx.moveTo(w - m - bLen, h - m);
      ctx.lineTo(w - m, h - m);
      ctx.lineTo(w - m, h - m - bLen);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, viewMode, roadCode, roadType, isMar1111, mappedPotholes]);

  const activePothole = mappedPotholes[activeDefectIndex] || mappedPotholes[0];

  return (
    <div className="w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-lg flex flex-col">
      {/* 1. Professional Flight Survey Header */}
      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8] animate-pulse" />
          <div>
            <span className="font-bold text-white tracking-wide uppercase">
              {roadCode} • Aerial Photogrammetry Survey Recording
            </span>
            <span className="ml-2 text-[10px] font-mono text-slate-400">
              Corridor Pass: 120m Segment
            </span>
          </div>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 gap-1 text-[11px]">
          <button
            onClick={() => setViewMode('video')}
            className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition flex items-center gap-1.5 ${
              viewMode === 'video'
                ? 'bg-[#1a73e8] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Aerial Video Pass</span>
          </button>

          <button
            onClick={() => setViewMode('orthophoto')}
            className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition flex items-center gap-1.5 ${
              viewMode === 'orthophoto'
                ? 'bg-[#1a73e8] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-blue-300" />
            <span>4K Orthophoto Stills</span>
          </button>

          <button
            onClick={() => setViewMode('thermal')}
            className={`px-2.5 py-1 rounded font-semibold cursor-pointer transition flex items-center gap-1.5 ${
              viewMode === 'thermal'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>FLIR Thermal IR</span>
          </button>
        </div>
      </div>

      {/* 2. Main Viewport */}
      {viewMode === 'orthophoto' ? (
        /* Orthophoto Stills Mode: Photographic high-res drone captures */
        <div className="p-4 bg-slate-950 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Top-Down Orthophoto */}
            <div className="md:col-span-7 bg-black rounded-lg overflow-hidden border border-slate-800 relative group aspect-[4/3]">
              <img
                src={activePothole?.photoUrl || orthophotos.topDown}
                alt={`Drone Top-down orthophoto ${roadCode}`}
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-xs px-2.5 py-1.5 rounded border border-slate-700 text-[11px] font-mono text-white">
                <span className="font-bold text-red-400">DEFECT INSPECTION: {activePothole?.label}</span>
                <div className="text-[10px] text-slate-400">
                  Chainage: {activePothole?.chainage} • Sensor: Zenmuse P1 (1.2 cm/px)
                </div>
              </div>
              <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-slate-300">
                Depth: <strong className="text-red-400">{activePothole?.depth} mm</strong> | Volume:{' '}
                <strong className="text-white">{isMar1111 ? '0.0093 m³' : `${((activePothole?.volumeLiters || 9.3) / 1000).toFixed(4)} m³`}</strong>
              </div>
            </div>

            {/* Oblique Pavement & Distress Analysis */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-3 bg-slate-900 p-4 rounded-lg border border-slate-800">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {activePothole?.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-950 text-red-400 border border-red-800">
                    Depth: {activePothole?.depth} mm
                  </span>
                </div>

                <div className="relative aspect-video rounded overflow-hidden border border-slate-700">
                  <img
                    src={orthophotos.oblique || REAL_ROAD_PHOTOS.potholePavement1}
                    alt="Oblique pavement view"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1.5 left-2 text-[10px] font-mono bg-black/80 px-1.5 py-0.5 rounded text-slate-300">
                    Oblique Pavement Photogrammetry
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 space-y-1.5 text-xs">
                  <div className="text-slate-400 text-[11px]">Layer Failure Analysis:</div>
                  <div className="font-medium text-slate-200 text-xs">
                    {activePothole?.layerDamage}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
                    <div className="text-slate-400">
                      Dimensions: <span className="text-white font-bold">{activePothole?.dimensions}</span>
                    </div>
                    <div className="text-slate-400">
                      Void Volume: <span className="text-white font-bold">{isMar1111 ? '0.0093 m³' : `${((activePothole?.volumeLiters || 9.3) / 1000).toFixed(4)} m³`}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Selector buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800">
                {mappedPotholes.map((pth, idx) => (
                  <button
                    key={pth.id}
                    onClick={() => setActiveDefectIndex(idx)}
                    className={`py-1.5 px-2 rounded text-center text-xs font-mono font-bold cursor-pointer transition ${
                      activeDefectIndex === idx
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    PH-0{pth.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Aerial Video / Thermal Canvas Viewport */
        <div className="relative w-full aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={640}
            height={400}
            className="w-full h-full object-cover"
          />

          {/* Telemetry HUD Top-Left */}
          <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-xs px-3 py-2 rounded-lg border border-slate-700 text-[11px] font-mono text-slate-300 space-y-1 pointer-events-none max-w-[320px] shadow-lg">
            <div className="text-white font-bold truncate flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{roadCode} • Biswa Bangla Sarani</span>
            </div>
            <div className="text-[10px] text-slate-400">
              CHAINAGE PROGRESSION:{' '}
              <span className="text-amber-400 font-bold">{currentChainageFormatted}</span> / Km 0+120
            </div>
            <div className="text-[10px] text-slate-400">
              GPS: <span className="text-blue-300">{effectiveGpsLat.toFixed(5)}°N, {effectiveGpsLng.toFixed(5)}°E</span>
            </div>
            <div className="text-[9px] text-slate-400">
              ALT: 35.0m AGL | GSD: 1.2 cm/px | SPEED: 18.0 km/h
            </div>
          </div>

          {/* Active Defect Detection HUD Bottom-Left */}
          <div className="absolute bottom-3 left-3 bg-slate-950/90 backdrop-blur-xs px-3 py-2 rounded-lg border border-red-700 text-xs font-mono text-white flex items-center gap-2 pointer-events-none shadow-xl max-w-[420px]">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
            <div className="truncate">
              <span className="font-bold text-red-400 block truncate">
                {detectedPothole || `Corridor Scanning: ${mappedPotholes.length} Verified Potholes (20mm depth)`}
              </span>
              <span className="text-[10px] text-slate-400">
                Photogrammetry AI Bounding Boxes Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Flight Video Scrub & Pothole Navigation Bar */}
      <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          {viewMode !== 'orthophoto' && (
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded cursor-pointer transition shadow-xs"
              title={isPlaying ? 'Pause Feed' : 'Resume Flight'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          {viewMode !== 'orthophoto' && (
            <button
              onClick={() => setCurrentFrame(0)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer transition"
              title="Restart 120m Corridor Pass"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <div className="text-[11px] text-slate-400 font-mono ml-2">
            Segment: <strong className="text-white">{currentChainageFormatted}</strong> (120m Resurfacing)
          </div>
        </div>

        {/* Pothole Jump Buttons with exact 20mm verified data */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Verified Potholes:</span>
          {mappedPotholes.map((pth, idx) => (
            <button
              key={pth.id}
              onClick={() => {
                setCurrentFrame(idx * 135 + 25);
                setActiveDefectIndex(idx);
                if (onPotholeDetected) onPotholeDetected(pth.id);
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold border transition cursor-pointer flex items-center gap-1 ${
                activeDefectIndex === idx
                  ? 'bg-red-950 text-red-300 border-red-500 shadow-xs'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <span>PH-0{pth.id}</span>
              <span className="text-[10px] text-red-400 font-normal">({pth.depth}mm)</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
