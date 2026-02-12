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
      <div :class="['p-4 rounded-lg mb-6 text-center border', getStatusClass(order.status)]">
        <h2 class="font-bold text-lg mb-1">{{ formatStatus(order.status) }}</h2>
        <p class="text-sm opacity-90" v-if="order.status === 'pending_payment'">
            Realiza la transferencia para procesar tu pedido.
        </p>
      </div>

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

      <div v-if="order.status === 'pending_payment' || order.paymentProofUrl" class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
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
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
            <p class="text-primary font-medium">Subiendo comprobante...</p>
        </div>
         <div v-else class="text-center py-4">
            <p class="text-green-600 font-medium mb-2 flex items-center justify-center gap-1">
                <Icon name="heroicons:check-badge" class="w-5 h-5" />
                Comprobante enviado
            </p>
            <img :src="order.paymentProofUrl" class="w-full max-h-48 object-contain rounded border border-gray-200 bg-gray-50" />
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

       <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <h3 class="font-bold text-gray-900 mb-4">Resumen</h3>
          <div class="flex justify-between mb-2">
            <span class="text-gray-600">Total del Pedido</span>
            <span class="font-bold text-gray-900 text-lg">${{ order.total }}</span>
          </div>
       </div>
    </div>

    <NotificationModal 
      :is-open="modal.show"
      :message="modal.message"
      :type="modal.type"
      @close="modal.show = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

// Estado del Modal
const modal = ref({ show: false, message: '', type: 'success' });

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

    if (!file.type.startsWith('image/')) {
        modal.value = {
            show: true,
            message: 'Por favor seleccione una imagen válida (JPG, PNG).',
            type: 'error'
        };
        return;
    }

    uploading.value = true;
    const formData = new FormData();
    formData.append('image', file);

    try {
        // 1. Subir a ImgBB
        const { data: uploadData, error: uploadError } = await useFetch('/api/upload/imgbb', {
            method: 'POST',
            body: formData,
        });

        if (uploadError.value) throw new Error('Error al subir la imagen al servidor');

        const imageUrl = uploadData.value?.url;

        if (imageUrl) {
            // 2. Guardar en nuestra DB y disparar notificación interna al Admin
            const { success, error: saveError } = await $fetch('/api/reseller/upload-proof', {
                method: 'POST',
                body: {
                    orderId: route.params.id,
                    proofUrl: imageUrl
                }
            });

            if (success) {
                order.value.paymentProofUrl = imageUrl;
                order.value.status = 'paid'; // Cambio de estado optimista
                
                // MOSTRAR TU MODAL DE ÉXITO
                modal.value = {
                    show: true,
                    message: 'Comprobante subido exitosamente. El administrador verificará el pago a la brevedad.',
                    type: 'success'
                };
            } else {
                throw new Error(saveError || 'No se pudo vincular el comprobante al pedido');
            }
        }
    } catch (e) {
        console.error('Error uploading proof:', e);
        // MOSTRAR TU MODAL DE ERROR
        modal.value = {
            show: true,
            message: 'Ocurrió un error al subir el comprobante. Por favor, intenta de nuevo o contacta al vivero.',
            type: 'error'
        };
    } finally {
        uploading.value = false;
        event.target.value = ''; // Limpiar el input
    }
}

// Helpers de estilo (se mantienen igual)
const getStatusClass = (status) => {
    switch(status) {
        case 'pending_payment': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        case 'paid': return 'bg-blue-50 text-blue-800 border-blue-200';
        case 'completed': return 'bg-green-50 text-green-800 border-green-200';
        case 'cancelled': return 'bg-red-50 text-red-800 border-red-200';
        default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
}

const formatStatus = (status) => {
    const map = {
        'pending_payment': 'Pendiente de Pago',
        'paid': 'Verificando Pago',
        'completed': 'Pedido Aprobado',
        'cancelled': 'Pedido Cancelado'
    };
    return map[status] || status;
}

onMounted(fetchOrder);
</script>