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
    type: 'link', // Cambiado a Link para SPA
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
        className={`flex items-center justify-between w-full py-4 text-left transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-900'
          }`}
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
              {/* Columns */}
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

              {/* Promo Card Mobile */}
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

  // Refs para "Hover Intent"
  const hoverTimeoutRef = useRef(null);

  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();

  // --- STORES ---
  const { cart: cartItems, openCart } = useCartStore();
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const { wishlist } = useWishlistStore();
  const { currency, setCurrency } = useCurrencyStore();

  // Animación del Carrito
  useEffect(() => {
    if (cartCount > 0) {
      setIsCartAnimating(true);
      const timer = setTimeout(() => setIsCartAnimating(false), 400); // Coincide con duration
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // --- SCROLL OPTIMIZADO ---
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 10;
    if (isScrolled !== shouldBeScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  });

  // --- HANDLERS ---
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

  const openSearchFromMobile = () => {
    setMobileMenuOpen(false);
    setSearchOpen(true);
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
        className={`fixed top-0 left-0 right-0 z-50 pt-safe-top transition-all duration-300 ease-out ${isScrolled ? 'py-2' : 'py-5'
          }`}
      >
        {/* Fondo Glassmorphism */}
        <div
          className={`absolute inset-0 transition-all duration-500 rounded-b-[2.5rem] mx-2 shadow-sm border-b border-white/10 ${isScrolled
            ? 'bg-white/85 backdrop-blur-xl'
            : 'bg-white/60 backdrop-blur-md'
            }`}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between">

            {/* 1. LOGO */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white overflow-hidden shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-500">
                <Zap size={20} className="relative z-10 fill-white" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Tech<span className="text-indigo-600">Nova</span>
              </span>
            </Link>

            {/* 2. DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-8" onMouseLeave={handleMenuLeave}>
              {NAV_ITEMS.map((item) => {
                const isActive = item.href && item.href.includes('?')
                  ? location.pathname === item.href.split('?')[0] && location.search.includes(item.href.split('?')[1])
                  : location.pathname === item.href;

                return (
                  <div key={item.id} className="relative">
                    {item.type === 'mega' ? (
                      <button
                        onMouseEnter={() => handleMenuEnter(item.id)}
                        className={`flex items-center gap-1 text-sm font-bold transition-colors py-3
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
                    ) : item.id === 'ofertas' ? (
                      <Link
                        to={item.href}
                        className="relative group flex items-center gap-2 px-5 py-2 rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
                      >
                        {/* Animated Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-xy" />

                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />

                        <span className="relative z-20 text-white text-sm font-bold tracking-wide">
                          {item.label}
                        </span>

                        {/* Badge */}
                        <span className="relative z-20 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400 border border-white"></span>
                        </span>
                      </Link>
                    ) : (
                      <Link
                        to={item.href}
                        className={`relative group flex items-center gap-1.5 text-sm font-bold transition-all py-3 ${item.highlight
                          ? 'bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent hover:from-orange-600 hover:to-red-700'
                          : isActive ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'
                          }`}
                      >
                        {item.label}

                        {/* Highlight Badge */}
                        {item.highlight && item.badge && !isActive && (
                          <span className="relative flex h-5 w-8">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-5 w-8 bg-gradient-to-r from-red-500 to-orange-500 items-center justify-center text-[9px] text-white font-black tracking-tighter">
                              {item.badge}
                            </span>
                          </span>
                        )}

                        {/* Hover Effect: Center Underline (Adapted color for highlight) */}
                        <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-full group-hover:left-0 ease-out rounded-full opacity-0 group-hover:opacity-100 ${item.highlight ? 'bg-red-500' : 'bg-indigo-600'
                          }`} />

                        {/* Active Indicator (Persistent) */}
                        {isActive && !item.highlight && (
                          <motion.div
                            layoutId="activeNav"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                          />
                        )}
                        {/* Active Indicator for Highlighted (Different color) */}
                        {isActive && item.highlight && (
                          <motion.div
                            layoutId="activeNavHighlight"
                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-500 rounded-full"
                          />
                        )}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Mega Menu Componente Externo */}
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
            <div className="flex items-center gap-2 sm:gap-3">

              <button
                onClick={() => setSearchOpen(true)}
                className="p-3 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-all"
                aria-label="Buscar"
              >
                <Search size={22} />
              </button>

              <button
                onClick={() => navigate('/profile?tab=wishlist')}
                className="hidden sm:block p-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all relative"
                aria-label="Favoritos"
              >
                <Heart size={22} />
                {wishlist.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Carrito con Pop Animation */}
              <button
                onClick={openCart}
                className="relative p-3 text-slate-900 hover:text-indigo-600 transition-colors"
                aria-label="Carrito"
              >
                <motion.div
                  animate={isCartAnimating ? { scale: [1, 1.2, 1], rotate: [0, 15, -15, 0] } : {}}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <ShoppingCart size={24} />
                </motion.div>
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }} // Efecto Pop más pronunciado
                      onAnimationComplete={() => {
                        // Reset scale visual hack if needed, but framer handles key change well
                      }}
                      className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Perfil de Usuario */}
              <div className="hidden sm:block relative">
                {isAuthenticated ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setUserMenuOpen(true)}
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <button className="flex items-center gap-2 pl-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-700 font-bold text-sm">
                        {currentUser?.name?.charAt(0).toUpperCase()}
                      </div>
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-64 pt-2"
                        >
                          <div className="bg-white rounded-[1.5rem] shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5">
                            <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                              <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.name}</p>
                              <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                            </div>
                            <div className="p-2 space-y-1">
                              <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                <User size={18} className="text-indigo-500" /> Mi Perfil
                              </Link>
                              <Link to="/profile?tab=orders" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                <ListOrdered size={18} className="text-blue-500" /> Mis Pedidos
                              </Link>
                              <Link to="/profile?tab=settings" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                <Settings size={18} className="text-slate-500" /> Configuración
                              </Link>
                            </div>
                            <div className="p-2 border-t border-slate-100">
                              <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              >
                                <LogOut size={18} /> Cerrar Sesión
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
                    className="ml-2 px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
                  >
                    Entrar
                  </Link>
                )}
              </div>

              {/* Botón Menú Móvil */}
              <button
                className="lg:hidden p-3 text-slate-900 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* --- 4. MOBILE DRAWER (REFACTORIZADO) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-[60] lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="x"
              dragConstraints={{ left: 0 }}
              dragElastic={0.1}
              onDragEnd={(e, { offset, velocity }) => {
                if (offset.x > 100 || velocity.x > 500) {
                  setMobileMenuOpen(false);
                }
              }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl z-[70] lg:hidden flex flex-col rounded-l-[2.5rem] overflow-hidden border-l border-white/20 touch-pan-y"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100/50">
                <span className="text-xl font-bold text-slate-900">Menú</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              {/* Contenido Scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">

                {/* Search Integration */}
                <div className="mb-6">
                  <button
                    onClick={openSearchFromMobile}
                    className="w-full flex items-center gap-3 p-4 bg-slate-100/80 rounded-2xl text-slate-500 hover:bg-slate-100 transition-colors group"
                  >
                    <Search size={20} className="group-hover:text-indigo-600 transition-colors" />
                    <span className="font-medium text-sm">Buscar productos...</span>
                  </button>
                </div>

                {/* Nav Links */}
                <div className="space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <div key={item.id}>
                      {item.type === 'mega' ? (
                        <MobileAccordion item={item} closeMenu={() => setMobileMenuOpen(false)} />
                      ) : item.id === 'ofertas' ? (
                        <Link
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block my-2"
                        >
                          <div className="relative overflow-hidden rounded-2xl p-4 flex items-center justify-between group">
                            {/* Animated Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-xy" />

                            <div className="relative z-10 flex items-center gap-3 text-white">
                              <span className="text-lg font-bold tracking-wide">Ofertas</span>
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400 border border-white"></span>
                              </span>
                            </div>
                            <span className="relative z-10 bg-white/20 p-2 rounded-full backdrop-blur-sm group-active:scale-90 transition-transform">
                              <ArrowRight size={18} className="text-white" />
                            </span>
                          </div>
                        </Link>
                      ) : (
                        <Link
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center justify-between py-4 border-b border-slate-100 last:border-0 ${location.pathname === item.href ? 'text-indigo-600' : 'text-slate-900'
                            }`}
                        >
                          <span className="text-lg font-bold tracking-tight">{item.label}</span>
                          <ChevronRight size={20} className="text-slate-300" />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="bg-slate-50 border-t border-slate-100">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 divide-x divide-slate-200 border-b border-slate-100">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) navigate('/login');
                      else navigate('/profile');
                      setMobileMenuOpen(false);
                    }}
                    className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
                  >
                    <User size={20} className={isAuthenticated ? "text-indigo-600" : "text-slate-600"} />
                    <span className="text-xs font-bold text-slate-600">{isAuthenticated ? 'Mi Perfil' : 'Entrar'}</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate('/profile?tab=wishlist');
                      setMobileMenuOpen(false);
                    }}
                    className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-100 transition-colors relative"
                  >
                    <div className="relative">
                      <Heart size={20} className="text-slate-600" />
                      {wishlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-slate-50" />
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-600">Favoritos</span>
                  </button>
                </div>

                {/* Currency Toggle */}
                <div className="p-6">
                  <div className="bg-slate-200/50 p-1 rounded-2xl flex relative">
                    <motion.div
                      className="absolute top-1 bottom-1 bg-white rounded-xl shadow-sm z-0"
                      layoutId="currencyToggleMobile"
                      initial={false}
                      animate={{
                        left: currency === 'USD' ? 4 : '50%',
                        width: 'calc(50% - 4px)'
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />

                    <button
                      onClick={() => setCurrency('USD')}
                      className={`relative z-10 flex-1 py-3 text-xs font-bold text-center transition-colors ${currency === 'USD' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      USD ($)
                    </button>
                    <button
                      onClick={() => setCurrency('EUR')}
                      className={`relative z-10 flex-1 py-3 text-xs font-bold text-center transition-colors ${currency === 'EUR' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                      EUR (€)
                    </button>
                  </div>
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