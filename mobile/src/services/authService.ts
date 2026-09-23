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
  linkedinUrl?: string;
  isFresherCA?: boolean;
  resumeUrl?: string;
  caFinal?: {
    bothGroups1stAttempt?: boolean;
    group1Attempts?: string;
    group1Month?: string;
    group1Year?: string;
    group2Attempts?: string;
    group2Month?: string;
    group2Year?: string;
    ranker?: string;
    completionSessionMonth?: string;
    completionSessionYear?: string;
  };
  [key: string]: any;
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
  await AsyncStorage.removeItem('token');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
