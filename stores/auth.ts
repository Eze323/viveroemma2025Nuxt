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
    isAuthenticated: (state): boolean => !!state.token,
    isAdmin: (state): boolean => state.user?.role === 'admin',
    isEncargado: (state): boolean => state.user?.role === 'encargado',
    isEmpleado: (state): boolean => state.user?.role === 'empleado',
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      const tokenCookie = useCookie('token');

      try {
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password },
        });

        const { user, token } = response as { user: User; token: string };

        this.token = token;
        this.user = user;
        tokenCookie.value = token;

        return response;
      } catch (error: any) {
        this.error = error.data?.statusMessage || 'Credenciales incorrectas';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      const tokenCookie = useCookie('token');
      try {
        await $fetch('/api/auth/logout', { method: 'POST' });
      } catch (error) {
        console.error('Error logging out:', error);
      } finally {
        this.resetState();
        tokenCookie.value = null;
      }
    },

    async refreshSession() {
      const tokenCookie = useCookie('token');
      try {
        const response = await $fetch('/api/auth/refresh', { method: 'POST' });
        const { user, token } = response as { user: User; token: string };

        this.token = token;
        this.user = user;
        tokenCookie.value = token;

        return true;
      } catch (error) {
        this.resetState();
        tokenCookie.value = null;
        return false;
      }
    },

    async fetchUser() {
      if (!this.token) return;

      try {
        const response = await $fetch('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });
        this.user = response as User;
      } catch (error: any) {
        if (error.statusCode === 401) {
          const refreshed = await this.refreshSession();
          if (!refreshed) throw error;
        } else {
          throw error;
        }
      }
    },

    async init() {
      const tokenCookie = useCookie('token');

      if (tokenCookie.value) {
        this.token = tokenCookie.value;
        try {
          await this.fetchUser();
        } catch (e) {
          await this.refreshSession();
        }
      } else {
        await this.refreshSession();
      }
    },

    resetState() {
      this.token = null;
      this.user = null;
      this.loading = false;
      this.error = null;
    }
  },
});