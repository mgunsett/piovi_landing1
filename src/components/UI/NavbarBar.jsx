import { useState, useEffect } from 'react'
import { Box, Flex, Text, HStack, VStack } from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { playerData } from '../../data/playerData'

const MotionBox = motion(Box)

const navLinks = [
  { label: 'Home',         href: '#hero' },
  { label: 'Estadísticas', href: '#estadisticas' },
  { label: 'Videos',       href: '#videos' },
  { label: 'Galería',      href: '#galeria' },
  { label: 'Prensa',       href: '#prensa' },
]

const mobileLinks = [
  ...navLinks,
  { label: 'Contacto', href: '#contact' },
]

function scrollTo(href) {
  const target = document.querySelector(href)
  if (!target) return
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -20 })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

// ─── Navbar 'barra' ────────────────────────────────────────────────
// Barra full-width: transparente arriba, se vuelve sólida con blur al
// scrollear. Links a la derecha con subrayado animado. En mobile abre
// un overlay a pantalla completa con links grandes escalonados.
export function NavbarBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Bloquear scroll del fondo mientras el overlay está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleLink = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    scrollTo(href)
  }

  return (
    <>
      <MotionBox
        as="nav"
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg={scrolled ? 'brand.dark3' : 'transparent'}
        backdropFilter={scrolled ? 'blur(12px) saturate(140%)' : 'none'}
        borderBottom="1px solid"
        borderColor={scrolled ? 'brand.amberLight' : 'transparent'}
        boxShadow={scrolled ? '0 8px 30px rgba(0,0,0,0.35)' : 'none'}
        transition="background 0.35s, border-color 0.35s, box-shadow 0.35s"
      >
        <Flex
          align="center"
          justify="space-between"
          maxW="1400px"
          mx="auto"
          px={{ base: 5, lg: 10 }}
          py={{ base: 3, lg: 4 }}
        >
          {/* Logo */}
          <Text
            fontFamily='"Dela Gothic One", sans-serif'
            fontSize={{ base: 'xl', lg: '2xl' }}
            letterSpacing="wider"
            color="brand.amber"
            cursor="pointer"
            onClick={(e) => handleLink(e, '#hero')}
            _hover={{ color: 'brand.bone' }}
            transition="color 0.2s"
          >
            {playerData.initials}
            <Box as="span" color="brand.gray2">_</Box>
          </Text>

          {/* Links desktop con subrayado animado */}
          <HStack spacing={{ lg: 6, xl: 9 }} display={{ base: 'none', lg: 'flex' }}>
            {navLinks.map((link) => (
              <Text
                key={link.href}
                as="a"
                href={link.href}
                onClick={(e) => handleLink(e, link.href)}
                position="relative"
                py={1}
                fontFamily="mono"
                fontSize="13px"
                fontWeight="600"
                letterSpacing="0.14em"
                textTransform="uppercase"
                color="brand.bone"
                cursor="pointer"
                transition="color 0.25s"
                _after={{
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: '-2px',
                  h: '2px',
                  bg: 'brand.amber',
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease',
                }}
                _hover={{ color: 'brand.amber', _after: { transform: 'scaleX(1)' } }}
              >
                {link.label}
              </Text>
            ))}
          </HStack>

          {/* CTA + hamburguesa */}
          <Flex align="center" gap={4}>
            <Box
              as="a"
              href="#contact"
              onClick={(e) => handleLink(e, '#contact')}
              display={{ base: 'none', lg: 'block' }}
              px={5}
              py={2}
              border="1px solid"
              borderColor="brand.amber"
              borderRadius="full"
              fontFamily="mono"
              fontSize="12px"
              fontWeight="700"
              letterSpacing="0.16em"
              textTransform="uppercase"
              color="brand.amber"
              cursor="pointer"
              transition="all 0.25s"
              _hover={{ bg: 'brand.amber', color: 'brand.brownDark' }}
            >
              Contacto
            </Box>

            {/* Hamburguesa mobile */}
            <Box
              display={{ base: 'flex', lg: 'none' }}
              flexDir="column"
              gap="5px"
              cursor="pointer"
              onClick={() => setMenuOpen(!menuOpen)}
              p={1}
              position="relative"
              zIndex={1200}
            >
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  w="24px"
                  h="2px"
                  borderRadius="full"
                  bg={menuOpen ? 'brand.amber' : 'brand.bone'}
                  transition="all 0.3s"
                  transform={
                    menuOpen
                      ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                      : i === 1 ? 'scaleX(0)'
                      : 'rotate(-45deg) translate(5px, -5px)'
                      : 'none'
                  }
                />
              ))}
            </Box>
          </Flex>
        </Flex>
      </MotionBox>

      {/* Overlay a pantalla completa (mobile) */}
      <AnimatePresence>
        {menuOpen && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            display={{ base: 'flex', lg: 'none' }}
            position="fixed"
            inset={0}
            zIndex={1100}
            bg="brand.brown"
            flexDir="column"
            justify="center"
            px={8}
          >
            <VStack align="stretch" spacing={1}>
              {mobileLinks.map((link, i) => (
                <MotionBox
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Flex
                    as="a"
                    href={link.href}
                    onClick={(e) => handleLink(e, link.href)}
                    align="baseline"
                    gap={4}
                    py={2}
                    cursor="pointer"
                    role="group"
                  >
                    <Text fontFamily="mono" fontSize="13px" fontWeight="700" color="brand.amber">
                      0{i + 1}
                    </Text>
                    <Text
                      fontFamily='"Dela Gothic One", sans-serif'
                      fontSize="4xl"
                      textTransform="uppercase"
                      color="brand.bone"
                      lineHeight={1.1}
                      transition="color 0.2s"
                      _groupHover={{ color: 'brand.amber' }}
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
    </>
  )
}
