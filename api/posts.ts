import instance from '../utils/axiosInstance'

export interface Post {
  id: number | string
  title: string
  excerpt?: string
  content?: string
  image?: string
  date?: string
  [key: string]: any
}

export const getPosts = async (): Promise<Post[]> => {
  try {
    const res = await instance.get('/posts')
    return res.data as Post[]
  } catch (err: unknown) {
    console.error('getPosts error', err)
    throw err
  }
}

export const getPostById = async (id: string | number): Promise<Post | null> => {
  try {
    const res = await instance.get(`/posts/${id}`)
    return res.data as Post
  } catch (err: any) {
    if (err?.response?.status === 404) {
      return null
    }
    console.error('getPostById error', err)
    throw err
  }
}

export default {
  getPosts,
  getPostById,
}
