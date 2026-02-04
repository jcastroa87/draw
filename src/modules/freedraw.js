// Free Draw Module for Gorila Studio
// Handles free drawing canvas with color selection, brush sizes, and eraser

import { audio } from './audio.js';

// Rainbow colors for rainbow brush mode
const RAINBOW_COLORS = [
  '#FF6B6B', // Red
  '#FF8E53', // Orange
  '#FFD93D', // Yellow
  '#6BCB77', // Green
  '#4D96FF', // Blue
  '#9B59B6', // Purple
  '#FF6B9D'  // Pink
];

// Background definitions
const BACKGROUNDS = {
  // Blank (default)
  blank: {
    name: 'Blanco',
    icon: '⬜',
    draw: null
  },

  // Nature backgrounds
  beach: {
    name: 'Playa',
    icon: '🏖️',
    draw: (ctx, w, h) => {
      // Sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
      skyGrad.addColorStop(0, '#87CEEB');
      skyGrad.addColorStop(1, '#E0F6FF');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.6);

      // Sun
      ctx.fillStyle = '#FFD93D';
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.15, 40, 0, Math.PI * 2);
      ctx.fill();

      // Sea
      const seaGrad = ctx.createLinearGradient(0, h * 0.5, 0, h * 0.7);
      seaGrad.addColorStop(0, '#4D96FF');
      seaGrad.addColorStop(1, '#1E90FF');
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, h * 0.5, w, h * 0.2);

      // Sand
      ctx.fillStyle = '#F4D03F';
      ctx.fillRect(0, h * 0.7, w, h * 0.3);
    }
  },

  forest: {
    name: 'Bosque',
    icon: '🌲',
    draw: (ctx, w, h) => {
      // Sky
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, w, h * 0.6);

      // Grass
      ctx.fillStyle = '#6BCB77';
      ctx.fillRect(0, h * 0.6, w, h * 0.4);

      // Trees (simple triangles)
      ctx.fillStyle = '#2E7D32';
      for (let i = 0; i < 5; i++) {
        const x = w * (0.1 + i * 0.2);
        const treeH = h * (0.3 + Math.random() * 0.15);
        ctx.beginPath();
        ctx.moveTo(x, h * 0.6);
        ctx.lineTo(x - 30, h * 0.6);
        ctx.lineTo(x - 15, h * 0.6 - treeH);
        ctx.closePath();
        ctx.fill();
      }

      // Tree trunks
      ctx.fillStyle = '#8B4513';
      for (let i = 0; i < 5; i++) {
        const x = w * (0.1 + i * 0.2) - 18;
        ctx.fillRect(x, h * 0.6, 8, 20);
      }
    }
  },

  sky: {
    name: 'Cielo',
    icon: '☁️',
    draw: (ctx, w, h) => {
      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#4D96FF');
      grad.addColorStop(1, '#87CEEB');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sun
      ctx.fillStyle = '#FFD93D';
      ctx.beginPath();
      ctx.arc(w * 0.75, h * 0.2, 50, 0, Math.PI * 2);
      ctx.fill();

      // Clouds
      ctx.fillStyle = '#fff';
      const drawCloud = (x, y, scale) => {
        ctx.beginPath();
        ctx.arc(x, y, 25 * scale, 0, Math.PI * 2);
        ctx.arc(x + 25 * scale, y - 10 * scale, 20 * scale, 0, Math.PI * 2);
        ctx.arc(x + 50 * scale, y, 25 * scale, 0, Math.PI * 2);
        ctx.arc(x + 25 * scale, y + 5 * scale, 20 * scale, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCloud(w * 0.15, h * 0.25, 1);
      drawCloud(w * 0.5, h * 0.15, 0.8);
      drawCloud(w * 0.3, h * 0.45, 1.2);
    }
  },

  underwater: {
    name: 'Bajo el Mar',
    icon: '🐠',
    draw: (ctx, w, h) => {
      // Water gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1E90FF');
      grad.addColorStop(1, '#0D47A1');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = 5 + Math.random() * 15;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Seaweed
      ctx.strokeStyle = '#2E7D32';
      ctx.lineWidth = 4;
      for (let i = 0; i < 6; i++) {
        const x = w * (0.1 + i * 0.15);
        ctx.beginPath();
        ctx.moveTo(x, h);
        for (let j = 0; j < 5; j++) {
          const yPos = h - j * 30;
          const xOffset = Math.sin(j) * 15;
          ctx.lineTo(x + xOffset, yPos);
        }
        ctx.stroke();
      }

      // Sandy bottom
      ctx.fillStyle = '#F4D03F';
      ctx.beginPath();
      ctx.moveTo(0, h);
      ctx.lineTo(0, h * 0.9);
      for (let x = 0; x <= w; x += 20) {
        ctx.lineTo(x, h * 0.9 + Math.sin(x * 0.1) * 10);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    }
  },

  // Thematic backgrounds
  space: {
    name: 'Espacio',
    icon: '🚀',
    draw: (ctx, w, h) => {
      // Dark space
      ctx.fillStyle = '#0a0a2e';
      ctx.fillRect(0, 0, w, h);

      // Stars
      ctx.fillStyle = '#fff';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const r = Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Planet
      const grad = ctx.createRadialGradient(w * 0.75, h * 0.3, 0, w * 0.75, h * 0.3, 45);
      grad.addColorStop(0, '#FF6B6B');
      grad.addColorStop(1, '#C0392B');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(w * 0.75, h * 0.3, 45, 0, Math.PI * 2);
      ctx.fill();

      // Moon
      ctx.fillStyle = '#ECF0F1';
      ctx.beginPath();
      ctx.arc(w * 0.2, h * 0.7, 30, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  city: {
    name: 'Ciudad',
    icon: '🏙️',
    draw: (ctx, w, h) => {
      // Sky gradient (dusk)
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1a1a2e');
      grad.addColorStop(0.5, '#16213e');
      grad.addColorStop(1, '#e94560');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Building silhouettes
      ctx.fillStyle = '#0f0f23';
      const buildings = [
        { x: 0, h: 0.4 },
        { x: 0.1, h: 0.55 },
        { x: 0.2, h: 0.35 },
        { x: 0.3, h: 0.6 },
        { x: 0.4, h: 0.45 },
        { x: 0.5, h: 0.7 },
        { x: 0.6, h: 0.5 },
        { x: 0.7, h: 0.4 },
        { x: 0.8, h: 0.55 },
        { x: 0.9, h: 0.35 }
      ];
      buildings.forEach(b => {
        ctx.fillRect(b.x * w, h * (1 - b.h), w * 0.12, h * b.h);
      });

      // Windows
      ctx.fillStyle = '#FFD93D';
      buildings.forEach(b => {
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 2; col++) {
            if (Math.random() > 0.3) {
              ctx.fillRect(
                b.x * w + 5 + col * 15,
                h * (1 - b.h) + 15 + row * 25,
                8, 12
              );
            }
          }
        }
      });
    }
  },

  farm: {
    name: 'Granja',
    icon: '🏡',
    draw: (ctx, w, h) => {
      // Sky
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, w, h * 0.5);

      // Grass
      ctx.fillStyle = '#6BCB77';
      ctx.fillRect(0, h * 0.5, w, h * 0.5);

      // Barn
      ctx.fillStyle = '#C0392B';
      ctx.fillRect(w * 0.6, h * 0.25, w * 0.25, h * 0.35);
      // Roof
      ctx.beginPath();
      ctx.moveTo(w * 0.55, h * 0.25);
      ctx.lineTo(w * 0.725, h * 0.1);
      ctx.lineTo(w * 0.9, h * 0.25);
      ctx.closePath();
      ctx.fill();
      // Door
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(w * 0.68, h * 0.4, w * 0.09, h * 0.2);

      // Fence
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.6);
      ctx.lineTo(w * 0.5, h * 0.6);
      ctx.stroke();
      // Fence posts
      for (let i = 0; i < 6; i++) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(i * w * 0.1, h * 0.55, 6, h * 0.1);
      }

      // Sun
      ctx.fillStyle = '#FFD93D';
      ctx.beginPath();
      ctx.arc(w * 0.15, h * 0.15, 35, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  castle: {
    name: 'Castillo',
    icon: '🏰',
    draw: (ctx, w, h) => {
      // Sky
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
      grad.addColorStop(0, '#9B59B6');
      grad.addColorStop(1, '#E8D5E8');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h * 0.6);

      // Ground
      ctx.fillStyle = '#6BCB77';
      ctx.fillRect(0, h * 0.6, w, h * 0.4);

      // Castle base
      ctx.fillStyle = '#95A5A6';
      ctx.fillRect(w * 0.25, h * 0.3, w * 0.5, h * 0.35);

      // Towers
      ctx.fillRect(w * 0.2, h * 0.15, w * 0.12, h * 0.5);
      ctx.fillRect(w * 0.68, h * 0.15, w * 0.12, h * 0.5);

      // Tower tops (triangles)
      ctx.fillStyle = '#C0392B';
      ctx.beginPath();
      ctx.moveTo(w * 0.2, h * 0.15);
      ctx.lineTo(w * 0.26, h * 0.05);
      ctx.lineTo(w * 0.32, h * 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(w * 0.68, h * 0.15);
      ctx.lineTo(w * 0.74, h * 0.05);
      ctx.lineTo(w * 0.8, h * 0.15);
      ctx.closePath();
      ctx.fill();

      // Door
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.5, w * 0.06, Math.PI, 0);
      ctx.fillRect(w * 0.44, h * 0.5, w * 0.12, h * 0.15);
      ctx.fill();

      // Flag
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(w * 0.26, h * 0.05);
      ctx.lineTo(w * 0.26, h * -0.02);
      ctx.stroke();
      ctx.fillStyle = '#E74C3C';
      ctx.beginPath();
      ctx.moveTo(w * 0.26, h * -0.02);
      ctx.lineTo(w * 0.35, h * 0.02);
      ctx.lineTo(w * 0.26, h * 0.06);
      ctx.closePath();
      ctx.fill();
    }
  },

  // Simple gradients
  rainbow: {
    name: 'Arcoíris',
    icon: '🌈',
    draw: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#FF6B6B');
      grad.addColorStop(0.17, '#FF8E53');
      grad.addColorStop(0.33, '#FFD93D');
      grad.addColorStop(0.5, '#6BCB77');
      grad.addColorStop(0.67, '#4D96FF');
      grad.addColorStop(0.83, '#9B59B6');
      grad.addColorStop(1, '#FF6B9D');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
  },

  sunset: {
    name: 'Atardecer',
    icon: '🌅',
    draw: (ctx, w, h) => {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1a1a2e');
      grad.addColorStop(0.3, '#e94560');
      grad.addColorStop(0.5, '#ff9a3c');
      grad.addColorStop(0.7, '#ffcd69');
      grad.addColorStop(1, '#f8edeb');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Sun
      ctx.fillStyle = '#FFD93D';
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.55, 50, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // Frames
  flowerFrame: {
    name: 'Marco Flores',
    icon: '🌸',
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);

      const drawFlower = (x, y, size) => {
        const colors = ['#FF6B9D', '#FF6B6B', '#FFD93D', '#9B59B6'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillStyle = color;
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5;
          ctx.beginPath();
          ctx.arc(
            x + Math.cos(angle) * size * 0.5,
            y + Math.sin(angle) * size * 0.5,
            size * 0.4, 0, Math.PI * 2
          );
          ctx.fill();
        }
        ctx.fillStyle = '#FFD93D';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      };

      // Top and bottom borders
      for (let x = 20; x < w; x += 45) {
        drawFlower(x, 25, 20);
        drawFlower(x, h - 25, 20);
      }
      // Left and right borders
      for (let y = 60; y < h - 40; y += 45) {
        drawFlower(25, y, 20);
        drawFlower(w - 25, y, 20);
      }
    }
  },

  starFrame: {
    name: 'Marco Estrellas',
    icon: '⭐',
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#E8F4FD';
      ctx.fillRect(0, 0, w, h);

      const drawStar = (x, y, size) => {
        const colors = ['#FFD93D', '#FF8E53', '#4D96FF'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
          const innerAngle = angle + Math.PI / 5;
          if (i === 0) {
            ctx.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
          } else {
            ctx.lineTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
          }
          ctx.lineTo(x + Math.cos(innerAngle) * size * 0.4, y + Math.sin(innerAngle) * size * 0.4);
        }
        ctx.closePath();
        ctx.fill();
      };

      // Border stars
      for (let x = 25; x < w; x += 50) {
        drawStar(x, 25, 18);
        drawStar(x, h - 25, 18);
      }
      for (let y = 70; y < h - 40; y += 50) {
        drawStar(25, y, 18);
        drawStar(w - 25, y, 18);
      }
    }
  }
};

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

    // Rainbow brush mode
    this.isRainbow = false;
    this.rainbowPathLength = 0;

    // Sticker mode
    this.stickerMode = false;
    this.currentSticker = null;
    this.stickerSize = 70; // Medium default
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

    const { x, y } = this.getCoords(e);

    // Sticker mode - place sticker
    if (this.stickerMode && this.currentSticker) {
      this.placeSticker(x, y);
      audio.playPop();
      this.saveState();
      return;
    }

    this.isDrawing = true;
    this.lastX = x;
    this.lastY = y;
    this.rainbowPathLength = 0; // Reset rainbow path

    // Determine fill color
    let fillColor;
    if (this.isEraser) {
      fillColor = '#fff';
    } else if (this.isRainbow) {
      fillColor = RAINBOW_COLORS[0];
    } else {
      fillColor = this.currentColor;
    }

    // Draw a dot at start point
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();

    audio.playTap();
  }

  // Handle move
  handleMove(e) {
    if (!this.isDrawing) return;
    e.preventDefault();

    const { x, y } = this.getCoords(e);

    // Calculate distance for rainbow effect
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.rainbowPathLength += distance;

    // Determine stroke color
    let strokeColor;
    if (this.isEraser) {
      strokeColor = '#fff';
    } else if (this.isRainbow) {
      const colorIndex = Math.floor(this.rainbowPathLength / 30) % RAINBOW_COLORS.length;
      strokeColor = RAINBOW_COLORS[colorIndex];
    } else {
      strokeColor = this.currentColor;
    }

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = strokeColor;
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

  // Toggle rainbow mode
  toggleRainbow(enabled) {
    this.isRainbow = enabled;
    if (enabled) {
      this.isEraser = false;
      this.stickerMode = false;
    }
  }

  // Set sticker mode
  setStickerMode(enabled) {
    this.stickerMode = enabled;
    if (enabled) {
      this.isEraser = false;
      this.isRainbow = false;
    }
  }

  // Set current sticker
  setSticker(emoji) {
    this.currentSticker = emoji;
    this.stickerMode = true;
    this.isEraser = false;
    this.isRainbow = false;
  }

  // Set sticker size
  setStickerSize(size) {
    this.stickerSize = size;
  }

  // Place sticker on canvas
  placeSticker(x, y) {
    if (!this.currentSticker) return;

    this.ctx.font = `${this.stickerSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.currentSticker, x, y);
  }

  // Load a background by ID or draw function
  loadBackground(bgIdOrFn) {
    // Clear canvas
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (typeof bgIdOrFn === 'string') {
      // Load by background ID
      const bg = BACKGROUNDS[bgIdOrFn];
      if (bg && bg.draw) {
        bg.draw(this.ctx, this.width, this.height);
      }
    } else if (typeof bgIdOrFn === 'function') {
      // Load by draw function
      bgIdOrFn(this.ctx, this.width, this.height);
    }

    this.history = [];
    this.saveState();
    audio.playWhoosh();
  }

  // Get available backgrounds
  getBackgrounds() {
    return Object.entries(BACKGROUNDS).map(([id, bg]) => ({
      id,
      name: bg.name,
      icon: bg.icon
    }));
  }
}

export const freeDrawModule = new FreeDrawModule();
