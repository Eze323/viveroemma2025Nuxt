<template>
  <div class="relative bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-emerald-100/80 dark:border-emerald-950/80 h-16 flex items-center px-4 sm:px-6 justify-between sticky top-0 z-30 shadow-sm transition-all duration-300">
    <!-- SVG Filter Defs para el Admin Navbar -->
    <svg class="absolute w-0 h-0 overflow-hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="admin-gooey" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 18 -8" 
            result="gooey" 
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </defs>
    </svg>

    <!-- Left Section: Mobile Menu + Page Title con Pulso Bioluminoso -->
    <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
      <!-- Mobile sidebar trigger -->
      <button 
        @click="toggleSidebar" 
        class="md:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition-all duration-200"
      >
        <Icon :name="isOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-6 h-6 text-emerald-600" />
      </button>
      
      <!-- Page title con indicador fluido -->
      <div class="flex items-center gap-2 min-w-0">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping flex-shrink-0"></span>
        <h1 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight truncate font-heading">
          {{ pageTitle }}
        </h1>
      </div>
    </div>
    
    <!-- Right Section: Search, Notifications, User Menu -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Search input - Hidden on mobile -->
      <div class="hidden lg:block relative">
        <input 
          type="text" 
          placeholder="Buscar en el sistema..." 
          class="pl-10 pr-4 py-2 w-64 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all duration-300 text-xs font-semibold"
        />
        <Icon name="heroicons:magnifying-glass" class="absolute left-3.5 top-2.5 text-slate-400 w-4 h-4" />
      </div>
      
      <!-- Search button for mobile/tablet -->
      <button class="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition-all duration-200">
        <Icon name="heroicons:magnifying-glass" class="w-5 h-5" />
      </button>
      
      <!-- Notifications Dropdown Líquido -->
      <div class="relative">
        <button
          @click="toggleNotifications"
          class="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition-all duration-200 relative group"
          aria-label="Notificaciones"
        >
          <Icon name="heroicons:bell" class="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute -top-1 -right-1 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-black shadow-md shadow-rose-500/30 animate-pulse"
          >
            {{ notificationsStore.unreadCount > 99 ? '99+' : notificationsStore.unreadCount }}
          </span>
        </button>

        <!-- Dropdown Notificaciones con Glassmorphism -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95 -translate-y-2"
          enter-to-class="transform opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="transform opacity-100 scale-100 translate-y-0"
          leave-to-class="transform opacity-0 scale-95 -translate-y-2"
        >
          <div
            v-if="isNotificationsOpen"
            class="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-950 z-50 overflow-hidden"
          >
            <div class="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">Notificaciones</span>
              </div>
              <div class="flex items-center gap-3">
                <button @click="markAllAsRead" class="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 transition-colors">Marcar leídas</button>
                <button @click="clearAll" class="text-[11px] font-bold text-rose-500 hover:text-rose-600 transition-colors">Limpiar</button>
              </div>
            </div>

            <div class="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              <template v-if="notificationsStore.notifications.length">
                <button
                  v-for="note in notificationsStore.notifications"
                  :key="note.id"
                  @click="openNotification(note)"
                  class="w-full text-left px-4 py-3.5 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/30 flex gap-3 items-start transition-colors duration-200"
                >
                  <div class="flex-shrink-0 w-9 h-9 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm font-bold shadow-inner">
                    <Icon v-if="note.type === 'order'" name="heroicons:shopping-cart" class="w-4 h-4" />
                    <Icon v-else-if="note.type === 'stock_warning'" name="heroicons:exclamation-triangle" class="w-4 h-4 text-amber-500" />
                    <Icon v-else name="heroicons:user" class="w-4 h-4" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1 mb-0.5">
                      <p :class="note.read ? 'text-xs text-slate-500 dark:text-slate-400' : 'text-xs font-extrabold text-slate-900 dark:text-white'" class="truncate">
                        {{ note.title }}
                      </p>
                      <span class="text-[10px] font-mono text-slate-400 flex-shrink-0">{{ formatTime(note.createdAt) }}</span>
                    </div>
                    <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ note.message }}</p>
                  </div>
                </button>
              </template>
              <div v-else class="px-5 py-6 text-center text-xs font-semibold text-slate-400">Sin notificaciones nuevas</div>
            </div>
          </div>
        </Transition>
      </div>
      
      <!-- User menu dropdown Líquido -->
      <div class="relative">
        <button 
          @click="isUserMenuOpen = !isUserMenuOpen"
          class="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-slate-100/80 dark:hover:bg-slate-900/80 transition-all duration-300 group"
        >
          <div v-if="userInitials" class="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
            {{ userInitials }}
          </div>
          <span class="hidden sm:block text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
            {{ authStore.user?.name || 'Usuario' }}
          </span>
          <Icon name="heroicons:chevron-down" class="w-4 h-4 text-slate-400 transition-transform duration-300" :class="{ 'rotate-180': isUserMenuOpen }" />
        </button>
        
        <!-- User Dropdown Menu con Glassmorphism -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="transform opacity-0 scale-95 -translate-y-2"
          enter-to-class="transform opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="transform opacity-100 scale-100 translate-y-0"
          leave-to-class="transform opacity-0 scale-95 -translate-y-2"
        >
          <div 
            v-if="isUserMenuOpen"
            class="absolute right-0 mt-3 w-60 bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-emerald-100 dark:border-emerald-950 py-2 z-50 overflow-hidden"
          >
            <!-- User info -->
            <div class="px-5 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
              <p class="text-xs font-extrabold text-slate-900 dark:text-white">{{ authStore.user?.name || 'Usuario' }}</p>
              <p class="text-[11px] font-medium text-slate-400 truncate">{{ authStore.user?.email || '' }}</p>
            </div>
            
            <!-- Menu items -->
            <div class="p-1 space-y-0.5">
              <NuxtLink 
                to="/admin/perfil" 
                class="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition-colors"
                @click="isUserMenuOpen = false"
              >
                <Icon name="heroicons:user-circle" class="w-4 h-4 text-emerald-500" />
                Mi Perfil
              </NuxtLink>
              <NuxtLink 
                to="/admin/configuracion" 
                class="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition-colors"
                @click="isUserMenuOpen = false"
              >
                <Icon name="heroicons:cog-6-tooth" class="w-4 h-4 text-teal-500" />
                Configuración
              </NuxtLink>
              
              <div class="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                <button 
                  @click="logout" 
                  class="flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 w-full transition-colors"
                >
                  <Icon name="heroicons:arrow-right-on-rectangle" class="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
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