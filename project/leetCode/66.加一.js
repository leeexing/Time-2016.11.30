/*
 * @lc app=leetcode.cn id=66 lang=javascript
 *
 * [66] 加一
 *
 * https://leetcode-cn.com/problems/plus-one/description/
 *
 * algorithms
 * Easy (43.28%)
 * Likes:    440
 * Dislikes: 0
 * Total Accepted:    129.2K
 * Total Submissions: 297.3K
 * Testcase Example:  '[1,2,3]'
 *
 * 给定一个由整数组成的非空数组所表示的非负整数，在该数的基础上加一。
 *
 * 最高位数字存放在数组的首位， 数组中每个元素只存储单个数字。
 *
 * 你可以假设除了整数 0 之外，这个整数不会以零开头。
 *
 * 示例 1:
 *
 * 输入: [1,2,3]
 * 输出: [1,2,4]
 * 解释: 输入数组表示数字 123。
 *
 *
 * 示例 2:
 *
 * 输入: [4,3,2,1]
 * 输出: [4,3,2,2]
 * 解释: 输入数组表示数字 4321。
 *
 *
 */

// @lc code=start
/**
 * @param {number[]} digits
 * @return {number[]}
 */
var plusOne = function(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    digits[i]++
    digits[i] = digits[i] % 10
    if (digits[i] !== 0) return digits
  }
  return [1, ...digits] // !(96 ms) 这个操作比较耗时。还不如 unshift
};
// @lc code=end

/**
 * 备忘
*/
var plusOne = function(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    digits[i]++
    digits[i] = digits[i] % 10
    if (digits[i] !== 0) return digits
  }
  digits.unshift(1)
  return digits
};

// 109/109 cases passed (60 ms)
// Your runtime beats 88.3 % of javascript submissions
// Your memory usage beats 59.1 % of javascript submissions (33.8 MB)

var plusOne = function(digits) {
  let len = digits.length
  for (let i = len - 1; i >= 0; i--) {
    if (digits[i] == 9) {
      digits[i] = 0
    } else {
      digits[i] += 1
      break
    }
  }
  if (digits[0] == 0) {
    digits.unshift(1)
  }
  return digits
};
// 109/109 cases passed (64 ms)
// Your runtime beats 73.14 % of javascript submissions
// Your memory usage beats 52.08 % of javascript submissions (33.9 MB)

var plusOne = function(digits) {
  let len = digits.length
  for (let i = len - 1; i >= 0; i--) {
    if (digits[i] + 1 == 10) {
      digits[i] = 0
      if (i == 0) {
        digits.unshift(1)
        return digits
      }
    } else {
      digits[i] += 1
      return digits
    }
  }
};

// 109/109 cases passed (72 ms)
// Your runtime beats 30.36 % of javascript submissions
// Your memory usage beats 71.23 % of javascript submissions (33.7 MB)

var plusOne = function(digits) {
  let len = digits.length
  if (digits.every(item => item == 9)) {
    return [1].concat(Array.from({length: len}, () => 0))
  } else {
    for (let i = len - 1; i < len; i--) {
      if (digits[i] + 1 == 10) {
        digits[i] = 0
      } else {
        digits[i] += 1
        return digits
      }
    }
  }
};

// 这个好失败啊
// 109/109 cases passed (96 ms)
// Your runtime beats 6.12 % of javascript submissions
// Your memory usage beats 64.33 % of javascript submissions (33.8 MB)