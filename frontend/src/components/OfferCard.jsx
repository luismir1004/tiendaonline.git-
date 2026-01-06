import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check, Loader2, Zap, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import { calculateOfferDetails, resolveOfferImage, getStockProgress } from '../utils/offerUtils';

const OfferCard = ({ product, priority = false }) => {
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  
  const [addStatus, setAddStatus] = useState('idle');
  const [imgStatus, setImgStatus] = useState('loading'); // loading, loaded, error

  // Validación de seguridad
  if (!product || !product.id) return null;

  // --- Lógica de Datos Determinista ---
  const offerDetails = useMemo(() => {
    // Si el producto tiene precio original y actual, usamos el descuento implícito
    // Si no, forzamos un descuento simulado del 20-30% si es una oferta
    let basePrice = product.originalPrice || (product.price * 1.3);
    let percent = product.discount || Math.round(((basePrice - product.price) / basePrice) * 100);
    
    return calculateOfferDetails(basePrice, percent);
  }, [product]);

  const offerImage = useMemo(() => resolveOfferImage(product), [product]);
  const stockSold = useMemo(() => getStockProgress(product.id), [product.id]);
  const isSoldOut = product.stock === 0;

  // --- Handlers ---
  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    if (addStatus !== 'idle' || isSoldOut) return;
    setAddStatus('loading');
    
    await new Promise(resolve => setTimeout(resolve, 600)); // UX Delay
    addToCart(product);
    setAddStatus('success');
    setTimeout(() => setAddStatus('idle'), 2000);
  };

  return (
    <motion.div
      layout
      className={`
        group relative flex flex-col w-full h-full cursor-pointer 
        bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1
        transition-all duration-500 border border-slate-100
        ${isSoldOut ? 'grayscale opacity-80' : ''}
      `}
      onClick={() => navigate(`/producto/${product.slug}`)}
    >
      {/* --- Visual Stage --- */}
      <div className="relative w-full aspect-[4/5] bg-slate-100 overflow-hidden">
        
        {/* Flash Sale Badge (Floating) */}
        {!isSoldOut && (
            <div className="absolute top-4 left-4 z-20">
                <div className="relative">
                    <div className="absolute inset-0 bg-red-500 blur-md opacity-50 animate-pulse" />
                    <div className="relative flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                        <Zap size={10} fill="currentColor" />
                        <span>-{Math.round((offerDetails.finalPrice < product.price ? 100 - (offerDetails.finalPrice/product.price)*100 : 25))}% FLASH</span>
                    </div>
                </div>
            </div>
        )}

        {/* Image Engine con Fallback Personalizado */}
        <div className={`w-full h-full relative ${imgStatus === 'error' ? 'bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-800' : 'bg-slate-100'}`}>
            {imgStatus === 'error' ? (
                // Fallback UI: Minimalista y Premium
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md mb-4 border border-white/10">
                        <Zap size={32} className="text-yellow-400" />
                    </div>
                    <span className="text-white font-black text-2xl tracking-tighter leading-none mb-1">OFERTA</span>
                    <span className="text-indigo-300 font-bold text-sm tracking-widest uppercase">Exclusiva</span>
                </div>
            ) : (
                <motion.img
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: imgStatus === 'loaded' ? 1 : 0, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    src={offerImage}
                    alt={product.name}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    onLoad={() => setImgStatus('loaded')}
                    onError={() => setImgStatus('error')}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            )}
        </div>

        {/* Quick Buy Overlay */}
        {!isSoldOut && (
            <div className="absolute bottom-4 inset-x-4 translate-y-[120%] group-hover:translate-y-0 transition-transform duration-300 z-30">
                 <button
                    onClick={handleQuickAdd}
                    className={`
                        w-full py-3.5 rounded-xl shadow-xl font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider
                        ${addStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-900 hover:text-white'}
                        transition-colors
                    `}
                >
                    {addStatus === 'loading' ? <Loader2 className="animate-spin" size={16} /> : 
                     addStatus === 'success' ? <><Check size={16} /> Agregado</> : 
                     <><ShoppingBag size={16} /> Agregar Oferta</>}
                </button>
            </div>
        )}

        {/* Sold Out Overlay */}
        {isSoldOut && (
             <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-900/50 backdrop-blur-[2px]">
                 <span className="bg-white text-slate-900 px-6 py-3 font-black text-sm uppercase tracking-widest transform -rotate-3 shadow-2xl">
                     Agotado
                 </span>
             </div>
        )}
      </div>

      {/* --- Info Stage --- */}
      <div className="p-5 flex flex-col flex-1 bg-white relative z-10">
        {/* Category & Rating (Optional, simplified here) */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
            {product.category || 'Tech'}
        </p>

        <h3 className="text-base font-bold text-slate-900 leading-tight mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
            {product.name}
        </h3>

        {/* Price Block */}
        <div className="mt-auto pt-2">
            <div className="flex items-baseline gap-2 mb-3">
                <span className="text-xl font-black text-slate-900">
                    {offerDetails.formattedFinal}
                </span>
                {offerDetails.isValid && (
                    <span className="text-xs font-medium text-slate-400 line-through decoration-red-400 decoration-2">
                        {offerDetails.formattedOriginal}
                    </span>
                )}
            </div>

            {/* Scarcity Bar */}
            {!isSoldOut && (
                <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                        <span className="text-orange-500 flex items-center gap-1">
                             <Zap size={10} fill="currentColor" /> Casi Agotado
                        </span>
                        <span className="text-slate-400">{stockSold}% Vendido</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${stockSold}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full"
                        />
                    </div>
                </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default React.memo(OfferCard);