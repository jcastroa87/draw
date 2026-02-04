// Matching/Association Game Module for Gorila Studio
// Kids match letters with pictures, numbers with quantities, colors, shapes, and animals

import { audio } from './audio.js';
import { progress } from './progress.js';
import { spanishAlphabet } from '../data/letters-es.js';
import { russianAlphabet } from '../data/letters-ru.js';
import { COLORS_DATA, SHAPES_DATA, ANIMALS_DATA, MODE_INSTRUCTIONS } from '../data/matching-data.js';

class MatchingGame {
  constructor() {
    this.mode = 'letters'; // 'letters', 'numbers', 'colors', 'shapes', 'animals'
    this.language = 'es';
    this.score = 0;
    this.currentItems = [];
    this.selectedLeft = null;
    this.selectedRight = null;
    this.matchedPairs = new Set();
    this.pairsCount = 4; // Number of pairs per round
    this.errorsThisRound = 0; // Track errors for perfect bonus
  }

  init() {
    this.setupEventListeners();
    this.setupBananaCounter();
    this.newGame();
  }

  setupBananaCounter() {
    // Update banana count display
    const bananaCount = document.getElementById('matching-banana-count');
    if (bananaCount) {
      bananaCount.textContent = progress.getBananas();
    }

    // Listen for changes
    progress.addListener(() => {
      const bananaCount = document.getElementById('matching-banana-count');
      if (bananaCount) {
        bananaCount.textContent = progress.getBananas();
      }
    });
  }

  setupEventListeners() {
    // Mode buttons
    const lettersBtn = document.getElementById('matching-mode-letters');
    const numbersBtn = document.getElementById('matching-mode-numbers');
    const colorsBtn = document.getElementById('matching-mode-colors');
    const shapesBtn = document.getElementById('matching-mode-shapes');
    const animalsBtn = document.getElementById('matching-mode-animals');
    const newGameBtn = document.getElementById('matching-new-game');

    const allModeButtons = [lettersBtn, numbersBtn, colorsBtn, shapesBtn, animalsBtn].filter(Boolean);

    const setActiveMode = (mode, activeBtn) => {
      this.mode = mode;
      allModeButtons.forEach(btn => btn.classList.remove('active'));
      activeBtn?.classList.add('active');
      this.newGame();
      audio.playPop();
    };

    if (lettersBtn) {
      lettersBtn.addEventListener('click', () => setActiveMode('letters', lettersBtn));
    }

    if (numbersBtn) {
      numbersBtn.addEventListener('click', () => setActiveMode('numbers', numbersBtn));
    }

    if (colorsBtn) {
      colorsBtn.addEventListener('click', () => setActiveMode('colors', colorsBtn));
    }

    if (shapesBtn) {
      shapesBtn.addEventListener('click', () => setActiveMode('shapes', shapesBtn));
    }

    if (animalsBtn) {
      animalsBtn.addEventListener('click', () => setActiveMode('animals', animalsBtn));
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

    // Word feedback click to dismiss early
    const wordFeedback = document.getElementById('word-feedback');
    if (wordFeedback) {
      wordFeedback.addEventListener('click', () => {
        wordFeedback.classList.add('hidden');
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

    const instructions = MODE_INSTRUCTIONS[this.mode];
    if (instructions) {
      instruction.textContent = instructions[this.language] || instructions.es;
    }
  }

  // Get random items for the game based on current mode
  getRandomItems() {
    switch (this.mode) {
      case 'letters':
        return this.getLetterItems();
      case 'numbers':
        return this.getNumberItems();
      case 'colors':
        return this.getDataItems(COLORS_DATA);
      case 'shapes':
        return this.getDataItems(SHAPES_DATA);
      case 'animals':
        return this.getDataItems(ANIMALS_DATA);
      default:
        return this.getLetterItems();
    }
  }

  getLetterItems() {
    const alphabet = this.language === 'es' ? spanishAlphabet : russianAlphabet;
    const shuffled = [...alphabet].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, this.pairsCount).map(item => ({
      id: item.letter,
      left: item.letter,
      right: item.emoji,
      word: item.word
    }));
  }

  getNumberItems() {
    const numberItems = [];
    const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const emojis = ['🍌', '🍎', '⭐', '🦍', '🌸', '🐵', '🍇', '🐦', '🐠'];

    const shuffled = availableNumbers.sort(() => Math.random() - 0.5);
    const selectedNumbers = shuffled.slice(0, this.pairsCount);

    const numberWords = {
      es: ['uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'],
      ru: ['один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять']
    };

    selectedNumbers.forEach((num, index) => {
      const emoji = emojis[index % emojis.length];
      numberItems.push({
        id: num,
        left: String(num),
        right: emoji.repeat(num),
        word: numberWords[this.language]?.[num - 1] || String(num)
      });
    });

    return numberItems;
  }

  getDataItems(dataSource) {
    const data = dataSource[this.language] || dataSource.es;
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, this.pairsCount);
  }

  newGame() {
    this.currentItems = this.getRandomItems();
    this.matchedPairs.clear();
    this.selectedLeft = null;
    this.selectedRight = null;
    this.errorsThisRound = 0;
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

    // Create left column items
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

    // Create right column items
    rightItems.forEach(item => {
      const el = document.createElement('button');
      el.className = 'matching-item matching-item-right';
      el.dataset.id = item.id;

      // For numbers mode, show emojis in a grid layout
      if (this.mode === 'numbers') {
        // Split emojis into individual spans for better flex layout
        const emojis = [...item.right];
        const emojiSpans = emojis.map(e => `<span>${e}</span>`).join('');
        el.innerHTML = `<span class="matching-item-content matching-emoji-grid">${emojiSpans}</span>`;
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

      // Find the matched item for feedback
      const matchedItem = this.currentItems.find(item => item.id === this.selectedLeft);

      // Animate matched items
      document.querySelectorAll(`.matching-item[data-id="${this.selectedLeft}"]`).forEach(el => {
        el.classList.remove('selected');
        el.classList.add('matched');
        el.disabled = true;
      });

      audio.playSuccess();
      this.drawMatchLine(this.selectedLeft);

      // Show word feedback with pronunciation
      if (matchedItem) {
        this.showWordFeedback(matchedItem);
      }

      // Check if all matched
      if (this.matchedPairs.size === this.currentItems.length) {
        // Delay celebration to let word feedback show
        setTimeout(() => {
          this.celebrate();
        }, 1200);
      }
    } else {
      // Wrong match
      this.errorsThisRound++;
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

  showWordFeedback(item) {
    const overlay = document.getElementById('word-feedback');
    if (!overlay) return;

    const wordText = overlay.querySelector('.word-text');
    const wordEmoji = overlay.querySelector('.word-emoji');

    if (wordText) wordText.textContent = item.word;
    if (wordEmoji) wordEmoji.textContent = item.right;

    overlay.classList.remove('hidden');

    // Speak the word
    audio.speak(item.word, this.language);

    // Auto-hide after delay
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 1500);
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

      // Award bananas: 1 for completing + 1 bonus for perfect round
      const perfectBonus = this.errorsThisRound === 0 ? 1 : 0;
      const bananasEarned = 1 + perfectBonus;
      progress.addBanana(bananasEarned);

      // Show banana reward animation
      this.showBananaReward(bananasEarned, perfectBonus > 0);

      // Auto-start new game after celebration
      setTimeout(() => {
        celebration.classList.add('hidden');
        this.newGame();
      }, 2500);
    }
  }

  showBananaReward(count, isPerfect) {
    const celebration = document.getElementById('matching-celebration');
    if (!celebration) return;

    // Find or create banana reward element
    let bananaReward = celebration.querySelector('.banana-reward-display');
    if (!bananaReward) {
      bananaReward = document.createElement('div');
      bananaReward.className = 'banana-reward-display';
      const celebrationContent = celebration.querySelector('.celebration-content');
      if (celebrationContent) {
        celebrationContent.appendChild(bananaReward);
      }
    }

    // Show reward
    const perfectText = isPerfect ? (this.language === 'es' ? ' ¡Perfecto!' : ' Идеально!') : '';
    bananaReward.innerHTML = `<span class="reward-bananas">+${count} 🍌${perfectText}</span>`;
    bananaReward.classList.add('show');

    setTimeout(() => {
      bananaReward.classList.remove('show');
    }, 2000);
  }
}

export const matchingGame = new MatchingGame();
