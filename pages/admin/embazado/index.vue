<template>
  <div>
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Registro de Embazado</h1>
        <p class="text-gray-600">Registra las plantas embazadas durante el día</p>
      </div>
      <button class="btn btn-primary">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Nuevo Registro
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-primary-100 text-primary">
            <Icon name="heroicons:beaker" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Total Hoy</p>
            <h3 class="text-xl font-bold text-gray-900">45 plantas</h3>
            <p class="text-sm text-success flex items-center mt-1">
              <Icon name="heroicons:arrow-up" class="w-4 h-4 mr-1" />
              12% más que ayer
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-secondary-100 text-secondary">
            <Icon name="heroicons:clock" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Promedio por hora</p>
            <h3 class="text-xl font-bold text-gray-900">6 plantas</h3>
            <p class="text-sm text-success flex items-center mt-1">
              <Icon name="heroicons:arrow-up" class="w-4 h-4 mr-1" />
              8% más que ayer
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-accent-100 text-accent">
            <Icon name="heroicons:user-group" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Empleados activos</p>
            <h3 class="text-xl font-bold text-gray-900">4</h3>
            <p class="text-sm text-gray-500 mt-1">
              de 5 empleados totales
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Registrar Embazado</h2>
      <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Planta
          </label>
          <select v-model="form.plantType" class="input w-full" required>
            <option value="">Seleccionar tipo</option>
            <option v-for="type in plantTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Cantidad
          </label>
          <input 
            type="number" 
            v-model="form.quantity" 
            min="1" 
            class="input w-full" 
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Fecha y Hora
          </label>
          <input 
            type="datetime-local" 
            v-model="form.datetime" 
            class="input w-full" 
            required
          />
        </div>

        <div class="md:col-span-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Observaciones
          </label>
          <textarea 
            v-model="form.notes" 
            rows="3" 
            class="input w-full"
            placeholder="Agregar notas o comentarios adicionales..."
          ></textarea>
        </div>

        <div class="md:col-span-3">
          <button type="submit" class="btn btn-primary">
            Guardar Registro
          </button>
        </div>
      </form>
    </div>

    <!-- Records Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Empleado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Planta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cantidad
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha y Hora
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Observaciones
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="record in records" :key="record.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="font-medium text-primary">{{ getInitials(record.employee) }}</span>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">{{ record.employee }}</div>
                    <div class="text-sm text-gray-500">ID: {{ record.employeeId }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ record.plantType }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ record.quantity }} plantas</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ record.date }}</div>
                <div class="text-sm text-gray-500">{{ record.time }}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">{{ record.notes || '-' }}</div>
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
                <span class="font-medium">20</span> registros
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

// Form state
const form = reactive({
  plantType: '',
  quantity: '',
  datetime: '',
  notes: ''
});

// Plant types
const plantTypes = [
  'Monstera Deliciosa',
  'Ficus Lyrata',
  'Pothos',
  'Sanseviera',
  'Calathea',
  'Philodendron'
];

// Mock data for records
const records = ref([
  {
    id: 1,
    employee: 'Juan Pérez',
    employeeId: 'EMP001',
    plantType: 'Monstera Deliciosa',
    quantity: 12,
    date: '2025-04-15',
    time: '09:30',
    notes: 'Plantas en excelente estado'
  },
  {
    id: 2,
    employee: 'María López',
    employeeId: 'EMP002',
    plantType: 'Ficus Lyrata',
    quantity: 8,
    date: '2025-04-15',
    time: '10:45',
    notes: 'Se requiere más sustrato'
  },
  {
    id: 3,
    employee: 'Carlos Rodríguez',
    employeeId: 'EMP003',
    plantType: 'Pothos',
    quantity: 15,
    date: '2025-04-15',
    time: '11:15',
    notes: ''
  }
]);

// Helper function to get initials
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Handle form submission
const handleSubmit = () => {
  // Here you would typically make an API call to save the record
  console.log('Form submitted:', form);
  
  // Reset form
  form.plantType = '';
  form.quantity = '';
  form.datetime = '';
  form.notes = '';
};
</script>