<!-- components/SaleItemForm.vue -->
<template>
    <div class="grid grid-cols-4 gap-4 items-center border p-3 rounded-md bg-gray-50">
      <!-- Campo de búsqueda autocompletado -->
      <div class="col-span-4 md:col-span-1 relative">
        <label class="block text-sm font-medium text-gray-700 mb-1">Producto</label>
        <input
          type="text"
          v-model="searchQuery"
          @input="filterProducts"
          @focus="showDropdown = true"
          @blur="delayHideDropdown"
          placeholder="Buscar producto..."
          class="input w-full text-sm"
          required
        />
        <!-- Lista desplegable de resultados -->
        <div
          v-if="showDropdown && filteredProducts.length > 0"
          class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y Aks-auto"
        >
          <ul class="py-1">
            <li
              v-for="product in filteredProducts"
              :key="product.id"
              @click="selectProduct(product)"
              class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              {{ product.name }} (${{ parseFloat(product.price).toLocaleString() }})
            </li>
          </ul>
        </div>
        <div
          v-if="showDropdown && searchQuery && filteredProducts.length === 0"
          class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-sm text-gray-500"
        >
          No se encontraron productos.
        </div>
      </div>
  
      <!-- Cantidad -->
      <div class="col-span-2 md:col-span-1">
        <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
        <input
          type="number"
          v-model.number="localItem.quantity"
          class="input w-full text-sm"
          min="1"
          required
          @input="emitUpdate"
        />
      </div>
  
      <!-- Precio Unitario -->
      <div class="col-span-2 md:col-span-1">
        <label class="block text-sm font-medium text-gray-700 mb-1">Precio U.</label>
        <input
          type="number"
          v-model.number="localItem.unitPrice"
          class="input w-full text-sm"
          min="0"
          step="0.01"
          required
          @input="emitUpdate"
        />
      </div>
  
      <!-- Botón de eliminar -->
      <div class="col-span-4 md:col-span-1 flex items-end justify-end">
        <button type="button" @click="$emit('remove')" class="text-error hover:text-error-dark" title="Eliminar item">
          <Icon name="heroicons:trash" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  
  
  
  // Props recibidos desde el componente padre
  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    availableProducts: {
      type: Array,
      required: true,
    },
  });
  
  // Estado local del ítem
  const localItem = ref({ ...props.item });
  
  // Estado para la búsqueda
  const searchQuery = ref('');
  const showDropdown = ref(false);
  const filteredProducts = ref([]);
  
  // Actualizar el ítem cuando cambie la prop
  watch(
    () => props.item,
    (newItem) => {
      localItem.value = { ...newItem };
      // Si hay un product_id, buscar el producto correspondiente para mostrar el nombre
      if (newItem.product_id) {
        const product = props.availableProducts.find((p) => p.id === newItem.product_id);
        searchQuery.value = product ? product.name : '';
      } else {
        searchQuery.value = '';
      }
    },
    { immediate: true, deep: true }
  );
  
  // Filtrar productos según la búsqueda
  const filterProducts = () => {
    const query = searchQuery.value.toLowerCase().trim();
    if (query) {
      filteredProducts.value = props.availableProducts.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
    } else {
      filteredProducts.value = props.availableProducts;
    }
  };
  
  // Seleccionar un producto
  const selectProduct = (product) => {
    localItem.value.product_id = product.id;
    localItem.value.unitPrice = parseFloat(product.price);
    searchQuery.value = product.name;
    showDropdown.value = false;
    emitUpdate();
  };
  
  // Retrasar el cierre del dropdown para permitir clics
  const delayHideDropdown = () => {
    setTimeout(() => {
      showDropdown.value = false;
    }, 200);
  };
  
  // Emitir actualización al padre
  const emitUpdate = () => {
    emit('update:item', localItem.value);
  };
  
  // Definir emits
  const emit = defineEmits(['update:item', 'remove']);
  
  // Inicializar productos filtrados
  filterProducts();
  </script>
  
  <style scoped>
  .input {
    border: 1px solid #d1d5db;
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    font-size: 0.875rem;
  }
  </style>