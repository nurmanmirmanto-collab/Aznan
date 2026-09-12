import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sector, SectorId } from '../types';
import { Trophy, Star, RotateCcw, ArrowRight, Home, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface VictoryModalProps {
  isOpen: boolean;
  sector: Sector;
  score: number;
  finalShield: number;
  earnedStars: number;
  newBadges: string[];
  nextSectorId: SectorId | null;
  onNextSector: (nextId: SectorId) => void;
  onReplay: () => void;
  onBackToMap: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  sector,
  score,
  finalShield,
  earnedStars,
  newBadges,
  nextSectorId,
  onNextSector,
  onReplay,
  onBackToMap,
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playVictory();
      // Confetti blast
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#a855f7', '#34d399', '#f43f5e'],
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      id="victory-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        id="victory-modal-card"
        className="w-full max-w-lg bg-slate-900 border-2 border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden text-center flex flex-col"
      >
        {/* Banner */}
        <div className="p-6 bg-gradient-to-b from-amber-600/30 to-transparent flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/20">
            <Trophy className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            MISI SELESAI BERJAYA!
          </h2>
          <p className="text-sm text-cyan-300 mt-1">
            Kapten berhasil menuntaskan tantangan di {sector.name}!
          </p>

          {/* Stars */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3].map((starIndex) => {
              const isEarned = starIndex <= earnedStars;
              return (
                <motion.div
                  key={starIndex}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 + starIndex * 0.15, type: 'spring' }}
                  className={`p-2 rounded-xl border ${
                    isEarned
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/30'
                      : 'bg-slate-800/40 border-slate-700 text-slate-600'
                  }`}
                >
                  <Star className={`w-8 h-8 ${isEarned ? 'fill-amber-400' : ''}`} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-6 py-4 grid grid-cols-2 gap-3">
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Total Skor Misi</div>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">
              +{score}
            </div>
          </div>
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs text-slate-400">Integritas Perisai</div>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {finalShield}%
            </div>
          </div>
        </div>

        {/* Badges unlocked alert */}
        {newBadges.length > 0 && (
          <div className="mx-6 mb-4 p-3 bg-indigo-950/50 border border-indigo-500/40 rounded-xl flex items-center justify-center gap-2 text-indigo-200 text-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              Selamat! Kamu membuka lencana penghargaan baru di profil astronot!
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-5 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            id="back-to-map-btn"
            onClick={() => {
              soundEngine.playClick();
              onBackToMap();
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Home className="w-4 h-4" />
            Peta Galaksi
          </button>

          <button
            id="replay-sector-btn"
            onClick={() => {
              soundEngine.playClick();
              onReplay();
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Main Ulang
          </button>

          {nextSectorId && (
            <button
              id="next-sector-btn"
              onClick={() => {
                soundEngine.playWarp();
                onNextSector(nextSectorId);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105 active:scale-95"
            >
              <span>Misi Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
