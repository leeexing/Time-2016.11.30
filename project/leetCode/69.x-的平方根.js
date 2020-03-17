/*
 * @lc app=leetcode.cn id=69 lang=javascript
 *
 * [69] x 的平方根
 *
 * https://leetcode-cn.com/problems/sqrtx/description/
 *
 * algorithms
 * Easy (37.60%)
 * Likes:    327
 * Dislikes: 0
 * Total Accepted:    104.5K
 * Total Submissions: 278K
 * Testcase Example:  '4'
 *
 * 实现 int sqrt(int x) 函数。
 *
 * 计算并返回 x 的平方根，其中 x 是非负整数。
 *
 * 由于返回类型是整数，结果只保留整数的部分，小数部分将被舍去。
 *
 * 示例 1:
 *
 * 输入: 4
 * 输出: 2
 *
 *
 * 示例 2:
 *
 * 输入: 8
 * 输出: 2
 * 说明: 8 的平方根是 2.82842...,
 * 由于返回类型是整数，小数部分将被舍去。
 *
 *
 */

// @lc code=start
/**
 * @param {number} x
 * @return {number}
 */
var mySqrt = function(x) {
  let i = 1
  while (i * i <= x) {
    if (i * i <= 0) break
    i++
  }
  return --i
};
// @lc code=end

/**
 * 备忘
 * 这是考牛顿迭代法
 */

// -这是来搞笑的把
var mySqrt = function(x) {
  return parseInt(Math.sqrt(x))
};
// 1017/1017 cases passed (76 ms)
// Your runtime beats 93.33 % of javascript submissions
// Your memory usage beats 85.31 % of javascript submissions (35.5 MB)

// -这算是入门了
var mySqrt = function(x) {
  let i = 1
  while (i * i <= x) {
    if (i * i <= 0) break
    i++
  }
  return --i
};
// 1017/1017 cases passed (108 ms)
// Your runtime beats 28.68 % of javascript submissions
// Your memory usage beats 83.67 % of javascript submissions (35.5 MB)


