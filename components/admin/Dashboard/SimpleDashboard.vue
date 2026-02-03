<template>
  <div class="space-y-6">
    <div class="bg-primary-600 rounded-3xl p-8 text-center text-white shadow-xl">
      <h3 class="text-xl opacity-80 uppercase tracking-wider font-bold tracking-widest">Vendido hoy</h3>
      <div class="text-6xl sm:text-7xl font-black my-4">
        $ {{ totalHoy.toLocaleString() }}
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

    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
        <Icon name="heroicons:document-text" class="text-gray-400" /> ÚLTIMAS ANOTADAS
      </h3>
      <div class="divide-y divide-gray-100">
        <div v-for="venta in sales" :key="venta.id" class="py-4 flex justify-between items-center">
          <div>
            <p class="font-bold text-gray-900 text-lg">{{ venta.customer || 'Cliente Mostrador' }}</p>
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
  sales: {
    type: Array,
    default: () => []
  }
});
</script>