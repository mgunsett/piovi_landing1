import { useEffect, useRef, useState } from 'react'
import { Box, Flex, Text, HStack, VStack } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MotionBox = motion(Box)

const navLinks = [
  { label: 'Stats',    href: '#stats' },
  { label: 'Videos',   href: '#videos' },
  { label: 'Fotos',    href: '#gallery' },
  { label: 'Prensa',   href: '#press' },
  { label: 'Contacto', href: '#contact' },
]

export default function Navbar() {
  const navRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    )
  }, [])

  // Cerrar el menú al pasar a desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 48em)')
    const onChange = (e) => { if (e.matches) setMenuOpen(false) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Fondo sólido cuando el menú mobile está abierto (mejor legibilidad)
  const showSolid = scrolled || menuOpen

  return (
    <Box
      ref={navRef}
      as="nav"
      position="fixed"
      top="0"
      left="0"
      right="0"
      zIndex={1000}
      transition="all 0.4s ease"
      bg={showSolid ? 'rgba(8, 12, 18, 0.85)' : 'transparent'}
      backdropFilter={showSolid ? 'blur(16px)' : 'none'}
      borderBottom={showSolid ? '1px solid rgba(0, 87, 184, 0.2)' : 'none'}
    >
      <Flex
        align="center"
        justify="space-between"
        px={{ base: 6, md: 12, lg: 20 }}
        py={4}
      >
        {/* Logo */}
        <Box as="a" href="#hero" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
          <Text
            fontFamily="'Bebas Neue', sans-serif"
            fontSize="28px"
            letterSpacing="0.08em"
            color="white"
            lineHeight="1"
            cursor="pointer"
          >
            GP
            <Box as="span" color="brand.blue" ml="1px">_</Box>
          </Text>
        </Box>

        {/* Nav links — desktop */}
        <HStack spacing={8} display={{ base: 'none', md: 'flex' }}>
          {navLinks.slice(0, 4).map((link) => (
            <NavAnchor key={link.label} href={link.href}>
              {link.label}
            </NavAnchor>
          ))}
        </HStack>

        {/* CTA — desktop */}
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

        {/* Hamburguesa — mobile */}
        <Box
          display={{ base: 'flex', md: 'none' }}
          as="button"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((v) => !v)}
          flexDirection="column"
          justifyContent="center"
          gap="5px"
          w="34px"
          h="34px"
          alignItems="flex-end"
        >
          <Box
            as="span"
            w="26px"
            h="2px"
            bg="white"
            transition="transform 0.3s ease, width 0.3s ease"
            transform={menuOpen ? 'translateY(7px) rotate(45deg)' : 'none'}
          />
          <Box
            as="span"
            w="18px"
            h="2px"
            bg={menuOpen ? 'transparent' : 'brand.blue'}
            transition="opacity 0.2s ease, width 0.3s ease"
            opacity={menuOpen ? 0 : 1}
          />
          <Box
            as="span"
            w="26px"
            h="2px"
            bg="white"
            transition="transform 0.3s ease"
            transform={menuOpen ? 'translateY(-7px) rotate(-45deg)' : 'none'}
          />
        </Box>
      </Flex>

      {/* Menú desplegable — mobile */}
      <AnimatePresence>
        {menuOpen && (
          <MotionBox
            display={{ base: 'block', md: 'none' }}
            overflow="hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            borderTop="1px solid rgba(255,255,255,0.06)"
          >
            <VStack
              align="stretch"
              spacing={0}
              px={6}
              py={4}
              divider={<Box h="1px" bg="rgba(255,255,255,0.05)" />}
            >
              {navLinks.map((link, i) => (
                <MotionBox
                  key={link.label}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
                >
                  <Flex
                    as="a"
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    align="center"
                    gap={4}
                    py={3}
                    role="group"
                  >
                    <Text
                      fontFamily="'Barlow Condensed', sans-serif"
                      fontSize="11px"
                      fontWeight="700"
                      letterSpacing="0.2em"
                      color="brand.blue"
                      w="22px"
                    >
                      0{i + 1}
                    </Text>
                    <Text
                      fontFamily="'Bebas Neue', sans-serif"
                      fontSize="28px"
                      letterSpacing="0.04em"
                      color="whiteAlpha.800"
                      lineHeight="1"
                      transition="color 0.2s ease, transform 0.2s ease"
                      _groupHover={{ color: 'white', transform: 'translateX(4px)' }}
                    >
                      {link.label}
                    </Text>
                  </Flex>
                </MotionBox>
              ))}
            </VStack>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  )
}

// ─── Link inline de desktop (con subrayado animado) ──────────────
function NavAnchor({ href, children }) {
  return (
    <Box
      as="a"
      href={href}
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
        '&:hover::after': { width: '100%' },
      }}
    >
      {children}
    </Box>
  )
}
