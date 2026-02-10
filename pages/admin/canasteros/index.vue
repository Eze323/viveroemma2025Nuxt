<template>
  <div class="p-4 sm:p-6 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Panel de Canasteros</h1>
        <p class="text-sm text-gray-500">Gestiona accesos, puntos y competencia.</p>
      </div>
      <NuxtLink 
        to="/admin/canasteros/register" 
        class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-primary-200 transition-all text-sm font-bold"
      >
        <Icon name="heroicons:user-plus" class="w-5 h-5" />
        Nuevo Canastero
      </NuxtLink>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div 
        v-for="(top, index) in topThree" 
        :key="top.id" 
        class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <div :class="rankColor(index)" class="w-10 h-10 rounded-full flex items-center justify-center text-white font-black">
            {{ index + 1 }}
          </div>
          <div>
            <p class="font-bold text-gray-900">{{ top.name }}</p>
            <p class="text-xs text-gray-500 uppercase">{{ top.points }} Puntos</p>
          </div>
        </div>
        <Icon 
          :name="index === 0 ? 'heroicons:trophy' : 'heroicons:star'" 
          :class="index === 0 ? 'text-yellow-400' : 'text-gray-300'" 
          class="w-8 h-8" 
        />
      </div>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Canastero</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Puntos</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Estado</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="reseller in resellers" :key="reseller.id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-bold text-gray-900">{{ reseller.name }}</div>
                <div class="text-xs text-gray-500">{{ reseller.email }}</div>
              </td>
              <td class="px-6 py-4 text-center font-mono font-bold text-primary-600">
                {{ reseller.points }}
              </td>
              <td class="px-6 py-4 text-center">
                <span 
                  :class="reseller.role !== 'suspendido' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                  class="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider"
                >
                  {{ reseller.role !== 'suspendido' ? 'Activo' : 'Suspendido' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button 
                  @click="toggleStatus(reseller)"
                  :disabled="updating === reseller.id"
                  :class="reseller.role !== 'suspendido' ? 'text-red-600 hover:bg-red-50' : 'text-blue-600 hover:bg-blue-50'"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-30"
                >
                  {{ reseller.role !== 'suspendido' ? 'Suspender' : 'Re-activar' }}
                </button>
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

const resellers = ref([]);
const updating = ref(null);

const fetchResellers = async () => {
  // Aquí llamamos a los usuarios con rol 'reseller' o 'suspendido'
  const data = await $fetch('/api/admin/resellers');
  resellers.value = data;
};

// Top 3 para el ranking
const topThree = computed(() => {
  return [...resellers.value]
    .filter(r => r.role !== 'suspendido')
    .sort((a, b) => b.points - a.points)
    .slice(0, 3);
});

const rankColor = (index) => {
  const colors = ['bg-yellow-400', 'bg-slate-400', 'bg-amber-600'];
  return colors[index] || 'bg-gray-200';
};

const toggleStatus = async (reseller) => {
  updating.value = reseller.id;
  const newRole = reseller.role === 'suspendido' ? 'reseller' : 'suspendido';
  
  try {
    await $fetch(`/api/admin/resellers/${reseller.id}/status`, {
      method: 'PATCH',
      body: { role: newRole }
    });
    reseller.role = newRole; // Update local state
  } catch (err) {
    alert('Error al cambiar el estado');
  } finally {
    updating.value = null;
  }
};

onMounted(fetchResellers);

definePageMeta({ layout: 'admin' });
</script>