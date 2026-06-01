// ─── DATOS DEL JUGADOR ───────────────────────────────────────

//Foto Principal
import pioviImage from '../assets/piovi2.png'

//Gallery Photos
import photo1 from '../assets/galleryPhotos/photo1.jpg'
import photo2 from '../assets/galleryPhotos/photo2.jpg'
import photo3 from '../assets/galleryPhotos/photo3.jpg'
import photo4 from '../assets/galleryPhotos/photo4.jpg'
import photo5 from '../assets/galleryPhotos/photo5.webp'
import photo6 from '../assets/galleryPhotos/photo6.webp'
import photo7 from '../assets/galleryPhotos/photo7.webp'
import photo8 from '../assets/galleryPhotos/photo8.webp'

//Videos
import video1 from '../assets/galleryVideos/video1.mp4'

//Escudos 
import escudoCruzAzul from '../assets/escudos/cruzazul.png'
import escudoRacing from '../assets/escudos/racing.png'
import escudoColon from '../assets/escudos/colon.png'
import escudoArgentinos from '../assets/escudos/argentinos.png'
import escudoVelez from '../assets/escudos/velez.png'
import escudoDefensa from '../assets/escudos/defensa.png'
import escudoGimnasia from '../assets/escudos/gimnasia.png'

//Icons
import { FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa'


export const playerData = {
  name: 'Gonzalo',
  fullName: 'Piovi',
  number: 33,
  position: 'Defensor Central',
  positionShort: 'DEF',
  nationality: 'Argentina',
  nationalityFlag: '🇦🇷',
  age: 31,
  height: '1.81m',
  weight: '78kg',
  foot: 'Zurdo',
  birthDate: '08 / 09 / 1994',
  birthPlace: 'Moron, Buenos Aires',
  currentClub: 'Cruz Azul',
  logoCurrentClub: escudoCruzAzul,
  image: pioviImage,


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
      name: 'Vélez Sarsfield',
      country: 'Argentina',
      years: '2013 — 2015',
      logo: escudoVelez,
      titles: [], 
      info: 'Debút profesional vs All Boys'
    },
    {
      name: 'Argentinos Juniors',
      country: 'Argentina',
      years: '2016 — 2018',
      logo: escudoArgentinos,
      titles: ['Ascenso a Primera 2016'],
    },
    {
      name: 'Racing Club',
      country: 'Argentina',
      years: '2018 / 2022-2023',
      logo: escudoRacing,
      titles: ['Trofeo de Campeones 2022', 'Supercopa Internacional 2022'],
    },
    {
      name: 'Gimnasia y Esgrima La Plata',
      country: 'Argentina',
      years: '2018-2019 (préstamo)',
      logo: escudoGimnasia,
      titles: [],
    },
    {
      name: 'Defensa y Justicia',
      country: 'Argentina',
      years: '2019-2020 (préstamo)',
      logo: escudoDefensa,
      titles: [],
    },
    {
      name: 'Colón de Santa Fe',
      country: 'Argentina',
      years: '2020-2022',
      logo: escudoColon,
      titles: ['Copa de la Liga 2021'],
    },
    {
      name: 'Cruz Azul',
      country: 'México',
      years: '2024 — Presente',
      logo: escudoCruzAzul,
      titles: ['Campeones Concacaf 2025'],
    },
  ],

  // Videos highlight
  videos: [
    {
      id: 1,
      title: 'Mejor temporada Cruz Azul 2024',
      duration: '3:42',
      thumbnail: video1,
      cover: photo3,          // foto de portada del video (acción en cancha)
      src: video1,
      previewSrc: video1,
      category: 'Highlights',
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
    { id: 1, src: photo8, alt: 'Piovi celebra el título rodeado de su familia tras ganar La Final · Clausura 2025',   caption: 'Campeón junto a su familia · La Final · Clausura 2025',               category: 'Familia',       aspect: 'tall'   },
    { id: 2, src: photo7, alt: 'Piovi firmando autógrafos a hinchas de Cruz Azul en la Ciudad Deportiva',             caption: 'Conexión con la afición · Ciudad Deportiva · Cruz Azul',              category: 'Afición',       aspect: 'wide'   },
    { id: 3, src: photo6, alt: 'Piovi concentrado en la formación previa a La Final del Clausura 2025',               caption: 'Enfoque total antes de la batalla · La Final · Clausura 2025',        category: 'Partido',       aspect: 'square' },
    { id: 4, src: photo5, alt: 'Piovi conduce el balón con la camiseta alternativa gris de Cruz Azul',                caption: 'Salida limpia desde el fondo · Camiseta alternativa · Liga MX',       category: 'Partido',       aspect: 'tall'   },
    { id: 5, src: photo4, alt: 'Piovi levanta el trofeo sentado en el trono dorado tras el título de Clausura 2025',  caption: 'El Rey de La Máquina · Campeón Clausura 2025',                       category: 'Título',        aspect: 'tall'   },
    { id: 6, src: photo3, alt: 'Piovi #33 en acción con el balón ante Chivas · Liga MX',                              caption: 'Precisión en cada balón · Cruz Azul vs Chivas · Liga MX',            category: 'Partido',       aspect: 'wide'   },
    { id: 7, src: photo2, alt: 'El plantel de Cruz Azul forma un círculo motivacional antes del partido',             caption: 'Unidos de cara al partido · Estadio Ciudad de los Deportes',         category: 'Equipo',        aspect: 'square' },
    { id: 8, src: photo1, alt: 'Presentación oficial de Piovi como jugador de Cruz Azul mostrando su camiseta 2028', caption: 'Bienvenido a La Máquina · Contrato hasta 2028 · Cruz Azul',          category: 'Presentación',  aspect: 'tall'   },
  ],

  socialMedia: [
    { label: 'Instagram', icon: FaInstagram, handle: '@gonzalopiovi', url: 'https://www.instagram.com/gonzalopiovi/', hoverColor: 'rgba(225, 48, 108, 0.35)' },
  ],

  contact: [
    { title: 'Representante Deportivo', label: 'Email',    icon: FaEnvelope,  handle: 'representante@gonzalopiovi.com', url: 'mailto:contacto@gonzalopiovi.com', hoverColor: 'rgba(0, 87, 184, 0.4)' },
    { title: 'Mensajes', label: 'WhatsApp', icon: FaWhatsapp,  handle: '@gonzalopiovi', url: 'https://wa.me/5491100000000', hoverColor: 'rgba(37, 211, 102, 0.38)' },
  ],


  // ─── MARQUEE DATA ────────────────────────────────────────────────
  marqueeItems: [
    'Cruz Azul', '·', 'Defensor', '·', 'Buenos Aires', '·', 'Argentina', '·',
    '#33', '·', 'Liga MX', '·', 'Zurdo', '·', '1.81m', '·',
    'Cruz Azul', '·', 'Defensor', '·', 'Buenos Aires',  '·', 'Argentina', '·',
    '#33', '·', 'La Máquina', '·', 'Liga MX', '·', 'Zurdo', '·', '1.81m', '·',
  ],
}

export default playerData
