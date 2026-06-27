import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function BirthdayCake({ onAllBlownOut }) {
  const [candles, setCandles] = useState([
    { id: 1, isLit: true, x: -35 },
    { id: 2, isLit: true, x: 0 },
    { id: 3, isLit: true, x: 35 },
  ]);
  const [smokePuffs, setSmokePuffs] = useState([]);
  const [message, setMessage] = useState('Ketuk lilin untuk meniup! 🎂');

  const blowOutCandle = (id, xPos) => {
    setCandles(prev => 
      prev.map(c => c.id === id ? { ...c, isLit: false } : c)
    );

    // Add smoke puff effect
    const newPuff = {
      id: Date.now(),
      x: xPos,
      y: -100 // Starting y-coord of the candle top
    };
    setSmokePuffs(prev => [...prev, newPuff]);

    // Clear puff after animation completes
    setTimeout(() => {
      setSmokePuffs(prev => prev.filter(p => p.id !== newPuff.id));
    }, 1500);
  };

  // Check if all candles are blown out
  const allBlownOut = candles.every(c => !c.isLit);

  useEffect(() => {
    if (allBlownOut) {
      setMessage('Yeeayy! Selamat Ulang Tahun! 🎉🎂✨');
      if (onAllBlownOut) {
        onAllBlownOut();
      }
    }
  }, [allBlownOut]);

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-3xl max-w-sm mx-auto shadow-2xl relative border border-white/10 overflow-hidden">
      {/* Sparkle effects on successful candle blow out */}
      {allBlownOut && (
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-pink-500/10 to-violet-500/10 animate-pulse" />
      )}

      {/* Interactive Cake SVG Area */}
      <div className="w-64 h-64 relative flex items-end justify-center select-none">
        
        {/* Smoke Puff Rendering */}
        <AnimatePresence>
          {smokePuffs.map(puff => (
            <motion.div
              key={puff.id}
              className="absolute w-4 h-4 bg-zinc-400 rounded-full blur-[1px] opacity-60"
              style={{ left: `calc(50% + ${puff.x}px - 8px)`, bottom: '135px' }}
              initial={{ opacity: 0.6, scale: 0.5, y: 0 }}
              animate={{ 
                opacity: 0, 
                scale: [0.5, 1.5, 2], 
                y: -60,
                x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20]
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>

        <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          {/* Plate Stand */}
          <path d="M 30 170 Q 100 185 170 170 L 160 180 Q 100 190 40 180 Z" fill="#e2e8f0" />
          <ellipse cx="100" cy="170" rx="70" ry="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />

          {/* Cake Layer 1 (Bottom) */}
          <rect x="45" y="120" width="110" height="45" rx="5" fill="#4c1d95" />
          {/* Cake Frosting Drips Layer 1 */}
          <path d="M 45 120 Q 55 135 65 120 Q 75 138 85 120 Q 95 132 105 120 Q 115 135 125 120 Q 135 138 145 120 L 155 120 L 155 130 Q 100 145 45 130 Z" fill="#db2777" />
          <ellipse cx="100" cy="120" rx="55" ry="8" fill="#5b21b6" />

          {/* Cake Layer 2 (Top) */}
          <rect x="60" y="85" width="80" height="35" rx="4" fill="#a78bfa" />
          {/* Frosting Drips Layer 2 */}
          <path d="M 60 85 Q 68 95 76 85 Q 84 98 92 85 Q 100 93 108 85 Q 116 97 124 85 Q 132 95 140 85 L 140 92 Q 100 102 60 92 Z" fill="#f472b6" />
          <ellipse cx="100" cy="85" rx="40" ry="6" fill="#c084fc" />

          {/* Decorative Cherries/Strawberries */}
          <circle cx="70" cy="83" r="4" fill="#ef4444" />
          <circle cx="100" cy="82" r="4" fill="#ef4444" />
          <circle cx="130" cy="83" r="4" fill="#ef4444" />

          {/* Render Candles */}
          {candles.map(candle => (
            <g key={candle.id} className="cursor-pointer" onClick={() => candle.isLit && blowOutCandle(candle.id, candle.x)}>
              {/* Candle Stick */}
              <rect x={100 + candle.x - 3} y="55" width="6" height="30" fill="#fcd34d" rx="2" />
              {/* Candle Stripes */}
              <line x1={100 + candle.x - 3} y1="62" x2={100 + candle.x + 3} y2="66" stroke="#f43f5e" strokeWidth="2" />
              <line x1={100 + candle.x - 3} y1="72" x2={100 + candle.x + 3} y2="76" stroke="#3b82f6" strokeWidth="2" />
              
              {/* Wick */}
              <line x1={100 + candle.x} y1="55" x2={100 + candle.x} y2="50" stroke="#4b5563" strokeWidth="1.5" />

              {/* Flame (Only if lit) */}
              {candle.isLit && (
                <motion.path
                  d={`M ${100 + candle.x} 50 C ${100 + candle.x - 6} 45 ${100 + candle.x - 4} 34 ${100 + candle.x} 30 C ${100 + candle.x + 4} 34 ${100 + candle.x + 6} 45 ${100 + candle.x} 50 Z`}
                  fill="#f97316"
                  animate={{
                    scaleY: [1, 1.2, 0.9, 1.1, 1],
                    scaleX: [1, 0.9, 1.1, 0.95, 1],
                    skewX: [0, 2, -2, 1, 0],
                    fill: ["#f97316", "#fbbf24", "#f97316"]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{ originY: 1 }}
                />
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Message Label */}
      <motion.div
        key={message}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center"
      >
        <p className="text-zinc-100 font-semibold tracking-wide text-sm flex items-center justify-center gap-1">
          {allBlownOut && <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin" />}
          <span>{message}</span>
          {allBlownOut && <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-spin" />}
        </p>
        
        {allBlownOut && (
          <motion.button
            onClick={() => {
              setCandles(candles.map(c => ({ ...c, isLit: true })));
              setMessage('Ketuk lilin untuk meniup! 🎂');
            }}
            className="mt-3 text-xs bg-white/10 hover:bg-white/20 text-zinc-300 py-1.5 px-3 rounded-full transition-all duration-300 border border-white/5"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Nyalakan Ulang Lilin
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
