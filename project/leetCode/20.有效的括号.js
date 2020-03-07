/*
 * @lc app=leetcode.cn id=20 lang=javascript
 *
 * [20] 有效的括号
 *
 * https://leetcode-cn.com/problems/valid-parentheses/description/
 *
 * algorithms
 * Easy (41.05%)
 * Likes:    1420
 * Dislikes: 0
 * Total Accepted:    218.5K
 * Total Submissions: 532.4K
 * Testcase Example:  '"()"'
 *
 * 给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串，判断字符串是否有效。
 *
 * 有效字符串需满足：
 *
 *
 * 左括号必须用相同类型的右括号闭合。
 * 左括号必须以正确的顺序闭合。
 *
 *
 * 注意空字符串可被认为是有效字符串。
 *
 * 示例 1:
 *
 * 输入: "()"
 * 输出: true
 *
 *
 * 示例 2:
 *
 * 输入: "()[]{}"
 * 输出: true
 *
 *
 * 示例 3:
 *
 * 输入: "(]"
 * 输出: false
 *
 *
 * 示例 4:
 *
 * 输入: "([)]"
 * 输出: false
 *
 *
 * 示例 5:
 *
 * 输入: "{[]}"
 * 输出: true
 *
 */

// @lc code=start
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {

};
// @lc code=end



// 版本一太耗时间了
var version1 = function(s) {
  let obj = '() {} []'
  if (s.length === 0) return true
  if (s.length < 2 || s.length % 2 !== 0) return false
  if (s.length === 2) {
    return obj.indexOf(s[0]) + 1 === obj.indexOf(s[1])
  }
  let ret = false
  let data = []
  let arr = s.split('')
  for (let i = 0; i < arr.length; i++) {
    if (obj.indexOf(arr[i]) + 1 === obj.indexOf(arr[i + 1])) {
      i += 1
      ret = true
    } else {
      data.push(arr[i])
    }
  }
  if (ret) {
    if (data.length === 0) {
      return true
    } else {
      return isValid(data.join(''))
    }
  }
  return false
};
