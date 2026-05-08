const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/vue-LLMChat', {
  // useCreateIndex: true,
  // useNewUrlParser: true
})
// 用户信息
const UserSchema = new mongoose.Schema({
  username: { type: String, default: 'user', unique: true },
  password: {
    type: String,
    set(val) {
      return require('bcrypt').hashSync(val, 10)
    }
  },
  avater: { type: String, dafault: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" }
})

// 用户的会话记录
const SessionSchema = new mongoose.Schema({
  userId: { type: String, require: true, index: true },
  sessionId: { type: String, require: true }

}, {
  timestamps: true
})
// 用户 - AI 对话
const ChatSchema = new mongoose.Schema({
  sessionId: { type: String, index: true },
  title: { type: String, default: '新对话' },
  list: [{
    role: { type: String },
    content: { type: String }
  }]
}, {
  timestamps: true
})
const Users = mongoose.model('User', UserSchema)
const Sessions = mongoose.model('Session', SessionSchema)
const Chats = mongoose.model('Chat', ChatSchema)
module.exports = { Users, Sessions, Chats }