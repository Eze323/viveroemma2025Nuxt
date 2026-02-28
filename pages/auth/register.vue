<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center px-4">
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          Crear una cuenta
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Únete a Vivero Emma para gestionar tus pedidos
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          
          <div v-if="successMessage" class="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-md animate-fade-in mb-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-400" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700 font-medium">
                  {{ successMessage }}
                </p>
                <div class="mt-4">
                  <NuxtLink to="/auth/login" class="text-sm font-bold text-green-700 underline">
                    Ir al inicio de sesión
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <form v-else class="space-y-6" @submit.prevent="handleSubmit">
            <!-- Global Error Alert -->
            <div v-if="error" class="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md animate-fade-in">
              <div class="flex">
                <div class="flex-shrink-0">
                  <Icon name="heroicons:exclamation-circle" class="h-5 w-5 text-red-400" />
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700 font-medium">
                    {{ error }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700"> Nombre completo </label>
              <div class="mt-1">
                <input
                  id="name"
                  v-model="form.name"
                  name="name"
                  type="text"
                  required
                  class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="Juan Pérez"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700"> Correo electrónico </label>
              <div class="mt-1">
                <input
                  id="email"
                  v-model="form.email"
                  name="email"
                  type="email"
                  required
                  class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
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
                  required
                  class="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors pr-10"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                :disabled="loading"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-all transform active:scale-95"
              >
                <div v-if="loading" class="flex items-center">
                  <Icon name="heroicons:arrow-path" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Registrando...
                </div>
                <span v-else>Crear cuenta</span>
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
                to="/auth/register-firebase"
                class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
              >
                Registrarte con Google / Firebase
              </NuxtLink>
            </div>
          </div>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              ¿Ya tienes una cuenta? 
              <NuxtLink to="/auth/login" class="font-medium text-primary hover:text-primary-dark transition-colors">
                Inicia sesión
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loading = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const showPassword = ref(false);

const form = reactive({
  name: '',
  email: '',
  password: '',
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { ...form },
    });

    if (response.success) {
      successMessage.value = response.message;
      form.name = '';
      form.email = '';
      form.password = '';
    }
  } catch (err: any) {
    error.value = err.data?.statusMessage || 'Ocurrió un error al intentar registrarte.';
  } finally {
    loading.value = false;
  }
};
</script>
