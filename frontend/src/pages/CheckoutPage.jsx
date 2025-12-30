import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, ShieldCheck, MapPin, Loader2, Truck, User } from 'lucide-react';
import useCartStore from '../stores/cartStore';
import SEO from '../components/SEO';
import Input from '../components/Input';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cart);
  const cartTotal = useCartStore((state) => state.getCartTotal());
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  
  // Estado unificado del formulario
  const [form, setForm] = useState({
    firstName: '', lastName: '', address: '', city: '', zip: '',
    cardNumber: '', expDate: '', cvc: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    // Validación básica antes de avanzar
    if (!form.firstName || !form.address || !form.city) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simular proceso de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    clearCart();
    toast.success('¡Pedido confirmado! Te enviaremos los detalles por correo.');
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <SEO title="Carrito Vacío" description="Tu carrito de compras está vacío." />
        <div className="bg-slate-100 p-6 rounded-full mb-4">
          <Truck className="w-12 h-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-500 mb-6">Parece que aún no has añadido productos.</p>
        <button 
          onClick={() => navigate('/')}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          Explorar Productos
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO title="Finalizar Compra" description="Completa tu pedido de forma segura." />
      
      <h1 className="text-3xl font-extrabold text-slate-900 mb-8 lg:mb-12 text-center lg:text-left">Finalizar Compra</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        
        {/* --- Sección del Formulario --- */}
        <section className="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-8 lg:mb-0">
          
          {/* Indicador de Pasos */}
          <div className="flex items-center mb-8 space-x-4 border-b border-slate-100 pb-6">
            <div className={`flex items-center space-x-2 ${step === 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
              <span className="font-semibold hidden sm:inline">Envío</span>
            </div>
            <div className="w-12 h-px bg-slate-300"></div>
            <div className={`flex items-center space-x-2 ${step === 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
              <span className="font-semibold hidden sm:inline">Pago</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <MapPin className="text-indigo-500" />
                  Dirección de Envío
                </h3>
                
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <Input label="Nombre" name="firstName" placeholder="Juan" value={form.firstName} onChange={handleChange} />
                  <Input label="Apellido" name="lastName" placeholder="Pérez" value={form.lastName} onChange={handleChange} />
                  
                  <div className="sm:col-span-2">
                    <Input label="Dirección" name="address" placeholder="Av. Principal 123" value={form.address} onChange={handleChange} icon={MapPin} />
                  </div>
                  
                  <Input label="Ciudad" name="city" placeholder="Ciudad de México" value={form.city} onChange={handleChange} />
                  <Input label="Código Postal" name="zip" placeholder="00000" value={form.zip} onChange={handleChange} />
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNextStep}
                  className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-md"
                >
                  Continuar al Pago
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                  <CreditCard className="text-indigo-500" />
                  Método de Pago
                </h3>
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
                  <div className="flex items-center mb-6">
                    <input id="card" name="payment-type" type="radio" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" />
                    <label htmlFor="card" className="ml-3 block text-sm font-medium text-slate-700 font-semibold">
                      Tarjeta de Crédito / Débito
                    </label>
                  </div>
                  
                  <div className="space-y-4">
                    <Input 
                      label="Número de Tarjeta" 
                      name="cardNumber" 
                      placeholder="0000 0000 0000 0000" 
                      value={form.cardNumber} 
                      onChange={handleChange} 
                      icon={CreditCard}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Fecha Exp." name="expDate" placeholder="MM/YY" value={form.expDate} onChange={handleChange} />
                      <Input label="CVC" name="cvc" placeholder="123" value={form.cvc} onChange={handleChange} type="password" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-white text-slate-700 border border-slate-300 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                  >
                    Atrás
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isProcessing}
                    whileTap={!isProcessing ? { scale: 0.98 } : {}}
                    className="w-2/3 flex justify-center items-center bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed shadow-md"
                  >
                    {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" size={18} />}
                    {isProcessing ? 'Procesando...' : `Pagar $${cartTotal.toFixed(2)}`}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </form>
        </section>

        {/* --- Resumen del Pedido --- */}
        <section className="lg:col-span-5 bg-slate-100 rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Resumen del Pedido</h2>
          <ul className="divide-y divide-slate-200 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {cartItems.map((item) => (
              <li key={item.id} className="py-4 flex items-start space-x-4">
                <img src={item.image} alt={item.name} className="flex-none w-16 h-16 rounded-lg object-cover bg-white shadow-sm" />
                <div className="flex-auto space-y-1">
                  <h3 className="text-sm font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-xs text-slate-500 bg-white inline-block px-2 py-1 rounded-md border border-slate-200">Cant: {item.quantity}</p>
                </div>
                <p className="flex-none text-sm font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          
          <div className="border-t border-slate-300 pt-6 space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <p>Subtotal</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <p>Envío</p>
              <p className="text-green-600 font-medium flex items-center gap-1"><Truck size={14} /> Gratis</p>
            </div>
            <div className="flex items-center justify-between text-xl font-extrabold text-slate-900 pt-4 border-t border-slate-300 mt-4">
              <p>Total</p>
              <p>${cartTotal.toFixed(2)}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-2 text-slate-500 text-xs bg-slate-200 py-3 rounded-lg">
            <ShieldCheck size={16} className="text-green-600" />
            <span>Pago encriptado SSL de 256-bits</span>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CheckoutPage;