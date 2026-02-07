<template>
  <div v-if="open" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
    <div 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm" 
      @click="$emit('close')"
    ></div>

    <div 
      class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh] overflow-hidden transition-all"
    >
      <button 
        @click="$emit('close')" 
        class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
      >
        <Icon name="heroicons:x-mark" class="w-6 h-6" />
      </button>

      <div class="overflow-y-auto p-6 scrollbar-hide">
        <slot />
        
        <div class="h-20 md:hidden"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({ 
  open: Boolean
});
defineEmits(['close']);
</script>
<style scoped>

/* Ocultar scrollbar si preferís un look más limpio, pero permitiendo scroll */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>