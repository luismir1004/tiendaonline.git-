import React, { forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Componente Input Universal
 * Soporta iconos a la izquierda, manejo de errores, estados de éxito/error y referencias.
 */
const Input = forwardRef(({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  icon: Icon,
  className = '',
  ...props
}, ref) => {
  
  // Determinar el color del borde y foco basado en el estado
  const getStatusClasses = () => {
    if (error && touched) return 'border-red-500 focus:border-red-500 focus:ring-red-500 bg-red-50';
    if (!error && touched && value) return 'border-green-500 focus:border-green-500 focus:ring-green-500 bg-green-50';
    return 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 bg-white';
  };

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {label && (
        <label htmlFor={id || name} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Icon size={18} />
          </div>
        )}
        
        <input
          ref={ref}
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`
            block w-full rounded-lg border-2 py-3
            transition-all duration-200 outline-none
            focus:ring-2 focus:ring-offset-1
            sm:text-sm
            ${Icon ? 'pl-10' : 'pl-4'} 
            pr-10
            ${getStatusClasses()}
          `}
          {...props}
        />

        {/* Iconos de estado (derecha) */}
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          {touched && error && <AlertCircle className="text-red-500" size={18} />}
          {touched && !error && value && <CheckCircle2 className="text-green-500" size={18} />}
        </div>
      </div>

      {/* Mensaje de Error Animado */}
      <AnimatePresence>
        {touched && error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-red-600 mt-1 ml-1 font-medium"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;