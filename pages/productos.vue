<template>
  <div class="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
    <!-- Hero section con efecto fluido de fondo -->
    <section class="relative overflow-hidden bg-gradient-to-b from-emerald-900/10 via-emerald-800/5 to-transparent py-14">
      <div class="container-custom relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3 shadow-sm">
          💧 Catálogo Vivo & Orgánico
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
          Nuestros Productos
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
          Descubrí nuestra cuidada selección de plantas, sustratos y macetas con frescura directa de invernadero.
        </p>
      </div>

      <!-- Gotas viscosas decorativas en el hero -->
      <div class="absolute -top-10 right-10 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div class="absolute top-20 left-1/3 w-60 h-60 bg-teal-400/15 rounded-full blur-3xl pointer-events-none"></div>
    </section>

    <!-- Filters Bar -->
    <section class="border-y border-slate-200 bg-white py-3 dark:border-slate-800 dark:bg-slate-900 sm:py-4">
      <div class="container-custom">
        <div class="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
          <div>
            <input 
              type="text" 
              placeholder="🔍 Buscar especies o herramientas..." 
              class="input w-full bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500/50"
              v-model="filters.search"
            />
          </div>
          <div>
            <select v-model="filters.category" class="input w-full bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <select v-model="filters.sort" class="input w-full bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl">
              <option value="popular">Más populares</option>
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: Menor a mayor</option>
              <option value="price-desc">Precio: Mayor a menor</option>
            </select>
          </div>
          <div>
            <select v-model="filters.price" class="input w-full bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 rounded-xl">
              <option value="">Todos los precios</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-5000">$1,000 - $5,000</option>
              <option value="5000+">$5,000+</option>
            </select>
          </div>
        </div>
      </div>
    </section>

    <!-- Products grid con tarjetas con deformación líquida (Morphing) -->
    <section class="py-12">
      <div class="container-custom">
        <div v-if="isCatalogLoading" class="flex min-h-[24rem] items-center justify-center rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xl backdrop-blur">
          <ThinkingOrbsLoader label="Cargando frescura..." />
        </div>

        <div v-else>
          <div v-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            <ProductCard
              v-for="product in products" 
              :key="product.id"
              :product="product"
              @add="handleAddToCart"
            />
          </div>
 
          <!-- Empty state -->
          <div v-else class="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div class="text-slate-400 mb-4">
              <Icon name="heroicons:shopping-bag" class="w-16 h-16 mx-auto text-emerald-500 animate-bounce" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No se encontraron productos</h3>
            <p class="text-slate-500 dark:text-slate-400">Probá filtrando por otra categoría o término de búsqueda.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section con animaciones de resina -->
    <section class="py-14 bg-emerald-950/5 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div class="container-custom">
        <h2 class="text-3xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">Categorías Populares</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="category in featuredCategories" 
            :key="category.name" 
            class="liquid-card relative rounded-3xl overflow-hidden group cursor-pointer h-72 shadow-xl border border-slate-200 dark:border-slate-800"
          >
            <NuxtImg
              :src="category.image" 
              provider="none"
              :alt="category.name"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
              sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw, (min-width: 1024px) 33vw"
              :placeholder="img(`placeholder.png`, { h: 10, f: 'png', blur: 2, q: 50 })"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex items-end p-6">
              <div class="text-white relative z-10">
                <span class="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-xs font-bold mb-2 backdrop-blur">
                  {{ category.count }} variedades
                </span>
                <h3 class="text-2xl font-black mb-1 group-hover:text-emerald-400 transition-colors">{{ category.name }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import type { ProductCardData } from '~/components/ProductCard.vue';
import { useProductStore, type Product } from '~/stores/products';
const img = useImage();
const productStore = useProductStore();

const filters = reactive({
  search: '',
  category: '',
  sort: 'popular',
  price: ''
});

const isCatalogLoading = ref(true);

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

const staticProducts: ProductCardData[] = [
  {
    id: 1,
    commonName: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa',
    category: 'Plantas de interior',
    price: 13000,
    image: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg',
    imageAlt: 'Monstera deliciosa de interior',
    watering: { level: 2, label: 'Riego medio' },
    light: { icon: 'heroicons:sun', label: 'Semisombra' },
    temperature: '18-27 °C'
  },
  {
    id: 2,
    commonName: 'Sansevieria',
    scientificName: 'Dracaena trifasciata',
    category: 'Plantas de interior',
    price: 8500,
    image: 'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg',
    imageAlt: 'Sansevieria en maceta',
    watering: { level: 1, label: 'Riego bajo' },
    light: { icon: 'heroicons:sun', label: 'Luz indirecta' },
    temperature: '15-30 °C'
  },
  {
    id: 3,
    commonName: 'Kit de Jardinería',
    scientificName: 'Accesorios para cultivo',
    category: 'Herramientas',
    price: 20800,
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
    imageAlt: 'Herramientas de jardinería',
    watering: { level: 1, label: 'Sin riego' },
    light: { icon: 'heroicons:cloud', label: 'No aplica' },
    temperature: 'Uso exterior'
  },
  {
    id: 4,
    commonName: 'Rosas Rojas',
    scientificName: 'Rosa spp.',
    category: 'Flores',
    price: 4200,
    image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg',
    imageAlt: 'Rosas rojas en flor',
    watering: { level: 3, label: 'Riego alto' },
    light: { icon: 'heroicons:sun', label: 'Luz directa' },
    temperature: '15-25 °C'
  }
];

const parsePrice = (value: number | string) => {
  if (typeof value === 'number') return value;
  return Number(value) || 0;
};

const mapDatabaseProduct = (product: Product): ProductCardData => ({
  id: product.id,
  commonName: product.name,
  scientificName: product.name,
  category: product.category || 'Plantas',
  price: parsePrice(product.precio_venta),
  image: product.image_url || 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg',
  imageAlt: product.name,
  watering: { level: 2, label: 'Riego medio' },
  light: { icon: 'heroicons:sun', label: 'Semisombra' },
  temperature: '18-27 °C'
});

const products = computed<ProductCardData[]>(() => {
  const merged = new Map<string | number, ProductCardData>();

  staticProducts.forEach((product) => merged.set(product.id, product));
  productStore.getProducts
    .filter((product) => product.publicado === true)
    .map(mapDatabaseProduct)
    .forEach((product) => merged.set(product.id, product));

  return Array.from(merged.values());
});

const handleAddToCart = (product: ProductCardData) => {
  console.info('Producto añadido al carrito:', product.id);
};

onMounted(async () => {
  try {
    await productStore.fetchProducts();
  } catch (error) {
    console.warn('No se pudieron cargar productos de la base de datos:', error);
  } finally {
    isCatalogLoading.value = false;
  }
});
</script>

<style scoped>
/* Tarjetas con deformación líquida orgánica (Morphing Radius) */
.liquid-card {
  border-radius: 24px;
  transition: border-radius 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 400ms ease, box-shadow 400ms ease;
}

.liquid-card:hover {
  border-radius: 40px 18px 45px 20px / 20px 42px 18px 45px;
  transform: translateY(-6px);
}

/* Efecto de destello viscoso (Glass Shine) */
.liquid-shine {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%);
}
</style>