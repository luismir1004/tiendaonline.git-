import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Save, Sparkles } from 'lucide-react';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';

const ProfileTab = () => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO: Conectar con el backend para actualizar el perfil
        // await updateProfile(formData);

        toast.success('✨ Perfil actualizado correctamente', {
            style: {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
            },
        });
        setIsEditing(false);
    };

    const inputFields = [
        { name: 'name', label: 'Nombre Completo', icon: User, type: 'text', placeholder: 'Tu nombre' },
        { name: 'email', label: 'Correo Electrónico', icon: Mail, type: 'email', placeholder: 'tu@email.com' },
        { name: 'phone', label: 'Teléfono', icon: Phone, type: 'tel', placeholder: '+34 600 000 000' },
        { name: 'address', label: 'Dirección', icon: MapPin, type: 'text', placeholder: 'Tu dirección' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-purple-500/10 p-8">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-full blur-3xl" />

                <div className="relative flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Información Personal
                        </h2>
                        <p className="text-slate-600">Gestiona tu información de perfil</p>
                    </div>

                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${isEditing
                                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/50 hover:scale-105'
                            }`}
                    >
                        {isEditing ? (
                            <>Cancelar</>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Editar Perfil
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Form Card */}
            <div className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-purple-500/10 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {inputFields.map((field, index) => (
                            <motion.div
                                key={field.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                <label className="block text-sm font-bold text-slate-700 mb-2">
                                    {field.label}
                                </label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors">
                                        <field.icon size={20} />
                                    </div>
                                    <input
                                        type={field.type}
                                        name={field.name}
                                        value={formData[field.name]}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        placeholder={field.placeholder}
                                        className={`w-full pl-12 pr-4 py-4 rounded-xl border-2 transition-all outline-none ${isEditing
                                                ? 'border-slate-200 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 hover:border-violet-300'
                                                : 'border-transparent bg-slate-50/50 cursor-not-allowed text-slate-600'
                                            }`}
                                    />
                                    {isEditing && (
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-purple-500/0 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {isEditing && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex justify-end pt-6 border-t border-slate-200"
                        >
                            <button
                                type="submit"
                                className="relative px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-violet-500/50 hover:scale-105 transition-all flex items-center gap-3 group overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Save size={20} className="relative z-10" />
                                <span className="relative z-10">Guardar Cambios</span>
                                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700" />
                            </button>
                        </motion.div>
                    )}
                </form>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { label: 'Cambiar Foto', icon: User, color: 'from-violet-500 to-purple-500', action: () => toast('Próximamente') },
                    { label: 'Cambiar Contraseña', icon: MapPin, color: 'from-indigo-500 to-blue-500', action: () => toast('Próximamente') },
                    { label: 'Preferencias', icon: Sparkles, color: 'from-purple-500 to-pink-500', action: () => toast('Próximamente') }
                ].map((action, index) => (
                    <motion.button
                        key={action.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        onClick={action.action}
                        className="relative group overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 p-6 hover:shadow-xl hover:shadow-purple-500/20 transition-all"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                        <div className="relative flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-lg`}>
                                <action.icon size={24} />
                            </div>
                            <span className="font-bold text-slate-900">{action.label}</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
};

export default ProfileTab;
