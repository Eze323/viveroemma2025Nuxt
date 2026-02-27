<template>
  <div class="min-h-screen">
    <VitePwaManifest />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<style>
/* .layout-enter-active, .layout-leave-active {
  transition: opacity 0.5s;
}
.layout-enter-from, .layout-leave-to {
  opacity: 0;
  filter: blur(1rem);
} */
 html, body, #__nuxt {
  height: 100dvh; 
  margin:0;
  overflow-x: hidden;
 }
</style>