import { create } from 'zustand';
import { mockOrders, getOrdersByStatus, getOrderById } from '../data/mockOrders';

const useOrdersStore = create((set, get) => ({
    orders: [],
    isLoading: false,
    error: null,
    selectedOrder: null,

    // Cargar pedidos (por ahora usa mock data, luego se conectará al backend)
    fetchOrders: async () => {
        try {
            set({ isLoading: true, error: null });

            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 500));

            // TODO: Reemplazar con llamada real al backend
            // const response = await axios.get('/api/orders');
            // set({ orders: response.data, isLoading: false });

            set({ orders: mockOrders, isLoading: false });
        } catch (error) {
            set({ error: error.message, isLoading: false });
        }
    },

    // Obtener pedido por ID
    getOrder: (orderId) => {
        const order = get().orders.find(o => o.id === orderId);
        if (order) {
            set({ selectedOrder: order });
            return order;
        }

        // Si no está en el store, buscar en mock data
        const mockOrder = getOrderById(orderId);
        if (mockOrder) {
            set({ selectedOrder: mockOrder });
            return mockOrder;
        }

        return null;
    },

    // Filtrar pedidos por estado
    getOrdersByStatus: (status) => {
        if (status === 'all') {
            return get().orders;
        }
        return get().orders.filter(order => order.status === status);
    },

    // Cancelar pedido
    cancelOrder: async (orderId) => {
        try {
            set({ isLoading: true, error: null });

            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 500));

            // TODO: Reemplazar con llamada real al backend
            // await axios.post(`/api/orders/${orderId}/cancel`);

            // Actualizar el estado local
            const orders = get().orders.map(order =>
                order.id === orderId
                    ? { ...order, status: 'cancelled' }
                    : order
            );

            set({ orders, isLoading: false });
            return { success: true };
        } catch (error) {
            set({ error: error.message, isLoading: false });
            return { success: false, message: error.message };
        }
    },

    // Limpiar pedido seleccionado
    clearSelectedOrder: () => {
        set({ selectedOrder: null });
    }
}));

export default useOrdersStore;
