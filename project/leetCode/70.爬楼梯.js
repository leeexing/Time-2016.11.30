/*
 * @lc app=leetcode.cn id=70 lang=javascript
 *
 * [70] 爬楼梯
 *
 * https://leetcode-cn.com/problems/climbing-stairs/description/
 *
 * algorithms
 * Easy (48.03%)
 * Likes:    879
 * Dislikes: 0
 * Total Accepted:    151.6K
 * Total Submissions: 315.4K
 * Testcase Example:  '2'
 *
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
 *
 * 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 *
 * 注意：给定 n 是一个正整数。
 *
 * 示例 1：
 *
 * 输入： 2
 * 输出： 2
 * 解释： 有两种方法可以爬到楼顶。
 * 1.  1 阶 + 1 阶
 * 2.  2 阶
 *
 * 示例 2：
 *
 * 输入： 3
 * 输出： 3
 * 解释： 有三种方法可以爬到楼顶。
 * 1.  1 阶 + 1 阶 + 1 阶
 * 2.  1 阶 + 2 阶
 * 3.  2 阶 + 1 阶
 *
 *
 */

// @lc code=start
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
  if (n <= 2) return n
  let a = 1
  let b = 2
  let temp = 0
  for (let i = 3; i <= n; i++) {
    temp = a + b
    a = b
    b = temp
  }
  return temp
};
// @lc code=end

// -效率不高。起码是实现自己的逻辑了
function factorial (num) {
  if (num < 0) {
      return -1;
  } else if (num === 0 || num === 1) {
      return 1;
  } else {
      return (num * factorial(num - 1));
  }
}
var climbStairs = function(n) {
  let maxTwo = Math.floor(n / 2)
  let minOne = n % 2
  let ret = 0
  for (let i = 0; i <= maxTwo; i++) {
    if (i == 0) {
      ret += 1
    } else if (i == maxTwo && minOne == 0) {
      ret += 1
    } else {
      let oneCount = n - i * 2
      let count = i + oneCount
      ret += factorial(count) / (factorial(count - i) * factorial(i))
    }
  }
  return ret
}
// 45/45 cases passed (68 ms)
// Your runtime beats 35.5 % of javascript submissions
// Your memory usage beats 22.09 % of javascript submissions (34.2 MB)