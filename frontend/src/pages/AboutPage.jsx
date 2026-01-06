import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Shield, Cpu, Globe, Heart, Rocket } from 'lucide-react';

const AboutPage = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Timeline Data
  const milestones = [
    { year: '2020', title: 'La Génesis', desc: 'TechNova nace en un pequeño garaje con una visión clara: democratizar la tecnología de punta.', icon: Zap },
    { year: '2022', title: 'Expansión Global', desc: 'Lanzamos envíos a más de 50 países, conectando innovadores de todo el mundo.', icon: Globe },
    { year: '2024', title: 'Revolución AI', desc: 'Integramos inteligencia artificial en nuestra plataforma para personalizar cada experiencia.', icon: Cpu },
    { year: '2026', title: 'El Futuro es Hoy', desc: 'Lideramos el mercado con soluciones sostenibles y tecnología de vanguardia.', icon: Rocket },
  ];

  return (
    <div ref={containerRef} className="bg-slate-50 min-h-screen overflow-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 z-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-indigo-500/20 rounded-full blur-xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
              }}
              animate={{
                y: [0, Math.random() * 100 - 50],
                x: [0, Math.random() * 100 - 50],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-bold tracking-widest mb-6">
              EST. 2020
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-6 tracking-tight leading-tight">
              Innovación que <br /> nace del futuro.
            </h1>
            <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              No solo vendemos tecnología. Creamos el puente entre lo que imaginas y lo que es posible.
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
        >
            <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-2">
                <div className="w-1 h-2 bg-current rounded-full" />
            </div>
        </motion.div>
      </section>

      {/* --- TIMELINE SECTION --- */}
      <section className="py-32 px-4 relative max-w-6xl mx-auto">
        <div className="absolute left-4 md:left-1/2 top-32 bottom-32 w-0.5 bg-slate-200 -translate-x-1/2 md:translate-x-0" />
        
        <div className="space-y-24">
            {milestones.map((item, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-center gap-8 ${
                        idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                >
                    {/* Content Card */}
                    <div className="flex-1 w-full pl-12 md:pl-0">
                        <div className={`bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100 hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 group ${
                             idx % 2 === 0 ? 'md:text-left' : 'md:text-right'
                        }`}>
                            <span className="text-5xl font-black text-slate-100 absolute -top-6 md:-top-8 select-none z-0 group-hover:text-indigo-50 transition-colors">
                                {item.year}
                            </span>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    </div>

                    {/* Center Point */}
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white border-4 border-indigo-100 flex items-center justify-center shadow-lg z-10">
                        <item.icon size={20} className="text-indigo-600" />
                    </div>

                    {/* Spacer for layout balance */}
                    <div className="flex-1 hidden md:block" />
                </motion.div>
            ))}
        </div>
      </section>

      {/* --- VALUES & MISSION --- */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden rounded-t-[3rem] -mt-10">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
                <h2 className="text-3xl md:text-5xl font-bold mb-6">Nuestros Pilares</h2>
                <p className="text-indigo-200 max-w-2xl mx-auto text-lg">
                    Más allá del hardware, nos impulsa una filosofía de excelencia y compromiso con el usuario.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { icon: Shield, title: "Confianza Total", desc: "Garantía extendida y soporte 24/7 en cada dispositivo." },
                    { icon: Cpu, title: "Innovación Pura", desc: "Curaduría experta de lo último en tecnología global." },
                    { icon: Heart, title: "Pasión Tech", desc: "Somos geeks creando para geeks. Amamos lo que hacemos." }
                ].map((val, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="p-8 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors group text-center"
                    >
                        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <val.icon size={32} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">{val.title}</h3>
                        <p className="text-slate-400">{val.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;