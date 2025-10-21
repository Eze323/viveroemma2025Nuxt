<!-- components/SalesDetailModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
      <h2 class="text-xl font-bold mb-4">Detalles de la Venta #{{ sale.id }}</h2>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p><strong>Cliente:</strong> {{ sale.customer }}</p>
          <p><strong>Email:</strong> {{ sale.email }}</p>
          <p><strong>Vendedor:</strong> {{ sale.seller }}</p>
        </div>
        <div>
          <p><strong>Fecha:</strong> {{ formatDate(sale.date) }}</p>
          <p><strong>Hora:</strong> {{ sale.time }}</p>
          <p><strong>Estado:</strong> {{ sale.status }}</p>
          <p><strong>Total:</strong> ${{ sale.total_price }}</p>
        </div>
      </div>

      <h3 class="text-lg font-semibold mb-2">Ítems</h3>
      <table class="min-w-full border">
        <thead>
          <tr>
            <th class="px-4 py-2 border">Producto</th>
            <th class="px-4 py-2 border">Cantidad</th>
            <th class="px-4 py-2 border">Precio Unitario</th>
            <th class="px-4 py-2 border">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in sale.sale_items" :key="item.id">
            <td class="px-4 py-2 border">{{ item.product_name }}</td>
            <td class="px-4 py-2 border">{{ item.quantity }}</td>
            <td class="px-4 py-2 border">${{ item.unit_price }}</td>
            <td class="px-4 py-2 border">${{ item.subtotal }}</td>
          </tr>
        </tbody>
      </table>

      <button 
        @click="$emit('close')" 
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  sale: Object,
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};
</script>