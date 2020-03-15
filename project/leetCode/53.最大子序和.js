/*
 * @lc app=leetcode.cn id=53 lang=javascript
 *
 * [53] 最大子序和
 *
 * https://leetcode-cn.com/problems/maximum-subarray/description/
 *
 * algorithms
 * Easy (49.55%)
 * Likes:    1703
 * Dislikes: 0
 * Total Accepted:    176.7K
 * Total Submissions: 356K
 * Testcase Example:  '[-2,1,-3,4,-1,2,1,-5,4]'
 *
 * 给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。
 *
 * 示例:
 *
 * 输入: [-2,1,-3,4,-1,2,1,-5,4],
 * 输出: 6
 * 解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
 *
 *
 * 进阶:
 *
 * 如果你已经实现复杂度为 O(n) 的解法，尝试使用更为精妙的分治法求解。
 *
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
  if (nums.length == 1) return nums
  let sum = 0
  let ret = nums[0]
  for (let i = 0; i < nums.length; i++) {
    if (sum > 0) { // 其实是这样：if(sum + num > num ){
      sum += nums[i]
    } else {
      sum = nums[i]
    }
    ret = Math.max(sum, ret)
  }
  return ret
};
// @lc code=end

/**
 * 备忘
 * 学习一下什么是动态规划，什么是分治法
*/
// Kadane算法扫描一次整个数列的所有数值，
// 在每一个扫描点计算以该点数值为结束点的子数列的最大和（正数和）。
// 该子数列由两部分组成：以前一个位置为结束点的最大子数列、该位置的数值。
// 因为该算法用到了“最佳子结构”（以每个位置为终点的最大子数列都是基于其前一位置的最大子数列计算得出,
// 该算法可看成动态规划的一个例子。
// 状态转移方程：sum[i] = max{sum[i-1]+a[i],a[i]}
// 其中(sum[i]记录以a[i]为子序列末端的最大序子列连续和)

function  maxSubArray2  ( nums ) {
  if (!nums.length) {
      return;
  };
  // 在每一个扫描点计算以该点数值为结束点的子数列的最大和（正数和）。
  let max_ending_here = nums[0];
  let max_so_far = nums[0];

  for (let i = 1; i < nums.length; i ++ ) {
      // 以每个位置为终点的最大子数列 都是基于其前一位置的最大子数列计算得出,

      max_ending_here = Math.max ( nums[i], max_ending_here + nums[i]);
      max_so_far = Math.max ( max_so_far, max_ending_here);
  };

  return max_so_far;
};
