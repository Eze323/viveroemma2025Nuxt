<template>
  <div class="flex flex-col min-h-screen bg-background-light dark:bg-background-dark font-display text-content-light dark:text-content-dark">
    <!-- Header -->
    <!-- <header class="sticky top-0 z-10 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
      <div class="flex items-center justify-between p-4 border-b border-subtle-light dark:border-subtle-dark">
        <div class="w-10"></div>
        <h1 class="text-lg font-bold text-center">Panel de Administración</h1>
        <button class="p-2 rounded-full hover:bg-subtle-light dark:hover:bg-subtle-dark">
          <span class="material-symbols-outlined">settings</span>
        </button>
      </div>
    </header> -->

    <!-- Main Content -->
    <main class="flex-grow p-4">
      <h2 class="text-2xl font-bold mb-4 px-2">Resumen</h2>
      <div class="grid grid-cols-1 gap-4">
        <NuxtLink
          v-for="item in dashboardItems"
          :key="item.title"
          :to="item.href"
          class="block bg-white dark:bg-subtle-dark rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
        >
          <div class="flex items-center p-4">
            <div class="flex-grow">
              <h3 class="font-bold text-base">{{ item.title }}</h3>
              <p class="text-sm text-content-light/70 dark:text-content-dark/70">{{ item.description }}</p>
            </div>
            <div
              class="w-20 h-20 rounded-lg bg-cover bg-center ml-4"
              :style="{ backgroundImage: `url(${item.image})` }"
            ></div>
          </div>
        </NuxtLink>
      </div>
    </main>

    <!-- Navigation -->
    <!-- <nav class="sticky bottom-0 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-sm border-t border-subtle-light dark:border-subtle-dark">
      <div class="flex justify-around p-2">
        <NuxtLink
          v-for="navItem in navItems"
          :key="navItem.title"
          :to="navItem.href"
          class="flex flex-col items-center gap-1 p-2 rounded-lg"
          :class="navItem.active ? 'text-primary' : 'text-content-light/70 dark:text-content-dark/70 hover:text-primary dark:hover:text-primary transition-colors'"
        >
          <span class="material-symbols-outlined" :style="navItem.active ? 'font-variation-settings: \'FILL\' 1' : ''">
            {{ navItem.icon }}
          </span>
          <span class="text-xs font-medium">{{ navItem.title }}</span>
        </NuxtLink>
      </div>
    </nav> -->
  </div>
</template>
<script setup>
import { useAuthStore } from '~/stores/auth';

definePageMeta({
  middleware: ['auth'],
});

//const authStore = useAuthStore();

//import { useAuthStore } from '~/stores/auth';
import StatCard from '~/components/admin/Dashboard/StatCard.vue';
import SalesChart from '~/components/admin/Dashboard/SalesChart.vue';
import TopSellersTable from '~/components/admin/Dashboard/TopSellersTable.vue';
import RecentSalesTable from '~/components/admin/Dashboard/RecentSalesTable.vue';

definePageMeta({
  layout: 'admin'
});

const authStore = useAuthStore();
const dashboardItems = [
  {
    title: 'Productos',
    description: 'Gestiona el inventario de plantas y productos.',
    href: '/admin/productos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyyT6aSmnKFqqTP4YySwr_EjadBr2CUwaLo-4ny5OODvCqtGni3q_bt3Ym0LKYEmreA1VEXzU1kG5rLo--9gIlBpPQmdCX0BO_IGLsMYP4XVNPdtU0G00-F2KCKCc1iI8Qkbl8P0bDX1BxF0lnyWsB-A6FSvZ3lUNEYKgpJN9f0YnPygppWMB18tXaN4KQroDdL4LUk7YNrGV3RmjdQxZAuf35oSEmvKd_FyNVMrxJNWg1J_YXJRcEGe8c-3L0j8Zb3Zln4W1PLUz6',
  },
  {
    title: 'Categorías',
    description: 'Organiza los productos por tipo y características.',
    href: '/admin/categorias',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP0uhDzzg5IMfb5sPk1HV2rdcxCI-pAX__oo-yar_Qs-gH-x63LgYP-_NwsFsedsCA1---hk-VHvdrBxSR0NyzTC20UyBSlIuym4opIZf17d6ivFxPZAMlzqsxULiRzjLvQF30MZFSoBuReLfJFcLleNaAR_U22iLywmbHEOB2jTysbHuLsXDsThW_V3_biY9I94bWPynd2EBJ_XMia4LWkV3ZYIyD2wkZVKfzwrPta9EkrZIHBkFYrc-XmWGQ4ldR09vwPf5mxp46',
  },
  {
    title: 'Clientes',
    description: 'Administra la información de tus clientes.',
    href: '/admin/clientes',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVBMnHF9KPVbTZlH-ETbiQUwjM7cdhH63J7Iflz8Qo5CKWqf3HZXd_R--Lb5KeUOpPC3VBpRi2VXJ0FwD5dzaeIHgldLdaBLOtwM3lAzYElOwR4Olaq7YQMWpEwdK9a8ZByM1R6gH7-HD_Aoo5Pdq8fd4WPfsjqkXLi8KNDFGbX_la9KhIP-6mH8Jgv6_jXNBW17dA-kZze4k0osJ_cF_xmh59lenF5uLC2zspg1fmF_K2PB3mD2RLWa8OHALg7rw15cBq9aIG280I',
  },
  {
    title: 'Proveedores',
    description: 'Controla los datos de tus proveedores.',
    href: '/admin/proveedores',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-v4jjt4ZHHw9UBNWXwFXkM2cS_P35iLm4MPzdCD10A9pV31LgvmY_0vOKOr3POYlgc_qc3cBdr4hc4eEb4ujDeL8ojrbxNdwaDo-p9u6xqgz3AMhacbupKncSKEJaHppa6o4Q3qbHlIOt9B4N_XJYI0iuERk-rvHhMYgg1nXCXIz7l0SpJ-6A4w1Y4g6BPLTvsUP2qjsblgTX4hjy0LQD7GHr0FQH1Vc-6psRyHEE_1R_L9RlJcVw2vEsVqR1nC97gN2k-MF1_oP_',
  },
  {
    title: 'Ventas',
    description: 'Revisa el historial de ventas y ganancias.',
    href: '/admin/ventas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKvpKIWkN6HF2Vz1mJVr-d6P9sl2COQUEZPK5k_xYr5Xkb9DyRFOHCW3Bee2Tub6y-Dd3ncmAvIG4MIjO2gFzBx_TpERiMNhbbydzSsjcnjrEDoIR83Vm4jn8VVwqowQFAZHqxnwAVdo2dejsEARA9k2RVnq-O66bibwEWf-4Iggvw3SBK4yEu_ZtH_QoEUVrGDkcnjRuqOHr9EaiFp8mkBCiJZdq4-q3MmJk7IIiWWkm_cSH0igSQf0hupj4bVyMKZhr5806f_zMw',
  },
  {
    title: 'Premios',
    description: 'Gestiona los programas de lealtad y descuentos.',
    href: '/admin/premios',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAaI9a9EzumXQjjrNG1soAl6K-MycvVe_ohQcUP7V2NBnIfDCWi-EKkHg1e9DHlu--ZaZg6iKXQO-RAEp-KqtbO7gZpLJGwlM4SYCq6RxeFyOGwMxRAKmFiZqdMMS6muaP-J3ajWhPm9X_7SsTJtb4wZlkdCpCvlt9FgxTNsIP7J2Ptezcyju2RZGIceXKLTEretWYb86ThV8VCrWVsbmzEY1AHUZe5Flm35vlGcLF_iffvcP5536zTRA2DfN29vozDoJC-Kw95Gwd4',
  },
];

// const navItems = [
//   { title: 'Dashboard', icon: 'dashboard', href: '/admin', active: true },
//   { title: 'Productos', icon: 'eco', href: '/admin/productos', active: false },
//   { title: 'Ventas', icon: 'payments', href: '/admin/ventas', active: false },
//   { title: 'Clientes', icon: 'groups', href: '/admin/clientes', active: false },
//   { title: 'Más', icon: 'more_horiz', href: '/admin/mas', active: false },
// ];
// Mock data for charts
const chartData = {
  día: {
    labels: ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM', '5PM', '6PM'],
    values: [350, 420, 510, 790, 850, 760, 620, 590, 680, 740]
  },
  semana: {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    values: [4200, 3800, 5100, 4700, 6200, 7800, 6500]
  },
  mes: {
    labels: ['1 Mayo', '5 Mayo', '10 Mayo', '15 Mayo', '20 Mayo', '25 Mayo', '30 Mayo'],
    values: [28500, 33400, 42000, 39600, 36800, 48500, 45000]
  },
  año: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    values: [38000, 42000, 35000, 32000, 45000, 50000, 48000, 61000, 54000, 56000, 62000, 78000]
  }
};

// Top sellers data
const topSellers = [
  {
    name: 'María López',
    id: 'VE-001',
    sales: 12680,
    orders: 32,
    products: 85,
    conversionRate: 68
  },
  {
    name: 'Juan Pérez',
    id: 'VE-003',
    sales: 10450,
    orders: 28,
    products: 74,
    conversionRate: 61
  },
  {
    name: 'Ana García',
    id: 'VE-007',
    sales: 9320,
    orders: 25,
    products: 65,
    conversionRate: 57
  },
  {
    name: 'Carlos Rodríguez',
    id: 'VE-004',
    sales: 7850,
    orders: 19,
    products: 53,
    conversionRate: 52
  },
  {
    name: 'Laura Martínez',
    id: 'VE-010',
    sales: 6420,
    orders: 17,
    products: 45,
    conversionRate: 48
  }
];

// Recent sales data
const recentSales = [
  {
    id: '12345',
    customer: 'Marta Gómez',
    email: 'marta@gmail.com',
    items: 3,
    total: 4250,
    date: '01/05/2025',
    time: '14:30',
    status: 'Completada'
  },
  {
    id: '12346',
    customer: 'Roberto Sánchez',
    email: 'roberto@gmail.com',
    items: 1,
    total: 2100,
    date: '01/05/2025',
    time: '12:15',
    status: 'Procesando'
  },
  {
    id: '12347',
    customer: 'Clara Fernández',
    email: 'clara@gmail.com',
    items: 4,
    total: 5680,
    date: '30/04/2025',
    time: '18:45',
    status: 'Completada'
  },
  {
    id: '12348',
    customer: 'Miguel Torres',
    email: 'miguel@gmail.com',
    items: 2,
    total: 3420,
    date: '30/04/2025',
    time: '16:20',
    status: 'Pendiente'
  },
  {
    id: '12349',
    customer: 'Sofía Ruiz',
    email: 'sofia@gmail.com',
    items: 5,
    total: 7890,
    date: '29/04/2025',
    time: '11:10',
    status: 'Completada'
  }
];

</script>
<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

body {
  min-height: max(884px, 100dvh);
}
</style>