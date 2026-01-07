// --- Hashing & Seeds ---
export const hashCode = (str) => {
  const safeStr = String(str || '');
  let hash = 0;
  if (!safeStr) return hash;
  for (let i = 0; i < safeStr.length; i++) {
    const char = safeStr.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

// --- Optimizador de URLs de Imágenes ---

/**
 * Optimiza URLs de Unsplash y otras fuentes para carga más rápida
 * @param {string} url - URL original de la imagen
 * @param {object} options - Opciones de optimización
 * @returns {string} - URL optimizada
 */
export const optimizeImageUrl = (url, options = {}) => {
  if (!url || typeof url !== 'string') return url;

  const {
    width = 600,      // Ancho óptimo para ProductCard
    quality = 75,     // Calidad balanceada (75-85 es óptimo)
    format = 'auto'   // Formato automático (WebP cuando sea posible)
  } = options;

  try {
    // Optimizar URLs de Unsplash
    if (url.includes('unsplash.com')) {
      const urlObj = new URL(url);
      // Agregar parámetros de optimización de Unsplash
      urlObj.searchParams.set('w', width);
      urlObj.searchParams.set('q', quality);
      urlObj.searchParams.set('fm', format);
      urlObj.searchParams.set('fit', 'crop');
      urlObj.searchParams.set('auto', 'format'); // Formato automático
      return urlObj.toString();
    }

    // Para Picsum y otras URLs, devolver sin cambios
    // (Picsum ya tiene el tamaño correcto en generateUniqueImage)
    return url;
  } catch (error) {
    // Si hay error parseando la URL, devolver original
    console.warn('[imageUtils] Error optimizing URL:', error);
    return url;
  }
};

// --- Generadores de Assets Visuales ---

// Generador de URL Determinista (Anti-Duplicados)
export const generateUniqueImage = (product) => {
  // Guard clause para productos inválidos
  if (!product || !product.id) return 'https://picsum.photos/600/750';

  const name = String(product.name || 'product');
  const safeName = name.replace(/\s+/g, '-').toLowerCase();
  const seed = `${product.id}-${safeName}`;

  // Tamaño optimizado para ProductCard (600x750 = aspect ratio 4:5)
  return `https://picsum.photos/seed/${seed}/600/750`;
};

// Generador de Degradado CSS
export const generateFallbackGradient = (product) => {
  const seed = hashCode(product?.id || 'default');
  const h1 = seed % 360;
  const h2 = (h1 + 60) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 20%, 94%) 0%, hsl(${h2}, 30%, 96%) 100%)`;
};

// --- Normalizadores ---

export const resolveProductImage = (product) => {
  if (!product) return { primary: '', backup: '', gradient: '#eee' };

  const backup = generateUniqueImage(product);

  // Prioridad: images[0] > image > backup
  const rawPrimary = Array.isArray(product.images) && product.images.length > 0
    ? product.images[0]
    : (product.image || backup);

  // Optimizar la imagen primaria
  const optimizedPrimary = optimizeImageUrl(rawPrimary, {
    width: 600,
    quality: 80,
    format: 'auto'
  });

  return {
    primary: optimizedPrimary,
    backup: backup,
    gradient: generateFallbackGradient(product)
  };
};

// --- COMPATIBILIDAD LEGACY (CRÍTICO PARA EVITAR WSOD) ---

// Restauramos esta exportación que usan otros componentes antiguos
export const getDeterministicImage = (seed) => {
  return `https://picsum.photos/seed/${seed}/800/1000`;
};

// Restauramos shuffleArray para ProductGrid
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Restauramos normalizeProductImages para ProductGrid
export const normalizeProductImages = (product) => {
  const visuals = resolveProductImage(product);
  return {
    ...product,
    processedImages: [visuals.primary, visuals.backup],
    placeholderColor: visuals.gradient
  };
};