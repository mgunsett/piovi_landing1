import { useState, useEffect, useRef } from 'react'
import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { playerData } from '../../data/playerData'
import { NavbarMenuPanel } from './NavbarMenuPanel'

const MotionBox = motion(Box)

const navLinks = [
  { label: 'Home',         href: '#hero' },
  { label: 'Estadísticas', href: '#estadisticas' },
  { label: 'Videos',       href: '#videos' },
  { label: 'Galería',      href: '#galeria' },
  { label: 'Prensa',       href: '#prensa' },
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

// ─── Navbar 'menu' ─────────────────────────────────────────────────
// Barra minimal en todas las resoluciones: solo el logo (foco visual,
// escala al abrir) y un botón circular de menú. La navegación vive en un
// panel desplegable tipo grid — misma lógica en desktop y mobile.
export function NavbarMenu() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const toggleRef               = useRef(null)
  const reduce                  = useReducedMotion()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    handler()
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Bloquea el scroll del fondo y cierra con Escape mientras está abierto
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      toggleRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const handleLink = (e, href) => {
    e.preventDefault()
    setOpen(false)
    scrollTo(href)
  }

  const solid = scrolled || open

  return (
    <>
      {/* Backdrop: cierra al hacer click fuera del panel */}
      <AnimatePresence>
        {open && (
          <MotionBox
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35 }}
            onClick={() => setOpen(false)}
            position="fixed"
            inset={0}
            zIndex={990}
            bg="rgba(4,7,15,0.55)"
            backdropFilter="blur(4px)"
          />
        )}
      </AnimatePresence>

      <MotionBox
        as="nav"
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.8, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : 0.4 }}
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg={solid ? 'whiteAlpha.600' : 'transparent'}
        backdropFilter={scrolled && !open ? 'blur(12px) saturate(140%)' : 'none'}
        borderBottom="1px solid"
        borderColor={scrolled && !open ? 'brand.amberLight' : 'transparent'}
        transition="background 0.35s, border-color 0.35s"
      >
        <Grid
          templateColumns={{ base: '1fr auto', md: '1fr auto 1fr' }}
          alignItems="center"
          px={{ base: 5, md: 12, lg: 28, xl: 40 }}
          py={{ base: 3, lg: 4 }}
        >
          {/* Botón de menú: círculo con hamburguesa → X + label */}
          <Flex
            ref={toggleRef}
            as="button"
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-menu-panel"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            align="center"
            gridColumn={{ base: 2, md: 1 }}
            gridRow={1}
            justifySelf={{ base: 'end', md: 'start' }}
            gap={4}
            cursor="pointer"
            _focusVisible={{ outline: '2px solid', outlineColor: 'brand.dorado', outlineOffset: '6px', borderRadius: 'full' }}
            sx={{
              '&:hover .toggle-ring': { borderColor: 'brand.dorado', bg: 'brand.bgRef' },
              '&:hover .toggle-label': { color: 'brand.dorado' },
            }}
          >
            <Flex
              className="toggle-ring"
              align="center"
              justify="center"
              direction="column"
              gap="5px"
              boxSize={{ base: '42px', md: '46px' }}
              borderRadius="5px"
              border="1px solid"
              borderColor={open ? 'brand.dorado' : 'brand.amberLight'}
              transition="border-color 0.3s, background 0.3s"
            >
              {[0, 1, 2].map((i) => (
                <Box
                  key={i}
                  w="18px"
                  h="2px"
                  borderRadius="full"
                  bg={open ? 'brand.dorado' : 'brand.amber'}
                  transition="all 0.3s cubic-bezier(0.16,1,0.3,1)"
                  transform={
                    open
                      ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                      : i === 1 ? 'scaleX(0)'
                      : 'rotate(-45deg) translate(5px, -5px)'
                      : 'none'
                  }
                />
              ))}
            </Flex>

            <Text
              className="toggle-label"
              display={{ base: 'none', sm: 'block' }}
              fontFamily="mono"
              fontSize="12px"
              fontWeight="700"
              letterSpacing="0.2em"
              textTransform="uppercase"
              color={open ? 'brand.dorado' : 'brand.amber'}
              transition="color 0.3s"
            >
              {open ? 'Cerrar' : 'Menú'}
            </Text>
          </Flex>

          {/* Logo — ancla de lectura, escala y cambia de color al abrir */}
          <Text
            as="a"
            href="#hero"
            onClick={(e) => handleLink(e, '#hero')}
            gridColumn={{ base: 1, md: 2 }}
            gridRow={1}
            justifySelf={{ base: 'start', md: 'center' }}
            fontFamily='"Dela Gothic One", sans-serif'
            fontSize={{ base: 'xl', lg: '2xl' }}
            letterSpacing="wider"
            color={open ? 'brand.dorado' : 'brand.amber'}
            cursor="pointer"
            transformOrigin={{ base: 'left center', md: 'center' }}
            transform={open ? 'scale(1.35)' : 'scale(1)'}
            transition="color 0.35s, transform 0.45s cubic-bezier(0.16,1,0.3,1)"
            _hover={{ color: 'brand.dorado' }}
            aria-label={`${playerData.displayName} — ir al inicio`}
          >
            {playerData.initials}
            <Box as="span" color={open ? 'brand.amber' : 'brand.gray2'}>_</Box>
          </Text>

          {/* CTA de contacto — bloque sólido, sin radius */}
          <Flex
            as="a"
            href="#contact"
            onClick={(e) => handleLink(e, '#contact')}
            gridColumn={3}
            gridRow={1}
            justifySelf="end"
            display={{ base: 'none', md: 'inline-flex' }}
            align="center"
            gap={3}
            px={{ base: 5, md: 4 }}
            py={{ base: 3, md: 2 }}
            bg="brand.amber"
            color="brand.brown"
            fontFamily="mono"
            fontSize={{ base: '11px', md: '12px' }}
            fontWeight="700"
            letterSpacing="0.16em"
            textTransform="uppercase"
            whiteSpace="nowrap"
            cursor="pointer"
            transition="background 0.25s, transform 0.25s"
            _hover={{ bg: 'brand.dorado', transform: 'translateY(-2px)' }}
            _focusVisible={{ outline: '2px solid', outlineColor: 'brand.dorado', outlineOffset: '4px' }}
          >
            Contacto
            <Box as={FiArrowUpRight} boxSize={4} aria-hidden="true" />
          </Flex>
        </Grid>

        <AnimatePresence>
          {open && (
            <NavbarMenuPanel links={navLinks} onNavigate={handleLink} reduce={reduce} />
          )}
        </AnimatePresence>
      </MotionBox>
    </>
  )
}
