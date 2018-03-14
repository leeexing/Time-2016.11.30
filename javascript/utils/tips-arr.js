/**
 * JS
 * 一些小技巧
 */

 // 1、数组扁平化 【巧妙使用 concat.apply】
 var arr = [1, 2, [3, 4], 5]
 [].concat.apply([], arr) // [1, 2, 3, 4, 5]