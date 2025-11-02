// stores/ventas.ts – Versión corregida con logs y safe guards
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface VentaItem {
  id: number
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal?: number
}

export const useVentasStore = defineStore('ventas', () => {
  const items = ref<VentaItem[]>([])
  const ivaRate = ref(0.21)

  const agregarItem = (nuevoItem: Omit<VentaItem, 'subtotal'>) => {
    const existingIndex = items.value.findIndex(i => i.id === nuevoItem.id)
    if (existingIndex > -1) {
      items.value[existingIndex].cantidad += nuevoItem.cantidad || 1
      items.value[existingIndex].subtotal = items.value[existingIndex].cantidad * items.value[existingIndex].precioUnitario
    } else {
      const item: VentaItem = {
        ...nuevoItem,
        cantidad: nuevoItem.cantidad || 1,
        subtotal: nuevoItem.precioUnitario * (nuevoItem.cantidad || 1)
      }
      items.value.push(item)
    }
  }

  const actualizarCantidad = (id: number, cantidad: number) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.cantidad = Math.max(1, cantidad)
      item.subtotal = item.cantidad * item.precioUnitario
    }
  }

  const removerItem = (id: number) => {
    items.value = items.value.filter(i => i.id !== id)
  }

  const limpiarItems = () => {
    items.value = []
  }

  const setIvaRate = (rate: number) => {
    ivaRate.value = rate
  }

  const subtotal = computed(() => 
    items.value.reduce((sum, item) => sum + (item.subtotal || item.precioUnitario * item.cantidad), 0)
  )

  const ivaTotal = computed(() => subtotal.value * ivaRate.value)

  const totalFinal = computed(() => subtotal.value + ivaTotal.value)

  // Payload para backend – con safe guard para evitar undefined
  const getPayload = computed(() => {
    const payload = {
      items: items.value.map(i => ({ 
        productId: i.id,
        quantity: i.cantidad,
        unitPrice: i.precioUnitario
      })),
      subtotal: subtotal.value,
      iva: ivaTotal.value,
      total: totalFinal.value
    }
    console.log('getPayload computed retornando:', payload)  // DEBUG: Confirma que retorna object
    return payload
  })

  return {
    items,
    ivaRate,
    agregarItem,
    actualizarCantidad,
    removerItem,
    limpiarItems,
    setIvaRate,
    subtotal,
    ivaTotal,
    totalFinal,
    getPayload
  }
})