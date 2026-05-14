import { Box, Flex, Text, HStack } from '@chakra-ui/react'

export default function Footer() {
  return (
    <Box
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
