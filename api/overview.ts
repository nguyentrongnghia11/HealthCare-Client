import instance from '../utils/axiosInstance';

export interface WeeklyStats {
  steps: number;
  caloriesBurned: number;
  waterMl: number;
  sleepMinutes: number;
}

export interface WeeklySummary {
  weeklyCaloriesConsumed: number;
  weeklySleepHours: number;
  weeklySteps: number;
  weeklyAvgCaloriesFromMeals: number;
  weeklyCaloriesBurned: number;
  nextPeriodPrediction: string;
}

export interface TodaySummary {
  date: string;
  sleep: {
    bedtime: string;
    wakeup: string;
  };
  steps: number;
  waterMl: number;
  sleepMinutes: number;
  nutrition: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    mealsCount: number;
  };
  cycle: {
    phase: string;
    dayInCycle: number;
    daysUntilNextPeriod: number;
  };
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
 * Get weekly summary (calories, sleep, steps, cycle tracking)
 * @returns Weekly summary for the current week
 */
export async function getWeeklySummary(): Promise<WeeklySummary> {
  try {
    const response = await instance.get('/user/me/weekly-summary');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching weekly summary:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get today's summary (sleep, steps, nutrition, cycle)
 * @returns Today's summary data
 */
export async function getTodaySummary(): Promise<TodaySummary> {
  try {
    const response = await instance.get('/user/me/today-summary');
    return response.data;
  } catch (error: any) {
    console.error('Error fetching today summary:', error.response?.data || error.message);
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

/**
 * Blog post interface
 */
export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  content?: string;
}

/**
 * Get all blog posts
 * @returns Array of blog posts
 */
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await instance.get('/posts');
    console.log('Fetched posts:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching blog posts:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get a single blog post by ID
 * @param id Blog post ID
 * @returns Blog post details
 */
export async function getBlogPostById(id: string | number): Promise<BlogPost> {
  try {
    const response = await instance.get(`/posts/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching blog post:', error.response?.data || error.message);
    throw error;
  }
}
