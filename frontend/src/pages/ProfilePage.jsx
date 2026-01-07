import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Settings, LogOut, TrendingUp, ShoppingBag, Clock } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import useOrdersStore from '../stores/ordersStore';
import SEO from '../components/SEO';
import ProfileTab from '../components/profile/ProfileTab';
import OrdersTab from '../components/profile/OrdersTab';
import SettingsTab from '../components/profile/SettingsTab';

const ProfilePage = () => {
  const { user, logout, isAuthenticated } = useAuthStore();
  const { orders, fetchOrders } = useOrdersStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  // Sincronizar tab con URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'orders', 'settings'].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('profile');
    }
  }, [searchParams]);

  // Cargar pedidos
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, fetchOrders]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Mi Perfil', icon: User },
    { id: 'orders', label: 'Mis Pedidos', icon: Package },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'profile') {
      navigate('/profile');
    } else {
      navigate(`/profile?tab=${tabId}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Calcular estadísticas
  const stats = {
    total: orders.length,
    completed: orders.filter(o => o.status === 'delivered').length,
    pending: orders.filter(o => o.status === 'processing' || o.status === 'shipped').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 pt-24 pb-12">
      <SEO
        title={`${tabs.find(t => t.id === activeTab)?.label} | Mi Cuenta`}
        description="Gestiona tu cuenta, pedidos y configuración."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-8"
        >
          {/* Fondo con gradiente animado */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
          </div>

          <div className="relative px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity animate-pulse" />
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl border-4 border-white/30 flex items-center justify-center text-white text-5xl font-bold shadow-2xl">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              </motion.div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                >
                  {user.name}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-white/80 text-lg mb-6"
                >
                  {user.email}
                </motion.p>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap gap-4 justify-center md:justify-start"
                >
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <ShoppingBag size={20} className="text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.total}</p>
                      <p className="text-xs text-white/70">Pedidos Totales</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center">
                      <TrendingUp size={20} className="text-emerald-200" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.completed}</p>
                      <p className="text-xs text-white/70">Completados</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center">
                      <Clock size={20} className="text-amber-200" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">{stats.pending}</p>
                      <p className="text-xs text-white/70">En Proceso</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Logout Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                onClick={handleLogout}
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all group"
              >
                <LogOut size={18} className="group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Cerrar Sesión</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-2 shadow-xl shadow-purple-500/10 inline-flex gap-2">
            {tabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${activeTab === tab.id
                    ? 'text-white'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl shadow-lg"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <tab.icon size={18} className="relative z-10" />
                <span className="relative z-10">{tab.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'profile' && <ProfileTab />}
            {activeTab === 'orders' && <OrdersTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProfilePage;