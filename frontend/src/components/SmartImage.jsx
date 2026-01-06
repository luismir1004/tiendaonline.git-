import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageOff, Loader2 } from 'lucide-react';
import { getDeterministicImage } from '../lib/imageUtils';

/**
 * SmartImage: Componente de Alta Resiliencia
 * 
 * Máquina de Estados:
 * 1. LOADING: Muestra Skeleton.
 * 2. ATTEMPT_PRIMARY: Intenta cargar src original.
 * 3. ATTEMPT_BACKUP: Intenta getDeterministicImage(seed).
 * 4. FINAL_FALLBACK: Renderiza un degradado CSS.
 * 5. LOADED: Muestra la imagen con Fade-In.
 */
const SmartImage = ({
  src,
  alt,
  seedId,
  className = "",
  priority = false
}) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'failed'
  const [currentSrc, setCurrentSrc] = useState(src);
  const [attempt, setAttempt] = useState(0); // 0: Primary, 1: Backup

  useEffect(() => {
    setStatus('loading');
    setCurrentSrc(src);
    setAttempt(0);
  }, [src]);

  const handleError = () => {
    // Si estamos en el primer intento, probamos el backup determinista
    if (attempt === 0 && seedId) {
      console.warn(`[SmartImage] Primary failed for ${alt}. Switching to backup.`);
      const backupUrl = getDeterministicImage(seedId);
      
      // Evitar loop si la backup es igual a la original
      if (backupUrl !== currentSrc) {
        setCurrentSrc(backupUrl);
        setAttempt(1);
        return;
      }
    }

    // Si falla el backup (o no hay seed), nos rendimos
    setStatus('failed');
  };
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      
      {/* 1. Skeleton Loading (Absolute Overlay) */}
      <AnimatePresence>
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-slate-100 animate-pulse z-20 flex items-center justify-center"
          >
             <Loader2 className="w-5 h-5 text-slate-300 animate-spin opacity-30" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Image Renderer */}
      {status !== 'failed' && (
        <motion.img
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ 
            opacity: status === 'loaded' ? 1 : 0, 
            scale: status === 'loaded' ? 1 : 1.1 
          }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          
          src={currentSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          
          onLoad={() => setStatus('loaded')}
          onError={handleError}
          
          className="w-full h-full object-cover will-change-transform"
        />
      )}

      {/* 3. Final Fallback (CSS Gradient & Typography) */}
      {status === 'failed' && (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 p-4 text-center z-10"
        >
            <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                <ImageOff size={20} className="text-slate-300" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                {alt?.slice(0, 20) || 'Producto'}
            </span>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(SmartImage);