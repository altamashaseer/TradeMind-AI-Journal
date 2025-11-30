import axios from 'axios';
import { Trade, User } from '../types';
import { API_URL } from '@/constants';

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

interface AuthResponse {
  token: string;
  user: User;
}

// --- API Calls ---

export const api = {
  auth: {
    register: async (username: string, email: string): Promise<AuthResponse> => {
      const password = "defaultPassword123";
      // axios automatically JSON-stringifies the body
      return client.post('/auth/register', { username, email, password }) as Promise<AuthResponse>;
    },
    login: async (email: string): Promise<AuthResponse> => {
      const password = "defaultPassword123";
      return client.post('/auth/login', { email, password }) as Promise<AuthResponse>;
    }
  },
  trades: {
    getAll: async (): Promise<Trade[]> => {
      return client.get('/trades') as Promise<Trade[]>;
    },
    create: async (trade: Omit<Trade, 'id' | 'createdAt'>): Promise<Trade> => {
      return client.post('/trades', trade) as Promise<Trade>;
    },
    update: async (trade: Trade): Promise<Trade> => {
      return client.put(`/trades/${trade.id}`, trade) as Promise<Trade>;
    },
    delete: async (tradeId: string): Promise<void> => {
      return client.delete(`/trades/${tradeId}`) as Promise<void>;
    }
  }
};