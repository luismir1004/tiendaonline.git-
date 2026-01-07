import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronRight, TrendingUp, Tag, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productService';

const SUGGESTED_CATEGORIES = [
  { id: 'smartphones', label: 'Celulares', icon: Tag },
  { id: 'audio', label: 'Audio Premium', icon: Tag },
  { id: 'laptops', label: 'Laptops', icon: Tag },
  { id: 'accessories', label: 'Accesorios', icon: Tag },
];

const QUICK_SEARCHES = ['Ofertas Flash 🔥', 'Outlet Tech', 'iPhone 15 OFF', 'Auriculares -20%'];

// Hook de Debounce simple
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch de productos basado en la búsqueda
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => getProducts({
      where: {
        title: {
          like: debouncedQuery
        }
      },
      limit: 5
    }),
    enabled: debouncedQuery.length > 2, // Solo buscar si hay más de 2 caracteres
    staleTime: 1000 * 60, // Cache results for 1 minute
  });

  const results = data?.docs || [];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Manejo de tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-2xl flex items-start justify-center pt-[10vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden mx-4 ring-1 ring-black/5"
            onClick={e => e.stopPropagation()}
          >
            {/* Header / Input */}
            <div className="relative flex items-center p-2 border-b border-slate-100">
              <Search className="absolute left-6 text-indigo-500" size={24} />
              <input
                ref={inputRef}
                type="text"
                placeholder="¿Qué estás buscando hoy?"
                className="w-full h-16 pl-14 pr-12 text-lg font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />

              <div className="absolute right-16 flex items-center gap-2">
                {/* Loader Indicator */}
                {(isLoading || isFetching) && query.length > 2 && (
                  <Loader2 className="animate-spin text-indigo-600" size={18} />
                )}

                {query && (
                  <button
                    onClick={clearSearch}
                    className="p-1 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="border-l border-slate-100 pl-2">
                <button
                  onClick={onClose}
                  className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-slate-400 hover:text-slate-600"
                >
                  <span className="sr-only">Cerrar</span>
                  <span className="text-xs font-bold tracking-wider">ESC</span>
                </button>
              </div>
            </div>

            {/* Contenido Dinámico */}
            <div className="bg-slate-50/50 min-h-[300px]">
              {query === '' ? (
                // Vista Inicial: Sugerencias
                <div className="p-6 grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      <TrendingUp size={14} /> Búsquedas Populares en Oferta
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_SEARCHES.map((term, idx) => (
                        <button
                          key={idx}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all active:scale-95"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                      Explorar Categorías
                    </h3>
                    <ul className="space-y-2">
                      {SUGGESTED_CATEGORIES.map((cat) => (
                        <li key={cat.id}>
                          <button
                            onClick={() => handleNavigate(`/?category=${cat.label}`)}
                            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <cat.icon size={16} />
                            </div>
                            <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                            <ArrowRight size={14} className="ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-400" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                // Vista Resultados
                <div className="p-2">
                  {query.length <= 2 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                      <p>Escribe al menos 3 caracteres...</p>
                    </div>
                  ) : results.length > 0 ? (
                    <div>
                      <h3 className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Resultados Rápidos
                      </h3>
                      <ul className="space-y-1">
                        {results.map(product => (
                          <li key={product.id}>
                            <button
                              onClick={() => handleNavigate(`/producto/${product.slug}`)} // Usar slug si está disponible
                              className="w-full flex items-center p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all group text-left"
                            >
                              <div className="w-12 h-12 rounded-lg bg-white border border-slate-100 overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div className="ml-4 flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors truncate">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-slate-500 truncate">{product.category}</p>
                              </div>
                              <div className="text-right flex-shrink-0 ml-4">
                                <span className="block font-bold text-slate-900 text-sm">${product.price?.toLocaleString()}</span>
                              </div>
                              <ChevronRight size={16} className="ml-4 text-slate-300 group-hover:text-indigo-500" />
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="p-4 border-t border-slate-200 mt-2">
                        <button
                          onClick={() => handleNavigate(`/?search=${query}`)}
                          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
                        >
                          Ver todos los resultados
                        </button>
                      </div>
                    </div>
                  ) : (
                    !isLoading && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                          <Search size={24} />
                        </div>
                        <p className="text-slate-900 font-bold mb-1">No encontramos resultados</p>
                        <p className="text-slate-500 text-sm">Intenta con otros términos</p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;