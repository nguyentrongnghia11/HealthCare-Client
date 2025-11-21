import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';

const instance = axios.create({
  baseURL: 'http://192.168.31.194:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any = null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

// Response interceptor to handle token expiration
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject immediately
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return instance(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh endpoint
      const response = await axios.post(
        'http://192.168.31.194:3000/auth/refresh',
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { access_token, refresh_token } = response.data;
      
      if (!access_token) {
        throw new Error('No access token in refresh response');
      }

      // Save new tokens
      await AsyncStorage.setItem('token', access_token);
      if (refresh_token) {
        await AsyncStorage.setItem('refreshToken', refresh_token);
      }

      // Update default header
      instance.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
      originalRequest.headers['Authorization'] = 'Bearer ' + access_token;

      // Process queued requests
      processQueue(null, access_token);
      
      isRefreshing = false;

      // Retry original request
      return instance(originalRequest);

    } catch (refreshError) {
      // Refresh failed, clear auth data and redirect to login
      processQueue(refreshError, null);
      isRefreshing = false;

      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
      
      // Redirect to login
      setTimeout(() => {
        router.replace('/login');
      }, 100);

      return Promise.reject(refreshError);
    }
  }
);

// Request interceptor to add token to all requests
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
