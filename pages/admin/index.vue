<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Vivero Emma</h1>
          <p class="mt-1 text-sm text-gray-600">Bienvenido de vuelta, {{ authStore.user?.name || 'Usuario' }}</p>
          <p class="text-xs text-gray-500 italic">{{ configStore.simpleDashboard ? 'Modo Pizarra Activo' : 'Panel de Control' }}</p>
        </div>

        <button 
          @click="refreshData" 
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-700"
          :disabled="dashboardStore.isLoading"
        >
          <Icon 
            name="heroicons:arrow-path" 
            :class="['w-5 h-5', { 'animate-spin': dashboardStore.isLoading }]" 
          />
          <span class="hidden sm:inline text-sm font-medium">Actualizar</span>
        </button>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div v-if="dashboardStore.isLoading && !recentSales.length" class="flex justify-center py-12">
        <Icon name="heroicons:arrow-path" class="w-10 h-10 animate-spin text-primary-600" />
      </div>

      <template v-else>
        <SimpleDashboard 
          v-if="configStore.simpleDashboard"
          :totalHoy="totalHoy" 
          :productsToday="productsToday"
          :sales="recentSales"
        />

        <ComplexDashboard 
          v-else
          :stats="dashboardStore.stats"
          :chartData="chartData"
          :topSellers="topSellers"
          :recentSales="recentSales"
        />
      </template>
    </main>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useConfigStore } from '~/stores/config';
import { useDashboardStore } from '~/stores/dashboard';
import SimpleDashboard from '~/components/admin/Dashboard/SimpleDashboard.vue';
import ComplexDashboard from '~/components/admin/Dashboard/ComplexDashboard.vue';

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
});

const authStore = useAuthStore();
const configStore = useConfigStore();
const dashboardStore = useDashboardStore();

// Lógica de refresco
const refreshData = () => {
  dashboardStore.fetchDashboardData();
  
};

let intervalId = null;

onMounted(() => {
  refreshData();

  // 1. Polling: Actualizar cada 60 segundos
  intervalId = setInterval(refreshData, 60000);

  // 2. Re-validar cuando el usuario vuelve a la pestaña (Focus)
  window.addEventListener('focus', refreshData);
});

onUnmounted(() => {
  // Limpiamos para evitar fugas de memoria
  if (intervalId) clearInterval(intervalId);
  window.removeEventListener('focus', refreshData);
});

// Use store data
const topSellers = computed(() => dashboardStore.topSellers);
const recentSales = computed(() => dashboardStore.recentSales);

// Datos estáticos para el gráfico (por ahora)
const chartData = {
  labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
  datasets: [
    {
      label: 'Ventas',
      data: [12, 19, 3, 5, 2, 3, 9],
      borderColor: '#4ade80',
      backgroundColor: 'rgba(74, 222, 128, 0.2)',
      tension: 0.4
    }
  ]
};

const totalHoy = computed(() => dashboardStore.stats.revenueToday);
const productsToday = computed(() => dashboardStore.stats.productsToday);
</script>