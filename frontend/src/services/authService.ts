import api from './api';

// Types
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'candidate' | 'employer';
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface UserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  token: string;
}

// Register user
const register = async (userData: RegisterData): Promise<UserResponse> => {
  const response = await api.post('/users', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData: LoginData): Promise<UserResponse> => {
  const response = await api.post('/users/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
