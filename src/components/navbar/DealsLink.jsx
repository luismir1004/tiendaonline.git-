import React from 'react';
import { motion } from 'framer-motion';
import { Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const DealsLink = ({ dealCount }) => {
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
