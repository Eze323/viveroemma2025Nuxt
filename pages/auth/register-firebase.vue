<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900">Crear una cuenta</h2>
        <p class="mt-2 text-sm text-gray-600">
          Usa Firebase para registrarte. Requerirá aprobación del administrador.
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="registerWithFirebase">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Nombre Completo</label>
            <input id="name" v-model="form.name" name="name" type="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Nombre completo">
          </div>
          <div>
            <label for="email-address" class="sr-only">Correo electrónico</label>
            <input id="email-address" v-model="form.email" name="email" type="email" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Correo electrónico">
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input id="password" v-model="form.password" name="password" type="password" required class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm" placeholder="Contraseña">
          </div>
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors">
            <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <Icon name="heroicons:arrow-path" class="h-5 w-5 text-green-500 animate-spin" />
            </span>
            Registrarse
          </button>
        </div>
      </form>

      <div v-if="error" class="mt-4 text-center text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
        {{ error }}
      </div>

      <div v-if="success" class="mt-4 text-center text-sm text-green-600 bg-green-50 p-4 rounded border border-green-200">
        <Icon name="heroicons:check-circle" class="w-8 h-8 mx-auto mb-2" />
        <p class="font-bold">¡Registro exitoso!</p>
        <p>{{ success }}</p>
        <NuxtLink to="/auth/login-firebase" class="mt-4 block font-medium underline">Ir al inicio de sesión</NuxtLink>
      </div>

      <div class="text-center mt-6">
        <NuxtLink to="/auth/login-firebase" class="text-sm font-medium text-green-600 hover:text-green-500 transition-colors">
          ¿Ya tienes una cuenta? Inicia sesión
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createUserWithEmailAndPassword } from 'firebase/auth';

const { $firebaseAuth } = useNuxtApp();
const loading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

const form = reactive({
  name: '',
  email: '',
  password: '',
});

const registerWithFirebase = async () => {
  loading.value = true;
  error.value = null;
  success.value = null;

  try {
    // 1. Create user in Firebase
    const userCredential = await createUserWithEmailAndPassword(
        $firebaseAuth as any, 
        form.email, 
        form.password
    );
    
    // 2. Get the ID token
    const idToken = await userCredential.user.getIdToken();

    // 3. Register in our local database via the new API
    const response = await $fetch('/api/auth/register-firebase', {
      method: 'POST',
      body: {
        idToken,
        name: form.name,
      },
    });

    if (response.success) {
      success.value = response.message || 'Tu registro ha sido enviado para aprobación.';
      // Reset form
      form.name = '';
      form.email = '';
      form.password = '';
    }
  } catch (err: any) {
    console.error('Registration Error:', err);
    error.value = err.statusMessage || err.message || 'Ocurrió un error inesperado durante el registro.';
  } finally {
    loading.value = false;
  }
};
</script>
