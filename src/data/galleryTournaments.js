// ─────────────────────────────────────────────────────────────────
// Galería segmentada en mazos (datos estáticos / fallback).
// Archivo NUEVO: no reemplaza ni modifica playerData.gallery.
//
// Cada mazo toma sus fotos de su subcarpeta en assets/galleryTorneos:
//   Liga MX/  ·  Copas/  ·  Equipos/
// Son copias optimizadas (máx. 1800 px) de assets/galleryPhotos;
// los originales quedan intactos.
//
// Para sumar una foto: copiala a la subcarpeta, importala abajo y
// agregala al array `photos` del mazo. Las 3 primeras fotos de cada
// mazo son las cartas que se ven (foto 0 arriba, 1 a la derecha,
// la última a la izquierda). `season` es el texto chico del mazo.
// ─────────────────────────────────────────────────────────────────

// Liga MX
import image7 from '@assets/galleryTorneos/Liga MX/image7.webp'
import image17 from '@assets/galleryTorneos/Liga MX/image17.webp'
import image5 from '@assets/galleryTorneos/Liga MX/image5.webp'
import image12 from '@assets/galleryTorneos/Liga MX/image12.webp'
import image14 from '@assets/galleryTorneos/Liga MX/image14.webp'
import image19 from '@assets/galleryTorneos/Liga MX/image19.webp'

// Copas
import image1 from '@assets/galleryTorneos/Copas/image1.webp'
import image2 from '@assets/galleryTorneos/Copas/image2.webp'
import image3 from '@assets/galleryTorneos/Copas/image3.webp'
import image4 from '@assets/galleryTorneos/Copas/image4.webp'
import image5 from '@assets/galleryTorneos/Copas/image5.webp'
import image6 from '@assets/galleryTorneos/Copas/image6.webp'
import image7 from '@assets/galleryTorneos/Copas/image7.webp'
import image8 from '@assets/galleryTorneos/Copas/image8.webp'
import image9 from '@assets/galleryTorneos/Copas/image9.webp'
import image10 from '@assets/galleryTorneos/Copas/image10.webp'
import image11 from '@assets/galleryTorneos/Copas/image11.webp'
import image12 from '@assets/galleryTorneos/Copas/image12.webp'
import image13 from '@assets/galleryTorneos/Copas/image13.webp'
import image14 from '@assets/galleryTorneos/Copas/image14.webp'


// Equipos
import image20 from '@assets/galleryTorneos/Equipos/image20.webp'
import image13 from '@assets/galleryTorneos/Equipos/image13.webp'
import image10 from '@assets/galleryTorneos/Equipos/image10.webp'
import image11 from '@assets/galleryTorneos/Equipos/image11.webp'
import image16 from '@assets/galleryTorneos/Equipos/image16.webp'
import image18 from '@assets/galleryTorneos/Equipos/image18.webp'
import image6 from '@assets/galleryTorneos/Equipos/image6.webp'
import image15 from '@assets/galleryTorneos/Equipos/image15.webp'

const photo = (n, src, caption) => ({
  id: `img${n}`,
  src,
  caption,
  alt: `Gonzalo Piovi: ${caption.charAt(0).toLowerCase()}${caption.slice(1)}`,
})

export const tournaments = [
  {
    id: 'liga-mx',
    name: 'Liga MX',
    season: '2025 · 2026',
    order: 1,
    photos: [
      photo(7, image7, 'Conduciendo el balón con la camiseta de Cruz Azul'),
      photo(17, image17, 'Rematando el balón durante un partido'),
      photo(5, image5, 'En acción con la camiseta titular'),
      photo(12, image12, 'Junto al plantel antes de un partido'),
      photo(14, image14, 'Aplaudiendo a la hinchada tras un partido'),
      photo(19, image19, 'Conduciendo con la camiseta suplente'),
    ],
  },
  {
    id: 'copas',
    name: 'Copas',
    season: '2025',
    order: 2,
    photos: [
      photo(1, image1, 'Levantando el trofeo de campeón'),
      photo(4, image4, 'Festejando con el plantel entre confeti'),
      photo(3, image3, 'Sonriendo con la medalla y el trofeo'),
      photo(8, image8, 'Posando con el trofeo'),
      photo(2, image2, 'Festejando el título con su familia'),
      photo(9, image9, 'Celebración familiar en el campo'),
    ],
  },
  {
    id: 'equipos',
    name: 'Equipos',
    season: 'Trayectoria',
    order: 3,
    photos: [
      photo(20, image20, 'Celebrando un gol con la camiseta de Racing Club'),
      photo(13, image13, 'Presentación de su renovación con Cruz Azul'),
      photo(10, image10, 'Retrato con la campera oficial de Cruz Azul'),
      photo(11, image11, 'Firmando camisetas a los hinchas'),
      photo(16, image16, 'Entrenando con Cruz Azul'),
      photo(18, image18, 'Entrenamiento junto al plantel'),
      photo(6, image6, 'Entrenando antes de un partido'),
      photo(15, image15, 'Con la ropa oficial del club'),
    ],
  },
]

export default tournaments
