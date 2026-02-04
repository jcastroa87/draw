// Tracing Module for Letter and Number Tracing
// Guided tracing with animated demo and rainbow trail
// Supports Spanish, Russian alphabets and numbers

import { spanishAlphabet } from '../data/letters-es.js';
import { russianAlphabet } from '../data/letters-ru.js';
import { numbers } from '../data/numbers.js';
import { spanishWaypoints } from '../data/waypoints-es.js';
import { russianWaypoints } from '../data/waypoints-ru.js';
import { numberWaypoints } from '../data/waypoints-numbers.js';
import { audio } from './audio.js';
import { progress } from './progress.js';
import { SETTINGS } from '../settings.js';

// Rainbow colors for trail effect
const RAINBOW_COLORS = [
  '#FF6B6B', // Red
  '#FF8E53', // Orange
  '#FFD93D', // Yellow
  '#6BCB77', // Green
  '#4D96FF', // Blue
  '#9B59B6', // Purple
  '#FF6B9D'  // Pink
];

class TracingModule {
  constructor() {
    // Main visible canvas
    this.canvas = null;
    this.ctx = null;

    this.mode = 'letters'; // 'letters' or 'numbers'
    this.language = 'es';  // 'es' or 'ru'
    this.currentIndex = 0;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    // Guided tracing state
    this.currentStrokeIndex = 0;
    this.currentWaypointIndex = 0;
    this.completedStrokes = [];
    this.isShowingDemo = false;
    this.demoAnimationId = null;
    this.guidePointPulse = 0;
    this.guidePointAnimationId = null;

    // Rainbow trail state
    this.rainbowIndex = 0;
    this.totalPathLength = 0;

    // User's drawn paths for display
    this.drawingPaths = [];
    this.currentPath = [];

    // Settings
    this.userLineWidth = SETTINGS.TRACING.USER_LINE_WIDTH;
    this.letterFont = SETTINGS.TRACING.FONT_FAMILY;
    this.letterColor = SETTINGS.TRACING.GUIDE_COLOR;
    this.guidePointRadius = 10;  // Small guide point
    this.hitRadius = 35; // How close user must trace to advance waypoint

    this.onComplete = null;
    this.width = 0;
    this.height = 0;
  }

  // Initialize the tracing module
  init(canvasId, mode = 'letters') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.mode = mode;

    this.setupCanvas();
    this.setupEvents();
    this.render();

    // Show demo animation for current letter
    this.startDemo();
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
    this.dpr = dpr;
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

  // Get current waypoints data
  getCurrentWaypoints() {
    const char = this.getCurrentChar();

    if (this.mode === 'numbers') {
      return numberWaypoints[char];
    } else if (this.language === 'ru') {
      return russianWaypoints[char];
    } else {
      return spanishWaypoints[char];
    }
  }

  // Convert percentage coordinates to canvas pixels
  toPixel(point) {
    return {
      x: (point.x / 100) * this.width,
      y: (point.y / 100) * this.height
    };
  }

  // Get current guide point position
  getCurrentGuidePoint() {
    const waypoints = this.getCurrentWaypoints();
    if (!waypoints || !waypoints.strokes) return null;

    const stroke = waypoints.strokes[this.currentStrokeIndex];
    if (!stroke || !stroke.points) return null;

    const point = stroke.points[this.currentWaypointIndex];
    if (!point) return null;

    return this.toPixel(point);
  }

  // Handle start of drawing
  handleStart(e) {
    if (this.isShowingDemo) return;
    e.preventDefault();

    this.isDrawing = true;
    const { x, y } = this.getCoords(e);
    this.lastX = x;
    this.lastY = y;

    this.currentPath = [{ x, y, color: this.getCurrentRainbowColor() }];

    // Mark as attempted
    const char = this.getCurrentChar();
    const type = this.mode === 'numbers' ? 'numbers' : 'letters';
    progress.markAttempted(char, type, this.language);

    audio.playTap();
  }

  // Get current rainbow color based on path length
  getCurrentRainbowColor() {
    const colorIndex = Math.floor(this.totalPathLength / 30) % RAINBOW_COLORS.length;
    return RAINBOW_COLORS[colorIndex];
  }

  // Handle drawing movement
  handleMove(e) {
    if (!this.isDrawing || this.isShowingDemo) return;
    e.preventDefault();

    const { x, y } = this.getCoords(e);

    // Calculate segment length for rainbow effect
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const segmentLength = Math.sqrt(dx * dx + dy * dy);
    this.totalPathLength += segmentLength;

    const color = this.getCurrentRainbowColor();

    // Draw rainbow stroke
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = this.userLineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();

    // Track path
    this.currentPath.push({ x, y, color });

    // Check if we hit the current guide point
    this.checkGuidePointHit(x, y);

    this.lastX = x;
    this.lastY = y;

    // Redraw guide point on top
    this.drawGuidePoint();
  }

  // Check if the user's stroke hits the current guide point
  checkGuidePointHit(x, y) {
    const guidePoint = this.getCurrentGuidePoint();
    if (!guidePoint) return;

    const dx = x - guidePoint.x;
    const dy = y - guidePoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.hitRadius) {
      this.advanceWaypoint();
    }
  }

  // Advance to the next waypoint
  advanceWaypoint() {
    const waypoints = this.getCurrentWaypoints();
    if (!waypoints || !waypoints.strokes) return;

    const stroke = waypoints.strokes[this.currentStrokeIndex];
    if (!stroke) return;

    // Play small sound for progress
    audio.playTap();

    // Move to next waypoint in current stroke
    if (this.currentWaypointIndex < stroke.points.length - 1) {
      this.currentWaypointIndex++;
    } else {
      // Stroke completed, move to next stroke
      this.completedStrokes.push(this.currentStrokeIndex);
      this.currentStrokeIndex++;
      this.currentWaypointIndex = 0;

      // Check if all strokes completed
      if (this.currentStrokeIndex >= waypoints.strokes.length) {
        this.onLetterComplete();
        return;
      }
    }

    // Redraw to show new guide point position
    this.render();
    this.redrawUserStrokes();
    this.drawGuidePoint();
  }

  // Handle end of drawing
  handleEnd(e) {
    if (this.isDrawing) {
      this.isDrawing = false;

      // Save current path
      if (this.currentPath.length > 1) {
        this.drawingPaths.push([...this.currentPath]);
      }
      this.currentPath = [];
    }
  }

  // Called when letter/number is fully traced
  onLetterComplete() {
    const char = this.getCurrentChar();
    const type = this.mode === 'numbers' ? 'numbers' : 'letters';

    // Mark as completed and add banana
    progress.markCompleted(char, type, this.language);
    progress.addBanana(1);

    audio.playSuccess();
    this.celebrate();
  }

  // Show celebration
  celebrate() {
    if (this.onComplete) {
      this.onComplete();
    }

    const celebrationId = this.mode === 'numbers' ? 'number-celebration' : 'celebration';
    const celebration = document.getElementById(celebrationId);

    if (celebration) {
      celebration.classList.remove('hidden');

      const celebrationText = celebration.querySelector('.celebration-text');
      if (celebrationText) {
        celebrationText.textContent = this.language === 'ru' ? 'Молодец!' : '¡Muy bien!';
      }

      // Show banana reward
      this.showBananaReward();

      // Auto advance after celebration
      setTimeout(() => {
        celebration.classList.add('hidden');
        this.next();
      }, 1800);
    } else {
      setTimeout(() => this.next(), 500);
    }
  }

  // Show floating banana reward animation
  showBananaReward() {
    const reward = document.createElement('div');
    reward.className = 'banana-reward';
    reward.textContent = '+1 🍌';
    document.body.appendChild(reward);

    // Position near center of screen
    reward.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2.5rem;
      font-weight: bold;
      color: #FFD700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      z-index: 1000;
      animation: floatUp 1.5s ease-out forwards;
      pointer-events: none;
    `;

    setTimeout(() => reward.remove(), 1500);
  }

  // Start demo animation
  startDemo() {
    this.isShowingDemo = true;
    this.stopGuidePointAnimation();

    const waypoints = this.getCurrentWaypoints();
    if (!waypoints || !waypoints.strokes) {
      this.isShowingDemo = false;
      this.startGuidePointAnimation();
      return;
    }

    // Clear and render base
    this.render();

    // Animate through all strokes
    let strokeIndex = 0;
    let pointIndex = 0;
    let lastPoint = null;

    const animateStep = () => {
      if (strokeIndex >= waypoints.strokes.length) {
        // Demo complete
        this.isShowingDemo = false;

        // Clear demo drawing and start actual tracing
        setTimeout(() => {
          this.render();
          this.startGuidePointAnimation();
        }, 500);
        return;
      }

      const stroke = waypoints.strokes[strokeIndex];
      const point = this.toPixel(stroke.points[pointIndex]);

      if (lastPoint) {
        // Draw demo line
        const colorIndex = (strokeIndex * 2 + Math.floor(pointIndex / 2)) % RAINBOW_COLORS.length;
        this.ctx.beginPath();
        this.ctx.moveTo(lastPoint.x, lastPoint.y);
        this.ctx.lineTo(point.x, point.y);
        this.ctx.strokeStyle = RAINBOW_COLORS[colorIndex];
        this.ctx.lineWidth = this.userLineWidth * 0.8;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalAlpha = 0.7;
        this.ctx.stroke();
        this.ctx.globalAlpha = 1.0;
      }

      lastPoint = point;
      pointIndex++;

      if (pointIndex >= stroke.points.length) {
        strokeIndex++;
        pointIndex = 0;
        lastPoint = null;
      }

      this.demoAnimationId = requestAnimationFrame(() => {
        setTimeout(animateStep, 80);
      });
    };

    animateStep();
  }

  // Stop demo animation
  stopDemo() {
    if (this.demoAnimationId) {
      cancelAnimationFrame(this.demoAnimationId);
      this.demoAnimationId = null;
    }
    this.isShowingDemo = false;
  }

  // Start guide point pulsing animation
  startGuidePointAnimation() {
    const animate = () => {
      this.guidePointPulse = (this.guidePointPulse + 0.05) % (Math.PI * 2);

      // Only redraw guide point, not entire canvas
      this.drawGuidePoint();

      this.guidePointAnimationId = requestAnimationFrame(animate);
    };
    animate();
  }

  // Stop guide point animation
  stopGuidePointAnimation() {
    if (this.guidePointAnimationId) {
      cancelAnimationFrame(this.guidePointAnimationId);
      this.guidePointAnimationId = null;
    }
  }

  // Draw the guide point
  drawGuidePoint() {
    const point = this.getCurrentGuidePoint();
    if (!point || this.isShowingDemo) return;

    const pulse = Math.sin(this.guidePointPulse) * 0.2 + 1;
    const radius = this.guidePointRadius * pulse;

    // Outer glow (subtle)
    const gradient = this.ctx.createRadialGradient(
      point.x, point.y, radius * 0.5,
      point.x, point.y, radius * 2
    );
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
    gradient.addColorStop(0.6, 'rgba(255, 215, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, radius * 2, 0, Math.PI * 2);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Inner circle
    this.ctx.beginPath();
    this.ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFD700';
    this.ctx.fill();
    this.ctx.strokeStyle = '#FFA500';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
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

  // Reset tracing state for new letter
  resetTracingState() {
    this.currentStrokeIndex = 0;
    this.currentWaypointIndex = 0;
    this.completedStrokes = [];
    this.drawingPaths = [];
    this.currentPath = [];
    this.totalPathLength = 0;
    this.rainbowIndex = 0;
  }

  // Navigate to next item
  next() {
    const total = this.getTotalItems();
    this.currentIndex = (this.currentIndex + 1) % total;
    this.stopDemo();
    this.stopGuidePointAnimation();
    this.resetTracingState();
    this.render();
    this.startDemo();
    this.speakCurrentLetter();
  }

  // Navigate to previous item
  prev() {
    const total = this.getTotalItems();
    this.currentIndex = (this.currentIndex - 1 + total) % total;
    this.stopDemo();
    this.stopGuidePointAnimation();
    this.resetTracingState();
    this.render();
    this.startDemo();
    this.speakCurrentLetter();
  }

  // Navigate to specific index
  goToIndex(index) {
    const total = this.getTotalItems();
    if (index >= 0 && index < total) {
      this.currentIndex = index;
      this.stopDemo();
      this.stopGuidePointAnimation();
      this.resetTracingState();
      this.render();
      this.startDemo();
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
    this.resetTracingState();
    this.render();
    this.startDemo();
  }

  // Replay demo animation
  replayDemo() {
    this.stopDemo();
    this.stopGuidePointAnimation();
    this.resetTracingState();
    this.render();
    this.startDemo();
  }

  // Speak the current letter using Web Speech API
  speakCurrentLetter() {
    const char = this.getCurrentChar().toLowerCase();
    audio.speak(char, this.language);
  }

  // Set language
  setLanguage(lang) {
    this.language = lang;
    this.currentIndex = 0;
    this.stopDemo();
    this.stopGuidePointAnimation();
    this.resetTracingState();
    this.render();
    this.startDemo();
  }

  // Main render function
  render() {
    if (!this.ctx) return;

    // Clear canvas
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Get current character
    const char = this.getCurrentChar();

    // Calculate font size (large to match waypoints)
    const fontSize = this.height * 0.9;

    // Draw letter as guide (light gray)
    this.ctx.font = `bold ${fontSize}px ${this.letterFont}`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillStyle = this.letterColor;
    this.ctx.fillText(char, this.width / 2, this.height / 2);

    // Update UI elements
    this.updateUI();
  }

  // Redraw user's strokes
  redrawUserStrokes() {
    this.drawingPaths.forEach(path => {
      if (path.length < 2) return;

      for (let i = 1; i < path.length; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(path[i - 1].x, path[i - 1].y);
        this.ctx.lineTo(path[i].x, path[i].y);
        this.ctx.strokeStyle = path[i].color;
        this.ctx.lineWidth = this.userLineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
      }
    });

    // Draw current path being drawn
    if (this.currentPath.length > 1) {
      for (let i = 1; i < this.currentPath.length; i++) {
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentPath[i - 1].x, this.currentPath[i - 1].y);
        this.ctx.lineTo(this.currentPath[i].x, this.currentPath[i].y);
        this.ctx.strokeStyle = this.currentPath[i].color;
        this.ctx.lineWidth = this.userLineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.stroke();
      }
    }
  }

  // Update UI elements
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

    // Update counting display
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

  // Clear method (alias)
  clear() {
    this.clearDrawing();
  }

  // Speak current (alias)
  speakCurrent() {
    this.speakCurrentLetter();
  }

  // Cleanup
  destroy() {
    this.stopDemo();
    this.stopGuidePointAnimation();
  }
}

// Export two separate instances for letters and numbers
export const letterTracing = new TracingModule();
export const numberTracing = new TracingModule();
export default letterTracing;
