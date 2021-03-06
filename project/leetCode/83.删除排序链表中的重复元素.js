/*
 * @lc app=leetcode.cn id=83 lang=javascript
 *
 * [83] 删除排序链表中的重复元素
 *
 * https://leetcode-cn.com/problems/remove-duplicates-from-sorted-list/description/
 *
 * algorithms
 * Easy (49.28%)
 * Likes:    273
 * Dislikes: 0
 * Total Accepted:    82.3K
 * Total Submissions: 166K
 * Testcase Example:  '[1,1,2]'
 *
 * 给定一个排序链表，删除所有重复的元素，使得每个元素只出现一次。
 *
 * 示例 1:
 *
 * 输入: 1->1->2
 * 输出: 1->2
 *
 *
 * 示例 2:
 *
 * 输入: 1->1->2->3->3
 * 输出: 1->2->3
 *
 */

// @lc code=start
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
  if (head == null || head.next == null) return head
  // while (head.next) {
  //   console.log(head, head.next)
  //   let nextNode = head.next
  //   if (head.value == nextNode.value) {
  //     head.next = nextNode.next
  //   } else {
  //     head.next = nextNode
  //   }
  // }
  head.next = deleteDuplicates(head.next)
  if (head.val == head.next.val) head = head.next
  return head
};
// @lc code=end

// 备忘
// 递归大法好
var deleteDuplicates = function(head) {
  if (head == null || head.next == null) return head
  // while (head.next) {
  //   console.log(head, head.next)
  //   let nextNode = head.next
  //   if (head.value == nextNode.value) {
  //     head.next = nextNode.next
  //   } else {
  //     head.next = nextNode
  //   }
  // }
  head.next = deleteDuplicates(head.next)
  if (head.val == head.next.val) head = head.next
  return head
};
// 165/165 cases passed (76 ms)
// Your runtime beats 77.84 % of javascript submissions
// Your memory usage beats 100 % of javascript submissions (35.2 MB)
