<template>
    <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 bg-black/50" @click.self="close">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 animate-fade-in">
        <!-- Ícono -->
        <div class="flex justify-center mb-4">
          <div :class="{
            'bg-success/10 text-success': type === 'success',
            'bg-error/10 text-error': type === 'error'
          }" class="rounded-full p-3">
            <Icon v-if="type === 'success'" name="heroicons:check-circle" class="w-8 h-8" />
            <Icon v-if="type === 'error'" name="heroicons:x-circle" class="w-8 h-8" />
          </div>
        </div>
  
        <!-- Título -->
        <h2 class="text-xl font-bold text-center text-gray-900 mb-2">
          {{ title || (type === 'success' ? '¡Éxito!' : 'Error') }}
        </h2>
  
        <!-- Mensaje -->
        <p class="text-gray-600 text-center mb-6">{{ message }}</p>
  
        <!-- Botón -->
        <div class="flex justify-center">
          <button
            @click="close"
            class="btn btn-primary px-6 py-2"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    title: { type: String, default: '' },
    isOpen: { type: Boolean, default: false },
    message: { type: String, default: '' },
    type: { type: String, default: 'success', validator: (value) => ['success', 'error'].includes(value) },
  });
  
  const emit = defineEmits(['close']);
  
  const close = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>