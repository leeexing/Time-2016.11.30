/**
 * koa 路由集成
 */
const Router = require('koa-router')
const test = new Router()

const upload = async ctx => {
  console.log(ctx.body)
  ctx.body = 'upload'
}

test.use('/upload', upload)

// const name = 'leeing'

module.exports = test