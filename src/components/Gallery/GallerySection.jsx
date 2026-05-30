import { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import playerData from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

const PLACEHOLDER_IMG = (i) =>
  `https://picsum.photos/seed/lt-gallery-${i}/1600/2000`

const SLIDE_SIZE = { w: { base: '82vw', md: '38vw', lg: '30vw' }, h: '66vh', y: 0 }

function Slide({ item, index, onClick, onHover, registerThumb }) {
  const slideRef   = useRef(null)
  const frameRef   = useRef(null)
  const imgRef     = useRef(null)
  const glowRef    = useRef(null)
  const captionRef = useRef(null)

  const rhythm = SLIDE_SIZE

  useEffect(() => {
    if (!window.__galleryHScroll) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgRef.current,
        { scale: 1.08, xPercent: -3 },
        {
          scale: 1.0,
          xPercent: 3,
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
      gsap.fromTo(
        captionRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: 'power3.out',
          duration: 0.7,
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

  useEffect(() => {
    registerThumb?.(index, slideRef.current)
  }, [index, registerThumb])

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
      mr={{ base: 3, md: 5, lg: 8 }}
      transform={`translateY(${rhythm.y}px)`}
      cursor="none"
      onClick={() => onClick(index)}
      onMouseEnter={() => onHover?.(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="button"
      aria-label={item.alt}
      data-gallery-slide={index}
      sx={{
        perspective: '1200px',
        scrollSnapAlign: 'start',
      }}
    >
      <Box
        ref={glowRef}
        position="absolute"
        inset="-12%"
        bg="radial-gradient(ellipse at center, rgba(0,87,184,0.45) 0%, rgba(0,87,184,0) 65%)"
        filter="blur(40px)"
        pointerEvents="none"
        opacity={0}
      />
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
        <Box
          position="absolute" inset="0"
          bg="linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.4) 100%)"
          pointerEvents="none"
        />
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
        <Box
          className="gi-overlay"
          position="absolute" inset="0"
          bg="rgba(0,87,184,0.10)"
          opacity={0}
          transition="opacity 0.4s ease"
          pointerEvents="none"
          sx={{ '*:hover > &': { opacity: 1 } }}
        />
        <Box
          ref={captionRef}
          position="absolute"
          left={{ base: 4, md: 6 }}
          right={{ base: 4, md: 6 }}
          bottom={{ base: 4, md: 6 }}
        >
          <Box w="36px" h="1px" bg="brand.blue" opacity={0.9} mb={3} />
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="10px" fontWeight="700"
            letterSpacing="0.28em" textTransform="uppercase"
            color="brand.blue" mb={2}
          >
            {item.category}
          </Text>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize={{ base: '13px', md: '17px' }}
            fontWeight="600" letterSpacing="0.06em"
            color="white" lineHeight="1.25" maxW="520px"
          >
            {item.caption}
          </Text>
        </Box>
      </Box>
    </Box>
  )
}

/* ─── Lightbox ───────────────────────────────────────────────── */
function Lightbox({ images, activeIndex, onClose, onPrev, onNext, isMobile }) {
  const item     = images[activeIndex]
  const prevItem = images[(activeIndex - 1 + images.length) % images.length]
  const nextItem = images[(activeIndex + 1) % images.length]
  const touchStartX = useRef(0)

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

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd   = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (dx > 50)       onPrev()
    else if (dx < -50) onNext()
  }

  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: 'rgba(4,7,13,0.97)',
        backdropFilter: 'blur(6px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Botón cerrar */}
      <button
        onClick={e => { e.stopPropagation(); onClose() }}
        style={{
          position: 'absolute', top: 24, right: 28,
          background: 'rgba(255,255,255,0.14)',
          border: '1px solid rgba(255,255,255,0.32)',
          color: 'white', width: 44, height: 44, borderRadius: '50%',
          fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 200,
        }}
        aria-label="Cerrar"
      >✕</button>

      {/* Contador */}
      <Box
        position="absolute" top="28px" left="28px" zIndex={200}
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="11px" fontWeight="700"
        letterSpacing="0.24em" textTransform="uppercase"
        color="rgba(255,255,255,0.4)"
      >
        {String(activeIndex + 1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}
      </Box>

      {isMobile ? (
        /* ── Mobile: imagen centrada con swipe ── */
        <div
          onClick={e => e.stopPropagation()}
          style={{ width: '100%', padding: '0 20px', display: 'flex', justifyContent: 'center' }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, width: '100%' }}
            >
              <img
                src={item.src || PLACEHOLDER_IMG(activeIndex)}
                alt={item.alt}
                style={{
                  maxWidth: '100%', maxHeight: '68vh',
                  objectFit: 'contain', display: 'block',
                  filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.8))',
                }}
              />
              <Flex direction="column" align="center" gap="4px">
                <Text
                  fontFamily="'Barlow Condensed', sans-serif"
                  fontSize="9px" fontWeight="700"
                  letterSpacing="0.28em" textTransform="uppercase"
                  color="brand.blue"
                >{item.category}</Text>
                <Text
                  fontFamily="'Barlow Condensed', sans-serif"
                  fontSize="12px" letterSpacing="0.06em"
                  color="rgba(255,255,255,0.55)"
                  textAlign="center"
                >{item.caption}</Text>
              </Flex>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        /* ── Desktop: layout 3 columnas con alas ── */
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', gap: '4px', padding: '0 12px',
          }}
          onClick={e => e.stopPropagation()}
        >
          <div
            style={{
              flexShrink: 0, width: 'clamp(70px, 13vw, 200px)', height: '52vh',
              position: 'relative', overflow: 'hidden',
              opacity: 0.58, cursor: 'pointer',
              transform: 'translateY(52px)',
              clipPath: 'polygon(0 0, 78% 0, 100% 18%, 100% 100%, 0 100%)',
            }}
            onClick={onPrev}
          >
            <img
              src={prevItem.src || PLACEHOLDER_IMG((activeIndex - 1 + images.length) % images.length)}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(3px)', transform: 'scale(1.06)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(4,7,13,0.18) 0%, rgba(4,7,13,0.82) 100%)' }} />
            <div style={{ position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: 26, lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>‹</div>
          </div>

          <div style={{ flex: '0 0 auto', width: 'min(56vw, 800px)', display: 'flex', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}
              >
                <img
                  src={item.src || PLACEHOLDER_IMG(activeIndex)}
                  alt={item.alt}
                  style={{
                    maxWidth: '100%', maxHeight: '80vh',
                    objectFit: 'contain', display: 'block',
                    filter: 'drop-shadow(0 32px 80px rgba(0,0,0,0.8))',
                  }}
                />
                <Flex direction="column" align="center" gap="4px">
                  <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="9px" fontWeight="700" letterSpacing="0.28em" textTransform="uppercase" color="brand.blue">{item.category}</Text>
                  <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="13px" letterSpacing="0.08em" color="rgba(255,255,255,0.55)">{item.caption}</Text>
                </Flex>
              </motion.div>
            </AnimatePresence>
          </div>

          <div
            style={{
              flexShrink: 0, width: 'clamp(70px, 13vw, 200px)', height: '52vh',
              position: 'relative', overflow: 'hidden',
              opacity: 0.58, cursor: 'pointer',
              transform: 'translateY(52px)',
              clipPath: 'polygon(0 18%, 22% 0, 100% 0, 100% 100%, 0 100%)',
            }}
            onClick={onNext}
          >
            <img
              src={nextItem.src || PLACEHOLDER_IMG((activeIndex + 1) % images.length)}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(3px)', transform: 'scale(1.06)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(4,7,13,0.18) 0%, rgba(4,7,13,0.82) 100%)' }} />
            <div style={{ position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: 26, lineHeight: 1, textShadow: '0 2px 8px rgba(0,0,0,0.7)' }}>›</div>
          </div>
        </div>
      )}

      {/* Navegación inferior — solo mobile */}
      {isMobile && (
        <div style={{
          position: 'absolute', bottom: 28, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 20, zIndex: 200,
        }}>
          <button
            onClick={e => { e.stopPropagation(); onPrev() }}
            style={{
              background: 'rgba(0,87,184,0.2)', border: '1px solid rgba(0,87,184,0.45)',
              color: 'white', width: 52, height: 52, borderRadius: '50%',
              fontSize: 24, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >‹</button>
          <button
            onClick={e => { e.stopPropagation(); onNext() }}
            style={{
              background: 'rgba(0,87,184,0.2)', border: '1px solid rgba(0,87,184,0.45)',
              color: 'white', width: 52, height: 52, borderRadius: '50%',
              fontSize: 24, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >›</button>
        </div>
      )}
    </motion.div>
  )
}

/* ─── MAIN ───────────────────────────────────────────────────── */
export default function GallerySection() {
  const sectionRef     = useRef(null)
  const trackRef       = useRef(null)
  const progressRef    = useRef(null)
  const cursorRef      = useRef(null)
  const cursorLabelRef = useRef(null)
  const thumbsRef      = useRef([])
  const activeThumbRef = useRef(0)
  const [lightbox, setLightbox] = useState(null)
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false

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

  /* ── Lenis — solo desktop ── */
  useEffect(() => {
    if (window.innerWidth < 768) return
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    })
    lenis.on('scroll', ScrollTrigger.update)
    const rafFn = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(rafFn)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(rafFn)
      lenis.destroy()
    }
  }, [])

  /* ── GSAP horizontal pin — solo desktop vía matchMedia ── */
  useLayoutEffect(() => {
    const track   = trackRef.current
    const section = sectionRef.current
    if (!track || !section) return

    const mm = gsap.matchMedia(section)

    mm.add('(min-width: 768px)', () => {
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
            const idx = Math.round(self.progress * (images.length - 1))
            if (idx !== activeThumbRef.current) {
              activeThumbRef.current = idx
              document.querySelectorAll('[data-gallery-thumb]').forEach((el, i) => {
                el.style.opacity = i === idx ? '1' : '0.35'
                el.style.transform = i === idx ? 'scaleY(1.6)' : 'scaleY(1)'
              })
            }
          },
        },
      })

      window.__galleryHScroll = tween
      return () => { window.__galleryHScroll = null }
    })

    return () => { mm.revert(); window.__galleryHScroll = null }
  }, [images.length])

  /* ── Mobile: sincronizar progress bar + thumbs con scroll nativo ── */
  useEffect(() => {
    const track = trackRef.current
    if (!track || !isMobile) return

    const handleScroll = () => {
      const maxScroll = track.scrollWidth - track.clientWidth
      if (maxScroll <= 0) return
      const progress = track.scrollLeft / maxScroll

      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`
      }
      const idx = Math.round(progress * (images.length - 1))
      if (idx !== activeThumbRef.current) {
        activeThumbRef.current = idx
        document.querySelectorAll('[data-gallery-thumb]').forEach((el, i) => {
          el.style.opacity = i === idx ? '1' : '0.35'
          el.style.transform = i === idx ? 'scaleY(1.6)' : 'scaleY(1)'
        })
      }
    }

    track.addEventListener('scroll', handleScroll, { passive: true })
    return () => track.removeEventListener('scroll', handleScroll)
  }, [isMobile, images.length])

  /* ── Cursor magnético ── */
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
    gsap.to(c, { scale: active ? 1 : 0.35, opacity: active ? 1 : 0.6, duration: 0.35, ease: 'power3.out' })
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
      h={{ base: '100dvh', md: '100vh' }}
    >
      {/* Fondos decorativos */}
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
      <Box position="absolute" inset="0" pointerEvents="none" zIndex={1}
        sx={{
          opacity: 0.06, mixBlendMode: 'overlay',
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />
      {/* Edge fades — más pequeños en mobile */}
      <Box position="absolute" top="0" left="0" h="100%" w={{ base: '32px', md: '120px' }} zIndex={3} pointerEvents="none"
        bg="linear-gradient(to right, #080C12 0%, rgba(8,12,18,0) 100%)" />
      <Box position="absolute" top="0" right="0" h="100%" w={{ base: '32px', md: '160px' }} zIndex={3} pointerEvents="none"
        bg="linear-gradient(to left, #080C12 0%, rgba(8,12,18,0) 100%)" />

      {/* Header */}
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
        <Box maxW="480px">
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
          <Box mt={{ base: 3, md: 4 }} display="flex" alignItems="center" gap={3}>
            <Box w="36px" h="1px" bg="brand.blue" opacity={0.8} />
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="9px" fontWeight="600"
              letterSpacing="0.3em" textTransform="uppercase"
              color="rgba(255,255,255,0.28)"
            >
              {isMobile ? 'Deslizá  →' : 'Deslizá para explorar'}
            </Text>
          </Box>
        </Box>
        <Box
          display={{ base: 'none', md: 'flex' }}
          alignItems="center" gap={3} opacity={0.5}
          sx={{
            animation: 'lt-arrow-pulse 2.4s ease-in-out infinite',
            '@keyframes lt-arrow-pulse': {
              '0%,100%': { opacity: 0.4, transform: 'translateX(0)' },
              '50%':     { opacity: 0.75, transform: 'translateX(6px)' },
            },
          }}
        >
          <Box w="28px" h="1px" bg="rgba(255,255,255,0.35)" />
          <Box as="span" color="brand.blue" fontSize="18px" lineHeight="1">→</Box>
        </Box>
      </Flex>

      {/* Track horizontal */}
      <Flex
        ref={trackRef}
        align="center"
        pl={{ base: 5, md: 12, lg: 20 }}
        pr={{ base: '8vw', md: '22vw' }}
        height="100%"
        pt={{ base: '130px', md: '170px', lg: '190px' }}
        willChange="transform"
        sx={{
          '@media (max-width: 767px)': {
            overflowX: 'scroll',
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { display: 'none' },
          },
        }}
      >
        {images.map((item, i) => (
          <Slide
            key={item.id ?? i}
            item={item}
            index={i}
            onClick={openLightbox}
            onHover={setCursorHover}
            registerThumb={registerThumb}
          />
        ))}
      </Flex>

      {/* Mini-mapa de thumbs */}
      <Flex
        position="absolute"
        bottom={{ base: '64px', md: '90px' }}
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
        bottom={{ base: 5, md: 10 }}
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
            display={{ base: 'none', md: 'block' }}
          >
            Click para ampliar
          </Text>
        </Flex>
      </Box>

      {/* Cursor magnético — solo desktop */}
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
          color="white" opacity={0}
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
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </Box>
  )
}
