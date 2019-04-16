/**
 * 图像tip位置标记
 * author： leeing
 * time： 2018-12-19 08:59
 */
class DrBluePrint {
  constructor (options) {
    let defaultOpts = {
      mode: 'image', // or canvas
      cacheMemory: true,
      cacheCount: 100,
      containerClass: '.dr-wrap',
      strokeColor: '#f00'
    }
    this.options = Object.assign(defaultOpts, options)
    this.container = document.querySelector(this.options.containerClass)
    this.imageUrls = []
    this.imageDatas = []
    this.containerW = this.container.offsetWidth
    this.containerH = this.container.offsetHeight
    this.oWidth = this.width = this.container.offsetWidth
    this.oHeight = this.height = this.container.offsetHeight
    this.scale = 1
    this.zoomOfImage = 1
    this.dx = 0
    this.dy = 0
    this.index = 0
    this.init()
    this.attachEvent()
  }
  // -使用canvas
  init () {
    // - 0-1代表图片上的端点
    this.processRect = [0, 0, 1, 1]

    // -处理鼠标事件只能有一次响应
    this.addedContainerListeners = {}
    this.addedOverlapCanvasLIsteners = {}

    this.isMobile = this.mobileAndTabletcheck()
    this.mobileSelectMode = false // -手机端没有鼠标中键的概念，需要切换模式

    this.userSelectRegion = null
    this.userMarkedRectangles = []

    this.containerCanvas = document.getElementById('drcanvas')
    this.containerCanvas.width = this.width
    this.containerCanvas.height = this.height
    this.containerCanvas.context = this.containerCanvas.getContext('2d')

    // 上层canvas
    this.overlappedCanvas = document.createElement("canvas");
    this.overlappedCanvas.width = this.width;
    this.overlappedCanvas.height = this.height;
    this.container.appendChild(this.overlappedCanvas);
    this.container.style.position = "relative";

    this.overlappedCanvas.style.position = "absolute";
    this.overlappedCanvas.style.left = 0;
    this.overlappedCanvas.style.top = 0;
    this.overlappedCanvas.context = this.overlappedCanvas.getContext('2d');
  }
  // 向容器中添加事件:下层canvas，主要用于图像、嫌疑框、Tip 图像的渲染
  addContainerListenerIfNone (eventType, fun) {
    if (this.addedContainerListeners[eventType]) return
    this.addedContainerListeners[eventType] = fun

    if (this.Container != undefined) {
      this.Container.addEventListener(eventType, fun)
    } else {
      throw "容器尚未设置: " + eventType
    }
  }
  // -向重叠的canvas添加事件
  addOverlapListenerIfNone (eventType, fun) {
    if (this.addedOverlapCanvasLIsteners[eventType]) return
    this.addedOverlapCanvasLIsteners[eventType] = fun
    if (this.overlappedCanvas != undefined) {
      this.overlappedCanvas.addEventListener(eventType, fun)
    } else {
      throw "容器尚未设置: " + eventType
    }
  }
  // 获取鼠标或者手指touch触碰的位置 @e: mouseevnet,touchevent
	getClientPos (e) {
		let clientX = this.isMobile ? e.touches[0].clientX : e.clientX
		let clientY = this.isMobile ? e.touches[0].clientY : e.clientY
		return [clientX, clientY]
  }
  // 获取鼠标在页面上的位置
	getPagePos (e) {
	  let pageX = this.isMobile ? e.touches[0].pageX : e.pageX
    let pageY = this.isMobile ? e.touches[0].pageY : e.pageY
	  return [pageX, pageY]
  }
  setMobileSelectMode (value) {
    this.mobileSelectMode = value
  }
  // 获取鼠标在PC或者Mobile端的事件名
	getMouseOrTouchEventName (eventname) {
	  var eventnamePc = []
	  var eventnameMobile = []

	  eventnamePc["mousedown"] = "mousedown"
	  eventnamePc["mousemove"] = "mousemove"
		eventnamePc["mouseup"] = "mouseup"
		eventnamePc["mouseout"] = "mouseout"
		eventnamePc['mousewheel'] = window.document.mozFullScreen == undefined ? 'mousewheel' : 'DOMMouseScroll'

	  eventnamePc["touchstart"] = "touchstart"
	  eventnamePc["touchmove"] = "touchmove"
	  eventnamePc["touchend"] = "touchend"

	  eventnameMobile["mousedown"] = "touchstart"
	  eventnameMobile["mousemove"] = "touchmove"
		eventnameMobile["mouseup"] = "touchend"
		eventnameMobile['mousewheel'] = window.document.mozFullScreen == undefined ? 'mousewheel' : 'DOMMouseScroll'

    return this.isMobile ? eventnameMobile[eventname] : eventnamePc[eventname]
	}
  attachEvent () {
    var sliceMouseTrackPosition = {
      x: -100000,
      y: -100000,
      startX: -100000,
      startY: -100000
    }
    this.isLeftMouseDown = false
    this.isRightMouseDown = false

    // *==========================【分割线·上】====================================

    this.overlappedCanvas.addEventListener(this.getMouseOrTouchEventName('mousedown'), e => {
      e.preventDefault()
      e.returnValue = false
      if (this.isMobile && !this.mobileSelectMode) return

      if (e.which == 1) {
        this.isLeftMouseDown = true
      } else if (e.which == 2 || (this.isMobile && this.mobileSelectMode)) {
        this.isMiddleBtn = true
        this.overlappedCanvas.context.clearRect(
          0,
          0,
          this.overlappedCanvas.width,
          this.overlappedCanvas.height
        )
        let boundingBox = this.overlappedCanvas.getBoundingClientRect();
        let offsetX = boundingBox.left;
        let offsetY = boundingBox.top;
        let clientPos = this.getClientPos(e);
        let relativeX = clientPos[0] - offsetX;
        let relativeY = clientPos[1] - offsetY;
        // -保存当前鼠标点
        sliceMouseTrackPosition.startX = relativeX;
        sliceMouseTrackPosition.startY = relativeY;

        // -碰撞检测
        this.overlappedCanvas.checkBox = { minX: 10000, minY: 10000, maxX: -10000, maxY: -10000 }

        if (this.overlappedCanvas.checkBox.minX > relativeX) this.overlappedCanvas.checkBox.minX = relativeX;
        if (this.overlappedCanvas.checkBox.maxX < relativeX) this.overlappedCanvas.checkBox.maxX = relativeX;
        if (this.overlappedCanvas.checkBox.minY > relativeY) this.overlappedCanvas.checkBox.minY = relativeY;
        if (this.overlappedCanvas.checkBox.maxY < relativeY) this.overlappedCanvas.checkBox.maxY = relativeY;
      }
    }, false)

    this.overlappedCanvas.addEventListener(this.getMouseOrTouchEventName('mousemove'), e => {
      if (this.isMobile && !this.mobileSelectMode) return // 上层只有来标记框，除此之外，不做任何操作
      // this.overlappedCanvas.context.clearRect(
      //   0,
      //   0,
      //   this.overlappedCanvas.width,
      //   this.overlappedCanvas.height
      // );
      var boundingBox = this.overlappedCanvas.getBoundingClientRect();
      var offsetX = boundingBox.left;
      var offsetY = boundingBox.top;

      var clientPos = this.getClientPos(e);
      var relativeX = clientPos[0] - offsetX;
      var relativeY = clientPos[1] - offsetY;
      sliceMouseTrackPosition.x = relativeX;
      sliceMouseTrackPosition.y = relativeY;

      if (e.which == 2 || this.isMiddleBtn || this.isMobile) {
        this.overlappedCanvas.context.clearRect(
          0,
          0,
          this.overlappedCanvas.width,
          this.overlappedCanvas.height
        );
        // this.drawUserMarkedRectangles();

        this.overlappedCanvas.context.strokeStyle = '#ff0000';
        this.overlappedCanvas.context.lineWidth = 1;
        this.overlappedCanvas.context.beginPath();
        this.overlappedCanvas.context.moveTo(sliceMouseTrackPosition.startX, sliceMouseTrackPosition.startY);
        this.overlappedCanvas.context.lineTo(sliceMouseTrackPosition.startX, sliceMouseTrackPosition.y);
        this.overlappedCanvas.context.lineTo(sliceMouseTrackPosition.x, sliceMouseTrackPosition.y);
        this.overlappedCanvas.context.lineTo(sliceMouseTrackPosition.x, sliceMouseTrackPosition.startY);
        this.overlappedCanvas.context.lineTo(sliceMouseTrackPosition.startX, sliceMouseTrackPosition.startY);
        this.overlappedCanvas.context.stroke();

        if (this.overlappedCanvas.checkBox.minX > relativeX) this.overlappedCanvas.checkBox.minX = relativeX;
        if (this.overlappedCanvas.checkBox.maxX < relativeX) this.overlappedCanvas.checkBox.maxX = relativeX;
        if (this.overlappedCanvas.checkBox.minY > relativeY) this.overlappedCanvas.checkBox.minY = relativeY;
        if (this.overlappedCanvas.checkBox.maxY < relativeY) this.overlappedCanvas.checkBox.maxY = relativeY;

      } else if (this.enableMouseMoveDensity && this.mouseMoveCallback != undefined) {
        var pixelInfo = this.getPixelData(relativeX, relativeY);
        this.mouseMoveCallback(pixelInfo);
      }
    }, false)

    this.overlappedCanvas.addEventListener(this.getMouseOrTouchEventName('mouseup'), e => {

      if (e.which == 2 || this.isMiddleBtn || (this.isMobile && this.mobileSelectMode)) {
        this.isMiddleBtn = false
        this.isLeftMouseDown = false
        // console.log(sliceMouseTrackPosition)
        let selectRegion = {
          left: this.overlappedCanvas.checkBox.minX,
          top: this.overlappedCanvas.checkBox.minY,
          right: this.overlappedCanvas.checkBox.maxX,
          bottom: this.overlappedCanvas.checkBox.maxY
        };
        this.userSelectRegion = this.toImageCoordinateNum(
          selectRegion.left,
          selectRegion.top,
          selectRegion.right,
          selectRegion.bottom
        )
        console.log(this.userSelectRegion)
        this.userMarkedRectangles.push([...this.userSelectRegion])
        this.drawUserMarkedRectangles()
        this.middleMouseSelectCallback && this.middleMouseSelectCallback()
      }
    }, false)

    // *==========================【分割线·下】====================================

    // !下层canas
    this.container.addEventListener(this.getMouseOrTouchEventName('mousedown'), event => {
      // let clientPos = this.getClientPos(event)
      if (event.which == 1 || (this.isMobile && !this.mobileSelectMode)) {
        this.isLeftMouseDown = true
        this.initDx = this.dx
        this.initDy = this.dy
      }
      this.container.startMouseDownPos = this.getPagePos(event) // +[e.pageX, e.pageY];
			event.preventDefault()
			event.returnValue = false
    }, false)

    this.container.addEventListener(this.getMouseOrTouchEventName('mousemove'), event => {
      if (this.isLeftMouseDown) {
        let [offsetX, offsetY] = this.getPagePos(event) // +[e.pageX, e.pageY];
				let realMoveX = offsetX - this.container.startMouseDownPos[0]
        let realMoveY = offsetY - this.container.startMouseDownPos[1]

        this.dx = this.initDx + realMoveX
        this.dy = this.initDy + realMoveY

        this.loadImageTexture()
        this.drawUserMarkedRectangles()

			}
    }, false)

    this.container.addEventListener(this.getMouseOrTouchEventName('mouseup'), event => {
      if (this.isLeftMouseDown) {

      }
      if (this.isRightMouseDown) {

      }
      this.isLeftMouseDown = false
      this.isRightMouseDown = false
    }, false)

    this.container.addEventListener(this.getMouseOrTouchEventName('mouseout'), event => {
      if (this.isLeftMouseDown) {

      }
      this.isLeftMouseDown = false
      this.isRightMouseDown = false
    }, false)
    this.container.addEventListener(this.getMouseOrTouchEventName('mousewheel'), event => {
      event.preventDefault &&	event.preventDefault()
      event.returnValue = false
      let delta = 0
			if (!event) {
				event = window.event
			}
			if (event.wheelDelta) {
				delta = event.wheelDelta / 120
			} else if (event.detail) {
				delta = -event.detail / 3
      }
      if (delta) {
        let scaleRatio = 1.0
				if (delta > 0) {
          scaleRatio = 1.05
				} else {
          scaleRatio = 0.9
        }
        this.scale *= scaleRatio
        // -获取之前鼠标点在图像中的相对位置
        let {offsetX, offsetY} = event
        let relateX = (offsetX - this.dx) / this.width
        let relateY = (offsetY - this.dy) / this.height

        let dx = relateX * (scaleRatio - 1) * this.width
        let dy = relateY * (scaleRatio - 1) * this.height
        this.dx -= dx
        this.dy -= dy
        this.width = this.oWidth * this.scale
        this.height = this.oHeight * this.scale
        this.loadImageTexture()
        this.drawUserMarkedRectangles()
      }
    }, false)
  }
  show (url='./images/sfd1205_0215.jpg') {
    let imageObj = new Image()
    imageObj.src = url
    imageObj.onload = () => {
      this.calculatePos(imageObj)
      this.renderData = imageObj
      this.loadImageTexture()
      this.drawTipRect()
    }
  }
  loadImageTexture () {
    this.containerCanvas.context.clearRect(0, 0, this.containerW, this.containerH)
    this.containerCanvas.context.drawImage(this.renderData, this.dx, this.dy, this.width, this.height)
  }
  drawUserMarkedRectangles () {
    this.overlappedCanvas.context.clearRect(0, 0, this.containerW, this.containerH)
    this.overlappedCanvas.context.strokeStyle = '#ff0000';
    this.overlappedCanvas.context.lineWidth = 1;
    this.userMarkedRectangles.forEach(item => {
      let startX = item[0] * this.width + this.dx
      let startY = item[1] * this.height + this.dy
      let endX = item[2] * this.width + this.dx
      let endY = item[3] * this.height + this.dy
      this.overlappedCanvas.context.beginPath();
      this.overlappedCanvas.context.moveTo(startX, startY);
      this.overlappedCanvas.context.lineTo(startX, endY);
      this.overlappedCanvas.context.lineTo(endX, endY);
      this.overlappedCanvas.context.lineTo(endX, startY);
      this.overlappedCanvas.context.lineTo(startX, startY);
      this.overlappedCanvas.context.stroke();
    })

    // let {offsetX, offsetY} = event
    // let relateX = (offsetX - this.dx) / this.width
    // let relateY = (offsetY - this.dy) / this.height

    // let dx = relateX * (scaleRatio - 1) * this.width
    // let dy = relateY * (scaleRatio - 1) * this.height
    // this.dx -= dx
    // this.dy -= dy
    // this.width = this.oWidth * this.scale
    // this.height = this.oHeight * this.scale
  }
  drawTipRect (pos={}) {
    this.overlappedCanvas.context.save()
    this.overlappedCanvas.context.rect(100, 100, 50, 30)
    this.overlappedCanvas.context.stroke()
    this.overlappedCanvas.context.restore()
  }
  getDoutuImage (index) {
    return this.imageUrls[index]
  }
  getImageData () {
    return this.testCanvas.toDataURL('image/png')
  }
  toImageCoordinateNum (pt1x, pt1y, pt2x, pt2y) {
    let relateX1 = (pt1x - this.dx) / this.width
    let relateY1 = (pt1y - this.dy) / this.height
    let relateX2 = (pt2x - this.dx) / this.width
    let relateY2 = (pt2y - this.dy) / this.height
    return [relateX1, relateY1, relateX2, relateY2]
  }
  calculatePos (imgInfo) {
    let W1 = this.containerW
    let H1 = this.containerH
    let W2 = imgInfo.width
    let H2 = imgInfo.height
    let ratioW = W2 / W1
    let ratioH = H2 / H1
    let ratioWR = W2 / H1
    let ratioHR = H2 / W1
    let zoom
    let retW
    let retH

    console.log(W1, H1)
    console.log(W2, H2)

    // 竖着的矩形
    // 分两种情况：图像宽高大于/小于容器
    // if (W2 < H2) {
    //   console.log(ratioW, ratioH)
    //   zoom = Math.max(ratioW, ratioH)
    // } else {
    //   console.log('需要旋转：', ratioWR, ratioHR)
    //   zoom = Math.max(ratioWR, ratioHR)
    // }
    zoom = Math.max(ratioW, ratioH)
    retW = Math.ceil(W2 / zoom)
    retH = Math.ceil(H2 / zoom)
    console.log(`缩放系数：${zoom}`)
    console.log(`宽：${retW}, 高：${retH}`)
    this.oWidth = this.width = retW
    this.oHeight = this.height = retH
    this.dx = Math.floor((W1 - retW) / 2)
    this.dy = Math.floor((H1 - retH) / 2)
  }
  mobileAndTabletcheck () {
    var check = false
    !(function (a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|event(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
        check = true
      }
    })(navigator.userAgent||navigator.vendor||window.opera)
    return check
  }
}


$(() => {
  let doutuImage = new DrBluePrint()
  doutuImage.show()

  $('.mark').click(() => {
    doutuImage.setMobileSelectMode(!doutuImage.mobileSelectMode)
  })
})
