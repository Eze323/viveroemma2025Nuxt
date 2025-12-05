<template>
  <div class="cart-item">
    <!-- Imagen del producto -->
    <div
      class="product-image"
      :style="{ backgroundImage: `url(${item.image || placeholderImage})` }"
    />

    <!-- Info del producto -->
    <div class="product-details">
      <h4 class="product-name">{{ item.nombre }}</h4>
      <p class="product-unit-price">${{ formatPrice(item.precioUnitario) }} c/u</p>
      <p class="product-subtotal">
        Subtotal: <strong>${{ formatPrice(item.subtotal || item.precioUnitario * item.cantidad) }}</strong>
      </p>
    </div>

    <!-- Controles (solo en modo edición) -->
    <div v-if="!readonly" class="product-controls">
      <!-- Controles de cantidad -->
      <div class="quantity-controls">
        <button
          @click="decreaseQuantity"
          class="quantity-button decrease"
          :disabled="item.cantidad <= 1"
          aria-label="Disminuir cantidad"
        >
          <span class="material-symbols-outlined">remove</span>
        </button>
        
        <span class="quantity-display">{{ item.cantidad }}</span>
        
        <button
          @click="increaseQuantity"
          class="quantity-button increase"
          aria-label="Aumentar cantidad"
        >
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <button
          @click="$emit('replace', item.id)"
          class="action-button replace"
          title="Reemplazar por producto más barato"
        >
          <span class="material-symbols-outlined">swap_horiz</span>
        </button>
        
        <button
          @click="$emit('remove', item.id)"
          class="action-button remove"
          title="Eliminar producto"
        >
          <span class="material-symbols-outlined">delete</span>
        </button>
      </div>
    </div>

    <!-- Solo cantidad en modo readonly -->
    <div v-else class="readonly-quantity">
      <span class="quantity-badge">x{{ item.cantidad }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VentaItem } from '~/stores/ventas'

interface Props {
  item: VentaItem
  readonly?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updateQuantity: [id: number, quantity: number]
  replace: [id: number]
  remove: [id: number]
}>()

const placeholderImage = 'https://via.placeholder.com/80?text=🌱'

const formatPrice = (price: number | undefined | null): string => {
  return Number(price || 0).toFixed(2)
}

const increaseQuantity = () => {
  emit('updateQuantity', props.item.id, props.item.cantidad + 1)
}

const decreaseQuantity = () => {
  if (props.item.cantidad > 1) {
    emit('updateQuantity', props.item.id, props.item.cantidad - 1)
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  transition: all 0.2s;
}

.cart-item:hover {
  background: #f3f4f6;
}

.product-image {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  background-color: #e5e7eb;
  border-radius: 8px;
}

.product-details {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-unit-price {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 4px 0;
}

.product-subtotal {
  font-size: 14px;
  color: #374151;
  margin: 0;
}

.product-subtotal strong {
  color: #3b82f6;
  font-weight: 600;
}

.product-controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border-radius: 8px;
  padding: 4px;
}

.quantity-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #3b82f6;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.quantity-button:hover:not(:disabled) {
  background: #2563eb;
  transform: scale(1.05);
}

.quantity-button:active:not(:disabled) {
  transform: scale(0.95);
}

.quantity-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.5;
}

.quantity-button .material-symbols-outlined {
  font-size: 20px;
}

.quantity-display {
  min-width: 32px;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button.replace {
  background: #f59e0b;
  color: white;
}

.action-button.replace:hover {
  background: #d97706;
  transform: scale(1.05);
}

.action-button.remove {
  background: #ef4444;
  color: white;
}

.action-button.remove:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.action-button:active {
  transform: scale(0.95);
}

.action-button .material-symbols-outlined {
  font-size: 20px;
}

.readonly-quantity {
  flex-shrink: 0;
}

.quantity-badge {
  display: inline-block;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  font-size: 16px;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .cart-item {
    padding: 12px;
  }
  
  .product-image {
    width: 72px;
    height: 72px;
  }
  
  .product-name {
    font-size: 15px;
  }
  
  .quantity-button,
  .action-button {
    width: 48px;
    height: 48px;
  }
}

/* Animación de entrada */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.cart-item {
  animation: slideIn 0.3s ease-out;
}
</style>
