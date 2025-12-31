import { useState, useEffect } from 'react';
import { mockProducts } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useProducts = () => {
  // Inicializamos con mockProducts para "Stale-While-Revalidate" (Carga instantánea)
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Mantenemos loading en true solo si queremos indicar actividad de red, 
        // pero para SWR visualmente ya mostramos datos.
        
        const response = await fetch(`${API_URL}/products?depth=1`);
        
        if (!response.ok) {
          throw new Error('Error al conectar con el servidor de Payload');
        }

        const data = await response.json();

        // Transformación de datos: Normalización
        const normalizedProducts = data.docs.map(doc => {
          // Lógica para manejar imágenes relativas de Payload
          let imageUrl = doc.image; // Fallback a lo que venga
          
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
            // Mantener otros campos originales si es necesario
          };
        });

        // Actualización silenciosa del estado con datos reales
        setProducts(normalizedProducts);
        setError(null);
      } catch (err) {
        console.error("Fallo al obtener productos reales, usando datos cacheados/mock:", err);
        setError(err.message);
        // No reseteamos products a vacio, mantenemos el mock/cache como fallback
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};

