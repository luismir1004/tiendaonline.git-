// offerUtils.js
// Utilidades para garantizar coherencia en precios y assets visuales en la sección de ofertas.

/**
 * Formatea un número a moneda local (USD por defecto para este proyecto).
 * @param {number} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Calcula el precio final y valida la coherencia del descuento.
 * Prioriza el cálculo matemático sobre los datos crudos si hay inconsistencia.
 * @param {number} originalPrice 
 * @param {number} discountPercent 
 * @returns {object} { finalPrice, formattedFinal, formattedOriginal, savings }
 */
export const calculateOfferDetails = (originalPrice, discountPercent) => {
    const safeOriginal = Number(originalPrice) || 0;
    const safePercent = Number(discountPercent) || 0;

    // Calcular precio matemático
    const discountAmount = (safeOriginal * safePercent) / 100;
    const finalPrice = safeOriginal - discountAmount;

    return {
        finalPrice,
        formattedFinal: formatCurrency(finalPrice),
        formattedOriginal: formatCurrency(safeOriginal),
        savings: formatCurrency(discountAmount),
        isValid: safeOriginal > 0 && safePercent > 0
    };
};

/**
 * Banco de imágenes de alta calidad curadas por categoría.
 * Usamos Unsplash Source IDs directos para velocidad y calidad.
 */
const CATEGORY_IMAGES = {
    'Celulares': [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', // Phone in hand
        'https://images.unsplash.com/photo-1598327105666-5b89351aff70?q=80&w=800&auto=format&fit=crop', // Modern smartphone
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?q=80&w=800&auto=format&fit=crop', // Mobile UI
    ],
    'Audio': [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop', // Headphones
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop', // Earbuds
        'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=800&auto=format&fit=crop', // Speaker
    ],
    'Laptops': [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800&auto=format&fit=crop', // Laptop desk
        'https://images.unsplash.com/photo-1531297420492-8c4b6911797b?q=80&w=800&auto=format&fit=crop', // Tech workspace
        'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=800&auto=format&fit=crop', // Laptop screen
    ],
    'Default': [
        'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=800&auto=format&fit=crop', // Electronics
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=800&auto=format&fit=crop', // Gadgets
    ]
};

/**
 * Genera una URL de imagen determinista basada en el ID del producto.
 * Esto asegura que el mismo producto siempre tenga la misma imagen (sin parpadeos al recargar),
 * pero que sea distinta a otros productos de la misma categoría.
 * @param {object} product 
 */
export const resolveOfferImage = (product) => {
    // Si el producto ya tiene imagen real de API, úsala
    if (product.image && !product.image.includes('placeholder')) {
        return product.image;
    }

    const categoryKey = Object.keys(CATEGORY_IMAGES).find(key => 
        product.category?.includes(key)
    ) || 'Default';

    const images = CATEGORY_IMAGES[categoryKey];
    
    // Hash simple del ID string a un número para índice
    const idSum = (product.id || '0').toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = idSum % images.length;

    return images[index];
};

/**
 * Genera un porcentaje de stock vendido determinista pero realista para crear urgencia.
 * @param {string} id 
 * @returns {number} Porcentaje entre 40% y 95%
 */
export const getStockProgress = (id) => {
     const idSum = (id || '0').toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
     // Mapear a rango 40-95
     return 40 + (idSum % 56);
};