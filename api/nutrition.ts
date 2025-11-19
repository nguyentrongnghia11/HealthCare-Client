import AsyncStorage from '@react-native-async-storage/async-storage'
import instance from '../utils/axiosInstance'

export interface CaloriesResponse {
    user: any
    summary: any
    meals: Array<any>
    runs?: Array<any>
}

export const getCalories = async (date?: string): Promise<CaloriesResponse> => {

    console.log("Fetching calories for date: ", date)
    const token = await AsyncStorage.getItem('token')

    const params: Record<string, any> = {}
    if (date) params.date = date

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await instance.get('/user/me/calories', {
        params,
        headers,
    })
    return res.data as CaloriesResponse
}

export default {
    getCalories,
}

