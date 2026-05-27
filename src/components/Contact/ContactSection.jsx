import { useEffect, useRef, useState } from 'react'
import {
  Box, Flex, Grid, Text, VStack, Input, Textarea, Button,
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import useScrubReveal from '../../hooks/useScrubReveal.js'

gsap.registerPlugin(ScrollTrigger)

const socialLinks = [
  { label: 'Instagram', handle: '@gonzapiovi', url: 'https://instagram.com/gonzapiovi' },
  { label: 'Twitter / X',handle: '@gonzapiovi', url: 'https://twitter.com/gonzapiovi' },
  { label: 'TikTok',   handle: '@gonzapiovi', url: 'https://tiktok.com/@gonzapiovi' },
]

export default function ContactSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const formRef = useRef(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    gsap.fromTo('.success-msg',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' }
    )
  }

  useScrubReveal(sectionRef, {
    elements: [
      { ref: titleRef, vars: { y: 0, opacity: 1 }, fromVars: { y: 50, opacity: 0 } },
      { ref: formRef, vars: { y: 0, opacity: 1 }, fromVars: { y: 40, opacity: 0 }, position: '-=0.3' },
    ],
    pin: false,
    start: 'top 85%',
    end: 'top 25%',
    scrub: 1,
  })

  const inputStyle = {
    bg: 'transparent',
    border: '1px solid',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: '0',
    color: 'white',
    fontFamily: "'Barlow', sans-serif",
    fontSize: '14px',
    py: 6,
    px: 4,
    _placeholder: { color: 'whiteAlpha.400', fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '0.1em', fontSize: '13px', textTransform: 'uppercase' },
    _focus: { borderColor: 'brand.blue', boxShadow: 'none', outline: 'none' },
    _hover: { borderColor: 'rgba(255,255,255,0.2)' },
  }

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
      {/* Big background text */}
      <Text
        position="absolute"
        bottom="-40px"
        left="50%"
        transform="translateX(-50%)"
        fontFamily="'Bebas Neue', sans-serif"
        fontSize={{ base: '20vw', md: '16vw' }}
        color="transparent"
        sx={{ WebkitTextStroke: '1px rgba(255,255,255,0.03)' }}
        whiteSpace="nowrap"
        userSelect="none"
        zIndex={0}
        pointerEvents="none"
      >
        CONTACTO
      </Text>

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
            Representación & Consultas
          </Text>
          <Text
            fontFamily="'Bebas Neue', sans-serif"
            fontSize={{ base: '52px', md: '80px', lg: '100px' }}
            lineHeight="0.9"
            letterSpacing="0.02em"
          >
            Hablemos
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={16}>
          {/* Form */}
          <Box ref={formRef} opacity={0}>
            {!sent ? (
              <VStack as="form" onSubmit={handleSubmit} spacing={4} align="stretch">
                <Grid templateColumns="1fr 1fr" gap={4}>
                  <Input {...inputStyle} placeholder="Nombre" required />
                  <Input {...inputStyle} placeholder="Empresa / Medio" />
                </Grid>
                <Input {...inputStyle} type="email" placeholder="Email" required />
                <Input {...inputStyle} placeholder="Asunto" />
                <Textarea
                  {...inputStyle}
                  placeholder="Mensaje"
                  rows={5}
                  resize="none"
                  required
                />
                <Box>
                  <Button
                    type="submit"
                    bg="transparent"
                    border="1px solid"
                    borderColor="brand.blue"
                    color="white"
                    fontFamily="'Barlow Condensed', sans-serif"
                    fontWeight="700"
                    fontSize="13px"
                    letterSpacing="0.2em"
                    textTransform="uppercase"
                    px={10}
                    py={6}
                    borderRadius="0"
                    cursor="none"
                    _hover={{ bg: 'brand.blue' }}
                    transition="all 0.3s ease"
                    data-cursor-hover
                  >
                    Enviar mensaje →
                  </Button>
                </Box>
              </VStack>
            ) : (
              <Box
                className="success-msg"
                p={10}
                border="1px solid rgba(0,87,184,0.4)"
                opacity={0}
              >
                <Text
                  fontFamily="'Bebas Neue', sans-serif"
                  fontSize="36px"
                  color="brand.blue"
                  mb={2}
                >
                  ¡Mensaje enviado!
                </Text>
                <Text
                  fontFamily="'Barlow', sans-serif"
                  fontSize="14px"
                  color="whiteAlpha.600"
                >
                  Nos pondremos en contacto a la brevedad. Gracias.
                </Text>
              </Box>
            )}
          </Box>

          {/* Info lateral */}
          <VStack align="flex-start" spacing={10}>
            {/* Contact info */}
            <Box>
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="10px"
                fontWeight="700"
                letterSpacing="0.25em"
                textTransform="uppercase"
                color="whiteAlpha.400"
                mb={4}
              >
                Representante
              </Text>
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="16px"
                fontWeight="600"
                color="white"
                mb={1}
              >
                contacto@gonzalopiovi.com
              </Text>
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="14px"
                color="whiteAlpha.500"
              >
                Respuesta en menos de 48hs
              </Text>
            </Box>

            {/* Social media */}
            <Box w="100%">
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="10px"
                fontWeight="700"
                letterSpacing="0.25em"
                textTransform="uppercase"
                color="whiteAlpha.400"
                mb={4}
              >
                Redes Sociales
              </Text>
              <VStack spacing={2} align="stretch">
                {socialLinks.map((social) => (
                  <Box
                    key={social.label}
                    as="a"
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    p={4}
                    border="1px solid rgba(255,255,255,0.06)"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    cursor="none"
                    data-cursor-hover
                    transition="all 0.3s ease"
                    _hover={{
                      borderColor: 'rgba(0,87,184,0.4)',
                      bg: 'rgba(0,87,184,0.08)',
                    }}
                  >
                    <Box>
                      <Text
                        fontFamily="'Barlow Condensed', sans-serif"
                        fontSize="11px"
                        fontWeight="700"
                        letterSpacing="0.15em"
                        textTransform="uppercase"
                        color="whiteAlpha.500"
                        mb={0.5}
                      >
                        {social.label}
                      </Text>
                      <Text
                        fontFamily="'Barlow Condensed', sans-serif"
                        fontSize="16px"
                        fontWeight="600"
                        color="white"
                      >
                        {social.handle}
                      </Text>
                    </Box>
                    <Text color="brand.blue" fontSize="18px">→</Text>
                  </Box>
                ))}
              </VStack>
            </Box>
          </VStack>
        </Grid>
      </Box>
    </Box>
  )
}
