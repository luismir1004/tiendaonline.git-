import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Check, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import useCurrency from '../hooks/useCurrency';
import SmartImage from './SmartImage';

const QuickViewModal = ({ isOpen, onClose, product }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const { formatPrice } = useCurrency();
  const [isAdding, setIsAdding] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);

  // Reset variant on open
  React.useEffect(() => {
    if (product && product.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  if (!product) return null;

  const currentImage = selectedVariant?.image || product.image;
  const currentPrice = product.price + (selectedVariant?.priceModifier || 0);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      addToCart({
        ...product,
        image: currentImage,
        price: currentPrice,
        variantName: selectedVariant?.name
      });
      setIsAdding(false);
      onClose();
    }, 600);
  };

  const handleFullDetails = () => {
    navigate(`/producto/${product.slug}`, { state: { productData: product } });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            layoutId={`product-card-${product.id}`}
            className="relative w-[90%] md:w-full md:max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-3 bg-white/50 hover:bg-white rounded-full transition-colors"
            >
                <X size={20} className="text-slate-500" />
            </button>

            {/* Image Column */}
            <div className="w-full md:w-1/2 bg-slate-50 p-8 flex items-center justify-center relative">
                <motion.div
                    key={currentImage}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full aspect-square"
                >
                    <SmartImage src={currentImage} alt={product.name} className="w-full h-full object-contain" />
                </motion.div>
                {product.promotion && (
                    <span className="absolute top-6 left-6 bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{product.promotion.value}%
                    </span>
                )}
            </div>

            {/* Info Column */}
            <div className="w-full md:w-1/2 p-8 flex flex-col">
                <div className="flex-1">
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{product.category}</p>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{product.name}</h2>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                        <span className="text-xs text-slate-400">(24 Reviews)</span>
                    </div>
                    
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {product.description}
                    </p>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-6">
                            <span className="text-xs font-bold text-slate-900 block mb-2">Color: {selectedVariant?.name}</span>
                            <div className="flex gap-2">
                                {product.variants.map(v => (
                                    <button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedVariant?.id === v.id ? 'border-slate-900 scale-110' : 'border-transparent hover:scale-105'}`}
                                        style={{ backgroundColor: v.colorCode || v.color }}
                                        title={v.name}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-100 pt-6 mt-4">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-slate-900">{formatPrice(currentPrice)}</span>
                        {product.stock < 5 && (
                             <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">
                                ¡Solo quedan {product.stock}!
                             </span>
                        )}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || product.stock === 0}
                            className="flex-1 bg-slate-900 text-white font-bold py-3 px-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                             {isAdding ? <Check size={18} /> : <ShoppingCart size={18} />}
                             {isAdding ? 'Añadido' : 'Añadir'}
                        </button>
                        <button
                            onClick={handleFullDetails}
                            className="p-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;