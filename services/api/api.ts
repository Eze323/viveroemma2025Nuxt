import type { Product } from '~/types/product'
import { useAuthStore } from '~/stores/auth'

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export const useApiService = () => {
  const baseUrl = '/api'
  const requestFetch = useRequestFetch()

  // 👉 Ahora esta función sí agrega el token
  const getAuthHeaders = () => {
    const auth = useAuthStore()

    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}), // ⬅⬅⬅ agregado
    }
  }

  const normalizeResponse = <T>(response: any): ApiResponse<T> => {
    if (response?.success === false) {
      return {
        success: false,
        data: (response.data ?? []) as T,
        error: response.error || response.message || 'La solicitud no pudo completarse',
      }
    }

    if (response && response.success !== undefined && response.data !== undefined) {
      return { success: response.success, data: response.data } as ApiResponse<T>
    }

    if (Array.isArray(response)) {
      return { success: true, data: response } as ApiResponse<T>
    }

    if (response && typeof response === 'object') {
      return { success: true, data: response } as ApiResponse<T>
    }

    return {
      success: false,
      data: [] as T,
      error: 'Formato de respuesta no reconocido',
    }
  }

  const request = async <T>(url: string, options: any = {}): Promise<ApiResponse<T>> => {
    try {
      const fullUrl = `${baseUrl}${url}`
      const sendRequest = () => $fetch(fullUrl, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...(options.headers || {}),
        },
      })

      let response
      try {
        response = await sendRequest()
      } catch (error: any) {
        if (error.statusCode !== 401) throw error

        const auth = useAuthStore()
        const refreshed = await auth.refreshSession(requestFetch)
        if (!refreshed) throw error

        response = await sendRequest()
      }

      return normalizeResponse<T>(response)
    } catch (error: any) {
      console.error('Error en la solicitud:', error)

      return {
        success: false,
        data: [] as T,
        error: error.data?.statusMessage || error.data?.message || error.message || 'Error de conexión',
      }
    }
  }

  return {
    // SALES
    getSales: () => request<ApiResponse<any[]>>('/sales'),
    getSale: (id: number) => request<ApiResponse<any>>(`/sales/${id}`),
    createSale: (data: any) =>
      request<ApiResponse<{ message: string; sale: any }>>('/sales', { method: 'POST', body: data }),
    updateSale: (id: number, data: any) =>
      request<ApiResponse<{ message: string; sale: any }>>(`/sales/${id}`, { method: 'PUT', body: data }),
    deleteSale: (id: number) => request<ApiResponse<{ message: string }>>(`/sales/${id}`, { method: 'DELETE' }),

    // PRODUCTS
    getProducts: () => request<ApiResponse<Product[]>>('/products'),
    getProduct: (id: number) => request<ApiResponse<Product>>(`/products/${id}`),
    createProduct: (data: Partial<Product>) =>
      request<ApiResponse<{ message: string; product: Product }>>('/products', {
        method: 'POST',
        body: data,
      }),
    updateProduct: (id: number, data: Partial<Product>) =>
      request<ApiResponse<{ message: string; product: Product }>>(`/products/${id}`, {
        method: 'PUT',
        body: data,
      }),
    deleteProduct: (id: number) => request<ApiResponse<{ message: string }>>(`/products/${id}`, { method: 'DELETE' }),
  }
}
