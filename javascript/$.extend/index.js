$(() => {
  $('.success').click(() => {
    console.log($('.header').color('#fa541c'))
  })
  $('.primary').click(() => {
    $.trimr()
    console.log($.trimr('  leeing    '))
  })
})