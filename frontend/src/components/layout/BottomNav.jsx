import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';
import useCartStore from '../../stores/cartStore';
import useWishlistStore from '../../stores/wishlistStore';

const BottomNav = () => {
  const location = useLocation();
  const { cart, openCart } = useCartStore();
  const { wishlist } = useWishlistStore();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio', path: '/' },
    { id: 'search', icon: Search, label: 'Buscar', path: '/productos' },
    { id: 'offers', icon: Zap, label: 'Ofertas', path: '/ofertas' },
    { id: 'cart', icon: ShoppingCart, label: 'Carrito', action: openCart, badge: cartCount },
    { id: 'profile', icon: User, label: 'Perfil', path: '/profile' },
  ];

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: isVisible ? 0 : 100 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 left-6 right-6 z-50 lg:hidden"
    >
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-slate-900/10 border border-white/20">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <div key={item.id} className="relative group">
              {item.action ? (
                <button
                  onClick={item.action}
                  className={`relative flex flex-col items-center gap-1 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-2 w-1 h-1 bg-indigo-600 rounded-full"
                    />
                  )}
                  {item.badge > 0 && (
                     <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600 border border-white"></span>
                     </span>
                  )}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`relative flex flex-col items-center gap-1 transition-colors ${
                    isActive ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute -bottom-2 w-1 h-1 bg-indigo-600 rounded-full"
                    />
                  )}
                  {item.badge > 0 && (
                     <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
                  )}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default BottomNav;
