import React, { useEffect, useState } from 'react';
import { FormPageHeader } from '../../common/FormPageHeader';
import { GenericButton } from '../../common/GenericButton';
import { CreateScheduleModal } from './CreateScheduleModal';
import { LaneScheduleItem } from '../../models/schedulerModels';
import { schedulerService } from '../../services/schedulerService';
import {
  CalendarClock,
  Plus,
  Play,
  CheckCircle,
  Eye,
} from 'lucide-react';

export const LaneSchedulerPage: React.FC = () => {
  const [schedules, setSchedules] = useState<LaneScheduleItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadSchedules = async () => {
    const list = await schedulerService.getSchedules();
    setSchedules(list);
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  const handleCreate = async (
    item: Omit<LaneScheduleItem, 'id' | 'scheduleCode' | 'assignedAt'>
  ) => {
    const created = await schedulerService.createSchedule(item);
    setSchedules((prev) => [created, ...prev]);
    showToast(`Lane survey scheduled for ${created.roadCode}!`);
  };

  const handleUpdateStatus = async (
    id: string,
    status: LaneScheduleItem['status']
  ) => {
      const updated = await schedulerService.updateScheduleStatus(id, status);
      setSchedules((prev) => prev.map((s) => (s.id === id ? updated : s)));
      showToast(`Status updated to "${status}".`);
    };

  return (
      <div className="space-y-4">
        {/* Toast */}
        {toastMessage && (
            <div className="fixed bottom-5 right-5 z-50 p-3 bg-white border border-slate-300 rounded-lg shadow-lg text-xs font-medium text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
      )}

            {/* Header */}
            <FormPageHeader
              title="Lane Scheduler"
              subtitle="Schedule particular lanes and road sectors for drone road quality surveillance."
              actions={
                <GenericButton
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsModalOpen(true)}
                >
                  Schedule New Lane
                </GenericButton>
              }
            />

                {/* Schedule Table / Cards */ }
                <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900 text-sm">Scheduled Lanes</h4>
                    <span className="text-xs text-slate-500">{schedules.length} Items</span>
                  </div>

                        <div className="divide-y divide-slate-100 text-xs">
                          {schedules.map((sch) => {
                            const isInFlight = sch.status === 'In Flight';
                            const isCompleted = sch.status === 'Completed';

                            return (
                              <div
                                key={sch.id}
                                className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                      <span className="font-mono font-bold text-slate-900">{sch.roadCode}</span>
                                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                        {sch.lane}
                                      </span>
                                        <span
                                          className={`px-2 py-0.5 rounded text-[11px] font-medium ${isInFlight
                                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                              : isCompleted
                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}
                                        >
                                          {sch.status}
                                        </span>
                                      </div>
                                      <p className="text-slate-600 font-medium">{sch.roadName}</p>
                                      <p className="text-slate-400 text-[11px]">
                                        Sector: {sch.sector} • Drone: {sch.droneId} ({sch.pilotName}) • Date: {sch.scheduledDate} ({sch.timeSlot})
                                      </p>
                                  </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <button
                                    onClick={() => window.open(`/nsv/${sch.roadCode}`, '_blank')}
                                    className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                                    <span>View Road</span>
                                  </button>

                                      {sch.status === 'Scheduled' && (
                                        <button
                                          onClick={() => handleUpdateStatus(sch.id, 'In Flight')}
                                          className="px-2.5 py-1 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1 cursor-pointer"
                                        >
                                          <Play className="w-3 h-3" />
                                          <span>Start Survey</span>
                                        </button>
                                      )}

                                      {sch.status === 'In Flight' && (
                                        <button
                                          onClick={() => handleUpdateStatus(sch.id, 'Completed')}
                                          className="px-2.5 py-1 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded flex items-center gap-1 cursor-pointer"
                                        >
                                          <CheckCircle className="w-3 h-3" />
                                          <span>Complete</span>
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
          })}
                              </div>
      </div>

                        <CreateScheduleModal
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          onCreateSchedule={handleCreate}
                        />
                      </div>
                      );
};
