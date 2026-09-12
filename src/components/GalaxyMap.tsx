import React from 'react';
import { motion } from 'motion/react';
import { Sector, SectorId, PlayerProfile } from '../types';
import { SECTORS } from '../data/spaceLevels';
import { Lock, Star, Trophy, Rocket, Sparkles, User, Table, PenTool } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface GalaxyMapProps {
  profile: PlayerProfile;
  onSelectSector: (sector: Sector) => void;
  onOpenProfile: () => void;
  onOpenScratchpad: () => void;
  onOpenTable: () => void;
}

export const GalaxyMap: React.FC<GalaxyMapProps> = ({
  profile,
  onSelectSector,
  onOpenProfile,
  onOpenScratchpad,
  onOpenTable,
}) => {
  const totalStars = Object.values(profile.sectorStars).reduce(
    (acc: number, val: number) => acc + (val || 0),
    0
  );

  const getPlanetVisual = (icon: Sector['planetIcon']) => {
    switch (icon) {
      case 'moon':
        return {
          bg: 'from-slate-300 via-slate-400 to-zinc-600',
          ring: 'border-slate-400/40 shadow-slate-300/30',
          crater: true,
          badge: '🌕 Bulan',
        };
      case 'mars':
        return {
          bg: 'from-orange-500 via-red-600 to-rose-900',
          ring: 'border-orange-500/40 shadow-orange-500/40',
          crater: false,
          badge: '🪐 Mars',
        };
      case 'jupiter':
        return {
          bg: 'from-amber-400 via-orange-500 to-amber-900',
          ring: 'border-amber-400/40 shadow-amber-400/40',
          stripes: true,
          badge: '⚡ Jupiter',
        };
      case 'saturn':
        return {
          bg: 'from-teal-300 via-emerald-600 to-cyan-900',
          ring: 'border-teal-400/50 shadow-teal-400/40',
          hasRings: true,
          badge: '💍 Saturnus',
        };
      case 'blackhole':
        return {
          bg: 'from-purple-500 via-fuchsia-800 to-black',
          ring: 'border-purple-500/60 shadow-purple-500/50',
          vortex: true,
          badge: '🌀 Nebula Boss',
        };
    }
  };

  return (
    <div className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 flex flex-col min-h-[92vh]">
      {/* Top Navigation / Status Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-4 sm:p-5 shadow-2xl mb-8">
        {/* Profile Card / Captain Info */}
        <div
          onClick={() => {
            soundEngine.playClick();
            onOpenProfile();
          }}
          className="flex items-center gap-3 cursor-pointer group p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
          title="Buka Profil Astronot"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {profile.avatar === 'astronaut-boy' && '🧑‍🚀'}
              {profile.avatar === 'astronaut-girl' && '👩‍🚀'}
              {profile.avatar === 'space-robot' && '🤖'}
              {profile.avatar === 'cosmo-alien' && '👾'}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
                {profile.name}
              </h2>
              <User className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Kapten Penjelajah</span>
              <span>•</span>
              <span className="text-cyan-400 font-mono font-bold">{profile.xp} XP</span>
            </div>
          </div>
        </div>

        {/* Middle Stats: Total Stars & High Score */}
        <div className="flex items-center gap-4 bg-slate-950/70 border border-slate-800 px-4 py-2 rounded-xl">
          <div className="flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            <span className="font-mono font-bold text-slate-100 text-sm">
              {totalStars} / 15
            </span>
            <span className="text-[11px] text-slate-400 ml-1">Bintang</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-bold text-slate-100 text-sm">
              {profile.highScore}
            </span>
            <span className="text-[11px] text-slate-400 ml-1">Skor Tertinggi</span>
          </div>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-2">
          <button
            id="open-scratchpad-btn"
            onClick={() => {
              soundEngine.playClick();
              onOpenScratchpad();
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105"
            title="Papan Coret & Hitung Susun"
          >
            <PenTool className="w-4 h-4" />
            <span className="hidden sm:inline">Papan Coret</span>
          </button>

          <button
            id="open-table-btn"
            onClick={() => {
              soundEngine.playClick();
              onOpenTable();
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105"
            title="Matriks Perkalian 1-12"
          >
            <Table className="w-4 h-4" />
            <span className="hidden sm:inline">Tabel Perkalian</span>
          </button>
        </div>
      </header>

      {/* Main Galaxy Adventure Path */}
      <div className="flex-1 flex flex-col justify-center my-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Petualangan Matematika Kelas 5 SD
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-wide">
            PETA SEKTOR GALAKSI KOSMIK
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-lg mx-auto">
            Taklukkan setiap planet secara berurutan. Pelajari rumus perkalian bilangan bulat di tiap orbit!
          </p>
        </div>

        {/* Responsive Planet Nodes Timeline / Orbit Map */}
        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-4 my-2">
          {/* Connecting cosmic rail line on desktop */}
          <div className="hidden md:block absolute top-24 left-[10%] right-[10%] h-1 bg-gradient-to-r from-cyan-500 via-amber-500 to-purple-600 rounded-full z-0 opacity-40" />

          {SECTORS.map((sector, index) => {
            const isUnlocked = profile.unlockedSectors.includes(sector.id);
            const stars = profile.sectorStars[sector.id] || 0;
            const highScore = profile.sectorHighScores[sector.id] || 0;
            const planet = getPlanetVisual(sector.planetIcon);

            return (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative z-10 flex flex-col items-center"
              >
                {/* Planet Circle Node */}
                <button
                  id={`planet-btn-${sector.id}`}
                  disabled={!isUnlocked}
                  onClick={() => {
                    if (isUnlocked) {
                      soundEngine.playClick();
                      onSelectSector(sector);
                    }
                  }}
                  className={`relative group w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center p-2 border-2 transition-all duration-300 ${
                    planet.ring
                  } ${
                    isUnlocked
                      ? 'cursor-pointer hover:scale-105 active:scale-95 shadow-xl hover:shadow-2xl'
                      : 'opacity-50 cursor-not-allowed border-slate-700 bg-slate-900/90'
                  }`}
                >
                  {/* Planet sphere body */}
                  <div
                    className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${planet.bg} flex flex-col items-center justify-center shadow-inner relative overflow-hidden`}
                  >
                    {/* Planet atmospheric glare */}
                    <div className="absolute top-1 left-3 w-10 h-6 bg-white/25 rounded-full blur-[2px] transform -rotate-45" />

                    {/* Saturn-specific ring */}
                    {planet.hasRings && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-32 h-10 border-2 border-teal-200/60 rounded-full transform -rotate-12" />
                      </div>
                    )}

                    {/* Center Icon: Locked vs Sector Info */}
                    {!isUnlocked ? (
                      <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center z-10">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 bg-white/80 px-2 py-0.5 rounded-full mb-1">
                          Sektor {sector.number}
                        </span>
                        <span className="text-xs font-extrabold text-white drop-shadow-md">
                          {sector.name.split(' ')[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Active Ship badge if current or unlocked */}
                  {isUnlocked && (
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -top-2 right-2 bg-cyan-500 text-slate-950 p-1.5 rounded-full shadow-lg"
                      title="Misi Terbuka"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                    </motion.div>
                  )}
                </button>

                {/* Planet Info Card Below */}
                <div className="mt-3 text-center w-full px-2">
                  <div className="font-bold text-sm text-slate-100 flex items-center justify-center gap-1">
                    <span>{sector.name}</span>
                  </div>
                  <div className="text-[11px] text-cyan-300 font-medium line-clamp-1 mt-0.5">
                    {sector.conceptTitle}
                  </div>

                  {/* Stars earned for this sector */}
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[1, 2, 3].map((starIndex) => (
                      <Star
                        key={starIndex}
                        className={`w-4 h-4 ${
                          starIndex <= stars
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>

                  {isUnlocked && highScore > 0 && (
                    <div className="text-[11px] font-mono text-emerald-400 mt-1">
                      Skor: {highScore}
                    </div>
                  )}

                  {isUnlocked && (
                    <button
                      id={`start-btn-${sector.id}`}
                      onClick={() => {
                        soundEngine.playClick();
                        onSelectSector(sector);
                      }}
                      className="mt-2.5 px-3 py-1 bg-cyan-600/80 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg shadow transition-colors"
                    >
                      {stars > 0 ? 'Tantang Lagi' : 'Mulai Misi'}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Instructions for Grade 5 */}
      <footer className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-center text-xs text-slate-400">
        🚀 <strong className="text-slate-200">Tips Kapten:</strong> Setiap sektor mengajarkan teknik perkalian bilangan bulat yang berbeda: dari kelipatan 10, perkalian 2 digit, hingga hukum tanda (+) dan (-) di Saturnus!
      </footer>
    </div>
  );
};
