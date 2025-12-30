import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const MAX_COMPARE_ITEMS = 3; // Define a maximum number of items for comparison

const useCompareStore = create(
  persist(
    (set, get) => ({
      compareItems: [],
      isCompareBarOpen: false,

      // Adds a product to the comparison list
      addItem: (product) => {
        set((state) => {
          if (state.compareItems.some(item => item.id === product.id)) {
            toast.info(`"${product.name}" ya está en tu lista de comparación.`);
            return state;
          }
          if (state.compareItems.length >= MAX_COMPARE_ITEMS) {
            toast.error(`Solo puedes comparar hasta ${MAX_COMPARE_ITEMS} productos. Elimina uno para añadir otro.`);
            return state;
          }
          toast.success(`"${product.name}" añadido para comparar.`);
          return { 
            compareItems: [...state.compareItems, product],
            isCompareBarOpen: true,
          };
        });
      },

      // Removes a product from the comparison list
      removeItem: (productId) => {
        set((state) => {
          const updatedItems = state.compareItems.filter(item => item.id !== productId);
          if (updatedItems.length < state.compareItems.length) {
            toast.error('Producto eliminado de la comparación.');
          }
          return { 
            compareItems: updatedItems,
            isCompareBarOpen: updatedItems.length > 0, // Close bar if no items left
          };
        });
      },

      // Clears all items from the comparison list
      clearItems: () => {
        set({ compareItems: [], isCompareBarOpen: false });
        toast('Lista de comparación vaciada.', { icon: '🧹' });
      },

      // Toggles the visibility of the comparison bar
      toggleCompareBar: () => set((state) => ({ isCompareBarOpen: !state.isCompareBarOpen })),

      // Getter for the comparison items (optional, but good for clarity)
      getCompareItems: () => get().compareItems,
    }),
    {
      name: 'compare-storage', // unique name for localStorage
      partialize: (state) => ({ compareItems: state.compareItems }), // only persist the array
    }
  )
);

export default useCompareStore;