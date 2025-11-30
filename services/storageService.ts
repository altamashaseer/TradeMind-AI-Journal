import { Trade, User } from '../types';

const API_URL = 'http://localhost:5000/api';

// --- Helper Functions ---

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || response.statusText || 'API Error');
  }
  return response.json();
};

// --- Auth Services ---

export const registerUser = async (username: string, email: string): Promise<User> => {
  // For this demo, we'll assume a default password or you can add a password field to the UI
  // Since the UI only asks for username/email for registration in the previous iteration
  // We will map this to the backend. In a real app, you'd add a password field to the Auth component.
  const password = "defaultPassword123"; 

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });

  const data = await handleResponse(response);
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('current_user', JSON.stringify(data.user));
  return data.user;
};

export const loginUser = async (email: string): Promise<User> => {
  // Simulating password again for the UI which only has Email
  const password = "defaultPassword123";

  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await handleResponse(response);
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('current_user', JSON.stringify(data.user));
  return data.user;
};

export const logoutUser = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('current_user');
  return userStr ? JSON.parse(userStr) : null;
};

// --- Trade Services ---

export const getTrades = async (userId: string): Promise<Trade[]> => {
  const response = await fetch(`${API_URL}/trades`, {
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const saveTrade = async (trade: Omit<Trade, 'id' | 'createdAt'>): Promise<Trade> => {
  const response = await fetch(`${API_URL}/trades`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(trade)
  });
  return handleResponse(response);
};

export const updateTrade = async (updatedTrade: Trade): Promise<Trade> => {
  const response = await fetch(`${API_URL}/trades/${updatedTrade.id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updatedTrade)
  });
  return handleResponse(response);
};

export const deleteTrade = async (tradeId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/trades/${tradeId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  await handleResponse(response);
};