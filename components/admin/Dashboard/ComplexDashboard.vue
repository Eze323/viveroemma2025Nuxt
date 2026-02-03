<template>
  

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <!-- KPI Metrics Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <MetricCard
          title="Ventas del Mes"
          :value="45000"
          prefix="$"
          icon="heroicons:currency-dollar"
          color="success"
          :trend="12.5"
          comparison="vs mes anterior"
        />
        <MetricCard
          title="Productos Vendidos"
          :value="328"
          icon="heroicons:shopping-bag"
          color="primary"
          :trend="8.2"
          comparison="vs mes anterior"
        />
        <MetricCard
          title="Nuevos Clientes"
          :value="42"
          icon="heroicons:user-group"
          color="info"
          :trend="15.3"
          comparison="vs mes anterior"
        />
        <MetricCard
          title="Productos en Stock"
          :value="1247"
          icon="heroicons:cube"
          color="warning"
          :trend="-3.1"
          comparison="vs mes anterior"
        />
      </div>

      <!-- Quick Actions -->
      <div class="mb-6 sm:mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <QuickActionCard
            title="Nueva Venta"
            description="Registrar una nueva venta"
            icon="heroicons:shopping-cart"
            href="/admin/ventas"
            color="success"
          />
          <QuickActionCard
            title="Agregar Producto"
            description="Añadir producto al inventario"
            icon="heroicons:plus-circle"
            href="/admin/productos"
            color="primary"
          />
          <QuickActionCard
            title="Nuevo Cliente"
            description="Registrar un nuevo cliente"
            icon="heroicons:user-plus"
            href="/admin/clientes"
            color="info"
          />
        </div>
      </div>

      <!-- Charts and Tables Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <!-- Sales Chart - Takes 2 columns on large screens -->
        <div class="lg:col-span-2">
          <SalesChart 
            title="Ventas" 
            :data="chartData"
          />
        </div>

        <!-- Top Sellers - Takes 1 column -->
        <div class="lg:col-span-1">
          <TopSellersTable :sellers="topSellers" />
        </div>
      </div>

      <!-- Recent Sales Table - Full Width -->
      <div class="mt-6 sm:mt-8">
        <RecentSalesTable :sales="recentSales" />
      </div>

      <!-- Additional Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 sm:mt-8">
        <!-- Popular Categories -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Categorías Populares</h3>
          <div class="space-y-3">
            <div v-for="category in popularCategories" :key="category.name" class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: category.color }"></div>
                <span class="text-sm text-gray-700">{{ category.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-24 bg-gray-100 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-500" 
                    :style="{ width: category.percentage + '%', backgroundColor: category.color }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 w-12 text-right">{{ category.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-xl shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div class="space-y-4">
            <div v-for="activity in recentActivity" :key="activity.id" class="flex gap-3">
              <div class="flex-shrink-0">
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="activity.iconBg"
                >
                  <Icon :name="activity.icon" class="w-4 h-4" :class="activity.iconColor" />
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-gray-900">{{ activity.title }}</p>
                <p class="text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
 
</template>
<script setup>
import MetricCard from '~/components/admin/Dashboard/MetricCard.vue';
import QuickActionCard from '~/components/admin/Dashboard/QuickActionCard.vue';
import SalesChart from '~/components/admin/Dashboard/SalesChart.vue';
import TopSellersTable from '~/components/admin/Dashboard/TopSellersTable.vue';
import RecentSalesTable from '~/components/admin/Dashboard/RecentSalesTable.vue';

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
});

const authStore = useAuthStore();

// Chart data for sales
const chartData = {
  día: {
    labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM'],
    values: [350, 420, 510, 790, 850, 760, 620, 590, 680, 740]
  },
  semana: {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    values: [4200, 3800, 5100, 4700, 6200, 7800, 6500]
  },
  mes: {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    values: [28500, 33400, 42000, 39600]
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

// Popular categories
const popularCategories = [
  { name: 'Plantas de Interior', percentage: 35, color: '#2D6A4F' },
  { name: 'Plantas de Exterior', percentage: 28, color: '#40916C' },
  { name: 'Suculentas', percentage: 20, color: '#10B981' },
  { name: 'Árboles', percentage: 12, color: '#FFB627' },
  { name: 'Otros', percentage: 5, color: '#9CA3AF' }
];

// Recent activity
const recentActivity = [
  {
    id: 1,
    title: 'Nueva venta registrada #12350',
    time: 'Hace 5 minutos',
    icon: 'heroicons:shopping-cart',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600'
  },
  {
    id: 2,
    title: 'Producto agregado: Monstera Deliciosa',
    time: 'Hace 15 minutos',
    icon: 'heroicons:plus-circle',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    id: 3,
    title: 'Nuevo cliente registrado',
    time: 'Hace 1 hora',
    icon: 'heroicons:user-plus',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    id: 4,
    title: 'Stock actualizado: 15 productos',
    time: 'Hace 2 horas',
    icon: 'heroicons:arrow-path',
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-600'
  }
];</script>