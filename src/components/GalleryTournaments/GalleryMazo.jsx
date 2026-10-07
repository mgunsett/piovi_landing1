import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { useTournamentGallery } from '../../hooks/useTournamentGallery'
import { useIsMobile } from '../../hooks/useIsMobile'
import GalleryFrame from './GalleryFrame'
import CoverflowGallery from './CoverflowGallery'
import { cutCorner, pad2 } from './galleryUtils'

gsap.registerPlugin(ScrollTrigger)

/**
 * PROPUESTA 1 · "MAZO"
 *
 * Cada torneo es un mazo de tres cartas-foto. Al pasar el mouse se abre en
 * abanico; al elegirlo, las tres cartas vuelan a su lugar en el carrusel
 * (la de arriba al centro, las de atrás a los costados). Desde la galería
 * se vuelve con "Torneos" o Esc, o se salta a otro mazo.
 *
 * Las cartas del mazo son: arriba = foto 0, izquierda = última, derecha = foto 1,
 * que son exactamente las tres que el carrusel muestra al arrancar.
 *
 * Mobile: sin vuelo de cartas ni rotaciones (transformar fotos grandes en
 * 3D/rotación degrada la nitidez y la fluidez). La galería entra con un
 * fundido simple.
 */

const PX = { base: 6, md: 12, lg: 20 }
const SPRING = 'cubic-bezier(.3,1.2,.4,1)'

// ─── MAZO ─────────────────────────────────────────────────────────
function Deck({ t, index, onSelect, onHover }) {
  const n = t.photos.length
  const cards = [
    { cls: 'c-l', i: n - 1 },
    { cls: 'c-r', i: 1 },
    { cls: 'c-top', i: 0 },
  ]
  return (
    <Box
      as="button"
      type="button"
      className="deck"
      data-deck
      onClick={(e) => onSelect(t, e.currentTarget)}
      onMouseEnter={() => onHover(t)}
      onFocus={() => onHover(t)}
      aria-label={`${t.name}, temporada ${t.season}. Ver galería`}
      position="relative"
      zIndex={1}
      display="flex"
      flexDirection={{ base: 'row', md: 'column' }}
      alignItems="center"
      gap={{ base: 7, md: 7 }}
      textAlign={{ base: 'left', md: 'center' }}
      p={{ base: '14px 16px 14px 22px', md: 0 }}
      border={{ base: '1px solid', md: 'none' }}
      borderColor="brand.line"
      borderRadius="md"
      bg={{ base: 'rgba(255,255,255,0.02)', md: 'transparent' }}
      _focusVisible={{ outline: '1px solid', outlineColor: 'brand.blueLight', outlineOffset: '6px' }}
    >
      <Box className="deck-cards" position="relative" w={{ base: '96px', md: 'min(100%, 280px)' }} flexShrink={0} sx={{ aspectRatio: '4 / 5' }}>
        {cards.map(({ cls, i }) => (
          <Box
            key={cls}
            className={`card ${cls}`}
            data-i={i}
            position="absolute"
            inset={0}
            borderRadius="md"
            overflow="hidden"
            border="1px solid rgba(85, 101, 155, 0.61)"
            bg="#0B1017"
            bgImage={`url(${t.photos[i].src})`}
            bgSize="cover"
            bgPos="center"
            boxShadow="0 24px 50px rgba(0,0,0,0.55)"
            transition={`transform .7s ${SPRING}, filter .5s ease, box-shadow .5s ease`}
            sx={{ transformOrigin: '50% 90%' }}
            _after={{ content: '""', position: 'absolute', inset: 0, bg: 'linear-gradient(to top, rgba(0,0,0,0.55), rgba(0,0,0,0) 55%)' }}
          >
            {cls === 'c-top' && (
              <Text position="absolute" left={3} top={3} zIndex={1} fontFamily="condensed" fontSize="11px" fontWeight="700" letterSpacing="0.22em" color="rgba(255,255,255,0.75)">
                <Box as="span" display="inline-block" w="6px" h="6px" mr="6px" borderRadius="50%" bg="brand.blueMid" verticalAlign="1px" />
                {pad2(index + 1)}
              </Text>
            )}
          </Box>
        ))}
      </Box>

      <Flex direction="column" align={{ base: 'flex-start', md: 'center' }} gap={2}>
        <Box className="deck-line" w="28px" h="2px" borderRadius="full" bg="brand.blue" transition="width .5s cubic-bezier(.22,1,.36,1), box-shadow .5s ease" />
        <Text className="deck-name" fontFamily="heading" fontWeight="medium" textTransform="uppercase" fontSize={{ base: '22px', md: 'clamp(20px, 2.2vw, 32px)' }} letterSpacing="0.02em" lineHeight={1} transition="color .4s ease">
          {t.name}
        </Text>
        <Text fontFamily="condensed" fontSize="12px" fontWeight="600" letterSpacing="0.24em" textTransform="uppercase" color="rgba(255,255,255,0.4)">
          {t.season}
        </Text>
        <Text display={{ base: 'block', md: 'none' }} mt={1} fontFamily="condensed" fontSize="12px" fontWeight="600" letterSpacing="0.14em" textTransform="uppercase" color="brand.blueLight">
          Ver galería →
        </Text>
      </Flex>
    </Box>
  )
}

// Estados del mazo (reposo / abanico) y atenuado de los otros mazos
const decksSx = {
  '.card.c-l': { transform: { base: 'rotate(-10deg) translate(-14%, 2%)', md: 'rotate(-6deg) translate(-4%, 1%)' }, filter: { base: 'brightness(.6)', md: 'brightness(.45)' } },
  '.card.c-r': { transform: { base: 'rotate(9deg) translate(14%, 2%)', md: 'rotate(5deg) translate(4%, 1%)' }, filter: { base: 'brightness(.6)', md: 'brightness(.45)' } },
  '.card.c-top': { filter: 'brightness(.82)' },
  // Al salir, el z-index espera a que el abanico se cierre (.7s) para no
  // quedar tapado a mitad de animación; al entrar sube de inmediato.
  '.deck': { transition: 'z-index 0s linear .7s' },
  '@media (hover: hover) and (min-width: 48em)': {
    '.deck:hover, .deck:focus-visible': { zIndex: 3, transition: 'z-index 0s' },
    '&:hover .deck:not(:hover) .card': { filter: 'brightness(.3) saturate(.5)' },
    '.deck:hover .card.c-l, .deck:focus-visible .card.c-l': { transform: 'rotate(-16deg) translate(-28%, -2%)', filter: 'brightness(.8)' },
    '.deck:hover .card.c-r, .deck:focus-visible .card.c-r': { transform: 'rotate(14deg) translate(28%, -2%)', filter: 'brightness(.8)' },
    // En los mazos de las puntas, la carta exterior abre menos para no salirse de la pantalla
    '.deck:first-of-type:hover .card.c-l, .deck:first-of-type:focus-visible .card.c-l': { transform: 'rotate(-14deg) translate(-16%, -2%)' },
    '.deck:last-of-type:hover .card.c-r, .deck:last-of-type:focus-visible .card.c-r': { transform: 'rotate(12deg) translate(16%, -2%)' },
    '.deck:hover .card.c-top, .deck:focus-visible .card.c-top': {
      transform: 'translateY(-6%) scale(1.04)',
      filter: 'none',
      boxShadow: '0 30px 70px rgba(0,0,0,.6), 0 0 0 1px #2E77D6, 0 0 40px rgba(46,119,214,.35)',
    },
    '.deck:hover .deck-line': { width: '72px', boxShadow: '0 0 12px rgba(0,87,184,.8)' },
    '.deck:hover .deck-name': { color: 'brand.blueSoft' },
  },
}

// ─── VUELO DE LAS CARTAS ──────────────────────────────────────────
/**
 * Se monta junto con el carrusel (oculto). Crea una copia de cada carta en
 * su posición/rotación exacta del mazo y la lleva hasta el slide que le
 * corresponde. Al terminar avisa con onDone() para mostrar el carrusel real.
 */
function CardFlight({ flight, stageRef, isMobile, onDone }) {
  useLayoutEffect(() => {
    const { base, cards } = flight
    const ghosts = cards.map((c) => {
      const g = document.createElement('div')
      Object.assign(g.style, {
        position: 'fixed',
        zIndex: c.top ? 92 : 91,
        pointerEvents: 'none',
        left: `${base.left}px`,
        top: `${base.top}px`,
        width: `${base.width}px`,
        height: `${base.height}px`,
        borderRadius: '6px',
        border: '1px solid rgba(85,101,155,0.61)',
        backgroundImage: `url(${c.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      })
      document.body.appendChild(g)
      gsap.set(g, { rotation: c.rot, x: c.x, y: c.y, scale: c.s, filter: c.filter })
      return { g, c }
    })
    window.__lenis?.stop()

    const tl = gsap.timeline({
      onComplete: () => {
        onDone()
        ghosts.forEach(({ g }) => gsap.to(g, { opacity: 0, duration: 0.25, delay: 0.05, onComplete: () => g.remove() }))
        window.__lenis?.start()
      },
    })
    ghosts.forEach(({ g, c }, k) => {
      const el = stageRef.current?.querySelector(`[data-idx="${c.i}"]`)
      if (!el) return
      const r = el.getBoundingClientRect()
      const side = !c.top
      tl.to(
        g,
        {
          left: r.left,
          top: r.top,
          width: r.width,
          height: r.height,
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          filter: side ? 'brightness(.7)' : 'brightness(1)',
          opacity: side ? (isMobile ? 0 : 0.42) : 1,
          duration: 0.9,
          ease: 'power3.inOut',
        },
        c.top ? 0.12 : k * 0.05,
      )
    })

    return () => {
      tl.kill()
      ghosts.forEach(({ g }) => g.remove())
      window.__lenis?.start()
    }
    // La animación corre una sola vez por elección
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

// Lee rotación / traslación / escala reales de una carta
function readCard(el) {
  const cs = getComputedStyle(el)
  const m = cs.transform
  if (!m || m === 'none') return { rot: 0, x: 0, y: 0, s: 1, filter: cs.filter }
  const [a, b, , , e, f] = m.match(/-?[\d.e]+/g).map(Number)
  return { rot: (Math.atan2(b, a) * 180) / Math.PI, x: e, y: f, s: Math.hypot(a, b), filter: cs.filter }
}

// ─── MINI MAZO (cambiar de torneo desde la galería) ───────────────
function MiniDeck({ t, onClick, onHover }) {
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      onMouseEnter={onHover}
      onFocus={onHover}
      aria-label={`Ver ${t.name}`}
      role="group"
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={3.5}
      flex={{ base: 1, md: 'none' }}
      p="6px 14px 6px 10px"
      border="1px solid"
      borderColor="brand.line"
      borderRadius="md"
      bg="rgba(255,255,255,0.02)"
      transition="border-color .3s ease, background .3s ease"
      _hover={{ borderColor: 'brand.blueMid', bg: 'rgba(0,87,184,0.12)' }}
    >
      <Box position="relative" w="30px" h="38px" flexShrink={0}>
        <Box
          position="absolute"
          inset={0}
          borderRadius="3px"
          border="1px solid rgba(85,101,155,.61)"
          bgImage={`url(${t.photos[1].src})`}
          bgSize="cover"
          bgPos="center"
          filter="brightness(.5)"
          transform="rotate(-10deg)"
          transition={`transform .4s ${SPRING}`}
          _groupHover={{ transform: 'rotate(-18deg) translateX(-20%)' }}
        />
        <Box position="absolute" inset={0} borderRadius="3px" border="1px solid rgba(85,101,155,.61)" bgImage={`url(${t.photos[0].src})`} bgSize="cover" bgPos="center" />
      </Box>
      <Text fontFamily="condensed" fontSize="12px" fontWeight="600" letterSpacing="0.14em" textTransform="uppercase">
        {t.name}
      </Text>
    </Box>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────
export function GalleryMazo() {
  const { tournaments } = useTournamentGallery()
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()

  const [selectedId, setSelectedId] = useState(null)
  const [flight, setFlight] = useState(null)
  const [counter, setCounter] = useState('')
  const decksRef = useRef(null)
  const stageRef = useRef(null)
  const prefetched = useRef(new Set())

  const selected = tournaments.find((t) => t.id === selectedId) ?? null

  const prefetch = useCallback((t) => {
    if (prefetched.current.has(t.id)) return
    prefetched.current.add(t.id)
    t.photos.forEach((p) => {
      new Image().src = p.src
    })
  }, [])

  const choose = useCallback(
    (t, deckEl) => {
      if (flight) return
      prefetch(t)
      if (!reduced && !isMobile) {
        const base = deckEl.querySelector('.deck-cards').getBoundingClientRect()
        const cards = [...deckEl.querySelectorAll('.card')].map((el) => {
          const i = Number(el.dataset.i)
          return { i, top: el.classList.contains('c-top'), src: t.photos[i].src, ...readCard(el) }
        })
        setFlight({ base, cards })
      }
      setSelectedId(t.id)
    },
    [flight, reduced, isMobile, prefetch],
  )

  const back = useCallback(() => {
    setSelectedId(null)
    setFlight(null)
    setCounter('')
  }, [])

  // Esc vuelve a los mazos (si el lightbox está abierto, Esc solo lo cierra)
  useEffect(() => {
    if (!selected) return undefined
    const onKey = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return
      back()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, back])

  // Entrada de los mazos al hacer scroll
  useEffect(() => {
    if (selected || reduced || !decksRef.current) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-deck]',
        { y: isMobile ? 32 : 70, opacity: 0, rotation: (i) => (isMobile ? 0 : (i - 1) * 3) },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          duration: isMobile ? 0.6 : 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: decksRef.current, start: 'top 82%', once: true },
        },
      )
    }, decksRef)
    return () => ctx.revert()
  }, [selected, reduced, isMobile])

  const onIndexChange = useCallback((i, total) => setCounter(`${pad2(i + 1)} / ${pad2(total)}`), [])
  const endFlight = useCallback(() => setFlight(null), [])
  const intro = Boolean(flight)
  const simple = reduced || isMobile

  if (!tournaments.length) return <GalleryFrame label="Galería de fotos" meta="" />

  return (
    <GalleryFrame label="Galería de fotos por torneo" meta={selected ? counter : 'Elegí un torneo'}>
      {!selected ? (
        <Box
          ref={decksRef}
          position="relative"
          zIndex={5}
          px={PX}
          display="grid"
          gridTemplateColumns={{ base: '1fr', md: `repeat(${tournaments.length}, 1fr)` }}
          gap={{ base: '14px', md: 'clamp(24px, 4vw, 64px)' }}
          alignItems="end"
          sx={decksSx}
        >
          {tournaments.map((t, k) => (
            <Deck key={t.id} t={t} index={k} onSelect={choose} onHover={prefetch} />
          ))}
        </Box>
      ) : (
        <Box position="relative" zIndex={5}>
          <Flex
            px={PX}
            mb={6}
            align="center"
            justify="space-between"
            gap={4}
            wrap="wrap"
            opacity={intro ? 0 : 1}
            transform={intro ? 'translateY(12px)' : 'none'}
            transition="opacity .45s ease, transform .45s cubic-bezier(.22,1,.36,1)"
          >
            <Box
              as="button"
              type="button"
              onClick={back}
              display="inline-flex"
              alignItems="center"
              gap={2.5}
              px={4.5}
              py="11px"
              borderRadius="md"
              bg="rgba(255,255,255,0.04)"
              border="1px solid rgba(255,255,255,0.16)"
              fontFamily="condensed"
              fontWeight="600"
              fontSize="13px"
              letterSpacing="0.1em"
              textTransform="uppercase"
              transition="background .3s ease, border-color .3s ease"
              sx={{ clipPath: cutCorner('11px', 'tl') }}
              _hover={{ bg: 'brand.blue', borderColor: 'brand.blue' }}
            >
              <span aria-hidden="true">⟨</span> Torneos
            </Box>

            <Flex align="baseline" gap={3.5} mr="auto" order={{ base: -1, md: 0 }} w={{ base: '100%', md: 'auto' }}>
              <Text as="h3" fontFamily="heading" fontWeight="medium" textTransform="uppercase" fontSize="clamp(24px, 3vw, 40px)" lineHeight={1} letterSpacing="0.02em">
                {selected.name}
              </Text>
              <Text fontFamily="condensed" fontSize="12px" fontWeight="600" letterSpacing="0.24em" textTransform="uppercase" color="brand.blueLight">
                {selected.season}
              </Text>
            </Flex>

            <Flex gap={2.5} w={{ base: '100%', md: 'auto' }}>
              {tournaments
                .filter((t) => t.id !== selected.id)
                .map((t) => (
                  <MiniDeck key={t.id} t={t} onClick={() => setSelectedId(t.id)} onHover={() => prefetch(t)} />
                ))}
            </Flex>
          </Flex>

          {/* Cambio de mazo: las cartas actuales caen y las nuevas se reparten.
              Al elegir en mobile la galería entra con un fundido (sin vuelo). */}
          <AnimatePresence mode="wait" initial={isMobile && !reduced}>
            <motion.div
              key={selected.id}
              ref={stageRef}
              initial={simple ? { opacity: 0 } : { opacity: 0, y: -60, rotate: 2 }}
              animate={simple ? { opacity: 1, transition: { duration: 0.3 } } : { opacity: 1, y: 0, rotate: 0, transition: { type: 'spring', stiffness: 220, damping: 22 } }}
              exit={simple ? { opacity: 0, transition: { duration: 0.2 } } : { opacity: 0, y: 50, rotate: -2, transition: { duration: 0.3, ease: 'easeIn' } }}
            >
              <CoverflowGallery images={selected.photos} label={selected.name} intro={intro} onIndexChange={onIndexChange} />
            </motion.div>
          </AnimatePresence>

          {flight && <CardFlight flight={flight} stageRef={stageRef} isMobile={isMobile} onDone={endFlight} />}
        </Box>
      )}
    </GalleryFrame>
  )
}

export default GalleryMazo
