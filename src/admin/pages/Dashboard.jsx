'use client'
import { useMemo } from 'react'
import Link from 'next/link'
import { getStats } from '../adminData'

const STATUS_BADGE = { completed: 'green', confirmed: 'blue', 'in-progress': 'yellow', pending: 'yellow', cancelled: 'red' }

function StatCard({ icon, val, label, sub, color }) {
  return (
    <div className="adm-stat adm-card--hover">
      <div className={`adm-stat__icon adm-stat__icon--${color}`}>{icon}</div>
      <div className="adm-stat__val">{val}</div>
      <div className="adm-stat__label">{label}</div>
      {sub && <div className="adm-stat__sub">{sub}</div>}
    </div>
  )
}

export default function Dashboard() {
  const s = useMemo(() => getStats(), [])

  return (
    <div>
      {/* Stats */}
      <div className="adm-stats-grid">
        <StatCard color="green" val={`₹${s.revenue.toLocaleString('en-IN')}`} label="Total Revenue" sub="All paid orders" icon="💰" />
        <StatCard color="blue"  val={s.totalOrders} label="Total Orders" sub={`${s.monthOrders} this month`} icon="📋" />
        <StatCard color="warn"  val={s.pending} label="Pending Orders" sub="Awaiting confirmation" icon="⏳" />
        <StatCard color="green" val={s.todayVisits} label="Today's Visitors" sub={`${s.totalVisitors} total`} icon="👁️" />
      </div>

      <div className="adm-dash-grid">
        {/* Recent Orders Card */}
        <div className="adm-card adm-dash-full" style={{ padding: '1.25rem' }}>
          <div className="adm-section-header">
            <div>
              <h2 className="adm-section-title">Recent Orders</h2>
              <p style={{ color: 'var(--a-muted)', marginTop: '.15rem' }}>Latest booking activity</p>
            </div>
            <Link href="/admin/orders" className="adm-btn adm-btn--outline adm-btn--sm">View All Orders →</Link>
          </div>

          {/* Desktop Table View */}
          <div className="adm-desktop-only">
            <div className="adm-table-wrap">
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Customer</th><th>Service</th><th>Area</th><th>Amount</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {s.recentOrders.length === 0
                    ? <tr><td colSpan={6}><div className="adm-empty"><div className="adm-empty__icon">📋</div><div className="adm-empty__text">No orders yet</div></div></td></tr>
                    : s.recentOrders.map(o => (
                      <tr key={o.id}>
                        <td style={{ fontWeight: 700, color: 'var(--a-green2)', fontFamily: 'monospace' }}>{o.id}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{o.customer}</div>
                          <div style={{ color: 'var(--a-muted)' }}>{o.phone}</div>
                        </td>
                        <td>{o.service}</td>
                        <td>{o.area}</td>
                        <td style={{ fontWeight: 700 }}>₹{o.amount.toLocaleString('en-IN')}</td>
                        <td><span className={`adm-badge adm-badge--${STATUS_BADGE[o.status] || 'gray'}`}>{o.status}</span></td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>

          {/* Dedicated Mobile Cards View */}
          <div className="adm-mobile-only">
            {s.recentOrders.length === 0 ? (
              <div className="adm-empty" style={{ padding: '1.5rem 0' }}>
                <div className="adm-empty__icon">📋</div>
                <div className="adm-empty__text">No orders yet</div>
              </div>
            ) : (
              <div className="adm-mobile-list">
                {s.recentOrders.map(o => (
                  <div key={o.id} className="adm-mobile-card">
                    <div className="adm-mobile-card__header">
                      <div>
                        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--a-green2)' }}>{o.id}</span>
                        <div className="adm-mobile-card__title" style={{ marginTop: '.2rem' }}>{o.customer}</div>
                      </div>
                      <span className={`adm-badge adm-badge--${STATUS_BADGE[o.status] || 'gray'}`}>{o.status}</span>
                    </div>

                    <div className="adm-mobile-card__grid">
                      <div className="adm-mobile-card__row">
                        <span className="adm-mobile-card__label">Service</span>
                        <span className="adm-mobile-card__val" style={{ maxWidth: '120px' }}>{o.service}</span>
                      </div>
                      <div className="adm-mobile-card__row">
                        <span className="adm-mobile-card__label">Amount</span>
                        <span className="adm-mobile-card__val adm-mobile-card__val--highlight">₹{o.amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="adm-mobile-card__row">
                        <span className="adm-mobile-card__label">Area</span>
                        <span className="adm-mobile-card__val">{o.area || '—'}</span>
                      </div>
                      <div className="adm-mobile-card__row">
                        <span className="adm-mobile-card__label">Phone</span>
                        <a href={`tel:${o.phone}`} className="adm-mobile-card__val" style={{ color: 'var(--a-green2)', textDecoration: 'none' }}>📞 {o.phone}</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="adm-card">
          <h2 className="adm-section-title" style={{ marginBottom: '.85rem' }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '.6rem' }}>
            {[
              { to: '/admin/services-content', label: '⚡ Live Services Page Editor', color: 'primary' },
              { to: '/admin/orders',   label: '➕ Add New Order',   color: 'outline' },
              { to: '/admin/payments', label: '💳 Log Payment',     color: 'ghost'   },
              { to: '/admin/clients',  label: '👥 View Leads',      color: 'ghost'   },
              { to: '/admin/blogs',    label: '✨ New AI Blog',     color: 'ghost'   },
            ].map(a => (
              <Link
                key={a.label}
                href={a.to}
                className={`adm-btn adm-btn--${a.color}`}
                style={{ justifyContent: 'flex-start', minHeight: '44px' }}
              >
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Active Services Summary */}
        <div className="adm-card">
          <h2 className="adm-section-title" style={{ marginBottom: '.85rem' }}>Service Pages Studio</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.25rem 0', borderBottom: '1px solid rgba(22,163,74,0.08)' }}>
              <span style={{ color: 'var(--a-muted)' }}>Active Service Pages</span>
              <span style={{ fontWeight: 800, color: 'var(--a-green2)' }}>{s.activeServices || 15} Pages</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.25rem 0', borderBottom: '1px solid rgba(22,163,74,0.08)' }}>
              <span style={{ color: 'var(--a-muted)' }}>Visual Live Editor</span>
              <span style={{ fontWeight: 800, color: 'var(--a-green2)' }}>Ready &amp; Synced</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '.25rem 0', borderBottom: '1px solid rgba(22,163,74,0.08)' }}>
              <span style={{ color: 'var(--a-muted)' }}>SEO &amp; Alt Tags</span>
              <span style={{ fontWeight: 800 }}>100% Configurable</span>
            </div>
            <div style={{ marginTop: '.35rem', paddingTop: '.75rem', borderTop: '1px solid var(--a-border)', display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              <Link href="/admin/services-content" className="adm-btn adm-btn--primary adm-btn--sm" style={{ width: '100%', justifyContent: 'center', minHeight: '38px' }}>
                Open Live Page Content Editor →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
