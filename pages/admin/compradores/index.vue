<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Compradores</h1>
        <p class="text-gray-600">Administra los compradores del vivero</p>
      </div>
      <button class="btn btn-primary">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Nuevo Comprador
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Nombre, email..." 
            class="input w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select v-model="filters.status" class="input w-full">
            <option value="">Todos</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select v-model="filters.sort" class="input w-full">
            <option value="name">Nombre</option>
            <option value="sales">Compras</option>
            <option value="date">Fecha</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comprador
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Compras
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última compra
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="seller in sellers" :key="seller.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="font-medium text-primary">{{ getInitials(seller.name) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ seller.name }}</div>
                    <div class="text-sm text-gray-500">ID: {{ seller.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ seller.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">${{ seller.sales.toLocaleString() }}</div>
                <div class="text-sm text-gray-500">{{ seller.totalSales }} ventas</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" 
                  :class="seller.status === 'active' ? 'bg-success/10 text-success' : 'bg-gray-100 text-gray-800'">
                  {{ seller.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ seller.lastSale }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-primary-dark mr-3">
                  <Icon name="heroicons:pencil-square" class="w-5 h-5" />
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
                <span class="font-medium">20</span> resultados
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
  sort: 'name'
});

// Mock data for sellers
const sellers = ref([
  {
    id: 'VE001',
    name: 'María López',
    email: 'maria@example.com',
    sales: 45000,
    totalSales: 23,
    status: 'active',
    lastSale: '2025-04-15'
  },
  {
    id: 'VE002',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    sales: 38000,
    totalSales: 19,
    status: 'active',
    lastSale: '2025-04-14'
  },
  {
    id: 'VE003',
    name: 'Ana García',
    email: 'ana@example.com',
    sales: 52000,
    totalSales: 28,
    status: 'inactive',
    lastSale: '2025-04-10'
  }
]);

// Helper function to get initials from name
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};
</script>