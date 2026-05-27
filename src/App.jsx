import { Box } from '@chakra-ui/react'

// Images
import piovi3 from './assets/piovi3.png'

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

export default function App() {
  return (
    <Box bg="#080C12" minH="100vh" position="relative">
      <CustomCursor />
      <Navbar />
      <Hero />
      <CinematicTransition playerImage={piovi3} />
      <StatsSection />
      <GallerySection />
      <VideosSection />
      <PressSection />
      <ContactSection />
      <Footer />
    </Box>
  )
}
