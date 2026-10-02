import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api'
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const login = (data) => axiosInstance.post('/auth/login', data);
export const register = (data) => axiosInstance.post('/auth/register', data);
export const getMe = () => axiosInstance.get('/auth/me');

export const api = {
  getPizzas: async (category = "all", search = "") => {
    let url = `/pizzas?category=${category}`;
    if (search) url += `&search=${search}`;
    return axiosInstance.get(url);
  },
  getPizzaById: async (id) => axiosInstance.get(`/pizzas/${id}`),
  createOrder: async (orderData) => axiosInstance.post('/orders', orderData),
  getOrders: async () => axiosInstance.get('/orders'),
  getOrderById: async (id) => axiosInstance.get(`/orders/${id}`),
  createPizza: async (data) => axiosInstance.post('/pizzas', data),
  updatePizza: async (id, data) => axiosInstance.put(`/pizzas/${id}`, data),
  deletePizza: async (id) => axiosInstance.delete(`/pizzas/${id}`),
  updateOrderStatus: async (id, status) => axiosInstance.put(`/orders/${id}/status`, { status })
};

export default axiosInstance;