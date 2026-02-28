// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, useNuxtApp, navigateTo } from '#imports';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { pinia } = useNuxtApp();
  const authStore = useAuthStore(pinia as import('pinia').Pinia);

  if (import.meta.server) {
    //console.log('Middleware ejecutado en servidor, omitiendo');
    return;
  }

  /* console.log('Middleware ejecutado en cliente, estado:', {
    path: to.path,
    isAuthenticated: authStore.isAuthenticated,
    token: authStore.token,
    user: authStore.user,
  }); */

  const secretKey = 'emma2025'; // Clave para testers
  const testerCookie = useCookie('tester_access');

  // Si viene con la llave secreta en la URL, le damos acceso
  if (to.query.access === secretKey) {
    testerCookie.value = 'granted';
  }

  const publicRoutes = ['/', '/productos', '/nosotros', '/contacto', '/servicios'];
  const isAuthRoute = to.path.startsWith('/auth');
  const requiresAuth = to.path.startsWith('/admin');

  // Bloqueo total si no es tester y no está autenticado
  if ((isAuthRoute || requiresAuth) && !authStore.isAuthenticated && testerCookie.value !== 'granted') {
    return navigateTo('/');
  }

  // Evitar redirección infinita durante el login
  if (to.path === '/auth/login' && !authStore.isAuthenticated) {
    return;
  }

  if (requiresAuth && !authStore.isAuthenticated) {
    return navigateTo('/', { redirectCode: 302 });
  }

  if (authStore.isAuthenticated && to.path === '/') {
    const redirectPath = authStore.isAdmin ? '/admin' : '/dashboard';
    return navigateTo(redirectPath, { redirectCode: 302 });
  }
});