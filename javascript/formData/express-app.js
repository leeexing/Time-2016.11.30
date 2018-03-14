const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const multerObj = multer({dest: 'uploads/'}) // 定义图片上传的`临时`目录
const static = require('static-files')
const crypto = require('crypto')
const bodyParser = require('body-parser')

function cryptImg(imgObj) {
  let md5 = crypto.createHash('md5')
  return md5.update(imgObj).digest('hex')
}
// 数据库连接
const monk = require('monk')
const monkUrl = 'localhost:27017/myblog'
const db = monk(monkUrl)

app.use(express.static(__dirname + '/static'))
app.use(multerObj.any())
app.use(bodyParser.json())

app.all('/upload', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})

////////////////// ##路由## /////////////////////////////////
// 首页
app.get('/', (req, res, next) => {
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(path.join(__dirname, 'index.html'))
})
// 获取所有图片
app.get('/imglist', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  let files = fs.readdirSync(path.join(__dirname, '/static/images'))
  files = files.map(file => ('http://localhost:8001/images/' + file))
  res.json({success: true, msg: 'OK', data: files})
})
// 获取议长图片
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
// 清楚数据
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
// 图片上传
app.post('/upload', (req, res, next) => {
  console.log(req.files)
  // 图片会放在 uploads 目录并且没有后缀，需要自己转存，用到 fs 模块
  // 对临时文件转存， fs.rename(oldPath, newPath, callback)
  let img_md5_arr = []
  req.files.forEach(file => {
    let img = fs.readFileSync(__dirname + '/' + file.path)
    let imgMD5 = cryptImg(img)
    if (img_md5_arr.includes(imgMD5)) {
      fs.unlinkSync(__dirname + '/' + file.path)
      return
    }
    img_md5_arr.push(imgMD5)
    console.log(imgMD5)
    db.get('formData').find({'imgMD5': imgMD5}).then(data => {
      console.log(data)
      if (!data.length) {
        let insertObj = {
          originalname: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          url: `/images/${file.filename}.png`,
          type: 'avatar',
          imgMD5
        }
        db.get('formData').insert(insertObj)
        fs.rename(file.path, `static/images/${file.filename}.png`, err => {
          if (err) {
            throw Error(err)
          } else {
            console.log(`### ${file.originalname} has uploaded ! ###`)
          }
        })
      } else {
        fs.unlinkSync(__dirname + '/' + file.path)
        console.log(`===== ${file.originalname} 已经上传过了 ！！=====`)
      }
    })
  })
  res.send({
    success: true,
    message: 'OK'
  })
})

app.get('/api/images', (req, res, next) => {
  db.get('formData').find({}).then(data => {
    res.json({data})
  })
})

app.delete('/api/cleanimg', (req, res) => {
  db.get('formData').remove({}).then(data => {
    // console.log(data)
    res.send({success: true, msg: '数据删除成功'})
  })
})

app.listen(8001, () => {
  console.log('express server listen 8001')
})