import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../stores/cartStore';
import SEO from '../components/SEO';

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="flex gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-100 items-center mb-4"
    >
        <div className="w-24 h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
        </div>

        <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900 truncate pr-4">{item.name}</h3>
            <p className="text-sm text-slate-500 mb-2">{item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>

            <div className="flex items-center gap-3">
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                    <button
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-white rounded-md transition-shadow text-slate-600"
                    >
                        <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold text-sm text-slate-900">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded-md transition-shadow text-slate-600"
                    >
                        <Plus size={14} />
                    </button>
                </div>
                <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto sm:ml-0"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>

        <div className="text-right hidden sm:block">
            <p className="font-bold text-lg text-slate-900">
                {(item.price * item.quantity).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
            </p>
        </div>
    </motion.div>
);

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCartStore();
    const total = getCartTotal();

    if (cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
                <SEO title="Carrito de Compras" />
                <div className="w-32 h-32 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-16 h-16 text-indigo-400" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Tu carrito está vacío</h1>
                <p className="text-slate-500 mb-8 max-w-md mx-auto">
                    Parece que no has añadido nada aún. Explora nuestros productos exclusívis y encuentra algo que te encante.
                </p>
                <Link
                    to="/"
                    className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:scale-105 shadow-lg shadow-slate-200"
                >
                    Empezar a Comprar
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
            <SEO title="Carrito de Compras" />

            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-extrabold text-slate-900">Carrito de Compras</h1>
                <span className="text-sm font-medium text-slate-500">{cart.length} productos</span>
            </div>

            <div className="lg:grid lg:grid-cols-12 lg:gap-12 items-start">

                {/* Product List */}
                <div className="lg:col-span-8">
                    <AnimatePresence>
                        {cart.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                updateQuantity={updateQuantity}
                                removeFromCart={removeFromCart}
                            />
                        ))}
                    </AnimatePresence>

                    <button
                        onClick={clearCart}
                        className="mt-4 text-sm font-bold text-red-500 hover:text-red-700 hover:underline transition-all"
                    >
                        Vaciar Carrito
                    </button>
                </div>

                {/* Summary Card */}
                <div className="lg:col-span-4 mt-8 lg:mt-0">
                    <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Resumen del Pedido</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-slate-600">
                                <span>Subtotal</span>
                                <span>{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Envío</span>
                                <span className="text-green-600 font-bold flex items-center gap-1">
                                    <Truck size={14} /> Gratis
                                </span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>Impuestos (Est.)</span>
                                <span>$0.00</span>
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4 mb-8">
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold text-slate-900">Total</span>
                                <span className="text-3xl font-extrabold text-indigo-600">
                                    {total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/checkout')}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all active:scale-95 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                        >
                            Proceder al Pago <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="mt-6 flex gap-3 justify-center text-slate-400">
                            <ShieldCheck size={16} />
                            <span className="text-xs font-medium">Checkout Seguro SSL 256-bit</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CartPage;
