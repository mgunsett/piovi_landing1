import { useEffect, useRef } from 'react'
import { Box, Flex, Text, VStack, Image } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

import piovi4 from '../../assets/piovi4.svg'

// ─── MARQUEE DATA ────────────────────────────────────────────────
const marqueeItems = [
  'Cruz Azul', '·', 'Defensor', '·', 'Argentina', '·',
  '#3', '·', 'La Máquina', '·', 'Liga MX', '·',
  'Santa Fe', '·', 'Zurdo', '·', '1.84m', '·',
  'Cruz Azul', '·', 'Defensor', '·', 'Argentina', '·',
  '#3', '·', 'La Máquina', '·', 'Liga MX', '·',
  'Santa Fe', '·', 'Zurdo', '·', '1.84m', '·',
]

// ─── HERO COMPONENT ──────────────────────────────────────────────
export default function Hero({ playerImage, hidePlayerImage = false }) {
  const containerRef = useRef(null)
  const lettersRef = useRef([])
  const bgLettersRef = useRef([])
  const photoRef = useRef(null)
  const subtitleRef = useRef(null)
  const statsRef = useRef(null)
  const lineRef = useRef(null)
  const numberRef = useRef(null)
  const photoInnerRef = useRef(null)
  const glowFlashRef = useRef(null)

  const heroName = 'PIOVI'

  // ── Global mouse parallax ─────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMove = (e) => {
      const rect = container.getBoundingClientRect()
      const xn = (e.clientX - rect.left) / rect.width - 0.5
      const yn = (e.clientY - rect.top) / rect.height - 0.5

      if (photoRef.current) {
        gsap.to(photoRef.current, { x: xn * 28, y: yn * 14, duration: 1, ease: 'power2.out' })
      }
      if (lettersRef.current.length) {
        gsap.to(lettersRef.current, { x: xn * 12, y: yn * 6, duration: 1.2, ease: 'power2.out', stagger: 0.02 })
      }
      if (bgLettersRef.current.length) {
        gsap.to(bgLettersRef.current, { x: xn * 5, y: yn * 3, duration: 1.6, ease: 'power2.out', stagger: 0.02 })
      }
    }

    container.addEventListener('mousemove', onMove)
    return () => container.removeEventListener('mousemove', onMove)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      tl.fromTo(
        lettersRef.current,
        { yPercent: 110, opacity: 0, rotateX: -40 },
        { yPercent: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: 0.08, ease: 'expo.out' },
        0
      )

      tl.fromTo(
        photoInnerRef.current,
        {
          clipPath: 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)',
          scale: 1.06,
          filter: 'brightness(1.8) saturate(0.4)',
        },
        {
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
          scale: 1,
          filter: 'brightness(1) saturate(1)',
          duration: 1.5,
          ease: 'expo.out',
        },
        0.25
      )

      tl.fromTo(
        glowFlashRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.18,
          ease: 'power2.in',
          onComplete: () => {
            gsap.to(glowFlashRef.current, { opacity: 0, duration: 0.55, ease: 'power2.out' })
          },
        },
        1.55
      )

      tl.fromTo(
        numberRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        0.6
      )

      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, transformOrigin: 'left', ease: 'power3.inOut' },
        0.9
      )

      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.1
      )

      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.3
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const imgSrc = playerImage || piovi4

  return (
    <Box
      ref={containerRef}
      as="section"
      id="hero"
      position="relative"
      minH="100vh"
      bg="#080C12"
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Background grid lines */}
      <GridLines />

      {/* Blue glow behind player */}
      <Box
        position="absolute"
        bottom="0"
        left="50%"
        transform="translateX(-50%)"
        w={{ base: '400px', md: '700px' }}
        h={{ base: '400px', md: '700px' }}
        bg="radial-gradient(ellipse at bottom, rgba(0,87,184,0.22) 0%, transparent 70%)"
        pointerEvents="none"
        zIndex={1}
      />

      {/* Main content */}
      <Flex
        flex="1"
        position="relative"
        zIndex={2}
        align="center"
        justify="center"
        px={{ base: 4, md: 8, lg: 16 }}
        pt="80px"
      >
        {/* Giant name — background layer */}
        <Box
          position="absolute"
          bottom={{ base: '160px', md: '10px' }}
          left="0"
          right="0"
          display="flex"
          justifyContent="center"
          overflow="hidden"
          zIndex={3}
          pointerEvents="none"
        >
          <Flex gap={{ base: '0.5vw', md: '0.8vw' }} align="baseline">
            {heroName.split('').map((letter, i) => (
              <Box
                key={i}
                ref={(el) => (bgLettersRef.current[i] = el)}
                as="span"
                fontFamily="'Bebas Neue', sans-serif"
                fontSize={{ base: '22vw', md: '18vw', lg: '40vw' }}
                lineHeight="0.88"
                color="transparent"
                sx={{ WebkitTextStroke: '1px rgba(255,255,255,0.08)' }}
                display="inline-block"
                userSelect="none"
              >
                {letter}
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Foreground name — visible */}
        <Box
          position="absolute"
          bottom={{ base: '160px', md: '320px' }}
          left="0"
          right="0"
          display="flex"
          justifyContent="center"
          overflow="hidden"
          zIndex={4}
          pointerEvents="none"
        >
          <Flex gap={{ base: '0.5vw', md: '0.8vw' }} align="baseline">
            {heroName.split('').map((letter, i) => (
              <Box
                key={i}
                ref={(el) => { lettersRef.current[i] = el }}
                as="span"
                fontFamily="'Bebas Neue', sans-serif"
                fontSize={{ base: '22vw', md: '18vw', lg: '20vw' }}
                lineHeight="0.88"
                letterSpacing="30px"
                color="white"
                display="inline-block"
                userSelect="none"
              >
                {letter}
              </Box>
            ))}
          </Flex>
        </Box>

        {/* Left info panel */}
        <Box
          position="absolute"
          left={{ base: 6, md: 12, lg: 20 }}
          bottom={{ base: '200px', md: '160px' }}
          zIndex={6}
          display={{ base: 'none', md: 'block' }}
        >
          <HoverFloat intensity={1.2}>
            <Box ref={numberRef}>
              <Text
                fontFamily="'Bebas Neue', sans-serif"
                fontSize={{ md: '120px', lg: '160px' }}
                lineHeight="0.85"
                color="transparent"
                sx={{ WebkitTextStroke: '1px rgba(0,87,184,0.4)' }}
                mb={4}
              >
                3
              </Text>
            </Box>
          </HoverFloat>

          <Box ref={lineRef} h="1px" w="80px" bg="brand.blue" mb={3} />

          <HoverFloat intensity={1}>
            <Box ref={subtitleRef}>
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="13px"
                fontWeight="600"
                letterSpacing="0.18em"
                textTransform="uppercase"
                color="whiteAlpha.600"
                mb={1}
              >
                Defensor Central
              </Text>
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="13px"
                fontWeight="600"
                letterSpacing="0.18em"
                textTransform="uppercase"
                color="brand.blue"
              >
                🇦🇷 Argentina
              </Text>
            </Box>
          </HoverFloat>
        </Box>

        {/* Right info panel */}
        <Box
          position="absolute"
          right={{ base: 6, md: 12, lg: 20 }}
          bottom={{ base: '200px', md: '200px' }}
          zIndex={6}
          display={{ base: 'none', md: 'block' }}
          textAlign="right"
        >
          <Box ref={statsRef}>
            <VStack spacing={3} align="flex-end">
              <HoverFloat intensity={1}>
                <MiniStat label="Edad" value="27" />
              </HoverFloat>
              <HoverFloat intensity={1}>
                <MiniStat label="Club" value="Cruz Azul" accent />
              </HoverFloat>
              <HoverFloat intensity={1}>
                <MiniStat label="Altura" value="1.84m" />
              </HoverFloat>
            </VStack>
          </Box>
        </Box>
      </Flex>

      {/* Player photo — fixed at bottom, covered by CinematicTransition via z-index */}
      {!hidePlayerImage && (
          <Box
            ref={photoRef}
            position="absolute"
            bottom="0"
            left="50%"
            transform="translateX(-50%)"
            pointerEvents="none"
            zIndex={20}
            w={{ base: '280px', md: '400px', lg: '370px' }}
          >
            <Box ref={photoInnerRef} position="relative" zIndex={20}>
              <Image
                src={imgSrc}
                alt="Gonzalo Piovi"
                objectFit="contain"
                w="100%"
                h="auto"
              />
            </Box>
          </Box>
      )}

      {/* Marquee bottom bar */}
      <MarqueeBar />

      {/* Scroll indicator */}
      <ScrollIndicator />
    </Box>
  )
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────

function MiniStat({ label, value, accent }) {
  return (
    <VStack spacing={0} align="flex-end">
      <Text
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="10px"
        fontWeight="600"
        letterSpacing="0.2em"
        textTransform="uppercase"
        color="whiteAlpha.500"
      >
        {label}
      </Text>
      <Text
        fontFamily="'Bebas Neue', sans-serif"
        fontSize="22px"
        letterSpacing="0.05em"
        color={accent ? 'brand.blue' : 'white'}
        lineHeight="1.1"
      >
        {value}
      </Text>
    </VStack>
  )
}

function MarqueeBar() {
  return (
    <Box
      position="relative"
      zIndex={10}
      borderTop="1px solid rgba(255,255,255,0.06)"
      borderBottom="1px solid rgba(255,255,255,0.06)"
      bg="rgba(0,87,184,0.08)"
      py={3}
      overflow="hidden"
    >
      <Box display="flex" width="max-content">
        <Box className="marquee-track" display="flex" gap={6} whiteSpace="nowrap">
          {marqueeItems.map((item, i) => (
            <Text
              key={i}
              as="span"
              fontFamily="'Barlow Condensed', sans-serif"
              fontWeight={item === '·' ? '300' : '600'}
              fontSize="12px"
              letterSpacing="0.18em"
              textTransform="uppercase"
              color={item === '·' ? 'brand.blue' : 'whiteAlpha.500'}
            >
              {item}
            </Text>
          ))}
          {marqueeItems.map((item, i) => (
            <Text
              key={`b-${i}`}
              as="span"
              fontFamily="'Barlow Condensed', sans-serif"
              fontWeight={item === '·' ? '300' : '600'}
              fontSize="12px"
              letterSpacing="0.18em"
              textTransform="uppercase"
              color={item === '·' ? 'brand.blue' : 'whiteAlpha.500'}
            >
              {item}
            </Text>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

function GridLines() {
  return (
    <Box
      position="absolute"
      inset="0"
      zIndex={0}
      pointerEvents="none"
      sx={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: '80px 80px',
      }}
    />
  )
}

// ─── HOVER FLOAT ─────────────────────────────────────────────────
function HoverFloat({ children, intensity = 1 }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2  // -1 → 1
    const dy = ((e.clientY - r.top)  / r.height - 0.5) * 2
    gsap.to(el, {
      x: dx * 7 * intensity,
      y: dy * 5 * intensity,
      rotateX: -dy * 4 * intensity,
      rotateY:  dx * 4 * intensity,
      duration: 0.35,
      ease: 'power2.out',
      transformPerspective: 600,
    })
  }

  const onLeave = () => {
    gsap.to(ref.current, {
      x: 0, y: 0, rotateX: 0, rotateY: 0,
      duration: 0.55,
      ease: 'power3.out',
    })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ display: 'inline-block', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}

function ScrollIndicator() {
  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: '80px',
        right: '24px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
      animate={{ y: [0, 8, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      <Box
        w="1px"
        h="48px"
        bg="linear-gradient(to bottom, transparent, rgba(0,87,184,0.8))"
      />
      <Text
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="10px"
        letterSpacing="0.2em"
        textTransform="uppercase"
        color="whiteAlpha.400"
        sx={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        Scroll
      </Text>
    </motion.div>
  )
}
