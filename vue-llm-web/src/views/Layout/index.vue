<script setup lang="ts">
import LayoutAside from './components/LayoutAside.vue'
import LayoutMain from './components/LayoutMain.vue'
import Login from '@/views/Login/index.vue'
import { useElseStore } from '@/stores/elseStore'
import { onMounted, onUnmounted } from 'vue'

const elseStore = useElseStore()
// 监听屏幕尺寸变化
const handleResize = () => {
  const width = window.innerWidth
  if (width <= 1025) {
    // 中屏和小屏：默认隐藏侧边栏
    elseStore.setIsCollapse(true)
  } else {
    // 大屏：默认显示侧边栏
    elseStore.setIsCollapse(false)
  }
}

onMounted(() => {
  handleResize() // 初始检查
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 关闭侧边栏（点击遮罩时调用）
const closeSidebar = () => {
  elseStore.setIsCollapse(true)
}
</script>

<template>

  <div class="container" >
    <div class="login-modal" v-if="elseStore.isLogin">
      <div class="modal-mask"></div>
      <div class="modal-wrapper">
        <Login />
      </div>
    </div>
    <div class="aside" :class="{'active': elseStore.isCollapse}">
      <LayoutAside />
    </div>
    <div class="main">
      <div 
        v-if="!elseStore.isCollapse"
        class="main-overlay"
        @click="closeSidebar"
      ></div>
      <LayoutMain />
    </div>
  </div>
  
</template>

<style scoped lang="scss">
.active{
    display: block;
}
.container {
  position: relative;
  height: 100%;
  display: flex;
  .login-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; 
    
    .modal-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5); 
      backdrop-filter: blur(2px);
    }
    
    .modal-wrapper {
      position: relative;
      z-index: 1001; 
      max-width: 90%;
      max-height: 90%;
      overflow: auto;
    }
  }
  .main {
    flex: 1;
    height: 100%;
    min-width: 0; 
    background-color: var(--color-bg-primary);
    .main-overlay{
      display: block;
    }
  }
  .aside {
    max-width: 310px;
    height: 100%;
    transition: all 0.3s ease-in-out;
    background-color: var(--color-bg-primary);
    &.active {
      display: none;
    }
  }
  
}

// >768px and <1025px  图标、侧边栏、创建新对话的图标在左侧显示，侧边栏默认关闭，展开侧边栏时，主内容宽度减少310px
@media screen and (min-width: 768px) and (max-width: 1025px) {
  .aside-mask{
    display: block;
  }
  
  .container {
    .aside {
      width: 310px;
    }
    
    .main {
      width: 100%;
      transition: transform 0.3s ease-in-out;
    }
  }
}
// <768px 顶部导航栏左侧图标点击显示侧边栏，右侧图标点击创建新对话，侧边栏默认关闭，展开侧边栏时，侧边栏覆盖在主内容上方
@media screen and (max-width: 768px) {
  .aside{
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    width: 310px;
    z-index: 200; // 侧边栏在遮罩之上
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
    // transform: translateX(-100%); // 默认隐藏在左侧
    
    &.show {
      transform: translateX(0); // 展开时滑入
    }
  }
  .main{
    width: 100%;
    .main-overlay {
      display: block;
      position: absolute;
      inset: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 150; // 在主内容上，但在侧边栏下
      pointer-events: auto; // 确保可以点击
      animation: fadeIn 0.3s ease;
    }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
</style>
