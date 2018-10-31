$(() => {
  $('.start').click(() => {
    $('.wrap').addClass('run')
  })
  $('.wrap').on('webkitAnimationEnd', () => {
    // $('.img0').remove()
    $('.img0').siblings().addClass('animate run')
  })
})
class Track {
  constructor () {
    this.imgSrcs = [
      './images/1 (1).jpg',
      './images/1 (2).jpg',
      './images/1 (3).jpg',
      './images/1 (4).jpg',
      './images/1 (5).jpg',
    ]
    this.socketSrcs = [
      './images/1 (6).jpg',
      './images/1 (7).jpg',
      './images/1 (8).jpg',
      './images/1 (9).jpg',
      './images/1 (10).jpg',
    ]
  }
  init () {

  }
}