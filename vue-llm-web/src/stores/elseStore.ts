import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useElseStore = defineStore('else', () => {
  // 侧边栏是否折叠
  const isCollapse = ref(false)
  // 是否显示登录页
  const isLogin = ref(false)
  // 是否显示主页面
  const isMain = ref(false)
  // 是否是第一次发送消息
  const isFirstSend = ref(true);
  const handleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }
  const setIsCollapse = (val: boolean) => {
    isCollapse.value = val
  }
  const setLogin = (val: boolean) => {
    isLogin.value = val
  }
  const setIsMain = (val: boolean) => {
    isMain.value = val
    console.log(isMain.value)
  }
  const setIsFirstSend = (val: boolean) => {
    isFirstSend.value = val
  }
  return {
    isCollapse, isLogin, isMain, isFirstSend,
    handleCollapse, setIsCollapse, setLogin, setIsMain, setIsFirstSend
  }
}, {
  persist: true
})
