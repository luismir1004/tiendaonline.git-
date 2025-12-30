import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async () => {
  const { data } = await api.get('/products');
  return data;
};

export const getProductBySlug = async (slug) => {
  const { data } = await api.get('/products', {
    params: {
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2, // Ensure we get related data like images
    },
  });
  return data.docs[0];
};

export default api;