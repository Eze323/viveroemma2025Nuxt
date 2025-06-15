// export const useApiService = () => {
//   const config = useRuntimeConfig();
//   const authStore = useAuthStore();

//   const baseUrl = config.public.apiBaseUrl;

//   const getAuthHeaders = () => {
//     const headers = {
//       'Accept': 'application/json',
//       'Content-Type': 'application/json',
//     };

//     if (authStore.token) {
//       headers['Authorization'] = `Bearer ${authStore.token}`;
//     }

//     return headers;
//   };

//   const normalizeProduct = (product) => {
//     if (!product || typeof product !== 'object' || !product.id || !product.name) {
//       console.warn('Invalid product skipped:', product);
//       return null;
//     }

//     const validCategories = ['planta', 'arbusto', 'plantin', 'otro', 'semilla', 'herramienta'];

//     return {
//       id: product.id,
//       name: String(product.name),
//       category: validCategories.includes(product.category) ? product.category : 'otro',
//       price: Number(product.price || product.final_price) || 0,
//       cost_price: Number(product.cost_price) || 0,
//       stock: Number(product.stock) || 0,
//       image_url: product.image_url || 'https://via.placeholder.com/300x200',
//       pot_size: ['pequeña', 'mediana', 'grande'].includes(product.pot_size) ? product.pot_size : null,
//       supplier_prices: product.supplier_prices?.map((sp) => ({
//         supplier_id: sp.supplier_id,
//         supplier_name: sp.supplier_name || 'Unknown',
//         purchase_price: Number(sp.purchase_price) || 0,
//         valid_from: sp.valid_from || null,
//         valid_to: sp.valid_to || null,
//       })) || [],
//       purchases: product.purchases || [],
//     };
//   };

//   const normalizeSale = (sale) => {
//     if (!sale || typeof sale !== 'object' || !sale.id) {
//       console.warn('Invalid sale skipped:', sale);
//       return null;
//     }

//     return {
//       id: sale.id,
//       customer: sale.customer
//         ? {
//             id: sale.customer.id,
//             full_name: sale.customer.full_name,
//             email: sale.customer.email,
//           }
//         : null,
//       customer_name_field: sale.customer_name_field || (sale.customer?.full_name || sale.customer),
//       email: sale.email || null,
//       seller: sale.seller || 'Unknown',
//       items: sale.items?.map((item) => ({
//         product_id: item.product_id,
//         product: item.product ? normalizeProduct(item.product) : null,
//         quantity: Number(item.quantity) || 1,
//         unit_price: Number(item.unit_price) || 0, // Cambiado a unit_price
//         subtotal: Number(item.subtotal) || 0,
//       })) || [],
//       total_price: Number(sale.total_price) || 0,
//       status: sale.status || 'Pendiente',
//       date: sale.date || null,
//       time: sale.time || null,
//     };
//   };

//   const normalizeInvoice = (invoice) => {
//     if (!invoice || typeof invoice !== 'object' || !invoice.id || !invoice.invoice_number) {
//       console.warn('Invalid invoice skipped:', invoice);
//       return null;
//     }

//     return {
//       id: invoice.id,
//       supplier_id: invoice.supplier_id || null,
//       supplier: invoice.supplier || 'Unknown',
//       invoice_number: String(invoice.invoice_number),
//       issue_date: invoice.issue_date || null,
//       total_amount: Number(invoice.total_amount) || 0,
//       status: ['pending', 'paid', 'cancelled'].includes(invoice.status) ? invoice.status : 'pending',
//       purchases: invoice.purchases?.map((purchase) => ({
//         product_id: purchase.product_id || null,
//         product: purchase.product || 'Unknown',
//         quantity: Number(purchase.quantity) || 0,
//         purchase_price: Number(purchase.purchase_price) || 0,
//       })) || [],
//     };
//   };

//   const normalizeSupplier = (supplier) => {
//     if (!supplier || typeof supplier !== 'object' || !supplier.id || !supplier.name) {
//       console.warn('Invalid supplier skipped:', supplier);
//       return null;
//     }

//     return {
//       id: supplier.id,
//       name: String(supplier.name),
//       last_name: String(supplier.last_name || ''),
//       email: String(supplier.email || ''),
//       phone: String(supplier.phone || ''),
//       address: String(supplier.address || ''),
//     };
//   };

//   const normalizeResponse = (response) => {
//     if (!response) return null;

//     // Manejar respuestas con estructura { data: [...] } o { data: {...} }
//     const data = response.data || response;

//     if (Array.isArray(data)) {
//       return data
//         .map((item) => {
//           if (item && 'name' in item && 'category' in item) {
//             return normalizeProduct(item);
//           }
//           if (item && ('customer' in item || 'customer_name_field' in item) && 'total_price' in item) {
//             return normalizeSale(item);
//           }
//           if (item && 'invoice_number' in item && 'total_amount' in item) {
//             return normalizeInvoice(item);
//           }
//           if (item && 'name' in item && !('category' in item) && 'id' in item) {
//             return normalizeSupplier(item);
//           }
//           console.warn('Unrecognized item in response:', item);
//           return item;
//         })
//         .filter((item) => item !== null);
//     }

//     if (data && 'name' in data && 'category' in data) {
//       return normalizeProduct(data);
//     }

//     if (data && ('customer' in data || 'customer_name_field' in data) && 'total_price' in data) {
//       return normalizeSale(data);
//     }

//     if (data && 'invoice_number' in data && 'total_amount' in data) {
//       return normalizeInvoice(data);
//     }

//     if (data && 'name' in data && !('category' in data) && 'id' in data) {
//       return normalizeSupplier(data);
//     }

//     console.warn('Unrecognized response format:', data);
//     return data;
//   };

//   const request = async (url, options = {}) => {
//     try {
//       const fullUrl = `${baseUrl}${url}`;
//       const response = await $fetch(fullUrl, {
//         ...options,
//         headers: {
//           ...getAuthHeaders(),
//           ...(options.headers || {}),
//         },
//       });
//       return normalizeResponse(response);
//     } catch (error) {
//       const errorData = handleApiError(error);
//       throw errorData;
//     }
//   };

//   const handleApiError = (error) => {
//     if (error.response?.status === 401) {
//       authStore.token = null;
//       authStore.user = null;
//       localStorage.removeItem('token');
//       navigateTo('/auth/login');
//     }

//     console.error('API Error:', error);
//     return {
//       message:
//         error.response?.data?.message ||
//         error.message ||
//         'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.',
//       response: error.response,
//       status: error.response?.status,
//       code: error.response?.data?.code,
//       errors: error.response?.data?.errors,
//     };
//   };

//   return {
//     // Productos
//     getProducts: () => request(`/products?t=${Date.now()}`),
//     getProduct: (id) => request(`/products/${id}`),
//     createProduct: (data) => request('/products', { method: 'POST', body: data }),
//     updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: data }),
//     deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

//     // Ventas
//     getSales: (params = {}) => request(`/sales?${new URLSearchParams(params).toString()}`),
//     getSale: (id) => request(`/sales/${id}`),
//     createSale: (data) =>
//       request('/sales', {
//         method: 'POST',
//         body: {
//           ...data,
//           items: data.items.map((item) => ({
//             product_id: item.product_id,
//             quantity: item.quantity,
//             unit_price: item.unit_price,
//           })),
//         },
//       }),
//     updateSale: (id, data) =>
//       request(`/sales/${id}`, {
//         method: 'PUT',
//         body: {
//           ...data,
//           items: data.items.map((item) => ({
//             product_id: item.product_id,
//             quantity: item.quantity,
//             unit_price: item.unit_price,
//           })),
//         },
//       }),
//     deleteSale: (id) => request(`/sales/${id}`, { method: 'DELETE' }),

//     // Empleados
//     getEmployees: () => request('/employees'),
//     createEmployee: (data) => request('/employees', { method: 'POST', body: data }),

//     // Facturas
//     getInvoices: (params = {}) => request(`/invoices?${new URLSearchParams(params).toString()}`),
//     getInvoice: (id) => request(`/invoices/${id}`),
//     createInvoice: (data) => request('/invoices', { method: 'POST', body: data }),
//     updateInvoice: (id, data) => request(`/invoices/${id}`, { method: 'PUT', body: data }),
//     deleteInvoice: (id) => request(`/invoices/${id}`, { method: 'DELETE' }),

//     // Proveedores
//     getSuppliers: () => request('/suppliers'),
//     getSupplier: (id) => request(`/suppliers/${id}`),
//     createSupplier: (data) => request('/suppliers', { method: 'POST', body: data }),
//     updateSupplier: (id, data) => request(`/suppliers/${id}`, { method: 'PUT', body: data }),
//     deleteSupplier: (id) => request(`/suppliers/${id}`, { method: 'DELETE' }),

//     // Clientes
//     getCustomers: () => request('/customers'),
//     createCustomer: (data) => request('/customers', { method: 'POST', body: data }),

//     // Macetas/Trasplantes
//     getPottingRecords: () => request('/potting-records'),
//     createPottingRecord: (data) => request('/potting-records', { method: 'POST', body: data }),

//     // Dashboard
//     getDashboardData: () => request('/dashboard'),

//     // Vendedores/Recompensas
//     getTopSellers: () => request('/top-sellers'),
//     assignReward: (data) => request('/rewards', { method: 'POST', body: data }),
//   };
// };