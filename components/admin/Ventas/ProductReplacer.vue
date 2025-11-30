<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="isOpen" class="replacer-overlay" @click="close">
        <div class="replacer-modal" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <h3 class="modal-title">Reemplazar por más barato</h3>
            <button @click="close" class="close-button" aria-label="Cerrar">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Producto actual -->
          <div class="current-product">
            <p class="section-label">Producto actual:</p>
            <div class="product-card current">
              <div
                class="product-image"
                :style="{ backgroundImage: `url(${currentProduct?.image || placeholderImage})` }"
              />
              <div class="product-info">
                <p class="product-name">{{ currentProduct?.nombre }}</p>
                <p class="product-price">${{ formatPrice(currentProduct?.precioUnitario || 0) }}</p>
                <p class="product-quantity">Cantidad: {{ currentProduct?.cantidad }}</p>
              </div>
            </div>
          </div>

          <!-- Búsqueda -->
          <div class="search-section">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="🔍 Buscar alternativa más barata..."
              class="search-input"
              autofocus
            />
          </div>

          <!-- Lista de productos más baratos -->
          <div class="products-list">
            <p v-if="isLoading" class="loading-message">
              <span class="material-symbols-outlined animate-spin">progress_activity</span>
              Cargando productos...
            </p>

            <p v-else-if="cheaperProducts.length === 0" class="no-results">
              <span class="material-symbols-outlined">search_off</span>
              No hay productos más baratos disponibles
            </p>

            <div v-else class="products-grid">
              <button
                v-for="product in cheaperProducts"
                :key="product.id"
                class="product-card"
                @click="selectReplacement(product)"
              >
                <div
                  class="product-image"
                  :style="{ backgroundImage: `url(${product.image_url || placeholderImage})` }"
                />
                <div class="product-info">
                  <p class="product-name">{{ product.name }}</p>
                  <p class="product-price cheaper">${{ formatPrice(product.precio_venta) }}</p>
                  <p class="savings">
                    Ahorrás: ${{ formatPrice(getSavings(product.precio_venta)) }}
                  </p>
                  <p v-if="product.stock <= 0" class="out-of-stock">Sin stock</p>
                  <p v-else-if="product.stock < 10" class="low-stock">Stock: {{ product.stock }}</p>
                </div>
                <div class="select-icon">
                  <span class="material-symbols-outlined">check_circle</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Footer con opción de mantener cantidad -->
          <div class="modal-footer">
            <label class="keep-quantity-option">
              <input
                v-model="keepQuantity"
                type="checkbox"
                class="checkbox"
              />
              <span>Mantener cantidad ({{ currentProduct?.cantidad }})</span>
            </label>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
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
  image_url?: string
}

interface Props {
  isOpen: boolean
  currentProduct: VentaItem | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: []
  replace: [newProduct: Omit<VentaItem, 'subtotal'>, keepQuantity: boolean]
}>()

const productStore = useProductStore()
const searchQuery = ref('')
const keepQuantity = ref(true)
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

// Productos más baratos que el actual
const cheaperProducts = computed(() => {
  if (!props.currentProduct) return []

  const currentPrice = props.currentProduct.precioUnitario
  const query = searchQuery.value.toLowerCase().trim()

  return productStore.getProducts
    .filter((p: Product) => {
      const price = typeof p.precio_venta === 'string' 
        ? parseFloat(p.precio_venta) 
        : p.precio_venta

      // Filtrar por precio más barato y búsqueda
      const isCheaper = price < currentPrice
      const matchesSearch = !query || p.name?.toLowerCase().includes(query)

      return isCheaper && matchesSearch && p.id !== props.currentProduct?.id
    })
    .sort((a: Product, b: Product) => {
      // Ordenar por precio (más barato primero)
      const priceA = typeof a.precio_venta === 'string' ? parseFloat(a.precio_venta) : a.precio_venta
      const priceB = typeof b.precio_venta === 'string' ? parseFloat(b.precio_venta) : b.precio_venta
      
      // Priorizar productos con stock
      if (a.stock > 0 && b.stock <= 0) return -1
      if (a.stock <= 0 && b.stock > 0) return 1
      
      return priceA - priceB
    })
})

// Calcular ahorro
const getSavings = (newPrice: number | string): number => {
  if (!props.currentProduct) return 0
  
  const price = typeof newPrice === 'string' ? parseFloat(newPrice) : newPrice
  const currentPrice = props.currentProduct.precioUnitario
  
  return currentPrice - price
}

// Formatear precio
const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return numPrice.toFixed(2)
}

// Seleccionar reemplazo
const selectReplacement = (product: Product) => {
  if (product.stock <= 0) {
    alert('Este producto no tiene stock disponible')
    return
  }

  const price = typeof product.precio_venta === 'string' 
    ? parseFloat(product.precio_venta) 
    : product.precio_venta

  emit('replace', {
    id: product.id,
    nombre: product.name,
    precioUnitario: price,
    cantidad: keepQuantity.value ? props.currentProduct?.cantidad || 1 : 1,
    image: product.image_url
  }, keepQuantity.value)

  close()
}

// Cerrar modal
const close = () => {
  emit('close')
  searchQuery.value = ''
  keepQuantity.value = true
}

// Cargar productos cuando se abre el modal
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    loadProducts()
  }
})
</script>

<style scoped>
.replacer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.replacer-modal {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.close-button {
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

.close-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.current-product {
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.section-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  margin: 0 0 8px 0;
  letter-spacing: 0.05em;
}

.product-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.product-card:not(.current):hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.product-card.current {
  cursor: default;
}

.product-image {
  width: 56px;
  height: 56px;
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
  font-size: 16px;
  font-weight: 600;
  color: #6b7280;
  margin: 0;
}

.product-price.cheaper {
  color: #10b981;
}

.product-quantity {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.savings {
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
  margin: 4px 0 0 0;
}

.out-of-stock,
.low-stock {
  font-size: 12px;
  margin: 4px 0 0 0;
}

.out-of-stock {
  color: #ef4444;
}

.low-stock {
  color: #f59e0b;
}

.select-icon {
  flex-shrink: 0;
  color: #3b82f6;
}

.select-icon .material-symbols-outlined {
  font-size: 24px;
}

.search-section {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.search-input {
  width: 100%;
  height: 48px;
  padding: 0 16px;
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

.products-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.loading-message,
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px 20px;
  color: #6b7280;
  text-align: center;
}

.products-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.keep-quantity-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
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
  .replacer-modal {
    max-height: 95vh;
  }
  
  .product-card {
    padding: 16px 12px;
  }
  
  .product-image {
    width: 64px;
    height: 64px;
  }
}
</style>
