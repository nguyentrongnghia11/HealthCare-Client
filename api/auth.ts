import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../utils/axiosInstance';

export interface VerifyTokenResponse {
  valid: boolean;
  user?: any;
}

/**
 * Verify if the current token is still valid
 * @returns Promise<boolean> - true if token is valid, false otherwise
 */
export async function verifyToken(): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      return false;
    }

    // Call API to verify token (interceptor will add Authorization header)
    const response = await axiosInstance.get('/auth/verify');

    return response.data?.valid === true;
  } catch (error: any) {
    console.error('Token verification failed:', error.response?.status, error.message);
    
    // If token is invalid (401, 403), clear storage
    if (error.response?.status === 401 || error.response?.status === 403) {
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
    }
    
    return false;
  }
}

/**
 * Refresh the access token using refresh token
 * @returns Promise<boolean> - true if refresh successful, false otherwise
 */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      return false;
    }

    const response = await axiosInstance.post('/auth/refresh', {
      refreshToken,
    });

    const { access_token, refresh_token } = response.data;
    
    if (access_token) {
      await AsyncStorage.setItem('token', access_token);
      if (refresh_token) {
        await AsyncStorage.setItem('refreshToken', refresh_token);
      }
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error('Token refresh failed:', error.response?.status, error.message);
    
    // If refresh fails, clear all auth data
    await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
    return false;
  }
}
