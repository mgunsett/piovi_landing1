import { useEffect, useRef } from 'react'
import { Box, Flex, Text, HStack } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            end: 'top 70%',
            scrub: 1,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <Box
      ref={ref}
      as="footer"
      bg="#050810"
      borderTop="1px solid rgba(255,255,255,0.05)"
      py={8}
      px={{ base: 6, md: 12, lg: 20 }}
    >
      <Flex
        align="center"
        justify="space-between"
        flexWrap="wrap"
        gap={4}
      >
        <Text
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="24px"
          letterSpacing="0.08em"
          color="white"
        >
          GP
          <Box as="span" color="brand.blue" ml="1px">_</Box>
        </Text>

        <Text
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="12px"
          letterSpacing="0.12em"
          textTransform="uppercase"
          color="whiteAlpha.300"
          textAlign="center"
        >
          © 2024 Gonzalo Piovi · Todos los derechos reservados
        </Text>

        <Text
          fontFamily="'Barlow Condensed', sans-serif"
          fontSize="12px"
          letterSpacing="0.12em"
          textTransform="uppercase"
          color="whiteAlpha.300"
        >
          Cruz Azul · Liga MX
        </Text>
      </Flex>
    </Box>
  )
}
