import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Check, ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useModalStore from '../stores/modalStore';
import useCurrency from '../hooks/useCurrency';
import SmartImage from './SmartImage';

const NexusQuickView = () => {
  const navigate = useNavigate();
  const { isOpen, activeProduct, closeModal } = useModalStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const { formatPrice } = useCurrency();

  // Local Interaction State
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  // Initialize state when product opens
  useEffect(() => {
    if (activeProduct) {
      if (activeProduct.variants?.length > 0) {
        setSelectedVariant(activeProduct.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setQuantity(1);
    }
  }, [activeProduct]);

  // Body Scroll Locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!activeProduct) return null;

  // Logic Helpers
  const currentImage = selectedVariant?.image || activeProduct.image;
  const currentPrice = activeProduct.price + (selectedVariant?.priceModifier || 0);
  const hasStock = (selectedVariant?.stock || activeProduct.stock) > 0;
  const stockCount = selectedVariant?.stock || activeProduct.stock;

  const handleAddToCart = () => {
    if (!hasStock) return;
    
    setIsAdding(true);
    
    // Simulate API/Network delay
    setTimeout(() => {
      addToCart({
        ...activeProduct,
        image: currentImage,
        price: currentPrice,
        variantName: selectedVariant?.name,
        variantId: selectedVariant?.id
      }, quantity);
      
      setIsAdding(false);
      closeModal();
    }, 1000);
  };

  const handleFullDetails = () => {
    navigate(`/producto/${activeProduct.slug}`, { state: { productData: activeProduct } });
    closeModal();
  };

  // Portal Content
  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          
          {/* 1. Backdrop (Deep Blur) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />

          {/* 2. Modal Card (Glassmorphism) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="relative w-full max-w-5xl h-[85vh] max-h-[700px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row ring-1 ring-white/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button (Floating Rotation) */}
            <button 
                onClick={closeModal}
                className="absolute top-5 right-5 z-30 p-2.5 bg-white rounded-full shadow-sm text-slate-400 hover:text-slate-900 transition-all duration-300 group"
            >
                <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* --- Left Column: Interactive Gallery --- */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-50 to-white p-8 flex items-center justify-center relative">
                <motion.div
                    key={currentImage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full max-h-[400px]"
                >
                    <SmartImage 
                        src={currentImage} 
                        alt={activeProduct.name} 
                        priority={true}
                        className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl" 
                    />
                </motion.div>
                
                {activeProduct.promotion && (
                    <div className="absolute top-8 left-8 bg-slate-900/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-lg">
                        -{activeProduct.promotion.value}%
                    </div>
                )}
            </div>

            {/* --- Right Column: Tech Specs & Actions --- */}
            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col overflow-y-auto custom-scrollbar">
                
                {/* Header */}
                <div className="mb-6">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-3">{activeProduct.category}</p>
                    <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">{activeProduct.name}</h2>
                    <div className="flex items-center gap-4 text-sm">
                         <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                        </div>
                        <span className="text-slate-400 font-medium">4.9 (120+ Reviews)</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-slate-600 leading-relaxed mb-8 font-light">
                    {activeProduct.description}
                </p>

                <div className="flex-grow">
                     {/* Variant Selector */}
                    {activeProduct.variants && activeProduct.variants.length > 0 && (
                        <div className="mb-8">
                            <span className="text-sm font-medium text-slate-900 block mb-3">Color: <span className="text-slate-500 font-normal">{selectedVariant?.name}</span></span>
                            <div className="flex flex-wrap gap-3">
                                {activeProduct.variants.map(v => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`group relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                                            selectedVariant?.id === v.id 
                                                ? 'ring-2 ring-offset-2 ring-slate-900 scale-105' 
                                                : 'hover:scale-105 opacity-80 hover:opacity-100'
                                        }`}
                                    >
                                        <span 
                                            className="w-full h-full rounded-full border border-slate-200 shadow-sm"
                                            style={{ backgroundColor: v.colorCode || v.color }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    {hasStock && (
                         <div className="mb-8">
                            <span className="text-sm font-medium text-slate-900 block mb-3">Cantidad</span>
                            <div className="flex items-center bg-slate-100 rounded-full w-fit p-1">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:text-indigo-600 transition-colors"
                                >-</button>
                                <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(Math.min(stockCount, quantity + 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:text-indigo-600 transition-colors"
                                >+</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                <div className="mt-auto border-t border-slate-200/60 pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold text-slate-900">{formatPrice(currentPrice * quantity)}</span>
                            {!hasStock && <span className="text-red-500 text-xs font-bold uppercase">Agotado</span>}
                            {hasStock && stockCount < 5 && <span className="text-orange-500 text-xs font-bold animate-pulse">¡Últimas {stockCount} unidades!</span>}
                        </div>
                        
                        <div className="flex gap-2 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                            <span className="flex items-center gap-1"><Truck size={12} /> Envío Rápido</span>
                            <span className="flex items-center gap-1"><ShieldCheck size={12} /> Garantía</span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || !hasStock}
                            className={`
                                flex-[2] py-4 px-6 rounded-2xl font-bold text-white shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2
                                ${!hasStock ? 'bg-slate-300 cursor-not-allowed' : isAdding ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1'}
                            `}
                        >
                             {isAdding ? <Check size={20} className="animate-bounce" /> : <ShoppingCart size={20} />}
                             {isAdding ? '¡Listo!' : 'Añadir al Carrito'}
                        </button>
                        
                        <button
                            onClick={handleFullDetails}
                            className="flex-1 py-4 px-4 border border-slate-200 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center group"
                        >
                            Detalles <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  // Render to Body
  return createPortal(modalContent, document.body);
};

export default NexusQuickView;