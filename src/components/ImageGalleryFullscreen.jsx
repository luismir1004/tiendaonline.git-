import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const ImageGalleryFullscreen = ({ 
  isOpen, 
  onClose, 
  images, 
  selectedIndex, 
  onIndexChange 
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onIndexChange((selectedIndex - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') onIndexChange((selectedIndex + 1) % images.length);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, images.length, onClose, onIndexChange]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          <button 
            onClick={() => onIndexChange((selectedIndex - 1 + images.length) % images.length)}
            className="absolute left-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors hidden md:block"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={() => onIndexChange((selectedIndex + 1) % images.length)}
            className="absolute right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors hidden md:block"
          >
            <ChevronRight size={32} />
          </button>

          {/* Main Image Container with Gestures */}
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            <motion.div
              className="relative w-full h-full flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <motion.img
                key={selectedIndex}
                src={images[selectedIndex]}
                alt={`Gallery image ${selectedIndex + 1}`}
                className="max-h-[90vh] max-w-[90vw] object-contain cursor-grab active:cursor-grabbing"
                
                // Gestures
                drag
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipeThreshold = 50;
                  if (offset.x > swipeThreshold) {
                    onIndexChange((selectedIndex - 1 + images.length) % images.length);
                  } else if (offset.x < -swipeThreshold) {
                    onIndexChange((selectedIndex + 1) % images.length);
                  } else if (offset.y > swipeThreshold) {
                    onClose(); // Swipe down to close
                  }
                }}
              />
            </motion.div>
          </div>

          {/* Thumbnails Strip */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[90vw] p-2 scrollbar-hide">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => onIndexChange(idx)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                  selectedIndex === idx ? 'ring-2 ring-white scale-110 opacity-100' : 'opacity-50 hover:opacity-75'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          
          <div className="absolute top-4 left-4 text-white/50 text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default ImageGalleryFullscreen;