<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Productos</h1>
        <p class="text-gray-600">Gestiona el inventario de productos</p>
      </div>
      <button class="btn btn-primary">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Nuevo Producto
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input 
            type="text" 
            v-model="filters.search" 
            placeholder="Nombre, código..." 
            class="input w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select v-model="filters.category" class="input w-full">
            <option value="">Todas</option>
            <option value="plantas">Plantas</option>
            <option value="semillas">Semillas</option>
            <option value="herramientas">Herramientas</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <select v-model="filters.stock" class="input w-full">
            <option value="">Todos</option>
            <option value="in">En stock</option>
            <option value="low">Stock bajo</option>
            <option value="out">Sin stock</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select v-model="filters.sort" class="input w-full">
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
            <option value="stock">Stock</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="product in products" :key="product.id" 
        class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div class="aspect-w-4 aspect-h-3">
          <img :src="product.image" :alt="product.name" class="w-full h-full object-cover" />
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">{{ product.category }}</p>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full" 
              :class="getStockStatusClass(product.stock)">
              {{ getStockStatusText(product.stock) }}
            </span>
          </div>
          <div class="flex justify-between items-center mb-4">
            <div class="text-xl font-bold text-primary">${{ product.price }}</div>
            <div class="text-sm text-gray-500">Stock: {{ product.stock }}</div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-outline flex-1">
              <Icon name="heroicons:pencil-square" class="w-4 h-4 mr-1" />
              Editar
            </button>
            <button class="btn btn-outline text-error hover:bg-error/10 flex-1">
              <Icon name="heroicons:trash" class="w-4 h-4 mr-1" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-sm">
      <div class="flex-1 flex justify-between sm:hidden">
        <button class="btn btn-outline">Anterior</button>
        <button class="btn btn-outline">Siguiente</button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Mostrando <span class="font-medium">1</span> a <span class="font-medium">12</span> de{' '}
            <span class="font-medium">24</span> productos
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
</template>

<script setup>
import { ref, reactive } from 'vue';

definePageMeta({
  layout: 'admin'
});

// Filters state
const filters = reactive({
  search: '',
  category: '',
  stock: '',
  sort: 'name'
});

// Mock data for products
const products = ref([
  {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Plantas',
    price: 2500,
    stock: 15,
    image: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg'
  },
  {
    id: 2,
    name: 'Ficus Lyrata',
    category: 'Plantas',
    price: 3200,
    stock: 8,
    image: 'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg'
  },
  {
    id: 3,
    name: 'Semillas de Lavanda',
    category: 'Semillas',
    price: 450,
    stock: 50,
    image: 'https://images.pexels.com/photos/4505161/pexels-photo-4505161.jpeg'
  },
  {
    id: 4,
    name: 'Kit de Jardinería',
    category: 'Herramientas',
    price: 1800,
    stock: 5,
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg'
  }
]);

// Helper function to get stock status class
const getStockStatusClass = (stock) => {
  if (stock === 0) return 'bg-error/10 text-error';
  if (stock < 10) return 'bg-warning/10 text-warning';
  return 'bg-success/10 text-success';
};

// Helper function to get stock status text
const getStockStatusText = (stock) => {
  if (stock === 0) return 'Sin stock';
  if (stock < 10) return 'Stock bajo';
  return 'En stock';
};
</script>