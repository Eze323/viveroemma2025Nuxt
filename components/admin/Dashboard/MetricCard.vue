<template>
  <div class="stat-card hover-lift group">
    <div class="flex items-start justify-between">
      <!-- Icon with gradient background -->
      <div 
        class="p-3 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
        :class="gradientClass"
      >
        <Icon :name="icon" class="w-6 h-6 text-white" />
      </div>
      
      <!-- Trend indicator -->
      <div 
        v-if="trend !== null"
        class="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium"
        :class="trendClass"
      >
        <Icon 
          :name="trend >= 0 ? 'heroicons:arrow-trending-up' : 'heroicons:arrow-trending-down'" 
          class="w-3 h-3" 
        />
        <span>{{ Math.abs(trend) }}%</span>
      </div>
    </div>
    
    <!-- Value and title -->
    <div class="mt-4">
      <h3 class="text-sm font-medium text-gray-600 mb-1">{{ title }}</h3>
      <div class="flex items-baseline gap-2">
        <p class="text-3xl font-bold text-gray-900">
          <span v-if="prefix">{{ prefix }}</span>
          <CountUp :end-value="numericValue" :duration="1500" />
          <span v-if="suffix">{{ suffix }}</span>
        </p>
      </div>
      
      <!-- Comparison text -->
      <p v-if="comparison" class="text-xs text-gray-500 mt-2">
        {{ comparison }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

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

// Extract numeric value for animation
const numericValue = computed(() => {
  if (typeof props.value === 'number') return props.value;
  // Remove non-numeric characters except decimal point
  const cleaned = String(props.value).replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
});

// Gradient class based on color
const gradientClass = computed(() => {
  const gradients = {
    primary: 'bg-gradient-primary',
    success: 'bg-gradient-success',
    warning: 'bg-gradient-warning',
    info: 'bg-gradient-info',
    error: 'bg-gradient-to-br from-red-500 to-red-600'
  };
  return gradients[props.color] || gradients.primary;
});

// Trend styling
const trendClass = computed(() => {
  if (props.trend === null) return '';
  return props.trend >= 0 
    ? 'bg-green-50 text-green-700' 
    : 'bg-red-50 text-red-700';
});
</script>

<script>
// CountUp component for animated numbers
import { defineComponent, ref, watch, onMounted } from 'vue';

const CountUp = defineComponent({
  name: 'CountUp',
  props: {
    endValue: {
      type: Number,
      required: true
    },
    duration: {
      type: Number,
      default: 1000
    }
  },
  setup(props) {
    const displayValue = ref(0);
    
    const animate = () => {
      const startValue = 0;
      const startTime = Date.now();
      
      const updateValue = () => {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        
        if (elapsed < props.duration) {
          const progress = elapsed / props.duration;
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          displayValue.value = Math.floor(startValue + (props.endValue - startValue) * easeOutQuart);
          requestAnimationFrame(updateValue);
        } else {
          displayValue.value = props.endValue;
        }
      };
      
      requestAnimationFrame(updateValue);
    };
    
    onMounted(() => {
      animate();
    });
    
    watch(() => props.endValue, () => {
      animate();
    });
    
    return { displayValue };
  },
  template: '<span>{{ displayValue.toLocaleString() }}</span>'
});

export { CountUp };
</script>
