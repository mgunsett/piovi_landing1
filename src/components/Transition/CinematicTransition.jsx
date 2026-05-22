import { useEffect, useRef } from 'react'
import { Box, Text, VStack, Flex } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── CINEMATIC TRANSITION ─────────────────────────────────────────
// Architecture:
//   sectionRef      — outer wrapper, height: 350vh, position: relative
//                     id="cinematic-transition-outer"
//                     This tall div is the ScrollTrigger anchor AND the
//                     element that makes CSS sticky work correctly.
//
//   pinContainerRef — inner sticky viewport, height: 100vh, position: sticky, top: 0
//                     id="cinematic-transition"
//                     Sticks inside its 350vh parent → gives 250vh of
//                     scrub without relying on ScrollTrigger pin.
//
// After the 350vh outer wrapper is scrolled past, the sticky element
// "lands" at the bottom of its container (page position ~250vh into
// the section). StatsSection, which follows immediately in the DOM,
// naturally slides UP over the still-visible blue CinematicTransition,
// creating the layered "cover" effect without any extra JS.
// ─────────────────────────────────────────────────────────────────

export default function CinematicTransition({ playerImage, useSharedImage = false }) {
  const sectionRef      = useRef(null) // outer 350vh wrapper
  const pinContainerRef = useRef(null) // inner sticky 100vh element
  const bgRef           = useRef(null)
  const photoRef        = useRef(null)
  const textLeftRef     = useRef(null)
  const textRightRef    = useRef(null)
  const overlayRef      = useRef(null)
  const taglineRef      = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Scrubbed timeline driven by the OUTER 350vh wrapper ───
      // start: outer-top  = viewport-top  → progress 0
      // end:   outer-bottom = viewport-bottom → progress 1
      // Scroll distance = 350vh – 100vh = 250vh  ✓
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })

      // ── Phase 1 (0 → 0.4): Dark → bone white ─────────────────
      tl.fromTo(
        bgRef.current,
        { backgroundColor: '#080C12' },
        { backgroundColor: '#F5F0E8', duration: 0.4 },
        0
      )

      // Photo enters from slightly below (only for local / non-shared)
      if (!useSharedImage && photoRef.current) {
        tl.fromTo(
          photoRef.current,
          { scale: 0.85, opacity: 0.6 },
          { scale: 1.0, opacity: 1, duration: 0.3 },
          0
        )
      }

      // Left text slides in from left
      tl.fromTo(
        textLeftRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 },
        0.1
      )

      // Right text slides in from right
      tl.fromTo(
        textRightRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 },
        0.2
      )

      // ── Phase 2 (0.5 → 1.0): Bone white → Cruz Azul blue ─────
      tl.to(bgRef.current, { backgroundColor: '#0057B8', duration: 0.5 }, 0.5)

      // Grid overlay fades in
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 0.06, duration: 0.3 },
        0.5
      )

      // Text colour shifts to white
      tl.to(
        [textLeftRef.current, textRightRef.current],
        { color: 'rgba(255,255,255,0.9)', duration: 0.3 },
        0.5
      )

      // Tagline rises from below
      tl.fromTo(
        taglineRef.current,
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.4 },
        0.65
      )

      // Local photo: subtle zoom accent in phase 2
      if (!useSharedImage && photoRef.current) {
        tl.to(photoRef.current, { scale: 1.04, duration: 0.5 }, 0.5)
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [useSharedImage])

  return (
    // ── Outer wrapper — the "tall scroll space" for sticky ────────
    <Box
      ref={sectionRef}
      id="cinematic-transition-outer"
      position="relative"
      h="350vh"   // 100vh visible + 250vh of scrub distance
    >
      {/* ── Inner sticky viewport ─────────────────────────────── */}
      <Box
        ref={pinContainerRef}
        id="cinematic-transition"
        position="sticky"
        top="0"
        w="100%"
        h="100vh"
        overflow="hidden"
      >
        {/* Animated background */}
        <Box
          ref={bgRef}
          position="absolute"
          inset="0"
          bg="#080C12"
          zIndex={0}
        />

        {/* Grid overlay (subtle) */}
        <Box
          ref={overlayRef}
          position="absolute"
          inset="0"
          zIndex={1}
          pointerEvents="none"
          opacity={0}
          sx={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Noise overlay */}
        <div className="noise-overlay" style={{ zIndex: 1 }} />

        {/* ── Main layout ───────────────────────────────────────── */}
        <Flex
          position="relative"
          zIndex={2}
          h="100%"
          align="center"
          justify="center"
          px={{ base: 4, md: 12, lg: 20 }}
        >
          {/* Left text */}
          <Box
            ref={textLeftRef}
            flex="1"
            display={{ base: 'none', md: 'flex' }}
            flexDirection="column"
            justify="flex-end"
            pb={{ md: '80px', lg: '100px' }}
            opacity={0}
          >
            <VStack align="flex-start" spacing={3}>
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="11px"
                fontWeight="700"
                letterSpacing="0.3em"
                textTransform="uppercase"
                opacity={0.5}
              >
                Cruz Azul · Liga MX
              </Text>
              <Text
                fontFamily="'Bebas Neue', sans-serif"
                fontSize={{ md: '56px', lg: '72px' }}
                lineHeight="0.9"
                letterSpacing="0.02em"
              >
                La
                <br />
                Máquina
                <br />
                Celeste
              </Text>
            </VStack>
          </Box>

          {/* Center — shared image spacer OR local image */}
          {useSharedImage ? (
            <Box
              flex={{ base: '1', md: '0 0 420px' }}
              maxW={{ base: '300px', md: '420px' }}
              mx="auto"
              position="relative"
              h={{ base: '60vw', md: '420px' }}
            >
              {/* Ghost watermark — visible through shared image */}
              <Text
                position="absolute"
                bottom="-20px"
                left="50%"
                transform="translateX(-50%)"
                fontFamily="'Bebas Neue', sans-serif"
                fontSize={{ base: '120px', md: '200px' }}
                lineHeight="1"
                color="transparent"
                sx={{ WebkitTextStroke: '1px rgba(255,255,255,0.07)' }}
                userSelect="none"
                zIndex={0}
                whiteSpace="nowrap"
                pointerEvents="none"
              >
                03
              </Text>
            </Box>
          ) : (
            <Box
              ref={photoRef}
              flex={{ base: '1', md: '0 0 420px' }}
              maxW={{ base: '300px', md: '420px' }}
              mx="auto"
              opacity={0}
              position="relative"
            >
              <Text
                position="absolute"
                bottom="-20px"
                left="50%"
                transform="translateX(-50%)"
                fontFamily="'Bebas Neue', sans-serif"
                fontSize="200px"
                lineHeight="1"
                color="transparent"
                sx={{ WebkitTextStroke: '1px rgba(255,255,255,0.07)' }}
                userSelect="none"
                zIndex={0}
                whiteSpace="nowrap"
              >
                03
              </Text>

              <img
                src={playerImage || '/player.png'}
                alt="Gonzalo Piovi"
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 40px 100px rgba(0,0,0,0.5))',
                }}
              />
            </Box>
          )}

          {/* Right text */}
          <Box
            ref={textRightRef}
            flex="1"
            display={{ base: 'none', md: 'flex' }}
            flexDirection="column"
            justify="flex-end"
            pb={{ md: '80px', lg: '100px' }}
            textAlign="right"
            opacity={0}
          >
            <VStack align="flex-end" spacing={3}>
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="11px"
                fontWeight="700"
                letterSpacing="0.3em"
                textTransform="uppercase"
                opacity={0.5}
              >
                #3 · Defensor
              </Text>
              <Text
                fontFamily="'Bebas Neue', sans-serif"
                fontSize={{ md: '56px', lg: '72px' }}
                lineHeight="0.9"
                letterSpacing="0.02em"
              >
                Gonzalo
                <br />
                Piovi
              </Text>
            </VStack>
          </Box>
        </Flex>

        {/* Bottom tagline */}
        <Box
          ref={taglineRef}
          position="absolute"
          bottom={{ base: '40px', md: '60px' }}
          left="0"
          right="0"
          textAlign="center"
          zIndex={3}
          opacity={0}
        >
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize={{ base: '16px', md: '20px' }}
            fontWeight="300"
            letterSpacing="0.4em"
            textTransform="uppercase"
            color="rgba(255,255,255,0.7)"
          >
            El muro inquebrantable
          </Text>
        </Box>

        {/* Phase indicator */}
        <PhaseIndicator />
      </Box>
    </Box>
  )
}

// ─── PHASE INDICATOR ─────────────────────────────────────────────
function PhaseIndicator() {
  return (
    <Box
      position="absolute"
      left={{ base: 4, md: 8 }}
      top="50%"
      transform="translateY(-50%)"
      zIndex={5}
      display={{ base: 'none', md: 'flex' }}
      flexDirection="column"
      gap={2}
    >
      {['01', '02'].map((num, i) => (
        <Text
          key={num}
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="10px"
          fontWeight="700"
          letterSpacing="0.2em"
          color={i === 0 ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)'}
          sx={{ writingMode: 'vertical-rl' }}
        >
          {num}
        </Text>
      ))}
    </Box>
  )
}
