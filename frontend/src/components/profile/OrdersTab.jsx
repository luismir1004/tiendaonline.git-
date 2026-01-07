import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';
import useOrdersStore from '../../stores/ordersStore';
import OrderCard from './OrderCard';
import { ORDER_STATUSES } from '../../data/mockOrders';

const OrdersTab = () => {
    const { orders, isLoading, fetchOrders, getOrdersByStatus } = useOrdersStore();
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const filteredOrders = () => {
        let result = selectedStatus === 'all' ? orders : getOrdersByStatus(selectedStatus);

        if (searchQuery) {
            result = result.filter(order =>
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        return result;
    };

    const displayedOrders = filteredOrders();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Total',
            value: orders.length,
            icon: Package,
            gradient: 'from-violet-500 to-purple-500',
            bgGradient: 'from-violet-50 to-purple-50'
        },
        {
            label: 'Entregados',
            value: orders.filter(o => o.status === 'delivered').length,
            icon: CheckCircle2,
            gradient: 'from-emerald-500 to-teal-500',
            bgGradient: 'from-emerald-50 to-teal-50'
        },
        {
            label: 'En Camino',
            value: orders.filter(o => o.status === 'shipped').length,
            icon: TrendingUp,
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50'
        },
        {
            label: 'Procesando',
            value: orders.filter(o => o.status === 'processing').length,
            icon: Clock,
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50'
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 border border-white/40 shadow-lg hover:shadow-xl transition-shadow group`}
                    >
                        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                        <div className="relative">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-3 shadow-lg`}>
                                <stat.icon size={24} />
                            </div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                            <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl shadow-purple-500/10 p-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent mb-1">
                            Mis Pedidos
                        </h2>
                        <p className="text-slate-600">Gestiona y rastrea tus pedidos</p>
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-auto group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Buscar por ID o producto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-80 pl-11 pr-4 py-3 rounded-xl border-2 border-slate-200 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button
                        onClick={() => setSelectedStatus('all')}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${selectedStatus === 'all'
                                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
                                : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-md'
                            }`}
                    >
                        Todos ({orders.length})
                    </button>

                    {Object.entries(ORDER_STATUSES).map(([status, config]) => {
                        const count = orders.filter(o => o.status === status).length;
                        return (
                            <button
                                key={status}
                                onClick={() => setSelectedStatus(status)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${selectedStatus === status
                                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30'
                                        : 'bg-white/80 text-slate-600 hover:bg-white hover:shadow-md'
                                    }`}
                            >
                                {config.icon} {config.label} ({count})
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Orders List */}
            {displayedOrders.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl p-12 text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl" />
                    <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Package size={40} className="text-violet-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">No hay pedidos</h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            {searchQuery
                                ? 'No se encontraron pedidos con esos criterios de búsqueda'
                                : selectedStatus === 'all'
                                    ? 'Aún no has realizado ningún pedido'
                                    : `No tienes pedidos con estado "${ORDER_STATUSES[selectedStatus].label}"`
                            }
                        </p>
                        {!searchQuery && selectedStatus === 'all' && (
                            <a
                                href="/"
                                className="inline-block px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-violet-500/50 hover:scale-105 transition-all"
                            >
                                Explorar Productos
                            </a>
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {displayedOrders.map((order, index) => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <OrderCard order={order} />
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default OrdersTab;
