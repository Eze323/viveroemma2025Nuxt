import type { Product } from '~/types/product'

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export const useApiService = () => {
  const baseUrl = '/api'

  const getAuthHeaders = () => {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  const normalizeResponse = <T>(response: any): ApiResponse<T> => {
    // console.log('Respuesta cruda:', response)

    // Si ya viene { success, data }
    if (response && response.success !== undefined && response.data !== undefined) {
      return { success: response.success, data: response.data } as ApiResponse<T>
    }

    // Si es un array directo
    if (Array.isArray(response)) {
      return { success: true, data: response } as ApiResponse<T>
    }

    // Si es objeto directo
    if (response && typeof response === 'object') {
      return { success: true, data: response } as ApiResponse<T>
    }

    return { success: false, data: [] as T, error: 'Formato de respuesta no reconocido' }
  }

  const request = async <T>(url: string, options: any = {}): Promise<ApiResponse<T>> => {
    try {
      const fullUrl = `${baseUrl}${url}`
      //console.log('Haciendo solicitud a:', fullUrl)

      const response = await $fetch(fullUrl, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...(options.headers || {}),
        },
      })

      return normalizeResponse<T>(response)
    } catch (error: any) {
      console.error('Error en la solicitud:', error)
      return {
        success: false,
        data: [] as T,
        error: error.data?.message || error.message || 'Error de conexión',
      }
    }
  }

  return {
    //sales
    getSales: () => request<ApiResponse<any[]>>('/sales'),
    getSale: (id: number) => request<ApiResponse<any>>(`/sales/${id}`),
    createSale: (data: any) => request<ApiResponse<{ message: string; sale: any }>>('/sales', { method: 'POST', body: data }),
    updateSale: (id: number, data: any) => request<ApiResponse<{ message: string; sale: any }>>(`/sales/${id}`, { method: 'PUT', body: data }),
    deleteSale: (id: number) => request<ApiResponse<{ message: string }>>(`/sales/${id}`, { method: 'DELETE' }),

    //products
    getProducts: () => request<ApiResponse<Product[]>>('/products'), // Corregido de /product a /products
    getProduct: (id: number) => request<ApiResponse<Product>>(`/products/${id}`),
    createProduct: (data: Partial<Product>) => request<ApiResponse<{ message: string; product: Product }>>('/products', { method: 'POST', body: data }),
    updateProduct: (id: number, data: Partial<Product>) =>
      request<ApiResponse<{ message: string; product: Product }>>(`/products/${id}`, { method: 'PUT', body: data }),
    deleteProduct: (id: number) => request<ApiResponse<{ message: string }>>(`/products/${id}`, { method: 'DELETE' }),
  };
};
