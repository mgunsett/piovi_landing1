import { useEffect, useRef } from 'react'
import { Box, Image } from '@chakra-ui/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
import playerData from './data/playerData'

const PLAYER_IMAGE = playerData.image

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const sharedImageRef = useRef(null)

  useEffect(() => {
    // GSAP ScrollTrigger global config
    ScrollTrigger.config({ limitCallbacks: true })

    // Custom cursor — reaplicar sobre elementos dinámicos
    const updateCursorListeners = () => {
      const targets = document.querySelectorAll('a, button, [data-cursor-hover]')
      targets.forEach((el) => {
        const cursor = document.querySelector('.cursor')
        const follower = document.querySelector('.cursor-follower')
        if (!cursor || !follower) return

        el.addEventListener('mouseenter', () => {
          cursor.classList.add('hover')
          follower.classList.add('hover')
        })
        el.addEventListener('mouseleave', () => {
          cursor.classList.remove('hover')
          follower.classList.remove('hover')
        })
      })
    }

    const timer = setTimeout(updateCursorListeners, 500)

    const sharedImage = sharedImageRef.current

    if (sharedImage) {
      const mm = gsap.matchMedia()

      const buildSharedImageTimeline = ({
        startBottom,
        enterBottom,
        centerBottom,
        exitBottom,
        downScale,
        growScale,
        exitScale,
      }) => {
        gsap.set(sharedImage, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          bottom: startBottom,
        })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '#hero',
            endTrigger: '#cinematic-transition',
            start: 'top top',
            end: 'bottom -110%',
            scrub: 0.9,
          },
        })

        // 1) Baja desde Hero y se achica apenas
        tl.to(sharedImage, {
          bottom: enterBottom,
          scale: downScale,
          duration: 0.3,
          ease: 'none',
        })

        // 2) En cinematic recupera y supera levemente el tamaño para dar sensación de empuje
        tl.to(sharedImage, {
          bottom: centerBottom,
          scale: growScale,
          duration: 0.46,
          ease: 'none',
        })

        // 3) Al final vuelve a encogerse, manteniéndose visible casi todo el recorrido
        tl.to(sharedImage, {
          bottom: exitBottom,
          scale: exitScale,
          duration: 0.16,
          ease: 'none',
        })

        // 4) Fade out en el tramo final real del componente
        tl.to(sharedImage, {
          autoAlpha: 0,
          duration: 0.08,
          ease: 'none',
        })
      }

      mm.add('(max-width: 767px)', () => {
        buildSharedImageTimeline({
          startBottom: '2vh',
          enterBottom: '13vh',
          centerBottom: '7vh',
          exitBottom: '14vh',
          downScale: 0.9,
          growScale: 1.02,
          exitScale: 0.88,
        })
      })

      mm.add('(min-width: 768px)', () => {
        buildSharedImageTimeline({
          startBottom: '0vh',
          enterBottom: '15vh',
          centerBottom: '8.5vh',
          exitBottom: '16.5vh',
          downScale: 0.91,
          growScale: 1.03,
          exitScale: 0.89,
        })
      })

      ScrollTrigger.refresh()

      return () => {
        mm.revert()
        clearTimeout(timer)
        ScrollTrigger.getAll().forEach((t) => t.kill())
      }
    }

    return () => {
      clearTimeout(timer)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  return (
    <Box bg="#080C12" minH="100vh" position="relative">
      <Box display={{ base: 'none', lg: 'block' }}>
        <CustomCursor />
      </Box>

      <Box
        ref={sharedImageRef}
        position="fixed"
        left="50%"
        bottom={{ base: '2vh', md: '0vh' }}
        transform="translateX(-50%)"
        zIndex={8}
        pointerEvents="none"
        w={{ base: '66vw', sm: '56vw', md: '38vw', lg: '32vw', xl: '29vw' }}
        maxW={{ base: '300px', md: '390px', lg: '440px' }}
        opacity={1}
      >
        <Image
          src={PLAYER_IMAGE}
          alt="Gonzalo Piovi"
          width="100%"
          height="auto"
          objectFit="contain"
          filter="drop-shadow(0 30px 80px rgba(0,87,184,0.38))"
        />
      </Box>

      <Navbar />
      <Hero playerImage={PLAYER_IMAGE} hidePlayerImage />
      <CinematicTransition playerImage={PLAYER_IMAGE} useSharedImage />
      <StatsSection />
      <GallerySection />
      <VideosSection />
      <PressSection />
      <ContactSection />
      <Footer />
    </Box>
  )
}
