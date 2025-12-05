<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">
              {{ mode === 'create' ? 'Nueva Venta' : 'Detalle de Venta' }}
            </h2>
            <button
              @click="closeModal"
              class="close-button"
              aria-label="Cerrar modal"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <!-- Cliente Section -->
            <section class="section">
              <h3 class="section-title">Cliente</h3>
              <div class="client-inputs">
                <input
                  v-model="clientName"
                  class="input-field"
                  placeholder="Nombre del Cliente *"
                  type="text"
                  :disabled="mode === 'view'"
                  required
                />
                <input
                  v-model="clientAddress"
                  class="input-field"
                  placeholder="Dirección (opcional)"
                  type="text"
                  :disabled="mode === 'view'"
                />
              </div>
            </section>

            <!-- Búsqueda de Productos (solo en create) -->
            <section v-if="mode === 'create'" class="section">
              <h3 class="section-title">Buscar Producto</h3>
              <ProductSearch @select="handleProductSelect" />
            </section>

            <!-- Carrito Section -->
            <section class="section">
              <div class="section-header">
                <h3 class="section-title">
                  Carrito ({{ store.items.length }})
                </h3>
                <button
                  v-if="mode === 'create' && store.items.length > 0"
                  @click="store.limpiarItems()"
                  class="clear-cart-button"
                >
                  <span class="material-symbols-outlined">delete_sweep</span>
                  Limpiar
                </button>
              </div>

              <!-- Lista de items -->
              <div v-if="store.items.length > 0" class="cart-items">
                <CartItem
                  v-for="item in store.items"
                  :key="item.id"
                  :item="item"
                  :readonly="mode === 'view'"
                  @update-quantity="handleUpdateQuantity"
                  @replace="handleReplaceItem"
                  @remove="handleRemoveItem"
                />
              </div>

              <!-- Empty state -->
              <div v-else class="empty-cart">
                <span class="material-symbols-outlined">shopping_cart</span>
                <p>El carrito está vacío</p>
                <p class="empty-cart-hint">Busca y agrega productos para continuar</p>
              </div>
            </section>

            <!-- Resumen Section -->
            <section v-if="store.items.length > 0" class="section summary-section">
              <h3 class="section-title">Resumen</h3>
              <div class="summary-card">
                <div class="summary-row">
                  <span class="summary-label">Subtotal</span>
                  <span class="summary-value">${{ formatPrice(store.subtotal) }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">IVA (21%)</span>
                  <span class="summary-value">${{ formatPrice(store.ivaTotal) }}</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row total">
                  <span class="summary-label">Total</span>
                  <span class="summary-value">${{ formatPrice(store.totalFinal) }}</span>
                </div>
              </div>
            </section>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button
              @click="closeModal"
              class="button button-secondary"
            >
              {{ mode === 'create' ? 'Cancelar' : 'Cerrar' }}
            </button>
            <button
              v-if="mode === 'create'"
              @click="submitSale"
              class="button button-primary"
              :disabled="!canSubmit"
            >
              <span class="material-symbols-outlined">payments</span>
              Cobrar Venta
            </button>
          </div>
        </div>
      </div>

      <!-- Product Replacer Modal -->
      <ProductReplacer
        :is-open="isReplacerOpen"
        :current-product="itemToReplace"
        @close="closeReplacer"
        @replace="handleReplace"
      />
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useVentasStore } from '~/stores/ventas'
import type { VentaItem } from '~/stores/ventas'
import ProductSearch from './ProductSearch.vue'
import CartItem from './CartItem.vue'
import ProductReplacer from './ProductReplacer.vue'

interface Props {
  isOpen: boolean
  mode: 'create' | 'view' | 'edit'
  sale?: any
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:isOpen': [value: boolean]
  submit: [data: { clientName: string; clientAddress: string }]
}>()

const store = useVentasStore()

// Local state
const clientName = ref('')
const clientAddress = ref('')
const isReplacerOpen = ref(false)
const itemToReplace = ref<VentaItem | null>(null)

// Computed
const canSubmit = computed(() => {
  return clientName.value.trim() !== '' && store.items.length > 0
})

// Formatear precio
const formatPrice = (price: number | undefined | null): string => {
  return Number(price || 0).toFixed(2)
}

// Handlers
const handleProductSelect = (product: Omit<VentaItem, 'subtotal'>) => {
  store.agregarItem(product)
}

const handleUpdateQuantity = (id: number, quantity: number) => {
  store.actualizarCantidad(id, quantity)
}

const handleReplaceItem = (id: number) => {
  const item = store.items.find(i => i.id === id)
  if (item) {
    itemToReplace.value = item
    isReplacerOpen.value = true
  }
}

const handleRemoveItem = (id: number) => {
  if (confirm('¿Eliminar este producto del carrito?')) {
    store.removerItem(id)
  }
}

const handleReplace = (newProduct: Omit<VentaItem, 'subtotal'>, keepQuantity: boolean) => {
  if (itemToReplace.value) {
    store.reemplazarItem(itemToReplace.value.id, newProduct)
  }
  closeReplacer()
}

const closeReplacer = () => {
  isReplacerOpen.value = false
  itemToReplace.value = null
}

const submitSale = () => {
  if (!canSubmit.value) {
    alert('Completa el nombre del cliente y agrega al menos un producto.')
    return
  }

  emit('submit', {
    clientName: clientName.value,
    clientAddress: clientAddress.value
  })

  closeModal()
}

const closeModal = () => {
  emit('update:isOpen', false)
  // Reset local state
  clientName.value = ''
  clientAddress.value = ''
}

const handleOverlayClick = () => {
  if (mode === 'view') {
    closeModal()
  }
}

// Watch for modal open/close
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if ((props.mode === 'view' || props.mode === 'edit') && props.sale) {
      // Load sale data for viewing
      clientName.value = props.sale.clientName || props.sale.customer || ''
      clientAddress.value = props.sale.clientAddress || props.sale.address || ''
      
      // Load items into store
      store.limpiarItems()
      if (props.sale.items && props.sale.items.length > 0) {
        props.sale.items.forEach((item: any) => {
          store.agregarItem({
            id: item.product_id || item.id,
            nombre: item.nombre || item.productName || 'Desconocido',
            precioUnitario: Number(item.unitPrice || item.precio_unitario || item.price || 0),
            cantidad: item.cantidad || item.quantity || 1,
            image: item.image || item.image_url
          })
        })
      }
    } else if (props.mode === 'create') {
      // Reset for new sale
      clientName.value = ''
      clientAddress.value = ''
    }
  } else {
    // Reset on close
    clientName.value = ''
    clientAddress.value = ''
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.close-button {
  width: 44px;
  height: 44px;
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

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.section {
  margin-bottom: 24px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 12px 0;
}

.client-inputs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-field {
  width: 100%;
  height: 56px;
  padding: 0 16px;
  font-size: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-field:disabled {
  background: #f9fafb;
  cursor: not-allowed;
}

.clear-cart-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 500;
  color: #ef4444;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-cart-button:hover {
  background: #fee2e2;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  color: #6b7280;
}

.empty-cart .material-symbols-outlined {
  font-size: 64px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.empty-cart p {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.empty-cart-hint {
  font-size: 14px !important;
  color: #9ca3af !important;
  margin-top: 8px !important;
}

.summary-section {
  background: #f9fafb;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 0;
}

.summary-card {
  background: white;
  padding: 16px;
  border-radius: 8px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.summary-row.total {
  padding-top: 12px;
}

.summary-label {
  font-size: 16px;
  color: #6b7280;
}

.summary-value {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.summary-row.total .summary-label {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.summary-row.total .summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.summary-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 56px;
  padding: 0 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.button-secondary {
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.button-secondary:hover {
  background: #f9fafb;
}

.button-primary {
  background: #3b82f6;
  color: white;
}

.button-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.button-primary:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .modal-container {
    max-height: 100vh;
    border-radius: 0;
  }
  
  .modal-header,
  .modal-content,
  .modal-footer {
    padding-left: 16px;
    padding-right: 16px;
  }
  
  .button {
    flex: 1;
    min-width: 0;
  }
}
</style>