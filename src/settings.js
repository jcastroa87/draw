// Centralized application settings
// Adjust these values to configure the application behavior

export const SETTINGS = {
  // Application-wide settings
  APP: {
    SESSION_LIMIT_MINUTES: 20, // Time in minutes before lockout
    DEFAULT_LANGUAGE: 'es',
    SOUND_ENABLED_BY_DEFAULT: true
  },

  // Tracing module configuration
  TRACING: {
    COMPLETION_THRESHOLD: 0.85, // 0.0 to 1.0 (85% coverage required)
    USER_LINE_WIDTH: 35,        // Brush thickness in pixels (reduced for better visibility)
    GUIDE_COLOR: '#E0E0E0',     // Color of the letter guide
    STROKE_COLOR: '#333333',    // Color of the user's stroke
    FONT_FAMILY: 'Arial Rounded MT Bold, Arial, sans-serif'
  },

  // Numbers module configuration
  NUMBERS: {
    MAX_NUMBER: 20 // Maximum number available (e.g. 10, 20, 100)
  },

  // Painting/Coloring palette
  PALETTE: [
    '#FF6B6B', // Red
    '#FF8E53', // Orange
    '#FFE135', // Yellow
    '#4CAF50', // Green
    '#2196F3', // Blue
    '#9C27B0', // Purple
    '#E91E63', // Pink
    '#795548', // Brown
    '#607D8B', // Gray
    '#000000', // Black
    '#FFFFFF', // White
    '#8B5A2B'  // Dark brown
  ]
};
