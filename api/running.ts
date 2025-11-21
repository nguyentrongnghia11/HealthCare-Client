import instance from '../utils/axiosInstance'

export interface SuggestedActivityResponse {
  suggestedActivity: {
    kcal: number
    km: number
    timeMinutes: number,
    caloriesPerKmRate: number
  }
}

export interface SaveRunningSessionData {
  distanceKm: number;
  caloriesBurned: number;
  timeSeconds: number;
  date?: string; // YYYY-MM-DD format
}

export interface RunningSession {
  id?: string;
  distanceKm: number;
  caloriesBurned: number;
  timeSeconds: number;
  date: string;
  createdAt?: string;
}

export interface TodayRunningDataResponse {
  sessions: RunningSession[];
  summary: {
    totalDistanceKm: number;
    totalCaloriesBurned: number;
    totalTimeSeconds: number;
    sessionCount: number;
  };
  target?: {
    kcal: number;
    km: number;
    timeMinutes: number;
  };
}

export const getSuggestedActivity = async () => {
  const res = await instance.get('/running/me/suggested-activity');
  return res.data as SuggestedActivityResponse;
}

export const saveRunningSession = async (data: SaveRunningSessionData) => {
  const payload = {
    distanceKm: data.distanceKm,
    caloriesBurned: data.caloriesBurned,
    timeSeconds: data.timeSeconds,
    date: data.date || new Date().toISOString().split('T')[0], // Default to today
  };

  console.log('Saving running session with payload: ', payload);

  const res = await instance.post('/running/me/sessions', payload);
  return res.data;
}

export const getTodayRunningData = async (): Promise<TodayRunningDataResponse> => {
  const params: Record<string, any> = {}; 
  const res = await instance.get('/running/me/today');
  return res.data as TodayRunningDataResponse;
}

export interface RunningStatsResponse {
  stats: Array<{
    date: string; // YYYY-MM-DD or week identifier
    totalDistanceKm: number;
    totalCalories: number;
    totalDurationSec: number;
    sessionCount: number;
  }>;
  summary: {
    totalDistanceKm: number;
    totalCalories: number;
    totalDurationSec: number;
    totalSessions: number;
  };
}

export const getRunningStats = async (startDate: string, endDate: string, groupBy: 'day' | 'week' = 'day'): Promise<RunningStatsResponse> => {
  const params = {
    startDate,
    endDate,
    groupBy,
  };

  const res = await instance.get('/running/me/stats', { params });
  return res.data as RunningStatsResponse;
}

export default {
  getSuggestedActivity,
  saveRunningSession,
  getTodayRunningData,
  getRunningStats,
}
