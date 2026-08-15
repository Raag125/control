import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import SmoothScroll from './components/SmoothScroll'
import WhatsAppFloat from './components/WhatsAppFloat'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import TermiteTreatment from './pages/services/TermiteTreatment'
import PreConstructionTermite from './pages/services/PreConstructionTermite'
import PostConstructionTermite from './pages/services/PostConstructionTermite'
import BedBugsTreatment from './pages/services/BedBugsTreatment'
import CockroachTreatment from './pages/services/CockroachTreatment'
import RodentTreatment from './pages/services/RodentTreatment'
import MosquitoTreatment from './pages/services/MosquitoTreatment'
import HoneyBeeTreatment from './pages/services/HoneyBeeTreatment'
import WoodBorerTreatment from './pages/services/WoodBorerTreatment'
import ResidentialPestControl from './pages/services/ResidentialPestControl'
import CommercialPestControl from './pages/services/CommercialPestControl'
import GeneralPestControl from './pages/services/GeneralPestControl'
import AntPestControl from './pages/services/AntPestControl'
import TickPestControl from './pages/services/TickPestControl'
import FleaPestControl from './pages/services/FleaPestControl'
import Franchise from './pages/Franchise'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import BlogsPage from './pages/BlogsPage'
import BlogPostPage from './pages/BlogPostPage'
import AnimatedBackground from './components/AnimatedBackground'
import AdminApp from './admin/AdminApp'
import { logVisit, fetchAndCacheIP } from './admin/adminData'

// ── Visitor tracker — logs every page visit to localStorage ──
function VisitorTracker() {
  const { pathname } = useLocation()
  useEffect(() => {
    // Don't track admin panel visits
    if (pathname.startsWith('/admin')) return
    logVisit(pathname)
    fetchAndCacheIP()
  }, [pathname])
  return null
}

export default function App() {

  return (
    <Router>
      <VisitorTracker />
      <Routes>
        {/* ── Admin Panel (isolated — no Navbar/Footer) ── */}
        <Route path="/admin/*" element={<AdminApp />} />

        {/* ── Public Site ── */}
        <Route path="/*" element={<>
          <SmoothScroll />
          <ScrollToTop />
          <Navbar />
          <AnimatedBackground />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about-us" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/residential-pest-control" element={<ResidentialPestControl />} />
              <Route path="/commercial-pest-control" element={<CommercialPestControl />} />
              <Route path="/bed-bugs-treatment" element={<BedBugsTreatment />} />
              <Route path="/termite-treatment" element={<TermiteTreatment />} />
              <Route path="/pre-construction-termite-treatment" element={<PreConstructionTermite />} />
              <Route path="/post-construction-termite-treatment" element={<PostConstructionTermite />} />
              <Route path="/cockroach-treatment" element={<CockroachTreatment />} />
              <Route path="/general-pest-control" element={<GeneralPestControl />} />
              <Route path="/ant-pest-control" element={<AntPestControl />} />
              <Route path="/tick-pest-control" element={<TickPestControl />} />
              <Route path="/flea-pest-control" element={<FleaPestControl />} />
              <Route path="/mosquito-treatment" element={<MosquitoTreatment />} />
              <Route path="/rodent-treatment" element={<RodentTreatment />} />
              <Route path="/wood-borer-treatment" element={<WoodBorerTreatment />} />
              <Route path="/honey-bee-treatment" element={<HoneyBeeTreatment />} />
              <Route path="/franchise" element={<Franchise />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:slug" element={<BlogPostPage />} />
              <Route path="/:slug" element={<BlogPostPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppFloat />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </>} />
      </Routes>
    </Router>
  )
}
