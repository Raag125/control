import BlogPostPage from '../../src/views/BlogPostPage'
import { getBlogBySlug } from '../../src/admin/adminData'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  try {
    const { getBlogs } = await import('../../src/admin/adminData')
    const blogs = getBlogs ? getBlogs() : []
    return blogs.filter(b => b.status === 'published' && b.slug).map(b => ({ slug: b.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  const blog = getBlogBySlug(resolvedParams.slug)

  if (!blog || blog.status !== 'published') {
    return { title: 'Not Found | A to Z Pest Solutions' }
  }

  return {
    title: `${blog.title} | A to Z Pest Solutions Bangalore`,
    description: blog.metaDesc || blog.excerpt || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.metaDesc || blog.excerpt,
      images: blog.image ? [{ url: blog.image }] : [],
    },
  }
}

export default async function Page({ params }) {
  const resolvedParams = await params
  const blog = getBlogBySlug(resolvedParams.slug)

  if (!blog || blog.status !== 'published') {
    notFound()
  }

  return <BlogPostPage slug={resolvedParams.slug} />
}
