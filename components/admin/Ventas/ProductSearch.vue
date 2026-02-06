<template>
  <div class="product-search">
    <!-- Input de búsqueda siempre visible -->
    <div class="relative">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        placeholder="🔍 Buscar planta..."
        class="search-input"
        @focus="showResults = true"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="clear-button"
        aria-label="Limpiar búsqueda"
      >
        <span class="material-symbols-outlined">close</span>
      </button>
    </div>

    <!-- Resultados de búsqueda -->
    <div
      v-if="showResults && searchQuery"
      class="search-results"
    >
      <!-- Loading -->
      <div v-if="isLoading" class="result-item loading">
        <span class="material-symbols-outlined animate-spin">progress_activity</span>
        <span>Buscando...</span>
      </div>

      <!-- No results -->
      <div v-else-if="filteredProducts.length === 0" class="result-item no-results">
        <span class="material-symbols-outlined">search_off</span>
        <span>No se encontraron plantas</span>
      </div>

      <!-- Results list -->
      <div v-else class="results-list">
        <button
          v-for="product in filteredProducts.slice(0, 8)"
          :key="product.id"
          class="result-item"
          @click="selectProduct(product)"
        >
          <!-- Imagen del producto -->
          <div
            class="product-image"
            :style="{ backgroundImage: `url(${product.image_url || placeholderImage})` }"
          />
          
          <!-- Info del producto -->
          <div class="product-info">
            <p class="product-name">{{ product.name }}</p>
            <p class="product-price">${{ formatPrice(product.precio_venta) }}</p>
            <p v-if="product.stock <= 0" class="product-stock out-of-stock">
              Sin stock
            </p>
            <p v-else-if="product.stock < 10" class="product-stock low-stock">
              Stock: {{ product.stock }}
            </p>
          </div>

          <!-- Botón de agregar -->
          <div class="add-button">
            <span class="material-symbols-outlined">add_circle</span>
          </div>
        </button>

        <!-- Indicador de más resultados -->
        <div v-if="filteredProducts.length > 8" class="more-results">
          +{{ filteredProducts.length - 8 }} productos más...
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProductStore } from '~/stores/products'
import type { VentaItem } from '~/stores/ventas'

interface Product {
  id: number
  name: string
  precio_venta: number | string
  stock: number
  image_url?: string | null
}

const emit = defineEmits<{
  select: [product: Omit<VentaItem, 'subtotal'>]
}>()

const productStore = useProductStore()
const searchInput = ref<HTMLInputElement>()
const searchQuery = ref('')
const showResults = ref(false)
const isLoading = ref(false)
const placeholderImage = 'https://via.placeholder.com/80?text=🌱'

// Cargar productos si no están en caché
const loadProducts = async () => {
  if (productStore.getProducts.length === 0) {
    isLoading.value = true
    try {
      await productStore.fetchProducts()
    } finally {
      isLoading.value = false
    }
  }
}

// Filtrar productos basado en búsqueda
const filteredProducts = computed(() => {
  if (!searchQuery.value) return []
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return productStore.getProducts
    .filter((p: Product) => 
      p.name?.toLowerCase().includes(query) ||
      p.id.toString().includes(query)
    )
    .sort((a: Product, b: Product) => {
      // Priorizar productos con stock
      if (a.stock > 0 && b.stock <= 0) return -1
      if (a.stock <= 0 && b.stock > 0) return 1
      return 0
    })
})

// Formatear precio
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2)
}

// Seleccionar producto
const selectProduct = (product: Product) => {
  if (product.stock <= 0) {
    alert('Este producto no tiene stock disponible')
    return
  }

  emit('select', {
    id: product.id,
    nombre: product.name,
    precioUnitario: typeof product.precio_venta === 'string' 
      ? parseFloat(product.precio_venta) 
      : product.precio_venta,
    cantidad: 1,
    image: product.image_url
  })

  clearSearch()
}

// Limpiar búsqueda
const clearSearch = () => {
  searchQuery.value = ''
  showResults.value = false
}

// Enfocar input
const focus = () => {
  searchInput.value?.focus()
}

// Cargar productos al montar
loadProducts()

// Watch para cargar productos cuando se empieza a buscar
watch(searchQuery, (newVal) => {
  if (newVal && productStore.getProducts.length === 0) {
    loadProducts()
  }
})

// Cerrar resultados al hacer click fuera
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.product-search')) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Exponer método focus para uso externo
defineExpose({ focus })
</script>

<style scoped>
.product-search {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  height: 56px;
  padding: 0 48px 0 16px;
  font-size: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.clear-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.clear-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  max-height: 400px;
  overflow-y: auto;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.results-list {
  display: flex;
  flex-direction: column;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: none;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s;
  min-height: 64px;
}

.result-item:not(:last-child) {
  border-bottom: 1px solid #f3f4f6;
}

.result-item:hover {
  background: #f9fafb;
}

.result-item:active {
  background: #f3f4f6;
}

.result-item.loading,
.result-item.no-results {
  justify-content: center;
  gap: 8px;
  color: #6b7280;
  cursor: default;
}

.result-item.loading:hover,
.result-item.no-results:hover {
  background: white;
}

.product-image {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  background-color: #f3f4f6;
  border-radius: 8px;
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 14px;
  font-weight: 500;
  color: #3b82f6;
  margin: 0;
}

.product-stock {
  font-size: 12px;
  margin: 4px 0 0 0;
}

.product-stock.low-stock {
  color: #f59e0b;
}

.product-stock.out-of-stock {
  color: #ef4444;
}

.add-button {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.more-results {
  padding: 12px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .search-results {
    max-height: 60vh;
  }
  
  .result-item {
    min-height: 72px;
    padding: 16px 12px;
  }
  
  .product-image {
    width: 56px;
    height: 56px;
  }
  
  .add-button {
    width: 48px;
    height: 48px;
  }
}
</style>
