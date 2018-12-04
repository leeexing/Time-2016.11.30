$(() => {
  let scale = 1
  let delta = 0
  let $view = $('.view')
  let mx = 0
  let my = 0
  $('.wrap').mousedown(function(e) {
    e.preventDefault()
    e.stopPropagation()
  })
  
  $('.wrap').on('mousemove', function(e){
    e.preventDefault()
    e.stopPropagation()
    mx = e.offsetX
    my = e.offsetY
  })

  $('.wrap').on('mousewheel', function(e) {
    e.preventDefault()
    e.stopPropagation()
    let _scale = scale
    scale += e.originalEvent.wheelDelta > 0 ? 0.1 : -0.1
    scale = scale < 1 ? 1 : scale

    let marT = parseFloat( $view.css('margin-top').replace('px', '') )
    let marL = parseFloat( $view.css('margin-left').replace('px', '') )

    // $view.css('margin-left', 0)
    // $view.css('margin-top', 0)

    let ox =  $view.offset().left
    let oy = $view.offset().top

    mx = e.offsetX
    my = e.offsetY

    let marT_ = marT + 600 * (_scale - scale) * (0.5 - mx / 600 * scale)
    let marL_ = marT + 400 * (_scale - scale) * (0.5 - my / 400 * scale)

    console.log(
      mx,
      // mx / 600,
      ox, 
    )

    $view.css('width', 600 * scale)
    $view.css('height', 400 * scale)

    $view.css('margin-left', marT_ +  'px')
    $view.css('margin-top', marL_ + 'px')
  })

})