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
      containerClass: '',
      strokeColor: '#f00'
    }
    this.options = Object.assign(defaultOpts, options)
    this.container = document.querySelector(this.options.containerClass)
    this.imageUrls = []
    this.imageDatas = []
    this.width = this.container.offsetWidth
    this.height = 500 || this.container.offsetHeight
    this.index = 0
    this.init()
    this.attachEvent()
  }
  // -使用canvas
  init () {
    this.containerCanvas = document.getElementById('canvas')
    this.containerCanvas.width = this.width
    this.containerCanvas.height = this.height
    this.containerCanvas.context = this.containerCanvas.getContext('2d')

    // 上册canvas
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
  attachEvent () {
    var sliceMouseTrackPosition = {
      x: -100000,
      y: -100000,
      startX: -100000,
      startY: -100000
    };
    this.isLeftMouseDown = false
    this.isRightMouseDown = false
    this.overlappedCanvas.addEventListener('mousedown', (e) => {
      if (e.which == 1) {
        this.isLeftMouseDown = true
      } else if (e.which == 2) {
        this.overlappedCanvas.context.clearRect(
          0,
          0,
          this.overlappedCanvas.width,
          this.overlappedCanvas.height
        )
        var boundingBox = this.overlappedCanvas.getBoundingClientRect();
        var offsetX = boundingBox.left;
        var offsetY = boundingBox.top;
        var clientPos = this.getClientPos(e);
        var relativeX = clientPos[0] - offsetX;
        var relativeY = clientPos[1] - offsetY;
        // -保存当前鼠标点
        sliceMouseTrackPosition.startX = relativeX;
        sliceMouseTrackPosition.startY = relativeY;
        // -碰撞检测
        this.overlappedCanvas.checkBox = { minX: 10000, minY: 10000, maxX: -10000, maxY: -10000 };
        if (this.overlappedCanvas.checkBox.minX > relativeX) this.overlappedCanvas.checkBox.minX = relativeX;
        if (this.overlappedCanvas.checkBox.maxX < relativeX) this.overlappedCanvas.checkBox.maxX = relativeX;
        if (this.overlappedCanvas.checkBox.minY > relativeY) this.overlappedCanvas.checkBox.minY = relativeY;
        if (this.overlappedCanvas.checkBox.maxY < relativeY) this.overlappedCanvas.checkBox.maxY = relativeY;
      }
    }, false)

    this.overlappedCanvas.addEventListener('mousemove', (e) => {
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

      if (e.which == 2) {
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

    this.overlappedCanvas.addEventListener('mouseup', (e) => {
      if (e.which == 2) {
        this.isLeftMouseDown = false
      }
    }, false)

    // -下层canas
    this.containerCanvas.addEventListener('mousedown', e => {
      var clientPos = this.getClientPos(e)
      if (me.which == 1) {
			  this.containerCanvas.leftDown = true;
			  // -鼠标中键：目前好像是没有任何的功能的
      }
      this.Container.startMouseDownPos = this.getPagePos(e); // +[e.pageX, e.pageY];
			e.preventDefault();
			e.returnValue = false;
    }, false)
    this.containerCanvas.addEventListener('mousemove', e => {
      if (this.containerCanvas.leftDown) {
				var pagePos = this.getPagePos(me);
				var realMoveX = (pagePos[0] - this.containerCanvas.startMouseDownPos[0]) / this.renderer.domElement.width;
				var realMoveY = (pagePos[1] - this.containerCanvas.startMouseDownPos[1]) / this.renderer.domElement.height;

				if (Math.abs(realMoveX) + Math.abs(realMoveY) < 0.01) return;

				this.ScaleOne = this.ScaleOne || 0.5;

				var offsetX = -realMoveX * this.moveStep * (2.0 * this.ScaleOne);
				var offsetY = realMoveY * this.moveStep * (2.0 * this.ScaleOne);
				var rect = [
					this.processRect[0],
					this.processRect[1],
					this.processRect[2],
					this.processRect[3]
				];
				rect[0] += offsetX;
				rect[1] += offsetY;
				rect[2] += offsetX;
				rect[3] += offsetY;

				// -update render display
				this.drPass.uniforms["processRect"].value = rect;
				this.refreshDisplay();

				// me.preventDefault && me.preventDefault();
				// me.returnValue = false;

			}
    }, false)
    this.containerCanvas.addEventListener('mouseup', e => {

    }, false)
  }
  loadImageTexture (url='./images/sfd1205_0215.jpg') {
    let imageObj = new Image()
    imageObj.src = url
    imageObj.onload = () => {
      this.containerCanvas.context.drawImage(imageObj, 0, 0, this.containerCanvas.width, this.containerCanvas.height)
      this.drawTipRect()
    }
  }
  drawTipRect (pos={}) {
    this.overlappedCanvas.context.save()
    this.overlappedCanvas.context.rect(100, 100, 50, 30)
    this.overlappedCanvas.context.stroke()
    this.overlappedCanvas.context.restore()
  }
  getClientPos (e) {
		var clientX = 0,
		  clientY = 0;
		if (this.IsMobile) {
		  clientX = e.touches[0].clientX;
		  clientY = e.touches[0].clientY;
		} else {
		  clientX = e.clientX;
		  clientY = e.clientY;
		}
		return [clientX, clientY];
  }
  getPagePos (e) {
	  var pageX = 0,
	    pageY = 0;
	  if (Module3D.IsMobile) {
	    pageX = e.touches[0].pageX;
	    pageY = e.touches[0].pageY;
	  } else {
	    pageX = e.pageX;
	    pageY = e.pageY;
	  }
	  return [pageX, pageY];
	}
  getDoutuImage (index) {
    return this.imageUrls[index]
  }
  getImageData () {
    return this.testCanvas.toDataURL('image/png')
  }
}


$(() => {
  let doutuImage = new MarkTipOfDoutuImage({containerClass: '.canvas'})
  doutuImage.loadImageTexture()
})
