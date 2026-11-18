import { DPRRecord, TenderNotice } from '../models/dprModels';
import { generateDPRForRoad } from './mockSurveyData';

const DPR_STORAGE_PREFIX = 'SAFEROADS_DPR_V7_EXACT_FORMULA_';

export const dprService = {
  // Get DPR for a road
  async getDPR(roadCode: string): Promise<DPRRecord> {
    const key = `${DPR_STORAGE_PREFIX}${roadCode}`;
    const cached = localStorage.getItem(key);
    let record: DPRRecord;
    if (cached) {
      try {
        record = JSON.parse(cached);
      } catch (e) {
        console.error('Failed to parse cached DPR:', e);
        record = generateDPRForRoad(roadCode);
      }
    } else {
      record = generateDPRForRoad(roadCode);
    }

    // Dynamic Synchronization with NSV Upload & DPR Approved Workflow Gate
    const isUploaded =
      localStorage.getItem(`nsv_uploaded_${roadCode}`) === 'true' ||
      localStorage.getItem(`dpr_approved_${roadCode}`) === 'true' ||
      roadCode === 'MAR-1111' ||
      roadCode.includes('1111');

    if (isUploaded) {
      record.hasNsvSurvey = true;
      record.isBlocked = false;
      record.blockReason = undefined;
      record.reviews = record.reviews.map((r) => ({
        ...r,
        status: 'Approved' as const,
        reviewedAt: r.reviewedAt || '16 Nov 2026, 12:00 IST',
      }));

      if (!record.tender) {
        const total = record.estimatedCostINR || 2820000;
        record.tender = {
          nitNumber: `NIT-NKDA/WBHIDCO/ROADS/2026/${roadCode.replace(/[^0-9]/g, '').slice(-3) || '001'}`,
          workName: `Urgent Restoration, 4 Pothole Patching & Resurfacing of ${record.roadName} (${record.roadCode}), ${record.location}, New Town Kolkata.`,
          executingAgency: 'New Town Kolkata Development Authority (NKDA) & WBHIDCO',
          estimatedCostINR: total,
          earnestMoneyINR: Math.round(total * 0.02),
          completionPeriodDays: 30,
          bidSubmissionDeadline: '2026-12-15 17:00 IST',
          technicalBidOpenDate: '2026-12-17 11:30 IST',
          financialBidOpenDate: '2026-12-22 15:00 IST',
          portalUrl: 'https://wbtenders.gov.in',
          eligibilityCriteria: [
            'Registered Class-I / Class-II Road Contractors under WB PWD / WBHIDCO / NKDA / KMDA.',
            'Credential: At least 1 completed road bituminous surfacing work of minimum 40% tender value in the last 3 financial years.',
            'Valid GSTIN, PAN card, Professional Tax (PT) clearance, and EPF/ESI registration in West Bengal.',
            'Proof of ownership or assured lease agreement of Central Hot Mix Plant (min 100 TPH) within 40 km of New Town.',
          ],
          mandatoryDocuments: [
            'Form-1 (Technical Bid Submission Application)',
            'Affidavit affirming non-blacklisting in any Govt/Semi-Govt organization',
            'Valid Trade License and Partnership Deed / Company Incorporation Certificate',
            'PAN, GST Registration & latest GSTR-3B filing acknowledgement',
            'Machinery Deployment Schedule & Plant Calibration Certificate',
          ],
          releasedAt:
            localStorage.getItem(`tender_published_${roadCode}`) === 'true'
              ? '16 Nov 2026, 14:15 IST'
              : 'Pending Release',
          tenderStatus:
            localStorage.getItem(`tender_published_${roadCode}`) === 'true' ? 'Published' : 'Draft',
        };
      }
      localStorage.setItem(key, JSON.stringify(record));
    }

    return record;
  },

  // Save / edit DPR details
  async updateDPR(record: DPRRecord): Promise<DPRRecord> {
    const updated = {
      ...record,
      lastUpdated: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' IST',
    };
    localStorage.setItem(`${DPR_STORAGE_PREFIX}${record.roadCode}`, JSON.stringify(updated));
    return updated;
  },

  // Dispatch email to selected authority for review
  async releaseEmail(roadCode: string, authorityEmail: string): Promise<DPRRecord> {
    const dpr = await this.getDPR(roadCode);
    const updatedReviews = dpr.reviews.map((rev) => {
      if (rev.stageId === 1 && rev.status === 'Pending') {
        return { ...rev, status: 'In Review' as const };
      }
      return rev;
    });

    const updated: DPRRecord = {
      ...dpr,
      emailDispatchedTo: authorityEmail,
      emailDispatchedAt: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }) + ' IST',
      reviews: updatedReviews,
      lastUpdated: new Date().toLocaleString('en-IN') + ' IST',
    };

    localStorage.setItem(`${DPR_STORAGE_PREFIX}${roadCode}`, JSON.stringify(updated));
    return updated;
  },

  // Progress through the 3 review stages
  async approveReviewStage(roadCode: string, stageId: 1 | 2 | 3, remarks?: string): Promise<DPRRecord> {
    const dpr = await this.getDPR(roadCode);
    const timeNow = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }) + ' IST';

    const updatedReviews = dpr.reviews.map((rev) => {
      if (rev.stageId === stageId) {
        return {
          ...rev,
          status: 'Approved' as const,
          reviewedAt: timeNow,
          remarks: remarks || 'Scrutinized and sanctioned as per NKDA / WB PWD road rehabilitation guidelines.',
        };
      }
      // If previous stage is approved, activate next stage
      if (rev.stageId === stageId + 1 && rev.status === 'Pending') {
        return {
          ...rev,
          status: 'In Review' as const,
        };
      }
      return rev;
    });

    const updated: DPRRecord = {
      ...dpr,
      reviews: updatedReviews,
      lastUpdated: timeNow,
    };

    localStorage.setItem(`${DPR_STORAGE_PREFIX}${roadCode}`, JSON.stringify(updated));
    return updated;
  },

  // Release official Tender (Notice Inviting Tender - NIT)
  async releaseTender(roadCode: string): Promise<DPRRecord> {
    const dpr = await this.getDPR(roadCode);
    const tenderNumber = `NIT-NKDA/WBHIDCO/ROADS/2026/${dpr.roadCode.replace(/[^0-9]/g, '').slice(-3) || '104'}`;
    const emdAmount = Math.round(dpr.estimatedCostINR * 0.02); // 2% EMD

    const today = new Date();
    const bidDeadline = new Date(today.getTime() + 21 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const techBidOpen = new Date(today.getTime() + 23 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const finBidOpen = new Date(today.getTime() + 28 * 24 * 3600 * 1000).toISOString().split('T')[0];

    const tender: TenderNotice = {
      nitNumber: tenderNumber,
      workName: `Urgent Restoration, Cold Milling & Bituminous Resurfacing of ${dpr.roadName} (${dpr.roadCode}), ${dpr.location}, New Town Kolkata.`,
      executingAgency: 'New Town Kolkata Development Authority (NKDA) & WBHIDCO',
      estimatedCostINR: dpr.estimatedCostINR,
      earnestMoneyINR: emdAmount,
      completionPeriodDays: dpr.projectDurationDays,
      bidSubmissionDeadline: `${bidDeadline} 17:00 IST`,
      technicalBidOpenDate: `${techBidOpen} 11:30 IST`,
      financialBidOpenDate: `${finBidOpen} 15:00 IST`,
      portalUrl: 'https://wbtenders.gov.in',
      eligibilityCriteria: [
        'Registered Class-I / Class-II Road Contractors under WB PWD / WBHIDCO / NKDA / KMDA.',
        'Credential: At least 1 completed road bituminous surfacing work of minimum 40% tender value in the last 3 financial years.',
        'Valid GSTIN, PAN card, Professional Tax (PT) clearance, and EPF/ESI registration in West Bengal.',
        'Proof of ownership or assured lease agreement of Central Hot Mix Plant (min 100 TPH) within 40 km of New Town, mechanical sensor paver finisher, and tandem vibratory roller (8-10 Ton).',
        'Average annual financial turnover of minimum 50% of the estimated cost over last 3 audited financial years.',
      ],
      mandatoryDocuments: [
        'Form-1 (Technical Bid Submission Application)',
        'Affidavit affirming non-blacklisting in any Govt/Semi-Govt organization',
        'Valid Trade License and Partnership Deed / Company Incorporation Certificate',
        'PAN, GST Registration & latest GSTR-3B filing acknowledgement',
        'Machinery Deployment Schedule & Plant Calibration Certificate',
      ],
      releasedAt: new Date().toLocaleString('en-IN') + ' IST',
      tenderStatus: 'Published',
    };

    const updated: DPRRecord = {
      ...dpr,
      tender,
      lastUpdated: new Date().toLocaleString('en-IN') + ' IST',
    };

    localStorage.setItem(`${DPR_STORAGE_PREFIX}${roadCode}`, JSON.stringify(updated));
    return updated;
  },

  // Get all DPRs for the directory table
  async getAllDPRs(): Promise<DPRRecord[]> {
    const roadCodes = [
      'MAR-1111',
      'NKDA-AA1-ST112-0002',
      'NKDA-AA1-ST048-0003',
      'NKDA-AA2-ECO-0006',
      'NKDA-AA2-MAR-0007',
      'NKDA-AA2-CC2-0008',
      'NKDA-AA3-SLV-0011',
      'NKDA-AA3-CND-0015',
    ];
    const records = await Promise.all(roadCodes.map((code) => this.getDPR(code)));
    return records;
  },
};

