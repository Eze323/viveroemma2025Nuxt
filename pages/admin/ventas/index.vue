<template>
  <div class="relative flex h-auto min-h-screen w-full flex-col justify-between overflow-x-hidden bg-background-light dark:bg-background-dark font-display">
    <div class="flex-grow pb-28">
      <!-- Header -->
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Ventas</h1>
          <p class="text-gray-600">Administra las ventas del vivero</p>
        </div>
        
        <button 
          @click="openSaleModal('create')" title="Crear nueva venta"
          class="btn btn-primary flex items-center justify-center w-12 h-12 rounded-full p-0 relative group shadow-lg hover:shadow-xl transition-shadow"
        >
          <Icon name="heroicons:plus" class="w-6 h-6" />
          <span class="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            Crear nueva venta
          </span>
        </button>
      </div>

      <!-- Modal -->
      <SaleModal
        :is-open="isModalOpen"
        :mode="modalMode"
        :sale="selectedSale"
        @update:isOpen="isModalOpen = $event"
        @submit="handleSaleSubmit"
      />

      <!-- Main Content -->
      <main class="p-4">
        <!-- Loading/Error -->
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
          <!-- Statistics Section -->
          <section class="mb-8">
            <h2 class="mb-4 text-xl font-bold text-foreground-light dark:text-foreground-dark">Estadísticas</h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Total Revenue Card -->
              <div class="stat-card revenue">
                <div class="stat-icon">
                  <Icon name="heroicons:currency-dollar" class="w-6 h-6" />
                </div>
                <div class="stat-content">
                  <p class="stat-label">Ingresos totales</p>
                  <p class="stat-value">{{ formatCurrency(totalRevenue) }}</p>
                </div>
              </div>

              <!-- Total Sales Card -->
              <div class="stat-card sales">
                <div class="stat-icon">
                  <Icon name="heroicons:shopping-bag" class="w-6 h-6" />
                </div>
                <div class="stat-content">
                  <p class="stat-label">Número de ventas</p>
                  <p class="stat-value">{{ totalSales }}</p>
                </div>
              </div>

              <!-- Most Sold Product Card -->
              <div class="stat-card product sm:col-span-2 lg:col-span-1">
                <div class="stat-icon">
                  <Icon name="heroicons:star" class="w-6 h-6" />
                </div>
                <div class="stat-content">
                  <p class="stat-label">Producto más vendido</p>
                  <p class="stat-value truncate">{{ mostSoldProduct }}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Sales History Section -->
          <section>
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-foreground-light dark:text-foreground-dark">
                Historial de Ventas
              </h2>
              <div class="text-sm text-gray-500">
                {{ sales.length }} {{ sales.length === 1 ? 'venta' : 'ventas' }}
              </div>
            </div>

            <!-- Sales List -->
            <div v-if="sales.length > 0" class="space-y-3">
              <div
                v-for="sale in sales"
                :key="sale.id"
                class="sale-card"
                @click="toggleSaleDetails(sale.id)"
              >
                <!-- Card Header -->
                <div class="sale-header">
                  <!-- Left: Client & ID -->
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                      <div class="client-avatar">
                        <Icon name="heroicons:user" class="w-4 h-4" />
                      </div>
                      <h3 class="sale-client">{{ sale.clientName }}</h3>
                    </div>
                    <div class="sale-meta">
                      <span class="sale-id">#{{ sale.id }}</span>
                      <span class="sale-separator">•</span>
                      <span class="sale-date">{{ formatDate(sale.date) }}</span>
                      <span class="sale-separator">•</span>
                      <span class="sale-time">{{ sale.time }}</span>
                    </div>
                  </div>

                  <!-- Right: Amount & Arrow -->
                  <div class="flex items-center gap-3">
                    <div class="text-right">
                      <p class="sale-amount">{{ formatCurrency(sale.amount) }}</p>
                      <p class="sale-items">{{ sale.items.length }} {{ sale.items.length === 1 ? 'item' : 'items' }}</p>
                    </div>
                    <Icon 
                      name="heroicons:chevron-down" 
                      class="w-5 h-5 text-gray-400 transition-transform"
                      :class="{ 'rotate-180': expandedSales.includes(sale.id) }"
                    />
                  </div>
                </div>

                <!-- Expandable Details -->
                <div 
                  v-if="expandedSales.includes(sale.id)"
                  class="sale-details"
                >
                  <div class="details-divider"></div>
                  
                  <!-- Items List -->
                  <div class="details-section">
                    <h4 class="details-title">Productos</h4>
                    <div class="items-list">
                      <div
                        v-for="(item, index) in sale.items"
                        :key="index"
                        class="item-row"
                      >
                        <div class="item-info">
                          <span class="item-name">{{ item.productName || item.nombre }}</span>
                          <span class="item-quantity">x{{ item.quantity || item.cantidad }}</span>
                        </div>
                        <span class="item-price">
                          ${{ formatPrice((item.unitPrice || item.precioUnitario) * (item.quantity || item.cantidad)) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
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

            <!-- Empty State -->
            <div v-else class="empty-state">
              <div class="empty-icon">
                <Icon name="heroicons:shopping-cart" class="w-16 h-16" />
              </div>
              <h3 class="empty-title">No hay ventas registradas</h3>
              <p class="empty-description">Comienza creando tu primera venta</p>
              <button
                @click="openSaleModal('create')"
                class="empty-action"
              >
                <Icon name="heroicons:plus" class="w-5 h-5" />
                Crear venta
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>


  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useApiService } from '~/services/api/api';  // Ajusta path si es necesario
import SaleModal from '~/components/admin/Ventas/SaleModal.vue';
import { useVentasStore } from '~/stores/ventas';  // Importa el store

definePageMeta({
  layout: 'admin',
});

const api = useApiService();

const sales = ref([]);
const loading = ref(false);
const error = ref(null);
const expandedSales = ref<number[]>([]); // Track expanded sales

const isModalOpen = ref(false);
const modalMode = ref('create');
const selectedSale = ref({});

const store = useVentasStore();  // Instancia del store

const navItems = [
  { title: 'Dashboard', icon: 'dashboard', href: '/admin', active: false },
  { title: 'Productos', icon: 'potted_plant', href: '/admin/productos', active: false },
  { title: 'Ventas', icon: 'paid', href: '/admin/ventas', active: true },
  { title: 'Clientes', icon: 'groups', href: '/admin/clientes', active: false },
];

const loadSales = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.getSales();
    if (response && response.success && Array.isArray(response.data)) {
      sales.value = response.data.map(s => ({
        ...s,
        items: Array.isArray(s.items) ? s.items : []
      }));
    } else {
      sales.value = [];
      error.value = response.error || 'No se pudieron cargar las ventas.';
    }
  } catch (err) {
    error.value = err.message || 'Error al cargar las ventas.';
    console.error('Error loading sales:', err);
    sales.value = [];
  } finally {
    loading.value = false;
  }
};

// Computed para stats (usa items para mostSoldProduct)
const totalRevenue = computed(() => sales.value.reduce((total, sale) => total + sale.amount, 0));
const totalSales = computed(() => sales.value.length);
const mostSoldProduct = computed(() => {
  if (sales.value.length === 0) return 'N/A';
  const allItems = sales.value.flatMap(s => s.items || []);
  const productCounts = allItems.reduce((acc, item) => {
    const name = item.productName || 'Desconocido';
    acc[name] = (acc[name] || 0) + item.quantity;
    return acc;
  }, {});
  return Object.entries(productCounts).reduce((a, b) => (a[1] > b[1] ? a : b), ['', 0])[0] || 'Suculentas';
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount || 0);
};

const formatPrice = (price: number): string => {
  return price.toFixed(2);
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

const openSaleModal = (mode: 'create' | 'edit', sale = {}) => {
  modalMode.value = mode;
  selectedSale.value = { ...sale };  // Clone, incluye items
  
  if (mode === 'create') {
    store.limpiarItems();  // Limpia el store para nueva venta
    selectedSale.value = { items: [], clientName: '', date: '', time: '' };  // Reset base
  } else if (mode === 'edit') {
    // Para edit, carga items existentes en el store (mapea a formato VentaItem)
    store.limpiarItems();
    if (sale.items && sale.items.length > 0) {
      sale.items.forEach(item => {
        store.agregarItem({
          id: item.productId || item.id,
          nombre: item.productName || item.nombre,
          precioUnitario: item.unitPrice || item.precioUnitario || item.precio_unitario,
          cantidad: item.quantity || item.cantidad
        });
      });
    }
  }
  
  isModalOpen.value = true;
};

const handleSaleSubmit = async (saleData: any) => {
  try {
    let fullPayload = { ...saleData };  // { clientName, clientAddress }
    
    if (modalMode.value === 'create' || modalMode.value === 'edit') {
      // DEBUG: Loggea el store antes del merge (quita después si querés)
      console.log('Store items antes de merge:', store.items);
      console.log('getPayload.value antes de spread:', store.getPayload.value);
      
      if (store.items.length === 0) {
        throw new Error('No hay items en el carrito – agrega productos primero.');
      }
      
      // Fallback manual: Si getPayload.value es undefined o vacío, construye manual
      let payloadFromStore = store.getPayload.value;
      if (!payloadFromStore || !payloadFromStore.items || payloadFromStore.items.length === 0) {
        console.warn('getPayload vacío, construyendo manual...');
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
        customer: fullPayload.clientName,  // ¡ACÁ EL MAPEO CLAVE! clientName -> customer
        address: fullPayload.clientAddress || null,  // Opcional, si schema lo tiene
        ...payloadFromStore,  // Spread items, subtotal, etc.
      };
    }
    
    // DEBUG: Log final del payload (quita después)
    console.log('Payload final enviado a /api/sales:', fullPayload);
    
    if (modalMode.value === 'create') {
      const response = await api.createSale(fullPayload);
      if (response.success) {
        await loadSales();
        store.limpiarItems();
      } else {
        throw new Error(response.error || 'Error en creación');
      }
    } else if (modalMode.value === 'edit') {
      const response = await api.updateSale(selectedSale.value.id, fullPayload);
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
    error.value = err.message || 'Error al guardar la venta.';
  }
};

onMounted(() => {
  loadSales();
  // Opcional: Limpia store al montar si no hay modal abierta
  if (!isModalOpen.value) store.limpiarItems();
});
</script>

<style scoped>
/* Tus estilos existentes, sin cambios */
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

.btn-outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-outline:hover {
  background-color: #f9fafb;
  transform: translateY(-1px);
}

.btn:hover {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.text-success { color: #10b981; }
.bg-success\/10 { background-color: rgba(16, 185, 129, 0.1); }
.text-warning { color: #f59e0b; }
.bg-warning\/10 { background-color: rgba(245, 158, 11, 0.1); }
.text-error { color: #ef4444; }
.bg-error\/10 { background-color: rgba(239, 68, 68, 0.1); }
.text-primary { color: #3b82f6; }

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

body {
  min-height: max(884px, 100dvh);
}
</style>
<style>
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined');
</style>