import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

// ================== Teclas ==================
const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const DIGITS = Array.from({ length: 10 }, (_, i) => String(i));
const VALID = new Set([...LETTERS, ...DIGITS]);
const COLORS = ["#00d2ff", "#3ae374", "#ff5e57", "#ffd32a", "#7d5fff", "#ff793f"];

// ================== Imagens locais ==================
// Coloque os arquivos em: public/heroes/ (Vite/CRA servem automaticamente)
// Ex.: public/heroes/hulk.png, thor.png, batman.png
const heroUrl = (name) => `/heroes/${name.toLowerCase()}.png`;
const HERO_WORDS = {
  HULK: heroUrl('hulk'),
  THOR: heroUrl('thor'),
  BATMAN: heroUrl('batman')
};

export default function App() {
  const [centerChar, setCenterChar] = useState(null);
  const [glyphs, setGlyphs] = useState([]); // {id,ch}
  const [hitCount, setHitCount] = useState(0);

  const [mode, setMode] = useState('free'); // 'free' | 'challenge'
  const [targetWord, setTargetWord] = useState('');
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [showChallengeInput, setShowChallengeInput] = useState(false); // flag p/ ocultar

  const [heroFX, setHeroFX] = useState(null); // {url,id}

  const stageRef = useRef(null);
  const bufferRef = useRef('');

  // Pré-carregar imagens de herói (evita flicker)
  useEffect(() => {
    Object.values(HERO_WORDS).forEach((u) => { const img = new Image(); img.src = u; });
  }, []);

  // ======= Helpers =======
  const stageRect = () => stageRef.current?.getBoundingClientRect() || { width: 900, height: 500 };

  const addGlyph = (ch) => {
    if (mode === 'challenge') {
      if (!targetWord) return; // sem palavra setada
      if (ch === targetWord[challengeIndex]) {
        setCenterChar(ch);
        if (challengeIndex === targetWord.length - 1) {
          triggerHeroAnimation(targetWord); // celebra
          setChallengeIndex(0);
          setTargetWord('');
          setMode('free');
        } else {
          setChallengeIndex((i) => i + 1);
        }
      }
      return;
    }

    // modo livre
    setCenterChar(ch);
    setGlyphs((prev) => {
      const next = [...prev, { id: Date.now() + Math.random(), ch }].slice(-10);
      return next;
    });
    setHitCount((c) => c + 1);

    // detecção de herói (buffer rolling)
    bufferRef.current = (bufferRef.current + ch).slice(-12);
    Object.keys(HERO_WORDS).forEach((word) => {
      if (bufferRef.current.includes(word)) triggerHeroAnimation(word);
    });
  };

  const triggerHeroAnimation = (word) => {
    const url = HERO_WORDS[word] || HERO_WORDS.HULK;
    const id = Math.random().toString(36).slice(2);
    setHeroFX({ url, id });
    setTimeout(() => setHeroFX((h) => (h && h.id === id ? null : h)), 1600);
  };

  // Teclado físico
  useEffect(() => {
    const onKeyDown = (e) => {
      const k = (e.key || '').toUpperCase();
      if (VALID.has(k)) { e.preventDefault(); addGlyph(k); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, challengeIndex, targetWord]);

  return (
    <div className="min-h-screen bg-[#111] text-white relative">
      {/* Topbar */}
      <div className="p-4 flex justify-between items-center">
        <h1 className="font-extrabold text-3xl">Joguinho do Erick</h1>
        <div className="flex gap-2">
          <button onClick={() => setMode((m) => (m === 'free' ? 'challenge' : 'free'))} className="px-3 py-1 bg-white/10 rounded">
            {mode === 'free' ? 'Modo Desafio' : 'Modo Livre'}
          </button>
          {mode === 'challenge' && (
            <button onClick={() => setShowChallengeInput((s) => !s)} className="px-3 py-1 bg-white/10 rounded">
              {showChallengeInput ? 'Ocultar Palavra' : 'Definir Palavra'}
            </button>
          )}
        </div>
      </div>

      {/* Painel desafio (oculto por flag) */}
      {mode === 'challenge' && showChallengeInput && (
        <div className="px-4 pb-2">
          <input
            type="text"
            placeholder="Digite a palavra alvo"
            value={targetWord}
            onChange={(e) => setTargetWord(e.target.value.toUpperCase())}
            className="px-2 py-1 text-black rounded"
          />
          <div className="mt-2 text-lg">Próxima letra: <b>{targetWord[challengeIndex] || '-'}</b></div>
        </div>
      )}

      {/* Palco */}
      <div ref={stageRef} className="relative w-full h-[70vh] overflow-hidden">
        {/* Letra central em destaque */}
        <AnimatePresence>
          {centerChar && (
            <motion.div
              key={centerChar + hitCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black"
              style={{ fontSize: 'min(22vw, 220px)', color: COLORS[Math.floor(Math.random() * COLORS.length)] }}
            >
              {centerChar}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Letras espalhadas (10 máx) — recalcula posição no render */}
        {glyphs.map((g, idx) => {
          const rect = stageRect();
          const col = idx % 10; // esquerda -> direita
          const paddingX = 80;
          const minX = paddingX;
          const maxX = rect.width - paddingX;
          const x = minX + ((maxX - minX) * (col + 0.5)) / 10;
          const paddingY = 90;
          const y = Math.max(paddingY, Math.min(rect.height - paddingY, 100 + (idx * 37) % (rect.height - 200)));
          return (
            <motion.div
              key={g.id}
              className="absolute font-black"
              initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, left: x, top: y }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
              style={{ transform: 'translate(-50%, -50%)', color: COLORS[idx % COLORS.length], fontSize: `${Math.floor(100 + Math.random()*60)}px` }}
            >
              {g.ch}
            </motion.div>
          );
        })}

        {/* FX do herói: usa imagem LOCAL e anima simples (entra, flutua e sai) */}
        <AnimatePresence>
          {heroFX && (
            <motion.img
              key={heroFX.id}
              src={heroFX.url}
              alt="Herói"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[70%] drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
              initial={{ scale: 0.6, opacity: 0, y: 40, rotate: -4 }}
              animate={{ scale: [0.6, 1.05, 1], opacity: 1, y: [-10, -20, -30], rotate: [ -4, 3, 0 ] }}
              exit={{ opacity: 0, scale: 0.8, y: -120, rotate: 6 }}
              transition={{ duration: 1.2, type: 'spring', stiffness: 120, damping: 14 }}
            />)
          }
        </AnimatePresence>
      </div>

      <div className="p-4">Toques: {hitCount}</div>
    </div>
  );
}
