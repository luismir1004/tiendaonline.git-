import { create } from 'zustand';

const useUIStore = create((set) => ({
  isNavigating: false,
  startNavigation: () => set({ isNavigating: true }),
  endNavigation: () => set({ isNavigating: false }),
}));

export default useUIStore;