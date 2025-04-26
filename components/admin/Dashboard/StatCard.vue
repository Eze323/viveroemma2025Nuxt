<template>
  <div class="bg-white rounded-lg shadow-sm p-6 flex items-center">
    <div class="mr-4">
      <div 
        class="p-3 rounded-full w-12 h-12 flex items-center justify-center"
        :class="[`bg-${color}-100`, `text-${color}-600`]"
      >
        <Icon :name="icon" class="w-6 h-6" />
      </div>
    </div>
    <div>
      <div class="text-sm font-medium text-gray-500">{{ title }}</div>
      <div class="text-2xl font-bold text-gray-900">{{ value }}</div>
      <div class="text-sm flex items-center mt-1" :class="trend > 0 ? 'text-success' : 'text-error'">
        <Icon :name="trend > 0 ? 'heroicons:arrow-up' : 'heroicons:arrow-down'" class="w-4 h-4 mr-1" />
        <span>{{ Math.abs(trend) }}% desde {{ period }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
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
    default: 'primary'
  },
  trend: {
    type: Number,
    default: 0
  },
  period: {
    type: String,
    default: 'último mes'
  }
});
</script>