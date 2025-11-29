<template>
  <NuxtLink
    :to="href"
    class="group block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-primary/20"
  >
    <div class="flex items-center gap-4">
      <!-- Icon with colored background -->
      <div 
        class="p-3 rounded-xl transition-all duration-200 group-hover:scale-110"
        :class="iconBgClass"
      >
        <Icon :name="icon" class="w-6 h-6" :class="iconColorClass" />
      </div>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <h3 class="font-semibold text-gray-900 text-sm mb-0.5 group-hover:text-primary transition-colors">
          {{ title }}
        </h3>
        <p class="text-xs text-gray-500 truncate">
          {{ description }}
        </p>
      </div>
      
      <!-- Arrow icon -->
      <Icon 
        name="heroicons:arrow-right" 
        class="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" 
      />
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    required: true
  },
  href: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'info', 'purple', 'pink'].includes(value)
  }
});

// Icon background color
const iconBgClass = computed(() => {
  const colors = {
    primary: 'bg-primary/10 group-hover:bg-primary/20',
    success: 'bg-green-50 group-hover:bg-green-100',
    warning: 'bg-yellow-50 group-hover:bg-yellow-100',
    info: 'bg-blue-50 group-hover:bg-blue-100',
    purple: 'bg-purple-50 group-hover:bg-purple-100',
    pink: 'bg-pink-50 group-hover:bg-pink-100'
  };
  return colors[props.color] || colors.primary;
});

// Icon color
const iconColorClass = computed(() => {
  const colors = {
    primary: 'text-primary',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    purple: 'text-purple-600',
    pink: 'text-pink-600'
  };
  return colors[props.color] || colors.primary;
});
</script>
