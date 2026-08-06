// ─── DATOS DEL JUGADOR ───────────────────────────────────────

//Foto Principal 
import pioviImage from '@assets/piovi4.svg'
import logoMkt from '@assets/logoMkt.webp'

//Gallery Photos
import image1 from '@assets/galleryPhotos/image1.webp'
import image2 from '@assets/galleryPhotos/image2.webp'
import image3 from '@assets/galleryPhotos/image3.webp'
import image4 from '@assets/galleryPhotos/image4.webp'
import image5 from '@assets/galleryPhotos/image5.webp'
import image6 from '@assets/galleryPhotos/image6.webp'
import image7 from '@assets/galleryPhotos/image7.webp'
import image8 from '@assets/galleryPhotos/image8.webp'
import image9 from '@assets/galleryPhotos/image9.webp'
import image10 from '@assets/galleryPhotos/image10.webp'
import image11 from '@assets/galleryPhotos/image11.webp'
import image12 from '@assets/galleryPhotos/image12.webp'
import image13 from '@assets/galleryPhotos/image13.webp'
import image14 from '@assets/galleryPhotos/image14.webp'
import image15 from '@assets/galleryPhotos/image15.webp'
import image16 from '@assets/galleryPhotos/image16.webp'
import image17 from '@assets/galleryPhotos/image17.webp'
import image18 from '@assets/galleryPhotos/image18.webp'
import image19 from '@assets/galleryPhotos/image19.webp'

//Videos
import video1 from '@assets/galleryVideos/video1.mp4'
import photoVideo from '@assets/piovi3.webp'

//Escudos 
import escudoCruzAzul from '@assets/escudos/cruzazul.webp'
import escudoRacing from '@assets/escudos/racing.webp'
import escudoColon from '@assets/escudos/colon.webp'
import escudoArgentinos from '@assets/escudos/argentinos.webp'
import escudoVelez from '@assets/escudos/velez.webp'
import escudoDefensa from '@assets/escudos/defensa.webp'
import escudoGimnasia from '@assets/escudos/gimnasia.webp'

//Icons
import { FaInstagram, FaEnvelope } from 'react-icons/fa'
import { IoMdStats } from "react-icons/io";

const name = 'GONZALO'
const fullName = 'PIOVI'

export const playerData = {
  name,
  fullName,
  initials: `${name[0]}${fullName[0]}`,
  displayName: `${name} ${fullName}`,
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
      name: 'Cruz Azul',
      country: 'México',
      years: '2024 — Presente',
      logo: escudoCruzAzul,
      titles: ['Campeon de Campeones \'26', 'Liga MX Clausura \'26', 'Campeones Concacaf \'25'],
    },
    {
      name: 'Racing Club',
      country: 'Argentina',
      years: '2018 / 2022-2023',
      logo: escudoRacing,
      titles: ['Trofeo de Campeones 2022', 'Supercopa Internacional 2022'],
    },
    {
      name: 'Colón de Santa Fe',
      country: 'Argentina',
      years: '2020-2022',
      logo: escudoColon,
      titles: ['Copa de la Liga 2021'],
    },
    {
      name: 'Defensa y Justicia',
      country: 'Argentina',
      years: '2019-2020 (préstamo)',
      logo: escudoDefensa,
      titles: [],
    },
    {
      name: 'Gimnasia y Esgrima La Plata',
      country: 'Argentina',
      years: '2018-2019 (préstamo)',
      logo: escudoGimnasia,
      titles: [],
    },
    {
      name: 'Argentinos Juniors',
      country: 'Argentina',
      years: '2016 — 2018',
      logo: escudoArgentinos,
      titles: ['Ascenso a Primera 2016'],
    },
    {
      name: 'Vélez Sarsfield',
      country: 'Argentina',
      years: '2013 — 2015',
      logo: escudoVelez,
      titles: [], 
      info: 'Debút profesional vs All Boys'
    },
  ],

  // Videos highlight
  videos: [
    {
      id: 1,
      title: "Temporada",
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

  // Galería de fotos — colocar archivos reales en assets/galleryPhotos/
  gallery: [
    { id: 1, src: image1, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 2, src: image2, alt: 'Gonzalo Piovi', aspect: 'wide' },
    { id: 3, src: image3, alt: 'Gonzalo Piovi', aspect: 'square' },
    { id: 4, src: image4, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 5, src: image5, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 6, src: image6, alt: 'Gonzalo Piovi', aspect: 'wide' },
    { id: 7, src: image7, alt: 'Gonzalo Piovi', aspect: 'square' },
    { id: 8, src: image8, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 9, src: image9, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 10, src: image10, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 11, src: image11, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 12, src: image12, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 13, src: image13, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 14, src: image14, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 15, src: image15, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 16, src: image16, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 17, src: image17, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 18, src: image18, alt: 'Gonzalo Piovi', aspect: 'tall' },
    { id: 19, src: image19, alt: 'Gonzalo Piovi', aspect: 'tall' },
  ],

  socialMedia: [
    { label: 'Instagram', icon: FaInstagram, handle: '@gonzalopiovi', url: 'https://www.instagram.com/gonzalopiovi/', hoverColor: 'rgba(225, 48, 108, 0.35)' },
  ],

  contact: [
    { title: 'Representante Deportivo', label: 'DODICI Sports',    icon: FaEnvelope,  handle: '@dodici_sm', url: 'https://www.instagram.com/dodici_sm/', hoverColor: 'rgba(0, 87, 184, 0.4)' },
    { title: 'Estadísticas', label: 'TransferMarkt', image: logoMkt,  handle: '@pioviprofile', url: 'https://www.transfermarkt.es/gonzalo-piovi/profil/spieler/284120', hoverColor: 'rgba(138, 211, 207, 0.53)' },
  ],


}

export default playerData
