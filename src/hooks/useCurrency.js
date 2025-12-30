import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useCallback } from 'react';

// Define available currencies and their exchange rates relative to USD (base currency)
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

const CURRENCY_OPTIONS = Object.keys(EXCHANGE_RATES);

// Zustand store for currency
const useCurrencyStore = create(
  persist(
    (set, get) => ({
      currentCurrency: 'USD', // Default currency
      
      setCurrency: (currency) => {
        if (CURRENCY_OPTIONS.includes(currency)) {
          set({ currentCurrency: currency });
        } else {
          console.warn(`Unsupported currency: ${currency}`);
        }
      },

      convertPrice: (amountInUSD) => {
        const { currentCurrency } = get();
        const rate = EXCHANGE_RATES[currentCurrency] || 1.0;
        return (amountInUSD * rate);
      },

      formatPrice: (amountInUSD) => {
          const { currentCurrency } = get();
          const rate = EXCHANGE_RATES[currentCurrency] || 1.0;
          const convertedAmount = amountInUSD * rate;
          const locale = LOCALES[currentCurrency] || 'en-US';

          return new Intl.NumberFormat(locale, {
              style: 'currency',
              currency: currentCurrency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
          }).format(convertedAmount);
      },
      
      getCurrencyOptions: () => CURRENCY_OPTIONS,
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({ currentCurrency: state.currentCurrency }),
    }
  )
);

// Hook to use currency functionality
const useCurrency = () => {
  const { currentCurrency, setCurrency, convertPrice, formatPrice, getCurrencyOptions } = useCurrencyStore();

  useEffect(() => {
    // Detect locale only if not set in storage (handled by persist middleware automatically usually, but good for first load)
    const state = useCurrencyStore.getState();
    // Logic to detect could go here if we wanted to override, but 'persist' handles restoration.
  }, []);

  return {
    currentCurrency,
    setCurrency,
    convertPrice,
    formatPrice,
    getCurrencyOptions,
  };
};

export default useCurrency;