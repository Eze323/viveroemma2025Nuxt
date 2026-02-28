<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-poppins">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 animate-fade-in">Iniciar Sesión</h2>
        <p class="mt-2 text-sm text-gray-600">Accede a tu cuenta de Vivero Emma</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="loginWithFirebase">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email-address" class="sr-only">Correo electrónico</label>
            <input id="email-address" v-model="form.email" name="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Correo electrónico">
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input id="password" v-model="form.password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Contraseña">
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors shadow-md active:scale-95">
            <span v-if="loading" class="mr-2">
              <Icon name="heroicons:arrow-path" class="h-4 w-4 animate-spin" />
            </span>
            Entrar
          </button>
        </div>
      </form>

      <div v-if="error" class="mt-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">
        <div class="flex items-center gap-2">
          <Icon name="heroicons:exclamation-circle" class="w-5 h-5 flex-shrink-0" />
          <span>{{ error }}</span>
        </div>
      </div>

      <div class="text-center mt-6">
        <NuxtLink to="/auth/register-firebase" class="text-sm font-medium text-green-600 hover:text-green-500 transition-colors underline">
          ¿No tienes una cuenta? Regístrate aquí
        </NuxtLink>
      </div>

      <div class="text-center mt-2">
        <NuxtLink to="/auth/login" class="text-xs text-gray-500 hover:text-gray-700 transition-colors underline">
          Usar correo y contraseña tradicional
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { signInWithEmailAndPassword } from 'firebase/auth';
const { $firebaseAuth } = useNuxtApp();
const authStore = useAuthStore(); // Assuming they have a store to manage auth state

const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  email: '',
  password: '',
});

const loginWithFirebase = async () => {
    loading.value = true;
    error.value = null;

    try {
        // 1. Authenticate with Firebase on the client
        console.log("Intentando login con:", form.email, form.password);
        const userCredential = await signInWithEmailAndPassword(
            $firebaseAuth as any,
            form.email,
            form.password
        );

        // 2. Get ID token
        const idToken = await userCredential.user.getIdToken();

        // 3. Send token to our backend for status verification and local login
        const response = await $fetch('/api/auth/login-firebase', {
            method: 'POST',
            body: { idToken },
        });

        // 4. Update local state and redirect
        await authStore.loginSuccess(response.user as any, response.token);
        
        // Final redirection based on role
        if (authStore.isAdmin || authStore.isEncargado) {
          navigateTo('/admin');
        } else if (authStore.isCanastero) {
          navigateTo('/canasteros');
        } else {
          navigateTo('/');
        }

    } catch (err: any) {
        console.error('Login Error:', err);
        // Firebase specific errors or our backend errors
        if (err.data?.statusMessage) {
            error.value = err.data.statusMessage;
        } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
            error.value = 'Correo o contraseña incorrectos.';
        } else if (err.code === 'auth/too-many-requests') {
            error.value = 'Demasiados intentos fallidos. Intenta más tarde.';
        } else {
            error.value = err.message || 'Error al iniciar sesión.';
        }
    } finally {
        loading.value = false;
    }
}
</script>
