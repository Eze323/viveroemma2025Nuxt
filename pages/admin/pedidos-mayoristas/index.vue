<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-white border-b border-gray-200 px-4 py-4 mb-4">
       <h1 class="text-xl font-bold text-gray-900">Pedidos Mayoristas</h1>
    </div>

    <div class="px-4">
      <!-- Filters -->
      <div class="mb-4 flex space-x-2">
         <button @click="filter = 'all'" :class="['px-3 py-1 rounded-full text-sm', filter === 'all' ? 'bg-gray-800 text-white' : 'bg-white border']">Todos</button>
         <button @click="filter = 'pending_payment'" :class="['px-3 py-1 rounded-full text-sm', filter === 'pending_payment' ? 'bg-yellow-100 text-yellow-800' : 'bg-white border']">Pendientes</button>
         <button @click="filter = 'paid'" :class="['px-3 py-1 rounded-full text-sm', filter === 'paid' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-white border']">Pagados (Revisar)</button>
             <button @click="filter = 'completed'" :class="['px-3 py-1 rounded-full text-sm', filter === 'completed' ? 'bg-green-100 text-green-800' : 'bg-white border']">Completados</button>
      </div>

      <div v-if="loading" class="text-center py-8">Cargando...</div>
      
      <div v-else class="space-y-4">
         <div v-for="order in filteredOrders" :key="order.id" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div class="flex justify-between items-start mb-2">
               <div>
                  <h3 class="font-bold text-gray-900">Pedido #{{ order.id }}</h3>
                   <p class="text-sm text-gray-500">
                     <Icon name="heroicons:user" class="w-4 h-4 inline mr-1"/>
                     {{ order.userName || 'Usuario ' + order.userId }}
                   </p>
                  <p class="text-sm text-gray-500">{{ formatDate(order.createdAt) }}</p>
               </div>
               <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs rounded-full border">
                   {{ formatStatus(order.status) }}
               </span>
            </div>
            
            <div class="flex justify-between items-center mt-2">
                <span class="font-bold text-lg">${{ order.total }}</span>
                
                <div v-if="order.status === 'paid'" class="flex gap-2">
                    <a v-if="order.paymentProofUrl" :href="order.paymentProofUrl" target="_blank" class="btn btn-sm btn-outline text-blue-600 border-blue-200">
                        Ver Comprobante
                    </a>
                     <button @click="rejectOrder(order.id)" class="btn btn-sm btn-outline text-red-600 border-red-200 hover:bg-red-50">
                        Rechazar
                    </button>
                    <button @click="approveOrder(order.id)" class="btn btn-sm btn-primary bg-green-600 hover:bg-green-700">
                        Aprobar
                    </button>
                </div>
                 <div v-if="order.status === 'pending_payment'" class="text-xs text-orange-600 italic">
                    Esperando pago del cliente
                </div>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: 'admin',
  middleware: ['auth'] // Add admin check
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
        // We need a general endpoint for admins to see ALL orders.
        // For now, reusing the basic get endpoint but we might need to modify it to allow filtering by status or all users
        // Let's assume GET /api/admin/reseller-orders exists or use a mock logic here
        // Creating a new endpoint `server/api/admin/reseller-orders/index.get.ts` would be best.
        // For this demo, let's just use the `reseller/orders` one but we'd need to bypass the user filter or pass a specific flag.
        // Actually, let's create that endpoint now quickly.
        const { data, success } = await $fetch('/api/admin/reseller-orders');
        if(success) {
            orders.value = data;
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
}

const approveOrder = async (id) => {
    if(!confirm('¿Estás seguro de aprobar este pedido y asignar los puntos?')) return;
    
    try {
        const { success, message, error } = await $fetch(`/api/admin/reseller-orders/${id}/approve`, {
            method: 'POST'
        });
        
        if(success) {
            alert(message);
            fetchOrders(); // Refresh
        } else {
            alert(error);
        }
    } catch (e) {
        alert('Error al aprobar');
    }
}

const rejectOrder = async (id) => {
    if(!confirm('¿Estás seguro de rechazar el pago? El pedido volverá a estado pendiente y se eliminará el comprobante.')) return;
    
    try {
        const { success, message, error } = await $fetch(`/api/admin/reseller-orders/${id}/reject`, {
            method: 'POST',
            body: { reason: 'Comprobante ilegible o incorrecto' }
        });
        
        if(success) {
            alert(message);
            fetchOrders(); // Refresh
        } else {
            alert(error);
        }
    } catch (e) {
        alert('Error al rechazar');
    }
}

const getStatusClass = (status) => {
    switch(status) {
        case 'pending_payment': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
        case 'paid': return 'bg-blue-50 text-blue-800 border-blue-200';
        case 'completed': return 'bg-green-50 text-green-800 border-green-200';
        default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
}

const formatStatus = (status) => {
     const map = {
        'pending_payment': 'Pendiente',
        'paid': 'Pagado',
        'completed': 'Aprobado',
        'cancelled': 'Cancelado'
    };
    return map[status] || status;
}

const formatDate = (d) => new Date(d).toLocaleDateString();

onMounted(fetchOrders);
</script>
