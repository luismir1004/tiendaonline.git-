import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight } from 'lucide-react';
import SmartImage from '../SmartImage';

const DesktopMegaMenu = ({ activeMenu, config, onClose }) => {
  const data = config[activeMenu];

  if (!data) return null;

  return (
    <AnimatePresence>
      {activeMenu && (
        <motion.div
          layoutId="mega-menu-container"
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: 10, height: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-full left-0 w-full bg-white/90 backdrop-blur-xl border-b border-white/20 shadow-2xl z-40 overflow-hidden"
          onMouseLeave={onClose}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-12 gap-8"
            >
              {/* --- Navigation Columns --- */}
              {data.type === 'grid' && data.columns && (
                <div className="col-span-4 grid grid-cols-2 gap-8 border-r border-slate-200/50 pr-8">
                  {data.columns.map((col, idx) => (
                    <div key={idx}>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{col.title}</h3>
                      <ul className="space-y-3">
                        {col.items.map((item, i) => (
                          <li key={i}>
                            <Link 
                              to={item.href}
                              onClick={onClose}
                              className="block text-sm font-medium text-slate-700 hover:text-indigo-600 hover:translate-x-1 transition-all"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {data.type === 'visual-list' && (
                <div className="col-span-4 border-r border-slate-200/50 pr-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Explorar por Estilo</h3>
                  <ul className="space-y-4">
                    {data.items.map((item, i) => (
                      <li key={i} className="group">
                        <Link to={item.href} onClick={onClose} className="block">
                          <span className="flex items-center justify-between text-base font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                            {item.label}
                            <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                          </span>
                          <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* --- Trending / Gallery Section --- */}
              {data.trending && (
                <div className="col-span-5 px-8">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tendencias</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {data.trending.map((trend) => (
                      <Link key={trend.id} to={trend.href} onClick={onClose} className="group block">
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-50 mb-3 border border-slate-100">
                          <SmartImage 
                            src={trend.image} 
                            alt={trend.label}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {trend.badge && (
                            <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm text-indigo-600">
                              {trend.badge}
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{trend.label}</h4>
                        <p className="text-xs text-slate-500">{trend.price}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* --- Editorial Section (Right Banner) --- */}
              <div className="col-span-3">
                 {data.editorial && (
                    <Link to={data.editorial.href} onClick={onClose} className="block relative h-full rounded-2xl overflow-hidden group">
                        <SmartImage 
                            src={data.editorial.bgImage} 
                            alt={data.editorial.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest border border-white/30 px-2 py-1 rounded mb-2 inline-block">
                                Editorial
                            </span>
                            <h3 className="text-xl font-bold text-white leading-tight mb-1">{data.editorial.title}</h3>
                            <p className="text-sm text-slate-300 line-clamp-2">{data.editorial.subtitle}</p>
                            <div className="mt-4 flex items-center text-xs font-bold text-white gap-1 group-hover:gap-2 transition-all">
                                Ver Colección <ChevronRight size={14} />
                            </div>
                        </div>
                    </Link>
                 )}
              </div>

            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DesktopMegaMenu;
