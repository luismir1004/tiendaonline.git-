import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center space-x-2 text-sm text-slate-500">
        <li>
          <Link 
            to="/" 
            className="flex items-center hover:text-indigo-600 transition-colors"
            aria-label="Ir al inicio"
          >
            <Home size={16} />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight size={16} className="mx-1 text-slate-300" />
            {item.href ? (
              <Link 
                to={item.href} 
                className="hover:text-indigo-600 transition-colors font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-slate-900 font-semibold" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;