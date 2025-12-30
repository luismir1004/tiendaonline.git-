import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import useCartStore from '../stores/cartStore';
import { useNavigate } from 'react-router-dom';

const SlideOverCart = () => {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const cartItems = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const cartTotal = useCartStore((state) => state.getCartTotal());
  
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const cartVariants = {
    visible: { x: 0 },
    hidden: { x: '100%' },
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeCart}
          />
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl flex flex-col z-[70] border-l border-gray-100"
            variants={cartVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-900">Carrito de Compras</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                  {cartItems.length}
                </span>
              </div>
              <button 
                onClick={closeCart} 
                className="p-2 -mr-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400 hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </header>

            {/* Cart Items List */}
            <div className="flex-grow overflow-y-auto px-6 py-4 bg-white scrollbar-hide">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag className="text-gray-300" size={32} />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-900">Tu carrito está vacío</p>
                    <p className="text-gray-500 text-sm max-w-[200px] mx-auto">
                      Agrega productos increíbles a tu carrito para verlos aquí.
                    </p>
                  </div>
                  <button 
                    onClick={closeCart}
                    className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all shadow-sm hover:shadow-md"
                  >
                    Seguir Comprando
                  </button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.li 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id} 
                      className="group flex gap-4"
                    >
                      <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      
                      <div className="flex-grow flex flex-col justify-between py-0.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-snug">
                              {item.name}
                            </h3>
                            <p className="text-gray-500 text-xs mt-1">{item.category}</p>
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="text-gray-300 hover:text-red-500 transition-colors p-1 -mr-1"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                            <button 
                              onClick={() => decreaseQuantity(item.id)} 
                              className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-500 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="text-xs font-semibold text-gray-900 w-3 text-center">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => increaseQuantity(item.id)} 
                              className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-500 hover:text-gray-900 transition-all"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <p className="font-semibold text-gray-900 text-sm">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 safe-bottom pb-8">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-sm">
                    <span>Envío estimado</span>
                    <span className="text-green-600 font-medium">Gratis</span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900 text-xl tracking-tight">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-black transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group"
                >
                  Ir a Pagar <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SlideOverCart;