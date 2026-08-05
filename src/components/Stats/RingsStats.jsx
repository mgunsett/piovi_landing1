import { useEffect, useRef } from 'react'
import { Box, Grid, SimpleGrid, Text, useToken } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData.js'
import { ColumnShell, ProfileColumn, SeasonColumn, OverallRating } from './RadarStats.jsx'

gsap.registerPlugin(ScrollTrigger)

// Geometría del anillo — radio y circunferencia del arco de progreso
const R = 42
const CIRC = 2 * Math.PI * R

// ─── GRILLA DE ANILLOS (gauges de habilidades) ────────────────────
function RingsGrid() {
  const gridRef = useRef(null)
  const arcRefs = useRef([])
  const numRefs = useRef([])
  const [amberDark, dorado] = useToken('colors', ['brand.accentDeep', 'brand.gold'])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 1.2,
        },
      })
      tl.fromTo('.ring-item',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, stagger: 0.12, duration: 0.4 },
        0
      )
      playerData.stats.forEach((s, i) => {
        const arc = arcRefs.current[i]
        const num = numRefs.current[i]
        const at = i * 0.12
        if (arc) {
          tl.fromTo(arc,
            { strokeDashoffset: CIRC },
            { strokeDashoffset: CIRC * (1 - s.value / 100), duration: 0.6, ease: 'none' },
            at
          )
        }
        if (num) {
          tl.fromTo(num,
            { textContent: 0 },
            { textContent: s.value, snap: { textContent: 1 }, duration: 0.6, ease: 'none' },
            at
          )
        }
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
    <SimpleGrid
      ref={gridRef}
      columns={{ base: 3, sm: 3 }}
      spacingX={{ base: 2, md: 6 }}
      spacingY={{ base: 8, md: 8 }}
    >
      {playerData.stats.map((s, i) => (
        <Box key={s.label} className="ring-item" textAlign="center">
          <Box position="relative" w={{ base: '84px', md: '96px' }} mx="auto">
            <Box
              as="svg"
              viewBox="0 0 100 100"
              w="100%"
              role="img"
              aria-label={`${s.label}: ${s.value} de 100`}
            >
              <defs>
                <linearGradient id={`ringGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={amberDark} />
                  <stop offset="100%" stopColor={dorado} />
                </linearGradient>
              </defs>
              <circle
                cx="50" cy="50" r={R}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="7"
              />
              <circle
                ref={(el) => (arcRefs.current[i] = el)}
                cx="50" cy="50" r={R}
                fill="none"
                stroke={`url(#ringGrad${i})`}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - s.value / 100)}
                transform="rotate(-90 50 50)"
              />
            </Box>
            <Text
              ref={(el) => (numRefs.current[i] = el)}
              position="absolute"
              top="50%" left="50%"
              transform="translate(-50%, -50%)"
              fontFamily="heading"
              fontSize={{ base: 'xl', md: '2xl' }}
              color="brand.bone"
              lineHeight={1}
            >
              {s.value}
            </Text>
          </Box>
          <Text
            fontFamily="mono"
            fontSize="10px" fontWeight="700"
            letterSpacing="0.12em" textTransform="uppercase"
            color="brand.gray"
            mt={2.5}
            lineHeight={1.2}
          >
            {s.label}
          </Text>
        </Box>
      ))}
    </SimpleGrid>
  )
}

// ─── BLOQUE PRINCIPAL ─────────────────────────────────────────────
export function RingsStats() {
  const overall = Math.round(
    playerData.stats.reduce((sum, s) => sum + s.value, 0) / playerData.stats.length
  )

  const bioItems = [
    { label: 'Posición',    value: playerData.position },
    { label: 'Pie hábil',   value: playerData.foot },
    { label: 'Edad',        value: `${playerData.age} años` },
    { label: 'Altura',      value: playerData.height },
    { label: 'Peso',        value: playerData.weight },
    { label: 'Origen',      value: playerData.birthPlace },
    { label: 'Club actual', value: playerData.currentClub },
  ]

  return (
    <Box
      bg="transparent"
      border="1px solid"
      borderColor="brand.accent"
      borderRadius="5px"
      p={{ base: 6, md: 10, lg: 12 }}
      position="relative"
    >
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '1fr 1.05fr 1fr' }}
        gap={{ base: 8, md: 10, lg: 12 }}
        alignItems="stretch"
      >
        {/* Perfil — izquierda en desktop */}
        <Box
          order={{ base: 2, md: 1, lg: 1 }}
          borderRight={{ lg: '1px solid' }}
          borderColor="brand.accent !important"
          pr={{ base: 0, lg: 10 }}
        >
          <ColumnShell title="Perfil" side="left">
            <ProfileColumn items={bioItems} />
          </ColumnShell>
        </Box>

        {/* Anillos — arriba en mobile, al centro en desktop */}
        <Box
          order={{ base: 1, md: 3, lg: 2 }}
          gridColumn={{ md: '1 / -1', lg: 'auto' }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <RingsGrid />
          <OverallRating value={overall} />
        </Box>

        {/* Temporada actual — derecha en desktop */}
        <Box
          order={{ base: 3, md: 2, lg: 3 }}
          borderLeft={{ lg: '1px solid' }}
          borderColor="brand.accent !important"
          pl={{ base: 0, lg: 10 }}
        >
          <ColumnShell title="Temporada 2025 / 2026" side="right">
            <SeasonColumn items={playerData.seasonStats} />
          </ColumnShell>
        </Box>
      </Grid>
    </Box>
  )
}
