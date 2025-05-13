<template>
  <div :class="[
    'fixed md:static inset-y-0 left-0 bg-white shadow-lg w-64 transition-all duration-300 z-30',
    { '-translate-x-full md:translate-x-0': !isOpen },
  ]">
    <!-- Logo -->
    <div class="h-16 flex items-center justify-between px-4 border-b border-gray-200">
      <NuxtLink to="/admin" class="flex items-center gap-2 font-bold text-primary text-xl">
        <span>Vivero Emma</span>
      </NuxtLink>
      <button @click="$emit('toggle-sidebar')" class="md:hidden text-gray-500 hover:text-primary">
        <Icon name="heroicons:x-mark" class="w-5 h-5" />
      </button>
    </div>
    
    <!-- User info -->
    <div class="p-4 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <div v-if="userInitials" class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          {{ userInitials }}
        </div>
        <div>
          <div class="font-medium text-gray-900">{{ authStore.user?.name || 'Usuario' }}</div>
          <div class="text-xs text-gray-500">{{ roleName }}</div>
        </div>
      </div>
    </div>
    
    <!-- Navigation menu -->
    <nav class="p-4 space-y-1 overflow-y-auto" style="height: calc(100vh - 9rem)">
      <NuxtLink 
        v-for="item in filteredMenuItems" 
        :key="item.to" 
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-primary-50 hover:text-primary transition-colors"
        :class="{ 'bg-primary-50 text-primary font-medium': isActiveRoute(item.to) }"
        @click="$emit('toggle-sidebar')"
      >
        <Icon :name="item.icon" class="w-5 h-5" />
        <span>{{ item.label }}</span>
      </NuxtLink>
      
      <!-- Logout button at bottom -->
      <button 
        @click="logout" 
        class="flex items-center gap-3 px-3 py-2.5 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 w-full mt-4"
      >
        <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
        <span>Cerrar sesión</span>
      </button>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const isOpen = ref(true);

// Get user initials for avatar
const userInitials = ref('');
onMounted(() => {
  const name = authStore.user?.name || 'Usuario';
  userInitials.value = name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
});

// Format role name for display
const roleName = computed(() => {
  const roleMap = {
    'admin': 'Administrador',
    'encargado': 'Encargado',
    'empleado': 'Empleado'
  };
  return roleMap[authStore.user?.role] || 'Usuario';
});

// Menu items for navigation
const menuItems = [
  { label: 'Dashboard', to: '/admin', icon: 'heroicons:home', roles: ['admin', 'encargado', 'empleado'] },
  { label: 'Vendedores', to: '/admin/vendedores', icon: 'heroicons:users', roles: ['admin'] },
  { label: 'Compradores', to: '/admin/compradores', icon: 'heroicons:user-group', roles: ['admin'] },
  { label: 'Productos', to: '/admin/productos', icon: 'heroicons:shopping-bag', roles: ['admin', 'encargado'] },
  { label: 'Ventas', to: '/admin/ventas', icon: 'heroicons:shopping-cart', roles: ['admin', 'encargado'] },
  { label: 'Facturas', to: '/admin/facturas', icon: 'heroicons:document-text', roles: ['admin'] },
  { label: 'Compras', to: '/admin/compras', icon: 'heroicons:banknotes', roles: ['admin'] },
  { label: 'Embazado', to: '/admin/embazado', icon: 'heroicons:beaker', roles: ['admin', 'encargado', 'empleado'] },
  { label: 'Premios', to: '/admin/premios', icon: 'heroicons:trophy', roles: ['admin'] },
  { label: 'Mi Perfil', to: '/admin/perfil', icon: 'heroicons:user-circle', roles: ['admin', 'encargado', 'empleado'] }
];

// Filter menu items based on user role
const filteredMenuItems = computed(() => {
  const userRole = authStore.user?.role || 'empleado';
  return menuItems.filter(item => item.roles.includes(userRole));
});

// Check if route is active
const isActiveRoute = (path) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

// Logout handler
const logout = async () => {
  await authStore.logout();
  router.push('/auth/login');
};

defineEmits(['toggle-sidebar']);
defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
});
</script>