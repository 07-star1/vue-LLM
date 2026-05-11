import http from "@/utils/http"
import { fetchEventSource, type EventSourceMessage } from "@microsoft/fetch-event-source"
// export const getLLM = ({ sessionId, userId, keyword }: { sessionId: string, userId: string, keyword: string }) => {
//   return http({
//     url: '/llm',
//     method: 'POST',
//     data: { sessionId, userId, keyword }
//   })
// }
export const llmSSEAPI = ({ sessionId, userId, keyword, callback }: { sessionId: string, userId: string, keyword: string, callback: (event: EventSourceMessage) => void }) => {
  return fetchEventSource('http://localhost:9000/api/llm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      auth: JSON.stringify(localStorage.getItem('token'))
    },
    body: JSON.stringify({ sessionId, userId, keyword }),
    onmessage: (event) => {
      callback(event)
    }
  })
}
export const historyChatAPI = ({ sessionId }: { sessionId: string }) => {
  return http({
    url: '/chat/list',
    method: 'GET',
    params: { sessionId }
  })
}
