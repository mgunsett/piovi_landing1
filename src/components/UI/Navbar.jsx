import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text, HStack } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { label: 'Perfil',   href: '#stats' },
  { label: 'Stats',    href: '#stats' },
  { label: 'Videos',   href: '#videos' },
  { label: 'Prensa',   href: '#press' },
]

export default function Navbar() {
  const navRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 2.8 }
    )
  }, [])

  return (
    <Box
      ref={navRef}
      as="nav"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex={1000}
      px={{ base: 6, md: 12, lg: 20 }}
      py={4}
      transition="all 0.4s ease"
      bg={scrolled ? 'rgba(8, 12, 18, 0.7)' : 'transparent'}
      backdropFilter={scrolled ? 'blur(16px)' : 'none'}
      borderBottom={scrolled ? '1px solid rgba(0, 87, 184, 0.2)' : 'none'}
    >
      <Flex align="center" justify="space-between">
        {/* Logo */}
        <Text
          fontFamily="'Bebas Neue', sans-serif"
          fontSize="28px"
          letterSpacing="0.08em"
          color="white"
          lineHeight="1"
        >
          GP
          <Box as="span" color="brand.blue" ml="1px">_</Box>
        </Text>

        {/* Nav links */}
        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          {navLinks.map((link) => (
            <Box
              as="a"
              key={link.label}
              href={link.href}
              fontFamily="'Barlow Condensed', sans-serif"
              fontWeight="600"
              fontSize="13px"
              letterSpacing="0.14em"
              textTransform="uppercase"
              color="whiteAlpha.700"
              position="relative"
              _hover={{ color: 'white' }}
              transition="color 0.2s"
              sx={{
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-2px',
                  left: 0,
                  width: '0%',
                  height: '1px',
                  background: '#0057B8',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%',
                },
              }}
            >
              {link.label}
            </Box>
          ))}
        </HStack>

        {/* CTA */}
        <Box
          as="a"
          href="#contact"
          fontFamily="'Barlow Condensed', sans-serif"
          fontWeight="600"
          fontSize="12px"
          letterSpacing="0.16em"
          textTransform="uppercase"
          px={5}
          py={2}
          border="1px solid"
          borderColor="brand.blue"
          color="white"
          display={{ base: 'none', md: 'block' }}
          _hover={{ bg: 'brand.blue', color: 'white' }}
          transition="all 0.3s ease"
        >
          Contacto
        </Box>
      </Flex>
    </Box>
  )
}
