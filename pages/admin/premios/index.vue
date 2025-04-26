<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Premios y Reconocimientos</h1>
        <p class="text-gray-600">Gestiona los premios para los vendedores destacados</p>
      </div>
      <button class="btn btn-primary">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Nuevo Premio
      </button>
    </div>

    <!-- Top Sellers Podium -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-6">Top Vendedores del Mes</h2>
      <div class="flex justify-center items-end space-x-8">
        <!-- Second Place -->
        <div class="text-center">
          <div class="w-24 h-24 mx-auto mb-4 relative">
            <div class="w-20 h-20 rounded-full bg-primary-100 mx-auto flex items-center justify-center">
              <span class="text-2xl font-bold text-primary">{{ getInitials(topSellers[1]?.name) }}</span>
            </div>
            <div class="absolute -bottom-2 right-0 bg-secondary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
              2
            </div>
          </div>
          <div class="bg-gray-100 h-32 rounded-t-lg px-4 pt-4">
            <p class="font-medium text-gray-900">{{ topSellers[1]?.name }}</p>
            <p class="text-sm text-gray-500">{{ topSellers[1]?.sales }} ventas</p>
            <p class="text-lg font-bold text-primary mt-2">${{ topSellers[1]?.amount.toLocaleString() }}</p>
          </div>
        </div>

        <!-- First Place -->
        <div class="text-center">
          <div class="w-32 h-32 mx-auto mb-4 relative">
            <div class="w-28 h-28 rounded-full bg-accent-100 mx-auto flex items-center justify-center">
              <span class="text-3xl font-bold text-accent">{{ getInitials(topSellers[0]?.name) }}</span>
            </div>
            <div class="absolute -bottom-2 right-0 bg-accent text-white rounded-full w-10 h-10 flex items-center justify-center text-xl font-bold">
              1
            </div>
          </div>
          <div class="bg-gray-100 h-40 rounded-t-lg px-4 pt-4">
            <p class="font-medium text-gray-900">{{ topSellers[0]?.name }}</p>
            <p class="text-sm text-gray-500">{{ topSellers[0]?.sales }} ventas</p>
            <p class="text-xl font-bold text-primary mt-2">${{ topSellers[0]?.amount.toLocaleString() }}</p>
          </div>
        </div>

        <!-- Third Place -->
        <div class="text-center">
          <div class="w-24 h-24 mx-auto mb-4 relative">
            <div class="w-20 h-20 rounded-full bg-primary-100 mx-auto flex items-center justify-center">
              <span class="text-2xl font-bold text-primary">{{ getInitials(topSellers[2]?.name) }}</span>
            </div>
            <div class="absolute -bottom-2 right-0 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold">
              3
            </div>
          </div>
          <div class="bg-gray-100 h-24 rounded-t-lg px-4 pt-4">
            <p class="font-medium text-gray-900">{{ topSellers[2]?.name }}</p>
            <p class="text-sm text-gray-500">{{ topSellers[2]?.sales }} ventas</p>
            <p class="text-lg font-bold text-primary mt-2">${{ topSellers[2]?.amount.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Rewards History -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-medium text-gray-900">Historial de Premios</h2>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendedor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Premio
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Logro
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="reward in rewards" :key="reward.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="font-medium text-primary">{{ getInitials(reward.seller) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ reward.seller }}</div>
                    <div class="text-sm text-gray-500">ID: {{ reward.sellerId }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ reward.prize }}</div>
                <div class="text-sm text-gray-500">${{ reward.value.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ reward.achievement }}</div>
                <div class="text-sm text-gray-500">{{ reward.period }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ reward.date }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" 
                  :class="getStatusClass(reward.status)">
                  {{ reward.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-primary-dark mr-3">
                  <Icon name="heroicons:pencil-square" class="w-5 h-5" />
                </button>
                <button class="text-error hover:text-error-dark">
                  <Icon name="heroicons:trash" class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="btn btn-outline">Anterior</button>
            <button class="btn btn-outline">Siguiente</button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">1</span> a <span class="font-medium">10</span> de{' '}
                <span class="font-medium">20</span> premios
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button class="btn btn-outline rounded-l-md">Anterior</button>
                <button class="btn btn-primary">1</button>
                <button class="btn btn-outline">2</button>
                <button class="btn btn-outline rounded-r-md">Siguiente</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'admin'
});

// Mock data for top sellers
const topSellers = ref([
  {
    name: 'María López',
    sales: 45,
    amount: 85000
  },
  {
    name: 'Juan Pérez',
    sales: 38,
    amount: 72000
  },
  {
    name: 'Ana García',
    sales: 32,
    amount: 65000
  }
]);

// Mock data for rewards
const rewards = ref([
  {
    id: 1,
    seller: 'María López',
    sellerId: 'VE001',
    prize: 'Bono Mensual',
    value: 5000,
    achievement: 'Mayor volumen de ventas',
    period: 'Abril 2025',
    date: '2025-04-01',
    status: 'Entregado'
  },
  {
    id: 2,
    seller: 'Juan Pérez',
    sellerId: 'VE002',
    prize: 'Vale de Compra',
    value: 2500,
    achievement: 'Mejor conversión',
    period: 'Marzo 2025',
    date: '2025-03-01',
    status: 'Pendiente'
  },
  {
    id: 3,
    seller: 'Ana García',
    sellerId: 'VE003',
    prize: 'Día Libre',
    value: 1500,
    achievement: 'Meta superada',
    period: 'Marzo 2025',
    date: '2025-03-15',
    status: 'Entregado'
  }
]);

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Helper function to get status class
const getStatusClass = (status) => {
  const statusMap = {
    'Entregado': 'bg-success/10 text-success',
    'Pendiente': 'bg-warning/10 text-warning',
    'Cancelado': 'bg-error/10 text-error'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};
</script>