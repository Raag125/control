import { useState, useEffect } from 'react'
import { getReviews, saveReview, deleteReview } from '../adminData'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(null)

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
    if(window.confirm('Delete this review?')) {
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
      <span key={i} style={{ color: i < rating ? '#F59E0B' : '#E5E7EB', fontSize: '1.1rem' }}>★</span>
    ))
  }

  return (
    <div>
      <div className="adm-header">
        <h1 className="adm-title">Testimonials & Reviews</h1>
      </div>
      
      <div className="adm-card" style={{ marginTop: '1.5rem' }}>
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
            {reviews.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign:'center', padding:'2rem', color:'var(--a-muted)'}}>No reviews found</td></tr>
            ) : reviews.map(r => editingId === r.id ? (
              <tr key={r.id}>
                <td data-label="Date" style={{ whiteSpace: 'nowrap' }}>{new Date(r.date).toLocaleDateString()}</td>
                <td data-label="Service">{r.service}</td>
                <td data-label="Customer"><input type="text" className="adm-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{width: '100px'}} /></td>
                <td data-label="Rating">
                  <select className="adm-input" value={editForm.rating} onChange={e => setEditForm({...editForm, rating: Number(e.target.value)})}>
                    <option value="5">5 ★</option><option value="4">4 ★</option><option value="3">3 ★</option><option value="2">2 ★</option><option value="1">1 ★</option>
                  </select>
                </td>
                <td data-label="Review"><textarea className="adm-input" value={editForm.text} onChange={e => setEditForm({...editForm, text: e.target.value})} rows="2" style={{width:'100%', minWidth:'200px'}} /></td>
                <td data-label="Status">{r.status}</td>
                <td data-label="Actions">
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <button className="adm-btn adm-btn--sm" onClick={handleEditSave}>Save</button>
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </td>
              </tr>
            ) : (
              <tr key={r.id}>
                <td data-label="Date" style={{ whiteSpace: 'nowrap' }}>{new Date(r.date).toLocaleDateString()}</td>
                <td data-label="Service">{r.service}</td>
                <td data-label="Customer"><strong>{r.name}</strong></td>
                <td data-label="Rating" style={{ whiteSpace: 'nowrap' }}>{renderStars(r.rating)}</td>
                <td data-label="Review" style={{ maxWidth: '250px' }}>
                  <div style={{ overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }} title={r.text}>
                    {r.text}
                  </div>
                </td>
                <td data-label="Status">
                  <span className={`adm-status ${r.status==='approved'?'paid':r.status==='pending'?'pending':'refunded'}`}>
                    {r.status}
                  </span>
                </td>
                <td data-label="Actions">
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {r.status === 'pending' && (
                      <>
                        <button className="adm-btn adm-btn--sm" onClick={() => handleApprove(r)}>Approve</button>
                        <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => handleDeny(r)}>Deny</button>
                      </>
                    )}
                    {(r.status === 'denied' || r.status === 'approved') && (
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => r.status==='denied' && handleApprove(r)} disabled={r.status==='approved'}>
                        {r.status==='approved' ? 'Approved' : 'Approve'}
                      </button>
                    )}
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => handleEditClick(r)}>Edit</button>
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" style={{ color: 'red' }} onClick={() => handleDelete(r.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
