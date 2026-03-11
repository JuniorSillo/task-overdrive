import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10_000,
})


apiClient.interceptors.request.use(
  (config) => {
    config.headers['Task-Client'] = 'Vite'
    return config
  },
  (error) => Promise.reject(error)
)


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error) || error.name === 'CanceledError') {
      console.info('[API] Request cancelled by AbortController')
    } else {
      console.error('[API] Response error:', error?.response?.status, error?.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient 