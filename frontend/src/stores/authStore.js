import { create } from 'zustand';
import axios from 'axios';

// Configuración de Axios para Auth (Cookies)
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Importante para que Payload maneje las cookies de sesión
  headers: {
    'Content-Type': 'application/json',
  },
});

const useAuthStore = create((set, get) => ({
  user: null, // Renombrado de currentUser a user para consistencia
  isAuthenticated: false,
  isLoading: true, // Para el chequeo inicial al cargar la app

  // Verificar sesión actual (Persistencia)
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const { data } = await api.get('/users/me');
      if (data?.user) {
        set({ user: data.user, isAuthenticated: true });
      } else {
        set({ user: null, isAuthenticated: false });
      }
    } catch (error) {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  // Iniciar Sesión
  login: async (email, password) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      if (data?.user) {
        set({ user: data.user, isAuthenticated: true });
        return { success: true };
      }
      return { success: false, message: 'Respuesta inesperada del servidor' };
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.errors?.[0]?.message || 'Credenciales inválidas';
      return { success: false, message };
    }
  },

  // Registrarse
  register: async (name, email, password) => {
    try {
      // 1. Crear usuario
      // Payload por defecto usa 'email' y 'password'. 'name' debe ser un campo en la colección Users.
      const { data } = await api.post('/users', {
        email,
        password,
        name: name // Asegúrate de que tu colección Users tenga este campo
      });

      if (data?.doc) {
        // 2. Auto-login después del registro (Payload no siempre loguea automáticamente al crear)
        return get().login(email, password);
      }
      return { success: false, message: 'No se pudo crear el usuario' };
    } catch (error) {
      console.error("Register error:", error);
      const message = error.response?.data?.errors?.[0]?.message || 'Error al registrar usuario';
      return { success: false, message };
    }
  },

  // Cerrar Sesión
  logout: async () => {
    try {
      await api.post('/users/logout');
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Error cerrando sesión', error);
      // Forzar limpieza local aunque falle el server
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;