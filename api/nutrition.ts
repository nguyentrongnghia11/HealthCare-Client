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

export default {
    getCalories,
    addManualMeal,
}

