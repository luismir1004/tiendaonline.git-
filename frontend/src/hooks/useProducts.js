import { useQuery } from '@tanstack/react-query';
import { mockProducts } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper de normalización para asegurar consistencia entre Mock y API
const normalizeProduct = (doc) => {
  if (!doc) return null; // Guard clause para documentos vacíos

  let imageUrl = doc.image;
  
  if (doc.media && doc.media.url) {
      // Si viene de Payload Media, construir URL absoluta si es relativa
      imageUrl = doc.media.url.startsWith('http') 
        ? doc.media.url 
        : `${API_URL.replace('/api', '')}${doc.media.url}`;
  }

  // Normalización defensiva: valores por defecto para evitar crashes
  return {
    ...doc,
    id: doc.id,
    name: doc.name || doc.title || 'Producto sin nombre',
    price: typeof doc.price === 'number' ? doc.price : 0,
    category: doc.category?.name || doc.category?.title || 'General',
    image: imageUrl || '/placeholder.jpg',
    promotion: doc.promotion || false,
    stock: typeof doc.stock === 'number' ? doc.stock : 100, // Stock por defecto si no viene
  };
};

const fetchProducts = async () => {
  const response = await fetch(`${API_URL}/products?depth=1`);
  if (!response.ok) {
    throw new Error('Error al conectar con el servidor de Payload');
  }
  const data = await response.json();
  // Validación extra: asegurar que docs existe y filtrar nulos
  return (data?.docs || []).map(normalizeProduct).filter(Boolean);
};

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    // Hybrid Data Strategy: Usar mock data mientras carga o si falla la API
    // initialData proporciona renderizado instantáneo (SSR-like behavior en cliente)
    initialData: mockProducts, 
    staleTime: 1000 * 60 * 5, // 5 minutos sin refetch en background
    retry: 1, // Reintentar solo 1 vez para fallar rápido a UI de error si es necesario
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/products?where[slug][equals]=${slug}&depth=1`);
      
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      
      const data = await response.json();
      if (!data.docs || data.docs.length === 0) throw new Error('Producto no encontrado');
      
      return normalizeProduct(data.docs[0]);
    },
    enabled: !!slug, // Evita queries vacías si slug es undefined
    // Intentar buscar en el mock existente para renderizado optimista
    initialData: () => mockProducts.find(p => p.slug === slug),
    staleTime: 1000 * 60 * 30, // 30 minutos para detalles de producto
  });
};