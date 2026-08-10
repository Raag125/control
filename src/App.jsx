import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import TermiteTreatment from './pages/services/TermiteTreatment'
import BedBugsTreatment from './pages/services/BedBugsTreatment'
import CockroachTreatment from './pages/services/CockroachTreatment'
import RodentTreatment from './pages/services/RodentTreatment'
import MosquitoTreatment from './pages/services/MosquitoTreatment'
import HoneyBeeTreatment from './pages/services/HoneyBeeTreatment'
import TicksFleaTreatment from './pages/services/TicksFleaTreatment'
import WoodBorerTreatment from './pages/services/WoodBorerTreatment'
import Franchise from './pages/Franchise'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import AnimatedBackground from './components/AnimatedBackground'

export default function App() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => e.preventDefault()
    // Disable F12 and Ctrl+Shift+I dev tools (basic deterrent)
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault()
      }
    }
    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <AnimatedBackground />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/termite-treatment" element={<TermiteTreatment />} />
          <Route path="/bed-bugs-treatment" element={<BedBugsTreatment />} />
          <Route path="/cockroach-treatment" element={<CockroachTreatment />} />
          <Route path="/rodent-treatment" element={<RodentTreatment />} />
          <Route path="/mosquito-treatment" element={<MosquitoTreatment />} />
          <Route path="/honey-bee-treatment" element={<HoneyBeeTreatment />} />
          <Route path="/ticks-fleas-treatment" element={<TicksFleaTreatment />} />
          <Route path="/wood-borer-treatment" element={<WoodBorerTreatment />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppFloat />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
    </Router>
  )
}
