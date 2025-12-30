import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      wishlist: [],
      isWishlistOpen: false,

      openWishlist: () => set({ isWishlistOpen: true }),
      closeWishlist: () => set({ isWishlistOpen: false }),
      toggleWishlist: () => set((state) => ({ isWishlistOpen: !state.isWishlistOpen })),

      toggleItem: (product) => {
        const { wishlist } = get();
        const exists = wishlist.find((item) => item.id === product.id);

        if (exists) {
          set({ wishlist: wishlist.filter((item) => item.id !== product.id) });
          toast.success('Eliminado de favoritos');
        } else {
          set({ wishlist: [...wishlist, product] });
          toast.success('Añadido a favoritos');
        }
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },

      clearWishlist: () => set({ wishlist: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);

export default useWishlistStore;