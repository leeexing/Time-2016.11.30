/**
 * 计算图像位置
 */

function calculatePos(imgInfo) {
  let W1 = 350
  let H1 = 660
  let W2 = imgInfo.width
  let H2 = imgInfo.height
  let ratioW = W2 / W1
  let ratioH = H2 / H1
  let ratioWR = W2 / H1
  let ratioHR = H2 / W1
  let zoom
  let retW
  let retH

  // 竖着的矩形
  // 分两种情况：图像宽高大于/小于容器
  if (W2 < H2) {
    console.log(ratioW, ratioH)
    zoom = Math.max(ratioW, ratioH)
  } else {
    console.log(ratioWR, ratioHR)
    zoom = Math.max(ratioWR, ratioHR)
  }
  retW = W2 / zoom
  retH = H2 / zoom
  console.log(`缩放系数：${zoom}`)
  console.log(`宽：${retW}, 高：${retH}`)
}

let data1 = {width: 200, height: 500}
let data2 = {width: 300, height: 800}
let data3 = {width: 400, height: 800}
let data4 = {width: 400, height: 1000}
let data5 = {width: 500, height: 800}

let data6 = {width: 500, height: 200}
let data7 = {width: 800, height: 300}
let data8 = {width: 800, height: 400}

calculatePos(data3)