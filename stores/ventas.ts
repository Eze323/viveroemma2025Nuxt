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
  image?: string  // Para mostrar imagen en el carrito
  product?: {     // Relación anidada para compatibilidad con Laravel
    name: string
  }
}

export const useVentasStore = defineStore('ventas', () => {
  const items = ref<VentaItem[]>([])
  const ivaRate = ref(0.21)
  const syncQueue = useSyncQueueStore()

  // Estado fiscal ARCA / AFIP
  const invoiceType = ref<number>(99) // 99=Ticket/Presupuesto, 1=Factura A, 6=Factura B, 11=Factura C
  const pointOfSale = ref<number>(1)
  const customerIvaCondition = ref<string>('Consumidor Final')
  const docType = ref<number>(99) // 99=Sin doc, 96=DNI, 80=CUIT, 86=CUIL
  const docNumber = ref<string>('')
  const fiscalAddress = ref<string>('')

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
      // Si no existe, agregar nuevo completo con sus mapeos
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
   * Limpia todos los items del carrito y restablece valores fiscales por defecto
   */
  const limpiarItems = () => {
    items.value = []
    invoiceType.value = 99
    pointOfSale.value = 1
    customerIvaCondition.value = 'Consumidor Final'
    docType.value = 99
    docNumber.value = ''
    fiscalAddress.value = ''
  }

  /**
   * Actualiza los datos de facturación electrónica
   */
  const setFiscalData = (data: {
    invoiceType?: number
    pointOfSale?: number
    customerIvaCondition?: string
    docType?: number
    docNumber?: string
    fiscalAddress?: string
    ivaRate?: number
  }) => {
    if (data.invoiceType !== undefined) invoiceType.value = data.invoiceType
    if (data.pointOfSale !== undefined) pointOfSale.value = data.pointOfSale
    if (data.customerIvaCondition !== undefined) customerIvaCondition.value = data.customerIvaCondition
    if (data.docType !== undefined) docType.value = data.docType
    if (data.docNumber !== undefined) docNumber.value = data.docNumber
    if (data.fiscalAddress !== undefined) fiscalAddress.value = data.fiscalAddress
    if (data.ivaRate !== undefined) ivaRate.value = data.ivaRate
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

    // Preparar payload normalizado con datos fiscales
    const payload = {
      ...saleData,
      items: getPayload.value.items,
      subtotal: getPayload.value.subtotal,
      iva: getPayload.value.iva,
      total: getPayload.value.total,
      netAmount: getPayload.value.netAmount,
      vatAmount: getPayload.value.vatAmount,
      invoiceType: invoiceType.value,
      pointOfSale: pointOfSale.value,
      customerIvaCondition: customerIvaCondition.value,
      docType: docType.value,
      docNumber: docNumber.value || null,
    }

    if (!isOnline.value) {
      // Modo offline: guardar en cola
      console.log('Sin conexión - guardando venta en cola de sincronización')

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

    return {
      success: true,
      offline: false,
    }
  }

  // Computed properties para cálculos automáticos obligados a número
  const subtotal = computed(() =>
    items.value.reduce((sum, item) =>
      sum + (item.subtotal || (Number(item.precioUnitario) * Number(item.cantidad))), 0
    )
  )

  const ivaTotal = computed(() => subtotal.value * ivaRate.value)

  const totalFinal = computed(() => subtotal.value + ivaTotal.value)

  /**
   * Genera el payload limpio para enviar al backend
   */
  const getPayload = computed(() => ({
    items: items.value.map(i => ({
      productId: i.id,
      quantity: i.cantidad,
      unitPrice: i.precioUnitario
    })),
    subtotal: subtotal.value,
    iva: ivaTotal.value,
    total: totalFinal.value,
    // Campos ARCA / AFIP
    netAmount: subtotal.value,
    vatAmount: ivaTotal.value,
    invoiceType: invoiceType.value,
    pointOfSale: pointOfSale.value,
    customerIvaCondition: customerIvaCondition.value,
    docType: docType.value,
    docNumber: docNumber.value || null,
  }))

  return {
    // State
    items,
    ivaRate,
    invoiceType,
    pointOfSale,
    customerIvaCondition,
    docType,
    docNumber,
    fiscalAddress,

    // Actions
    agregarItem,
    actualizarCantidad,
    reemplazarItem,
    removerItem,
    limpiarItems,
    setIvaRate,
    setFiscalData,
    guardarVenta,

    // Getters
    subtotal,
    ivaTotal,
    totalFinal,
    getPayload
  }
})