# 🔵 Gonzalo Piovi — Landing Page

Landing profesional para jugador de fútbol, construida con React + Vite + Chakra UI + GSAP + Framer Motion.

---

## 🚀 Setup

```bash
npm install
npm run dev
```

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Hero/
│   │   └── Hero.jsx              # Tipografía mega + foto flotante + marquee
│   ├── Transition/
│   │   └── CinematicTransition.jsx  # Scroll pinned + cambio de fondo animado
│   ├── Stats/
│   │   └── StatsSection.jsx      # Ficha técnica + barras animadas + clubes
│   ├── Videos/
│   │   └── VideosSection.jsx     # Grid videos con preview hover + modal
│   ├── Press/
│   │   └── PressSection.jsx      # Tarjetas de prensa + marquee de medios
│   ├── Contact/
│   │   └── ContactSection.jsx    # Form de contacto + redes sociales
│   └── UI/
│       ├── Navbar.jsx
│       ├── Footer.jsx
│       └── CustomCursor.jsx
├── data/
│   └── playerData.js             # ← EDITAR AQUÍ los datos del jugador
├── styles/
│   └── globals.css
├── App.jsx
├── main.jsx
└── theme.js                      # Paleta de colores Chakra UI
```

---

## ⚙️ Personalización

### Datos del jugador
Editar `src/data/playerData.js`:
- Nombre, posición, stats
- Historial de clubes con colores
- Videos (src y previewSrc)
- Links de prensa

### Imagen del jugador
Colocar la imagen en `public/player.png` (fondo transparente recomendado).
Luego en `App.jsx` cambiar `PLAYER_IMAGE` al path correcto.

### Logos de clubes
Colocar en `public/logos/`:
- `cruzazul.png`
- `racing.png`
- `colon.png`
- `union.png`

### Videos
Colocar en `public/videos/`:
- `highlight1.mp4` — video completo
- `preview1.mp4` — clip corto (5-8 segundos, sin audio)
- Repetir para cada video

### Colores del tema
Editar `src/theme.js`:
```js
brand: {
  blue: '#0057B8',   // Azul Cruz Azul
  bone: '#F5F0E8',   // Fondo transición hueso
  gold: '#C9A84C',   // Acento dorado
}
```

---

## 🎨 Secciones

| # | Sección | Tecnología clave |
|---|---------|-----------------|
| 01 | Hero | GSAP stagger letters + CSS float animation |
| 02 | Cinematic Transition | GSAP ScrollTrigger pin + color interpolation |
| 03 | Stats & Perfil | GSAP ScrollTrigger + animated bars |
| 04 | Videos | GSAP 3D tilt + Chakra Modal + video preview |
| 05 | Prensa | GSAP stagger + marquee de medios |
| 06 | Contacto | Framer Motion form + GSAP scroll reveal |

---

## 🗓️ Roadmap (próximas fases)

- [ ] Panel de Admin (cambio de imágenes, videos, colores, tema)
- [ ] Integración EmailJS para el formulario de contacto
- [ ] Galería de fotos en lightbox
- [ ] Soporte multilingual (ES / EN)
- [ ] SEO y Open Graph tags
- [ ] Analytics integration

---

## 🛠️ Stack técnico

- **React 18** + **Vite**
- **Chakra UI v2** — sistema de diseño
- **GSAP 3** + **ScrollTrigger** — animaciones de scroll
- **Framer Motion** — transiciones de UI
- Fuentes: **Bebas Neue** (display) + **Barlow Condensed** + **Barlow** (body)
