import { useState } from 'react'
import { Box } from '@chakra-ui/react'

// Images
import piovi3 from '@assets/piovi3.webp'

// UI
import Navbar from './components/UI/Navbar'
import Preloader from './components/UI/Preloader'
import Footer from './components/UI/Footer'

// Sections
import Hero from './components/Hero/Hero'
import StatsSection from './components/Stats/StatsSection'
import GallerySection from './components/Gallery/GallerySection'
import VideosSection from './components/Videos/VideosSection'
import PressSection from './components/Press/PressSection'
import ContactSection from './components/Contact/ContactSection'

export default function App() {
  // El Preloader tapa la web hasta que la foto, el escudo, la bandera y
  // las tipografías del Hero están descargados. Cuando avisa, `ready`
  // pasa a true y recién ahí el Navbar y el Hero animan su entrada
  // (mientras el overlay se funde por encima).
  const [ready, setReady] = useState(false)

  return (
    <Box bg="#080C12" minH="100vh" position="relative">
      <Preloader onComplete={() => setReady(true)} />
      <Navbar ready={ready} />
      <Hero ready={ready} />

      {/* StatsSection is pulled up −100vh so it slides over the still-pinned
          Hero (the "section reveal" cover). This −100vh mirrors the 100vh
          cover phase reserved by the Hero's tall sticky wrapper. zIndex 21
          guarantees it paints above the Hero (zIndex 1). */}
      <Box position="relative" zIndex={21} mt={{ base: '-100vh', md: '-100vh' }}>
        <StatsSection />
      </Box>
      <VideosSection />
      <GallerySection />    
      <PressSection />
      <ContactSection />
      <Footer />
    </Box>
  )
}
