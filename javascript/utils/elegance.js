/**
 * 一些让人惊艳的代码书写
 * 
 * 1、模板的使用
 */

// 1、 题目：编写一个函数，它接受一个由10个整数组成的数组（0到9之间的数组），该函数以形似(123) 456-7890的电话号码的形式返回这些数字的字符串。
//  createPhoneNumber([1, 2, 3, 4, 5, 6, 7, 8, 9, 0])
function createPhoneNumber(num_arr) {
  let format = '(xxx) xxx-xxxx' // 绝对惊艳到自己的眼球
  num_arr.forEach(item => {
    format.replace('x', item)
  })
  return format
}

function generatePhoneNumber(num_arr) {
  let template = '(xxx) xxx-xxxx'
  return template.replace(/x/g, m => num_arr.shift())
}

// 2、题目：给定一个数组，找到出现奇数次的数字。
// findOdd([1,1,2,-2,5,2,4,4,-1,-2,5]); // => returns -1
function findOdd(arr) {
  return arr.reduce((p, c) => p ^ c)
}

// 3、题目：您可能知道Facebook或者其他网站的“喜欢”系统。人们可以“喜欢”博客文章，图片或其他项目。我们想要创建一份显示在这样项目旁边的文本。
// likes [] // must be "no one likes this"
// likes ["Peter"] // must be "Peter likes this"
// likes ["Jacob", "Alex"] // must be "Jacob and Alex like this"
// likes ["Max", "John", "Mark"] // must be "Max, John and Mark like this"
// likes ["Alex", "Jacob", "Mark", "Max"] // must be "Alex, Jacob and 2 others like this"

// 太经典了
function likes(names) {
  let templates = [
    'no one likes this',
    '{name} likes this',
    '{name} and {name} like this',
    '{name}, {name} and {name} like this',
    '{name}, {name} and {n} others like this'
  ]

  let index = Math.min(names.length, 4)
  return templates[index].replace(/{name}|{n}/g, (matched, placeholder) => {
    return matched === '{name}' ? names.shift() : names.length
  })
}