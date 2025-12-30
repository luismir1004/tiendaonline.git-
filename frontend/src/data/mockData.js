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

function generateProceduralProducts(count = 192) {
  const generated = [];
  
  for (let i = 0; i < count; i++) {
    // Pick a random base template
    const template = heroProducts[i % heroProducts.length];
    
    // Create Unique Attributes
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const variant = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
    const uniqueNum = i + 10;
    
    // Mutate Data
    const newName = `${template.name.split('-')[0].trim()} ${adj} - ${variant}`;
    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const priceModifier = 0.8 + (Math.random() * 0.4); // +/- 20% price variation
    const newPrice = Math.round(template.price * priceModifier * 100) / 100; // Round to 2 decimals
    
    generated.push({
      ...template,
      id: `gen-${template.category.substring(0,3).toLowerCase()}-${uniqueNum}`,
      name: newName,
      slug: newSlug,
      price: newPrice,
      stock: Math.floor(Math.random() * 100), // Random stock 0-100
      isNew: Math.random() > 0.8, // 20% chance of being new
      isFeatured: Math.random() > 0.9, // 10% chance of being featured
      // Keep description and specs from template but maybe vary one spec in future
    });
  }
  
  return generated;
}

// Export Combined Data
export const mockProducts = [
  ...heroProducts,
  ...generateProceduralProducts(192) // Generate remaining to reach ~200
];

// Helper to get products (Simulates API)
export const getMockProducts = async (params) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let filtered = [...mockProducts];
    
    if (params?.category && params.category !== 'Todos') {
        filtered = filtered.filter(p => p.category === params.category);
    }
    
    if (params?.featured) {
        filtered = filtered.filter(p => p.isFeatured);
    }

    return {
        docs: filtered,
        totalDocs: filtered.length,
        totalPages: 1,
        page: 1
    };
};
