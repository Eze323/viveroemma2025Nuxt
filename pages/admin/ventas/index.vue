<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ventas</h1>
        <p class="text-gray-600">Gestiona las ventas del vivero</p>
      </div>
      <button class="btn btn-primary">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Nueva Venta
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-primary-100 text-primary">
            <Icon name="heroicons:shopping-cart" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Ventas del día</p>
            <h3 class="text-xl font-bold text-gray-900">$12,500</h3>
            <p class="text-sm text-success flex items-center mt-1">
              <Icon name="heroicons:arrow-up" class="w-4 h-4 mr-1" />
              8.2% más que ayer
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-secondary-100 text-secondary">
            <Icon name="heroicons:users" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Clientes nuevos</p>
            <h3 class="text-xl font-bold text-gray-900">15</h3>
            <p class="text-sm text-success flex items-center mt-1">
              <Icon name="heroicons:arrow-up" class="w-4 h-4 mr-1" />
              12.5% más que ayer
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-accent-100 text-accent">
            <Icon name="heroicons:shopping-bag" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Productos vendidos</p>
            <h3 class="text-xl font-bold text-gray-900">45</h3>
            <p class="text-sm text-error flex items-center mt-1">
              <Icon name="heroicons:arrow-down" class="w-4 h-4 mr-1" />
              3.2% menos que ayer
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-success-100 text-success">
            <Icon name="heroicons:banknotes" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Ticket promedio</p>
            <h3 class="text-xl font-bold text-gray-900">$850</h3>
            <p class="text-sm text-success flex items-center mt-1">
              <Icon name="heroicons:arrow-up" class="w-4 h-4 mr-1" />
              5.3% más que ayer
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Cliente, ID..." 
            class="input w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select v-model="filters.status" class="input w-full">
            <option value="">Todos</option>
            <option value="completed">Completada</option>
            <option value="pending">Pendiente</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input 
            type="date" 
            v-model="filters.date" 
            class="input w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
          <select v-model="filters.seller" class="input w-full">
            <option value="">Todos</option>
            <option v-for="seller in sellers" :key="seller.id" :value="seller.id">
              {{ seller.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Sales Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Venta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vendedor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Productos
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="sale in sales" :key="sale.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ sale.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ sale.customer }}</div>
                <div class="text-sm text-gray-500">{{ sale.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sale.seller }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sale.items }} productos</div>
                <div class="text-sm text-gray-500">Ver detalles</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${{ sale.total.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" 
                  :class="getStatusClass(sale.status)">
                  {{ sale.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sale.date }}</div>
                <div class="text-sm text-gray-500">{{ sale.time }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-primary-dark mr-3">
                  <Icon name="heroicons:eye" class="w-5 h-5" />
                </button>
                <button class="text-primary hover:text-primary-dark mr-3">
                  <Icon name="heroicons:document-text" class="w-5 h-5" />
                </button>
                <button class="text-error hover:text-error-dark">
                  <Icon name="heroicons:trash" class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="btn btn-outline">Anterior</button>
            <button class="btn btn-outline">Siguiente</button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">1</span> a <span class="font-medium">10</span> de{' '}
                <span class="font-medium">20</span> ventas
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button class="btn btn-outline rounded-l-md">Anterior</button>
                <button class="btn btn-primary">1</button>
                <button class="btn btn-outline">2</button>
                <button class="btn btn-outline rounded-r-md">Siguiente</button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

definePageMeta({
  layout: 'admin'
});

// Filters state
const filters = reactive({
  search: '',
  status: '',
  date: '',
  seller: ''
});

// Mock data for sellers
const sellers = ref([
  { id: 1, name: 'María López' },
  { id: 2, name: 'Juan Pérez' },
  { id: 3, name: 'Ana García' }
]);

// Mock data for sales
const sales = ref([
  {
    id: '12345',
    customer: 'Carlos Rodríguez',
    email: 'carlos@example.com',
    seller: 'María López',
    items: 3,
    total: 4500,
    status: 'Completada',
    date: '2025-04-15',
    time: '14:30'
  },
  {
    id: '12346',
    customer: 'Laura Martínez',
    email: 'laura@example.com',
    seller: 'Juan Pérez',
    items: 2,
    total: 2800,
    status: 'Pendiente',
    date: '2025-04-15',
    time: '15:45'
  },
  {
    id: '12347',
    customer: 'Miguel Torres',
    email: 'miguel@example.com',
    seller: 'Ana García',
    items: 5,
    total: 7200,
    status: 'Completada',
    date: '2025-04-15',
    time: '16:20'
  }
]);

// Helper function to get status class
const getStatusClass = (status) => {
  const statusMap = {
    'Completada': 'bg-success/10 text-success',
    'Pendiente': 'bg-warning/10 text-warning',
    'Cancelada': 'bg-error/10 text-error'
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};
</script>