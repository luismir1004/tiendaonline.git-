import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Battery, 
  Wifi, 
  Scale, 
  Calendar, 
  ShieldCheck, 
  Cpu, 
  Maximize, 
  Zap, 
  Download, 
  Leaf, 
  Package, 
  Layers,
  Smartphone
} from 'lucide-react';
import toast from 'react-hot-toast';

const iconMap = {
  "Battery Life": Battery,
  "Weight": Scale,
  "Connectivity": Wifi,
  "Release Year": Calendar,
  "Warranty": ShieldCheck,
  "Processor": Cpu,
  "Screen Size": Maximize,
  "Charging": Zap,
  "OS": Smartphone,
  "Dimensions": Maximize,
  "Materials": Layers
};

const SpecBlock = ({ label, value, icon: Icon, isBestInClass }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5 }}
    className="bg-slate-50/50 rounded-2xl p-5 border border-slate-100/50 relative group hover:bg-white hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300"
  >
    {isBestInClass && (
      <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm z-10">
        Industry Leading
      </div>
    )}
    <div className="flex items-start justify-between mb-3">
      <div className="p-2 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
        <Icon size={20} />
      </div>
    </div>
    <div className="space-y-1">
      <p className="text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400">{label}</p>
      <p className="text-slate-900 font-medium text-lg leading-tight">{value}</p>
    </div>
  </motion.div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`pb-4 px-4 text-sm font-bold uppercase tracking-wider transition-all relative ${
      active ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {children}
    {active && (
      <motion.div 
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
      />
    )}
  </button>
);

const ProductSpecs = ({ product }) => {
  const [activeTab, setActiveTab] = useState('specs');

  const handleDownloadPDF = () => {
    const loadingToast = toast.loading('Generando Ficha Técnica...');
    setTimeout(() => {
      toast.dismiss(loadingToast);
      toast.success('PDF descargado correctamente');
    }, 1500);
  };

  // Helper to identify "Best in Class" specs (mock logic)
  const isBestInClass = (key, value) => {
    if (key === 'Battery Life' && parseInt(value) >= 30) return true;
    if (key === 'Weight' && parseInt(value) <= 250) return true; // assuming grams
    if (key === 'Charging' && value.toLowerCase().includes('fast')) return true;
    return false;
  };

  const specs = product.specs || {};
  // Merge dimensions/materials into specs for display if they exist separately
  const displaySpecs = { ...specs };
  if (product.dimensions?.weight) displaySpecs['Weight'] = product.dimensions.weight;
  if (product.dimensions?.size) displaySpecs['Dimensions'] = product.dimensions.size;

  return (
    <section id="product-specs" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Ingeniería de Precisión</h2>
            <p className="text-slate-500 text-lg font-light leading-relaxed">
              Cada componente ha sido diseñado meticulosamente para ofrecer un rendimiento sin compromisos. 
              Explora las especificaciones que definen un nuevo estándar.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-slate-100 mb-12 flex gap-4 overflow-x-auto scrollbar-hide">
          <TabButton active={activeTab === 'specs'} onClick={() => setActiveTab('specs')}>Especificaciones Técnicas</TabButton>
          <TabButton active={activeTab === 'sustainability'} onClick={() => setActiveTab('sustainability')}>Sostenibilidad</TabButton>
          <TabButton active={activeTab === 'box'} onClick={() => setActiveTab('box')}>Contenido de la Caja</TabButton>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === 'specs' && (
            <motion.div
              key="specs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
            >
              {Object.entries(displaySpecs).map(([key, value], idx) => (
                <SpecBlock 
                  key={key} 
                  label={key} 
                  value={value} 
                  icon={iconMap[key] || Layers} 
                  isBestInClass={isBestInClass(key, value)}
                />
              ))}
              
              {/* Fallback if few specs */}
              {Object.keys(displaySpecs).length < 4 && (
                <>
                  <SpecBlock label="Material" value="Aerospace Grade Aluminum" icon={Layers} />
                  <SpecBlock label="Eco-Friendly" value="100% Recyclable" icon={Leaf} isBestInClass={true} />
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'sustainability' && (
            <motion.div
              key="sustainability"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-50/50 rounded-3xl p-8 md:p-12 border border-slate-100"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                   <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-6">
                      <Leaf size={14} /> Carbon Neutral
                   </div>
                   <h3 className="text-2xl font-bold text-slate-900 mb-4">Comprometidos con el futuro</h3>
                   <p className="text-slate-600 leading-relaxed mb-6">
                     Este producto está fabricado con un 45% de materiales reciclados y empaquetado sin plásticos de un solo uso. 
                     Nuestra cadena de suministro es auditada anualmente para garantizar prácticas laborales justas.
                   </p>
                   <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-3xl font-bold text-slate-900">100%</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Aluminio Reciclado</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold text-slate-900">0%</p>
                        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Plásticos en caja</p>
                      </div>
                   </div>
                </div>
                <div className="relative aspect-video bg-emerald-900/5 rounded-2xl overflow-hidden flex items-center justify-center">
                   <Leaf size={64} className="text-emerald-500/20" />
                   <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'box' && (
            <motion.div
              key="box"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-3 gap-6"
            >
               {[
                 { name: product.name, desc: "Main Unit", icon: Smartphone },
                 { name: "Cable USB-C", desc: "Braided 2m Cable", icon: Zap },
                 { name: "Manuales", desc: "Quick Start Guide", icon: Layers }
               ].map((item, i) => (
                 <div key={i} className="flex items-center gap-4 p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-500">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};

export default ProductSpecs;