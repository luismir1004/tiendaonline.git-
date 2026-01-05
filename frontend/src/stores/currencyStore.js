import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const EXCHANGE_RATES = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  MXN: 17.05,
};

const LOCALES = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  MXN: 'es-MX',
};

const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currency: 'USD',
      language: 'EN',
      
      setCurrency: (currency) => {
        if (EXCHANGE_RATES[currency]) {
          set({ currency });
        }
      },
      
      setLanguage: (language) => set({ language }),

      // Helper to get raw converted value
      convertPrice: (amountInUSD) => {
        const { currency } = get();
        const rate = EXCHANGE_RATES[currency] || 1.0;
        return amountInUSD * rate;
      },

      // Helper to get formatted string
      formatPrice: (amountInUSD) => {
        const { currency } = get();
        const rate = EXCHANGE_RATES[currency] || 1.0;
        const convertedAmount = amountInUSD * rate;
        const locale = LOCALES[currency] || 'en-US';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(convertedAmount);
      }
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({ 
        currency: state.currency,
        language: state.language 
      }),
    }
  )
);

export default useCurrencyStore;