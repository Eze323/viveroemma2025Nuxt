<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-white border-b border-gray-200 px-4 py-4 mb-4">
       <h1 class="text-xl font-bold text-gray-900">Pedidos Mayoristas</h1>
    </div>

    <div class="px-4">
      <div class="mb-4 flex space-x-2 overflow-x-auto pb-2">
         <button @click="filter = 'all'" :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors', filter === 'all' ? 'bg-gray-800 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50']">Todos</button>
         <button @click="filter = 'pending_payment'" :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors', filter === 'pending_payment' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-white border text-gray-600 hover:bg-gray-50']">Pendientes</button>
         <button @click="filter = 'paid'" :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors', filter === 'paid' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-white border text-gray-600 hover:bg-gray-50']">Pagados (Revisar)</button>
         <button @click="filter = 'completed'" :class="['px-4 py-1.5 rounded-full text-sm font-medium transition-colors', filter === 'completed' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-white border text-gray-600 hover:bg-gray-50']">Completados</button>
      </div>

      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      </div>
      
      <div v-else class="space-y-4">
         <div v-for="order in filteredOrders" :key="order.id" class="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-3">
               <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-bold text-gray-900 text-lg">Pedido #{{ order.id }}</h3>
                    <span :class="getStatusClass(order.status)" class="px-2.5 py-0.5 text-[11px] font-bold uppercase rounded-full border">
                      {{ formatStatus(order.status) }}
                    </span>
                  </div>
                   <p class="text-sm text-gray-600 flex items-center">
                     <Icon name="heroicons:user" class="w-4 h-4 mr-1.5 text-gray-400"/>
                     {{ order.userName || 'Usuario ' + order.userId }}
                   </p>
                  <p class="text-xs text-gray-400 mt-1">{{ formatDate(order.createdAt) }}</p>
               </div>
            </div>
            
            <div class="flex flex-col sm:flex-row justify-between items-end sm:items-center mt-4 pt-4 border-t border-gray-50 gap-4">
                <div class="flex flex-col">
                  <span class="text-xs text-gray-400 uppercase font-semibold">Total a cobrar</span>
                  <span class="font-black text-2xl text-gray-900">${{ order.total }}</span>
                </div>
                
                <div v-if="order.status === 'paid'" class="flex gap-2 w-full sm:w-auto">
                    <a v-if="order.paymentProofUrl" :href="order.paymentProofUrl" target="_blank" class="flex-1 sm:flex-none text-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        Ver Comprobante
                    </a>
                     <button @click="handleReject(order)" class="flex-1 sm:flex-none px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                        Rechazar
                    </button>
                    <button @click="handleApprove(order)" class="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 shadow-sm shadow-green-200 transition-all active:scale-95">
                        Aprobar
                    </button>
                </div>
                 <div v-if="order.status === 'pending_payment'" class="flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                    <Icon name="heroicons:clock" class="w-4 h-4 mr-2 animate-pulse" />
                    Esperando pago
                </div>
            </div>
         </div>
      </div>
    </div>

   <ClientOnly>
      <NotificationModal 
        :is-open="modal.show"
        :message="modal.message"
        :type="modal.type"
        @close="modal.show = false"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
import NotificationModal from '~/components/NotificationModal.vue';
import { ref, computed, onMounted } from 'vue';

const modal = ref({ show: false, message: '', type: 'success' });

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
});

const orders = ref([]);
const loading = ref(true);
const filter = ref('all');

const filteredOrders = computed(() => {
    if(filter.value === 'all') return orders.value;
    return orders.value.filter(o => o.status === filter.value);
});

const fetchOrders = async () => {
    loading.value = true;
    try {
        const { data, success } = await $fetch('/api/admin/reseller-orders');
        if(success) orders.value = data;
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
}

const handleApprove = async (order) => {
    const pointsToAssign = Math.floor(order.total / 1000);
    
    // Usamos el confirm nativo para la acción, pero el resultado va al modal
    if(!confirm(`¿Confirmar aprobación de $${order.total}? Se acreditarán ${pointsToAssign} puntos.`)) return;
    
    try {
        const response = await $fetch(`/api/admin/reseller-orders/${order.id}/approve`, {
            method: 'PATCH',
            body: { 
                userId: order.userId,
                points: pointsToAssign 
            }
        });
        
        if(response.success) {
            modal.value = {
                show: true,
                type: 'success',
                message: `Pedido #${order.id} aprobado con éxito. ${pointsToAssign} puntos enviados a ${order.userName}.`
            };
            fetchOrders(); 
        }
    } catch (e) {
        modal.value = {
            show: true,
            type: 'error',
            message: e.data?.statusMessage || 'No se pudo aprobar el pedido en este momento.'
        };
    }
}

const handleReject = async (order) => {
    const reason = prompt('Motivo del rechazo:', 'Comprobante poco legible');
    if (reason === null) return;
    
    try {
        const response = await $fetch(`/api/admin/reseller-orders/${order.id}/reject`, {
            method: 'PATCH',
            body: { 
                userId: order.userId,
                reason: reason 
            }
        });
        
        if(response.success) {
            modal.value = {
                show: true,
                type: 'success',
                message: 'El pedido fue rechazado. El canastero ha sido notificado para re-subir el pago.'
            };
            fetchOrders();
        }
    } catch (e) {
        modal.value = {
            show: true,
            type: 'error',
            message: 'Error al procesar el rechazo.'
        };
    }
}

const getStatusClass = (status) => {
    switch(status) {
        case 'pending_payment': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
        case 'paid': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'completed': return 'bg-green-50 text-green-700 border-green-200';
        default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
}

const formatStatus = (status) => {
     const map = {
        'pending_payment': 'Pendiente',
        'paid': 'Por Revisar',
        'completed': 'Completado',
        'cancelled': 'Cancelado'
    };
    return map[status] || status;
}

const formatDate = (d) => {
  return new Date(d).toLocaleString('es-AR', { 
    day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
  });
};

onMounted(fetchOrders);
</script>