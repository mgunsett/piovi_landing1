import { useEffect, useRef, useState } from 'react'
import {
  Box, Flex, Grid, Text, VStack, Image
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import playerData from '../../data/playerData.js'
import useScrubReveal from '../../hooks/useScrubReveal.js'

gsap.registerPlugin(ScrollTrigger)

// ─── CLUB LOGO ────────────────────────────────────────────────────
function ClubLogo({ src, name, color, size = '48px' }) {
  const [err, setErr] = useState(false)
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <Box
      w={size} h={size} borderRadius="50%"
      bg={color} flexShrink={0}
      overflow="hidden"
      display="flex" alignItems="center" justifyContent="center"
    >
      {!err && src ? (
        <Image
          src={src} alt={name}
          onError={() => setErr(true)}
          style={{ width: '72%', height: '72%', objectFit: 'contain' }}
        />
      ) : (
        <Text
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="14px" color="white" letterSpacing="0.04em"
        >
          {initials}
        </Text>
      )}
    </Box>
  )
}

// ─── STAT BAR ────────────────────────────────────────────────────
function StatBar({ label, value, index }) {
  const rowRef = useRef(null)
  const barRef = useRef(null)
  const numRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rowRef.current,
          start: 'top 90%',
          end: 'top 55%',
          scrub: 1.2,
        },
      })
      tl.fromTo(rowRef.current,
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0 }
      )
      tl.fromTo(barRef.current,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: value / 100 }
      )
      tl.fromTo(numRef.current,
        { textContent: 0 },
        { textContent: value, snap: { textContent: 1 } }
      )
    })
    return () => ctx.revert()
  }, [value])

  return (
    <Box ref={rowRef} opacity={0}>
      <Flex justify="space-between" align="center" mb="7px">
        <Text
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="11px" fontWeight="700"
          letterSpacing="0.2em" textTransform="uppercase"
          color="rgba(255,255,255,0.45)"
        >
          {label}
        </Text>
        <Text
          ref={numRef}
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="21px" color="white" lineHeight="1"
        >
          {value}
        </Text>
      </Flex>
      {/* Track + fill */}
      <Box h="2px" bg="rgba(255,255,255,0.06)" position="relative" overflow="hidden" borderRadius="1px">
        <Box
          ref={barRef}
          position="absolute" inset="0"
          bg="linear-gradient(to right, #0057B8, #4da3ff)"
          transform="scaleX(0)" transformOrigin="left"
        />
      </Box>
    </Box>
  )
}

// ─── SEASON CARD ─────────────────────────────────────────────────
function SeasonCard({ label, value, index }) {
  const ref = useRef(null)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, { y: 28, opacity: 0 }, {
        y: 0, opacity: 1,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 90%',
          end: 'top 60%',
          scrub: 1.2,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <Box
      ref={ref} opacity={0}
      position="relative"
      p={{ base: 4, md: 5 }}
      border="1px solid rgba(0,87,184,0.18)"
      overflow="hidden"
      _hover={{ borderColor: 'rgba(0,87,184,0.55)', '& .sg': { opacity: 1 } }}
      transition="border-color 0.25s ease"
    >
      <Box
        className="sg" position="absolute" inset="0"
        bg="radial-gradient(ellipse at bottom left, rgba(0,87,184,0.13) 0%, transparent 65%)"
        opacity={0} transition="opacity 0.3s ease" pointerEvents="none"
      />
      <Text
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={{ base: '38px', md: '44px' }}
        color="white" lineHeight="1"
      >
        {value}
      </Text>
      <Text
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="10px" fontWeight="700"
        letterSpacing="0.22em" textTransform="uppercase"
        color="rgba(255,255,255,0.38)" mt={1}
      >
        {label}
      </Text>
      {/* Corner accent */}
      <Box
        position="absolute" bottom="0" right="0"
        w="14px" h="14px"
        borderTop="1px solid rgba(0,87,184,0.35)"
        borderLeft="1px solid rgba(0,87,184,0.35)"
      />
    </Box>
  )
}

// ─── MAIN STATS SECTION ──────────────────────────────────────────
export default function StatsSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const timelineRef = useRef(null)

  useScrubReveal(sectionRef, {
    elements: [
      { ref: titleRef, vars: { y: 0, opacity: 1 }, fromVars: { y: 50, opacity: 0 } },
    ],
    pin: false,
    start: 'top 85%',
    end: 'top 30%',
    scrub: 1,
  })

  // Drag-to-scroll for club timeline
  useEffect(() => {
    const el = timelineRef.current
    if (!el) return
    let isDown = false, startX = 0, scrollLeft = 0
    const onDown = e => {
      isDown = true
      el.style.cursor = 'grabbing'
      startX = (e.touches ? e.touches[0].pageX : e.pageX) - el.offsetLeft
      scrollLeft = el.scrollLeft
    }
    const onUp = () => { isDown = false; el.style.cursor = 'grab' }
    const onMove = e => {
      if (!isDown) return
      if (!e.touches) e.preventDefault()
      const x = (e.touches ? e.touches[0].pageX : e.pageX) - el.offsetLeft
      el.scrollLeft = scrollLeft - (x - startX) * 1.1
    }
    el.addEventListener('mousedown', onDown)
    el.addEventListener('mouseleave', onUp)
    el.addEventListener('mouseup', onUp)
    el.addEventListener('mousemove', onMove)
    el.addEventListener('touchstart', onDown, { passive: true })
    el.addEventListener('touchend', onUp)
    el.addEventListener('touchmove', onMove, { passive: false })
    return () => {
      el.removeEventListener('mousedown', onDown)
      el.removeEventListener('mouseleave', onUp)
      el.removeEventListener('mouseup', onUp)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('touchstart', onDown)
      el.removeEventListener('touchend', onUp)
      el.removeEventListener('touchmove', onMove)
    }
  }, [])

  const clubs = playerData.clubs
  const lastIdx = clubs.length - 1

  return (
    <Box
      ref={sectionRef}
      as="section" id="stats"
      bg="#0A0E16"
      pt={{ base: 20, md: 28 }}
      pb={{ base: 0, md: 0 }}
      position="relative"
      overflow="hidden"
      zIndex={20}
      borderTopLeftRadius={{ base: '14px', md: '22px' }}
      borderTopRightRadius={{ base: '14px', md: '22px' }}
      boxShadow="0 -24px 80px rgba(0,0,0,0.65)"
    >
      {/* Subtle background grid */}
      <Box
        position="absolute" inset="0" pointerEvents="none"
        sx={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.013) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.013) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      <Box position="absolute" top="-80px" left="-100px" w="500px" h="500px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.07) 0%, transparent 70%)"
        pointerEvents="none" />
      <Box position="absolute" bottom="20%" right="-80px" w="400px" h="400px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.05) 0%, transparent 70%)"
        pointerEvents="none" />

      {/* ── Padded content ── */}
      <Box px={{ base: 5, md: 12, lg: 20 }}>

        {/* Section title */}
        <Box ref={titleRef} mb={{ base: 12, md: 18 }}>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="10px" fontWeight="700"
            letterSpacing="0.36em" textTransform="uppercase"
            color="brand.blue" mb={2}
          >
            Ficha Técnica
          </Text>
          <Flex align="flex-end" justify="space-between" flexWrap="wrap" gap={3}>
            <Text
              fontFamily="'Bebas Neue', sans-serif"
              fontSize={{ base: '52px', md: '76px', lg: '92px' }}
              lineHeight="0.88" letterSpacing="0.02em"
            >
              ESTADIS<Box as="span" color="brand.blue">TICAS</Box>
            </Text>
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="11px" letterSpacing="0.12em"
              color="rgba(255,255,255,0.35)"
              mb={{ base: 0, md: 2 }}
              textAlign={{ base: 'left', md: 'right' }}
            >
              {playerData.nationality} · {playerData.birthPlace}
            </Text>
          </Flex>
        </Box>

        {/* ── 3-col bento grid ── */}
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1.15fr 0.95fr' }}
          gap={{ base: 10, md: 8, lg: 12 }}
          mb={{ base: 14, md: 20 }}
          alignItems="start"
        >
          {/* Col 1 — Bio card */}
          <Box>
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="14px" 
              fontWeight="700"
              letterSpacing="0.28em" textTransform="uppercase"
              color="rgba(255,255,255,0.35)" mb={4}
            >
              Perfil
            </Text>
            <Box
              border="1px solid rgba(0,87,184,0.22)"
              p={{ base: 5, md: 6 }}
              position="relative" overflow="hidden"
            >
              {/* Number watermark */}
              <Text
                position="absolute" top="-6px" right="12px"
                fontFamily="'Bebas Neue', sans-serif"
                fontSize="110px" lineHeight="1"
                color="transparent"
                sx={{ WebkitTextStroke: '1px rgba(0,87,184,0.1)' }}
                userSelect="none" pointerEvents="none"
              >
                #{playerData.number}
              </Text>
              <Text
                fontFamily="'Bebas Neue', sans-serif"
                fontSize="26px" letterSpacing="0.04em"
                mb={5} lineHeight="1" position="relative" zIndex={1}
              >
                {playerData.fullName}
              </Text>
              <Grid templateColumns="1fr 1fr" gap={3} position="relative" zIndex={1}>
                {[
                  { label: 'Posición',      value: playerData.position },
                  { label: 'Pie hábil', value: playerData.foot },
                  { label: 'Edad',          value: `${playerData.age} años` },
                  { label: 'Altura',        value: playerData.height },
                  { label: 'Peso',          value: playerData.weight },
                  { label: 'Fecha nac.',    value: playerData.birthDate },
                  { label: 'Origen',        value: playerData.birthPlace },
                  { label: 'Club actual',   value: playerData.currentClub },
                ].map(item => (
                  <Box
                    key={item.label}
                    pb={3} borderBottom="1px solid rgba(255,255,255,0.04)"
                  >
                    <Text
                      fontFamily="'Barlow Condensed', sans-serif"
                      fontSize="9px" fontWeight="700"
                      letterSpacing="0.22em" textTransform="uppercase"
                      color="rgba(255,255,255,0.35)" mb="2px"
                    >
                      {item.label}
                    </Text>
                    <Text
                      fontFamily="'Barlow Condensed', sans-serif"
                      fontSize="13px" fontWeight="600"
                      color="white" lineHeight="1.2"
                    >
                      {item.value}
                    </Text>
                  </Box>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Col 2 — Season stats + quote */}
          <Box>
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="14px" fontWeight="700"
              letterSpacing="0.28em" textTransform="uppercase"
              color="rgba(255,255,255,0.35)" mb={4}
            >
              Temporada Actual
            </Text>
            <Grid templateColumns="repeat(2, 1fr)" gap={3} mb={6}>
              {playerData.seasonStats.map((stat, i) => (
                <SeasonCard key={stat.label} label={stat.label} value={stat.value} index={i} />
              ))}
            </Grid>
          </Box>

          {/* Col 3 — Technical skills */}
          <Box>
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="14px" fontWeight="700"
              letterSpacing="0.28em" textTransform="uppercase"
              color="rgba(255,255,255,0.35)" mb={4}
            >
              Habilidades Técnicas
            </Text>
            <VStack spacing={5} align="stretch">
              {playerData.stats.map((stat, i) => (
                <StatBar key={stat.label} label={stat.label} value={stat.value} index={i} />
              ))}
            </VStack>
          </Box>
        </Grid>
      </Box>

      {/* ── Club timeline — full-width horizontal scroll ── */}
      <Box>
        <Flex
          px={{ base: 5, md: 12, lg: 20 }}
          align="center" justify="space-between" mb={6}
        >
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="14px" fontWeight="700"
            letterSpacing="0.28em" textTransform="uppercase"
            color="rgba(255,255,255,0.35)"
          >
            Trayectoria
          </Text>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="10px" letterSpacing="0.18em"
            textTransform="uppercase"
            color="rgba(255,255,255,0.22)"
          >
            {clubs.length} Clubes · Arrastra para explorar →
          </Text>
        </Flex>

        {/* Scrollable strip */}
        <Box
          ref={timelineRef}
          overflowX="auto"
          cursor="grab"
          pb={10}
          px={{ base: 5, md: 12, lg: 20 }}
          sx={{
            '&::-webkit-scrollbar': { height: '2px' },
            '&::-webkit-scrollbar-track': { bg: 'rgba(255,255,255,0.02)' },
            '&::-webkit-scrollbar-thumb': { bg: 'rgba(0,87,184,0.4)', borderRadius: '2px' },
            scrollSnapType: 'x mandatory',
          }}
        >
          <Flex gap={0} w="max-content">
            {clubs.map((club, i) => {
              const isFirst = i === 0
              const isLast  = i === lastIdx
              return (
                <Box
                  key={club.name}
                  flexShrink={0}
                  w={{ base: '210px', md: '230px' }}
                  px="6px"
                  pt={7}
                  position="relative"
                  sx={{ scrollSnapAlign: 'start' }}
                >
                  {/* Timeline connector — left half */}
                  {!isFirst && (
                    <Box position="absolute" top="17px" left="0" w="50%" h="1px"
                      bg="rgba(0,87,184,0.3)" />
                  )}
                  {/* Timeline connector — right half */}
                  {!isLast && (
                    <Box position="absolute" top="17px" right="0" w="50%" h="1px"
                      bg="rgba(0,87,184,0.3)" />
                  )}
                  {/* Node dot */}
                  <Box
                    position="absolute"
                    top={isFirst ? '12px' : '14px'}
                    left="50%" transform="translateX(-50%)"
                    w={isFirst ? '10px' : '7px'}
                    h={isFirst ? '10px' : '7px'}
                    borderRadius="50%"
                    bg={isFirst ? '#0057B8' : 'rgba(255,255,255,0.15)'}
                    border={isFirst
                      ? '2px solid rgba(77,163,255,0.6)'
                      : '1px solid rgba(255,255,255,0.2)'}
                    zIndex={1}
                  />

                  {/* Club card */}
                  <Box
                    h="180px"
                    p={4}
                    bg="rgba(255,255,255,0.025)"
                    border="1px solid rgba(255,255,255,0.06)"
                    transition="all 0.25s ease"
                    _hover={{
                      bg: 'rgba(0,87,184,0.07)',
                      borderColor: 'rgba(0,87,184,0.38)',
                      transform: 'translateY(-3px)',
                    }}
                  >
                    <Flex align="center" gap={3} mb={3}>
                      <ClubLogo
                        src={club.logo}
                        name={club.name}
                        color={club.color}
                        size="64px"
                      />
                      <Box minW={0}>
                        <Text
                          fontFamily="'Bebas Neue', sans-serif"
                          fontSize="17px" letterSpacing="0.04em"
                          lineHeight="1.15"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {club.name}
                        </Text>
                        <Text
                          fontFamily="'Barlow Condensed', sans-serif"
                          fontSize="10px" letterSpacing="0.16em"
                          textTransform="uppercase"
                          color="rgba(255,255,255,0.38)"
                        >
                          {club.country}
                        </Text>
                      </Box>
                    </Flex>

                    <Text
                      fontFamily="'Barlow Condensed', sans-serif"
                      fontSize="10px" fontWeight="700"
                      letterSpacing="0.18em" textTransform="uppercase"
                      color="brand.blue"
                      mb={club.titles.length > 0 ? 2 : 0}
                    >
                      {club.years}
                    </Text>

                    {club.info && (
                      <Text
                        fontFamily="'Barlow Condensed', sans-serif"
                        fontSize="10px"
                        color="rgba(255,255,255,0.7)"
                        mb={club.titles.length > 0 ? 2 : 0}
                      >
                        {club.info}
                      </Text>
                    )}  

                    {club.titles  && (
                      <VStack spacing={club.titles.length > 1 ? 2 : 1} align="stretch">
                        {club.titles.map((title, ti)  => (
                          <Flex key={ti} align="flex-start" gap="5px">
                            <Text fontSize="10px" mt="1px" flexShrink={0}>🏆</Text>
                            <Text
                              fontFamily="'Barlow Condensed', sans-serif"
                              fontSize="10px" fontWeight="600"
                              letterSpacing="0.1em" textTransform="uppercase"
                              color="#C9A84C" lineHeight="1.4"
                            >
                              {title}
                            </Text>
                          </Flex>
                        ))}
                      </VStack>
                    )}
                  </Box>
                </Box>
              )
            })}
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}
