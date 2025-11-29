<template>
  <div class="bg-white rounded-xl shadow-sm p-4 sm:p-6">
    <!-- Header with time filters -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
        <button 
          v-for="option in timeOptions" 
          :key="option"
          @click="selectedTime = option"
          :class="[
            'px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap',
            selectedTime === option 
              ? 'bg-primary text-white shadow-sm' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          {{ option }}
        </button>
      </div>
    </div>
    
    <!-- Chart Container -->
    <div class="h-64 sm:h-80">
      <LineChart :chart-data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Line as LineChart } from 'vue-chartjs';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler
);

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
  const timeKey = selectedTime.value.toLowerCase();
  const data = props.data[timeKey];
  
  return {
    labels: data.labels,
    datasets: [
      {
        label: 'Ventas',
        data: data.values,
        borderColor: '#2D6A4F',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(45, 106, 79, 0.2)');
          gradient.addColorStop(1, 'rgba(45, 106, 79, 0)');
          return gradient;
        },
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#2D6A4F',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#2D6A4F',
        pointHoverBorderColor: '#FFFFFF',
        pointHoverBorderWidth: 2
      }
    ]
  };
});

// Chart options with modern styling
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#111827',
      bodyColor: '#6B7280',
      borderColor: '#E5E7EB',
      borderWidth: 1,
      padding: 12,
      boxPadding: 6,
      usePointStyle: true,
      cornerRadius: 8,
      displayColors: false,
      callbacks: {
        title: function(context) {
          return context[0].label;
        },
        label: function(context) {
          return `$${context.raw.toLocaleString()}`;
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 12,
          family: 'Poppins'
        }
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        borderDash: [3, 3],
        color: '#F3F4F6',
        drawBorder: false
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 12,
          family: 'Poppins'
        },
        callback: function(value) {
          return '$' + value.toLocaleString();
        },
        padding: 8
      }
    }
  }
};
</script>