<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <!-- Header -->
    <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">Ventas Recientes</h3>
    </div>

    <!-- Mobile Card View -->
    <div class="block md:hidden divide-y divide-gray-200">
      <div 
        v-for="sale in sales" 
        :key="sale.id"
        class="p-4 hover:bg-gray-50 transition-colors duration-150"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ sale.customer }}</p>
            <p class="text-xs text-gray-500 truncate">{{ sale.email }}</p>
          </div>
          <span 
            class="badge ml-2 flex-shrink-0"
            :class="getStatusClass(sale.status)"
          >
            {{ sale.status }}
          </span>
        </div>
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-4 text-gray-600">
            <span class="flex items-center gap-1">
              <Icon name="heroicons:shopping-bag" class="w-4 h-4" />
              {{ sale.items }}
            </span>
            <span class="flex items-center gap-1">
              <Icon name="heroicons:calendar" class="w-4 h-4" />
              {{ sale.date }}
            </span>
          </div>
          <span class="font-semibold text-gray-900">${{ sale.total.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="sale in sales" 
            :key="sale.id"
            class="hover:bg-gray-50 transition-colors duration-150"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ sale.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ sale.customer }}</div>
                  <div class="text-xs text-gray-500">{{ sale.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ sale.items }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
              ${{ sale.total.toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              <div>{{ sale.date }}</div>
              <div class="text-xs text-gray-500">{{ sale.time }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="badge"
                :class="getStatusClass(sale.status)"
              >
                {{ sale.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-primary hover:text-primary-dark transition-colors">
                Ver detalles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer with pagination -->
    <div class="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
      <div class="text-sm text-gray-600">
        Mostrando <span class="font-medium">{{ sales.length }}</span> ventas
      </div>
      <div class="flex gap-2">
        <button class="btn-ghost px-3 py-1 text-sm rounded-lg">
          Anterior
        </button>
        <button class="btn-ghost px-3 py-1 text-sm rounded-lg">
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sales: {
    type: Array,
    required: true
  }
});

// Status badge styling
const getStatusClass = (status) => {
  const classes = {
    'Completada': 'badge-success',
    'Procesando': 'badge-info',
    'Pendiente': 'badge-warning',
    'Cancelada': 'badge-error'
  };
  return classes[status] || 'badge-info';
};
</script>