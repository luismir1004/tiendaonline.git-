import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Loader2, AlertTriangle, Zap, Clock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

import { useProduct } from '../hooks/useProducts';
import useCartStore from '../stores/cartStore';
import useHistoryStore from '../stores/historyStore';
import { cn } from '../lib/utils';
import SEO from '../components/SEO';

// --- Robust Icon Component ---
const DynamicIcon = ({ name, className }) => {
  const normalizedName = name ? name.charAt(0).toUpperCase() + name.slice(1) : '';
  const IconComponent = LucideIcons[normalizedName] || LucideIcons.Zap;
  return <IconComponent className={className} />;
};

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  const { data: product, isLoading, isError } = useProduct(slug);
  
  const addToCart = useCartStore((state) => state.addToCart);
  const { history, addToHistory } = useHistoryStore();

  const [activeImage, setActiveImage] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Scroll Reset
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Track History & Set Image
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      addToHistory(product);
    }
  }, [product, addToHistory]);

  const isOutOfStock = product?.stock <= 0;

  const handleAddToCart = async () => {
    if (!product || isOutOfStock) return;
    
    setIsAdding(true);
    
    // Confetti Effect for "Delight"
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f43f5e']
    });

    await new Promise(resolve => setTimeout(resolve, 500));
    
    addToCart(product, 1);
    setIsAdding(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
        <AlertTriangle className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Producto no encontrado</h1>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors"
        >
          Volver al catálogo
        </button>
      </div>
    );
  }

  // Filter current product from history to avoid redundancy in "Recent" list
  const recentProducts = history.filter(h => h.id !== product.id).slice(0, 4);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEO 
        title={product.name}
        description={product.description}
        image={product.image}
        type="product"
        price={product.price}
      />

      {/* Navigation Header */}
      <div className="sticky top-0 z-40 bg-slate-50/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium hidden sm:inline">Volver</span>
            </button>
            <h1 className="text-sm font-bold text-slate-900 uppercase tracking-widest truncate max-w-[200px] sm:max-w-none opacity-0 sm:opacity-100 transition-opacity">
                {product.name}
            </h1>
            <div className="w-8" /> 
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            
            {/* --- Left Column: Images --- */}
            <div className="flex flex-col gap-6">
                <div className="relative aspect-[4/5] bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 group">
                    <AnimatePresence mode="wait">
                        <motion.img 
                            key={activeImage || 'main'}
                            layoutId={activeImage === product.image ? `product-image-${product.id}` : undefined}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            src={activeImage || product.image} 
                            alt={product.name}
                            className="w-full h-full object-contain p-8 lg:p-12"
                        />
                    </AnimatePresence>
                    
                    {product.promotion && (
                        <div className="absolute top-6 left-6 bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                            Oferta
                        </div>
                    )}
                </div>

                {/* Thumbnails */}
                {product.images && product.images.length > 1 && (
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide justify-center">
                        {product.images.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImage(img)}
                                className={cn(
                                    "w-20 h-20 rounded-2xl border-2 overflow-hidden flex-shrink-0 bg-white p-2 transition-all duration-200",
                                    activeImage === img ? "border-slate-900 scale-105" : "border-transparent hover:border-slate-200"
                                )}
                            >
                                <img src={img} alt={`View ${idx}`} className="w-full h-full object-contain" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* --- Right Column: Info & Actions --- */}
            <div className="flex flex-col justify-center">
                <div className="mb-2">
                    <span className="text-indigo-600 font-bold uppercase tracking-widest text-xs">
                        {product.category || 'Tech'}
                    </span>
                </div>
                
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight"
                >
                    {product.name}
                </motion.h1>

                <div className="flex items-center gap-6 mb-8">
                    <span className="text-3xl font-light text-slate-900">
                        ${product.price?.toLocaleString()}
                    </span>
                    {isOutOfStock ? (
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-sm font-bold border border-red-100">Agotado</span>
                    ) : (
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 border border-emerald-100">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            {product.stock < 5 ? `¡Solo quedan ${product.stock}!` : 'En Stock'}
                        </span>
                    )}
                </div>

                <p className="text-lg text-slate-500 leading-relaxed mb-10 font-light">
                    {product.description}
                </p>

                {/* --- Smart Spec Grid System --- */}
                {product.specs && product.specs.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mb-10">
                        {product.specs.map((spec, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-5 flex items-center gap-4 hover:bg-white hover:shadow-sm transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-700 shadow-sm">
                                    <DynamicIcon name={spec.icon} className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{spec.label}</p>
                                    <p className="text-sm font-semibold text-slate-900">{spec.value}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* --- Actions --- */}
                <div className="flex items-center gap-4 pt-6 border-t border-slate-200 mt-auto">
                    <button
                        onClick={handleAddToCart}
                        disabled={isOutOfStock || isAdding}
                        className={cn(
                            "flex-1 h-14 rounded-full flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:active:scale-100 disabled:hover:shadow-none",
                            isOutOfStock 
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                                : "bg-slate-900 text-white hover:bg-indigo-600 border border-transparent"
                        )}
                    >
                        {isAdding ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                <ShoppingCart size={20} />
                                {isOutOfStock ? 'Stock Agotado' : 'Añadir al Carrito'}
                            </>
                        )}
                    </button>
                    
                    <button className="h-14 w-14 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all active:scale-90">
                        <LucideIcons.Heart size={22} />
                    </button>
                </div>
            </div>
        </div>

        {/* --- Recently Viewed (Persisted) --- */}
        {recentProducts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-8 text-slate-400">
                    <Clock size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest">Visto Recientemente</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {recentProducts.map((p) => (
                        <div 
                            key={p.id}
                            onClick={() => navigate(`/producto/${p.slug}`)}
                            className="group cursor-pointer"
                        >
                            <div className="aspect-square bg-white rounded-2xl border border-slate-100 p-4 mb-3 overflow-hidden transition-all group-hover:border-slate-300">
                                <img src={p.image} alt={p.name} className="w-full h-full object-contain transition-transform group-hover:scale-110" />
                            </div>
                            <h4 className="font-semibold text-slate-900 text-sm truncate">{p.name}</h4>
                            <p className="text-slate-500 text-xs mt-1">${p.price.toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;