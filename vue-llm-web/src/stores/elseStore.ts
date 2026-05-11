import { ref, watchEffect } from 'vue'
import { defineStore } from 'pinia'

export const useElseStore = defineStore('else', () => {
  // 主题切换
  const theme = ref('light')
  // 侧边栏是否折叠
  const isCollapse = ref(false)
  // 是否显示登录页
  const isLogin = ref(false)
  // 是否显示主页面
  const isMain = ref(false)
  // 是否是第一次发送消息
  const isFirstSend = ref(true);
  watchEffect(() => {
    document.documentElement.dataset.theme = theme.value
  })
  const useTheme = (val: string) => {
    theme.value = val
  }
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
  }
  const setIsFirstSend = (val: boolean) => {
    isFirstSend.value = val
  }
  return {
    isCollapse, isLogin, isMain, isFirstSend, theme,
    handleCollapse, setIsCollapse, setLogin, setIsMain, setIsFirstSend, useTheme
  }
}, {
  persist: true
})
