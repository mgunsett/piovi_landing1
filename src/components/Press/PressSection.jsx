import { useEffect, useRef } from 'react'
import { Box, Flex, Grid, Text, VStack, HStack } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import playerData from '../../data/playerData.js'

gsap.registerPlugin(ScrollTrigger)

const mediaLogos = ['ESPN', 'TyC Sports', 'Olé', 'Fox Sports', 'Marca', 'TUDN', 'ESPN', 'TyC Sports', 'Olé', 'Fox Sports', 'Marca', 'TUDN']

function PressCard({ article, index }) {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
          delay: index * 0.12,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
          },
        }
      )
    })
    return () => ctx.revert()
  }, [index])

  return (
    <Box
      ref={ref}
      opacity={0}
      as="a"
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      display="block"
      p={6}
      border="1px solid rgba(255,255,255,0.06)"
      position="relative"
      overflow="hidden"
      transition="all 0.3s ease"
      cursor="none"
      _hover={{
        borderColor: 'rgba(0,87,184,0.4)',
        transform: 'translateY(-4px)',
        '& .arrow': { transform: 'translate(3px, -3px)' },
      }}
      data-cursor-hover
    >
      <Flex justify="space-between" align="flex-start" mb={4}>
        <Box
          px={3}
          py={1}
          bg="rgba(0,87,184,0.15)"
          border="1px solid rgba(0,87,184,0.3)"
        >
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="11px"
            fontWeight="700"
            letterSpacing="0.2em"
            textTransform="uppercase"
            color="brand.blue"
          >
            {article.media}
          </Text>
        </Box>

        <Text
          className="arrow"
          fontSize="16px"
          transition="transform 0.3s ease"
          color="whiteAlpha.400"
        >
          ↗
        </Text>
      </Flex>

      <Text
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="18px"
        fontWeight="600"
        lineHeight="1.3"
        color="white"
        mb={4}
      >
        {article.title}
      </Text>

      <Text
        fontFamily="'Barlow Condensed', sans-serif"
        fontSize="11px"
        fontWeight="600"
        letterSpacing="0.15em"
        textTransform="uppercase"
        color="whiteAlpha.400"
      >
        {article.date}
      </Text>

      {/* Bottom accent */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        h="2px"
        bg="linear-gradient(to right, transparent, rgba(0,87,184,0.4), transparent)"
        transform="scaleX(0)"
        transformOrigin="center"
        transition="transform 0.4s ease"
        sx={{ 'a:hover &': { transform: 'scaleX(1)' } }}
      />
    </Box>
  )
}

export default function PressSection() {
  const titleRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: titleRef.current, start: 'top 85%' },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <Box
      as="section"
      id="press"
      bg="#0A0E16"
      py={{ base: 20, md: 32 }}
      px={{ base: 6, md: 12, lg: 20 }}
      position="relative"
      overflow="hidden"
    >
      {/* Section title */}
      <Box ref={titleRef} mb={{ base: 12, md: 16 }}>
        <Text
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="11px"
          fontWeight="700"
          letterSpacing="0.3em"
          textTransform="uppercase"
          color="brand.blue"
          mb={3}
        >
          Medios & Prensa
        </Text>
        <Text
          fontFamily="'Bebas Neue', sans-serif"
          fontSize={{ base: '52px', md: '80px', lg: '100px' }}
          lineHeight="0.9"
          letterSpacing="0.02em"
        >
          Lo que
          <Box as="span" color="brand.blue"> dicen</Box>
        </Text>
      </Box>

      {/* Press cards */}
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
        gap={4}
        mb={20}
      >
        {playerData.press.map((article, i) => (
          <PressCard key={i} article={article} index={i} />
        ))}
      </Grid>

      {/* Media logos marquee */}
      <Box
        borderTop="1px solid rgba(255,255,255,0.05)"
        pt={10}
        overflow="hidden"
      >
        <Text
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="10px"
          fontWeight="700"
          letterSpacing="0.3em"
          textTransform="uppercase"
          color="whiteAlpha.300"
          textAlign="center"
          mb={6}
        >
          Presente en los principales medios
        </Text>

        <Box display="flex" overflow="hidden">
          <Box className="marquee-track" display="flex" gap={12} whiteSpace="nowrap">
            {mediaLogos.map((logo, i) => (
              <Text
                key={i}
                as="span"
                fontFamily="'Bebas Neue', sans-serif"
                fontSize="18px"
                letterSpacing="0.1em"
                color="whiteAlpha.200"
              >
                {logo}
              </Text>
            ))}
            {mediaLogos.map((logo, i) => (
              <Text
                key={`b-${i}`}
                as="span"
                fontFamily="'Bebas Neue', sans-serif"
                fontSize="18px"
                letterSpacing="0.1em"
                color="whiteAlpha.200"
              >
                {logo}
              </Text>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
