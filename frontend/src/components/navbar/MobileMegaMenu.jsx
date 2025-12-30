import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ArrowRight } from 'lucide-react';

const MobileAccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full py-3 text-lg font-medium text-slate-700"
      >
        {title}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} className="text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-4 pl-4 space-y-3">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileMegaMenu = ({ config, onClose }) => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (key) => {
    setOpenSection(openSection === key ? null : key);
  };

  return (
    <div className="w-full px-4">
      {Object.entries(config).map(([key, data]) => (
        <MobileAccordionItem
          key={key}
          title={data.label}
          isOpen={openSection === key}
          onToggle={() => toggleSection(key)}
        >
          {/* Sub-links Logic */}
          {data.type === 'grid' && data.columns?.map((col, idx) => (
             <div key={idx} className="mb-4 last:mb-0">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">{col.title}</h4>
                <div className="flex flex-col gap-2">
                    {col.items.map((item, i) => (
                        <Link 
                            key={i} 
                            to={item.href} 
                            onClick={onClose}
                            className="text-sm text-slate-600 hover:text-indigo-600"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
             </div>
          ))}

          {data.type === 'visual-list' && (
             <div className="flex flex-col gap-3">
                {data.items.map((item, i) => (
                    <Link 
                        key={i} 
                        to={item.href} 
                        onClick={onClose}
                        className="flex items-center justify-between text-sm font-medium text-slate-700 bg-slate-50 p-3 rounded-lg"
                    >
                        {item.label}
                        <ArrowRight size={14} className="text-slate-400" />
                    </Link>
                ))}
             </div>
          )}
          
          {/* Editorial Link Mobile */}
          {data.editorial && (
             <Link 
                to={data.editorial.href} 
                onClick={onClose}
                className="block mt-4 relative rounded-xl overflow-hidden h-32"
             >
                <img src={data.editorial.bgImage} alt="Promo" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-sm border border-white/50 px-3 py-1 rounded">
                        Ver {data.editorial.title}
                    </span>
                </div>
             </Link>
          )}

        </MobileAccordionItem>
      ))}
    </div>
  );
};

export default MobileMegaMenu;
