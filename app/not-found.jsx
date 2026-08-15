import Link from 'next/link'
import AnimatedBackground from '../src/components/AnimatedBackground'

export const metadata = {
  title: "404 - Page Not Found | A to Z Pest Solutions",
}

export default function NotFound() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem', paddingTop: '8rem' }}>
      <AnimatedBackground />
      <h1 style={{ fontSize: '5rem', fontWeight: 800, color: 'var(--clr-primary)', lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem', marginTop: '1rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--clr-text-muted)', marginBottom: '2rem', maxWidth: '440px' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/" className="btn btn-primary">
        Back to Home Page
      </Link>
    </div>
  )
}
