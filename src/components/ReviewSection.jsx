import React, { useState, useMemo } from 'react';
import { Star, ThumbsUp, Image as ImageIcon, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Review Data
const MOCK_REVIEWS = [
  { id: 1, user: 'Carlos M.', rating: 5, date: 'Hace 2 días', content: '¡Increíble producto! La calidad es superior a lo esperado. El envío fue rapidísimo.', hasPhoto: true, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=150&q=80', helpful: 12 },
  { id: 2, user: 'Ana R.', rating: 4, date: 'Hace 1 semana', content: 'Muy bueno, pero el color es un poco más oscuro que en la foto. Aun así funciona perfecto.', hasPhoto: false, helpful: 5 },
  { id: 3, user: 'Miguel Angel', rating: 5, date: 'Hace 3 semanas', content: 'Lo compré en bundle con el estuche y fue la mejor decisión. Recomendado 100%.', hasPhoto: true, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=150&q=80', helpful: 24 },
  { id: 4, user: 'Laura S.', rating: 3, date: 'Hace 1 mes', content: 'El producto está bien, pero el empaque llegó un poco golpeado.', hasPhoto: false, helpful: 2 },
  { id: 5, user: 'Roberto D.', rating: 5, date: 'Ayer', content: 'Excelente relación calidad-precio. Volveré a comprar.', hasPhoto: false, helpful: 0 },
];

const ReviewSection = () => {
  const [filter, setFilter] = useState('all'); // all, photo, 5star

  const filteredReviews = useMemo(() => {
    switch(filter) {
      case 'photo': return MOCK_REVIEWS.filter(r => r.hasPhoto);
      case '5star': return MOCK_REVIEWS.filter(r => r.rating === 5);
      default: return MOCK_REVIEWS;
    }
  }, [filter]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 my-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Opiniones de Clientes</h2>
          <div className="flex items-center mt-2 gap-2">
             <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill="currentColor" />
                ))}
              </div>
              <span className="font-bold text-slate-900">4.8</span>
              <span className="text-slate-500 text-sm">basado en 128 reseñas</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            Todas
          </button>
          <button 
            onClick={() => setFilter('photo')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${filter === 'photo' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <ImageIcon size={16} /> Con Fotos
          </button>
          <button 
            onClick={() => setFilter('5star')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${filter === '5star' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            <Star size={16} /> 5 Estrellas
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <AnimatePresence mode="popLayout">
          {filteredReviews.map((review) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              layout
              className="border-b border-slate-100 pb-8 last:border-0 last:pb-0"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    {review.user.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{review.user}</h4>
                    <span className="text-xs text-slate-400">{review.date}</span>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-slate-200" : ""} />
                  ))}
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {review.content}
              </p>

              {review.hasPhoto && (
                <div className="mb-4">
                  <img src={review.image} alt="Review attachment" className="w-24 h-24 object-cover rounded-xl cursor-zoom-in hover:opacity-90 transition-opacity" />
                </div>
              )}

              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors">
                <ThumbsUp size={14} /> Es útil ({review.helpful})
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredReviews.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Filter size={48} className="mx-auto mb-4 opacity-20" />
            <p>No hay reseñas con este filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;