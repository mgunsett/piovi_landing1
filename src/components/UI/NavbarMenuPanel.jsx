import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'

const MotionBox = motion(Box)

const EASE = [0.16, 1, 0.3, 1]

export function NavbarMenuPanel({ links, onNavigate, reduce }) {
  const cells = [...links, { label: 'Contacto', href: '#contact' }]

  return (
    <MotionBox
      id="nav-menu-panel"
      initial={{ height: 0, opacity: reduce ? 1 : 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: reduce ? 1 : 0 }}
      transition={{ duration: reduce ? 0 : 0.55, ease: EASE }}
      overflow="hidden"
      bg="brand.brown"
      borderTop="1px solid"
      borderColor="brand.amberLight"
      boxShadow="0 24px 60px rgba(0,0,0,0.35)"
    >
      <Box
        maxH={{ base: 'calc(100dvh - 62px)', lg: 'calc(100dvh - 84px)' }}
        overflowY="auto"
      >
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap="1px"
          bg="brand.amberLight"
        >
          {cells.map((link, i) => {
            const spanFull = i === cells.length - 1 && cells.length % 2 !== 0
            return (
              <MotionBox
                key={link.href}
                initial={{ opacity: 0, y: reduce ? 0 : 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.5,
                  delay: reduce ? 0 : 0.12 + i * 0.06,
                  ease: EASE,
                }}
                gridColumn={{ base: 'auto', md: spanFull ? 'span 2' : 'auto' }}
                bg="brand.brown"
              >
                <Flex
                  as="a"
                  href={link.href}
                  onClick={(e) => onNavigate(e, link.href)}
                  align="center"
                  gap={{ base: 4, md: 6 }}
                  w="full"
                  h="full"
                  py={{ base: 6, md: 9, lg: 11 }}
                  px={{ base: 6, md: 10, lg: 14 }}
                  cursor="pointer"
                  position="relative"
                  overflow="hidden"
                  transition="background 0.3s ease"
                  _hover={{ bg: 'brand.bgRef' }}
                  _focusVisible={{ bg: 'brand.bgRef', outline: '2px solid', outlineColor: 'brand.dorado', outlineOffset: '-2px' }}
                  sx={{
                    '&:hover .cell-num, &:focus-visible .cell-num': { color: 'brand.dorado' },
                    '&:hover .cell-label, &:focus-visible .cell-label': {
                      color: 'brand.dorado',
                      transform: 'translateX(8px)',
                    },
                    '&:hover .cell-arrow, &:focus-visible .cell-arrow': {
                      opacity: 1,
                      transform: 'translate(0, 0)',
                    },
                  }}
                >
                  <Text
                    className="cell-num"
                    fontFamily="mono"
                    fontSize={{ base: '11px', md: '12px' }}
                    fontWeight="700"
                    letterSpacing="0.18em"
                    color="brand.gray2"
                    transition="color 0.25s"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </Text>

                  <Text
                    className="cell-label"
                    fontFamily="heading"
                    fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                    lineHeight={1.05}
                    letterSpacing="-0.01em"
                    color="brand.amber"
                    transition="color 0.25s, transform 0.35s"
                    transformOrigin="left center"
                  >
                    {link.label}
                  </Text>

                  <Box
                    as={FiArrowUpRight}
                    className="cell-arrow"
                    ml="auto"
                    boxSize={{ base: 5, md: 7 }}
                    color="brand.dorado"
                    opacity={0}
                    transform="translate(-8px, 8px)"
                    transition="opacity 0.3s, transform 0.3s"
                    aria-hidden="true"
                  />
                </Flex>
              </MotionBox>
            )
          })}
        </Grid>
      </Box>
    </MotionBox>
  )
}
