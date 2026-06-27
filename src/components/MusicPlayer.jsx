import React from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MusicPlayer({ 
  isPlaying, 
  togglePlay, 
  volume, 
  onVolumeChange, 
  isMuted, 
  toggleMute,
  isSynthFallback 
}) {
  return (
    <div className="w-full max-w-sm mx-auto glass-card-light rounded-2xl p-4 flex items-center justify-between gap-4 border border-white/10 shadow-lg relative z-20">
      
      {/* Track info & Icon */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center text-white relative overflow-hidden shadow-md">
          {isPlaying ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            >
              <Music className="w-5 h-5" />
            </motion.div>
          ) : (
            <Music className="w-5 h-5" />
          )}
          
          {/* Animated decorative waves in icon */}
          {isPlaying && (
            <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-[2px]">
              <span className="w-[2px] h-2 bg-white/60 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-[2px] h-3 bg-white/80 rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></span>
              <span className="w-[2px] h-2 bg-white/60 rounded-full animate-wave" style={{ animationDelay: '0.5s' }}></span>
            </div>
          )}
        </div>

        <div className="text-left">
          <p className="text-xs text-pink-300 font-semibold tracking-wider uppercase">Now Playing</p>
          <p className="text-sm font-bold text-zinc-100 truncate w-36">
            Selamat Ulang Tahun
          </p>
          <p className="text-[11px] text-zinc-400">
            {isSynthFallback ? '🎹 Chime Music Synthesizer' : '🎵 Jamrud (Cover/Original)'}
          </p>
        </div>
      </div>

      {/* Visualizer Equalizer (Right of Info) */}
      {isPlaying && (
        <div className="flex items-end gap-[3px] h-6 px-2">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="w-[3px] bg-gradient-to-t from-pink-500 to-violet-400 rounded-full"
              animate={{
                height: isPlaying ? [6, Math.random() * 20 + 4, 6] : 6
              }}
              transition={{
                duration: 0.6 + i * 0.15,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }}
              style={{ height: '6px' }}
            />
          ))}
        </div>
      )}

      {/* Controls: Play/Pause and Volume */}
      <div className="flex items-center gap-3">
        {/* Play / Pause Button */}
        <motion.button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-white text-zinc-950 flex items-center justify-center shadow-md hover:bg-zinc-100 transition-colors"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current translate-x-[1px]" />
          )}
        </motion.button>

        {/* Volume controls */}
        <div className="flex items-center gap-1.5 group relative">
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 flex items-center justify-center border border-white/5 transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-zinc-300" />
            )}
          </button>

          {/* Slider (appears on hover or can just be displayed) */}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-16 h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-pink-500 opacity-0 group-hover:opacity-100 w-0 group-hover:w-16 transition-all duration-300 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
}
