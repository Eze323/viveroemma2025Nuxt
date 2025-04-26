import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isEncargado: (state) => state.user?.role === 'encargado',
    isEmpleado: (state) => state.user?.role === 'empleado'
  },
  
  actions: {
    async login(email, password) {
      this.loading = true;
      this.error = null;
      
      try {
        // Temporary admin login for development
        if (process.dev && email === 'admin@example.com' && password === 'password') {
          const tempAdminData = {
            token: 'temp-admin-token',
            user: {
              id: 1,
              email: 'admin@example.com',
              name: 'Admin User',
              role: 'admin'
            }
          };
          
          this.token = tempAdminData.token;
          this.user = tempAdminData.user;
          
          localStorage.setItem('token', tempAdminData.token);
          return tempAdminData;
        }

        // Regular login flow
        const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/login`, {
          method: 'POST',
          body: { email, password }
        });
        
        this.token = response.token;
        this.user = response.user;
        
        localStorage.setItem('token', response.token);
        return response;
      } catch (error) {
        this.error = error.message || 'Error al iniciar sesión';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async register(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/register`, {
          method: 'POST',
          body: userData
        });
        
        this.token = response.token;
        this.user = response.user;
        
        localStorage.setItem('token', response.token);
        
        return response;
      } catch (error) {
        this.error = error.message || 'Error al registrarse';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async logout() {
      this.loading = true;
      
      try {
        await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
      } catch (error) {
        console.error('Error durante el cierre de sesión:', error);
      } finally {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        this.loading = false;
      }
    },
    
    async fetchUser() {
      this.loading = true;
      
      try {
        const response = await $fetch(`${useRuntimeConfig().public.apiBaseUrl}/user`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        
        this.user = response.user;
        return response;
      } catch (error) {
        this.error = error.message || 'Error al obtener datos del usuario';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    init() {
      const token = localStorage.getItem('token');
      
      if (token) {
        this.token = token;
        this.fetchUser().catch(() => {
          this.token = null;
          this.user = null;
          localStorage.removeItem('token');
        });
      }
    }
  }
});