import BlogPostPage from '../../src/views/BlogPostPage'
import ServiceDetailPage from '../../src/views/services/ServiceDetailPage'
import { getBlogBySlug } from '../../src/admin/adminData'
import { notFound } from 'next/navigation'
import { MongoClient } from 'mongodb'
import { getServiceBySlug } from '../../src/data/servicesData'

// ISR: revalidate pages every 30 seconds so admin changes appear quickly
export const revalidate = 30

import fs from 'fs'
import path from 'path'

function getMongoUri() {
  let uri = process.env.MONGODB_URI
  try {
    const envPath = path.join(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8')
      const match = content.match(/^MONGODB_URI=["']?([^"'\n]+)["']?/m)
      if (match) uri = match[1]
    }
  } catch(e) {}
  return uri
}

async function getServiceFromDB(slug) {
  try {
    const MONGODB_URI = getMongoUri()
    const client = await MongoClient.connect(MONGODB_URI, { connectTimeoutMS: 3000 })
    const db = client.db('pest_control')
    const service = await db.collection('services').findOne({
      $or: [{ slug: slug }, { id: slug }]
    })
    await client.close()
    if (service) {
      const { _id, ...rest } = service
      return rest
    }
    return null
  } catch (err) {
    console.error('Error fetching service from DB in server component:', err)
    return null
  }
}

async function getBlogFromDB(slug) {
  const MONGODB_URI = getMongoUri()
  if (!MONGODB_URI) return null
  try {
    const client = await MongoClient.connect(MONGODB_URI, { connectTimeoutMS: 3000 })
    const db = client.db('pest_control')
    const blog = await db.collection('blogs').findOne({
      $or: [{ slug: slug }, { id: slug }]
    })
    await client.close()
    if (blog) {
      const { _id, ...rest } = blog
      return rest
    }
    return null
  } catch (err) {
    console.error('Error fetching blog from DB in server component:', err)
    return null
  }
}

// Allow slugs not in generateStaticParams to be rendered on-demand (needed for blogs)
export const dynamicParams = true

export async function generateStaticParams() {
  // Only pre-render service pages from static data — no DB needed at build time.
  // Blog slugs are served dynamically (dynamicParams = true above).
  try {
    const { SERVICES_DATA } = await import('../../src/data/servicesData')
    return SERVICES_DATA
      .filter(s => s.slug)
      .map(s => ({ slug: s.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params
  
  // 1. Check if it's a service in MongoDB (with static fallback)
  let service = await getServiceFromDB(resolvedParams.slug)
  if (!service) service = getServiceBySlug(resolvedParams.slug)
  
  if (service) {
    return {
      title: `${service.hero?.title || service.name} | A to Z Pest Solutions`,
      description: service.hero?.tagline || service.description,
      openGraph: {
        title: service.hero?.title || service.name,
        description: service.hero?.tagline || service.description,
        images: service.hero?.bgImage ? [{ url: service.hero.bgImage }] : [],
      },
    }
  }

  // 2. Fallback to check if it's a blog in MongoDB
  let blog = await getBlogFromDB(resolvedParams.slug)
  if (!blog) {
    // try local as absolute fallback
    blog = await getBlogBySlug(resolvedParams.slug)
  }
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
  
  // 1. Try Service
  let service = await getServiceFromDB(resolvedParams.slug)
  if (!service) service = getServiceBySlug(resolvedParams.slug)
  
  if (service) {
    return <ServiceDetailPage service={service} slug={resolvedParams.slug} />
  }

  // 2. Try Blog in MongoDB
  let blog = await getBlogFromDB(resolvedParams.slug)
  if (!blog) {
    // try local as absolute fallback
    blog = await getBlogBySlug(resolvedParams.slug)
  }
  if (blog && blog.status === 'published') {
    return <BlogPostPage slug={resolvedParams.slug} />
  }
  
  notFound()
}
