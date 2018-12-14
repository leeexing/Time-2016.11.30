$(() => {

  class ImageZoom {
    constructor (options) {
      this.init()
    }
    init () {
      this.attachElement()
      this.attachEvent()
    }
    attachElement () {
      this.container = $('.wrap')
      this.view = $('.view')
      this.ismouseDown = false
      this.top = 0
      this.left = 0
      this.originTop = this.container.offset().top
      this.originLeft = this.container.offset().left
      this.width = this.view.width()
      this.height = this.view.height()
      this.marl = 0 // margin-left
      this.mart = 0 // margin-top
      this.zoom = 1
    }
    attachEvent () {
      this.container.on('mousedown', e => {
        e.preventDefault()
        this.ismouseDown = true
        this.x0 = e.clientX
        this.y0 = e.clientY
      })
      this.container.on('mousemove', e => {
        e.preventDefault()
        this.offsetX = e.offsetX
        this.offsetY = e.offsetY
        if (!this.ismouseDown) return
        this.mx = 0
        this.my = 0
        this.mx = e.clientX - this.x0
        this.my = e.clientY - this.y0
        this.view.css('top',  this.top + this.my + 'px')
        this.view.css('left', this.left + this.mx + 'px')
      })
      this.container.on('mouseup mouseleave', e => {
        e.preventDefault()
        if (this.ismouseDown) {
          this.top += this.my
          this.left += this.mx
          this.view.css('top',  this.top + 'px')
          this.view.css('left', this.left + 'px')
        }
        this.ismouseDown = false
      })
      this.container.on('mousewheel', e => {
        e.preventDefault()
        let zoom = e.originalEvent.deltaY > 0 ? -0.01 : 0.01
        this.zoom += zoom
        this.zoom = +this.zoom.toFixed(2)
        let width = this.width * this.zoom
        let height = this.height * this.zoom
        this.view.width(width)
        this.view.height(height)

        let offsetX = e.offsetX
        let offsetY = e.offsetY
        console.log(offsetX, offsetY)
        console.log(this.offsetX, ' - ', this.offsetY)

        let zoomVal = (this.zoom - 1) > 0 ? (this.zoom - 1) : -0.01
        this.marl = +(-zoomVal * this.offsetX).toFixed(2)
        this.mart = +(-zoomVal * this.offsetY).toFixed(2)
        console.log(this.marl, ' + ', this.mart)

        // this.view.css('top',  this.zoomTop + 'px')
        // this.view.css('left', this.zoomLeft + 'px')
        
        this.view.css('margin-left', this.marl)
        this.view.css('margin-top', this.mart)
      })
    }
  }

  new ImageZoom()
})