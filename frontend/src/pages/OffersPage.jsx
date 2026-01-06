import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Zap, Flame } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import OfferCard from '../components/OfferCard';
import { useProducts } from '../hooks/useProducts';
import SEO from '../components/SEO';

const CountDown = () => {
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(24, 0, 0, 0);
            const diff = midnight - now;

            if (diff > 0) {
                setTimeLeft({
                    h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    m: Math.floor((diff / 1000 / 60) % 60),
                    s: Math.floor((diff / 1000) % 60),
                });
            }
        };

        const timer = setInterval(calculateTimeLeft, 1000);
        calculateTimeLeft();
        return () => clearInterval(timer);
    }, []);

    const pad = (n) => n.toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-2 font-mono text-2xl md:text-4xl font-black tracking-widest text-white">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20">{pad(timeLeft.h)}</div>
            <span className="animate-pulse">:</span>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-2 border border-white/20">{pad(timeLeft.m)}</div>
            <span className="animate-pulse">:</span>
            <div className="bg-red-500/80 backdrop-blur-md rounded-lg p-2 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]">{pad(timeLeft.s)}</div>
        </div>
    );
};

const OffersPage = () => {
    const { data: products = [], isLoading } = useProducts();
    const [searchParams] = useSearchParams();
    
    // Filtrado de productos en oferta (simulado si no hay propiedad discount explicita)
    const offerProducts = useMemo(() => {
        const safeProducts = Array.isArray(products) ? products : [];
        return safeProducts.filter(p => p.promotion || p.discount || p.onSale || Math.random() > 0.6);
    }, [products]);

    // Separar destacados (Top 2) del resto
    const featuredOffers = offerProducts.slice(0, 2);
    const gridOffers = offerProducts.slice(2);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen">
            <SEO title="Ofertas Flash | TechNova" description="Descuentos exclusivos por tiempo limitado." />

            {/* --- HERO SECTION --- */}
            <div className="relative bg-slate-900 text-white overflow-hidden py-20 lg:py-28">
                {/* Background FX */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 rounded-full blur-[120px]" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="max-w-2xl text-center md:text-left">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-6 shadow-lg shadow-red-500/20"
                        >
                            <Zap size={14} fill="currentColor" /> OFERTAS FLASH ACTIVAS
                        </motion.div>
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6"
                        >
                            Precios que se <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">evaporan rápido.</span>
                        </motion.h1>
                        <p className="text-lg text-slate-400 mb-8 max-w-lg">
                            Selección exclusiva de dispositivos premium con descuentos de hasta el 50%. Stock limitado en tiempo real.
                        </p>
                    </div>

                    {/* Timer Box */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center shadow-2xl"
                    >
                        <div className="flex items-center justify-center gap-2 text-red-400 font-bold uppercase tracking-widest text-xs mb-4">
                            <Timer size={16} /> Termina hoy
                        </div>
                        <CountDown />
                        <p className="mt-4 text-xs text-slate-500">Zona horaria local detectada</p>
                    </motion.div>
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10 relative z-20">
                
                {isLoading ? (
                    <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>
                ) : (
                    <>
                        {/* FEATURED ROW (Large Cards) */}
                        {featuredOffers.length > 0 && (
                            <div className="mb-16">
                                <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900 mb-8">
                                    <Flame className="text-red-500" /> Destacados del Momento
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    {featuredOffers.map(product => (
                                        <div key={product.id} className="h-[500px]">
                                             <OfferCard product={product} priority={true} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* GRID ROW */}
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Más Oportunidades</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {gridOffers.map(product => (
                                    <motion.div key={product.id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                                        <OfferCard product={product} />
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OffersPage;