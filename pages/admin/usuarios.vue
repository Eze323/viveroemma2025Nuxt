<template>
  <div class="p-6 max-w-7xl mx-auto font-poppins">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p class="text-sm text-gray-500 mt-1">Habilita o suspende el acceso de los usuarios registrado.</p>
      </div>
      
      <div class="flex items-center gap-4 bg-white p-2 rounded-xl shadow-sm border border-gray-100 w-full md:w-auto">
        <div class="relative w-full md:w-64">
          <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            class="w-full pl-10 pr-4 py-2 text-sm border-none bg-gray-50 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all outline-none"
          />
        </div>
        <button 
          @click="fetchUsers" 
          class="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
          :disabled="loading"
        >
          <Icon name="heroicons:arrow-path" :class="['w-5 h-5', { 'animate-spin': loading }]" />
        </button>
      </div>
    </div>

    <!-- Stats summary -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Icon name="heroicons:users" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Usuarios</p>
          <p class="text-2xl font-bold text-gray-900">{{ users.length }}</p>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <Icon name="heroicons:clock" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pendientes</p>
          <p class="text-2xl font-bold text-gray-900">{{ pendingCount }}</p>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div class="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <Icon name="heroicons:check-badge" class="w-6 h-6" />
        </div>
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Activos</p>
          <p class="text-2xl font-bold text-gray-900">{{ activeCount }}</p>
        </div>
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading && !users.length" class="flex flex-col items-center justify-center py-20">
        <Icon name="heroicons:arrow-path" class="w-10 h-10 animate-spin text-primary opacity-20" />
        <p class="mt-4 text-sm text-gray-500">Cargando usuarios...</p>
      </div>

      <div v-else-if="filteredUsers.length === 0" class="flex flex-col items-center justify-center py-20">
        <div class="p-4 bg-gray-50 rounded-full mb-4">
          <Icon name="heroicons:user-plus" class="w-8 h-8 text-gray-300" />
        </div>
        <p class="text-gray-500 font-medium">No se encontraron usuarios</p>
        <p class="text-xs text-gray-400 mt-1">Prueba con otra búsqueda o limpia los filtros</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="bg-gray-50/50 border-b border-gray-100">
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Registro</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones y Rol</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="text-sm font-semibold text-gray-900">{{ user.name }}</div>
                    <div class="text-xs text-gray-500">{{ user.email }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 w-fit',
                    statusStyles[user.status]
                  ]"
                >
                  <span class="w-2 h-2 rounded-full animate-pulse" :class="statusDotStyles[user.status]"></span>
                  {{ formatStatus(user.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-xs text-gray-600">{{ formatDate(user.createdAt) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end items-center gap-4">
                  <!-- Role Selector -->
                  <div class="relative min-w-[140px]">
                    <select 
                      :value="user.role"
                      @change="updateRole(user.id, $event.target.value)"
                      class="appearance-none w-full bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 pr-8 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    >
                      <option v-for="(label, value) in roleOptions" :key="value" :value="value">
                        {{ label }}
                      </option>
                    </select>
                    <Icon name="heroicons:chevron-down" class="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>

                  <!-- Status Actions -->
                  <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      v-if="user.status === 'pending'"
                      @click="updateStatus(user.id, 'active')" 
                      class="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                      title="Aprobar"
                    >
                      <Icon name="heroicons:check-circle" class="w-5 h-5" />
                    </button>
                    <button 
                      v-if="user.status === 'active'"
                      @click="updateStatus(user.id, 'suspended')" 
                      class="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                      title="Suspender"
                    >
                      <Icon name="heroicons:pause-circle" class="w-5 h-5" />
                    </button>
                    <button 
                      v-if="user.status === 'suspended' || user.status === 'pending'"
                      @click="updateStatus(user.id, 'active')" 
                      class="p-2 text-primary-600 hover:bg-primary/5 rounded-lg transition-all"
                      title="Activar"
                    >
                      <Icon name="heroicons:play-circle" class="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
});

const users = ref([]);
const loading = ref(false);
const searchQuery = ref('');

const fetchUsers = async () => {
  loading.value = true;
  try {
    const data = await $fetch('/api/admin/users');
    users.value = data;
  } catch (err) {
    console.error('Error fetching users:', err);
  } finally {
    loading.value = false;
  }
};

const updateStatus = async (userId, newStatus) => {
  try {
    const response = await $fetch(`/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: { status: newStatus }
    });
    if (response.success) {
      // Refresh local list
      await fetchUsers();
    }
  } catch (err) {
    console.error('Error updating status:', err);
    alert('Error al actualizar el estado: ' + (err.data?.statusMessage || err.message));
  }
};

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const query = searchQuery.value.toLowerCase();
  return users.value.filter(u => 
    u.name.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query)
  );
});

const pendingCount = computed(() => users.value.filter(u => u.status === 'pending').length);
const activeCount = computed(() => users.value.filter(u => u.status === 'active').length);

const roleOptions = {
  'admin': 'Administrador',
  'encargado': 'Encargado',
  'vendedor': 'Vendedor',
  'operario': 'Operario',
  'reseller': 'Reseller',
  'canastero': 'Canastero',
  'user': 'Usuario'
};

const updateRole = async (userId, newRole) => {
  try {
    const response = await $fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: { role: newRole }
    });
    if (response.success) {
      await fetchUsers();
    }
  } catch (err) {
    console.error('Error updating role:', err);
    alert('Error al actualizar el rol: ' + (err.data?.statusMessage || err.message));
  }
};

const formatStatus = (status) => {
  const statuses = {
    'pending': 'Pendiente',
    'active': 'Activo',
    'suspended': 'Suspendido'
  };
  return statuses[status] || status;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  pending: 'bg-amber-50 text-amber-700 border border-amber-100',
  suspended: 'bg-red-50 text-red-700 border border-red-100'
};

const statusDotStyles = {
  active: 'bg-emerald-500',
  pending: 'bg-amber-500',
  suspended: 'bg-red-500'
};

onMounted(() => {
  // Verificación de seguridad adicional
  const authStore = useAuthStore();
  if (authStore.user?.role !== 'admin') {
    navigateTo('/admin');
    return;
  }
  fetchUsers();
});
</script>

<style scoped>
.font-poppins {
  font-family: 'Poppins', sans-serif;
}
</style>
