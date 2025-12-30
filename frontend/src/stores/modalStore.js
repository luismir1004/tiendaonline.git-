import { create } from 'zustand';

const useModalStore = create((set) => ({
  isOpen: false,
  activeProduct: null,

  openModal: (product) => set({ isOpen: true, activeProduct: product }),
  
  closeModal: () => set({ isOpen: false, activeProduct: null }),
}));

export default useModalStore;