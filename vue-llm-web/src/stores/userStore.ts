import { defineStore } from 'pinia'
import { ref } from 'vue'
import { loginAPI, userAPI } from '@/apis/user'
export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref([])
  // 用户登录
  const userLogin = async ({ username, password }: { username: string, password: string }) => {
    const res = await loginAPI({ username, password })
    console.log(res)
    // 本地存储用户信息
    localStorage.setItem("userId", res.data.user._id)
    localStorage.setItem("token", res.data.token)
    userInfo.value = res.data.user
  }
  // 获取用户列表
  const getUserList = async () => {
    await userAPI()
  }
  return {
    userInfo,
    userLogin, getUserList
  }
},
  {
    persist: true,
  },
)