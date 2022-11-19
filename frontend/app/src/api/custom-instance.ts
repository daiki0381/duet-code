import axios from 'axios'
import { UserApi, ReviewApi, NotificationApi, GitHubApi } from '@/api/api'
import { Configuration } from '@/api/configuration'

const config = new Configuration({
  basePath: process.browser
    ? process.env.NEXT_PUBLIC_API_SERVER_HOST
    : process.env.API_SERVER_HOST,
})

const axiosInstance = axios.create({
  baseURL: process.browser
    ? process.env.NEXT_PUBLIC_API_SERVER_HOST
    : process.env.API_SERVER_HOST,
})

const userApi = new UserApi(config, '', axiosInstance)
const reviewApi = new ReviewApi(config, '', axiosInstance)
const notificationApi = new NotificationApi(config, '', axiosInstance)
const gitHubApi = new GitHubApi(config, '', axiosInstance)

export { userApi, reviewApi, notificationApi, gitHubApi }
