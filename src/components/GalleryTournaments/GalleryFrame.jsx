import { forwardRef } from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'

/**
 * Contenedor común a ambas propuestas: mismo fondo, glows, fades laterales
 * y encabezado "FOTOS" que la galería actual. `meta` es el texto chico de
 * la derecha (contador o indicación). `fades` apaga los degradados laterales.
 */
export const GalleryFrame = forwardRef(function GalleryFrame({ meta, label, fades = true, children }, ref) {
  return (
    <Box
      ref={ref}
      as="section"
      id="gallery"
      aria-label={label}
      bg="#080C12"
      position="relative"
      overflow="hidden"
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      py={{ base: 16, md:20 }}
    >
      <Box position="absolute" top="0" right="-80px" w="500px" h="500px" pointerEvents="none" bg="radial-gradient(ellipse, rgba(0,87,184,0.07) 0%, transparent 70%)" />
      <Box position="absolute" bottom="10%" left="-80px" w="400px" h="400px" pointerEvents="none" bg="radial-gradient(ellipse, rgba(0,87,184,0.05) 0%, transparent 70%)" />
      {fades &&
        ['left', 'right'].map((side) => (
          <Box
            key={side}
            position="absolute"
            top={0}
            {...{ [side]: 0 }}
            h="100%"
            w={{ base: '24px', md: '80px' }}
            zIndex={4}
            pointerEvents="none"
            bg={`linear-gradient(to ${side === 'left' ? 'right' : 'left'}, #080C12 0%, rgba(8,12,18,0) 100%)`}
          />
        ))}

      <Flex px={{ base: 6, md: 12, lg: 20 }} mb={{ base: 8, md: 16 }} position="relative" zIndex={5} justify="space-between" align="flex-end" gap={4}>
        <Box data-gallery-header>
          <Text fontFamily="heading" fontSize={{ base: '10px', md: '11px', lg: '12px' }} letterSpacing="0.36em" textTransform="uppercase" color="brand.bone" mb={2}>
            Galería
          </Text>
          <Text as="h2" fontFamily="heading" textTransform="uppercase" fontWeight="medium" fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} lineHeight="0.9" letterSpacing="0.02em">
            FO
            <Box as="span" color="brand.blue">
              TOS
            </Box>
          </Text>
        </Box>
        <Text fontFamily="condensed" fontSize="11px" fontWeight="700" letterSpacing="0.24em" textTransform="uppercase" color="rgba(255,255,255,0.3)" whiteSpace="nowrap" aria-live="polite">
          {meta}
        </Text>
      </Flex>

      {children}
    </Box>
  )
})

export default GalleryFrame
