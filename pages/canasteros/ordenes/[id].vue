<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-white border-b border-gray-200 px-4 py-4 flex items-center mb-4">
      <NuxtLink to="/canasteros" class="mr-4">
        <Icon name="heroicons:arrow-left" class="w-6 h-6 text-gray-700" />
      </NuxtLink>
      <h1 class="text-xl font-bold text-gray-900">Detalle del Pedido #{{ route.params.id }}</h1>
    </div>

    <div v-if="loading" class="text-center py-12">Cargando...</div>
    <div v-else-if="!order" class="text-center py-12">No se encontró el pedido.</div>

    <div v-else class="px-4">
      <!-- Status Banner -->
      <div :class="['p-4 rounded-lg mb-6 text-center', getStatusClass(order.status)]">
        <h2 class="font-bold text-lg mb-1">{{ formatStatus(order.status) }}</h2>
        <p class="text-sm opacity-90" v-if="order.status === 'pending_payment'">
            Realiza la transferencia para procesar tu pedido.
        </p>
      </div>

      <!-- Payment Info (Only if pending) -->
      <div v-if="order.status === 'pending_payment'" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 class="font-bold text-gray-900 mb-4 flex items-center">
            <Icon name="heroicons:banknotes" class="w-5 h-5 mr-2 text-primary" />
            Datos Bancarios
        </h3>
        <div class="space-y-3 text-sm text-gray-600 bg-gray-50 p-4 rounded border border-gray-100">
            <p><span class="font-medium text-gray-900">Banco:</span> BBVA Argentina S.A. </p>
            <p><span class="font-medium text-gray-900">CBU:</span> 0170151340000003327269</p>
            <p><span class="font-medium text-gray-900">Alias:</span> VIVERO.EMMITA</p>
            <p><span class="font-medium text-gray-900">Titular:</span> Irace Alberto Ez</p>
        </div>
      </div>

      <!-- Upload Proof -->
      <div v-if="order.status === 'pending_payment'" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <h3 class="font-bold text-gray-900 mb-4">Comprobante de Pago</h3>
        
        <div v-if="!uploading && !order.paymentProofUrl">
            <input 
                type="file" 
                accept="image/*" 
                @change="handleFileUpload" 
                class="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-50 file:text-primary
                  hover:file:bg-primary-100
                "
            />
        </div>
        <div v-else-if="uploading" class="text-center py-4">
            <p class="text-primary animate-pulse">Subiendo comprobante...</p>
        </div>
         <div v-else class="text-center py-4">
            <p class="text-green-600 font-medium mb-2">Comprobante subido correctamente</p>
            <img :src="order.paymentProofUrl" class="w-full max-h-48 object-contain rounded border border-gray-200" />
        </div>
      </div>

       <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-4">
         <h3 class="font-bold text-gray-900 mb-4">Items del Pedido</h3>
         <div class="overflow-x-auto">
             <table class="w-full text-sm text-left">
                 <thead class="bg-gray-50 text-gray-700 font-medium">
                     <tr>
                         <th class="px-4 py-2">Producto</th>
                         <th class="px-4 py-2 text-center">Cant.</th>
                         <th class="px-4 py-2 text-right">Precio</th>
                         <th class="px-4 py-2 text-right">Subtotal</th>
                     </tr>
                 </thead>
                 <tbody class="divide-y divide-gray-100">
                     <tr v-for="item in order.items" :key="item.id">
                         <td class="px-4 py-3 flex items-center">
                             <img :src="item.productImage || '/placeholder.png'" class="w-8 h-8 rounded object-cover mr-2" />
                             {{ item.productName }}
                         </td>
                         <td class="px-4 py-3 text-center">{{ item.quantity }}</td>
                         <td class="px-4 py-3 text-right">${{ item.unitPrice }}</td>
                         <td class="px-4 py-3 text-right font-medium">${{ item.subtotal }}</td>
                     </tr>
                 </tbody>
             </table>
         </div>
       </div>

       <!-- Order Summary -->
       <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 class="font-bold text-gray-900 mb-4">Resumen</h3>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Total</span>
            <span class="font-bold text-gray-900">${{ order.total }}</span>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

definePageMeta({
  middleware: ['auth'],
  layout: 'canastero'
});

const route = useRoute();
const order = ref(null);
const loading = ref(true);
const uploading = ref(false);

const fetchOrder = async () => {
    loading.value = true;
    try {
        const { data, success } = await $fetch(`/api/reseller/orders/${route.params.id}`);
        if(success) {
            order.value = data;
        } else {
            console.error('Failed to load order');
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
}

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if(!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione una imagen válida.');
        return;
    }

    uploading.value = true;
    const formData = new FormData();
    formData.append('image', file);

    try {
        // Upload to ImgBB
        const { data: uploadData, error: uploadError } = await useFetch('/api/upload/imgbb', {
            method: 'POST',
            body: formData,
        });

        if (uploadError.value) {
            throw new Error(uploadError.value.statusMessage || 'Error al subir imagen');
        }

        const imageUrl = uploadData.value?.url;

        if (imageUrl) {
            // Save proof URL to order
            const { success, error: saveError } = await $fetch('/api/reseller/upload-proof', {
                method: 'POST',
                body: {
                    orderId: route.params.id,
                    proofUrl: imageUrl
                }
            });

            if (success) {
                order.value.paymentProofUrl = imageUrl;
                order.value.status = 'paid'; // Optimistic update
                alert('Comprobante subido exitosamente. Esperando aprobación.');
            } else {
                throw new Error(saveError || 'Error al guardar el comprobante');
            }
        }
    } catch (e) {
        console.error('Error uploading proof:', e);
        alert('Ocurrió un error al subir el comprobante. Intente nuevamente.');
    } finally {
        uploading.value = false;
        // Reset input if needed
        event.target.value = '';
    }
}

const getStatusClass = (status) => {
    switch(status) {
        case 'pending_payment': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'paid': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'completed': return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const formatStatus = (status) => {
    const map = {
        'pending_payment': 'Pendiente de Pago',
        'paid': 'Verificando Pago',
        'completed': 'Pedido Completado',
        'cancelled': 'Cancelado'
    };
    return map[status] || status;
}

onMounted(() => {
    fetchOrder();
});
</script>
