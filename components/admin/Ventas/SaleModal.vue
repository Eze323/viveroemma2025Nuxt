<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <div>
              <h2 class="modal-title">
                {{ mode === 'create' ? 'Nueva Venta' : (mode === 'edit' ? 'Editar Venta' : 'Detalle de Venta') }}
              </h2>
              <p class="text-xs text-gray-500 mt-0.5">
                {{ mode === 'create' ? 'Mostrador y Facturación Electrónica ARCA' : `Comprobante #${sale?.id || ''}` }}
              </p>
            </div>
            <button
              @click="closeModal"
              class="close-button"
              aria-label="Cerrar modal"
            >
              <Icon name="heroicons:x-mark" class="w-5 h-5 sm:w-6 sm:h-6 text-slate-500 hover:text-slate-900 transition-colors" />
            </button>
          </div>

          <div class="modal-content">
            <!-- Badge de Facturación ARCA (si está en modo view o edit) -->
            <div v-if="mode !== 'create' && (sale?.invoice_type || sale?.invoiceType || sale?.cae)" class="mb-4 p-3 rounded-xl border bg-slate-50 border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {{ getInvoiceTypeLabel(sale?.invoice_type || sale?.invoiceType || 99) }}
                </span>
                <span v-if="sale?.invoice_number || sale?.invoiceNumber" class="text-xs font-bold text-gray-700">
                  Nº {{ formatInvoiceNumber(sale?.point_of_sale || sale?.pointOfSale || 1, sale?.invoice_number || sale?.invoiceNumber) }}
                </span>
              </div>
              <div class="flex items-center gap-3 text-xs text-gray-600">
                <span v-if="sale?.cae" class="flex items-center gap-1 font-mono bg-white px-2 py-0.5 rounded border border-gray-200">
                  <strong>CAE:</strong> {{ sale.cae }}
                </span>
                <span v-if="sale?.cae_expiration || sale?.caeExpiration" class="text-gray-500">
                  Vto: {{ formatDate(sale?.cae_expiration || sale?.caeExpiration) }}
                </span>
              </div>
            </div>

            <!-- 1. Tipo de Comprobante (Selector Rápido) -->
            <section class="section">
              <div class="flex items-center justify-between mb-2">
                <h3 class="section-title mb-0">Tipo de Comprobante</h3>
                <span class="text-[11px] text-gray-500 font-medium">Compatible con ARCA / AFIP</span>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  v-for="type in invoiceTypeOptions"
                  :key="type.value"
                  type="button"
                  :disabled="mode === 'view'"
                  @click="selectInvoiceType(type.value)"
                  :class="[
                    'p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between cursor-pointer',
                    invoiceType === type.value
                      ? 'bg-emerald-50/80 border-emerald-500 text-emerald-900 shadow-sm ring-1 ring-emerald-500'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50',
                    mode === 'view' ? 'cursor-default opacity-85' : ''
                  ]"
                >
                  <div class="flex items-center justify-between w-full">
                    <span class="font-bold text-xs">{{ type.label }}</span>
                    <span v-if="invoiceType === type.value" class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <span class="text-[10px] text-gray-500 mt-1">{{ type.desc }}</span>
                </button>
              </div>
            </section>

            <!-- 2. Cliente y Datos Fiscales -->
            <section class="section">
              <div class="flex items-center justify-between mb-2">
                <h3 class="section-title mb-0">Datos del Cliente</h3>
                <button 
                  v-if="mode === 'create' && (!clientName || clientName === 'Consumidor Final')"
                  type="button"
                  @click="setQuickFinalConsumer"
                  class="text-xs text-emerald-600 hover:text-emerald-700 font-semibold underline"
                >
                  Consumidor Final Rápido
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Nombre / Razón Social *</label>
                  <input
                    v-model="clientName"
                    class="input-field-compact"
                    placeholder="Nombre o Consumidor Final"
                    type="text"
                    :disabled="mode === 'view'"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-gray-600 mb-1">Dirección / Localidad</label>
                  <input
                    v-model="clientAddress"
                    class="input-field-compact"
                    placeholder="Dirección del cliente (opcional)"
                    type="text"
                    :disabled="mode === 'view'"
                  />
                </div>
              </div>

              <!-- Acordeón / Desplegable de Datos Fiscales ARCA -->
              <div class="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/60">
                <button
                  type="button"
                  @click="showFiscalDetails = !showFiscalDetails"
                  class="w-full px-3 py-2 flex items-center justify-between text-xs font-bold text-gray-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
                >
                  <span class="flex items-center gap-1.5">
                    <Icon name="heroicons:document-text" class="w-4 h-4 text-emerald-600" />
                    Datos Fiscales ARCA {{ invoiceType !== 99 ? '(Requeridos para Factura)' : '(Opcional)' }}
                  </span>
                  <span class="flex items-center gap-1 text-[11px] font-normal text-gray-500">
                    {{ showFiscalDetails ? 'Ocultar' : 'Configurar DNI/CUIT y Condición IVA' }}
                    <Icon name="heroicons:chevron-down" class="w-4 h-4 transition-transform text-gray-500" :class="{ 'rotate-180': showFiscalDetails }" />
                  </span>
                </button>

                <div v-show="showFiscalDetails || invoiceType !== 99" class="p-3 border-t border-slate-200 bg-white grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1">Tipo de Documento</label>
                    <select
                      v-model="docType"
                      class="select-field-compact"
                      :disabled="mode === 'view'"
                    >
                      <option :value="99">Sin Documento / Venta Global (99)</option>
                      <option :value="96">DNI (96)</option>
                      <option :value="80">CUIT (80)</option>
                      <option :value="86">CUIL (86)</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1">
                      Nº Documento / CUIT {{ invoiceType === 1 ? '*' : '' }}
                    </label>
                    <input
                      v-model="docNumber"
                      class="input-field-compact"
                      :placeholder="docType === 80 ? '20-12345678-9' : 'DNI o CUIT'"
                      type="text"
                      :disabled="mode === 'view'"
                    />
                  </div>

                  <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1">Condición Frente al IVA</label>
                    <select
                      v-model="customerIvaCondition"
                      class="select-field-compact"
                      :disabled="mode === 'view'"
                    >
                      <option value="Consumidor Final">Consumidor Final</option>
                      <option value="Responsable Inscripto">Responsable Inscripto</option>
                      <option value="Monotributo">Monotributo</option>
                      <option value="Exento">Exento</option>
                      <option value="No Responsable">No Responsable</option>
                    </select>
                  </div>

                  <div class="sm:col-span-2">
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1">Domicilio Fiscal (ARCA)</label>
                    <input
                      v-model="fiscalAddress"
                      class="input-field-compact"
                      placeholder="Calle, número, localidad, provincia"
                      type="text"
                      :disabled="mode === 'view'"
                    />
                  </div>

                  <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1">Punto de Venta</label>
                    <input
                      v-model.number="pointOfSale"
                      class="input-field-compact"
                      type="number"
                      min="1"
                      max="9999"
                      :disabled="mode === 'view'"
                    />
                  </div>
                </div>
              </div>
            </section>

            <!-- 3. Buscar Producto (Solo en creación) -->
            <section v-if="mode === 'create'" class="section">
              <h3 class="section-title">Buscar Producto</h3>
              <ProductSearch @select="handleProductSelect" />
            </section>

            <!-- 4. Items del Carrito -->
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
                  <Icon name="heroicons:trash" class="w-4 h-4" />
                  <span>Limpiar</span>
                </button>
              </div>

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

              <div v-else class="empty-cart">
                <Icon name="heroicons:shopping-cart" class="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 dark:text-slate-600 mb-3" />
                <p class="text-base font-semibold text-slate-700">El carrito está vacío</p>
                <p class="empty-cart-hint">Busca y agrega productos para continuar con la venta</p>
              </div>
            </section>

            <!-- 5. Resumen y Desglose Fiscal de IVA -->
            <section v-if="store.items.length > 0" class="section summary-section">
              <div class="summary-header flex items-center justify-between mb-3">
                <h3 class="section-title mb-0">Resumen & Desglose Fiscal</h3>

                <!-- Selector de Alícuota de IVA -->
                <div v-if="mode === 'create'" class="iva-rate-control flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-gray-200">
                  <span class="text-xs font-semibold text-gray-500">Tasa IVA:</span>
                  <select
                    :value="store.ivaRate"
                    @change="handleIvaRateChange(($event.target as HTMLSelectElement).value)"
                    class="text-xs font-bold text-gray-800 border-none bg-transparent focus:ring-0 cursor-pointer"
                  >
                    <option :value="0.21">21.0% (General)</option>
                    <option :value="0.105">10.5% (Plantas/Agro)</option>
                    <option :value="0.0">0% (Exento)</option>
                  </select>
                </div>
              </div>

              <div class="summary-card">
                <div class="summary-row">
                  <span class="summary-label">Subtotal Neto Gravado</span>
                  <span class="summary-value">${{ formatPrice(store.subtotal) }}</span>
                </div>
                <div class="summary-row">
                  <span class="summary-label">
                    IVA ({{ (store.ivaRate * 100).toFixed(1) }}%)
                    <span v-if="invoiceType === 1" class="text-xs text-purple-600 font-semibold">(Discriminado Factura A)</span>
                  </span>
                  <span class="summary-value">${{ formatPrice(store.ivaTotal) }}</span>
                </div>
                <div class="summary-divider"></div>
                <div class="summary-row total">
                  <div>
                    <span class="summary-label">Total a Cobrar</span>
                    <p class="text-[11px] text-gray-500 font-normal">
                      {{ invoiceType === 99 ? 'Ticket Interno' : (invoiceType === 1 ? 'Factura A' : (invoiceType === 6 ? 'Factura B' : 'Factura C')) }}
                    </p>
                  </div>
                  <span class="summary-value text-emerald-600">${{ formatPrice(store.totalFinal) }}</span>
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
              <Icon name="heroicons:banknotes" class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <span>{{ invoiceType === 99 ? 'Cobrar Venta Rápida' : `Emitir ${getInvoiceTypeLabel(invoiceType)}` }}</span>
            </button>
          </div>
        </div>
      </div>

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
  submit: [data: any]
}>()

const store = useVentasStore()

// Local state: Cliente y Facturación
const clientName = ref('Consumidor Final')
const clientAddress = ref('')
const isReplacerOpen = ref(false)
const itemToReplace = ref<VentaItem | null>(null)

// Campos ARCA / AFIP
const invoiceType = ref<number>(99) // 99=Ticket/Presupuesto, 1=Factura A, 6=Factura B, 11=Factura C
const pointOfSale = ref<number>(1)
const customerIvaCondition = ref<string>('Consumidor Final')
const docType = ref<number>(99)
const docNumber = ref<string>('')
const fiscalAddress = ref<string>('')
const showFiscalDetails = ref(false)

const invoiceTypeOptions = [
  { value: 99, label: 'Ticket / Interno', desc: 'Presupuesto rápido' },
  { value: 6, label: 'Factura B', desc: 'Consumidor Final' },
  { value: 1, label: 'Factura A', desc: 'Resp. Inscripto' },
  { value: 11, label: 'Factura C', desc: 'Monotributo / Otros' },
]

const getInvoiceTypeLabel = (val: number): string => {
  switch (val) {
    case 1: return 'Factura A'
    case 6: return 'Factura B'
    case 11: return 'Factura C'
    case 99:
    default: return 'Ticket / Presupuesto'
  }
}

const formatInvoiceNumber = (pos: number, num: number | string | undefined): string => {
  if (!num) return ''
  const posFormatted = String(pos || 1).padStart(4, '0')
  const numFormatted = String(num).padStart(8, '0')
  return `${posFormatted}-${numFormatted}`
}

const formatDate = (dateStr: any): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-AR')
}

const setQuickFinalConsumer = () => {
  clientName.value = 'Consumidor Final'
  docType.value = 99
  docNumber.value = ''
  customerIvaCondition.value = 'Consumidor Final'
}

const selectInvoiceType = (typeVal: number) => {
  invoiceType.value = typeVal

  if (typeVal === 1) {
    // Factura A requiere CUIT y Resp Inscripto
    if (docType.value === 99) docType.value = 80 // CUIT
    customerIvaCondition.value = 'Responsable Inscripto'
    showFiscalDetails.value = true
  } else if (typeVal === 6) {
    // Factura B suele ser Consumidor Final
    if (customerIvaCondition.value === 'Responsable Inscripto') {
      customerIvaCondition.value = 'Consumidor Final'
    }
  }
}

const handleIvaRateChange = (newRate: string) => {
  store.setIvaRate(Number(newRate))
}

// Computed
const canSubmit = computed(() => {
  if (store.items.length === 0) return false
  if (invoiceType.value === 1 && !docNumber.value.trim()) {
    // Factura A exige CUIT
    return false
  }
  return true
})

// Formatear precio
const formatPrice = (price: number | undefined | null): string => {
  return Number(price || 0).toFixed(2)
}

// Handlers de carrito
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
    if (invoiceType.value === 1 && !docNumber.value.trim()) {
      alert('Para emitir Factura A debes ingresar el CUIT del comprador.')
      showFiscalDetails.value = true
      return
    }
    alert('Agrega al menos un producto al carrito para cobrar la venta.')
    return
  }

  emit('submit', {
    clientName: clientName.value.trim() || 'Consumidor Final',
    clientAddress: clientAddress.value,
    invoiceType: invoiceType.value,
    pointOfSale: pointOfSale.value || 1,
    customerIvaCondition: customerIvaCondition.value,
    docType: docType.value,
    docNumber: docNumber.value.trim() || null,
    fiscalAddress: fiscalAddress.value.trim() || null,
    netAmount: store.subtotal,
    vatAmount: store.ivaTotal,
    ivaRate: store.ivaRate,
  })

  closeModal()
}

const closeModal = () => {
  emit('update:isOpen', false)
  resetForm()
}

const resetForm = () => {
  clientName.value = 'Consumidor Final'
  clientAddress.value = ''
  invoiceType.value = 99
  pointOfSale.value = 1
  customerIvaCondition.value = 'Consumidor Final'
  docType.value = 99
  docNumber.value = ''
  fiscalAddress.value = ''
  showFiscalDetails.value = false
}

const handleOverlayClick = () => {
  if (props.mode === 'view') {
    closeModal()
  }
}

// Watch modal abierto
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    if ((props.mode === 'view' || props.mode === 'edit') && props.sale) {
      const s = props.sale
      clientName.value = s.customer || s.clientName || 'Consumidor Final'
      clientAddress.value = s.address || s.clientAddress || ''
      invoiceType.value = Number(s.invoice_type || s.invoiceType || 99)
      pointOfSale.value = Number(s.point_of_sale || s.pointOfSale || 1)
      customerIvaCondition.value = s.customer_iva_condition || s.customerIvaCondition || 'Consumidor Final'
      docType.value = Number(s.doc_type || s.docType || 99)
      docNumber.value = s.doc_number || s.docNumber || ''
      fiscalAddress.value = s.fiscal_address || s.fiscalAddress || ''
      showFiscalDetails.value = invoiceType.value !== 99 || !!docNumber.value

      store.limpiarItems()
      if (s.items && s.items.length > 0) {
        s.items.forEach((item: any) => {
          const nombreResuelto = item.product?.name || item.nombre || item.productName || 'Producto'
          const precioResuelto = Number(item.unit_price || item.precio_compra || item.precio_venta || item.unitPrice || 0)

          store.agregarItem({
            id: item.product_id || item.productId || item.id,
            nombre: nombreResuelto,
            precioUnitario: precioResuelto,
            cantidad: Number(item.quantity || item.cantidad || 1),
            image: item.image || item.image_url || item.product?.image_url,
            product: { name: nombreResuelto }
          })
        })
      }
    } else if (props.mode === 'create') {
      resetForm()
    }
  } else {
    resetForm()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 16px;
  backdrop-filter: blur(6px);
}
.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 760px;
  width: 100%;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(226, 232, 240, 0.8);
  overflow: hidden;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: #ffffff;
}
.modal-title {
  font-size: 20px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
}
.close-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s;
}
.close-button:hover {
  background: #e2e8f0;
  color: #0f172a;
}
.modal-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 24px;
}
.section {
  margin-bottom: 20px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 10px 0;
}
.input-field-compact {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  font-size: 14px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  background: white;
  transition: all 0.15s ease-in-out;
}
.input-field-compact:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}
.input-field-compact:disabled {
  background: #f8fafc;
  cursor: not-allowed;
  color: #64748b;
}
.select-field-compact {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  font-size: 13px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  background: white;
  transition: all 0.15s ease-in-out;
}
.select-field-compact:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}
.clear-cart-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 600;
  color: #ef4444;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.clear-cart-button:hover {
  background: #fee2e2;
}
.cart-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 36px 20px;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  border-radius: 14px;
  border: 1.5px dashed #cbd5e1;
}
.empty-cart svg {
  margin-bottom: 8px;
}
.empty-cart p {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
}
.empty-cart-hint {
  font-size: 13px !important;
  color: #94a3b8 !important;
  margin-top: 4px !important;
}
.summary-section {
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  margin-bottom: 0;
}
.summary-card {
  background: white;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #edf2f7;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}
.summary-row.total {
  padding-top: 10px;
}
.summary-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}
.summary-value {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}
.summary-row.total .summary-label {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}
.summary-row.total .summary-value {
  font-size: 22px;
  font-weight: 900;
}
.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 8px 0;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}
.button-secondary {
  background: white;
  color: #334155;
  border: 1.5px solid #cbd5e1;
}
.button-secondary:hover {
  background: #f1f5f9;
}
.button-primary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}
.button-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
}
.button-primary:disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
  opacity: 0.7;
}
@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
  }
  .modal-container {
    max-height: 100vh;
    max-height: 100dvh;
    min-width: 0;
    border-radius: 0;
  }
  .modal-header,
  .modal-content,
  .modal-footer {
    padding-left: 12px;
    padding-right: 12px;
  }
  .modal-header {
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .modal-title {
    font-size: 18px;
  }
  .close-button {
    width: 36px;
    height: 36px;
    flex-shrink: 0;
  }
  .modal-content {
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .section {
    margin-bottom: 14px;
  }
  .section-title {
    font-size: 13px;
  }
  .summary-section {
    padding: 10px;
  }
  .summary-header {
    align-items: stretch;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
  }
  .iva-rate-control {
    width: 100%;
    justify-content: space-between;
  }
  .summary-card {
    padding: 10px 12px;
  }
  .summary-label {
    font-size: 12px;
  }
  .summary-value {
    font-size: 13px;
  }
  .summary-row.total .summary-label {
    font-size: 14px;
  }
  .summary-row.total .summary-value {
    font-size: 18px;
  }
  .button {
    height: auto;
    min-height: 42px;
    min-width: 0;
    padding: 7px 8px;
    font-size: 12px;
    line-height: 1.2;
  }
  .button-secondary {
    flex: 0 0 36%;
  }
  .button-primary {
    flex: 1;
    gap: 5px;
    text-align: center;
  }
  .empty-cart p {
    font-size: 14px;
  }
  .empty-cart-hint {
    font-size: 12px !important;
  }
}
</style>