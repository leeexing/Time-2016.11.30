const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const multerObj = multer({dest: 'uploads/'})
// const static = require('static-files')

app.use(express.static(__dirname + '/static'))
app.use(multerObj.any())

app.get('/', (req, res, next) => {
  res.setHeader('Content-Type', 'text/html')
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/imglist', (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  let files = fs.readdirSync(path.join(__dirname, '/uploads'))
  files = files.map(file => (__dirname + '/uploads/' + file))
  res.send({success: true, msg: 'OK', data: files})
})

app.get('/getimg', (req, res, next) => {
  res.setHeader('Content-Type', 'image/png')
  console.log(req.query)
  let files = fs.readdirSync(path.join(__dirname, '/uploads'))
  console.log(files)
  if (files.length === 0) {
    res.send('')
  }
  files.forEach((item, index) => {
    let img = fs.readFileSync(__dirname + '/uploads/' + item)
    // console.log(img)
    let content = new Buffer(img)
    index === 0 && res.send(img)
  })
  // fs.readFileSync('')
  // res.sendFile(path.join(__dirname, 'index.html'))
})

app.delete('/clearimg', (req, res, next) => {
  let files = fs.readdirSync(__dirname + '/uploads')
  if (files.length !== 0) {
    files.forEach(item => {
      fs.unlink(__dirname + '/uploads/' + item, e => {
        console.log(e)
      })
    })
  }
})

app.post('/upload', (req, res, next) => {
  console.log(req.files)
  res.send({
    success: true,
    message: 'OK'
  })
})

app.listen(8001, () => {
  console.log('server listen 8001')
})