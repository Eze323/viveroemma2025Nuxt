<template>
  <div>
    <div class="mb-4 flex justify-between items-center">
      <div>
        <h1 class="text-xl font-bold text-gray-900">Productos</h1>
        <p class="text-sm text-gray-600">Gestiona el inventario de productos</p>
      </div>
      
      <button 
  @click="openCreateModal" 
  class="btn btn-primary flex items-center justify-center w-10 h-10 rounded-full p-0 relative group"
  title="Crear nuevo producto"
>
  <Icon name="heroicons:plus" class="w-5 h-5" />
  <span class="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2">
    Crear nuevo producto
  </span>
</button>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-3 mb-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-2">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nombre..."
            class="input w-full text-xs py-1 px-2"
            @input="applyFilters"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
          <select v-model="filters.category" class="input w-full text-xs py-1 px-2" @change="applyFilters">
            <option value="">Todas</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ capitalize(cat) }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Stock</label>
          <select v-model="filters.stock" class="input w-full text-xs py-1 px-2" @change="applyFilters">
            <option value="">Todos</option>
            <option value="in">En stock</option>
            <option value="low">Stock bajo</option>
            <option value="out">Sin stock</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">Ordenar por</label>
          <select v-model="filters.sort" class="input w-full text-xs py-1 px-2" @change="applyFilters">
            <option value="name">Nombre</option>
            <option value="precio_venta">Precio</option>
            <option value="stock">Stock</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-4">
      <p class="text-sm text-gray-600">Cargando productos...</p>
    </div>
    <div v-else-if="!filteredProducts.length" class="text-center py-4">
      <p class="text-sm text-gray-600">No se encontraron productos.</p>
    </div>
    <div v-else class="space-y-4">
  <div
    v-for="product in filteredProducts"
    :key="product.id"
    class="flex items-center gap-4 rounded-lg bg-white dark:bg-black/20 p-3 shadow-sm transition-all hover:bg-primary/10 dark:hover:bg-primary/20 cursor-pointer"
    @click="toggleDetails(product.id)"
  >
    <!-- Image with Status Indicator -->
    <div class="relative h-16 w-16 shrink-0">
  <img
    loading="lazy"
    :src="product.image_url || '/placeholder.png'"
    :alt="product.name"
    class="h-full w-full rounded-lg object-cover"
    @error="product.image_url = placeHolderImg"
  />
<div
  class="absolute -right-2 -top-2 h-7 w-7 text-center rounded-full border-2 border-white dark:border-background-dark"
  :style="{ backgroundColor: product.stock === 0 ? '#ef4444' : product.stock < 10 ? '#f59e0b' : '#10b981' }"
  :title="getStockStatusText(product.stock)"
>{{ product.stock }}</div>
</div>

    <!-- Product Details -->
    <div class="flex-1">
      <p class="font-semibold text-text-primary-light dark:text-text-primary-dark">{{ product.name }}</p>
      <p class="text-sm text-text-secondary-light dark:text-text-secondary-dark">${{ product.precio_venta }}</p>
    </div>

    <!-- Chevron Icon -->
    <span class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">chevron_right</span>

    <!-- Details Section (Collapsible) -->
    <div
      v-show="isDetailsOpen(product.id)"
      class="p-3 bg-gray-50 dark:bg-gray-900 transition-all duration-300 ease-in-out w-full"
      :id="'details-' + product.id"
    >
      <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark capitalize">{{ product.category }}</p>
      <p
        class="text-xs"
        :class="product.publicado ? 'text-success' : 'text-text-secondary-light dark:text-text-secondary-dark'"
      >
        {{ product.publicado ? 'Publicado' : 'No publicado' }}
      </p>
      <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
        Stock: {{ product.stock ? product.stock : 'N/A' }}
      </p>
      <p class="text-xs text-text-secondary-light dark:text-text-secondary-dark">
        Maceta: {{ product.pot_size ? capitalize(product.pot_size) : 'N/A' }}
      </p>
      <div class="flex flex-col gap-1 mt-2">
        <div class="text-sm font-bold text-primary">${{ product.precio_compra }}</div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <button
        @click.stop="openEditModal(product)"
        class="btn btn-outline text-xs px-2 py-1 min-w-[44px] min-h-[44px]"
        aria-label="Editar producto"
      >
        <span class="material-symbols-outlined">edit</span>
      </button>
      <button
        @click.stop="deleteProduct(product.id)"
        class="btn btn-outline text-error hover:bg-error/10 text-xs px-2 py-1 min-w-[44px] min-h-[44px]"
        aria-label="Eliminar producto"
      >
        <span class="material-symbols-outlined">delete</span>
      </button>
    </div>
  </div>
</div>

    <!-- Modal de Creación -->
    <Modal :open="isCreateModalOpen" @close="closeCreateModal" class="sm:max-w-full sm:h-full">
      <h2 class="text-lg font-bold mb-3">Nuevo Producto</h2>
      <form @submit.prevent="createProduct">
        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="newProduct.name" type="text" class="input w-full text-sm py-1 px-2" required />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
            <select v-model="newProduct.category" class="input w-full text-sm py-1 px-2" required>
              <option value="" disabled>Seleccione una categoría</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ capitalize(cat) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
            <input v-model="newProduct.description" type="text" class="input w-full text-sm py-1 px-2" required />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Precio Compra($)</label>
            <input v-model.number="newProduct.precio_compra" type="number" step="0.01" class="input w-full text-sm py-1 px-2" required min="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Precio Venta($)</label>
            <input v-model.number="newProduct.precio_venta" type="number" step="0.01" class="input w-full text-sm py-1 px-2" required min="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Stock</label>
            <input v-model.number="newProduct.stock" type="number" class="input w-full text-sm py-1 px-2" required min="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tamaño de Maceta</label>
            <select v-model="newProduct.pot_size" class="input w-full text-sm py-1 px-2">
              <option value="">Sin especificar</option>
              <option v-for="size in potSizes" :key="size" :value="size">{{ capitalize(size) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Imagen (URL)</label>
            <input v-model="newProduct.image_url" type="url" class="input w-full text-sm py-1 px-2" placeholder="https://example.com/image.jpg" />
          </div>
        </div>
        <div class="mt-4 flex flex-col gap-2">
          <button type="submit" class="btn btn-primary text-xs px-2 py-1" :disabled="loading">Guardar Producto</button>
          <button type="button" @click="closeCreateModal" class="btn btn-outline text-xs px-2 py-1" :disabled="loading">Cancelar</button>
        </div>
      </form>
    </Modal>

    <!-- Modal de Edición -->
     <!-- Modal de Edición -->
    <Modal :open="isEditModalOpen" @close="closeEditModal" class="sm:max-w-full sm:h-full">
      <h2 class="text-lg font-bold mb-3">Editar Producto</h2>
      <form @submit.prevent="updateProduct">
        <div class="grid grid-cols-1 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="editingProduct.name" type="text" class="input w-full text-sm py-1 px-2" required />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Categoría</label>
            <select v-model="editingProduct.category" class="input w-full text-sm py-1 px-2" required>
              <option value="" disabled>Seleccione una categoría</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ capitalize(cat) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Descripción</label>
            <input v-model="editingProduct.description" type="text" class="input w-full text-sm py-1 px-2" required />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Precio Compra($)</label>
            <input v-model.number="editingProduct.precio_compra" type="number" step="0.01" class="input w-full text-sm py-1 px-2" required min="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Precio Venta($)</label>
            <input v-model.number="editingProduct.precio_venta" type="number" step="0.01" class="input w-full text-sm py-1 px-2" required min="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Stock</label>
            <input v-model.number="editingProduct.stock" type="number" class="input w-full text-sm py-1 px-2Has context menu
            " required min="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tamaño de Maceta</label>
            <select v-model="editingProduct.pot_size" class="input w-full text-sm py-1 px-2">
              <option value="">Sin especificar</option>
              <option v-for="size in potSizes" :key="size" :value="size">{{ capitalize(size) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Imagen (URL)</label>
            <input v-model="editingProduct.image_url" type="url" class="input w-full text-sm py-1 px-2" placeholder="https://example.com/image.jpg" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Publicado</label>
            <label class="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                v-model="editingProduct.publicado"
                class="sr-only peer"
                aria-label="Toggle producto publicado"
              />
              <div
                class="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:bg-success"
              ></div>
              <span
                class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 ease-in-out peer-checked:translate-x-5"
              ></span>
            </label>
          </div>
        </div>
        <div class="mt-4 flex flex-col gap-2">
          <button type="submit" class="btn btn-primary text-xs px-2 py-1" :disabled="loading">Guardar Cambios</button>
          <button type="button" @click="closeEditModal" class="btn btn-outline text-xs px-2 py-1" :disabled="loading">Cancelar</button>
        </div>
      </form>
      <div v-if="error && !notification.isOpen" class="mt-3 text-error text-xs text-center">{{ error }}</div>
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
import placeHolderImg from '@/assets/images/placeholder.png';

definePageMeta({
  layout: 'admin',
  // middleware: ['auth'],
});

// Use the Product type from the shared types file for consistency
import type { Product } from '~/types/product';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const authStore = useAuthStore();
const api = useApiService();

const categories = ['planta', 'arbusto', 'plantin', 'otro', 'semilla', 'herramienta'] as const;
const potSizes = ['pequeña', 'mediana', 'grande', '3 Lts', '4 Lts', '7 Lts', '10 Lts'] as const;

const filters = reactive({
  search: '',
  category: '' as string | '',
  stock: '' as string | '',
  sort: 'name' as 'name' | 'precio_venta' | 'stock',
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
  category: null as Product['category'] | null,
  description: '',
  precio_venta: 0,
  precio_compra: 0,
  publicado: false,
  sku: null as string | null,
  stock: 0,
  pot_size: '' as string | 'Sin especificar',
  image_url: '/placeholder.png',
});

const isEditModalOpen = ref(false);
const editingProduct = reactive({
  id: null as number | null,
  name: '',
  category: null as Product['category'] | null,
  description: '',
  precio_venta: 0,
  precio_compra: 0,
  publicado: false,
  sku: null as string | null,
  stock: 0,
  pot_size: '' as string | 'Sin especificar',
  image_url: '/placeholder.png',
});

// Dropdown state management
const openDetails = ref<number[]>([]);

const toggleDetails = (productId: number) => {
  if (openDetails.value.includes(productId)) {
    openDetails.value = openDetails.value.filter((id) => id !== productId);
  } else {
    openDetails.value.push(productId);
  }
};

const isDetailsOpen = (productId: number) => {
  return openDetails.value.includes(productId);
};

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
      if (filters.sort === 'precio_venta') return Number(a.precio_venta) - Number(b.precio_venta);
      if (filters.sort === 'stock') return a.stock - b.stock;
      return 0;
    });
});

const loadProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.getProducts();
    if (response && response.success && Array.isArray(response.data)) {
      allProducts.value = response.data.map((p: any) => ({
        ...p,
        description: p.description === null ? undefined : p.description,
      }));
    } else {
      allProducts.value = [];
      error.value = response.error || 'No se pudieron cargar los productos.';
      showNotification(error.value ?? '', 'error');
    }
  } catch (err: any) {
    error.value = err.message || 'No se pudieron cargar los productos.';
    console.error('Error loading products:', err);
    allProducts.value = [];
    showNotification(error.value ?? '', 'error');
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  filters.search = filters.search.trim();
};

const formatPrice = (precio_venta: string) => {
  return parseFloat(precio_venta).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const openCreateModal = () => {
  isCreateModalOpen.value = true;
};

const closeCreateModal = () => {
  isCreateModalOpen.value = false;
  Object.assign(newProduct, { name: '', category: null, description: '', precio_venta: 0, precio_compra: 0, stock: 0, pot_size: '', image_url: '' });
};

const openEditModal = (product: Product) => {
  Object.assign(editingProduct, {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description || '',
    precio_venta: product.precio_venta,
    precio_compra: product.precio_compra || '0',
    publicado: product.publicado || false,
    sku: product.sku || null,
    stock: product.stock,
    pot_size: product.pot_size || '',
    image_url: product.image_url || '',
  });
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  Object.assign(editingProduct, { id: null, name: '', category: null, description: '', precio_venta: 0, precio_compra: 0, stock: 0, pot_size: '', image_url: '' });
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
  if (
    !product.category ||
    !categories.includes(product.category as typeof categories[number])
  ) {
    error.value = 'Seleccione una categoría válida.';
    showNotification(error.value ?? '', 'error');
    return false;
  }
  if (isNaN(product.precio_venta) || product.precio_venta <= 0) {
    error.value = 'El precio debe ser un número válido mayor a 0.';
    showNotification(error.value ?? '', 'error');
    return false;
  }
  if (isNaN(product.stock) || product.stock <= 0) {
    error.value = 'El stock debe ser un número válido mayor a 0.';
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
  console.log('Validating URL:', url);
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
      category: newProduct.category ?? undefined,
      description: newProduct.description || null,
      precio_venta: Number(newProduct.precio_venta),
      precio_compra: Number(newProduct.precio_compra || '0'),
      publicado: newProduct.publicado || false,
      sku: newProduct.sku || null,
      stock: Number(newProduct.stock),
      pot_size: newProduct.pot_size || 'Sin especificar',
      image_url: newProduct.image_url || '/placeholder.png',
    };
    const response = await api.createProduct(productData);
    allProducts.value.push(response.data);
    closeCreateModal();
    showNotification('Producto creado exitosamente!');
    loadProducts();
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
      precio_compra: Number(editingProduct.precio_compra || '0'),
      precio_venta: Number(editingProduct.precio_venta),
      publicado: editingProduct.publicado || false,
      sku: editingProduct.sku || null,
      stock: Number(editingProduct.stock),
      pot_size: editingProduct.pot_size || 'Sin especificar',
      image_url: editingProduct.image_url || '/placeholder.png',
    };
    const response = await api.updateProduct(editingProduct.id!, productData);
    const updatedProduct = response.data;
    const index = allProducts.value.findIndex((p) => p.id === editingProduct.id);
    if (index !== -1) {
      allProducts.value[index] = updatedProduct;
    } else {
      allProducts.value.push(updatedProduct);
    }
    closeEditModal();
    showNotification('Producto actualizado exitosamente!');
    loadProducts();
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
    openDetails.value = openDetails.value.filter((id) => id !== productId);
    showNotification('Producto eliminado exitosamente!');
    loadProducts();
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
/* Estilos existentes */
.input {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

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

/* Estilos móviles */
@media (max-width: 640px) {
  .input {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
  .btn:not(.rounded-full) {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
  }
  .grid-cols-2 {
    gap: 1rem;
  }
  .aspect-w-4.aspect-h-3 img {
    height: 8rem;
  }
  .p-3 {
    padding: 0.5rem;
  }
  h1.text-xl {
    font-size: 1rem;
  }
  .text-sm {
    font-size: 0.75rem;
  }
  .transition-all {
    transition: max-height 0.3s ease-in-out, opacity 0.3s ease-in-out;
  }
  [v-show="false"] {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }
  [v-show="true"] {
    max-height: 200px;
    opacity: 1;
  }
}
</style>