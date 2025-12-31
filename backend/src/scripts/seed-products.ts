import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import type { Product, Category } from '../payload-types';

// --- CONSTANTS ---
const LOG_PREFIX = '\x1b[36m[SEEDER]\x1b[0m';

// --- 1. CONFIGURACIÓN DEL ENTORNO (PRE-BOOT) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo .env (backend/.env)
const envPath = path.resolve(__dirname, '../../.env');

console.log(`${LOG_PREFIX} Configurando entorno...`);

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`${LOG_PREFIX} ✅ .env cargado desde: ${envPath}`);
} else {
    console.warn(`${LOG_PREFIX} ⚠️  No se encontró .env en ${envPath}`);
}

// Fallbacks críticos para desarrollo
if (!process.env.PAYLOAD_SECRET) {
    console.warn(`${LOG_PREFIX} ⚠️  PAYLOAD_SECRET faltante. Usando fallback.`);
    process.env.PAYLOAD_SECRET = 'SEED-SECRET-KEY-123';
}
if (!process.env.DATABASE_URI) {
    console.warn(`${LOG_PREFIX} ⚠️  DATABASE_URI faltante. Usando fallback SQLite.`);
    process.env.DATABASE_URI = 'file:./backend.db';
}

// --- 2. UTILIDADES ---
const BATCH_SIZE = 20;
const TOTAL_PRODUCTS = 200;

interface CategoryData {
  title: string;
  image: string;
}

const CATEGORIES_DATA: CategoryData[] = [
  { title: 'Celulares', image: 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=1000' },
  { title: 'Computación', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=1000' },
  { title: 'Audio', image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=1000' },
  { title: 'Gaming', image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=1000' }
];

const ADJECTIVES = ['Ultra', 'Neo', 'Prime', 'Elite', 'Max', 'Pro', 'Slim', 'Quantum', 'Fusion', 'Core'];
const VARIANTS = ['Midnight', 'Starlight', 'Carbon', 'Phantom', 'Silver', 'Gold', 'Forest', 'Deep Purple'];

const downloadImageToBuffer = async (url: string, retries = 3) => {
    if (!globalThis.fetch) throw new Error('Node 18+ required for fetch');

    for (let i = 0; i < retries; i++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const arrayBuffer = await response.arrayBuffer();
            const contentType = response.headers.get('content-type');
            
            return {
                buffer: Buffer.from(arrayBuffer),
                size: arrayBuffer.byteLength,
                mimeType: contentType && contentType.includes('/') ? contentType : 'image/jpeg',
            };
        } catch (err) {
            if (i === retries - 1) throw err;
            await new Promise(res => setTimeout(res, 1500));
        }
    }
    throw new Error('Download failed');
};

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// --- 3. LÓGICA PRINCIPAL ---
const seed = async () => {
    try {
        console.log(`${LOG_PREFIX} Importando Payload (Dinámico)...`);
        
        // Importación dinámica para garantizar que ENV esté listo
        const { getPayload } = await import('payload');
        
        // USA RUTA RELATIVA DIRECTA para evitar errores de alias (@payload-config) en scripts
        // Ajusta '../payload.config' si tu archivo de config tiene otro nombre
        const { default: configPromise } = await import('../payload.config');

        const payload = await getPayload({ config: configPromise });
        const shouldReset = process.argv.includes('--reset');

        console.log(`${LOG_PREFIX} Payload inicializado.`);

        // --- PASO A: LIMPIEZA ---
        if (shouldReset) {
            console.log(`${LOG_PREFIX} 🗑️  Modo RESET: Limpiando DB...`);
            try {
                // Borrar datos existentes (ignorando errores si está vacía)
                const deleteIfExist = async (slug: string) => {
                   try {
                     await payload.delete({ collection: slug as any, where: { id: { exists: true } } });
                   } catch (e) {}
                };
                
                await deleteIfExist('products');
                await deleteIfExist('media');
                await deleteIfExist('categories');
                console.log(`${LOG_PREFIX} DB Limpia.`);
            } catch (e) {
                console.warn(`${LOG_PREFIX} Aviso limpieza:`, e);
            }
        }

        // --- PASO B: CATEGORÍAS Y MEDIA ---
        console.log(`${LOG_PREFIX} 📦 Gestionando Assets...`);
        
        const categoryIds: Record<string, string | number> = {};
        const mediaIds: Record<string, string | number> = {};

        for (const catData of CATEGORIES_DATA) {
            // Categoría
            const existingCat = await payload.find({
                collection: 'categories',
                where: { title: { equals: catData.title } },
                limit: 1,
            });

            if (existingCat.docs.length > 0) {
                categoryIds[catData.title] = existingCat.docs[0].id;
            } else {
                const newCat = (await payload.create({
                    collection: 'categories',
                    data: { title: catData.title },
                })) as unknown as Category;
                categoryIds[catData.title] = newCat.id;
            }

            // Media
            const existingMedia = await payload.find({
                collection: 'media',
                where: { alt: { equals: `Cover for ${catData.title}` } },
                limit: 1,
            });

            if (existingMedia.docs.length > 0) {
                mediaIds[catData.title] = existingMedia.docs[0].id;
            } else {
                try {
                    const { buffer, size, mimeType } = await downloadImageToBuffer(catData.image);
                    const newMedia = await payload.create({
                        collection: 'media',
                        data: { alt: `Cover for ${catData.title}` },
                        file: {
                            data: buffer,
                            name: `${catData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`,
                            mimetype: mimeType,
                            size: size,
                        },
                    });
                    mediaIds[catData.title] = newMedia.id;
                } catch (err) {
                    console.error(`${LOG_PREFIX} Error imagen ${catData.title}:`, err);
                }
            }
        }

        // --- PASO C: GENERACIÓN ---
        console.log(`${LOG_PREFIX} ⚡ Generando datos (${TOTAL_PRODUCTS})...`);
        const productsToInsert: Partial<Product>[] = [];

        for (let i = 0; i < TOTAL_PRODUCTS; i++) {
            const catInfo = getRandomItem(CATEGORIES_DATA);
            const catId = categoryIds[catInfo.title];
            const mediaId = mediaIds[catInfo.title];

            const adj = getRandomItem(ADJECTIVES);
            const baseName = catInfo.title === 'Celulares' ? 'Horizon' :
                             catInfo.title === 'Computación' ? 'Lumina' : 'Nexus';
            
            const title = `${baseName} ${adj} ${1000 + i}`;
            const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            const gallery = mediaId ? [{ image: mediaId }] : [];

            productsToInsert.push({
                title,
                slug,
                priceInUSD: getRandomInt(50, 2000),
                inventory: getRandomInt(0, 100),
                categories: [catId as any],
                specs: [
                    { label: 'Estado', value: 'Nuevo', icon: 'Check' },
                    { label: 'Envío', value: 'Gratis', icon: 'Truck' }
                ],
                gallery: gallery as any,
                meta: {
                    title,
                    description: `Producto exclusivo ${title}`,
                    image: mediaId as any || null,
                },
                _status: 'published',
            });
        }

        // --- PASO D: BATCH INSERT ---
        console.log(`${LOG_PREFIX} 🚀 Insertando (Lotes de ${BATCH_SIZE})...
`);
        let processed = 0;

        for (let i = 0; i < productsToInsert.length; i += BATCH_SIZE) {
            const chunk = productsToInsert.slice(i, i + BATCH_SIZE);
            
            await Promise.all(chunk.map(async (p) => {
                try {
                    const existing = await payload.find({
                        collection: 'products',
                        where: { slug: { equals: p.slug } },
                        limit: 1,
                    });

                    if (existing.docs.length > 0) {
                        await payload.update({
                            collection: 'products',
                            id: existing.docs[0].id,
                            data: p as any,
                        });
                    } else {
                        await payload.create({
                            collection: 'products',
                            data: p as any,
                        });
                    }
                } catch (e: any) {
                    // Ignorar errores puntuales para no detener el proceso
                    // console.error(`Error item ${p.slug}: ${e.message}`);
                }
            }));
            
            processed += chunk.length;
            process.stdout.write(`\r${LOG_PREFIX} Progreso: ${Math.min(processed, TOTAL_PRODUCTS)}/${TOTAL_PRODUCTS}`);
        }

        console.log(`\n${LOG_PREFIX} ✅ SEED COMPLETADO.`);
        process.exit(0);

    } catch (error) {
        console.error(`\n${LOG_PREFIX} ❌ ERROR FATAL:`, error);
        process.exit(1);
    }
};

seed();