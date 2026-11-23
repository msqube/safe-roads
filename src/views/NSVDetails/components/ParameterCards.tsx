import React, { useState } from 'react';
import {
  Activity,
  Layers,
  AlertCircle,
  Gauge,
  Compass,
  TrendingDown,
  Eye,
  Maximize2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { NSVRoadDetails } from '../../../models/nsvModels';
import { generateRoughnessProfileSvg } from '../../../services/mockSurveyData';
import { GenericModal } from '../../../common/GenericModal';

interface ParameterCardsProps {
  details: NSVRoadDetails;
  onJumpToDefect?: (targetDefect: 'cracking' | 'potholes') => void;
}

export const ParameterCards: React.FC<ParameterCardsProps> = ({ details, onJumpToDefect }) => {
  const { roughness, rutDepth, cracking, potholes, texture, geometry } = details;
  const [activeDefectModal, setActiveDefectModal] = useState<'cracking' | 'potholes' | null>(null);

  const roughnessImage = generateRoughnessProfileSvg(details.roadCode, roughness.iriAverage);

  return (
    <div className="space-y-4">
      {/* Materials Used to Build Road Breakdown */}
      {details.roadCode.includes('1111') && (
        <div className="p-4 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-200 rounded-xl space-y-3 text-xs shadow-sm font-sans">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Materials Used to Build Road (Flexible Bituminous Pavement):</span>
            </span>
            <span className="text-[10px] text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200 font-semibold tabular-nums">
              MoRTH Section 500 / IRC:37 Pavement Design
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px]">
            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="text-red-700 font-bold block text-[10px] uppercase">1. Wearing Course (40mm)</span>
              <p className="text-slate-800 font-semibold">Bituminous Concrete (BC Grade-1)</p>
              <p className="text-slate-500 text-[10px]">With PMB-40 Polymer Modified Bitumen for high shear resistance</p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="text-amber-700 font-bold block text-[10px] uppercase">2. Binder Course (50mm)</span>
              <p className="text-slate-800 font-semibold">Dense Bituminous Macadam (DBM-II)</p>
              <p className="text-slate-500 text-[10px]">VG-30/VG-40 heavy axle load distribution across wheelpaths</p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="text-blue-700 font-bold block text-[10px] uppercase">3. Base Course (250mm)</span>
              <p className="text-slate-800 font-semibold">Wet Mix Macadam (WMM Base)</p>
              <p className="text-slate-500 text-[10px]">Crushed graded aggregate mechanically compacted at OMC</p>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1">
              <span className="text-emerald-700 font-bold block text-[10px] uppercase">4. Sub-Base (200mm)</span>
              <p className="text-slate-800 font-semibold">Granular Sub-Base (GSB Grade-I)</p>
              <p className="text-slate-500 text-[10px]">Interlayer drainage over subgrade + RS-1 Tack Coat (0.25 kg/m²)</p>
            </div>
          </div>
        </div>
      )}

      {/* Parameter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* 1. Roughness (Shows image of that road roughness) - Standard Padding p-4 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#1a73e8]" />
                <h4 className="font-semibold text-slate-900 text-sm">Roughness (IRI Profile)</h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-[#1a73e8] border border-blue-200">
                {roughness.comfortClass}
              </span>
            </div>

            {/* Road Roughness Elevation Waveform Image */}
            <div className="mt-2.5 rounded-md overflow-hidden border border-slate-200 bg-white">
              <img
                src={roughnessImage}
                alt={`Roughness profile graph for ${details.roadCode}`}
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mt-3">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Average IRI</span>
                <div className="text-base font-bold tabular-nums text-slate-900">{roughness.iriAverage} m/km</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Ride Quality</span>
                <div className="text-base font-bold tabular-nums text-slate-900">{roughness.rideQualityIndex} / 5.0</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Left Wheelpath</span>
                <div className="font-medium tabular-nums text-slate-800">{roughness.iriLeft} m/km</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Right Wheelpath</span>
                <div className="font-medium tabular-nums text-slate-800">{roughness.iriRight} m/km</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            Bump Integrator: <span className="font-bold tabular-nums text-slate-800">{roughness.bumpIntegrator} mm/km</span> (IRC Class-I)
          </div>
        </div>

        {/* 2. Rut Depth - Standard Padding p-4 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#fbbc04]" />
                <h4 className="font-semibold text-slate-900 text-sm">Rut Depth</h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-[#b06000] border border-[#fbbc04]/40">
                {rutDepth.rutSeverity}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mt-2.5">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Avg Rut Depth</span>
                <div className="text-base font-bold tabular-nums text-[#c5221f]">{rutDepth.maxRutDepth} mm</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Rut Width</span>
                <div className="text-base font-bold tabular-nums text-slate-900">{rutDepth.rutWidth} cm</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Left Path Rut</span>
                <div className="font-medium tabular-nums text-slate-800">{rutDepth.leftWheelpathRut} mm</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Right Path Rut</span>
                <div className="font-medium tabular-nums text-slate-800">{rutDepth.rightWheelpathRut} mm</div>
              </div>
            </div>

            <div className="p-2.5 mt-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
              <span className="font-semibold">Transverse Profile:</span> Cross-profile deviation is {rutDepth.crossProfileDeviation} mm under 3m straight-edge.
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            Sensor: 13-Point Transverse Laser Rut Bar
          </div>
        </div>

        {/* 3. Cracking (Clickable to switch & view in inspections) - Standard Padding p-4 */}
        <div
          onClick={() => onJumpToDefect?.('cracking')}
          className="p-4 bg-white border border-slate-200 hover:border-orange-400 rounded-xl shadow-sm space-y-4 flex flex-col justify-between cursor-pointer group transition"
          title="Click to view full Cracking details and road imagery"
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-600" />
                <h4 className="font-semibold text-slate-900 text-sm group-hover:text-orange-700 transition">
                  Cracking
                </h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                {cracking.severityIndex}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mt-2.5">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Cracked Area</span>
                <div className="text-base font-bold tabular-nums text-slate-900">{cracking.totalCrackedAreaPercent}%</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Alligator Cracking</span>
                <div className="text-base font-bold tabular-nums text-orange-700">{cracking.alligatorCrackingArea} m²</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Longitudinal</span>
                <div className="font-medium tabular-nums text-slate-800">{cracking.longitudinalCrackLength} m</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Avg Width</span>
                <div className="font-medium tabular-nums text-slate-800">{cracking.averageCrackWidth} mm</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">Transverse Cracks: {cracking.transverseCrackCount}</span>
            <span className="text-xs font-semibold text-orange-600 group-hover:text-orange-700 flex items-center gap-1">
              <span>Inspect Defects</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </span>
          </div>
        </div>

        {/* 4. Potholes (Clickable to inspect potholes) - Standard Padding p-4 */}
        <div
          onClick={() => onJumpToDefect?.('potholes')}
          className="p-4 bg-white border border-slate-200 hover:border-red-400 rounded-xl shadow-sm space-y-4 flex flex-col justify-between cursor-pointer group transition"
          title="Click to view full Pothole details and road inspections"
        >
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#ea4335]" />
                <h4 className="font-semibold text-slate-900 text-sm group-hover:text-red-700 transition">
                  Potholes
                </h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-[#c5221f] border border-[#ea4335]/30">
                {potholes.totalCount} Potholes
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mt-2.5">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Total Volume</span>
                <div className="text-base font-bold tabular-nums text-[#c5221f]">0.0372 m³</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Average Depth</span>
                <div className="text-base font-bold tabular-nums text-slate-900">{potholes.averageDepth} mm</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Critical Priority</span>
                <div className="font-bold tabular-nums text-[#c5221f]">{potholes.criticalCount} detected</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Density</span>
                <div className="font-medium tabular-nums text-slate-800">{potholes.surfaceDamageDensity} / 100m</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">Max Depth: {potholes.maxDepth} mm</span>
            <span className="text-xs font-semibold text-[#c5221f] group-hover:text-red-700 flex items-center gap-1">
              <span>Inspect Potholes</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
            </span>
          </div>
        </div>

        {/* 5. Texture - Standard Padding p-4 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-slate-700" />
                <h4 className="font-semibold text-slate-900 text-sm">Texture & Skid</h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                {texture.hydroplaningRisk} Risk
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mt-2.5">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Macrotexture MPD</span>
                <div className="text-base font-bold tabular-nums text-slate-900">{texture.meanProfileDepthMPD} mm</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Skid Resistance</span>
                <div className="text-base font-bold tabular-nums text-slate-900">{texture.skidResistanceNumber} BPN</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Texture MTD</span>
                <div className="font-medium tabular-nums text-slate-800">{texture.meanTextureDepthMTD} mm</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Hydroplane Risk</span>
                <div className="font-medium tabular-nums text-slate-800">{texture.hydroplaningRisk}</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            Sensor: High-Frequency 64kHz Laser Texture Meter
          </div>
        </div>

        {/* 6. Geometry - Standard Padding p-4 */}
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-600" />
                <h4 className="font-semibold text-slate-900 text-sm">Road Geometry</h4>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-[#137333] border border-[#34a853]/30">
                Nominal
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mt-2.5">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Cross Slope (Camber)</span>
                <div className="text-base font-bold tabular-nums text-slate-900">{geometry.crossSlopePercent}%</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Longitudinal Gradient</span>
                <div className="text-base font-bold tabular-nums text-slate-900">{geometry.longitudinalGradient}%</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Curvature Radius</span>
                <div className="font-medium tabular-nums text-slate-800">{geometry.horizontalCurvatureRadius} m</div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-slate-500">Superelevation</span>
                <div className="font-medium tabular-nums text-slate-800">{geometry.superelevationPercent}%</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
            Inertial Measurement Unit (IMU) & Differential GPS
          </div>
        </div>
      </div>
    </div>
  );
};
