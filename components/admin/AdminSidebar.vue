<template>
  <div :class="[
    'fixed md:static inset-y-0 left-0 bg-white shadow-xl md:shadow-lg w-72 transition-all duration-300 z-30 flex flex-col',
    { '-translate-x-full md:translate-x-0': !isOpen },
  ]">
    <!-- Logo & Close Button -->
    <div class="h-16 flex items-center justify-between px-6 border-b border-gray-200">
      <NuxtLink to="/admin" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
          <Icon name="heroicons:sparkles" class="w-6 h-6 text-white" />
        </div>
        <div>
          <span class="font-bold text-gray-900 text-lg">Vivero Emma</span>
          <p class="text-xs text-gray-500">Admin Panel</p>
        </div>
      </NuxtLink>
      <button @click="$emit('toggle-sidebar')" class="md:hidden p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-all">
        <Icon name="heroicons:x-mark" class="w-5 h-5" />
      </button>
    </div>
    
    <!-- User info -->
    <div class="p-4 border-b border-gray-200 bg-gray-50">
      <div class="flex items-center gap-3">
        <div v-if="userInitials" class="w-12 h-12 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-semibold text-gray-900 truncate">{{ authStore.user?.name || 'Usuario' }}</div>
          <div class="text-xs text-gray-600 truncate">{{ roleName }}</div>
        </div>
      </div>
    </div>
    
    <!-- Navigation menu -->
    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
      <NuxtLink 
        v-for="item in filteredMenuItems" 
        :key="item.to" 
        :to="item.to"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group"
        :class="{ 
          'bg-primary/10 text-primary font-semibold shadow-sm': isActiveRoute(item.to),
          'hover:translate-x-1': !isActiveRoute(item.to)
        }"
        @click="$emit('toggle-sidebar')"
      >
        <div 
          class="p-2 rounded-lg transition-colors"
          :class="isActiveRoute(item.to) ? 'bg-primary/20' : 'bg-gray-100 group-hover:bg-primary/10'"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
        </div>
        <span class="text-sm">{{ item.label }}</span>
        <Icon 
          v-if="isActiveRoute(item.to)" 
          name="heroicons:chevron-right" 
          class="w-4 h-4 ml-auto" 
        />
      </NuxtLink>
    </nav>
    
    <!-- Logout button at bottom -->
    <div class="p-4 border-t border-gray-200">
      <button 
        @click="logout" 
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-red-50 hover:text-red-600 w-full transition-all duration-200 group"
      >
        <div class="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
          <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
        </div>
        <span class="text-sm font-medium">Cerrar sesión</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRoute, useRouter } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

// Initialize userInitials with empty string for consistent SSR
const userInitials = ref('');

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
  { label: 'Productos', to: '/admin/productos', icon: 'heroicons:shopping-bag', roles: ['admin', 'encargado'] },
  { label: 'Ventas', to: '/admin/ventas', icon: 'heroicons:shopping-cart', roles: ['admin', 'encargado'] },
  { label: 'Clientes', to: '/admin/clientes', icon: 'heroicons:user-circle', roles: ['admin', 'encargado'] },
  { label: 'Categorías', to: '/admin/categorias', icon: 'heroicons:tag', roles: ['admin', 'encargado'] },
  { label: 'Proveedores', to: '/admin/proveedores', icon: 'heroicons:building-storefront', roles: ['admin', 'encargado'] },
];

// Filter menu items based on user role
const filteredMenuItems = computed(() => {
  const userRole = authStore.user?.role || 'empleado';
  return menuItems.filter(item => item.roles.includes(userRole));
});

// Check if route is active
const isActiveRoute = (path) => {
  return route.path === path || (path !== '/admin' && route.path.startsWith(`${path}/`));
};

// Logout handler
const logout = async () => {
  await authStore.logout();
  router.push('/auth/login');
};

// Update userInitials after component is mounted (client-side only)
onMounted(() => {
  const name = authStore.user?.name || 'Usuario';
  userInitials.value = name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
});

defineEmits(['toggle-sidebar']);
defineProps({
  isOpen: {
    type: Boolean,
    default: true
  }
});
</script>