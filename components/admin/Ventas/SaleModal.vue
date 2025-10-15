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
                  v-model="saleData.clientName"
                  class="form-input w-full rounded-lg border-0 bg-surface-light dark:bg-surface-dark text-content-light dark:text-content-dark placeholder-subtle-light dark:placeholder-subtle-dark focus:ring-2 focus:ring-primary h-14 p-4 text-base"
                  placeholder="Nombre del Cliente"
                  type="text"
                  :disabled="mode === 'view'"
                />
                <input
                  v-model="saleData.clientAddress"
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
                <h3 class="text-xl font-bold text-content-light dark:text-content-dark">Productos</h3>
                <button
                  v-if="mode === 'create'"
                  @click="openProductSelector"
                  class="flex items-center gap-1 text-primary font-semibold text-sm"
                >
                  <span class="material-symbols-outlined">add</span>
                  Añadir
                </button>
              </div>
              <div class="space-y-2">
                <div
                  v-for="(product, index) in saleData.products"
                  :key="index"
                  class="flex items-center gap-4 rounded-lg bg-surface-light dark:bg-surface-dark p-3"
                >
                  <div
                    class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14"
                    :style="{ backgroundImage: `url(${product.image})` }"
                  ></div>
                  <div class="flex-grow">
                    <p class="font-bold text-content-light dark:text-content-dark">{{ product.name }}</p>
                    <p class="text-sm text-subtle-light dark:text-subtle-dark">${{ product.price.toFixed(2) }}</p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      v-if="mode === 'create'"
                      @click="updateQuantity(index, -1)"
                      class="size-6 rounded-full bg-primary/20 dark:bg-primary/30 text-primary flex items-center justify-center"
                      :disabled="product.quantity <= 1"
                    >
                      -
                    </button>
                    <span class="font-bold text-content-light dark:text-content-dark w-4 text-center">{{
                      product.quantity
                    }}</span>
                    <button
                      v-if="mode === 'create'"
                      @click="updateQuantity(index, 1)"
                      class="size-6 rounded-full bg-primary/20 dark:bg-primary/30 text-primary flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <!-- Summary Section -->
            <section>
              <h3 class="text-xl font-bold text-content-light dark:text-content-dark mb-3">Resumen</h3>
              <div class="p-4 rounded-lg bg-surface-light dark:bg-surface-dark space-y-3">
                <div class="flex justify-between items-center">
                  <p class="text-subtle-light dark:text-subtle-dark">Subtotal</p>
                  <p class="font-medium text-content-light dark:text-content-dark">${{ subtotal.toFixed(2) }}</p>
                </div>
                <div class="flex justify-between items-center">
                  <p class="text-subtle-light dark:text-subtle-dark">Impuestos (21%)</p>
                  <p class="font-medium text-content-light dark:text-content-dark">${{ taxes.toFixed(2) }}</p>
                </div>
                <div class="border-t border-subtle-light/20 dark:border-subtle-dark/20 my-2"></div>
                <div class="flex justify-between items-center">
                  <p class="font-bold text-content-light dark:text-content-dark">Total</p>
                  <p class="font-bold text-xl text-content-light dark:text-content-dark">${{ total.toFixed(2) }}</p>
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
              :disabled="!saleData.clientName || !saleData.products.length"
            >
              Guardar Venta
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
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

const saleData = ref({
  clientName: props.sale.clientName || '',
  clientAddress: props.sale.clientAddress || '',
  products: props.sale.products || [
    {
      name: 'Rosa',
      price: 15000.0,
      quantity: 1,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB9Z5pvN9wCPjCqlbwiUCKWjIcexul9t9QqfZ2m5PNPQaTKw3_SwVgyb56cj_f_zbulbCCSzL0qL91xFmjLteQRS6H4YrpyJ0UUwXxYl6feXqwEys4ODJHTGXJ9iDTUgllcnL7rtHBYvi60RsqrjPwAgdKzuL9knrC55TW7DLQGshB1DW8ChlIFCxS_oLb-jpUvVwtjRWnyRdIKknPY3lY-9J-7F6pAniujmkFZ70DzWzu9rKnRrWg7h35UZt9Sdig2oEN-aC7zE0rf',
    },
    {
      name: 'Tulipán',
      price: 1200.0,
      quantity: 2,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuArcqjd6W7dx_RITCll53wEef4aX6RVaCsc9NmQFXpbrGPAjeKqBMSb_Mfc-j4y9fQS2U0BFjvB7m94nP5d7vauQ3JSAJjr5VQ-hoABKw9uMb9wa2lfpVCZqDJemkUnWEXwqmP1QdbKBkuqtuc-i2bz2i0iz51QrTgL8syCnimsmlpKe6XOhtRB4mx5B0sl5g3dA5YHe1ZvXNAAm8QOFsGsY93yGQOLd77lL1jlM1iXlo7jGy7tg0EJPDIg1E5x21NHjktVqyfruNch',
    },
    {
      name: 'Lirio',
      price: 1000.0,
      quantity: 1,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBzHtc8eXFd1_NIPdgfu4L82NubnTbnHHsTxzCmGlZ2zPeuDy_vQqyK1anOBGK20T23xATijho_9chUZr113Cn-Auhw56MlANS0719AbFW7Fy4_Is8dWMMKMP7EyhDOjjM2HWxSUoMlUaUmte3egYZTZi-l8QN-aJZpxyAbsuYcQYWPe_75KxyV2T6Wdgv17wcELxevT620FL9q6lCyCaf6b8-wGWCZ94ER1nGAnFNo9aNES3E1OKRGwRMzh5xJ9luM7Btywv-blPb2',
    },
  ],
});

// Computed properties for summary
const subtotal = computed(() =>
  saleData.value.products.reduce((sum, product) => sum + product.price * product.quantity, 0)
);
const taxes = computed(() => subtotal.value * 0.21);
const total = computed(() => subtotal.value + taxes.value);

// Methods
const closeModal = () => {
  emit('update:isOpen', false);
};

const openProductSelector = () => {
  // Placeholder for product selection logic (e.g., open another modal or dropdown)
  console.log('Open product selector');
  // Example: Add a new product
  // saleData.value.products.push({ name: 'Nuevo Producto', price: 10.0, quantity: 1, image: '...' });
};

const updateQuantity = (index, change) => {
  const newQuantity = saleData.value.products[index].quantity + change;
  if (newQuantity >= 1) {
    saleData.value.products[index].quantity = newQuantity;
  }
};

const submitSale = () => {
  emit('submit', saleData.value);
  closeModal();
};
</script>

<style scoped>
/* Ensure Material Symbols are styled */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>