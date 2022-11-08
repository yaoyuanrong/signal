const Koa = require('koa');
const app = new Koa()
const Router = require('koa-router')
const BodyParser = require('koa-bodyparser');
const axios = require('axios')
const router = new Router()

app.use(BodyParser());
router.get('/', (ctx, next) => {
  ctx.body = 'hello world'
})
router.post('/openfeishu', async (ctx, next) => {
  console.log(ctx.request.body)
  const res=await axios.post("https://open.feishu.cn/open-apis/bot/v2/hook/5f9928f3-1d3c-4dba-8bf6-a3d2dbc809d5", 
    {"msg_type":"text","content":{"text":"request example"}}
  )
  ctx.body = 'openfeishu'
})

app.use(router.routes())