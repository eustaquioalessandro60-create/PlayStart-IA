import { SocialNetwork } from '../types';

export interface SmartTimeSlot {
  id: string;
  label: string;
  dayLabel: string;
  time: string;
  isoDateTime: string;
  confidenceScore: number;
  expectedEngagementBoost: string;
  badge: string;
  recommendedNetworks: SocialNetwork[];
  audienceRationale: string;
  isPeakGoldenHour: boolean;
}

export interface NetworkTimingDetail {
  network: SocialNetwork;
  peakWindow: string;
  bestDay: string;
  algorithmInsight: string;
  engagementMultiplier: string;
}

export interface SmartScheduleAnalysis {
  contentTypeDetected: string;
  overallRecommendation: string;
  optimalSlots: SmartTimeSlot[];
  networkSpecificTips: NetworkTimingDetail[];
  contentUrgency: 'Alta' | 'Média' | 'Perene / Evergreen';
  analyzedAt: string;
}
