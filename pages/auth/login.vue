<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center px-4">
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          Vivero Emma
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Inicia sesión para gestionar tu negocio
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          <form class="space-y-6" @submit.prevent="handleSubmit">
            
            <!-- Global Error Alert -->
            <div v-if="authStore.error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md animate-fade-in">
              <div class="flex">
                <div class="flex-shrink-0">
                  <Icon name="heroicons:exclamation-circle" class="h-5 w-5 text-red-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700 font-medium">
                    {{ authStore.error }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"> Correo electrónico </label>
              <div class="mt-1 relative">
                <input
                  id="email"
                  v-model="form.email"
                  name="email"
                  type="email"
                  autocomplete="email"
                  :class="[
                    'appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors',
                    errors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  ]"
                  placeholder="admin@ejemplo.com"
                  @blur="validateField('email')"
                  @input="handleInput('email')"
                />
                <div v-if="errors.email" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Icon name="heroicons:exclamation-circle" class="h-5 w-5 text-red-500" />
                </div>
              </div>
              <p v-if="errors.email" class="mt-2 text-sm text-red-600 animate-pulse">{{ errors.email }}</p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700"> Contraseña </label>
              <div class="mt-1 relative">
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  name="password"
                  autocomplete="current-password"
                  :class="[
                    'appearance-none block w-full px-3 py-3 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors pr-10',
                    errors.password ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                  ]"
                  placeholder="••••••••"
                  @blur="validateField('password')"
                  @input="handleInput('password')"
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-5 w-5" />
                </button>
              </div>
              <p v-if="errors.password" class="mt-2 text-sm text-red-600 animate-pulse">{{ errors.password }}</p>
            </div>

            <!-- Remember & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input
                  id="remember-me"
                  v-model="form.rememberMe"
                  name="remember-me"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <label for="remember-me" class="ml-2 block text-sm text-gray-900 cursor-pointer">
                  Recordarme
                </label>
              </div>

              <div class="text-sm">
                <NuxtLink to="/auth/recuperar-password" class="font-medium text-primary hover:text-primary-dark transition-colors">
                  ¿Olvidaste tu contraseña?
                </NuxtLink>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                :disabled="authStore.loading || !isFormValid"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
              >
                <div v-if="authStore.loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </div>
                <span v-else>Iniciar sesión</span>
              </button>
            </div>
          </form> 

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500"> O también puedes </span>
              </div>
            </div>

            <div class="mt-6">
              <NuxtLink
                to="/auth/login-firebase"
                class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
              >
                Usar Google / Firebase
              </NuxtLink>
            </div>
          </div>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              ¿No tienes una cuenta? 
              <NuxtLink to="/auth/register" class="font-medium text-primary hover:text-primary-dark underline">
                Regístrate aquí
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  layout: 'default'
});

const authStore = useAuthStore();
const showPassword = ref(false);
const isDev = import.meta.dev;

// Form State
const form = reactive({
  email: isDev ? 'administrador@vivero.com' : '',
  password: isDev ? 'password123' : '',
  rememberMe: false
});

const errors = reactive({
  email: '',
  password: ''
});

const touched = reactive({
  email: false,
  password: false
});

// Real-time Validation Logic
const validateEmail = (email) => {
  if (!email) return 'El correo es obligatorio';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Formato de correo inválido';
  return '';
};

const validatePassword = (password) => {
  if (!password) return 'La contraseña es obligatoria';
  if (password.length < 6) return 'Mínimo 6 caracteres';
  return '';
};

const handleInput = (field) => {
  if (touched[field]) {
    validateField(field);
  }
};

const validateField = (field) => {
  touched[field] = true;
  if (field === 'email') {
    errors.email = validateEmail(form.email);
  } else if (field === 'password') {
    errors.password = validatePassword(form.password);
  }
};

const isFormValid = computed(() => {
  return !validateEmail(form.email) && !validatePassword(form.password) && form.email && form.password;
});

const handleSubmit = async () => {
  // Final validation before submit
  validateField('email');
  validateField('password');

  if (errors.email || errors.password) return;

  try {
    await authStore.login(form.email, form.password);
    
    if (authStore.user?.role === 'canastero') {
        navigateTo('/canasteros');
    } else {
        navigateTo('/admin');
    }
  } catch (error) {
    // Error is handled in store and displayed via authStore.error
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>