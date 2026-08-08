import { extendTheme } from '@chakra-ui/react'

// ─── PALETA DE MARCA ─────────────────────────────────────────────
// Construida sobre la identidad visual de Cruz Azul:
//   · Azul marino del anillo del escudo → familia `navy`
//   · Azul vivo de la camiseta          → familia `blue`
//   · Rojo del recuadro del escudo      → familia `red` (acento puntual)
//   · Blanco roto del escudo            → familia `bone`
//
// El fondo (`dark`) se mantiene sin cambios respecto al diseño original.
// Las escalas van de más oscuro a más claro para que el nombre indique
// el peso visual: navyDeep < navy < navyLight, blueDark < blue < blueLight.

const scale = {
  // ── Base oscura ────────────────────────────────────────────────
  dark: '#080C12',        // fondo del sitio — no cambiar
  darkDeep: 'rgba(9, 18, 34, 0.55)',    // fondo de secciones y paneles oscuros
  surfaceDeep: '#0D1420', // superficie apenas elevada
  surface: '#111A28',     // paneles y tarjetas sobre el fondo
  line: '#1C2739',        // bordes y reglas sutiles

  // ── Azules: del navy del escudo al azul de la camiseta ────────
  navyDeep: '#0A1834',    // navy casi negro, para degradados y fondos teñidos
  navy: '#102A5C',        // anillo del escudo
  navyLight: '#16386F',
  blueDark: '#0B3F8C',
  blue: '#0057B8',        // azul principal de la marca
  blueMid: '#2E77D6',     // azul de la camiseta
  blueLight: '#5B9BE8',
  blueSoft: '#8FBEF2',
  bluePale: '#C6DEF8',

  // ── Rojo del escudo — acento puntual, nunca dominante ──────────
  redDark: '#9E1A2E',
  red: '#E52B44',
  redLight: '#FF6178',

  // ── Dorado — realces premium (palmarés, destacados) ────────────
  goldDark: '#8F7530',
  gold: '#C9A84C',
  goldLight: '#E0C478',

  // ── Hueso y grises ────────────────────────────────────────────
  bone: '#F5F0E8',
  boneWarm: '#EDE8DC',
  grayLight: '#B4B9C6',
  gray: '#8A8F9E',
  grayDark: '#5A6070',
}

// Alias semánticos: nombran la función, no el color. Si mañana cambia
// el acento de la marca se edita acá y no en cada componente.
const brand = {
  ...scale,
  accent: scale.blueMid,       // acento principal (bordes activos, iconos, cifras)
  accentLight: scale.blueLight, // estado activo / hover destacado
  accentDeep: scale.blueDark,   // extremo oscuro de degradados
  accentMid: scale.blue,        // extremo claro de degradados
  steel: '#3E5F8A',             // azul apagado: bordes, barras decorativas
  steelLight: '#6B8CB8',        // azul apagado legible sobre fondo oscuro
}

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: { brand },
  fonts: {
    heading: `'Nippo', sans-serif`,
    body: `'Barlow', sans-serif`,
    condensed: `'Barlow Condensed', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: 'brand.dark',
        color: 'white',
        overflowX: 'hidden',
      },
      '*': {
        boxSizing: 'border-box',
        margin: 0,
        padding: 0,
      },
      '::-webkit-scrollbar': {
        width: '4px',
      },
      '::-webkit-scrollbar-track': {
        background: 'brand.dark',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'brand.blue',
        borderRadius: '2px',
      },
    },
  },
  components: {
    Button: {
      variants: {
        piovi: {
          fontFamily: `'Barlow Condensed', sans-serif`,
          fontWeight: '600',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          borderRadius: '0',
          border: '1px solid',
          transition: 'all 0.3s ease',
        },
      },
    },
  },
})

export default theme
