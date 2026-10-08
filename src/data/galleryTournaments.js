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
import liga1 from '@assets/galleryTorneos/Liga MX/image_liga1.webp'
import liga2 from '@assets/galleryTorneos/Liga MX/image_liga2.webp'
import liga3 from '@assets/galleryTorneos/Liga MX/image_liga3.webp'
import liga4 from '@assets/galleryTorneos/Liga MX/image_liga4.webp'
import liga5 from '@assets/galleryTorneos/Liga MX/image_liga5.webp'
import liga6 from '@assets/galleryTorneos/Liga MX/image_liga6.webp'
import liga7 from '@assets/galleryTorneos/Liga MX/image_liga7.webp'
import liga8 from '@assets/galleryTorneos/Liga MX/image_liga8.webp'
import liga9 from '@assets/galleryTorneos/Liga MX/image_liga9.webp'
import liga10 from '@assets/galleryTorneos/Liga MX/image_liga10.webp'
import liga11 from '@assets/galleryTorneos/Liga MX/image_liga11.webp'
import liga12 from '@assets/galleryTorneos/Liga MX/image_liga12.webp'
import liga13 from '@assets/galleryTorneos/Liga MX/image_liga13.webp'
import liga14 from '@assets/galleryTorneos/Liga MX/image_liga14.webp'
import liga15 from '@assets/galleryTorneos/Liga MX/image_liga15.webp'

// Copas
import copa1 from '@assets/galleryTorneos/Copas/image_copa1.webp'
import copa2 from '@assets/galleryTorneos/Copas/image_copa2.webp'
import copa3 from '@assets/galleryTorneos/Copas/image_copa3.webp'
import copa4 from '@assets/galleryTorneos/Copas/image_copa4.webp'
import copa5 from '@assets/galleryTorneos/Copas/image_copa5.webp'
import copa6 from '@assets/galleryTorneos/Copas/image_copa6.webp'
import copa7 from '@assets/galleryTorneos/Copas/image_copa7.webp'
import copa8 from '@assets/galleryTorneos/Copas/image_copa8.webp'
import copa9 from '@assets/galleryTorneos/Copas/image_copa9.webp'
import copa10 from '@assets/galleryTorneos/Copas/image_copa10.webp'
import copa11 from '@assets/galleryTorneos/Copas/image_copa11.webp'
import copa12 from '@assets/galleryTorneos/Copas/image_copa12.webp'
import copa13 from '@assets/galleryTorneos/Copas/image_copa13.webp'
import copa14 from '@assets/galleryTorneos/Copas/image_copa14.webp'
import copa15 from '@assets/galleryTorneos/Copas/image_copa15.webp'
import copa16 from '@assets/galleryTorneos/Copas/image_copa16.webp'


// Equipos
import equipo1 from '@assets/galleryTorneos/Equipos/image_equipos1.webp'
import equipo2 from '@assets/galleryTorneos/Equipos/image_equipos2.webp'
import equipo3 from '@assets/galleryTorneos/Equipos/image_equipos3.webp'
import equipo4 from '@assets/galleryTorneos/Equipos/image_equipos4.webp'
import equipo5 from '@assets/galleryTorneos/Equipos/image_equipos5.webp'
import equipo6 from '@assets/galleryTorneos/Equipos/image_equipos6.webp'
import equipo7 from '@assets/galleryTorneos/Equipos/image_equipos7.webp'
import equipo8 from '@assets/galleryTorneos/Equipos/image_equipos8.webp'
import equipo9 from '@assets/galleryTorneos/Equipos/image_equipos9.webp'

const photo = (n, src, caption) => ({
  id: `img${n}`,
  src,
  caption,
  alt: `Gonzalo Piovi: ${caption.charAt(0).toLowerCase()}${caption.slice(1)}`,
})

export const tournaments = [
  {
    id: 'liga-mx',
    name: 'Cruz Azul',
    season: '2025 · 2026',
    order: 1,
    photos: [
      photo(1, liga1, 'Celebrando el gol con el plantel'),
      photo(2, liga2, 'Festejando el gol con el plantel'),
      photo(3, liga3, 'Celebrando el gol con el plantel'),
      photo(4, liga4, 'Celebrando el gol con el plantel'),
      photo(5, liga5, 'Celebrando el gol con el plantel'),
      photo(6, liga6, 'Celebrando el gol con el plantel'),
      photo(7, liga7, 'Celebrando el gol con el plantel'),
      photo(8, liga8, 'Celebrando el gol con el plantel'),
      photo(9, liga9, 'Celebrando el gol con el plantel'),
      photo(10, liga10, 'Celebrando el gol con el plantel'),
      photo(11, liga11, 'Celebrando el gol con el plantel'),
      photo(12, liga12, 'Celebrando el gol con el plantel'),
      photo(13, liga13, 'Celebrando el gol con el plantel'),
      photo(14, liga14, 'Celebrando el gol con el plantel'),
      photo(15, liga15, 'Celebrando el gol con el plantel'),
    ],
  },
  {
    id: 'copas',
    name: 'Copas',
    season: '2025 · 2026',
    order: 2,
    photos: [
      photo(1, copa1, 'Levantando el trofeo de campeón'),
      photo(4, copa4, 'Festejando con el plantel entre confeti'),
      photo(3, copa3, 'Sonriendo con la medalla y el trofeo'),
      photo(8, copa8, 'Posando con el trofeo'),
      photo(2, copa2, 'Festejando el título con su familia'),
      photo(9, copa9, 'Celebración familiar en el campo'),
      photo(5, copa5, 'Con el trofeo y la medalla de campeón'),
      photo(6, copa6, 'Mostrando la medalla de campeón'),
      photo(7, copa7, 'Con el trofeo y la camiseta del equipo'),
      photo(10, copa10, 'Con el trofeo y la camiseta del equipo'),
      photo(11, copa11, 'Con el trofeo y la camiseta del equipo'),
      photo(12, copa12, 'Con el trofeo y la camiseta del equipo'),
      photo(13, copa13, 'Con el trofeo y la camiseta del equipo'),
      photo(14, copa14, 'Con el trofeo y la camiseta del equipo'),
      photo(15, copa15, 'Con el trofeo y la camiseta del equipo'),
      photo(16, copa16, 'Con el trofeo y la camiseta del equipo'),
    ],
  },
  {
    id: 'equipos',
    name: 'Equipos',
    season: 'Trayectoria',
    order: 3,
    photos: [
      photo(1, equipo1, 'Racing Club'),
      photo(2, equipo2, 'Racing Club'),
      photo(3, equipo3, 'Racing Club'),
      photo(4, equipo4, 'Racing Club'),
      photo(5, equipo5, 'Racing Club'),
      photo(6, equipo6, 'Racing Club'),
      photo(7, equipo7, 'Racing Club'),
      photo(8, equipo8, 'Racing Club'),
      photo(9, equipo9, 'Racing Club'),
    ],
  },
]

export default tournaments
