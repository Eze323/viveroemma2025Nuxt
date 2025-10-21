<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600">Bienvenido de nuevo, {{ authStore.user?.name || 'Usuario' }}</p>
    </div>
    
    <!-- Stats cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Ventas Totales" 
        value="$45,389" 
        icon="heroicons:shopping-cart" 
        color="primary" 
        :trend="12.5" 
        period="mes anterior"
      />
      <StatCard 
        title="Nuevos Clientes" 
        value="38" 
        icon="heroicons:users" 
        color="secondary" 
        :trend="5.2" 
        period="mes anterior"
      />
      <StatCard 
        title="Productos Vendidos" 
        value="149" 
        icon="heroicons:shopping-bag" 
        color="accent" 
        :trend="-2.3" 
        period="mes anterior"
      />
      <StatCard 
        title="Tasa de Conversión" 
        value="3.24%" 
        icon="heroicons:presentation-chart-line" 
        color="success" 
        :trend="1.8" 
        period="mes anterior"
      />
    </div>
    
    <!-- Charts and tables -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2">
        <!-- <SalesChart 
          title="Resumen de Ventas" 
          :data="chartData"
        /> -->
      </div>
      <div>
        <TopSellersTable :sellers="topSellers" />
      </div>
    </div>
    
    <!-- Recent sales -->
    <div>
      <RecentSalesTable :sales="recentSales" />
    </div>
  </div>
</template>
<script setup>
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  middleware: ['auth'],
});

//const authStore = useAuthStore();

//import { useAuthStore } from '~/stores/auth';
import StatCard from '~/components/admin/Dashboard/StatCard.vue';
import SalesChart from '~/components/admin/Dashboard/SalesChart.vue';
import TopSellersTable from '~/components/admin/Dashboard/TopSellersTable.vue';
import RecentSalesTable from '~/components/admin/Dashboard/RecentSalesTable.vue';

definePageMeta({
  layout: 'admin'
});

const authStore = useAuthStore();

// Mock data for charts
const chartData = {
  día: {
    labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM'],
    values: [350, 420, 510, 790, 850, 760, 620, 590, 680, 740]
  },
  semana: {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    values: [4200, 3800, 5100, 4700, 6200, 7800, 6500]
  },
  mes: {
    labels: ['1 Mayo', '5 Mayo', '10 Mayo', '15 Mayo', '20 Mayo', '25 Mayo', '30 Mayo'],
    values: [28500, 33400, 42000, 39600, 36800, 48500, 45000]
  },
  año: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    values: [38000, 42000, 35000, 32000, 45000, 50000, 48000, 61000, 54000, 56000, 62000, 78000]
  }
};

// Top sellers data
const topSellers = [
  {
    name: 'María López',
    id: 'VE-001',
    sales: 12680,
    orders: 32,
    products: 85,
    conversionRate: 68
  },
  {
    name: 'Juan Pérez',
    id: 'VE-003',
    sales: 10450,
    orders: 28,
    products: 74,
    conversionRate: 61
  },
  {
    name: 'Ana García',
    id: 'VE-007',
    sales: 9320,
    orders: 25,
    products: 65,
    conversionRate: 57
  },
  {
    name: 'Carlos Rodríguez',
    id: 'VE-004',
    sales: 7850,
    orders: 19,
    products: 53,
    conversionRate: 52
  },
  {
    name: 'Laura Martínez',
    id: 'VE-010',
    sales: 6420,
    orders: 17,
    products: 45,
    conversionRate: 48
  }
];

// Recent sales data
const recentSales = [
  {
    id: '12345',
    customer: 'Marta Gómez',
    email: 'marta@gmail.com',
    items: 3,
    total: 4250,
    date: '01/05/2025',
    time: '14:30',
    status: 'Completada'
  },
  {
    id: '12346',
    customer: 'Roberto Sánchez',
    email: 'roberto@gmail.com',
    items: 1,
    total: 2100,
    date: '01/05/2025',
    time: '12:15',
    status: 'Procesando'
  },
  {
    id: '12347',
    customer: 'Clara Fernández',
    email: 'clara@gmail.com',
    items: 4,
    total: 5680,
    date: '30/04/2025',
    time: '18:45',
    status: 'Completada'
  },
  {
    id: '12348',
    customer: 'Miguel Torres',
    email: 'miguel@gmail.com',
    items: 2,
    total: 3420,
    date: '30/04/2025',
    time: '16:20',
    status: 'Pendiente'
  },
  {
    id: '12349',
    customer: 'Sofía Ruiz',
    email: 'sofia@gmail.com',
    items: 5,
    total: 7890,
    date: '29/04/2025',
    time: '11:10',
    status: 'Completada'
  }
];
</script>