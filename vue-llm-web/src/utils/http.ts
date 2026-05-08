import axios from 'axios'
import { ElMessage } from 'element-plus'
const http = axios.create({
  baseURL: 'http://localhost:9000/api',
  timeout: 500000000,
  headers: {
    'Content-Type': 'application/json',
  },
})
// 请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
// 响应拦截器
http.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.dir(error)
    const { response } = error
    if (response)
      ElMessage({ type: "error", message: response.data.message })

    return Promise.reject(error)
  }
)
export default http
