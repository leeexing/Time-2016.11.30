window.onload = function() {
  let body = document.body
  let cards = document.querySelector('.cards')
  document.querySelector('.start-cards').onclick = e => {
    let className = cards.classList
    if (!Array.from(className).includes('start')) {
      cards.classList.add('start')
    } else {
      cards.classList.remove('start')
    }
  }

  let changeBg = document.querySelector('.change-bg')
  let bgData = null
  let bgIndex = 0
  changeBg.onclick = _ => {
    if (bgData) {
      len = bgData.length
      bgIndex = bgIndex > len - 1 ? 0 : (bgIndex + 1)
      body.style.backgroundImage = formatImgUrl(bgData[bgIndex])
    } else {
      fetch('http://leeing.cn:5210/v1/api/home').then(res => res.json())
        .then(data => {
          bgData = data.data.bannerImgs
          let originUrl = window.getComputedStyle(body, false).backgroundImage.match(/"(.*)"/)[0]
          bgData.push(originUrl)
          body.style.backgroundImage = formatImgUrl(data.data.bannerImgs[0])
        })
    }
  }

  function formatImgUrl(url) {
    return `url(https://images.weserv.nl/?url=${url.replace('https://', '')})`
  }
}