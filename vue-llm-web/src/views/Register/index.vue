<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  username: '',
  password: ''
})
const rules = ref({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 8, message: '密码长度必须在 6 到 8 个字符之间', trigger: 'blur' }
  ]
})
const formRef = ref()

</script>

<template>
  <div class="container">
    <div class="form">
      <h3>用户登录</h3>
      <el-form ref="formRef" :model="form" :rules="rules" status-icon>
        <el-form-item label="用户名" prop="username">
          <el-input  placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密&nbsp;&nbsp;&nbsp;码" prop="password">
          <el-input  placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  .form {
    width: 400px;
    padding: 20px;
    background: #59CDE9;  /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #ffffff, #1451b4);  /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #fff, #1451b4); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    color: #fff;
    h3 {
      text-align: center;
      margin-bottom: 20px;
      font-size: 24px;
    }
    .el-form-item {
      margin-bottom: 24px;
    }
    .el-button {
      width: 100%;
    }
  }
}

</style>
