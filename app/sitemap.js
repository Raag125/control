import fs from 'node:fs'
import path from 'node:path'

const BASE_URL = 'https://pestcontrolbengaluru.in'

export default async function sitemap() {
  const staticRoutes = [
    '',
    '/about-us',
    '/services',
    '/residential-pest-control',
    '/commercial-pest-control',
    '/bed-bugs-treatment',
    '/termite-treatment',
    '/pre-construction-termite-treatment',
    '/post-construction-termite-treatment',
    '/cockroach-treatment',
    '/general-pest-control',
    '/ant-pest-control',
    '/tick-pest-control',
    '/flea-pest-control',
    '/mosquito-treatment',
    '/rodent-treatment',
    '/wood-borer-treatment',
    '/honey-bee-treatment',
    '/franchise',
    '/faq',
    '/contact',
    '/blogs',
  ]

  const staticEntries = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' || route === '/blogs' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/blogs') ? 0.8 : 0.9,
  }))

  let blogEntries = []
  try {
    const blogsFilePath = path.resolve(process.cwd(), 'src/admin/blogsData.json')
    if (fs.existsSync(blogsFilePath)) {
      const blogsData = JSON.parse(fs.readFileSync(blogsFilePath, 'utf-8'))
      blogEntries = blogsData
        .filter((b) => b.status === 'published' && b.slug)
        .map((b) => ({
          url: `${BASE_URL}/${b.slug}`,
          lastModified: b.date || new Date().toISOString(),
          changeFrequency: 'monthly',
          priority: 0.7,
        }))
    }
  } catch (err) {
    console.error('Error generating blog sitemap entries:', err)
  }

  return [...staticEntries, ...blogEntries]
}
