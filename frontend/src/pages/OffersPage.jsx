import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Clock, Zap, ArrowRight, Star, ShieldCheck, ShoppingBag } from 'lucide-react';

// --- Assets & Mock Data ---
const FEATURED_OFFER = {
    id: 0,
    name: "Sony WH-1000XM5",
    subtitle: "Cancelación de Ruido Líder en la Industria",
    price: 348,
    originalPrice: 399,
    discount: 15,
    endsIn: "10:59:45",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000&auto=format&fit=crop", // Elegant dark headphones
    rating: 4.9,
    reviews: 2840,
    tag: "Oferta del Día"
};

const BENTO_OFFERS = [
    {
        id: 1,
        name: "MacBook Air M2",
        category: "Laptops",
        price: 999,
        originalPrice: 1199,
        discount: 17,
        image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop",
        size: "large", // spans 2 cols
        color: "bg-slate-800"
    },
    {
        id: 2,
        name: "Apple Watch Ultra",
        category: "Wearables",
        price: 749,
        originalPrice: 799,
        discount: 6,
        image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1000&auto=format&fit=crop",
        size: "normal",
        color: "bg-zinc-800"
    },
    {
        id: 3,
        name: "PlayStation 5 Slim",
        category: "Gaming",
        price: 449,
        originalPrice: 499,
        discount: 10,
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1000&auto=format&fit=crop",
        size: "normal",
        color: "bg-neutral-800"
    },
    {
        id: 4,
        name: "Fujifilm X100V",
        category: "Fotografía",
        price: 1399,
        originalPrice: 1599,
        discount: 12,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop",
        size: "tall", // spans 2 rows
        color: "bg-stone-800"
    },
    {
        id: 5,
        name: "iPad Air 5",
        category: "Tablets",
        price: 559,
        originalPrice: 599,
        discount: 7,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000&auto=format&fit=crop",
        size: "normal",
        color: "bg-gray-800"
    }
];

// --- Components ---

const Countdown = ({ time }) => (
    <div className="flex items-center gap-2 font-mono text-sm tracking-widest text-orange-400 bg-orange-400/10 px-3 py-1.5 rounded-lg border border-orange-400/20">
        <Clock size={14} />
        <span>{time}</span>
    </div>
);

const OffersPage = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-28 pb-20 px-4 md:px-8 font-sans selection:bg-indigo-500 selection:text-white">

            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            </div>

            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8"
                >
                    <div>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-2">
                            Ofertas Flash<span className="text-indigo-500">.</span>
                        </h1>
                        <p className="text-white/60 text-lg max-w-lg">
                            Tecnología esencial seleccionada a precios imbatibles. Actualizado cada hora.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-6 py-2.5 rounded-full bg-white text-black font-semibold text-sm hover:scale-105 transition-transform">
                            Ver Todo
                        </button>
                        <button className="px-6 py-2.5 rounded-full border border-white/20 hover:border-white/40 text-sm font-medium transition-colors">
                            Termina Pronto
                        </button>
                    </div>
                </motion.div>

                {/* Featured Hero Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-full bg-[#111] rounded-[2rem] border border-white/10 overflow-hidden relative group mb-8 grid md:grid-cols-2 gap-8 p-1 md:p-2"
                >
                    {/* Content Left */}
                    <div className="p-8 md:p-12 flex flex-col justify-center relative z-10 order-2 md:order-1">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg shadow-indigo-500/30">
                                {FEATURED_OFFER.tag}
                            </span>
                            <Countdown time={FEATURED_OFFER.endsIn} />
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-4 group-hover:text-indigo-200 transition-colors">
                            {FEATURED_OFFER.name}
                        </h2>
                        <p className="text-white/60 text-lg mb-8">{FEATURED_OFFER.subtitle}</p>

                        <div className="flex items-end gap-4 mb-8">
                            <div className="text-5xl font-bold tracking-tighter">${FEATURED_OFFER.price}</div>
                            <div className="text-xl text-white/40 line-through mb-1.5">${FEATURED_OFFER.originalPrice}</div>
                            <div className="text-green-400 font-medium mb-1.5">Ahorra {FEATURED_OFFER.discount}%</div>
                        </div>

                        <button className="w-fit flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 hover:scale-105 active:scale-95 transition-all group-hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
                            Inicia tu compra <ArrowRight size={20} />
                        </button>

                        <div className="mt-8 flex items-center gap-2 text-sm text-white/40">
                            <ShieldCheck size={16} /> Garantía de 2 Años • Envío Gratis
                        </div>
                    </div>

                    {/* Image Right */}
                    <div className="relative h-[300px] md:h-auto rounded-[1.5rem] overflow-hidden order-1 md:order-2">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent mix-blend-overlay z-10" />
                        <img
                            src={FEATURED_OFFER.image}
                            alt={FEATURED_OFFER.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>
                </motion.div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[380px]">
                    {BENTO_OFFERS.map((offer, idx) => (
                        <motion.div
                            key={offer.id}
                            layoutId={`offer-${offer.id}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            onMouseEnter={() => setHoveredCard(offer.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            className={`
                 relative group rounded-3xl overflow-hidden border border-white/5 bg-[#111]
                 ${offer.size === 'large' ? 'md:col-span-2' : ''}
                 ${offer.size === 'tall' ? 'md:row-span-2' : ''}
                 cursor-pointer hover:border-white/20 transition-all duration-300
               `}
                        >
                            {/* Image Background */}
                            <div className="absolute inset-0">
                                <img
                                    src={offer.image}
                                    alt={offer.name}
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <div className="flex justify-between items-start absolute top-6 left-6 right-6">
                                    <span className="bg-black/50 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-white/80">
                                        {offer.category}
                                    </span>
                                    {offer.discount > 10 && (
                                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold shadow-lg shadow-red-500/20">
                                            -{offer.discount}%
                                        </span>
                                    )}
                                </div>

                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <h3 className="text-xl font-bold mb-1">{offer.name}</h3>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="text-2xl font-bold text-indigo-400">${offer.price}</span>
                                        <span className="text-sm text-white/40 line-through">${offer.originalPrice}</span>
                                    </div>

                                    {/* Interaction Button */}
                                    <div className={`
                        overflow-hidden transition-all duration-300
                        ${hoveredCard === offer.id ? 'max-h-12 opacity-100' : 'max-h-0 opacity-0'}
                      `}>
                                        <button className="w-full bg-white text-black py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-50 flex items-center justify-center gap-2">
                                            Agregar al Carrito <ShoppingBag size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Newsletter Card within Bento */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-indigo-900 to-black rounded-3xl border border-white/10 p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px]" />

                        <div className="relative z-10 flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-2 text-indigo-400 mb-2">
                                <Zap className="fill-current" size={20} />
                                <span className="font-bold tracking-wider text-sm uppercase">Únete al Club</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Obtén 10% de descuento</h3>
                            <p className="text-white/60 text-sm">Ofertas exclusivas directo a tu correo. Sin spam.</p>
                        </div>

                        <div className="relative z-10 w-full md:w-auto flex gap-2">
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className="bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 flex-1 md:min-w-[250px]"
                            />
                            <button className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-colors">
                                <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default OffersPage;