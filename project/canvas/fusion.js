/**
 * 抖图：图像tip位置标记
 * author： leeing
 * time： 2018-12-19 08:59
 */
class MarkTipOfDoutuImage {
  constructor (options) {
    let defaultOpts = {
      mode: 'image', // or canvas
      cacheMemory: true,
      cacheCount: 100,
      containerClass: ''
    }
    this.options = Object.assign(defaultOpts, options)
    this.container = document.querySelector(this.options.containerClass)
    this.imageUrls = []
    this.imageDatas = []
    this.width = 500
    this.height = 600
    this.index = 0
    this.init()
  }
  init () {
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'doutu'
    this.container.appendChild(this.canvas)
    this.doutuCtx = this.canvas.getContext('2d')
    
  }
  canvas2Image () {

  }
  getDoutuImage (index) {
    return this.imageUrls[index]
  }
}


onload = function() {
  console.log(78)
  let ops = {
    mask_zoom: 0.3
  }
  let package = document.getElementById('package')
  let packageCtx = package.getContext('2d')
  let imgPackage = document.querySelector('.package')
  package.width = imgPackage.naturalWidth * 0.5
  package.height = imgPackage.naturalHeight * 0.5
  // packageCtx.drawImage(imgPackage, 0, 0, imgPackage.naturalWidth * 0.5, imgPackage.naturalHeight * 0.5)
  
  let tip = document.getElementById('tip')
  let tipCtx = tip.getContext('2d')
  let imgTip = document.querySelector('.tip')
  tip.width = imgTip.naturalWidth * ops.mask_zoom
  tip.height = imgTip.naturalHeight * ops.mask_zoom
  tipCtx.drawImage(imgTip, 0, 0, imgTip.naturalWidth * ops.mask_zoom , imgTip.naturalHeight * ops.mask_zoom)
  let tipData = tipCtx.getImageData(0, 0, tip.width, tip.height)
  let data = tipData.data
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i],
        g = data[i + 1],
        b = data[i + 2]
    if ([r,g,b].every(v => v < 256 && v > 245)) {
    // if (r <= 30 && g <= 30 && b<= 30) { // -黑色变为透明色
      data[i + 3] = 0
    }
  }
  tipData.data = data
  tipCtx.putImageData(tipData, 0, 0)

  
  // packageCtx.drawImage(tip, 0, 0, imgPackage.naturalWidth * 0.5, imgPackage.naturalHeight * 0.5)
  packageCtx.drawImage(tip, 100, 150, imgTip.naturalWidth * ops.mask_zoom , imgTip.naturalHeight * ops.mask_zoom)
  // packageCtx.globalCompositeOperation = 'lighter'
  packageCtx.globalCompositeOperation = 'destination-over'
  packageCtx.drawImage(imgPackage, 0, 0, imgPackage.naturalWidth * 0.5, imgPackage.naturalHeight * 0.5)

  document.querySelector('.test').onclick = () => {
    console.log(9999)
  }
}