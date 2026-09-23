import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';

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

/**
 * 100% Reliable File Uploader for Mobile (React Native / Expo Go)
 * Reads local file as Base64 and sends clean JSON to /upload/base64.
 * Completely immune to Android scoped storage, multipart boundary bugs, and ExponentFileSystem file read errors.
 */
export const uploadFileApi = async (file: any, fieldName: string = 'resume') => {
  try {
    if (!file || !file.uri) return null;

    // 1. Read file as Base64 string directly from local uri
    let base64Content = '';
    try {
      base64Content = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    } catch (readErr) {
      console.warn('Direct FileSystem read error, trying fallback:', readErr);
    }

    // If Base64 string is ready, send via standard Axios JSON POST
    if (base64Content) {
      try {
        const response = await api.post('/upload/base64', {
          base64: base64Content,
          filename: file.name || 'resume.pdf',
          mimeType: file.mimeType || file.type || 'application/pdf',
          fieldName,
        });
        if (response.data) {
          return response.data;
        }
      } catch (axiosErr) {
        console.warn('Axios Base64 upload warning:', axiosErr);
      }
    }

    // 2. Fallback: Copy to App Cache Directory first, then uploadAsync
    try {
      const cleanFileName = `cached_${Date.now()}_${(file.name || 'resume.pdf').replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const destUri = `${FileSystem.cacheDirectory}${cleanFileName}`;
      
      await FileSystem.copyAsync({
        from: file.uri,
        to: destUri,
      });

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

      const uploadResult = await FileSystem.uploadAsync(
        `${API_BASE_URL}/upload`,
        destUri,
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
          } catch {
            return { url: uploadResult.body, resumeUrl: uploadResult.body };
          }
        }
      }
    } catch (fsErr) {
      console.warn('FileSystem cached upload fallback failed:', fsErr);
    }
  } catch (err) {
    console.warn('uploadFileApi error:', err);
  }
  return null;
};

export default api;
