import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      currentUser: null,
      users: [], // Simulación de base de datos de usuarios

      login: (email, password) => {
        const users = get().users;
        const user = users.find((u) => u.email === email && u.password === password);

        if (user) {
          set({ isAuthenticated: true, currentUser: user });
          return { success: true };
        } else {
          return { success: false, message: 'Credenciales inválidas' };
        }
      },

      register: (name, email, password) => {
        const users = get().users;
        
        if (users.some((u) => u.email === email)) {
          return { success: false, message: 'El correo ya está registrado' };
        }

        const newUser = { id: Date.now(), name, email, password };
        set((state) => ({ 
          users: [...state.users, newUser],
          isAuthenticated: true,
          currentUser: newUser 
        }));
        
        return { success: true };
      },

      logout: () => set({ isAuthenticated: false, currentUser: null }),
    }),
    {
      name: 'auth-storage', // Nombre para localStorage
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        currentUser: state.currentUser,
        users: state.users // Persistimos los usuarios para que el registro funcione entre recargas
      }),
    }
  )
);

export default useAuthStore;