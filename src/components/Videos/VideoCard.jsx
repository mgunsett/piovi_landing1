import { useState } from 'react'
import { Box, Flex, Text, AspectRatio } from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { FiPlay } from 'react-icons/fi'
import { FaInstagram } from 'react-icons/fa'

// Pulso del anillo del botón play
const pulse = keyframes`
  0%   { transform: scale(1);   opacity: 0.5; }
  70%  { transform: scale(1.7); opacity: 0; }
  100% { transform: scale(1.7); opacity: 0; }
`
// Barrido de brillo diagonal al hover
const sheen = keyframes`
  0%   { transform: translateX(-130%) skewX(-18deg); opacity: 0; }
  35%  { opacity: 0.5; }
  100% { transform: translateX(230%) skewX(-18deg); opacity: 0; }
`
// Anillo cónico que gira alrededor del play
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`
// Parpadeo del punto REC
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.2; }
`

export function VideoCard({ video, index = 0, onOpen }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Box
      className="video-card"
      position="relative"
      cursor="pointer"
      role="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(video)}
      transition="transform 0.5s ease, filter 0.5s ease"
      transform={hovered ? 'translateY(-6px)' : 'translateY(0)'}
      sx={{
        filter: {
          base: 'none',
          md: hovered
            ? 'drop-shadow(0 30px 55px rgba(0,0,0,0.55))'
            : 'drop-shadow(0 18px 40px rgba(0,0,0,0.45))',
        },
      }}
    >
      <AspectRatio ratio={9 / 16}>
        <Box
          position="relative"
          overflow="hidden"
          bg="#0c0d0d"
          borderRadius="5px"
          boxShadow="inset 0 0 0 1px rgba(255,255,255,0.08)"
        >
          {/* cover (Instagram no permite autoplay en iframe, se mantiene el cover con zoom) */}
          <Box
            as="img"
            src={video.cover}
            alt={video.title}
            position="absolute"
            inset={0}
            w="100%"
            h="100%"
            objectFit="cover"
            objectPosition="center 40%"
            transition="opacity 0.5s ease, transform 0.7s ease"
            transform={hovered ? 'scale(1.06)' : 'scale(1)'}
          />

          {/* gradiente + viñeta + scanlines */}
          <Box
            position="absolute"
            inset={0}
            pointerEvents="none"
            bg="linear-gradient(180deg, rgba(10,5,5,0.15) 0%, rgba(10,5,5,0.1) 40%, rgba(10,5,5,0.85) 100%)"
          />
          <Box
            position="absolute"
            inset={0}
            pointerEvents="none"
            background="radial-gradient(ellipse at center, transparent 42%, rgba(3,6,10,0.8) 125%)"
            opacity={hovered ? 1 : 0.4}
            transition="opacity 0.5s ease"
          />
          <Box
            position="absolute"
            inset={0}
            pointerEvents="none"
            zIndex={2}
            opacity={hovered ? 0.5 : 0.22}
            transition="opacity 0.5s ease"
            sx={{
              background:
                'repeating-linear-gradient(180deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 2px, transparent 4px)',
            }}
          />

          {/* badge REC + categoría */}
          <Flex
            position="absolute"
            top={3}
            left={3}
            align="center"
            gap="6px"
            bg="rgba(10,5,5,0.55)"
            backdropFilter="blur(6px)"
            border="1px solid"
            borderColor="brand.amber"
            px="8px"
            py="4px"
            borderRadius="5px"
            zIndex={4}
          >
            <Box w="6px" h="6px" borderRadius="full" bg="brand.rec" animation={`${blink} 1.6s ease-in-out infinite`} />
            <Text fontFamily="mono" fontSize="9px" letterSpacing="0.24em" textTransform="uppercase" color="white">
              {video.category}
            </Text>
          </Flex>

          {/* marcador de fuente: Instagram */}
          <Flex
            position="absolute"
            top={3}
            right={3}
            align="center"
            justify="center"
            w="26px"
            h="26px"
            borderRadius="7px"
            bg="rgba(10,5,5,0.55)"
            backdropFilter="blur(6px)"
            border="1px solid"
            borderColor="whiteAlpha.300"
            zIndex={4}
            transition="border-color 0.4s ease, background 0.4s ease"
            _groupHover={{ borderColor: 'brand.amber', bg: 'rgba(189,167,142,0.25)' }}
          >
            <Box as={FaInstagram} fontSize="14px" color="white" />
          </Flex>

          {/* botón play central */}
          <Flex position="absolute" inset={0} align="center" justify="center" zIndex={5}>
            <Box
              position="relative"
              w="54px"
              h="54px"
              transition="transform 0.45s cubic-bezier(0.22,1,0.36,1)"
              transform={hovered ? 'scale(1.12)' : 'scale(1)'}
            >
              <Box position="absolute" inset={0} borderRadius="full" border="1px solid" borderColor="brand.amber" animation={`${pulse} 2.8s ease-out infinite`} />
              <Box position="absolute" inset={0} borderRadius="full" border="1px solid" borderColor="brand.amber" animation={`${pulse} 2.8s ease-out infinite 1.4s`} />
              <Box
                position="absolute"
                inset="-6px"
                borderRadius="full"
                opacity={hovered ? 1 : 0}
                transition="opacity 0.4s ease"
                sx={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, #bda78ee6 80deg, #7a4e1f 150deg, transparent 220deg, transparent 360deg)',
                  WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))',
                }}
                animation={`${spin} 4s linear infinite`}
              />
              <Box position="absolute" inset="-6px" borderRadius="full" border="1px solid" borderColor="whiteAlpha.200" />
              <Flex
                position="absolute"
                inset={0}
                align="center"
                justify="center"
                borderRadius="full"
                border="1px solid"
                borderColor="whiteAlpha.700"
                bg="rgba(10,5,5,0.4)"
                backdropFilter="blur(10px)"
                transition="all 0.4s ease"
                boxShadow={hovered ? '0 0 28px rgba(189,167,142,0.55)' : 'none'}
                _groupHover={{ bg: 'rgba(189,167,142,0.5)', borderColor: 'white' }}
              >
                <Box as={FiPlay} fontSize="20px" ml="3px" color="white" />
              </Flex>
            </Box>
          </Flex>

          {/* etiqueta estática (visible siempre, se oculta al hover) */}
          <Flex
            position="absolute"
            bottom={3}
            left={3}
            right={3}
            align="flex-end"
            justify="space-between"
            gap={2}
            zIndex={4}
            opacity={hovered ? 0 : 1}
            transition="opacity 0.35s ease"
            pointerEvents="none"
          >
            <Text fontFamily="heading" fontSize="xl" lineHeight={1} color="white" noOfLines={1}>
              {video.title}
            </Text>
            <Text fontFamily="mono" fontSize="11px" letterSpacing="0.2em" color="brand.amber" flexShrink={0}>
              {`0${index + 1}`}
            </Text>
          </Flex>

          {/* título al hover (sube desde abajo) */}
          <Box
            position="absolute"
            bottom={4}
            left={4}
            right={4}
            zIndex={4}
            opacity={hovered ? 1 : 0}
            transform={hovered ? 'translateY(0)' : 'translateY(14px)'}
            transition="opacity 0.45s ease 0.05s, transform 0.45s cubic-bezier(0.22,1,0.36,1) 0.05s"
            pointerEvents="none"
          >
            <Text fontFamily="mono" fontSize="8px" letterSpacing="0.26em" textTransform="uppercase" color="brand.amber" mb={1}>
              Jugadas destacadas
            </Text>
            <Text fontFamily="heading" fontSize="2xl" lineHeight={1} color="white" letterSpacing="0.01em" noOfLines={1}>
              {video.season}
            </Text>
          </Box>

          {/* sheen diagonal */}
          <Box position="absolute" inset={0} overflow="hidden" pointerEvents="none" zIndex={2}>
            {hovered && (
              <Box position="absolute" top={0} bottom={0} left={0} w="40%" background="linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)" animation={`${sheen} 1.1s ease-out`} />
            )}
          </Box>
        </Box>
      </AspectRatio>
    </Box>
  )
}
