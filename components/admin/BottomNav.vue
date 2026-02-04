<template>
  <nav class="fixed bottom-0 left-0 right-0 border-t border-border-light bg-background-light/90 px-4 pb-safe-bottom pt-2 backdrop-blur-sm dark:border-border-dark dark:bg-background-dark/90 z-50 md:hidden">
    <div class="flex justify-around">
      <NuxtLink
        v-for="navItem in navItems"
        :key="navItem.title"
        :to="navItem.href"
        class="flex flex-1 flex-col items-center justify-center gap-1 py-1"
        :class="isActive(navItem.href) ? 'rounded-full bg-primary/10 text-primary dark:bg-primary/20' : 'text-foreground-light/70 dark:text-foreground-dark/70'"
      >
        <span
          class="material-symbols-outlined"
          :style="isActive(navItem.href) ? 'font-variation-settings: \'FILL\' 1' : ''"
        >
          {{ navItem.icon }}
        </span>
        <span :class="['text-xs', isActive(navItem.href) ? 'font-bold' : 'font-medium']">{{ navItem.title }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const navItems = [
  { title: 'Dashboard', icon: 'dashboard', href: '/admin' },
  { title: 'Productos', icon: 'potted_plant', href: '/admin/productos' },
  { title: 'Ventas', icon: 'paid', href: '/admin/ventas' },
  { title: 'Pedidos', icon: 'local_shipping', href: '/admin/pedidos-mayoristas' },
  { title: 'Clientes', icon: 'groups', href: '/admin/clientes' },
];

const isActive = (href: string) => {
  if (href === '/admin' && route.path === '/admin') return true;
  if (href !== '/admin' && route.path.startsWith(href)) return true;
  return false;
};
</script>

<style scoped>
.pb-safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
