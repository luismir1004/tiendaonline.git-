import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, Menu, X, Zap, Search, User, LogOut, 
  ChevronDown, Heart, ArrowRight, Package, Smartphone, 
  Headphones, Cpu 
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

// --- DATOS DE NAVEGACIÓN (Configurable) ---
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
    // Tarjeta Promocional Integrada
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
    href: '/?filter=offers'
  },
  {
    id: 'nosotros',
    label: 'Nosotros',
    type: 'link',
    href: '/about'
  }
];

const Navbar = () => {
  // --- ESTADO LOCAL ---
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  
  // Refs para "Hover Intent" (Debounce)
  const hoverTimeoutRef = useRef(null);
  
  // Hooks
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();

  // --- CONEXIÓN CON ZUSTAND ---
  const { cart: cartItems, openCart } = useCartStore();
  // Calculamos la cantidad total para el badge
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  const { isAuthenticated, currentUser, logout } = useAuthStore();
  const { wishlist } = useWishlistStore();
  const { currency, setCurrency } = useCurrencyStore();

  // --- LÓGICA DE SCROLL COMPACTO ---
  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldBeScrolled = latest > 10;
    if (isScrolled !== shouldBeScrolled) {
      setIsScrolled(shouldBeScrolled);
    }
  });

  // --- LÓGICA DE INTERACCIÓN (Hover Intent) ---
  const handleMenuEnter = (menuId) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveMenu(menuId);
  };

  const handleMenuLeave = () => {
    // Retraso de 200ms para evitar cierres accidentales
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  // Cerrar menús al cambiar de ruta
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
        className={`fixed top-0 left-0 right-0 z-50 pt-safe-top transition-all duration-300 ease-out ${
            isScrolled ? 'py-2' : 'py-5'
        }`}
      >
        {/* Fondo Glassmorphism Dinámico */}
        <div 
          className={`absolute inset-0 transition-all duration-500 rounded-b-[2.5rem] mx-2 shadow-sm border-b border-white/10 ${
            isScrolled 
                ? 'bg-white/85 backdrop-blur-xl' 
                : 'bg-white/60 backdrop-blur-md' // Un poco de blur siempre para legibilidad
          }`}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between">
            
            {/* --- 1. LOGO --- */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white overflow-hidden shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-500">
                <Zap size={20} className="relative z-10 fill-white" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Tech<span className="text-indigo-600">Nova</span>
              </span>
            </Link>

            {/* --- 2. DESKTOP MEGA MENU --- */}
            <nav className="hidden lg:flex items-center gap-8" onMouseLeave={handleMenuLeave}>
              {NAV_ITEMS.map((item) => (
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
                  ) : (
                    <Link 
                      to={item.href}
                      className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors py-3"
                    >
                      {item.label}
                    </Link>
                  )}

                  {/* PANEL DESPLEGABLE */}
                  <AnimatePresence>
                    {activeMenu === item.id && item.type === 'mega' && (
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[900px]"
                        onMouseEnter={() => handleMenuEnter(item.id)}
                      >
                        <div className="bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden ring-1 ring-black/5">
                            <div className="grid grid-cols-4 min-h-[320px]">
                            {/* Columnas de Navegación */}
                            <div className="col-span-3 p-8 grid grid-cols-2 gap-8">
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
                                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                            <subItem.icon size={20} />
                                            </div>
                                            <div>
                                            <div className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
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

                            {/* Columna Promocional (Visual) */}
                            <div className="col-span-1 relative bg-slate-900 flex flex-col justify-end overflow-hidden group">
                                <img 
                                src={item.promo.image} 
                                alt={item.promo.title}
                                className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-b ${item.promo.gradient} opacity-80`} />
                                
                                <div className="relative z-10 p-8">
                                <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white mb-3 border border-white/10">
                                    DESTACADO
                                </span>
                                <h3 className="text-xl font-bold text-white leading-tight mb-2">
                                    {item.promo.title}
                                </h3>
                                <p className="text-xs text-slate-300 mb-4 line-clamp-2">
                                    {item.promo.subtitle}
                                </p>
                                <Link 
                                    to={item.promo.href}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider hover:gap-3 transition-all"
                                >
                                    Ver Ofertas <ArrowRight size={14} />
                                </Link>
                                </div>
                            </div>
                            </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            {/* --- 3. ACCIONES (Derecha) --- */}
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

              {/* Icono del Carrito (Animado) */}
              <button
                onClick={openCart}
                className="relative p-3 text-slate-900 hover:text-indigo-600 transition-colors"
                aria-label="Carrito"
              >
                <ShoppingCart size={24} />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key={cartCount} // Clave para forzar re-render de animación
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full ring-2 ring-white shadow-sm"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* Perfil de Usuario / Login */}
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
                          initial={{ opacity: 0, y: 10, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.9 }}
                          className="absolute right-0 top-full mt-2 w-60 pt-2"
                        >
                            <div className="bg-white rounded-[1.5rem] shadow-xl border border-slate-100 overflow-hidden ring-1 ring-black/5">
                                <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100">
                                    <p className="text-sm font-bold text-slate-900 truncate">{currentUser?.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                                </div>
                                <div className="p-2">
                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                        <User size={18} className="text-indigo-500"/> Mi Perfil
                                    </Link>
                                    <Link to="/profile?tab=orders" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                                        <Package size={18} className="text-indigo-500"/> Pedidos
                                    </Link>
                                </div>
                                <div className="p-2 border-t border-slate-100">
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                    >
                                        <LogOut size={18} /> Salir
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

      {/* --- 4. MOBILE DRAWER (Menú Lateral) --- */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Overlay Oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[60] lg:hidden"
            />
            
            {/* Panel Deslizante (Spring Animation) */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white/95 backdrop-blur-2xl shadow-2xl z-[70] lg:hidden flex flex-col rounded-l-[2.5rem] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <span className="text-xl font-bold text-slate-900">Menú</span>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors"
                >
                  <X size={20} className="text-slate-600" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {NAV_ITEMS.map((item) => (
                  <div key={item.id}>
                    {item.type === 'mega' ? (
                      <div className="space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</h3>
                        <div className="grid gap-3">
                          {item.columns.map((col, colIdx) => (
                             col.items.map((subItem, subIdx) => (
                               <Link 
                                 key={`${colIdx}-${subIdx}`}
                                 to={subItem.href}
                                 className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-100 active:scale-95 transition-transform"
                               >
                                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 shrink-0">
                                    <subItem.icon size={22} />
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-900 text-sm">{subItem.label}</p>
                                    <p className="text-xs text-slate-500 line-clamp-1">{subItem.desc}</p>
                                  </div>
                               </Link>
                             ))
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link 
                        to={item.href}
                        className="block text-2xl font-bold text-slate-900 tracking-tight"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {!isAuthenticated && (
                   <div className="pt-4">
                        <Link 
                            to="/login"
                            className="flex items-center justify-center w-full py-4 bg-slate-900 text-white text-center rounded-[1.5rem] font-bold shadow-xl shadow-slate-900/20 active:scale-95 transition-transform"
                        >
                            Iniciar Sesión / Registro
                        </Link>
                   </div>
                )}
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                 <div className="flex gap-3">
                    <button onClick={() => setCurrency('USD')} className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all ${currency === 'USD' ? 'bg-white border-indigo-600 text-indigo-600 shadow-md' : 'bg-transparent border-slate-200 text-slate-500'}`}>USD ($)</button>
                    <button onClick={() => setCurrency('EUR')} className={`flex-1 py-3 text-xs font-bold rounded-xl border transition-all ${currency === 'EUR' ? 'bg-white border-indigo-600 text-indigo-600 shadow-md' : 'bg-transparent border-slate-200 text-slate-500'}`}>EUR (€)</button>
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