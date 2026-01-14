// Gorila Studio - Main Application
// Educational drawing app for kids

import './style.css';
import { audio } from './modules/audio.js';
import { letterTracing, numberTracing } from './modules/tracing.js';
import { coloringModule } from './modules/coloring.js';
import { freeDrawModule } from './modules/freedraw.js';
import { matchingGame } from './modules/matching.js';
import { translations } from './data/translations.js';
import { SETTINGS } from './settings.js';

class GorilaStudio {
  constructor() {
    this.currentScreen = 'loading';
    this.language = SETTINGS.APP.DEFAULT_LANGUAGE;
    this.soundEnabled = SETTINGS.APP.SOUND_ENABLED_BY_DEFAULT;
    
    this.colors = SETTINGS.PALETTE;
    
    // User session settings
    this.sessionLimitMinutes = SETTINGS.APP.SESSION_LIMIT_MINUTES; 
    this.sessionTimer = null;
    
    this.init();
  }

  init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.setupLoadingScreen();
    this.setupNavigation();
    this.setupSoundToggle();
    this.setupLanguageSelector();
    this.setupColorPalettes();
    this.setupLetterTracing();
    this.setupNumberTracing();
    this.setupColoring();
    this.setupFreeDraw();
    
    // Start session timer
    this.startSessionTimer();
  }

  // Start session timer
  startSessionTimer() {
    if (this.sessionTimer) clearInterval(this.sessionTimer);
    
    // Total seconds based on settings
    let remainingSeconds = this.sessionLimitMinutes * 60;
    
    // Timer display element
    const display = document.getElementById('session-display');
    if (display) display.classList.remove('hidden');

    console.log(`⏱️ Session timer started: ${this.sessionLimitMinutes} minutes`);
    
    // Update every second
    this.sessionTimer = setInterval(() => {
      remainingSeconds--;
      
      // Update display
      if (display) {
        const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
        const secs = (remainingSeconds % 60).toString().padStart(2, '0');
        display.textContent = `⏱️ ${mins}:${secs}`;
        
        // Warning if less than 1 minute
        if (remainingSeconds < 60) {
          display.classList.add('warning');
        }
      }
      
      // Time up
      if (remainingSeconds <= 0) {
        clearInterval(this.sessionTimer);
        this.showLockoutScreen();
      }
    }, 1000);
  }

  // Show lockout screen
  showLockoutScreen() {
    const lockout = document.getElementById('lockout-screen');
    if (lockout) {
      // Update text with translation
      const textEl = lockout.querySelector('.celebration-text');
      const subTextEl = lockout.querySelector('p');
      
      if (textEl) textEl.textContent = this.t('timeToRest');
      if (subTextEl) subTextEl.textContent = this.t('seeYouTomorrow');
      
      lockout.classList.remove('hidden');
      if (audio.playWhoosh) audio.playWhoosh(); 
      console.log('🔒 Session time expired. Screen locked.');
    }
  }

  // Get translation
  t(key) {
    return translations[this.language]?.[key] || translations.es[key] || key;
  }

  // Loading screen with animation
  setupLoadingScreen() {
    setTimeout(() => {
      // Hide loading, show menu
      this.showScreen('menu');
    }, 2500);
  }

  // Show a screen by ID
  showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });
    
    // Show target screen
    const target = document.getElementById(`${screenId}-screen`);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
      
      // Initialize canvases when screens are shown
      this.initScreenCanvas(screenId);
    }
  }

  // Initialize canvas for a screen
  initScreenCanvas(screenId) {
    // Small delay to ensure DOM is ready
    setTimeout(() => {
      if (screenId === 'letters') {
        letterTracing.init('tracing-canvas', 'letters');
        letterTracing.setLanguage(this.language);
        letterTracing.updateUI();
        letterTracing.speakCurrent();
      } else if (screenId === 'numbers') {
        numberTracing.init('number-canvas', 'numbers');
        numberTracing.setLanguage(this.language);
        numberTracing.updateUI();
        numberTracing.speakCurrent();
      } else if (screenId === 'coloring') {
        coloringModule.init('coloring-canvas');
        this.updateTemplateDisplay();
      } else if (screenId === 'free-draw') {
        freeDrawModule.init('free-canvas');
      } else if (screenId === 'matching') {
        matchingGame.setLanguage(this.language);
        matchingGame.init();
      }
    }, 100);
  }

  // Setup main navigation
  setupNavigation() {
    // Menu cards
    document.querySelectorAll('.menu-card').forEach(card => {
      card.addEventListener('click', () => {
        const module = card.dataset.module;
        audio.playPop();
        
        if (module === 'letters') {
          this.showScreen('letters');
        } else if (module === 'numbers') {
          this.showScreen('numbers');
        } else if (module === 'coloring') {
          this.showScreen('coloring');
        } else if (module === 'free-draw') {
          this.showScreen('free-draw');
        } else if (module === 'matching') {
          this.showScreen('matching');
        }
      });
    });
    
    // Back buttons
    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        audio.playPop();
        this.showScreen('menu');
      });
    });
  }

  // Setup sound toggle
  setupSoundToggle() {
    const toggle = document.getElementById('sound-toggle');
    if (!toggle) return;
    
    toggle.addEventListener('click', () => {
      this.soundEnabled = audio.toggle();
      
      const soundOn = toggle.querySelector('.sound-on');
      const soundOff = toggle.querySelector('.sound-off');
      
      if (this.soundEnabled) {
        soundOn.classList.remove('hidden');
        soundOff.classList.add('hidden');
      } else {
        soundOn.classList.add('hidden');
        soundOff.classList.remove('hidden');
      }
    });
  }

  // Setup language selector
  setupLanguageSelector() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        this.language = btn.dataset.lang;
        audio.playPop();
        
        // Update all interface text
        this.updateInterfaceLanguage();
        
        // Update tracing modules
        letterTracing.setLanguage(this.language);
        numberTracing.setLanguage(this.language);
        
        // Update coloring template name
        this.updateTemplateDisplay();
      });
    });
  }

  // Update all interface text based on language
  updateInterfaceLanguage() {
    // Header title
    const headerTitle = document.querySelector('.header-title');
    if (headerTitle) {
      headerTitle.innerHTML = `🦍 ${this.t('appTitle')}`;
    }

    // Menu cards
    const menuLabels = {
      'letters': 'letters',
      'numbers': 'numbers', 
      'coloring': 'coloring',
      'free-draw': 'freeDraw',
      'matching': 'matching'
    };
    
    document.querySelectorAll('.menu-card').forEach(card => {
      const module = card.dataset.module;
      const label = card.querySelector('.card-label');
      const icon = card.querySelector('.card-icon');
      
      if (label && menuLabels[module]) {
        label.textContent = this.t(menuLabels[module]);
      }
      
      // Update letters icon based on language
      if (module === 'letters' && icon) {
        icon.textContent = this.language === 'ru' ? 'АБВ' : 'ABC';
      }
    });

    // Game screen titles
    const lettersTitle = document.querySelector('#letters-screen .game-title');
    if (lettersTitle) lettersTitle.textContent = this.t('lettersTitle');
    
    const numbersTitle = document.querySelector('#numbers-screen .game-title');
    if (numbersTitle) numbersTitle.textContent = this.t('numbersTitle');
    
    const coloringTitle = document.querySelector('#coloring-screen .game-title');
    if (coloringTitle) coloringTitle.textContent = this.t('coloringTitle');
    
    const freeDrawTitle = document.querySelector('#free-draw-screen .game-title');
    if (freeDrawTitle) freeDrawTitle.textContent = this.t('freeDrawTitle');

    const matchingTitle = document.querySelector('#matching-screen .game-title');
    if (matchingTitle) matchingTitle.textContent = this.t('matchingTitle');

    // Matching mode buttons
    const matchingModeLetters = document.getElementById('matching-mode-letters');
    if (matchingModeLetters) matchingModeLetters.textContent = this.t('matchingModeLetters');
    
    const matchingModeNumbers = document.getElementById('matching-mode-numbers');
    if (matchingModeNumbers) matchingModeNumbers.textContent = this.t('matchingModeNumbers');

    const matchingNewGame = document.getElementById('matching-new-game');
    if (matchingNewGame) matchingNewGame.textContent = this.t('newGame');

    // Update matching game language
    matchingGame.setLanguage(this.language);

    // Clear buttons
    const clearTracing = document.getElementById('clear-tracing');
    if (clearTracing) clearTracing.innerHTML = this.t('clear');
    
    const clearNumber = document.getElementById('clear-number');
    if (clearNumber) clearNumber.innerHTML = this.t('clear');

    // Celebration text
    const celebrationText = document.querySelector('.celebration-text');
    if (celebrationText) celebrationText.textContent = this.t('greatJob');

    // Loading text
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) loadingText.textContent = this.t('loadingText');
  }

  // Setup color palettes
  setupColorPalettes() {
    const palettes = ['color-palette', 'free-palette'];
    
    palettes.forEach(paletteId => {
      const palette = document.getElementById(paletteId);
      if (!palette) return;
      
      this.colors.forEach((color, index) => {
        const btn = document.createElement('button');
        btn.className = 'color-btn' + (index === 0 ? ' active' : '');
        btn.style.backgroundColor = color;
        btn.dataset.color = color;
        
        btn.addEventListener('click', () => {
          palette.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          
          if (paletteId === 'color-palette') {
            coloringModule.setColor(color);
          } else {
            freeDrawModule.setColor(color);
          }
          
          audio.playTap();
        });
        
        palette.appendChild(btn);
      });
    });
  }

  // Setup letter tracing controls
  setupLetterTracing() {
    const clearBtn = document.getElementById('clear-tracing');
    const prevBtn = document.getElementById('prev-letter');
    const nextBtn = document.getElementById('next-letter');
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        letterTracing.clear();
        audio.playWhoosh();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        letterTracing.prev();
        audio.playPop();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        letterTracing.next();
        audio.playPop();
      });
    }
    
    // Celebration click to dismiss
    const celebration = document.getElementById('celebration');
    if (celebration) {
      celebration.addEventListener('click', () => {
        celebration.classList.add('hidden');
      });
    }
    
    // Letter picker functionality
    const pickerBtn = document.getElementById('letter-picker-btn');
    const picker = document.getElementById('letter-picker');
    const closePicker = document.getElementById('close-letter-picker');
    const letterGrid = document.getElementById('letter-grid');
    
    if (pickerBtn && picker) {
      pickerBtn.addEventListener('click', () => {
        // Populate grid with letters
        letterGrid.innerHTML = '';
        const items = letterTracing.getItems();
        items.forEach((item, index) => {
          const btn = document.createElement('button');
          btn.className = 'picker-item';
          btn.textContent = item.letter;
          btn.addEventListener('click', () => {
            letterTracing.goToIndex(index);
            picker.classList.add('hidden');
          });
          letterGrid.appendChild(btn);
        });
        picker.classList.remove('hidden');
      });
    }
    
    if (closePicker && picker) {
      closePicker.addEventListener('click', () => {
        picker.classList.add('hidden');
      });
    }
  }

  // Setup number tracing controls
  setupNumberTracing() {
    const clearBtn = document.getElementById('clear-number');
    const prevBtn = document.getElementById('prev-number');
    const nextBtn = document.getElementById('next-number');
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        numberTracing.clear();
        audio.playWhoosh();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        numberTracing.prev();
        audio.playPop();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        numberTracing.next();
        audio.playPop();
      });
    }
    
    // Number picker functionality
    const pickerBtn = document.getElementById('number-picker-btn');
    const picker = document.getElementById('number-picker');
    const closePicker = document.getElementById('close-number-picker');
    const numberGrid = document.getElementById('number-grid');
    
    if (pickerBtn && picker) {
      pickerBtn.addEventListener('click', () => {
        // Populate grid with numbers
        numberGrid.innerHTML = '';
        const items = numberTracing.getItems();
        items.forEach((item, index) => {
          const btn = document.createElement('button');
          btn.className = 'picker-item';
          btn.textContent = item.number;
          btn.addEventListener('click', () => {
            numberTracing.goToIndex(index);
            picker.classList.add('hidden');
          });
          numberGrid.appendChild(btn);
        });
        picker.classList.remove('hidden');
      });
    }
    
    if (closePicker && picker) {
      closePicker.addEventListener('click', () => {
        picker.classList.add('hidden');
      });
    }
    
    // Number celebration click to dismiss
    const numberCelebration = document.getElementById('number-celebration');
    if (numberCelebration) {
      numberCelebration.addEventListener('click', () => {
        numberCelebration.classList.add('hidden');
      });
    }
  }

  // Setup coloring controls
  setupColoring() {
    const fillTool = document.getElementById('fill-tool');
    const brushTool = document.getElementById('brush-tool');
    const undoBtn = document.getElementById('undo-btn');
    const clearBtn = document.getElementById('clear-coloring');
    const prevTemplate = document.getElementById('prev-template');
    const nextTemplate = document.getElementById('next-template');
    
    if (fillTool) {
      fillTool.addEventListener('click', () => {
        coloringModule.setTool('fill');
        fillTool.classList.add('active');
        brushTool?.classList.remove('active');
        audio.playTap();
      });
    }
    
    if (brushTool) {
      brushTool.addEventListener('click', () => {
        coloringModule.setTool('brush');
        brushTool.classList.add('active');
        fillTool?.classList.remove('active');
        audio.playTap();
      });
    }
    
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        coloringModule.undo();
      });
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        coloringModule.clear();
      });
    }
    
    if (prevTemplate) {
      prevTemplate.addEventListener('click', () => {
        coloringModule.prevTemplate();
        this.updateTemplateDisplay();
        audio.playPop();
      });
    }
    
    if (nextTemplate) {
      nextTemplate.addEventListener('click', () => {
        coloringModule.nextTemplate();
        this.updateTemplateDisplay();
        audio.playPop();
      });
    }
  }

  // Update template name display
  updateTemplateDisplay() {
    const templateName = document.getElementById('template-name');
    if (templateName) {
      const template = coloringModule.getCurrentTemplate();
      if (template) {
        templateName.textContent = this.language === 'es' ? template.name : template.nameRu;
      }
    }
  }

  // Setup free draw controls
  setupFreeDraw() {
    const eraserTool = document.getElementById('eraser-tool');
    const clearBtn = document.getElementById('clear-free');
    const saveBtn = document.getElementById('save-drawing');
    
    // Brush sizes
    document.querySelectorAll('#brush-sizes .size-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#brush-sizes .size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const size = parseInt(btn.dataset.size);
        freeDrawModule.setBrushSize(size);
        freeDrawModule.toggleEraser(false);
        eraserTool?.classList.remove('active');
        audio.playTap();
      });
    });
    
    if (eraserTool) {
      eraserTool.addEventListener('click', () => {
        const isActive = eraserTool.classList.toggle('active');
        freeDrawModule.toggleEraser(isActive);
        audio.playTap();
      });
    }
    
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        freeDrawModule.clear();
      });
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        freeDrawModule.save();
      });
    }
  }
}

// Start the app
new GorilaStudio();
