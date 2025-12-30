import api from './api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// --- Image Optimization Logic ---
const getImageUrl = (image) => {
    if (!image) return '/placeholder.jpg';

    // 1. Handle Payload Media Object vs String URL
    let url = typeof image === 'string' ? image : image.url;

    // 2. Unsplash Optimization (CDN params)
    if (url.includes('images.unsplash.com')) {
        const separator = url.includes('?') ? '&' : '?';
        // Avoid double appending if already present
        if (!url.includes('auto=format')) {
            return `${url}${separator}auto=format&q=75&w=1000`;
        }
        return url;
    }

    // 3. Local Payload URL (ensure absolute path)
    if (url && !url.startsWith('http')) {
        return `${API_BASE_URL}${url}`;
    }

    return url;
};

// --- Data Transformation Layer ---
const transformProduct = (doc) => {
    // Price normalization: priority to priceInUSD, fallback to price
    const price = doc.priceInUSD || doc.price || 0;
    
    // Gallery mapping with optimization
    const images = doc.gallery?.map(item => getImageUrl(item.image)) || [];
    if (doc.meta?.image) {
        images.unshift(getImageUrl(doc.meta.image));
    }
    
    const mainImage = images.length > 0 ? images[0] : '/placeholder.jpg';

    // Specs Mapping: Direct pass-through of the new backend field
    // We filter out any incomplete specs to keep the UI clean
    let specs = [];
    if (doc.specs && Array.isArray(doc.specs)) {
        specs = doc.specs
            .filter(spec => spec.label && spec.value) // Robustness check
            .map(spec => ({
                label: spec.label,
                value: spec.value,
                icon: spec.icon || 'Info' // Default icon name string
            }));
    }

    // Category mapping
    const category = doc.categories && doc.categories.length > 0 
        ? (typeof doc.categories[0] === 'object' ? doc.categories[0].title : 'General') 
        : 'Tech';

    return {
        id: doc.id,
        slug: doc.slug,
        name: doc.title,
        price: price,
        // Stock Logic: 'inventory' comes from @payloadcms/plugin-ecommerce
        stock: typeof doc.inventory === 'number' ? doc.inventory : (doc.stock || 0),
        description: doc.meta?.description || 'Sin descripción disponible',
        images: images.length > 0 ? images : ['/placeholder.jpg'],
        image: mainImage,
        specs: specs,
        richText: doc.content,
        variants: doc.variants || [],
        category: category,
        promotion: doc.promotion || null
    };
};

export const getProducts = async (params = {}) => {
    try {
        const { data } = await api.get('/products', { params });
        return {
            docs: data.docs.map(transformProduct),
            totalDocs: data.totalDocs,
            totalPages: data.totalPages,
            page: data.page
        };
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

export const getProductBySlug = async (slug) => {
    try {
        const { data } = await api.get('/products', {
            params: {
                where: {
                    slug: {
                        equals: slug
                    }
                },
                limit: 1
            }
        });

        if (!data.docs || data.docs.length === 0) {
            return null;
        }

        return transformProduct(data.docs[0]);
    } catch (error) {
        console.error(`Error fetching product ${slug}:`, error);
        throw error;
    }
};

export const getProductsByIds = async (ids) => {
     try {
        const { data } = await api.get('/products', {
            params: {
                where: {
                    id: {
                        in: ids
                    }
                },
                limit: ids.length
            }
        });
        return data.docs.map(transformProduct);
    } catch (error) {
        console.error("Error fetching products by IDs:", error);
        return [];
    }
};