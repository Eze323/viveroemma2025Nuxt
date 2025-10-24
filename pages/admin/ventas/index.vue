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
          class="btn btn-primary flex items-center justify-center w-10 h-10 rounded-full p-0 relative group"
        >
          <Icon name="heroicons:plus" class="w-5 h-5" />
          <span class="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2">
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
        <div v-if="loading" class="text-center py-4 text-gray-500">Cargando ventas...</div>
        <div v-else-if="error" class="text-center py-4 text-red-500">{{ error }}</div>
        <div v-else>
          <!-- Statistics Section -->
          <section class="mb-6">
            <h2 class="mb-4 text-xl font-bold text-foreground-light dark:text-foreground-dark">Estadísticas</h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div class="rounded-xl border border-border-light bg-card-light p-4 shadow-sm dark:border-border-dark dark:bg-card-dark">
                <p class="text-sm font-medium text-foreground-light/70 dark:text-foreground-dark/70">Ingresos totales</p>
                <p class="text-2xl font-bold text-foreground-light dark:text-foreground-dark">{{ formatCurrency(totalRevenue) }}</p>
              </div>
              <div class="rounded-xl border border-border-light bg-card-light p-4 shadow-sm dark:border-border-dark dark:bg-card-dark">
                <p class="text-sm font-medium text-foreground-light/70 dark:text-foreground-dark/70">Número de ventas</p>
                <p class="text-2xl font-bold text-foreground-light dark:text-foreground-dark">{{ totalSales }}</p>
              </div>
              <div class="col-span-1 rounded-xl border border-border-light bg-card-light p-4 shadow-sm sm:col-span-3 dark:border-border-dark dark:bg-card-dark">
                <p class="text-sm font-medium text-foreground-light/70 dark:text-foreground-dark/70">Producto más vendido</p>
                <p class="text-2xl font-bold text-foreground-light dark:text-foreground-dark">{{ mostSoldProduct }}</p>
              </div>
            </div>
          </section>

          <!-- Sales History Section -->
          <section>
            <h2 class="mb-4 text-xl font-bold text-foreground-light dark:text-foreground-dark">Historial de Ventas</h2>
            <div class="space-y-2" v-if="sales.length > 0">
              <div v-for="sale in sales" :key="sale.id" class="flex items-center justify-between rounded-lg bg-card-light p-4 dark:bg-card-dark rounded-xl shadow-sm transition-all hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer" @click="openSaleModal('edit', sale)">
                <div>
                  <p class="font-semibold text-foreground-light dark:text-foreground-dark">Cliente: {{ sale.clientName }}</p>
                  <p class="font-semibold text-foreground-light dark:text-foreground-dark">Venta #{{ sale.id }}</p>
                  <p class="text-sm text-foreground-light/70 dark:text-foreground-dark/70">{{ sale.date }}-{{ sale.time }} - ({{ sale.items.length }} items)</p>
                </div>
                <p class="text-lg font-bold text-primary">{{ formatCurrency(sale.amount) }}</p>
              </div>
            </div>
            <div v-else class="text-center py-8 text-gray-500">No hay ventas registradas aún.</div>
          </section>
        </div>
      </main>
    </div>

    <!-- Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 border-t border-border-light bg-background-light/90 px-4 pb-safe-bottom pt-2 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/90">
      <div class="flex justify-around">
        <NuxtLink
          v-for="navItem in navItems"
          :key="navItem.title"
          :to="navItem.href"
          class="flex flex-1 flex-col items-center justify-center gap-1 py-1"
          :class="navItem.active ? 'rounded-full bg-primary/10 text-primary dark:bg-primary/20' : 'text-foreground-light/70 dark:text-foreground-dark/70'"
        >
          <span
            class="material-symbols-outlined"
            :style="navItem.active ? 'font-variation-settings: \'FILL\' 1' : ''"
          >
            {{ navItem.icon }}
          </span>
          <span :class="['text-xs', navItem.active ? 'font-bold' : 'font-medium']">{{ navItem.title }}</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useApiService } from '~/services/api/api';  // Ajusta path si es necesario
import SaleModal from '~/components/admin/Ventas/SaleModal.vue';

definePageMeta({
  layout: 'admin',
});

const api = useApiService();

const sales = ref([]);
const loading = ref(false);
const error = ref(null);

const isModalOpen = ref(false);
const modalMode = ref('create');
const selectedSale = ref({});

const navItems = [
  { title: 'Dashboard', icon: 'dashboard', href: '/admin', active: false },
  { title: 'Productos', icon: 'potted_plant', href: '/admin/productos', active: false },
  { title: 'Ventas', icon: 'paid', href: '/ventas', active: true },
  { title: 'Clientes', icon: 'groups', href: '/admin/clientes', active: false },
  { title: 'Más', icon: 'menu', href: '/admin/mas', active: false },
];

const loadSales = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.getSales();
    if (response && response.success && Array.isArray(response.data)) {
      sales.value = response.data;
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
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount || 0);
};

const openSaleModal = (mode, sale = {}) => {
  modalMode.value = mode;
  selectedSale.value = { ...sale };  // Clone, incluye items
  isModalOpen.value = true;
};

const handleSaleSubmit = async (saleData) => {
  try {
    if (modalMode.value === 'create') {
      const response = await api.createSale(saleData);
      if (response.success) {
        await loadSales();  // Recarga
      } else {
        throw new Error(response.error);
      }
    } else if (modalMode.value === 'edit') {
      const response = await api.updateSale(selectedSale.value.id, saleData);
      if (response.success) {
        await loadSales();
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

onMounted(loadSales);
</script>

<style scoped>
/* Tus estilos existentes, sin cambios */
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