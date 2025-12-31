import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Zap, User, LogOut, Search, Heart, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import useWishlistStore from '../stores/wishlistStore';
import SearchOverlay from './SearchOverlay';
import { useProducts } from '../hooks/useProducts';

// Enterprise Components
import DesktopMegaMenu from './navbar/DesktopMegaMenu';
import MobileMegaMenu from './navbar/MobileMegaMenu';
import DealsLink from './navbar/DealsLink';
import SupportDrawer from './navbar/SupportDrawer';

// Configuration Data
import { MENU_CONFIG } from '../data/menuConfig';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  
  // Enterprise Menu Logic (Debounced Hover)
  const [activeMenu, setActiveMenu] = useState(null); // 'explorar' | 'colecciones' | null
  const hoverTimeoutRef = useRef(null);

  const navigate = useNavigate();
  
  // Stores
  const openCart = useCartStore((state) => state.openCart);
  const cartItemCount = useCartStore((state) => state.getCartCount());
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const wishlistCount = useWishlistStore((state) => state.wishlist.length);
  const openWishlist = useWishlistStore((state) => state.openWishlist);
  
  // Fetch products for search overlay
  const { products } = useProducts();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  // Intent-based Hover Handlers
  const handleMouseEnter = (menuKey) => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
    }
    setActiveMenu(menuKey);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
        setActiveMenu(null);
    }, 150); // 150ms grace period for smooth mouse movement
  };

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} products={products} />
      <SupportDrawer isOpen={supportDrawerOpen} onClose={() => setSupportDrawerOpen(false)} />
      
      <header  
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          isScrolled || activeMenu
            ? 'bg-white/90 backdrop-blur-xl border-slate-200/50 py-3 shadow-sm' 
            : 'bg-white/50 backdrop-blur-md border-transparent py-5'
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
          <div className="flex items-center justify-between h-10">
            
            {/* --- Logo --- */}
            <Link to="/" className="flex items-center gap-2 group z-50">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white overflow-hidden group-hover:shadow-lg transition-all duration-300">
                <Zap size={18} className="relative z-10 fill-white" />
                <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                TechNova
              </span>
            </Link>

            {/* --- Desktop Navigation (Enterprise) --- */}
            <div className="hidden md:flex items-center space-x-8">
              
              {/* Explorar Trigger */}
              <div 
                className="relative h-10 flex items-center"
                onMouseEnter={() => handleMouseEnter('explorar')}
              >
                  <button 
                    className={`text-sm font-medium transition-colors flex items-center gap-1 ${activeMenu === 'explorar' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                    aria-expanded={activeMenu === 'explorar'}
                  >
                    Explorar <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === 'explorar' ? 'rotate-180' : ''}`} />
                  </button>
                  {/* Invisible bridge */}
                  {activeMenu === 'explorar' && <div className="absolute top-full left-0 w-full h-8 bg-transparent" />}
              </div>

              {/* Colecciones Trigger */}
              <div 
                className="relative h-10 flex items-center"
                onMouseEnter={() => handleMouseEnter('colecciones')}
              >
                  <button 
                    className={`text-sm font-medium transition-colors flex items-center gap-1 ${activeMenu === 'colecciones' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                    aria-expanded={activeMenu === 'colecciones'}
                  >
                    Colecciones <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === 'colecciones' ? 'rotate-180' : ''}`} />
                  </button>
                  {/* Invisible bridge */}
                  {activeMenu === 'colecciones' && <div className="absolute top-full left-0 w-full h-8 bg-transparent" />}
              </div>

              {/* Ofertas */}
              <DealsLink dealCount={3} />

              {/* Soporte */}
              <button 
                onClick={() => setSupportDrawerOpen(true)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Soporte
              </button>
            </div>

            {/* --- Actions --- */}
            <div className="flex items-center gap-2 sm:gap-4 z-50">
              
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Buscar"
              >
                <Search size={20} />
              </button>

              <button 
                onClick={openWishlist}
                className="relative p-2 text-slate-500 hover:text-red-500 transition-colors hidden sm:block"
                aria-label="Favoritos"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

              <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1"></div>

              {/* User Menu */}
              <div className="relative hidden md:block">
                {isAuthenticated ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setUserMenuOpen(true)}
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <button className="flex items-center gap-2 py-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-slate-200 flex items-center justify-center border border-white shadow-sm">
                        <span className="text-xs font-bold text-indigo-700">
                          {currentUser?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 pt-2 w-56 origin-top-right z-[60]"
                        >
                          <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black ring-opacity-5">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cuenta</p>
                              <p className="text-sm font-bold text-slate-900 truncate mt-1">{currentUser?.name}</p>
                            </div>
                            <div className="py-1">
                              <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Mis Pedidos</Link>
                              <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">Configuración</Link>
                            </div>
                            <div className="py-1 border-t border-slate-100">
                              <button 
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                              >
                                <LogOut size={14} /> Cerrar Sesión
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg"
                  >
                    Entrar
                  </Link>
                )}
              </div>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2 text-slate-800 hover:text-indigo-600 transition-colors group"
              >
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={cartItemCount}
                    className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden ml-2">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Menu size={24} />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* --- DESKTOP MEGA MENU PANEL --- */}
        <DesktopMegaMenu 
            activeMenu={activeMenu} 
            config={MENU_CONFIG}
            onClose={() => setActiveMenu(null)}
        />

        {/* --- MOBILE MENU OVERLAY --- */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 md:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl z-50 md:hidden flex flex-col"
              >
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-lg font-bold flex items-center gap-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                        <Zap className="text-white" size={18} fill="currentColor" /> 
                    </div>
                    TechNova
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                  >
                    <X size={20} className="text-slate-600" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto pt-4">
                  
                  {/* MOBILE ACCORDION MENU */}
                  <MobileMegaMenu 
                    config={MENU_CONFIG}
                    onClose={() => setMobileMenuOpen(false)}
                  />

                  <div className="px-4 py-2 border-t border-slate-100 mt-4">
                     <Link to="/?filter=offers" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 px-3 py-3 text-lg font-medium text-slate-600 hover:bg-slate-50 rounded-xl">
                        Ofertas
                     </Link>
                     <button 
                        onClick={() => { setMobileMenuOpen(false); setSupportDrawerOpen(true); }}
                        className="w-full text-left px-3 py-3 text-lg font-medium text-slate-600 hover:bg-slate-50 rounded-xl"
                    >
                        Ayuda y Soporte
                    </button>
                  </div>

                </div>
                
                {/* Mobile Footer/User Area */}
                <div className="p-6 bg-slate-50 border-t border-slate-100">
                    {isAuthenticated ? (
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-indigo-600 font-bold">
                                {currentUser?.name?.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-bold text-sm">{currentUser?.name}</span>
                            </div>
                            <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-xs text-red-500 font-bold">Salir</button>
                         </div>
                    ) : (
                        <Link 
                            to="/login"
                            onClick={() => setMobileMenuOpen(false)} 
                            className="block w-full py-3 bg-slate-900 text-white text-center rounded-xl font-bold text-sm"
                        >
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
