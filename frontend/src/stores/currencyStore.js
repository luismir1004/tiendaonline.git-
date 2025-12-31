import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCurrencyStore = create(
  persist(
    (set) => ({
      currency: 'USD',
      language: 'EN',
      exchangeRates: {
        USD: 1,
        EUR: 0.92, // Example rate
      },

      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
      
      formatPrice: (priceInUSD) => {
        // This is a helper, but might be better placed in a utility if used widely outside components
        // For now, we keep logic simple here or let components access state
        return priceInUSD; 
      }
    }),
    {
      name: 'currency-storage',
    }
  )
);

export default useCurrencyStore;
