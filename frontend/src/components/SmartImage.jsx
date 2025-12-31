import React, { useState } from 'react';
import { cn } from '../lib/utils';

const SmartImage = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);
  // Usamos un placeholder real de servicio público en lugar de un string roto
  const fallbackImage = 'https://placehold.co/600x600/png?text=No+Image';

  // Lógica para construir URL completa si viene de Payload (ruta relativa)
  const getFullSrc = (imageSrc) => {
    if (!imageSrc) return fallbackImage;
    if (imageSrc.startsWith('http') || imageSrc.startsWith('blob:') || imageSrc.startsWith('data:')) {
      return imageSrc;
    }
    // Asumimos que si empieza con /, es una imagen local del servidor Payload
    if (imageSrc.startsWith('/')) {
        // VITE_API_URL suele ser .../api, necesitamos la base. 
        // Si VITE_API_URL es 'http://localhost:3000/api', queremos 'http://localhost:3000'
        const baseUrl = import.meta.env.VITE_API_URL 
            ? import.meta.env.VITE_API_URL.replace('/api', '') 
            : '';
        return `${baseUrl}${imageSrc}`;
    }
    return imageSrc;
  };

  const finalSrc = error ? fallbackImage : getFullSrc(src);

  const handleError = () => {
    setError(true);
    // En producción, aquí enviarías el error a Sentry o LogRocket
    console.warn(`[IMAGE_ERROR]: Falló la carga de la imagen: ${src}`);
  };

  return (
    <img
      src={finalSrc}
      alt={alt || 'Producto'}
      className={cn(
        "transition-opacity duration-500 ease-in-out", 
        error ? "opacity-50" : "opacity-100",
        className
      )}
      onError={handleError}
      loading="lazy"
      draggable="false" // <--- Evita el arrastre accidental en móviles
      {...props}
    />
  );
};

export default SmartImage;