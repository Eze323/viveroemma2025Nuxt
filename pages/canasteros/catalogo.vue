<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header with Cart Icon -->
    <div class="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
      <h1 class="text-lg font-bold text-gray-900">Catálogo Mayorista</h1>
      
      <NuxtLink to="/canasteros/checkout" class="relative p-2">
        <Icon name="heroicons:shopping-cart" class="w-6 h-6 text-gray-700" />
        <span v-if="cartStore.totalItems > 0" class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {{ cartStore.totalItems }}
        </span>
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="px-4 py-3 bg-white border-b border-gray-200 mb-4 sticky top-[57px] z-10">
      <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button 
           v-for="cat in ['Todos', 'Interior', 'Exterior', 'Macetas']" 
           :key="cat"
           @click="selectedCategory = cat"
           :class="['px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors', 
             selectedCategory === cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-300']"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Product Grid -->
    <div class="px-4 pb-12">
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="animate-pulse">
              <div class="bg-gray-200 aspect-[4/3] rounded-xl mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
      </div>
      
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <div v-for="product in filteredProducts" :key="product.id" class="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover:border-primary/20">
              <!-- Image Container -->
              <div class="relative aspect-[4/3] overflow-hidden bg-gray-50">
                <img 
                  loading="lazy"
                  :src="product.image_url || '/placeholder.png'" 
                  :alt="product.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  @error="$event.target.src = '/placeholder.png'"
                />
                <!-- Price Badge -->
                <div class="absolute bottom-2 left-2 bg-white/95 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-gray-900 shadow-sm border border-gray-100">
                    ${{ product.precio_venta }}
                </div>
              </div>
              
              <!-- Content -->
              <div class="p-4 flex-1 flex flex-col">
                <div class="mb-3">
                    <p class="text-xs text-primary font-medium tracking-wide uppercase mb-1">{{ product.category }}</p>
                    <h3 class="text-base font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {{ product.name }}
                    </h3>
                </div>
                
                <div class="mt-auto pt-3 border-t border-gray-50">
                    <button 
                      @click="addToCart(product)"
                      class="w-full btn btn-primary flex items-center justify-center gap-2 py-2.5 rounded-lg active:scale-95 transition-transform"
                    >
                        <Icon name="heroicons:shopping-cart" class="w-5 h-5" />
                        <span class="font-medium">Agregar al Pedido</span>
                    </button>
                </div>
              </div>
          </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredProducts.length === 0" class="text-center py-12">
          <Icon name="heroicons:inbox" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900">No hay productos disponibles</h3>
          <p class="text-gray-500">Intenta cambiar el filtro de categoría.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useResellerCartStore } from '~/stores/resellerCart';

definePageMeta({
  middleware: ['auth'],
  layout: 'canastero'
});

const cartStore = useResellerCartStore();
const products = ref([]);
const loading = ref(true);
const selectedCategory = ref('Todos');

const filteredProducts = computed(() => {
    if(selectedCategory.value === 'Todos') return products.value;
    return products.value.filter(p => p.category === selectedCategory.value); // Simple string match, adjust if needed
});

const fetchProducts = async () => {
    loading.value = true;
    try {
        const { data, success } = await $fetch('/api/products');
        if(success) {
            products.value = data;
            
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
}

const addToCart = (product) => {
    cartStore.addToCart(product);
    // Optional: Toast notification
}

onMounted(() => {
    fetchProducts();
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
