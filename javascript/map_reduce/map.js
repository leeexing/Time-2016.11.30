/**
 * 实战应用
 */

//! 1、将数组中的 VIP 用户余额加 10
const users = [
  { username: "Kelly", isVIP: true, balance: 20 },
  { username: "Tom", isVIP: false, balance: 19 },
  { username: "Stephanie", isVIP: true, balance: 30 }
]
let usersMap = users.map(
  user => (user.isVIP ? {...user, balance: user.balance + 10} : user)
)
// 点评：合理利用对象结构

//! 2、判断字符串中是否含有元音字母
const randomStr = "hdjrwqpleeing"

const isVowel = char => ['a', 'e', 'i', 'o', 'u'].includes(char)
const containsVowel = str => [...str].some(isVowel)

let randomStrMap = containsVowel(randomStr)
// 点评：又是字符串解构，又是简单的高阶函数，还有简单的组合
