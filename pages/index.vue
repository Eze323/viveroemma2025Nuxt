<template>
  <div>
    <!-- Hero section -->
    <section class="relative bg-gradient-to-r from-primary to-primary-dark overflow-hidden">
      <div class="absolute inset-0 opacity-20 bg-pattern"></div>
      <div class="container-custom relative py-20 lg:py-32 flex flex-col lg:flex-row items-center">
        <div class="lg:w-1/2 text-white z-10 mb-12 lg:mb-0">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
            Vivero Emma
          </h1>
          <p class="text-xl md:text-2xl mt-6 font-light max-w-xl animate-slide-up">
            Tu vivero de confianza en Cuartel V, Moreno. Ofrecemos plantas de calidad, asesoramiento personalizado y todo para tu jardín.
          </p>
          <div class="mt-8 flex flex-wrap gap-4 animate-fade-in" style="animation-delay: 0.2s;">
            <NuxtLink to="/productos" class="btn bg-white text-primary hover:bg-gray-100">
              Ver productos
            </NuxtLink>
            <NuxtLink to="/contacto" class="btn bg-transparent border-2 border-white text-white hover:bg-white/10">
              Contáctanos
            </NuxtLink>
          </div>
        </div>
        <div class="lg:w-1/2 relative animate-fade-in" style="animation-delay: 0.3s;">
          <img 
            src="https://images.pexels.com/photos/31779762/pexels-photo-31779762/free-photo-of-cestas-colgantes-de-flores-vibrantes-en-invernadero.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
            alt="Vivero Emma - Plantas" 
            class="rounded-lg shadow-2xl relative z-10 max-w-full h-auto"
            loading="lazy"
          />
          <div class="absolute -bottom-6 -right-6 w-24 h-24 bg-accent rounded-full z-0"></div>
          <div class="absolute -top-6 -left-6 w-16 h-16 bg-secondary rounded-full z-0"></div>
        </div>
      </div>
    </section>
    
    <!-- Features section -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">¿Por qué elegirnos?</h2>
          <p class="mt-4 text-lg text-gray-600">
            En Vivero Emma nos apasiona ofrecer las mejores plantas y servicios de jardinería con más de 15 años de experiencia.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="(feature, index) in features" :key="index" 
            class="bg-white p-8 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div class="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mb-6">
              <Icon :name="feature.icon" class="w-6 h-6 text-primary" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Products preview section -->
    <section class="py-16">
      <div class="container-custom">
        <div class="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Nuestros productos</h2>
            <p class="mt-4 text-lg text-gray-600">
              Descubre nuestra selección de plantas, flores y accesorios para jardinería.
            </p>
          </div>
          <NuxtLink to="/productos" class="btn btn-primary mt-6 md:mt-0">
            Ver todos los productos
          </NuxtLink>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(product, index) in products" :key="index" 
            class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div class="h-64 relative overflow-hidden">
              <img 
              :src="product.image" 
              :alt="product.name" 
              class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" 
              loading="lazy"
              />
            </div>
            <div class="p-6">
              <h3 class="text-lg font-bold text-gray-900">{{ product.name }}</h3>
              <p class="text-gray-500 text-sm mb-4">{{ product.category }}</p>
              <div class="flex justify-between items-center">
                <span class="text-xl font-bold text-primary">${{ product.price }}</span>
                <button class="btn btn-outline text-sm">Agregar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials section -->
    <section class="py-16 bg-gray-50">
      <div class="container-custom">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Lo que dicen nuestros clientes</h2>
          <p class="mt-4 text-lg text-gray-600">
            Estas son algunas opiniones de nuestros clientes satisfechos.
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(testimonial, index) in testimonials" :key="index" 
            class="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div class="flex items-center mb-6">
              <div class="mr-4">
                <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-primary font-bold">{{ testimonial.name.charAt(0) }}</span>
                </div>
              </div>
              <div>
                <h4 class="text-lg font-bold text-gray-900">{{ testimonial.name }}</h4>
                <div class="flex text-yellow-400">
                  <Icon v-for="star in 5" :key="star" 
                    :name="star <= testimonial.rating ? 'heroicons:star-solid' : 'heroicons:star'" 
                    class="w-4 h-4" />
                </div>
              </div>
            </div>
            <p class="text-gray-600 italic">{{ testimonial.comment }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Location section -->
    <section class="py-16">
      <div class="container-custom">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Encuéntranos</h2>
            <p class="text-lg text-gray-600 mb-8">
              Estamos ubicados en Cuartel V, Moreno, Buenos Aires, Argentina. Te invitamos a visitarnos para conocer nuestra gran variedad de plantas y productos para jardinería.
            </p>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <Icon name="heroicons:map-pin" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div class="ml-4">
                  <h4 class="font-bold text-gray-900">Dirección</h4>
                  <p class="text-gray-600">Cnel. Emeterio de Escalada 10565, B1744 Cuartel V, Provincia de Buenos Aires</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <Icon name="heroicons:clock" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div class="ml-4">
                  <h4 class="font-bold text-gray-900">Horarios</h4>
                  <p class="text-gray-600">Lunes a Sábado: 7:20 - 18:00</p>
                  <p class="text-gray-600">Domingos: 8:00 - 12:00</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <Icon name="heroicons:phone" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div class="ml-4">
                  <h4 class="font-bold text-gray-900">Teléfono (Romy) - (José)</h4>
                  <p class="text-gray-600">(+54) 11-5116-5807</p> 
                   <p class="text-gray-600">(+54) 11-5181-6570</p>
                   <p class="text-gray-600">
                   <a href="https://api.whatsapp.com/send?phone=51165807&text=Hola%20quiero%20m%C3%A1s%20informaci%C3%B3n">
                     <button>Chatea con nosotros en WhatsApp</button>
                    </a>
                  </p>
                  </div>
              </div>
              
              <!-- <div class="flex items-start">
                <Icon name="heroicons:envelope" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div class="ml-4">
                  <h4 class="font-bold text-gray-900">Email</h4>
                  <p class="text-gray-600">info@viveroemma.com</p>
                </div>
              </div> -->
            </div>
            
            <NuxtLink 
              to="https://www.google.com.ar/maps/place/Vivero+Emma/@-34.5380952,-58.8047355,16z/data=!4m14!1m7!3m6!1s0x95bc97de6e6869bb:0xba563040b080cdf9!2sVivero+Emma!8m2!3d-34.5387816!4d-58.8015398!16s%2Fg%2F11vzy96__n!3m5!1s0x95bc97de6e6869bb:0xba563040b080cdf9!8m2!3d-34.5387816!4d-58.8015398!16s%2Fg%2F11vzy96__n?hl=es&entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              class="btn btn-primary mt-8 inline-flex items-center"
            >
              Ver en Google Maps
              <Icon name="heroicons:arrow-top-right-on-square" class="ml-2 w-4 h-4" />
            </NuxtLink>
          </div>
          
          <div class="bg-gray-200 rounded-lg overflow-hidden h-96 shadow-lg">
            <!-- Google Maps embed would go here -->
            <iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.041380756593!2d-58.8047355!3d-34.5380952!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bc97de6e6869bb%3A0xba563040b080cdf9!2sVivero%20Emma!5e0!3m2!1ses!2sar!4v1716842345678!5m2!1ses!2sar" 
    width="100%" 
    height="100%" 
    style="border:0;" 
    allowfullscreen="" 
    loading="lazy" 
    referrerpolicy="no-referrer-when-downgrade"
    title="Ubicación de Vivero Emma"
  ></iframe>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Call to action -->
    <section class="py-20 bg-primary text-white">
      <div class="container-custom text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-6">¿Listo para embellecer tu espacio verde?</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Visítanos en Vivero Emma y déjanos ayudarte a crear el jardín de tus sueños.
        </p>
        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink to="/productos" class="btn bg-white text-primary hover:bg-gray-100">
            Ver productos
          </NuxtLink>
          <NuxtLink to="/contacto" class="btn bg-transparent border-2 border-white hover:bg-white/10">
            Contactar ahora
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Features data
const features = [
  {
    title: 'Amplia variedad',
    description: 'Ofrecemos una amplia selección de plantas, flores, árboles y todo lo que necesitas para tu jardín.',
    icon: 'heroicons:sparkles'
  },
  {
    title: 'Asesoramiento experto',
    description: 'Nuestro equipo de expertos está siempre disponible para brindarte consejos sobre el cuidado de tus plantas.',
    icon: 'heroicons:light-bulb'
  },
  {
    title: 'Productos de calidad',
    description: 'Todos nuestros productos son seleccionados cuidadosamente para garantizar su calidad y durabilidad.',
    icon: 'heroicons:check-badge'
  },
  {
    title: 'Precios competitivos',
    description: 'Ofrecemos precios justos y competitivos para que puedas disfrutar de tu jardín sin gastar de más.',
    icon: 'heroicons:banknotes'
  },
  {
    title: 'Entregas a domicilio',
    description: 'Realizamos entregas a domicilio para que puedas recibir tus plantas sin salir de casa.',
    icon: 'heroicons:truck'
  },
  {
    title: 'Garantía de satisfacción',
    description: 'Garantizamos la calidad de nuestros productos para que puedas comprar con total confianza.',
    icon: 'heroicons:shield-check'
  }
];

// Products data (example)
const products = [
  {
    name: 'Ficus Lyrata',
    category: 'Plantas de interior',
    price: '20.000',
    image: 'https://images.pexels.com/photos/6044736/pexels-photo-6044736.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Monstera Deliciosa',
    category: 'Plantas de interior',
    price: '13.000',
    image: 'https://images.pexels.com/photos/3097770/pexels-photo-3097770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Pino Enano',
    category: 'Árboles',
    price: '5.900',
    image: 'https://www.grupoalgalia.es/wp-content/uploads/pino-enano-descubre-todo-sobre-esta-maravillosa-especie.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Rosas Rojas',
    category: 'Flores',
    price: '4.200',
    image: 'https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

// Testimonials data
const testimonials = [
  {
    name: 'Laura Gómez',
    rating: 5,
    comment: 'Excelente servicio y calidad en las plantas. El asesoramiento fue muy útil para mi jardín. ¡Recomiendo totalmente Vivero Emma!'
  },
  {
    name: 'Carlos Rodríguez',
    rating: 4,
    comment: 'Muy buena variedad de plantas. Los precios son justos y el personal es muy amable. Volveré pronto.'
  },
  {
    name: 'Marta Sánchez',
    rating: 5,
    comment: 'Las plantas que compré están hermosas y sanas. Además me dieron buenos consejos para su cuidado. Excelente experiencia.'
  }
];
</script>

<style scoped>
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
</style>