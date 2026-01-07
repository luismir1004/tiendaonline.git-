import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingCart, Menu, X, Zap, Search, User, LogOut,
  ChevronDown, Heart, Package, Smartphone,
  Headphones, Cpu, Settings, ListOrdered, ChevronRight, ArrowRight
} from 'lucide-react';
import {
  motion, AnimatePresence, useScroll, useMotionValueEvent
} from 'framer-motion';

// Stores
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import useWishlistStore from '../stores/wishlistStore';
import useCurrencyStore from '../stores/currencyStore';

// Components
import SearchOverlay from './SearchOverlay';
import MarqueeBanner from './navbar/MarqueeBanner';
import DesktopMegaMenu from './navbar/DesktopMegaMenu';

// --- DATOS DE NAVEGACIÓN ---
const NAV_ITEMS = [
  {
    id: 'explorar',
    label: 'Explorar',
    type: 'mega',
    columns: [
      {
        title: 'Dispositivos',
        items: [
          { label: 'Smartphones', href: '/?category=Celulares', icon: Smartphone, desc: 'Flagships y gama media' },
          { label: 'Laptops', href: '/?category=Computación', icon: Cpu, desc: 'Workstations y Ultrabooks' },
          { label: 'Audio', href: '/?category=Audio', icon: Headphones, desc: 'Sonido Hi-Res' },
        ]
      },
      {
        title: 'Descubrir',
        items: [
          { label: 'Novedades', href: '/?sort=newest', icon: Zap, desc: 'Lanzamientos recientes' },
          { label: 'Más Vendidos', href: '/?sort=bestsellers', icon: Package, desc: 'Favoritos de la comunidad' },
        ]
      }
    ],
    promo: {
      title: "Audio Week",
      subtitle: "30% OFF en Auriculares Pro",
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=600&auto=format&fit=crop",
      href: "/?category=Audio",
      gradient: "from-violet-600 to-indigo-600"
    }
  },
  {
    id: 'ofertas',
    label: 'Ofertas',
    type: 'link',
    href: '/ofertas',
    highlight: true,
    badge: 'LIVE'
  },
  {
    id: 'nosotros',
    label: 'Nosotros',
    type: 'link',
    href: '/about'
  }
];

// --- COMPONENTES AUXILIARES MÓVILES ---
const MobileAccordion = ({ item, closeMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full py-4 text-left transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-900'}`}
      >
        <span className="text-lg font-bold tracking-tight">{item.label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="pb-6 space-y-6">
              {item.columns.map((col, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">
                    {col.title}
                  </h4>
                  <div className="grid gap-2">
                    {col.items.map((subItem, subIdx) => (
                      <Link
                        key={subIdx}
                        to={subItem.href}
                        onClick={closeMenu}
                        className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 active:scale-98 transition-transform"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                          <subItem.icon size={20} />
                        </div>
                        <div>
                          <span className="block text-sm font-bold text-slate-900">{subItem.label}</span>
                          <span className="block text-xs text-slate-500">{subItem.desc}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {item.promo && (
                <Link
                  to={item.promo.href}
                  onClick={closeMenu}
                  className="block relative overflow-hidden rounded-2xl aspect-video group"
                >
                  <img
                    src={item.promo.image}
                    alt={item.promo.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5 text-white">
                    <span className={`inline-block px-2 py-1 mb-2 text-[10px] font-bold uppercase tracking-wider rounded-md bg-gradient-to-r ${item.promo.gradient}`}>
                      Destacado
                    </span>
                    <h4 className="text-lg font-bold leading-tight mb-1">{item.promo.title}</h4>
                    <p className="text-xs text-slate-300 mb-3">{item.promo.subtitle}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-white/90">
                      Ver Ahora <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  // --- ESTADO LOCAL ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  // Refs
  const hoverTimeoutRef = useRef(null);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();

  // --- STORES ---
  const { cart: cartItems, openCart } = useCartStore();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // CORRECCIÓN: Usar 'user' en lugar de 'currentUser'
  const { isAuthenticated, user, logout } = useAuthStore();
  const { wishlist } = useWishlistStore();
  const { currency, setCurrency } = useCurrencyStore();

  // Animación Carrito
  useEffect(() => {
    if (cartCount > 0) {
      setIsCartAnimating(true);
      const timer = setTimeout(() => setIsCartAnimating(false), 400);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Scroll Handler
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 10;
    if (isScrolled !== shouldBeScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  });

  // Handlers
  const handleMenuEnter = (menuId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveMenu(menuId);
  };

  const handleMenuLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMenu(null);
    setUserMenuOpen(false);
  }, [location]);

  return (
    <>
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} products={[]} />
      <MarqueeBanner />

      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`fixed top-0 left-0 right-0 z-50 pt-safe-top transition-all duration-500 ease-out ${isScrolled ? 'py-2' : 'py-6'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Main Container - The "Capsule" */}
          <div className={`
              relative flex items-center justify-between px-4 py-2 sm:px-6 sm:py-3 rounded-full transition-all duration-500
              ${isScrolled
              ? 'bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg shadow-black/5'
              : 'bg-white/50 backdrop-blur-lg border border-white/20'
            }
          `}>

            {/* 1. LOGO */}
            <Link to="/" className="flex items-center gap-2 group relative z-20">
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white overflow-hidden shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-500 group-hover:scale-110">
                <Zap size={20} className="relative z-10 fill-white group-hover:rotate-12 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 hidden xs:block">
                Tech<span className="text-indigo-600">Nova</span>
              </span>
            </Link>

            {/* 2. DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/50 p-1.5 rounded-full border border-white/50 absolute left-1/2 -translate-x-1/2 shadow-inner" onMouseLeave={handleMenuLeave}>
              {NAV_ITEMS.map((item) => {
                const isActive = item.href ? location.pathname === item.href : false;

                return (
                  <div key={item.id} className="relative">
                    {item.type === 'mega' ? (
                      <button
                        onMouseEnter={() => handleMenuEnter(item.id)}
                        className={`
                          relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-1
                          ${activeMenu === item.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}
                        `}
                      >
                        {item.label}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${activeMenu === item.id ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className={`
                          relative px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2
                          ${isActive ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'}
                          ${item.highlight ? 'bg-slate-900 !text-white hover:!bg-slate-800' : ''}
                        `}
                      >
                        {item.label}
                        {item.highlight && item.badge && (
                          <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider">{item.badge}</span>
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Mega Menu Dropdown */}
              <DesktopMegaMenu
                isOpen={!!activeMenu}
                activeMenuId={activeMenu}
                navItems={NAV_ITEMS}
                onClose={() => setActiveMenu(null)}
                handleMenuEnter={handleMenuEnter}
                handleMenuLeave={handleMenuLeave}
              />
            </nav>

            {/* 3. ACCIONES */}
            <div className="flex items-center gap-1.5 sm:gap-2 relative z-20">

              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 sm:p-3 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all active:scale-95"
              >
                <Search size={22} strokeWidth={2} />
              </button>

              {/* Wishlist */}
              <button
                onClick={() => navigate('/profile?tab=wishlist')}
                className="hidden sm:block p-2.5 sm:p-3 text-slate-600 hover:text-red-500 hover:bg-red-50 rounded-full transition-all active:scale-95 relative group"
              >
                <Heart size={22} strokeWidth={2} className="group-hover:fill-red-50 transition-colors" />
                {wishlist.length > 0 && (
                  <span className="absolute top-2.5 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2.5 sm:p-3 text-slate-900 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all active:scale-95 group"
              >
                <motion.div animate={isCartAnimating ? { rotate: [0, 15, -15, 0] } : {}}>
                  <ShoppingCart size={22} strokeWidth={2} className="group-hover:fill-indigo-100 transition-colors" />
                </motion.div>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-1 right-1 bg-indigo-600 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Separator */}
              <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

              {/* User Profile */}
              <div className="hidden sm:block relative">
                {isAuthenticated && user ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setUserMenuOpen(true)}
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <button className="flex items-center gap-2 pl-1 rounded-full p-1 pr-3 hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-indigo-200">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <span className="text-xs font-bold text-slate-700 max-w-[80px] truncate">
                        {user.name?.split(' ')[0]}
                      </span>
                      <ChevronDown size={14} className="text-slate-400" />
                    </button>

                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-64 pt-2"
                        >
                          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden ring-1 ring-black/5">
                            <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100">
                              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                              <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            </div>
                            <div className="p-2 space-y-1">
                              <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors">
                                <User size={18} /> Mi Perfil
                              </Link>
                              <Link to="/profile?tab=orders" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors">
                                <ListOrdered size={18} /> Mis Pedidos
                              </Link>
                              <Link to="/profile?tab=settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-600 rounded-xl transition-colors">
                                <Settings size={18} /> Configuración
                              </Link>
                            </div>
                            <div className="p-2 border-t border-slate-100">
                              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                <LogOut size={18} /> Cerrar Sesión
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link to="/login" className="ml-2 px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                    <User size={18} />
                    <span>Entrar</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2.5 text-slate-900 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors active:scale-95"
              >
                <Menu size={24} />
              </button>

            </div>

          </div>
        </div>
      </motion.header>

      {/* --- MOBILE DRAWER --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl z-[70] lg:hidden flex flex-col rounded-l-3xl overflow-hidden"
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <span className="text-xl font-bold text-slate-900">Menú</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {/* User Mobile Info */}
                {isAuthenticated && user && (
                  <div className="mb-6 p-4 bg-indigo-50 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  {NAV_ITEMS.map((item) => (
                    <div key={item.id}>
                      {item.type === 'mega' ? (
                        <MobileAccordion item={item} closeMenu={() => setMobileMenuOpen(false)} />
                      ) : (
                        <Link
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`block py-4 text-lg font-bold border-b border-slate-100 ${location.pathname === item.href ? 'text-indigo-600' : 'text-slate-900'}`}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50">
                {!isAuthenticated ? (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex justify-center items-center gap-2 mb-3">
                    <User size={18} /> Iniciar Sesión
                  </Link>
                ) : (
                  <button onClick={handleLogout} className="w-full py-3 bg-white border border-red-100 text-red-600 rounded-xl font-bold flex justify-center items-center gap-2 mb-3">
                    <LogOut size={18} /> Cerrar Sesión
                  </button>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setCurrency('USD')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${currency === 'USD' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>USD</button>
                  <button onClick={() => setCurrency('EUR')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${currency === 'EUR' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}>EUR</button>
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