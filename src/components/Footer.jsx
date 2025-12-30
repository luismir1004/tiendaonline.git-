import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Zap, Mail, ArrowRight, Github } from 'lucide-react';

const FooterLink = ({ to, children }) => (
  <li>
    <Link 
      to={to} 
      className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
    >
      {children}
    </Link>
  </li>
);

const SocialIcon = ({ href, children }) => (
  <a 
    href={href} 
    className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-900 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all duration-300"
    target="_blank" 
    rel="noopener noreferrer"
  >
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Grid Principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Columna 1: Marca */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white mb-4">
              <Zap className="text-indigo-500 fill-indigo-500" />
              <span>TechNova</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Tu destino premium para la tecnología más avanzada. Diseñamos el futuro, un dispositivo a la vez.
            </p>
            <div className="flex gap-4 pt-4">
              <SocialIcon href="#"><Twitter size={20} /></SocialIcon>
              <SocialIcon href="#"><Instagram size={20} /></SocialIcon>
              <SocialIcon href="#"><Facebook size={20} /></SocialIcon>
              <SocialIcon href="#"><Github size={20} /></SocialIcon>
            </div>
          </div>

          {/* Columna 2: Tienda */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide">Tienda</h3>
            <ul className="space-y-3">
              <FooterLink to="/#products">Laptops & Computadoras</FooterLink>
              <FooterLink to="/#products">Tablets Creativas</FooterLink>
              <FooterLink to="/#products">Audio Premium</FooterLink>
              <FooterLink to="/#products">Accesorios</FooterLink>
              <FooterLink to="#">Nuevos Lanzamientos</FooterLink>
            </ul>
          </div>

          {/* Columna 3: Soporte */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide">Soporte</h3>
            <ul className="space-y-3">
              <FooterLink to="#">Centro de Ayuda</FooterLink>
              <FooterLink to="#">Estado del Pedido</FooterLink>
              <FooterLink to="#">Envíos y Devoluciones</FooterLink>
              <FooterLink to="#">Garantía TechNova</FooterLink>
              <FooterLink to="#">Contáctanos</FooterLink>
            </ul>
          </div>

          {/* Columna 4: Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide">Mantente al día</h3>
            <p className="text-slate-400 text-sm mb-4">
              Suscríbete para recibir ofertas exclusivas y novedades antes que nadie.
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="tu@email.com" 
                  className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-slate-600"
                />
                <button 
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-500 transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-600">
                Al suscribirte aceptas nuestra Política de Privacidad.
              </p>
            </form>
          </div>

        </div>

        {/* Barra Inferior */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} TechNova Inc. Todos los derechos reservados.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link to="#" className="hover:text-slate-300 transition-colors">Privacidad</Link>
            <Link to="#" className="hover:text-slate-300 transition-colors">Términos</Link>
            <Link to="#" className="hover:text-slate-300 transition-colors">Cookies</Link>
          </div>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;