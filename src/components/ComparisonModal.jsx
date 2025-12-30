import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Battery, Wifi, Scale, Calendar, ShieldCheck, Sparkles, Share2 } from 'lucide-react';
import useCompareStore from '../stores/compareStore';
import useCartStore from '../stores/cartStore';
import SmartImage from './SmartImage';
import TechAdvisorQuiz from './TechAdvisorQuiz';
import toast from 'react-hot-toast';

const ComparisonModal = ({ isOpen, onClose }) => {
  const { compareItems, removeItem } = useCompareStore();
  const addToCart = useCartStore((state) => state.addToCart);
  const [recommendationId, setRecommendationId] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Logic for "Winner" Spec ---
  const getWinningProductId = (specKey) => {
    if (compareItems.length < 2) return null;

    let bestValue = -Infinity;
    let worstValue = Infinity;
    let winnerId = null;

    compareItems.forEach(item => {
      const valStr = item.specs?.[specKey] || "";
      const valNum = parseFloat(valStr.replace(/[^0-9.]/g, ''));
      
      if (isNaN(valNum)) return;

      // Logic: Higher is better usually, except for Weight
      if (specKey === 'Weight') { // Lower is better
        if (valNum < worstValue) {
            worstValue = valNum;
            winnerId = item.id;
        }
      } else { // Higher is better (Battery, Year, Warranty)
         if (valNum > bestValue) {
             bestValue = valNum;
             winnerId = item.id;
         }
      }
    });
    
    return winnerId;
  };

  const specsList = [
    { key: 'Battery Life', label: 'Batería', icon: Battery },
    { key: 'Weight', label: 'Peso', icon: Scale },
    { key: 'Connectivity', label: 'Conectividad', icon: Wifi },
    { key: 'Release Year', label: 'Año', icon: Calendar },
    { key: 'Warranty', label: 'Garantía', icon: ShieldCheck },
  ];

  const handleShare = () => {
      toast.success("Enlace de comparativa copiado al portapapeles");
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
      />

      {/* Main Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"><X size={20} /></button>

        {/* --- Sidebar / Quiz Area --- */}
        <div className="w-full md:w-80 bg-slate-50 border-r border-slate-100 flex flex-col">
            <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Comparador Inteligente</h2>
                <p className="text-sm text-slate-500 mb-6">Analizando especificaciones técnicas para tu perfil de uso.</p>
                
                {!showQuiz && !recommendationId && (
                    <button 
                        onClick={() => setShowQuiz(true)}
                        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                        <Sparkles size={18} /> Asistente IA
                    </button>
                )}

                <AnimatePresence>
                    {showQuiz && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                            <TechAdvisorQuiz onComplete={(recId, goal) => {
                                setRecommendationId(recId);
                                setShowQuiz(false);
                                toast.custom((t) => (
                                    <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-indigo-900 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-4`}>
                                        <Sparkles className="text-yellow-400" />
                                        <div>
                                            <p className="font-bold">Análisis Completado</p>
                                            <p className="text-sm opacity-90">La mejor opción para <span className="font-bold text-yellow-300">{goal}</span> ha sido resaltada.</p>
                                        </div>
                                    </div>
                                ));
                            }} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {recommendationId && (
                    <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                        <div className="flex items-center gap-2 text-indigo-700 font-bold mb-2">
                            <Trophy size={18} /> Recomendación
                        </div>
                        <p className="text-xs text-indigo-600 leading-relaxed">
                            Basado en tus necesidades, este modelo ofrece el mejor equilibrio entre rendimiento y características.
                        </p>
                        <button onClick={() => setRecommendationId(null)} className="text-xs text-slate-400 mt-2 underline">Reiniciar</button>
                    </div>
                )}
            </div>
            
            <div className="mt-auto p-6 border-t border-slate-200">
                <button onClick={handleShare} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
                    <Share2 size={16} /> Compartir Comparativa
                </button>
            </div>
        </div>

        {/* --- Comparison Grid --- */}
        <div className="flex-1 overflow-auto custom-scrollbar bg-white relative">
            <div className="min-w-max p-8">
                {/* Header Row: Products */}
                <div className="grid gap-8" style={{ gridTemplateColumns: `100px repeat(${compareItems.length}, minmax(200px, 1fr))` }}>
                    <div className="pt-20 font-bold text-slate-300 text-sm uppercase tracking-widest">Specs</div>
                    
                    {compareItems.map(item => (
                        <div key={item.id} className={`relative flex flex-col items-center text-center p-4 rounded-2xl transition-all ${recommendationId === item.id ? 'bg-indigo-50 ring-2 ring-indigo-500 shadow-xl scale-105 z-10' : ''}`}>
                            {recommendationId === item.id && (
                                <div className="absolute -top-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg flex items-center gap-1">
                                    <Sparkles size={10} /> Top Pick
                                </div>
                            )}
                            <div className="h-32 w-full mb-4 relative">
                                <SmartImage src={item.image} className="w-full h-full object-contain" />
                            </div>
                            <h3 className="font-bold text-slate-900 leading-tight mb-1">{item.name}</h3>
                            <p className="text-slate-500 text-sm mb-4">${item.price}</p>
                            <button 
                                onClick={() => addToCart(item)}
                                className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors"
                            >
                                Añadir
                            </button>
                            <button onClick={() => removeItem(item.id)} className="mt-2 text-xs text-slate-300 hover:text-red-500">Remover</button>
                        </div>
                    ))}
                </div>

                {/* Specs Rows */}
                <div className="mt-8 space-y-2">
                    {specsList.map((spec) => {
                        const winnerId = getWinningProductId(spec.key);
                        
                        return (
                            <div key={spec.key} className="grid gap-8 py-4 border-b border-slate-50 hover:bg-slate-50/50 transition-colors rounded-lg" style={{ gridTemplateColumns: `100px repeat(${compareItems.length}, minmax(200px, 1fr))` }}>
                                <div className="flex flex-col justify-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <spec.icon size={16} className="mb-1" />
                                    {spec.label}
                                </div>
                                
                                {compareItems.map(item => {
                                    const isWinner = winnerId === item.id;
                                    const val = item.specs?.[spec.key] || "-";
                                    
                                    return (
                                        <div key={item.id} className="flex items-center justify-center">
                                            <span className={`text-sm font-medium px-3 py-1 rounded-full ${isWinner ? 'bg-emerald-100 text-emerald-700 font-bold' : 'text-slate-600'}`}>
                                                {val}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

      </motion.div>
    </div>,
    document.body
  );
};

export default ComparisonModal;