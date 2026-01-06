import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageOff, Loader2 } from 'lucide-react';
import { getDeterministicImage } from '../lib/imageUtils';

/**
 * SafeImage: Motor de renderizado de imágenes de alto rendimiento.
 * 
 * Estrategia de Fallback en Cascada:
 * 1. src original (si existe)
 * 2. Fallback "Luxury" (Unsplash IDs curados)
 * 3. Fallback "Unique" (Picsum con seed determinista)
 * 4. Placeholder SVG (Último recurso)
 */
const SafeImage = ({ 
  src, 
  alt, 
  fallbackSeed = 'default', 
  className = "", 
  priority = false 
}) => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);

  // Reiniciar ciclo si cambia la fuente principal
  useEffect(() => {
    if (src) {
      setStatus('loading');
      setCurrentSrc(src);
      setRetryCount(0);
    } else {
      // Si no hay src inicial, saltar directo al primer fallback
      triggerFallback();
    }
  }, [src]);

  const triggerFallback = () => {
    // Nivel 1: Imágenes Curadas de Alta Calidad (Unsplash)
    if (retryCount === 0) {
      const luxuryFallback = getDeterministicImage(String(fallbackSeed));
      if (currentSrc !== luxuryFallback) {
        console.warn(`[SafeImage] Load failed for: ${alt}. Retrying with Luxury Fallback.`);
        setCurrentSrc(luxuryFallback);
        setRetryCount(1);
        return;
      }
    }

    // Nivel 2: Imágenes Generadas Únicas (Picsum Seed)
    // Garantiza que CADA producto tenga una imagen distinta basada en su ID
    if (retryCount <= 1) {
      const uniqueSeedUrl = `https://picsum.photos/seed/${fallbackSeed}/800/1000`;
      if (currentSrc !== uniqueSeedUrl) {
        console.warn(`[SafeImage] Luxury failed. Retrying with Unique Seed Fallback.`);
        setCurrentSrc(uniqueSeedUrl);
        setRetryCount(2);
        return;
      }
    }

    // Nivel 3: Rendición total
    setStatus('error');
  };

  return (
    <div className={`relative w-full h-full overflow-hidden bg-slate-100 ${className}`}>
      
      {/* 1. Skeleton Loader (Pulse Effect) */}
      <AnimatePresence>
        {status === 'loading' && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 bg-slate-200 animate-pulse flex items-center justify-center"
          >
             {/* Opcional: Icono sutil mientras carga */}
             <Loader2 className="w-6 h-6 text-slate-300 animate-spin opacity-50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Imagen Real */}
      {status !== 'error' && (
        <motion.img
          initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          animate={{ 
            opacity: status === 'loaded' ? 1 : 0, 
            scale: status === 'loaded' ? 1 : 1.1, 
            filter: status === 'loaded' ? 'blur(0px)' : 'blur(10px)'
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          
          src={currentSrc}
          alt={alt || 'Product image'}
          
          // Performance Attributes
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          
          onLoad={() => setStatus('loaded')}
          onError={triggerFallback}
          
          className="w-full h-full object-cover transition-transform duration-700"
        />
      )}

      {/* 3. Error State (Minimalista) */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-300">
          <ImageOff size={32} strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
};

export default React.memo(SafeImage);