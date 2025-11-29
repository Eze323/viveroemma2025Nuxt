<template>
  <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Top Vendedores</h3>
      <button class="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
        Ver todos
      </button>
    </div>

    <!-- Sellers List -->
    <div class="space-y-4">
      <div 
        v-for="(seller, index) in sellers" 
        :key="seller.id"
        class="group hover:bg-gray-50 rounded-lg p-3 transition-all duration-200 cursor-pointer"
      >
        <div class="flex items-center gap-4">
          <!-- Rank Badge -->
          <div 
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
            :class="getRankClass(index)"
          >
            {{ index + 1 }}
          </div>

          <!-- Seller Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-sm font-semibold text-gray-900 truncate">{{ seller.name }}</h4>
              <span class="text-sm font-bold text-gray-900 ml-2">${{ seller.sales.toLocaleString() }}</span>
            </div>
            
            <!-- Progress Bar -->
            <div class="w-full bg-gray-100 rounded-full h-2 mb-2">
              <div 
                class="h-2 rounded-full transition-all duration-500"
                :class="getProgressClass(index)"
                :style="{ width: seller.conversionRate + '%' }"
              ></div>
            </div>
            
            <!-- Stats -->
            <div class="flex items-center gap-4 text-xs text-gray-600">
              <span class="flex items-center gap-1">
                <Icon name="heroicons:shopping-cart" class="w-3 h-3" />
                {{ seller.orders }} ventas
              </span>
              <span class="flex items-center gap-1">
                <Icon name="heroicons:cube" class="w-3 h-3" />
                {{ seller.products }} productos
              </span>
              <span class="flex items-center gap-1">
                <Icon name="heroicons:chart-bar" class="w-3 h-3" />
                {{ seller.conversionRate }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!sellers || sellers.length === 0" class="text-center py-12">
      <Icon name="heroicons:user-group" class="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p class="text-sm text-gray-500">No hay vendedores para mostrar</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sellers: {
    type: Array,
    required: true
  }
});

// Rank badge styling
const getRankClass = (index) => {
  if (index === 0) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white';
  if (index === 1) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white';
  if (index === 2) return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white';
  return 'bg-gray-100 text-gray-600';
};

// Progress bar color
const getProgressClass = (index) => {
  if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
  if (index === 1) return 'bg-gradient-to-r from-gray-400 to-gray-600';
  if (index === 2) return 'bg-gradient-to-r from-orange-400 to-orange-600';
  return 'bg-gradient-to-r from-primary to-primary-dark';
};
</script>