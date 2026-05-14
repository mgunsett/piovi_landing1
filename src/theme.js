import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      blue: '#0057B8',       // Cruz Azul blue
      blueDark: '#003A7D',
      blueLight: '#1a7aff',
      bone: '#F5F0E8',       // Fondo hueso
      boneWarm: '#EDE8DC',
      gold: '#C9A84C',
      dark: '#080C12',
      gray: '#8A8F9E',
    },
  },
  fonts: {
    heading: `'Bebas Neue', sans-serif`,
    body: `'Barlow', sans-serif`,
    condensed: `'Barlow Condensed', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: '#080C12',
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
        background: '#080C12',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#0057B8',
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
