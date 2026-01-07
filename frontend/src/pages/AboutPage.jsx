import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Users, Globe, Zap, Heart } from 'lucide-react';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">

      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-50/50 rounded-l-[5rem] -z-10" />
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-200/30 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-6">
                <Zap size={16} className="fill-indigo-700" />
                <span>Innovación Constante</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 leading-tight mb-6">
                Redefiniendo el <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Comercio Global</span>
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                TechNova no es solo una tienda, es tu puente directo a la tecnología más avanzada del mundo. Curamos cuidadosamente cada producto para asegurar calidad, innovación y rendimiento.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900">50k+</span>
                  <span className="text-sm text-slate-500 font-medium">Clientes Felices</span>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900">1.2k+</span>
                  <span className="text-sm text-slate-500 font-medium">Productos Premium</span>
                </div>
                <div className="w-px h-12 bg-slate-200" />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900">24/7</span>
                  <span className="text-sm text-slate-500 font-medium">Soporte Dedicado</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1632&auto=format&fit=crop"
                alt="TechNova Team"
                className="rounded-[2.5rem] shadow-2xl shadow-indigo-200/50 relative z-10"
              />
              {/* Floating Card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl z-20 border border-slate-100 max-w-xs"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Garantía Total</h4>
                    <p className="text-xs text-slate-500">Compra protegida al 100%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nuestros Pilares</h2>
            <p className="text-slate-600">Lo que nos impulsa cada día a ser la mejor opción para tus necesidades tecnológicas.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Alcance Global",
                desc: "Traemos lo mejor de Asia directamente a tu puerta, sin intermediarios innecesarios.",
                color: "text-blue-500",
                bg: "bg-blue-50"
              },
              {
                icon: Users,
                title: "Comunidad Primero",
                desc: "Escuchamos a nuestros usuarios. Cada producto en catálogo ha sido votado por la comunidad.",
                color: "text-indigo-500",
                bg: "bg-indigo-50"
              },
              {
                icon: Truck,
                title: "Logística Veloz",
                desc: "Envíos optimizados con seguimiento en tiempo real para que no pierdas detalle.",
                color: "text-violet-500",
                bg: "bg-violet-50"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6`}>
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Zap size={48} className="text-indigo-500 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8">¿Listo para el futuro?</h2>
          <p className="text-xl text-slate-400 mb-10">Únete a miles de entusiastas de la tecnología que ya confían en TechNova.</p>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/30"
          >
            Ver Catálogo Completo
          </button>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;