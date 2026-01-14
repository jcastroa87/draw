// Audio Manager for Gorila Studio
// Handles sound effects and letter/number pronunciations

class AudioManager {
  constructor() {
    this.enabled = true;
    this.effectsVolume = 0.5;
    this.audioContext = null;

    this.init();
  }

  init() {
    // Initialize AudioContext on first user interaction
    document.addEventListener("click", () => this.initAudioContext(), {
      once: true,
    });
    document.addEventListener("touchstart", () => this.initAudioContext(), {
      once: true,
    });
  }

  initAudioContext() {
    if (this.audioContext) return;

    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    this.loadSounds();
  }

  async loadSounds() {
    // We use Web Audio API oscillators for sounds
    // No external audio files needed
  }

  // Toggle sound on/off
  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled && this.music) {
      this.music.pause();
    }
    return this.enabled;
  }

  // Play a success celebration sound
  playSuccess() {
    if (!this.enabled) return;
    
    // Try to initialize AudioContext if not ready
    if (!this.audioContext) {
      this.initAudioContext();
    }
    
    // If still no AudioContext, use speech as fallback
    if (!this.audioContext) {
      // Simple cheer using speech synthesis
      const cheer = new SpeechSynthesisUtterance('¡Bravo!');
      cheer.volume = 1;
      cheer.rate = 1.2;
      speechSynthesis.speak(cheer);
      return;
    }
    
    // Resume audio context if suspended (browser policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const now = this.audioContext.currentTime;

    // Create a happy ascending arpeggio - LOUDER
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const volume = 0.8; // Higher volume for better audibility

    notes.forEach((freq, i) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.type = "triangle"; // More audible than sine
      osc.frequency.value = freq;

      const noteStart = now + i * 0.12;
      gain.gain.setValueAtTime(volume, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.01, noteStart + 0.25);

      osc.start(noteStart);
      osc.stop(noteStart + 0.3);
    });
  }

  // Play a soft tap sound
  playTap() {
    if (!this.enabled || !this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.type = "sine";
    osc.frequency.value = 800;

    const now = this.audioContext.currentTime;
    gain.gain.setValueAtTime(this.effectsVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Play a whoosh sound for transitions
  playWhoosh() {
    if (!this.enabled || !this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.type = "sawtooth";
    filter.type = "lowpass";

    const now = this.audioContext.currentTime;

    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);

    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.2);

    gain.gain.setValueAtTime(this.effectsVolume * 0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Play a pop sound for button presses
  playPop() {
    if (!this.enabled || !this.audioContext) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.type = "sine";

    const now = this.audioContext.currentTime;
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);

    gain.gain.setValueAtTime(this.effectsVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Speak a letter or number using Web Speech API
  speak(text, lang = "es-ES") {
    if (!this.enabled) return;

    // Map language codes
    const langMap = {
      es: "es-ES",
      ru: "ru-RU",
    };

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langMap[lang] || lang;
    utterance.rate = 0.8; // Slower for kids
    utterance.pitch = 1.2; // Slightly higher pitch
    utterance.volume = this.effectsVolume;

    speechSynthesis.speak(utterance);
  }
}

// Export singleton instance
export const audio = new AudioManager();
