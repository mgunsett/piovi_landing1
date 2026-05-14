import { useEffect, useRef } from 'react'
import { Box, Flex, Text, VStack, HStack, Image } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

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
  const photoRef = useRef(null)
  const subtitleRef = useRef(null)
  const statsRef = useRef(null)
  const lineRef = useRef(null)
  const numberRef = useRef(null)

  const heroName = 'PIOVI'

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

      // Letters entrance — staggered from bottom
      tl.fromTo(
        lettersRef.current,
        { yPercent: 110, opacity: 0, rotateX: -40 },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: 'expo.out',
        },
        0
      )

      // Photo entrance
      tl.fromTo(
        photoRef.current,
        { yPercent: 8, opacity: 0, scale: 0.97 },
        { yPercent: 0, opacity: 1, scale: 1, duration: 1.4, ease: 'expo.out' },
        0.3
      )

      // Number
      tl.fromTo(
        numberRef.current,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
        0.6
      )

      // Subtitle line
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, transformOrigin: 'left', ease: 'power3.inOut' },
        0.9
      )

      // Subtitle text
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.1
      )

      // Stats row
      tl.fromTo(
        statsRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.3
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

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
                ref={(el) => (lettersRef.current[i] = el)}
                as="span"
                fontFamily="'Bebas Neue', sans-serif"
                fontSize={{ base: '22vw', md: '18vw', lg: '40vw' }}
                lineHeight="0.88"
                color="transparent"
                sx={{
                  WebkitTextStroke: '1px rgba(255,255,255,0.08)',
                }}
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
          zIndex={5}
          pointerEvents="none"
        >
          <Flex gap={{ base: '0.5vw', md: '0.8vw' }} align="baseline">
            {heroName.split('').map((letter, i) => (
              <Box
                key={i}
                ref={(el) => { if (i === 0) lettersRef.current = [] ; lettersRef.current[i] = el }}
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

        {/* Player photo — centered */}
        {!hidePlayerImage && (
          <Box
            ref={photoRef}
            position="absolute"
            bottom="0px"
            left="50%"
            transform="translateX(-50%)"
            zIndex={6}
            w={{ base: '280px', md: '400px', lg: '400px' }}
          >
            <Box>
              <Image
                src={playerImage || '/player.png'}
                alt="Gonzalo Piovi"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 40px 80px rgba(0,87,184,0.4))',
                  display: 'block',
                }}
              />
            </Box>
          </Box>
        )}

        {/* Left info panel */}
        <Box
          position="absolute"
          left={{ base: 6, md: 12, lg: 20 }}
          bottom={{ base: '200px', md: '160px' }}
          zIndex={6}
          display={{ base: 'none', md: 'block' }}
        >
          {/* Jersey number */}
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

          {/* Divider line */}
          <Box
            ref={lineRef}
            h="1px"
            w="80px"
            bg="brand.blue"
            mb={3}
          />

          {/* Position & nationality */}
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
              <MiniStat label="Edad" value="27" />
              <MiniStat label="Club" value="Cruz Azul" accent />
              <MiniStat label="Altura" value="1.84m" />
            </VStack>
          </Box>
        </Box>
      </Flex>

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
