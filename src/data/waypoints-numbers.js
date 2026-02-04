// Waypoints for number tracing (0-20)
// Coordinates are percentages (0-100) relative to canvas
// For multi-digit numbers, waypoints are adjusted to fit side by side

// Single digit waypoints (centered)
const digitWaypoints = {
  '0': {
    strokes: [
      // Oval shape
      { points: [{ x: 50, y: 15 }, { x: 30, y: 25 }, { x: 25, y: 50 }, { x: 30, y: 75 }, { x: 50, y: 85 }, { x: 70, y: 75 }, { x: 75, y: 50 }, { x: 70, y: 25 }, { x: 50, y: 15 }] }
    ]
  },
  '1': {
    strokes: [
      // Small diagonal at top
      { points: [{ x: 35, y: 25 }, { x: 50, y: 15 }] },
      // Vertical line
      { points: [{ x: 50, y: 15 }, { x: 50, y: 85 }] },
      // Bottom horizontal
      { points: [{ x: 35, y: 85 }, { x: 65, y: 85 }] }
    ]
  },
  '2': {
    strokes: [
      // Curved top and diagonal
      { points: [{ x: 25, y: 30 }, { x: 35, y: 18 }, { x: 55, y: 15 }, { x: 72, y: 25 }, { x: 75, y: 40 }, { x: 65, y: 55 }, { x: 25, y: 85 }] },
      // Bottom horizontal
      { points: [{ x: 25, y: 85 }, { x: 75, y: 85 }] }
    ]
  },
  '3': {
    strokes: [
      // Top curve
      { points: [{ x: 25, y: 25 }, { x: 45, y: 15 }, { x: 65, y: 20 }, { x: 70, y: 35 }, { x: 55, y: 50 }] },
      // Bottom curve
      { points: [{ x: 55, y: 50 }, { x: 70, y: 60 }, { x: 70, y: 75 }, { x: 55, y: 85 }, { x: 35, y: 82 }, { x: 25, y: 75 }] }
    ]
  },
  '4': {
    strokes: [
      // Vertical down then right
      { points: [{ x: 60, y: 15 }, { x: 25, y: 60 }] },
      // Horizontal
      { points: [{ x: 25, y: 60 }, { x: 75, y: 60 }] },
      // Right vertical
      { points: [{ x: 60, y: 15 }, { x: 60, y: 85 }] }
    ]
  },
  '5': {
    strokes: [
      // Top horizontal
      { points: [{ x: 70, y: 15 }, { x: 30, y: 15 }] },
      // Vertical down
      { points: [{ x: 30, y: 15 }, { x: 30, y: 45 }] },
      // Curved bottom
      { points: [{ x: 30, y: 45 }, { x: 55, y: 42 }, { x: 72, y: 55 }, { x: 72, y: 72 }, { x: 55, y: 85 }, { x: 35, y: 82 }, { x: 25, y: 75 }] }
    ]
  },
  '6': {
    strokes: [
      // Curved top into circle
      { points: [{ x: 65, y: 20 }, { x: 50, y: 15 }, { x: 32, y: 25 }, { x: 25, y: 45 }, { x: 25, y: 65 }, { x: 35, y: 82 }, { x: 55, y: 85 }, { x: 70, y: 75 }, { x: 72, y: 60 }, { x: 60, y: 48 }, { x: 40, y: 48 }, { x: 28, y: 58 }] }
    ]
  },
  '7': {
    strokes: [
      // Top horizontal
      { points: [{ x: 25, y: 15 }, { x: 75, y: 15 }] },
      // Diagonal down
      { points: [{ x: 75, y: 15 }, { x: 40, y: 85 }] }
    ]
  },
  '8': {
    strokes: [
      // Top circle
      { points: [{ x: 50, y: 50 }, { x: 35, y: 42 }, { x: 32, y: 30 }, { x: 40, y: 18 }, { x: 55, y: 15 }, { x: 68, y: 22 }, { x: 70, y: 35 }, { x: 60, y: 47 }, { x: 50, y: 50 }] },
      // Bottom circle
      { points: [{ x: 50, y: 50 }, { x: 65, y: 58 }, { x: 72, y: 70 }, { x: 65, y: 82 }, { x: 50, y: 85 }, { x: 35, y: 80 }, { x: 28, y: 68 }, { x: 35, y: 55 }, { x: 50, y: 50 }] }
    ]
  },
  '9': {
    strokes: [
      // Top circle
      { points: [{ x: 72, y: 42 }, { x: 60, y: 52 }, { x: 40, y: 52 }, { x: 28, y: 40 }, { x: 28, y: 25 }, { x: 40, y: 15 }, { x: 55, y: 15 }, { x: 70, y: 25 }, { x: 75, y: 45 }] },
      // Curved tail down
      { points: [{ x: 75, y: 45 }, { x: 75, y: 65 }, { x: 65, y: 82 }, { x: 45, y: 85 }] }
    ]
  }
};

// Helper to offset digit waypoints for multi-digit numbers
function offsetDigit(digit, offsetX, scale = 0.45) {
  const waypoints = digitWaypoints[digit];
  if (!waypoints) return null;

  return {
    strokes: waypoints.strokes.map(stroke => ({
      points: stroke.points.map(p => ({
        x: p.x * scale + offsetX,
        y: p.y
      }))
    }))
  };
}

// Generate waypoints for numbers 0-20
function generateNumberWaypoints() {
  const result = {};

  // Single digits 0-9 use centered waypoints
  for (let i = 0; i <= 9; i++) {
    result[i.toString()] = digitWaypoints[i.toString()];
  }

  // Double digits 10-20
  for (let i = 10; i <= 20; i++) {
    const str = i.toString();
    const firstDigit = str[0];
    const secondDigit = str[1];

    // First digit on left (offset 5, scale 0.45)
    const first = offsetDigit(firstDigit, 5, 0.45);
    // Second digit on right (offset 50, scale 0.45)
    const second = offsetDigit(secondDigit, 50, 0.45);

    if (first && second) {
      result[str] = {
        strokes: [...first.strokes, ...second.strokes]
      };
    }
  }

  return result;
}

export const numberWaypoints = generateNumberWaypoints();

export default numberWaypoints;
