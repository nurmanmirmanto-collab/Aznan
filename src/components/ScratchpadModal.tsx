import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Eraser, PenTool, Trash2, RotateCcw, Calculator, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ScratchpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultNum1?: number;
  defaultNum2?: number;
}

export const ScratchpadModal: React.FC<ScratchpadModalProps> = ({
  isOpen,
  onClose,
  defaultNum1 = 28,
  defaultNum2 = 6,
}) => {
  const [activeTab, setActiveTab] = useState<'draw' | 'step'>('draw');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#38bdf8'); // cyan
  const [isEraser, setIsEraser] = useState(false);
  const [lineWidth, setLineWidth] = useState(3);

  // Vertical multiplication calculator state
  const [calcA, setCalcA] = useState<number>(Math.abs(defaultNum1));
  const [calcB, setCalcB] = useState<number>(Math.abs(defaultNum2));
  const [stepIndex, setStepIndex] = useState<number>(0);

  // Sync inputs when defaults change
  useEffect(() => {
    setCalcA(Math.abs(defaultNum1));
    setCalcB(Math.abs(defaultNum2));
    setStepIndex(0);
  }, [defaultNum1, defaultNum2]);

  // Canvas drawing handlers
  useEffect(() => {
    if (!isOpen || activeTab !== 'draw') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [isOpen, activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.strokeStyle = isEraser ? '#0f172a' : color;
    ctx.lineWidth = isEraser ? lineWidth * 4 : lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    soundEngine.playClick();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  if (!isOpen) return null;

  // Breakdown generation for vertical multiplication
  const numA = Math.max(calcA, calcB);
  const numB = Math.min(calcA, calcB);
  const total = numA * numB;

  // Calculate digit steps
  const digitsB = String(numB).split('').reverse().map(Number);
  const stepsBreakdown = digitsB.map((digit, idx) => {
    const product = numA * digit;
    const shifted = product * Math.pow(10, idx);
    return {
      digit,
      digitPlace: idx === 0 ? 'satuan' : idx === 1 ? 'puluhan' : 'ratusan',
      product,
      shifted,
      shiftZeros: idx,
    };
  });

  return (
    <div
      id="scratchpad-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        id="scratchpad-modal-content"
        className="w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500/20 text-cyan-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Papan Coret Kosmik & Bantuan Hitung</h3>
              <p className="text-xs text-cyan-300">Gunakan untuk coret-coret hitung susun antariksa</p>
            </div>
          </div>

          <button
            id="close-scratchpad-button"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-950/60 p-2 gap-2 border-b border-slate-800">
          <button
            id="tab-draw-btn"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('draw');
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'draw'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <PenTool className="w-4 h-4" />
            Papan Coret Tulis (Canvas)
          </button>
          <button
            id="tab-step-btn"
            onClick={() => {
              soundEngine.playClick();
              setActiveTab('step');
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'step'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Simulator Hitung Susun
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden p-4 flex flex-col">
          {activeTab === 'draw' ? (
            <div className="flex-1 flex flex-col gap-3">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-800/70 p-2.5 rounded-xl border border-slate-700/60">
                <div className="flex items-center gap-2">
                  <button
                    id="pen-tool-btn"
                    onClick={() => {
                      soundEngine.playClick();
                      setIsEraser(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      !isEraser ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    Pena
                  </button>
                  <button
                    id="eraser-tool-btn"
                    onClick={() => {
                      soundEngine.playClick();
                      setIsEraser(true);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isEraser ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    Penghapus
                  </button>

                  <div className="h-4 w-px bg-slate-600 mx-1" />

                  {/* Colors */}
                  <div className="flex items-center gap-1.5">
                    {['#38bdf8', '#facc15', '#4ade80', '#ffffff'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          soundEngine.playClick();
                          setColor(c);
                          setIsEraser(false);
                        }}
                        style={{ backgroundColor: c }}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          color === c && !isEraser ? 'scale-125 border-white shadow-lg' : 'border-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  id="clear-canvas-btn"
                  onClick={clearCanvas}
                  className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-rose-500/30 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Bersihkan Layar
                </button>
              </div>

              {/* Interactive Canvas */}
              <div className="flex-1 min-h-[300px] bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden shadow-inner cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  id="scratchpad-draw-canvas"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-full block touch-none"
                />
                <div className="absolute bottom-2 right-3 pointer-events-none text-slate-600 text-xs select-none">
                  Coret atau tulis angka di sini
                </div>
              </div>
            </div>
          ) : (
            /* Vertical Multiplication Simulator */
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Uji Angka:</span>
                  <input
                    type="number"
                    value={calcA}
                    onChange={(e) => {
                      setCalcA(Number(e.target.value) || 0);
                      setStepIndex(0);
                    }}
                    className="w-20 bg-slate-900 border border-cyan-500/50 rounded-lg px-2.5 py-1 text-center font-mono font-bold text-cyan-300 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                  <span className="text-cyan-400 font-bold">×</span>
                  <input
                    type="number"
                    value={calcB}
                    onChange={(e) => {
                      setCalcB(Number(e.target.value) || 0);
                      setStepIndex(0);
                    }}
                    className="w-20 bg-slate-900 border border-cyan-500/50 rounded-lg px-2.5 py-1 text-center font-mono font-bold text-cyan-300 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setStepIndex((prev) => Math.min(prev + 1, stepsBreakdown.length + 1));
                    }}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-colors"
                  >
                    Langkah Berikutnya →
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setStepIndex(stepsBreakdown.length + 1);
                    }}
                    className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                  >
                    Buka Semua
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setStepIndex(0);
                    }}
                    className="p-1.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg"
                    title="Ulangi langkah"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Traditional Vertical Calculation Box */}
              <div className="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-6 flex flex-col items-center">
                <div className="font-mono text-2xl font-bold tracking-widest text-slate-100 flex flex-col items-end w-48">
                  <div className="text-cyan-300">{numA}</div>
                  <div className="border-b-2 border-slate-500 w-full text-right pb-1 flex justify-between items-center">
                    <span className="text-indigo-400 text-lg font-sans pl-2">×</span>
                    <span className="text-amber-300">{numB}</span>
                  </div>

                  {/* Step rows */}
                  {stepsBreakdown.map((st, i) => {
                    const isVisible = stepIndex > i;
                    return (
                      <div
                        key={i}
                        className={`w-full text-right py-1 transition-all ${
                          isVisible ? 'opacity-100 text-emerald-400' : 'opacity-20 text-slate-700'
                        }`}
                      >
                        {isVisible ? st.product * Math.pow(10, st.shiftZeros) : '---'}
                      </div>
                    );
                  })}

                  {/* Final sum */}
                  {stepsBreakdown.length > 1 && (
                    <div
                      className={`w-full border-t-2 border-slate-500 text-right pt-1.5 flex justify-between items-center transition-all ${
                        stepIndex > stepsBreakdown.length ? 'opacity-100 text-yellow-300' : 'opacity-20 text-slate-700'
                      }`}
                    >
                      <span className="text-slate-400 text-sm font-sans pl-2">+</span>
                      <span>{stepIndex > stepsBreakdown.length ? total.toLocaleString('id-ID') : '---'}</span>
                    </div>
                  )}
                  {stepsBreakdown.length === 1 && (
                    <div
                      className={`w-full border-t-2 border-slate-500 text-right pt-1.5 transition-all ${
                        stepIndex > 0 ? 'opacity-100 text-yellow-300' : 'opacity-20 text-slate-700'
                      }`}
                    >
                      {stepIndex > 0 ? total.toLocaleString('id-ID') : '---'}
                    </div>
                  )}
                </div>

                {/* Explanation notes for Grade 5 */}
                <div className="w-full mt-6 bg-slate-900/90 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-300 space-y-1.5">
                  <div className="font-semibold text-cyan-400">Penjelasan Langkah:</div>
                  {stepsBreakdown.map((st, i) => (
                    <div key={i} className={stepIndex > i ? 'text-slate-200' : 'text-slate-500'}>
                      • Langkah {i + 1}: Kalikan {numA} dengan {st.digit} ({st.digitPlace}) = {st.product}
                      {st.shiftZeros > 0 ? ` (geser ${st.shiftZeros} angka karena puluhan = ${st.shifted})` : ''}.
                    </div>
                  ))}
                  {stepsBreakdown.length > 1 && (
                    <div className={stepIndex > stepsBreakdown.length ? 'text-amber-300 font-semibold' : 'text-slate-500'}>
                      • Langkah Terakhir: Jumlahkan semua baris di atas = {total.toLocaleString('id-ID')}!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
          <button
            id="done-scratchpad-btn"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-colors"
          >
            Selesai & Kembali ke Kokpit
          </button>
        </div>
      </motion.div>
    </div>
  );
};
