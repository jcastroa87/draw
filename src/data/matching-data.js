// Matching Game Data for Gorila Studio
// Contains multilingual data for colors, shapes, and animals modes

// Colors - 8 basic colors
export const COLORS_DATA = {
  es: [
    { id: 'red', left: 'Rojo', right: '🍎🍓', word: 'Rojo' },
    { id: 'blue', left: 'Azul', right: '🔵💙', word: 'Azul' },
    { id: 'yellow', left: 'Amarillo', right: '🌻⭐', word: 'Amarillo' },
    { id: 'green', left: 'Verde', right: '🥒🍀', word: 'Verde' },
    { id: 'orange', left: 'Naranja', right: '🍊🥕', word: 'Naranja' },
    { id: 'purple', left: 'Morado', right: '🍇🔮', word: 'Morado' },
    { id: 'pink', left: 'Rosa', right: '🌸💗', word: 'Rosa' },
    { id: 'brown', left: 'Marrón', right: '🐻🍫', word: 'Marrón' }
  ],
  ru: [
    { id: 'red', left: 'Красный', right: '🍎🍓', word: 'Красный' },
    { id: 'blue', left: 'Синий', right: '🔵💙', word: 'Синий' },
    { id: 'yellow', left: 'Жёлтый', right: '🌻⭐', word: 'Жёлтый' },
    { id: 'green', left: 'Зелёный', right: '🥒🍀', word: 'Зелёный' },
    { id: 'orange', left: 'Оранжевый', right: '🍊🥕', word: 'Оранжевый' },
    { id: 'purple', left: 'Фиолетовый', right: '🍇🔮', word: 'Фиолетовый' },
    { id: 'pink', left: 'Розовый', right: '🌸💗', word: 'Розовый' },
    { id: 'brown', left: 'Коричневый', right: '🐻🍫', word: 'Коричневый' }
  ]
};

// Shapes - 6 basic shapes
export const SHAPES_DATA = {
  es: [
    { id: 'circle', left: '⭕', right: '🍊⚽🌕', word: 'Círculo' },
    { id: 'square', left: '⬛', right: '📦🎁📺', word: 'Cuadrado' },
    { id: 'triangle', left: '🔺', right: '🔼🏔️⛺', word: 'Triángulo' },
    { id: 'star', left: '⭐', right: '🌟✨💫', word: 'Estrella' },
    { id: 'heart', left: '❤️', right: '💕💗💖', word: 'Corazón' },
    { id: 'diamond', left: '🔷', right: '💎💠🔶', word: 'Diamante' }
  ],
  ru: [
    { id: 'circle', left: '⭕', right: '🍊⚽🌕', word: 'Круг' },
    { id: 'square', left: '⬛', right: '📦🎁📺', word: 'Квадрат' },
    { id: 'triangle', left: '🔺', right: '🔼🏔️⛺', word: 'Треугольник' },
    { id: 'star', left: '⭐', right: '🌟✨💫', word: 'Звезда' },
    { id: 'heart', left: '❤️', right: '💕💗💖', word: 'Сердце' },
    { id: 'diamond', left: '🔷', right: '💎💠🔶', word: 'Ромб' }
  ]
};

// Animals with their sounds/onomatopoeia - 10 animals
export const ANIMALS_DATA = {
  es: [
    { id: 'dog', left: '🐶', right: 'Guau', word: 'Perro' },
    { id: 'cat', left: '🐱', right: 'Miau', word: 'Gato' },
    { id: 'cow', left: '🐮', right: 'Muuu', word: 'Vaca' },
    { id: 'pig', left: '🐷', right: 'Oink', word: 'Cerdo' },
    { id: 'duck', left: '🦆', right: 'Cuac', word: 'Pato' },
    { id: 'rooster', left: '🐓', right: 'Quiquiriquí', word: 'Gallo' },
    { id: 'sheep', left: '🐑', right: 'Beee', word: 'Oveja' },
    { id: 'frog', left: '🐸', right: 'Croac', word: 'Rana' },
    { id: 'bird', left: '🐦', right: 'Pío pío', word: 'Pájaro' },
    { id: 'lion', left: '🦁', right: 'Roar', word: 'León' }
  ],
  ru: [
    { id: 'dog', left: '🐶', right: 'Гав', word: 'Собака' },
    { id: 'cat', left: '🐱', right: 'Мяу', word: 'Кошка' },
    { id: 'cow', left: '🐮', right: 'Муу', word: 'Корова' },
    { id: 'pig', left: '🐷', right: 'Хрю', word: 'Свинья' },
    { id: 'duck', left: '🦆', right: 'Кря', word: 'Утка' },
    { id: 'rooster', left: '🐓', right: 'Ку-ка-ре-ку', word: 'Петух' },
    { id: 'sheep', left: '🐑', right: 'Бее', word: 'Овца' },
    { id: 'frog', left: '🐸', right: 'Ква', word: 'Лягушка' },
    { id: 'bird', left: '🐦', right: 'Чик-чирик', word: 'Птица' },
    { id: 'lion', left: '🦁', right: 'Рычит', word: 'Лев' }
  ]
};

// Instructions for each mode
export const MODE_INSTRUCTIONS = {
  letters: {
    es: '¡Une cada letra con su dibujo!',
    ru: 'Соедини букву с картинкой!'
  },
  numbers: {
    es: '¡Une cada número con la cantidad!',
    ru: 'Соедини число с количеством!'
  },
  colors: {
    es: '¡Une cada color con su dibujo!',
    ru: 'Соедини цвет с картинкой!'
  },
  shapes: {
    es: '¡Une cada forma con los objetos!',
    ru: 'Соедини фигуру с предметами!'
  },
  animals: {
    es: '¡Une cada animal con su sonido!',
    ru: 'Соедини животное со звуком!'
  }
};
