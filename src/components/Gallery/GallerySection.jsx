import { useEffect, useRef, useState, useCallback } from 'react'
import { Box, Flex, Text, useBreakpointValue } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import playerData from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

// ─── HELPERS ─────────────────────────────────────────────────────
const SLIDE_W_MD  = '48vw'   // center slide width desktop
const SLIDE_W_BASE = '82vw'  // center slide width mobile
const SLIDE_H_MD  = '62vh'
const SLIDE_H_BASE = '52vh'

// Distance the side slides travel from center (% of their own width)
const SIDE_X = '68%'

// ─── ARROW BUTTON ─────────────────────────────────────────────────
function ArrowBtn({ direction, onClick, disabled }) {
  return (
    <Box
      as="button"
      onClick={onClick}
      disabled={disabled}
      display="flex" alignItems="center" justifyContent="center"
      w={{ base: '48px', md: '58px' }}
      h={{ base: '48px', md: '58px' }}
      borderRadius="50%"
      border="1px solid rgba(255,255,255,0.12)"
      bg="rgba(255,255,255,0.04)"
      color="white"
      fontSize={{ base: '22px', md: '26px' }}
      cursor="pointer"
      transition="all 0.25s ease"
      _hover={{
        bg: 'rgba(0,87,184,0.18)',
        borderColor: 'rgba(0,87,184,0.55)',
        transform: `translateX(${direction === 'prev' ? '-3px' : '3px'})`,
      }}
      _disabled={{ opacity: 0.25, cursor: 'not-allowed' }}
      _focus={{ outline: 'none' }}
      aria-label={direction === 'prev' ? 'Anterior' : 'Siguiente'}
    >
      {direction === 'prev' ? '←' : '→'}
    </Box>
  )
}

// ─── SINGLE SLIDE ─────────────────────────────────────────────────
function Slide({ item, pos, onClick, isMobile }) {
  const isCenter = pos === 0
  const isVisible = Math.abs(pos) <= 1

  // x offset as percentage of own width (Framer Motion supports "X%")
  const xVal   = pos === 0 ? '0%' : pos < 0 ? `-${SIDE_X}` : SIDE_X
  const scale  = isCenter ? 1 : 0.84
  const opacity = !isVisible ? 0 : isCenter ? 1 : isMobile ? 0 : 0.42

  return (
    <motion.div
      animate={{ x: xVal, scale, opacity, zIndex: isCenter ? 3 : isVisible ? 2 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }}
      onClick={isCenter ? onClick : undefined}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        translateX: '-50%',
        translateY: '-50%',
        width: isMobile ? SLIDE_W_BASE : SLIDE_W_MD,
        height: isMobile ? SLIDE_H_BASE : SLIDE_H_MD,
        cursor: isCenter ? 'pointer' : 'default',
        pointerEvents: isVisible ? 'auto' : 'none',
        willChange: 'transform, opacity',
        borderRadius: '2px',
        overflow: 'hidden',
      }}
    >
      {/* Image */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${item.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: isCenter ? 'brightness(1)' : 'brightness(0.7)',
          transition: 'filter 0.4s ease',
        }}
      />

      {/* Gradient overlay (always) */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.28) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Scan-line texture */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: 0.07, mixBlendMode: 'overlay',
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 3px)',
        pointerEvents: 'none',
      }} />

      {/* Caption — only on center */}
      {isCenter && (
        <Box
          position="absolute"
          left={{ base: 4, md: 6 }}
          right={{ base: 4, md: 6 }}
          bottom={{ base: 4, md: 6 }}
        >
          <Box w="28px" h="1px" bg="brand.blue" mb={2} />
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="9px" fontWeight="700"
            letterSpacing="0.28em" textTransform="uppercase"
            color="brand.blue" mb={1}
          >
            {item.category}
          </Text>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize={{ base: '12px', md: '15px' }}
            fontWeight="600" letterSpacing="0.05em"
            color="white" lineHeight="1.3"
          >
            {item.caption}
          </Text>
        </Box>
      )}

      {/* Blue hover shimmer — center only */}
      {isCenter && (
        <Box
          position="absolute" inset="0"
          bg="rgba(0,87,184,0.08)"
          opacity={0}
          transition="opacity 0.4s ease"
          _groupHover={{ opacity: 1 }}
          pointerEvents="none"
        />
      )}
    </motion.div>
  )
}

// ─── LIGHTBOX ──────────────────────────────────────────────────────
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
    if (dx > 50) onPrev(); else if (dx < -50) onNext()
  }

  return (
    <motion.div
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
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
      {/* Close */}
      <button
        onClick={e => { e.stopPropagation(); onClose() }}
        style={{
          position: 'absolute', top: 24, right: 28,
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.28)',
          color: 'white', width: 44, height: 44, borderRadius: '50%',
          fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}
        aria-label="Cerrar"
      >✕</button>

      {/* Counter */}
      <Box position="absolute" top="28px" left="28px" zIndex={200}
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="11px" fontWeight="700"
        letterSpacing="0.24em" textTransform="uppercase"
        color="rgba(255,255,255,0.4)"
      >
        {String(activeIndex + 1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}
      </Box>

      {isMobile ? (
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
              <img src={item.src} alt={item.alt} style={{ maxWidth: '100%', maxHeight: '68vh', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.8))' }} />
              <Flex direction="column" align="center" gap="4px">
                <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="9px" fontWeight="700" letterSpacing="0.28em" textTransform="uppercase" color="brand.blue">{item.category}</Text>
                <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="12px" letterSpacing="0.06em" color="rgba(255,255,255,0.55)" textAlign="center">{item.caption}</Text>
              </Flex>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '4px', padding: '0 12px' }} onClick={e => e.stopPropagation()}>
          {/* Prev wing */}
          <div
            style={{ flexShrink: 0, width: 'clamp(70px,13vw,200px)', height: '52vh', position: 'relative', overflow: 'hidden', opacity: 0.52, cursor: 'pointer', transform: 'translateY(52px)', clipPath: 'polygon(0 0, 78% 0, 100% 18%, 100% 100%, 0 100%)' }}
            onClick={onPrev}
          >
            <img src={prevItem.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(3px)', transform: 'scale(1.06)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(4,7,13,0.18) 0%, rgba(4,7,13,0.82) 100%)' }} />
            <div style={{ position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: 26, lineHeight: 1 }}>‹</div>
          </div>

          {/* Center */}
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
                <img src={item.src} alt={item.alt} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', display: 'block', filter: 'drop-shadow(0 32px 80px rgba(0,0,0,0.8))' }} />
                <Flex direction="column" align="center" gap="4px">
                  <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="9px" fontWeight="700" letterSpacing="0.28em" textTransform="uppercase" color="brand.blue">{item.category}</Text>
                  <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="13px" letterSpacing="0.08em" color="rgba(255,255,255,0.55)">{item.caption}</Text>
                </Flex>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next wing */}
          <div
            style={{ flexShrink: 0, width: 'clamp(70px,13vw,200px)', height: '52vh', position: 'relative', overflow: 'hidden', opacity: 0.52, cursor: 'pointer', transform: 'translateY(52px)', clipPath: 'polygon(0 18%, 22% 0, 100% 0, 100% 100%, 0 100%)' }}
            onClick={onNext}
          >
            <img src={nextItem.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(3px)', transform: 'scale(1.06)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to left, rgba(4,7,13,0.18) 0%, rgba(4,7,13,0.82) 100%)' }} />
            <div style={{ position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: 26, lineHeight: 1 }}>›</div>
          </div>
        </div>
      )}

      {/* Mobile nav */}
      {isMobile && (
        <div style={{ position: 'absolute', bottom: 28, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20, zIndex: 200 }}>
          <button onClick={e => { e.stopPropagation(); onPrev() }} style={{ background: 'rgba(0,87,184,0.2)', border: '1px solid rgba(0,87,184,0.45)', color: 'white', width: 52, height: 52, borderRadius: '50%', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <button onClick={e => { e.stopPropagation(); onNext() }} style={{ background: 'rgba(0,87,184,0.2)', border: '1px solid rgba(0,87,184,0.45)', color: 'white', width: 52, height: 52, borderRadius: '50%', fontSize: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
        </div>
      )}
    </motion.div>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────
export default function GallerySection() {
  const sectionRef = useRef(null)
  const headerRef  = useRef(null)
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const isMobile = useBreakpointValue({ base: true, md: false }) ?? false

  const images = playerData.gallery ?? []
  const total  = images.length

  // Navigation
  const navigate = useCallback((dir) => {
    setActive(prev => (prev + dir + total) % total)
  }, [total])

  const openLightbox  = useCallback(() => setLightbox(active), [active])
  const closeLightbox = useCallback(() => setLightbox(null), [])
  const prevLightbox  = useCallback(() => setLightbox(i => (i - 1 + total) % total), [total])
  const nextLightbox  = useCallback(() => setLightbox(i => (i + 1) % total), [total])

  // Arrow key nav (only when lightbox is closed)
  useEffect(() => {
    if (lightbox !== null) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, lightbox])

  // Section header entry animation
  useEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.85, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  // Compute each slide's position relative to active
  const getPos = (i) => {
    let pos = i - active
    if (pos > total / 2)  pos -= total
    if (pos < -total / 2) pos += total
    return pos
  }

  return (
    <Box
      ref={sectionRef}
      as="section" id="gallery"
      bg="#080C12"
      position="relative"
      overflow="hidden"
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      py={{ base: 16, md: 0 }}
    >
      {/* ── Decorative bg ── */}
      <Box position="absolute" top="0" right="-80px" w="500px" h="500px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.07) 0%, transparent 70%)" pointerEvents="none" />
      <Box position="absolute" bottom="10%" left="-80px" w="400px" h="400px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.05) 0%, transparent 70%)" pointerEvents="none" />
      <Box position="absolute" inset="0" pointerEvents="none"
        sx={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.013) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.013) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Edge fades — clips side slides cleanly */}
      <Box position="absolute" top={0} left={0} h="100%" w={{ base: '24px', md: '80px' }} zIndex={4} pointerEvents="none"
        bg="linear-gradient(to right, #080C12 0%, rgba(8,12,18,0) 100%)" />
      <Box position="absolute" top={0} right={0} h="100%" w={{ base: '24px', md: '80px' }} zIndex={4} pointerEvents="none"
        bg="linear-gradient(to left, #080C12 0%, rgba(8,12,18,0) 100%)" />

      {/* ── Header ── */}
      <Box
        ref={headerRef}
        opacity={0}
        px={{ base: 6, md: 12, lg: 20 }}
        mb={{ base: 10, md: 12 }}
        position="relative" zIndex={5}
      >
        <Flex justify="space-between" align="flex-end">
          <Box>
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
              fontSize={{ base: '44px', md: '68px', lg: '80px' }}
              lineHeight="0.9" letterSpacing="0.02em"
            >
              FO<Box as="span" color="brand.blue">TOS</Box>
            </Text>
          </Box>
          {/* Counter */}
          <Text
            display={{ base: 'none', md: 'block' }}
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="11px" fontWeight="700"
            letterSpacing="0.24em" textTransform="uppercase"
            color="rgba(255,255,255,0.25)"
            mb={1}
          >
            {String(active + 1).padStart(2,'0')} — {String(total).padStart(2,'0')}
          </Text>
        </Flex>
      </Box>

      {/* ── Carousel stage ── */}
      <Box
        position="relative"
        w="100%"
        h={{ base: SLIDE_H_BASE, md: SLIDE_H_MD }}
        zIndex={3}
        flexShrink={0}
      >
        {images.map((img, i) => (
          <Slide
            key={img.id ?? i}
            item={img}
            pos={getPos(i)}
            onClick={openLightbox}
            isMobile={isMobile}
          />
        ))}
      </Box>

      {/* ── Bottom controls ── */}
      <Flex
        position="relative" zIndex={5}
        px={{ base: 6, md: 12, lg: 20 }}
        mt={{ base: 8, md: 10 }}
        align="center"
        justify="space-between"
      >
        {/* Arrow buttons */}
        <Flex gap={3}>
          <ArrowBtn direction="prev" onClick={() => navigate(-1)} />
          <ArrowBtn direction="next" onClick={() => navigate(1)} />
        </Flex>

        {/* Dot indicators */}
        <Flex gap="6px" align="center">
          {images.map((_, i) => (
            <Box
              key={i}
              as="button"
              onClick={() => setActive(i)}
              w={i === active ? '28px' : '6px'}
              h="6px"
              borderRadius="3px"
              bg={i === active ? 'brand.blue' : 'rgba(255,255,255,0.2)'}
              transition="all 0.35s ease"
              cursor="pointer"
              border="none"
              p={0}
              sx={{ boxShadow: i === active ? '0 0 10px rgba(0,87,184,0.7)' : 'none' }}
              aria-label={`Foto ${i + 1}`}
            />
          ))}
        </Flex>

        {/* Hint */}
        <Text
          display={{ base: 'none', md: 'block' }}
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="10px" fontWeight="600"
          letterSpacing="0.24em" textTransform="uppercase"
          color="rgba(255,255,255,0.22)"
        >
          Click para ampliar
        </Text>
      </Flex>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            images={images}
            activeIndex={lightbox}
            onClose={closeLightbox}
            onPrev={prevLightbox}
            onNext={nextLightbox}
            isMobile={isMobile}
          />
        )}
      </AnimatePresence>
    </Box>
  )
}
