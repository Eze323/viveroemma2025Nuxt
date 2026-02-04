import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export const useResellerCartStore = defineStore('resellerCart', () => {
    const items = ref<CartItem[]>([]);

    // Actions
    const addToCart = (product: any) => {
        const existing = items.value.find(i => i.id === product.id);
        if (existing) {
            existing.quantity++;
        } else {
            items.value.push({
                id: product.id,
                name: product.name,
                price: Number(product.precio_venta),
                quantity: 1,
                image: product.image_url
            });
        }
    };

    const removeFromCart = (id: number) => {
        items.value = items.value.filter(i => i.id !== id);
    };

    const updateQuantity = (id: number, quantity: number) => {
        const item = items.value.find(i => i.id === id);
        if (item) {
            item.quantity = Math.max(1, quantity);
        }
    };

    const clearCart = () => {
        items.value = [];
    };

    // Getters
    const totalItems = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0));
    const totalPrice = computed(() => items.value.reduce((sum, i) => sum + (i.price * i.quantity), 0));
    const potentialPoints = computed(() => Math.floor(totalPrice.value / 100)); // Logic matching backend

    return {
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        potentialPoints
    };
});
