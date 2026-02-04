# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gorila Studio is an educational drawing application for children, built with vanilla JavaScript and Canvas API. It features letter/number tracing, coloring books, free drawing, and matching games with support for Spanish and Russian languages.

## Commands

```bash
npm run dev      # Start Vite development server
npm run build    # Production build
npm run preview  # Preview production build
```

No testing or linting is configured.

## Architecture

### Entry Points
- `index.html` - Single-page entry with all screen HTML structure
- `src/main.js` - GorilaStudio class orchestrates all modules and handles navigation

### Module Pattern
Each feature is a standalone ES6 class in `src/modules/` with consistent interface:
- `init(canvasId)` - Initialize canvas and state
- `setup()` - Configure event listeners
- `render()` - Draw to canvas

Modules:
- `tracing.js` - Letter and number tracing with pixel-based completion detection
- `coloring.js` - Fill bucket and brush tools for coloring templates
- `freedraw.js` - Free drawing canvas with undo history
- `matching.js` - Letter-to-picture and number-to-quantity games
- `audio.js` - Sound effects via Web Audio API and speech via Web Speech API

### Data Layer
`src/data/` contains content data:
- `translations.js` - UI text for Spanish (es) and Russian (ru)
- `letters-es.js` / `letters-ru.js` - Alphabet with associated words and emojis
- `numbers.js` - Numbers 0-20 with translations

### Configuration
`src/settings.js` - Centralized SETTINGS object for all configurable values:
- Session timer duration (parental lockout)
- Tracing completion threshold (default 85%)
- Brush sizes, colors, font settings

## Key Implementation Details

### Canvas Rendering
- Uses off-screen canvases for pixel-based tracing detection
- DPI-aware scaling for retina/mobile displays
- Limited undo history (20-30 states) for memory management

### Screen Navigation
- Screens use `.screen` class with `.active` for visibility
- `showScreen(screenId)` handles transitions and canvas initialization

### Session Management
- Configurable timer locks app after set duration
- Lockout screen displayed when time expires

### Internationalization
- `t(key)` method returns translated text
- Language affects UI text, alphabet data, and speech synthesis
