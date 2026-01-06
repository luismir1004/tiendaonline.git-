import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, Loader2, ArrowRight, Github, Globe, Zap } from 'lucide-react';
import useAuthStore from '../stores/authStore';
import SEO from '../components/SEO';
import Input from '../components/Input';
import SmartImage from '../components/SmartImage';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuthStore();
  
  const from = location.state?.from?.pathname || '/';

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '' });
    setErrors({});
    setTouched({});
  };

  const validate = (name, value) => {
    if (name === 'email') {
      return /\S+@\S+\.\S+/.test(value) ? '' : 'Correo electrónico inválido';
    }
    if (name === 'password') {
      return value.length >= 6 ? '' : 'Mínimo 6 caracteres';
    }
    if (name === 'name' && !isLogin) {
      return value.length >= 3 ? '' : 'Mínimo 3 caracteres';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar campos
    const emailError = validate('email', formData.email);
    const passwordError = validate('password', formData.password);
    const nameError = !isLogin ? validate('name', formData.name) : '';

    if (emailError || passwordError || nameError) {
      setTouched({ email: true, password: true, name: !isLogin });
      setErrors({ email: emailError, password: passwordError, name: nameError });
      return;
    }

    setIsSubmitting(true);
    // Simulating network delay for effect
    const toastId = toast.loading(isLogin ? 'Iniciando sesión...' : 'Creando cuenta...');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      let result;
      if (isLogin) {
        result = login(formData.email, formData.password);
      } else {
        result = register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        toast.success(isLogin ? '¡Bienvenido de nuevo!' : '¡Cuenta creada con éxito!', { id: toastId });
        navigate(from, { replace: true });
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error(error.message || 'Ocurrió un error', { id: toastId });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-slate-900">
      <SEO 
        title={isLogin ? "Iniciar Sesión" : "Crear Cuenta"} 
        description="Accede a tu cuenta de TechNova y descubre ofertas exclusivas." 
      />

      {/* --- Immersive Background --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 z-0"
      >
         <SmartImage 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
            alt="Abstract Tech Background"
            className="w-full h-full object-cover opacity-60"
         />
         {/* Gradient Overlay for Readability */}
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/40 backdrop-blur-[2px]" />
      </motion.div>

      {/* --- Glass Card --- */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="
            relative z-10 w-full max-w-md mx-4 sm:mx-auto
            bg-white/80 backdrop-blur-2xl
            border border-white/20 shadow-2xl shadow-black/20
            rounded-[2.5rem] overflow-hidden
        "
      >
          <div className="p-8 sm:p-10">
            {/* Header: Logo & Title */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white shadow-lg shadow-indigo-500/30 mb-4 group">
                    <Zap size={24} className="fill-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                
                <motion.div
                    key={isLogin ? 'login-header' : 'register-header'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
                        {isLogin ? 'Bienvenido' : 'Únete a TechNova'}
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        {isLogin ? 'Tu tecnología favorita te espera.' : 'Crea tu cuenta y empieza a explorar.'}
                    </p>
                </motion.div>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
                <AnimatePresence mode='popLayout'>
                {!isLogin && (
                    <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                    >
                    <Input 
                        label="Nombre"
                        name="name"
                        type="text"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.name}
                        touched={touched.name}
                        icon={User}
                        autoComplete="name"
                        // Glassy Input Styling Override (if Input supports className prop or global styles)
                    />
                    </motion.div>
                )}
                </AnimatePresence>

                <Input 
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.email}
                    touched={touched.email}
                    icon={Mail}
                    autoComplete="email"
                    inputMode="email"
                />

                <div className="space-y-2">
                    <Input 
                        label="Contraseña"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password}
                        touched={touched.password}
                        icon={Lock}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                    />
                    {isLogin && (
                        <div className="flex justify-end">
                            <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>
                    )}
                </div>

                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className={`
                        relative w-full h-12 flex justify-center items-center rounded-xl text-sm font-bold text-white shadow-xl
                        transition-all duration-300 overflow-hidden group mt-2
                        ${isSubmitting ? 'cursor-not-allowed opacity-80' : 'hover:shadow-indigo-500/25'}
                    `}
                >
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-xy" />
                    
                    {/* Shimmer */}
                    {!isSubmitting && (
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                    )}

                    <span className="relative z-20 flex items-center gap-2">
                        {isSubmitting ? (
                        <Loader2 className="animate-spin" size={20} />
                        ) : (
                        <>
                            {isLogin ? 'Entrar' : 'Registrarse'} <ArrowRight size={18} />
                        </>
                        )}
                    </span>
                </motion.button>
            </form>

            {/* Social & Toggle Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200/60">
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200/80 bg-white/50 hover:bg-white text-slate-700 font-bold text-xs transition-all active:scale-95">
                        <Globe size={16} className="text-blue-500" />
                        Google
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200/80 bg-white/50 hover:bg-white text-slate-700 font-bold text-xs transition-all active:scale-95">
                        <Github size={16} className="text-slate-900" />
                        GitHub
                    </button>
                </div>

                <div className="text-center">
                    <p className="text-slate-500 text-xs font-medium">
                        {isLogin ? '¿Nuevo en TechNova?' : '¿Ya tienes cuenta?'}
                        <button 
                            onClick={toggleMode}
                            className="ml-1.5 text-indigo-600 font-bold hover:underline focus:outline-none"
                        >
                            {isLogin ? 'Crear cuenta gratis' : 'Iniciar sesión'}
                        </button>
                    </p>
                </div>
            </div>
          </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
