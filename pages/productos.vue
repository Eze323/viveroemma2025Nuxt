<template>
  <div class="relative min-h-screen">
    <button 
      @click="isCartOpen = true"
      class="fixed bottom-6 right-6 z-40 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 group"
    >
      <Icon name="heroicons:shopping-cart" class="w-6 h-6" />
      <span v-if="cart.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white">
        {{ cart.reduce((acc, item) => acc + item.quantity, 0) }}
      </span>
      <span class="hidden md:inline font-bold pr-2">Mi Presupuesto</span>
    </button>

    <div v-if="isCartOpen" class="fixed inset-0 z-50 overflow-hidden">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" @click="isCartOpen = false"></div>
      
      <div class="absolute inset-y-0 right-0 max-w-full flex">
        <div class="w-screen max-w-md bg-white shadow-xl flex flex-col translate-x-0 transition-transform">
          <div class="p-6 border-b flex justify-between items-center bg-gray-50">
            <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Icon name="heroicons:clipboard-document-list" class="text-green-600" />
              Tu Lista de Pedido
            </h2>
            <button @click="isCartOpen = false" class="text-gray-500 hover:text-black">
              <Icon name="heroicons:x-mark" class="w-6 h-6" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="cart.length === 0" class="text-center py-12">
              <Icon name="heroicons:archive-box" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p class="text-gray-500 font-medium">No has agregado plantas aún.</p>
              <button @click="isCartOpen = false" class="mt-4 text-green-600 font-bold text-sm">Explorar catálogo</button>
            </div>
            
            <div v-else class="space-y-4">
              <div v-for="(item, index) in cart" :key="item.id" class="flex gap-4 border-b pb-4 items-center">
                <img :src="item.image" class="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 leading-tight">{{ item.name }}</h4>
                  <div class="flex items-center gap-3 mt-2">
                    <div class="flex items-center border rounded-lg bg-gray-50">
                      <button @click="updateQuantity(index, -1)" class="px-2 py-1 text-green-600 font-bold">-</button>
                      <span class="px-2 text-sm font-bold min-w-[20px] text-center">{{ item.quantity }}</span>
                      <button @click="updateQuantity(index, 1)" class="px-2 py-1 text-green-600 font-bold">+</button>
                    </div>
                    <span class="text-sm font-bold text-gray-600">${{ item.price * item.quantity }}</span>
                  </div>
                </div>
                <button @click="removeFromCart(index)" class="text-gray-400 hover:text-red-500 transition-colors p-2">
                  <Icon name="heroicons:trash" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="cart.length > 0" class="p-6 border-t bg-gray-50 space-y-4">
            <div class="flex justify-between text-lg font-bold">
              <span class="text-gray-600">Total Estimado:</span>
              <span class="text-green-700 text-2xl">${{ cartTotal }}</span>
            </div>
            <button 
              @click="sendWhatsApp"
              class="w-full bg-green-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg active:scale-95"
            >
              <Icon name="logos:whatsapp-icon" class="w-5 h-5" />
              Pedir presupuesto por WhatsApp
            </button>
            <p class="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
              Consultaremos disponibilidad al enviar
            </p>
          </div>
        </div>
      </div>
    </div>

    <section class="bg-primary/5 py-12">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Nuestros Productos</h1>
        <p class="text-xl text-gray-600 max-w-2xl">
          Descubre nuestra amplia selección de plantas, flores y accesorios para jardinería.
        </p>
      </div>
    </section>

    <section class="py-8 border-b sticky top-0 bg-white/80 backdrop-blur-md z-30">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="text" placeholder="Buscar productos..." class="input w-full" v-model="filters.search" />
          <select v-model="filters.category" class="input w-full">
            <option value="">Todas las categorías</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="filters.sort" class="input w-full">
            <option value="popular">Más populares</option>
            <option value="newest">Más recientes</option>
            <option value="price-asc">Precio: Menor a mayor</option>
            <option value="price-desc">Precio: Mayor a menor</option>
          </select>
          <select v-model="filters.price" class="input w-full">
            <option value="">Todos los precios</option>
            <option value="0-1000">$0 - $1,000</option>
            <option value="1000-5000">$1,000 - $5,000</option>
            <option value="5000+">$5,000+</option>
          </select>
        </div>
      </div>
    </section>

    <section class="py-12">
      <div class="container-custom">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="product in products" :key="product.id" 
            class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col border border-gray-100">
            <div class="relative overflow-hidden w-full h-64">
              <NuxtImg
                :src="product.image_url" 
                :alt="product.name"
                class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
                :placeholder="img(`placeholder.png`, { h: 10, f: 'png', blur: 2, q: 50 })"
              />
            </div>
            <div class="p-4 flex flex-col flex-1">
              <span class="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">{{ product.category }}</span>
              <h3 class="text-lg font-bold text-gray-900 mb-4 line-clamp-1">{{ product.name }}</h3>
              
              <div class="mt-auto flex items-center justify-between">
                <span class="text-xl font-black text-gray-900">${{ product.price }}</span>
                <button 
                  @click="addToCart(product)"
                  class="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center gap-1"
                >
                  <Icon name="heroicons:plus-circle" class="w-5 h-5" />
                  Agregar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="products.length === 0" class="text-center py-12">
          <Icon name="heroicons:magnifying-glass" class="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 class="text-lg font-bold text-gray-900">No hay coincidencias</h3>
          <p class="text-gray-500">Prueba cambiando los filtros</p>
        </div>
      </div>
    </section>

    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
const img = useImage();

// --- LÓGICA DEL PRESUPUESTO ---
const cart = ref([]);
const isCartOpen = ref(false);

// Cargar carrito desde localStorage al iniciar
onMounted(() => {
  const saved = localStorage.getItem('vivero_presupuesto');
  if (saved) cart.value = JSON.parse(saved);
});

// Guardar automáticamente cada vez que cambie el carrito
watch(cart, (newVal) => {
  localStorage.setItem('vivero_presupuesto', JSON.stringify(newVal));
}, { deep: true });

const addToCart = (product) => {
  const item = cart.value.find(i => i.id === product.id);
  if (item) {
    item.quantity++;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
  // isCartOpen.value = true; // Opcional: abre el carrito al agregar
};

const updateQuantity = (index, change) => {
  const newQty = cart.value[index].quantity + change;
  if (newQty > 0) cart.value[index].quantity = newQty;
};

const removeFromCart = (index) => {
  cart.value.splice(index, 1);
};

const cartTotal = computed(() => {
  return cart.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});

const sendWhatsApp = () => {
  const phone = "5491151165807"; // REEMPLAZA CON TU WHATSAPP (código de país + número)
  let text = "¡Hola Vivero Emma! 🌱 Quiero consultar presupuesto por:\n\n";
  
  cart.value.forEach(item => {
    text += `✅ ${item.quantity}x ${item.name} ($${item.price * item.quantity})\n`;
  });
  
  text += `\n💰 *Total estimado: $${cartTotal.value}*`;
  text += "\n\n¿Tienen stock disponible de estos productos?";

  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
};

// --- LÓGICA DE PRODUCTOS Y FILTROS ---
const filters = reactive({ search: '', category: '', sort: 'popular', price: '' });
const newsletterEmail = ref('');

const { data: productsData } = await useFetch('/api/products/public');

const categories = computed(() => {
  if (!productsData.value?.data) return [];
  return Array.from(new Set(productsData.value.data.map(p => p.category))).sort();
});

const products = computed(() => {
  if (!productsData.value?.data) return [];
  
  let result = productsData.value.data.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    price: Number(p.precio_venta),
    image: p.image_url || 'https://via.placeholder.com/300x300?text=Sin+Imagen'
  }));

  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter(p => p.name.toLowerCase().includes(s));
  }
  if (filters.category) result = result.filter(p => p.category === filters.category);
  if (filters.price) {
    if (filters.price === '5000+') {
      result = result.filter(p => p.price >= 5000);
    } else {
      const [min, max] = filters.price.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }
  }

  if (filters.sort === 'price-asc') result.sort((a,b) => a.price - b.price);
  if (filters.sort === 'price-desc') result.sort((a,b) => b.price - a.price);
  if (filters.sort === 'newest') result.sort((a,b) => b.id - a.id);

  return result;
});

const featuredCategories = [
  { name: 'Plantas de interior', count: 45, image: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg' },
  { name: 'Flores', count: 32, image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg' },
  { name: 'Herramientas', count: 28, image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg' }
];

const subscribeNewsletter = () => { newsletterEmail.value = ''; };
</script>