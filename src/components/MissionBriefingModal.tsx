import React from 'react';
import { motion } from 'motion/react';
import { Sector } from '../types';
import { X, Rocket, Sparkles, Compass, ShieldAlert, Award } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MissionBriefingModalProps {
  sector: Sector | null;
  isOpen: boolean;
  onClose: () => void;
  onStartMission: (sector: Sector) => void;
  highScore?: number;
  stars?: number;
}

export const MissionBriefingModal: React.FC<MissionBriefingModalProps> = ({
  sector,
  isOpen,
  onClose,
  onStartMission,
  highScore = 0,
  stars = 0,
}) => {
  if (!isOpen || !sector) return null;

  return (
    <div
      id="briefing-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        id="briefing-modal-card"
        className="w-full max-w-xl bg-slate-900 border-2 border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header with gradient banner */}
        <div className={`p-6 bg-gradient-to-r ${sector.themeColor} relative overflow-hidden border-b border-white/10`}>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 text-cyan-300 text-xs font-semibold backdrop-blur-sm mb-2">
              <Compass className="w-3.5 h-3.5" />
              Sektor {sector.number} • {sector.planetName}
            </div>
            <h2 className="text-2xl font-black text-white tracking-wide">{sector.name}</h2>
            <p className="text-sm text-slate-200 mt-1 max-w-md">{sector.description}</p>
          </div>

          <button
            id="close-briefing-btn"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-lg bg-black/30 hover:bg-black/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Status Record */}
          <div className="flex items-center justify-between p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400">Peringkat & Skor Terbaik</div>
                <div className="text-sm font-bold text-slate-200">
                  {highScore > 0 ? `${highScore} Poin` : 'Belum Pernah Selesai'}
                </div>
              </div>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map((starIndex) => (
                <span
                  key={starIndex}
                  className={`text-lg ${starIndex <= stars ? 'text-amber-400' : 'text-slate-700'}`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Educational Concept / Captain's Guide */}
          <div className="bg-slate-800/80 border border-cyan-500/30 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Panduan Komputer Kapal: {sector.conceptTitle}</span>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
              {sector.conceptSummary.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Special Mission Rules Alert */}
          <div className="p-3.5 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-200 leading-relaxed">
              <strong className="text-indigo-300 block mb-0.5">Tujuan & Ketentuan Misi:</strong>
              Jawab 6 soal matematika perkalian. Tiap jawaban benar menambah energi perisai dan meluncurkan laser pertahanan. Gunakan papan coret-coret jika butuh menghitung susun!
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
          >
            Batal
          </button>

          <button
            id="launch-mission-btn"
            onClick={() => {
              soundEngine.playWarp();
              onStartMission(sector);
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black rounded-xl shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
          >
            <Rocket className="w-4 h-4 text-slate-950" />
            <span>Luncurkan Misi Sekarang</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
