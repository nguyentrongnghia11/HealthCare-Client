import instance from '../utils/axiosInstance'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface SleepRecord {
  id?: string
  date: string // YYYY-MM-DD
  bedtime: string
  wakeup: string
  user?: any
}

const STORAGE_USER_KEY = 'user'

const getStoredUser = async () => {
  try {
    // Try AsyncStorage (native) first
    const json = await AsyncStorage.getItem(STORAGE_USER_KEY)
    if (json) return JSON.parse(json)
  } catch (e) {
    // ignore
  }

  try {
    // Fallback to window.localStorage (web)
    // @ts-ignore
    const s = global?.localStorage?.getItem(STORAGE_USER_KEY)
    if (s) return JSON.parse(s)
  } catch (e) {
    // ignore
  }

  return null
}

export const getSleepForDate = async (date?: string): Promise<SleepRecord | null> => {
  const params: Record<string, any> = {}
  if (date) params.date = date
  try {
    const res = await instance.get('/user/me/sleep', { params })
    // expect res.data to be either object or { data: [...] }
    const data = res.data && (res.data.data || res.data)
    if (!data) return null
    // If array, pick first
    if (Array.isArray(data)) return data[0] ?? null
    return data as SleepRecord
  } catch (err: any) {
    if (err?.response?.status === 404) return null
    console.error('getSleepForDate error', err)
    throw err
  }
}

export const getLatestSleep = async (): Promise<SleepRecord | null> => {
  try {
    const res = await instance.get('/user/me/sleep/latest')
    return res.data || null
  } catch (err: any) {
    if (err?.response?.status === 404) return null
    console.error('getLatestSleep error', err)
    return null
  }
}

export const getSleepSeries = async (endDate?: string, days = 7) => {
  try {
    const params: Record<string, any> = {}
    if (endDate) params.endDate = endDate
    if (days) params.days = days
    const res = await instance.get('/user/me/sleep/series', { params })
    return res.data?.data || []
  } catch (err: any) {
    console.error('getSleepSeries error', { message: err?.message, status: err?.response?.status, data: err?.response?.data })
    throw err
  }
}

export const saveSleepSchedule = async (payload: { date: string; bedtime: string; wakeup: string }) => {
  try {
    // try attach user if available
    const user = await getStoredUser()
    const body: any = { ...payload }
    if (user && (user.id || user._id)) body.user = { id: user.id ?? user._id }

    const res = await instance.post('/user/me/sleep', body)
    return res.data
  } catch (err: any) {
    console.error('saveSleepSchedule error', {
      message: err?.message,
      status: err?.response?.status,
      data: err?.response?.data,
      headers: err?.response?.headers,
      request: err?.request,
      config: err?.config,
    })
    throw err
  }
}

export default {
  getSleepForDate,
  getLatestSleep,
  saveSleepSchedule,
}
