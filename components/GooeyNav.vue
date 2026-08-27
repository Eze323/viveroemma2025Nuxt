<template>
  <div class="relative w-full max-w-4xl mx-auto p-4 font-sans select-none">
    <!-- SVG Filter Defs Ultra-Viscosos (Filtro 1: Tab Bar Sticky, Filtro 2: FAB Blobs) -->
    <svg class="absolute w-0 h-0 overflow-hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Filtro 1: Gooey Tab Bar (Efecto gota pegajosa de resina) -->
        <filter id="gooey-effect" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 25 -11" 
            result="gooey" 
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
        
        <!-- Filtro 2: Gooey FAB (Desprendimiento líquido de alta tensión) -->
        <filter id="gooey-button-effect" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur" />
          <feColorMatrix 
            in="blur" 
            mode="matrix" 
            values="1 0 0 0 0  
                    0 1 0 0 0  
                    0 0 1 0 0  
                    0 0 0 28 -12" 
            result="gooey" 
          />
        </filter>
      </defs>
    </svg>

    <!-- OPCIÓN 1: Tab Bar Flotante con Indicador Viscoso Intensificado -->
    <div class="bg-emerald-950/85 backdrop-blur-xl p-5 rounded-3xl shadow-[0_20px_50px_rgba(4,120,87,0.3)] border border-emerald-700/50 mb-10">
      <div class="flex items-center justify-between mb-3 px-2">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
          <h3 class="text-xs font-bold tracking-widest text-emerald-400 uppercase">
            Navegación Viscosa Ultra • Sticky Tab Bar
          </h3>
        </div>
        <span class="text-xs font-mono text-emerald-300/80 bg-emerald-900/60 px-2 py-0.5 rounded-full border border-emerald-700/40">Viscosidad Max GPU</span>
      </div>

      <!-- Contenedor relativo con filtro Gooey -->
      <div class="relative py-2.5 px-3 bg-emerald-900/50 rounded-2xl overflow-visible flex items-center justify-around">
        
        <!-- Capa Filtro Líquido (Blob Desplazable con Elasticidad) -->
        <div class="gooey-container absolute inset-0 pointer-events-none">
          <div 
            class="gooey-blob bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.8)]"
            :class="{ 'is-squishing': isMoving }"
            :style="blobStyle"
          ></div>
        </div>

        <!-- Capa de Texto e Iconos Nítida (Sobre la capa filtrada) -->
        <button
          v-for="(item, index) in navItems"
          :key="item.id"
          :ref="el => setItemRef(el, index)"
          @click="selectTab(index)"
          class="relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none"
          :class="activeIndex === index ? 'text-emerald-950 font-extrabold scale-105' : 'text-emerald-200 hover:text-white'"
        >
          <span class="text-lg transition-transform duration-300 group-hover:scale-125">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- OPCIÓN 2: Botón de Acción Flotante Líquido (Gooey FAB Ultra Viscoso) -->
    <div class="bg-slate-950/95 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.6)] border border-slate-800 flex flex-col items-center">
      <div class="w-full flex justify-between items-center mb-6">
        <h3 class="text-xs font-bold tracking-widest text-teal-400 uppercase">
          Botones Viscosos Separables (Gotas de Resina)
        </h3>
        <span class="text-xs text-slate-400">Click para desintegrar / fusionar</span>
      </div>

      <!-- Área Gooey FAB -->
      <div class="relative h-64 w-full flex items-center justify-center">
        <!-- Contenedor con Filtro Viscoso (Gotas líquidas) -->
        <div class="gooey-button-container absolute inset-0 flex items-center justify-center pointer-events-none">
          
          <!-- Sub-blobs líquidos que brotan -->
          <div 
            v-for="(action, index) in fabActions" 
            :key="action.id"
            class="fab-sub-blob absolute w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-[0_0_20px_rgba(20,184,166,0.6)] transition-all duration-500 ease-[cubic-bezier(0.68,-0.6,0.32,1.6)]"
            :style="getFabBlobStyle(index)"
          ></div>

          <!-- Blob Líquido Central -->
          <div 
            class="fab-main-blob w-18 h-18 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_35px_rgba(16,185,129,0.7)] transition-transform duration-300"
            :class="isFabOpen ? 'scale-125 rotate-12' : 'scale-100'"
          ></div>
        </div>

        <!-- Capa de Botones Nítidos Interactivos -->
        <div class="relative z-20 flex items-center justify-center">
          <!-- Sub-botones interactivos -->
          <button
            v-for="(action, index) in fabActions"
            :key="'btn-'+action.id"
            @click="triggerFabAction(action)"
            class="fab-sub-button absolute w-16 h-16 rounded-full flex items-center justify-center text-emerald-950 font-bold shadow-xl transition-all duration-500 focus:outline-none hover:scale-115 active:scale-90"
            :style="getFabButtonStyle(index)"
            :title="action.label"
          >
            <span class="text-2xl">{{ action.icon }}</span>
          </button>

          <!-- Botón Principal Disparador -->
          <button 
            @click="toggleFab"
            class="w-18 h-18 rounded-full flex items-center justify-center text-emerald-950 font-black shadow-2xl transition-transform duration-300 focus:outline-none hover:scale-110 active:scale-90 bg-emerald-400"
            aria-label="Abrir Menú Viscoso"
          >
            <span class="text-3xl transition-transform duration-500 transform" :class="isFabOpen ? 'rotate-135' : 'rotate-0'">
              ➕
            </span>
          </button>
        </div>
      </div>

      <!-- Feedback de Acción seleccionada -->
      <div v-if="lastAction" class="mt-4 text-xs font-mono text-emerald-300 bg-emerald-950/80 px-5 py-2.5 rounded-full border border-emerald-700/50 shadow-lg animate-bounce">
        💧 Acción ejecutada: <strong>{{ lastAction }}</strong>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, onUnmounted } from 'vue';

// --- CONFIGURACIÓN DE TAB BAR LÍQUIDA ---
const navItems = [
  { id: 'inicio', label: 'Inicio', icon: '🌱' },
  { id: 'plantas', label: 'Plantas', icon: '🌿' },
  { id: 'macetas', label: 'Macetas', icon: '🪴' },
  { id: 'sustratos', label: 'Sustratos', icon: '🍂' },
  { id: 'contacto', label: 'Contacto', icon: '📞' }
];

const activeIndex = ref(0);
const itemRefs = ref([]);
const isMoving = ref(false);
let squishTimeout = null;

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

const selectTab = (index) => {
  if (activeIndex.value !== index) {
    isMoving.value = true;
    if (squishTimeout) clearTimeout(squishTimeout);
    squishTimeout = setTimeout(() => {
      isMoving.value = false;
    }, 450);
  }
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

// --- CONFIGURACIÓN DE BOTÓN VISCOSO FAB ---
const isFabOpen = ref(false);
const lastAction = ref('');

const fabActions = [
  { id: 'add', label: 'Nueva Planta', icon: '🌻' },
  { id: 'scan', label: 'Escanear QR', icon: '📷' },
  { id: 'cart', label: 'Ver Carrito', icon: '🛒' }
];

const toggleFab = () => {
  isFabOpen.value = !isFabOpen.value;
};

const triggerFabAction = (action) => {
  lastAction.value = action.label;
  isFabOpen.value = false;
};

const getFabAngle = (index, total) => {
  const startAngle = -140;
  const endAngle = -40;
  const step = (endAngle - startAngle) / (total - 1 || 1);
  return (startAngle + index * step) * (Math.PI / 180);
};

const getFabBlobStyle = (index) => {
  if (!isFabOpen.value) {
    return {
      transform: 'translate3d(0, 0, 0) scale(0.4)',
      opacity: 0
    };
  }
  const radius = 105;
  const angle = getFabAngle(index, fabActions.length);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(1)`,
    opacity: 1
  };
};

const getFabButtonStyle = (index) => {
  if (!isFabOpen.value) {
    return {
      transform: 'translate3d(0, 0, 0) scale(0)',
      pointerEvents: 'none',
      opacity: 0
    };
  }
  const radius = 105;
  const angle = getFabAngle(index, fabActions.length);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(1)`,
    pointerEvents: 'auto',
    opacity: 1
  };
};

onMounted(() => {
  nextTick(() => {
    updateBlobPosition();
  });
  window.addEventListener('resize', updateBlobPosition);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateBlobPosition);
  if (squishTimeout) clearTimeout(squishTimeout);
});
</script>

<style scoped>
/* Filtros Viscosos SVG */
.gooey-container {
  filter: url(#gooey-effect);
  will-change: transform;
}

.gooey-button-container {
  filter: url(#gooey-button-effect);
  will-change: transform;
}

/* Transición suave del blob con aceleración por GPU */
.gooey-blob {
  transition: transform 550ms cubic-bezier(0.68, -0.65, 0.32, 1.6), width 550ms ease, height 550ms ease;
  backface-visibility: hidden;
  perspective: 1000px;
  transform-style: preserve-3d;
}

/* Deformación elástica (Squish) cuando la gota salta de pestaña */
.gooey-blob.is-squishing {
  animation: liquidSquish 450ms cubic-bezier(0.68, -0.65, 0.32, 1.6);
}

@keyframes liquidSquish {
  0% { transform: scaleX(1) scaleY(1); }
  35% { transform: scaleX(1.3) scaleY(0.75); }
  65% { transform: scaleX(0.85) scaleY(1.2); }
  100% { transform: scaleX(1) scaleY(1); }
}

.fab-main-blob,
.fab-sub-blob {
  backface-visibility: hidden;
  perspective: 1000px;
  transform-style: preserve-3d;
}
</style>
