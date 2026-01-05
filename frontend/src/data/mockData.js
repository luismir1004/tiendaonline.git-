// TechNova Mock Data Generator
// Generates 200+ unique products based on "Signature Edition" branding logic.

const CATEGORIES = ['Celulares', 'Computación', 'Audio', 'Gaming'];

const ICONS = {
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
};

// --- Base "Hero" Products (High Quality Templates) ---
const heroProducts = [
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
];

// --- Procedural Generation Logic ---

const ADJECTIVES = ['Ultra', 'Neo', 'Prime', 'Elite', 'Max', 'Pro', 'Slim', 'Quantum', 'Fusion', 'Core'];
const VARIANTS = ['Midnight', 'Starlight', 'Carbon', 'Phantom', 'Silver', 'Gold', 'Forest', 'Deep Purple'];

/**
 * Helper: Random integer between min and max (inclusive)
 */
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Helper: Create a URL-friendly slug
 */
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

/**
 * Generates procedural products based on hero templates.
 * @param {number} count Number of products to generate
 * @returns {Array} Array of generated product objects
 */
function generateProceduralProducts(count = 200) {
  const generated = [];
  
  if (!heroProducts || heroProducts.length === 0) return generated;

  for (let i = 0; i < count; i++) {
    // 1. Pick a random base template to inherit category/image/specs
    const template = heroProducts[i % heroProducts.length];
    
    // Safety check for template and crucial properties
    if (!template || !template.name || !template.category) continue;

    // 2. Randomize Name Attributes
    const adj = ADJECTIVES[getRandomInt(0, ADJECTIVES.length - 1)];
    const variant = VARIANTS[getRandomInt(0, VARIANTS.length - 1)];
    
    // 3. Construct New Name & Slug
    // Example: "Horizon Note" + "Ultra" + "Midnight"
    const baseName = template.name.split('-')[0].trim(); 
    const newName = `${baseName} ${adj} - ${variant}`;
    const uniqueSuffix = 1000 + i; // Start from 1000 to avoid conflicts
    const newSlug = `${slugify(newName)}-${uniqueSuffix}`;

    // 4. Randomize Price (+/- 15%)
    // Factor between 0.85 and 1.15
    const priceFactor = 0.85 + (Math.random() * 0.30);
    const rawPrice = template.price * priceFactor;
    // Format: round to 2 decimals
    const newPrice = Math.round(rawPrice * 100) / 100;

    // 5. Randomize Stock
    const newStock = getRandomInt(0, 150);

    // 6. Build the Product Object
    // Critical: Create copies of arrays (images, specs) to avoid reference issues
    generated.push({
      ...template, // Inherit base properties
      id: `gen-${(template.category || 'misc').substring(0,3).toLowerCase()}-${uniqueSuffix}`,
      name: newName,
      slug: newSlug,
      price: newPrice,
      stock: newStock,
      isNew: Math.random() > 0.7, // 30% chance
      isFeatured: Math.random() > 0.9, // 10% chance
      // Explicitly copy arrays to be "falla-proof"
      images: template.images ? [...template.images] : [],
      specs: template.specs ? [...template.specs] : [],
    });
  }
  
  return generated;
}

// --- Exports ---

// Combined list of hand-crafted Hero products + Procedurally generated ones
export const allProducts = [
  ...heroProducts,
  ...generateProceduralProducts(200)
];

// CRITICAL FIX: Export mockProducts as alias for allProducts to match import in useProducts.js
export const mockProducts = allProducts;

// Export raw heroes if needed separately
export { heroProducts };

/**
 * Simulated API call to fetch products
 * @param {Object} params - Filter parameters
 * @returns {Promise} Resolves with paginated-like response
 */
export const getMockProducts = async (params) => {
    // Simulate network delay (300ms)
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...allProducts];
    
    // Safety check: Ensure we start with an array
    if (!Array.isArray(filtered)) filtered = [];

    // Filter by Category
    if (params?.category && params.category !== 'Todos') {
        filtered = filtered.filter(p => p.category === params.category);
    }
    
    // Filter by Featured
    if (params?.featured) {
        filtered = filtered.filter(p => p.isFeatured);
    }

    // Filter by Offers (Logic: Price < 500 or isFeatured as a proxy for this mock)
    if (params?.filter === 'offers') {
        filtered = filtered.filter(p => p.price < 500 || p.promotion);
    }

    return {
        docs: filtered, // Will be [] if no matches, never null/undefined
        totalDocs: filtered.length,
        totalPages: 1, // Mock pagination
        page: 1
    };
};