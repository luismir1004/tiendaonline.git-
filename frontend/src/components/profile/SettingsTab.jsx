import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Bell, MapPin, CreditCard, Shield, Trash2, Save, Plus, Edit2, Check, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsTab = () => {
    const [activeSection, setActiveSection] = useState('security');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        promotions: false,
        newsletter: true
    });
    const [addresses, setAddresses] = useState([
        { id: 1, name: 'Casa', address: 'Calle Principal 123, Madrid, España', isDefault: true },
        { id: 2, name: 'Oficina', address: 'Av. Libertador 456, Barcelona, España', isDefault: false }
    ]);

    const handlePasswordChange = (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Las contraseñas no coinciden');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        toast.success('✨ Contraseña actualizada correctamente', {
            style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
            },
        });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleNotificationChange = (key) => {
        setNotifications({
            ...notifications,
            [key]: !notifications[key]
        });
        toast.success('Preferencias actualizadas');
    };

    const handleSetDefaultAddress = (id) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })));
        toast.success('Dirección predeterminada actualizada');
    };

    const handleDeleteAddress = (id) => {
        if (addresses.find(a => a.id === id)?.isDefault) {
            toast.error('No puedes eliminar la dirección predeterminada');
            return;
        }
        setAddresses(addresses.filter(addr => addr.id !== id));
        toast.success('Dirección eliminada');
    };

    const sections = [
        { id: 'security', label: 'Seguridad', icon: Lock, gradient: 'from-red-500 to-orange-500' },
        { id: 'notifications', label: 'Notificaciones', icon: Bell, gradient: 'from-blue-500 to-cyan-500' },
        { id: 'addresses', label: 'Direcciones', icon: MapPin, gradient: 'from-emerald-500 to-teal-500' },
        { id: 'payment', label: 'Métodos de Pago', icon: CreditCard, gradient: 'from-purple-500 to-pink-500' },
        { id: 'privacy', label: 'Privacidad', icon: Shield, gradient: 'from-violet-500 to-indigo-500' }
    ];

    const activeConfig = sections.find(s => s.id === activeSection);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-purple-500/10 p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <div className="relative">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Configuración
                    </h2>
                    <p className="text-slate-600">Gestiona tu cuenta y preferencias</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl p-2 space-y-1 shadow-lg sticky top-24">
                        {sections.map((section, index) => (
                            <motion.button
                                key={section.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setActiveSection(section.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeSection === section.id
                                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
                                    : 'text-slate-600 hover:bg-white/80'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeSection === section.id
                                    ? 'bg-white/20'
                                    : `bg-gradient-to-br ${section.gradient} text-white`
                                    }`}>
                                    <section.icon size={18} />
                                </div>
                                <span className="font-medium text-sm">{section.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* Security Section */}
                            {activeSection === 'security' && (
                                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeConfig.gradient} flex items-center justify-center text-white shadow-lg`}>
                                            <Lock size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900">Cambiar Contraseña</h3>
                                            <p className="text-sm text-slate-600">Actualiza tu contraseña de acceso</p>
                                        </div>
                                    </div>
                                    <form onSubmit={handlePasswordChange} className="space-y-4">
                                        {['currentPassword', 'newPassword', 'confirmPassword'].map((field, index) => (
                                            <div key={field}>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                                    {field === 'currentPassword' ? 'Contraseña Actual' : field === 'newPassword' ? 'Nueva Contraseña' : 'Confirmar Nueva Contraseña'}
                                                </label>
                                                <input
                                                    type="password"
                                                    value={passwordData[field]}
                                                    onChange={(e) => setPasswordData({ ...passwordData, [field]: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all"
                                                    required
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="submit"
                                            className="px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-violet-500/50 hover:scale-105 transition-all flex items-center gap-2"
                                        >
                                            <Save size={18} />
                                            Actualizar Contraseña
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Notifications Section */}
                            {activeSection === 'notifications' && (
                                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeConfig.gradient} flex items-center justify-center text-white shadow-lg`}>
                                            <Bell size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900">Notificaciones</h3>
                                            <p className="text-sm text-slate-600">Gestiona tus preferencias de comunicación</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        {Object.entries({
                                            orderUpdates: { title: 'Actualizaciones de Pedidos', desc: 'Recibe notificaciones sobre el estado de tus pedidos' },
                                            promotions: { title: 'Promociones y Ofertas', desc: 'Recibe información sobre descuentos y ofertas especiales' },
                                            newsletter: { title: 'Newsletter', desc: 'Recibe nuestro boletín con novedades y lanzamientos' }
                                        }).map(([key, { title, desc }]) => (
                                            <div key={key} className="flex items-center justify-between p-5 bg-white/80 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
                                                <div>
                                                    <p className="font-bold text-slate-900">{title}</p>
                                                    <p className="text-sm text-slate-600">{desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleNotificationChange(key)}
                                                    className={`relative w-16 h-8 rounded-full transition-all ${notifications[key] ? 'bg-gradient-to-r from-violet-600 to-indigo-600' : 'bg-slate-300'
                                                        }`}
                                                >
                                                    <span className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transition-transform ${notifications[key] ? 'translate-x-8' : 'translate-x-0'
                                                        }`} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Addresses Section */}
                            {activeSection === 'addresses' && (
                                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeConfig.gradient} flex items-center justify-center text-white shadow-lg`}>
                                                <MapPin size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900">Direcciones de Envío</h3>
                                                <p className="text-sm text-slate-600">Gestiona tus direcciones de entrega</p>
                                            </div>
                                        </div>
                                        <button className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/50 hover:scale-105 transition-all flex items-center gap-2">
                                            <Plus size={18} />
                                            Agregar
                                        </button>
                                    </div>
                                    <div className="space-y-4">
                                        {addresses.map((addr) => (
                                            <div key={addr.id} className="p-5 border-2 border-slate-200 rounded-xl hover:border-violet-300 transition-colors bg-white/80">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <p className="font-bold text-slate-900">{addr.name}</p>
                                                            {addr.isDefault && (
                                                                <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-md">
                                                                    <Check size={12} className="inline mr-1" />
                                                                    Predeterminada
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-600">{addr.address}</p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {!addr.isDefault && (
                                                            <button
                                                                onClick={() => handleSetDefaultAddress(addr.id)}
                                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                                title="Marcar como predeterminada"
                                                            >
                                                                <Check size={18} />
                                                            </button>
                                                        )}
                                                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteAddress(addr.id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Payment Methods Section */}
                            {activeSection === 'payment' && (
                                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeConfig.gradient} flex items-center justify-center text-white shadow-lg`}>
                                                <CreditCard size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900">Métodos de Pago</h3>
                                                <p className="text-sm text-slate-600">Gestiona tus tarjetas guardadas</p>
                                            </div>
                                        </div>
                                        <button className="px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/50 hover:scale-105 transition-all flex items-center gap-2">
                                            <Plus size={18} />
                                            Agregar Tarjeta
                                        </button>
                                    </div>
                                    <div className="text-center py-16">
                                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CreditCard size={40} className="text-purple-600" />
                                        </div>
                                        <p className="text-slate-600 text-lg mb-2">No tienes métodos de pago guardados</p>
                                        <p className="text-sm text-slate-400">Agrega una tarjeta para pagos más rápidos</p>
                                    </div>
                                </div>
                            )}

                            {/* Privacy Section */}
                            {activeSection === 'privacy' && (
                                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-xl p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeConfig.gradient} flex items-center justify-center text-white shadow-lg`}>
                                            <Shield size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-900">Privacidad y Seguridad</h3>
                                            <p className="text-sm text-slate-600">Gestiona tus datos y privacidad</p>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                                            <p className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                <Sparkles size={18} className="text-indigo-600" />
                                                Datos Personales
                                            </p>
                                            <p className="text-sm text-slate-600 mb-4">Descarga una copia de todos tus datos personales</p>
                                            <button className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-500/50 hover:scale-105 transition-all">
                                                Descargar Datos
                                            </button>
                                        </div>

                                        <div className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200">
                                            <p className="font-bold text-red-900 mb-2 flex items-center gap-2">
                                                <Trash2 size={18} className="text-red-600" />
                                                Eliminar Cuenta
                                            </p>
                                            <p className="text-sm text-red-700 mb-4">Esta acción es permanente y no se puede deshacer</p>
                                            <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 transition-all flex items-center gap-2">
                                                <Trash2 size={16} />
                                                Eliminar Mi Cuenta
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default SettingsTab;
