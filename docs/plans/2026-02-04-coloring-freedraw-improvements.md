# Diseño: Mejoras Colorear y Dibujo Libre

**Fecha:** 2026-02-04
**Estado:** Aprobado

## Resumen

Agregar stickers, pincel arcoíris, más plantillas de colorear y fondos para dibujo libre.

---

## 1. Sistema de Stickers

### Funcionamiento
- Botón 🎨 "Stickers" en barra de herramientas
- Panel con emojis en fila scrolleable
- Selector de tamaño: S (40px) / M (70px) / L (110px)
- Toque en canvas coloca el sticker seleccionado

### Emojis (~20)
```
🌟 ⭐ 🌈 🦋 🐝 🌸 🌺 🍎 🍌 🎈
🎀 ❤️ 💖 🔵 🟢 🟡 🐱 🐶 🦁 🐸
```

### Disponible en
- Colorear
- Dibujo Libre

---

## 2. Pincel Arcoíris

### Funcionamiento
- Botón 🌈 junto a herramientas
- Alterna entre modo arcoíris y color sólido
- Colores: rojo → naranja → amarillo → verde → azul → violeta → rosa
- Cambia color cada ~30px de distancia

### Implementación
- Reutilizar `RAINBOW_COLORS` del módulo de trazado
- Botón se resalta cuando está activo

### Disponible en
- Colorear (modo pincel)
- Dibujo Libre

---

## 3. Plantillas Nuevas para Colorear

### Animales (7)
- Gato (Кошка)
- Perro (Собака)
- Pez (Рыба)
- Mariposa (Бабочка)
- Elefante (Слон)
- León (Лев)
- Tiburón (Акула)

### Vehículos (5)
- Carro (Машина)
- Avión (Самолёт)
- Barco (Корабль)
- Tren (Поезд)
- Cohete (Ракета)

### Frutas (3)
- Manzana (Яблоко)
- Naranja (Апельсин)
- Sandía (Арбуз)

### Personajes (4)
- Niño (Мальчик)
- Niña (Девочка)
- Robot (Робот)
- Monstruo (Монстр)

### Total
24 plantillas (6 actuales + 18 nuevas)

---

## 4. Fondos para Dibujo Libre

### Naturaleza (4)
- Playa: arena + mar + cielo
- Bosque: árboles + pasto
- Cielo: nubes + sol
- Bajo el mar: agua azul + burbujas + algas

### Temáticos (4)
- Espacio: negro + estrellas + planetas
- Ciudad: edificios silueta
- Granja: cerca + granero
- Castillo: torres + bandera

### Simples (2)
- Degradado arcoíris
- Degradado atardecer

### Marcos (2)
- Marco de flores
- Marco de estrellas

### Navegación
- Botón "🖼️ Fondo" abre picker de fondos
- Opción "Blanco" como default

---

## Archivos a Modificar

### Módulos
- `src/modules/coloring.js` - Stickers, pincel arcoíris, plantillas nuevas
- `src/modules/freedraw.js` - Stickers, pincel arcoíris, fondos

### UI
- `index.html` - Botones stickers, arcoíris, selector fondos
- `src/style.css` - Estilos panel stickers, picker fondos

### Integración
- `src/main.js` - Event handlers nuevos botones
