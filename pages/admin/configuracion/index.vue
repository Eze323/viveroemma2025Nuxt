```vue
<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Configuración</h1>
      <p class="text-gray-600">Administra la configuración general del sistema</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- General Settings -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Configuración General</h2>
          
          <form @submit.prevent="saveGeneralSettings" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Negocio
              </label>
              <input 
                type="text" 
                v-model="generalSettings.businessName" 
                class="input w-full" 
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <input 
                type="text" 
                v-model="generalSettings.address" 
                class="input w-full" 
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input 
                  type="tel" 
                  v-model="generalSettings.phone" 
                  class="input w-full" 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input 
                  type="email" 
                  v-model="generalSettings.email" 
                  class="input w-full" 
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Horario de Atención
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Lunes a Sábado</label>
                  <div class="flex gap-2">
                    <input 
                      type="time" 
                      v-model="generalSettings.weekdayOpen" 
                      class="input flex-1" 
                    />
                    <span class="flex items-center">a</span>
                    <input 
                      type="time" 
                      v-model="generalSettings.weekdayClose" 
                      class="input flex-1" 
                    />
                  </div>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Domingos</label>
                  <div class="flex gap-2">
                    <input 
                      type="time" 
                      v-model="generalSettings.sundayOpen" 
                      class="input flex-1" 
                    />
                    <span class="flex items-center">a</span>
                    <input 
                      type="time" 
                      v-model="generalSettings.sundayClose" 
                      class="input flex-1" 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2">
  <span class="text-sm font-medium">Modo Papel:</span>
  <input 
    type="checkbox" 
    v-model="configStore.simpleDashboard" 
    class="w-10 h-5 bg-gray-200 rounded-full appearance-none checked:bg-primary-600 relative cursor-pointer transition-colors"
  >
</div>

            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>

        <!-- Email Settings -->
        <div class="bg-white rounded-lg shadow-sm p-6 mt-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Configuración de Email</h2>
          
          <form @submit.prevent="saveEmailSettings" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Servidor SMTP
              </label>
              <input 
                type="text" 
                v-model="emailSettings.smtpServer" 
                class="input w-full" 
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Puerto
                </label>
                <input 
                  type="number" 
                  v-model="emailSettings.port" 
                  class="input w-full" 
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Seguridad
                </label>
                <select v-model="emailSettings.security" class="input w-full">
                  <option value="tls">TLS</option>
                  <option value="ssl">SSL</option>
                  <option value="none">Ninguna</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input 
                type="text" 
                v-model="emailSettings.username" 
                class="input w-full" 
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input 
                type="password" 
                v-model="emailSettings.password" 
                class="input w-full" 
              />
            </div>

            <div class="flex justify-end">
              <button type="submit" class="btn btn-primary">
                Guardar configuración en taka taka
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- System Info -->
      <div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-6">Información del Sistema</h2>
          
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-medium text-gray-700">Versión</h3>
              <p class="text-gray-600">1.0.0</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-700">Última actualización</h3>
              <p class="text-gray-600">15/04/2025</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-700">Base de datos</h3>
              <p class="text-gray-600">PostgreSQL 15.0</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium text-gray-700">Espacio en disco</h3>
              <div class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-primary h-2 rounded-full" style="width: 45%"></div>
                </div>
                <p class="text-sm text-gray-600 mt-1">450MB de 1GB usado</p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <button class="btn btn-outline w-full mb-3">
              <Icon name="heroicons:arrow-path" class="w-5 h-5 mr-2" />
              Verificar actualizaciones
            </button>
            <button class="btn btn-outline w-full text-error hover:bg-error/10">
              <Icon name="heroicons:trash" class="w-5 h-5 mr-2" />
              Limpiar caché
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useConfigStore } from '~/stores/config'; // <-- Importa el nuevo store
definePageMeta({
  layout: 'admin'
});

const configStore = useConfigStore(); // <-- Instancia el store
// console.log('Configuración de Dashboard Simple en Configuración:', configStore.simpleDashboard);

// General settings state
const generalSettings = reactive({
  businessName: 'Vivero Emma',
  address: 'Cnel. Emeterio de Escalada 10565, B1744 Cuartel V',
  phone: '(+54) 11-5116-5807',
  email: 'info@viveroemma.com',
  weekdayOpen: '07:20',
  weekdayClose: '18:00',
  sundayOpen: '08:00',
  sundayClose: '12:00'
});

// Email settings state
const emailSettings = reactive({
  smtpServer: 'smtp.example.com',
  port: 587,
  security: 'tls',
  username: 'user@example.com',
  password: ''
});

// Save handlers
const saveGeneralSettings = async () => {
  try {
    // Here you would typically make an API call to save the settings
    // console.log('Saving general settings:', generalSettings);
    // Show success message
    alert('Configuración guardada exitosamente');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Error al guardar la configuración');
  }
};

const saveEmailSettings = async () => {
  try {
    // Here you would typically make an API call to save the email settings
    // console.log('Saving email settings:', emailSettings);
    // Show success message
    alert('Configuración de email guardada exitosamente');
  } catch (error) {
    console.error('Error saving email settings:', error);
    alert('Error al guardar la configuración de email');
  }
};
</script>
```