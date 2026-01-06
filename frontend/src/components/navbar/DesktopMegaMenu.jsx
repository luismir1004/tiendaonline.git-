import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const DesktopMegaMenu = ({ isOpen, activeMenuId, navItems, onClose, handleMenuEnter, handleMenuLeave }) => {
  // Encontrar la data activa
  const activeItem = navItems.find(item => item.id === activeMenuId);

  return (
    <AnimatePresence>
      {isOpen && activeItem && activeItem.type === 'mega' && (
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[900px] z-50"
          onMouseEnter={() => handleMenuEnter(activeMenuId)}
          onMouseLeave={handleMenuLeave}
        >
          <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-black/5">
            <div className="grid grid-cols-4 min-h-[320px]">
              {/* Columnas de Navegación */}
              <div className="col-span-3 p-8 grid grid-cols-2 gap-8">
                {activeItem.columns.map((col, idx) => (
                  <div key={idx}>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                      {col.title}
                    </h4>
                    <ul className="space-y-4">
                      {col.items.map((subItem, subIdx) => (
                        <li key={subIdx}>
                          <Link 
                            to={subItem.href}
                            onClick={onClose}
                            className="group flex items-start gap-4 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                              <subItem.icon size={20} />
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                {subItem.label}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                {subItem.desc}
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Columna Promocional (Visual) */}
              {activeItem.promo && (
                <div className="col-span-1 relative bg-slate-900 flex flex-col justify-end overflow-hidden group">
                  <img 
                    src={activeItem.promo.image} 
                    alt={activeItem.promo.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-b ${activeItem.promo.gradient} opacity-80`} />
                  
                  <div className="relative z-10 p-8">
                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white mb-3 border border-white/10">
                      DESTACADO
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight mb-2">
                      {activeItem.promo.title}
                    </h3>
                    <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                      {activeItem.promo.subtitle}
                    </p>
                    <Link 
                      to={activeItem.promo.href}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider hover:gap-3 transition-all"
                    >
                      Ver Ofertas <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DesktopMegaMenu;