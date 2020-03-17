/*
 * @lc app=leetcode.cn id=67 lang=javascript
 *
 * [67] 二进制求和
 *
 * https://leetcode-cn.com/problems/add-binary/description/
 *
 * algorithms
 * Easy (52.18%)
 * Likes:    322
 * Dislikes: 0
 * Total Accepted:    68.6K
 * Total Submissions: 131.3K
 * Testcase Example:  '"11"\n"1"'
 *
 * 给定两个二进制字符串，返回他们的和（用二进制表示）。
 *
 * 输入为非空字符串且只包含数字 1 和 0。
 *
 * 示例 1:
 *
 * 输入: a = "11", b = "1"
 * 输出: "100"
 *
 * 示例 2:
 *
 * 输入: a = "1010", b = "1011"
 * 输出: "10101"
 *
 */

// @lc code=start
/**
 * @param {string} a
 * @param {string} b
 * @return {string}
 */
var addBinary = function(a, b) {
  let ret = []
  let temp = 0
  for (let i = a.length - 1, j = b.length - 1; i >= 0 || j >= 0; i--, j--) {
    let sum = temp
    sum += i >= 0 ? parseInt(a[i]) : 0
    sum += j >= 0 ? parseInt(b[j]) : 0
    ret.push(sum % 2)
    temp = sum >= 2 ? 1 : 0
  }
  ret.push(temp == 1 ? temp : '')
  return ret.reverse().join('')
};
// @lc code=end

/**
 * 备忘
*/

// 又遇到js中的整数溢出问题
var addBinary = function(a, b) {
  let ab = parseInt(a, 2)
  let bb = parseInt(b, 2)
  return (ab + bb).toString(2)
};


var addBinary = function(a, b) {
  if (a == '0' && b == '0') return '0'
  let len = Math.max(a.length, b.length)
  if (a.length < len) {
    a = Array.from({length: len - a.length}, _ => '0').join('') + a
  } else {
    b = Array.from({length: len - b.length}, _ => '0').join('') + b
  }
  let aArr = a.split('').map(Number)
  let bArr = b.split('').map(Number)
  let temp = 0
  for (let i = len - 1; i >= 0; i--) {
    if ((aArr[i] + bArr[i] + temp) >= 2) {
      aArr[i] = (aArr[i] + bArr[i] + temp) % 2
      temp = 1
    } else {
      aArr[i] += (bArr[i] + temp)
      temp = 0
    }
  }
  if (temp == 1) {
    return '1' + aArr.join('')
  }
  return aArr.join('')
};
// 294/294 cases passed (84 ms)
// Your runtime beats 29.8 % of javascript submissions
// Your memory usage beats 87.16 % of javascript submissions (35.3 MB)


// -这个挺简洁的啊
var addBinary = function(a, b) {
  let ret = ''
  let temp = 0
  for (let i = a.length - 1, j = b.length - 1; i >= 0 || j >= 0; i--, j--) {
    let sum = temp
    sum += i >= 0 ? parseInt(a[i]) : 0
    sum += j >= 0 ? parseInt(b[j]) : 0
    ret += sum % 2
    temp = Math.floor(sum / 2)
  }
  ret += temp == 1 ? temp : ''
  return ret.split('').reverse().join('')
};
// 294/294 cases passed (68 ms)
// Your runtime beats 88.52 % of javascript submissions
// Your memory usage beats 49.73 % of javascript submissions (35.9 MB)


// -这样的居然就慢了
var addBinary = function(a, b) {
  let ret = []
  let temp = 0
  for (let i = a.length - 1, j = b.length - 1; i >= 0 || j >= 0; i--, j--) {
    let sum = temp
    sum += i >= 0 ? parseInt(a[i]) : 0
    sum += j >= 0 ? parseInt(b[j]) : 0
    ret.push(sum % 2)
    temp = sum >= 2 ? 1 : 0
  }
  ret.push(temp == 1 ? temp : '')
  return ret.reverse().join('')
};
// 294/294 cases passed (84 ms)
// Your runtime beats 29.68 % of javascript submissions
// Your memory usage beats 75.27 % of javascript submissions (35.5 MB)
