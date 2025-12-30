import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import useCartStore from '../stores/cartStore';

const ExitIntentModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const cartCount = useCartStore((state) => state.getCartCount());

  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Trigger if user moves mouse to top of browser (e.clientY <= 0), hasn't triggered yet, and has items in cart
      if (e.clientY <= 0 && !hasTriggered && cartCount > 0) {
        setIsVisible(true);
        setHasTriggered(true); // Ensure it only shows once per session
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasTriggered, cartCount]);

  const handleClose = () => setIsVisible(false);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl text-center overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
            
            <button 
                onClick={handleClose}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X size={24} />
            </button>

            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift size={32} />
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Espera! No te vayas aún</h3>
            <p className="text-slate-500 mb-6">
              Tienes productos increíbles en tu carrito. Completa tu orden ahora y recibe <strong>Envío Gratis</strong>.
            </p>

            <button 
                onClick={handleClose}
                className="w-full py-3 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 mb-3"
            >
                Volver al carrito
            </button>
            <button 
                onClick={handleClose}
                className="text-sm text-slate-400 font-medium hover:text-slate-600"
            >
                No, gracias, prefiero pagar envío
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;
