<template>
    <div class="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <!-- Encabezado -->
      <div class="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Proveedores</h1>
          <p class="text-sm text-gray-600">Gestiona los proveedores de tu vivero</p>
        </div>
        <button @click="openCreateModal" class="btn btn-primary w-full sm:w-auto text-base py-2">
          <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
          Nuevo Proveedor
        </button>
      </div>
  
      <!-- Filtros -->
      <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <input
              type="text"
              v-model="filters.search"
              placeholder="Nombre, email, teléfono..."
              class="input w-full text-sm"
              @input="applyFilters"
            />
          </div>
        </div>
      </div>
  
      <!-- Lista de Proveedores -->
      <div v-if="!loading && filteredSuppliers.length" class="space-y-4">
        <div v-for="supplier in filteredSuppliers" :key="supplier.id"
          class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <div class="p-4">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
              <div>
                <h3 class="text-lg font-medium text-gray-900">{{ supplier.name +' - ' + supplier.last_name }}</h3>
                
                <p v-if="supplier.email" class="text-sm text-gray-500">Email: {{ supplier.email }}</p>
                <p v-if="supplier.phone" class="text-sm text-gray-500">Teléfono: {{ supplier.phone }}</p>
                <p v-if="supplier.address" class="text-sm text-gray-500">Dirección: {{ supplier.address }}</p>
              </div>
            </div>
            <div class="flex flex-col sm:flex-row gap-2 mt-4">
              <button @click="openEditModal(supplier)" class="btn btn-outline flex-1 py-2 text-sm">
                <Icon name="heroicons:pencil-square" class="w-4 h-4 mr-1" />
                Editar
              </button>
              <button @click="deleteSupplier(supplier.id)" class="btn btn-outline text-error hover:bg-error/10 flex-1 py-2 text-sm">
                <Icon name="heroicons:trash" class="w-4 h-4 mr-1" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <div v-else-if="loading" class="text-center py-8">
        <p class="text-gray-600 text-sm">Cargando proveedores...</p>
      </div>
  
      <div v-else class="text-center py-8">
        <p class="text-gray-600 text-sm">No se encontraron proveedores.</p>
      </div>
      <div v-if="error && !notification.isOpen" class="text-center py-4 text-error text-sm">
        <p>{{ error }}</p>
      </div>
  
      <!-- Modal de Creación -->
      <Modal :open="isCreateModalOpen" @close="closeCreateModal">
        <h2 class="text-xl font-bold mb-4">Nuevo Proveedor</h2>
        <form @submit.prevent="createSupplier">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input v-model="newSupplier.name" type="text" class="input w-full text-sm" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input v-model="newSupplier.last_name" type="text" class="input w-full text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="newSupplier.email" type="email" class="input w-full text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input v-model="newSupplier.phone" type="tel" class="input w-full text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input v-model="newSupplier.address" type="text" class="input w-full text-sm" />
            </div>
          </div>
          <div class="mt-6 flex flex-col sm:flex-row gap-4">
            <button type="submit" class="btn btn-primary flex-1 py-2 text-sm" :disabled="loading">Guardar Proveedor</button>
            <button type="button" @click="closeCreateModal" class="btn btn-outline flex-1 py-2 text-sm" :disabled="loading">Cancelar</button>
          </div>
        </form>
      </Modal>
  
      <!-- Modal de Edición -->
      <Modal :open="isEditModalOpen" @close="closeEditModal">
        <h2 class="text-xl font-bold mb-4">Editar Proveedor</h2>
        <form @submit.prevent="updateSupplier">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input v-model="editingSupplier.name" type="text" class="input w-full text-sm" required />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
              <input v-model="editingSupplier.last_name" type="text" class="input w-full text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="editingSupplier.email" type="email" class="input w-full text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input v-model="editingSupplier.phone" type="tel" class="input w-full text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input v-model="editingSupplier.address" type="text" class="input w-full text-sm" />
            </div>
          </div>
          <div class="mt-6 flex flex-col sm:flex-row gap-4">
            <button type="submit" class="btn btn-primary flex-1 py-2 text-sm" :disabled="loading">Guardar Cambios</button>
            <button type="button" @click="closeEditModal" class="btn btn-outline flex-1 py-2 text-sm" :disabled="loading">Cancelar</button>
          </div>
        </form>
        <div v-if="error && !notification.isOpen" class="mt-4 text-error text-center text-sm">{{ error }}</div>
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
  import { useApiService } from '~/services/api/api'
  import Modal from '~/components/Modal.vue';
  import NotificationModal from '~/components/NotificationModal.vue';
  
  definePageMeta({
    layout: 'admin',
  });
  
  const api = useApiService();
  
  const filters = reactive({
    search: '',
  });
  
  const allSuppliers = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  const notification = reactive({
    isOpen: false,
    message: '',
    type: 'success',
  });
  
  const isCreateModalOpen = ref(false);
  const newSupplier = reactive({
    name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const isEditModalOpen = ref(false);
  const editingSupplier = reactive({
    id: null,
    name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  const filteredSuppliers = computed(() => {
    return allSuppliers.value
      .filter((supplier) => {
        if (!supplier || !supplier.id) return false;
        const searchMatch =
          !filters.search ||
          supplier.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          (supplier.email && supplier.email.toLowerCase().includes(filters.search.toLowerCase())) ||
          (supplier.phone && supplier.phone.toLowerCase().includes(filters.search.toLowerCase()));
        return searchMatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  });
  
  const openCreateModal = () => {
    isCreateModalOpen.value = true;
  };
  
  const closeCreateModal = () => {
    isCreateModalOpen.value = false;
    Object.assign(newSupplier, {
      name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
    });
  };
  
  const openEditModal = (supplier) => {
    Object.assign(editingSupplier, {
      id: supplier.id,
      name: supplier.name,
      last_name: supplier.last_name || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
      address: supplier.address || '',
    });
    isEditModalOpen.value = true;
  };
  
  const closeEditModal = () => {
    isEditModalOpen.value = false;
    Object.assign(editingSupplier, {
      id: null,
      name: '',
      last_name: '',
      email: '',
      phone: '',
      address: '',
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
  
  const createSupplier = async () => {
    if (!validateSupplier(newSupplier)) return;
    loading.value = true;
    error.value = null;
    try {
      const supplierData = {
        name: newSupplier.name,
        last_name: newSupplier.last_name || null,
        email: newSupplier.email || null,
        phone: newSupplier.phone || null,
        address: newSupplier.address || null,
      };
      const response = await api.createSupplier(supplierData);
      allSuppliers.value.push(response);
      closeCreateModal();
      showNotification('Proveedor creado exitosamente!');
    } catch (err) {
      error.value = err.message || 'Error al crear el proveedor.';
      console.error('Error creating supplier:', err);
      showNotification(error.value, 'error');
    } finally {
      loading.value = false;
    }
  };
  
  const updateSupplier = async () => {
    if (!validateSupplier(editingSupplier)) return;
    loading.value = true;
    error.value = null;
    try {
      const supplierData = {
        name: editingSupplier.name,
        last_name: editingSupplier.last_name || null,
        email: editingSupplier.email || null,
        phone: editingSupplier.phone || null,
        address: editingSupplier.address || null,
      };
      const response = await api.updateSupplier(editingSupplier.id, supplierData);
      const index = allSuppliers.value.findIndex((s) => s.id === editingSupplier.id);
      if (index !== -1) {
        allSuppliers.value[index] = response;
      } else {
        allSuppliers.value.push(response);
      }
      closeEditModal();
      showNotification('Proveedor actualizado exitosamente!');
    } catch (err) {
      error.value = err.message || 'Error al actualizar el proveedor.';
      console.error('Error updating supplier:', err);
      showNotification(error.value, 'error');
    } finally {
      loading.value = false;
    }
  };
  
  const deleteSupplier = async (supplierId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este proveedor?')) return;
    loading.value = true;
    error.value = null;
    try {
      await api.deleteSupplier(supplierId);
      allSuppliers.value = allSuppliers.value.filter((s) => s.id !== supplierId);
      showNotification('Proveedor eliminado exitosamente!');
    } catch (err) {
      error.value = err.message || 'Error al eliminar el proveedor.';
      console.error('Error deleting supplier:', err);
      showNotification(error.value, 'error');
    } finally {
      loading.value = false;
    }
  };
  
  const loadSuppliers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.getSuppliers();
      allSuppliers.value = response || [];
      
    } catch (err) {
      error.value = err.message || 'No se pudieron cargar los proveedores.';
      console.error('Error loading suppliers:', err);
      showNotification(error.value, 'error');
    } finally {
      loading.value = false;
    }
  };
  
  const validateSupplier = (supplier) => {
    if (!supplier.name.trim()) {
      error.value = 'El nombre del proveedor es obligatorio.';
      showNotification(error.value, 'error');
      return false;
    }
    if (supplier.email && !isValidEmail(supplier.email)) {
      error.value = 'El email no es válido.';
      showNotification(error.value, 'error');
      return false;
    }
    return true;
  };
  
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const applyFilters = () => {};
  
  onMounted(loadSuppliers);
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