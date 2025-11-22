import instance from '../utils/axiosInstance'

export interface CaloriesResponse {
    user: any
    summary: any
    meals: Array<any>
    runs?: Array<any>
}

export const uploadImage = async (uri: string) => {

    console.log('Uploading image with uri: ', uri);
    const formData = new FormData();

    const filename: string = uri.split('/').pop() as string;
    const match = /\.(\w+)$/.exec(filename);
    const type: string = match ? `image/${match[1]}` : `image`;

    formData.append('files', {
        uri,
        name: filename,
        type,
    } as any);

    formData.forEach((value, key) => {
        console.log(`FormData key: ${key}, value: ${value}`);
    });

    try {
        const res = await instance.post('/nutrition/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })

        console.log('Response from upload: ', res.data)

        if (res.data.data)
            return res.data.data;
       

    } catch (error: unknown) {
        console.log('Lỗi khi upload: ', error);
        throw new Error(error as string);
    }
};

export const getCalories = async (date?: string): Promise<CaloriesResponse> => {

    console.log("Fetching calories for date: ", date)

    const params: Record<string, any> = {}
    if (date) params.date = date

    const res = await instance.get('/user/me/calories', {
        params,
    })
    return res.data as CaloriesResponse
}

export interface ManualMealData {
    foodName: string
    calories: number
    protein: number
    carbs: number
    fat: number
}

export const addManualMeal = async (data: ManualMealData) => {
    console.log('Adding manual meal:', data)
    
    const res = await instance.post('/nutrition/me/manual', data)
    
    console.log('Manual meal added successfully:', res.data)
    return res.data
}

export const getWeeklyCalories = async (): Promise<number> => {
    try {
        // Get dates for the current week (Monday to Sunday)
        const now = new Date()
        const dayOfWeek = now.getDay()
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // Adjust to Monday
        const monday = new Date(now)
        monday.setDate(now.getDate() + diff)
        monday.setHours(0, 0, 0, 0)
        
        let totalCalories = 0
        
        // Fetch calories for each day of the week
        for (let i = 0; i < 7; i++) {
            const date = new Date(monday)
            date.setDate(monday.getDate() + i)
            const dateStr = date.toISOString().split('T')[0]
            
            try {
                const data = await getCalories(dateStr)
                const dayCalories = data.meals?.reduce((sum, meal) => {
                    return sum + (meal.calories || 0)
                }, 0) || 0
                totalCalories += dayCalories
            } catch (error) {
                console.error(`Error fetching calories for ${dateStr}:`, error)
            }
        }
        
        return Math.round(totalCalories)
    } catch (error) {
        console.error('Error calculating weekly calories:', error)
        return 0
    }
}

export default {
    getCalories,
    addManualMeal,
    getWeeklyCalories,
}