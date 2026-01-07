// Mock Orders Data para desarrollo
// Simula pedidos de un usuario con diferentes estados

export const mockOrders = [
    {
        id: 'ORD-2024-001',
        date: '2024-01-05T10:30:00Z',
        status: 'delivered',
        total: 2548.00,
        items: [
            {
                id: 1,
                name: 'Samsung Galaxy S24 Ultra',
                price: 899.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=75&w=200'
            },
            {
                id: 2,
                name: 'MacBook Air M3',
                price: 1499.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=75&w=200'
            },
            {
                id: 3,
                name: 'AirPods Pro 2',
                price: 249.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?auto=format&fit=crop&q=75&w=200'
            }
        ],
        shipping: {
            method: 'Express',
            cost: 15.00,
            address: 'Calle Principal 123, Madrid, España'
        },
        tracking: {
            number: 'TRK-2024-001-ES',
            carrier: 'DHL Express',
            url: 'https://www.dhl.com/tracking'
        },
        timeline: [
            { status: 'placed', date: '2024-01-05T10:30:00Z', description: 'Pedido realizado' },
            { status: 'confirmed', date: '2024-01-05T11:00:00Z', description: 'Pedido confirmado' },
            { status: 'shipped', date: '2024-01-06T09:00:00Z', description: 'Pedido enviado' },
            { status: 'delivered', date: '2024-01-07T14:30:00Z', description: 'Pedido entregado' }
        ]
    },
    {
        id: 'ORD-2024-002',
        date: '2024-01-06T15:45:00Z',
        status: 'shipped',
        total: 848.00,
        items: [
            {
                id: 1,
                name: 'Sony WH-1000XM5',
                price: 349.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=75&w=200'
            },
            {
                id: 2,
                name: 'PlayStation 5',
                price: 499.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=75&w=200'
            }
        ],
        shipping: {
            method: 'Standard',
            cost: 8.00,
            address: 'Av. Libertador 456, Barcelona, España'
        },
        tracking: {
            number: 'TRK-2024-002-ES',
            carrier: 'Correos Express',
            url: 'https://www.correos.es/tracking'
        },
        timeline: [
            { status: 'placed', date: '2024-01-06T15:45:00Z', description: 'Pedido realizado' },
            { status: 'confirmed', date: '2024-01-06T16:00:00Z', description: 'Pedido confirmado' },
            { status: 'shipped', date: '2024-01-07T10:00:00Z', description: 'Pedido enviado' }
        ]
    },
    {
        id: 'ORD-2024-003',
        date: '2024-01-07T09:20:00Z',
        status: 'processing',
        total: 608.00,
        items: [
            {
                id: 1,
                name: 'Nintendo Switch OLED',
                price: 359.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=75&w=200'
            },
            {
                id: 2,
                name: 'AirPods Pro 2',
                price: 249.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?auto=format&fit=crop&q=75&w=200'
            }
        ],
        shipping: {
            method: 'Standard',
            cost: 8.00,
            address: 'Calle Principal 123, Madrid, España'
        },
        timeline: [
            { status: 'placed', date: '2024-01-07T09:20:00Z', description: 'Pedido realizado' },
            { status: 'confirmed', date: '2024-01-07T09:30:00Z', description: 'Pedido confirmado' }
        ]
    },
    {
        id: 'ORD-2023-045',
        date: '2023-12-20T14:15:00Z',
        status: 'delivered',
        total: 1199.00,
        items: [
            {
                id: 1,
                name: 'iPhone 15 Pro Max',
                price: 1199.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=75&w=200'
            }
        ],
        shipping: {
            method: 'Express',
            cost: 15.00,
            address: 'Calle Principal 123, Madrid, España'
        },
        tracking: {
            number: 'TRK-2023-045-ES',
            carrier: 'DHL Express',
            url: 'https://www.dhl.com/tracking'
        },
        timeline: [
            { status: 'placed', date: '2023-12-20T14:15:00Z', description: 'Pedido realizado' },
            { status: 'confirmed', date: '2023-12-20T15:00:00Z', description: 'Pedido confirmado' },
            { status: 'shipped', date: '2023-12-21T09:00:00Z', description: 'Pedido enviado' },
            { status: 'delivered', date: '2023-12-22T11:30:00Z', description: 'Pedido entregado' }
        ]
    },
    {
        id: 'ORD-2023-032',
        date: '2023-11-15T16:30:00Z',
        status: 'cancelled',
        total: 2899.00,
        items: [
            {
                id: 1,
                name: 'Razer Blade 16',
                price: 2899.00,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?auto=format&fit=crop&q=75&w=200'
            }
        ],
        shipping: {
            method: 'Express',
            cost: 15.00,
            address: 'Av. Libertador 456, Barcelona, España'
        },
        timeline: [
            { status: 'placed', date: '2023-11-15T16:30:00Z', description: 'Pedido realizado' },
            { status: 'cancelled', date: '2023-11-15T18:00:00Z', description: 'Pedido cancelado por el usuario' }
        ]
    }
];

// Función helper para obtener pedidos por estado
export const getOrdersByStatus = (status) => {
    if (status === 'all') return mockOrders;
    return mockOrders.filter(order => order.status === status);
};

// Función helper para obtener un pedido por ID
export const getOrderById = (id) => {
    return mockOrders.find(order => order.id === id);
};

// Estados disponibles con sus traducciones y colores
export const ORDER_STATUSES = {
    processing: {
        label: 'Procesando',
        color: 'bg-blue-100 text-blue-700',
        icon: '⏳'
    },
    shipped: {
        label: 'Enviado',
        color: 'bg-purple-100 text-purple-700',
        icon: '📦'
    },
    delivered: {
        label: 'Entregado',
        color: 'bg-green-100 text-green-700',
        icon: '✓'
    },
    cancelled: {
        label: 'Cancelado',
        color: 'bg-red-100 text-red-700',
        icon: '✕'
    }
};
