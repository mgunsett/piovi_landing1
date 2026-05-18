// ─── DATOS DEL JUGADOR ────────────────────────────────────────
// Reemplazar con datos reales de Piovi

import pioviImage from '../assets/piovi2.png'
import photo1 from '../assets/galleryPhotos/photo1.jpg'
import photo2 from '../assets/galleryPhotos/photo2.jpg'
import photo3 from '../assets/galleryPhotos/photo3.jpg'
import photo4 from '../assets/galleryPhotos/photo4.jpg'
import video1 from '../assets/galleryVideos/video1.mp4'
import bgCancha from '../assets/bg_cancha.jpg'


export const playerData = {
  name: 'Piovi',
  fullName: 'Gonzalo Piovi',
  number: 3,
  position: 'Defensor',
  positionShort: 'DEF',
  nationality: 'Argentina',
  nationalityFlag: '🇦🇷',
  age: 27,
  height: '1.84m',
  weight: '78kg',
  foot: 'Zurdo',
  birthDate: '17 / 12 / 1996',
  birthPlace: 'Santa Fe, Argentina',
  currentClub: 'Cruz Azul',
  quote: '"El trabajo diario es la base de todo lo que logramos."',
  image: pioviImage,
  bg: bgCancha,

  // Stats técnicas (0-100)
  stats: [
    { label: 'Velocidad',     value: 82 },
    { label: 'Físico',        value: 86 },
    { label: 'Defensa',       value: 88 },
    { label: 'Pase',          value: 75 },
    { label: 'Cabezazo',      value: 79 },
    { label: 'Anticipación',  value: 85 },
  ],

  // Stats de temporada actuales
  seasonStats: [
    { label: 'Partidos',      value: 32 },
    { label: 'Goles',         value: 2 },
    { label: 'Asistencias',   value: 3 },
    { label: 'Duelos ganados',value: '68%' },
    { label: 'Intercepciones',value: 47 },
    { label: 'Precisión pase',value: '87%' },
  ],

  // Historial de clubes (del más reciente al más antiguo)
  clubs: [
    {
      name: 'Cruz Azul',
      country: 'México',
      years: '2023 — Presente',
      logo: '/logos/cruzazul.png',
      color: '#0057B8',
      titles: ['Liga MX 2024'],
    },
    {
      name: 'Racing Club',
      country: 'Argentina',
      years: '2021 — 2023',
      logo: '/logos/racing.png',
      color: '#1A1A1A',
      titles: ['Copa Sudamericana 2022'],
    },
    {
      name: 'Colón de Santa Fe',
      country: 'Argentina',
      years: '2018 — 2021',
      logo: '/logos/colon.png',
      color: '#E53535',
      titles: ['Copa de la Liga 2021'],
    },
    {
      name: 'Unión de Santa Fe',
      country: 'Argentina',
      years: '2015 — 2018',
      logo: '/logos/union.png',
      color: '#CC0000',
      titles: [],
    },
  ],

  // Videos highlight
  videos: [
    {
      id: 1,
      title: 'Mejor temporada Cruz Azul 2024',
      duration: '3:42',
      thumbnail: video1,
      src: video1,
      previewSrc: video1,
      category: 'Highlights',
    },
    {
      id: 2,
      title: 'Goles & Asistencias 2023',
      duration: '2:15',
      thumbnail: '/videos/thumb2.jpg',
      src: '/videos/highlight2.mp4',
      previewSrc: '/videos/preview2.mp4',
      category: 'Goles',
    },
    {
      id: 3,
      title: 'Defensa élite — temporada completa',
      duration: '4:08',
      thumbnail: '/videos/thumb3.jpg',
      src: '/videos/highlight3.mp4',
      previewSrc: '/videos/preview3.mp4',
      category: 'Defensa',
    },
    {
      id: 4,
      title: 'Copa Sudamericana 2022',
      duration: '5:30',
      thumbnail: '/videos/thumb4.jpg',
      src: '/videos/highlight4.mp4',
      previewSrc: '/videos/preview4.mp4',
      category: 'Copas',
    },
  ],

  // Prensa & menciones
  press: [
    {
      media: 'ESPN',
      logo: '/logos/espn.png',
      title: 'Piovi, el muro del Cruz Azul que enamora a la Liga MX',
      date: 'Marzo 2024',
      url: '#',
    },
    {
      media: 'TyC Sports',
      logo: '/logos/tyc.png',
      title: 'El argentino que conquistó México: la historia de Piovi',
      date: 'Enero 2024',
      url: '#',
    },
    {
      media: 'Olé',
      logo: '/logos/ole.png',
      title: '"Quiero llegar a la Selección": la ambición de Piovi',
      date: 'Noviembre 2023',
      url: '#',
    },
  ],

  // Galería de fotos — colocar archivos reales en src/assets/galleryPhotos/
  gallery: [
    { id: 1, src: photo1, alt: 'Cruz Azul vs América 2024',  caption: 'Cruz Azul vs América · Liga MX 2024',        category: 'Partido',       aspect: 'tall'   },
    { id: 2, src: photo2, alt: 'Festejo de gol',              caption: 'Festejo tras anotar',                        category: 'Partido',       aspect: 'wide'   },
    { id: 3, src: photo3, alt: 'Entrenamiento Cruz Azul',     caption: 'Sesión de entrenamiento · Ciudad Deportiva', category: 'Entrenamiento', aspect: 'square' },
    { id: 4, src: photo4, alt: 'Duelo aéreo en la cancha',   caption: 'Duelo aéreo · Torneo Clausura',              category: 'Partido',       aspect: 'tall'   },
    { id: 1, src: photo1, alt: 'Cruz Azul vs América 2024',  caption: 'Cruz Azul vs América · Liga MX 2024',        category: 'Partido',       aspect: 'tall'   },
    { id: 2, src: photo2, alt: 'Festejo de gol',              caption: 'Festejo tras anotar',                        category: 'Partido',       aspect: 'wide'   },
    { id: 3, src: photo3, alt: 'Entrenamiento Cruz Azul',     caption: 'Sesión de entrenamiento · Ciudad Deportiva', category: 'Entrenamiento', aspect: 'square' },
    { id: 4, src: photo4, alt: 'Duelo aéreo en la cancha',   caption: 'Duelo aéreo · Torneo Clausura',              category: 'Partido',       aspect: 'tall'   },
     { id: 1, src: photo1, alt: 'Cruz Azul vs América 2024',  caption: 'Cruz Azul vs América · Liga MX 2024',        category: 'Partido',       aspect: 'tall'   },
    { id: 2, src: photo2, alt: 'Festejo de gol',              caption: 'Festejo tras anotar',                        category: 'Partido',       aspect: 'wide'   },
  ],

  socialMedia: {
    instagram: 'https://instagram.com/gonzapiovi',
    twitter: 'https://twitter.com/gonzapiovi',
    tiktok: 'https://tiktok.com/@gonzapiovi',
  },
}

export default playerData
