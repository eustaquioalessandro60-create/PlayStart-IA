export type SocialNetwork = 'Facebook' | 'YouTube' | 'Instagram' | 'TikTok' | 'Kwai' | 'Turistas';

export type AspectRatio = '16:9' | '9:16' | '1:1' | '4:5' | '1200x628';

export type CreationStatus = 'Aguardando' | 'Gerando' | 'Pronto' | 'Disparado' | 'Agendado';

export interface NetworkConfig {
  id: SocialNetwork;
  name: string;
  formats: AspectRatio[];
  defaultFormat: AspectRatio;
  formatLabels: Record<string, string>;
  iconName: string;
  recommendedText: string;
}

export interface AIEngine {
  id: string;
  name: string;
  command?: string;
  category: 'image' | 'video' | 'voice' | 'copy' | 'design' | 'research';
  status: 'online' | 'active' | 'standby' | 'fallback';
  role: string;
  fallbackTarget?: string;
  confidence: number;
}

export interface CustomEngineOverrides {
  image?: string;
  video?: string;
  voice?: string;
  copy?: string;
  design?: string;
  research?: string;
}

export interface EngineRerouteLog {
  category: 'image' | 'video' | 'voice' | 'copy' | 'research';
  categoryLabel: string;
  primaryEngine: string;
  selectedEngine: string;
  switched: boolean;
  reason?: 'low_quality' | 'high_latency' | 'none';
  reasonDescription?: string;
  primaryQualityScore: number;
  primaryLatencyMs: number;
  selectedQualityScore: number;
  selectedLatencyMs: number;
  details: string;
}

export interface EngineExecutionTelemetry {
  totalLatencyMs: number;
  autoRerouteTriggered: boolean;
  rerouteCount: number;
  thresholds: {
    minQualityScore: number;
    maxLatencyMs: number;
  };
  engineLogs: EngineRerouteLog[];
  summary: string;
}

export interface CreationData {
  id: string;
  prompt: string;
  enhancedPrompt: string;
  title: string;
  createdAt: string;
  status: CreationStatus;
  scheduledFor?: string;
  userTags?: string[];
  selectedNetworks: SocialNetwork[];
  activeFormat: AspectRatio;
  primaryEngine: string;
  fallbackEngine: string;
  videoEngine: string;
  audioEngine: string;
  telemetry?: EngineExecutionTelemetry;
  captions: Record<string, string>;
  visualTheme: {
    title: string;
    subtitle: string;
    tags: string[];
    motionStyle: string;
    palette: string[];
    bgPattern: string;
  };
  dispatches?: Array<{
    network: string;
    timestamp: string;
    hootsuiteId: string;
    sixNineRoute: string;
    flowRouteCdn: string;
    githubCommit: string;
    status: string;
  }>;
}

export interface DispatchLog {
  id: string;
  creationId: string;
  title: string;
  timestamp: string;
  networks: string[];
  sixNineStatus: string;
  hootsuiteStatus: string;
  githubCommit: string;
  flowRouteCdn: string;
}

export interface ToneVariation {
  id: string;
  tone: string;
  badge: string;
  text: string;
  prompt: string;
  keyChanges: string;
}

export interface GrammarToneResult {
  originalPrompt: string;
  correctedPrompt: string;
  clarityScore: number;
  engagementScore: number;
  grammarScore: number;
  detectedTone: string;
  summaryCritique: string;
  improvementsList: string[];
  toneSuggestions: ToneVariation[];
}

export interface HashtagSuggestion {
  tag: string;
  category: 'trending' | 'niche' | 'visual' | 'strategy' | 'brand';
  reach?: string;
  relevanceScore?: number;
}

export interface KeywordSuggestion {
  keyword: string;
  category: 'visual' | 'seo' | 'strategy' | 'motion' | 'lighting';
  type: string;
}

export interface HashtagsKeywordsResult {
  hashtags: HashtagSuggestion[];
  keywords: KeywordSuggestion[];
  nicheDetected: string;
  audienceInsight: string;
  recommendedHook?: string;
}

