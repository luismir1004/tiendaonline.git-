import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Zap, Timer, Gift } from 'lucide-react';

const MESSAGES = [
  { id: 1, text: "⚡ AUDIO WEEK: Hasta 40% OFF - Tiempo limitado", icon: Zap, color: "text-yellow-400" },
  { id: 2, text: "🎁 Envío gratis en compras superiores a $100", icon: Truck, color: "text-green-400" },
  { id: 3, text: "⏰ Flash Sale termina en: 04:23:12", icon: Timer, color: "text-red-400" },
  { id: 4, text: "🔥 SOLO POR HOY: Descuentos extra en outlet", icon: Zap, color: "text-orange-500" },
];

const MarqueeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const location = useLocation();
  const isOffersPage = location.pathname === '/ofertas';

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
  }, []);

  useEffect(() => {
    if (!isVisible || isPaused) return;

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible, isPaused]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('marquee-dismissed', 'true');
    localStorage.setItem('marquee-dismissed-time', Date.now().toString());
  };

  if (!isVisible) return null;

  const currentMsg = isOffersPage 
    ? { text: "🎟️ CUPÓN FLASH: USA EL CÓDIGO 'TECH20' PARA 20% EXTRA", icon: Gift, color: "text-indigo-400" }
    : MESSAGES[currentMessageIndex];
  const CurrentIcon = currentMsg.icon;

  return (
    <div 
        className={`${isOffersPage ? 'bg-indigo-900' : 'bg-slate-900'} text-white overflow-hidden relative z-[60] border-b border-white/5 cursor-pointer transition-colors duration-500`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={isOffersPage ? 'offer-msg' : currentMessageIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase"
          >
            <CurrentIcon size={16} className={`${currentMsg.color}`} />
            <span>
                {currentMsg.text}
                {isPaused && <span className="ml-2 text-[10px] text-slate-400 normal-case bg-white/10 px-1.5 py-0.5 rounded">(Pausado)</span>}
            </span>
          </motion.div>
        </AnimatePresence>
        
        <button 
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          className="absolute right-4 p-1.5 hover:bg-slate-800 rounded-full transition-colors group"
          aria-label="Cerrar anuncio"
        >
          <X size={14} className="text-slate-500 group-hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default MarqueeBanner;