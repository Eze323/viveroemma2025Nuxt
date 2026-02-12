<template>
  <div class="relative inline-block text-left" id="notification-wrapper">
    <button 
      @click.stop="isOpen = !isOpen" 
      class="relative p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 focus:outline-none group"
    >
      <Icon 
        name="heroicons:bell" 
        :class="isOpen ? 'text-primary-600' : 'text-gray-600'" 
        class="w-6 h-6 transition-colors" 
      />
      <span v-if="hasUnread" class="absolute top-2 right-2 flex h-2.5 w-2.5">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white"></span>
      </span>
    </button>

    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 z-[100] overflow-hidden"
    >
      <div class="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 class="font-bold text-gray-900 text-sm">Notificaciones</h3>
        <button @click="refresh" class="text-primary-600 hover:rotate-180 transition-transform duration-500">
          <Icon name="heroicons:arrow-path" class="w-4 h-4" />
        </button>
      </div>

      <div class="max-h-[400px] overflow-y-auto">
        <div v-if="!data || data.length === 0" class="p-10 text-center">
          <Icon name="heroicons:bell-slash" class="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p class="text-xs text-gray-500 font-medium">No hay novedades por ahora</p>
        </div>
        
        <div 
          v-for="notif in data" 
          :key="notif.id" 
          @click="handleNotificationClick(notif)"
          class="p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer relative flex gap-3"
          :class="{ 'bg-blue-50/40': notif.isRead === 0 }"
        >
          <div class="flex-shrink-0">
            <div :class="getIconBg(notif.type)" class="w-8 h-8 rounded-full flex items-center justify-center">
              <Icon :name="getIcon(notif.type)" :class="getIconColor(notif.type)" class="w-5 h-5" />
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-gray-900 leading-tight truncate">{{ notif.title }}</p>
            <p class="text-xs text-gray-600 mt-0.5 line-clamp-2">{{ notif.message }}</p>
            <p class="text-[10px] text-gray-400 mt-2 font-medium">{{ formatDate(notif.createdAt) }}</p>
          </div>
          <div v-if="notif.isRead === 0" class="w-2 h-2 bg-blue-500 rounded-full self-center"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);
const { data, refresh } = await useFetch('/api/notifications');

const hasUnread = computed(() => data.value?.some(n => n.isRead === 0) || false);

// Funciones de utilidad (ahora dentro del setup)
const getIcon = (type) => {
  if (type === 'sale') return 'heroicons:shopping-cart';
  if (type === 'stock') return 'heroicons:exclamation-triangle';
  return 'heroicons:information-circle';
};

const getIconColor = (type) => {
  if (type === 'sale') return 'text-green-600';
  if (type === 'stock') return 'text-amber-600';
  return 'text-blue-600';
};

const getIconBg = (type) => {
  if (type === 'sale') return 'bg-green-100';
  if (type === 'stock') return 'bg-amber-100';
  return 'bg-blue-100';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

const handleNotificationClick = async (notification) => {
  if (notification.isRead === 0) {
    try {
      await $fetch(`/api/notifications/${notification.id}`, { method: 'PATCH' });
      notification.isRead = 1;
    } catch (e) { console.error(e) }
  }
  if (notification.link) navigateTo(notification.link);
};

// Cerrar dropdown al hacer click afuera (reemplaza v-click-outside)
const closeOnOutsideClick = (e) => {
  if (isOpen.value && !e.target.closest('#notification-wrapper')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeOnOutsideClick);
  // Refresco automático cada 45 segundos
  const interval = setInterval(refresh, 45000);
  onUnmounted(() => {
    window.removeEventListener('click', closeOnOutsideClick);
    clearInterval(interval);
  });
});
</script>