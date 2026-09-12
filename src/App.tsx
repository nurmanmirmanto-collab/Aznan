/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PlayerProfile, Sector, SectorId, Badge } from './types';
import { SECTORS, INITIAL_BADGES } from './data/spaceLevels';
import { StarfieldBackground } from './components/StarfieldBackground';
import { GalaxyMap } from './components/GalaxyMap';
import { SpaceMission } from './components/SpaceMission';
import { MissionBriefingModal } from './components/MissionBriefingModal';
import { ScratchpadModal } from './components/ScratchpadModal';
import { MultiplicationTableModal } from './components/MultiplicationTableModal';
import { VictoryModal } from './components/VictoryModal';
import { AstronautProfileModal } from './components/AstronautProfileModal';
import { soundEngine } from './utils/audio';

const STORAGE_KEY = 'kosmomath_kelas5_profile';

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Kapten Arya',
  avatar: 'astronaut-boy',
  shipColor: 'cyan',
  xp: 150,
  highScore: 0,
  soundEnabled: true,
  unlockedSectors: ['sector-1'],
  sectorStars: {
    'sector-1': 0,
    'sector-2': 0,
    'sector-3': 0,
    'sector-4': 0,
    'sector-5': 0,
  },
  sectorHighScores: {
    'sector-1': 0,
    'sector-2': 0,
    'sector-3': 0,
    'sector-4': 0,
    'sector-5': 0,
  },
  badges: ['cadet'],
};

export default function App() {
  // Load profile from localStorage
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          sectorStars: { ...DEFAULT_PROFILE.sectorStars, ...(parsed.sectorStars || {}) },
          sectorHighScores: { ...DEFAULT_PROFILE.sectorHighScores, ...(parsed.sectorHighScores || {}) },
          unlockedSectors: parsed.unlockedSectors || ['sector-1'],
          badges: parsed.badges || ['cadet'],
        };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  // Sync sound engine enabled flag
  useEffect(() => {
    soundEngine.enabled = profile.soundEnabled;
  }, [profile.soundEnabled]);

  // Persist profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  // Screen state
  const [activeScreen, setActiveScreen] = useState<'map' | 'mission'>('map');
  const [activeSector, setActiveSector] = useState<Sector | null>(null);

  // Modals state
  const [briefingSector, setBriefingSector] = useState<Sector | null>(null);
  const [scratchpadOpen, setScratchpadOpen] = useState(false);
  const [scratchpadNums, setScratchpadNums] = useState<{ n1: number; n2: number }>({
    n1: 24,
    n2: 6,
  });
  const [tableModalOpen, setTableModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Victory modal state
  const [victoryData, setVictoryData] = useState<{
    isOpen: boolean;
    sector: Sector | null;
    score: number;
    finalShield: number;
    earnedStars: number;
    newBadges: string[];
    nextSectorId: SectorId | null;
  }>({
    isOpen: false,
    sector: null,
    score: 0,
    finalShield: 100,
    earnedStars: 3,
    newBadges: [],
    nextSectorId: null,
  });

  // Badges list with unlock status
  const badgesWithStatus: Badge[] = INITIAL_BADGES.map((b) => ({
    ...b,
    unlocked: profile.badges.includes(b.id),
  }));

  // Handle Sector Click from Map
  const handleSelectSector = (sector: Sector) => {
    setBriefingSector(sector);
  };

  // Launch Mission from Briefing
  const handleStartMission = (sector: Sector) => {
    setBriefingSector(null);
    setActiveSector(sector);
    setActiveScreen('mission');
  };

  // Handle Mission Completion
  const handleMissionComplete = (score: number, finalShield: number) => {
    if (!activeSector) return;

    // Calculate stars
    let earnedStars = 1;
    if (finalShield >= 80) {
      earnedStars = 3;
    } else if (finalShield >= 40) {
      earnedStars = 2;
    }

    // Determine next sector
    const sectorSequence: SectorId[] = [
      'sector-1',
      'sector-2',
      'sector-3',
      'sector-4',
      'sector-5',
    ];
    const currentIndex = sectorSequence.indexOf(activeSector.id);
    const nextSectorId =
      currentIndex < sectorSequence.length - 1 ? sectorSequence[currentIndex + 1] : null;

    // Check newly unlocked badges
    const newBadges: string[] = [];
    const badgeMap: Record<SectorId, string> = {
      'sector-1': 'luna-master',
      'sector-2': 'mars-destroyer',
      'sector-3': 'jupiter-shield',
      'sector-4': 'gravity-master',
      'sector-5': 'galaxy-hero',
    };

    const sectorBadge = badgeMap[activeSector.id];
    if (sectorBadge && !profile.badges.includes(sectorBadge)) {
      newBadges.push(sectorBadge);
    }

    // Update profile
    setProfile((prev) => {
      const updatedUnlocked = new Set(prev.unlockedSectors);
      if (nextSectorId) {
        updatedUnlocked.add(nextSectorId);
      }

      const updatedBadges = new Set([...prev.badges, ...newBadges]);

      const prevStars = prev.sectorStars[activeSector.id] || 0;
      const prevHighScore = prev.sectorHighScores[activeSector.id] || 0;

      return {
        ...prev,
        xp: prev.xp + score,
        highScore: Math.max(prev.highScore, score),
        unlockedSectors: Array.from(updatedUnlocked),
        badges: Array.from(updatedBadges),
        sectorStars: {
          ...prev.sectorStars,
          [activeSector.id]: Math.max(prevStars, earnedStars),
        },
        sectorHighScores: {
          ...prev.sectorHighScores,
          [activeSector.id]: Math.max(prevHighScore, score),
        },
      };
    });

    // Show Victory Screen
    setVictoryData({
      isOpen: true,
      sector: activeSector,
      score,
      finalShield,
      earnedStars,
      newBadges,
      nextSectorId,
    });
  };

  const handleNextSectorFromVictory = (nextId: SectorId) => {
    const nextSec = SECTORS.find((s) => s.id === nextId);
    setVictoryData((prev) => ({ ...prev, isOpen: false }));
    if (nextSec) {
      setActiveSector(nextSec);
      setActiveScreen('mission');
    } else {
      setActiveScreen('map');
    }
  };

  const handleReplaySector = () => {
    setVictoryData((prev) => ({ ...prev, isOpen: false }));
    if (activeSector) {
      setActiveScreen('mission');
    }
  };

  const handleBackToMap = () => {
    setVictoryData((prev) => ({ ...prev, isOpen: false }));
    setActiveScreen('map');
  };

  const handleUpdateProfile = (updated: Partial<PlayerProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleResetProgress = () => {
    setProfile(DEFAULT_PROFILE);
    localStorage.removeItem(STORAGE_KEY);
    setProfileModalOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Animated Deep Space Canvas Starfield */}
      <StarfieldBackground speedMultiplier={activeScreen === 'mission' ? 1.5 : 0.8} />

      {/* Main View Area */}
      <main className="relative z-10 flex-1 flex flex-col">
        {activeScreen === 'map' ? (
          <GalaxyMap
            profile={profile}
            onSelectSector={handleSelectSector}
            onOpenProfile={() => setProfileModalOpen(true)}
            onOpenScratchpad={() => {
              setScratchpadNums({ n1: 34, n2: 7 });
              setScratchpadOpen(true);
            }}
            onOpenTable={() => setTableModalOpen(true)}
          />
        ) : (
          activeSector && (
            <SpaceMission
              sector={activeSector}
              profile={profile}
              onMissionComplete={handleMissionComplete}
              onAbortMission={() => setActiveScreen('map')}
              onOpenScratchpadWithNums={(n1, n2) => {
                setScratchpadNums({ n1, n2 });
                setScratchpadOpen(true);
              }}
              onOpenTable={() => setTableModalOpen(true)}
            />
          )
        )}
      </main>

      {/* Mission Briefing Modal */}
      <MissionBriefingModal
        sector={briefingSector}
        isOpen={Boolean(briefingSector)}
        onClose={() => setBriefingSector(null)}
        onStartMission={handleStartMission}
        highScore={briefingSector ? profile.sectorHighScores[briefingSector.id] : 0}
        stars={briefingSector ? profile.sectorStars[briefingSector.id] : 0}
      />

      {/* Scratchpad & Vertical Multiplication Breakdown Modal */}
      <ScratchpadModal
        isOpen={scratchpadOpen}
        onClose={() => setScratchpadOpen(false)}
        defaultNum1={scratchpadNums.n1}
        defaultNum2={scratchpadNums.n2}
      />

      {/* Multiplication Table Modal */}
      <MultiplicationTableModal
        isOpen={tableModalOpen}
        onClose={() => setTableModalOpen(false)}
      />

      {/* Astronaut Profile & Customization Modal */}
      <AstronautProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        profile={profile}
        badges={badgesWithStatus}
        onUpdateProfile={handleUpdateProfile}
        onResetProgress={handleResetProgress}
      />

      {/* Victory / Mission Complete Modal */}
      {victoryData.sector && (
        <VictoryModal
          isOpen={victoryData.isOpen}
          sector={victoryData.sector}
          score={victoryData.score}
          finalShield={victoryData.finalShield}
          earnedStars={victoryData.earnedStars}
          newBadges={victoryData.newBadges}
          nextSectorId={victoryData.nextSectorId}
          onNextSector={handleNextSectorFromVictory}
          onReplay={handleReplaySector}
          onBackToMap={handleBackToMap}
        />
      )}
    </div>
  );
}
