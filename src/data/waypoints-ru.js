// Waypoints for Russian (Cyrillic) alphabet tracing
// Coordinates are percentages (0-100) relative to canvas
// Each letter has one or more strokes, each stroke has waypoints to follow

export const russianWaypoints = {
  'А': {
    strokes: [
      // Stroke 1: Left diagonal
      { points: [{ x: 20, y: 85 }, { x: 50, y: 15 }] },
      // Stroke 2: Right diagonal
      { points: [{ x: 50, y: 15 }, { x: 80, y: 85 }] },
      // Stroke 3: Horizontal bar
      { points: [{ x: 32, y: 55 }, { x: 68, y: 55 }] }
    ]
  },
  'Б': {
    strokes: [
      // Stroke 1: Top horizontal
      { points: [{ x: 25, y: 15 }, { x: 75, y: 15 }] },
      // Stroke 2: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 3: Bottom bump
      { points: [{ x: 25, y: 50 }, { x: 60, y: 50 }, { x: 75, y: 65 }, { x: 60, y: 85 }, { x: 25, y: 85 }] }
    ]
  },
  'В': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Top bump
      { points: [{ x: 25, y: 15 }, { x: 55, y: 15 }, { x: 65, y: 30 }, { x: 55, y: 50 }, { x: 25, y: 50 }] },
      // Stroke 3: Bottom bump
      { points: [{ x: 25, y: 50 }, { x: 60, y: 50 }, { x: 75, y: 65 }, { x: 60, y: 85 }, { x: 25, y: 85 }] }
    ]
  },
  'Г': {
    strokes: [
      // Stroke 1: Top horizontal
      { points: [{ x: 25, y: 15 }, { x: 75, y: 15 }] },
      // Stroke 2: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] }
    ]
  },
  'Д': {
    strokes: [
      // Stroke 1: Left diagonal
      { points: [{ x: 15, y: 85 }, { x: 35, y: 15 }] },
      // Stroke 2: Top horizontal
      { points: [{ x: 35, y: 15 }, { x: 65, y: 15 }] },
      // Stroke 3: Right diagonal
      { points: [{ x: 65, y: 15 }, { x: 85, y: 85 }] },
      // Stroke 4: Bottom horizontal with legs
      { points: [{ x: 10, y: 85 }, { x: 90, y: 85 }] }
    ]
  },
  'Е': {
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
  'Ё': {
    strokes: [
      // Stroke 1: Left dot
      { points: [{ x: 40, y: 5 }, { x: 40, y: 8 }] },
      // Stroke 2: Right dot
      { points: [{ x: 60, y: 5 }, { x: 60, y: 8 }] },
      // Stroke 3: Vertical line
      { points: [{ x: 25, y: 18 }, { x: 25, y: 85 }] },
      // Stroke 4: Top horizontal
      { points: [{ x: 25, y: 18 }, { x: 75, y: 18 }] },
      // Stroke 5: Middle horizontal
      { points: [{ x: 25, y: 50 }, { x: 65, y: 50 }] },
      // Stroke 6: Bottom horizontal
      { points: [{ x: 25, y: 85 }, { x: 75, y: 85 }] }
    ]
  },
  'Ж': {
    strokes: [
      // Stroke 1: Center vertical
      { points: [{ x: 50, y: 15 }, { x: 50, y: 85 }] },
      // Stroke 2: Left upper diagonal
      { points: [{ x: 15, y: 15 }, { x: 50, y: 50 }] },
      // Stroke 3: Right upper diagonal
      { points: [{ x: 85, y: 15 }, { x: 50, y: 50 }] },
      // Stroke 4: Left lower diagonal
      { points: [{ x: 50, y: 50 }, { x: 15, y: 85 }] },
      // Stroke 5: Right lower diagonal
      { points: [{ x: 50, y: 50 }, { x: 85, y: 85 }] }
    ]
  },
  'З': {
    strokes: [
      // S-curve like 3
      { points: [{ x: 30, y: 20 }, { x: 50, y: 15 }, { x: 70, y: 25 }, { x: 70, y: 40 }, { x: 50, y: 50 }, { x: 70, y: 60 }, { x: 70, y: 75 }, { x: 50, y: 85 }, { x: 30, y: 80 }] }
    ]
  },
  'И': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Diagonal
      { points: [{ x: 25, y: 85 }, { x: 75, y: 15 }] },
      // Stroke 3: Right vertical
      { points: [{ x: 75, y: 15 }, { x: 75, y: 85 }] }
    ]
  },
  'Й': {
    strokes: [
      // Stroke 1: Breve mark
      { points: [{ x: 35, y: 8 }, { x: 50, y: 12 }, { x: 65, y: 8 }] },
      // Stroke 2: Left vertical
      { points: [{ x: 25, y: 20 }, { x: 25, y: 85 }] },
      // Stroke 3: Diagonal
      { points: [{ x: 25, y: 85 }, { x: 75, y: 20 }] },
      // Stroke 4: Right vertical
      { points: [{ x: 75, y: 20 }, { x: 75, y: 85 }] }
    ]
  },
  'К': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Upper diagonal
      { points: [{ x: 75, y: 15 }, { x: 25, y: 50 }] },
      // Stroke 3: Lower diagonal
      { points: [{ x: 25, y: 50 }, { x: 75, y: 85 }] }
    ]
  },
  'Л': {
    strokes: [
      // Stroke 1: Left diagonal
      { points: [{ x: 20, y: 85 }, { x: 50, y: 15 }] },
      // Stroke 2: Right diagonal
      { points: [{ x: 50, y: 15 }, { x: 80, y: 85 }] }
    ]
  },
  'М': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 15, y: 85 }, { x: 15, y: 15 }] },
      // Stroke 2: Left diagonal
      { points: [{ x: 15, y: 15 }, { x: 50, y: 55 }] },
      // Stroke 3: Right diagonal
      { points: [{ x: 50, y: 55 }, { x: 85, y: 15 }] },
      // Stroke 4: Right vertical
      { points: [{ x: 85, y: 15 }, { x: 85, y: 85 }] }
    ]
  },
  'Н': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Horizontal bar
      { points: [{ x: 25, y: 50 }, { x: 75, y: 50 }] },
      // Stroke 3: Right vertical
      { points: [{ x: 75, y: 15 }, { x: 75, y: 85 }] }
    ]
  },
  'О': {
    strokes: [
      // Single oval
      { points: [{ x: 50, y: 15 }, { x: 25, y: 25 }, { x: 20, y: 50 }, { x: 25, y: 75 }, { x: 50, y: 85 }, { x: 75, y: 75 }, { x: 80, y: 50 }, { x: 75, y: 25 }, { x: 50, y: 15 }] }
    ]
  },
  'П': {
    strokes: [
      // Stroke 1: Top horizontal
      { points: [{ x: 25, y: 15 }, { x: 75, y: 15 }] },
      // Stroke 2: Left vertical
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 3: Right vertical
      { points: [{ x: 75, y: 15 }, { x: 75, y: 85 }] }
    ]
  },
  'Р': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Bump
      { points: [{ x: 25, y: 15 }, { x: 60, y: 15 }, { x: 75, y: 30 }, { x: 60, y: 50 }, { x: 25, y: 50 }] }
    ]
  },
  'С': {
    strokes: [
      // Single curved stroke
      { points: [{ x: 75, y: 25 }, { x: 55, y: 15 }, { x: 35, y: 20 }, { x: 22, y: 40 }, { x: 22, y: 60 }, { x: 35, y: 80 }, { x: 55, y: 85 }, { x: 75, y: 75 }] }
    ]
  },
  'Т': {
    strokes: [
      // Stroke 1: Top horizontal
      { points: [{ x: 20, y: 15 }, { x: 80, y: 15 }] },
      // Stroke 2: Vertical
      { points: [{ x: 50, y: 15 }, { x: 50, y: 85 }] }
    ]
  },
  'У': {
    strokes: [
      // Stroke 1: Left diagonal to center
      { points: [{ x: 20, y: 15 }, { x: 50, y: 55 }] },
      // Stroke 2: Right diagonal through center and down
      { points: [{ x: 80, y: 15 }, { x: 35, y: 85 }] }
    ]
  },
  'Ф': {
    strokes: [
      // Stroke 1: Vertical line
      { points: [{ x: 50, y: 15 }, { x: 50, y: 85 }] },
      // Stroke 2: Left oval
      { points: [{ x: 50, y: 35 }, { x: 25, y: 40 }, { x: 20, y: 50 }, { x: 25, y: 60 }, { x: 50, y: 65 }] },
      // Stroke 3: Right oval
      { points: [{ x: 50, y: 35 }, { x: 75, y: 40 }, { x: 80, y: 50 }, { x: 75, y: 60 }, { x: 50, y: 65 }] }
    ]
  },
  'Х': {
    strokes: [
      // Stroke 1: Diagonal down-right
      { points: [{ x: 20, y: 15 }, { x: 80, y: 85 }] },
      // Stroke 2: Diagonal down-left
      { points: [{ x: 80, y: 15 }, { x: 20, y: 85 }] }
    ]
  },
  'Ц': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 25, y: 15 }, { x: 25, y: 85 }] },
      // Stroke 2: Bottom horizontal
      { points: [{ x: 25, y: 85 }, { x: 75, y: 85 }] },
      // Stroke 3: Right vertical
      { points: [{ x: 75, y: 15 }, { x: 75, y: 85 }] },
      // Stroke 4: Tail
      { points: [{ x: 75, y: 85 }, { x: 82, y: 95 }] }
    ]
  },
  'Ч': {
    strokes: [
      // Stroke 1: Left part
      { points: [{ x: 25, y: 15 }, { x: 25, y: 50 }, { x: 75, y: 50 }] },
      // Stroke 2: Right vertical
      { points: [{ x: 75, y: 15 }, { x: 75, y: 85 }] }
    ]
  },
  'Ш': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 15, y: 15 }, { x: 15, y: 85 }] },
      // Stroke 2: Middle vertical
      { points: [{ x: 50, y: 15 }, { x: 50, y: 85 }] },
      // Stroke 3: Right vertical
      { points: [{ x: 85, y: 15 }, { x: 85, y: 85 }] },
      // Stroke 4: Bottom horizontal
      { points: [{ x: 15, y: 85 }, { x: 85, y: 85 }] }
    ]
  },
  'Щ': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 12, y: 15 }, { x: 12, y: 85 }] },
      // Stroke 2: Middle vertical
      { points: [{ x: 45, y: 15 }, { x: 45, y: 85 }] },
      // Stroke 3: Right vertical
      { points: [{ x: 78, y: 15 }, { x: 78, y: 85 }] },
      // Stroke 4: Bottom horizontal
      { points: [{ x: 12, y: 85 }, { x: 85, y: 85 }] },
      // Stroke 5: Tail
      { points: [{ x: 85, y: 85 }, { x: 90, y: 95 }] }
    ]
  },
  'Ъ': {
    strokes: [
      // Stroke 1: Top left horizontal
      { points: [{ x: 15, y: 15 }, { x: 35, y: 15 }] },
      // Stroke 2: Vertical
      { points: [{ x: 35, y: 15 }, { x: 35, y: 85 }] },
      // Stroke 3: Bottom bump
      { points: [{ x: 35, y: 50 }, { x: 60, y: 50 }, { x: 75, y: 65 }, { x: 60, y: 85 }, { x: 35, y: 85 }] }
    ]
  },
  'Ы': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 20, y: 15 }, { x: 20, y: 85 }] },
      // Stroke 2: Left bump
      { points: [{ x: 20, y: 50 }, { x: 40, y: 50 }, { x: 50, y: 65 }, { x: 40, y: 85 }, { x: 20, y: 85 }] },
      // Stroke 3: Right vertical
      { points: [{ x: 75, y: 15 }, { x: 75, y: 85 }] }
    ]
  },
  'Ь': {
    strokes: [
      // Stroke 1: Vertical
      { points: [{ x: 30, y: 15 }, { x: 30, y: 85 }] },
      // Stroke 2: Bottom bump
      { points: [{ x: 30, y: 50 }, { x: 55, y: 50 }, { x: 70, y: 65 }, { x: 55, y: 85 }, { x: 30, y: 85 }] }
    ]
  },
  'Э': {
    strokes: [
      // Reversed C
      { points: [{ x: 25, y: 25 }, { x: 45, y: 15 }, { x: 65, y: 20 }, { x: 78, y: 40 }, { x: 78, y: 60 }, { x: 65, y: 80 }, { x: 45, y: 85 }, { x: 25, y: 75 }] },
      // Middle horizontal
      { points: [{ x: 40, y: 50 }, { x: 78, y: 50 }] }
    ]
  },
  'Ю': {
    strokes: [
      // Stroke 1: Left vertical
      { points: [{ x: 15, y: 15 }, { x: 15, y: 85 }] },
      // Stroke 2: Horizontal connector
      { points: [{ x: 15, y: 50 }, { x: 40, y: 50 }] },
      // Stroke 3: Right oval
      { points: [{ x: 60, y: 15 }, { x: 45, y: 25 }, { x: 40, y: 50 }, { x: 45, y: 75 }, { x: 60, y: 85 }, { x: 75, y: 75 }, { x: 80, y: 50 }, { x: 75, y: 25 }, { x: 60, y: 15 }] }
    ]
  },
  'Я': {
    strokes: [
      // Stroke 1: Right vertical
      { points: [{ x: 75, y: 15 }, { x: 75, y: 85 }] },
      // Stroke 2: Top bump (reversed P)
      { points: [{ x: 75, y: 15 }, { x: 40, y: 15 }, { x: 25, y: 30 }, { x: 40, y: 50 }, { x: 75, y: 50 }] },
      // Stroke 3: Leg
      { points: [{ x: 55, y: 50 }, { x: 25, y: 85 }] }
    ]
  }
};

export default russianWaypoints;
