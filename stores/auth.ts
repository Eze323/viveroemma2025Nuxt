// stores/auth.ts
import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'encargado' | 'empleado';
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {

  state: (): AuthState => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state): boolean => {
      console.log('isAuthenticated verificado:', {
        hasToken: !!state.token,
        token: state.token,
      });
      return !!state.token;
    },
    isAdmin: (state): boolean => {
      const isAdmin = state.user?.role === 'admin';
      console.log('isAdmin:', isAdmin, 'User:', state.user);
      return isAdmin;
    },
    isEncargado: (state): boolean => state.user?.role === 'encargado',
    isEmpleado: (state): boolean => state.user?.role === 'empleado',
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;

      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password },
        });

        console.log('Respuesta cruda de /api/auth/login:', JSON.stringify(response, null, 2));

        // Manejar diferentes estructuras de respuesta
        let user: User, token: string;
        if ('data' in response && response.data) {
          ({ user, token } = response.data as { user: User; token: string });
        } else {
          ({ user, token } = response as { user: User; token: string });
        }

        console.log('Datos procesados:', { user, token });

        const tokenCookie = useCookie('token');
        tokenCookie.value = token;
        this.token = token;
        this.user = user;

        return response;
      } catch (error: any) {
        this.error = error.data?.statusMessage || 'Error al iniciar sesión';
        console.error('Error en login:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;

      try {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
      } catch (error: any) {
        console.error('Error durante el cierre de sesión:', error);
      } finally {
        this.token = null;
        this.user = null;
        const tokenCookie = useCookie('token');
        tokenCookie.value = null;
        this.loading = false;
      }
    },

    async fetchUser() {
      this.loading = true;

      try {
        const response = await $fetch('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        this.user = response as User;
        //console.log('Usuario obtenido:', this.user);
        return response;
      } catch (error: any) {
        this.error = error.data?.statusMessage || 'Error al obtener datos del usuario';
        console.error('Error en fetchUser:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    init() {
      const tokenCookie = useCookie('token');
      if (tokenCookie.value) {
        this.token = tokenCookie.value;
        this.fetchUser().catch(() => {
          this.token = null;
          this.user = null;
          tokenCookie.value = null;
        });
      }
    },
  },
});