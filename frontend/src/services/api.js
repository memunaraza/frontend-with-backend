const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    ...options,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const payload = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    const error = new Error(payload?.message ?? 'Something went wrong. Please try again.')
    error.status = response.status
    throw error
  }

  return payload
}

export const api = {
  getProducts: () => request('/api/product'),
  getProduct: (id) => request(`/api/product/${id}`),
  getCurrentUser: () => request('/api/auth/me'),
  login: (credentials) => request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  }),
  register: (details) => request('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  getBrands: () => request('/api/brand'),
  createBrand: (details) => request('/api/brand', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  }),
  updateBrand: (id, details) => request(`/api/brand/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  }),
  deleteBrand: (id) => request(`/api/brand/${id}`, { method: 'DELETE' }),
  deleteAllBrands: () => request('/api/brand', { method: 'DELETE' }),
  getCart: () => request('/api/cart'),
  addToCart: (productId) => request('/api/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity: 1 }),
  }),
  updateCartItem: (productId, quantity) => request(`/api/cart/items/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  }),
  removeCartItem: (productId) => request(`/api/cart/items/${productId}`, { method: 'DELETE' }),
  clearCart: () => request('/api/cart', { method: 'DELETE' }),
  createOrder: (shippingAddress) => request('/api/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shippingAddress }),
  }),
  getOrders: () => request('/api/order'),
  sendContactMessage: (details) => request('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  }),
  getContactMessages: () => request('/api/contact'),
  createProduct: (formData) => request('/api/product/create', {
    method: 'POST',
    body: formData,
  }),
}
