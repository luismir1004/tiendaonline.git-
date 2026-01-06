import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Loader2, Heart, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useWishlistStore from '../stores/wishlistStore';
import useCompareStore from '../stores/compareStore';
import ProductImage from './ProductImage';

/**
 * ProductCard Pro - Architect Approved
 */
const ProductCard = ({ product, index = 10 }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare } = useCompareStore();

  const [addStatus, setAddStatus] = useState('idle');

  // Validación básica: Si no hay producto, no renderizar nada (evita crash)
  if (!product || !product.id) return null;

  // Lógica de Prioridad LCP: Solo las 2 primeras tarjetas
  const isHighPriority = index < 2;
  const isLiked = isInWishlist(product.id);

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    if (addStatus !== 'idle' || product.stock === 0) return;
    setAddStatus('loading');
    
    // Optimistic UI Delay (simulado para UX)
    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    addToCart(product);
    setAddStatus('success');
    setTimeout(() => setAddStatus('idle'), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "100px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative flex flex-col w-full h-full cursor-pointer active:scale-95 transition-transform duration-200"
      onClick={() => navigate(`/producto/${product.slug}`)}
    >
      {/* --- Visual Stage (Fixed Aspect Ratio 4/5) --- */}
      <div className="relative w-full aspect-[4/5] rounded-3xl md:rounded-[2rem] overflow-hidden bg-slate-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-30 flex flex-col gap-2 pointer-events-none">
           {product.promotion && (
             <span className="bg-slate-900/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
               Sale
             </span>
           )}
           {product.isNew && !product.promotion && (
             <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
               Nuevo
             </span>
           )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <button 
                onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                className={`p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-transform hover:scale-110 active:scale-90 ${isLiked ? 'bg-red-50 text-red-500' : 'bg-white/90 text-slate-500 hover:text-slate-900'}`}
            >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); addToCompare(product); }}
                className="p-2.5 rounded-full bg-white/90 shadow-lg text-slate-500 hover:text-indigo-600 backdrop-blur-sm hover:scale-110 active:scale-90 transition-transform"
            >
                <BarChart2 size={16} />
            </button>
        </div>

        {/* --- Image Engine Integration --- */}
        <ProductImage 
            product={product} 
            priority={isHighPriority}
            alt={product.name}
        />

        {/* Stock Overlay */}
        {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-40 flex items-center justify-center">
                <span className="border-2 border-slate-900 px-4 py-2 font-bold text-slate-900 tracking-widest uppercase text-xs">Agotado</span>
            </div>
        )}
      </div>

      {/* --- Minimalist Info --- */}
      <div className="mt-4 px-1 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[60%]">
                {product.category || 'General'}
            </p>
            <span className="text-sm font-bold text-slate-900">
                ${product.price?.toLocaleString()}
            </span>
        </div>
        
        <h3 className="text-sm font-medium text-slate-700 leading-snug tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[2.5rem] mb-3">
            {product.name}
        </h3>

        <div className="mt-auto">
             <button
                onClick={handleQuickAdd}
                disabled={product.stock === 0}
                className={`
                    w-full py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300
                    ${product.stock === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 
                      addStatus === 'success' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                      'bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98]'}
                `}
            >
                <AnimatePresence mode="wait">
                    {addStatus === 'idle' && (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                             Añadir al carrito
                        </motion.span>
                    )}
                    {addStatus === 'loading' && (
                        <motion.div key="loading" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Loader2 size={16} className="animate-spin" />
                        </motion.div>
                    )}
                    {addStatus === 'success' && (
                        <motion.span key="success" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                            <Check size={16} /> Agregado
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);