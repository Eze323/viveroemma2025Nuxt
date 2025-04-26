<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Admin sidebar -->
    <AdminSidebar />
    
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
import { useAuthStore } from '~/stores/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    router.push('/auth/login');
  }
});
</script>