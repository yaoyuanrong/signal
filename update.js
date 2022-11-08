const Koa = require('koa')
const app = new Koa()
const Router = require('koa-router')
const serve = require('koa-static-server')

const router = new Router()
const compareVersions = require('compare-versions')
function getNewVersion(version) {
  if(!version) return null
  let maxVersion = {
    name: '1.0.1',
    pub_date: '2022-09-29T17:07:01+1:10',
    notes:'新增功能',
    url: `http://192.168.152.7:33855/public/Connection-1.0.1-mac.zip`
  }
  if(compareVersions.compare(maxVersion.name, version, '>')) {
    return maxVersion
  }
  return null
}
router.get('/win32/RELEASES', (ctx, next) => {
  let newVersion = getNewVersion(ctx.query.version)
  if(newVersion) {
      ctx.body='BBC6F98A5CD32C675AAB6737A5F67176248B900C Mercurius-1.0.1-full.nupkg 62177782'
  } else {
      ctx.status = 204
  }
})
router.get('/win32/*.nupkg', (ctx, next) => {
  // redirect s3 静态文件服务
  ctx.redirect(`/public/${ctx.params[0]}.nupkg`)
})
router.get('/darwin', (ctx, next) => {
  // 处理mac更新 ？verson=1.0&uid=123
  console.log(ctx.query)
  let {version} = ctx.query
  let newVersion = getNewVersion(version)
  console.log(newVersion)
  if(newVersion) {
    ctx.body = newVersion
  } else {
    ctx.status = 204
  }
})
app.use(serve({rootDir: 'public', rootPath: '/public'}))
app.use(router.routes())
   .use(router.allowedMethods())

app.listen(33855)