import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';

import ProductCard from '../components/ProductCard';
import SkeletonProduct from '../components/SkeletonProduct';
import SlideOverCart from '../components/SlideOverCart';
import QuickViewModal from '../components/QuickViewModal';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import { useProducts } from '../hooks/useProducts';

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL State
  const categoryParam = searchParams.get('category');
  const isOffersFilter = searchParams.get('filter') === 'offers';

  // Local UI State
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'Todos');
  const [visibleCount, setVisibleCount] = useState(8); // Infinite Scroll Logic
  const [quickViewProduct, setQuickViewProduct] = useState(null); // Modal State

  // Update local state if URL changes (Back/Forward navigation)
  useEffect(() => {
     if (isOffersFilter) setSelectedCategory('Ofertas');
     else setSelectedCategory(categoryParam || 'Todos');
  }, [categoryParam, isOffersFilter]);

  // Data Fetching: Integración corregida con TanStack Query
  // data viene por defecto como mockProducts gracias a initialData en el hook
  const { data: products = [], isLoading, isError } = useProducts();

  // --- 1. Zero-Latency Filtering (Memoized) ---
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products) || products.length === 0) return [];
    
    // Filtrado defensivo: asegurar que p existe
    const validProducts = products.filter(p => p && p.id);
    let result = validProducts;

    if (selectedCategory === 'Ofertas') {
        result = result.filter(p => p.promotion);
    } else if (selectedCategory !== 'Todos') {
        result = result.filter(p => p.category === selectedCategory);
    }

    return result;
  }, [products, selectedCategory]);

  // --- 2. Infinite Scroll Slice ---
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleProducts.length < filteredProducts.length;

  // Derive Categories dinámicamente
  const categories = useMemo(() => {
      if (!products || !Array.isArray(products) || products.length === 0) return ['Todos'];
      // Validación defensiva en el map
      const uniqueCats = [...new Set(products.filter(p => p && p.category).map(p => p.category))];
      return ['Todos', 'Ofertas', ...uniqueCats];
  }, [products]);

  // Handlers
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setVisibleCount(8); // Reset pagination on filter change
    
    // Sync with URL
    const newParams = {};
    if (cat === 'Ofertas') newParams.filter = 'offers';
    else if (cat !== 'Todos') newParams.category = cat;
    setSearchParams(newParams);
  };

  const handleLoadMore = () => {
      setVisibleCount(prev => prev + 4);
  };

  // Lógica de carga: Solo mostramos esqueletos si está cargando Y no tenemos datos (ni mock ni reales)
  const showSkeletons = isLoading && (!products || products.length === 0);

  return (
    <div className="bg-slate-50 min-h-screen">
      <SEO title="Inicio | TechNova" description="Tecnología premium y diseño minimalista." />
      
      <SlideOverCart />
      <QuickViewModal 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        product={quickViewProduct} 
      />
      
      <Hero />

      <div id="products" className="py-16 lg:py-24 max-w-7xl mx-auto px-6 lg:px-20">
          
          {/* Header & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Nuestra Selección</h2>
                  <p className="text-slate-500 mt-2 font-light">Diseño excepcional para tu día a día.</p>
              </div>
              
              {/* Category Pills */}
              <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 scrollbar-hide">
                  {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryChange(cat)}
                        className={`
                            whitespace-nowrap px-4 py-3 rounded-full text-sm font-medium transition-all duration-300 border min-h-[44px]
                            ${selectedCategory === cat 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-lg scale-105' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
                        `}
                      >
                          {cat === 'Ofertas' ? '🔥 Ofertas' : cat}
                      </button>
                  ))}
              </div>
          </div>

          {/* Grid Area */}
          <motion.div 
            layout 
            className="grid grid-cols-1 min-[450px]:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12"
          >
            <AnimatePresence mode="popLayout">
                {showSkeletons ? (
                    Array.from({ length: 8 }).map((_, i) => <SkeletonProduct key={i} />)
                ) : (
                    visibleProducts.map((product, index) => (
                        <ProductCard 
                            key={product.id} 
                            product={product} 
                            index={index}
                            onQuickView={setQuickViewProduct}
                        />
                    ))
                )}
            </AnimatePresence>
          </motion.div>
          
          {/* Empty State */}
          {!showSkeletons && visibleProducts.length === 0 && (
              <div className="py-20 text-center">
                  <p className="text-slate-400 text-lg">No hay productos en esta categoría.</p>
                  <button onClick={() => handleCategoryChange('Todos')} className="mt-4 text-indigo-600 font-medium hover:underline">Ver todo el catálogo</button>
              </div>
          )}

          {/* Load More Trigger */}
          {hasMore && !showSkeletons && (
              <div className="mt-16 flex justify-center">
                  <button 
                    onClick={handleLoadMore}
                    className="group flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full text-slate-600 font-medium hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-md"
                  >
                      Ver más productos
                      <ArrowDown size={16} className="group-hover:translate-y-1 transition-transform" />
                  </button>
              </div>
          )}
      </div>
    </div>
  );
};

export default HomePage;