<template>
  <div class="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/80 dark:border-slate-800 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Ventas Recientes</h3>
      </div>
      <span class="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-500/20">
        Actualización en vivo
      </span>
    </div>

    <!-- Mobile Card View -->
    <div class="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
      <div 
        v-for="sale in sales" 
        :key="sale.id"
        class="liquid-row p-4 transition-all duration-300 relative overflow-hidden"
      >
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ sale.customer }}</p>
            <p class="text-xs text-slate-500 truncate">{{ sale.email }}</p>
          </div>
          <span 
            class="liquid-badge ml-2 flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
            :class="getStatusClass(sale.status)"
          >
            {{ sale.status }}
          </span>
        </div>
        <div class="flex items-center justify-between text-sm mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <div class="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <span class="flex items-center gap-1">
              <Icon name="heroicons:shopping-bag" class="w-4 h-4 text-emerald-500" />
              {{ sale.items }} items
            </span>
            <span class="flex items-center gap-1">
              <Icon name="heroicons:calendar" class="w-4 h-4 text-teal-500" />
              {{ sale.date }}
            </span>
          </div>
          <span class="font-extrabold text-emerald-600 dark:text-emerald-400">${{ sale.total.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- Desktop Table View con Ola Líquida de Resaltado -->
    <div class="hidden md:block overflow-x-auto">
      <table class="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
        <thead class="bg-slate-50/80 dark:bg-slate-900/80">
          <tr>
            <th scope="col" class="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              ID Pedido
            </th>
            <th scope="col" class="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Cliente
            </th>
            <th scope="col" class="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Items
            </th>
            <th scope="col" class="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Total
            </th>
            <th scope="col" class="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Fecha / Hora
            </th>
            <th scope="col" class="px-6 py-3.5 text-left text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Estado
            </th>
            <th scope="col" class="px-6 py-3.5 text-right text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Acción
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
          <tr 
            v-for="sale in sales" 
            :key="sale.id"
            class="liquid-row transition-all duration-300 relative group cursor-pointer"
          >
            <td class="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-slate-900 dark:text-slate-200">
              #{{ sale.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs mr-3">
                  {{ sale.customer.charAt(0) }}
                </div>
                <div>
                  <div class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{{ sale.customer }}</div>
                  <div class="text-xs text-slate-400">{{ sale.email }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-600 dark:text-slate-300">
              {{ sale.items }} prod.
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-black text-emerald-600 dark:text-emerald-400">
              ${{ sale.total.toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
              <div class="font-medium">{{ sale.date }}</div>
              <div class="text-xs text-slate-400">{{ sale.time }} hs</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="liquid-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                :class="getStatusClass(sale.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                {{ sale.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-500/20 transition-all hover:scale-105">
                Detalles ↗
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
      <div class="text-xs font-semibold text-slate-500">
        Mostrando <span class="font-bold text-slate-900 dark:text-white">{{ sales.length }}</span> registros actualizados
      </div>
      <div class="flex gap-2">
        <button class="px-3 py-1 text-xs font-bold rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100">
          Anterior
        </button>
        <button class="px-3 py-1 text-xs font-bold rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100">
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  sales: {
    type: Array,
    required: true
  }
});

const getStatusClass = (status) => {
  const classes = {
    'Completada': 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30',
    'Procesando': 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30',
    'Pendiente': 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30',
    'Cancelada': 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
  };
  return classes[status] || 'bg-slate-100 text-slate-700';
};
</script>

<style scoped>
/* Resaltado de fila con ola fluida (Liquid Wave) */
.liquid-row {
  position: relative;
}

.liquid-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #10b981, #14b8a6);
  border-radius: 0 4px 4px 0;
  opacity: 0;
  transform: scaleY(0.3);
  transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.liquid-row:hover::before {
  opacity: 1;
  transform: scaleY(1);
}

.liquid-row:hover {
  background-color: rgba(16, 185, 129, 0.04);
}
</style>