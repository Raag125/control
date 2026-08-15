import '../src/index.css'
import '../src/App.css'
import Navbar from '../src/components/Navbar'
import Footer from '../src/components/Footer'
import ScrollToTop from '../src/components/ScrollToTop'
import SmoothScroll from '../src/components/SmoothScroll'
import WhatsAppFloat from '../src/components/WhatsAppFloat'
import AnimatedBackground from '../src/components/AnimatedBackground'
import { Toaster } from 'react-hot-toast'
import LeadPopup from '../src/components/LeadPopup'

export const metadata = {
  metadataBase: new URL('https://pestcontrolbengaluru.in'),
  title: {
    default: 'Pest Control Bengaluru — Best Pest Control Services in Bangalore',
    template: '%s | A to Z Pest Solutions',
  },
  description: "Bangalore's most trusted pest control company since 1993. Eco-friendly, safe, and highly effective treatments for Termites, Bed Bugs, Cockroaches, Rodents, and Mosquitoes.",
  keywords: [
    'Pest Control Bengaluru',
    'Pest Control Services in Bangalore',
    'Termite Treatment Bangalore',
    'Bed Bug Control Bangalore',
    'Cockroach Control Services',
    'Rodent Control Bengaluru',
    'Mosquito Control Bangalore',
    'A to Z Pest Solutions',
  ],
  authors: [{ name: 'A to Z Pest Solutions' }],
  creator: 'A to Z Pest Solutions',
  publisher: 'A to Z Pest Solutions',
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  openGraph: {
    title: 'Pest Control Bengaluru — A to Z Pest Solutions',
    description: 'Trusted eco-friendly pest control in Bangalore since 1993. 100% safe, odorless, and fast service for homes & commercial spaces.',
    url: 'https://pestcontrolbengaluru.in',
    siteName: 'A to Z Pest Solutions',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/hero-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'A to Z Pest Solutions Bangalore',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pest Control Bengaluru — A to Z Pest Solutions',
    description: 'Trusted eco-friendly pest control in Bangalore since 1993.',
    images: ['/images/hero-banner.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'PestControl',
  name: 'A to Z Pest Solutions',
  image: 'https://pestcontrolbengaluru.in/images/logo.png',
  '@id': 'https://pestcontrolbengaluru.in/#organization',
  url: 'https://pestcontrolbengaluru.in',
  telephone: '+919845559710',
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'No. 64, 6th Main, Hanumanthappa Layout, Sultanpalya, RT Nagar',
    addressLocality: 'Bengaluru',
    postalCode: '560032',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.0183,
    longitude: 77.5976,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
  sameAs: [
    'https://wa.me/919845559710',
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body>
        <SmoothScroll />
        <ScrollToTop />
        <Navbar />
        <AnimatedBackground />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <WhatsAppFloat />
        <LeadPopup />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      </body>
    </html>
  )
}
