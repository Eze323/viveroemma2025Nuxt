<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ventas</h1>
        <p class="text-gray-600">Gestiona las ventas del vivero</p>
      </div>
      <button class="btn btn-primary" @click="openFormModalForNew">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Nueva Venta
      </button>
    </div>

    <!-- Dashboard Cards -->
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
            class="input w-full"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
          <select v-model="filters.seller" class="input w-full">
            <option value="">Todos</option>
            <option v-for="seller in sellers" :key="seller.id" :value="seller.name">
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
                Items
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
            <tr v-for="sale in filteredSales" :key="sale.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ sale.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ sale.customer_name_field ?? 'N/A' }}</div>
                <div class="text-sm text-gray-500">{{ sale.email ?? '' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sale.seller }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sale.items ? sale.items.length : 0 }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${{ sale.total_price ? sale.total_price.toLocaleString() : '0' }}</div>
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
                <button
                  @click="openFormModalForEdit(sale)"
                  class="text-accent hover:text-accent-dark mr-3"
                  title="Editar venta"
                >
                  <Icon name="heroicons:pencil" class="w-5 h-5" />
                </button>
                <button
                  @click="openViewModal(sale)"
                  class="text-primary hover:text-primary-dark mr-3"
                  title="Ver detalles de la venta"
                >
                  <Icon name="heroicons:eye" class="w-5 h-5" />
                </button>
                <button class="text-primary hover:text-primary-dark mr-3" title="Generar Factura">
                  <Icon name="heroicons:document-text" class="w-5 h-5" />
                </button>
                <button
                  @click="deleteSale(sale.id)"
                  class="text-error hover:text-error-dark"
                  title="Eliminar Venta"
                >
                  <Icon name="heroicons:trash" class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="btn btn-outline">Anterior</button>
            <button class="btn btn-outline">Siguiente</button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando <span class="font-medium">1</span> a <span class="font-medium">{{ filteredSales.length < 10 ? filteredSales.length : 10 }}</span> de
                <span class="font-medium">{{ filteredSales.length }}</span> ventas
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

    <!-- View Modal -->
    <div v-if="isViewModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">Detalles de la Venta #{{ selectedSaleForView?.id }}</h3>
          <button @click="closeViewModal" class="text-gray-400 hover:text-gray-600">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <div v-if="selectedSaleForView" class="mb-6 text-sm text-gray-700">
          <p><strong>Cliente:</strong> {{ selectedSaleForView.customer_name_field ?? 'N/A' }}</p>
          <p><strong>Email:</strong> {{ selectedSaleForView.email ?? '' }}</p>
          <p><strong>Vendedor:</strong> {{ selectedSaleForView.seller }}</p>
          <p><strong>Fecha:</strong> {{ selectedSaleForView.date }} {{ selectedSaleForView.time }}</p>
          <p><strong>Estado:</strong>
            <span class="px-2 py-1 text-xs font-medium rounded-full"
              :class="getStatusClass(selectedSaleForView.status)">
              {{ selectedSaleForView.status }}
            </span>
          </p>
        </div>

        <div v-if="selectedSaleForView && selectedSaleForView.items && selectedSaleForView.items.length > 0" class="mb-6">
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Items de la Venta</h4>
          <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cant.</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio U.</th>
                <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(item, index) in selectedSaleForView.items" :key="index">
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ item.product ? item.product.name : 'N/A' }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{ item.quantity }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">${{ item.unit_price ? item.unit_price.toLocaleString() : '0' }}</td>
                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900">${{ item.subtotal ? item.subtotal.toLocaleString() : '0' }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-gray-50">
                <td colspan="3" class="px-4 py-2 text-right text-sm font-bold text-gray-900">Total:</td>
                <td class="px-4 py-2 text-right text-sm font-bold text-gray-900">${{ calculateTotalViewModal(selectedSaleForView.items).toLocaleString() }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div v-else-if="selectedSaleForView" class="text-center text-gray-500 italic">
          No hay items para esta venta.
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="closeViewModal" class="btn btn-outline">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Form Modal -->
    <div v-if="isFormModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">{{ isEditing ? 'Editar Venta' : 'Nueva Venta' }}</h3>
          <button @click="closeFormModal" class="text-gray-400 hover:text-gray-600">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <form @submit.prevent="handleSaveSale">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <input type="text" v-model="saleForm.customer" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Cliente</label>
              <input type="email" v-model="saleForm.email" class="input w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Vendedor</label>
              <select v-model="saleForm.seller" class="input w-full" required>
                <option value="">Seleccione un vendedor</option>
                <option v-for="seller in sellers" :key="seller.id" :value="seller.name">
                  {{ seller.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" v-model="saleForm.date" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input type="time" v-model="saleForm.time" class="input w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select v-model="saleForm.status" class="input w-full" required>
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
            <button type="button" @click="addItem" class="btn btn-outline mt-4">
              <Icon name="heroicons:plus" class="w-4 h-4 mr-2" />
              Agregar Item
            </button>
          </div>

          <div class="text-right text-lg font-bold text-gray-900 mb-6">
            Total: ${{ calculateTotalForm(saleForm.items).toLocaleString() }}
          </div>

          <div class="mt-6 flex justify-end space-x-3">
            <button type="button" @click="closeFormModal" class="btn btn-outline">Cancelar</button>
            <button type="submit" class="btn btn-primary" :disabled="loading">{{ isEditing ? 'Guardar Cambios' : 'Crear Venta' }}</button>
          </div>
        </form>
        <div v-if="error && !notification.isOpen" class="mt-4 text-error text-center">{{ error }}</div>
        <div v-if="loading" class="mt-4 text-center text-gray-600">Guardando...</div>
      </div>
    </div>

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
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useApiService } from '~/services/api';
import SaleItemForm from '~/components/admin/Ventas/SaleItemForm.vue';
import NotificationModal from '~/components/NotificationModal.vue';

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

// Mock data for sellers (Ideally fetch this from API)
const sellers = ref([
  { id: 1, name: 'María López' },
  { id: 2, name: 'Juan Pérez' },
  { id: 3, name: 'Ana García' },
]);

// Computed property for filtering and sorting
const filteredSales = computed(() => {
  let filtered = allSales.value;

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter((sale) => {
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
    filtered = filtered.filter((sale) => sale.status === filters.status);
  }

  if (filters.date) {
    filtered = filtered.filter((sale) => sale.date === filters.date);
  }

  if (filters.seller) {
    filtered = filtered.filter((sale) => sale.seller === filters.seller);
  }

  filtered.sort((a, b) => {
  if (filters.sort === 'date_desc') {
    const dateA = a.date ? new Date(a.date + (a.time ? 'T' + a.time : '')) : new Date(0);
    const dateB = b.date ? new Date(b.date + (b.time ? 'T' + b.time : '')) : new Date(0);
    return dateB - dateA;
  }
  return 0;
});

  return filtered;
});

// API Interaction Functions
const fetchSales = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.getSales();
    allSales.value = response;
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
    availableProducts.value = response;
    console.log('Available products:', availableProducts.value);
  } catch (err) {
    error.value = 'Error al cargar los productos.';
    console.error('Error fetching products:', err);
    showNotification(error.value, 'error');
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
      unitPrice: item.unitPrice,
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
  if (!confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
    return;
  }

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
    items: sale.items.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      unitPrice: item.unit_price,
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
  saleForm.items.push({ product_id: null, quantity: 1, unitPrice: 0 });
};

const removeItem = (index) => {
  saleForm.items.splice(index, 1);
};

const updateItem = (index, updatedItem) => {
  saleForm.items[index] = { ...updatedItem };
};

const calculateTotalForm = (items) => {
  if (!items) return 0;
  return items.reduce((sum, item) => sum + (item.quantity * (item.unitPrice || 0)), 0);
};

const calculateTotalViewModal = (items) => {
  if (!items) return 0;
  return items.reduce(
    (sum, item) => sum + (item.subtotal ? item.subtotal : item.quantity * item.unit_price),
    0
  );
};

// Lifecycle Hook
onMounted(() => {
  fetchSales();
});
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
.text-accent { color: #6366f1; }
.hover\:text-accent-dark:hover { color: #4f46e5; }
.text-primary { color: #3b82f6; }
.bg-primary-100 { background-color: rgba(59, 130, 246, 0.1); }
.text-secondary { color: #6b7280; }
.bg-secondary-100 { background-color: rgba(107, 114, 128, 0.1); }
.bg-accent-100 { background-color: rgba(99, 102, 241, 0.1); }
</style>