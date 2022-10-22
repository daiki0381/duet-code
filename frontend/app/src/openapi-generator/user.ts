import axios from 'axios'
import { UserApi } from '@/openapi-generator/api'
import { Configuration } from '@/openapi-generator/configuration'
import { getAuth } from 'firebase/auth'

const { NEXT_PUBLIC_BASE_PATH } = process.env

const config = new Configuration({
  basePath: NEXT_PUBLIC_BASE_PATH,
})

const axiosInstance = axios.create({
  baseURL: NEXT_PUBLIC_BASE_PATH,
})

axiosInstance.interceptors.request.use(async (request) => {
  const idToken = await getAuth().currentUser?.getIdToken(true)
  if (idToken !== undefined && request.headers !== undefined) {
    request.headers.Authorization = `Bearer ${idToken}`
  }
  return request
})

export const userApi = new UserApi(config, '', axiosInstance)
