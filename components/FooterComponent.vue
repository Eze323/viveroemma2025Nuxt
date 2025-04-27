<template>
  <footer class="bg-primary-dark text-white">
    <div class="container-custom py-10">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <!-- Brand & About -->
        <div class="md:col-span-1 lg:col-span-1">
          <h2 class="text-xl font-bold mb-4">Vivero Emma</h2>
          <p class="text-gray-300 mb-4">Tu vivero de confianza en Cuartel V, Moreno. Ofrecemos plantas de calidad, asesoramiento personalizado y productos para jardinería.</p>
          <div class="flex space-x-4 mt-4">
            <a href="#" class="text-white hover:text-accent transition-colors">
              <Icon name="mdi:facebook" class="w-5 h-5" />
            </a>
            <a href="#" class="text-white hover:text-accent transition-colors">
              <Icon name="mdi:instagram" class="w-5 h-5" />
            </a>
            <a href="https://api.whatsapp.com/send?phone=1167075529&text=Hola%20quiero%20m%C3%A1s%20informaci%C3%B3n" class="text-white hover:text-accent transition-colors">
              <Icon name="mdi:whatsapp" class="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div>
          <h3 class="text-lg font-bold mb-4">Enlaces rápidos</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.path">
              <NuxtLink :to="link.path" class="text-gray-300 hover:text-white transition-colors">
                {{ link.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div>
          <h3 class="text-lg font-bold mb-4">Contacto</h3>
          <address class="not-italic text-gray-300 space-y-2">
            <p class="flex items-start gap-2">
              <Icon name="heroicons:map-pin" class="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <span>Cnel. Emeterio de Escalada 10565, B1744 Cuartel V, Provincia de Buenos Aires</span>
            </p>
            <p class="flex items-center gap-2">
              <Icon name="heroicons:phone" class="w-5 h-5 text-accent flex-shrink-0" />
              <span>(+54) 11-5116-5807</span>
            </p>
            <!-- <p class="flex items-center gap-2">
              <Icon name="heroicons:envelope" class="w-5 h-5 text-accent flex-shrink-0" />
              <span>info@viveroemma.com</span>
            </p> -->
          </address>
        </div>
        
        <!-- Opening Hours -->
        <div>
          <h3 class="text-lg font-bold mb-4">Horarios</h3>
          <ul class="text-gray-300 space-y-2">
            <li class="flex justify-between">
              <span>Lunes - Sábados:</span>
              <span>7:20 - 18:00</span>
            </li>
            <li class="flex justify-between">
              <span>Domingos:</span>
              <span>8:00 - 12:00</span>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- Bottom Footer -->
      <div class="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
        <p class="text-gray-400 text-sm mb-4 md:mb-0">
          &copy; {{ new Date().getFullYear() }} Vivero Emma. Todos los derechos reservados.
        </p>
        <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
          <a href="#" class="hover:text-white transition-colors">Términos de servicio</a>
          <a href="#" class="hover:text-white transition-colors">Política de privacidad</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
const quickLinks = [
  { name: 'Inicio', path: '/' },
  { name: 'Productos', path: '/productos' },
  { name: 'Servicios', path: '/servicios' },
  { name: 'Nosotros', path: '/nosotros' },
  { name: 'Contacto', path: '/contacto' },
  // { name: 'Blog', path: '/blog' }
];
</script>