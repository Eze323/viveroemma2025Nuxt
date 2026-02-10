<template>
  <div class="max-w-2xl mx-auto p-4 sm:p-6">
    <div class="mb-8 flex items-center gap-4">
      <NuxtLink to="/admin/canasteros" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <Icon name="heroicons:arrow-left" class="w-6 h-6 text-gray-600" />
      </NuxtLink>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Registrar Nuevo Canastero</h1>
        <p class="text-sm text-gray-500">Crea una cuenta de acceso y perfil comercial.</p>
      </div>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      
      <div class="space-y-4">
        <h2 class="text-sm font-semibold text-primary-600 uppercase tracking-wider">Información Personal</h2>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input 
            v-model="form.name" 
            type="text" 
            required 
            placeholder="Ej: Juan Pérez"
            class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email (Usuario)</label>
            <input 
              v-model="form.email" 
              type="email" 
              required 
              placeholder="juan@vivero.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Teléfono</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              placeholder="11 1234 5678"
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>
      </div>

      <hr class="border-gray-100" />

      <div class="space-y-4">
        <h2 class="text-sm font-semibold text-primary-600 uppercase tracking-wider">Seguridad</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña Inicial</label>
          <div class="relative">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              v-model="form.password" 
              required 
              class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" class="w-5 h-5" />
            </button>
          </div>
          <p class="mt-1 text-xs text-gray-400">El canastero podrá cambiarla luego desde su perfil.</p>
        </div>
      </div>

      <div class="pt-4">
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Icon v-if="loading" name="heroicons:arrow-path" class="w-5 h-5 animate-spin" />
          {{ loading ? 'Registrando...' : 'Crear Cuenta de Canastero' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  middleware: ['auth'], // Solo admins
  layout: 'admin'
});

const loading = ref(false);
const showPassword = ref(false);
const form = ref({
  name: '',
  email: '',
  phone: '',
  password: ''
});

const handleRegister = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/admin/resellers', {
      method: 'POST',
      body: form.value
    });

    if (response.success) {
      // Usamos una notificación o alerta (ajusta según lo que uses en tu app)
      alert('¡Canastero registrado con éxito!');
      navigateTo('/admin/canasteros');
    }
  } catch (err) {
    console.error(err);
    alert(err.data?.statusMessage || 'Error al registrar al canastero');
  } finally {
    loading.value = false;
  }
};
</script>