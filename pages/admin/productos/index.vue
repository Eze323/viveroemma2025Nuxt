<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <div class="bg-white border-b border-gray-200 px-4 py-4 mb-4">
      <!-- Header & Stats -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-xl font-bold text-gray-900">Productos</h1>
          <p class="text-sm text-gray-600">Gestiona tu inventario</p>
        </div>
        
        <button 
          @click="openCreateModal" 
          class="btn btn-primary flex items-center justify-center w-10 h-10 rounded-full shadow-lg"
          title="Crear nuevo producto"
        >
          <Icon name="heroicons:plus" class="w-6 h-6" />
          <span class="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
            Crear nuevo producto
          </span>
        </button>
      </div>

      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <!-- Total Products -->
        <div class="product-stat-card total">
          <div class="product-stat-icon">
            <Icon name="heroicons:cube" class="w-6 h-6" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Total Productos</p>
            <p class="stat-value">{{ totalProducts }}</p>
          </div>
        </div>

        <!-- Inventory Value -->
        <div class="product-stat-card value">
          <div class="product-stat-icon">
            <Icon name="heroicons:currency-dollar" class="w-6 h-6" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Valor Inventario</p>
            <p class="stat-value">{{ formatCurrency(totalInventoryValue) }}</p>
          </div>
        </div>

        <!-- Low Stock -->
        <div class="product-stat-card low-stock">
          <div class="product-stat-icon">
            <Icon name="heroicons:exclamation-triangle" class="w-6 h-6" />
          </div>
          <div class="stat-content">
            <p class="stat-label">Stock Bajo</p>
            <p class="stat-value">{{ lowStockCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-4">
      <!-- Filters -->
      <div class="filters-card">
        <div class="filter-grid">
          <div class="filter-group">
            <label class="filter-label">Buscar</label>
            <div class="relative">
              <input
                v-model="filters.search"
                type="text"
                placeholder="Nombre, SKU..."
                class="filter-input w-full pl-9"
                @input="applyFilters"
              />
              <Icon name="heroicons:magnifying-glass" class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Categoría</label>
            <select v-model="filters.category" class="filter-select w-full" @change="applyFilters">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ capitalize(cat) }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label class="filter-label">Estado Stock</label>
            <select v-model="filters.stock" class="filter-select w-full" @change="applyFilters">
              <option value="">Todos</option>
              <option value="in">En stock</option>
              <option value="low">Stock bajo (< 10)</option>
              <option value="out">Sin stock</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <Icon name="heroicons:arrow-path" class="w-8 h-8 text-primary animate-spin mb-2" />
        <p class="text-sm text-gray-500">Cargando inventario...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="!filteredProducts.length" class="empty-state">
        <div class="empty-icon">
          <Icon name="heroicons:cube-transparent" class="w-16 h-16" />
        </div>
        <h3 class="empty-title">No se encontraron productos</h3>
        <p class="empty-description">Intenta ajustar los filtros o crea un nuevo producto</p>
        <button @click="openCreateModal" class="empty-action">
          <Icon name="heroicons:plus" class="w-5 h-5" />
          Crear producto
        </button>
      </div>

      <!-- Products List -->
      <div v-else class="space-y-3">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="product-card"
          @click="toggleDetails(product.id)"
        >
          <div class="product-header">
            <!-- Image & Badge -->
            <div class="product-image-container">
              <img
                loading="lazy"
                :src="product.image_url || '/placeholder.png'"
                :alt="product.name"
                class="product-image cursor-zoom-in"
                @error="product.image_url = '/placeholder.png'"
                @click.stop="openImageViewer(product.image_url || '/placeholder.png', product.name)"
              />
              <div 
                class="stock-badge"
                :class="{
                  'in-stock': product.stock >= product.stock_minimo,
                  'low-stock': product.stock > 0 && product.stock < product.stock_minimo,
                  'out-of-stock': product.stock === 0
                }"
              >
                {{ product.stock }}
              </div>
            </div>

            <!-- Info -->
            <div class="product-info">
              <span class="product-category">{{ product.category }}</span>
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-price">{{ formatCurrency(product.precio_venta) }}</p>
            </div>

            <!-- Chevron -->
            <Icon 
              name="heroicons:chevron-down" 
              class="w-5 h-5 text-gray-400 transition-transform duration-200"
              :class="{ 'rotate-180': isDetailsOpen(product.id) }"
            />
          </div>

          <!-- Expandable Details -->
          <div v-show="isDetailsOpen(product.id)" class="product-details">
            <div class="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
              <div class="detail-row">
                <span class="detail-label">SKU</span>
                <span class="detail-value">{{ product.sku || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Tamaño</span>
                <span class="detail-value">{{ product.pot_size || '-' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Costo</span>
                <span class="detail-value text-gray-500">{{ formatCurrency(Number(product.precio_compra || 0)) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Precio Mayorista</span>
                <span class="detail-value text-gray-500">{{ formatCurrency(Number(product.precio_cantidad || 0)) }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Margen</span>
                <span class="detail-value text-green-600">
                  {{ Math.round(((product.precio_venta - Number(product.precio_compra || 0)) / product.precio_venta) * 100) }}%
                </span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Stock Minimo</span>
                <span class="detail-value text-gray-500">{{ product.stock_minimo }}</span>
              </div>
            </div>

            <div class="product-actions">
              <button 
                @click.stop="openEditModal(product)"
                class="product-action-btn edit"
                title="Editar"
              >
                <Icon name="heroicons:pencil-square" class="w-5 h-5" />
              </button>
              <button 
                @click.stop="deleteProduct(product.id)"
                class="product-action-btn delete"
                title="Eliminar"
              >
                <Icon name="heroicons:trash" class="w-5 h-5" />
              </button>
            </div>
          </div>
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
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
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
            <label class="block text-xs font-medium text-gray-700 mb-1">Precio Mayorista($)</label>
            <input v-model.number="newProduct.precio_cantidad" type="number" step="0.01" class="input w-full text-sm py-1 px-2" required min="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Stock</label>
            <input v-model.number="newProduct.stock" type="number" class="input w-full text-sm py-1 px-2" required min="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Stock Minimo</label>
            <input v-model.number="newProduct.stock_minimo" type="number" class="input w-full text-sm py-1 px-2" required min="0" />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Tamaño de Maceta</label>
            <select v-model="newProduct.pot_size" class="input w-full text-sm py-1 px-2">
              <option value="">Sin especificar</option>
              <option v-for="size in potSizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Imagen (URL o Subir Archivo)</label>
            <div class="flex gap-2">
              <input v-model="newProduct.image_url" type="url" class="input w-full text-sm py-1 px-2" placeholder="https://example.com/image.jpg" />
              <input type="file" ref="fileInput" @change="(e) => handleFileUpload(e, 'create')" class="hidden" accept="image/*" />
              <button type="button" @click="$refs.fileInput.click()" class="btn btn-outline text-xs px-2 whitespace-nowrap">
                <Icon name="heroicons:arrow-up-tray" class="w-4 h-4 mr-1" /> Subir
              </button>
            </div>
            <div v-if="uploading" class="text-xs text-blue-500 mt-1">Subiendo imagen...</div>
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
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
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
              <option v-for="size in potSizes" :key="size" :value="size">{{size }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Imagen (URL o Subir Archivo)</label>
            <div class="flex gap-2">
              <input v-model="editingProduct.image_url" type="url" class="input w-full text-sm py-1 px-2" placeholder="https://example.com/image.jpg" />
              <input type="file" ref="editFileInput" @change="(e) => handleFileUpload(e, 'edit')" class="hidden" accept="image/*" />
              <button type="button" @click="$refs.editFileInput.click()" class="btn btn-outline text-xs px-2 whitespace-nowrap">
                <Icon name="heroicons:arrow-up-tray" class="w-4 h-4 mr-1" /> Subir
              </button>
            </div>
            <div v-if="uploading" class="text-xs text-blue-500 mt-1">Subiendo imagen...</div>
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

    <ImageViewerModal
      :is-open="isImageViewerOpen"
      :image-url="selectedImage || ''"
      :alt-text="selectedImageAlt || ''"
      @close="closeImageViewer"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useApiService } from '~/services/api/api';
import { useAuthStore } from '~/stores/auth';
import { useProductStore } from '~/stores/products';
import Modal from '~/components/Modal.vue';
import NotificationModal from '~/components/NotificationModal.vue';
import ImageViewerModal from '~/components/ImageViewerModal.vue';


definePageMeta({
  layout: 'admin',
  // middleware: ['auth'],
});

// Use the Product type from the shared types file for consistency
import type { Product } from '~/types/product';

const authStore = useAuthStore();
const productStore = useProductStore();
const api = useApiService();

const categories = ['planta', 'arbusto', 'plantin', 'otro', 'semilla', 'herramienta'] as const;
const potSizes = ['pequeña', 'mediana', 'grande', '3 Lts', '4 Lts', '7 Lts', '10 Lts'] as const;

const filters = reactive({
  search: '',
  category: '' as string | '',
  stock: '' as string | '',
  sort: 'name' as 'name' | 'precio_venta' | 'stock',
});

// Use store state instead of local state
const loading = computed(() => productStore.isLoading);
const error = computed(() => productStore.error);

const notification = reactive({
  isOpen: false,
  message: '',
  type: 'success' as 'success' | 'error',
});

const isCreateModalOpen = ref(false);
const newProduct = reactive({
  name: '',
  category: '' as string,
  description: '',
  precio_venta: 0,
  precio_compra: 0,
  precio_cantidad: 0,
  publicado: false,
  sku: null as string | null,
  stock: 0,
  stock_minimo: 0,
  pot_size: '',
  image_url: '/placeholder.png',
});

const isEditModalOpen = ref(false);
const editingProduct = reactive({
  id: null as number | null,
  name: '',
  category: '' as string,
  description: '',
  precio_venta: 0,
  precio_compra: 0,
  precio_cantidad: 0,
  publicado: false,
  sku: null as string | null,
  stock: 0,
  stock_minimo: 0,
  pot_size: '',
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
  const products = productStore.getProducts;
  
  if (!Array.isArray(products)) {
    console.warn('products no es un array:', products);
    return [];
  }

  return products
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
  try {
    await productStore.fetchProducts();
  } catch (err: any) {
    console.error('Error loading products:', err);
    showNotification(err.message || 'No se pudieron cargar los productos.', 'error');
  }
};

const applyFilters = () => {
  filters.search = filters.search.trim();
};

// Estadísticas computadas
const totalProducts = computed(() => filteredProducts.value.length);

const totalInventoryValue = computed(() => {
  return filteredProducts.value.reduce((sum, p) => sum + (p.precio_venta * p.stock), 0);
});

const lowStockCount = computed(() => {
  return filteredProducts.value.filter(p => p.stock < 10).length;
});

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount);
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
  Object.assign(newProduct, { name: '', category: '', description: '', precio_venta: 0, precio_compra: 0, precio_cantidad: 0, stock: 0, stock_minimo: 0, pot_size: '', image_url: '/placeholder.png' });
};

const openEditModal = (product: Product) => {
  Object.assign(editingProduct, {
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description || '',
    precio_venta: product.precio_venta,
    precio_compra: product.precio_compra || 0,
    precio_cantidad: product.precio_cantidad || 0,
    publicado: product.publicado || false,
    sku: product.sku || null,
    stock: product.stock,
    stock_minimo: product.stock_minimo || 0,
    pot_size: product.pot_size || '',
    image_url: product.image_url || '/placeholder.png',
  });
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  Object.assign(editingProduct, { id: null, name: '', category: '', description: '', precio_venta: 0, precio_compra: 0, precio_cantidad: 0, stock: 0, stock_minimo: 0, pot_size: '', image_url: '/placeholder.png' });
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
  // console.log('Validating URL:', url);
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
  
  try {
    const productData: Partial<Product> = {
      name: newProduct.name,
      category: newProduct.category,
      description: newProduct.description || null,
      precio_venta: Number(newProduct.precio_venta),
      precio_compra: Number(newProduct.precio_compra || 0),
      precio_cantidad: Number(newProduct.precio_cantidad || 0),
      publicado: newProduct.publicado || false,
      sku: newProduct.sku || null,
      stock: Number(newProduct.stock),
      stock_minimo: Number(newProduct.stock_minimo || 0),
      pot_size: newProduct.pot_size || null,
      image_url: newProduct.image_url || '/placeholder.png',
    };
    await api.createProduct(productData);
    closeCreateModal();
    showNotification('Producto creado exitosamente!');
    // Reload products from store to get the updated list
    productStore.forceReload();
  } catch (err: any) {
    console.error('Error creating product:', err);
    showNotification(err.message || 'Error al crear el producto.', 'error');
  }
};

const updateProduct = async () => {
  if (!validateProduct(editingProduct)) return;
  
  try {
    const productData: Partial<Product> = {
      name: editingProduct.name,
      category: editingProduct.category,
      description: editingProduct.description || null,
      precio_compra: Number(editingProduct.precio_compra || 0),
      precio_venta: Number(editingProduct.precio_venta),
      precio_cantidad: Number(editingProduct.precio_cantidad || 0),
      publicado: editingProduct.publicado || false,
      sku: editingProduct.sku || null,
      stock: Number(editingProduct.stock),
      stock_minimo: Number(editingProduct.stock_minimo || 0),
      pot_size: editingProduct.pot_size || null,
      image_url: editingProduct.image_url || '/placeholder.png',
    };
    await api.updateProduct(editingProduct.id!, productData);
    closeEditModal();
    showNotification('Producto actualizado exitosamente!');
    // Reload products from store to get the updated list
    productStore.forceReload();
  } catch (err: any) {
    console.error('Error updating product:', err);
    showNotification(err.message || 'Error al actualizar el producto.', 'error');
  }
};

const deleteProduct = async (productId: number) => {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
  
  try {
    await api.deleteProduct(productId);
    openDetails.value = openDetails.value.filter((id) => id !== productId);
    showNotification('Producto eliminado exitosamente!');
    // Reload products from store to get the updated list
    productStore.forceReload();
  } catch (err: any) {
    console.error('Error deleting product:', err);
    showNotification(err.message || 'Error al eliminar el producto.', 'error');
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

// Image Viewer State
const isImageViewerOpen = ref(false);
const selectedImage = ref<string | null>(null);
const selectedImageAlt = ref<string | null>(null);

const openImageViewer = (imageUrl: string, altText: string) => {
  selectedImage.value = imageUrl;
  selectedImageAlt.value = altText;
  isImageViewerOpen.value = true;
};

const closeImageViewer = () => {
  isImageViewerOpen.value = false;
  selectedImage.value = null;
  selectedImageAlt.value = null;
};

// Image Upload Logic
const uploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const editFileInput = ref<HTMLInputElement | null>(null);

const handleFileUpload = async (event: Event, mode: 'create' | 'edit') => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  // Basic validation (optional)
  if (!file.type.startsWith('image/')) {
    showNotification('Por favor seleccione un archivo de imagen válido.', 'error');
    return;
  }

  uploading.value = true;
  const formData = new FormData();
  formData.append('image', file);

  try {
    const { data, error: uploadError } = await useFetch('/api/upload/imgbb', {
      method: 'POST',
      body: formData,
    });

    if (uploadError.value) {
      throw new Error(uploadError.value.statusMessage || 'Error al subir la imagen');
    }

    const imageUrl = data.value?.url;
    
    if (imageUrl) {
      if (mode === 'create') {
        newProduct.image_url = imageUrl;
      } else {
        editingProduct.image_url = imageUrl;
      }
      showNotification('Imagen subida exitosamente!');
    }
  } catch (err: any) {
    console.error('Error uploading image:', err);
    showNotification('Error al subir la imagen a ImgBB. Verifique su API Key.', 'error');
  } finally {
    uploading.value = false;
    // Reset inputs
    if (fileInput.value) fileInput.value.value = '';
    if (editFileInput.value) editFileInput.value.value = '';
  }
};

onMounted(loadProducts);


</script>


<style scoped>
@import '@/assets/css/products.css';

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

body {
  min-height: max(884px, 100dvh);
}
</style>