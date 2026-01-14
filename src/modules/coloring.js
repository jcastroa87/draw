// Coloring Module for Gorila Studio
// Handles coloring book functionality with fill and brush tools

import { audio } from './audio.js';

class ColoringModule {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.currentColor = '#FF6B6B';
    this.currentTool = 'fill'; // 'fill' or 'brush'
    this.brushSize = 15;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;
    this.history = [];
    this.maxHistory = 20;
    this.templates = [];
    this.currentTemplateIndex = 0;
  }

  // Initialize the coloring module
  init(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    
    this.loadTemplates();
    this.setupCanvas();
    this.setupEvents();
    this.loadTemplate(0);
  }

  // Setup canvas
  setupCanvas() {
    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();
    const size = Math.min(rect.width - 20, rect.height - 20, 500);
    
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = size * dpr;
    this.canvas.height = size * dpr;
    
    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
    
    this.width = size;
    this.height = size;
  }

  // Load template definitions
  loadTemplates() {
    this.templates = [
      {
        name: 'Gorila',
        nameRu: 'Горилла',
        draw: (ctx, w, h) => this.drawGorilla(ctx, w, h)
      },
      {
        name: 'Sol',
        nameRu: 'Солнце',
        draw: (ctx, w, h) => this.drawSun(ctx, w, h)
      },
      {
        name: 'Banana',
        nameRu: 'Банан',
        draw: (ctx, w, h) => this.drawBanana(ctx, w, h)
      },
      {
        name: 'Árbol',
        nameRu: 'Дерево',
        draw: (ctx, w, h) => this.drawTree(ctx, w, h)
      },
      {
        name: 'Estrella',
        nameRu: 'Звезда',
        draw: (ctx, w, h) => this.drawStar(ctx, w, h)
      },
      {
        name: 'Corazón',
        nameRu: 'Сердце',
        draw: (ctx, w, h) => this.drawHeart(ctx, w, h)
      }
    ];
  }

  // Draw a cute gorilla template
  drawGorilla(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';
    
    // Body (oval)
    ctx.beginPath();
    ctx.ellipse(cx, cy + 80, 100, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Head (circle)
    ctx.beginPath();
    ctx.arc(cx, cy - 50, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Face area
    ctx.beginPath();
    ctx.ellipse(cx, cy - 20, 50, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Left ear
    ctx.beginPath();
    ctx.arc(cx - 85, cy - 50, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Right ear
    ctx.beginPath();
    ctx.arc(cx + 85, cy - 50, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Left eye
    ctx.beginPath();
    ctx.arc(cx - 30, cy - 55, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Right eye
    ctx.beginPath();
    ctx.arc(cx + 30, cy - 55, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Eye pupils (black)
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 30, cy - 55, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 30, cy - 55, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#fff';
    
    // Nose
    ctx.beginPath();
    ctx.ellipse(cx, cy - 15, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Nostrils
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(cx - 8, cy - 12, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 8, cy - 12, 5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.beginPath();
    ctx.arc(cx, cy - 5, 15, 0.2, Math.PI - 0.2);
    ctx.stroke();
    
    ctx.fillStyle = '#fff';
    
    // Left arm
    ctx.beginPath();
    ctx.ellipse(cx - 110, cy + 80, 30, 60, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Right arm
    ctx.beginPath();
    ctx.ellipse(cx + 110, cy + 80, 30, 60, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Left leg
    ctx.beginPath();
    ctx.ellipse(cx - 50, cy + 160, 35, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Right leg
    ctx.beginPath();
    ctx.ellipse(cx + 50, cy + 160, 35, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Draw a sun template
  drawSun(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';
    
    // Sun rays
    const rayCount = 12;
    for (let i = 0; i < rayCount; i++) {
      const angle = (i / rayCount) * Math.PI * 2;
      const innerR = 100;
      const outerR = 180;
      
      ctx.beginPath();
      ctx.moveTo(cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle));
      ctx.lineTo(cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle));
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    
    ctx.lineWidth = 3;
    
    // Main circle
    ctx.beginPath();
    ctx.arc(cx, cy, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Left eye
    ctx.beginPath();
    ctx.arc(cx - 35, cy - 15, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Right eye
    ctx.beginPath();
    ctx.arc(cx + 35, cy - 15, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Pupils
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 35, cy - 15, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 35, cy - 15, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.beginPath();
    ctx.arc(cx, cy + 10, 40, 0.3, Math.PI - 0.3);
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // Draw a banana template
  drawBanana(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';
    
    // Banana body
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy - 100);
    ctx.quadraticCurveTo(cx + 150, cy - 50, cx + 100, cy + 120);
    ctx.quadraticCurveTo(cx + 50, cy + 160, cx - 20, cy + 100);
    ctx.quadraticCurveTo(cx - 150, cy, cx - 80, cy - 100);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Stem
    ctx.beginPath();
    ctx.moveTo(cx - 75, cy - 95);
    ctx.lineTo(cx - 60, cy - 130);
    ctx.lineTo(cx - 45, cy - 125);
    ctx.lineTo(cx - 55, cy - 90);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // End tip
    ctx.beginPath();
    ctx.ellipse(cx + 95, cy + 115, 15, 10, 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Draw a tree template
  drawTree(ctx, w, h) {
    const cx = w / 2;
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';
    
    // Trunk
    ctx.beginPath();
    ctx.rect(cx - 30, h * 0.5, 60, h * 0.4);
    ctx.fill();
    ctx.stroke();
    
    // Foliage (three circles)
    ctx.beginPath();
    ctx.arc(cx, h * 0.35, 90, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(cx - 70, h * 0.45, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(cx + 70, h * 0.45, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Draw a star template
  drawStar(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const outerR = 150;
    const innerR = 60;
    const points = 5;
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';
    
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
      
      if (i === 0) {
        ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      } else {
        ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Cute face
    ctx.beginPath();
    ctx.arc(cx - 25, cy - 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(cx + 25, cy - 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 25, cy - 10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 25, cy - 10, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(cx, cy + 20, 20, 0.2, Math.PI - 0.2);
    ctx.stroke();
  }

  // Draw a heart template
  drawHeart(ctx, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';
    
    ctx.beginPath();
    ctx.moveTo(cx, cy + 80);
    
    // Left side
    ctx.bezierCurveTo(
      cx - 150, cy - 30,
      cx - 100, cy - 120,
      cx, cy - 50
    );
    
    // Right side
    ctx.bezierCurveTo(
      cx + 100, cy - 120,
      cx + 150, cy - 30,
      cx, cy + 80
    );
    
    ctx.fill();
    ctx.stroke();
  }

  // Load a template
  loadTemplate(index) {
    this.currentTemplateIndex = index;
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    const template = this.templates[index];
    template.draw(this.ctx, this.width, this.height);
    
    this.saveState();
  }

  // Setup events
  setupEvents() {
    this.canvas.addEventListener('touchstart', (e) => this.handleStart(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.handleMove(e), { passive: false });
    this.canvas.addEventListener('touchend', () => this.handleEnd());
    
    this.canvas.addEventListener('mousedown', (e) => this.handleStart(e));
    this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
    this.canvas.addEventListener('mouseup', () => this.handleEnd());
  }

  // Get coordinates
  getCoords(e) {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    let x, y;
    
    if (e.touches && e.touches.length > 0) {
      x = (e.touches[0].clientX - rect.left);
      y = (e.touches[0].clientY - rect.top);
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    return { x: x * dpr, y: y * dpr };
  }

  // Handle start
  handleStart(e) {
    e.preventDefault();
    const { x, y } = this.getCoords(e);
    
    if (this.currentTool === 'fill') {
      this.floodFill(Math.floor(x), Math.floor(y), this.currentColor);
      audio.playPop();
      this.saveState();
    } else {
      this.isDrawing = true;
      this.lastX = x;
      this.lastY = y;
    }
  }

  // Handle move
  handleMove(e) {
    if (!this.isDrawing || this.currentTool !== 'brush') return;
    e.preventDefault();
    
    const { x, y } = this.getCoords(e);
    const dpr = window.devicePixelRatio || 1;
    
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = this.currentColor;
    this.ctx.lineWidth = this.brushSize * dpr;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.stroke();
    
    this.ctx.restore();
    
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

  // Flood fill algorithm
  floodFill(startX, startY, fillColor) {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Get target color at start position
    const startIdx = (startY * width + startX) * 4;
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];
    
    // Parse fill color
    const fillRGB = this.hexToRgb(fillColor);
    if (!fillRGB) return;
    
    // Don't fill if same color
    if (targetR === fillRGB.r && targetG === fillRGB.g && targetB === fillRGB.b) return;
    
    // Don't fill if clicking on an outline (dark color)
    if (targetR < 100 && targetG < 100 && targetB < 100) return;
    
    const stack = [[startX, startY]];
    const visited = new Set();
    const tolerance = 30;
    
    const matchesTarget = (idx) => {
      return Math.abs(data[idx] - targetR) <= tolerance &&
             Math.abs(data[idx + 1] - targetG) <= tolerance &&
             Math.abs(data[idx + 2] - targetB) <= tolerance;
    };
    
    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const key = `${x},${y}`;
      
      if (visited.has(key)) continue;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      
      const idx = (y * width + x) * 4;
      
      if (!matchesTarget(idx)) continue;
      
      visited.add(key);
      
      // Fill this pixel
      data[idx] = fillRGB.r;
      data[idx + 1] = fillRGB.g;
      data[idx + 2] = fillRGB.b;
      data[idx + 3] = 255;
      
      // Add neighbors
      stack.push([x + 1, y]);
      stack.push([x - 1, y]);
      stack.push([x, y + 1]);
      stack.push([x, y - 1]);
      
      // Limit iterations for performance
      if (visited.size > 100000) break;
    }
    
    this.ctx.putImageData(imageData, 0, 0);
  }

  // Convert hex to RGB
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  // Save state for undo
  saveState() {
    if (this.history.length >= this.maxHistory) {
      this.history.shift();
    }
    this.history.push(this.canvas.toDataURL());
  }

  // Undo last action
  undo() {
    if (this.history.length > 1) {
      this.history.pop();
      const img = new Image();
      img.onload = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0);
      };
      img.src = this.history[this.history.length - 1];
      audio.playPop();
    }
  }

  // Clear canvas and reload template
  clear() {
    this.history = [];
    this.loadTemplate(this.currentTemplateIndex);
    audio.playWhoosh();
  }

  // Set color
  setColor(color) {
    this.currentColor = color;
  }

  // Set tool
  setTool(tool) {
    this.currentTool = tool;
  }

  // Next template
  nextTemplate() {
    this.currentTemplateIndex = (this.currentTemplateIndex + 1) % this.templates.length;
    this.clear();
    return this.templates[this.currentTemplateIndex];
  }

  // Previous template
  prevTemplate() {
    this.currentTemplateIndex = (this.currentTemplateIndex - 1 + this.templates.length) % this.templates.length;
    this.clear();
    return this.templates[this.currentTemplateIndex];
  }

  // Get current template
  getCurrentTemplate() {
    return this.templates[this.currentTemplateIndex];
  }
}

export const coloringModule = new ColoringModule();
