import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Flex, Image, Text } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { AnimatePresence, motion } from 'framer-motion'
import { useIsMobile } from '../../hooks/useIsMobile'
import { cutCorner, pad2 } from './galleryUtils'

/**
 * Carrusel coverflow + lightbox, adaptado de Gallery/GallerySection.jsx
 * (que no se toca): mismas flechas con esquina recortada, slider de
 * progreso, contador y firma "GP_", pero recibe las fotos por props.
 *
 * Props extra para las propuestas:
 *  - slideW / stageH  tamaños { base, md } (el ancho es relativo al escenario)
 *  - intro            oculta slides y controles mientras corre una transición
 *  - overlay          nodos que se dibujan encima del escenario (HUD, estática)
 *  - stageSx          estilos extra del contenedor del escenario (máscaras)
 *  - controlsPx       padding horizontal de la fila de controles
 *
 * Cada slide lleva data-idx y data-center para que las transiciones puedan
 * medir dónde cae cada foto. Montalo con key={torneo.id} para reiniciarlo.
 */

const MotionBox = motion(Box)
const SIDE_X = '68%'
const SWIPE_THRESHOLD = 45
const TAP_TOLERANCE = 10

// ─── FLECHA ───────────────────────────────────────────────────────
export function ArrowBtn({ direction, onClick }) {
  const isPrev = direction === 'prev'
  const clip = cutCorner('11px', isPrev ? 'tl' : 'tr')
  return (
    <Box
      as="button"
      type="button"
      onClick={onClick}
      aria-label={isPrev ? 'Foto anterior' : 'Foto siguiente'}
      w="46px"
      h="46px"
      borderRadius="md"
      p="1px"
      flexShrink={0}
      bg="rgba(255,255,255,0.14)"
      data-cursor-hover
      transition="background 0.3s ease"
      sx={{
        clipPath: clip,
        '&:hover, &:focus-visible': { background: 'brand.accent', outline: 'none' },
        '&:hover .arrow-face': { background: 'rgba(0,87,184,0.22)', color: '#fff' },
        '&:hover .arrow-icon': { transform: `translateX(${isPrev ? '-3px' : '3px'})` },
      }}
    >
      <Flex
        className="arrow-face"
        w="100%"
        h="100%"
        align="center"
        justify="center"
        bg="#0B1017"
        color="rgba(255,255,255,0.72)"
        borderRadius="md"
        transition="background 0.3s ease, color 0.3s ease"
        sx={{ clipPath: clip }}
      >
        <Box className="arrow-icon" as={isPrev ? FiChevronLeft : FiChevronRight} fontSize="22px" transition="transform 0.3s cubic-bezier(0.22,1,0.36,1)" />
      </Flex>
    </Box>
  )
}

// ─── SLIDER DE PROGRESO ───────────────────────────────────────────
function ProgressSlider({ total, active, onSeek }) {
  const trackRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const indexFromX = (x) => {
    const r = trackRef.current.getBoundingClientRect()
    return Math.min(total - 1, Math.max(0, Math.floor(((x - r.left) / r.width) * total)))
  }
  return (
    <Box
      ref={trackRef}
      data-gallery-slider=""
      flex="1"
      position="relative"
      h={{ base: '34px', md: '26px' }}
      cursor={dragging ? 'grabbing' : 'grab'}
      role="slider"
      tabIndex={0}
      aria-label="Progreso de la galería"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={active + 1}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture?.(e.pointerId)
        setDragging(true)
        onSeek(indexFromX(e.clientX))
      }}
      onPointerMove={(e) => dragging && onSeek(indexFromX(e.clientX))}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') onSeek(Math.max(0, active - 1))
        if (e.key === 'ArrowRight') onSeek(Math.min(total - 1, active + 1))
      }}
      sx={{ touchAction: 'none', '&:focus': { outline: 'none' } }}
    >
      <Box position="absolute" top="50%" left={0} right={0} transform="translateY(-50%)" h="2px" borderRadius="full" bg="rgba(255,255,255,0.08)" />
      <Box
        position="absolute"
        top="50%"
        transform={`translateY(-50%) scaleY(${dragging ? 1.6 : 1})`}
        h="4px"
        borderRadius="full"
        bg="brand.blue"
        boxShadow="0 0 12px rgba(0,87,184,0.75)"
        w={`${100 / total}%`}
        left={`${(active / total) * 100}%`}
        transition={dragging ? 'transform .15s ease' : 'left .45s cubic-bezier(0.22,1,0.36,1), width .45s ease, transform .15s ease'}
      />
    </Box>
  )
}

// ─── SLIDE ────────────────────────────────────────────────────────
function Slide({ item, idx, label, pos, onClick, isMobile, hidden, width, height }) {
  const isCenter = pos === 0
  const isVisible = Math.abs(pos) <= 1
  const opacity = hidden || !isVisible ? 0 : isCenter ? 1 : isMobile ? 0 : 0.42
  const place = { x: isCenter ? '0%' : pos < 0 ? `-${SIDE_X}` : SIDE_X, scale: isCenter ? 1 : 0.84 }
  return (
    <MotionBox
      data-idx={idx}
      data-center={isCenter}
      // Oculto (durante una transición): ya nace en su lugar final, para poder medirlo
      initial={hidden ? { ...place, opacity: 0 } : false}
      animate={{ ...place, opacity, zIndex: isCenter ? 3 : isVisible ? 2 : 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }}
      onClick={onClick}
      position="absolute"
      left="50%"
      top="50%"
      w={width}
      h={height}
      cursor={isCenter ? 'zoom-in' : 'pointer'}
      pointerEvents={isVisible ? 'auto' : 'none'}
      borderRadius="md"
      border="1px solid rgba(85, 101, 155, 0.61)"
      overflow="hidden"
      role="img"
      aria-label={item.alt}
      style={{ translateX: '-50%', translateY: '-50%', willChange: 'transform, opacity' }}
    >
      <Image src={item.src} alt="" position="absolute" inset={0} w="100%" h="100%" objectFit="cover" draggable={false} filter={isCenter ? 'none' : 'brightness(0.7)'} transition="filter 0.4s ease" />
      <Box position="absolute" inset={0} pointerEvents="none" bg="linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.28) 100%)" />
      {isCenter && (
        <Flex position="absolute" left={{ base: 4, md: 6 }} right={{ base: 4, md: 6 }} bottom={{ base: 4, md: 6 }} justify="space-between" align="flex-end" gap={3}>
          <Text fontFamily="heading" fontSize="24px" letterSpacing="0.08em">
            GP
            <Box as="span" fontWeight="bold" color="brand.blue" ml="-5px">
              _
            </Box>
          </Text>
          <Text fontFamily="condensed" fontSize="11px" fontWeight="600" letterSpacing="0.2em" textTransform="uppercase" color="rgba(255,255,255,0.7)" textAlign="right">
            {label}
          </Text>
        </Flex>
      )}
    </MotionBox>
  )
}

// ─── LIGHTBOX ─────────────────────────────────────────────────────
function Lightbox({ images, label, index, onClose, onPrev, onNext }) {
  const item = images[index]
  const x0 = useRef(0)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      }
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    window.__lenis?.stop()
    return () => {
      document.body.style.overflow = ''
      window.__lenis?.start()
    }
  }, [])

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${label}: foto ampliada`}
      position="fixed"
      inset={0}
      zIndex={99999}
      bg="rgba(4,7,13,0.97)"
      backdropFilter="blur(6px)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap="14px"
      px={4}
      pt="72px"
      pb="100px"
      onClick={onClose}
      onTouchStart={(e) => (x0.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].clientX - x0.current
        if (dx > 50) onPrev()
        else if (dx < -50) onNext()
      }}
    >
      <Text position="absolute" top="28px" left="28px" fontFamily="condensed" fontSize="11px" fontWeight="700" letterSpacing="0.24em" color="rgba(255,255,255,0.4)">
        {pad2(index + 1)} / {pad2(images.length)}
      </Text>
      <Box
        as="button"
        type="button"
        aria-label="Cerrar"
        position="absolute"
        top="20px"
        right="24px"
        w="44px"
        h="44px"
        borderRadius="50%"
        bg="rgba(255,255,255,0.12)"
        border="1px solid rgba(255,255,255,0.28)"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        ✕
      </Box>
      <AnimatePresence mode="wait">
        <MotionBox
          key={index}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="12px"
          onClick={(e) => e.stopPropagation()}
        >
          <Image src={item.src} alt={item.alt} maxW="min(100%, 1000px)" maxH="74vh" objectFit="contain" borderRadius="md" />
          <Text fontFamily="condensed" fontSize="13px" letterSpacing="0.08em" color="rgba(255,255,255,0.55)" textAlign="center">
            {label}
          </Text>
        </MotionBox>
      </AnimatePresence>
      <Flex position="absolute" bottom="28px" gap="16px" onClick={(e) => e.stopPropagation()}>
        <ArrowBtn direction="prev" onClick={onPrev} />
        <ArrowBtn direction="next" onClick={onNext} />
      </Flex>
    </MotionBox>
  )
}

// ─── CARRUSEL ─────────────────────────────────────────────────────
export function CoverflowGallery({
  images,
  label,
  onIndexChange,
  intro = false,
  slideW = { base: '82%', md: '38%' },
  stageH = { base: '52vh', md: '70vh' },
  overlay = null,
  stageSx,
  controlsPx = { base: 6, md: 12, lg: 20 },
}) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(null)
  const isMobile = useIsMobile()
  const total = images.length
  const swipe = useRef({ x: 0, y: 0, on: false, moved: false })

  const navigate = useCallback((d) => setActive((p) => (p + d + total) % total), [total])

  useEffect(() => {
    onIndexChange?.(active, total)
  }, [active, total, onIndexChange])

  useEffect(() => {
    if (intro || lightbox !== null) return undefined
    const onKey = (e) => {
      if (e.defaultPrevented || e.target?.closest?.('[data-gallery-slider], [role="tab"]')) return
      if (e.key === 'ArrowLeft') navigate(-1)
      if (e.key === 'ArrowRight') navigate(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, lightbox, intro])

  const getPos = (i) => {
    let p = i - active
    if (p > total / 2) p -= total
    if (p < -total / 2) p += total
    return p
  }

  const closeLb = useCallback(() => setLightbox(null), [])
  const prevLb = useCallback(() => setLightbox((i) => (i - 1 + total) % total), [total])
  const nextLb = useCallback(() => setLightbox((i) => (i + 1) % total), [total])

  return (
    <>
      <Box position="relative" sx={stageSx}>
        <Box
          data-stage
          position="relative"
          w="100%"
          h={stageH}
          zIndex={3}
          sx={{ touchAction: 'pan-y' }}
          onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY, on: true, moved: false })}
          onPointerMove={(e) => {
            if (swipe.current.on && Math.abs(e.clientX - swipe.current.x) > TAP_TOLERANCE) swipe.current.moved = true
          }}
          onPointerUp={(e) => {
            if (!swipe.current.on) return
            swipe.current.on = false
            const dx = e.clientX - swipe.current.x
            if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(e.clientY - swipe.current.y)) navigate(dx < 0 ? 1 : -1)
          }}
          onClickCapture={(e) => {
            if (!swipe.current.moved) return
            swipe.current.moved = false
            e.stopPropagation()
          }}
        >
          {images.map((img, i) => {
            const pos = getPos(i)
            return (
              <Slide
                key={img.id ?? i}
                idx={i}
                item={img}
                label={label}
                pos={pos}
                hidden={intro}
                isMobile={isMobile}
                width={slideW}
                height="100%"
                onClick={() => (pos === 0 ? setLightbox(active) : setActive(i))}
              />
            )
          })}
        </Box>
        {overlay}
      </Box>

      <Flex
        position="relative"
        zIndex={5}
        px={controlsPx}
        mt={{ base: 7, md: 10 }}
        align="center"
        gap={{ base: 4, md: 8 }}
        opacity={intro ? 0 : 1}
        transition="opacity .4s ease .15s"
      >
        <Flex gap={3} display={{ base: 'none', md: 'flex' }}>
          <ArrowBtn direction="prev" onClick={() => navigate(-1)} />
          <ArrowBtn direction="next" onClick={() => navigate(1)} />
        </Flex>
        <ProgressSlider total={total} active={active} onSeek={setActive} />
        <Flex align="baseline" gap="5px" flexShrink={0}>
          <Text fontFamily="heading" fontSize={{ base: 'lg', md: 'xl' }} lineHeight="1" letterSpacing="0.04em">
            {pad2(active + 1)}
          </Text>
          <Text fontFamily="condensed" fontSize="11px" fontWeight="600" letterSpacing="0.14em" color="rgba(255,255,255,0.3)">
            / {pad2(total)}
          </Text>
        </Flex>
      </Flex>

      <AnimatePresence>
        {lightbox !== null && <Lightbox images={images} label={label} index={lightbox} onClose={closeLb} onPrev={prevLb} onNext={nextLb} />}
      </AnimatePresence>
    </>
  )
}

export default CoverflowGallery
