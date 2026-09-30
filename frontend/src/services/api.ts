import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`, // Pointing to our local Express backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token if it exists
api.interceptors.request.use(
  (config) => {
    let token: string | null = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          if (user && user.token && user.token !== 'undefined' && user.token !== 'null') {
            token = user.token;
            localStorage.setItem('token', user.token);
          }
        } catch (error) {
          console.error('Error parsing user from local storage:', error);
        }
      }
    }
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to clear invalid/expired token on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Received 401 Unauthorized. Clearing stale authentication tokens.');
      localStorage.removeItem('token');
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const userObj = JSON.parse(userStr);
          delete userObj.token;
          localStorage.setItem('user', JSON.stringify(userObj));
        } catch (e) {}
      }
    }
    return Promise.reject(error);
  }
);

export default api;
