import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Loader2, Heart, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useWishlistStore from '../stores/wishlistStore';
import useCompareStore from '../stores/compareStore';

/**
 * ProductCard Pro
 * Diseño "High-End" con micro-interacciones refinadas.
 * 
 * UX Decisions:
 * 1. Mobile-First: Hover deshabilitado en touch devices para evitar "doble tap".
 * 2. Feedback Inmediato: El botón de añadir tiene estados visuales claros (Idle -> Loading -> Success).
 * 3. Imagen Interactiva: Cross-fade suave a la segunda imagen en desktop para mostrar más contexto.
 */
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare } = useCompareStore();

  // Estados Locales de Interacción
  const [isHovered, setIsHovered] = useState(false);
  const [addStatus, setAddStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  // Determinar imágenes (Defensivo: fallback si no hay array)
  const images = product.images?.length > 0 ? product.images : [product.image];
  const primaryImage = images[0];
  const secondaryImage = images[1] || primaryImage;
  
  // En móvil usamos siempre la primaria. En desktop, si hay hover y existe segunda imagen, hacemos swap.
  const shouldShowSecondary = isHovered && images.length > 1;

  const handleQuickAdd = async (e) => {
    e.stopPropagation(); // Evitar navegar al producto
    if (addStatus !== 'idle' || product.stock === 0) return;

    setAddStatus('loading');

    // Simulamos latencia de red para dar peso a la acción (UX Psychology)
    await new Promise(resolve => setTimeout(resolve, 600));

    addToCart(product);
    setAddStatus('success');

    // Resetear estado después del feedback positivo
    setTimeout(() => setAddStatus('idle'), 2000);
  };

  const isLiked = isInWishlist(product.id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group relative flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden cursor-pointer hover:shadow-xl hover:border-slate-200 transition-all duration-500 will-change-transform"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/producto/${product.slug}`)}
    >
      {/* --- Image Stage --- */}
      <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
        {/* Badge: New / Promo */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
           {product.promotion && (
             <span className="bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
               Sale
             </span>
           )}
           {product.isNew && !product.promotion && (
             <span className="bg-white/90 backdrop-blur text-slate-900 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
               Nuevo
             </span>
           )}
        </div>

        {/* Floating Actions (Desktop Hover Only) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <button 
                onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                className={`p-2.5 rounded-full shadow-md hover:scale-110 transition-transform ${isLiked ? 'bg-red-50 text-red-500' : 'bg-white text-slate-400 hover:text-slate-900'}`}
            >
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); addToCompare(product); }}
                className="p-2.5 rounded-full bg-white text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 shadow-md hover:scale-110 transition-transform"
            >
                <BarChart2 size={18} />
            </button>
        </div>

        {/* Smart Image Layering for Cross-Fade */}
        <div className="w-full h-full relative">
            {/* Primary Image */}
            <img 
                src={primaryImage} 
                alt={product.name}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${shouldShowSecondary ? 'opacity-0' : 'opacity-100'}`}
                loading="lazy"
            />
            {/* Secondary Image (Preloaded implicitly by being in DOM) */}
            {images.length > 1 && (
                <img 
                    src={secondaryImage} 
                    alt={`${product.name} alternate`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out scale-105 ${shouldShowSecondary ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                />
            )}
        </div>

        {/* Out of Stock Overlay */}
        {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                <span className="border-2 border-slate-900 px-4 py-2 font-bold text-slate-900 tracking-widest uppercase text-sm">Agotado</span>
            </div>
        )}
      </div>

      {/* --- Product Info --- */}
      <div className="p-6 flex flex-col flex-grow relative">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            {product.category}
        </p>
        
        <h3 className="text-base font-medium text-slate-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors duration-300">
            {product.name}
        </h3>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-50">
            <span className="text-lg font-bold text-slate-900">
                ${product.price.toLocaleString()}
            </span>

            {/* Smart Action Button */}
            <button
                onClick={handleQuickAdd}
                disabled={product.stock === 0}
                className={`
                    relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                    ${product.stock === 0 ? 'bg-slate-100 text-slate-300 cursor-not-allowed' : 
                      addStatus === 'success' ? 'bg-emerald-500 text-white scale-110' : 
                      'bg-slate-900 text-white hover:bg-indigo-600 hover:scale-105 active:scale-95'}
                `}
                aria-label="Añadir al carrito"
            >
                <AnimatePresence mode="wait">
                    {addStatus === 'idle' && (
                        <motion.div key="plus" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Plus size={20} strokeWidth={2.5} />
                        </motion.div>
                    )}
                    {addStatus === 'loading' && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <Loader2 size={18} className="animate-spin" />
                        </motion.div>
                    )}
                    {addStatus === 'success' && (
                        <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                            <Check size={18} strokeWidth={3} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </div>
      </div>
    </motion.div>
  );
};

// React.memo para evitar re-renders innecesarios si la data del producto no cambia
export default React.memo(ProductCard);