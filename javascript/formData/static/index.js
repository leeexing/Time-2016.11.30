let btn = document.querySelector('.upload')
let getImg = document.querySelector('.getimg')
let getdata = document.querySelector('.getdata')
let deleteImg = document.querySelector('.delete')
let file = document.querySelector('#file')
let imgWrap = document.querySelector('.img-wrap')
let imgElem = document.querySelector('.img-wrap img')

document.querySelector('.cors').onclick = e => {
  // query('http://127.0.0.1:5000/api/users').then(data => {
  //   console.log(data)
  // })
  let xhr = new XMLHttpRequest()
  xhr.open('get', 'http://127.0.0.1:5000/api/users', true)
  xhr.onload = function() {
    if (this.status === 200) {
      console.log(this.response)
    }
  }
  xhr.onerror = function(err) {
    console.log(err)
  }
  xhr.send()
}

btn.onclick = () => {
  file.click()
}

file.onchange = e => {
  console.info(e.target.files)
  let files = Array.from(e.target.files)
  upload(files)
  // if (files.length > 1) {
  // } else {
  //   upload(files[0])
  // }
}

getImg.onclick = () => {
  getImage()
}

getdata.onclick = () => {
  getImgList()
}

function getImgList() {
  let xhr = new XMLHttpRequest()
  xhr.open('get', '/imglist', true)
  xhr.responseType = 'json'
  xhr.onload = function() {
    if (this.status == 200) {
      console.log(this.response)
      // console.log(JSON.parse(this.response))
      let oFrag = document.createDocumentFragment()
      this.response.data.forEach(item => {
        let img = new Image()
        img.src = item
        oFrag.appendChild(img)
      })
      imgWrap.appendChild(oFrag)
    }
  }
  xhr.send()
}

deleteImg.onclick = () => {
  delete_img()
}

function getImage() {
  let reader = new FileReader()
  let xhr = new XMLHttpRequest()
  xhr.open('GET', '/getimg?name=leeing', true)
  xhr.responseType = 'blob'
  xhr.onload = function() {
    if (this.status === 200) {
      console.log(this.response)
      if (this.response.size !== 0) {
        reader.readAsDataURL(this.response)
      }
    }
  }
  xhr.send({name: 'leeing'})
  reader.onload = function() {
    // console.log(this)
    imgElem.src = this.result
  }
}

function delete_img() {
  let xhr = new XMLHttpRequest()
  xhr.open('delete', '/clearimg', true)
  xhr.onload = function() {
    if (this.status == 200) {
      console.log(this.response)
    }
  }
  xhr.send()
}


function upload(files) {
  console.log(files)
  let formData = new FormData()
  let xhr = new XMLHttpRequest()
  Array.from(files).forEach(file => {
    formData.append('fileName', file)
  })
  // formData.set('fileName', files)
  xhr.open('POST', '/upload', true)
  xhr.onreadystatechange =function() {
    if (xhr.readyState == 4 && xhr.status === 200) {
      console.log(this.response)
    }
  }
  xhr.onerror = e => {
    console.error(e)
  }
  xhr.send(formData)
}


// 数据库获取图像地址
let db_get_img = document.querySelector('.db_get_img')
db_get_img.onclick = e => {
  query('/api/images').then(data => {
    console.log(data)
  })
}

// 清空数据库
let db_clean = document.querySelector('.db_clean')
db_clean.onclick = e => {
  query('/api/cleanimg', 'delete').then(data => {
    console.log(data)
  })
}

function query(url, type='get', data=null) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open(type, url, true)
    xhr.onload = function(){
      if (this.status === 200) {
        resolve(JSON.parse(this.response))
      }
    }
    xhr.onerror = err => {
      reject(err)
    }
    xhr.send(data)
  })
}