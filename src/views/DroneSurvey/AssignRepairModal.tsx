import React, { useState } from 'react';
import { GenericModal } from '../../common/GenericModal';
import { GenericButton } from '../../common/GenericButton';
import { DroneSurveyRecord, RepairPriority } from '../../models/surveyModels';
import { Wrench, CheckCircle2, Truck, Calendar, HardHat, FileSpreadsheet } from 'lucide-react';

interface AssignRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyRecord: DroneSurveyRecord | null;
  onAssignConfirm: (
    id: number,
    data: { team: string; targetDate: string; priority: RepairPriority; notes?: string }
  ) => void;
}

const REPAIR_DIVISIONS = [
  'NKDA Highway & Roads Maintenance Division-I (Heavy Bituminous Unit)',
  'WB PWD State Highway Mechanical Division (Kolkata Zone)',
  'Rapid Carriageway Resurfacing & Pothole Task Force (Zone AA-I)',
];

export const AssignRepairModal: React.FC<AssignRepairModalProps> = ({
  isOpen,
  onClose,
  surveyRecord,
  onAssignConfirm,
}) => {
  const [selectedDivision, setSelectedDivision] = useState(REPAIR_DIVISIONS[0]);
  const [targetDate, setTargetDate] = useState('2026-11-20');
  const [priority, setPriority] = useState<RepairPriority>('High');
  const [notes, setNotes] = useState(
    'Mobilize 120 TPH Batch Mix Plant & Sensor Paver. Complete Part 1 (4 Potholes Infill) followed by Part 2 (Full 120m BC Resurfacing).'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!surveyRecord) return null;

  const isMar1111 = surveyRecord.roadCode === 'MAR-1111' || surveyRecord.roadCode.includes('1111');
  const totalCost = isMar1111 ? 2820000 : surveyRecord.roughCostINR;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onAssignConfirm(surveyRecord.id, {
        team: selectedDivision,
        targetDate,
        priority,
        notes,
      });
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-[#1a73e8]" />
          <span>Assign Whole Road Corridor Resurfacing Package</span>
        </div>
      }
      subtitle={`Corridor Code: ${surveyRecord.roadCode} • ${surveyRecord.roadName}`}
      maxWidth="lg"
      footer={
        <>
          <GenericButton variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </GenericButton>
          <GenericButton
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
            onClick={handleSubmit}
          >
            Issue Work Order &amp; Assign Corridor
          </GenericButton>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Whole Corridor Scope Banner */}
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 block">
                Comprehensive Corridor Package (Not Individual Pothole)
              </span>
              <div className="font-bold text-slate-900 text-sm">{surveyRecord.roadName}</div>
              <div className="text-slate-600 text-xs">
                Chainage: {surveyRecord.chainage} ({surveyRecord.lane})
              </div>
            </div>
            <span className="px-2.5 py-1 bg-blue-600 text-white font-bold rounded text-xs shadow-xs">
              ₹{totalCost.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-blue-200/80 font-mono text-[11px]">
            <div className="p-2 bg-white rounded border border-blue-100">
              <span className="text-slate-500 block text-[10px]">Scope Length</span>
              <span className="font-bold text-slate-800">120 Metres</span>
            </div>
            <div className="p-2 bg-white rounded border border-blue-100">
              <span className="text-slate-500 block text-[10px]">Potholes Infill</span>
              <span className="font-bold text-red-600">4 Verified (20mm)</span>
            </div>
            <div className="p-2 bg-white rounded border border-blue-100">
              <span className="text-slate-500 block text-[10px]">Resurfacing Area</span>
              <span className="font-bold text-slate-800">900 m² (7.5m width)</span>
            </div>
            <div className="p-2 bg-white rounded border border-blue-100">
              <span className="text-slate-500 block text-[10px]">Statutory Spec</span>
              <span className="font-bold text-emerald-700">BC Grade-1 PMB</span>
            </div>
          </div>
        </div>

        {/* Executing Division Selection */}
        <div>
          <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1.5">
            <HardHat className="w-3.5 h-3.5 text-blue-600" />
            <span>Designated Executing Engineering Division</span>
          </label>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs font-medium focus:outline-none focus:border-blue-500"
          >
            {REPAIR_DIVISIONS.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>

        {/* Mobilized Heavy Machinery Package */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
            <Truck className="w-3.5 h-3.5 text-slate-600" />
            <span>Mobilized Machinery &amp; Plant Allocation</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            • 120 TPH Central Asphalt Batch Mix Plant (Rajarhat Depot)<br />
            • 7.5m Hydrostatic Sensor Paver Finisher with electronic sensor ski<br />
            • 8-10 Ton Tandem Vibratory Steel Rollers + 3-Wheel Pneumatic Roller<br />
            • Cold Milling Machine for transverse tie-in joint cutting (MoRTH 501.8)
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Target Completion Date</span>
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">Priority Classification</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Low', 'Medium', 'High'] as RepairPriority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`py-2 text-center font-bold rounded-lg border text-xs cursor-pointer transition ${
                    priority === p
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-1">
            Work Order Notes &amp; Traffic Diversion Instructions
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>
      </form>
    </GenericModal>
  );
};
