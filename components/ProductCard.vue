<template>
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:ring-offset-2"
  >
    <!-- 1. SECCIÓN DE IMAGEN -->
    <div class="relative aspect-square w-full overflow-hidden bg-emerald-50/50 dark:bg-slate-800/50">
      <!-- NuxtImg con carga diferida (lazy loading), zoom en hover y fallback automático -->
      <NuxtImg
        :src="imageSrc"
        :alt="productData.imageAlt || productData.commonName"
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        loading="lazy"
        decoding="async"
        sizes="xs:100vw sm:50vw md:33vw lg:25vw"
        @error="handleImageError"
      />

      <!-- Badge Categoría / Origen flotante -->
      <span
        class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 shadow-sm backdrop-blur-md dark:bg-slate-900/90 dark:text-emerald-300"
      >
        {{ productData.category }}
      </span>

      <!-- Badge de Descuento (si aplica) -->
      <span
        v-if="productData.discountPercent"
        class="absolute right-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-md"
      >
        -{{ productData.discountPercent }}%
      </span>

      <!-- Botón de Favorito / Deseos -->
      <button
        type="button"
        class="absolute right-3 bottom-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md backdrop-blur-md transition hover:bg-white hover:text-rose-500 active:scale-90 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:text-rose-400"
        :aria-label="isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'"
        @click.stop="toggleFavorite"
      >
        <Icon
          :name="isFavorite ? 'heroicons:heart-solid' : 'heroicons:heart'"
          class="h-5 w-5 transition-colors"
          :class="{ 'text-rose-500 dark:text-rose-400': isFavorite }"
        />
      </button>
    </div>

    <!-- 2. SECCIÓN DE INFORMACIÓN -->
    <div class="flex flex-1 flex-col p-5">
      <!-- Encabezado y Nombres -->
      <div class="flex-1">
        <!-- Subtítulo de categoría sutil -->
        <p class="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
          {{ productData.category }}
        </p>

        <!-- Nombre común (Título principal con fuerte jerarquía) -->
        <h3 class="mt-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
          {{ productData.commonName }}
        </h3>

        <!-- Nombre científico (Texto secundario en cursiva) -->
        <p class="mt-0.5 text-xs italic text-slate-500 dark:text-slate-400 font-serif">
          {{ productData.scientificName }}
        </p>

        <!-- Precio destacado con soporte para descuento -->
        <div class="mt-3 flex items-baseline gap-2">
          <span class="text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-400">
            {{ formattedPrice }}
          </span>
          <span
            v-if="productData.originalPrice"
            class="text-xs text-slate-400 line-through dark:text-slate-500"
          >
            {{ formatCurrency(productData.originalPrice) }}
          </span>
        </div>
      </div>

      <!-- 3. SECCIÓN DE INDICADORES DE CUIDADOS (ICONOS LIMPIOS) -->
      <!-- Usa iconos MDI y Heroicons con @nuxt/icon -->
      <div
        v-if="showCareGuides"
        class="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-50/80 p-2.5 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-800/80"
        aria-label="Requisitos de cuidado de la planta"
      >
        <!-- Indicador de Riego (Gotas dinámicas: 1=Bajo, 2=Medio, 3=Abundante) -->
        <div
          class="flex flex-col items-center justify-center text-center"
          :title="`Nivel de riego: ${productData.watering.label}`"
        >
          <div
            class="flex items-center justify-center gap-0.5 text-sky-500"
            :aria-label="`Riego: ${productData.watering.level} de 3 gotas`"
          >
            <Icon
              v-for="drop in 3"
              :key="drop"
              name="mdi:water"
              class="h-4 w-4 transition-opacity"
              :class="drop <= productData.watering.level ? 'opacity-100' : 'opacity-25'"
              aria-hidden="true"
            />
          </div>
          <span class="mt-1 text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-300 line-clamp-1">
            {{ productData.watering.label }}
          </span>
        </div>

        <!-- Indicador de Luz (Sol / Semisombra / Sombra) -->
        <div
          class="flex flex-col items-center justify-center border-x border-slate-200/80 px-1 text-center dark:border-slate-700/80"
          :title="`Luz requerida: ${productData.light.label}`"
        >
          <Icon
            :name="lightIcon"
            class="h-4 w-4 text-amber-500"
            aria-hidden="true"
          />
          <span class="mt-1 text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-300 line-clamp-1">
            {{ productData.light.label }}
          </span>
        </div>

        <!-- Indicador de Temperatura (Termómetro) -->
        <div
          class="flex flex-col items-center justify-center text-center"
          :title="`Rango de temperatura: ${productData.temperature}`"
        >
          <Icon
            name="mdi:thermometer"
            class="h-4 w-4 text-rose-500"
            aria-hidden="true"
          />
          <span class="mt-1 text-[11px] font-medium leading-tight text-slate-600 dark:text-slate-300 line-clamp-1">
            {{ productData.temperature }}
          </span>
        </div>
      </div>

      <!-- 4. SECCIÓN DE ACCIÓN -->
      <div class="mt-5 pt-1">
        <button
          type="button"
          class="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-800 hover:shadow-md hover:shadow-emerald-700/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 active:scale-[0.98] dark:bg-emerald-600 dark:hover:bg-emerald-500"
          @click="handleAddToCart"
        >
          <Icon name="mdi:cart-plus" class="h-5 w-5" aria-hidden="true" />
          <span>{{ actionLabel }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

/**
 * ============================================================================
 * INTERFACES DE TIPOS
 * Diseñadas para ser compatibles tanto con el modelo del frontend como con
 * las columnas habituales de Supabase (snake_case o camelCase).
 * ============================================================================
 */

export type LightType = 'direct' | 'partial' | 'shade'

export interface PlantCareInfo {
  watering: {
    /** Nivel de riego del 1 al 3 (1: Bajo, 2: Medio, 3: Abundante) */
    level: 1 | 2 | 3
    label: string
  }
  light: {
    type?: LightType
    label: string
    /** Icono opcional si se desea sobreescribir */
    icon?: string
  }
  /** Rango o descripción de temperatura ideal (ej: "18° - 27° C") */
  temperature: string
}

export interface PlantProduct {
  id: string | number
  category: string
  commonName: string
  scientificName: string
  price: number
  originalPrice?: number
  discountPercent?: number
  image: string
  imageAlt?: string
  stock?: number
  watering: PlantCareInfo['watering']
  light: PlantCareInfo['light']
  temperature: string
}

/**
 * Interfaz Props para el componente reutilizable
 */
export interface ProductCardProps {
  /** Objeto de producto. Si no se pasa, utiliza los datos de muestra (mock) */
  product?: Partial<PlantProduct> & {
    // Soporte transparente para columnas habituales de Supabase
    common_name?: string
    scientific_name?: string
    precio_venta?: number
    image_url?: string
    watering_level?: 1 | 2 | 3
    watering_label?: string
    light_type?: LightType
    light_label?: string
    temp_range?: string
  }
  /** Código de moneda ISO (default: 'ARS') */
  currency?: string
  /** Locale para el formateador de precio (default: 'es-AR') */
  locale?: string
  /** Mostrar u ocultar la barra de indicadores de cuidado */
  showCareGuides?: boolean
  /** Texto del botón de acción */
  actionLabel?: string
}

const props = withDefaults(defineProps<ProductCardProps>(), {
  currency: 'ARS',
  locale: 'es-AR',
  showCareGuides: true,
  actionLabel: 'Añadir al carrito'
})

/**
 * Emits tipados para eventos del componente
 */
const emit = defineEmits<{
  (e: 'add', product: PlantProduct): void
  (e: 'toggle-favorite', productId: string | number, isFavorite: boolean): void
}>()

// Estado reactivo local para interacción de favoritos
const isFavorite = ref(false)

/**
 * ============================================================================
 * DATOS DE MUESTRA (MOCK DATA)
 * Proporciona un producto realista de vivero para visualizar el componente
 * de inmediato sin necesidad de backend.
 * ============================================================================
 */
const mockPlantProduct: PlantProduct = {
  id: 'monstera-deliciosa-01',
  category: 'Plantas de interior',
  commonName: 'Monstera Deliciosa',
  scientificName: 'Monstera deliciosa Liebm.',
  price: 18500,
  originalPrice: 22000,
  discountPercent: 15,
  image: 'https://images.unsplash.com/photo-1614594576052-efb6c1e6f80b?auto=format&fit=crop&w=800&q=80',
  imageAlt: 'Planta Monstera Deliciosa con hojas verdes fenestradas en maceta moderna',
  stock: 8,
  watering: {
    level: 2,
    label: 'Riego medio'
  },
  light: {
    type: 'partial',
    label: 'Semisombra'
  },
  temperature: '18° - 27° C'
}

/**
 * Mapeo reactivo que normaliza las propiedades recibidas o recurre al Mock.
 * Admite tanto notación camelCase como snake_case (típica de Supabase).
 */
const productData = computed<PlantProduct>(() => {
  const p = props.product

  if (!p) {
    return mockPlantProduct
  }

  // Normalización con fallback
  return {
    id: p.id ?? mockPlantProduct.id,
    category: p.category ?? mockPlantProduct.category,
    commonName: p.commonName ?? p.common_name ?? mockPlantProduct.commonName,
    scientificName: p.scientificName ?? p.scientific_name ?? mockPlantProduct.scientificName,
    price: p.price ?? p.precio_venta ?? mockPlantProduct.price,
    originalPrice: p.originalPrice,
    discountPercent: p.discountPercent,
    image: p.image ?? p.image_url ?? mockPlantProduct.image,
    imageAlt: p.imageAlt ?? (p.commonName || p.common_name || mockPlantProduct.commonName),
    stock: p.stock ?? mockPlantProduct.stock,
    watering: {
      level: p.watering?.level ?? p.watering_level ?? mockPlantProduct.watering.level,
      label: p.watering?.label ?? p.watering_label ?? mockPlantProduct.watering.label
    },
    light: {
      type: p.light?.type ?? p.light_type ?? mockPlantProduct.light.type,
      label: p.light?.label ?? p.light_label ?? mockPlantProduct.light.label,
      icon: p.light?.icon
    },
    temperature: p.temperature ?? p.temp_range ?? mockPlantProduct.temperature
  }
})

/**
 * Selector dinámico del icono de luz según el tipo o configuración
 */
const lightIcon = computed(() => {
  if (productData.value.light.icon) {
    return productData.value.light.icon
  }

  const type = productData.value.light.type
  switch (type) {
    case 'direct':
      return 'mdi:weather-sunny'
    case 'shade':
      return 'mdi:weather-cloudy'
    case 'partial':
    default:
      return 'mdi:weather-partly-cloudy'
  }
})

/**
 * Formateador de moneda configurable según locale y currency
 */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat(props.locale, {
    style: 'currency',
    currency: props.currency,
    maximumFractionDigits: 0
  }).format(amount)
}

const formattedPrice = computed(() => formatCurrency(productData.value.price))

/**
 * Manejador del botón "Añadir al carrito"
 */
const handleAddToCart = () => {
  emit('add', productData.value)
}

/**
 * Manejador de favoritos
 */
const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  emit('toggle-favorite', productData.value.id, isFavorite.value)
}

const fallbackPlaceholder = '/placeholder.png'
const imageSrc = ref(productData.value.image || fallbackPlaceholder)

watch(
  () => productData.value.image,
  (newUrl) => {
    imageSrc.value = newUrl || fallbackPlaceholder
  }
)

const handleImageError = () => {
  if (imageSrc.value !== fallbackPlaceholder) {
    imageSrc.value = fallbackPlaceholder
  }
}
</script>
