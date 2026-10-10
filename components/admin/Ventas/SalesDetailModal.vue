<!-- components/SalesDetailModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
      <h2 class="text-xl font-bold mb-4">Detalles de la Venta #{{ sale.id }}</h2>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p><strong>Cliente:</strong> {{ sale.customer }}</p>
          <p><strong>Email:</strong> {{ sale.email || '-' }}</p>
          <p><strong>Vendedor:</strong> {{ sale.seller }}</p>
          <p v-if="sale.doc_number || sale.docNumber">
            <strong>{{ (sale.doc_type || sale.docType) === 80 ? 'CUIT:' : 'Documento:' }}</strong> 
            {{ sale.doc_number || sale.docNumber }}
          </p>
        </div>
        <div>
          <p><strong>Fecha:</strong> {{ formatDate(sale.date) }}</p>
          <p><strong>Hora:</strong> {{ sale.time || '-' }}</p>
          <p><strong>Estado:</strong> {{ sale.status }}</p>
          <p><strong>Total:</strong> ${{ sale.total_price }}</p>
          <p v-if="sale.invoice_type || sale.invoiceType">
            <strong>Comprobante:</strong> 
            {{ (sale.invoice_type || sale.invoiceType) === 1 ? 'Factura A' : ((sale.invoice_type || sale.invoiceType) === 6 ? 'Factura B' : ((sale.invoice_type || sale.invoiceType) === 11 ? 'Factura C' : 'Ticket/Presupuesto')) }}
            <span v-if="sale.invoice_number || sale.invoiceNumber">
              (Nº {{ sale.invoice_number || sale.invoiceNumber }})
            </span>
          </p>
        </div>
      </div>

      <!-- CAE Info si está facturada -->
      <div v-if="sale.cae" class="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-900">
        <p><strong>CAE ARCA:</strong> <span class="font-mono">{{ sale.cae }}</span></p>
        <p v-if="sale.cae_expiration || sale.caeExpiration">
          <strong>Vencimiento CAE:</strong> {{ formatDate(sale.cae_expiration || sale.caeExpiration) }}
        </p>
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