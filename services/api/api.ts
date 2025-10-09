// services/api.ts
import { useRuntimeConfig } from '#app';
import type { get } from '@vueuse/core';
import { useAuthStore } from '~/stores/auth';
//importar interface 


interface Product {
    id: number;
    name: string;
    category: string;
    description: string | null;
    precio_compra: number;
    precio_venta: number;
    stock: number;
    pot_size: string | null;
    image_url: string | null;
    publicado: boolean;
    sku: string | null;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export const useApiService = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const baseUrl = config.public.apiBaseUrl || '/api';

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`;
    }

    return headers;
  };

  const normalizeProduct = (product: any): Product | null => {
    if (!product || typeof product !== 'object' || !product.id || !product.name) {
     // console.warn('Invalid product skipped:', product);
      return null;
    }

    const validCategories = ['planta', 'arbusto', 'plantin', 'otro', 'semilla', 'herramienta'] as const;

    return {
      id: product.id,
      name: String(product.name),
      category: validCategories.includes(product.category) ? product.category : 'otro',
      description: String(product.description || ''),
      precio_compra: Number(product.precio_compra) || 0,
      precio_venta: Number(product.precio_venta) || 0,
      publicado: product.publicado !== undefined ? Boolean(product.publicado) : true,
      sku: product.sku ? String(product.sku) : null,
      stock: Number(product.stock) || 0,
      image_url: product.image_url || 'https://via.placeholder.com/300x200',
      pot_size: ['pequeña', 'mediana', 'grande'].includes(product.pot_size) ? product.pot_size : null,
    };
  };

  const normalizeResponse = <T>(response: any): T => {
    console.log('Respuesta cruda:', response); // Depuración
    // if (!response || !response.success) {
    //   //console.warn('Respuesta inválida:', response);
    //   return { success: false, data: [], error: 'Respuesta inválida de la API' } as T;
    // }

    const data = response.data || response;

    if (Array.isArray(data)) {
      const normalized = data
        .map((item) => (item && 'name' in item && 'category' in item ? normalizeProduct(item) : null))
        .filter((item): item is Product => item !== null);
      //console.log('Datos normalizados:', normalized);
      return { success: true, data: normalized } as T;
    }

    if (data && 'name' in data && 'category' in data) {
      const normalized = normalizeProduct(data);
      //console.log('Dato normalizado:', normalized);
      return { success: true, data: normalized } as T;
    }

    //console.warn('Unrecognized response format:', data);
    return { success: false, data: [], error: 'Formato de respuesta no reconocido' } as T;
  };

  const request = async <T>(url: string, options: any = {}): Promise<T> => {
    try {
      const fullUrl = `${baseUrl}${url}`;
     // console.log('Haciendo solicitud a:', fullUrl); // Depuración
      const response = await $fetch(fullUrl, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...(options.headers || {}),
        },
      });
      return normalizeResponse<T>(response);
    } catch (error: any) {
      const errorData = handleApiError(error);
      throw errorData;
    }
  };

  const handleApiError = (error: any) => {
    if (error.response?.status === 401) {
      authStore.token = null;
      authStore.user = null;
      localStorage.removeItem('token');
      navigateTo('/auth/login');
    }

    //console.error('API Error:', error);
    return {
      message:
        error.response?.data?.message ||
        error.message ||
        'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.',
      response: error.response,
      status: error.response?.status,
      code: error.response?.data?.code,
      errors: error.response?.data?.errors,
    };
  };

  return {
    //sales
    getSales: () => request<ApiResponse<any[]>>('/sales'),
    getSale: (id: number) => request<ApiResponse<any>>(`/sales/${id}`),
    createSale: (data: any) => request<ApiResponse<{ message: string; sale: any }>>('/sales', { method: 'POST', body: data }),
    updateSale: (id: number, data: any) => request<ApiResponse<{ message: string; sale: any }>>(`/sales/${id}`, { method: 'PUT', body: data }),
    deleteSale: (id: number) => request<ApiResponse<{ message: string }>>(`/sales/${id}`, { method: 'DELETE' }),
    
    //products 
    //getproduct probar de manera localhost
    getProducts: () => request<ApiResponse<Product[]>>('/v1/product'),
    getProduct: (id: number) => request<ApiResponse<Product>>(`v1/product/${id}`),
    createProduct: (data: Partial<Product>) => request<ApiResponse<{ message: string; product: Product }>>('/v1/product', { method: 'POST', body: data }),
    updateProduct: (id: number, data: Partial<Product>) =>
      request<ApiResponse<{ message: string; product: Product }>>(`/v1/product/${id}`, { method: 'PUT', body: data }),
    deleteProduct: (id: number) => request<ApiResponse<{ message: string }>>(`/v1/product/${id}`, { method: 'DELETE' }),
    
    
    //getProducts: () => request<ApiResponse<Product[]>>('/v1/product'), // Corregido de /product a /products
    
  };
};