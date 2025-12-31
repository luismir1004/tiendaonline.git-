import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';

const DealsLink = () => {
  const [dealCount, setDealCount] = useState(0);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        // Assuming 'promotion' field exists or we filter by category 'offers'
        // Adjust the query based on actual backend schema. 
        // For now, fetching items with a 'promotion' field or similar logic.
        const { totalDocs } = await getProducts({ 
            where: { 
                promotion: { exists: true } 
            },
            limit: 1 // We only need the count
        });
        setDealCount(totalDocs);
      } catch (error) {
        // Fallback or silent error
        console.warn('Failed to fetch deal count');
      }
    };

    fetchDeals();
  }, []);

  return (
    <Link 
      to="/?filter=offers" 
      className="relative flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-rose-600 transition-colors group"
    >
      <span>Ofertas</span>
      {dealCount > 0 && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
      )}
      
      {/* Tooltip Badge */}
      <motion.span 
        initial={{ opacity: 0, y: -5 }}
        whileHover={{ opacity: 1, y: 0 }}
        className="absolute -top-8 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap pointer-events-none"
      >
        -{dealCount} items hoy
        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-rose-600"></div>
      </motion.span>
    </Link>
  );
};

export default DealsLink;
