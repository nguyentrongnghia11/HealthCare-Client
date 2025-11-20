import instance from '../utils/axiosInstance';

interface UserDetail {
  birthday: string;
  gender: boolean;
  height: number;
  weight: number;
  activityLevel: string;
  target: 'lose' | 'maintain' | 'gain';
  targetWeight: number;
  targetTimeDays: number;
}

export const updateUserDetail = async (data: UserDetail) => {
  const response = await instance.patch('/user/me/detail', data);
  return response.data;
};

export const getUserDetail = async () => {
  try {
    const response = await instance.get('/user/me/detail');
    return response.data;
  } catch (error: any) {
    // If 404 or any error, user hasn't completed onboarding or data unavailable
    console.log('getUserDetail error:', error.response?.status, error.message);
    if (error.response?.status === 404 || error.response?.status === 400) {
      return null;
    }
    // For other errors (network, etc), return null to avoid breaking the flow
    return null;
  }
};
