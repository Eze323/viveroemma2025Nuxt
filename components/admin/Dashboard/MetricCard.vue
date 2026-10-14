<template>
  <div class="liquid-metric-card stat-card hover-lift group relative overflow-hidden bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer">
    <!-- Destello líquido de resina -->
    <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

    <div class="flex items-start justify-between relative z-10">
      <!-- Icon with gradient background & pulse -->
      <div 
        class="p-3 rounded-2xl flex items-center justify-center shadow-md transition-all duration-500 group-hover:scale-115 group-hover:rotate-6"
        :class="gradientClass"
      >
        <Icon :name="icon" class="w-6 h-6 text-white" />
      </div>
      
      <!-- Trend indicator estilo micro-gota -->
      <div 
        v-if="trend !== null"
        class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-inner border"
        :class="trendClass"
      >
        <Icon 
          :name="trend >= 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'" 
          class="w-3.5 h-3.5" 
        />
        <span>{{ Math.abs(trend) }}%</span>
      </div>
    </div>
    
    <!-- Value and title -->
    <div class="mt-4 relative z-10">
      <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">{{ title }}</h3>
      <div class="flex items-baseline gap-1">
        <p class="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          <span v-if="prefix" class="text-emerald-600 dark:text-emerald-400 font-bold mr-0.5">{{ prefix }}</span>
          {{ displayValue.toLocaleString() }}
          <span v-if="suffix" class="text-xs font-bold text-slate-400 ml-1">{{ suffix }}</span>
        </p>
      </div>
      
      <!-- Comparison text -->
      <p v-if="comparison" class="text-xs font-medium text-slate-400 mt-2">
        {{ comparison }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, onMounted, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'info', 'error'].includes(value)
  },
  trend: {
    type: Number,
    default: null
  },
  comparison: {
    type: String,
    default: ''
  },
  prefix: {
    type: String,
    default: ''
  },
  suffix: {
    type: String,
    default: ''
  }
});

const numericValue = computed(() => {
  if (typeof props.value === 'number') return props.value;
  const cleaned = String(props.value).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
});

const displayValue = ref(numericValue.value);
let animationFrame: number | undefined;

const animateValue = () => {
  if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);

  const startTime = performance.now();
  const update = (currentTime: number) => {
    const progress = Math.min((currentTime - startTime) / 1500, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 4);
    displayValue.value = Math.floor(numericValue.value * easedProgress);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(update);
    } else {
      displayValue.value = numericValue.value;
      animationFrame = undefined;
    }
  };

  animationFrame = requestAnimationFrame(update);
};

onMounted(animateValue);
watch(numericValue, animateValue);
onBeforeUnmount(() => {
  if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
});

const gradientClass = computed(() => {
  const gradients = {
    primary: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/30',
    success: 'bg-gradient-to-br from-emerald-400 to-green-600 shadow-emerald-400/30',
    warning: 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-400/30',
    info: 'bg-gradient-to-br from-cyan-400 to-blue-600 shadow-cyan-400/30',
    error: 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/30'
  };
  return gradients[props.color] || gradients.primary;
});

const trendClass = computed(() => {
  if (props.trend === null) return '';
  return props.trend >= 0 
    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
    : 'bg-rose-500/10 text-rose-600 border-rose-500/20';
});
</script>

<style scoped>
.liquid-metric-card {
  transition: border-radius 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55), transform 300ms ease, box-shadow 300ms ease;
}

.liquid-metric-card:hover {
  border-radius: 32px 16px 28px 20px;
  transform: translateY(-4px);
}
</style>
