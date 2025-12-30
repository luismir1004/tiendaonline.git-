import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useHistoryStore = create(
  persist(
    (set, get) => ({
      history: [],
      
      addToHistory: (product) => set((state) => {
        // Evitar duplicados y mantener solo los últimos 20
        const filtered = state.history.filter((p) => p.id !== product.id);
        return { history: [product, ...filtered].slice(0, 20) };
      }),

      hasVisited: (productId) => {
        return get().history.some((p) => p.id === productId);
      },

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'history-storage', // localStorage key
    }
  )
);

export default useHistoryStore;