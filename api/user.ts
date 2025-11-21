import instance from '../utils/axiosInstance';

interface UserDetail {
  birthday: string;
  gender: boolean;
  height: number;
  weight: number;
  activityLevel: string;
  target: 'lost' | 'maintain' | 'gain';
  targetWeight: number;
  targetTimeDays: number;
}

export const updateUserDetail = async (data: UserDetail) => {
  console.log ("User detail ", data);
  const response = await instance.patch('/user/me/detail', data);
  return response.data;
};

export const getUserDetail = async () => {
  try {
    const response = await instance.get('/user/me/detail');
    const data = response.data;
    
    // Check if user has completed onboarding by validating key fields
    // If these fields are still default values (0, null, empty), user needs onboarding
    if (!data || 
        !data.birthday || 
        data.height === 0 || 
        data.weight === 0 || 
        !data.activityLevel || 
        !data.target ||
        data.targetWeight === 0 ||
        data.targetTimeDays === 0) {
      console.log('User detail incomplete, needs onboarding');
      return null;
    }
    
    return data;
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
