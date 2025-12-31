import React, { useState } from 'react';
import { cn } from '../lib/utils';

const SmartImage = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);
  // Usamos un placeholder real de servicio público en lugar de un string roto
  const fallbackImage = 'https://placehold.co/600x600/png?text=No+Image';

  const handleError = () => {
    setError(true);
    // En producción, aquí enviarías el error a Sentry o LogRocket
    console.warn(`[IMAGE_ERROR]: Falló la carga de la imagen: ${src}`);
  };

  return (
    <img
      src={error || !src ? fallbackImage : src}
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