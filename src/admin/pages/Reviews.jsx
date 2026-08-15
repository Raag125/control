import { useState, useEffect } from 'react'
import { getReviews, saveReview, deleteReview } from '../adminData'
import ModalPortal from '../ModalPortal'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)
  const [filter, setFilter] = useState('all')

  const loadData = async () => {
    const data = await getReviews()
    setReviews(data)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleApprove = async (rev) => {
    const updated = await saveReview({ ...rev, status: 'approved' })
    setReviews(updated)
  }

  const handleDeny = async (rev) => {
    const updated = await saveReview({ ...rev, status: 'denied' })
    setReviews(updated)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this review?')) {
      const updated = await deleteReview(id)
      setReviews(updated)
    }
  }

  const handleEditClick = (r) => {
    setEditingId(r.id)
    setEditForm({ ...r })
  }

  const handleEditSave = async () => {
    const updated = await saveReview(editForm)
    setEditingId(null)
    setReviews(updated)
  }

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} style={{ color: i < rating ? '#F59E0B' : '#E5E7EB', fontSize: '1rem' }}>★</span>
    ))
  }

  const filtered = reviews.filter(r => filter === 'all' || r.status === filter)

  return (
    <div>
      {/* Header */}
      <div className="adm-section-header">
        <div>
          <h1 className="adm-section-title" style={{ fontSize: '1.2rem' }}>⭐ Customer Reviews &amp; Testimonials</h1>
          <p style={{ fontSize: '.75rem', color: 'var(--a-muted)', marginTop: '.15rem' }}>
            Moderate and approve customer ratings for the website homepage.
          </p>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="adm-filter-chips" style={{ marginTop: '.75rem', marginBottom: '1rem' }}>
        {['all', 'approved', 'pending', 'denied'].map(st => {
          const count = st === 'all' ? reviews.length : reviews.filter(r => r.status === st).length
          return (
            <button
              key={st}
              className={`adm-chip ${filter === st ? 'active' : ''}`}
              onClick={() => setFilter(st)}
            >
              <span style={{ textTransform: 'capitalize' }}>{st}</span>
              <span style={{ opacity: 0.8, fontSize: '.65rem' }}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* Desktop Table View */}
      <div className="adm-desktop-only">
        <div className="adm-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Rating</th>
                  <th>Review</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="7"><div className="adm-empty"><div className="adm-empty__icon">⭐</div><div className="adm-empty__text">No reviews found</div></div></td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id}>
                    <td style={{ whiteSpace: 'nowrap', fontSize: '.74rem', color: 'var(--a-muted)' }}>{new Date(r.date).toLocaleDateString('en-IN')}</td>
                    <td style={{ fontSize: '.8rem' }}>{r.service}</td>
                    <td><strong>{r.name}</strong></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{renderStars(r.rating)}</td>
                    <td style={{ maxWidth: '280px' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontSize: '.78rem' }} title={r.text}>
                        {r.text}
                      </div>
                    </td>
                    <td>
                      <span className={`adm-badge ${r.status === 'approved' ? 'adm-badge--green' : r.status === 'pending' ? 'adm-badge--yellow' : 'adm-badge--red'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        {r.status === 'pending' && (
                          <>
                            <button className="adm-btn adm-btn--green adm-btn--sm" onClick={() => handleApprove(r)}>Approve</button>
                            <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => handleDeny(r)}>Deny</button>
                          </>
                        )}
                        {r.status !== 'pending' && (
                          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => handleApprove(r)} disabled={r.status === 'approved'}>
                            {r.status === 'approved' ? 'Approved' : 'Approve'}
                          </button>
                        )}
                        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => handleEditClick(r)}>Edit</button>
                        <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => handleDelete(r.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Dedicated Mobile Cards View */}
      <div className="adm-mobile-only">
        {filtered.length === 0 ? (
          <div className="adm-card adm-empty">
            <div className="adm-empty__icon">⭐</div>
            <div className="adm-empty__text">No reviews found</div>
          </div>
        ) : (
          <div className="adm-mobile-list">
            {filtered.map(r => (
              <div key={r.id} className="adm-mobile-card">
                <div className="adm-mobile-card__header">
                  <div>
                    <div className="adm-mobile-card__title">{r.name}</div>
                    <div className="adm-mobile-card__subtitle">{r.service} · {new Date(r.date).toLocaleDateString('en-IN')}</div>
                  </div>
                  <span className={`adm-badge ${r.status === 'approved' ? 'adm-badge--green' : r.status === 'pending' ? 'adm-badge--yellow' : 'adm-badge--red'}`}>
                    {r.status}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '.3rem' }}>
                  {renderStars(r.rating)}
                  <span style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--a-muted)', marginLeft: '.3rem' }}>{r.rating}.0 / 5.0</span>
                </div>

                <p style={{ fontSize: '.78rem', color: 'var(--a-text)', lineHeight: 1.5, background: 'var(--a-card2)', padding: '.5rem .65rem', borderRadius: '8px', border: '1px solid var(--a-border)' }}>
                  "{r.text}"
                </p>

                <div className="adm-mobile-card__actions">
                  {r.status === 'pending' && (
                    <>
                      <button className="adm-btn adm-btn--green adm-btn--sm" style={{ flex: 1 }} onClick={() => handleApprove(r)}>
                        ✓ Approve
                      </button>
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" style={{ flex: 1 }} onClick={() => handleDeny(r)}>
                        ✕ Deny
                      </button>
                    </>
                  )}
                  {r.status !== 'pending' && (
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" style={{ flex: 1 }} onClick={() => handleApprove(r)} disabled={r.status === 'approved'}>
                      {r.status === 'approved' ? '✓ Approved' : 'Approve'}
                    </button>
                  )}
                  <button className="adm-btn adm-btn--outline adm-btn--sm" style={{ flex: 0.8 }} onClick={() => handleEditClick(r)}>
                    ✏️ Edit
                  </button>
                  <button className="adm-btn adm-btn--danger adm-btn--sm" style={{ flex: 0.5 }} onClick={() => handleDelete(r.id)}>
                    🗑
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Review Modal */}
      {editingId && editForm && (
        <ModalPortal>
          <div className="adm-modal-overlay" onClick={e => e.target === e.currentTarget && setEditingId(null)}>
            <div className="adm-modal">
              <div className="adm-modal__header">
                <span className="adm-modal__title">Edit Customer Review</span>
                <button className="adm-modal__close" onClick={() => setEditingId(null)} aria-label="Close modal">✕</button>
              </div>
              <div className="adm-modal__body">
                <div className="adm-form-grid">
                  <div className="adm-form-group">
                    <label className="adm-label">Customer Name</label>
                    <input className="adm-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                  </div>
                  <div className="adm-form-group">
                    <label className="adm-label">Rating</label>
                    <select className="adm-select-full" value={editForm.rating} onChange={e => setEditForm({ ...editForm, rating: Number(e.target.value) })}>
                      <option value="5">5 Stars ★★★★★</option>
                      <option value="4">4 Stars ★★★★☆</option>
                      <option value="3">3 Stars ★★★☆☆</option>
                      <option value="2">2 Stars ★★☆☆☆</option>
                      <option value="1">1 Star ★☆☆☆☆</option>
                    </select>
                  </div>
                  <div className="adm-form-group adm-form-group--full">
                    <label className="adm-label">Service</label>
                    <input className="adm-input" value={editForm.service} onChange={e => setEditForm({ ...editForm, service: e.target.value })} />
                  </div>
                  <div className="adm-form-group adm-form-group--full">
                    <label className="adm-label">Review Text</label>
                    <textarea className="adm-textarea" rows={3} value={editForm.text} onChange={e => setEditForm({ ...editForm, text: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="adm-modal__footer">
                <button className="adm-btn adm-btn--ghost" onClick={() => setEditingId(null)}>Cancel</button>
                <button className="adm-btn adm-btn--primary" onClick={handleEditSave}>Save Review</button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  )
}
