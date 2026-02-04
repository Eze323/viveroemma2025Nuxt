<template>
   <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
  
    <div class="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div>
            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Vivero Emma</h1>
            <p class="mt-1 text-sm text-gray-600">Bienvenido de vuelta, {{ authStore.user?.name || 'Usuario' }}</p>
           <p class="text-xs text-gray-500 italic">{{ configStore.simpleDashboard ? 'Modo Pizarra Activo' : 'Panel de Control' }}</p>
        </div>
        <!-- <div class="flex items-center gap-2">
  <span class="text-sm font-medium">Modo Papel:</span>
  <input 
    type="checkbox" 
    v-model="configStore.simpleDashboard" 
    class="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-primary-600 relative cursor-pointer transition-colors"
  >
</div> -->
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      <SimpleDashboard 
        v-if="configStore.simpleDashboard"
        :totalHoy="totalHoy" 
        :sales="recentSales"
      />

      <ComplexDashboard v-else
        :stats="dashboardStore.stats"
        :chartData="chartData"
        :topSellers="topSellers"
        :recentSales="recentSales"
      />

    </main>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
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

onMounted(() => {
  dashboardStore.fetchDashboardData();
});

// Use store data
const topSellers = computed(() => dashboardStore.topSellers);
const recentSales = computed(() => dashboardStore.recentSales);

// TODO: Implement real chart data endpoint. For now, we use static data or derive if possible.
// This matches the ComplexDashboard expectation usually.
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

// Compute daily total for SimpleDashboard (includes both admin sales and reseller orders)
const totalHoy = computed(() => {
    const today = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return dashboardStore.recentSales
        .filter(s => s.date === today)
        .reduce((sum, s) => sum + s.total, 0);
});

</script>