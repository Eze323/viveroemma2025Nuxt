import { useRuntimeConfig } from '#app';
import { useAuthStore } from '~/stores/auth';

interface Product {
  id: number;
  name: string;
  category?: string; // Opcional para manejar respuestas sin category
  description?: string | null;
  precio_compra?: number; // Opcional
  precio_venta: number; // Requerido (corresponde a unit_price)
  stock: number;
  pot_size?: string | null;
  image_url?: string | null;
  publicado?: boolean;
  sku?: string | null;
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
    } else {
      console.warn('No se encontró token de autenticación');
    }

    return headers;
  };

  const normalizeProduct = (product: any): Product | null => {
    if (!product || typeof product !== 'object' || !product.id || !product.name) {
      console.warn('Producto inválido omitido:', product);
      return null;
    }

    return {
      id: Number(product.id),
      name: String(product.name),
      category: product.category ? String(product.category) : 'otro',
      description: product.description ? String(product.description) : null,
      precio_compra: product.precio_compra ? Number(product.precio_compra) : 0,
      precio_venta: Number(product.unit_price || product.precio_venta || 0), // Soporta unit_price del endpoint
      stock: Number(product.stock || 0),
      pot_size: product.pot_size ? String(product.pot_size) : null,
      image_url: product.image_url ? String(product.image_url) : null,
      publicado: product.publicado !== undefined ? Boolean(product.publicado) : true,
      sku: product.sku ? String(product.sku) : null,
    };
  };

  const normalizeResponse = <T>(response: any): T => {
    console.log('Respuesta cruda:', response); // Depuración
    if (!response || !response.success) {
      console.warn('Respuesta inválida:', response);
      return { success: false, data: [], error: response?.error || 'Respuesta inválida de la API' } as T;
    }

    const data = response.data || response;

    if (Array.isArray(data)) {
      const normalized = data
        .map((item) => normalizeProduct(item))
        .filter((item): item is Product => item !== null);
      console.log('Productos normalizados:', normalized);
      return { success: true, data: normalized } as T;
    }

    if (data && 'id' in data && 'name' in data) {
      const normalized = normalizeProduct(data);
      console.log('Producto normalizado:', normalized);
      return { success: true, data: normalized } as T;
    }

    console.warn('Formato de respuesta no reconocido:', data);
    return { success: false, data: [], error: 'Formato de respuesta no reconocido' } as T;
  };

  const request = async <T>(url: string, options: any = {}): Promise<T> => {
    try {
      const fullUrl = `${baseUrl}${url}`;
      console.log('Haciendo solicitud a:', fullUrl, 'con headers:', options.headers); // Depuración
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
      console.error('Error en la solicitud:', errorData);
      throw errorData;
    }
  };

  const handleApiError = (error: any) => {
    if (error.response?.status === 401) {
      console.warn('Error 401: Redirigiendo al login');
      authStore.token = null;
      authStore.user = null;
      localStorage.removeItem('token');
      navigateTo('/auth/login');
    }

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
    // Sales
    getSales: () => request<ApiResponse<any[]>>('/sales'),
    getSale: (id: number) => request<ApiResponse<any>>(`/sales/${id}`),
    createSale: (data: any) => request<ApiResponse<{ message: string; sale: any }>>('/sales', { method: 'POST', body: data }),
    updateSale: (id: number, data: any) => request<ApiResponse<{ message: string; sale: any }>>(`/sales/${id}`, { method: 'PUT', body: data }),
    deleteSale: (id: number) => request<ApiResponse<{ message: string }>>(`/sales/${id}`, { method: 'DELETE' }),

    // Products
    getProducts: () => request<ApiResponse<Product[]>>('/products'), // Corregido de /product a /products
    getProduct: (id: number) => request<ApiResponse<Product>>(`/products/${id}`), // Corregido de /product a /products
    createProduct: (data: Partial<Product>) => request<ApiResponse<{ message: string; product: Product }>>('/products', { method: 'POST', body: data }), // Corregido
    updateProduct: (id: number, data: Partial<Product>) =>
      request<ApiResponse<{ message: string; product: Product }>>(`/products/${id}`, { method: 'PUT', body: data }), // Corregido
    deleteProduct: (id: number) => request<ApiResponse<{ message: string }>>(`/products/${id}`, { method: 'DELETE' }), // Corregido
  };
};