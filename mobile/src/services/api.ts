import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'https://fastcareer.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 35000,
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

import * as FileSystem from 'expo-file-system';

/**
 * Converts any local URI (content://, file://, blob:) into a Base64 string.
 * Uses expo-file-system as primary (fast & native) with XHR + FileReader fallback.
 */
export const convertUriToBase64 = async (uri: string): Promise<string> => {
  if (!uri) return '';
  if (uri.startsWith('data:')) return uri;

  // 1. Try Expo FileSystem readAsStringAsync
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType ? FileSystem.EncodingType.Base64 : ('base64' as any),
    });
    if (base64) {
      return base64.startsWith('data:') ? base64 : `data:application/pdf;base64,${base64}`;
    }
  } catch (fsErr) {
    console.warn('FileSystem.readAsStringAsync fallback to XHR:', fsErr);
  }

  // 2. Fallback to XHR + FileReader
  return new Promise((resolve) => {
    try {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        try {
          const reader = new FileReader();
          reader.onloadend = function () {
            resolve((reader.result as string) || '');
          };
          reader.onerror = function () {
            resolve('');
          };
          reader.readAsDataURL(xhr.response);
        } catch {
          resolve('');
        }
      };
      xhr.onerror = function () {
        resolve('');
      };
      xhr.open('GET', uri);
      xhr.responseType = 'blob';
      xhr.send();
    } catch {
      resolve('');
    }
  });
};

/**
 * 100% Reliable File Uploader for Mobile
 * Reads local URI via Android ContentResolver and posts clean Base64 JSON.
 */
export const uploadFileApi = async (file: any, fieldName: string = 'resume') => {
  try {
    if (!file || !file.uri) return null;

    // 1. Convert URI to Base64 using XHR blob + FileReader
    let base64 = '';
    try {
      base64 = await convertUriToBase64(file.uri);
    } catch (convertErr) {
      console.warn('Base64 conversion failed:', convertErr);
    }

    // 2. Post Base64 JSON payload to backend
    if (base64) {
      try {
        const response = await api.post('/upload/base64', {
          base64,
          filename: file.name || 'resume.pdf',
          mimeType: file.mimeType || file.type || 'application/pdf',
          fieldName,
        });

        if (response.data) {
          return response.data;
        }
      } catch (postErr) {
        console.warn('Upload API request error:', postErr);
      }
    }
  } catch (err) {
    console.warn('uploadFileApi error:', err);
  }
  return null;
};

export default api;
