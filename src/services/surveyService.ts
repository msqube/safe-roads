import { DroneSurveyRecord, SurveyFilterOptions, SurveySummaryStats } from '../models/surveyModels';
import { INITIAL_65_SURVEY_RECORDS, getMockNSVDetails } from './mockSurveyData';
import { NSVRoadDetails } from '../models/nsvModels';

const STORAGE_KEY = 'saferoads_survey_data_v27_consistent_mar1111';

class SurveyService {
  private getStoredData(): DroneSurveyRecord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Verify that stored data contains real images, not old cached SVG data URIs
          const hasStaleSvg = parsed.some(
            (r: DroneSurveyRecord) =>
              r.dronePhotoThumb?.startsWith('data:image/svg') ||
              r.dronePhoto?.startsWith('data:image/svg')
          );
          if (!hasStaleSvg) {
            // Auto-sanitize and strictly synchronize MAR-1111 across all fields
            let needsResave = false;
            parsed.forEach((r: DroneSurveyRecord) => {
              if (r.roadCode === 'MAR-1111' || r.id === 1) {
                if (
                  r.gpsLatitude !== 22.58210 ||
                  r.gpsLongitude !== 88.47305 ||
                  r.potholeCount !== 4 ||
                  r.depthOfRut !== 20 ||
                  r.areaOfBadness !== 1.86 ||
                  r.roughCostINR !== 2820000 ||
                  r.distanceKm !== 0.12 ||
                  r.goodnessScore !== 24 ||
                  r.condition !== 'Critical' ||
                  !r.dronePhotoThumb?.includes('unsplash')
                ) {
                  r.roadCode = 'MAR-1111';
                  r.gpsLatitude = 22.58210;
                  r.gpsLongitude = 88.47305;
                  r.potholeCount = 4;
                  r.depthOfRut = 20;
                  r.areaOfBadness = 1.86;
                  r.roughCostINR = 2820000;
                  r.costPerM2 = 2720;
                  r.distanceKm = 0.12;
                  r.goodnessScore = 24;
                  r.condition = 'Critical';
                  r.dronePhotoThumb = 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_pothole.jpg';
                  r.dronePhoto = 'https://upload.wikimedia.org/wikipedia/commons/3/36/Large_pothole.jpg';
                  r.dronePhoto2Thumb = 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg';
                  r.dronePhoto2 = 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Pothole_in_an_asphalt_pavement.jpg';
                  needsResave = true;
                }
              }
            });
            if (needsResave) {
              this.saveData(parsed);
            }
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage error reading survey data:', e);
    }
    // Initialize with the 65 New Town Kolkata records
    this.saveData(INITIAL_65_SURVEY_RECORDS);
    return INITIAL_65_SURVEY_RECORDS;
  }

  private saveData(data: DroneSurveyRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage error saving survey data:', e);
    }
  }

  // Alias for getting all surveys
  async getAllSurveys(): Promise<DroneSurveyRecord[]> {
    return this.getSurveys();
  }

  // Get all survey records with filtering and sorting
  async getSurveys(filter?: Partial<SurveyFilterOptions>): Promise<DroneSurveyRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 80));

    let records = this.getStoredData();

    if (!filter) return records;

    if (filter.search) {
      const q = filter.search.toLowerCase();
      records = records.filter(r =>
        r.roadCode.toLowerCase().includes(q) ||
        r.roadName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.chainage.toLowerCase().includes(q) ||
        r.lane.toLowerCase().includes(q)
      );
    }

    if (filter.actionArea && filter.actionArea !== 'ALL') {
      records = records.filter(r => r.actionArea === filter.actionArea);
    }

    if (filter.condition && filter.condition !== 'ALL') {
      records = records.filter(r => r.condition === filter.condition);
    }

    if (filter.status && filter.status !== 'ALL') {
      records = records.filter(r => r.status === filter.status);
    }

    if (filter.minScore !== undefined) {
      records = records.filter(r => r.goodnessScore >= (filter.minScore || 0));
    }

    if (filter.maxScore !== undefined) {
      records = records.filter(r => r.goodnessScore <= (filter.maxScore || 100));
    }

    if (filter.minDepth !== undefined && filter.minDepth > 0) {
      records = records.filter(r => r.depthOfRut >= (filter.minDepth || 0));
    }

    if (filter.sortBy) {
      const key = filter.sortBy;
      const order = filter.sortOrder === 'desc' ? -1 : 1;
      records.sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * order;
        }
        return String(valA).localeCompare(String(valB)) * order;
      });
    }

    return records;
  }

  async getSurveyByRoadCode(roadCode: string): Promise<DroneSurveyRecord | undefined> {
    const records = this.getStoredData();
    return records.find(r => r.roadCode.toLowerCase() === roadCode.toLowerCase());
  }

  async getNSVDetails(roadCode: string): Promise<NSVRoadDetails> {
    await new Promise(resolve => setTimeout(resolve, 80));
    return getMockNSVDetails(roadCode);
  }

  // Update status (e.g. "Ignore / Check later" action)
  async updateStatus(id: number, status: DroneSurveyRecord['status'], notes?: string): Promise<DroneSurveyRecord> {
    const records = this.getStoredData();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Survey record id ${id} not found`);

    records[index] = {
      ...records[index],
      status,
      actionNotes: notes || records[index].actionNotes,
    };

    this.saveData(records);
    return records[index];
  }

  // Assign repair team & schedule action
  async assignRepair(
    id: number,
    assignment: {
      team: string;
      targetDate: string;
      priority: DroneSurveyRecord['repairPriority'];
      notes?: string;
    }
  ): Promise<DroneSurveyRecord> {
    const records = this.getStoredData();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) throw new Error(`Survey record id ${id} not found`);

    records[index] = {
      ...records[index],
      status: 'Assigned',
      assignedTeam: assignment.team,
      targetRepairDate: assignment.targetDate,
      repairPriority: assignment.priority,
      actionNotes: assignment.notes || records[index].actionNotes,
    };

    this.saveData(records);
    return records[index];
  }

  // Reset to default 65 records
  async resetToDefault(): Promise<DroneSurveyRecord[]> {
    this.saveData(INITIAL_65_SURVEY_RECORDS);
    return INITIAL_65_SURVEY_RECORDS;
  }

  // Calculate executive statistics
  async getSummaryStats(): Promise<SurveySummaryStats> {
    const records = this.getStoredData();
    const totalSurveys = records.length;
    const totalPotholes = records.reduce((acc, curr) => acc + curr.potholeCount, 0);
    const criticalRoads = records.filter(r => r.condition === 'Critical').length;
    const totalScore = records.reduce((acc, curr) => acc + curr.goodnessScore, 0);
    const averageGoodnessScore = totalSurveys > 0 ? Math.round(totalScore / totalSurveys) : 0;
    const pendingRepairs = records.filter(r => r.status === 'Assigned' || (r.condition === 'Critical' && r.status !== 'Repaired')).length;
    const totalBadnessArea = parseFloat(records.reduce((acc, curr) => acc + curr.areaOfBadness, 0).toFixed(1));
    const totalEstimatedCostINR = records.reduce((acc, curr) => acc + (curr.roughCostINR || 0), 0);

    return {
      totalSurveys,
      totalPotholes,
      criticalRoads,
      averageGoodnessScore,
      pendingRepairs,
      totalBadnessArea,
      totalEstimatedCostINR,
    };
  }
}

export const surveyService = new SurveyService();
