import React, { useState } from 'react';
import { GenericModal } from '../../common/GenericModal';
import { GenericButton } from '../../common/GenericButton';
import { LaneScheduleItem } from '../../models/schedulerModels';
import { CalendarClock } from 'lucide-react';

interface CreateScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateSchedule: (item: Omit<LaneScheduleItem, 'id' | 'scheduleCode' | 'assignedAt'>) => void;
}

const ROADS = [
  { code: 'RD-NH44-0101', name: 'Guwahati - Shillong National Highway (NH-44)' },
  { code: 'RD-NH27-0102', name: 'East-West Corridor Expressway (NH-27)' },
  { code: 'RD-SH17-0103', name: 'Brahmaputra Riverside Boulevard (SH-17)' },
  { code: 'RD-MDR04-0104', name: 'Dispur Administrative Ring Road (MDR-04)' },
  { code: 'RD-NH127B-0105', name: 'Jalukbari Inter-City Arterial (NH-127B)' },
];

const LANES = [
  'Lane 1 (Slow / Heavy Vehicles)',
  'Lane 2 (Fast / Median)',
  'Lane 3 (Overtaking)',
  'Service Road (Northbound)',
  'Service Road (Southbound)',
];

const DRONES = [
  { id: 'DRN-SKY-X4', pilot: 'Capt. R. Baruah' },
  { id: 'DRN-AERO-09', pilot: 'S. K. Saikia' },
  { id: 'DRN-SURV-302', pilot: 'P. Goswami' },
];

export const CreateScheduleModal: React.FC<CreateScheduleModalProps> = ({
  isOpen,
  onClose,
  onCreateSchedule,
}) => {
  const [selectedRoad, setSelectedRoad] = useState(ROADS[0]);
  const [selectedLane, setSelectedLane] = useState(LANES[0]);
  const [sector, setSector] = useState('Sector 4B (Km 12 to 18)');
  const [selectedDrone, setSelectedDrone] = useState(DRONES[0]);
  const [scheduledDate, setScheduledDate] = useState('2026-11-15');
  const [timeSlot, setTimeSlot] = useState('08:00 AM - 10:00 AM');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateSchedule({
      roadCode: selectedRoad.code,
      roadName: selectedRoad.name,
      lane: selectedLane,
      sector,
      droneId: selectedDrone.id,
      pilotName: selectedDrone.pilot,
      scheduledDate,
      timeSlot,
      flightAltitudeM: 35,
      expectedDurationMin: 90,
      surveyType: 'Routine AI Patrol',
      priority: 'High',
      status: 'Scheduled',
    });
    onClose();
  };

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-blue-600" />
          <span>Schedule Drone Lane Survey</span>
        </div>
      }
      subtitle="Select road and specific lane to be surveyed by drone"
      maxWidth="md"
      footer={
        <>
            <GenericButton variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </GenericButton>
              <GenericButton variant="primary" size="sm" onClick={handleSubmit}>
                Save Schedule
              </GenericButton>
            </>
      }
    >
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Road</label>
                  <select
                    value={selectedRoad.code}
                    onChange={(e) => {
                      const r = ROADS.find((rd) => rd.code === e.target.value) || ROADS[0];
                      setSelectedRoad(r);
                    }}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {ROADS.map((r) => (
                      <option key={r.code} value={r.code}>
                        {r.code} — {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Lane</label>
                  <select
                    value={selectedLane}
                    onChange={(e) => setSelectedLane(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  >
                    {LANES.map((lane) => (
                      <option key={lane} value={lane}>
                        {lane}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Sector / Chainage</label>
                  <input
                    type="text"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Time</label>
                    <input
                      type="text"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Assigned Drone</label>
                    <select
                      value={selectedDrone.id}
                      onChange={(e) => {
                        const d = DRONES.find((dr) => dr.id === e.target.value) || DRONES[0];
                        setSelectedDrone(d);
                      }}
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 text-xs focus:outline-none focus:border-blue-500"
                    >
                      {DRONES.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.id} ({d.pilot})
                        </option>
                      ))}
                    </select>
                  </div>
              </form>
            </GenericModal>
            );
};
