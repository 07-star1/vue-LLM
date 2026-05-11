<script setup lang="ts">
import { ref,nextTick, onMounted, useTemplateRef, watch, shallowRef, onUnmounted } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import {useSessionStore} from '@/stores/sessionStore'
import {VueMarkdown} from '@crazydos/vue-markdown'
import { useRoute } from 'vue-router'
import { useScroll } from '@vueuse/core'
const chatStore = useChatStore(); 
const sessionStore=useSessionStore()
const route=useRoute()
const scrollContainer = useTemplateRef<HTMLElement>('toBottom')
const reactiveValue = shallowRef(false)
const isShow = ref(true)
const isThink = ref(false)
// 获取当前界面的高度
const height = document.documentElement.clientHeight
const {y,arrivedState ,isScrolling}=useScroll(scrollContainer,{behavior:'smooth'})
// 监听是否滚动到底部
const autoScrollEnabled = ref(true)
let scrollTimeout: ReturnType<typeof setTimeout> | null = null

watch(() => arrivedState.bottom, (isBottom) => {
  if (isBottom) {
    // 滚动到底部，恢复自动滚动
    autoScrollEnabled.value = true
    if (scrollTimeout) {
      clearTimeout(scrollTimeout)
      scrollTimeout = null
    }
  } else {
    // 离开底部，延迟3秒后如果还在底部才恢复
    if (scrollTimeout) clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      if (arrivedState.bottom) {
        autoScrollEnabled.value = true
      }
      scrollTimeout = null
    }, 3000)
  }
})

// 监听滚动状态（辅助判断）
watch(isScrolling, (scrolling) => {
  if (scrolling && !arrivedState.bottom) {
    autoScrollEnabled.value = false  // 用户手动滚动离开底部
  }
})

// 滚动到底部
const scrollToBottom = async (behavior: ScrollBehavior = 'smooth') => {
  await nextTick()
  if (!scrollContainer.value) return
  scrollContainer.value.scrollTo({
    top: scrollContainer.value.scrollHeight,
    behavior
  })
}

// 触发自动滚动
const triggerAutoScroll = async (behavior: ScrollBehavior = 'smooth') => {
  if (autoScrollEnabled.value) {
    await scrollToBottom(behavior)
  }
}

// 监听消息数量变化
watch(() => chatStore.curChatList.length, async () => {
  await triggerAutoScroll('smooth')
})

// 监听消息内容变化（流式响应）
watch(() => chatStore.curChatList, async (newList, oldList) => {
  if (newList.length && oldList?.length) {
    const lastNew = newList[newList.length - 1]
    const lastOld = oldList[oldList.length - 1]
    if (lastNew?.role === 'assistant' && 
        lastOld?.role === 'assistant' &&
        lastNew.content !== lastOld.content) {
      await triggerAutoScroll('auto')  // 流式用 auto 避免卡顿
    }
  }
}, { deep: true })

// 历史消息加载时滚动到底部
watch(() => route.query.sessionId, async () => {
  if (route.query.sessionId) {
    await chatStore.getHistoryChat({ sessionId: route.query.sessionId as string })
    await nextTick()
    scrollToBottom('auto')
  }
})

// 组件挂载
onMounted(async () => {
  if (route.query.sessionId) {
    await chatStore.getHistoryChat({ sessionId: route.query.sessionId as string })
    await nextTick()
    scrollToBottom('auto')
  }
})

onUnmounted(() => {
  if (scrollTimeout) clearTimeout(scrollTimeout)
})
const handleIcons=()=>{
  isShow.value=!isShow.value
}
// 监听路由变化
watch(route,async ()=>{
  if(route.query.sessionId){
    await chatStore.getHistoryChat({sessionId:route.query.sessionId as string})
  }
})
onMounted(async ()=>{
  if(route.query.sessionId){
    // 跳转历史对话时，显示历史对话消息
    await chatStore.getHistoryChat({sessionId:route.query.sessionId as string})
  }
})
</script>

<template>
  <div class="container" ref="toBottom">
    <div class="content">
      <div class="chat-content" v-for="(item, index) in chatStore.curChatList" :key="index">
        <div class="user-msg" v-if="item.role === 'user'">
          <h3>{{ item.content }}</h3>
        </div>
        <div class="ai-msg" v-else>
          <VueMarkdown :markdown="item.content"/>
        </div>
      </div>
      <div class="loading" v-if="isThink">
        <img alt="网页动态加载（loading）GIF图标" src="../../../assets/5-121204193936.gif">
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
.container {
  cursor:default;
  display: flex;
  justify-content: start;
  align-items: start;
  width: calc(100% - 100px);
  padding: 20px;
  overflow-y: auto;
  .content{
    width: 100%;

    .chat-content{
      margin-bottom: 20px;
      width: 100%;
      .user-msg{
        width: 100%;
        display: flex;
        align-items: center;
        // 用户消息靠右对齐
        justify-content: flex-end;
        h3{
          background-color: #94d9ef;
          padding: 10px;
          border-radius: 10px;
          font-size: 14px;
          color: #333;
        }
      }
      .ai-msg{

        width: 100%;

        p{
          font-size: 16px;
          color: #000;
        }
      }
    }
  }
}
</style>
