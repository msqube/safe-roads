export interface LaneScheduleItem {
  id: string;
  scheduleCode: string;
  roadCode: string;
  roadName: string;
  lane: string;
  sector: string;
  droneId: string;
  pilotName: string;
  scheduledDate: string;
  timeSlot: string;
  flightAltitudeM: number;
  expectedDurationMin: number;
  surveyType: 'Routine AI Patrol' | 'Post-Monsoon Scan' | 'High-Speed NSV Sync' | 'Emergency Citizen Report';
  priority: 'Low' | 'Medium' | 'High' | 'Immediate';
  status: 'Scheduled' | 'In Flight' | 'Completed' | 'Deferred' | 'Cancelled';
  assignedAt: string;
  notes?: string;
}

export interface DroneAsset {
  droneId: string;
  model: string;
  batteryPercent: number;
  status: 'Available' | 'On Mission' | 'Charging' | 'Maintenance';
  currentGps: { lat: number; lng: number };
  assignedPilot: string;
  flightHours: number;
}

