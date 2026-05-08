<script setup lang="ts">
import { useChatStore } from '@/stores/chatStore'
import { useElseStore } from '@/stores/elseStore'
import { useSessionStore } from '@/stores/sessionStore'
import { ElMessage } from 'element-plus'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const sessionStore=useSessionStore()
const elseStore=useElseStore()
const chatStore=useChatStore()

const user=JSON.parse(localStorage.getItem('user')||'')

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
  chatStore.title=""
  elseStore.setIsMain(true)
  // 清除旧的sessionId
  localStorage.removeItem('sessionId')
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
// 跳转历史对话
const toHistoryChat=async (sessionId:string)=>{
  elseStore.setIsFirstSend(true)
  localStorage.setItem('sessionId',sessionId)
  await chatStore.getHistoryChat({sessionId})
  if(chatStore.curChatList.length==0){
    elseStore.setIsMain(true)
  }
  else{
    elseStore.setIsMain(false)
  }
  router.push('/?sessionId='+sessionId)
}
// 删除所有历史对话
const toDelAllHistory=async ()=>{
  const userId=localStorage.getItem('userId')
  router.push('')
  if(!userId){
    ElMessage({type:"error",message:"请先登录"})
    elseStore.setLogin(true)
    return
  }
  await sessionStore.delAllHistory({userId})
  if(sessionStore.historyList.length==0){
    elseStore.setIsMain(true)
  }
  else{
    elseStore.setIsMain(false)
  }
  // getHistoryList()
  await toCreateNewSession()
  elseStore.setIsMain(true)
}
// 删除某个历史对话
const toDelOneHistory=async (sessionId:string)=>{
  const userId=localStorage.getItem('userId')
  if(!userId){
    ElMessage({type:"error",message:"请先登录"})
    elseStore.setLogin(true)
    return
  }
  await sessionStore.delOneHistory({sessionId})
    await toGetHistoryList()
    if(sessionStore.historyList.length==0){
    elseStore.setIsMain(true)
    await toCreateNewSession()
  }
  else{
    elseStore.setIsMain(false)
  }
}
onMounted(()=>toGetHistoryList())
</script>

<template>
<div class="container">
  <div class="mask-aside"></div>
  <!-- 侧边栏 header -->
  <div class="nav">
    <div class="nav-main">
      <div class="logo">
        <img src="https://fe-static.deepseek.com/chat/favicon.svg" alt="logo">
      </div>
      <span>Vue-LLM</span>
    </div>
  </div>
  <!-- 侧边栏 功能模块 -->
  <div class="function">
    <!-- 侧边栏 新对话 -->
    <div class="addNew" @click="toCreateNewSession">
      <div class="add-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cloud-plus" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5"/>
          <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383m.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z"/>
        </svg>
      </div>
      <div class="word">新对话</div>
    </div>
    <div class="func-item">
      <div class="icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-folder-check" viewBox="0 0 16 16">
          <path d="m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z"/>
          <path d="M15.854 10.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.707 0l-1.5-1.5a.5.5 0 0 1 .707-.708l1.146 1.147 2.646-2.647a.5.5 0 0 1 .708 0"/>
        </svg>
      </div>
      <div class="word">
        文档生成
      </div>
    </div>
  </div>
  <!-- 侧边栏 历史记录 -->
  <div class="history">
    <div class="history-title">
      <span>历史对话</span>
      <span class="del-icon" @click="toDelAllHistory">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
          <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
        </svg>
      </span>
    </div>
    <div class="history-list">
      <ul>
        <li v-for="item in sessionStore.historyList" :key="item.sessionId">
          <span @click="toHistoryChat(item.sessionId)">{{item.title}}</span>
          <span class="del-icon" @click="toDelOneHistory(item.sessionId)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
              <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
            </svg>
          </span>
        </li>
      </ul>
    </div>
  </div>
  <!-- 侧边栏 footer -->
  <div class="footer">
    <el-dropdown trigger="click">
      <div class="foot-main">
        <div class="user-avater">
          <img :src="user.userInfo.avater||'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" alt="">
        </div>
        <div class="user-name">
          <span>{{user.userInfo.username||"用户"}}</span>
        </div>
      </div>
      <template #dropdown>
        <el-dropdown-menu class="custom-dropdown-menu">
          <el-dropdown-item class="menu-item">
            <el-icon><Sunny /></el-icon>
            亮色主题
          </el-dropdown-item>
          <el-dropdown-item class="menu-item">
            <el-icon><Moon /></el-icon>
            暗色主题
          </el-dropdown-item>
          <el-dropdown-item class="menu-item">
            <el-icon><ChatDotRound /></el-icon>
            联系我们
          </el-dropdown-item>
          <el-dropdown-item class="menu-item danger">
            <el-icon><SwitchButton /></el-icon>
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  width: 310px;
  height: 100%;
  padding: 20px;
  background-color: rgb(245, 247, 248);
  z-index:1001;
  .mask-aside{
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); 
    backdrop-filter: blur(2px);
    z-index: 1000;
  }
  .nav{
    width: 100%;
    height: 36px;
    .nav-main{
      display: flex;
      width: calc(100% - 40px);
      height: 36px;
      justify-content: start;
      gap: 8px;
      .logo{
        // flex: 1;
        height: 36px;
        text-align: center;
        img{
          width: 36px;
          height: 36px;
          // margin-right: 10px;
          border-radius: 50%;
        }
      }
      span{
        // flex: 1;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        line-height: 36px;
      }
      
    }
  }
  .function{
    display: flex;
    flex-direction: column;
    gap: 10px;

    .addNew{
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      width: 100%;
      height: 36px;
      background-color: rgba(0, 87, 255,0.1);
      justify-content: center;
      gap: 8px;
      border-radius: 10px;
      border: 1px solid rgba(0, 87, 255,0.5);
      .add-icon{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        
        svg{
          width: 16px;
          height: 16px;
        }
      }
      
      .word{
        font-size: 16px;
        font-weight: 600;
      }
    }
    .func-item{
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      height: 36px;
      border-radius: 10px;
      &:hover{
        background-color: rgba(156, 153, 153, 0.1);
      }
      .icon{
        width: 16px;
        height: 16px;
      }
      .word{
        font-size: 16px;
      }
    }
  }
  .history{
    margin-top: 20px;
    max-height: calc(100% - 100px);
    overflow-y: auto;
    .history-title{
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      width: 100%;
      height: 36px;
      font-size: 16px;
      color: #8c8b8b;
      text-align: start;
      line-height: 36px;
    }
    .history-list{
      margin-top: 10px;
      ul{
        li{
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          height: 25px;
          gap:5px;
          .del-icon{
            display: none;
            width: 20px;
            height: 20px;
          }
          &:hover{
            .del-icon{
              display: block;
            }
          }
        }
      }
    }
  }
  .footer{
    cursor: pointer;
    margin-top: auto;
    padding: 10px 0;
    width: 100%;
    height: 36px;
    border-top: 1px solid #c8c8c8;
    .foot-main{
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      height: 30px;
      
      .user-avater{
        width: 36px;
        height: 36px;
        border-radius: 50%;
        
        img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }
      }
      
      .user-name{
        font-size: 16px;
        color: #333;
      }
      // 下拉菜单自定义样式
      :deep(.custom-dropdown-menu) {
        background: #ffffff;
        border: 1px solid #e4e7ed;
        border-radius: 8px;
        // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        padding: 8px 0;
        min-width: 160px;
        
        .menu-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #606266;
          padding: 8px 16px;
          transition: all 0.2s ease;
          
          &:hover {
            background-color: #f5f7fa;
            color: #409eff;
          }
          
          &.danger {
            color: #f56c6c;
            
            &:hover {
              background-color: #fef0f0;
              color: #f56c6c;
            }
          }
          
          .el-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 758px) {
  .mask-aside{
    display: block;
  }
}
</style>
