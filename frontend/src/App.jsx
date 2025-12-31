import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import NotFoundPage from './pages/NotFoundPage';

// Lazy Load Pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ProductPage = React.lazy(() => import('./pages/ProductPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-[80vh]">
    <Loader2 className="h-10 w-10 animate-spin text-slate-900" />
  </div>
);

// Wrapper for AnimatePresence to access useLocation
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
            path="/" 
            element={
                <PageTransition>
                    <HomePage />
                </PageTransition>
            } 
        />
        <Route 
            path="/producto/:slug" 
            element={
                <PageTransition>
                    <ProductPage />
                </PageTransition>
            } 
        />
        <Route 
            path="/login" 
            element={
                <PageTransition>
                    <LoginPage />
                </PageTransition>
            } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
                <PageTransition>
                    <CheckoutPage />
                </PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
                <PageTransition>
                    <ProfilePage />
                </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route 
            path="*" 
            element={
                <PageTransition>
                    <NotFoundPage />
                </PageTransition>
            } 
        />
      </Routes>
    </AnimatePresence>
  );
};

const PageTransition = ({ children }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

import useCartStore from './stores/cartStore';

// Invisible component to handle global side effects
const InventorySyncer = () => {
  const syncStock = useCartStore(state => state.syncStock);
  
  React.useEffect(() => {
    // Sync immediately on mount
    syncStock();
    
    // Optional: Sync on window focus to catch updates if user comes back from another tab
    const onFocus = () => syncStock();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [syncStock]);

  return null;
};

const App = () => {
  return (
    <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
        <Router>
            <InventorySyncer />
            <ScrollToTop />
            <Layout>
                <Suspense fallback={<LoadingSpinner />}>
                    <AnimatedRoutes />
                </Suspense>
            </Layout>
        </Router>
        </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;