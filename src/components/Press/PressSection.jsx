import { useRef, useEffect } from 'react'
import { Box, Grid, Text, Flex, VStack, HStack, Link, Image, useToken } from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useScrubReveal from '../../hooks/useScrubReveal'
import { playerData } from '../../data/playerData'

gsap.registerPlugin(ScrollTrigger)

function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function Stars({ count = 5 }) {
  return (
    <HStack spacing={1}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Box key={i} as={FaStar} boxSize="14px"
          color={i < count ? 'brand.goldDark' : 'whiteAlpha.200'} 
          _groupHover={{ color: 'brand.gold' }}
          />
      ))}
    </HStack>
  )
}

function PressCard({ article, index }) {
  const cardRef = useRef(null)
  const [bone, surface, amber, amberLight] = useToken('colors', ['brand.bone', 'brand.surface', 'brand.amber', 'brand.amberLight'])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          delay: index * 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
        }
      )
    })
    return () => ctx.revert()
  }, [index])

  return (
    <Box ref={cardRef} role="group" style={{ opacity: 0 }}>
      {/* Burbuja */}
      <Box
        as={Link}
        href={article.url}
        isExternal
        display="block"
        textDecoration="none"
        bg="brand.surfaceDeep"
        border="1px solid"
        borderColor="brand.navyLight"
        borderRadius="md"
        p={6}
        position="relative"
        transition="border-color 0.35s, transform 0.35s, background 0.35s"
        _after={{
          content: '""', position: 'absolute', bottom: '-10px', left: 8,
          w: 0, h: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: `10px solid ${amberLight}`,
          filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.06))',
          _groupHover: { borderTopColor: amber },
        }}
        _groupHover={{
          borderColor: 'brand.amber',
          transform: 'translateY(-4px)',
          bg: 'brand.panel',
          _before: { width: '40px' },
          textDecoration: 'none',
        }}
      >
        <VStack align="start" spacing={4}>
          <Flex justify="space-between" align="center" w="100%">
            <Stars count={article.rating ?? 5} />
            <Box
              px={2.5} py={1}
              bg="transparent"
              border="1px solid"
              borderColor="brand.red"
              borderRadius="sm"
              transition="border-color 0.35s, background 0.35s"
              >
                <Text fontFamily="heading" fontSize="9px" color="brand.gray"
                textTransform="uppercase" letterSpacing="0.18em"
                _groupHover={{ color: 'brand.bone '}}
                >
                {article.media}
              </Text>
            </Box>
          </Flex>

          <Text fontFamily="body" fontSize={{base:'xs',md:"md"}} color="brand.grayLight" lineHeight={1.55} _groupHover={{ color: 'brand.bone' }}>
            “{article.title}”
          </Text>

          <Text fontFamily="mono" fontSize="11px" color="brand.gray2"
            textTransform="uppercase" letterSpacing="0.18em"
            transition="color 0.25s"
            _groupHover={{ color: 'brand.rec' }}>
            Leer más →
          </Text>
        </VStack>
      </Box>

      {/* Autor */}
      <HStack spacing={3} mt={5} pl={2}>
        <Flex
          boxSize="42px"
          flexShrink={0}
          borderRadius="full"
          overflow="hidden"
          align="center"
          justify="center"
          bg={`linear-gradient(135deg, ${bone}, ${surface})`}
          border="1px solid"
          borderColor="brand.amber"
          transition="border-color 0.35s, box-shadow 0.35s"
          _groupHover={{
            borderColor: 'brand.brown',
            boxShadow: '0 0 0 3px #485b8344',
          }}
        >
          {article.logo ? (
            <Image
              src={article.logo}
              alt={`Logo de ${article.media}`}
              boxSize="100%"
              objectFit="cover"
              objectPosition="center"
              loading="lazy"
            />
          ) : (
            <Text fontFamily="heading" fontSize="lg" color="white" lineHeight={1}>
              {getInitials(article.media)}
            </Text>
          )}
        </Flex>
        <Box>
          <Text fontFamily="heading" fontSize="lg" color="brand.dorado" lineHeight={1} _groupHover={{ color: 'brand.amber' }}>
            {article.media}
          </Text>
          <Text fontFamily="mono" fontSize="10px" color="brand.gray"
            textTransform="uppercase" letterSpacing="0.18em" mt={0.5}>
            {article.date}
          </Text>
        </Box>
      </HStack>
    </Box>
  )
}

export default function PressSection() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)

  useScrubReveal(sectionRef, {
    elements: [{ ref: titleRef, fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 } }],
    start: 'top 80%',
    end:   'top 40%',
  })

  return (
    <Box
      as="section"
      id="prensa"
      ref={sectionRef}
      bg="brand.darkDeep"
      mt={{ base: 12, lg: 20 }}
      pb={{ base: 16, lg: 40 }}
      pt={{ base: 2, lg: 40 }}
      px={{ base: 5, lg: 10 }}
    >
      <Box maxW="1400px" mx="auto">
        {/* Header */}
        <Flex align="flex-end" justify="space-between" mb={10} ref={titleRef}>
          <Box>
            <Text  fontFamily="heading"
              fontSize={{ base: '10px', md: '11px', lg: '12px' }} 
              letterSpacing="0.36em" textTransform="uppercase"
              color="brand.bone" mb={2}>
              Testimonios
            </Text>
            <Text  fontFamily="heading"
              textTransform="uppercase" fontWeight="medium" fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              lineHeight="0.9" letterSpacing="0.02em">
              Pre<Box as="span" color="brand.blue">nsa</Box>
            </Text>
          </Box>
        </Flex>

        {/* Cards */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={4}>
          {playerData.press.map((article, i) => (
            <PressCard key={article.title} article={article} index={i} />
          ))}
        </Grid>
      </Box>
    </Box>
  )
}
