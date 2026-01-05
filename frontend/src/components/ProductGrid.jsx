import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SlidersHorizontal, ArrowDown, SearchX } from 'lucide-react';

import ProductCard from './ProductCard';
import SkeletonProduct from './SkeletonProduct';
import { useProducts } from '../hooks/useProducts';

// --- Constants ---
const PAGE_SIZE = 8;
const CATEGORIES = ['Todos', 'Celulares', 'Computación', 'Audio', 'Gaming', 'Ofertas'];

/**
 * ProductGrid: El orquestador del catálogo.
 * 
 * Architecture Features:
 * 1. URL-Driven State: El estado "verdad" vive en la URL, permitiendo compartir links filtrados.
 * 2. Client-Side Performance: Usamos un filtrado en memoria (ideal para <1000 items) para latencia cero.
 * 3. Infinite Scroll: Implementado con IntersectionObserver para UX fluida sin botones de "Ver más".
 */
const ProductGrid = () => {
  // 1. Data Fetching con Cache Inteligente
  // useProducts usa staleTime: 5min. Si el usuario navega y vuelve, 
  // la data estará ahí INSTANTÁNEAMENTE (sin loading spinners).
  const { data: allProducts = [], isLoading, isError } = useProducts();
  
  // 2. URL State Management
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'Todos';
  const isOffers = searchParams.get('filter') === 'offers';
  
  // 3. Local View State (Infinite Scroll)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  
  // Resetear scroll al cambiar de filtro
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    // Opcional: window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory, isOffers]);

  // 4. Filtrado Memoizado (High Performance)
  // Este cálculo solo corre si cambia la data o los filtros.
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    
    // Simular un poco de "processing" si fuera necesario
    let result = allProducts;

    if (activeCategory === 'Ofertas' || isOffers) {
        result = result.filter(p => p.promotion || p.isFeatured);
    } else if (activeCategory !== 'Todos') {
        result = result.filter(p => p.category === activeCategory);
    }
    
    // Aquí se podría añadir lógica de ordenamiento (Precio asc/desc) leyendo otro param
    return result;
  }, [allProducts, activeCategory, isOffers]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // 5. Infinite Scroll Trigger
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px', // Cargar antes de llegar al final
  });

  useEffect(() => {
    if (inView && hasMore) {
        // Pequeño delay artificial para que se "sienta" la carga y no sea un salto brusco
        const timeout = setTimeout(() => {
            setVisibleCount(prev => prev + 4);
        }, 300);
        return () => clearTimeout(timeout);
    }
  }, [inView, hasMore]);

  // --- Handlers ---
  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (cat === 'Todos') {
        newParams.delete('category');
        newParams.delete('filter');
    } else if (cat === 'Ofertas') {
        newParams.set('filter', 'offers');
        newParams.delete('category');
    } else {
        newParams.set('category', cat);
        newParams.delete('filter');
    }
    
    setSearchParams(newParams);
  };

  // --- Render ---

  // Loading State inicial (esqueletos full screen)
  if (isLoading && !allProducts.length) {
      return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonProduct key={i} />)}
          </div>
      );
  }

  if (isError) {
      return <div className="text-center py-20 text-red-500">Error cargando productos. Intenta recargar.</div>;
  }

  return (
    <section id="catalogo" className="w-full">
      {/* --- Sticky Filter Header --- */}
      <div className="sticky top-[64px] z-30 bg-slate-50/95 backdrop-blur-md py-4 mb-8 border-b border-slate-200 transition-all">
          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-2">
                  {CATEGORIES.map(cat => {
                      const isActive = cat === 'Ofertas' ? isOffers : (activeCategory === cat);
                      return (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`
                                relative px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300
                                ${isActive 
                                    ? 'bg-slate-900 text-white shadow-lg shadow-indigo-500/20 scale-105' 
                                    : 'bg-white text-slate-500 hover:bg-slate-100 border border-slate-200'}
                            `}
                        >
                            {cat}
                            {isActive && (
                                <motion.div 
                                    layoutId="activePill"
                                    className="absolute inset-0 rounded-full border-2 border-slate-900"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                      );
                  })}
              </div>
              
              {/* Botón extra de filtros (Visual) */}
              <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hidden sm:block">
                  <SlidersHorizontal size={18} />
              </button>
          </div>
      </div>

      {/* --- Product Grid --- */}
      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12"
      >
        <AnimatePresence mode="popLayout">
            {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </AnimatePresence>
        
        {/* Loading Skeletons for Infinite Scroll */}
        {hasMore && (
            <>
                <div ref={loadMoreRef} className="col-span-full h-1 w-full" /> {/* Trigger invisible */}
                {Array.from({ length: 2 }).map((_, i) => (
                     <div key={`skel-${i}`} className="opacity-50 scale-95">
                         <SkeletonProduct />
                     </div>
                ))}
            </>
        )}
      </motion.div>

      {/* --- Empty State --- */}
      {visibleProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <SearchX size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No encontramos resultados</h3>
              <p className="text-slate-500 max-w-md">
                  Intenta ajustar los filtros o buscar en otra categoría.
              </p>
              <button 
                onClick={() => handleCategoryChange('Todos')}
                className="mt-6 text-indigo-600 font-bold hover:underline"
              >
                  Ver todos los productos
              </button>
          </motion.div>
      )}
    </section>
  );
};

export default ProductGrid;