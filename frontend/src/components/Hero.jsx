import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { ArrowRight, ChevronDown, PlayCircle, X, ShoppingCart, Check, Star } from 'lucide-react';
import useCartStore from '../stores/cartStore';
import toast from 'react-hot-toast';

// --- Configuration: Hero Product Data ---
const HERO_PRODUCT = {
  id: "tn-sonic-arch-x1",
  name: "Sonic Architecture X1",
  tagline: "Redefiniendo la acústica.",
  price: 599.00,
  description: "Drivers de berilio de 50mm, cancelación de ruido con IA y 60 horas de batería. Una obra maestra de la ingeniería auditiva.",
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0&controls=0&modestbranding=1", // Placeholder Rick (Classic) - replace with real product video
  badges: {
    limitedDate: new Date('2025-12-31'), // Future date logic
  },
  variants: [
    { 
      id: 'v1', 
      name: 'Phantom Black', 
      color: '#1e293b', 
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop" 
    },
    { 
      id: 'v2', 
      name: 'Lunar Silver', 
      color: '#e2e8f0', 
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=1000&auto=format&fit=crop" 
    },
    { 
      id: 'v3', 
      name: 'Nebula Blue', 
      color: '#3b82f6', 
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop" 
    }
  ]
};

// --- Sub-Component: Video Modal ---
const VideoModal = ({ isOpen, onClose, videoUrl }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-white/20 transition-colors">
            <X size={24} />
          </button>
          <iframe 
            src={videoUrl} 
            title="Product Video"
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Sub-Component: Quick View Modal ---
const QuickViewModal = ({ isOpen, onClose, product, currentVariant }) => {
    const addToCart = useCartStore(state => state.addToCart);
    const [isAdding, setIsAdding] = useState(false);

    const handleQuickAdd = () => {
        setIsAdding(true);
        // Simulate delay
        setTimeout(() => {
            addToCart({
                ...product,
                image: currentVariant.image,
                price: product.price
            });
            setIsAdding(false);
            onClose(); // Optional: close after add
        }, 600);
    };

    return (
        <AnimatePresence>
            {isOpen && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    layoutId={`hero-product-${product.id}`}
                    className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 z-10">
                        <X size={24} />
                    </button>
                    
                    <div className="flex flex-col items-center text-center">
                         <motion.img 
                            key={currentVariant.image}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            src={currentVariant.image} 
                            alt={product.name} 
                            className="h-48 object-contain mb-6 drop-shadow-xl"
                        />
                        <h3 className="text-2xl font-bold text-slate-900">{product.name}</h3>
                        <p className="text-sm text-slate-500 mb-4">{currentVariant.name} Edition</p>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">{product.description}</p>
                        
                        <div className="flex items-center justify-between w-full pt-4 border-t border-slate-100">
                             <span className="text-2xl font-bold text-slate-900">${product.price}</span>
                             <button 
                                onClick={handleQuickAdd}
                                disabled={isAdding}
                                className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-indigo-600 transition-colors flex items-center gap-2"
                             >
                                {isAdding ? <Check size={18} /> : <ShoppingCart size={18} />}
                                {isAdding ? 'Añadido' : 'Comprar Ahora'}
                             </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
            )}
        </AnimatePresence>
    );
};


const Hero = () => {
  const containerRef = useRef(null);
  const addToCart = useCartStore((state) => state.addToCart);

  // --- Local State ---
  const [currentVariant, setCurrentVariant] = useState(HERO_PRODUCT.variants[0]);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [isAddingDirectly, setIsAddingDirectly] = useState(false);

  // --- 1. Scroll & Analytics Logic ---
  const handleScrollToCatalog = () => {
    const catalogElement = document.getElementById('products');
    if (catalogElement) {
        // Precise calculation: Element Top - Navbar Height (approx 80px)
        const elementPosition = catalogElement.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - 80;

        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });

        // Simulación de Analytics
        console.log(`[Analytics] CTA Clicked: Explore Collection | Variant: ${currentVariant.name}`);
    }
  };

  // --- 2. Smart Scroll Indicator Logic ---
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100 && showScrollIndicator) {
        setShowScrollIndicator(false);
    } else if (latest < 100 && !showScrollIndicator) {
        setShowScrollIndicator(true);
    }
  });

  // --- 3. Dynamic Badge Logic ---
  const getBadgeText = () => {
    const today = new Date();
    if (today > HERO_PRODUCT.badges.limitedDate) {
        return "Últimas Unidades";
    }
    return "Edición Limitada 2025";
  };

  // --- 4. Direct Add to Cart Logic ---
  const handleDirectAdd = (e) => {
      e.stopPropagation();
      setIsAddingDirectly(true);
      
      setTimeout(() => {
        addToCart({
            ...HERO_PRODUCT,
            id: HERO_PRODUCT.id, // Ensure ID match
            image: currentVariant.image,
            price: HERO_PRODUCT.price,
            variantName: currentVariant.name
        });
        setIsAddingDirectly(false);
      }, 500); // Simulate network
  };


  // --- 5. Mouse Parallax Logic ---
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 30 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  // Keyboard Listener for Modal (Accessibility)
  useEffect(() => {
      const handleEsc = (e) => {
          if (e.key === 'Escape') {
              setIsVideoOpen(false);
              setIsQuickViewOpen(false);
          }
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
  }, []);


  // --- Animations Variants ---
  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (custom) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9], delay: custom * 0.15 },
    }),
  };

  return (
    <>
        <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} videoUrl={HERO_PRODUCT.videoUrl} />
        <QuickViewModal isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} product={HERO_PRODUCT} currentVariant={currentVariant} />

        <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className="relative min-h-[92vh] w-full overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-[#f8f9fc] to-white flex items-center justify-center pt-20 perspective-2000"
        >
        {/* Background Decor */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-20 w-full z-10 flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* --- Left Column: Narrative --- */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            
            {/* Dynamic Badge */}
            <motion.div 
                custom={0}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/5 border border-slate-900/10 mb-6 backdrop-blur-sm"
            >
                <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getBadgeText() === "Últimas Unidades" ? "bg-red-400" : "bg-indigo-400"}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${getBadgeText() === "Últimas Unidades" ? "bg-red-500" : "bg-indigo-500"}`}></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-700">{getBadgeText()}</span>
            </motion.div>

            <motion.h1 
                custom={1}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-5xl md:text-8xl font-extrabold tracking-tighter text-slate-900 leading-[0.95] mb-6"
            >
                Sonic
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-slate-600 to-slate-900">
                Architecture
                </span>
            </motion.h1>

            {/* Live Color Selector */}
            <motion.div 
                custom={1.5}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-3 mb-6 bg-white/50 p-2 rounded-full border border-slate-100 shadow-sm backdrop-blur-sm"
            >
                {HERO_PRODUCT.variants.map((v) => (
                    <button
                        key={v.id}
                        onClick={() => setCurrentVariant(v)}
                        className={`w-6 h-6 rounded-full transition-all duration-300 ${currentVariant.id === v.id ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                        style={{ backgroundColor: v.color }}
                        title={v.name}
                    />
                ))}
                <span className="text-xs font-medium text-slate-500 ml-2 px-2 border-l border-slate-200">{currentVariant.name}</span>
            </motion.div>

            <motion.p 
                custom={2}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="text-lg md:text-xl text-slate-500 font-light max-w-lg leading-relaxed mb-10"
            >
                {HERO_PRODUCT.description}
            </motion.p>

            <motion.div 
                custom={3}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
                {/* Primary CTA - Smooth Scroll & Analytics */}
                <button 
                    onClick={handleScrollToCatalog}
                    className="group relative overflow-hidden rounded-full bg-slate-900 px-8 py-4 text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/20 active:scale-95"
                >
                <span className="relative z-10 flex items-center justify-center gap-2 font-bold tracking-wide">
                    Explorar Colección
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </span>
                <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear", repeatDelay: 1 }}
                    className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
                </button>

                {/* Secondary CTA - Video Lightbox */}
                <button 
                    onClick={() => setIsVideoOpen(true)}
                    className="group flex items-center justify-center gap-3 px-8 py-4 rounded-full border border-slate-200 bg-white/50 backdrop-blur-md text-slate-700 font-semibold hover:bg-white transition-all duration-300"
                >
                <PlayCircle size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                <span>Ver el Film</span>
                </button>
            </motion.div>
            </div>

            {/* --- Right Column: Interactive Hero Product --- */}
            <div className="relative order-1 lg:order-2 flex justify-center items-center">
                <motion.div
                    style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                    className="relative z-20 w-full max-w-[500px] aspect-square cursor-zoom-in group"
                    onClick={() => setIsQuickViewOpen(true)}
                >
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, scale: 0.8 },
                            visible: { opacity: 1, scale: 1, transition: { duration: 1.2 } },
                            float: { y: [0, -20, 0], rotateZ: [0, 1, 0, -1, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
                        }}
                        initial="hidden"
                        animate={["visible", "float"]}
                        className="w-full h-full relative"
                    >
                        {/* Shadow */}
                        <motion.div 
                            animate={{ scale: [1, 0.9, 1], opacity: [0.3, 0.5, 0.3] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[-40px] left-[15%] w-[70%] h-[40px] bg-black/20 blur-[30px] rounded-[100%]"
                        />

                        {/* Image with Cross-Fade */}
                        <AnimatePresence mode='wait'>
                            <motion.img 
                                key={currentVariant.id}
                                src={currentVariant.image}
                                alt={HERO_PRODUCT.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full object-contain drop-shadow-2xl will-change-transform relative z-10"
                                style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.25))" }}
                            />
                        </AnimatePresence>

                        {/* Hover Overlay Hint */}
                        <motion.div 
                             initial={{ opacity: 0 }}
                             whileHover={{ opacity: 1 }}
                             className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                        >
                            <span className="bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-md text-sm font-medium">Click para Vista Rápida</span>
                        </motion.div>

                        {/* Direct Add to Cart Button (Floating) */}
                        <motion.button 
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                            onClick={handleDirectAdd}
                            disabled={isAddingDirectly}
                            className="absolute top-[10%] right-[0%] bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/50 flex items-center gap-2 hover:bg-white transition-colors z-30 group/btn"
                            style={{ transform: "translateZ(40px)" }}
                        >
                             <div className={`p-1 rounded-full ${isAddingDirectly ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-900'}`}>
                                {isAddingDirectly ? <Check size={14} /> : <ShoppingCart size={14} />}
                             </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Best Seller</span>
                                <span className="text-xs font-bold text-slate-900 group-hover/btn:text-indigo-600">
                                    {isAddingDirectly ? 'Añadiendo...' : `$${HERO_PRODUCT.price}`}
                                </span>
                            </div>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>
        </div>

        {/* --- Smart Scroll Indicator --- */}
        <AnimatePresence>
            {showScrollIndicator && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
                    onClick={handleScrollToCatalog}
                >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-medium">Descubre Más</span>
                    <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                        <ChevronDown className="text-slate-400" size={24} />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </div>
    </>
  );
};

export default Hero;