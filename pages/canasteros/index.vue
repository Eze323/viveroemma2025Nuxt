<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-white border-b border-gray-200 px-4 py-4 mb-4">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Hola, {{ user?.name }}</h1>
          <p class="text-sm text-gray-600">Bienvenido a tu panel de Canastero</p>
        </div>
        <div class="flex items-center gap-2">
            <span class="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-yellow-200">
                {{ user?.points || 0 }} Puntos
            </span>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div class="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p class="text-xs text-blue-600 mb-1">Puntos Disponibles</p>
          <p class="text-2xl font-bold text-blue-800">{{ user?.points || 0 }}</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg border border-green-100">
          <p class="text-xs text-green-600 mb-1">Pedidos Activos</p>
          <p class="text-2xl font-bold text-green-800">{{ activeOrdersCount }}</p>
        </div>
      </div>

       <div class="grid grid-cols-1 gap-4">
         <NuxtLink to="/canasteros/catalogo" class="btn btn-primary w-full flex justify-center items-center py-3">
            <Icon name="heroicons:shopping-bag" class="w-5 h-5 mr-2" />
            Hacer Nuevo Pedido
         </NuxtLink>
       </div>
    </div>

    <!-- Recent Orders -->
    <div class="px-4">
      <h2 class="text-lg font-bold text-gray-900 mb-3">Mis Pedidos Recientes</h2>
      <div v-if="loading" class="text-center py-4">Cargando...</div>
      <div v-else-if="orders.length === 0" class="text-center py-8 text-gray-500">
        No tienes pedidos recientes.
      </div>
      <div v-else class="space-y-3">
        <div v-for="order in orders" :key="order.id" class="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div class="flex justify-between items-start mb-2">
            <div>
              <p class="font-semibold text-gray-900">Pedido #{{ order.id }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(order.createdAt) }}</p>
            </div>
            <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs rounded-full">
              {{ formatStatus(order.status) }}
            </span>
          </div>
          <div class="flex justify-between items-center mt-2">
             <p class="text-sm font-medium text-gray-700">{{ formatCurrency(order.total) }}</p>
             <NuxtLink :to="`/canasteros/ordenes/${order.id}`" class="text-sm text-primary hover:underline">
               Ver Detalles
             </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  middleware: ['auth'],
  layout: 'canastero'
});

const auth = useAuthStore();
const user = computed(() => auth.user);
const orders = ref([]);
const loading = ref(true);

const activeOrdersCount = computed(() => 
  orders.value.filter(o => ['pending_payment', 'paid'].includes(o.status)).length
);

const fetchOrders = async () => {
    loading.value = true;
    try {
        const { data, success } = await $fetch(`/api/reseller/orders?userId=${user.value?.id}`);
        if(success) {
            orders.value = data;
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
}

const getStatusClass = (status) => {
    switch(status) {
        case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
        case 'paid': return 'bg-blue-100 text-blue-800';
        case 'completed': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const formatStatus = (status) => {
    const map = {
        'pending_payment': 'Pendiente de Pago',
        'paid': 'Pagado',
        'completed': 'Completado',
        'cancelled': 'Cancelado'
    };
    return map[status] || status;
}

const formatDate = (dateString) => {
    if(!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

const formatCurrency = (val) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);
}

onMounted(async () => {
    if(user.value) {
        // Refresh user data to get latest points
        await auth.fetchUser();
        fetchOrders();  
    }
});
</script>