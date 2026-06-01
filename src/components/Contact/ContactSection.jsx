import { useRef } from 'react'
import { Box, Grid, Text, Flex, Icon } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import playerData from '../../data/playerData.js'
import useScrubReveal from '../../hooks/useScrubReveal.js'

gsap.registerPlugin(ScrollTrigger)

const WHATSAPP_NUMBER = '5491100000000' // reemplazar por número real


export default function ContactSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const ctaRef = useRef(null)
  const ledsRef = useRef(null)
  const socialRef = useRef(null)

  useScrubReveal(sectionRef, {
    elements: [
      { ref: titleRef, vars: { y: 0, opacity: 1 }, fromVars: { y: 50, opacity: 0 } },
      { ref: ctaRef, vars: { y: 0, opacity: 1 }, fromVars: { y: 40, opacity: 0 }, position: '-=0.3' },
      { ref: ledsRef, vars: { y: 0, opacity: 1 }, fromVars: { y: 30, opacity: 0 }, position: '-=0.2' },
      { ref: socialRef, vars: { y: 0, opacity: 1 }, fromVars: { y: 30, opacity: 0 }, position: '-=0.2' },
    ],
    pin: false,
    start: 'top 85%',
    end: 'top 25%',
    scrub: 1,
  })

  return (
    <Box
      ref={sectionRef}
      as="section"
      id="contact"
      bg="#080C12"
      py={{ base: 20, md: 32 }}
      px={{ base: 6, md: 12, lg: 20 }}
      position="relative"
      overflow="hidden"
    >
      <Box position="relative" zIndex={1}>

        {/* Title */}
        <Box ref={titleRef} mb={{ base: 12, md: 20 }}>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="11px"
            fontWeight="700"
            letterSpacing="0.3em"
            textTransform="uppercase"
            color="brand.blue"
            mb={3}
          >
            # REDES
          </Text>
          <Text
            fontFamily="'Bebas Neue', sans-serif"
            fontSize={{ base: '52px', md: '80px', lg: '100px' }}
            lineHeight="0.9"
            letterSpacing="0.02em"
          >
            CONT<Box as="span" color="brand.blue">ACTO</Box>
          </Text>
        </Box>

        {/* Social media */}
        <Box ref={socialRef} opacity={0} mb={4}>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="10px"
            fontWeight="700"
            letterSpacing="0.25em"
            textTransform="uppercase"
            color="whiteAlpha.300"
            mb={4}
          >
            Redes Sociales
          </Text>
          <Grid templateColumns={{ base: '1fr', sm: '1fr' }} gap={4}>
            {playerData.socialMedia && playerData.socialMedia.map((social) => (
              <Box
                key={social.label}
                as="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                role="group"
                position="relative"
                overflow="hidden"
                p={{ base: 8, md: 10}}
                border="1px solid rgba(255,255,255,0.06)"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                transition="all 0.3s ease"
                _hover={{ borderColor: 'rgba(0,87,184,0.4)', bg: 'rgba(0,87,184,0.08)' }}
              >
                  {/* Background icon watermark — color tints to platform color on hover */}
                  {social.icon && (
                    <Icon
                      as={social.icon}
                      position="absolute"
                      right="-5%"
                      top="50%"
                      transform="translateY(-50%)"
                      fontSize={{ base: '160px', md: '230px' }}
                      color="whiteAlpha.50"
                      zIndex={0}
                      pointerEvents="none"
                      userSelect="none"
                      aria-hidden
                      transition="color 0.4s ease"
                      _groupHover={{ color: social.hoverColor }}
                    />
                  )}
                  
                {/* Text content — above the watermark icon */}
                <Box position="relative" zIndex={1}>
                  <Text
                    fontFamily="'Barlow Condensed', sans-serif"
                    fontSize="10px"
                    fontWeight="700"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    color="whiteAlpha.400"
                    mb={1}
                  >
                    {social.label}
                  </Text>
                  <Text
                    fontFamily="'Bebas Neue', sans-serif"
                    fontSize={{ base: '32px', md: '42px' }}
                    lineHeight="1"
                    letterSpacing="0.02em"
                    color="white"
                    mb={3}
                  >
                    {social.label}
                  </Text>
                  <Text
                    fontFamily="'Barlow Condensed', sans-serif"
                    fontSize={{ base: '13px', md: '14px' }}
                    fontWeight="500"
                    color="whiteAlpha.600"
                    letterSpacing="0.03em"
                  >
                    {social.handle}
                  </Text>
                </Box>
                <Text position="relative" zIndex={1} color="brand.blue" fontSize="18px">→</Text>
              </Box>
            ))}
          </Grid>
        </Box>

        {/* Email + WhatsApp CTAs */}
        <Box ref={ctaRef} opacity={0} mb={4}>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
            {playerData.contact && playerData.contact.map((contact) => (
              <Box
                key={contact.label}
                as="a"
                href={contact.url}
                target="_blank"
                rel="noopener noreferrer"
                role="group"
                position="relative"
                overflow="hidden"
                p={5}
                border="1px solid rgba(255,255,255,0.06)"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                transition="all 0.3s ease"
                _hover={{ borderColor: 'rgba(0,87,184,0.4)', bg: 'rgba(0,87,184,0.08)' }}
              >
                  {/* Background icon watermark — color tints to platform color on hover */}
                  {contact.icon && (
                    <Icon
                      as={contact.icon}
                      position="absolute"
                      right="-5%"
                      top="50%"
                      transform="translateY(-50%)"
                      fontSize={{ base: '160px', md: '200px' }}
                      color="whiteAlpha.50"
                      zIndex={0}
                      pointerEvents="none"
                      userSelect="none"
                      aria-hidden
                      transition="color 0.4s ease"
                      _groupHover={{ color: contact.hoverColor }}
                    />
                  )}
                  
                {/* Text content — above the watermark icon */}
                <Box position="relative" zIndex={1}>
                  <Text
                    fontFamily="'Barlow Condensed', sans-serif"
                    fontSize="10px"
                    fontWeight="700"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    color="whiteAlpha.400"
                    mb={1}
                  >
                    {contact.title}
                  </Text>
                  <Text
                    fontFamily="'Bebas Neue', sans-serif"
                    fontSize={{ base: '32px', md: '42px' }}
                    lineHeight="1"
                    letterSpacing="0.02em"
                    color="white"
                    mb={3}
                  >
                    {contact.label}
                  </Text>
                  <Text
                    fontFamily="'Barlow Condensed', sans-serif"
                    fontSize={{ base: '13px', md: '14px' }}
                    fontWeight="500"
                    color="whiteAlpha.600"
                    letterSpacing="0.03em"
                  >
                    {contact.handle}
                  </Text>
                </Box>
                <Text position="relative" zIndex={1} color="brand.blue" fontSize="18px">→</Text>
              </Box> 
            ))}
          </Grid>
        </Box>

        {/* LEDSPORTS — Representante de Marketing Deportivo */}
        <Box ref={ledsRef} opacity={0} mb={4}>
          <Box
            as="a"
            href="https://www.instagram.com/_ledsports/"
            target="_blank"
            rel="noopener noreferrer"
            p={{ base: 8, md: 10 }}
            border="1px solid rgba(201,168,76,0.18)"
            display="flex"
            flexDirection={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ base: 'flex-start', md: 'center' }}
            gap={{ base: 6, md: 0 }}
            transition="all 0.4s ease"
            position="relative"
            overflow="hidden"
            _hover={{ borderColor: 'rgba(201,168,76,0.42)', bg: 'rgba(201,168,76,0.04)' }}
          >
            {/* Gold accent bar */}
            <Box position="absolute" left={0} top={0} bottom={0} w="2px" bg="brand.gold" />

            <Box>
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="10px"
                fontWeight="700"
                letterSpacing="0.3em"
                textTransform="uppercase"
                color="brand.gold"
                mb={3}
              >
                Representante de Marketing
              </Text>
              <Text
                fontFamily="'Bebas Neue', sans-serif"
                fontSize={{ base: '36px', md: '56px' }}
                lineHeight="0.9"
                letterSpacing="0.02em"
                color="white"
              >
                LEDSPORTS
              </Text>
              
            </Box>
            <Text color="brand.gold" fontSize="20px" lineHeight="1">→</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
