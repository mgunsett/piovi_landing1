import { useEffect, useRef } from 'react'
import { Box, Flex, Text, VStack, Image } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

import piovi4 from '../../assets/piovi4.svg'
import { playerData } from '../../data/playerData'

// ─── HERO COMPONENT ──────────────────────────────────────────────
export default function Hero({ playerImage, hidePlayerImage = false }) {
  // Layout refs
  const outerRef     = useRef(null)  // 200vh scroll-space wrapper
  const containerRef = useRef(null)  // sticky 100vh inner viewport

  // Parallax layer refs (scroll-driven Y)
  const bgLayerRef    = useRef(null)  // ghost text + grid — slowest
  const midLayerRef   = useRef(null)  // white PIOVI letters — medium
  const photoLayerRef = useRef(null)  // player photo — fastest (foreground)

  // Individual element refs (mouse parallax + entry animation)
  const lettersRef    = useRef([])   // white PIOVI letters inside midLayer
  const bgLettersRef  = useRef([])   // ghost PIOVI letters inside bgLayer
  const gonzaloRef    = useRef(null) // ghost GONZALO text
  const photoRef      = useRef(null) // photo container inside photoLayer
  const photoInnerRef = useRef(null) // photo inner (clip entry animation)
  const glowFlashRef  = useRef(null)
  const vignetteRef   = useRef(null)

  // Static UI refs (no parallax)
  const subtitleRef = useRef(null)
  const statsRef    = useRef(null)
  const lineRef     = useRef(null)
  const numberRef   = useRef(null)

  const heroName = 'PIOVI'

  // ── Mouse parallax on individual elements within each layer ────
  // Layers handle scroll-Y; elements handle mouse-X/Y — no conflict
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const onMove = (e) => {
      const rect = container.getBoundingClientRect()
      const xn = (e.clientX - rect.left) / rect.width - 0.5
      const yn = (e.clientY - rect.top) / rect.height - 0.5

      if (gonzaloRef.current) {
        gsap.to(gonzaloRef.current, { x: xn * 4, y: yn * 2, duration: 1.8, ease: 'power2.out' })
      }
      if (bgLettersRef.current.length) {
        gsap.to(bgLettersRef.current, { x: xn * 6, y: yn * 3, duration: 1.6, ease: 'power2.out', stagger: 0.02 })
      }
      if (lettersRef.current.length) {
        gsap.to(lettersRef.current, { x: xn * 14, y: yn * 7, duration: 1.2, ease: 'power2.out', stagger: 0.02 })
      }
      if (photoRef.current) {
        gsap.to(photoRef.current, { x: xn * 28, y: yn * 14, duration: 1.0, ease: 'power2.out' })
      }
    }

    container.addEventListener('mousemove', onMove)
    return () => container.removeEventListener('mousemove', onMove)
  }, [])

  // ── Scroll parallax — 3 layers at different Y speeds ──────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Scrub tied to the tall wrapper. The inner viewport is pinned via
      // CSS sticky for the whole [0 → wrapperH−100vh] window, so these
      // layers keep drifting BOTH while the Hero is alone (advance phase)
      // AND while StatsSection rises to cover it (cover phase).
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      })

      // All layers (title + player photo) remain static on scroll.
      // Only the vignette deepens — no vertical parallax travel.

      // Vignette deepens as scroll advances
      tl.to(vignetteRef.current, {
        background:
          'radial-gradient(ellipse at center, transparent 0%, transparent 28%, rgba(8,12,18,0.55) 58%, rgba(8,12,18,0.97) 100%)',
        ease: 'none',
      }, 0)
    }, outerRef)

    return () => ctx.revert()
  }, [])

  // ── Entry animation (page load) ───────────────────────────────
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

      if (glowFlashRef.current) {
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
      }

      tl.fromTo(numberRef.current,   { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 0.6)
      tl.fromTo(lineRef.current,     { scaleX: 0 },           { scaleX: 1, duration: 0.7, transformOrigin: 'left', ease: 'power3.inOut' }, 0.9)
      tl.fromTo(subtitleRef.current, { opacity: 0, y: 12 },   { opacity: 1, y: 0, duration: 0.6 }, 1.1)
      tl.fromTo(statsRef.current,    { opacity: 0, y: 16 },   { opacity: 1, y: 0, duration: 0.6 }, 1.3)
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const imgSrc = playerImage || piovi4

  return (
    // ── Outer wrapper — tall scroll space that gives the inner its
    //    sticky "pin" duration. With inner = 100vh, the inner stays
    //    pinned for [0 → wrapperH − 100vh].
    //    · base 250vh → ~50vh advance phase  + 100vh cover phase
    //    · md   300vh → ~100vh advance phase + 100vh cover phase
    //    The 100vh cover phase is mirrored by StatsSection's −100vh
    //    top margin in App.jsx, so Stats slides up over the STILL-pinned
    //    Hero — the Hero never scrolls away, it gets tucked behind. ──
    <Box
      ref={outerRef}
      as="section"
      id="hero"
      position="relative"
      zIndex={1}
      h={{ base: '200vh', md: '200vh' }}
    >
      {/* ── Inner sticky viewport — pinned while Stats covers it ── */}
      <Box
        ref={containerRef}
        position="sticky"
        top={0}
        h="100vh"
        bg="#080C12"
        overflow="hidden"
        display="flex"
        flexDirection="column"
        zIndex={1}
      >
        {/* Noise texture (above layers, below vignette) */}
        <div className="noise-overlay" style={{ zIndex: 22 }} />

        {/* Vignette — intensifies on scroll */}
        <Box
          ref={vignetteRef}
          position="absolute"
          inset="0"
          zIndex={24}
          pointerEvents="none"
          bg="radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(8,12,18,0.2) 85%, rgba(8,12,18,0.5) 100%)"
        />

        {/* ═══════════════════════════════════════════════════════
            LAYER 1 — BACKGROUND (slowest)
            Ghost "GONZALO / PIOVI" text + grid + blue glow
        ══════════════════════════════════════════════════════════ */}
        <Box
          ref={bgLayerRef}
          position="absolute"
          inset={0}
          zIndex={1}
          pointerEvents="none"
          willChange="transform"
        >
          <GridLines />

          {/* Blue radial glow behind the player */}
          <Box
            position="absolute"
            bottom="0"
            left="50%"
            transform="translateX(-50%)"
            w={{ base: '400px', md: '700px' }}
            h={{ base: '400px', md: '700px' }}
            bg="radial-gradient(ellipse at bottom, rgba(0,87,184,0.22) 0%, transparent 70%)"
          />

          {/* Ghost name block: GONZALO (small) above PIOVI (huge) */}
          <Box
            position="absolute"
            bottom={{ base: '0px', md: '-10px' }}
            left="0"
            right="0"
            display="flex"
            flexDirection="column"
            alignItems="center"
            overflow="hidden"
          >
            {/* GONZALO — smaller first name */}
            <Text
              ref={gonzaloRef}
              fontFamily="'Bebas Neue', sans-serif"
              fontSize={{ base: '13vw', md: '10vw', lg: '12.5vw' }}
              lineHeight="0.85"
              letterSpacing={{ base: '0.55em', md: '0.35em' }}
              color="transparent"
              sx={{ WebkitTextStroke: '1px rgba(255,255,255,0.055)' }}
              userSelect="none"
              display="block"
              mb={{ base: '-0.8em', md: '-35px' }}
            >
              {playerData.name.toUpperCase()}
            </Text>

            {/* PIOVI — giant ghost stroke */}
            <Flex gap={{ base: '0.5vw', md: '3vw' }} align="baseline">
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
        </Box>

        {/* ═══════════════════════════════════════════════════════
            LAYER 2 — MID-GROUND (medium speed)
            Visible white "PIOVI" letters — float between photo and bg
        ══════════════════════════════════════════════════════════ */}
        <Box
          ref={midLayerRef}
          position="absolute"
          inset={0}
          zIndex={5}
          pointerEvents="none"
          willChange="transform"
        >
          <Flex
            flexDirection="column"
            alignItems="center"
            position="absolute"
            bottom={{ base: '120px', md: '270px' }}
            left="0"
            right="0"
            display="flex"
            justifyContent="center"
            overflow="hidden"
          >
            <Text
              
              fontFamily="'Bebas Neue', sans-serif"
              fontSize={{ base: '13vw', md: '10vw', lg: '8vw' }}
              lineHeight="0.85"
              letterSpacing={{ base: '0.55em', md: '0.35em' }}
              color="white"
              userSelect="none"
              display="inline-block"
              mb={{ base: '-0.8em', md: '-35px' }}
            >
              {playerData.name.toUpperCase()}
            </Text>
            <Flex gap={{ base: '0.5vw', md: '3vw' }} align="baseline">
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
          </Flex>
        </Box>

        {/* ═══════════════════════════════════════════════════════
            LAYER 3 — FOREGROUND (STATIC)
            Player photo — anchored at the bottom, no scroll travel.
            Depth comes from the text layers moving behind it, so the
            feet stay pinned to the bottom and the head never crops.
        ══════════════════════════════════════════════════════════ */}
        {!hidePlayerImage && (
          <Box
            ref={photoLayerRef}
            position="absolute"
            inset={0}
            zIndex={10}
            pointerEvents="none"
          >
            <Box
              ref={photoRef}
              position="absolute"
              bottom="0"
              left="50%"
              transform="translateX(-50%)"
              w={{ base: '280px', md: '400px', lg: '370px' }}
            >
              <Box ref={photoInnerRef} position="relative">
                <Image
                  src={imgSrc}
                  alt="Gonzalo Piovi"
                  objectFit="contain"
                  w="100%"
                  h="auto"
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* ── Static UI — info panels, no parallax ─────────────── */}
        <Flex
          flex="1"
          position="relative"
          zIndex={15}
          align="center"
          justify="center"
          px={{ base: 4, md: 8, lg: 16 }}
          pt="80px"
        >
          {/* Left info panel */}
          <Box
            position="absolute"
            left={{ base: 6, md: 12, lg: 20 }}
            bottom={{ base: '200px', md: '160px' }}
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
                  {playerData.number}
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
                  {playerData.position}
                </Text>
                <Text
                  fontFamily="'Barlow Condensed', sans-serif"
                  fontSize="13px"
                  fontWeight="600"
                  letterSpacing="0.18em"
                  textTransform="uppercase"
                  color="brand.blue"
                >
                  {playerData.nationalityFlag} {playerData.nationality}
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
                  <MiniStat label="Edad" value={playerData.age} />
                </HoverFloat>
                <HoverFloat intensity={1}>
                  <MiniStat label="Club" value={playerData.currentClub} logo={playerData.logoCurrentClub} accent />
                </HoverFloat>
                <HoverFloat intensity={1}>
                  <MiniStat label="Altura" value={playerData.height} />
                </HoverFloat>
              </VStack>
            </Box>
          </Box>
        </Flex>

        {/* Entry glow flash */}
        <Box
          ref={glowFlashRef}
          position="absolute"
          inset={0}
          zIndex={20}
          pointerEvents="none"
          bg="radial-gradient(ellipse at center bottom, rgba(0,87,184,0.4) 0%, transparent 60%)"
          opacity={0}
        />

        {/* Marquee bottom bar */}
        <MarqueeBar playerData={playerData} />

        {/* Scroll indicator */}
        <ScrollIndicator />
      </Box>
    </Box>
  )
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────

function MiniStat({ label, value, accent, logo }) {
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
      {/* Value + logo (optional), aligned to the right edge */}
      <Flex align="center" justify="flex-end" gap="8px">
        <Text
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="22px"
          letterSpacing="0.05em"
          color={accent ? 'brand.blue' : 'white'}
          
        >
          {value}
        </Text>
        {logo && (
          <Image
            src={logo}
            alt={typeof value === 'string' ? value : 'logo'}
            boxSize="26px"
            objectFit="contain"
            flexShrink={0}
          />
        )}
      </Flex>
    </VStack>
  )
}

function MarqueeBar({ playerData }) {
  return (
    <Box
      position="relative"
      zIndex={18}
      borderTop="1px solid rgba(255,255,255,0.06)"
      borderBottom="1px solid rgba(255,255,255,0.06)"
      bg="rgba(0,87,184,0.08)"
      py={3}
      overflow="hidden"
    >
      <Box display="flex" width="max-content">
        <Box className="marquee-track" display="flex" gap={6} whiteSpace="nowrap">
          {playerData.marqueeItems.map((item, i) => (
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
          {playerData.marqueeItems.map((item, i) => (
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
    const dx = ((e.clientX - r.left) / r.width  - 0.5) * 2
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
        zIndex: 18,
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
