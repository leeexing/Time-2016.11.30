const Koa = require('koa')
const app = new Koa()
// koa 依赖模块
const Router = require('koa-router')
// const router = Router()
const router = require('koa-better-router')().loadMethods()
const server = require('koa-static')
const body = require('koa-better-body')
const bodyParser = require('koa-bodyparser')
const multer = require('koa-multer')
const uploadMulter = multer({ dest: 'uploads/' })
// node 原生模块
const path = require('path')
const fs = require('fs')
// 数据库
const monk = require('monk')
const monkUrl = 'localhost:27017/myblog'
const db = monk(monkUrl)

app.use(server(__dirname + '/static'))
app.use(bodyParser())

/*
* 路由
*/
// 首页
const index = async ctx => {
  ctx.body = fs.readFileSync(__dirname + '/index_koa.html', 'utf-8')
}
// 获取图像
const getimg = async ctx => {
  console.log(ctx.params)
  db.get('users').find({}, {limit: 5}).then(data => {
    console.log(data)
  })
  ctx.body = 'get image ~'
}
// 上传
const upload = async ctx => {
  console.log(ctx.req.body)
  ctx.body = 'upload!'
}

router.get('/', index)
router.get('/getimg', getimg)
router.post('/upload', body(), upload)
app.use(router.routes())

app.listen(8002, () => {
  console.log('koa server listen 8002 ...')
})