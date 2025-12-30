import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURACIÓN DE RUTAS PARA ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargamos el .env especificando la ruta absoluta hacia la raíz del backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
// ---------------------------------------

// Verifica que la clave se cargó
if (!process.env.PAYLOAD_SECRET) {
  console.error("❌ ERROR: PAYLOAD_SECRET no encontrado en el archivo .env");
  process.exit(1);
}

import { getPayload } from 'payload'
import fs from 'fs'

// --- CONSTANTS & CONFIG ---
const LOG_PREFIX = '\x1b[36m[SEED]\x1b[0m' // Cyan Color
const BATCH_SIZE = 20;
const TOTAL_PRODUCTS = 200;

const CATEGORIES = [
  { title: 'Celulares', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=75&w=800' },
  { title: 'Computación', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=75&w=800' },
  { title: 'Audio', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=75&w=800' },
  { title: 'Gaming', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=75&w=800' }
];

const ICONS = ['Cpu', 'Battery', 'Smartphone', 'Wifi', 'Camera', 'HardDrive', 'Zap', 'Speaker', 'Mic', 'Gamepad'];
const ADJECTIVES = ['Ultra', 'Neo', 'Prime', 'Elite', 'Max', 'Pro', 'Slim', 'Quantum', 'Fusion', 'Core'];
const VARIANTS = ['Midnight', 'Starlight', 'Carbon', 'Phantom', 'Silver', 'Gold', 'Forest', 'Deep Purple'];

// --- HELPERS ---

const downloadImageToBuffer = async (url: string): Promise<{ buffer: Buffer; filename: string; mimeType: string }> => {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const filename = `seed-${Date.now()}-${Math.floor(Math.random() * 1000)}.jpg`;
  return { buffer, filename, mimeType: 'image/jpeg' };
};

const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- MAIN SCRIPT ---

const seed = async () => {
  const start = Date.now();
  console.log(`${LOG_PREFIX} Starting database population...`);

  try {
    // 1. Initialize Payload
    const payload = await getPayload({ config: configPromise });

    // 2. Clean Database (Idempotency)
    console.log(`${LOG_PREFIX} Cleaning existing data...`);
    await payload.delete({ collection: 'products', where: { id: { exists: true } } });
    await payload.delete({ collection: 'categories', where: { id: { exists: true } } });
    // Note: We don't delete media to avoid leaving orphaned files on disk/cloud, 
    // but in a real dev reset you might want to.

    // 3. Create Categories & Upload Representative Media
    console.log(`${LOG_PREFIX} Creating categories and downloading assets...`);
    
    const categoryMap = new Map<string, string>(); // Name -> ID
    const mediaMap = new Map<string, string>(); // Category -> MediaID

    for (const cat of CATEGORIES) {
      // Create Category
      const catDoc = await payload.create({
        collection: 'categories',
        data: { title: cat.title },
      });
      categoryMap.set(cat.title, catDoc.id as string);

      // Upload Media for this category (to be reused by products)
      try {
        const { buffer, filename, mimeType } = await downloadImageToBuffer(cat.image);
        const mediaDoc = await payload.create({
          collection: 'media',
          data: {
            alt: `${cat.title} Representative Image`,
          },
          file: {
            data: buffer,
            name: filename,
            mimetype: mimeType,
            size: buffer.length,
          },
        });
        mediaMap.set(cat.title, mediaDoc.id as string);
      } catch (e) {
        console.warn(`${LOG_PREFIX} Failed to download image for ${cat.title}, using placeholder if available.`);
      }
    }

    // 4. Generate & Insert Products (Batch Processing)
    console.log(`${LOG_PREFIX} Generating ${TOTAL_PRODUCTS} products...`);
    
    const generatedProducts = [];
    
    // Generate Data in Memory first
    for (let i = 0; i < TOTAL_PRODUCTS; i++) {
      const categoryTitle = getRandomItem(CATEGORIES).title;
      const categoryId = categoryMap.get(categoryTitle);
      const mediaId = mediaMap.get(categoryTitle);
      
      const adj = getRandomItem(ADJECTIVES);
      const variant = getRandomItem(VARIANTS);
      const baseName = categoryTitle === 'Celulares' ? 'Horizon Phone' : 
                       categoryTitle === 'Computación' ? 'LuminaBook' : 
                       categoryTitle === 'Audio' ? 'SonicPulse' : 'NexusStation';
      
      const name = `${baseName} ${adj} - ${variant}`;
      const slug = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`;
      
      // Generate Specs based on Category
      let specs = [];
      if (categoryTitle === 'Celulares') {
        specs = [
            { label: 'Procesador', value: 'Snapdragon 8 Gen 3', icon: 'Cpu' },
            { label: 'Batería', value: `${getRandomInt(4000, 6000)}mAh`, icon: 'Battery' }
        ];
      } else if (categoryTitle === 'Computación') {
        specs = [
            { label: 'RAM', value: `${getRandomItem(['16', '32', '64'])}GB`, icon: 'Zap' },
            { label: 'Storage', value: '1TB SSD', icon: 'HardDrive' }
        ];
      } else {
         specs = [
            { label: 'Conexión', value: 'Wireless 5.0', icon: 'Wifi' },
            { label: 'Material', value: 'Carbon Fiber', icon: 'Zap' }
        ];
      }

      generatedProducts.push({
        title: name,
        slug: slug,
        priceInUSD: getRandomInt(100, 3000),
        inventory: getRandomInt(0, 100), // Stock
        categories: [categoryId],
        specs: specs,
        gallery: mediaId ? [{ image: mediaId }] : [], // Helper to map to gallery array
        meta: {
            description: `Experience the future with ${name}. Designed for professionals and enthusiasts alike.`,
            image: mediaId // Set SEO image too
        }
      });
    }

    // Insert in Batches
    let insertedCount = 0;
    for (let i = 0; i < generatedProducts.length; i += BATCH_SIZE) {
        const batch = generatedProducts.slice(i, i + BATCH_SIZE);
        
        await Promise.all(batch.map(product => 
             payload.create({
                collection: 'products',
                data: product,
            })
        ));
        
        insertedCount += batch.length;
        process.stdout.write(`\r${LOG_PREFIX} Progress: ${insertedCount}/${TOTAL_PRODUCTS} products created...`);
    }

    const duration = ((Date.now() - start) / 1000).toFixed(2);
    console.log(`\n${LOG_PREFIX} ✅ Success! Database populated in ${duration}s.`);
    process.exit(0);

  } catch (error) {
    console.error(`\n${LOG_PREFIX} ❌ Fatal Error:`, error);
    process.exit(1);
  }
};

seed();
