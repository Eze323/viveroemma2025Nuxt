<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Ventas</h1>
        <p class="text-gray-600">Gestiona las ventas del vivero</p>
      </div>
      <button class="btn btn-primary">
        <Icon name="heroicons:plus" class="w-5 h-5 mr-2" />
        Nueva Venta
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-primary-100 text-primary">
            <Icon name="heroicons:shopping-cart" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Ventas totales</p>
            <h3 class="text-xl font-bold text-gray-900">
              ${{ totalSales.toLocaleString() }}
            </h3>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center">
          <div class="p-3 rounded-full bg-secondary-100 text-secondary">
            <Icon name="heroicons:users" class="w-6 h-6" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">Clientes únicos</p>
            <h3 class="text-xl font-bold text-gray-900">{{ uniqueCustomers }}</h3>
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
            <h3 class="text-xl font-bold text-gray-900">{{ totalItems }}</h3>
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
            <h3 class="text-xl font-bold text-gray-900">
              ${{ averageTicket.toLocaleString() }}
            </h3>
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
            <option v-for="seller in sellers" :key="seller" :value="seller">
              {{ seller }}
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
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Venta</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="sale in filteredSales" :key="sale.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">#{{ sale.id }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ sale.customer }}</div>
                <div class="text-sm text-gray-500">{{ sale.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sale.seller }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sale.items }} productos</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">${{ sale.total.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium rounded-full" 
                  :class="getStatusClass(sale.status)">
                  {{ sale.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ sale.date }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button class="text-primary hover:text-primary-dark mr-3">
                  <Icon name="heroicons:eye" class="w-5 h-5" />
                </button>
                <button class="text-error hover:text-error-dark">
                  <Icon name="heroicons:trash" class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue"
import { useApiService } from "~/services/api/api"
const api = useApiService();

definePageMeta({
  layout: "admin"
})

interface Sale {
  id: number
  customer: string
  email: string
  seller: string
  items: number
  total: number
  status: string
  date: string
}

const sales = ref<Sale[]>([])
const filteredSales = ref<Sale[]>([])
const sellers = ref<string[]>([])

const filters = reactive({
  search: "",
  status: "",
  date: "",
  seller: ""
})

const fetchSales = async () => {
  try {
    const res = await api.getSales();
    // console.log("Respuesta de ventas:", res)
    sales.value = res.data
    filteredSales.value = res.data
    sellers.value = [...new Set(res.data.map((s: Sale) => s.seller))]
  } catch (error) {
    console.error("Error cargando ventas:", error)
  }
}

const applyFilters = () => {
  filteredSales.value = sales.value.filter(sale => {
    const matchSearch =
      sale.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
      String(sale.id).includes(filters.search)
    const matchStatus = filters.status ? sale.status === filters.status : true
    const matchDate = filters.date ? sale.date === filters.date : true
    const matchSeller = filters.seller ? sale.seller === filters.seller : true
    return matchSearch && matchStatus && matchDate && matchSeller
  })
}

onMounted(fetchSales)
watch(filters, applyFilters, { deep: true })

// Stats
const totalSales = computed(() =>
  sales.value.reduce((sum, s) => sum + s.total, 0)
)
const uniqueCustomers = computed(() =>
  new Set(sales.value.map(s => s.customer)).size
)
const totalItems = computed(() =>
  sales.value.reduce((sum, s) => sum + s.items, 0)
)
const averageTicket = computed(() =>
  sales.value.length ? totalSales.value / sales.value.length : 0
)

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    Completada: "bg-success/10 text-success",
    Pendiente: "bg-warning/10 text-warning",
    Cancelada: "bg-error/10 text-error"
  }
  return map[status] || "bg-gray-100 text-gray-800"
}
</script>
