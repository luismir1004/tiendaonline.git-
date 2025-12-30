import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import useCurrency from '../hooks/useCurrency';

const FloatingBuyBar = ({
  product,
  selectedVariant,
  quantity,
  onAddToCart,
  isVisible,
  isAddingToCart,
}) => {
  const { convertPrice, getCurrencySymbol } = useCurrency();

  if (!product || !selectedVariant) return null;

  const currentPrice = product.price + selectedVariant.priceModifier;
  const totalPrice = currentPrice * quantity;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4 border-t border-slate-100 z-40 md:hidden"
        >
          <div className="max-w-md mx-auto flex items-center justify-between gap-4">
            <div className="flex-shrink-0">
              <p className="text-sm text-slate-500 truncate">{product.name}</p>
              <p className="text-xl font-bold text-slate-900">
                {getCurrencySymbol()} {convertPrice(totalPrice).toFixed(2)}
              </p>
            </div>
            <motion.button
              onClick={onAddToCart}
              disabled={isAddingToCart}
              initial={{ scale: 1 }}
              animate={isAddingToCart ? { scale: [1, 1.05, 1], backgroundColor: ["#1e293b", "#22c55e", "#1e293b"] } : { scale: 1, backgroundColor: "#1e293b" }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex items-center justify-center bg-slate-900 text-white py-3 px-4 rounded-full font-semibold hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 shadow-lg active:scale-[0.98]"
            >
              <ShoppingCart className="mr-2" size={20} />
              {isAddingToCart ? 'Añadiendo...' : 'Añadir al Carrito'}
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingBuyBar;