<script setup lang="ts">
import { ref } from 'vue';
import { VueMarkdown } from "@crazydos/vue-markdown"
import remarkGfm from "remark-gfm"
import hidhlightPlugins from "rehype-highlight"
const mdstr = "## 标题\n 内容"
const mdstrLi = "- 任务1\n+ 任务2"
const mdstrLi2 = "1. 任务1\n2. 任务2"
const mdstrTask = "- [X] 任务1\n- [ ] 任务2"
const mdstrFont1 = "*字体*"
const linkStr = "[百度](https://baidu.com 'AAA')";
const linkPic = "![风景](https://img2.baidu.com/it/u=2376489989,3127732063&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=657 '风景照')";
const mdTable = "| 城市 | 温度 | 天气 |\n| :--- | :---: | ---: |\n| 北京 | 25°C | 晴 |\n| 上海 | 28°C | 多云 |\n| 广州 | 32°C | 小雨 |";
const codeStr = '以下是具体代码\n ```javascript\nconst a=1;\nconsole.log(a)\n```'
</script>

<template>
  <div>

    <VueMarkdown :custom-attrs="{
      a: { class: 'mardown-a' }
    }" :remark-plugins="[remarkGfm]" :rehype-plugins="[hidhlightPlugins]" :markdown="mdstrTask">
      <template #input="{ ...props }">
        <span v-if="props.type === 'checkbox' && props.checked">
          ✅
        </span>
        <span v-if="props.type === 'checkbox' && !props.checked">
          [ ]
        </span>
      </template>
      <template #li="{ children, ...props }">
        <div class="my-li">
          <Component :is="children"></Component>
        </div>
      </template>
    </VueMarkdown>
  </div>
</template>

<style scoped></style>
