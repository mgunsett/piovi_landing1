import { useEffect, useMemo, useRef } from 'react'
import { Box, Grid, Text, VStack, useToken, Flex } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playerData } from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

// Geometría del radar — viewBox con margen lateral para las etiquetas
const CX = 190
const CY = 150
const R = 100 // ← tamaño del polígono (radio). Subilo/bajalo para agrandar el radar

// ─── RADAR CHART ─────────────────────────────────────────────────
function RadarChart({ stats }) {
  const wrapRef = useRef(null)
  const N = stats.length
  const [red, blueSoft, steelLight, amber, amber2, gray, bone] = useToken('colors', [
    'brand.red','brand.blueSoft', 'brand.steelLight', 'brand.grayLight', 'brand.accent','brand.accentMid','brand.gray','brand.bone',
  ])

  // Punto (x,y) para un valor 0-100 en el eje i
  const pointFor = (value, i) => {
    const ang = (-90 + (i * 360) / N) * (Math.PI / 180)
    return [
      CX + R * (value / 100) * Math.cos(ang),
      CY + R * (value / 100) * Math.sin(ang),
    ]
  }

  const gridRings = useMemo(
    () => [0.25, 0.5, 0.75, 1].map(f =>
      stats.map((_, i) => pointFor(f * 100, i).join(',')).join(' ')
    ),
    [stats]
  )

  const valuePoints = useMemo(
    () => stats.map((s, i) => pointFor(s.value, i)),
    [stats]
  )

  const labels = useMemo(
    () => stats.map((s, i) => {
      const ang = (-90 + (i * 360) / N) * (Math.PI / 180)
      const cos = Math.cos(ang)
      const sin = Math.sin(ang)
      return {
        ...s,
        x: CX + (R + 18) * cos,
        y: CY + (R + 18) * sin + (sin < -0.5 ? -2 : sin > 0.5 ? 12 : 4),
        anchor: Math.abs(cos) < 0.3 ? 'middle' : cos > 0 ? 'start' : 'end',
      }
    }),
    [stats]
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 1.2,
        },
      })
      tl.fromTo('.radar-value',
        { scale: 0, opacity: 0, svgOrigin: `${CX} ${CY}` },
        { scale: 1, opacity: 1 }
      )
      tl.fromTo('.radar-dot',
        { opacity: 0 },
        { opacity: 1, stagger: 0.06 },
        '-=0.3'
      )
      tl.fromTo('.radar-label',
        { opacity: 0 },
        { opacity: 1, stagger: 0.06 },
        '<'
      )
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <Box ref={wrapRef} w="100%" maxW={{ base: '360px', md: '460px', lg: '500px' }} mx="auto">
      <Box as="svg" viewBox="-75 0 530 300" w="100%" role="img"
        aria-label="Radar de habilidades técnicas"
      >
        {gridRings.map((pts, i) => (
          <polygon key={i} points={pts} fill="none"
            stroke={i === 3 ? amber : '#993f3f17'} strokeWidth={i === 3 ? '1.5' : '1'}
          />
        ))}
        {stats.map((_, i) => {
          const [x, y] = pointFor(100, i)
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y}
            stroke={blueSoft} />
        })}
        <polygon
          className="radar-value"
          points={valuePoints.map(p => p.join(',')).join(' ')}
          fill={`${steelLight}4D`} stroke={red} strokeWidth="1.5"
        />
        {valuePoints.map(([x, y], i) => (
          <circle key={i} className="radar-dot" cx={x} cy={y} r="2.8" fill={amber2} />
        ))}
        {labels.map(l => (
          <text key={l.label} className="radar-label"
            x={l.x} y={l.y} textAnchor={l.anchor}
            fontFamily="'Nippo', sans-serif"
            fontSize="16" letterSpacing="0.8" fill={gray}
            style={{ textTransform: 'uppercase' }}
          >
            {l.label} <tspan fill={bone} fontWeight="700">{l.value} %</tspan>
          </text>
        ))}
      </Box>
    </Box>
  )
}

// ─── MEDIA GENERAL (contador animado) ────────────────────────────
export function OverallRating({ value }) {
  const numRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo(numRef.current,
        { textContent: 0 },
        {
          textContent: value,
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: numRef.current,
            start: 'top 90%',
            end: 'top 55%',
            scrub: 1.2,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [value])

  return (
    <Box textAlign="center" mt={6}>
      <Text ref={numRef}
        fontFamily="heading"
        fontSize={{ base: '80px', md: '70px' }}
        color="brand.grayLight" lineHeight="1"
      >
        {value}
      </Text>
      <Text
        fontFamily="mono"
        fontSize="10px" fontWeight="700"
        letterSpacing="0.3em" textTransform="uppercase"
        color="brand.bone"
      >
        Valoración
      </Text>
    </Box>
  )
}

// ─── CONTENEDOR DE COLUMNA (título + animación de entrada) ────────
export function ColumnShell({ title, side = 'left', children }) {
  const colRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.fromTo('.radar-side-row',
        { opacity: 0, x: side === 'left' ? -16 : 16 },
        {
          opacity: 1, x: 0, stagger: 0.07,
          scrollTrigger: {
            trigger: colRef.current,
            start: 'top 88%',
            end: 'top 50%',
            scrub: 1.2,
          },
        }
      )
    }, colRef)
    return () => ctx.revert()
  }, [side])

  return (
    <Box ref={colRef} w="100%">
      <Text
        fontFamily="mono"
        fontSize="12px" fontWeight="700"
        letterSpacing="0.28em" textTransform="uppercase"
        color="brand.accent"
        mb={{ base: 4, lg: 5 }}
        pb={2}
      >
        {title}
      </Text>
      {children}
    </Box>
  )
}

// ─── PERFIL (ficha label / valor a todo el ancho) ─────────────────
export function ProfileColumn({ items }) {
  return (
    <VStack spacing={0} align="stretch">
      {items.map((item, i) => (
        <Flex
          key={item.label}
          className="radar-side-row"
          justify="space-between"
          align="center"
          gap={4}
          py={{ base: 2.5, lg: 2.5 }}
          borderBottom={i === items.length - 1 ? 'none' : '1px solid'}
          borderColor="brand.line"
          transition="border-color 0.3s"
          _hover={{ borderColor: 'brand.accent' }}
        >
          <Text
            fontFamily="mono"
            fontSize="10px" fontWeight="700"
            letterSpacing="0.16em" textTransform="uppercase"
            color="brand.gray"
            flexShrink={0}
          >
            {item.label}
          </Text>
          <Text
            fontFamily="mono"
            fontSize={{ base: 'sm', lg: '15px' }} fontWeight="600"
            color="brand.bone"
            textAlign="right"
            noOfLines={1}
            minW={0}
          >
            {item.value}
          </Text>
        </Flex>
      ))}
    </VStack>
  )
}

// ─── TEMPORADA ACTUAL (grilla de tiles) ───────────────────────────
export function SeasonColumn({ items }) {
  return (
    <Grid
      templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', lg: 'repeat(2, 1fr)' }}
      gap={{ base: 2.5, lg: 3 }}
      
    >
      {items.map((item) => (
        <Box
          key={item.label}
          className="radar-side-row"
          border="1px solid"
          borderColor="brand.accent"
          borderRadius="5px"
          p={{ base: 4, lg: 3.5 }}
          bg="brand.dark"
          transition="border-color 0.3s, background 0.3s, transform 0.3s"
          role="group"
          _hover={{
            borderColor: 'brand.accent',
            bg: '#bda78e1a',
            transform: 'translateY(-2px)',
          }}
        >
          <Text
            fontFamily="heading"
            fontSize={{ base: '28px', lg: '34px' }}
            color="brand.grayLight"
            lineHeight="1"
          >
            {item.value}
          </Text>
          <Text
            fontFamily="mono"
            fontSize="9px" fontWeight="700"
            letterSpacing="0.1em" textTransform="uppercase"
            color="brand.bone"
            mt={1.5}
            lineHeight="1.2"
          >
            {item.label}
          </Text>
        </Box>
      ))}
    </Grid>
  )
}

// ─── BLOQUE PRINCIPAL ────────────────────────────────────────────
export function RadarStats() {
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
      borderRadius="14px"
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

        {/* Radar — arriba en mobile, al centro en desktop */}
        <Box
          order={{ base: 1, md: 3, lg: 2 }}
          gridColumn={{ md: '1 / -1', lg: 'auto' }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <RadarChart stats={playerData.stats} />
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
