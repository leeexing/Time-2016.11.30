/*
 * @lc app=leetcode.cn id=35 lang=javascript
 *
 * [35] 搜索插入位置
 *
 * https://leetcode-cn.com/problems/search-insert-position/description/
 *
 * algorithms
 * Easy (45.23%)
 * Likes:    446
 * Dislikes: 0
 * Total Accepted:    127.8K
 * Total Submissions: 282.3K
 * Testcase Example:  '[1,3,5,6]\n5'
 *
 * 给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。
 *
 * 你可以假设数组中无重复元素。
 *
 * 示例 1:
 *
 * 输入: [1,3,5,6], 5
 * 输出: 2
 *
 *
 * 示例 2:
 *
 * 输入: [1,3,5,6], 2
 * 输出: 1
 *
 *
 * 示例 3:
 *
 * 输入: [1,3,5,6], 7
 * 输出: 4
 *
 *
 * 示例 4:
 *
 * 输入: [1,3,5,6], 0
 * 输出: 0
 *
 *
 */

// @lc code=start
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var searchInsert = function(nums, target) {
  if (nums.length === 0 || nums[0] > target) return 0
  let index = nums.indexOf(target)
  if (index !== -1) {
    return index
  } else {
    let i = 0
    while (i < nums.length) {
      if (nums[i] < target && i === nums.length - 1) {
        return nums.length
      }
      if (nums[i] < target && nums[i+1] > target) {
        return i + 1
      }
      i++
    }
  }
};
// @lc code=end

// 备忘。学习二分法查找。也就是取一个中间值，相互比较进行

var searchInsert = function(nums, target) {
  let left = 0, right = nums.length - 1
  while (left <= right) {
    let mid = parseInt((left + right) / 2)
    if (nums[mid] === target) {
      return mid
    } else if (nums[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  return left
};


// solution 里面提供了两个 二分查找法的模板

/**

class Solution {
  public int searchInsert(int[] nums, int target) {
      int left = 0, right = nums.length - 1; // 注意
      while(left <= right) { // 注意
          int mid = (left + right) / 2; // 注意
          if(nums[mid] == target) { // 注意
              // 相关逻辑
          } else if(nums[mid] < target) {
              left = mid + 1; // 注意
          } else {
              right = mid - 1; // 注意
          }
      }
      // 相关返回值
      return 0;
  }
}

 */

/**

class Solution {
  public int searchInsert(int[] nums, int target) {
      int left = 0, right = nums.length; // 注意
      while(left < right) { // 注意
          int mid = (left + right) / 2; // 注意
          if(nums[mid] == target) {
              // 相关逻辑
          } else if(nums[mid] < target) {
              left = mid + 1; // 注意
          } else {
              right = mid; // 注意
          }
      }
      // 相关返回值
      return 0;
  }
}

 */
