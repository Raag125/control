import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
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
import './admin.css'

function RequireAuth({ children }) {
  return isAuthenticated() ? children : <Navigate to="/admin/login" replace />
}

function AdminRoutes() {
  const [pending, setPending] = useState(0)
  const refreshPending = () => setPending(getOrders().filter(o => o.status === 'pending').length)

  useEffect(() => {
    seedIfEmpty()
    refreshPending()
  }, [])

  return (
    <AdminLayout pendingCount={pending}>
      <Routes>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="orders"    element={<Orders onStatsChange={refreshPending} />} />
        <Route path="payments"  element={<Payments />} />
        <Route path="visitors"  element={<Visitors />} />
        <Route path="services"  element={<Services />} />
        <Route path="blogs"     element={<Blogs />} />
        <Route path="reviews"   element={<Reviews />} />
        <Route path="*"         element={<Navigate to="dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(isAuthenticated())
  const location = useLocation()

  // Re-check auth on every navigation
  useEffect(() => { setAuthed(isAuthenticated()) }, [location])

  if (!authed && !location.pathname.includes('/login')) {
    return <AdminLogin onSuccess={() => { setAuthed(true) }} />
  }

  if (!authed) {
    return <AdminLogin onSuccess={() => { setAuthed(true) }} />
  }

  return (
    <Routes>
      <Route path="login" element={<Navigate to="/admin/dashboard" replace />} />
      <Route
        path="*"
        element={
          <RequireAuth>
            <AdminRoutes />
          </RequireAuth>
        }
      />
    </Routes>
  )
}
