
import { getPayload } from 'payload'
import config from '../payload.config'
import path from 'path'
import dotenv from 'dotenv'
import fs from 'fs'
import { fileURLToPath } from 'url'
import type { Payload } from 'payload'

// --- 1. Environment Setup ---
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Load .env from project root (../../.env relative to src/scripts/seed.ts)
dotenv.config({ path: path.resolve(dirname, '../../.env') })

// --- Constants & Mock Data Logic ---
const CATEGORIES = ['Celulares', 'Computación', 'Audio', 'Gaming']

const ICONS: Record<string, string> = {
  cpu: 'Cpu',
  battery: 'Battery',
  screen: 'Smartphone',
  wifi: 'Wifi',
  camera: 'Camera',
  storage: 'HardDrive',
  ram: 'Zap',
  sound: 'Speaker',
  mic: 'Mic',
  controller: 'Gamepad',
}

interface MockSpec {
  label: string
  value: string
  icon: string
}

interface MockProduct {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  category: string
  isNew: boolean
  isFeatured: boolean
  description: string
  image: string
  images: string[]
  specs: MockSpec[]
}

const heroProducts: MockProduct[] = [
  // --- CELULARES ---
  {
    id: 'phone-001',
    name: 'Horizon Note Series - Edition 13',
    slug: 'horizon-note-series-edition-13',
    price: 899.00,
    stock: 45,
    category: 'Celulares',
    isNew: true,
    isFeatured: true,
    description: "La culminación del diseño minimalista. El Horizon Note 13 redefine la fotografía móvil con su sensor de espectro completo y un acabado en titanio cepillado que se siente imposiblemente ligero.",
    image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=75&w=800',
    images: [
      'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=75&w=800',
      'https://images.unsplash.com/photo-1611791485440-24e8401cf186?auto=format&fit=crop&q=75&w=800'
    ],
    specs: [
      { label: 'Procesador', value: 'Quantum Snap 8 Gen 3', icon: ICONS.cpu },
      { label: 'Pantalla', value: '6.8" OLED 120Hz', icon: ICONS.screen },
      { label: 'Cámara', value: '200MP Wide', icon: ICONS.camera },
      { label: 'Batería', value: '5000mAh', icon: ICONS.battery },
    ]
  },
  {
    id: 'phone-002',
    name: 'Aether Pro Max - Titanium',
    slug: 'aether-pro-max-titanium',
    price: 1199.00,
    stock: 12,
    category: 'Celulares',
    isNew: true,
    isFeatured: true,
    description: "Forjado en titanio aeroespacial. El Aether Pro Max no es solo un teléfono, es una declaración de poder. Chip A17 Pro para gaming de consola en tu bolsillo.",
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=75&w=800',
    images: [
       'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=75&w=800',
       'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=75&w=800'
    ],
    specs: [
      { label: 'Chip', value: 'A17 Pro Neural', icon: ICONS.cpu },
      { label: 'Material', value: 'Titanio Grado 5', icon: ICONS.ram },
      { label: 'Almacenamiento', value: '1TB NVMe', icon: ICONS.storage },
    ]
  },
  
  // --- COMPUTACIÓN ---
  {
    id: 'comp-001',
    name: 'Lumina Air - M3 Silicon',
    slug: 'lumina-air-m3-silicon',
    price: 1499.00,
    stock: 20,
    category: 'Computación',
    isNew: true,
    isFeatured: true,
    description: "Tan ligero que olvidas que está ahí, hasta que lo enciendes. El Lumina Air con chip M3 ofrece 18 horas de batería y un silencio absoluto gracias a su diseño sin ventiladores.",
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=75&w=800',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=75&w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=75&w=800'
    ],
    specs: [
      { label: 'Chip', value: 'M3 8-Core', icon: ICONS.cpu },
      { label: 'Memoria', value: '16GB Unified', icon: ICONS.ram },
      { label: 'Peso', value: '1.24 kg', icon: ICONS.wifi },
    ]
  },
  {
    id: 'comp-002',
    name: 'Titan Blade 16 - RTX Edition',
    slug: 'titan-blade-16-rtx-edition',
    price: 2899.00,
    stock: 5,
    category: 'Computación',
    isNew: false,
    isFeatured: false,
    description: "Una bestia encadenada en un chasis de aluminio negro. Equipado con la RTX 4090, este portátil destroza cualquier benchmark de escritorio.",
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=75&w=800',
    images: [
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=75&w=800'
    ],
    specs: [
      { label: 'GPU', value: 'RTX 4090 16GB', icon: ICONS.cpu },
      { label: 'Pantalla', value: '240Hz OLED', icon: ICONS.screen },
      { label: 'RAM', value: '64GB DDR5', icon: ICONS.ram },
    ]
  },

  // --- AUDIO ---
  {
    id: 'audio-001',
    name: 'Silence X - Series 5',
    slug: 'silence-x-series-5',
    price: 349.00,
    stock: 100,
    category: 'Audio',
    isNew: false,
    isFeatured: true,
    description: "El mundo exterior desaparece. Nuestra cancelación de ruido adaptativa de quinta generación ajusta el silencio 500 veces por segundo.",
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=75&w=800',
    images: [
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=75&w=800'
    ],
    specs: [
      { label: 'Batería', value: '30 Horas', icon: ICONS.battery },
      { label: 'Cancelación', value: 'ANC Pro Gen 5', icon: ICONS.sound },
      { label: 'Drivers', value: '40mm Carbon', icon: ICONS.ram },
    ]
  },
  {
    id: 'audio-002',
    name: 'Pod Pro 2 - Type C',
    slug: 'pod-pro-2-type-c',
    price: 249.00,
    stock: 150,
    category: 'Audio',
    isNew: true,
    isFeatured: false,
    description: "Audio espacial que te rodea. Ahora con USB-C y resistencia al polvo IP54. La experiencia inalámbrica definitiva.",
    image: 'https://images.unsplash.com/photo-1603351154351-5cf99bc756f8?auto=format&fit=crop&q=75&w=800',
    images: [
        'https://images.unsplash.com/photo-1603351154351-5cf99bc756f8?auto=format&fit=crop&q=75&w=800'
    ],
    specs: [
      { label: 'Chip', value: 'H2 Audio', icon: ICONS.cpu },
      { label: 'Resistencia', value: 'IP54', icon: ICONS.wifi },
      { label: 'Estuche', value: 'MagSafe + USB-C', icon: ICONS.battery },
    ]
  },

  // --- GAMING ---
  {
    id: 'game-001',
    name: 'Nexus Console V - Core Edition',
    slug: 'nexus-console-v-core-edition',
    price: 499.00,
    stock: 8,
    category: 'Gaming',
    isNew: false,
    isFeatured: true,
    description: "Juega como nunca antes. Tiempos de carga inexistentes, retroalimentación háptica y audio 3D en una arquitectura personalizada RDNA 2.",
    image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=75&w=800',
    images: [
        'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=75&w=800'
    ],
    specs: [
      { label: 'SSD', value: '825GB Custom', icon: ICONS.storage },
      { label: 'Salida', value: '4K @ 120Hz', icon: ICONS.screen },
      { label: 'Mando', value: 'DualSense Haptic', icon: ICONS.controller },
    ]
  },
   {
    id: 'game-002',
    name: 'Switch OLED - Zelda Edition',
    slug: 'switch-oled-zelda-edition',
    price: 359.00,
    stock: 30,
    category: 'Gaming',
    isNew: true,
    isFeatured: false,
    description: "Pantalla vibrante de 7 pulgadas. Juega en modo portátil, sobremesa o TV. Edición limitada con grabados rúnicos dorados.",
    image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=75&w=800',
    images: [
        'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=75&w=800'
    ],
    specs: [
      { label: 'Pantalla', value: '7" OLED', icon: ICONS.screen },
      { label: 'Almacenamiento', value: '64GB', icon: ICONS.storage },
      { label: 'Modos', value: '3 en 1', icon: ICONS.controller },
    ]
  }
]

const ADJECTIVES = ['Ultra', 'Neo', 'Prime', 'Elite', 'Max', 'Pro', 'Slim', 'Quantum', 'Fusion', 'Core']
const VARIANTS = ['Midnight', 'Starlight', 'Carbon', 'Phantom', 'Silver', 'Gold', 'Forest', 'Deep Purple']

function generateProceduralProducts(count = 192): MockProduct[] {
  const generated: MockProduct[] = []
  
  for (let i = 0; i < count; i++) {
    const template = heroProducts[i % heroProducts.length]
    
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]
    const variant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
    const uniqueNum = i + 10
    
    const newName = `${template.name.split('-')[0].trim()} ${adj} - ${variant}`
    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    const priceModifier = 0.8 + (Math.random() * 0.4)
    const newPrice = Math.round(template.price * priceModifier * 100) / 100
    
    generated.push({
      ...template,
      id: `gen-${template.category.substring(0,3).toLowerCase()}-${uniqueNum}`,
      name: newName,
      slug: newSlug,
      price: newPrice,
      stock: Math.floor(Math.random() * 100),
      isNew: Math.random() > 0.8,
      isFeatured: Math.random() > 0.9,
    })
  }
  
  return generated
}

// --- Helper Functions ---

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
    return Buffer.from(await response.arrayBuffer())
  } catch (error) {
    console.error(`[SEED] Error downloading image ${url}:`, error)
    return null
  }
}

function createRichTextDescription(text: string) {
  return {
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: text,
              version: 1
            }
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          version: 1
        }
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1
    }
  }
}

// --- Main Seed Function ---

const seed = async () => {
  console.log('[SEED] Starting...')
  const payload: Payload = await getPayload({ config })

  // Check args for reset
  const args = process.argv.slice(2)
  if (args.includes('--reset')) {
    console.log('[SEED] Resetting database...')
    await payload.delete({ collection: 'products', where: {} })
    await payload.delete({ collection: 'categories', where: {} })
    // Note: Deleting media might be tricky due to file cleanup, but we can try removing docs
    // await payload.delete({ collection: 'media', where: {} }) 
    // Keeping media for now to save bandwidth/time if re-running without reset
  }

  // 1. Seed Categories
  const categoryMap = new Map<string, number | string>()
  
  for (const catName of CATEGORIES) {
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    
    // Check if exists
    const existing = await payload.find({
      collection: 'categories',
      where: { slug: { equals: slug } },
    })

    if (existing.docs.length > 0) {
      categoryMap.set(catName, existing.docs[0].id)
    } else {
      console.log(`[SEED] Creating category: ${catName}`)
      const newCat = await payload.create({
        collection: 'categories',
        data: {
          title: catName,
          slug,
        },
      })
      categoryMap.set(catName, newCat.id)
    }
  }

  // 2. Prepare Products
  const allProducts = [...heroProducts, ...generateProceduralProducts(192)]
  const imageCache = new Map<string, number | string>() // URL -> Media ID

  console.log(`[SEED] Preparing to seed ${allProducts.length} products...`)

  // 3. Batch Process
  const BATCH_SIZE = 20
  let createdCount = 0

  for (let i = 0; i < allProducts.length; i += BATCH_SIZE) {
    const batch = allProducts.slice(i, i + BATCH_SIZE)
    
    await Promise.all(batch.map(async (product) => {
      try {
        // Check if exists
        const existing = await payload.find({
          collection: 'products',
          where: { slug: { equals: product.slug } },
        })

        if (existing.docs.length > 0) {
          // Skip or update? Skip for idempotency
          return
        }

        // Handle Images
        const gallery: { image: number | string }[] = []
        
        // Process Main Image + Gallery Images
        // Mock data has 'image' (main) and 'images' (array). 
        // Payload 'gallery' is array of objects { image: ID }
        const uniqueUrls = new Set([product.image, ...product.images])
        
        for (const url of uniqueUrls) {
          let mediaId = imageCache.get(url)

          if (!mediaId) {
            // Check if media exists in DB by filename (simplified check) or just create new
            // Since we don't have filename in URL easily, we'll download.
            // But to avoid duplicates in DB if we re-run without reset, we might check DB?
            // For now, reliance on imageCache handles the current run. 
            // Cross-run idempotency for media is harder without storing source URL in Media collection.
            
            const buffer = await downloadImage(url)
            if (buffer) {
              const uploadedMedia = await payload.create({
                collection: 'media',
                data: {
                  alt: product.name, // Use product name as alt
                },
                file: {
                  data: buffer,
                  name: `${product.slug}-${Date.now()}.jpg`,
                  mimetype: 'image/jpeg',
                  size: buffer.length,
                },
              })
              mediaId = uploadedMedia.id
              imageCache.set(url, mediaId)
            }
          }

          if (mediaId) {
            gallery.push({ image: mediaId })
          }
        }

        // Create Product
        const catId = categoryMap.get(product.category)

        await payload.create({
          collection: 'products',
          data: {
            title: product.name,
            slug: product.slug,
            priceInUSD: product.price,
            priceInUSDEnabled: true,
            inventory: product.stock,
            description: createRichTextDescription(product.description),
            specs: product.specs.map(s => ({
              label: s.label,
              value: s.value,
              icon: s.icon
            })),
            categories: catId ? [catId] : [],
            gallery: gallery,
            meta: {
              title: product.name,
              description: product.description.substring(0, 150),
              // image: gallery[0]?.image // Optional: set meta image
            }
          },
        })

      } catch (err) {
        console.error(`[SEED] Error creating product ${product.slug}:`, err)
      }
    }))

    createdCount += batch.length
    console.log(`[SEED] ${Math.min(createdCount, allProducts.length)}/${allProducts.length} productos procesados...`)
  }

  console.log('[SEED] ¡Éxito total! Seeding finished.')
  process.exit(0)
}

seed()
