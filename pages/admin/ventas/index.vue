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
  @click="openSaleModal('create')"  title="Crear nueva venta"
  class="btn btn-primary flex items-center justify-center w-10 h-10 rounded-full p-0 relative group"
  
>
  <Icon name="heroicons:plus" class="w-5 h-5" />
  <span class="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2">
    Crear nueva venta
  </span>
</button>
    </div>
 <!-- Button to open modal -->
    <!-- <button
      @click="openSaleModal('create')"
      class="px-4 py-2 rounded-lg bg-primary text-white"
    >
      Crear Nueva Venta
    </button> -->

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
        <!-- Statistics Section -->
        <section class="mb-6">
          <h2 class="mb-4 text-xl font-bold text-foreground-light dark:text-foreground-dark">Estadísticas</h2>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="rounded-xl border border-border-light bg-card-light p-4 shadow-sm dark:border-border-dark dark:bg-card-dark">
              <p class="text-sm font-medium text-foreground-light/70 dark:text-foreground-dark/70">Ingresos totales</p>
              <p class="text-2xl font-bold text-foreground-light dark:text-foreground-dark">$2,500</p>
            </div>
            <div class="rounded-xl border border-border-light bg-card-light p-4 shadow-sm dark:border-border-dark dark:bg-card-dark">
              <p class="text-sm font-medium text-foreground-light/70 dark:text-foreground-dark/70">Número de ventas</p>
              <p class="text-2xl font-bold text-foreground-light dark:text-foreground-dark">15</p>
            </div>
            <div class="col-span-1 rounded-xl border border-border-light bg-card-light p-4 shadow-sm sm:col-span-3 dark:border-border-dark dark:bg-card-dark">
              <p class="text-sm font-medium text-foreground-light/70 dark:text-foreground-dark/70">Producto más vendido</p>
              <p class="text-2xl font-bold text-foreground-light dark:text-foreground-dark">Suculentas</p>
            </div>
          </div>
        </section>

        <!-- Sales History Section -->
        <section>
          <h2 class="mb-4 text-xl font-bold text-foreground-light dark:text-foreground-dark">Historial de Ventas</h2>
          <div class="space-y-2">
            <div v-for="sale in sales" :key="sale.client" class="flex items-center bg-white justify-between rounded-lg bg-card-light p-4 dark:bg-card-dark rounded-xl shadow-sm transition-all hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer">
              <div>
                <p class="font-semibold text-foreground-light dark:text-foreground-dark">Cliente: {{ sale.client }}</p>
                <p class="text-sm text-foreground-light/70 dark:text-foreground-dark/70">{{ sale.time }}</p>
              </div>
              <p class="text-lg font-bold text-primary">${{ sale.amount }}</p>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 border-t border-border-light bg-background-light/90 px-4 pb-safe-bottom pt-2 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/90">
      <div class="flex justify-around">
        <NuxtLink
          v-for="navItem in navItems"
          :key="navItem.title"
          :to="navItem.href"
          class="flex flex-1 flex-col items-center  justify-center gap-1 py-1"
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
import { ref, reactive, computed, onMounted } from 'vue';

import SaleModal from '~/components/admin/Ventas/SaleModal.vue';

const isModalOpen = ref(false);
const modalMode = ref('create');
const selectedSale = ref({});

const openSaleModal = (mode, sale = {}) => {
  modalMode.value = mode;
  selectedSale.value = sale;
  isModalOpen.value = true;
};

const handleSaleSubmit = (saleData) => {
  console.log('Sale submitted:', saleData);
  // Example: Save sale to API
  // await useFetch('/api/sales', { method: 'POST', body: saleData });
};

definePageMeta({
  layout: 'admin',
});
const sales = [
  { client: 'Sofía', time: '10:00 AM', amount: 150 },
  { client: 'Mateo', time: '11:30 AM', amount: 300 },
  { client: 'Isabella', time: '12:45 PM', amount: 200 },
  { client: 'Alejandro', time: '2:15 PM', amount: 450 },
  { client: 'Valentina', time: '3:30 PM', amount: 600 },
  { client: 'Sebastián', time: '4:45 PM', amount: 800 },
];

const navItems = [
  { title: 'Dashboard', icon: 'dashboard', href: '/admin', active: false },
  { title: 'Productos', icon: 'potted_plant', href: '/admin/productos', active: false },
  { title: 'Ventas', icon: 'paid', href: '/ventas', active: true },
  { title: 'Clientes', icon: 'groups', href: '/admin/clientes', active: false },
  { title: 'Más', icon: 'menu', href: '/admin/mas', active: false },
];
// Datos de ejemplo - en un caso real vendrían de una API
// const sales = ref([
//   { id: 1, customer: 'Sofía', time: '10:00 AM', amount: 150 },
//   { id: 2, customer: 'Mateo', time: '11:30 AM', amount: 300 },
//   { id: 3, customer: 'Isabella', time: '12:45 PM', amount: 200 },
//   { id: 4, customer: 'Alejandro', time: '2:15 PM', amount: 450 },
//   { id: 5, customer: 'Valentina', time: '3:30 PM', amount: 600 },
//   { id: 6, customer: 'Sebastián', time: '4:45 PM', amount: 800 }
// ])

// Computed properties para las estadísticas
const totalRevenue = computed(() => {
  return sales.value.reduce((total, sale) => total + sale.amount, 0)
})

const mostSoldProduct = ref('Suculentas') // En un caso real, esto se calcularía

// Función para formatear moneda
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}
</script>

<style scoped>
/* Ajustar .btn para no interferir con botones circulares */
.btn {
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
}

/* Definir padding y border-radius solo si no se sobrescribe */
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