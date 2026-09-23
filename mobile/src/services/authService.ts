import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'candidate' | 'employer';
  phone?: string;
  currentCity?: string;
  isFresherCA?: boolean;
  resumeUrl?: string;
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface UserResponse {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin';
  token: string;
  phone?: string;
  city?: string;
  resumeUrl?: string;
  profileCompleted?: boolean;
  personalDetails?: any;
  caPortfolio?: any;
  caFinalInfo?: any;
  caInterInfo?: any;
  articleshipInfo?: any;
  qualifications?: any;
  experienceInfo?: any;
  [key: string]: any;
}

const register = async (userData: RegisterData): Promise<UserResponse> => {
  const response = await api.post('/users', userData);
  if (response.data) {
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData: LoginData): Promise<UserResponse> => {
  const response = await api.post('/users/login', userData);
  if (response.data) {
    await AsyncStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = async () => {
  await AsyncStorage.removeItem('user');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
