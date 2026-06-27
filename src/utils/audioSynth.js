// Web Audio API Birthday Synth - Soft Music Box Chimes Fallback

const NOTE_FREQS = {
  'G4': 392.00,
  'A4': 440.00,
  'B4': 493.88,
  'C5': 523.25,
  'D5': 587.33,
  'E5': 659.25,
  'F5': 698.46,
  'G5': 783.99,
  'A5': 880.00,
};

// Happy Birthday melody in C Major
// Format: [Note, Duration (beats), Pause after (beats)]
const MELODY = [
  ['G4', 0.75, 0.75],
  ['G4', 0.25, 0.25],
  ['A4', 1.0, 1.0],
  ['G4', 1.0, 1.0],
  ['C5', 1.0, 1.0],
  ['B4', 2.0, 2.0],

  ['G4', 0.75, 0.75],
  ['G4', 0.25, 0.25],
  ['A4', 1.0, 1.0],
  ['G4', 1.0, 1.0],
  ['D5', 1.0, 1.0],
  ['C5', 2.0, 2.0],

  ['G4', 0.75, 0.75],
  ['G4', 0.25, 0.25],
  ['G5', 1.0, 1.0],
  ['E5', 1.0, 1.0],
  ['C5', 1.0, 1.0],
  ['B4', 1.0, 1.0],
  ['A4', 2.0, 2.0],

  ['F5', 0.75, 0.75],
  ['F5', 0.25, 0.25],
  ['E5', 1.0, 1.0],
  ['C5', 1.0, 1.0],
  ['D5', 1.0, 1.0],
  ['C5', 2.0, 2.5],
];

export class BirthdaySynth {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isPlaying = false;
    this.isPlayingMelody = false;
    this.volume = 0.5;
    this.tempo = 110; // BPM
    this.currentNoteIndex = 0;
    this.nextNoteTimeout = null;
    this.delayNode = null;
    this.delayFeedback = null;
  }

  init() {
    if (this.ctx) return;
    
    // Create audio context
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    
    // Create master gain node for volume control
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    
    // Create an elegant echo/delay effect to make it sound like a music box
    this.delayNode = this.ctx.createDelay(1.0);
    this.delayNode.delayTime.value = 0.35; // 350ms delay
    
    this.delayFeedback = this.ctx.createGain();
    this.delayFeedback.gain.value = 0.4; // 40% feedback echo

    // Connect delay loop
    this.delayNode.connect(this.delayFeedback);
    this.delayFeedback.connect(this.delayNode);

    // Connect main path and delay path to output
    this.masterGain.connect(this.ctx.destination);
    
    // delay path connects to master gain
    this.delayNode.connect(this.masterGain);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  playNote(noteName, duration) {
    if (!this.ctx || this.ctx.state === 'suspended') return;
    
    const freq = NOTE_FREQS[noteName];
    if (!freq) return;

    const now = this.ctx.currentTime;
    
    // Create primary chime oscillator (Triangle wave - soft & pure)
    const osc1 = this.ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // Create secondary harmonic oscillator (Sine wave 1 octave higher for shimmer)
    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);
    
    // Create chime envelope node
    const envelope = this.ctx.createGain();
    
    // Bell-like envelope (fast attack, exponential decay)
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(0.3, now + 0.01); // Quick strike
    envelope.gain.exponentialRampToValueAtTime(0.001, now + duration * 1.5); // Ring out
    
    // Shimmer envelope (even quieter, decays faster)
    const shimmerEnvelope = this.ctx.createGain();
    shimmerEnvelope.gain.setValueAtTime(0, now);
    shimmerEnvelope.gain.linearRampToValueAtTime(0.08, now + 0.005);
    shimmerEnvelope.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.8);

    // Connect nodes
    osc1.connect(envelope);
    osc2.connect(shimmerEnvelope);
    
    // Route both envelopes to master path
    envelope.connect(this.masterGain);
    shimmerEnvelope.connect(this.masterGain);
    
    // Also feed a bit of the main chime into the delay node for depth
    envelope.connect(this.delayNode);

    // Start & stop oscillators
    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + duration * 2.0);
    osc2.stop(now + duration * 1.5);
  }

  startMelody() {
    this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        this.runMelodyLoop();
      }).catch(err => {
        console.error("Failed to resume AudioContext:", err);
      });
    } else {
      this.runMelodyLoop();
    }
  }

  runMelodyLoop() {
    if (this.isPlayingMelody) return;
    this.isPlayingMelody = true;
    this.isPlaying = true;
    this.currentNoteIndex = 0;
    this.playNextNote();
  }

  playNextNote() {
    if (!this.isPlayingMelody) return;

    const beatDuration = 60 / this.tempo;
    const [note, durationBeats, pauseBeats] = MELODY[this.currentNoteIndex];
    
    const noteDuration = durationBeats * beatDuration;
    const pauseDuration = pauseBeats * beatDuration;

    this.playNote(note, noteDuration);

    this.currentNoteIndex = (this.currentNoteIndex + 1) % MELODY.length;
    
    this.nextNoteTimeout = setTimeout(() => {
      this.playNextNote();
    }, pauseDuration * 1000);
  }

  pause() {
    this.isPlaying = false;
    this.isPlayingMelody = false;
    if (this.nextNoteTimeout) {
      clearTimeout(this.nextNoteTimeout);
      this.nextNoteTimeout = null;
    }
  }

  resume() {
    if (this.isPlaying) return;
    this.startMelody();
  }

  stop() {
    this.pause();
    this.currentNoteIndex = 0;
  }
}

export const birthdaySynth = new BirthdaySynth();
export default birthdaySynth;
