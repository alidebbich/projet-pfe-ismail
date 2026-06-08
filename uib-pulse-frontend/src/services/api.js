// UIB Pulse — Axios API Service
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('uib_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('uib_token');
      localStorage.removeItem('uib_role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (data) => api.post('/auth/register', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  googleLogin: (idToken) => api.post('/auth/google', { idToken }),
  logout: () => {
    localStorage.removeItem('uib_token');
    localStorage.removeItem('uib_role');
    localStorage.removeItem('uib_username');
  },
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAll: () => api.get('/users'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

export const projectAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const dataQualityAPI = {
  getAll: () => api.get('/data-quality'),
  getById: (id) => api.get(`/data-quality/${id}`),
  create: (data) => api.post('/data-quality', data),
  update: (id, data) => api.put(`/data-quality/${id}`, data),
  delete: (id) => api.delete(`/data-quality/${id}`),
};

export const ticketAPI = {
  getAll: (params) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.put(`/tickets/${id}`, data),
  delete: (id) => api.delete(`/tickets/${id}`),
  getSLAStats: () => api.get('/tickets/sla-stats'),
};

export const thresholdAPI = {
  getAll: () => api.get('/thresholds'),
  update: (kpiCode, data) => api.put(`/thresholds/${kpiCode}`, data),
};

export const auditAPI = {
  getLogs: (params) => api.get('/audit', { params }),
};

export const reportAPI = {
  generate: (data) => api.post('/reports/generate', data, { responseType: 'blob' }),
};

export default api;
