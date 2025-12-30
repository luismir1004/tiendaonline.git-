import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Plus, Heart, Eye, Scale } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useCompareStore from '../stores/compareStore';
import useWishlistStore from '../stores/wishlistStore';
import useHistoryStore from '../stores/historyStore';
import useCurrency from '../hooks/useCurrency';

const ProductCard = memo(({ product }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare, compareItems } = useCompareStore();
  const { hasVisited } = useHistoryStore();
  const { formatPrice } = useCurrency();

  const isLiked = product ? isInWishlist(product.id) : false;
  const isVisited = product ? hasVisited(product.id) : false;
  const isInCompare = product ? compareItems.some(item => item.id === product.id) : false;
  const isOutOfStock = product?.stock === 0;

  // Local Interaction State
  const [activeVariant, setActiveVariant] = useState(null); // For hover preview
  const [isHovered, setIsHovered] = useState(false);
  const [addingState, setAddingState] = useState('idle'); // idle, loading, success

  // Determine display data
  // The service normalizes images to an array. Accessing the first one.
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg';
  const displayImage = activeVariant?.image || mainImage;
  const displayPrice = product.price + (activeVariant?.priceModifier || 0);

  // --- Quick Add Logic ---
  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    if (isOutOfStock || addingState !== 'idle') return;

    setAddingState('loading');
    
    // Simulate network latency for UX
    await new Promise(resolve => setTimeout(resolve, 600));
    
    addToCart({
        ...product,
        image: displayImage, // Pass resolved image
        price: displayPrice,
        variantName: activeVariant?.name
    });
    
    setAddingState('success');
    setTimeout(() => setAddingState('idle'), 2000);
  };

  const handleCardClick = () => {
      navigate(`/producto/${product.slug}`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setActiveVariant(null); }}
      onClick={handleCardClick}
    >
        {/* --- Image Area --- */}
        <div className="relative aspect-[4/5] bg-slate-50 overflow-hidden">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 items-start">
                 {product.promotion && (
                    <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide">
                        -{product.promotion.value}%
                    </span>
                 )}
                 {isVisited && (
                     <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                         <Eye size={10} /> Visto
                     </span>
                 )}
            </div>

            {/* Actions (Top Right) */}
            <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                 <button
                    onClick={(e) => { e.stopPropagation(); toggleItem(product); }}
                    className={`p-2 rounded-full shadow-sm transition-colors ${isLiked ? 'bg-red-50 text-red-500' : 'bg-white text-slate-400 hover:text-slate-900'}`}
                 >
                     <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
                 </button>
                 <button
                    onClick={(e) => { e.stopPropagation(); addToCompare(product); }}
                    className={`p-2 rounded-full shadow-sm transition-colors ${isInCompare ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-slate-400 hover:text-slate-900'}`}
                 >
                     <Scale size={16} />
                 </button>
            </div>

            {/* Main Image with LayoutId for seamless transition */}
            <motion.img 
                layoutId={`product-image-${product.id}`}
                src={displayImage} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            
            {/* Stock Overlay */}
            {isOutOfStock && (
                 <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
                     <span className="text-slate-900 font-bold uppercase tracking-widest text-sm border-2 border-slate-900 px-3 py-1">Agotado</span>
                 </div>
            )}
        </div>

        {/* --- Info Area --- */}
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex justify-between items-start mb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.category || 'Tech'}</p>
                 {/* Variant Dots (Hover to preview) */}
                 {product.variants && product.variants.length > 0 && (
                    <div className="flex gap-1">
                        {product.variants.slice(0, 3).map(v => (
                            <div 
                                key={v.id}
                                onMouseEnter={(e) => { e.stopPropagation(); setActiveVariant(v); }}
                                className={`w-3 h-3 rounded-full border border-slate-200 ${activeVariant?.id === v.id ? 'scale-125 ring-1 ring-slate-400' : ''}`}
                                style={{ backgroundColor: v.colorCode || v.color }}
                            />
                        ))}
                        {product.variants.length > 3 && <span className="text-[10px] text-slate-400">+{product.variants.length - 3}</span>}
                    </div>
                 )}
            </div>
            
            <h3 className="text-base font-semibold text-slate-900 mb-1 leading-tight group-hover:text-indigo-600 transition-colors">
                {product.name}
            </h3>

            <div className="mt-auto pt-3 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-900">{formatPrice(displayPrice)}</span>
                </div>

                {/* Intelligent Quick Add Button */}
                <button
                    onClick={handleQuickAdd}
                    disabled={isOutOfStock}
                    className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm
                        ${isOutOfStock ? 'bg-slate-100 text-slate-300' : 
                          addingState === 'success' ? 'bg-emerald-500 text-white' : 
                          'bg-slate-900 text-white hover:bg-indigo-600 hover:scale-110'}
                    `}
                >
                    <AnimatePresence mode="wait">
                        {addingState === 'idle' && <motion.div key="idle" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}><Plus size={20} /></motion.div>}
                        {addingState === 'loading' && <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><Loader2 size={18} className="animate-spin" /></motion.div>}
                        {addingState === 'success' && <motion.div key="success" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}><Check size={18} /></motion.div>}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    </motion.div>
  );
}, (prev, next) => prev.product.id === next.product.id);

export default ProductCard;