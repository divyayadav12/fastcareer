import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

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
 * Uses Expo native FileSystem.uploadAsync to prevent FormDataPart / Axios boundary bugs on Android & iOS.
 */
export const uploadFileApi = async (file: any, fieldName: string = 'resume') => {
  try {
    if (!file || !file.uri) return null;

    const userString = await AsyncStorage.getItem('user');
    const directToken = await AsyncStorage.getItem('token');
    let token = directToken || '';
    if (!token && userString) {
      try {
        const u = JSON.parse(userString);
        if (u && u.token) token = u.token;
      } catch (e) {}
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 1. Primary: Use Expo FileSystem.uploadAsync (Native Android/iOS background uploader)
    try {
      const uploadResult = await FileSystem.uploadAsync(
        `${API_BASE_URL}/upload`,
        file.uri,
        {
          fieldName: fieldName,
          httpMethod: 'POST',
          uploadType: FileSystem.FileSystemUploadType.MULTIPART,
          headers,
          parameters: {
            originalname: file.name || 'resume.pdf',
          },
        }
      );

      if (uploadResult && uploadResult.status >= 200 && uploadResult.status < 300) {
        if (uploadResult.body) {
          try {
            return JSON.parse(uploadResult.body);
          } catch (e) {
            return { url: uploadResult.body, resumeUrl: uploadResult.body };
          }
        }
      }
    } catch (fsErr) {
      console.warn('FileSystem.uploadAsync fallback triggered:', fsErr);
    }

    // 2. Fallback: XMLHttpRequest
    const xhrResponse = await new Promise<any>((resolve) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${API_BASE_URL}/upload`);
        if (token) {
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              resolve(JSON.parse(xhr.responseText));
            } catch {
              resolve({ url: xhr.responseText });
            }
          } else {
            resolve(null);
          }
        };
        xhr.onerror = () => resolve(null);
        xhr.ontimeout = () => resolve(null);
        xhr.timeout = 30000;

        const formData = new FormData();
        formData.append(fieldName, {
          uri: file.uri,
          name: file.name || 'resume.pdf',
          type: file.mimeType || file.type || 'application/pdf',
        } as any);
        xhr.send(formData);
      } catch {
        resolve(null);
      }
    });

    return xhrResponse;
  } catch (err) {
    console.warn('uploadFileApi total error:', err);
  }
  return null;
};

export default api;
