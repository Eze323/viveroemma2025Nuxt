<template>
  <div class="bg-white border-b border-gray-200 h-16 flex items-center px-4 justify-between">
    <!-- Mobile sidebar trigger -->
    <button 
      @click="toggleSidebar" 
      class="md:hidden text-gray-500 hover:text-primary"
    >
      <Icon :name="isOpen ? 'heroicons:x-mark' : 'heroicons:bars-3'" class="w-6 h-6" />
    </button>
    
    <!-- Page title -->
    <h1 class="text-xl font-medium text-gray-800 hidden md:block">{{ pageTitle }}</h1>
    
    <!-- Right section with search and user menu -->
    <div class="flex items-center gap-4">
      <!-- Search input -->
      <div class="hidden md:block relative">
        <input 
          type="text" 
          placeholder="Buscar..." 
          class="pl-9 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
      </div>
      
      <!-- Notifications -->
      <button class="relative text-gray-500 hover:text-primary focus:outline-none">
        <Icon name="heroicons:bell" class="w-6 h-6" />
        <span class="absolute -top-1 -right-1 bg-accent text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
          3
        </span>
      </button>
      
      <!-- User menu dropdown -->
      <div class="relative">
        <button 
          @click="toggleUserMenu"
          class="flex items-center gap-2 focus:outline-none"
        >
          <div v-if="userInitials" class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
            {{ userInitials }}
          </div>
          <span class="hidden md:block text-sm font-medium text-gray-700">
            {{ authStore.user?.name || 'Usuario' }}
          </span>
          <Icon name="heroicons:chevron-down" class="w-4 h-4 text-gray-500" />
        </button>
        
        <!-- Dropdown menu -->
        <div 
          v-if="isUserMenuOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
        >
          <NuxtLink 
            to="/admin/perfil" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="closeUserMenu"
          >
            Mi Perfil
          </NuxtLink>
          <NuxtLink 
            to="/admin/configuracion" 
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            @click="closeUserMenu"
          >
            Configuración
          </NuxtLink>
          <button 
            @click="logout" 
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
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
    '/admin/vendedores': 'Vendedores',
    // ... (mantén tus rutas existentes)
  };
  return pathMap[route.path] || 'Administración';
});

// Get user initials for avatar - now with proper client-side initialization
const userInitials = ref('');
onMounted(() => {
  const name = authStore.user?.name || 'Usuario';
  userInitials.value = name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
});

// Toggle sidebar in parent component
const toggleSidebar = () => {
  emit('toggle-sidebar');
};

// Cerrar menú al hacer click fuera
const handleClickOutside = (event) => {
  if (isUserMenuOpen.value) {
    isUserMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const logout = async () => {
  await authStore.logout();
  navigateTo('/auth/login');
};

const emit = defineEmits(['toggle-sidebar']);
</script>