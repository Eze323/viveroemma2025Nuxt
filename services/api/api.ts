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
    console.log('Respuesta cruda:', response)

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
      console.log('Haciendo solicitud a:', fullUrl)

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
    // Sales endpoints
    getSales: () => request<any[]>('/sales'),
    getSale: (id: number) => request<any>(`/sales/${id}`),
    createSale: (data: any) => request<any>('/sales', { method: 'POST', body: data }),
    updateSale: (id: number, data: any) => request<any>(`/sales/${id}`, { method: 'PUT', body: data }),
    deleteSale: (id: number) => request<any>(`/sales/${id}`, { method: 'DELETE' }),

    // Products endpoints (sin normalización extra)
    getProducts: () => request<Product[]>('/product'),
    getProduct: (id: number) => request<Product>(`/product/${id}`),
    createProduct: (data: Partial<Product>) => request<Product>('/product', { method: 'POST', body: data }),
    updateProduct: (id: number, data: Partial<Product>) => request<Product>(`/product/${id}`, { method: 'PUT', body: data }),
    deleteProduct: (id: number) => request<any>(`/product/${id}`, { method: 'DELETE' }),
  }
}
