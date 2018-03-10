const Koa = require('koa')
const app = new Koa()
const path = require('path')
const multer = require('koa-multer')
const multerObj = multer({dest: 'uploads/'})

app.use(multerObj.any())

app.get('/', (req, res, next) => {
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(8001, () => {
  console.log('server listen 8001')
})