import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import heroImage from '@assets/piovi4.svg'
import { playerData } from '../../data/playerData'

// ─── PRELOADER ───────────────────────────────────────────────────
// Tapa la web hasta que el "primer vistazo" (Hero + Navbar) está
// realmente descargado: la foto del jugador, la bandera, el escudo del
// club actual y las tipografías Nippo / Barlow.
//
// La barra no es decorativa: avanza a medida que cada recurso resuelve.
// MIN_DURATION evita el parpadeo cuando todo viene de caché;
// MAX_DURATION garantiza que una red lenta nunca deje la web tapada.

const MIN_DURATION = 800   // ms visibles como mínimo
const MAX_DURATION = 7000  // ms como máximo, pase lo que pase

const HERO_ASSETS = [
  heroImage,                    // figura del jugador (capa principal)
  playerData.nationalityFlag,   // bandera del panel de datos
  playerData.logoCurrentClub,   // escudo del club actual
]

// Variantes tipográficas del Hero y del Navbar. Se piden explícitamente
// porque con `font-display: swap` el navegador sólo las baja cuando las
// pinta, y queremos que estén listas ANTES de destapar la web (si no, se
// ve el salto de fallback → Nippo justo al entrar).
const HERO_FONTS = [
  "400 1em 'Nippo'",
  "600 1em 'Nippo'",
  "400 1em 'Barlow'",
  "600 1em 'Barlow Condensed'",
]

// Nunca rechaza: un asset que falle no puede dejar la web bloqueada.
function preloadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve()
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = src
    if (img.complete) resolve()
  })
}

function preloadFonts() {
  if (!document.fonts) return Promise.resolve()
  return Promise.all(HERO_FONTS.map((font) => document.fonts.load(font).catch(() => {})))
    .then(() => document.fonts.ready)
    .catch(() => {})
}

function unlockScroll() {
  document.body.style.overflow = ''
  window.__lenis?.start()
}

export default function Preloader({ onComplete }) {
  const rootRef  = useRef(null)
  const logoRef  = useRef(null)
  const panelRef = useRef(null)
  const barRef   = useRef(null)
  const pctRef   = useRef(null)

  const targetRef   = useRef(0)      // progreso real (0..1)
  const shownRef    = useRef(0)      // progreso pintado, persigue al real
  const finishedRef = useRef(false)

  const [gone, setGone] = useState(false)

  // ── Scroll bloqueado mientras el loader cubre la web ───────────
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.scrollTo(0, 0)
    // Lenis se instancia en un efecto padre (main.jsx), que corre
    // DESPUÉS que este: por eso se pausa en el frame siguiente.
    const id = requestAnimationFrame(() => window.__lenis?.stop())
    return () => {
      cancelAnimationFrame(id)
      unlockScroll()
    }
  }, [])

  // ── Carga real + barra ─────────────────────────────────────────
  useEffect(() => {
    const startedAt = performance.now()
    const tasks = [preloadFonts(), ...HERO_ASSETS.map(preloadImage)]

    let settled = 0
    tasks.forEach((task) => {
      task.then(() => {
        settled += 1
        // Monótono a propósito: en dev, StrictMode monta el efecto dos
        // veces y el contador del primer montaje sigue resolviendo. Sin
        // el max, la barra retrocedería.
        targetRef.current = Math.max(targetRef.current, settled / tasks.length)
      })
    })

    // Salvavidas: red lenta o recurso colgado → se destapa igual.
    const bail = setTimeout(() => { targetRef.current = 1 }, MAX_DURATION)

    let raf = 0

    const finish = () => {
      if (finishedRef.current) return
      finishedRef.current = true
      cancelAnimationFrame(raf)
      clearTimeout(bail)

      // Se avisa al arrancar la salida, no al terminarla: así la
      // animación de entrada del Hero/Navbar se solapa con el fundido
      // del overlay en vez de esperarlo.
      onComplete?.()

      gsap.timeline({
        onComplete: () => {
          unlockScroll()
          ScrollTrigger.refresh()
          setGone(true)
        },
      })
        .to(panelRef.current, { opacity: 0, y: -8,  duration: 0.35, ease: 'power2.in' }, 0)
        .to(logoRef.current,  { opacity: 0, y: -20, duration: 0.5,  ease: 'power2.in' }, 0.05)
        .to(rootRef.current,  { opacity: 0, duration: 0.55, ease: 'power2.inOut' }, 0.15)
    }

    const tick = () => {
      const target = targetRef.current
      const complete = target >= 1 && performance.now() - startedAt >= MIN_DURATION

      // Persigue al progreso real; una vez completo cierra más rápido.
      shownRef.current += (target - shownRef.current) * (complete ? 0.16 : 0.07)

      if (complete && shownRef.current > 0.999) {
        shownRef.current = 1
        paint(1)
        finish()
        return
      }

      paint(shownRef.current)
      raf = requestAnimationFrame(tick)
    }

    const paint = (value) => {
      if (barRef.current) barRef.current.style.transform = `scaleX(${value})`
      if (pctRef.current) pctRef.current.textContent = String(Math.round(value * 100)).padStart(2, '0')
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(bail)
    }
    // onComplete viene del padre y no cambia entre renders.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (gone) return null

  return (
    <Flex
      ref={rootRef}
      position="fixed"
      inset={0}
      zIndex={9999}
      bg="brand.dark"
      direction="column"
      align="center"
      justify="center"
      px={6}
    >
      {/* Glow azul inferior — mismo gesto que el fondo del Hero */}
      <Box
        position="absolute"
        bottom="-15%"
        left="50%"
        transform="translateX(-50%)"
        w={{ base: '420px', md: '760px' }}
        h={{ base: '420px', md: '760px' }}
        bg="radial-gradient(ellipse at bottom, rgba(0,87,184,0.20) 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* Logo de iniciales — el mismo del Navbar y el Footer */}
      <Box ref={logoRef} position="relative">
        <Text
          fontFamily="heading"
          fontSize={{ base: '58px', md: '76px' }}
          lineHeight="1"
          letterSpacing="-0.08em"
          color="white"
          userSelect="none"
        >
          {playerData.initials}
          <Box as="span" color="brand.blue" ml="-2px">_</Box>
        </Text>
      </Box>

      {/* Barra de carga */}
      <Box ref={panelRef} position="relative" w={{ base: '200px', md: '260px' }} mt={7}>
        <Box h="2px" w="100%" bg="whiteAlpha.100" overflow="hidden">
          <Box
            ref={barRef}
            h="100%"
            w="100%"
            transformOrigin="left center"
            transform="scaleX(0)"
            bgGradient="linear(to-r, brand.navy, brand.blue, brand.blueMid)"
          />
        </Box>

        <Flex mt={3} align="center" justify="space-between">
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="10px"
            fontWeight="600"
            letterSpacing="0.22em"
            textTransform="uppercase"
            color="whiteAlpha.400"
          >
            Cargando
          </Text>
          <Text
            fontFamily="heading"
            fontSize="11px"
            letterSpacing="0.12em"
            color="brand.blueMid"
          >
            <Box as="span" ref={pctRef}>00</Box>
            <Box as="span" color="whiteAlpha.400" ml="2px">%</Box>
          </Text>
        </Flex>
      </Box>
    </Flex>
  )
}
