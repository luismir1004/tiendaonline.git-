import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET() {
  const payload = await getPayload({ config: configPromise })

  // 1. Obtener todos los productos publicados
  const products = await payload.find({
    collection: 'products',
    where: {
      _status: { equals: 'published' },
    },
    pagination: false,
    depth: 0,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  // 2. Base URL (Production)
  const baseUrl = 'https://mi-tienda-china-frontend.vercel.app' // Cambiar por dominio real

  // 3. Generar XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${products.docs
    .map((product) => {
      return `
  <url>
    <loc>${baseUrl}/producto/${product.slug}</loc>
    <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
    })
    .join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59',
    },
  })
}
