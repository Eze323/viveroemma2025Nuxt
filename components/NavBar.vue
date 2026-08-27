<template>
  <div class="flex flex-col bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
    <!-- SVG Filter Defs para el Navbar Líquido -->
    <svg class="absolute w-0 h-0 overflow-hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="navbar-gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 18 -8" 
            result="gooey" 
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </defs>
    </svg>

    <header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-emerald-100 dark:border-emerald-950 shadow-sm transition-all duration-300">
      <div class="container-custom flex justify-between items-center py-2.5">
        <!-- Logo con pulso biológico -->
        <NuxtLink to="/" class="flex items-center space-x-2 group">
          <div class="relative w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <span class="text-emerald-600 dark:text-emerald-400 text-lg">🌿</span>
            <div class="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping"></div>
          </div>
          <span class="text-emerald-900 dark:text-emerald-100 text-2xl font-black tracking-tight font-heading group-hover:text-emerald-600 transition-colors">
            Vivero Emma
          </span>
        </NuxtLink>
        
        <!-- Desktop Liquid Navigation -->
        <nav class="hidden md:flex items-center space-x-1 relative bg-emerald-50/70 dark:bg-emerald-950/40 p-1.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/40 shadow-inner">
          
          <!-- Liquid Blob Indicator -->
          <div class="navbar-gooey-layer absolute inset-0 pointer-events-none">
            <div 
              class="navbar-blob bg-emerald-600 text-white rounded-full transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] shadow-md"
              :style="blobStyle"
            ></div>
          </div>

          <NuxtLink 
            v-for="(item, index) in navItems" 
            :key="item.path" 
            :to="item.path"
            :ref="el => setItemRef(el, index)"
            @click="selectNav(index)"
            class="relative z-10 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-300"
            :class="route.path === item.path ? 'text-white' : 'text-gray-700 dark:text-gray-200 hover:text-emerald-600'"
          >
            {{ item.name }}
          </NuxtLink>

          <!-- Acceso extra a Demo Líquida -->
          <!-- <NuxtLink 
            to="/gooey-demo" 
            class="relative z-10 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500/20 border border-teal-500/30 transition-all ml-2"
          >
            ✨ Viscosidad
          </NuxtLink>-->
        </nav>

        <!-- Botón Iniciar Sesión -->
        <div class="hidden md:flex items-center space-x-4">
          <NuxtLink 
            to="/auth/login" 
            class="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-semibold text-white transition duration-300 ease-out bg-emerald-600 rounded-full shadow-md group hover:scale-105 active:scale-95"
          >
            <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500"></span>
            <span class="relative text-sm">Iniciar Sesión</span>
          </NuxtLink>
        </div>
        
        <!-- Mobile Navigation Button -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-gray-700 dark:text-gray-200 focus:outline-none p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <Icon v-if="!isMenuOpen" name="heroicons:bars-3" class="w-6 h-6 text-emerald-700" />
          <Icon v-else name="heroicons:x-mark" class="w-6 h-6 text-emerald-700" />
        </button>
      </div>
      
      <!-- Mobile Navigation Menu con Glassmorphism -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-if="isMenuOpen" class="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-emerald-100 shadow-xl">
          <div class="container-custom py-4 space-y-2">
            <NuxtLink 
              v-for="item in navItems" 
              :key="item.path" 
              :to="item.path" 
              class="block px-4 py-2.5 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 transition-colors"
              @click="isMenuOpen = false"
            >
              {{ item.name }}
            </NuxtLink>
            <NuxtLink 
              to="/gooey-demo" 
              class="block px-4 py-2.5 rounded-xl font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40"
              @click="isMenuOpen = false"
            >
              ✨ Efecto Viscoso Demo
            </NuxtLink>
            <NuxtLink 
              to="/auth/login" 
              class="block w-full text-center py-2.5 text-white font-bold bg-emerald-600 rounded-xl mt-4 shadow-md"
              @click="isMenuOpen = false"
            >
              Iniciar Sesión
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </header>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isMenuOpen = ref(false);

const navItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Productos', path: '/productos' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Contacto', path: '/contacto' }
];

const activeIndex = ref(0);
const itemRefs = ref([]);

const setItemRef = (el, index) => {
  if (el) itemRefs.value[index] = el;
};

const blobPos = ref({ left: 0, width: 0, height: 0 });

const updateBlobPosition = () => {
  const currentEl = itemRefs.value[activeIndex.value];
  if (currentEl) {
    blobPos.value = {
      left: currentEl.offsetLeft,
      width: currentEl.offsetWidth,
      height: currentEl.offsetHeight
    };
  }
};

const selectNav = (index) => {
  activeIndex.value = index;
  updateBlobPosition();
};

const blobStyle = computed(() => ({
  transform: `translate3d(${blobPos.value.left}px, 0, 0)`,
  width: `${blobPos.value.width}px`,
  height: `${blobPos.value.height}px`,
  top: '50%',
  marginTop: `-${blobPos.value.height / 2}px`
}));

watch(() => route.path, (newPath) => {
  const foundIndex = navItems.findIndex(item => item.path === newPath);
  if (foundIndex !== -1) {
    activeIndex.value = foundIndex;
    nextTick(updateBlobPosition);
  }
}, { immediate: true });

onMounted(() => {
  nextTick(() => {
    updateBlobPosition();
  });
  window.addEventListener('resize', updateBlobPosition);
});
</script>

<style scoped>
.navbar-gooey-layer {
  filter: url(#navbar-gooey);
  will-change: transform;
}

.navbar-blob {
  backface-visibility: hidden;
  perspective: 1000px;
  transform-style: preserve-3d;
}
</style>
