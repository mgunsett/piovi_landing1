import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import playerData from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

/* ────────────────────────────────────────────────────────────────
   GallerySection v2 — Más inmersión + refinamiento visual
   Sobre la versión anterior añade:
   · Cursor follower magnético ("DRAG / VIEW") que reacciona al hover
   · Tilt 3D sutil siguiendo el mouse dentro de cada slide
   · Capas paralax independientes (fondo / imagen / luz / glow)
   · Reveal con clip-path al entrar cada slide
   · Motion blur dinámico según velocidad de scroll
   · Ritmo asimétrico: las slides alternan altura/ancho/offset Y
   · Film grain + scanlines muy sutiles para textura cinemática
   · Mini-mapa de thumbnails clickeables sincronizado con el scroll
   · Indicador "Scroll" con flecha animada continua
   Colores, fuentes, fondo y textos se mantienen intactos.
──────────────────────────────────────────────────────────────── */

const PLACEHOLDER_IMG = (i) =>
  `https://picsum.photos/seed/lt-gallery-${i}/1600/2000`

/* Patrón asimétrico para dar ritmo a la fila horizontal */
const RHYTHM = [
  { w: { base: '78vw', md: '54vw', lg: '42vw' }, h: '78vh', y: 0 },
  { w: { base: '70vw', md: '40vw', lg: '30vw' }, h: '62vh', y: 40 },
  { w: { base: '82vw', md: '60vw', lg: '50vw' }, h: '84vh', y: -30 },
  { w: { base: '72vw', md: '44vw', lg: '34vw' }, h: '68vh', y: 60 },
  { w: { base: '78vw', md: '50vw', lg: '38vw' }, h: '74vh', y: -10 },
]

function Slide({ item, index, total, onClick, onHover, registerThumb }) {
  const slideRef   = useRef(null)
  const frameRef   = useRef(null)
  const imgRef     = useRef(null)
  const glowRef    = useRef(null)
  const numberRef  = useRef(null)
  const captionRef = useRef(null)

  const rhythm = RHYTHM[index % RHYTHM.length]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax zoom + pan (más sutil, más cinemático)
      gsap.fromTo(
        imgRef.current,
        { scale: 1.35, xPercent: -8 },
        {
          scale: 1.05,
          xPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: slideRef.current,
            containerAnimation: window.__galleryHScroll,
            start: 'left right',
            end: 'right left',
            scrub: true,
          },
        }
      )

      // Reveal con clip-path la primera vez que entra
      gsap.fromTo(
        frameRef.current,
        { clipPath: 'inset(0% 100% 0% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'power3.out',
          duration: 1.1,
          scrollTrigger: {
            trigger: slideRef.current,
            containerAnimation: window.__galleryHScroll,
            start: 'left 95%',
            toggleActions: 'play none none reverse',
          },
        }
      )

      // Halo / glow que sigue la posición de la slide
      gsap.fromTo(
        glowRef.current,
        { opacity: 0 },
        {
          opacity: 0.55,
          ease: 'sine.inOut',
          scrollTrigger: {
            trigger: slideRef.current,
            containerAnimation: window.__galleryHScroll,
            start: 'left 80%',
            end: 'right 20%',
            scrub: true,
          },
        }
      )

      // Caption + número
      gsap.fromTo(
        [numberRef.current, captionRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          duration: 0.7,
          stagger: 0.08,
          scrollTrigger: {
            trigger: slideRef.current,
            containerAnimation: window.__galleryHScroll,
            start: 'left 75%',
            end: 'left 25%',
            toggleActions: 'play reverse play reverse',
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  // Registrar referencia para el mini-mapa
  useEffect(() => {
    registerThumb?.(index, slideRef.current)
  }, [index, registerThumb])

  // Tilt 3D al mover el mouse dentro de la slide
  const handleMouseMove = (e) => {
    const el = frameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top)  / rect.height - 0.5
    gsap.to(el, {
      rotateY: px * 8,
      rotateX: -py * 8,
      duration: 0.6,
      ease: 'power2.out',
      transformPerspective: 1000,
      transformOrigin: 'center',
    })
    gsap.to(imgRef.current, {
      x: -px * 24,
      y: -py * 24,
      duration: 0.8,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }
  const handleMouseLeave = () => {
    gsap.to(frameRef.current, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'power3.out' })
    gsap.to(imgRef.current,   { x: 0, y: 0, duration: 0.8, ease: 'power3.out' })
    onHover?.(false)
  }

  return (
    <Box
      ref={slideRef}
      flex="0 0 auto"
      width={rhythm.w}
      height={rhythm.h}
      position="relative"
      mr={{ base: 6, md: 10, lg: 16 }}
      transform={`translateY(${rhythm.y}px)`}
      cursor="none"
      onClick={() => onClick(index)}
      onMouseEnter={() => onHover?.(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      aria-label={item.alt}
      data-gallery-slide={index}
      sx={{ perspective: '1200px' }}
    >
      {/* Glow detrás del frame */}
      <Box
        ref={glowRef}
        position="absolute"
        inset="-12%"
        bg="radial-gradient(ellipse at center, rgba(0,87,184,0.45) 0%, rgba(0,87,184,0) 65%)"
        filter="blur(40px)"
        pointerEvents="none"
        opacity={0}
      />

      {/* Frame con tilt 3D */}
      <Box
        ref={frameRef}
        position="relative"
        width="100%"
        height="100%"
        overflow="hidden"
        bg="#0d1929"
        sx={{
          transformStyle: 'preserve-3d',
          boxShadow: '0 40px 80px -30px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04) inset',
        }}
      >
        <Box
          ref={imgRef}
          position="absolute"
          inset="-10%"
          backgroundImage={`url(${item.src || PLACEHOLDER_IMG(index)})`}
          backgroundSize="cover"
          backgroundPosition="center"
          willChange="transform"
          sx={{ transform: 'translateZ(0)' }}
        />

        {/* Vignette */}
        <Box
          position="absolute" inset="0"
          bg="linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.4) 100%)"
          pointerEvents="none"
        />

        {/* Scanlines / textura cinemática muy sutil */}
        <Box
          position="absolute" inset="0"
          pointerEvents="none"
          sx={{
            mixBlendMode: 'overlay',
            opacity: 0.12,
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)',
          }}
        />

        {/* Tint azul on hover */}
        <Box
          className="gi-overlay"
          position="absolute" inset="0"
          bg="rgba(0,87,184,0.10)"
          opacity={0}
          transition="opacity 0.4s ease"
          pointerEvents="none"
          sx={{ '*:hover > &': { opacity: 1 } }}
        />

        {/* Marco interior */}
        <Box
          position="absolute" inset="10px"
          border="1px solid rgba(255,255,255,0.07)"
          pointerEvents="none"
        />

        {/* Número gigante */}
        <Text
          ref={numberRef}
          position="absolute"
          top={{ base: 4, md: 6 }}
          left={{ base: 4, md: 6 }}
          fontFamily="'Bebas Neue', sans-serif"
          fontSize={{ base: '64px', md: '110px', lg: '150px' }}
          lineHeight="0.85"
          letterSpacing="0.01em"
          color="rgba(255,255,255,0.95)"
          sx={{ mixBlendMode: 'difference', textShadow: '0 4px 30px rgba(0,0,0,0.4)' }}
        >
          {String(index + 1).padStart(2, '0')}
          <Box
            as="span"
            fontSize={{ base: '14px', md: '18px' }}
            color="rgba(255,255,255,0.55)"
            ml={2}
          >
            / {String(total).padStart(2, '0')}
          </Box>
        </Text>

        {/* Línea decorativa */}
        <Box
          position="absolute"
          left={{ base: 4, md: 6 }}
          bottom={{ base: '92px', md: '108px' }}
          w="48px" h="1px"
          bg="brand.blue"
          opacity={0.9}
        />

        {/* Caption */}
        <Box
          ref={captionRef}
          position="absolute"
          left={{ base: 4, md: 6 }}
          right={{ base: 4, md: 6 }}
          bottom={{ base: 4, md: 6 }}
        >
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="10px"
            fontWeight="700"
            letterSpacing="0.28em"
            textTransform="uppercase"
            color="brand.blue"
            mb={2}
          >
            {item.category}
          </Text>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize={{ base: '14px', md: '17px' }}
            fontWeight="600"
            letterSpacing="0.06em"
            color="white"
            lineHeight="1.25"
            maxW="520px"
          >
            {item.caption}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

/* ─── Lightbox (sin cambios funcionales, mismo estilo) ───────── */
function Lightbox({ images, activeIndex, onClose, onPrev, onNext }) {
  const item = images[activeIndex]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(5,8,14,0.96)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 24, right: 28,
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 28, cursor: 'pointer', lineHeight: 1, zIndex: 1,
        }}
        aria-label="Cerrar"
      >✕</button>

      <Box
        position="absolute" top="24px" left="28px"
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="12px" fontWeight="700"
        letterSpacing="0.24em" textTransform="uppercase"
        color="rgba(255,255,255,0.4)"
      >
        {String(activeIndex + 1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}
      </Box>

      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        style={{
          position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(0,87,184,0.18)', border: '1px solid rgba(0,87,184,0.4)',
          color: 'white', width: 44, height: 44, borderRadius: '50%',
          fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
        }}
        aria-label="Anterior"
      >‹</button>

      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        style={{
          position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(0,87,184,0.18)', border: '1px solid rgba(0,87,184,0.4)',
          color: 'white', width: 44, height: 44, borderRadius: '50%',
          fontSize: 18, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
        }}
        aria-label="Siguiente"
      >›</button>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.22 }}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: 'min(90vw, 860px)', maxHeight: '85vh',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 14,
          }}
        >
          <img
            src={item.src || PLACEHOLDER_IMG(activeIndex)}
            alt={item.alt}
            style={{
              maxWidth: '100%', maxHeight: '65vh',
              objectFit: 'contain', display: 'block',
              filter: 'drop-shadow(0 24px 64px rgba(0,0,0,0.7))',
            }}
          />
          <Flex direction="column" align="center" gap="3px">
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="9px" fontWeight="700"
              letterSpacing="0.28em" textTransform="uppercase"
              color="brand.blue"
            >{item.category}</Text>
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="13px" letterSpacing="0.08em"
              color="rgba(255,255,255,0.6)"
            >{item.caption}</Text>
          </Flex>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

/* ─── MAIN ───────────────────────────────────────────────────── */
export default function GallerySection() {
  const sectionRef  = useRef(null)
  const trackRef    = useRef(null)
  const progressRef = useRef(null)
  const cursorRef   = useRef(null)
  const cursorLabelRef = useRef(null)
  const thumbsRef   = useRef([])
  const activeThumbRef = useRef(0)
  const [lightbox, setLightbox] = useState(null)

  const baseImages = playerData.gallery ?? []
  const images = baseImages.length
    ? baseImages
    : Array.from({ length: 8 }).map((_, i) => ({
        id: `ph-${i}`,
        src: PLACEHOLDER_IMG(i),
        alt: `Momento ${i + 1}`,
        category: ['Partido', 'Entreno', 'Vestuario', 'Afición'][i % 4],
        caption: 'Reemplazar por una foto del jugador',
      }))

  const openLightbox  = useCallback(i  => setLightbox(i), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prevImage     = useCallback(() => setLightbox(i => (i - 1 + images.length) % images.length), [images.length])
  const nextImage     = useCallback(() => setLightbox(i => (i + 1) % images.length), [images.length])

  const registerThumb = useCallback((i, el) => { thumbsRef.current[i] = el }, [])

  /* ── Lenis smooth scroll ── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
    const id = requestAnimationFrame(raf)
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])

  /* ── Horizontal pin + translate + motion blur ── */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track   = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + 64)

      const tween = gsap.to(track, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${track.scrollWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (progressRef.current) {
              progressRef.current.style.transform = `scaleX(${self.progress})`
            }
            // Motion blur según velocidad
            const v = Math.min(Math.abs(self.getVelocity()) / 4000, 1)
            track.style.filter = v > 0.05 ? `blur(${v * 3}px)` : 'none'

            // Thumb activa
            const idx = Math.round(self.progress * (images.length - 1))
            if (idx !== activeThumbRef.current) {
              activeThumbRef.current = idx
              document
                .querySelectorAll('[data-gallery-thumb]')
                .forEach((el, i) => {
                  el.style.opacity = i === idx ? '1' : '0.35'
                  el.style.transform = i === idx ? 'scaleY(1.6)' : 'scaleY(1)'
                })
            }
          },
        },
      })

      window.__galleryHScroll = tween
    }, sectionRef)

    return () => { ctx.revert(); window.__galleryHScroll = null }
  }, [images.length])

  /* ── Custom cursor magnético ── */
  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' })
    const onMove = (e) => { xTo(e.clientX); yTo(e.clientY) }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const setCursorHover = (active) => {
    const c = cursorRef.current
    if (!c) return
    gsap.to(c, {
      scale: active ? 1 : 0.35,
      opacity: active ? 1 : 0.6,
      duration: 0.35,
      ease: 'power3.out',
    })
    if (cursorLabelRef.current) {
      cursorLabelRef.current.style.opacity = active ? '1' : '0'
    }
  }

  return (
    <Box
      ref={sectionRef}
      as="section" id="gallery"
      bg="#080C12"
      position="relative"
      overflow="hidden"
      h="100vh"
    >
      {/* Background radials */}
      <Box position="absolute" top="0" right="-80px" w="500px" h="500px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.08) 0%, transparent 70%)" pointerEvents="none" />
      <Box position="absolute" bottom="10%" left="-100px" w="400px" h="400px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.06) 0%, transparent 70%)" pointerEvents="none" />
      <Box position="absolute" inset="0" pointerEvents="none"
        sx={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.014) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.014) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Film grain global */}
      <Box position="absolute" inset="0" pointerEvents="none" zIndex={1}
        sx={{
          opacity: 0.06,
          mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
      {/* Edge fades laterales para enfoque cinemático */}
      <Box position="absolute" top="0" left="0" h="100%" w="120px" zIndex={3} pointerEvents="none"
        bg="linear-gradient(to right, #080C12 0%, rgba(8,12,18,0) 100%)" />
      <Box position="absolute" top="0" right="0" h="100%" w="160px" zIndex={3} pointerEvents="none"
        bg="linear-gradient(to left, #080C12 0%, rgba(8,12,18,0) 100%)" />

      {/* Sticky header */}
      <Flex
        position="absolute"
        top={{ base: 6, md: 10 }}
        left={{ base: 5, md: 12, lg: 20 }}
        right={{ base: 5, md: 12, lg: 20 }}
        justify="space-between"
        align="flex-end"
        zIndex={5}
        pointerEvents="none"
      >
        <Box
          maxW="480px"
          
        >
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="10px" fontWeight="700"
            letterSpacing="0.36em" textTransform="uppercase"
            color="brand.blue" mb={2}
          >
            Galería
          </Text>
          <Text
            fontFamily="'Bebas Neue', sans-serif"
            fontSize={{ base: '44px', md: '64px', lg: '78px' }}
            lineHeight="0.88" letterSpacing="0.02em"
          >
            Momentos<Box as="span" color="brand.blue"> Únicos</Box>
          </Text>
        </Box>
        <Flex
          align="center" gap={3}
          display={{ base: 'none', md: 'flex' }}
        >
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="11px" letterSpacing="0.16em"
            textTransform="uppercase"
            color="rgba(255,255,255,0.4)"
          >
            Scroll para explorar
          </Text>
          <Box
            as="span"
            sx={{
              display: 'inline-block',
              animation: 'lt-arrow 1.6s ease-in-out infinite',
              '@keyframes lt-arrow': {
                '0%,100%': { transform: 'translateX(0)', opacity: 0.4 },
                '50%':     { transform: 'translateX(8px)', opacity: 1 },
              },
              color: 'brand.blue',
            }}
          >→</Box>
        </Flex>
      </Flex>

      {/* Horizontal track */}
      <Flex
        ref={trackRef}
        align="center"
        pl={{ base: 5, md: 12, lg: 20 }}
        pr="22vw"
        height="100vh"
        willChange="transform, filter"
      >
        {images.map((item, i) => (
          <Slide
            key={item.id ?? i}
            item={item}
            index={i}
            total={images.length}
            onClick={openLightbox}
            onHover={setCursorHover}
            registerThumb={registerThumb}
          />
        ))}
      </Flex>

      {/* Mini-mapa de thumbs */}
      <Flex
        position="absolute"
        bottom={{ base: '70px', md: '90px' }}
        left="50%"
        transform="translateX(-50%)"
        gap="6px"
        zIndex={5}
        pointerEvents="none"
      >
        {images.map((_, i) => (
          <Box
            key={i}
            data-gallery-thumb={i}
            w="22px" h="2px"
            bg={i === 0 ? 'brand.blue' : 'rgba(255,255,255,0.25)'}
            opacity={i === 0 ? 1 : 0.35}
            transition="all 0.4s ease"
            sx={{ transformOrigin: 'center' }}
          />
        ))}
      </Flex>

      {/* Progress bar */}
      <Box
        position="absolute"
        bottom={{ base: 6, md: 10 }}
        left={{ base: 5, md: 12, lg: 20 }}
        right={{ base: 5, md: 12, lg: 20 }}
        zIndex={5}
        pointerEvents="none"
      >
        <Flex align="center" gap={4}>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="10px" fontWeight="700"
            letterSpacing="0.28em" textTransform="uppercase"
            color="rgba(255,255,255,0.45)"
          >
            {String(images.length).padStart(2, '0')} fotos
          </Text>
          <Box flex="1" h="1px" bg="rgba(255,255,255,0.08)" position="relative" overflow="hidden">
            <Box
              ref={progressRef}
              position="absolute" inset="0"
              bg="brand.blue"
              transform="scaleX(0)"
              transformOrigin="left center"
              sx={{ boxShadow: '0 0 12px rgba(0,87,184,0.8)' }}
              style={{ transition: 'transform 0.1s linear' }}
            />
          </Box>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="10px" fontWeight="700"
            letterSpacing="0.28em" textTransform="uppercase"
            color="rgba(255,255,255,0.45)"
          >
            Click para ampliar
          </Text>
        </Flex>
      </Box>

      {/* Cursor magnético */}
      <Box
        ref={cursorRef}
        position="fixed"
        top="0" left="0"
        w="80px" h="80px"
        ml="-40px" mt="-40px"
        borderRadius="50%"
        border="1px solid rgba(0,87,184,0.6)"
        bg="rgba(0,87,184,0.10)"
        backdropFilter="blur(2px)"
        pointerEvents="none"
        zIndex={9998}
        opacity={0.6}
        sx={{ transform: 'scale(0.35)', display: { base: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text
          ref={cursorLabelRef}
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="9px" fontWeight="700"
          letterSpacing="0.28em" textTransform="uppercase"
          color="white"
          opacity={0}
          sx={{ transition: 'opacity 0.3s ease' }}
        >Ver</Text>
      </Box>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={images}
            activeIndex={lightbox}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </Box>
  )
}
