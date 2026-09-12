import { Badge, Question, Sector, SectorId } from '../types';

export const SECTORS: Sector[] = [
  {
    id: 'sector-1',
    number: 1,
    name: 'Stasiun Orbit Bulan',
    planetName: 'Orbit Bulan (Luna Station)',
    description: 'Nyalakan kembali pemancar satelit dengan menguasai perkalian dasar dan perkalian kelipatan 10!',
    conceptTitle: 'Trik Nol Kelipatan 10 & Perkalian Dasar',
    conceptSummary: [
      'Kalikan angka dasarnya terlebih dahulu (misal: 4 × 6 = 24).',
      'Jika ada nol di akhir (misal: 40 × 6), tempelkan jumlah angka nol tersebut di belakang hasil (240).',
      'Contoh: 30 × 50 = (3 × 5) lalu tambah dua nol = 1.500.'
    ],
    themeColor: 'from-blue-600 via-indigo-700 to-slate-900',
    accentColor: '#38bdf8',
    planetIcon: 'moon',
    totalQuestions: 6,
    unlockedByDefault: true,
  },
  {
    id: 'sector-2',
    number: 2,
    name: 'Sabuk Asteroid Mars',
    planetName: 'Orbit Planet Merah (Mars)',
    description: 'Radar mendeteksi hujan asteroid! Tembak asteroid dengan menghitung perkalian 2 digit dengan 1 digit!',
    conceptTitle: 'Metode Dekomposisi & Hitung Susun 2 × 1 Digit',
    conceptSummary: [
      'Pisahkan bilangan puluhan dan satuannya: misal 34 × 6.',
      'Langkah 1: Kalikan puluhannya -> 30 × 6 = 180.',
      'Langkah 2: Kalikan satuannya -> 4 × 6 = 24.',
      'Langkah 3: Jumlahkan hasilnya -> 180 + 24 = 204!'
    ],
    themeColor: 'from-orange-600 via-rose-700 to-stone-900',
    accentColor: '#fb923c',
    planetIcon: 'mars',
    totalQuestions: 6,
  },
  {
    id: 'sector-3',
    number: 3,
    name: 'Badai Cincin Jupiter',
    planetName: 'Raksasa Gas (Jupiter)',
    description: 'Kendalikan perisai ionik pesawat dari pusaran badai dengan menuntaskan perkalian 2 digit × 2 digit!',
    conceptTitle: 'Perkalian 2 Digit × 2 Digit (Metode Susun)',
    conceptSummary: [
      'Contoh: 24 × 15.',
      'Kalikan 24 dengan satuan (5) = 120.',
      'Kalikan 24 dengan puluhan (1 puluhan / 10) = 240.',
      'Jumlahkan kedua baris: 120 + 240 = 360.'
    ],
    themeColor: 'from-amber-600 via-yellow-700 to-neutral-900',
    accentColor: '#facc15',
    planetIcon: 'jupiter',
    totalQuestions: 6,
  },
  {
    id: 'sector-4',
    number: 4,
    name: 'Cincin Es Saturnus',
    planetName: 'Cincin Saturnus (Zero-Gravity)',
    description: 'Medan anomali gravitasi ekstrem! Pelajari aturan perkalian bilangan bulat positif dan negatif.',
    conceptTitle: 'Hukum Tanda Perkalian Bilangan Bulat',
    conceptSummary: [
      '(+) × (+) = (+) -> Positif dikali Positif hasilnya Positif',
      '(+) × (-) = (-) -> Positif dikali Negatif hasilnya Negatif',
      '(-) × (+) = (-) -> Negatif dikali Positif hasilnya Negatif',
      '(-) × (-) = (+) -> Tanda sama jadi POSITIF, tanda beda jadi NEGATIF!'
    ],
    themeColor: 'from-teal-600 via-cyan-800 to-slate-950',
    accentColor: '#2dd4bf',
    planetIcon: 'saturn',
    totalQuestions: 6,
  },
  {
    id: 'sector-5',
    number: 5,
    name: 'Lubang Hitam Nebula Misteri',
    planetName: 'Inti Galaksi (Black Hole Boss)',
    description: 'Pertempuran puncak melawan Titan Galaksi! Pecahkan soal cerita kosmik dan tantangan perkalian komprehensif.',
    conceptTitle: 'Misi Komprehensif & Soal Cerita Antariksa',
    conceptSummary: [
      'Baca soal dengan cermat dan cari kata kunci angka.',
      'Tentukan tanda positif / negatif berdasarkan arah (maju/mundur, naik/turun).',
      'Gunakan papan cakar / coret-coret digital untuk menghitung dengan teliti.'
    ],
    themeColor: 'from-purple-600 via-fuchsia-800 to-slate-950',
    accentColor: '#c084fc',
    planetIcon: 'blackhole',
    totalQuestions: 6,
  },
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'cadet',
    title: 'Kadet Antariksa',
    description: 'Mulai petualangan kosmik pertamamu.',
    icon: '🚀',
    unlocked: true,
  },
  {
    id: 'luna-master',
    title: 'Penakluk Bulan',
    description: 'Selesaikan Sektor 1 dengan gemilang.',
    icon: '🌕',
    unlocked: false,
  },
  {
    id: 'mars-destroyer',
    title: 'Pemusnah Asteroid',
    description: 'Kuasai perkalian 2 digit x 1 digit di Mars.',
    icon: '☄️',
    unlocked: false,
  },
  {
    id: 'jupiter-shield',
    title: 'Perisai Badai Jupiter',
    description: 'Tembus badai raksasa dengan perkalian 2 digit x 2 digit.',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'gravity-master',
    title: 'Pengendali Tanda Bilangan',
    description: 'Taklukkan hukum tanda positif & negatif di Saturnus.',
    icon: '🪐',
    unlocked: false,
  },
  {
    id: 'galaxy-hero',
    title: 'Pahlawan Galaksi',
    description: 'Kalahkan Boss Lubang Hitam dan raih skor tertinggi!',
    icon: '👑',
    unlocked: false,
  },
];

// Helper to generate distinct wrong choices close to correct answer
function generateDistractors(correctAnswer: number, count: number = 3): number[] {
  const distractors = new Set<number>();
  const isNegative = correctAnswer < 0;
  const absAns = Math.abs(correctAnswer);

  // Common student errors:
  // 1. Inverted sign if negative/positive
  if (correctAnswer !== 0) {
    distractors.add(-correctAnswer);
  }

  // 2. Off by +/- 10
  distractors.add(correctAnswer + 10);
  distractors.add(correctAnswer - 10);

  // 3. Off by +/- 2, 4, 5
  distractors.add(correctAnswer + 5);
  distractors.add(correctAnswer - 5);
  distractors.add(correctAnswer + (absAns > 20 ? 12 : 2));
  distractors.add(correctAnswer - (absAns > 20 ? 12 : 2));

  const validArray = Array.from(distractors).filter(d => d !== correctAnswer);
  // shuffle and take needed count
  const shuffled = validArray.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function generateQuestionsForSector(sectorId: SectorId): Question[] {
  const questions: Question[] = [];

  if (sectorId === 'sector-1') {
    // Basic multiplication & multiples of 10
    const pool = [
      {
        a: 7,
        b: 8,
        story: 'Satelit komunikasi membutuhkan energi 7 volt pada 8 sel surya.',
        hint: 'Ingat perkalian 7 sebanyak 8 kali: 7 × 8.',
        exp: '7 × 8 = 56 volt energi terisi!',
      },
      {
        a: 40,
        b: 6,
        story: 'Kapal melepaskan 6 drone penjelajah, tiap drone memindai 40 km area orbit.',
        hint: 'Hitung 4 × 6 terlebih dahulu, kemudian tambahkan angka 0 di belakangnya.',
        exp: '4 × 6 = 24. Tambah satu nol di belakang menjadi 240 km.',
      },
      {
        a: 9,
        b: 6,
        story: 'Sensor radar mendeteksi 9 frekuensi sinyal di 6 stasiun pengawas bulan.',
        hint: '9 × 6 sama dengan (10 × 6) - 6.',
        exp: '9 × 6 = 54 sinyal terhubung!',
      },
      {
        a: 50,
        b: 30,
        story: 'Reaktor fusi memproses 50 partikel per detik selama 30 detik.',
        hint: 'Kalikan 5 × 3 = 15, lalu pasang dua angka nol dari 50 dan 30.',
        exp: '5 × 3 = 15. Tambah dua angka nol = 1.500 partikel.',
      },
      {
        a: 8,
        b: 9,
        story: 'Turbin oksigen berputar 8 kali per putaran pada 9 siklus kabin astronot.',
        hint: '8 × 9 = 72.',
        exp: '8 × 9 = 72 siklus oksigen bersih!',
      },
      {
        a: 70,
        b: 8,
        story: 'Tiap modul cadangan bahan bakar memuat 70 liter hidrogen cair. Ada 8 modul terpasang.',
        hint: 'Hitung 7 × 8 = 56, lalu tambahkan nol.',
        exp: '70 × 8 = 560 liter hidrogen cair.',
      },
    ];

    pool.forEach((item, index) => {
      const ans = item.a * item.b;
      const options = [ans, ...generateDistractors(ans, 3)].sort(() => 0.5 - Math.random());
      questions.push({
        id: `s1-${index + 1}`,
        factorA: item.a,
        factorB: item.b,
        answer: ans,
        options,
        storyPrompt: item.story,
        hint: item.hint,
        explanation: item.exp,
        type: item.a >= 10 || item.b >= 10 ? 'multiple-of-10' : 'basic',
      });
    });
  } else if (sectorId === 'sector-2') {
    // 2-digit x 1-digit (Mars Asteroid Belt)
    const pool = [
      {
        a: 24,
        b: 6,
        story: 'Asteroid kelas alfa berkecepatan 24 km/jam mendekat selama 6 jam.',
        hint: 'Pisahkan: (20 × 6) + (4 × 6) = 120 + 24.',
        exp: '20 × 6 = 120 dan 4 × 6 = 24. Jumlahkan: 120 + 24 = 144.',
      },
      {
        a: 38,
        b: 7,
        story: 'Laser foton menembakkan 38 berkas energi dalam 7 kali tembakan beruntun.',
        hint: 'Gunakan susun ke bawah: 8 × 7 = 56 (tulis 6 simpan 5), lalu (3 × 7) + 5 = 26.',
        exp: '38 × 7 = 266 berkas laser terarah!',
      },
      {
        a: 45,
        b: 5,
        story: 'Robot penjelajah Mars mengumpulkan 45 sampel mineral batuan merah tiap hari selama 5 hari.',
        hint: '40 × 5 = 200, dan 5 × 5 = 25.',
        exp: '45 × 5 = 225 sampel batuan Mars.',
      },
      {
        a: 62,
        b: 8,
        story: 'Perisai magnetik menahan 62 benturan mikro-meteor dalam 8 sektor dinding pesawat.',
        hint: 'Hitung (60 × 8) + (2 × 8) = 480 + 16.',
        exp: '62 × 8 = 496 titik benturan ternetralisir!',
      },
      {
        a: 75,
        b: 4,
        story: 'Generator surya menghasilkan 75 kilowatt energi per jam selama 4 jam puncak badai debu.',
        hint: '75 + 75 = 150, dan 150 + 150 = 300.',
        exp: '75 × 4 = 300 kilowatt energi tersimpan.',
      },
      {
        a: 53,
        b: 9,
        story: 'Sebuah bongkahan asteroid raksasa berputar 53 kali per menit selama 9 menit pengamatan.',
        hint: 'Dekomposisi: (50 × 9) + (3 × 9) = 450 + 27.',
        exp: '53 × 9 = 477 kali putaran rotasi terdeteksi!',
      },
    ];

    pool.forEach((item, index) => {
      const ans = item.a * item.b;
      const options = [ans, ...generateDistractors(ans, 3)].sort(() => 0.5 - Math.random());
      questions.push({
        id: `s2-${index + 1}`,
        factorA: item.a,
        factorB: item.b,
        answer: ans,
        options,
        storyPrompt: item.story,
        hint: item.hint,
        explanation: item.exp,
        type: 'two-by-one',
      });
    });
  } else if (sectorId === 'sector-3') {
    // 2-digit x 2-digit (Jupiter Storm)
    const pool = [
      {
        a: 24,
        b: 15,
        story: 'Kapten harus mengalokasikan 24 megawatt daya ke 15 sensor ion penembus awan gas Jupiter.',
        hint: 'Trik: 24 × 10 = 240, dan 24 × 5 = 120. Lalu jumlahkan 240 + 120.',
        exp: '24 × 15 = (24 × 10) + (24 × 5) = 240 + 120 = 360.',
      },
      {
        a: 32,
        b: 25,
        story: 'Pusaran Bintik Merah Raksasa meniupkan partikel dengan densitas 32 unit di 25 zona observasi.',
        hint: 'Trik perkalian 25: Kalikan dengan 100 lalu bagi 4 -> (32 × 100) ÷ 4.',
        exp: '32 × 25 = 800 unit densitas partikel terhitung.',
      },
      {
        a: 42,
        b: 18,
        story: 'Sistem komputer merekam 42 gelombang radio kosmik setiap menit selama 18 menit pelayaran.',
        hint: 'Hitung susun: (42 × 8) = 336, dan (42 × 10) = 420. Jumlahkan 336 + 420.',
        exp: '42 × 18 = 756 gelombang radio.',
      },
      {
        a: 56,
        b: 22,
        story: 'Kapal menyalakan 56 pemancar gelombang mikro berkekuatan 22 gigahertz.',
        hint: 'Hitung: 56 × 2 = 112. Maka 56 × 20 = 1120. Jumlahkan 1120 + 112.',
        exp: '56 × 22 = 1.232 gigahertz energi gelombang!',
      },
      {
        a: 35,
        b: 14,
        story: 'Penyaring gas menyerap 35 molekul metana cair pada 14 wadah penampung kriogenik.',
        hint: 'Pisahkan: (35 × 10) + (35 × 4) = 350 + 140.',
        exp: '35 × 14 = 490 molekul cairan tersimpan.',
      },
      {
        a: 64,
        b: 30,
        story: 'Percepatan gravitasi kapal memerlukan 64 dorongan pendorong di 30 detik manuver orbit.',
        hint: 'Kalikan 64 × 3 terlebih dahulu, lalu tambahkan angka 0.',
        exp: '64 × 3 = 192. Tambah nol menjadi 1.920 dorongan pendorong.',
      },
    ];

    pool.forEach((item, index) => {
      const ans = item.a * item.b;
      const options = [ans, ...generateDistractors(ans, 3)].sort(() => 0.5 - Math.random());
      questions.push({
        id: `s3-${index + 1}`,
        factorA: item.a,
        factorB: item.b,
        answer: ans,
        options,
        storyPrompt: item.story,
        hint: item.hint,
        explanation: item.exp,
        type: 'two-by-two',
      });
    });
  } else if (sectorId === 'sector-4') {
    // Integer Signs: Positive & Negative integers (Saturn zero-gravity cold zone)
    const pool = [
      {
        a: 8,
        b: -6,
        story: 'Suhu cincin es Saturnus turun 6 derajat Celsius setiap jam selama 8 jam pengorbitan.',
        hint: 'Positif (+) dikali Negatif (-) hasilnya selalu NEGATIF (-). 8 × 6 = 48.',
        exp: '8 × (-6) = -48 derajat Celsius.',
      },
      {
        a: -12,
        b: 5,
        story: 'Pesawat mengalami dorongan mundur (-12 km/jam) akibat tarikan cincin sebanyak 5 kali tarikan.',
        hint: 'Negatif (-) dikali Positif (+) hasilnya adalah NEGATIF (-). 12 × 5 = 60.',
        exp: '(-12) × 5 = -60 km/jam.',
      },
      {
        a: -9,
        b: -7,
        story: 'Dua medan anti-materi bertabrakan. Pembalikan gaya negatif (-9) bertemu dengan polaritas (-7).',
        hint: 'Ingat hukum kosmik tanda kembar: Negatif (-) dikali Negatif (-) menjadi POSITIF (+)!',
        exp: '(-9) × (-7) = +63 (Positif 63).',
      },
      {
        a: -25,
        b: 4,
        story: 'Ketinggian pendarat turun (-25 meter) setiap detik selama 4 detik pengereman.',
        hint: '(-) × (+) = (-). Hitung 25 × 4 = 100 dengan tanda minus.',
        exp: '(-25) × 4 = -100 meter penurunan ketinggian.',
      },
      {
        a: -15,
        b: -8,
        story: 'Kompensasi sensor ganda: Anomali (-15) dikalikan faktor inverse magnetik (-8).',
        hint: 'Tanda sama (-) × (-) menghasilkan tanda Positif (+). 15 × 8 = 120.',
        exp: '(-15) × (-8) = +120 poin kestabilan magnetik!',
      },
      {
        a: 14,
        b: -5,
        story: 'Setiap transmisi satelit kehilangan daya (-5 dB) pada 14 repeater sinyal cincin es.',
        hint: '(+) × (-) = (-). 14 × 5 = 70.',
        exp: '14 × (-5) = -70 dB penurunan sinyal.',
      },
    ];

    pool.forEach((item, index) => {
      const ans = item.a * item.b;
      const options = [ans, ...generateDistractors(ans, 3)].sort(() => 0.5 - Math.random());
      questions.push({
        id: `s4-${index + 1}`,
        factorA: item.a,
        factorB: item.b,
        answer: ans,
        options,
        storyPrompt: item.story,
        hint: item.hint,
        explanation: item.exp,
        type: 'integers-sign',
      });
    });
  } else {
    // Sector 5: Galaxy Core Boss Battle & Story Problems
    const pool = [
      {
        a: 48,
        b: 16,
        story: 'BOSS BATTLE TAHAP 1: Titan Lubang Hitam menembakkan 16 kluster badai gravitasi, tiap kluster berisi 48 anak asteroid. Berapa total asteroid?',
        hint: 'Gunakan perkalian 2 digit susun: 48 × 16 = (48 × 10) + (48 × 6).',
        exp: '48 × 10 = 480 dan 48 × 6 = 288. Maka 480 + 288 = 768 asteroid!',
      },
      {
        a: -30,
        b: 12,
        story: 'BOSS BATTLE TAHAP 2: Gelombang kejut lubang hitam mengurangi kapasitas perisai sebesar (-30 HP) sebanyak 12 gelombang berturut-turut.',
        hint: '(-) × (+) = (-). Kalikan 30 × 12 dengan tanda minus.',
        exp: '(-30) × 12 = -360 HP pengurangan perisai.',
      },
      {
        a: -20,
        b: -15,
        story: 'BOSS BATTLE TAHAP 3: Kapten mengaktifkan laser polaritas ganda (-20 volt) yang di-recharge oleh generator inverse (-15 ampere).',
        hint: 'Negatif dikali Negatif menjadi POSITIF! Hitung 20 × 15.',
        exp: '(-20) × (-15) = +300 megawatt gelombang laser pembalik!',
      },
      {
        a: 75,
        b: 18,
        story: 'SOAL CERITA KOSMIK: Sebuah pesawat penjelajah antar-bintang melaju dengan kecepatan 75 km/detik. Berapa jarak tempuhnya setelah 18 detik?',
        hint: 'Jarak = Kecepatan × Waktu. Hitung 75 × 18.',
        exp: '75 × 18 = 1.350 kilometer total jarak tempuh!',
      },
      {
        a: -40,
        b: -6,
        story: 'BOSS BATTLE TAHAP 4: Reaksi fusi lubang hitam membalik defisit energi (-40 GJ) dengan 6 kali siklus kuantum terbalik (-6).',
        hint: '(-) × (-) = (+). 40 × 6 = 240.',
        exp: '(-40) × (-6) = +240 Gigajoule energi murni!',
      },
      {
        a: 85,
        b: 24,
        story: 'SERANGAN TERAKHIR: Aktifkan Meriam Kosmik! Muat 85 kristal plasma pada masing-masing dari 24 ruang bakar foton untuk mengakhiri pertempuran.',
        hint: 'Hitung (85 × 20) + (85 × 4) = 1.700 + 340.',
        exp: '85 × 24 = 2.040 tenaga foton puncak! BOSS BERHASIL DIKALAHKAN!',
      },
    ];

    pool.forEach((item, index) => {
      const ans = item.a * item.b;
      const options = [ans, ...generateDistractors(ans, 3)].sort(() => 0.5 - Math.random());
      questions.push({
        id: `s5-${index + 1}`,
        factorA: item.a,
        factorB: item.b,
        answer: ans,
        options,
        storyPrompt: item.story,
        hint: item.hint,
        explanation: item.exp,
        type: 'word-problem',
      });
    });
  }

  return questions;
}
