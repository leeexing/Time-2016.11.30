let btn = document.querySelector('.upload')
let getImg = document.querySelector('.getimg')
let getImgs = document.querySelector('.getimgs')
let deleteImg = document.querySelector('.delete')
let file = document.querySelector('#file')
let imgWrap = document.querySelector('.img-wrap')
let imgElem = document.querySelector('.img-wrap img')

btn.onclick = () => {
  file.click()
}

file.onchange = e => {
  console.info(e.target.files)
  let files = Array.from(e.target.files)
  query('http://localhost:8002/api/upload', 'post', files[0])
    .then(data => {
      console.log(data)
    })
  // upload(files)
}

getImg.onclick = e => {
  // query('http://127.0.0.1:8002/api/image/33490c115c448295a842bc170b5dbc38').then(data => {
  query('http://127.0.0.1:8002/api/image/0').then(data => {
    console.log(data)
  })
}

getImgs.onclick = () => {
  query('http://127.0.0.1:8002/api/images').then(data => {
    console.log(data)
  })
}

deleteImg.onclick = () => {
  delete_img()
}

function delete_img() {
  let xhr = new XMLHttpRequest()
  // xhr.open('delete', '/clearimg', true)
  xhr.open('get', '/test/upload', true)
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