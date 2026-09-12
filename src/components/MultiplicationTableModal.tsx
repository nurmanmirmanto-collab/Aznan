import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Table, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MultiplicationTableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MultiplicationTableModal: React.FC<MultiplicationTableModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  const [highlightCol, setHighlightCol] = useState<number | null>(null);

  if (!isOpen) return null;

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div
      id="multiplication-table-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        id="multiplication-table-modal"
        className="w-full max-w-3xl bg-slate-900 border-2 border-indigo-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Matriks Perkalian Kosmik 1 - 12</h3>
              <p className="text-xs text-indigo-300">Arahkan kursor atau sentuh angka untuk melihat hasil kali persilangan</p>
            </div>
          </div>

          <button
            id="close-table-btn"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected preview bar */}
        <div className="bg-slate-950/80 px-5 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Pilihan:</span>
            {highlightRow && highlightCol ? (
              <span className="font-mono font-bold text-amber-300 text-base">
                {highlightRow} × {highlightCol} = {highlightRow * highlightCol}
              </span>
            ) : (
              <span className="text-slate-500 text-xs italic">Sentuh kotak perkalian di bawah</span>
            )}
          </div>
          <button
            onClick={() => {
              setHighlightRow(null);
              setHighlightCol(null);
            }}
            className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
          >
            Reset Sorotan
          </button>
        </div>

        {/* Matrix Grid */}
        <div className="flex-1 overflow-auto p-4 flex justify-center">
          <div className="inline-block border border-slate-700 rounded-xl overflow-hidden bg-slate-950/90 shadow-2xl">
            <table className="border-collapse text-center select-none">
              <thead>
                <tr>
                  <th className="w-9 h-9 sm:w-11 sm:h-11 bg-slate-900 border border-slate-800 text-indigo-400 font-bold text-xs sm:text-sm">
                    ×
                  </th>
                  {numbers.map((col) => (
                    <th
                      key={col}
                      onClick={() => setHighlightCol(col)}
                      className={`w-9 h-9 sm:w-11 sm:h-11 border border-slate-800 text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                        highlightCol === col ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {numbers.map((row) => (
                  <tr key={row}>
                    <th
                      onClick={() => setHighlightRow(row)}
                      className={`w-9 h-9 sm:w-11 sm:h-11 border border-slate-800 text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
                        highlightRow === row ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {row}
                    </th>
                    {numbers.map((col) => {
                      const isIntersection = highlightRow === row && highlightCol === col;
                      const isInRowOrCol = highlightRow === row || highlightCol === col;
                      const isDiagonal = row === col;
                      return (
                        <td
                          key={col}
                          onClick={() => {
                            soundEngine.playClick();
                            setHighlightRow(row);
                            setHighlightCol(col);
                          }}
                          className={`w-9 h-9 sm:w-11 sm:h-11 border border-slate-800/80 text-xs sm:text-sm font-mono cursor-pointer transition-all ${
                            isIntersection
                              ? 'bg-amber-500 text-slate-950 font-black scale-110 shadow-lg z-10'
                              : isInRowOrCol
                              ? 'bg-indigo-950/70 text-indigo-200 font-semibold'
                              : isDiagonal
                              ? 'bg-slate-900/60 text-cyan-300'
                              : 'text-slate-300 hover:bg-slate-800/60'
                          }`}
                        >
                          {row * col}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Tips: Angka diagonal adalah hasil kuadrat (pangkat dua) dari bilangan bulat!</span>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs"
          >
            Tutup Matriks
          </button>
        </div>
      </motion.div>
    </div>
  );
};
