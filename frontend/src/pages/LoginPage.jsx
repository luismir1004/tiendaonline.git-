import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, Loader2, ArrowRight, Github, Globe } from 'lucide-react';
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
    <div className="flex min-h-screen bg-slate-50 lg:bg-white relative overflow-x-hidden">
      <SEO 
        title={isLogin ? "Iniciar Sesión" : "Crear Cuenta"} 
        description="Accede a tu cuenta de TechNova y descubre ofertas exclusivas." 
      />

      {/* --- Mobile Background / Desktop Right Column --- */}
      <div className="absolute inset-0 lg:static lg:w-1/2 lg:order-2 h-[45vh] lg:h-auto overflow-hidden z-0">
         <SmartImage 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
            alt="Abstract Fluid 3D"
            className="w-full h-full object-cover"
         />
         {/* Overlays */}
         <div className="absolute inset-0 bg-indigo-900/30 mix-blend-multiply" />
         <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/95 lg:hidden" />
         <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent hidden lg:block" />

         {/* Desktop Quote */}
         <div className="absolute bottom-20 left-20 z-20 max-w-lg hidden lg:block">
            <blockquote className="text-white text-4xl font-bold leading-tight mb-6 drop-shadow-md">
                "La tecnología es mejor cuando une a las personas."
            </blockquote>
            <div className="flex items-center gap-4">
                <div className="h-1 w-12 bg-indigo-500 rounded-full"></div>
                <p className="text-indigo-200 font-medium tracking-wide uppercase text-sm">TechNova Vision</p>
            </div>
         </div>
      </div>

      {/* --- Form Section --- */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 lg:order-1">
        
        {/* Mobile: Glass Card Container / Desktop: Clean Layout */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`
            w-full max-w-lg mx-auto 
            mt-[30vh] lg:mt-0 
            px-8 py-10 lg:p-16 xl:p-24
            bg-white/80 lg:bg-transparent 
            backdrop-blur-2xl lg:backdrop-blur-none
            rounded-[2.5rem] lg:rounded-none
            shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.1)] lg:shadow-none
            min-h-[70vh] lg:min-h-0
          `}
        >
          {/* Header */}
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 mb-6">
                 <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-900 text-white shadow-lg shadow-indigo-500/30">
                    <ArrowRight size={20} className="text-white -rotate-45" />
                 </div>
                 <span className="text-2xl font-bold text-slate-900 tracking-tight">TechNova</span>
            </div>

            <motion.div
                key={isLogin ? 'login-header' : 'register-header'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
                    {isLogin ? '¡Hola de nuevo!' : 'Únete a nosotros'}
                </h1>
                <p className="text-slate-500 text-base">
                    {isLogin ? 'Ingresa tus datos para continuar comprando.' : 'Crea tu cuenta y disfruta de beneficios exclusivos.'}
                </p>
            </motion.div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence mode='popLayout'>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Input 
                    label="Nombre Completo"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    touched={touched.name}
                    icon={User}
                    // Props extras para Input si soporta, sino serán ignorados o pasados al div wrapper
                    autoComplete="name"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input 
              label="Correo Electrónico"
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

            <div className="space-y-1">
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
                        <button type="button" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors p-1">
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
                relative w-full h-14 flex justify-center items-center rounded-2xl text-base font-bold text-white shadow-xl
                transition-all duration-300 overflow-hidden group
                ${isSubmitting ? 'cursor-not-allowed opacity-80' : 'hover:shadow-indigo-500/25'}
              `}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] animate-gradient-xy ${isSubmitting ? '' : ''}`} />
              
              {/* Shimmer Overlay */}
              {!isSubmitting && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
              )}

              <span className="relative z-20 flex items-center gap-2">
                {isSubmitting ? (
                  <Loader2 className="animate-spin" size={24} />
                ) : (
                  <>
                    {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'} <ArrowRight size={20} />
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Social Login Separator */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 backdrop-blur-xl text-slate-500 font-medium">O continúa con</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
             <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all hover:border-slate-300 active:scale-95">
                 <Globe size={20} className="text-blue-500" /> {/* Simulating Google */}
                 Google
             </button>
             <button className="flex items-center justify-center gap-2 h-12 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all hover:border-slate-300 active:scale-95">
                 <Github size={20} className="text-slate-900" />
                 GitHub
             </button>
          </div>
          
          {/* Toggle Mode */}
          <div className="mt-10 text-center pb-8 lg:pb-0">
            <p className="text-slate-500 font-medium">
              {isLogin ? '¿Aún no tienes cuenta?' : '¿Ya eres miembro?'}
              <button 
                onClick={toggleMode}
                className="ml-2 text-indigo-600 font-bold hover:underline focus:outline-none"
              >
                {isLogin ? 'Regístrate ahora' : 'Ingresa aquí'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
