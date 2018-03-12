const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const multerObj = multer({dest: '/uploads/'}) // 定义图片上传的`临时`目录
// const static = require('static-files')

app.use(express.static(__dirname + '/static'))
app.use(multerObj.any())

app.all('/upload', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

app.get('/', (req, res, next) => {
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/imglist', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  let files = fs.readdirSync(path.join(__dirname, '/static/images'))
  files = files.map(file => ('http://localhost:8001/images/' + file))
  res.json({success: true, msg: 'OK', data: files})
})

app.get('/getimg', (req, res, next) => {
  res.setHeader('Content-Type', 'image/png')
  console.log(req.query)
  let files = fs.readdirSync(path.join(__dirname, '/static/images'))
  console.log(files)
  if (files.length === 0) {
    res.send('')
  }
  files.forEach((item, index) => {
    let img = fs.readFileSync(__dirname + '/static/images/' + item)
    // console.log(img)
    let content = new Buffer(img)
    index === 0 && res.send(img)
  })
  // fs.readFileSync('')
  // res.sendFile(path.join(__dirname, 'index.html'))
})

app.delete('/clearimg', (req, res, next) => {
  let files = fs.readdirSync(__dirname + '/static/images')
  if (files.length !== 0) {
    files.forEach(item => {
      fs.unlink(__dirname + '/static/images/' + item, e => {
        console.log(e)
      })
    })
  }
})

app.post('/upload', (req, res, next) => {
  console.log(req.files)
  // 图片会放在 uploads 目录并你切没有后缀，需要自己转存，用到 fs 模块
  // 对临时文件转存， fs.rename(oldPath, newPath, callback)
  req.files.forEach(file => {
    fs.exists(`static/images/${file.originalname}`, exists => {
      if (!exists) {
        fs.rename(file.path, `static/images/${file.originalname}`, err => {
          if (err) {
            throw Error(err)
          } else {
            console.log(`### ${file.originalname} has uploaded ! ###`)
          }
        })
      }
    })
  })
  // res.writeHead({
  //   'Access-Control-Allow-Origin': '*' // 允许跨域
  // })
  res.send({
    success: true,
    message: 'OK'
  })
})

app.listen(8001, () => {
  console.log('express server listen 8001')
})