<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
      <div class="flex gap-2">
        <button 
          v-for="option in timeOptions" 
          :key="option"
          @click="selectedTime = option"
          :class="[
            'px-3 py-1 text-sm rounded-md',
            selectedTime === option 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ option }}
        </button>
      </div>
    </div>
    
    <div class="h-80">
      <LineChart :chart-data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Line as LineChart } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Props
const props = defineProps({
  title: {
    type: String,
    default: 'Ventas'
  },
  data: {
    type: Object,
    required: true
  }
});

// Time period options
const timeOptions = ['Día', 'Semana', 'Mes', 'Año'];
const selectedTime = ref('Semana');

// Chart data based on selected time period
const chartData = computed(() => {
  // In a real app, this would fetch data based on the selectedTime
  // For now, we'll use the data prop
  
  const datasets = [
    {
      label: 'Ventas',
      data: props.data[selectedTime.value.toLowerCase()].values,
      borderColor: '#2D6A4F',
      backgroundColor: 'rgba(45, 106, 79, 0.1)',
      tension: 0.4,
      fill: true
    }
  ];
  
  return {
    labels: props.data[selectedTime.value.toLowerCase()].labels,
    datasets
  };
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1F2937',
      bodyColor: '#4B5563',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      callbacks: {
        label: function(context) {
          return `$${context.raw.toLocaleString()}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        borderDash: [2, 4],
        color: '#E5E7EB'
      },
      ticks: {
        callback: function(value) {
          return '$' + value.toLocaleString();
        }
      }
    }
  }
};
</script>