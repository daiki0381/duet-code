import axios from 'axios'
import { UserApi, ReviewApi, NotificationApi, GitHubApi } from '@/api/api'
import { Configuration } from '@/api/configuration'
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

const userApi = new UserApi(config, '', axiosInstance)
const reviewApi = new ReviewApi(config, '', axiosInstance)
const notificationApi = new NotificationApi(config, '', axiosInstance)
const gitHubApi = new GitHubApi(config, '', axiosInstance)

export { userApi, reviewApi, notificationApi, gitHubApi }
