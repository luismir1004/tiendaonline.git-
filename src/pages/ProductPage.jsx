import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ShoppingCart, Heart, Minus, Plus, Truck, ShieldCheck, Share2, CheckCircle, Scale, ZoomIn, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { mockData } from '../data/mockData';
import useCartStore from '../stores/cartStore';
import useWishlistStore from '../stores/wishlistStore';
import useCompareStore from '../stores/compareStore';
import useUIStore from '../stores/uiStore';
import useCurrency from '../hooks/useCurrency'; // Import hook
import SmartImage from '../components/SmartImage';
import Breadcrumbs from '../components/Breadcrumbs';
import Accordion from '../components/Accordion';
import ProductSpecs from '../components/ProductSpecs';

const ProductPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { endNavigation } = useUIStore();
  const { formatPrice } = useCurrency(); // Use formatter
  
  // Clean up navigation bar
  useEffect(() => {
    endNavigation();
  }, [endNavigation]);

  // --- Product Lookup Logic (Priority: State -> MockData by Slug -> MockData by ID) ---
  const product = useMemo(() => {
    // 1. Try to get from navigation state (Instant Load)
    if (location.state?.productData) {
        return location.state.productData;
    }
    // 2. Try to find by Slug
    const bySlug = mockData.find(p => p.slug === slug);
    if (bySlug) return bySlug;

    // 3. Fallback: Try to find by ID (if slug is actually an ID)
    const byId = mockData.find(p => p.id === slug);
    return byId || null;

  }, [slug, location.state]);

  // Redirect to 404 if not found
  useEffect(() => {
    if (!product) {
       // Optional: Redirect programmatically or let the render handle it. 
       // For better UX, we can replace the URL to /404 or just render not found.
    }
  }, [product, navigate]);

  // Stores
  const addToCart = useCartStore((state) => state.addToCart);
  const { toggleItem, isInWishlist } = useWishlistStore();
  const { addItem: addToCompare, compareItems } = useCompareStore();

  // Local State
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  // Initialize Variant
  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else if (product) {
       // Create dummy variant if none exists for consistent logic
       setSelectedVariant({ id: 'default', name: 'Standard', stock: product.stock, image: product.image });
    }
  }, [product]);

  // --- Logic Helpers ---
  const currentPrice = useMemo(() => {
    if (!product) return 0;
    return product.price + (selectedVariant?.priceModifier || 0);
  }, [product, selectedVariant]);

  const hasStock = (selectedVariant?.stock || product?.stock || 0) > 0;
  const isWishlisted = product ? isInWishlist(product.id) : false;
  const isCompared = product ? compareItems.some(i => i.id === product.id) : false;

  const galleryImages = useMemo(() => {
    if (!product) return [];
    const images = [product.image];
    if (product.variants) {
        product.variants.forEach(v => {
            if (v.image && !images.includes(v.image)) images.push(v.image);
        });
    }
    return images;
  }, [product]);


  // --- Event Handlers ---
  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    if (quantity > selectedVariant.stock) {
        toast.error(`Solo quedan ${selectedVariant.stock} unidades disponibles.`);
        return;
    }

    setIsAddingToCart(true);

    // Simulate Processing Delay for UX
    setTimeout(() => {
        addToCart({
            ...product,
            price: currentPrice, // Override base price
            variantId: selectedVariant.id,
            variantName: selectedVariant.name,
            image: selectedVariant.image || product.image
        }, quantity);
        
        setIsAddingToCart(false);
    }, 500);
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    const idx = galleryImages.findIndex(img => img === variant.image);
    if (idx !== -1) setSelectedImageIndex(idx);
  };


  if (!product) {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Producto no encontrado</h2>
            <button onClick={() => navigate('/')} className="text-indigo-600 font-medium hover:underline">
                Volver a la tienda
            </button>
        </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs 
          items={[
            { label: 'Productos', href: '/#products' },
            { label: product.category, href: `/?category=${product.category}` },
            { label: product.name }
          ]} 
        />

        <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16 mt-8">
          
          {/* --- Image Gallery --- */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
             {/* Thumbnails */}
             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide lg:flex-col lg:w-20 lg:h-[500px] lg:pb-0">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-slate-900' : 'border-transparent hover:border-slate-200'
                  }`}
                >
                  <SmartImage src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div 
              className="relative aspect-[4/5] lg:aspect-square w-full bg-slate-50 rounded-3xl overflow-hidden border border-slate-100 cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
               <AnimatePresence mode="wait">
                 <SmartImage
                    key={galleryImages[selectedImageIndex]}
                    src={galleryImages[selectedImageIndex]}
                    alt={product.name}
                    priority={true}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: isZoomed ? 1.1 : 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover transition-transform duration-500"
                 />
               </AnimatePresence>
               
               {product.promotion && product.promotion.type === 'percentage' && (
                <div className="absolute top-4 left-4 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                  -{product.promotion.value}%
                </div>
              )}
            </div>
          </div>

          {/* --- Product Details --- */}
          <div className="mt-10 lg:mt-0 flex flex-col">
            <div className="mb-6">
                <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">{product.category}</p>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 leading-tight">{product.name}</h1>
                <div className="flex items-center gap-4">
                     <span className="text-2xl font-bold text-slate-900">{formatPrice(currentPrice * quantity)}</span>
                     {product.promotion && (
                         <span className="text-lg text-slate-400 line-through">
                             {formatPrice(product.price * (1 + (product.promotion.value/100 || 0)))}
                         </span>
                     )}
                     {!hasStock && (
                         <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Agotado</span>
                     )}
                </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 leading-relaxed mb-4 font-light text-lg">
                {product.description}
            </p>
            
            <button 
                onClick={() => document.getElementById('product-specs')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-indigo-600 font-semibold text-sm hover:underline mb-8 flex items-center gap-1 w-fit"
            >
                Ver detalles y especificaciones <Plus size={14} />
            </button>

            {/* Configurator */}
            <div className="space-y-8 border-t border-slate-100 pt-8 mb-8">
                {/* Variant Selector */}
                {product.variants && product.variants.length > 0 && (
                    <div>
                        <span className="block text-sm font-medium text-slate-900 mb-3">Color: <span className="text-slate-500 font-normal">{selectedVariant?.name}</span></span>
                        <div className="flex items-center gap-3">
                            {product.variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={() => handleVariantChange(variant)}
                                    className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                        selectedVariant?.id === variant.id ? 'ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-110'
                                    }`}
                                >
                                    <span 
                                        className="w-full h-full rounded-full border border-slate-200 shadow-sm"
                                        style={{ backgroundColor: variant.colorCode || '#eee' }}
                                    ></span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantity & CTA */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-fit">
                        <button 
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 hover:text-slate-900 text-slate-500 disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            <Minus size={18} />
                        </button>
                        <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                        <button 
                            onClick={() => setQuantity(Math.min((selectedVariant?.stock || 5), quantity + 1))}
                            className="p-2 hover:text-slate-900 text-slate-500"
                        >
                            <Plus size={18} />
                        </button>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        disabled={!hasStock || isAddingToCart}
                        className={`
                            flex-1 py-4 px-8 rounded-full font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                            ${!hasStock 
                                ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                                : isAddingToCart 
                                    ? 'bg-emerald-500 scale-95' 
                                    : 'bg-slate-900 hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1'
                            }
                        `}
                    >
                        {isAddingToCart ? (
                            <>
                                <CheckCircle size={20} /> Añadido
                            </>
                        ) : hasStock ? (
                            <>
                                <ShoppingCart size={20} /> Añadir al Carrito
                            </>
                        ) : (
                            'Agotado'
                        )}
                    </button>
                </div>
            </div>
            
            {/* Additional Features Accordion */}
            <div className="border-t border-slate-100 pt-6">
                 <Accordion title="Envío y Garantía">
                     <div className="flex flex-col gap-3 mt-3">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Truck size={18} className="text-slate-400" /> Envío gratuito en pedidos superiores a $150
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <ShieldCheck size={18} className="text-slate-400" /> Garantía de 2 años incluida
                        </div>
                     </div>
                 </Accordion>
            </div>

          </div>
        </div>
        
        {/* Spec Sheet Masterclass */}
        <ProductSpecs product={product} />

      </main>
    </div>
  );
};

export default ProductPage;