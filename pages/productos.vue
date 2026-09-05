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
    <section class="py-6 border-b border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky shadow-sm">
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
          <!-- Barra de estado y contador de productos -->
          <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400">
              Mostrando <span class="font-bold text-slate-900 dark:text-white">{{ filteredProducts.length }}</span> productos
              <span
                v-if="dbProducts.length > 0"
                class="ml-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 shadow-sm"
              >
                <Icon name="heroicons:circle-stack" class="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                {{ dbProducts.length }} cargados desde base de datos
              </span>
            </p>
          </div>

          <!-- Cuadrícula de productos con el componente reutilizable ProductCard -->
          <div v-if="filteredProducts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
            <ProductCard 
              v-for="product in filteredProducts" 
              :key="product.id"
              :product="product"
              @add="handleAddToCart"
              @toggle-favorite="handleToggleFavorite"
            />
          </div>
 
          <!-- Empty state si la búsqueda o filtro no arroja resultados -->
          <div v-else class="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div class="text-slate-400 mb-4">
              <Icon name="heroicons:shopping-bag" class="w-16 h-16 mx-auto text-emerald-500 animate-bounce" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No se encontraron productos</h3>
            <p class="text-slate-500 dark:text-slate-400">Probá filtrando por otra categoría o modificando el término de búsqueda.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Notificación flotante al agregar al carrito -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-4 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="cartToast.show"
        class="fixed bottom-24 right-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-950/95 text-white px-5 py-3.5 shadow-2xl backdrop-blur-md border border-emerald-600/50"
        role="alert"
      >
        <Icon name="heroicons:check-circle" class="h-6 w-6 text-emerald-400 flex-shrink-0" />
        <div>
          <p class="text-[10px] text-emerald-300 font-black uppercase tracking-wider">Presupuesto actualizado</p>
          <p class="text-sm font-medium">{{ cartToast.message }}</p>
        </div>
        <button 
          type="button" 
          @click="isCartOpen = true; cartToast.show = false" 
          class="ml-2 px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-colors border border-emerald-500/30 cursor-pointer"
        >
          Ver lista
        </button>
      </div>
    </Transition>

    <!-- Botón flotante para abrir el carrito / presupuesto -->
    <button 
      type="button"
      @click="isCartOpen = true"
      class="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 border border-emerald-400/40 backdrop-blur-md group cursor-pointer"
      aria-label="Abrir mi presupuesto"
    >
      <div class="relative">
        <Icon name="heroicons:shopping-bag" class="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
        <span 
          v-if="totalCartItems > 0" 
          class="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md animate-pulse"
        >
          {{ totalCartItems }}
        </span>
      </div>
      <span class="hidden sm:inline font-bold text-sm tracking-wide">
        Mi Presupuesto
      </span>
      <span v-if="totalCartItems > 0" class="hidden sm:inline text-xs font-semibold bg-emerald-700/60 px-2 py-0.5 rounded-full text-emerald-100">
        ${{ cartTotal.toLocaleString('es-AR') }}
      </span>
    </button>

    <!-- Panel lateral (Drawer) de Carrito / Presupuesto -->
    <Teleport to="body">
      <div v-if="isCartOpen" class="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
        <!-- Backdrop difuminado -->
        <div 
          class="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
          @click="isCartOpen = false"
        ></div>

        <div class="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <div class="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col h-full text-slate-800 dark:text-slate-100 z-10">
            <!-- Encabezado del Carrito -->
            <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/50">
              <div class="flex items-center gap-2.5">
                <div class="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon name="heroicons:clipboard-document-list" class="w-5 h-5" />
                </div>
                <div>
                  <h2 class="text-lg font-black text-slate-900 dark:text-white">Tu Presupuesto</h2>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ totalCartItems }} {{ totalCartItems === 1 ? 'planta seleccionada' : 'plantas seleccionadas' }}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                @click="isCartOpen = false" 
                class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Cerrar presupuesto"
              >
                <Icon name="heroicons:x-mark" class="w-6 h-6" />
              </button>
            </div>

            <!-- Lista de productos en el carrito -->
            <div class="flex-1 overflow-y-auto p-5 space-y-4">
              <!-- Estado vacío -->
              <div v-if="cart.length === 0" class="text-center py-16 px-4 flex flex-col items-center">
                <div class="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-4">
                  <Icon name="heroicons:shopping-bag" class="w-8 h-8" />
                </div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white mb-1">Tu lista está vacía</h3>
                <p class="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
                  Agregá las plantas que te interesen para armar tu lista y consultar stock por WhatsApp.
                </p>
                <button 
                  type="button"
                  @click="isCartOpen = false" 
                  class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md transition-colors cursor-pointer"
                >
                  Explorar catálogo
                </button>
              </div>

              <!-- Items del carrito -->
              <div v-else class="divide-y divide-slate-100 dark:divide-slate-800">
                <div 
                  v-for="(item, index) in cart" 
                  :key="item.id" 
                  class="py-4 first:pt-0 last:pb-0 flex items-center gap-3.5"
                >
                  <!-- Imagen miniatura -->
                  <img 
                    :src="item.image" 
                    :alt="item.name" 
                    class="w-16 h-16 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200/60 dark:border-slate-700/60 shadow-xs" 
                  />

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {{ item.name }}
                    </h4>
                    <p v-if="item.scientificName" class="text-xs italic text-slate-500 dark:text-slate-400 truncate font-serif">
                      {{ item.scientificName }}
                    </p>
                    <p class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      ${{ item.price.toLocaleString('es-AR') }} c/u
                    </p>

                    <!-- Controles de cantidad -->
                    <div class="flex items-center gap-3 mt-2">
                      <div class="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 overflow-hidden">
                        <button 
                          type="button"
                          @click="updateQuantity(index, -1)" 
                          class="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors cursor-pointer"
                          aria-label="Disminuir cantidad"
                        >
                          -
                        </button>
                        <span class="px-2.5 text-xs font-black min-w-[24px] text-center text-slate-900 dark:text-white">
                          {{ item.quantity }}
                        </span>
                        <button 
                          type="button"
                          @click="updateQuantity(index, 1)" 
                          class="px-2.5 py-1 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors cursor-pointer"
                          aria-label="Aumentar cantidad"
                        >
                          +
                        </button>
                      </div>
                      <span class="text-sm font-black text-slate-900 dark:text-white">
                        ${{ (item.price * item.quantity).toLocaleString('es-AR') }}
                      </span>
                    </div>
                  </div>

                  <!-- Botón borrar item -->
                  <button 
                    type="button"
                    @click="removeFromCart(index)" 
                    class="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Eliminar de la lista"
                  >
                    <Icon name="heroicons:trash" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Footer del Carrito / Acción de WhatsApp -->
            <div v-if="cart.length > 0" class="p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 space-y-3.5">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Estimado:</span>
                <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  ${{ cartTotal.toLocaleString('es-AR') }}
                </span>
              </div>

              <!-- Botón WhatsApp hacia Romy -->
              <button 
                type="button"
                @click="sendWhatsApp"
                class="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 px-4 rounded-2xl font-bold flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all active:scale-98 cursor-pointer"
              >
                <Icon name="mdi:whatsapp" class="w-5 h-5" />
                <span>Pedir presupuesto a Romy por WhatsApp</span>
              </button>

              <div class="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
                <span>Consulta de stock sin compromiso</span>
                <button 
                  type="button"
                  @click="clearCart" 
                  class="text-rose-500 hover:underline hover:text-rose-600 cursor-pointer"
                >
                  Vaciar lista
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

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

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import type { PlantProduct } from '~/components/ProductCard.vue'

const img = useImage()

// --- TIPOS Y ESTADO DEL PRESUPUESTO / CARRITO ---
export interface CartItem {
  id: string | number
  name: string
  scientificName?: string
  price: number
  image: string
  category: string
  quantity: number
}

const CART_STORAGE_KEY = 'vivero_presupuesto'
const cart = ref<CartItem[]>([])
const isCartOpen = ref(false)

// Guardar automáticamente cada vez que cambie el carrito en localStorage
watch(
  cart,
  (newCart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart))
    } catch (e) {
      console.error('Error guardando presupuesto local:', e)
    }
  },
  { deep: true }
)

const cartTotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
})

const totalCartItems = computed(() => {
  return cart.value.reduce((acc, item) => acc + item.quantity, 0)
})

const updateQuantity = (index: number, change: number) => {
  const item = cart.value[index]
  if (!item) return
  const newQty = item.quantity + change
  if (newQty > 0) {
    item.quantity = newQty
  } else {
    removeFromCart(index)
  }
}

const removeFromCart = (index: number) => {
  cart.value.splice(index, 1)
}

const clearCart = () => {
  cart.value = []
}

// Enviar mensaje con el listado a Romy por WhatsApp
const sendWhatsApp = () => {
  const phone = '5491151165807' // WhatsApp oficial de Romy en Vivero Emma
  let text = '¡Hola Romy! 🌱 Estuve viendo el catálogo en la web de Vivero Emma y me interesan las siguientes plantas:\n\n'

  cart.value.forEach(item => {
    const subtotal = (item.price * item.quantity).toLocaleString('es-AR')
    text += `✅ *${item.quantity}x ${item.name}* ($${subtotal})\n`
  })

  const totalFormatted = cartTotal.value.toLocaleString('es-AR')
  text += `\n💰 *Total estimado: $${totalFormatted}*\n\n`
  text += '¿Seguís teniendo en stock estas plantas y a este precio?\n'
  text += '¡Muchas gracias!'

  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(text)}`
  window.open(url, '_blank')
}

const filters = reactive({
  search: '',
  category: '',
  sort: 'popular',
  price: ''
})

const isCatalogLoading = ref(true)
const dbProducts = ref<PlantProduct[]>([])

// Notificación de carrito
const cartToast = reactive({
  show: false,
  message: ''
})

let toastTimeout: ReturnType<typeof setTimeout> | null = null

const handleAddToCart = (product: PlantProduct) => {
  const existing = cart.value.find(item => String(item.id) === String(product.id))
  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({
      id: product.id,
      name: product.commonName,
      scientificName: product.scientificName,
      price: product.price,
      image: product.image,
      category: product.category,
      quantity: 1
    })
  }

  if (toastTimeout) clearTimeout(toastTimeout)
  cartToast.message = `"${product.commonName}" se agregó a tu presupuesto.`
  cartToast.show = true
  toastTimeout = setTimeout(() => {
    cartToast.show = false
  }, 3500)
}

const handleToggleFavorite = (productId: string | number, isFav: boolean) => {
  console.log(`Producto ${productId} favorito: ${isFav}`)
}

// 1. PRODUCTOS ESTÁTICOS BASE DE ALTA CALIDAD
const staticProducts: PlantProduct[] = [
  {
    id: 'static-1',
    category: 'Plantas de interior',
    commonName: 'Monstera Deliciosa',
    scientificName: 'Monstera deliciosa Liebm.',
    price: 13000,
    originalPrice: 15500,
    discountPercent: 16,
    stock: 12,
    image: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg',
    imageAlt: 'Monstera Deliciosa en maceta',
    watering: { level: 2, label: 'Riego medio' },
    light: { type: 'partial', label: 'Semisombra' },
    temperature: '18° - 27° C'
  },
  {
    id: 'static-2',
    category: 'Plantas de interior',
    commonName: 'Sansevieria',
    scientificName: 'Sansevieria trifasciata',
    price: 8500,
    originalPrice: 11800,
    discountPercent: 15,
    stock: 5,
    image: 'https://images.pexels.com/photos/2123482/pexels-photo-2123482.jpeg',
    imageAlt: 'Sansevieria trifasciata espada de San Jorge',
    watering: { level: 1, label: 'Riego escaso' },
    light: { type: 'partial', label: 'Luz indirecta' },
    temperature: '15° - 29° C'
  },
  {
    id: 'static-3',
    category: 'Herramientas',
    commonName: 'Kit de Jardinería Premium',
    scientificName: 'Herramientas manuales de acero forjado',
    price: 20800,
    stock: 6,
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg',
    imageAlt: 'Kit de herramientas de jardinería',
    watering: { level: 1, label: 'Acero inox.' },
    light: { type: 'direct', label: 'Uso exterior' },
    temperature: 'Todo clima'
  },
  {
    id: 'static-4',
    category: 'Flores',
    commonName: 'Rosas Rojas Holandesas',
    scientificName: 'Rosa gallica L.',
    price: 4200,
    stock: 8,
    image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg',
    imageAlt: 'Rosas rojas en floración',
    watering: { level: 3, label: 'Riego frecuente' },
    light: { type: 'direct', label: 'Pleno sol' },
    temperature: '15° - 25° C'
  }
]

// 2. MAPPER DE PRODUCTOS DESDE LA BASE DE DATOS A LA TARJETA
const mapDbProductToCard = (dbItem: any): PlantProduct => {
  let commonName = dbItem.name || 'Planta de vivero'
  let scientificName = 'Especie botánica'

  // Si el nombre viene en formato "Nombre Botánico (Nombre Común)"
  const match = dbItem.name?.match(/^(.*?)\s*\((.*?)\)$/)
  if (match) {
    scientificName = match[1].trim()
    commonName = match[2].trim()
  } else if (dbItem.name?.includes('-')) {
    const parts = dbItem.name.split('-')
    commonName = parts[0].trim()
    scientificName = parts[1].trim()
  }

  // Normalizar categoría
  let cat = (dbItem.category || 'Plantas').trim()
  if (cat.toLowerCase() === 'planta') {
    cat = 'Plantas'
  } else {
    cat = cat.charAt(0).toUpperCase() + cat.slice(1)
  }

  // Deducción inteligente de cuidados si no vienen en la BD
  const isCactusOrSucculent = /suculenta|cactus|sansevieria|crasa/i.test(dbItem.name || '')
  const isOutdoorOrTree = /árbol|arbol|exterior|rosa|palmera|jazmín|jazmin/i.test(`${dbItem.name} ${dbItem.category}`)

  const wateringLevel = isCactusOrSucculent ? 1 : isOutdoorOrTree ? 3 : 2
  const wateringLabel = wateringLevel === 1 ? 'Riego escaso' : wateringLevel === 3 ? 'Riego frecuente' : 'Riego moderado'
  const lightType = isOutdoorOrTree ? 'direct' : 'partial'
  const lightLabel = isOutdoorOrTree ? 'Pleno sol' : 'Semisombra'

  return {
    id: `db-${dbItem.id}`,
    category: cat,
    commonName,
    scientificName,
    price: Math.round(Number(dbItem.precio_venta) || 0),
    stock: dbItem.stock ?? 1,
    image: dbItem.image_url || '/placeholder.png',
    imageAlt: dbItem.name || commonName,
    watering: {
      level: wateringLevel as 1 | 2 | 3,
      label: wateringLabel
    },
    light: {
      type: lightType,
      label: lightLabel
    },
    temperature: '16° - 26° C'
  }
}

// 3. OBTENCIÓN DE DATOS REALES DE LA BASE DE DATOS
const fetchDatabaseProducts = async () => {
  try {
    const response = await $fetch<{ success?: boolean; data?: any[] }>('/api/products')
    if (response?.success && Array.isArray(response.data)) {
      dbProducts.value = response.data.map(mapDbProductToCard)
    } else if (Array.isArray(response)) {
      dbProducts.value = (response as any[]).map(mapDbProductToCard)
    }
  } catch (error) {
    console.warn('Fallo petición a /api/products, intentando fallback directo...', error)
    try {
      const fallback = await $fetch<{ success?: boolean; data?: any[] }>('https://inventario-fabrica-backend.onrender.com/api/products')
      if (fallback?.success && Array.isArray(fallback.data)) {
        dbProducts.value = fallback.data.map(mapDbProductToCard)
      }
    } catch (fallbackError) {
      console.error('No se pudo conectar a la base de datos de productos:', fallbackError)
    }
  } finally {
    isCatalogLoading.value = false
  }
}

onMounted(() => {
  fetchDatabaseProducts()

  // Cargar presupuesto guardado de la sesión anterior
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY)
    if (saved) {
      cart.value = JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error cargando presupuesto local:', e)
  }
})

// 4. UNIÓN DE PRODUCTOS ESTÁTICOS + BASE DE DATOS
const allProducts = computed<PlantProduct[]>(() => {
  return [...staticProducts, ...dbProducts.value]
})

// 5. CATEGORÍAS DINÁMICAS (combinadas de estáticos y base de datos)
const categories = computed(() => {
  const set = new Set<string>()
  allProducts.value.forEach(p => {
    if (p.category) set.add(p.category)
  })
  return Array.from(set).sort()
})

// 6. FILTRADO Y ORDENAMIENTO REACTIVO
const filteredProducts = computed(() => {
  let list = allProducts.value

  // Filtro por búsqueda
  if (filters.search.trim()) {
    const query = filters.search.toLowerCase().trim()
    list = list.filter(p =>
      p.commonName.toLowerCase().includes(query) ||
      p.scientificName.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    )
  }

  // Filtro por categoría
  if (filters.category) {
    list = list.filter(p => p.category.toLowerCase() === filters.category.toLowerCase())
  }

  // Filtro por rango de precio
  if (filters.price) {
    if (filters.price === '0-1000') {
      list = list.filter(p => p.price <= 1000)
    } else if (filters.price === '1000-5000') {
      list = list.filter(p => p.price > 1000 && p.price <= 5000)
    } else if (filters.price === '5000+') {
      list = list.filter(p => p.price > 5000)
    }
  }

  // Ordenamiento
  if (filters.sort === 'price-asc') {
    list = [...list].sort((a, b) => a.price - b.price)
  } else if (filters.sort === 'price-desc') {
    list = [...list].sort((a, b) => b.price - a.price)
  } else if (filters.sort === 'newest') {
    list = [...list].reverse()
  }

  return list
})

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
]
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