<!-- pages/products/index.vue -->
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
            v-model="filters.search"
            type="text"
            placeholder="Nombre..."
            class="input w-full"
            @input="applyFilters"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select v-model="filters.category" class="input w-full" @change="applyFilters">
            <option value="">Todas</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ capitalize(cat) }}</option>
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

    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Cargando productos...</p>
    </div>
    <div v-else-if="!filteredProducts.length" class="text-center py-8">
      <p class="text-gray-600">No se encontraron productos.</p>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="product in filteredProducts" :key="product.id"
        class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div class="aspect-w-4 aspect-h-3">
          <img
            loading="lazy"
            :src="product.image_url || '~/images/placeholder.png'"
            :alt="product.name"
            class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            @error="product.image_url = '~/images/placeholder.png'"
          />
        </div>
        <div class="p-4">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ product.name }}</h3>
              <p class="text-sm text-gray-500 capitalize">{{ product.category }}</p>
              <p class="text-sm text-gray-500">Maceta: {{ product.pot_size ? capitalize(product.pot_size) : 'N/A' }}</p>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStockStatusClass(product.stock)">
              {{ getStockStatusText(product.stock) }}
            </span>
          </div>
          <div class="flex justify-between items-center mb-4">
            <div class="text-xl font-bold text-primary">${{ formatPrice(product.price) }}</div>
            <div class="text-sm text-gray-500">Stock: {{ product.stock }}</div>
          </div>
          <div class="flex gap-2">
            <button @click="openEditModal(product)" class="btn btn-outline flex-1">
              <Icon name="heroicons:pencil-square" class="w-4 h-4 mr-1" />
              Editar
            </button>
            <button @click="deleteProduct(product.id)" class="btn btn-outline text-error hover:bg-error/10 flex-1">
              <Icon name="heroicons:trash" class="w-4 h-4 mr-1" />
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Creación -->
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
              <option value="" disabled>Seleccione una categoría</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ capitalize(cat) }}</option>
            </select>
          </div>
           <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input v-model="newProduct.description" type="text" class="input w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
            <input v-model.number="newProduct.price" type="number" step="0.01" class="input w-full" required min="0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input v-model.number="newProduct.stock" type="number" class="input w-full" required min="0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tamaño de Maceta</label>
            <select v-model="newProduct.pot_size" class="input w-full">
              <option value="">Sin especificar</option>
              <option v-for="size in potSizes" :key="size" :value="size">{{ capitalize(size) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imagen (URL)</label>
            <input v-model="newProduct.image_url" type="url" class="input w-full" placeholder="https://example.com/image.jpg" />
          </div>
        </div>
        <div class="mt-6 flex gap-4">
          <button type="submit" class="btn btn-primary flex-1" :disabled="loading">Guardar Producto</button>
          <button type="button" @click="closeCreateModal" class="btn btn-outline flex-1" :disabled="loading">Cancelar</button>
        </div>
      </form>
    </Modal>

    <!-- Modal de Edición -->
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
              <option value="" disabled>Seleccione una categoría</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ capitalize(cat) }}</option>
            </select>
          </div>
           <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input v-model="editingProduct.description" type="text" class="input w-full" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
            <input v-model.number="editingProduct.price" type="number" step="0.01" class="input w-full" required min="0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Stock</label>
            <input v-model.number="editingProduct.stock" type="number" class="input w-full" required min="0" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tamaño de Maceta</label>
            <select v-model="editingProduct.pot_size" class="input w-full">
              <option value="">Sin especificar</option>
              <option v-for="size in potSizes" :key="size" :value="size">{{ capitalize(size) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imagen (URL)</label>
            <input v-model="editingProduct.image_url" type="url" class="input w-full" placeholder="https://example.com/image.jpg" />
          </div>
        </div>
        <div class="mt-6 flex gap-4">
          <button type="submit" class="btn btn-primary flex-1" :disabled="loading">Guardar Cambios</button>
          <button type="button" @click="closeEditModal" class="btn btn-outline flex-1" :disabled="loading">Cancelar</button>
        </div>
      </form>
      <div v-if="error && !notification.isOpen" class="mt-4 text-error text-center">{{ error }}</div>
    </Modal>

    <!-- Modal de Notificación -->
    <NotificationModal
      :is-open="notification.isOpen"
      :message="notification.message"
      :type="notification.type"
      @close="closeNotification"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useApiService } from '~/services/api/api';
import { useAuthStore } from '~/stores/auth';
import Modal from '~/components/Modal.vue';
import NotificationModal from '~/components/NotificationModal.vue';

definePageMeta({
  layout: 'admin',
  //middleware: ['auth'],
});

interface Product {
  id: number;
  name: string;
  category: 'planta' | 'arbusto' | 'plantin' | 'otro' | 'semilla' | 'herramienta';
  description?: string;
  price: string;
  stock: number;
  image_url: string | null;
  pot_size: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const authStore = useAuthStore();
const api = useApiService();

const categories = ['planta', 'arbusto', 'plantin', 'otro', 'semilla', 'herramienta'] as const;
const potSizes = ['pequeña', 'mediana', 'grande'] as const;

const filters = reactive({
  search: '',
  category: '' as string | '',
  stock: '' as string | '',
  sort: 'name' as 'name' | 'price' | 'stock',
});

const allProducts = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const notification = reactive({
  isOpen: false,
  message: '',
  type: 'success' as 'success' | 'error',
});

const isCreateModalOpen = ref(false);
const newProduct = reactive({
  name: '',
  category: null as Product['category'] | null, // Inicializamos como null en lugar de ''
  description: '',
  price: 0,
  stock: 0,
  pot_size: '' as string | '',
  image_url: '',
});

const isEditModalOpen = ref(false);
const editingProduct = reactive({
  id: null as number | null,
  name: '',
  category: null as Product['category'] | null, // Inicializamos como null en lugar de ''
  description: '',
  price: 0,
  stock: 0,
  pot_size: '' as string | '',
  image_url: '',
});

const filteredProducts = computed(() => {
  if (!Array.isArray(allProducts.value)) {
    console.warn('allProducts.value no es un array:', allProducts.value);
    return [];
  }

  return allProducts.value
    .filter((product): product is Product => {
      if (!product?.id || !product.name) {
        console.warn('Invalid product:', product);
        return false;
      }
      const searchMatch = !filters.search || product.name.toLowerCase().includes(filters.search.toLowerCase());
      const categoryMatch = !filters.category || product.category === filters.category;
      const stockMatch =
        !filters.stock ||
        (filters.stock === 'in' && product.stock > 0) ||
        (filters.stock === 'low' && product.stock > 0 && product.stock < 10) ||
        (filters.stock === 'out' && product.stock === 0);
      return searchMatch && categoryMatch && stockMatch;
    })
    .sort((a, b) => {
      if (filters.sort === 'name') return a.name.localeCompare(b.name);
      if (filters.sort === 'price') return parseFloat(a.price) - parseFloat(b.price);
      if (filters.sort === 'stock') return a.stock - b.stock;
      return 0;
    });
});

const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.getProducts();
    //console.log('Respuesta de getProducts:', response);
    if (response && response.success && Array.isArray(response.data)) {
      allProducts.value = response.data;
    } else {
      //console.warn('Respuesta inválida de getProducts:', response);
      allProducts.value = [];
      error.value = response.error || 'No se pudieron cargar los productos.';
      showNotification(error.value ?? '', 'error');
    }
    //console.log('Productos cargados:', allProducts.value);
  } catch (err: any) {
    error.value = err.message || 'No se pudieron cargar los productos.';
    console.error('Error loading products:', err);
    allProducts.value = [];
    showNotification(error.value ?? '', 'error');
  } finally {
    loading.value = false;
  }
};

// Resto del código igual (applyFilters, formatPrice, createProduct, etc.)

const applyFilters = () => {
  filters.search = filters.search.trim();
};

const formatPrice = (price: string) => {
  return parseFloat(price).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const openCreateModal = () => {
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
  Object.assign(newProduct, { name: '', category: null,description:'', price: 0, stock: 0, pot_size: '', image_url: '' });
};

const openEditModal = (product: Product) => {
  Object.assign(editingProduct, {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description || '',
    price: parseFloat(product.price),
    stock: product.stock,
    pot_size: product.pot_size || '',
    image_url: product.image_url || '',
  });
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  Object.assign(editingProduct, { id: null, name: '', category: null ,description:'', price: 0, stock: 0, pot_size: '', image_url: '' });
};

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  notification.message = message;
  notification.type = type;
  notification.isOpen = true;
};

const closeNotification = () => {
  notification.isOpen = false;
  notification.message = '';
  notification.type = 'success';
};

const validateProduct = (product: typeof newProduct | typeof editingProduct) => {
  if (!product.name.trim()) {
    error.value = 'El nombre del producto es obligatorio.';
    showNotification(error.value ?? '', 'error');
    return false;
  }
  if (!product.category || !categories.includes(product.category)) {
    error.value = 'Seleccione una categoría válida.';
    showNotification(error.value ?? '', 'error');
    return false;
  }
  if (isNaN(product.price) || product.price < 0) {
    error.value = 'El precio debe ser un número válido mayor o igual a 0.';
    showNotification(error.value ?? '', 'error');
    return false;
  }
  if (isNaN(product.stock) || product.stock < 0) {
    error.value = 'El stock debe ser un número válido mayor o igual a 0.';
    showNotification(error.value ?? '', 'error');
    return false;
  }
  if (product.pot_size && !potSizes.includes(product.pot_size as any)) {
    error.value = 'Seleccione un tamaño de maceta válido o déjelo en blanco.';
    showNotification(error.value ?? '', 'error');
    return false;
  }
  if (product.image_url && !isValidUrl(product.image_url)) {
    error.value = 'La URL de la imagen no es válida.';
    showNotification(error.value ?? '', 'error');
    return false;
  }
  return true;
};

const isValidUrl = (url: string) => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const createProduct = async () => {
  if (!validateProduct(newProduct)) return;
  loading.value = true;
  error.value = null;
  try {
    const productData = {
      name: newProduct.name,
      category: newProduct.category,
      description: newProduct.description || null,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      pot_size: newProduct.pot_size || null,
      image_url: newProduct.image_url || null,
    };
    const response = await api.createProduct(productData);
    allProducts.value.push(response.data.product);
    closeCreateModal();
    showNotification('Producto creado exitosamente!');
    loadProducts(); // Reload products to ensure the new one is included
  } catch (err: any) {
    error.value = err.message || 'Error al crear el producto.';
    console.error('Error creating product:', err);
    showNotification(error.value ?? '', 'error');
  } finally {
    loading.value = false;
  }
};

const updateProduct = async () => {
  if (!validateProduct(editingProduct)) return;
  loading.value = true;
  error.value = null;
  try {
    const productData = {
      name: editingProduct.name,
      category: editingProduct.category,
      description: editingProduct.description || null,
      price: Number(editingProduct.price),
      stock: Number(editingProduct.stock),
      pot_size: editingProduct.pot_size || null,
      image_url: editingProduct.image_url || null,
    };
    const response = await api.updateProduct(editingProduct.id!, productData);
    const updatedProduct = response.data.product;
    const index = allProducts.value.findIndex((p) => p.id === editingProduct.id);
    if (index !== -1) {
      allProducts.value[index] = updatedProduct;
    } else {
      allProducts.value.push(updatedProduct);
    }
    closeEditModal();
    showNotification('Producto actualizado exitosamente!');
  } catch (err: any) {
    error.value = err.message || 'Error al actualizar el producto.';
    console.error('Error updating product:', err);
    showNotification(error.value ?? '', 'error');
  } finally {
    loading.value = false;
  }
};

const deleteProduct = async (productId: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
  loading.value = true;
  error.value = null;
  try {
    await api.deleteProduct(productId);
    allProducts.value = allProducts.value.filter((p) => p.id !== productId);
    showNotification('Producto eliminado exitosamente!');
  } catch (err: any) {
    error.value = err.message || 'Error al eliminar el producto.';
    console.error('Error deleting product:', err);
    showNotification(error.value ?? '', 'error');
  } finally {
    loading.value = false;
  }
};

const getStockStatusClass = (stock: number) => {
  if (stock === 0) return 'bg-error/10 text-error';
  if (stock < 10) return 'bg-warning/10 text-warning';
  return 'bg-success/10 text-success';
};

const getStockStatusText = (stock: number) => {
  if (stock === 0) return 'Sin stock';
  if (stock < 10) return 'Stock bajo';
  return 'En stock';
};

onMounted(loadProducts);
</script>

<style scoped>
.input {
  border: 1px solid #d1d5db;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}
.btn-primary {
  background-color: #3b82f6;
  color: white;
}
.btn-primary:hover {
  background-color: #2563eb;
}
.btn-outline {
  background-color: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
}
.btn-outline:hover {
  background-color: #f9fafb;
}
.text-success { color: #10b981; }
.bg-success\/10 { background-color: rgba(16, 185, 129, 0.1); }
.text-warning { color: #f59e0b; }
.bg-warning\/10 { background-color: rgba(245, 158, 11, 0.1); }
.text-error { color: #ef4444; }
.bg-error\/10 { background-color: rgba(239, 68, 68, 0.1); }
.text-primary { color: #3b82f6; }
</style>