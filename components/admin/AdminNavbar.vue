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
      <button class="relative p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg transition-all duration-200 group">
        <Icon name="heroicons:bell" class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium group-hover:scale-110 transition-transform">
          3
        </span>
      </button>
      
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

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['toggle-sidebar', 'update:isOpen']);

const authStore = useAuthStore();
const route = useRoute();

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
});

// Toggle sidebar
const toggleSidebar = () => {
  const newValue = !props.isOpen;
  emit('update:isOpen', newValue);
  emit('toggle-sidebar', newValue);
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