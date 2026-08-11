import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBlogBySlug } from '../admin/adminData'
import ReactMarkdown from 'react-markdown'
import AnimatedBackground from '../components/AnimatedBackground'
import './BlogPostPage.css'

export default function BlogPostPage() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  
  useEffect(() => {
    window.scrollTo(0, 0)
    const b = getBlogBySlug(slug)
    if (b && b.status === 'published') {
      setBlog(b)
    }
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
      <AnimatedBackground />
      
      <div className="blog-hero">
        <div className="blog-hero-overlay"></div>
        <img src={blog.image || 'https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80&w=2000'} alt={blog.title} className="blog-hero-img" />
        <div className="container blog-hero-content">
          <div className="blog-meta">
            {new Date(blog.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
          <h1 className="blog-title">{blog.title}</h1>
        </div>
      </div>

      <div className="container blog-content-wrap">
        <div className="blog-markdown-content">
          <ReactMarkdown>{blog.content}</ReactMarkdown>
        </div>
      </div>
    </article>
  )
}
