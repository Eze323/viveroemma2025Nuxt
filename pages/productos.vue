<template>
  <div>
    <!-- Hero section -->
    <section class="bg-primary/5 py-12">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Nuestros Productos</h1>
        <p class="text-xl text-gray-600 max-w-2xl">
          Descubre nuestra amplia selección de plantas, flores y accesorios para jardinería.
        </p>
      </div>
    </section>

    <!-- Filters -->
    <section class="py-8 border-b">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <input 
              type="text" 
              placeholder="Buscar productos..." 
              class="input w-full"
              v-model="filters.search"
            />
          </div>
          <div>
            <select v-model="filters.category" class="input w-full">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <select v-model="filters.sort" class="input w-full">
              <option value="popular">Más populares</option>
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: Menor a mayor</option>
              <option value="price-desc">Precio: Mayor a menor</option>
            </select>
          </div>
          <div>
            <select v-model="filters.price" class="input w-full">
              <option value="">Todos los precios</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000+">$5,000+</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Products grid -->
    <section class="py-12">
      <div class="container-custom">
        <div v-if="isCatalogLoading" class="flex min-h-[24rem] items-center justify-center rounded-2xl border border-gray-100 bg-white/80">
          <ThinkingOrbsLoader label="Preparando catálogo..." />
        </div>

        <div v-else>
          <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="product in products" :key="product.id"
              class="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 via-white to-gray-50">
                <NuxtImg
                  :src="product.image"
                  :alt="product.name"
                  class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                  :class="{ 'opacity-0 scale-105': !isProductImageLoaded(product.id) }"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw, (min-width: 1024px) 33vw"
                  :placeholder="img(`placeholder.png`, { h: 10, f: 'png', blur: 2, q: 50 })"
                  @load="markProductImageLoaded(product.id)"
                  @error="markProductImageLoaded(product.id)"
                />
                <div v-if="product.discount"
                  class="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded text-sm font-medium">
                  -{{ product.discount }}%
                </div>
                <div v-if="!isProductImageLoaded(product.id)" class="absolute inset-0 flex items-center justify-center bg-gray-50/90 backdrop-blur-[2px]">
                  <ThinkingOrbsLoader size="sm" label="Cargando imagen..." />
                </div>
                <div class="absolute left-3 top-3 rounded-full border border-white/80 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-sm backdrop-blur">
                  {{ getStockLabel(product.stock) }}
                </div>
              </div>
              <div class="p-4">
                <div class="mb-3 flex items-center justify-between gap-2">
                  <span class="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">{{ product.category }}</span>
                  <span class="text-xs font-medium text-gray-500">{{ product.stock }} und.</span>
                </div>
                <h3 class="text-lg font-bold text-gray-900">{{ product.name }}</h3>
                <div class="mt-4 flex items-center justify-between">
                  <div>
                    <span class="text-xl font-bold text-primary">${{ product.price }}</span>
                    <span v-if="product.oldPrice" class="ml-2 text-sm text-gray-500 line-through">
                      ${{ product.oldPrice }}
                    </span>
                  </div>
                  <button class="btn btn-primary text-sm">
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>
 
          <!-- Empty state -->
          <div v-else class="text-center py-12">
            <div class="text-gray-400 mb-4">
              <Icon name="heroicons:shopping-bag" class="w-16 h-16 mx-auto" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
            <p class="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories section -->
    <section class="py-12 bg-gray-50">
      <div class="container-custom">
        <h2 class="text-3xl font-bold text-gray-900 mb-8">Categorías populares</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="category in featuredCategories" :key="category.name" 
            class="relative rounded-lg overflow-hidden group cursor-pointer">
            <NuxtImg
              :src="category.image" 
              :alt="category.name"
              class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
                  
              sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw, (min-width: 1024px) 33vw"
              :placeholder="img(`placeholder.png`, { h: 10, f: 'png', blur: 2, q: 50 })"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <div class="text-white">
                <h3 class="text-xl font-bold mb-1">{{ category.name }}</h3>
                <p class="text-sm opacity-90">{{ category.count }} productos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-12">
      <div class="container-custom">
        <div class="bg-primary rounded-lg px-6 py-12 md:p-12">
          <div class="max-w-2xl mx-auto text-center">
            <h2 class="text-3xl font-bold text-white mb-4">¿Quieres recibir ofertas exclusivas?</h2>
            <p class="text-white/90 mb-8">
              Suscríbete a nuestro newsletter y recibe las últimas novedades y descuentos especiales.
            </p>
            <form @submit.prevent="subscribeNewsletter" class="flex gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Tu correo electrónico" 
                class="input flex-1"
                v-model="newsletterEmail"
              />
              <button type="submit" class="btn bg-white text-primary hover:bg-gray-100">
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
const img = useImage()
// Filters state
const filters = reactive({
  search: '',
  category: '',
  sort: 'popular',
  price: ''
});

const newsletterEmail = ref('');
const isCatalogLoading = ref(true)
const productImageStates = ref({})

const markProductImageLoaded = (productId) => {
  productImageStates.value[productId] = true
}

const isProductImageLoaded = (productId) => Boolean(productImageStates.value[productId])

const getStockLabel = (stock) => {
  if (stock <= 0) return 'Sin stock'
  if (stock < 10) return 'Últimas unidades'
  return 'En stock'
}

onMounted(() => {
  window.setTimeout(() => {
    isCatalogLoading.value = false
  }, 900)
})

// Categories
const categories = [
  'Plantas de interior',
  'Plantas de exterior',
  'Flores',
  'Árboles',
  'Semillas',
  'Herramientas',
  'Macetas',
  'Sustratos'
];

// Featured categories
const featuredCategories = [
  {
    name: 'Plantas de interior',
    count: 45,
    image: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg'
  },
  {
    name: 'Flores',
    count: 32,
    image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg'
  },
  {
    name: 'Herramientas',
    count: 28,
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg'
  }
];

// Products data
const products = ref([
  {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Plantas de interior',
    price: '13.000',
    stock: 12,
    image: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg'
  },
  {
    id: 2,
    name: 'Sansevieria',
    category: 'Plantas de interior',
    price: '8.500',
    oldPrice: '11.800',
    discount: 15,
    stock: 5,
    image: 'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg'
  },
  {
    id: 3,
    name: 'Kit de Jardinería',
    category: 'Herramientas',
    price: '20.800',
    stock: 0,
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg'
  },
  {
    id: 4,
    name: 'Rosas Rojas',
    category: 'Flores',
    price: '4.200',
    stock: 8,
    image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg'
  }
]);

// Newsletter subscription
const subscribeNewsletter = () => {
  // Here you would typically make an API call to handle the subscription
  console.log('Subscribing email:', newsletterEmail.value);
  // Reset form
  newsletterEmail.value = '';
};
</script>