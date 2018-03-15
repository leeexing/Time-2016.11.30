let mainElem = document.querySelector('.main')

let demos = document.querySelectorAll('.btn')
demos.forEach(demo => {
  demo.onclick = e => {
    let className = e.target.getAttribute('data-class')
    console.log(className)
    mainElem.classList = `main pad10 ${className}`
  }
})