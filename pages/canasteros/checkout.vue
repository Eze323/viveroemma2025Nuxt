<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-white border-b border-gray-200 px-4 py-4 flex items-center mb-4">
      <NuxtLink to="/canasteros/catalogo" class="mr-4">
        <Icon name="heroicons:arrow-left" class="w-6 h-6 text-gray-700" />
      </NuxtLink>
      <h1 class="text-xl font-bold text-gray-900">Carrito de Compras</h1>
    </div>

    <div v-if="cartStore.items.length === 0" class="px-4 text-center py-12">
      <Icon name="heroicons:shopping-cart" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <p class="text-gray-500 mb-6">Tu carrito está vacío.</p>
      <NuxtLink to="/canasteros/catalogo" class="btn btn-primary">
        Ir al Catálogo
      </NuxtLink>
    </div>

    <div v-else class="px-4">
      <!-- Items List -->
      <div class="space-y-4 mb-6">
        <div v-for="item in cartStore.items" :key="item.id" class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
           <img :src="item.image || 'https://placehold.co/100x100'" class="w-16 h-16 rounded object-cover mr-4" />
           <div class="flex-1">
             <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
             <p class="text-sm text-gray-500">${{ item.precio_venta }} x {{ item.quantity }}</p>
           </div>
           <div class="flex flex-col items-end">
             <span class="font-bold text-gray-900">${{ item.price * item.quantity }}</span>
             <div class="flex items-center mt-2 bg-gray-100 rounded-lg">
               <button @click="cartStore.updateQuantity(item.id, item.quantity - 1)" class="w-8 h-8 flex items-center justify-center text-gray-600">-</button>
               <span class="text-sm font-medium w-8 text-center">{{ item.quantity }}</span>
               <button @click="cartStore.updateQuantity(item.id, item.quantity + 1)" class="w-8 h-8 flex items-center justify-center text-gray-600">+</button>
             </div>
           </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6">
        <div class="flex justify-between mb-2">
           <span class="text-gray-600">Subtotal</span>
           <span class="font-medium">${{ cartStore.totalPrice }}</span>
        </div>
        <div class="flex justify-between mb-4">
           <span class="text-gray-600">Puntos Estimados</span>
           <span class="font-medium text-yellow-600">+{{ cartStore.potentialPoints }} pts</span>
        </div>
        <div class="border-t border-gray-100 pt-4 flex justify-between">
           <span class="text-lg font-bold text-gray-900">Total</span>
           <span class="text-lg font-bold text-primary">${{ cartStore.totalPrice }}</span>
        </div>
      </div>

      <!-- Actions -->
      <button 
        @click="processCheckout" 
        :disabled="loading"
        class="w-full btn btn-primary py-3 mb-4 flex justify-center"
      >
        <span v-if="loading" class="animate-spin mr-2">⏳</span>
        Confirmar Pedido
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useResellerCartStore } from '~/stores/resellerCart';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  middleware: ['auth'],
  layout: 'canastero'
});


const router = useRouter();
const cartStore = useResellerCartStore();
const authStore = useAuthStore();
const loading = ref(false);

// console.log(cartStore.items);
const processCheckout = async () => {
    if(!authStore.user) {
        alert('Debes iniciar sesión');
        return;
    }

    loading.value = true;
    try {
        const { data, success, error } = await $fetch('/api/reseller/orders', {
            method: 'POST',
            body: {
                userId: authStore.user.id,
                items: cartStore.items,
                total: cartStore.totalPrice
            }
        });

        if(success && data.orderId) {
            cartStore.clearCart();
            router.push(`/canasteros/ordenes/${data.orderId}`);
        } else {
            alert(error || 'Error al crear la orden');
        }
    } catch (e) {
        console.error(e);
        alert('Error de conexión');
    } finally {
        loading.value = false;
    }
}
</script>
