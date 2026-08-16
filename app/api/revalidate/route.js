import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Secret token to protect this endpoint — set REVALIDATE_SECRET in your Vercel env vars
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'azt-revalidate-2024'

export async function POST(req) {
  try {
    const body = await req.json()
    const { secret, slug, paths } = body

    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
    }

    const revalidated = []

    // Revalidate a single service slug
    if (slug) {
      revalidatePath(`/${slug}`)
      revalidated.push(`/${slug}`)
    }

    // Revalidate multiple paths at once
    if (paths && Array.isArray(paths)) {
      for (const p of paths) {
        revalidatePath(p)
        revalidated.push(p)
      }
    }

    // Always revalidate the services listing page
    revalidatePath('/services')
    revalidated.push('/services')

    return NextResponse.json({ revalidated, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
