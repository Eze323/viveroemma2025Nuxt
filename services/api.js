// Service to handle API requests to Laravel backend

export const useApiService = () => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  
  // Base URL for API requests
  const baseUrl = config.public.apiBaseUrl;
  
  // Helper to get headers for authenticated requests
  const getAuthHeaders = () => {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
    
    if (authStore.token) {
      headers['Authorization'] = `Bearer ${authStore.token}`;
    }
    
    return headers;
  };
  
  // Generic request function with error handling
  const request = async (endpoint, options = {}) => {
    try {
      const url = `${baseUrl}${endpoint}`;
      const response = await $fetch(url, {
        ...options,
        headers: {
          ...getAuthHeaders(),
          ...(options.headers || {})
        }
      });
      
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;
    }
  };
  
  // Handle API errors
  const handleApiError = (error) => {
    // Handle authentication errors
    if (error.response?.status === 401) {
      authStore.token = null;
      authStore.user = null;
      localStorage.removeItem('token');
      navigateTo('/auth/login');
    }
    
    // Log error details
    console.error('API Error:', error);
    
    // Return a user-friendly error message
    return {
      error: error.data?.message || 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.'
    };
  };
  
  // API endpoints
  return {
    // Products
    getProducts: () => request('/products'),
    getProduct: (id) => request(`/products/${id}`),
    createProduct: (data) => request('/products', { method: 'POST', body: data }),
    updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),
    deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
    
    // Sales
    getSales: () => request('/sales'),
    createSale: (data) => request('/sales', { method: 'POST', body: data }),
    
    // Employees
    getEmployees: () => request('/employees'),
    createEmployee: (data) => request('/employees', { method: 'POST', body: data }),
    
    // Customers
    getCustomers: () => request('/customers'),
    createCustomer: (data) => request('/customers', { method: 'POST', body: data }),
    
    // Potting records
    getPottingRecords: () => request('/potting-records'),
    createPottingRecord: (data) => request('/potting-records', { method: 'POST', body: data }),
    
    // Dashboard data
    getDashboardData: () => request('/dashboard'),
    
    // Rewards
    getTopSellers: () => request('/top-sellers'),
    assignReward: (data) => request('/rewards', { method: 'POST', body: data })
  };
};