import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Zap, Tag } from 'lucide-react';

const MESSAGES = [
  { id: 1, text: "Envío Gratis en pedidos superiores a $100", icon: Truck },
  { id: 2, text: "Ofertas Flash: Hasta 50% de descuento en Tech", icon: Zap },
  { id: 3, text: "Nuevas Colecciones de Verano disponibles", icon: Tag },
];

const MarqueeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    // Check local storage for dismissal
    const isDismissed = localStorage.getItem('marquee-dismissed');
    const dismissedTime = localStorage.getItem('marquee-dismissed-time');
    
    // Reset dismissal after 24 hours
    if (isDismissed && dismissedTime) {
      const hoursSinceDismissal = (Date.now() - parseInt(dismissedTime)) / (1000 * 60 * 60);
      if (hoursSinceDismissal < 24) {
        setIsVisible(false);
        return;
      }
    }

    // Rotate messages
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('marquee-dismissed', 'true');
    localStorage.setItem('marquee-dismissed-time', Date.now().toString());
  };

  if (!isVisible) return null;

  const CurrentIcon = MESSAGES[currentMessageIndex].icon;

  return (
    <div className="bg-slate-900 text-white overflow-hidden relative z-[60]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMessageIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-xs font-medium tracking-wide"
          >
            <CurrentIcon size={14} className="text-indigo-400" />
            {MESSAGES[currentMessageIndex].text}
          </motion.div>
        </AnimatePresence>
        
        <button 
          onClick={handleClose}
          className="absolute right-4 p-1 hover:bg-slate-800 rounded-full transition-colors"
          aria-label="Cerrar anuncio"
        >
          <X size={14} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
};

export default MarqueeBanner;
