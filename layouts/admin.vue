<!-- layouts/admin.vue -->
<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Overlay for mobile -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
      @click="toggleSidebar"
    ></div>

    <!-- Botón hamburguesa para mobile -->
    <button
      @click="toggleSidebar"
      class="md:hidden fixed top-4 left-4 z-30 p-2 bg-white text-gray-800 rounded-md focus:outline-none shadow-md"
      aria-label="Toggle menu"
    >
      <svg
        v-if="!isSidebarOpen"
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16m-7 6h7"
        />
      </svg>
      <svg
        v-else
        class="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Admin sidebar -->
    <AdminSidebar
      :is-open="isSidebarOpen"
      @toggle-sidebar="toggleSidebar"
    />

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top navbar -->
      <AdminNavbar :isOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />

      <!-- Main content area -->
      <main class="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const isSidebarOpen = ref(false);
const router = useRouter();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login');
  }

  // Abrir sidebar por defecto en desktop (>= 768px)
  isSidebarOpen.value = window.innerWidth >= 768;

  // Actualizar estado del sidebar al redimensionar
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      isSidebarOpen.value = true;
    } else if (!isSidebarOpen.value) {
      isSidebarOpen.value = false; // Asegurar que se cierre en mobile si no está abierto
    }
  };

  window.addEventListener('resize', handleResize);

  // Limpieza al desmontar
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});
</script>