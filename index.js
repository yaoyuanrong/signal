// const WebSocket = require('ws');
// const wss = new WebSocket.Server({ port: 8010 })
// const code2ws = new Map()
const Koa = require('koa');
const app = new Koa()
const Router = require('koa-router')
const BodyParser = require('koa-bodyparser');
// wss.on('connection', function connection(ws, request) {
//   console.log('成功')
//   // ws => 端
//   let code = Math.floor(Math.random() * (999999 - 10000)) + 100000
//   code2ws.set(code, ws)

//   ws.sendData = (event, data) => {
//     ws.send(JSON.stringify({ event, data }))
//   }
//   ws.sendError = msg => {
//     ws.sendData('error', {msg})
//   }
//   ws.on('message',function incoming (message) {
//     let parseMessage = {}
//     try {
//       parseMessage = JSON.parse(message)
//     } catch(e) {
//       ws.sendError('message Invalid')
//       return
//     }
//     let { event, data } = parseMessage
//     console.log(event)
//     if (event === 'login') {
//       ws.sendData('logined', {code})
//     } else if (event === 'control') {
//       let remote = +data.remote
//       if(code2ws.has(remote)) {
//         ws.sendData('controlled', {remote})
//         let remoteWS = code2ws.get(remote)
//         ws.sendRemote = remoteWS.sendData
//         remoteWS.sendRemote = ws.sendData
//         ws.sendRemote('be-controlled', { remote: code })
//       }
//     } else if(event === 'forward') {
//       // data = { event, data }
//       console.log('forward', data.event)
//       ws.sendRemote(data.event, data.data)
//     }
//   })

//   ws.on('close', () => {
//     code2ws.delete(code)
//     clearTimeout(ws.clearTimeout)
//   })
//   // ws.closeTimeout = setTimeout(() => {
//   //   ws.terminate()
//   // },10 * 10 * 1000)
// })
const axios = require('axios')
const router = new Router()

app.use(BodyParser());
router.get('/', (ctx, next) => {
  ctx.body = 'hello world'
})
router.post('/openfeishu', async (ctx, next) => {
  console.log('openfeishu',ctx, ctx.request)
  const res=await axios.post("https://open.feishu.cn/open-apis/bot/v2/hook/4a04d9b7-6ec8-4f16-a5dd-4e0e533f025d", 
    {"msg_type":"text","content":{"text":"request example"}}
  )
  ctx.body = 'openfeishu'
})
app.listen(4000,() => {
  console.log('aa')
})
app.use(router.routes())