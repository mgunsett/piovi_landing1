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

]

const mobileLinks = [
  ...navLinks,
  { label: 'Contacto', href: '#contact' },
]

// Links repartidos a los lados del logo centrado (desktop)
const leftLinks = navLinks.slice(0, 2)
const rightLinks = navLinks.slice(2)

function scrollTo(href) {
  const target = document.querySelector(href)
  if (!target) return
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -20 })
  } else {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

function NavLink({ link, onClick }) {
  return (
    <Text
      as="a"
      href={link.href}
      onClick={(e) => onClick(e, link.href)}
      position="relative"
      py={1}
      fontFamily="mono"
      fontSize="12px"
      fontWeight="600"
      letterSpacing="0.16em"
      textTransform="uppercase"
      color="brand.gray"
      cursor="pointer"
      transition="color 0.25s"
      _before={{
        content: '""',
        position: 'absolute',
        top: '-6px',
        left: '50%',
        w: '4px',
        h: '4px',
        borderRadius: 'full',
        bg: 'brand.amber',
        transform: 'translateX(-50%) scale(0)',
        transition: 'transform 0.25s ease',
      }}
      _hover={{ color: 'brand.bone', _before: { transform: 'translateX(-50%) scale(1)' } }}
    >
      {link.label}
    </Text>
  )
}

// ─── Navbar 'split' ────────────────────────────────────────────────
// Barra full-width con logo centrado y los links repartidos a ambos
// lados (desktop). En mobile: logo a la izquierda, hamburguesa a la
// derecha y un drawer lateral que entra deslizándose desde la derecha.
export function NavbarSplit() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
          maxW="1400px"
          mx="auto"
          px={{ base: 5, lg: 10 }}
          py={{ base: 3, lg: 4 }}
        >
          {/* Links izquierda (desktop) */}
          <HStack
            flex="1"
            spacing={8}
            justify="flex-start"
            display={{ base: 'none', lg: 'flex' }}
          >
            {leftLinks.map((link) => (
              <NavLink key={link.href} link={link} onClick={handleLink} />
            ))}
          </HStack>

          {/* Logo centrado */}
          <Text
            fontFamily='heading'
            fontWeight="bold"
            fontSize={{ base: '2xl', lg: '2xl' }}
            letterSpacing="wider"
            color="brand.amber"
            cursor="pointer"
            whiteSpace="nowrap"
            onClick={(e) => handleLink(e, '#hero')}
            _hover={{ color: 'brand.bone' }}
            transition="color 0.2s"
          >
            {playerData.initials}
            <Box as="span" color="brand.dorado">_</Box>
          </Text>

          {/* Derecha: links (desktop) o hamburguesa (mobile) */}
          <Flex flex="1" justify="flex-end" align="center" gap={{ lg: 8 }}>
            <HStack spacing={8} display={{ base: 'none', lg: 'flex' }}>
              {rightLinks.map((link) => (
                <NavLink key={link.href} link={link} onClick={handleLink} />
              ))}
              <Box
                as="a"
                href="#contact"
                onClick={(e) => handleLink(e, '#contact')}
                px={4}
                py={1.5}
                border="1px solid"
                borderColor="brand.amber"
                borderRadius="full"
                fontFamily="mono"
                fontSize="11px"
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
            </HStack>

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

      {/* Drawer lateral (mobile) */}
      <AnimatePresence>
        {menuOpen && (
          <Box display={{ base: 'block', lg: 'none' }}>
            {/* Backdrop */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              position="fixed"
              inset={0}
              zIndex={1090}
              bg="rgba(0,0,0,0.55)"
              backdropFilter="blur(2px)"
              onClick={() => setMenuOpen(false)}
            />

            {/* Panel */}
            <MotionBox
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              position="fixed"
              top={0}
              right={0}
              zIndex={1100}
              h="100dvh"
              w={{ base: '80%', sm: '340px' }}
              bg="brand.brown"
              borderLeft="1px solid"
              borderColor="brand.amberLight"
              boxShadow="-20px 0 50px rgba(0,0,0,0.5)"
              px={7}
              py={6}
            >
              {/* Cabecera del drawer */}
              <Flex align="center" justify="space-between" mb={10}>
                <Text
                  fontFamily='heading'
                  fontWeight="bold"
                  letterSpacing="wider"
                  textTransform="uppercase"
                  fontSize="2xl"
                  color="brand.amber"
                >
                  {playerData.initials}
                  <Box as="span" color="brand.dorado">_</Box>
                </Text>
                <Box
                  as="button"
                  aria-label="Cerrar menú"
                  onClick={() => setMenuOpen(false)}
                  position="relative"
                  w="26px"
                  h="26px"
                  cursor="pointer"
                >
                  {[45, -45].map((deg) => (
                    <Box
                      key={deg}
                      position="absolute"
                      top="50%"
                      left="50%"
                      w="22px"
                      h="2px"
                      bg="brand.bone"
                      borderRadius="full"
                      transform={`translate(-50%, -50%) rotate(${deg}deg)`}
                    />
                  ))}
                </Box>
              </Flex>

              <VStack align="stretch" spacing={0}>
                {mobileLinks.map((link, i) => (
                  <MotionBox
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.06 }}
                  >
                    <Flex
                      as="a"
                      href={link.href}
                      onClick={(e) => handleLink(e, link.href)}
                      align="center"
                      gap={3}
                      py={4}
                      borderBottom="1px solid"
                      borderColor="whiteAlpha.100"
                      cursor="pointer"
                      role="group"
                    >
                      <Text fontFamily="mono" fontSize="11px" fontWeight="700" color="brand.amber">
                        0{i + 1}
                      </Text>
                      <Text
                        fontFamily="mono"
                        fontSize="lg"
                        fontWeight="600"
                        letterSpacing="0.08em"
                        textTransform="uppercase"
                        color="brand.bone"
                        transition="color 0.2s, transform 0.25s"
                        _groupHover={{ color: 'brand.orangeLight', transform: 'translateX(4px)' }}
                      >
                        {link.label}
                      </Text>
                    </Flex>
                  </MotionBox>
                ))}
              </VStack>
            </MotionBox>
          </Box>
        )}
      </AnimatePresence>
    </>
  )
}
