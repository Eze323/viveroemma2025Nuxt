export default defineNuxtPlugin(nuxtApp => {
  const authStore = useAuthStore();
  
  // Initialize auth from localStorage on client-side
  if (process.client) {
    authStore.init();
  }
});