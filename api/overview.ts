import instance from '../utils/axiosInstance';

export interface WeeklyStats {
  steps: number;
  caloriesBurned: number;
  waterMl: number;
  sleepMinutes: number;
}

export interface StatsDataPoint {
  date: string;
  value: number;
  [key: string]: any;
}

export interface ChartData {
  labels: string[];
  datasets: {
    [key: string]: number[];
  };
}

export interface StatsResponse {
  stats: StatsDataPoint[];
  chartData: ChartData;
  summary: {
    [key: string]: number;
  };
}

/**
 * Get weekly statistics (steps, calories burned, water, sleep)
 * @returns Weekly stats for the current week
 */
export async function getWeeklyStats(): Promise<WeeklyStats> {
  try {
    const response = await instance.get('/user/me/weekly-stats');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching weekly stats:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get running statistics for a date range
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @returns Running stats grouped by week
 */
export async function getRunningStats(startDate: string, endDate: string): Promise<StatsResponse> {
  try {
    const response = await instance.get('/running/me/stats', {
      params: {
        startDate,
        endDate,
        groupBy: 'week',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching running stats:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get nutrition statistics for a date range
 * @param startDate Start date in YYYY-MM-DD format
 * @param endDate End date in YYYY-MM-DD format
 * @returns Nutrition stats grouped by week
 */
export async function getNutritionStats(startDate: string, endDate: string): Promise<StatsResponse> {
  try {
    const response = await instance.get('/nutrition/me/stats', {
      params: {
        startDate,
        endDate,
        groupBy: 'week',
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching nutrition stats:', error.response?.data || error.message);
    throw error;
  }
}
