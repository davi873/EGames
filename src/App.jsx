import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const DIGITS = Array.from({ length: 10 }, (_, i) => String(i));
const VALID = new Set([...LETTERS, ...DIGITS]);
const COLORS = ["#00d2ff", "#3ae374", "#ff5e57", "#ffd32a", "#7d5fff", "#ff793f"];

// Imagens locais dos heróis
const HERO_IMAGES = {
  HULK: '/assets/hulk.png',
  THOR: '/assets/thor.gif',
  BATMAN: '/assets/batman.png'
};

export default function App() {
  const [centerChar, setCenterChar] = useState(null);
  const [glyphs, setGlyphs] = useState([]);
  const [hitCount, setHitCount] = useState(0);
  const [mode, setMode] = useState('free');
  const [targetWord, setTargetWord] = useState('');
  const [challengeIndex, setChallengeIndex] = useState(0);
  const [showChallengeInput, setShowChallengeInput] = useState(false);
  const [heroImage, setHeroImage] = useState(null);
  const stageRef = useRef(null);
  const bufferRef = useRef('');

  const addGlyph = (ch) => {
    if (mode === 'challenge') {
      if (ch === targetWord[challengeIndex]) {
        setCenterChar(ch);
        if (challengeIndex === targetWord.length - 1) {
          triggerHeroAnimation(targetWord);
          setChallengeIndex(0);
          setTargetWord('');
          setMode('free');
        } else {
          setChallengeIndex(challengeIndex + 1);
        }
      }
      return;
    }
    setCenterChar(ch);
    setGlyphs((prev) => {
      const newGlyph = { id: Date.now(), ch, pos: prev.length % 10 };
      return [...prev, newGlyph].slice(-10);
    });
    setHitCount((c) => c + 1);
    bufferRef.current = (bufferRef.current + ch).slice(-10);
    Object.keys(HERO_IMAGES).forEach(word => {
      if (bufferRef.current.includes(word)) {
        triggerHeroAnimation(word);
      }
    });
  };

  const triggerHeroAnimation = (word) => {
    if (HERO_IMAGES[word]) {
      setHeroImage(HERO_IMAGES[word]);
      setTimeout(() => setHeroImage(null), 2000);
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const k = e.key.toUpperCase();
      if (VALID.has(k)) addGlyph(k);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, challengeIndex, targetWord]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white relative overflow-hidden">
      <div className="p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Joguinho do Erick</h1>
        <div className="flex gap-2">
          <button onClick={() => setMode(mode === 'free' ? 'challenge' : 'free')} className="px-3 py-1 bg-white/10 rounded">
            {mode === 'free' ? 'Modo Desafio' : 'Modo Livre'}
          </button>
          {mode === 'challenge' && (
            <button onClick={() => setShowChallengeInput((s) => !s)} className="px-3 py-1 bg-white/10 rounded">
              {showChallengeInput ? 'Ocultar Palavra' : 'Definir Palavra'}
            </button>
          )}
        </div>
      </div>
      {mode === 'challenge' && showChallengeInput && (
        <div className="p-4">
          <input
            type="text"
            placeholder="Digite a palavra alvo"
            value={targetWord}
            onChange={(e) => setTargetWord(e.target.value.toUpperCase())}
            className="px-2 py-1 text-black"
          />
          <div className="mt-2 text-lg">Próxima letra: {targetWord[challengeIndex]}</div>
        </div>
      )}
      <div ref={stageRef} className="relative w-full h-[70vh]">
        <AnimatePresence>
          {centerChar && (
            <motion.div
              key={centerChar + hitCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-bold z-10"
              style={{ color: COLORS[Math.floor(Math.random() * COLORS.length)] }}
            >
              {centerChar}
            </motion.div>
          )}
        </AnimatePresence>
        {glyphs.map((g, idx) => (
          <motion.div
            key={g.id}
            className="absolute text-6xl font-bold"
            initial={{ opacity: 0 }}
            animate={{
              x: ((idx + 1) * (stageRef.current?.clientWidth / 11 || 60)),
              y: Math.random() * (stageRef.current?.clientHeight - 100 || 300),
              opacity: 1
            }}
            style={{ color: COLORS[idx % COLORS.length] }}
          >
            {g.ch}
          </motion.div>
        ))}
        {heroImage && (
          <motion.img
            src={heroImage}
            alt="Herói"
            initial={{ scale: 0.5, opacity: 0, y: -100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            transition={{ duration: 0.6 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[60%] z-20"
          />
        )}
      </div>
      <div className="p-4">Toques: {hitCount}</div>
    </div>
  );
}
