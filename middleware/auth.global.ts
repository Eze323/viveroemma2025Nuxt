// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from '#imports';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { pinia } = useNuxtApp();
  const authStore = useAuthStore(pinia as import('pinia').Pinia);

  // Si se ejecuta en el servidor, no hacemos nada
  if (import.meta.server) {
    return;
  }

  // 1. IMPORTANTE: Cambiamos '/login' por '/auth/login' que es tu ruta real
  const publicRoutes = ['/', '/auth/login', '/productos', '/nosotros', '/contacto', '/servicios'];
  const requiresAuth = to.path.startsWith('/admin');

  // Evitar que el middleware rebote al usuario cuando intenta entrar a la pantalla de login
  if (to.path === '/auth/login' && !authStore.isAuthenticated) {
    return;
  }

  // 2. Si quiere entrar a una ruta protegida (/admin) y NO está logueado,
  // lo mandamos derecho al login para que pueda poner sus datos, en vez de patearlo al inicio
  if (requiresAuth && !authStore.isAuthenticated) {
    return navigateTo('/auth/login', { redirectCode: 302 });
  }

  // Si ya está autenticado y va a la raíz, lo mandamos a su panel
  if (authStore.isAuthenticated && to.path === '/') {
    const redirectPath = authStore.isAdmin ? '/admin' : '/dashboard';
    return navigateTo(redirectPath, { redirectCode: 302 });
  }

  // Si es cualquiera de las rutas públicas, lo dejamos pasar libremente
  if (publicRoutes.includes(to.path)) {
    return;
  }
});