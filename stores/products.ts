import { defineStore } from 'pinia';
import type { Product } from '~/types/product';

// API Response types
interface ProductsSuccessResponse {
    success: true;
    data: Product[];
}

interface ProductsErrorResponse {
    success: false;
    error: string;
}

type ProductsApiResponse = ProductsSuccessResponse | ProductsErrorResponse;

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
}

export const useProductStore = defineStore('product', {
    state: () => ({
        products: [] as Product[],
        loaded: false,
        lastUpdate: null as number | null,
        loading: false,
        error: null as string | null,
    }),
    getters: {
        getProducts: (state): Product[] => state.products,
        isLoading: (state): boolean => state.loading,
        hasError: (state): boolean => !!state.error,
    },
    actions: {
        async fetchProducts(forceRefresh = false) {
            if (this.loading) return
            if (this.loaded && !forceRefresh) return
            this.loading = true;
            this.error = null;

            try {
                const { data, error } = await useFetch<ProductsApiResponse>('/api/products');

                if (error.value) {
                    throw error.value;
                }

                // Type narrowing: check if response is successful
                if (data.value && data.value.success) {
                    // TypeScript now knows this is ProductsSuccessResponse
                    this.products = data.value.data;
                    this.loaded = true;
                    this.lastUpdate = Date.now();
                } else if (data.value && !data.value.success) {
                    // TypeScript now knows this is ProductsErrorResponse
                    throw new Error(data.value.error || 'Error al obtener productos');
                } else {
                    throw new Error('Error al obtener productos');
                }
            } catch (error: any) {
                this.error = error.data?.statusMessage || error.message || 'Error al obtener productos';
                console.error('Error en fetchProducts:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        forceReload() {
            this.loaded = false;
            this.fetchProducts(true);
        },
    },
}); 