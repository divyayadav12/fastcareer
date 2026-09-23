import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const API_BASE_URL = 'https://fastcareer.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 25000,
});

api.interceptors.request.use(
  async (config) => {
    const userString = await AsyncStorage.getItem('user');
    const directToken = await AsyncStorage.getItem('token');
    
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
          return config;
        }
      } catch (error) {
        console.error('Error parsing user from storage:', error);
      }
    }
    
    if (directToken) {
      config.headers.Authorization = `Bearer ${directToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Universal Multipart File Upload Helper for Mobile (React Native / Expo)
 * Avoids Axios boundary stripping Network Errors by using native fetch.
 */
export const uploadFileApi = async (file: any, fieldName: string = 'resume') => {
  try {
    const formData = new FormData();
    const uri = Platform.OS === 'android' ? file.uri : file.uri.replace('file://', '');
    
    formData.append(fieldName, {
      uri,
      name: file.name || 'resume.pdf',
      type: file.mimeType || file.type || 'application/pdf',
    } as any);

    const userString = await AsyncStorage.getItem('user');
    const directToken = await AsyncStorage.getItem('token');
    let token = directToken || '';
    if (!token && userString) {
      try {
        const u = JSON.parse(userString);
        if (u && u.token) token = u.token;
      } catch (e) {}
    }

    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers,
    });

    if (res.ok) {
      return await res.json();
    } else {
      const errText = await res.text();
      console.warn('Upload non-ok response:', res.status, errText);
    }
  } catch (err) {
    console.warn('uploadFileApi error:', err);
  }
  return null;
};

export default api;
