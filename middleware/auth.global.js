export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  // Skip middleware if not client-side
  if (process.server) return;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/productos', '/nosotros', '/contacto', '/servicios'];
  
  // Check if route requires authentication
  const requiresAuth = to.path.startsWith('/admin');
  
  // If route requires auth and user is not authenticated, redirect to login
  if (requiresAuth && !authStore.isAuthenticated) {
    return navigateTo('/auth/login');
  }
  
  // If user is authenticated and trying to access login page, redirect to admin
  if (authStore.isAuthenticated && to.path === '/auth/login') {
    return navigateTo('/admin');
  }
});