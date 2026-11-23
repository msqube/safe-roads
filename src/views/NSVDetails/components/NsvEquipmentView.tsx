import React from 'react';
import {
  Cpu,
  Layers,
  Camera,
  Compass,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Activity,
  HardDrive,
} from 'lucide-react';
import { NSVRoadDetails } from '../../../models/nsvModels';

interface NsvEquipmentViewProps {
  details: NSVRoadDetails;
}

export const NsvEquipmentView: React.FC<NsvEquipmentViewProps> = ({ details }) => {
  const equipmentOutputs = [
    {
      system: 'Laser profilometer',
      purpose: 'Longitudinal profile, IRI and transverse profile / rut depth',
      specs: '16 kHz high-frequency dual laser distance sensors (ASTM E950 Class-1)',
      icon: <Activity className="w-4 h-4 text-blue-600" />,
    },
    {
      system: 'Digital imaging system',
      purpose: 'Continuous roadway imagery and distress documentation',
      specs: 'High-resolution forward, pavement and 360° panoramic calibrated cameras',
      icon: <Camera className="w-4 h-4 text-emerald-600" />,
    },
    {
      system: 'GPS + INS',
      purpose: 'Position, heading, trajectory and geo-referencing',
      specs: 'RTK differential GPS receiver coupled with fiber-optic inertial navigation system',
      icon: <Compass className="w-4 h-4 text-purple-600" />,
    },
    {
      system: 'Distance Measuring Instrument (DMI)',
      purpose: 'Chainage and distance referencing',
      specs: 'High-pulse optical wheel encoder measuring chainage with ±0.05% distance precision',
      icon: <Gauge className="w-4 h-4 text-amber-600" />,
    },
    {
      system: 'Data acquisition system',
      purpose: 'Time synchronization, storage and export of survey records',
      specs: 'Multi-threaded onboard industrial computing unit with hardware time-stamping',
      icon: <HardDrive className="w-4 h-4 text-slate-700" />,
    },
  ];

  const qualityChecks = [
    'Verify calibration certificates and sensor setup before deployment.',
    'Confirm odometer / DMI distance against a known reference length.',
    'Check GPS/INS lock, time synchronization and image capture continuity.',
    'Review profile data for spikes, dropouts, braking effects and abnormal vehicle movement.',
    'Validate chainage and direction of travel against field control points.',
    'Retain raw profile files, processed IRI outputs, geotagged images and calibration records.',
  ];

  return (
    <div className="space-y-4 text-xs text-slate-800">
      {/* Header Banner - Standard Padding p-4 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 rounded-xl border border-slate-700 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/30 text-blue-300 border border-blue-400/30 tabular-nums">
              NSV INSTRUMENTATION &amp; METHODOLOGY
            </span>
            <span className="text-xs font-mono text-slate-300">
              AUTOMATED SENSOR SUITE
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            NSV Methodology, Equipment &amp; Quality Control
          </h3>
          <p className="text-xs text-slate-300">
            Hardware instrumentation, laser sensors and quality assurance framework for <strong>NKDA Road MAR 1111</strong>.
          </p>
        </div>

        <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-right text-[11px] text-blue-200">
          <div>Vehicle: <span className="text-white font-bold">{details.nsvVehicleId || 'WB-06-NSV-8821'}</span></div>
          <div>Standard: <span className="text-emerald-300 font-bold">ASTM E950 / IRC:SP:16</span></div>
        </div>
      </div>

      {/* 2.1 Data Collection Methodology */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#1a73e8]" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            2.1 Data Collection Methodology &amp; Workflow
          </h4>
        </div>
        <p className="text-slate-700 leading-relaxed">
          For a field NSV survey, the reference report describes route planning, equipment calibration, NSV deployment, digital imaging, laser profile measurement, GPS/INS positioning, distance measurement, data synchronization, quality control and report preparation. The same sequence is recommended for the actual <strong>NKDA Road MAR 1111</strong> survey.
        </p>
      </div>

      {/* 2.2 NSV Equipment and Outputs Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden space-y-0">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#1a73e8]" />
            <h4 className="text-sm font-bold text-slate-900">
              2.2 NSV Sensor Systems &amp; Expected Outputs
            </h4>
          </div>
          <span className="text-xs text-slate-500">5 Primary Sensor Systems</span>
        </div>

        <div className="overflow-x-auto">
          <table className="table-fixed w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs border-b border-slate-200">
              <tr>
                <th className="w-1/4 px-4 py-3 align-middle">System</th>
                <th className="w-2/5 px-4 py-3 align-middle">Purpose / Expected Output</th>
                <th className="w-7/20 px-4 py-3 align-middle">Engineering Hardware Specifications</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {equipmentOutputs.map((eq, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 align-middle font-bold text-slate-900 flex items-center gap-2">
                    {eq.icon}
                    <span>{eq.system}</span>
                  </td>
                  <td className="px-4 py-3 align-middle font-semibold text-slate-800">{eq.purpose}</td>
                  <td className="px-4 py-3 align-middle text-slate-600 text-[11px]">{eq.specs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2.3 Quality Control and Validation */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm font-bold text-slate-900">
            2.3 Quality Control &amp; Sensor Calibration Protocol
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {qualityChecks.map((qc, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 tabular-nums">
                {idx + 1}
              </span>
              <p className="text-slate-700 text-xs leading-snug">{qc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
