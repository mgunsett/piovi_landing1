import { useEffect, useRef, useState, useCallback } from 'react'
import { Box, Flex, Text, Image, useBreakpointValue } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import playerData from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

const MotionBox = motion(Box)

// ─── HELPERS ─────────────────────────────────────────────────────
const SLIDE_W_MD  = '38vw'   // center slide width desktop
const SLIDE_W_BASE = '82vw'  // center slide width mobile
const SLIDE_H_MD  = '82vh'
const SLIDE_H_BASE = '52vh'

// Distance the side slides travel from center (% of their own width)
const SIDE_X = '68%'

// Swipe: px de desplazamiento horizontal que cuentan como gesto (y no como tap)
const SWIPE_THRESHOLD = 45
const TAP_TOLERANCE   = 10

// ─── ARROW BUTTON ─────────────────────────────────────────────────
// Marco cuadrado con esquina exterior recortada. El borde se dibuja con un
// contenedor de 1px de padding porque clip-path recorta los borders del CSS.
const CUT = '11px'

function ArrowBtn({ direction, onClick }) {
  const isPrev = direction === 'prev'
  const clip = isPrev
    ? `polygon(${CUT} 0, 100% 0, 100% 100%, 0 100%, 0 ${CUT})`
    : `polygon(0 0, calc(100% - ${CUT}) 0, 100% ${CUT}, 100% 100%, 0 100%)`

  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Foto anterior' : 'Foto siguiente'}
      w="46px" h="46px"
      borderRadius="md"
      p="1px"
      flexShrink={0}
      bg="rgba(255,255,255,0.14)"
      cursor="pointer"
      transition="background 0.3s ease"
      data-cursor-hover
      sx={{
        clipPath: clip,
        WebkitClipPath: clip,
        '&:hover, &:focus-visible': { background: 'brand.accent' },
        '&:hover .gp-arrow-face, &:focus-visible .gp-arrow-face': {
          background: 'rgba(0,87,184,0.22)',
          color: '#fff',
        },
        '&:hover .gp-arrow-icon': { transform: `translateX(${isPrev ? '-3px' : '3px'})` },
        '&:hover .gp-arrow-tick': { opacity: 1 },
        '&:active .gp-arrow-face': { background: 'rgba(0,87,184,0.4)' },
        '&:focus': { outline: 'none' },
      }}
    >
      <Flex
        className="gp-arrow-face"
        position="relative"
        w="100%" h="100%"
        align="center" justify="center"
        bg="#0B1017"
        color="rgba(255,255,255,0.72)"
        borderRadius="md"
        transition="background 0.3s ease, color 0.3s ease"
        sx={{ clipPath: clip, WebkitClipPath: clip }}
      >
        {/* Detalle HUD: escuadra en la esquina opuesta al corte */}
        
        <Box
          className="gp-arrow-icon"
          as={isPrev ? FiChevronLeft : FiChevronRight}
          fontSize="22px"
          transition="transform 0.3s cubic-bezier(0.22,1,0.36,1)"
        />
      </Flex>
    </Box>
  )
}

// ─── PROGRESS SLIDER (arrastrable) ────────────────────────────────
function ProgressSlider({ total, active, onSeek }) {
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const indexFromX = useCallback((clientX) => {
    const el = trackRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    return Math.min(total - 1, Math.max(0, Math.floor(ratio * total)))
  }, [total])

  const handleDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDragging(true)
    onSeek(indexFromX(e.clientX))
  }
  const handleMove = (e) => {
    if (!dragging) return
    onSeek(indexFromX(e.clientX))
  }
  const handleUp = (e) => {
    if (!dragging) return
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    setDragging(false)
  }
  const handleKey = (e) => {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); onSeek(Math.max(0, active - 1)) }
    if (e.key === 'ArrowRight') { e.preventDefault(); onSeek(Math.min(total - 1, active + 1)) }
    if (e.key === 'Home')       { e.preventDefault(); onSeek(0) }
    if (e.key === 'End')        { e.preventDefault(); onSeek(total - 1) }
  }

  return (
    <Box
      ref={trackRef}
      data-gallery-slider=""
      flex="1"
      w="100%"
      position="relative"
      h={{ base: '34px', md: '26px' }}
      cursor={dragging ? 'grabbing' : 'grab'}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onKeyDown={handleKey}
      tabIndex={0}
      role="slider"
      aria-label="Progreso de la galería"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={active + 1}
      sx={{ touchAction: 'none', '&:focus': { outline: 'none' } }}
      _focusVisible={{ '& .track': { bg: 'rgba(255,255,255,0.22)' } }}
      _hover={{ '& .track': { bg: 'rgba(255,255,255,0.16)' } }}
    >
      {/* Riel */}
      <Box
        className="track"
        position="absolute" top="50%" left={0} right={0}
        transform="translateY(-50%)"
        h="2px" borderRadius="full"
        bg={dragging ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)'}
        transition="background 0.25s ease"
        pointerEvents="none"
      />
      {/* Thumb arrastrable */}
      <Box
        position="absolute" top="50%"
        transform={`translateY(-50%) scaleY(${dragging ? 1.6 : 1})`}
        h="4px" borderRadius="full"
        bg="brand.blue"
        boxShadow={dragging ? '0 0 18px rgba(46,119,214,0.9)' : '0 0 12px rgba(0,87,184,0.75)'}
        w={`${100 / total}%`}
        left={`${(active / total) * 100}%`}
        transition={
          dragging
            ? 'transform 0.15s ease, box-shadow 0.15s ease'
            : 'left 0.45s cubic-bezier(0.22, 1, 0.36, 1), transform 0.15s ease, box-shadow 0.15s ease'
        }
        pointerEvents="none"
      />
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
    <MotionBox
      animate={{ x: xVal, scale, opacity, zIndex: isCenter ? 3 : isVisible ? 2 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }}
      onClick={isCenter ? onClick : undefined}
      position="absolute"
      left="50%"
      top="50%"
      w={isMobile ? SLIDE_W_BASE : SLIDE_W_MD}
      h={isMobile ? SLIDE_H_BASE : SLIDE_H_MD}
      cursor={isCenter ? 'pointer' : 'default'}
      pointerEvents={isVisible ? 'auto' : 'none'}
      borderRadius="md"
      border="1px solid rgba(85, 101, 155, 0.61)"
      overflow="hidden"
      style={{ translateX: '-50%', translateY: '-50%', willChange: 'transform, opacity' }}
    >
      {/* Image */}
      <Image
        src={item.src}
        alt={item.alt}
        position="absolute"
        inset={0}
        w="100%"
        h="100%"
        objectFit="cover"
        filter={isCenter ? 'brightness(1)' : 'brightness(0.7)'}
        transition="filter 0.4s ease"
      />

      {/* Gradient overlay (always) */}
      <Box
        position="absolute" inset={0}
        bg="linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.28) 100%)"
        pointerEvents="none"
      />

      {/* Caption — only on center */}
      {isCenter && (
        <Box
          position="absolute"
          left={{ base: 4, md: 6 }}
          right={{ base: 4, md: 6 }}
          bottom={{ base: 4, md: 6 }}
        >
          <Text
            fontFamily="heading"
            fontSize="24px"
            letterSpacing="0.08em"
            color="white"
          >
            GP
            <Box as="span" fontFamily="heading" fontWeight='bold' color="brand.blue" ml="-5px">_</Box>
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
    </MotionBox>
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
    <MotionBox
      key="lightbox"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      position="fixed"
      inset={0}
      zIndex={99999}
      bg="rgba(4,7,13,0.97)"
      backdropFilter="blur(6px)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close */}
      <Flex
        as="button"
        type="button"
        onClick={e => { e.stopPropagation(); onClose() }}
        position="absolute" top="24px" right="28px"
        bg="rgba(255,255,255,0.12)"
        border="1px solid rgba(255,255,255,0.28)"
        color="white" w="44px" h="44px" borderRadius="50%"
        fontSize="20px" cursor="pointer"
        align="center" justify="center" zIndex={200}
        aria-label="Cerrar"
      >✕</Flex>

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
        <Flex
          onClick={e => e.stopPropagation()}
          w="100%" px="20px" justify="center"
        >
          <AnimatePresence mode="wait">
            <MotionBox
              key={activeIndex}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.18 }}
              display="flex" flexDirection="column" alignItems="center" gap="10px" w="100%"
            >
              <Image src={item.src} alt={item.alt} maxW="100%" maxH="68vh" objectFit="contain" display="block" filter="drop-shadow(0 20px 50px rgba(0,0,0,0.8))" />
              <Flex direction="column" align="center" gap="4px">
                <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="9px" fontWeight="700" letterSpacing="0.28em" textTransform="uppercase" color="brand.blue">{item.category}</Text>
                <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="12px" letterSpacing="0.06em" color="rgba(255,255,255,0.55)" textAlign="center">{item.caption}</Text>
              </Flex>
            </MotionBox>
          </AnimatePresence>
        </Flex>
      ) : (
        <Flex align="center" justify="center" w="100%" gap="4px" px="12px" onClick={e => e.stopPropagation()}>
          {/* Prev wing */}
          <Box
            as="button"
            type="button"
            aria-label="Foto anterior"
            flexShrink={0}
            w="clamp(70px,13vw,200px)" h="52vh"
            position="relative" overflow="hidden"
            opacity={0.52} cursor="pointer"
            transform="translateY(52px)"
            sx={{ clipPath: 'polygon(0 0, 78% 0, 100% 18%, 100% 100%, 0 100%)' }}
            onClick={onPrev}
          >
            <Image src={prevItem.src} alt="" w="100%" h="100%" objectFit="cover" filter="blur(3px)" transform="scale(1.06)" />
            <Box position="absolute" inset={0} bg="linear-gradient(to right, rgba(4,7,13,0.18) 0%, rgba(4,7,13,0.82) 100%)" />
            <Box position="absolute" bottom="28%" left="50%" transform="translateX(-50%)" color="rgba(255,255,255,0.7)" fontSize="26px" lineHeight="1">‹</Box>
          </Box>

          {/* Center */}
          <Flex flex="0 0 auto" w="min(56vw, 800px)" justify="center">
            <AnimatePresence mode="wait">
              <MotionBox
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                display="flex" flexDirection="column" alignItems="center" gap="12px" w="100%"
              >
                <Image src={item.src} alt={item.alt} maxW="100%" maxH="80vh" objectFit="contain" display="block" filter="drop-shadow(0 32px 80px rgba(0,0,0,0.8))" />
                <Flex direction="column" align="center" gap="4px">
                  <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="9px" fontWeight="700" letterSpacing="0.28em" textTransform="uppercase" color="brand.blue">{item.category}</Text>
                  <Text fontFamily="'Barlow Condensed', sans-serif" fontSize="13px" letterSpacing="0.08em" color="rgba(255,255,255,0.55)">{item.caption}</Text>
                </Flex>
              </MotionBox>
            </AnimatePresence>
          </Flex>

          {/* Next wing */}
          <Box
            as="button"
            type="button"
            aria-label="Foto siguiente"
            flexShrink={0}
            w="clamp(70px,13vw,200px)" h="52vh"
            position="relative" overflow="hidden"
            opacity={0.52} cursor="pointer"
            transform="translateY(52px)"
            sx={{ clipPath: 'polygon(0 18%, 22% 0, 100% 0, 100% 100%, 0 100%)' }}
            onClick={onNext}
          >
            <Image src={nextItem.src} alt="" w="100%" h="100%" objectFit="cover" filter="blur(3px)" transform="scale(1.06)" />
            <Box position="absolute" inset={0} bg="linear-gradient(to left, rgba(4,7,13,0.18) 0%, rgba(4,7,13,0.82) 100%)" />
            <Box position="absolute" bottom="28%" left="50%" transform="translateX(-50%)" color="rgba(255,255,255,0.7)" fontSize="26px" lineHeight="1">›</Box>
          </Box>
        </Flex>
      )}

      {/* Mobile nav */}
      {isMobile && (
        <Flex position="absolute" bottom="28px" left={0} right={0} justify="center" gap="16px" zIndex={200}>
          <ArrowBtn direction="prev" onClick={e => { e.stopPropagation(); onPrev() }} />
          <ArrowBtn direction="next" onClick={e => { e.stopPropagation(); onNext() }} />
        </Flex>
      )}
    </MotionBox>
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

  // Swipe sobre el carrusel (mobile y desktop). Si el dedo/mouse se movió,
  // el click no debe abrir el lightbox.
  const swipe = useRef({ x: 0, y: 0, active: false, moved: false })

  const onStageDown = (e) => {
    swipe.current = { x: e.clientX, y: e.clientY, active: true, moved: false }
  }
  const onStageMove = (e) => {
    if (!swipe.current.active) return
    if (Math.abs(e.clientX - swipe.current.x) > TAP_TOLERANCE) swipe.current.moved = true
  }
  const onStageUp = (e) => {
    if (!swipe.current.active) return
    swipe.current.active = false
    const dx = e.clientX - swipe.current.x
    const dy = e.clientY - swipe.current.y
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      swipe.current.moved = true
      navigate(dx < 0 ? 1 : -1)
    }
  }
  const onStageClickCapture = (e) => {
    if (!swipe.current.moved) return
    swipe.current.moved = false
    e.stopPropagation()
  }

  // Arrow key nav (only when lightbox is closed; el slider maneja las suyas)
  useEffect(() => {
    if (lightbox !== null) return
    const onKey = (e) => {
      if (e.target?.closest?.('[data-gallery-slider]')) return
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
      px={{ base: 0, md: 16 }}
    >
      {/* ── Decorative bg ── */}
      <Box position="absolute" top="0" right="-80px" w="500px" h="500px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.07) 0%, transparent 70%)" pointerEvents="none" />
      <Box position="absolute" bottom="10%" left="-80px" w="400px" h="400px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.05) 0%, transparent 70%)" pointerEvents="none" />
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
              fontFamily="heading"
              fontSize={{ base: '10px', md: '11px', lg: '12px' }} 
              letterSpacing="0.36em" textTransform="uppercase"
              color="brand.bone" mb={2}
            >
              Galería
            </Text>
            <Text
              as="h2"
              fontFamily="heading"
              textTransform="uppercase" fontWeight="medium" fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              lineHeight="0.9" letterSpacing="0.02em"
            >
              FO<Box as="span" color="brand.blue">TOS</Box>
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* ── Carousel stage ── */}
      <Box
        position="relative"
        mx="auto"
        w="100%"
        h={{ base: SLIDE_H_BASE, md: SLIDE_H_MD }}
        zIndex={3}
        flexShrink={0}
        onPointerDown={onStageDown}
        onPointerMove={onStageMove}
        onPointerUp={onStageUp}
        onPointerCancel={onStageUp}
        onClickCapture={onStageClickCapture}
        sx={{ touchAction: 'pan-y' }}
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
      {/* Mobile: solo slider + contador centrado (se navega con swipe).
          Desktop: flechas · slider · contador en una fila. */}
      <Flex
        position="relative" zIndex={5}
        px={{ base: 6, md: 12, lg: 20 }}
        mt={{ base: 7, md: 10 }}
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'stretch', md: 'center' }}
        gap={{ base: 2, md: 8 }}
      >
        {/* Flechas — solo desktop */}
        <Flex gap={3} flexShrink={0} display={{ base: 'none', md: 'flex' }}>
          <ArrowBtn direction="prev" onClick={() => navigate(-1)} />
          <ArrowBtn direction="next" onClick={() => navigate(1)} />
        </Flex>

        <ProgressSlider total={total} active={active} onSeek={setActive} />

        {/* Contador */}
        <Flex
          align="baseline"
          gap="5px"
          flexShrink={0}
          justify={{ base: 'center', md: 'flex-end' }}
        >
          <Text
            fontFamily="heading"
            fontSize={{ base: 'lg', md: 'xl' }}
            lineHeight="1" letterSpacing="0.04em"
            color="white"
          >
            {String(active + 1).padStart(2, '0')}
          </Text>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="11px" fontWeight="600"
            letterSpacing="0.14em"
            color="rgba(255,255,255,0.3)"
          >
            / {String(total).padStart(2, '0')}
          </Text>
        </Flex>
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
