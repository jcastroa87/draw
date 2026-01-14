// Numbers Data for Number Tracing
// Contains configurable range of numbers
import { SETTINGS } from '../settings.js';

// ═══════════════════════════════════════════════════════════════════
// CONFIGURABLE SETTING - Loaded from src/settings.js
// ═══════════════════════════════════════════════════════════════════
const MAX_NUMBER = SETTINGS.NUMBERS.MAX_NUMBER;

// Spanish number words
const spanishNumbers = [
  'Cero', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve',
  'Diez', 'Once', 'Doce', 'Trece', 'Catorce', 'Quince', 'Dieciséis', 'Diecisiete', 'Dieciocho', 'Diecinueve',
  'Veinte'
];

// Russian number words
const russianNumbers = [
  'Ноль', 'Один', 'Два', 'Три', 'Четыре', 'Пять', 'Шесть', 'Семь', 'Восемь', 'Девять',
  'Десять', 'Одиннадцать', 'Двенадцать', 'Тринадцать', 'Четырнадцать', 'Пятнадцать', 'Шестнадцать', 'Семнадцать', 'Восемнадцать', 'Девятнадцать',
  'Двадцать'
];

// Helper to get word for a number
function getSpanishWord(n) {
  if (n < spanishNumbers.length) return spanishNumbers[n];
  return n.toString();
}

function getRussianWord(n) {
  if (n < russianNumbers.length) return russianNumbers[n];
  return n.toString();
}

// Generate numbers array dynamically
export const numbers = [];
for (let i = 0; i <= MAX_NUMBER; i++) {
  numbers.push({
    number: i,
    word: getSpanishWord(i),
    wordRu: getRussianWord(i),
    count: i
  });
}

export default numbers;
