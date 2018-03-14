/**
 * 如何使用 formdata
 * 
 */

/* 
let formData = new FormData()
// formData主要有两个方法set，append
formData.set('a', 5) // 把a的键值设置为5
formData.append('b', 5) // 把b的兼职设置为5

// 那set和append区别？？
formData.set('a', 5)
formData.set('a', 6) // 把a的键值设置为6   {a: 6}
formData.append('b', 5)
formData.append('b', 6) // 把b的键值[5, 6]  {b: [5, 6]} */


// Form的enctype属性

// enctype这个属性管理的是表单的MIME编码，它一共有三个属性：
// application/x-www-form-urlencoded
// 在发送前编码所有字符（默认）


// multipart/form-data
// 不对字符编码，用来制定传输数据的特殊类型，如mp3、jpg


// text/plain
// 纯文本传输