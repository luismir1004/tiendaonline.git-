import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProductsByIds } from '../services/productService';
import useCartStore from '../stores/cartStore';
import useCurrency from '../hooks/useCurrency';
import { ShoppingCart, PlusCircle, CheckCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const ProductBundle = ({ bundle }) => {
  const addBundleToCart = useCartStore((state) => state.addBundleToCart);
  const { convertPrice, getCurrencySymbol } = useCurrency();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch details for all products in the bundle
  const productIds = bundle.items.map(item => item.productId);
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['bundleProducts', bundle.id],
    queryFn: () => getProductsByIds(productIds),
    enabled: !!bundle.items.length, // Only run query if there are items
  });

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 animate-pulse">
        <div className="h-6 w-2/3 bg-slate-200 rounded mb-4"></div>
        <div className="flex items-center space-x-4 mb-4">
          <div className="h-20 w-20 bg-slate-200 rounded-lg"></div>
          <div className="h-px w-8 bg-slate-300"></div>
          <div className="h-20 w-20 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-8 w-1/2 bg-slate-200 rounded mb-4"></div>
        <div className="h-12 w-full bg-slate-200 rounded-full"></div>
      </div>
    );
  }

  if (isError || !products || products.length === 0) {
    return (
      <div className="bg-red-50 p-6 rounded-3xl shadow-sm border border-red-200 text-red-700">
        <p className="font-semibold">Error al cargar el bundle "{bundle.name}".</p>
        <p className="text-sm">Por favor, inténtalo de nuevo más tarde.</p>
      </div>
    );
  }

  const handleAddBundleToCart = async () => {
    setIsAddingToCart(true);
    await addBundleToCart(bundle);
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 2000); // Reset state after a delay
  };

  // Calculate original total price and discounted total price
  let originalTotalPrice = 0;
  products.forEach(product => {
    const bundleItem = bundle.items.find(item => item.productId === product.id);
    if (bundleItem) {
      const variant = product.variants?.find(v => v.id === bundleItem.variantId) || product.variants?.[0];
      const itemPrice = product.price + (variant?.priceModifier || 0);
      originalTotalPrice += itemPrice * (bundleItem.quantity || 1);
    }
  });

  const discountedTotalPrice = originalTotalPrice * (1 - bundle.discountPercentage / 100);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <PlusCircle size={24} className="text-indigo-500" />
        <span className="text-lg">Frecuentemente comprados juntos</span>
      </h3>
      <div className="flex items-center justify-center space-x-4 mb-4">
        {products.map((product, index) => (
          <React.Fragment key={product.id}>
            <div className="flex flex-col items-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-20 object-cover rounded-lg shadow-md"
              />
              <p className="text-xs text-center font-medium mt-1 truncate w-20">{product.name}</p>
            </div>
            {index < products.length - 1 && (
              <span className="text-slate-400 text-2xl font-light">+</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="text-center mb-6">
        <p className="text-sm text-slate-500 line-through">
          {getCurrencySymbol()} {convertPrice(originalTotalPrice).toFixed(2)}
        </p>
        <p className="text-3xl font-bold text-indigo-600">
          {getCurrencySymbol()} {convertPrice(discountedTotalPrice).toFixed(2)}
          <span className="ml-2 text-sm text-green-600 font-semibold">
            {bundle.discountPercentage}% OFF
          </span>
        </p>
      </div>
      <motion.button
        onClick={handleAddBundleToCart}
        disabled={isAddingToCart}
        initial={{ scale: 1 }}
        animate={isAddingToCart ? { scale: [1, 1.02, 1], backgroundColor: ["#4f46e5", "#22c55e", "#4f46e5"] } : { scale: 1, backgroundColor: "#4f46e5" }}
        transition={{ duration: 0.5 }}
        className="w-full flex items-center justify-center bg-indigo-600 text-white py-3 px-4 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-md"
      >
        {isAddingToCart ? (
          <>
            <CheckCircle className="mr-2" size={20} />
            ¡Añadido!
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2" size={20} />
            Añadir bundle al carrito
          </>
        )}
      </motion.button>
    </div>
  );
};

export default ProductBundle;