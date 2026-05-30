import { useEffect, useRef, useState } from 'react'
import {
  Box, Grid, Text, Flex, VStack,
  Modal, ModalOverlay, ModalContent, ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import playerData from '../../data/playerData.js'
import useScrubReveal from '../../hooks/useScrubReveal.js'

gsap.registerPlugin(ScrollTrigger)

// ─── VIDEO CARD ──────────────────────────────────────────────────
function VideoCard({ video, index, onOpen }) {
  const cardRef = useRef(null)
  const videoRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
            end: 'top 55%',
            scrub: 1.2,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  // Tilt 3D effect
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(cardRef.current, {
      rotateY: x * 10,
      rotateX: -y * 10,
      duration: 0.3,
      ease: 'power2.out',
      transformPerspective: 1000,
    })
  }

  const handleMouseLeave = () => {
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power3.out',
    })
    setIsHovered(false)
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }

  return (
    <Box
      ref={cardRef}
      opacity={0}
      position="relative"
      overflow="hidden"
      cursor="none"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      onClick={() => onOpen(video)}
      data-cursor-hover
      sx={{
        '&:hover .video-overlay': { opacity: 1 },
        '&:hover .play-btn': { transform: 'translate(-50%, -50%) scale(1)' },
        '&:hover .card-meta': { transform: 'translateY(0)' },
      }}
    >
      {/* Aspect ratio box */}
      <Box paddingTop="56.25%" position="relative">
        {/* Thumbnail */}
        <Box
          position="absolute"
          inset="0"
          bg="#0D1520"
          overflow="hidden"
        >
          {/* Placeholder visual when no thumbnail */}
          <Box
            position="absolute"
            inset="0"
            bg={`linear-gradient(135deg, #0a1628 0%, #0057B8 100%)`}
            opacity={isHovered ? 0.3 : 0.6}
            transition="opacity 0.4s ease"
          />

          {/* Video preview (muted, short clip) */}
          <video
            ref={videoRef}
            src={video.previewSrc}
            muted
            loop
            playsInline
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.6s ease',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />

          {/* Gradient overlay */}
          <Box
            position="absolute"
            inset="0"
            bg="linear-gradient(to top, rgba(8,12,18,0.9) 0%, transparent 60%)"
          />
        </Box>

        {/* Play button */}
        <Box
          className="play-btn"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%) scale(0.8)"
          w="56px"
          h="56px"
          border="1.5px solid rgba(255,255,255,0.6)"
          borderRadius="50%"
          display="flex"
          align="center"
          justify="center"
          transition="transform 0.3s ease, border-color 0.3s ease"
          _hover={{ borderColor: 'white' }}
          zIndex={3}
        >
          <Box
            w="0"
            h="0"
            borderTop="9px solid transparent"
            borderBottom="9px solid transparent"
            borderLeft="16px solid white"
            ml="3px"
          />
        </Box>

        {/* Meta info */}
        <Box
          className="card-meta"
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          p={4}
          transform="translateY(8px)"
          transition="transform 0.3s ease"
          zIndex={3}
        >
          {/* Category pill */}
          <Box
            display="inline-flex"
            px={2}
            py={1}
            bg="rgba(0,87,184,0.8)"
            mb={2}
          >
            <Text
              fontFamily="'Barlow Condensed', sans-serif"
              fontSize="10px"
              fontWeight="700"
              letterSpacing="0.2em"
              textTransform="uppercase"
              color="white"
            >
              {video.category}
            </Text>
          </Box>

          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="16px"
            fontWeight="600"
            color="white"
            lineHeight="1.2"
            mb={1}
          >
            {video.title}
          </Text>

          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="12px"
            letterSpacing="0.1em"
            color="whiteAlpha.600"
          >
            {video.duration}
          </Text>
        </Box>

        {/* Corner accent */}
        <Box
          position="absolute"
          top="12px"
          right="12px"
          w="24px"
          h="24px"
          borderTop="1px solid rgba(0,87,184,0.6)"
          borderRight="1px solid rgba(0,87,184,0.6)"
          zIndex={4}
        />
        <Box
          position="absolute"
          bottom="12px"
          left="12px"
          w="24px"
          h="24px"
          borderBottom="1px solid rgba(0,87,184,0.6)"
          borderLeft="1px solid rgba(0,87,184,0.6)"
          zIndex={4}
        />
      </Box>
    </Box>
  )
}

// ─── VIDEO MODAL ─────────────────────────────────────────────────
function VideoModal({ video, isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
      <ModalOverlay bg="rgba(0,0,0,0.92)" backdropFilter="blur(8px)" />
      <ModalContent
        bg="#080C12"
        border="1px solid rgba(0,87,184,0.3)"
        borderRadius="0"
        overflow="hidden"
      >
        <ModalCloseButton
          color="white"
          size="lg"
          top={4}
          right={4}
          zIndex={10}
          _hover={{ bg: 'rgba(0,87,184,0.3)' }}
        />

        {video && (
          <Box>
            {/* Video player */}
            <Box paddingTop="56.25%" position="relative" bg="#000">
              <video
                key={video.id}
                src={video.src}
                controls
                autoPlay
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>

            {/* Info bar */}
            <Flex align="center" justify="space-between" px={6} py={4}
              borderTop="1px solid rgba(0,87,184,0.2)">
              <VStack align="flex-start" spacing={0}>
                <Text
                  fontFamily="'Barlow Condensed', sans-serif"
                  fontSize="10px"
                  fontWeight="700"
                  letterSpacing="0.2em"
                  textTransform="uppercase"
                  color="brand.blue"
                >
                  {video.category}
                </Text>
                <Text
                  fontFamily="'Bebas Neue', sans-serif"
                  fontSize="24px"
                  letterSpacing="0.04em"
                >
                  {video.title}
                </Text>
              </VStack>
              <Text
                fontFamily="'Barlow Condensed', sans-serif"
                fontSize="13px"
                color="whiteAlpha.500"
              >
                {video.duration}
              </Text>
            </Flex>
          </Box>
        )}
      </ModalContent>
    </Modal>
  )
}

// ─── MAIN VIDEOS SECTION ─────────────────────────────────────────
export default function VideosSection() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedVideo, setSelectedVideo] = useState(null)
  const sectionRef = useRef(null)
  const titleRef = useRef(null)

  const handleOpen = (video) => {
    setSelectedVideo(video)
    onOpen()
  }

  useScrubReveal(sectionRef, {
    elements: [
      { ref: titleRef, vars: { y: 0, opacity: 1 }, fromVars: { y: 50, opacity: 0 } },
    ],
    pin: false,
    start: 'top 85%',
    end: 'top 30%',
    scrub: 1,
  })

  return (
    <Box
      ref={sectionRef}
      as="section"
      id="videos"
      bg="#080C12"
      py={{ base: 20, md: 32 }}
      px={{ base: 6, md: 12, lg: 20 }}
      position="relative"
      overflow="hidden"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top="50%"
        right="-100px"
        transform="translateY(-50%)"
        w="500px"
        h="500px"
        bg="radial-gradient(ellipse, rgba(0,87,184,0.06) 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* Section header */}
      <Flex
        ref={titleRef}
        align="flex-end"
        justify="space-between"
        mb={{ base: 12, md: 16 }}
        flexWrap="wrap"
        gap={4}
      >
        <Box>
          <Text
            fontFamily="'Barlow Condensed', sans-serif"
            fontSize="11px"
            fontWeight="700"
            letterSpacing="0.3em"
            textTransform="uppercase"
            color="brand.blue"
            mb={3}
          >
            Highlights
          </Text>
          <Text
            fontFamily="'Bebas Neue', sans-serif"
            fontSize={{ base: '52px', md: '80px', lg: '100px' }}
            lineHeight="0.9"
            letterSpacing="0.02em"
          >
            En
            <Box as="span" color="brand.blue"> Acción</Box>
          </Text>
        </Box>

        <Text
          fontFamily="'Barlow', sans-serif"
          fontSize="14px"
          fontWeight="300"
          color="whiteAlpha.500"
          maxW="280px"
          lineHeight="1.6"
          pb={2}
        >
          Hacé click para ver el video completo.
        </Text>
      </Flex>

      {/* Videos grid */}
      <Grid
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
        gap={4}
      >
        {playerData.videos.map((video, i) => (
          <VideoCard
            key={video.id}
            video={video}
            index={i}
            onOpen={handleOpen}
          />
        ))}
      </Grid>

      {/* Video modal */}
      <VideoModal
        video={selectedVideo}
        isOpen={isOpen}
        onClose={onClose}
      />
    </Box>
  )
}
