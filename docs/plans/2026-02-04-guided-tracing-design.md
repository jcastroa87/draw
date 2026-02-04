# Diseño: Sistema de Trazado Guiado

**Fecha:** 2026-02-04
**Estado:** Aprobado
**Objetivo:** Mejorar la experiencia de trazado de letras/números para niños de 3 años

## Problema

El sistema actual marca las letras como completadas antes de que el niño termine de trazarlas correctamente. Usa detección de cobertura de píxeles (85%) que no valida la forma ni dirección del trazo.

## Solución

Sistema de trazado guiado con puntos que enseña la dirección correcta y espera pacientemente al niño.

---

## 1. Flujo de Trazado

### Demo Automático (2-3 segundos)
- La letra se dibuja sola con animación suave
- Estela arcoíris muestra el camino
- Al terminar, el trazo demo desaparece

### Modo Trazado Activo
- Punto brillante (⭐) aparece en el inicio
- El punto pulsa suavemente para llamar la atención
- El niño debe trazar cerca del punto para que avance

### Comportamiento del Punto Guía
- Si el niño traza lejos del punto, el trazo aparece pero el punto no avanza
- Cuando el trazo pasa cerca del punto (radio ~50px), avanza al siguiente waypoint
- Permite que el niño vaya a su ritmo sin presión de tiempo

### Estela Arcoíris
- El trazo cambia de color gradualmente: rojo → naranja → amarillo → verde → azul → violeta
- Hace el trazado más divertido visualmente

---

## 2. Sistema de Recompensas

### Celebración Breve
- Sonido alegre + letra brilla con efecto dorado
- Aparece "+1 🍌" flotando hacia arriba
- Duración ~1 segundo, no interrumpe el flujo

### Contador en Pantalla
- En el header: "🍌 12" mostrando bananas acumuladas
- Se actualiza con animación

### Progreso en Menú Principal
- Cada tarjeta muestra: "ABC ✓ 15/27"
- Progreso guardado en `localStorage`

### Indicador de Letras en Picker
- ✓ verde = completada
- ○ amarillo = intentada
- (vacío) = sin intentar

### Persistencia
- Progreso guardado localmente
- Opción "reiniciar progreso" oculta (toque largo en título, para padres)

---

## 3. Mejoras de Interfaz para iPad

### Botones Más Grandes
- Controles aumentan de 48px a 64px mínimo
- Mayor espaciado entre botones
- Área táctil mínima 60x60pt (recomendación Apple para niños)

### Nuevo Botón Demo
- Botón 🎬 para repetir la animación demo

### Picker Mejorado
- Celdas mínimo 60x60px
- Indicadores visuales de progreso
- Scroll suave con inercia

### Mapa de Progreso Visual
```
┌─────────────────────────────────┐
│  A✓  B✓  C○  D   E   F   G     │
│  H   I   J   K   L   M   N     │
└─────────────────────────────────┘
```

---

## 4. Estructura de Datos

### Waypoints por Letra

```javascript
{
  letter: "A",
  strokes: [
    // Trazo 1: línea izquierda
    { points: [{x: 20, y: 90}, {x: 50, y: 10}] },
    // Trazo 2: línea derecha
    { points: [{x: 50, y: 10}, {x: 80, y: 90}] },
    // Trazo 3: línea horizontal
    { points: [{x: 30, y: 55}, {x: 70, y: 55}] }
  ]
}
```

### Consideraciones
- Coordenadas en porcentaje (0-100) para escalar
- Letras con múltiples trazos: A, E, F, H, T, etc.
- Entre trazos, punto guía "salta" con animación
- Español: 27 letras + Ñ
- Ruso: 33 letras cirílicas
- Números: 0-20

---

## Archivos a Modificar/Crear

### Nuevos
- `src/data/waypoints-es.js` - Waypoints alfabeto español
- `src/data/waypoints-ru.js` - Waypoints alfabeto ruso
- `src/data/waypoints-numbers.js` - Waypoints números
- `src/modules/progress.js` - Sistema de progreso y persistencia

### Modificar
- `src/modules/tracing.js` - Lógica de trazado guiado
- `src/settings.js` - Nuevas configuraciones
- `src/style.css` - Botones más grandes, animaciones
- `src/main.js` - Integrar sistema de progreso
- `index.html` - Nuevos elementos UI (contador bananas, botón demo)
