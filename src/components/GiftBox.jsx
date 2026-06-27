import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';

export default function GiftBox({ onOpen }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] relative select-none">
      {/* Decorative Glow Elements */}
      <div className="absolute w-72 h-72 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full blur-3xl opacity-30 animate-pulse-glow" />
      <div className="absolute w-48 h-48 bg-gradient-to-tr from-amber-400 to-rose-500 rounded-full blur-3xl opacity-20 translate-x-12 -translate-y-12" />

      {/* Floating Sparkles around the Gift */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-300 pointer-events-none"
          initial={{
            x: Math.sin(i) * 100,
            y: Math.cos(i) * 100,
            scale: 0.5,
            opacity: 0.3
          }}
          animate={{
            y: [Math.cos(i) * 100 - 15, Math.cos(i) * 100 + 15, Math.cos(i) * 100 - 15],
            opacity: [0.3, 0.9, 0.3],
            scale: [0.5, 0.9, 0.5]
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-5 h-5 fill-pink-300" />
        </motion.div>
      ))}

      {/* The Gift Box Container */}
      <motion.div
        className="cursor-pointer relative z-10 filter drop-shadow-[0_20px_35px_rgba(139,92,246,0.3)]"
        onClick={onOpen}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        whileHover="hover"
        whileTap="tap"
      >
        <motion.div
          variants={{
            hover: {
              y: -8,
              rotate: [0, -3, 3, -3, 3, 0],
              transition: { duration: 0.5, repeat: Infinity, repeatType: "mirror" }
            },
            tap: { scale: 0.9 }
          }}
          className="relative flex flex-col items-center"
        >
          {/* Ribbon Bow */}
          <motion.div 
            className="w-16 h-16 relative -mb-3 z-30"
            variants={{
              hover: { rotate: 5, scale: 1.05 }
            }}
          >
            {/* Left Bow Loop */}
            <div className="absolute right-1/2 bottom-0 w-10 h-10 bg-pink-500 rounded-full border-2 border-pink-400 origin-bottom-right rotate-[-30deg] shadow-lg" />
            {/* Right Bow Loop */}
            <div className="absolute left-1/2 bottom-0 w-10 h-10 bg-pink-500 rounded-full border-2 border-pink-400 origin-bottom-left rotate-[30deg] shadow-lg" />
            {/* Center Node */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-yellow-400 rounded-full border border-pink-300 shadow-md z-10" />
          </motion.div>

          {/* Box Lid */}
          <motion.div 
            className="w-44 h-10 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-t-lg shadow-md z-20 relative border-b border-pink-600"
            variants={{
              hover: { y: -5 }
            }}
          >
            {/* Lid Horizontal Ribbon */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-8 h-full bg-yellow-400" />
          </motion.div>

          {/* Box Body */}
          <div className="w-40 h-36 bg-gradient-to-r from-violet-600 to-indigo-700 rounded-b-xl shadow-2xl relative overflow-hidden border border-violet-500">
            {/* Shiny highlight overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            
            {/* Vertical Ribbon */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-8 h-full bg-yellow-400 flex items-center justify-center">
              <Gift className="w-5 h-5 text-violet-900 animate-pulse" />
            </div>
            
            {/* Horizontal Ribbon */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-8 bg-yellow-400" />

            {/* Decorative Stars on Box */}
            <div className="absolute top-3 left-4 w-2 h-2 bg-yellow-300 rounded-full opacity-60" />
            <div className="absolute bottom-4 right-5 w-3 h-3 bg-pink-300 rounded-full opacity-50" />
            <div className="absolute bottom-6 left-6 w-2 h-2 bg-pink-200 rounded-full opacity-40" />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Instructions */}
      <motion.p
        className="mt-12 text-sm text-zinc-400 font-medium tracking-wider flex items-center gap-2 select-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span>Ketuk Kado untuk Membuka</span>
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          ✨
        </motion.span>
      </motion.p>
    </div>
  );
}
