import { useState, useEffect } from 'react';
import { mockProducts } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper para normalizar un producto individual
const normalizeProduct = (doc) => {
  let imageUrl = doc.image; // Fallback
  
  if (doc.media && doc.media.url) {
      // Si viene de Payload Media, construir URL absoluta si es relativa
      imageUrl = doc.media.url.startsWith('http') 
        ? doc.media.url 
        : `${API_URL.replace('/api', '')}${doc.media.url}`;
  }

  return {
    ...doc,
    id: doc.id,
    name: doc.name || doc.title, // Payload a veces usa 'title'
    price: doc.price,
    category: doc.category?.name || doc.category?.title || 'General',
    image: imageUrl,
  };
};

export const useProducts = () => {
  // Inicializamos con mockProducts para "Stale-While-Revalidate" (Carga instantánea)
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products?depth=1`);
        
        if (!response.ok) {
          throw new Error('Error al conectar con el servidor de Payload');
        }

        const data = await response.json();
        const normalizedProducts = data.docs.map(normalizeProduct);

        setProducts(normalizedProducts);
        setError(null);
      } catch (err) {
        console.error("Fallo al obtener productos reales, usando datos cacheados/mock:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

export const useProduct = (slug) => {
  // Inicializar con mock si existe
  const initialData = mockProducts.find(p => p.slug === slug) || null;
  const [product, setProduct] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        // Consulta a Payload filtrando por slug
        const response = await fetch(`${API_URL}/products?where[slug][equals]=${slug}&depth=1`);
        
        if (!response.ok) {
           throw new Error('Error al conectar con el servidor');
        }

        const data = await response.json();

        if (data.docs && data.docs.length > 0) {
          const normalized = normalizeProduct(data.docs[0]);
          setProduct(normalized);
          setError(null);
        } else {
          // Si no se encuentra en API y no teniamos mock, es 404 real
          if (!initialData) setError('Producto no encontrado');
        }
      } catch (err) {
        console.error(`Error fetching product ${slug}:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, initialData]);

  return { product, loading, error };
};


