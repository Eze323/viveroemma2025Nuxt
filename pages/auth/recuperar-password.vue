<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center px-4">
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          Recuperar Contraseña
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Ingresa tu email y te enviaremos instrucciones para restablecerla.
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-100">
          
          <!-- Success State -->
          <div v-if="success" class="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-r-md animate-fade-in">
            <div class="flex">
              <div class="flex-shrink-0">
                <Icon name="heroicons:check-circle" class="h-5 w-5 text-green-400" />
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-700 font-medium">
                  Si existe una cuenta asociada a <strong>{{ form.email }}</strong>, recibirás un correo con las instrucciones.
                </p>
                <div class="mt-4">
                  <NuxtLink to="/login" class="text-sm font-medium text-green-700 hover:text-green-600 underline">
                    Volver al inicio de sesión
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>

          <form v-else class="space-y-6" @submit.prevent="handleSubmit">
            
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

            <!-- Submit Button -->
            <div>
              <button
                type="submit"
                :disabled="loading || !isFormValid"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
              >
                <div v-if="loading" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </div>
                <span v-else>Enviar instrucciones</span>
              </button>
            </div>

            <div class="text-center mt-4">
               <NuxtLink to="/login" class="text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                  <Icon name="heroicons:arrow-left" class="inline w-4 h-4 mr-1" />
                  Volver al inicio de sesión
               </NuxtLink>
            </div>

          </form> 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

definePageMeta({
  layout: 'default'
});

const loading = ref(false);
const success = ref(false);

const form = reactive({
  email: ''
});

const errors = reactive({
  email: ''
});

const touched = reactive({
  email: false
});

// Real-time Validation
const validateEmail = (email) => {
  if (!email) return 'El correo es obligatorio';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Formato de correo inválido';
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
  }
};

const isFormValid = computed(() => {
  return !validateEmail(form.email) && form.email;
});

const handleSubmit = async () => {
  validateField('email');
  if (errors.email) return;

  loading.value = true;
  
  // Simulation of API call
  setTimeout(() => {
    loading.value = false;
    success.value = true;
  }, 1500);
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
