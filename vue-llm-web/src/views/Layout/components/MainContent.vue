<script setup lang="ts">
import { ref,nextTick, onMounted, useTemplateRef, watch, shallowRef } from 'vue'
import { useChatStore } from '@/stores/chatStore'
import {useSessionStore} from '@/stores/sessionStore'
import {VueMarkdown} from '@crazydos/vue-markdown'
import { useRoute } from 'vue-router'
import { useScroll } from '@vueuse/core'
const chatStore = useChatStore(); 
const sessionStore=useSessionStore()
const route=useRoute()
const scrollToBottom = useTemplateRef<HTMLElement>('toBottom')
const reactiveValue = shallowRef(false)
const {measure}=useScroll(scrollToBottom)
const isShow = ref(true)
const isThink = ref(false)
const handleIcons=()=>{
  isShow.value=!isShow.value
}


const getById=async (id:string)=>{
  await chatStore.getHistoryChat({sessionId:id})
}
// 监听路由变化
watch(route,async ()=>{
  console.log(route.query.sessionId)
  if(route.query.sessionId){
    await getById(route.query.sessionId as string)
  }
})
watch(reactiveValue, () => {
  nextTick(() => {
    measure()
    console.log(scrollToBottom.value?.scrollHeight)
    console.log("滚动到最底部")
  })
})
onMounted(async ()=>{
  const userId=localStorage.getItem('userId')
  if(route.query.sessionId){
    // 跳转历史对话时，显示历史对话消息
    await getById(route.query.sessionId as string)
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
      <!-- 用户问题 -->
      <!-- <div class="user-msg">
        <h3>您好，我被一个企业鸽了一个offer，我失去了我已经有的国企工作，我现在很苦恼，我可以要到赔偿吗？我需要什么证据呢？我大概要花多少钱。</h3>
      </div>
      <div class="nav">
        <div class="lf-items">
          <div class="lf-item1">法律咨询</div>
          <div class="lf-item2">
            <p>内容已生成</p>
            <div class="icon">
              <el-icon><Check /></el-icon>
            </div>
          </div>
          <div class="lf-item3">2026-03-31 22:07:28</div>
        </div>
        <div class="rf-item">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" class="bi bi-arrow-down-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
            </svg>
          </div>
          <p>导出报告</p>
        </div>
      </div> -->
      <!-- 输出答案 -->
      <!-- <div class="output">
        <div class="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
        </div>
        <div class="output-text">输出答案</div>
        <div class="output-desc">
          累计检索<p>16</p>条参考法规，<p>5</p>条参考案例，<p>9</p>篇实务文章，共节省阅读<p>118</p>分钟
        </div>
      </div> -->
      <!-- ai 思考 -->
      <!-- <div class="think-dec">
        <div class="dec">
          <div class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="rgb(228, 113, 11)" class="bi bi-stars" viewBox="0 0 16 16">
              <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
            </svg>
          </div>
          <div class="word">
            已深度思考（用时21秒）
          </div>
          <div class="icons" @click="handleIcons">
            <div class="section-icon" v-if="isShow">
            <el-icon><ArrowDown /></el-icon>
          </div>
          <div class="section-icon" v-else>
            <el-icon><ArrowUp /></el-icon>
          </div>
          </div>
        </div>
      </div>
      <div class="reply">
        <div class="reply-content">
          <p>
            一、核心结论
可以要求赔偿。新公司无正当理由取消录用(俗称“鸽了offer”)的行为，违背了诚实信用原则，构成缔约过失，应对您因此遭受的合理损失(如失业期间的工资损失)承担赔偿责任。支持该结论的关键前提是:您是基于对新公司录用通知(Offer)的合理信赖，才从原国企辞职的。
关键依据
(一)法律分析及司法实践参考
1.法律定性:新公司向您发出的录用通知(Offer)在法律上通常被视为希望与您订立劳动合同的“要约”《中华人民共和国民法典》第四百七十二条。您接受该要约后，双方虽未正式签订劳动合同，但已进入订立合同的磋商阶段。新公司无正当理由单方取消录用，属于“有其他违背诚信原则的行为”《中华人民共和国民法典》第五百条，应承担缔约过失责任。
2.赔偿依据:根据法律规定，因违背诚信原则造成对方损失的，应当赔偿 《中华人民共和国民法典》第五百条。您的损失主要包括:因信赖该Offer而从原单位辞职所导致的失业期间工资收入损失。赔偿数额应相当于因违约所造成的损失 《中华人民共和国民法典》第五百八十四条，司法实践中通常酌情支持1-3个月的工资标准(1(3
3.司法实践:参考类似案例，法院普遍支持劳动者的索赔请求。例如，有案例中公司以“岗位调整”为由撤销Offer，被判赔偿劳动者一个月工资及寻找新工作的合理费用(1);另一案例中，公司因自身过错取消录用，法院酌定赔偿劳动者21000元(3)
          </p>
        </div>
      </div> -->
      
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
  // overflow-y:auto;
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
          font-size: 16px;
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
    // .user-msg{
    //   width: 100%;
    //   h3{
    //     font-size: 20px;
    //     color: #333;
    //   }
    // }
    // .nav{
    //   margin-top: 20px;
    //   width: 100%;
    //   display: flex;
    //   justify-content: space-between;
    //   align-items: center;
    //   gap: 20px;
    //   .lf-items{
    //     display: flex;
    //     justify-content: start;
    //     align-items: center;
    //     gap: 10px;
    //     .lf-item1{
    //       width: 70px;
    //       height: 20px;
    //       background-color: rgb(228, 113, 11);
    //       border-radius: 2px;
    //       font-size:14px;
    //       color: #fff;
    //       text-align: center;
    //       line-height: 20px;
    //     }
    //     .lf-item2{
    //       display: flex;
    //       justify-content: start;
    //       align-items: center;
    //       gap:5px;
    //       font-size: 14px;
    //       color: #666;
    //       .icon{
    //         width: 14px;
    //         height: 14px;
    //         background-color: #39b52e;
    //         color:#fff;
    //         line-height: 10px;
    //         border-radius: 50%;
    //       }
    //     }
    //     .lf-item3{
    //       font-size: 14px;
    //       color: #666;
    //     }
    //   }
    //   .rf-item{
    //     display: flex;
    //     justify-content: start;
    //     align-items: center;
    //     gap: 5px;
    //     .icon{
    //       width: 14px;
    //       height: 14px;
    //       font-size: 14px;
    //       color: #a5a3a3;
    //     }
    //     p{
    //       font-size: 14px;
    //       color: #000;
    //       font-weight: 500;
    //     }
    //   }
    // }
    // .output{
    //   margin-top: 20px;
    //   width: 100%;
    //   height: 40px;
    //   display: flex;
    //   justify-content: start;
    //   align-items: center;
    //   gap: 10px;
    //   border: 1px solid #bfbdbd;
    //   border-radius: 5px;
    //   padding: 0 10px;
    //   .icon{

    //     width: 14px;
    //     height: 14px;
    //     font-size: 14px;
    //     color: #000;
    //     text-align: center;
    //     line-height: 14px;
    //   }
    //   .output-text{
    //     width: 60px;
    //     height: 20px;
    //     font-size: 14px;
    //     color: #000;
    //     font-weight: 500;
    //   }
    //   .output-desc{
    //     font-size: 14px;
    //     color: #666;
    //     p{
    //       display: inline-block;
    //       color:orange;
    //     };
    //   }
    // }
    // .think-dec{
    //   width: 100%;
    //   .dec{
    //     display: flex;
    //     flex-direction: row;
    //     justify-content: start;
    //     align-items: center;
    //     gap:5px;
    //     margin-top: 20px;
    //     padding:0 5px;
    //     width: 220px;
    //     height: 35px;
    //     background-color: rgba(235, 235, 235, 0.6);
    //     border-radius: 5px;
    //     transition: background-color 0.2s;
    //     &:hover {
    //       background-color: rgba(235, 235, 235, 0.8);
    //     }
    //     .word{
    //       font-size: 14px;
    //       color: #151515;
    //       font-weight: 500;
    //     }
    //     .icons{
    //       cursor: pointer;
    //       transition: all cubic-bezier(0.55, 0.055, 0.675, 0.19);
    //       .section-icon{
    //         width: 14px;
    //         height: 14px;
    //         font-size: 14px;
    //         color: #000;
    //         text-align: center;
    //         line-height: 14px;
    //       }
    //     }
    //   }
    // }
    // .reply{
    //   .reply-content{
    //     margin-top: 30px;
    //     width: 100%;
    //     font-size: 16px;
    //     // background-color: skyblue;
    //   }
    // }
  }
}
</style>
