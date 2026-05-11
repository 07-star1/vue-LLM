import { newAPI, delAllAPI, delOneAPI, historyListAPI } from "@/apis/session"
import { ElMessage } from "element-plus"
import { defineStore } from "pinia"
import { ref } from "vue"
export const useSessionStore = defineStore('session', () => {
  interface Session {
    sessionId: string
    createdAt: string
    updatedAt: string
    userId: string
  }
  // 存储用户对话列表
  const historyList = ref<Session[]>([])
  // 当前对话
  const curSession = ref()
  // 创建新对话 
  const creatNew = async ({ userId }: { userId: string }) => {
    const res = await newAPI({ userId })
    localStorage.setItem('sessionId', res.data.data.sessionId)
  }
  // 获取历史对话列表
  const getHistoryList = async ({ userId }: { userId: string }) => {
    const res = await historyListAPI({ userId })
    historyList.value = res.data.data
  }
  // 删除所有历史对话
  const delAllHistory = async ({ userId }: { userId: string }) => {
    if (historyList.value.length === 0) {
      ElMessage.error("当前没有历史对话")
      return
    }
    await delAllAPI({ userId })
    historyList.value = []
  }
  // 删除单个历史对话
  const delOneHistory = async ({ sessionId }: { sessionId: string }) => {
    await delOneAPI({ sessionId })
    historyList.value = historyList.value.filter(item => item.sessionId !== sessionId)
  }
  return {
    historyList, curSession,
    creatNew, getHistoryList, delAllHistory, delOneHistory
  }
})