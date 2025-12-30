import { mockData } from '../data/mockData';

// Enhanced mock data logic or getters could go here if we wanted to dynamically generate stock
// For now, we assume mockData in ../data/mockData has the necessary structure (variants with stock)

export const getProducts = async () => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockData;
};

export const getProductById = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockData.find((product) => product.id === id);
};

export const getProductsByIds = async (ids) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockData.filter(product => ids.includes(product.id));
};

export const getBundlesForProduct = async (productId) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const allBundles = [
    {
      id: 'bundle-1',
      name: 'Auriculares + Estuche',
      discountPercentage: 10,
      items: [
        { productId: 1, variantId: 'v1', quantity: 1 }, // Assuming ID 1 is the main product
        { productId: 2, variantId: 'v1', quantity: 1 }, 
      ],
      mainProductId: 1
    },
    {
      id: 'bundle-2',
      name: 'iPad Air + Teclado',
      discountPercentage: 15,
      items: [
        { productId: 1, variantId: 'v1', quantity: 1 }, 
        { productId: 8, variantId: 'v1', quantity: 1 }, 
      ],
      mainProductId: 1
    },
    // Add more bundles as needed for other products
     {
      id: 'bundle-3',
      name: 'Setup Completo',
      discountPercentage: 20,
      items: [
        { productId: 2, variantId: 'v1', quantity: 1 }, 
        { productId: 3, variantId: 'v1', quantity: 1 }, 
      ],
      mainProductId: 2
    },
  ];

  return allBundles.filter(b => b.mainProductId === Number(productId) || b.items.some(item => item.productId === Number(productId)));
};
