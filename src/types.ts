export type SectorId = 'sector-1' | 'sector-2' | 'sector-3' | 'sector-4' | 'sector-5';

export interface Question {
  id: string;
  factorA: number;
  factorB: number;
  answer: number;
  options: number[];
  storyPrompt?: string; // Optional space-themed story context
  hint: string;
  explanation: string;
  type: 'basic' | 'multiple-of-10' | 'two-by-one' | 'two-by-two' | 'integers-sign' | 'word-problem';
}

export interface Sector {
  id: SectorId;
  number: number;
  name: string;
  planetName: string;
  description: string;
  conceptTitle: string;
  conceptSummary: string[];
  themeColor: string; // e.g., 'from-cyan-500 to-blue-600'
  accentColor: string;
  planetIcon: 'moon' | 'mars' | 'jupiter' | 'saturn' | 'blackhole';
  totalQuestions: number;
  unlockedByDefault?: boolean;
}

export interface PlayerProfile {
  name: string;
  avatar: string;
  shipColor: string;
  xp: number;
  highScore: number;
  soundEnabled: boolean;
  unlockedSectors: SectorId[];
  sectorStars: Record<SectorId, number>; // 0 to 3 stars
  sectorHighScores: Record<SectorId, number>;
  badges: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}
