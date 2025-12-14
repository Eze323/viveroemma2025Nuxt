<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90" @click="close">
    <button class="absolute top-4 right-4 text-white hover:text-gray-300 z-50 p-2" @click="close">
      <Icon name="heroicons:x-mark" class="w-8 h-8" />
    </button>
    <div class="relative max-w-7xl max-h-screen p-4" @click.stop>
      <img
        :src="imageUrl"
        :alt="altText"
        class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean;
  imageUrl: string;
  altText?: string;
}>();

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>
