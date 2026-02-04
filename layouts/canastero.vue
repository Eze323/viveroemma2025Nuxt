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
    
    <!-- Sidebar -->
    <aside 
       class="fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 md:translate-x-0"
       :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
       <div class="p-6 border-b border-gray-100">
          <h1 class="text-2xl font-bold text-primary">Vivero Emma</h1>
          <p class="text-xs text-gray-500">Panel de Canasteros</p>
       </div>
       
       <nav class="p-4 space-y-1">
          <NuxtLink to="/canasteros" class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors" active-class="bg-primary/5 text-primary font-medium">
             <Icon name="heroicons:home" class="w-5 h-5 mr-3" />
             Inicio
          </NuxtLink>
           <NuxtLink to="/canasteros/catalogo" class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors" active-class="bg-primary/5 text-primary font-medium">
             <Icon name="heroicons:building-storefront" class="w-5 h-5 mr-3" />
             Catálogo
          </NuxtLink>
          <NuxtLink to="/canasteros/checkout" class="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-primary transition-colors" active-class="bg-primary/5 text-primary font-medium">
             <Icon name="heroicons:shopping-cart" class="w-5 h-5 mr-3" />
             Mi Carrito
          </NuxtLink>
           <!-- Logout -->
            <button @click="logout" class="w-full flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors mt-auto">
             <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 mr-3" />
             Cerrar Sesión
          </button>
       </nav>
    </aside>
    
    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Top Mobile Header -->
       <header class="bg-white border-b border-gray-200 p-4 flex items-center justify-between md:hidden">
           <button @click="toggleSidebar" class="p-2 -ml-2 text-gray-700">
               <Icon name="heroicons:bars-3" class="w-6 h-6" />
           </button>
           <span class="font-bold text-gray-900">Canasteros</span>
           <div class="w-6"></div> <!-- Spacer -->
       </header>

       <main class="flex-1 overflow-y-auto pb-20 md:pb-0">
         <slot />
       </main>

       <!-- Bottom Nav (Mobile) -->
       <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-2 z-30 text-xs">
          <NuxtLink to="/canasteros" class="flex flex-col items-center p-2 text-gray-500" active-class="text-primary">
              <Icon name="heroicons:home" class="w-6 h-6 mb-1" />
              Inicio
          </NuxtLink>
          <NuxtLink to="/canasteros/catalogo" class="flex flex-col items-center p-2 text-gray-500" active-class="text-primary">
              <Icon name="heroicons:building-storefront" class="w-6 h-6 mb-1" />
              Catálogo
          </NuxtLink>
           <NuxtLink to="/canasteros/checkout" class="flex flex-col items-center p-2 text-gray-500" active-class="text-primary">
              <Icon name="heroicons:shopping-cart" class="w-6 h-6 mb-1" />
              Carrito
          </NuxtLink>
       </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const isSidebarOpen = ref(false);
const authStore = useAuthStore();

const toggleSidebar = () => isSidebarOpen.value = !isSidebarOpen.value;

const logout = async () => {
    await authStore.logout();
    navigateTo('/');
}
</script>
