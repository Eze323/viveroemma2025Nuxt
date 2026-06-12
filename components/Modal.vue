<template>
    <div v-if="open" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    open: Boolean
  });
  defineEmits(['close']);
  </script>