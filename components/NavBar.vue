<template>
  <header class="sticky top-0 bg-white/95 backdrop-blur-md shadow-sm z-50">
    <div class="container-custom flex justify-between items-center py-3">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2">
        <span class="text-primary text-2xl font-bold font-heading">Vivero Emma</span>
      </NuxtLink>
      
      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-8">
        <NuxtLink v-for="item in navItems" :key="item.path" 
          :to="item.path" 
          class="text-gray-700 hover:text-primary font-medium text-sm transition duration-300">
          {{ item.name }}
        </NuxtLink>
        <NuxtLink 
          to="/auth/login" 
          class="btn btn-primary text-sm">
          Iniciar Sesión
        </NuxtLink>
      </nav>
      
      <!-- Mobile Navigation Button -->
      <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-gray-700 focus:outline-none">
        <Icon v-if="!isMenuOpen" name="heroicons:bars-3" class="w-6 h-6" />
        <Icon v-else name="heroicons:x-mark" class="w-6 h-6" />
      </button>
    </div>
    
    <!-- Mobile Navigation Menu -->
    <div v-if="isMenuOpen" class="md:hidden bg-white shadow-md">
      <div class="container-custom py-4 space-y-3">
        <NuxtLink v-for="item in navItems" :key="item.path" 
          :to="item.path" 
          class="block py-2 text-gray-700 hover:text-primary font-medium"
          @click="isMenuOpen = false">
          {{ item.name }}
        </NuxtLink>
        <NuxtLink 
          to="/auth/login" 
          class="block py-2 text-primary font-medium mt-4"
          @click="isMenuOpen = false">
          Iniciar Sesión
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const isMenuOpen = ref(false);

const navItems = [
  { name: 'Inicio', path: '/' },
  { name: 'Productos', path: '/productos' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Contacto', path: '/contacto' }
];
</script>