import React from 'react';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import SEO from '../components/SEO';

const ProfilePage = () => {
  const { currentUser, logout } = useAuthStore();

  if (!currentUser) return <div className="p-20 text-center">Cargando...</div>;

  const TabButton = ({ icon: Icon, label, active }) => (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
      <Icon size={18} />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-12 px-4">
      <SEO title="Mi Perfil" description="Gestiona tu cuenta." />
      
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Mi Cuenta</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Sidebar */}
          <div className="md:col-span-3 space-y-2">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-4 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-400">
                {currentUser.name.charAt(0)}
              </div>
              <h2 className="font-bold text-slate-900">{currentUser.name}</h2>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
            </div>

            <nav className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 space-y-1">
              <TabButton icon={User} label="Información Personal" active />
              <TabButton icon={Package} label="Mis Pedidos" />
              <TabButton icon={Settings} label="Configuración" />
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={18} />
                <span className="font-medium text-sm">Cerrar Sesión</span>
              </button>
            </nav>
          </div>

          {/* Content Area */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-9"
          >
            {/* Mock Content for "Información Personal" */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Información Personal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Nombre Completo</label>
                  <input type="text" value={currentUser.name} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Correo Electrónico</label>
                  <input type="email" value={currentUser.email} readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-500 mb-1">Teléfono</label>
                  <input type="text" placeholder="No especificado" readOnly className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900" />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <button className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                  Guardar Cambios
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;