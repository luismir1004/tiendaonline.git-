import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, Loader2, ArrowRight } from 'lucide-react';
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
    const toastId = toast.loading(isLogin ? 'Iniciando sesión...' : 'Creando cuenta...');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

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
    <div className="flex min-h-screen bg-white">
      <SEO 
        title={isLogin ? "Iniciar Sesión" : "Crear Cuenta"} 
        description="Accede a tu cuenta de TechNova." 
      />

      {/* --- Left Column: Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-16 xl:p-24 relative">
        <motion.div 
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">TechNova</h1>
            <motion.h2 
                key={isLogin ? 'login-t' : 'reg-t'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-2xl font-bold text-slate-900"
            >
                {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
            </motion.h2>
            <p className="mt-2 text-slate-500">
                {isLogin ? 'Ingresa tus credenciales para acceder.' : 'Únete para una experiencia de compra premium.'}
            </p>
          </div>

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
                    label="Nombre Completo"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.name}
                    touched={touched.name}
                    icon={User}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input 
              label="Correo Electrónico"
              name="email"
              type="email"
              placeholder="nombre@ejemplo.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
              touched={touched.email}
              icon={Mail}
            />

            <div className="relative">
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
                />
                 {isLogin && (
                    <div className="flex justify-end mt-1">
                        <button type="button" className="text-xs font-medium text-slate-500 hover:text-slate-900">
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>
                )}
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.01 } : {}}
              whileTap={!isSubmitting ? { scale: 0.99 } : {}}
              className={`
                w-full flex justify-center items-center py-4 rounded-xl text-sm font-bold text-white shadow-lg shadow-slate-900/10
                transition-all duration-300 mt-6
                ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'}
              `}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? 'Ingresar' : 'Registrarse'} <ArrowRight size={16} />
                </span>
              )}
            </motion.button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}
              <button 
                onClick={toggleMode}
                className="ml-2 font-bold text-slate-900 hover:underline focus:outline-none"
              >
                {isLogin ? 'Regístrate gratis' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* --- Right Column: Image (Desktop Only) --- */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
        
        {/* Recommended Image: Minimalist Architecture/Abstract */}
        <SmartImage 
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"
            alt="Minimalist Architecture"
            className="w-full h-full object-cover opacity-90"
        />

        <div className="absolute bottom-16 left-16 z-20 max-w-lg">
            <blockquote className="text-white text-3xl font-bold leading-tight mb-4">
                "La simplicidad es la máxima sofisticación."
            </blockquote>
            <p className="text-slate-300 font-medium">— Leonardo da Vinci</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
