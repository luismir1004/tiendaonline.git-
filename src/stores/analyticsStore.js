import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      events: [],
      abTests: {}, // { testId: 'variantA' | 'variantB' }
      referralId: null,

      // Register an event (click, view, conversion)
      trackEvent: (eventName, data = {}) => {
        console.log(`[Analytics] ${eventName}`, data);
        set((state) => ({
          events: [...state.events, { event: eventName, data, timestamp: Date.now() }]
        }));
      },

      // Assign a variant for a specific test if not already assigned
      getVariant: (testId) => {
        const state = get();
        if (state.abTests[testId]) {
          return state.abTests[testId];
        }

        // Randomly assign A or B (50/50 split)
        const variant = Math.random() < 0.5 ? 'A' : 'B';
        set((state) => ({
          abTests: { ...state.abTests, [testId]: variant }
        }));
        return variant;
      },

      setReferral: (refId) => set({ referralId: refId }),
    }),
    {
      name: 'analytics-storage',
      partialize: (state) => ({ abTests: state.abTests, referralId: state.referralId }),
    }
  )
);

export default useAnalyticsStore;
