import React, { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Zap, User, LogOut, Search, Heart, ChevronDown, Globe, CreditCard } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// Stores
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import useWishlistStore from '../stores/wishlistStore';
import useCurrencyStore from '../stores/currencyStore';

// Components
import SearchOverlay from './SearchOverlay';
import DesktopMegaMenu from './navbar/DesktopMegaMenu';
import MobileMegaMenu from './navbar/MobileMegaMenu';
import DealsLink from './navbar/DealsLink';
import SupportDrawer from './navbar/SupportDrawer';
import MarqueeBanner from './navbar/MarqueeBanner';

// Services
import { getProducts } from '../services/productService';
import { MENU_CONFIG } from '../data/menuConfig';

const FREE_SHIPPING_THRESHOLD = 150; // USD

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [supportDrawerOpen, setSupportDrawerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  
  // Enterprise Menu Logic
  const [activeMenu, setActiveMenu] = useState(null);
  const hoverTimeoutRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();
  
  // Stores
  const openCart = useCartStore((state) => state.openCart);
  const cartItemCount = useCartStore((state) => state.getCartCount());
  const cartTotal = useCartStore((state) => state.getCartTotal());
  
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const wishlistCount = useWishlistStore((state) => state.wishlist.length);
  const openWishlist = useWishlistStore((state) => state.openWishlist);
  
  const { currency, language, setCurrency, setLanguage } = useCurrencyStore();

  // Scroll Animation
  const { scrollY } = useScroll();
  const headerBlur = useTransform(scrollY, [0, 100], ["backdrop-blur-md", "backdrop-blur-xl"]);
  const headerBg = useTransform(scrollY, [0, 100], ["rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.9)"]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- PREDICTIVE NAV LOGIC ---
  const prefetchCategory = useCallback(async (category) => {
    // Simple caching mechanism or trigger browser cache
    // In a real generic implementation, we might check a Map ref to see if already fetched
    try {
        if (category === 'explorar') {
            await getProducts({ limit: 4, sort: '-createdAt' });
        } else if (category === 'colecciones') {
             // Fetch specific collection data if needed
             // await getProducts({ where: { category: { equals: 'Tech' } }, limit: 4 });
        }
    } catch (e) {
        // Silent fail for prefetch
    }
  }, []);

  const handleMouseEnter = useCallback((menuKey) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveMenu(menuKey);
    prefetchCategory(menuKey); // Trigger AI-Enhanced Pre-fetch
  }, [prefetchCategory]);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
        setActiveMenu(null);
    }, 150);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const handleLogoClick = (e) => {
      e.preventDefault();
      startTransition(() => {
          navigate('/');
      });
  };

  // Focus Trap for Mobile Menu
  useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll('a[href], button, textarea, input, select');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTab = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            } else if (e.key === 'Escape') {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('keydown', handleTab);
        firstElement?.focus();
        return () => window.removeEventListener('keydown', handleTab);
    }
  }, [mobileMenuOpen]);

  // Shipping Progress Calculation
  const shippingProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} products={[]} />
      <SupportDrawer isOpen={supportDrawerOpen} onClose={() => setSupportDrawerOpen(false)} />
      
      <MarqueeBanner />

      <motion.header
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur }} // Dynamic Blur
        layout // Layout Projection for smooth height changes
        className={`fixed top-0 left-0 right-0 z-50 transition-colors border-b duration-300 ${
          isScrolled || activeMenu ? 'border-slate-200/50 shadow-sm' : 'border-transparent top-9' // Adjust top for banner
        }`}
        onMouseLeave={handleMouseLeave}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-50">
          <div className="flex items-center justify-between h-14">
            
            {/* --- Logo (Smart Redirect) --- */}
            <a href="/" onClick={handleLogoClick} className="flex items-center gap-2 group z-50">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white overflow-hidden group-hover:shadow-lg transition-all duration-300">
                <Zap size={18} className="relative z-10 fill-white" />
                <div className="absolute inset-0 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-slate-700 transition-colors">
                TechNova
              </span>
            </a>

            {/* --- Desktop Navigation --- */}
            <div className="hidden md:flex items-center space-x-8">
              {['explorar', 'colecciones'].map((key) => (
                  <div 
                    key={key}
                    className="relative h-14 flex items-center"
                    onMouseEnter={() => handleMouseEnter(key)}
                  >
                      <button 
                        className={`text-sm font-medium transition-colors flex items-center gap-1 capitalize ${activeMenu === key ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                        aria-expanded={activeMenu === key}
                      >
                        {key} 
                        <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === key ? 'rotate-180' : ''}`} />
                        
                        {/* Active Link Tracking (Shared Element) */}
                        {activeMenu === key && (
                             <motion.div 
                                layoutId="activeNavUnderline"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                             />
                        )}
                      </button>
                      {activeMenu === key && <div className="absolute top-full left-0 w-full h-4 bg-transparent" />}
                  </div>
              ))}

              <DealsLink />

              <button 
                onClick={() => setSupportDrawerOpen(true)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Soporte
              </button>
            </div>

            {/* --- Actions --- */}
            <div className="flex items-center gap-1 sm:gap-2 z-50">
              
              {/* Language / Currency Selector */}
              <div className="relative hidden lg:block">
                  <button 
                    onClick={() => setLangMenuOpen(!langMenuOpen)}
                    className="p-2 text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 text-xs font-semibold"
                  >
                     {currency} / {language} <ChevronDown size={12} />
                  </button>
                  <AnimatePresence>
                      {langMenuOpen && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute top-full right-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 overflow-hidden"
                            onMouseLeave={() => setLangMenuOpen(false)}
                          >
                                <button onClick={() => { setCurrency('USD'); setLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${currency === 'USD' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}>USD ($)</button>
                                <button onClick={() => { setCurrency('EUR'); setLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${currency === 'EUR' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}>EUR (€)</button>
                                <div className="h-px bg-slate-100 my-1"></div>
                                <button onClick={() => { setLanguage('EN'); setLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${language === 'EN' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}>English</button>
                                <button onClick={() => { setLanguage('ES'); setLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-50 ${language === 'ES' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}>Español</button>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>

              <div className="h-4 w-px bg-slate-200 hidden lg:block mx-1"></div>

              <button 
                onClick={() => setSearchOpen(true)}
                className="p-3 text-slate-500 hover:text-slate-900 transition-colors"
                aria-label="Buscar"
              >
                <Search size={22} />
              </button>

              <button 
                onClick={openWishlist}
                className="relative p-3 text-slate-500 hover:text-red-500 transition-colors hidden sm:block"
                aria-label="Favoritos"
              >
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
                )}
              </button>

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

              {/* Cart Button with Shipping Progress */}
              <button
                onClick={openCart}
                className="relative p-3 text-slate-800 hover:text-indigo-600 transition-colors group"
              >
                {/* Circular Progress for Free Shipping */}
                <svg className="absolute inset-0 -rotate-90 w-full h-full p-1 pointer-events-none" viewBox="0 0 36 36">
                    <path
                        className="text-slate-100"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                    <path
                        className={`${shippingProgress >= 100 ? 'text-green-500' : 'text-indigo-600'} transition-all duration-500 ease-out`}
                        strokeDasharray={`${shippingProgress}, 100`}
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    />
                </svg>

                <div className="relative z-10 p-0.5">
                    <ShoppingCart size={22} />
                </div>
                
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={cartItemCount}
                    className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white z-20"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile Menu Toggle */}
              <div className="md:hidden ml-1">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-3 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
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

        {/* --- MOBILE MENU OVERLAY (Focus Trap) --- */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/20 backdrop-blur-xl z-50 md:hidden"
              />
              <motion.div
                ref={mobileMenuRef}
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white/80 backdrop-blur-3xl shadow-2xl z-50 md:hidden flex flex-col border-l border-white/50"
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
                    <div className="flex gap-2 mb-4">
                        <button className="flex-1 py-2 text-xs border border-slate-200 bg-white rounded-md font-medium text-slate-600">USD ($)</button>
                        <button className="flex-1 py-2 text-xs border border-slate-200 bg-white rounded-md font-medium text-slate-600">English</button>
                    </div>

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
      </motion.header>
    </>
  );
};

export default React.memo(Navbar);