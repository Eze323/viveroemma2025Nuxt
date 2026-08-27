<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 flex flex-col items-center justify-center">
    <div class="max-w-4xl w-full text-center mb-10">
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4 shadow-inner">
        ✨ SVG Filter + CSS GPU Acceleration
      </div>
      <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent mb-3">
        Efecto Viscoso y Líquido (Gooey Effect)
      </h1>
      <p class="text-slate-400 text-base max-w-2xl mx-auto">
        Demostración interactiva de fusión líquida utilizando filtros SVG <code class="text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">&lt;feGaussianBlur&gt;</code> y <code class="text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">&lt;feColorMatrix&gt;</code> combinados con transformaciones fluidas CSS.
      </p>
    </div>

    <!-- Componente Gooey Navegación y Botones Viscosos -->
    <GooeyNav />

    <!-- Sección explicativa de la Arquitectura -->
    <div class="max-w-4xl w-full mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div class="text-emerald-400 text-xl font-bold mb-2">1. SVG Filter Matrix</div>
        <p class="text-slate-400 text-xs leading-relaxed">
          Aplica un desenfoque de <code class="text-emerald-300">stdDeviation="10"</code> y fuerza el contraste del canal Alfa a través de la matriz <code class="text-emerald-300">values="... 19 -9"</code> para definir la tensión superficial.
        </p>
      </div>

      <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div class="text-teal-400 text-xl font-bold mb-2">2. Rendimiento GPU</div>
        <p class="text-slate-400 text-xs leading-relaxed">
          Se evitan cambios en la geometría del DOM delegando las animaciones a la GPU con <code class="text-emerald-300">translate3d()</code> y curvas elásticas <code class="text-emerald-300">cubic-bezier</code>.
        </p>
      </div>

      <div class="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div class="text-cyan-400 text-xl font-bold mb-2">3. Tipografía Nítida</div>
        <p class="text-slate-400 text-xs leading-relaxed">
          Separación en dos capas: la capa inferior renderiza las gotas viscosas con filtro SVG, mientras que la capa superior sostiene texto e íconos 100% nítidos.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: 'Efecto Gooey Líquido - Vivero Emma'
});
</script>
