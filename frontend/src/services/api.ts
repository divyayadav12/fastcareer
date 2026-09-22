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
    let token: string | null = null;
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.token && user.token !== 'undefined' && user.token !== 'null') {
          token = user.token;
        }
      } catch (error) {
        console.error('Error parsing user from local storage:', error);
      }
    }
    const directToken = localStorage.getItem('token');
    if (!token && directToken && directToken !== 'undefined' && directToken !== 'null') {
      token = directToken;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
