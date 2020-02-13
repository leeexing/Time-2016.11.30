/**
 * 将图像转换成base64
 * 需要在浏览器中执行
 */
function getBase64Image(img, width, height) {
  var canvas = document.createElement("canvas");
  canvas.width = width ? width : img.width;
  canvas.height = height ? height : img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  var dataURL = canvas.toDataURL();
  return dataURL;
}

function getCanvasBase64(img) {
  return new Promise((resolve, reject) => {
    var image = new Image();
    //至关重要
    image.crossOrigin = '';
    image.src = img;
    //至关重要
    image.onload = function () {
      resolve(getBase64Image(image))
    }
  })
}
getCanvasBase64('')
  .then(base64 => {
    console.log("方式二》》》》》》》》》", base64);
  }).catch(console.log)