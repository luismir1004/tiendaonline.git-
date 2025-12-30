import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useHistoryStore from '../stores/historyStore';
import useCurrency from '../hooks/useCurrency';
import SmartImage from './SmartImage';

const RecentlyViewed = () => {
  const { history } = useHistoryStore();
  const { convertPrice, getCurrencySymbol } = useCurrency();

  if (!history || history.length === 0) return null;

  return (
    <div className="mt-16 border-t border-slate-100 pt-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900">Visto Recientemente</h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
        {history.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-w-[160px] w-[160px] flex-shrink-0 group cursor-pointer"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-3 border border-transparent group-hover:border-slate-200 transition-colors">
                 <SmartImage 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                 />
              </div>
              <h4 className="text-sm font-semibold text-slate-900 truncate">{product.name}</h4>
              <p className="text-sm text-slate-500">
                {getCurrencySymbol()} {convertPrice(product.price).toFixed(2)}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;