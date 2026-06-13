// ─── DATOS DEL JUGADOR ───────────────────────────────────────

//Foto Principal 
import pioviImage from '../assets/piovi4.svg'
import logoMkt from '../assets/logoMkt.webp'

//Gallery Photos
import photo1 from '../assets/galleryPhotos/photo1.webp'
import photo2 from '../assets/galleryPhotos/photo2.webp'
import photo3 from '../assets/galleryPhotos/photo3.webp'
import photo4 from '../assets/galleryPhotos/photo4.webp'
import photo5 from '../assets/galleryPhotos/photo5.webp'
import photo6 from '../assets/galleryPhotos/photo6.webp'
import photo7 from '../assets/galleryPhotos/photo7.webp'
import photo8 from '../assets/galleryPhotos/photo8.webp'
import photo9 from '../assets/galleryPhotos/photo9.webp'
import photo10 from '../assets/galleryPhotos/photo10.webp'
import photo11 from '../assets/galleryPhotos/photo11.webp'
import photo12 from '../assets/galleryPhotos/photo12.webp'
import photo13 from '../assets/galleryPhotos/photo13.webp'

//Videos
import video1 from '../assets/galleryVideos/video1.mp4'
import photoVideo from '../assets/piovi3.webp'

//Escudos 
import escudoCruzAzul from '../assets/escudos/cruzazul.webp'
import escudoRacing from '../assets/escudos/racing.webp'
import escudoColon from '../assets/escudos/colon.webp'
import escudoArgentinos from '../assets/escudos/argentinos.webp'
import escudoVelez from '../assets/escudos/velez.webp'
import escudoDefensa from '../assets/escudos/defensa.webp'
import escudoGimnasia from '../assets/escudos/gimnasia.webp'

//Icons
import { FaInstagram, FaEnvelope } from 'react-icons/fa'
import { IoMdStats } from "react-icons/io";





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
    { label: 'Anticipación',  value: 90 },
  ],

  // Stats de temporada actuales
  seasonStats: [
    { label: 'Partidos',      value: 44 },
    { label: 'Goles',         value: 1 },
    { label: 'Asistencias',   value: 2 },
    { label: 'Duelos ganados',value: '78%' },
    { label: 'Intercepciones',value: '72%' },
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
      title: 'Cruz Azul Temporada 2026',
      duration: '3:42',
      thumbnail: video1,
      cover: photoVideo,          // foto de portada del video (acción en cancha)
      src: video1,
      previewSrc: video1,
      category: 'Highlights',
    },

  ],

  // Prensa & menciones
  press: [
    {
      media: 'Marca México',
      logo: '/logos/espn.png',
      title: 'Piovi sobre Messi: "El mejor del mundo tuvo la intención de llevarme"',
      date: 'Septiembre 2025',
      url: 'https://www.marca.com/mx/futbol/liga-mx/2025/09/04/68b92c6eca474126788b45e9.html',
    },
    {
      media: 'Excélsior',
      logo: '/logos/tyc.png',
      title: 'Aspiraba a esto y estoy muy contento y orgulloso de haber llegado a esta familia que es Cruz Azul',
      date: 'Marzo 2026',
      url: 'https://www.excelsior.com.mx/deportes/cruz-azul-gonzalo-piovi-habla-regreso-olimpico-universitario-para-enfrentar-pumas',
    },
    {
      media: 'Récord México',
      logo: '/logos/ole.png',
      title: '”Tenemos que estar preparados, sabemos los jugadores que tienen, estamos convencidos de que con nuestra gente va a empujar”',
      date: 'Abril 2026',
      url: 'https://www.record.com.mx/historia/podemos-remontar-piovi-lanza-alentador-mensaje-previo-a-la-vuelta-ante-lafc-2026041323580152451',
    },
  ],

  // Galería de fotos — colocar archivos reales en src/assets/galleryPhotos/
  gallery: [
    { id: 1, src: photo1, alt: 'Piovi celebra el título rodeado de su familia tras ganar La Final · Clausura 2025',aspect: 'tall' },
    { id: 2, src: photo2, alt: 'Piovi firmando autógrafos a hinchas de Cruz Azul en la Ciudad Deportiva',aspect: 'wide' },
    { id: 3, src: photo3, alt: 'Piovi concentrado en la formación previa a La Final del Clausura 2025',aspect: 'square' },
    { id: 4, src: photo4, alt: 'Piovi conduce el balón con la camiseta alternativa gris de Cruz Azul',aspect: 'tall' },
    { id: 5, src: photo5, alt: 'Piovi levanta el trofeo sentado en el trono dorado tras el título de Clausura 2025',aspect: 'tall' },
    { id: 6, src: photo6, alt: 'Piovi #33 en acción con el balón ante Chivas · Liga MX',aspect: 'wide' },
    { id: 7, src: photo7, alt: 'El plantel de Cruz Azul forma un círculo motivacional antes del partido',aspect: 'square' },
    { id: 8, src: photo8, alt: 'Presentación oficial de Piovi como jugador de Cruz Azul mostrando su camiseta 2028',  aspect: 'tall' },
    { id: 9, src: photo9, alt: 'Presentación oficial de Piovi como jugador de Cruz Azul mostrando su camiseta 2028',  aspect: 'tall' },
    { id: 10, src: photo10, alt: 'Presentación oficial de Piovi como jugador de Cruz Azul mostrando su camiseta 2028',  aspect: 'tall' },
    { id: 11, src: photo11, alt: 'Presentación oficial de Piovi como jugador de Cruz Azul mostrando su camiseta 2028',  aspect: 'tall' },
    { id: 12, src: photo12, alt: 'Presentación oficial de Piovi como jugador de Cruz Azul mostrando su camiseta 2028',  aspect: 'tall' },
    { id: 13, src: photo13, alt: 'Presentación oficial de Piovi como jugador de Cruz Azul mostrando su camiseta 2028',  aspect: 'tall' },

  ],

  socialMedia: [
    { label: 'Instagram', icon: FaInstagram, handle: '@gonzalopiovi', url: 'https://www.instagram.com/gonzalopiovi/', hoverColor: 'rgba(225, 48, 108, 0.35)' },
  ],

  contact: [
    { title: 'Representante Deportivo', label: 'DODICI Sports',    icon: FaEnvelope,  handle: '@dodici_sm', url: 'https://www.instagram.com/dodici_sm/', hoverColor: 'rgba(0, 87, 184, 0.4)' },
    { title: 'Estadísticas', label: 'TransferMarkt', image: logoMkt,  handle: '@pioviprofile', url: 'https://www.transfermarkt.es/gonzalo-piovi/profil/spieler/284120', hoverColor: 'rgba(138, 211, 207, 0.53)' },
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
