import { useRef, useEffect } from 'react'
import {
  Box, Grid, GridItem, Text, Flex, VStack, HStack, Image, IconButton, useToken,
} from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useScrubReveal from '../../hooks/useScrubReveal'
import { playerData } from '../../data/playerData'
import { RadarStats } from './RadarStats.jsx'
import { DossierStats } from './DossierStats.jsx'
import { RingsStats } from './RingsStats.jsx'
import { ClubsVertical } from './ClubsVertical.jsx'
import { ClubsCards } from './ClubsCards.jsx'

gsap.registerPlugin(ScrollTrigger)

// Diseño del panel de estadísticas:
//  'bento'   → original de 3 columnas (datos / temporada / habilidades)
//  'radar'   → radar hexagonal con perfil y temporada a los lados
//  'dossier' → informe de scouting
//  'anillos' → anillos de progreso circulares (nuevo)
const STATS_DESIGN = 'radar'

// Diseño de la trayectoria de clubes:
//  'carrusel' → línea de tiempo horizontal con arrastre (original)
//  'vertical' → línea de tiempo vertical alternada (nuevo)
//  'tarjetas' → vitrina horizontal de fichas con barra de progreso (nuevo)
const CLUBS_DESIGN = 'vertical'

function BioCard() {
  const BIO = [
  { label: 'Edad', key: 'age' },
  { label: 'Altura', key: 'height' },
  { label: 'Peso', key: 'weight' },
  { label: 'Pie', key: 'foot' },
  { label: 'Nacimiento', key: 'birthDate' },
  { label: 'Lugar', key: 'birthPlace' },
]
  return (
          <Box>
            <Text
                fontFamily="mono"
                fontSize="11px"
                letterSpacing="0.28em"
                textTransform="uppercase"
                color="brand.boneWarm"
                mb={5}
              >
                Datos personales
              </Text>
            <Box
              bg="brand.dark"
              border="1px solid"
              borderColor="brand.accent"
              borderRadius={'10px'}
              p={{ base: 5, md: 6 }}
              h="90%"
              position="relative"
            >
              <VStack align="stretch" spacing={3}>
                {BIO.map((row) => (
                  <Flex
                    key={row.key}
                    justify="space-between"
                    align="center"
                    borderBottom="1px solid"
                    borderColor="whiteAlpha.50"
                    pb={3}
                    transition="all 0.3s ease"
                    _hover={{ 
                      borderColor: 'brand.steel',
                      transform: 'translateY(-2px)',
                    }}
                  >
                    <Text
                      fontFamily="mono"
                      fontSize="11px"
                      letterSpacing="0.18em"
                      textTransform="uppercase"
                      color="whiteAlpha.600"
                    >
                      {row.label}
                    </Text>
                    <Text fontFamily="mono" fontSize="sm" fontWeight={500}>
                      {playerData[row.key]}
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          </Box>

  )
}

function SeasonCards() {
  const cardRefs = useRef([])
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            duration: 0.7, delay: i * 0.1, ease: 'power3.out',
          }
        )
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <Box mx={2}>
      <Text
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="0.28em"
        textTransform="uppercase"
        color="brand.boneWarm"
        mb={5}
      >
        última temporada
      </Text>
      <Grid templateColumns="repeat(2, 1fr)" gap={3}>
        {playerData.seasonStats.map((s, i) => (
          <Box
            key={s.label}
            ref={(el) => (cardRefs.current[i] = el)}
            border="1px solid"
            borderColor="whiteAlpha.100"
            borderRadius={'10px'}
            p={5}
            position="relative"
            cursor="default"
            transition="border-color 0.3s, background 0.3s"
            _hover={{
              borderColor: 'brand.steel',
              bg: 'rgba(19, 67, 139, 0.05)',
            }}
            _before={{
              content: '""', position: 'absolute', bottom: '0px', left: '10px',
              w: '0', h: '2px', bg: 'brand.steel', borderRadius: 'full',
              transition: 'width 0.35s',
            }}
            sx={{ '&:hover::before': { width: 'calc(100% - 20px)' } }}
          >
            <Text fontFamily="heading" fontSize="4xl" color="white" lineHeight={1} mb={1}>
              {s.value}
            </Text>
            <Text fontFamily="mono" fontSize="10px" color="brand.gray"
              textTransform="uppercase" letterSpacing="widest">
              {s.label}
            </Text>
          </Box>
        ))}
      </Grid>
    </Box>
  )
}

function StatBars() {
  const barRefs  = useRef([])
  const numRefs  = useRef([])
  const [accentDeep, accentMid] = useToken('colors', ['brand.accentDeep', 'brand.accentMid'])

  useEffect(() => {
    const ctx = gsap.context(() => {
      playerData.stats.forEach((s, i) => {
        const bar = barRefs.current[i]
        const num = numRefs.current[i]
        if (!bar) return
        const obj = { val: 0 }
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: s.value / 100,
            ease: 'power2.out',
            scrollTrigger: { trigger: bar, start: 'top 88%', once: true },
            duration: 1.2,
            delay: i * 0.08,
          }
        )
        gsap.to(obj, {
          val: s.value,
          ease: 'power2.out',
          duration: 1.2,
          delay: i * 0.08,
          scrollTrigger: { trigger: bar, start: 'top 88%', once: true },
          onUpdate() { if (num) num.textContent = Math.round(obj.val) },
        })
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <Box>
      <Text
        fontFamily="mono"
        fontSize="11px"
        letterSpacing="0.28em"
        textTransform="uppercase"
        color="brand.boneWarm"
        mb={5}
      >
        Hablidades
      </Text>
      <Box
        border="1px solid"
        borderColor="whiteAlpha.100"
        borderRadius={'10px'}
        p={6}
        position="relative"
        _before={{
          content: '""', position: 'absolute', top: 0, left: 2,
          w: '32px', h: '2px', bg: 'brand.steel',
        }}
      >
        <VStack spacing={4} align="stretch">
          {playerData.stats.map((s, i) => (
            <Box key={s.label}>
              <Flex justify="space-between" mb={1.5}>
                <Text fontFamily="mono" fontSize="11px" color="white"
                  textTransform="uppercase" letterSpacing="wider">
                  {s.label}
                </Text>
                <Text ref={(el) => (numRefs.current[i] = el)}
                  fontFamily="heading" fontSize="sm" color="brand.steelLight">
                  0
                </Text>
              </Flex>
              <Box h="3px" bg="rgba(255,255,255,0.08)" position="relative">
                <Box
                  ref={(el) => (barRefs.current[i] = el)}
                  position="absolute"
                  top={0} left={0}
                  w="100%" h="100%"
                  bg={`linear-gradient(to right, ${accentDeep}, ${accentMid})`}
                  transformOrigin="left"
                  transform="scaleX(0)"
                />
              </Box>
            </Box>
          ))}
        </VStack>
      </Box>
    </Box>
  )
}

function ClubNode({ club, isFirst, isLast, isActive }) {
  const NODE_W = { base: '180px', md: '220px' }
  const BADGE = '74px'

  return (
    <Box
      w={NODE_W}
      flexShrink={0}
      scrollSnapAlign="center"
      position="relative"
      pt={8}
    >
      {/* Riel + nodo del escudo */}
      <Flex h={BADGE} align="center" justify="center" position="relative">
        {/* Línea conectora (segmento por club) */}
        <Box
          position="absolute"
          top="50%"
          left={isFirst ? '50%' : 0}
          right={isLast ? '50%' : 0}
          h="1px"
          bg="brand.accent"
          transform="translateY(-50%)"
        />
        {/* Tramo recorrido (resaltado hacia el club actual) */}
        {isFirst && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            right={0}
            h="1px"
            bgGradient="linear(to-r, brand.steel, transparent)"
            transform="translateY(-50%)"
          />
        )}

        {/* Escudo */}
        <Flex
          boxSize={BADGE}
          borderRadius="full"
          align="center"
          justify="center"
          position="relative"
          zIndex={1}
          bg="brand.steel"
          border="1px solid"
          borderColor={'brand.accent'}
          boxShadow={isActive ? '0 0 0 4px #bda78e, 0 0 26px #bda78e79' : 'none'}
          transition="border-color 0.35s, box-shadow 0.35s, transform 0.35s"
          _groupHover={{
            borderColor: 'brand.accentLight',
            transform: 'translateY(-4px)',
            boxShadow: '0 0 0 4px #bda78e9a, 0 0 26px #bda78e79',
          }}
        >
          <Image
            src={club.logo}
            alt={`Escudo de ${club.name}`}
            boxSize="46px"
            objectFit="contain"
            loading="lazy"
            filter={isActive ? 'none' : 'saturate(0.85)'}
            transition="filter 0.35s"
          />
        </Flex>
      </Flex>

      {/* Tarjeta */}
      <Box
        mt={5}
        mx={2}
        px={4}
        pt={5}
        pb={8}
        bg="brand.dark"
        border="1px solid"
        borderColor="brand.accent"
        borderRadius="lg"
        textAlign="center"
        position="relative"
        transition="border-color 0.35s, transform 0.35s, background 0.35s"
        _before={{
          content: '""', position: 'absolute', top: 0, left: '50%',
          transform: 'translateX(-50%)',
          w: isActive ? '40px' : '0', h: '2px', bg: 'brand.accent', borderRadius: 'full',
          transition: 'width 0.35s',
        }}
        _groupHover={{  
          transform: 'translateY(-4px)',
          bg: '#bda78e1a',
          _before: { width: '40px' },
        }}
      >
        <Text
          fontFamily="mono"
          fontSize="10px"
          color={isActive ? 'brand.accentLight' : 'brand.bone'}
          textTransform="uppercase"
          letterSpacing="0.2em"
          _groupHover={{ color: isActive ? 'brand.accentLight' : 'brand.accentLight' }}
        >
          {club.years}
        </Text>
        <Text fontFamily='"Dela Gothic One", monospace' textTransform="uppercase" fontSize={{ base: 'xs', lg: 'sm' }} color="brand.bone" lineHeight={1.05} mt={1}>
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
          <VStack spacing={1.5} mt={3}>
            {club.titles.map((t) => (
              <HStack key={t} spacing={1.5} justify="center">
                
                <Text fontFamily="mono" fontSize="12px" color="brand.boneWarm">
                  🏆 {t}
                </Text>
              </HStack>
            ))}
          </VStack>
        )}

        {club.info && (
          <VStack spacing={1} mt={3}>
            {(Array.isArray(club.info) ? club.info : [club.info])
              .filter(Boolean)
              .map((line) => (
                <Text
                  key={line}
                  fontFamily="mono"
                  fontSize="10px"
                  color="brand.gray"
                  lineHeight={1.5}
                >
                  {line}
                </Text>
              ))}
          </VStack>
        )}
      </Box>
    </Box>
  )
}

function ClubTimeline() {
  const scrollRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  const scrollByDir = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  const onDown = (e) => {
    const el = scrollRef.current
    if (!el) return
    drag.current.active = true
    drag.current.moved = false
    drag.current.startX = (e.pageX ?? e.touches?.[0]?.pageX) - el.offsetLeft
    drag.current.scrollLeft = el.scrollLeft
    el.style.cursor = 'grabbing'
  }
  const onMove = (e) => {
    const el = scrollRef.current
    if (!drag.current.active || !el) return
    const x = (e.pageX ?? e.touches?.[0]?.pageX) - el.offsetLeft
    const delta = (x - drag.current.startX) * 1.15
    if (Math.abs(delta) > 4) drag.current.moved = true
    el.scrollLeft = drag.current.scrollLeft - delta
  }
  const onUp = () => {
    drag.current.active = false
    if (scrollRef.current) scrollRef.current.style.cursor = 'grab'
  }

  const arrowProps = {
    variant: 'unstyled',
    minW: '38px',
    h: '38px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'full',
    border: '1px solid',
    borderColor: 'brand.accent',
    color: 'brand.bone',
    transition: 'all 0.25s',
    _hover: { bg: 'brand.surface', color: 'brand.grayLight' },
    _active: { transform: 'scale(0.92)' },
  }

  return (
    <Box mt={16}>
      <Flex align="flex-end" justify="space-between" mb={7}>
        <Box>
          <Text fontFamily='"mono", monospace' fontSize="10px" color="brand.bone"
                  textTransform="uppercase" letterSpacing="widest">
            Trayectoria
          </Text>
          <Text as="h2" fontFamily='"Dela Gothic One", sans-serif' fontWeight="bold" fontSize={{ base: '3xl', lg: '4xl' }}
                  color="brand.accent" lineHeight={1}>
            Clubes
          </Text>
        </Box>
        <HStack spacing={2}>
          <IconButton aria-label="Anterior" icon={<FiChevronLeft size={18} />}
                      onClick={() => scrollByDir(-1)} {...arrowProps} />
          <IconButton aria-label="Siguiente" icon={<FiChevronRight size={18} />}
                      onClick={() => scrollByDir(1)} {...arrowProps} />
        </HStack>
      </Flex>

      <Box
        ref={scrollRef}
        overflowX="auto"
        cursor="grab"
        pb={6}
        sx={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
        onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation() } }}
      >
        <HStack spacing={0} align="stretch" w="max-content" px={1}>
          {playerData.clubs.map((club, i) => (
            <Box key={club.name} role="group">
              <ClubNode
                club={club}
                isFirst={i === 0}
                isLast={i === playerData.clubs.length - 1}
                isActive={i === 0}
              />
            </Box>
          ))}
        </HStack>
      </Box>
    </Box>
  )
}

export default function StatsSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)

  useScrubReveal(sectionRef, {
    elements: [
      { ref: titleRef, fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 } },
    ],
    start: 'top 80%',
    end:   'top 40%',
  })

  return (
    <Box
      as="section"
      id="estadisticas"
      ref={sectionRef}
      bg="brand.dark"
      pt={{ base: 16, lg: 20 }}
      pb={{ base: 16, lg: 20 }}
      px={{ base: 2, lg: 10 }}
      borderTopLeftRadius={{ base: '14px', lg: '22px' }}
      borderTopRightRadius={{ base: '14px', lg: '22px' }}
      boxShadow="0 -24px 80px rgba(0,0,0,0.65)"
    >
      <Box maxW="1400px" mx="auto">
        {/* Header */}
        <Flex align="flex-end" justify="space-between" mb={10}>
          <Box ref={titleRef}>
            <Text fontFamily='heading' fontSize="12px" color="brand.blueMid"
                  textTransform="uppercase" letterSpacing="widest" >
              Datos
            </Text>
            <Text as="h2" fontFamily='heading' fontWeight="medium" textTransform="uppercase" fontSize={{ base: '4xl', md:'5xl', lg: '6xl' }}
                  color="brand.bone" lineHeight={1}>
              Estadi<Box as="span" color="brand.blue">sticas</Box>
            </Text>
          </Box>
        </Flex>

        {/* Contenido: según STATS_DESIGN ('bento' | 'radar' | 'dossier' | 'anillos') */}
        {STATS_DESIGN === 'radar' && <RadarStats />}
        {STATS_DESIGN === 'dossier' && <DossierStats />}
        {STATS_DESIGN === 'anillos' && <RingsStats />}
        {STATS_DESIGN === 'bento' && (
          <Grid
            templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1.1fr 1fr' }}
            gap={5}
          >
            <GridItem><BioCard /></GridItem>
            <GridItem><SeasonCards /></GridItem>
            <GridItem><StatBars /></GridItem>
          </Grid>
        )}

        {/* Trayectoria: según CLUBS_DESIGN ('carrusel' | 'vertical' | 'tarjetas') */}
        {CLUBS_DESIGN === 'carrusel' && <ClubTimeline />}
        {CLUBS_DESIGN === 'vertical' && <ClubsVertical />}
        {CLUBS_DESIGN === 'tarjetas' && <ClubsCards />}
      </Box>
    </Box>
  )
}
