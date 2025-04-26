<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium text-gray-900">Top Vendedores</h3>
      <button class="text-primary hover:text-primary-dark text-sm font-medium">
        Ver todos
      </button>
    </div>
    
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vendedor
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ventas
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Productos
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conversión
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Premio
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(seller, index) in sellers" :key="index" class="hover:bg-gray-50">
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-primary font-medium">{{ getInitials(seller.name) }}</span>
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-900">{{ seller.name }}</div>
                  <div class="text-xs text-gray-500">{{ seller.id }}</div>
                </div>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">${{ seller.sales.toLocaleString() }}</div>
              <div class="text-xs text-gray-500">{{ seller.orders }} órdenes</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ seller.products }}</div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div class="bg-primary h-2.5 rounded-full" :style="`width: ${seller.conversionRate}%`"></div>
                </div>
                <span class="text-sm text-gray-900">{{ seller.conversionRate }}%</span>
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap">
              <span v-if="index < 3" class="px-2 py-1 text-xs rounded-full" :class="getRewardClass(index)">
                {{ getRewardText(index) }}
              </span>
              <span v-else class="text-sm text-gray-500">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  sellers: {
    type: Array,
    default: () => []
  }
});

// Get initials from name
const getInitials = (name) => {
  return name.split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Get reward class based on ranking
const getRewardClass = (index) => {
  const classes = [
    'bg-accent-100 text-accent-600',
    'bg-secondary-100 text-secondary-600',
    'bg-primary-100 text-primary-600'
  ];
  return classes[index] || '';
};

// Get reward text based on ranking
const getRewardText = (index) => {
  const rewards = ['Oro', 'Plata', 'Bronce'];
  return rewards[index] || '';
};
</script>