import { useEffect, useRef } from 'react'
import { Box, Text, VStack, Flex } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useScroll, useTransform } from 'framer-motion'

gsap.registerPlugin(ScrollTrigger)

export default function CinematicTransition({ playerImage, useSharedImage = false }) {
  const sectionRef = useRef(null)
  const pinContainerRef = useRef(null)
  const bgRef = useRef(null)
  const photoRef = useRef(null)
  const textLeftRef = useRef(null)
  const textRightRef = useRef(null)
  const overlayRef = useRef(null)
  const taglineRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinContainerRef.current,
          start: 'top top',
          end: '+=250%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Phase 1: Fondo blanco hueso aparece (0 → 0.4)
      tl.fromTo(bgRef.current,
        { backgroundColor: '#080C12' },
        { backgroundColor: '#F5F0E8', duration: 0.4 },
        0
      )

      // Foto entra suavemente (0 → 0.3)
      tl.fromTo(photoRef.current,
        { scale: 0.85, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.3 },
        0
      )

      // Texto izquierdo entra (0.1 → 0.5)
      tl.fromTo(textLeftRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 },
        0.1
      )

      // Texto derecho entra (0.2 → 0.6)
      tl.fromTo(textRightRef.current,
        { x: 80, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4 },
        0.2
      )

      // Phase 2: Fondo cambia a azul Cruz Azul (0.5 → 1.0)
      tl.to(bgRef.current,
        { backgroundColor: '#0057B8', duration: 0.5 },
        0.5
      )

      // Overlay blanco sale (0.5 → 0.8)
      tl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 0.06, duration: 0.3 },
        0.5
      )

      // Texto cambia a blanco (0.5 → 0.8)
      tl.to([textLeftRef.current, textRightRef.current],
        { color: 'rgba(255,255,255,0.9)', duration: 0.3 },
        0.5
      )

      // Tagline entra desde abajo (0.7 → 1.0)
      tl.fromTo(taglineRef.current,
        { yPercent: 60, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.4 },
        0.65
      )

      // Foto escala levemente (acento en fase 2)
      tl.to(photoRef.current,
        { scale: 1.04, duration: 0.5 },
        0.5
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <Box ref={sectionRef} position="relative">
      {/* Pin container */}
      <Box
        ref={pinContainerRef}
        id="cinematic-transition"
        position="relative"
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

        {/* Grid overlay (sutil) */}
        <Box
          ref={overlayRef}
          position="absolute"
          inset="0"
          zIndex={1}
          pointerEvents="none"
          sx={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Noise */}
        <div className="noise-overlay" style={{ zIndex: 1 }} />

        {/* Layout principal */}
        <Flex
          position="relative"
          zIndex={2}
          h="100%"
          align="center"
          justify="center"
          px={{ base: 4, md: 12, lg: 20 }}
        >
          {/* Left text panel */}
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

          {/* Center — shared image spacer or local image */}
          {useSharedImage ? (
            <Box
              flex={{ base: '1', md: '0 0 420px' }}
              maxW={{ base: '300px', md: '420px' }}
              mx="auto"
              position="relative"
            />
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

          {/* Right text panel */}
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
