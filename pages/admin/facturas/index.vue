<template>
    <div>
      <div class="mb-6 flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Facturas</h1>
          <p class="text-gray-600">Gestiona las facturas de tus proveedores</p>
        </div>
        <button @click="openCreateModal" class="btn btn-primary">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Nueva Factura
        </button>
      </div>
  
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              v-model="filters.search"
              placeholder="Número de factura, proveedor..."
              class="input w-full"
              @input="applyFilters"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="filters.status" class="input w-full" @change="applyFilters">
              <option value="">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="paid">Pagada</option>
              <option value="cancelled">Cancelada</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              v-model="filters.issue_date"
              class="input w-full"
              @change="applyFilters"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
            <select v-model="filters.sort" class="input w-full" @change="applyFilters">
              <option value="invoice_number">Número de Factura</option>
              <option value="total_amount">Monto Total</option>
              <option value="issue_date">Fecha</option>
            </select>
          </div>
        </div>
      </div>
  
      <div v-if="!loading && filteredInvoices.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="invoice in filteredInvoices" :key="invoice.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div class="p-4">
            <div class="flex justify-between items-start mb-2">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ invoice.invoice_number }}</h3>
                <p class="text-sm text-gray-500">Proveedor: {{ invoice.supplier }}</p>
                <p class="text-sm text-gray-500">Fecha: {{ formatDate(invoice.issue_date) }}</p>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded-full"
                :class="getStatusClass(invoice.status)">
                {{ invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1) }}
              </span>
            </div>
            <div class="text-xl font-bold text-primary mb-4">${{ invoice.total_amount.toFixed(2) }}</div>
            <div class="mb-4">
              <p class="text-sm font-medium text-gray-700">Productos:</p>
              <ul class="text-sm text-gray-500 list-disc list-inside">
                <li v-for="purchase in invoice.purchases" :key="purchase.product">
                  {{ purchase.product }} ({{ purchase.quantity }} x ${{ purchase.purchase_price.toFixed(2) }})
                </li>
              </ul>
            </div>
            <div class="flex gap-2">
              <button @click="openEditModal(invoice)" class="btn btn-outline flex-1">
                <Icon name="heroicons:pencil-square" class="w-4 h-4 mr-1" />
                Editar
              </button>
              <button @click="deleteInvoice(invoice.id)" class="btn btn-outline text-error hover:bg-error/10 flex-1">
                <Icon name="heroicons:trash" class="w-4 h-4 mr-1" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-else-if="loading" class="text-center py-8">
        <p class="text-gray-600">Cargando facturas...</p>
      </div>
  
      <div v-else class="text-center py-8">
        <p class="text-gray-600">No se encontraron facturas.</p>
      </div>
      <div v-if="error && !notification.isOpen" class="text-center py-4 text-error">
        <p>{{ error }}</p>
      </div>
  
      <!-- Modal de Creación -->
      <Modal :open="isCreateModalOpen" @close="closeCreateModal">
        <h2 class="text-xl font-bold mb-4">Nueva Factura</h2>
        <form @submit.prevent="createInvoice">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
              <select v-model="newInvoice.supplier_id" class="input w-full" required>
                <option value="">Seleccione un proveedor</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Número de Factura</label>
              <input v-model="newInvoice.invoice_number" type="text" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Emisión</label>
              <input v-model="newInvoice.issue_date" type="date" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Monto Total</label>
              <input v-model.number="newInvoice.total_amount" type="number" step="0.01" class="input w-full" required min="0" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select v-model="newInvoice.status" class="input w-full" required>
                <option value="pending">Pendiente</option>
                <option value="paid">Pagada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Compras</label>
              <div v-for="(purchase, index) in newInvoice.purchases" :key="index" class="mb-2 p-2 border rounded">
                <div class="grid grid-cols-3 gap-2">
                  <select v-model="purchase.product_id" class="input w-full" required>
                    <option value="">Seleccione un producto</option>
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }}
                    </option>
                  </select>
                  <input v-model.number="purchase.quantity" type="number" placeholder="Cantidad" class="input w-full" required min="1" />
                  <input v-model.number="purchase.purchase_price" type="number" step="0.01" placeholder="Precio" class="input w-full" required min="0" />
                </div>
                <button type="button" @click="removePurchase(index)" class="text-error text-sm mt-2">Eliminar</button>
              </div>
              <button type="button" @click="addPurchase" class="btn btn-outline w-full">Agregar Compra</button>
            </div>
          </div>
          <div class="mt-6 flex gap-4">
            <button type="submit" class="btn btn-primary flex-1" :disabled="loading">Guardar Factura</button>
            <button type="button" @click="closeCreateModal" class="btn btn-outline flex-1" :disabled="loading">Cancelar</button>
          </div>
        </form>
      </Modal>
  
      <!-- Modal de Edición -->
      <Modal :open="isEditModalOpen" @close="closeEditModal">
        <h2 class="text-xl font-bold mb-4">Editar Factura</h2>
        <form @submit.prevent="updateInvoice">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
              <select v-model="editingInvoice.supplier_id" class="input w-full" required>
                <option value="">Seleccione un proveedor</option>
                <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
                  {{ supplier.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Número de Factura</label>
              <input v-model="editingInvoice.invoice_number" type="text" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha de Emisión</label>
              <input v-model="editingInvoice.issue_date" type="date" class="input w-full" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Monto Total</label>
              <input v-model.number="editingInvoice.total_amount" type="number" step="0.01" class="input w-full" required min="0" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select v-model="editingInvoice.status" class="input w-full" required>
                <option value="pending">Pendiente</option>
                <option value="paid">Pagada</option>
                <option value="cancelled">Cancelada</option>
              </select>
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
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useApiService } from '~/services/api/api';
  import Modal from '~/components/Modal.vue';
  import NotificationModal from '~/components/NotificationModal.vue';
  
  definePageMeta({
    layout: 'admin',
  });
  
  const api = useApiService();
  
  const filters = reactive({
    search: '',
    status: '',
    issue_date: '',
    sort: 'invoice_number',
  });
  
  const allInvoices = ref([]);
  const suppliers = ref([]);
  const products = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  const notification = reactive({
    isOpen: false,
    message: '',
    type: 'success',
  });
  
  const isCreateModalOpen = ref(false);
  const newInvoice = reactive({
    supplier_id: '',
    invoice_number: '',
    issue_date: '',
    total_amount: 0,
    status: 'pending',
    purchases: [],
  });
  
  const isEditModalOpen = ref(false);
  const editingInvoice = reactive({
    id: null,
    supplier_id: '',
    invoice_number: '',
    issue_date: '',
    total_amount: 0,
    status: '',
  });
  
  const filteredInvoices = computed(() => {
    return allInvoices.value
      .filter((invoice) => {
        if (!invoice || !invoice.id) return false;
        const searchMatch =
          !filters.search ||
          invoice.invoice_number.toLowerCase().includes(filters.search.toLowerCase()) ||
          invoice.supplier.toLowerCase().includes(filters.search.toLowerCase());
        const statusMatch = !filters.status || invoice.status === filters.status;
        const dateMatch = !filters.issue_date || invoice.issue_date === filters.issue_date;
        return searchMatch && statusMatch && dateMatch;
      })
      .sort((a, b) => {
        if (filters.sort === 'invoice_number') return a.invoice_number.localeCompare(b.invoice_number);
        if (filters.sort === 'total_amount') return a.total_amount - b.total_amount;
        if (filters.sort === 'issue_date') return new Date(a.issue_date) - new Date(b.issue_date);
        return 0;
      });
  });
  
  const openCreateModal = () => {
    isCreateModalOpen.value = true;
  };
  
  const closeCreateModal = () => {
    isCreateModalOpen.value = false;
    Object.assign(newInvoice, {
      supplier_id: '',
      invoice_number: '',
      issue_date: '',
      total_amount: 0,
      status: 'pending',
      purchases: [],
    });
  };
  
  const openEditModal = (invoice) => {
    Object.assign(editingInvoice, {
      id: invoice.id,
      supplier_id: invoice.supplier_id || '',
      invoice_number: invoice.invoice_number,
      issue_date: invoice.issue_date,
      total_amount: invoice.total_amount,
      status: invoice.status,
    });
    isEditModalOpen.value = true;
  };
  
  const closeEditModal = () => {
    isEditModalOpen.value = false;
    Object.assign(editingInvoice, {
      id: null,
      supplier_id: '',
      invoice_number: '',
      issue_date: '',
      total_amount: 0,
      status: '',
    });
  };
  
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
  
  const addPurchase = () => {
    newInvoice.purchases.push({
      product_id: '',
      quantity: 1,
      purchase_price: 0,
    });
  };
  
  const removePurchase = (index) => {
    newInvoice.purchases.splice(index, 1);
  };
  
  const createInvoice = async () => {
    if (!validateInvoice(newInvoice)) return;
    loading.value = true;
    error.value = null;
    try {
      const invoiceData = {
        supplier_id: Number(newInvoice.supplier_id),
        invoice_number: newInvoice.invoice_number,
        issue_date: newInvoice.issue_date,
        total_amount: Number(newInvoice.total_amount),
        status: newInvoice.status,
        purchases: newInvoice.purchases.map((purchase) => ({
          product_id: Number(purchase.product_id),
          quantity: Number(purchase.quantity),
          purchase_price: Number(purchase.purchase_price),
        })),
      };
      const response = await api.createInvoice(invoiceData);
      allInvoices.value.push(response);
      closeCreateModal();
      showNotification('Factura creada exitosamente!');
    } catch (err) {
      error.value = err.message || 'Error al crear la factura.';
      console.error('Error creating invoice:', err);
      showNotification(error.value, 'error');
    } finally {
      loading.value = false;
    }
  };
  
  const updateInvoice = async () => {
    if (!validateInvoice(editingInvoice)) return;
    loading.value = true;
    error.value = null;
    try {
      const invoiceData = {
        supplier_id: Number(editingInvoice.supplier_id),
        invoice_number: editingInvoice.invoice_number,
        issue_date: editingInvoice.issue_date,
        total_amount: Number(editingInvoice.total_amount),
        status: editingInvoice.status,
      };
      const response = await api.updateInvoice(editingInvoice.id, invoiceData);
      const index = allInvoices.value.findIndex((i) => i.id === editingInvoice.id);
      if (index !== -1) {
        allInvoices.value[index] = response;
      } else {
        allInvoices.value.push(response);
      }
      closeEditModal();
      showNotification('Factura actualizada exitosamente!');
    } catch (err) {
      error.value = err.message || 'Error al actualizar la factura.';
      console.error('Error updating invoice:', err);
      showNotification(error.value, 'error');
    } finally {
      loading.value = false;
    }
  };
  
  const deleteInvoice = async (invoiceId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta factura?')) return;
    loading.value = true;
    error.value = null;
    try {
      await api.deleteInvoice(invoiceId);
      allInvoices.value = allInvoices.value.filter((i) => i.id !== invoiceId);
      showNotification('Factura eliminada exitosamente!');
    } catch (err) {
      error.value = err.message || 'Error al eliminar la factura.';
      console.error('Error deleting invoice:', err);
      showNotification(error.value, 'error');
    } finally {
      loading.value = false;
    }
  };
  
  const loadInvoices = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.getInvoices();
      allInvoices.value = response;
    } catch (err) {
      error.value = err.message || 'No se pudieron cargar las facturas.';
      console.error('Error loading invoices:', err);
      showNotification(error.value, 'error');
    } finally {
      loading.value = false;
    }
  };
  
  const loadSuppliers = async () => {
    try {
      const response = await api.getSuppliers();
      suppliers.value = response;
    } catch (err) {
      console.error('Error loading suppliers:', err);
    }
  };
  
  const loadProducts = async () => {
    try {
      const response = await api.getProducts();
      products.value = response;
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };
  
  const validateInvoice = (invoice) => {
    if (!invoice.supplier_id) {
      error.value = 'El proveedor es obligatorio.';
      showNotification(error.value, 'error');
      return false;
    }
    if (!invoice.invoice_number.trim()) {
      error.value = 'El número de factura es obligatorio.';
      showNotification(error.value, 'error');
      return false;
    }
    if (!invoice.issue_date) {
      error.value = 'La fecha de emisión es obligatoria.';
      showNotification(error.value, 'error');
      return false;
    }
    if (isNaN(invoice.total_amount) || invoice.total_amount < 0) {
      error.value = 'El monto total debe ser un número válido mayor o igual a 0.';
      showNotification(error.value, 'error');
      return false;
    }
    const validStatuses = ['pending', 'paid', 'cancelled'];
    if (!validStatuses.includes(invoice.status)) {
      error.value = 'Seleccione un estado válido.';
      showNotification(error.value, 'error');
      return false;
    }
    if ('purchases' in invoice && invoice.purchases.length > 0) {
      for (let [index, purchase] of invoice.purchases.entries()) {
        if (!purchase.product_id) {
          error.value = `Seleccione un producto para la compra ${index + 1}.`;
          showNotification(error.value, 'error');
          return false;
        }
        if (isNaN(purchase.quantity) || purchase.quantity < 1) {
          error.value = `La cantidad de la compra ${index + 1} debe ser un número mayor o igual a 1.`;
          showNotification(error.value, 'error');
          return false;
        }
        if (isNaN(purchase.purchase_price) || purchase.purchase_price < 0) {
          error.value = `El precio de la compra ${index + 1} debe ser un número mayor o igual a 0.`;
          showNotification(error.value, 'error');
          return false;
        }
      }
      const calculatedTotal = invoice.purchases.reduce(
        (sum, purchase) => sum + purchase.quantity * purchase.purchase_price,
        0
      );
      if (Math.abs(calculatedTotal - invoice.total_amount) > 0.01) {
        error.value = 'El monto total no coincide con la suma de las compras.';
        showNotification(error.value, 'error');
        return false;
      }
    }
    return true;
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const getStatusClass = (status) => {
    if (status === 'pending') return 'bg-warning/10 text-warning';
    if (status === 'paid') return 'bg-success/10 text-success';
    if (status === 'cancelled') return 'bg-error/10 text-error';
    return 'bg-gray-100 text-gray-600';
  };
  
  const applyFilters = () => {};
  
  onMounted(() => {
    loadInvoices();
    loadSuppliers();
    loadProducts();
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
  .text-success {
    color: #10b981;
  }
  .bg-success\/10 {
    background-color: rgba(16, 185, 129, 0.1);
  }
  .text-warning {
    color: #f59e0b;
  }
  .bg-warning\/10 {
    background-color: rgba(245, 158, 11, 0.1);
  }
  .text-error {
    color: #ef4444;
  }
  .bg-error\/10 {
    background-color: rgba(239, 68, 68, 0.1);
  }
  .text-primary {
    color: #3b82f6;
  }
  </style>