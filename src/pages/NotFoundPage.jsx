import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-9xl font-extrabold text-slate-200"
        >
          404
        </motion.h1>
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative -top-12"
        >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Página no encontrada</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida a otra dimensión tecnológica.
            </p>
            <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
            <Home size={18} />
            Volver al Inicio
            </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;