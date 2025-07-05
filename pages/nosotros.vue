<template>
  <div>
    <!-- Hero section -->
    <section class="bg-primary/5 py-12">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sobre Nosotros</h1>
        <p class="text-xl text-gray-600 max-w-2xl">
          Conoce la historia de Vivero Emma y nuestro compromiso con la naturaleza y la calidad.
        </p>
      </div>
    </section>

    <!-- Story section -->
    <section class="py-12">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Nuestra Historia</h2>
            <p class="text-lg text-gray-600 mb-6">
              Vivero Emma nació en 2010 con la visión de ofrecer plantas de calidad y asesoramiento experto a la comunidad de Cuartel V, Moreno. Lo que comenzó como un pequeño emprendimiento familiar se ha convertido en uno de los viveros más reconocidos de la zona.
            </p>
            <p class="text-lg text-gray-600 mb-6">
              Nos especializamos en la producción y venta de una amplia variedad de plantas, desde especies ornamentales hasta árboles frutales, siempre manteniendo los más altos estándares de calidad.
            </p>
            <div class="grid grid-cols-2 gap-6 mt-8">
              <div class="text-center">
                <div class="text-4xl font-bold text-primary mb-2">15+</div>
                <p class="text-gray-600">Años de experiencia</p>
              </div>
              <div class="text-center">
                <div class="text-4xl font-bold text-primary mb-2">5000+</div>
                <p class="text-gray-600">Clientes satisfechos</p>
              </div>
            </div>
          </div>
          <div class="relative">
            <img 
              src="https://images.pexels.com/photos/31779753/pexels-photo-31779753/free-photo-of-flores-creciendo-en-el-invernadero-del-vivero.jpeg" 
              
              alt="Vivero Emma" 
              class="rounded-lg shadow-lg"
            />
            <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-accent rounded-full z-0"></div>
            <div class="absolute -top-6 -left-6 w-16 h-16 bg-primary rounded-full z-0"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Values section -->
    <section class="py-12 bg-gray-50">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
          <p class="text-lg text-gray-600">
            Los principios que guían nuestro trabajo día a día.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="value in values" :key="value.title" class="bg-white rounded-lg p-6 text-center">
            <div class="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Icon :name="value.icon" class="w-8 h-8 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ value.title }}</h3>
            <p class="text-gray-600">{{ value.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team section -->
    <!-- <section class="py-12">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Nuestro Equipo</h2>
          <p class="text-lg text-gray-600">
            Conoce a los expertos que hacen posible nuestra misión.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="member in team" :key="member.name" 
            class="bg-white rounded-lg shadow-sm overflow-hidden text-center">
            <div class="aspect-w-1 aspect-h-1">
              <img 
                :src="member.image" 
                :alt="member.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900">{{ member.name }}</h3>
              <p class="text-gray-600 mb-4">{{ member.role }}</p>
              <div class="flex justify-center space-x-4">
                
                <a href="#" class="text-gray-400 hover:text-primary">
                  <Icon name="mdi:linkedin" class="w-5 h-5" />
                </a>
                <a href="#" class="text-gray-400 hover:text-primary">
                  <Icon name="mdi:twitter" class="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Certifications section -->
    <section class="py-12 bg-gray-50">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Certificaciones y Reconocimientos</h2>
          <p class="text-lg text-gray-600">
            Nuestro compromiso con la calidad avalado por instituciones reconocidas.
          </p>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="cert in certifications" :key="cert.name" 
            class="bg-white rounded-lg p-6 text-center">
            <img 
              :src="cert.logo" 
              :alt="cert.name"
              class="h-16 mx-auto mb-4"
            />
            <h3 class="font-bold text-gray-900">{{ cert.name }}</h3>
            <p class="text-sm text-gray-600">{{ cert.year }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA section -->
    <section class="py-12">
      <div class="container-custom">
        <div class="bg-primary rounded-lg px-6 py-12 md:p-12 text-center">
          <h2 class="text-3xl font-bold text-white mb-4">¿Quieres formar parte de nuestro equipo?</h2>
          <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Estamos siempre en busca de personas apasionadas por la naturaleza y el servicio al cliente.
          </p>
          <button class="btn bg-white text-primary hover:bg-gray-100">
            Ver oportunidades laborales
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Values data
import iso9001Logo from '@/assets/images/Ramos-iso-9001.jpg';
import ecoFriendlyLogo from '@/assets/images/ecofriendly.webp';
import greenBussinessLogo from '@/assets/images/green-business.jpg';
import bestServiceLogo from '@/assets/images/bestservice.jpeg';

const values = [
  {
    title: 'Calidad',
    description: 'Nos comprometemos a ofrecer solo productos y servicios de la más alta calidad.',
    icon: 'heroicons:check-badge'
  },
  {
    title: 'Sostenibilidad',
    description: 'Trabajamos de manera responsable con el medio ambiente.',
    icon: 'heroicons:heart'
  },
  {
    title: 'Servicio',
    description: 'Brindamos atención personalizada y asesoramiento experto.',
    icon: 'heroicons:user-group'
  }
];

// Team members
const team = [
  {
    name: 'Emma Rodríguez',
    role: 'Fundadora y Directora',
    image: 'https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg'
  },
  {
    name: 'Juan Pérez',
    role: 'Jefe de Producción',
    image: 'https://images.pexels.com/photos/8101532/pexels-photo-8101532.jpeg'
  },
  {
    name: 'María García',
    role: 'Paisajista',
    image: 'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg'
  },
  {
    name: 'Carlos López',
    role: 'Especialista en Plantas',
    image: 'https://images.pexels.com/photos/8101537/pexels-photo-8101537.jpeg'
  }
];

// Certifications
const certifications = [
  {
    name: 'ISO 9001',
    year: '2023',
    logo: iso9001Logo
  },
  {
    name: 'Green Business',
    year: '2022',
    logo: greenBussinessLogo
  },
  {
    name: 'Eco Friendly',
    year: '2023',
    logo: ecoFriendlyLogo
  },
  {
    name: 'Best Service',
    year: '2024',
    logo: bestServiceLogo
  }
];
</script>