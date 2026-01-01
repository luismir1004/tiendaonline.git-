import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, Menu, X, Zap, Search, User, LogOut, 
  ChevronDown, Heart, ArrowRight, Package, Smartphone, 
  Headphones, Cpu 
} from 'lucide-react';
import { 
  motion, AnimatePresence, useScroll, useTransform, 
  useMotionValueEvent, useSpring 
} from 'framer-motion';

// Stores
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import useWishlistStore from '../stores/wishlistStore';
import useCurrencyStore from '../stores/currencyStore';

// Components (Assuming these exist based on context)
import SearchOverlay from './SearchOverlay';
import SupportDrawer from './navbar/SupportDrawer'; // Keeping existing ref
import MarqueeBanner from './navbar/MarqueeBanner'; // Keeping existing ref

// --- CONFIGURATION: MEGA MENU DATA ---
const NAV_ITEMS = [
  {
    id: 'explorar',
    label: 'Explorar',
    type: 'mega',
    columns: [
      {
        title: 'Dispositivos',
        items: [
          { label: 'Smartphones', href: '/?category=Celulares', icon: Smartphone, desc: 'Lo último en tecnología móvil' },
          { label: 'Laptops', href: '/?category=Computación', icon: Cpu, desc: 'Potencia para creadores' },
          { label: 'Audio Premium', href: '/?category=Audio', icon: Headphones, desc: 'Sonido de alta fidelidad' },
        ]
      },
      {
        title: 'Colecciones',
        items: [
          { label: 'Nuevos Arrivos', href: '/?sort=newest', icon: Zap, desc: 'Recién salidos del horno' },
          { label: 'Best Sellers', href: '/?sort=bestsellers', icon: Package, desc: 'Los favoritos de la comunidad' },
        ]
      }
    ],
    promo: {
      title: "Sonic Architecture X1",
      subtitle: "Edición Limitada 2025",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
      href: "/producto/horizon-note-series-edition-13", // Example link
      gradient: "from-slate-900 to-indigo-900"
    }
  },
  {
    id: 'ofertas',
    label: 'Ofertas',
    type: 'link',
    href: '/?filter=offers'
  }
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Hover Intent Refs
  const hoverTimeoutRef = useRef(null);
  
  // Navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Stores
  const { items: cartItems, openCart } = useCartStore();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const { wishlist } = useWishlistStore();
  const { currency, setCurrency, language, setLanguage } = useCurrencyStore();

  // --- SCROLL ANIMATIONS ---
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const headerBlur = useTransform(scrollY, [0, 50], ["0px", "16px"]);
  const borderOpacity = useTransform(scrollY, [0, 50], [0, 0.1]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 20;
    if (scrolled !== isScrolled) setIsScrolled(scrolled);
  });

  // --- HANDLERS ---
  
  // Hover Intent Logic
  const handleMenuEnter = (menuId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveMenu(menuId);
  };

  const handleMenuLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 250); // 250ms persistence
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMenu(null);
  }, [location]);

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} products={[]} />
      <MarqueeBanner />

      <motion.header
        className="fixed top-0 left-0 right-0 z-50 pt-safe-top"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Dynamic Background Layer */}
        <motion.div 
          className="absolute inset-0 bg-white/80"
          style={{ 
            opacity: headerOpacity,
            backdropFilter: `blur(${headerBlur.get()})`, // Note: This might need direct value mapping in some react versions
            borderBottom: `1px solid rgba(0,0,0,${borderOpacity.get()})`
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between h-16 lg:h-20 transition-all duration-300">
            
            {/* --- LOGO --- */}
            <Link to="/" className="flex items-center gap-2 group relative z-50">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white overflow-hidden shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-500">
                <Zap size={20} className="relative z-10 fill-white" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Tech<span className="text-indigo-600">Nova</span>
              </span>
            </Link>

            {/* --- DESKTOP NAVIGATION (Mega Menu) --- */}
            <nav className="hidden lg:flex items-center gap-8" onMouseLeave={handleMenuLeave}>
              {NAV_ITEMS.map((item) => (
                <div key={item.id} className="relative">
                  {item.type === 'mega' ? (
                    <button
                      onMouseEnter={() => handleMenuEnter(item.id)}
                      className={`flex items-center gap-1 text-sm font-medium transition-colors py-2
                        ${activeMenu === item.id ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}
                      `}
                      aria-expanded={activeMenu === item.id}
                    >
                      {item.label}
                      <ChevronDown 
                        size={14} 
                        className={`transition-transform duration-300 ${activeMenu === item.id ? 'rotate-180' : ''}`} 
                      />
                    </button>
                  ) : (
                    <Link 
                      to={item.href}
                      className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors py-2"
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* MEGA MENU DROPDOWN */}
                  <AnimatePresence>
                    {activeMenu === item.id && item.type === 'mega' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[900px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
                        onMouseEnter={() => handleMenuEnter(item.id)}
                      >
                        <div className="grid grid-cols-4 min-h-[320px]">
                          {/* Columns Section */}
                          <div className="col-span-3 p-8 grid grid-cols-2 gap-8 bg-white">
                            {item.columns.map((col, idx) => (
                              <div key={idx}>
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">
                                  {col.title}
                                </h4>
                                <ul className="space-y-4">
                                  {col.items.map((subItem, subIdx) => (
                                    <li key={subIdx}>
                                      <Link 
                                        to={subItem.href}
                                        className="group flex items-start gap-4 p-2 -mx-2 rounded-xl hover:bg-slate-50 transition-colors"
                                      >
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                          <subItem.icon size={20} />
                                        </div>
                                        <div>
                                          <div className="font-semibold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                            {subItem.label}
                                          </div>
                                          <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                            {subItem.desc}
                                          </p>
                                        </div>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {/* Promo Section */}
                          <div className="col-span-1 relative bg-slate-900 p-8 flex flex-col justify-end overflow-hidden group">
                            <img 
                              src={item.promo.image} 
                              alt={item.promo.title}
                              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className={`absolute inset-0 bg-gradient-to-b ${item.promo.gradient} opacity-80`} />
                            
                            <div className="relative z-10">
                              <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-bold text-white mb-3">
                                RECOMENDADO
                              </span>
                              <h3 className="text-xl font-bold text-white leading-tight mb-2">
                                {item.promo.title}
                              </h3>
                              <p className="text-sm text-slate-300 mb-4">
                                {item.promo.subtitle}
                              </p>
                              <Link 
                                to={item.promo.href}
                                className="inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider hover:gap-3 transition-all"
                              >
                                Ver Producto <ArrowRight size={14} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* --- ACTIONS --- */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* Search */}
              <button 
                onClick={() => setSearchOpen(true)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <button 
                onClick={() => navigate('/profile?tab=wishlist')}
                className="hidden sm:block p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all relative"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlist.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Cart Badge */}
              <button
                onClick={openCart}
                className="relative p-2 text-slate-900 hover:text-indigo-600 transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={22} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount} // Trigger animation on change
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 15 }}
                      className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* User / Auth */}
              <div className="hidden sm:block relative">
                {isAuthenticated ? (
                  <div 
                    className="relative"
                    onMouseEnter={() => setUserMenuOpen(true)}
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <button className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-slate-200 border border-slate-100 flex items-center justify-center shadow-inner">
                        <span className="text-sm font-bold text-indigo-800">
                          {currentUser?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </button>
                    
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-1 z-50"
                        >
                          <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100">
                            <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                          </div>
                          <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
                            <User size={16} /> Mi Perfil
                          </Link>
                          <Link to="/profile?tab=orders" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600">
                            <Package size={16} /> Mis Pedidos
                          </Link>
                          <div className="h-px bg-slate-100 my-1" />
                          <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                          >
                            <LogOut size={16} /> Cerrar Sesión
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-95"
                  >
                    Entrar
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button 
                className="lg:hidden p-2 text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* --- MOBILE DRAWER (Spring Animation) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white/90 backdrop-blur-xl shadow-2xl z-[70] lg:hidden flex flex-col border-l border-white/50"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-200/50">
                <span className="text-lg font-bold text-slate-900">Menú</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100 transition-colors"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {NAV_ITEMS.map((item) => (
                  <div key={item.id}>
                    {item.type === 'mega' ? (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{item.label}</h3>
                        <div className="grid gap-3">
                          {item.columns.map((col, colIdx) => (
                             col.items.map((subItem, subIdx) => (
                               <Link 
                                 key={`${colIdx}-${subIdx}`}
                                 to={subItem.href}
                                 className="flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm border border-slate-100 active:scale-95 transition-transform"
                               >
                                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-indigo-600">
                                    <subItem.icon size={20} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900">{subItem.label}</p>
                                    <p className="text-xs text-slate-500">{subItem.desc}</p>
                                  </div>
                               </Link>
                             ))
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link 
                        to={item.href}
                        className="block text-xl font-bold text-slate-900"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {!isAuthenticated && (
                   <Link 
                     to="/login"
                     className="block w-full py-4 bg-slate-900 text-white text-center rounded-2xl font-bold shadow-xl shadow-slate-900/20"
                   >
                     Iniciar Sesión / Registro
                   </Link>
                )}
              </div>
              
              {/* Mobile Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-200/50">
                 <div className="flex gap-3">
                    <button onClick={() => setCurrency('USD')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${currency === 'USD' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>USD</button>
                    <button onClick={() => setCurrency('EUR')} className={`flex-1 py-2 text-xs font-bold rounded-lg border ${currency === 'EUR' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>EUR</button>
                 </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;