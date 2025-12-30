import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ShoppingCart } from 'lucide-react';
import useWishlistStore from '../stores/wishlistStore';
import useCartStore from '../stores/cartStore';
import toast from 'react-hot-toast';

const WishlistSidebar = () => {
  const { isWishlistOpen, closeWishlist, wishlist, toggleItem } = useWishlistStore();
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = (item) => {
    addToCart(item);
    // Opcional: eliminar de favoritos al agregar al carrito? 
    // toggleItem(item); 
  };

  const backdropVariants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0 },
  };

  const sidebarVariants = {
    visible: { x: 0 },
    hidden: { x: '100%' },
  };

  return (
    <AnimatePresence>
      {isWishlistOpen && (
        <motion.div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55]"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={closeWishlist}
        >
          <motion.div
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col z-[60]"
            variants={sidebarVariants}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-bold text-slate-900">Mis Favoritos ({wishlist.length})</h2>
              <button 
                onClick={closeWishlist} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </header>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-5 bg-slate-50">
              {wishlist.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                    <Trash2 className="text-slate-400" size={32} />
                  </div>
                  <div>
                    <p className="text-slate-900 font-medium">Tu lista está vacía</p>
                    <p className="text-sm text-slate-500 mt-1">Guarda lo que te guste para después.</p>
                  </div>
                  <button 
                    onClick={closeWishlist}
                    className="mt-4 px-6 py-2 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800"
                  >
                    Explorar Productos
                  </button>
                </div>
              ) : (
                <ul className="space-y-4">
                  {wishlist.map((item) => (
                    <li key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex gap-4">
                      <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm line-clamp-1">{item.name}</h3>
                          <p className="text-slate-500 text-xs mt-1">${item.price}</p>
                        </div>
                        
                        <div className="flex justify-between items-end mt-2">
                           <button 
                             onClick={() => handleAddToCart(item)}
                             className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                           >
                             <ShoppingCart size={14} /> Mover al carrito
                           </button>
                           <button 
                             onClick={() => toggleItem(item)}
                             className="text-slate-400 hover:text-red-500 transition-colors"
                             title="Eliminar"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WishlistSidebar;