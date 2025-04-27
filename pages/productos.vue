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
            <div class="aspect-w-1 aspect-h-1 relative overflow-hidden">
              <img 
                :src="product.image" 
                :alt="product.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
            <img 
              :src="category.image" 
              :alt="category.name"
              class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
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

// Filters state
const filters = reactive({
  search: '',
  category: '',
  sort: 'popular',
  price: ''
});

const newsletterEmail = ref('');

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
    price: 2500,
    image: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg'
  },
  {
    id: 2,
    name: 'Ficus Lyrata',
    category: 'Plantas de interior',
    price: 3200,
    oldPrice: 3800,
    discount: 15,
    image: 'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg'
  },
  {
    id: 3,
    name: 'Kit de Jardinería',
    category: 'Herramientas',
    price: 1800,
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg'
  },
  {
    id: 4,
    name: 'Rosas Rojas',
    category: 'Flores',
    price: 1200,
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