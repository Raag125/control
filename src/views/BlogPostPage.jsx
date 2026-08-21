'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getBlogBySlug, getBlogs } from '../admin/adminData'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { Phone, MessageCircle } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import './BlogPostPage.css'

export default function BlogPostPage({ slug: propSlug }) {
  const slug = propSlug
  const [blog, setBlog] = useState(null)
  const [recentBlogs, setRecentBlogs] = useState([])
  
  useEffect(() => {
    window.scrollTo(0, 0)
    if (slug) {
      getBlogs().then(allBlogs => {
        const b = allBlogs.find(x => x.slug === slug)
        if (b && b.status === 'published') {
          setBlog(b)
        }
        const recents = allBlogs.filter(x => x.status === 'published' && x.slug !== slug).slice(0, 3)
        setRecentBlogs(recents)
      })
    }
  }, [slug])

  if (!blog) {
    return (
      <div className="blog-post-page" style={{ paddingTop: '10rem', textAlign: 'center' }}>
        <AnimatedBackground />
        <h2>Blog post not found or not published.</h2>
        <Link href="/blogs" className="btn btn-outline" style={{ marginTop: '2rem', display: 'inline-block' }}>Back to Blogs</Link>
      </div>
    )
  }

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.metaDesc || blog.excerpt,
    image: blog.image ? [blog.image] : [],
    datePublished: blog.date,
    author: {
      '@type': 'Organization',
      name: 'A to Z Pest Solutions',
    },
    publisher: {
      '@type': 'Organization',
      name: 'A to Z Pest Solutions',
      logo: {
        '@type': 'ImageObject',
        url: 'https://pestcontrolbengaluru.in/images/logo.webp',
      },
    },
    mainEntityOfPage: `https://pestcontrolbengaluru.in/${blog.slug}`,
  }

  return (
    <article className="blog-post-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <AnimatedBackground />
      
      <div className="container blog-header" style={{ paddingTop: '7rem', paddingBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ flex: '1 1 400px', textAlign: 'left' }}>
          <div className="blog-meta" style={{ marginBottom: '1rem', color: 'var(--clr-primary)', fontWeight: '600' }}>
            {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className="blog-title" style={{ color: 'var(--clr-primary-dark)', textShadow: 'none', marginBottom: '1rem', fontSize: 'clamp(2.5rem, 4vw, 4rem)', lineHeight: '1.2' }}>
            {blog.title}
          </h1>
        </div>

        <div style={{ flex: '1 1 500px' }}>
          <img 
            src={blog.image || 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=2000'} 
            alt={blog.imageAlt || blog.title} 
            style={{ width: '100%', height: 'auto', borderRadius: '20px', objectFit: 'contain', maxHeight: '60vh', backgroundColor: 'var(--clr-bg-alt)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}
          />
        </div>
      </div>

      <div className="container blog-content-layout" style={{ marginTop: '1rem' }}>
        
        {/* LEFT MAIN CONTENT */}
        <div className="blog-main-column">
          <div className="blog-markdown-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
              components={{
                iframe: ({ node, style, width, height, ...props }) => (
                  <iframe 
                    {...props} 
                    style={{ 
                      width: '100%', 
                      height: 'auto',
                      borderRadius: '12px', 
                      margin: '1.5rem 0', 
                      aspectRatio: '16/9', 
                      maxWidth: '100%', 
                      display: 'block' 
                    }} 
                  />
                ),
                img: ({ node, ...props }) => (
                  <img 
                    {...props} 
                    style={{ 
                      maxWidth: '100%', 
                      height: 'auto', 
                      borderRadius: '8px',
                      display: 'block',
                      margin: '1.5rem auto'
                    }} 
                  />
                )
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="blog-sidebar">
          
          {/* CTA Card */}
          <div className="blog-sidebar__card cta-card">
            <h3>Need Expert Pest Control?</h3>
            <p>Get a free property inspection and personalized treatment plan.</p>
            <a href="tel:+919845559710" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }} aria-label="Call our pest control team at 9845559710">
              <Phone size={15} /> Call 9845559710
            </a>
            <a href={`https://wa.me/919845559710?text=Hi%2C%20I%20am%20reading%20the%20blog%20${encodeURIComponent(blog.title)}%20and%20need%20help.`} 
               target="_blank" rel="noopener noreferrer" 
               className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}
               aria-label="Chat with pest specialist on WhatsApp">
              <MessageCircle size={15} /> Chat on WhatsApp
            </a>
          </div>

          {/* Recent Blogs */}
          {recentBlogs.length > 0 && (
            <div className="blog-sidebar__card">
              <h3>Read Next</h3>
              <div className="sidebar-recent-list">
                {recentBlogs.map(rb => (
                  <Link key={rb._id || rb.slug} href={`/${rb.slug}`} className="sidebar-recent-item">
                    <img 
                      src={rb.image || 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=200'} 
                      alt={rb.imageAlt || rb.title} 
                      className="sidebar-recent-img" 
                    />
                    <div className="sidebar-recent-text">
                      <h4>{rb.title}</h4>
                      <span>{new Date(rb.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </aside>
      </div>
    </article>
  )
}
