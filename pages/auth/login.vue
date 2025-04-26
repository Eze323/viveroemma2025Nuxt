<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">
          Bienvenido a Vivero Emma
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Inicia sesión para acceder al panel de administración
        </p>
      </div>
      
      <div class="mt-8 bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Alert for errors -->
          <div v-if="authStore.error" class="bg-error/10 text-error p-3 rounded-md text-sm">
            {{ authStore.error }}
          </div>

          <!-- Development mode notice -->
          <div v-if="isDev" class="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
            Modo desarrollo: Use admin@example.com / password para acceder como administrador
          </div>
          
          <!-- Email field -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="input w-full"
                :class="{ 'border-error': errors.email }"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-error">{{ errors.email }}</p>
            </div>
          </div>
          
          <!-- Password field -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div class="mt-1 relative">
              <input
                id="password"
                v-model="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                class="input w-full pr-10"
                :class="{ 'border-error': errors.password }"
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-5 w-5" />
              </button>
              <p v-if="errors.password" class="mt-1 text-sm text-error">{{ errors.password }}</p>
            </div>
          </div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Recordarme
              </label>
            </div>
            
            <div class="text-sm">
              <a href="#" class="font-medium text-primary hover:text-primary-dark">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
          
          <!-- Submit button -->
          <div>
            <button
              type="submit"
              class="btn btn-primary w-full flex justify-center py-3"
              :disabled="authStore.loading"
            >
              <span v-if="!authStore.loading">Iniciar sesión</span>
              <div v-else class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

definePageMeta({
  layout: 'default'
});

const authStore = useAuthStore();
const router = useRouter();
const isDev = process.dev;

// Form data
const email = ref(isDev ? 'admin@example.com' : '');
const password = ref(isDev ? 'password' : '');
const rememberMe = ref(false);
const showPassword = ref(false);
const errors = reactive({
  email: '',
  password: ''
});

// Validate form
const validateForm = () => {
  let isValid = true;
  errors.email = '';
  errors.password = '';
  
  if (!email.value) {
    errors.email = 'El correo electrónico es requerido';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.email = 'El correo electrónico no es válido';
    isValid = false;
  }
  
  if (!password.value) {
    errors.password = 'La contraseña es requerida';
    isValid = false;
  } else if (password.value.length < 6) {
    errors.password = 'La contraseña debe tener al menos 6 caracteres';
    isValid = false;
  }
  
  return isValid;
};

// Handle form submission
const handleSubmit = async () => {
  if (!validateForm()) return;
  
  try {
    await authStore.login(email.value, password.value);
    router.push('/admin');
  } catch (error) {
    console.error('Error de inicio de sesión:', error);
  }
};

// Clear any previous errors
onMounted(() => {
  authStore.error = null;
});
</script>