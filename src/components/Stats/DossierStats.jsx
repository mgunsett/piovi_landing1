import { useEffect, useRef } from 'react'
import { Box, Flex, Grid, HStack, Image, Text } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

// Cantidad de segmentos por barra de habilidad (cada uno = 10 pts)
const SEGMENTS = 10

// ─── TÍTULO DE GRUPO ──────────────────────────────────────────────
function GroupTitle({ children }) {
  return (
    <Text
      fontFamily="mono"
      fontSize="11px" fontWeight="700"
      letterSpacing="0.28em" textTransform="uppercase"
      color="brand.accent"
      mb={{ base: 4, md: 5 }}
    >
      {children}
    </Text>
  )
}

// ─── TEMPORADA (tarjeta delimitada con encabezado propio) ─────────
function SeasonPanel() {
  const wrapRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.dossier-tick',
        { y: 18, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.08,
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 90%',
            end: 'top 55%',
            scrub: 1.2,
          },
        }
      )
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box
      ref={wrapRef}
      border="1px solid"
      borderColor="brand.accentLight"
      borderRadius="10px"
      overflow="hidden"
    >
      <Flex
        align="center"
        justify="space-between"
        px={{ base: 4, md: 5 }}
        py={2.5}
        bg="brand.surface"
        borderBottom="1px solid"
        borderColor="brand.accentLight"
      >
        <HStack spacing={2.5}>
          <Image
            src={playerData.logoCurrentClub}
            alt={`Escudo de ${playerData.currentClub}`}
            boxSize="20px"
            objectFit="contain"
          />
          <Text
            fontFamily="mono"
            fontSize="11px" fontWeight="700"
            letterSpacing="0.24em" textTransform="uppercase"
            color="brand.boneWarm"
          >
            Temporada 2025 / 2026
          </Text>
        </HStack>
        <Text
          fontFamily="mono"
          fontSize="10px" fontWeight="700"
          letterSpacing="0.2em" textTransform="uppercase"
          color="brand.gray"
          display={{ base: 'none', sm: 'block' }}
        >
          {playerData.currentClub}
        </Text>
      </Flex>

      <Grid
        templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(6, 1fr)' }}
        rowGap={5}
        px={{ base: 4, md: 5 }}
        py={{ base: 5, md: 6 }}
      >
        {playerData.seasonStats.map((s, i) => (
          <Box
            key={s.label}
            className="dossier-tick"
            textAlign="center"
            px={2}
            borderLeft={{ lg: i === 0 ? 'none' : '1px solid' }}
            borderColor="whiteAlpha.100"
          >
            <Text
              fontFamily="heading"
              fontSize={{ base: '3xl', md: '4xl' }}
              color="brand.bone"
              lineHeight={1}
            >
              {s.value}
            </Text>
            <Text
              fontFamily="mono"
              fontSize="10px" fontWeight="700"
              letterSpacing="0.14em" textTransform="uppercase"
              color="brand.gray"
              mt={1.5}
            >
              {s.label}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

// ─── HABILIDADES (valoración general + barras segmentadas) ────────
function SkillsBlock({ overall }) {
  const blockRef = useRef(null)
  const overallRef = useRef(null)
  const numRefs = useRef([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const trigger = {
        trigger: blockRef.current,
        start: 'top 88%',
        end: 'top 45%',
        scrub: 1.2,
      }
      gsap.fromTo(overallRef.current,
        { textContent: 0 },
        { textContent: overall, snap: { textContent: 1 }, scrollTrigger: trigger }
      )
      gsap.fromTo('.dossier-seg-on',
        { opacity: 0.12 },
        { opacity: 1, stagger: 0.02, scrollTrigger: trigger }
      )
      playerData.stats.forEach((s, i) => {
        const num = numRefs.current[i]
        if (!num) return
        gsap.fromTo(num,
          { textContent: 0 },
          { textContent: s.value, snap: { textContent: 1 }, scrollTrigger: trigger }
        )
      })
    }, blockRef)
    return () => ctx.revert()
  }, [overall])

  return (
    <Box>
      <GroupTitle>Habilidades</GroupTitle>
      <Grid
        ref={blockRef}
        templateColumns={{ base: '1fr', lg: 'auto 1fr' }}
        gap={{ base: 7, lg: 12 }}
        alignItems="center"
      >
        {/* Valoración general — se desprende de las habilidades */}
        <Flex
          direction={{ base: 'row', lg: 'column' }}
          align={{ base: 'center', lg: 'flex-start' }}
          gap={{ base: 4, lg: 1 }}
          borderRight={{ lg: '1px solid' }}
          borderColor="whiteAlpha.100"
          pr={{ lg: 12 }}
        >
          <Text
            ref={overallRef}
            fontFamily="heading"
            fontSize={{ base: '5xl', lg: '7xl' }}
            color="brand.gold"
            lineHeight={1}
          >
            {overall}
          </Text>
          <Text
            fontFamily="mono"
            fontSize="10px" fontWeight="700"
            letterSpacing="0.24em" textTransform="uppercase"
            color="brand.gray"
          >
            Valoración general
          </Text>
        </Flex>

        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          columnGap={{ md: 10, lg: 14 }}
          rowGap={4}
        >
          {playerData.stats.map((s, i) => {
            const filled = Math.round(s.value / SEGMENTS)
            return (
              <Flex key={s.label} align="center" gap={3}>
                <Text
                  fontFamily="mono"
                  fontSize="10px" fontWeight="700"
                  letterSpacing="0.14em" textTransform="uppercase"
                  color="brand.bone"
                  minW="110px"
                  flexShrink={0}
                >
                  {s.label}
                </Text>
                <Flex flex={1} gap={0.5}>
                  {Array.from({ length: SEGMENTS }).map((_, j) => (
                    <Box
                      key={j}
                      className={j < filled ? 'dossier-seg-on' : undefined}
                      flex={1}
                      h={2}
                      borderRadius="sm"
                      bg={
                        j < filled
                          ? j === filled - 1 ? 'brand.gold' : 'brand.accent'
                          : 'whiteAlpha.100'
                      }
                    />
                  ))}
                </Flex>
                <Text
                  ref={(el) => (numRefs.current[i] = el)}
                  fontFamily="heading"
                  fontSize="md"
                  color="brand.boneWarm"
                  minW="30px"
                  textAlign="right"
                >
                  {s.value}
                </Text>
              </Flex>
            )
          })}
        </Grid>
      </Grid>
    </Box>
  )
}

// ─── PERFIL (ficha personal en línea) ─────────────────────────────
function ProfileStrip() {
  const items = [
    { label: 'Posición', value: playerData.position },
    { label: 'Dorsal', value: `Nº ${playerData.number}` },
    { label: 'Club', value: playerData.currentClub },
    { label: 'Nacionalidad', value: playerData.nationality },
    { label: 'Edad', value: `${playerData.age} años` },
    { label: 'Altura', value: playerData.height },
    { label: 'Peso', value: playerData.weight },
    { label: 'Pie', value: playerData.foot },
    { label: 'Nacimiento', value: playerData.birthDate },
    { label: 'Origen', value: playerData.birthPlace },
  ]

  return (
    <Box>
      <GroupTitle>Perfil</GroupTitle>
      <Flex flexWrap="wrap" columnGap={{ base: 6, md: 8 }} rowGap={2.5}>
        {items.map((item) => (
          <HStack key={item.label} spacing={2}>
            <Text
              fontFamily="mono"
              fontSize="10px" fontWeight="700"
              letterSpacing="0.16em" textTransform="uppercase"
              color="brand.gray"
            >
              {item.label}
            </Text>
            <Text fontFamily="mono" fontSize="sm" fontWeight="600" color="brand.bone">
              {item.value}
            </Text>
          </HStack>
        ))}
      </Flex>
    </Box>
  )
}

// ─── BLOQUE PRINCIPAL ─────────────────────────────────────────────
export function DossierStats() {
  const overall = Math.round(
    playerData.stats.reduce((sum, s) => sum + s.value, 0) / playerData.stats.length
  )

  return (
    <Box
      position="relative"
      bg="brand.dark"
      border="1px solid"
      borderColor="brand.accent"
      borderRadius="14px"
      overflow="hidden"
      p={{ base: 5, md: 8, lg: 10 }}
    >
  

      <Box position="relative" zIndex={1}>
        <SeasonPanel />

        <Box mt={{ base: 8, md: 10 }}>
          <SkillsBlock overall={overall} />
        </Box>

        <Box
          mt={{ base: 8, md: 10 }}
          pt={{ base: 6, md: 7 }}
          borderTop="1px solid"
          borderColor="whiteAlpha.100"
        >
          <ProfileStrip />
        </Box>
      </Box>
    </Box>
  )
}
