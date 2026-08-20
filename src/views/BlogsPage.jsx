'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getBlogs } from '../admin/adminData'
import AnimatedBackground from '../components/AnimatedBackground'
import './BlogsPage.css'

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([])
  
  useEffect(() => {
    window.scrollTo(0, 0)
    getBlogs().then(data => {
      setBlogs(data.filter(b => b.status === 'published'))
    })
  }, [])

  return (
    <div className="blogs-page">
      <AnimatedBackground />
      <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '8rem', paddingBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="page-title">Pest Control <span className="text-gradient">Insights</span></h1>
          <p className="page-subtitle">Expert <strong>pest control insights</strong>, tips, and advice on keeping your home and office pest-free in Bangalore.</p>
        </div>

        {blogs.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--clr-text-muted)', padding: '4rem 1rem' }}>
            <h2>No blogs published yet.</h2>
            <p>Check back later for exciting insights and articles!</p>
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map((blog, idx) => (
              <motion.div 
                key={blog.id} 
                className="blog-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="blog-card__img-wrap">
                  <img src={blog.image || 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=800'} alt={blog.title} className="blog-card__img" />
                </div>
                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <h3 className="blog-card__title">
                    <Link href={`/${blog.slug}`} className="blog-card__overlay-link">
                      {blog.title}
                    </Link>
                  </h3>
                  <p className="blog-card__excerpt">{blog.excerpt}</p>
                  <span className="blog-card__btn">
                    Read Article <span>→</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
