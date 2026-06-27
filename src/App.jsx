import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Gift, Calendar, Heart, Share2, Sparkles, MessageCircle, Volume2, User } from 'lucide-react';

// Components
import GiftBox from './components/GiftBox';
import BirthdayCake from './components/BirthdayCake';
import MusicPlayer from './components/MusicPlayer';

// Utilities
import { birthdaySynth } from './utils/audioSynth';

// URL Foto Profil - Silakan ganti dengan tautan foto Anda (misal link Imgur, Discord, Unsplash, dll.)
// Jika dibiarkan kosong "", sistem akan otomatis menampilkan ikon profil default.
const PROFILE_IMAGE_URL = "https://scontent.fdps5-1.fna.fbcdn.net/v/t39.30808-6/475695859_603261012555795_5593350238867214657_n.jpg?stp=dst-jpg_tt6&cstp=mx960x799&ctp=s960x799&_nc_cat=111&ccb=1-7&_nc_sid=a5f93a&_nc_eui2=AeGHigtlZ0GayV_ifB7jWiyRD3FB2EEPILcPcUHYQQ8gt-DbjttwKkgCTlg1CjrZZx_3Ael4vMVOi1QfS42NxGuL&_nc_ohc=1qnh4mF76pgQ7kNvwFsa3Aj&_nc_oc=AdrVJ83tFdfovoheepH7N-6vYnbowtRnjMPbruBTOd8D3uGWJiR6q6yyChmud0MHkQg&_nc_zt=23&_nc_ht=scontent.fdps5-1.fna&_nc_gid=iWf6UXvVteKcO5AsgWLCVA&_nc_ss=7b2a8&oh=00_Af9OuMleAEjh4PZmWe8FqHd5e2qquUJiTuMZJbwEM1iOKg&oe=6A44FA54";

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isSynthFallback, setIsSynthFallback] = useState(false);
  const [cakeBlownOut, setCakeBlownOut] = useState(false);
  
  // Confetti sizing
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 360,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Audio HTML5 Reference
  const audioRef = useRef(null);

  // Track window resizing for Confetti dimensions
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize HTML5 Audio element on load
  useEffect(() => {
    const audio = new Audio('./jamrud_selamat_ulang_tahun.m4a');
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Cleanup audio on unmount
    return () => {
      audio.pause();
      birthdaySynth.stop();
    };
  }, []);

  // Sync volume changes to both HTML5 Audio and Web Audio Synth fallback
  useEffect(() => {
    const targetVolume = isMuted ? 0 : volume;
    if (audioRef.current) {
      audioRef.current.volume = targetVolume;
    }
    birthdaySynth.setVolume(targetVolume);
  }, [volume, isMuted]);

  // Handle open event: triggers play music and screen transition
  const handleOpenGift = () => {
    setIsOpened(true);
    setIsPlaying(true);
    
    // Play HTML5 MP3 Audio
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsSynthFallback(false);
        })
        .catch(err => {
          console.warn("MP3 playback blocked/unavailable. Activating Web Audio API Synth fallback:", err);
          // Play synth melody if MP3 file is not found or fails to load
          setIsSynthFallback(true);
          birthdaySynth.startMelody();
        });
    }
  };

  // Toggle playback controls
  const togglePlay = () => {
    if (isPlaying) {
      if (isSynthFallback) {
        birthdaySynth.pause();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (isSynthFallback) {
        birthdaySynth.resume();
      } else if (audioRef.current) {
        audioRef.current.play().catch(() => {
          setIsSynthFallback(true);
          birthdaySynth.startMelody();
        });
      }
      setIsPlaying(true);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  // Handle mute toggling
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Redirect to WhatsApp with a prefilled thank you response
  const sendWhatsAppResponse = () => {
    const phoneNumber = "628xxxxxxxxxx"; // Replace with recipient number or leave empty to choose chat
    const textMessage = encodeURIComponent("Makasih banyak ya ucapan dan websitenya! Kadonya suka banget, lagunya juga asik! ❤️🎉🎂");
    window.open(`https://wa.me/${phoneNumber}?text=${textMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-animate flex flex-col justify-between items-center text-zinc-100 p-4 md:p-8 relative overflow-hidden">
      
      {/* Background ambient stars */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/5 w-1 h-1 bg-white rounded-full animate-twinkle" />
        <div className="absolute top-1/3 left-3/4 w-1.5 h-1.5 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-2/3 left-1/4 w-1 h-1 bg-white rounded-full animate-twinkle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-4/5 left-4/5 w-2 h-2 bg-white rounded-full animate-twinkle" style={{ animationDelay: '2s' }} />
      </div>

      {/* Confetti celebration shower (Starts when gift is opened) */}
      {isOpened && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={cakeBlownOut ? 350 : 120} // Burst more confetti when candle is blown
          recycle={true}
          colors={['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']}
        />
      )}

      {/* Header Info */}
      <header className="w-full max-w-4xl flex justify-between items-center z-20 mb-8 border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <span className="text-sm font-bold tracking-widest text-zinc-200">SPECIAL GREETING</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 justify-end">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>June 27, 2026</span>
          </p>
        </div>
      </header>

      {/* Main Interactive Transitions Container */}
      <main className="w-full flex-grow flex items-center justify-center z-10">
        <AnimatePresence mode="wait">
          {!isOpened ? (
            /* STEP 1: LANDING SCREEN (CLOSED GIFT) */
            <motion.div
              key="landing"
              className="text-center max-w-xl flex flex-col items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-violet-400 leading-tight">
                Halo, Ada Hadiah Spesial Menantimu! ✨
              </h1>
              <p className="text-zinc-400 text-sm md:text-base mb-8 max-w-md">
                Klik kado di bawah ini untuk membuka kejutan dan ucapan ulang tahun spesial yang sudah disiapkan khusus untukmu.
              </p>

              {/* Glowing Gift Box Component */}
              <GiftBox onOpen={handleOpenGift} />
            </motion.div>
          ) : (
            /* STEP 2: GREETING SCREEN (CARD DISPLAY & CELEBRATION) */
            <motion.div
              key="greeting"
              className="w-full max-w-2xl flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.2 }}
            >
              {/* Glassmorphic Greeting Card */}
              <div className="w-full glass-card rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden border border-white/10">
                {/* Accent highlights inside card */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-violet-500/20 rounded-full blur-2xl pointer-events-none" />

                {/* Profile Circle / Avatar Frame */}
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-violet-600 p-[4px] shadow-xl relative">
                    <div className="w-full h-full rounded-full bg-zinc-950 flex items-center justify-center overflow-hidden border border-zinc-900">
                      {PROFILE_IMAGE_URL ? (
                        <img 
                          src={PROFILE_IMAGE_URL} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 md:w-16 md:h-16 text-zinc-600" />
                      )}
                    </div>
                    {/* Birthday Sparkle Badge */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-sm shadow-md border-2 border-zinc-950">
                      🎉
                    </div>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-extrabold mt-4 text-glow bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                    Selamat Ulang Tahun!
                  </h2>
                  <h3 className="text-xs text-pink-400 font-semibold tracking-widest uppercase mt-1">
                    monaaaaa special day 🎂✨
                  </h3>
                </div>

                {/* Greeting message */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-5 text-center relative">
                  <span className="absolute top-2 left-3 text-3xl font-serif text-white/10 select-none">“</span>
                  <p className="text-zinc-200 text-sm md:text-base leading-relaxed font-medium font-sans px-2">
                  "Happy birthday monaaaa!!!! 🥳 ini hari ingatt ohhhh...  jang lupa siap aym jng sampe tong datang sonde siap nanti tong bakar kosss....🤣🤣🤣🙏🙏✨"
                  </p>
                  <h1>just kiddingg🙏🤣🗿</h1>
                  <h3>from PACE</h3>
                  <span className="absolute bottom-1 right-3 text-3xl font-serif text-white/10 select-none">”</span>
                </div>

                {/* Interactive Candlegame & Audio controllers in grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mt-2">
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-zinc-400 mb-3 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span>Mini Interactive Game</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mb-4">
                      Ada kue ulang tahun digital spesial di sini. Ayo tiup semua lilinnya dengan mengetuk setiap apinya!
                    </p>
                    {/* Music control widget under text */}
                    <div className="hidden md:block mt-auto">
                      <h3 className="text-sm font-bold text-zinc-400 mb-3 uppercase tracking-wider">
                        Music Controller
                      </h3>
                      <MusicPlayer
                        isPlaying={isPlaying}
                        togglePlay={togglePlay}
                        volume={volume}
                        onVolumeChange={handleVolumeChange}
                        isMuted={isMuted}
                        toggleMute={toggleMute}
                        isSynthFallback={isSynthFallback}
                      />
                    </div>
                  </div>

                  {/* Interactive Cake component */}
                  <div className="flex justify-center">
                    <BirthdayCake onAllBlownOut={() => setCakeBlownOut(true)} />
                  </div>
                </div>

                {/* Mobile Music Player inside card (Shown only on small screens) */}
                <div className="block md:hidden">
                  <MusicPlayer
                    isPlaying={isPlaying}
                    togglePlay={togglePlay}
                    volume={volume}
                    onVolumeChange={handleVolumeChange}
                    isMuted={isMuted}
                    toggleMute={toggleMute}
                    isSynthFallback={isSynthFallback}
                  />
                </div>

                {/* CTA Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mt-4 border-t border-white/5 pt-6">
                  <motion.button
                    onClick={sendWhatsAppResponse}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Kirim Balasan Terima Kasih ❤️</span>
                  </motion.button>

                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'Special Birthday Greeting',
                          text: 'Ada ucapan ulang tahun spesial untukmu!',
                          url: window.location.href,
                        }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link berhasil disalin ke papan klip! Silakan bagikan ke orang terdekat.");
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 text-zinc-300 font-semibold flex items-center justify-center gap-2 border border-white/5 transition-all duration-300"
                  >
                    <Share2 className="w-4.5 h-4.5" />
                    <span>Bagikan Link</span>
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Info */}
      <footer className="w-full max-w-4xl text-center z-20 mt-8 border-t border-white/5 pt-4 text-xs text-zinc-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© 2026. Dibuat dengan cinta untuk hari bahagiamu.</p>
        <p className="flex items-center gap-1 justify-center">
          <span>Premium Web Application by Senior Developer</span>
        </p>
      </footer>
    </div>
  );
}
