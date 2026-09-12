import React, { useState } from 'react';
import { motion } from 'motion/react';
import { PlayerProfile, Badge } from '../types';
import { X, User, Rocket, Award, Volume2, VolumeX, Check, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface AstronautProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: PlayerProfile;
  badges: Badge[];
  onUpdateProfile: (updated: Partial<PlayerProfile>) => void;
  onResetProgress: () => void;
}

export const AstronautProfileModal: React.FC<AstronautProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  badges,
  onUpdateProfile,
  onResetProgress,
}) => {
  const [name, setName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [selectedShipColor, setSelectedShipColor] = useState(profile.shipColor);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const avatars = [
    { id: 'astronaut-boy', label: 'Kapten Bintang', emoji: '🧑‍🚀' },
    { id: 'astronaut-girl', label: 'Komandan Nova', emoji: '👩‍🚀' },
    { id: 'space-robot', label: 'Robot AI-7', emoji: '🤖' },
    { id: 'cosmo-alien', label: 'Sahabat Nebula', emoji: '👾' },
  ];

  const shipColors = [
    { id: 'cyan', label: 'Biru Neon', class: 'bg-cyan-500 text-cyan-400 border-cyan-400' },
    { id: 'gold', label: 'Emas Surya', class: 'bg-amber-400 text-amber-300 border-amber-300' },
    { id: 'emerald', label: 'Zamrud Komet', class: 'bg-emerald-400 text-emerald-300 border-emerald-300' },
    { id: 'ruby', label: 'Merah Supernova', class: 'bg-rose-500 text-rose-400 border-rose-400' },
  ];

  const handleSave = () => {
    soundEngine.playClick();
    onUpdateProfile({
      name: name.trim() || 'Kapten Antariksa',
      avatar: selectedAvatar,
      shipColor: selectedShipColor,
    });
    onClose();
  };

  const toggleSound = () => {
    soundEngine.playClick();
    const newSound = !profile.soundEnabled;
    soundEngine.enabled = newSound;
    onUpdateProfile({ soundEnabled: newSound });
  };

  return (
    <div
      id="profile-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        id="profile-modal-card"
        className="w-full max-w-xl bg-slate-900 border-2 border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800/90 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-100">Profil & Personalisasi Astronot</h3>
              <p className="text-xs text-cyan-300">Sesuaikan karakter dan kapal penjelajah antariksamu</p>
            </div>
          </div>

          <button
            id="close-profile-btn"
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Captain Name & Sound Setting */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nama Panggilan Kapten:
              </label>
              <input
                type="text"
                value={name}
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan namamu..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-semibold text-sm focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Efek Suara:
              </label>
              <button
                onClick={toggleSound}
                className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-colors ${
                  profile.soundEnabled
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                {profile.soundEnabled ? (
                  <>
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span>Suara Nyala</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Suara Hening</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Pilih Karakter Awak:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {avatars.map((av) => (
                <button
                  key={av.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedAvatar(av.id);
                  }}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                    selectedAvatar === av.id
                      ? 'bg-cyan-950/50 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <span className="text-3xl">{av.emoji}</span>
                  <span className="text-xs font-medium text-slate-200">{av.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ship Laser & Hull Color */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Warna Lambung & Sinar Kapal:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {shipColors.map((sc) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedShipColor(sc.id);
                  }}
                  className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
                    selectedShipColor === sc.id
                      ? 'bg-slate-800 border-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${sc.class}`} />
                  <span className="text-xs font-medium text-slate-200">{sc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Badges Collection */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Koleksi Lencana Penghargaan ({badges.filter(b => b.unlocked).length}/{badges.length}):</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                    b.unlocked
                      ? 'bg-amber-950/20 border-amber-500/30 text-slate-200'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="text-2xl">{b.icon}</div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      {b.title}
                      {b.unlocked && <Check className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight mt-0.5">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset progress area */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Mulai petualangan dari awal?</span>
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="text-xs text-rose-400 hover:text-rose-300 underline"
              >
                Reset Semua Skor & Level
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onResetProgress();
                    setShowResetConfirm(false);
                  }}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded text-xs font-bold"
                >
                  Ya, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-950/90 border-t border-slate-800 flex justify-end gap-2.5">
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Batal
          </button>
          <button
            id="save-profile-btn"
            onClick={handleSave}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-600/20"
          >
            Simpan Perubahan
          </button>
        </div>
      </motion.div>
    </div>
  );
};
