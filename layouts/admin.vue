<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Overlay for mobile -->
    <div 
      v-if="isSidebarOpen" 
      class="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
      @click="toggleSidebar"
    ></div>
    
    <!-- Admin sidebar -->
    <AdminSidebar 
      :is-open="isSidebarOpen"
      @toggle-sidebar="toggleSidebar" 
    />
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top navbar -->
      <AdminNavbar />
      
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

const authStore = useAuthStore();

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login');
  }
});
</script>