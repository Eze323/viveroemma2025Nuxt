// stores/ventas.ts – Store optimizado para ventas móviles con soporte offline
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSyncQueueStore } from './syncQueue'
import { useNetworkStatus } from '~/composables/useNetworkStatus'

export interface VentaItem {
  id: number
  nombre: string
  cantidad: number
  precioUnitario: number
  subtotal?: number
  image?: string  // Agregado para mostrar imagen en carrito
}

export interface SaleRecord {
  id: number
  clientName: string
  email: string
  date: string
  time: string
  amount: number
  items: any[]
  status: string
}

// console.log('useVentasStore')
export const useVentasStore = defineStore('ventas', () => {
  const items = ref<VentaItem[]>([])
  const salesHistory = ref<SaleRecord[]>([])
  const historyLoading = ref(false)
  const historyError = ref<string | null>(null)
  const ivaRate = ref(0.21)
  const syncQueue = useSyncQueueStore()

  /**
   * Agrega un item al carrito. Si ya existe, suma la cantidad.
   */
  const agregarItem = (nuevoItem: Omit<VentaItem, 'subtotal'>) => {
    const existingIndex = items.value.findIndex(i => i.id === nuevoItem.id)

    if (existingIndex > -1) {
      // Si ya existe, sumar cantidad
      items.value[existingIndex].cantidad += nuevoItem.cantidad || 1
      items.value[existingIndex].subtotal =
        items.value[existingIndex].cantidad * items.value[existingIndex].precioUnitario
    } else {
      // Si no existe, agregar nuevo
      const item: VentaItem = {
        ...nuevoItem,
        cantidad: nuevoItem.cantidad || 1,
        subtotal: nuevoItem.precioUnitario * (nuevoItem.cantidad || 1)
      }
      items.value.push(item)
    }
  }

  /**
   * Actualiza la cantidad de un item específico
   */
  const actualizarCantidad = (id: number, cantidad: number) => {
    const item = items.value.find(i => i.id === id)
    if (item) {
      item.cantidad = Math.max(1, cantidad)
      item.subtotal = item.cantidad * item.precioUnitario
    }
  }

  /**
   * Reemplaza un item por otro, manteniendo la cantidad actual
   * Útil para cambiar por producto más barato
   */
  const reemplazarItem = (idActual: number, nuevoProducto: Omit<VentaItem, 'subtotal'>) => {
    const index = items.value.findIndex(i => i.id === idActual)

    if (index > -1) {
      const cantidadActual = items.value[index].cantidad

      items.value[index] = {
        ...nuevoProducto,
        cantidad: cantidadActual,
        subtotal: nuevoProducto.precioUnitario * cantidadActual
      }
    }
  }

  /**
   * Elimina un item del carrito
   */
  const removerItem = (id: number) => {
    items.value = items.value.filter(i => i.id !== id)
  }

  /**
   * Limpia todos los items del carrito
   */
  const limpiarItems = () => {
    items.value = []
  }

  /**
   * Actualiza la tasa de IVA
   */
  const setIvaRate = (rate: number) => {
    ivaRate.value = rate
  }

  /**
   * Guarda una venta (online o offline)
   */
  const guardarVenta = async (saleData: any): Promise<{ success: boolean; offline?: boolean; error?: string }> => {
    const { isOnline } = useNetworkStatus()

    // Preparar payload
    const payload = {
      ...saleData,
      items: getPayload.value.items,
      subtotal: getPayload.value.subtotal,
      iva: getPayload.value.iva,
      total: getPayload.value.total,
    }

    if (!isOnline.value) {
      // Modo offline: guardar en cola
      // console.log('Sin conexión - guardando venta en cola de sincronización')

      syncQueue.addOperation({
        type: 'sale',
        action: 'create',
        data: payload,
      })

      return {
        success: true,
        offline: true,
      }
    }

    // Modo online: intentar guardar directamente
    // (esto se maneja en el componente que llama a esta función)
    return {
      success: true,
      offline: false,
    }
  }

  // Computed properties para cálculos automáticos
  const subtotal = computed(() =>
    items.value.reduce((sum, item) =>
      sum + (item.subtotal || item.precioUnitario * item.cantidad), 0
    )
  )

  const ivaTotal = computed(() => subtotal.value * ivaRate.value)

  const totalFinal = computed(() => subtotal.value + ivaTotal.value)

  /**
   * Genera el payload para enviar al backend
   */
  const getPayload = computed(() => ({
    items: items.value.map(i => ({
      productId: i.id,
      quantity: i.cantidad,
      unitPrice: i.precioUnitario
    })),
    subtotal: subtotal.value,
    iva: ivaTotal.value,
    total: totalFinal.value
  }))

  return {
    // State
    items,
    ivaRate,

    // Actions
    agregarItem,
    actualizarCantidad,
    reemplazarItem,  // Nueva función
    removerItem,
    limpiarItems,
    setIvaRate,
    guardarVenta,

    // Getters
    subtotal,
    ivaTotal,
    totalFinal,
    getPayload,

    // History
    salesHistory,
    historyLoading,
    historyError,
    fetchSalesHistory: async () => {
      historyLoading.value = true
      historyError.value = null
      try {
        const { data, success, error } = await $fetch<{ data: SaleRecord[], success: boolean, error?: string }>('/api/sales')
        if (success && data) {
          salesHistory.value = data
        } else {
          historyError.value = error || 'Error fetching sales'
        }
      } catch (e) {
        historyError.value = 'Error de conexión'
      } finally {
        historyLoading.value = false
      }
    }
  }
})