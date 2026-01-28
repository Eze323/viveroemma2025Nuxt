// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore();

    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
        // Redirect to login page
        console.log('No autenticado, redirigiendo a /Home');
        return navigateTo('/');
    }
});
