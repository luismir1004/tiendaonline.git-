import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ShieldCheck, MapPin, Loader2, Truck, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

import useCartStore from '../stores/cartStore';
import SEO from '../components/SEO';
import Input from '../components/Input';

// --- CONFIGURACIÓN STRIPE ---
// NOTA: Reemplazar con tu Publishable Key de Stripe Dashboard
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ clientSecret, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("¡Pago exitoso!");
          break;
        case "processing":
          setMessage("Tu pago se está procesando.");
          break;
        case "requires_payment_method":
          setMessage("Tu pago no fue exitoso, por favor intenta de nuevo.");
          break;
        default:
          setMessage("Algo salió mal.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    // Confirmar pago con Stripe real

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:5173/profile?tab=orders", // Redirigir tras pago exitoso
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("Ocurrió un error inesperado.");
      }
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      </div>

      {message && <div id="payment-message" className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{message}</div>}

      <button
        disabled={isLoading || !stripe || !elements}
        id="submit"
        className="w-full flex justify-center items-center bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
      >
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Lock className="mr-2" size={18} />}
        {isLoading ? "Procesando Seguro..." : "Pagar Ahora"}
      </button>

      <div className="flex justify-center items-center gap-2 text-slate-400 text-xs">
        <ShieldCheck size={12} />
        <span>Pagos procesados de forma segura por Stripe</span>
      </div>
    </form>
  );
};


const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart: cartItems, getCartTotal, clearCart } = useCartStore();
  const cartTotal = getCartTotal();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [clientSecret, setClientSecret] = useState("");

  // Estado del formulario de envío
  const [shippingForm, setShippingForm] = useState({
    firstName: '', lastName: '', address: '', city: '', zip: '', email: ''
  });

  // Generar PaymentIntent al llegar al paso 3 o montar
  // En producción, esto debe llamar a tu API
  // Generar PaymentIntent real desde el backend
  useEffect(() => {
    if (cartItems.length > 0) {
      fetch("http://localhost:3000/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            console.error("Error fetching payment intent:", data.error);
            toast.error("Error al iniciar pago segura");
          }
        })
        .catch((err) => {
          console.error("Error network payment intent:", err);
          toast.error("Error de conexión con pasarela de pago");
        });
    }
  }, [cartItems]); // Re-crear intent si cambia el carrito (idealmetne deberia ser mas complejo update, pero MVP ok)

  const handleShippingChange = (e) => setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });

  const validateShipping = () => {
    const { firstName, address, city, email } = shippingForm;
    return firstName && address && city && email;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!validateShipping()) {
        toast.error('Por favor completa todos los campos de envío');
        return;
      }
      setStep(2);
    }
  };

  const handleSuccess = () => {
    toast.success('¡Pedido COMPLETADO! Gracias por tu compra.');
    clearCart();
    navigate('/');
  };

  // Opciones de Stripe Elements (Appearance API)
  const appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#4f46e5',
    },
  };

  // Fake loader para options (en demo mode, pasamos mode: 'payment' y currency si no hay clientSecret real, 
  // pero React Stripe JS necesita clientSecret O mode/amount.
  // Vamos a usar un truco: Si es demo, mostramos UI simulada o intentamos renderizar con datos dummy si lo permite.
  // NOTA: PaymentElement fallará sin un Client Secret real válido.
  // Estrategia: Si es demo, mostramos un aviso visual "Stripe Demo Mode" y un formulario simulado visualmente O
  // usamos una key de test pública real si la hay (use la genérica pk_test_TYooMQauvdEDq54NiTphI7jx que suele ser publica en docs).

  const options = {
    clientSecret,
    mode: 'payment',
    amount: Math.round(cartTotal * 100) || 1000, // En centavos
    currency: 'usd',
    appearance,
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <SEO title="Carrito Vacío" />
        <div className="bg-slate-100 p-8 rounded-full mb-6 animate-bounce-slow">
          <Truck className="w-16 h-16 text-slate-400" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Tu carrito está vacío</h2>
        <button onClick={() => navigate('/')} className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform">
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 bg-slate-50 min-h-screen">
      <SEO title="Finalizar Compra Segura" />

      <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-start">

        {/* --- COLUMNA IZQUIERDA: FLUSO DE CHECKOUT --- */}
        <div className="lg:col-span-7 space-y-8">
          <nav aria-label="Progress">
            <ol role="list" className="flex items-center">
              <li className={`relative pr-8 sm:pr-20 ${step >= 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-slate-200"></div>
                </div>
                <a href="#" className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-current hover:border-indigo-600 transition-colors">
                  <MapPin size={16} />
                </a>
                <span className="absolute mt-2 -ml-2 text-xs font-bold uppercase tracking-wider">Envío</span>
              </li>
              <li className={`relative ${step >= 2 ? 'text-indigo-600' : 'text-slate-400'}`}>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-slate-200"></div>
                </div>
                <a href="#" className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-current">
                  <ShieldCheck size={16} />
                </a>
                <span className="absolute mt-2 -ml-2 text-xs font-bold uppercase tracking-wider">Pago</span>
              </li>
            </ol>
          </nav>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100"
              >
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Información de Envío</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input label="Email" name="email" type="email" placeholder="tu@email.com" value={shippingForm.email} onChange={handleShippingChange} className="sm:col-span-2" />
                  <Input label="Nombre" name="firstName" placeholder="Juan" value={shippingForm.firstName} onChange={handleShippingChange} />
                  <Input label="Apellido" name="lastName" placeholder="Pérez" value={shippingForm.lastName} onChange={handleShippingChange} />
                  <Input label="Dirección" name="address" placeholder="Calle Principal 123" value={shippingForm.address} onChange={handleShippingChange} className="sm:col-span-2" icon={MapPin} />
                  <Input label="Ciudad" name="city" placeholder="CDMX" value={shippingForm.city} onChange={handleShippingChange} />
                  <Input label="Código Postal" name="zip" placeholder="00000" value={shippingForm.zip} onChange={handleShippingChange} />
                </div>
                <button
                  onClick={handleNextStep}
                  className="w-full mt-8 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  Continuar a Pago <Truck size={18} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-8 rounded-[2rem] shadow-xl border border-indigo-50 ring-4 ring-indigo-50/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Método de Pago</h2>
                  <button onClick={() => setStep(1)} className="text-sm font-medium text-slate-500 hover:text-indigo-600 underline">Editar Envío</button>
                </div>

                {/* STRIPE ELEMENTS WRAPPER */}
                {clientSecret && (
                  <Elements stripe={stripePromise} options={options}>
                    <CheckoutForm clientSecret={clientSecret} onSuccess={handleSuccess} />
                  </Elements>
                )}

                {!clientSecret && (
                  <div className="flex justify-center p-12">
                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- COLUMNA DERECHA: RESUMEN --- */}
        <div className="lg:col-span-5 mt-10 lg:mt-0">
          <div className="bg-white p-6 sm:p-8 rounded-[2rem] shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Resumen del Pedido</h3>
            <ul className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map(item => (
                <li key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500">Cant: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-semibold text-slate-900">
                    ${(item.price * item.quantity).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-slate-100 my-6 pt-6 space-y-3">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Envío</span>
                <span className="text-green-600 font-bold">GRATIS</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold text-slate-900 pt-2">
                <span>Total</span>
                <span>${cartTotal.toLocaleString()} USD</span>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="text-indigo-600 flex-shrink-0" size={20} />
              <p className="text-xs text-slate-500 leading-relaxed">
                Tus datos están protegidos por encriptación SSL de 256 bits. No guardamos tu información financiera.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;