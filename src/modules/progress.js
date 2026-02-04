// Progress Module - Handles persistence and reward tracking
// Saves progress to localStorage for the iPad PWA

const STORAGE_KEY = 'gorila-studio-progress';

class ProgressModule {
  constructor() {
    this.data = {
      bananas: 0,
      letters: {
        es: {}, // { 'A': 'completed', 'B': 'attempted', ... }
        ru: {}
      },
      numbers: {}, // { '0': 'completed', '1': 'attempted', ... }
      lastPlayed: null
    };

    this.listeners = [];
    this.load();
  }

  // Load progress from localStorage
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.data = { ...this.data, ...parsed };
      }
    } catch (e) {
      console.warn('Could not load progress:', e);
    }
  }

  // Save progress to localStorage
  save() {
    try {
      this.data.lastPlayed = new Date().toISOString();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Could not save progress:', e);
    }
  }

  // Add a listener for progress changes
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // Notify all listeners of changes
  notifyListeners() {
    this.listeners.forEach(callback => callback(this.data));
  }

  // Get total bananas
  getBananas() {
    return this.data.bananas;
  }

  // Add bananas (called when completing a letter/number)
  addBanana(count = 1) {
    this.data.bananas += count;
    this.save();
    this.notifyListeners();
    return this.data.bananas;
  }

  // Mark a letter as attempted (started but not completed)
  markAttempted(char, type = 'letters', language = 'es') {
    if (type === 'letters') {
      if (!this.data.letters[language]) {
        this.data.letters[language] = {};
      }
      // Don't downgrade from completed to attempted
      if (this.data.letters[language][char] !== 'completed') {
        this.data.letters[language][char] = 'attempted';
        this.save();
        this.notifyListeners();
      }
    } else if (type === 'numbers') {
      if (this.data.numbers[char] !== 'completed') {
        this.data.numbers[char] = 'attempted';
        this.save();
        this.notifyListeners();
      }
    }
  }

  // Mark a letter/number as completed
  markCompleted(char, type = 'letters', language = 'es') {
    if (type === 'letters') {
      if (!this.data.letters[language]) {
        this.data.letters[language] = {};
      }
      this.data.letters[language][char] = 'completed';
    } else if (type === 'numbers') {
      this.data.numbers[char] = 'completed';
    }
    this.save();
    this.notifyListeners();
  }

  // Get status of a letter/number ('completed', 'attempted', or null)
  getStatus(char, type = 'letters', language = 'es') {
    if (type === 'letters') {
      return this.data.letters[language]?.[char] || null;
    } else if (type === 'numbers') {
      return this.data.numbers[char] || null;
    }
    return null;
  }

  // Get count of completed items
  getCompletedCount(type = 'letters', language = 'es') {
    let items;
    if (type === 'letters') {
      items = this.data.letters[language] || {};
    } else {
      items = this.data.numbers;
    }
    return Object.values(items).filter(status => status === 'completed').length;
  }

  // Get count of attempted items (including completed)
  getAttemptedCount(type = 'letters', language = 'es') {
    let items;
    if (type === 'letters') {
      items = this.data.letters[language] || {};
    } else {
      items = this.data.numbers;
    }
    return Object.keys(items).length;
  }

  // Get all progress data for a type
  getAllProgress(type = 'letters', language = 'es') {
    if (type === 'letters') {
      return this.data.letters[language] || {};
    } else {
      return this.data.numbers;
    }
  }

  // Reset all progress (hidden feature for parents)
  reset() {
    this.data = {
      bananas: 0,
      letters: { es: {}, ru: {} },
      numbers: {},
      lastPlayed: null
    };
    this.save();
    this.notifyListeners();
  }

  // Get summary for display in menu
  getSummary(type, language = 'es', total) {
    const completed = this.getCompletedCount(type, language);
    return { completed, total };
  }
}

// Export singleton instance
export const progress = new ProgressModule();
export default progress;
