import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, HelpCircle, MessageCircle, Package } from 'lucide-react';
import Input from '../Input';
import toast from 'react-hot-toast';

const FAQS = [
    { q: "¿Cuánto tarda el envío?", a: "Generalmente 24-48 horas hábiles." },
    { q: "¿Tienen garantía?", a: "Sí, 2 años de garantía oficial." },
    { q: "¿Cómo devuelvo un producto?", a: "Contáctanos dentro de los 30 días." },
];

const SupportDrawer = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orderId, setOrderId] = useState('');
  const [trackingStatus, setTrackingStatus] = useState(null);

  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTrackOrder = (e) => {
      e.preventDefault();
      if(!orderId) return;
      // Mock tracking logic
      setTrackingStatus('En camino - Llega mañana');
      toast.success('Estado del pedido actualizado');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="text-indigo-600" /> Centro de Ayuda
                </h2>
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                    <X size={20} />
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                
                {/* Search FAQ */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Preguntas Frecuentes</h3>
                    <div className="relative mb-4">
                        <input 
                            type="text" 
                            placeholder="Buscar ayuda..." 
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                    <div className="space-y-2">
                        {filteredFaqs.map((faq, i) => (
                            <div key={i} className="bg-slate-50 p-3 rounded-lg">
                                <p className="text-sm font-medium text-slate-900">{faq.q}</p>
                                <p className="text-xs text-slate-500 mt-1">{faq.a}</p>
                            </div>
                        ))}
                        {filteredFaqs.length === 0 && <p className="text-xs text-slate-400 text-center">No se encontraron resultados.</p>}
                    </div>
                </section>

                {/* Track Order */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Package size={16} /> Rastrear Pedido
                    </h3>
                    <form onSubmit={handleTrackOrder} className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="# Orden (ej. 1234)" 
                            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                        />
                        <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium">
                            Ver
                        </button>
                    </form>
                    {trackingStatus && (
                        <div className="mt-2 p-3 bg-emerald-50 text-emerald-700 text-sm rounded-lg border border-emerald-100 font-medium">
                            {trackingStatus}
                        </div>
                    )}
                </section>

                {/* Contact */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Contacto Directo</h3>
                    <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20">
                        <MessageCircle size={20} /> WhatsApp Business
                    </button>
                    <p className="text-xs text-center text-slate-400 mt-2">Tiempo de respuesta: ~5 min</p>
                </section>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SupportDrawer;
