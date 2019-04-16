/**
 * 抖图：图像tip位置标记
 * author： leeing
 * time： 2018-12-19 08:59
 */
class DrBluePrint {
  constructor (options) {
    let defaultOpts = {
      mode: 'image', // or canvas
      cacheMemory: true,
      cacheCount: 100,
      containerClass: '',
      strokeColor: '#f00'
    }
    this.options = Object.assign(defaultOpts, options)
    this.container = document.querySelector(this.options.containerClass)
    this.imageUrls = []
    this.imageDatas = []
    this.width = this.container.offsetWidth
    this.height = this.container.offsetHeight
    this.index = 0
    // this.init()
    this.initTest()
  }
  // -使用canvas
  init () {
    this.doutuCanvas = document.createElement('canvas')
    this.doutuCanvas.id = 'doutu'
    this.doutuCanvas.width = this.height
    this.doutuCanvas.height = this.width
    this.container.appendChild(this.doutuCanvas)
    this.doutuCtx = this.doutuCanvas.getContext('2d')
    this.doutuCtx.strokeStyle = this.options.strokeColor
  }
  initTest () {
    this.testCanvas = document.getElementById('doutu-ret')
    this.testCanvas.width = this.width
    this.testCanvas.height = this.height
    this.testCtx = this.testCanvas.getContext('2d')
  }
  // -使用div
  initMark () {
    this.tipMark = document.createElement('div')
    this.tipMark.style.width = this.width
    this.tipMark.style.height = this.height
  }
  drawTipDivRect (rectInfo) {
    let div = document.createElement('div')
    div.style.width = rectInfo.pos[2] - rectInfo.pos[0]
    div.style.height = rectInfo.pos[3] - rectInfo.pos[1]
    div.style.position = 'absolute'
    div.style.left = rectInfo.pos[0]
    div.style.top = rectInfo.pos[1]
    div.addEventListener('click', function() {
      // 交互逻辑
      console.log(rectInfo.tipInfo)
    }, false)
    return div
  }
  canvas2Image () {
    let url = './images/sfd1205_0215.jpg'
    let imageObj = new Image()
    imageObj.src = url
    imageObj.onload = () => {
      this.doutuCtx.drawImage(imageObj, 0, 0, this.doutuCanvas.width, this.doutuCanvas.height)
      this.drawTipRect()
      this.rotateImage(90)
    }
  }
  drawTipRect (pos={}) {
    this.doutuCtx.save()
    this.doutuCtx.rect(100, 100, 50, 30)
    this.doutuCtx.stroke()
    this.doutuCtx.restore()
  }
  rotateImage (rotate=90) {
    this.testCtx.save()
    this.testCtx.translate(this.testCanvas.width / 2, this.testCanvas.height / 2)
    this.testCtx.rotate(rotate * Math.PI/180)
    this.testCtx.translate(-this.testCanvas.width / 2, -this.testCanvas.height / 2)
    this.testCtx.drawImage(this.doutuCanvas, this.testCanvas.width / 2 - this.doutuCanvas.width / 2, this.testCanvas.height / 2 - this.doutuCanvas.height / 2)
    // this.testCtx.translate(this.testCanvas.width / 2, this.testCanvas.height / 2)
    // this.testCtx.rotate(-rotate * Math.PI/180)
    // this.testCtx.translate(-this.testCanvas.width / 2, -this.testCanvas.height / 2)
    this.testCtx.restore()
  }
  updateImage (images) {
    if (Array.isArray(images)) {
      return this.imageUrls.concat(images)
    }
    return this.imageUrls.push(images)
  }
  getDoutuImage (index) {
    return this.imageUrls[index]
  }
  getImageData () {
    return this.testCanvas.toDataURL('image/png')
  }
}


onload = function() {
  let doutuImage = new DrBluePrint({containerClass: '.doutu-wrapper'})
  // doutuImage.updateImage('')
  doutuImage.canvas2Image()

  let getImageBtn = document.querySelector('.get-canvas-image')
  let canvasImg = document.getElementById('img-of-canvas')
  getImageBtn.onclick = () => {
    canvasImg.src = doutuImage.getImageData()
  }
}

let backup = {
  createTipMark (imgInfo, tipMark) {
    console.log(imgInfo,tipMark,imgInfo.image.tags)

    if (imgInfo.image.tags.length > 0) {
        // console.log('tags:', imgInfo.image.tags.length)
        // console.log(imgInfo.image.tags[0].rectangle)
    }
    if (imgInfo.image.tags.length === 0) return
    let W1 = imgInfo.image.width
    let H1 = imgInfo.image.height
    let W2, H2, ratio
    if (W1 < H1) {
        ratio = this.doutuWidth / W1
        W2 = this.doutuWidth
        H2 = ratio * H1
    } else {

    }
    tipMark.width(W2)
    tipMark.height(H2)
    let tips = imgInfo.image.tags.map(({rectangle}) => {
        let mark = $('<div></div>')
        $(mark).width(rectangle.width * ratio).height(rectangle.height * ratio)
            .css({
                position: 'absolute',
                border: '1px solid #f00',
                top: rectangle.y * ratio,
                left: rectangle.x * ratio,
            })
        return mark
    })
    tipMark.empty().append(tips)
  },
}