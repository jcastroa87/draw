// Matching/Association Game Module for Gorila Studio
// Kids match letters with pictures or numbers with quantities

import { audio } from './audio.js';
import { spanishAlphabet } from '../data/letters-es.js';
import { russianAlphabet } from '../data/letters-ru.js';

class MatchingGame {
  constructor() {
    this.mode = 'letters'; // 'letters' or 'numbers'
    this.language = 'es';
    this.score = 0;
    this.currentItems = [];
    this.selectedLeft = null;
    this.selectedRight = null;
    this.matchedPairs = new Set();
    this.pairsCount = 4; // Number of pairs per round
  }

  init() {
    this.setupEventListeners();
    this.newGame();
  }

  setupEventListeners() {
    // Mode buttons
    const lettersBtn = document.getElementById('matching-mode-letters');
    const numbersBtn = document.getElementById('matching-mode-numbers');
    const newGameBtn = document.getElementById('matching-new-game');

    if (lettersBtn) {
      lettersBtn.addEventListener('click', () => {
        this.mode = 'letters';
        lettersBtn.classList.add('active');
        numbersBtn?.classList.remove('active');
        this.newGame();
        audio.playPop();
      });
    }

    if (numbersBtn) {
      numbersBtn.addEventListener('click', () => {
        this.mode = 'numbers';
        numbersBtn.classList.add('active');
        lettersBtn?.classList.remove('active');
        this.newGame();
        audio.playPop();
      });
    }

    if (newGameBtn) {
      newGameBtn.addEventListener('click', () => {
        this.newGame();
        audio.playWhoosh();
      });
    }

    // Celebration click to dismiss
    const celebration = document.getElementById('matching-celebration');
    if (celebration) {
      celebration.addEventListener('click', () => {
        celebration.classList.add('hidden');
        this.newGame();
      });
    }
  }

  setLanguage(lang) {
    this.language = lang;
    this.updateInstruction();
  }

  updateInstruction() {
    const instruction = document.getElementById('matching-instruction');
    if (!instruction) return;

    if (this.mode === 'letters') {
      instruction.textContent = this.language === 'es' 
        ? '¡Une cada letra con su dibujo!' 
        : 'Соедини букву с картинкой!';
    } else {
      instruction.textContent = this.language === 'es' 
        ? '¡Une cada número con la cantidad!' 
        : 'Соедини число с количеством!';
    }
  }

  // Get random items for the game
  getRandomItems() {
    if (this.mode === 'letters') {
      const alphabet = this.language === 'es' ? spanishAlphabet : russianAlphabet;
      // Shuffle and take first N
      const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, this.pairsCount).map(item => ({
        id: item.letter,
        left: item.letter,
        right: item.emoji,
        word: item.word
      }));
    } else {
      // Numbers mode - match number to quantity of emojis
      const numberItems = [];
      const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const emojis = ['🍌', '🍎', '⭐', '🦍', '🌸', '🐵', '🍇', '🐦', '🐠'];
      
      // Shuffle and take N
      const shuffled = availableNumbers.sort(() => Math.random() - 0.5);
      const selectedNumbers = shuffled.slice(0, this.pairsCount);
      
      selectedNumbers.forEach((num, index) => {
        const emoji = emojis[index % emojis.length];
        numberItems.push({
          id: num,
          left: String(num),
          right: emoji.repeat(num),
          word: String(num)
        });
      });

      return numberItems;
    }
  }

  newGame() {
    this.currentItems = this.getRandomItems();
    this.matchedPairs.clear();
    this.selectedLeft = null;
    this.selectedRight = null;
    this.updateInstruction();
    this.render();
    this.updateScore();
  }

  render() {
    const leftColumn = document.getElementById('matching-left');
    const rightColumn = document.getElementById('matching-right');
    const svg = document.getElementById('matching-svg');

    if (!leftColumn || !rightColumn) return;

    // Clear previous content
    leftColumn.innerHTML = '';
    rightColumn.innerHTML = '';
    if (svg) svg.innerHTML = '';

    // Shuffle both columns independently
    const leftItems = [...this.currentItems].sort(() => Math.random() - 0.5);
    const rightItems = [...this.currentItems].sort(() => Math.random() - 0.5);

    // Create left column items (letters/numbers)
    leftItems.forEach(item => {
      const el = document.createElement('button');
      el.className = 'matching-item matching-item-left';
      el.dataset.id = item.id;
      el.innerHTML = `<span class="matching-item-content">${item.left}</span>`;
      
      if (this.matchedPairs.has(item.id)) {
        el.classList.add('matched');
        el.disabled = true;
      }

      el.addEventListener('click', () => this.selectLeft(item.id, el));
      leftColumn.appendChild(el);
    });

    // Create right column items (emojis)
    rightItems.forEach(item => {
      const el = document.createElement('button');
      el.className = 'matching-item matching-item-right';
      el.dataset.id = item.id;
      
      // For numbers mode, show emojis stacked if many
      if (this.mode === 'numbers' && item.right.length > 4) {
        el.innerHTML = `<span class="matching-item-content matching-emoji-grid">${item.right}</span>`;
      } else {
        el.innerHTML = `<span class="matching-item-content">${item.right}</span>`;
      }
      
      if (this.matchedPairs.has(item.id)) {
        el.classList.add('matched');
        el.disabled = true;
      }

      el.addEventListener('click', () => this.selectRight(item.id, el));
      rightColumn.appendChild(el);
    });
  }

  selectLeft(id, element) {
    if (this.matchedPairs.has(id)) return;

    // Remove previous selection
    document.querySelectorAll('.matching-item-left.selected').forEach(el => {
      el.classList.remove('selected');
    });

    element.classList.add('selected');
    this.selectedLeft = id;
    audio.playTap();

    this.checkMatch();
  }

  selectRight(id, element) {
    if (this.matchedPairs.has(id)) return;

    // Remove previous selection
    document.querySelectorAll('.matching-item-right.selected').forEach(el => {
      el.classList.remove('selected');
    });

    element.classList.add('selected');
    this.selectedRight = id;
    audio.playTap();

    this.checkMatch();
  }

  checkMatch() {
    if (this.selectedLeft === null || this.selectedRight === null) return;

    if (this.selectedLeft === this.selectedRight) {
      // Correct match!
      this.matchedPairs.add(this.selectedLeft);
      this.score += 10;

      // Animate matched items
      document.querySelectorAll(`.matching-item[data-id="${this.selectedLeft}"]`).forEach(el => {
        el.classList.remove('selected');
        el.classList.add('matched');
        el.disabled = true;
      });

      audio.playSuccess();
      this.drawMatchLine(this.selectedLeft);

      // Check if all matched
      if (this.matchedPairs.size === this.currentItems.length) {
        this.celebrate();
      }
    } else {
      // Wrong match
      document.querySelectorAll('.matching-item.selected').forEach(el => {
        el.classList.add('wrong');
        setTimeout(() => {
          el.classList.remove('selected', 'wrong');
        }, 500);
      });
      audio.playPop();
    }

    this.selectedLeft = null;
    this.selectedRight = null;
    this.updateScore();
  }

  drawMatchLine(id) {
    const svg = document.getElementById('matching-svg');
    if (!svg) return;

    const leftItem = document.querySelector(`.matching-item-left[data-id="${id}"]`);
    const rightItem = document.querySelector(`.matching-item-right[data-id="${id}"]`);
    
    if (!leftItem || !rightItem) return;

    const svgRect = svg.getBoundingClientRect();
    const leftRect = leftItem.getBoundingClientRect();
    const rightRect = rightItem.getBoundingClientRect();

    const x1 = leftRect.right - svgRect.left;
    const y1 = leftRect.top + leftRect.height / 2 - svgRect.top;
    const x2 = rightRect.left - svgRect.left;
    const y2 = rightRect.top + rightRect.height / 2 - svgRect.top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#4CAF50');
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    line.classList.add('match-line');

    svg.appendChild(line);
  }

  updateScore() {
    const scoreEl = document.getElementById('matching-score');
    if (scoreEl) {
      scoreEl.textContent = this.score;
    }
  }

  celebrate() {
    const celebration = document.getElementById('matching-celebration');
    if (celebration) {
      celebration.classList.remove('hidden');
      
      // Update celebration text based on language
      const celebrationText = celebration.querySelector('.celebration-text');
      if (celebrationText) {
        celebrationText.textContent = this.language === 'es' ? '¡Excelente!' : 'Отлично!';
      }
      
      // Auto-start new game after celebration
      setTimeout(() => {
        celebration.classList.add('hidden');
        this.newGame();
      }, 2000);
    }
  }
}

export const matchingGame = new MatchingGame();
