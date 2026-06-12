<template>
    <div>
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Mi Perfil</h1>
        <p class="text-gray-600">Administra tu información personal y preferencias</p>
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Profile Information -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Información Personal</h2>
            
            <form @submit.prevent="updateProfile" class="space-y-6">
              <!-- Profile picture -->
              <div class="flex flex-col sm:flex-row sm:items-center gap-6">
                <div class="flex-shrink-0">
                  <div v-if="authStore.user?.name" class="w-24 h-24 rounded-full bg-primary text-white flex items-center justify-center text-3xl font-bold">
                    {{ getInitials(authStore.user.name) }}
                  </div>
                </div>
                <div>
                  <button type="button" class="btn btn-outline mb-2">
                    Cambiar foto
                  </button>
                  <p class="text-sm text-gray-500">
                    JPG, GIF o PNG. Máximo 1MB
                  </p>
                </div>
              </div>
  
              <!-- Form fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input 
                    type="text" 
                    v-model="form.name" 
                    class="input w-full" 
                    required
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input 
                    type="email" 
                    v-model="form.email" 
                    class="input w-full" 
                    required
                  />
                </div>
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <input 
                  type="text" 
                  :value="getRoleName(authStore.user?.role)" 
                  class="input w-full" 
                  disabled
                />
              </div>
  
              <div class="flex justify-end">
                <button type="submit" class="btn btn-primary">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
  
          <!-- Change Password -->
          <div class="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Cambiar Contraseña</h2>
            
            <form @submit.prevent="updatePassword" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña actual
                </label>
                <input 
                  type="password" 
                  v-model="passwordForm.current" 
                  class="input w-full" 
                  required
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nueva contraseña
                </label>
                <input 
                  type="password" 
                  v-model="passwordForm.new" 
                  class="input w-full" 
                  required
                />
              </div>
  
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar nueva contraseña
                </label>
                <input 
                  type="password" 
                  v-model="passwordForm.confirm" 
                  class="input w-full" 
                  required
                />
              </div>
  
              <div class="flex justify-end">
                <button type="submit" class="btn btn-primary">
                  Actualizar contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
  
        <!-- Account Settings -->
        <div>
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-6">Configuración de la cuenta</h2>
            
            <div class="space-y-6">
              <!-- Notifications -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-4">Notificaciones</h3>
                <div class="space-y-4">
                  <label class="flex items-center">
                    <input 
                      type="checkbox" 
                      v-model="settings.emailNotifications"
                      class="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="ml-2 text-sm text-gray-600">
                      Recibir notificaciones por email
                    </span>
                  </label>
  
                  <label class="flex items-center">
                    <input 
                      type="checkbox" 
                      v-model="settings.salesNotifications"
                      class="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="ml-2 text-sm text-gray-600">
                      Notificaciones de ventas
                    </span>
                  </label>
  
                  <label class="flex items-center">
                    <input 
                      type="checkbox" 
                      v-model="settings.stockNotifications"
                      class="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span class="ml-2 text-sm text-gray-600">
                      Alertas de stock bajo
                    </span>
                  </label>
                </div>
              </div>
  
              <!-- Theme -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-4">Tema</h3>
                <select v-model="settings.theme" class="input w-full">
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="system">Sistema</option>
                </select>
              </div>
  
              <!-- Language -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-4">Idioma</h3>
                <select v-model="settings.language" class="input w-full">
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                </select>
              </div>
  
              <!-- Session -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-4">Sesión</h3>
                <button 
                  @click="logout" 
                  class="btn btn-outline text-error hover:bg-error/10 w-full"
                >
                  <Icon name="heroicons:arrow-right-on-rectangle" class="w-5 h-5 mr-2" />
                  Cerrar sesión
                </button>
              </div>
  
              <!-- Delete Account -->
              <div>
                <h3 class="text-sm font-medium text-gray-900 mb-4">Cuenta</h3>
                <button 
                  @click="confirmDeleteAccount" 
                  class="btn btn-outline text-error hover:bg-error/10 w-full"
                >
                  <Icon name="heroicons:trash" class="w-5 h-5 mr-2" />
                  Eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { useAuthStore } from '~/stores/auth';
  import { useRouter } from 'vue-router';
  
  definePageMeta({
    layout: 'admin'
  });
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  // Form state
  const form = reactive({
    name: '',
    email: ''
  });
  
  const passwordForm = reactive({
    current: '',
    new: '',
    confirm: ''
  });
  
  const settings = reactive({
    emailNotifications: true,
    salesNotifications: true,
    stockNotifications: false,
    theme: 'light',
    language: 'es'
  });
  
  // Initialize form with user data
  onMounted(() => {
    if (authStore.user) {
      form.name = authStore.user.name;
      form.email = authStore.user.email;
    }
  });
  
  // Helper function to get initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };
  
  // Helper function to get role name
  const getRoleName = (role) => {
    const roles = {
      'admin': 'Administrador',
      'encargado': 'Encargado',
      'empleado': 'Empleado'
    };
    return roles[role] || role;
  };
  
  // Form handlers
  const updateProfile = async () => {
    try {
      // Here you would typically make an API call to update the profile
      console.log('Updating profile:', form);
      alert('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    }
  };
  
  const updatePassword = async () => {
    try {
      if (passwordForm.new !== passwordForm.confirm) {
        alert('Las contraseñas no coinciden');
        return;
      }
      // Here you would typically make an API call to update the password
      console.log('Updating password');
      
      // Reset form
      passwordForm.current = '';
      passwordForm.new = '';
      passwordForm.confirm = '';
      
      alert('Contraseña actualizada exitosamente');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error al actualizar la contraseña');
    }
  };
  
  // Logout handler
  const logout = async () => {
    await authStore.logout();
    router.push('/auth/login');
  };
  
  // Delete account handler
  const confirmDeleteAccount = () => {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      // Here you would typically make an API call to delete the account
      console.log('Deleting account');
      alert('Cuenta eliminada exitosamente');
      logout();
    }
  };
  </script>