'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { isAuthenticated } from './adminAuth'
import { seedIfEmpty, getOrders } from './adminData'
import AdminLogin  from './AdminLogin'
import AdminLayout from './AdminLayout'
import Dashboard   from './pages/Dashboard'
import Orders      from './pages/Orders'
import Payments    from './pages/Payments'
import Visitors    from './pages/Visitors'
import Services    from './pages/Services'
import Blogs       from './pages/Blogs'
import Reviews     from './pages/Reviews'
import Images      from './pages/Images'
import Clients     from './pages/Clients'
import './admin.css'

export default function AdminApp() {
  const [authed, setAuthed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const [pending, setPending] = useState(0)

  const refreshPending = () => setPending(getOrders().filter(o => o.status === 'pending').length)

  useEffect(() => {
    setMounted(true)
    setAuthed(isAuthenticated())
    seedIfEmpty()
    refreshPending()
  }, [pathname])

  if (!mounted) return null

  if (!authed) {
    return <AdminLogin onSuccess={() => { setAuthed(true) }} />
  }

  const renderTab = () => {
    if (pathname.includes('/orders')) return <Orders onStatsChange={refreshPending} />
    if (pathname.includes('/payments')) return <Payments />
    if (pathname.includes('/visitors')) return <Visitors />
    if (pathname.includes('/services')) return <Services />
    if (pathname.includes('/blogs')) return <Blogs />
    if (pathname.includes('/reviews')) return <Reviews />
    if (pathname.includes('/images')) return <Images />
    if (pathname.includes('/clients')) return <Clients />
    return <Dashboard />
  }

  return (
    <AdminLayout pendingCount={pending}>
      {renderTab()}
    </AdminLayout>
  )
}
