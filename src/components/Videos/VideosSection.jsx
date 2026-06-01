import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import playerData from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

const video = playerData.videos?.[0]

// ─── FULLSCREEN MODAL ─────────────────────────────────────────────
function VideoModal({ isOpen, onClose }) {
  const modalVideoRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!video) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: 'rgba(4,7,13,0.97)',
            backdropFilter: 'blur(8px)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Close button */}
          <button
            onClick={e => { e.stopPropagation(); onClose() }}
            style={{
              position: 'absolute', top: 24, right: 28,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white', width: 44, height: 44, borderRadius: '50%',
              fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="Cerrar"
          >✕</button>

          {/* Category + title */}
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: '90vw', marginBottom: 12 }}
          >
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 10, fontWeight: 700,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: '#0057B8', marginBottom: 4,
            }}>
              {video.category}
            </p>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(22px, 3vw, 36px)',
              letterSpacing: '0.04em', color: 'white', lineHeight: 1,
            }}>
              {video.title}
            </p>
          </div>

          {/* Video */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '90vw', maxWidth: '1200px',
              aspectRatio: '16/9', position: 'relative',
              border: '1px solid rgba(0,87,184,0.25)',
            }}
          >
            <video
              ref={modalVideoRef}
              src={video.src}
              controls
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#000' }}
            />
          </div>

          {/* Duration */}
          <div style={{ width: '90vw', maxWidth: '1200px', marginTop: 10, display: 'flex', justifyContent: 'flex-end' }}>
            <p style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 11, letterSpacing: '0.18em',
              color: 'rgba(255,255,255,0.3)',
            }}>
              {video.duration}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── PLAY BUTTON ─────────────────────────────────────────────────
function PlayButton({ onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      animate={{ scale: hovered ? 1.08 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: 'clamp(64px, 7vw, 96px)',
        height: 'clamp(64px, 7vw, 96px)',
        borderRadius: '50%',
        border: `1.5px solid ${hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.55)'}`,
        background: hovered ? 'rgba(0,87,184,0.35)' : 'rgba(0,0,0,0.25)',
        backdropFilter: 'blur(6px)',
        cursor: 'pointer',
        transition: 'background 0.3s ease, border-color 0.3s ease',
        zIndex: 10,
      }}
      aria-label="Reproducir video"
    >
      {/* Triangle */}
      <div style={{
        width: 0, height: 0,
        borderTop: 'clamp(9px, 1.1vw, 14px) solid transparent',
        borderBottom: 'clamp(9px, 1.1vw, 14px) solid transparent',
        borderLeft: `clamp(16px, 2vw, 24px) solid ${hovered ? 'white' : 'rgba(255,255,255,0.85)'}`,
        marginLeft: '4px',
        transition: 'border-color 0.3s ease',
      }} />
    </motion.button>
  )
}

// ─── CORNER BRACKET ──────────────────────────────────────────────
// Gradient L-shaped accent. `active` brightens + extends it on hover.
function CornerBracket({ pos, active }) {
  const isTop  = pos[0] === 't'
  const isLeft = pos[1] === 'l'

  const anchor = {
    ...(isTop ? { top: '-1px' } : { bottom: '-1px' }),
    ...(isLeft ? { left: '-1px' } : { right: '-1px' }),
  }
  const len = active ? '54px' : '40px'

  return (
    <Box
      position="absolute"
      {...anchor}
      w={len} h={len}
      zIndex={7}
      pointerEvents="none"
      transition="width 0.45s cubic-bezier(0.22,1,0.36,1), height 0.45s cubic-bezier(0.22,1,0.36,1)"
    >
      {/* Horizontal arm */}
      <Box
        position="absolute"
        {...(isTop ? { top: 0 } : { bottom: 0 })}
        {...(isLeft ? { left: 0 } : { right: 0 })}
        h="2px" w="100%"
        bg={`linear-gradient(to ${isLeft ? 'right' : 'left'}, ${active ? '#7dc0ff' : '#4da3ff'} 0%, rgba(0,87,184,0) 100%)`}
        transition="background 0.4s ease"
        sx={{ boxShadow: active ? '0 0 10px rgba(77,163,255,0.7)' : '0 0 6px rgba(0,87,184,0.4)' }}
      />
      {/* Vertical arm */}
      <Box
        position="absolute"
        {...(isTop ? { top: 0 } : { bottom: 0 })}
        {...(isLeft ? { left: 0 } : { right: 0 })}
        w="2px" h="100%"
        bg={`linear-gradient(to ${isTop ? 'bottom' : 'top'}, ${active ? '#7dc0ff' : '#4da3ff'} 0%, rgba(0,87,184,0) 100%)`}
        transition="background 0.4s ease"
        sx={{ boxShadow: active ? '0 0 10px rgba(77,163,255,0.7)' : '0 0 6px rgba(0,87,184,0.4)' }}
      />
      {/* Corner dot */}
      <Box
        position="absolute"
        {...(isTop ? { top: '-2px' } : { bottom: '-2px' })}
        {...(isLeft ? { left: '-2px' } : { right: '-2px' })}
        w="6px" h="6px"
        borderRadius="50%"
        bg={active ? '#7dc0ff' : '#4da3ff'}
        transition="all 0.4s ease"
        sx={{ boxShadow: active ? '0 0 14px rgba(125,192,255,0.9)' : '0 0 8px rgba(0,87,184,0.6)' }}
      />
    </Box>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────
export default function VideosSection() {
  const sectionRef  = useRef(null)
  const headerRef   = useRef(null)
  const revealRef   = useRef(null)   // clip-path reveal mask
  const previewRef  = useRef(null)   // muted preview video
  const [modalOpen, setModalOpen]   = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // ── Hover → play muted fragments; leave → reset to cover ─────
  const handleEnter = () => {
    setIsHovering(true)
    const v = previewRef.current
    if (v) { v.currentTime = 0; v.play().catch(() => {}) }
  }
  const handleLeave = () => {
    setIsHovering(false)
    const v = previewRef.current
    if (v) { v.pause(); v.currentTime = 0 }
  }

  // ── Entry animations ─────────────────────────────────────────
  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !revealRef.current) return

    const ctx = gsap.context(() => {
      // Header slides up
      gsap.fromTo(headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      )

      // Video block reveals left-to-right via clip-path
      gsap.fromTo(revealRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.4, ease: 'power3.inOut',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  if (!video) return null

  return (
    <Box
      ref={sectionRef}
      as="section"
      id="videos"
      bg="#080C12"
      position="relative"
      overflow="hidden"
      minH={{ base: 'auto', md: '100vh' }}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      py={{ base: 20, md: 0 }}
    >
      {/* ── Decorative elements ── */}
      <Box position="absolute" inset="0" pointerEvents="none"
        sx={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.013) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.013) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
      <Box position="absolute" top="10%" left="-120px" w="500px" h="500px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.07) 0%, transparent 70%)"
        pointerEvents="none"
      />
      <Box position="absolute" bottom="15%" right="-80px" w="400px" h="400px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.05) 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* ── Header ── */}
      <Box
        ref={headerRef}
        px={{ base: 6, md: 12, lg: 20 }}
        pt={{ base: 0, md: 16 }}
        pb={{ base: 6, md: 8 }}
        opacity={0}
        position="relative"
        zIndex={2}
      >
        <Flex align="flex-end" justify="space-between" flexWrap="wrap" gap={4}>
          <Box>
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="11px" fontWeight="700"
              letterSpacing="0.36em" textTransform="uppercase"
              color="brand.blue" mb={2}
            >
              Video
            </Text>
            <Text
              fontFamily="'Bebas Neue', sans-serif"
              fontSize={{ base: '48px', md: '76px', lg: '96px' }}
              lineHeight="0.88" letterSpacing="0.02em"
            >
              HIGH<Box as="span" color="brand.blue">LIGHTS</Box>
            </Text>
          </Box>

          {/* Video meta — right side */}
          <Box textAlign={{ base: 'left', md: 'right' }} pb={1}>
            
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize={{ base: '15px', md: '18px' }}
              fontWeight="600" letterSpacing="0.05em"
              color="rgba(255,255,255,0.7)"
            >
              {video.title}
            </Text>
            <Flex align="center" gap={2} justify={{ base: 'flex-start', md: 'flex-end' }} mt={2}>
              <Box w="22px" h="1px" bg="brand.blue" opacity={0.7} />

            </Flex>
          </Box>
        </Flex>
      </Box>

      {/* ── Video block ── */}
      <Box
        px={{ base: 6, md: 12, lg: 20 }}
        zIndex={2}
        position="relative"
      >
        <Box
          ref={revealRef}
          position="relative"
          w="100%"
          maxW="1100px"
          mx="auto"
          sx={{ clipPath: 'inset(0 100% 0 0)', willChange: 'clip-path' }}
        >
        {/* 16:9 frame — cover by default, video fragments on hover, full video on click */}
        <Box
          position="relative"
          w="100%"
          sx={{ paddingTop: '56.25%' }}
          bg="#050810"
          overflow="hidden"
          cursor="pointer"
          role="button"
          aria-label={`Reproducir ${video.title}`}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          onClick={() => setModalOpen(true)}
        >
          {/* Muted preview video — sits underneath the cover */}
          <video
            ref={previewRef}
            src={video.src}
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* Cover photo — fades + zooms out on hover to reveal the video */}
          <Box
            position="absolute" inset="0" zIndex={1}
            backgroundImage={`url(${video.cover || video.thumbnail})`}
            backgroundSize="cover"
            backgroundPosition="center"
            opacity={isHovering ? 0 : 1}
            transform={isHovering ? 'scale(1.06)' : 'scale(1)'}
            transition="opacity 0.55s ease, transform 0.9s ease"
            pointerEvents="none"
          />

          {/* Vignette */}
          <Box
            position="absolute" inset="0" pointerEvents="none" zIndex={2}
            bg="linear-gradient(to bottom, rgba(8,12,18,0.5) 0%, transparent 22%, transparent 68%, rgba(8,12,18,0.8) 100%)"
          />

          {/* Scan-line overlay */}
          <Box
            position="absolute" inset="0" pointerEvents="none" zIndex={3}
            opacity={0.04} mixBlendMode="overlay"
            sx={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 1px, transparent 1px, transparent 3px)' }}
          />

          {/* Category badge — top left */}
          <Box
            position="absolute" top={5} left={6}
            px={3} py={1}
            bg="rgba(0,87,184,0.75)"
            backdropFilter="blur(4px)"
            zIndex={5}
          >
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="10px" fontWeight="700"
              letterSpacing="0.24em" textTransform="uppercase"
              color="white"
            >
              {video.category}
            </Text>
          </Box>

          {/* Redesigned gradient corner brackets (brighten + extend on hover) */}
          <CornerBracket pos="tl" active={isHovering} />
          <CornerBracket pos="tr" active={isHovering} />
          <CornerBracket pos="bl" active={isHovering} />
          <CornerBracket pos="br" active={isHovering} />

          {/* Play button — dims while previewing */}
          <Box opacity={isHovering ? 0.55 : 1} transition="opacity 0.4s ease">
            <PlayButton onClick={() => setModalOpen(true)} />
          </Box>

          {/* Dynamic hint */}
          <Box
            position="absolute" bottom={6} left="50%"
            transform="translateX(-50%)"
            zIndex={5} pointerEvents="none"
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            >
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="10px" fontWeight="700"
                letterSpacing="0.3em" textTransform="uppercase"
                color={isHovering ? 'rgba(125,192,255,0.9)' : 'rgba(255,255,255,0.35)'}
                textAlign="center"
                transition="color 0.4s ease"
                whiteSpace="nowrap"
              >
                {isHovering ? 'Click para ver completo' : 'Pasá el cursor para previsualizar'}
              </Text>
            </motion.div>
          </Box>
        </Box>

        {/* ── Redesigned bottom frame bar ── */}
        <Box position="relative" h="3px" w="100%" overflow="hidden" bg="rgba(255,255,255,0.05)">
          {/* Glowing core */}
          <Box
            position="absolute" inset="0"
            bg="linear-gradient(to right, transparent 0%, rgba(0,87,184,0.5) 22%, #4da3ff 50%, rgba(0,87,184,0.5) 78%, transparent 100%)"
            transition="box-shadow 0.4s ease"
            sx={{ boxShadow: isHovering ? '0 0 22px rgba(77,163,255,0.75)' : '0 0 14px rgba(0,87,184,0.5)' }}
          />
          {/* Sweeping sheen */}
          <Box
            position="absolute" top={0} bottom={0} w="140px" left="-160px"
            bg="linear-gradient(to right, transparent, rgba(255,255,255,0.85), transparent)"
            sx={{
              animation: 'vidSheen 3.4s linear infinite',
              '@keyframes vidSheen': {
                '0%':   { left: '-160px' },
                '100%': { left: '100%' },
              },
            }}
          />
        </Box>
        </Box>{/* /revealRef */}
      </Box>{/* /px wrapper */}

      {/* ── Bottom info bar ── */}
      <Box
        px={{ base: 6, md: 12, lg: 20 }}
        pt={{ base: 5, md: 6 }}
        pb={{ base: 0, md: 14 }}
        position="relative" zIndex={2}
      >
        <Flex align="center" justify="flex-end" flexWrap="wrap" gap={3}>
          

          {/* "Hacer click" CTA */}
          <Flex
            as="button"
            onClick={() => setModalOpen(true)}
            align="center" gap={3}
            cursor="pointer"
            border="none" bg="transparent"
            _hover={{ '& .cta-line': { w: '48px' }, '& .cta-text': { color: 'white' } }}
          >
            <Box
              className="cta-line"
              h="1px" w="28px" bg="brand.blue"
              transition="width 0.3s ease"
            />
            <Text
              className="cta-text"
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="11px" fontWeight="700"
              letterSpacing="0.3em" textTransform="uppercase"
              color="rgba(255,255,255,0.4)"
              transition="color 0.3s ease"
            >
              Ver completo →
            </Text>
          </Flex>
        </Flex>
      </Box>

      {/* ── Modal ── */}
      <VideoModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </Box>
  )
}
