<template>
  <div class="bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-6 justify-between sticky top-0 z-20 shadow-sm">
    <!-- Left Section: Mobile Menu + Page Title -->
    <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
      <!-- Mobile sidebar trigger -->
      <button 
        @click="toggleSidebar" 
        class="md:hidden p-2 -ml-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <Icon :name="isOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-6 h-6" />
      </button>
      
      <!-- Page title -->
      <h1 class="text-lg sm:text-xl font-semibold text-gray-900 truncate">{{ pageTitle }}</h1>
    </div>
    
    <!-- Right Section: Search, Notifications, User Menu -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Search input - Hidden on mobile -->
      <div class="hidden lg:block relative">
        <input 
          type="text" 
          placeholder="Buscar..." 
          class="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 text-sm"
        />
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
      </div>
      
      <!-- Search button for mobile/tablet -->
      <button class="lg:hidden p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all duration-200">
        <Icon name="heroicons:magnifying-glass" class="w-5 h-5" />
      </button>
      
      <!-- Notifications -->
      <div class="relative">
        <button
          @click="toggleNotifications"
          class="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all duration-200 group"
          aria-label="Notificaciones"
        >
          <Icon name="heroicons:bell" class="w-5 h-5" />
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute top-1.5 right-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium group-hover:scale-110 transition-transform"
          >
            {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
          </span>
        </button>

        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div
            v-if="isNotificationsOpen"
            class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
          >
            <div class="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <span class="text-sm font-semibold">Notificaciones</span>
              <div class="flex items-center gap-2">
                <button @click="markAllAsRead" class="text-xs text-gray-600 hover:text-gray-800">Marcar todas</button>
                <button @click="clearAll" class="text-xs text-red-500 hover:text-red-600">Limpiar</button>
              </div>
            </div>

            <div class="max-h-64 overflow-auto">
              <template v-if="notificationsStore.notifications.length">
                <button
                  v-for="note in notificationsStore.notifications"
                  :key="note.id"
                  @click="openNotification(note)"
                  class="w-full text-left px-4 py-3 hover:bg-gray-50 flex gap-3 items-start"
                >
                  <div class="flex-shrink-0 w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                    <Icon v-if="note.type === 'order'" name="heroicons:shopping-cart" class="w-4 h-4" />
                    <Icon v-else-if="note.type === 'stock_warning'" name="heroicons:exclamation-triangle" class="w-4 h-4" />
                    <Icon v-else name="heroicons:user" class="w-4 h-4" />
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between">
                      <p :class="note.read ? 'text-sm text-gray-500' : 'text-sm font-medium text-gray-900'">{{ note.title }}</p>
                      <span class="text-xs text-gray-400">{{ formatTime(note.createdAt) }}</span>
                    </div>
                    <p class="text-xs text-gray-500 truncate">{{ note.message }}</p>
                  </div>
                </button>
              </template>
              <div v-else class="px-4 py-4 text-sm text-gray-500">Sin notificaciones</div>
            </div>
          </div>
        </Transition>
      </div>
      
      <!-- User menu dropdown -->
      <div class="relative">
        <button 
          @click="isUserMenuOpen = !isUserMenuOpen"
          class="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
        >
          <div v-if="userInitials" class="w-8 h-8 rounded-lg bg-gradient-primary text-white flex items-center justify-center font-semibold text-sm shadow-sm group-hover:shadow-md transition-shadow">
            {{ userInitials }}
          </div>
          <span class="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
            {{ authStore.user?.name || 'Usuario' }}
          </span>
          <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500 transition-transform duration-200" :class="{ 'rotate-180': isUserMenuOpen }" />
        </button>
        
        <!-- Dropdown menu -->
        <Transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <div 
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50"
          >
            <!-- User info -->
            <div class="px-4 py-3 border-b border-gray-100">
              <p class="text-sm font-semibold text-gray-900">{{ authStore.user?.name || 'Usuario' }}</p>
              <p class="text-xs text-gray-500 truncate">{{ authStore.user?.email || '' }}</p>
            </div>
            
            <!-- Menu items -->
            <NuxtLink 
              to="/admin/perfil" 
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              @click="isUserMenuOpen = false"
            >
              <Icon name="heroicons:user-circle" class="w-5 h-5 text-gray-400" />
              Mi Perfil
            </NuxtLink>
            <NuxtLink 
              to="/admin/configuracion" 
              class="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              @click="isUserMenuOpen = false"
            >
              <Icon name="heroicons:cog-6-tooth" class="w-5 h-5 text-gray-400" />
              Configuración
            </NuxtLink>
            
            <div class="border-t border-gray-100 mt-1 pt-1">
              <button 
                @click="logout" 
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
              >
                <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoute } from 'vue-router';
import { useNotificationsStore, seedNotifications } from '~/stores/notifications';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['toggle-sidebar', 'update:isOpen']);

const authStore = useAuthStore();
const route = useRoute();

const notificationsStore = useNotificationsStore();

const isUserMenuOpen = ref(false);

// Get page title based on current route
const pageTitle = computed(() => {
  const pathMap = {
    '/admin': 'Dashboard',
    '/admin/productos': 'Productos',
    '/admin/ventas': 'Ventas',
    '/admin/clientes': 'Clientes',
    '/admin/categorias': 'Categorías',
    '/admin/proveedores': 'Proveedores',
    '/admin/perfil': 'Mi Perfil',
    '/admin/configuracion': 'Configuración',
  };
  
  return pathMap[route.path] || 'Administración';
});

// Get user initials for avatar
const userInitials = ref('');
onMounted(() => {
  const name = authStore.user?.name || 'Usuario';
  userInitials.value = name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
  // seed mock notifications in case store is empty (dev/test)
  if (notificationsStore.notifications.length === 0) seedNotifications(notificationsStore);
});

// Toggle sidebar
const toggleSidebar = () => {
  const newValue = !props.isOpen;
  emit('update:isOpen', newValue);
  emit('toggle-sidebar', newValue);
};

// Notifications toggle and actions
const isNotificationsOpen = ref(false);
const toggleNotifications = () => {
  isNotificationsOpen.value = !isNotificationsOpen.value;
};

const openNotification = (note) => {
  notificationsStore.markAsRead(note.id);
  isNotificationsOpen.value = false;
  // optionally navigate based on notification meta (example for orders)
  if (note.type === 'order' && note.meta?.orderId) {
    navigateTo(`/admin/ventas/${note.meta.orderId}`);
  }
};

const markAllAsRead = () => {
  notificationsStore.markAllAsRead();
};

const clearAll = () => {
  notificationsStore.clearAll();
};

const formatTime = (iso) => {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return d.toLocaleDateString();
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (isUserMenuOpen.value && !event.target.closest('.relative')) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Logout handler
const logout = async () => {
  await authStore.logout();
  navigateTo('/auth/login');
};
</script>