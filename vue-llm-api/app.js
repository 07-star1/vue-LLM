const { Users, Sessions, Chats } = require('./db')
require('dotenv').config();
const express = require('express')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const OpenAI = require('openai')
const fs = require('fs')
const { summaryMessage, summaryTitle } = require('./util.js')
const openai = new OpenAI(
  {
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  }
);
// 同步读取
const systemContext = fs.readFileSync('./context.md', 'utf-8')
const app = express()
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // 指定允许的域名
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE,OPTIONS'); // 允许的HTTP方法
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // 允许的请求头
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允许携带Cookie
  next();
});
// 解析 JSON 格式的请求体
app.use(express.json())
const port = 9000
const SECRET = 'asdfghjkl'
// 用户相关
// 用户列表
app.get('/api/user', async (req, res) => {
  try {
    const users = await Users.find()
    res.send(users)
  } catch (error) {
    console.log("error: ", error)
  }

})
// 用户注册
app.post('/api/user/register', async (req, res) => {
  try {
    // console.log(req.body)  // { username: 'admin', password: '123456' }
    const result = await Users.findOne({
      username: req.body.username
    })
    if (result) {
      return res.status(409).send({
        "code": "409",
        "state": "error",
        "message": "该用户名已存在，请重新设置"
      })
    }
    const user = await Users.create({
      username: req.body.username,
      password: req.body.password,
      avater: req.body.avater ? req.body.avater : "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
    })
    const data = {
      "code": "200",
      "state": "success",
      "message": "注册成功"
    }
    res.setHeader('content-type', 'application/json')
    res.send(JSON.stringify(data))
  } catch (error) {
    console.log("error: ", error)
  }

})
// 用户登录
app.post('/api/user/login', async (req, res) => {
  try {
    // 用户是否存在
    const user = await Users.findOne({
      username: req.body.username
    }).lean()
    // console.log(user)

    if (!user) {
      return res.status(422).send({
        "code": "422",
        "state": "error",
        "message": "用户名不存在"
      });
    }
    // 验证密码
    const isPasswordValid = require('bcrypt').compareSync(req.body.password, user.password)
    if (!isPasswordValid) {
      return res.status(422).send({
        "code": "422",
        "state": "error",
        "message": "密码错误，请重新输入！"
      });
    }
    // 生成 token
    const token = jwt.sign(String(user.username), SECRET)
    const data = {
      "code": "200",
      "state": "success",
      "message": "登录成功",
      "user": {
        _id: user._id,
        username: user.username,
        avater: user.avater,
        _v: user._v
      },
      token
    }
    res.setHeader('content-type', 'application/json')
    res.send(JSON.stringify(data))
  } catch (error) {
    console.log("error: ", error)
  }


})
// 获取用户个人信息
app.post('/api/user/profile', async (req, res) => {
  try {
    console.log("req ", req.body)  // { token }
    const raw = req.body.token
    console.log("raw: ", raw);
    const username = jwt.verify(raw, SECRET)
    console.log(username);

    const user = await Users.findOne({ username })
    res.setHeader('content-type', 'application/json')
    res.send(JSON.stringify(user))
  } catch (error) {
    console.log("error: ", error)
  }
})
// 创建新对话
app.post('/api/create', async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) {
      return res.status(400).json({
        code: 400,
        message: 'userId 不能为空'
      })
    }
    const sessionId = userId + Date.now()
    const session = await Sessions.create({
      userId,
      sessionId
    })
    const title = '新对话'
    const list = []
    await Chats.create({
      sessionId,
      userId,
      title,
      list
    })
    res.status(200).json({
      code: 200,
      message: "success",
      data: session
    })
  } catch (error) {
    console.log('创建对话失败', error);

    res.status(500).json({
      code: 500,
      error: '创建对话失败'
    })
  }
})
// 调用LLM模型
app.post('/api/llm', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream;charset=utf-8',
    'Cache-Control': 'no-cache',
    'connection': 'keep-alive'
  })
  const { keyword, userId, sessionId } = req.body
  const chatList = await Chats.findOne({ sessionId }).sort({ createdAt: 1 })
    .select('list')
  if (!chatList) {
    return res.status(404).json({
      code: 404,
      message: '对话不存在或无权限访问'
    })
  }

  let MsgList = chatList.list || []
  const queryObj = {
    role: "user",
    content: keyword
  }
  MsgList.push(queryObj)
  await Chats.updateOne(
    { sessionId },
    { list: queryObj },
    { updatedAt: Date.now() }
  )
  if (MsgList.length > 20) {
    const removeNum = MsgList.length - 9
    const removeList = MsgList.splice(1, removeNum)
    const summaryRes = await summaryMessage(openai, removeList)
    MsgList.splice(1, 0, summaryRes)
  }
  // 调用LLM模型
  const llmres = await openai.chat.completions.create({
    model: "qwen-plus",
    messages: [
      { role: "system", content: systemContext },
      ...MsgList
    ],
    stream: true,
  });
  // 读流
  // let chunkList = []
  let chunkObj = {
    role: "assistant",
    id: "",
    content: ""
  }
  for await (let chunk of llmres) {
    const delta = chunk.choices[0].delta
    chunkObj.content += delta.content
    chunkObj.id = chunk.id
    res.write(`data: ${JSON.stringify(chunkObj)}\n\n`)
  }
  MsgList.push(chunkObj)
  await Chats.updateOne(
    { sessionId },
    { list: MsgList },
    { updatedAt: Date.now() }
  )
  const data = {
    code: 200,
    message: "success",
    data: { done: true }
  }
  res.write(JSON.stringify(data))
})
// 获取用户历史对话列表
app.post('/api/history/list', async (req, res) => {
  try {
    const { userId } = req.body
    const sessionObj = await Sessions.find({ userId }).sort({ updatedAt: -1 })
      .select('sessionId')
    const historyList = []
    for (const item of sessionObj) {
      const chat = await Chats.findOne({ sessionId: item.sessionId })
      if (chat.title && chat.title !== '新对话') {
        historyList.push({
          sessionId: item.sessionId,
          title: chat.title
        })
      } else {
        if (chat.list.length === 0) {
          historyList.push({
            title: "新对话",
            sessionId: item.sessionId
          })
        } else {
          const title = await summaryTitle(openai, chat.list)
          await Chats.updateOne(
            { sessionId: item.sessionId },
            { title },
            { updatedAt: Date.now() }
          )
          historyList.push({
            sessionId: item.sessionId,
            title: title
          })
        }

      }
    }
    const data = {
      code: 200,
      message: "获取成功",
      data: historyList
    }
    // if (!result) {
    //   res.send(JSON.stringify({ data }))
    //   return
    // }
    res.send(JSON.stringify(data))
  } catch (error) {
    console.log("获取对话历史记录失败: ", error)
    res.status(500).json({
      code: 500,
      error: '获取对话历史记录失败'
    })
  }

})

// 获取用户某个会话消息
app.get('/api/chat/list', async (req, res) => {
  try {
    const { sessionId } = req.query
    console.log(sessionId);
    const result = await Chats.findOne({ sessionId }).sort({ updatedAt: -1 })
      .select('title list')
    console.log("点击某次对话，获取对话记录", result);
    const data = {
      code: 200,
      message: "获取成功",
      data: result
    }
    // if (!result) {
    //   res.send(JSON.stringify({ data }))
    //   return
    // }
    res.send(JSON.stringify(data))
  } catch (error) {
    console.log("获取对话历史记录失败: ", error)
    res.status(500).json({
      code: 500,
      error: '获取对话历史记录失败'
    })
  }

})
// 删除用户所有历史列表
app.post('/api/del/all', async (req, res) => {
  try {
    const { userId } = req.body
    console.log(userId);

    if (!userId) {
      return res.status(400).json({
        code: 400,
        message: 'userId 不能为空'
      })
    }

    // 验证对话是否属于该用户
    const sessionObj = await Sessions.find({ userId }).select('sessionId')
    if (!sessionObj.length) {
      return res.status(404).json({
        code: 404,
        message: '对话不存在或无权限访问'
      })
    }

    // 删除对话
    const data = await Sessions.deleteMany({ sessionId: { $in: sessionObj.map(item => item.sessionId) } })

    // 级联删除该对话下的所有消息
    await Chats.deleteMany({ sessionId: { $in: sessionObj.map(item => item.sessionId) }, userId })

    // 检查是否真的删除了文档
    if (data.deletedCount === 0) {
      return res.status(404).send(JSON.stringify({
        code: "404",
        message: "未找到要删除的会话"
      }));
    }
    // 成功响应
    res.status(200).send(JSON.stringify({
      code: "200",
      message: "删除成功",
      data: data
    }))

  } catch (error) {
    console.log("error: ", error);
    res.status(500).send(JSON.stringify({
      code: "500",
      message: "删除失败",
      error: error.message
    }));
  }
});
// 删除用户单个会话消息列表
app.post('/api/del/one', async (req, res) => {
  try {
    const { sessionId } = req.body
    await Sessions.deleteOne({ sessionId })
    const result = await Chats.deleteOne({ sessionId })
    console.log(result);

    if (!result) {
      return res.status(404).send(JSON.stringify({
        code: 404,
        message: "未找到要删除的消息",
      }))
    }
    res.status(200).send(JSON.stringify({
      code: 200,
      message: "删除成功",
      data: result
    }))
  } catch (error) {
    console.log("error: ", error)
  }
})
app.listen(port, () => {
  console.log('server success')
})