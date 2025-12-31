import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Ahora recibimos 'products' como prop desde el padre (App/Layout)
const SearchOverlay = ({ isOpen, onClose, products = [] }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Enfocar el input cuando se abre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Lógica de búsqueda usando los productos dinámicos
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    // Filtrado seguro verificando que products sea un array
    const sourceData = Array.isArray(products) ? products : [];

    const filtered = sourceData.filter(product => {
      const nameMatch = product.name?.toLowerCase().includes(query.toLowerCase());
      const catMatch = product.category?.toLowerCase().includes(query.toLowerCase());
      return nameMatch || catMatch;
    });
    setResults(filtered);
  }, [query, products]);

  const handleNavigate = (productId) => {
    onClose();
    navigate(`/product/${productId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm flex items-start justify-center pt-20"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden mx-4"
            onClick={e => e.stopPropagation()}
          >
            {/* Header / Input */}
            <div className="flex items-center p-4 border-b border-slate-100">
              <Search className="text-slate-400 ml-2" size={24} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Buscar productos, categorías..."
                className="flex-1 h-12 px-4 text-lg text-slate-800 placeholder-slate-400 outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="text-slate-500" size={24} />
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto bg-slate-50">
              {query === '' ? (
                <div className="p-10 text-center text-slate-400">
                  <p>Empieza a escribir para buscar...</p>
                </div>
              ) : results.length > 0 ? (
                <ul className="divide-y divide-slate-100">
                  {results.map(product => (
                    <li key={product.id}>
                      <button
                        onClick={() => handleNavigate(product.id)}
                        className="w-full flex items-center p-4 hover:bg-white transition-colors group text-left"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-16 h-16 object-cover rounded-lg bg-slate-200"
                        />
                        <div className="ml-4 flex-1">
                          <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-sm text-slate-500">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-slate-900">${product.price}</span>
                          {product.promotion && product.promotion.type === 'percentage' && (
                             <span className="text-xs text-green-600 font-medium">-{product.promotion.value}%</span>
                          )}
                        </div>
                        <ChevronRight className="ml-4 text-slate-300 group-hover:text-slate-500" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-10 text-center text-slate-500">
                  <p>No encontramos nada para "{query}"</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="bg-slate-100 px-4 py-3 text-xs text-slate-500 text-right">
              Presiona ESC para cerrar
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;