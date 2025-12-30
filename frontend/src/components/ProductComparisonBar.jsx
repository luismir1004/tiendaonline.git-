import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Layers, Scale } from 'lucide-react';
import useCompareStore from '../stores/compareStore';
import ComparisonModal from './ComparisonModal';

const ProductComparisonBar = () => {
  const { compareItems, removeItem, clearItems, isCompareBarOpen, toggleCompareBar } = useCompareStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (compareItems.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        {isCompareBarOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 z-40 overflow-hidden ring-1 ring-slate-900/5"
          >
            {/* Header */}
            <div className="bg-slate-900/95 backdrop-blur px-4 py-3 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Scale size={18} className="text-indigo-400" />
                <span className="font-semibold text-sm tracking-wide">Comparador ({compareItems.length})</span>
              </div>
              <div className="flex items-center gap-2">
                  <button 
                      onClick={clearItems}
                      className="text-[10px] uppercase font-bold text-slate-400 hover:text-white transition-colors"
                  >
                      Limpiar
                  </button>
                  <button 
                      onClick={toggleCompareBar}
                      className="text-slate-400 hover:text-white transition-colors"
                  >
                      <X size={18} />
                  </button>
              </div>
            </div>

            {/* Items List */}
            <div className="p-4 max-h-60 overflow-y-auto custom-scrollbar">
              <div className="space-y-3">
                {compareItems.map((item) => (
                  <motion.div 
                    layoutId={`compare-item-${item.id}`}
                    key={item.id} 
                    className="flex items-center justify-between group bg-white/50 p-2 rounded-lg border border-transparent hover:border-slate-200 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-10 h-10 rounded-md object-cover bg-slate-100" 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.name}</p>
                        <p className="text-xs text-slate-500 font-mono">${item.price}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100">
               <button 
                  onClick={() => setIsModalOpen(true)}
                  disabled={compareItems.length < 2}
                  className={`flex items-center justify-center w-full py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
                      compareItems.length > 1 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
               >
                  Comparar Ahora <ArrowRight size={16} className="ml-2" />
               </button>
               {compareItems.length < 2 && (
                   <p className="text-center text-[10px] text-slate-400 mt-2">Añade al menos 2 productos</p>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Modal */}
      <ComparisonModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default ProductComparisonBar;