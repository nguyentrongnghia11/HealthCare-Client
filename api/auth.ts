import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../utils/axiosInstance';

export interface VerifyTokenResponse {
  valid: boolean;
  user?: any;
}

export async function verifyToken(): Promise<boolean> {
  try {
    const token = await AsyncStorage.getItem('token');
    
    if (!token) {
      return false;
    }

    const response = await axiosInstance.get('/auth/verify');

    return response.data?.valid === true;
  } catch (error: any) {
    console.error('Token verification failed:', error.response?.status, error.message);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
    }
    
    return false;
  }
}


export async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    console.log ("day la refresh token ", refreshToken)
    
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
    
    await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
    return false;
  }
}
