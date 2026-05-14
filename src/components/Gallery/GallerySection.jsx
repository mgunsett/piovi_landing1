import { useEffect, useRef, useState, useCallback } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import playerData from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

// ─── Aspect-ratio map ────────────────────────────────────────────
const ASPECT = {
  tall:   'aspect-ratio: 3/4',
  wide:   'aspect-ratio: 4/3',
  square: 'aspect-ratio: 1/1',
}

// ─── PLACEHOLDER  (shown when the real image hasn't loaded yet) ───
const GRADIENTS = [
  'linear-gradient(135deg, #0d1929 0%, #0057B8 100%)',
  'linear-gradient(135deg, #0d1929 0%, #003d82 100%)',
  'linear-gradient(135deg, #111827 0%, #1a4a80 100%)',
  'linear-gradient(135deg, #0a1020 0%, #0057B8 100%)',
]

function GalleryItem({ item, index, onClick }) {
  const boxRef  = useRef(null)
  const [loaded, setLoaded] = useState(false)
  const [error,  setError]  = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(boxRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          duration: 0.65,
          ease: 'power2.out',
          delay: (index % 4) * 0.07,
          scrollTrigger: { trigger: boxRef.current, start: 'top 90%' },
        }
      )
    })
    return () => ctx.revert()
  }, [index])

  return (
    <Box
      ref={boxRef}
      opacity={0}
      mb={{ base: 3, md: 4 }}
      position="relative"
      overflow="hidden"
      cursor="pointer"
      onClick={() => onClick(index)}
      role="button"
      aria-label={item.alt}
      sx={{
        '&:hover .gi-overlay': { opacity: 1 },
        '&:hover .gi-img': { transform: 'scale(1.04)' },
        breakInside: 'avoid',
        display: 'block',
      }}
    >
      {/* Placeholder / real image */}
      <Box
        style={{ background: GRADIENTS[index % GRADIENTS.length] }}
        overflow="hidden"
        position="relative"
        sx={{ [ASPECT[item.aspect] ? 'aspect-ratio' : '--']: ASPECT[item.aspect]?.split(':')[1]?.trim() || 'auto' }}
      >
        {/* Use a wrapper that preserves aspect ratio via padding trick */}
        <Box
          sx={{
            paddingBottom: item.aspect === 'tall'   ? '133.33%'
                         : item.aspect === 'wide'   ? '75%'
                         :                            '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {!error && (
            <img
              src={item.src}
              alt={item.alt}
              className="gi-img"
              onLoad={()  => setLoaded(true)}
              onError={() => setError(true)}
              style={{
                position:   'absolute',
                inset:      0,
                width:      '100%',
                height:     '100%',
                objectFit:  'cover',
                opacity:    loaded ? 1 : 0,
                transition: 'transform 0.5s ease, opacity 0.4s ease',
              }}
            />
          )}

          {/* Caption overlay */}
          <Box
            className="gi-overlay"
            position="absolute" inset="0"
            bg="linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.1) 45%, transparent 100%)"
            opacity={0}
            transition="opacity 0.3s ease"
            display="flex"
            flexDirection="column"
            justify="flex-end"
            p={{ base: 3, md: 4 }}
          >
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="9px" fontWeight="700"
              letterSpacing="0.22em" textTransform="uppercase"
              color="brand.blue" mb="3px"
            >
              {item.category}
            </Text>
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize={{ base: '12px', md: '13px' }}
              fontWeight="600" letterSpacing="0.06em"
              color="white" lineHeight="1.3"
            >
              {item.caption}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

// ─── LIGHTBOX ────────────────────────────────────────────────────
function Lightbox({ images, activeIndex, onClose, onPrev, onNext }) {
  const item = images[activeIndex]

  // Keyboard handler
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  // Prevent body scroll when open
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
        position: 'fixed', inset: 0,
        zIndex: 9999,
        background: 'rgba(5,8,14,0.95)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: 24, right: 28,
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.7)',
          fontSize: 28, cursor: 'pointer', lineHeight: 1, zIndex: 1,
        }}
        aria-label="Cerrar"
      >
        ✕
      </button>

      {/* Counter */}
      <Box
        position="absolute" top="24px" left="28px"
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="12px" fontWeight="700"
        letterSpacing="0.24em" textTransform="uppercase"
        color="rgba(255,255,255,0.4)"
      >
        {String(activeIndex + 1).padStart(2,'0')} / {String(images.length).padStart(2,'0')}
      </Box>

      {/* Prev */}
      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        style={{
          position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(0,87,184,0.18)', border: '1px solid rgba(0,87,184,0.4)',
          color: 'white', width: 44, height: 44, borderRadius: '50%',
          fontSize: 18, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          transition: 'background 0.2s',
        }}
        aria-label="Anterior"
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        style={{
          position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(0,87,184,0.18)', border: '1px solid rgba(0,87,184,0.4)',
          color: 'white', width: 44, height: 44, borderRadius: '50%',
          fontSize: 18, cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          transition: 'background 0.2s',
        }}
        aria-label="Siguiente"
      >
        ›
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.22 }}
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth: 'min(90vw, 860px)',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <img
            src={item.src}
            alt={item.alt}
            style={{
              maxWidth: '100%', maxHeight: 'calc(85vh - 56px)',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 24px 64px rgba(0,0,0,0.7))',
            }}
          />
          <Flex direction="column" align="center" gap="3px">
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="9px" fontWeight="700"
              letterSpacing="0.28em" textTransform="uppercase"
              color="brand.blue"
            >
              {item.category}
            </Text>
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="13px" letterSpacing="0.08em"
              color="rgba(255,255,255,0.6)"
            >
              {item.caption}
            </Text>
          </Flex>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}

// ─── MAIN GALLERY SECTION ────────────────────────────────────────
export default function GallerySection() {
  const titleRef   = useRef(null)
  const [lightbox, setLightbox] = useState(null) // null | index

  const images = playerData.gallery ?? []

  const openLightbox  = useCallback(i   => setLightbox(i), [])
  const closeLightbox = useCallback(()  => setLightbox(null), [])
  const prevImage     = useCallback(()  => setLightbox(i => (i - 1 + images.length) % images.length), [images.length])
  const nextImage     = useCallback(()  => setLightbox(i => (i + 1) % images.length), [images.length])

  // Title entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%' } }
      )
    })
    return () => ctx.revert()
  }, [])

  // Split images into 3 columns (desktop) / 2 columns (tablet/mobile)
  const col1 = images.filter((_, i) => i % 3 === 0)
  const col2 = images.filter((_, i) => i % 3 === 1)
  const col3 = images.filter((_, i) => i % 3 === 2)

  const col1m = images.filter((_, i) => i % 2 === 0)
  const col2m = images.filter((_, i) => i % 2 === 1)

  return (
    <Box
      as="section" id="gallery"
      bg="#080C12"
      pt={{ base: 20, md: 28 }}
      pb={{ base: 16, md: 24 }}
      position="relative"
      overflow="hidden"
    >
      {/* Background radial */}
      <Box
        position="absolute" top="0" right="-80px"
        w="500px" h="500px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.07) 0%, transparent 70%)"
        pointerEvents="none"
      />
      <Box
        position="absolute" bottom="10%" left="-100px"
        w="400px" h="400px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.05) 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* Subtle grid */}
      <Box
        position="absolute" inset="0" pointerEvents="none"
        sx={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.012) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.012) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <Box px={{ base: 5, md: 12, lg: 20 }} position="relative">
        {/* Title */}
        <Box ref={titleRef} mb={{ base: 12, md: 16 }}>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="10px" fontWeight="700"
            letterSpacing="0.36em" textTransform="uppercase"
            color="brand.blue" mb={2}
          >
            Galería
          </Text>
          <Flex align="flex-end" justify="space-between" flexWrap="wrap" gap={3}>
            <Text
              fontFamily="'Bebas Neue', sans-serif"
              fontSize={{ base: '52px', md: '76px', lg: '92px' }}
              lineHeight="0.88" letterSpacing="0.02em"
            >
              Momentos<Box as="span" color="brand.blue"> Únicos</Box>
            </Text>
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="11px" letterSpacing="0.12em"
              color="rgba(255,255,255,0.28)"
              mb={{ base: 0, md: 2 }}
            >
              {images.length} fotos · Click para ampliar
            </Text>
          </Flex>
        </Box>

        {/* ── MASONRY 3 cols (lg+) ── */}
        <Flex gap={4} display={{ base: 'none', lg: 'flex' }}>
          {[col1, col2, col3].map((col, ci) => (
            <Box key={ci} flex="1">
              {col.map(item => (
                <GalleryItem
                  key={item.id}
                  item={item}
                  index={images.indexOf(item)}
                  onClick={openLightbox}
                />
              ))}
            </Box>
          ))}
        </Flex>

        {/* ── MASONRY 2 cols (sm → md) ── */}
        <Flex gap={3} display={{ base: 'none', sm: 'flex', lg: 'none' }}>
          {[col1m, col2m].map((col, ci) => (
            <Box key={ci} flex="1">
              {col.map(item => (
                <GalleryItem
                  key={item.id}
                  item={item}
                  index={images.indexOf(item)}
                  onClick={openLightbox}
                />
              ))}
            </Box>
          ))}
        </Flex>

        {/* ── Single col (base) ── */}
        <Box display={{ base: 'block', sm: 'none' }}>
          {images.map((item, i) => (
            <GalleryItem
              key={item.id}
              item={item}
              index={i}
              onClick={openLightbox}
            />
          ))}
        </Box>
      </Box>

      {/* Lightbox */}
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
