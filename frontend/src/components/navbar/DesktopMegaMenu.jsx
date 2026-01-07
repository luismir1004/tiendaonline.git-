import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const DesktopMegaMenu = ({ isOpen, activeMenuId, navItems, onClose, handleMenuEnter, handleMenuLeave }) => {
  // Encontrar la data activa
  const activeItem = navItems.find(item => item.id === activeMenuId);

  return (
    <AnimatePresence>
      {isOpen && activeItem && activeItem.type === 'mega' && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.96 }}
          transition={{
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1] // Easing más suave
          }}
          className="absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[950px] z-50"
          onMouseEnter={() => handleMenuEnter(activeMenuId)}
          onMouseLeave={handleMenuLeave}
        >
          <div className="bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-slate-900/10 border border-white/60 overflow-hidden ring-1 ring-black/5">
            <div className="grid grid-cols-4 min-h-[380px]">
              {/* Columnas de Navegación - 3 columnas */}
              <div className="col-span-3 p-10 grid grid-cols-3 gap-8">
                {activeItem.columns.map((col, idx) => (
                  <div key={idx} className="space-y-5">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-px flex-1 bg-gradient-to-r from-indigo-200 to-transparent" />
                      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {col.title}
                      </h4>
                      <div className="h-px flex-1 bg-gradient-to-l from-indigo-200 to-transparent" />
                    </div>
                    <ul className="space-y-2">
                      {col.items.map((subItem, subIdx) => (
                        <motion.li
                          key={subIdx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 + subIdx * 0.03 }}
                        >
                          <Link
                            to={subItem.href}
                            onClick={onClose}
                            className="group flex items-start gap-3 p-3 -mx-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50/80 hover:to-purple-50/50 transition-all duration-300"
                          >
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center text-slate-500 group-hover:from-indigo-100 group-hover:to-purple-100 group-hover:text-indigo-600 group-hover:scale-110 transition-all duration-300 shadow-sm">
                              <subItem.icon size={18} strokeWidth={2.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-700 transition-colors mb-0.5">
                                {subItem.label}
                              </div>
                              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                {subItem.desc}
                              </p>
                            </div>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Columna Promocional (Visual) */}
              {activeItem.promo && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.4 }}
                  className="col-span-1 relative bg-slate-900 flex flex-col justify-end overflow-hidden group"
                >
                  {/* Imagen con efecto parallax */}
                  <motion.img
                    src={activeItem.promo.image}
                    alt={activeItem.promo.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />

                  {/* Gradiente overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${activeItem.promo.gradient} opacity-90 mix-blend-multiply`} />

                  {/* Efecto de brillo animado */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut"
                    }}
                  />

                  <div className="relative z-10 p-8 space-y-4">
                    {/* Badge animado */}
                    <motion.span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/20 shadow-lg"
                      animate={{
                        boxShadow: [
                          '0 0 0 0 rgba(255,255,255,0.4)',
                          '0 0 0 8px rgba(255,255,255,0)',
                        ]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    >
                      <Sparkles size={12} className="fill-white" />
                      DESTACADO
                    </motion.span>

                    <h3 className="text-2xl font-bold text-white leading-tight drop-shadow-lg">
                      {activeItem.promo.title}
                    </h3>

                    <p className="text-sm text-white/90 leading-relaxed font-medium">
                      {activeItem.promo.subtitle}
                    </p>

                    <Link
                      to={activeItem.promo.href}
                      onClick={onClose}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-white/90 hover:gap-3 transition-all shadow-lg hover:shadow-xl group/btn"
                    >
                      Ver Ofertas
                      <ArrowRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DesktopMegaMenu;