import axios from 'axios';
import { Trade, User } from '../types';

const API_URL = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Add Auth Token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors globally and extract data
client.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'API Error';
    return Promise.reject(new Error(message));
  }
);

// --- API Calls ---

export const api = {
  auth: {
    register: async (username: string, email: string) => {
      const password = "defaultPassword123";
      // axios automatically JSON-stringifies the body
      return client.post('/auth/register', { username, email, password });
    },
    login: async (email: string) => {
      const password = "defaultPassword123";
      return client.post('/auth/login', { email, password });
    }
  },
  trades: {
    getAll: async () => {
      return client.get('/trades');
    },
    create: async (trade: Omit<Trade, 'id' | 'createdAt'>) => {
      return client.post('/trades', trade);
    },
    update: async (trade: Trade) => {
      return client.put(`/trades/${trade.id}`, trade);
    },
    delete: async (tradeId: string) => {
      return client.delete(`/trades/${tradeId}`);
    }
  }
};