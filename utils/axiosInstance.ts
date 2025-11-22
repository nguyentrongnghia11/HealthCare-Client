import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';

const instance = axios.create({
  baseURL: 'http://10.18.135.159:3000',
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

    console.log('🔄 Access token expired, attempting refresh...');

    try {
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.error('❌ No refresh token found in storage');
        throw new Error('No refresh token available');
      }

      console.log('📤 Calling refresh endpoint...');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Call refresh endpoint - use the same baseURL
      const response = await axios.post(
        'http://192.168.1.3:3000/auth/refresh',
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // Support both snake_case and camelCase response formats
      const { access_token, accessToken, refresh_token, refreshToken: newRefreshToken } = response.data;
      const newAccessToken = access_token || accessToken;
      const newRefresh = refresh_token || newRefreshToken;
      
      if (!newAccessToken) {
        throw new Error('No access token in refresh response');
      }

      console.log('✅ Refresh token successful, new access token received');

      // Save new tokens
      await AsyncStorage.setItem('token', newAccessToken);
      if (newRefresh) {
        await AsyncStorage.setItem('refreshToken', newRefresh);
      }

      // Update default header
      instance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
      originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;

      // Process queued requests
      processQueue(null, newAccessToken);
      
      isRefreshing = false;

      // Retry original request
      return instance(originalRequest);

    } catch (refreshError) {
      // Refresh failed, clear auth data and redirect to login
      console.error('❌ Refresh token failed:', refreshError);
      processQueue(refreshError, null);
      isRefreshing = false;

      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
      
      console.log('🚪 Redirecting to login...');
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
