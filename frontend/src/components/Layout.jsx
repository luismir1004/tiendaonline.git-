import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';
import SlideOverCart from './SlideOverCart';
import WishlistSidebar from './WishlistSidebar';
import TopProgressBar from './TopProgressBar';
import NexusQuickView from './NexusQuickView';
import ProductComparisonBar from './ProductComparisonBar';
import BackToTop from './BackToTop';
import BottomNav from './layout/BottomNav';

/**
 * Layout Principal
 * Centraliza la estructura común (Navbar, Footer, Cart, Toasts) para evitar repetición en App.jsx.
 */
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      <TopProgressBar />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      
      <Navbar />
      <SlideOverCart />
      <WishlistSidebar />
      <NexusQuickView />
      <ProductComparisonBar />

      {/* Main Content Area */}
      <main className="flex-grow w-full">
        {children}
      </main>

      <BackToTop />
      <BottomNav />
      <Footer />
    </div>
  );
};

export default Layout;