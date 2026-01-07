import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Package, Truck, CheckCircle, XCircle, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { ORDER_STATUSES } from '../../data/mockOrders';
import useCurrencyStore from '../../stores/currencyStore';

const OrderCard = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { formatPrice } = useCurrencyStore();

    const statusConfig = ORDER_STATUSES[order.status];

    const getStatusIcon = () => {
        switch (order.status) {
            case 'processing':
                return <Package size={18} className="text-blue-600" />;
            case 'shipped':
                return <Truck size={18} className="text-purple-600" />;
            case 'delivered':
                return <CheckCircle size={18} className="text-emerald-600" />;
            case 'cancelled':
                return <XCircle size={18} className="text-red-600" />;
            default:
                return <Package size={18} />;
        }
    };

    const getStatusGradient = () => {
        switch (order.status) {
            case 'processing':
                return 'from-blue-500 to-cyan-500';
            case 'shipped':
                return 'from-purple-500 to-pink-500';
            case 'delivered':
                return 'from-emerald-500 to-teal-500';
            case 'cancelled':
                return 'from-red-500 to-orange-500';
            default:
                return 'from-slate-500 to-slate-600';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            className="group relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all"
        >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${getStatusGradient()} opacity-0 group-hover:opacity-5 transition-opacity`} />

            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="relative w-full p-6 flex items-center justify-between hover:bg-white/30 transition-colors"
            >
                <div className="flex items-center gap-4 flex-1">
                    {/* Status Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getStatusGradient()} flex items-center justify-center shrink-0 shadow-lg`}>
                        <div className="w-12 h-12 rounded-lg bg-white/90 backdrop-blur-sm flex items-center justify-center">
                            {getStatusIcon()}
                        </div>
                    </div>

                    <div className="text-left flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-slate-900 text-lg">{order.id}</h3>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r ${getStatusGradient()} text-white shadow-md`}>
                                {statusConfig.icon} {statusConfig.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <div className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                <span>{formatDate(order.date)}</span>
                            </div>
                            <span className="text-slate-300">•</span>
                            <span className="font-medium">{order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                            {formatPrice(order.total)}
                        </p>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3, type: "spring" }}
                        className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors"
                    >
                        <ChevronDown size={20} className="text-slate-600" />
                    </motion.div>
                </div>
            </button>

            {/* Expandable Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 border-t border-slate-200/50 pt-6 space-y-6">
                            {/* Products Grid */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Package size={16} />
                                    Productos
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {order.items.map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex items-center gap-4 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-100 hover:shadow-md transition-shadow group"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform"
                                                />
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                                    {item.quantity}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 truncate">{item.name}</p>
                                                <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-slate-900 whitespace-nowrap">{formatPrice(item.price)}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping & Tracking */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-xl border border-slate-200">
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <MapPin size={16} />
                                        Envío
                                    </h4>
                                    <p className="text-sm font-medium text-slate-700 mb-1">{order.shipping.method}</p>
                                    <p className="text-sm text-slate-600">{order.shipping.address}</p>
                                </div>

                                {order.tracking && (
                                    <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50/50 rounded-xl border border-indigo-200">
                                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                            <Truck size={16} />
                                            Seguimiento
                                        </h4>
                                        <p className="text-sm font-medium text-slate-700 mb-2">{order.tracking.carrier}</p>
                                        <a
                                            href={order.tracking.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium group"
                                        >
                                            {order.tracking.number}
                                            <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Timeline */}
                            {order.timeline && order.timeline.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Historial del Pedido</h4>
                                    <div className="space-y-4">
                                        {order.timeline.map((event, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="flex gap-4"
                                            >
                                                <div className="relative">
                                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${getStatusGradient()} mt-2 shadow-lg`} />
                                                    {idx < order.timeline.length - 1 && (
                                                        <div className={`absolute top-5 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b ${getStatusGradient()} opacity-30`} />
                                                    )}
                                                </div>
                                                <div className="flex-1 pb-6">
                                                    <p className="text-sm font-medium text-slate-900">{event.description}</p>
                                                    <p className="text-xs text-slate-500 mt-1">{formatDate(event.date)}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Order Summary */}
                            <div className="pt-4 border-t border-slate-200">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Subtotal</span>
                                        <span className="font-medium text-slate-900">
                                            {formatPrice(order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Envío</span>
                                        <span className="font-medium text-slate-900">{formatPrice(order.shipping.cost)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-bold pt-3 border-t border-slate-200">
                                        <span className="text-slate-900">Total</span>
                                        <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                                            {formatPrice(order.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default OrderCard;
