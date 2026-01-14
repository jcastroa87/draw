// Free Draw Module for Gorila Studio
// Handles free drawing canvas with color selection, brush sizes, and eraser

import { audio } from './audio.js';

class FreeDrawModule {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.currentColor = '#FF6B6B';
    this.brushSize = 15;
    this.isDrawing = false;
    this.isEraser = false;
    this.lastX = 0;
    this.lastY = 0;
    this.history = [];
    this.maxHistory = 30;
  }

  // Initialize the module
  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    
    this.setupCanvas();
    this.setupEvents();
    this.clear();
  }

  // Setup canvas for high DPI
  setupCanvas() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const width = rect.width - 30;
    const height = rect.height - 120; // Account for tools
    
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    
    this.width = width;
    this.height = height;
    this.dpr = dpr;
  }

  // Setup events
  setupEvents() {
    this.canvas.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
    this.canvas.addEventListener('touchend', () => this.handleEnd());
    this.canvas.addEventListener('touchcancel', () => this.handleEnd());
    
    this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
    this.canvas.addEventListener('mouseup', () => this.handleEnd());
    this.canvas.addEventListener('mouseleave', () => this.handleEnd());
  }

  // Get coordinates
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

  // Handle start
  handleStart(e) {
    e.preventDefault();
    this.isDrawing = true;
    
    const { x, y } = this.getCoords(e);
    this.lastX = x;
    this.lastY = y;
    
    // Draw a dot at start point
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = this.isEraser ? '#fff' : this.currentColor;
    this.ctx.fill();
    
    audio.playTap();
  }

  // Handle move
  handleMove(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    
    const { x, y } = this.getCoords(e);
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = this.isEraser ? '#fff' : this.currentColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
    
    this.lastX = x;
    this.lastY = y;
  }

  // Handle end
  handleEnd() {
    if (this.isDrawing) {
      this.isDrawing = false;
      this.saveState();
    }
  }

  // Save state
  saveState() {
    if (this.history.length >= this.maxHistory) {
      this.history.shift();
    }
    this.history.push(this.canvas.toDataURL());
  }

  // Undo
  undo() {
    if (this.history.length > 1) {
      this.history.pop();
      const img = new Image();
      img.onload = () => {
        this.ctx.save();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0);
        this.ctx.restore();
      };
      img.src = this.history[this.history.length - 1];
      audio.playPop();
    }
  }

  // Clear canvas
  clear() {
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.history = [];
    this.saveState();
    audio.playWhoosh();
  }

  // Set color
  setColor(color) {
    this.currentColor = color;
    this.isEraser = false;
  }

  // Set brush size
  setBrushSize(size) {
    this.brushSize = size;
  }

  // Toggle eraser
  toggleEraser(enabled) {
    this.isEraser = enabled;
  }

  // Save drawing
  save() {
    const link = document.createElement('a');
    link.download = 'mi-dibujo.png';
    link.href = this.canvas.toDataURL('image/png');
    link.click();
    audio.playSuccess();
  }
}

export const freeDrawModule = new FreeDrawModule();
