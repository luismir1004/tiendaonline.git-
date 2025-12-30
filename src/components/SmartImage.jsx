import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const SmartImage = ({ src, alt, className, priority = false, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Aseguramos que la URL base esté limpia antes de añadir parámetros
  const baseUrl = src?.split('?')[0];
  const queryParams = src?.split('?')[1] || '';
  
  // Detectamos si es Unsplash para aplicar la optimización
  const isUnsplash = src?.includes('unsplash');
  
  // Construcción de URLs optimizadas para srcset con WebP forzado
  // &fmt=webp es clave para 2025 performance
  const webpParam = '&fmt=webp';

  const mobileUrl = isUnsplash 
    ? `${baseUrl}?${queryParams}&w=400&q=80&auto=format${webpParam}`
    : src;
    
  const desktopUrl = isUnsplash
    ? `${baseUrl}?${queryParams}&w=800&q=80&auto=format${webpParam}`
    : src;

  // Tiny placeholder for blur effect
  const placeholderUrl = isUnsplash 
    ? `${baseUrl}?${queryParams}&w=50&q=10&auto=format${webpParam}` 
    : src;

  const [currentSrc, setCurrentSrc] = useState(placeholderUrl);

  useEffect(() => {
    if (!isUnsplash) {
      setIsLoaded(true);
      return;
    }

    const targetSrc = window.innerWidth < 768 ? mobileUrl : desktopUrl;

    const img = new Image();
    img.src = targetSrc;
    if (priority) img.fetchPriority = "high";
    
    img.onload = () => {
        setCurrentSrc(targetSrc);
        setIsLoaded(true);
    };
    img.onerror = () => setHasError(true);

  }, [src, priority, isUnsplash, mobileUrl, desktopUrl]);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-slate-50 ${className}`}>
        <div className="flex flex-col items-center gap-2 text-slate-300">
            <Zap size={32} strokeWidth={1.5} />
            <span className="text-[10px] uppercase tracking-widest font-medium">TechNova</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${className}`}>
      <motion.img
        src={currentSrc}
        alt={alt}
        // Native srcset for browser optimization
        srcSet={isUnsplash ? `${mobileUrl} 400w, ${desktopUrl} 800w` : undefined}
        sizes="(max-width: 768px) 100vw, 50vw"
        
        initial={{ filter: 'blur(20px)', opacity: 0.8, scale: 1.05 }}
        animate={{ 
          filter: isLoaded ? 'blur(0px)' : 'blur(20px)',
          opacity: 1,
          scale: 1
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`w-full h-full object-cover ${className}`}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
};

export default SmartImage;