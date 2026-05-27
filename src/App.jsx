import { useEffect, useRef } from 'react'
import { Box, Image } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Images
import piovi3 from './assets/piovi3.png'
import piovi4 from './assets/piovi4.png'

// UI
import CustomCursor from './components/UI/CustomCursor'
import Navbar from './components/UI/Navbar'
import Footer from './components/UI/Footer'

// Sections
import Hero from './components/Hero/Hero'
import CinematicTransition from './components/Transition/CinematicTransition'
import StatsSection from './components/Stats/StatsSection'
import GallerySection from './components/Gallery/GallerySection'
import VideosSection from './components/Videos/VideosSection'
import PressSection from './components/Press/PressSection'
import ContactSection from './components/Contact/ContactSection'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const sharedContainerRef = useRef(null)
  const img4Ref = useRef(null) // piovi4 — Hero
  const img3Ref = useRef(null) // piovi3 — CinematicTransition

  useEffect(() => {
    ScrollTrigger.config({ limitCallbacks: true })

    const container = sharedContainerRef.current
    const img4 = img4Ref.current
    const img3 = img3Ref.current

    if (!container || !img4 || !img3) return

    const mm = gsap.matchMedia()

    const buildTimelines = ({
      startBottom,
      enterBottom,
      centerBottom,
      exitBottom,
      downScale,
      growScale,
      exitScale,
    }) => {
      // ── Initial states ──────────────────────────────────────────
      gsap.set(container, {
        autoAlpha: 1,
        scale: 1,
        bottom: startBottom,
      })
      gsap.set(img4, { opacity: 1 })
      gsap.set(img3, { opacity: 0 })

      // ── Main movement timeline: Hero top → CinematicTransition end ──
      // Total scroll: ~100vh (hero) + ~250vh (cinematic) = ~350vh
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          endTrigger: '#cinematic-transition-outer',
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.9,
        },
      })

      // Phase 1 (0–0.22): Hero scroll — slight rise + shrink
      tl.to(container, {
        bottom: enterBottom,
        scale: downScale,
        duration: 0.22,
        ease: 'none',
      })

      // Phase 2 (0.22–0.57): Cinematic entry — image comes forward + grows
      tl.to(container, {
        bottom: centerBottom,
        scale: growScale,
        duration: 0.35,
        ease: 'none',
      })

      // Phase 3 (0.57–0.85): Cinematic middle — subtle zoom as text appears
      tl.to(container, {
        scale: growScale + 0.012,
        duration: 0.28,
        ease: 'none',
      })

      // Phase 4 (0.85–0.93): Begin exit — shrink and rise
      tl.to(container, {
        bottom: exitBottom,
        scale: exitScale,
        duration: 0.08,
        ease: 'none',
      })

      // Phase 5 (0.93–1.0): Fade out as StatsSection approaches
      tl.to(container, {
        autoAlpha: 0,
        duration: 0.07,
        ease: 'none',
      })

      // ── Crossfade: piovi4 → piovi3 as Hero scrolls away ──────────
      // Starts when Hero bottom is 75% down the viewport, ends when fully off
      const crossfadeTL = gsap.timeline({
        scrollTrigger: {
          trigger: '#hero',
          start: 'bottom 75%',
          end: 'bottom top',
          scrub: 0.9,
        },
      })
      crossfadeTL.to(img4, { opacity: 0, ease: 'none' }, 0)
      crossfadeTL.to(img3, { opacity: 1, ease: 'none' }, 0)
    }

    mm.add('(max-width: 767px)', () => {
      buildTimelines({
        startBottom: '2vh',
        enterBottom: '8vh',
        centerBottom: '8vh',
        exitBottom: '8vh',
        downScale: 0.94,
        growScale: 1.02,
        exitScale: 1.02,
      })
    })

    mm.add('(min-width: 768px)', () => {
      buildTimelines({
        startBottom: '0vh',
        enterBottom: '10vh',
        centerBottom: '10vh',
        exitBottom: '10vh',
        downScale: 0.95,
        growScale: 1.03,
        exitScale: 1.03,
      })
    })

    ScrollTrigger.refresh()

    return () => {
      mm.revert()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <Box bg="#080C12" minH="100vh" position="relative">
      <CustomCursor />

      {/* ── Shared floating player image ──────────────────────────── */}
      {/* Two images stacked — piovi4 visible in Hero, piovi3 in Cinematic.
          They cross-fade during scroll so the swap is imperceptible.       */}
      <Box
        ref={sharedContainerRef}
        position="fixed"
        left="50%"
        bottom={{ base: '2vh', md: '0vh' }}
        transform="translateX(-50%)"
        zIndex={8}
        pointerEvents="none"
        w={{ base: '66vw', sm: '56vw', md: '38vw', lg: '32vw', xl: '29vw' }}
        maxW={{ base: '300px', md: '390px', lg: '440px' }}
      >
        {/* Invisible spacer — maintains container height via natural image dimensions */}
        <Image
          src={piovi4}
          alt=""
          width="100%"
          height="auto"
          objectFit="contain"
          visibility="hidden"
          display="block"
          aria-hidden="true"
        />

        {/* piovi4 — shown during Hero */}
        {/* bottom-anchored so the player's feet always sit at the
            container's bottom edge regardless of aspect ratio        */}
        <Box ref={img4Ref} position="absolute" bottom="0" left="0" right="0">
          <Image
            src={piovi4}
            alt="Gonzalo Piovi"
            width="100%"
            height="auto"
            objectFit="contain"
            filter="drop-shadow(0 6px 18px rgba(0,0,0,0.75)) drop-shadow(0 0 28px rgba(0,87,184,0.55)) drop-shadow(0 0 60px rgba(0,87,184,0.2))"
            display="block"
          />
        </Box>

        {/* piovi3 — shown during CinematicTransition (cross-fades in) */}
        <Box ref={img3Ref} position="absolute" bottom="0" left="0" right="0" opacity={0}>
          <Image
            src={piovi3}
            alt="Gonzalo Piovi"
            width="100%"
            height="auto"
            objectFit="contain"
            filter="drop-shadow(0 6px 18px rgba(0,0,0,0.6)) drop-shadow(0 0 28px rgba(0,87,184,0.45)) drop-shadow(0 0 60px rgba(0,87,184,0.18))"
            display="block"
          />
        </Box>
      </Box>

      <Navbar />
      <Hero playerImage={piovi4} hidePlayerImage />
      <CinematicTransition playerImage={piovi3} useSharedImage />
      <StatsSection />
      <GallerySection />
      <VideosSection />
      <PressSection />
      <ContactSection />
      <Footer />
    </Box>
  )
}
