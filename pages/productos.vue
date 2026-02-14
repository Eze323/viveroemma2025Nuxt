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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.id" 
            class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="relative overflow-hidden w-full h-64 md:h-72">
              <NuxtImg
                :src="product.image" 
                :alt="product.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
                sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw, (min-width: 1024px) 33vw"
                :placeholder="img(`placeholder.png`, { h: 10, f: 'png', blur: 2, q: 50 })"
              />
              <div v-if="product.discount" 
                class="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded text-sm font-medium">
                -{{ product.discount }}%
              </div>
            </div>
            <div class="p-4">
              <div class="mb-2">
                <span class="text-sm text-gray-500">{{ product.category }}</span>
                <h3 class="text-lg font-bold text-gray-900">{{ product.name }}</h3>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xl font-bold text-primary">${{ product.price }}</span>
                  <span v-if="product.oldPrice" class="text-sm text-gray-500 line-through ml-2">
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
        <div v-if="products.length === 0" class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <Icon name="heroicons:shopping-bag" class="w-16 h-16 mx-auto" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron productos</h3>
          <p class="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
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
import { ref, reactive } from 'vue';
const img = useImage()
import placeHolderImg from '@/assets/images/placeholder.png'
// Filters state
const filters = reactive({
  search: '',
  category: '',
  sort: 'popular',
  price: ''
});

const newsletterEmail = ref('');

// Categories computed dynamically from available products
const categories = computed(() => {
  if (!productsData.value?.data) return [];
  const uniqueCategories = new Set(productsData.value.data.map(p => p.category));
  return Array.from(uniqueCategories).sort();
});

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
const { data: productsData, status, error } = await useFetch('/api/products/public');

const products = computed(() => {
  if (!productsData.value?.data) return [];
  
  let result = productsData.value.data.map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.precio_venta),
    oldPrice: null, 
    discount: null, 
    image: product.image_url || 'https://via.placeholder.com/300x300?text=Sin+Imagen' 
  }));

  // Filtering
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(searchLower));
  }

  if (filters.category) {
    result = result.filter(p => p.category === filters.category);
  }

  if (filters.price) {
    if (filters.price === '5000+') {
       result = result.filter(p => p.price >= 5000);
    } else {
       const [min, max] = filters.price.split('-').map(Number);
       if (!isNaN(min) && !isNaN(max)) {
         result = result.filter(p => p.price >= min && p.price <= max);
       }
    }
  }

  // Sorting
  switch (filters.sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      result.sort((a, b) => b.id - a.id); // Assuming higher ID is newer
      break;
    // 'popular' could be default or based on sales if available
  }

  return result;
});

// Newsletter subscription
const subscribeNewsletter = () => {
  // Here you would typically make an API call to handle the subscription
  // console.log('Subscribing email:', newsletterEmail.value);
  // Reset form
  newsletterEmail.value = '';
};
</script>