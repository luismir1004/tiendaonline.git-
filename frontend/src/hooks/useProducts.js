import { useQuery } from '@tanstack/react-query';
import { getProducts, getProductBySlug } from '../services/productService';

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(),
    select: (data) => data.docs, // Flatten the response to just the array
    staleTime: 1000 * 60 * 5,
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
  });
};
