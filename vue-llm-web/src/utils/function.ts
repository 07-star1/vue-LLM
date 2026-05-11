import { useElseStore } from "@/stores/elseStore"
import { ElMessage } from "element-plus"
import { useChatStore } from "@/stores/chatStore"
import { useSessionStore } from "@/stores/sessionStore"
import { useRouter } from "vue-router"
const elseStore = useElseStore()
const chatStore = useChatStore()
const sessionStore = useSessionStore()
const router = useRouter()
// 创建新对话
export const toCreateNewSession = async () => {
  const userId = localStorage.getItem('userId')
  // 用户是否登录
  if (!userId) {
    ElMessage({ type: "error", message: "请先登录" })
    elseStore.setLogin(true)
    return
  }
  chatStore.curChatList = []
  chatStore.title = "新对话"
  elseStore.setIsMain(true)
  // 清除旧的sessionId
  localStorage.removeItem('sessionId')
  chatStore.curSessionId = ""
  elseStore.setIsFirstSend(true)
  router.replace('/')
  await toGetHistoryList()
}
// 获取用户历史对话列表
export const toGetHistoryList = async () => {
  const userId = localStorage.getItem('userId')
  if (!userId) {
    return
  }
  await sessionStore.getHistoryList({ userId })
}