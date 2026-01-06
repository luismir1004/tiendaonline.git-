import React, { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SlidersHorizontal, SearchX } from 'lucide-react';

import ProductCard from './ProductCard';
import SkeletonProduct from './SkeletonProduct';
import { useProducts } from '../hooks/useProducts';
import { shuffleArray } from '../lib/imageUtils'; // Solo usamos shuffle si es necesario, normalize lo hace ProductImage

// --- Constants ---
const PAGE_SIZE = 8;
const CATEGORIES = ['Todos', 'Celulares', 'Computación', 'Audio', 'Gaming', 'Ofertas'];

/**
 * ProductGrid: Implementation updated for Performance Priorities.
 */
const ProductGrid = () => {
  const { data: rawProducts = [], isLoading, isError } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'Todos';
  const isOffers = searchParams.get('filter') === 'offers';
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeCategory, isOffers]);

  // Memoized Filtering
  const processedProducts = useMemo(() => {
    // Protección estricta contra datos no válidos (null, undefined, objetos no array)
    if (!rawProducts || !Array.isArray(rawProducts) || rawProducts.length === 0) return [];
    
    let filtered = rawProducts;
    
    try {
        if (activeCategory === 'Ofertas' || isOffers) {
            filtered = filtered.filter(p => p && (p.promotion || p.isFeatured));
        } else if (activeCategory !== 'Todos') {
            filtered = filtered.filter(p => p && p.category === activeCategory);
        }

        // Validación final antes del shuffle
        if (!Array.isArray(filtered)) return [];

        // No necesitamos normalizar imágenes aquí ya que ProductCard/ProductImage lo maneja atómicamente
        // Pero podemos hacer shuffle para variedad si es deseado
        return (typeof shuffleArray === 'function' && shuffleArray) ? shuffleArray(filtered) : filtered;
    } catch (err) {
        console.error("Error filtering products:", err);
        return [];
    }
  }, [rawProducts, activeCategory, isOffers]);

  const visibleProducts = processedProducts.slice(0, visibleCount);
  const hasMore = visibleCount < processedProducts.length;

  // Infinite Scroll
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  useEffect(() => {
    if (inView && hasMore) {
        const timeout = setTimeout(() => {
            setVisibleCount(prev => prev + 4);
        }, 300);
        return () => clearTimeout(timeout);
    }
  }, [inView, hasMore]);

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'Todos') {
        newParams.delete('category'); newParams.delete('filter');
    } else if (cat === 'Ofertas') {
        newParams.set('filter', 'offers'); newParams.delete('category');
    } else {
        newParams.set('category', cat); newParams.delete('filter');
    }
    setSearchParams(newParams);
  };

  if (isLoading && !rawProducts.length) {
      return (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonProduct key={i} />)}
          </div>
      );
  }

  if (isError) {
      return <div className="text-center py-20 text-red-500">Error cargando productos.</div>;
  }

  return (
    <section id="catalogo" className="w-full">
      {/* Filters */}
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
              <button className="p-2.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hidden sm:block">
                  <SlidersHorizontal size={18} />
              </button>
          </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-8 md:gap-y-12"
      >
        <AnimatePresence mode="popLayout">
            {visibleProducts.map((product, index) => (
                <ProductCard 
                    key={product.id} 
                    product={product} 
                    index={index} // CRÍTICO: Pasamos el índice para calcular prioridad
                />
            ))}
        </AnimatePresence>
        
        {hasMore && (
            <>
                <div ref={loadMoreRef} className="col-span-full h-1 w-full" />
                {Array.from({ length: 2 }).map((_, i) => (
                     <div key={`skel-${i}`} className="opacity-50 scale-95">
                         <SkeletonProduct />
                     </div>
                ))}
            </>
        )}
      </motion.div>

      {visibleProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <SearchX size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No encontramos resultados</h3>
              <button onClick={() => handleCategoryChange('Todos')} className="mt-6 text-indigo-600 font-bold hover:underline">
                  Ver todos los productos
              </button>
          </div>
      )}
    </section>
  );
};

export default ProductGrid;