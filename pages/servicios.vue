<template>
  <div>
    <!-- Hero section -->
    <section class="bg-primary/5 py-12">
      <div class="container-custom">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Nuestros Servicios</h1>
        <p class="text-xl text-gray-600 max-w-2xl">
          Ofrecemos servicios profesionales de jardinería y paisajismo para hacer realidad el jardín de tus sueños.
        </p>
      </div>
    </section>

    <!-- Services grid -->
    <section class="py-12">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="service in services" :key="service.id" 
            class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="aspect-w-16 aspect-h-9">
              <img 
                :src="service.image" 
                :alt="service.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2">{{ service.name }}</h3>
              <p class="text-gray-600 mb-4">{{ service.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-lg font-bold text-primary">
                  Desde ${{ service.price }}
                </span>
                <button class="btn btn-primary">
                  Consultar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Process section -->
    <section class="py-12 bg-gray-50">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Nuestro Proceso</h2>
          <p class="text-lg text-gray-600">
            Seguimos un proceso estructurado para asegurar resultados excepcionales en cada proyecto.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div v-for="(step, index) in process" :key="index" class="text-center">
            <div class="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              {{ index + 1 }}
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">{{ step.title }}</h3>
            <p class="text-gray-600">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-12">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Lo que dicen nuestros clientes</h2>
          <p class="text-lg text-gray-600">
            La satisfacción de nuestros clientes es nuestra mejor recompensa.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="testimonial in testimonials" :key="testimonial.id" 
            class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-center mb-4">
              <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span class="text-primary font-bold">{{ testimonial.name.charAt(0) }}</span>
              </div>
              <div class="ml-4">
                <h4 class="font-bold text-gray-900">{{ testimonial.name }}</h4>
                <div class="flex text-yellow-400">
                  <Icon v-for="star in 5" :key="star" 
                    :name="star <= testimonial.rating ? 'heroicons:star-solid' : 'heroicons:star'" 
                    class="w-4 h-4" 
                  />
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic">{{ testimonial.comment }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA section -->
    <section class="py-12 bg-primary">
      <div class="container-custom text-center">
        <h2 class="text-3xl font-bold text-white mb-4">¿Listo para transformar tu espacio verde?</h2>
        <p class="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Contáctanos hoy mismo y déjanos ayudarte a crear el jardín de tus sueños.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/contacto" class="btn bg-white text-primary hover:bg-gray-100">
            Contactar ahora
          </NuxtLink>
          <button class="btn bg-transparent border-2 border-white text-white hover:bg-white/10">
            Ver más servicios
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Services data
const services = [
  {
    id: 1,
    name: 'Diseño de Jardines',
    description: 'Creamos diseños personalizados que se adaptan a tu espacio y estilo de vida.',
    price: '150,000',
    image: 'https://arpasa.es/wp-content/uploads/2017/03/D1-848x480.jpg.webp'
  },
  {
    id: 2,
    name: 'Mantenimiento',
    description: 'Servicio regular de mantenimiento para mantener tu jardín en óptimas condiciones.',
    price: '25,000',
    image: 'https://www.plantlife.org.uk/wp-content/uploads/2024/05/Bulbous-buttercup-and-Meadow-saxifrage-David-and-Annette-Beeson-2.jpg'
  },
  {
    id: 3,
    name: 'Instalación de Riego',
    description: 'Sistemas de riego automatizados para un cuidado eficiente de tus plantas.',
    price: '380,000',
    image: 'https://blog.homedepot.com.mx/wp-content/uploads/2019/09/riego1280x720-1024x576.jpg'
  }
];

// Process steps
const process = [
  {
    title: 'Consulta Inicial',
    description: 'Evaluamos tus necesidades y objetivos para el proyecto.'
  },
  {
    title: 'Diseño',
    description: 'Creamos un diseño personalizado según tus preferencias.'
  },
  {
    title: 'Implementación',
    description: 'Ejecutamos el proyecto con atención al detalle.'
  },
  {
    title: 'Mantenimiento',
    description: 'Aseguramos el cuidado continuo de tu jardín.'
  }
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: 'María González',
    rating: 5,
    comment: 'Excelente servicio. Transformaron completamente mi jardín y quedó hermoso.'
  },
  {
    id: 2,
    name: 'Carlos Rodríguez',
    rating: 5,
    comment: 'Muy profesionales y atentos. El sistema de riego funciona perfectamente.'
  },
  {
    id: 3,
    name: 'Laura Martínez',
    rating: 4,
    comment: 'Gran trabajo en el diseño de mi jardín. Lo recomiendo totalmente.'
  }
];
</script>