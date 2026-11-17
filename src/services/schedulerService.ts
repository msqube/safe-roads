import { LaneScheduleItem, DroneAsset } from '../models/schedulerModels';
import { MOCK_LANE_SCHEDULES } from './mockSurveyData';

const SCHEDULER_KEY = 'saferoads_scheduler_data_v1';

const MOCK_DRONES: DroneAsset[] = [
  {
    droneId: 'DRN-SKY-X4',
    model: 'DJI Matrice 350 RTK - RoadEye L1',
    batteryPercent: 88,
    status: 'Available',
    currentGps: { lat: 26.144, lng: 91.736 },
    assignedPilot: 'Capt. R. Baruah (DGCA #4419)',
    flightHours: 342.5,
  },
  {
    droneId: 'DRN-AERO-09',
    model: 'WingtraOne GEN II VTOL',
    batteryPercent: 62,
    status: 'On Mission',
    currentGps: { lat: 26.155, lng: 91.758 },
    assignedPilot: 'S. K. Saikia (DGCA #8120)',
    flightHours: 512.0,
  },
  {
    droneId: 'DRN-SURV-302',
    model: 'SenseFly eBee X GeoSurvey',
    batteryPercent: 95,
    status: 'Available',
    currentGps: { lat: 26.128, lng: 91.712 },
    assignedPilot: 'P. Goswami (DGCA #3104)',
    flightHours: 198.2,
  },
  {
    droneId: 'DRN-HEXA-88',
    model: 'Yuneec H520E Civil Inspector',
    batteryPercent: 44,
    status: 'Charging',
    currentGps: { lat: 26.133, lng: 91.745 },
    assignedPilot: 'N. Kalita (DGCA #5529)',
    flightHours: 420.8,
  },
  {
    droneId: 'DRN-RAPTOR-12',
    model: 'Skydio X2D AI Autonomous',
    batteryPercent: 79,
    status: 'Available',
    currentGps: { lat: 26.148, lng: 91.729 },
    assignedPilot: 'Ananya Sharma (DGCA #9921)',
    flightHours: 280.4,
  },
];

class SchedulerService {
  private getStoredSchedules(): LaneScheduleItem[] {
    try {
      const stored = localStorage.getItem(SCHEDULER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('LocalStorage error reading schedules:', e);
    }
    this.saveSchedules(MOCK_LANE_SCHEDULES);
    return MOCK_LANE_SCHEDULES;
  }

  private saveSchedules(data: LaneScheduleItem[]): void {
    try {
      localStorage.setItem(SCHEDULER_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage error saving schedules:', e);
    }
  }

  async getSchedules(): Promise<LaneScheduleItem[]> {
    await new Promise(r => setTimeout(r, 60));
    return this.getStoredSchedules();
  }

  async createSchedule(item: Omit<LaneScheduleItem, 'id' | 'scheduleCode' | 'assignedAt'>): Promise<LaneScheduleItem> {
    const list = this.getStoredSchedules();
    const count = list.length + 1;
    const newItem: LaneScheduleItem = {
      ...item,
      id: `SCH-2026-${String(count).padStart(3, '0')}`,
      scheduleCode: `SCH-DRN-${String(count).padStart(3, '0')}`,
      assignedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    list.unshift(newItem);
    this.saveSchedules(list);
    return newItem;
  }

  async updateScheduleStatus(id: string, status: LaneScheduleItem['status']): Promise<LaneScheduleItem> {
    const list = this.getStoredSchedules();
    const index = list.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Schedule not found');
    list[index].status = status;
    this.saveSchedules(list);
    return list[index];
  }

  async getDroneFleet(): Promise<DroneAsset[]> {
    return MOCK_DRONES;
  }
}

export const schedulerService = new SchedulerService();

