<template>
  <ClientOnly>
    <Teleport to="body">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div
          class="bg-white dark:bg-background-dark rounded-lg shadow-lg w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto"
        >
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold text-content-light dark:text-content-dark">
              {{ mode === 'create' ? 'Crear Venta' : 'Ver Venta' }}
            </h2>
            <button
              @click="closeModal"
              class="text-content-light dark:text-content-dark hover:text-primary"
              aria-label="Cerrar modal"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>

          <!-- Modal Content -->
          <main class="space-y-6">
            <!-- Client Section -->
            <section>
              <h3 class="text-xl font-bold text-content-light dark:text-content-dark mb-3">Cliente</h3>
              <div class="space-y-4">
                <input
                  v-model="clientName"
                  class="form-input w-full rounded-lg border-0 bg-surface-light dark:bg-surface-dark text-content-light dark:text-content-dark placeholder-subtle-light dark:placeholder-subtle-dark focus:ring-2 focus:ring-primary h-14 p-4 text-base"
                  placeholder="Nombre del Cliente"
                  type="text"
                  :disabled="mode === 'view'"
                />
                <input
                  v-model="clientAddress"
                  class="form-input w-full rounded-lg border-0 bg-surface-light dark:bg-surface-dark text-content-light dark:text-content-dark placeholder-subtle-light dark:placeholder-subtle-dark focus:ring-2 focus:ring-primary h-14 p-4 text-base"
                  placeholder="Dirección del Cliente"
                  type="text"
                  :disabled="mode === 'view'"
                />
              </div>
            </section>

            <!-- Products Section -->
            <section>
              <div class="flex justify-between items-center mb-3">
                <h3 class="text-xl font-bold text-content-light dark:text-content-dark">Productos ({{ store.items.length }})</h3>
                <button
                  v-if="mode === 'create'"
                  @click="toggleSearch"
                  class="flex items-center gap-1 text-primary font-semibold text-sm"
                >
                  <span class="material-symbols-outlined">{{ showSearch ? 'close' : 'search' }}</span>
                  {{ showSearch ? 'Cerrar búsqueda' : 'Buscar Planta' }}
                </button>
              </div>

              <!-- Search Input and Results -->
              <div v-if="mode === 'create' && showSearch" class="mb-4">
                <input
                  v-model="searchTerm"
                  @input="debouncedSearch"
                  class="form-input w-full rounded-lg border-0 bg-surface-light dark:bg-surface-dark text-content-light dark:text-content-dark placeholder-subtle-light dark:placeholder-subtle-dark focus:ring-2 focus:ring-primary h-14 p-4 text-base"
                  placeholder="Buscar planta por nombre..."
                  type="text"
                />
                <div v-if="loading" class="mt-2 text-center text-subtle-light dark:text-subtle-dark">
                  Cargando...
                </div>
                <div v-else-if="searchTerm && filteredProducts.length === 0" class="mt-2 text-center text-subtle-light dark:text-subtle-dark">
                  No se encontró ninguna planta.
                </div>
                <div v-else-if="filteredProducts.length > 0" class="mt-2 space-y-2 max-h-40 overflow-y-auto">
                  <div
                    v-for="product in filteredProducts.slice(0, 5)"
                    :key="product.id"
                    class="p-3 border rounded-lg cursor-pointer hover:bg-primary/10 flex items-center gap-3"
                    @click="addProduct(product)"
                  >
                    <div
                      class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-10"
                      :style="{ backgroundImage: `url(${product.image_url || placeholderImage})` }"
                    ></div>
                    <div>
                      <p class="font-medium text-content-light dark:text-content-dark">{{ product.nombre || product.name }}</p>
                      <p class="text-sm text-subtle-light dark:text-subtle-dark">${{ Number(product.precio_venta || product.price || 0).toFixed(2) }}</p>
                    </div>
                  </div>
                  <div v-if="filteredProducts.length > 5" class="text-center text-sm text-subtle-light dark:text-subtle-dark mt-2">
                    Y {{ filteredProducts.length - 5 }} más...
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <div
                  v-for="item in store.items"
                  :key="item.id"
                  class="flex items-center gap-4 rounded-lg bg-surface-light dark:bg-surface-dark p-3"
                >
                  <div
                    class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14"
                    :style="{ backgroundImage: `url(${item.image || placeholderImage})` }"
                  ></div>
                  <div class="flex-grow">
                    <p class="font-bold text-content-light dark:text-content-dark">{{ item.nombre }}</p>
                    <p class="text-sm text-subtle-light dark:text-subtle-dark">${{ Number(item.precioUnitario).toFixed(2) }}</p>
                  </div>
                  <div class="flex items-center gap-2" v-if="mode === 'create'">
                    <button
                      @click="updateQuantity(item.id, -1)"
                      class="size-6 rounded-full bg-primary/20 dark:bg-primary/30 text-primary flex items-center justify-center"
                      :disabled="item.cantidad <= 1"
                    >
                      -
                    </button>
                    <span class="font-bold text-content-light dark:text-content-dark w-4 text-center">{{
                      item.cantidad
                    }}</span>
                    <button
                      @click="updateQuantity(item.id, 1)"
                      class="size-6 rounded-full bg-primary/20 dark:bg-primary/30 text-primary flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      @click="store.removerItem(item.id)"
                      class="text-red-500 hover:text-red-700 ml-2"
                    >
                      ×
                    </button>
                  </div>
                  <span v-else class="font-bold text-content-light dark:text-content-dark">x{{ item.cantidad }}</span>
                </div>
                <p v-if="store.items.length === 0 && mode === 'create'" class="text-center text-subtle-light dark:text-subtle-dark py-4">
                  Agrega productos para continuar.
                </p>
              </div>
            </section>

            <!-- Summary Section -->
            <section>
              <h3 class="text-xl font-bold text-content-light dark:text-content-dark mb-3">Resumen</h3>
              <div class="p-4 rounded-lg bg-surface-light dark:bg-surface-dark space-y-3">
                <div class="flex justify-between items-center">
                  <p class="text-subtle-light dark:text-subtle-dark">Subtotal</p>
                  <p class="font-medium text-content-light dark:text-content-dark">${{ store.subtotal.toFixed(2) }}</p>
                </div>
                <div class="flex justify-between items-center">
                  <p class="text-subtle-light dark:text-subtle-dark">Impuestos (21%)</p>
                  <p class="font-medium text-content-light dark:text-content-dark">${{ store.ivaTotal.toFixed(2) }}</p>
                </div>
                <div class="border-t border-subtle-light/20 dark:border-subtle-dark/20 my-2"></div>
                <div class="flex justify-between items-center">
                  <p class="font-bold text-content-light dark:text-content-dark">Total</p>
                  <p class="font-bold text-xl text-content-light dark:text-content-dark">${{ store.totalFinal.toFixed(2) }}</p>
                </div>
              </div>
            </section>
          </main>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-4 mt-6">
            <button
              @click="closeModal"
              class="px-4 py-2 rounded-lg bg-subtle-light dark:bg-subtle-dark text-content-light dark:text-content-dark"
            >
              {{ mode === 'create' ? 'Cancelar' : 'Cerrar' }}
            </button>
            <button
              v-if="mode === 'create'"
              @click="submitSale"
              class="px-4 py-2 rounded-lg bg-primary text-white"
              :disabled="!clientName || store.items.length === 0"
            >
              Guardar Venta
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useApiService } from '~/services/api/api'; 
import { useVentasStore } from '~/stores/ventas';  // Importa el store

const props = defineProps({
  isOpen: Boolean,
  mode: {
    type: String,
    default: 'create', // 'create' or 'view'
  },
  sale: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:isOpen', 'submit']);

const apiService = useApiService();
const store = useVentasStore();  // Usa el store de Pinia

const clientName = ref('');
const clientAddress = ref('');
const allProducts = ref([]);
const searchTerm = ref('');
const loading = ref(false);
const showSearch = ref(false);
const placeholderImage = 'https://via.placeholder.com/150?text=Planta';

// Filtered products based on search
const filteredProducts = computed(() => {
  if (!searchTerm.value) return [];
  return allProducts.value.filter(p => 
    (p.nombre || p.name || '').toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

// Debounce function for search
const debounce = (fn: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// Load all products (o usa API search para eficiencia)
const loadProducts = async () => {
  if (allProducts.value.length > 0) return;
  loading.value = true;
  try {
    const res = await apiService.getProducts();
    if (res.success) {
      allProducts.value = res.data.map(p => ({
        id: p.id,
        nombre: p.nombre || p.name,
        precio_venta: Number(p.precio_venta || p.price || 0),  // Cast to number here
        image_url: p.image_url || p.image
      }));
    }
  } catch (error) {
    console.error('Error loading products:', error);
  } finally {
    loading.value = false;
  }
};

// Debounced search
const debouncedSearch = debounce(() => {
  loadProducts();
}, 300);

// Toggle search visibility
const toggleSearch = () => {
  showSearch.value = !showSearch.value;
  if (showSearch.value) {
    loadProducts();
    nextTick(() => {
      const input = document.querySelector('input[placeholder="Buscar planta por nombre..."]') as HTMLInputElement;
      input?.focus();
    });
  } else {
    searchTerm.value = '';
  }
};

// Add product to store
const addProduct = (product: any) => {
  console.log('Agregando producto al store:', product);  // DEBUG
  store.agregarItem({
    id: product.id,
    nombre: product.nombre || product.name,
    precioUnitario: Number(product.precio_venta || product.price || 0),
    cantidad: 1
  });
  console.log('Store items después de agregar:', store.items);  // DEBUG
  searchTerm.value = '';
};

// Update quantity in store
const updateQuantity = (id: number, change: number) => {
  const currentQty = store.items.find(i => i.id === id)?.cantidad || 1;
  const newQty = Math.max(1, currentQty + change);
  store.actualizarCantidad(id, newQty);
};

// Close modal and reset
const closeModal = () => {
  emit('update:isOpen', false);
  showSearch.value = false;
  searchTerm.value = '';
  clientName.value = '';
  clientAddress.value = '';
  // NO limpiar store aquí: el parent lo maneja post-submit o al abrir nuevo
};

// Submit: emite solo datos no-cart (parent mergea con store)
const submitSale = () => {
  if (!clientName.value || store.items.length === 0) {  // Ya lo tenés, pero loggea
    console.log('Submit falló: clientName=', clientName.value, 'items.length=', store.items.length);
    alert('Completa el nombre del cliente y agrega al menos un producto.');
    return;
  }
  emit('submit', {
    clientName: clientName.value,
    clientAddress: clientAddress.value
  });
  closeModal();
};

// Watch for open: sync data from props
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.mode === 'view' && props.sale) {
      // View: set read-only, load items to store
      clientName.value = props.sale.clientName || props.sale.customer || '';
      clientAddress.value = props.sale.clientAddress || props.sale.address || '';
      store.limpiarItems();  // Limpia antes de cargar
      if (props.sale.items && props.sale.items.length > 0) {
        props.sale.items.forEach((item: any) => {
          store.agregarItem({
            id: item.product_id || item.id,
            nombre: item.nombre || item.productName || 'Desconocido',
            precioUnitario: Number(item.precio_unitario || item.price || 0),
            cantidad: item.cantidad || item.quantity || 1
          });
        });
      }
    } else if (props.mode === 'create') {
      // Create: reset local, store ya limpio por parent
      clientName.value = '';
      clientAddress.value = '';
      loadProducts();
    }
  } else {
    // Al cerrar, reset local (store maneja parent)
    clientName.value = '';
    clientAddress.value = '';
  }
}, { immediate: true });

onMounted(() => {
  if (props.isOpen && props.mode === 'create') {
    loadProducts();
  }
});
</script>

<style scoped>
/* Ensure Material Symbols are styled */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>