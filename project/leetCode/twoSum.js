/**
 * 两数之和
*/

function twoSum (nums, target) {
    let arr = []
    for (let index=0, length=nums.length; index < length; index++) {
        let temp = target - nums[index]
        if (arr[temp] !== undefined) {
            return [arr[temp], index]
        }
        arr[nums[index]] = index
    }
}

const nums =  [2, 11, 15, 7]
const target = 9


let ret = twoSum(nums, target)
console.log('快速：', ret)

// 小结： 思路太新奇了。本来还以为会是两重循环呢

function twosum (nums, target) {
    let len = nums.length
    for (let i = 0; i < len; i++) {
        for (let j = i; j < len; j++) {
            if (nums[i] + nums[j] == target) {
                return [i, j]
            }
        }
    }
}

ret = twosum(nums, target)
console.log('慢速：', ret)

// 小结：这样的两层循环，时间复杂度就翻倍了啊