<template>
  <div class="space-y-6">
    <div class="bg-primary-600 rounded-3xl p-8 text-center text-white shadow-xl">
      <h3 class="text-xl opacity-80 uppercase tracking-wider font-bold tracking-widest">Vendido hoy</h3>
      <div class="text-6xl sm:text-7xl font-black my-4">
        $ {{ totalHoy.toLocaleString() }}
      </div>
      <div v-if="productsToday" class="text-xl font-bold opacity-90 mb-4 bg-white/20 inline-block px-4 py-1 rounded-full">
        {{ productsToday }} plantas hoy
      </div>
      <p class="text-lg italic opacity-90">"Igual que en el cuaderno, pero más fácil"</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <NuxtLink to="/admin/ventas" class="bg-white border-4 border-primary-500 rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform">
        <div class="bg-primary-100 p-4 rounded-full">
          <Icon name="heroicons:shopping-cart" class="w-10 h-10 text-primary-600" />
        </div>
        <span class="text-2xl font-bold text-gray-800">NUEVA VENTA</span>
      </NuxtLink>

      <NuxtLink to="/admin/productos" class="bg-white border-4 border-gray-100 rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform">
        <div class="bg-gray-100 p-4 rounded-full">
          <Icon name="heroicons:plus-circle" class="w-10 h-10 text-gray-600" />
        </div>
        <span class="text-2xl font-bold text-gray-800">PRODUCTOS</span>
      </NuxtLink>
    </div>

    <!-- Rankings Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Top Sellers Ranking -->
      <div v-if="topSellers?.length" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
          <Icon name="heroicons:trophy" class="text-yellow-500" /> RANKING VENDEDORES
        </h3>
        <div class="divide-y divide-gray-100">
          <div v-for="(seller, index) in topSellers" :key="seller.id" class="py-3 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-xs font-bold text-gray-500">
                {{ index + 1 }}
              </span>
              <div>
                <p class="font-bold text-gray-900">{{ seller.name }}</p>
                <p class="text-xs text-gray-500">{{ seller.products }} plantas - {{ seller.orders }} ventas</p>
              </div>
            </div>
            <div class="text-right">
              <span class="font-bold text-primary-600">$ {{ seller.sales.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Customers Ranking -->
      <div v-if="topCustomers?.length" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
          <Icon name="heroicons:users" class="text-blue-500" /> RANKING CLIENTES
        </h3>
        <div class="divide-y divide-gray-100">
          <div v-for="(customer, index) in topCustomers" :key="customer.name" class="py-3 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="w-6 h-6 flex items-center justify-center bg-blue-50 rounded-full text-xs font-bold text-blue-500">
                {{ index + 1 }}
              </span>
              <div>
                <p class="font-bold text-gray-900">{{ customer.name }}</p>
                <p class="text-xs text-gray-500">{{ customer.products }} plantas en {{ customer.orders }} compras</p>
              </div>
            </div>
            <div class="text-right">
              <span class="font-bold text-green-600">$ {{ customer.sales.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Sales -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
        <Icon name="heroicons:document-text" class="text-gray-400" /> ÚLTIMAS ANOTADAS
      </h3>
      <div class="divide-y divide-gray-100">
        <div v-for="venta in sales" :key="venta.id" class="py-4 flex justify-between items-center">
          <div>
            <div class="flex items-center gap-2">
              <p class="font-bold text-gray-900 text-lg">{{ venta.customer || 'Cliente Mostrador' }}</p>
              <span 
                v-if="venta.type === 'reseller'" 
                class="px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 rounded-full"
              >
                CANASTERO
              </span>
              <span 
                v-else-if="venta.type === 'admin'" 
                class="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-full"
              >
                VENTA DIRECTA
              </span>
            </div>
            <p class="text-sm text-gray-500">{{ venta.time }} - {{ venta.items }} productos</p>
          </div>
          <div class="text-right">
            <span class="text-2xl font-black text-green-600">$ {{ venta.total.toLocaleString() }}</span>
            <p class="text-[10px] uppercase font-bold text-gray-400">{{ venta.status }}</p>
          </div>
        </div>
      </div>
      
      <UButton to="/admin/ventas" variant="ghost" block class="mt-4">Ver todas las ventas</UButton>
    </div>
  </div>
</template>

<script setup>
// Aquí es donde definimos cómo recibimos los datos
const props = defineProps({
  totalHoy: {
    type: Number,
    default: 0
  },
  productsToday: {
    type: Number,
    default: 0
  },
  sales: {
    type: Array,
    default: () => []
  },
  topSellers: {
    type: Array,
    default: () => []
  },
  topCustomers: {
    type: Array,
    default: () => []
  }
});
</script>
