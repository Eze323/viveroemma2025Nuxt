// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from '#imports';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { pinia } = useNuxtApp();
  const authStore = useAuthStore(pinia as import('pinia').Pinia);

  if (import.meta.server) {
   // console.log('Middleware ejecutado en servidor, omitiendo');
    return;
  }

  /*console.log('Middleware ejecutado en cliente, estado:', {
    path: to.path,
    isAuthenticated: authStore.isAuthenticated,
    token: authStore.token,
    user: authStore.user,
  });*/

  const publicRoutes = ['/', '/login', '/productos', '/nosotros', '/contacto', '/servicios'];
  const requiresAuth = to.path.startsWith('/admin');

  // Evitar redirección infinita durante el login
  if (to.path === '/login' && !authStore.isAuthenticated) {
   // console.log('Permitiendo acceso a /login');
    return;
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    //console.log('No autenticado, redirigiendo a /login');
    return navigateTo('/auth/login', { redirectCode: 302 });
  }

  if (authStore.isAuthenticated && to.path === '/auth/login') {
    const redirectPath = authStore.isAdmin ? '/admin' : '/dashboard';
    //console.log('Autenticado, redirigiendo a:', redirectPath);
    return navigateTo(redirectPath, { redirectCode: 302 });
  }

  if (publicRoutes.includes(to.path)) {
    //console.log('Ruta pública, permitiendo acceso:', to.path);
    return;
  }
});