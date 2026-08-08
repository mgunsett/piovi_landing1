import { useRef, useEffect, useState } from 'react'
import { Box, Flex, Text, AspectRatio } from '@chakra-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { playerData } from '../../data/playerData'
import useScrubReveal from '../../hooks/useScrubReveal'
import { VideoCard } from './VideoCard'

gsap.registerPlugin(ScrollTrigger)

const MotionBox = motion(Box)

export default function VideosSection() {
  const videos = playerData.videos

  const ghostRef = useRef(null)
  const wrapRef = useRef(null)
  const sliderRef = useRef(null)

  const [active, setActive] = useState(0)
  const [openVideo, setOpenVideo] = useState(null)

  const sectionRef = useRef(null)
  const headerRef = useRef(null)

  useScrubReveal(sectionRef, {
    elements: [{ ref: headerRef, fromVars: { y: 50, opacity: 0 }, vars: { y: 0, opacity: 1 } }],
    start: 'top 80%',
    end: 'top 40%',
  })

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%', once: true },
        }
      )

      const cards = gsap.utils.toArray('.video-card', wrapRef.current)
      if (reduced) {
        gsap.set(cards, { autoAlpha: 1, y: 0 })
      } else {
        gsap.fromTo(
          cards,
          { y: 55, autoAlpha: 0, rotateX: 6, transformPerspective: 1200 },
          {
            y: 0,
            autoAlpha: 1,
            rotateX: 0,
            duration: 1.1,
            ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: wrapRef.current, start: 'top 82%', once: true },
          }
        )
      }

      if (!reduced && ghostRef.current) {
        gsap.to(ghostRef.current, {
          yPercent: -18,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!openVideo) return
    const onKey = (e) => e.key === 'Escape' && setOpenVideo(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [openVideo])

  // slider mobile: detectar card activa según el scroll
  const handleScroll = () => {
    const el = sliderRef.current
    if (!el || !el.children.length) return
    const style = getComputedStyle(el)
    const gap = parseFloat(style.columnGap || style.gap || '0') || 0
    const itemW = el.children[0].offsetWidth + gap
    if (!itemW) return
    setActive(Math.round(el.scrollLeft / itemW))
  }

  const goTo = (i) => {
    const el = sliderRef.current
    el?.children[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  if (!videos.length) return null

  return (
    <Box
      as="section"
      id="videos"
      ref={sectionRef}
      position="relative"
      minH="100vh"
      bg="brand.dark"
      px={{ base: 2, md: 12, lg: 40 }}
      pt={{ base: 20, md: '10%' }}
      pb={{ base: 12, md: '10%' }}
      overflow="hidden"
    >
      {/* glows ambientales */}
      <Box
        position="absolute"
        top={{ base: '10%', md: '-5%' }}
        right="-12%"
        w="55vw"
        h="55vw"
        background="radial-gradient(ellipse, #0A1834 0%, transparent 70%)"
        pointerEvents="none"
      />

      {/* número fantasma gigante (dorsal) */}
      <Text
        ref={ghostRef}
        aria-hidden
        position="absolute"
        top={{ base: '10%', md: '12%' }}
        right={{ base: '-15%', md: '2%' }}
        fontFamily="heading"
        fontSize={{ base: '80vw', md: '40vw' }}
        lineHeight={0.8}
        color="transparent"
        pointerEvents="none"
        userSelect="none"
        zIndex={0}
        sx={{ WebkitTextStroke: '1.5px #e52b4444' }}
      >
        {playerData.number}
      </Text>

      <Box maxW="1240px" mx="auto" position="relative" zIndex={1}>
        {/* ── Header ── */}
        <Flex direction="column" align="flex-start" justify="flex-start" ref={headerRef} mb={{ base: 8, md: 12 }} ml={{ base: 0, md: '-30px', lg: '-90px' }}>
          <Text fontFamily='heading' fontSize="10px" color="brand.bone" textTransform="uppercase" letterSpacing="widest">
            HIGHLIGHTS
          </Text>
          <Text as="h2" fontFamily='heading' textTransform="uppercase" fontWeight="medium" fontSize={{ base: '4xl',md:'5xl', lg: '6xl' }} color="brand.bone" lineHeight={1}>
            Vid<Box as="span" color="brand.blue">eos </Box>
          </Text>
        </Flex>

        {/* ── Cards ── */}
        <Box ref={wrapRef} position="relative" ml={{ base: 2, md: '0'}}>
          {/* Desktop: en fila */}
          <Flex display={{ base: 'none', md: 'flex' }} justify="center" align="stretch" gap={{ md: 5, lg: 12 }}>
            {videos.map((v, i) => (
              <Box key={v.id} flex="1 1 0" maxW={{ md: '300px', lg: '340px' }}>
                <VideoCard video={v} index={i} onOpen={setOpenVideo} />
              </Box>
            ))}
          </Flex>

          {/* Mobile: slider con swipe */}
          <Box display={{ base: 'block', md: 'none' }}>
            <Flex
              ref={sliderRef}
              onScroll={handleScroll}
              overflowX="auto"
              scrollSnapType="x mandatory"
              bg="transparent"
              gap={4}
              px="0%"
              sx={{
                scrollbarWidth: 'none',
                '::-webkit-scrollbar': { display: 'none' },
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {videos.map((v, i) => (
                <Box key={v.id} flex="0 0 82%" scrollSnapAlign="center">
                  <VideoCard video={v} index={i} onOpen={setOpenVideo} />
                </Box>
              ))}
            </Flex>

            {/* flechas indicadoras */}
            <Flex justify="center" align="center" gap={5} mt={6}>
              <Box
                as="button"
                aria-label="Video anterior"
                onClick={() => goTo(active - 1)}
                isDisabled={active === 0}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={active === 0 ? 'whiteAlpha.300' : 'brand.amber'}
                pointerEvents={active === 0 ? 'none' : 'auto'}
                transition="color 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)"
                _active={{ transform: 'translateX(-3px)' }}
              >
                <Box as={FiChevronLeft} fontSize="22px" />
              </Box>

              <Text fontFamily="mono" fontSize="11px" color="whiteAlpha.700" letterSpacing="wider" minW="42px" textAlign="center">
                {String(active + 1).padStart(2, '0')} / {String(videos.length).padStart(2, '0')}
              </Text>

              <Box
                as="button"
                aria-label="Video siguiente"
                onClick={() => goTo(active + 1)}
                isDisabled={active === videos.length - 1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                color={active === videos.length - 1 ? 'whiteAlpha.300' : 'brand.amber'}
                pointerEvents={active === videos.length - 1 ? 'none' : 'auto'}
                transition="color 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1)"
                _active={{ transform: 'translateX(3px)' }}
              >
                <Box as={FiChevronRight} fontSize="22px" />
              </Box>
            </Flex>
          </Box>
        </Box>
      </Box>

      {/* ── Modal fullscreen (embed de Instagram) ── */}
      <AnimatePresence>
        {openVideo && (
          <MotionBox
            position="fixed"
            inset={0}
            zIndex={2000}
            bg="rgba(3,6,10,0.95)"
            backdropFilter="blur(12px)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={{ base: 4, md: 12 }}
            onClick={() => setOpenVideo(null)}
          >
            <Box
              as="button"
              position="absolute"
              top={{ base: 16, md: 14 }}
              right={{ base: 4, md: 60 }}
              zIndex={2100}
              aria-label="Cerrar video"
              borderRadius="full"
              p={1}
              bg="brand.bgRef"
              backdropFilter="blur(10px)"
              color="white"
              onClick={() => setOpenVideo(null)}
              transition="color 0.3s ease, transform 0.3s ease"
              _hover={{ color: 'brand.gray2', transform: 'rotate(90deg)' }}
            >
              <Box as={FiX} fontSize="32px" />
            </Box>
            <MotionBox
              w="100%"
              maxW={{ base: '100%', md: '420px' }}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              boxShadow="0 40px 120px rgba(0,0,0,0.7)"
              borderRadius="16px"
              overflow="hidden"
              bg="#000"
              mt={{ base: 0, md: '5%' }}
            >
              <AspectRatio ratio={{ base: 9 / 16, md: 9 / 15 }}>
                <Box
                  as="iframe"
                  src={`https://www.instagram.com/reel/${openVideo.instagramId}/embed`}
                  title={openVideo.fullTitle}
                  border="none"
                  scrolling="no"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  w="100%"
                  h="100%"
                />
              </AspectRatio>
            </MotionBox>
          </MotionBox>
        )}
      </AnimatePresence>
    </Box>
  )
}
