import { useCallback, useEffect, useRef } from 'react'
import { Box, Flex, HStack, IconButton, Image, Text, VStack } from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

// ─── TARJETA DE CLUB (ficha vertical tipo vitrina) ────────────────
function ClubCard({ club, index, isActive }) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <VStack
      className="ccard"
      role="group"
      w={{ base: '230px', md: '260px' }}
      flexShrink={0}
      scrollSnapAlign="center"
      align="stretch"
      spacing={0}
      bg="brand.dark"
      border="1px solid"
      borderColor={isActive ? 'brand.accent' : 'brand.accentLight'}
      borderRadius="5px"
      overflow="hidden"
      position="relative"
      transition="transform 0.35s, border-color 0.35s, box-shadow 0.35s"
      _hover={{
        transform: 'translateY(-6px)',
        borderColor: 'brand.accent',
        boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
      }}
    >
      {/* Banda superior: período + nº de etapa */}
      <Flex
        align="center"
        justify="space-between"
        px={4}
        py={2.5}
        bg={isActive ? 'brand.surface' : 'transparent'}
        borderBottom="1px solid"
        borderColor="whiteAlpha.100"
      >
        <HStack spacing={2}>
          <Text
            fontFamily="mono"
            fontSize="10px"
            fontWeight="200"
            color={isActive ? 'brand.accentLight' : 'brand.boneWarm'}
            textTransform="uppercase"
            letterSpacing="0.18em"
            transition="color 0.35s"
            _groupHover={{ color: 'brand.gold' }}
          >
            {club.years}
          </Text>
        </HStack>
      </Flex>

      {/* Cuerpo */}
      <VStack flex={1} px={4} pt={4} pb={5} spacing={0} position="relative">
        {/* Escudo como marca de agua */}
        <Image
          aria-hidden
          src={club.logo}
          alt=""
          position="absolute"
          bottom="-16"
          right="-14"
          boxSize="220px"
          objectFit="contain"
          opacity={0.06}
          filter="grayscale(1)"
          pointerEvents="none"
          userSelect="none"
        />

        {/* Escudo */}
        <Flex
          boxSize="84px"
          borderRadius="full"
          align="center"
          justify="center"
          bg="brand.steel"
          border="1px solid"
          borderColor="brand.accent"
          boxShadow={isActive ? '0 0 0 4px #bda78e6b, 0 0 24px #bda78e55' : 'none'}
          transition="box-shadow 0.35s, transform 0.35s"
          _groupHover={{
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 4px #bda78e4d, 0 0 24px #bda78e55',
          }}
        >
          <Image
            src={club.logo}
            alt={`Escudo de ${club.name}`}
            boxSize="52px"
            objectFit="contain"
            loading="lazy"
            filter={isActive ? 'none' : 'saturate(0.85)'}
            transition="filter 0.35s"
            _groupHover={{ filter: 'none' }}
          />
        </Flex>

        <Text
          mt={4}
          fontFamily='heading'
          fontWeight='bold'
          textTransform="uppercase"
          fontSize={{ base: 'xs', md: 'sm' }}
          color="brand.bone"
          textAlign="center"
          lineHeight={1.3}
        >
          {club.name}
        </Text>
        <Text
          mt={1}
          fontFamily="mono"
          fontSize="10px"
          color="brand.gray"
          textTransform="uppercase"
          letterSpacing="0.2em"
        >
          {club.country}
        </Text>

        {(club.titles.length > 0 || club.info) && (
          <VStack spacing={1} mt={3.5}>
            {club.titles.map((t) => (
              <Text key={t} fontFamily="mono" fontSize="12px" color="brand.boneWarm" textAlign="center">
                🏆 {t}
              </Text>
            ))}
            {(Array.isArray(club.info) ? club.info : [club.info])
              .filter(Boolean)
              .map((line) => (
                <Text key={line} fontFamily="mono" fontSize="10px" color="brand.gray"
                      textAlign="center" lineHeight={1.5}>
                  {line}
                </Text>
              ))}
          </VStack>
        )}
      </VStack>
    </VStack>
  )
}

// ─── BLOQUE PRINCIPAL ─────────────────────────────────────────────
export function ClubsCards() {
  const wrapRef = useRef(null)
  const scrollRef = useRef(null)
  const progressRef = useRef(null)
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false })

  const scrollByDir = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' })
  }

  // Barra de progreso sincronizada con el desplazamiento horizontal
  const updateProgress = useCallback(() => {
    const el = scrollRef.current
    const fill = progressRef.current
    if (!el || !fill) return
    const max = el.scrollWidth - el.clientWidth
    fill.style.transform = `scaleX(${max > 0 ? el.scrollLeft / max : 0})`
  }, [])

  useEffect(() => {
    updateProgress()
    window.addEventListener('resize', updateProgress)
    return () => window.removeEventListener('resize', updateProgress)
  }, [updateProgress])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(wrapRef.current.querySelectorAll('.ccard'),
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.07,
          scrollTrigger: { trigger: wrapRef.current, start: 'top 85%', once: true },
        }
      )
    }, wrapRef)
    return () => ctx.revert()
  }, [])

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
    borderRadius: '5px',
    border: '1px solid',
    borderColor: 'brand.accent',
    color: 'brand.bone',
    transition: 'all 0.25s',
    _hover: { bg: 'brand.surface', color: 'brand.grayLight' },
    _active: { transform: 'scale(0.92)' },
  }

  return (
    <Box mt={16} ref={wrapRef} sx={{
      '@keyframes ccardPulse': {
        '0%, 100%': { opacity: 1 },
        '50%': { opacity: 0.25 },
      },
    }}>
      {/* Encabezado */}
      <Flex align="flex-end" justify="space-between" mb={7}>
        <Box>
          <Text fontFamily='mono' fontSize="10px" color="brand.bone"
                textTransform="uppercase" letterSpacing="widest">
            Trayectoria
          </Text>
          <Text as="h2" fontFamily='heading' fontWeight="bold"
                fontSize={{ base: '4xl', lg: '5xl' }} color="brand.accent" lineHeight={1}>
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

      {/* Vitrina de tarjetas */}
      <Box
        ref={scrollRef}
        overflowX="auto"
        cursor="grab"
        pt={2}
        pb={5}
        tabIndex={0}
        role="region"
        aria-label="Trayectoria de clubes"
        outline="none"
        _focusVisible={{ boxShadow: '0 0 0 2px #bda78e6b', borderRadius: '14px' }}
        sx={{
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
        onScroll={updateProgress}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); scrollByDir(1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); scrollByDir(-1) }
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
        <Flex gap={{ base: 3, md: 4 }} align="stretch" w="max-content" px={1}>
          {playerData.clubs.map((club, i) => (
            <ClubCard
              key={`${club.name}-${club.years}`}
              club={club}
              index={i}
              isActive={i === 0}
            />
          ))}
        </Flex>
      </Box>

      {/* Barra de progreso del recorrido */}
      <Box mt={1} mx={1} h="2px" bg="whiteAlpha.100" borderRadius="full" overflow="hidden" aria-hidden>
        <Box
          ref={progressRef}
          h="100%"
          w="100%"
          bgGradient="linear(to-r, brand.accent, brand.gold)"
          transformOrigin="left"
          transform="scaleX(0)"
          borderRadius="full"
        />
      </Box>
    </Box>
  )
}
