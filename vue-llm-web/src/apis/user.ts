import http from "@/utils/http"

// 用户注册
export const registerAPI = ({ username, password }: { username: string, password: string }) => {
  return http({
    url: '/user/register',
    method: 'POST',
    data: {
      username, password
    }
  })
}
// 用户登录
export const loginAPI = ({ username, password }: { username: string, password: string }) => {
  return http({
    url: '/user/login',
    method: 'POST',
    data: {
      username, password
    }
  })
}
// 获取用户列表
export const userAPI = () => {
  return http({
    url: '/user',
    method: 'GET'
  })
}
// 获取单个用户的信息
export const oneUserAPI = ({ token }: { token: string }) => {
  return http({
    url: '/user/profile',
    method: 'GET',
    params: {
      token
    }
  })
}