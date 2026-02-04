// Coloring Module for Gorila Studio
// Handles coloring book functionality with fill and brush tools

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

    // Rainbow brush mode
    this.isRainbow = false;
    this.rainbowPathLength = 0;

    // Sticker mode
    this.stickerMode = false;
    this.currentSticker = null;
    this.stickerSize = 70; // Medium default
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
      // Original templates
      { name: 'Gorila', nameRu: 'Горилла', draw: (ctx, w, h) => this.drawGorilla(ctx, w, h) },
      { name: 'Sol', nameRu: 'Солнце', draw: (ctx, w, h) => this.drawSun(ctx, w, h) },
      { name: 'Banana', nameRu: 'Банан', draw: (ctx, w, h) => this.drawBanana(ctx, w, h) },
      { name: 'Árbol', nameRu: 'Дерево', draw: (ctx, w, h) => this.drawTree(ctx, w, h) },
      { name: 'Estrella', nameRu: 'Звезда', draw: (ctx, w, h) => this.drawStar(ctx, w, h) },
      { name: 'Corazón', nameRu: 'Сердце', draw: (ctx, w, h) => this.drawHeart(ctx, w, h) },

      // Animals
      { name: 'Gato', nameRu: 'Кошка', draw: (ctx, w, h) => this.drawCat(ctx, w, h) },
      { name: 'Perro', nameRu: 'Собака', draw: (ctx, w, h) => this.drawDog(ctx, w, h) },
      { name: 'Pez', nameRu: 'Рыба', draw: (ctx, w, h) => this.drawFish(ctx, w, h) },
      { name: 'Mariposa', nameRu: 'Бабочка', draw: (ctx, w, h) => this.drawButterfly(ctx, w, h) },
      { name: 'Elefante', nameRu: 'Слон', draw: (ctx, w, h) => this.drawElephant(ctx, w, h) },
      { name: 'León', nameRu: 'Лев', draw: (ctx, w, h) => this.drawLion(ctx, w, h) },
      { name: 'Tiburón', nameRu: 'Акула', draw: (ctx, w, h) => this.drawShark(ctx, w, h) },

      // Vehicles
      { name: 'Carro', nameRu: 'Машина', draw: (ctx, w, h) => this.drawCar(ctx, w, h) },
      { name: 'Avión', nameRu: 'Самолёт', draw: (ctx, w, h) => this.drawPlane(ctx, w, h) },
      { name: 'Barco', nameRu: 'Корабль', draw: (ctx, w, h) => this.drawBoat(ctx, w, h) },
      { name: 'Tren', nameRu: 'Поезд', draw: (ctx, w, h) => this.drawTrain(ctx, w, h) },
      { name: 'Cohete', nameRu: 'Ракета', draw: (ctx, w, h) => this.drawRocket(ctx, w, h) },

      // Fruits
      { name: 'Manzana', nameRu: 'Яблоко', draw: (ctx, w, h) => this.drawApple(ctx, w, h) },
      { name: 'Naranja', nameRu: 'Апельсин', draw: (ctx, w, h) => this.drawOrange(ctx, w, h) },
      { name: 'Sandía', nameRu: 'Арбуз', draw: (ctx, w, h) => this.drawWatermelon(ctx, w, h) },

      // Characters
      { name: 'Niño', nameRu: 'Мальчик', draw: (ctx, w, h) => this.drawBoy(ctx, w, h) },
      { name: 'Niña', nameRu: 'Девочка', draw: (ctx, w, h) => this.drawGirl(ctx, w, h) },
      { name: 'Robot', nameRu: 'Робот', draw: (ctx, w, h) => this.drawRobot(ctx, w, h) },
      { name: 'Monstruo', nameRu: 'Монстр', draw: (ctx, w, h) => this.drawMonster(ctx, w, h) }
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

  // === ANIMALS ===

  drawCat(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Body
    ctx.beginPath();
    ctx.ellipse(cx, cy + 60, 80, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - 40, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Left ear
    ctx.beginPath();
    ctx.moveTo(cx - 55, cy - 85);
    ctx.lineTo(cx - 35, cy - 130);
    ctx.lineTo(cx - 15, cy - 85);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right ear
    ctx.beginPath();
    ctx.moveTo(cx + 55, cy - 85);
    ctx.lineTo(cx + 35, cy - 130);
    ctx.lineTo(cx + 15, cy - 85);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.beginPath();
    ctx.ellipse(cx - 25, cy - 45, 12, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx + 25, cy - 45, 12, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pupils
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(cx - 25, cy - 45, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 25, cy - 45, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx - 8, cy - 10);
    ctx.lineTo(cx + 8, cy - 10);
    ctx.closePath();
    ctx.fill();

    // Whiskers
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 15);
    ctx.lineTo(cx - 60, cy - 25);
    ctx.moveTo(cx - 20, cy - 10);
    ctx.lineTo(cx - 60, cy - 10);
    ctx.moveTo(cx + 20, cy - 15);
    ctx.lineTo(cx + 60, cy - 25);
    ctx.moveTo(cx + 20, cy - 10);
    ctx.lineTo(cx + 60, cy - 10);
    ctx.stroke();

    // Tail
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx + 70, cy + 80);
    ctx.quadraticCurveTo(cx + 140, cy + 40, cx + 120, cy - 20);
    ctx.quadraticCurveTo(cx + 100, cy + 30, cx + 80, cy + 70);
    ctx.fill();
    ctx.stroke();
  }

  drawDog(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Body
    ctx.beginPath();
    ctx.ellipse(cx, cy + 70, 90, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 75, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Snout
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, 35, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Left ear (floppy)
    ctx.beginPath();
    ctx.ellipse(cx - 70, cy - 20, 25, 50, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right ear
    ctx.beginPath();
    ctx.ellipse(cx + 70, cy - 20, 25, 50, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.beginPath();
    ctx.arc(cx - 25, cy - 40, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 25, cy - 40, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pupils
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 25, cy - 40, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 25, cy - 40, 5, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.ellipse(cx, cy + 5, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tongue
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 30, 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(cx + 80, cy + 90);
    ctx.quadraticCurveTo(cx + 130, cy + 50, cx + 110, cy + 20);
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.lineWidth = 3;
  }

  drawFish(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Body
    ctx.beginPath();
    ctx.ellipse(cx, cy, 120, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(cx + 100, cy);
    ctx.lineTo(cx + 170, cy - 60);
    ctx.lineTo(cx + 170, cy + 60);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Top fin
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 65);
    ctx.lineTo(cx, cy - 120);
    ctx.lineTo(cx + 40, cy - 65);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bottom fin
    ctx.beginPath();
    ctx.moveTo(cx, cy + 65);
    ctx.lineTo(cx + 20, cy + 100);
    ctx.lineTo(cx + 50, cy + 65);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Eye
    ctx.beginPath();
    ctx.arc(cx - 50, cy - 10, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 50, cy - 10, 7, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - 110, cy + 10, 10, -0.5, 0.5);
    ctx.stroke();

    // Scales (decorative lines)
    ctx.beginPath();
    ctx.arc(cx, cy, 50, 0.5, 2.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 30, cy, 40, 0.5, 2.5);
    ctx.stroke();
  }

  drawButterfly(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Left top wing
    ctx.beginPath();
    ctx.ellipse(cx - 80, cy - 50, 70, 60, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right top wing
    ctx.beginPath();
    ctx.ellipse(cx + 80, cy - 50, 70, 60, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Left bottom wing
    ctx.beginPath();
    ctx.ellipse(cx - 60, cy + 50, 50, 45, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right bottom wing
    ctx.beginPath();
    ctx.ellipse(cx + 60, cy + 50, 50, 45, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.ellipse(cx, cy, 15, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - 90, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Antennae
    ctx.beginPath();
    ctx.moveTo(cx - 10, cy - 105);
    ctx.quadraticCurveTo(cx - 30, cy - 140, cx - 20, cy - 150);
    ctx.moveTo(cx + 10, cy - 105);
    ctx.quadraticCurveTo(cx + 30, cy - 140, cx + 20, cy - 150);
    ctx.stroke();

    // Wing patterns (circles)
    ctx.beginPath();
    ctx.arc(cx - 80, cy - 50, 25, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 80, cy - 50, 25, 0, Math.PI * 2);
    ctx.stroke();
  }

  drawElephant(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Body
    ctx.beginPath();
    ctx.ellipse(cx + 20, cy + 40, 110, 80, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(cx - 80, cy - 20, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Left ear
    ctx.beginPath();
    ctx.ellipse(cx - 150, cy - 20, 45, 60, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Right ear (behind)
    ctx.beginPath();
    ctx.ellipse(cx - 30, cy - 30, 35, 50, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Trunk
    ctx.beginPath();
    ctx.moveTo(cx - 100, cy + 20);
    ctx.quadraticCurveTo(cx - 130, cy + 80, cx - 100, cy + 130);
    ctx.quadraticCurveTo(cx - 70, cy + 140, cx - 60, cy + 120);
    ctx.quadraticCurveTo(cx - 70, cy + 80, cx - 70, cy + 30);
    ctx.fill();
    ctx.stroke();

    // Eye
    ctx.beginPath();
    ctx.arc(cx - 60, cy - 30, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 60, cy - 30, 4, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.rect(cx - 30, cy + 90, 35, 60);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(cx + 50, cy + 90, 35, 60);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(cx + 120, cy + 60);
    ctx.quadraticCurveTo(cx + 150, cy + 100, cx + 140, cy + 130);
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.lineWidth = 3;
  }

  drawLion(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Mane (big circle behind)
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Mane spikes
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(cx + 80 * Math.cos(angle), cy - 30 + 80 * Math.sin(angle));
      ctx.lineTo(cx + 120 * Math.cos(angle), cy - 30 + 120 * Math.sin(angle));
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    ctx.lineWidth = 3;

    // Face
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.ellipse(cx, cy + 80, 70, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.beginPath();
    ctx.arc(cx - 22, cy - 40, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 22, cy - 40, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 22, cy - 40, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 22, cy - 40, 4, 0, Math.PI * 2);
    ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(cx - 10, cy - 8);
    ctx.lineTo(cx + 10, cy - 8);
    ctx.closePath();
    ctx.fill();

    // Mouth
    ctx.beginPath();
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx, cy + 5);
    ctx.arc(cx - 10, cy + 5, 10, 0, Math.PI / 2);
    ctx.moveTo(cx, cy + 5);
    ctx.arc(cx + 10, cy + 5, 10, Math.PI, Math.PI / 2, true);
    ctx.stroke();
  }

  drawShark(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Body
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy);
    ctx.quadraticCurveTo(cx - 100, cy - 60, cx, cy - 50);
    ctx.quadraticCurveTo(cx + 100, cy - 40, cx + 150, cy - 20);
    ctx.lineTo(cx + 150, cy + 20);
    ctx.quadraticCurveTo(cx + 100, cy + 40, cx, cy + 50);
    ctx.quadraticCurveTo(cx - 100, cy + 60, cx - 150, cy);
    ctx.fill();
    ctx.stroke();

    // Dorsal fin
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 50);
    ctx.lineTo(cx, cy - 120);
    ctx.lineTo(cx + 50, cy - 45);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(cx + 140, cy - 20);
    ctx.lineTo(cx + 200, cy - 60);
    ctx.lineTo(cx + 160, cy);
    ctx.lineTo(cx + 200, cy + 40);
    ctx.lineTo(cx + 140, cy + 20);
    ctx.fill();
    ctx.stroke();

    // Pectoral fin
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 40);
    ctx.lineTo(cx - 80, cy + 90);
    ctx.lineTo(cx, cy + 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Belly line
    ctx.beginPath();
    ctx.moveTo(cx - 130, cy + 10);
    ctx.quadraticCurveTo(cx, cy + 30, cx + 130, cy + 10);
    ctx.stroke();

    // Eye
    ctx.beginPath();
    ctx.arc(cx - 100, cy - 15, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 100, cy - 15, 5, 0, Math.PI * 2);
    ctx.fill();

    // Gills
    ctx.beginPath();
    ctx.moveTo(cx - 60, cy - 20);
    ctx.lineTo(cx - 60, cy + 15);
    ctx.moveTo(cx - 50, cy - 20);
    ctx.lineTo(cx - 50, cy + 15);
    ctx.moveTo(cx - 40, cy - 20);
    ctx.lineTo(cx - 40, cy + 15);
    ctx.stroke();

    // Teeth
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx - 140, cy + 5);
    ctx.lineTo(cx - 135, cy + 15);
    ctx.lineTo(cx - 130, cy + 5);
    ctx.lineTo(cx - 125, cy + 15);
    ctx.lineTo(cx - 120, cy + 5);
    ctx.stroke();
  }

  // === VEHICLES ===

  drawCar(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Body
    ctx.beginPath();
    ctx.moveTo(cx - 130, cy + 30);
    ctx.lineTo(cx - 130, cy - 10);
    ctx.lineTo(cx - 80, cy - 10);
    ctx.lineTo(cx - 50, cy - 60);
    ctx.lineTo(cx + 60, cy - 60);
    ctx.lineTo(cx + 100, cy - 10);
    ctx.lineTo(cx + 130, cy - 10);
    ctx.lineTo(cx + 130, cy + 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Windows
    ctx.beginPath();
    ctx.moveTo(cx - 70, cy - 15);
    ctx.lineTo(cx - 45, cy - 50);
    ctx.lineTo(cx - 5, cy - 50);
    ctx.lineTo(cx - 5, cy - 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 5, cy - 15);
    ctx.lineTo(cx + 5, cy - 50);
    ctx.lineTo(cx + 50, cy - 50);
    ctx.lineTo(cx + 85, cy - 15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Wheels
    ctx.beginPath();
    ctx.arc(cx - 70, cy + 40, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - 70, cy + 40, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + 70, cy + 40, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 70, cy + 40, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Headlights
    ctx.beginPath();
    ctx.ellipse(cx + 115, cy + 5, 12, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawPlane(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Body
    ctx.beginPath();
    ctx.ellipse(cx, cy, 140, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Nose
    ctx.beginPath();
    ctx.moveTo(cx + 130, cy);
    ctx.lineTo(cx + 180, cy);
    ctx.quadraticCurveTo(cx + 190, cy, cx + 180, cy + 10);
    ctx.lineTo(cx + 130, cy + 10);
    ctx.fill();
    ctx.stroke();

    // Wings
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy - 30);
    ctx.lineTo(cx - 50, cy - 100);
    ctx.lineTo(cx + 50, cy - 100);
    ctx.lineTo(cx + 30, cy - 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 30);
    ctx.lineTo(cx - 50, cy + 100);
    ctx.lineTo(cx + 50, cy + 100);
    ctx.lineTo(cx + 30, cy + 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy - 30);
    ctx.lineTo(cx - 140, cy - 80);
    ctx.lineTo(cx - 100, cy - 80);
    ctx.lineTo(cx - 100, cy - 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Windows
    ctx.beginPath();
    ctx.arc(cx + 60, cy - 10, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 20, cy - 10, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - 20, cy - 10, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawBoat(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Hull
    ctx.beginPath();
    ctx.moveTo(cx - 140, cy + 40);
    ctx.lineTo(cx - 100, cy + 100);
    ctx.lineTo(cx + 100, cy + 100);
    ctx.lineTo(cx + 140, cy + 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Cabin
    ctx.beginPath();
    ctx.rect(cx - 60, cy - 20, 100, 60);
    ctx.fill();
    ctx.stroke();

    // Cabin roof
    ctx.beginPath();
    ctx.moveTo(cx - 70, cy - 20);
    ctx.lineTo(cx - 50, cy - 50);
    ctx.lineTo(cx + 50, cy - 50);
    ctx.lineTo(cx + 50, cy - 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Chimney
    ctx.beginPath();
    ctx.rect(cx + 20, cy - 90, 20, 40);
    ctx.fill();
    ctx.stroke();

    // Windows
    ctx.beginPath();
    ctx.rect(cx - 45, cy - 5, 25, 25);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(cx, cy - 5, 25, 25);
    ctx.fill();
    ctx.stroke();

    // Flag
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy - 20);
    ctx.lineTo(cx - 80, cy - 100);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 80, cy - 100);
    ctx.lineTo(cx - 40, cy - 80);
    ctx.lineTo(cx - 80, cy - 60);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Waves
    ctx.beginPath();
    ctx.moveTo(cx - 180, cy + 110);
    ctx.quadraticCurveTo(cx - 140, cy + 130, cx - 100, cy + 110);
    ctx.quadraticCurveTo(cx - 60, cy + 90, cx - 20, cy + 110);
    ctx.quadraticCurveTo(cx + 20, cy + 130, cx + 60, cy + 110);
    ctx.quadraticCurveTo(cx + 100, cy + 90, cx + 140, cy + 110);
    ctx.quadraticCurveTo(cx + 180, cy + 130, cx + 200, cy + 110);
    ctx.stroke();
  }

  drawTrain(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Main body
    ctx.beginPath();
    ctx.rect(cx - 100, cy - 40, 150, 80);
    ctx.fill();
    ctx.stroke();

    // Front
    ctx.beginPath();
    ctx.moveTo(cx + 50, cy - 40);
    ctx.lineTo(cx + 100, cy - 40);
    ctx.quadraticCurveTo(cx + 130, cy - 40, cx + 130, cy);
    ctx.quadraticCurveTo(cx + 130, cy + 40, cx + 100, cy + 40);
    ctx.lineTo(cx + 50, cy + 40);
    ctx.fill();
    ctx.stroke();

    // Cabin
    ctx.beginPath();
    ctx.rect(cx - 100, cy - 100, 80, 60);
    ctx.fill();
    ctx.stroke();

    // Cabin roof
    ctx.beginPath();
    ctx.rect(cx - 110, cy - 110, 100, 15);
    ctx.fill();
    ctx.stroke();

    // Chimney
    ctx.beginPath();
    ctx.rect(cx + 10, cy - 80, 25, 40);
    ctx.fill();
    ctx.stroke();

    // Windows
    ctx.beginPath();
    ctx.rect(cx - 85, cy - 85, 25, 30);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(cx - 50, cy - 85, 25, 30);
    ctx.fill();
    ctx.stroke();

    // Wheels
    ctx.beginPath();
    ctx.arc(cx - 60, cy + 55, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx - 60, cy + 55, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + 30, cy + 55, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 30, cy + 55, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx + 100, cy + 55, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 100, cy + 55, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawRocket(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Body
    ctx.beginPath();
    ctx.moveTo(cx, cy - 150);
    ctx.quadraticCurveTo(cx + 50, cy - 100, cx + 50, cy + 50);
    ctx.lineTo(cx + 50, cy + 80);
    ctx.lineTo(cx - 50, cy + 80);
    ctx.lineTo(cx - 50, cy + 50);
    ctx.quadraticCurveTo(cx - 50, cy - 100, cx, cy - 150);
    ctx.fill();
    ctx.stroke();

    // Window
    ctx.beginPath();
    ctx.arc(cx, cy - 40, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy - 40, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Left fin
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 30);
    ctx.lineTo(cx - 100, cy + 100);
    ctx.lineTo(cx - 50, cy + 80);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right fin
    ctx.beginPath();
    ctx.moveTo(cx + 50, cy + 30);
    ctx.lineTo(cx + 100, cy + 100);
    ctx.lineTo(cx + 50, cy + 80);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Bottom fin
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy + 80);
    ctx.lineTo(cx, cy + 120);
    ctx.lineTo(cx + 20, cy + 80);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Flames
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 80);
    ctx.quadraticCurveTo(cx - 20, cy + 130, cx - 25, cy + 150);
    ctx.quadraticCurveTo(cx - 10, cy + 120, cx, cy + 160);
    ctx.quadraticCurveTo(cx + 10, cy + 120, cx + 25, cy + 150);
    ctx.quadraticCurveTo(cx + 20, cy + 130, cx + 30, cy + 80);
    ctx.fill();
    ctx.stroke();
  }

  // === FRUITS ===

  drawApple(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Apple body
    ctx.beginPath();
    ctx.moveTo(cx, cy - 60);
    ctx.bezierCurveTo(cx - 100, cy - 60, cx - 120, cy + 50, cx - 80, cy + 100);
    ctx.bezierCurveTo(cx - 40, cy + 140, cx + 40, cy + 140, cx + 80, cy + 100);
    ctx.bezierCurveTo(cx + 120, cy + 50, cx + 100, cy - 60, cx, cy - 60);
    ctx.fill();
    ctx.stroke();

    // Stem
    ctx.beginPath();
    ctx.moveTo(cx, cy - 60);
    ctx.quadraticCurveTo(cx + 10, cy - 90, cx + 5, cy - 110);
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.lineWidth = 3;

    // Leaf
    ctx.beginPath();
    ctx.moveTo(cx + 5, cy - 90);
    ctx.quadraticCurveTo(cx + 50, cy - 110, cx + 70, cy - 80);
    ctx.quadraticCurveTo(cx + 50, cy - 85, cx + 5, cy - 90);
    ctx.fill();
    ctx.stroke();

    // Highlight
    ctx.beginPath();
    ctx.ellipse(cx - 40, cy - 20, 15, 25, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawOrange(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Orange body
    ctx.beginPath();
    ctx.arc(cx, cy, 100, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Stem area
    ctx.beginPath();
    ctx.arc(cx, cy - 95, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Leaf
    ctx.beginPath();
    ctx.moveTo(cx, cy - 100);
    ctx.quadraticCurveTo(cx + 40, cy - 130, cx + 60, cy - 100);
    ctx.quadraticCurveTo(cx + 40, cy - 110, cx, cy - 100);
    ctx.fill();
    ctx.stroke();

    // Texture dots
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = 50;
      ctx.beginPath();
      ctx.arc(cx + r * Math.cos(angle), cy + r * Math.sin(angle), 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawWatermelon(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Outer rind
    ctx.beginPath();
    ctx.arc(cx, cy + 30, 120, Math.PI, 0);
    ctx.lineTo(cx + 120, cy + 30);
    ctx.lineTo(cx - 120, cy + 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Inner flesh area
    ctx.beginPath();
    ctx.arc(cx, cy + 30, 100, Math.PI, 0);
    ctx.lineTo(cx + 100, cy + 30);
    ctx.lineTo(cx - 100, cy + 30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Seeds
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(cx - 50, cy - 10, 6, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx, cy - 30, 6, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 50, cy - 10, 6, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx - 25, cy + 10, 6, 10, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 25, cy + 10, 6, 10, 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // === CHARACTERS ===

  drawBoy(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - 60, 60, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hair
    ctx.beginPath();
    ctx.arc(cx, cy - 80, 55, Math.PI, 0);
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.beginPath();
    ctx.arc(cx - 20, cy - 65, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 20, cy - 65, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 20, cy - 65, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 20, cy - 65, 3, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.beginPath();
    ctx.arc(cx, cy - 45, 15, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Body (shirt)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx - 45, cy);
    ctx.lineTo(cx - 55, cy + 80);
    ctx.lineTo(cx + 55, cy + 80);
    ctx.lineTo(cx + 45, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(cx - 45, cy + 10);
    ctx.lineTo(cx - 80, cy + 60);
    ctx.lineWidth = 15;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 45, cy + 10);
    ctx.lineTo(cx + 80, cy + 60);
    ctx.stroke();
    ctx.lineWidth = 3;

    // Pants
    ctx.beginPath();
    ctx.moveTo(cx - 50, cy + 80);
    ctx.lineTo(cx - 40, cy + 140);
    ctx.lineTo(cx - 5, cy + 140);
    ctx.lineTo(cx, cy + 90);
    ctx.lineTo(cx + 5, cy + 140);
    ctx.lineTo(cx + 40, cy + 140);
    ctx.lineTo(cx + 50, cy + 80);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Hands
    ctx.beginPath();
    ctx.arc(cx - 80, cy + 65, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 80, cy + 65, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  drawGirl(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Hair (long)
    ctx.beginPath();
    ctx.moveTo(cx - 70, cy - 80);
    ctx.quadraticCurveTo(cx - 80, cy + 20, cx - 60, cy + 60);
    ctx.lineTo(cx - 45, cy);
    ctx.lineTo(cx + 45, cy);
    ctx.lineTo(cx + 60, cy + 60);
    ctx.quadraticCurveTo(cx + 80, cy + 20, cx + 70, cy - 80);
    ctx.quadraticCurveTo(cx, cy - 130, cx - 70, cy - 80);
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.arc(cx, cy - 60, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hair bow
    ctx.beginPath();
    ctx.moveTo(cx + 40, cy - 100);
    ctx.quadraticCurveTo(cx + 70, cy - 120, cx + 80, cy - 100);
    ctx.quadraticCurveTo(cx + 70, cy - 80, cx + 40, cy - 100);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 45, cy - 100, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.beginPath();
    ctx.arc(cx - 18, cy - 65, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 18, cy - 65, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 18, cy - 65, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 18, cy - 65, 3, 0, Math.PI * 2);
    ctx.fill();

    // Smile
    ctx.beginPath();
    ctx.arc(cx, cy - 45, 12, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Dress
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy);
    ctx.lineTo(cx - 70, cy + 100);
    ctx.quadraticCurveTo(cx, cy + 110, cx + 70, cy + 100);
    ctx.lineTo(cx + 40, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy + 10);
    ctx.lineTo(cx - 75, cy + 55);
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 40, cy + 10);
    ctx.lineTo(cx + 75, cy + 55);
    ctx.stroke();
    ctx.lineWidth = 3;

    // Hands
    ctx.beginPath();
    ctx.arc(cx - 75, cy + 60, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 75, cy + 60, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(cx - 25, cy + 100);
    ctx.lineTo(cx - 25, cy + 140);
    ctx.moveTo(cx + 25, cy + 100);
    ctx.lineTo(cx + 25, cy + 140);
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.lineWidth = 3;
  }

  drawRobot(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Antenna
    ctx.beginPath();
    ctx.moveTo(cx, cy - 110);
    ctx.lineTo(cx, cy - 140);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy - 145, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Head
    ctx.beginPath();
    ctx.rect(cx - 55, cy - 110, 110, 80);
    ctx.fill();
    ctx.stroke();

    // Eyes
    ctx.beginPath();
    ctx.rect(cx - 40, cy - 90, 25, 25);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(cx + 15, cy - 90, 25, 25);
    ctx.fill();
    ctx.stroke();

    // Eye lights
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx - 27, cy - 77, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 27, cy - 77, 6, 0, Math.PI * 2);
    ctx.fill();

    // Mouth
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.rect(cx - 30, cy - 50, 60, 15);
    ctx.fill();
    ctx.stroke();

    // Body
    ctx.beginPath();
    ctx.rect(cx - 65, cy - 25, 130, 100);
    ctx.fill();
    ctx.stroke();

    // Chest panel
    ctx.beginPath();
    ctx.rect(cx - 40, cy - 10, 80, 60);
    ctx.fill();
    ctx.stroke();

    // Buttons
    ctx.beginPath();
    ctx.arc(cx - 20, cy + 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + 20, cy + 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy + 35, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Arms
    ctx.beginPath();
    ctx.rect(cx - 95, cy - 15, 30, 70);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(cx + 65, cy - 15, 30, 70);
    ctx.fill();
    ctx.stroke();

    // Hands (claws)
    ctx.beginPath();
    ctx.rect(cx - 90, cy + 55, 10, 25);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(cx - 75, cy + 55, 10, 25);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(cx + 70, cy + 55, 10, 25);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(cx + 85, cy + 55, 10, 25);
    ctx.fill();
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.rect(cx - 50, cy + 75, 35, 60);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(cx + 15, cy + 75, 35, 60);
    ctx.fill();
    ctx.stroke();

    // Feet
    ctx.beginPath();
    ctx.rect(cx - 55, cy + 130, 45, 20);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(cx + 10, cy + 130, 45, 20);
    ctx.fill();
    ctx.stroke();
  }

  drawMonster(ctx, w, h) {
    const cx = w / 2, cy = h / 2;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.fillStyle = '#fff';

    // Body (blob shape)
    ctx.beginPath();
    ctx.moveTo(cx - 100, cy + 80);
    ctx.quadraticCurveTo(cx - 130, cy, cx - 100, cy - 60);
    ctx.quadraticCurveTo(cx - 60, cy - 100, cx, cy - 80);
    ctx.quadraticCurveTo(cx + 60, cy - 100, cx + 100, cy - 60);
    ctx.quadraticCurveTo(cx + 130, cy, cx + 100, cy + 80);
    ctx.quadraticCurveTo(cx, cy + 100, cx - 100, cy + 80);
    ctx.fill();
    ctx.stroke();

    // Eye (one big)
    ctx.beginPath();
    ctx.arc(cx, cy - 20, 45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy - 20, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(cx, cy - 20, 15, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(cx - 60, cy - 70);
    ctx.lineTo(cx - 80, cy - 130);
    ctx.lineTo(cx - 40, cy - 80);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 60, cy - 70);
    ctx.lineTo(cx + 80, cy - 130);
    ctx.lineTo(cx + 40, cy - 80);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Mouth
    ctx.beginPath();
    ctx.arc(cx, cy + 40, 40, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Teeth
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 50);
    ctx.lineTo(cx - 25, cy + 65);
    ctx.lineTo(cx - 20, cy + 50);
    ctx.moveTo(cx - 10, cy + 55);
    ctx.lineTo(cx - 5, cy + 70);
    ctx.lineTo(cx, cy + 55);
    ctx.moveTo(cx + 10, cy + 55);
    ctx.lineTo(cx + 15, cy + 70);
    ctx.lineTo(cx + 20, cy + 55);
    ctx.moveTo(cx + 25, cy + 50);
    ctx.lineTo(cx + 30, cy + 65);
    ctx.lineTo(cx + 35, cy + 50);
    ctx.stroke();

    // Arms/tentacles
    ctx.beginPath();
    ctx.moveTo(cx - 100, cy + 20);
    ctx.quadraticCurveTo(cx - 150, cy + 40, cx - 140, cy + 80);
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 100, cy + 20);
    ctx.quadraticCurveTo(cx + 150, cy + 40, cx + 140, cy + 80);
    ctx.stroke();
    ctx.lineWidth = 3;

    // Feet
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(cx - 50, cy + 100, 30, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx + 50, cy + 100, 30, 20, 0, 0, Math.PI * 2);
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

    // Sticker mode - place sticker
    if (this.stickerMode && this.currentSticker) {
      this.placeSticker(x, y);
      audio.playPop();
      this.saveState();
      return;
    }

    if (this.currentTool === 'fill') {
      this.floodFill(Math.floor(x), Math.floor(y), this.currentColor);
      audio.playPop();
      this.saveState();
    } else {
      this.isDrawing = true;
      this.lastX = x;
      this.lastY = y;
      this.rainbowPathLength = 0; // Reset rainbow path
    }
  }

  // Handle move
  handleMove(e) {
    if (!this.isDrawing || this.currentTool !== 'brush') return;
    e.preventDefault();

    const { x, y } = this.getCoords(e);
    const dpr = window.devicePixelRatio || 1;

    // Calculate distance for rainbow effect
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    this.rainbowPathLength += distance;

    // Determine stroke color
    let strokeColor;
    if (this.isRainbow) {
      const colorIndex = Math.floor(this.rainbowPathLength / 30) % RAINBOW_COLORS.length;
      strokeColor = RAINBOW_COLORS[colorIndex];
    } else {
      strokeColor = this.currentColor;
    }

    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(x, y);
    this.ctx.strokeStyle = strokeColor;
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

  // Toggle rainbow mode
  toggleRainbow(enabled) {
    this.isRainbow = enabled;
    if (enabled) {
      this.stickerMode = false;
      this.currentTool = 'brush';
    }
  }

  // Set sticker mode
  setStickerMode(enabled) {
    this.stickerMode = enabled;
    if (enabled) {
      this.isRainbow = false;
    }
  }

  // Set current sticker
  setSticker(emoji) {
    this.currentSticker = emoji;
    this.stickerMode = true;
    this.isRainbow = false;
  }

  // Set sticker size
  setStickerSize(size) {
    this.stickerSize = size;
  }

  // Place sticker on canvas
  placeSticker(x, y) {
    if (!this.currentSticker) return;

    const dpr = window.devicePixelRatio || 1;

    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);

    this.ctx.font = `${this.stickerSize * dpr}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(this.currentSticker, x, y);

    this.ctx.restore();
  }
}

export const coloringModule = new ColoringModule();
