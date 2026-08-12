import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlogBySlug, getBlogs } from '../admin/adminData'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Helmet } from 'react-helmet-async'
import { Phone, MessageCircle, ArrowRight } from 'lucide-react'
import AnimatedBackground from '../components/AnimatedBackground'
import './BlogPostPage.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [recentBlogs, setRecentBlogs] = useState([])
  
  useEffect(() => {
    window.scrollTo(0, 0)
    const b = getBlogBySlug(slug)
    if (b && b.status === 'published') {
      setBlog(b)
    }
    const all = getBlogs().filter(x => x.status === 'published' && x.slug !== slug).slice(0, 3)
    setRecentBlogs(all)
  }, [slug])

  if (!blog) {
    return (
      <div className="blog-post-page" style={{ paddingTop: '10rem', textAlign: 'center' }}>
        <AnimatedBackground />
        <h2>Blog post not found or not published.</h2>
        <Link to="/blogs" className="btn btn-outline" style={{ marginTop: '2rem', display: 'inline-block' }}>Back to Blogs</Link>
      </div>
    )
  }

  return (
    <article className="blog-post-page">
      <Helmet>
        <title>{blog.title} | A to Z Pest Solutions</title>
        <meta name="description" content={blog.metaDesc || blog.excerpt} />
        {blog.metaKeywords && <meta name="keywords" content={blog.metaKeywords} />}
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.metaDesc || blog.excerpt} />
        {blog.image && <meta property="og:image" content={blog.image} />}
        <link rel="canonical" href={`https://atozpestsolutions.in/blogs/${blog.slug}`} />
      </Helmet>

      <AnimatedBackground />
      
      <div className="container blog-header" style={{ paddingTop: '7rem', paddingBottom: '2rem', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
        <div className="blog-meta" style={{ marginBottom: '1rem', color: 'var(--clr-primary)' }}>
          {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <h1 className="blog-title" style={{ color: 'var(--clr-primary-dark)', textShadow: 'none', marginBottom: '2rem' }}>
          {blog.title}
        </h1>
        <img 
          src={blog.image || 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=2000'} 
          alt={blog.imageAlt || blog.title} 
          style={{ width: '100%', height: 'auto', borderRadius: '16px', objectFit: 'contain', maxHeight: '60vh', backgroundColor: 'var(--clr-bg)' }}
        />
      </div>

      <div className="container blog-content-layout" style={{ marginTop: '1rem' }}>
        
        {/* LEFT MAIN CONTENT */}
        <div className="blog-main-column">
          <div className="blog-markdown-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog.content}</ReactMarkdown>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="blog-sidebar">
          
          {/* CTA Card */}
          <div className="blog-sidebar__card cta-card">
            <h3>Need Expert Pest Control?</h3>
            <p>Get a free property inspection and personalized treatment plan.</p>
            <a href="tel:+919845559710" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <Phone size={15} /> 9845559710
            </a>
            <a href={`https://wa.me/919845559710?text=Hi%2C%20I%20am%20reading%20the%20blog%20${encodeURIComponent(blog.title)}%20and%20need%20help.`} 
               target="_blank" rel="noopener noreferrer" 
               className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
              <MessageCircle size={15} /> WhatsApp Us
            </a>
          </div>

          {/* Recent Blogs */}
          {recentBlogs.length > 0 && (
            <div className="blog-sidebar__card">
              <h3>Read Next</h3>
              <div className="sidebar-recent-list">
                {recentBlogs.map(rb => (
                  <Link key={rb.id} to={`/blogs/${rb.slug}`} className="sidebar-recent-item">
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
