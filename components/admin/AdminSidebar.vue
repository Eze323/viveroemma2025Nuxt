<template>
  <div :class="[
    'fixed md:static inset-y-0 left-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-r border-emerald-100/80 dark:border-emerald-950/80 shadow-2xl md:shadow-lg w-72 transition-all duration-300 z-30 flex flex-col',
    { '-translate-x-full md:translate-x-0': !isOpen },
  ]">
    <!-- Logo & Close Button -->
    <div class="h-16 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800">
      <NuxtLink to="/admin" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-110 transition-transform">
          <Icon name="heroicons:sparkles" class="w-6 h-6 text-white" />
        </div>
        <div>
          <span class="font-black text-slate-900 dark:text-white text-lg tracking-tight">Vivero Emma</span>
          <p class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Admin Panel</p>
        </div>
      </NuxtLink>
      <button @click="$emit('toggle-sidebar')" class="md:hidden p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
        <Icon name="heroicons:x-mark" class="w-5 h-5" />
      </button>
    </div>
    
    <!-- User info estilo Micro-Gota -->
    <div class="p-4 border-b border-slate-100 dark:border-slate-800/80 bg-emerald-50/50 dark:bg-slate-900/50">
      <div class="flex items-center gap-3">
        <div v-if="userInitials" class="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-emerald-500/20">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="font-bold text-slate-900 dark:text-white text-xs truncate">{{ authStore.user?.name || 'Usuario' }}</div>
          <div class="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 truncate">{{ roleName }}</div>
        </div>
      </div>
    </div>
    
    <!-- Navigation Menu con Resaltado de Ola Viscosa (Liquid Wave Edge) -->
    <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto">
      <NuxtLink 
        v-for="item in filteredMenuItems" 
        :key="item.to" 
        :to="item.to"
        class="liquid-sidebar-link flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-all duration-300 group relative overflow-hidden"
        :class="{ 
          'bg-gradient-to-r from-emerald-500/15 to-teal-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold shadow-sm active-wave': isActiveRoute(item.to),
          'hover:translate-x-1 font-semibold': !isActiveRoute(item.to)
        }"
        @click="$emit('toggle-sidebar')"
      >
        <div 
          class="p-2 rounded-xl transition-transform group-hover:scale-110"
          :class="isActiveRoute(item.to) ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500/20 group-hover:text-emerald-600'"
        >
          <Icon :name="item.icon" class="w-5 h-5" />
        </div>
        <span class="text-xs tracking-wide">{{ item.label }}</span>
        <Icon 
          v-if="isActiveRoute(item.to)" 
          name="heroicons:chevron-right" 
          class="w-4 h-4 ml-auto text-emerald-600 dark:text-emerald-400 animate-pulse" 
        />
      </NuxtLink>
    </nav>
    
    <!-- Logout button at bottom -->
    <div class="p-4 border-t border-slate-100 dark:border-slate-800">
      <button 
        @click="logout" 
        class="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 w-full transition-all duration-300 group font-bold text-xs"
      >
        <div class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 group-hover:bg-rose-500 group-hover:text-white transition-colors">
          <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5" />
        </div>
        <span>Cerrar sesión</span>
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

const userInitials = ref('');

const roleName = computed(() => {
  const roleMap = {
    'admin': 'Administrador',
    'encargado': 'Encargado',
    'empleado': 'Empleado'
  };
  return roleMap[authStore.user?.role] || 'Usuario';
});

const menuItems = [
  { label: 'Dashboard', to: '/admin', icon: 'heroicons:home', roles: ['admin', 'encargado', 'empleado'] },
  { label: 'Productos', to: '/admin/productos', icon: 'heroicons:shopping-bag', roles: ['admin', 'encargado'] },
  { label: 'Ventas', to: '/admin/ventas', icon: 'heroicons:shopping-cart', roles: ['admin', 'encargado'] },
  { label: 'Clientes', to: '/admin/clientes', icon: 'heroicons:user-circle', roles: ['admin', 'encargado'] },
  { label: 'Categorías', to: '/admin/categorias', icon: 'heroicons:tag', roles: ['admin', 'encargado'] },
  { label: 'Proveedores', to: '/admin/proveedores', icon: 'heroicons:building-storefront', roles: ['admin', 'encargado'] },
];

const filteredMenuItems = computed(() => {
  const userRole = authStore.user?.role || 'empleado';
  return menuItems.filter(item => item.roles.includes(userRole));
});

const isActiveRoute = (path) => {
  return route.path === path || (path !== '/admin' && route.path.startsWith(`${path}/`));
};

const logout = async () => {
  await authStore.logout();
  router.push('/auth/login');
};

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

<style scoped>
.liquid-sidebar-link.active-wave::before {
  content: '';
  position: absolute;
  left: 0;
  top: 15%;
  bottom: 15%;
  width: 4px;
  background: linear-gradient(180deg, #10b981, #14b8a6);
  border-radius: 0 4px 4px 0;
}
</style>