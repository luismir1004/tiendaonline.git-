import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';
import { resolveProductImage } from '../lib/imageUtils';

/**
 * ProductImage: Componente de Alta Disponibilidad con Circuit Breaker.
 */
const ProductImage = ({ 
  product, 
  alt, 
  priority = false, 
  className = "" 
}) => {
  // Memoizamos la resolución para evitar recálculos en re-renders
  const { primary, backup, gradient } = useMemo(() => resolveProductImage(product), [product]);
  
  const [status, setStatus] = useState('loading'); // 'loading' | 'primary_loaded' | 'backup_loaded' | 'failed'
  const [currentSrc, setCurrentSrc] = useState(primary);
  const [hasRetried, setHasRetried] = useState(false); // Circuit Breaker

  // Reset state on product change
  useEffect(() => {
    setStatus('loading');
    setCurrentSrc(primary);
    setHasRetried(false);
  }, [primary]);

  const handleError = () => {
    // Si ya estamos fallando o ya intentamos el backup, STOP.
    if (status === 'failed' || hasRetried) {
      setStatus('failed');
      return;
    }

    // Si la primaria falló, intentar backup
    // Verificamos explícitamente que backup exista y sea diferente
    if (currentSrc === primary && backup && primary !== backup) {
      console.warn(`[ProductImage] Primary failed. Switching to backup for ${product?.id}`);
      setCurrentSrc(backup);
      setHasRetried(true); // Activar Circuit Breaker
    } else {
      // Si la backup falló (o era igual a la primaria), rendirse.
      setStatus('failed');
    }
  };

  return (
    <div 
      className={`relative w-full h-full overflow-hidden ${className}`}
      style={{ background: status === 'failed' ? gradient : '#f3f4f6' }}
    >
      
      {/* 1. Skeleton Loading */}
      <AnimatePresence>
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-20 bg-slate-100 animate-pulse flex items-center justify-center"
          >
             {/* Micro-brand placeholder */}
             <div className="w-12 h-12 bg-slate-200/50 rounded-full" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Image Engine */}
      {status !== 'failed' && (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: status.includes('loaded') ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          
          src={currentSrc}
          alt={alt || product?.name || 'Product'}
          
          // LCP Optimization
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          
          onLoad={() => setStatus(currentSrc === primary ? 'primary_loaded' : 'backup_loaded')}
          onError={handleError}
          
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      )}

      {/* 3. Final Fallback (Gradient + Text) */}
      {status === 'failed' && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10"
        >
          <div className="bg-white/40 backdrop-blur-md p-3 rounded-full mb-3 shadow-sm">
            <Package size={24} className="text-slate-500" strokeWidth={1.5} />
          </div>
          <span className="text-[10px] font-bold text-slate-500/70 uppercase tracking-widest truncate w-full px-4">
            {product?.name || 'Producto'}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default React.memo(ProductImage);