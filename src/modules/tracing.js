// Tracing Module for Letter and Number Tracing
// Uses LARGE TEXT for letter display and pixel coverage for validation
// Supports Spanish, Russian alphabets and numbers

import { spanishAlphabet } from '../data/letters-es.js';
import { russianAlphabet } from '../data/letters-ru.js';
import { numbers } from '../data/numbers.js';
import { audio } from './audio.js';
import { SETTINGS } from '../settings.js';

class TracingModule {
  constructor() {
    // Main visible canvas
    this.canvas = null;
    this.ctx = null;
    
    // Off-screen canvases for pixel-based detection
    this.guideCanvas = null;  // Holds the letter as solid shape (target area)
    this.guideCtx = null;
    this.userCanvas = null;   // Holds user's drawing for coverage analysis
    this.userCtx = null;
    
    this.mode = 'letters'; // 'letters' or 'numbers'
    this.language = 'es';  // 'es' or 'ru'
    this.currentIndex = 0;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.drawingPaths = []; // User's drawn paths for undo
    
    // ═══════════════════════════════════════════════════════════════════
    // CONFIGURABLE SETTINGS - Loaded from src/settings.js
    // ═══════════════════════════════════════════════════════════════════
    this.completionThreshold = SETTINGS.TRACING.COMPLETION_THRESHOLD;
    this.userLineWidth = SETTINGS.TRACING.USER_LINE_WIDTH;
    
    // Visual settings
    this.letterFont = SETTINGS.TRACING.FONT_FAMILY;
    this.letterColor = SETTINGS.TRACING.GUIDE_COLOR;
    this.strokeColor = SETTINGS.TRACING.STROKE_COLOR;
    
    this.onComplete = null;
  }

  // Initialize the tracing module
  init(canvasId, mode = 'letters') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.mode = mode;
    
    this.setupCanvas();
    this.setupOffscreenCanvases();
    this.setupEvents();
    this.render();
  }

  // Setup canvas size for high DPI displays
  setupCanvas() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    this.width = rect.width;
    this.height = rect.height;
    this.size = Math.min(rect.width, rect.height);
    this.dpr = dpr;
  }

  // Create off-screen canvases for pixel-based detection
  // These canvases work in CSS pixel space (no DPR scaling)
  setupOffscreenCanvases() {
    // Guide canvas - holds the letter as solid shape
    this.guideCanvas = document.createElement('canvas');
    this.guideCanvas.width = this.width;
    this.guideCanvas.height = this.height;
    this.guideCtx = this.guideCanvas.getContext('2d');
    
    // User canvas - holds the user's drawing
    this.userCanvas = document.createElement('canvas');
    this.userCanvas.width = this.width;
    this.userCanvas.height = this.height;
    this.userCtx = this.userCanvas.getContext('2d');
  }

  // Setup touch and mouse events
  setupEvents() {
    // Touch events
    this.canvas.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
    this.canvas.addEventListener('touchend', (e) => this.handleEnd(e));
    this.canvas.addEventListener('touchcancel', (e) => this.handleEnd(e));
    
    // Mouse events for desktop testing
    this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
    this.canvas.addEventListener('mouseup', (e) => this.handleEnd(e));
    this.canvas.addEventListener('mouseleave', (e) => this.handleEnd(e));
  }

  // Get coordinates from touch or mouse event
  getCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    let x, y;

    if (e.touches && e.touches.length > 0) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    return { x, y };
  }

  // Handle start of drawing
  handleStart(e) {
    e.preventDefault();
    this.isDrawing = true;
    
    const { x, y } = this.getCoords(e);
    this.lastX = x;
    this.lastY = y;
    
    this.drawingPaths.push([{ x, y }]);
    audio.playTap();
  }

  // Handle drawing movement
  handleMove(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    
    const { x, y } = this.getCoords(e);
    
    // Draw on VISIBLE canvas (colorful stroke)
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.userLineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
    
    // Draw on USER CANVAS (white for pixel analysis)
    this.userCtx.beginPath();
    this.userCtx.moveTo(this.lastX, this.lastY);
    this.userCtx.lineTo(x, y);
    this.userCtx.strokeStyle = '#FFFFFF';
    this.userCtx.lineWidth = this.userLineWidth;
    this.userCtx.lineCap = 'round';
    this.userCtx.lineJoin = 'round';
    this.userCtx.stroke();
    
    // Track the path for undo
    if (this.drawingPaths.length > 0) {
      this.drawingPaths.at(-1).push({ x, y });
    }
    
    this.lastX = x;
    this.lastY = y;
  }

  // Handle end of drawing
  handleEnd(e) {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.checkCompletion();
    }
  }

  // Check completion using pixel coverage
  // Measures how much of the letter area is covered by the user's drawing
  checkCompletion() {
    if (!this.guideCtx || !this.userCtx) return;
    
    const w = this.guideCanvas.width;
    const h = this.guideCanvas.height;
    
    const guideData = this.guideCtx.getImageData(0, 0, w, h).data;
    const userData = this.userCtx.getImageData(0, 0, w, h).data;
    
    let letterPixels = 0;   // Total pixels of the letter (non-transparent in guide)
    let coveredPixels = 0;  // Letter pixels covered by user's drawing
    
    // Check every 4th pixel for performance
    for (let i = 0; i < guideData.length; i += 16) {
      // Letter pixels are white (R > 200) in guide canvas
      if (guideData[i] > 200) {
        letterPixels++;
        // User drawing is white (R > 128) in user canvas
        if (userData[i] > 128) {
          coveredPixels++;
        }
      }
    }
    
    if (letterPixels === 0) return;
    
    const coverage = coveredPixels / letterPixels;
    
    if (coverage >= this.completionThreshold) {
      audio.playSuccess();
      this.celebrate();
    }
  }

  // Celebrate completion
  celebrate() {
    if (this.onComplete) {
      this.onComplete();
    }
    
    // Use mode-specific celebration element
    const celebrationId = this.mode === 'numbers' ? 'number-celebration' : 'celebration';
    const celebration = document.getElementById(celebrationId);
    
    if (celebration) {
      celebration.classList.remove('hidden');
      
      // Update celebration text based on language
      const celebrationText = celebration.querySelector('.celebration-text');
      if (celebrationText) {
        celebrationText.textContent = this.language === 'ru' ? 'Молодец!' : '¡Muy bien!';
      }
      
      // Auto advance after celebration
      setTimeout(() => {
        celebration.classList.add('hidden');
        this.next();
      }, 1500);
    } else {
      // No celebration UI, just advance
      setTimeout(() => this.next(), 500);
    }
  }

  // Get current item data
  getCurrentItem() {
    if (this.mode === 'numbers') {
      return numbers[this.currentIndex];
    } else if (this.language === 'ru') {
      return russianAlphabet[this.currentIndex];
    } else {
      return spanishAlphabet[this.currentIndex];
    }
  }

  // Get current character to display
  getCurrentChar() {
    const item = this.getCurrentItem();
    if (this.mode === 'numbers') {
      return item.number.toString();
    } else {
      return item.letter;
    }
  }

  // Get total items count
  getTotalItems() {
    if (this.mode === 'numbers') {
      return numbers.length;
    } else if (this.language === 'ru') {
      return russianAlphabet.length;
    } else {
      return spanishAlphabet.length;
    }
  }

  // Navigate to next item
  next() {
    const total = this.getTotalItems();
    this.currentIndex = (this.currentIndex + 1) % total;
    this.clearDrawing();
    this.render();
    this.speakCurrentLetter();
  }

  // Navigate to previous item
  prev() {
    const total = this.getTotalItems();
    this.currentIndex = (this.currentIndex - 1 + total) % total;
    this.clearDrawing();
    this.render();
    this.speakCurrentLetter();
  }

  // Navigate to specific index
  goToIndex(index) {
    const total = this.getTotalItems();
    if (index >= 0 && index < total) {
      this.currentIndex = index;
      this.clearDrawing();
      this.render();
      this.speakCurrentLetter();
    }
  }

  // Get all items for the picker
  getItems() {
    if (this.mode === 'numbers') {
      return numbers;
    } else if (this.language === 'ru') {
      return russianAlphabet;
    } else {
      return spanishAlphabet;
    }
  }

  // Clear user's drawing
  clearDrawing() {
    this.drawingPaths = [];
    // Clear user canvas
    if (this.userCtx) {
      this.userCtx.fillStyle = '#000000';
      this.userCtx.fillRect(0, 0, this.width, this.height);
    }
    this.render();
  }

  // Speak the current letter using Web Speech API
  speakCurrentLetter() {
    // Use lowercase to avoid TTS saying "capital letter" in Russian
    const char = this.getCurrentChar().toLowerCase();
    audio.speak(char, this.language);
  }

  // Set language
  setLanguage(lang) {
    this.language = lang;
    this.currentIndex = 0;
    this.clearDrawing();
    this.render();
  }

  // Main render function
  render() {
    if (!this.ctx) return;
    
    // Clear main canvas
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Get current character
    const char = this.getCurrentChar();
    
    // Calculate font size (80% of canvas height for large letters)
    const fontSize = this.height * 0.75;
    
    // Draw letter as large text
    this.ctx.font = `bold ${fontSize}px ${this.letterFont}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = this.letterColor;
    this.ctx.fillText(char, this.width / 2, this.height / 2);
    
    // Also render to guide canvas for detection (white letter on black background)
    this.renderGuide(char, fontSize);
    
    // Re-draw user's strokes on top
    this.redrawUserStrokes();
    
    // Update UI elements
    this.updateUI();
  }

  // Render the letter to guide canvas for detection
  renderGuide(char, fontSize) {
    if (!this.guideCtx) return;
    
    // Clear with black background
    this.guideCtx.fillStyle = '#000000';
    this.guideCtx.fillRect(0, 0, this.width, this.height);
    
    // Draw letter in white (target area)
    this.guideCtx.font = `bold ${fontSize}px ${this.letterFont}`;
    this.guideCtx.textAlign = 'center';
    this.guideCtx.textBaseline = 'middle';
    this.guideCtx.fillStyle = '#FFFFFF';
    this.guideCtx.fillText(char, this.width / 2, this.height / 2);
    
    // Clear user canvas when letter changes
    this.userCtx.fillStyle = '#000000';
    this.userCtx.fillRect(0, 0, this.width, this.height);
  }

  // Redraw user's strokes (for after render clears canvas)
  redrawUserStrokes() {
    this.drawingPaths.forEach(path => {
      if (path.length < 2) return;
      
      this.ctx.beginPath();
      this.ctx.moveTo(path[0].x, path[0].y);
      
      for (let i = 1; i < path.length; i++) {
        this.ctx.lineTo(path[i].x, path[i].y);
      }
      
      this.ctx.strokeStyle = this.strokeColor;
      this.ctx.lineWidth = this.userLineWidth;
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
      this.ctx.stroke();
    });
  }

  // Update UI elements (counter, current letter display, etc.)
  updateUI() {
    if (this.mode === 'numbers') {
      this.updateNumbersUI();
    } else {
      this.updateLettersUI();
    }
  }

  // Update numbers UI
  updateNumbersUI() {
    const item = this.getCurrentItem();
    const total = this.getTotalItems();
    
    this.setElementText('current-number-big', item.number);
    this.setElementText('number-current', item.number);
    this.setElementText('number-total', total);
    
    // Update counting display (bananas)
    const countingDisplay = document.getElementById('counting-display');
    if (countingDisplay) {
      countingDisplay.innerHTML = '🍌'.repeat(item.number);
    }
  }

  // Update letters UI
  updateLettersUI() {
    const item = this.getCurrentItem();
    const total = this.getTotalItems();
    
    this.setElementText('current-letter-big', item.letter);
    this.setElementText('letter-current', item.letter);
    this.setElementText('letter-total', total);
  }

  // Helper to set element text
  setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  // Clear method (alias for clearDrawing)
  clear() {
    this.clearDrawing();
  }

  // Speak current (alias for speakCurrentLetter)
  speakCurrent() {
    this.speakCurrentLetter();
  }

  // Cleanup
  destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('touchstart', this.handleStart);
      this.canvas.removeEventListener('touchmove', this.handleMove);
      this.canvas.removeEventListener('touchend', this.handleEnd);
      this.canvas.removeEventListener('mousedown', this.handleStart);
      this.canvas.removeEventListener('mousemove', this.handleMove);
      this.canvas.removeEventListener('mouseup', this.handleEnd);
    }
  }
}

// Export two separate instances for letters and numbers (as expected by main.js)
export const letterTracing = new TracingModule();
export const numberTracing = new TracingModule();
export default letterTracing;

