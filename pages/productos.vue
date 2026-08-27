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
    <section class="py-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-[61px] z-20 shadow-sm">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <div 
              v-for="product in products" 
              :key="product.id"
              class="liquid-card group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <!-- Destello de resina líquida (Viscous Glass Shine) -->
              <div class="liquid-shine absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>

              <div class="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                <NuxtImg
                  :src="product.image"
                  :alt="product.name"
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  :class="{ 'opacity-0 scale-105': !isProductImageLoaded(product.id) }"
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 640px) 100vw, (min-width: 641px) 50vw, (min-width: 1024px) 33vw"
                  :placeholder="img(`placeholder.png`, { h: 10, f: 'png', blur: 2, q: 50 })"
                  @load="markProductImageLoaded(product.id)"
                  @error="markProductImageLoaded(product.id)"
                />
                
                <!-- Badge de Descuento Líquido Pulsante -->
                <div v-if="product.discount"
                  class="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-1 rounded-full text-xs font-black shadow-lg shadow-emerald-500/30 animate-pulse z-10"
                >
                  -{{ product.discount }}% OFF
                </div>
                
                <div v-if="!isProductImageLoaded(product.id)" class="absolute inset-0 flex items-center justify-center bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-[2px]">
                  <ThinkingOrbsLoader size="sm" label="Cargando..." />
                </div>

                <!-- Stock Badge Mini Redondeado en Esquina Superior Derecha -->
                <div class="absolute top-2 right-2 rounded-full border border-emerald-400/50 bg-slate-900/70 text-emerald-300 px-2 py-0.5 text-[10px] font-bold shadow-md backdrop-blur-md z-10">
                  {{ product.stock }} und.
                </div>
              </div>

              <!-- Contenido de la Tarjeta -->
              <div class="p-5 relative z-10">
                <div class="mb-2.5 flex items-center justify-between gap-2">
                  <span class="rounded-full bg-emerald-500/10 dark:bg-emerald-400/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                    {{ product.category }}
                  </span>
                  <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">{{ product.stock }} dispo.</span>
                </div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {{ product.name }}
                </h3>
                
                <div class="mt-4 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400">${{ product.price }}</span>
                    <span v-if="product.oldPrice" class="ml-2 text-xs text-slate-400 line-through">
                      ${{ product.oldPrice }}
                    </span>
                  </div>
                  
                  <button class="liquid-button relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-lg hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95">
                    <span class="relative z-10 flex items-center gap-1.5">
                      <span>Agregar</span>
                      <span>🛒</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
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

<script setup>
import { ref, reactive, onMounted } from 'vue';
const img = useImage();

const filters = reactive({
  search: '',
  category: '',
  sort: 'popular',
  price: ''
});

const isCatalogLoading = ref(true);
const productImageStates = ref({});

const markProductImageLoaded = (productId) => {
  productImageStates.value[productId] = true;
};

const isProductImageLoaded = (productId) => Boolean(productImageStates.value[productId]);

const getStockLabel = (stock) => {
  if (stock <= 0) return 'Agotado';
  if (stock < 10) return 'Últimos ejemplares';
  return 'En stock';
};

onMounted(() => {
  window.setTimeout(() => {
    isCatalogLoading.value = false;
  }, 700);
});

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