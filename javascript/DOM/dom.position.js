/**
 * 原生js获取一个dom元素距离页面可视区域的位置值
 */

let page = document.querySelector('.page')
page.getBoundingClientRect()
// DOMRect {x: 243, y: 106, width: 1293, height: 626, top: 106, …}
// 还有 right、bottom、left 这几个属性

$('.page').position()
// {top: 106, left: 243}