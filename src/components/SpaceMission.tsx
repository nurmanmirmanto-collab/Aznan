import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Sector, PlayerProfile } from '../types';
import { generateQuestionsForSector } from '../data/spaceLevels';
import { soundEngine } from '../utils/audio';
import {
  Shield,
  Zap,
  HelpCircle,
  PenTool,
  Table,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';

interface SpaceMissionProps {
  sector: Sector;
  profile: PlayerProfile;
  onMissionComplete: (score: number, finalShield: number) => void;
  onAbortMission: () => void;
  onOpenScratchpadWithNums: (n1: number, n2: number) => void;
  onOpenTable: () => void;
}

export const SpaceMission: React.FC<SpaceMissionProps> = ({
  sector,
  profile,
  onMissionComplete,
  onAbortMission,
  onOpenScratchpadWithNums,
  onOpenTable,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shield, setShield] = useState(100);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [laserFiring, setLaserFiring] = useState(false);
  const [cockpitShaking, setCockpitShaking] = useState(false);

  // Initialize questions
  useEffect(() => {
    const qList = generateQuestionsForSector(sector.id);
    setQuestions(qList);
    setCurrentIndex(0);
    setShield(100);
    setScore(0);
    setStreak(0);
    setIsAnswered(false);
    setSelectedOption(null);
  }, [sector.id]);

  const currentQ = questions[currentIndex];

  // Keyboard shortcut listener (1, 2, 3, 4)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered || !currentQ) return;
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionIndex = parseInt(e.key, 10) - 1;
        if (currentQ.options[optionIndex] !== undefined) {
          handleSelectOption(currentQ.options[optionIndex]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, currentQ]);

  const handleSelectOption = (optionValue: number) => {
    if (isAnswered || !currentQ) return;

    soundEngine.playLaser();
    setLaserFiring(true);
    setTimeout(() => setLaserFiring(false), 500);

    setSelectedOption(optionValue);
    setIsAnswered(true);

    const correct = optionValue === currentQ.answer;
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playCorrect();
      const currentStreak = streak + 1;
      setStreak(currentStreak);

      const multiplier = Math.min(currentStreak, 4);
      const pointsEarned = 100 * multiplier;
      setScore((prev) => prev + pointsEarned);

      // Reward shield slightly if damaged
      setShield((prev) => Math.min(100, prev + 5));
    } else {
      soundEngine.playWrong();
      setStreak(0);
      setCockpitShaking(true);
      setTimeout(() => setCockpitShaking(false), 600);
      setShield((prev) => Math.max(10, prev - 20));
    }
  };

  const handleNextQuestion = () => {
    soundEngine.playClick();
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswered(false);
      setSelectedOption(null);
      setShowHint(false);
    } else {
      // Mission finished!
      onMissionComplete(score, shield);
    }
  };

  const handleRetryCurrentQuestion = () => {
    soundEngine.playClick();
    setIsAnswered(false);
    setSelectedOption(null);
    setShowHint(true);
  };

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-cyan-400 font-mono">
        Mempersiapkan rute misi luar angkasa...
      </div>
    );
  }

  // Visual styling for target based on planet
  const getEnemyVisual = () => {
    switch (sector.planetIcon) {
      case 'moon':
        return { emoji: '🛰️', name: 'Satelit Sinyal Bulan', glow: 'shadow-cyan-500/30' };
      case 'mars':
        return { emoji: '☄️', name: 'Asteroid Merah Mars', glow: 'shadow-orange-500/40' };
      case 'jupiter':
        return { emoji: '🌪️', name: 'Pusaran Gas Jupiter', glow: 'shadow-yellow-500/40' };
      case 'saturn':
        return { emoji: '🧊', name: 'Komet Es Gravitasi Saturnus', glow: 'shadow-teal-500/40' };
      case 'blackhole':
        return { emoji: '👾', name: 'Titan Lubang Hitam Nebula', glow: 'shadow-purple-500/50' };
    }
  };

  const enemy = getEnemyVisual();

  return (
    <div
      className={`relative z-10 w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 flex flex-col min-h-[90vh] transition-transform ${
        cockpitShaking ? 'animate-bounce' : ''
      }`}
    >
      {/* Cockpit HUD Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-3 sm:p-4 shadow-2xl mb-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Sector & Abort */}
        <div className="flex items-center gap-3">
          <button
            id="abort-mission-btn"
            onClick={() => {
              soundEngine.playClick();
              onAbortMission();
            }}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 text-xs font-bold transition-colors"
            title="Keluar ke Peta Galaksi"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Peta</span>
          </button>

          <div>
            <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              {sector.name}
            </div>
            <div className="text-xs sm:text-sm font-black text-white">
              Target {currentIndex + 1} dari {questions.length}
            </div>
          </div>
        </div>

        {/* Middle: Progress indicators */}
        <div className="flex items-center gap-1.5">
          {questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx < currentIndex
                  ? 'w-4 bg-emerald-400'
                  : idx === currentIndex
                  ? 'w-6 bg-cyan-400 animate-pulse'
                  : 'w-2.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Right: Score, Shield & Streak */}
        <div className="flex items-center gap-4">
          {/* Streak Flame */}
          {streak > 1 && (
            <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-black animate-pulse">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{streak}x Combo</span>
            </div>
          )}

          {/* Score Counter */}
          <div className="text-right">
            <div className="text-[10px] text-slate-400">Skor Misi</div>
            <div className="text-sm sm:text-base font-black font-mono text-cyan-300">
              {score}
            </div>
          </div>

          {/* Shield HP Bar */}
          <div className="w-24 sm:w-32">
            <div className="flex items-center justify-between text-[10px] text-slate-300 mb-0.5">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-cyan-400" />
                Perisai
              </span>
              <span className="font-mono font-bold">{shield}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-500 ${
                  shield > 50
                    ? 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                    : shield > 25
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${shield}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Mission Arena / Cockpit View */}
      <div className="flex-1 bg-slate-950/90 border-2 border-cyan-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
        {/* Cockpit Targeting Crosshair overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full border border-cyan-500/40 rounded-3xl" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-500/40" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-500/40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-400 rounded-full" />
        </div>

        {/* Laser beam effect */}
        {laserFiring && (
          <motion.div
            initial={{ scaleY: 0, opacity: 1 }}
            animate={{ scaleY: 1, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-full bg-gradient-to-t from-cyan-400 via-blue-400 to-white shadow-[0_0_20px_#38bdf8] pointer-events-none z-30 origin-bottom"
          />
        )}

        {/* Top Arena Action Bar (Tools) */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <button
              id="mission-scratchpad-btn"
              onClick={() => {
                soundEngine.playClick();
                onOpenScratchpadWithNums(currentQ.factorA, currentQ.factorB);
              }}
              className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all hover:scale-105"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Buka Papan Coret ({currentQ.factorA} × {currentQ.factorB})</span>
            </button>

            <button
              id="mission-table-btn"
              onClick={() => {
                soundEngine.playClick();
                onOpenTable();
              }}
              className="px-3 py-1.5 bg-slate-900/90 hover:bg-slate-800 text-indigo-300 border border-indigo-500/40 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow transition-all hover:scale-105"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tabel Perkalian</span>
            </button>
          </div>

          <button
            id="toggle-hint-btn"
            onClick={() => {
              soundEngine.playClick();
              setShowHint(!showHint);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
              showHint
                ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-slate-600'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Petunjuk Komputer</span>
          </button>
        </div>

        {/* Hint banner */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="relative z-10 mt-2 p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-start gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 block">Petunjuk Taktis:</strong>
                {currentQ.hint}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Central Display: Target & Math Problem */}
        <div className="relative z-10 flex flex-col items-center my-4 sm:my-6 text-center">
          {/* Target Celestial Object */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-900/80 border-2 border-cyan-400/50 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl ${enemy.glow} mb-3`}
          >
            <span>{enemy.emoji}</span>
          </motion.div>

          {/* Story Prompt */}
          {currentQ.storyPrompt && (
            <div className="max-w-xl bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-slate-200 mb-3 leading-relaxed">
              <span className="text-cyan-400 font-semibold mr-1.5">Transmisi:</span>
              "{currentQ.storyPrompt}"
            </div>
          )}

          {/* Big Math Equation */}
          <div className="bg-slate-900/95 border-2 border-cyan-500/60 rounded-2xl px-6 py-4 shadow-xl shadow-cyan-950 flex items-center gap-3">
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-wider text-white">
              {currentQ.factorA < 0 ? `(${currentQ.factorA})` : currentQ.factorA}
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400">×</span>
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-wider text-white">
              {currentQ.factorB < 0 ? `(${currentQ.factorB})` : currentQ.factorB}
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-400">=</span>
            <span className="text-3xl sm:text-5xl font-black font-mono tracking-wider text-amber-400 animate-pulse">
              ?
            </span>
          </div>

          <div className="text-xs text-slate-400 mt-2 font-medium">
            Pilih frekuensi energi yang tepat untuk menembak sasaran:
          </div>
        </div>

        {/* Bottom Arena: 4 Answer Options (Energy Pods) */}
        <div className="relative z-10 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              const isTargetCorrect = opt === currentQ.answer;

              let btnStyle =
                'bg-slate-900/90 border-slate-700 text-slate-100 hover:border-cyan-400 hover:bg-slate-800/90 hover:scale-[1.02] shadow-lg';

              if (isAnswered) {
                if (isTargetCorrect) {
                  btnStyle =
                    'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.4)] scale-105';
                } else if (isSelected && !isTargetCorrect) {
                  btnStyle =
                    'bg-rose-950/80 border-rose-500 text-rose-300 line-through opacity-70';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-800 text-slate-600 opacity-40';
                }
              }

              return (
                <button
                  key={i}
                  id={`option-btn-${i + 1}`}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`relative p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${btnStyle}`}
                >
                  <span className="absolute top-2 left-2 text-[10px] font-mono font-bold text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                    [{i + 1}]
                  </span>
                  <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback & Next Button Drawer */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 ${
                  isCorrect
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                    : 'bg-rose-950/70 border-rose-500/50 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  {isCorrect ? (
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <div className="font-bold text-sm sm:text-base flex items-center gap-2">
                      <span>{isCorrect ? 'Tembakan Tepat Sasaran!' : 'Sistem Meleset!'}</span>
                      {isCorrect && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                          +{100 * Math.min(streak, 4)} Poin
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                      {currentQ.explanation}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  {!isCorrect && (
                    <button
                      id="retry-question-btn"
                      onClick={handleRetryCurrentQuestion}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Coba Lagi</span>
                    </button>
                  )}

                  <button
                    id="next-question-btn"
                    onClick={handleNextQuestion}
                    className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
                  >
                    <span>
                      {currentIndex + 1 < questions.length
                        ? 'Target Berikutnya'
                        : 'Selesaikan Misi'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
