<script setup lang="ts">
import LayoutAside from './components/LayoutAside.vue'
import LayoutMain from './components/LayoutMain.vue'
import Login from '@/views/Login/index.vue'
import { useElseStore } from '@/stores/elseStore'
const elseStore = useElseStore()

</script>

<template>

  <div class="container">
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
      <LayoutMain />
    </div>
  </div>
  
</template>

<style scoped lang="scss">
.actice{
    display: block;
}
.container {
  position: relative;
  // min-width: 732px;
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
  }
  .aside {
    max-width: 310px;
    height: 100%;
    transition: all 0.3s ease-in-out;
    &.active {
      display: none;
    }
  }
  
}

/* 小屏幕响应式处理 */
@media screen and (max-width: 1012px) {
  .container {
    .aside {
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      z-index: 100;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
      
      &:not(.active) {
        transform: translateX(0);
      }
    }
    
    .main {
      width: 100%;
      transition: transform 0.3s ease-in-out;
    }
    
    /* 当侧边栏打开时，主内容向右偏移 */
    .aside:not(.active) + .main {
      transform: translateX(280px);
    }
  }
}

@media screen and (max-width: 758px) {
  .aside-mask{
    display: block;
  }
  
  .container {
    .aside {
      width: 280px;
      
      &:not(.active) + .main {
        transform: translateX(280px);
      }
    }
  }
}
</style>
