<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Productos</h1>
        <p class="text-gray-600">Gestiona el inventario de productos</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Nuevo Producto
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            v-model="filters.search"
            placeholder="Nombre, código..."
            class="input w-full"
            @input="applyFilters"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select v-model="filters.category" class="input w-full" @change="applyFilters">
            <option value="">Todas</option>
            <option value="planta">Planta</option>
            <option value="arbusto">Arbusto</option>
            <option value="plantin">Plantín</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <select v-model="filters.stock" class="input w-full" @change="applyFilters">
            <option value="">Todos</option>
            <option value="in">En stock</option>
            <option value="low">Stock bajo</option>
            <option value="out">Sin stock</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
          <select v-model="filters.sort" class="input w-full" @change="applyFilters">
            <option value="name">Nombre</option>
            <option value="price">Precio</option>
            <option value="stock">Stock</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="!loading && filteredProducts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="product in filteredProducts" :key="product.id"
        class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div class="aspect-w-4 aspect-h-3">
            <img
              :src="product.image_url || 'https://via.placeholder.com/300x200'"
              :alt="product.name"
              class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            />
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
              <p class="text-sm text-gray-500">{{ product.category }}</p>
              <p class="text-sm text-gray-500">{{ product.pot_size }}</p>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStockStatusClass(product.stock)">
              {{ getStockStatusText(product.stock) }}
            </span>
          </div>
          
          <div class="flex justify-between items-center mb-4">
            <div class="text-xl font-bold text-primary">${{ Number(product.price).toFixed(2) }}</div>
            <div class="text-sm text-gray-500">Stock: {{ product.stock }}</div>
          </div>
          <div class="flex gap-2">
            <button @click="openEditModal(product)" class="btn btn-outline flex-1">
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

    <div v-else-if="loading" class="text-center py-8">
      <p class="text-gray-600">Cargando productos...</p>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-600">No se encontraron productos.</p>
    </div>
    <div v-if="error" class="text-center py-4 text-error">
      <p>Error al cargar los productos: {{ error }}</p>
    </div>

    <Modal :open="isCreateModalOpen" @close="closeCreateModal">
      <h2 class="text-xl font-bold mb-4">Nuevo Producto</h2>
      <form @submit.prevent="createProduct">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="newProduct.name" type="text" class="input w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select v-model="newProduct.category" class="input w-full" required>
              <option value="planta">Planta</option>
              <option value="arbusto">Arbusto</option>
              <option value="plantin">Plantín</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input v-model.number="newProduct.price" type="number" step="0.01" class="input w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input v-model.number="newProduct.stock" type="number" class="input w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Maceta</label>
            <select v-model="editingProduct.pot_size" class="input w-full" required>
              <option value="pequeña">Pequeña</option>
              <option value="mediana">Mediana</option>
              <option value="grande">Grande</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imagen (URL)</label>
            <input v-model="newProduct.image_url" type="url" class="input w-full" placeholder="https://example.com/image.jpg" />
          </div>
        </div>
        <div class="mt-6 flex gap-4">
          <button type="submit" class="btn btn-primary flex-1">Guardar Producto</button>
          <button type="button" @click="closeCreateModal" class="btn btn-outline flex-1">Cancelar</button>
        </div>
      </form>
    </Modal>

    <Modal :open="isEditModalOpen" @close="closeEditModal">
      <h2 class="text-xl font-bold mb-4">Editar Producto</h2>
      <form @submit.prevent="updateProduct">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="editingProduct.name" type="text" class="input w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select v-model="editingProduct.category" class="input w-full" required>
              <option value="planta">Planta</option>
              <option value="arbusto">Arbusto</option>
              <option value="plantin">Plantín</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input v-model.number="editingProduct.price" type="number" step="0.01" class="input w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input v-model.number="editingProduct.stock" type="number" class="input w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Maceta</label>
            <select v-model="editingProduct.pot_size" class="input w-full" required>
              <option value="pequeña">Pequeña</option>
              <option value="mediana">Mediana</option>
              <option value="grande">Grande</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imagen (URL)</label>
            <input v-model="editingProduct.image_url" type="url" class="input w-full" placeholder="https://example.com/image.jpg" />
          </div>
        </div>
        <div class="mt-6 flex gap-4">
          <button type="submit" class="btn btn-primary flex-1">Guardar Cambios</button>
          <button type="button" @click="closeEditModal" class="btn btn-outline flex-1">Cancelar</button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useApiService } from '~/services/api';
import Modal from '~/components/Modal.vue'; // Asegúrate de que la ruta al componente Modal sea correcta

definePageMeta({
  layout: 'admin' || 'encargado'
});

const api = useApiService();

// Filters state
const filters = reactive({
  search: '',
  category: '',
  stock: '',
  sort: 'name',
});

// Products state
const allProducts = ref([]); // Store all loaded products
const loading = ref(false);
const error = ref(null);

// Create Modal state
const isCreateModalOpen = ref(false);
const newProduct = reactive({
  name: '',
  category: '',
  price: 0,
  stock: 0,
  pot_size: '',
  image_url: '',
});

// Edit Modal state
const isEditModalOpen = ref(false);
const editingProduct = reactive({
  id: null,
  name: '',
  category: '',
  price: 0,
  stock: 0,
  pot_size: '',
  image_url: '',
});

// Filtered products computed
const filteredProducts = computed(() => {
  return allProducts.value.filter(product => {
    const searchMatch = !filters.search || product.name.toLowerCase().includes(filters.search.toLowerCase());
    const categoryMatch = !filters.category || product.category === filters.category;
    const stockMatch = !filters.stock ||
      (filters.stock === 'in' && product.stock > 0) ||
      (filters.stock === 'low' && product.stock > 0 && product.stock < 10) ||
      (filters.stock === 'out' && product.stock === 0);
    return searchMatch && categoryMatch && stockMatch;
  }).sort((a, b) => {
    if (filters.sort === 'name') return a.name.localeCompare(b.name);
    if (filters.sort === 'price') return Number(a.price) - Number(b.price);
    if (filters.sort === 'stock') return a.stock - b.stock;
    return 0;
  });
});

// Function to open the create product modal
const openCreateModal = () => {
  isCreateModalOpen.value = true;
};

// Function to close the create product modal
const closeCreateModal = () => {
  isCreateModalOpen.value = false;
  Object.assign(newProduct, { name: '', category: '', price: 0, stock: 0,pot_size:'', image_url: '' });
};

// Function to handle the creation of a new product
const createProduct = async () => {
  try {
    await api.createProduct(newProduct);
    closeCreateModal();
    loadProducts(); // Reload to get the updated list
    alert('Producto creado exitosamente!');
  } catch (err) {
    console.error('Error al crear producto:', err);
    alert('Error al crear el producto. Por favor, intenta de nuevo.');
  }
};

// Function to open the edit product modal
const openEditModal = (product) => {
  Object.assign(editingProduct, { ...product });
  isEditModalOpen.value = true;
};

// Function to close the edit product modal
const closeEditModal = () => {
  isEditModalOpen.value = false;
  // Optionally reset editingProduct
};

// Function to handle the update of a product
const updateProduct = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.updateProduct(editingProduct.id, editingProduct);
    const updatedProduct = { ...response.data };
    const index = allProducts.value.findIndex((p) => p.id === editingProduct.id);
    if (index !== -1) {
      allProducts.value[index] = updatedProduct; // Update with API response
    }
    closeEditModal();
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al actualizar el producto.';
    console.error('Error updating product:', err);
    await loadProducts(); // Reload to sync with database
  } finally {
    loading.value = false;
  }
};

// Function to load products from the API
const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.getProducts(); // Fetch all products initially
    allProducts.value = response.data || response;
    console.log('Productos cargados:', allProducts.value);
  } catch (err) {
    console.error('Error al cargar productos:', err);
    error.value = err.message || 'No se pudieron cargar los productos. Inténtalo de nuevo.';
    allProducts.value = [];
  } finally {
    loading.value = false;
  }
};

// Apply filters on changes
const applyFilters = () => {
  // No need to reload all products, the filteredProducts computed will update
};

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

// Load products on component mount
onMounted(loadProducts);
</script>