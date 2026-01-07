import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';

// Componentes Layout (Eager Load)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import useAuthStore from './stores/authStore';

// Lazy Load Páginas
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
// const CategoryPage = lazy(() => import('./pages/CategoryPage')); // No existe aún
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
// const NotFoundPage = lazy(() => import('./pages/NotFoundPage')); // Futuro

// Configuración de React Query
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            refetchOnWindowFocus: false,
        },
    },
});

const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full"
    >
        {children}
    </motion.div>
);

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                <Route path="/producto/:slug" element={<PageTransition><ProductPage /></PageTransition>} />
                {/* <Route path="/categoria/:category" element={<PageTransition><CategoryPage /></PageTransition>} /> */}
                <Route path="/carrito" element={<PageTransition><CartPage /></PageTransition>} />
                <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
                <Route path="/checkout" element={<PageTransition><CheckoutPage /></PageTransition>} />
                <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
                <Route path="/ofertas" element={<PageTransition><OffersPage /></PageTransition>} />
                <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                {/* <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} /> */}
            </Routes>
        </AnimatePresence>
    );
};

const App = () => {
    const checkAuth = useAuthStore((state) => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <div className="flex flex-col min-h-screen font-sans bg-slate-50 text-slate-900">
                    <ScrollToTop />
                    <Navbar />

                    <main className="flex-grow pt-20"> {/* PT-20 para compensar Navbar fijo */}
                        <Suspense fallback={
                            <div className="flex items-center justify-center min-h-[60vh]">
                                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            </div>
                        }>
                            <AnimatedRoutes />
                        </Suspense>
                    </main>

                    <Footer />
                    <Toaster position="bottom-right" toastOptions={{
                        style: {
                            background: '#1e293b',
                            color: '#fff',
                            borderRadius: '12px',
                        }
                    }} />
                </div>
            </Router>
        </QueryClientProvider>
    );
};

export default App;