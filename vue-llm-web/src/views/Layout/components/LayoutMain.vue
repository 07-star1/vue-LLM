<script setup lang="ts">
import MainContent from './MainContent.vue'
import { ref } from 'vue'
import { useElseStore } from '@/stores/elseStore'
import { useChatStore } from '@/stores/chatStore'
import { ElMessage } from 'element-plus'
import { useSessionStore } from '@/stores/sessionStore'
import { useRouter } from 'vue-router'

const router = useRouter()
const elseStore = useElseStore()
const chatStore = useChatStore()
const sessionStore=useSessionStore()

const textarea = ref('')
// 创建新对话
const toCreateNewSession=async ()=>{
  const userId=localStorage.getItem('userId')
  // 用户是否登录
  if(!userId){
    ElMessage({type:"error",message:"请先登录"})
    elseStore.setLogin(true)
    return
  }
  chatStore.curChatList=[]
  chatStore.title="新对话"
  elseStore.setIsMain(true)
  // 清除旧的sessionId
  localStorage.removeItem('sessionId')
  chatStore.curSessionId=""
  elseStore.setIsFirstSend(true)
  router.replace('/')
  await toGetHistoryList()
}
// 获取用户历史对话列表
const toGetHistoryList = async () => {
  const userId=localStorage.getItem('userId')
  if(!userId){
    return
  }
  await sessionStore.getHistoryList({userId})
}
const toSendMsg = async () => {
  // 判断输入框内是否有内容
  if (!textarea.value) {
    ElMessage.error('请输入内容')
    textarea.value = ''
    return
  }
  const userMsg=textarea.value
  textarea.value = ''
  const userId=localStorage.getItem('userId')
  if(!userId){
    ElMessage.error('请先登录')
    elseStore.setLogin(true)
    return
  }
  // 没有会话，则创建会话
  if(!localStorage.getItem('sessionId')){
    await sessionStore.creatNew({userId})
    chatStore.curSessionId=localStorage.getItem('sessionId')!
    router.replace('/?sessionId='+localStorage.getItem('sessionId'))
  }
  const sessionId=localStorage.getItem('sessionId')
  if (!sessionId) {
    ElMessage.error('请先创建对话')
    return
  }
  // 发送消息后，将isMain设置为false,显示聊天内容
  elseStore.setIsMain(false)
  chatStore.curChatList.push({
    role: "user",
    id: Date.now().toString(),
    content: userMsg
  })
  await chatStore.sendMsg({ sessionId: sessionId!,  userId: userId!, keyword: userMsg})
  await chatStore.getHistoryChat({ sessionId: sessionId! })
  setTimeout(async () => {
    await sessionStore.getHistoryList({ userId: userId! })
  }, 500)
}

</script>

<template>
  <div class="container">
    <!-- 导航栏 -->
    <div class="main-nav">
      <!-- 控制侧边栏显示 -->
      <div class="control-aside" @click="elseStore.handleCollapse()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-layout-sidebar" viewBox="0 0 16 16">
          <path d="M0 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm5-1v12h9a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM4 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
        </svg>
      </div>
      <div class="nav-alert">
        <span>{{ chatStore.title }}</span>
        <span>内容由AI生成</span>
      </div>
      <div class="new-icon" @click=toCreateNewSession>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-plus" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"/>
          <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
        </svg>
      </div>
    </div>
    <div class="main-item" v-show="elseStore.isMain">
      <div class="div">
        <div class="hello" ><h1>今天有什么可以帮到你？</h1></div>
      </div>
    </div>
    <div class="main-section" v-show="!elseStore.isMain">
      <MainContent />
    </div>
    <!-- 底部输入框 -->
    <div class="main-footer">
      <div class="input-box">
        <div class="user-input">
          <el-input
            class="el-input"
            v-model="textarea"
            :autosize="{ minRows: 2, maxRows: 5 }"
            type="textarea"
            placeholder="发消息"
            resize="none"
            spellcheck="false"
          />
        </div>
        <div class="input-icons">
          <div class="left-icons">
            <!-- 这里可以添加左侧图标 -->
          </div>
          <div class="send" @click="toSendMsg">
            <el-icon class="el-icon-position"><Position /></el-icon>
          </div>
        </div>
      </div>
      <!-- 提示信息 -->
       <div class="alert">
        <span>内容由AI生成，请仔细甄别</span>
       </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.active {
  display: block !important;
}
.container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .main-nav {
    
    height: 60px;
    display: flex;
    align-items: center;
    background-color: var(--color-bg-primary);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .control-aside {
      cursor: pointer;
      margin-left: 20px;
      .bi-list{
        display: none;
      }
    }
    
    .nav-alert {
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      
      span:first-child {
        font-size: 18px;
        font-weight: bold;
      }
      
      span:last-child {
        font-size: 12px;
        color: #999;
      }
    }
    .new-icon{
      margin-right: 20px;
      width: 20px;
      height: 20px;
    }
  }
  
  .main-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    .hello {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .main-section {
    max-height: calc(100% - 200px);
    min-height: calc(100% - 300px);
    flex: 1;
    display: flex;
    justify-content: center;
    // overflow-y: auto;
    // 滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
      
      &:hover {
        background: #a8a8a8;
      }
    }
  }
  .main-footer {
    // 输入框固定在页面底部
    // position: fixed;
    // bottom: 0;
    // left: 0;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-height: 200px;
    padding: 0 20px; 
    // background-color: var(--color-bg-primary);
    .input-box {
      display: flex;
      flex-direction: column;

      width: 100%;
      max-width: 750px;
      border-radius: 20px;
      border: var(--border-set);
      box-shadow: var(--border-shadow);
      padding: 10px 5px; 
      
      .user-input {
        .el-input {
          :deep(.el-textarea__inner) {
            width: 100%;
            max-height: 160px;
            min-height: 50px;
            border: none;
            resize: none;
            overflow-y: auto;
            font-size: 14px;
            line-height: 1.5;
            box-shadow: none;
            background-color: transparent;
            color: var(--color-text-primary);
            &:focus {
              outline: none !important;
              border: none !important;
              box-shadow: none !important;
            }
            
            &:hover {
              border: none !important;
            }
            
            &::placeholder {
              color: #8fb8e1;
              font-size: 14px;
            }
            
            // 滚动条样式
            &::-webkit-scrollbar {
              width: 6px;
            }
            
            &::-webkit-scrollbar-track {
              background: transparent;
              border-radius: 3px;
            }
            
            &::-webkit-scrollbar-thumb {
              background: #c1c1c1;
              border-radius: 3px;
              
              &:hover {
                background: #a8a8a8;
              }
            }
          }
        }
      }
      
      .input-icons {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        
        .left-icons {
          display: flex;
          align-items: center;
          justify-content: start;
          gap: 8px;
          
        }
        
        .send {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
          background-color: transparent;
          
          &:hover {
            .el-icon-position {
              color: #2363ac;
            }
          }
          
          .el-icon-position {
            font-size: 30px;
            color: #a5a3a3;
          }
        }
      }
    }
    .alert {
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  }
}
// @media screen and (min-width: 768px) and (max-width: 1025px) {
//   .new-icon{
//     display: block !important;
//   }
// }
// 顶部导航栏左侧图标点击显示侧边栏，右侧图标点击创建新对话，侧边栏默认关闭，展开侧边栏时，侧边栏覆盖在主内容上方
@media screen and (max-width: 768px) {
  .bi-layout-sidebar{
    display: none;
  }
  .new-icon{
    display: block !important;
  }
  .bi-list{
    display: block !important;
    width: 20px;
    height: 20px;
  }
}
</style>