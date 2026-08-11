import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getStats } from '../adminData'

const STATUS_BADGE = { completed:'green', confirmed:'blue', 'in-progress':'yellow', pending:'yellow', cancelled:'red' }

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
        {/* Recent Orders */}
        <div className="adm-card adm-dash-full">
          <div className="adm-section-header">
            <span className="adm-section-title">Recent Orders</span>
            <Link to="/admin/orders" className="adm-btn adm-btn--outline adm-btn--sm">View All →</Link>
          </div>
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
                        <div style={{ fontSize: '.68rem', color: 'var(--a-muted)' }}>{o.phone}</div>
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

        {/* Quick Actions */}
        <div className="adm-card">
          <div className="adm-section-title" style={{ marginBottom: '1rem' }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.6rem' }}>
            {[
              { to: '/admin/orders',   label: '➕ Add New Order',    color: 'primary' },
              { to: '/admin/payments', label: '💳 Log Payment',      color: 'outline' },
              { to: '/admin/services', label: '⚙️ Manage Services',  color: 'ghost'   },
              { to: '/admin/visitors', label: '📊 View Analytics',   color: 'ghost'   },
            ].map(a => (
              <Link key={a.to} to={a.to} className={`adm-btn adm-btn--${a.color}`} style={{ justifyContent: 'flex-start' }}>{a.label}</Link>
            ))}
          </div>
        </div>

        {/* Active Services Summary */}
        <div className="adm-card">
          <div className="adm-section-title" style={{ marginBottom: '1rem' }}>Service Overview</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem' }}>
              <span style={{ color: 'var(--a-muted)' }}>Active Services</span>
              <span style={{ fontWeight: 700, color: 'var(--a-green2)' }}>{s.activeServices}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem' }}>
              <span style={{ color: 'var(--a-muted)' }}>Total Revenue</span>
              <span style={{ fontWeight: 700 }}>₹{s.revenue.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem' }}>
              <span style={{ color: 'var(--a-muted)' }}>Completed Orders</span>
              <span style={{ fontWeight: 700, color: 'var(--a-success)' }}>{getStats().totalOrders - s.pending}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.82rem' }}>
              <span style={{ color: 'var(--a-muted)' }}>Total Site Visitors</span>
              <span style={{ fontWeight: 700 }}>{s.totalVisitors}</span>
            </div>
            <div style={{ marginTop: '.5rem', paddingTop: '.75rem', borderTop: '1px solid var(--a-border)' }}>
              <Link to="/admin/services" className="adm-btn adm-btn--outline adm-btn--sm" style={{ width: '100%', justifyContent: 'center' }}>Manage Services →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
