<template>
  <article
    class="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2"
  >
    <div class="relative aspect-square overflow-hidden bg-emerald-50">
      <NuxtImg
        :src="imageSource"
        provider="none"
        :alt="displayedProduct.imageAlt || displayedProduct.commonName"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        sizes="sm:100vw md:50vw lg:33vw"
        @error="usePlaceholder"
      />
      <span
        class="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-800 shadow-sm backdrop-blur"
      >
        {{ displayedProduct.category }}
      </span>
    </div>

    <div class="flex flex-1 flex-col p-5">
      <div class="flex-1">
        <h2 class="text-xl font-semibold leading-tight text-slate-900">
          {{ displayedProduct.commonName }}
        </h2>
        <p class="mt-1 text-sm italic text-slate-500">
          {{ displayedProduct.scientificName }}
        </p>
        <p class="mt-4 text-2xl font-bold text-emerald-700">
          {{ formatPrice(displayedProduct.price) }}
        </p>
      </div>

      <div class="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-100 py-4">
        <div class="flex flex-col items-center gap-1.5 px-2 text-center">
          <div class="flex gap-0.5 text-emerald-600" :aria-label="displayedProduct.watering.label">
            <component
              v-for="drop in 3"
              :key="drop"
              :is="BeakerIcon"
              class="h-5 w-5"
              :class="drop <= displayedProduct.watering.level ? 'opacity-100' : 'opacity-20'"
              aria-hidden="true"
            />
          </div>
          <span class="text-[11px] font-medium leading-tight text-slate-600">
            {{ displayedProduct.watering.label }}
          </span>
        </div>

        <div class="flex flex-col items-center gap-1.5 px-2 text-center">
          <component
            :is="lightIcon"
            class="h-5 w-5 text-amber-500"
            aria-hidden="true"
          />
          <span class="text-[11px] font-medium leading-tight text-slate-600">
            {{ displayedProduct.light.label }}
          </span>
        </div>

        <div class="flex flex-col items-center gap-1.5 px-2 text-center">
          <FireIcon class="h-5 w-5 text-sky-600" aria-hidden="true" />
          <span class="text-[11px] font-medium leading-tight text-slate-600">
            {{ displayedProduct.temperature }}
          </span>
        </div>
      </div>

      <button
        type="button"
        class="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 active:scale-[0.98]"
        @click="emit('add', displayedProduct)"
      >
        <PlusIcon class="h-5 w-5" aria-hidden="true" />
        Añadir al carrito
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  BeakerIcon,
  CloudIcon,
  FireIcon,
  PlusIcon,
  SunIcon
} from '@heroicons/vue/24/outline'

export interface ProductCardData {
  id: number | string
  category: string
  commonName: string
  scientificName: string
  price: number
  image: string
  imageAlt?: string
  watering: {
    level: 1 | 2 | 3
    label: string
  }
  light: {
    icon: string
    label: string
  }
  temperature: string
}

interface Props {
  product?: ProductCardData
  currency?: string
  locale?: string
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'ARS',
  locale: 'es-AR'
})

const emit = defineEmits<{
  add: [product: ProductCardData]
}>()

const mockProduct: ProductCardData = {
  id: 'monstera-deliciosa',
  category: 'Plantas de interior',
  commonName: 'Monstera deliciosa',
  scientificName: 'Monstera deliciosa',
  price: 18500,
  image: 'https://images.unsplash.com/photo-1614594576052-efb6c1e6f80b?auto=format&fit=crop&w=900&q=85',
  imageAlt: 'Monstera deliciosa en una maceta clara',
  watering: {
    level: 2,
    label: 'Riego medio'
  },
  light: {
    icon: 'heroicons:sun',
    label: 'Semisombra'
  },
  temperature: '18-27 °C'
}

const displayedProduct = computed(() => props.product ?? mockProduct)
const lightIcon = computed(() => displayedProduct.value.light.icon === 'cloud' ? CloudIcon : SunIcon)
const placeholderImage = '/placeholder.png'
const imageSource = ref(displayedProduct.value.image || placeholderImage)

watch(
  () => displayedProduct.value.image,
  (image) => {
    imageSource.value = image || placeholderImage
  }
)

const usePlaceholder = () => {
  imageSource.value = placeholderImage
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency: props.currency,
    maximumFractionDigits: 0
  }).format(price)
</script>
