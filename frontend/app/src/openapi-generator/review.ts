import axios from 'axios'
import { ReviewApi } from '@/openapi-generator/api'
import { Configuration } from '@/openapi-generator/configuration'
import { auth } from '@/firebase'

const { NEXT_PUBLIC_BASE_PATH } = process.env

const config = new Configuration({
  basePath: NEXT_PUBLIC_BASE_PATH,
})

const axiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_BASE_PATH,
})

axiosInstance.interceptors.request.use(async (request) => {
  const idToken = await auth.currentUser?.getIdToken(true)
  if (request.headers !== undefined && idToken !== undefined) {
    request.headers.Authorization = `Bearer ${idToken}`
  }
  return request
})

export const reviewApi = new ReviewApi(config, '', axiosInstance)
