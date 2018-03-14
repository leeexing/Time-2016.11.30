const Koa = require('koa')
const app = new Koa()
// koa 依赖模块
const Router = require('koa-router')
const router = Router()
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

// koa app 中间件
app.use(server(__dirname + '/static'))
app.use(bodyParser())

// 跨域设置
app.use(async (ctx, next) => {
  ctx.set({
    "Access-Control-Allow-Origin": "http://localhost:8002", // 设置可以访问的域名端口
    // 'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
    // "Access-Control-Allow-Headers": "X-Requested-With",
    // 'Access-Control-Allow-Headers': 'Content-Type'
  })
  await next() // 必须要有“ await ”
})
// 统一返回数据的格式
let result_data = {
  success: true,
  msg: 'ok',
  data: null
}
/************************ 路由 *********************************/

// 首页
const index = async ctx => {
  ctx.body = fs.readFileSync(__dirname + '/index_koa.html', 'utf-8')
}
// 获取一张图像
const get_img = async ctx => {
  console.log(ctx.params)
  let {id} = ctx.params
  if (!id) {
    ctx.body = result_data
    return
  }
  let data = await db.get('formData').findOne({imgMD5: id})
  if (!data) {
    data = await db.get('formData').findOne({})
  }
  result_data.data = data
  ctx.body = result_data
}
// 获取所有图像
const get_imgs = async ctx => {
  let data = await db.get('formData').find({})
  result_data.data = data
  ctx.body = result_data
}
// 上传
const upload = async ctx => {
  console.log(ctx)
  result_data.data = 'upload'
  ctx.body = result_data
}

router.get('/', index)
router.get('/api/image/:id', get_img)
router.get('/api/images', get_imgs)
router.post('/api/upload', upload)

app.use(router.routes())

/******************** 启动 ********************************/

app.listen(8002, () => {
  console.log('koa server listen 8002 ...')
})