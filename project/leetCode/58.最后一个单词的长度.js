/*
 * @lc app=leetcode.cn id=58 lang=javascript
 *
 * [58] 最后一个单词的长度
 *
 * https://leetcode-cn.com/problems/length-of-last-word/description/
 *
 * algorithms
 * Easy (32.61%)
 * Likes:    180
 * Dislikes: 0
 * Total Accepted:    74.4K
 * Total Submissions: 227.6K
 * Testcase Example:  '"Hello World"'
 *
 * 给定一个仅包含大小写字母和空格 ' ' 的字符串 s，返回其最后一个单词的长度。如果字符串从左向右滚动显示，那么最后一个单词就是最后出现的单词。
 *
 * 如果不存在最后一个单词，请返回 0 。
 *
 * 说明：一个单词是指仅由字母组成、不包含任何空格字符的 最大子字符串。
 *
 *
 *
 * 示例:
 *
 * 输入: "Hello World"
 * 输出: 5
 *
 *
 */

// @lc code=start
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLastWord = function(s) {
  let end = s.length - 1
  while (end >= 0 && s.charAt(end) == ' ') {
    end --
  }
  if (end < 0) return 0
  let start = end
  while (start >= 0 && s.charAt(start) != ' ') {
    start--
  }
  return end - start
};
// @lc code=end

/**
 * 备忘
*/

var lengthOfLastWord = function(s) {
  if (s.length == 0) return 0
  let arr = s.trim().split(' ')
  return arr[arr.length - 1].length
};
// 59/59 cases passed (60 ms)
// Your runtime beats 82.64 % of javascript submissions
// Your memory usage beats 70.55 % of javascript submissions (33.7 MB)

var lengthOfLastWord = function(s) {
  let arr = s.trim().split(' ')
  return arr[arr.length - 1].length
};
// 59/59 cases passed (56 ms)
// Your runtime beats 93.75 % of javascript submissions
// Your memory usage beats 59.44 % of javascript submissions (33.8 MB)

var lengthOfLastWord = function(s) {
  let ret = s.trim()
  if (ret.length == 0) return 0
  return ret.match(/\w+$/)[0].length
};
// 59/59 cases passed (76 ms)
// Your runtime beats 14.93 % of javascript submissions
// Your memory usage beats 68.25 % of javascript submissions (33.8 MB)

// -人家这里是在认真的学习算法思维，不用现有的方法。使用逻辑去判断
var lengthOfLastWord = function(s) {
  let end = s.length - 1
  while (end >= 0 && s.charAt(end) == ' ') {
    end --
  }
  if (end < 0) return 0
  let start = end
  while (start >= 0 && s.charAt(start) != ' ') {
    start--
  }
  return end - start
};

// 59/59 cases passed (64 ms)
// Your runtime beats 64.9 % of javascript submissions
// Your memory usage beats 70.55 % of javascript submissions (33.7 MB)