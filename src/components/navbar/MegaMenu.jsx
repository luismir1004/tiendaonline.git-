import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import SmartImage from '../SmartImage';

const MegaMenu = ({ isOpen, onClose, categories, featuredProduct }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xl z-50 overflow-hidden"
          onMouseLeave={onClose}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-12 gap-8">
              {/* Categories Column */}
              <div className="col-span-3 border-r border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Categorías</h3>
                <ul className="space-y-3">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <Link 
                        to={`/?category=${cat}`} 
                        className="block text-slate-700 hover:text-indigo-600 hover:translate-x-1 transition-all text-sm font-medium"
                        onClick={onClose}
                      >
                        {cat}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link 
                      to="/?filter=offers" 
                      className="block text-rose-500 hover:text-rose-600 font-bold hover:translate-x-1 transition-all text-sm"
                      onClick={onClose}
                    >
                      Ver todas las Ofertas
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Trending Column */}
              <div className="col-span-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Más Buscados</h3>
                <ul className="space-y-4">
                  <li className="group cursor-pointer">
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">Auriculares Wireless</span>
                    <p className="text-xs text-slate-500">Cancelación de ruido</p>
                  </li>
                  <li className="group cursor-pointer">
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">Teclados Mecánicos</span>
                    <p className="text-xs text-slate-500">Para productividad</p>
                  </li>
                  <li className="group cursor-pointer">
                    <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">Smart Home</span>
                    <p className="text-xs text-slate-500">Automatización</p>
                  </li>
                </ul>
              </div>

              {/* Featured Product (Visual) */}
              <div className="col-span-6 pl-8">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Destacado del Mes</h3>
                 {featuredProduct ? (
                    <Link to={`/product/${featuredProduct.id}`} onClick={onClose} className="flex gap-6 group">
                        <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-50 relative">
                             <SmartImage 
                                src={featuredProduct.image} 
                                alt={featuredProduct.name} 
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                             />
                        </div>
                        <div className="flex-1 py-2">
                            <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{featuredProduct.name}</h4>
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{featuredProduct.description}</p>
                            <span className="inline-block mt-3 text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
                                Ver Detalles &rarr;
                            </span>
                        </div>
                    </Link>
                 ) : (
                    <div className="h-32 bg-slate-50 rounded-xl animate-pulse" />
                 )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;