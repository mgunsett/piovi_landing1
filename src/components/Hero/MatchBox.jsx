import { Box, Flex, Text, Image, VStack } from '@chakra-ui/react'

// ─── MATCH BOX ───────────────────────────────────────────────────
// Caja del Hero: "Último Resultado" + "Próximo Partido".
// Sigue la línea visual de la web (Bebas Neue / Barlow Condensed,
// azul Cruz Azul, bordes finos, esquinas rectas).
//
// variant="card"  → tarjeta vertical (desktop, flotante a la derecha)
// variant="strip" → franja horizontal full-width (mobile, bajo el Hero)

const PLACEHOLDER = 'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/></svg>'
  )

function Label({ children, color = 'whiteAlpha.500', size = '9px' }) {
  return (
    <Text
      fontFamily="'Barlow Condensed', sans-serif"
      fontSize={size}
      fontWeight="700"
      letterSpacing="0.22em"
      textTransform="uppercase"
      color={color}
      lineHeight="1"
      whiteSpace="nowrap"
    >
      {children}
    </Text>
  )
}

function TeamSide({ team, role, compact }) {
  return (
    <VStack spacing={compact ? '4px' : '6px'} align="center" flex="1" minW="0">
      <Image
        src={team?.shield || PLACEHOLDER}
        alt={team?.name || 'Escudo'}
        boxSize={compact ? '30px' : '38px'}
        objectFit="contain"
        fallbackSrc={PLACEHOLDER}
      />
      <Text
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize={compact ? '10px' : '11px'}
        fontWeight="600"
        letterSpacing="0.06em"
        color="white"
        textAlign="center"
        noOfLines={1}
        maxW="100%"
      >
        {team?.name || '—'}
      </Text>
      <Label color={role === 'LOCAL' ? 'brand.blue' : 'whiteAlpha.400'} size="8px">
        {role}
      </Label>
    </VStack>
  )
}

function MatchRow({ match, kind, compact }) {
  const isResult = kind === 'result'
  const hasScore =
    match?.homeScore !== null &&
    match?.homeScore !== undefined &&
    match?.awayScore !== null &&
    match?.awayScore !== undefined

  return (
    <Box w="100%">
      {/* Header del bloque */}
      <Flex align="center" justify="space-between" flexDirection={{ base: 'column', md: 'row' }} mb={compact ? 2 : 3} gap={2}>
          <Label color={isResult ? 'brand.gold' : 'brand.blue'}>
            {isResult ? 'Último Resultado' : 'Próximo Partido'}
        </Label>
        {match?.competition && (
          <Label color="whiteAlpha.400">{match.competition}</Label>
        )}
      </Flex>

      {/* Escudos + marcador / VS */}
      <Flex align="center" justify="space-between" gap={2}>
        <TeamSide team={match?.home} role="LOCAL" compact={compact} />

        <Box textAlign="center" px={1} flexShrink={0}>
          {isResult && hasScore ? (
            <Text
              fontFamily="'Bebas Neue', sans-serif"
              fontSize={compact ? '28px' : '34px'}
              lineHeight="0.9"
              color="white"
              letterSpacing="0.02em"
            >
              {match.homeScore}
              <Box as="span" color="brand.blue" mx="6px">
                –
              </Box>
              {match.awayScore}
            </Text>
          ) : (
            <Text
              fontFamily="'Bebas Neue', sans-serif"
              fontSize={compact ? '22px' : '26px'}
              lineHeight="0.9"
              color="whiteAlpha.500"
              letterSpacing="0.05em"
            >
              VS
            </Text>
          )}
        </Box>

        <TeamSide team={match?.away} role="VISITANTE" compact={compact} />
      </Flex>

      {/* Fecha · Estadio */}
      <Flex
        align="center"
        justify="center"
        gap="6px"
        mt={compact ? 2 : 3}
        pt={compact ? 2 : 3}
        borderTop="1px solid rgba(255,255,255,0.06)"
        wrap="wrap"
      >
        <Text
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="10px"
          fontWeight="600"
          letterSpacing="0.12em"
          textTransform="uppercase"
          color="whiteAlpha.700"
        >
          {match?.date || 'Fecha por confirmar'}
        </Text>
        {match?.stadium && (
          <>
            <Box as="span" color="brand.blue" fontSize="10px">
              ·
            </Box>
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="10px"
              fontWeight="400"
              letterSpacing="0.06em"
              color="whiteAlpha.500"
              noOfLines={1}
            >
              {match.stadium}
            </Text>
          </>
        )}
      </Flex>
    </Box>
  )
}

export default function MatchBox({ last, next, variant = 'card' }) {
  // ── Variante STRIP (mobile, full-width bajo el Hero) ──
  if (variant === 'strip') {
    return (
      <Box
        w="100%"
        bg="linear-gradient(to bottom, rgba(8,12,18,0.55) 0%, rgba(8,12,18,0.92) 100%)"
        backdropFilter="blur(10px)"
        borderTop="1px solid rgba(0,87,184,0.35)"
        px={4}
        py={4}
      >
        <Flex gap={4} align="stretch">
          <Box flex="1" minW="0">
            <MatchRow match={last} kind="result" compact />
          </Box>
          <Box w="1px" bg="rgba(255,255,255,0.08)" flexShrink={0} />
          <Box flex="1" minW="0">
            <MatchRow match={next} kind="next" compact />
          </Box>
        </Flex>
      </Box>
    )
  }

  // ── Variante CARD (desktop, flotante) ──
  return (
    <Box
      w={{ base: '260px', md: '300px' }}
      bg="rgba(8,12,18,0.55)"
      border="1px solid rgba(255,255,255,0.08)"
      backdropFilter="blur(10px)"
      px={5}
      py={5}
      position="relative"
      transition="border-color 0.3s ease, transform 0.3s ease"
      _hover={{ borderColor: 'rgba(0,87,184,0.45)', transform: 'translateY(-3px)' }}
      sx={{
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '28px',
          height: '2px',
          background: '#0057B8',
        },
      }}
    >
      <MatchRow match={last} kind="result" />

      <Box my={4} h="1px" bg="rgba(255,255,255,0.07)" />

      <MatchRow match={next} kind="next" />
    </Box>
  )
}
