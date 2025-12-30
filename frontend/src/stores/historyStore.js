import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useHistoryStore = create(
  persist(
    (set, get) => ({
      history: [],

      addToHistory: (product) => {
        const state = get();
        // Evitar duplicados consecutivos y mantener solo los últimos 4
        const filteredHistory = state.history.filter((item) => item.id !== product.id);
        
        const newEntry = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image,
          category: product.category,
        };

        set({
          history: [newEntry, ...filteredHistory].slice(0, 4),
        });
      },

      hasVisited: (id) => {
        return get().history.some((item) => item.id === id);
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'view-history-storage', // Key in localStorage
    }
  )
);

export default useHistoryStore;
