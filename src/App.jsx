import { Box } from '@chakra-ui/react'

// Images
import piovi3 from './assets/piovi3.png'

// UI
import Navbar from './components/UI/Navbar'
import Footer from './components/UI/Footer'

// Sections
import Hero from './components/Hero/Hero'
import StatsSection from './components/Stats/StatsSection'
import GallerySection from './components/Gallery/GallerySection'
import VideosSection from './components/Videos/VideosSection'
import PressSection from './components/Press/PressSection'
import ContactSection from './components/Contact/ContactSection'

export default function App() {
  return (
    <Box bg="#080C12" minH="100vh" position="relative">
      <Navbar />
      <Hero />

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
