import http from "@/utils/http"
/**
 * 创建新对话
 * @param userId:string
 * 
 */
export const newAPI = ({ userId }: { userId: string }) => {
  return http({
    url: '/create',
    method: 'POST',
    data: {
      userId
    }
  })
}

/**
 * 获取用户历史对话列表
 * @param sessionId:string
 * @returns 历史对话列表
 */
export const historyListAPI = ({ userId }: { userId: string }) => {
  return http({
    url: '/history/list',
    method: 'POST',
    data: {
      userId
    }
  })
}
export const delAllAPI = ({ userId }: { userId: string }) => {
  return http({
    url: '/del/all',
    method: 'POST',
    data: {
      userId
    }
  })
}
export const delOneAPI = ({ sessionId }: { sessionId: string }) => {
  return http({
    url: '/del/one',
    method: 'POST',
    data: {
      sessionId
    }
  })
}