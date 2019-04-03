/**
 * inter-util
*/

class LazyLoad {
  constructor (el) {
    this.imgList = Array.from(document.querySelector(el))
    this.init()
  }
  init () {
    this.canILoad()
    this.bindEvent()
  }
  bindEvent () {
    window.addEventListener('scroll', () => {
      this.canILoad()
    })
  }
  canILoad () {
    this.imgList.forEach((item, index) => {
      this.getBound(item) && this.loadImage(item, index)
    })
  }
  getBound (el) {
    let bound = el.getBoundingClientRect(el)
    let clientHeight = window.innerHeight
    return bound.top <= clientHeight - 100 // -100是为了看到效果，可以去掉
  }
  loadImage (el, index) {
    let src = el.getAttribute('data-origin')
    el.src = src
    this.imgList.splice(index, 1)
    this.checkImage(el)
  }
  checkImage (el) {
    el.onload = () => {
      el.className = 'origin'
    }
  }
}

const lazy = new LazyLoad('.lazy')