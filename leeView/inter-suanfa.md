---
title: inter-arithmetic
tag: suanfa
---

## 基本算法思维

### 动态规划

REFER: [漫画动态规划](https://juejin.im/post/5a29d52cf265da43333e4da7)

动态规划是（dynamic Programming）是一种分阶段求解决策问题的数学思想
总结一句话就是：大事化小，小事化了

**动态规划中最重要的三个概念**：
1.最优子结构
2.边界
3.状态转移公式

### 备忘录算法

> 暂存计算结果的方式

## 找出层级关系

## 很简洁的一个写法

> 给定一个整数无序数组和变量 sum，如果存在数组中任意两项和使等于 sum 的值，则返回true。否则,返回false。例如，数组[3,5,1,4]和 sum = 9，函数应该返回true，因为4 + 5 = 9。

```js
const findSum = (arr, sum) =>
  arr.some((set => n => set.has(n) || !set.add(sum - n))(new Set));
```

```js
const findSum = (arr, val) => {
  let searchValues = new Set();
  searchValues.add(val - arr[0]);
  for (let i = 1, length = arr.length; i < length; i++) {
    let searchVal = val - arr[i];
    if (searchValues.has(arr[i])) {
      return true;
    } else {
      searchValues.add(searchVal);
    }
  };
  return false;
};
```
