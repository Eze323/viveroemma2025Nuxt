// plugins/auth.ts
import { defineNuxtPlugin } from '#app';
import { useAuthStore } from '~/stores/auth';

import type { Pinia } from 'pinia';

export default defineNuxtPlugin((nuxtApp) => {
//  console.log('Plugin auth inicializado, entorno:', import.meta.client ? 'cliente' : 'servidor');
  const authStore = useAuthStore(nuxtApp.pinia as Pinia);
  authStore.init();
});