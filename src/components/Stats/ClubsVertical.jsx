import { useEffect, useRef } from 'react'
import { Box, Flex, Grid, GridItem, Image, Text, VStack } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

// ─── ENCABEZADO DE LA SECCIÓN ─────────────────────────────────────
function ClubsHeader() {
  return (
    <Box mb={{ base: 8, lg: 12 }}>
      <Text fontFamily='"mono", monospace' fontSize="10px" color="brand.bone"
            textTransform="uppercase" letterSpacing="widest">
        Trayectoria
      </Text>
      <Text as="h2" fontFamily='heading' fontWeight="bold"
            fontSize={{ base: '5xl', lg: '5xl' }} color="brand.accent" lineHeight={1}>
        Clubes
      </Text>
    </Box>
  )
}

// ─── ESCUDO SOBRE LA LÍNEA ────────────────────────────────────────
function ClubBadge({ club, isActive }) {
  return (
    <Flex
      boxSize={{ base: '48px', lg: '60px' }}
      borderRadius="full"
      align="center"
      justify="center"
      bg="brand.steel"
      border="1px solid"
      borderColor="brand.accent"
      boxShadow={isActive ? '0 0 0 4px #bda78e6b, 0 0 24px #bda78e66' : 'none'}
      position="relative"
      zIndex={1}
      flexShrink={0}
      transition="box-shadow 0.35s, transform 0.35s"
      _groupHover={{
        transform: 'scale(1.06)',
        boxShadow: '0 0 0 4px #bda78e4d, 0 0 24px #bda78e55',
      }}
    >
      <Image
        src={club.logo}
        alt={`Escudo de ${club.name}`}
        boxSize="58%"
        objectFit="contain"
        loading="lazy"
        filter={isActive ? 'none' : 'saturate(0.85)'}
        transition="filter 0.35s"
        _groupHover={{ filter: 'none' }}
      />
    </Flex>
  )
}

// ─── PERÍODO EN EL LADO OPUESTO A LA TARJETA (solo escritorio) ────
function YearMark({ years, isActive, cardSide }) {
  return (
    <Flex
      h="100%"
      align="center"
      justify={cardSide === 'left' ? 'flex-start' : 'flex-end'}
      px={{ lg: 8 }}
    >
      <Text
        fontFamily="heading"
        fontSize={{ lg: '2xl', xl: '3xl' }}
        letterSpacing="0.08em"
        textTransform="uppercase"
        color={isActive ? 'brand.accentLight' : 'brand.accent'}
        opacity={isActive ? 1 : 0.85}
        transition="opacity 0.3s"
        _groupHover={{ opacity: 1 }}
      >
        {years}
      </Text>
    </Flex>
  )
}

// ─── TARJETA DE CLUB ──────────────────────────────────────────────
function ClubCard({ club, isActive, side }) {
  // En escritorio el texto se alinea hacia la línea central
  const alignDesk = side === 'left' ? 'right' : 'left'
  const stackAlign = { base: 'flex-start', lg: alignDesk === 'right' ? 'flex-end' : 'flex-start' }

  return (
    <Box
      bg="brand.dark"
      border="1px solid"
      borderColor={isActive ? 'brand.accent' : 'brand.accentLight'}
      borderRadius="lg"
      px={{ base: 4, md: 5 }}
      py={{ base: 4, md: 5 }}
      maxW={{ lg: '420px' }}
      ml={{ base: 0, lg: side === 'left' ? 'auto' : 0 }}
      mr={{ base: 0, lg: side === 'right' ? 'auto' : 0 }}
      textAlign={{ base: 'left', lg: alignDesk }}
      transition="border-color 0.35s, background 0.35s, transform 0.35s"
      _groupHover={{
        borderColor: 'brand.accent',
        bg: 'brand.surface',
        transform: 'translateY(-3px)',
      }}
    >
      {/* Período (solo móvil: en escritorio va del otro lado de la línea) */}
      <Text
        display={{ base: 'block', lg: 'none' }}
        fontFamily="mono"
        fontSize="10px"
        color={isActive ? 'brand.accentLight' : 'brand.boneWarm'}
        textTransform="uppercase"
        letterSpacing="0.2em"
        mb={1}
      >
        {club.years}
      </Text>

      <Text
        fontFamily='"Dela Gothic One", monospace'
        textTransform="uppercase"
        fontSize={{ base: 'xs', lg: 'sm' }}
        color="brand.bone"
        lineHeight={1.25}
      >
        {club.name}
      </Text>
      <Text
        fontFamily="mono"
        fontSize="10px"
        color="brand.gray"
        textTransform="uppercase"
        letterSpacing="0.18em"
        mt={1}
      >
        {club.country}
      </Text>

      {club.titles.length > 0 && (
        <VStack spacing={1} mt={2.5} align={stackAlign}>
          {club.titles.map((t) => (
            <Text key={t} fontFamily="mono" fontSize="12px" color="brand.boneWarm">
              🏆 {t}
            </Text>
          ))}
        </VStack>
      )}

      {club.info && (
        <VStack spacing={0.5} mt={2} align={stackAlign}>
          {(Array.isArray(club.info) ? club.info : [club.info])
            .filter(Boolean)
            .map((line) => (
              <Text key={line} fontFamily="mono" fontSize="10px" color="brand.gray" lineHeight={1.5}>
                {line}
              </Text>
            ))}
        </VStack>
      )}
    </Box>
  )
}

// ─── ETAPA DE LA LÍNEA DE TIEMPO ──────────────────────────────────
function TimelineItem({ club, index, isActive }) {
  // Las tarjetas alternan de lado en escritorio; en móvil van todas a la derecha
  const side = index % 2 === 0 ? 'left' : 'right'

  return (
    <Grid
      className="vclub-item"
      role="group"
      templateColumns={{ base: '48px 1fr', lg: '1fr 96px 1fr' }}
      columnGap={{ base: 4, lg: 0 }}
      alignItems="center"
    >
      {/* Escudo sobre la línea */}
      <GridItem colStart={{ base: 1, lg: 2 }} rowStart={1} display="flex" justifyContent="center">
        <ClubBadge club={club} isActive={isActive} />
      </GridItem>

      {/* Tarjeta */}
      <GridItem colStart={{ base: 2, lg: side === 'left' ? 1 : 3 }} rowStart={1}>
        <ClubCard club={club} isActive={isActive} side={side} />
      </GridItem>

      {/* Período al lado opuesto (solo escritorio) */}
      <GridItem
        colStart={{ lg: side === 'left' ? 3 : 1 }}
        rowStart={1}
        display={{ base: 'none', lg: 'block' }}
        h="100%"
      >
        <YearMark years={club.years} isActive={isActive} cardSide={side} />
      </GridItem>
    </Grid>
  )
}

// ─── BLOQUE PRINCIPAL ─────────────────────────────────────────────
export function ClubsVertical() {
  const wrapRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // La línea se "dibuja" a medida que se recorre la trayectoria
      gsap.fromTo(progressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapRef.current,
            start: 'top 70%',
            end: 'bottom 75%',
            scrub: 1,
          },
        }
      )
      // Aparición de cada etapa
      wrapRef.current.querySelectorAll('.vclub-item').forEach((el) => {
        gsap.fromTo(el,
          { y: 26, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          }
        )
      })
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box mt={16}>
      <ClubsHeader />

      <Box ref={wrapRef} position="relative" maxW="1100px" mx="auto">
        {/* Línea vertical (base + progreso animado) */}
        <Box
          aria-hidden
          position="absolute"
          top="30px"
          bottom="30px"
          left={{ base: '24px', lg: '50%' }}
          transform={{ base: 'none', lg: 'translateX(-50%)' }}
          w="1px"
        >
          <Box position="absolute" inset={0} bg="brand.accentLight" />
          <Box
            ref={progressRef}
            position="absolute"
            inset={0}
            bgGradient="linear(to-b, brand.accent, brand.gold)"
            transformOrigin="top"
            transform="scaleY(0)"
          />
        </Box>

        <VStack spacing={{ base: 8, lg: 6 }} align="stretch">
          {playerData.clubs.map((club, i) => (
            <TimelineItem
              key={`${club.name}-${club.years}`}
              club={club}
              index={i}
              isActive={i === 0}
            />
          ))}
        </VStack>
      </Box>
    </Box>
  )
}
