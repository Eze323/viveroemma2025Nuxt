<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium text-gray-900">Ventas Recientes</h3>
      <button class="text-primary hover:text-primary-dark text-sm font-medium">
        Ver todas
      </button>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Productos
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(sale, index) in sales" :key="index" class="hover:bg-gray-50">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">#{{ sale.id }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="ml-2">
                  <div class="text-sm font-medium text-gray-900">{{ sale.customer }}</div>
                  <div class="text-xs text-gray-500">{{ sale.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ sale.items }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">${{ sale.total.toLocaleString() }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ sale.date }}</div>
              <div class="text-xs text-gray-500">{{ sale.time }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(sale.status)">
                {{ sale.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="mt-4 text-center" v-if="sales.length === 0">
      <p class="text-gray-500">No hay ventas recientes</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  sales: {
    type: Array,
    default: () => []
  }
});

// Get status class based on status
const getStatusClass = (status) => {
  const statusMap = {
    'Completada': 'bg-success/10 text-success',
    'Pendiente': 'bg-warning/10 text-warning',
    'Cancelada': 'bg-error/10 text-error',
    'Procesando': 'bg-primary/10 text-primary'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};
</script>