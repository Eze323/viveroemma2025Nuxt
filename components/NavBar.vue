<template>
  <div class="flex flex-col font-display">
    <!-- SVG Filter Defs para el Navbar Líquido -->
    <svg class="absolute w-0 h-0 overflow-hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="navbar-gooey" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 20 -9" 
            result="gooey" 
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </defs>
    </svg>

    <header class="sticky top-0 z-40 bg-white/85 dark:bg-slate-950/85 backdrop-blur-xl border-b border-emerald-100/80 dark:border-emerald-950/80 shadow-sm transition-all duration-300">
      <div class="container-custom flex justify-between items-center py-2.5">
        <!-- Logo con pulso biológico y resplandor -->
        <NuxtLink to="/" class="flex items-center space-x-2.5 group">
          <div class="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-400/30 to-teal-500/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm">
            <span class="text-emerald-600 dark:text-emerald-400 text-xl">🌿</span>
            <div class="absolute inset-0 rounded-2xl bg-emerald-400/20 animate-ping"></div>
          </div>
          <span class="text-slate-900 dark:text-white text-2xl font-black tracking-tight font-heading group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            Vivero Emma
          </span>
        </NuxtLink>
        
        <!-- Desktop Navigation con Indicador Fluido Alineado al Milímetro -->
        <nav class="hidden md:flex items-center space-x-1 relative bg-slate-100/80 dark:bg-slate-900/80 p-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 shadow-inner">
          
          <!-- Capa del Indicador Líquido (Gooey Blob Desplazable) -->
          <div class="navbar-gooey-layer absolute inset-0 pointer-events-none">
            <div 
              class="navbar-blob bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 text-white rounded-full shadow-[0_0_20px_rgba(16,185,129,0.45)]"
              :style="blobStyle"
            ></div>
          </div>

          <!-- Links de Navegación Escritorio -->
          <NuxtLink 
            v-for="(item, index) in navItems" 
            :key="item.path" 
            :to="item.path"
            :ref="el => setItemRef(el, index)"
            @click="selectNav(index)"
            class="relative z-10 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 select-none"
            :class="[
              isItemActive(item.path) 
                ? 'text-white font-bold scale-105' 
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-500/10'
            ]"
          >
            <span>{{ item.name }}</span>
            <span v-if="isItemActive(item.path)" class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
          </NuxtLink>
        </nav>

        <!-- Botones de Acción / Login -->
        <div class="hidden md:flex items-center space-x-3">
          <NuxtLink 
            to="/auth/login" 
            class="relative inline-flex items-center justify-center px-5 py-2 overflow-hidden font-bold text-white transition duration-300 ease-out bg-emerald-600 rounded-full shadow-md shadow-emerald-600/30 group hover:scale-105 active:scale-95"
          >
            <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500"></span>
            <span class="relative text-xs uppercase tracking-wider">Iniciar Sesión</span>
          </NuxtLink>
        </div>
        
        <!-- Mobile Navigation Button -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-slate-700 dark:text-slate-200 focus:outline-none p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Icon v-if="!isMenuOpen" name="heroicons:bars-3" class="w-6 h-6 text-emerald-600" />
          <Icon v-else name="heroicons:x-mark" class="w-6 h-6 text-emerald-600" />
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
        <div v-if="isMenuOpen" class="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-emerald-100 dark:border-emerald-950 shadow-2xl">
          <div class="container-custom py-4 space-y-2">
            <NuxtLink 
              v-for="item in navItems" 
              :key="item.path" 
              :to="item.path" 
              class="flex items-center justify-between px-4 py-3 rounded-2xl font-bold transition-all duration-300"
              :class="[
                isItemActive(item.path)
                  ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600'
              ]"
              @click="isMenuOpen = false"
            >
              <span>{{ item.name }}</span>
              <span v-if="isItemActive(item.path)" class="text-xs bg-white/20 px-2 py-0.5 rounded-full text-white">Activo</span>
            </NuxtLink>

            <NuxtLink 
              to="/auth/login" 
              class="block w-full text-center py-3 text-white font-bold bg-emerald-600 rounded-2xl mt-4 shadow-lg shadow-emerald-600/30"
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
  if (el) {
    const domEl = el.$el ? el.$el : el;
    itemRefs.value[index] = domEl;
  }
};

const isItemActive = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};

const blobPos = ref({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

const updateBlobPosition = () => {
  const currentEl = itemRefs.value[activeIndex.value];
  if (currentEl && currentEl.offsetWidth) {
    blobPos.value = {
      left: currentEl.offsetLeft,
      top: currentEl.offsetTop,
      width: currentEl.offsetWidth,
      height: currentEl.offsetHeight,
      opacity: 1
    };
  } else {
    blobPos.value.opacity = 0;
  }
};

const selectNav = (index) => {
  activeIndex.value = index;
  updateBlobPosition();
};

const blobStyle = computed(() => ({
  transform: `translate3d(${blobPos.value.left}px, ${blobPos.value.top}px, 0)`,
  width: `${blobPos.value.width}px`,
  height: `${blobPos.value.height}px`,
  opacity: blobPos.value.opacity
}));

watch(() => route.path, (newPath) => {
  const foundIndex = navItems.findIndex(item => isItemActive(item.path));
  if (foundIndex !== -1) {
    activeIndex.value = foundIndex;
    nextTick(updateBlobPosition);
  } else {
    blobPos.value.opacity = 0;
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
  transition: transform 450ms cubic-bezier(0.68, -0.55, 0.265, 1.55), width 450ms ease, height 450ms ease, opacity 300ms ease;
  backface-visibility: hidden;
  perspective: 1000px;
  transform-style: preserve-3d;
}
</style>
