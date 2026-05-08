import { llmSSE, historyChat } from "@/apis/chat"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useSessionStore } from "@/stores/sessionStore"
import { useElseStore } from "@/stores/elseStore"
export const useChatStore = defineStore('chat', () => {
  // 存储用户当前对话对话消息列表
  const curChatList = ref<{ role: string, id: string, content: string }[]>([])
  const title = ref('新对话')
  const curSessionId = ref('')
  const sessionStore = useSessionStore()
  const elseStore = useElseStore()
  const sendMsg = async ({ sessionId, userId, keyword }: { sessionId: string, userId: string, keyword: string }) => {
    await llmSSE({
      sessionId, userId, keyword, callback: async (event) => {
        const _data = JSON.parse(event.data)
        const _curChatList = [...curChatList.value]
        const index = _curChatList.findIndex((item) => item.id === _data.id)
        if (index !== -1) {
          _curChatList[index] = _data
        } else {
          _curChatList.push(_data)
        }
        curChatList.value = _curChatList
        if (elseStore.isFirstSend) {
          await sessionStore.getHistoryList({ userId })
          const res = await historyChat({ sessionId })
          console.log("历史对话1", res)
          title.value = res.data.data.title
          console.log("标题", title.value)
          elseStore.setIsFirstSend(false)
        }
      }
    })

  }
  // 获取某个历史对话
  const getHistoryChat = async ({ sessionId }: { sessionId: string }) => {
    if (curSessionId.value === sessionId) {
      return
    }
    curSessionId.value = sessionId
    const res = await historyChat({ sessionId })
    console.log("历史对话", res)
    curChatList.value = res.data.data.list
    title.value = res.data.data.title
  }
  return {
    curChatList, title, curSessionId,
    sendMsg,
    getHistoryChat
  }
})