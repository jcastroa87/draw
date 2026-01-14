// Translations for Gorila Studio
// Spanish and Russian interface text

export const translations = {
  es: {
    // Menu
    appTitle: 'Gorila Studio',
    letters: 'Letras',
    numbers: 'Números',
    coloring: 'Colorear',
    freeDraw: 'Dibujo Libre',
    matching: 'Asociar',
    
    // Common
    back: '←',
    clear: '🗑️ Borrar',
    save: '💾 Guardar',
    newGame: '🔄 Nuevo',
    
    // Tracing
    lettersTitle: 'Letras',
    numbersTitle: 'Números',
    
    // Coloring
    coloringTitle: 'Colorear',
    fillTool: 'Rellenar',
    brushTool: 'Pincel',
    undo: 'Deshacer',
    
    // Free draw
    freeDrawTitle: 'Dibujo Libre',
    eraser: 'Borrador',
    
    // Matching game
    matchingTitle: 'Asociar',
    matchingInstructionLetters: '¡Une cada letra con su dibujo!',
    matchingInstructionNumbers: '¡Une cada número con la cantidad!',
    matchingModeLetters: 'АБВ Letras',
    matchingModeNumbers: '123 Números',
    excellent: '¡Excelente!',
    
    // Celebration
    greatJob: '¡Muy bien!',
    
    // Loading
    loadingText: 'Preparando los crayones...',

    // Lockout
    timeToRest: '¡Ya es hora de descansar!',
    seeYouTomorrow: 'Nos vemos mañana 👋'
  },
  ru: {
    // Menu
    appTitle: 'Студия Гориллы',
    letters: 'Буквы',
    numbers: 'Цифры',
    coloring: 'Раскраска',
    freeDraw: 'Рисование',
    matching: 'Соединять',
    
    // Common
    back: '←',
    clear: '🗑️ Стереть',
    save: '💾 Сохранить',
    newGame: '🔄 Новая',
    
    // Tracing
    lettersTitle: 'Буквы',
    numbersTitle: 'Цифры',
    
    // Coloring
    coloringTitle: 'Раскраска',
    fillTool: 'Заливка',
    brushTool: 'Кисть',
    undo: 'Отмена',
    
    // Free draw
    freeDrawTitle: 'Рисование',
    eraser: 'Ластик',
    
    // Matching game
    matchingTitle: 'Соединять',
    matchingInstructionLetters: 'Соедини букву с картинкой!',
    matchingInstructionNumbers: 'Соедини число с количеством!',
    matchingModeLetters: 'АБВ Буквы',
    matchingModeNumbers: '123 Цифры',
    excellent: 'Отлично!',
    
    // Celebration
    greatJob: 'Молодец!',
    
    // Loading
    loadingText: 'Готовим карандаши...',
    
    // Lockout
    timeToRest: 'Пора отдыхать!',
    seeYouTomorrow: 'Увидимся завтра 👋'
  }
};

export function getTranslation(key, lang = 'es') {
  return translations[lang]?.[key] || translations.es[key] || key;
}

export default translations;
