<template>
  <div class="flex h-screen bg-gray-50 overflow-hidden">
    <!-- Overlay for mobile -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isSidebarOpen" 
        class="fixed inset-0 bg-black/50 md:hidden z-20 backdrop-blur-sm"
        @click="toggleSidebar"
      ></div>
    </Transition>
    
    <!-- Admin sidebar -->
    <Transition
      enter-active-class="transition-transform duration-300"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-300"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <AdminSidebar 
        :is-open="isSidebarOpen"
        @toggle-sidebar="toggleSidebar" 
      />
    </Transition>
    
    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden min-w-0">
      <!-- Top navbar -->
      <AdminNavbar :isOpen="isSidebarOpen" @toggle-sidebar="toggleSidebar" />
      
      <!-- Main content area with smooth scroll -->
      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const isSidebarOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

onMounted(() => {
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login');
  }
  
  // Set initial sidebar state based on screen size
  isSidebarOpen.value = window.innerWidth >= 768;
  
  // Handle window resize
  const handleResize = () => {
    if (window.innerWidth >= 768) {
      isSidebarOpen.value = true;
    } else {
      isSidebarOpen.value = false;
    }
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', handleResize);
  };
});
</script>