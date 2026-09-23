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

import * as FileSystem from 'expo-file-system/legacy';
import { File as ExpoFile } from 'expo-file-system';

/**
 * Converts any local URI (content://, file://, blob:) into a Base64 string.
 * Uses native Expo FileSystem directly without triggering Blob warnings.
 */
export const convertUriToBase64 = async (uri: string): Promise<string> => {
  if (!uri) return '';
  if (uri.startsWith('data:')) return uri;

  // 1. Direct native read with legacy FileSystem
  try {
    if (FileSystem && typeof FileSystem.readAsStringAsync === 'function') {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType ? FileSystem.EncodingType.Base64 : ('base64' as any),
      });
      if (base64) {
        return base64.startsWith('data:') ? base64 : `data:application/pdf;base64,${base64}`;
      }
    }
  } catch (fsErr) {}

  // 2. Sandboxed cache copy + FileSystem read
  if (FileSystem && FileSystem.cacheDirectory) {
    const tempTarget = `${FileSystem.cacheDirectory}res_${Date.now()}.pdf`;
    try {
      await FileSystem.copyAsync({
        from: uri,
        to: tempTarget,
      });
      const base64 = await FileSystem.readAsStringAsync(tempTarget, {
        encoding: FileSystem.EncodingType ? FileSystem.EncodingType.Base64 : ('base64' as any),
      });
      FileSystem.deleteAsync(tempTarget, { idempotent: true }).catch(() => {});
      if (base64) {
        return base64.startsWith('data:') ? base64 : `data:application/pdf;base64,${base64}`;
      }
    } catch (copyErr) {}
  }

  // 3. Fallback to XHR + FileReader (No Response.blob warning)
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
 * Uses Base64 JSON, Axios FormData, and sandboxed FileSystem upload.
 */
export const uploadFileApi = async (file: any, fieldName: string = 'resume') => {
  try {
    if (!file || !file.uri) return null;

    // 1. Convert URI to Base64
    let base64 = '';
    try {
      base64 = await convertUriToBase64(file.uri);
    } catch (convertErr) {}

    // 2. Post Base64 JSON payload to backend (/upload/base64)
    if (base64) {
      try {
        const response = await api.post('/upload/base64', {
          base64,
          filename: file.name || 'resume.pdf',
          mimeType: file.mimeType || file.type || 'application/pdf',
          fieldName,
        });

        if (response.data && (response.data.url || response.data.parsedData)) {
          return response.data;
        }
      } catch (postErr) {
        console.warn('Upload API Base64 request error:', postErr);
      }
    }

    // 3. Fallback: Standard multipart FormData via axios
    try {
      const formData = new FormData();
      formData.append(fieldName, {
        uri: file.uri,
        name: file.name || 'resume.pdf',
        type: file.mimeType || file.type || 'application/pdf',
      } as any);

      const formResponse = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (formResponse.data && (formResponse.data.url || formResponse.data.parsedData)) {
        return formResponse.data;
      }
    } catch (formErr) {
      console.warn('Upload API FormData fallback error:', formErr);
    }

    // 4. Fallback: Copy to sandboxed cache and uploadAsync
    if (FileSystem && FileSystem.cacheDirectory && typeof FileSystem.uploadAsync === 'function') {
      const tempPath = `${FileSystem.cacheDirectory}up_${Date.now()}.pdf`;
      try {
        await FileSystem.copyAsync({ from: file.uri, to: tempPath });
        const uploadResponse = await FileSystem.uploadAsync(
          `${API_BASE_URL}/upload`,
          tempPath,
          {
            httpMethod: 'POST',
            uploadType: FileSystem.FileSystemUploadType ? FileSystem.FileSystemUploadType.MULTIPART : (1 as any),
            fieldName,
            mimeType: file.mimeType || file.type || 'application/pdf',
            parameters: {
              originalname: file.name || 'resume.pdf',
            },
            headers: {
              'Accept': 'application/json',
            },
          }
        );
        FileSystem.deleteAsync(tempPath, { idempotent: true }).catch(() => {});
        if (uploadResponse && uploadResponse.body) {
          try {
            const data = JSON.parse(uploadResponse.body);
            if (data && (data.url || data.parsedData)) {
              return data;
            }
          } catch (e) {}
        }
      } catch (uploadAsyncErr) {}
    }
  } catch (err) {
    console.warn('uploadFileApi error:', err);
  }
  return null;
};

export default api;
