<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-white border-b border-gray-200 px-4 py-4 mb-4">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Ventas</h1>
          <p class="text-sm text-gray-600">Administra las ventas del vivero</p>
        </div>
        
        <button 
          @click="openSaleModal('create')" title="Crear nueva venta"
          class="btn btn-primary flex items-center justify-center w-10 h-10 rounded-full shadow-lg"
        >
          <Icon name="heroicons:plus" class="w-6 h-6" />
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div class="stat-card revenue">
          <div class="stat-icon">
            <Icon name="heroicons:currency-dollar" class="w-6 h-6" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Ingresos totales</p>
            <p class="stat-value">{{ formatCurrency(totalRevenue) }}</p>
          </div>
        </div>

        <div class="stat-card sales">
          <div class="stat-icon">
            <Icon name="heroicons:shopping-bag" class="w-6 h-6" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Número de ventas</p>
            <p class="stat-value">{{ totalSales }}</p>
          </div>
        </div>

        <div class="stat-card product">
          <div class="stat-icon">
            <Icon name="heroicons:star" class="w-6 h-6" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Producto más vendido</p>
            <p class="stat-value truncate">{{ mostSoldProduct }}</p>
          </div>
        </div>
      </div>
    </div>

    <SaleModal
      :is-open="isModalOpen"
      :mode="modalMode"
      :sale="selectedSale"
      @update:isOpen="isModalOpen = $event"
      @submit="handleSaleSubmit"
    />

    <div class="px-4">
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p class="text-gray-500 mt-4">Cargando ventas...</p>
      </div>
      <div v-else-if="error" class="text-center py-8">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
          <Icon name="heroicons:exclamation-triangle" class="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p class="text-red-600 font-medium">{{ error }}</p>
        </div>
      </div>
      <div v-else>
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-900">Historial de Ventas</h2>
          <div class="text-sm text-gray-500">
            {{ sales.length }} {{ sales.length === 1 ? 'venta' : 'ventas' }}
          </div>
        </div>

        <div v-if="sales.length > 0" class="space-y-3">
          <div
            v-for="sale in sales"
            :key="sale.id"
            class="sale-card"
            @click="toggleSaleDetails(sale.id)"
          >
            <div class="sale-header">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <div class="client-avatar">
                    <Icon name="heroicons:user" class="w-4 h-4" />
                  </div>
                  <h3 class="sale-client">{{ sale.customer || 'Consumidor Final' }}</h3>
                </div>
                <div class="sale-meta">
                  <span class="sale-id">#{{ sale.id }}</span>
                  <span class="sale-separator">•</span>
                  <span class="sale-date">{{ formatDate(sale.date) }}</span>
                  <span class="sale-separator">•</span>
                  <span class="sale-time">{{ sale.time }}</span>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <div class="text-right">
                  <p class="sale-amount">{{ formatCurrency(sale.total_price || 0) }}</p>
                  <p class="sale-items">{{ sale.items?.length || 0 }} {{ sale.items?.length === 1 ? 'item' : 'items' }}</p>
                </div>
                <Icon 
                  name="heroicons:chevron-down" 
                  class="w-5 h-5 text-gray-400 transition-transform"
                  :class="{ 'rotate-180': expandedSales.includes(sale.id) }"
                />
              </div>
            </div>

            <div 
              v-if="expandedSales.includes(sale.id)"
              class="sale-details"
            >
              <div class="details-divider"></div>
              
              <div class="details-section">
                <h4 class="details-title">Productos</h4>
                <div class="items-list">
                  <div
                    v-for="(item, index) in sale.items"
                    :key="index"
                    class="item-row"
                  >
                    <div class="item-info">
                      <span class="item-name">{{ item.product?.name || 'Producto Desconocido' }}</span>
                      <span class="item-quantity">x{{ item.quantity }}</span>
                    </div>
                    <span class="item-price">
                      {{ formatCurrency((item.unit_price || 0) * (item.quantity || 0)) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="details-actions">
                <button
                  @click.stop="openSaleModal('edit', sale)"
                  class="action-button view"
                >
                  <Icon name="heroicons:eye" class="w-5 h-5" />
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">
            <Icon name="heroicons:shopping-cart" class="w-16 h-16" />
          </div>
          <h3 class="empty-title">No hay ventas registradas</h3>
          <p class="empty-description">Comienza creando tu primera venta</p>
          <button @click="openSaleModal('create')" class="empty-action">
            <Icon name="heroicons:plus" class="w-5 h-5" />
            Crear venta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useApiService } from '~/services/api/api'; 
import SaleModal from '~/components/admin/Ventas/SaleModal.vue';
import { useVentasStore } from '~/stores/ventas'; 

definePageMeta({
  layout: 'admin',
});

const api = useApiService();
const sales = ref<any[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const expandedSales = ref<number[]>([]);

const isModalOpen = ref(false);
const modalMode = ref<'create' | 'edit' | 'view'>('create');
const selectedSale = ref<any>({});

const store = useVentasStore();

const loadSales = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.getSales();
    // Ajustado para capturar tanto arrays planos como respuestas envueltas en .data
    const dataRaw = response?.data || response;
    
    if (Array.isArray(dataRaw)) {
      sales.value = dataRaw.map(s => ({
        ...s,
        total_price: s.total_price ? Number(s.total_price) : 0,
        items: Array.isArray(s.items) ? s.items.map((item: any) => ({
          ...item,
          unit_price: item.unit_price ? Number(item.unit_price) : 0,
          quantity: item.quantity ? Number(item.quantity) : 0
        })) : []
      }));
    } else {
      sales.value = [];
      error.value = 'No se pudieron procesar las ventas de la base de datos.';
    }
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error al cargar las ventas.';
    sales.value = [];
  } finally {
    loading.value = false;
  }
};

// Computed estadísticos limpios
const totalRevenue = computed(() => sales.value.reduce((total, sale) => total + (sale.total_price || 0), 0));
const totalSales = computed(() => sales.value.length);
const mostSoldProduct = computed(() => {
  if (sales.value.length === 0) return 'N/A';
  const allItems = sales.value.flatMap(s => s.items || []);
  const productCounts = allItems.reduce((acc: Record<string, number>, item) => {
    const name = item.product?.name || 'Desconocido';
    acc[name] = (acc[name] || 0) + item.quantity;
    return acc;
  }, {});
  return Object.entries(productCounts).reduce((a, b) => ((a[1] as number) > (b[1] as number) ? a : b), ['', 0])[0] || 'N/A';
});

const formatCurrency = (amount: any) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount || 0);
};

const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', { 
    day: '2-digit', 
    month: 'short',
    year: 'numeric'
  });
};

const toggleSaleDetails = (saleId: number) => {
  const index = expandedSales.value.indexOf(saleId);
  if (index > -1) {
    expandedSales.value.splice(index, 1);
  } else {
    expandedSales.value.push(saleId);
  }
};

const openSaleModal = (mode: 'create' | 'edit' | 'view', sale: any = {}) => {
  modalMode.value = mode;
  isModalOpen.value = true;
  
  store.limpiarItems();
  
  if (mode === 'create') {
    selectedSale.value = { items: [], clientName: '', date: '', time: '' };
  } else {
    // 🔥 CORREGIDO: Mapeamos de DB -> Formato esperado por SaleModal
    selectedSale.value = {
      ...sale,
      clientName: sale.customer || 'Consumidor Final', // Mapeo para que el modal lea el input del nombre
      clientAddress: sale.address || ''
    };

    // Inyectamos los productos al Pinia Store para que el modal renderice las filas del "carrito"
    if (sale.items && sale.items.length > 0) {
      sale.items.forEach((item: any) => {
        store.agregarItem({
          id: item.product_id || item.id,
          nombre: item.productName || 'Planta',
          precioUnitario: item.unit_price,
          cantidad: item.quantity
        });
      });
    }
  }
};

const handleSaleSubmit = async (saleData: any) => {
  try {
    let fullPayload = { ...saleData };
    
    if (modalMode.value === 'create' || modalMode.value === 'edit') {
      if (store.items.length === 0) {
        throw new Error('No hay items en el carrito – agrega productos primero.');
      }
      
      let payloadFromStore = store.getPayload;
      if (!payloadFromStore || !payloadFromStore.items || payloadFromStore.items.length === 0) {
        payloadFromStore = {
          items: store.items.map(i => ({ 
            productId: i.id,
            quantity: i.cantidad,
            unitPrice: i.precioUnitario
          })),
          subtotal: store.subtotal,
          iva: store.ivaTotal,
          total: store.totalFinal
        };
      }
      
      fullPayload = {
        customer: fullPayload.clientName,
        address: fullPayload.clientAddress || null,
        ...payloadFromStore,
      };
    }
    
    if (modalMode.value === 'create') {
      const response = await api.createSale(fullPayload);
      if (response.success) {
        await loadSales();
        store.limpiarItems();
      } else {
        throw new Error(response.error || 'Error en creación');
      }
    } else if (modalMode.value === 'edit') {
      const response = await api.updateSale((selectedSale.value as any).id, fullPayload);
      if (response.success) {
        await loadSales();
        store.limpiarItems();
      } else {
        throw new Error(response.error);
      }
    }
    isModalOpen.value = false;
  } catch (err) {
    console.error('Error submitting sale:', err);
    error.value = err instanceof Error ? err.message : 'Error al guardar la venta.';
  }
};

onMounted(() => {
  loadSales();
});
</script>

<style scoped>
@import '@/assets/css/sales-history.css';
.btn {
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
}
.btn:not(.rounded-full) {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
}
.btn-primary {
  background-color: #3b82f6;
  color: white;
}
.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}
.text-primary { color: #3b82f6; }
body {
  min-height: max(884px, 100dvh);
}
</style>