import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import { getProductsByIds } from '../services/productService'; // Import to fetch bundle items

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      
      addToCart: (product, quantityToAdd = 1, options = { openDrawer: true }) => {
        set((state) => {
          const existingProductIndex = state.cart.findIndex((item) => item.id === product.id);
          const currentQuantityInCart = existingProductIndex !== -1 ? state.cart[existingProductIndex].quantity : 0;
          const availableStock = product.stock || Infinity; // Assume infinite if stock not specified

          if (availableStock === 0) {
            toast.error(`¡${product.name} (${product.variantName || product.id}) está agotado!`);
            return { ...state }; // No change
          }

          if (currentQuantityInCart + quantityToAdd > availableStock) {
            toast.error(`Solo quedan ${availableStock} unidades de ${product.name} (${product.variantName || product.id}). No se puede añadir la cantidad solicitada.`);
            return { ...state }; // No change
          }

          if (existingProductIndex !== -1) {
            toast.success(`Se añadió otro ${product.name} al carrito`);
            const updatedCart = state.cart.map((item, index) =>
              index === existingProductIndex ? { ...item, quantity: item.quantity + quantityToAdd } : item
            );
            return {
              cart: updatedCart,
              isCartOpen: options.openDrawer ? true : state.isCartOpen,
            };
          } else {
            toast.success(`${product.name} añadido al carrito`);
            return { 
              cart: [...state.cart, { ...product, quantity: quantityToAdd }],
              isCartOpen: options.openDrawer ? true : state.isCartOpen,
            };
          }
        });
      },

      addBundleToCart: async (bundle) => {
        const { id, name, items, discountPercentage } = bundle;
        const productsInBundle = await getProductsByIds(items.map(item => item.productId));

        set((state) => {
          let newCart = [...state.cart];
          let bundleTotalOriginalPrice = 0;
          let bundleTotalDiscountedPrice = 0;
          
          const bundleItemsForCart = [];

          for (const bundleItem of items) {
            const product = productsInBundle.find(p => p.id === bundleItem.productId);
            if (!product) {
              console.warn(`Producto con ID ${bundleItem.productId} no encontrado para el bundle.`);
              toast.error(`Error al añadir el bundle "${name}". Producto no encontrado.`);
              return state;
            }

            const variant = product.variants?.find(v => v.id === bundleItem.variantId) || product.variants?.[0];
            const itemPrice = product.price + (variant?.priceModifier || 0);
            const quantity = bundleItem.quantity || 1;
            const availableStock = variant?.stock || product.stock || Infinity;

            const existingCartItem = newCart.find(cartItem => cartItem.originalId === product.id && cartItem.variantId === variant?.id);
            const currentQuantityInCart = existingCartItem ? existingCartItem.quantity : 0;

            if (availableStock === 0 || (currentQuantityInCart + quantity > availableStock)) {
              const productNameWithVariant = `${product.name} (${variant?.name || 'Base'})`;
              toast.error(`No hay suficiente stock para "${productNameWithVariant}" en el bundle "${name}".`);
              return state; // Prevent adding bundle if any item is out of stock or exceeds stock
            }

            bundleTotalOriginalPrice += itemPrice * quantity;
            const discountedItemPrice = itemPrice * (1 - discountPercentage / 100);
            bundleTotalDiscountedPrice += discountedItemPrice * quantity;

            bundleItemsForCart.push({
              ...product,
              id: `${product.id}-${variant?.id || 'base'}-bundle-${bundle.id}`, // Unique ID for bundled item
              originalId: product.id,
              variantId: variant?.id,
              variantName: variant?.name,
              price: discountedItemPrice, // Store the discounted price
              originalItemPrice: itemPrice, // Store original item price for display
              quantity: quantity,
              isBundled: true,
              bundleId: bundle.id,
              bundleName: bundle.name,
            });
          }

          // Add all bundle items to cart
          bundleItemsForCart.forEach(item => {
            const existingIndex = newCart.findIndex(cartItem => cartItem.id === item.id);
            if (existingIndex !== -1) {
              newCart[existingIndex].quantity += item.quantity;
            } else {
              newCart.push(item);
            }
          });

          toast.success(`¡Bundle "${name}" añadido al carrito con un ${discountPercentage}% de descuento!`);
          return {
            cart: newCart,
            isCartOpen: true,
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
        toast.error('Producto eliminado del carrito');
      },

      increaseQuantity: (productId) => {
        set((state) => {
          const productInCart = state.cart.find((item) => item.id === productId);
          if (productInCart) {
            const availableStock = productInCart.stock || Infinity;
            if (productInCart.quantity + 1 > availableStock) {
              toast.error(`Máximo stock alcanzado para ${productInCart.name} (${productInCart.variantName || productInCart.id})`);
              return { ...state };
            }
          }

          return {
            cart: state.cart.map((item) =>
              item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        });
      },

      decreaseQuantity: (productId) => {
        set((state) => {
          const product = state.cart.find((item) => item.id === productId);
          if (product && product.quantity > 1) {
            return {
              cart: state.cart.map((item) =>
                item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
              ),
            };
          } else {
            return { cart: state.cart.filter((item) => item.id !== productId) }; // Remove if quantity becomes 0
          }
        });
      },

      clearCart: () => set({ cart: [] }),
      
      getCartTotal: () => {
        const state = get();
        return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getCartCount: () => {
        const state = get();
        return state.cart.reduce((total, item) => total + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);

export default useCartStore;