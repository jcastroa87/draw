// Waypoints for Spanish alphabet tracing
// Coordinates are percentages (0-100) relative to canvas
// Each letter has one or more strokes, each stroke has waypoints to follow

export const spanishWaypoints = {
  'A': {
    strokes: [
      // Stroke 1: Left diagonal (bottom-left to top-center)
      { points: [{ x: 20, y: 85 }, { x: 50, y: 15 }] },
      // Stroke 2: Right diagonal (top-center to bottom-right)
      { points: [{ x: 50, y: 15 }, { x: 80, y: 85 }] },
      // Stroke 3: Horizontal bar
      { points: [{ x: 32, y: 55 }, { x: 68, y: 55 }] }
    ]
  },
  'B': {
    strokes: [
      // Stroke 1: Vertical line down
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Top bump
      { points: [{ x: 25, y: 15 }, { x: 55, y: 15 }, { x: 65, y: 30 }, { x: 55, y: 50 }, { x: 25, y: 50 }] },
      // Stroke 3: Bottom bump
      { points: [{ x: 25, y: 50 }, { x: 60, y: 50 }, { x: 75, y: 65 }, { x: 60, y: 85 }, { x: 25, y: 85 }] }
    ]
  },
  'C': {
    strokes: [
      // Single curved stroke
      { points: [{ x: 75, y: 25 }, { x: 55, y: 15 }, { x: 35, y: 20 }, { x: 22, y: 40 }, { x: 22, y: 60 }, { x: 35, y: 80 }, { x: 55, y: 85 }, { x: 75, y: 75 }] }
    ]
  },
  'D': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Curved part
      { points: [{ x: 25, y: 15 }, { x: 55, y: 15 }, { x: 75, y: 35 }, { x: 75, y: 65 }, { x: 55, y: 85 }, { x: 25, y: 85 }] }
    ]
  },
  'E': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Top horizontal
      { points: [{ x: 25, y: 15 }, { x: 75, y: 15 }] },
      // Stroke 3: Middle horizontal
      { points: [{ x: 25, y: 50 }, { x: 65, y: 50 }] },
      // Stroke 4: Bottom horizontal
      { points: [{ x: 25, y: 85 }, { x: 75, y: 85 }] }
    ]
  },
  'F': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Top horizontal
      { points: [{ x: 25, y: 15 }, { x: 75, y: 15 }] },
      // Stroke 3: Middle horizontal
      { points: [{ x: 25, y: 50 }, { x: 60, y: 50 }] }
    ]
  },
  'G': {
    strokes: [
      // Stroke 1: C-curve
      { points: [{ x: 75, y: 25 }, { x: 55, y: 15 }, { x: 35, y: 20 }, { x: 22, y: 40 }, { x: 22, y: 60 }, { x: 35, y: 80 }, { x: 55, y: 85 }, { x: 75, y: 75 }] },
      // Stroke 2: Horizontal bar
      { points: [{ x: 50, y: 55 }, { x: 75, y: 55 }, { x: 75, y: 75 }] }
    ]
  },
  'H': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Right vertical
      { points: [{ x: 75, y: 15 }, { x: 75, y: 85 }] },
      // Stroke 3: Horizontal bar
      { points: [{ x: 25, y: 50 }, { x: 75, y: 50 }] }
    ]
  },
  'I': {
    strokes: [
      // Stroke 1: Top horizontal
      { points: [{ x: 35, y: 15 }, { x: 65, y: 15 }] },
      // Stroke 2: Vertical line
      { points: [{ x: 50, y: 15 }, { x: 50, y: 85 }] },
      // Stroke 3: Bottom horizontal
      { points: [{ x: 35, y: 85 }, { x: 65, y: 85 }] }
    ]
  },
  'J': {
    strokes: [
      // Stroke 1: Top horizontal
      { points: [{ x: 35, y: 15 }, { x: 75, y: 15 }] },
      // Stroke 2: Vertical then curve
      { points: [{ x: 60, y: 15 }, { x: 60, y: 70 }, { x: 50, y: 85 }, { x: 35, y: 80 }] }
    ]
  },
  'K': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Upper diagonal
      { points: [{ x: 75, y: 15 }, { x: 25, y: 50 }] },
      // Stroke 3: Lower diagonal
      { points: [{ x: 25, y: 50 }, { x: 75, y: 85 }] }
    ]
  },
  'L': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Horizontal line
      { points: [{ x: 25, y: 85 }, { x: 75, y: 85 }] }
    ]
  },
  'M': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 15, y: 85 }, { x: 15, y: 15 }] },
      // Stroke 2: Left diagonal down
      { points: [{ x: 15, y: 15 }, { x: 50, y: 55 }] },
      // Stroke 3: Right diagonal up
      { points: [{ x: 50, y: 55 }, { x: 85, y: 15 }] },
      // Stroke 4: Right vertical
      { points: [{ x: 85, y: 15 }, { x: 85, y: 85 }] }
    ]
  },
  'N': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 25, y: 85 }, { x: 25, y: 15 }] },
      // Stroke 2: Diagonal
      { points: [{ x: 25, y: 15 }, { x: 75, y: 85 }] },
      // Stroke 3: Right vertical
      { points: [{ x: 75, y: 85 }, { x: 75, y: 15 }] }
    ]
  },
  'Ñ': {
    strokes: [
      // Stroke 1: Tilde
      { points: [{ x: 35, y: 8 }, { x: 50, y: 5 }, { x: 65, y: 8 }] },
      // Stroke 2: Left vertical
      { points: [{ x: 25, y: 85 }, { x: 25, y: 20 }] },
      // Stroke 3: Diagonal
      { points: [{ x: 25, y: 20 }, { x: 75, y: 85 }] },
      // Stroke 4: Right vertical
      { points: [{ x: 75, y: 85 }, { x: 75, y: 20 }] }
    ]
  },
  'O': {
    strokes: [
      // Single oval stroke
      { points: [{ x: 50, y: 15 }, { x: 25, y: 25 }, { x: 20, y: 50 }, { x: 25, y: 75 }, { x: 50, y: 85 }, { x: 75, y: 75 }, { x: 80, y: 50 }, { x: 75, y: 25 }, { x: 50, y: 15 }] }
    ]
  },
  'P': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Bump
      { points: [{ x: 25, y: 15 }, { x: 60, y: 15 }, { x: 75, y: 30 }, { x: 60, y: 50 }, { x: 25, y: 50 }] }
    ]
  },
  'Q': {
    strokes: [
      // Stroke 1: Oval
      { points: [{ x: 50, y: 15 }, { x: 25, y: 25 }, { x: 20, y: 50 }, { x: 25, y: 75 }, { x: 50, y: 85 }, { x: 75, y: 75 }, { x: 80, y: 50 }, { x: 75, y: 25 }, { x: 50, y: 15 }] },
      // Stroke 2: Tail
      { points: [{ x: 60, y: 70 }, { x: 80, y: 90 }] }
    ]
  },
  'R': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Bump
      { points: [{ x: 25, y: 15 }, { x: 60, y: 15 }, { x: 75, y: 30 }, { x: 60, y: 50 }, { x: 25, y: 50 }] },
      // Stroke 3: Leg
      { points: [{ x: 45, y: 50 }, { x: 75, y: 85 }] }
    ]
  },
  'S': {
    strokes: [
      // Single S-curve
      { points: [{ x: 70, y: 22 }, { x: 55, y: 15 }, { x: 35, y: 18 }, { x: 28, y: 30 }, { x: 35, y: 45 }, { x: 50, y: 50 }, { x: 65, y: 55 }, { x: 72, y: 70 }, { x: 65, y: 82 }, { x: 45, y: 85 }, { x: 30, y: 78 }] }
    ]
  },
  'T': {
    strokes: [
      // Stroke 1: Horizontal top
      { points: [{ x: 20, y: 15 }, { x: 80, y: 15 }] },
      // Stroke 2: Vertical line
      { points: [{ x: 50, y: 15 }, { x: 50, y: 85 }] }
    ]
  },
  'U': {
    strokes: [
      // Single U-stroke
      { points: [{ x: 25, y: 15 }, { x: 25, y: 65 }, { x: 35, y: 80 }, { x: 50, y: 85 }, { x: 65, y: 80 }, { x: 75, y: 65 }, { x: 75, y: 15 }] }
    ]
  },
  'V': {
    strokes: [
      // Stroke 1: Left diagonal
      { points: [{ x: 20, y: 15 }, { x: 50, y: 85 }] },
      // Stroke 2: Right diagonal
      { points: [{ x: 50, y: 85 }, { x: 80, y: 15 }] }
    ]
  },
  'W': {
    strokes: [
      // Stroke 1: First down
      { points: [{ x: 10, y: 15 }, { x: 30, y: 85 }] },
      // Stroke 2: First up
      { points: [{ x: 30, y: 85 }, { x: 50, y: 40 }] },
      // Stroke 3: Second down
      { points: [{ x: 50, y: 40 }, { x: 70, y: 85 }] },
      // Stroke 4: Second up
      { points: [{ x: 70, y: 85 }, { x: 90, y: 15 }] }
    ]
  },
  'X': {
    strokes: [
      // Stroke 1: Diagonal down-right
      { points: [{ x: 20, y: 15 }, { x: 80, y: 85 }] },
      // Stroke 2: Diagonal down-left
      { points: [{ x: 80, y: 15 }, { x: 20, y: 85 }] }
    ]
  },
  'Y': {
    strokes: [
      // Stroke 1: Left diagonal to center
      { points: [{ x: 20, y: 15 }, { x: 50, y: 50 }] },
      // Stroke 2: Right diagonal to center
      { points: [{ x: 80, y: 15 }, { x: 50, y: 50 }] },
      // Stroke 3: Vertical down
      { points: [{ x: 50, y: 50 }, { x: 50, y: 85 }] }
    ]
  },
  'Z': {
    strokes: [
      // Stroke 1: Top horizontal
      { points: [{ x: 20, y: 15 }, { x: 80, y: 15 }] },
      // Stroke 2: Diagonal
      { points: [{ x: 80, y: 15 }, { x: 20, y: 85 }] },
      // Stroke 3: Bottom horizontal
      { points: [{ x: 20, y: 85 }, { x: 80, y: 85 }] }
    ]
  }
};

export default spanishWaypoints;
