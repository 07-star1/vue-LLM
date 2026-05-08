import http from "@/utils/http"
/**
 * 创建新对话
 * @param userId:string
 * 
 */
export const newSession = ({ userId }: { userId: string }) => {
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
export const hasHistoryList = ({ userId }: { userId: string }) => {
  return http({
    url: '/history/list',
    method: 'POST',
    data: {
      userId
    }
  })
}
export const delAll = ({ userId }: { userId: string }) => {
  return http({
    url: '/del/all',
    method: 'POST',
    data: {
      userId
    }
  })
}
export const delOne = ({ sessionId }: { sessionId: string }) => {
  return http({
    url: '/del/one',
    method: 'POST',
    data: {
      sessionId
    }
  })
}