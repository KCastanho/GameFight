import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5002/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  createAdmin: (data) => api.post('/auth/create-admin', data),
};

export const characterService = {
  getAll: () => api.get('/characters'),
  getActive: () => api.get('/characters/active'),
  create: (data) => api.post('/characters', data),
  update: (id, data) => api.put(`/characters/${id}`, data),
  toggle: (id) => api.patch(`/characters/${id}/toggle`),
  delete: (id) => api.delete(`/characters/${id}`),
};

export default api;
