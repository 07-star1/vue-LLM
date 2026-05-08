async function summaryMessage(openai, summaryMessage) {
  const llmres = await openai.chat.completions.create({
    model: "qwen-plus",
    messages: [
      { role: "system", content: "帮我总结下面的对话记录，做一个摘要" },
      ...summaryMessage
    ]
  });
  return llmres.choices[0].message.content
}
// 生成标题
async function summaryTitle(openai, list) {
  const llmres = await openai.chat.completions.create({
    model: "qwen-plus",
    messages: [
      { role: "system", content: "帮我总结下面的对话记录，生成一个小于16个字的标题" },
      ...list
    ]
  });
  return llmres.choices[0].message.content
}
module.exports = {
  summaryMessage,
  summaryTitle
}