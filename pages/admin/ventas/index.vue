<template>
  <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
    <!-- Encabezado -->
    <div class="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ventas</h1>
        <p class="text-sm text-gray-600">Gestiona las ventas del vivero</p>
      </div>
      <button class="btn btn-primary w-full sm:w-auto text-base py-2" @click="openFormModalForNew">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Nueva Venta
      </button>
    </div>

    <!-- Dashboard Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-primary-100 text-primary">
            <Icon name="heroicons:shopping-cart" class="w-5 h-5" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Ventas del día</p>
            <h3 class="text-lg font-bold text-gray-900">${{ dashboardData.daily_sales?.toLocaleString() || '0' }}</h3>
            <p class="text-xs text-success flex items-center mt-1" v-if="dashboardData.daily_sales_change">
              <Icon name="heroicons:arrow-up" class="w-3 h-3 mr-1" />
              {{ dashboardData.daily_sales_change }}% más que ayer
            </p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-secondary-100 text-secondary">
            <Icon name="heroicons:users" class="w-5 h-5" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Clientes nuevos</p>
            <h3 class="text-lg font-bold text-gray-900">{{ dashboardData.new_customers || 0 }}</h3>
            <p class="text-xs text-success flex items-center mt-1" v-if="dashboardData.new_customers_change">
              <Icon name="heroicons:arrow-up" class="w-3 h-3 mr-1" />
              {{ dashboardData.new_customers_change }}% más que ayer
            </p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-accent-100 text-accent">
            <Icon name="heroicons:shopping-bag" class="w-5 h-5" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Productos vendidos</p>
            <h3 class="text-lg font-bold text-gray-900">{{ dashboardData.products_sold || 0 }}</h3>
            <p class="text-xs text-error flex items-center mt-1" v-if="dashboardData.products_sold_change">
              <Icon name="heroicons:arrow-down" class="w-3 h-3 mr-1" />
              {{ dashboardData.products_sold_change }}% menos que ayer
            </p>
          </div>
        </div>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <div class="flex items-center">
          <div class="p-2 rounded-full bg-success-100 text-success">
            <Icon name="heroicons:banknotes" class="w-5 h-5" />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-500">Ticket promedio</p>
            <h3 class="text-lg font-bold text-gray-900">${{ dashboardData.average_ticket?.toLocaleString() || '0' }}</h3>
            <p class="text-xs text-success flex items-center mt-1" v-if="dashboardData.average_ticket_change">
              <Icon name="heroicons:arrow-up" class="w-3 h-3 mr-1" />
              {{ dashboardData.average_ticket_change }}% más que ayer
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            type="text"
            v-model="filters.search"
            placeholder="Cliente, ID..."
            class="input w-full text-sm"
            @input="applyFilters"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select v-model="filters.status" class="input w-full text-sm" @change="applyFilters">
            <option value="">Todos</option>
            <option value="Completada">Completada</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <input
            type="date"
            v-model="filters.date"
            class="input w-full text-sm"
            @change="applyFilters"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
          <select v-model="filters.seller" class="input w-full text-sm" @change="applyFilters">
            <option value="">Todos</option>
            <option v-for="seller in sellers" :key="seller.id" :value="seller.name">
              {{ seller.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Lista de Ventas (Móviles: Tarjetas, Desktop: Tabla) -->
    <div v-if="!loading && filteredSales.length" class="space-y-4 lg:space-y-0">
      <!-- Móviles: Tarjetas -->
      <div class="lg:hidden space-y-4">
        <div v-for="sale in filteredSales" :key="sale.id"
          class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
          <div class="flex flex-col gap-2">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-sm font-medium text-gray-900">Venta #{{ sale.id }}</h3>
                <p class="text-xs text-gray-500">{{ sale.customer_name_field ?? 'N/A' }}</p>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(sale.status)">
                {{ sale.status }}
              </span>
            </div>
            <p class="text-xs text-gray-500">Vendedor: {{ sale.seller }}</p>
            <p class="text-xs text-gray-500">Items: {{ sale.items ? sale.items.length : 0 }}</p>
            <p class="text-sm font-medium text-gray-900">${{ sale.total_price ? sale.total_price.toLocaleString() : '0' }}</p>
            <p class="text-xs text-gray-500">{{ sale.date }} {{ sale.time }}</p>
            <div class="flex gap-2 mt-2">
              <button @click="openViewModal(sale)" class="btn btn-outline flex-1 py-2 text-xs">
                <Icon name="heroicons:eye" class="w-4 h-4 mr-1" />
                Ver
              </button>
              <button @click="openFormModalForEdit(sale)" class="btn btn-outline flex-1 py-2 text-xs">
                <Icon name="heroicons:pencil" class="w-4 h-4 mr-1" />
                Editar
              </button>
              <button @click="deleteSale(sale.id)" class="btn btn-outline text-error hover:bg-error/10 flex-1 py-2 text-xs">
                <Icon name="heroicons:trash" class="w-4 h-4 mr-1" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop: Tabla -->
      <div class="hidden lg:block bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Venta</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="sale in filteredSales" :key="sale.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">#{{ sale.id }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ sale.customer_name_field ?? 'N/A' }}</div>
                  <div class="text-xs text-gray-500">{{ sale.email ?? '' }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ sale.seller }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ sale.items ? sale.items.length : 0 }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">${{ sale.total_price ? sale.total_price.toLocaleString() : '0' }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(sale.status)">
                    {{ sale.status }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ sale.date }}</div>
                  <div class="text-xs text-gray-500">{{ sale.time }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="openViewModal(sale)" class="text-primary hover:text-primary-dark mr-2" title="Ver detalles">
                    <Icon name="heroicons:eye" class="w-4 h-4" />
                  </button>
                  <button @click="openFormModalForEdit(sale)" class="text-accent hover:text-accent-dark mr-2" title="Editar">
                    <Icon name="heroicons:pencil" class="w-4 h-4" />
                  </button>
                  <button @click="deleteSale(sale.id)" class="text-error hover:text-error-dark" title="Eliminar">
                    <Icon name="heroicons:trash" class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-8">
      <p class="text-gray-600 text-sm">Cargando ventas...</p>
    </div>

    <div v-else class="text-center py-8">
      <p class="text-gray-600 text-sm">No se encontraron ventas.</p>
    </div>

    <!-- Paginación -->
    <div v-if="filteredSales.length" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="btn btn-outline text-sm py-2" :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
          <button class="btn btn-outline text-sm py-2" :disabled="currentPage * itemsPerPage >= filteredSales.length" @click="currentPage++">Siguiente</button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <p class="text-sm text-gray-700">
            Mostrando <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> a
            <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, filteredSales.length) }}</span> de
            <span class="font-medium">{{ filteredSales.length }}</span> ventas
          </p>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button class="btn btn-outline rounded-l-md text-sm py-2" :disabled="currentPage === 1" @click="currentPage--">Anterior</button>
            <button v-for="page in visiblePages" :key="page" class="btn text-sm py-2" :class="page === currentPage ? 'btn-primary' : 'btn-outline'" @click="currentPage = page">{{ page }}</button>
            <button class="btn btn-outline rounded-r-md text-sm py-2" :disabled="currentPage * itemsPerPage >= filteredSales.length" @click="currentPage++">Siguiente</button>
          </nav>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <Modal :open="isViewModalOpen" @close="closeViewModal">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Detalles de la Venta #{{ selectedSaleForView?.id }}</h3>
      <div v-if="selectedSaleForView" class="mb-6 text-sm text-gray-700 space-y-2">
        <p><strong>Cliente:</strong> {{ selectedSaleForView.customer_name_field ?? 'N/A' }}</p>
        <p><strong>Email:</strong> {{ selectedSaleForView.email ?? '' }}</p>
        <p><strong>Vendedor:</strong> {{ selectedSaleForView.seller }}</p>
        <p><strong>Fecha:</strong> {{ selectedSaleForView.date }} {{ selectedSaleForView.time }}</p>
        <p><strong>Estado:</strong>
          <span class="px-2 py-1 text-xs font-medium rounded-full" :class="getStatusClass(selectedSaleForView.status)">
            {{ selectedSaleForView.status }}
          </span>
        </p>
      </div>
      <div v-if="selectedSaleForView && selectedSaleForView.items && selectedSaleForView.items.length > 0" class="mb-6">
        <h4 class="text-lg font-semibold text-gray-800 mb-3">Items de la Venta</h4>
        <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cant.</th>
              <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio U.</th>
              <th class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in selectedSaleForView.items" :key="index">
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{{ item.product ? item.product.name : 'N/A' }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{{ item.quantity }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-500">${{ item.unit_price ? item.unit_price.toLocaleString() : '0' }}</td>
              <td class="px-3 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900">${{ item.subtotal ? item.subtotal.toLocaleString() : '0' }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-50">
              <td colspan="3" class="px-3 py-2 text-right text-sm font-bold text-gray-900">Total:</td>
              <td class="px-3 py-2 text-right text-sm font-bold text-gray-900">${{ calculateTotalViewModal(selectedSaleForView.items).toLocaleString() }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div v-else-if="selectedSaleForView" class="text-center text-gray-500 italic text-sm">
        No hay items para esta venta.
      </div>
      <div class="mt-6 flex justify-end">
        <button @click="closeViewModal" class="btn btn-outline text-sm py-2">Cerrar</button>
      </div>
    </Modal>

    <!-- Form Modal -->
    <Modal :open="isFormModalOpen" @close="closeFormModal">
      <h3 class="text-xl font-bold text-gray-900 mb-4">{{ isEditing ? 'Editar Venta' : 'Nueva Venta' }}</h3>
      <form @submit.prevent="handleSaveSale">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
            <input type="text" v-model="saleForm.customer" class="input w-full text-sm" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email Cliente</label>
            <input type="email" v-model="saleForm.email" class="input w-full text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
            <select v-model="saleForm.seller" class="input w-full text-sm" required>
              <option value="">Seleccione un vendedor</option>
              <option v-for="seller in sellers" :key="seller.id" :value="seller.name">
                {{ seller.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input type="date" v-model="saleForm.date" class="input w-full text-sm" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
            <input type="time" v-model="saleForm.time" class="input w-full text-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="saleForm.status" class="input w-full text-sm" required>
              <option value="Pendiente">Pendiente</option>
              <option value="Completada">Completada</option>
              <option value="Cancelada">Cancelada</option>
            </select>
          </div>
        </div>
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Items de la Venta</h4>
          <div class="space-y-4">
            <SaleItemForm
              v-for="(item, index) in saleForm.items"
              :key="index"
              :item="item"
              :available-products="availableProducts"
              @update:item="updateItem(index, $event)"
              @remove="removeItem(index)"
            />
          </div>
          <button type="button" @click="addItem" class="btn btn-outline mt-4 text-sm py-2">
            <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
            Agregar Item
          </button>
        </div>
        <div class="text-right text-lg font-bold text-gray-900 mb-6">
          Total: ${{ calculateTotalForm(saleForm.items).toLocaleString() }}
        </div>
        <div class="mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button type="button" @click="closeFormModal" class="btn btn-outline text-sm py-2 flex-1">Cancelar</button>
          <button type="submit" class="btn btn-primary text-sm py-2 flex-1" :disabled="loading">{{ isEditing ? 'Guardar Cambios' : 'Crear Venta' }}</button>
        </div>
      </form>
      <div v-if="error && !notification.isOpen" class="mt-4 text-error text-center text-sm">{{ error }}</div>
      <div v-if="loading" class="mt-4 text-center text-gray-600 text-sm">Guardando...</div>
    </Modal>

    <!-- Notification Modal -->
    <NotificationModal
      :is-open="notification.isOpen"
      :message="notification.message"
      :type="notification.type"
      @close="closeNotification"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useApiService } from '~/services/api';
import SaleItemForm from '~/components/admin/Ventas/SaleItemForm.vue';
import NotificationModal from '~/components/NotificationModal.vue';
import Modal from '~/components/Modal.vue';

definePageMeta({
  layout: 'admin',
});

const api = useApiService();

// Filters state
const filters = reactive({
  search: '',
  status: '',
  date: '',
  seller: '',
  sort: 'date_desc',
});

// Sales state
const allSales = ref([]);
const loading = ref(false);
const error = ref(null);

// Notification state
const notification = reactive({
  isOpen: false,
  message: '',
  type: 'success',
});

// Form Modal state
const isFormModalOpen = ref(false);
const saleForm = reactive({
  id: null,
  customer: '',
  email: '',
  seller: '',
  date: '',
  time: '',
  status: 'Pendiente',
  items: [],
});
const isEditing = ref(false);

// View Modal state
const isViewModalOpen = ref(false);
const selectedSaleForView = ref(null);

// Product state for the form modal
const availableProducts = ref([]);

// Dashboard data
const dashboardData = ref({
  daily_sales: 0,
  daily_sales_change: 0,
  new_customers: 0,
  new_customers_change: 0,
  products_sold: 0,
  products_sold_change: 0,
  average_ticket: 0,
  average_ticket_change: 0,
});

// Pagination state
const currentPage = ref(1);
const itemsPerPage = 10;

const visiblePages = computed(() => {
  const totalPages = Math.ceil(filteredSales.value.length / itemsPerPage);
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage.value - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  startPage = Math.max(1, endPage - maxPagesToShow + 1);
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
});

// Mock data for sellers (fetch from API later)
const sellers = ref([
  { id: 1, name: 'María López' },
  { id: 2, name: 'Juan Pérez' },
  { id: 3, name: 'Ana García' },
]);

// Computed property for filtering and sorting
const filteredSales = computed(() => {
  let filtered = Array.isArray(allSales.value) ? [...allSales.value] : [];

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter((sale) => {
      if (!sale) return false;
      const customerName = sale.customer_name_field?.toLowerCase() ?? '';
      const customerEmail = sale.email?.toLowerCase() ?? '';
      const sellerName = sale.seller?.toLowerCase() ?? '';
      const saleId = sale.id ? sale.id.toString().toLowerCase() : '';

      const mainMatch =
        saleId.includes(searchTerm) ||
        customerName.includes(searchTerm) ||
        customerEmail.includes(searchTerm) ||
        sellerName.includes(searchTerm);

      const itemMatch = sale.items?.some((item) =>
        item.product?.name?.toLowerCase().includes(searchTerm)
      );

      return mainMatch || itemMatch;
    });
  }

  if (filters.status) {
    filtered = filtered.filter((sale) => sale?.status === filters.status);
  }

  if (filters.date) {
    filtered = filtered.filter((sale) => sale?.date === filters.date);
  }

  if (filters.seller) {
    filtered = filtered.filter((sale) => sale?.seller === filters.seller);
  }

  if (filters.sort === 'date_desc') {
    filtered.sort((a, b) => {
      const dateA = a?.date ? new Date(a.date + (a.time ? 'T' + a.time : '')) : new Date(0);
      const dateB = b?.date ? new Date(b.date + (b.time ? 'T' + b.time : '')) : new Date(0);
      return dateB - dateA;
    });
  }

  return filtered.slice((currentPage.value - 1) * itemsPerPage, currentPage.value * itemsPerPage);
});

// API Interaction Functions
const fetchSales = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.getSales();
    allSales.value = Array.isArray(response) ? response : [];
    console.log('Sales loaded:', allSales.value);
  } catch (err) {
    error.value = err.message || 'Error al cargar las ventas.';
    console.error('Error fetching sales:', err);
    showNotification(error.value, 'error');
  } finally {
    loading.value = false;
  }
};

const fetchProducts = async () => {
  try {
    const response = await api.getProducts();
    availableProducts.value = Array.isArray(response) ? response : [];
    console.log('Available products:', availableProducts.value);
  } catch (err) {
    error.value = 'Error al cargar los productos.';
    console.error('Error fetching products:', err);
    showNotification(error.value, 'error');
  }
};

const fetchDashboardData = async () => {
  try {
    const response = await api.getDashboardData();
    Object.assign(dashboardData.value, response || {});
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
  }
};

const handleSaveSale = async () => {
  if (!saleForm.customer || !saleForm.seller || !saleForm.date || !saleForm.items || saleForm.items.length === 0) {
    showNotification('Por favor, complete los campos obligatorios (Cliente, Vendedor, Fecha) y agregue al menos un item.', 'error');
    return;
  }

  loading.value = true;
  error.value = null;

  const saleData = {
    customer: saleForm.customer,
    email: saleForm.email,
    seller: saleForm.seller,
    date: saleForm.date,
    time: saleForm.time || null,
    status: saleForm.status,
    items: saleForm.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    })),
  };

  try {
    let response;
    if (isEditing.value && saleForm.id) {
      response = await api.updateSale(saleForm.id, saleData);
      const index = allSales.value.findIndex((sale) => sale.id === saleForm.id);
      if (index !== -1) {
        allSales.value[index] = response;
      } else {
        allSales.value.push(response);
      }
      showNotification('Venta actualizada exitosamente!', 'success');
    } else {
      response = await api.createSale(saleData);
      allSales.value.push(response);
      showNotification('Venta creada exitosamente!', 'success');
    }
    closeFormModal();
  } catch (err) {
    error.value = err.message || `Error al ${isEditing.value ? 'actualizar' : 'crear'} la venta.`;
    console.error('Error saving sale:', err);
    showNotification(error.value, 'error');
  } finally {
    loading.value = false;
  }
};

const deleteSale = async (saleId) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta venta?')) return;
  loading.value = true;
  error.value = null;
  try {
    await api.deleteSale(saleId);
    allSales.value = allSales.value.filter((sale) => sale.id !== saleId);
    showNotification('Venta eliminada exitosamente!', 'success');
  } catch (err) {
    error.value = err.message || 'Error al eliminar la venta.';
    console.error('Error deleting sale:', err);
    showNotification(error.value, 'error');
  } finally {
    loading.value = false;
  }
};

// Notification Functions
const showNotification = (message, type = 'success') => {
  notification.message = message;
  notification.type = type;
  notification.isOpen = true;
};

const closeNotification = () => {
  notification.isOpen = false;
  notification.message = '';
  notification.type = 'success';
};

// Modal and Form Logic
const getStatusClass = (status) => {
  const statusMap = {
    Completada: 'bg-success/10 text-success',
    Pendiente: 'bg-warning/10 text-warning',
    Cancelada: 'bg-error/10 text-error',
  };
  return statusMap[status] || 'bg-gray-100 text-gray-800';
};

const openViewModal = (sale) => {
  selectedSaleForView.value = sale;
  isViewModalOpen.value = true;
};

const closeViewModal = () => {
  isViewModalOpen.value = false;
  selectedSaleForView.value = null;
};

const openFormModalForNew = () => {
  isEditing.value = false;
  Object.assign(saleForm, {
    id: null,
    customer: '',
    email: '',
    seller: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    status: 'Pendiente',
    items: [],
  });
  isFormModalOpen.value = true;
  error.value = null;
  fetchProducts();
};

const openFormModalForEdit = (sale) => {
  isEditing.value = true;
  Object.assign(saleForm, {
    id: sale.id,
    customer: sale.customer_name_field ?? '',
    email: sale.email ?? '',
    seller: sale.seller,
    date: sale.date,
    time: sale.time,
    status: sale.status,
    items: sale.items?.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.unit_price,
    })) || [],
  });
  isFormModalOpen.value = true;
  error.value = null;
  fetchProducts();
};

const closeFormModal = () => {
  isFormModalOpen.value = false;
  Object.assign(saleForm, {
    id: null,
    customer: '',
    email: '',
    seller: '',
    date: '',
    time: '',
    status: 'Pendiente',
    items: [],
  });
  error.value = null;
  availableProducts.value = [];
};

const addItem = () => {
  saleForm.items.push({ product_id: null, quantity: 1, unit_price: 0 });
};

const removeItem = (index) => {
  saleForm.items.splice(index, 1);
};

const updateItem = (index, updatedItem) => {
  saleForm.items[index] = { ...updatedItem };
};

const calculateTotalForm = (items) => {
  if (!items) return 0;
  return items.reduce((sum, item) => sum + (item.quantity * (item.unit_price || 0)), 0);
};

const calculateTotalViewModal = (items) => {
  if (!items) return 0;
  return items.reduce(
    (sum, item) => sum + (item.subtotal ? item.subtotal : item.quantity * item.unit_price),
    0
  );
};

const applyFilters = () => {
  currentPage.value = 1; // Reset page on filter change
};

// Lifecycle Hook
onMounted(() => {
  fetchSales();
  fetchDashboardData();
});
</script>

<style scoped>
.input {
  border: 1px solid #d1d5db;
  padding: 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  width: 100%;
  touch-action: manipulation;
}
.btn {
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  font-size: 0.875rem;
  touch-action: manipulation;
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
.text-accent { color: #6366f1; }
.text-accent-dark { color: #4f46e5; }
.text-primary { color: #3b82f6; }
.text-primary-dark { color: #2563eb; }
.bg-primary-100 { background-color: rgba(59, 130, 246, 0.1); }
.text-secondary { color: #6b7280; }
.bg-secondary-100 { background-color: rgba(107, 114, 128, 0.1); }
.bg-accent-100 { background-color: rgba(99, 102, 241, 0.1); }

/* Ajustes para móviles */
@media (max-width: 640px) {
  .btn {
    padding: 0.75rem;
  }
  .input {
    padding: 0.75rem;
  }
  h1 {
    font-size: 1.5rem;
  }
  h3 {
    font-size: 1.125rem;
  }
}
</style>